# QR-code-linked book narration pages

This adds minimal native audio-player pages to the existing static tm-kids site. It uses Vercel rewrites so QR codes printed with the old WordPress URL open the player without changing the address in the browser.

The implementation deliberately does not rewrite the entire /members/ directory. Only the exact known legacy URL is covered.

## Add a book
1. Upload the licensed narration MP3 or M4A to narrations/audio/.
2. In narrations/books.json, set the title and audioSrc to the actual file, e.g. /narrations/audio/word-rhythm-2020-2-3.mp3. The initial example has a null audioSrc until the audio is supplied.
3. For additional books, add a catalog item with a unique slug, title, audioSrc and exact legacyPaths.
4. Add exact legacy URL rewrites and HTTP noindex headers in vercel.json. New /listen/:slug/ pages use the same shared player.
5. Run node --test tests/narrations.test.cjs, then deploy and test QR scanning and mobile playback.

Until audio is supplied, the placeholder displays "Narration is not available yet."

## No indexing / access
- These pages are not in navigation or sitemap.
- Player has an HTML robots noindex meta tag; Vercel adds X-Robots-Tag noindex to player pages and /narrations/ assets.
- Do NOT block these URLs in robots.txt, which would stop search engines seeing the noindex instructions.
- noindex does not protect access. Anyone with a link can listen; audio committed to this public GitHub repository can also be downloaded from GitHub.
- If an old WordPress URL was already indexed, Search Console removal requests may be necessary.

## Paths
- Printed QR example: /members/word-rhythm/word-rhythm-2020-2-3/
- New unlisted route: /listen/word-rhythm-2020-2-3/
- Player template: /narrations/player.html
- Catalog: /narrations/books.json

Each book has a unique page address, with a shared small HTML player template.
