import assert from 'node:assert/strict';
import { test } from 'node:test';
import { gcd, pythagoreanTriple, eisensteinMultiply as mul, eisensteinNorm as norm, eisensteinCube as cube } from '../app/descent-math.mjs';
test('parameter classification agrees with exhaustive primitive triples through hypotenuse 300', () => {
  const generated = new Set();
  for (let m = 2; m <= 100; m++) for (let n = 1; n < m; n++) {
    const t = pythagoreanTriple(m, n);
    assert.equal(t.a*t.a+t.b*t.b,t.c*t.c);
    assert.equal(t.primitive,t.coprime && t.oppositeParity);
    if (t.primitive && t.c <= 300) generated.add([Math.min(t.a,t.b),Math.max(t.a,t.b),t.c].join(','));
  }
  const brute = new Set();
  for (let a=1;a<300;a++) for(let b=a;b<300;b++) {
    const c = Math.sqrt(a*a+b*b);
    if(Number.isInteger(c) && c<=300 && gcd(a,b)===1) brute.add([a,b,c].join(','));
  }
  assert.deepEqual(generated,brute);
  for(const args of [[1,1],[3,0],[101,1],[3.5,1]]) assert.throws(()=>pythagoreanTriple(...args),RangeError);
});
function valuation([a,b]) {
  if(a===0 && b===0)return Infinity;
  let v=0;
  while((2*a-b)%3===0 && (a+b)%3===0) { [a,b]=[(2*a-b)/3,(a+b)/3];v++; }
  return v;
}
test('Eisenstein norm, ramification, units and cube congruence support the cubic proof',()=>{
  assert.deepEqual(mul([1,-1],[1,-1]),[0,-3]);
  assert.equal(norm([1,-1]),3);
  const units=[];
  for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++){
    const x=[a,b];
    if(norm(x)===1)units.push(x);
    for(let c=-3;c<=3;c++)for(let d=-3;d<=3;d++)assert.equal(norm(mul(x,[c,d])),norm(x)*norm([c,d]));
    if(valuation(x)===0){const [c,d]=cube(x);assert.ok(valuation([c-1,d])>=4 || valuation([c+1,d])>=4);}
  }
  assert.equal(units.length,6);
  for(const u of units)assert.ok([[1,0],[-1,0]].some(v=>JSON.stringify(cube(u))===JSON.stringify(v)));
  for(const u of units)for(const v of units){if(JSON.stringify(u)!==JSON.stringify(v))assert.ok(valuation([u[0]-v[0],u[1]-v[1]])<2);}
});
