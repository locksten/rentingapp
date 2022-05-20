import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { Pool } from "pg"
import { Message, MessageRef } from "schema/message"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
import { TxnClientForSerializable } from "zapatos/db"
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
    otherParticipant: t.field({
      type: User,
      resolve: async ({ id: conversationId }, _args, { auth, pool }) => {
        const conversation = await db
          .selectOne("Conversation", {
            id: conversationId,
          })
          .run(pool)
        if (!conversation) return
        const otherParticipantId =
          conversation.participantA === auth?.id
            ? conversation.participantB
            : conversation.participantA
        return await db.selectOne("User", { id: otherParticipantId }).run(pool)
      },
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

      const existingConversation = await findConversation({
        participants: [randomAdmin.id, auth.id],
        pool,
      })
      if (existingConversation) return existingConversation

      return await db
        .insert("Conversation", {
          participantA: randomAdmin.id,
          participantB: auth.id,
        })
        .run(pool)
    },
  }),
}))

export const findConversation = async (args: {
  participants: [string, string]
  pool: Pool | TxnClientForSerializable
}) => {
  const { participants, pool } = args
  return (
    (await db
      .selectOne("Conversation", {
        participantA: participants[0],
        participantB: participants[1],
      })
      .run(pool)) ??
    (await db
      .selectOne("Conversation", {
        participantA: participants[1],
        participantB: participants[0],
      })
      .run(pool))
  )
}
