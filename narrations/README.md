# QR-linked narrations (TM Kids)

Two already-printed books point to the SAME old WordPress URL:
`https://www.tm-kids.com/members/word-rhythm/word-rhythm-2020-2-3/`

It is impossible to distinguish which QR code was scanned from that URL.
The old URL therefore serves `narrations/choose.html`: a lightweight list
of TWO native browser audio players, one for each book. Nothing is linked
from the main website.

Unique listen pages still exist:
- `/listen/the-hermit-crab-and-his-beautiful-shell/`
- `/listen/yukis-musical-trip/`

Both unique pages use `narrations/player.html` and show only a native audio
player. They are suitable for newly printed QR codes.

## Complete the audio uploads

The GitHub connector can edit source text but cannot upload the binary MP3s.
Upload the two supplied MP3 recordings using GitHub's **Add file > Upload files**
to `master`, in directory `narrations/audio/` using EXACT names:

1. `the-hermit-crab-and-his-beautiful-shell.mp3`
2. `yukis-musical-trip.mp3`

The `narrations/books.json` catalog already references those exact paths.
No further source edit is needed. Test the old URL and both /listen/ URLs
after GitHub/Vercel publishes the audio. Until then, the players report
that the narration is unavailable, rather than playing unrelated audio.

For future books add a catalog entry to `narrations/books.json`. For
additional old shared QR URLs create a `sharedPages` record and an exact
rewrite in `vercel.json`. Do NOT route all /members/ paths to the chooser.

## Privacy / SEO

All related HTML pages and locally hosted MP3s receive X-Robots-Tag:
`noindex, nofollow, noarchive`, plus a robots meta noindex on HTML.
Do not disallow these URLs in robots.txt: crawlers need to see noindex.
They are not included in navigation or sitemaps.

**Noindex does not restrict access.** Everyone with a link can listen and
files committed to this public GitHub repository are publicly downloadable.
If strict access control is needed, change the hosting architecture.

Run `node --test tests/narrations.test.cjs` to validate routing and catalog.
