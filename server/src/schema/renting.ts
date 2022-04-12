import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { Listing } from "schema/listing"
import { schemaBuilder } from "schema/schemaBuilder"
import { User } from "schema/user"
import { Renting as QRenting } from "zapatos/schema"

export { Renting as QRenting } from "zapatos/schema"
export type Renting = QRenting.JSONSelectable

export const RentingRef = schemaBuilder.objectRef<Renting>("Renting")

export const Renting = schemaBuilder.loadableNode(RentingRef, {
  ...nodeResolveId,
  ...nodeIsTypeOf(RentingRef),
  ...idSort,
  load: (ids: number[], { pool }) =>
    db.select("Renting", { id: dc.isIn(ids) }).run(pool),
  fields: (t) => ({
    scheduledStartTime: t.exposeString("scheduledStartTime"),
    scheduledEndTime: t.exposeString("scheduledEndTime"),
    rentingRequestStatus: t.exposeString("rentingRequestStatus"),
    rentingPaymentStatus: t.exposeString("rentingPaymentStatus"),
    rentingReturnStatus: t.exposeString("rentingReturnStatus"),
    renter: t.field({
      type: User,
      resolve: ({ renterId }) => renterId,
    }),
    listing: t.field({
      type: Listing,
      resolve: ({ id }) => id,
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
        scheduledEndTime: db.toDate(scheduledStartTime as any)!,
      }
      return (await db.insert("Renting", [i]).run(pool)).at(0)
    },
  }),
}))
