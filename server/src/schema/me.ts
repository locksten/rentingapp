import { resolveArrayConnection } from "@pothos/plugin-relay"
import { objectIsTypeOf } from "common"
import { db } from "database"
import { Listing } from "schema/listing"
import { Renting } from "schema/renting"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"

export type Me = { id: string }
export const MeRef = schemaBuilder.objectRef<Me>("Me")

export const Me = schemaBuilder.objectType(MeRef, {
  ...objectIsTypeOf(MeRef),
  fields: (t) => ({
    id: t.exposeString("id"),
    user: t.field({
      type: User,
      resolve: ({ id }) => id,
    }),
    MyRentals: t.connection({
      type: Renting,
      resolve: async ({ id }, args, { pool }) =>
        resolveArrayConnection(
          { args },
          await db.select("Renting", { renterId: id }).run(pool),
        ),
    }),
    MyListings: t.connection({
      type: Listing,
      resolve: async ({ id }, args, { pool }) =>
        resolveArrayConnection(
          { args },
          await db.select("Listing", { ownerId: id }).run(pool),
        ),
    }),
  }),
})

schemaBuilder.queryFields((t) => ({
  me: t.field({
    authScopes: { user: true },
    type: Me,
    resolve: (_parent, _args, { auth }) =>
      auth ? { _type: "Me", id: auth.id } : undefined,
  }),
}))
