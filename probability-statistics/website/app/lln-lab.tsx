"use client";
import { useMemo, useState } from "react";
import { bernoulliChebyshev, compareMeans } from "./lln-math.mjs";
const models = {
  bernoulli: { name: "Independent fair coin", note: "The average tends to 0.5 almost surely and in L¹ and L². Chebyshev and Hoeffding give finite-sample bounds." },
  pareto: { name: "Pareto: finite mean, infinite variance", note: "The average tends to 3 almost surely and in L¹. Large jumps remain visible; neither an L² law nor the ordinary finite-variance CLT applies." },
  cauchy: { name: "Standard Cauchy", note: "Zero is a symmetry center, not an expectation. Every sample average is again standard Cauchy; there is no concentration at zero." },
  hidden: { name: "One hidden coin, shared by the sequence", note: "Each path chooses bias 0.2 or 0.8 once. Its average tends to that bias, although every observation has unconditional mean 0.5." },
};
type Model = keyof typeof models;
export default function LLNLab() {
  const [model, setModel] = useState<Model>("bernoulli"), [n, setN] = useState(1000), [seed, setSeed] = useState(31);
  const result = useMemo(() => compareMeans(model, n, seed), [model, n, seed]);
  const vals = result.paths.flatMap(p => p.points.map(q => q.mean));
  const lo = Math.min(result.target - .3, ...vals), hi = Math.max(result.target + .3, ...vals);
  const y = (v: number) => 230 - 190 * (v - lo) / (hi - lo);
  return <div className="lesson-panel">
    <h3>One trajectory versus many experiments</h3>
    <div className="lesson-controls"><label>Model<select value={model} onChange={e => setModel(e.target.value as Model)}>{Object.entries(models).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></label><label>Observations per experiment: {n}<input type="range" min="100" max="4000" step="100" value={n} onChange={e => setN(Number(e.target.value))} /></label><button onClick={() => setSeed(s => s + 1)}>New experiments</button></div>
    <p>{models[model].note}</p>
    <svg className="lesson-chart" viewBox="0 0 700 280" role="img" aria-label={`Three sample-average trajectories for ${models[model].name}; horizontal reference ${result.target}. Vertical scale ${lo.toFixed(2)} to ${hi.toFixed(2)}.`}>
      <rect x="65" y={y(result.target + .1)} width="610" height={y(result.target - .1) - y(result.target + .1)} fill="#2a8c8225" />
      <line x1="65" x2="675" y1={y(result.target)} y2={y(result.target)} stroke="#243b5b" strokeDasharray="6 4" />
      <line x1="65" x2="675" y1="230" y2="230" stroke="#7e8998" />
      <text x="8" y="40" fill="#17243a" fontSize="13">{hi.toFixed(2)}</text><text x="8" y="230" fill="#17243a" fontSize="13">{lo.toFixed(2)}</text>
      {result.paths.map((p, i) => <polyline key={i} fill="none" stroke={["#246c66", "#925129", "#6750a4"][i]} strokeWidth="2" points={p.points.map(q => `${65 + 610 * q.n / n},${y(q.mean)}`).join(" ")} />)}
      <text x="65" y="258" fill="#17243a" fontSize="13">1</text><text x="610" y="258" fill="#17243a" fontSize="13">n = {n}</text>
    </svg>
    <p className="lesson-note">Teal, brown, and purple show three experiments. Dashed line: {model === "cauchy" ? "symmetry center 0" : `reference mean ${result.target}`}; shading: ±0.1. The vertical scale adjusts to include every displayed point. Points are sampled for display; every observation contributes to each mean.</p>
    <div className="lesson-stats" aria-live="polite"><div><span>First trajectory’s final average</span><strong>{result.paths[0].mean.toFixed(3)}</strong></div><div><span>80 fresh experiments: error &gt; 0.1 at this n</span><strong>{(100 * result.outside).toFixed(1)}%</strong></div>{model === "bernoulli" && <div><span>Chebyshev upper bound</span><strong>{(100 * bernoulliChebyshev(n, .1)).toFixed(1)}%</strong></div>}</div>
    <p className="lesson-note">The percentage estimates a fixed-time probability; following a path asks a different question. These are reproducible pseudorandom finite experiments, not proofs of convergence or evidence that rare events cannot occur. For Cauchy, “error” here means distance from the symmetry center.</p>
  </div>;
}
