#!/bin/bash
git filter-branch --env-filter '
CORRECT_NAME="Tushar"
CORRECT_EMAIL="170326035+tushar-1226@users.noreply.github.com"
export GIT_COMMITTER_NAME="$CORRECT_NAME"
export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
export GIT_AUTHOR_NAME="$CORRECT_NAME"
export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
' --tag-name-filter cat -- --branches --tags
