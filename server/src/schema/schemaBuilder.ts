import SchemaBuilder from "@pothos/core"
import DataloaderPlugin from "@pothos/plugin-dataloader"
import RelayPlugin from "@pothos/plugin-relay"
import ScopeAuthPlugin from "@pothos/plugin-scope-auth"
import { AdminAuthContext, AppContext, UserAuthContext } from "context"

export const schemaBuilder = new SchemaBuilder<{
  Context: AppContext
  AuthScopes: {
    user: boolean
    admin: boolean
  }
  AuthContexts: {
    user: AppContext & { auth: { user: UserAuthContext } }
    admin: AppContext & { auth: { admin: AdminAuthContext } }
  }
  DefaultFieldNullability: true
}>({
  plugins: [ScopeAuthPlugin, RelayPlugin, DataloaderPlugin],
  authScopes: async (context) => {
    return {
      user: !!context.auth,
      admin: !!context.auth?.admin,
    }
  },
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
  },
  defaultFieldNullability: true,
})
