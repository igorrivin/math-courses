"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EuclidRow = { a: number; b: number; q: number; r: number };

const chapters = [
  { n: "01", title: "The algorithm in a rectangle", topic: "Euclid · Bézout · Diophantine equations", accent: "teal", blurb: "Turn repeated division into a proof-producing machine." },
  { n: "02", title: "Every integer has an address", topic: "Unique factorization · √2 irrational · Eratosthenes", accent: "gold", blurb: "Use prime exponents for proof, then uncover primes with the sieve." },
  { n: "03", title: "Fractions inside fractions", topic: "Matrices · Periodic surds · Pell equations", accent: "coral", blurb: "Turn repeating digit matrices into convergents and Pell solutions." },
  { n: "04", title: "Arithmetic on a clock", topic: "Congruences · Inverses · Chinese remainders", accent: "teal", blurb: "Forget complete turns and preserve arithmetic structure." },
  { n: "05", title: "A theorem you can rotate", topic: "Necklace orbits · Fermat’s little theorem", accent: "gold", blurb: "Watch divisibility emerge from cyclic symmetry." },
  { n: "06", title: "The reusable machine", topic: "Groups · Cosets · Lagrange · Euler", accent: "coral", blurb: "Name the structure shared by clocks and rotations." },
  { n: "07", title: "Arithmetic in Pascal’s triangle", topic: "Binomial coefficients · Valuations · Kummer", accent: "teal", blurb: "Find prime divisibility hiding in base-p carries." },
  { n: "08", title: "How crowded are the primes?", topic: "Central coefficients · θ(x) · Chebyshev", accent: "gold", blurb: "Use the middle of Pascal’s triangle to count primes." },
];

function gcd(a: number, b: number) {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) [a, b] = [b, a % b];
  return a;
}

function extendedGcd(a: number, b: number): [number, number, number] {
  let oldR = a, r = b, oldS = 1, s = 0, oldT = 0, t = 1;
  while (r !== 0) {
    const q = Math.trunc(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  return [Math.abs(oldR), oldR < 0 ? -oldS : oldS, oldR < 0 ? -oldT : oldT];
}

function euclidRows(x: number, y: number): EuclidRow[] {
  let a = Math.max(1, Math.abs(Math.trunc(x)));
  let b = Math.max(1, Math.abs(Math.trunc(y)));
  if (a < b) [a, b] = [b, a];
  const rows: EuclidRow[] = [];
  while (b) {
    const q = Math.floor(a / b), r = a % b;
    rows.push({ a, b, q, r });
    [a, b] = [b, r];
  }
  return rows;
}

function continuedFraction(value: number, depth: number) {
  const coeffs: number[] = [];
  let x = value;
  for (let i = 0; i < depth; i++) {
    const a = Math.floor(x);
    coeffs.push(a);
    const rem = x - a;
    if (Math.abs(rem) < 1e-12) break;
    x = 1 / rem;
  }
  let pm2 = 0, pm1 = 1, qm2 = 1, qm1 = 0;
  const convergents = coeffs.map((a) => {
    const p = a * pm1 + pm2, q = a * qm1 + qm2;
    [pm2, pm1] = [pm1, p];
    [qm2, qm1] = [qm1, q];
    const delta = value - p / q;
    return { p, q, error: Math.abs(delta), side: delta > 1e-13 ? "below" : delta < -1e-13 ? "above" : "exact" };
  });
  return { coeffs, convergents };
}

function powBig(base: bigint, exp: number) {
  let result = 1n, b = base, e = exp;
  while (e > 0) {
    if (e % 2) result *= b;
    b *= b;
    e = Math.floor(e / 2);
  }
  return result;
}

function sieve(n: number) {
  const prime = Array(n + 1).fill(true);
  prime[0] = prime[1] = false;
  for (let p = 2; p * p <= n; p++) if (prime[p]) for (let k = p * p; k <= n; k += p) prime[k] = false;
  const count = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) count[i] = count[i - 1] + (prime[i] ? 1 : 0);
  return { prime, count };
}

function LabHeader({ eyebrow, title, text, index }: { eyebrow: string; title: string; text: string; index: string }) {
  return (
    <header className="lab-header">
      <div className="lab-index">{index}</div>
      <div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3><p>{text}</p></div>
    </header>
  );
}

function NumberField({ label, value, setValue, min = 1, max = 9999 }: { label: string; value: number; setValue: (n: number) => void; min?: number; max?: number }) {
  return <label className="field"><span>{label}</span><input type="number" value={value} min={min} max={max} onChange={(e) => setValue(Math.max(min, Math.min(max, Number(e.target.value) || min)))} /></label>;
}

function EuclidLab() {
  const [a, setA] = useState(391), [b, setB] = useState(299);
  const rows = useMemo(() => euclidRows(a, b), [a, b]);
  const [d, x, y] = useMemo(() => extendedGcd(a, b), [a, b]);
  const big = Math.max(a, b), small = Math.min(a, b), ratio = small / big;
  const partialQuotients = rows.map(row => row.q);
  const cfLabel = partialQuotients.length > 1 ? `${partialQuotients[0]}; ${partialQuotients.slice(1).join(", ")}` : `${partialQuotients[0]}`;
  return (
    <article className="lab-card" id="euclid">
      <LabHeader index="01" eyebrow="Algorithm lab" title="Tile the rectangle" text="Change the side lengths. The picture and proof trace update together." />
      <div className="control-row"><NumberField label="Width" value={a} setValue={setA} /><NumberField label="Height" value={b} setValue={setB} /></div>
      <div className="euclid-layout">
        <div className="rectangle-stage" aria-label={`${big} by ${small} rectangle`}>
          <div className="rectangle" style={{ aspectRatio: `${big}/${small}` }}>
            {rows.slice(0, 4).map((row, i) => <span key={i} className={`tile-band band-${i}`} style={{ width: `${Math.max(4, (row.b / big) * 100)}%` }} />)}
            <strong>{big} × {small}</strong><em>final tile: {d} × {d}</em>
          </div>
          <div className="measure" style={{ width: `${Math.max(36, ratio * 100)}%` }}>gcd = {d}</div>
        </div>
        <div className="proof-trace">
          {rows.map((row, i) => <div className="division" key={i}><span>{row.a}</span><b>=</b><span>{row.q} · {row.b}</span><b>+</b><mark>{row.r}</mark></div>)}
          <div className="bezout"><span>Bézout certificate</span><strong>{d} = {x}({a}) + {y}({b})</strong></div>
        </div>
      </div>
      <p className="observation"><b>The same data, read forward:</b> {big}/{small} = [{cfLabel}]. These partial quotients generate convergents whose signed coefficients reproduce the Euclidean remainders.</p>
    </article>
  );
}

function ContinuedFractionLab() {
  const [mode, setMode] = useState("sqrt2"), [custom, setCustom] = useState(3.14159265), [depth, setDepth] = useState(7);
  const value = mode === "sqrt2" ? Math.sqrt(2) : mode === "phi" ? (1 + Math.sqrt(5)) / 2 : custom;
  const { coeffs, convergents } = useMemo(() => continuedFraction(value, depth), [value, depth]);
  return (
    <article className="lab-card" id="fractions">
      <LabHeader index="02" eyebrow="Approximation lab" title="Build a continued fraction" text="Watch simple fractions close in on an irrational target." />
      <div className="control-row wrap">
        <label className="field"><span>Target</span><select value={mode} onChange={e => setMode(e.target.value)}><option value="sqrt2">√2</option><option value="phi">Golden ratio φ</option><option value="custom">Custom decimal</option></select></label>
        {mode === "custom" && <NumberField label="Decimal" value={custom} setValue={setCustom} min={1} max={100} />}
        <label className="field grow"><span>Depth: {depth}</span><input type="range" min="2" max="10" value={depth} onChange={e => setDepth(Number(e.target.value))} /></label>
      </div>
      <div className="cf-display"><span>[</span>{coeffs.map((c, i) => <span key={i} className="cf-term">{i === 0 ? `${c};` : c}{i < coeffs.length - 1 && i > 0 ? "," : ""}</span>)}<span>]</span></div>
      <div className="convergents">
        {convergents.map((c, i) => {
          const quality = Math.max(3, Math.min(100, -Math.log10(Math.max(c.error, 1e-15)) * 13));
          return <div className={`convergent ${c.side}`} key={i}><div><strong>{c.p}<i />{c.q}</strong><span>{c.side} · error {c.error.toExponential(1)}</span></div><div className="error-track"><span style={{ width: `${quality}%` }} /></div></div>;
        })}
      </div>
      <p className="observation"><b>The alternating trap:</b> the 1st, 3rd, 5th, … convergents rise below the target; the 2nd, 4th, 6th, … converge downward from above.</p>
      <p className="observation"><b>The matrix spine:</b> multiplying the digit matrices [[a, 1], [1, 0]] places consecutive convergents in its columns. Every product has determinant ±1, so it can be reversed over the integers.</p>
      <p className="observation"><b>A calendar is an approximation:</b> the tropical year has about 0.2422 extra days. Its convergents begin 1/4, 7/29, 8/33, 31/128. The Julian rule is 1/4; after requiring a cycle of whole centuries, the convergent 97/4 to the per-century excess 100 × 0.2422 becomes the Gregorian rate 97/400.</p>
      <p className="observation"><b>Venus writes Euclid in the sky:</b> about 13 Venus orbits fit into 8 Earth years, leaving 5 relative conjunction cycles; Euclid continues 13, 8, 5, 3, 2, 1. The Dresden Codex turns a rounded 584-day Venus cycle into exact calendar arithmetic: 5 × 584 = 8 × 365 = 2,920, and 13 such blocks align with the 260-day calendar after 37,960 days.</p>
      <p className="observation"><b>Almost base 11:</b> the Khinchin–Lévy law gives a typical precision factor of e<sup>π²/(6 log 2)</sup> ≈ 10.731 per continued-fraction term—about 1.03 decimal digits.</p>
      <p className="observation"><b>π looks typical; e does not:</b> for the first 100,000 partial quotients of π, the geometric mean is 2.67956 and q<sub>n</sub><sup>2/n</sup> is 10.67835, close to the generic targets 2.68545 and 10.73102—but no limiting theorem is known for π. Euler’s patterned expansion of e instead makes both statistics diverge.</p>
      <p className="observation"><b>Continued fractions can calculate:</b> Gosper’s homographic and bihomographic algorithms absorb input terms and emit certified output terms using only integer matrices. A modern interval-valued refinement prevents exact boundary cases—such as √2 × √2 = 2—from stalling forever.</p>
      <p className="observation"><b>Periodicity meets Pell:</b> Lagrange and Galois explain the repeating surd; its period matrices generate Pell solutions. In reverse, Legendre’s criterion recognizes every ±1 Pell solution as a convergent.</p>
    </article>
  );
}

function ModularLab() {
  const [mod, setMod] = useState(12), [start, setStart] = useState(9), [step, setStep] = useState(5);
  const result = ((start + step) % mod + mod) % mod;
  const units = Array.from({ length: mod }, (_, i) => i).filter(i => gcd(i, mod) === 1);
  const multiplier = units.find(u => u > 1) ?? 1;
  return (
    <article className="lab-card" id="modular">
      <LabHeader index="03" eyebrow="Congruence lab" title="Wind around a clock" text="Explore residues, units, and the permutation hiding inside a finite group." />
      <div className="control-row"><NumberField label="Modulus" value={mod} setValue={setMod} min={3} max={20} /><NumberField label="Start" value={start} setValue={setStart} min={0} max={99} /><NumberField label="Add" value={step} setValue={setStep} min={0} max={99} /></div>
      <div className="clock-layout">
        <div className="clock" aria-label={`Clock modulo ${mod}`}>
          <div className="clock-center"><small>mod</small><strong>{mod}</strong></div>
          {Array.from({ length: mod }, (_, i) => {
            const angle = (i / mod) * 360 - 90;
            const isStart = i === ((start % mod) + mod) % mod, isResult = i === result;
            return <span key={i} className={`hour ${isStart ? "start" : ""} ${isResult ? "result" : ""}`} style={{ transform: `rotate(${angle}deg) translate(0, -112px) rotate(${-angle}deg)` }}>{i}</span>;
          })}
        </div>
        <div className="clock-notes">
          <div className="equation"><strong>{start} + {step}</strong><span>≡</span><strong>{result}</strong><small>(mod {mod})</small></div>
          <p className="micro-label">Units modulo {mod}</p><div className="unit-list">{units.map(u => <span key={u}>{u}</span>)}</div>
          <p>Multiplication by <b>{multiplier}</b> rearranges these units:</p>
          <div className="permutation">{units.map((u, i) => <span key={u}>{u} <b>→</b> {(u * multiplier) % mod}{i < units.length - 1 ? ";" : ""}</span>)}</div>
        </div>
      </div>
    </article>
  );
}

const palette = ["#16888c", "#e1a52c", "#dc684b", "#815ac7", "#3c78d8"];

function NecklaceLab() {
  const [p, setP] = useState(5), [colors, setColors] = useState(3), [word, setWord] = useState([0, 1, 0, 2, 1]);
  useEffect(() => setWord(Array.from({ length: p }, (_, i) => i % colors)), [p, colors]);
  const rotations = Array.from({ length: p }, (_, k) => [...word.slice(k), ...word.slice(0, k)]);
  const distinct = Array.from(new Map(rotations.map(r => [r.join(""), r])).values());
  const total = powBig(BigInt(colors), p) - BigInt(colors);
  const cycleBead = (i: number) => setWord(w => w.map((v, j) => j === i ? (v + 1) % colors : v));
  return (
    <article className="lab-card" id="necklaces">
      <LabHeader index="04" eyebrow="Symmetry lab" title="Rotate a theorem" text="Color the beads, inspect the orbit, and see why prime length forces equal packets." />
      <div className="control-row">
        <label className="field"><span>Prime length</span><select value={p} onChange={e => setP(Number(e.target.value))}><option>3</option><option>5</option><option>7</option><option>11</option></select></label>
        <label className="field"><span>Colors</span><select value={colors} onChange={e => setColors(Number(e.target.value))}><option>2</option><option>3</option><option>4</option><option>5</option></select></label>
      </div>
      <div className="necklace-layout">
        <div className="necklace" style={{ width: p > 7 ? 300 : 270, height: p > 7 ? 300 : 270 }}>
          <div className="necklace-ring" />
          {word.map((c, i) => { const angle = (i / p) * 360 - 90; const radius = p > 7 ? 132 : 116; return <button key={i} aria-label={`Change bead ${i + 1}`} onClick={() => cycleBead(i)} style={{ background: palette[c], transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(${-angle}deg)` }} />; })}
          <span>tap a bead</span>
        </div>
        <div className="orbit-panel">
          <p className="micro-label">Rotational orbit · {distinct.length} distinct {distinct.length === 1 ? "word" : "words"}</p>
          <div className="orbit-list">{distinct.map((rotation, i) => <div key={i}><b>{i}</b>{rotation.map((c, j) => <span key={j} style={{ background: palette[c] }} />)}</div>)}</div>
          <div className="flt-card"><span>Nonconstant {colors}-color words</span><strong>{colors}<sup>{p}</sup> − {colors} = {total.toString()}</strong><em>{total.toString()} ÷ {p} = {(total / BigInt(p)).toString()} complete orbits</em></div>
        </div>
      </div>
    </article>
  );
}

function PascalLab() {
  const [prime, setPrime] = useState(2), [rows, setRows] = useState(18);
  const triangle = useMemo(() => {
    const data: number[][] = [];
    for (let n = 0; n < rows; n++) {
      const row = [1];
      for (let k = 1; k < n; k++) row.push((data[n - 1][k - 1] + data[n - 1][k]) % prime);
      if (n) row.push(1);
      data.push(row);
    }
    return data;
  }, [prime, rows]);
  const hue = ["#0f2438", "#16888c", "#e1a52c", "#dc684b", "#815ac7", "#3c78d8", "#72a85a"];
  return (
    <article className="lab-card" id="pascal">
      <LabHeader index="05" eyebrow="Divisibility lab" title="Color Pascal’s triangle" text="Reduce every entry modulo a prime. Base-p carries become a fractal you can see." />
      <div className="control-row wrap">
        <label className="field"><span>Prime</span><select value={prime} onChange={e => setPrime(Number(e.target.value))}><option>2</option><option>3</option><option>5</option><option>7</option></select></label>
        <label className="field grow"><span>Rows: {rows}</span><input type="range" min="8" max="36" value={rows} onChange={e => setRows(Number(e.target.value))} /></label>
      </div>
      <div className="pascal-wrap" aria-label={`Pascal's triangle modulo ${prime}`}>
        <div className="pascal" style={{ minWidth: Math.max(520, rows * 17) }}>
          {triangle.map((row, n) => <div key={n}>{row.map((v, k) => <span key={k} title={`C(${n},${k}) ≡ ${v} mod ${prime}`} style={{ background: v === 0 ? "#e8ede9" : hue[v % hue.length], opacity: v === 0 ? .42 : 1 }} />)}</div>)}
        </div>
      </div>
      <p className="observation"><b>Look for it:</b> blank cells are the coefficients divisible by {prime}. The repeating blocks are base-{prime} arithmetic made visible.</p>
    </article>
  );
}

function PrimePlot({ max, count }: { max: number; count: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(dpr, dpr); const w = rect.width, h = rect.height, pad = 38;
    ctx.clearRect(0, 0, w, h); ctx.strokeStyle = "#cfdbd9"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = pad + (h - pad * 2) * i / 4; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke(); }
    const maxY = Math.max(count[max], max / Math.log(max)) * 1.18;
    const draw = (color: string, fn: (x: number) => number, width: number) => { ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; for (let x = 2; x <= max; x += Math.max(1, Math.floor(max / 500))) { const px = pad + (x / max) * (w - 2 * pad), py = h - pad - (fn(x) / maxY) * (h - 2 * pad); if (x === 2) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.stroke(); };
    draw("#16888c", x => count[Math.floor(x)], 3); draw("#dc684b", x => x / Math.log(x), 2);
    ctx.fillStyle = "#5f6f78"; ctx.font = "12px system-ui"; ctx.fillText("0", 14, h - pad + 4); ctx.fillText(max.toLocaleString(), w - pad - 20, h - 12);
  }, [max, count]);
  return <canvas ref={ref} className="prime-canvas" role="img" aria-label={`Graph comparing pi of x and x over log x up to ${max}`} />;
}

function PrimeLab() {
  const [max, setMax] = useState(1000);
  const { prime, count } = useMemo(() => sieve(max), [max]);
  const approx = max / Math.log(max), lower = (Math.log(2) / 2) * approx, upper = 4 * approx;
  return (
    <article className="lab-card" id="primes">
      <LabHeader index="06" eyebrow="Sieve and prime-counting lab" title="Cross out composites, then count" text="Begin with Eratosthenes, then compare exact prime counts with the scale predicted by Chebyshev." />
      <label className="field range-wide"><span>Explore up to x = {max.toLocaleString()}</span><input type="range" min="50" max="5000" step="50" value={max} onChange={e => setMax(Number(e.target.value))} /></label>
      <div className="sieve-mini" aria-label="Sieve of Eratosthenes through 50">
        {Array.from({ length: 49 }, (_, i) => i + 2).map(n => <span className={prime[n] ? "survivor" : "crossed"} key={n}>{n}</span>)}
      </div>
      <p className="observation"><b>Sieve through 50:</b> boxed numbers survive. Crossing out multiples of 2, 3, 5, and 7 is enough because every composite has a prime factor no larger than its square root.</p>
      <p className="observation"><b>Existence versus a witness:</b> the classical argument with x = (√2)<sup>√2</sup> proves by cases that some pair of irrationals has a rational power, but does not say which pair. The explicit choice a = √2 and b = log<sub>√2</sub>3 gives a<sup>b</sup> = 3; unique factorization proves that b is irrational.</p>
      <div className="prime-stats"><div><span>π(x)</span><strong>{count[max]}</strong><em>exact</em></div><div><span>x / log x</span><strong>{approx.toFixed(1)}</strong><em>prediction</em></div><div><span>ratio</span><strong>{(count[max] / approx).toFixed(3)}</strong><em>π(x) ÷ prediction</em></div></div>
      <div className="plot-shell"><PrimePlot max={max} count={count} /><div className="legend"><span className="exact">π(x)</span><span className="estimate">x / log x</span></div></div>
      <div className="cheb-strip"><span>Chebyshev’s deliberately broad proved interval</span><strong>{lower.toFixed(1)} ≤ π({max}) ≤ {upper.toFixed(1)}</strong></div>
    </article>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Patterns, Proofs, and Primes home"><span>PP</span><b>Patterns, Proofs,<br />and Primes</b></a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu}>Menu</button>
        <div className={menu ? "navlinks open" : "navlinks"}><a href="#course">Course</a><a href="#labs">Labs</a><a href="#practice">Practice</a><a className="pdf-link" href="/course-packet.pdf">PDF edition ↗</a></div>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy"><p className="kicker">An interactive introduction to number theory</p><h1>Patterns,<br />Proofs, <span>and Primes</span></h1><p className="lede">Start with a rectangle. Rotate a necklace. Color Pascal’s triangle. Then follow the patterns all the way to a proof.</p><div className="hero-actions"><a className="button primary" href="#labs">Open the math lab</a><a className="button quiet" href="#course">See the 14-week course</a></div><div className="hero-meta"><span>8 chapters</span><span>6 live explorations</span><span>70+ exercises</span></div></div>
        <div className="hero-orbits" aria-hidden="true"><div className="orbit o1" /><div className="orbit o2" /><div className="orbit o3" /><div className="orbit o4" />{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 30}deg) translateY(-154px)` }} />)}<div className="hero-formula">a<sup>p</sup> ≡ a <span>(mod p)</span></div></div>
      </header>

      <section className="manifesto"><p>compute</p><i>→</i><p>notice</p><i>→</i><p>conjecture</p><i>→</i><p>prove</p><i>→</i><p>reuse</p></section>

      <section className="section course-section" id="course">
        <div className="section-heading"><div><p className="eyebrow">The course</p><h2>One idea unlocks the next.</h2></div><p>The sequence is a proof journey, not a catalogue: algorithms become structures, structures become symmetry, and symmetry becomes information about primes.</p></div>
        <div className="chapter-grid">{chapters.map((c) => <article className={`chapter-card ${c.accent}`} key={c.n}><span>{c.n}</span><p>{c.topic}</p><h3>{c.title}</h3><em>{c.blurb}</em></article>)}</div>
        <div className="course-cta"><div><strong>Designed for a first proof-oriented course</strong><span>Two 75-minute meetings per week · no calculus or abstract algebra required</span></div><a href="/course-packet.pdf">Download the complete 64-page packet</a></div>
      </section>

      <section className="section labs-section" id="labs">
        <div className="section-heading light"><div><p className="eyebrow">Interactive companion</p><h2>Touch the structure.</h2></div><p>Every experiment is paired with a proof question. Computation is the microscope—not the oracle.</p></div>
        <div className="labs-stack"><EuclidLab /><ContinuedFractionLab /><ModularLab /><NecklaceLab /><PascalLab /><PrimeLab /></div>
      </section>

      <section className="section practice-section" id="practice">
        <div className="section-heading"><div><p className="eyebrow">Practice architecture</p><h2>From calculation to explanation.</h2></div><p>Weekly work mixes three modes. The aim is not merely to get an answer, but to know what kind of reasoning produced it.</p></div>
        <div className="practice-grid">
          <article><span>01</span><h3>Fluency</h3><p>Focused calculations make later proofs readable.</p><strong>Example</strong><blockquote>Express gcd(527, 341) as 527x + 341y.</blockquote></article>
          <article><span>02</span><h3>Reasoning</h3><p>Intermediate claims guide students through complete proofs.</p><strong>Example</strong><blockquote>Why does a nonconstant word of prime length have exactly p rotations?</blockquote></article>
          <article><span>03</span><h3>Exploration</h3><p>Generate evidence, form a conjecture, then test its limits.</p><strong>Example</strong><blockquote>Color Pascal’s triangle modulo p. What do its repeating blocks know about base p?</blockquote></article>
        </div>
      </section>

      <section className="closing"><div><p className="eyebrow">The central lesson</p><h2>Proof is a way of seeing why a pattern had to appear.</h2><p>Print the formal development. Use the web to experiment. Move between them until the computation and the proof tell the same story.</p><div className="hero-actions"><a className="button primary" href="#euclid">Begin with Euclid</a><a className="button quiet" href="/course-packet.pdf">Open the PDF edition</a></div></div><div className="closing-mark">∴</div></section>

      <footer><a className="brand" href="#top"><span>PP</span><b>Patterns, Proofs,<br />and Primes</b></a><p>An adaptable teaching draft for an introductory number theory course.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
