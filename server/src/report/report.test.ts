import { pool } from "context"
import { db } from "database"
import { leaveFeedback } from "feedback/feedback"
import {
  banUser,
  dismissReports,
  getReportedFeedbacks,
  makeReport,
} from "report/report"
import {
  clearDb,
  createTestContext,
  createTestUsers,
  createTestUsersAndListingAndRenting,
} from "testing"

beforeEach(async () => {
  await clearDb()
})

describe("Report", () => {
  it("Crates a listing report", async () => {
    const { ownerContext, listing } =
      await createTestUsersAndListingAndRenting()
    const report = listing
      ? await makeReport({ context: ownerContext, listingId: listing.id })
      : undefined
    expect(report).toMatchObject({ listingId: listing?.id })
  })

  it("Crates a feedback report", async () => {
    const { ownerContext, renterContext, listing, renting } =
      await createTestUsersAndListingAndRenting()
    await db
      .update(
        "Renting",
        { rentingStatus: "ReturnPending" },
        { id: renting?.id },
      )
      .run(pool)
    const feedback = renting
      ? await leaveFeedback({
          context: renterContext,
          rentingId: renting?.id,
          rating: 3,
        })
      : undefined

    const report = await makeReport({
      context: ownerContext,
      feedbackId: feedback?.id,
    })
    expect(report).toMatchObject({ feedbackId: feedback?.id })
  })

  it("Creates multiple reports and gets feedback reports", async () => {
    const { ownerContext, renterContext, listing, renting } =
      await createTestUsersAndListingAndRenting()
    await db
      .update(
        "Renting",
        { rentingStatus: "ReturnPending" },
        { id: renting?.id },
      )
      .run(pool)
    const feedback = renting
      ? await leaveFeedback({
          context: renterContext,
          rentingId: renting?.id,
          rating: 3,
        })
      : undefined

    const feedbackReport = await makeReport({
      context: ownerContext,
      feedbackId: feedback?.id,
    })
    expect(feedbackReport).toMatchObject({ feedbackId: feedback?.id })

    const feedbackReportTwo = await makeReport({
      context: ownerContext,
      feedbackId: feedback?.id,
    })
    expect(feedbackReportTwo).toMatchObject({ feedbackId: feedback?.id })

    const listingReport = await makeReport({
      context: ownerContext,
      listingId: listing?.id,
    })
    expect(listingReport).toMatchObject({ listingId: listing?.id })

    const reprotedFeedbacks = await getReportedFeedbacks({
      context: createTestContext("edmond-id", true),
    })

    expect(reprotedFeedbacks).toMatchObject([{ rating: 3 }])
  })

  it("Dismisses a listing report", async () => {
    const { renterContext, listing, renting } =
      await createTestUsersAndListingAndRenting()
    await db
      .update(
        "Renting",
        { rentingStatus: "ReturnPending" },
        { id: renting?.id },
      )
      .run(pool)

    const report = listing
      ? await makeReport({ context: renterContext, listingId: listing.id })
      : undefined
    expect(report).toMatchObject({ listingId: report?.listingId })

    const dismissedReports = await dismissReports({
      context: createTestContext("edmond-id", true),
      listingId: listing?.id,
    })

    expect(dismissedReports).toMatchObject([
      { isDismissed: true, listingId: listing?.id },
    ])
  })

  it("Dismisses a feedback report", async () => {
    const { ownerContext, renterContext, listing, renting } =
      await createTestUsersAndListingAndRenting()
    await db
      .update(
        "Renting",
        { rentingStatus: "ReturnPending" },
        { id: renting?.id },
      )
      .run(pool)
    const feedback = renting
      ? await leaveFeedback({
          context: renterContext,
          rentingId: renting?.id,
          rating: 3,
        })
      : undefined

    const report = listing
      ? await makeReport({ context: ownerContext, feedbackId: feedback?.id })
      : undefined
    expect(report).toMatchObject({ feedbackId: feedback?.id })

    const dismissedReports = await dismissReports({
      context: ownerContext,
      feedbackId: feedback?.id,
    })

    expect(dismissedReports).toMatchObject([{ isDismissed: true }])
  })

  it("Dismisses multiple feedback reports", async () => {
    const { ownerContext, renterContext, listing, renting } =
      await createTestUsersAndListingAndRenting()
    await db
      .update(
        "Renting",
        { rentingStatus: "ReturnPending" },
        { id: renting?.id },
      )
      .run(pool)
    const feedback = renting
      ? await leaveFeedback({
          context: renterContext,
          rentingId: renting?.id,
          rating: 3,
        })
      : undefined

    const report = listing
      ? await makeReport({ context: ownerContext, feedbackId: feedback?.id })
      : undefined
    expect(report).toMatchObject({ feedbackId: feedback?.id })

    const reportTwo = listing
      ? await makeReport({ context: ownerContext, feedbackId: feedback?.id })
      : undefined
    expect(reportTwo).toMatchObject({ feedbackId: feedback?.id })

    const dismissedReports = await dismissReports({
      context: ownerContext,
      feedbackId: feedback?.id,
    })

    expect(dismissedReports).toMatchObject([
      { isDismissed: true },
      { isDismissed: true },
    ])
  })

  it("Bans a user", async () => {
    const { edmond, alice } = await createTestUsers()
    const edmondContext = createTestContext(edmond.id, true)

    await banUser({ context: edmondContext, id: alice.id })
    const updatedAlice = await db.selectOne("User", { id: alice.id }).run(pool)

    expect(updatedAlice).toMatchObject({
      isBanned: true,
      name: "(Banned User)",
    })
  })

  it("refuses to let non-admins ban users", async () => {
    const { eve, alice } = await createTestUsers()
    const eveContext = createTestContext(eve.id)

    await banUser({ context: eveContext, id: alice.id })
    const updatedAlice = await db.selectOne("User", { id: alice.id }).run(pool)

    expect(updatedAlice).toMatchObject({
      isBanned: false,
    })
  })
})
