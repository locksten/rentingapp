import {
  getIntrospectedSchema,
  minifyIntrospectionQuery,
} from "@urql/introspection"
import { ApolloServer } from "apollo-server-express/dist/ApolloServer"
import { newAppContext } from "context"
import fetch from "cross-fetch"
import express, { Express } from "express"
import fileUpload from "express-fileupload"
import { fromBuffer as fileTypeFromBuffer } from "file-type"
import * as fs from "fs"
import { getIntrospectionQuery } from "graphql"
import { schema } from "schema/schema"
import { uploadListingImage } from "storage"

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
  app.use(
    fileUpload({
      limits: { fileSize: 5 * 1024 * 1024 },
      abortOnLimit: true,
      debug: true,
    }),
  )

  app.post("/listing/image", async function (req, res) {
    const file = req.files?.file
    if (!file || (file && "length" in file)) {
      res.status(400).send("Number of should be 1")
      return
    }

    const filetype = await fileTypeFromBuffer(file.data)
    if (!filetype || !["image/jpeg", "image/png"].includes(filetype.mime)) {
      res.status(400).send("Invalid file type")
    }

    const url = await uploadListingImage(file.data)
    if (!url) res.status(400).send("Failed to upload")

    res.status(200).json({ url }).send()
  })

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
