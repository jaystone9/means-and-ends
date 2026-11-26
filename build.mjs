// Builds the single-file app: index.html, plus a stamped version.txt and sw.js.
// Run: node build.mjs   (runs the content checks first and refuses to build if they fail)
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const r = f => fs.readFileSync(new URL(f, import.meta.url), 'utf8');
if (!process.argv.includes('--no-check')) execFileSync('node', ['scripts/check-content.mjs'], { stdio: 'inherit' });
const stamp = String(Math.floor(Date.now() / 1000));
const VAPID = fs.existsSync(new URL('vapid-public.txt', import.meta.url)) ? r('vapid-public.txt').trim() : '';
const content = fs.readdirSync(new URL('src/content/', import.meta.url)).filter(f => f.endsWith('.js')).sort().map(f => r('src/content/' + f)).join('\n');
const js = [r('src/q.js'), content, r('src/mascots.js'), r('src/app.js').replace('__VAPID_PUBLIC__', VAPID)].join('\n').replace(/<\/script/gi, '<\\/script');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Means &amp; Ends</title>
<meta name="description" content="Learn what socialism and communism are, where they came from, what worked and what failed.">
<meta name="theme-color" content="#FFF1E9">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Means & Ends">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800;900&display=swap">
<style>
${r('src/style.css')}
</style>
</head>
<body>
<header class="top" id="top"></header>
<main id="app"></main>
<nav class="nav" id="nav" aria-label="Main"></nav>
<div id="ov" role="dialog" aria-label="Lesson"><canvas id="conf" aria-hidden="true"></canvas><div id="sroot" style="position:absolute;inset:0;z-index:1"></div></div>
<noscript>Means &amp; Ends needs JavaScript turned on.</noscript>
<script>window.ME_BUILD='${stamp}';</script>
<script>
${js}
</script>
</body>
</html>
`;
fs.writeFileSync(new URL('index.html', import.meta.url), html);
fs.writeFileSync(new URL('version.txt', import.meta.url), stamp + '\n');
fs.writeFileSync(new URL('sw.js', import.meta.url), r('src/sw.js').replace('__BUILD__', stamp));
console.log('built', stamp, (html.length / 1024).toFixed(0) + ' KB');
