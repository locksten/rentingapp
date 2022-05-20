import { idSort, nodeIsTypeOf, nodeResolveId } from "common"
import { db, dc } from "database"
import { eachDayOfInterval } from "date-fns"
import {
  createStripePaymentIntent,
  retrieveStripePaymentIntent,
} from "payments"
import { Feedback } from "schema/feedback"
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
    paymentIntentClientSecret: t.field({
      type: "String",
      resolve: async (renting, _args, { auth, pool }) => {
        if (auth?.user?.id !== renting.renterId) return
        if (renting.stripePaymentIntentId) {
          return (
            await retrieveStripePaymentIntent(renting.stripePaymentIntentId)
          ).client_secret
        }

        const owner = await db
          .selectOne("User", { id: renting.ownerId })
          .run(pool)
        if (!owner?.stripeAccountId) return

        const listing = await db
          .selectOne("Listing", { id: renting.listingId })
          .run(pool)
        if (!listing) return

        const durationDays = eachDayOfInterval({
          start: db.toDate(renting.scheduledStartTime),
          end: db.toDate(renting.scheduledEndTime),
        }).length

        const paymentIntent = await createStripePaymentIntent({
          amountEuroCents: durationDays * listing.dayPriceEuroCents,
          toStripeAccountId: owner.stripeAccountId,
        })
        await db
          .update(
            "Renting",
            { stripePaymentIntentId: paymentIntent.id },
            { id: renting.id },
          )
          .run(pool)

        return paymentIntent.client_secret
      },
    }),
    scheduledStartTime: t.exposeString("scheduledStartTime"),
    scheduledEndTime: t.exposeString("scheduledEndTime"),
    updatedAt: t.field({
      type: "String",
      resolve: ({ updatedAt }) => db.toDate(updatedAt).toISOString(),
    }),
    listing: t.field({
      type: Listing,
      resolve: ({ listingId }) => listingId,
    }),
    rentingStatus: t.field({
      type: RentingStatus,
      resolve: async (
        { id, rentingStatus, stripePaymentIntentId },
        _args,
        { pool },
      ) => {
        if (rentingStatus !== "PaymentPending") return rentingStatus
        if (!stripePaymentIntentId) return "PaymentPending"
        if (
          (await retrieveStripePaymentIntent(stripePaymentIntentId)).status ===
          "succeeded"
        ) {
          await db
            .update("Renting", { rentingStatus: "ReturnPending" }, { id })
            .run(pool)
          return "ReturnPending"
        } else {
          return "PaymentPending"
        }
      },
    }),
    owner: t.field({
      type: User,
      resolve: ({ ownerId }) => ownerId,
    }),
    renter: t.field({
      type: User,
      resolve: ({ renterId }) => renterId,
    }),
    ownerFeedback: t.field({
      type: Feedback,
      resolve: ({ ownerFeedbackId }) => ownerFeedbackId,
    }),
    renterFeedback: t.field({
      type: Feedback,
      resolve: ({ renterFeedbackId }) => renterFeedbackId,
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

const DeclineRentingRequestInput = schemaBuilder.inputType(
  "DeclineRentingRequestInput",
  {
    fields: (t) => ({
      rentingId: t.globalID({ required: true }),
    }),
  },
)

schemaBuilder.mutationFields((t) => ({
  declineRentingRequest: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: DeclineRentingRequestInput, required: true }),
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

const AcceptRentingRequestInput = schemaBuilder.inputType(
  "AcceptRentingRequestInput",
  {
    fields: (t) => ({
      rentingId: t.globalID({ required: true }),
    }),
  },
)

schemaBuilder.mutationFields((t) => ({
  acceptRentingRequest: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: AcceptRentingRequestInput, required: true }),
    },
    resolve: async (_root, { input: { rentingId } }, { pool, auth }) => {
      const id = Number(rentingId.id)
      const renting = await db.selectOne("Renting", { id }).run(pool)
      if (!renting) return
      if (auth?.user?.id !== renting.ownerId) return
      if (renting.rentingStatus !== "RequestPending") return

      const user = await db.selectOne("User", { id: auth.user.id }).run(pool)

      return (
        await db
          .update(
            "Renting",
            {
              rentingStatus: user?.isStripeAccountOnboarded
                ? "PaymentPending"
                : "ReturnPending",
            },
            { id },
          )
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

const PayForRentingInput = schemaBuilder.inputType("PayForRentingInput", {
  fields: (t) => ({
    rentingId: t.globalID({ required: true }),
  }),
})

schemaBuilder.mutationFields((t) => ({
  payForRenting: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: PayForRentingInput, required: true }),
    },
    resolve: async (_root, { input: { rentingId } }, { pool, auth }) => {
      const id = Number(rentingId.id)
      const renting = await db.selectOne("Renting", { id }).run(pool)
      if (!renting) return
      if (
        !(
          auth?.user?.id === renting.renterId &&
          renting.rentingStatus === "PaymentPending"
        )
      )
        return

      return (
        await db
          .update("Renting", { rentingStatus: "ReturnPending" }, { id })
          .run(pool)
      ).at(0)
    },
  }),
}))

const SettleRentingOutsideAppInput = schemaBuilder.inputType(
  "SettleRentingOutsideAppInput",
  {
    fields: (t) => ({
      rentingId: t.globalID({ required: true }),
    }),
  },
)

schemaBuilder.mutationFields((t) => ({
  settleRentingOutsideApp: t.field({
    type: Renting,
    args: {
      input: t.arg({ type: SettleRentingOutsideAppInput, required: true }),
    },
    resolve: async (_root, { input: { rentingId } }, { pool, auth }) => {
      const id = Number(rentingId.id)
      const renting = await db.selectOne("Renting", { id }).run(pool)
      if (!renting) return
      if (
        !(
          auth?.user?.id === renting.ownerId &&
          renting.rentingStatus === "PaymentPending"
        )
      )
        return

      return (
        await db
          .update("Renting", { rentingStatus: "ReturnPending" }, { id })
          .run(pool)
      ).at(0)
    },
  }),
}))
