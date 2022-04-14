import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { Pool } from "pg"
import { Listing, QListing } from "schema/listing"
import { QRenting } from "schema/renting"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
import { TxnClientForSerializable } from "zapatos/db"
import { Feedback as QFeedback } from "zapatos/schema"

export { Feedback as QFeedback } from "zapatos/schema"
export type Feedback = QFeedback.JSONSelectable

export const FeedbackRef = schemaBuilder.objectRef<Feedback>("Feedback")

export const Feedback = schemaBuilder.loadableNode(FeedbackRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(FeedbackRef),
  ...idSort,
  load: (ids: number[], { pool }) =>
    db.select("Feedback", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    text: t.exposeString("text"),
    rating: t.exposeInt("rating"),
    createdAt: t.field({
      type: "String",
      resolve: ({ createdAt }) => db.toDate(createdAt).toISOString(),
    }),
    listing: t.field({
      type: Listing,
      resolve: async ({ id }, _args, { pool }) =>
        (await db.selectOne("Renting", { ownerFeedbackId: id }).run(pool))
          ?.listingId ??
        (await db.selectOne("Renting", { renterFeedbackId: id }).run(pool))
          ?.listingId,
    }),
    owner: t.field({
      type: User,
      resolve: async ({ id }, _args, { pool }) =>
        (await db.selectOne("Renting", { ownerFeedbackId: id }).run(pool))
          ?.ownerId,
    }),
    renter: t.field({
      type: User,
      resolve: async ({ id }, _args, { pool }) =>
        (await db.selectOne("Renting", { renterFeedbackId: id }).run(pool))
          ?.renterId,
    }),
  }),
})

export const getFeedbacksReceivedAsOwner = (
  ownerId: string,
  pool: Pool | TxnClientForSerializable,
) =>
  db.sql<QListing.SQL | QRenting.SQL | QFeedback.SQL, Feedback[]>`
        SELECT ${"Feedback"}.*
        FROM ${"Renting"}
        JOIN ${"Feedback"} ON ${"Renting"}.${"renterFeedbackId"} = ${"Feedback"}.${"id"}
        WHERE ${{ ownerId }}`.run(pool)

export const getFeedbacksReceivedAsRenter = (
  renterId: string,
  pool: Pool | TxnClientForSerializable,
) =>
  db.sql<QListing.SQL | QRenting.SQL | QFeedback.SQL, Feedback[]>`
        SELECT ${"Feedback"}.*
        FROM ${"Renting"}
        JOIN ${"Feedback"} ON ${"Renting"}.${"ownerFeedbackId"} = ${"Feedback"}.${"id"}
        WHERE ${{ renterId }}`.run(pool)

export const feedbackAvergeRating = (feedbacks: Feedback[]) => {
  const ratings = feedbacks.map(({ rating }) => rating)
  if (!ratings.length) return 0
  return ratings.reduce((total, rating) => total + rating, 0) / ratings.length
}

const LeaveFeedbackInput = schemaBuilder.inputType("LeaveFeedbackInput", {
  fields: (t) => ({
    rentingId: t.globalID({ required: true }),
    rating: t.int({ required: true }),
    text: t.string(),
  }),
})

schemaBuilder.mutationFields((t) => ({
  leaveFeedback: t.authField({
    authScopes: { user: true },
    type: Feedback,
    args: {
      input: t.arg({ type: LeaveFeedbackInput, required: true }),
    },
    resolve: async (
      _root,
      { input: { rentingId, rating, text } },
      { pool, auth },
    ) => {
      return await db.serializable(pool, async (txn) => {
        const feedback = await db
          .insert("Feedback", {
            rating,
            text,
          })
          .run(txn)
        const renting = await db
          .selectOne("Renting", { id: Number(rentingId.id) })
          .run(txn)
        if (!renting) return
        const update: QRenting.Updatable | undefined =
          auth.id === renting.renterId
            ? { renterFeedbackId: feedback.id }
            : auth.id === renting.ownerId
            ? { ownerFeedbackId: feedback.id }
            : undefined
        if (!update) return
        await db
          .update("Renting", update, { id: Number(rentingId.id) })
          .run(txn)
        return feedback
      })
    },
  }),
}))
