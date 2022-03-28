import SchemaBuilder from "@pothos/core"
import DataloaderPlugin from "@pothos/plugin-dataloader"
import RelayPlugin from "@pothos/plugin-relay"
import { AppContext } from "context"

export const schemaBuilder = new SchemaBuilder<{
  Context: AppContext
  DefaultFieldNullability: true
}>({
  plugins: [RelayPlugin, DataloaderPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
  },
  defaultFieldNullability: true,
})
