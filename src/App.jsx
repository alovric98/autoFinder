import { useState } from "react";

const questions = [
  {id:'current_car',multi:false,text:'Koji auto trenutno voziš?',hint:'Pomaže izmjeriti konkretan upgrade',options:[
    {key:'A',label:'Kompakt hatchback',desc:'Golf, Focus, 308, Leon…'},
    {key:'B',label:'Karavan / kombi',desc:'Passat, Octavia, Megane SW…'},
    {key:'C',label:'SUV / crossover',desc:'Tiguan, Qashqai, Tucson…'},
    {key:'D',label:'Sedan ili stariji auto',desc:'Limuzina, auto 10+ godina'}
  ]},
  {id:'budget',multi:false,text:'Koji je tvoj ukupni budžet?',hint:'Uključi sve — cijena + uvoz + registracija',options:[
    {key:'A',label:'Do €15,000',desc:'Starija ili manje opremljena vozila'},
    {key:'B',label:'€15,000 – €22,000',desc:'Srednje godište, solidna oprema'},
    {key:'C',label:'€22,000 – €30,000',desc:'Novije godište, premium segment'},
    {key:'D',label:'Iznad €30,000',desc:'Gotovo nova ili luksuzna vozila'}
  ]},
  {id:'body_type',multi:false,text:'Koji oblik auta tražiš?',hint:'Direktno utječe na praktičnost i vožnju',options:[
    {key:'A',label:'SUV / crossover',desc:'Visoko, prostrano, lakši ulaz/izlaz'},
    {key:'B',label:'Karavan',desc:'Maksimum prtljažnika, nizak centar težišta'},
    {key:'C',label:'Hatchback / kompakt',desc:'Agilno, lako parkiranje, urbano'},
    {key:'D',label:'Sedan / limuzina',desc:'Elegantan, tih, reprezentativan'}
  ]},
  {id:'priority',multi:false,text:'Što ti je prioritet broj jedan?',hint:'Odaberi JEDNU stvar — budi što iskreniji',options:[
    {key:'A',label:'Snaga i dinamika vožnje',desc:'KS, ubrzanje, sportski osjećaj'},
    {key:'B',label:'Udobnost i prostor',desc:'Miran ovjes, prostrana kabina, boot'},
    {key:'C',label:'Izgled i prestiž',desc:'Badge, dizajn, dojam izvana'},
    {key:'D',label:'Pouzdanost i ekonomičnost',desc:'Nizak servis, malo kvarova'}
  ]},
  {id:'power',multi:false,text:'Koliko snage minimalno tražiš?',hint:'Razmisli o autocesti i pretjecanju',options:[
    {key:'A',label:'Do 130 KS',desc:'Dovoljna za grad i regionalne rute'},
    {key:'B',label:'130 – 160 KS',desc:'Solidna za sve situacije'},
    {key:'C',label:'160 – 200 KS',desc:'Osjetan upgrade, autocesta bez napora'},
    {key:'D',label:'Više od 200 KS',desc:'Prava snaga, premium dinamika'}
  ]},
  {id:'fuel',multi:false,text:'Koja vrsta motora ti odgovara?',hint:'Ovisi o km godišnje i tipu vožnje',options:[
    {key:'A',label:'Dizel',desc:'Više km, autocesta, manja potrošnja'},
    {key:'B',label:'Benzin',desc:'Manje km, grad, jeftiniji servis'},
    {key:'C',label:'Hibrid ili mild hybrid',desc:'Manja potrošnja u gradu'},
    {key:'D',label:'Svejedno',desc:'Nije mi bitna vrsta goriva'}
  ]},
  {id:'transmission',multi:false,text:'Automatik ili ručni?',hint:'Na što si navikao?',options:[
    {key:'A',label:'Automatik — obavezno',desc:'Udobnost, bez napora'},
    {key:'B',label:'Ručni je okej',desc:'Direktan kontakt s autom'},
    {key:'C',label:'Svejedno',desc:'Oboje mi odgovara'}
  ]},
  {id:'depreciation',multi:false,text:'Kako gledaš na deprecijaciju?',hint:'Koliko je auto već pao od nove cijene',options:[
    {key:'A',label:'Kritično važna — min. 40% pada',desc:'Ne kupujem što nije amortiziralo'},
    {key:'B',label:'Važna ali nisam rigidan',desc:'Gledam, ali nije jedini faktor'},
    {key:'C',label:'Malo me zanima',desc:'Bitniji su mi drugi faktori'},
    {key:'D',label:'Ne zanima me',desc:'Gledam samo auto'}
  ]},
  {id:'interior',multi:true,text:'Što ti je najvažnije u interijeru?',hint:'Možeš odabrati više odgovora',options:[
    {key:'A',label:'Premium materijali i koža',desc:'Prošivene površine, fizičke tipke'},
    {key:'B',label:'Moderan ekran i tehnologija',desc:'Veliki displej, digitalni instrumenti'},
    {key:'C',label:'Prostornost i praktičnost',desc:'Mjesta, ISOFIX, punjači'},
    {key:'D',label:'Tiha i mirna kabina',desc:'Zvučna izolacija, udobna sjedala'}
  ]},
  {id:'family',multi:false,text:'Za koliko putnika je auto?',hint:'Direktno utječe na preporuku veličine',options:[
    {key:'A',label:'1 – 2 osobe',desc:'Uglavnom vozač, rijetko putnici'},
    {key:'B',label:'3 – 4, jedno dijete',desc:'Obitelj, dječja sjedala'},
    {key:'C',label:'4 – 5 odraslih redovito',desc:'Svi trebaju komforno sjediti'},
    {key:'D',label:'Puno prtljage je bitno',desc:'Boot kapacitet je kritičan'}
  ]},
  {id:'brand',multi:true,text:'Imaš li preferenciju prema brendu?',hint:'Možeš odabrati više — budi iskren',options:[
    {key:'A',label:'Premium njemački (BMW/Audi/Mercedes)',desc:'Prestiž i osjećaj vožnje su važni'},
    {key:'B',label:'VW grupa (VW/Skoda/Seat)',desc:'Solidno, pouzdano, dobra mreža'},
    {key:'C',label:'Korejci/Japanci (Hyundai/Kia/Mazda)',desc:'Vrijednost za novac'},
    {key:'D',label:'Svejedno — samo dobar auto',desc:'Badge me ne zanima'}
  ]},
  {id:'km_year',multi:false,text:'Koliko kilometara godišnje?',hint:'Ključno za preporuku tipa motora',options:[
    {key:'A',label:'Do 10,000 km',desc:'Gradska vožnja, povremeno'},
    {key:'B',label:'10,000 – 20,000 km',desc:'Prosječan vozač'},
    {key:'C',label:'20,000 – 35,000 km',desc:'Puno autoceste i putovanja'},
    {key:'D',label:'Više od 35,000 km',desc:'Dizel je gotovo obavezan'}
  ]}
];

const labelMap = {
  current_car:{q:'Trenutni auto',A:'Kompakt hatchback',B:'Karavan/kombi',C:'SUV/crossover',D:'Sedan/stariji'},
  budget:{q:'Budžet',A:'Do 15k EUR',B:'15-22k EUR',C:'22-30k EUR',D:'Iznad 30k EUR'},
  body_type:{q:'Karoserija',A:'SUV/crossover',B:'Karavan',C:'Hatchback',D:'Sedan'},
  priority:{q:'Prioritet',A:'Snaga i dinamika',B:'Udobnost i prostor',C:'Izgled i prestiž',D:'Pouzdanost'},
  power:{q:'Min snaga',A:'Do 130 KS',B:'130-160 KS',C:'160-200 KS',D:'200+ KS'},
  fuel:{q:'Gorivo',A:'Dizel',B:'Benzin',C:'Hibrid',D:'Svejedno'},
  transmission:{q:'Mjenjac',A:'Automatik',B:'Rucni',C:'Svejedno'},
  depreciation:{q:'Deprecijacija',A:'Kriticna 40%+',B:'Vazna fleksibilno',C:'Malo vazna',D:'Nije vazna'},
  interior:{q:'Interijer',A:'Premium koza',B:'Moderan ekran',C:'Prostornost',D:'Tiha kabina'},
  family:{q:'Putnici',A:'1-2',B:'3-4 s djetetom',C:'4-5 odraslih',D:'Puno prtljage'},
  brand:{q:'Brand',A:'Premium njemacki',B:'VW grupa',C:'Korejci/Japanci',D:'Svejedno'},
  km_year:{q:'Km godisnje',A:'Do 10k',B:'10-20k',C:'20-35k',D:'35k+'}
};

function buildSummary(answers) {
  return Object.entries(answers).map(([id, val]) => {
    const l = labelMap[id];
    if (!l) return '';
    if (Array.isArray(val)) return `${l.q}: ${val.map(k => l[k]).filter(Boolean).join(', ')}`;
    return `${l.q}: ${l[val] || val}`;
  }).filter(Boolean).join('\n');
}

// Find every balanced {...} block in `text`, respecting string literals.
// Used as a fallback when the model wraps JSON in preamble/markdown.
function findBalancedJSONBlocks(text) {
  const results = [];
  const len = text.length;
  let i = 0;
  while (i < len) {
    if (text[i] === '{') {
      let depth = 0, inStr = false, escaped = false, j = i;
      while (j < len) {
        const ch = text[j];
        if (escaped) { escaped = false; j++; continue; }
        if (inStr) {
          if (ch === '\\') escaped = true;
          else if (ch === '"') inStr = false;
          j++; continue;
        }
        if (ch === '"') inStr = true;
        else if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) { results.push(text.slice(i, j + 1)); break; }
        }
        j++;
      }
      i = (j > i) ? j + 1 : i + 1;
    } else {
      i++;
    }
  }
  return results;
}

function extractJSON(text) {
  // 1) Direct parse
  try { return JSON.parse(text); } catch(e) {}

  // 2) Strip triple-backtick code fences
  const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try { return JSON.parse(stripped); } catch(e) {}

  // 3) Find every balanced JSON block, prefer the one matching our shape,
  //    largest first (handles preamble like "Evo preporuke {za tebe}:" before the real JSON)
  const candidates = [...findBalancedJSONBlocks(text), ...findBalancedJSONBlocks(stripped)]
    .sort((a, b) => b.length - a.length);

  for (const c of candidates) {
    try {
      const parsed = JSON.parse(c);
      if (parsed && typeof parsed === 'object' && (parsed.cars || parsed.profile)) return parsed;
    } catch(e) {}
  }
  // Last resort: any parseable block
  for (const c of candidates) {
    try { return JSON.parse(c); } catch(e) {}
  }

  throw new Error('Cannot parse response');
}

function clampScore(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Coerce ANY value (number, array, object, null, undefined) to a trimmed string.
// Prevents crashes if the model returns wrong types for text fields.
function safeStr(v, fallback = '') {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'string') return v.trim() || fallback;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  // Arrays/objects: stringify but cap length so a giant blob doesn't blow up the UI
  try {
    const s = Array.isArray(v) ? v.filter(x => x != null).join(', ') : JSON.stringify(v);
    return (s.slice(0, 500)).trim() || fallback;
  } catch (e) {
    return fallback;
  }
}

// FIX: validate + normalize so renders never crash on malformed/partial data
function normalizeResult(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Odgovor nije valjan objekt');
  }
  if (!Array.isArray(parsed.cars) || parsed.cars.length === 0) {
    throw new Error('Nema preporučenih auta u odgovoru');
  }

  // Note: Number(null) === 0 and Number('') === 0, both are finite — would silently
  // bypass the fallback. Only treat actual numbers and numeric strings as valid.
  let pct;
  if (typeof parsed.pct === 'number' && Number.isFinite(parsed.pct)) {
    pct = parsed.pct;
  } else if (typeof parsed.pct === 'string' && parsed.pct.trim() !== '' && Number.isFinite(Number(parsed.pct))) {
    pct = Number(parsed.pct);
  } else {
    pct = 75;
  }
  pct = Math.max(0, Math.min(100, Math.round(pct)));

  const cars = parsed.cars.slice(0, 3).map((c, i) => {
    const safe = c && typeof c === 'object' ? c : {};
    return {
      rank: Number(safe.rank) || i + 1,
      name: safeStr(safe.name, 'Nepoznat model'),
      spec: safeStr(safe.spec),
      price: safeStr(safe.price),
      snaga: clampScore(safe.snaga),
      udobnost: clampScore(safe.udobnost),
      vrijednost: clampScore(safe.vrijednost),
      pouzdanost: clampScore(safe.pouzdanost),
      interijer: clampScore(safe.interijer),
      why: safeStr(safe.why),
      buy: safeStr(safe.buy),
      warn: safeStr(safe.warn)
    };
  });

  // Drop completely empty entries (model returned blank template literally)
  const validCars = cars.filter(c => c.name !== 'Nepoznat model' || c.why || c.buy);
  if (validCars.length === 0) {
    throw new Error('Model je vratio prazne preporuke — pokušaj ponovo');
  }

  return {
    profile: safeStr(parsed.profile, 'Kupac'),
    pct,
    analysis: safeStr(parsed.analysis),
    cars: validCars,
    avoid: safeStr(parsed.avoid)
  };
}

function scoreColor(s) {
  if (s >= 78) return '#54c97a';
  if (s >= 55) return '#e8c547';
  return '#e85454';
}

const SL = {snaga:'Snaga',udobnost:'Udobnost',vrijednost:'Vrijednost',pouzdanost:'Pouzdanost',interijer:'Interijer'};

const C = {
  bg:'#0c0c0c', ink:'#f0ede6', ink2:'#8a8680', ink3:'#3a3835',
  acc:'#e8c547', acc2:'#c4a832', surf:'#141412', surf2:'#1c1c1a', bord:'#242420',
  red:'#e85454', green:'#54c97a'
};

export default function App() {
  const [step, setStep] = useState('quiz');
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const q = questions[cur];
  const sel = answers[q.id] ?? (q.multi ? [] : '');
  const answered = q.multi ? (Array.isArray(sel) && sel.length > 0) : sel !== '';

  function pick(key) {
    if (q.multi) {
      const cur2 = Array.isArray(answers[q.id]) ? answers[q.id] : [];
      const next = cur2.includes(key) ? cur2.filter(k => k !== key) : [...cur2, key];
      setAnswers(a => ({...a, [q.id]: next}));
    } else {
      setAnswers(a => ({...a, [q.id]: key}));
    }
  }

  function isSelected(key) {
    return q.multi ? (Array.isArray(sel) && sel.includes(key)) : sel === key;
  }

  async function submit(ans) {
    const summary = buildSummary(ans);
    setError('');
    setLoading(true);
    setStep('loading');

    try {
      const resp = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary })
      });

      if (!resp.ok) {
        let msg = `Server greška ${resp.status}`;
        try { const d = await resp.json(); if (d.error) msg = d.error; } catch {}
        throw new Error(msg);
      }

      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      const text = data.text;
      if (!text) throw new Error('Prazan odgovor od servera');

      const parsed = extractJSON(text);
      const normalized = normalizeResult(parsed);

      setResult(normalized);
      setStep('result');
    } catch(e) {
      setError(e.message || 'Nepoznata greška');
      setStep('quiz');
    }
    setLoading(false);
  }

  function goNext() {
    if (!answered || loading) return;
    if (cur < questions.length - 1) {
      setCur(c => c + 1);
    } else {
      submit(answers);
    }
  }

  function goBack() {
    if (cur > 0) setCur(c => c - 1);
  }

  function restart() {
    setCur(0); setAnswers({}); setResult(null); setError(''); setStep('quiz');
  }

  // ---- STYLES ----
  const wrap = { background: C.bg, minHeight: '100vh', padding: '28px 16px 80px', fontFamily: 'Syne, sans-serif', color: C.ink };
  const mono = { fontFamily: 'DM Mono, monospace' };
  const serif = { fontFamily: 'Instrument Serif, serif' };

  // ---- LOADING ----
  if (step === 'loading') return (
    <div style={{...wrap, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh'}}>
      <style>{`@keyframes pulseGlyph { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.55; transform: scale(0.94); } }`}</style>
      <div style={{fontSize:52, marginBottom:20, animation:'pulseGlyph 1.6s ease-in-out infinite'}}>🔍</div>
      <div style={{...serif, fontSize:24, fontStyle:'italic', marginBottom:6}}>Analiziram…</div>
      <div style={{...mono, fontSize:10, color:C.ink2, letterSpacing:3}}>// OBJEKTIVNA AI ANALIZA</div>
    </div>
  );

  // ---- RESULT ----
  if (step === 'result' && result) return (
    <div style={wrap}>

      {/* Header */}
      <div style={{marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${C.bord}`}}>
        <div style={{...mono, fontSize:10, color:C.acc, letterSpacing:4, textTransform:'uppercase', marginBottom:8}}>// tvoj profil</div>
        <div style={{...serif, fontSize:'clamp(26px,6vw,40px)', lineHeight:1.1}}>{result.profile}</div>
        <div style={{display:'flex', alignItems:'center', gap:10, marginTop:10}}>
          <div style={{flex:1, height:3, background:C.bord, borderRadius:3, overflow:'hidden'}}>
            <div style={{height:'100%', width:`${result.pct}%`, background:`linear-gradient(90deg,${C.acc2},${C.acc})`, borderRadius:3}}/>
          </div>
          <div style={{...mono, fontSize:12, fontWeight:700, color:C.acc, whiteSpace:'nowrap'}}>{result.pct}% preciznost</div>
        </div>
      </div>

      {/* Analysis */}
      {result.analysis && (
        <div style={{background:C.surf, border:`1px solid ${C.bord}`, borderRadius:13, padding:18, marginBottom:16}}>
          <div style={{...serif, fontSize:18, fontStyle:'italic', color:C.acc, marginBottom:10}}>Analiza profila</div>
          <div style={{...mono, fontSize:12, color:C.ink2, lineHeight:1.8}}>{result.analysis}</div>
        </div>
      )}

      {/* Cars */}
      <div style={{...mono, fontSize:10, color:C.ink3, letterSpacing:3, textTransform:'uppercase', marginBottom:12}}>// top {result.cars.length} preporuke</div>

      {result.cars.map(car => {
        const win = car.rank === 1;
        const scores = ['snaga','udobnost','vrijednost','pouzdanost','interijer'];
        return (
          <div key={car.rank} style={{background: win?'#181808':C.surf, border:`1px solid ${win?C.acc:C.bord}`, borderRadius:13, padding:18, marginBottom:10, position:'relative'}}>
            {win && <div style={{position:'absolute', top:14, right:14, background:C.acc, color:'#000', fontSize:9, ...mono, letterSpacing:2, padding:'2px 7px', borderRadius:3, fontWeight:700}}>#1</div>}
            <div style={{...mono, fontSize:9, color:C.ink3, letterSpacing:2, marginBottom:5}}>{win?'// TOP PREPORUKA':`// #${car.rank} ALTERNATIVA`}</div>
            <div style={{fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color: win?C.acc:C.ink, marginBottom:3}}>{car.name}</div>
            {(car.spec || car.price) && (
              <div style={{...mono, fontSize:11, color:C.ink2, marginBottom:14}}>
                {[car.spec, car.price].filter(Boolean).join(' · ')}
              </div>
            )}

            {/* Score bars */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14}}>
              {scores.map(k => {
                const v = car[k] || 0;
                return (
                  <div key={k}>
                    <div style={{...mono, fontSize:8, color:C.ink3, letterSpacing:2, textTransform:'uppercase', marginBottom:3}}>{SL[k]}</div>
                    <div style={{height:2, background:C.bord, borderRadius:2, overflow:'hidden', marginBottom:2}}>
                      <div style={{height:'100%', width:`${v}%`, background:scoreColor(v), borderRadius:2, transition:'width 1s ease'}}/>
                    </div>
                    <div style={{...mono, fontSize:10, color:C.ink2}}>{v}/100</div>
                  </div>
                );
              })}
            </div>

            {/* Verdict */}
            {(car.why || car.warn) && (
              <div style={{...mono, fontSize:12, color:C.ink2, lineHeight:1.7, borderTop:`1px solid ${C.bord}`, paddingTop:10}}>
                {car.why && <><span style={{color:C.ink, fontWeight:600}}>Zašto: </span>{car.why}</>}
                {car.why && car.warn && <><br/><br/></>}
                {car.warn && <><span style={{color:C.red, fontWeight:600}}>⚠ Pazi: </span>{car.warn}</>}
              </div>
            )}

            {/* Specific buy guide — FIX: removed duplicate marginTop, removed redundant borderTop */}
            {car.buy && (
              <div style={{...mono, fontSize:12, color:'#c8c4bc', lineHeight:1.7, marginTop:10, background:'rgba(232,197,71,0.06)', borderRadius:8, padding:'10px 12px', border:'1px solid rgba(232,197,71,0.15)'}}>
                <span style={{color:C.acc, fontWeight:600}}>🎯 Konkretno traži: </span>{car.buy}
              </div>
            )}
          </div>
        );
      })}

      {/* Avoid */}
      {result.avoid && (
        <div style={{background:C.surf, border:`1px solid ${C.bord}`, borderRadius:13, padding:18, marginBottom:16}}>
          <div style={{...serif, fontSize:18, fontStyle:'italic', color:C.red, marginBottom:10}}>Što izbjegavati</div>
          <div style={{...mono, fontSize:12, color:C.ink2, lineHeight:1.8}}>{result.avoid}</div>
        </div>
      )}

      <button onClick={restart} style={{background:'transparent', border:`1px solid ${C.bord}`, color:C.ink2, padding:'13px 28px', borderRadius:9, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer', width:'100%', marginTop:6}}>
        ↺ Ponovi kviz
      </button>
    </div>
  );

  // ---- QUIZ ----
  const pct = ((cur + 1) / questions.length) * 100;

  return (
    <div style={wrap}>

      {/* Header */}
      <div style={{marginBottom:32}}>
        <div style={{...mono, fontSize:10, color:C.acc, letterSpacing:4, textTransform:'uppercase', marginBottom:10}}>— Auto Finder</div>
        <div style={{...serif, fontSize:'clamp(28px,7vw,46px)', lineHeight:1.05}}>
          Pronađi <em style={{fontStyle:'italic', color:C.acc}}>savršeni</em> auto
        </div>
        <div style={{...mono, fontSize:11, color:C.ink2, marginTop:8}}>// 12 pitanja · objektivna AI analiza</div>
      </div>

      {/* Progress */}
      <div style={{marginBottom:24}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:7}}>
          <span style={{...mono, fontSize:10, color:C.ink3, letterSpacing:2}}>// NAPREDAK</span>
          <span style={{...mono, fontSize:12, fontWeight:700, color:C.acc}}>{cur+1} / {questions.length}</span>
        </div>
        <div style={{height:2, background:C.bord, borderRadius:2, overflow:'hidden'}}>
          <div style={{height:'100%', width:`${pct}%`, background:C.acc, borderRadius:2, transition:'width 0.4s ease'}}/>
        </div>
      </div>

      {/* Question */}
      <div style={{...mono, fontSize:10, color:C.ink3, letterSpacing:3, marginBottom:8}}>// PITANJE {String(cur+1).padStart(2,'0')}</div>
      <div style={{...serif, fontSize:'clamp(18px,4.5vw,24px)', lineHeight:1.3, marginBottom:6}}>{q.text}</div>
      <div style={{...mono, fontSize:11, color:C.ink2, marginBottom:16, lineHeight:1.5}}>{q.hint}</div>
      {q.multi && <div style={{...mono, fontSize:10, color:C.acc, marginBottom:12, letterSpacing:1}}>// Možeš odabrati više odgovora</div>}

      {/* Options */}
      <div style={{marginBottom:8}}>
        {q.options.map(opt => {
          const selected = isSelected(opt.key);
          return (
            <div
              key={opt.key}
              onClick={() => pick(opt.key)}
              style={{
                background: selected ? C.surf2 : C.surf,
                border: `1px solid ${selected ? C.acc : C.bord}`,
                borderRadius: 11, padding: '13px 15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
                transform: selected ? 'translateX(3px)' : 'none', transition: 'all 0.15s'
              }}
            >
              <div style={{
                width:26, height:26, borderRadius:5,
                border:`1px solid ${selected ? C.acc : C.bord}`,
                background: selected ? C.acc : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                ...mono, fontSize:10, color: selected?'#000':C.ink2,
                flexShrink:0, fontWeight: selected?700:400
              }}>{opt.key}</div>
              <div>
                <div style={{fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:600, color:C.ink, lineHeight:1.3}}>{opt.label}</div>
                {opt.desc && <div style={{...mono, fontSize:10.5, color:C.ink2, marginTop:2}}>{opt.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div style={{background:'rgba(232,84,84,0.07)', border:'1px solid rgba(232,84,84,0.25)', borderRadius:10, padding:'13px 15px', marginBottom:12}}>
          <div style={{...mono, fontSize:12, color:C.red, marginBottom:8}}>⚠ {error}</div>
          <button onClick={() => submit(answers)} style={{background:C.acc, border:'none', color:'#000', padding:'8px 20px', borderRadius:7, fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer'}}>
            Pokušaj ponovo
          </button>
        </div>
      )}

      {/* Nav */}
      <div style={{display:'flex', gap:10, marginTop:16}}>
        {cur > 0 && (
          <button onClick={goBack} style={{background:'transparent', border:`1px solid ${C.bord}`, color:C.ink2, padding:'11px 18px', borderRadius:9, fontFamily:'Syne,sans-serif', fontSize:13, cursor:'pointer'}}>
            ← Nazad
          </button>
        )}
        <button
          onClick={goNext}
          disabled={!answered || loading}
          style={{
            background: answered ? C.acc : '#1a1a1a',
            border: 'none', color: answered ? '#000' : '#333',
            padding: '13px 28px', borderRadius: 9,
            fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700,
            cursor: answered ? 'pointer' : 'not-allowed', flex: 1,
            transition: 'all 0.15s'
          }}
        >
          {cur === questions.length - 1 ? 'Analiziraj →' : 'Dalje →'}
        </button>
      </div>
    </div>
  );
}
