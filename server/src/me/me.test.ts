import { getMyConversations } from "me/me"
import { sendMessage } from "message/message"
import { clearDb, createTestUsers, createTestContext } from "testing"

beforeEach(async () => {
  await clearDb()
})

describe("Me", () => {
  it("Gets my conversations", async () => {
    await createTestUsers()
    const alice = createTestContext("alice-id")
    const charlie = createTestContext("charlie-id")
    const edmond = createTestContext("edmond-id")

    const message = await sendMessage({
      context: alice,
      recipientId: "charlie-id",
      text: "test",
    })
    await sendMessage({
      context: edmond,
      recipientId: "alice-id",
      text: "test2",
    })

    const aliceConversations = await getMyConversations({ context: alice })
    expect(aliceConversations).toMatchObject([
      {
        participantA: "alice-id",
        participantB: "charlie-id",
      },
      {
        participantA: "edmond-id",
        participantB: "alice-id",
      },
    ])

    const charlieConversations = await getMyConversations({ context: charlie })
    expect(charlieConversations).toMatchObject([
      {
        participantA: "alice-id",
        participantB: "charlie-id",
      },
    ])
  })
})
