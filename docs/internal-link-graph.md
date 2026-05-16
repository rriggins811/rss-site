# Internal Link Graph — Topical Clusters

**Source of truth:** `src/lib/internal-links.ts` — typed registry of every cluster, its members, and its primary pillar page (when one exists).

**Rendered by:** `<RelatedReading>` component (`src/components/site/RelatedReading.tsx`), mounted on:
- Every `/tools/[slug]` page (May 16, 2026 — Round 2 Task 7)
- Every `/blog/[slug]` page, as a "Tools and guides in this topic" section above the existing tag-based related-posts list (same commit)

**Why it matters:** Google decides which page in a topic to rank based on the density and quality of internal links pointing at it. Tools without blog links and blog posts without tool links each look like orphans in their topic. The cluster registry forces dense, deliberate cross-linking — without authoring per-page related-link arrays in 35+ MDX files.

---

## Current clusters (May 16, 2026)

### 1. Selling a parent's home
- **Tool:** Net Proceeds Calculator
- **Resources (3):** how-to-sell, power-of-attorney, how-to-talk-to-mom
- **Blog posts (3):** quitclaim-deed-fraud, they-stole-the-house, $1.8M-estate-signature
- **Status:** Strong — 7 members, mix of all three content types
- **Open gap:** No pillar "how to sell an elderly parent's house in 2026" longform yet — the resources are scaffolds.

### 2. Caregiver burnout in the sandwich generation
- **Tool:** Caregiver Burnout Triage Quiz
- **Blog posts (3):** 78%-burning-out, $324k-mistake, group-texts-dont-work
- **Status:** Solid for the SEO-optimized tool. Could use 2-3 more posts.

### 3. Medicare coverage gaps and decoding the system
- **Tool:** Medicare Gap Analyzer
- **Blog posts (3):** inpatient-vs-observation-2026, observation-status-trap, first-72-hours
- **Resource (1):** medicare-vs-medicaid
- **Status:** Strong cluster — first-72-hours is HowTo schema'd (Round 2 T3) which compounds the AI-citation signal.

### 4. Aging in place vs assisted living decisions
- **Tool:** Aging in Place Break-Even Calculator
- **Blog posts (2):** $20k-monthly-blind-spot, $50k-renovation-trap
- **Resources (2):** assisted-living-vs-memory-care, cost-of-assisted-living-2026
- **Status:** Good. Both resources are still scaffold stubs (no full body yet).

### 5. Crisis response: when something happens fast
- **Blog posts (2):** first-72-hours, nursing-home-staffing-rule-repealed
- **Status:** Underweight — needs the tool (would be a "first 24 hours triage" tool, doesn't exist yet) and at least 1-2 more posts before it ranks as a topic cluster.

### 6. Elder fraud, scams, and predatory cash buyers
- **Blog posts (4):** doj-2025-annual-report, quitclaim-deed-fraud, they-stole-the-house, $1.8M-estate-signature
- **Resource (1):** wholesaler-scams-targeting-seniors
- **Status:** Strong text-side. No tool yet — a "fraud red-flag checklist" tool could anchor this cluster.

---

## What's NOT in a cluster yet

Posts and tools that exist but aren't tagged into a topical cluster. Each one is an orphan from the internal-link-graph perspective — Google sees them as standalone pages with no topical authority signal.

- `washington-wa-cares-fund-first-state-long-term-care-benefits.mdx` — state-specific policy news. Could anchor a new "Long-term care funding" cluster if 2-3 more state-specific posts get added.
- `massachusetts-assisted-living-disclosure-rules.mdx` — same pattern. Could pair with above.
- `the-50000-transition-trap-5-surprising-truths-about-navigating-a-senior-move-without-the-chaos.mdx` — listicle, could go in a new "Senior transition fundamentals" cluster.
- `the-starting-point-fallacy-5-surprising-realities-of-navigating-a-senior-move-without-losing-your-mind-or-your-savings.mdx` — same.
- `the-adult-childs-guide-to-mastering-a-senior-housing-transition-without-the-chaos.mdx` — would make an excellent **pillar** for a "Senior transition fundamentals" cluster.
- `free-tools-to-help-your-family-assess-senior-transition-readiness-1.mdx` — should be in EVERY cluster as a footer link, OR pulled into a meta-cluster.
- `navigating-your-aging-parents-senior-housing-transition.mdx` — possible pillar candidate.
- Tools without clusters: `smart-prep-budget-calculator`, `strategic-exit-engine`, `beneficiary-designation-audit`, `readiness-assessment`, `lead-qualification-quiz` — most are likely in-app/blueprint tools not standalone-rankable; flag for triage.

---

## How to add a cluster

1. Edit `src/lib/internal-links.ts`. Add a new entry to `CLUSTERS`:
   ```ts
   {
     id: "long-term-care-funding",
     label: "Long-term care funding by state",
     members: [
       { type: "blog", slug: "washington-wa-cares-fund-first-state-long-term-care-benefits" },
       { type: "blog", slug: "massachusetts-assisted-living-disclosure-rules" },
     ],
   },
   ```
2. The `ClusterTopic` type union (top of the same file) needs the new id added. TypeScript will catch this if you forget.
3. That's it. `<RelatedReading>` on every tool + blog [slug] page will pick up the new cluster automatically. No per-page edits required.

## Pillar pages

When a topic has a clear "X 101" longform, mark it on the cluster:
```ts
{
  id: "selling-parents-home",
  label: "Selling a parent's home",
  pillar: { type: "resource", slug: "how-to-sell-elderly-parents-house" },
  members: [...],
}
```

(The pillar field is in the type system but not yet rendered. Reserved for a future "Start here →" callout above the related links.)
