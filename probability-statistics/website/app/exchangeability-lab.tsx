"use client";

import { useMemo, useState } from "react";
import { exchangeableLaw, exchangeabilityModels } from "./exchangeability-math.mjs";

type Model = keyof typeof exchangeabilityModels;
const percent = (value: number) => `${(100 * value).toFixed(2)}%`;

export function ExchangeabilityLab() {
  const [model, setModel] = useState<Model>("urn");
  const [n, setN] = useState(8), [s, setS] = useState(4);
  const law = useMemo(() => exchangeableLaw(model, n, s), [model, n, s]);
  const info = exchangeabilityModels[model];
  return <article className="lab-card" id="exchangeability">
    <header className="lab-header"><span>10</span><div><p className="eyebrow">Exchangeability capstone</p><h3>Same marginal. Different long runs.</h3><p>Every trial has success probability ½. Change how the trials share information and watch the count distribution change.</p></div></header>
    <div className="control-line"><label className="select-field"><span>Sequence model</span><select value={model} onChange={e => setModel(e.target.value as Model)}>{(Object.keys(exchangeabilityModels) as Model[]).map(key => <option key={key} value={key}>{exchangeabilityModels[key].title}</option>)}</select></label><label className="range"><span>Number of trials n<b>{n}</b></span><input type="range" min="2" max="30" step="1" value={n} onChange={e => { const value = Number(e.target.value); setN(value); setS(current => Math.min(current, value)); }} /></label><label className="range"><span>Observed successes s<b>{s}</b></span><input type="range" min="0" max={n} step="1" value={s} onChange={e => setS(Number(e.target.value))} /></label></div>
    <p className="model-assumptions">{model === "fair" ? "Toss an independent fair coin each time. There is no shared random bias." : model === "shared" ? "Choose a bias of ¼ or ¾, each with probability ½, once per run. Then toss that same coin independently conditional on its bias." : "Begin with one red and one blue ball. Replace each drawn ball and add another of its color. This has the same word law as choosing one uniform bias on [0, 1] for the entire run."}</p>
    <div className="exchangeability-chart" role="img" aria-label={`${info.title}: distribution of the number of successes in ${n} trials. Probabilities are listed in the table below.`}>
      <div className="exchangeability-bars">{law.counts.map((probability, k) => <div key={k} className={k === s ? "selected" : ""}><span style={{ height: `${probability * 100}%` }} /><small>{k}</small></div>)}</div>
      <p>Number of successes S<sub>n</sub> · bar height uses the same 0–100% scale in every model · selected count {s}</p>
    </div>
    <div className="counting-results exchangeability-results" aria-live="polite"><div><p className="micro-label">Next success, given this count</p><strong>{percent(law.predictive)}</strong><p>Order adds no information beyond the count in these exchangeable models.</p></div><div><p className="micro-label">Variance of S<sub>n</sub>/n</p><strong>{law.variance.toFixed(5)}</strong><p>Pairwise covariance: {info.covariance.toFixed(5)}.</p></div><div><p className="micro-label">Limit within a run</p><strong>{model === "fair" ? "½" : model === "shared" ? "¼ or ¾" : "Uniform [0, 1]"}</strong><p>{info.limit}. Increasing n reduces sampling noise within the run.</p></div></div>
    <p className="foundation-observation"><b>Words and counts are different events.</b> One specified word with {s} successes in {n} trials has probability {percent(law.wordProbability)}. There are {law.multiplicity.toLocaleString("en-US")} such words, so the probability of the count S<sub>{n}</sub> = {s} is {percent(law.countProbability)}. For the one-red, one-blue urn, all n + 1 counts are equally likely.</p>
    <details className="foundation-detail"><summary>Read the probabilities and the variance identity</summary><p className="foundation-equation">Var(S<sub>n</sub>/n) = E[Θ(1 − Θ)]/n + Var(Θ).</p><p>The first term vanishes as n grows. The second describes variation of the shared bias between runs. In an infinite Bernoulli mixture, Cov(X<sub>i</sub>, X<sub>j</sub>) = Var(Θ) ≥ 0 for i ≠ j. This also explains why a finite always-disagreeing pair cannot extend to an infinite exchangeable sequence.</p><div className="exchangeability-table-wrap" tabIndex={0} role="region" aria-label="Count probabilities"><table><caption>Computed probabilities, rounded to two decimal places as percentages</caption><thead><tr><th scope="col">Successes</th><th scope="col">Probability</th></tr></thead><tbody>{law.counts.map((p, k) => <tr key={k}><th scope="row">{k}</th><td>{percent(p)}</td></tr>)}</tbody></table></div></details>
    <p className="foundation-observation"><b>Continue in Sage.</b> <a href="/05_exchangeability_and_polya_sage.ipynb" download>Download the exchangeability notebook</a> for exact beta integrals, posterior predictions, seeded urn simulations, finite counterexamples, and a total-variation comparison bounded by birthday collisions. Select the SageMath kernel. <a href="/course-packet.pdf#nameddest=chapter.10">Chapter 10 develops the proofs →</a></p>
  </article>;
}
