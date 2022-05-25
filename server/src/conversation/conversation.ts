import { resolveArrayConnection } from "@pothos/plugin-relay"
import { nodeResolveId, nodeIsTypeOf, idSort } from "common"
import { AppContext, pool } from "context"
import { db, dc } from "database"
import { Message, MessageRef } from "message/message"
import { Pool } from "pg"
import { schemaBuilder } from "schemaBuilder"
import { User } from "user/user"
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
        resolveArrayConnection({ args }, await getConversationMessages(id)),
    }),
    latestMessage: t.field({
      type: MessageRef,
      resolve: async ({ id }, _args, { auth, pool }) => {
        if (!auth) return
        return await getLatestConversationMessage(id)
      },
    }),
    otherParticipant: t.field({
      type: User,
      resolve: async ({ id: conversationId }, _args, context) =>
        getOtherConversationParticipant({ conversationId, context }),
    }),
  }),
})

export const getOtherConversationParticipant = async ({
  conversationId,
  context: { auth, pool },
}: {
  conversationId: number
  context: AppContext
}) => {
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
}

export const getLatestConversationMessage = (id: number) =>
  db
    .selectOne(
      "Message",
      { conversationId: id },
      { order: { by: "createdAt", direction: "DESC" } },
    )
    .run(pool)

export const crateSupportConversation = async ({
  context: { auth, pool },
}: {
  context: AppContext
}) => {
  if (!auth) return
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
}

export const getConversationMessages = (id: number) =>
  db
    .select(
      "Message",
      { conversationId: id },
      { order: { by: "createdAt", direction: "DESC" } },
    )
    .run(pool)

schemaBuilder.mutationFields((t) => ({
  createSupportConversation: t.authField({
    authScopes: { user: true },
    type: Conversation,
    resolve: async (_root, _args, context) =>
      crateSupportConversation({ context }),
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
