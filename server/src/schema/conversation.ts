import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { Listing } from "schema/listing"
import { Message, MessageRef } from "schema/message"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
import { Conversation as QConversation } from "zapatos/schema"

export { Conversation as QConversation } from "zapatos/schema"
export type Conversation = QConversation.JSONSelectable

export const ConversationRef =
  schemaBuilder.objectRef<Conversation>("Conversation")

export const Conversation = schemaBuilder.loadableNode(ConversationRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(ConversationRef),
  ...idSort,
  load: (ids: number[], { pool }) =>
    db.select("Conversation", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    createdAt: t.field({
      type: "String",
      resolve: ({ createdAt }) => db.toDate(createdAt).toISOString(),
    }),
    messages: t.connection({
      type: Message,
      resolve: async ({ id }, args, { pool }) =>
        resolveArrayConnection(
          { args },
          await db
            .select(
              "Message",
              { conversationId: id },
              { order: { by: "createdAt", direction: "DESC" } },
            )
            .run(pool),
        ),
    }),
    latestMessage: t.field({
      type: MessageRef,
      resolve: async ({ id }, _args, { auth, pool }) => {
        if (!auth) return
        return await db
          .selectOne(
            "Message",
            { conversationId: id },
            { order: { by: "createdAt", direction: "DESC" } },
          )
          .run(pool)
      },
    }),
    participants: t.field({
      type: [User],
      resolve: async ({ id: conversationId }, _args, { pool }) => {
        const conversationUser = await db
          .select("ConversationUser", { conversationId })
          .run(pool)
        const userIds = conversationUser.map((cu) => cu.userId)
        return await db.select("User", { id: dc.isIn(userIds) }).run(pool)
      },
    }),
    listing: t.field({
      type: Listing,
      resolve: async ({ listingId }, _args, { pool }) =>
        listingId
          ? await db.selectOne("Listing", { id: listingId }).run(pool)
          : undefined,
    }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  createSupportConversation: t.authField({
    authScopes: { user: true },
    type: Conversation,
    resolve: async (_root, _args, { pool, auth }) => {
      const admins = await db
        .select("User", { isAdmin: true, isBanned: false })
        .run(pool)
      if (admins.length === 0) return undefined
      const randomAdmin = admins[Math.floor(Math.random() * admins.length)]

      const conversation = await db
        .insert("Conversation", { listingId: undefined })
        .run(pool)
      await db
        .insert("ConversationUser", {
          conversationId: conversation.id,
          userId: auth.id,
        })
        .run(pool),
        await db
          .insert("ConversationUser", {
            conversationId: conversation.id,
            userId: randomAdmin.id,
          })
          .run(pool)

      return conversation
    },
  }),
}))
