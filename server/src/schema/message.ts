import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { ConversationRef } from "schema/conversation"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
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

const SendMessageInput = schemaBuilder.inputType("SendMessageInput", {
  fields: (t) => ({
    conversationId: t.globalID(),
    listingId: t.globalID(),
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
      { input: { conversationId, listingId, recipientId, text } },
      { pool, auth },
    ) => {
      return db.serializable(pool, async (txn) => {
        const convoId =
          Number(conversationId?.id) ||
          (
            await db
              .insert("Conversation", {
                listingId: Number(listingId?.id) || null,
              })
              .run(txn)
          ).id
        if (!convoId) return

        if (!Number(conversationId?.id)) {
          if (!recipientId) return
          db.insert("ConversationUser", [
            {
              conversationId: convoId,
              userId: recipientId.id,
            },
            {
              conversationId: convoId,
              userId: auth.id,
            },
          ]).run(txn)
        }

        return db
          .insert("Message", {
            senderId: auth.id,
            conversationId: convoId,
            text: text,
          })
          .run(txn)
      })
    },
  }),
}))
