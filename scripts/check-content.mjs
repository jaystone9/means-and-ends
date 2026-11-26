// Automatic content checks. Run by build.mjs and by CI; exits non-zero when a hard rule is broken.
//  1. Longest-answer bias: across choose-one questions, the right answer is the strictly longest option no more often than chance.
//  2. No duplicate or near-duplicate questions.
//  3. Plain multiple choice is at most half of all questions, overall and in every level.
//  4. Every question has teaching text in front of it, and the right answer's key words are in that text.
//  5. Higher levels ask more questions per unit, and each unit mixes at least four kinds of question.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const dir = new URL('../src/', import.meta.url);
const code = fs.readFileSync(new URL('q.js', dir), 'utf8') + '\n' + fs.readdirSync(new URL('content/', dir)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(new URL('content/' + f, dir), 'utf8')).join('\n') + '\n;prepContent();({UNITS,TRACKS})';
const { UNITS, TRACKS } = vm.runInNewContext(code, { module: undefined });
const errs = [], warns = [];
const all = UNITS.flatMap(u => u.qs);
const words = s => String(s).toLowerCase().replace(/\*\*/g, '').replace(/[^a-z0-9% ]+/g, ' ').split(/\s+/).filter(w => w.length > 3);
const STOP = new Set('that this with from they them their there were have what which when than then into over more most some only also about because would could should does very each such these those being between through after before other while where'.split(' '));

// 1. longest-answer bias
let n = 0, longest = 0, chance = 0; const flagged = [];
for (const q of all) if (q.t === 'mc') {
  n++; chance += 1 / q.o.length;
  const L = q.o.map(o => o.length);
  if (L[0] > Math.max(...L.slice(1))) { longest++; flagged.push(q.id); }
  if (new Set(q.o).size !== q.o.length) errs.push(`${q.id}: repeated option`);
  if (q.o.length < 3) errs.push(`${q.id}: needs at least 3 options`);
  if (L[0] > 1.6 * (L.slice(1).reduce((a, b) => a + b, 0) / (L.length - 1)) + 6) warns.push(`${q.id}: right answer is much longer than the others`);
}
if (longest > chance) errs.push(`Longest-answer bias: right answer is the longest option in ${longest} of ${n} (chance would be ${chance.toFixed(1)}). Longest in: ${flagged.join(' ')}`);

// 2. duplicates
const seen = new Map();
for (const q of all) { const body = q.t === 'ord' ? q.o.join(' ') : q.t === 'pair' ? q.p.flat().join(' ') : q.t === 'sort' ? Object.values(q.g).flat().join(' ') : q.t === 'pick' ? q.yes.concat(q.no).join(' ') : ''; const k = words(q.q + ' ' + body + ' ' + (q.cs || '') + ' ' + (q.src ? q.src.text : '') + ' ' + (q.data ? q.data.title : '')).filter(w => !STOP.has(w)).sort().join(' '); if (seen.has(k) && k) errs.push(`Duplicate question: ${q.id} and ${seen.get(k)}`); seen.set(k, q.id); }
const sets = all.map(q => [q, new Set(words(q.q + ' ' + (q.t === 'mc' ? q.o[0] : '') + ' ' + (q.cs || '') + ' ' + (q.src ? q.src.text : '')).filter(w => !STOP.has(w)))]);
for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) { const [a, A] = sets[i], [b, B] = sets[j]; if (A.size < 6 || B.size < 6 || a.t !== b.t) continue; let c = 0; A.forEach(w => { if (B.has(w)) c++; }); if (c / Math.min(A.size, B.size) > 0.8) errs.push(`Near-duplicate: ${a.id} and ${b.id}`); }

// 3. question mix
const share = qs => qs.filter(q => q.kind === 'choice').length / Math.max(1, qs.length);
if (share(all) > 0.5) errs.push(`Plain multiple choice is ${(share(all) * 100).toFixed(0)}% of all questions (limit 50%)`);
const tapOne = all.filter(q => q.t === 'mc' || q.t === 'tf').length / all.length;

// 4. taught before asked
for (const q of all) {
  if (!q.teach || q.teach.length < 40) errs.push(`${q.id}: missing or too-short teaching text`);
  if (!q.x && q.t !== 'ex') errs.push(`${q.id}: missing explanation`);
  if (q.t === 'ex' && (!q.model || q.model.length < 60)) errs.push(`${q.id}: missing model answer`);
  if (q.t === 'mc' && !q.src && !q.data && !q.cs) { const T = new Set(words(q.teach)); const key = words(q.o[0]).filter(w => !STOP.has(w)); if (key.length >= 2 && !key.some(w => T.has(w) || [...T].some(t => t.slice(0, 5) === w.slice(0, 5)))) warns.push(`${q.id}: none of the right answer's key words appear in the teaching text`); }
  for (const s of [q.q, q.teach, q.x, q.model, q.cs].filter(Boolean)) if (/—/.test(s)) errs.push(`${q.id}: contains an em dash`);
}

// 5. per-level size and variety
const rows = [];
for (const t of TRACKS) {
  const us = UNITS.filter(u => u.track === t.id); if (!us.length) { warns.push(`No units yet for ${t.name}`); continue; }
  const qs = us.flatMap(u => u.qs), per = qs.length / us.length;
  rows.push({ level: t.name, units: us.length, questions: qs.length, perUnit: +per.toFixed(1), choicePct: Math.round(share(qs) * 100) });
  if (share(qs) > 0.5) errs.push(`${t.name}: plain multiple choice is ${(share(qs) * 100).toFixed(0)}% (limit 50%)`);
  for (const u of us) { const kinds = new Set(u.qs.map(q => q.kind)); if (kinds.size < 4) errs.push(`${u.id}: only ${kinds.size} kinds of question`); if (!u.qs.some(q => q.t === 'ex')) warns.push(`${u.id}: no explain-in-your-own-words question`); }
}
const ladder = ['g8', 'hs', 'co', 'gr'].map(id => rows.find(r => r.level === TRACKS.find(t => t.id === id).name)).filter(Boolean);
for (let i = 1; i < ladder.length; i++) if (ladder[i].perUnit <= ladder[i - 1].perUnit) errs.push(`${ladder[i].level} should have more questions per unit than ${ladder[i - 1].level}`);

console.table(rows);
const kinds = {}; all.forEach(q => kinds[q.kind] = (kinds[q.kind] || 0) + 1);
console.log(`${all.length} questions in ${UNITS.length} units. By kind:`, kinds);
console.log(`Choose-one questions where the right answer is the longest option: ${longest} of ${n} (chance: ${chance.toFixed(1)}). Any tap-one mechanic (incl. source, chart, apply, true/false): ${(tapOne * 100).toFixed(0)}%`);
warns.forEach(w => console.log('warn:', w));
if (errs.length) { errs.forEach(e => console.error('FAIL:', e)); process.exit(1); }
console.log('Content checks passed.');
