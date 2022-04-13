import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { eachDayOfInterval, formatISO } from "date-fns"
import { Renting } from "schema/renting"
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
        })
        .run(pool),
  }),
}))
