# Family Tree Visualiser

Single-file HTML app for exploring and editing a family tree.

## Run

```
open index.html
```

Works offline from `file://` — the only dependency is D3 v7 via CDN. On first load it seeds the 14-person sample (the Daliya family) so you can play with visuals immediately.

## Features

- Nodes coloured by gender (left border: blue=Male, pink=Female, grey=Other)
- Deceased members shown desaturated with a dashed border and a "†"
- Couples drawn side-by-side; children drop from the couple's midpoint
- Multiple "origin families" are detected via blood lines and highlighted with a coloured hull (e.g. the Kalantri hull bridges into the Daliya hull through Santosh)
- Pan & zoom (drag / scroll)
- Click any node to inspect, edit, jump to relatives, or delete

## Input formats

The CSV schema matches the bootstrap sheet:

```
Name,Gender,Date of Birth,Status,Photo URL,Relationship to Existing Member,Select Member
```

`Relationship to Existing Member` accepts: `Spouse` / `Wife` / `Husband`, `Child`, `Parent`, `Father`, `Mother`, `Sibling`. One relationship is enough — the app derives:

- **Child** of a married person → automatically gets the spouse as the second parent
- **Sibling** → shares parents with the referenced member
- **Father/Mother** → sets gender and adds the reverse parent link

## Adding new members

Use the **Add member** tab in the sidebar:
1. Fill in Name, Gender, DOB, Status, Photo URL
2. Pick a relationship and the existing member it refers to
3. Submit — the app wires up every implied edge

## Storage

State is saved to `localStorage` under `familyTree.v1`. Use **Export CSV** to back it up, **Reset to sample** to restore the bootstrap data, or **Clear all** to start from scratch.
