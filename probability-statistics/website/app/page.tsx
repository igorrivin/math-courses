"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BirthdayLab, CountingLab, InclusionExclusionLab } from "./foundations-labs";

const chapters = [
  { n: "01", title: "The grammar of uncertainty", topic: "Permutations · Combinations · Inclusion–exclusion", tone: "mint", blurb: "Count outcomes, distinguish order, and repair overlapping counts." },
  { n: "02", title: "A measure of possibility", topic: "Probability spaces · Events · Birthday paradox", tone: "amber", blurb: "Assign probability masses, correct overlaps, and count birthday collisions." },
  { n: "03", title: "Information changes the space", topic: "Conditioning · Independence · Bayes", tone: "rose", blurb: "Restrict, renormalize, and reverse the direction of evidence." },
  { n: "04", title: "Numbers attached to outcomes", topic: "Random variables · CDFs · Moments", tone: "violet", blurb: "Compress experiments into quantities we can analyze." },
  { n: "05", title: "A library of chance mechanisms", topic: "Binomial · Poisson · Normal · Beta", tone: "mint", blurb: "Recognize the recurring mechanisms behind familiar laws." },
  { n: "06", title: "Variables together", topic: "Joint laws · Marginals · Correlation", tone: "amber", blurb: "See dependence as a whole surface, not a single number." },
  { n: "07", title: "From repetition to regularity", topic: "LLN · CLT · Sampling distributions", tone: "rose", blurb: "Watch averages stabilize and bell curves emerge." },
  { n: "08", title: "Learning from a sample", topic: "Estimation · Intervals · Tests", tone: "violet", blurb: "Turn random data into calibrated claims." },
  { n: "09", title: "Probability for unknowns", topic: "Prior · Likelihood · Posterior", tone: "mint", blurb: "Update uncertainty and predict what comes next." },
];

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(1e-12, rand()), v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let out = 1;
  for (let i = 1; i <= k; i++) out = out * (n - k + i) / i;
  return out;
}

function poissonPmf(k: number, lambda: number) {
  let out = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) out *= lambda / i;
  return out;
}

function setupCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

function LabHeader({ index, eyebrow, title, text }: { index: string; eyebrow: string; title: string; text: string }) {
  return <header className="lab-header"><span>{index}</span><div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3><p>{text}</p></div></header>;
}

function Range({ label, value, min, max, step = 1, onChange, suffix = "" }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (x: number) => void }) {
  return <label className="range"><span>{label}<b>{value}{suffix}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}

function VennCanvas({ operation }: { operation: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const s = setupCanvas(canvas); if (!s) return;
    const { ctx, w, h } = s;
    const r = Math.min(105, w * .21), cy = h * .5, ax = w * .42, bx = w * .58;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f5f0e8"; ctx.fillRect(0, 0, w, h);
    const circle = (x: number) => { ctx.beginPath(); ctx.arc(x, cy, r, 0, 2 * Math.PI); };
    if (operation === "union") {
      ctx.fillStyle = "rgba(42,140,130,.55)"; circle(ax); ctx.fill(); circle(bx); ctx.fill();
    } else if (operation === "intersection") {
      ctx.save(); circle(ax); ctx.clip(); ctx.fillStyle = "rgba(103,80,164,.72)"; circle(bx); ctx.fill(); ctx.restore();
    } else if (operation === "a-only") {
      ctx.save(); circle(ax); ctx.clip(); ctx.fillStyle = "rgba(233,162,59,.62)"; ctx.beginPath(); ctx.arc(ax, cy, r, 0, 2 * Math.PI); ctx.moveTo(bx + r, cy); ctx.arc(bx, cy, r, 0, 2 * Math.PI); ctx.fill("evenodd"); ctx.restore();
    } else if (operation === "xor") {
      ctx.fillStyle = "rgba(216,93,117,.58)"; circle(ax); ctx.fill(); ctx.globalCompositeOperation = "xor"; circle(bx); ctx.fill(); ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.fillStyle = "rgba(41,61,112,.16)"; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = "destination-out"; circle(ax); ctx.fill(); ctx.globalCompositeOperation = "source-over";
    }
    ctx.lineWidth = 2.5; ctx.strokeStyle = "#2a8c82"; circle(ax); ctx.stroke(); ctx.strokeStyle = "#e9a23b"; circle(bx); ctx.stroke();
    ctx.fillStyle = "#17243a"; ctx.font = "600 18px Georgia"; ctx.fillText("A", ax - r * .68, cy); ctx.fillText("B", bx + r * .56, cy);
    ctx.fillStyle = "#647084"; ctx.font = "12px system-ui"; ctx.fillText("Ω", 16, 24);
  }, [operation]);
  return <canvas ref={ref} className="venn-canvas" role="img" aria-label={`Venn diagram showing ${operation}`} />;
}

const opLabels: Record<string, string> = {
  union: "A ∪ B: at least one event occurs",
  intersection: "A ∩ B: both events occur",
  "a-only": "A ∩ Bᶜ: A occurs without B",
  xor: "symmetric difference: exactly one occurs",
  complement: "Aᶜ: everything outside A",
};

function VennLab() {
  const [operation, setOperation] = useState("intersection");
  return <article className="lab-card">
    <LabHeader index="01" eyebrow="Event lab" title="Shade the statement" text="Switch between words, symbols, and regions. Probability begins with getting the event right." />
    <div className="venn-layout">
      <div><label className="select-field"><span>Set operation</span><select value={operation} onChange={e => setOperation(e.target.value)}><option value="union">Union</option><option value="intersection">Intersection</option><option value="a-only">A but not B</option><option value="xor">Exactly one</option><option value="complement">Complement of A</option></select></label><VennCanvas operation={operation} /></div>
      <div className="concept-panel"><p className="micro-label">Read the region</p><strong>{opLabels[operation]}</strong><div className="truth-grid"><b>A</b><b>B</b><b>included?</b>{[[0,0],[0,1],[1,0],[1,1]].map(([a,b]) => { const yes = operation === "union" ? a||b : operation === "intersection" ? a&&b : operation === "a-only" ? a&&!b : operation === "xor" ? a!==b : !a; return <span key={`${a}${b}`} className={yes ? "yes" : ""}>{a} · {b} <em>{yes ? "yes" : "no"}</em></span>; })}</div><p>Before computing, ask: are the outcomes ordered? Are they equally likely? Is the event inclusive or exclusive?</p></div>
    </div>
  </article>;
}

function BayesDots({ prevalence, sensitivity, specificity }: { prevalence: number; sensitivity: number; specificity: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const s = setupCanvas(canvas); if (!s) return;
    const { ctx, w, h } = s;
    ctx.clearRect(0, 0, w, h);
    const total = 1000, cases = Math.round(total * prevalence), tp = Math.round(cases * sensitivity), fp = Math.round((total - cases) * (1 - specificity));
    const cols = 40, gap = Math.min(11, (w - 24) / cols), radius = Math.max(2.2, gap * .31);
    for (let i = 0; i < total; i++) {
      const x = 12 + (i % cols) * gap, y = 12 + Math.floor(i / cols) * ((h - 24) / 24);
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = i < tp ? "#2a8c82" : i < cases ? "#a9c5c0" : i < cases + fp ? "#d85d75" : "#d9dfe5";
      ctx.fill();
    }
  }, [prevalence, sensitivity, specificity]);
  return <canvas ref={ref} className="dot-canvas" role="img" aria-label="A one-thousand-person diagnostic test visualization" />;
}

function BayesLab() {
  const [prev, setPrev] = useState(1), [sens, setSens] = useState(95), [spec, setSpec] = useState(90);
  const p = prev / 100, se = sens / 100, sp = spec / 100;
  const ppv = se * p / (se * p + (1 - sp) * (1 - p));
  const tp = Math.round(1000 * p * se), fp = Math.round(1000 * (1 - p) * (1 - sp));
  return <article className="lab-card">
    <LabHeader index="05" eyebrow="Bayes lab" title="Reverse the condition" text="A positive result is evidence, not a verdict. Watch the base rate reshape the answer." />
    <div className="triple-controls"><Range label="Prevalence" value={prev} min={.1} max={30} step={.1} suffix="%" onChange={setPrev} /><Range label="Sensitivity" value={sens} min={50} max={100} suffix="%" onChange={setSens} /><Range label="Specificity" value={spec} min={50} max={100} suffix="%" onChange={setSpec} /></div>
    <div className="bayes-layout"><div><BayesDots prevalence={p} sensitivity={se} specificity={sp} /><div className="dot-legend"><span className="tp">true positive</span><span className="fp">false positive</span><span className="other">other</span></div></div><div className="result-panel"><p>Among positive results</p><strong>{(ppv * 100).toFixed(1)}%</strong><span>actually have the condition</span><div className="bayes-fraction"><b>{tp}</b><i>/</i><b>{tp} + {fp}</b><small>true positives / all positives</small></div></div></div>
  </article>;
}

type DistributionKind = "binomial" | "poisson" | "normal";

function DistributionCanvas({ kind, a, b }: { kind: DistributionKind; a: number; b: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const s = setupCanvas(canvas); if (!s) return;
    const { ctx, w, h } = s, pad = 34;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#dce1e7"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = pad + i * (h - 2 * pad) / 4; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke(); }
    if (kind === "normal") {
      const mu = a, sigma = b, values = Array.from({ length: 181 }, (_, i) => { const x = mu - 4 * sigma + i * 8 * sigma / 180; return { x, y: Math.exp(-.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI)) }; });
      const maxY = Math.max(...values.map(v => v.y)); ctx.beginPath(); ctx.strokeStyle = "#6750a4"; ctx.lineWidth = 3;
      values.forEach((v, i) => { const x = pad + i * (w - 2 * pad) / 180, y = h - pad - v.y / maxY * (h - 2 * pad); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke();
      const left = pad + 3 / 8 * (w - 2 * pad), right = pad + 5 / 8 * (w - 2 * pad); ctx.fillStyle = "rgba(42,140,130,.18)"; ctx.fillRect(left, pad, right - left, h - 2 * pad);
      ctx.fillStyle = "#647084"; ctx.font = "12px system-ui"; ctx.fillText(`μ = ${mu}`, w / 2 - 18, h - 12); ctx.fillText(`σ = ${sigma}`, right + 8, pad + 15);
    } else {
      const maxK = kind === "binomial" ? Math.round(a) : Math.max(8, Math.ceil(a + 4 * Math.sqrt(a)));
      const values = Array.from({ length: maxK + 1 }, (_, k) => kind === "binomial" ? choose(maxK, k) * b ** k * (1 - b) ** (maxK - k) : poissonPmf(k, a));
      const maxY = Math.max(...values), gap = (w - 2 * pad) / values.length;
      values.forEach((v, k) => { const bh = v / maxY * (h - 2 * pad); ctx.fillStyle = k % 2 ? "#6750a4" : "#2a8c82"; ctx.fillRect(pad + k * gap + 1, h - pad - bh, Math.max(2, gap - 2), bh); });
      ctx.fillStyle = "#647084"; ctx.font = "12px system-ui"; ctx.fillText("0", pad, h - 12); ctx.fillText(String(maxK), w - pad - 13, h - 12);
    }
  }, [kind, a, b]);
  return <canvas ref={ref} className="distribution-canvas" role="img" aria-label={`${kind} distribution plot`} />;
}

function DistributionLab() {
  const [kind, setKind] = useState<DistributionKind>("binomial"), [a, setA] = useState(12), [b, setB] = useState(.35);
  const mean = kind === "binomial" ? Math.round(a) * b : kind === "poisson" ? a : a;
  const variance = kind === "binomial" ? Math.round(a) * b * (1 - b) : kind === "poisson" ? a : b * b;
  return <article className="lab-card">
    <LabHeader index="06" eyebrow="Distribution lab" title="Shape a probability law" text="Change the mechanism, then read its center and spread before looking at the graph." />
    <div className="control-line"><label className="select-field"><span>Family</span><select value={kind} onChange={e => { const next = e.target.value as DistributionKind; setKind(next); if (next === "normal") { setA(0); setB(1); } else if (next === "poisson") { setA(5); setB(.4); } else { setA(12); setB(.35); } }}><option value="binomial">Binomial</option><option value="poisson">Poisson</option><option value="normal">Normal</option></select></label>{kind === "binomial" && <><Range label="Trials n" value={Math.round(a)} min={2} max={40} onChange={setA} /><Range label="Success p" value={b} min={.05} max={.95} step={.05} onChange={setB} /></>}{kind === "poisson" && <Range label="Rate λ" value={a} min={.5} max={15} step={.5} onChange={setA} />}{kind === "normal" && <><Range label="Mean μ" value={a} min={-3} max={3} step={.5} onChange={setA} /><Range label="Scale σ" value={b} min={.5} max={3} step={.25} onChange={setB} /></>}</div>
    <div className="distribution-layout"><DistributionCanvas kind={kind} a={a} b={b} /><div className="moment-cards"><div><span>mean</span><strong>{mean.toFixed(2)}</strong></div><div><span>variance</span><strong>{variance.toFixed(2)}</strong></div><p>{kind === "binomial" ? "Count successes in a fixed number of independent trials." : kind === "poisson" ? "Count events arriving at a stable average rate." : "Model additive variation around a center."}</p></div></div>
  </article>;
}

function JointCanvas({ rho }: { rho: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return; const s = setupCanvas(canvas); if (!s) return;
    const { ctx, w, h } = s, pad = 28, rand = seeded(734);
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = "white"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#dce1e7"; ctx.beginPath(); ctx.moveTo(w / 2, pad); ctx.lineTo(w / 2, h - pad); ctx.moveTo(pad, h / 2); ctx.lineTo(w - pad, h / 2); ctx.stroke();
    for (let i = 0; i < 260; i++) { const x = gaussian(rand), z = gaussian(rand), y = rho * x + Math.sqrt(Math.max(0, 1 - rho * rho)) * z; const px = pad + (clamp(x, -3.3, 3.3) + 3.3) / 6.6 * (w - 2 * pad), py = h - pad - (clamp(y, -3.3, 3.3) + 3.3) / 6.6 * (h - 2 * pad); ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fillStyle = "rgba(103,80,164,.48)"; ctx.fill(); }
  }, [rho]);
  return <canvas ref={ref} className="joint-canvas" role="img" aria-label={`Scatterplot with correlation ${rho}`} />;
}

function JointLab() {
  const [rho, setRho] = useState(.7);
  return <article className="lab-card"><LabHeader index="07" eyebrow="Dependence lab" title="Turn the correlation dial" text="Correlation captures linear alignment—not every form of dependence, and never causation by itself." /><Range label="Population correlation ρ" value={rho} min={-.95} max={.95} step={.05} onChange={setRho} /><div className="joint-layout"><JointCanvas rho={rho} /><div className="rho-panel"><p>ρ</p><strong>{rho.toFixed(2)}</strong><span>{Math.abs(rho) > .75 ? "strong linear association" : Math.abs(rho) > .35 ? "moderate linear association" : "weak linear association"}</span><blockquote>Zero correlation only means no linear trend. A curve can still be perfectly predictable.</blockquote></div></div></article>;
}

type BaseKind = "uniform" | "exponential" | "bernoulli";

function sampleBase(kind: BaseKind, rand: () => number) {
  if (kind === "uniform") return rand();
  if (kind === "exponential") return -Math.log(Math.max(1e-12, rand()));
  return rand() < .3 ? 1 : 0;
}

function baseMoments(kind: BaseKind) {
  return kind === "uniform" ? { mean: .5, sd: Math.sqrt(1 / 12) } : kind === "exponential" ? { mean: 1, sd: 1 } : { mean: .3, sd: Math.sqrt(.21) };
}

function HistogramCanvas({ values, center }: { values: number[]; center: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return; const s = setupCanvas(canvas); if (!s) return; const { ctx, w, h } = s, pad = 30;
    const min = Math.min(...values), max = Math.max(...values), bins = 34, counts = Array(bins).fill(0);
    values.forEach(v => counts[Math.min(bins - 1, Math.floor((v - min) / Math.max(1e-9, max - min) * bins))]++); const peak = Math.max(...counts);
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = "white"; ctx.fillRect(0, 0, w, h);
    counts.forEach((c, i) => { const bw = (w - 2 * pad) / bins, bh = c / peak * (h - 2 * pad); ctx.fillStyle = i % 2 ? "#6750a4" : "#7f6ab6"; ctx.fillRect(pad + i * bw, h - pad - bh, Math.max(1, bw - 1), bh); });
    const cx = pad + (center - min) / Math.max(1e-9, max - min) * (w - 2 * pad); ctx.strokeStyle = "#d85d75"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, pad); ctx.lineTo(cx, h - pad); ctx.stroke();
    ctx.fillStyle = "#647084"; ctx.font = "11px system-ui"; ctx.fillText(min.toFixed(2), pad, h - 10); ctx.fillText(max.toFixed(2), w - pad - 25, h - 10);
  }, [values, center]);
  return <canvas ref={ref} className="hist-canvas" role="img" aria-label="Histogram of simulated sample means" />;
}

function SamplingLab() {
  const [kind, setKind] = useState<BaseKind>("exponential"), [n, setN] = useState(5), [seed, setSeed] = useState(19);
  const moments = baseMoments(kind);
  const means = useMemo(() => { const rand = seeded(seed); return Array.from({ length: 2600 }, () => { let sum = 0; for (let i = 0; i < n; i++) sum += sampleBase(kind, rand); return sum / n; }); }, [kind, n, seed]);
  const intervals = useMemo(() => { const rand = seeded(seed + 1000); return Array.from({ length: 28 }, () => { let sum = 0; for (let i = 0; i < n; i++) sum += sampleBase(kind, rand); const estimate = sum / n, half = 1.96 * moments.sd / Math.sqrt(n); return { lo: estimate - half, hi: estimate + half, hit: estimate - half <= moments.mean && moments.mean <= estimate + half }; }); }, [kind, n, seed, moments.mean, moments.sd]);
  const coverage = intervals.filter(x => x.hit).length;
  return <article className="lab-card"><LabHeader index="08" eyebrow="Sampling lab" title="Repeat the sample, not the slogan" text="See the CLT reshape averages, then watch confidence intervals succeed and occasionally miss." /><div className="control-line"><label className="select-field"><span>Population</span><select value={kind} onChange={e => setKind(e.target.value as BaseKind)}><option value="uniform">Uniform</option><option value="exponential">Exponential</option><option value="bernoulli">Bernoulli(.3)</option></select></label><Range label="Sample size n" value={n} min={1} max={60} onChange={setN} /><button className="resample" onClick={() => setSeed(s => s + 1)}>New experiment</button></div><div className="sampling-layout"><div><p className="micro-label">2,600 simulated sample means</p><HistogramCanvas values={means} center={moments.mean} /><div className="sampling-stats"><span>center <b>{moments.mean.toFixed(2)}</b></span><span>standard error <b>{(moments.sd / Math.sqrt(n)).toFixed(3)}</b></span></div></div><div><p className="micro-label">28 nominal 95% intervals · {coverage} cover μ</p><div className="intervals">{intervals.map((x, i) => { const scale = moments.sd * 3.7; const left = clamp(50 + (x.lo - moments.mean) / scale * 50, 0, 100), right = clamp(50 + (x.hi - moments.mean) / scale * 50, 0, 100); return <span key={i} className={x.hit ? "hit" : "miss"} style={{ left: `${left}%`, width: `${Math.max(2, right - left)}%` }} />; })}<i /></div></div></div></article>;
}

function BetaCanvas({ alpha, beta, successes, failures }: { alpha: number; beta: number; successes: number; failures: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return; const s = setupCanvas(canvas); if (!s) return; const { ctx, w, h } = s, pad = 34;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = "white"; ctx.fillRect(0, 0, w, h);
    const density = (x: number, a: number, b: number) => x ** (a - 1) * (1 - x) ** (b - 1);
    const xs = Array.from({ length: 199 }, (_, i) => (i + 1) / 200), postA = alpha + successes, postB = beta + failures;
    const prior = xs.map(x => density(x, alpha, beta)), posterior = xs.map(x => density(x, postA, postB)), maxY = Math.max(...prior, ...posterior);
    const draw = (values: number[], color: string, width: number) => { ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; values.forEach((v, i) => { const x = pad + i / (values.length - 1) * (w - 2 * pad), y = h - pad - v / maxY * (h - 2 * pad); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); };
    ctx.strokeStyle = "#dce1e7"; ctx.beginPath(); ctx.moveTo(pad, h - pad); ctx.lineTo(w - pad, h - pad); ctx.stroke(); draw(prior, "#e9a23b", 2); draw(posterior, "#2a8c82", 3);
    ctx.fillStyle = "#647084"; ctx.font = "12px system-ui"; ctx.fillText("0", pad, h - 10); ctx.fillText("1", w - pad - 4, h - 10);
  }, [alpha, beta, successes, failures]);
  return <canvas ref={ref} className="beta-canvas" role="img" aria-label="Prior and posterior beta density curves" />;
}

function BayesianLab() {
  const [alpha, setAlpha] = useState(2), [beta, setBeta] = useState(2), [successes, setSuccesses] = useState(8), [failures, setFailures] = useState(2);
  const postA = alpha + successes, postB = beta + failures, priorMean = alpha / (alpha + beta), postMean = postA / (postA + postB);
  return <article className="lab-card"><LabHeader index="09" eyebrow="Bayesian lab" title="Watch evidence move a prior" text="Treat uncertainty about a proportion as a distribution, update it, then predict the next trial." /><div className="quad-controls"><Range label="Prior α" value={alpha} min={1} max={20} onChange={setAlpha} /><Range label="Prior β" value={beta} min={1} max={20} onChange={setBeta} /><Range label="Successes" value={successes} min={0} max={40} onChange={setSuccesses} /><Range label="Failures" value={failures} min={0} max={40} onChange={setFailures} /></div><div className="bayesian-layout"><div><BetaCanvas alpha={alpha} beta={beta} successes={successes} failures={failures} /><div className="curve-legend"><span className="prior">prior Beta({alpha},{beta})</span><span className="posterior">posterior Beta({postA},{postB})</span></div></div><div className="update-panel"><div><span>prior mean</span><strong>{priorMean.toFixed(3)}</strong></div><i>+</i><div><span>data</span><strong>{successes}/{successes + failures || 0}</strong></div><i>→</i><div className="posterior"><span>posterior mean</span><strong>{postMean.toFixed(3)}</strong></div><p>Posterior predictive chance of success on the next trial: <b>{(postMean * 100).toFixed(1)}%</b></p></div></div></article>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  return <main>
    <nav className="topbar"><a className="brand" href="#top" aria-label="Chance, Data, and Decisions home"><span>CD</span><b>Chance, Data,<br />and Decisions</b></a><button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu}>Menu</button><div className={menu ? "navlinks open" : "navlinks"}><a href="#course">Course</a><a href="#labs">Labs</a><a href="#practice">Practice</a><a className="pdf-link" href="/course-packet.pdf">PDF edition ↗</a></div></nav>

    <header className="hero" id="top"><div className="hero-copy"><p className="kicker">An interactive introduction to probability and statistics</p><h1>Chance,<br />Data, <span>and Decisions</span></h1><p className="lede">Start with what might happen. Observe what did. Then learn how evidence turns uncertainty into a calibrated decision.</p><div className="hero-actions"><a className="button primary" href="#labs">Enter the probability lab</a><a className="button quiet" href="#course">See the 14-week course</a></div><div className="hero-meta"><span>9 chapters</span><span>9 live experiments</span><span>Worked examples & exercises</span><span>4 notebooks</span></div></div><div className="hero-visual" aria-hidden="true"><div className="sample-cloud">{Array.from({ length: 26 }, (_, i) => <i key={i} style={{ left: `${9 + (i * 37) % 82}%`, top: `${8 + (i * 53) % 46}%`, opacity: .45 + (i % 4) * .14 }} />)}</div><div className="bell"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="hero-formula"><span>posterior</span><b>∝</b><span>likelihood × prior</span></div></div></header>

    <section className="manifesto"><p>model</p><i>→</i><p>simulate</p><i>→</i><p>observe</p><i>→</i><p>infer</p><i>→</i><p>check</p></section>

    <section className="section course-section" id="course"><div className="section-heading"><div><p className="eyebrow">The course</p><h2>One uncertainty unlocks the next.</h2></div><p>The sequence follows a single intellectual arc: outcomes become variables, variables form distributions, distributions generate samples, and samples support inference.</p></div><div className="chapter-grid">{chapters.map(c => <article className={`chapter-card ${c.tone}`} key={c.n}><span>{c.n}</span><p>{c.topic}</p><h3>{c.title}</h3><em>{c.blurb}</em></article>)}</div><div className="course-cta"><div><strong>Designed for a first undergraduate course</strong><span>Two 75-minute meetings per week · algebra and introductory calculus</span></div><a href="/course-packet.pdf">Download the expanded course packet</a></div></section>

    <section className="section labs-section" id="labs"><div className="section-heading light"><div><p className="eyebrow">Interactive companion</p><h2>Make randomness visible.</h2></div><p>Every lab pairs a manipulable model with an interpretation question. Simulation is a microscope for assumptions—not a substitute for them.</p></div><nav className="lab-jump-links" aria-label="Early-course labs"><a href="#counting">Permutations & combinations</a><a href="#inclusion-exclusion">Inclusion–exclusion</a><a href="#birthdays">Birthday paradox</a></nav><div className="labs-stack"><VennLab /><CountingLab /><InclusionExclusionLab /><BirthdayLab /><BayesLab /><DistributionLab /><JointLab /><SamplingLab /><BayesianLab /></div></section>

    <section className="section practice-section" id="practice"><div className="section-heading"><div><p className="eyebrow">Practice architecture</p><h2>Calculate. Explain. Critique.</h2></div><p>A complete assignment mixes technical fluency, mathematical reasoning, and model criticism.</p></div><div className="practice-grid"><article><span>01 · Fluency</span><h3>Translate precisely</h3><p>Move among words, events, tables, distributions, and formulas.</p><strong>Example prompt</strong><blockquote>Choose a committee, assign officers, then explain the difference in the counts.</blockquote></article><article><span>02 · Reasoning</span><h3>Justify the bridge</h3><p>Derive results and identify exactly where assumptions enter.</p><strong>Example prompt</strong><blockquote>Why does the triple intersection have to be added back in inclusion–exclusion?</blockquote></article><article><span>03 · Exploration</span><h3>Stress-test a model</h3><p>Simulate, visualize, compare, and diagnose a mismatch.</p><strong>Example prompt</strong><blockquote>Why is a birthday match anywhere in the room more likely than a match with one particular person?</blockquote></article></div><div className="course-cta assignment-download"><div><p className="eyebrow">Problem Set 2</p><strong>Counting, events, and shared birthdays</strong><span>Probability spaces · binomial coefficients · both forms of inclusion–exclusion</span></div><a href="/problem-set-02.pdf" download>Download the problem set</a></div><div className="notebook-strip"><div><p className="eyebrow">Computational companion</p><h3>Four ready-to-run Python notebooks</h3></div><div><a href="/01_sets_conditioning_bayes.ipynb">Sets & Bayes</a><a href="/02_distributions_and_moments.ipynb">Distributions</a><a href="/03_joint_clt_bootstrap.ipynb">Joint & CLT</a><a href="/04_inference_and_bayes.ipynb">Inference</a></div></div></section>

    <section className="closing"><div><p className="eyebrow">The governing question</p><h2>What would we expect to see if our model were true?</h2><p>That question joins probability, simulation, estimation, testing, and posterior prediction. It also keeps inference honest.</p></div><div className="closing-mark">P</div></section>
    <footer><p>Chance, Data, and Decisions · adaptable one-semester course</p><a href="/course-packet.pdf">Printable edition</a></footer>
  </main>;
}
