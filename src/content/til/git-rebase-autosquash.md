---
author: Sathiyaseelan Ravi
pubDatetime: 2025-01-15T10:00:00Z
title: Git rebase with autosquash
tags:
  - git
  - productivity
description: How to use git rebase --autosquash to automatically organize fixup commits
---

Today I learned about `git rebase --autosquash`, which automatically reorders and marks commits for squashing during an interactive rebase.

## The Problem

When working on a feature branch, you often need to go back and fix earlier commits. You might:
- Fix a typo in commit A
- Add a missing file to commit B
- Update logic in commit C

Traditionally, you'd make these fixes as new commits and then manually reorder and squash them during an interactive rebase.

## The Solution

Git provides special commit prefixes that work with `--autosquash`:

```bash
# Create a fixup commit for a specific commit
git commit --fixup=<commit-hash>

# Or use the commit message
git commit --fixup=":/partial commit message"

# Then rebase with autosquash
git rebase -i --autosquash main
```

## Example Workflow

```bash
# You have commits:
# abc1234 Add user authentication
# def5678 Add user profile page
# ghi9012 Add user settings

# Fix something in the auth commit
git add auth.js
git commit --fixup=abc1234

# Fix something in the profile commit
git add profile.js
git commit --fixup=def5678

# Now rebase - Git automatically reorders the fixup commits!
git rebase -i --autosquash main
```

## Make it Default

You can make autosquash the default behavior:

```bash
git config --global rebase.autosquash true
```

Now `git rebase -i` will always use autosquash behavior.

This has been a game-changer for keeping my commit history clean!