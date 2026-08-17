# Last Title Standing Privacy Policy

**Effective date:** 16 August 2026
**Publication status:** Review draft for current source version `1.5.1`; public
publication and installed-version status remain separate release gates

This policy explains how Last Title Standing handles information when it is
installed in a subreddit and used on Reddit. It applies to the Devvit app and
its Redis and media data for the game. Reddit's own services remain subject to
Reddit's User Agreement and Privacy Policy.

## What the app receives

When Reddit provides the app context, the app may receive:

- the current post ID and subreddit name;
- the signed-in Reddit user ID and username when a person votes, nominates,
  creates a game, manages a game, or opens creator tools;
- the user's current moderator status and, when the subreddit uses the
  approved-creator policy, whether the user has been approved; and
- the title and poster information that a user selects or searches for through
  TMDB.

The app does not request or collect Reddit passwords, email addresses, payment
information, precise location, contacts, private messages, subscription lists,
saved content, browsing history, or an external account. It does not use
cross-site advertising, behavioral profiling, or automated decisions about a
person's sensitive characteristics.

## What the app stores

Game data is stored in Devvit-hosted Redis. The stored records can include:

- the game and post IDs, subreddit, debate title, selected TMDB IDs and title
  metadata, poster paths, Reddit-hosted poster URLs, round state, results,
  history, and timestamps;
- Reddit user IDs in per-round vote and nomination keys, used only to enforce
  one locked action per round and to let a person remove their own nomination
  when allowed;
- the creator's Reddit user ID and username in game state and Reddit post
  metadata so the creator is attributed and can manage their own game;
- approved-creator records containing user ID, username, approval time, and
  the approving moderator's username;
- moderation audit entries containing the acting user ID and username, action,
  free-form moderation reason/detail, and time; and
- a creator's in-progress game draft, which is configured to expire after ten
  minutes.

Poster images may also be uploaded to Reddit-hosted media. A Redis poster-cache
entry stores the associated TMDB title/poster reference and the resulting
Reddit media URL so later games can reuse the upload.

The app may write operational error logs containing post/game identifiers and
technical error details. It does not intentionally put the TMDB API token in
client responses or logs.

## How the information is used

The app uses this information to:

1. load a game for a Reddit post;
2. prevent duplicate matchup votes and challenger-queue votes;
3. associate a creator with the game they created and enforce creator/moderator
   controls;
4. publish a creator-confirmed game post on that creator's behalf;
5. keep round history, nominations, results, scheduler transitions, and
   moderation actions consistent; and
6. fetch title metadata and poster images from TMDB.

Reddit user IDs and usernames are not sent to TMDB. Search terms, TMDB IDs, and
title requests are sent to TMDB so the app can resolve titles. Reddit-hosted
media and Devvit-hosted Redis process the information needed to run the game.
The app does not sell, rent, license, or use Reddit user data for advertising,
data brokerage, or model training.

## Who can see information

The creator username is displayed in the game post. Game titles, posters,
round history, aggregate vote totals, and public moderation outcomes may be
visible to Reddit readers. Individual vote keys, user IDs, and the full
moderation audit log are server-side records; they are not displayed to
ordinary players. The backend limits the approved-creator list and audit log
to subreddit moderators, but Creator Studio does not currently display them.
A moderator management and review surface is planned for the next phase.

When a creator explicitly confirms publication, the app submits the new Reddit
post with `runAs: 'USER'` and a user-generated-content declaration. The creator
sees the game preview and the account attribution before confirming. The app
does not automatically submit posts, comments, votes, subscriptions, or direct
messages.

## Retention and deletion

The current source has one automatic expiry: an unfinished create
draft expires after ten minutes. Normal game state, per-round vote records,
approved-creator records, moderation audit entries, and poster-cache entries
currently do not have automatic expiry. This is an identified launch gate, not
a promise that the current implementation already satisfies the final Reddit
deletion workflow.

Before public review, the maintainer must add and verify:

- deletion handling for removed Reddit posts and accounts;
- removal of author-identifying data when the associated Reddit account is
  deleted, while retaining only the minimum non-identifying context required
  for a surviving game record;
- a documented retention schedule for active and completed games; and
- an in-app report and removal path for inappropriate debates or nominations.

Until those controls are implemented, a data or deletion request can be made
through the installing subreddit's Modmail or by contacting
[u/balsimpson](https://www.reddit.com/user/balsimpson/). Do not send a password,
API token, or private account information. Include the subreddit, game post
URL, and a description of the request so the relevant record can be located.

## Security

The TMDB API read-access token is stored as the secret `TMDB_API_KEY` in
Devvit settings and is read only by server code. It must not be committed to
the repository or exposed to the browser. The app uses server-side permission
checks for creator and moderator actions and validates post/game context on
each request.

## Children and sensitive information

Last Title Standing is a Reddit app and is not directed at children under 13.
Do not submit passwords, financial information, health information, or other
sensitive personal information through game titles, nomination text, support
requests, or moderation reasons.

## Changes and contact

This policy may be updated when the app's data practices, permissions, or
retention controls change. The installing subreddit and the app repository's
release notes should identify material changes.

For support or privacy questions, contact the installing subreddit through
Modmail or contact [u/balsimpson](https://www.reddit.com/user/balsimpson/).
