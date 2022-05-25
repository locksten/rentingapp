import { resolveArrayConnection } from "@pothos/plugin-relay"
import { objectIsTypeOf } from "common"
import { AppContext } from "context"
import { Conversation, QConversation } from "conversation/conversation"
import { db } from "database"
import { Listing } from "listing/listing"
import {
  createStripeAccount,
  createStripeAccountOnboardingLink,
  getStripeAccountLoginLink,
} from "payments"
import { Renting } from "renting/renting"
import { schemaBuilder } from "schemaBuilder"
import { User } from "user/user"

export type Me = { id: string }
export const MeRef = schemaBuilder.objectRef<Me>("Me")

export const Me = schemaBuilder.objectType(MeRef, {
  ...objectIsTypeOf(MeRef),
  fields: (t) => ({
    stripeOnboardingLink: t.string({
      resolve: async ({ id }, _args, { pool }) => {
        const user = await db.selectOne("User", { id }).run(pool)
        if (!user || user.isStripeAccountOnboarded) return
        let stripeAccountId = user.stripeAccountId

        if (!stripeAccountId) {
          stripeAccountId = (await createStripeAccount()).id
          await db.update("User", { stripeAccountId }, { id }).run(pool)
        }
        return await createStripeAccountOnboardingLink(stripeAccountId)
      },
    }),
    stripeAccountLoginLink: t.string({
      resolve: async ({ id }, _args, { pool }) => {
        const user = await db.selectOne("User", { id }).run(pool)
        if (!user?.stripeAccountId || !user?.isStripeAccountOnboarded) return
        return await getStripeAccountLoginLink(user.stripeAccountId)
      },
    }),
    id: t.exposeString("id"),
    user: t.field({
      type: User,
      resolve: ({ id }) => id,
    }),
    conversations: t.connection({
      type: Conversation,
      resolve: async (_, args, context) => {
        return resolveArrayConnection(
          { args },
          await getMyConversations({ context }),
        )
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

export const getMyConversations = async ({
  context: { auth, pool },
}: {
  context: AppContext
}) =>
  db.sql<QConversation.SQL, Conversation[]>`
          SELECT ${"Conversation"}.*
          FROM ${"Conversation"}
          WHERE ${{ participantA: auth?.id }} OR ${{
    participantB: auth?.id,
  }}`.run(pool)
