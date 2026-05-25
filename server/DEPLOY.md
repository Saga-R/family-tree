# Deploy the Apps Script backend

This turns your existing Google Sheet into the contribution inbox. **One-time setup, ~3 minutes.**

## Steps

1. Open https://script.google.com/ → **New project**
2. Delete the boilerplate `function myFunction()` and paste the entire contents of [`Code.gs`](./Code.gs)
3. Rename the project to **Family Tree backend** (top-left, optional but nice)
4. Save (⌘S). When prompted, allow it to access your Sheets.
5. Click **Deploy → New deployment**
   - Gear icon → **Web app**
   - Description: `Family Tree v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
6. Authorise. (Click *Advanced → Go to Family Tree backend (unsafe)* if Google warns you. It's your own script, talking to your own sheet.)
7. Copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```
8. Open `~/Projects/family-tree/config.js` and paste that URL into `APPS_SCRIPT_URL`.
9. From `~/Projects/family-tree/` run:
   ```bash
   git add config.js && git commit -m "wire apps script url" && git push origin main
   ```
   GitHub Pages will redeploy in ~30s.

## Verify

After deployment:

```bash
URL="<paste-your-web-app-url-here>"
# 1) List endpoint should return empty
curl -sL "$URL?action=list"
# → {"approved":[],"pending":0}

# 2) POST a fake submission
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"name":"Test Person","gender":"F","dob":"1990","status":"Alive","anchorName":"Asaramji Daliya","relType":"sibling"}' \
  "$URL"
# → {"ok":true}

# 3) Open the Google Sheet — you should see a new "Submissions" tab with that row, status=pending.
# 4) Type "approved" in the Status cell, re-run list — it should appear.
```

## How approval works

1. A family member taps **Add me** in the app → opens the wizard → submits.
2. A row appears in the **Submissions** tab of your Sheet with `Status = pending`.
3. You open the sheet, review the row, and change `Status` to `approved` (dropdown).
4. Next visitor to the live site sees the new person in the tree — the app fetches approved rows on load and merges them in.

Reject by setting `Status = rejected`. To edit the proposed person before approving, just fix the cells in the row before flipping the status.

## When the URL changes

If you redeploy (e.g. to update the script), Apps Script gives you a *new* URL **unless** you choose **Deploy → Manage deployments → ⋯ → Edit existing deployment** and bump the version there. Always use *Manage* for updates so the URL stays stable.
