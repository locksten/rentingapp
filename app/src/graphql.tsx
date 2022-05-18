import { devtoolsExchange } from "@urql/devtools"
import { authExchange } from "@urql/exchange-auth"
import { cacheExchange } from "@urql/exchange-graphcache"
import type { IntrospectionData } from "@urql/exchange-graphcache/dist/types/ast"
import React, { createContext, FC, useContext, useState } from "react"
import { getAuthState } from "src/auth"
import { serverUrl } from "src/utils"
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

const makeClient = () =>
  createClient({
    url: `${serverUrl}/graphql`,
    exchanges: [
      devtoolsExchange,
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

const GQLClientContext = createContext<{ resetClient: () => void }>({
  resetClient: () => {},
})

export const GraphQLProvider: FC = ({ children }) => {
  const [client, setClient] = useState(makeClient())
  return (
    <GQLClientContext.Provider
      value={{
        resetClient: () => setClient(makeClient()),
      }}
    >
      <Provider value={client}>{children}</Provider>
    </GQLClientContext.Provider>
  )
}

export const useGQLClient = () => useContext(GQLClientContext)
