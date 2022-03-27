import { execSync } from "child_process"
import { pool } from "context"
import { db } from "database"

export const migrateTestDb = () => {
  execSync("yarn migrate watch --once")
}

export const clearDb = async () => {
  await db.deletes("User", db.all as any).run(pool)
  await db.deletes("Listing", db.all).run(pool)
}

export const resetTestDb = async () => {
  migrateTestDb()
  await clearDb()
}
