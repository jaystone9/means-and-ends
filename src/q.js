/* Lesson content format.
   U({id, track, title, blurb, scene, lessons:[{t, sub, items:[[teach, question, {g, h}?], ...]}]})
   Every question travels with the text that teaches it, so nothing is ever quizzed before it is taught.
   The right answer is written first; the app shuffles options every time a question is shown. */
const UNITS=[];
function U(o){UNITS.push(o)}
const M=(q,o,x)=>({t:'mc',q,o,x});                       // o[0] is correct
const TF=(q,a,x)=>({t:'tf',q,a,x});                      // a is true or false
const PICK=(q,yes,no,x)=>({t:'pick',q,yes,no,x});        // choose every one that fits
const PAIR=(q,p,x)=>({t:'pair',q,p,x});                  // p: [[left,right],...]
const SORT=(q,g,x)=>({t:'sort',q,g,x});                  // g: {group:[items]}
const ORD=(q,o,x)=>({t:'ord',q,o,x});                    // o: items in the right order
const EX=(q,model)=>({t:'ex',q,model});                  // explain in your own words, self-rated
const SRC=(text,cite,q)=>(q.src={text,cite},q);          // read a primary source first
const DATA=(title,rows,q,note)=>(q.data={title,rows,note},q); // read a chart first: rows [[label,value,display?],...]
const CASE=(text,q)=>(q.cs=text,q);                      // apply the idea to a real situation
const TRACKS=[
 {id:'g8',name:'8th grade',sub:'Start here. Plain words, big ideas.'},
 {id:'hs',name:'High school',sub:'How the systems work and where they split.'},
 {id:'co',name:'College',sub:'Theory, evidence and the hard arguments.'},
 {id:'gr',name:'Graduate',sub:'The debates scholars still fight about.'},
 {id:'wa',name:'Seattle & Washington',sub:'Strikes, co-ops and public power close to home.'},
 {id:'live',name:'Live Desk',sub:'What is happening now. Refreshed on the 1st of each month.'}
];
function kindOf(q){return q.src?'source':q.data?'chart':q.cs?'apply':({mc:'choice',tf:'choice',pick:'pick',pair:'match',sort:'sort',ord:'order',ex:'explain'})[q.t]}
function prepContent(){
 const QS={};
 UNITS.forEach(u=>{u.qs=[];u.lessons.forEach((l,li)=>{l.items=l.items.map((it,qi)=>{const q=it[1];q.id=u.id+'.'+li+'.'+qi;q.teach=it[0];q.unit=u.id;q.kind=kindOf(q);if(it[2]){q.g=it[2].g;q.h=it[2].h}QS[q.id]=q;u.qs.push(q);return q})})});
 return QS}
if(typeof module!=='undefined')module.exports={UNITS,U,M,TF,PICK,PAIR,SORT,ORD,EX,SRC,DATA,CASE,TRACKS,kindOf,prepContent};
