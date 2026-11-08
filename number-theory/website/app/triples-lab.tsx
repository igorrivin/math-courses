"use client";
import { useState } from "react";
import { pythagoreanTriple } from "./descent-math.mjs";
export default function TriplesLab() {
  const [m, setM] = useState(3), [n, setN] = useState(2);
  const t = pythagoreanTriple(m, n);
  const x = 280 * t.a / t.c, y = 280 * t.b / t.c;
  const corner = Math.min(18, x * .4, y * .4);
  return <div className="lesson-panel">
    <h3>Build a triple. Test the hypotheses.</h3>
    <div className="lesson-controls">
      <label>Parameter m: {m}<input type="range" min="2" max="20" value={m} onChange={e => { const v = Number(e.target.value); setM(v); setN(Math.min(n, v - 1)); }} /></label>
      <label>Parameter n: {n}<input type="range" min="1" max={m - 1} value={n} onChange={e => setN(Number(e.target.value))} /></label>
    </div>
    <svg className="lesson-chart" viewBox="0 0 420 340" role="img" aria-label={`Right triangle with legs ${t.a} and ${t.b} and hypotenuse ${t.c}`}>
      <path d={`M 55 290 L ${55 + x} 290 L 55 ${290 - y} Z`} fill="#2a8c8220" stroke="#246c66" strokeWidth="3" />
      <path d={`M 55 ${290 - corner} L ${55 + corner} ${290 - corner} L ${55 + corner} 290`} fill="none" stroke="#243b5b" />
      <text x={55 + x / 2} y="318" textAnchor="middle" fill="#17243a">a = {t.a}</text>
      <text x="10" y={290 - y / 2} fill="#17243a">{t.b}</text>
      <text x={75 + x / 2} y={280 - y / 2} fill="#17243a">c = {t.c}</text>
    </svg>
    <div className="lesson-stats" aria-live="polite"><div><span>Triple</span><strong>({t.a}, {t.b}, {t.c})</strong></div><div><span>gcd of the legs</span><strong>{t.divisor}</strong></div><div><span>Primitive?</span><strong>{t.primitive ? "Yes" : "No"}</strong></div></div>
    <p>Parameters coprime: <b>{t.coprime ? "yes" : "no"}</b>. Opposite parity: <b>{t.oppositeParity ? "yes" : "no"}</b>. Both conditions are needed for a primitive triple. The identity a² + b² = c² holds for every permitted pair.</p>
    <p className="lesson-note">Try (m,n) = (3,1), then (4,2). The first fails parity; the second fails coprimality. Dividing the resulting triple by its common divisor recovers a primitive one.</p>
  </div>;
}
