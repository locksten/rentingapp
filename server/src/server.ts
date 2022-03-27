import {
  getIntrospectedSchema,
  minifyIntrospectionQuery,
} from "@urql/introspection"
import { ApolloServer } from "apollo-server-express/dist/ApolloServer"
import express, { Express } from "express"
import * as fs from "fs"
import { getIntrospectionQuery } from "graphql"
import fetch from "cross-fetch"
import { schema } from "schema/schema"
import { newAppContext } from "context"

const server = new ApolloServer({
  schema,
  context: newAppContext,
})

server.start().then(() => {
  const app = express()
  server.applyMiddleware({ app })
  listen(app)
})

const listen = (app: Express) => {
  app.listen({ port: 4000 }, () => {
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variables: {},
        query: getIntrospectionQuery({ descriptions: false }),
      }),
    })
      .then((result) => result.json())
      .then(({ data }) => {
        const minified = minifyIntrospectionQuery(getIntrospectedSchema(data))
        fs.writeFileSync(
          "../app/src/generated/graphql-schema.json",
          JSON.stringify(minified),
        )
      })

    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}
