import assert from 'node:assert/strict';
import { test } from 'node:test';
test('new lesson is reachable, has meaningful server-rendered content, and is linked from home',async()=>{
 const {default:worker}=await import('../dist/server/index.js');
 const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
 const ctx={waitUntil(){},passThroughOnException(){}};
 async function get(path){return worker.fetch(new Request('https://course.example'+path,{headers:{accept:'text/html',host:'course.example','x-forwarded-proto':'https'}}),env,ctx);}
 const home=await get('/');assert.equal(home.status,200);assert.ok((await home.text()).includes('href="/pythagorean-descent"'));
 const response=await get('/pythagorean-descent');assert.equal(response.status,200);
 const html=await response.text();
 for(const marker of ['Every primitive Pythagorean triple', 'The biquadratic equation', 'Cubic descent', 'Build a triple. Test the hypotheses.'])assert.ok(html.includes(marker),marker);
 assert.match(html,/<svg[^>]*role="img"/);
 assert.ok((html.match(/<details/g)||[]).length>=8);
 assert.doesNotMatch(html,/NaN|Infinity|codex-preview/);
});
