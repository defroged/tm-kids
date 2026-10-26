const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'narrations/books.json'), 'utf8'));
const player = fs.readFileSync(path.join(root, 'narrations/player.html'), 'utf8');
const chooser = fs.readFileSync(path.join(root, 'narrations/choose.html'), 'utf8');
const old = '/members/word-rhythm/word-rhythm-2020-2-3';

test('printed QR paths point to the two-book chooser', () => {
  for (const source of [old, old + '/']) {
    assert.ok(config.rewrites.some(rule =>
      rule.source === source && rule.destination === '/narrations/choose.html'));
  }
  assert.ok(!config.rewrites.some(rule => rule.source.includes('/members/:')));
  assert.deepEqual(catalog.sharedPages[0].slugs,
    ['the-hermit-crab-and-his-beautiful-shell', 'yukis-musical-trip']);
  assert.equal(catalog.sharedPages[0].path, old + '/');
});

test('individual pages remain separate', () => {
  for (const source of ['/listen/:slug', '/listen/:slug/']) {
    assert.ok(config.rewrites.some(rule =>
      rule.source === source && rule.destination === '/narrations/player.html'));
  }
  assert.match(player, /audio\.controls = true/);
  assert.doesNotMatch(player, /<nav\b|<img\b|<a\b/i);
});

test('SEO exclusion rules cover chooser, players, and MP3 assets', () => {
  for (const source of [old, old + '/', '/listen/:slug', '/listen/:slug/', '/narrations/:path*']) {
    const rule = config.headers.find(r => r.source === source);
    assert.ok(rule, 'missing noindex header ' + source);
    assert.ok(rule.headers.some(h => h.key.toLowerCase() === 'x-robots-tag' &&
      h.value.includes('noindex')));
  }
  assert.match(chooser, /<meta name="robots" content="noindex/);
  assert.match(player, /<meta name="robots" content="noindex/);
});

test('shared URL offers named native players, not a silent redirect', () => {
  assert.match(chooser, /document\.createElement\('h2'\)/);
  assert.match(chooser, /document\.createElement\('audio'\)/);
  assert.match(chooser, /audio\.controls = true/);
  assert.match(chooser, /audio\.preload = 'metadata'/);
  assert.doesNotMatch(chooser, /<nav\b|<img\b|<a\b/i);
});

test('book catalog has two unique slugs and planned audio paths', () => {
  assert.equal(catalog.books.length, 2);
  const slugs = new Set();
  for (const book of catalog.books) {
    assert.match(book.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(book.title && book.title.trim());
    assert.ok(!slugs.has(book.slug), 'duplicate slug');
    slugs.add(book.slug);
    assert.match(book.audioSrc, /^\/narrations\/audio\/[\w.-]+\.mp3$/);
  }
  for (const entry of catalog.sharedPages) {
    for (const slug of entry.slugs) assert.ok(slugs.has(slug), 'invalid catalog reference');
  }
});
