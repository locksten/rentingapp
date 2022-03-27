/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>/src"],
}

process.env = Object.assign(process.env, {
  DATABASE: "postgres://postgres:password@localhost:5432/rentingapp_test",
})
