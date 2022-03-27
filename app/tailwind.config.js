const colors = require("tailwindcss/colors")

module.exports = {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.teal,
      },
      fontSize: {
        base: 16,
      },
    },
  },
  plugins: [],
  corePlugins: require("tailwind-rn/unsupported-core-plugins"),
}
