const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'narrations/books.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'narrations/player.html'), 'utf8');
const old = '/members/word-rhythm/word-rhythm-2020-2-3';

test('printed QR legacy URL variants and per-book URLs map to player', () => {
  for (const source of [old, old + '/', '/listen/:slug', '/listen/:slug/']) {
    assert.ok(config.rewrites.some(rule => rule.source === source &&
      rule.destination === '/narrations/player.html'), source);
  }
  assert.ok(!config.rewrites.some(rule => rule.source.includes('/members/:')),
    'Do not rewrite unrelated legacy members URLs');
});

test('HTTP headers prevent search engine indexing without blocking crawling', () => {
  for (const source of [old, old + '/', '/listen/:slug', '/listen/:slug/', '/narrations/:path*']) {
    const rule = config.headers.find(r => r.source === source);
    assert.ok(rule, 'No HTTP noindex rule on ' + source);
    assert.ok(rule.headers.some(h => h.key.toLowerCase() === 'x-robots-tag' &&
      h.value.includes('noindex')));
  }
  assert.match(html, /<meta name="robots" content="noindex/);
});

test('the book page is a minimal native audio player', () => {
  assert.match(html, /document\.createElement\('audio'\)/);
  assert.match(html, /audio\.controls = true/);
  assert.match(html, /audio\.preload = 'metadata'/);
  assert.doesNotMatch(html, /<nav\b|<img\b|<a\b/i);
  assert.match(html, /Narration is not available yet/);
});

test('catalog has distinct book routes, clean paths, and existing audio where specified', () => {
  assert.ok(Array.isArray(catalog.books));
  const slugs = new Set();
  const paths = new Set();
  for (const book of catalog.books) {
    assert.match(book.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(book.title && book.title.trim());
    assert.ok(!slugs.has(book.slug), 'duplicate slug');
    slugs.add(book.slug);
    assert.ok(book.audioSrc === null ||
      /^\/narrations\/audio\/[\w.-]+\.(mp3|m4a|ogg)$/i.test(book.audioSrc));
    if (book.audioSrc) assert.ok(fs.existsSync(path.join(root, book.audioSrc.slice(1))),
      'audio file missing: ' + book.audioSrc);
    for (const legacy of book.legacyPaths || []) {
      assert.match(legacy, /^\/members\/[^/]+\/[^/]+\/$/);
      assert.ok(!paths.has(legacy), 'duplicate legacy route');
      paths.add(legacy);
      assert.ok(config.rewrites.some(r => r.source === legacy &&
        r.destination === '/narrations/player.html'), 'missing rewrite ' + legacy);
    }
  }
});
