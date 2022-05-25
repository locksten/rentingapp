import { resolveArrayConnection } from "@pothos/plugin-relay"
import { disableFirebaseAccount } from "auth/auth"
import { nodeResolveId, nodeIsTypeOf, idSort } from "common"
import { AppContext, pool } from "context"
import { db, dc } from "database"
import { Feedback, QFeedback } from "feedback/feedback"
import { Listing, QListing, removedListingProperties } from "listing/listing"
import { schemaBuilder } from "schemaBuilder"
import { Report as QReport } from "zapatos/schema"

export { Report as QReport } from "zapatos/schema"
export type Report = QReport.JSONSelectable

export const ReportRef = schemaBuilder.objectRef<Report>("Report")

export const Report = schemaBuilder.loadableNode(ReportRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(ReportRef),
  ...idSort,
  load: (ids: number[], { pool }) =>
    db
      .select(
        "Report",
        { id: dc.isIn(ids) },
        {
          order: [
            { by: "isDismissed", direction: "ASC" },
            { by: "updatedAt", direction: "DESC" },
          ],
        },
      )
      .run(pool),
  fields: (t) => ({
    reason: t.exposeString("reason"),
    isDismissed: t.exposeBoolean("isDismissed"),
    createdAt: t.field({
      type: "String",
      resolve: ({ createdAt }) => db.toDate(createdAt).toISOString(),
    }),
    updatedAt: t.field({
      type: "String",
      resolve: ({ createdAt }) => db.toDate(createdAt).toISOString(),
    }),
    listing: t.field({
      type: Listing,
      resolve: async ({ listingId }, _args, { pool }) =>
        listingId
          ? await db.selectOne("Listing", { id: listingId }).run(pool)
          : undefined,
    }),
    feedback: t.field({
      type: Feedback,
      resolve: async ({ feedbackId }, _args, { pool }) =>
        feedbackId
          ? await db.selectOne("Feedback", { id: feedbackId }).run(pool)
          : undefined,
    }),
  }),
})

export const getReportedListings = async ({
  context: { pool },
}: {
  context: AppContext
}) =>
  db.sql<QListing.SQL | QReport.SQL, Listing[]>`
          SELECT DISTINCT ON (id) ${"Listing"}.*
          FROM ${"Report"}
          JOIN ${"Listing"} ON ${"Report"}.${"listingId"} = ${"Listing"}.${"id"}
          WHERE ${"Report"}.${"isDismissed"} = False AND ${"Listing"}.${"isRemoved"} = False
          `.run(pool)

schemaBuilder.queryFields((t) => ({
  reportedListings: t.connection({
    type: Listing,
    args: {
      ...t.arg.connectionArgs(),
    },
    resolve: async (_parent, args, context) => {
      return resolveArrayConnection(
        { args },
        await getReportedListings({ context }),
      )
    },
  }),
}))

export const getReportedFeedbacks = async ({
  context: { pool },
}: {
  context: AppContext
}) =>
  db.sql<QFeedback.SQL | QReport.SQL, Feedback[]>`
          SELECT DISTINCT ON (id) ${"Feedback"}.*
          FROM ${"Report"}
          JOIN ${"Feedback"} ON ${"Report"}.${"feedbackId"} = ${"Feedback"}.${"id"}
          WHERE ${"Report"}.${"isDismissed"} = False AND ${"Feedback"}.${"isRemoved"} = False
          `.run(pool)

schemaBuilder.queryFields((t) => ({
  reportedFeedbacks: t.connection({
    type: Feedback,
    args: {
      ...t.arg.connectionArgs(),
    },
    resolve: async (_parent, args, context) => {
      return resolveArrayConnection(
        { args },
        await getReportedFeedbacks({ context }),
      )
    },
  }),
}))

export const makeReport = async ({
  listingId,
  feedbackId,
  reason,
  context: { pool },
}: {
  listingId?: number
  feedbackId?: number
  reason?: string
  context: AppContext
}) => {
  return await db.serializable(pool, async (txn) => {
    const listing = await db.selectOne("Listing", { id: listingId }).run(txn)
    const feedback = await db.selectOne("Feedback", { id: feedbackId }).run(txn)
    if (listing === undefined && feedback === undefined) return
    return await db
      .insert("Report", {
        reason,
        listingId: listing?.id,
        feedbackId: feedback?.id,
      })
      .run(txn)
  })
}

const MakeReportInput = schemaBuilder.inputType("MakeReportInput", {
  fields: (t) => ({
    listingId: t.globalID(),
    feedbackId: t.globalID(),
    reason: t.string(),
  }),
})

schemaBuilder.mutationFields((t) => ({
  makeReport: t.authField({
    authScopes: { user: true },
    type: Report,
    args: {
      input: t.arg({ type: MakeReportInput, required: true }),
    },
    resolve: async (
      _root,
      { input: { feedbackId, listingId, reason } },
      context,
    ) => {
      return await db.serializable(pool, async (txn) => {
        if (!listingId?.id && !feedbackId?.id) return
        const listingIdNumber = listingId?.id ? Number(listingId.id) : undefined
        const feedbackIdNumber = feedbackId?.id
          ? Number(feedbackId.id)
          : undefined
        return await makeReport({
          context,
          listingId: listingIdNumber,
          feedbackId: feedbackIdNumber,
          reason: reason ?? undefined,
        })
      })
    },
  }),
}))

export const dismissReports = async ({
  listingId,
  feedbackId,
  context: { pool },
}: {
  listingId?: number
  feedbackId?: number
  context: AppContext
}) => [
  ...(await db
    .update("Report", { isDismissed: true }, { listingId: listingId })
    .run(pool)),
  ...(await db
    .update("Report", { isDismissed: true }, { feedbackId: feedbackId })
    .run(pool)),
]

const DismissReportsInput = schemaBuilder.inputType("DismissReportsInput", {
  fields: (t) => ({
    listingId: t.globalID(),
    feedbackId: t.globalID(),
  }),
})

schemaBuilder.mutationFields((t) => ({
  dismissReports: t.authField({
    authScopes: { admin: true },
    type: [Report],
    args: {
      input: t.arg({ type: DismissReportsInput, required: true }),
    },
    resolve: async (_root, { input: { feedbackId, listingId } }, context) =>
      dismissReports({
        context,
        feedbackId: listingId?.id ? Number(listingId?.id) : undefined,
        listingId: feedbackId?.id ? Number(feedbackId?.id) : undefined,
      }),
  }),
}))

export const banUser = async ({
  id,
  shouldDisableFirebaseAccount,
  context: { auth, pool },
}: {
  id: string
  shouldDisableFirebaseAccount?: boolean
  context: AppContext
}) => {
  if (!auth?.admin) return
  if (shouldDisableFirebaseAccount) await disableFirebaseAccount(id)
  await db
    .update(
      "User",
      { isBanned: true, isAdmin: false, name: "(Banned User)" },
      { id: id },
    )
    .run(pool)
  await db
    .update("Listing", removedListingProperties, { ownerId: id })
    .run(pool)
  return db.selectOne("User", { id: id }).run(pool)
}
