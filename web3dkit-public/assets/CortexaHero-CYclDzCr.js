import{s as b,u as y,r as d,j as M,C as T}from"./index-fOQwe-l-.js";import{b as E,L as A}from"./LandingPages-plHUvg-e.js";import"./SylvaLivingWorldScene-OThUX2Jj.js";const C=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Cortexa — Every model you run, read as one figure</title>
<meta name="description" content="Cortexa — the reading that sits on top of every forecast you own.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%2305070c%27/%3E%3Cellipse cx=%2716%27 cy=%2715%27 rx=%278.2%27 ry=%279.2%27 fill=%27none%27 stroke=%27%2340cfff%27 stroke-width=%272.6%27/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=block" rel="stylesheet">
<style>
:root{
  --serif:'Instrument Serif',Georgia,'Times New Roman',serif;
  --ink:#ffffff;
  --muted:rgba(228,237,248,.72);
  --dim:#7f97ba;
  --dim-2:#6d86a8;
  --page:#000000;
  --pad:44px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{
  background:var(--page);
  color:var(--ink);
  font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  overflow:hidden;
}

/* ---------------------------------------------------------------- stage */
#stage{position:fixed;inset:0;overflow:hidden;z-index:0}
#gl{position:absolute;inset:0;width:100%;height:100%;display:block}
#veil{position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(128% 84% at 50% 44%, rgba(0,0,0,0) 40%, rgba(0,0,0,.34) 76%, rgba(0,0,0,.80) 100%);
}

/* ------------------------------------------------------------------ nav */
nav{
  position:fixed;left:0;right:0;top:0;height:92px;
  display:flex;align-items:center;
  padding:0 var(--pad);
  z-index:6;
}
.brand{
  display:flex;align-items:center;gap:11px;
  color:#f4f8fc;text-decoration:none;white-space:nowrap;
}
.brand svg{display:block;width:21px;height:26px;overflow:visible;opacity:.95}
.brand span{
  font-family:var(--serif);
  font-size:22px;font-weight:400;line-height:1;letter-spacing:.004em;
}

.navpill{
  position:absolute;left:50%;top:24px;transform:translateX(-50%);
  height:44px;display:flex;align-items:center;
  padding:0 6px;border-radius:999px;
  background:rgba(4,7,12,.72);
  border:1px solid rgba(160,196,236,.13);
  backdrop-filter:blur(14px) saturate(1.1);
  -webkit-backdrop-filter:blur(14px) saturate(1.1);
}
.navpill a{
  color:rgba(233,239,247,.72);text-decoration:none;
  font-size:14px;font-weight:400;line-height:1;letter-spacing:-.006em;
  padding:0 15px;white-space:nowrap;transition:color .2s ease;
}
.navpill a:hover{color:#fff}

.navcta{
  position:absolute;right:var(--pad);top:22px;
  height:40px;display:inline-flex;align-items:center;gap:9px;
  padding:0 18px;border-radius:999px;
  color:#eef3f9;
  background:rgba(10,13,19,.52);
  border:1px solid rgba(255,255,255,.16);
  backdrop-filter:blur(12px) saturate(1.1);
  -webkit-backdrop-filter:blur(12px) saturate(1.1);
  font-size:13.5px;font-weight:450;line-height:1;letter-spacing:-.008em;
  text-decoration:none;white-space:nowrap;
  transition:border-color .2s ease,transform .2s ease;
}
.navcta:hover{border-color:rgba(255,255,255,.34);transform:translateY(-1px)}
.ring{width:7px;height:7px;border-radius:50%;border:1.3px solid currentColor;
  flex:0 0 auto;opacity:.6}

/* ------------------------------------------------------- container lines */
.rails{
  position:fixed;top:0;bottom:0;left:50%;transform:translateX(-50%);
  width:calc(100vw - var(--pad)*2 + 44px);
  display:flex;justify-content:space-between;
  z-index:4;pointer-events:none;
}
.rail{
  position:relative;width:1px;flex:0 0 1px;align-self:stretch;
  background:linear-gradient(to bottom,
    rgba(255,255,255,0) 0%, rgba(214,234,250,.115) 9%,
    rgba(214,234,250,.115) 91%, rgba(255,255,255,0) 100%);
}
.rail::before,.rail::after{
  content:"";position:absolute;left:-2.5px;width:6px;height:6px;
  background:rgba(214,234,250,.42);
}
.rail::before{top:108px}
.rail::after{bottom:108px}

/* ----------------------------------------------------------------- hero */
.stage{position:fixed;inset:0;z-index:5;pointer-events:none}
.stage > *{pointer-events:auto}

h1{
  position:absolute;left:var(--pad);top:120px;
  font-family:var(--serif);
  font-size:60px;font-weight:400;line-height:63px;letter-spacing:-.004em;
  color:#fff;white-space:nowrap;
  text-shadow:0 0 42px rgba(2,10,22,.78), 0 2px 26px rgba(0,0,0,.5);
}
h1 .dim{color:var(--dim);display:block}

.lede{
  position:absolute;left:var(--pad);top:calc(50vh + 22px);width:344px;
  font-size:15px;font-weight:400;line-height:22px;letter-spacing:-.008em;
  color:var(--muted);
  text-shadow:0 0 10px rgba(2,8,18,.95), 0 0 26px rgba(0,6,14,.85);
}
.facts{
  position:absolute;right:var(--pad);top:calc(50vh + 22px);text-align:right;
  font-size:15px;font-weight:400;line-height:22px;letter-spacing:-.008em;
  color:var(--muted);
  text-shadow:0 0 10px rgba(2,8,18,.95), 0 0 26px rgba(0,6,14,.85);
}

.bigtag{
  position:absolute;right:var(--pad);bottom:44px;text-align:right;
  font-family:var(--serif);
  font-size:60px;font-weight:400;line-height:63px;letter-spacing:-.004em;
  color:#fff;white-space:nowrap;
  text-shadow:0 0 44px rgba(2,10,22,.9), 0 2px 30px rgba(0,0,0,.6);
}
.bigtag .dim{color:var(--dim-2);display:block}

.actions{position:absolute;left:var(--pad);bottom:48px;display:flex;align-items:center;gap:14px}
.btn{
  height:46px;border-radius:23px;
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  font-size:15px;font-weight:450;line-height:1;letter-spacing:-.008em;
  text-decoration:none;white-space:nowrap;
  transition:transform .22s cubic-bezier(.22,.7,.3,1), background .22s ease, border-color .22s ease;
}
.btn-solid{
  padding:0 21px;background:#f4f7fb;color:#0a0d12;
  box-shadow:0 10px 30px rgba(0,0,0,.42);
}
.btn-solid:hover{background:#fff;transform:translateY(-1.5px)}
.btn-ghost{
  padding:0 19px;color:#eef3f9;
  background:rgba(10,13,19,.52);
  border:1px solid rgba(255,255,255,.16);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
}
.btn-ghost:hover{border-color:rgba(255,255,255,.34);transform:translateY(-1.5px)}
.btn-ghost .arw{font-size:15px;opacity:.85;transform:translateY(.5px)}

a:focus-visible{outline:2px solid rgba(190,220,255,.78);outline-offset:3px;border-radius:999px}

/* ------------------------------------------------------------ responsive */
@media (max-width:1280px){
  h1{font-size:50px;line-height:53px;top:112px}
  .bigtag{font-size:50px;line-height:53px}
}
@media (max-width:1120px){
  .navpill{display:none}
  h1{font-size:44px;line-height:47px;top:106px}
  .bigtag{font-size:40px;line-height:43px;bottom:128px}
  .lede{top:auto;bottom:246px;width:min(320px,44vw)}
  .facts{top:auto;bottom:246px}
}
@media (max-width:820px){
  h1{font-size:36px;line-height:39px;top:96px;white-space:normal;max-width:56vw}
  .bigtag{font-size:31px;line-height:34px;bottom:142px}
  .lede{bottom:250px;width:min(280px,52vw);font-size:14px;line-height:20px}
  .facts{bottom:250px;font-size:14px;line-height:20px}
}
@media (max-width:620px){
  :root{--pad:22px}
  nav{height:76px}
  .navcta{display:none}
  .facts{display:none}
  h1{font-size:31px;line-height:34px;top:82px;max-width:none}
  .lede{top:172px;bottom:auto;width:min(320px,86vw);font-size:13.5px;line-height:19px}
  .bigtag{left:var(--pad);right:auto;text-align:left;font-size:25px;line-height:28px;bottom:122px}
  .actions{bottom:40px;gap:11px}
  .btn{height:42px;font-size:14px}
  .btn-solid{padding:0 17px} .btn-ghost{padding:0 15px}
  .rail::before{top:84px} .rail::after{bottom:84px}
}
@media (max-height:720px) and (min-width:820px){
  h1{font-size:42px;line-height:45px;top:92px}
  .bigtag{font-size:30px;line-height:33px;bottom:34px}
  .lede,.facts{top:auto;bottom:150px;font-size:13.5px;line-height:19px}
  .actions{bottom:34px}
  .rail::before{top:88px} .rail::after{bottom:88px}
}
@media (max-height:560px){
  h1{font-size:34px;line-height:37px;top:78px}
  .bigtag{font-size:25px;line-height:28px;bottom:30px}
  .lede,.facts{bottom:124px;font-size:13px;line-height:18px}
  .actions{bottom:30px}
}
</style>
</head>
<body>

<div id="stage">
  <canvas id="gl"></canvas>
  <div id="veil"></div>
</div>

<div class="rails" aria-hidden="true"><span class="rail"></span><span class="rail"></span></div>

<nav>
  <a class="brand" href="#">
    <svg viewBox="0 0 22 27" fill="none" aria-hidden="true">
      <ellipse cx="11" cy="11.6" rx="8.1" ry="10.1" stroke="currentColor" stroke-width="2.1"/>
      <path d="M2.2 21.6 H19.8" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
    </svg>
    <span>Cortexa</span>
  </a>
  <div class="navpill">
    <a href="#">Platform</a>
    <a href="#">Signals</a>
    <a href="#">Readings</a>
    <a href="#">Research</a>
    <a href="#">Pricing</a>
  </div>
  <a class="navcta" href="#">Draw a card <i class="ring"></i></a>
</nav>

<div class="stage">
  <h1>Every model you run,<span class="dim">read as one figure.</span></h1>

  <p class="lede">Nineteen forecasts reconciled into a single reading &mdash;<br>with every assumption still attached to it.</p>
  <p class="facts">One question, one card<br>Confidence always shown</p>

  <p class="bigtag"><span class="dim">Built for teams</span>who ask what's next.</p>

  <div class="actions">
    <a class="btn btn-solid" href="#">Book a demo <i class="ring"></i></a>
    <a class="btn btn-ghost" href="#">See a reading <span class="arw">&#8627;</span></a>
  </div>
</div>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
"use strict";
/* =====================================================================
   Cortexa — Arcana.  A companion document to the Cortexa hero: it keeps
   that page's drawing system exactly — the scan that crowds against the
   subject's own silhouette, the rim comb steered along the local contour
   normal, the lumpy dust volume with its moat, the volumetric haze wash,
   the dolly streaks and the five-level bloom composite — and replaces the
   subject.

   Here the subject is a tarot card standing face-on with an orrery run
   through it: three inclined orbits, their riders, and a core sitting on
   the card's own centre.  Everything is drawn out of one closed silhouette
   plus a depth profile, which is the same machinery the bust used; only
   the silhouette changed, from a skull to a rounded rectangle.
   ===================================================================== */

const CFG = {
  /* ---- framing ---- */
  CARD_HALF_W   : 0.196,      /* card half-width, in viewport heights    */
  CARD_CY       : 0.452,      /* card centre, fraction of vh from the top*/
  FOV           : 34,

  /* ---- card, in card half-widths ---- */
  CARD_ASPECT   : 1.709,      /* half-height / half-width (a real tarot) */
  CARD_R        : 0.155,      /* corner radius                           */
  CARD_T        : 0.056,      /* half-thickness                          */
  CARD_BEVEL    : 0.108,      /* how far in the edge rounds over         */
  COMB_REACH    : 1.05,       /* uniform depth of the comb teeth         */

  /* ---- scan resolution ---- */
  RINGS         : 132,
  TICK_PITCH    : 4.0/196.0,  /* comb pitch along the border             */

  /* ---- orrery ---- */
  ORBIT_SPEED   : 1.0,

  /* ---- dust ---- */
  DUST          : 94000,
  HAZE          : 1100,
  GAIN_HAZE     : 0.020,

  /* ---- point sizes (css px at dpr 1) ---- */
  PT_CARD       : 3.20,
  PT_INK        : 3.05,
  PT_ORBIT      : 3.10,
  PT_DUST       : 1.9,

  /* ---- exposure ---- */
  GAIN_CARD     : 1.34,
  GAIN_INK      : 0.86,
  GAIN_ORBIT    : 1.05,
  GAIN_DUST     : 0.55,

  /* ---- intro dolly: dist = D*(1 - A*exp(-t/TAU)) ---- */
  INTRO_A       : 0.955,
  INTRO_TAU     : 0.255,
  INTRO_LEN     : 2.6,

  /* ---- pointer: torch + extraction ---- */
  TORCH         : 0.50,
  TORCH_R       : 3.10,
  TORCH_DUST    : 1.05,
  TORCH_DUST_W  : 0.34,
  PULL          : 0.088,
  PULL_DUST     : 0.032,
  PULL_R        : 0.165,

  /* ---- bloom ---- */
  BLOOM_THRESH  : 0.55,
  AMBIENT       : 1.00,
  BLOOM_STRENGTH: 0.70,
};

try{
  new URLSearchParams(location.search).forEach((v,k)=>{
    if (k in CFG && typeof CFG[k] === 'number') CFG[k] = parseFloat(v);
  });
}catch(e){}

/* ---------------------------------------------------------------- utils */
const TAU = Math.PI * 2;
function mulberry(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0;
  let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }
const rnd = mulberry(20260824);

function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function sstep(a,b,x){ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); }

/* =====================================================================
   The silhouette.  The bust solved its outline analytically out of a
   measured profile table; a card is easier — a rounded rectangle, sampled
   off its signed distance so the same outlineR/outlineN pair works
   unchanged for any shape a later document cares to draw.
   ===================================================================== */
const HW = 1.0, HH = CFG.CARD_ASPECT;
function cardSDF(x,y){
  const bx = HW - CFG.CARD_R, by = HH - CFG.CARD_R;
  const qx = Math.abs(x) - bx, qy = Math.abs(y) - by;
  const ax = Math.max(qx,0), ay = Math.max(qy,0);
  return Math.hypot(ax,ay) + Math.min(Math.max(qx,qy),0) - CFG.CARD_R;
}
function raySDF(sdf, phi){
  const cx=Math.cos(phi), cy=Math.sin(phi);
  let lo=0, hi=6.0;
  for (let i=0;i<44;i++){ const m=(lo+hi)*0.5; if (sdf(cx*m, cy*m) < 0) lo=m; else hi=m; }
  return (lo+hi)*0.5;
}
const OUT_N = 1440;
const OUT_TAB = (function(){
  const t = new Float64Array(OUT_N+1);
  for (let i=0;i<=OUT_N;i++) t[i] = raySDF(cardSDF, i/OUT_N*TAU);
  return t;
})();
function outlineR(phi){
  let u = phi/TAU; u -= Math.floor(u);
  const x = u*OUT_N, i = Math.floor(x), f = x-i;
  return OUT_TAB[i]*(1-f) + OUT_TAB[i+1]*f;
}
const _n2=[0,0];
function outlineN(phi, out){
  const h=0.004;
  const r  = outlineR(phi);
  const rp = (outlineR(phi+h) - outlineR(phi-h))/(2*h);
  const tx = rp*Math.cos(phi) - r*Math.sin(phi);
  const ty = rp*Math.sin(phi) + r*Math.cos(phi);
  const l  = Math.hypot(tx,ty) || 1;
  out[0] =  ty/l; out[1] = -tx/l;
}
/* the point on the border closest to a screen angle, plus its outward
   normal — the ink layers all hang off this                              */
function borderAt(phi, inset, out){
  outlineN(phi, _n2);
  const R = outlineR(phi);
  out[0] = R*Math.cos(phi) - _n2[0]*inset;
  out[1] = R*Math.sin(phi) - _n2[1]*inset;
}

/* =====================================================================
   The scan.  Identical in spirit to the hero's headPoint: psi runs pole
   to pole, t = 1 - sin(psi) crowds the samples against the silhouette,
   and the tooth direction is steered from the contour normal at the rim
   back to radial deep inside so the pole stays a single point.  What
   changed is the depth: a card is a flat slab with a rounded edge, not a
   dome, so z holds at the full half-thickness and only rolls off inside
   CARD_BEVEL of the border.
   ===================================================================== */
function bevelZ(t){
  const e = CFG.CARD_BEVEL;
  if (t >= e) return 1;
  const k = 1 - t/e;
  return Math.sqrt(Math.max(0, 1 - k*k));
}
function cardPoint(psi, phi, out){
  const sp = Math.sin(psi), cp = Math.cos(psi);
  const t  = clamp(1 - sp, 0, 1);
  const R  = outlineR(phi);
  outlineN(phi, _n2);
  const wN = Math.exp(-Math.pow(t/0.30, 2));
  let ax = Math.cos(phi)*(1-wN) + _n2[0]*wN;
  let ay = Math.sin(phi)*(1-wN) + _n2[1]*wN;
  const al = Math.hypot(ax,ay) || 1; ax/=al; ay/=al;
  /* uniform tooth depth near the border, radial convergence at the pole */
  const s = CFG.COMB_REACH*t*(1-t) + R*t*t;
  out[0] = R*Math.cos(phi) - ax*s;
  out[1] = R*Math.sin(phi) - ay*s;
  out[2] = (cp >= 0 ? 1 : -1) * CFG.CARD_T * bevelZ(t);
}

/* central-difference normal of a parametric surface ------------------ */
const _a=[0,0,0], _b=[0,0,0], _c=[0,0,0], _d=[0,0,0];
function surfNormal(fn, s, t, ds, dt, out){
  fn(s-ds, t, _a); fn(s+ds, t, _b);
  fn(s, t-dt, _c); fn(s, t+dt, _d);
  const ux=_b[0]-_a[0], uy=_b[1]-_a[1], uz=_b[2]-_a[2];
  const vx=_d[0]-_c[0], vy=_d[1]-_c[1], vz=_d[2]-_c[2];
  let nx = uy*vz-uz*vy, ny = uz*vx-ux*vz, nz = ux*vy-uy*vx;
  const l = Math.hypot(nx,ny,nz) || 1;
  out[0]=nx/l; out[1]=ny/l; out[2]=nz/l;
}

/* =============================================================== build  */
/* Meridian angles solved from a density target, exactly as the hero does
   it, but the target here is flat: a card's border wants an even comb all
   the way round rather than the flank-heavy pitch a skull wants.        */
function buildMeridianTable(){
  const N = 4096, cum = new Float64Array(N+1);
  const h = 0.002;
  let acc = 0;
  for (let i=0;i<=N;i++){
    cum[i] = acc;
    if (i === N) break;
    const phi = (i+0.5)/N*TAU;
    const r  = outlineR(phi);
    const rp = (outlineR(phi+h) - outlineR(phi-h))/(2*h);
    acc += Math.hypot(r, rp)*(TAU/N);
  }
  const NM = Math.round(acc/CFG.TICK_PITCH/16)*16;
  const tab = new Float64Array(NM);
  let k = 0;
  for (let j=0;j<NM;j++){
    const want = acc*j/NM;
    while (k < N && cum[k+1] < want) k++;
    const t = (want - cum[k])/Math.max(1e-9, cum[k+1]-cum[k]);
    tab[j] = (k + t)/N*TAU;
  }
  return tab;
}
const PHI_TAB = buildMeridianTable();

function pack(pos,nor,seed,gain,centre,radius){
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('aNormal',  new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('aSeed',    new THREE.Float32BufferAttribute(seed,1));
  g.setAttribute('aGain',    new THREE.Float32BufferAttribute(gain,1));
  g.boundingSphere = new THREE.Sphere(centre || new THREE.Vector3(0,0,0), radius || 6);
  return g;
}

function buildCard(){
  const pos=[], nor=[], seed=[], gain=[];
  const p=[0,0,0], n=[0,0,0];
  const NR = CFG.RINGS, NM = PHI_TAB.length;
  const dpsi = Math.PI/NR;
  for (let i=0;i<NR;i++){
    const psi = (i+0.5)*dpsi;
    const s = Math.sin(psi);
    let step = 1, nm = NM;
    while (nm > 7 && nm > 6*NR*s && (nm % 2) === 0){ nm >>= 1; step <<= 1; }
    for (let j=0;j<nm;j++){
      const phi = PHI_TAB[j*step];
      cardPoint(psi, phi, p);
      surfNormal(cardPoint, psi, phi, 0.006, 0.004, n);
      pos.push(p[0],p[1],p[2]); nor.push(n[0],n[1],n[2]); seed.push(rnd());

      const t = clamp(1 - s, 0, 1);
      /* the face is dark by construction; this only decides how far the
         comb's skirt runs before it gives out                            */
      let g = 0.060 + 0.940*Math.exp(-Math.pow(t/0.082,2));
      const sy = Math.sin(phi), cx = Math.abs(Math.cos(phi));
      /* the long sides carry the light and the top edge catches it, the
         way a card held up to a lamp does                                */
      g *= 0.80 + 0.44*cx + 0.34*sstep(0.50,1.0,sy);
      g *= 1.0 - 0.26*sstep(0.55,1.0,-sy);
      if (Math.cos(psi) < 0) g *= 0.40;         /* the back of the card   */
      gain.push(g);
    }
  }
  return pack(pos,nor,seed,gain, new THREE.Vector3(0,0,0), 3.2);
}

/* ------------------------------------------------------------- the ink -
   Everything printed on the card face: two inset rules, the corner pips,
   the numeral, the title band, and the star field between them.  All of
   it is drawn with normals lying IN the card plane, so the shell shader's
   rim term treats it exactly like a piece of silhouette and it reads as
   the same scanned line the border does.                                */
const STROKE_FONT = {
  A:[[0,0,0.5,1],[0.5,1,1,0],[0.19,0.38,0.81,0.38]],
  E:[[0.88,1,0.10,1],[0.10,1,0.10,0],[0.10,0,0.88,0],[0.10,0.50,0.70,0.50]],
  G:[[0.95,0.80,0.72,0.98],[0.72,0.98,0.28,0.98],[0.28,0.98,0.05,0.72],[0.05,0.72,0.05,0.28],
     [0.05,0.28,0.28,0.02],[0.28,0.02,0.72,0.02],[0.72,0.02,0.95,0.22],[0.95,0.22,0.95,0.46],[0.95,0.46,0.58,0.46]],
  H:[[0.10,1,0.10,0],[0.90,1,0.90,0],[0.10,0.50,0.90,0.50]],
  I:[[0.50,1,0.50,0],[0.18,1,0.82,1],[0.18,0,0.82,0]],
  L:[[0.14,1,0.14,0],[0.14,0,0.88,0]],
  N:[[0.10,0,0.10,1],[0.10,1,0.90,0],[0.90,0,0.90,1]],
  S:[[0.92,0.84,0.70,0.99],[0.70,0.99,0.30,0.99],[0.30,0.99,0.08,0.80],[0.08,0.80,0.14,0.60],
     [0.14,0.60,0.78,0.42],[0.78,0.42,0.90,0.22],[0.90,0.22,0.68,0.02],[0.68,0.02,0.28,0.02],[0.28,0.02,0.06,0.16]],
  T:[[0.04,1,0.96,1],[0.50,1,0.50,0]],
  V:[[0.05,1,0.50,0],[0.50,0,0.95,1]],
  X:[[0.05,1,0.95,0],[0.95,1,0.05,0]],
  ' ':[]
};
const GLYPH_ADV = { I:0.62, T:0.94, ' ':0.52 };

/* An in-plane normal is exactly perpendicular to the view axis, which puts
   the shell shader's \`face\` term right on its own knee: lean the normal a
   few degrees toward the lens and the point is fully lit, a few degrees away
   and it is 28x darker.  Off-axis perspective supplies that lean, so a line
   drawn with one normal is bright on one side of the frame and black on the
   other.  Every ink point therefore ships twice, with n and -n, and the
   drawing reads the same wherever it lands.                               */
function inkPoint(P, x, y, z, nx, ny, g){
  for (const s of [1,-1]){
    P.pos.push(x, y, z);
    P.nor.push(nx*s, ny*s, 0);
    P.seed.push(rnd());
    P.gain.push(g*(0.72 + 0.56*rnd()));
  }
}
function inkSegment(P, x0,y0,x1,y1, z, pitch, g){
  const dx=x1-x0, dy=y1-y0;
  const len = Math.hypot(dx,dy);
  const n = Math.max(2, Math.round(len/pitch));
  const nx = -dy/(len||1), ny = dx/(len||1);   /* in-plane, across the run */
  for (let i=0;i<=n;i++){
    const f=i/n;
    inkPoint(P, x0+dx*f, y0+dy*f, z, nx, ny, g);
  }
}
function inkText(P, text, x, y, size, pitch, g, align){
  const adv = [];
  let total = 0;
  for (const ch of text){ const a = (GLYPH_ADV[ch] ?? 0.78)*size*1.34; adv.push(a); total += a; }
  let cx = align === 'center' ? x - total/2 : x;
  for (let i=0;i<text.length;i++){
    const strokes = STROKE_FONT[text[i]] || [];
    for (const s of strokes){
      inkSegment(P, cx + s[0]*size*0.78, y + s[1]*size,
                    cx + s[2]*size*0.78, y + s[3]*size, CFG.CARD_T*1.02, pitch, g);
    }
    cx += adv[i];
  }
}

function buildInk(){
  const P = {pos:[], nor:[], seed:[], gain:[]};
  const zf = CFG.CARD_T*1.02;

  /* two inset rules, the outer one heavier — a printed border           */
  for (const [inset, g, pitch] of [[0.135, 1.30, 0.0165],[0.183, 0.62, 0.0215]]){
    const steps = Math.round(TAU/0.0016);
    for (let i=0;i<steps;i++){
      const phi = i/steps*TAU;
      borderAt(phi, inset, _a);
      /* skip the sampling where the ray angle stretches the spacing —
         resample by arc length instead of angle                          */
      outlineN(phi, _n2);
      inkPoint(P, _a[0], _a[1], zf, _n2[0], _n2[1], g*0.92);
    }
  }

  /* corner pips: small diamonds sitting just inside the inner rule      */
  const px = HW - 0.30, py = HH - 0.30;
  for (const sx of [-1,1]) for (const sy of [-1,1]){
    const cx = sx*px, cy = sy*py, r = 0.052;
    inkSegment(P, cx, cy+r, cx+r, cy, zf, 0.011, 1.55);
    inkSegment(P, cx+r, cy, cx, cy-r, zf, 0.011, 1.55);
    inkSegment(P, cx, cy-r, cx-r, cy, zf, 0.011, 1.55);
    inkSegment(P, cx-r, cy, cx, cy+r, zf, 0.011, 1.55);
  }

  /* the numeral at the head of the card and the name at its foot        */
  inkText(P, 'XVII', 0, HH-0.430, 0.168, 0.0135, 1.55, 'center');
  inkText(P, 'THE SIGNAL', 0, -HH+0.305, 0.086, 0.0125, 1.30, 'center');

  /* a rule under the numeral and over the name                          */
  inkSegment(P, -0.30, HH-0.505, 0.30, HH-0.505, zf, 0.016, 0.85);
  inkSegment(P, -0.42, -HH+0.246, 0.42, -HH+0.246, zf, 0.016, 0.72);

  /* the star field printed across the middle of the card.  Rejected out
     of the band the orrery already owns, so the two never fight.        */
  for (let i=0;i<560;i++){
    const x = (rnd()*2-1)*(HW-0.245);
    const y = (rnd()*2-1)*(HH-0.70);
    if (Math.hypot(x, y*0.86) < 0.30) continue;
    const th = rnd()*TAU;
    inkPoint(P, x, y, zf, Math.cos(th), Math.sin(th), 0.13 + 1.05*Math.pow(rnd(), 3.0));
  }
  /* a dozen of them get a drawn cross flare                              */
  for (let i=0;i<8;i++){
    const x = (rnd()*2-1)*(HW-0.32);
    const y = (rnd()*2-1)*(HH-0.85);
    if (Math.hypot(x, y*0.86) < 0.42) continue;
    const r = 0.026 + rnd()*0.030;
    inkSegment(P, x-r, y, x+r, y, zf, 0.0105, 1.15);
    inkSegment(P, x, y-r, x, y+r, zf, 0.0105, 1.15);
  }

  return pack(P.pos,P.nor,P.seed,P.gain, new THREE.Vector3(0,0,0), 3.2);
}

/* ---------------------------------------------------------- the orrery -
   Three inclined orbits run through the card's own plane, so the card
   reads as a window cut into the system rather than a picture of it.
   Each ring is a thin tube: the tube's own normals sweep every direction,
   so the rim term paints its silhouette as two hairlines with a dark core
   — the same edge the card border gets, one order of magnitude smaller. */
const ORBITS = [
  { r:0.615, tube:0.0155, inc:1.06, node: 0.34, speed: 0.285, dash:0,  gain:1.00,
    riders:[ {a:0.00, s:0.062}, {a:2.35, s:0.040} ] },
  { r:0.960, tube:0.0125, inc:0.84, node:-0.62, speed: 0.192, dash:52, gain:0.86,
    riders:[ {a:1.15, s:0.052}, {a:4.05, s:0.031} ] },
  { r:1.345, tube:0.0105, inc:1.24, node: 1.16, speed:-0.126, dash:0,  gain:0.74,
    riders:[ {a:0.55, s:0.046}, {a:2.90, s:0.028}, {a:5.10, s:0.036} ] },
];

function buildTube(R, tube, dash, gain){
  const P = {pos:[], nor:[], seed:[], gain:[]};
  const along = Math.max(96, Math.round(TAU*R/0.0125));
  const around = 9;
  for (let i=0;i<along;i++){
    const s = i/along*TAU;
    const cs = Math.cos(s), sn = Math.sin(s);
    let dg = 1;
    if (dash) dg = (Math.sin(s*dash) > -0.15) ? 1 : 0.055;
    for (let j=0;j<around;j++){
      const w = (j + (i%2)*0.5)/around*TAU;
      const cw = Math.cos(w), sw = Math.sin(w);
      P.pos.push((R + tube*cw)*cs, (R + tube*cw)*sn, tube*sw);
      P.nor.push(cw*cs, cw*sn, sw);
      P.seed.push(rnd());
      P.gain.push(gain*dg*(0.60 + 0.80*rnd()));
    }
  }
  return pack(P.pos,P.nor,P.seed,P.gain, new THREE.Vector3(0,0,0), R+tube+0.1);
}

/* radial ticks on the outermost orbit — an astrolabe's degree ring      */
function buildTicks(R, gain){
  const P = {pos:[], nor:[], seed:[], gain:[]};
  for (let k=0;k<48;k++){
    const s = k/48*TAU;
    const len = (k%4===0) ? 0.070 : 0.036;
    const cs = Math.cos(s), sn = Math.sin(s);
    const n = Math.max(3, Math.round(len/0.011));
    for (let i=0;i<=n;i++){
      const rr = R + 0.020 + (i/n)*len;
      P.pos.push(rr*cs, rr*sn, 0);
      P.nor.push(-sn, cs, 0);
      P.seed.push(rnd());
      P.gain.push(gain*((k%4===0?1.35:0.80))*(0.62 + 0.72*rnd()));
    }
  }
  return pack(P.pos,P.nor,P.seed,P.gain, new THREE.Vector3(0,0,0), R+0.2);
}

/* a body: a shell of points on a sphere, densest where its own limb is  */
function buildBody(radius, gain, extra){
  const P = {pos:[], nor:[], seed:[], gain:[]};
  const NR = Math.max(18, Math.round(radius/0.0032));
  for (let i=0;i<NR;i++){
    const psi = (i+0.5)/NR*Math.PI;
    const s = Math.sin(psi), c = Math.cos(psi);
    const nm = Math.max(6, Math.round(NR*2*s));
    for (let j=0;j<nm;j++){
      const th = (j+ (i%2)*0.5)/nm*TAU;
      const nx = s*Math.cos(th), ny = s*Math.sin(th), nz = c;
      P.pos.push(nx*radius, ny*radius, nz*radius);
      P.nor.push(nx,ny,nz);
      P.seed.push(rnd());
      P.gain.push(gain*(0.55 + 0.90*rnd()));
    }
  }
  if (extra){
    for (let i=0;i<extra;i++){
      const th = rnd()*TAU, cz = rnd()*2-1, sc = Math.sqrt(Math.max(0,1-cz*cz));
      const t = 1.0 + Math.pow(rnd(),1.7)*1.5;
      const nx = sc*Math.cos(th), ny = sc*Math.sin(th), nz = cz;
      P.pos.push(nx*radius*t, ny*radius*t, nz*radius*t);
      P.nor.push(nx,ny,nz);
      P.seed.push(rnd());
      P.gain.push(gain*0.55*Math.exp(-Math.pow((t-1)/0.75,2))*(0.4+1.2*rnd()));
    }
  }
  return pack(P.pos,P.nor,P.seed,P.gain, new THREE.Vector3(0,0,0), radius*3);
}

/* --------------------------------------------------------------- dust  */
function hash3(x,y,z){
  let h = Math.sin(x*127.1 + y*311.7 + z*74.7)*43758.5453;
  return h - Math.floor(h);
}
function vnoise(x,y,z){
  const xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  const xf=x-xi, yf=y-yi, zf=z-zi;
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf), w=zf*zf*(3-2*zf);
  function g(i,j,k){ return hash3(xi+i, yi+j, zi+k); }
  const c00=g(0,0,0)*(1-u)+g(1,0,0)*u, c10=g(0,1,0)*(1-u)+g(1,1,0)*u;
  const c01=g(0,0,1)*(1-u)+g(1,0,1)*u, c11=g(0,1,1)*(1-u)+g(1,1,1)*u;
  const c0=c00*(1-v)+c10*v, c1=c01*(1-v)+c11*v;
  return c0*(1-w)+c1*w;
}
function fbm(x,y,z){
  let s=0, a=0.5, f=1;
  for (let i=0;i<4;i++){ s += a*vnoise(x*f,y*f,z*f); f*=2.07; a*=0.5; }
  return s;
}

const CAM_D = 1.0 / (CFG.CARD_HALF_W * 2 * Math.tan(CFG.FOV*Math.PI/360));
const CAM_Y = (CFG.CARD_CY - 0.5) * 2 * Math.tan(CFG.FOV*Math.PI/360) * CAM_D;
function hiddenByCard(x,y,z){
  if (z > CFG.CARD_T) return false;
  const sc = CAM_D/(CAM_D - z);
  const px = x*sc, py = CAM_Y + sc*(y - CAM_Y);
  return cardSDF(px, py) < 0.006;
}

function buildDust(){
  const N = CFG.DUST;
  const pos=new Float32Array(N*3), att=new Float32Array(N*3);

  function density(x,y,z){
    const big  = fbm(x*0.40+11.0, y*0.36-3.0, z*0.30+5.0);
    const mid  = fbm(x*1.15-6.0,  y*1.05+2.0, z*0.80-4.0);
    let d = 0.62*big + 0.38*mid;
    d = (d - 0.360)/0.36;
    return 0.070 + 0.930*Math.pow(Math.max(0, Math.min(1, d)), 1.35);
  }
  function envelope(x,y,z){
    let e = Math.exp(-Math.pow(x/2.55,2)) *
            Math.exp(-Math.pow((y+0.30)/2.95,2)) *
            Math.exp(-Math.pow((z+1.85)/3.10,2));
    /* the card is standing on a bed of light: a hot band along its foot */
    e *= 1.0 + 3.4*Math.exp(-Math.pow((y+HH+0.10)/0.66,2))*Math.exp(-Math.pow(x/2.30,2));
    /* and the orrery throws its own wash across the middle              */
    e *= 1.0 + 1.15*Math.exp(-Math.pow(Math.hypot(x,y)/1.55,2));
    return e;
  }
  function moat(x,y,z){
    const d = cardSDF(x,y);
    return 1.0 - 0.58*Math.exp(-Math.pow(d/0.34,2));
  }

  let i=0, guard=0;
  while (i<N && guard<N*160){
    guard++;
    const x = (rnd()*2-1)*5.4;
    const y = -3.5 + rnd()*6.8;
    const z = -6.2 + rnd()*7.8;
    if (hiddenByCard(x,y,z)) continue;
    const env = envelope(x,y,z);
    const d   = density(x,y,z);
    if (rnd() > Math.min(1, d*env*moat(x,y,z)*4.4)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    const star = Math.pow(rnd(),11.0);
    att[i*3]   = 0.085 + 0.86*Math.pow(d,1.20)*(0.35+0.65*env) + 0.80*star;
    att[i*3+1] = 0.36 + 0.68*Math.pow(rnd(),2.1) + 0.50*d + 1.3*star;
    att[i*3+2] = rnd();
    i++;
  }

  /* a fringe of loose motes clinging to the card's edge — the silhouette
     in the reference is never a clean cut                               */
  const HALO = Math.min(N-i, 5200);
  for (let k=0;k<HALO && i<N;k++){
    const phi = rnd()*TAU;
    const R = outlineR(phi);
    const t = 1.0 + Math.pow(rnd(),1.6)*0.30;
    const z = (rnd()*2-1)*0.55;
    const x = Math.cos(phi)*R*t, y = Math.sin(phi)*R*t;
    if (hiddenByCard(x,y,z)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    const w = Math.exp(-Math.pow((t-1.0)/0.16,2));
    att[i*3]   = 0.07 + 0.52*w*(0.4+0.6*rnd()) + 0.9*Math.pow(rnd(),10.0);
    att[i*3+1] = 0.38 + 0.70*Math.pow(rnd(),2.4);
    att[i*3+2] = rnd();
    i++;
  }

  /* the bed the card stands on: a wide, low spray under its foot        */
  const BED = Math.min(N-i, 15000);
  for (let k=0;k<BED && i<N;k++){
    const x = (rnd()*2-1)*3.4;
    const y = -HH - 0.02 - Math.pow(rnd(),1.5)*1.30;
    const z = -2.6 + rnd()*3.4;
    if (Math.abs(x) > 5.4) continue;
    if (hiddenByCard(x,y,z)) continue;
    const w = Math.exp(-Math.pow((y+HH+0.24)/0.52,2))*Math.exp(-Math.pow(x/1.95,2));
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    att[i*3]   = (0.09 + 1.55*w)*(0.45+0.55*rnd()) + 0.9*Math.pow(rnd(),9.0);
    att[i*3+1] = 0.42 + 0.95*Math.pow(rnd(),2.2);
    att[i*3+2] = rnd();
    i++;
  }

  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0,i*3),3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att.subarray(0,i*3),3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-1,-2), 15);
  return g;
}

function buildHaze(){
  const N = CFG.HAZE;
  const pos=new Float32Array(N*3), att=new Float32Array(N*3);
  let i=0, guard=0;
  while (i<N && guard<N*70){
    guard++;
    const x = (rnd()*2-1)*4.6;
    const y = -3.2 + rnd()*6.2;
    const z = -5.6 + rnd()*6.2;
    let e = Math.exp(-Math.pow(x/2.40,2)) *
            Math.exp(-Math.pow((y+0.35)/2.35,2)) *
            Math.exp(-Math.pow((z+1.8)/2.70,2));
    e *= 1.0 + 2.4*Math.exp(-Math.pow((y+HH+0.10)/0.72,2))*Math.exp(-Math.pow(x/1.95,2));
    e *= 1.0 - 0.52*Math.exp(-Math.pow(cardSDF(x,y)/0.36,2));
    const n = fbm(x*0.55-4.0, y*0.55+7.0, z*0.45-2.0);
    const k = Math.pow(Math.max(0.02, n-0.26)/0.74, 1.1);
    if (rnd() > Math.min(1, e*k*2.6)) continue;
    if (hiddenByCard(x,y,z)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    att[i*3]   = 0.16 + 1.0*k*e;
    att[i*3+1] = 46.0 + 105.0*Math.pow(rnd(),1.5);
    att[i*3+2] = rnd();
    i++;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0,i*3),3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att.subarray(0,i*3),3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-1,-2), 14);
  return g;
}

/* =========================================================== renderer   */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:false,
  powerPreference:'high-performance', stencil:false, depth:false});
renderer.setClearColor(0x000000, 1);
renderer.autoClear = false;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CFG.FOV, 1, 0.02, 90);

const subject = new THREE.Group();
scene.add(subject);

/* ------------------------------------------------------------ shaders  */
const SHELL_VS = \`
attribute vec3 aNormal;
attribute float aSeed;
attribute float aGain;
uniform float uSize, uCamD, uGain, uTime, uPix, uAlpha, uPlateau, uRimP;
uniform vec3  uLightV;
uniform float uTorch, uTorchR;
uniform vec2  uCur;
uniform float uCurR, uPull, uAspect;
varying float vI;
varying float vHot;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 N  = normalize(normalMatrix * aNormal);

  vec4 cp0 = projectionMatrix * mv;
  vec2 nd0 = cp0.xy / max(1e-4, cp0.w);
  float dc = length((nd0 - uCur) * vec2(uAspect, 1.0));
  float w  = exp(-(dc*dc)/(2.0*uCurR*uCurR));

  float jit = fract(aSeed*311.7);
  float amp = uPull * w * (0.30 + 1.45*jit)
            * (0.72 + 0.38*sin(uTime*2.3 + aSeed*61.0));
  mv.xyz += normalize(N*0.62 + vec3(0.0,0.0,1.0)*0.85) * amp;

  vec3 V  = normalize(-mv.xyz);
  float nv = dot(N, V);
  float rim  = clamp(1.0 - abs(nv), 0.0, 1.0);
  float face = mix(0.035, 1.0, smoothstep(-0.055, 0.095, nv));
  float I = (pow(rim, uRimP) + uPlateau) * face * aGain;
  float v = fract(aSeed*97.31);
  I *= 0.30 + 1.55*v*v;
  I *= 0.78 + 0.42 * (0.5 + 0.5*sin(uTime*0.85 + aSeed*43.7));

  vec3 Lv = uLightV - mv.xyz;
  float dl = length(Lv);
  float lam = max(0.0, dot(N, Lv/max(dl,1e-4)));
  float att = 1.0 / (1.0 + (dl*dl)/(uTorchR*uTorchR));
  I += uTorch * aGain * lam*lam * att * (0.45 + 0.9*v);

  I *= 1.0 + 2.1*w*uPull*6.0;

  float depth = max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.44 + 0.86*rim*rim + 1.1*w*uPull*6.0)
               * uPix * pow(clamp(uCamD/depth, 0.05, 9.0), 0.35);
  vI = I * uGain * uAlpha;
  vHot = w*uPull*6.0;
}\`;

const SHELL_FS = \`
precision highp float;
uniform vec3 uColA, uColB;
varying float vI;
varying float vHot;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d,d)*4.0;
  float a = pow(max(0.0, 1.0 - r2), 1.9);
  float e = vI * a;
  vec3 c = mix(uColA, uColB, clamp(e*2.4, 0.0, 1.0));
  c = mix(c, vec3(0.72,0.93,1.0), clamp(vHot*0.55, 0.0, 0.65));
  gl_FragColor = vec4(c * e, 1.0);
}\`;

const DUST_VS = \`
attribute vec3 aAtt;
uniform float uSize, uCamD, uGain, uTime, uPix, uAlpha;
uniform vec2  uCur;
uniform float uCurR, uPull, uAspect, uTorch, uTorchW;
varying float vI;
varying float vS;
varying float vHot;
void main(){
  vec3 p = position;
  float s = aAtt.z;
  p.x += 0.075*sin(uTime*0.13 + s*39.0);
  p.y += 0.062*sin(uTime*0.11 + s*57.0 + 1.7);
  p.z += 0.075*sin(uTime*0.09 + s*23.0 + 3.1);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  vec4 cp0 = projectionMatrix * mv;
  vec2 nd0 = cp0.xy / max(1e-4, cp0.w);
  vec2 off = (uCur - nd0) * vec2(uAspect, 1.0);
  float dc = length(off);
  float w  = exp(-(dc*dc)/(2.0*uCurR*uCurR));
  float wt = exp(-(dc*dc)/(2.0*uTorchW*uTorchW));
  vec2 tang = vec2(-off.y, off.x);
  float k = uPull * w * (0.35 + 1.2*fract(s*173.1));
  mv.xy += (off*0.55 + tang*1.25) * k;
  mv.z  += k*0.40;

  float depth = max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aAtt.y * (1.0 + 0.45*w*uPull*6.0)
               * uPix * pow(clamp(uCamD/depth, 0.05, 9.0), 0.55);
  float tw = 0.72 + 0.46*sin(uTime*0.9 + s*61.0);
  float hot = w*uPull*6.0;
  vI = aAtt.x * uGain * uAlpha * tw * (1.0 + 0.95*hot + uTorch*wt);
  vS = aAtt.y;
  vHot = hot;
}\`;

const DUST_FS = \`
precision highp float;
uniform vec3 uColA, uColB;
varying float vI;
varying float vS;
varying float vHot;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d,d)*4.0;
  float soft = mix(2.6, 1.35, clamp((vS-0.6)/1.6, 0.0, 1.0));
  float a = pow(max(0.0, 1.0 - r2), soft);
  float e = vI * a;
  vec3 c = mix(uColA, uColB, clamp(e*0.85, 0.0, 1.0));
  c = mix(c, vec3(0.66,0.90,1.0), clamp(vHot*0.45, 0.0, 0.55));
  gl_FragColor = vec4(c * e, 1.0);
}\`;

const STREAK_VS = \`
attribute float aEnd;
attribute vec3 aAtt;
uniform float uCamD, uGain, uStreak, uAlpha, uTime;
varying float vI;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec4 cp = projectionMatrix * mv;
  vec2 ndc = cp.xy / max(1e-4, cp.w);
  float k = 1.0 + uStreak * aEnd;
  ndc *= k;
  cp.xy = ndc * cp.w;
  gl_Position = cp;
  float fade = 1.0 / (1.0 + abs(uStreak)*3.0);
  vI = aAtt.x * uGain * uAlpha * fade * (1.0 - 0.75*aEnd);
}\`;
const STREAK_FS = \`
precision highp float;
uniform vec3 uColA;
varying float vI;
void main(){ gl_FragColor = vec4(uColA * vI, 1.0); }\`;

function shellMat(colA, colB, size, gain){
  return new THREE.ShaderMaterial({
    vertexShader:SHELL_VS, fragmentShader:SHELL_FS,
    uniforms:{ uSize:{value:size}, uCamD:{value:8}, uGain:{value:gain}, uTime:{value:0},
               uPix:{value:1}, uAlpha:{value:1}, uPlateau:{value:0.036}, uRimP:{value:4.2},
               uLightV:{value:new THREE.Vector3(0,0,6)}, uTorch:{value:0}, uTorchR:{value:3.4},
               uCur:{value:new THREE.Vector2(0,0)}, uCurR:{value:0.16}, uPull:{value:0},
               uAspect:{value:1.6},
               uColA:{value:new THREE.Color(colA)}, uColB:{value:new THREE.Color(colB)} },
    transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
  });
}

const cardMat  = shellMat(0x27466a, 0x33c7ff, CFG.PT_CARD, CFG.GAIN_CARD);
cardMat.uniforms.uPlateau.value = 0.130;
cardMat.uniforms.uRimP.value = 3.05;
const inkMat   = shellMat(0x2a4a6d, 0x46d0ff, CFG.PT_INK, CFG.GAIN_INK);
inkMat.uniforms.uPlateau.value = 0.075;
inkMat.uniforms.uRimP.value = 1.5;
const orbitMat = shellMat(0x25456a, 0x5fd8ff, CFG.PT_ORBIT, CFG.GAIN_ORBIT);
orbitMat.uniforms.uPlateau.value = 0.060;
orbitMat.uniforms.uRimP.value = 2.6;
const coreMat  = shellMat(0x2c5c86, 0x9de9ff, CFG.PT_ORBIT*1.10, CFG.GAIN_ORBIT*1.55);
coreMat.uniforms.uPlateau.value = 0.100;
coreMat.uniforms.uRimP.value = 2.0;

const dustMat = new THREE.ShaderMaterial({
  vertexShader:DUST_VS, fragmentShader:DUST_FS,
  uniforms:{ uSize:{value:CFG.PT_DUST}, uCamD:{value:8}, uGain:{value:CFG.GAIN_DUST},
             uTime:{value:0}, uPix:{value:1}, uAlpha:{value:1},
             uCur:{value:new THREE.Vector2(0,0)}, uCurR:{value:0.20}, uPull:{value:0},
             uAspect:{value:1.6}, uTorch:{value:0}, uTorchW:{value:0.34},
             uColA:{value:new THREE.Color(0x0a2f78)}, uColB:{value:new THREE.Color(0x9fddff)} },
  transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
});

const cardGeo = buildCard();
const inkGeo  = buildInk();
const dustGeo = buildDust();

const cardPts = new THREE.Points(cardGeo, cardMat);
const inkPts  = new THREE.Points(inkGeo, inkMat);
const dustPts = new THREE.Points(dustGeo, dustMat);
cardPts.frustumCulled = inkPts.frustumCulled = dustPts.frustumCulled = false;
subject.add(cardPts); subject.add(inkPts);
scene.add(dustPts);

/* the orrery: one group per orbit, holding its ring and a rider group
   whose only job is to spin.  Nothing integrates — the rider phase is
   read straight off t, so a seeked frame is identical to a played one. */
const orrery = new THREE.Group();
subject.add(orrery);
const riderGroups = [];
ORBITS.forEach((o, k) => {
  const g = new THREE.Group();
  g.rotation.set(o.inc, 0, o.node, 'ZXY');
  const ring = new THREE.Points(buildTube(o.r, o.tube, o.dash, o.gain), orbitMat);
  ring.frustumCulled = false;
  g.add(ring);
  if (k === 2){
    const ticks = new THREE.Points(buildTicks(o.r, o.gain*0.85), orbitMat);
    ticks.frustumCulled = false;
    g.add(ticks);
  }
  const rg = new THREE.Group();
  o.riders.forEach((r) => {
    const b = new THREE.Points(buildBody(r.s, 1.35, 260), coreMat);
    b.frustumCulled = false;
    b.position.set(o.r*Math.cos(r.a), o.r*Math.sin(r.a), 0);
    /* the rider is parked on the ring and carried round by rg           */
    const holder = new THREE.Group();
    holder.rotation.z = r.a;
    const inner = new THREE.Points(b.geometry, coreMat);
    inner.frustumCulled = false;
    inner.position.set(o.r, 0, 0);
    holder.add(inner);
    rg.add(holder);
  });
  g.add(rg);
  riderGroups.push({ group: rg, speed: o.speed });
  orrery.add(g);
});
const corePts = new THREE.Points(buildBody(0.108, 1.9, 1500), coreMat);
corePts.frustumCulled = false;
orrery.add(corePts);

const hazeMat = new THREE.ShaderMaterial({
  vertexShader:DUST_VS, fragmentShader:DUST_FS,
  uniforms:{ uSize:{value:1.0}, uCamD:{value:8}, uGain:{value:CFG.GAIN_HAZE},
             uTime:{value:0}, uPix:{value:1}, uAlpha:{value:1},
             uColA:{value:new THREE.Color(0x061c52)}, uColB:{value:new THREE.Color(0x2f9adf)} },
  transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
});
const hazePts = new THREE.Points(buildHaze(), hazeMat);
hazePts.frustumCulled = false;
scene.add(hazePts);

/* streak geometry: every Nth dust mote becomes a short radial line ----- */
function streakGeo(geo, stride){
  const src = geo.getAttribute('position'), sa = geo.getAttribute('aAtt');
  const n = Math.floor(src.count/stride);
  const pos = new Float32Array(n*6), end = new Float32Array(n*2), att = new Float32Array(n*6);
  for (let i=0;i<n;i++){
    const j = i*stride;
    for (let k=0;k<2;k++){
      pos[i*6+k*3+0]=src.getX(j); pos[i*6+k*3+1]=src.getY(j); pos[i*6+k*3+2]=src.getZ(j);
      att[i*6+k*3+0]=sa.getX(j);  att[i*6+k*3+1]=sa.getY(j);  att[i*6+k*3+2]=sa.getZ(j);
      end[i*2+k] = k;
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att,3));
  g.setAttribute('aEnd',     new THREE.BufferAttribute(end,1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-1,-2), 14);
  return g;
}
function streakMat(col, gain){
  return new THREE.ShaderMaterial({
    vertexShader:STREAK_VS, fragmentShader:STREAK_FS,
    uniforms:{ uCamD:{value:8}, uGain:{value:gain}, uStreak:{value:0}, uAlpha:{value:1},
               uTime:{value:0}, uColA:{value:new THREE.Color(col)} },
    transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
  });
}
const dustStreakMat = streakMat(0x2f9ce0, 0.15);
const dustStreaks = new THREE.LineSegments(streakGeo(dustGeo,4), dustStreakMat);
dustStreaks.frustumCulled = false; dustStreaks.visible = false;
scene.add(dustStreaks);

const cardStreakGeoSrc = (function(){
  const src = cardGeo.getAttribute('position');
  const keep = [];
  for (let i=0;i<src.count;i+=5) keep.push(i);
  const pos=new Float32Array(keep.length*3), att=new Float32Array(keep.length*3);
  for (let i=0;i<keep.length;i++){
    const j=keep[i];
    pos[i*3]=src.getX(j); pos[i*3+1]=src.getY(j); pos[i*3+2]=src.getZ(j);
    att[i*3]=1; att[i*3+1]=1; att[i*3+2]=0;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att,3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 4);
  return g;
})();
const cardStreakMat = streakMat(0x35b6f0, 0.085);
const cardStreaks = new THREE.LineSegments(streakGeo(cardStreakGeoSrc,1), cardStreakMat);
cardStreaks.frustumCulled = false; cardStreaks.visible = false;
subject.add(cardStreaks);

/* ======================================================== post chain    */
const quadGeo = new THREE.BufferGeometry();
quadGeo.setAttribute('position', new THREE.Float32BufferAttribute([-1,-1,0, 3,-1,0, -1,3,0],3));
quadGeo.setAttribute('uv',       new THREE.Float32BufferAttribute([0,0, 2,0, 0,2],2));
const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const quadScene = new THREE.Scene();
const quadMesh = new THREE.Mesh(quadGeo, null);
quadMesh.frustumCulled = false;
quadScene.add(quadMesh);
function blit(mat, target){
  quadMesh.material = mat;
  renderer.setRenderTarget(target || null);
  renderer.clear(true,false,false);
  renderer.render(quadScene, quadCam);
}

const rtOpts = { type: THREE.HalfFloatType, format: THREE.RGBAFormat,
  minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer:false, stencilBuffer:false };
let rtScene = new THREE.WebGLRenderTarget(2,2,rtOpts);
const LEVELS = 5;
let rtBright = new THREE.WebGLRenderTarget(2,2,rtOpts);
let rtA = [], rtB = [];
for (let i=0;i<LEVELS;i++){ rtA.push(new THREE.WebGLRenderTarget(2,2,rtOpts));
                            rtB.push(new THREE.WebGLRenderTarget(2,2,rtOpts)); }

const VS_QUAD = \`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }\`;

const brightMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD, uniforms:{ tDiffuse:{value:null}, uThresh:{value:CFG.BLOOM_THRESH} },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tDiffuse; uniform float uThresh;
  void main(){
    vec3 c = max(texture2D(tDiffuse, vUv).rgb, 0.0);
    c = min(c, vec3(64.0));
    float l = max(max(c.r,c.g), c.b);
    float k = clamp(max(l-uThresh, 0.0)/max(l, 1e-4), 0.0, 1.0);
    gl_FragColor = vec4(c*k, 1.0);
  }\`,
  depthTest:false, depthWrite:false
});

const blurMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD,
  uniforms:{ tDiffuse:{value:null}, uDir:{value:new THREE.Vector2(1,0)}, uTexel:{value:new THREE.Vector2()} },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tDiffuse; uniform vec2 uDir, uTexel;
  void main(){
    vec2 o = uDir*uTexel;
    vec3 s = texture2D(tDiffuse, vUv).rgb*0.2270270270;
    s += (texture2D(tDiffuse, vUv+o*1.3846153846).rgb + texture2D(tDiffuse, vUv-o*1.3846153846).rgb)*0.3162162162;
    s += (texture2D(tDiffuse, vUv+o*3.2307692308).rgb + texture2D(tDiffuse, vUv-o*3.2307692308).rgb)*0.0702702703;
    gl_FragColor = vec4(s,1.0);
  }\`,
  depthTest:false, depthWrite:false
});

const compMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD,
  uniforms:{
    tScene:{value:null}, tB0:{value:null}, tB1:{value:null}, tB2:{value:null},
    tB3:{value:null}, tB4:{value:null},
    uStrength:{value:CFG.BLOOM_STRENGTH}, uRes:{value:new THREE.Vector2()}, uTime:{value:0},
    uAmb:{value:CFG.AMBIENT}
  },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tScene, tB0, tB1, tB2, tB3, tB4;
  uniform float uStrength, uTime, uAmb; uniform vec2 uRes;
  vec3 aces(vec3 x){
    const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  void main(){
    vec3 base = max(texture2D(tScene, vUv).rgb, 0.0);
    vec3 bl = texture2D(tB0, vUv).rgb*0.10
            + texture2D(tB1, vUv).rgb*0.22
            + texture2D(tB2, vUv).rgb*0.44
            + texture2D(tB3, vUv).rgb*0.86
            + texture2D(tB4, vUv).rgb*1.30;
    vec3 col = base + max(bl, 0.0)*uStrength;
    col = aces(col*1.06);
    col = pow(max(col, 0.0), vec3(1.0/2.2));
    vec2 q = (vUv - vec2(0.5, 0.40)) * vec2(1.02, 1.38);
    col += vec3(0.004, 0.013, 0.034) * uAmb * exp(-dot(q,q)*2.7);
    float g = hash(gl_FragCoord.xy + fract(uTime)*137.0) - 0.5;
    col = clamp(col*(1.0 + g*0.055) + g*0.010, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }\`,
  depthTest:false, depthWrite:false
});

/* ============================================================== layout  */
let W=1, H=1, DPR=1;
let camDist = 8;
function layout(){
  W = window.innerWidth; H = window.innerHeight;
  DPR = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W, H, false);
  camera.aspect = W/H;

  const half = Math.tan(THREE.MathUtils.degToRad(CFG.FOV)/2);
  /* the card is keyed to viewport height, capped against width so the
     orrery's outer orbit never runs off a portrait screen              */
  const fit = Math.min(1, (W*1.62)/H);
  camDist = 1.0 / (CFG.CARD_HALF_W * fit * 2 * half);
  camera.updateProjectionMatrix();

  const yOff = (CFG.CARD_CY - 0.5) * 2 * half * camDist;
  camera.position.set(0, yOff, camDist);
  camera.lookAt(0, yOff, 0);

  const w = Math.max(2, Math.round(W*DPR)), h = Math.max(2, Math.round(H*DPR));
  rtScene.setSize(w,h);
  rtBright.setSize(Math.max(2,w>>1), Math.max(2,h>>1));
  for (let i=0;i<LEVELS;i++){
    const s = 1 << (i+1);
    rtA[i].setSize(Math.max(2,Math.round(w/s)), Math.max(2,Math.round(h/s)));
    rtB[i].setSize(Math.max(2,Math.round(w/s)), Math.max(2,Math.round(h/s)));
  }
  compMat.uniforms.uRes.value.set(w,h);
  for (const m of [cardMat, inkMat, orbitMat, coreMat, dustMat, hazeMat]) m.uniforms.uPix.value = DPR;
}
window.addEventListener('resize', layout);
layout();

/* =============================================================== loop   */
const mouse = {x:0, y:0, tx:0, ty:0, on:0, onT:0, has:false};
function setPointer(e){
  mouse.tx = (e.clientX/window.innerWidth  - 0.5)*2;
  mouse.ty = (e.clientY/window.innerHeight - 0.5)*2;
  mouse.onT = 1; mouse.has = true;
}
window.addEventListener('pointermove', setPointer, {passive:true});
window.addEventListener('pointerdown', setPointer, {passive:true});
window.addEventListener('pointerleave', ()=>{ mouse.onT = 0; });
window.addEventListener('blur', ()=>{ mouse.onT = 0; });

let t0 = performance.now()/1000;
let seekT = null;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const _lw = new THREE.Vector3(), _lv = new THREE.Vector3();

function introDist(t){
  const e = Math.exp(-t/CFG.INTRO_TAU);
  const k = 1 - CFG.INTRO_A*e;
  return camDist * Math.max(0.006, k);
}

function frame(tRaw){
  const t = REDUCED ? Math.max(tRaw, CFG.INTRO_LEN) : tRaw;
  const half = Math.tan(THREE.MathUtils.degToRad(CFG.FOV)/2);
  const yOff = (CFG.CARD_CY - 0.5) * 2 * half * camDist;

  const d = introDist(t);
  const dd = (CFG.INTRO_A/CFG.INTRO_TAU)*Math.exp(-t/CFG.INTRO_TAU) / Math.max(0.02, 1 - CFG.INTRO_A*Math.exp(-t/CFG.INTRO_TAU));
  const streak = Math.min(1.4, dd*0.075);

  const settle = Math.min(1, Math.max(0, (t-0.9)/1.4));
  const now = performance.now()/1000;
  const dt  = Math.min(0.05, Math.max(0.001, now - (frame._last || now - 1/60)));
  frame._last = now;
  const ease = 1 - Math.pow(0.0015, dt);
  mouse.x += (mouse.tx - mouse.x)*ease;
  mouse.y += (mouse.ty - mouse.y)*ease;
  mouse.on += (mouse.onT - mouse.on)*(1 - Math.pow(0.02, dt));

  camera.position.set(mouse.x*0.30*settle, yOff - mouse.y*0.18*settle, d);
  camera.lookAt(mouse.x*0.06*settle, yOff, 0);

  subject.rotation.y = Math.sin(t*0.11)*0.010 + mouse.x*0.150*settle;
  subject.rotation.x = Math.sin(t*0.09)*0.007 - mouse.y*0.082*settle;

  /* the orrery turns on its own clock, one revolution per orbit period */
  const spin = REDUCED ? 0.25 : 1.0;
  for (const r of riderGroups) r.group.rotation.z = t*r.speed*CFG.ORBIT_SPEED*spin;
  orrery.rotation.z = Math.sin(t*0.055)*0.030;

  const alpha = Math.min(1, t/0.30);
  for (const m of [cardMat, inkMat, orbitMat, coreMat, dustMat, hazeMat]){
    m.uniforms.uCamD.value = camDist;
    m.uniforms.uTime.value = t;
    m.uniforms.uAlpha.value = alpha;
  }

  const live = mouse.on * settle * alpha;
  const pullK = REDUCED ? 0.15 : 1.0;
  _lw.set(mouse.x*2.9, yOff*0.35 - mouse.y*2.3 + 0.15, 2.35);
  _lv.copy(_lw).applyMatrix4(camera.matrixWorldInverse);
  const curX = mouse.x, curY = -mouse.y;
  for (const m of [cardMat, inkMat, orbitMat, coreMat]){
    m.uniforms.uLightV.value.copy(_lv);
    m.uniforms.uTorch.value = CFG.TORCH * live;
    m.uniforms.uTorchR.value = CFG.TORCH_R;
    m.uniforms.uCur.value.set(curX, curY);
    m.uniforms.uCurR.value = CFG.PULL_R;
    m.uniforms.uPull.value = CFG.PULL * live * pullK;
    m.uniforms.uAspect.value = W/H;
  }
  dustMat.uniforms.uCur.value.set(curX, curY);
  dustMat.uniforms.uCurR.value = CFG.PULL_R*1.35;
  dustMat.uniforms.uPull.value = CFG.PULL_DUST * live * pullK;
  dustMat.uniforms.uAspect.value = W/H;
  dustMat.uniforms.uTorch.value = CFG.TORCH_DUST * live;
  dustMat.uniforms.uTorchW.value = CFG.TORCH_DUST_W;

  const hot = 1/(1 + streak*1.6);
  cardMat.uniforms.uGain.value  = CFG.GAIN_CARD*(0.80 + 0.20*hot);
  inkMat.uniforms.uGain.value   = CFG.GAIN_INK*(0.80 + 0.20*hot);
  orbitMat.uniforms.uGain.value = CFG.GAIN_ORBIT*(0.80 + 0.20*hot);
  coreMat.uniforms.uGain.value  = CFG.GAIN_ORBIT*1.55*(0.80 + 0.20*hot);
  dustMat.uniforms.uGain.value  = CFG.GAIN_DUST*hot;
  hazeMat.uniforms.uGain.value  = CFG.GAIN_HAZE*hot;

  const showStreak = streak > 0.012;
  dustStreaks.visible = cardStreaks.visible = showStreak;
  if (showStreak){
    dustStreakMat.uniforms.uStreak.value = streak;
    cardStreakMat.uniforms.uStreak.value = streak;
    dustStreakMat.uniforms.uAlpha.value = alpha;
    cardStreakMat.uniforms.uAlpha.value = alpha;
  }

  renderer.setRenderTarget(rtScene);
  renderer.clear(true,false,false);
  renderer.render(scene, camera);

  brightMat.uniforms.tDiffuse.value = rtScene.texture;
  blit(brightMat, rtBright);

  let src = rtBright;
  for (let i=0;i<LEVELS;i++){
    const w = rtA[i].width, h = rtA[i].height;
    blurMat.uniforms.tDiffuse.value = src.texture;
    blurMat.uniforms.uDir.value.set(1,0);
    blurMat.uniforms.uTexel.value.set(1/w, 1/h);
    blit(blurMat, rtB[i]);
    blurMat.uniforms.tDiffuse.value = rtB[i].texture;
    blurMat.uniforms.uDir.value.set(0,1);
    blit(blurMat, rtA[i]);
    src = rtA[i];
  }

  compMat.uniforms.tScene.value = rtScene.texture;
  compMat.uniforms.tB0.value = rtA[0].texture;
  compMat.uniforms.tB1.value = rtA[1].texture;
  compMat.uniforms.tB2.value = rtA[2].texture;
  compMat.uniforms.tB3.value = rtA[3].texture;
  compMat.uniforms.tB4.value = rtA[4].texture;
  compMat.uniforms.uTime.value = t;
  blit(compMat, null);
}

function tick(){
  requestAnimationFrame(tick);
  if (seekT !== null) return;
  frame(performance.now()/1000 - t0);
}
tick();

window.__seek = function(t){ seekT = t; frame(t); };
window.__cfg  = CFG;
<\/script>
</body>
</html>
`,S=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Cortexa — Every signal you own, on one screen</title>
<meta name="description" content="Cortexa — every source you own, reconciled and running live on the wall.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%2305070c%27/%3E%3Cellipse cx=%2716%27 cy=%2715%27 rx=%278.2%27 ry=%279.2%27 fill=%27none%27 stroke=%27%2340cfff%27 stroke-width=%272.6%27/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=block" rel="stylesheet">
<style>
:root{
  --serif:'Instrument Serif',Georgia,'Times New Roman',serif;
  --ink:#ffffff;
  --muted:rgba(228,237,248,.72);
  --dim:#7f97ba;
  --dim-2:#6d86a8;
  --page:#000000;
  --pad:44px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{
  background:var(--page);
  color:var(--ink);
  font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  overflow:hidden;
}

/* ---------------------------------------------------------------- stage */
#stage{position:fixed;inset:0;overflow:hidden;z-index:0}
#gl{position:absolute;inset:0;width:100%;height:100%;display:block}
#veil{position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(128% 84% at 50% 44%, rgba(0,0,0,0) 40%, rgba(0,0,0,.34) 76%, rgba(0,0,0,.80) 100%);
}

/* ------------------------------------------------------------------ nav */
nav{
  position:fixed;left:0;right:0;top:0;height:92px;
  display:flex;align-items:center;
  padding:0 var(--pad);
  z-index:6;
}
.brand{
  display:flex;align-items:center;gap:11px;
  color:#f4f8fc;text-decoration:none;white-space:nowrap;
}
.brand svg{display:block;width:21px;height:26px;overflow:visible;opacity:.95}
.brand span{
  font-family:var(--serif);
  font-size:22px;font-weight:400;line-height:1;letter-spacing:.004em;
}

.navpill{
  position:absolute;left:50%;top:24px;transform:translateX(-50%);
  height:44px;display:flex;align-items:center;
  padding:0 6px;border-radius:999px;
  background:rgba(4,7,12,.72);
  border:1px solid rgba(160,196,236,.13);
  backdrop-filter:blur(14px) saturate(1.1);
  -webkit-backdrop-filter:blur(14px) saturate(1.1);
}
.navpill a{
  color:rgba(233,239,247,.72);text-decoration:none;
  font-size:14px;font-weight:400;line-height:1;letter-spacing:-.006em;
  padding:0 15px;white-space:nowrap;transition:color .2s ease;
}
.navpill a:hover{color:#fff}

.navcta{
  position:absolute;right:var(--pad);top:22px;
  height:40px;display:inline-flex;align-items:center;gap:9px;
  padding:0 18px;border-radius:999px;
  color:#eef3f9;
  background:rgba(10,13,19,.52);
  border:1px solid rgba(255,255,255,.16);
  backdrop-filter:blur(12px) saturate(1.1);
  -webkit-backdrop-filter:blur(12px) saturate(1.1);
  font-size:13.5px;font-weight:450;line-height:1;letter-spacing:-.008em;
  text-decoration:none;white-space:nowrap;
  transition:border-color .2s ease,transform .2s ease;
}
.navcta:hover{border-color:rgba(255,255,255,.34);transform:translateY(-1px)}
.ring{width:7px;height:7px;border-radius:50%;border:1.3px solid currentColor;
  flex:0 0 auto;opacity:.6}

/* ------------------------------------------------------- container lines */
.rails{
  position:fixed;top:0;bottom:0;left:50%;transform:translateX(-50%);
  width:calc(100vw - var(--pad)*2 + 44px);
  display:flex;justify-content:space-between;
  z-index:4;pointer-events:none;
}
.rail{
  position:relative;width:1px;flex:0 0 1px;align-self:stretch;
  background:linear-gradient(to bottom,
    rgba(255,255,255,0) 0%, rgba(214,234,250,.115) 9%,
    rgba(214,234,250,.115) 91%, rgba(255,255,255,0) 100%);
}
.rail::before,.rail::after{
  content:"";position:absolute;left:-2.5px;width:6px;height:6px;
  background:rgba(214,234,250,.42);
}
.rail::before{top:108px}
.rail::after{bottom:108px}

/* ----------------------------------------------------------------- hero */
.stage{position:fixed;inset:0;z-index:5;pointer-events:none}
.stage > *{pointer-events:auto}

h1{
  position:absolute;left:var(--pad);top:120px;
  font-family:var(--serif);
  font-size:60px;font-weight:400;line-height:63px;letter-spacing:-.004em;
  color:#fff;white-space:nowrap;
  text-shadow:0 0 42px rgba(2,10,22,.78), 0 2px 26px rgba(0,0,0,.5);
}
h1 .dim{color:var(--dim);display:block}

.lede{
  position:absolute;left:var(--pad);top:calc(50vh + 22px);width:344px;
  font-size:15px;font-weight:400;line-height:22px;letter-spacing:-.008em;
  color:var(--muted);
  text-shadow:0 0 10px rgba(2,8,18,.95), 0 0 26px rgba(0,6,14,.85);
}
.facts{
  position:absolute;right:var(--pad);top:calc(50vh + 22px);text-align:right;
  font-size:15px;font-weight:400;line-height:22px;letter-spacing:-.008em;
  color:var(--muted);
  text-shadow:0 0 10px rgba(2,8,18,.95), 0 0 26px rgba(0,6,14,.85);
}

.bigtag{
  position:absolute;right:var(--pad);bottom:44px;text-align:right;
  font-family:var(--serif);
  font-size:60px;font-weight:400;line-height:63px;letter-spacing:-.004em;
  color:#fff;white-space:nowrap;
  text-shadow:0 0 44px rgba(2,10,22,.9), 0 2px 30px rgba(0,0,0,.6);
}
.bigtag .dim{color:var(--dim-2);display:block}

.actions{position:absolute;left:var(--pad);bottom:48px;display:flex;align-items:center;gap:14px}
.btn{
  height:46px;border-radius:23px;
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  font-size:15px;font-weight:450;line-height:1;letter-spacing:-.008em;
  text-decoration:none;white-space:nowrap;
  transition:transform .22s cubic-bezier(.22,.7,.3,1), background .22s ease, border-color .22s ease;
}
.btn-solid{
  padding:0 21px;background:#f4f7fb;color:#0a0d12;
  box-shadow:0 10px 30px rgba(0,0,0,.42);
}
.btn-solid:hover{background:#fff;transform:translateY(-1.5px)}
.btn-ghost{
  padding:0 19px;color:#eef3f9;
  background:rgba(10,13,19,.52);
  border:1px solid rgba(255,255,255,.16);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
}
.btn-ghost:hover{border-color:rgba(255,255,255,.34);transform:translateY(-1.5px)}
.btn-ghost .arw{font-size:15px;opacity:.85;transform:translateY(.5px)}

a:focus-visible{outline:2px solid rgba(190,220,255,.78);outline-offset:3px;border-radius:999px}

/* ------------------------------------------------------------ responsive */
@media (max-width:1280px){
  h1{font-size:50px;line-height:53px;top:112px}
  .bigtag{font-size:50px;line-height:53px}
}
@media (max-width:1120px){
  .navpill{display:none}
  h1{font-size:44px;line-height:47px;top:106px}
  .bigtag{font-size:40px;line-height:43px;bottom:128px}
  .lede{top:auto;bottom:246px;width:min(320px,44vw)}
  .facts{top:auto;bottom:246px}
}
@media (max-width:820px){
  h1{font-size:36px;line-height:39px;top:96px;white-space:normal;max-width:56vw}
  .bigtag{font-size:31px;line-height:34px;bottom:142px}
  .lede{bottom:250px;width:min(280px,52vw);font-size:14px;line-height:20px}
  .facts{bottom:250px;font-size:14px;line-height:20px}
}
@media (max-width:620px){
  :root{--pad:22px}
  nav{height:76px}
  .navcta{display:none}
  .facts{display:none}
  h1{font-size:31px;line-height:34px;top:82px;max-width:none}
  .lede{top:172px;bottom:auto;width:min(320px,86vw);font-size:13.5px;line-height:19px}
  .bigtag{left:var(--pad);right:auto;text-align:left;font-size:25px;line-height:28px;bottom:122px}
  .actions{bottom:40px;gap:11px}
  .btn{height:42px;font-size:14px}
  .btn-solid{padding:0 17px} .btn-ghost{padding:0 15px}
  .rail::before{top:84px} .rail::after{bottom:84px}
}
@media (max-height:720px) and (min-width:820px){
  h1{font-size:42px;line-height:45px;top:92px}
  .bigtag{font-size:30px;line-height:33px;bottom:34px}
  .lede,.facts{top:auto;bottom:150px;font-size:13.5px;line-height:19px}
  .actions{bottom:34px}
  .rail::before{top:88px} .rail::after{bottom:88px}
}
@media (max-height:560px){
  h1{font-size:34px;line-height:37px;top:78px}
  .bigtag{font-size:25px;line-height:28px;bottom:30px}
  .lede,.facts{bottom:124px;font-size:13px;line-height:18px}
  .actions{bottom:30px}
}
</style>
</head>
<body>

<div id="stage">
  <canvas id="gl"></canvas>
  <div id="veil"></div>
</div>

<div class="rails" aria-hidden="true"><span class="rail"></span><span class="rail"></span></div>

<nav>
  <a class="brand" href="#">
    <svg viewBox="0 0 22 27" fill="none" aria-hidden="true">
      <ellipse cx="11" cy="11.6" rx="8.1" ry="10.1" stroke="currentColor" stroke-width="2.1"/>
      <path d="M2.2 21.6 H19.8" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
    </svg>
    <span>Cortexa</span>
  </a>
  <div class="navpill">
    <a href="#">Platform</a>
    <a href="#">Signals</a>
    <a href="#">Wallboards</a>
    <a href="#">Research</a>
    <a href="#">Pricing</a>
  </div>
  <a class="navcta" href="#">See it live <i class="ring"></i></a>
</nav>

<div class="stage">
  <h1>Every signal you own,<span class="dim">on one screen.</span></h1>

  <p class="lede">The layer between raw data and real decisions &mdash;<br>reconciled once, then running all day on the wall.</p>
  <p class="facts">Sub-second refresh<br>Nothing to re-instrument</p>

  <p class="bigtag"><span class="dim">Built for the room</span>that watches it live.</p>

  <div class="actions">
    <a class="btn btn-solid" href="#">Book a demo <i class="ring"></i></a>
    <a class="btn btn-ghost" href="#">Open a wallboard <span class="arw">&#8627;</span></a>
  </div>
</div>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
"use strict";
/* =====================================================================
   Cortexa — Monitor.  A companion document to the Cortexa hero.  It keeps
   that page's drawing system exactly — the scan that crowds its samples
   against the subject's own silhouette, teeth steered along the local
   contour normal, the lumpy dust volume with its moat, the volumetric
   haze wash, the dolly streaks and the five-level bloom composite — and
   changes the subject.

   Here the subject is a cathode-ray monitor seen head on.  Its shell is
   one closed surface: the scan runs out of the middle of the bezel, over
   the front rim, and then straight back along the tapering case, so the
   crowding at psi = PI/2 paints the bezel comb and the case's own limb in
   the same pass.  The screen is a second scan of the same kind, marching
   in off the aperture: its first few rings fall down the inner lip and
   light it, and everything past them lies flat on the glass and stays
   dark — which is what leaves room for the raster to read.
   ===================================================================== */

const CFG = {
  /* ---- framing ---- */
  MON_HALF_W    : 0.296,      /* case half-width, in viewport heights    */
  MON_CY        : 0.398,      /* case centre, fraction of vh from the top*/
  YAW           : -0.165,     /* a standing quarter-turn off the axis    */
  FOV           : 34,

  /* ---- case, in case half-widths ---- */
  CASE_HH       : 0.795,
  CASE_R        : 0.170,
  CASE_D        : 1.560,      /* how far the tube runs back              */
  CASE_TAPER    : 0.660,
  FRONT         : 0.118,      /* bezel face, above the rim               */
  BEZEL_BEVEL   : 0.052,
  BEZEL_REACH   : 0.360,

  /* ---- screen aperture ---- */
  AP_HW         : 0.775,
  AP_HH         : 0.570,
  AP_R          : 0.112,
  AP_CY         : 0.062,
  LIP_D         : 0.150,      /* how far the glass sits behind the bezel */
  LIP_T         : 0.052,      /* and how quickly it gets there           */
  GLASS_BULGE   : 0.104,

  /* ---- scan resolution ---- */
  RINGS         : 148,
  TICK_PITCH    : 4.0/288.0,  /* comb pitch along the case border        */
  AP_RINGS      : 96,
  AP_PITCH      : 4.0/288.0,

  /* ---- dust ---- */
  DUST          : 94000,
  HAZE          : 1100,
  GAIN_HAZE     : 0.020,

  /* ---- point sizes (css px at dpr 1) ---- */
  PT_CASE       : 3.20,
  PT_INK        : 3.05,
  PT_RASTER     : 3.05,
  PT_DUST       : 1.9,

  /* ---- exposure ---- */
  GAIN_CASE     : 1.26,
  GAIN_INK      : 0.92,
  GAIN_RASTER   : 0.80,
  GAIN_DUST     : 0.55,

  /* ---- intro dolly: dist = D*(1 - A*exp(-t/TAU)) ---- */
  INTRO_A       : 0.955,
  INTRO_TAU     : 0.255,
  INTRO_LEN     : 2.6,

  /* ---- pointer: torch + extraction ---- */
  TORCH         : 0.50,
  TORCH_R       : 3.10,
  TORCH_DUST    : 1.05,
  TORCH_DUST_W  : 0.34,
  PULL          : 0.088,
  PULL_DUST     : 0.032,
  PULL_R        : 0.165,

  /* ---- bloom ---- */
  BLOOM_THRESH  : 0.55,
  AMBIENT       : 1.00,
  BLOOM_STRENGTH: 0.70,
};

try{
  new URLSearchParams(location.search).forEach((v,k)=>{
    if (k in CFG && typeof CFG[k] === 'number') CFG[k] = parseFloat(v);
  });
}catch(e){}

/* ---------------------------------------------------------------- utils */
const TAU = Math.PI * 2;
function mulberry(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0;
  let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }
const rnd = mulberry(20260824);

function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function sstep(a,b,x){ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); }

/* =====================================================================
   Silhouettes.  The hero solved its outline out of a measured profile
   table; a cabinet is easier, so both contours here are sampled off a
   rounded-box distance field and served through the same radius/normal
   pair the hero used.  Two of them: the case, and the hole in it.
   ===================================================================== */
function roundBoxSDF(x, y, hw, hh, r){
  const qx = Math.abs(x) - (hw - r), qy = Math.abs(y) - (hh - r);
  const ax = Math.max(qx,0), ay = Math.max(qy,0);
  return Math.hypot(ax,ay) + Math.min(Math.max(qx,qy),0) - r;
}
const caseSDF = (x,y) => roundBoxSDF(x, y, 1.0, CFG.CASE_HH, CFG.CASE_R);
const apSDF   = (x,y) => roundBoxSDF(x, y - CFG.AP_CY, CFG.AP_HW, CFG.AP_HH, CFG.AP_R);

const OUT_N = 1440;
function makeOutline(sdf, cy){
  const tab = new Float64Array(OUT_N+1);
  for (let i=0;i<=OUT_N;i++){
    const phi = i/OUT_N*TAU, cx=Math.cos(phi), sy=Math.sin(phi);
    let lo=0, hi=6.0;
    for (let k=0;k<44;k++){ const m=(lo+hi)*0.5; if (sdf(cx*m, cy + sy*m) < 0) lo=m; else hi=m; }
    tab[i] = (lo+hi)*0.5;
  }
  const R = function(phi){
    let u = phi/TAU; u -= Math.floor(u);
    const x = u*OUT_N, i = Math.floor(x), f = x-i;
    return tab[i]*(1-f) + tab[i+1]*f;
  };
  return {
    cy: cy,
    R: R,
    N: function(phi, out){
      const h=0.004;
      const r  = R(phi);
      const rp = (R(phi+h) - R(phi-h))/(2*h);
      const tx = rp*Math.cos(phi) - r*Math.sin(phi);
      const ty = rp*Math.sin(phi) + r*Math.cos(phi);
      const l  = Math.hypot(tx,ty) || 1;
      out[0] =  ty/l; out[1] = -tx/l;
    }
  };
}
const _n2=[0,0];
const CASE_OL = makeOutline(caseSDF, 0);
const AP_OL   = makeOutline(apSDF, CFG.AP_CY);

/* how far out toward the aperture rim a screen point lies, 0 at the
   centre and 1 on the contour — the glass profile and the raster's own
   vignette are both written against it                                  */
function apFrac(x, y){
  const dy = y - CFG.AP_CY;
  const d = Math.hypot(x, dy);
  if (d < 1e-6) return 0;
  return d / AP_OL.R(Math.atan2(dy, x));
}
function glassZ(x, y){
  const f = clamp(apFrac(x,y), 0, 1);
  return CFG.FRONT - CFG.LIP_D + CFG.GLASS_BULGE*(1 - f*f);
}

/* =====================================================================
   The scan.  psi runs pole to pole and t = 1 - sin(psi) crowds the rings
   against the silhouette, exactly as the hero's headPoint does.  The
   front half lays the bezel down as a flat face with a rolled rim; the
   back half, instead of continuing inward, walks the same contour
   backward and inward to make the tube's taper.  One closed surface, so
   the crowding at the rim serves both the bezel comb and the case limb.
   ===================================================================== */
function bevelZ(t, e){
  if (t >= e) return 1;
  const k = 1 - t/e;
  return Math.sqrt(Math.max(0, 1 - k*k));
}
function caseSurf(psi, phi, out){
  const sp = Math.sin(psi), cp = Math.cos(psi);
  const t  = clamp(1 - sp, 0, 1);
  const R  = CASE_OL.R(phi);
  const cx = Math.cos(phi), sy = Math.sin(phi);
  if (cp >= 0){
    CASE_OL.N(phi, _n2);
    const wN = Math.exp(-Math.pow(t/0.30, 2));
    let ax = cx*(1-wN) + _n2[0]*wN;
    let ay = sy*(1-wN) + _n2[1]*wN;
    const al = Math.hypot(ax,ay) || 1; ax/=al; ay/=al;
    const s = CFG.BEZEL_REACH*t*(1-t) + R*t*t;
    out[0] = R*cx - ax*s;
    out[1] = R*sy - ay*s;
    out[2] = CFG.FRONT * bevelZ(t, CFG.BEZEL_BEVEL);
  } else {
    const k = 1 - CFG.CASE_TAPER*Math.pow(t, 1.35);
    out[0] = R*cx*k;
    out[1] = R*sy*k;
    out[2] = -CFG.CASE_D * Math.pow(t, 0.86);
  }
}
/* the glass: it meets the bezel flush at the aperture, drops down the
   inner lip inside LIP_T, and then lies out across the tube face        */
function glassSurf(psi, phi, out){
  const sp = Math.sin(psi);
  const t  = clamp(1 - sp, 0, 1);
  const R  = AP_OL.R(phi);
  AP_OL.N(phi, _n2);
  const wN = Math.exp(-Math.pow(t/0.30, 2));
  let ax = Math.cos(phi)*(1-wN) + _n2[0]*wN;
  let ay = Math.sin(phi)*(1-wN) + _n2[1]*wN;
  const al = Math.hypot(ax,ay) || 1; ax/=al; ay/=al;
  const s = 0.42*t*(1-t) + R*t*t;
  out[0] = R*Math.cos(phi) - ax*s;
  out[1] = CFG.AP_CY + R*Math.sin(phi) - ay*s;
  out[2] = CFG.FRONT
         - CFG.LIP_D*Math.sqrt(Math.min(1, t/CFG.LIP_T))
         + CFG.GLASS_BULGE*sstep(CFG.LIP_T, 0.92, t);
}

/* the stand, in the hero's torso idiom: a superellipse cross-section
   swept down a width/depth table, round at the neck and flattened out
   into the foot                                                         */
const STAND_Y = [-0.795,-0.900,-0.995,-1.040,-1.072,-1.112,-1.150];
const STAND_W = [ 0.312, 0.303, 0.298, 0.312, 0.436, 0.502, 0.508];
const STAND_D = [ 0.242, 0.236, 0.232, 0.242, 0.324, 0.374, 0.378];
function catmull(t,p0,p1,p2,p3){
  const t2=t*t, t3=t2*t;
  return 0.5*((2*p1) + (-p0+p2)*t + (2*p0-5*p1+4*p2-p3)*t2 + (-p0+3*p1-3*p2+p3)*t3);
}
function standProfile(y){
  const T = STAND_Y, n = T.length-1;
  if (y >= T[0]) return [STAND_W[0], STAND_D[0]];
  if (y <= T[n]) return [STAND_W[n], STAND_D[n]];
  for (let i=0;i<n;i++){
    if (y <= T[i] && y >= T[i+1]){
      const f = (T[i]-y)/(T[i]-T[i+1]);
      return [catmull(f, STAND_W[Math.max(i-1,0)], STAND_W[i], STAND_W[i+1], STAND_W[Math.min(i+2,n)]),
              catmull(f, STAND_D[Math.max(i-1,0)], STAND_D[i], STAND_D[i+1], STAND_D[Math.min(i+2,n)])];
    }
  }
  return [STAND_W[n], STAND_D[n]];
}
const STAND_Y0 = -0.795, STAND_Y1 = -1.150, STAND_Z0 = -0.36;
function standPoint(v, u, out){
  const y = STAND_Y0 + v*(STAND_Y1 - STAND_Y0);
  const p = standProfile(y), W = p[0], D = p[1];
  const n = 2.40 + 3.20*sstep(-1.035,-1.095,y); /* the foot is a flat slab */
  const e = 2.0/n;
  const cu = Math.cos(u), su = Math.sin(u);
  out[0] = W*(cu<0?-1:1)*Math.pow(Math.abs(cu), e);
  out[1] = y;
  out[2] = D*(su<0?-1:1)*Math.pow(Math.abs(su), e) + STAND_Z0;
}

/* central-difference normal of a parametric surface ------------------ */
const _a=[0,0,0], _b=[0,0,0], _c=[0,0,0], _d=[0,0,0];
function surfNormal(fn, s, t, ds, dt, out){
  fn(s-ds, t, _a); fn(s+ds, t, _b);
  fn(s, t-dt, _c); fn(s, t+dt, _d);
  const ux=_b[0]-_a[0], uy=_b[1]-_a[1], uz=_b[2]-_a[2];
  const vx=_d[0]-_c[0], vy=_d[1]-_c[1], vz=_d[2]-_c[2];
  let nx = uy*vz-uz*vy, ny = uz*vx-ux*vz, nz = ux*vy-uy*vx;
  const l = Math.hypot(nx,ny,nz) || 1;
  out[0]=nx/l; out[1]=ny/l; out[2]=nz/l;
}

/* =============================================================== build  */
function buildMeridianTable(ol, pitch){
  const N = 4096, cum = new Float64Array(N+1);
  const h = 0.002;
  let acc = 0;
  for (let i=0;i<=N;i++){
    cum[i] = acc;
    if (i === N) break;
    const phi = (i+0.5)/N*TAU;
    const r  = ol.R(phi);
    const rp = (ol.R(phi+h) - ol.R(phi-h))/(2*h);
    acc += Math.hypot(r, rp)*(TAU/N);
  }
  const NM = Math.round(acc/pitch/16)*16;
  const tab = new Float64Array(NM);
  let k = 0;
  for (let j=0;j<NM;j++){
    const want = acc*j/NM;
    while (k < N && cum[k+1] < want) k++;
    const t = (want - cum[k])/Math.max(1e-9, cum[k+1]-cum[k]);
    tab[j] = (k + t)/N*TAU;
  }
  return tab;
}
const PHI_CASE = buildMeridianTable(CASE_OL, CFG.TICK_PITCH);
const PHI_AP   = buildMeridianTable(AP_OL, CFG.AP_PITCH);

function pack(pos,nor,seed,gain,centre,radius){
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('aNormal',  new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('aSeed',    new THREE.Float32BufferAttribute(seed,1));
  g.setAttribute('aGain',    new THREE.Float32BufferAttribute(gain,1));
  g.boundingSphere = new THREE.Sphere(centre || new THREE.Vector3(0,0,0), radius || 6);
  return g;
}

function buildCase(){
  const pos=[], nor=[], seed=[], gain=[];
  const p=[0,0,0], n=[0,0,0];
  const NR = CFG.RINGS, NM = PHI_CASE.length;
  const dpsi = Math.PI/NR;
  for (let i=0;i<NR;i++){
    const psi = (i+0.5)*dpsi;
    const s = Math.sin(psi), cp = Math.cos(psi);
    const t = clamp(1-s,0,1);
    let step = 1, nm = NM;
    while (nm > 7 && nm > 6*NR*s && (nm % 2) === 0){ nm >>= 1; step <<= 1; }
    for (let j=0;j<nm;j++){
      const phi = PHI_CASE[j*step];
      caseSurf(psi, phi, p);
      /* the bezel is a frame, not a plate: everything the aperture eats
         belongs to the glass scan instead                                */
      if (cp >= 0 && apSDF(p[0], p[1]) < 0.004) continue;
      surfNormal(caseSurf, psi, phi, 0.006, 0.004, n);
      pos.push(p[0],p[1],p[2]); nor.push(n[0],n[1],n[2]); seed.push(rnd());

      let g;
      if (cp >= 0){
        g = 0.075 + 0.925*Math.exp(-Math.pow(t/0.086,2));
        const sy = Math.sin(phi), cx = Math.abs(Math.cos(phi));
        g *= 0.82 + 0.42*cx + 0.30*sstep(0.45,1.0,sy);
        /* the chin is the deepest run of bezel and carries the most light */
        g *= 1.0 + 0.34*sstep(0.55,1.0,-sy);
      } else {
        /* the tube: bright where it leaves the rim, gone by the neck      */
        g = 0.060 + 0.95*Math.exp(-Math.pow(t/0.150,2)) + 0.20*Math.exp(-Math.pow((t-0.40)/0.32,2));
        g *= 0.30 + 0.70*Math.abs(Math.cos(phi));
        g *= 0.80;
      }
      gain.push(g);
    }
  }

  return pack(pos,nor,seed,gain, new THREE.Vector3(0,0,-0.6), 3.4);
}

function buildGlass(){
  const pos=[], nor=[], seed=[], gain=[];
  const p=[0,0,0], n=[0,0,0];
  const NR = CFG.AP_RINGS, NM = PHI_AP.length;
  const dpsi = (Math.PI*0.5)/NR;                /* front half only        */
  for (let i=0;i<NR;i++){
    const psi = Math.PI*0.5 - (i+0.5)*dpsi;
    const s = Math.sin(psi);
    const t = clamp(1-s,0,1);
    let step = 1, nm = NM;
    while (nm > 7 && nm > 6*NR*s && (nm % 2) === 0){ nm >>= 1; step <<= 1; }
    for (let j=0;j<nm;j++){
      const phi = PHI_AP[j*step];
      glassSurf(psi, phi, p);
      surfNormal(glassSurf, psi, phi, 0.005, 0.004, n);
      pos.push(p[0],p[1],p[2]); nor.push(n[0],n[1],n[2]); seed.push(rnd());
      /* only the inner lip is lit; the glass itself has to stay dark or
         the raster has nothing to sit against                            */
      let g = 0.030 + 1.35*Math.exp(-Math.pow(t/0.045,2));
      g *= 0.80 + 0.40*Math.abs(Math.cos(phi));
      gain.push(g);
    }
  }
  return pack(pos,nor,seed,gain, new THREE.Vector3(0,CFG.AP_CY,0), 2.0);
}

function buildStand(){
  const pos=[], nor=[], seed=[], gain=[];
  const p=[0,0,0], n=[0,0,0];
  const NV = 108, NU = 168;
  for (let i=0;i<NV;i++){
    const v = (i+0.5)/NV;
    for (let j=0;j<NU;j++){
      const u = (j/NU)*TAU;
      standPoint(v + (rnd()-0.5)*0.9/NV, u + (rnd()-0.5)*0.9*TAU/NU, p);
      surfNormal(standPoint, v, u, 0.0035, 0.006, n);
      pos.push(p[0],p[1],p[2]); nor.push(n[0],n[1],n[2]); seed.push(rnd());
      /* the neck lives in the cabinet's shadow; the foot catches the wash
         coming off the desk                                              */
      let g = 0.34 + 1.05*sstep(-1.03,-1.125,p[1]);
      if (p[1] > -0.84) g *= 0.34;              /* tucked under the case  */
      gain.push(g);
    }
  }
  return pack(pos,nor,seed,gain, new THREE.Vector3(0,-0.95,STAND_Z0), 1.6);
}

/* ------------------------------------------------------------- the ink -
   The cabinet's printing and the picture on the glass.  Both are drawn
   with normals lying IN their own surface, so the shell shader's rim term
   treats a drawn line exactly like a piece of silhouette and it reads as
   the same scanned mark the case border does.                           */
const STROKE_FONT = {
  A:[[0,0,0.5,1],[0.5,1,1,0],[0.19,0.38,0.81,0.38]],
  C:[[0.95,0.80,0.72,0.98],[0.72,0.98,0.28,0.98],[0.28,0.98,0.05,0.72],[0.05,0.72,0.05,0.28],
     [0.05,0.28,0.28,0.02],[0.28,0.02,0.72,0.02],[0.72,0.02,0.95,0.20]],
  E:[[0.88,1,0.10,1],[0.10,1,0.10,0],[0.10,0,0.88,0],[0.10,0.50,0.70,0.50]],
  L:[[0.14,1,0.14,0],[0.14,0,0.88,0]],
  O:[[0.95,0.72,0.72,0.98],[0.72,0.98,0.28,0.98],[0.28,0.98,0.05,0.72],[0.05,0.72,0.05,0.28],
     [0.05,0.28,0.28,0.02],[0.28,0.02,0.72,0.02],[0.72,0.02,0.95,0.28],[0.95,0.28,0.95,0.72]],
  R:[[0.10,0,0.10,1],[0.10,1,0.68,1],[0.68,1,0.90,0.80],[0.90,0.80,0.68,0.58],[0.68,0.58,0.10,0.58],[0.46,0.58,0.92,0]],
  T:[[0.04,1,0.96,1],[0.50,1,0.50,0]],
  V:[[0.05,1,0.50,0],[0.50,0,0.95,1]],
  X:[[0.05,1,0.95,0],[0.95,1,0.05,0]],
  ' ':[]
};
const GLYPH_ADV = { I:0.62, T:0.94, ' ':0.52 };

/* An in-plane normal is exactly perpendicular to the view axis, which puts
   the shell shader's \`face\` term right on its own knee: lean the normal a
   few degrees toward the lens and the point is fully lit, a few degrees
   away and it is 28x darker.  Off-axis perspective supplies that lean, so
   a line drawn with one normal is bright on one side of the frame and
   black on the other.  Every drawn point therefore ships twice, with n
   and -n, and the mark reads the same wherever it lands.                */
function inkPoint(P, x, y, z, nx, ny, g, seed){
  for (const s of [1,-1]){
    P.pos.push(x, y, z);
    P.nor.push(nx*s, ny*s, 0);
    P.seed.push(seed === undefined ? rnd() : seed);
    P.gain.push(g*(0.72 + 0.56*rnd()));
  }
}
function inkSegment(P, x0,y0,x1,y1, zfn, pitch, g, seedfn){
  const dx=x1-x0, dy=y1-y0;
  const len = Math.hypot(dx,dy);
  const n = Math.max(2, Math.round(len/pitch));
  const nx = -dy/(len||1), ny = dx/(len||1);
  for (let i=0;i<=n;i++){
    const f=i/n, x=x0+dx*f, y=y0+dy*f;
    inkPoint(P, x, y, (typeof zfn === 'function' ? zfn(x,y) : zfn), nx, ny, g,
             seedfn ? seedfn(x,y) : undefined);
  }
}
function inkText(P, text, x, y, size, zfn, pitch, g, align){
  const adv = [];
  let total = 0;
  for (const ch of text){ const a = (GLYPH_ADV[ch] ?? 0.78)*size*1.34; adv.push(a); total += a; }
  let cx = align === 'center' ? x - total/2 : x;
  for (let i=0;i<text.length;i++){
    const strokes = STROKE_FONT[text[i]] || [];
    for (const s of strokes){
      inkSegment(P, cx + s[0]*size*0.78, y + s[1]*size,
                    cx + s[2]*size*0.78, y + s[3]*size, zfn, pitch, g);
    }
    cx += adv[i];
  }
}

function buildInk(){
  const P = {pos:[], nor:[], seed:[], gain:[]};
  const zf = CFG.FRONT*1.02;

  /* a shadow line around the aperture, the way a moulded bezel has one  */
  {
    const steps = 2600;
    for (let i=0;i<steps;i++){
      const phi = i/steps*TAU;
      AP_OL.N(phi, _n2);
      const R = AP_OL.R(phi) + 0.030;
      inkPoint(P, R*Math.cos(phi), CFG.AP_CY + R*Math.sin(phi), zf, _n2[0], _n2[1], 0.50);
    }
  }
  /* the maker's name in the chin, with the power lamp beside it         */
  const chinY = -CFG.CASE_HH + 0.115;
  inkText(P, 'CORTEXA', -0.02, chinY, 0.082, zf, 0.0125, 1.15, 'center');
  {
    const lx = 0.735, ly = chinY + 0.040, r = 0.0125;
    for (let k=0;k<22;k++){
      const th = k/22*TAU;
      inkPoint(P, lx + Math.cos(th)*r, ly + Math.sin(th)*r, zf, Math.cos(th), Math.sin(th), 2.30);
    }
    for (let k=0;k<22;k++){
      const th = rnd()*TAU, rr = Math.pow(rnd(),0.7)*r*0.8;
      inkPoint(P, lx + Math.cos(th)*rr, ly + Math.sin(th)*rr, zf, Math.cos(th), Math.sin(th), 2.10);
    }
  }
  /* two knurled controls at the other end of the chin                   */
  for (const kx of [-0.752, -0.660]){
    const ky = chinY + 0.040, r = 0.0165;
    for (let k=0;k<24;k++){
      const th = k/24*TAU;
      inkPoint(P, kx + Math.cos(th)*r, ky + Math.sin(th)*r*0.92, zf, Math.cos(th), Math.sin(th), 0.72);
    }
  }

  /* A moulding seam a little inside the outer edge.  The bezel comb dies
     within a few percent of the border, so without this the top and the
     two sides carry one line each while the chin carries five.           */
  {
    const steps = 3000;
    for (let i=0;i<steps;i++){
      const phi = i/steps*TAU;
      CASE_OL.N(phi, _n2);
      const R = CASE_OL.R(phi) - 0.062;
      inkPoint(P, R*Math.cos(phi), R*Math.sin(phi), zf, _n2[0], _n2[1], 0.34);
    }
  }

  /* Registration brackets inside the picture's corners, the way a grading
     monitor marks its safe area.  They pull weight back out to the corners
     of a screen whose content all sits on its centre line.                */
  {
    const ax = CFG.AP_HW - 0.085, ay = CFG.AP_HH - 0.070, arm = 0.088;
    for (const sx of [-1,1]) for (const sy of [-1,1]){
      const cx = sx*ax, cy = CFG.AP_CY + sy*ay;
      const gz = (x,y) => glassZ(x,y) + 0.007;
      inkSegment(P, cx, cy, cx - sx*arm, cy, gz, 0.011, 1.45);
      inkSegment(P, cx, cy, cx, cy - sy*arm*0.86, gz, 0.011, 1.45);
    }
  }

  /* A vented brow across the top bezel.  The cabinet's own flank cannot
     carry this: the bezel sits nearer the lens than the rim behind it, so the
     front face projects larger than the case and hides every slot cut into
     the taper.  The face is the only surface with room, so the detail that
     balances the chin goes there.                                        */
  {
    const by = CFG.CASE_HH - 0.096, sw = 0.052;
    for (let k=-3;k<=3;k++){
      const cx = k*0.128;
      inkSegment(P, cx - sw, by, cx + sw, by, zf, 0.0115, 0.80);
    }
  }

  return pack(P.pos,P.nor,P.seed,P.gain, new THREE.Vector3(0,-0.3,0), 2.6);
}

/* ------------------------------------------------------------ the picture
   Everything on the glass.  The scan lines carry a seed that rises with
   height, which turns the shell shader's own per-point shimmer — a term
   already in the hero — into a bright band rolling down the tube, with no
   new uniform and nothing to integrate.                                 */
const RASTER_K = 0.088;
function rasterSeed(x, y){ return (y - CFG.AP_CY)*RASTER_K + rnd()*0.021; }

function buildRaster(){
  const P = {pos:[], nor:[], seed:[], gain:[]};
  const zf = (x,y) => glassZ(x,y) + 0.007;
  const X0 = -CFG.AP_HW + 0.075, X1 = CFG.AP_HW - 0.075;
  const Y0 = CFG.AP_CY - CFG.AP_HH + 0.070, Y1 = CFG.AP_CY + CFG.AP_HH - 0.070;

  /* scan lines --------------------------------------------------------*/
  const LINE_PITCH = 0.0205, DOT_PITCH = 0.0118;
  for (let y = Y0; y <= Y1; y += LINE_PITCH){
    for (let x = X0; x <= X1; x += DOT_PITCH){
      const f = apFrac(x,y);
      if (f > 0.985) continue;
      const vig = 1.0 - 0.55*sstep(0.60, 1.0, f);
      P.pos.push(x, y, zf(x,y));
      P.nor.push(1, 0, 0);
      P.seed.push(rasterSeed(x,y));
      P.gain.push(0.145*vig*(0.55 + 0.90*rnd()));
      P.pos.push(x, y, zf(x,y));
      P.nor.push(-1, 0, 0);
      P.seed.push(rasterSeed(x,y));
      P.gain.push(0.145*vig*(0.55 + 0.90*rnd()));
    }
  }

  /* graticule ---------------------------------------------------------*/
  for (let k=1;k<8;k++){
    const x = X0 + (X1-X0)*k/8;
    inkSegment(P, x, Y0+0.02, x, Y1-0.02, zf, 0.020, 0.16, rasterSeed);
  }
  for (let k=1;k<5;k++){
    const y = Y0 + (Y1-Y0)*k/5;
    inkSegment(P, X0+0.02, y, X1-0.02, y, zf, 0.020, 0.16, rasterSeed);
  }

  /* the trace: two reconciled series over the same window -------------*/
  function series(x, seedA, seedB, amp){
    const u = (x - X0)/(X1 - X0);
    return amp*( 0.62*Math.sin(u*11.0 + seedA)
               + 0.26*Math.sin(u*27.0 + seedB)
               + 0.14*Math.sin(u*47.0 + seedA*2.1)
               + 0.10*Math.sin(u*71.0 + seedB*1.7) );
  }
  for (const [sa, sb, amp, yc, g] of [[0.4, 2.1, 0.170, CFG.AP_CY + 0.150, 1.55],
                                      [2.9, 5.3, 0.105, CFG.AP_CY - 0.135, 0.80]]){
    let px = X0, py = yc + series(X0, sa, sb, amp);
    const N = 260;
    for (let i=1;i<=N;i++){
      const x = X0 + (X1-X0)*i/N;
      const y = yc + series(x, sa, sb, amp);
      inkSegment(P, px, py, x, y, zf, 0.011, g, rasterSeed);
      px = x; py = y;
    }
  }

  /* a bar row along the foot of the picture ---------------------------*/
  const BW = (X1-X0)/13;
  for (let k=0;k<11;k++){
    const x = X0 + 0.02 + k*BW*1.16;
    const h = 0.055 + 0.155*Math.abs(Math.sin(k*1.87 + 0.6));
    const y0 = Y0 + 0.035;
    inkSegment(P, x, y0, x, y0+h, zf, 0.014, 0.62, rasterSeed);
    inkSegment(P, x+BW*0.62, y0, x+BW*0.62, y0+h, zf, 0.014, 0.62, rasterSeed);
    inkSegment(P, x, y0+h, x+BW*0.62, y0+h, zf, 0.014, 0.90, rasterSeed);
  }

  /* a header rule and a run of legend ticks ---------------------------*/
  inkSegment(P, X0, Y1-0.030, X1, Y1-0.030, zf, 0.016, 0.70, rasterSeed);
  for (let k=0;k<19;k++){
    const x = X0 + 0.03 + k*(X1-X0-0.06)/18;
    inkSegment(P, x, Y1-0.030, x, Y1-0.030-((k%3===0)?0.040:0.021), zf, 0.013, 0.55, rasterSeed);
  }

  return pack(P.pos,P.nor,P.seed,P.gain, new THREE.Vector3(0,CFG.AP_CY,0), 2.0);
}

/* --------------------------------------------------------------- dust  */
function hash3(x,y,z){
  let h = Math.sin(x*127.1 + y*311.7 + z*74.7)*43758.5453;
  return h - Math.floor(h);
}
function vnoise(x,y,z){
  const xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  const xf=x-xi, yf=y-yi, zf=z-zi;
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf), w=zf*zf*(3-2*zf);
  function g(i,j,k){ return hash3(xi+i, yi+j, zi+k); }
  const c00=g(0,0,0)*(1-u)+g(1,0,0)*u, c10=g(0,1,0)*(1-u)+g(1,1,0)*u;
  const c01=g(0,0,1)*(1-u)+g(1,0,1)*u, c11=g(0,1,1)*(1-u)+g(1,1,1)*u;
  const c0=c00*(1-v)+c10*v, c1=c01*(1-v)+c11*v;
  return c0*(1-w)+c1*w;
}
function fbm(x,y,z){
  let s=0, a=0.5, f=1;
  for (let i=0;i<4;i++){ s += a*vnoise(x*f,y*f,z*f); f*=2.07; a*=0.5; }
  return s;
}
const CAM_D = 1.0 / (CFG.MON_HALF_W * 2 * Math.tan(CFG.FOV*Math.PI/360));
const CAM_Y = (CFG.MON_CY - 0.5) * 2 * Math.tan(CFG.FOV*Math.PI/360) * CAM_D;
function hiddenBySubject(x,y,z){
  if (z > CFG.FRONT) return false;
  const sc = CAM_D/(CAM_D - z);
  const px = x*sc, py = CAM_Y + sc*(y - CAM_Y);
  if (caseSDF(px, py) < 0.006) return true;
  if (py < -0.79 && py > -1.17){
    const p = standProfile(py);
    return Math.abs(px) < p[0]*1.02;
  }
  return false;
}

function buildDust(){
  const N = CFG.DUST;
  const pos=new Float32Array(N*3), att=new Float32Array(N*3);

  function density(x,y,z){
    const big  = fbm(x*0.40+11.0, y*0.36-3.0, z*0.30+5.0);
    const mid  = fbm(x*1.15-6.0,  y*1.05+2.0, z*0.80-4.0);
    let d = 0.62*big + 0.38*mid;
    d = (d - 0.360)/0.36;
    return 0.070 + 0.930*Math.pow(Math.max(0, Math.min(1, d)), 1.35);
  }
  function envelope(x,y,z){
    let e = Math.exp(-Math.pow(x/2.60,2)) *
            Math.exp(-Math.pow((y+0.25)/2.60,2)) *
            Math.exp(-Math.pow((z+1.55)/3.00,2));
    /* the tube throws its own light into the room, hardest just off the
       glass and falling away behind the cabinet                          */
    e *= 1.0 + 2.6*Math.exp(-Math.pow((y-CFG.AP_CY)/1.35,2))
                  *Math.exp(-Math.pow(x/1.95,2))
                  *Math.exp(-Math.pow(Math.max(0,-z+0.4)/1.6,2));
    /* and the desk under the foot catches a wash of it                   */
    e *= 1.0 + 3.2*Math.exp(-Math.pow((y+1.20)/0.48,2))*Math.exp(-Math.pow(x/2.35,2));
    return e;
  }
  function moat(x,y,z){
    return 1.0 - 0.56*Math.exp(-Math.pow(caseSDF(x,y)/0.34,2));
  }

  let i=0, guard=0;
  while (i<N && guard<N*160){
    guard++;
    const x = (rnd()*2-1)*5.4;
    const y = -2.9 + rnd()*6.0;
    const z = -6.2 + rnd()*7.8;
    if (hiddenBySubject(x,y,z)) continue;
    const env = envelope(x,y,z);
    const d   = density(x,y,z);
    if (rnd() > Math.min(1, d*env*moat(x,y,z)*4.4)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    const star = Math.pow(rnd(),11.0);
    att[i*3]   = 0.085 + 0.86*Math.pow(d,1.20)*(0.35+0.65*env) + 0.80*star;
    att[i*3+1] = 0.36 + 0.68*Math.pow(rnd(),2.1) + 0.50*d + 1.3*star;
    att[i*3+2] = rnd();
    i++;
  }

  /* a fringe of loose motes on the cabinet's edge — the hero's silhouette
     is never a clean cut and neither is this one                         */
  const HALO = Math.min(N-i, 5400);
  for (let k=0;k<HALO && i<N;k++){
    const phi = rnd()*TAU;
    const R = CASE_OL.R(phi);
    const t = 1.0 + Math.pow(rnd(),1.6)*0.28;
    const z = 0.10 - Math.pow(rnd(),1.4)*0.90;
    const x = Math.cos(phi)*R*t, y = Math.sin(phi)*R*t;
    if (hiddenBySubject(x,y,z)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    const w = Math.exp(-Math.pow((t-1.0)/0.15,2));
    att[i*3]   = 0.07 + 0.54*w*(0.4+0.6*rnd()) + 0.9*Math.pow(rnd(),10.0);
    att[i*3+1] = 0.38 + 0.70*Math.pow(rnd(),2.4);
    att[i*3+2] = rnd();
    i++;
  }

  /* the desk: a wide low spray under the foot                            */
  const DESK = Math.min(N-i, 19000);
  for (let k=0;k<DESK && i<N;k++){
    const x = (rnd()*2-1)*3.6;
    const y = -1.15 - Math.pow(rnd(),1.5)*1.10;
    const z = -2.4 + rnd()*3.2;
    if (hiddenBySubject(x,y,z)) continue;
    const w = Math.exp(-Math.pow((y+1.28)/0.48,2))*Math.exp(-Math.pow(x/1.95,2));
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    att[i*3]   = (0.09 + 1.70*w)*(0.45+0.55*rnd()) + 0.9*Math.pow(rnd(),9.0);
    att[i*3+1] = 0.42 + 0.95*Math.pow(rnd(),2.2);
    att[i*3+2] = rnd();
    i++;
  }

  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0,i*3),3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att.subarray(0,i*3),3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-0.6,-2), 15);
  return g;
}

function buildHaze(){
  const N = CFG.HAZE;
  const pos=new Float32Array(N*3), att=new Float32Array(N*3);
  let i=0, guard=0;
  while (i<N && guard<N*70){
    guard++;
    const x = (rnd()*2-1)*4.6;
    const y = -2.7 + rnd()*5.4;
    const z = -5.6 + rnd()*6.2;
    let e = Math.exp(-Math.pow(x/2.45,2)) *
            Math.exp(-Math.pow((y+0.30)/2.10,2)) *
            Math.exp(-Math.pow((z+1.5)/2.70,2));
    e *= 1.0 + 2.4*Math.exp(-Math.pow((y-CFG.AP_CY)/1.30,2))*Math.exp(-Math.pow(x/1.85,2));
    e *= 1.0 + 2.0*Math.exp(-Math.pow((y+1.24)/0.54,2))*Math.exp(-Math.pow(x/2.10,2));
    e *= 1.0 - 0.52*Math.exp(-Math.pow(caseSDF(x,y)/0.36,2));
    const n = fbm(x*0.55-4.0, y*0.55+7.0, z*0.45-2.0);
    const k = Math.pow(Math.max(0.02, n-0.26)/0.74, 1.1);
    if (rnd() > Math.min(1, e*k*2.6)) continue;
    if (hiddenBySubject(x,y,z)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    att[i*3]   = 0.16 + 1.0*k*e;
    att[i*3+1] = 46.0 + 105.0*Math.pow(rnd(),1.5);
    att[i*3+2] = rnd();
    i++;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0,i*3),3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att.subarray(0,i*3),3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-0.6,-2), 14);
  return g;
}

/* =========================================================== renderer   */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:false,
  powerPreference:'high-performance', stencil:false, depth:false});
renderer.setClearColor(0x000000, 1);
renderer.autoClear = false;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CFG.FOV, 1, 0.02, 90);

const subject = new THREE.Group();
scene.add(subject);

const SHELL_VS = \`
attribute vec3 aNormal;
attribute float aSeed;
attribute float aGain;
uniform float uSize, uCamD, uGain, uTime, uPix, uAlpha, uPlateau, uRimP;
uniform vec3  uLightV;
uniform float uTorch, uTorchR;
uniform vec2  uCur;
uniform float uCurR, uPull, uAspect;
varying float vI;
varying float vHot;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 N  = normalize(normalMatrix * aNormal);

  vec4 cp0 = projectionMatrix * mv;
  vec2 nd0 = cp0.xy / max(1e-4, cp0.w);
  float dc = length((nd0 - uCur) * vec2(uAspect, 1.0));
  float w  = exp(-(dc*dc)/(2.0*uCurR*uCurR));

  float jit = fract(aSeed*311.7);
  float amp = uPull * w * (0.30 + 1.45*jit)
            * (0.72 + 0.38*sin(uTime*2.3 + aSeed*61.0));
  mv.xyz += normalize(N*0.62 + vec3(0.0,0.0,1.0)*0.85) * amp;

  vec3 V  = normalize(-mv.xyz);
  float nv = dot(N, V);
  float rim  = clamp(1.0 - abs(nv), 0.0, 1.0);
  float face = mix(0.035, 1.0, smoothstep(-0.055, 0.095, nv));
  float I = (pow(rim, uRimP) + uPlateau) * face * aGain;
  float v = fract(aSeed*97.31);
  I *= 0.30 + 1.55*v*v;
  I *= 0.78 + 0.42 * (0.5 + 0.5*sin(uTime*0.85 + aSeed*43.7));

  vec3 Lv = uLightV - mv.xyz;
  float dl = length(Lv);
  float lam = max(0.0, dot(N, Lv/max(dl,1e-4)));
  float att = 1.0 / (1.0 + (dl*dl)/(uTorchR*uTorchR));
  I += uTorch * aGain * lam*lam * att * (0.45 + 0.9*v);

  I *= 1.0 + 2.1*w*uPull*6.0;

  float depth = max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.44 + 0.86*rim*rim + 1.1*w*uPull*6.0)
               * uPix * pow(clamp(uCamD/depth, 0.05, 9.0), 0.35);
  vI = I * uGain * uAlpha;
  vHot = w*uPull*6.0;
}\`;

const SHELL_FS = \`
precision highp float;
uniform vec3 uColA, uColB;
varying float vI;
varying float vHot;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d,d)*4.0;
  float a = pow(max(0.0, 1.0 - r2), 1.9);
  float e = vI * a;
  vec3 c = mix(uColA, uColB, clamp(e*2.4, 0.0, 1.0));
  c = mix(c, vec3(0.72,0.93,1.0), clamp(vHot*0.55, 0.0, 0.65));
  gl_FragColor = vec4(c * e, 1.0);
}\`;

const DUST_VS = \`
attribute vec3 aAtt;
uniform float uSize, uCamD, uGain, uTime, uPix, uAlpha;
uniform vec2  uCur;
uniform float uCurR, uPull, uAspect, uTorch, uTorchW;
varying float vI;
varying float vS;
varying float vHot;
void main(){
  vec3 p = position;
  float s = aAtt.z;
  p.x += 0.075*sin(uTime*0.13 + s*39.0);
  p.y += 0.062*sin(uTime*0.11 + s*57.0 + 1.7);
  p.z += 0.075*sin(uTime*0.09 + s*23.0 + 3.1);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  vec4 cp0 = projectionMatrix * mv;
  vec2 nd0 = cp0.xy / max(1e-4, cp0.w);
  vec2 off = (uCur - nd0) * vec2(uAspect, 1.0);
  float dc = length(off);
  float w  = exp(-(dc*dc)/(2.0*uCurR*uCurR));
  float wt = exp(-(dc*dc)/(2.0*uTorchW*uTorchW));
  vec2 tang = vec2(-off.y, off.x);
  float k = uPull * w * (0.35 + 1.2*fract(s*173.1));
  mv.xy += (off*0.55 + tang*1.25) * k;
  mv.z  += k*0.40;

  float depth = max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aAtt.y * (1.0 + 0.45*w*uPull*6.0)
               * uPix * pow(clamp(uCamD/depth, 0.05, 9.0), 0.55);
  float tw = 0.72 + 0.46*sin(uTime*0.9 + s*61.0);
  float hot = w*uPull*6.0;
  vI = aAtt.x * uGain * uAlpha * tw * (1.0 + 0.95*hot + uTorch*wt);
  vS = aAtt.y;
  vHot = hot;
}\`;

const DUST_FS = \`
precision highp float;
uniform vec3 uColA, uColB;
varying float vI;
varying float vS;
varying float vHot;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d,d)*4.0;
  float soft = mix(2.6, 1.35, clamp((vS-0.6)/1.6, 0.0, 1.0));
  float a = pow(max(0.0, 1.0 - r2), soft);
  float e = vI * a;
  vec3 c = mix(uColA, uColB, clamp(e*0.85, 0.0, 1.0));
  c = mix(c, vec3(0.66,0.90,1.0), clamp(vHot*0.45, 0.0, 0.55));
  gl_FragColor = vec4(c * e, 1.0);
}\`;

const STREAK_VS = \`
attribute float aEnd;
attribute vec3 aAtt;
uniform float uCamD, uGain, uStreak, uAlpha, uTime;
varying float vI;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec4 cp = projectionMatrix * mv;
  vec2 ndc = cp.xy / max(1e-4, cp.w);
  float k = 1.0 + uStreak * aEnd;
  ndc *= k;
  cp.xy = ndc * cp.w;
  gl_Position = cp;
  float fade = 1.0 / (1.0 + abs(uStreak)*3.0);
  vI = aAtt.x * uGain * uAlpha * fade * (1.0 - 0.75*aEnd);
}\`;
const STREAK_FS = \`
precision highp float;
uniform vec3 uColA;
varying float vI;
void main(){ gl_FragColor = vec4(uColA * vI, 1.0); }\`;

function shellMat(colA, colB, size, gain){
  return new THREE.ShaderMaterial({
    vertexShader:SHELL_VS, fragmentShader:SHELL_FS,
    uniforms:{ uSize:{value:size}, uCamD:{value:8}, uGain:{value:gain}, uTime:{value:0},
               uPix:{value:1}, uAlpha:{value:1}, uPlateau:{value:0.036}, uRimP:{value:4.2},
               uLightV:{value:new THREE.Vector3(0,0,6)}, uTorch:{value:0}, uTorchR:{value:3.4},
               uCur:{value:new THREE.Vector2(0,0)}, uCurR:{value:0.16}, uPull:{value:0},
               uAspect:{value:1.6},
               uColA:{value:new THREE.Color(colA)}, uColB:{value:new THREE.Color(colB)} },
    transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
  });
}
const caseMat = shellMat(0x27466a, 0x33c7ff, CFG.PT_CASE, CFG.GAIN_CASE);
caseMat.uniforms.uPlateau.value = 0.130;
caseMat.uniforms.uRimP.value = 3.05;
const glassMat = shellMat(0x24425f, 0x3fd0ff, CFG.PT_CASE, CFG.GAIN_CASE*0.90);
glassMat.uniforms.uPlateau.value = 0.055;
glassMat.uniforms.uRimP.value = 2.60;
const inkMat = shellMat(0x2a4a6d, 0x46d0ff, CFG.PT_INK, CFG.GAIN_INK);
inkMat.uniforms.uPlateau.value = 0.075;
inkMat.uniforms.uRimP.value = 1.5;
const rasterMat = shellMat(0x1d5c86, 0x8fe6ff, CFG.PT_RASTER, CFG.GAIN_RASTER);
rasterMat.uniforms.uPlateau.value = 0.085;
rasterMat.uniforms.uRimP.value = 1.4;
const standMat = shellMat(0x22405e, 0x2fb4ee, CFG.PT_CASE, CFG.GAIN_CASE*0.62);
standMat.uniforms.uPlateau.value = 0.060;
standMat.uniforms.uRimP.value = 2.40;

const dustMat = new THREE.ShaderMaterial({
  vertexShader:DUST_VS, fragmentShader:DUST_FS,
  uniforms:{ uSize:{value:CFG.PT_DUST}, uCamD:{value:8}, uGain:{value:CFG.GAIN_DUST},
             uTime:{value:0}, uPix:{value:1}, uAlpha:{value:1},
             uCur:{value:new THREE.Vector2(0,0)}, uCurR:{value:0.20}, uPull:{value:0},
             uAspect:{value:1.6}, uTorch:{value:0}, uTorchW:{value:0.34},
             uColA:{value:new THREE.Color(0x0a2f78)}, uColB:{value:new THREE.Color(0x9fddff)} },
  transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
});

const caseGeo   = buildCase();
const glassGeo  = buildGlass();
const standGeo  = buildStand();
const inkGeo    = buildInk();
const rasterGeo = buildRaster();
const dustGeo   = buildDust();

const SHELLS = [
  new THREE.Points(caseGeo,   caseMat),
  new THREE.Points(glassGeo,  glassMat),
  new THREE.Points(standGeo,  standMat),
  new THREE.Points(inkGeo,    inkMat),
  new THREE.Points(rasterGeo, rasterMat),
];
for (const s of SHELLS){ s.frustumCulled = false; subject.add(s); }

const dustPts = new THREE.Points(dustGeo, dustMat);
dustPts.frustumCulled = false;
scene.add(dustPts);

const hazeMat = new THREE.ShaderMaterial({
  vertexShader:DUST_VS, fragmentShader:DUST_FS,
  uniforms:{ uSize:{value:1.0}, uCamD:{value:8}, uGain:{value:CFG.GAIN_HAZE},
             uTime:{value:0}, uPix:{value:1}, uAlpha:{value:1},
             uColA:{value:new THREE.Color(0x061c52)}, uColB:{value:new THREE.Color(0x2f9adf)} },
  transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
});
const hazePts = new THREE.Points(buildHaze(), hazeMat);
hazePts.frustumCulled = false;
scene.add(hazePts);

/* streak geometry: every Nth dust mote becomes a short radial line ----- */
function streakGeo(geo, stride){
  const src = geo.getAttribute('position'), sa = geo.getAttribute('aAtt');
  const n = Math.floor(src.count/stride);
  const pos = new Float32Array(n*6), end = new Float32Array(n*2), att = new Float32Array(n*6);
  for (let i=0;i<n;i++){
    const j = i*stride;
    for (let k=0;k<2;k++){
      pos[i*6+k*3+0]=src.getX(j); pos[i*6+k*3+1]=src.getY(j); pos[i*6+k*3+2]=src.getZ(j);
      att[i*6+k*3+0]=sa.getX(j);  att[i*6+k*3+1]=sa.getY(j);  att[i*6+k*3+2]=sa.getZ(j);
      end[i*2+k] = k;
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att,3));
  g.setAttribute('aEnd',     new THREE.BufferAttribute(end,1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-1,-2), 14);
  return g;
}
function streakMat(col, gain){
  return new THREE.ShaderMaterial({
    vertexShader:STREAK_VS, fragmentShader:STREAK_FS,
    uniforms:{ uCamD:{value:8}, uGain:{value:gain}, uStreak:{value:0}, uAlpha:{value:1},
               uTime:{value:0}, uColA:{value:new THREE.Color(col)} },
    transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
  });
}
const dustStreakMat = streakMat(0x2f9ce0, 0.15);
const dustStreaks = new THREE.LineSegments(streakGeo(dustGeo,4), dustStreakMat);
dustStreaks.frustumCulled = false; dustStreaks.visible = false;
scene.add(dustStreaks);

const caseStreakGeoSrc = (function(){
  const src = caseGeo.getAttribute('position');
  const keep = [];
  for (let i=0;i<src.count;i+=5) keep.push(i);
  const pos=new Float32Array(keep.length*3), att=new Float32Array(keep.length*3);
  for (let i=0;i<keep.length;i++){
    const j=keep[i];
    pos[i*3]=src.getX(j); pos[i*3+1]=src.getY(j); pos[i*3+2]=src.getZ(j);
    att[i*3]=1; att[i*3+1]=1; att[i*3+2]=0;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att,3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 4);
  return g;
})();
const caseStreakMat = streakMat(0x35b6f0, 0.085);
const caseStreaks = new THREE.LineSegments(streakGeo(caseStreakGeoSrc,1), caseStreakMat);
caseStreaks.frustumCulled = false; caseStreaks.visible = false;
subject.add(caseStreaks);

/* ======================================================== post chain    */
const quadGeo = new THREE.BufferGeometry();
quadGeo.setAttribute('position', new THREE.Float32BufferAttribute([-1,-1,0, 3,-1,0, -1,3,0],3));
quadGeo.setAttribute('uv',       new THREE.Float32BufferAttribute([0,0, 2,0, 0,2],2));
const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const quadScene = new THREE.Scene();
const quadMesh = new THREE.Mesh(quadGeo, null);
quadMesh.frustumCulled = false;
quadScene.add(quadMesh);
function blit(mat, target){
  quadMesh.material = mat;
  renderer.setRenderTarget(target || null);
  renderer.clear(true,false,false);
  renderer.render(quadScene, quadCam);
}

const rtOpts = { type: THREE.HalfFloatType, format: THREE.RGBAFormat,
  minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer:false, stencilBuffer:false };
let rtScene = new THREE.WebGLRenderTarget(2,2,rtOpts);
const LEVELS = 5;
let rtBright = new THREE.WebGLRenderTarget(2,2,rtOpts);
let rtA = [], rtB = [];
for (let i=0;i<LEVELS;i++){ rtA.push(new THREE.WebGLRenderTarget(2,2,rtOpts));
                            rtB.push(new THREE.WebGLRenderTarget(2,2,rtOpts)); }

const VS_QUAD = \`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }\`;

const brightMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD, uniforms:{ tDiffuse:{value:null}, uThresh:{value:CFG.BLOOM_THRESH} },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tDiffuse; uniform float uThresh;
  void main(){
    vec3 c = max(texture2D(tDiffuse, vUv).rgb, 0.0);
    c = min(c, vec3(64.0));
    float l = max(max(c.r,c.g), c.b);
    float k = clamp(max(l-uThresh, 0.0)/max(l, 1e-4), 0.0, 1.0);
    gl_FragColor = vec4(c*k, 1.0);
  }\`,
  depthTest:false, depthWrite:false
});

const blurMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD,
  uniforms:{ tDiffuse:{value:null}, uDir:{value:new THREE.Vector2(1,0)}, uTexel:{value:new THREE.Vector2()} },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tDiffuse; uniform vec2 uDir, uTexel;
  void main(){
    vec2 o = uDir*uTexel;
    vec3 s = texture2D(tDiffuse, vUv).rgb*0.2270270270;
    s += (texture2D(tDiffuse, vUv+o*1.3846153846).rgb + texture2D(tDiffuse, vUv-o*1.3846153846).rgb)*0.3162162162;
    s += (texture2D(tDiffuse, vUv+o*3.2307692308).rgb + texture2D(tDiffuse, vUv-o*3.2307692308).rgb)*0.0702702703;
    gl_FragColor = vec4(s,1.0);
  }\`,
  depthTest:false, depthWrite:false
});

const compMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD,
  uniforms:{
    tScene:{value:null}, tB0:{value:null}, tB1:{value:null}, tB2:{value:null},
    tB3:{value:null}, tB4:{value:null},
    uStrength:{value:CFG.BLOOM_STRENGTH}, uRes:{value:new THREE.Vector2()}, uTime:{value:0},
    uAmb:{value:CFG.AMBIENT}
  },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tScene, tB0, tB1, tB2, tB3, tB4;
  uniform float uStrength, uTime, uAmb; uniform vec2 uRes;
  vec3 aces(vec3 x){
    const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  void main(){
    vec3 base = max(texture2D(tScene, vUv).rgb, 0.0);
    vec3 bl = texture2D(tB0, vUv).rgb*0.10
            + texture2D(tB1, vUv).rgb*0.22
            + texture2D(tB2, vUv).rgb*0.44
            + texture2D(tB3, vUv).rgb*0.86
            + texture2D(tB4, vUv).rgb*1.30;
    vec3 col = base + max(bl, 0.0)*uStrength;
    col = aces(col*1.06);
    col = pow(max(col, 0.0), vec3(1.0/2.2));
    vec2 q = (vUv - vec2(0.5, 0.40)) * vec2(1.02, 1.38);
    col += vec3(0.004, 0.013, 0.034) * uAmb * exp(-dot(q,q)*2.7);
    float g = hash(gl_FragCoord.xy + fract(uTime)*137.0) - 0.5;
    col = clamp(col*(1.0 + g*0.055) + g*0.010, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }\`,
  depthTest:false, depthWrite:false
});
/* ============================================================== layout  */
let W=1, H=1, DPR=1;
let camDist = 8;
const SHELL_MATS = [caseMat, glassMat, standMat, inkMat, rasterMat];
/* read live off CFG rather than snapshotting it, so a host's controls can
   move the exposure of a scene that is already running                 */
const GAIN_KEYS  = ['GAIN_CASE', 'GAIN_CASE', 'GAIN_CASE', 'GAIN_INK', 'GAIN_RASTER'];
const GAIN_MULT  = [1, 0.90, 0.62, 1, 1];
function layout(){
  W = window.innerWidth; H = window.innerHeight;
  DPR = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W, H, false);
  camera.aspect = W/H;

  const half = Math.tan(THREE.MathUtils.degToRad(CFG.FOV)/2);
  /* the cabinet is keyed to viewport height, capped against width — it is
     nearly twice as wide as the hero's bust and would otherwise run off a
     portrait screen                                                      */
  const fit = Math.max(0.66, Math.min(1, (W*0.86)/H));
  camDist = 1.0 / (CFG.MON_HALF_W * fit * 2 * half);
  camera.updateProjectionMatrix();

  const yOff = (CFG.MON_CY - 0.5) * 2 * half * camDist;
  camera.position.set(0, yOff, camDist);
  camera.lookAt(0, yOff, 0);

  const w = Math.max(2, Math.round(W*DPR)), h = Math.max(2, Math.round(H*DPR));
  rtScene.setSize(w,h);
  rtBright.setSize(Math.max(2,w>>1), Math.max(2,h>>1));
  for (let i=0;i<LEVELS;i++){
    const s = 1 << (i+1);
    rtA[i].setSize(Math.max(2,Math.round(w/s)), Math.max(2,Math.round(h/s)));
    rtB[i].setSize(Math.max(2,Math.round(w/s)), Math.max(2,Math.round(h/s)));
  }
  compMat.uniforms.uRes.value.set(w,h);
  for (const m of SHELL_MATS) m.uniforms.uPix.value = DPR;
  dustMat.uniforms.uPix.value = DPR;
  hazeMat.uniforms.uPix.value = DPR;
}
window.addEventListener('resize', layout);
layout();

/* =============================================================== loop   */
const mouse = {x:0, y:0, tx:0, ty:0, on:0, onT:0, has:false};
function setPointer(e){
  mouse.tx = (e.clientX/window.innerWidth  - 0.5)*2;
  mouse.ty = (e.clientY/window.innerHeight - 0.5)*2;
  mouse.onT = 1; mouse.has = true;
}
window.addEventListener('pointermove', setPointer, {passive:true});
window.addEventListener('pointerdown', setPointer, {passive:true});
window.addEventListener('pointerleave', ()=>{ mouse.onT = 0; });
window.addEventListener('blur', ()=>{ mouse.onT = 0; });

let t0 = performance.now()/1000;
let seekT = null;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const _lw = new THREE.Vector3(), _lv = new THREE.Vector3();

function introDist(t){
  const e = Math.exp(-t/CFG.INTRO_TAU);
  const k = 1 - CFG.INTRO_A*e;
  return camDist * Math.max(0.006, k);
}

function frame(tRaw){
  const t = REDUCED ? Math.max(tRaw, CFG.INTRO_LEN) : tRaw;
  const half = Math.tan(THREE.MathUtils.degToRad(CFG.FOV)/2);
  const yOff = (CFG.MON_CY - 0.5) * 2 * half * camDist;

  const d = introDist(t);
  const dd = (CFG.INTRO_A/CFG.INTRO_TAU)*Math.exp(-t/CFG.INTRO_TAU) / Math.max(0.02, 1 - CFG.INTRO_A*Math.exp(-t/CFG.INTRO_TAU));
  const streak = Math.min(1.4, dd*0.075);

  const settle = Math.min(1, Math.max(0, (t-0.9)/1.4));
  const now = performance.now()/1000;
  const dt  = Math.min(0.05, Math.max(0.001, now - (frame._last || now - 1/60)));
  frame._last = now;
  const ease = 1 - Math.pow(0.0015, dt);
  mouse.x += (mouse.tx - mouse.x)*ease;
  mouse.y += (mouse.ty - mouse.y)*ease;
  mouse.on += (mouse.onT - mouse.on)*(1 - Math.pow(0.02, dt));

  camera.position.set(mouse.x*0.30*settle, yOff - mouse.y*0.18*settle, d);
  camera.lookAt(mouse.x*0.06*settle, yOff, 0);

  subject.rotation.y = CFG.YAW + Math.sin(t*0.11)*0.006 + mouse.x*0.135*settle;
  subject.rotation.x = Math.sin(t*0.09)*0.004 - mouse.y*0.074*settle;

  const alpha = Math.min(1, t/0.30);
  for (const m of SHELL_MATS.concat([dustMat, hazeMat])){
    m.uniforms.uCamD.value = camDist;
    m.uniforms.uTime.value = t;
    m.uniforms.uAlpha.value = alpha;
  }

  const live = mouse.on * settle * alpha;
  const pullK = REDUCED ? 0.15 : 1.0;
  _lw.set(mouse.x*2.9, yOff*0.35 - mouse.y*2.3 + 0.15, 2.35);
  _lv.copy(_lw).applyMatrix4(camera.matrixWorldInverse);
  const curX = mouse.x, curY = -mouse.y;
  for (const m of SHELL_MATS){
    m.uniforms.uLightV.value.copy(_lv);
    m.uniforms.uTorch.value = CFG.TORCH * live;
    m.uniforms.uTorchR.value = CFG.TORCH_R;
    m.uniforms.uCur.value.set(curX, curY);
    m.uniforms.uCurR.value = CFG.PULL_R;
    m.uniforms.uPull.value = CFG.PULL * live * pullK;
    m.uniforms.uAspect.value = W/H;
  }
  dustMat.uniforms.uCur.value.set(curX, curY);
  dustMat.uniforms.uCurR.value = CFG.PULL_R*1.35;
  dustMat.uniforms.uPull.value = CFG.PULL_DUST * live * pullK;
  dustMat.uniforms.uAspect.value = W/H;
  dustMat.uniforms.uTorch.value = CFG.TORCH_DUST * live;
  dustMat.uniforms.uTorchW.value = CFG.TORCH_DUST_W;

  const hot = 1/(1 + streak*1.6);
  for (let i=0;i<SHELL_MATS.length;i++) SHELL_MATS[i].uniforms.uGain.value = CFG[GAIN_KEYS[i]]*GAIN_MULT[i]*(0.80 + 0.20*hot);
  dustMat.uniforms.uGain.value = CFG.GAIN_DUST*hot;
  hazeMat.uniforms.uGain.value = CFG.GAIN_HAZE*hot;

  const showStreak = streak > 0.012;
  dustStreaks.visible = caseStreaks.visible = showStreak;
  if (showStreak){
    dustStreakMat.uniforms.uStreak.value = streak;
    caseStreakMat.uniforms.uStreak.value = streak;
    dustStreakMat.uniforms.uAlpha.value = alpha;
    caseStreakMat.uniforms.uAlpha.value = alpha;
  }

  renderer.setRenderTarget(rtScene);
  renderer.clear(true,false,false);
  renderer.render(scene, camera);

  brightMat.uniforms.tDiffuse.value = rtScene.texture;
  blit(brightMat, rtBright);

  let src = rtBright;
  for (let i=0;i<LEVELS;i++){
    const w = rtA[i].width, h = rtA[i].height;
    blurMat.uniforms.tDiffuse.value = src.texture;
    blurMat.uniforms.uDir.value.set(1,0);
    blurMat.uniforms.uTexel.value.set(1/w, 1/h);
    blit(blurMat, rtB[i]);
    blurMat.uniforms.tDiffuse.value = rtB[i].texture;
    blurMat.uniforms.uDir.value.set(0,1);
    blit(blurMat, rtA[i]);
    src = rtA[i];
  }

  compMat.uniforms.tScene.value = rtScene.texture;
  compMat.uniforms.tB0.value = rtA[0].texture;
  compMat.uniforms.tB1.value = rtA[1].texture;
  compMat.uniforms.tB2.value = rtA[2].texture;
  compMat.uniforms.tB3.value = rtA[3].texture;
  compMat.uniforms.tB4.value = rtA[4].texture;
  compMat.uniforms.uTime.value = t;
  blit(compMat, null);
}

function tick(){
  requestAnimationFrame(tick);
  if (seekT !== null) return;
  frame(performance.now()/1000 - t0);
}
tick();

window.__seek = function(t){ seekT = t; frame(t); };
window.__cfg  = CFG;
<\/script>
</body>
</html>
`,R=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Cortexa — Every signal you own, one keystroke away</title>
<meta name="description" content="Cortexa — query the whole graph without lifting your hands.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%2305070c%27/%3E%3Cellipse cx=%2716%27 cy=%2715%27 rx=%278.2%27 ry=%279.2%27 fill=%27none%27 stroke=%27%2340cfff%27 stroke-width=%272.6%27/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=block" rel="stylesheet">
<style>
:root{
  --serif:'Instrument Serif',Georgia,'Times New Roman',serif;
  --ink:#ffffff;
  --muted:rgba(228,237,248,.72);
  --dim:#7f97ba;
  --dim-2:#6d86a8;
  --page:#000000;
  --pad:44px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{
  background:var(--page);
  color:var(--ink);
  font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  overflow:hidden;
}

/* ---------------------------------------------------------------- stage */
#stage{position:fixed;inset:0;overflow:hidden;z-index:0}
#gl{position:absolute;inset:0;width:100%;height:100%;display:block}
#veil{position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(128% 84% at 50% 44%, rgba(0,0,0,0) 40%, rgba(0,0,0,.34) 76%, rgba(0,0,0,.80) 100%);
}

/* ------------------------------------------------------------------ nav */
nav{
  position:fixed;left:0;right:0;top:0;height:92px;
  display:flex;align-items:center;
  padding:0 var(--pad);
  z-index:6;
}
.brand{
  display:flex;align-items:center;gap:11px;
  color:#f4f8fc;text-decoration:none;white-space:nowrap;
}
.brand svg{display:block;width:21px;height:26px;overflow:visible;opacity:.95}
.brand span{
  font-family:var(--serif);
  font-size:22px;font-weight:400;line-height:1;letter-spacing:.004em;
}

.navpill{
  position:absolute;left:50%;top:24px;transform:translateX(-50%);
  height:44px;display:flex;align-items:center;
  padding:0 6px;border-radius:999px;
  background:rgba(4,7,12,.72);
  border:1px solid rgba(160,196,236,.13);
  backdrop-filter:blur(14px) saturate(1.1);
  -webkit-backdrop-filter:blur(14px) saturate(1.1);
}
.navpill a{
  color:rgba(233,239,247,.72);text-decoration:none;
  font-size:14px;font-weight:400;line-height:1;letter-spacing:-.006em;
  padding:0 15px;white-space:nowrap;transition:color .2s ease;
}
.navpill a:hover{color:#fff}

.navcta{
  position:absolute;right:var(--pad);top:22px;
  height:40px;display:inline-flex;align-items:center;gap:9px;
  padding:0 18px;border-radius:999px;
  color:#eef3f9;
  background:rgba(10,13,19,.52);
  border:1px solid rgba(255,255,255,.16);
  backdrop-filter:blur(12px) saturate(1.1);
  -webkit-backdrop-filter:blur(12px) saturate(1.1);
  font-size:13.5px;font-weight:450;line-height:1;letter-spacing:-.008em;
  text-decoration:none;white-space:nowrap;
  transition:border-color .2s ease,transform .2s ease;
}
.navcta:hover{border-color:rgba(255,255,255,.34);transform:translateY(-1px)}
.ring{width:7px;height:7px;border-radius:50%;border:1.3px solid currentColor;
  flex:0 0 auto;opacity:.6}

/* ------------------------------------------------------- container lines */
.rails{
  position:fixed;top:0;bottom:0;left:50%;transform:translateX(-50%);
  width:calc(100vw - var(--pad)*2 + 44px);
  display:flex;justify-content:space-between;
  z-index:4;pointer-events:none;
}
.rail{
  position:relative;width:1px;flex:0 0 1px;align-self:stretch;
  background:linear-gradient(to bottom,
    rgba(255,255,255,0) 0%, rgba(214,234,250,.115) 9%,
    rgba(214,234,250,.115) 91%, rgba(255,255,255,0) 100%);
}
.rail::before,.rail::after{
  content:"";position:absolute;left:-2.5px;width:6px;height:6px;
  background:rgba(214,234,250,.42);
}
.rail::before{top:108px}
.rail::after{bottom:108px}

/* ----------------------------------------------------------------- hero */
.stage{position:fixed;inset:0;z-index:5;pointer-events:none}
.stage > *{pointer-events:auto}

h1{
  position:absolute;left:var(--pad);top:120px;
  font-family:var(--serif);
  font-size:60px;font-weight:400;line-height:63px;letter-spacing:-.004em;
  color:#fff;white-space:nowrap;
  text-shadow:0 0 42px rgba(2,10,22,.78), 0 2px 26px rgba(0,0,0,.5);
}
h1 .dim{color:var(--dim);display:block}

.lede{
  position:absolute;left:var(--pad);top:calc(50vh + 22px);width:344px;
  font-size:15px;font-weight:400;line-height:22px;letter-spacing:-.008em;
  color:var(--muted);
  text-shadow:0 0 10px rgba(2,8,18,.95), 0 0 26px rgba(0,6,14,.85);
}
.facts{
  position:absolute;right:var(--pad);top:calc(50vh + 22px);text-align:right;
  font-size:15px;font-weight:400;line-height:22px;letter-spacing:-.008em;
  color:var(--muted);
  text-shadow:0 0 10px rgba(2,8,18,.95), 0 0 26px rgba(0,6,14,.85);
}

.bigtag{
  position:absolute;right:var(--pad);bottom:44px;text-align:right;
  font-family:var(--serif);
  font-size:60px;font-weight:400;line-height:63px;letter-spacing:-.004em;
  color:#fff;white-space:nowrap;
  text-shadow:0 0 44px rgba(2,10,22,.9), 0 2px 30px rgba(0,0,0,.6);
}
.bigtag .dim{color:var(--dim-2);display:block}

.actions{position:absolute;left:var(--pad);bottom:48px;display:flex;align-items:center;gap:14px}
.btn{
  height:46px;border-radius:23px;
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  font-size:15px;font-weight:450;line-height:1;letter-spacing:-.008em;
  text-decoration:none;white-space:nowrap;
  transition:transform .22s cubic-bezier(.22,.7,.3,1), background .22s ease, border-color .22s ease;
}
.btn-solid{
  padding:0 21px;background:#f4f7fb;color:#0a0d12;
  box-shadow:0 10px 30px rgba(0,0,0,.42);
}
.btn-solid:hover{background:#fff;transform:translateY(-1.5px)}
.btn-ghost{
  padding:0 19px;color:#eef3f9;
  background:rgba(10,13,19,.52);
  border:1px solid rgba(255,255,255,.16);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
}
.btn-ghost:hover{border-color:rgba(255,255,255,.34);transform:translateY(-1.5px)}
.btn-ghost .arw{font-size:15px;opacity:.85;transform:translateY(.5px)}

a:focus-visible{outline:2px solid rgba(190,220,255,.78);outline-offset:3px;border-radius:999px}

/* ------------------------------------------------------------ responsive */
@media (max-width:1280px){
  h1{font-size:50px;line-height:53px;top:112px}
  .bigtag{font-size:50px;line-height:53px}
}
@media (max-width:1120px){
  .navpill{display:none}
  h1{font-size:44px;line-height:47px;top:106px}
  .bigtag{font-size:40px;line-height:43px;bottom:128px}
  .lede{top:auto;bottom:246px;width:min(320px,44vw)}
  .facts{top:auto;bottom:246px}
}
@media (max-width:820px){
  h1{font-size:36px;line-height:39px;top:96px;white-space:normal;max-width:56vw}
  .bigtag{font-size:31px;line-height:34px;bottom:142px}
  .lede{bottom:250px;width:min(280px,52vw);font-size:14px;line-height:20px}
  .facts{bottom:250px;font-size:14px;line-height:20px}
}
@media (max-width:620px){
  :root{--pad:22px}
  nav{height:76px}
  .navcta{display:none}
  .facts{display:none}
  h1{font-size:31px;line-height:34px;top:82px;max-width:none}
  .lede{top:172px;bottom:auto;width:min(320px,86vw);font-size:13.5px;line-height:19px}
  .bigtag{left:var(--pad);right:auto;text-align:left;font-size:25px;line-height:28px;bottom:122px}
  .actions{bottom:40px;gap:11px}
  .btn{height:42px;font-size:14px}
  .btn-solid{padding:0 17px} .btn-ghost{padding:0 15px}
  .rail::before{top:84px} .rail::after{bottom:84px}
}
@media (max-height:720px) and (min-width:820px){
  h1{font-size:42px;line-height:45px;top:92px}
  .bigtag{font-size:30px;line-height:33px;bottom:34px}
  .lede,.facts{top:auto;bottom:150px;font-size:13.5px;line-height:19px}
  .actions{bottom:34px}
  .rail::before{top:88px} .rail::after{bottom:88px}
}
@media (max-height:560px){
  h1{font-size:34px;line-height:37px;top:78px}
  .bigtag{font-size:25px;line-height:28px;bottom:30px}
  .lede,.facts{bottom:124px;font-size:13px;line-height:18px}
  .actions{bottom:30px}
}
</style>
</head>
<body>

<div id="stage">
  <canvas id="gl"></canvas>
  <div id="veil"></div>
</div>

<div class="rails" aria-hidden="true"><span class="rail"></span><span class="rail"></span></div>

<nav>
  <a class="brand" href="#">
    <svg viewBox="0 0 22 27" fill="none" aria-hidden="true">
      <ellipse cx="11" cy="11.6" rx="8.1" ry="10.1" stroke="currentColor" stroke-width="2.1"/>
      <path d="M2.2 21.6 H19.8" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
    </svg>
    <span>Cortexa</span>
  </a>
  <div class="navpill">
    <a href="#">Platform</a>
    <a href="#">Signals</a>
    <a href="#">Console</a>
    <a href="#">Research</a>
    <a href="#">Pricing</a>
  </div>
  <a class="navcta" href="#">Open the console <i class="ring"></i></a>
</nav>

<div class="stage">
  <h1>Every signal you own,<span class="dim">one keystroke away.</span></h1>

  <p class="lede">Query the whole graph without lifting your hands &mdash;<br>the console is the product, not the consolation prize.</p>
  <p class="facts">Nothing to point at<br>Answers in seconds</p>

  <p class="bigtag"><span class="dim">Built for teams</span>who never leave the keys.</p>

  <div class="actions">
    <a class="btn btn-solid" href="#">Book a demo <i class="ring"></i></a>
    <a class="btn btn-ghost" href="#">Try the console <span class="arw">&#8627;</span></a>
  </div>
</div>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
"use strict";
/* =====================================================================
   Cortexa — Keyboard.  A companion document to the Cortexa hero.  It keeps
   that page's drawing system exactly — the scan that crowds its samples
   against a subject's own silhouette, teeth steered along the local
   contour normal, the lumpy dust volume with its moat, the volumetric haze
   wash, the dolly streaks and the five-level bloom composite — and changes
   the subject.

   The hero drew one silhouette.  This document draws seventy: the case is
   scanned exactly the way the bust was, and then every keycap is scanned
   the same way at one twentieth the size, so each cap arrives already
   wearing its own comb.  A cap top faces the lens and goes dark for free;
   what survives is the cap's edge, and a board is nothing but a field of
   edges catching the same light.
   ===================================================================== */

const CFG = {
  /* ---- framing.  A board is three times as wide as it is deep, so
         unlike the hero it is keyed to viewport WIDTH and capped against
         height rather than the other way round.                        ---- */
  KB_WIDTH_FRAC : 0.316,      /* case half-width, fraction of viewport w */
  KB_HALF_MAX   : 0.560,      /* ...but never more than this many vh     */
  KB_HALF_MIN   : 0.205,      /* ...and never less, or a phone gets a toy*/
  KB_CY         : 0.452,
  FOV           : 34,
  TILT          : 0.905,      /* how far the deck is laid back from head-on */
  YAW           : -0.085,

  /* ---- board, in case half-widths (1 unit = half of 316mm) ---- */
  U             : 0.12057,    /* one key unit, 19.05mm                   */
  GAP           : 0.0070,
  CASE_HH       : 0.3375,
  CASE_R        : 0.052,
  RIM_Z         : -0.022,     /* the case's widest point, below the deck */
  DECK_Z        : 0.0,
  CASE_FLOOR    : -0.118,
  CAP_TOP       : 0.0695,
  CAP_RIM       : 0.0575,     /* the cap's widest point                  */
  CAP_BASE      : 0.0090,
  CAP_FLARE     : 0.155,
  CAP_DISH      : 0.0075,
  CAP_R         : 0.0165,

  /* ---- scan resolution ---- */
  RINGS         : 132,
  TICK_PITCH    : 4.6/472.0,  /* comb pitch along the case border        */
  CAP_RINGS     : 21,
  CAP_PITCH     : 3.0/472.0,  /* and along a keycap's                    */
  CAP_SKIRT     : 0.44,       /* how much light the cap's wall keeps     */

  /* ---- dust ---- */
  DUST          : 92000,
  HAZE          : 1100,
  GAIN_HAZE     : 0.020,

  /* ---- point sizes (css px at dpr 1) ---- */
  PT_CASE       : 3.20,
  PT_CAP        : 2.85,
  PT_DUST       : 1.9,

  /* ---- exposure ---- */
  GAIN_CASE     : 1.36,
  GAIN_CAP      : 1.44,
  GAIN_DUST     : 0.55,

  /* ---- intro dolly: dist = D*(1 - A*exp(-t/TAU)) ---- */
  INTRO_A       : 0.955,
  INTRO_TAU     : 0.255,
  INTRO_LEN     : 2.6,

  /* ---- pointer: torch + extraction ---- */
  TORCH         : 0.50,
  TORCH_R       : 3.10,
  TORCH_DUST    : 1.05,
  TORCH_DUST_W  : 0.34,
  PULL          : 0.088,
  PULL_DUST     : 0.032,
  PULL_R        : 0.165,

  /* ---- bloom ---- */
  BLOOM_THRESH  : 0.55,
  AMBIENT       : 1.00,
  BLOOM_STRENGTH: 0.70,
};

try{
  new URLSearchParams(location.search).forEach((v,k)=>{
    if (k in CFG && typeof CFG[k] === 'number') CFG[k] = parseFloat(v);
  });
}catch(e){}

/* ---------------------------------------------------------------- utils */
const TAU = Math.PI * 2;
function mulberry(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0;
  let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }
const rnd = mulberry(20260824);

function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function sstep(a,b,x){ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); }

/* =====================================================================
   Silhouettes.  The hero solved its outline out of a measured skull
   profile; every outline here is a rounded box sampled off its distance
   field and served through the same radius/normal pair, so the case and a
   1u keycap go through identical code at a twenty-to-one scale.
   ===================================================================== */
function roundBoxSDF(x, y, hw, hh, r){
  const qx = Math.abs(x) - (hw - r), qy = Math.abs(y) - (hh - r);
  const ax = Math.max(qx,0), ay = Math.max(qy,0);
  return Math.hypot(ax,ay) + Math.min(Math.max(qx,qy),0) - r;
}
const OUT_N = 720;
function makeOutline(sdf){
  const tab = new Float64Array(OUT_N+1);
  for (let i=0;i<=OUT_N;i++){
    const phi = i/OUT_N*TAU, cx=Math.cos(phi), sy=Math.sin(phi);
    let lo=0, hi=6.0;
    for (let k=0;k<40;k++){ const m=(lo+hi)*0.5; if (sdf(cx*m, sy*m) < 0) lo=m; else hi=m; }
    tab[i] = (lo+hi)*0.5;
  }
  const R = function(phi){
    let u = phi/TAU; u -= Math.floor(u);
    const x = u*OUT_N, i = Math.floor(x), f = x-i;
    return tab[i]*(1-f) + tab[i+1]*f;
  };
  return {
    R: R,
    N: function(phi, out){
      const h=0.006;
      const r  = R(phi);
      const rp = (R(phi+h) - R(phi-h))/(2*h);
      const tx = rp*Math.cos(phi) - r*Math.sin(phi);
      const ty = rp*Math.sin(phi) + r*Math.cos(phi);
      const l  = Math.hypot(tx,ty) || 1;
      out[0] =  ty/l; out[1] = -tx/l;
    }
  };
}
const _n2=[0,0];
const caseSDF = (x,y) => roundBoxSDF(x, y, 1.0, CFG.CASE_HH, CFG.CASE_R);
const CASE_OL = makeOutline(caseSDF);

function buildMeridianTable(ol, pitch){
  const N = 2048, cum = new Float64Array(N+1);
  const h = 0.003;
  let acc = 0;
  for (let i=0;i<=N;i++){
    cum[i] = acc;
    if (i === N) break;
    const phi = (i+0.5)/N*TAU;
    const r  = ol.R(phi);
    const rp = (ol.R(phi+h) - ol.R(phi-h))/(2*h);
    acc += Math.hypot(r, rp)*(TAU/N);
  }
  const NM = Math.max(24, Math.round(acc/pitch/8)*8);
  const tab = new Float64Array(NM);
  let k = 0;
  for (let j=0;j<NM;j++){
    const want = acc*j/NM;
    while (k < N && cum[k+1] < want) k++;
    const t = (want - cum[k])/Math.max(1e-9, cum[k+1]-cum[k]);
    tab[j] = (k + t)/N*TAU;
  }
  return tab;
}
const PHI_CASE = buildMeridianTable(CASE_OL, CFG.TICK_PITCH);

/* =====================================================================
   The scan, restated once and used for both scales.  psi runs pole to
   pole, t = 1 - sin(psi) crowds the rings against the silhouette, and the
   tooth direction is steered from the contour normal at the rim back to
   radial deep inside so the pole stays a single point — all of it the
   hero's headPoint.  The front half lays a flat top with a rolled edge;
   the back half walks the same contour downward to make the side wall.
   ===================================================================== */
function bevelZ(t, e){
  if (t >= e) return 1;
  const k = 1 - t/e;
  return Math.sqrt(Math.max(0, 1 - k*k));
}
function makeSlabSurf(ol, opt){
  return function(psi, phi, out){
    const sp = Math.sin(psi), cp = Math.cos(psi);
    const t  = clamp(1 - sp, 0, 1);
    const R  = ol.R(phi);
    const cx = Math.cos(phi), sy = Math.sin(phi);
    if (cp >= 0){
      ol.N(phi, _n2);
      const wN = Math.exp(-Math.pow(t/0.30, 2));
      let ax = cx*(1-wN) + _n2[0]*wN;
      let ay = sy*(1-wN) + _n2[1]*wN;
      const al = Math.hypot(ax,ay) || 1; ax/=al; ay/=al;
      const s = opt.reach*t*(1-t) + R*t*t;
      out[0] = R*cx - ax*s;
      out[1] = R*sy - ay*s;
      out[2] = opt.rimZ + (opt.topZ - opt.rimZ)*bevelZ(t, opt.bevel)
             - opt.dish*sstep(0.22, 1.0, t);
    } else {
      const k = 1 + opt.flare*Math.pow(t, 0.85);
      out[0] = R*cx*k;
      out[1] = R*sy*k;
      out[2] = opt.rimZ - (opt.rimZ - opt.floorZ)*Math.pow(t, 0.80);
    }
  };
}

/* central-difference normal of a parametric surface ------------------ */
const _a=[0,0,0], _b=[0,0,0], _c=[0,0,0], _d=[0,0,0];
function surfNormal(fn, s, t, ds, dt, out){
  fn(s-ds, t, _a); fn(s+ds, t, _b);
  fn(s, t-dt, _c); fn(s, t+dt, _d);
  const ux=_b[0]-_a[0], uy=_b[1]-_a[1], uz=_b[2]-_a[2];
  const vx=_d[0]-_c[0], vy=_d[1]-_c[1], vz=_d[2]-_c[2];
  let nx = uy*vz-uz*vy, ny = uz*vx-ux*vz, nz = ux*vy-uy*vx;
  const l = Math.hypot(nx,ny,nz) || 1;
  out[0]=nx/l; out[1]=ny/l; out[2]=nz/l;
}

/* ================================================================ layout
   A 65 percent board: five rows of sixteen units, laid out from the same
   table a real one is cut from.                                        */
const ROWS = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  [1.5,1,1,1,1,1,1,1,1,1,1,1,1,1.5,1],
  [1.75,1,1,1,1,1,1,1,1,1,1,1,2.25,1],
  [2.25,1,1,1,1,1,1,1,1,1,1,1.75,1,1],
  [1.25,1.25,1.25,6.25,1,1,1,1,1,1],
];
/* the keys that carry a little more light than their neighbours: escape,
   the two homing keys, return, and the space bar                        */
const LIT = { '0:0':1.55, '2:4':1.40, '2:7':1.40, '2:12':1.30, '4:3':1.22, '3:12':1.25 };
/* Cherry-ish row sculpt: height off the deck, and how far the top face
   leans toward the typist                                              */
const ROW_Z    = [0.0115, 0.0030, 0.0000, 0.0035, 0.0092];
const ROW_TILT = [0.175, 0.112, 0.038, -0.032, -0.092];

const KEYS = (function(){
  const out = [];
  const half = 8*CFG.U;                         /* 16u wide, centred      */
  const fieldHalf = 2.5*CFG.U;
  for (let r=0;r<ROWS.length;r++){
    let x = -half;
    const y = fieldHalf - (r + 0.5)*CFG.U;
    for (let c=0;c<ROWS[r].length;c++){
      const w = ROWS[r][c];
      out.push({ r:r, c:c, w:w, x: x + w*CFG.U/2, y: y, lit: LIT[r+':'+c] || 1.0 });
      x += w*CFG.U;
    }
  }
  return out;
})();

const CAP_KITS = new Map();
function capKit(w){
  const key = w.toFixed(3);
  if (CAP_KITS.has(key)) return CAP_KITS.get(key);
  const hw = (w*CFG.U - CFG.GAP)/2, hh = (CFG.U - CFG.GAP)/2;
  const r  = Math.min(CFG.CAP_R, hh*0.55);
  const ol = makeOutline((x,y)=>roundBoxSDF(x,y,hw,hh,r));
  const kit = {
    hw: hw, hh: hh, ol: ol,
    phi: buildMeridianTable(ol, CFG.CAP_PITCH),
    surf: makeSlabSurf(ol, {
      reach: Math.min(hw,hh)*0.95, rimZ: CFG.CAP_RIM, topZ: CFG.CAP_TOP,
      bevel: 0.30, dish: CFG.CAP_DISH, flare: CFG.CAP_FLARE, floorZ: CFG.CAP_BASE
    })
  };
  CAP_KITS.set(key, kit);
  return kit;
}

function pack(pos,nor,seed,gain,centre,radius){
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('aNormal',  new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('aSeed',    new THREE.Float32BufferAttribute(seed,1));
  g.setAttribute('aGain',    new THREE.Float32BufferAttribute(gain,1));
  g.boundingSphere = new THREE.Sphere(centre || new THREE.Vector3(0,0,0), radius || 6);
  return g;
}

/* =============================================================== build  */
const CASE_SURF = makeSlabSurf(CASE_OL, {
  reach: 0.26, rimZ: CFG.RIM_Z, topZ: CFG.DECK_Z, bevel: 0.055,
  dish: 0, flare: 0.012, floorZ: CFG.CASE_FLOOR
});
const FIELD_HW = 8*CFG.U, FIELD_HH = 2.5*CFG.U;

function buildCase(){
  const pos=[], nor=[], seed=[], gain=[];
  const p=[0,0,0], n=[0,0,0];
  const NR = CFG.RINGS, NM = PHI_CASE.length;
  const dpsi = Math.PI/NR;
  for (let i=0;i<NR;i++){
    const psi = (i+0.5)*dpsi;
    const s = Math.sin(psi), cp = Math.cos(psi);
    const t = clamp(1-s,0,1);
    let step = 1, nm = NM;
    while (nm > 7 && nm > 6*NR*s && (nm % 2) === 0){ nm >>= 1; step <<= 1; }
    for (let j=0;j<nm;j++){
      const phi = PHI_CASE[j*step];
      CASE_SURF(psi, phi, p);
      /* the deck only exists as the bezel: the caps own everything else */
      if (cp >= 0 && Math.abs(p[0]) < FIELD_HW - 0.004 && Math.abs(p[1]) < FIELD_HH - 0.004) continue;
      surfNormal(CASE_SURF, psi, phi, 0.006, 0.004, n);
      pos.push(p[0],p[1],p[2]); nor.push(n[0],n[1],n[2]); seed.push(rnd());

      let g;
      if (cp >= 0){
        g = 0.10 + 0.90*Math.exp(-Math.pow(t/0.075,2));
        /* the front lip is the edge nearest the lens and reads hardest  */
        g *= 0.80 + 0.55*sstep(0.20,1.0,-Math.sin(phi));
      } else {
        g = 0.07 + 0.86*Math.exp(-Math.pow(t/0.098,2));
        g *= 0.40 + 0.60*Math.max(0, -Math.sin(phi));
        g *= 0.74;
      }
      gain.push(g);
    }
  }
  return pack(pos,nor,seed,gain, new THREE.Vector3(0,0,-0.05), 1.6);
}

function buildCaps(){
  const pos=[], nor=[], seed=[], gain=[];
  const p=[0,0,0], n=[0,0,0];
  for (const k of KEYS){
    const kit = capKit(k.w);
    const NR = CFG.CAP_RINGS, NM = kit.phi.length;
    const dpsi = Math.PI/NR;
    for (let i=0;i<NR;i++){
      const psi = (i+0.5)*dpsi;
      const s = Math.sin(psi), cp = Math.cos(psi);
      const t = clamp(1-s,0,1);
      let step = 1, nm = NM;
      while (nm > 7 && nm > 5*NR*s && (nm % 2) === 0){ nm >>= 1; step <<= 1; }
      /* past this the scan is deep inside the cap's own face, where every
         meridian folds onto the centre and leaves a star.  The hero could
         afford those rings because a skull's interior is metres of dark
         surface; a keycap's is four millimetres, so they are dropped.   */
      if (cp >= 0 && t > 0.42) continue;
      const ct = Math.cos(ROW_TILT[k.r]), st = Math.sin(ROW_TILT[k.r]);
      for (let j=0;j<nm;j++){
        const phi = kit.phi[j*step];
        kit.surf(psi, phi, p);
        surfNormal(kit.surf, psi, phi, 0.006, 0.005, n);
        const py = p[1]*ct - (p[2]-CFG.CAP_BASE)*st;
        const pz = p[1]*st + (p[2]-CFG.CAP_BASE)*ct + CFG.CAP_BASE + ROW_Z[k.r];
        pos.push(p[0]+k.x, py+k.y, pz);
        nor.push(n[0], n[1]*ct - n[2]*st, n[1]*st + n[2]*ct);
        seed.push(rnd());

        let g;
        if (cp >= 0){
          /* the cap's top edge is the whole drawing; its face is dead    */
          g = 0.070 + 0.930*Math.exp(-Math.pow(t/0.125,2));
        } else {
          /* and the skirt fades out before it reaches the deck           */
          g = (0.10 + 0.80*Math.exp(-Math.pow(t/0.30,2))) * (1.0 - 0.65*sstep(0.55,1.0,t));
          g *= CFG.CAP_SKIRT;
        }
        /* the row nearest the lens catches the most, the way a raking
           key light works across a board                                 */
        g *= 0.72 + 0.55*sstep(0.28,-0.28, k.y);
        g *= k.lit;
        gain.push(g);
      }
    }
    /* homing bars on the two index keys                                 */
    if (k.r === 2 && (k.c === 4 || k.c === 7)){
      const bw = kit.hw*0.42;
      for (let i=0;i<=26;i++){
        const x = k.x - bw + (2*bw)*i/26;
        const ct = Math.cos(ROW_TILT[k.r]), st = Math.sin(ROW_TILT[k.r]);
        const by = -kit.hh*0.46, bz = CFG.CAP_TOP + 0.0055 - CFG.CAP_BASE;
        for (const sgn of [1,-1]){
          pos.push(x, by*ct - bz*st + k.y, by*st + bz*ct + CFG.CAP_BASE + ROW_Z[k.r]);
          nor.push(0, sgn*ct - 0.28*st, sgn*st + 0.28*ct);
          seed.push(rnd()); gain.push(2.30);
        }
      }
    }
  }
  return pack(pos,nor,seed,gain, new THREE.Vector3(0,0,0.03), 1.6);
}

/* --------------------------------------------------------------- dust  */
function hash3(x,y,z){
  let h = Math.sin(x*127.1 + y*311.7 + z*74.7)*43758.5453;
  return h - Math.floor(h);
}
function vnoise(x,y,z){
  const xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  const xf=x-xi, yf=y-yi, zf=z-zi;
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf), w=zf*zf*(3-2*zf);
  function g(i,j,k){ return hash3(xi+i, yi+j, zi+k); }
  const c00=g(0,0,0)*(1-u)+g(1,0,0)*u, c10=g(0,1,0)*(1-u)+g(1,1,0)*u;
  const c01=g(0,0,1)*(1-u)+g(1,0,1)*u, c11=g(0,1,1)*(1-u)+g(1,1,1)*u;
  const c0=c00*(1-v)+c10*v, c1=c01*(1-v)+c11*v;
  return c0*(1-w)+c1*w;
}
function fbm(x,y,z){
  let s=0, a=0.5, f=1;
  for (let i=0;i<4;i++){ s += a*vnoise(x*f,y*f,z*f); f*=2.07; a*=0.5; }
  return s;
}
/* the board is laid back off the view axis, so unlike the hero its
   silhouette is not its own outline: build it once, as the convex hull of
   the case box projected through the same camera the dust is carved
   against, and test the cloud against that                              */
const NOM_HALF_W = 0.470;
const CAM_D = 1.0 / (NOM_HALF_W * 2 * Math.tan(CFG.FOV*Math.PI/360));
const CAM_Y = (CFG.KB_CY - 0.5) * 2 * Math.tan(CFG.FOV*Math.PI/360) * CAM_D;
const BOARD_M = new THREE.Matrix4().makeRotationY(CFG.YAW)
  .multiply(new THREE.Matrix4().makeRotationX(-(Math.PI/2 - CFG.TILT)));
const HULL = (function(){
  const v = new THREE.Vector3(), pts = [];
  for (const x of [-1.02, 1.02])
    for (const y of [-CFG.CASE_HH-0.02, CFG.CASE_HH+0.02])
      for (const z of [CFG.CASE_FLOOR-0.02, CFG.CAP_TOP+0.02]){
        v.set(x,y,z).applyMatrix4(BOARD_M);
        const sc = CAM_D/(CAM_D - v.z);
        pts.push([v.x*sc, CAM_Y + sc*(v.y - CAM_Y)]);
      }
  pts.sort((a,b)=> a[0]-b[0] || a[1]-b[1]);
  const cross = (o,a,b)=> (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const lower=[], upper=[];
  for (const p of pts){ while (lower.length>=2 && cross(lower[lower.length-2],lower[lower.length-1],p)<=0) lower.pop(); lower.push(p); }
  for (let i=pts.length-1;i>=0;i--){ const p=pts[i]; while (upper.length>=2 && cross(upper[upper.length-2],upper[upper.length-1],p)<=0) upper.pop(); upper.push(p); }
  lower.pop(); upper.pop();
  return lower.concat(upper);
})();
function inHull(px, py, grow){
  const n = HULL.length;
  for (let i=0;i<n;i++){
    const a = HULL[i], b = HULL[(i+1)%n];
    const ex = b[0]-a[0], ey = b[1]-a[1];
    const l = Math.hypot(ex,ey) || 1;
    if (((px-a[0])*ey - (py-a[1])*ex)/l > grow) return false;
  }
  return true;
}
function boardDist(x, y){                /* signed, in the screen plane  */
  let d = -1e9;
  const n = HULL.length;
  for (let i=0;i<n;i++){
    const a = HULL[i], b = HULL[(i+1)%n];
    const ex = b[0]-a[0], ey = b[1]-a[1];
    const l = Math.hypot(ex,ey) || 1;
    d = Math.max(d, ((x-a[0])*ey - (y-a[1])*ex)/l);
  }
  return d;
}
function hiddenBySubject(x,y,z){
  if (z > 0.34) return false;
  const sc = CAM_D/(CAM_D - z);
  return inHull(x*sc, CAM_Y + sc*(y - CAM_Y), 0.004);
}

function buildDust(){
  const N = CFG.DUST;
  const pos=new Float32Array(N*3), att=new Float32Array(N*3);

  function density(x,y,z){
    const big  = fbm(x*0.40+11.0, y*0.36-3.0, z*0.30+5.0);
    const mid  = fbm(x*1.15-6.0,  y*1.05+2.0, z*0.80-4.0);
    let d = 0.62*big + 0.38*mid;
    d = (d - 0.360)/0.36;
    return 0.070 + 0.930*Math.pow(Math.max(0, Math.min(1, d)), 1.35);
  }
  function envelope(x,y,z){
    let e = Math.exp(-Math.pow(x/2.75,2)) *
            Math.exp(-Math.pow((y+0.05)/2.35,2)) *
            Math.exp(-Math.pow((z+1.40)/2.90,2));
    /* the underglow: the brightest thing in the frame after the caps,
       a hot band spilling out from under the front lip                   */
    e *= 1.0 + 5.8*Math.exp(-Math.pow((y+0.50)/0.34,2))
                  *Math.exp(-Math.pow(x/1.85,2))
                  *Math.exp(-Math.pow((z-0.10)/0.75,2));
    /* and the desk carries it away from the board                        */
    e *= 1.0 + 1.5*Math.exp(-Math.pow((y+0.85)/0.62,2))*Math.exp(-Math.pow(x/2.30,2));
    return e;
  }
  function moat(x,y,z){
    return 1.0 - 0.52*Math.exp(-Math.pow(boardDist(x,y)/0.30,2));
  }

  const HALO_N = 7000, GLOW_N = 21000;
  const AMBIENT_N = N - HALO_N - GLOW_N;
  let i=0, guard=0;
  while (i<AMBIENT_N && guard<N*160){
    guard++;
    const x = (rnd()*2-1)*5.4;
    const y = -2.6 + rnd()*5.2;
    const z = -6.0 + rnd()*7.6;
    if (hiddenBySubject(x,y,z)) continue;
    const env = envelope(x,y,z);
    const d   = density(x,y,z);
    if (rnd() > Math.min(1, d*env*moat(x,y,z)*4.4)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    const star = Math.pow(rnd(),11.0);
    att[i*3]   = 0.085 + 0.86*Math.pow(d,1.20)*(0.35+0.65*env) + 0.80*star;
    att[i*3+1] = 0.36 + 0.68*Math.pow(rnd(),2.1) + 0.50*d + 1.3*star;
    att[i*3+2] = rnd();
    i++;
  }

  /* the fringe hanging off the board's own edge                          */
  const HALO = Math.min(N-i, HALO_N);
  for (let k=0;k<HALO && i<N;k++){
    const th = rnd()*TAU;
    const rr = 0.05 + Math.pow(rnd(),1.5)*0.42;
    const x = Math.cos(th)*(1.05 + rr), y = -0.05 + Math.sin(th)*(0.42 + rr*0.9);
    const z = 0.15 - Math.pow(rnd(),1.3)*0.95;
    if (hiddenBySubject(x,y,z)) continue;
    const w = Math.exp(-Math.pow(rr/0.20,2));
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    att[i*3]   = 0.07 + 0.58*w*(0.4+0.6*rnd()) + 0.9*Math.pow(rnd(),10.0);
    att[i*3+1] = 0.38 + 0.70*Math.pow(rnd(),2.4);
    att[i*3+2] = rnd();
    i++;
  }

  /* the underglow itself, sprayed tight under the front lip              */
  const GLOW = Math.min(N-i, GLOW_N);
  for (let k=0;k<GLOW && i<N;k++){
    const x = (rnd()*2-1)*1.45;
    const y = -0.42 - Math.pow(rnd(),1.35)*0.90;
    const z = 0.28 - Math.pow(rnd(),1.1)*1.10;
    if (hiddenBySubject(x,y,z)) continue;
    const w = Math.exp(-Math.pow((y+0.53)/0.30,2))*Math.exp(-Math.pow(x/1.35,2));
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    att[i*3]   = (0.09 + 2.15*w)*(0.45+0.55*rnd()) + 0.9*Math.pow(rnd(),9.0);
    att[i*3+1] = 0.42 + 0.95*Math.pow(rnd(),2.2);
    att[i*3+2] = rnd();
    i++;
  }

  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0,i*3),3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att.subarray(0,i*3),3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-0.2,-2), 15);
  return g;
}

function buildHaze(){
  const N = CFG.HAZE;
  const pos=new Float32Array(N*3), att=new Float32Array(N*3);
  let i=0, guard=0;
  while (i<N && guard<N*70){
    guard++;
    const x = (rnd()*2-1)*4.6;
    const y = -2.4 + rnd()*4.6;
    const z = -5.4 + rnd()*6.0;
    let e = Math.exp(-Math.pow(x/2.60,2)) *
            Math.exp(-Math.pow((y+0.10)/1.95,2)) *
            Math.exp(-Math.pow((z+1.3)/2.60,2));
    e *= 1.0 + 3.8*Math.exp(-Math.pow((y+0.52)/0.42,2))*Math.exp(-Math.pow(x/1.80,2));
    e *= 1.0 - 0.50*Math.exp(-Math.pow(boardDist(x,y)/0.32,2));
    const n = fbm(x*0.55-4.0, y*0.55+7.0, z*0.45-2.0);
    const k = Math.pow(Math.max(0.02, n-0.26)/0.74, 1.1);
    if (rnd() > Math.min(1, e*k*2.6)) continue;
    if (hiddenBySubject(x,y,z)) continue;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    att[i*3]   = 0.16 + 1.0*k*e;
    att[i*3+1] = 46.0 + 105.0*Math.pow(rnd(),1.5);
    att[i*3+2] = rnd();
    i++;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0,i*3),3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att.subarray(0,i*3),3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-0.2,-2), 14);
  return g;
}

/* =========================================================== renderer   */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:false,
  powerPreference:'high-performance', stencil:false, depth:false});
renderer.setClearColor(0x000000, 1);
renderer.autoClear = false;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CFG.FOV, 1, 0.02, 90);

const subject = new THREE.Group();
scene.add(subject);
/* the board sits inside the subject group already laid back, so the
   pointer parallax still turns the whole thing about the frame's axes  */
const board = new THREE.Group();
board.rotation.set(-(Math.PI/2 - CFG.TILT), CFG.YAW, 0, 'YXZ');
subject.add(board);

const SHELL_VS = \`
attribute vec3 aNormal;
attribute float aSeed;
attribute float aGain;
uniform float uSize, uCamD, uGain, uTime, uPix, uAlpha, uPlateau, uRimP;
uniform vec3  uLightV;
uniform float uTorch, uTorchR;
uniform vec2  uCur;
uniform float uCurR, uPull, uAspect;
varying float vI;
varying float vHot;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 N  = normalize(normalMatrix * aNormal);

  vec4 cp0 = projectionMatrix * mv;
  vec2 nd0 = cp0.xy / max(1e-4, cp0.w);
  float dc = length((nd0 - uCur) * vec2(uAspect, 1.0));
  float w  = exp(-(dc*dc)/(2.0*uCurR*uCurR));

  float jit = fract(aSeed*311.7);
  float amp = uPull * w * (0.30 + 1.45*jit)
            * (0.72 + 0.38*sin(uTime*2.3 + aSeed*61.0));
  mv.xyz += normalize(N*0.62 + vec3(0.0,0.0,1.0)*0.85) * amp;

  vec3 V  = normalize(-mv.xyz);
  float nv = dot(N, V);
  float rim  = clamp(1.0 - abs(nv), 0.0, 1.0);
  float face = mix(0.035, 1.0, smoothstep(-0.055, 0.095, nv));
  float I = (pow(rim, uRimP) + uPlateau) * face * aGain;
  float v = fract(aSeed*97.31);
  I *= 0.30 + 1.55*v*v;
  I *= 0.78 + 0.42 * (0.5 + 0.5*sin(uTime*0.85 + aSeed*43.7));

  vec3 Lv = uLightV - mv.xyz;
  float dl = length(Lv);
  float lam = max(0.0, dot(N, Lv/max(dl,1e-4)));
  float att = 1.0 / (1.0 + (dl*dl)/(uTorchR*uTorchR));
  I += uTorch * aGain * lam*lam * att * (0.45 + 0.9*v);

  I *= 1.0 + 2.1*w*uPull*6.0;

  float depth = max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.44 + 0.86*rim*rim + 1.1*w*uPull*6.0)
               * uPix * pow(clamp(uCamD/depth, 0.05, 9.0), 0.35);
  vI = I * uGain * uAlpha;
  vHot = w*uPull*6.0;
}\`;

const SHELL_FS = \`
precision highp float;
uniform vec3 uColA, uColB;
varying float vI;
varying float vHot;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d,d)*4.0;
  float a = pow(max(0.0, 1.0 - r2), 1.9);
  float e = vI * a;
  vec3 c = mix(uColA, uColB, clamp(e*2.4, 0.0, 1.0));
  c = mix(c, vec3(0.72,0.93,1.0), clamp(vHot*0.55, 0.0, 0.65));
  gl_FragColor = vec4(c * e, 1.0);
}\`;

const DUST_VS = \`
attribute vec3 aAtt;
uniform float uSize, uCamD, uGain, uTime, uPix, uAlpha;
uniform vec2  uCur;
uniform float uCurR, uPull, uAspect, uTorch, uTorchW;
varying float vI;
varying float vS;
varying float vHot;
void main(){
  vec3 p = position;
  float s = aAtt.z;
  p.x += 0.075*sin(uTime*0.13 + s*39.0);
  p.y += 0.062*sin(uTime*0.11 + s*57.0 + 1.7);
  p.z += 0.075*sin(uTime*0.09 + s*23.0 + 3.1);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  vec4 cp0 = projectionMatrix * mv;
  vec2 nd0 = cp0.xy / max(1e-4, cp0.w);
  vec2 off = (uCur - nd0) * vec2(uAspect, 1.0);
  float dc = length(off);
  float w  = exp(-(dc*dc)/(2.0*uCurR*uCurR));
  float wt = exp(-(dc*dc)/(2.0*uTorchW*uTorchW));
  vec2 tang = vec2(-off.y, off.x);
  float k = uPull * w * (0.35 + 1.2*fract(s*173.1));
  mv.xy += (off*0.55 + tang*1.25) * k;
  mv.z  += k*0.40;

  float depth = max(0.05, -mv.z);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aAtt.y * (1.0 + 0.45*w*uPull*6.0)
               * uPix * pow(clamp(uCamD/depth, 0.05, 9.0), 0.55);
  float tw = 0.72 + 0.46*sin(uTime*0.9 + s*61.0);
  float hot = w*uPull*6.0;
  vI = aAtt.x * uGain * uAlpha * tw * (1.0 + 0.95*hot + uTorch*wt);
  vS = aAtt.y;
  vHot = hot;
}\`;

const DUST_FS = \`
precision highp float;
uniform vec3 uColA, uColB;
varying float vI;
varying float vS;
varying float vHot;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d,d)*4.0;
  float soft = mix(2.6, 1.35, clamp((vS-0.6)/1.6, 0.0, 1.0));
  float a = pow(max(0.0, 1.0 - r2), soft);
  float e = vI * a;
  vec3 c = mix(uColA, uColB, clamp(e*0.85, 0.0, 1.0));
  c = mix(c, vec3(0.66,0.90,1.0), clamp(vHot*0.45, 0.0, 0.55));
  gl_FragColor = vec4(c * e, 1.0);
}\`;

const STREAK_VS = \`
attribute float aEnd;
attribute vec3 aAtt;
uniform float uCamD, uGain, uStreak, uAlpha, uTime;
varying float vI;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec4 cp = projectionMatrix * mv;
  vec2 ndc = cp.xy / max(1e-4, cp.w);
  float k = 1.0 + uStreak * aEnd;
  ndc *= k;
  cp.xy = ndc * cp.w;
  gl_Position = cp;
  float fade = 1.0 / (1.0 + abs(uStreak)*3.0);
  vI = aAtt.x * uGain * uAlpha * fade * (1.0 - 0.75*aEnd);
}\`;
const STREAK_FS = \`
precision highp float;
uniform vec3 uColA;
varying float vI;
void main(){ gl_FragColor = vec4(uColA * vI, 1.0); }\`;

function shellMat(colA, colB, size, gain){
  return new THREE.ShaderMaterial({
    vertexShader:SHELL_VS, fragmentShader:SHELL_FS,
    uniforms:{ uSize:{value:size}, uCamD:{value:8}, uGain:{value:gain}, uTime:{value:0},
               uPix:{value:1}, uAlpha:{value:1}, uPlateau:{value:0.036}, uRimP:{value:4.2},
               uLightV:{value:new THREE.Vector3(0,0,6)}, uTorch:{value:0}, uTorchR:{value:3.4},
               uCur:{value:new THREE.Vector2(0,0)}, uCurR:{value:0.16}, uPull:{value:0},
               uAspect:{value:1.6},
               uColA:{value:new THREE.Color(colA)}, uColB:{value:new THREE.Color(colB)} },
    transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
  });
}
const caseMat = shellMat(0x27466a, 0x33c7ff, CFG.PT_CASE, CFG.GAIN_CASE);
caseMat.uniforms.uPlateau.value = 0.120;
caseMat.uniforms.uRimP.value = 3.05;
const capMat = shellMat(0x25456a, 0x4fd4ff, CFG.PT_CAP, CFG.GAIN_CAP);
capMat.uniforms.uPlateau.value = 0.055;
capMat.uniforms.uRimP.value = 2.35;

const dustMat = new THREE.ShaderMaterial({
  vertexShader:DUST_VS, fragmentShader:DUST_FS,
  uniforms:{ uSize:{value:CFG.PT_DUST}, uCamD:{value:8}, uGain:{value:CFG.GAIN_DUST},
             uTime:{value:0}, uPix:{value:1}, uAlpha:{value:1},
             uCur:{value:new THREE.Vector2(0,0)}, uCurR:{value:0.20}, uPull:{value:0},
             uAspect:{value:1.6}, uTorch:{value:0}, uTorchW:{value:0.34},
             uColA:{value:new THREE.Color(0x0a2f78)}, uColB:{value:new THREE.Color(0x9fddff)} },
  transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
});

const caseGeo = buildCase();
const capsGeo = buildCaps();
const dustGeo = buildDust();

const SHELLS = [
  new THREE.Points(caseGeo, caseMat),
  new THREE.Points(capsGeo, capMat),
];
for (const s of SHELLS){ s.frustumCulled = false; board.add(s); }

const dustPts = new THREE.Points(dustGeo, dustMat);
dustPts.frustumCulled = false;
scene.add(dustPts);

const hazeMat = new THREE.ShaderMaterial({
  vertexShader:DUST_VS, fragmentShader:DUST_FS,
  uniforms:{ uSize:{value:1.0}, uCamD:{value:8}, uGain:{value:CFG.GAIN_HAZE},
             uTime:{value:0}, uPix:{value:1}, uAlpha:{value:1},
             uColA:{value:new THREE.Color(0x061c52)}, uColB:{value:new THREE.Color(0x2f9adf)} },
  transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
});
const hazePts = new THREE.Points(buildHaze(), hazeMat);
hazePts.frustumCulled = false;
scene.add(hazePts);

/* streak geometry: every Nth dust mote becomes a short radial line ----- */
function streakGeo(geo, stride){
  const src = geo.getAttribute('position'), sa = geo.getAttribute('aAtt');
  const n = Math.floor(src.count/stride);
  const pos = new Float32Array(n*6), end = new Float32Array(n*2), att = new Float32Array(n*6);
  for (let i=0;i<n;i++){
    const j = i*stride;
    for (let k=0;k<2;k++){
      pos[i*6+k*3+0]=src.getX(j); pos[i*6+k*3+1]=src.getY(j); pos[i*6+k*3+2]=src.getZ(j);
      att[i*6+k*3+0]=sa.getX(j);  att[i*6+k*3+1]=sa.getY(j);  att[i*6+k*3+2]=sa.getZ(j);
      end[i*2+k] = k;
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att,3));
  g.setAttribute('aEnd',     new THREE.BufferAttribute(end,1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,-1,-2), 14);
  return g;
}
function streakMat(col, gain){
  return new THREE.ShaderMaterial({
    vertexShader:STREAK_VS, fragmentShader:STREAK_FS,
    uniforms:{ uCamD:{value:8}, uGain:{value:gain}, uStreak:{value:0}, uAlpha:{value:1},
               uTime:{value:0}, uColA:{value:new THREE.Color(col)} },
    transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false
  });
}
const dustStreakMat = streakMat(0x2f9ce0, 0.15);
const dustStreaks = new THREE.LineSegments(streakGeo(dustGeo,4), dustStreakMat);
dustStreaks.frustumCulled = false; dustStreaks.visible = false;
scene.add(dustStreaks);

const capStreakGeoSrc = (function(){
  const src = capsGeo.getAttribute('position');
  const keep = [];
  for (let i=0;i<src.count;i+=7) keep.push(i);
  const pos=new Float32Array(keep.length*3), att=new Float32Array(keep.length*3);
  for (let i=0;i<keep.length;i++){
    const j=keep[i];
    pos[i*3]=src.getX(j); pos[i*3+1]=src.getY(j); pos[i*3+2]=src.getZ(j);
    att[i*3]=1; att[i*3+1]=1; att[i*3+2]=0;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aAtt',     new THREE.BufferAttribute(att,3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 4);
  return g;
})();
const capStreakMat = streakMat(0x35b6f0, 0.085);
const capStreaks = new THREE.LineSegments(streakGeo(capStreakGeoSrc,1), capStreakMat);
capStreaks.frustumCulled = false; capStreaks.visible = false;
board.add(capStreaks);

/* ======================================================== post chain    */
const quadGeo = new THREE.BufferGeometry();
quadGeo.setAttribute('position', new THREE.Float32BufferAttribute([-1,-1,0, 3,-1,0, -1,3,0],3));
quadGeo.setAttribute('uv',       new THREE.Float32BufferAttribute([0,0, 2,0, 0,2],2));
const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const quadScene = new THREE.Scene();
const quadMesh = new THREE.Mesh(quadGeo, null);
quadMesh.frustumCulled = false;
quadScene.add(quadMesh);
function blit(mat, target){
  quadMesh.material = mat;
  renderer.setRenderTarget(target || null);
  renderer.clear(true,false,false);
  renderer.render(quadScene, quadCam);
}

const rtOpts = { type: THREE.HalfFloatType, format: THREE.RGBAFormat,
  minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer:false, stencilBuffer:false };
let rtScene = new THREE.WebGLRenderTarget(2,2,rtOpts);
const LEVELS = 5;
let rtBright = new THREE.WebGLRenderTarget(2,2,rtOpts);
let rtA = [], rtB = [];
for (let i=0;i<LEVELS;i++){ rtA.push(new THREE.WebGLRenderTarget(2,2,rtOpts));
                            rtB.push(new THREE.WebGLRenderTarget(2,2,rtOpts)); }

const VS_QUAD = \`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }\`;

const brightMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD, uniforms:{ tDiffuse:{value:null}, uThresh:{value:CFG.BLOOM_THRESH} },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tDiffuse; uniform float uThresh;
  void main(){
    vec3 c = max(texture2D(tDiffuse, vUv).rgb, 0.0);
    c = min(c, vec3(64.0));
    float l = max(max(c.r,c.g), c.b);
    float k = clamp(max(l-uThresh, 0.0)/max(l, 1e-4), 0.0, 1.0);
    gl_FragColor = vec4(c*k, 1.0);
  }\`,
  depthTest:false, depthWrite:false
});

const blurMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD,
  uniforms:{ tDiffuse:{value:null}, uDir:{value:new THREE.Vector2(1,0)}, uTexel:{value:new THREE.Vector2()} },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tDiffuse; uniform vec2 uDir, uTexel;
  void main(){
    vec2 o = uDir*uTexel;
    vec3 s = texture2D(tDiffuse, vUv).rgb*0.2270270270;
    s += (texture2D(tDiffuse, vUv+o*1.3846153846).rgb + texture2D(tDiffuse, vUv-o*1.3846153846).rgb)*0.3162162162;
    s += (texture2D(tDiffuse, vUv+o*3.2307692308).rgb + texture2D(tDiffuse, vUv-o*3.2307692308).rgb)*0.0702702703;
    gl_FragColor = vec4(s,1.0);
  }\`,
  depthTest:false, depthWrite:false
});

const compMat = new THREE.ShaderMaterial({
  vertexShader:VS_QUAD,
  uniforms:{
    tScene:{value:null}, tB0:{value:null}, tB1:{value:null}, tB2:{value:null},
    tB3:{value:null}, tB4:{value:null},
    uStrength:{value:CFG.BLOOM_STRENGTH}, uRes:{value:new THREE.Vector2()}, uTime:{value:0},
    uAmb:{value:CFG.AMBIENT}
  },
  fragmentShader:\`
  precision highp float; varying vec2 vUv;
  uniform sampler2D tScene, tB0, tB1, tB2, tB3, tB4;
  uniform float uStrength, uTime, uAmb; uniform vec2 uRes;
  vec3 aces(vec3 x){
    const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  void main(){
    vec3 base = max(texture2D(tScene, vUv).rgb, 0.0);
    vec3 bl = texture2D(tB0, vUv).rgb*0.10
            + texture2D(tB1, vUv).rgb*0.22
            + texture2D(tB2, vUv).rgb*0.44
            + texture2D(tB3, vUv).rgb*0.86
            + texture2D(tB4, vUv).rgb*1.30;
    vec3 col = base + max(bl, 0.0)*uStrength;
    col = aces(col*1.06);
    col = pow(max(col, 0.0), vec3(1.0/2.2));
    vec2 q = (vUv - vec2(0.5, 0.40)) * vec2(1.02, 1.38);
    col += vec3(0.004, 0.013, 0.034) * uAmb * exp(-dot(q,q)*2.7);
    float g = hash(gl_FragCoord.xy + fract(uTime)*137.0) - 0.5;
    col = clamp(col*(1.0 + g*0.055) + g*0.010, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }\`,
  depthTest:false, depthWrite:false
});
/* ============================================================== layout  */
let W=1, H=1, DPR=1;
let camDist = 8;
const SHELL_MATS = [caseMat, capMat];
/* read live off CFG rather than snapshotting it, so a host's controls can
   move the exposure of a scene that is already running                 */
const GAIN_KEYS  = ['GAIN_CASE', 'GAIN_CAP'];
function halfWidthFor(w, h){
  return Math.max(CFG.KB_HALF_MIN, Math.min(CFG.KB_HALF_MAX, CFG.KB_WIDTH_FRAC * (w/h)));
}
function layout(){
  W = window.innerWidth; H = window.innerHeight;
  DPR = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W, H, false);
  camera.aspect = W/H;

  const half = Math.tan(THREE.MathUtils.degToRad(CFG.FOV)/2);
  camDist = 1.0 / (halfWidthFor(W,H) * 2 * half);
  camera.updateProjectionMatrix();

  const yOff = (CFG.KB_CY - 0.5) * 2 * half * camDist;
  camera.position.set(0, yOff, camDist);
  camera.lookAt(0, yOff, 0);

  const w = Math.max(2, Math.round(W*DPR)), h = Math.max(2, Math.round(H*DPR));
  rtScene.setSize(w,h);
  rtBright.setSize(Math.max(2,w>>1), Math.max(2,h>>1));
  for (let i=0;i<LEVELS;i++){
    const s = 1 << (i+1);
    rtA[i].setSize(Math.max(2,Math.round(w/s)), Math.max(2,Math.round(h/s)));
    rtB[i].setSize(Math.max(2,Math.round(w/s)), Math.max(2,Math.round(h/s)));
  }
  compMat.uniforms.uRes.value.set(w,h);
  for (const m of SHELL_MATS) m.uniforms.uPix.value = DPR;
  dustMat.uniforms.uPix.value = DPR;
  hazeMat.uniforms.uPix.value = DPR;
}
window.addEventListener('resize', layout);
layout();

/* =============================================================== loop   */
const mouse = {x:0, y:0, tx:0, ty:0, on:0, onT:0, has:false};
function setPointer(e){
  mouse.tx = (e.clientX/window.innerWidth  - 0.5)*2;
  mouse.ty = (e.clientY/window.innerHeight - 0.5)*2;
  mouse.onT = 1; mouse.has = true;
}
window.addEventListener('pointermove', setPointer, {passive:true});
window.addEventListener('pointerdown', setPointer, {passive:true});
window.addEventListener('pointerleave', ()=>{ mouse.onT = 0; });
window.addEventListener('blur', ()=>{ mouse.onT = 0; });

let t0 = performance.now()/1000;
let seekT = null;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const _lw = new THREE.Vector3(), _lv = new THREE.Vector3();

function introDist(t){
  const e = Math.exp(-t/CFG.INTRO_TAU);
  const k = 1 - CFG.INTRO_A*e;
  return camDist * Math.max(0.006, k);
}

function frame(tRaw){
  const t = REDUCED ? Math.max(tRaw, CFG.INTRO_LEN) : tRaw;
  const half = Math.tan(THREE.MathUtils.degToRad(CFG.FOV)/2);
  const yOff = (CFG.KB_CY - 0.5) * 2 * half * camDist;

  const d = introDist(t);
  const dd = (CFG.INTRO_A/CFG.INTRO_TAU)*Math.exp(-t/CFG.INTRO_TAU) / Math.max(0.02, 1 - CFG.INTRO_A*Math.exp(-t/CFG.INTRO_TAU));
  const streak = Math.min(1.4, dd*0.075);

  const settle = Math.min(1, Math.max(0, (t-0.9)/1.4));
  const now = performance.now()/1000;
  const dt  = Math.min(0.05, Math.max(0.001, now - (frame._last || now - 1/60)));
  frame._last = now;
  const ease = 1 - Math.pow(0.0015, dt);
  mouse.x += (mouse.tx - mouse.x)*ease;
  mouse.y += (mouse.ty - mouse.y)*ease;
  mouse.on += (mouse.onT - mouse.on)*(1 - Math.pow(0.02, dt));

  camera.position.set(mouse.x*0.30*settle, yOff - mouse.y*0.18*settle, d);
  camera.lookAt(mouse.x*0.06*settle, yOff, 0);

  subject.rotation.y = Math.sin(t*0.11)*0.006 + mouse.x*0.120*settle;
  subject.rotation.x = Math.sin(t*0.09)*0.004 - mouse.y*0.062*settle;

  const alpha = Math.min(1, t/0.30);
  for (const m of SHELL_MATS.concat([dustMat, hazeMat])){
    m.uniforms.uCamD.value = camDist;
    m.uniforms.uTime.value = t;
    m.uniforms.uAlpha.value = alpha;
  }

  const live = mouse.on * settle * alpha;
  const pullK = REDUCED ? 0.15 : 1.0;
  _lw.set(mouse.x*2.9, yOff*0.35 - mouse.y*2.3 + 0.15, 2.35);
  _lv.copy(_lw).applyMatrix4(camera.matrixWorldInverse);
  const curX = mouse.x, curY = -mouse.y;
  for (const m of SHELL_MATS){
    m.uniforms.uLightV.value.copy(_lv);
    m.uniforms.uTorch.value = CFG.TORCH * live;
    m.uniforms.uTorchR.value = CFG.TORCH_R;
    m.uniforms.uCur.value.set(curX, curY);
    m.uniforms.uCurR.value = CFG.PULL_R;
    m.uniforms.uPull.value = CFG.PULL * live * pullK;
    m.uniforms.uAspect.value = W/H;
  }
  dustMat.uniforms.uCur.value.set(curX, curY);
  dustMat.uniforms.uCurR.value = CFG.PULL_R*1.35;
  dustMat.uniforms.uPull.value = CFG.PULL_DUST * live * pullK;
  dustMat.uniforms.uAspect.value = W/H;
  dustMat.uniforms.uTorch.value = CFG.TORCH_DUST * live;
  dustMat.uniforms.uTorchW.value = CFG.TORCH_DUST_W;

  const hot = 1/(1 + streak*1.6);
  for (let i=0;i<SHELL_MATS.length;i++) SHELL_MATS[i].uniforms.uGain.value = CFG[GAIN_KEYS[i]]*(0.80 + 0.20*hot);
  dustMat.uniforms.uGain.value = CFG.GAIN_DUST*hot;
  hazeMat.uniforms.uGain.value = CFG.GAIN_HAZE*hot;

  const showStreak = streak > 0.012;
  dustStreaks.visible = capStreaks.visible = showStreak;
  if (showStreak){
    dustStreakMat.uniforms.uStreak.value = streak;
    capStreakMat.uniforms.uStreak.value = streak;
    dustStreakMat.uniforms.uAlpha.value = alpha;
    capStreakMat.uniforms.uAlpha.value = alpha;
  }

  renderer.setRenderTarget(rtScene);
  renderer.clear(true,false,false);
  renderer.render(scene, camera);

  brightMat.uniforms.tDiffuse.value = rtScene.texture;
  blit(brightMat, rtBright);

  let src = rtBright;
  for (let i=0;i<LEVELS;i++){
    const w = rtA[i].width, h = rtA[i].height;
    blurMat.uniforms.tDiffuse.value = src.texture;
    blurMat.uniforms.uDir.value.set(1,0);
    blurMat.uniforms.uTexel.value.set(1/w, 1/h);
    blit(blurMat, rtB[i]);
    blurMat.uniforms.tDiffuse.value = rtB[i].texture;
    blurMat.uniforms.uDir.value.set(0,1);
    blit(blurMat, rtA[i]);
    src = rtA[i];
  }

  compMat.uniforms.tScene.value = rtScene.texture;
  compMat.uniforms.tB0.value = rtA[0].texture;
  compMat.uniforms.tB1.value = rtA[1].texture;
  compMat.uniforms.tB2.value = rtA[2].texture;
  compMat.uniforms.tB3.value = rtA[3].texture;
  compMat.uniforms.tB4.value = rtA[4].texture;
  compMat.uniforms.uTime.value = t;
  blit(compMat, null);
}

function tick(){
  requestAnimationFrame(tick);
  if (seekT !== null) return;
  frame(performance.now()/1000 - t0);
}
tick();

window.__seek = function(t){ seekT = t; frame(t); };
window.__cfg  = CFG;
<\/script>
</body>
</html>
`,k=["silhouette","arcana","monitor","keyboard"],_={arcana:C,monitor:S,keyboard:R},H={silhouette:"Cortexa — neural silhouette background",arcana:"Cortexa — tarot card and orrery background",monitor:"Cortexa — cathode-ray monitor background",keyboard:"Cortexa — mechanical keyboard background"},P={scale:1,exposure:1,field:1,torch:1},m={silhouette:{scale:["HEAD_HALF_W"],exposure:["GAIN_HEAD","GAIN_BODY"],field:["GAIN_DUST","GAIN_HAZE"],torch:["TORCH","TORCH_DUST"]},arcana:{scale:["CARD_HALF_W"],exposure:["GAIN_CARD","GAIN_INK","GAIN_ORBIT"],field:["GAIN_DUST","GAIN_HAZE"],torch:["TORCH","TORCH_DUST"]},monitor:{scale:["MON_HALF_W"],exposure:["GAIN_CASE","GAIN_INK","GAIN_RASTER"],field:["GAIN_DUST","GAIN_HAZE"],torch:["TORCH","TORCH_DUST"]},keyboard:{scale:["KB_WIDTH_FRAC","KB_HALF_MAX","KB_HALF_MIN"],exposure:["GAIN_CASE","GAIN_CAP"],field:["GAIN_DUST","GAIN_HAZE"],torch:["TORCH","TORCH_DUST"]}},G={scale:[.55,1.7],exposure:[.35,1.9],field:[0,2.2],torch:[0,2.2]},x="__cortexaBaseline",F=`<script>
window.addEventListener("message", function (event) {
  var detail = event.data;
  if (!detail || detail.type !== "web3dkit-cortexa-controls") return;
  var config = window.__cfg;
  if (!config) return;
  var baseline = window.__cortexaBaseline || (window.__cortexaBaseline = Object.assign({}, config));
  var keys = detail.keys || {};
  var knobs = detail.knobs || {};
  var reframed = false;
  Object.keys(keys).forEach(function (knob) {
    (keys[knob] || []).forEach(function (key) {
      if (typeof baseline[key] !== "number" || typeof knobs[knob] !== "number") return;
      var next = baseline[key] * knobs[knob];
      if (config[key] === next) return;
      config[key] = next;
      if (knob === "scale") reframed = true;
    });
  });
  if (reframed) window.dispatchEvent(new Event("resize"));
});
<\/script>`;function z(e,n,o){return Math.min(o,Math.max(n,e))}function D(e,n,o){if(n!=="silhouette"){e.contentWindow?.postMessage({type:"web3dkit-cortexa-controls",keys:m[n],knobs:o},"*");return}const a=e.contentWindow,i=a?.__cfg;if(!a||!i)return;const l=a[x]??(a[x]={...i}),c=m[n];let t=!1;for(const r of Object.keys(c))for(const s of c[r]){const u=l[s];if(typeof u!="number")continue;const h=u*o[r];i[s]!==h&&(i[s]=h,r==="scale"&&(t=!0))}t&&a.dispatchEvent(new Event("resize"))}function N({variant:e="silhouette",presentation:n="background",scale:o,exposure:a,field:i,torch:l,...c}){const t=k.includes(e)?e:"silhouette",[r,s]=b(c),u=y(T,r),h=d.useMemo(()=>{if(t!=="silhouette")return E(_[t],{presentation:n,canvasSelector:"#gl",visualSelectors:["#veil"],bridges:[F]})},[n,t]),g=d.useCallback(v=>{const p=(w,f)=>z(w??P[f],...G[f]);D(v,t,{scale:p(o,"scale"),exposure:p(a,"exposure"),field:p(i,"field"),torch:p(l,"torch")})},[a,i,t,o,l]);return d.createElement(A,{...s,applyScene:g,backgroundCanvasSelector:n==="background"?"#gl":void 0,backgroundVisualSelector:n==="background"?"#veil":void 0,key:t,customization:u,title:H[t],sourceUrl:"/landing-pages/cortexa-hero.html",srcDoc:h})}function O(e){return M.jsx(N,{...e,presentation:"page"})}export{P as CORTEXA_HERO_SCENE_DEFAULTS,k as CORTEXA_HERO_VARIANTS,N as CortexaHero,O as CortexaPage};
