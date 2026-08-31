import{s as y,u as E,r as n,p as u,j as d,A as R,P as T}from"./index-fOQwe-l-.js";const M=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Aster — Signal First, Dashboards Second</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap">
<style>
  :root{
    --bg:#101010;
    --ink:#ffffff;
    --ink-2:#a4a4a4;
    --ink-3:#ababab;
    --ink-4:#a3a3a3;
    --ink-5:#8e8e8e;
    --pad: clamp(20px, 4.22vw, 82px);
    --font: "Roboto Flex", "Roboto Condensed", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    --nav: clamp(15px, 1.02vw, 19px);
    --body: clamp(16px, 1.17vw, 21px);
  }
  *{ box-sizing:border-box; margin:0; padding:0; }
  html,body{ height:100%; }
  body{
    background:var(--bg);
    color:var(--ink);
    font-family:var(--font);
    font-variation-settings:"wdth" 100, "opsz" 14;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    overflow:hidden;
  }
  #gl{ position:fixed; inset:0; width:100%; height:100%; display:block; z-index:0; }
  .shell{ position:relative; z-index:2; height:100%; display:flex; flex-direction:column; pointer-events:none; }
  .shell > *{ pointer-events:auto; }

  /* ---------- nav ---------- */
  .topbar{ display:flex; flex-direction:column; }
  header{
    display:flex; align-items:flex-start; justify-content:space-between;
    padding: 0 var(--pad);
  }
  .brand-nav{ display:flex; align-items:flex-start; }
  .brand{ display:block; line-height:0; margin-top:1.79vw; }
  .mark{ width:clamp(22px,1.72vw,27px); height:clamp(22px,1.72vw,27px); display:block; }
  nav{ display:flex; align-items:center; gap: clamp(20px,2.66vw,43px); margin-left: clamp(22px,2.9vw,47px); margin-top:2.73vw; }
  nav a{
    position:relative; color:var(--ink-4); text-decoration:none;
    font-size:var(--nav); line-height:1; padding:0 0 .48em;
    transition: color .35s cubic-bezier(.22,1,.36,1);
  }
  nav a::after{
    content:""; position:absolute; left:0; right:0; bottom:0; height:1.5px;
    background:currentColor; transform:scaleX(0); transform-origin:left;
    transition: transform .5s cubic-bezier(.22,1,.36,1);
  }
  nav a:hover{ color:#dcdcdc; }
  nav a:hover::after{ transform:scaleX(1); }
  nav a.is-active{ color:#fff; }
  nav a.is-active::after{ transform:scaleX(1); }

  .util{ display:flex; align-items:center; gap: clamp(20px,3.75vw,60px); margin-top:1.48vw; }
  .clock{ display:flex; align-items:center; gap: clamp(10px,1.25vw,20px); }
  .rule{ width:1px; height:3.06em; background:#3c3c3c; font-size:var(--nav); }
  .clock-txt{ line-height:1.33; margin-top:-0.26em; font-size:var(--nav); }
  .clock-txt .lbl{ font-size:max(11px, calc(var(--nav) * 0.86)); color:var(--ink-5); }
  .clock-txt .val{ font-size:var(--nav); color:#e2e2e2; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .clock-txt .val .dot{ color:#8a8a8a; padding:0 .34em; }

  /* ---------- glass + gradient-border kit ---------- */
  .glass{
    position:relative; isolation:isolate;
    background:rgba(255,255,255,.055);
    -webkit-backdrop-filter:blur(16px) saturate(1.25);
    backdrop-filter:blur(16px) saturate(1.25);
    border-radius:.64em;
  }
  /* the 1px border is a gradient masked to the frame only */
  .glass::before{
    content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
    background:linear-gradient(148deg,
      rgba(255,255,255,.72) 0%,
      rgba(255,255,255,.16) 34%,
      rgba(255,255,255,.05) 58%,
      rgba(255,255,255,.34) 100%);
    -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;
            mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask-composite:exclude;
    pointer-events:none;
    transition:filter .45s cubic-bezier(.22,1,.36,1), opacity .45s cubic-bezier(.22,1,.36,1);
  }
  /* a thin sheen along the top edge, the way light sits on real glass */
  .glass::after{
    content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
    background:linear-gradient(180deg, rgba(255,255,255,.13), rgba(255,255,255,0) 46%);
    opacity:.9;
  }

  .btn{
    display:inline-flex; align-items:center; border:0; cursor:pointer;
    font-family:inherit; font-size:var(--nav); color:#f1f1f1;
    line-height:1; letter-spacing:-0.004em; white-space:nowrap;
    transition:transform .5s cubic-bezier(.22,1,.36,1), background .4s ease, color .4s ease,
                box-shadow .5s cubic-bezier(.22,1,.36,1);
  }
  .btn:hover{
    transform:translateY(-1px); background:rgba(255,255,255,.15); color:#fff;
    box-shadow:0 8px 26px -12px rgba(255,255,255,.42);
  }
  .btn:hover::before{ filter:brightness(1.55); }
  .btn:active{ transform:translateY(0); }
  .btn:focus-visible{ outline:1px solid rgba(255,255,255,.55); outline-offset:3px; }
  .signup{ height:2.68em; padding:0 1.62em; }

  /* ---------- gradient dividers ---------- */
  .hair{
    height:1px; margin-top:1.55vw; flex:none;
    background:linear-gradient(90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,.055) 8%,
      rgba(255,255,255,.19) 42%,
      rgba(255,255,255,.07) 74%,
      rgba(255,255,255,0) 100%);
  }
  .rule{
    width:1px; height:3.06em; font-size:var(--nav); flex:none;
    background:linear-gradient(180deg,
      rgba(255,255,255,0), rgba(255,255,255,.30) 42%, rgba(255,255,255,.10) 78%, rgba(255,255,255,0));
  }
  .rule-v{
    width:1px; height:1.95em; font-size:var(--body); flex:none;
    background:linear-gradient(180deg,
      rgba(255,255,255,0), rgba(255,255,255,.26) 50%, rgba(255,255,255,0));
  }

  /* ---------- hero ---------- */
  main{ flex:1; display:flex; align-items:flex-end; justify-content:flex-end;
         padding: 0 var(--pad) clamp(24px,2.9vw,46px); }
  .hero{ max-width: min(1020px, 64vw); text-align:right; }
  h1{
    font-size: clamp(38px, 7.0vw, 140px);
    line-height:1.19;
    font-weight:400;
    font-variation-settings:"wdth" 73, "wght" 400, "opsz" 30;
    letter-spacing:0;
    margin-bottom: 0.28em;
  }
  h1 .dim{ color:var(--ink-2); display:block; }
  .lede{
    font-size:var(--body); line-height:1.25; color:var(--ink-3);
    max-width:25em; margin-left:auto; margin-bottom: 1.72em;
  }
  .actions{ display:flex; align-items:center; justify-content:flex-end; gap:clamp(14px,1.45vw,23px); }
  .cta{ height:2.62em; padding:0 .38em 0 1.14em; gap:.9em; background:rgba(255,255,255,.10); }
  .cta .chip{
    position:relative; width:1.82em; height:1.82em; border-radius:.5em;
    background:rgba(255,255,255,.10);
    display:grid; place-items:center; flex:none;
  }
  .cta .chip::before{
    content:""; position:absolute; inset:0; border-radius:inherit; padding:1px;
    background:linear-gradient(150deg, rgba(255,255,255,.75), rgba(255,255,255,.10) 62%, rgba(255,255,255,.42));
    -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;
            mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask-composite:exclude;
  }
  .cta .chip svg{ width:.82em; height:.82em; transition:transform .5s cubic-bezier(.22,1,.36,1); }
  .cta:hover .chip svg{ transform:translateX(2px); }
  .ghost{
    background:none; border:0; padding:0; cursor:pointer; color:var(--ink-4);
    font-family:inherit; font-size:var(--body); line-height:1; letter-spacing:-0.004em;
    transition:color .35s cubic-bezier(.22,1,.36,1);
  }
  .ghost:hover{ color:#e6e6e6; }
  .ghost:focus-visible{ outline:1px solid rgba(255,255,255,.5); outline-offset:4px; }

  /* reveal */
  .rv{ opacity:0; transform:translateY(14px); }
  .ready .rv{ opacity:1; transform:none; transition: opacity 1.05s cubic-bezier(.22,1,.36,1), transform 1.05s cubic-bezier(.22,1,.36,1); }
  .ready .d1{ transition-delay:.10s } .ready .d2{ transition-delay:.18s }
  .ready .d3{ transition-delay:.46s } .ready .d4{ transition-delay:.56s }
  .ready .d5{ transition-delay:.66s } .ready .d6{ transition-delay:.76s }

  @media (max-width: 1040px){ .clock{ display:none; } }
  @media (max-width: 780px){
    nav{ display:none; }
    .hero{ max-width:none; }
    h1{ font-size: clamp(34px, 9.4vw, 66px); }
    .lede{ line-height:1.5; max-width:34ch; }
  }
  @media (prefers-reduced-motion: reduce){
    .ready .rv{ transition-duration:.01s; transition-delay:0s; }
  }
</style>
</head>
<body>
<canvas id="gl"></canvas>

<div class="shell">
  <div class="topbar">
    <header>
      <div class="brand-nav">
        <a class="brand" href="#" aria-label="Aster home">
          <svg class="mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 .9 Q13.05 10.95 23.1 12 Q13.05 13.05 12 23.1 Q10.95 13.05 .9 12 Q10.95 10.95 12 .9Z" fill="#f4f4f4"/>
          </svg>
        </a>
        <nav class="rv d1">
          <a href="#" class="is-active">Home</a>
          <a href="#">Product</a>
          <a href="#">Method</a>
          <a href="#">Contact</a>
        </nav>
      </div>
      <div class="util rv d2">
        <div class="clock">
          <div class="rule"></div>
          <div class="clock-txt">
            <div class="lbl">Local time<span id="t-zone"></span></div>
            <div class="val"><span id="t-time">—</span><span class="dot">•</span><span id="t-date">—</span></div>
          </div>
        </div>
        <button class="btn glass signup">Get access</button>
      </div>
    </header>
    <div class="hair rv d2" aria-hidden="true"></div>
  </div>

  <main>
    <div class="hero">
      <h1><span class="rv d3">Signal First.</span><span class="dim rv d4">Dashboards Second.</span></h1>
      <p class="lede rv d5">Your numbers live in nine tools and none of them agree. Aster folds them
        into one readable signal, so the call you make at nine still holds at five.</p>
      <div class="actions rv d6">
        <button class="ghost">Watch the tour</button>
        <div class="rule-v" aria-hidden="true"></div>
        <button class="btn glass cta">
          Start free
          <span class="chip"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6.6 2.6 10 6l-3.4 3.4" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
      </div>
    </div>
  </main>
</div>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>
<script>
/* =========================================================================
   Aster — halftone bloom hero
   A procedural 3-D cosmos is lit off-screen, then re-photographed as a
   lattice of cross-shaped sparkles whose lower edge erodes into falling dust.
   ========================================================================= */
(function () {
'use strict';

const canvas = document.getElementById('gl');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- deterministic rng ------------------------------------------ */
function mulberry(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

/* =======================================================================
   1. FLOWER GEOMETRY
   ======================================================================= */
const TAU = Math.PI*2;

/* A rose petal: a short claw, then broad and near-circular, rounding off at
   the rim. Width is carried well past the middle so the petals read as cupped
   shells rather than as spokes. */
function widthProfile(s){
  const claw = Math.pow(Math.min(1, s/0.20), 0.52);
  const t    = Math.max(0, (s - 0.52) / 0.48);
  const rim  = Math.sqrt(Math.max(0, 1 - t*t*t));
  return claw * rim;
}

/* One petal: a swept ribbon whose tangent turns from \`tilt\` outward by \`bend\`. */
function buildPetal(o){
  const nu = o.nu||28, nv = o.nv||17;
  const L=o.L, W=o.W, bend=o.bend, tilt=o.tilt, cup=o.cup, ruffle=o.ruffle||0, twist=o.twist||0;
  const seed=o.seed||1, notch=o.notch||0, phase=o.phase||0, gain=(o.gain===undefined?1:o.gain);

  // centreline
  const C=[], F=[], S=[];
  let x=0,y=0;
  for(let i=0;i<=nu;i++){
    const s=i/nu;
    const a = tilt + bend*Math.pow(s,1.30);
    C.push([x,y,0]);
    F.push([-Math.cos(a), Math.sin(a), 0]);      // face normal, points inward
    S.push([0,0,1]);                              // width axis
    const d=L/nu;
    x += Math.sin(a)*d; y += Math.cos(a)*d;
  }

  const n = (nu+1)*(nv+1);
  const pos = new Float32Array(n*3);
  const par = new Float32Array(n*2);
  const sid = new Float32Array(n*3);
  let k=0, k2=0, k3=0;
  for(let i=0;i<=nu;i++){
    const s=i/nu;
    const w = W*widthProfile(s);
    const c=C[i], f=F[i], sx=S[i];
    const tw = twist*Math.pow(s,1.6);
    const ct=Math.cos(tw), st=Math.sin(tw);
    for(let j=0;j<=nv;j++){
      const v = j/nv*2-1;
      // a soft dip in the rim, the way a rose petal folds back at the top
      const cut = notch * Math.max(0, (s-0.80)/0.20) * (1.0 - v*v) * L * 0.13;
      // the cup: edges lift toward the flower axis, hardest near the rim
      let nn = cup*w*(v*v);
      nn += ruffle*w*Math.pow(Math.abs(v),2.2)*Math.sin(s*7.4 + seed*3.1);
      const wOff = w*v*ct - nn*st;
      const nOff = w*v*st + nn*ct;
      const a = tilt + bend*Math.pow(s,1.30);
      const tx = Math.sin(a), ty = Math.cos(a);
      pos[k++] = c[0] + sx[0]*wOff + f[0]*nOff - tx*cut;
      pos[k++] = c[1] + sx[1]*wOff + f[1]*nOff - ty*cut;
      pos[k++] = c[2] + sx[2]*wOff + f[2]*nOff;
      par[k2++] = s; par[k2++] = v;
      sid[k3++] = sx[0]*ct - f[0]*st;
      sid[k3++] = sx[1]*ct - f[1]*st;
      sid[k3++] = sx[2]*ct - f[2]*st;
    }
  }
  const idx=[];
  for(let i=0;i<nu;i++) for(let j=0;j<nv;j++){
    const a=i*(nv+1)+j, b=a+1, c=a+nv+1, d=c+1;
    idx.push(a,c,b, b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aParam',   new THREE.BufferAttribute(par,2));
  g.setAttribute('aSide',    new THREE.BufferAttribute(sid,3));
  // hinge axis, plus the phase and swing this petal takes when the rose opens
  const ax = new Float32Array(n*3), pt = new Float32Array(n*2);
  for(let i=0;i<n;i++){
    ax[i*3]=0; ax[i*3+1]=0; ax[i*3+2]=1;
    pt[i*2]=phase; pt[i*2+1]=gain;
  }
  g.setAttribute('aAxis',    new THREE.BufferAttribute(ax,3));
  g.setAttribute('aPetal',   new THREE.BufferAttribute(pt,2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/* Merge helper (r147 UMD ships no BufferGeometryUtils). */
function mergeGeoms(list){
  let vc=0, ic=0;
  for(const g of list){ vc+=g.attributes.position.count; ic+=g.index.count; }
  const pos=new Float32Array(vc*3), nor=new Float32Array(vc*3), sid=new Float32Array(vc*3),
        axs=new Float32Array(vc*3), pet=new Float32Array(vc*2),
        par=new Float32Array(vc*2), col=new Float32Array(vc*3), idx=new Uint32Array(ic);
  let vo=0, io=0;
  for(const g of list){
    const p=g.attributes.position.array, n=g.attributes.normal.array,
          a=g.attributes.aParam.array, c=g.attributes.aCol.array,
          d=g.attributes.aSide.array, x=g.attributes.aAxis.array,
          f=g.attributes.aPetal.array, ix=g.index.array;
    pos.set(p, vo*3); nor.set(n, vo*3); sid.set(d, vo*3); axs.set(x, vo*3); pet.set(f, vo*2);
    par.set(a, vo*2); col.set(c, vo*3);
    for(let i=0;i<ix.length;i++) idx[io+i]=ix[i]+vo;
    vo+=g.attributes.position.count; io+=ix.length;
  }
  const m=new THREE.BufferGeometry();
  m.setAttribute('position', new THREE.BufferAttribute(pos,3));
  m.setAttribute('normal',   new THREE.BufferAttribute(nor,3));
  m.setAttribute('aParam',   new THREE.BufferAttribute(par,2));
  m.setAttribute('aSide',    new THREE.BufferAttribute(sid,3));
  m.setAttribute('aAxis',    new THREE.BufferAttribute(axs,3));
  m.setAttribute('aPetal',   new THREE.BufferAttribute(pet,2));
  m.setAttribute('aCol',     new THREE.BufferAttribute(col,3));
  m.setIndex(new THREE.BufferAttribute(idx,1));
  return m;
}

function tintGeometry(g, inner, outer){
  const n=g.attributes.position.count, par=g.attributes.aParam.array;
  const col=new Float32Array(n*3);
  for(let i=0;i<n;i++){
    const s=par[i*2];
    const t=Math.pow(Math.min(1,s/0.62),0.9);
    col[i*3  ]=inner[0]+(outer[0]-inner[0])*t;
    col[i*3+1]=inner[1]+(outer[1]-inner[1])*t;
    col[i*3+2]=inner[2]+(outer[2]-inner[2])*t;
  }
  g.setAttribute('aCol', new THREE.BufferAttribute(col,3));
  return g;
}

/* Give a non-petal part the attributes the merge expects. */
function plainPart(g, col){
  const n=g.attributes.position.count;
  g.setAttribute('aParam', new THREE.BufferAttribute(new Float32Array(n*2),2));
  const c=new Float32Array(n*3), sd=new Float32Array(n*3), ax=new Float32Array(n*3);
  for(let i=0;i<n;i++){
    c[i*3]=col[0]; c[i*3+1]=col[1]; c[i*3+2]=col[2];
    sd[i*3]=0; sd[i*3+1]=0; sd[i*3+2]=1;         // the disc never hinges
  }
  g.setAttribute('aCol',  new THREE.BufferAttribute(c,3));
  g.setAttribute('aSide', new THREE.BufferAttribute(sd,3));
  g.setAttribute('aAxis',  new THREE.BufferAttribute(ax,3));
  g.setAttribute('aPetal', new THREE.BufferAttribute(new Float32Array(n*2),2));
  return g;
}

const _nm3 = new THREE.Matrix3(), _sv = new THREE.Vector3();
function transformGeom(g, azim, lean, roll, scale, offsetY){
  const m=new THREE.Matrix4();
  const e=new THREE.Euler(lean, azim, roll, 'YXZ');
  m.makeRotationFromEuler(e);
  m.scale(new THREE.Vector3(scale,scale,scale));
  m.setPosition(0, offsetY, 0);
  g.applyMatrix4(m);
  _nm3.setFromMatrix4(m);
  for(const key of ['aSide','aAxis']){         // direction attributes rotate too
    const at=g.attributes[key]; if(!at) continue;
    const a=at.array;
    for(let i=0;i<a.length;i+=3){
      _sv.fromArray(a,i);
      if(_sv.lengthSq() < 1e-6) continue;
      _sv.applyMatrix3(_nm3).normalize().toArray(a,i);
    }
  }
  return g;
}

function buildFlower(){
  const rnd = mulberry(20260714);
  const parts = [];
  const GOLD = Math.PI * (3 - Math.sqrt(5));    // 137.5deg between whorls

  /* ---- the rose reads through concentric rings of cupped petal rims, so
     the whorls are explicit. Each ring grows by a shrinking ratio and opens
     by an even step — that regular progression is what makes it harmonious. */
  const whorls = [
    { n:3,  L:0.34, W:0.172, tilt:0.05, bend:0.10, cup:1.32, lift:0.116, ruf:0.02, notch:0.04, gain:0.22 },
    { n:5,  L:0.55, W:0.212, tilt:0.40, bend:0.20, cup:1.06, lift:0.086, ruf:0.03, notch:0.08, gain:0.45 },
    { n:6,  L:0.80, W:0.248, tilt:0.74, bend:0.30, cup:0.86, lift:0.054, ruf:0.04, notch:0.12, gain:0.68 },
    { n:8,  L:1.05, W:0.266, tilt:0.94, bend:0.42, cup:0.67, lift:0.023, ruf:0.05, notch:0.16, gain:0.93 },
    { n:10, L:1.30, W:0.277, tilt:1.16, bend:0.54, cup:0.51, lift:0.000, ruf:0.06, notch:0.20, gain:1.20 }
  ];

  whorls.forEach((wh, w) => {
    const t = w / (whorls.length - 1);
    /* cream and bright at the heart, cooling and settling on the guards */
    const b = 1.26 - 0.40*t;
    const inner = [1.00*b, (0.955 - 0.05*t)*b, (0.870 - 0.03*t)*b];
    const outer = [(0.905 - 0.055*t)*b, (0.910 - 0.035*t)*b, (0.908 - 0.015*t)*b];

    for(let i=0;i<wh.n;i++){
      const jit = (rnd() - 0.5);
      const g = buildPetal({
        L:    wh.L * (1 + jit*0.075),
        W:    wh.W * (1 + jit*0.06),
        bend: wh.bend + jit*0.10,
        tilt: wh.tilt + jit*0.085,
        cup:  wh.cup  + jit*0.09,
        ruffle: wh.ruf,
        notch:  wh.notch,
        twist: (rnd()-0.5)*0.26*(0.25 + t),
        seed:  w*7 + i*1.7,
        phase: rnd(),
        gain:  wh.gain,
        nu: 28, nv: 17
      });
      tintGeometry(g, inner, outer);
      transformGeom(g,
        w*GOLD + i*TAU/wh.n + (rnd()-0.5)*0.10,
        (rnd()-0.5)*0.15*t,
        (rnd()-0.5)*0.12*t,
        1, wh.lift);
      parts.push(g);
    }
  });

  /* ---- the heart: a small warm receptacle the innermost petals close over */
  {
    const core=new THREE.SphereGeometry(0.072, 20, 12, 0, TAU, 0, Math.PI*0.62);
    core.scale(1, 0.85, 1); core.translate(0, 0.125, 0);
    parts.push(plainPart(core, [1.00, 0.58, 0.21]));

    for(let i=0;i<60;i++){
      const a=rnd()*TAU, rr=0.060*Math.sqrt(rnd());
      const bump=new THREE.SphereGeometry(0.0080 + rnd()*0.0045, 6, 4);
      bump.translate(Math.cos(a)*rr, 0.140 + 0.020*(1 - (rr/0.06)*(rr/0.06)), Math.sin(a)*rr);
      const warm=rnd();
      parts.push(plainPart(bump, [1.00, 0.62 + warm*0.28, 0.26 + warm*0.24]));
    }
  }
  return mergeGeoms(parts);
}

/* =======================================================================
   2. RENDERER
   ======================================================================= */
const renderer = new THREE.WebGLRenderer({ canvas, antialias:false, alpha:false, powerPreference:'high-performance' });
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;

/* Half-float colour buffers are the fast path, but not every context can
   render into them; fall back to 8-bit rather than drawing nothing. */
const _gl = renderer.getContext();
const CAN_HDR = !!(_gl.getExtension('EXT_color_buffer_float') ||
                   _gl.getExtension('EXT_color_buffer_half_float'));
const HDR_TYPE = CAN_HDR ? THREE.HalfFloatType : THREE.UnsignedByteType;

let W=1, H=1, DPR=1;
let PITCH=5.2, GW=88, GH=78;                 // halftone lattice
const field = { x:0, y:0, w:1, h:1 };        // flower rect, css px

/* ---------- render targets ---------- */
const rtOpt = { minFilter:THREE.NearestFilter, magFilter:THREE.NearestFilter,
                format:THREE.RGBAFormat, type:HDR_TYPE,
                depthBuffer:true, stencilBuffer:false };
let rtFlower = new THREE.WebGLRenderTarget(176, 156, Object.assign({samples:4}, rtOpt));
let rtScene  = new THREE.WebGLRenderTarget(2, 2, { minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
                 format:THREE.RGBAFormat, type:HDR_TYPE, depthBuffer:false, stencilBuffer:false });
let rtA = rtScene.clone(), rtB = rtScene.clone(), rtBWide = rtScene.clone();

/* =======================================================================
   3. PASS A — light the flower into a tiny buffer
   ======================================================================= */
const flowerScene = new THREE.Scene();
const flowerCam = new THREE.PerspectiveCamera(26, 176/156, 0.1, 40);
const FLOWER_TARGET = new THREE.Vector3(0, 0.30, 0);
const CAM_DIR = new THREE.Vector3(0.05, 0.952, 0.302).normalize();   // looking down into the bloom
flowerCam.position.copy(CAM_DIR).multiplyScalar(4.2).add(FLOWER_TARGET);
flowerCam.lookAt(FLOWER_TARGET);

/* ---- shadow map: petals must shade one another or the halftone reads flat */
const SHADOW_SIZE = 1024;
const rtShadow = new THREE.WebGLRenderTarget(SHADOW_SIZE, SHADOW_SIZE, {
  minFilter:THREE.NearestFilter, magFilter:THREE.NearestFilter,
  format:THREE.RGBAFormat, type:THREE.UnsignedByteType, depthBuffer:true, stencilBuffer:false });
const shadowCam = new THREE.OrthographicCamera(-1.85, 1.85, 1.85, -1.85, 2.70, 6.60);
const depthUni = { uCurl: { value: 1.15 }, uSway: { value: 0.085 },
                   uSwaySpd: { value: 0.62 }, uTime: { value: 0 } };
const depthMat = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: depthUni,
  vertexShader:\`
    attribute vec2 aParam;
    attribute vec3 aAxis;
    attribute vec2 aPetal;
    uniform float uCurl, uSway, uSwaySpd, uTime;
    varying float vD;
    vec3 rot(vec3 v, vec3 k, float c, float sn){
      return v*c + cross(k, v)*sn + k*dot(k, v)*(1.0 - c);
    }
    void main(){
      vec3 v = position;
      if(dot(aAxis, aAxis) > 0.25){
        float tw = uTime*uSwaySpd + aPetal.x*6.2831853;
        float amt = uCurl * aPetal.y * pow(aParam.x, 1.10) + uSway * sin(tw) * pow(aParam.x, 1.55);
        vec3 k = normalize(aAxis);
        v = rot(v, k, cos(amt), sin(amt));
        float yaw = uSway * 0.80 * sin(tw*0.77 + 1.7) * pow(aParam.x, 1.40);
        v = rot(v, vec3(0.0,1.0,0.0), cos(yaw), sin(yaw));
      }
      vec4 p = projectionMatrix * modelViewMatrix * vec4(v,1.0);
      vD = p.z*0.5 + 0.5; gl_Position = p; }\`,
  fragmentShader:\`precision highp float; varying float vD;
    const float ShiftRight8 = 1.0/256.0;
    vec4 packDepth(float v){
      vec4 r = vec4(fract(v*vec3(16777216.0, 65536.0, 256.0)), v);
      r.yzw -= r.xyz*ShiftRight8;
      return r*(256.0/255.0);
    }
    void main(){ gl_FragColor = packDepth(clamp(vD, 0.0, 0.999999)); }\`
});

const flowerUni = {
  uKey:      { value:new THREE.Vector3(-1.6, 2.4, 2.6) },
  uKeyCol:   { value:new THREE.Color(0.835,0.920,1.00) },
  uKeyI:     { value:1.12 },
  uCore:     { value:new THREE.Vector3(0, 0.085, 0.03) },
  uCoreCol:  { value:new THREE.Color(1.00,0.34,0.055) },
  uCoreI:    { value:11.0 },
  uFill:     { value:new THREE.Vector3(-1.95, 1.85, 2.35) },
  uFillCol:  { value:new THREE.Color(0.70,0.79,0.92) },
  uAmb:      { value:new THREE.Color(0.034,0.044,0.058) },
  uCamPos:   { value:new THREE.Vector3() },
  uShine:    { value:92.0 },
  uGain:     { value:0.235 },
  uCurl:     { value:1.15 },
  uSway:     { value:0.085 },
  uSwaySpd:  { value:0.62 },
  tShadow:   { value:rtShadow.texture },
  uShadowMat:{ value:new THREE.Matrix4() },
  uShadowTex:{ value:1.0/SHADOW_SIZE },
  uSpecI:    { value:1.15 },
  uTime:     { value:0 },
  uOpen:     { value:1 }
};

const flowerMat = new THREE.ShaderMaterial({
  uniforms: flowerUni,
  side: THREE.DoubleSide,
  vertexShader:\`
    attribute vec3 aCol;
    attribute vec2 aParam;
    attribute vec3 aSide;
    attribute vec3 aAxis;
    attribute vec2 aPetal;
    uniform float uCurl, uSway, uSwaySpd, uTime;
    varying vec3 vN; varying vec3 vW; varying vec3 vC; varying vec2 vP; varying vec3 vS;

    /* hinge the petal about its own base axis: uCurl 0 = open, >0 = bud */
    vec3 curl(vec3 v, vec3 k, float c, float sn){
      return v*c + cross(k, v)*sn + k*dot(k, v)*(1.0 - c);
    }

    void main(){
      vec3 p = position, nrm = normal, sd = aSide;
      if(dot(aAxis, aAxis) > 0.25){
        float tw = uTime*uSwaySpd + aPetal.x*6.2831853;
        /* each petal lifts and falls on its own phase … */
        float amt = uCurl * aPetal.y * pow(aParam.x, 1.10)
                  + uSway * sin(tw) * pow(aParam.x, 1.55);
        vec3 k = normalize(aAxis);
        float c = cos(amt), sn = sin(amt);
        p = curl(p, k, c, sn); nrm = curl(nrm, k, c, sn); sd = curl(sd, k, c, sn);
        /* … and sweeps sideways a little out of step with the lift */
        float yaw = uSway * 0.80 * sin(tw*0.77 + 1.7) * pow(aParam.x, 1.40);
        vec3 up = vec3(0.0, 1.0, 0.0);
        float yc = cos(yaw), ys = sin(yaw);
        p = curl(p, up, yc, ys); nrm = curl(nrm, up, yc, ys); sd = curl(sd, up, yc, ys);
      }
      vC = aCol; vP = aParam;
      vec4 wp = modelMatrix * vec4(p,1.0);
      vW = wp.xyz;
      vN = normalize(mat3(modelMatrix) * nrm);
      vS = normalize(mat3(modelMatrix) * sd);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }\`,
  fragmentShader:\`
    precision highp float;
    uniform vec3 uKey, uCore, uFill, uCamPos;
    uniform vec3 uKeyCol, uCoreCol, uFillCol, uAmb;
    uniform float uKeyI, uCoreI, uShine, uSpecI, uTime, uGain, uShadowTex;
    uniform sampler2D tShadow;
    uniform mat4 uShadowMat;
    varying vec3 vN; varying vec3 vW; varying vec3 vC; varying vec2 vP; varying vec3 vS;

    float h21(vec2 p){ p = fract(p*vec2(127.31, 311.7)); p += dot(p, p + 34.21); return fract(p.x*p.y); }
    float vnoise(vec2 p){
      vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(h21(i), h21(i+vec2(1,0)), f.x),
                 mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y);
    }

    float unpackDepth(vec4 v){
      return dot(v, (255.0/256.0)/vec4(16777216.0, 65536.0, 256.0, 1.0));
    }

    void main(){
      float onPetal = step(0.0001, abs(vP.x) + abs(vP.y));   // 0 for the disc parts
      vec3 N = normalize(vN);
      vec3 V = normalize(uCamPos - vW);
      if(!gl_FrontFacing) N = -N;
      /* ---- petal surface: ribs, mottle, and shade toward the throat --- */
      float ribs  = 0.5 + 0.5*sin(vP.y*31.0 + vP.x*3.4 + vC.r*7.0);
      float broad = vnoise(vec2(vP.x*3.1 + vC.g*13.0, vP.y*1.9));
      float mott  = vnoise(vec2(vP.x*17.0 + vC.g*23.0, vP.y*9.0));
      float mott2 = vnoise(vec2(vP.x*47.0 + vC.b*11.0, vP.y*23.0));
      float ao    = mix(0.30, 1.14, smoothstep(0.0, 0.72, vP.x))
                  * mix(0.74, 1.0, smoothstep(1.0, 0.52, abs(vP.y)));
      vec3 alb = vC * (0.46 + 0.42*broad + 0.34*mott + 0.18*mott2 + 0.09*ribs) * ao;

      /* ambient with a cool sky / warm ground split */
      vec3 lit = alb * mix(uAmb*0.55, uAmb*1.6, N.y*0.5+0.5);

      /* key: broad enough to model the petals, wrapped so they never
         fall to pure black on the shadow side ---------------------------- */
      vec3 kd = uKey - vW;
      float kdist = length(kd);
      vec3 L = kd / kdist;
      float attD = 2.05 / (0.60 + 0.26*kdist*kdist);
      float att  = 1.0 / (0.16 + 0.86*kdist*kdist);
      float ndl  = max(dot(N,L), 0.0);
      float wrap = clamp((dot(N,L) + 0.13)/1.13, 0.0, 1.0);

      /* soft shadow lookup — 9 taps, normal-scaled bias */
      vec4 spos = uShadowMat * vec4(vW, 1.0);
      vec3 sc = spos.xyz / spos.w;
      vec2 suv = sc.xy*0.5 + 0.5;
      float sd = sc.z*0.5 + 0.5;
      float bias = 0.0016 + 0.0060*(1.0 - abs(dot(N,L)));
      float shade = 0.0;
      if(suv.x > 0.0 && suv.x < 1.0 && suv.y > 0.0 && suv.y < 1.0){
        for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
          float ref = unpackDepth(texture2D(tShadow, suv + vec2(float(i), float(j))*uShadowTex*1.7));
          shade += step(sd - bias, ref);
        }
        shade /= 9.0;
      } else shade = 1.0;
      shade = mix(mix(0.62, 0.26, onPetal), 1.0, shade);

      lit += alb * uKeyCol * (wrap*wrap * uKeyI * attD * shade);

      /* thin-petal translucency: light bleeding through from behind */
      float back = max(dot(-N,L), 0.0);
      float thin = 1.0 - smoothstep(0.15, 0.85, vP.x);
      lit += alb * uKeyCol * (pow(back,2.6) * 0.42 * att * (0.30+0.70*thin));

      /* warm core ------------------------------------------------------- */
      vec3 cd = uCore - vW;
      float cdist = length(cd);
      vec3 L2 = cd / cdist;
      float catt = 1.0/(0.55 + 9.0*cdist*cdist);
      lit += alb * uCoreCol * (max(dot(N,L2),0.0) * uCoreI * catt);
      lit += alb * uCoreCol * (pow(max(dot(-N,L2),0.0),1.6) * 0.30 * catt);

      /* a fixed shoulder light keeps the bloom readable while the key sweeps */
      vec3 fd = uFill - vW;
      float fdist = length(fd);
      vec3 L3 = fd / fdist;
      float fwrap = clamp((dot(N,L3) + 0.22)/1.22, 0.0, 1.0);
      lit += alb * uFillCol * (fwrap*fwrap * 0.60 / (0.75 + 0.16*fdist*fdist));

      /* fresnel rim ------------------------------------------------------ */
      float fres = pow(1.0 - max(dot(N,V),0.0), 3.4);
      lit += vec3(0.62,0.72,0.84) * fres * 0.11;

      /* specular --------------------------------------------------------- */
      vec3 Hv = normalize(L + V);
      /* the bloom is dewy: the highlight breaks into grains, never a streak */
      float glint = pow(vnoise(vec2(vP.x*73.0 + 5.0, vP.y*35.0)), 3.6);
      float sp = pow(max(dot(N,Hv),0.0), uShine) * ndl * att * uSpecI * (0.16 + 5.2*glint) * shade;
      vec3 Hc = normalize(L2 + V);
      float sp2 = pow(max(dot(N,Hc),0.0), 34.0) * max(dot(N,L2),0.0) * catt * 1.1;

      lit += uKeyCol * sp + uCoreCol * sp2;

      /* the disc florets carry their own warmth, so the far half of the
         button never reads as a hole punched in the middle of the flower */
      lit += vC * (1.0 - onPetal) * vec3(0.62, 0.27, 0.075);

      /* a petal seen edge-on is a sliver of nothing, not a hard bar */
      float facing = smoothstep(0.05, 0.44, abs(dot(N, V)));
      lit *= facing;

      gl_FragColor = vec4(lit*uGain, (sp + sp2*0.45)*uGain*facing);
    }\`
});

const flowerGeo = buildFlower();
const flowerMesh = new THREE.Mesh(flowerGeo, flowerMat);
flowerMesh.rotation.x = -0.05;
flowerMesh.rotation.z = 0.05;
const flowerPivot = new THREE.Group();
flowerPivot.add(flowerMesh);
flowerScene.add(flowerPivot);

/* Frame the bloom so it fills the buffer no matter how the petals fall. */
const _v3a = new THREE.Vector3(), _v3b = new THREE.Vector3(), _v3c = new THREE.Vector3();
function fitFlower(aspect, coverage){
  flowerScene.updateMatrixWorld(true);
  const pos = flowerGeo.attributes.position;
  const bb = new THREE.Box3();
  for(let i=0;i<pos.count;i++){ bb.expandByPoint(_v3a.fromBufferAttribute(pos,i).applyMatrix4(flowerMesh.matrixWorld)); }
  FLOWER_TARGET.copy(bb.getCenter(_v3a));
  const sphereR = bb.getSize(_v3b).length()*0.5;

  flowerCam.aspect = aspect;
  const vFov = flowerCam.fov*Math.PI/180;
  const hFov = 2*Math.atan(Math.tan(vFov*0.5)*aspect);
  let dist = sphereR / Math.sin(Math.min(vFov,hFov)*0.5);

  const place = () => {
    flowerCam.position.copy(CAM_DIR).multiplyScalar(dist).add(FLOWER_TARGET);
    flowerCam.lookAt(FLOWER_TARGET);
    flowerCam.updateProjectionMatrix();
    flowerCam.updateMatrixWorld(true);
  };
  place();

  for(let pass=0; pass<5; pass++){
    let minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;
    for(let i=0;i<pos.count;i+=2){
      _v3c.fromBufferAttribute(pos,i).applyMatrix4(flowerMesh.matrixWorld).project(flowerCam);
      if(_v3c.x<minX)minX=_v3c.x; if(_v3c.x>maxX)maxX=_v3c.x;
      if(_v3c.y<minY)minY=_v3c.y; if(_v3c.y>maxY)maxY=_v3c.y;
    }
    const cx=(minX+maxX)*0.5, cy=(minY+maxY)*0.5;
    const ext=Math.max(maxX-minX, maxY-minY)*0.5;
    const halfH = Math.tan(vFov*0.5)*dist, halfW = halfH*aspect;
    flowerCam.matrixWorld.extractBasis(_v3a, _v3b, _v3c);
    FLOWER_TARGET.addScaledVector(_v3a, cx*halfW).addScaledVector(_v3b, cy*halfH);
    if(ext > 1e-4) dist *= ext/coverage;
    place();
    if(Math.abs(ext/coverage - 1) < 0.003 && Math.abs(cx) < 0.003 && Math.abs(cy) < 0.003) break;
  }
}

/* =======================================================================
   4. PASS B — re-photograph that buffer as a lattice of sparkles
   ======================================================================= */
const dotScene = new THREE.Scene();
const dotCam = new THREE.OrthographicCamera(0, 1, 0, -1, -10, 10);

const dotUni = {
  tFlower:  { value: rtFlower.texture },
  uGrid:    { value: new THREE.Vector2(GW, GH) },
  uFieldMin:{ value: new THREE.Vector2() },
  uFieldSize:{value: new THREE.Vector2() },
  uPitch:   { value: PITCH },
  uDpr:     { value: 1 },
  uTime:    { value: 0 },
  uPointer: { value: new THREE.Vector2() },
  uPtrPx:   { value: new THREE.Vector2(-9999,-9999) },
  uPtrOn:   { value: 0.0 },
  uPtrR:    { value: 160.0 },
  uIntro:   { value: 0 },
  uErode:   { value: new THREE.Vector2(0.79, 1.22) },
  uExpo:    { value: 2.15 },
  uSpecG:   { value: 5.5 },   // start / end of the dissolve ramp
  uFall:    { value: 1.0 }
};

const SPRITE_VS = \`
  precision highp float;
  attribute vec2 aCell;
  attribute vec4 aRnd;
  uniform sampler2D tFlower;
  uniform vec2  uGrid, uFieldMin, uFieldSize, uPointer, uPtrPx;
  uniform float uPitch, uDpr, uTime, uIntro, uFall, uExpo, uSpecG, uPtrOn, uPtrR;
  uniform vec2  uErode;
  varying vec3  vCol;
  varying float vCoreR, vArmL, vArmLy, vArmT, vHaloR, vHaloI, vCrossI;

  #define LUM(c) dot((c), vec3(0.2126, 0.7152, 0.0722))

  float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; p*=p+p; return fract(p); }

  void main(){
    /* --- 4-tap box filter of the 2x super-sampled flower buffer -------- */
    vec2 uv = (aCell + 0.5) / uGrid;
    vec2 o  = 0.25 / uGrid;
    vec4 s = 0.25*( texture2D(tFlower, uv + vec2(-o.x,-o.y))
                  + texture2D(tFlower, uv + vec2( o.x,-o.y))
                  + texture2D(tFlower, uv + vec2(-o.x, o.y))
                  + texture2D(tFlower, uv + vec2( o.x, o.y)) );

    vec3 col  = max(s.rgb, 0.0);
    float lum = dot(col, vec3(0.2126,0.7152,0.0722));
    float spec= max(s.a, 0.0);

    /* --- where this cell lives when it is at rest --------------------- */
    vec2 home = uFieldMin + aCell/uGrid*uFieldSize + 0.5*uFieldSize/uGrid;

    /* --- the pointer is a torch, but only while it rests on a petal ---
       Sample the bloom buffer under the cursor itself: off the flower there
       is nothing to catch, so nothing lights. */
    vec2  ptrUv  = (uPtrPx - uFieldMin) / uFieldSize;
    float onBloom = 0.0;
    if(ptrUv.x > -0.03 && ptrUv.x < 1.03 && ptrUv.y > -0.03 && ptrUv.y < 1.03){
      vec2 o2 = 1.7 / uGrid;
      vec2 c0 = clamp(ptrUv, vec2(0.0), vec2(1.0));
      float l = LUM(texture2D(tFlower, c0).rgb);
      l = max(l, LUM(texture2D(tFlower, clamp(ptrUv + vec2( o2.x, 0.0), 0.0, 1.0)).rgb));
      l = max(l, LUM(texture2D(tFlower, clamp(ptrUv + vec2(-o2.x, 0.0), 0.0, 1.0)).rgb));
      l = max(l, LUM(texture2D(tFlower, clamp(ptrUv + vec2(0.0,  o2.y), 0.0, 1.0)).rgb));
      l = max(l, LUM(texture2D(tFlower, clamp(ptrUv + vec2(0.0, -o2.y), 0.0, 1.0)).rgb));
      onBloom = smoothstep(0.010, 0.048, l * uExpo);
    }

    vec2  dp    = (home - uPtrPx) / max(uPtrR, 1.0);
    float torch = uPtrOn * onBloom * exp(-dot(dp, dp) * 2.30);

    /* --- erosion: the lower the cell sits, the likelier it lets go ----- */
    float depth = (aCell.y + 0.5) / uGrid.y;            // 0 = top of field
    float across= (aCell.x + 0.5) / uGrid.x;
    float wob   = 0.10*sin(across*13.0 + 1.3) + 0.07*sin(across*29.0 + 4.1);
    float bias  = smoothstep(uErode.x + wob, uErode.y + wob, depth);
    float mottle= hash11(aCell.x*7.31 + aCell.y*131.7);
    bias = max(bias, torch*0.80);
    float willFall = step(mottle, bias*0.88) * uFall;

    float rate  = (0.052 + aRnd.x*0.075) * (1.0 + torch*2.6);
    float phase = fract(uTime*rate + aRnd.y);
    float hold  = mix(0.46, 0.27, clamp(torch*1.4, 0.0, 1.0));
    float t     = clamp((phase - hold) / (1.0 - hold), 0.0, 1.0);
    float falling = willFall * step(hold, phase);

    /* --- position in css pixels --------------------------------------- */
    vec2 p = home;

    float ease = t*t*(0.55 + 0.45*t);
    float fallDist = uFieldSize.y * (0.40 + aRnd.z*1.20);
    vec2 off = vec2(
      (sin(t*3.4 + aRnd.w*6.283)*0.45 + (aRnd.w-0.5)*1.7) * uFieldSize.x*0.085*t
        + uPointer.x*22.0*t*t,
      fallDist * ease
    );
    p += off * falling;

    /* gentle breath of the whole lattice */
    float br = sin(uTime*0.42 + depth*2.1)*0.5+0.5;
    p += vec2(uPointer.x, uPointer.y) * (10.0 + 6.0*depth);
    p.y += (br-0.5) * uPitch * 0.55;

    /* --- intro: cells rise into place --------------------------------- */
    float iw = clamp((uIntro - depth*0.30 - mottle*0.16) / 0.62, 0.0, 1.0);
    float ie = 1.0 - pow(1.0 - iw, 3.0);
    p.y += (1.0 - ie) * (60.0 + 140.0*mottle);
    p.x += (1.0 - ie) * (mottle-0.5) * 40.0;

    /* --- brightness ---------------------------------------------------- */
    float alpha = ie;
    alpha *= mix(1.0, (1.0 - t)*(1.0 - t) * smoothstep(0.0,0.10,t), falling);
    col  = mix(col, mix(col, vec3(lum)*vec3(0.86,0.92,1.0), 0.72), falling*t);

    /* The screen keeps a constant cell; the ink carries the tone. */
    float tone  = pow(clamp(lum*uExpo, 0.0, 1.40), 1.13);

    /* every cell is one grain of the screen; a few catch the light hard */
    float grain = hash11(aCell.x*13.13 + aCell.y*57.31 + 3.7);
    float twk   = 0.5 + 0.5*sin(uTime*2.6 + grain*61.0);
    float gain  = 0.07 + 7.5*pow(grain, 4.2)*(0.35 + 0.65*twk);

    float lumN = clamp(tone*1.7, 0.0, 1.0);
    float specN= clamp(spec*uSpecG*gain, 0.0, 30.0);
    col *= uExpo;

    /* the cursor only loosens petals — it never tints or sparks them */
    float heat = clamp(torch, 0.0, 1.0);
    col *= 1.0 + heat*0.22;

    if(tone < 0.012 && specN < 0.02){
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      return;
    }

    /* --- sprite metrics (css px) --------------------------------------- */
    float sparkle = 0.94 + 0.06*sin(uTime*2.3 + aRnd.y*39.0);
    float coreR = uPitch * (0.205 + 0.095*lumN);
    float armL  = uPitch * (0.58 + 0.13*lumN) * sparkle;
    float armT  = uPitch * (0.152 + 0.105*lumN);
    float flare = pow(min(specN,30.0), 0.60);
    armL  += uPitch * flare * 2.05;
    armT  += flare * uPitch * 0.042;
    float haloR = uPitch*0.42 + flare*uPitch*0.30;
    float haloI = min(flare*0.021, 0.19);

    /* a cell in flight streaks along its own fall — the blur-down look */
    float smear = falling * (0.30 + 0.70*t) * (1.0 + 1.3*heat);
    float armLy = armL * (1.0 + smear*2.4);

    float half_ = max(max(max(armL, armLy), haloR*1.5), coreR + 1.0);
    float size  = min(half_*2.0, 96.0);

    vCoreR  = coreR / size;
    vArmL   = armL  / size;
    vArmLy  = armLy / size;
    vArmT   = armT  / size;
    vHaloR  = haloR / size;
    vHaloI  = haloI;
    vCrossI = 0.72 + 0.16*lumN + flare*0.42;
    vCol    = col * alpha;

    gl_PointSize = size * uDpr;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(p.x, -p.y, 0.0, 1.0);
  }\`;

const SPRITE_FS = \`
  precision highp float;
  varying vec3 vCol;
  varying float vCoreR, vArmL, vArmLy, vArmT, vHaloR, vHaloI, vCrossI;
  void main(){
    vec2 pc = gl_PointCoord - 0.5;
    float ax = abs(pc.x), ay = abs(pc.y);
    float d  = length(pc);

    float core = 1.0 - smoothstep(vCoreR*0.82, vCoreR*1.10, d);

    float hx = (1.0 - smoothstep(vArmT*0.80, vArmT*1.14, ay)) * pow(max(0.0, 1.0 - ax/max(vArmL,1e-4)), 0.42);
    float hy = (1.0 - smoothstep(vArmT*0.80, vArmT*1.14, ax)) * pow(max(0.0, 1.0 - ay/max(vArmLy,1e-4)), 0.42);
    float cross_ = max(hx, hy);

    float halo = exp(-(d*d)/max(vHaloR*vHaloR*0.30, 1e-5)) * vHaloI;

    float a = core*1.0 + cross_*vCrossI + halo;
    if(a <= 0.0015) discard;
    gl_FragColor = vec4(vCol * a, 1.0);
  }\`;

const dotMat = new THREE.ShaderMaterial({
  uniforms: dotUni, vertexShader: SPRITE_VS, fragmentShader: SPRITE_FS,
  transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending
});

let dotGeo = null, dotPoints = null;
function buildLattice(){
  if(dotPoints){ dotScene.remove(dotPoints); dotGeo.dispose(); }
  const n = GW*GH;
  const pos = new Float32Array(n*3);
  const cell= new Float32Array(n*2);
  const rnd = new Float32Array(n*4);
  const R = mulberry(9137);
  let k=0;
  for(let y=0;y<GH;y++) for(let x=0;x<GW;x++){
    cell[k*2]=x; cell[k*2+1]=y;
    rnd[k*4]=R(); rnd[k*4+1]=R(); rnd[k*4+2]=R(); rnd[k*4+3]=R();
    k++;
  }
  dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  dotGeo.setAttribute('aCell', new THREE.BufferAttribute(cell,2));
  dotGeo.setAttribute('aRnd',  new THREE.BufferAttribute(rnd,4));
  dotGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
  dotPoints = new THREE.Points(dotGeo, dotMat);
  dotPoints.frustumCulled = false;
  dotScene.add(dotPoints);
}

/* ---------- drifting motes: sparse sparkles around the bloom ----------- */
const MOTES = 190;
const moteUni = {
  uTime:{value:0}, uDpr:{value:1}, uIntro:{value:0},
  uFieldMin:{value:new THREE.Vector2()}, uFieldSize:{value:new THREE.Vector2()},
  uPitch:{value:PITCH}, uPointer:{value:new THREE.Vector2()}
};
const moteMat = new THREE.ShaderMaterial({
  uniforms: moteUni,
  transparent:true, depthTest:false, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:\`
    precision highp float;
    attribute vec4 aRnd; attribute vec2 aRnd2;
    uniform vec2 uFieldMin, uFieldSize, uPointer;
    uniform float uTime, uDpr, uPitch, uIntro;
    varying vec3 vCol; varying float vCoreR, vArmL, vArmLy, vArmT, vHaloR, vHaloI, vCrossI;
    void main(){
      float rate = 0.018 + aRnd.z*0.05;
      float ph = fract(uTime*rate + aRnd.w);
      vec2 p = uFieldMin + vec2(aRnd.x, aRnd.y) * uFieldSize * vec2(1.10, 1.55) - uFieldSize*vec2(0.05,0.04);
      p.y += ph * uFieldSize.y * 0.55;
      p.x += sin(ph*6.283 + aRnd.w*12.0) * uFieldSize.x*0.035;
      p += uPointer * 16.0;

      float life = sin(ph*3.14159);
      float tw = 0.35 + 0.65*pow(max(0.0, sin(uTime*1.7 + aRnd.w*44.0)*0.5+0.5), 3.0);
      /* thin the field out toward the edges so they cluster round the bloom */
      vec2 q = (vec2(aRnd.x, aRnd.y) - vec2(0.5, 0.34)) * vec2(1.0, 0.62);
      float clump = exp(-dot(q,q)*3.4);
      float a = life*life * tw * (0.05 + aRnd.z*0.16) * (0.25+0.75*clump) * smoothstep(0.0,0.5,uIntro);

      float sz = uPitch*(0.42 + aRnd.z*0.55);
      float half_ = sz;
      float size = min(half_*2.0, 40.0);
      vCoreR = (sz*0.30)/size; vArmL = (sz*0.95)/size; vArmLy = vArmL*1.35; vArmT = (sz*(0.13+aRnd.z*0.14))/size;
      vHaloR = (sz*1.3)/size; vHaloI = a*0.05; vCrossI = 0.9;
      vCol = vec3(0.78,0.86,1.0) * a;
      gl_PointSize = size*uDpr;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p.x, -p.y, 0.0, 1.0);
    }\`,
  fragmentShader: SPRITE_FS
});
{
  const pos=new Float32Array(MOTES*3), r=new Float32Array(MOTES*4);
  const R=mulberry(4242);
  for(let i=0;i<MOTES;i++){ r[i*4]=R(); r[i*4+1]=R(); r[i*4+2]=R(); r[i*4+3]=R(); }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aRnd', new THREE.BufferAttribute(r,4));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
  const pts=new THREE.Points(g, moteMat); pts.frustumCulled=false;
  dotScene.add(pts);
}

/* =======================================================================
   5. POST — threshold, blur, composite
   ======================================================================= */
const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const quadGeo = new THREE.PlaneGeometry(2,2);
function fsPass(uniforms, frag){
  const m = new THREE.RawShaderMaterial({
    uniforms, depthTest:false, depthWrite:false,
    vertexShader:\`precision highp float; attribute vec3 position; attribute vec2 uv;
      uniform mat4 projectionMatrix, modelViewMatrix; varying vec2 vUv;
      void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
    fragmentShader: frag
  });
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(quadGeo, m));
  return { scene:sc, mat:m, uniforms };
}

const passBright = fsPass({ tMap:{value:null}, uTexel:{value:new THREE.Vector2()}, uThresh:{value:0.92} },
\`precision highp float; varying vec2 vUv; uniform sampler2D tMap; uniform vec2 uTexel; uniform float uThresh;
 void main(){
   vec3 c = vec3(0.0);
   c += texture2D(tMap, vUv + uTexel*vec2(-1.0,-1.0)).rgb;
   c += texture2D(tMap, vUv + uTexel*vec2( 1.0,-1.0)).rgb;
   c += texture2D(tMap, vUv + uTexel*vec2(-1.0, 1.0)).rgb;
   c += texture2D(tMap, vUv + uTexel*vec2( 1.0, 1.0)).rgb;
   c *= 0.25;
   float l = dot(c, vec3(0.2126,0.7152,0.0722));
   float k = max(l - uThresh, 0.0) / max(l, 1e-4);
   gl_FragColor = vec4(c*k, 1.0);
 }\`);

const passBlur = fsPass({ tMap:{value:null}, uDir:{value:new THREE.Vector2()} },
\`precision highp float; varying vec2 vUv; uniform sampler2D tMap; uniform vec2 uDir;
 void main(){
   vec3 c = texture2D(tMap, vUv).rgb * 0.2270270270;
   c += (texture2D(tMap, vUv + uDir*1.3846153846).rgb + texture2D(tMap, vUv - uDir*1.3846153846).rgb) * 0.3162162162;
   c += (texture2D(tMap, vUv + uDir*3.2307692308).rgb + texture2D(tMap, vUv - uDir*3.2307692308).rgb) * 0.0702702703;
   gl_FragColor = vec4(c, 1.0);
 }\`);

const passComp = fsPass({
    tScene:{value:null}, tBloom:{value:null}, tBloom2:{value:null},
    uBloom:{value:0.26}, uBloom2:{value:0.13},
    uRes:{value:new THREE.Vector2()}, uTime:{value:0},
    uGlow:{value:new THREE.Vector3()}, uBg:{value:new THREE.Color(0x101010)}
  },
\`precision highp float; varying vec2 vUv;
 uniform sampler2D tScene, tBloom, tBloom2;
 uniform float uBloom, uBloom2, uTime;
 uniform vec2 uRes; uniform vec3 uGlow, uBg;

 vec3 aces(vec3 x){
   const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
   return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
 }
 float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }

 void main(){
   vec3 c = texture2D(tScene, vUv).rgb;
   c += texture2D(tBloom , vUv).rgb * uBloom;
   c += texture2D(tBloom2, vUv).rgb * uBloom2;

   /* faint halation around the bloom's heart */
   vec2 d = (vUv - uGlow.xy) * vec2(uRes.x/uRes.y, 1.0);
   c += vec3(0.26,0.38,0.55) * exp(-dot(d,d)*7.5) * uGlow.z * 0.010;

   c = aces(c * 1.02);
   c = pow(max(c, 0.0), vec3(1.0/2.2));

   /* background plate */
   vec3 bg = uBg;
   bg += vec3(0.007,0.0085,0.011) * exp(-dot(d,d)*3.2);
   c = 1.0 - (1.0 - c) * (1.0 - bg);

   /* vignette */
   vec2 q = vUv - 0.5;
   c *= 1.0 - dot(q,q)*0.30;

   /* grain */
   float g = hash(gl_FragCoord.xy + fract(uTime)*91.3) - 0.5;
   c += g * 0.0125;

   gl_FragColor = vec4(c, 1.0);
 }\`);

/* =======================================================================
   6. LAYOUT
   ======================================================================= */
let bloomW=1, bloomH=1, sized=false, fallbackSize=false;
function viewport(){
  const r = canvas.getBoundingClientRect();
  const w = Math.round(r.width)  || window.innerWidth  || document.documentElement.clientWidth  || 0;
  const h = Math.round(r.height) || window.innerHeight || document.documentElement.clientHeight || 0;
  if(w >= 2 && h >= 2){ fallbackSize = false; return [w, h]; }
  /* Some embedded previews composite the canvas while reporting a zero
     layout; fall back to a sane stage instead of rendering nothing, and keep
     watching for a real one. */
  fallbackSize = true;
  const sw = (window.screen && screen.width)  || 1280;
  const sh = (window.screen && screen.height) || 800;
  return [Math.min(sw, 1600), Math.min(sh, 900)];
}
function resize(){
  const vp = viewport();
  if(sized && vp[0] === W && vp[1] === H) return;
  W = vp[0]; H = vp[1];
  sized = true;
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W, H, false);

  /* flower rect — matches the reference framing, but keeps clear of the copy */
  const hFrac = W < 780 ? 0.42 : 0.60;
  let fh = H * hFrac;
  let fw = fh * 1.133;
  const maxW = W * (W < 780 ? 0.94 : 0.50);
  if (fw > maxW){ fw = maxW; fh = fw/1.133; }
  field.w = fw; field.h = fh;
  field.x = W * (W < 780 ? 0.50 : 0.415) - fw*0.5;
  field.y = H * (W < 780 ? 0.285 : 0.352) - fh*0.5;

  PITCH = 3.75 * Math.pow(Math.max(H,420)/720, 0.36);
  GH = Math.max(64, Math.min(216, Math.round(field.h / PITCH)));
  GW = Math.max(64, Math.min(248, Math.round(GH * 1.133)));
  PITCH = field.w / GW;

  rtFlower.setSize(GW*2, GH*2);
  fitFlower(GW/GH, 0.94);

  dotCam.left = 0; dotCam.right = W; dotCam.top = 0; dotCam.bottom = -H;
  dotCam.updateProjectionMatrix();

  const sw = Math.max(2, Math.round(W*DPR)), sh = Math.max(2, Math.round(H*DPR));
  rtScene.setSize(sw, sh);
  bloomW = Math.max(2, Math.round(sw/4)); bloomH = Math.max(2, Math.round(sh/4));
  rtA.setSize(bloomW, bloomH); rtB.setSize(bloomW, bloomH); rtBWide.setSize(bloomW, bloomH);

  dotUni.uGrid.value.set(GW, GH);
  dotUni.uFieldMin.value.set(field.x, field.y);
  dotUni.uFieldSize.value.set(field.w, field.h);
  dotUni.uPitch.value = PITCH;
  dotUni.uDpr.value = DPR;
  moteUni.uFieldMin.value.copy(dotUni.uFieldMin.value);
  moteUni.uFieldSize.value.copy(dotUni.uFieldSize.value);
  moteUni.uPitch.value = PITCH;
  moteUni.uDpr.value = DPR;

  passComp.uniforms.uRes.value.set(sw, sh);
  buildLattice();
}

/* =======================================================================
   7. INPUT
   ======================================================================= */
const ptr = { x:0, y:0, tx:0, ty:0, active:0, ta:0, px:-9999, py:-9999, tpx:-9999, tpy:-9999 };
function onMove(cx, cy){
  ptr.tx = (cx / W) * 2 - 1;
  ptr.ty = (cy / H) * 2 - 1;
  if(ptr.tpx < -9000){ ptr.px = cx; ptr.py = cy; }   // no sweep in from nowhere
  ptr.tpx = cx; ptr.tpy = cy;
  ptr.ta = 1;
}
window.addEventListener('pointermove', e => onMove(e.clientX, e.clientY), {passive:true});
window.addEventListener('pointerleave', () => { ptr.ta = 0; }, {passive:true});
window.addEventListener('resize', resize);
if(window.ResizeObserver){ new ResizeObserver(resize).observe(document.documentElement); }
document.addEventListener('visibilitychange', resize);

/* live clock in the utility slot */
function tickClock(){
  const d = new Date();
  let h = d.getHours(); const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const m = String(d.getMinutes()).padStart(2,'0');
  document.getElementById('t-time').textContent = h + ':' + m + ' ' + ampm;
  document.getElementById('t-date').textContent =
    d.getDate() + ' ' + d.toLocaleString('en-GB',{month:'short'}) + ' ' + d.getFullYear();
  let zone = '';
  try{
    const parts = new Intl.DateTimeFormat('en-US',{timeZoneName:'short'}).formatToParts(d);
    const tz = parts.find(x => x.type === 'timeZoneName');
    if(tz && tz.value.length <= 5) zone = ' · ' + tz.value;
  }catch(e){}
  document.getElementById('t-zone').textContent = zone;
}
tickClock(); setInterval(tickClock, 20000);

/* =======================================================================
   8. LOOP
   ======================================================================= */
const clock = new THREE.Clock();
let elapsed = 0, intro = 0, fps = 60, frames = 0, fpsT = 0;
const keyTarget = new THREE.Vector3();
const glowV = new THREE.Vector3();

resize();

function frame(){
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if(!sized || fallbackSize) resize();
  if(!sized) return;
  elapsed += dt;
  intro = Math.min(1, intro + dt/1.9);

  /* pointer easing */
  ptr.active += (ptr.ta - ptr.active) * Math.min(1, dt*3.0);
  ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt*3.4);
  ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt*3.4);
  if(ptr.tpx > -9000){
    const k = Math.min(1, dt*11.0);                 // the torch keeps up with the cursor
    ptr.px += (ptr.tpx - ptr.px) * k;
    ptr.py += (ptr.tpy - ptr.py) * k;
  }

  /* ---- key light: swings on a fixed-radius arc so the exposure holds,
         and hands over to the pointer when there is one ------------------ */
  {
    const R = 2.55;
    const idleAz = Math.sin(elapsed*0.215)*0.88 + Math.sin(elapsed*0.091)*0.26;
    const idleEl = 0.88 + Math.sin(elapsed*0.163 + 1.1)*0.17;
    const ptrAz  = ptr.x * 1.15;
    const ptrEl  = 0.92 - ptr.y * 0.55;
    const m  = ptr.active;
    const az = idleAz*(1-m) + ptrAz*m;
    const el = idleEl*(1-m) + ptrEl*m;
    keyTarget.set(R*Math.cos(el)*Math.sin(az), R*Math.sin(el), R*Math.cos(el)*Math.cos(az));
  }
  flowerUni.uKey.value.lerp(keyTarget, Math.min(1, dt*2.6));

  /* ---- the flower breathes and turns a few degrees with the pointer -- */
  flowerPivot.rotation.y = Math.sin(elapsed*0.16)*0.075 + ptr.x*0.16*ptr.active;
  flowerPivot.rotation.x = Math.sin(elapsed*0.13+2.0)*0.035 + ptr.y*0.07*ptr.active;
  flowerPivot.position.y = Math.sin(elapsed*0.30)*0.012;
  const s = 1 + Math.sin(elapsed*0.22)*0.012;
  flowerPivot.scale.setScalar(s);

  /* the bloom opens once, then keeps breathing a couple of degrees */
  const openT = REDUCED ? 1 : Math.min(1, elapsed/3.4);
  const opened = 1 - Math.pow(1 - openT, 3.0);
  const cycle  = 0.5 - 0.5*Math.cos(elapsed*0.185);       // a slow, full bloom cycle
  flowerUni.uCurl.value = (1 - opened)*1.45 + 0.34*(1 - cycle) + 0.03;
  depthUni.uCurl.value = flowerUni.uCurl.value;
  depthUni.uSway.value = flowerUni.uSway.value;
  depthUni.uSwaySpd.value = flowerUni.uSwaySpd.value;
  depthUni.uTime.value = elapsed;

  flowerUni.uTime.value = elapsed;
  flowerCam.getWorldPosition(flowerUni.uCamPos.value);

  /* pass A */
  renderer.setRenderTarget(rtFlower);
  renderer.setClearColor(0x000000, 0);
  renderer.clear(true, true, false);
  renderer.render(flowerScene, flowerCam);

  /* pass B */
  dotUni.uTime.value = elapsed;
  dotUni.uIntro.value = REDUCED ? 1 : intro;
  dotUni.uPointer.value.set(ptr.x*ptr.active, ptr.y*ptr.active);
  dotUni.uPtrPx.value.set(ptr.px, ptr.py);
  dotUni.uPtrOn.value = ptr.active;
  dotUni.uPtrR.value = Math.max(70, field.w * 0.17);
  moteUni.uTime.value = elapsed;
  moteUni.uIntro.value = REDUCED ? 1 : intro;
  moteUni.uPointer.value.copy(dotUni.uPointer.value);

  renderer.setRenderTarget(rtScene);
  renderer.setClearColor(0x000000, 0);
  renderer.clear(true, true, false);
  renderer.render(dotScene, dotCam);

  /* bloom */
  passBright.uniforms.tMap.value = rtScene.texture;
  passBright.uniforms.uTexel.value.set(1/(W*DPR), 1/(H*DPR));
  renderer.setRenderTarget(rtA);
  renderer.render(passBright.scene, quadCam);

  passBlur.uniforms.tMap.value = rtA.texture;
  passBlur.uniforms.uDir.value.set(1/bloomW, 0);
  renderer.setRenderTarget(rtB);
  renderer.render(passBlur.scene, quadCam);

  passBlur.uniforms.tMap.value = rtB.texture;
  passBlur.uniforms.uDir.value.set(0, 1/bloomH);
  renderer.setRenderTarget(rtA);
  renderer.render(passBlur.scene, quadCam);

  passBlur.uniforms.tMap.value = rtA.texture;
  passBlur.uniforms.uDir.value.set(3.4/bloomW, 0);
  renderer.setRenderTarget(rtB);
  renderer.render(passBlur.scene, quadCam);

  passBlur.uniforms.tMap.value = rtB.texture;
  passBlur.uniforms.uDir.value.set(0, 3.4/bloomH);
  renderer.setRenderTarget(rtBWide);
  renderer.render(passBlur.scene, quadCam);

  /* composite */
  glowV.set(0.5 + (field.x + field.w*0.5 - W*0.5)/W, 1 - (field.y + field.h*0.42)/H, 1);
  passComp.uniforms.tScene.value = rtScene.texture;
  passComp.uniforms.tBloom.value = rtA.texture;
  passComp.uniforms.tBloom2.value = rtBWide.texture;
  passComp.uniforms.uTime.value = elapsed;
  passComp.uniforms.uGlow.value.set(glowV.x, glowV.y, 1.0);
  renderer.setRenderTarget(null);
  renderer.render(passComp.scene, quadCam);

  /* fps guard */
  frames++; fpsT += dt;
  if(fpsT > 1.0){ fps = frames/fpsT; frames = 0; fpsT = 0;
    if(fps < 42 && DPR > 1){ DPR = Math.max(1, DPR - 0.25); renderer.setPixelRatio(DPR); dotUni.uDpr.value = DPR; moteUni.uDpr.value = DPR; }
  }
}

document.body.classList.add('ready');
frame();

})();
<\/script>
</body>
</html>
`,P=`<script>
document.addEventListener("click", function (event) {
  const anchor = event.target && event.target.closest ? event.target.closest('a[href="#"]') : null;
  if (anchor) event.preventDefault();
});
<\/script>`,S=M.replace("</body>",`${P}${T}</body>`);function k(p){const[f,v]=y(p),{className:r="",style:m}=v,t=E(R,f),i=n.useRef(null),s=n.useRef(null),[h,g]=n.useState(()=>typeof document>"u"||!document.hidden),[w,x]=n.useState(!0),[a,l]=n.useState(!1);n.useEffect(()=>{const e=i.current;if(!e||typeof IntersectionObserver>"u")return;const c=new IntersectionObserver(([b])=>{x(b?.isIntersecting??!0)},{rootMargin:"80px"});return c.observe(e),()=>c.disconnect()},[]),n.useEffect(()=>{if(typeof document>"u")return;const e=()=>g(!document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]);const o=w&&h;return n.useEffect(()=>{l(!1)},[o]),n.useEffect(()=>{u(s.current,t)},[t]),d.jsx("div",{ref:i,className:`threeui-background halftone-bloom-hero${r?` ${r}`:""}`,role:"group","aria-label":"Interactive Aster halftone bloom hero","data-state":o?a?"ready":"loading":"paused",style:{background:"#101010",pointerEvents:"auto",...m},children:o?d.jsx("iframe",{ref:s,title:"Aster — Signal First, Dashboards Second",srcDoc:S,sandbox:"allow-scripts",loading:"eager",onLoad:e=>{u(e.currentTarget,t),l(!0)},style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#101010",opacity:a?1:0,pointerEvents:a?"auto":"none",transition:"opacity 240ms ease-out"}}):null})}export{k as HalftoneBloomHero};
