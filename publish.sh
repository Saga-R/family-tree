#!/usr/bin/env bash
# Publish family-tree to GitHub. Run this once after `gh auth login` succeeds.

set -e
cd "$(dirname "$0")"

REPO_NAME="family-tree"
VISIBILITY="--private"      # change to --public if you want Pages on free plan
DESCRIPTION="Daliya family tree — bilingual EN/हिन्दी visualiser, with FOMO-driven contribution capture"

echo "→ Checking gh auth"
gh auth status >/dev/null 2>&1 || { echo "✗ Not authenticated. Run: gh auth login"; exit 1; }

USER="$(gh api user --jq .login)"
echo "→ Authenticated as $USER"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "→ git init"
  git init -q
  git checkout -q -b main 2>/dev/null || git branch -M main
fi

# Stage everything (gitignore handles noise)
echo "→ staging"
git add -A

# Initial commit only if there isn't one yet
if ! git rev-parse HEAD >/dev/null 2>&1; then
  git -c commit.gpgsign=false commit -q -m "Initial commit: bilingual family tree visualiser

- React + D3 single-page app (CDN, no build step)
- 32 members across 5 families (Daliya, Kalantri, Kasat, Sawal, Mantri)
- Bilingual EN/हिन्दी with in-app toggle and ?lang= URL param
- Personalised welcome via ?to= / ?invite= URL tokens
- Floating 'Are you in the tree?' CTA for group-share distribution
- CSV import, in-app Add Member with one-relationship inference
- docs/data-capture-strategy.md describes the FOMO contribution loop

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
fi

# Create or reuse remote repo
if gh repo view "$USER/$REPO_NAME" >/dev/null 2>&1; then
  echo "→ repo exists: $USER/$REPO_NAME"
else
  echo "→ creating $USER/$REPO_NAME ($VISIBILITY)"
  gh repo create "$REPO_NAME" $VISIBILITY --description "$DESCRIPTION" --source=. --remote=origin --push
  echo "✓ pushed initial commit"
fi

# Ensure remote is wired and push any newer commits
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$USER/$REPO_NAME.git"
git push -u origin main 2>&1 | tail -3

# Try to enable Pages from main / root
echo "→ attempting to enable GitHub Pages"
if gh api -X POST "repos/$USER/$REPO_NAME/pages" -f source[branch]=main -f source[path]=/ >/dev/null 2>&1; then
  echo "✓ Pages enabled (may need 30-60s to publish)"
elif gh api -X PUT "repos/$USER/$REPO_NAME/pages" -f source[branch]=main -f source[path]=/ >/dev/null 2>&1; then
  echo "✓ Pages updated"
else
  echo "⚠ Pages enable failed — likely a free-plan + private repo limitation."
  echo "   To enable Pages on a private repo you need GitHub Pro, OR change the repo to public:"
  echo "     gh repo edit $USER/$REPO_NAME --visibility public --accept-visibility-change-consequences"
fi

URL="https://$USER.github.io/$REPO_NAME/"
echo
echo "Repo:  https://github.com/$USER/$REPO_NAME"
echo "Site:  $URL  (live in 30–60s once Pages publishes)"
