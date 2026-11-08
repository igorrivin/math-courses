import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bernoulliChebyshev, hiddenCoinVariance, sampleMeans, compareMeans, sparseAverageVariance } from '../app/lln-math.mjs';
test('stated accuracy and persistent covariance calculations',()=>{
  assert.equal(bernoulliChebyshev(2000,.05),.25/(2000*.05*.05));
  assert.ok(bernoulliChebyshev(2000,.05)<=.05);
  assert.equal(bernoulliChebyshev(62500,.02),.01);
  assert.equal(hiddenCoinVariance(1),.25);
  assert.ok(hiddenCoinVariance(1e8)>.09);
  for(let m=1;m<=16;m++){
    const independent = Array.from({length:m},(_,j)=>4**(j+1)/(j+1)).reduce((a,b)=>a+b,0)/4**m;
    assert.ok(Math.abs(sparseAverageVariance(m)-independent)<1e-14);
  }
  assert.ok(sparseAverageVariance(500)<.003);
});
test('simulations are deterministic, finite, model-specific and keep the exact final observation count',()=>{
  for(const model of ['bernoulli','hidden','pareto','cauchy']){
    const a=sampleMeans(model,1000,31);
    assert.deepEqual(a,sampleMeans(model,1000,31));
    assert.equal(a.points.at(-1).n,1000);
    assert.equal(a.points.at(-1).mean,a.mean);
    assert.ok(a.points.every(p=>Number.isFinite(p.mean)));
    if(model==='bernoulli' || model==='hidden')assert.ok(a.points.every(p=>p.mean>=0 && p.mean<=1));
    if(model==='pareto')assert.ok(a.points.every(p=>p.mean>=1));
    if(model==='hidden')assert.ok(a.theta===.2 || a.theta===.8);
    const r=compareMeans(model,100,99);
    assert.equal(r.means.length,80);assert.equal(r.paths.length,3);
    assert.equal(r.outside,r.means.filter(x=>Math.abs(x-r.target)>.1).length/80);
  }
  assert.throws(()=>sampleMeans('unknown',100,1),RangeError);
});
