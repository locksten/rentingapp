import { resolveArrayConnection } from "@pothos/plugin-relay"
import { getFirebaseUserById } from "auth"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { Listing } from "schema/listing"
import { schemaBuilder } from "schema/schemaBuilder"
import { User as QUser } from "zapatos/schema"

export { User as QUser } from "zapatos/schema"
export type User = QUser.JSONSelectable

export const UserRef = schemaBuilder.objectRef<User>("User")

export const User = schemaBuilder.loadableNode(UserRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(UserRef),
  ...idSort,
  load: (ids: string[], { pool }) =>
    db.select("User", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    name: t.exposeString("name"),
    isMe: t.boolean({
      resolve: ({ id }, _args, { auth }) => id === auth?.id,
    }),
    imageUrl: t.string({
      resolve: async ({ id }) => (await getFirebaseUserById(id))?.photoURL,
    }),
    listingCount: t.int({
      resolve: ({ id }, _args, { pool }) =>
        db.count("Listing", { ownerId: id }).run(pool),
    }),
  }),
})

schemaBuilder.objectField(User, "listings", (t) =>
  t.loadableList({
    type: Listing,
    resolve: (user) => user.id,
    load: (ids: string[], { pool }) =>
      Promise.all(
        ids.map((id) => db.select("Listing", { ownerId: id }).run(pool)),
      ),
  }),
)

schemaBuilder.queryFields((t) => ({
  users: t.connection({
    type: UserRef,
    resolve: async (_parent, args, { pool }) => {
      return resolveArrayConnection(
        { args },
        await db.select("User", db.all).run(pool),
      )
    },
  }),
}))