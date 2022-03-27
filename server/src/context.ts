import { ExpressContext } from "apollo-server-express/dist/ApolloServer"
import { Pool } from "pg"
import { TxnClientForSerializable } from "zapatos/db"

export const pool = new Pool({
  connectionString: process.env.DATABASE,
})

export const newAppContext = (ctx: ExpressContext) => ({
  pool,
  auth: { id: undefined },
})

export type AppContext = Omit<ReturnType<typeof newAppContext>, "pool"> & {
  pool: Pool | TxnClientForSerializable
}
