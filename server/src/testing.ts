import { AppContext, pool } from "context"
import { db } from "database"
import { createListing } from "listing/listing"
import { makeRentingRequest } from "renting/renting"

export const clearDb = async () => {
  await db.deletes("Report", {}).run(pool)
  await db.deletes("Message", {}).run(pool)
  await db.deletes("Conversation", {}).run(pool)
  await db.deletes("Renting", {}).run(pool)
  await db.deletes("Feedback", {}).run(pool)
  await db.deletes("Listing", {}).run(pool)
  await db.deletes("User", {}).run(pool)
}

export const createTestContext = (
  loggedInId: string,
  isAdmin?: boolean,
): AppContext => {
  return {
    pool,
    auth: {
      id: loggedInId,
      firebaseToken: "token" as any,
      user: { id: loggedInId, firebaseToken: "token" as any },
      admin: isAdmin
        ? { id: loggedInId, firebaseToken: "token" as any }
        : undefined,
    },
  }
}

export const createTestUsers = async () => ({
  alice: await db.insert("User", { id: "alice-id", name: "alice" }).run(pool),
  charlie: await db
    .insert("User", { id: "charlie-id", name: "charlie" })
    .run(pool),
  edmond: await db
    .insert("User", { id: "edmond-id", name: "edmond", isAdmin: true })
    .run(pool),
  eve: await db.insert("User", { id: "eve-id", name: "eve" }).run(pool),
  grey: await db.insert("User", { id: "grey-id", name: "grey" }).run(pool),
})

export const createTestUsersAndListingAndRenting = async (args?: {
  isOwnerOnboarded?: boolean
}) => {
  await createTestUsers()
  const ownerContext = createTestContext("alice-id")
  args?.isOwnerOnboarded &&
    (await db
      .update(
        "User",
        { isStripeAccountOnboarded: true },
        { id: ownerContext.auth?.id },
      )
      .run(pool))
  const renterContext = createTestContext("charlie-id")
  const listing = await createListing(ownerContext, {
    title: "listing",
    category: "Tools",
    dayPriceEuroCents: 500,
    description: "description",
    imageUrl: "url",
    latitude: 100,
    longitude: 100,
  })
  listing?.id &&
    (await makeRentingRequest({
      listingId: listing.id,
      scheduledStartTime: "2001-01-01",
      scheduledEndTime: "2001-01-05",
      context: renterContext,
    }))
  const renting = await db
    .selectOne("Renting", { listingId: listing?.id })
    .run(pool)
  return {
    listing,
    renting,
    ownerContext,
    renterContext,
  }
}
