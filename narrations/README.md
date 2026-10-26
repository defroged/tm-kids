# TM Kids QR-linked narrations

The original printed QR URLs remain unchanged, with no public navigation links:

| Original printed QR address | Experience |
| --- | --- |
| `/members/word-rhythm/word-rhythm-2020-2-3/` | Shared page: The Hermit Crab and His Beautiful Shell; Yuki's Musical Trip |
| `/im-mozart-narration` | Shared page: I'm Mozart (Levels 1, 2, 3) |
| `/members/word-rhythm/2020-1/` | Single native player: The Magic Orchestra |

Any new book can use its own `/listen/<slug>/` direct, unlisted page.

## MP3 status

The two original recordings were already uploaded, but using their original
names with spaces and punctuation. Their Git blobs were re-used under the
expected names (no re-upload needed):
- `narrations/audio/the-hermit-crab-and-his-beautiful-shell.mp3`
- `narrations/audio/yukis-musical-trip.mp3`

The two newest uploaded recordings still need to be uploaded to GitHub
using the following exact filenames:
- `narrations/audio/im-mozart-level-1.mp3`
- `narrations/audio/the-magic-orchestra.mp3`

I'm Mozart Level 2 and Level 3 are intentionally unconfigured until their
separate recordings are provided.

To upload, open `narrations/audio` on GitHub's master branch, choose
**Add file > Upload files**, and upload the newly named MP3 files.
Vercel deploys automatically. Both the direct pages and the shared pages
will become playable once the recordings exist. There is no need to edit
the catalog after uploading the two new files.

## SEO and access

The player and chooser HTML include a `robots: noindex` meta tag.
Vercel config returns `X-Robots-Tag: noindex, nofollow, noarchive`
on the known old QR routes, /listen routes and /narrations files,
including MP3 recordings. Do not disallow these URLs in robots.txt,
because crawlers need to read the noindex instructions.
The pages are not in public navigation/sitemaps.

Noindex is not authentication; anyone with the URL can listen, and
GitHub binary files in this public repository can be downloaded.

Run `node --test tests/narrations.test.cjs` to validate the structure.
