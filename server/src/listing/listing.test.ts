import { AppContext, pool } from "context"
import { db } from "database"
import { leaveFeedback } from "feedback/feedback"
import {
  createListing,
  findListings,
  removeListing,
  listingUnavailableDays,
  updateListingUnavailableDates,
  getListingRating,
} from "listing/listing"
import { makeRentingRequest } from "renting/renting"
import {
  clearDb,
  createTestContext,
  createTestUsers,
  createTestUsersAndListingAndRenting,
} from "testing"

export const createTestListings = async (context: AppContext) => {
  await createListing(context, {
    title: "aa",
    category: "Tools",
    dayPriceEuroCents: 5000,
    description: "abc",
    imageUrl: "img",
    latitude: 10,
    longitude: 30,
  })
  await createListing(context, {
    title: "bb",
    category: "Tools",
    dayPriceEuroCents: 100,
    description: "def",
    imageUrl: "img",
    latitude: 100,
    longitude: 110,
  })
  await createListing(context, {
    title: "cc",
    category: "Toys & Games",
    dayPriceEuroCents: 1200,
    description: "ghi",
    imageUrl: "img",
    latitude: 130,
    longitude: 140,
  })
  await createListing(context, {
    title: "dd",
    category: "Camping Gear",
    dayPriceEuroCents: 500,
    description: "jkl",
    imageUrl: "img",
    latitude: 50,
    longitude: 50,
  })
}

beforeEach(async () => {
  await clearDb()
})

describe("Listing", () => {
  it("Creates and retrieves", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const listing = (await findListings()).at(2)
    expect(listing).toMatchObject({ title: "bb" })
  })

  it("Refuses to create without title", async () => {
    await createTestUsers()
    await createListing(createTestContext("alice-id"), {
      title: "",
      category: "Tools",
      dayPriceEuroCents: 5000,
      description: "abc",
      imageUrl: "img",
      latitude: 10,
      longitude: 30,
    })
    expect((await findListings()).length).toBe(0)
  })

  it("Refuses to create with price less than 50 cents", async () => {
    await createTestUsers()
    await createListing(createTestContext("alice-id"), {
      title: "title",
      category: "Tools",
      dayPriceEuroCents: 49,
      description: "abc",
      imageUrl: "img",
      latitude: 10,
      longitude: 30,
    })
    expect((await findListings()).length).toBe(0)
  })

  it("Removes", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const listing = (await findListings()).at(2)
    const removed = listing?.id && (await removeListing(listing.id))
    expect(removed).toMatchObject({ title: "(Removed Listing)" })
  })

  it("Filters by category", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({ category: "Tools" })
    expect(found.at(0)).toMatchObject({ title: "bb" })
    expect(found.at(1)).toMatchObject({ title: "aa" })
  })

  it("Filters by text", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({ searchTerm: "ghi" })
    expect(found.at(0)).toMatchObject({ title: "cc" })
  })

  it("Filters from price", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({
      fromPriceEuroCents: 1000,
    })
    expect(found).toMatchObject([{ title: "cc" }, { title: "aa" }])
  })

  it("Filters to price", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({
      toPriceEuroCents: 1000,
    })
    expect(found).toMatchObject([{ title: "dd" }, { title: "bb" }])
  })

  it("Filters from price to price", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({
      fromPriceEuroCents: 1000,
      toPriceEuroCents: 1300,
    })
    expect(found).toMatchObject([{ title: "cc" }])
  })

  it("Filters by latitude", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({
      latitudeMin: 40,
      latitudeMax: 60,
    })
    expect(found.at(0)).toMatchObject({ title: "dd" })
  })

  it("Filters by longitude", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({
      longitudeMin: 100,
      longitudeMax: 120,
    })
    expect(found.at(0)).toMatchObject({ title: "dd" })
  })

  it("Filters by latitude and longitude", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const found = await findListings({
      latitudeMin: 40,
      latitudeMax: 60,
      longitudeMin: 40,
      longitudeMax: 60,
    })
    expect(found.at(0)).toMatchObject({ title: "dd" })
  })

  it("Is available on all days initially", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const listing = (await findListings({ searchTerm: "ghi" })).at(0)
    expect(listing).toMatchObject({ unavailableDates: [] })

    const days = listing
      ? await listingUnavailableDays({ id: listing.id, context })
      : undefined

    expect(days).toMatchObject([])
  })

  it("Is unavailable on owner-specified days", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const listing = (await findListings({ searchTerm: "ghi" })).at(0)
    expect(listing).toMatchObject({ unavailableDates: [] })

    const dates = ["2001-01-01T00:00:00+00:00", "2001-01-03T00:00:00+00:00"]
    listing &&
      (await updateListingUnavailableDates({
        context,
        listingId: listing.id,
        unavailableDates: dates,
      }))

    const days = listing
      ? await listingUnavailableDays({ id: listing.id, context })
      : undefined

    expect(days).toMatchObject(["2001-01-01", "2001-01-03"])
  })

  it("Updates owner unavailable dates twice", async () => {
    await createTestUsers()
    const context = createTestContext("alice-id")
    await createTestListings(context)
    const listing = (await findListings({ searchTerm: "ghi" })).at(0)
    expect(listing).toMatchObject({ unavailableDates: [] })

    const dates = ["2001-01-01T00:00:00+00:00", "2001-01-03T00:00:00+00:00"]
    listing &&
      (await updateListingUnavailableDates({
        context,
        listingId: listing.id,
        unavailableDates: dates,
      }))
    const updated = (await findListings({ searchTerm: "ghi" })).at(0)
    expect(updated).toMatchObject({ unavailableDates: dates })

    const newDates = ["2001-02-01T00:00:00+00:00", "2001-02-03T00:00:00+00:00"]
    listing &&
      (await updateListingUnavailableDates({
        context,
        listingId: listing.id,
        unavailableDates: newDates,
      }))
    const newUpdated = (await findListings({ searchTerm: "ghi" })).at(0)
    expect(newUpdated).toMatchObject({ unavailableDates: newDates })
  })

  it("Gets a listing's rating", async () => {
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

    const rating = listing
      ? await getListingRating({
          context: renterContext,
          listingId: listing.id,
        })
      : undefined

    expect(rating).toBe(3)
  })
})
