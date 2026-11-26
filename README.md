# Means & Ends

A Duolingo-style learning game about socialism and communism, with Gus the seagull and Hazel the beaver.

Live at https://jaystone9.github.io/means-and-ends/

## How it is put together

- `src/content/*.js` holds the lessons. Every question travels with the text that teaches it.
- `src/app.js` is the game, `src/mascots.js` draws and animates Gus and Hazel, `src/style.css` is the look.
- `node build.mjs` runs the content checks, then writes `index.html`, `version.txt` and `sw.js`. Commit those three with any change.
- `scripts/check-content.mjs` fails the build if the right answer is the longest option more often than chance, if questions repeat, if plain multiple choice passes half, or if a higher level has fewer questions per unit than the one below it.
- `scripts/remind.mjs` sends the daily push reminders. It needs the repository secret `VAPID_PRIVATE_KEY` and the matching public key in `vapid-public.txt` (make a pair at `setup-keys.html`).
- `src/content/6-live.js` is the Live Desk. It is rewritten on the 1st of each month from sources read that month.
