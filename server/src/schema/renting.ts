import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { pool } from "context"
import { db, dc } from "database"
import { Listing } from "schema/listing"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
import { Renting as QRenting } from "zapatos/schema"

export { Renting as QRenting } from "zapatos/schema"
export type Renting = QRenting.JSONSelectable

export const RentingRef = schemaBuilder.objectRef<Renting>("Renting")

export const RentingStatus = schemaBuilder.enumType("RentingStatus", {
  values: [
    "RequestPending",
    "RequestDeclined",
    "PaymentPending",
    "ReturnPending",
    "Returned",
    "Canceled",
  ] as const,
})

export const Renting = schemaBuilder.loadableNode(RentingRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(RentingRef),
  ...idSort,
  load: (ids: number[], { pool }) =>
    db.select("Renting", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    scheduledStartTime: t.exposeString("scheduledStartTime"),
    scheduledEndTime: t.exposeString("scheduledEndTime"),
    updatedAt: t.field({
      type: "String",
      resolve: ({ updatedAt }) => db.toDate(updatedAt).toISOString(),
    }),
    rentingStatus: t.field({
      type: RentingStatus,
      resolve: ({ rentingStatus }) => rentingStatus,
    }),
    owner: t.field({
      type: User,
      resolve: ({ ownerId }) => ownerId,
    }),
    renter: t.field({
      type: User,
      resolve: ({ renterId }) => renterId,
    }),
    listing: t.field({
      type: Listing,
      resolve: ({ listingId }) => listingId,
    }),
  }),
})

const RentingInput = schemaBuilder.inputType("MakeRentingRequestInput", {
  fields: (t) => ({
    listingId: t.globalID({ required: true }),
    scheduledStartTime: t.string({ required: true }),
    scheduledEndTime: t.string({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  makeRentingRequest: t.authField({
    authScopes: { user: true },
    type: Renting,
    args: {
      input: t.arg({ type: RentingInput, required: true }),
    },
    resolve: async (
      _root,
      { input: { listingId, scheduledStartTime, scheduledEndTime } },
      { pool, auth },
    ) => {
      const listing = await db
        .selectOne("Listing", { id: Number(listingId.id) })
        .run(pool)
      if (!listing) return
      if (!scheduledStartTime) return
      if (!scheduledEndTime) return

      const i: QRenting.Insertable = {
        renterId: auth.id,
        listingId: listing.id,
        ownerId: listing.ownerId,
        scheduledStartTime: db.toDate(scheduledStartTime as any)!,
        scheduledEndTime: db.toDate(scheduledEndTime as any)!,
      }
      return (await db.insert("Renting", [i]).run(pool)).at(0)
    },
  }),
}))

const DeclineRentingInput = schemaBuilder.inputType("DeclineRentingInput", {
  fields: (t) => ({
    rentingId: t.globalID({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  declineRentingRequest: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: DeclineRentingInput, required: true }),
    },
    resolve: async (_root, { input: { rentingId } }, { pool, auth }) => {
      const id = Number(rentingId.id)
      const renting = await db.selectOne("Renting", { id }).run(pool)
      if (!renting) return
      if (auth?.user?.id !== renting.ownerId) return
      if (renting.rentingStatus !== "RequestPending") return
      return (
        await db
          .update("Renting", { rentingStatus: "RequestDeclined" }, { id })
          .run(pool)
      ).at(0)
    },
  }),
}))

const AcceptRentingInput = schemaBuilder.inputType("AcceptRentingInput", {
  fields: (t) => ({
    rentingId: t.globalID({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  acceptRentingRequest: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: AcceptRentingInput, required: true }),
    },
    resolve: async (_root, { input: { rentingId } }, { pool, auth }) => {
      const id = Number(rentingId.id)
      const renting = await db.selectOne("Renting", { id }).run(pool)
      if (!renting) return
      if (auth?.user?.id !== renting.ownerId) return
      if (renting.rentingStatus !== "RequestPending") return
      return (
        await db
          .update("Renting", { rentingStatus: "PaymentPending" }, { id })
          .run(pool)
      ).at(0)
    },
  }),
}))

const CancelRentingInput = schemaBuilder.inputType("CancelRentingInput", {
  fields: (t) => ({
    rentingId: t.globalID({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  cancelRenting: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: CancelRentingInput, required: true }),
    },
    resolve: async (_root, { input: { rentingId } }, { pool, auth }) => {
      const id = Number(rentingId.id)
      const renting = await db.selectOne("Renting", { id }).run(pool)
      if (!renting) return
      if (
        !(
          auth?.user?.id === renting.renterId &&
          (renting.rentingStatus === "RequestPending" ||
            renting.rentingStatus === "PaymentPending")
        )
      )
        return
      return (
        await db
          .update("Renting", { rentingStatus: "Canceled" }, { id })
          .run(pool)
      ).at(0)
    },
  }),
}))

const AcceptRentingReturnInput = schemaBuilder.inputType(
  "AcceptRentingReturnInput",
  {
    fields: (t) => ({
      rentingId: t.globalID({ required: true }),
    }),
  },
)

schemaBuilder.mutationFields((t) => ({
  acceptRentingReturn: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: AcceptRentingReturnInput, required: true }),
    },
    resolve: async (_root, { input: { rentingId } }, { pool, auth }) => {
      const id = Number(rentingId.id)
      const renting = await db.selectOne("Renting", { id }).run(pool)
      if (!renting) return
      if (
        !(
          auth?.user?.id === renting.ownerId &&
          renting.rentingStatus === "ReturnPending"
        )
      )
        return

      return (
        await db
          .update("Renting", { rentingStatus: "Returned" }, { id })
          .run(pool)
      ).at(0)
    },
  }),
}))
