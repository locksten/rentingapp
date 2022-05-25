import { pool } from "context"
import { db } from "database"
import {
  leaveFeedback,
  getFeedbackListingId,
  getFeedbacksReceivedAsRenter,
  getFeedbacksReceivedAsOwner,
  removeFeedback,
  getUserRatingCount,
  getUserRating,
  average,
} from "feedback/feedback"
import { getListingFeedback } from "listing/listing"
import { makeRentingRequest } from "renting/renting"
import {
  clearDb,
  createTestUsersAndListingAndRenting,
  createTestContext,
} from "testing"

beforeEach(async () => {
  await clearDb()
})

describe("Feedback", () => {
  it("Leaves feedback for renter", async () => {
    const { renting, ownerContext } =
      await createTestUsersAndListingAndRenting()
    if (!renting) {
      throw "renting null"
    }

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
      .run(pool)

    const feedback = await leaveFeedback({
      context: ownerContext,
      rating: 4,
      rentingId: renting.id,
    })

    const updatedRenting = await db
      .selectOne("Renting", { id: renting.id })
      .run(pool)

    expect(updatedRenting?.ownerFeedbackId).toBe(feedback?.id)
  })

  it("Leaves feedback for owner", async () => {
    const { renting, renterContext } =
      await createTestUsersAndListingAndRenting()
    if (!renting) {
      throw "renting null"
    }

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
      .run(pool)

    const feedback = await leaveFeedback({
      context: renterContext,
      rating: 4,
      rentingId: renting.id,
    })

    const updatedRenting = await db
      .selectOne("Renting", { id: renting.id })
      .run(pool)

    expect(updatedRenting?.renterFeedbackId).toBe(feedback?.id)
  })

  it("Refuses to leave feedback with rating above 5", async () => {
    const { renting, renterContext } =
      await createTestUsersAndListingAndRenting()
    if (!renting) {
      throw "renting null"
    }

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
      .run(pool)

    const feedback = await leaveFeedback({
      context: renterContext,
      rating: 6,
      rentingId: renting.id,
    })

    const updatedRenting = await db
      .selectOne("Renting", { id: renting.id })
      .run(pool)

    expect(updatedRenting?.renterFeedbackId).toBeFalsy()
    expect(feedback).toBeFalsy()
  })

  it("Refuses to leave feedback with rating below 1", async () => {
    const { renting, renterContext } =
      await createTestUsersAndListingAndRenting()
    if (!renting) {
      throw "renting null"
    }

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
      .run(pool)

    const feedback = await leaveFeedback({
      context: renterContext,
      rating: 0,
      rentingId: renting.id,
    })

    const updatedRenting = await db
      .selectOne("Renting", { id: renting.id })
      .run(pool)

    expect(updatedRenting?.renterFeedbackId).toBeFalsy()
    expect(feedback).toBeFalsy()
  })

  it("Gets listing feedback", async () => {
    const { renting, ownerContext, renterContext, listing } =
      await createTestUsersAndListingAndRenting()
    renting &&
      (await db
        .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
        .run(pool))

    renting &&
      (await leaveFeedback({
        context: renterContext,
        rating: 2,
        rentingId: renting.id,
      }))

    const feedback = listing
      ? await getListingFeedback({
          context: ownerContext,
          listingId: listing.id,
        })
      : undefined

    expect(feedback?.at(0)).toMatchObject({ rating: 2 })
  })

  it("Gets the feedback listing id", async () => {
    const { renting, renterContext, listing } =
      await createTestUsersAndListingAndRenting()
    renting &&
      (await db
        .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
        .run(pool))

    const feedback = renting
      ? await leaveFeedback({
          context: renterContext,
          rating: 2,
          rentingId: renting.id,
        })
      : undefined
    const feedbackListingId = feedback
      ? await getFeedbackListingId({
          context: renterContext,
          feedbackId: feedback.id,
        })
      : undefined
    expect(feedbackListingId).toBe(listing?.id)
  })

  it("Gets feedbacks receieved as renter", async () => {
    const { renting, renterContext, ownerContext } =
      await createTestUsersAndListingAndRenting()
    renting &&
      (await db
        .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
        .run(pool))

    renting
      ? await leaveFeedback({
          context: ownerContext,
          rating: 2,
          rentingId: renting.id,
        })
      : undefined

    const feedbacks = renterContext.auth?.id
      ? await getFeedbacksReceivedAsRenter(renterContext.auth?.id, pool)
      : undefined

    expect(feedbacks?.at(0)).toMatchObject({ rating: 2 })
  })

  it("Gets feedbacks receieved as owner", async () => {
    const { renting, renterContext, ownerContext } =
      await createTestUsersAndListingAndRenting()
    renting &&
      (await db
        .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
        .run(pool))

    renting
      ? await leaveFeedback({
          context: renterContext,
          rating: 3,
          rentingId: renting.id,
        })
      : undefined

    const feedbacks = ownerContext.auth?.id
      ? await getFeedbacksReceivedAsOwner(ownerContext.auth?.id, pool)
      : undefined

    expect(feedbacks?.at(0)).toMatchObject({ rating: 3 })
  })

  it("Removes feedback", async () => {
    const { renting, renterContext } =
      await createTestUsersAndListingAndRenting()
    renting &&
      (await db
        .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
        .run(pool))

    const feedback = renting
      ? await leaveFeedback({
          context: renterContext,
          rating: 2,
          rentingId: renting.id,
        })
      : undefined
    const removed = feedback
      ? await removeFeedback({
          context: createTestContext("edmond-id", true),
          id: feedback.id,
        })
      : undefined
    expect(removed).toMatchObject({ text: "(Removed Feedback)" })
  })

  it("Gets a user's rating count", async () => {
    const { renting, renterContext, ownerContext, listing } =
      await createTestUsersAndListingAndRenting()
    if (!renting) {
      throw "renting null"
    }

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
      .run(pool)

    const rentingTwo = listing?.id
      ? await makeRentingRequest({
          listingId: listing.id,
          scheduledStartTime: "2001-01-01",
          scheduledEndTime: "2001-01-05",
          context: renterContext,
        })
      : undefined

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: rentingTwo?.id })
      .run(pool)

    await leaveFeedback({
      context: renterContext,
      rating: 4,
      rentingId: renting.id,
    })

    rentingTwo &&
      (await leaveFeedback({
        context: renterContext,
        rating: 2,
        rentingId: rentingTwo.id,
      }))

    const count = ownerContext.auth?.id
      ? await getUserRatingCount({
          context: ownerContext,
          id: ownerContext.auth.id,
        })
      : undefined

    expect(count).toEqual(2)
  })

  it("Gets a user's average rating", async () => {
    const { renting, renterContext, ownerContext, listing } =
      await createTestUsersAndListingAndRenting()
    if (!renting) {
      throw "renting null"
    }

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: renting.id })
      .run(pool)

    const rentingTwo = listing?.id
      ? await makeRentingRequest({
          listingId: listing.id,
          scheduledStartTime: "2001-01-01",
          scheduledEndTime: "2001-01-05",
          context: renterContext,
        })
      : undefined

    await db
      .update("Renting", { rentingStatus: "Returned" }, { id: rentingTwo?.id })
      .run(pool)

    await leaveFeedback({
      context: renterContext,
      rating: 4,
      rentingId: renting.id,
    })

    rentingTwo &&
      (await leaveFeedback({
        context: renterContext,
        rating: 2,
        rentingId: rentingTwo.id,
      }))

    const rating = ownerContext.auth?.id
      ? await getUserRating({
          context: ownerContext,
          id: ownerContext.auth.id,
        })
      : undefined

    expect(rating).toEqual(3)
  })

  it("Calculates the average", async () => {
    expect(average([1, 2, 2, 3, 4, 4, 5])).toEqual(3)
  })

  it("Calculates the average of an empty list as undefined", async () => {
    expect(average([])).toBeUndefined()
  })
})
