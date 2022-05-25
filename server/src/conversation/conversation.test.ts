import {
  crateSupportConversation,
  findConversation,
  getConversationMessages,
  getLatestConversationMessage,
  getOtherConversationParticipant,
} from "conversation/conversation"
import { sendMessage } from "message/message"
import { clearDb, createTestContext, createTestUsers } from "testing"

beforeEach(async () => {
  await clearDb()
})

describe("Conversation", () => {
  it("Gets the latest message", async () => {
    await createTestUsers()
    const a = createTestContext("alice-id")

    const message = await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test",
    })
    const conversationId = message?.conversationId
    if (!conversationId) throw "no conversation id"
    expect(await getLatestConversationMessage(conversationId)).toMatchObject({
      text: "test",
    })

    await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test2",
    })
    expect(await getLatestConversationMessage(conversationId)).toMatchObject({
      text: "test2",
    })

    await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test3",
    })
    expect(await getLatestConversationMessage(conversationId)).toMatchObject({
      text: "test3",
    })
  })

  it("Gets the other participant", async () => {
    await createTestUsers()
    const alice = createTestContext("alice-id")
    const charlie = createTestContext("charlie-id")

    const message = await sendMessage({
      context: alice,
      recipientId: "charlie-id",
      text: "test",
    })
    const conversationId = message?.conversationId
    if (!conversationId) throw "no conversation id"
    expect(
      await getOtherConversationParticipant({ conversationId, context: alice }),
    ).toMatchObject({
      name: "charlie",
    })

    await sendMessage({
      context: charlie,
      recipientId: "alice-id",
      text: "test2",
    })
    expect(
      await getOtherConversationParticipant({
        conversationId,
        context: charlie,
      }),
    ).toMatchObject({
      name: "alice",
    })
  })

  it("Creates a support conversation", async () => {
    await createTestUsers()
    const alice = createTestContext("alice-id")

    const conversation = await crateSupportConversation({
      context: alice,
    })
    if (!conversation) throw "no conversation"
    expect(
      await getOtherConversationParticipant({
        conversationId: conversation.id,
        context: alice,
      }),
    ).toMatchObject({
      name: "edmond",
    })

    const conversationAgain = await crateSupportConversation({
      context: alice,
    })
    if (!conversationAgain) throw "no conversationAgain"
    expect(conversation).toMatchObject(conversationAgain)
  })

  it("Finds a conversation", async () => {
    await createTestUsers()
    const a = createTestContext("alice-id")
    const message = await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test",
    })
    const conversation = await findConversation({
      participants: ["alice-id", "charlie-id"],
      pool: a.pool,
    })

    expect(conversation).toMatchObject({ id: message?.conversationId })

    const conversationTwo = await findConversation({
      participants: ["charlie-id", "alice-id"],
      pool: a.pool,
    })

    expect(conversationTwo).toMatchObject({ id: message?.conversationId })
  })

  it("Sends a message", async () => {
    await createTestUsers()
    const a = createTestContext("alice-id")
    const message = await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test",
    })
    const messages = message?.conversationId
      ? await getConversationMessages(message?.conversationId)
      : undefined
    expect(messages?.at(0)).toMatchObject({ text: "test" })
  })

  it("Sends multiple messages and reads them in sorted order", async () => {
    await createTestUsers()
    const a = createTestContext("alice-id")
    const message = await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test",
    })
    await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test2",
    })
    await sendMessage({
      context: a,
      recipientId: "charlie-id",
      text: "test3",
    })
    const messages = message?.conversationId
      ? await getConversationMessages(message?.conversationId)
      : undefined
    expect(messages?.at(0)).toMatchObject({ text: "test3" })
    expect(messages?.at(1)).toMatchObject({ text: "test2" })
    expect(messages?.at(2)).toMatchObject({ text: "test" })
  })
})
