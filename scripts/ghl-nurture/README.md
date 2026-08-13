# Guide download nurture (guide-lp)

Paste-ready assets for GHL workflow **04 - Guide Download Nurture (guide-lp)**
(`356433e2-d65b-4d9a-9ffc-50bc852e0158`), which nurtures leads who downloaded a
magnet from a `/g/[slug]` ad landing page.

Those leads matter because `/api/guide-deliver` deliberately strips the
`freeguide` tag and applies `guide-lp` instead, and no published workflow
listened for `guide-lp`. They got the PDF and then silence.

They have **no Blueprint account**, so nothing here may imply they do. That is
why they cannot simply be dropped into `01 - Blueprint Signup Sequence`, whose
first email opens "Your Blueprint is open. All 20 modules."

## Built so far

    Contact Tag (guide-lp added) -> Wait 2 days -> Guide LP 1 -> Wait 2 days

Still in Draft. Emails 2 and 3 are not in yet: the builder's "+" stopped
opening the action picker and just recentres the canvas. Direct clicks,
hover-then-click, the Add button, a full reload and a fresh tab all failed.

## Remaining steps

Add after the trailing Wait, in order:

1. **Send email** -> `Guide LP 2 - Why I stopped buying houses`
   - From: Ryan Riggins / ryan@rigginsstrategicsolutions.com
   - Subject: `Why I stopped buying houses`
   - Pre-header: `I was on the other side of this for eight years.`
   - Body: Quick compose -> `</>` source view -> paste `guide-lp-2.html`
2. **Wait**, for a set period of time, 3 days
3. **Send email** -> `Guide LP 3 - The guide was the short version`
   - Subject: `The guide was the short version`
   - Pre-header: `Here is the whole thing, free, no card.`
   - Body: paste `guide-lp-3.html`

Then leave it in Draft for Ryan.

## Gotchas found the hard way

- GHL reorders the Wait-type options by recent use, so "For a set period of
  time" is not always in the same place. Check before clicking.
- The email panel's scroll position moves the `</>` source button.
- These are body fragments, not full documents. Quick compose supplies its own
  shell, and the pre-header is set in the Pre-Header field rather than a hidden
  div.
