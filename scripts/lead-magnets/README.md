# Lead magnet PDF generator

Regenerates the guide PDFs in `public/downloads/`. Source of truth for the
guide *copy* is here, not the PDF, so a wording change is an edit to
`content_magnets.py` and a re-run rather than a rebuild from scratch.

House style matches the existing magnet family: Lora body, Work Sans running
heads, brand tokens read from `src/app/globals.css`, running header, and the
licence footer with page numbers on every page.

## Run

Fonts are not committed. Fetch them first (no modern User-Agent, so Google
Fonts serves TTF rather than woff2), then build:

```bash
cd scripts/lead-magnets && mkdir -p fonts && cd fonts
for spec in "Lora:400,700,400italic,700italic" "Work+Sans:400,700"; do
  curl -s "https://fonts.googleapis.com/css?family=$spec" -o "css_${spec%%:*}.txt"
done
grep -ho "https://[^)]*\.ttf" css_*.txt | sort -u | while read -r u; do
  curl -sS "$u" -o "$(basename "$u")"
done
python3 - <<'PY'
import re, os, shutil
for f in ("css_Lora.txt", "css_Work+Sans.txt"):
    for b in open(f).read().split("@font-face")[1:]:
        fam = re.search(r"font-family:\s*'([^']+)'", b).group(1).replace(" ", "")
        sty = re.search(r"font-style:\s*(\w+)", b).group(1)
        wgt = re.search(r"font-weight:\s*(\d+)", b).group(1)
        m = re.search(r"url\((https://[^)]+\.ttf)\)", b)
        if m and os.path.exists(os.path.basename(m.group(1))):
            shutil.copy(os.path.basename(m.group(1)),
                        f"{fam}-{wgt}{'i' if sty=='italic' else ''}.ttf")
PY
cd .. && python3 content_magnets.py
```

Update `pageCount` in `src/lib/lead-magnets.ts` if the page count changes.
