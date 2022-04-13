import { authExchange } from "@urql/exchange-auth"
import { cacheExchange } from "@urql/exchange-graphcache"
import type { IntrospectionData } from "@urql/exchange-graphcache/dist/types/ast"
import React, { FC } from "react"
import { Platform } from "react-native"
import { getAuthState } from "src/auth"
import {
  createClient,
  dedupExchange,
  fetchExchange,
  makeOperation,
  Provider,
} from "urql"
import rawSchema from "./generated/graphql-schema.json"

const schema = rawSchema as IntrospectionData

const nodeTypes = (
  schema.__schema.types?.find(({ name }) => name === "Node") as any
).possibleTypes.map(({ name }: any) => name)

const client = createClient({
  url: `http://${
    Platform.OS === "android" ? "10.0.2.2" : "localhost"
  }:4000/graphql`,
  exchanges: [
    dedupExchange,
    authExchange({
      getAuth: async () => {
        const currentUser = getAuthState().currentUser
        if (!currentUser?.displayName) return null
        const token = (await currentUser?.getIdToken()) ?? null
        return token ? { token, refreshToken: null } : null
      },
      didAuthError: ({ error }) =>
        error.message.startsWith("[GraphQL] Not authorized"),
      addAuthToOperation: ({ operation, authState }: any) => {
        if (!authState?.token) return operation

        const fetchOptions =
          typeof operation.context.fetchOptions === "function"
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {}

        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              Authorization: `Bearer ${authState.token}`,
            },
          },
        })
      },
    }),
    cacheExchange({
      schema,
      updates: {
        Mutation: {
          declineRentingRequest(_result, _args, cache, _info) {
            cache.invalidate("Query", "me")
          },
          createListing(_result, _args, cache, _info) {
            cache.invalidate("Query", "me")
          },
        },
      },
      resolvers: {
        Query: {
          node: (_, { id }, cache) => ({
            __typename: nodeTypes
              .map((name: string) =>
                cache.resolve(
                  { __typename: name, id: id as string },
                  "__typename",
                ),
              )
              .find((__typename: string) => __typename),
            id,
          }),
        },
      },
    }),
    fetchExchange,
  ],
})

export const GraphQLProvider: FC = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)
