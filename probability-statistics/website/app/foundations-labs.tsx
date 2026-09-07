"use client";

import { useState } from "react";
import { birthdayProbability, birthdayThreshold, combinations, designatedBirthdayProbability, inclusionExclusion, permutations, simulateBirthdays } from "./foundations-math.mjs";

function Header({ index, eyebrow, title, text }: { index: string; eyebrow: string; title: string; text: string }) {
  return <header className="lab-header"><span>{index}</span><div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3><p>{text}</p></div></header>;
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return <label className="range"><span>{label}<b>{value}</b></span><input type="range" min={min} max={max} step={1} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}

const exact = (n: bigint) => n.toLocaleString("en-US");
const percent = (p: number) => `${(100 * p).toFixed(2)}%`;

export function CountingLab() {
  const [n, setN] = useState(8), [k, setK] = useState(3);
  const unordered = combinations(n, k), ordered = permutations(n, k);
  const repeats = BigInt(n) ** BigInt(k), orderings = permutations(k, k);
  return <article className="lab-card" id="counting">
    <Header index="02" eyebrow="Counting lab" title="Does the order matter?" text="The same objects can produce very different sample spaces. Decide what makes two outcomes different." />
    <div className="control-line">
      <Slider label="Available objects n" value={n} min={1} max={12} onChange={v => { setN(v); setK(Math.min(k, v)); }} />
      <Slider label="Selected objects k" value={k} min={0} max={n} onChange={setK} />
    </div>
    <div className="counting-results" aria-live="polite" aria-atomic="true">
      <div><p className="micro-label">Unordered · no repetition</p><strong>{exact(unordered)}</strong><span>C({n}, {k}) = {n}! / ({k}! {n - k}!)</span><p>A committee: swapping members changes nothing.</p></div>
      <div><p className="micro-label">Ordered · no repetition</p><strong>{exact(ordered)}</strong><span>({n})<sub>{k}</sub> = {n}! / {n - k}!</span><p>Distinct offices: changing who fills each role changes the outcome.</p></div>
      <div><p className="micro-label">Ordered · repetition allowed</p><strong>{exact(repeats)}</strong><span>{n}<sup>{k}</sup></span><p>A sequence of draws with replacement.</p></div>
    </div>
    <p className="foundation-observation">Every {k}-element subset has {k}! = {exact(orderings)} orderings, so {exact(unordered)} × {exact(orderings)} = {exact(ordered)}. {k === 0 && "There is one empty selection; 0! = 1."}</p>
    <details className="foundation-detail"><summary>Read the binomial coefficient in Pascal’s triangle</summary>
      <p>Select an entry to change n and k. Each interior entry is the sum of the two above it: decide whether one distinguished object belongs to the subset.</p>
      <div className="pascal-scroll"><div className="pascal-triangle" aria-label="Pascal’s triangle, rows 0 through 12">
        {Array.from({ length: 13 }, (_, row) => <div className="pascal-row" key={row}><span className="pascal-index">n = {row}</span>{Array.from({ length: row + 1 }, (_, col) => <button type="button" key={col} aria-label={`Choose ${col} from ${row}: ${combinations(row, col)}`} aria-pressed={n === row && k === col} disabled={row === 0} onClick={() => { setN(row); setK(col); }}>{exact(combinations(row, col))}</button>)}</div>)}
      </div></div>
      {k > 0 && k < n ? <p className="foundation-equation">C({n}, {k}) = C({n - 1}, {k - 1}) + C({n - 1}, {k}) = {exact(combinations(n - 1, k - 1))} + {exact(combinations(n - 1, k))} = {exact(unordered)}</p> : <p className="foundation-equation">Boundary entries: C(n, 0) = C(n, n) = 1.</p>}
      <p>The binomial theorem counts the choices of factors that supply y: (x + y)<sup>n</sup> = Σ<sub>k=0</sub><sup>n</sup> C(n, k)x<sup>n−k</sup>y<sup>k</sup>. In particular, a row sums to 2<sup>n</sup>, the number of subsets.</p>
    </details>
  </article>;
}

const initialRegions = [20, 12, 10, 8, 6, 4, 5, 35];
const regionNames = ["A only", "B only", "C only", "A and B only", "A and C only", "B and C only", "All three", "None"];

export function InclusionExclusionLab() {
  const [regions, setRegions] = useState(initialRegions);
  const [mode, setMode] = useState<"counts" | "probabilities">("counts");
  const data = inclusionExclusion(regions), hasSpace = data.total > 0;
  const value = (count: number) => mode === "counts" ? String(count) : hasSpace ? `${count}/${data.total}` : "—";
  const terms = [...data.singles, ...data.pairs, data.triple];
  const termLabels = ["A", "B", "C", "A ∩ B", "A ∩ C", "B ∩ C", "A ∩ B ∩ C"];
  return <article className="lab-card" id="inclusion-exclusion">
    <Header index="03" eyebrow="Inclusion–exclusion lab" title="Count each outcome once." text="Build three events from disjoint regions, then see the same overlap correction in counts and probabilities." />
    <div className="control-line">
      <label className="select-field"><span>Read the formula as</span><select value={mode} onChange={e => setMode(e.target.value as "counts" | "probabilities")}><option value="counts">Set cardinalities</option><option value="probabilities">Event probabilities</option></select></label>
      <button type="button" className="resample" onClick={() => setRegions([...initialRegions])}>Restore example</button>
    </div>
    <p className="micro-label">Eight disjoint regions · edit their numbers of outcomes</p>
    <div className="region-inputs">{regionNames.map((name, i) => <label className={i === 6 ? "triple-region" : ""} key={name}><span>{name}</span><input type="number" min={0} max={100} step={1} value={regions[i]} onChange={e => { const raw = Number(e.target.value); const next = Number.isFinite(raw) ? Math.max(0, Math.min(100, Math.trunc(raw))) : 0; setRegions(previous => previous.map((v, j) => j === i ? next : v)); }} /></label>)}</div>
    <div className="ie-output" aria-live="polite" aria-atomic="true">
      <p className="foundation-equation">{mode === "counts" ? "|A ∪ B ∪ C|" : "P(A ∪ B ∪ C)"} = {value(data.union)}{mode === "probabilities" && hasSpace && ` = ${percent(data.union / data.total)}`}</p>
      <div className="ie-terms">{terms.map((count, i) => <div key={termLabels[i]}><span>{i < 3 ? "+" : i < 6 ? "−" : "+"} {mode === "counts" ? `|${termLabels[i]}|` : `P(${termLabels[i]})`}</span><strong>{value(count)}</strong></div>)}</div>
      <div className="region-summary"><span>Exactly one: <b>{value(data.exactlyOne)}</b></span><span>Exactly two: <b>{value(data.exactlyTwo)}</b></span><span>All three: <b>{value(data.triple)}</b></span><span>None: <b>{value(data.none)}</b></span></div>
    </div>
    {!hasSpace && <p className="foundation-alert" role="status">Add at least one outcome to define a probability space. An empty space cannot have total probability one.</p>}
    <p className="foundation-observation"><b>Why add the triple overlap back?</b> An outcome in all three events contributes 3 − 3 + 1 = 1. Every pairwise intersection includes the triple region.</p>
    <details className="foundation-detail"><summary>The probability space behind the picture</summary>
      <p>{hasSpace ? `Choose uniformly among the ${data.total} individual outcomes. Each has probability 1/${data.total}; a region receives its count divided by ${data.total}.` : "A uniform probability model requires at least one outcome."} The eight regions can also be regarded as eight outcomes with those generally unequal masses.</p>
      <p>Probabilistic inclusion–exclusion holds for arbitrary event probabilities, including nonuniform models. It does not require independence. In general, add singles, subtract pairs, add triples, and continue with alternating signs.</p>
    </details>
  </article>;
}

export function BirthdayLab() {
  const [people, setPeople] = useState(23), [days, setDays] = useState(365);
  const [simulation, setSimulation] = useState({ trials: 0, hits: 0 });
  const probability = birthdayProbability(people, days), designated = designatedBirthdayProbability(people, days);
  const pairCount = people * (people - 1) / 2, bound = Math.min(1, pairCount / days), threshold = birthdayThreshold(days);
  function reset(nextPeople: number, nextDays: number) {
    setPeople(nextPeople); setDays(nextDays); setSimulation({ trials: 0, hits: 0 });
  }
  function simulate() {
    const hits = simulateBirthdays(people, days, 1000);
    setSimulation(previous => ({ trials: previous.trials + 1000, hits: previous.hits + hits }));
  }
  return <article className="lab-card" id="birthdays">
    <Header index="04" eyebrow="Birthday lab" title="How many people make a match?" text="A match somewhere in the room and a match with one particular person are different events." />
    <div className="control-line">
      <Slider label="People in the group n" value={people} min={1} max={100} onChange={n => reset(n, days)} />
      <label className="select-field"><span>Days in the model calendar</span><select value={days} onChange={e => reset(people, Number(e.target.value))}><option value={365}>365 days</option><option value={30}>30 days</option><option value={10}>10 days</option></select></label>
      <button type="button" className="resample" onClick={() => reset(threshold, days)}>First group above 50%</button>
    </div>
    <p className="model-assumptions"><b>Model:</b> labeled people, independent birthdays, and {days} equally likely days. The 365-day version ignores leap days and seasonal variation.</p>
    <div className="birthday-results" aria-live="polite" aria-atomic="true">
      <div className="birthday-main"><p>At least one shared birthday</p><strong>{percent(probability)}</strong><div className="probability-track" role="meter" aria-label="Probability of at least one shared birthday" aria-valuemin={0} aria-valuemax={100} aria-valuenow={probability * 100} aria-valuetext={percent(probability)}><span style={{ width: `${probability * 100}%` }} /></div><span>First above 50%: {threshold} people</span></div>
      <div className="birthday-comparisons"><div><span>Someone matches one designated person</span><strong>{percent(designated)}</strong><small>{people - 1} comparisons with this person</small></div><div><span>Union bound for any match</span><strong>{percent(bound)}</strong><small>{pairCount} pairs; add their probabilities, then cap at 1</small></div></div>
    </div>
    <div className="birthday-formula"><p className="micro-label">Count the complement: all birthdays distinct</p>
      <p className="foundation-equation">{people > days ? "More people than days: a match is certain." : <>P(some match) = 1 − (d)<sub>n</sub> / d<sup>n</sup> = 1 − ∏<sub>j=0</sub><sup>n−1</sup>(1 − j/d)</>}</p>
      <p>Here (d)<sub>n</sub> = d(d − 1)⋯(d − n + 1) counts ordered selections without replacement. There are d<sup>n</sup> possible birthday lists in all. For one designated person, the answer is 1 − (1 − 1/d)<sup>n−1</sup>.</p>
    </div>
    <div className="birthday-simulation"><button type="button" className="resample" onClick={simulate}>Simulate 1,000 groups</button><p role="status">{simulation.trials === 0 ? "Predict the result, then run the experiment." : `${simulation.hits.toLocaleString("en-US")} of ${simulation.trials.toLocaleString("en-US")} groups had a match (${percent(simulation.hits / simulation.trials)}). Exact model: ${percent(probability)}.`}</p></div>
    <details className="foundation-detail"><summary>Three people: see inclusion–exclusion at work</summary>
      <p>Let E₁₂, E₁₃, E₂₃ say that the indicated pair matches. Each has probability 1/d. Any two force all three birthdays to agree, so every pairwise intersection and the triple intersection have probability 1/d².</p>
      <p className="foundation-equation">P(a match among 3) = 3/d − 3/d² + 1/d² = 3/d − 2/d²</p>
      <p>For this {days}-day calendar, that is {percent(birthdayProbability(3, days))}. Multiplying the three no-match probabilities would assume mutual independence that these events do not have.</p>
    </details>
  </article>;
}
