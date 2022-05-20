import Stripe from "stripe"

const stripe = new Stripe(
  "sk_test_51KVLEkIqIJMDgnKExz5G4tIUtCwl2iNyJLimfyJw27Ae9ByJnIAhDZ16Lbw2A6o86DXigfAfcaXzffXXNzgiV1mL00lBOK5WfF",
  { apiVersion: "2020-08-27" },
)

export const createStripeAccount = () =>
  stripe.accounts.create({ type: "express" })

export const retrieveStripeAccount = (stripeAccountId: string) =>
  stripe.accounts.retrieve(stripeAccountId)

export const createStripeAccountOnboardingLink = async (
  stripeAccountId: string,
) => {
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: "https://dashboard.stripe.com/login",
    return_url: "https://dashboard.stripe.com/login",
    type: "account_onboarding",
  })
  return accountLink.url
}

export const getStripeAccountLoginLink = async (stripeAccountId: string) =>
  (await stripe.accounts.createLoginLink(stripeAccountId)).url

export const createStripePaymentIntent = async (args: {
  amountEuroCents: number
  toStripeAccountId: string
}) =>
  stripe.paymentIntents.create({
    amount: args.amountEuroCents,
    currency: "eur",
    transfer_data: {
      destination: args.toStripeAccountId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  })

export const retrieveStripePaymentIntent = async (id: string) =>
  stripe.paymentIntents.retrieve(id)
