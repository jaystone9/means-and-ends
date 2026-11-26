// Lists choose-one questions whose right answer is the longest option, to help rebalance them.
import fs from 'node:fs';import vm from 'node:vm';
const dir=new URL('../src/',import.meta.url);
const code=fs.readFileSync(new URL('q.js',dir),'utf8')+'\n'+fs.readdirSync(new URL('content/',dir)).filter(f=>f.endsWith('.js')).sort().map(f=>fs.readFileSync(new URL('content/'+f,dir),'utf8')).join('\n')+'\n;prepContent();UNITS';
const U=vm.runInNewContext(code,{module:undefined});
const only=process.argv[2];
for(const q of U.flatMap(u=>u.qs))if(q.t==='mc'&&(!only||q.id.startsWith(only))){const L=q.o.map(o=>o.length);if(L[0]>Math.max(...L.slice(1)))console.log(q.id,JSON.stringify(q.o))}
