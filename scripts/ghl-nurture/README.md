# Guide download nurture (guide-lp)

Source of truth for the copy in GHL workflow **04 - Guide Download Nurture
(guide-lp)** (`356433e2-d65b-4d9a-9ffc-50bc852e0158`). Built and saved, and
left in **Draft** pending Ryan's go.

## Why it exists

`/api/guide-deliver` deliberately strips the `freeguide` tag and applies
`guide-lp` instead, and no published workflow listened for `guide-lp`. Anyone
arriving from a `/g/[slug]` ad landing page got the PDF and then silence. That
is the path both Build 6 magnets sit on.

Deliberately NOT solved by adding `guide-lp` as a second trigger on
`01 - Blueprint Signup Sequence`. Its first email opens "Your Blueprint is
open. All 20 modules, all 69 tools" and points at Module 00. These leads have
no Blueprint account, so that would be a false statement in a live email and a
link into a login wall. Nothing here may imply they have an account.

## Built

    Contact Tag (guide-lp added)
      -> Wait 2 days -> Guide LP 1 - Did the guide help?
      -> Wait 2 days -> Guide LP 2 - Why I stopped buying houses
      -> Wait 3 days -> Guide LP 3 - The guide was the short version
      -> END

From: Ryan Riggins / ryan@rigginsstrategicsolutions.com on all three.
Bodies are `guide-lp-1.html`, `-2`, `-3`, pasted through Quick compose's
`</>` source view. Verified by reloading and re-reading the canvas.

## Editing the copy

Edit the HTML here, then paste into the matching action. These are body
fragments, not documents: Quick compose supplies its own shell, and the
pre-header is its own field rather than a hidden div.

## Gotchas

- **Use the Standard builder.** In the Advanced builder the "+" between steps
  stops opening the action picker and just recentres the canvas. Direct
  clicks, hover-then-click, the Add button, a reload and a fresh tab all
  failed; switching builders fixed it instantly.
- The action picker's "Recent actions" list **reorders by recent use**, so
  clicking a fixed position picks the wrong action. Type the action name in
  the search box instead. This added a stray Wait once.
- The Wait type options reorder the same way, which silently set one Wait to
  "until the contact replies" earlier. Check before clicking.
- The email panel's scroll position moves the `</>` source button.
