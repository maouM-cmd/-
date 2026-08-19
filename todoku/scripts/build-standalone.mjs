#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const benefits = readFileSync(join(root, "src/data/benefits.json"), "utf8");
const personas = readFileSync(join(root, "src/data/personas.json"), "utf8");

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>とどく | 探すな、届け。</title>
  <style>
    :root { --sand:#f4efe4; --paper:#fffaf2; --ink:#1c2a32; --teal:#0f4c5c; --stamp:#c23b22; --moss:#2f6f4e; }
    * { box-sizing: border-box; }
    body { margin:0; font-family:"Hiragino Sans","Yu Gothic",Meiryo,sans-serif; background:radial-gradient(1200px 500px at 10% -10%, #fbe8c9 0%, transparent 55%), var(--sand); color:var(--ink); }
    header, footer { background:rgba(255,250,242,.92); border-color:rgba(15,76,92,.1); }
    header { border-bottom:1px solid rgba(15,76,92,.1); }
    .bar { max-width:960px; margin:0 auto; padding:12px 16px; display:flex; justify-content:space-between; align-items:baseline; }
    .bar strong { color:var(--teal); }
    .bar span { color:rgba(15,76,92,.6); font-size:12px; }
    main { max-width:960px; margin:0 auto; padding:24px 16px 64px; }
    .hero { background:var(--teal); color:var(--paper); border-radius:24px; padding:32px; box-shadow:0 12px 30px rgba(15,76,92,.2); }
    .hero h1 { margin:4px 0 0; font-size:32px; }
    .hero p { margin:12px 0 0; line-height:1.6; color:rgba(255,250,242,.88); }
    h2 { font-size:14px; color:var(--teal); margin:28px 0 10px; }
    .grid3 { display:grid; gap:12px; }
    @media (min-width:700px) { .grid3 { grid-template-columns:repeat(3,1fr); } }
    button.persona, .card, .form, .stat { background:var(--paper); border:1px solid rgba(15,76,92,.1); border-radius:16px; }
    button.persona { text-align:left; padding:16px; cursor:pointer; }
    button.persona.active { border-color:var(--stamp); box-shadow:0 0 0 2px rgba(194,59,34,.3); background:#fff; }
    button.persona small { color:var(--stamp); display:block; }
    button.persona b { color:var(--teal); display:block; margin:4px 0; }
    .form { padding:20px; }
    .chips { display:flex; flex-wrap:wrap; gap:8px; margin:8px 0 16px; }
    .chip { border-radius:999px; border:1px solid rgba(15,76,92,.2); background:#fff; color:var(--teal); padding:6px 12px; cursor:pointer; }
    .chip.on { background:var(--teal); color:#fff; border-color:var(--teal); }
    .stat { padding:14px 16px; }
    .stat em { display:block; font-style:normal; font-size:12px; color:rgba(15,76,92,.7); }
    .stat b { color:var(--teal); font-size:20px; }
    article { background:#fff; border:1px solid rgba(15,76,92,.1); border-radius:16px; padding:20px; margin:12px 0; }
    .row { display:flex; gap:16px; }
    .score { width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; background:#fff; box-shadow:0 0 0 2px rgba(194,59,34,.2); color:var(--moss); flex-shrink:0; }
    .muted { color:rgba(28,42,50,.7); font-size:14px; line-height:1.6; }
    .meta { font-size:12px; color:var(--stamp); }
    .boxes { display:grid; gap:8px; margin:12px 0; }
    @media (min-width:700px) { .boxes { grid-template-columns:1fr 1fr; } }
    .box { background:rgba(244,239,228,.8); border-radius:12px; padding:8px 12px; font-size:14px; }
    .box span { display:block; font-size:12px; color:rgba(15,76,92,.6); }
    ul.ok { color:var(--moss); }
    ul.ng { color:rgba(194,59,34,.8); }
    a { color:var(--stamp); }
    footer { border-top:1px solid rgba(15,76,92,.1); padding:24px 16px; font-size:12px; color:rgba(15,76,92,.7); line-height:1.7; }
  </style>
</head>
<body>
  <header><div class="bar"><strong>とどく</strong> 探すな、届け。<span>都知事杯オープンデータ・ハッカソン2026</span></div></header>
  <main>
    <section class="hero">
      <div>制度は、探させるな。</div>
      <h1>とどく</h1>
      <p>世帯の状況を3問だけ聞くと、東京都の支援制度オープンデータと突合し、今届く手当・助成・相談先を順位付きで返します。</p>
    </section>
    <h2>ペルソナで見る</h2>
    <div id="personas" class="grid3"></div>
    <h2>自分の世帯で見る（3問）</h2>
    <div class="form" id="form"></div>
    <h2>届く制度</h2>
    <div id="stats" class="grid3"></div>
    <div id="list"></div>
    <h2 id="near-title" style="display:none">条件が近い参考</h2>
    <div id="near"></div>
  </main>
  <footer>
    適合判定はオープンデータを簡易ルール化した参考情報です。申請可否は各窓口の正式判定に従ってください。個人情報は送りません。<br/>
    このファイルはブラウザでそのまま開けます（インターネット不要）。
  </footer>
  <script>
    const BENEFITS = ${benefits};
    const PERSONAS = ${personas};
    const TYPE_LABEL = { single:"単身", couple:"夫婦・パートナー", single_parent:"ひとり親", other:"その他の世帯" };
    const INCOME_LABEL = { low:"家計に余裕が少ない", middle:"ふつうの家計", high:"比較的余裕がある" };
    const CAT = { childcare:"子育て", medical:"医療", housing:"住まい", eldercare:"介護", education:"学び", livelihood:"暮らし" };
    let personaId = PERSONAS[0].id;
    let household = structuredClone(PERSONAS[0].household);

    function formatYen(v){ return v>=10000 ? "約" + Math.round(v/10000).toLocaleString("ja-JP") + "万円" : "約" + v.toLocaleString("ja-JP") + "円"; }
    function formatMin(v){ return v>=60 ? "約" + Math.round(v/60) + "時間" : "約" + v + "分"; }
    function ages(h){ return h.children.map(c=>c.age+"歳").join("・"); }
    function inRange(h,min,max){ return h.children.some(c => (min==null||c.age>=min) && (max==null||c.age<=max)); }

    function matchBenefit(h, b){
      const reasons=[], gaps=[]; let hard=false, points=0, max=0; const r=b.rules||{};
      if(r.requireChildren){ max+=30; if(!h.children.length){ hard=true; gaps.push("対象となる子どもがいない"); } else { points+=30; reasons.push("お子さん（"+ages(h)+"）がいる"); } }
      if(r.childAgeMin!=null || r.childAgeMax!=null){ max+=20; const min=r.childAgeMin??0, mx=r.childAgeMax??18; if(inRange(h,r.childAgeMin,r.childAgeMax)){ points+=20; reasons.push(min+"〜"+mx+"歳の子どもが対象年齢"); } else { hard=true; gaps.push("対象年齢は"+min+"〜"+mx+"歳"); } }
      if(r.householdTypes?.length){ max+=20; if(r.householdTypes.includes(h.householdType)){ points+=20; reasons.push("世帯の形「"+TYPE_LABEL[h.householdType]+"」が条件に合う"); } else { hard=true; gaps.push("世帯の形が対象外"); } }
      if(r.incomeBands?.length){ max+=15; if(r.incomeBands.includes(h.incomeBand)){ points+=15; reasons.push(INCOME_LABEL[h.incomeBand]+"世帯向けの目安に入る"); } else if(h.incomeBand==="high" && !r.incomeBands.includes("high")){ hard=true; gaps.push("所得制限の目安を超えている可能性"); } else { points+=4; gaps.push("所得要件は区市町村の判定が必要"); } }
      if(r.requireCaregiving){ max+=25; if(h.caregiving){ points+=25; reasons.push("家族の介護・世話をしている"); } else { hard=true; gaps.push("介護している家族が条件"); } }
      if(r.requireDisability){ max+=20; if(h.disability){ points+=20; reasons.push("障害・難病などの状況が対象"); } else { hard=true; gaps.push("障害者手帳等の要件あり"); } }
      if(r.requireHousingNeed){ max+=15; if(h.housing==="looking"||h.housing==="rent"){ points+=15; reasons.push("住まいの支援が役立つ状況"); } else { hard=true; gaps.push("住宅の困りごとが条件"); } }
      if(max===0){ points=48; max=100; reasons.push("多くの都民が使える基礎的な案内"); }
      if(b.category==="childcare" && h.children.length && !r.requireChildren){ points+=8; max+=8; }
      if(b.category==="eldercare" && h.caregiving && !r.requireCaregiving){ points+=8; max+=8; }
      if(h.incomeBand==="low" && b.category==="livelihood"){ points+=6; max+=6; reasons.push("家計の負担を直接減らせる"); }
      const raw = max===0?0:Math.round(points/max*100);
      return { benefit:b, eligible:!hard, score: hard?Math.min(raw,38):Math.max(raw,42), reasons:[...new Set(reasons)], gaps:[...new Set(gaps)] };
    }

    function rank(){
      const results = BENEFITS.map(b=>matchBenefit(household,b)).sort((a,b)=>b.score-a.score);
      const eligible = results.filter(r=>r.eligible);
      const nearby = results.filter(r=>!r.eligible && r.score>=15);
      return { eligible, nearby, totals:{ count:eligible.length, time:eligible.reduce((s,r)=>s+r.benefit.timeSavedMinutes,0), yen:eligible.reduce((s,r)=>s+r.benefit.annualYenHint,0) } };
    }

    function familyOf(h){ if(h.children.length && h.caregiving) return "both"; if(h.children.length) return "children"; if(h.caregiving) return "care"; return "none"; }
    function applyFamily(choice){
      if(choice==="children") household = { ...household, caregiving:false, children: household.children.length?household.children:[{age:4}] };
      else if(choice==="care") household = { ...household, caregiving:true, children:[] };
      else if(choice==="both") household = { ...household, caregiving:true, children: household.children.length?household.children:[{age:8}] };
      else household = { ...household, caregiving:false, children:[] };
      personaId = null; render();
    }

    function card(r){
      const b=r.benefit;
      const lis = (r.eligible?r.reasons:r.gaps).map(x=>"<li>"+x+"</li>").join("");
      const steps = b.procedureSteps.map(s=>"<li>"+s+"</li>").join("");
      return '<article><div class="row"><div class="score">'+r.score+'</div><div><div class="meta">'+CAT[b.category]+' ／ '+b.agency+'</div><h3 style="margin:4px 0;color:var(--teal)">'+b.name+'</h3><p class="muted">'+b.summary+'</p></div></div><div class="boxes"><div class="box"><span>金額の目安</span>'+b.amountHint+'</div><div class="box"><span>手取り・時短</span>'+(b.annualYenHint>0?("年"+formatYen(b.annualYenHint)+" ／ "):"")+formatMin(b.timeSavedMinutes)+'</div></div><ul class="'+(r.eligible?"ok":"ng")+'">'+lis+'</ul><ol class="muted">'+steps+'</ol><p><a href="'+b.procedureUrl+'" target="_blank" rel="noreferrer">手続・公式案内を開く</a> <span class="muted">'+b.source.name+'</span></p></article>';
    }

    function render(){
      document.getElementById("personas").innerHTML = PERSONAS.map(p =>
        '<button class="persona'+(p.id===personaId?" active":"")+'" data-id="'+p.id+'"><small>'+p.title+'</small><b>'+p.name+'</b><span class="muted">'+p.blurb+'</span></button>'
      ).join("");
      document.querySelectorAll("button.persona").forEach(btn=>{
        btn.onclick = () => { const p = PERSONAS.find(x=>x.id===btn.dataset.id); personaId=p.id; household=structuredClone(p.household); render(); };
      });
      const fam = familyOf(household);
      const chip = (on, label, fn) => '<button class="chip'+(on?" on":"")+'" type="button">'+label+'</button>';
      const fams = [["children","子どもがいる"],["care","家族を介護している"],["both","両方"],["none","どちらもいない"]];
      const types = [["single_parent","ひとり親"],["couple","夫婦・パートナー"],["single","単身"],["other","その他"]];
      const incs = [["low","ぎりぎり"],["middle","ふつう"],["high","余裕あり"]];
      document.getElementById("form").innerHTML =
        '<p><b style="color:var(--teal)">1. いまの家族</b></p><div class="chips" id="f1"></div>'+
        '<p><b style="color:var(--teal)">2. 世帯の形</b></p><div class="chips" id="f2"></div>'+
        '<p><b style="color:var(--teal)">3. 家計の余裕</b></p><div class="chips" id="f3"></div>';
      document.getElementById("f1").innerHTML = fams.map(([v,l])=>'<button type="button" class="chip'+(fam===v?" on":"")+'" data-v="'+v+'">'+l+'</button>').join("");
      document.getElementById("f2").innerHTML = types.map(([v,l])=>'<button type="button" class="chip'+(household.householdType===v?" on":"")+'" data-v="'+v+'">'+l+'</button>').join("");
      document.getElementById("f3").innerHTML = incs.map(([v,l])=>'<button type="button" class="chip'+(household.incomeBand===v?" on":"")+'" data-v="'+v+'">'+l+'</button>').join("");
      document.querySelectorAll("#f1 .chip").forEach(b=>b.onclick=()=>applyFamily(b.dataset.v));
      document.querySelectorAll("#f2 .chip").forEach(b=>b.onclick=()=>{ household={...household, householdType:b.dataset.v}; personaId=null; render(); });
      document.querySelectorAll("#f3 .chip").forEach(b=>b.onclick=()=>{ household={...household, incomeBand:b.dataset.v}; personaId=null; render(); });
      const ranked = rank();
      document.getElementById("stats").innerHTML =
        '<div class="stat"><em>届きそうな制度</em><b>'+ranked.totals.count+'件</b></div>'+
        '<div class="stat"><em>探す時間の削減目安</em><b>'+formatMin(ranked.totals.time)+'</b></div>'+
        '<div class="stat"><em>手取りに効く金額目安</em><b>'+(ranked.totals.yen>0?("年"+formatYen(ranked.totals.yen)):"相談・手続中心")+'</b></div>';
      document.getElementById("list").innerHTML = ranked.eligible.map(card).join("");
      document.getElementById("near-title").style.display = ranked.nearby.length ? "block" : "none";
      document.getElementById("near").innerHTML = ranked.nearby.slice(0,4).map(card).join("");
    }
    render();
  </script>
</body>
</html>
`;

writeFileSync(join(root, "standalone.html"), html, "utf8");
console.log("wrote todoku/standalone.html", html.length);
