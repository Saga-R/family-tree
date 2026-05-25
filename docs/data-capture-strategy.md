# Growing the Tree — Data Capture Strategy

> "I want family members to feel FOMO, see this is cool, notice their name is missing, and add their own details." — Sagar

---

## 1. North Star

Turn the family tree from **your private project** into a **shared family ritual** where every member contributes a node. Optimise for:

| | |
|---|---|
| **Emotional pull** | Wow → Where am I? → Let me add my branch |
| **Time-to-contribute** | Under 90 seconds on a phone, no signup |
| **Quality of data** | You stay the moderator; nothing goes live without your nod |
| **Compounding** | Each contributor pulls in 3–5 more relatives |

The cleverness is that adding yourself **only makes sense** if you know who you're related to — which means the contributor naturally also adds parents, spouse, kids in one sitting. The tree grows in branches, not isolated dots.

---

## 2. The Three-Beat Loop (Tease → Hook → Harvest)

### Beat 1 — Tease (WhatsApp delivery)
A WhatsApp message with a thumbnail PNG of the tree + tagline + link. Two variants:

**To someone already in the tree**

> 🌳 *Our family tree is taking shape.*
> Built across 5 generations and 32 members so far — Daliyas, Kalantris, Kasats, Sawals, Mantris.
>
> Tap in — your name's there but a lot's still blank.
> 👉 https://daliyatree.com/?to=ashok-mama
>
> — Sagar

**To someone NOT yet in the tree**

> 🌳 *Our family tree is taking shape.*
> Built across 5 generations and 32 members so far — Daliyas, Kalantris, Kasats, Sawals, Mantris.
>
> But you're not in it yet. Help me fix that?
> 👉 https://daliyatree.com/?invite=cousin-shrutika
>
> — Sagar

The `?to=` or `?invite=` token personalises the landing page. **They never see a generic homepage** — they always see a page that already knows who they are or who they should be.

### Beat 2 — Hook (Personalised landing)
The tree loads pre-centred and pre-zoomed on their family branch, with their relatives highlighted and an empty "ghost card" labelled with **their name** sitting next to where they belong.

```
                 [ Ashok Daliya ] ─── [ Santosh Daliya ]
                                │
              ┌─────────────────┼─────────────────┐
              │                                   │
       [ Sagar Daliya ]                  ┌─ ─ ─ ─ ─ ─ ─ ─ ┐
                                          │  Shrutika Daliya │  ← pulsing
                                          │   (Tap to add)    │
                                          └─ ─ ─ ─ ─ ─ ─ ─ ┘
```

Top-of-page banner:

> **Hi Shrutika 👋 — Sagar made this for the family.**
> You're missing from the tree. Spend 60 seconds to add yourself?
>
> [ Add my details → ]   [ Just browse ]

If the person *is* already in the tree, the hook is different: their card pulses, side panel auto-opens with a **"What we know / What's missing"** view, and the CTA is *"Add your spouse, kids, or anyone else missing"*.

### Beat 3 — Harvest (Guided add flow)
A wizard, not a form. One screen per question. Mobile-first.

```
┌────────────────────────────────────────┐
│  ●○○○○                       skip ⤴   │
│                                        │
│  Who are you in the family?            │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 🔍  Type your name…              │  │
│  └──────────────────────────────────┘  │
│                                        │
│   Or pick the relation that fits:      │
│                                        │
│   ◯  I'm someone's child               │
│   ◯  I'm someone's spouse              │
│   ◯  I'm someone's sibling             │
│   ◯  I'm someone's parent              │
│                                        │
│                          [ Next → ]    │
└────────────────────────────────────────┘
```

Step sequence:
1. **Who is your anchor?** — searchable dropdown of existing members, pre-filled from invite token if known
2. **What's the relationship?** — child / spouse / sibling / parent (with a "this person's wife" / "this person's husband" upgrade if relevant)
3. **Your name & gender** — text + 2 buttons
4. **Birth year (optional)** — slider 1900–2026
5. **Photo (optional)** — camera or upload, with "skip" as a first-class action
6. **Anyone else you want to add while you're here?** — same form, pre-filled with the just-added person as the anchor. Chains naturally: "Add my husband" → "Add our kids" → "Add my parents".
7. **Confirmation** — "Got it. Sagar will see this and add you to the live tree shortly. Want to share with the family?" → WhatsApp share button pre-loaded.

**Why a chain.** Most new contributors don't think of themselves as one node — they think "me + my husband + our two kids + my parents." Letting them dump the whole micro-family in one sitting is what makes this 10× more efficient than a one-at-a-time form. Each "add another" reuses the same wizard with the last person as the implicit anchor.

---

## 3. Surface Changes Inside the Tree App

The current app is read-only. To make it pull contributions, four things are added:

### A) Ghost cards
Wherever the tree has a sniff of a gap (a married couple with no listed kids, a person whose parents are unknown, a sibling slot that's empty per family lore), render a dashed-outline card:

```
  ┌─ ─ ─ ─ ─ ─ ─ ─ ┐
  │   + Add a child  │
  │   of Sagar & Riya│
  └─ ─ ─ ─ ─ ─ ─ ─ ┘
```

These are not data — they're suggestions, driven by simple rules:
- "Spouse pair with no children listed" → invite to add child
- "Person born before 1970 with no parents listed" → invite to add parents
- "Family branch with only one member in a generation" → invite to add siblings

Tap a ghost → opens the wizard pre-anchored to that gap. Massively reduces the "where do I click?" friction.

### B) "I'm here" / "I'm missing" floating CTA
Bottom-right pill, always visible:

```
   ┌────────────────────────────────┐
   │  👋  Are you in the tree?      │
   │      [ Add me ] [ Find me ]    │
   └────────────────────────────────┘
```

Find me → opens the search with a friendly prompt. Add me → wizard.

### C) Per-card "missing info" hints
A small "+" appears on hover/long-press of any card. Options:

- *Add their spouse*
- *Add their child*
- *Add their parent*
- *Suggest a correction* (typo, wrong date, etc.)

### D) Stats banner
A persistent footer pill (already exists) becomes a **bait**:

> **32 members across 5 families · 8 pending additions ✨ · Last update 3 days ago**

Showing pending additions is itself FOMO — relatives realise others are contributing.

---

## 4. Admin (Moderation) Experience

You stay the gatekeeper. Nothing a contributor submits goes live until you approve.

```
┌─ Inbox (8 pending) ──────────────────────────────────────┐
│                                                          │
│  ●  Shrutika Daliya  · 2h ago                            │
│      added by herself · invited as cousin-shrutika       │
│      F · b. 1995 · daughter of Naresh & Sushila          │
│      "I also added my husband Karan and son Vivaan"      │
│      [ Approve all 3 ]  [ Edit ]  [ Reject ]             │
│                                                          │
│  ●  Anonymous · 5h ago                                   │
│      added "Pratiksha Mantri" as sibling of Nikunj       │
│      F · b. 1988 · no photo                              │
│      [ Approve ]  [ Edit ]  [ Reject ]  [ Block this IP ]│
│                                                          │
│  ●  Rajgouri (via her invite link) · 1d ago              │
│      added old photo to her own card                     │
│      [ Approve ]  [ Reject ]                             │
└──────────────────────────────────────────────────────────┘
```

- **One-tap approve** moves the submission into `familyData.js` and re-renders.
- **Edit** opens the standard Add Member modal pre-populated, so you can fix names, dates, family attribution before approving.
- **Trust levels**: a contributor whose first submission is approved gets a cookie; their next submission shows up with a green "Previously verified" tag — still queued, but with a one-click bulk-approve.
- **Notifications**: WhatsApp ping to you when a new submission lands, with a "tap to review" deep link. Daily digest at 9pm if you didn't act sooner.

---

## 5. Data Layer

Today the tree is fully client-side. To accept contributions, we need a tiny server. Three realistic options:

| | Effort | Cost | Fits because |
|---|---|---|---|
| **Google Apps Script + the existing Sheet** | Half-day | $0 | You already have the sheet; family is comfortable in Google; admin can edit the sheet from a phone |
| **Cloudflare Workers + KV** | 1 day | $0 (free tier) | Faster, programmable, custom domain |
| **Supabase / Firebase** | 1.5 days | $0–$5/mo | Auth, photo storage, realtime — overkill but future-proof |

**Recommendation: Google Apps Script.** Reason: the Sheet you already shared is the source of truth, and Apps Script can both *receive* form POSTs and *append* rows. You stay in your existing workflow. Anyone can view the sheet to audit. Migration to a real backend later is trivial because the schema is so small.

### Data flow

```
   Family member (WhatsApp link)
            │
            ▼
   Personalised landing  ──── reads ──── familyData.json  (static, GitHub Pages)
            │
            ▼
   Add-member wizard
            │
            ▼  POST
   Apps Script endpoint ──── appends ──── "Submissions" sheet (with reviewer fields)
            │
            ▼  email/WhatsApp ping
   Sagar's review inbox
            │
            ▼  approve
   "Members" sheet  ──── nightly build ──── familyData.json  (auto-PR via GitHub Action)
            │
            ▼
   Live tree updates
```

The static-file + nightly-rebuild design means the live tree is always blazing fast and cache-friendly; only the contribution path hits a server.

### Submissions sheet columns

```
timestamp · invite_token · contributor_name · contributor_phone? ·
proposed_name · gender · dob · status · photo_url · notes ·
anchor_member · relationship · status_review · reviewer_note ·
approved_at · approved_by · final_member_id
```

Cookie-based "trust score" lives in a second tiny table keyed by token.

---

## 6. WhatsApp Share Copy (ready to use)

Variants tuned to the recipient:

**For elders (Hindi/English mix)** — short, respectful, "your blessings":

> 🌳 *Hamari family tree taiyaar ho rahi hai.*
> 5 generations, 32 members — par aapki yaadein, photos, aur details abhi adhuri hain.
>
> 2 minute lagenge — tap karke add karen 🙏
> 👉 https://daliyatree.com/?to=narsinghdas-dada
>
> — Sagar

**For cousins** — playful:

> bhai dekh — family tree banayi hai 🌳
> tu nahi hai. literally hum sab hain, tu missing hai 😭
> 1 min lagega: https://daliyatree.com/?invite=karan-bhai

**For in-laws** — softer, asks for help:

> Hi Bhabhi — putting together a family tree for everyone. Your side (Kasat family) is the thinnest right now. If you can add yourself + the kids it'll really flesh it out 🌳
>
> 👉 https://daliyatree.com/?invite=bhabhi-sangita

**Generic broadcast (WhatsApp Status)** — pulls the curious:

> Built a family tree 🌳 5 generations, 32 of us so far.
> Tap to find yourself: https://daliyatree.com

---

## 7. Engagement Loops (Beyond First Submission)

The first add is the hardest. After that:

1. **"You added 4 members 🎉"** badge on submission success → ego loop
2. **WhatsApp share button** auto-loaded with "I just added our branch to the family tree, your turn 👇"
3. **Photo prompts** weekly — "Got an old photo of Asaramji Dada? Tap to add"
4. **Birthday/anniversary cards** auto-generated from the data — keeps the tree top-of-mind
5. **"Family of the month"** highlights the branch with the most new contributions
6. **Annual snapshot** — PDF export of the tree as it stood on Diwali, archived

Each loop reuses the same underlying contribution path. None of them require new infra.

---

## 8. Trust, Abuse & Privacy

A public link is a public link. Mitigations:

- **No PII fields by default.** Phone number / address are *not* requested. Just name, gender, year-of-birth, photo, relationships.
- **Photos go to a private Drive folder**, not direct upload — keeps storage cheap and the public bundle photo-free until you approve.
- **Rate-limit per IP / token** on the Apps Script endpoint.
- **Honeypot field** in the form to catch dumb bots.
- **Soft-delete** instead of hard-delete on rejected submissions — auditable.
- **Read-only public view** is the default; live tree shows only approved data.
- **Invite token TTL** — long (90 days) but expirable, so a link forwarded to a stranger years later doesn't keep working.

For a really sensitive variant, the tree itself could require a password (one shared family password is fine), and only the Add flow is open.

---

## 9. Recommended Build Order

### MVP — "Shareable" (≈ 1 working day)
- Static tree already public (Pages or Netlify)
- Add-member wizard component (chain-aware)
- Apps Script endpoint → Submissions sheet
- Tiny admin page (or just review the sheet) with an "Approve" column
- WhatsApp share copy templates
- Personalised `?to=` and `?invite=` tokens
- Floating "Add me / Find me" CTA

This is enough to ship to 10 close cousins this week and start the flywheel.

### v1 — "Sticky" (≈ +2 days)
- Ghost cards for gaps
- Per-card "+" menu (add spouse / child / parent)
- Trust-level auto-approve for repeat contributors
- WhatsApp ping for new submissions (Twilio or a free service)
- Pending-additions counter in footer pill ("8 pending ✨")

### v2 — "Self-sustaining" (≈ +3 days)
- Photo upload via Drive
- Birthday/anniversary engagement loop
- Annual PDF snapshot export
- Delegated moderation (let an aunt approve her own sub-branch)

---

## 10. Locked Decisions (round 1)

| Question | Decision |
|---|---|
| Domain | Default `sagar-yp.github.io/family-tree/` for now. No purchase. |
| Languages | Bilingual — English + हिन्दी, with an in-app toggle and `?lang=` URL param. |
| Access | Public link, no password. |
| Moderation | Sagar only. No delegated moderators. |
| Distribution | **One generic link** dropped in the family WhatsApp group. No personalised `?invite=` tokens going out. |
| Notifications | New-submission pings to Sagar's number only. |

### What "group-share only" changes
- The personalised `?to=` / `?invite=` paths are still in the code (useful if you forward to one cousin later) — but they aren't part of the main flow.
- The **generic welcome screen** is now the single conversion surface. It has to land FOMO in 4 seconds.
  - Title: "**32 of us are in here. Are you?**"
  - Two CTAs side-by-side: "**I'm missing — add me**" / "Find me in the tree" (so people who *are* in don't bounce)
- The floating "Are you in the tree? [Add me] [Find me]" pill becomes critical — anyone who dismissed the welcome still has a persistent nudge.
- The pending-submissions counter in the footer (once the backend lands) becomes the second nudge: "8 pending ✨" tells lurkers others are contributing.
- We should plan to **re-share the link in the group** weekly with an updated stat: "**+7 new members this week — Karan, Vivaan, Pratiksha, Anuj, …** see if your branch is still incomplete: <link>". Each re-share generates a fresh wave of clicks.

These constraints shape the MVP:

- No auth flow on the contributor side — `?invite=` token is the only personalisation.
- No multi-admin UI — the moderator inbox is just for Sagar.
- Public read is the default. Wizard + ghost cards are visible to anyone with the URL.
- Languages affect **every** user-facing string. Date formats and number words stay numeric (no Devanagari digits) to avoid confusion across generations.
