import { Pool } from "pg"
import * as database from "zapatos/db"
import { conditions } from "zapatos/db"

export const createDatabasePool = () =>
  new Pool({
    connectionString: process.env.DATABASE,
  })

export const db = database

export const dc = conditions
