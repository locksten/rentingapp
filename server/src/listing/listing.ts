import { resolveArrayConnection } from "@pothos/plugin-relay"
import { nodeResolveId, nodeIsTypeOf, idSort } from "common"
import { AppContext, pool } from "context"
import { db, dc } from "database"
import { formatISO, eachDayOfInterval } from "date-fns"
import { feedbackAvergeRating, QFeedback, Feedback } from "feedback/feedback"
import { Renting, QRenting } from "renting/renting"
import { Report } from "report/report"
import { schemaBuilder } from "schemaBuilder"
import { User } from "user/user"
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
      resolve: async ({ id }, _args, context) =>
        listingUnavailableDays({ id, context }),
    }),
    ownerUnavailableDays: t.field({
      type: ["String"],
      resolve: async ({ id }, _args, { pool }) =>
        (await db.selectOne("Listing", { id }).run(pool))?.unavailableDates,
    }),
    owner: t.field({
      type: User,
      resolve: ({ ownerId }) => ownerId,
    }),
  }),
})

export const listingUnavailableDays = async ({
  id,
  context: { pool },
}: {
  id: number
  context: AppContext
}) => {
  const listing = await db.selectOne("Listing", { id }).run(pool)
  const rentings = await db
    .select("Renting", {
      listingId: id,
      rentingStatus: dc.isIn(["PaymentPending", "ReturnPending"]),
    })
    .run(pool)
  const ownerUnavailableDates =
    listing?.unavailableDates.map((d) =>
      formatISO(db.toDate(d), { representation: "date" }),
    ) ?? []
  return [
    ...new Set([
      ...rentings
        .flatMap(({ scheduledStartTime, scheduledEndTime }) =>
          eachDayOfInterval({
            start: db.toDate(scheduledStartTime),
            end: db.toDate(scheduledEndTime),
          }),
        )
        .map((d) => formatISO(d, { representation: "date" })),
      ...ownerUnavailableDates,
    ]),
  ]
}

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

export const getListingRating = async ({
  listingId,
  context: { pool },
}: {
  listingId: number
  context: AppContext
}) =>
  feedbackAvergeRating(
    await db.sql<QListing.SQL | QRenting.SQL | QFeedback.SQL, Feedback[]>`
      SELECT ${"Feedback"}.*
      FROM ${"Renting"}
      JOIN ${"Feedback"} ON ${"Renting"}.${"renterFeedbackId"} = ${"Feedback"}.${"id"}
      WHERE ${{ listingId }} AND ${"Feedback"}.${"isRemoved"} = False`.run(
      pool,
    ),
  )

schemaBuilder.objectFields(Listing, (t) => ({
  rating: t.float({
    resolve: async ({ id: listingId }, _args, context) =>
      getListingRating({ listingId, context }),
  }),
}))

export const getListingFeedback = async ({
  listingId,
  context: { pool },
}: {
  listingId: number
  context: AppContext
}) =>
  db.sql<QListing.SQL | QRenting.SQL | QFeedback.SQL, Feedback[]>`
SELECT ${"Feedback"}.*
FROM ${"Renting"}
JOIN ${"Feedback"} ON ${"Renting"}.${"renterFeedbackId"} = ${"Feedback"}.${"id"}
WHERE ${{ listingId }} AND ${"Feedback"}.${"isRemoved"} = False`.run(pool)

schemaBuilder.objectFields(Listing, (t) => ({
  feedback: t.connection({
    type: Feedback,
    resolve: async ({ id: listingId }, args, context) =>
      resolveArrayConnection(
        { args },
        await getListingFeedback({ context, listingId }),
      ),
  }),
}))

export const findListings = (args?: {
  fromPriceEuroCents?: number | null
  toPriceEuroCents?: number | null
  searchTerm?: string | null
  category?: string | null
  latitudeMin?: number | null
  latitudeMax?: number | null
  longitudeMin?: number | null
  longitudeMax?: number | null
}) =>
  db
    .select(
      "Listing",
      {
        isRemoved: false,
        dayPriceEuroCents: dc.and(
          dc.gte(args?.fromPriceEuroCents ?? 0),
          dc.lte(args?.toPriceEuroCents ?? 999999),
        ),
        ...(args?.searchTerm
          ? { fullText: dc.ilike(`%${args.searchTerm}%`) }
          : undefined),
        ...(args?.category && args.category !== "All Categories"
          ? { category: dc.eq(`${args.category}`) }
          : undefined),
        ...(args?.latitudeMin !== null &&
        args?.latitudeMin !== undefined &&
        args?.latitudeMax !== null &&
        args?.latitudeMax !== undefined &&
        args?.longitudeMin !== null &&
        args?.longitudeMin !== undefined &&
        args?.longitudeMax !== null &&
        args?.longitudeMax !== undefined
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
    .run(pool)

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
    resolve: async (_parent, args) => {
      return resolveArrayConnection({ args }, await findListings(args))
    },
  }),
}))

export const createListing = async (
  { auth }: AppContext,
  props: {
    title: string
    description: string
    category: string
    imageUrl: string
    dayPriceEuroCents: number
    latitude: number
    longitude: number
  },
) => {
  if (!auth || !props.title || props.dayPriceEuroCents < 50) return
  return await db
    .insert("Listing", {
      ...props,
      ownerId: auth.id,
      unavailableDates: [],
      fullText: `${props.title} ${props.description}`,
      latitude: Number(
        props.latitude.toFixed(2) + Math.floor(Math.random() * 10),
      ),
      longitude: Number(
        props.longitude.toFixed(2) + Math.floor(Math.random() * 10),
      ),
    })
    .run(pool)
}

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
    resolve: async (_root, { input }, context) => createListing(context, input),
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
      return await removeListing(listingIdNumber)
    },
  }),
}))

export const removeListing = async (listingId: number) => {
  if (!listingId) return
  await db
    .update(
      "Listing",
      {
        ...removedListingProperties,
      },
      { id: listingId },
    )
    .run(pool)
  return db.selectOne("Listing", { id: listingId }).run(pool)
}

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
  unavailableDates: [],
}

const UpdateListingUnavailableDatesInput = schemaBuilder.inputType(
  "UpdateListingUnavailableDatesInput",
  {
    fields: (t) => ({
      listingId: t.globalID(),
      unavailableDates: t.stringList({ required: true }),
    }),
  },
)

export const updateListingUnavailableDates = async ({
  listingId,
  unavailableDates,
  context: { auth },
}: {
  listingId: number
  unavailableDates: string[]
  context: AppContext
}) => {
  if (!listingId) return
  const listing = await db.selectOne("Listing", { id: listingId }).run(pool)
  if (auth?.id !== listing?.ownerId) return

  await db
    .update(
      "Listing",
      {
        unavailableDates: unavailableDates.map((d) =>
          db.toString(new Date(d), "timestamptz"),
        ),
      },
      { id: listingId },
    )
    .run(pool)

  return db.selectOne("Listing", { id: listingId }).run(pool)
}

schemaBuilder.mutationFields((t) => ({
  updateListingUnavailableDates: t.authField({
    authScopes: { user: true },
    type: Listing,
    args: {
      input: t.arg({
        type: UpdateListingUnavailableDatesInput,
        required: true,
      }),
    },
    resolve: async (
      _root,
      { input: { listingId, unavailableDates } },
      { auth, pool },
    ) => {
      const listingIdNumber = Number(listingId?.id)
        ? Number(listingId?.id)
        : undefined
      if (!listingIdNumber) return
      const listing = await db
        .selectOne("Listing", { id: listingIdNumber })
        .run(pool)
      if (auth.id !== listing?.ownerId) return

      await db
        .update(
          "Listing",
          {
            unavailableDates: unavailableDates.map((d) =>
              db.toString(new Date(d), "timestamptz"),
            ),
          },
          { id: listingIdNumber },
        )
        .run(pool)

      return db.selectOne("Listing", { id: listingIdNumber }).run(pool)
    },
  }),
}))
