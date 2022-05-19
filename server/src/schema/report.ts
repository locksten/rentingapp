import { resolveArrayConnection } from "@pothos/plugin-relay"
import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { Feedback, QFeedback } from "schema/feedback"
import { Listing, QListing } from "schema/listing"
import { schemaBuilder } from "schema/schemaBuilder"
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

schemaBuilder.queryFields((t) => ({
  reportedListings: t.connection({
    type: Listing,
    args: {
      ...t.arg.connectionArgs(),
    },
    resolve: async (_parent, args, { pool }) => {
      return resolveArrayConnection(
        { args },
        await db.sql<QListing.SQL | QReport.SQL, Listing[]>`
          SELECT DISTINCT ON (id) ${"Listing"}.*
          FROM ${"Report"}
          JOIN ${"Listing"} ON ${"Report"}.${"listingId"} = ${"Listing"}.${"id"}
          WHERE ${"Report"}.${"isDismissed"} = False AND ${"Listing"}.${"isRemoved"} = False
          `.run(pool),
      )
    },
  }),
}))

schemaBuilder.queryFields((t) => ({
  reportedFeedbacks: t.connection({
    type: Feedback,
    args: {
      ...t.arg.connectionArgs(),
    },
    resolve: async (_parent, args, { pool }) => {
      return resolveArrayConnection(
        { args },
        await db.sql<QFeedback.SQL | QReport.SQL, Feedback[]>`
          SELECT DISTINCT ON (id) ${"Feedback"}.*
          FROM ${"Report"}
          JOIN ${"Feedback"} ON ${"Report"}.${"feedbackId"} = ${"Feedback"}.${"id"}
          WHERE ${"Report"}.${"isDismissed"} = False AND ${"Feedback"}.${"isRemoved"} = False
          `.run(pool),
      )
    },
  }),
}))

const MakeReportInput = schemaBuilder.inputType("MakeReportInput", {
  fields: (t) => ({
    listingId: t.globalID(),
    feedbackId: t.globalID(),
    reason: t.string({ required: true }),
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
      { pool },
    ) => {
      return await db.serializable(pool, async (txn) => {
        if (!listingId?.id && !feedbackId?.id) return
        const listingIdNumber = Number(listingId?.id)
          ? Number(listingId?.id)
          : undefined
        const feedbackIdNumber = Number(feedbackId?.id)
          ? Number(feedbackId?.id)
          : undefined
        const listing = await db
          .selectOne("Listing", { id: listingIdNumber })
          .run(txn)
        const feedback = await db
          .selectOne("Feedback", { id: feedbackIdNumber })
          .run(txn)
        if (listing === undefined && feedback === undefined) return
        return await db
          .insert("Report", {
            reason,
            listingId: listing?.id,
            feedbackId: feedback?.id,
          })
          .run(txn)
      })
    },
  }),
}))

const DismissReportsInput = schemaBuilder.inputType("DismissReportsInput", {
  fields: (t) => ({
    listingId: t.globalID(),
    feedbackId: t.globalID(),
  }),
})

schemaBuilder.mutationFields((t) => ({
  dismissReports: t.authField({
    authScopes: { admin: true },
    type: "Boolean",
    args: {
      input: t.arg({ type: DismissReportsInput, required: true }),
    },
    resolve: async (_root, { input: { feedbackId, listingId } }, { pool }) => {
      const listingIdNumber = Number(listingId?.id)
        ? Number(listingId?.id)
        : undefined
      const feedbackIdNumber = Number(feedbackId?.id)
        ? Number(feedbackId?.id)
        : undefined
      console.log("nums:", listingIdNumber, feedbackIdNumber)

      await db
        .update("Report", { isDismissed: true }, { listingId: listingIdNumber })
        .run(pool)
      await db
        .update(
          "Report",
          { isDismissed: true },
          { feedbackId: feedbackIdNumber },
        )
        .run(pool)

      return true
    },
  }),
}))
