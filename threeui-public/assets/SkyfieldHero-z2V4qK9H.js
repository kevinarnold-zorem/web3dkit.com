import{s as w,u as E,r as n,p as d,j as p,S as k,P as T}from"./index-ChUl42DD.js";const S=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Skyfield — Terrane</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#0B1B2E;
  --ink-2:#08131F;
  --paper:#F5F4F2;
  --lime:#C6F19D;
  --lime-hot:#A8E063;
  --pad: clamp(18px, 2.2vw, 34px);
  --mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --sans: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{background:var(--ink)}
body{
  background:var(--ink); color:var(--paper);
  font-family:var(--sans);
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
  overscroll-behavior-y:none;
}
#spacer{width:1px;pointer-events:none}
canvas#gl{position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:0}
/* The type carries no shadow, so the ground under it is darkened instead:
   a corner wash where the headline sits, plus top and bottom bands. */
#scrim{position:fixed;inset:0;z-index:1;pointer-events:none;
  background:
    radial-gradient(128% 96% at -4% 2%, rgba(8,24,44,.60) 0%, rgba(8,24,44,.34) 32%, rgba(8,24,44,.08) 58%, rgba(8,24,44,0) 74%),
    linear-gradient(180deg, rgba(8,24,44,.46) 0%, rgba(8,24,44,.20) 22%, rgba(8,24,44,0) 48%),
    linear-gradient(0deg,   rgba(8,24,44,.60) 0%, rgba(8,24,44,.26) 15%, rgba(8,24,44,0) 38%);
  transition:opacity .6s ease}
#ui{position:fixed;inset:0;z-index:2;pointer-events:none;overflow:hidden}
#ui a,#ui button{pointer-events:auto}

/* ---------- top bar ---------- */
header{
  position:absolute;top:0;left:0;right:0;
  display:flex;align-items:center;gap:24px;
  padding:calc(var(--pad) * .82) var(--pad);
  z-index:6;
}
.mark{display:flex;align-items:center;gap:9px;font-size:17px;font-weight:500;letter-spacing:-.02em}
.mark svg{display:block}
nav{display:flex;gap:26px;margin-inline:auto}
nav span{
  font-family:var(--mono);font-size:11.5px;letter-spacing:.07em;text-transform:uppercase;
  opacity:.86;display:flex;align-items:center;gap:5px;white-space:nowrap;
}
nav span i{font-style:normal;opacity:.55;font-size:9px;transform:translateY(1px)}
.topcta{
  font-family:var(--mono);font-size:11.5px;letter-spacing:.07em;text-transform:uppercase;
  display:flex;align-items:center;gap:9px;color:var(--paper);text-decoration:none;white-space:nowrap;
}
.mode{
  position:relative;flex:none;width:56px;height:28px;border-radius:999px;
  border:1px solid rgba(245,244,242,.34);background:rgba(8,24,44,.24);
  display:flex;align-items:center;justify-content:space-between;padding:0 7px;
  cursor:pointer;backdrop-filter:blur(4px);
  transition:border-color .35s ease, background .35s ease;
}
.mode:hover{border-color:var(--lime)}
.mode:focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.mode .knob{
  position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;
  background:var(--lime);
  transition:transform .55s cubic-bezier(.68,0,.18,1);
}
body.night .mode .knob{transform:translateX(28px)}
.mode .ic{width:11px;height:11px;position:relative;z-index:1;display:block;
  color:rgba(245,244,242,.62);transition:color .4s ease}
.mode .sun{color:var(--ink)}
body.night .mode .sun{color:rgba(245,244,242,.62)}
body.night .mode .moon{color:var(--ink)}
body.night #scrim{opacity:.32}
.chevbox{
  font-style:normal;width:19px;height:19px;border-radius:3px;background:var(--lime);color:var(--ink);
  display:grid;place-items:center;font-size:9px;line-height:1;
}

/* ---------- hero ---------- */
#hero{position:absolute;inset:0;padding:var(--pad);z-index:4}
#herocopy{position:absolute;left:var(--pad);top:clamp(84px,15.5vh,150px);max-width:min(66vw,900px)}
h1{
  font-size:clamp(30px,5.05vw,74px);
  font-weight:500;line-height:.95;letter-spacing:-.05em;
  color:var(--paper);white-space:nowrap;
}
h1 .ln{display:block;overflow:hidden;padding-bottom:.09em;margin-bottom:-.09em}
h1 .ln b{display:block;font-weight:500;transform:translateY(105%);will-change:transform}
.pill{
  margin-top:clamp(20px,3.2vh,34px);
  display:inline-flex;align-items:center;gap:11px;
  padding:10px 12px 10px 16px;border:1px solid rgba(245,244,242,.34);border-radius:6px;
  font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--paper);text-decoration:none;backdrop-filter:blur(3px);
  transition:border-color .35s, background .35s;
}
.pill:hover{border-color:var(--lime);background:rgba(198,241,157,.08)}
.lede{
  position:absolute;left:var(--pad);bottom:calc(var(--pad) + 6px);
  max-width:min(46ch,42vw);font-size:clamp(13px,1.06vw,15.5px);line-height:1.42;
  color:rgba(245,244,242,.94);text-shadow:0 1px 12px rgba(6,20,38,.7);
}
.scrollhint{
  position:absolute;right:var(--pad);bottom:calc(var(--pad) + 6px);
  font-size:13.5px;letter-spacing:-.02em;color:rgba(245,244,242,.92);
  text-shadow:0 1px 12px rgba(6,20,38,.7);
  display:flex;align-items:center;gap:9px;
}
.scrollhint .dot{width:5px;height:5px;border-radius:50%;background:var(--lime);animation:bob 1.9s ease-in-out infinite}
@keyframes bob{0%,100%{transform:translateY(-3px);opacity:.45}50%{transform:translateY(3px);opacity:1}}
@media (prefers-reduced-motion: reduce){
  .scrollhint .dot{animation:none;opacity:.9}
  #loader .hex{animation:none}
}

/* ---------- scan HUD ---------- */
#scan{position:absolute;inset:0;z-index:3}
#scanbox{position:absolute;transform:translate(-50%,-50%);will-change:transform}
#hudline{position:absolute;height:1px;background:rgba(245,244,242,.42);transform-origin:0 50%}
#scanbox .frame{position:absolute;inset:0;border:1px solid rgba(245,244,242,.38)}
#scanbox .c{position:absolute;width:10px;height:10px;border:1.6px solid var(--lime)}
#scanbox .c1{left:-1px;top:-1px;border-right:0;border-bottom:0}
#scanbox .c2{right:-1px;top:-1px;border-left:0;border-bottom:0}
#scanbox .c3{left:-1px;bottom:-1px;border-right:0;border-top:0}
#scanbox .c4{right:-1px;bottom:-1px;border-left:0;border-top:0}
#scanbox .sweep{position:absolute;left:1px;right:1px;height:1px;
  background:linear-gradient(90deg,transparent,var(--lime) 22%,var(--lime) 78%,transparent);opacity:.75;
  box-shadow:0 0 10px rgba(198,241,157,.55)}
.chip{
  position:absolute;padding:3px 7px;border-radius:3px;background:var(--lime);color:var(--ink);
  font-family:var(--mono);font-size:10.5px;letter-spacing:.02em;white-space:nowrap;font-weight:500;
}
#readout{
  position:absolute;font-family:var(--mono);font-size:10.5px;line-height:1.7;
  color:var(--paper);text-shadow:0 1px 8px rgba(4,10,4,.9);white-space:nowrap;
}
.chip{box-shadow:0 2px 10px rgba(4,10,4,.55)}
#readout .g{color:var(--lime)}
#readout .d{opacity:.55}

/* ---------- mid captions ---------- */
.cap{
  --capY:-50%;
  position:absolute;z-index:4;max-width:min(30ch,32vw);
  left:var(--pad);top:50%;transform:translateY(var(--capY));
  opacity:0;
}
/* clouds drift behind these, so each caption carries its own soft ground */
.cap::before{content:'';position:absolute;inset:-26px -56px -30px -34px;z-index:-1;pointer-events:none;
  background:radial-gradient(116% 104% at 10% 50%, rgba(8,24,44,.56) 0%, rgba(8,24,44,.26) 44%, rgba(8,24,44,0) 78%)}
.cap.right::before{background:radial-gradient(116% 104% at 90% 50%, rgba(8,24,44,.56) 0%, rgba(8,24,44,.26) 44%, rgba(8,24,44,0) 78%);
  inset:-26px -34px -30px -56px}
.cap .idx{font-family:var(--mono);font-size:11px;letter-spacing:.09em;color:var(--lime);margin-bottom:14px}
.cap h3{font-size:clamp(19px,1.72vw,26px);font-weight:500;letter-spacing:-.03em;line-height:1.14;margin-bottom:10px}
.cap p{font-size:13.5px;line-height:1.5;color:rgba(245,244,242,.86)}
.cap.right{left:auto;right:var(--pad);text-align:right}
.cap .rule{height:1px;background:linear-gradient(90deg,var(--lime),rgba(198,241,157,0));margin-bottom:16px}
.cap.right .rule{background:linear-gradient(270deg,var(--lime),rgba(198,241,157,0))}

/* ---------- outro ---------- */
#outro{
  position:absolute;inset:0;z-index:5;display:grid;place-items:center;
  text-align:center;padding:var(--pad);opacity:0;
}
#outro .kicker{font-family:var(--mono);font-size:11.5px;letter-spacing:.12em;color:var(--lime);margin-bottom:22px}
#outro p{color:rgba(245,244,242,.78)}
#outro h2{font-size:clamp(28px,4.3vw,62px);font-weight:500;letter-spacing:-.045em;line-height:1.0;max-width:15ch}
#outro p{margin-top:22px;font-size:14.5px;line-height:1.5;color:rgba(245,244,242,.66);max-width:46ch}
#outro .pill{position:static;display:inline-flex;margin-top:34px}

/* ---------- progress rail ---------- */
#rail{position:absolute;right:calc(var(--pad) * .55);top:50%;transform:translateY(-50%);
  width:2px;height:118px;background:rgba(245,244,242,.14);border-radius:2px;z-index:6}
#railfill{position:absolute;left:0;top:0;width:100%;background:var(--lime);border-radius:2px;height:0%}

/* ---------- loader ---------- */
#loader{position:fixed;inset:0;z-index:20;background:#07121E;display:grid;place-items:center;
  transition:opacity .9s cubic-bezier(.4,0,.2,1)}
#loader .hex{width:15px;height:17px;background:var(--paper);
  clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);
  animation:spin 1.15s cubic-bezier(.65,0,.35,1) infinite}
@keyframes spin{0%{transform:rotate(0) scale(1)}50%{transform:rotate(180deg) scale(.72)}100%{transform:rotate(360deg) scale(1)}}
#loader .pct{position:absolute;bottom:calc(var(--pad) + 4px);right:var(--pad);
  font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:rgba(245,244,242,.5)}
#loader .lbl{position:absolute;bottom:calc(var(--pad) + 4px);left:var(--pad);
  font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:rgba(245,244,242,.5)}
body.ready #loader{opacity:0;pointer-events:none}
body.nogl #hero{position:relative;min-height:100vh}
body.nogl #ui{position:relative;overflow:visible}

@media (max-width:820px){
  nav,.topcta{display:none}
  header{justify-content:space-between}
  .mode{margin-left:auto}
  .lede{max-width:min(46ch,calc(100% - var(--pad)*2));width:auto;font-size:13px}
  .scrollhint{display:none}
  #rail{display:none}
  /* a centred caption fights the rock on a tall screen — park it at the foot */
  .cap{--capY:0%;max-width:none;width:calc(100% - var(--pad)*2);
       top:auto;bottom:calc(var(--pad) + 4px)}
  .cap.right{text-align:left;right:auto;left:var(--pad)}
  .cap h3{font-size:clamp(17px,4.6vw,22px)}
  .cap p{font-size:12.5px}
  /* the three authored line breaks only fit on a wide measure */
  #herocopy{max-width:none;width:calc(100% - var(--pad)*2);top:clamp(76px,13vh,120px)}
  h1{white-space:normal;font-size:clamp(27px,8.4vw,46px);letter-spacing:-.042em}
  #readout{display:none}
  #hudline{display:none}
  .chip{font-size:9.5px;padding:3px 6px}
  #outro h2{font-size:clamp(26px,7.6vw,44px)}
  #outro p{font-size:13px}
}
@media (max-width:820px) and (orientation:landscape){
  #herocopy{top:clamp(56px,10vh,96px)}
  h1{font-size:clamp(22px,4.6vw,34px)}
}
</style>
</head>
<body>
<canvas id="gl"></canvas>
<div id="spacer"></div>

<div id="scrim"></div>
<div id="ui">
  <header>
    <div class="mark">
      <svg width="19" height="19" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 1.5 34.5 10v20L20 38.5 5.5 30V10z" fill="none" stroke="#C6F19D" stroke-width="2.6"/>
        <circle cx="20" cy="20" r="3.4" fill="#C6F19D"/>
      </svg>
      <span>terrane</span>
    </div>
    <nav>
      <span>Solutions <i>▾</i></span><span>Our Tech <i>▾</i></span><span>Company <i>▾</i></span><span>Resources <i>▾</i></span>
    </nav>
    <button id="mode" class="mode" type="button" aria-pressed="false" aria-label="Switch to night">
      <span class="knob"></span>
      <svg class="ic sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.4"/><path d="M12 1.6v2.6M12 19.8v2.6M1.6 12h2.6M19.8 12h2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M19.4 4.6l-1.9 1.9M6.5 17.5l-1.9 1.9"/>
      </svg>
      <svg class="ic moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.5 14.6A8.8 8.8 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z"/>
      </svg>
    </button>
    <a class="topcta" href="#">Explore the site <em class="chevbox">▸</em></a>
  </header>

  <section id="hero">
    <div id="herocopy">
    <h1>
      <span class="ln"><b>Every Tonne of Carbon,</b></span>
      <span class="ln"><b>Measured Where</b></span>
      <span class="ln"><b>It Actually Lives</b></span>
    </h1>
    <a class="pill" href="#">Explore the site <em class="chevbox">▸</em></a>
    </div>
    <p class="lede">Know your impact—precisely. Flux towers, atmospheric inversion and tamper-proof records, resolved down to the hectare.</p>
    <div class="scrollhint"><span class="dot"></span>Scroll to discover</div>
  </section>

  <div id="scan">
    <div id="scanbox">
      <div class="frame"></div>
      <div class="c c1"></div><div class="c c2"></div><div class="c c3"></div><div class="c c4"></div>
      <div class="sweep"></div>
    </div>
    <div id="hudline"></div>
    <div class="chip" id="chip">−8.3 tCO₂e</div>
    <div id="readout">
      <div><span class="g">VERIFIED REMOVAL</span> <span class="d">−1.24 tCO₂ · −2.01 tCO₂</span></div>
      <div><span class="d">FLUX 0.57 tCO₂ ·</span> <span class="g">AMRV LOCK</span> <span class="d">08:41:02</span></div>
      <div><span class="d">PLOT 4A · CANOPY 61% · SOIL C 3.4%</span></div>
    </div>
  </div>

  <div class="cap" id="cap1">
    <div class="rule"></div>
    <div class="idx">01 — OBSERVATION</div>
    <h3>Sensor towers, flux methods and satellites, reading the same hectare.</h3>
    <p>Ground truth and atmosphere, reconciled continuously instead of once a year.</p>
  </div>
  <div class="cap right" id="cap2">
    <div class="rule"></div>
    <div class="idx">02 — SUBSTRATE</div>
    <h3>Carbon is stored where nobody looks: under the moss line.</h3>
    <p>High-frequency sampling resolves soil carbon at the depth it actually accumulates.</p>
  </div>

  <div id="outro">
    <div>
      <div class="kicker">NO SPREADSHEETS · NO GUESSWORK</div>
      <h2>Just real, measured insight.</h2>
      <p>Every metric traceable to the instrument that recorded it—audit-ready the moment it is written.</p>
      <a class="pill" href="#">Begin the descent <em class="chevbox">▸</em></a>
    </div>
  </div>

  <div id="rail"><div id="railfill"></div></div>
</div>

<div id="loader">
  <div class="hex"></div>
  <div class="lbl">TERRANE / SKYFIELD SURVEY</div>
  <div class="pct" id="pct">0%</div>
</div>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>
<script>
'use strict';
/* ============================================================================
   TERRANE — a scroll-driven journey into a procedurally generated mossy
   floating boulder.  Everything (rock, moss, flowers, shadows) is generated
   in the browser: an SDF is meshed with Surface Nets, soft shadows and AO are
   baked from the same field, and vegetation is scattered on the result.
   ========================================================================== */

/* ---------------------------------------------------------------- utilities */
const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const clamp = (v,a,b)=>v<a?a:(v>b?b:v);
const lerp  = (a,b,t)=>a+(b-a)*t;
const smoothstep=(e0,e1,x)=>{const t=clamp((x-e0)/(e1-e0),0,1);return t*t*(3-2*t);};
const easeInOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

function mulberry(seed){let s=seed>>>0;return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd = mulberry(20260815);

/* --------------------------------------------------------------- value noise */
const PERM = new Uint8Array(512), GRAD = new Float32Array(512);
(function(){
  const p = new Uint8Array(256);
  for (let i=0;i<256;i++) p[i]=i;
  const r = mulberry(99173);
  for (let i=255;i>0;i--){ const j=(r()*(i+1))|0; const t=p[i]; p[i]=p[j]; p[j]=t; }
  for (let i=0;i<512;i++){ PERM[i]=p[i&255]; }
  const r2 = mulberry(5551);
  for (let i=0;i<512;i++) GRAD[i]=r2()*2-1;
})();

function vnoise(x,y,z){
  const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z);
  let fx=x-X, fy=y-Y, fz=z-Z;
  const u=fx*fx*(3-2*fx), v=fy*fy*(3-2*fy), w=fz*fz*(3-2*fz);
  const xi=X&255, yi=Y&255, zi=Z&255;
  const A =PERM[xi]+yi,        B =PERM[(xi+1)&255]+yi;
  const AA=PERM[A&255]+zi,     AB=PERM[(A+1)&255]+zi;
  const BA=PERM[B&255]+zi,     BB=PERM[(B+1)&255]+zi;
  const n000=GRAD[AA&255], n001=GRAD[(AA+1)&255],
        n010=GRAD[AB&255], n011=GRAD[(AB+1)&255],
        n100=GRAD[BA&255], n101=GRAD[(BA+1)&255],
        n110=GRAD[BB&255], n111=GRAD[(BB+1)&255];
  const x00=n000+(n100-n000)*u, x01=n001+(n101-n001)*u;
  const x10=n010+(n110-n010)*u, x11=n011+(n111-n011)*u;
  const y0=x00+(x10-x00)*v,     y1=x01+(x11-x01)*v;
  return y0+(y1-y0)*w;
}
function fbm(x,y,z,oct){
  let a=.5,f=1,s=0,n=0;
  for(let i=0;i<oct;i++){ s+=a*vnoise(x*f,y*f,z*f); n+=a; a*=.5; f*=2.07; }
  return s/n;
}

/* ------------------------------------------------------------ smooth min/max */
function smin(a,b,k){ const h=Math.max(k-Math.abs(a-b),0)/k; return Math.min(a,b)-h*h*k*.25; }
function smax(a,b,k){ return -smin(-a,-b,k); }

/* ------------------------------------------------------------------ the rock */
/* Chunky asymmetric body assembled from ellipsoidal lobes, then sliced by a
   handful of cleavage planes (that is what makes it read as rock and not as a
   potato), then hollowed by a blind pocket that the camera eventually enters. */
/* Rounded, rotated blocks rather than ellipsoids: a boulder is a pile of
   fractured slabs, and box SDFs give the flat faces and hard arrises that make
   it read as stone instead of as a potato. */
const BLOCKS = [
  {c:[ 0.00, 0.00, 0.00], b:[0.72,0.58,0.66], r:0.070, e:[ 0.16, 0.34, 0.07]},
  {c:[ 0.36, 0.10,-0.12], b:[0.42,0.45,0.40], r:0.060, e:[ 0.52,-0.42, 0.26]},
  {c:[-0.34,-0.04, 0.18], b:[0.44,0.40,0.42], r:0.060, e:[-0.31, 0.72,-0.19]},
  {c:[ 0.05, 0.36, 0.20], b:[0.37,0.27,0.35], r:0.050, e:[ 0.22, 1.08, 0.41]},
  {c:[-0.10,-0.38,-0.05], b:[0.40,0.29,0.38], r:0.050, e:[ 0.88, 0.19,-0.52]},
  {c:[ 0.24,-0.22, 0.36], b:[0.31,0.30,0.29], r:0.045, e:[-0.61, 0.30, 0.92]},
  {c:[-0.26, 0.26,-0.34], b:[0.32,0.27,0.30], r:0.045, e:[ 0.40,-0.85, 0.15]},
  {c:[-0.02, 0.52,-0.06], b:[0.31,0.16,0.23], r:0.040, e:[ 0.34, 0.52,-0.28]}
];
function eulerMat(ex,ey,ez){
  const cx=Math.cos(ex),sx=Math.sin(ex),cy=Math.cos(ey),sy=Math.sin(ey),cz=Math.cos(ez),sz=Math.sin(ez);
  // R = Rz*Ry*Rx, stored row-major (we use its transpose to go world -> block)
  return [ cz*cy, cz*sy*sx-sz*cx, cz*sy*cx+sz*sx,
           sz*cy, sz*sy*sx+cz*cx, sz*sy*cx-cz*sx,
            -sy ,          cy*sx,          cy*cx ];
}
BLOCKS.forEach(B=>{ B.m=eulerMat(B.e[0],B.e[1],B.e[2]); });
/* chunks knocked off the surface — real rock is missing pieces */
const BITES = [
  [ 0.86, 0.42,-0.52, 0.42],
  [-0.52, 0.78, 0.40, 0.38],
  [ 0.30,-0.84, 0.46, 0.36],
  [-0.88,-0.14,-0.42, 0.34]
];
const PLANES = [];
(function(){
  const seeds=[[ .55, .72,-.42, .68],[-.68, .38, .62, .72],[ .18,-.86, .48, .64],
               [-.42,-.55,-.72, .70],[ .82, .12, .56, .66],[-.10, .92, .38, .62],
               [ .62,-.44, .65, .74],[-.86,-.20, .48, .68],[ .04,-.32,-.95, .74],
               [ .34, .58, .74, .70],[-.55, .70,-.45, .72],[ .90,-.30,-.32, .72],
               [-.20,-.70, .68, .68],[ .12, .30,-.94, .76]];
  for(const s of seeds){
    const l=Math.hypot(s[0],s[1],s[2]);
    PLANES.push([s[0]/l,s[1]/l,s[2]/l,s[3]]);
  }
})();

const CAVE_M   = [-0.58,-0.30, 0.32];   // mouth: left flank, below the waist
const CAVE_MID = [-0.32,-0.16, 0.18];
const CAVE_IN  = [-0.02, 0.02, 0.02];   // blind end, at the core

function sphD(x,y,z,c,r){ return Math.hypot(x-c[0],y-c[1],z-c[2])-r; }

function caveField(x,y,z){
  let d = sphD(x,y,z,CAVE_M,0.300);
  d = smin(d, sphD(x,y,z,CAVE_MID,0.260), 0.20);
  d = smin(d, sphD(x,y,z,CAVE_IN ,0.235), 0.20);
  return d;
}

/* cheap part of the field — evaluated on the whole grid */
function sdfBase(x,y,z){
  let d = 1e9;
  for (let i=0;i<BLOCKS.length;i++){
    const B=BLOCKS[i], m=B.m;
    const px=x-B.c[0], py=y-B.c[1], pz=z-B.c[2];
    // world -> block space (transpose of R)
    const qx=Math.abs(m[0]*px+m[3]*py+m[6]*pz)-B.b[0];
    const qy=Math.abs(m[1]*px+m[4]*py+m[7]*pz)-B.b[1];
    const qz=Math.abs(m[2]*px+m[5]*py+m[8]*pz)-B.b[2];
    const ax=qx>0?qx:0, ay=qy>0?qy:0, az=qz>0?qz:0;
    const inner=Math.min(Math.max(qx,Math.max(qy,qz)),0);
    d = smin(d, Math.sqrt(ax*ax+ay*ay+az*az)+inner-B.r, 0.062);
  }
  for (let i=0;i<PLANES.length;i++){
    const P=PLANES[i];
    d = smax(d, x*P[0]+y*P[1]+z*P[2]-P[3], 0.020);
  }
  for (let i=0;i<BITES.length;i++){
    const S=BITES[i];
    d = smax(d, -(Math.sqrt((x-S[0])*(x-S[0])+(y-S[1])*(y-S[1])+(z-S[2])*(z-S[2]))-S[3]), 0.070);
  }
  d = smax(d, -caveField(x,y,z), 0.075);
  return d;
}

/* expensive part — strata ledges + fBm, only evaluated in the narrow band */
const BAND = 0.26;
const SAX=[0.20,0.955,0.22];
(function(){const l=Math.hypot(SAX[0],SAX[1],SAX[2]);SAX[0]/=l;SAX[1]/=l;SAX[2]/=l;})();

function sdfDetail(x,y,z){
  // sedimentary ledges: slow rise, quick drop, wobbling along the bedding plane
  const s = (x*SAX[0]+y*SAX[1]+z*SAX[2])*3.15 + 1.05*fbm(x*1.15,y*0.95,z*1.15,2);
  const fr = s-Math.floor(s);
  const ledge = (fr<0.84 ? fr/0.84 : (1-fr)/0.16) - 0.5;
  const ledgeMask = 0.30+0.70*fbm(x*1.55+11,y*1.55,z*1.55,3);
  // vertical fluting: noise squashed along the bedding axis
  const flute = fbm(x*8.6-3.0, y*2.7, z*8.6+7.0, 3);
  // general lumps + fine grain
  const lump  = fbm(x*1.45+31, y*1.45-5, z*1.45+2, 4);
  const grain = fbm(x*11.5-17, y*11.5+3, z*11.5-9, 2);
  // narrow fissures running with the fluting
  const rid   = 1-Math.abs(fbm(x*5.4+5, y*2.1-2, z*5.4+13, 2)*2.4);
  const crack = Math.pow(clamp(rid,0,1),8)*0.046;
  return lump*0.050 + flute*0.028 + ledge*0.086*ledgeMask + grain*0.0085 + crack;
}
function sdfFull(x,y,z){
  const b = sdfBase(x,y,z);
  if (b> BAND) return b;
  if (b<-BAND) return b;
  return b + sdfDetail(x,y,z);
}

/* --------------------------------------------------------------- SURFACE NETS */
/* Dual contouring's simple cousin: one vertex per sign-changing cell placed at
   the average of its edge crossings, quads emitted across sign-changing grid
   edges.  Uniform, quad-ish topology — much friendlier to scatter on than
   marching cubes' slivers. */
const CUBE_EDGES = [
  [0,1],[1,3],[2,3],[0,2],[4,5],[5,7],[6,7],[4,6],[0,4],[1,5],[2,6],[3,7]
];
const CUBE_CORNER = [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];

function surfaceNets(N, lo, hi, field){
  const nx=N+1, ny=N+1, nz=N+1;
  const dx=(hi-lo)/N;
  const idxMap = new Int32Array(N*N*N).fill(-1);
  const pos=[], cells=[];
  const g=(i,j,k)=>field[(k*ny+j)*nx+i];
  const R=[0,0,0,0,0,0,0,0];
  for(let k=0;k<N;k++)for(let j=0;j<N;j++)for(let i=0;i<N;i++){
    let mask=0;
    for(let c=0;c<8;c++){
      const cc=CUBE_CORNER[c];
      const v=g(i+cc[0],j+cc[1],k+cc[2]);
      R[c]=v; if(v<0) mask|=(1<<c);
    }
    if(mask===0||mask===255) continue;
    let ax=0,ay=0,az=0,n=0;
    for(let e=0;e<12;e++){
      const a=CUBE_EDGES[e][0],b=CUBE_EDGES[e][1];
      const va=R[a],vb=R[b];
      if((va<0)===(vb<0)) continue;
      const t=va/(va-vb);
      const ca=CUBE_CORNER[a],cb=CUBE_CORNER[b];
      ax+=ca[0]+(cb[0]-ca[0])*t; ay+=ca[1]+(cb[1]-ca[1])*t; az+=ca[2]+(cb[2]-ca[2])*t;
      n++;
    }
    ax/=n; ay/=n; az/=n;
    idxMap[(k*N+j)*N+i]=pos.length/3;
    pos.push(lo+(i+ax)*dx, lo+(j+ay)*dx, lo+(k+az)*dx);
    cells.push(i,j,k);
  }
  // quads across sign-changing grid edges
  const idx=[];
  const cid=(i,j,k)=>(i<0||j<0||k<0||i>=N||j>=N||k>=N)?-1:idxMap[(k*N+j)*N+i];
  const quad=(a,b,c,d,flip)=>{
    if(a<0||b<0||c<0||d<0) return;
    if(flip){ idx.push(a,c,b, a,d,c); } else { idx.push(a,b,c, a,c,d); }
  };
  for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
    const v0=g(i,j,k);
    if(i+1<nx && j>0 && k>0){
      const v1=g(i+1,j,k);
      if((v0<0)!==(v1<0)) quad(cid(i,j-1,k-1),cid(i,j,k-1),cid(i,j,k),cid(i,j-1,k), v0<0);
    }
    if(j+1<ny && i>0 && k>0){
      const v1=g(i,j+1,k);
      if((v0<0)!==(v1<0)) quad(cid(i-1,j,k-1),cid(i,j,k-1),cid(i,j,k),cid(i-1,j,k), v0>=0);
    }
    if(k+1<nz && i>0 && j>0){
      const v1=g(i,j,k+1);
      if((v0<0)!==(v1<0)) quad(cid(i-1,j-1,k),cid(i,j-1,k),cid(i,j,k),cid(i-1,j,k), v0<0);
    }
  }
  return { pos:new Float32Array(pos), idx:(pos.length/3>65535?new Uint32Array(idx):new Uint16Array(idx)) };
}

/* ------------------------------------------------------------- growth model */
/* One function decides where things grow.  The rock shader bakes it per vertex
   (so the ground under a clump reads as dark soil, not bare tan rock) and the
   scatterer samples the same field, which keeps leaves and soil registered. */
function growth(px,py,pz,ny,ao){
  const patch = fbm(px*2.05+3.1, py*2.05-3.1, pz*2.05+1.6, 3)*0.5+0.5;
  const fine  = fbm(px*6.8-3.0, py*6.8+8.0, pz*6.8-1.0, 2)*0.5+0.5;
  const bc = (px*SAX[0]+py*SAX[1]+pz*SAX[2])*3.15 + 1.05*fbm(px*1.15,py*0.95,pz*1.15,2);
  const fr = bc-Math.floor(bc);
  const ledge = smoothstep(0.64,0.79,fr)*smoothstep(1.0,0.85,fr);
  let m = smoothstep(0.06,0.55,ny)*0.78 * smoothstep(0.44,0.65,patch);
  m += ledge*1.30*smoothstep(0.37,0.57,patch)*smoothstep(-0.62,0.20,ny);
  m *= 0.18+0.82*ao;
  m *= 0.20+0.80*smoothstep(0.26,0.74,fine);   // punch holes so rock shows through
  return { m:clamp(m,0,1), patch, fine, ledge };
}

/* ------------------------------------------------- gradient / AO / soft shadow */
function grad(x,y,z,h,out){
  const e=h;
  out[0]=sdfFull(x+e,y,z)-sdfFull(x-e,y,z);
  out[1]=sdfFull(x,y+e,z)-sdfFull(x,y-e,z);
  out[2]=sdfFull(x,y,z+e)-sdfFull(x,y,z-e);
  const l=Math.hypot(out[0],out[1],out[2])||1;
  out[0]/=l; out[1]/=l; out[2]/=l;
}
const AO_STEPS=[0.028,0.062,0.115,0.20,0.33,0.52];
const AO_W=[0.30,0.24,0.18,0.14,0.09,0.05];
function ambientOcc(x,y,z,nx,ny,nz){
  /* the field is noise-perturbed, so compare against the step length rather
     than trusting it as a metric distance */
  let occ=0;
  for(let i=0;i<AO_STEPS.length;i++){
    const h=AO_STEPS[i];
    const d=sdfFull(x+nx*h,y+ny*h,z+nz*h);
    occ += clamp((h-d)/h,0,1)*AO_W[i];
  }
  return clamp(1-1.65*occ,0,1);
}
function softShadow(x,y,z,lx,ly,lz){
  /* Fixed-step occlusion probe.  Sphere tracing lies on a field this noisy —
     it reports a near-zero distance right beside the surface it started on and
     shadows two thirds of the rock.  Marching fixed steps and only reacting to
     genuinely negative samples keeps the self-shadowing honest. */
  const STEPS=13, MAXT=1.55;
  let res=1;
  for(let i=1;i<=STEPS;i++){
    const t=MAXT*i/STEPS;
    const d=sdfFull(x+lx*t,y+ly*t,z+lz*t);
    if(d<0.0) return 0;
    res=Math.min(res, 5.5*d/t);
  }
  return clamp(res,0,1);
}

/* =========================================================== colour helpers */
function srgbToLinear(hex){
  const r=((hex>>16)&255)/255, g=((hex>>8)&255)/255, b=(hex&255)/255;
  const f=c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);
  return new THREE.Vector3(f(r),f(g),f(b));
}

/* ============================================================ shared GLSL */
const GLSL_NOISE = \`
float h31(vec3 p){ p=fract(p*0.3183099+vec3(0.11,0.27,0.53)); p*=17.0;
  return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vn(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(mix(h31(i+vec3(0,0,0)),h31(i+vec3(1,0,0)),f.x),
                 mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),
                 mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
const mat3 M3 = mat3( 0.00, 0.80, 0.60, -0.80, 0.36,-0.48, -0.60,-0.48, 0.64);
float fb4(vec3 p){ float a=0.5,s=0.0,n=0.0;
  for(int i=0;i<4;i++){ s+=a*vn(p); n+=a; a*=0.5; p=M3*p*2.01; } return s/n; }
float fb2(vec3 p){ float a=0.5,s=0.0,n=0.0;
  for(int i=0;i<2;i++){ s+=a*vn(p); n+=a; a*=0.5; p=M3*p*2.01; } return s/n; }
\`;

/* Sky model, shared by the dome, the aerial perspective in every surface shader
   and the cloud lighting.  One function so the fog can never disagree with the
   sky it is fogging toward. */
const GLSL_SKY = \`
uniform vec3 uZenith, uMidSky, uHorizon, uNadir, uSunTint, uSunDir;
uniform float uCloudDrift, uSkyGain, uOrbSize, uOrbGlow, uStars;
/* A 30-degree lens only sees about +-0.26 of d.y, so a physical horizon-to-
   zenith ramp would read as one flat colour.  The band is compressed to sit
   inside the frame instead. */
vec3 skyColor(vec3 d){
  float t = clamp(d.y*1.75 + 0.70, 0.0, 1.0);
  vec3 c = mix(uHorizon, uMidSky, smoothstep(0.0,0.72,t));
  c = mix(c, uZenith, smoothstep(0.52,1.0,t));
  c = mix(c, uNadir, smoothstep(-0.34,-0.78,d.y));
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  c += uSunTint * (pow(s, 5.0)*uOrbGlow + pow(s, uOrbSize)*3.0);
  return c*uSkyGain;
}
\`;

/* ================================================================ ROCK SHADER */
const skyUniforms = {
  uZenith:{value:new THREE.Vector3()}, uMidSky:{value:new THREE.Vector3()},
  uHorizon:{value:new THREE.Vector3()}, uNadir:{value:new THREE.Vector3()},
  uSunTint:{value:new THREE.Vector3()}, uSunDir:{value:new THREE.Vector3()},
  uCloudDrift:{value:0}, uSkyGain:{value:0.32},
  uOrbSize:{value:260}, uOrbGlow:{value:0.22}, uStars:{value:0}
};
const rockUniforms = {
  uKeyDir:{value:new THREE.Vector3()}, uKeyCol:{value:new THREE.Vector3()},
  uSkyCol:{value:new THREE.Vector3()}, uGndCol:{value:new THREE.Vector3()},
  uRimCol:{value:new THREE.Vector3()}, uRimDir:{value:new THREE.Vector3()},
  uFillCol:{value:new THREE.Vector3()}, uFillDir:{value:new THREE.Vector3()},
  uRockA:{value:new THREE.Vector3()},  uRockB:{value:new THREE.Vector3()},
  uRockC:{value:new THREE.Vector3()},  uLichen:{value:new THREE.Vector3()},
  uSoil:{value:new THREE.Vector3()},
  uFog:{value:new THREE.Vector3()},    uFogD:{value:0.0016},
  uLightUp:{value:0.0}, uBump:{value:1.30}, uTexScale:{value:1.0},
  uUnderGlow:{value:0.0},
  ...THREE.UniformsUtils.clone(skyUniforms)
};

const ROCK_VERT = \`
attribute float aAO;
attribute float aSh;
attribute float aMoss;
varying vec3 vObj; varying vec3 vNw; varying vec3 vWpos;
varying float vAO; varying float vSh; varying float vMoss;
void main(){
  vObj = position;
  vAO = aAO; vSh = aSh; vMoss = aMoss;
  vec4 wp = modelMatrix * vec4(position,1.0);
  vWpos = wp.xyz;
  vNw = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}\`;

const ROCK_FRAG = \`
precision highp float;
\${GLSL_NOISE}
\${GLSL_SKY}
uniform vec3 uKeyDir,uKeyCol,uSkyCol,uGndCol,uRimCol,uRimDir,uFillCol,uFillDir;
uniform vec3 uRockA,uRockB,uRockC,uLichen,uSoil,uFog;
uniform float uFogD,uLightUp,uBump,uTexScale,uUnderGlow;
varying vec3 vObj; varying vec3 vNw; varying vec3 vWpos;
varying float vAO; varying float vSh; varying float vMoss;

const vec3 BED = vec3(0.203,0.955,0.216);

float hlow(vec3 p){ return fb2(p*19.0); }
/* Relief is band-limited to what the pixel can actually resolve.  An octave's
   slope is amplitude x frequency, so an unfaded high octave reads as dark
   stipple at distance; faded in by object-units-per-pixel it reads as grain
   that appears only when you get close. */
float hmap(vec3 p, vec2 lod){
  return hlow(p)*0.54 + fb2(p*52.0)*0.30*lod.x + vn(p*124.0)*0.16*lod.y;
}
void main(){
  vec3 p = vObj * uTexScale;
  vec3 n = normalize(vNw);

  /* --- micro relief: perturb the normal with the gradient of a height field */
  float px  = (fwidth(p.x)+fwidth(p.y)+fwidth(p.z))*0.62;
  vec2 lod = vec2(1.0-smoothstep(0.0085,0.030,px), 1.0-smoothstep(0.0030,0.0115,px));
  float e = 0.0048;
  float h0 = hmap(p,lod);
  vec3 gr = vec3(hmap(p+vec3(e,0.,0.),lod)-h0, hmap(p+vec3(0.,e,0.),lod)-h0, hmap(p+vec3(0.,0.,e),lod)-h0)/e;
  gr -= n*dot(gr,n);
  n = normalize(n - gr*uBump*0.0155);
  float cav  = smoothstep(0.60,0.26,hlow(p));            // pits at rock scale
  float pit  = smoothstep(0.56,0.22,h0)*lod.x;           // fine pitting, up close only

  /* --- albedo: bedding stripes + mottling + crevice darkening --------------- */
  float bedc = dot(p,BED)*3.15 + 1.05*(fb2(p*1.15)*2.0-1.0);
  float fr = fract(bedc);
  float band = smoothstep(0.0,0.35,fr)*smoothstep(1.0,0.72,fr);
  float m1 = fb4(p*2.9)*2.0-1.0;
  float m2 = vn(p*8.4)*2.0-1.0;
  float m3 = (fb2(p*34.0)*2.0-1.0)*lod.x;                // grain in the colour, not just the relief
  float tone = 0.50 + 0.44*m1 + 0.17*m2 + 0.13*m3 + 0.24*(band-0.5);
  tone = clamp(tone,0.0,1.0);

  vec3 alb = mix(uRockA, uRockB, smoothstep(0.10,0.86,tone));
  alb = mix(alb, uRockC, smoothstep(0.66,1.0,tone)*0.75);

  /* dark seams where the bedding planes split */
  float seam = smoothstep(0.10,0.0,abs(fr-0.02)) + smoothstep(0.10,0.0,abs(fr-0.98));
  alb *= 1.0 - 0.52*seam;

  /* runoff: soil washes down the vertical faces beneath every ledge */
  float streak = smoothstep(0.34,0.86, fb2(vec3(p.x*8.5, p.y*0.9, p.z*8.5)+17.0));
  alb *= 1.0 - 0.34*streak*(1.0-clamp(n.y,0.0,1.0));

  /* lichen / algae film on upward faces */
  float up = clamp(n.y,0.0,1.0);
  float lich = up*up * smoothstep(0.34,0.78, fb2(p*3.6+9.0));
  alb = mix(alb, uLichen, lich*0.42);

  /* soil: wherever things grow, the rock under them is dark humus */
  alb = mix(alb, uSoil, smoothstep(0.04,0.72,vMoss)*0.82);

  /* baked cavity darkening */
  float ao = clamp(vAO,0.0,1.0);
  alb *= mix(0.09, 1.0, pow(ao,1.55));
  alb *= mix(1.0, 0.42, cav);
  alb *= mix(1.0, 0.60, pit);

  /* --- lighting ------------------------------------------------------------ */
  vec3 V = normalize(cameraPosition - vWpos);
  vec3 L = normalize(uKeyDir);
  float sh = mix(1.0, clamp(vSh,0.0,1.0), 0.88);
  float ndl = max(dot(n,L),0.0);
  vec3 direct = uKeyCol * ndl * sh;

  vec3 F = normalize(uFillDir);
  direct += uFillCol * max(dot(n,F),0.0) * mix(0.55,1.0,ao);

  vec3 amb = mix(uGndCol,uSkyCol, n.y*0.5+0.5) * ao;

  float rim = pow(1.0-max(dot(n,V),0.0),3.2);
  vec3 rimc = uRimCol * rim * ao * max(dot(n,normalize(uRimDir)),0.0);

  vec3 H = normalize(L+V);
  float spec = pow(max(dot(n,H),0.0), 22.0) * 0.115 * sh * step(0.001,ndl);

  /* a lime bounce from below that swells during the dive */
  float below = clamp(-n.y*0.7+0.3,0.0,1.0);
  vec3 glow = uLichen * below * uUnderGlow * ao * smoothstep(0.15,0.75,vMoss) * 0.9;

  vec3 col = alb*(direct+amb) + rimc + uKeyCol*spec + glow;
  col *= uLightUp;

  float d = length(vWpos - cameraPosition);
  /* quadratic aerial perspective: five metres of air should not veil the
     subject, but forty should bury it */
  float fd = max(d-2.5,0.0);
  col = mix(col, skyColor(-V), 1.0-exp(-uFogD*fd*fd));

  gl_FragColor = vec4(col,1.0);
}\`;

/* ========================================================== VEGETATION SHADER */
const vegUniforms = {
  uKeyDir:{value:new THREE.Vector3()}, uKeyCol:{value:new THREE.Vector3()},
  uSkyCol:{value:new THREE.Vector3()}, uGndCol:{value:new THREE.Vector3()},
  uFillCol:{value:new THREE.Vector3()}, uFillDir:{value:new THREE.Vector3()},
  uFog:{value:new THREE.Vector3()}, uFogD:{value:0.0016},
  uTime:{value:0}, uLightUp:{value:0}, uWind:{value:1.45}, uUnderGlow:{value:0},
  uWave:{value:0}, uTileScale:{value:new THREE.Vector2(0.5,0.5)},
  /* uWind is nudged up from 1.0: the brief asked for plants that flow */
  map:{value:null},
  ...THREE.UniformsUtils.clone(skyUniforms)
};

const VEG_VERT = \`
attribute vec3 aColor; attribute vec3 aRand; attribute vec3 aNrm; attribute vec2 aTile;
varying float vUp;
uniform float uTime, uWind, uWave;
uniform vec2 uTileScale;
varying vec3 vCol; varying vec2 vUv; varying vec3 vN; varying vec3 vFace;
varying float vSh; varying vec3 vWpos;
void main(){
  vUv = uv*uTileScale + aTile; vCol = aColor; vSh = aRand.z; vUp = uv.y;
  vec3 pos = position;
  float ph = aRand.x*6.2831;
  float sway = (sin(uTime*1.35+ph)*0.6 + sin(uTime*2.31+ph*1.7)*0.4);
  /* leaves nod in place; hanging strands get a wave that travels down their
     length, which is what makes them read as flowing rather than wobbling */
  float trav = sin(uTime*1.75 - uv.y*5.4 + ph);
  float trav2= cos(uTime*1.42 - uv.y*4.1 + ph*1.3);
  float t2 = uv.y*uv.y;
  pos.x += mix(sway*0.085, trav *0.26, uWave) * uWind * t2;
  pos.z += mix(sway*0.045, trav2*0.17, uWave) * uWind * t2;
  pos.y -= uWave * t2 * 0.10 * abs(trav);          /* the strand shortens as it swings */
  vec4 mp = instanceMatrix * vec4(pos,1.0);
  vec4 wp = modelMatrix * mp;
  vWpos = wp.xyz;
  mat3 im = mat3(instanceMatrix);
  vFace = normalize(mat3(modelMatrix) * (im * normal));
  vN    = normalize(mat3(modelMatrix) * aNrm);
  gl_Position = projectionMatrix * viewMatrix * wp;
}\`;

const VEG_FRAG = \`
precision highp float;
\${GLSL_NOISE}
\${GLSL_SKY}
uniform sampler2D map;
uniform vec3 uKeyDir,uKeyCol,uSkyCol,uGndCol,uFillCol,uFillDir,uFog;
uniform float uFogD,uLightUp,uUnderGlow;
varying vec3 vCol; varying vec2 vUv; varying vec3 vN; varying vec3 vFace;
varying float vSh; varying vec3 vWpos; varying float vUp;
void main(){
  vec4 t = texture2D(map, vUv);
  if (t.a < 0.40) discard;
  t.rgb = t.rgb*t.rgb;                       // canvas art is sRGB-ish; work linear
  vec3 f = gl_FrontFacing ? vFace : -vFace;
  vec3 n = normalize(mix(f, vN, 0.66));
  vec3 L = normalize(uKeyDir);
  vec3 V = normalize(cameraPosition - vWpos);
  float ndl = dot(n,L);
  float wrap = clamp(ndl*0.55+0.45,0.0,1.0);
  float sh = mix(0.30,1.0,clamp(vSh,0.0,1.0));
  float trans = pow(clamp(-ndl,0.0,1.0),1.6) * clamp(dot(V,-L)*0.5+0.5,0.0,1.0);
  vec3 alb = vCol * t.rgb;
  vec3 col = alb * (uKeyCol*wrap*sh + uFillCol*max(dot(n,normalize(uFillDir)),0.0)*0.5
                    + mix(uGndCol,uSkyCol,n.y*0.5+0.5)*0.62);
  col += alb * uKeyCol * trans * 1.55 * sh;      // leaves are thin: light goes through
  col += alb * uUnderGlow * 1.5 * clamp(-n.y*0.5+0.6,0.0,1.0);
  col *= mix(0.56, 1.10, pow(clamp(vUp,0.0,1.0),0.55));   // canopy shades its own floor
  col *= uLightUp;
  float d = length(vWpos - cameraPosition);
  /* quadratic aerial perspective: five metres of air should not veil the
     subject, but forty should bury it */
  float fd = max(d-2.5,0.0);
  col = mix(col, skyColor(-V), 1.0-exp(-uFogD*fd*fd));
  gl_FragColor = vec4(col,1.0);
}\`;

/* ==================================================================== CLOUDS */
/* Camera-facing puffs grouped into clusters.  Each fragment builds a hemisphere
   normal from its own billboard coordinate and blends it with the direction out
   of the cluster centre, so a cluster shades as one body: sunlit crown, blue
   underside, bright rim where you look through it toward the sun. */
const CLOUD_VERT = \`
attribute vec4 aPuff;                       /* xyz cluster centre, w seed */
varying vec2 vQ; varying float vSeed;
varying vec3 vWpos, vNBig, vRight, vUp, vFwd;
void main(){
  vec3 c  = (instanceMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
  float sz = length(instanceMatrix[0].xyz);
  vRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vUp    = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vFwd   = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  vQ = position.xy*2.0;
  vSeed = aPuff.w;
  vNBig = normalize(c - aPuff.xyz + vec3(0.0,0.0001,0.0));
  vec3 wp = c + (vRight*position.x + vUp*position.y)*sz;
  vWpos = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp,1.0);
}\`;
const CLOUD_FRAG = \`
precision highp float;
\${GLSL_NOISE}
\${GLSL_SKY}
uniform vec3 uCloudLit, uCloudDark;
uniform float uOpacity, uLightUp, uFogD;
varying vec2 vQ; varying float vSeed;
varying vec3 vWpos, vNBig, vRight, vUp, vFwd;
void main(){
  /* Wider than tall, and the radius is pushed around by four octaves of noise:
     a clean circular falloff reads as camera bokeh no matter how it is shaded. */
  vec2 q = vQ*vec2(1.0,1.16);
  float r = length(q);
  if (r > 1.30) discard;
  float n = fb4(vec3(q*2.35, vSeed*13.0));
  float w = fb2(vec3(q*0.85 + 5.0, vSeed*7.0));
  float d = smoothstep(1.00, 0.58, r*(0.46 + n*0.98 + w*0.22));
  if (d <= 0.006) discard;

  vec3 nView  = vec3(vQ, sqrt(max(0.0, 1.0 - min(r*r,1.0))));
  vec3 nWorld = normalize(vRight*nView.x + vUp*nView.y + vFwd*nView.z);
  vec3 nrm    = normalize(mix(vNBig, nWorld, 0.48));

  vec3 L = normalize(uSunDir);
  float sun = dot(nrm, L)*0.5 + 0.5;
  vec3 col = mix(uCloudDark, uCloudLit, pow(sun, 1.15));

  vec3 V = normalize(vWpos - cameraPosition);
  float fs = pow(max(dot(V, L), 0.0), 7.0);
  col += uCloudLit * fs * 0.42 * (1.0 - d);      /* silver lining through thin edges */

  float dist = length(vWpos - cameraPosition);
  float fd = max(dist-2.5,0.0);
  col = mix(col, skyColor(V), 1.0-exp(-uFogD*fd*fd));

  gl_FragColor = vec4(col*uLightUp, d*uOpacity);
}\`;

const cloudMat = new THREE.ShaderMaterial({
  uniforms: Object.assign(THREE.UniformsUtils.clone(skyUniforms), {
    uCloudLit :{value:new THREE.Vector3()},
    uCloudDark:{value:new THREE.Vector3()},
    uOpacity:{value:0.55}, uLightUp:{value:0}, uFogD:{value:0.00030}
  }),
  vertexShader:CLOUD_VERT, fragmentShader:CLOUD_FRAG,
  transparent:true, depthWrite:false, side:THREE.DoubleSide
});

let cloudMesh=null, cloudPuffs=[], cloudClusters=[];
function buildClouds(small){
  const rr=mulberry(9081);
  const puffs=[], clusters=[];
  const addCluster=(cx,cy,cz,spread,n,dome0,rlo,rhi,driftAmp)=>{
    const ci=clusters.length;
    clusters.push({cx,cy,cz,ph:rr()*6.28,drift:0.5+rr()*0.9,amp:driftAmp});
    for(let k=0;k<n;k++){
      const dome=k>n*dome0, a2=rr()*Math.PI*2;
      const rad2=spread*(dome?0.05+rr()*0.42:0.24+rr()*0.74);
      puffs.push({
        ci,
        ox: Math.cos(a2)*rad2,
        oy: spread*(dome?0.17+rr()*0.38:rr()*0.12),
        oz: Math.sin(a2)*rad2*0.86,
        r: spread*(dome?rlo:rlo*1.18)*(1+rr()*rhi),
        seed: rr(), ph: rr()*6.28
      });
    }
  };
  /* Distant banks, spread through the view volume rather than on a ring — a
     ring puts most of them outside a 30-degree frustum. */
  const CLUSTERS = small?12:20;
  for(let i=0;i<CLUSTERS;i++){
    const deck = i < CLUSTERS*0.5;
    let cx=0, cy=0, cz=0;
    for(let tries=0;tries<24;tries++){
      cx = (rr()-0.5)*104;
      cz = -12 - rr()*62;
      cy = deck ? -10-rr()*16 : -2+rr()*18;
      if (Math.hypot(cx,cy,cz) > 26) break;
    }
    const spread = 7.0 + rr()*8.0;
    addCluster(cx,cy,cz,spread, small?18:(30+((rr()*12)|0)), 0.5, 0.26, 0.62, 1.8);
  }
  /* Flanking banks: close enough to sit beside the islands rather than behind
     everything.  Built from many small puffs, because at this range a large one
     reads as a lens disc — and they drift gently, since a cluster this small is
     shaded relative to its own centre. */
  /* solved from screen targets at the hero so they sit beside the islands in
     frame instead of 45 degrees off-axis where nothing can see them */
  const FLANK=[
    [-4.10,-2.30,-3.55, 2.7],[-2.60,-2.60,-1.90, 2.0],[-8.60, 0.40,-6.41, 3.2],
    [ 3.38, 0.34,-3.67, 2.5],[ 2.55,-1.70,-2.10, 2.0],[ 5.16,-1.13,-6.79, 3.0],
    [ 6.90, 1.05, 1.60, 2.6],[-6.40,-0.60, 2.10, 2.4]
  ];
  for(const F of FLANK) addCluster(F[0],F[1],F[2],F[3], small?28:46, 0.5, 0.19, 0.52, 0.30);

  const geo=new THREE.PlaneGeometry(1,1);
  cloudMesh=new THREE.InstancedMesh(geo, cloudMat, puffs.length);
  cloudMesh.frustumCulled=false;
  cloudMesh.geometry.setAttribute('aPuff',
    new THREE.InstancedBufferAttribute(new Float32Array(puffs.length*4),4));
  cloudPuffs=puffs; cloudClusters=clusters;
  scene.add(cloudMesh);
}
const _cm=new THREE.Matrix4();
function updateClouds(time){
  if(!cloudMesh) return;
  const cam=camera.position;
  /* the cluster drifts as one body — moving puffs independently by more than
     their own offset destroys the centre-relative normal they are shaded by */
  for(const c of cloudClusters){
    c.ax = c.cx + Math.sin(time*0.012*c.drift + c.ph)*c.amp;
    c.ay = c.cy + Math.sin(time*0.020*c.drift + c.ph*1.7)*c.amp*0.28;
    c.az = c.cz + Math.cos(time*0.010*c.drift + c.ph)*c.amp;
  }
  for(const p of cloudPuffs){
    const c=cloudClusters[p.ci];
    const j=c.amp*0.06;
    p.wx = c.ax + p.ox + Math.sin(time*0.35 + p.ph)*j;
    p.wy = c.ay + p.oy + Math.sin(time*0.28 + p.ph*1.4)*j*0.6;
    p.wz = c.az + p.oz + Math.cos(time*0.31 + p.ph)*j;
    const dx=p.wx-cam.x, dy=p.wy-cam.y, dz=p.wz-cam.z;
    p.d = dx*dx+dy*dy+dz*dz;
  }
  /* painter's order: a single InstancedMesh has no per-instance sorting, so the
     puffs are rewritten back-to-front every frame (a few hundred, it is free) */
  cloudPuffs.sort((a,b)=>b.d-a.d);
  const att=cloudMesh.geometry.getAttribute('aPuff');
  for(let i=0;i<cloudPuffs.length;i++){
    const p=cloudPuffs[i], c=cloudClusters[p.ci];
    _cm.makeScale(p.r,p.r,p.r);
    _cm.setPosition(p.wx,p.wy,p.wz);
    cloudMesh.setMatrixAt(i,_cm);
    att.array[i*4]=c.ax; att.array[i*4+1]=c.ay; att.array[i*4+2]=c.az; att.array[i*4+3]=p.seed;
  }
  cloudMesh.instanceMatrix.needsUpdate=true;
  att.needsUpdate=true;
}

/* ============================================================ leaf artwork */
function drawPlant(x, S, r, variant){
  /* one small ground plant, drawn in greyscale — the instance colour tints it */
  const leaflet=(cx,cy,rx,ry,rot,shade,point)=>{
    x.save(); x.translate(cx,cy); x.rotate(rot);
    const g=x.createRadialGradient(-rx*0.28,-ry*0.38,ry*0.08,0,0,Math.max(rx,ry)*1.05);
    const hi=Math.round(252*shade), md=Math.round(206*shade), lo=Math.round(150*shade);
    g.addColorStop(0,\`rgb(\${hi},\${hi},\${hi})\`);
    g.addColorStop(0.55,\`rgb(\${md},\${md},\${md})\`);
    g.addColorStop(1,\`rgb(\${lo},\${lo},\${lo})\`);
    x.fillStyle=g;
    x.beginPath();
    if(point){                       // lanceolate: a leaf with a tip
      x.moveTo(0,-ry);
      x.bezierCurveTo(rx,-ry*0.45, rx*0.92, ry*0.55, 0, ry);
      x.bezierCurveTo(-rx*0.92, ry*0.55, -rx,-ry*0.45, 0,-ry);
    } else {                         // obovate: rounded, notched at the tip
      x.ellipse(0,0,rx,ry,0,0,Math.PI*2);
    }
    x.fill();
    x.strokeStyle=\`rgba(\${Math.round(lo*0.42)},\${Math.round(lo*0.42)},\${Math.round(lo*0.42)},0.8)\`;
    x.lineWidth=1.5; x.stroke();
    if(!point){
      x.globalCompositeOperation='destination-out';
      x.beginPath(); x.ellipse(0,-ry*1.0,rx*0.34,ry*0.24,0,0,Math.PI*2); x.fill();
      x.globalCompositeOperation='source-over';
    }
    x.strokeStyle=\`rgba(\${Math.round(lo*0.6)},\${Math.round(lo*0.6)},\${Math.round(lo*0.6)},0.5)\`;
    x.lineWidth=1.1; x.beginPath(); x.moveTo(0,ry*0.85); x.lineTo(0,-ry*0.7); x.stroke();
    x.restore();
  };
  const stem=(a,len,w,shade)=>{
    const sh=Math.round(168*shade);
    x.strokeStyle=\`rgb(\${sh},\${sh},\${sh})\`; x.lineWidth=w; x.lineCap='round';
    x.beginPath(); x.moveTo(S*0.5,S*0.99);
    x.quadraticCurveTo(S*0.5+Math.sin(a)*len*0.30, S*(0.99-len/S*0.55),
                       S*0.5+Math.sin(a)*len, S*0.99-Math.cos(a)*len);
    x.stroke();
  };
  const cfg = [
    {n:6, rad:[17,10], spread:2.30, dist:[46,26], point:false, base:0.84},  // clover mat
    {n:4, rad:[13,20], spread:1.75, dist:[40,34], point:true,  base:0.80},  // upright sprigs
    {n:8, rad:[13,7],  spread:2.55, dist:[40,22], point:false, base:0.86},  // tight rosette
    {n:3, rad:[22,15], spread:1.35, dist:[34,26], point:false, base:0.78}   // few big leaves
  ][variant];
  for(let pass=0;pass<2;pass++){
    const N=pass?cfg.n:Math.max(2,cfg.n-2);
    for(let i=0;i<N;i++){
      const a=(-0.5+(N===1?0.5:i/(N-1)))*cfg.spread + (r()-0.5)*0.22;
      const dist=(pass?cfg.dist[0]:cfg.dist[0]*0.72)+r()*cfg.dist[1];
      const cx=S*0.5+Math.sin(a)*dist;
      const cy=S*0.86-Math.cos(a)*dist*1.04;
      const rx=cfg.rad[0]*(0.78+r()*0.46), ry=cfg.rad[1]*(0.78+r()*0.5);
      if(pass) stem(a,dist*0.98,2.4+r()*1.6, 0.7+r()*0.3);
      leaflet(cx,cy,rx,ry,a*0.88+(r()-0.5)*0.34, pass?cfg.base*(0.86+r()*0.30):cfg.base*0.44, cfg.point);
    }
  }
}
function leafAtlas(){
  const T=256, S=T*2, c=document.createElement('canvas'); c.width=c.height=S;
  const x=c.getContext('2d');
  for(let v=0;v<4;v++){
    x.save();
    x.translate((v%2)*T,(v>>1)*T);
    x.beginPath(); x.rect(3,3,T-6,T-6); x.clip();
    x.translate(0,0);
    drawPlant(x,T,mulberry(1700+v*97),v);
    x.restore();
  }
  return c;
}
function grassCanvas(){
  const T=256, S=T*2, c=document.createElement('canvas'); c.width=c.height=S;
  const x=c.getContext('2d');
  for(let v=0;v<4;v++){
    const r=mulberry(3300+v*53);
    x.save(); x.translate((v%2)*T,(v>>1)*T);
    x.beginPath(); x.rect(2,2,T-4,T-4); x.clip();
    const n=4+v;
    for(let i=0;i<n;i++){
      const a=(r()-0.5)*1.15, h=T*(0.40+r()*0.40), w=1.9+r()*2.4;
      const bx=T*0.5+(r()-0.5)*34;
      const tx=bx+Math.sin(a)*h*0.5, ty=T-h;
      const sh=Math.round(150+r()*88);
      const g=x.createLinearGradient(bx,T,tx,ty);
      g.addColorStop(0,\`rgb(\${Math.round(sh*0.55)},\${Math.round(sh*0.55)},\${Math.round(sh*0.55)})\`);
      g.addColorStop(1,\`rgb(\${sh},\${sh},\${sh})\`);
      x.strokeStyle=g; x.lineWidth=w; x.lineCap='round';
      x.beginPath(); x.moveTo(bx,T);
      x.quadraticCurveTo(bx+Math.sin(a)*h*0.18, T-h*0.58, tx,ty);
      x.stroke();
    }
    x.restore();
  }
  return c;
}
function flowerCanvas(){
  const T=256, S=T*2, c=document.createElement('canvas'); c.width=c.height=S;
  const x=c.getContext('2d');
  for(let v=0;v<4;v++){
    const r=mulberry(900+v*31);
    x.save(); x.translate((v%2)*T,(v>>1)*T);
    const petals=4+v, R=T*0.13+r()*8;
    x.strokeStyle='rgb(126,138,104)'; x.lineWidth=4; x.lineCap='round';
    x.beginPath(); x.moveTo(T*0.5,T*0.55); x.lineTo(T*0.5,T); x.stroke();
    for(let i=0;i<petals;i++){
      const a=i/petals*Math.PI*2+r();
      x.save(); x.translate(T*0.5+Math.cos(a)*R,T*0.40+Math.sin(a)*R); x.rotate(a);
      x.fillStyle='rgb(252,250,242)'; x.beginPath(); x.ellipse(0,0,R*0.86,R*0.62,0,0,Math.PI*2); x.fill();
      x.restore();
    }
    x.fillStyle='rgb(236,214,126)'; x.beginPath(); x.arc(T*0.5,T*0.40,R*0.52,0,Math.PI*2); x.fill();
    x.restore();
  }
  return c;
}
function vineCanvas(){
  const W=192,H=384, c=document.createElement('canvas'); c.width=W; c.height=H;
  const x=c.getContext('2d'); const r=mulberry(6161);
  /* the stem must touch both ends so the tile repeats seamlessly down a strand */
  x.strokeStyle='rgb(150,150,150)'; x.lineWidth=5; x.lineCap='round';
  x.beginPath(); x.moveTo(W*0.5,-2);
  x.bezierCurveTo(W*0.5+16,H*0.30, W*0.5-16,H*0.68, W*0.5,H+2); x.stroke();
  const leaf=(cx,cy,rx,ry,rot,shade)=>{
    x.save(); x.translate(cx,cy); x.rotate(rot);
    const g=x.createLinearGradient(0,-ry,0,ry);
    const hi=Math.round(250*shade), lo=Math.round(150*shade);
    g.addColorStop(0,\`rgb(\${hi},\${hi},\${hi})\`); g.addColorStop(1,\`rgb(\${lo},\${lo},\${lo})\`);
    x.fillStyle=g;
    x.beginPath(); x.moveTo(0,-ry);
    x.bezierCurveTo(rx,-ry*0.35, rx*0.85, ry*0.6, 0, ry);
    x.bezierCurveTo(-rx*0.85, ry*0.6, -rx,-ry*0.35, 0,-ry);
    x.fill();
    x.strokeStyle=\`rgba(\${Math.round(lo*0.45)},\${Math.round(lo*0.45)},\${Math.round(lo*0.45)},0.75)\`;
    x.lineWidth=1.4; x.stroke();
    x.restore();
  };
  for(let i=0;i<9;i++){
    const t=(i+0.5)/9, sideR=i%2===0;
    const sy=t*H;
    const sx=W*0.5 + Math.sin(t*Math.PI*2)*15;
    const dir=sideR?1:-1;
    leaf(sx+dir*(20+r()*16), sy+(r()-0.5)*16, 15+r()*8, 22+r()*11,
         dir*(0.75+r()*0.5), 0.72+r()*0.34);
  }
  return c;
}
function texFrom(canvas, repeatY){
  const t=new THREE.CanvasTexture(canvas);
  /* the sheet is a 2x2 atlas — deep mips would bleed one plant into its
     neighbour, so cap the chain and lean on anisotropy instead */
  t.minFilter=THREE.LinearMipmapLinearFilter; t.magFilter=THREE.LinearFilter;
  t.generateMipmaps=true; t.anisotropy=8;
  t.wrapS=THREE.ClampToEdgeWrapping;
  t.wrapT=repeatY?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;
  return t;
}
/* a tapering ribbon: the strand a vine hangs from */
function strandGeo(segs){
  const g=new THREE.BufferGeometry(), P=[],N=[],U=[],I=[];
  for(let i=0;i<=segs;i++){
    const v=i/segs, w=0.15*(1.0-0.50*v);
    P.push(-w,v,0,  w,v,0);
    N.push(0,0,1, 0,0,1);
    U.push(0,v, 1,v);
  }
  for(let i=0;i<segs;i++){ const a=i*2; I.push(a,a+1,a+3, a,a+3,a+2); }
  g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
  g.setIndex(I);
  return g;
}

/* ---------------------------------------------------- quad + crossed-quad geo */
function quadGeo(cross){
  const g=new THREE.BufferGeometry();
  const P=[],N=[],U=[],I=[];
  const push=(rot)=>{
    const s=Math.sin(rot),c=Math.cos(rot), base=P.length/3;
    // unit quad, pivot at the bottom-centre, +Y up
    const pts=[[-0.5,0,0],[0.5,0,0],[0.5,1,0],[-0.5,1,0]];
    const uv=[[0,0],[1,0],[1,1],[0,1]];
    for(let i=0;i<4;i++){
      const p=pts[i];
      P.push(p[0]*c, p[1], p[0]*s);
      N.push(-s,0,c);
      U.push(uv[i][0],uv[i][1]);
    }
    I.push(base,base+1,base+2, base,base+2,base+3);
  };
  push(0); if(cross) push(Math.PI/2);
  g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
  g.setIndex(I);
  return g;
}

/* ================================================================== SCATTER */
function buildScatter(geo, opts){
  const pos = geo.attributes.position.array;
  const nrm = geo.attributes.normal.array;
  const ao  = geo.attributes.aAO.array;
  const sh  = geo.attributes.aSh.array;
  const idx = geo.index.array;
  const triN = idx.length/3;

  // cumulative area table
  const cum = new Float64Array(triN);
  let total=0;
  for(let t=0;t<triN;t++){
    const a=idx[t*3]*3,b=idx[t*3+1]*3,c=idx[t*3+2]*3;
    const ux=pos[b]-pos[a], uy=pos[b+1]-pos[a+1], uz=pos[b+2]-pos[a+2];
    const vx=pos[c]-pos[a], vy=pos[c+1]-pos[a+1], vz=pos[c+2]-pos[a+2];
    const cx=uy*vz-uz*vy, cy=uz*vx-ux*vz, cz=ux*vy-uy*vx;
    total += 0.5*Math.hypot(cx,cy,cz);
    cum[t]=total;
  }
  const pick=(r)=>{ let lo=0,hi=triN-1; const target=r*total;
    while(lo<hi){ const m=(lo+hi)>>1; if(cum[m]<target) lo=m+1; else hi=m; } return lo; };

  const out=[];
  const rr=mulberry(opts.seed||7);
  const tries = opts.tries;
  for(let s=0;s<tries;s++){
    const t=pick(rr());
    let u=rr(), v=rr();
    if(u+v>1){ u=1-u; v=1-v; }
    const w=1-u-v;
    const a=idx[t*3],b=idx[t*3+1],c=idx[t*3+2];
    const px=pos[a*3]*w+pos[b*3]*u+pos[c*3]*v;
    const py=pos[a*3+1]*w+pos[b*3+1]*u+pos[c*3+1]*v;
    const pz=pos[a*3+2]*w+pos[b*3+2]*u+pos[c*3+2]*v;
    let nx=nrm[a*3]*w+nrm[b*3]*u+nrm[c*3]*v;
    let ny=nrm[a*3+1]*w+nrm[b*3+1]*u+nrm[c*3+1]*v;
    let nz=nrm[a*3+2]*w+nrm[b*3+2]*u+nrm[c*3+2]*v;
    const nl=Math.hypot(nx,ny,nz)||1; nx/=nl; ny/=nl; nz/=nl;
    const vao = ao[a]*w+ao[b]*u+ao[c]*v;
    const vsh = sh[a]*w+sh[b]*u+sh[c]*v;

    // -- where does it want to grow -------------------------------------
    const G = growth(px,py,pz,ny,vao);
    let m;
    if(opts.hang){
      /* vines want the lip and the flank, not the crown */
      const side = smoothstep(-0.92,-0.34,ny) * (1.0-smoothstep(0.18,0.52,ny));
      m = side * smoothstep(0.40,0.62,G.patch) * (0.24+0.76*vao)
              * (0.4+0.6*G.fine) * opts.density;
    } else {
      m = G.m*opts.density;
      if(opts.lo!==undefined) m *= smoothstep(opts.lo,opts.lo+0.22,G.m);
    }
    if(rr()>m) continue;
    out.push({x:px,y:py,z:pz,nx,ny,nz,ao:vao,sh:vsh,patch:G.patch,fine:G.fine,dens:G.m,ny});
    if(out.length>=opts.max) break;
  }
  return out;
}

const _q=new THREE.Quaternion(), _q2=new THREE.Quaternion(),
      _v=new THREE.Vector3(), _up=new THREE.Vector3(0,1,0),
      _m=new THREE.Matrix4(), _s=new THREE.Vector3(), _p=new THREE.Vector3();

function makeVegLayer(pts, srcGeo, tex, cfg){
  const n=pts.length;
  const geo=srcGeo.clone();
  const inst=new THREE.InstancedMesh(geo, new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(vegUniforms),
    vertexShader:VEG_VERT, fragmentShader:VEG_FRAG,
    side:THREE.DoubleSide, transparent:false
  }), n);
  inst.material.uniforms.map.value=tex;
  if(cfg.wave) inst.material.uniforms.uWave.value=cfg.wave;
  if(cfg.tileScale) inst.material.uniforms.uTileScale.value.set(cfg.tileScale[0],cfg.tileScale[1]);
  PAINTED.push(inst.material.uniforms);
  paint(inst.material.uniforms);
  const cols=new Float32Array(n*3), rands=new Float32Array(n*3), nrms=new Float32Array(n*3),
        tiles=new Float32Array(n*2);
  const rr=mulberry(cfg.seed);
  for(let i=0;i<n;i++){
    const P=pts[i];
    _v.set(P.nx,P.ny,P.nz);
    if(cfg.hang){ _v.y-=1.85; _v.normalize(); }        // drape over the lip
    // tilt away from the surface normal a little, then spin about it
    const tilt=cfg.tilt*(0.35+rr()*0.65);
    const ax=new THREE.Vector3(rr()-0.5,rr()-0.5,rr()-0.5).normalize();
    _q.setFromUnitVectors(_up,_v);
    _q2.setFromAxisAngle(ax,tilt);
    _q.premultiply(_q2);
    _q2.setFromAxisAngle(_v, rr()*Math.PI*2);
    _q.premultiply(_q2);
    const sc=cfg.size*(cfg.sv0+rr()*cfg.sv1)*(0.44+0.86*(P.dens===undefined?0.6:P.dens));
    _s.set(sc*(0.85+rr()*0.3),sc,sc);
    const lf=cfg.lift+sc*(rr()*0.22-0.06);          // clumps sit at different heights
    _p.set(P.x+P.nx*lf, P.y+P.ny*lf, P.z+P.nz*lf);
    _m.compose(_p,_q,_s);
    inst.setMatrixAt(i,_m);
    // colour: dark understorey → bright new growth, biased by exposure
    const t=clamp(P.fine*0.55 + P.patch*0.30 + P.ny*0.30 + (rr()-0.5)*0.22, 0, 1);
    const c=cfg.ramp(t, P);
    cols[i*3]=c[0]; cols[i*3+1]=c[1]; cols[i*3+2]=c[2];
    rands[i*3]=rr(); rands[i*3+1]=rr(); rands[i*3+2]=clamp(P.sh*0.75+P.ao*0.25,0,1);
    nrms[i*3]=P.nx; nrms[i*3+1]=P.ny; nrms[i*3+2]=P.nz;
    const tv=(rr()*4)|0; tiles[i*2]=(tv%2)*0.5; tiles[i*2+1]=(tv>>1)*0.5;
  }
  geo.setAttribute('aColor',new THREE.InstancedBufferAttribute(cols,3));
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rands,3));
  geo.setAttribute('aNrm',  new THREE.InstancedBufferAttribute(nrms,3));
  geo.setAttribute('aTile', new THREE.InstancedBufferAttribute(tiles,2));
  inst.instanceMatrix.needsUpdate=true;
  inst.frustumCulled=false;
  return inst;
}

/* ================================================================== SKY DOME */
const SKY_FRAG = \`
precision highp float;
\${GLSL_NOISE}
\${GLSL_SKY}
uniform float uLightUp, uSkyTime;
varying vec3 vDir;
/* one star per lattice cell, most cells empty */
float starField(vec3 d){
  vec3 p = d*230.0;
  vec3 i = floor(p), f = fract(p)-0.5;
  float h = h31(i);
  if (h < 0.9918) return 0.0;
  float tw = 0.45 + 0.55*sin(uSkyTime*1.9 + h*420.0);
  return smoothstep(0.26,0.0,length(f)) * tw * (0.45+0.55*fract(h*311.0));
}
void main(){
  vec3 d = normalize(vDir);
  vec3 c = skyColor(d);
  c += vec3(0.86,0.90,1.0) * starField(d) * uStars * smoothstep(-0.08,0.34,d.y) * 0.55;
  /* thin high cirrus, projected onto a plane above the camera */
  if (d.y > 0.035){
    vec2 uv = d.xz/d.y * 0.16 + vec2(uCloudDrift, uCloudDrift*0.42);
    float f = fb4(vec3(uv*1.35, 4.7));
    float cov = smoothstep(0.47,0.80,f) * smoothstep(0.035,0.42,d.y) * smoothstep(1.0,0.30,d.y);
    c = mix(c, uSunTint*0.92 + uMidSky*0.30, cov*0.55);
  }
  /* alpha is the bloom mask: only the sun's disc and its immediate glow are
     allowed to bleed, or a 2.0-linear sky would flood the whole frame */
  float sg = pow(max(dot(d, normalize(uSunDir)), 0.0), 42.0);
  gl_FragColor = vec4(c*uLightUp, clamp(sg,0.0,1.0)*0.85);
}\`;
const skyMat = new THREE.ShaderMaterial({
  uniforms: Object.assign(THREE.UniformsUtils.clone(skyUniforms), {uLightUp:{value:0}, uSkyTime:{value:0}}),
  vertexShader:\`varying vec3 vDir;
    void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:SKY_FRAG,
  side:THREE.BackSide, depthWrite:false, depthTest:false
});

/* ==================================================================== SCENE */
THREE.ColorManagement.legacyMode = true;

const canvas=document.getElementById('gl');
let renderer;
try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
}catch(err){
  /* no WebGL: keep the page readable rather than showing a dead canvas */
  document.body.classList.add('ready','nogl');
  document.getElementById('scan').style.display='none';
  document.getElementById('rail').style.display='none';
  canvas.style.display='none';
  document.querySelectorAll('h1 .ln b').forEach(b=>b.style.transform='translateY(0)');
  document.getElementById('spacer').style.height='0px';
  throw err;
}
renderer.outputEncoding=THREE.LinearEncoding;
renderer.toneMapping=THREE.NoToneMapping;
const INK_LIN=srgbToLinear(0x0F1F10);
const CLEAR_LIN=srgbToLinear(0x9FC4E4);
renderer.setClearColor(new THREE.Color(CLEAR_LIN.x,CLEAR_LIN.y,CLEAR_LIN.z),1);

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(30,1,0.02,80);

const skyDome=new THREE.Mesh(new THREE.SphereGeometry(46,48,28), skyMat);
skyDome.renderOrder=-1000; skyDome.frustumCulled=false; scene.add(skyDome);

const rockGroup=new THREE.Group();  scene.add(rockGroup);
const satGroup =new THREE.Group();  scene.add(satGroup);

/* light rig — the sun sits well off the camera axis so the rock is carved, and
   the ambient now comes out of the sky model rather than a green void */
const KEY_DIR=new THREE.Vector3(-0.44,0.62,0.65).normalize();
const FILL_DIR=new THREE.Vector3(0.72,-0.16,0.28).normalize();
const RIM_DIR=new THREE.Vector3(0.30,0.36,-0.88).normalize();
/* These are HDR linear values solved backwards through the tonemap + vignette so
   the sky lands on the intended screen colours; several exceed 1.0, which is
   why the bloom needs the alpha mask below rather than a brightness threshold. */
let SKY_GAIN=1.0;
const lin=(r,g,b)=>new THREE.Vector3(r,g,b);
const tint=(hex,mul)=>srgbToLinear(hex).multiplyScalar(mul);
/* Two complete worlds.  Every colour is linear and HDR; the sky anchors were
   solved backwards through the tonemap so each lands on an intended screen
   colour.  Everything on screen is a lerp between these two by NIGHT. */
const PAL_DAY = {
  zenith :lin(0.0218,0.1498,0.4953),   /* -> #2C6FB4 */
  mid    :lin(0.2724,0.6525,1.1597),   /* -> #7FB0D8 */
  horizon:lin(1.2554,1.7201,2.0628),   /* -> #C6DCEA */
  nadir  :lin(0.5173,0.7336,0.9156),   /* -> #A8BFCF */
  orb    :lin(1.60,1.32,0.86),
  key    :tint(0xFFF6E4,4.60),
  fill   :tint(0xAFCFEE,0.52),
  sky    :tint(0x86B6E2,0.72),
  gnd    :tint(0x9CB4C6,0.44),
  rim    :tint(0xFFEDC8,0.80),
  cloudL :lin(4.60,4.66,4.72),
  cloudD :lin(0.62,0.82,1.18),
  orbSize:260.0, orbGlow:0.22, stars:0.0
};
const PAL_NIGHT = {
  zenith :lin(0.0014,0.0028,0.0092),   /* -> #070E20 */
  mid    :lin(0.0039,0.0094,0.0308),   /* -> #12203D */
  horizon:lin(0.0164,0.0310,0.0788),   /* -> #2B3C5E */
  nadir  :lin(0.0059,0.0109,0.0278),   /* -> #18233A */
  orb    :lin(0.34,0.40,0.56),
  key    :tint(0xC9DCFF,0.62),
  fill   :tint(0x7C97C8,0.11),
  sky    :tint(0x33507F,0.17),
  gnd    :tint(0x1E2A44,0.10),
  rim    :tint(0xCFE0FF,0.26),
  cloudL :lin(0.052,0.066,0.104),
  cloudD :lin(0.0055,0.0090,0.0210),
  orbSize:1500.0, orbGlow:0.10, stars:1.0
};
let NIGHT=0, NIGHT_TARGET=0;
const _pa=new THREE.Vector3();
const mixP=(k,out)=>out.copy(PAL_DAY[k]).lerp(PAL_NIGHT[k],NIGHT);
const mixN=(k)=>PAL_DAY[k]+(PAL_NIGHT[k]-PAL_DAY[k])*NIGHT;

function paintSky(u){
  if(!u.uZenith) return;
  mixP('zenith',u.uZenith.value);
  mixP('mid',u.uMidSky.value);
  mixP('horizon',u.uHorizon.value);
  mixP('nadir',u.uNadir.value);
  mixP('orb',u.uSunTint.value);
  u.uSunDir.value.copy(KEY_DIR);
  u.uSkyGain.value=SKY_GAIN;
  if(u.uOrbSize) u.uOrbSize.value=mixN('orbSize');
  if(u.uOrbGlow) u.uOrbGlow.value=mixN('orbGlow');
  if(u.uStars)   u.uStars.value  =mixN('stars');
}
function paint(u){
  paintSky(u);
  /* the cloud material carries no light rig, so this has to come before the
     early-out below or the clouds render black */
  if(u.uCloudLit){ mixP('cloudL',u.uCloudLit.value); mixP('cloudD',u.uCloudDark.value); }
  if(!u.uKeyDir) return;
  u.uKeyDir.value.copy(KEY_DIR);
  u.uFillDir&&u.uFillDir.value.copy(FILL_DIR);
  u.uRimDir&&u.uRimDir.value.copy(RIM_DIR);
  mixP('key',u.uKeyCol.value);
  mixP('fill',u.uFillCol.value);
  mixP('sky',u.uSkyCol.value);
  mixP('gnd',u.uGndCol.value);
  u.uRimCol&&mixP('rim',u.uRimCol.value);
  mixP('horizon',u.uFog.value);
  if(u.uRockA){
    u.uRockA.value.copy(srgbToLinear(0x241B0B));
    u.uRockB.value.copy(srgbToLinear(0x8E7C44));
    u.uRockC.value.copy(srgbToLinear(0xE6DAAE));
    u.uLichen.value.copy(srgbToLinear(0x77873A));
    u.uSoil.value.copy(srgbToLinear(0x1F2A11));
  }
}
/* every material that carries a piece of the sky, repainted when NIGHT moves */
const PAINTED=[];
function repaintAll(){ PAINTED.forEach(u=>paint(u)); }

PAINTED.push(skyMat.uniforms, cloudMat.uniforms);
const rockMat=new THREE.ShaderMaterial({
  uniforms:THREE.UniformsUtils.clone(rockUniforms),
  vertexShader:ROCK_VERT, fragmentShader:ROCK_FRAG
});
const satMat=rockMat.clone(); satMat.uniforms.uTexScale.value=2.6;
PAINTED.push(rockMat.uniforms, satMat.uniforms);
repaintAll();

const ALL_UNIFORMS=[rockMat.uniforms, satMat.uniforms];

/* ================================================================ BUILD PASS */
const pctEl=document.getElementById('pct');
let progBase=0, progSpan=1;
/* build-time yield: a macrotask, not a frame — rAF can be throttled to a crawl
   in background/embedded contexts and would stretch the build to minutes. */
const _mc = (typeof MessageChannel!=='undefined') ? new MessageChannel() : null;
let _mcQ=[];
if(_mc) _mc.port1.onmessage=()=>{ const q=_mcQ; _mcQ=[]; q.forEach(fn=>fn()); };
function tick(){ return new Promise(r=>{ if(_mc){ _mcQ.push(r); _mc.port2.postMessage(0); } else setTimeout(r,0); }); }
function report(t){ const v=Math.round((progBase+clamp(t,0,1)*progSpan)*100); pctEl.textContent=v+'%'; }
function phase(base,span){ progBase=base; progSpan=span; }

async function makeField(N,LO,HI){
  const n1=N+1, f=new Float32Array(n1*n1*n1), dx=(HI-LO)/N;
  for(let k=0;k<n1;k++){
    const z=LO+k*dx;
    const kEdge = (k===0||k===N);
    for(let j=0;j<n1;j++){
      const y=LO+j*dx, o=(k*n1+j)*n1;
      const jEdge = kEdge||j===0||j===N;
      for(let i=0;i<n1;i++){
        if(jEdge||i===0||i===N){ f[o+i]=1; continue; }   // seal the box so the mesh closes
        const x=LO+i*dx;
        const b=sdfBase(x,y,z);
        f[o+i]=(b>BAND||b<-BAND)?b:b+sdfDetail(x,y,z);
      }
    }
    if((k&15)===0){ report(k/N); await tick(); }
  }
  return f;
}

async function shadeVerts(pos, withShadow){
  const nv=pos.length/3;
  const nrm=new Float32Array(nv*3), ao=new Float32Array(nv), sh=new Float32Array(nv),
        ms=new Float32Array(nv);
  const g=[0,0,0];
  for(let i=0;i<nv;i++){
    const x=pos[i*3],y=pos[i*3+1],z=pos[i*3+2];
    grad(x,y,z,0.0095,g);
    nrm[i*3]=g[0]; nrm[i*3+1]=g[1]; nrm[i*3+2]=g[2];
    ao[i]=ambientOcc(x,y,z,g[0],g[1],g[2]);
    sh[i]=withShadow?softShadow(x+g[0]*0.030,y+g[1]*0.030,z+g[2]*0.030,KEY_DIR.x,KEY_DIR.y,KEY_DIR.z)
                    :clamp(0.25+0.9*Math.max(g[0]*KEY_DIR.x+g[1]*KEY_DIR.y+g[2]*KEY_DIR.z,0),0,1);
    ms[i]=growth(x,y,z,g[1],ao[i]).m;
    if((i&4095)===0){ report(i/nv); await tick(); }
  }
  return {nrm,ao,sh,ms};
}

function fixWinding(pos,idx){
  let v=0;
  for(let t=0;t<idx.length;t+=3){
    const a=idx[t]*3,b=idx[t+1]*3,c=idx[t+2]*3;
    v += ( pos[a  ]*(pos[b+1]*pos[c+2]-pos[b+2]*pos[c+1])
         - pos[a+1]*(pos[b  ]*pos[c+2]-pos[b+2]*pos[c  ])
         + pos[a+2]*(pos[b  ]*pos[c+1]-pos[b+1]*pos[c  ]) )/6;
  }
  if(v<0) for(let t=0;t<idx.length;t+=3){ const q=idx[t+1]; idx[t+1]=idx[t+2]; idx[t+2]=q; }
  return v;
}
async function buildRock(N,LO,HI,withShadow,base,span){
  phase(base,span*0.40);
  const field=await makeField(N,LO,HI);
  const {pos,idx}=surfaceNets(N,LO,HI,field);
  fixWinding(pos,idx);
  phase(base+span*0.40, span*0.60);
  const {nrm,ao,sh,ms}=await shadeVerts(pos,withShadow);
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('normal',  new THREE.BufferAttribute(nrm,3));
  geo.setAttribute('aAO',     new THREE.BufferAttribute(ao,1));
  geo.setAttribute('aSh',     new THREE.BufferAttribute(sh,1));
  geo.setAttribute('aMoss',   new THREE.BufferAttribute(ms,1));
  geo.setIndex(new THREE.BufferAttribute(idx,1));
  geo.computeBoundingSphere();
  return geo;
}

/* vegetation colour ramps (linear albedo) */
const MOSS_D=srgbToLinear(0x2C3F12), MOSS_M=srgbToLinear(0x5F8622), MOSS_L=srgbToLinear(0x9BBB4A);
const MOSS_C=srgbToLinear(0x2E5227);   /* the cooler, bluer clumps that break it up */
const SPR_D =srgbToLinear(0x4E6F1E), SPR_L =srgbToLinear(0xA6C459);
const FLO   =srgbToLinear(0xEFEBD6);
function mix3(a,b,t){ return [a.x+(b.x-a.x)*t, a.y+(b.y-a.y)*t, a.z+(b.z-a.z)*t]; }
const rampMoss=(t,P)=>{
  const c = t<0.5 ? mix3(MOSS_D,MOSS_M,t*2) : mix3(MOSS_M,MOSS_L,(t-0.5)*2);
  const cool = smoothstep(0.62,0.30,P?P.patch:0.5)*0.55;   // patchwise hue drift
  return [ c[0]+(MOSS_C.x-c[0])*cool, c[1]+(MOSS_C.y-c[1])*cool, c[2]+(MOSS_C.z-c[2])*cool ];
};
const rampSpr =(t)=> mix3(SPR_D,SPR_L,t);
const VINE_D=srgbToLinear(0x37501A), VINE_L=srgbToLinear(0x8FB43F);
const rampVine=(t)=> mix3(VINE_D,VINE_L,0.25+t*0.75);
const rampFlo =()=>[FLO.x,FLO.y,FLO.z];

const leafTex=texFrom(leafAtlas()), grassTex=texFrom(grassCanvas()),
      floTex=texFrom(flowerCanvas()), vineTex=texFrom(vineCanvas(), true);
const GEO_Q=quadGeo(false), GEO_X=quadGeo(true), GEO_STRAND=strandGeo(9);

let mainRock=null, satRock=null, vegLayers=[];

async function build(){
  const vw = window.innerWidth || document.documentElement.clientWidth || 1440;
  const small = (vw>0 && vw<760) || (navigator.deviceMemory||8)<4
             || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const N=small?84:136;

  const geo=await buildRock(N,-1.30,1.30,true,0,0.62);
  mainRock=new THREE.Mesh(geo,rockMat);
  mainRock.frustumCulled=false;
  rockGroup.add(mainRock);

  phase(0.62,0.16);
  report(0.1);
  const mat  = buildScatter(geo,{tries: small?150000:560000, max: small?12000:34000, density:1.00, seed:11});
  const sprig= buildScatter(geo,{tries: small?50000:170000,  max: small?2800:8000,  density:0.52, seed:29, lo:0.26});
  const flow = buildScatter(geo,{tries: 90000, max: small?260:850, density:0.16, seed:53, lo:0.52});
  await tick(); report(0.6);

  const L1=makeVegLayer(mat,GEO_Q,leafTex,{seed:101,tilt:0.82,size:0.094,sv0:0.40,sv1:1.24,lift:0.002,ramp:rampMoss});
  const L2=makeVegLayer(sprig,GEO_X,grassTex,{seed:202,tilt:0.28,size:0.040,sv0:0.55,sv1:0.95,lift:0.002,ramp:rampSpr});
  const L3=makeVegLayer(flow,GEO_Q,floTex,{seed:303,tilt:0.30,size:0.034,sv0:0.6,sv1:0.8,lift:0.006,ramp:rampFlo});
  const vine = buildScatter(geo,{tries: small?70000:230000, max: small?300:820, density:0.50, seed:83, hang:true});
  const L4=makeVegLayer(vine,GEO_STRAND,vineTex,{seed:505,tilt:0.24,size:0.40,sv0:0.40,sv1:1.10,
      lift:0.004,ramp:rampVine,hang:true,wave:1.0,tileScale:[1.0,2.4]});
  /* tall growth on the crown, so the island reaches up as well as trails down */
  const tall = buildScatter(geo,{tries: small?50000:160000, max: small?750:2000, density:0.34, seed:127, lo:0.48});
  const L5=makeVegLayer(tall,GEO_X,grassTex,{seed:606,tilt:0.14,size:0.125,sv0:0.55,sv1:0.95,
      lift:0.002,ramp:rampSpr});
  vegLayers=[L1,L2,L3,L4,L5];
  vegLayers.forEach(l=>rockGroup.add(l));
  await tick();

  /* --- satellites: same field, coarse mesh, sparse growth ----------------- */
  const sgeo=await buildRock(small?38:52,-1.30,1.30,false,0.78,0.20);
  const spts=buildScatter(sgeo,{tries:80000,max:5200,density:1.5,seed:71});
  const S1=makeVegLayer(spts,GEO_Q,leafTex,{seed:404,tilt:0.60,size:0.115,sv0:0.5,sv1:1.0,lift:0.003,ramp:rampMoss});
  satRock=new THREE.Group();
  const sm=new THREE.Mesh(sgeo,satMat); sm.frustumCulled=false;
  satRock.add(sm); satRock.add(S1);
  vegLayers.push(S1);

  /* Placed by solving screen positions at the hero so none of them lands on the
     type, then held 2-3.5 units off the main island so the group reads as one
     drifting cluster rather than scattered debris. */
  const SATS=[
    {p:[ 1.97, 0.79,-0.69], s:0.28, r:[2.1,0.6,1.9], sp:-0.042},
    {p:[ 2.23,-0.43, 0.64], s:0.34, r:[1.6,1.1,2.8], sp:-0.062},
    {p:[ 2.48, 0.26, 1.54], s:0.30, r:[1.2,2.2,1.5], sp:-0.030},
    {p:[ 1.01, 1.53,-1.67], s:0.19, r:[0.7,2.1,0.6], sp:-0.052},
    {p:[-1.77,-0.90, 0.62], s:0.22, r:[0.4,0.9,2.2], sp:0.075},
    {p:[-2.96,-0.42,-0.50], s:0.18, r:[2.4,1.4,0.3], sp:-0.068}
  ];
  /* The camera flies through this cluster, so anything that would be clipped is
     pushed off the track before it ever renders. */
  const _tc=[0,0,0];
  function clearOfTrack(p, radius){
    const need = radius*1.15 + 0.85;
    for(let pass=0;pass<4;pass++){
      let bd=1e9, bx=0,by=0,bz=0;
      for(let i=0;i<=90;i++){
        track(i/90,'c',_tc,3);
        const dx=p[0]-_tc[0], dy=p[1]-_tc[1], dz=p[2]-_tc[2];
        const d=Math.hypot(dx,dy,dz);
        if(d<bd){ bd=d; bx=dx; by=dy; bz=dz; }
      }
      if(bd>=need) return bd;
      const l=Math.hypot(bx,by,bz)||1;
      const push=(need-bd)+0.06;
      p[0]+=bx/l*push; p[1]+=by/l*push; p[2]+=bz/l*push;
    }
    return null;
  }
  SATS.forEach((s,i)=>{
    clearOfTrack(s.p, s.s);
    const g=satRock.clone(true);
    g.position.set(s.p[0],s.p[1],s.p[2]);
    g.rotation.set(s.r[0],s.r[1],s.r[2]);
    g.scale.setScalar(s.s);
    g.userData={spin:s.sp, base:g.position.clone(), ph:i*1.7};
    satGroup.add(g);
  });
  buildClouds(small);
  phase(0.98,0.02); report(1);
  await tick();
}

/* ============================================================== CAMERA TRACK */
const KEYS=[
  {p:0.000, c:[ 0.91, 0.83, 6.76], t:[ 0.00, 0.02, 0.00], f:30},
  {p:0.140, c:[ 0.82, 0.77, 6.20], t:[ 0.00, 0.02, 0.00], f:30},
  {p:0.320, c:[ 0.50, 0.61, 5.42], t:[ 0.00, 0.00, 0.00], f:30},
  {p:0.480, c:[-0.06, 0.40, 4.98], t:[ 0.00,-0.02, 0.00], f:30},
  {p:0.620, c:[-1.35, 0.10, 3.68], t:[-0.04,-0.04, 0.02], f:31},
  {p:0.740, c:[-2.40,-0.42, 2.42], t:[-0.16,-0.10, 0.08], f:32},
  {p:0.830, c:[-2.68,-1.10, 1.42], t:[-0.42,-0.20, 0.24], f:34},
  {p:0.890, c:[-1.92,-0.97, 1.02], t:[-0.62,-0.31, 0.35], f:39},
  {p:0.930, c:[-1.36,-0.69, 0.73], t:[-0.58,-0.30, 0.32], f:44},
  {p:0.965, c:[-0.94,-0.48, 0.51], t:[-0.34,-0.17, 0.19], f:50},
  {p:0.985, c:[-0.66,-0.34, 0.36], t:[-0.12,-0.05, 0.06], f:54},
  {p:1.000, c:[-0.34,-0.17, 0.19], t:[ 0.18, 0.10,-0.12], f:58}
];
function seg(p){ let i=0; while(i<KEYS.length-2 && p>KEYS[i+1].p) i++; return i; }
function track(p, field, out, n){
  const i=seg(p), a=KEYS[i], b=KEYS[i+1];
  const dt=b.p-a.p, u=clamp((p-a.p)/dt,0,1), u2=u*u, u3=u2*u;
  const pm=KEYS[Math.max(i-1,0)], pn=KEYS[Math.min(i+2,KEYS.length-1)];
  const h00=2*u3-3*u2+1, h10=u3-2*u2+u, h01=-2*u3+3*u2, h11=u3-u2;
  for(let c=0;c<n;c++){
    const A=n===1?a[field]:a[field][c], B=n===1?b[field]:b[field][c];
    const M=n===1?pm[field]:pm[field][c], Nn=n===1?pn[field]:pn[field][c];
    const m0=(B-M)/(b.p-pm.p)*dt, m1=(Nn-A)/(pn.p-a.p)*dt;
    out[c]=h00*A+h10*m0+h01*B+h11*m1;
  }
}
const _cpos=[0,0,0], _ctgt=[0,0,0], _cfov=[0];
const camPos=new THREE.Vector3(), camTgt=new THREE.Vector3();

/* ================================================================ SMOOTH SCROLL */
const SCROLL_VH=5.6;
const spacer=document.getElementById('spacer');
let lockedVH=0;
function layoutScroll(){
  /* mobile browsers resize the viewport as the URL bar hides; re-deriving the
     scroll length from that would yank the reader's position mid-journey, so
     only the width is allowed to trigger a new measurement */
  if(!lockedVH || Math.abs(window.innerHeight-lockedVH)>window.innerHeight*0.28) lockedVH=window.innerHeight;
  spacer.style.height=Math.round(lockedVH*SCROLL_VH)+'px';
}
layoutScroll();
let rawP=0, smoothP=0;
function readScroll(){
  if(holdP!==null) return;
  const max=document.documentElement.scrollHeight-window.innerHeight;
  rawP = max>0 ? clamp(window.scrollY/max,0,1) : 0;
}
window.addEventListener('scroll',readScroll,{passive:true});
let holdP=null;
window.__jump=(v)=>{ holdP=(v===null?null:clamp(v,0,1)); if(holdP!==null){ rawP=holdP; smoothP=holdP; } };

/* pointer parallax */
let mx=0,my=0,smx=0,smy=0;
window.addEventListener('pointermove',e=>{
  mx=(e.clientX/window.innerWidth)*2-1;
  my=(e.clientY/window.innerHeight)*2-1;
},{passive:true});

/* ================================================================= POST STACK */
/* Hand-rolled: scene -> bright pass -> two separable blurs -> graded composite.
   UnrealBloomPass smeared a tile-shaped halo across the void on this hardware
   (and picked up colour fringing off the multisampled buffer), and four extra
   CDN bundles are a lot to carry for one glow. */
const QUAD_VERT = \`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }\`;

const brightMat = new THREE.ShaderMaterial({
  uniforms:{ tDiffuse:{value:null}, uThresh:{value:0.80}, uSoft:{value:0.55} },
  vertexShader:QUAD_VERT,
  fragmentShader:\`
  precision highp float; uniform sampler2D tDiffuse; uniform float uThresh,uSoft;
  varying vec2 vUv;
  void main(){
    vec4 t = texture2D(tDiffuse,vUv);
    float l = max(t.r,max(t.g,t.b));
    gl_FragColor = vec4(t.rgb*smoothstep(uThresh,uThresh+uSoft,l)*t.a, 1.0);
  }\`,
  depthTest:false, depthWrite:false
});
const blurMat = new THREE.ShaderMaterial({
  uniforms:{ tDiffuse:{value:null}, uDir:{value:new THREE.Vector2()} },
  vertexShader:QUAD_VERT,
  fragmentShader:\`
  precision highp float; uniform sampler2D tDiffuse; uniform vec2 uDir; varying vec2 vUv;
  void main(){
    vec3 s = texture2D(tDiffuse,vUv).rgb*0.2270270;
    s += (texture2D(tDiffuse,vUv+uDir*1.3846).rgb + texture2D(tDiffuse,vUv-uDir*1.3846).rgb)*0.3162162;
    s += (texture2D(tDiffuse,vUv+uDir*3.2308).rgb + texture2D(tDiffuse,vUv-uDir*3.2308).rgb)*0.0702703;
    gl_FragColor = vec4(s,1.0);
  }\`,
  depthTest:false, depthWrite:false
});
const finalMat = new THREE.ShaderMaterial({
  uniforms:{
    tScene:{value:null}, tBloom:{value:null},
    uBloom:{value:0.42}, uTime:{value:0}, uFade:{value:0},
    uInk:{value:new THREE.Vector3(0.043,0.086,0.145)},
    uVig:{value:0.34}, uGrain:{value:0.024}, uExp:{value:1.80}
  },
  vertexShader:QUAD_VERT,
  fragmentShader:\`
  precision highp float;
  uniform sampler2D tScene,tBloom;
  uniform float uBloom,uTime,uFade,uVig,uGrain,uExp;
  uniform vec3 uInk; varying vec2 vUv;
  vec3 tonemap(vec3 x){
    x*=uExp;
    float mx=max(x.r,max(x.g,x.b));
    return mix(x/(1.0+mx*0.72), x/(1.0+x), 0.34);
  }
  vec3 toSRGB(vec3 c){
    c=max(c,vec3(0.0));
    return mix(c*12.92, 1.055*pow(c,vec3(1.0/2.4))-0.055, step(vec3(0.0031308),c));
  }
  float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
  void main(){
    vec3 c = texture2D(tScene,vUv).rgb + texture2D(tBloom,vUv).rgb*uBloom;
    c = toSRGB(tonemap(c));
    vec2 q = vUv-0.5; q.x*=1.06;
    c *= clamp(1.0 - dot(q,q)*uVig, 0.0, 1.0);
    c = mix(c, uInk*(1.0-uFade*0.90), uFade);
    c += (hash12(gl_FragCoord.xy + vec2(uTime*61.7, uTime*37.3))-0.5)*uGrain*(1.0-0.6*uFade);
    gl_FragColor = vec4(c,1.0);
  }\`,
  depthTest:false, depthWrite:false
});

const fsQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), brightMat);
const fsScene = new THREE.Scene(); fsScene.add(fsQuad);
const fsCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);

let sceneRT=null, bloomA=null, bloomB=null;
const BLOOM_DIV = 4;
function buildTargets(w,h){
  [sceneRT,bloomA,bloomB].forEach(t=>t&&t.dispose());
  const base={ minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
               format:THREE.RGBAFormat, type:THREE.HalfFloatType, depthBuffer:true };
  sceneRT = new THREE.WebGLRenderTarget(w,h,Object.assign({},base,{
    samples: renderer.capabilities.isWebGL2 ? 4 : 0 }));
  const bw=Math.max(4,Math.round(w/BLOOM_DIV)), bh=Math.max(4,Math.round(h/BLOOM_DIV));
  bloomA = new THREE.WebGLRenderTarget(bw,bh,Object.assign({},base,{depthBuffer:false}));
  bloomB = new THREE.WebGLRenderTarget(bw,bh,Object.assign({},base,{depthBuffer:false}));
}
function blit(mat,target){
  fsQuad.material=mat;
  renderer.setRenderTarget(target);
  renderer.clear(true,true,false);
  renderer.render(fsScene,fsCam);
}
function renderFrame(){
  renderer.setRenderTarget(sceneRT);
  renderer.clear();
  renderer.render(scene,camera);

  brightMat.uniforms.tDiffuse.value = sceneRT.texture;
  blit(brightMat, bloomA);

  const bw=bloomA.width, bh=bloomA.height;
  for(let i=0;i<2;i++){
    const r = 1.0 + i*1.9;
    blurMat.uniforms.tDiffuse.value = bloomA.texture;
    blurMat.uniforms.uDir.value.set(r/bw, 0);
    blit(blurMat, bloomB);
    blurMat.uniforms.tDiffuse.value = bloomB.texture;
    blurMat.uniforms.uDir.value.set(0, r/bh);
    blit(blurMat, bloomA);
  }

  finalMat.uniforms.tScene.value = sceneRT.texture;
  finalMat.uniforms.tBloom.value = bloomA.texture;
  fsQuad.material = finalMat;
  renderer.setRenderTarget(null);
  renderer.render(fsScene,fsCam);
}

/* ==================================================================== SIZING */
let DPR_CAP=Math.min(window.devicePixelRatio||1,1.7);
let dprNow=DPR_CAP;
function resize(){
  const w=window.innerWidth, h=window.innerHeight;
  renderer.setPixelRatio(dprNow);
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
  const pw=Math.round(w*dprNow), ph=Math.round(h*dprNow);
  buildTargets(pw,ph);
  layoutScroll(); readScroll();
}
let lastW=window.innerWidth, resizeT=0;
window.addEventListener('resize',()=>{
  clearTimeout(resizeT);
  resizeT=setTimeout(()=>{
    if(window.innerWidth!==lastW){ lastW=window.innerWidth; lockedVH=0; }
    DPR_CAP=Math.min(window.devicePixelRatio||1,1.7);
    dprNow=Math.min(dprNow,DPR_CAP);
    resize();
  },140);
});

/* ======================================================================= UI */
const el=id=>document.getElementById(id);
const headerEl=document.querySelector('header'), heroEl=el('hero'), scanEl=el('scan'),
      scanBox=el('scanbox'), chipEl=el('chip'), readEl=el('readout'),
      cap1=el('cap1'), cap2=el('cap2'), outroEl=el('outro'), railFill=el('railfill'),
      hudLine=el('hudline');
const headFade=[...headerEl.children].filter(e=>e.id!=='mode');
const h1Lines=[...document.querySelectorAll('h1 .ln b')];

function fadeBand(p,a,b,c,d){ return smoothstep(a,b,p)*(1-smoothstep(c,d,p)); }
function setOpacity(node,o,ty,extra){
  node.style.opacity=o.toFixed(3);
  node.style.transform=(extra||'')+' translate3d(0,'+ty.toFixed(2)+'px,0)';
  node.style.visibility=o<0.004?'hidden':'visible';
}

const modeBtn=el('mode');
modeBtn.addEventListener('click',()=>{
  const toNight = NIGHT_TARGET<0.5;
  NIGHT_TARGET = toNight?1:0;
  document.body.classList.toggle('night', toNight);
  modeBtn.setAttribute('aria-pressed', String(toNight));
  modeBtn.setAttribute('aria-label', toNight?'Switch to daytime':'Switch to night');
});

const _proj=new THREE.Vector3(), _edge=new THREE.Vector3(), _right=new THREE.Vector3();
function setStage(p,dt,time){
  /* hero copy */
  const heroOut=smoothstep(0.045,0.20,p);
  heroEl.style.opacity=(1-heroOut).toFixed(3);
  heroEl.style.transform='translate3d(0,'+(-heroOut*70).toFixed(1)+'px,0)';
  heroEl.style.visibility=heroOut>0.996?'hidden':'visible';

  /* the header chrome scrolls away, but the day/night switch is a mode control
     and has to stay reachable for the whole journey */
  const navOut=smoothstep(0.16,0.30,p);
  for(let i=0;i<headFade.length;i++){
    const e=headFade[i];
    e.style.opacity=(1-navOut).toFixed(3);
    e.style.transform='translate3d(0,'+(-navOut*26).toFixed(1)+'px,0)';
    e.style.visibility=navOut>0.996?'hidden':'visible';
  }

  /* scan HUD tracks a point on the rock */
  const scanA=(1-smoothstep(0.20,0.30,p))*smoothstep(0.35,0.95,introT);
  scanEl.style.opacity=scanA.toFixed(3);
  scanEl.style.visibility=scanA<0.004?'hidden':'visible';
  if(scanA>0.004 && mainRock){
    _proj.set(0.06,0.06,0.26).applyMatrix4(rockGroup.matrixWorld).project(camera);
    const sx=(_proj.x*0.5+0.5)*window.innerWidth, sy=(-_proj.y*0.5+0.5)*window.innerHeight;
    /* size the reticle off the rock's own on-screen radius, not off distance */
    _edge.set(0.06,0.06,0.26).applyMatrix4(rockGroup.matrixWorld)
         .addScaledVector(_right.setFromMatrixColumn(camera.matrixWorld,0), 0.95).project(camera);
    const R = Math.abs((_edge.x-_proj.x)*0.5*window.innerWidth);
    const size=clamp(R*0.86,70,420);
    const hh=size*0.74;
    scanBox.style.left=sx+'px'; scanBox.style.top=sy+'px';
    scanBox.style.width=size+'px'; scanBox.style.height=hh+'px';
    scanBox.querySelector('.sweep').style.top=((REDUCED?0.5:0.5+0.5*Math.sin(time*1.15))*hh).toFixed(1)+'px';
    const lx=sx+size*0.5, ly=sy-hh*0.5, len=Math.max(44,size*0.34);
    hudLine.style.left=lx+'px'; hudLine.style.top=ly+'px'; hudLine.style.width=len+'px';
    hudLine.style.transform='rotate(-24deg)';
    const ax=lx+len*Math.cos(-0.4189), ay=ly+len*Math.sin(-0.4189);
    chipEl.style.left=ax+'px'; chipEl.style.top=(ay-9)+'px';
    readEl.style.left=ax+'px'; readEl.style.top=(ay+12)+'px';
  }

  const a1=fadeBand(p,0.33,0.42,0.50,0.575);
  setOpacity(cap1,a1,(1-a1)*26,'translateY(var(--capY))');
  const a2=fadeBand(p,0.60,0.675,0.745,0.80);
  setOpacity(cap2,a2,(1-a2)*26,'translateY(var(--capY))');

  const ao=smoothstep(0.955,0.995,p);
  outroEl.style.opacity=ao.toFixed(3);
  outroEl.style.transform='translate3d(0,'+((1-ao)*34).toFixed(1)+'px,0)';
  outroEl.style.visibility=ao<0.004?'hidden':'visible';

  railFill.style.height=(p*100).toFixed(2)+'%';
}

/* =================================================================== ANIMATE */
let introT=0, started=0, prev=performance.now()/1000, fpsAcc=0, fpsN=0;
const tmpV=new THREE.Vector3();

function animate(){
  requestAnimationFrame(animate);
  const now=performance.now()/1000;
  let dt=now-prev; prev=now;
  const rdt=dt; dt=Math.min(dt,0.05);
  const time=now-started;

  /* the whole palette is one number; ease it and repaint the materials */
  if(NIGHT!==NIGHT_TARGET){
    const k = REDUCED ? 1 : (1-Math.exp(-rdt/0.55));
    NIGHT += (NIGHT_TARGET-NIGHT)*k;
    if(Math.abs(NIGHT_TARGET-NIGHT)<0.0015) NIGHT=NIGHT_TARGET;
    repaintAll();
  }

  introT=clamp(introT+rdt/(REDUCED?0.35:1.9),0,1);
  const introE=easeInOut(introT);
  for(let i=0;i<h1Lines.length;i++){
    const u=clamp((introT-(0.10+i*0.070))/0.52,0,1);
    const e=1-Math.pow(1-u,3.4);
    h1Lines[i].style.transform='translateY('+((1-e)*105).toFixed(2)+'%)';
  }

  if(holdP!==null){ rawP=holdP; smoothP=holdP; }
  else smoothP += (rawP-smoothP)*(1-Math.exp(-rdt/(REDUCED?0.03:0.115)));
  const p=smoothP;

  /* camera */
  track(p,'c',_cpos,3); track(p,'t',_ctgt,3); track(p,'f',_cfov,1);
  camTgt.set(_ctgt[0],_ctgt[1],_ctgt[2]);
  camPos.set(_cpos[0],_cpos[1],_cpos[2]);
  const asp=window.innerWidth/window.innerHeight;
  let k=asp<1.62?clamp(Math.pow(1.62/asp,0.85),1,1.85):1;
  k=1+(k-1)*(1-smoothstep(0.72,0.94,p));
  camPos.sub(camTgt).multiplyScalar(k).add(camTgt);

  smx+=(mx-smx)*(1-Math.exp(-rdt/0.28));
  smy+=(my-smy)*(1-Math.exp(-rdt/0.28));
  const par=REDUCED?0:(1-smoothstep(0.55,0.85,p))*0.115;
  tmpV.copy(camPos).sub(camTgt);
  const rr=tmpV.length();
  tmpV.applyAxisAngle(new THREE.Vector3(0,1,0), -smx*par);
  tmpV.y += -smy*par*rr*0.42;
  tmpV.setLength(rr);
  camPos.copy(camTgt).add(tmpV);

  if(window.__camOverride){
    camPos.fromArray(window.__camOverride.p);
    camTgt.fromArray(window.__camOverride.t||[0,0,0]);
    if(window.__camOverride.f) _cfov[0]=window.__camOverride.f;
  }
  camera.position.copy(camPos);
  camera.lookAt(camTgt);
  camera.fov=_cfov[0];
  camera.updateProjectionMatrix();

  /* idle life */
  const idle=REDUCED?0:1;
  rockGroup.rotation.y=0.021*Math.sin(time*0.19)*idle;
  rockGroup.rotation.x=0.014*Math.sin(time*0.14+1.1)*idle;
  rockGroup.position.y=0.017*Math.sin(time*0.25)*idle;
  satGroup.children.forEach(g=>{
    const u=g.userData;
    g.rotation.y+=u.spin*dt*idle;
    g.rotation.x+=u.spin*dt*0.4*idle;
    g.position.y=u.base.y+Math.sin(time*0.32+u.ph)*0.10*idle;
    g.position.x=u.base.x+Math.sin(time*0.21+u.ph*1.7)*0.07*idle;
  });

  /* light / mood */
  const dive=smoothstep(0.68,0.93,p);
  const lift=introE;
  skyMat.uniforms.uLightUp.value=lift;
  cloudMat.uniforms.uLightUp.value=lift;
  updateClouds(REDUCED?0:time);
  skyMat.uniforms.uCloudDrift.value=time*0.0032;
  skyMat.uniforms.uSkyTime.value=REDUCED?0:time;
  skyDome.position.copy(camera.position);
  ALL_UNIFORMS.forEach(u=>{ u.uLightUp.value=lift; u.uUnderGlow.value=dive*0.30; });
  vegLayers.forEach(l=>{
    const u=l.material.uniforms;
    u.uTime.value=REDUCED?0:time; u.uLightUp.value=lift; u.uUnderGlow.value=dive*0.45;
  });

  finalMat.uniforms.uTime.value=REDUCED?0:time;
  finalMat.uniforms.uFade.value=smoothstep(0.955,1.0,p)*0.88;
  finalMat.uniforms.uBloom.value=0.34+dive*0.40;

  setStage(p,dt,time);
  renderFrame();


  /* adaptive resolution governor */
  if(rdt<0.2){ fpsAcc+=rdt; fpsN++; }
  if(fpsAcc>1.0 && fpsN>10){
    const avg=fpsAcc/fpsN;
    window.__fps=Math.round(1/avg);
    if(avg>0.0235 && dprNow>0.85){ dprNow=Math.max(0.85,dprNow-0.2); resize(); }
    else if(avg<0.0142 && dprNow<DPR_CAP){ dprNow=Math.min(DPR_CAP,dprNow+0.15); resize(); }
    fpsAcc=0; fpsN=0;
  }
}

/* Inspection API for tuning: __jump(p) pins the journey at a progress value
   (null releases it), __camOverride={p,t,f} pins the camera, __dbg exposes the
   scene graph plus probe() for reading the rendered palette back numerically. */
window.__dbg={
  scene, camera, renderer, rockGroup, satGroup, rockMat, satMat, THREE,
  finalMat, brightMat, targets:()=>({sceneRT,bloomA,bloomB}), frame:()=>renderFrame(),
  setSkyGain(v){ SKY_GAIN=v; [skyMat.uniforms].concat(ALL_UNIFORMS).concat(vegLayers.map(l=>l.material.uniforms)).forEach(paintSky); },
  rock:()=>mainRock, veg:()=>vegLayers,
  /* classify what is on screen: background / rock / green, with percentiles */
  probe(){
    renderFrame();                       // no preserveDrawingBuffer: read in-frame
    const c=document.createElement('canvas'); c.width=480; c.height=270;
    const x=c.getContext('2d',{willReadFrequently:true});
    x.drawImage(canvas,0,0,480,270);
    const d=x.getImageData(0,0,480,270).data;
    const rock=[],green=[],all=[];
    let bg=0;
    for(let i=0;i<d.length;i+=4){
      const r=d[i],g=d[i+1],b=d[i+2];
      const mx=Math.max(r,g,b), mn=Math.min(r,g,b);
      if(Math.abs(r-15)<9 && Math.abs(g-32)<10 && Math.abs(b-16)<9){ bg++; continue; }
      const L=0.2126*r+0.7152*g+0.0722*b;
      all.push(L);
      let h=0; const dl=mx-mn;
      if(dl<1) h=0;
      else if(mx===r) h=60*(((g-b)/dl)%6);
      else if(mx===g) h=60*(((b-r)/dl)+2);
      else h=60*(((r-g)/dl)+4);
      if(h<0)h+=360;
      const sat=mx===0?0:dl/mx;
      if(h>=64&&h<=170&&sat>0.28) green.push([r,g,b,L]); else rock.push([r,g,b,L]);
    }
    const pc=(arr,q)=>{ if(!arr.length) return null; const s2=arr.slice().sort((a,b)=>a[3]-b[3]);
      const v=s2[Math.min(s2.length-1,Math.floor(q/100*s2.length))];
      return '#'+[v[0],v[1],v[2]].map(n=>n.toString(16).padStart(2,'0')).join(''); };
    return { bgPct:+(bg/(480*270)*100).toFixed(1),
      rockPct:+(rock.length/(480*270)*100).toFixed(1),
      greenPct:+(green.length/(480*270)*100).toFixed(1),
      rockP:[10,30,50,70,90,98].map(q=>pc(rock,q)),
      greenP:[10,30,50,70,90,98].map(q=>pc(green,q)),
      lumP:[5,25,50,75,95].map(q=>{const s2=all.slice().sort((a,b)=>a-b);return all.length?Math.round(s2[Math.floor(q/100*s2.length)]):0;}) };
  }
};

/* ====================================================================== BOOT */
(async function boot(){
  resize();
  await tick();
  const t0=performance.now();
  try{ await build(); }catch(e){ console.error(e); pctEl.textContent='ERR'; }
  window.__buildMs=Math.round(performance.now()-t0);
  window.__stats={
    rockTris: mainRock? mainRock.geometry.index.count/3 : 0,
    rockVerts: mainRock? mainRock.geometry.attributes.position.count : 0,
    veg: vegLayers.map(l=>l.count)
  };
  await tick();
  document.body.classList.add('ready');
  started=performance.now()/1000; prev=started;

  readScroll();
  animate();
})();
<\/script>
</body>
</html>
`,R=`<script>
document.addEventListener("click", function (event) {
  const anchor = event.target && event.target.closest ? event.target.closest('a[href="#"]') : null;
  if (anchor) event.preventDefault();
});
<\/script>`,M=S.replace("</body>",`${R}${T}</body>`);function A(u){const[h,m]=w(u),{className:r="",style:f}=m,t=E(k,h),i=n.useRef(null),s=n.useRef(null),[v,g]=n.useState(()=>typeof document>"u"||!document.hidden),[x,b]=n.useState(!0),[o,l]=n.useState(!1);n.useEffect(()=>{const e=i.current;if(!e||typeof IntersectionObserver>"u")return;const c=new IntersectionObserver(([y])=>{b(y?.isIntersecting??!0)},{rootMargin:"80px"});return c.observe(e),()=>c.disconnect()},[]),n.useEffect(()=>{if(typeof document>"u")return;const e=()=>g(!document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]);const a=x&&v;return n.useEffect(()=>{l(!1)},[a]),n.useEffect(()=>{d(s.current,t)},[t]),p.jsx("div",{ref:i,className:`threeui-background skyfield-hero${r?` ${r}`:""}`,role:"group","aria-label":"Interactive Skyfield carbon survey hero","data-state":a?o?"ready":"loading":"paused",style:{background:"#07121e",pointerEvents:"auto",...f},children:a?p.jsx("iframe",{ref:s,title:"Skyfield — Terrane carbon survey hero",srcDoc:M,sandbox:"allow-scripts",loading:"eager",onLoad:e=>{d(e.currentTarget,t),l(!0)},style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#07121e",opacity:o?1:0,pointerEvents:o?"auto":"none",transition:"opacity 240ms ease-out"}}):null})}export{A as SkyfieldHero};
