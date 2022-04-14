import { resolveArrayConnection } from "@pothos/plugin-relay"
import { objectIsTypeOf } from "common"
import { db } from "database"
import { Conversation, QConversation } from "schema/conversation"
import { Listing } from "schema/listing"
import { Renting } from "schema/renting"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
import { ConversationUser } from "zapatos/schema"

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
    conversations: t.connection({
      type: Conversation,
      resolve: async ({ id }, args, { pool }) => {
        const conversations = await db.sql<
          QConversation.SQL | ConversationUser.SQL,
          Conversation[]
        >`
          SELECT ${"Conversation"}.*
          FROM ${"ConversationUser"}
          JOIN ${"Conversation"} ON ${"ConversationUser"}.${"conversationId"} = ${"Conversation"}.${"id"}
          WHERE ${{ userId: id }}`.run(pool)
        return resolveArrayConnection({ args }, conversations)
      },
    }),
    myRentals: t.connection({
      type: Renting,
      resolve: async ({ id }, args, { pool }) =>
        resolveArrayConnection(
          { args },
          await db.select("Renting", { renterId: id }).run(pool),
        ),
    }),
    myListings: t.connection({
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
