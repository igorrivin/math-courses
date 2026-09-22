"use client";

import { useMemo, useState } from "react";
import { cattle, cattleResidues, fundamentalPell, pellConvergents, sqrtPeriod } from "./quadratic-math.mjs";

const mirrorColors = ["#d7e9e2", "#f4e0b9", "#efcec5", "#dce0f2", "#e3e7c8"];

export function PellLab() {
  const [D, setD] = useState(13);
  const { a0, period } = useMemo(() => sqrtPeriod(D), [D]);
  const L = period.length;
  const rows = useMemo(() => pellConvergents(D, 2 * L), [D, L]);
  const fundamental = useMemo(() => fundamentalPell(D)!, [D]);
  return <article className="lab-card" id="pell">
    <header className="lab-header"><div className="lab-index">08</div><div><p className="eyebrow">Exact quadratic lab</p><h3>Which convergent solves Pell?</h3><p>Read the palindrome, follow the complete quotients, and locate the first norm-one solution.</p></div></header>
    <div className="control-row wrap">
      <label className="field"><span>Nonsquare D</span><select value={D} onChange={e => setD(Number(e.target.value))}>{[2, 3, 6, 7, 13, 23, 61, 109].map(d => <option key={d} value={d}>{d}</option>)}</select></label>
      <p className="quadratic-caption">√{D} has initial digit a<sub>0</sub> = {String(a0)} and least period L = {L}.</p>
    </div>
    <div className="period-strip" aria-label={`Period of square root of ${D}: ${period.map(s => s.a).join(", ")}`}>
      {period.map((state, i) => <span key={i} className={i === L - 1 ? "period-digit terminal" : "period-digit"} style={i < L - 1 ? { background: mirrorColors[Math.min(i, L - 2 - i) % mirrorColors.length] } : undefined}><b>{String(state.a)}</b><small>{i === L - 1 ? "2a₀" : `a${i + 1}`}</small></span>)}
    </div>
    <p className="observation"><b>The palindromic part:</b> remove the final 2a<sub>0</sub>; the remaining digits read the same from either end. Matching colors mark reflected positions. Galois’s criterion and reversal of the period of √D + a<sub>0</sub> explain the symmetry.</p>
    <div className="pell-certificate" aria-live="polite"><span>First positive solution of x² − {D}y² = 1</span><strong>x = {String(fundamental.p)}<br />y = {String(fundamental.q)}</strong><p>{L % 2 ? "Odd period: one period gives −1; two periods give +1." : "Even period: one period gives +1; negative Pell has no integer solution."}</p></div>
    <div className="quadratic-table-wrap" tabIndex={0} role="region" aria-label="Exact Pell convergents; scroll horizontally on small screens">
      <table className="quadratic-table"><caption>Two periods of convergents. Every entry is an exact integer.</caption><thead><tr><th scope="col">k</th><th scope="col">a<sub>k</sub></th><th scope="col">p<sub>k</sub> / q<sub>k</sub></th><th scope="col">Q<sub>k+1</sub></th><th scope="col">p<sub>k</sub>² − Dq<sub>k</sub>²</th></tr></thead><tbody>{rows.map(row => <tr key={row.k} className={row.Qnext === BigInt(1) ? "pell-hit" : ""}><th scope="row">{row.k}</th><td>{String(row.a)}</td><td>{String(row.p)} / {String(row.q)}</td><td>{String(row.Qnext)}</td><td>{row.norm > 0 ? "+" : ""}{String(row.norm)}{row.Qnext === BigInt(1) ? " · Pell" : ""}</td></tr>)}</tbody></table>
    </div>
    <details className="proof-details"><summary>Why the right convergent must work</summary><p>Write the next complete quotient as x<sub>k+1</sub> = (P<sub>k+1</sub> + √D)/Q<sub>k+1</sub>. Substitute it into √D = (p<sub>k</sub>x<sub>k+1</sub> + p<sub>k−1</sub>)/(q<sub>k</sub>x<sub>k+1</sub> + q<sub>k−1</sub>). Comparing the rational and irrational parts, then using the determinant of the convergent matrix, gives the exact identity</p><p className="quadratic-formula">p<sub>k</sub>² − Dq<sub>k</sub>² = (−1)<sup>k+1</sup>Q<sub>k+1</sub>.</p><p>The complete quotient has Q<sub>k+1</sub> = 1 exactly when L divides k + 1. Therefore the Pell convergents are precisely those with k = mL − 1, and their sign is (−1)<sup>mL</sup>. For positive Pell, stop at k = L − 1 if L is even, or k = 2L − 1 if L is odd: just before the relevant final digit 2a<sub>0</sub>.</p><p><a href="/course-packet.pdf#nameddest=section.3.10">Read the complete proof and the theorem generating all solutions →</a></p></details>
    <p className="observation"><b>Try D = 61.</b> A modest radicand can have a very large first solution. Explain its index using the period, then reproduce it in <a href="/05_pell_and_archimedes.ipynb" download>Sage Lab 5</a>.</p>
  </article>;
}

export function CattleLab() {
  const orbit = useMemo(() => cattleResidues(), []);
  const last = orbit.length - 1;
  const [exponent, setExponent] = useState(1);
  const row = orbit[exponent];
  return <article className="lab-card" id="cattle">
    <header className="lab-header"><div className="lab-index">09</div><div><p className="eyebrow">Archimedes’ Cattle of the Sun</p><h3>A small remainder selects an enormous herd.</h3><p>Seven proportions leave one scale factor. A square and a triangle turn that scale into a Pell problem.</p></div></header>
    <ol className="cattle-reduction"><li><b>Proportions</b><span>Total cattle = 50,389,082t.</span></li><li><b>Square</b><span>White + black bulls force t = 4,456,749r².</span></li><li><b>Triangle</b><span>X² − 4,729,494Z² = 1, with Z = 9,314r.</span></li></ol>
    <p>The least positive unit ε = u + v√4,729,494 generates every positive Pell solution: ε<sup>j</sup> = X<sub>j</sub> + Z<sub>j</sub>√4,729,494. The cattle condition is <b>9,314 divides Z<sub>j</sub></b>. Follow the coefficients modulo 9,314 to find the first admissible exponent.</p>
    <div className="control-row wrap"><label className="field grow"><span>Exponent j: {exponent}</span><input type="range" min="1" max={last} step="1" value={exponent} onChange={e => setExponent(Number(e.target.value))} /></label><button className="orbit-button" onClick={() => setExponent(1)}>Start at j = 1</button><button className="orbit-button primary" onClick={() => setExponent(last)}>First admissible power</button></div>
    <div className="cattle-residues" aria-live="polite"><div><span>X<sub>{exponent}</sub> mod 9,314</span><strong>{String(row.a)}</strong></div><div><span>Z<sub>{exponent}</sub> mod 9,314</span><strong>{String(row.b)}</strong></div><p>{row.b === BigInt(0) ? "Divisible: this power gives an integer herd." : "Not divisible: this Pell solution fails the cattle condition."}</p></div>
    <p className="observation"><b>Minimality needs both steps.</b> The residue recurrence checks every exponent from 1 through {last.toLocaleString("en-US")}. Its first zero second coefficient occurs at j = 2,329. Since all positive Pell solutions are powers of ε and their second coefficients increase, this gives the smallest herd: <b>206,545 decimal digits</b>, approximately 7.760271406 × 10<sup>206544</sup>.</p>
    <details className="proof-details"><summary>Inspect the exact unit and the modular recurrence</summary><p className="exact-integer">u = {String(cattle.u)}<br />v = {String(cattle.v)}</p><p>The continued fraction of √4,729,494 has period 92. Its convergent p<sub>91</sub>/q<sub>91</sub> supplies (u, v). Modulo 9,314, the unit has coefficients (9,063, 7,708), and D is 7,296.</p><p className="quadratic-formula">(a, b) ↦ (9,063a + 7,296 · 7,708b, 7,708a + 9,063b) mod 9,314.</p><p>At j = 2,329, the pair is (9,313, 0). <a href="/05_pell_and_archimedes.ipynb" download>The Sage notebook</a> constructs the complete integer herd and verifies every original proportion, the square, and the triangle.</p></details>
    <p><a href="/course-packet.pdf#nameddest=section.3.11">Follow the full reduction in the book →</a> · Ilan Vardi, <a href="https://doi.org/10.1080/00029890.1998.12004887">Archimedes’ Cattle Problem</a> (<a href="https://www.maths.tcd.ie/~lebed/Cattle%20problem%20Ilan%20Vardi.pdf">preprint</a>).</p>
  </article>;
}
