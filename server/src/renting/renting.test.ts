import { pool } from "context"
import { db } from "database"
import {
  cancelRentingRequest,
  acceptRentingRequest,
  settleRentingOutsideApp,
  declineRentingRequest,
  confirmRentingReturn,
  getRentingTotalPrice,
  nDaysBetweenDates,
} from "renting/renting"
import { clearDb, createTestUsersAndListingAndRenting } from "testing"

beforeEach(async () => {
  await clearDb()
})

describe("Renting", () => {
  describe("Renter", () => {
    it("Makes a renting request", async () => {
      const { renting } = await createTestUsersAndListingAndRenting()
      expect(renting).toMatchObject({ rentingStatus: "RequestPending" })
    })

    it("Cancels a renting request", async () => {
      const { listing, renting, renterContext } =
        await createTestUsersAndListingAndRenting()
      expect(renting).toMatchObject({ rentingStatus: "RequestPending" })

      renting &&
        (await cancelRentingRequest({ context: renterContext, id: renting.id }))
      const canceledRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(canceledRenting).toMatchObject({ rentingStatus: "Canceled" })
    })
  })

  describe("Owner", () => {
    it("Accepts a renting request with owner onboarded with stripe", async () => {
      const { listing, renting, ownerContext } =
        await createTestUsersAndListingAndRenting({ isOwnerOnboarded: true })

      renting &&
        (await acceptRentingRequest({ context: ownerContext, id: renting.id }))
      const acceptedRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(acceptedRenting).toMatchObject({ rentingStatus: "PaymentPending" })
    })

    it("Settles payment outside app", async () => {
      const { listing, renting, ownerContext } =
        await createTestUsersAndListingAndRenting({ isOwnerOnboarded: true })

      renting &&
        (await acceptRentingRequest({ context: ownerContext, id: renting.id }))
      const acceptedRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(acceptedRenting).toMatchObject({ rentingStatus: "PaymentPending" })

      renting &&
        (await settleRentingOutsideApp({
          context: ownerContext,
          id: renting.id,
        }))
      const settledRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(settledRenting).toMatchObject({ rentingStatus: "ReturnPending" })
    })

    it("Accepts a renting request with owner not onboarded with stripe", async () => {
      const { listing, renting, ownerContext } =
        await createTestUsersAndListingAndRenting()

      renting &&
        (await acceptRentingRequest({ context: ownerContext, id: renting.id }))
      const acceptedRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(acceptedRenting).toMatchObject({ rentingStatus: "ReturnPending" })
    })

    it("Declines a renting request", async () => {
      const { listing, renting, ownerContext } =
        await createTestUsersAndListingAndRenting()

      renting &&
        (await declineRentingRequest({ context: ownerContext, id: renting.id }))
      const canceledRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(canceledRenting).toMatchObject({
        rentingStatus: "RequestDeclined",
      })
    })

    it("Confirms item returned", async () => {
      const { listing, renting, ownerContext } =
        await createTestUsersAndListingAndRenting()

      renting &&
        (await acceptRentingRequest({ context: ownerContext, id: renting.id }))
      const acceptedRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(acceptedRenting).toMatchObject({ rentingStatus: "ReturnPending" })

      renting &&
        (await confirmRentingReturn({ context: ownerContext, id: renting.id }))
      const returnedRenting = await db
        .selectOne("Renting", { listingId: listing?.id })
        .run(pool)
      expect(returnedRenting).toMatchObject({ rentingStatus: "Returned" })
    })
  })

  it("Gets the renting total price", async () => {
    const { listing, renting, ownerContext, renterContext } =
      await createTestUsersAndListingAndRenting({ isOwnerOnboarded: true })

    renting &&
      (await acceptRentingRequest({ context: ownerContext, id: renting.id }))
    const acceptedRenting = await db
      .selectOne("Renting", { listingId: listing?.id })
      .run(pool)
    expect(acceptedRenting).toMatchObject({ rentingStatus: "PaymentPending" })
    expect(
      acceptedRenting
        ? await getRentingTotalPrice({
            context: renterContext,
            renting: acceptedRenting,
          })
        : undefined,
    ).toBe(2500)
  })

  it("Calculates the number of days between dates", async () => {
    expect(
      nDaysBetweenDates({
        start: new Date("2001-01-01"),
        end: new Date("2001-01-05"),
      }),
    ).toBe(5)
  })

  it("Calculates the number of days between the same date as 1", async () => {
    expect(
      nDaysBetweenDates({
        start: new Date("2001-01-01"),
        end: new Date("2001-01-01"),
      }),
    ).toBe(1)
  })
})
