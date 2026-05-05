import { useState } from "react";

const questions = [
  {id:'budget',multi:false,text:'Koji je tvoj ukupni budžet?',hint:'Uključi sve — cijena + uvoz + registracija + servis',options:[
    {key:'A',label:'Do €8,000',desc:'Stariji auti 10+ god, manja oprema'},
    {key:'B',label:'€8,000 – €15,000',desc:'7-10 godina, solidna baza'},
    {key:'C',label:'€15,000 – €22,000',desc:'5-8 godina, dobra oprema'},
    {key:'D',label:'€22,000 – €30,000',desc:'3-5 godina, novije generacije'},
    {key:'E',label:'€30,000 – €45,000',desc:'1-3 godine, premium segment'},
    {key:'F',label:'€45,000 – €65,000',desc:'Skoro nova ili top oprema'},
    {key:'G',label:'Iznad €65,000',desc:'Premium / luksuz / sport'}
  ]},
  {id:'year_pref',multi:false,text:'Koliko star auto si voljan kupiti?',hint:'Određuje kompromis između godišta i opreme',options:[
    {key:'A',label:'Samo 2022 i noviji',desc:'Najnovija tehnologija, garancija'},
    {key:'B',label:'2019 ili noviji',desc:'Moderan, ali već amortizirao'},
    {key:'C',label:'2016 ili noviji',desc:'Bolji omjer cijene i opreme'},
    {key:'D',label:'2012 ili noviji',desc:'Provjereni modeli, jeftinije'},
    {key:'E',label:'Svejedno — bitan je auto',desc:'Stariji auto za isti novac = bolja oprema'}
  ]},
  {id:'body_type',multi:false,text:'Koji oblik auta tražiš?',hint:'Direktno utječe na praktičnost i osjećaj vožnje',options:[
    {key:'A',label:'SUV / crossover',desc:'Visoko, prostrano, lakši ulaz/izlaz'},
    {key:'B',label:'Karavan / estate',desc:'Maksimum prtljažnika, niži profil'},
    {key:'C',label:'Hatchback / kompakt',desc:'Agilno, lako parkiranje, urbano'},
    {key:'D',label:'Sedan / limuzina',desc:'Elegantan, tih, reprezentativan'},
    {key:'E',label:'Coupé / kabriolet',desc:'Sportski, izražajan dizajn'},
    {key:'F',label:'MPV / 7-sjedni',desc:'Maksimum putnika i prostora'}
  ]},
  {id:'priority',multi:false,text:'Što ti je prioritet broj jedan?',hint:'Najvažnija odluka u kvizu — budi iskren',options:[
    {key:'A',label:'Snaga i dinamika vožnje',desc:'KS, ubrzanje, sportski osjećaj'},
    {key:'B',label:'Udobnost i prostor',desc:'Miran ovjes, prostrana kabina'},
    {key:'C',label:'Izgled i prestiž',desc:'Badge, dizajn, dojam izvana'},
    {key:'D',label:'Pouzdanost i niski troškovi',desc:'Malo kvarova, jeftin servis'},
    {key:'E',label:'Tehnologija i oprema',desc:'Asistencije, ekrani, novi sustavi'}
  ]},
  {id:'use_case',multi:false,text:'Gdje ćeš najviše voziti?',hint:'Direktno utječe na izbor motora i pogona',options:[
    {key:'A',label:'Uglavnom grad',desc:'Kratke vožnje, parkiranje, gužve'},
    {key:'B',label:'Mješovito',desc:'Grad + povremeno autocesta'},
    {key:'C',label:'Uglavnom autocesta',desc:'Duga putovanja, posao'},
    {key:'D',label:'Brdovita područja / makadam',desc:'Treba mi 4×4 ili visoki klirens'}
  ]},
  {id:'km_year',multi:false,text:'Koliko kilometara prelaziš godišnje?',hint:'Ključno za izbor motora (dizel vs benzin)',options:[
    {key:'A',label:'Do 8,000 km',desc:'Vrlo malo, vikend vožnje'},
    {key:'B',label:'8,000 – 15,000 km',desc:'Prosječan vozač'},
    {key:'C',label:'15,000 – 25,000 km',desc:'Solidno km — dizel se isplati'},
    {key:'D',label:'25,000 – 40,000 km',desc:'Puno autoceste'},
    {key:'E',label:'Više od 40,000 km',desc:'Profesionalna upotreba'}
  ]},
  {id:'fuel',multi:false,text:'Koja vrsta motora ti odgovara?',hint:'Uvažava i ekološke zone gradova',options:[
    {key:'A',label:'Dizel',desc:'Više km, autocesta, niža potrošnja'},
    {key:'B',label:'Benzin',desc:'Manje km, grad, jeftiniji servis'},
    {key:'C',label:'Hibrid (HEV / mild)',desc:'Niža potrošnja u gradu'},
    {key:'D',label:'Plug-in hibrid (PHEV)',desc:'Električno za grad, motor za put'},
    {key:'E',label:'Električni (BEV)',desc:'Bez goriva, mreža punionica'},
    {key:'F',label:'LPG / CNG',desc:'Najjeftinija potrošnja'},
    {key:'G',label:'Svejedno',desc:'Otvoren za savjet'}
  ]},
  {id:'transmission',multi:false,text:'Automatik ili ručni mjenjač?',hint:'Mijenja iskustvo vožnje i cijenu',options:[
    {key:'A',label:'Automatik — obavezno',desc:'Komfor, manje stresa'},
    {key:'B',label:'Ručni — preferiram',desc:'Direktan osjećaj, jeftiniji'},
    {key:'C',label:'Svejedno',desc:'Oboje mi odgovara'}
  ]},
  {id:'power',multi:false,text:'Koliko snage minimalno tražiš?',hint:'Razmisli o autocesti i pretjecanju',options:[
    {key:'A',label:'Do 120 KS',desc:'Dovoljno za grad i regionalne rute'},
    {key:'B',label:'120 – 150 KS',desc:'Solidno za sve situacije'},
    {key:'C',label:'150 – 200 KS',desc:'Bezbrižno na autocesti'},
    {key:'D',label:'200 – 280 KS',desc:'Sportski, premium dinamika'},
    {key:'E',label:'Više od 280 KS',desc:'Performance, prava snaga'}
  ]},
  {id:'family',multi:false,text:'Koliko ljudi i koliko prtljage?',hint:'Stvarna upotreba, ne maksimum',options:[
    {key:'A',label:'1 – 2 osobe, malo prtljage',desc:'Vozač + povremeno suvozač'},
    {key:'B',label:'3 – 4 osobe, jedno dijete',desc:'Mlada obitelj'},
    {key:'C',label:'4 – 5 odraslih redovito',desc:'Svi trebaju komforno sjediti'},
    {key:'D',label:'5+ osoba ili 2+ djece',desc:'Velika obitelj, treba 7-sjedni'},
    {key:'E',label:'Mnogo prtljage / oprema',desc:'Boot mora biti velik'}
  ]},
  {id:'features',multi:true,text:'Koje opcije moraš imati?',hint:'Multi-select — odaberi sve što ti je važno',options:[
    {key:'A',label:'Pogon na sva 4 kotača (4×4 / AWD)',desc:'Snijeg, makadam, sigurnost'},
    {key:'B',label:'Adaptivni tempomat / asistent vožnje',desc:'Drži razmak na autocesti'},
    {key:'C',label:'Senzori parkiranja + kamera',desc:'Bitno u gradu'},
    {key:'D',label:'Grijana sjedala / volan',desc:'Komfor zimi'},
    {key:'E',label:'Velika multimedija + Apple/Android',desc:'Moderni interfejs'},
    {key:'F',label:'Panoramski krov',desc:'Atmosfera, više svjetla'},
    {key:'G',label:'Vučna kuka',desc:'Prikolica, bicikli, kamper'},
    {key:'H',label:'LED matrix / xenon svjetla',desc:'Vidljivost noću'},
    {key:'I',label:'ISOFIX + sigurnosna oprema',desc:'Djeca, max NCAP'}
  ]},
  {id:'interior',multi:true,text:'Što ti je važno u interijeru?',hint:'Multi-select',options:[
    {key:'A',label:'Premium materijali / koža',desc:'Prošivene površine, kvalitetna sjedala'},
    {key:'B',label:'Moderan dizajn i ekrani',desc:'Digitalni instrumenti, veliki displej'},
    {key:'C',label:'Tiha, izolirana kabina',desc:'Mirno na autocesti'},
    {key:'D',label:'Fizičke tipke (ne sve na ekranu)',desc:'Brzi pristup tijekom vožnje'},
    {key:'E',label:'Praktičnost — pretinci, USB',desc:'Mjesto za telefon, kabele, boce'}
  ]},
  {id:'brand',multi:true,text:'Imaš li preferenciju prema brendu?',hint:'Multi-select — budi iskren',options:[
    {key:'A',label:'Premium njemački',desc:'BMW, Audi, Mercedes, Porsche'},
    {key:'B',label:'VW grupa',desc:'VW, Škoda, Seat, Cupra'},
    {key:'C',label:'Korejski/japanski',desc:'Toyota, Mazda, Hyundai, Kia, Honda'},
    {key:'D',label:'Francuski',desc:'Peugeot, Renault, Citroën, DS'},
    {key:'E',label:'Talijanski',desc:'Fiat, Alfa Romeo, Lancia'},
    {key:'F',label:'Volvo / sjevernjački',desc:'Volvo, Polestar'},
    {key:'G',label:'Američki',desc:'Ford, Tesla, Jeep'},
    {key:'H',label:'Svejedno — samo dobar auto',desc:'Badge me ne zanima'}
  ]},
  {id:'maintenance',multi:false,text:'Kako gledaš na troškove servisa?',hint:'Premium auti = veći servisi',options:[
    {key:'A',label:'Mora biti jeftin za održavanje',desc:'Bojim se velikih servisa'},
    {key:'B',label:'Spreman sam na prosječne troškove',desc:'Realan očekujem ~€500-1000/god'},
    {key:'C',label:'Premium servis je u redu',desc:'Plaćam za kvalitetu, OE dijelovi'},
    {key:'D',label:'Nije mi bitno',desc:'Imam servisera ili sam majstor'}
  ]},
  {id:'depreciation',multi:false,text:'Koliko je važna buduća vrijednost?',hint:'Hoćeš li lako prodati za 3-5 god?',options:[
    {key:'A',label:'Vrlo važno — moram lako prodati',desc:'Tržišno traženi modeli'},
    {key:'B',label:'Bitno, ali nisam fiksiran',desc:'Razuman gubitak je OK'},
    {key:'C',label:'Manje važno — vozim dugo',desc:'Plan: kupim i držim'},
    {key:'D',label:'Nebitno',desc:'Kupujem za sebe, ne za prodaju'}
  ]}
];

const labelMap = {
  budget:{q:'Budžet',A:'Do 8k EUR',B:'8-15k EUR',C:'15-22k EUR',D:'22-30k EUR',E:'30-45k EUR',F:'45-65k EUR',G:'Iznad 65k EUR'},
  year_pref:{q:'Godište',A:'2022+',B:'2019+',C:'2016+',D:'2012+',E:'Svejedno'},
  body_type:{q:'Karoserija',A:'SUV/crossover',B:'Karavan',C:'Hatchback',D:'Sedan',E:'Coupé/kabriolet',F:'MPV/7-sjedni'},
  priority:{q:'Prioritet',A:'Snaga i dinamika',B:'Udobnost i prostor',C:'Izgled i prestiž',D:'Pouzdanost',E:'Tehnologija'},
  use_case:{q:'Upotreba',A:'Grad',B:'Mješovito',C:'Autocesta',D:'Brdovito/makadam'},
  km_year:{q:'Km godišnje',A:'Do 8k',B:'8-15k',C:'15-25k',D:'25-40k',E:'40k+'},
  fuel:{q:'Gorivo',A:'Dizel',B:'Benzin',C:'Hibrid',D:'PHEV',E:'Električni',F:'LPG/CNG',G:'Svejedno'},
  transmission:{q:'Mjenjač',A:'Automatik',B:'Ručni',C:'Svejedno'},
  power:{q:'Min snaga',A:'Do 120 KS',B:'120-150 KS',C:'150-200 KS',D:'200-280 KS',E:'280+ KS'},
  family:{q:'Putnici',A:'1-2 osobe',B:'3-4 s djetetom',C:'4-5 odraslih',D:'5+ ili 2+ djece',E:'Puno prtljage'},
  features:{q:'Obavezne opcije',A:'AWD/4×4',B:'Adaptivni tempomat',C:'Parking senzori+kamera',D:'Grijana sjedala/volan',E:'Apple/Android multimedia',F:'Panoramski krov',G:'Vučna kuka',H:'LED matrix svjetla',I:'ISOFIX/sigurnost'},
  interior:{q:'Interijer',A:'Premium koža',B:'Moderan ekran',C:'Tiha kabina',D:'Fizičke tipke',E:'Praktičnost/pretinci'},
  brand:{q:'Brand',A:'Premium njemački',B:'VW grupa',C:'Korejski/japanski',D:'Francuski',E:'Talijanski',F:'Volvo/sjevernjački',G:'Američki',H:'Svejedno'},
  maintenance:{q:'Servis tolerancija',A:'Mora biti jeftin',B:'Prosječni troškovi OK',C:'Premium servis OK',D:'Nebitno'},
  depreciation:{q:'Buduća vrijednost',A:'Vrlo važno',B:'Bitno ali fleksibilno',C:'Manje važno',D:'Nebitno'}
};

function buildSummary(answers) {
  return Object.entries(answers).map(([id, val]) => {
    const l = labelMap[id];
    if (!l) return '';
    if (Array.isArray(val)) return `${l.q}: ${val.map(k => l[k]).filter(Boolean).join(', ')}`;
    return `${l.q}: ${l[val] || val}`;
  }).filter(Boolean).join('\n');
}

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
  try { return JSON.parse(text); } catch(e) {}
  const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try { return JSON.parse(stripped); } catch(e) {}
  const candidates = [...findBalancedJSONBlocks(text), ...findBalancedJSONBlocks(stripped)]
    .sort((a, b) => b.length - a.length);
  for (const c of candidates) {
    try {
      const parsed = JSON.parse(c);
      if (parsed && typeof parsed === 'object' && (parsed.cars || parsed.profile)) return parsed;
    } catch(e) {}
  }
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

function safeStr(v, fallback = '') {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'string') return v.trim() || fallback;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    const s = Array.isArray(v) ? v.filter(x => x != null).join(', ') : JSON.stringify(v);
    return (s.slice(0, 500)).trim() || fallback;
  } catch (e) { return fallback; }
}

function normalizeResult(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Odgovor nije valjan objekt');
  }
  if (!Array.isArray(parsed.cars) || parsed.cars.length === 0) {
    throw new Error('Nema preporučenih auta u odgovoru');
  }

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
      strategy: safeStr(safe.strategy),
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

const SL = { snaga:'Snaga', udobnost:'Udobnost', vrijednost:'Vrijednost', pouzdanost:'Pouzdanost', interijer:'Interijer' };

const C = {
  bg:'#0c0c0c', ink:'#f0ede6', ink2:'#8a8680', ink3:'#3a3835',
  acc:'#e8c547', acc2:'#c4a832', surf:'#141412', surf2:'#1c1c1a', bord:'#242420',
  red:'#e85454'
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
      setAnswers(a => ({ ...a, [q.id]: next }));
    } else {
      setAnswers(a => ({ ...a, [q.id]: key }));
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
    } catch (e) {
      setError(e.message || 'Nepoznata greška');
      setStep('quiz');
    }
    setLoading(false);
  }

  function goNext() {
    if (!answered || loading) return;
    if (cur < questions.length - 1) setCur(c => c + 1);
    else submit(answers);
  }

  function goBack() {
    if (cur > 0) setCur(c => c - 1);
  }

  function restart() {
    setCur(0); setAnswers({}); setResult(null); setError(''); setStep('quiz');
  }

  const wrap  = { background: C.bg, minHeight: '100vh', padding: '28px 16px 80px', fontFamily: 'Syne, sans-serif', color: C.ink };
  const mono  = { fontFamily: 'DM Mono, monospace' };
  const serif = { fontFamily: 'Instrument Serif, serif' };

  // ── LOADING ──
  if (step === 'loading') return (
    <div style={{ ...wrap, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <style>{`@keyframes pulseGlyph { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.94)} }`}</style>
      <div style={{ fontSize:52, marginBottom:20, animation:'pulseGlyph 1.6s ease-in-out infinite' }}>🔍</div>
      <div style={{ ...serif, fontSize:24, fontStyle:'italic', marginBottom:6 }}>Analiziram…</div>
      <div style={{ ...mono, fontSize:10, color:C.ink2, letterSpacing:3 }}>// OBJEKTIVNA AI ANALIZA</div>
    </div>
  );

  // ── RESULT ──
  if (step === 'result' && result) return (
    <div style={wrap}>
      <div style={{ marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${C.bord}` }}>
        <div style={{ ...mono, fontSize:10, color:C.acc, letterSpacing:4, textTransform:'uppercase', marginBottom:8 }}>// tvoj profil</div>
        <div style={{ ...serif, fontSize:'clamp(26px,6vw,40px)', lineHeight:1.1 }}>{result.profile}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
          <div style={{ flex:1, height:3, background:C.bord, borderRadius:3, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${result.pct}%`, background:`linear-gradient(90deg,${C.acc2},${C.acc})`, borderRadius:3 }}/>
          </div>
          <div style={{ ...mono, fontSize:12, fontWeight:700, color:C.acc, whiteSpace:'nowrap' }}>{result.pct}% preciznost</div>
        </div>
      </div>

      {result.analysis && (
        <div style={{ background:C.surf, border:`1px solid ${C.bord}`, borderRadius:13, padding:18, marginBottom:16 }}>
          <div style={{ ...serif, fontSize:18, fontStyle:'italic', color:C.acc, marginBottom:10 }}>Analiza profila</div>
          <div style={{ ...mono, fontSize:12, color:C.ink2, lineHeight:1.8 }}>{result.analysis}</div>
        </div>
      )}

      <div style={{ ...mono, fontSize:10, color:C.ink3, letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>// top {result.cars.length} preporuke</div>

      {result.cars.map(car => {
        const win = car.rank === 1;
        const scores = ['snaga','udobnost','vrijednost','pouzdanost','interijer'];
        return (
          <div key={car.rank} style={{ background:win?'#181808':C.surf, border:`1px solid ${win?C.acc:C.bord}`, borderRadius:13, padding:18, marginBottom:10, position:'relative' }}>
            {win && <div style={{ position:'absolute', top:14, right:14, background:C.acc, color:'#000', fontSize:9, ...mono, letterSpacing:2, padding:'2px 7px', borderRadius:3, fontWeight:700 }}>#1</div>}
            <div style={{ ...mono, fontSize:9, color:C.ink3, letterSpacing:2, marginBottom:5 }}>{car.strategy ? `// ${car.strategy.toUpperCase()}` : (win ? '// TOP PREPORUKA' : `// #${car.rank} ALTERNATIVA`)}</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:win?C.acc:C.ink, marginBottom:3 }}>{car.name}</div>
            {(car.spec || car.price) && (
              <div style={{ ...mono, fontSize:11, color:C.ink2, marginBottom:14 }}>
                {[car.spec, car.price].filter(Boolean).join(' · ')}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
              {scores.map(k => {
                const v = car[k] || 0;
                return (
                  <div key={k}>
                    <div style={{ ...mono, fontSize:8, color:C.ink3, letterSpacing:2, textTransform:'uppercase', marginBottom:3 }}>{SL[k]}</div>
                    <div style={{ height:2, background:C.bord, borderRadius:2, overflow:'hidden', marginBottom:2 }}>
                      <div style={{ height:'100%', width:`${v}%`, background:scoreColor(v), borderRadius:2, transition:'width 1s ease' }}/>
                    </div>
                    <div style={{ ...mono, fontSize:10, color:C.ink2 }}>{v}/100</div>
                  </div>
                );
              })}
            </div>

            {(car.why || car.warn) && (
              <div style={{ ...mono, fontSize:12, color:C.ink2, lineHeight:1.7, borderTop:`1px solid ${C.bord}`, paddingTop:10 }}>
                {car.why && <><span style={{ color:C.ink, fontWeight:600 }}>Zašto: </span>{car.why}</>}
                {car.why && car.warn && <><br/><br/></>}
                {car.warn && <><span style={{ color:C.red, fontWeight:600 }}>⚠ Pazi: </span>{car.warn}</>}
              </div>
            )}

            {car.buy && (
              <div style={{ ...mono, fontSize:12, color:'#c8c4bc', lineHeight:1.7, marginTop:10, background:'rgba(232,197,71,0.06)', borderRadius:8, padding:'10px 12px', border:'1px solid rgba(232,197,71,0.15)' }}>
                <span style={{ color:C.acc, fontWeight:600 }}>🎯 Konkretno traži: </span>{car.buy}
              </div>
            )}
          </div>
        );
      })}

      {result.avoid && (
        <div style={{ background:C.surf, border:`1px solid ${C.bord}`, borderRadius:13, padding:18, marginBottom:16 }}>
          <div style={{ ...serif, fontSize:18, fontStyle:'italic', color:C.red, marginBottom:10 }}>Što izbjegavati</div>
          <div style={{ ...mono, fontSize:12, color:C.ink2, lineHeight:1.8 }}>{result.avoid}</div>
        </div>
      )}

      <button onClick={restart} style={{ background:'transparent', border:`1px solid ${C.bord}`, color:C.ink2, padding:'13px 28px', borderRadius:9, fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:600, cursor:'pointer', width:'100%', marginTop:6 }}>
        ↺ Ponovi kviz
      </button>
    </div>
  );

  // ── QUIZ ──
  const progress = ((cur + 1) / questions.length) * 100;

  return (
    <div style={wrap}>
      <div style={{ marginBottom:32 }}>
        <div style={{ ...mono, fontSize:10, color:C.acc, letterSpacing:4, textTransform:'uppercase', marginBottom:10 }}>— Auto Finder</div>
        <div style={{ ...serif, fontSize:'clamp(28px,7vw,46px)', lineHeight:1.05 }}>
          Pronađi <em style={{ fontStyle:'italic', color:C.acc }}>savršeni</em> auto
        </div>
        <div style={{ ...mono, fontSize:11, color:C.ink2, marginTop:8 }}>// {questions.length} pitanja · objektivna AI analiza</div>
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
          <span style={{ ...mono, fontSize:10, color:C.ink3, letterSpacing:2 }}>// NAPREDAK</span>
          <span style={{ ...mono, fontSize:12, fontWeight:700, color:C.acc }}>{cur+1} / {questions.length}</span>
        </div>
        <div style={{ height:2, background:C.bord, borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:C.acc, borderRadius:2, transition:'width 0.4s ease' }}/>
        </div>
      </div>

      <div style={{ ...mono, fontSize:10, color:C.ink3, letterSpacing:3, marginBottom:8 }}>// PITANJE {String(cur+1).padStart(2,'0')}</div>
      <div style={{ ...serif, fontSize:'clamp(18px,4.5vw,24px)', lineHeight:1.3, marginBottom:6 }}>{q.text}</div>
      <div style={{ ...mono, fontSize:11, color:C.ink2, marginBottom:16, lineHeight:1.5 }}>{q.hint}</div>
      {q.multi && <div style={{ ...mono, fontSize:10, color:C.acc, marginBottom:12, letterSpacing:1 }}>// Možeš odabrati više odgovora</div>}

      <div style={{ marginBottom:8 }}>
        {q.options.map(opt => {
          const selected = isSelected(opt.key);
          return (
            <div
              key={opt.key}
              onClick={() => pick(opt.key)}
              style={{
                background: selected ? C.surf2 : C.surf,
                border: `1px solid ${selected ? C.acc : C.bord}`,
                borderRadius:11, padding:'13px 15px', cursor:'pointer',
                display:'flex', alignItems:'center', gap:12, marginBottom:8,
                transform: selected ? 'translateX(3px)' : 'none', transition:'all 0.15s'
              }}
            >
              <div style={{
                width:26, height:26, borderRadius:5,
                border:`1px solid ${selected ? C.acc : C.bord}`,
                background: selected ? C.acc : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                ...mono, fontSize:10, color: selected ? '#000' : C.ink2,
                flexShrink:0, fontWeight: selected ? 700 : 400
              }}>{opt.key}</div>
              <div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:600, color:C.ink, lineHeight:1.3 }}>{opt.label}</div>
                {opt.desc && <div style={{ ...mono, fontSize:10.5, color:C.ink2, marginTop:2 }}>{opt.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div style={{ background:'rgba(232,84,84,0.07)', border:'1px solid rgba(232,84,84,0.25)', borderRadius:10, padding:'13px 15px', marginBottom:12 }}>
          <div style={{ ...mono, fontSize:12, color:C.red, marginBottom:8 }}>⚠ {error}</div>
          <button onClick={() => submit(answers)} style={{ background:C.acc, border:'none', color:'#000', padding:'8px 20px', borderRadius:7, fontFamily:'Syne,sans-serif', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            Pokušaj ponovo
          </button>
        </div>
      )}

      <div style={{ display:'flex', gap:10, marginTop:16 }}>
        {cur > 0 && (
          <button onClick={goBack} style={{ background:'transparent', border:`1px solid ${C.bord}`, color:C.ink2, padding:'11px 18px', borderRadius:9, fontFamily:'Syne,sans-serif', fontSize:13, cursor:'pointer' }}>
            ← Nazad
          </button>
        )}
        <button
          onClick={goNext}
          disabled={!answered || loading}
          style={{
            background: answered ? C.acc : '#1a1a1a',
            border:'none', color: answered ? '#000' : '#333',
            padding:'13px 28px', borderRadius:9,
            fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700,
            cursor: answered ? 'pointer' : 'not-allowed', flex:1,
            transition:'all 0.15s'
          }}
        >
          {cur === questions.length - 1 ? 'Analiziraj →' : 'Dalje →'}
        </button>
      </div>
    </div>
  );
}
