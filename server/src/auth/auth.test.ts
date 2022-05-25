import { getToken } from "auth/auth"
import { clearDb } from "testing"

beforeEach(async () => {
  await clearDb()
})

describe("Auth", () => {
  it("Extracts the bearer token", async () => {
    expect(getToken({ authorization: "Bearer abcdef" })).toBe("abcdef")
  })
})
