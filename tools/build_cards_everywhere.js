#!/usr/bin/env node
/* OKLA – build public/v91/okla_cards_everywhere.css
   ------------------------------------------------------------------------
   The homepage product card is defined by several layers that only target the
   homepage sliders (.okla-slider-shell / .okla-slider-track): legacy v53, the
   mobile unification sheet, okla_home.css and okla_product_cards.css. Every
   other product grid (category, search, brand pages, AJAX-sorted listings …)
   had its own hand-made imitation, which drifted.

   This script copies every card rule of those layers, in the same cascade
   order, and re-targets it to `.okla-cards` – the class okla_native_pages.js
   puts on every non-homepage product grid. Rules for the slider itself
   (track/viewport/controls) and the layout properties of the card cell are
   left out, so each grid keeps its own columns. The copied selectors get a
   2-ID boost so they beat the older listing-specific rules.

   Run after changing any homepage card style:   node tools/build_cards_everywhere.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'public');

/* Homepage cascade order (document order of the style sheets on okla.cz). */
function v53css() {
  const src = fs.readFileSync(path.join(ROOT, 'legacy/v53/zapati_firsthalf.js'), 'utf8');
  const start = src.indexOf('String.raw`');
  const end = src.indexOf('\n`;', start);
  if (start < 0 || end < 0) throw new Error('v53 css block not found');
  return src.slice(start + 'String.raw`'.length, end);
}
const SOURCES = [
  ['legacy/v53/zapati_firsthalf.js', v53css],
  ['v91/okla_mobile_unified.css'],
  ['v91/okla_home.css'],
  ['v91/okla_product_cards.css'],
];

const GRID = '.okla-cards:not(#okla-cards-a#okla-cards-b)';
/* Grid-cell properties that belong to the slider layout, not to the card look. */
const CELL_LAYOUT = /^(display|flex|flex-basis|flex-grow|flex-shrink|flex-direction|flex-wrap|width|min-width|max-width|height|min-height|max-height|float|clear|order|margin(-\w+)?|padding(-\w+)?|grid(-[\w-]+)?|zoom|transform|transform-origin|will-change|scroll-snap-[\w-]+|content-visibility|contain|inset|top|left|right|bottom)$/;
const SLIDER_PARTS = /okla-slider-(controls|viewport|dots?|btn|button|arrow|prev|next|nav|progress)|homepage-products-\d|okla-slider-heading|homepage-group-title/;

/* ---------- tiny CSS parser (rules, @media/@supports blocks) ---------- */
function stripComments(css) {
  let out = '', i = 0, q = null;
  while (i < css.length) {
    const c = css[i];
    if (q) { out += c; if (c === '\\') { out += css[i + 1] || ''; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; out += c; i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? css.length : e + 2; continue; }
    out += c; i++;
  }
  return out;
}
function matchBrace(css, open) {
  let depth = 0, q = null;
  for (let i = open; i < css.length; i++) {
    const c = css[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  return css.length - 1;
}
function parse(css) {
  const nodes = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const prelude = css.slice(i, open).trim().replace(/^[;}\s]+/, '');
    const close = matchBrace(css, open);
    const body = css.slice(open + 1, close);
    if (/^@(media|supports)/i.test(prelude)) nodes.push({ at: prelude, children: parse(body) });
    else if (prelude.startsWith('@')) { /* keyframes, font-face … not card rules */ }
    else nodes.push({ sel: prelude, decl: body });
    i = close + 1;
  }
  return nodes;
}
function splitTop(s, sep) {
  const out = []; let depth = 0, q = null, cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === '\\') { cur += s[++i] || ''; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === '(') depth++; else if (c === ')') depth--;
    if (c === sep && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}

/* ---------- selector rewrite ---------- */
/* The copies must keep the homepage cascade exactly, so every rewritten
   selector keeps its original specificity + the same (2,0,0) boost:
   removed/replaced classes are re-added by repeating .okla-cards
   (a repeated class counts once per repetition). */
function rewrite(sel) {
  if (SLIDER_PARTS.test(sel)) return null;
  /* Homepage-only card rules without a slider token:
     `body.type-index #content .product …` -> `body #content GRID .product …`
     (type-index is swapped for .okla-cards, so the class count stays equal). */
  if (!/okla-slider-(track|shell)/.test(sel)) {
    if (!/body\.type-index\b/.test(sel) || !/\.product(?![\w-])/.test(sel)) return null;
    let s = sel.replace(/body\.type-index\b/g, 'body').replace(/\s+/g, ' ').replace(/\s*>\s*/g, '>').trim();
    const m = s.match(/(^|[ >+~])([\w-]*\.product(?![\w-]))/);
    if (!m) return null;
    const at = m.index + m[1].length;
    const tail = s.slice(at);
    s = s.slice(0, at) + '.okla-cards:not(#okla-cards-a#okla-cards-b) ' + tail;
    const cell = /^\.product(:[\w-]+(\([^)]*\))?)*(::?(before|after))?$/.test(tail);
    return { s, kind: cell ? 'cell' : 'inner' };
  }
  let s = sel.replace(/body\.type-index\b/g, 'body:not(.okla-cards-none)');
  let classes = 0;   // classes taken out of the selector
  const hasTrack = /okla-slider-track/.test(s);
  if (hasTrack) {
    // drop the shell ancestor, map the track compound to the grid marker
    s = s.replace(/\.okla-slider-shell\s*(>\s*)?/g, () => { classes++; return ''; });
    s = s.replace(/[\w\-]*((?:\.[\w\-]+)*\.okla-slider-track(?:\.[\w\-]+)*)/, (m, cls) => { classes += (cls.match(/\./g) || []).length; return '@@GRID@@'; });
  } else {
    s = s.replace(/[\w\-]*((?:\.[\w\-]+)*\.okla-slider-shell(?:\.[\w\-]+)*)/, (m, cls) => { classes += (cls.match(/\./g) || []).length; return '@@GRID@@'; });
  }
  s = s.replace(/\s+/g, ' ').replace(/\s*>\s*/g, '>').trim();
  const at = s.indexOf('@@GRID@@');
  if (at < 0) return null;
  const tail = s.slice(at + '@@GRID@@'.length);
  s = s.replace('@@GRID@@', '.okla-cards'.repeat(Math.max(1, classes)) + ':not(#okla-cards-a#okla-cards-b)');
  if (!tail) return { s, kind: 'grid' };                                         // the grid itself: custom properties only
  if (/^(::?[\w-]+(\([^)]*\))?)+$/.test(tail)) return null;                      // grid pseudo-elements/states
  const cell = /^[> ]\.product(:[\w-]+(\([^)]*\))?)*(::?(before|after))?$/.test(tail); // the grid cell
  return { s, kind: cell ? 'cell' : 'inner' };
}
function filterDecl(decl, kind) {
  return splitTop(decl, ';').filter(d => {
    const p = d.slice(0, d.indexOf(':')).trim().toLowerCase();
    if (!p) return false;
    if (kind === 'grid') return p.startsWith('--');
    return !(kind === 'cell' && CELL_LAYOUT.test(p));
  }).join(';');
}
function emit(nodes, indent) {
  let out = '';
  for (const n of nodes) {
    if (n.children) {
      const inner = emit(n.children, indent + '  ');
      if (inner.trim()) out += `${indent}${n.at}{\n${inner}${indent}}\n`;
      continue;
    }
    const sels = splitTop(n.sel, ',').map(rewrite).filter(Boolean);
    if (!sels.length) continue;
    for (const kind of ['grid', 'cell', 'inner']) {
      const group = sels.filter(x => x.kind === kind);
      if (!group.length) continue;
      const decl = filterDecl(n.decl, kind);
      if (decl.trim()) out += `${indent}${group.map(x => x.s).join(',\n' + indent)}{${decl}}\n`;
    }
  }
  return out;
}

let body = '';
for (const [file, read] of SOURCES) {
  const css = stripComments(read ? read() : fs.readFileSync(path.join(ROOT, file), 'utf8'));
  const out = emit(parse(css), '');
  body += `\n/* ===== from ${file} ===== */\n` + out;
}

const header = fs.readFileSync(path.join(__dirname, 'cards_everywhere.head.css'), 'utf8');
const target = path.join(ROOT, 'v91/okla_cards_everywhere.css');
fs.writeFileSync(target, header.trimEnd() + '\n\n/* ======== GENERATED by tools/build_cards_everywhere.js – do not edit below ======== */\n' + body);
console.log('wrote', path.relative(process.cwd(), target), (fs.statSync(target).size / 1024).toFixed(1) + ' KB');
