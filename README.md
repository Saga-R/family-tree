# family-tree

> Visual diary of maintaining our family lineage.

A modern, bilingual (English / हिन्दी) family tree visualiser built for the Daliya / Kalantri / Kasat / Sawal / Mantri families. 32 members across 5 generations at last count, with a FOMO-driven contribution loop designed to grow the tree through the family WhatsApp group.

## Run locally

```bash
./start.sh
```

Serves on `http://localhost:8765` and opens your default browser. (A static server is needed because Babel-standalone fetches the `.jsx` files via XHR, which Chrome blocks under `file://`.)

## Files

- `index.html` — page shell, fonts, CSS, React/Babel CDN loaders
- `i18n.js` — bilingual string table (EN + HI), language detection, `?lang=` URL override
- `familyData.js` — the people, the relationships, and the auto-layout engine
- `FamilyTreeApp.jsx` — the React UI (canvas, side panel, modal, search, welcome overlay, floating CTA)
- `start.sh` — local dev server
- `publish.sh` — one-shot publish to GitHub
- `docs/data-capture-strategy.md` — the FOMO contribution strategy doc
- `claude-design/` — original Claude artifact files, kept for reference
- `v1-simple/` — earlier D3 prototype, archived

## Features

- **Family bands** (sage Daliya, terracotta Kalantri, purple Kasat, …) so multiple origin families are visible at a glance
- **Married-in spouses** sit in their husband's column with a **dotted natal line** back to their birth family — e.g. Santosh shows the Kalantri ↔ Daliya bridge
- **Couples** drawn side-by-side, children drop with rounded orthogonal connectors
- **Generation guides** labelled G I → G V
- **Deceased members** get a † next to their name and a grey status dot
- **Click any node** → side panel with parents, spouse, children, siblings — each is a button that flies the canvas to that person
- **Search** with live results dropdown
- **Collapse pill** under any node with children
- **Pan & zoom** (drag + scroll); toolbar has zoom in / out / reset
- **Add Member** — pick one relationship and the rest is inferred (child of a married person gets both spouses as parents, sibling shares parents, etc.)
- **CSV import** (same schema as the bootstrap spreadsheet)
- **Bilingual** EN ↔ हिन्दी with an in-header toggle, sticky in localStorage, overridable via `?lang=hi`
- **Personalised welcome** via URL tokens:
  - `?to=<member-id>` → "Hi <Name> 👋 — find yourself in the tree" (auto-flies the canvas)
  - `?invite=<slug>` → "Hi <Name> 👋 — you're not in the tree yet"
  - First visit → "32 of us are in here. Are you?" with Add me / Find me CTAs
- **Floating "Are you in the tree?" pill** always present

## Editing the data

Seed family lives in `familyData.js`:

```js
people = [{ id, name, gender: 'M'|'F', dob, status, notes, photoUrl, family }]
relationships = [
  { type: 'parent', parent, child },
  { type: 'spouse', a, b },
  { type: 'sibling', a, b },
]
```

Edit directly, or use the in-app **+ Add Member** button. The CSV importer accepts `Name, Gender, Date of Birth, Status, Photo URL, Relationship to Existing Member, Select Member`.

## Strategy

See [`docs/data-capture-strategy.md`](docs/data-capture-strategy.md) for the FOMO contribution loop, WhatsApp share copy templates, moderation flow, and backend plan.

## Publish

```bash
./publish.sh
```

Requires `gh auth login` or `GITHUB_TOKEN` in env. Idempotent — safe to re-run.
