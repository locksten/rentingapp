import { nodeResolveId, nodeIsTypeOf, idSort } from "common"
import { AppContext } from "context"
import { ConversationRef, findConversation } from "conversation/conversation"
import { db, dc } from "database"
import { schemaBuilder } from "schemaBuilder"
import { User } from "user/user"
import { Message as QMessage } from "zapatos/schema"

export { Message as QMessage } from "zapatos/schema"
export type Message = QMessage.JSONSelectable

export const MessageRef = schemaBuilder.objectRef<Message>("Message")

export const Message = schemaBuilder.loadableNode(MessageRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(MessageRef),
  ...idSort,
  load: (ids: number[], { pool }) =>
    db.select("Message", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    text: t.exposeString("text"),
    createdAt: t.field({
      type: "String",
      resolve: ({ createdAt }) => db.toDate(createdAt).toISOString(),
    }),
    conversation: t.field({
      type: ConversationRef,
      resolve: ({ conversationId }, _args, { pool }) =>
        db.selectOne("Conversation", { id: conversationId }).run(pool),
    }),
    sender: t.field({
      type: User,
      resolve: ({ senderId }, _args, { pool }) =>
        db.selectOne("User", { id: senderId }).run(pool),
    }),
  }),
})

export const sendMessage = async ({
  recipientId,
  conversationId,
  text,
  context: { auth, pool },
}: {
  recipientId?: string
  conversationId?: number
  text: string
  context: AppContext
}) => {
  return db.serializable(pool, async (txn) => {
    if (!auth) return
    const convoId = conversationId
      ? conversationId
      : recipientId
      ? (
          (await findConversation({
            participants: [auth.id, recipientId],
            pool,
          })) ??
          (await db
            .insert("Conversation", {
              participantA: auth.id,
              participantB: recipientId,
            })
            .run(txn))
        )?.id
      : undefined
    if (!convoId) return
    return db
      .insert("Message", {
        senderId: auth.id,
        conversationId: convoId,
        text: text,
      })
      .run(txn)
  })
}

const SendMessageInput = schemaBuilder.inputType("SendMessageInput", {
  fields: (t) => ({
    conversationId: t.globalID(),
    recipientId: t.globalID(),
    text: t.string({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  sendMessage: t.authField({
    authScopes: { user: true },
    type: Message,
    args: {
      input: t.arg({ type: SendMessageInput, required: true }),
    },
    resolve: async (
      _root,
      { input: { conversationId, recipientId, text } },
      context,
    ) =>
      sendMessage({
        conversationId: Number(conversationId?.id),
        recipientId: recipientId?.id,
        text,
        context,
      }),
  }),
}))
