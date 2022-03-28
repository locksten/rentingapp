import { cacheExchange } from "@urql/exchange-graphcache"
import type { IntrospectionData } from "@urql/exchange-graphcache/dist/types/ast"
import React, { FC } from "react"
import { createClient, dedupExchange, fetchExchange, Provider } from "urql"
import rawSchema from "./generated/graphql-schema.json"

const schema = rawSchema as IntrospectionData

const nodeTypes = (
  schema.__schema.types?.find(({ name }) => name === "Node") as any
).possibleTypes.map(({ name }: any) => name)

const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      schema,
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
