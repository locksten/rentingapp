import { nodeResolveId, nodeIsTypeOf, idSort } from "common"
import { AppContext } from "context"
import { db, dc } from "database"
import { Listing, QListing } from "listing/listing"
import { Pool } from "pg"
import { QRenting } from "renting/renting"
import { Report } from "report/report"
import { schemaBuilder } from "schemaBuilder"
import { User } from "user/user"
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
    updatedAt: t.field({
      type: "String",
      resolve: ({ updatedAt }) => db.toDate(updatedAt).toISOString(),
    }),
    listing: t.field({
      type: Listing,
      resolve: async ({ id }, _args, context) =>
        getFeedbackListingId({ feedbackId: id, context }),
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

export const getFeedbackListingId = async ({
  feedbackId,
  context: { pool },
}: {
  feedbackId: number
  context: AppContext
}) =>
  (await db.selectOne("Renting", { ownerFeedbackId: feedbackId }).run(pool))
    ?.listingId ??
  (await db.selectOne("Renting", { renterFeedbackId: feedbackId }).run(pool))
    ?.listingId

schemaBuilder.objectFields(Feedback, (t) => ({
  reports: t.field({
    type: [Report],
    resolve: ({ id }, _args, { pool }) =>
      db.select("Report", { feedbackId: id }).run(pool),
  }),
}))

export const getFeedbacksReceivedAsOwner = (
  ownerId: string,
  pool: Pool | TxnClientForSerializable,
) =>
  db.sql<QListing.SQL | QRenting.SQL | QFeedback.SQL, Feedback[]>`
        SELECT ${"Feedback"}.*
        FROM ${"Renting"}
        JOIN ${"Feedback"} ON ${"Renting"}.${"renterFeedbackId"} = ${"Feedback"}.${"id"}
        WHERE ${{ ownerId }} AND ${{ isRemoved: false }}`.run(pool)

export const getFeedbacksReceivedAsRenter = (
  renterId: string,
  pool: Pool | TxnClientForSerializable,
) =>
  db.sql<QListing.SQL | QRenting.SQL | QFeedback.SQL, Feedback[]>`
        SELECT ${"Feedback"}.*
        FROM ${"Renting"}
        JOIN ${"Feedback"} ON ${"Renting"}.${"ownerFeedbackId"} = ${"Feedback"}.${"id"}
        WHERE ${{ renterId }} AND ${{ isRemoved: false }}`.run(pool)

export const feedbackAvergeRating = (feedbacks: Feedback[]) => {
  const ratings = feedbacks.map(({ rating }) => rating)
  if (!ratings.length) return undefined
  return ratings.reduce((total, rating) => total + rating, 0) / ratings.length
}

export const average = (numbers: number[]) => {
  if (!numbers.length) return undefined
  return numbers.reduce((total, rating) => total + rating, 0) / numbers.length
}

export const leaveFeedback = async ({
  rentingId,
  rating,
  text,
  context: { auth, pool },
}: {
  rentingId: number
  rating: number
  text?: string | null
  context: AppContext
}) => {
  if (rating < 1 || rating > 5) return
  return await db.serializable(pool, async (txn) => {
    const feedback = await db
      .insert("Feedback", {
        rating,
        text,
      })
      .run(txn)
    const renting = await db.selectOne("Renting", { id: rentingId }).run(txn)
    if (!renting) return
    const update: QRenting.Updatable | undefined =
      auth?.id === renting.renterId
        ? { renterFeedbackId: feedback.id }
        : auth?.id === renting.ownerId
        ? { ownerFeedbackId: feedback.id }
        : undefined
    if (!update) return
    await db.update("Renting", update, { id: rentingId }).run(txn)
    return feedback
  })
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
    resolve: async (_root, { input: { rentingId, rating, text } }, context) =>
      leaveFeedback({ rentingId: Number(rentingId.id), context, rating, text }),
  }),
}))

export const removeFeedback = async ({
  id,
  context: { pool },
}: {
  id: number
  context: AppContext
}) => {
  await db.update("Feedback", removedFeedbackProperties, { id }).run(pool)
  return db.selectOne("Feedback", { id }).run(pool)
}

const RemoveFeedbackInput = schemaBuilder.inputType("RemoveFeedbackInput", {
  fields: (t) => ({
    feedbackId: t.globalID({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  removeFeedback: t.authField({
    authScopes: { admin: true },
    type: Feedback,
    args: {
      input: t.arg({ type: RemoveFeedbackInput, required: true }),
    },
    resolve: async (_root, { input: { feedbackId } }, context) =>
      removeFeedback({ id: Number(feedbackId.id), context }),
  }),
}))

const removedFeedbackProperties = {
  isRemoved: true,
  text: "(Removed Feedback)",
  rating: 0,
}

export const getUserRatingCount = async ({
  id,
  context: { pool },
}: {
  id: string
  context: AppContext
}) =>
  (await getFeedbacksReceivedAsOwner(id, pool)).length +
  (await getFeedbacksReceivedAsRenter(id, pool)).length

export const getUserRating = async ({
  id,
  context: { pool },
}: {
  id: string
  context: AppContext
}) =>
  feedbackAvergeRating([
    ...(await getFeedbacksReceivedAsOwner(id, pool)),
    ...(await getFeedbacksReceivedAsRenter(id, pool)),
  ])
