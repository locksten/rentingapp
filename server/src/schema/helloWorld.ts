import { schemaBuilder } from "schema/schemaBuilder"

schemaBuilder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (_parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
})
