// Sends Means & Ends play reminders. Run by .github/workflows/remind.yml: on GitHub's own schedule, and
// whenever an outside pinger calls workflow_dispatch (GitHub's schedule alone can run hours late).
// Reads reminder settings from Firestore and sends a Web Push to anyone who is due and hasn't played today.
import webpush from 'web-push';

const P = process.env.FIREBASE_PROJECT, K = process.env.FIREBASE_API_KEY;
const PUB = process.env.VAPID_PUBLIC_KEY, PRIV = process.env.VAPID_PRIVATE_KEY;
const DRY = process.env.DRY_RUN === '1';
const BASE = process.env.FIRESTORE_BASE || 'https://firestore.googleapis.com/v1';
if (!P || !K || !PUB || !PRIV) { console.log('Missing config or VAPID keys; nothing sent.'); process.exit(0); }
webpush.setVapidDetails('https://jaystone9.github.io/means-and-ends/', PUB, PRIV);

const col = `${BASE}/projects/${encodeURIComponent(P)}/databases/(default)/documents/reminders`;
const dec = d => { const o = {}; for (const [k, v] of Object.entries(d.fields || {})) o[k] = v.integerValue != null ? +v.integerValue : v.stringValue ?? null; o.id = d.name.split('/').pop(); return o; };
const NEED = { daily: 1, every2: 2, weekly: 7 };
// Every reminder comes from Gus, the Puget Sound seagull. Sarcastic, silly, never mean.
const MSGS = [
  ['Gus here. Again.', "You left notifications on. That was a choice. One lesson, comrade."],
  ['Gus is NOT waiting', "I'm just standing on this piling. Near your phone. Thinking about surplus value. Alone. It's fine."],
  ['Breaking news from Gus', 'Local seagull reports your streak is in danger. Sources describe him as "dramatic about it."'],
  ['Gus seized the means of reminding', "The notification is now collectively owned. By me. Do your lesson."],
  ['Gus found a fry', "I'd share it, but you haven't done today's lesson. From each according to ability, pal."],
  ['Your streak called', "It's nervous. I told it you'd show up. Don't make a liar out of a bird."],
  ['Gus read the Manifesto', "Nothing in there says you get to skip today. I checked. It's short. Unlike my patience."],
  ['A specter is haunting your phone', "It's me. It's the specter of one five-minute lesson."],
  ['Gus is tapping his foot', "Tap. Tap. Tap. Webbed feet are very loud on a dock. One lesson makes it stop."],
  ['Hazel says be nice', "So: hello, valued learner. Please do your lesson. (She's watching. Help.)"],
  ['Gus has a hot take', "People who do their lesson today are 100% more likely to have done their lesson today. Peer reviewed. By me."],
  ['Workers of the world', "Unite! But first, one lesson. You have nothing to lose but about five minutes."]
];
const AWAY = [
  ['Gus put up a missing poster', "LOST: one learner. Last seen ignoring a seagull. Reward: a very short lesson. Please come home."],
  ['Gus wrote you a sea shanty', "It's called \"Where'd You Go (I Ate Your Fries).\" It's mostly screaming. Come back and make it stop."],
  ['Hazel kept your spot', "She built a little dam around it and everything. I think it's excessive. One lesson?"]
];

function localParts(tz) {
  let f; try { f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }); }
  catch { f = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }); }
  const p = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, hour: +p.hour % 24 };
}
const days = (a, b) => (!a || !b) ? 999 : Math.round((Date.parse(a + 'T12:00:00Z') - Date.parse(b + 'T12:00:00Z')) / 864e5);

export function due(r, now) {
  if (!NEED[r.freq] || !r.endpoint) return false;
  if (r.lastSent === now.date) return false;
  const h = Number.isFinite(r.hour) ? r.hour : 19;
  // A late run still sends: any time from the chosen hour until 11 PM local. Never before the chosen hour, never late at night.
  if (now.hour < h || now.hour >= Math.max(h + 1, 23)) return false;
  const since = days(now.date, r.lastPlayed);
  if (since <= 0) return false;                                  // already played today
  let need = NEED[r.freq];
  if (since >= 14 && since < 999 && need < 7) need = 7;          // back off to weekly after 2 weeks away
  return since >= need && days(now.date, r.lastSent) >= need;
}

async function list() {
  const out = []; let tok = '';
  do {
    const res = await fetch(`${col}?key=${K}&pageSize=300${tok ? '&pageToken=' + tok : ''}`);
    if (!res.ok) throw new Error('list failed ' + res.status);
    const j = await res.json(); (j.documents || []).forEach(d => out.push(dec(d))); tok = j.nextPageToken || '';
  } while (tok);
  return out;
}

if (process.env.REMIND_TEST !== '1') {
  const rs = await list(); let sent = 0;
  for (const r of rs) {
    const now = localParts(r.tz || 'America/Los_Angeles');
    if (!due(r, now)) continue;
    const pool = days(now.date, r.lastPlayed) >= 7 ? AWAY : MSGS, m = pool[Math.floor(Math.random() * pool.length)];
    if (DRY) { console.log('would send', r.id.slice(0, 6)); sent++; continue; }
    try {
      await webpush.sendNotification({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, JSON.stringify({ title: m[0], body: m[1] }), { TTL: 6 * 3600, urgency: 'normal' });
      await fetch(`${col}/${encodeURIComponent(r.id)}?key=${K}&updateMask.fieldPaths=lastSent`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { lastSent: { stringValue: now.date } } }) });
      sent++;
    } catch (e) {
      // 404 or 410 means the phone's signup is dead. Remove it; the app signs up again by itself the next time it is opened.
      if (e.statusCode === 404 || e.statusCode === 410) await fetch(`${col}/${encodeURIComponent(r.id)}?key=${K}`, { method: 'DELETE' });
      else console.log('send failed', r.id.slice(0, 6), e.statusCode || '', (e.body || e.message || '').toString().slice(0, 300));
    }
  }
  console.log(`checked ${rs.length}, sent ${sent}`);
}
