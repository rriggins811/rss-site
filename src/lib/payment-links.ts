// Buy/CTA destinations used by /the-blueprint and /blueprint-premium tier
// cards. The Blueprint course site at blueprint.rigginsstrategicsolutions.com
// owns the actual checkout flow (Stripe), tier selection, and login. RSS site
// only sends qualified traffic there.
export const paymentLinks = {
  simpleBlueprint: "/freeguide",
  blueprintCore: "https://blueprint.rigginsstrategicsolutions.com/pricing",
  blueprintPremium: "https://blueprint.rigginsstrategicsolutions.com/pricing",
  blueprintLogin: "https://blueprint.rigginsstrategicsolutions.com/login",
  seniorSafe: "https://app.seniorsafeapp.com",
} as const;
