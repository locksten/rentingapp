import { ExpressContext } from "apollo-server-express/dist/ApolloServer"
import { decodedFirebaseTokenFromHeader, getFirebaseUserById } from "auth"
import { db } from "database"
import { DecodedIdToken } from "firebase-admin/auth"
import { Pool } from "pg"
import { TxnClientForSerializable } from "zapatos/db"

export const pool = new Pool({
  connectionString: process.env.DATABASE,
})

export type LoggedInAuthContext = {
  id: string
  firebaseToken: DecodedIdToken
}

export type UserAuthContext = LoggedInAuthContext

export type AdminAuthContext = LoggedInAuthContext

export type AppContext = {
  pool: Pool | TxnClientForSerializable
  auth?: LoggedInAuthContext & { user?: UserAuthContext } & {
    admin?: AdminAuthContext
  }
}

export const newAppContext = async (
  ctx: ExpressContext,
): Promise<AppContext> => {
  const token = await decodedFirebaseTokenFromHeader(ctx.req.headers)
  const user = token && (await getFirebaseUserById(token.uid))
  let auth: AppContext["auth"]

  if (user && user.displayName) {
    const loggedIn = {
      id: user.uid,
      firebaseToken: token,
    }
    const { isAdmin } = await db
      .upsert("User", { id: user.uid, name: user.displayName }, ["id"])
      .run(pool)
    auth = {
      ...loggedIn,
      user: loggedIn,
      admin: isAdmin ? loggedIn : undefined,
    }
  }

  return {
    pool,
    auth,
  }
}
