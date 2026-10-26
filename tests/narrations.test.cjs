const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'narrations/books.json'), 'utf8'));
const player = fs.readFileSync(path.join(root, 'narrations/player.html'), 'utf8');
const chooser = fs.readFileSync(path.join(root, 'narrations/choose.html'), 'utf8');
const legacyTwoBooks = '/members/word-rhythm/word-rhythm-2020-2-3';
const legacyMozart = '/im-mozart-narration';
const legacyOrchestra = '/members/word-rhythm/2020-1';

test('existing QR URLs display the right shared or single player', () => {
  for (const [path, target] of [
    [legacyTwoBooks, 'choose.html'],
    [legacyMozart, 'choose.html'],
    [legacyOrchestra, 'player.html']
  ]) {
    for (const source of [path, path + '/']) {
      assert.ok(config.rewrites.some(x => x.source === source &&
        x.destination === '/narrations/' + target), source);
    }
  }
  assert.ok(!config.rewrites.some(x => x.source.includes('/members/:')),
    'Never rewrite unrelated /members/ paths');
});

test('shared QR pages include correct book selection and three Mozart levels', () => {
  const pages = new Map(catalog.sharedPages.map(x => [x.path.replace(/\/+$/, ''), x]));
  assert.deepEqual(pages.get(legacyTwoBooks).slugs, [
    'the-hermit-crab-and-his-beautiful-shell', 'yukis-musical-trip'
  ]);
  assert.deepEqual(pages.get(legacyMozart).slugs, [
    'im-mozart-level-1', 'im-mozart-level-2', 'im-mozart-level-3'
  ]);
  assert.equal(pages.get(legacyMozart).title, "I'm Mozart");
  assert.match(chooser, /headingMain.textContent = page.title/);
});

test('each book has its own /listen route and controls use native audio', () => {
  for (const path of ['/listen/:slug', '/listen/:slug/']) {
    assert.ok(config.rewrites.some(x => x.source === path &&
      x.destination === '/narrations/player.html'));
  }
  assert.match(player, /audio\.controls = true/);
  assert.match(chooser, /audio\.controls = true/);
  assert.match(chooser, /audio\.preload = 'metadata'/);
  assert.doesNotMatch(player, /<nav\b|<img\b|<a\b/i);
  assert.doesNotMatch(chooser, /<nav\b|<img\b|<a\b/i);
});

test('all narration routes and audio assets declare noindex', () => {
  const sources = [
    legacyTwoBooks, legacyTwoBooks + '/',
    legacyMozart, legacyMozart + '/',
    legacyOrchestra, legacyOrchestra + '/',
    '/listen/:slug', '/listen/:slug/', '/narrations/:path*'
  ];
  for (const source of sources) {
    const rule = config.headers.find(x => x.source === source);
    assert.ok(rule, 'Missing X-Robots-Tag rule ' + source);
    assert.ok(rule.headers.some(h => h.key.toLowerCase() === 'x-robots-tag' &&
      h.value.includes('noindex')));
  }
  assert.match(player, /<meta name="robots" content="noindex/);
  assert.match(chooser, /<meta name="robots" content="noindex/);
});

test('catalog has unique slugs and safe audio sources; missing levels marked unavailable', () => {
  assert.equal(catalog.books.length, 6);
  const slugs = new Set();
  for (const book of catalog.books) {
    assert.match(book.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(book.title && book.title.trim());
    assert.ok(!slugs.has(book.slug), 'Duplicate slug ' + book.slug);
    slugs.add(book.slug);
    assert.ok(book.audioSrc === null || /^\/narrations\/audio\/[\w.-]+\.mp3$/.test(book.audioSrc));
  }
  assert.equal(catalog.books.find(b => b.slug === 'im-mozart-level-2').audioSrc, null);
  assert.equal(catalog.books.find(b => b.slug === 'im-mozart-level-3').audioSrc, null);
  for (const group of catalog.sharedPages) {
    for (const slug of group.slugs) assert.ok(slugs.has(slug), 'Unknown book ' + slug);
  }
  const magic = catalog.books.find(b => b.slug === 'the-magic-orchestra');
  assert.ok(magic.legacyPaths.includes(legacyOrchestra + '/'));
});
