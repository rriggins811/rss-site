# Blog Post Schema Types (HowTo opt-in)

Every blog post under `content/blog/*.mdx` ships JSON-LD schema generated
from its frontmatter. By default that's `Article` schema — appropriate for
most posts (op-eds, analysis, news, listicles, personal stories).

A small subset of posts are **procedural** — they walk the reader through
ordered steps to accomplish something concrete. Those benefit dramatically
from `HowTo` schema, which Google + Perplexity + ChatGPT browse all pull
into rich AI answers as step-by-step panels.

## When to use `HowTo`

Use `HowTo` when ALL of these are true:

- The post answers "how do I do X" with a clear procedure
- There are **3-12 ordered steps** the reader executes in sequence
- Each step has a meaningful name + 1-3 sentence instruction
- The steps cover the **published body of the post** — not aspirational
  steps that don't appear in the text

Use the default `Article` when:

- The post is analysis, opinion, story, or news
- There are no ordered steps
- The "steps" are really just H2s for a listicle (e.g. "5 mistakes")
- You're tempted to invent steps to fit the schema — don't

Google penalizes schema that doesn't match visible page content.

## How to opt in

Add three frontmatter fields to the post's `.mdx` file:

```yaml
schemaType: "HowTo"
totalTime: "PT72H"        # optional, ISO-8601 duration
howToSteps:
  - name: "Step 1 short title"
    duration: "PT12H"     # optional per-step
    text: "1-3 sentence instruction the reader can act on. Self-contained — assume the rich result truncates everything after this line."
  - name: "Step 2 short title"
    duration: "PT12H"
    text: "..."
  # 3-12 steps total
```

The blog `[slug]` route detects `schemaType === "HowTo"` and emits HowTo
schema in **place of** Article (not alongside — Google recommends one
primary `@type` per page).

## Step text guidance

The `text` field is what shows up in Google AI Overviews, Perplexity
answers, and the HowTo rich result on search pages. Treat it like a tweet:

- Self-contained — never say "see above" or "scroll down for more"
- Actionable verb-first — "Ask the admitting nurse..." not "you should
  consider asking..."
- 1-3 sentences max
- Include the specific number, threshold, or named tool when relevant
  ("the BFCC-QIO appeal"), because AI answer panels strip context

## Step duration (optional but recommended)

Use ISO-8601 durations:

- `PT15M` = 15 minutes
- `PT2H` = 2 hours
- `PT12H` = 12 hours
- `P1D` = 1 day
- `P1W` = 1 week

Set `totalTime` at the post level to the sum (approximate is fine).

## Live examples

- `the-first-72-hours-after-your-parent-falls-what-nobody-tells-you.mdx`
  — 4 steps, `totalTime: PT72H`. First HowTo conversion (May 16, 2026).

## Verifying

After deploy, paste the post URL into Google's Rich Results Test:

```
https://search.google.com/test/rich-results?url=https://rigginsstrategicsolutions.com/blog/<slug>
```

It should detect HowTo with the right number of steps. If it falls back to
Article, check that `schemaType: "HowTo"` is spelled exactly that way (case
matters) and that `howToSteps` is a non-empty array.

## What about /resources/ stub pages?

The /resources/[slug] pages currently ship as scaffolds with placeholder
H2 headings and "in-progress" body text — they don't have real procedural
content yet. **Do not** add HowTo schema to them until the full article
content lands. Schema that doesn't match visible body gets devalued.
