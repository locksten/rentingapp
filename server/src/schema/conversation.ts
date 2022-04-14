import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { Listing } from "schema/listing"
import { Message, MessageRef } from "schema/message"
import { schemaBuilder } from "schema/schemaBuilder"
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
    listing: t.field({
      type: Listing,
      resolve: async ({ listingId }, _args, { pool }) =>
        listingId
          ? await db.selectOne("Listing", { id: listingId }).run(pool)
          : undefined,
    }),
  }),
})
