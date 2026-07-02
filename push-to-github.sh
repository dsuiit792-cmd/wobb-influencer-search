#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# Wobb Assignment — one-command GitHub push script
# Run this ONCE from inside the project folder:
#   chmod +x push-to-github.sh && ./push-to-github.sh
# ─────────────────────────────────────────────────────────────────

set -e

echo ""
echo "════════════════════════════════════════"
echo "  Wobb Assignment — GitHub Push Script"
echo "════════════════════════════════════════"
echo ""

# ── 1. Collect inputs ────────────────────────────────────────────
read -p "Your GitHub username     : " GH_USER
read -p "Your full name           : " GH_NAME
read -p "Your GitHub email        : " GH_EMAIL
read -s -p "GitHub Personal Access Token (classic, repo scope): " GH_TOKEN
echo ""
read -p "Repo name (e.g. wobb-influencer-search): " REPO_NAME

echo ""
echo "Creating GitHub repository '$REPO_NAME'..."

# ── 2. Create repo via API ───────────────────────────────────────
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":false,\"description\":\"Wobb Vibe Coder Intern Assignment — Sujit\"}")

if [ "$HTTP_STATUS" = "201" ]; then
  echo "✅ Repository created successfully."
elif [ "$HTTP_STATUS" = "422" ]; then
  echo "⚠️  Repository already exists — will push to it."
else
  echo "❌ Failed to create repository (HTTP $HTTP_STATUS). Check your token and try again."
  exit 1
fi

# ── 3. Set git identity ──────────────────────────────────────────
git config user.name "$GH_NAME"
git config user.email "$GH_EMAIL"

# ── 4. Push ─────────────────────────────────────────────────────
REMOTE_URL="https://$GH_TOKEN@github.com/$GH_USER/$REPO_NAME.git"

if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git push -u origin master --force

echo ""
echo "════════════════════════════════════════"
echo "✅ Done! Your repo is live at:"
echo "   https://github.com/$GH_USER/$REPO_NAME"
echo ""
echo "📧 Now reply to Lohit's email with that URL."
echo "════════════════════════════════════════"
echo ""
