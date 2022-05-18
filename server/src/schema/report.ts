import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { id } from "date-fns/locale"
import { Feedback } from "schema/feedback"
import { Listing } from "schema/listing"
import { QRenting } from "schema/renting"
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
    db.select("Report", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    reason: t.exposeString("reason"),
    isProcessed: t.exposeBoolean("isProcessed"),
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
