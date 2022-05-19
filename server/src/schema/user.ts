import { resolveArrayConnection } from "@pothos/plugin-relay"
import { disableFirebaseAccount, getFirebaseUserById } from "auth"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import {
  feedbackAvergeRating,
  getFeedbacksReceivedAsOwner,
  getFeedbacksReceivedAsRenter,
} from "schema/feedback"
import { Listing, removedListingProperties } from "schema/listing"
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
    isAdmin: t.exposeBoolean("isAdmin"),
    isBanned: t.exposeBoolean("isBanned"),
    isMe: t.boolean({
      resolve: ({ id }, _args, { auth }) => id === auth?.id,
    }),
    imageUrl: t.string({
      resolve: async ({ id }) => (await getFirebaseUserById(id))?.photoURL,
    }),
    listingCount: t.int({
      resolve: ({ id }, _args, { pool }) =>
        db.count("Listing", { ownerId: id, isRemoved: false }).run(pool),
    }),
    rentingOwnerCount: t.int({
      resolve: ({ id }, _args, { pool }) =>
        db
          .count("Renting", { ownerId: id, rentingStatus: "Returned" })
          .run(pool),
    }),
    rentingRenterCount: t.int({
      resolve: ({ id }, _args, { pool }) =>
        db
          .count("Renting", { renterId: id, rentingStatus: "Returned" })
          .run(pool),
    }),
    ratingCount: t.int({
      resolve: async ({ id }, _args, { pool }) =>
        (await getFeedbacksReceivedAsOwner(id, pool)).length +
        (await getFeedbacksReceivedAsRenter(id, pool)).length,
    }),
    rating: t.float({
      resolve: async ({ id }, _args, { pool }) =>
        feedbackAvergeRating([
          ...(await getFeedbacksReceivedAsOwner(id, pool)),
          ...(await getFeedbacksReceivedAsRenter(id, pool)),
        ]),
    }),
  }),
})

schemaBuilder.objectField(User, "listings", (t) =>
  t.loadableList({
    type: Listing,
    resolve: (user) => user.id,
    load: (ids: string[], { pool }) =>
      Promise.all(
        ids.map((id) =>
          db.select("Listing", { ownerId: id, isRemoved: false }).run(pool),
        ),
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

const BanUserInput = schemaBuilder.inputType("BanUserInput", {
  fields: (t) => ({
    userId: t.globalID({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  banUser: t.authField({
    authScopes: { admin: true },
    type: User,
    args: {
      input: t.arg({ type: BanUserInput, required: true }),
    },
    resolve: async (_root, { input: { userId } }, { pool }) => {
      await disableFirebaseAccount(userId.id)
      try {
        await db
          .update(
            "User",
            { isBanned: true, isAdmin: false, name: "(Banned User)" },
            { id: userId.id },
          )
          .run(pool)
        await db
          .update(
            "Listing",
            { ...removedListingProperties },
            { ownerId: userId.id },
          )
          .run(pool)
        return db.selectOne("User", { id: userId.id }).run(pool)
      } catch (e) {
        console.log(e)
      }
    },
  }),
}))
