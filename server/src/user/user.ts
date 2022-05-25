import { resolveArrayConnection } from "@pothos/plugin-relay"
import { getFirebaseUserById } from "auth/auth"
import { nodeResolveId, nodeIsTypeOf, idSort } from "common"
import { Conversation, findConversation } from "conversation/conversation"
import { db, dc } from "database"
import { getUserRatingCount, getUserRating } from "feedback/feedback"
import { Listing } from "listing/listing"
import { retrieveStripeAccount } from "payments"
import { banUser } from "report/report"
import { schemaBuilder } from "schemaBuilder"
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
    isStripeAccountOnboarded: t.boolean({
      resolve: async ({ id }, _args, { pool }) => {
        const user = await db.selectOne("User", { id }).run(pool)
        if (!user || !user.stripeAccountId) return
        if (user.isStripeAccountOnboarded) return true

        const stripeAccount = await retrieveStripeAccount(user.stripeAccountId)
        if (stripeAccount.capabilities?.transfers === "active") {
          await db
            .update("User", { isStripeAccountOnboarded: true }, { id })
            .run(pool)
          return true
        }
        return false
      },
    }),
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
      resolve: async ({ id }, _args, context) =>
        getUserRatingCount({ context, id }),
    }),
    rating: t.float({
      resolve: async ({ id }, _args, context) => getUserRating({ context, id }),
    }),
  }),
})

schemaBuilder.objectFields(User, (t) => ({
  conversation: t.field({
    type: Conversation,
    resolve: async ({ id }, _args, { auth, pool }) => {
      if (!auth?.id) return
      return (await findConversation({ participants: [id, auth.id], pool }))?.id
    },
  }),
}))

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
    resolve: async (_root, { input: { userId } }, context) =>
      banUser({
        context,
        id: userId.id,
        shouldDisableFirebaseAccount: true,
      }),
  }),
}))
