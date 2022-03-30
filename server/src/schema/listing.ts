import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
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
  }),
})

schemaBuilder.objectField(Listing, "owner", (t) =>
  t.field({
    type: User,
    resolve: ({ ownerId }) => ownerId,
  }),
)

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

schemaBuilder.mutationType({
  fields: (t) => ({
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
  }),
})