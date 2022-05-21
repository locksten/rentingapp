import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { eachDayOfInterval, formatISO } from "date-fns"
import { Feedback, feedbackAvergeRating, QFeedback } from "schema/feedback"
import { QRenting, Renting } from "schema/renting"
import { Report } from "schema/report"
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
    category: t.exposeString("category"),
    latitude: t.exposeFloat("latitude"),
    longitude: t.exposeFloat("longitude"),
    createdAt: t.field({
      type: "String",
      resolve: ({ createdAt }) => db.toDate(createdAt).toISOString(),
    }),
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
  reports: t.field({
    type: [Report],
    resolve: ({ id }, _args, { pool }) =>
      db.select("Report", { listingId: id }).run(pool),
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
      WHERE ${{ listingId }} AND ${"Feedback"}.${"isRemoved"} = False`.run(pool)
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
      WHERE ${{ listingId }} AND ${"Feedback"}.${"isRemoved"} = False`.run(pool)
      return resolveArrayConnection({ args }, feedbacks)
    },
  }),
}))

schemaBuilder.queryFields((t) => ({
  listings: t.connection({
    type: Listing,
    args: {
      ...t.arg.connectionArgs(),
      fromPriceEuroCents: t.arg({ type: "Int" }),
      toPriceEuroCents: t.arg({ type: "Int" }),
      searchTerm: t.arg({ type: "String" }),
      category: t.arg({ type: "String" }),
      latitudeMin: t.arg({ type: "Float" }),
      latitudeMax: t.arg({ type: "Float" }),
      longitudeMin: t.arg({ type: "Float" }),
      longitudeMax: t.arg({ type: "Float" }),
    },
    resolve: async (_parent, args, { pool }) => {
      return resolveArrayConnection(
        { args },
        await db
          .select(
            "Listing",
            {
              isRemoved: false,
              dayPriceEuroCents: dc.and(
                dc.gte(args.fromPriceEuroCents ?? 0),
                dc.lte(args.toPriceEuroCents ?? 999999),
              ),
              ...(args.searchTerm
                ? { fullText: dc.ilike(`%${args.searchTerm}%`) }
                : undefined),
              ...(args.category && args.category !== "All Categories"
                ? { category: dc.eq(`${args.category}`) }
                : undefined),
              ...(args.latitudeMin !== null &&
              args.latitudeMin !== undefined &&
              args.latitudeMax !== null &&
              args.latitudeMax !== undefined &&
              args.longitudeMin !== null &&
              args.longitudeMin !== undefined &&
              args.longitudeMax !== null &&
              args.longitudeMax !== undefined
                ? {
                    latitude: dc.and(
                      dc.gte(args.latitudeMin),
                      dc.lte(args.latitudeMax),
                    ),
                    longitude: dc.and(
                      dc.gte(args.longitudeMin),
                      dc.lte(args.longitudeMax),
                    ),
                  }
                : undefined),
            },
            {
              order: { by: "updatedAt", direction: "DESC" },
            },
          )
          .run(pool),
      )
    },
  }),
}))

const ListingInput = schemaBuilder.inputType("ListingInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string({ required: true }),
    category: t.string({ required: true }),
    imageUrl: t.string({ required: true }),
    dayPriceEuroCents: t.int({ required: true }),
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
          category,
          imageUrl,
          dayPriceEuroCents,
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
          category,
          ownerId: auth.id,
          imageUrl,
          dayPriceEuroCents,
          fullText: `${title} ${description}`,
          latitude: Number(
            latitude.toFixed(2) + Math.floor(Math.random() * 10),
          ),
          longitude: Number(
            longitude.toFixed(2) + Math.floor(Math.random() * 10),
          ),
        })
        .run(pool),
  }),
}))

const RemoveListingInput = schemaBuilder.inputType("RemoveListingInput", {
  fields: (t) => ({
    listingId: t.globalID(),
  }),
})

schemaBuilder.mutationFields((t) => ({
  removeListing: t.authField({
    authScopes: { admin: true },
    type: Listing,
    args: {
      input: t.arg({ type: RemoveListingInput, required: true }),
    },
    resolve: async (_root, { input: { listingId } }, { pool }) => {
      const listingIdNumber = Number(listingId?.id)
        ? Number(listingId?.id)
        : undefined
      if (!listingIdNumber) return
      await db
        .update(
          "Listing",
          {
            ...removedListingProperties,
          },
          { id: listingIdNumber },
        )
        .run(pool)
      return db.selectOne("Listing", { id: listingIdNumber }).run(pool)
    },
  }),
}))

export const removedListingProperties = {
  isRemoved: true,
  title: "(Removed Listing)",
  description: "",
  fullText: "",
  imageUrl: "",
  category: "Other",
  dayPriceEuroCents: 0,
  latitude: 0,
  longitude: 0,
}
