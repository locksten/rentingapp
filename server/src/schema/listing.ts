import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { eachDayOfInterval, formatISO } from "date-fns"
import { Feedback, feedbackAvergeRating, QFeedback } from "schema/feedback"
import { QRenting, Renting } from "schema/renting"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
import { Listing as QListing } from "zapatos/schema"

export { Listing as QListing } from "zapatos/schema"
export type Listing = QListing.JSONSelectable

export const ListingRef = schemaBuilder.objectRef<Listing>("Listing")

export const Listing = schemaBuilder.loadableNode(ListingRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(ListingRef),
  ...idSort,
  load: (ids: number[], { pool }) =>
    db.select("Listing", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    title: t.exposeString("title"),
    description: t.exposeString("description"),
    imageUrl: t.exposeString("imageUrl"),
    dayPriceEuroCents: t.exposeInt("dayPriceEuroCents"),
    depositEuroCents: t.exposeInt("depositEuroCents"),
    latitude: t.exposeFloat("latitude"),
    longitude: t.exposeFloat("longitude"),
    updatedAt: t.field({
      type: "String",
      resolve: ({ updatedAt }) => db.toDate(updatedAt).toISOString(),
    }),
    unavailableDays: t.field({
      type: ["String"],
      resolve: async ({ id }, _args, { pool }) => {
        const rentings = await db
          .select("Renting", {
            listingId: id,
            rentingStatus: dc.isIn(["PaymentPending", "ReturnPending"]),
          })
          .run(pool)
        return [
          ...new Set(
            rentings
              .flatMap(({ scheduledStartTime, scheduledEndTime }) =>
                eachDayOfInterval({
                  start: db.toDate(scheduledStartTime),
                  end: db.toDate(scheduledEndTime),
                }),
              )
              .map((d) => formatISO(d, { representation: "date" })),
          ),
        ]
      },
    }),
    owner: t.field({
      type: User,
      resolve: ({ ownerId }) => ownerId,
    }),
  }),
})

schemaBuilder.objectFields(Listing, (t) => ({
  rentings: t.field({
    type: [Renting],
    resolve: ({ id }, _args, { pool }) =>
      db.select("Renting", { listingId: id }).run(pool),
  }),
}))

schemaBuilder.objectFields(Listing, (t) => ({
  rating: t.float({
    resolve: async ({ id: listingId }, _args, { pool }) => {
      const feedbacks = await db.sql<
        QListing.SQL | QRenting.SQL | QFeedback.SQL,
        Feedback[]
      >`
      SELECT ${"Feedback"}.*
      FROM ${"Renting"}
      JOIN ${"Feedback"} ON ${"Renting"}.${"renterFeedbackId"} = ${"Feedback"}.${"id"}
      WHERE ${{ listingId }}`.run(pool)
      return feedbackAvergeRating(feedbacks)
    },
  }),
}))

schemaBuilder.objectFields(Listing, (t) => ({
  feedback: t.connection({
    type: Feedback,
    resolve: async ({ id: listingId }, args, { pool }) => {
      const feedbacks = await db.sql<
        QListing.SQL | QRenting.SQL | QFeedback.SQL,
        Feedback[]
      >`
      SELECT ${"Feedback"}.*
      FROM ${"Renting"}
      JOIN ${"Feedback"} ON ${"Renting"}.${"renterFeedbackId"} = ${"Feedback"}.${"id"}
      WHERE ${{ listingId }}`.run(pool)
      return resolveArrayConnection({ args }, feedbacks)
    },
  }),
}))

schemaBuilder.queryFields((t) => ({
  listings: t.connection({
    type: Listing,
    resolve: async (_parent, args, { pool }) => {
      return resolveArrayConnection(
        { args },
        await db.select("Listing", db.all).run(pool),
      )
    },
  }),
}))

const ListingInput = schemaBuilder.inputType("ListingInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string({ required: true }),
    imageUrl: t.string({ required: true }),
    dayPriceEuroCents: t.int({ required: true }),
    depositEuroCents: t.int({ required: false }),
    latitude: t.float({ required: true }),
    longitude: t.float({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  createListing: t.authField({
    authScopes: { user: true },
    type: Listing,
    args: {
      input: t.arg({ type: ListingInput, required: true }),
    },
    resolve: async (
      _root,
      {
        input: {
          title,
          description,
          imageUrl,
          dayPriceEuroCents,
          depositEuroCents,
          latitude,
          longitude,
        },
      },
      { pool, auth },
    ) =>
      await db
        .insert("Listing", {
          title,
          description,
          ownerId: auth.id,
          imageUrl,
          dayPriceEuroCents,
          depositEuroCents,
          latitude: Number(latitude.toFixed(2)),
          longitude: Number(longitude.toFixed(2)),
        })
        .run(pool),
  }),
}))
