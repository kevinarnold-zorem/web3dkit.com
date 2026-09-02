import{s as l,u as d,r as o,j as p,v as h}from"./index-fOQwe-l-.js";import{b as f,L as m}from"./LandingPages-plHUvg-e.js";import"./SylvaLivingWorldScene-OThUX2Jj.js";const u=`<!DOCTYPE html>
<!--
  CATHODE / CONSOLE — an isometric living-room console built entirely from
  three.js geometry.

  The flat panel, its neck and foot, the console slab with its vent grille, and the
  gamepad are all real meshes; the pad's shell is the smooth union of a body block
  and two splayed grips, sampled as one outline so its fillets are real curves. Every
  visible edge is drawn as a screen-space constant-width line, the panel runs a live
  side-scroller, and the camera orbits with the pointer around a true isometric rest
  pose.
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cathode — Made for the Late Rounds</title>
<meta name="description" content="An isometric console, panel and gamepad rendered live in three.js.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23090909'/%3E%3Crect x='3' y='11' width='26' height='12' rx='6' fill='none' stroke='%23888' stroke-width='2'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#0a0a0a;
    color:#f1f1f1;
    font-family:'Inter',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;
    -webkit-font-smoothing:antialiased;
    overflow:hidden;
    cursor:crosshair;
  }

  #gl{
    position:fixed; inset:0; width:100%; height:100%; display:block; z-index:0;
    opacity:0; animation:rise .9s ease .05s forwards;
  }
  @keyframes rise{ to{ opacity:1 } }
  @media (prefers-reduced-motion: reduce){ #gl{opacity:1; animation:none} }

  .ui{
    position:fixed; inset:0; z-index:1; pointer-events:none;
    padding:clamp(20px, 2.6vw, 44px) clamp(22px, 3.4vw, 60px);
    display:grid;
    grid-template-rows:auto 1fr auto;
    gap:clamp(16px, 2vw, 28px);
  }
  .ui a{ pointer-events:auto; cursor:pointer; text-decoration:none }
  .ui a:focus-visible{ outline:1px solid rgba(255,255,255,.45); outline-offset:4px; border-radius:999px }

  /* ---------- top bar ---------- */
  .bar{
    display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;
    gap:16px;
  }
  .logo{
    display:inline-flex; align-items:center; gap:.62em;
    color:#e9e9e9;
    font-size:clamp(10px, .82vw, 13px);
    font-weight:500; letter-spacing:.24em; text-transform:uppercase;
    justify-self:start;
    transition:color .18s ease;
  }
  .logo svg{ width:1.72em; height:1.72em; display:block; color:#c9c9c9; transition:color .18s ease }
  .logo:hover, .logo:hover svg{ color:#fff }

  .pill{
    justify-self:center;
    display:flex; align-items:center; gap:2px;
    padding:4px;
    border-radius:999px;
    background:rgba(255,255,255,.038);
    border:1px solid rgba(255,255,255,.075);
    backdrop-filter:blur(14px) saturate(120%);
    -webkit-backdrop-filter:blur(14px) saturate(120%);
  }
  .pill a{
    display:block;
    padding:.62em 1.15em;
    border-radius:999px;
    font-size:clamp(11px, .86vw, 13.5px);
    font-weight:500; letter-spacing:.005em;
    color:#8e8e8e; white-space:nowrap;
    transition:color .18s ease, background .18s ease;
  }
  .pill a:hover{ color:#ededed; background:rgba(255,255,255,.05) }
  .pill a.on{ color:#f2f2f2; background:rgba(255,255,255,.075) }

  .ghost{
    justify-self:end;
    display:inline-block;
    padding:.68em 1.35em;
    border-radius:999px;
    border:1px solid rgba(255,255,255,.14);
    font-size:clamp(11px, .86vw, 13.5px);
    font-weight:500;
    color:#dcdcdc;
    transition:color .18s ease, background .18s ease, border-color .18s ease;
  }
  .ghost:hover{ color:#fff; background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.28) }

  /* ---------- copy ---------- */
  .copy{ align-self:end; justify-self:end; text-align:right; max-width:min(46ch, 88vw) }
  .kicker{
    font-size:clamp(11px, .95vw, 14px);
    font-weight:500;
    letter-spacing:.10em;
    color:#727272;
  }
  .title{
    margin-top:clamp(10px, .9vw, 18px);
    font-size:clamp(30px, 4.35vw, 64px);
    font-weight:400;
    letter-spacing:-.016em;
    line-height:1.02;
    color:#f1f1f1;
  }
  .lede{
    margin-top:clamp(12px, 1.1vw, 22px);
    font-size:clamp(14px, 1.22vw, 19px);
    font-weight:400;
    line-height:1.58;
    color:#8d8d8d;
  }
  .cta{
    margin-top:clamp(18px, 1.7vw, 30px);
    display:inline-flex; align-items:center; gap:.7em;
    padding:.85em 1.5em;
    border-radius:999px;
    background:#efefef;
    color:#0b0b0b;
    font-size:clamp(13px, 1.02vw, 16px);
    font-weight:500; letter-spacing:-.004em;
    transition:background .18s ease, box-shadow .18s ease, transform .18s ease;
  }
  .cta svg{ width:.82em; height:.82em; display:block }
  .cta:hover{ background:#fff; box-shadow:0 0 0 6px rgba(255,255,255,.06) }
  .cta:active{ transform:translateY(1px) }

  /* ---------- footnote ---------- */
  .foot{
    align-self:end;
    display:flex; justify-content:flex-start;
    margin-top:clamp(14px, 1.6vw, 26px);
  }
  .hint{
    font-size:clamp(9px, .72vw, 11px);
    font-weight:500;
    letter-spacing:.22em;
    text-transform:uppercase;
    color:#4c4c4c;
  }
  .hint::before{
    content:""; display:inline-block;
    width:1.6em; height:1px; margin-right:.9em; vertical-align:middle;
    background:#3a3a3a;
  }
  .hint::after{ content:"Move to orbit" }
  @media (hover:none){ .hint::after{ content:"Drag to orbit" } }

  @media (max-width:880px){
    .pill{ display:none }
    .bar{ grid-template-columns:1fr auto }
  }
  @media (max-width:640px){
    .copy{max-width:100%}
    .ghost{ padding:.6em 1.1em }
  }
</style>
</head>
<body>
<canvas id="gl"></canvas>

<div class="ui">
  <header class="bar">
    <a class="logo" href="#">
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1.7" y="6.4" width="18.6" height="9.6" rx="4.8" stroke="currentColor" stroke-width="1.35"/>
        <path d="M6.2 11.2h2.9M7.65 9.75v2.9" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
        <circle cx="14.6" cy="11.2" r="1.15" fill="currentColor"/>
      </svg>
      <span>Cathode</span>
    </a>

    <nav class="pill" aria-label="Primary">
      <a class="on" href="#">Consoles</a>
      <a href="#">Library</a>
      <a href="#">Support</a>
      <a href="#">Journal</a>
    </nav>

    <a class="ghost" href="#">Sign in</a>
  </header>

  <div class="copy">
    <div class="kicker">06 / 09</div>
    <h1 class="title">Made for the Late&nbsp;Rounds</h1>
    <p class="lede">A console that runs cool and stays quiet, so the only heat left in the room is the match.</p>
    <a class="cta" href="#">
      Configure a console
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1.5 6h9M6.8 2.2 10.6 6l-3.8 3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>

  <div class="foot"><span class="hint"></span></div>
</div>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
(function(){
'use strict';

/* ------------------------------------------------------------------
   COORDINATE SYSTEM
   World units are pixels of the 1080x1080 master frame the model was
   measured in.  At the isometric rest pose:
     px = X - Z
     py = 0.5774*(X + Z) - 1.1547*Y
   The floor is Y = 0.
-------------------------------------------------------------------*/

/* projected bounds of the artwork, in master pixels */
const ART = { x0:254, x1:777, y0:214, y1:676 };
const ART_W = ART.x1 - ART.x0, ART_H = ART.y1 - ART.y0;
const ART_CX = (ART.x0 + ART.x1) / 2, ART_CY = (ART.y0 + ART.y1) / 2;

/* world point that sits at the middle of the artwork (solved at Y = 90) */
const TARGET = new THREE.Vector3(
  ((ART_CY + 1.1547*90) / 0.5774 + ART_CX) / 2, 90,
  ((ART_CY + 1.1547*90) / 0.5774 - ART_CX) / 2
);

/* isometric rest pose in spherical terms: direction (1,1,1)/sqrt(3) */
const BASE_THETA = Math.PI / 4;
const BASE_PHI   = Math.acos(1 / Math.sqrt(3));
const CAM_DIST   = 4200;

THREE.ColorManagement.enabled = false;

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.outputEncoding = THREE.LinearEncoding;

const scene  = new THREE.Scene();

/* The model was measured facing down-left.  Reflecting it through the plane
   X = Z + MIRROR_K mirrors the whole drawing about its own vertical axis:
   px = X-Z flips sign around MIRROR_K while py = 0.5774(X+Z) - 1.1547Y is
   untouched.  Everything is built into this root, so shader work stays in the
   original model space and mirrors for free. */
const MIRROR_K = 515.5;
const root = new THREE.Group();
root.matrixAutoUpdate = false;
root.matrix.set(0,0,1, MIRROR_K,
                0,1,0, 0,
                1,0,0,-MIRROR_K,
                0,0,0, 1);
scene.add(root);
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 12000);
camera.up.set(0, 1, 0);

/* orbit state */
const orb = { x:0, y:0, tx:0, ty:0, over:0, tOver:0 };
function placeCamera(t){
  const az = orb.x * 0.26 + Math.sin(t * 0.17) * 0.028;
  const el = -orb.y * 0.17 + Math.sin(t * 0.11 + 1.1) * 0.018;
  const th = BASE_THETA + az;
  const ph = Math.min(1.30, Math.max(0.34, BASE_PHI + el));
  const sp = Math.sin(ph);
  camera.position.set(
    TARGET.x + CAM_DIST * sp * Math.cos(th),
    TARGET.y + CAM_DIST * Math.cos(ph),
    TARGET.z + CAM_DIST * sp * Math.sin(th)
  );
  camera.lookAt(TARGET);
}

/* palette (sRGB byte values measured off the reference) */
const C_TOP   = 0x1b1b1b;   //  27  – faces pointing up
const C_FRONT = 0x1b1b1b;   //  27  – faces pointing +Z
const C_SIDE  = 0x121212;   //  18  – faces pointing +X
const C_DARK  = 0x121212;   //  18  – base / plinth material
const C_LINE  = 0x3a3a3a;   //  58  – drawn edges
const C_GRID  = 0x121212;

/* ------------------------------------------------------------------ */
/*  materials                                                          */
/* ------------------------------------------------------------------ */
function faceMaterial(top, front, side){
  return new THREE.ShaderMaterial({
    uniforms:{
      cTop:{value:new THREE.Color(top)},
      cFront:{value:new THREE.Color(front)},
      cSide:{value:new THREE.Color(side)}
    },
    vertexShader:\`
      varying vec3 vN;
      void main(){
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }\`,
    fragmentShader:\`
      uniform vec3 cTop, cFront, cSide;
      varying vec3 vN;
      void main(){
        vec3 n = normalize(vN);
        float ax = abs(n.x), ay = abs(n.y), az = abs(n.z);
        vec3 c = cTop;
        if (ay >= ax && ay >= az)      c = cTop;
        else if (az >= ax)             c = cFront;
        else                           c = cSide;
        gl_FragColor = vec4(c, 1.0);
      }\`,
    side:THREE.DoubleSide
  });
}
/* after the mirror the drawing's front turns to +X and its cheek to +Z,
   so the two wall values swap places */
const matLight = faceMaterial(C_TOP, C_SIDE, C_FRONT);
const matDark  = faceMaterial(C_DARK, C_DARK, C_DARK);

/* secondary props sit in a soft haze that fades them from 17 to 23.
   Written in world space so it stays welded to the props while the camera orbits. */
function hazeMaterial(sideMul){
 return new THREE.ShaderMaterial({
  uniforms:{ uSide:{value:sideMul} },
  vertexShader:\`
    varying vec3 vN; varying vec3 vW;
    void main(){
      vN = normalize(mat3(modelMatrix) * normal);
      vW = position;                       /* model space: mirrors with the root */
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }\`,
  fragmentShader:\`
    uniform float uSide;
    varying vec3 vN; varying vec3 vW;
    void main(){
      float f = clamp(0.016196*vW.x - 0.008591*vW.y - 0.007604*vW.z - 5.819, 0.0, 1.0);
      float v = mix(0.0666, 0.0902, f);
      vec3 n = normalize(vN);
      if (abs(n.y) < max(abs(n.x), abs(n.z))) v *= uSide;
      gl_FragColor = vec4(vec3(v), 1.0);
    }\`,
  side:THREE.DoubleSide
 });
}
const matBg   = hazeMaterial(0.80);   /* props: only the top catches the haze */
const matBgUp = hazeMaterial(1.00);   /* upright panel: its face is what we see */

/* ------------------------------------------------------------------ */
/*  screen-space constant-width lines                                  */
/* ------------------------------------------------------------------ */
const lineUniforms = {
  uRes:{value:new THREE.Vector2(1080,1080)},
  uW:{value:2.0},
  uTime:{value:0},
  uIntro:{value:0}
};
function lineMaterial(color, opacity, fade){
  return new THREE.ShaderMaterial({
    uniforms:Object.assign({
      uColor:{value:new THREE.Color(color)},
      uOpacity:{value:opacity===undefined?1:opacity},
      uFade:{value:new THREE.Vector2(fade?fade[0]:1e6, fade?fade[1]:1e6+1)},
      uFadeC:{value:new THREE.Vector2(fade?fade[2]:0, fade?fade[3]:0)}
    }, lineUniforms),
    transparent:true,
    depthWrite:false,
    side:THREE.DoubleSide,
    vertexShader:\`
      uniform vec2 uRes; uniform float uW;
      attribute vec3 aOther;
      attribute float aSide;
      attribute float aSeed;
      varying vec3 vW; varying float vSeed;
      void main(){
        vW = position; vSeed = aSeed;
        vec4 c0 = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        vec4 c1 = projectionMatrix * modelViewMatrix * vec4(aOther,1.0);
        vec2 n0 = c0.xy / c0.w;
        vec2 n1 = c1.xy / c1.w;
        vec2 d  = (n1 - n0) * uRes;
        float L = length(d);
        d = (L > 0.0001) ? d / L : vec2(1.0, 0.0);
        vec2 perp = vec2(-d.y, d.x);
        vec2 off = (perp * aSide * uW * 0.5 - d * uW * 0.5) / uRes * 2.0;
        c0.xy += off * c0.w;
        gl_Position = c0;
      }\`,
    fragmentShader:\`
      uniform vec3 uColor; uniform float uOpacity;
      uniform float uTime, uIntro; uniform vec2 uFade, uFadeC;
      varying vec3 vW; varying float vSeed;
      void main(){
        float a = uOpacity;

        /* the drawing assembles itself once, back to front */
        float depth = clamp((vW.x + vW.z - 380.0) / 760.0, 0.0, 1.0);
        a *= smoothstep(0.0, 0.30, uIntro * 1.34 - depth * 0.34);

        /* grid and other far strokes dissolve into the plate, measured on screen */
        vec2 pp = vec2(vW.x - vW.z, 0.5774 * (vW.x + vW.z) - 1.1547 * vW.y);
        float d = length((pp - uFadeC) * vec2(1.0, 1.5));
        a *= 1.0 - smoothstep(uFade.x, uFade.y, d);

        /* a scan plane rides up through the wireframe */
        float scanY = mod(uTime * 54.0, 330.0) - 52.0;
        float dy = vW.y - scanY;
        float pulse = exp(-dy * dy / 110.0) + 0.34 * exp(-dy * dy / 1150.0);

        /* a slower glint travelling along the plan diagonal */
        float w = sin((vW.x + vW.z) * 0.016 - uTime * 1.15);
        float glint = pow(max(w, 0.0), 14.0);

        /* per-stroke shimmer so nothing sits perfectly still */
        float sh = 0.94 + 0.06 * sin(uTime * 1.9 + vSeed * 41.0);

        vec3 col = uColor * sh + vec3(pulse * 0.36 + glint * 0.15);
        gl_FragColor = vec4(col, a);
      }\`
  });
}

/* nudge lines toward the camera along (1,1,1) — screen-neutral under iso */
const EPS = 0.55;

function makeLines(segs, color, opacity, fade){
  const n = segs.length / 6;
  const pos   = new Float32Array(n*4*3);
  const oth   = new Float32Array(n*4*3);
  const side  = new Float32Array(n*4);
  const seed  = new Float32Array(n*4);
  const index = new Uint32Array(n*6);
  for(let i=0;i<n;i++){
    const ax=segs[i*6]+EPS,   ay=segs[i*6+1]+EPS, az=segs[i*6+2]+EPS;
    const bx=segs[i*6+3]+EPS, by=segs[i*6+4]+EPS, bz=segs[i*6+5]+EPS;
    const v=i*4;
    // two verts at a (other = b), two verts at b (other = a)
    const P=[[ax,ay,az,bx,by,bz,-1],[ax,ay,az,bx,by,bz, 1],
             [bx,by,bz,ax,ay,az,-1],[bx,by,bz,ax,ay,az, 1]];
    for(let k=0;k<4;k++){
      pos[(v+k)*3]=P[k][0]; pos[(v+k)*3+1]=P[k][1]; pos[(v+k)*3+2]=P[k][2];
      oth[(v+k)*3]=P[k][3]; oth[(v+k)*3+1]=P[k][4]; oth[(v+k)*3+2]=P[k][5];
      side[v+k]=P[k][6];
      seed[v+k]=(Math.sin(i*12.9898)*43758.5453)%1;
    }
    index[i*6]=v; index[i*6+1]=v+1; index[i*6+2]=v+2;
    index[i*6+3]=v; index[i*6+4]=v+2; index[i*6+5]=v+3;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aOther',   new THREE.BufferAttribute(oth,3));
  g.setAttribute('aSide',    new THREE.BufferAttribute(side,1));
  g.setAttribute('aSeed',    new THREE.BufferAttribute(seed,1));
  g.setIndex(new THREE.BufferAttribute(index,1));
  const m=new THREE.Mesh(g, lineMaterial(color===undefined?C_LINE:color, opacity, fade));
  m.frustumCulled=false;
  m.renderOrder=2;
  return m;
}

/* segment accumulator */
function Seg(){ this.a=[]; }
Seg.prototype.add=function(p,q){ this.a.push(p[0],p[1],p[2],q[0],q[1],q[2]); };
Seg.prototype.loop=function(pts){                       // pts: [[x,y,z],...]
  for(let i=0;i<pts.length;i++) this.add(pts[i], pts[(i+1)%pts.length]);
};
Seg.prototype.path=function(pts){
  for(let i=0;i<pts.length-1;i++) this.add(pts[i], pts[i+1]);
};

/* ------------------------------------------------------------------ */
/*  2D helpers                                                         */
/* ------------------------------------------------------------------ */
function rect(x0,y0,x1,y1){ return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]]; }

function roundRect(x0,y0,x1,y1,r,seg){
  seg = seg||5;
  r = Math.min(r, (x1-x0)/2, (y1-y0)/2);
  const p=[];
  const corners=[[x1-r,y0+r,-Math.PI/2,0],[x1-r,y1-r,0,Math.PI/2],
                 [x0+r,y1-r,Math.PI/2,Math.PI],[x0+r,y0+r,Math.PI,Math.PI*1.5]];
  for(const [cx,cy,a0,a1] of corners){
    for(let i=0;i<=seg;i++){
      const a=a0+(a1-a0)*i/seg;
      p.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]);
    }
  }
  return p;
}

/* map profile (a,b) + extrusion t to world, per axis */
const MAP = {
  z:(a,b,t)=>[a, b, t],          // profile = (X,Y), extrude along Z
  x:(a,b,t)=>[t, b, -a],         // profile = (-Z,Y), extrude along X
  y:(a,b,t)=>[a, t, -b]          // profile = (X,-Z), extrude along Y
};
const MATRIX = {
  z:new THREE.Matrix4(),
  x:new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0)),
  y:new THREE.Matrix4().makeBasis(new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0))
};

function toShape(pts){
  const s=new THREE.Shape();
  s.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) s.lineTo(pts[i][0],pts[i][1]);
  s.closePath();
  return s;
}

/* build an extruded prism; returns the mesh */
function prism(pts, holes, t0, t1, axis, material){
  const shape=toShape(pts);
  if(holes) for(const h of holes){
    const p=new THREE.Path();
    p.moveTo(h[0][0],h[0][1]);
    for(let i=1;i<h.length;i++) p.lineTo(h[i][0],h[i][1]);
    p.closePath();
    shape.holes.push(p);
  }
  const g=new THREE.ExtrudeGeometry(shape,{depth:t1-t0, bevelEnabled:false, curveSegments:4});
  g.translate(0,0,t0);
  g.applyMatrix4(MATRIX[axis]);
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

/* loft a closed XY profile between two Z stations; flat-shaded, unindexed */
function loft(ptsA, zA, ptsB, zB, material){
  const n=ptsA.length, pos=[];
  const push=(x,y,z)=>{ pos.push(x,y,z); };
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    push(ptsA[i][0],ptsA[i][1],zA); push(ptsA[j][0],ptsA[j][1],zA); push(ptsB[j][0],ptsB[j][1],zB);
    push(ptsA[i][0],ptsA[i][1],zA); push(ptsB[j][0],ptsB[j][1],zB); push(ptsB[i][0],ptsB[i][1],zB);
  }
  [[ptsA,zA],[ptsB,zB]].forEach(function(cap){
    const pts=cap[0], z=cap[1];
    const tri=THREE.ShapeUtils.triangulateShape(pts.map(p=>new THREE.Vector2(p[0],p[1])), []);
    for(const t of tri){
      push(pts[t[0]][0],pts[t[0]][1],z);
      push(pts[t[1]][0],pts[t[1]][1],z);
      push(pts[t[2]][0],pts[t[2]][1],z);
    }
  });
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.computeVertexNormals();
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

function loopAt(seg, pts, t, axis){
  const f=MAP[axis];
  seg.loop(pts.map(p=>f(p[0],p[1],t)));
}
function railAt(seg, pts, idxs, t0, t1, axis){
  const f=MAP[axis];
  for(const i of idxs) seg.add(f(pts[i][0],pts[i][1],t0), f(pts[i][0],pts[i][1],t1));
}
/* ==================================================================
   GEOMETRY
   ================================================================== */
const S = new Seg();          // main edge set

/* ---------- profile helpers used by this drawing --------------------- */
function circle(cx,cy,r,seg){
  const p=[];
  for(let i=0;i<seg;i++){ const a=i/seg*Math.PI*2; p.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]); }
  return p;
}
/* signed distance to a rounded box, optionally turned in the profile plane */
function sdBox(px,py, cx,cy, hx,hy, r, rot){
  let dx=px-cx, dy=py-cy;
  if(rot){ const c=Math.cos(rot), s=Math.sin(rot); const t=dx*c+dy*s; dy=-dx*s+dy*c; dx=t; }
  const qx=Math.abs(dx)-hx+r, qy=Math.abs(dy)-hy+r;
  return Math.hypot(Math.max(qx,0), Math.max(qy,0)) + Math.min(Math.max(qx,qy),0) - r;
}
function smin(a,b,k){
  const h=Math.max(0, k-Math.abs(a-b))/k;
  return Math.min(a,b) - h*h*k*0.25;
}
/* distance to a capsule — the only primitive the gamepad shell is made of, so no
   straight edge can survive anywhere in its outline */
function sdSeg(px,py, ax,ay, bx,by, r){
  const pax=px-ax, pay=py-ay, bax=bx-ax, bay=by-ay;
  const h=Math.max(0, Math.min(1, (pax*bax+pay*bay)/(bax*bax+bay*bay)));
  return Math.hypot(pax-bax*h, pay-bay*h) - r;
}
/* loft between two matched 3-D rings; flat shaded, unindexed */
function loft3(A,B,material){
  const pos=[], n=A.length;
  const push=q=>pos.push(q[0],q[1],q[2]);
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    push(A[i]); push(A[j]); push(B[j]);
    push(A[i]); push(B[j]); push(B[i]);
  }
  for(const cap of [A,B]) for(let i=1;i<n-1;i++){ push(cap[0]); push(cap[i]); push(cap[i+1]); }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.computeVertexNormals();
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}
/* profile points lifted to a height, in the mapping prism uses for axis 'y' */
function profileAt(pts, y){ return pts.map(q=>[q[0], y, -q[1]]); }
/* Trace the zero level set of a field by bisection along rays from its centre.
   The shells here are all star-shaped about their middle, so one root per ray is
   the whole outline — and offsetting the same field gives the inset lines free. */
function outline(field, cx, cy, n, rMax){
  const p=[];
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2, dx=Math.cos(a), dy=Math.sin(a);
    let lo=0, hi=rMax;
    for(let k=0;k<24;k++){
      const m=(lo+hi)*0.5;
      if(field(cx+dx*m, cy+dy*m) < 0) lo=m; else hi=m;
    }
    p.push([cx+dx*lo, cy+dy*lo]);
  }
  return p;
}
/* A vertical rail reads at constant screen x, and px = 1031 - a - b for a profile
   extruded along Y — so the silhouette sits at the extremes of a + b. */
function sideRails(seg, pts, t0, t1){
  let lo=0, hi=0;
  for(let i=1;i<pts.length;i++){
    const s=pts[i][0]+pts[i][1];
    if(s < pts[lo][0]+pts[lo][1]) lo=i;
    if(s > pts[hi][0]+pts[hi][1]) hi=i;
  }
  railAt(seg, pts, [lo,hi], t0, t1, 'y');
}

/* ---------- flat panel ---------------------------------------------- */
const PN_X0=566, PN_X1=896, PN_Y0=46, PN_Y1=198, PN_R=6;
const SC_X0=577, SC_X1=885, SC_Y0=57, SC_Y1=187, SC_R=2.6;
const Z_FACE=209, Z_BEZEL=203.4, Z_BACK=190;

const panelOuter = roundRect(PN_X0,PN_Y0,PN_X1,PN_Y1,PN_R,10);
const screenHole = roundRect(SC_X0,SC_Y0,SC_X1,SC_Y1,SC_R,7);

/* front bezel, carrying the screen opening */
prism(panelOuter,[screenHole.slice().reverse()],Z_BEZEL,Z_FACE,'z',matLight);
loopAt(S,panelOuter ,Z_FACE,'z');
loopAt(S,screenHole,Z_FACE,'z');
loopAt(S,screenHole,Z_BEZEL,'z');

/* the slab behind it, and the two cheeks that catch the light */
prism(panelOuter,null,Z_BACK,Z_BEZEL,'z',matLight);
loopAt(S,panelOuter,Z_BACK,'z');
railAt(S,panelOuter,[0,11,22,33],Z_BACK,Z_FACE,'z');

/* electronics housing on the back */
const bulge = roundRect(654,76,812,170,6,6);
prism(bulge,null,174,Z_BACK,'z',matLight);
loopAt(S,bulge,174,'z');
railAt(S,bulge,[0,7,14,21],174,Z_BACK,'z');

/* neck and foot */
const neck = roundRect(706,-216,760,-192,5,5);
prism(neck,null,10,52,'y',matLight);
loopAt(S,neck,52,'y'); loopAt(S,neck,10,'y');
railAt(S,neck,[0,6,12,18],10,52,'y');

const foot = roundRect(648,-246,818,-164,10,7);
prism(foot,null,0,10.5,'y',matDark);
loopAt(S,foot,10.5,'y'); loopAt(S,foot,0,'y');
railAt(S,foot,[0,8,16,24],0,10.5,'y');
loopAt(S,roundRect(660,-236,806,-174,8,7),10.54,'y');

/* ---------- console slab --------------------------------------------- */
const CN_X0=866, CN_X1=972, CN_Z0=148, CN_Z1=222, CN_H=25;
const shell = roundRect(CN_X0,-CN_Z1,CN_X1,-CN_Z0,8,7);
prism(shell,null,0,CN_H,'y',matLight);
loopAt(S,shell,CN_H,'y'); loopAt(S,shell,0,'y');
railAt(S,shell,[0,8,16,24],0,CN_H,'y');
/* lid seam, then the vent grille milled into the top */
loopAt(S,roundRect(CN_X0+4.5,-(CN_Z1-4.5),CN_X1-4.5,-(CN_Z0+4.5),6,6),CN_H-2.8,'y');
for(let i=0;i<7;i++){
  const x0=CN_X0+15+i*11.6;
  loopAt(S,roundRect(x0,-(CN_Z1-15),x0+6.2,-(CN_Z0+32),2.6,4),CN_H+0.05,'y');
}
/* disc slot and a shallow badge on the face that turns to the viewer */
loopAt(S,roundRect(CN_X0+17,7.0,CN_X1-32,12.4,2.6,5),CN_Z1+0.1,'z');
loopAt(S,roundRect(CN_X0+17,16.5,CN_X0+43,19.5,1.4,4),CN_Z1+0.1,'z');

/* ---------- gamepad --------------------------------------------------- */
const PAD_X=724, PAD_Z=292, PAD_WAIST=9.2, PAD_H=13.4;
/* One capsule across the shoulders with a grip swung out of each end, blended
   soft enough that the waist between them curves rather than corners. */
function padField(a,b){
  const A=a-PAD_X, B=b+PAD_Z;
  const body = sdSeg(A,B, -30,-4, 30,-4, 20);
  const gL   = sdSeg(A,B, -34,2, -49,-27, 15);
  const gR   = sdSeg(A,B,  34,2,  49,-27, 15);
  return smin(body, smin(gL,gR,10), 17);
}
const padOuter = outline(padField, PAD_X, -PAD_Z, 132, 170);
const padBase  = outline((a,b)=>padField(a,b)+2.2, PAD_X, -PAD_Z, 132, 170);
const padCrown = outline((a,b)=>padField(a,b)+3.0, PAD_X, -PAD_Z, 132, 170);
/* The same field, offset and lifted twice: the shell rolls in at the base and domes
   over at the crown, so the only straight run on it is the band round its waist. */
loft3(profileAt(padBase,0), profileAt(padOuter,2.4), matLight);
prism(padOuter,null,2.4,PAD_WAIST,'y',matLight);
loft3(profileAt(padOuter,PAD_WAIST), profileAt(padCrown,PAD_H), matLight);
loopAt(S,padBase,0,'y');
loopAt(S,padOuter,PAD_WAIST,'y');
loopAt(S,padCrown,PAD_H,'y');
sideRails(S,padOuter,2.4,PAD_WAIST);

/* two shoulder buttons, laid along the crown's back edge */
[[-45,-21],[21,45]].forEach(function(uu){
  const mid=PAD_X+(uu[0]+uu[1])/2;
  const cap=outline((a,b)=>sdSeg(a,b, PAD_X+uu[0],-(PAD_Z-8), PAD_X+uu[1],-(PAD_Z-8), 5.0),
                    mid, -(PAD_Z-8), 44, 44);
  prism(cap,null,PAD_H,PAD_H+2.4,'y',matLight);
  loopAt(S,cap,PAD_H+2.4,'y'); loopAt(S,cap,PAD_H+0.05,'y');
});

/* Left thumb takes the stick with the d-pad under it, right thumb the buttons with
   its own stick under those.  The root mirrors the whole drawing, so the clusters
   are built swapped — that is what lands them under the right hands. */
const DP_X=PAD_X+22, DP_Z=PAD_Z+26;
const dpad = outline((a,b)=>smin(
    sdSeg(a,b, DP_X-11,-DP_Z, DP_X+11,-DP_Z, 4.6),
    sdSeg(a,b, DP_X,-(DP_Z-11), DP_X,-(DP_Z+11), 4.6), 2.6), DP_X, -DP_Z, 76, 44);
prism(dpad,null,PAD_H,PAD_H+3.0,'y',matLight);
loopAt(S,dpad,PAD_H+3.0,'y'); loopAt(S,dpad,PAD_H+0.05,'y');

const FB_X=PAD_X-34, FB_Z=PAD_Z-4, FB_R=5.2, FB_S=11.2;
const faceButtons=[[FB_X,FB_Z-FB_S],[FB_X+FB_S,FB_Z],[FB_X,FB_Z+FB_S],[FB_X-FB_S,FB_Z]];
for(const b of faceButtons){
  const c=circle(b[0],-b[1],FB_R,16);
  prism(c,null,PAD_H,PAD_H+2.8,'y',matLight);
  loopAt(S,c,PAD_H+2.8,'y'); loopAt(S,c,PAD_H+0.05,'y');
}

const sticks=[[PAD_X+34,PAD_Z-4],[PAD_X-20,PAD_Z+26]];
for(const s of sticks){
  loopAt(S,circle(s[0],-s[1],12.4,22),PAD_H+0.05,'y');
  const cap=circle(s[0],-s[1],8.4,20);
  prism(cap,null,PAD_H-1.2,PAD_H+4.2,'y',matLight);
  loopAt(S,cap,PAD_H+4.2,'y');
  loopAt(S,circle(s[0],-s[1],5.0,16),PAD_H+4.26,'y');
}

/* minus, plus, and the round home key sitting between the thumbs */
loopAt(S,circle(PAD_X+11,-(PAD_Z+1),3.0,12),PAD_H+0.05,'y');
loopAt(S,circle(PAD_X-11,-(PAD_Z+1),3.0,12),PAD_H+0.05,'y');
loopAt(S,circle(PAD_X,-(PAD_Z+16),4.6,14),PAD_H+0.05,'y');

/* ---------- panel image ---------------------------------------------- */
const screenGeo=new THREE.PlaneGeometry(SC_X1-SC_X0, SC_Y1-SC_Y0);
const screenMat=new THREE.ShaderMaterial({
  side:THREE.DoubleSide,
  uniforms:{
    uTime:{value:0},
    uSize:{value:new THREE.Vector2(SC_X1-SC_X0, SC_Y1-SC_Y0)}
  },
  vertexShader:\`
    varying vec2 vUv;
    void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    precision highp float;
    uniform float uTime;
    uniform vec2 uSize;
    varying vec2 vUv;

    float hash11(float n){ return fract(sin(n*127.1) * 43758.5453); }
    float box(vec2 p, vec2 c, vec2 h){ vec2 d=abs(p-c)-h; return max(d.x,d.y); }
    float fill(vec2 p, vec2 c, vec2 h){ return 1.0 - smoothstep(0.0, 1.15, box(p,c,h)); }

    void main(){
      vec2 p = vec2((1.0-vUv.x)*uSize.x, (1.0-vUv.y)*uSize.y);  /* mirrored quad: x from the left, y from the top */
      float t = uTime;
      float c = 0.0510;
      float GY = uSize.y - 33.0;                    /* the floor the run happens on */

      /* two parallax ridges standing behind the play field */
      for(int k=0;k<2;k++){
        float f = float(k);
        float x = p.x + t * (15.0 + f*27.0);
        float h = 15.0 + f*11.0 + sin(x*0.0305 + f*2.1)*6.0 + sin(x*0.0091 + f*4.7)*9.0;
        float in_ = smoothstep(GY-h-0.8, GY-h+0.8, p.y) * step(p.y, GY);
        c = mix(c, 0.082 + f*0.030, in_);
      }

      /* the floor, its rule, and ticks running under the player */
      c = mix(c, 0.112, smoothstep(GY-0.6, GY+0.6, p.y));
      c = mix(c, 0.30, 1.0 - smoothstep(0.5, 1.6, abs(p.y - GY)));
      float tick = step(0.84, fract((p.x + t*64.0) / 23.0))
                 * step(GY+4.5, p.y) * step(p.y, GY+9.5);
      c = mix(c, 0.215, tick);

      /* obstacles rolling in from the right */
      for(int i=0;i<3;i++){
        float fi = float(i);
        float span = uSize.x + 130.0;
        float travel = t*64.0 + fi*128.0;
        float ox = uSize.x + 44.0 - mod(travel, span);
        float oh = 11.0 + hash11(floor(travel/span) + fi*7.0) * 11.0;
        c = mix(c, 0.40, fill(p, vec2(ox, GY - oh*0.5), vec2(4.2, oh*0.5)));
      }

      /* the runner, hopping them, and the shadow that tells you how high */
      float hop = max(0.0, sin(t*3.05));
      float lift = pow(hop, 0.7) * 23.0;
      float px = uSize.x * 0.29;
      c = mix(c, 0.15, fill(p, vec2(px, GY + 2.2), vec2(5.2 - hop*2.4, 1.2)) * (1.0 - hop*0.65));
      c = mix(c, 0.88, fill(p, vec2(px, GY - 9.0 - lift), vec2(4.6, 6.4)));

      /* HUD: a shield bar, three lives, and a score that keeps counting */
      c = mix(c, 0.125, fill(p, vec2(31.0, 12.0), vec2(25.0, 4.0)));
      float ch = 0.44 + 0.34*sin(t*0.53);
      c = mix(c, 0.50, fill(p, vec2(8.5 + 44.0*ch*0.5, 12.0), vec2(22.0*ch, 2.4)));
      for(int i=0;i<3;i++){
        c = mix(c, 0.48, fill(p, vec2(69.0 + float(i)*9.5, 12.0), vec2(2.7, 2.7)));
      }
      for(int i=0;i<5;i++){
        float on = step(0.34, fract(t * (0.55 + float(i)*1.85)));
        c = mix(c, mix(0.115, 0.54, on), fill(p, vec2(uSize.x - 13.0 - float(i)*9.6, 12.0), vec2(3.0, 4.3)));
      }

      /* panel static and a slow phosphor breathe */
      float g = fract(sin(dot(p * 3.7 + vec2(t*61.0, t*37.0), vec2(12.9898, 78.233))) * 43758.5453);
      c += (g - 0.42) * 0.026;
      c *= 0.985 + 0.015 * sin(p.y * 2.1 + t * 3.3);

      gl_FragColor = vec4(vec3(max(c, 0.0)), 1.0);
    }\`
});
const screen=new THREE.Mesh(screenGeo, screenMat);
screen.position.set((SC_X0+SC_X1)/2, (SC_Y0+SC_Y1)/2, Z_BEZEL+0.05);
root.add(screen);

/* ---------- background blocks --------------------------------------- */
const D = new Seg();                              /* dim edge set */
const BG_H=16.5;
/* low media shelf behind the desk */
const shelfBox=rect(424,-190,494,-152);           /* profile (X,-Z) */
prism(shelfBox,null,0,BG_H,'y',matBg);
loopAt(D,shelfBox,BG_H,'y'); loopAt(D,shelfBox,0,'y');
railAt(D,shelfBox,[0,1,2,3],0,BG_H,'y');

/* a slim floor speaker standing on it — kept inside the shelf footprint */
const speaker=rect(452,-180,480,-160);
prism(speaker,null,BG_H,110,'y',matBgUp);
loopAt(D,speaker,110,'y'); loopAt(D,speaker,BG_H,'y');
railAt(D,speaker,[0,1,2,3],BG_H,110,'y');
loopAt(D,circle(-170,46,7.4,14),480.1,'x');      /* driver + tweeter, profile (-Z,Y) */
loopAt(D,circle(-170,74,4.0,12),480.1,'x');

/* ---------- two cases, left where they were played ------------------- */
const caseLow=roundRect(524,-250,558,-216,2.4,5);
prism(caseLow,null,0,7,'y',matBg);
loopAt(D,caseLow,7,'y'); loopAt(D,caseLow,0,'y');
railAt(D,caseLow,[0,6,12,18],0,7,'y');
const caseTop=roundRect(529,-245,563,-211,2.4,5);
prism(caseTop,null,7,13.6,'y',matBg);
loopAt(D,caseTop,13.6,'y'); loopAt(D,caseTop,7,'y');
railAt(D,caseTop,[0,6,12,18],7,13.6,'y');
loopAt(D,roundRect(534,-240,558,-216,2,5),13.64,'y');

root.add(makeLines(S.a, C_LINE, 1.0));
root.add(makeLines(D.a, 0x1e1e1e, 1.0));

/* ---------- technical floor grid ------------------------------------ */
(function(){
  const G=new Seg();
  const DASH=6.5, GAP=5.0;
  function dashed(ax,ay,az,bx,by,bz){
    const dx=bx-ax, dz=bz-az;
    const L=Math.hypot(dx,dz);
    let t=0;
    while(t<L){
      const t2=Math.min(t+DASH,L);
      G.add([ax+dx*t/L, ay, az+dz*t/L],[ax+dx*t2/L, ay, az+dz*t2/L]);
      t=t2+GAP;
    }
  }
  const XL=[761,793.5,826,858.5,891,923.5,956,988.5];
  const ZL=[56,95,134,173,212,251,290,329,368,407];
  for(const x of XL) dashed(x,-1.1,40, x,-1.1,430);
  for(const z of ZL) dashed(700,-1.1,z, 1060,-1.1,z);
  dashed(640,-1.1,290, 780,-1.1,290);
  dashed(620,-1.1,251, 760,-1.1,251);
  root.add(makeLines(G.a, C_GRID, 1.0, [130, 265, 570, 600]));

  /* cross ticks */
  const T=new Seg();
  const marks=[[891,173],[891,212],[891,251],[891,329],[923.5,251],[923.5,329],
               [858.5,290],[956,212],[826,329],[793.5,251],[891,368],[956,290]];
  for(const m of marks){
    const x=m[0], z=m[1];
    T.add([x-3.4,-1.0,z-3.4],[x+3.4,-1.0,z+3.4]);
    T.add([x-3.4,-1.0,z+3.4],[x+3.4,-1.0,z-3.4]);
  }
  T.add([556,-1.0,250],[556,-1.0,236]);
  T.add([560,-1.0,184],[575,-1.0,184]);
  root.add(makeLines(T.a, 0x242424, 1.0, [140, 275, 570, 600]));
})();

/* ------------------------------------------------------------------ */
/*  lit controls + glow                                                */
/* ------------------------------------------------------------------ */
function radialTexture(size, power){
  const c=document.createElement('canvas'); c.width=c.height=size;
  const g=c.getContext('2d');
  const img=g.createImageData(size,size);
  const h=size/2;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const d=Math.min(1, Math.hypot(x-h+0.5,y-h+0.5)/h);
    const v=Math.pow(1-d, power);
    const i=(y*size+x)*4;
    img.data[i]=img.data[i+1]=img.data[i+2]=255;
    img.data[i+3]=Math.round(v*255);
  }
  g.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);
  t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter;
  return t;
}
const glowTex=radialTexture(128,2.6);

/* one flat cap + one additive glow per control, opacity driven per frame */
const quadGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);
const discGeo=new THREE.CircleGeometry(0.5,22).rotateX(-Math.PI/2);
const faceGeo=new THREE.PlaneGeometry(1,1);          /* upright, facing +Z */

function emitter(o){
  const upright=!!o.face;
  const capMat=new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0, depthWrite:false, side:THREE.DoubleSide});
  const cap=new THREE.Mesh(upright?faceGeo:(o.round?discGeo:quadGeo), capMat);
  upright ? cap.scale.set(o.w,o.d,1) : cap.scale.set(o.w,1,o.d);
  cap.position.set(o.x,o.y,o.z);
  cap.renderOrder=3;
  root.add(cap);

  const glowMat=new THREE.MeshBasicMaterial({
    map:glowTex, transparent:true, opacity:0, depthWrite:false,
    blending:THREE.AdditiveBlending, depthTest:false, side:THREE.DoubleSide
  });
  const glow=new THREE.Mesh(upright?faceGeo:quadGeo, glowMat);
  const g=Math.max(o.w,o.d)*(o.spread||3.4);
  upright ? glow.scale.set(g,g,1) : glow.scale.set(g,1,g);
  glow.position.set(o.x, o.y+(upright?0:0.05), o.z+(upright?0.06:0));
  glow.renderOrder=4;
  root.add(glow);

  return {cap:capMat, glow:glowMat,
          capPeak:o.capPeak===undefined?0.74:o.capPeak,
          glowPeak:o.glowPeak===undefined?0.16:o.glowPeak,
          on:0, hold:0, t:0};
}

const faceLamps = faceButtons.map(function(b){
  return emitter({x:b[0], y:PAD_H+2.86, z:b[1], w:FB_R*2, d:FB_R*2, round:true});
});
const dpadLamps = [[DP_X,DP_Z-9.0],[DP_X+9.0,DP_Z],[DP_X,DP_Z+9.0],[DP_X-9.0,DP_Z]].map(function(b){
  return emitter({x:b[0], y:PAD_H+3.06, z:b[1], w:4.4, d:4.4, round:true, capPeak:0.60, glowPeak:0.12});
});
const stickLamps = sticks.map(function(s){
  return emitter({x:s[0], y:PAD_H+4.28, z:s[1], w:10.2, d:10.2, round:true, capPeak:0.30, glowPeak:0.10});
});
const homeLamp  = emitter({x:PAD_X, y:PAD_H+0.11, z:PAD_Z+16, w:8.8, d:8.8, round:true, capPeak:0.46, glowPeak:0.13});
const powerLamp = emitter({x:CN_X1-22, y:9.6, z:CN_Z1+0.12, w:3.4, d:3.4, face:true, capPeak:0.88, glowPeak:0.24, spread:6.5});
const taps = faceLamps.concat(dpadLamps);
/* ------------------------------------------------------------------ */
/*  full-frame plate: graded ground behind, film grain in front         */
/* ------------------------------------------------------------------ */
const fxCam   = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const fxQuad  = new THREE.PlaneGeometry(2,2);
const fxRes   = {value:new THREE.Vector2(1,1)};
const fxTime  = {value:0};

const bgScene = new THREE.Scene();
bgScene.add(new THREE.Mesh(fxQuad, new THREE.ShaderMaterial({
  uniforms:{ uRes:fxRes, uTime:fxTime },
  depthTest:false, depthWrite:false,
  vertexShader:\`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }\`,
  fragmentShader:\`
    uniform vec2 uRes; uniform float uTime;
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 q = uv - vec2(0.5, 0.56);
      q.x *= uRes.x / uRes.y;
      float r = length(q);
      float v = mix(0.0664, 0.0225, smoothstep(0.04, 0.92, r));
      v += 0.0055 * sin(uv.x * 3.1 + uTime * 0.13) * cos(uv.y * 2.3 - uTime * 0.09);
      vec3 dq = fract(vec3(gl_FragCoord.xyx) * 0.1031);
      dq += dot(dq, dq.yzx + 33.33);
      v += (fract((dq.x + dq.y) * dq.z) - 0.5) / 255.0;   /* dither out the banding */
      gl_FragColor = vec4(vec3(v), 1.0);
    }\`
})));

const fxScene = new THREE.Scene();
fxScene.add(new THREE.Mesh(fxQuad, new THREE.ShaderMaterial({
  uniforms:{ uRes:fxRes, uTime:fxTime },
  transparent:true, depthTest:false, depthWrite:false,
  blending:THREE.AdditiveBlending,
  vertexShader:\`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }\`,
  fragmentShader:\`
    uniform vec2 uRes; uniform float uTime;
    float hash(vec2 p){                       /* stable for large fragment coords */
      vec3 q = fract(vec3(p.xyx) * 0.1031);
      q += dot(q, q.yzx + 33.33);
      return fract((q.x + q.y) * q.z);
    }
    void main(){
      vec2 fc = gl_FragCoord.xy;
      float t = floor(uTime * 24.0);
      float n = hash(mod(fc + t * vec2(37.0, 61.0), 917.0)) * 0.72
              + hash(mod(fc * 0.5 + t * vec2(19.0, 7.0) + 11.0, 613.0)) * 0.28;
      n = pow(n, 2.3);
      /* a very faint interference band drifting down the frame */
      float band = 0.0035 * pow(max(sin(fc.y * 0.0035 - uTime * 0.7), 0.0), 8.0);
      gl_FragColor = vec4(vec3(n * 0.056 + band), 1.0);
    }\`
})));

/* ------------------------------------------------------------------ */
/*  animation state                                                    */
/* ------------------------------------------------------------------ */
let seed=1337;
function rnd(){ seed=(seed*1664525+1013904223)&0x7fffffff; return seed/0x7fffffff; }

/* the one light that never moves: the console's own */
powerLamp.cap.opacity = powerLamp.capPeak;
powerLamp.glow.opacity = powerLamp.glowPeak;

/* thumbs rest on the sticks, so those stay warm rather than blinking */
for(const e of stickLamps){ e.cap.opacity = e.capPeak*0.55; e.glow.opacity = e.glowPeak*0.6; }
homeLamp.cap.opacity = homeLamp.capPeak*0.5;
homeLamp.glow.opacity = homeLamp.glowPeak*0.5;

/* presses arrive in short bursts, the way a run actually plays */
let nextPress = 0.4;
let burst = 3 + Math.floor(rnd()*4);
/* ------------------------------------------------------------------ */
/*  fit, orbit, run                                                     */
/* ------------------------------------------------------------------ */
function resize(){
  const W = Math.max(1, window.innerWidth), H = Math.max(1, window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H, false);

  const aspect = W / H;
  /* vertical field, in master pixels, that frames the artwork in either format */
  const marginX = (aspect < 1 ? 1.12 : 1.10), marginY = 1.46;
  const viewH = Math.max(ART_H * marginY, ART_W * marginX / aspect);
  const hh = 0.35355 * viewH;          /* 1 world unit along Y == 1.1547 master px */
  const hw = hh * aspect;
  /* lift the subject off dead centre, and slide it clear of the copy column */
  const biasY = (aspect < 1 ? 0.13 : 0.055);
  const biasX = Math.min(0.24, Math.max(0, (aspect - 1.00) * 0.34));
  camera.left = -hw * (1 - biasX); camera.right = hw * (1 + biasX);
  camera.top = hh * (1 - biasY); camera.bottom = -hh * (1 + biasY);
  camera.updateProjectionMatrix();

  lineUniforms.uRes.value.set(W * dpr, H * dpr);
  /* Hairline weight.  It tracks the drawing's scale, but clamped in CSS pixels so a
     big display doesn't turn the ink chunky and a phone doesn't lose it altogether. */
  const inkCss = Math.min(1.2, Math.max(0.75, 0.80 * H / viewH));
  lineUniforms.uW.value = Math.max(1.0, inkCss * dpr);
  fxRes.value.set(W * dpr, H * dpr);
}
window.addEventListener('resize', resize);

/* pointer drives the orbit; it eases back to the isometric rest pose */
function pointAt(e){
  orb.tx = (e.clientX / window.innerWidth) * 2 - 1;
  orb.ty = (e.clientY / window.innerHeight) * 2 - 1;
  orb.tOver = 1;
}
window.addEventListener('pointermove', pointAt, {passive:true});
window.addEventListener('pointerdown', pointAt, {passive:true});
window.addEventListener('pointerleave', ()=>{ orb.tOver = 0; });
window.addEventListener('blur', ()=>{ orb.tOver = 0; });
document.addEventListener('mouseleave', ()=>{ orb.tOver = 0; });

const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let t0 = performance.now(), prev = t0;

function frame(now){
  const t  = (now - t0) / 1000;
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;

  /* camera */
  const k = 1 - Math.pow(0.0016, dt);          /* frame-rate independent easing */
  orb.over += (orb.tOver - orb.over) * k;
  orb.x += (orb.tx * orb.over - orb.x) * k;
  orb.y += (orb.ty * orb.over - orb.y) * k;
  placeCamera(reduced ? 0 : t);

  lineUniforms.uTime.value  = reduced ? 6.4 : t;
  lineUniforms.uIntro.value = reduced ? 1 : Math.min(1, t / 2.1);
  screenMat.uniforms.uTime.value = reduced ? 0.75 : t;
  fxTime.value = reduced ? 0 : t;

  if(!reduced){
    /* someone is playing: presses land on the face buttons and the d-pad in
       bursts, and the pause between bursts is longer than the pause inside one */
    nextPress -= dt;
    if(nextPress <= 0){
      burst -= 1;
      nextPress = burst > 0 ? (0.09 + rnd()*0.17) : (0.55 + rnd()*0.95);
      if(burst <= 0) burst = 2 + Math.floor(rnd()*5);
      const pool = rnd() < 0.58 ? faceLamps : dpadLamps;
      const e = pool[Math.floor(rnd()*pool.length)];
      e.on = 1; e.t = 0; e.hold = 0.05 + rnd()*0.15;
    }
    for(const e of taps){
      if(!e.on) continue;
      e.t += dt;
      const fade = 0.15;
      let v = 1;
      if(e.t < 0.03) v = e.t / 0.03;
      else if(e.t > e.hold) v = Math.max(0, 1 - (e.t - e.hold) / fade);
      e.cap.opacity = e.capPeak * v; e.glow.opacity = e.glowPeak * v;
      if(e.t > e.hold + fade){ e.on = 0; e.cap.opacity = 0; e.glow.opacity = 0; }
    }

    /* the sticks and the home key breathe against the burst rhythm */
    const warm = 0.72 + 0.28 * Math.sin(t * 1.55);
    for(const e of stickLamps){
      e.cap.opacity = e.capPeak * (0.42 + 0.30*warm);
      e.glow.opacity = e.glowPeak * (0.45 + 0.55*warm);
    }
    homeLamp.cap.opacity = homeLamp.capPeak * (0.40 + 0.24*warm);
    homeLamp.glow.opacity = homeLamp.glowPeak * (0.40 + 0.60*warm);
    powerLamp.glow.opacity = powerLamp.glowPeak * (0.88 + 0.12*Math.sin(t*0.9));
  }

  renderer.autoClear = true;
  renderer.render(bgScene, fxCam);      /* graded ground */
  renderer.autoClear = false;
  renderer.render(scene, camera);       /* the machine */
  renderer.render(fxScene, fxCam);      /* grain */
  renderer.autoClear = true;

  requestAnimationFrame(frame);
}
resize();
requestAnimationFrame(frame);

})();
<\/script>
</body>
</html>
`,g=`<!DOCTYPE html>
<!--
  CATHODE / STUDIO — an isometric recording booth built entirely from three.js
  geometry.

  The boom arm, its counterweighted post, the hanging microphone and the pop screen
  are lofted along real 3-D axes rather than the isometric grid, so the rig carries
  the only diagonals in the drawing. Every visible edge is a screen-space
  constant-width line, the desk mixer runs a live programme meter, the sign on the
  treatment panel stays lit, and the camera orbits with the pointer around a true
  isometric rest pose.
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cathode — Every Word, Kept Warm</title>
<meta name="description" content="An isometric recording booth rendered live in three.js.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23090909'/%3E%3Crect x='12' y='5' width='8' height='14' rx='4' fill='none' stroke='%23888' stroke-width='2'/%3E%3Cpath d='M8 16a8 8 0 0 0 16 0M16 24v4' fill='none' stroke='%23888' stroke-width='2'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#0a0a0a;
    color:#f1f1f1;
    font-family:'Inter',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;
    -webkit-font-smoothing:antialiased;
    overflow:hidden;
    cursor:crosshair;
  }

  #gl{
    position:fixed; inset:0; width:100%; height:100%; display:block; z-index:0;
    opacity:0; animation:rise .9s ease .05s forwards;
  }
  @keyframes rise{ to{ opacity:1 } }
  @media (prefers-reduced-motion: reduce){ #gl{opacity:1; animation:none} }

  .ui{
    position:fixed; inset:0; z-index:1; pointer-events:none;
    padding:clamp(20px, 2.6vw, 44px) clamp(22px, 3.4vw, 60px);
    display:grid;
    grid-template-rows:auto 1fr auto;
    gap:clamp(16px, 2vw, 28px);
  }
  .ui a{ pointer-events:auto; cursor:pointer; text-decoration:none }
  .ui a:focus-visible{ outline:1px solid rgba(255,255,255,.45); outline-offset:4px; border-radius:999px }

  /* ---------- top bar ---------- */
  .bar{
    display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;
    gap:16px;
  }
  .logo{
    display:inline-flex; align-items:center; gap:.62em;
    color:#e9e9e9;
    font-size:clamp(10px, .82vw, 13px);
    font-weight:500; letter-spacing:.24em; text-transform:uppercase;
    justify-self:start;
    transition:color .18s ease;
  }
  .logo svg{ width:1.72em; height:1.72em; display:block; color:#c9c9c9; transition:color .18s ease }
  .logo:hover, .logo:hover svg{ color:#fff }

  .pill{
    justify-self:center;
    display:flex; align-items:center; gap:2px;
    padding:4px;
    border-radius:999px;
    background:rgba(255,255,255,.038);
    border:1px solid rgba(255,255,255,.075);
    backdrop-filter:blur(14px) saturate(120%);
    -webkit-backdrop-filter:blur(14px) saturate(120%);
  }
  .pill a{
    display:block;
    padding:.62em 1.15em;
    border-radius:999px;
    font-size:clamp(11px, .86vw, 13.5px);
    font-weight:500; letter-spacing:.005em;
    color:#8e8e8e; white-space:nowrap;
    transition:color .18s ease, background .18s ease;
  }
  .pill a:hover{ color:#ededed; background:rgba(255,255,255,.05) }
  .pill a.on{ color:#f2f2f2; background:rgba(255,255,255,.075) }

  .ghost{
    justify-self:end;
    display:inline-block;
    padding:.68em 1.35em;
    border-radius:999px;
    border:1px solid rgba(255,255,255,.14);
    font-size:clamp(11px, .86vw, 13.5px);
    font-weight:500;
    color:#dcdcdc;
    transition:color .18s ease, background .18s ease, border-color .18s ease;
  }
  .ghost:hover{ color:#fff; background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.28) }

  /* ---------- copy ---------- */
  .copy{ align-self:end; justify-self:end; text-align:right; max-width:min(46ch, 88vw) }
  .kicker{
    font-size:clamp(11px, .95vw, 14px);
    font-weight:500;
    letter-spacing:.10em;
    color:#727272;
  }
  .title{
    margin-top:clamp(10px, .9vw, 18px);
    font-size:clamp(30px, 4.35vw, 64px);
    font-weight:400;
    letter-spacing:-.016em;
    line-height:1.02;
    color:#f1f1f1;
  }
  .lede{
    margin-top:clamp(12px, 1.1vw, 22px);
    font-size:clamp(14px, 1.22vw, 19px);
    font-weight:400;
    line-height:1.58;
    color:#8d8d8d;
  }
  .cta{
    margin-top:clamp(18px, 1.7vw, 30px);
    display:inline-flex; align-items:center; gap:.7em;
    padding:.85em 1.5em;
    border-radius:999px;
    background:#efefef;
    color:#0b0b0b;
    font-size:clamp(13px, 1.02vw, 16px);
    font-weight:500; letter-spacing:-.004em;
    transition:background .18s ease, box-shadow .18s ease, transform .18s ease;
  }
  .cta svg{ width:.82em; height:.82em; display:block }
  .cta:hover{ background:#fff; box-shadow:0 0 0 6px rgba(255,255,255,.06) }
  .cta:active{ transform:translateY(1px) }

  /* ---------- footnote ---------- */
  .foot{
    align-self:end;
    display:flex; justify-content:flex-start;
    margin-top:clamp(14px, 1.6vw, 26px);
  }
  .hint{
    font-size:clamp(9px, .72vw, 11px);
    font-weight:500;
    letter-spacing:.22em;
    text-transform:uppercase;
    color:#4c4c4c;
  }
  .hint::before{
    content:""; display:inline-block;
    width:1.6em; height:1px; margin-right:.9em; vertical-align:middle;
    background:#3a3a3a;
  }
  .hint::after{ content:"Move to orbit" }
  @media (hover:none){ .hint::after{ content:"Drag to orbit" } }

  @media (max-width:880px){
    .pill{ display:none }
    .bar{ grid-template-columns:1fr auto }
  }
  @media (max-width:640px){
    .copy{max-width:100%}
    .ghost{ padding:.6em 1.1em }
  }
</style>
</head>
<body>
<canvas id="gl"></canvas>

<div class="ui">
  <header class="bar">
    <a class="logo" href="#">
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="8.3" y="2.5" width="5.4" height="9.6" rx="2.7" stroke="currentColor" stroke-width="1.35"/>
        <path d="M5.4 10.4a5.6 5.6 0 0 0 11.2 0" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
        <path d="M11 16v3.4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
      </svg>
      <span>Cathode</span>
    </a>

    <nav class="pill" aria-label="Primary">
      <a class="on" href="#">Studio</a>
      <a href="#">Gear</a>
      <a href="#">Support</a>
      <a href="#">Journal</a>
    </nav>

    <a class="ghost" href="#">Sign in</a>
  </header>

  <div class="copy">
    <div class="kicker">02 / 09</div>
    <h1 class="title">Every Word, Kept&nbsp;Warm</h1>
    <p class="lede">Studio capture for people who record in the room they actually live in.</p>
    <a class="cta" href="#">
      Configure a studio
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1.5 6h9M6.8 2.2 10.6 6l-3.8 3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>

  <div class="foot"><span class="hint"></span></div>
</div>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
(function(){
'use strict';

/* ------------------------------------------------------------------
   COORDINATE SYSTEM
   World units are pixels of the 1080x1080 master frame the model was
   measured in.  At the isometric rest pose:
     px = X - Z
     py = 0.5774*(X + Z) - 1.1547*Y
   The floor is Y = 0.
-------------------------------------------------------------------*/

/* projected bounds of the artwork, in master pixels */
const ART = { x0:254, x1:777, y0:214, y1:676 };
const ART_W = ART.x1 - ART.x0, ART_H = ART.y1 - ART.y0;
const ART_CX = (ART.x0 + ART.x1) / 2, ART_CY = (ART.y0 + ART.y1) / 2;

/* world point that sits at the middle of the artwork (solved at Y = 90) */
const TARGET = new THREE.Vector3(
  ((ART_CY + 1.1547*90) / 0.5774 + ART_CX) / 2, 90,
  ((ART_CY + 1.1547*90) / 0.5774 - ART_CX) / 2
);

/* isometric rest pose in spherical terms: direction (1,1,1)/sqrt(3) */
const BASE_THETA = Math.PI / 4;
const BASE_PHI   = Math.acos(1 / Math.sqrt(3));
const CAM_DIST   = 4200;

THREE.ColorManagement.enabled = false;

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.outputEncoding = THREE.LinearEncoding;

const scene  = new THREE.Scene();

/* The model was measured facing down-left.  Reflecting it through the plane
   X = Z + MIRROR_K mirrors the whole drawing about its own vertical axis:
   px = X-Z flips sign around MIRROR_K while py = 0.5774(X+Z) - 1.1547Y is
   untouched.  Everything is built into this root, so shader work stays in the
   original model space and mirrors for free. */
const MIRROR_K = 515.5;
const root = new THREE.Group();
root.matrixAutoUpdate = false;
root.matrix.set(0,0,1, MIRROR_K,
                0,1,0, 0,
                1,0,0,-MIRROR_K,
                0,0,0, 1);
scene.add(root);
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 12000);
camera.up.set(0, 1, 0);

/* orbit state */
const orb = { x:0, y:0, tx:0, ty:0, over:0, tOver:0 };
function placeCamera(t){
  const az = orb.x * 0.26 + Math.sin(t * 0.17) * 0.028;
  const el = -orb.y * 0.17 + Math.sin(t * 0.11 + 1.1) * 0.018;
  const th = BASE_THETA + az;
  const ph = Math.min(1.30, Math.max(0.34, BASE_PHI + el));
  const sp = Math.sin(ph);
  camera.position.set(
    TARGET.x + CAM_DIST * sp * Math.cos(th),
    TARGET.y + CAM_DIST * Math.cos(ph),
    TARGET.z + CAM_DIST * sp * Math.sin(th)
  );
  camera.lookAt(TARGET);
}

/* palette (sRGB byte values measured off the reference) */
const C_TOP   = 0x1b1b1b;   //  27  – faces pointing up
const C_FRONT = 0x1b1b1b;   //  27  – faces pointing +Z
const C_SIDE  = 0x121212;   //  18  – faces pointing +X
const C_DARK  = 0x121212;   //  18  – base / plinth material
const C_LINE  = 0x3a3a3a;   //  58  – drawn edges
const C_GRID  = 0x121212;

/* ------------------------------------------------------------------ */
/*  materials                                                          */
/* ------------------------------------------------------------------ */
function faceMaterial(top, front, side){
  return new THREE.ShaderMaterial({
    uniforms:{
      cTop:{value:new THREE.Color(top)},
      cFront:{value:new THREE.Color(front)},
      cSide:{value:new THREE.Color(side)}
    },
    vertexShader:\`
      varying vec3 vN;
      void main(){
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }\`,
    fragmentShader:\`
      uniform vec3 cTop, cFront, cSide;
      varying vec3 vN;
      void main(){
        vec3 n = normalize(vN);
        float ax = abs(n.x), ay = abs(n.y), az = abs(n.z);
        vec3 c = cTop;
        if (ay >= ax && ay >= az)      c = cTop;
        else if (az >= ax)             c = cFront;
        else                           c = cSide;
        gl_FragColor = vec4(c, 1.0);
      }\`,
    side:THREE.DoubleSide
  });
}
/* after the mirror the drawing's front turns to +X and its cheek to +Z,
   so the two wall values swap places */
const matLight = faceMaterial(C_TOP, C_SIDE, C_FRONT);
const matDark  = faceMaterial(C_DARK, C_DARK, C_DARK);

/* secondary props sit in a soft haze that fades them from 17 to 23.
   Written in world space so it stays welded to the props while the camera orbits. */
function hazeMaterial(sideMul){
 return new THREE.ShaderMaterial({
  uniforms:{ uSide:{value:sideMul} },
  vertexShader:\`
    varying vec3 vN; varying vec3 vW;
    void main(){
      vN = normalize(mat3(modelMatrix) * normal);
      vW = position;                       /* model space: mirrors with the root */
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }\`,
  fragmentShader:\`
    uniform float uSide;
    varying vec3 vN; varying vec3 vW;
    void main(){
      float f = clamp(0.016196*vW.x - 0.008591*vW.y - 0.007604*vW.z - 5.819, 0.0, 1.0);
      float v = mix(0.0666, 0.0902, f);
      vec3 n = normalize(vN);
      if (abs(n.y) < max(abs(n.x), abs(n.z))) v *= uSide;
      gl_FragColor = vec4(vec3(v), 1.0);
    }\`,
  side:THREE.DoubleSide
 });
}
const matBg   = hazeMaterial(0.80);   /* props: only the top catches the haze */
const matBgUp = hazeMaterial(1.00);   /* upright panel: its face is what we see */

/* ------------------------------------------------------------------ */
/*  screen-space constant-width lines                                  */
/* ------------------------------------------------------------------ */
const lineUniforms = {
  uRes:{value:new THREE.Vector2(1080,1080)},
  uW:{value:2.0},
  uTime:{value:0},
  uIntro:{value:0}
};
function lineMaterial(color, opacity, fade){
  return new THREE.ShaderMaterial({
    uniforms:Object.assign({
      uColor:{value:new THREE.Color(color)},
      uOpacity:{value:opacity===undefined?1:opacity},
      uFade:{value:new THREE.Vector2(fade?fade[0]:1e6, fade?fade[1]:1e6+1)},
      uFadeC:{value:new THREE.Vector2(fade?fade[2]:0, fade?fade[3]:0)}
    }, lineUniforms),
    transparent:true,
    depthWrite:false,
    side:THREE.DoubleSide,
    vertexShader:\`
      uniform vec2 uRes; uniform float uW;
      attribute vec3 aOther;
      attribute float aSide;
      attribute float aSeed;
      varying vec3 vW; varying float vSeed;
      void main(){
        vW = position; vSeed = aSeed;
        vec4 c0 = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        vec4 c1 = projectionMatrix * modelViewMatrix * vec4(aOther,1.0);
        vec2 n0 = c0.xy / c0.w;
        vec2 n1 = c1.xy / c1.w;
        vec2 d  = (n1 - n0) * uRes;
        float L = length(d);
        d = (L > 0.0001) ? d / L : vec2(1.0, 0.0);
        vec2 perp = vec2(-d.y, d.x);
        vec2 off = (perp * aSide * uW * 0.5 - d * uW * 0.5) / uRes * 2.0;
        c0.xy += off * c0.w;
        gl_Position = c0;
      }\`,
    fragmentShader:\`
      uniform vec3 uColor; uniform float uOpacity;
      uniform float uTime, uIntro; uniform vec2 uFade, uFadeC;
      varying vec3 vW; varying float vSeed;
      void main(){
        float a = uOpacity;

        /* the drawing assembles itself once, back to front */
        float depth = clamp((vW.x + vW.z - 380.0) / 760.0, 0.0, 1.0);
        a *= smoothstep(0.0, 0.30, uIntro * 1.34 - depth * 0.34);

        /* grid and other far strokes dissolve into the plate, measured on screen */
        vec2 pp = vec2(vW.x - vW.z, 0.5774 * (vW.x + vW.z) - 1.1547 * vW.y);
        float d = length((pp - uFadeC) * vec2(1.0, 1.5));
        a *= 1.0 - smoothstep(uFade.x, uFade.y, d);

        /* a scan plane rides up through the wireframe */
        float scanY = mod(uTime * 54.0, 330.0) - 52.0;
        float dy = vW.y - scanY;
        float pulse = exp(-dy * dy / 110.0) + 0.34 * exp(-dy * dy / 1150.0);

        /* a slower glint travelling along the plan diagonal */
        float w = sin((vW.x + vW.z) * 0.016 - uTime * 1.15);
        float glint = pow(max(w, 0.0), 14.0);

        /* per-stroke shimmer so nothing sits perfectly still */
        float sh = 0.94 + 0.06 * sin(uTime * 1.9 + vSeed * 41.0);

        vec3 col = uColor * sh + vec3(pulse * 0.36 + glint * 0.15);
        gl_FragColor = vec4(col, a);
      }\`
  });
}

/* nudge lines toward the camera along (1,1,1) — screen-neutral under iso */
const EPS = 0.55;

function makeLines(segs, color, opacity, fade){
  const n = segs.length / 6;
  const pos   = new Float32Array(n*4*3);
  const oth   = new Float32Array(n*4*3);
  const side  = new Float32Array(n*4);
  const seed  = new Float32Array(n*4);
  const index = new Uint32Array(n*6);
  for(let i=0;i<n;i++){
    const ax=segs[i*6]+EPS,   ay=segs[i*6+1]+EPS, az=segs[i*6+2]+EPS;
    const bx=segs[i*6+3]+EPS, by=segs[i*6+4]+EPS, bz=segs[i*6+5]+EPS;
    const v=i*4;
    // two verts at a (other = b), two verts at b (other = a)
    const P=[[ax,ay,az,bx,by,bz,-1],[ax,ay,az,bx,by,bz, 1],
             [bx,by,bz,ax,ay,az,-1],[bx,by,bz,ax,ay,az, 1]];
    for(let k=0;k<4;k++){
      pos[(v+k)*3]=P[k][0]; pos[(v+k)*3+1]=P[k][1]; pos[(v+k)*3+2]=P[k][2];
      oth[(v+k)*3]=P[k][3]; oth[(v+k)*3+1]=P[k][4]; oth[(v+k)*3+2]=P[k][5];
      side[v+k]=P[k][6];
      seed[v+k]=(Math.sin(i*12.9898)*43758.5453)%1;
    }
    index[i*6]=v; index[i*6+1]=v+1; index[i*6+2]=v+2;
    index[i*6+3]=v; index[i*6+4]=v+2; index[i*6+5]=v+3;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aOther',   new THREE.BufferAttribute(oth,3));
  g.setAttribute('aSide',    new THREE.BufferAttribute(side,1));
  g.setAttribute('aSeed',    new THREE.BufferAttribute(seed,1));
  g.setIndex(new THREE.BufferAttribute(index,1));
  const m=new THREE.Mesh(g, lineMaterial(color===undefined?C_LINE:color, opacity, fade));
  m.frustumCulled=false;
  m.renderOrder=2;
  return m;
}

/* segment accumulator */
function Seg(){ this.a=[]; }
Seg.prototype.add=function(p,q){ this.a.push(p[0],p[1],p[2],q[0],q[1],q[2]); };
Seg.prototype.loop=function(pts){                       // pts: [[x,y,z],...]
  for(let i=0;i<pts.length;i++) this.add(pts[i], pts[(i+1)%pts.length]);
};
Seg.prototype.path=function(pts){
  for(let i=0;i<pts.length-1;i++) this.add(pts[i], pts[i+1]);
};

/* ------------------------------------------------------------------ */
/*  2D helpers                                                         */
/* ------------------------------------------------------------------ */
function rect(x0,y0,x1,y1){ return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]]; }

function roundRect(x0,y0,x1,y1,r,seg){
  seg = seg||5;
  r = Math.min(r, (x1-x0)/2, (y1-y0)/2);
  const p=[];
  const corners=[[x1-r,y0+r,-Math.PI/2,0],[x1-r,y1-r,0,Math.PI/2],
                 [x0+r,y1-r,Math.PI/2,Math.PI],[x0+r,y0+r,Math.PI,Math.PI*1.5]];
  for(const [cx,cy,a0,a1] of corners){
    for(let i=0;i<=seg;i++){
      const a=a0+(a1-a0)*i/seg;
      p.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]);
    }
  }
  return p;
}

/* map profile (a,b) + extrusion t to world, per axis */
const MAP = {
  z:(a,b,t)=>[a, b, t],          // profile = (X,Y), extrude along Z
  x:(a,b,t)=>[t, b, -a],         // profile = (-Z,Y), extrude along X
  y:(a,b,t)=>[a, t, -b]          // profile = (X,-Z), extrude along Y
};
const MATRIX = {
  z:new THREE.Matrix4(),
  x:new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0)),
  y:new THREE.Matrix4().makeBasis(new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0))
};

function toShape(pts){
  const s=new THREE.Shape();
  s.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) s.lineTo(pts[i][0],pts[i][1]);
  s.closePath();
  return s;
}

/* build an extruded prism; returns the mesh */
function prism(pts, holes, t0, t1, axis, material){
  const shape=toShape(pts);
  if(holes) for(const h of holes){
    const p=new THREE.Path();
    p.moveTo(h[0][0],h[0][1]);
    for(let i=1;i<h.length;i++) p.lineTo(h[i][0],h[i][1]);
    p.closePath();
    shape.holes.push(p);
  }
  const g=new THREE.ExtrudeGeometry(shape,{depth:t1-t0, bevelEnabled:false, curveSegments:4});
  g.translate(0,0,t0);
  g.applyMatrix4(MATRIX[axis]);
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

/* loft a closed XY profile between two Z stations; flat-shaded, unindexed */
function loft(ptsA, zA, ptsB, zB, material){
  const n=ptsA.length, pos=[];
  const push=(x,y,z)=>{ pos.push(x,y,z); };
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    push(ptsA[i][0],ptsA[i][1],zA); push(ptsA[j][0],ptsA[j][1],zA); push(ptsB[j][0],ptsB[j][1],zB);
    push(ptsA[i][0],ptsA[i][1],zA); push(ptsB[j][0],ptsB[j][1],zB); push(ptsB[i][0],ptsB[i][1],zB);
  }
  [[ptsA,zA],[ptsB,zB]].forEach(function(cap){
    const pts=cap[0], z=cap[1];
    const tri=THREE.ShapeUtils.triangulateShape(pts.map(p=>new THREE.Vector2(p[0],p[1])), []);
    for(const t of tri){
      push(pts[t[0]][0],pts[t[0]][1],z);
      push(pts[t[1]][0],pts[t[1]][1],z);
      push(pts[t[2]][0],pts[t[2]][1],z);
    }
  });
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.computeVertexNormals();
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

function loopAt(seg, pts, t, axis){
  const f=MAP[axis];
  seg.loop(pts.map(p=>f(p[0],p[1],t)));
}
function railAt(seg, pts, idxs, t0, t1, axis){
  const f=MAP[axis];
  for(const i of idxs) seg.add(f(pts[i][0],pts[i][1],t0), f(pts[i][0],pts[i][1],t1));
}
/* ==================================================================
   GEOMETRY
   ================================================================== */
const S = new Seg();          // main edge set

/* ---------- profile and free-axis helpers ---------------------------- */
function circle(cx,cy,r,seg){
  const p=[];
  for(let i=0;i<seg;i++){ const a=i/seg*Math.PI*2; p.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]); }
  return p;
}

/* loft between two matched 3-D rings; flat shaded, unindexed */
function loft3(A,B,material){
  const pos=[], n=A.length;
  const push=p=>pos.push(p[0],p[1],p[2]);
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    push(A[i]); push(A[j]); push(B[j]);
    push(A[i]); push(B[j]); push(B[i]);
  }
  for(const cap of [A,B]) for(let i=1;i<n-1;i++){ push(cap[0]); push(cap[i]); push(cap[i+1]); }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.computeVertexNormals();
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

/* A straight member running p -> q with a regular section: seg 4 gives the boom's
   square tubing, seg 18 the microphone barrel.  Its own frame is carried along, so
   nothing here has to sit on the isometric grid. */
function member(p,q,r0,r1,seg,material,edges,opt){
  opt = opt || {};
  const d=new THREE.Vector3(q[0]-p[0],q[1]-p[1],q[2]-p[2]);
  const L=d.length();
  const up=(Math.abs(d.y) > L*0.94) ? new THREE.Vector3(1,0,0) : new THREE.Vector3(0,1,0);
  const u=new THREE.Vector3().crossVectors(up,d).normalize();
  const v=new THREE.Vector3().crossVectors(d,u).normalize();
  const phase=(opt.phase===undefined?0.5:opt.phase);
  function ring(t, rr){
    const r=(rr===undefined) ? r0+(r1-r0)*t : rr;
    const cx=p[0]+(q[0]-p[0])*t, cy=p[1]+(q[1]-p[1])*t, cz=p[2]+(q[2]-p[2])*t;
    const out=[];
    for(let i=0;i<seg;i++){
      const a=(i+phase)/seg*Math.PI*2, c=Math.cos(a)*r, s=Math.sin(a)*r;
      out.push([cx+u.x*c+v.x*s, cy+u.y*c+v.y*s, cz+u.z*c+v.z*s]);
    }
    return out;
  }
  const A=ring(0), B=ring(1);
  loft3(A,B,material);
  if(edges){
    if(!opt.openA) edges.loop(A);
    if(!opt.openB) edges.loop(B);
    /* A section with few sides shows every corner; a barrel shows only the two
       strokes where it turns away.  Those sit at the extremes measured across the
       member on screen — px = 1031 + z - x and py = 0.5774(x+z) - 1.1547y skew a
       tube far enough that picking extremes in x or z alone leaves it unbounded,
       and any rings drawn round it then read as loose arcs. */
    if(seg<=6){ for(let i=0;i<seg;i++) edges.add(A[i],B[i]); }
    else {
      const sxy=g=>[g[2]-g[0], 0.5774*(g[0]+g[2]) - 1.1547*g[1]];
      const s0=sxy(p), s1=sxy(q);
      let ax=s1[0]-s0[0], ay=s1[1]-s0[1];
      const al=Math.hypot(ax,ay)||1; ax/=al; ay/=al;
      let lo=0, hi=0, loV=Infinity, hiV=-Infinity;
      for(let i=0;i<seg;i++){
        const s=sxy(A[i]);
        const across=(s[0]-s0[0])*(-ay) + (s[1]-s0[1])*ax;
        if(across < loV){ loV=across; lo=i; }
        if(across > hiV){ hiV=across; hi=i; }
      }
      edges.add(A[lo],B[lo]); edges.add(A[hi],B[hi]);
    }
    if(opt.rings) for(const t of opt.rings) edges.loop(ring(t));
  }
  return ring;
}

/* ---------- treatment panel on the wall ------------------------------ */
const D = new Seg();                              /* dim edge set */
const WP_X0=436, WP_X1=560, WP_Z0=144, WP_Z1=156, WP_Y0=10, WP_Y1=118;
/* a low riser grounds the panel, the way the drawing grounds everything else */
const riser=rect(430,-174,568,-138);
prism(riser,null,0,12,'y',matBg);
loopAt(D,riser,12,'y'); loopAt(D,riser,0,'y');
railAt(D,riser,[0,1,2,3],0,12,'y');

const wallPanel=roundRect(WP_X0,WP_Y0,WP_X1,WP_Y1,3,4);
prism(wallPanel,null,WP_Z0,WP_Z1,'z',matBgUp);
loopAt(D,wallPanel,WP_Z1,'z'); loopAt(D,wallPanel,WP_Z0,'z');
railAt(D,wallPanel,[0,5,10,15],WP_Z0,WP_Z1,'z');
/* foam tiles, scored into the face */
for(let r=0;r<3;r++) for(let c=0;c<4;c++){
  const x0=WP_X0+8+c*28.5, y0=WP_Y0+8+r*26.5;
  loopAt(D,roundRect(x0,y0,x0+24,y0+22,2,4),WP_Z1+0.1,'z');
}

/* the sign, mounted proud of the panel */
const SG_X0=466, SG_X1=536, SG_Y0=94, SG_Y1=116, SG_Z=WP_Z1+2.6;
const signCase=roundRect(SG_X0,SG_Y0,SG_X1,SG_Y1,3,4);
prism(signCase,null,WP_Z1,SG_Z,'z',matBgUp);
loopAt(D,signCase,SG_Z,'z'); loopAt(D,signCase,WP_Z1,'z');
loopAt(D,roundRect(SG_X0+3.5,SG_Y0+3.5,SG_X1-3.5,SG_Y1-3.5,2,4),SG_Z+0.05,'z');

/* Its legend is drawn into a canvas rather than shaped out of geometry — and drawn
   flipped, because the root reflects everything on its way to the screen. */
function legendTexture(text){
  const c=document.createElement('canvas');
  c.width=512; c.height=109;                   /* matches the lit plate, so nothing stretches */
  const g=c.getContext('2d');
  g.clearRect(0,0,c.width,c.height);
  g.translate(c.width,0); g.scale(-1,1);
  g.fillStyle='#ffffff';
  g.textAlign='left'; g.textBaseline='middle';
  g.font='600 56px Inter, Helvetica Neue, Arial, sans-serif';
  const chars=text.split('');
  const TRACK=11;                              /* canvas has no letter-spacing, so track by hand */
  let total=-TRACK;
  for(const ch of chars) total += g.measureText(ch).width + TRACK;
  let x=(c.width-total)/2;
  for(const ch of chars){
    g.fillText(ch, x, c.height/2 + 2);
    x += g.measureText(ch).width + TRACK;
  }
  const t=new THREE.CanvasTexture(c);
  t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter;
  return t;
}
const signLegend=document.documentElement.dataset.web3dkitPresentation==='background' ? '' : 'ON AIR';
const signMat=new THREE.MeshBasicMaterial({
  map:legendTexture(signLegend), transparent:true, opacity:0.92,
  depthWrite:false, side:THREE.DoubleSide
});
/* Inter arrives after the first paint, so the legend is drawn again once it has */
if(document.fonts && document.fonts.ready){
  document.fonts.ready.then(function(){
    signMat.map.dispose();
    signMat.map = legendTexture(signLegend);
    signMat.needsUpdate = true;
  });
}
const signFace=new THREE.Mesh(new THREE.PlaneGeometry(SG_X1-SG_X0-9, SG_Y1-SG_Y0-9), signMat);
signFace.position.set((SG_X0+SG_X1)/2, (SG_Y0+SG_Y1)/2, SG_Z+0.12);
signFace.renderOrder=3;
root.add(signFace);

/* ---------- boom arm -------------------------------------------------- */
const MOUNT_X0=840, MOUNT_X1=896, MOUNT_Z0=114, MOUNT_Z1=158;
const mount=roundRect(MOUNT_X0,-MOUNT_Z1,MOUNT_X1,-MOUNT_Z0,5,6);
prism(mount,null,0,14,'y',matLight);
loopAt(S,mount,14,'y'); loopAt(S,mount,0,'y');
railAt(S,mount,[0,7,14,21],0,14,'y');
loopAt(S,roundRect(MOUNT_X0+7,-(MOUNT_Z1-7),MOUNT_X1-7,-(MOUNT_Z0+7),4,5),14.05,'y');

const POST_TOP=[868,162,134];
member([868,14,136], POST_TOP, 6.0,5.2, 4, matLight, S, {phase:0.5});
const ELBOW=[748,188,174];
member(POST_TOP, ELBOW, 5.2,4.6, 4, matLight, S, {phase:0.5});
const WRIST=[722,154,210];
member(ELBOW, WRIST, 4.6,4.2, 4, matLight, S, {phase:0.5});
/* the two joints */
member([868,152,134],[868,172,134], 8.2,8.2, 10, matLight, S, {});
member([740,182,168],[756,194,180], 7.4,7.4, 10, matLight, S, {});

/* ---------- microphone ------------------------------------------------ */
const MIC_TAIL=[720,150,214], MIC_HEAD=[688,96,268];
member(WRIST, MIC_TAIL, 4.2,5.4, 4, matLight, S, {});
/* the yoke that carries it */
member([726,156,208],[714,144,220], 7.0,7.0, 10, matLight, S, {});
/* The mount collar is a solid raised band rather than a hoop of ink: a wire ring
   sits far enough off the barrel that it reads as a separate floating ellipse. */
member([711.0,134.9,229.1],[708.5,130.6,233.4], 17.6,17.6, 18, matLight, S, {});
/* barrel, then the grille — rings on an even pitch, stopping short of the rim */
member(MIC_TAIL, MIC_HEAD, 13.0,18.4, 18, matLight, S,
       {rings:[0.44,0.55,0.66,0.77,0.88]});
/* the rim the grille ends on, and the dome that closes it */
member(MIC_HEAD,[686.65,93.72,270.28], 18.4,19.6, 18, matLight, S, {openA:true});
member([686.65,93.72,270.28],[683.94,89.15,274.85], 19.6,9.5, 18, matLight, S, {openA:true});

/* ---------- desk mixer ------------------------------------------------ */
const MX_X0=620, MX_X1=846, MX_Z0=250, MX_Z1=332, MX_H=13;
const deck=roundRect(MX_X0,-MX_Z1,MX_X1,-MX_Z0,6,7);
prism(deck,null,0,MX_H,'y',matLight);
loopAt(S,deck,MX_H,'y'); loopAt(S,deck,0,'y');
railAt(S,deck,[0,8,16,24],0,MX_H,'y');
loopAt(S,roundRect(MX_X0+5,-(MX_Z1-5),MX_X1-5,-(MX_Z0+5),4,6),MX_H+0.03,'y');

/* a row of channel selects along the back edge */
for(let i=0;i<8;i++){
  const cx=MX_X0+18+i*15.6;
  loopAt(S,roundRect(cx-5.0,-(MX_Z0+17),cx+5.0,-(MX_Z0+9),2,4),MX_H+0.04,'y');
}

/* eight channel faders, each in its own slot */
const FD_Z0=294, FD_Z1=326, faders=[];
for(let i=0;i<8;i++){
  const cx=MX_X0+18+i*15.6;
  loopAt(S,roundRect(cx-1.6,-FD_Z1,cx+1.6,-FD_Z0,1.5,4),MX_H+0.04,'y');
  const seat=FD_Z0+6+((i*37)%17);
  const cap=roundRect(cx-5.2,-(seat+4.6),cx+5.2,-(seat-4.6),2,4);
  prism(cap,null,MX_H,MX_H+4.2,'y',matLight);
  loopAt(S,cap,MX_H+4.2,'y'); loopAt(S,cap,MX_H+0.05,'y');
  faders.push({x:cx, z:seat});
}
/* six gain knobs above them */
const knobs=[];
for(let i=0;i<6;i++){
  const cx=MX_X0+24+i*20.5, cz=274;
  const k=circle(cx,-cz,7.2,16);
  prism(k,null,MX_H,MX_H+5.0,'y',matLight);
  loopAt(S,k,MX_H+5.0,'y'); loopAt(S,k,MX_H+0.05,'y');
  S.add([cx,MX_H+5.05,cz],[cx-4.6,MX_H+5.05,cz-4.6]);   /* pointer flat */
  knobs.push({x:cx, z:cz});
}
/* four trigger pads on the right-hand block */
const pads=[];
for(let r=0;r<2;r++) for(let c=0;c<2;c++){
  const cx=MX_X0+156+c*30, cz=280+r*30;
  const pd=roundRect(cx-12,-(cz+12),cx+12,-(cz-12),3,5);
  prism(pd,null,MX_H,MX_H+2.6,'y',matLight);
  loopAt(S,pd,MX_H+2.6,'y'); loopAt(S,pd,MX_H+0.05,'y');
  pads.push({x:cx, z:cz});
}

/* ---------- programme monitor, standing clear of the desk -------------- */
/* It used to ride the mixer's back edge, which read as one object; on its own
   stand behind the desk the meter is a thing you look up at while you talk. */
const MB_X0=740, MB_X1=860, MB_Y0=74, MB_Y1=152, MB_Z0=194, MB_Z1=206;
const bezel=roundRect(MB_X0,MB_Y0,MB_X1,MB_Y1,5,6);
prism(bezel,null,MB_Z0,MB_Z1,'z',matLight);
loopAt(S,bezel,MB_Z1,'z'); loopAt(S,bezel,MB_Z0,'z');
railAt(S,bezel,[0,7,14,21],MB_Z0,MB_Z1,'z');
const SC_X0=748, SC_X1=852, SC_Y0=84, SC_Y1=142;
loopAt(S,roundRect(SC_X0,SC_Y0,SC_X1,SC_Y1,2.4,5),MB_Z1+0.1,'z');

const mNeck=roundRect(782,-210,818,-192,4,5);
prism(mNeck,null,12,MB_Y0+3,'y',matLight);
loopAt(S,mNeck,MB_Y0+3,'y'); loopAt(S,mNeck,12,'y');
railAt(S,mNeck,[0,6,12,18],12,MB_Y0+3,'y');
const mFoot=roundRect(758,-226,842,-178,10,6);
prism(mFoot,null,0,12,'y',matDark);
loopAt(S,mFoot,12,'y'); loopAt(S,mFoot,0,'y');
railAt(S,mFoot,[0,7,14,21],0,12,'y');
loopAt(S,roundRect(770,-216,830,-188,8,6),12.04,'y');

const screenGeo=new THREE.PlaneGeometry(SC_X1-SC_X0, SC_Y1-SC_Y0);
const screenMat=new THREE.ShaderMaterial({
  side:THREE.DoubleSide,
  uniforms:{
    uTime:{value:0},
    uSize:{value:new THREE.Vector2(SC_X1-SC_X0, SC_Y1-SC_Y0)}
  },
  vertexShader:\`
    varying vec2 vUv;
    void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    precision highp float;
    uniform float uTime;
    uniform vec2 uSize;
    varying vec2 vUv;

    float box(vec2 p, vec2 c, vec2 h){ vec2 d=abs(p-c)-h; return max(d.x,d.y); }
    float fill(vec2 p, vec2 c, vec2 h){ return 1.0 - smoothstep(0.0, 1.0, box(p,c,h)); }
    float hash11(float n){ return fract(sin(n*127.1) * 43758.5453); }

    /* one speaker's envelope: syllables inside phrases, with breaths between */
    float voice(float x){
      float phrase = smoothstep(0.05, 0.30, sin(x*0.55) * 0.5 + 0.55);
      float syll   = abs(sin(x*3.1)) * 0.62 + abs(sin(x*7.7 + 1.3)) * 0.30;
      return clamp(phrase * syll * (0.55 + 0.45*sin(x*0.19)), 0.0, 1.0);
    }

    void main(){
      vec2 p = vec2((1.0-vUv.x)*uSize.x, (1.0-vUv.y)*uSize.y);   /* mirrored quad: x from the left, y from the top */
      float t = uTime;
      float c = 0.0555;

      /* the waveform lane, scrolling right to left */
      float LANE_Y = uSize.y * 0.40, LANE_H = uSize.y * 0.30;
      float x = (p.x + t*17.0) * 0.5;
      float env = voice(x) * LANE_H;
      float band = 1.0 - smoothstep(env, env+0.9, abs(p.y - LANE_Y));
      c = mix(c, 0.44, band * step(p.x, uSize.x-24.0));
      /* the loud peaks keep a brighter core */
      c = mix(c, 0.80, band * smoothstep(LANE_H*0.62, LANE_H*0.92, env) * step(p.x, uSize.x-24.0));
      /* centre rule */
      c = mix(c, 0.18, (1.0 - smoothstep(0.4, 1.2, abs(p.y - LANE_Y))) * step(p.x, uSize.x-24.0));

      /* the playhead the waveform runs into */
      c = mix(c, 0.62, fill(p, vec2(uSize.x-27.0, LANE_Y), vec2(0.6, LANE_H)));

      /* two segmented programme meters down the right edge */
      for(int ch=0;ch<2;ch++){
        float f=float(ch);
        float mx = uSize.x - 15.0 + f*8.0;
        float lvl = 0.34 + 0.34*voice((t + f*0.37)*3.4) + 0.16*abs(sin(t*(2.1+f)));
        float pitch = uSize.y * 0.088;
        for(int k=0;k<9;k++){
          float fk=float(k);
          float my = uSize.y - 5.5 - fk*pitch;
          float on = step(fk/9.0, lvl);
          float hot = step(7.0, fk);
          c = mix(c, mix(0.105, mix(0.52, 0.90, hot), on),
                  fill(p, vec2(mx, my), vec2(2.6, pitch*0.34)));
        }
      }

      /* channel labels along the top, and a running counter opposite */
      for(int i=0;i<5;i++){
        float fi=float(i);
        c = mix(c, 0.20 + 0.16*hash11(fi*3.0), fill(p, vec2(7.0 + fi*9.0, 5.5), vec2(3.2, 1.5)));
      }
      for(int i=0;i<4;i++){
        float fi=float(i);
        float on = step(0.4, fract(t*(0.5 + fi*1.7)));
        c = mix(c, mix(0.13, 0.46, on), fill(p, vec2(uSize.x-44.0 + fi*8.0, 5.8), vec2(2.8, 2.2)));
      }

      /* panel static and a slow phosphor breathe */
      float g = fract(sin(dot(p * 3.7 + vec2(t*61.0, t*37.0), vec2(12.9898, 78.233))) * 43758.5453);
      c += (g - 0.42) * 0.024;
      c *= 0.985 + 0.015 * sin(p.y * 2.1 + t * 3.3);

      gl_FragColor = vec4(vec3(max(c, 0.0)), 1.0);
    }\`
});
const screen=new THREE.Mesh(screenGeo, screenMat);
screen.position.set((SC_X0+SC_X1)/2, (SC_Y0+SC_Y1)/2, MB_Z1+0.05);
root.add(screen);

/* ---------- headphones, set down beside the deck ---------------------- */
const CUP_A=[536,0,252], CUP_B=[506,0,282];
[CUP_A,CUP_B].forEach(function(c){
  member([c[0],0,c[2]],[c[0],13,c[2]], 16,16, 18, matBg, D, {});
  loopAt(D,circle(c[0],-c[2],10.5,16),13.05,'y');
});
/* the band, walked round an arc that stands in the plane of the two cups */
(function(){
  const N=9, mid=[(CUP_A[0]+CUP_B[0])/2, 0, (CUP_A[2]+CUP_B[2])/2];
  const half=Math.hypot(CUP_A[0]-mid[0], CUP_A[2]-mid[2]);
  const pt=function(s){                                   /* s: -1 .. 1 */
    return [mid[0]+(CUP_A[0]-mid[0])*s, 13 + Math.cos(s*Math.PI/2)*30, mid[2]+(CUP_A[2]-mid[2])*s];
  };
  for(let i=0;i<N;i++){
    member(pt(-1+2*i/N), pt(-1+2*(i+1)/N), 4.4,4.4, 4, matBg, D, {openA:i>0, openB:i<N-1});
  }
  void half;
})();

root.add(makeLines(S.a, C_LINE, 1.0));
root.add(makeLines(D.a, 0x1e1e1e, 1.0));

/* ---------- technical floor grid ------------------------------------ */
(function(){
  const G=new Seg();
  const DASH=6.5, GAP=5.0;
  function dashed(ax,ay,az,bx,by,bz){
    const dx=bx-ax, dz=bz-az;
    const L=Math.hypot(dx,dz);
    let t=0;
    while(t<L){
      const t2=Math.min(t+DASH,L);
      G.add([ax+dx*t/L, ay, az+dz*t/L],[ax+dx*t2/L, ay, az+dz*t2/L]);
      t=t2+GAP;
    }
  }
  const XL=[761,793.5,826,858.5,891,923.5,956,988.5];
  const ZL=[56,95,134,173,212,251,290,329,368,407];
  for(const x of XL) dashed(x,-1.1,40, x,-1.1,430);
  for(const z of ZL) dashed(700,-1.1,z, 1060,-1.1,z);
  dashed(640,-1.1,290, 780,-1.1,290);
  dashed(620,-1.1,251, 760,-1.1,251);
  root.add(makeLines(G.a, C_GRID, 1.0, [130, 265, 570, 600]));

  const T=new Seg();
  const marks=[[891,173],[891,212],[891,251],[891,329],[923.5,251],[923.5,329],
               [858.5,290],[956,212],[826,329],[793.5,251],[891,368],[956,290]];
  for(const m of marks){
    const x=m[0], z=m[1];
    T.add([x-3.4,-1.0,z-3.4],[x+3.4,-1.0,z+3.4]);
    T.add([x-3.4,-1.0,z+3.4],[x+3.4,-1.0,z-3.4]);
  }
  T.add([556,-1.0,250],[556,-1.0,236]);
  T.add([560,-1.0,184],[575,-1.0,184]);
  root.add(makeLines(T.a, 0x242424, 1.0, [140, 275, 570, 600]));
})();

/* ------------------------------------------------------------------ */
/*  lit controls + glow                                                */
/* ------------------------------------------------------------------ */
function radialTexture(size, power){
  const c=document.createElement('canvas'); c.width=c.height=size;
  const g=c.getContext('2d');
  const img=g.createImageData(size,size);
  const h=size/2;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const d=Math.min(1, Math.hypot(x-h+0.5,y-h+0.5)/h);
    const v=Math.pow(1-d, power);
    const i=(y*size+x)*4;
    img.data[i]=img.data[i+1]=img.data[i+2]=255;
    img.data[i+3]=Math.round(v*255);
  }
  g.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);
  t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter;
  return t;
}
const glowTex=radialTexture(128,2.6);

/* one flat cap + one additive glow per control, opacity driven per frame */
const quadGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);
const discGeo=new THREE.CircleGeometry(0.5,22).rotateX(-Math.PI/2);
const faceGeo=new THREE.PlaneGeometry(1,1);          /* upright, facing +Z */

function emitter(o){
  const upright=!!o.face;
  const capMat=new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0, depthWrite:false, side:THREE.DoubleSide});
  const cap=new THREE.Mesh(upright?faceGeo:(o.round?discGeo:quadGeo), capMat);
  upright ? cap.scale.set(o.w,o.d,1) : cap.scale.set(o.w,1,o.d);
  cap.position.set(o.x,o.y,o.z);
  cap.renderOrder=3;
  root.add(cap);

  const glowMat=new THREE.MeshBasicMaterial({
    map:glowTex, transparent:true, opacity:0, depthWrite:false,
    blending:THREE.AdditiveBlending, depthTest:false, side:THREE.DoubleSide
  });
  const glow=new THREE.Mesh(upright?faceGeo:quadGeo, glowMat);
  const g=Math.max(o.w,o.d)*(o.spread||3.4);
  upright ? glow.scale.set(g,g,1) : glow.scale.set(g,1,g);
  glow.position.set(o.x, o.y+(upright?0:0.05), o.z+(upright?0.06:0));
  glow.renderOrder=4;
  root.add(glow);

  return {cap:capMat, glow:glowMat,
          capPeak:o.capPeak===undefined?0.74:o.capPeak,
          glowPeak:o.glowPeak===undefined?0.16:o.glowPeak,
          on:0, hold:0, t:0};
}

const signGlow  = emitter({x:(SG_X0+SG_X1)/2, y:(SG_Y0+SG_Y1)/2, z:SG_Z+0.08,
                           w:SG_X1-SG_X0-9, d:SG_Y1-SG_Y0-9, face:true,
                           capPeak:0.10, glowPeak:0.26, spread:2.1});
const faderLamps= faders.map(function(f){
  return emitter({x:f.x, y:MX_H+4.26, z:f.z, w:7.4, d:2.4, capPeak:0.62, glowPeak:0.12, spread:4.2});
});
const padLamps  = pads.map(function(p){
  return emitter({x:p.x, y:MX_H+2.66, z:p.z, w:19, d:19, capPeak:0.46, glowPeak:0.13});
});
const knobLamps = knobs.map(function(k){
  return emitter({x:k.x, y:MX_H+5.06, z:k.z, w:4.0, d:4.0, round:true, capPeak:0.50, glowPeak:0.09, spread:5});
});
const micLamp   = emitter({x:884, y:14.08, z:124, w:3.8, d:3.8, round:true, capPeak:0.86, glowPeak:0.20, spread:6});
/* ------------------------------------------------------------------ */
/*  full-frame plate: graded ground behind, film grain in front         */
/* ------------------------------------------------------------------ */
const fxCam   = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const fxQuad  = new THREE.PlaneGeometry(2,2);
const fxRes   = {value:new THREE.Vector2(1,1)};
const fxTime  = {value:0};

const bgScene = new THREE.Scene();
bgScene.add(new THREE.Mesh(fxQuad, new THREE.ShaderMaterial({
  uniforms:{ uRes:fxRes, uTime:fxTime },
  depthTest:false, depthWrite:false,
  vertexShader:\`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }\`,
  fragmentShader:\`
    uniform vec2 uRes; uniform float uTime;
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 q = uv - vec2(0.5, 0.56);
      q.x *= uRes.x / uRes.y;
      float r = length(q);
      float v = mix(0.0664, 0.0225, smoothstep(0.04, 0.92, r));
      v += 0.0055 * sin(uv.x * 3.1 + uTime * 0.13) * cos(uv.y * 2.3 - uTime * 0.09);
      vec3 dq = fract(vec3(gl_FragCoord.xyx) * 0.1031);
      dq += dot(dq, dq.yzx + 33.33);
      v += (fract((dq.x + dq.y) * dq.z) - 0.5) / 255.0;   /* dither out the banding */
      gl_FragColor = vec4(vec3(v), 1.0);
    }\`
})));

const fxScene = new THREE.Scene();
fxScene.add(new THREE.Mesh(fxQuad, new THREE.ShaderMaterial({
  uniforms:{ uRes:fxRes, uTime:fxTime },
  transparent:true, depthTest:false, depthWrite:false,
  blending:THREE.AdditiveBlending,
  vertexShader:\`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }\`,
  fragmentShader:\`
    uniform vec2 uRes; uniform float uTime;
    float hash(vec2 p){                       /* stable for large fragment coords */
      vec3 q = fract(vec3(p.xyx) * 0.1031);
      q += dot(q, q.yzx + 33.33);
      return fract((q.x + q.y) * q.z);
    }
    void main(){
      vec2 fc = gl_FragCoord.xy;
      float t = floor(uTime * 24.0);
      float n = hash(mod(fc + t * vec2(37.0, 61.0), 917.0)) * 0.72
              + hash(mod(fc * 0.5 + t * vec2(19.0, 7.0) + 11.0, 613.0)) * 0.28;
      n = pow(n, 2.3);
      /* a very faint interference band drifting down the frame */
      float band = 0.0035 * pow(max(sin(fc.y * 0.0035 - uTime * 0.7), 0.0), 8.0);
      gl_FragColor = vec4(vec3(n * 0.056 + band), 1.0);
    }\`
})));

/* ------------------------------------------------------------------ */
/*  animation state                                                    */
/* ------------------------------------------------------------------ */
let seed=1337;
function rnd(){ seed=(seed*1664525+1013904223)&0x7fffffff; return seed/0x7fffffff; }

/* The same envelope the meter draws, so the room lights and the picture on the
   bridge are reading one take rather than two unrelated animations. */
function voice(x){
  const phrase=Math.max(0, Math.min(1, (Math.sin(x*0.55)*0.5 + 0.55 - 0.05) / 0.25));
  const syll=Math.abs(Math.sin(x*3.1))*0.62 + Math.abs(Math.sin(x*7.7 + 1.3))*0.30;
  return Math.max(0, Math.min(1, phrase*phrase*(3-2*phrase) * syll * (0.55 + 0.45*Math.sin(x*0.19))));
}

/* the sign and the tally never go out while the take is running */
signGlow.cap.opacity = signGlow.capPeak;
signGlow.glow.opacity = signGlow.glowPeak;
micLamp.cap.opacity = micLamp.capPeak;
micLamp.glow.opacity = micLamp.glowPeak;
for(const e of knobLamps){ e.cap.opacity = e.capPeak*0.55; e.glow.opacity = e.glowPeak*0.5; }
for(const e of faderLamps){ e.cap.opacity = e.capPeak*0.4; e.glow.opacity = e.glowPeak*0.4; }

/* only two channels are open; the rest of the strip sits muted */
const liveChannels=[1,4];
let nextPad=0.8;
/* ------------------------------------------------------------------ */
/*  fit, orbit, run                                                     */
/* ------------------------------------------------------------------ */
function resize(){
  const W = Math.max(1, window.innerWidth), H = Math.max(1, window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H, false);

  const aspect = W / H;
  /* vertical field, in master pixels, that frames the artwork in either format */
  const marginX = (aspect < 1 ? 1.12 : 1.10), marginY = 1.46;
  const viewH = Math.max(ART_H * marginY, ART_W * marginX / aspect);
  const hh = 0.35355 * viewH;          /* 1 world unit along Y == 1.1547 master px */
  const hw = hh * aspect;
  /* lift the subject off dead centre, and slide it clear of the copy column */
  const biasY = (aspect < 1 ? 0.13 : 0.055);
  const biasX = Math.min(0.24, Math.max(0, (aspect - 1.00) * 0.34));
  camera.left = -hw * (1 - biasX); camera.right = hw * (1 + biasX);
  camera.top = hh * (1 - biasY); camera.bottom = -hh * (1 + biasY);
  camera.updateProjectionMatrix();

  lineUniforms.uRes.value.set(W * dpr, H * dpr);
  /* Hairline weight.  It tracks the drawing's scale, but clamped in CSS pixels so a
     big display doesn't turn the ink chunky and a phone doesn't lose it altogether. */
  const inkCss = Math.min(1.2, Math.max(0.75, 0.80 * H / viewH));
  lineUniforms.uW.value = Math.max(1.0, inkCss * dpr);
  fxRes.value.set(W * dpr, H * dpr);
}
window.addEventListener('resize', resize);

/* pointer drives the orbit; it eases back to the isometric rest pose */
function pointAt(e){
  orb.tx = (e.clientX / window.innerWidth) * 2 - 1;
  orb.ty = (e.clientY / window.innerHeight) * 2 - 1;
  orb.tOver = 1;
}
window.addEventListener('pointermove', pointAt, {passive:true});
window.addEventListener('pointerdown', pointAt, {passive:true});
window.addEventListener('pointerleave', ()=>{ orb.tOver = 0; });
window.addEventListener('blur', ()=>{ orb.tOver = 0; });
document.addEventListener('mouseleave', ()=>{ orb.tOver = 0; });

const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let t0 = performance.now(), prev = t0;

function frame(now){
  const t  = (now - t0) / 1000;
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;

  /* camera */
  const k = 1 - Math.pow(0.0016, dt);          /* frame-rate independent easing */
  orb.over += (orb.tOver - orb.over) * k;
  orb.x += (orb.tx * orb.over - orb.x) * k;
  orb.y += (orb.ty * orb.over - orb.y) * k;
  placeCamera(reduced ? 0 : t);

  lineUniforms.uTime.value  = reduced ? 6.4 : t;
  lineUniforms.uIntro.value = reduced ? 1 : Math.min(1, t / 2.1);
  screenMat.uniforms.uTime.value = reduced ? 0.75 : t;
  fxTime.value = reduced ? 0 : t;

  if(!reduced){
    /* the strip follows the take: the live faders ride the envelope, the muted
       ones stay dim, and the sign breathes so slowly it reads as steady */
    const level = voice(t*3.4);
    for(let i=0;i<faderLamps.length;i++){
      const e=faderLamps[i];
      const live = liveChannels.indexOf(i) >= 0;
      const v = live ? 0.30 + 0.70*level : 0.22 + 0.06*Math.sin(t*0.8 + i);
      e.cap.opacity = e.capPeak*v;
      e.glow.opacity = e.glowPeak*v;
    }
    for(let i=0;i<knobLamps.length;i++){
      const e=knobLamps[i];
      const v = 0.45 + 0.14*Math.sin(t*0.9 + i*1.7);
      e.cap.opacity = e.capPeak*v; e.glow.opacity = e.glowPeak*v;
    }

    /* a stinger pad gets tapped now and then */
    nextPad -= dt;
    if(nextPad <= 0){
      nextPad = 2.4 + rnd()*4.6;
      const e = padLamps[Math.floor(rnd()*padLamps.length)];
      e.on = 1; e.t = 0; e.hold = 0.12 + rnd()*0.3;
    }
    for(const e of padLamps){
      const idle = 0.13 + 0.05*Math.sin(t*0.7 + e.capPeak*9.0);
      if(e.on){
        e.t += dt;
        const fade=0.26;
        let v=1;
        if(e.t < 0.04) v = e.t/0.04;
        else if(e.t > e.hold) v = Math.max(0, 1-(e.t-e.hold)/fade);
        if(e.t > e.hold + fade) e.on = 0;
        e.cap.opacity = e.capPeak*Math.max(idle, v);
        e.glow.opacity = e.glowPeak*Math.max(idle, v);
      } else {
        e.cap.opacity = e.capPeak*idle; e.glow.opacity = e.glowPeak*idle;
      }
    }

    signGlow.glow.opacity = signGlow.glowPeak * (0.93 + 0.07*Math.sin(t*0.6));
    micLamp.glow.opacity = micLamp.glowPeak * (0.82 + 0.18*level);
  }

  renderer.autoClear = true;
  renderer.render(bgScene, fxCam);      /* graded ground */
  renderer.autoClear = false;
  renderer.render(scene, camera);       /* the machine */
  renderer.render(fxScene, fxCam);      /* grain */
  renderer.autoClear = true;

  requestAnimationFrame(frame);
}
resize();
requestAnimationFrame(frame);

})();
<\/script>
</body>
</html>
`,x=`<!DOCTYPE html>
<!--
  CATHODE / CINEMA — an isometric camera rig built entirely from three.js geometry.

  The tripod legs, the pan bar and the barrel of the lens are lofted along their own
  axes rather than the isometric grid, so the sticks carry the drawing's diagonals
  while the body, matte box and slate stay square to it. Every visible edge is a
  screen-space constant-width line, the monitor slung off the top plate runs a live framing feed,
  the panel light holds the key, and the camera orbits with the pointer around a true
  isometric rest pose.
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cathode — Keep Rolling Past Dark</title>
<meta name="description" content="An isometric cinema camera rig rendered live in three.js.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23090909'/%3E%3Ccircle cx='16' cy='16' r='10' fill='none' stroke='%23888' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='3.6' fill='none' stroke='%23888' stroke-width='2'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#0a0a0a;
    color:#f1f1f1;
    font-family:'Inter',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;
    -webkit-font-smoothing:antialiased;
    overflow:hidden;
    cursor:crosshair;
  }

  #gl{
    position:fixed; inset:0; width:100%; height:100%; display:block; z-index:0;
    opacity:0; animation:rise .9s ease .05s forwards;
  }
  @keyframes rise{ to{ opacity:1 } }
  @media (prefers-reduced-motion: reduce){ #gl{opacity:1; animation:none} }

  .ui{
    position:fixed; inset:0; z-index:1; pointer-events:none;
    padding:clamp(20px, 2.6vw, 44px) clamp(22px, 3.4vw, 60px);
    display:grid;
    grid-template-rows:auto 1fr auto;
    gap:clamp(16px, 2vw, 28px);
  }
  .ui a{ pointer-events:auto; cursor:pointer; text-decoration:none }
  .ui a:focus-visible{ outline:1px solid rgba(255,255,255,.45); outline-offset:4px; border-radius:999px }

  /* ---------- top bar ---------- */
  .bar{
    display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;
    gap:16px;
  }
  .logo{
    display:inline-flex; align-items:center; gap:.62em;
    color:#e9e9e9;
    font-size:clamp(10px, .82vw, 13px);
    font-weight:500; letter-spacing:.24em; text-transform:uppercase;
    justify-self:start;
    transition:color .18s ease;
  }
  .logo svg{ width:1.72em; height:1.72em; display:block; color:#c9c9c9; transition:color .18s ease }
  .logo:hover, .logo:hover svg{ color:#fff }

  .pill{
    justify-self:center;
    display:flex; align-items:center; gap:2px;
    padding:4px;
    border-radius:999px;
    background:rgba(255,255,255,.038);
    border:1px solid rgba(255,255,255,.075);
    backdrop-filter:blur(14px) saturate(120%);
    -webkit-backdrop-filter:blur(14px) saturate(120%);
  }
  .pill a{
    display:block;
    padding:.62em 1.15em;
    border-radius:999px;
    font-size:clamp(11px, .86vw, 13.5px);
    font-weight:500; letter-spacing:.005em;
    color:#8e8e8e; white-space:nowrap;
    transition:color .18s ease, background .18s ease;
  }
  .pill a:hover{ color:#ededed; background:rgba(255,255,255,.05) }
  .pill a.on{ color:#f2f2f2; background:rgba(255,255,255,.075) }

  .ghost{
    justify-self:end;
    display:inline-block;
    padding:.68em 1.35em;
    border-radius:999px;
    border:1px solid rgba(255,255,255,.14);
    font-size:clamp(11px, .86vw, 13.5px);
    font-weight:500;
    color:#dcdcdc;
    transition:color .18s ease, background .18s ease, border-color .18s ease;
  }
  .ghost:hover{ color:#fff; background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.28) }

  /* ---------- copy ---------- */
  .copy{ align-self:end; justify-self:end; text-align:right; max-width:min(46ch, 88vw) }
  .kicker{
    font-size:clamp(11px, .95vw, 14px);
    font-weight:500;
    letter-spacing:.10em;
    color:#727272;
  }
  .title{
    margin-top:clamp(10px, .9vw, 18px);
    font-size:clamp(30px, 4.35vw, 64px);
    font-weight:400;
    letter-spacing:-.016em;
    line-height:1.02;
    color:#f1f1f1;
  }
  .lede{
    margin-top:clamp(12px, 1.1vw, 22px);
    font-size:clamp(14px, 1.22vw, 19px);
    font-weight:400;
    line-height:1.58;
    color:#8d8d8d;
  }
  .cta{
    margin-top:clamp(18px, 1.7vw, 30px);
    display:inline-flex; align-items:center; gap:.7em;
    padding:.85em 1.5em;
    border-radius:999px;
    background:#efefef;
    color:#0b0b0b;
    font-size:clamp(13px, 1.02vw, 16px);
    font-weight:500; letter-spacing:-.004em;
    transition:background .18s ease, box-shadow .18s ease, transform .18s ease;
  }
  .cta svg{ width:.82em; height:.82em; display:block }
  .cta:hover{ background:#fff; box-shadow:0 0 0 6px rgba(255,255,255,.06) }
  .cta:active{ transform:translateY(1px) }

  /* ---------- footnote ---------- */
  .foot{
    align-self:end;
    display:flex; justify-content:flex-start;
    margin-top:clamp(14px, 1.6vw, 26px);
  }
  .hint{
    font-size:clamp(9px, .72vw, 11px);
    font-weight:500;
    letter-spacing:.22em;
    text-transform:uppercase;
    color:#4c4c4c;
  }
  .hint::before{
    content:""; display:inline-block;
    width:1.6em; height:1px; margin-right:.9em; vertical-align:middle;
    background:#3a3a3a;
  }
  .hint::after{ content:"Move to orbit" }
  @media (hover:none){ .hint::after{ content:"Drag to orbit" } }

  @media (max-width:880px){
    .pill{ display:none }
    .bar{ grid-template-columns:1fr auto }
  }
  @media (max-width:640px){
    .copy{max-width:100%}
    .ghost{ padding:.6em 1.1em }
  }
</style>
</head>
<body>
<canvas id="gl"></canvas>

<div class="ui">
  <header class="bar">
    <a class="logo" href="#">
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7.4" stroke="currentColor" stroke-width="1.35"/>
        <circle cx="11" cy="11" r="2.6" stroke="currentColor" stroke-width="1.35"/>
        <path d="M11 3.6 15.6 8M18.4 11 12 11" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
      </svg>
      <span>Cathode</span>
    </a>

    <nav class="pill" aria-label="Primary">
      <a class="on" href="#">Cameras</a>
      <a href="#">Optics</a>
      <a href="#">Support</a>
      <a href="#">Journal</a>
    </nav>

    <a class="ghost" href="#">Sign in</a>
  </header>

  <div class="copy">
    <div class="kicker">08 / 09</div>
    <h1 class="title">Keep Rolling Past&nbsp;Dark</h1>
    <p class="lede">Cinema bodies that hold their grade long after the light has gone.</p>
    <a class="cta" href="#">
      Configure a rig
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1.5 6h9M6.8 2.2 10.6 6l-3.8 3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>

  <div class="foot"><span class="hint"></span></div>
</div>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
(function(){
'use strict';

/* ------------------------------------------------------------------
   COORDINATE SYSTEM
   World units are pixels of the 1080x1080 master frame the model was
   measured in.  At the isometric rest pose:
     px = X - Z
     py = 0.5774*(X + Z) - 1.1547*Y
   The floor is Y = 0.
-------------------------------------------------------------------*/

/* projected bounds of the artwork, in master pixels */
const ART = { x0:254, x1:777, y0:214, y1:676 };
const ART_W = ART.x1 - ART.x0, ART_H = ART.y1 - ART.y0;
const ART_CX = (ART.x0 + ART.x1) / 2, ART_CY = (ART.y0 + ART.y1) / 2;

/* world point that sits at the middle of the artwork (solved at Y = 90) */
const TARGET = new THREE.Vector3(
  ((ART_CY + 1.1547*90) / 0.5774 + ART_CX) / 2, 90,
  ((ART_CY + 1.1547*90) / 0.5774 - ART_CX) / 2
);

/* isometric rest pose in spherical terms: direction (1,1,1)/sqrt(3) */
const BASE_THETA = Math.PI / 4;
const BASE_PHI   = Math.acos(1 / Math.sqrt(3));
const CAM_DIST   = 4200;

THREE.ColorManagement.enabled = false;

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.outputEncoding = THREE.LinearEncoding;

const scene  = new THREE.Scene();

/* The model was measured facing down-left.  Reflecting it through the plane
   X = Z + MIRROR_K mirrors the whole drawing about its own vertical axis:
   px = X-Z flips sign around MIRROR_K while py = 0.5774(X+Z) - 1.1547Y is
   untouched.  Everything is built into this root, so shader work stays in the
   original model space and mirrors for free. */
const MIRROR_K = 515.5;
const root = new THREE.Group();
root.matrixAutoUpdate = false;
root.matrix.set(0,0,1, MIRROR_K,
                0,1,0, 0,
                1,0,0,-MIRROR_K,
                0,0,0, 1);
scene.add(root);
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 12000);
camera.up.set(0, 1, 0);

/* orbit state */
const orb = { x:0, y:0, tx:0, ty:0, over:0, tOver:0 };
function placeCamera(t){
  const az = orb.x * 0.26 + Math.sin(t * 0.17) * 0.028;
  const el = -orb.y * 0.17 + Math.sin(t * 0.11 + 1.1) * 0.018;
  const th = BASE_THETA + az;
  const ph = Math.min(1.30, Math.max(0.34, BASE_PHI + el));
  const sp = Math.sin(ph);
  camera.position.set(
    TARGET.x + CAM_DIST * sp * Math.cos(th),
    TARGET.y + CAM_DIST * Math.cos(ph),
    TARGET.z + CAM_DIST * sp * Math.sin(th)
  );
  camera.lookAt(TARGET);
}

/* palette (sRGB byte values measured off the reference) */
const C_TOP   = 0x1b1b1b;   //  27  – faces pointing up
const C_FRONT = 0x1b1b1b;   //  27  – faces pointing +Z
const C_SIDE  = 0x121212;   //  18  – faces pointing +X
const C_DARK  = 0x121212;   //  18  – base / plinth material
const C_LINE  = 0x3a3a3a;   //  58  – drawn edges
const C_GRID  = 0x121212;

/* ------------------------------------------------------------------ */
/*  materials                                                          */
/* ------------------------------------------------------------------ */
function faceMaterial(top, front, side){
  return new THREE.ShaderMaterial({
    uniforms:{
      cTop:{value:new THREE.Color(top)},
      cFront:{value:new THREE.Color(front)},
      cSide:{value:new THREE.Color(side)}
    },
    vertexShader:\`
      varying vec3 vN;
      void main(){
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }\`,
    fragmentShader:\`
      uniform vec3 cTop, cFront, cSide;
      varying vec3 vN;
      void main(){
        vec3 n = normalize(vN);
        float ax = abs(n.x), ay = abs(n.y), az = abs(n.z);
        vec3 c = cTop;
        if (ay >= ax && ay >= az)      c = cTop;
        else if (az >= ax)             c = cFront;
        else                           c = cSide;
        gl_FragColor = vec4(c, 1.0);
      }\`,
    side:THREE.DoubleSide
  });
}
/* after the mirror the drawing's front turns to +X and its cheek to +Z,
   so the two wall values swap places */
const matLight = faceMaterial(C_TOP, C_SIDE, C_FRONT);
const matDark  = faceMaterial(C_DARK, C_DARK, C_DARK);

/* secondary props sit in a soft haze that fades them from 17 to 23.
   Written in world space so it stays welded to the props while the camera orbits. */
function hazeMaterial(sideMul){
 return new THREE.ShaderMaterial({
  uniforms:{ uSide:{value:sideMul} },
  vertexShader:\`
    varying vec3 vN; varying vec3 vW;
    void main(){
      vN = normalize(mat3(modelMatrix) * normal);
      vW = position;                       /* model space: mirrors with the root */
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }\`,
  fragmentShader:\`
    uniform float uSide;
    varying vec3 vN; varying vec3 vW;
    void main(){
      float f = clamp(0.016196*vW.x - 0.008591*vW.y - 0.007604*vW.z - 5.819, 0.0, 1.0);
      float v = mix(0.0666, 0.0902, f);
      vec3 n = normalize(vN);
      if (abs(n.y) < max(abs(n.x), abs(n.z))) v *= uSide;
      gl_FragColor = vec4(vec3(v), 1.0);
    }\`,
  side:THREE.DoubleSide
 });
}
const matBg   = hazeMaterial(0.80);   /* props: only the top catches the haze */
const matBgUp = hazeMaterial(1.00);   /* upright panel: its face is what we see */

/* ------------------------------------------------------------------ */
/*  screen-space constant-width lines                                  */
/* ------------------------------------------------------------------ */
const lineUniforms = {
  uRes:{value:new THREE.Vector2(1080,1080)},
  uW:{value:2.0},
  uTime:{value:0},
  uIntro:{value:0}
};
function lineMaterial(color, opacity, fade){
  return new THREE.ShaderMaterial({
    uniforms:Object.assign({
      uColor:{value:new THREE.Color(color)},
      uOpacity:{value:opacity===undefined?1:opacity},
      uFade:{value:new THREE.Vector2(fade?fade[0]:1e6, fade?fade[1]:1e6+1)},
      uFadeC:{value:new THREE.Vector2(fade?fade[2]:0, fade?fade[3]:0)}
    }, lineUniforms),
    transparent:true,
    depthWrite:false,
    side:THREE.DoubleSide,
    vertexShader:\`
      uniform vec2 uRes; uniform float uW;
      attribute vec3 aOther;
      attribute float aSide;
      attribute float aSeed;
      varying vec3 vW; varying float vSeed;
      void main(){
        vW = position; vSeed = aSeed;
        vec4 c0 = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        vec4 c1 = projectionMatrix * modelViewMatrix * vec4(aOther,1.0);
        vec2 n0 = c0.xy / c0.w;
        vec2 n1 = c1.xy / c1.w;
        vec2 d  = (n1 - n0) * uRes;
        float L = length(d);
        d = (L > 0.0001) ? d / L : vec2(1.0, 0.0);
        vec2 perp = vec2(-d.y, d.x);
        vec2 off = (perp * aSide * uW * 0.5 - d * uW * 0.5) / uRes * 2.0;
        c0.xy += off * c0.w;
        gl_Position = c0;
      }\`,
    fragmentShader:\`
      uniform vec3 uColor; uniform float uOpacity;
      uniform float uTime, uIntro; uniform vec2 uFade, uFadeC;
      varying vec3 vW; varying float vSeed;
      void main(){
        float a = uOpacity;

        /* the drawing assembles itself once, back to front */
        float depth = clamp((vW.x + vW.z - 380.0) / 760.0, 0.0, 1.0);
        a *= smoothstep(0.0, 0.30, uIntro * 1.34 - depth * 0.34);

        /* grid and other far strokes dissolve into the plate, measured on screen */
        vec2 pp = vec2(vW.x - vW.z, 0.5774 * (vW.x + vW.z) - 1.1547 * vW.y);
        float d = length((pp - uFadeC) * vec2(1.0, 1.5));
        a *= 1.0 - smoothstep(uFade.x, uFade.y, d);

        /* a scan plane rides up through the wireframe */
        float scanY = mod(uTime * 54.0, 330.0) - 52.0;
        float dy = vW.y - scanY;
        float pulse = exp(-dy * dy / 110.0) + 0.34 * exp(-dy * dy / 1150.0);

        /* a slower glint travelling along the plan diagonal */
        float w = sin((vW.x + vW.z) * 0.016 - uTime * 1.15);
        float glint = pow(max(w, 0.0), 14.0);

        /* per-stroke shimmer so nothing sits perfectly still */
        float sh = 0.94 + 0.06 * sin(uTime * 1.9 + vSeed * 41.0);

        vec3 col = uColor * sh + vec3(pulse * 0.36 + glint * 0.15);
        gl_FragColor = vec4(col, a);
      }\`
  });
}

/* nudge lines toward the camera along (1,1,1) — screen-neutral under iso */
const EPS = 0.55;

function makeLines(segs, color, opacity, fade){
  const n = segs.length / 6;
  const pos   = new Float32Array(n*4*3);
  const oth   = new Float32Array(n*4*3);
  const side  = new Float32Array(n*4);
  const seed  = new Float32Array(n*4);
  const index = new Uint32Array(n*6);
  for(let i=0;i<n;i++){
    const ax=segs[i*6]+EPS,   ay=segs[i*6+1]+EPS, az=segs[i*6+2]+EPS;
    const bx=segs[i*6+3]+EPS, by=segs[i*6+4]+EPS, bz=segs[i*6+5]+EPS;
    const v=i*4;
    // two verts at a (other = b), two verts at b (other = a)
    const P=[[ax,ay,az,bx,by,bz,-1],[ax,ay,az,bx,by,bz, 1],
             [bx,by,bz,ax,ay,az,-1],[bx,by,bz,ax,ay,az, 1]];
    for(let k=0;k<4;k++){
      pos[(v+k)*3]=P[k][0]; pos[(v+k)*3+1]=P[k][1]; pos[(v+k)*3+2]=P[k][2];
      oth[(v+k)*3]=P[k][3]; oth[(v+k)*3+1]=P[k][4]; oth[(v+k)*3+2]=P[k][5];
      side[v+k]=P[k][6];
      seed[v+k]=(Math.sin(i*12.9898)*43758.5453)%1;
    }
    index[i*6]=v; index[i*6+1]=v+1; index[i*6+2]=v+2;
    index[i*6+3]=v; index[i*6+4]=v+2; index[i*6+5]=v+3;
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aOther',   new THREE.BufferAttribute(oth,3));
  g.setAttribute('aSide',    new THREE.BufferAttribute(side,1));
  g.setAttribute('aSeed',    new THREE.BufferAttribute(seed,1));
  g.setIndex(new THREE.BufferAttribute(index,1));
  const m=new THREE.Mesh(g, lineMaterial(color===undefined?C_LINE:color, opacity, fade));
  m.frustumCulled=false;
  m.renderOrder=2;
  return m;
}

/* segment accumulator */
function Seg(){ this.a=[]; }
Seg.prototype.add=function(p,q){ this.a.push(p[0],p[1],p[2],q[0],q[1],q[2]); };
Seg.prototype.loop=function(pts){                       // pts: [[x,y,z],...]
  for(let i=0;i<pts.length;i++) this.add(pts[i], pts[(i+1)%pts.length]);
};
Seg.prototype.path=function(pts){
  for(let i=0;i<pts.length-1;i++) this.add(pts[i], pts[i+1]);
};

/* ------------------------------------------------------------------ */
/*  2D helpers                                                         */
/* ------------------------------------------------------------------ */
function rect(x0,y0,x1,y1){ return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]]; }

function roundRect(x0,y0,x1,y1,r,seg){
  seg = seg||5;
  r = Math.min(r, (x1-x0)/2, (y1-y0)/2);
  const p=[];
  const corners=[[x1-r,y0+r,-Math.PI/2,0],[x1-r,y1-r,0,Math.PI/2],
                 [x0+r,y1-r,Math.PI/2,Math.PI],[x0+r,y0+r,Math.PI,Math.PI*1.5]];
  for(const [cx,cy,a0,a1] of corners){
    for(let i=0;i<=seg;i++){
      const a=a0+(a1-a0)*i/seg;
      p.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]);
    }
  }
  return p;
}

/* map profile (a,b) + extrusion t to world, per axis */
const MAP = {
  z:(a,b,t)=>[a, b, t],          // profile = (X,Y), extrude along Z
  x:(a,b,t)=>[t, b, -a],         // profile = (-Z,Y), extrude along X
  y:(a,b,t)=>[a, t, -b]          // profile = (X,-Z), extrude along Y
};
const MATRIX = {
  z:new THREE.Matrix4(),
  x:new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0)),
  y:new THREE.Matrix4().makeBasis(new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0))
};

function toShape(pts){
  const s=new THREE.Shape();
  s.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++) s.lineTo(pts[i][0],pts[i][1]);
  s.closePath();
  return s;
}

/* build an extruded prism; returns the mesh */
function prism(pts, holes, t0, t1, axis, material){
  const shape=toShape(pts);
  if(holes) for(const h of holes){
    const p=new THREE.Path();
    p.moveTo(h[0][0],h[0][1]);
    for(let i=1;i<h.length;i++) p.lineTo(h[i][0],h[i][1]);
    p.closePath();
    shape.holes.push(p);
  }
  const g=new THREE.ExtrudeGeometry(shape,{depth:t1-t0, bevelEnabled:false, curveSegments:4});
  g.translate(0,0,t0);
  g.applyMatrix4(MATRIX[axis]);
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

/* loft a closed XY profile between two Z stations; flat-shaded, unindexed */
function loft(ptsA, zA, ptsB, zB, material){
  const n=ptsA.length, pos=[];
  const push=(x,y,z)=>{ pos.push(x,y,z); };
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    push(ptsA[i][0],ptsA[i][1],zA); push(ptsA[j][0],ptsA[j][1],zA); push(ptsB[j][0],ptsB[j][1],zB);
    push(ptsA[i][0],ptsA[i][1],zA); push(ptsB[j][0],ptsB[j][1],zB); push(ptsB[i][0],ptsB[i][1],zB);
  }
  [[ptsA,zA],[ptsB,zB]].forEach(function(cap){
    const pts=cap[0], z=cap[1];
    const tri=THREE.ShapeUtils.triangulateShape(pts.map(p=>new THREE.Vector2(p[0],p[1])), []);
    for(const t of tri){
      push(pts[t[0]][0],pts[t[0]][1],z);
      push(pts[t[1]][0],pts[t[1]][1],z);
      push(pts[t[2]][0],pts[t[2]][1],z);
    }
  });
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.computeVertexNormals();
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

function loopAt(seg, pts, t, axis){
  const f=MAP[axis];
  seg.loop(pts.map(p=>f(p[0],p[1],t)));
}
function railAt(seg, pts, idxs, t0, t1, axis){
  const f=MAP[axis];
  for(const i of idxs) seg.add(f(pts[i][0],pts[i][1],t0), f(pts[i][0],pts[i][1],t1));
}
/* ==================================================================
   GEOMETRY
   ================================================================== */
const S = new Seg();          // main edge set

/* ---------- profile and free-axis helpers ---------------------------- */
function circle(cx,cy,r,seg){
  const p=[];
  for(let i=0;i<seg;i++){ const a=i/seg*Math.PI*2; p.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]); }
  return p;
}

/* loft between two matched 3-D rings; flat shaded, unindexed */
function loft3(A,B,material){
  const pos=[], n=A.length;
  const push=p=>pos.push(p[0],p[1],p[2]);
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    push(A[i]); push(A[j]); push(B[j]);
    push(A[i]); push(B[j]); push(B[i]);
  }
  for(const cap of [A,B]) for(let i=1;i<n-1;i++){ push(cap[0]); push(cap[i]); push(cap[i+1]); }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.computeVertexNormals();
  const m=new THREE.Mesh(g, material||matLight);
  root.add(m);
  return m;
}

/* A straight member running p -> q with a regular section: seg 4 gives the sticks
   their square tubing, seg 20 the barrel of the lens.  Its own frame is carried
   along, so the legs and the pan bar never have to sit on the isometric grid. */
function member(p,q,r0,r1,seg,material,edges,opt){
  opt = opt || {};
  const d=new THREE.Vector3(q[0]-p[0],q[1]-p[1],q[2]-p[2]);
  const L=d.length();
  const up=(Math.abs(d.y) > L*0.94) ? new THREE.Vector3(1,0,0) : new THREE.Vector3(0,1,0);
  const u=new THREE.Vector3().crossVectors(up,d).normalize();
  const v=new THREE.Vector3().crossVectors(d,u).normalize();
  const phase=(opt.phase===undefined?0.5:opt.phase);
  function ring(t, rr){
    const r=(rr===undefined) ? r0+(r1-r0)*t : rr;
    const cx=p[0]+(q[0]-p[0])*t, cy=p[1]+(q[1]-p[1])*t, cz=p[2]+(q[2]-p[2])*t;
    const out=[];
    for(let i=0;i<seg;i++){
      const a=(i+phase)/seg*Math.PI*2, c=Math.cos(a)*r, s=Math.sin(a)*r;
      out.push([cx+u.x*c+v.x*s, cy+u.y*c+v.y*s, cz+u.z*c+v.z*s]);
    }
    return out;
  }
  const A=ring(0), B=ring(1);
  loft3(A,B,material);
  if(edges){
    if(!opt.openA) edges.loop(A);
    if(!opt.openB) edges.loop(B);
    /* A section with few sides shows every corner; a barrel shows only the two
       strokes where it turns away.  Those sit at the extremes measured across the
       member on screen — px = 1031 + z - x and py = 0.5774(x+z) - 1.1547y skew a
       tube far enough that picking extremes in x or z alone leaves it unbounded,
       and any rings drawn round it then read as loose arcs. */
    if(seg<=6){ for(let i=0;i<seg;i++) edges.add(A[i],B[i]); }
    else {
      const sxy=g=>[g[2]-g[0], 0.5774*(g[0]+g[2]) - 1.1547*g[1]];
      const s0=sxy(p), s1=sxy(q);
      let ax=s1[0]-s0[0], ay=s1[1]-s0[1];
      const al=Math.hypot(ax,ay)||1; ax/=al; ay/=al;
      let lo=0, hi=0, loV=Infinity, hiV=-Infinity;
      for(let i=0;i<seg;i++){
        const s=sxy(A[i]);
        const across=(s[0]-s0[0])*(-ay) + (s[1]-s0[1])*ax;
        if(across < loV){ loV=across; lo=i; }
        if(across > hiV){ hiV=across; hi=i; }
      }
      edges.add(A[lo],B[lo]); edges.add(A[hi],B[hi]);
    }
    if(opt.rings) for(const t of opt.rings) edges.loop(ring(t));
  }
  return ring;
}

/* ---------- panel light ---------------------------------------------- */
const D = new Seg();                              /* dim edge set */
const LP_X0=436, LP_X1=556, LP_Y0=48, LP_Y1=140, LP_Z0=146, LP_Z1=156;
const lampCase=roundRect(LP_X0,LP_Y0,LP_X1,LP_Y1,4,5);
prism(lampCase,null,LP_Z0,LP_Z1,'z',matBgUp);
loopAt(D,lampCase,LP_Z1,'z'); loopAt(D,lampCase,LP_Z0,'z');
railAt(D,lampCase,[0,6,12,18],LP_Z0,LP_Z1,'z');
/* barn doors, folded back along the two long edges */
loopAt(D,roundRect(LP_X0+5,LP_Y0+5,LP_X1-5,LP_Y1-5,3,4),LP_Z1+0.08,'z');
/* the emitter array, scored into the diffuser */
for(let r=0;r<5;r++) for(let c=0;c<7;c++){
  const x0=LP_X0+11+c*15.4, y0=LP_Y0+11+r*14.6;
  loopAt(D,roundRect(x0,y0,x0+11,y0+10,2,3),LP_Z1+0.12,'z');
}
/* stand: a column under the panel and three splayed feet */
member([496,0,151],[496,50,151], 6.0,5.0, 4, matBg, D, {});
[[556,0,166],[452,0,178],[480,0,116]].forEach(function(foot){
  member([496,30,151], foot, 4.4,2.6, 4, matBg, D, {});
});

/* ---------- tripod ---------------------------------------------------- */
const APEX=[700,118,202];
/* The legs are turned 30 degrees off the isometric grid.  Square to it, the third
   one runs straight down the view axis and collapses to a stub behind the body. */
[[786,0,254],[612,0,251],[780,0,138]].forEach(function(foot){
  member([APEX[0],APEX[1]-6,APEX[2]], foot, 9.6,5.4, 4, matLight, S, {});
  member([foot[0],0,foot[2]],[foot[0],5,foot[2]], 7.5,7.5, 12, matDark, S, {});
});
/* bowl, levelling collar and the pan bar reaching back to the operator */
member([700,104,202],[700,124,202], 15,17, 16, matLight, S, {rings:[0.55]});
member([692,110,192],[650,92,140], 3.6,4.6, 4, matLight, S, {});

/* ---------- camera body ------------------------------------------------ */
const BD_X0=650, BD_X1=756, BD_Y0=124, BD_Y1=180, BD_Z0=168, BD_Z1=238;
const bodySide=roundRect(BD_X0,BD_Y0,BD_X1,BD_Y1,7,7);
prism(bodySide,null,BD_Z0,BD_Z1,'z',matLight);
loopAt(S,bodySide,BD_Z1,'z'); loopAt(S,bodySide,BD_Z0,'z');
railAt(S,bodySide,[0,8,16,24],BD_Z0,BD_Z1,'z');
/* cooling louvres across the crown, clear of the handle posts */
for(let i=0;i<4;i++){
  const z0=BD_Z0+38+i*9.5;
  loopAt(S,roundRect(BD_X0+14,-(z0+6),BD_X1-14,-z0,2.4,4),BD_Y1+0.06,'y');
}
/* media door and a shoulder seam */
loopAt(S,roundRect(BD_X0+12,BD_Y0+9,BD_X1-12,BD_Y1-9,5,5),BD_Z1+0.1,'z');
loopAt(S,roundRect(BD_X0+4,BD_Y0+4,BD_X1-4,BD_Y1-4,6,6),BD_Z0-0.1,'z');

/* top handle, on two posts, with a cheese plate of tie-down holes */
[[664,678],[728,742]].forEach(function(xx){
  const post=roundRect(xx[0],-200,xx[1],-186,2.5,4);
  prism(post,null,BD_Y1,206,'y',matLight);
  loopAt(S,post,206,'y'); loopAt(S,post,BD_Y1+0.05,'y');
  railAt(S,post,[0,5,10,15],BD_Y1,206,'y');
});
const handle=roundRect(658,-204,748,-182,5,5);
prism(handle,null,206,215,'y',matLight);
loopAt(S,handle,215,'y'); loopAt(S,handle,206,'y');
railAt(S,handle,[0,6,12,18],206,215,'y');
for(let i=0;i<6;i++) loopAt(S,circle(668+i*14,-193,3.2,10),215.05,'y');

/* ---------- lens, matte box and follow focus --------------------------- */
member([703,150,236],[703,150,311], 27,23, 20, matLight, S, {openA:true, rings:[0.18,0.33,0.47,0.60]});
member([703,150,311],[703,150,314], 22.4,19, 20, matDark, S, {});
const MB_X0=662, MB_X1=744, MB_Y0=110, MB_Y1=190;
const matte=roundRect(MB_X0,MB_Y0,MB_X1,MB_Y1,5,6);
prism(matte,[circle(703,150,25,18).slice().reverse()],288,314,'z',matLight);
loopAt(S,matte,314,'z'); loopAt(S,matte,288,'z');
railAt(S,matte,[0,7,14,21],288,314,'z');
loopAt(S,circle(703,150,25,18),314.1,'z');
/* the top flag, shading the front element */
const flag=roundRect(MB_X0+2,-326,MB_X1-2,-300,3,4);
prism(flag,null,190,195,'y',matLight);
loopAt(S,flag,195,'y'); loopAt(S,flag,190,'y');
railAt(S,flag,[0,5,10,15],190,195,'y');
/* follow focus, geared onto the barrel */
member([728,150,266],[744,150,266], 14,12, 16, matLight, S, {rings:[0.5]});

/* ---------- monitor, slung off the top plate ---------------------------- */
/* Anything run between the cheek and the panel is hidden behind the panel from
   this corner, so the mount comes over the top where it can actually be seen. */
const MN_Z0=180, MN_Z1=248, MN_Y0=127, MN_Y1=175, MN_X0=782, MN_X1=790;
const monitor=roundRect(-MN_Z1,MN_Y0,-MN_Z0,MN_Y1,5,6);
prism(monitor,null,MN_X0,MN_X1,'x',matLight);
loopAt(S,monitor,MN_X1,'x'); loopAt(S,monitor,MN_X0,'x');
railAt(S,monitor,[0,7,14,21],MN_X0,MN_X1,'x');
member([706,214,192],[758,205,187], 4.8,4.4, 4, matLight, S, {});
member([756,207,187],[762,202,187], 7.2,7.2, 10, matLight, S, {});
member([760,204,187],[786,181,184], 4.4,4.0, 4, matLight, S, {});
/* a 16:9 panel inside its bezel, with the three menu keys under it */
const SC_Z0=186, SC_Z1=244, SC_Y0=136, SC_Y1=169;
loopAt(S,roundRect(-(SC_Z1+3.5),SC_Y0-3.5,-(SC_Z0-3.5),SC_Y1+3.5,3,5),MN_X1+0.1,'x');
loopAt(S,roundRect(-SC_Z1,SC_Y0,-SC_Z0,SC_Y1,2,4),MN_X1+0.14,'x');
for(let i=0;i<3;i++) loopAt(S,circle(-(SC_Z0+9+i*14),MN_Y0+4.6,2.6,10),MN_X1+0.1,'x');

/* ---------- slate ------------------------------------------------------- */
const SL_X0=628, SL_X1=772, SL_Z0=294, SL_Z1=402, SL_H=7;   /* 144 x 108 — a 4:3 board */
const board=roundRect(SL_X0,-SL_Z1,SL_X1,-SL_Z0,4,6);
prism(board,null,0,SL_H,'y',matLight);
loopAt(S,board,SL_H,'y'); loopAt(S,board,0,'y');
railAt(S,board,[0,7,14,21],0,SL_H,'y');
/* production fields, ruled across the face */
const SL_GAP=(SL_Z1-SL_Z0-16)/4;
for(let i=1;i<4;i++) S.add([SL_X0+7,SL_H+0.04,SL_Z0+8+i*SL_GAP],[SL_X1-7,SL_H+0.04,SL_Z0+8+i*SL_GAP]);
S.add([SL_X0+54,SL_H+0.04,SL_Z0+8],[SL_X0+54,SL_H+0.04,SL_Z1-6]);
S.add([SL_X0+98,SL_H+0.04,SL_Z0+8],[SL_X0+98,SL_H+0.04,SL_Z1-6]);
/* the clapper stick, hinged along the back edge and struck with its stripes */
const stick=roundRect(SL_X0,-SL_Z0,SL_X1,-(SL_Z0-15),3,5);
prism(stick,null,SL_H,SL_H+7,'y',matLight);
loopAt(S,stick,SL_H+7,'y'); loopAt(S,stick,SL_H,'y');
railAt(S,stick,[0,6,12,18],SL_H,SL_H+7,'y');
for(let i=0;i<7;i++){
  const x0=SL_X0+6+i*18.5;
  loopAt(S,[[x0,-SL_Z0],[x0+9,-SL_Z0],[x0+17,-(SL_Z0-14)],[x0+8,-(SL_Z0-14)]],SL_H+7.05,'y');
}

/* ---------- two film cans, stacked out of the way ---------------------- */
member([528,0,272],[528,9,272], 24,24, 22, matBg, D, {});
loopAt(D,circle(528,-272,16,18),9.05,'y');
member([536,9,266],[536,17,266], 24,24, 22, matBg, D, {});
loopAt(D,circle(536,-266,16,18),17.05,'y');
loopAt(D,circle(536,-266,7,14),17.09,'y');

/* ---------- the framing feed ------------------------------------------- */
const screenGeo=new THREE.PlaneGeometry(SC_Z1-SC_Z0, SC_Y1-SC_Y0).rotateY(Math.PI/2);
const screenMat=new THREE.ShaderMaterial({
  side:THREE.DoubleSide,
  uniforms:{
    uTime:{value:0},
    uSize:{value:new THREE.Vector2(SC_Z1-SC_Z0, SC_Y1-SC_Y0)}
  },
  vertexShader:\`
    varying vec2 vUv;
    void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    precision highp float;
    uniform float uTime;
    uniform vec2 uSize;
    varying vec2 vUv;

    float box(vec2 p, vec2 c, vec2 h){ vec2 d=abs(p-c)-h; return max(d.x,d.y); }
    float fill(vec2 p, vec2 c, vec2 h){ return 1.0 - smoothstep(0.0, 0.9, box(p,c,h)); }
    float frame(vec2 p, vec2 c, vec2 h, float w){
      float d=box(p,c,h);
      return (1.0 - smoothstep(0.0, 0.8, abs(d))) * step(0.0, w);
    }

    void main(){
      vec2 p = vec2((1.0-vUv.x)*uSize.x, (1.0-vUv.y)*uSize.y);   /* mirrored quad: x from the left, y from the top */
      float t = uTime;
      float c = 0.0500;

      /* the take: a lit backdrop falling off toward the corners */
      vec2 q = (p / uSize) - vec2(0.46, 0.44);
      c += 0.085 * exp(-dot(q,q) * 5.2);

      /* horizon and the floor under it */
      float HZ = uSize.y * 0.63;
      c = mix(c, 0.052, smoothstep(HZ-0.7, HZ+0.7, p.y));
      c = mix(c, 0.20, 1.0 - smoothstep(0.4, 1.3, abs(p.y - HZ)));

      /* the subject, drifting a little as the operator holds the frame */
      float sx = uSize.x*0.40 + sin(t*0.31)*2.6;
      float sy = HZ - 9.0 + sin(t*0.47)*0.9;
      c = mix(c, 0.62, fill(p, vec2(sx, sy), vec2(3.4, 8.6)));       /* torso */
      c = mix(c, 0.74, fill(p, vec2(sx, sy-11.5), vec2(2.5, 2.6)));  /* head  */
      c = mix(c, 0.30, fill(p, vec2(sx, HZ+1.2), vec2(5.4, 0.9)));   /* the shadow it casts */

      /* framing chart: thirds, then the centre cross */
      for(int i=1;i<3;i++){
        float fi=float(i)/3.0;
        c = mix(c, 0.13, fill(p, vec2(uSize.x*fi, uSize.y*0.5), vec2(0.28, uSize.y*0.42)));
        c = mix(c, 0.13, fill(p, vec2(uSize.x*0.5, uSize.y*fi), vec2(uSize.x*0.42, 0.28)));
      }
      c = mix(c, 0.40, fill(p, vec2(uSize.x*0.5, uSize.y*0.5), vec2(2.6, 0.32)));
      c = mix(c, 0.40, fill(p, vec2(uSize.x*0.5, uSize.y*0.5), vec2(0.32, 2.6)));
      c = mix(c, 0.20, frame(p, uSize*0.5, uSize*0.40, 1.0));        /* safe action */

      /* the record tally, and a timecode that keeps running */
      float rec = step(0.5, fract(t*0.85));
      c = mix(c, mix(0.14, 0.92, rec), fill(p, vec2(5.6, 4.6), vec2(1.7, 1.7)));
      c = mix(c, 0.34, fill(p, vec2(12.5, 4.6), vec2(3.4, 1.3)));
      for(int i=0;i<6;i++){
        float fi=float(i);
        float on = step(0.35, fract(t*(0.9 + fi*2.3)));
        c = mix(c, mix(0.13, 0.44, on),
                fill(p, vec2(uSize.x-27.0 + fi*4.6, uSize.y-4.4), vec2(1.5, 1.9)));
      }
      /* exposure ladder down the right edge */
      for(int k=0;k<7;k++){
        float fk=float(k);
        float on = step(fk/7.0, 0.46 + 0.22*sin(t*0.9));
        c = mix(c, mix(0.11, 0.40, on), fill(p, vec2(uSize.x-3.6, 9.0 + fk*3.2), vec2(1.3, 1.1)));
      }

      /* monitor static and a slow phosphor breathe */
      float g = fract(sin(dot(p * 3.7 + vec2(t*61.0, t*37.0), vec2(12.9898, 78.233))) * 43758.5453);
      c += (g - 0.42) * 0.024;
      c *= 0.985 + 0.015 * sin(p.y * 2.1 + t * 3.3);

      gl_FragColor = vec4(vec3(max(c, 0.0)), 1.0);
    }\`
});
const screen=new THREE.Mesh(screenGeo, screenMat);
screen.position.set(MN_X1+0.05, (SC_Y0+SC_Y1)/2, (SC_Z0+SC_Z1)/2);
root.add(screen);

root.add(makeLines(S.a, C_LINE, 1.0));
root.add(makeLines(D.a, 0x1e1e1e, 1.0));

/* ---------- technical floor grid ------------------------------------ */
(function(){
  const G=new Seg();
  const DASH=6.5, GAP=5.0;
  function dashed(ax,ay,az,bx,by,bz){
    const dx=bx-ax, dz=bz-az;
    const L=Math.hypot(dx,dz);
    let t=0;
    while(t<L){
      const t2=Math.min(t+DASH,L);
      G.add([ax+dx*t/L, ay, az+dz*t/L],[ax+dx*t2/L, ay, az+dz*t2/L]);
      t=t2+GAP;
    }
  }
  const XL=[761,793.5,826,858.5,891,923.5,956,988.5];
  const ZL=[56,95,134,173,212,251,290,329,368,407];
  for(const x of XL) dashed(x,-1.1,40, x,-1.1,430);
  for(const z of ZL) dashed(700,-1.1,z, 1060,-1.1,z);
  dashed(640,-1.1,290, 780,-1.1,290);
  dashed(620,-1.1,251, 760,-1.1,251);
  root.add(makeLines(G.a, C_GRID, 1.0, [130, 265, 570, 600]));

  const T=new Seg();
  const marks=[[891,173],[891,212],[891,251],[891,329],[923.5,251],[923.5,329],
               [858.5,290],[956,212],[826,329],[793.5,251],[891,368],[956,290]];
  for(const m of marks){
    const x=m[0], z=m[1];
    T.add([x-3.4,-1.0,z-3.4],[x+3.4,-1.0,z+3.4]);
    T.add([x-3.4,-1.0,z+3.4],[x+3.4,-1.0,z-3.4]);
  }
  T.add([556,-1.0,250],[556,-1.0,236]);
  T.add([560,-1.0,184],[575,-1.0,184]);
  root.add(makeLines(T.a, 0x242424, 1.0, [140, 275, 570, 600]));
})();

/* ------------------------------------------------------------------ */
/*  lit controls + glow                                                */
/* ------------------------------------------------------------------ */
function radialTexture(size, power){
  const c=document.createElement('canvas'); c.width=c.height=size;
  const g=c.getContext('2d');
  const img=g.createImageData(size,size);
  const h=size/2;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const d=Math.min(1, Math.hypot(x-h+0.5,y-h+0.5)/h);
    const v=Math.pow(1-d, power);
    const i=(y*size+x)*4;
    img.data[i]=img.data[i+1]=img.data[i+2]=255;
    img.data[i+3]=Math.round(v*255);
  }
  g.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);
  t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter;
  return t;
}
const glowTex=radialTexture(128,2.6);

/* one flat cap + one additive glow per lamp; the rig needs all three headings */
const quadGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);   /* faces +Y */
const discGeo=new THREE.CircleGeometry(0.5,22).rotateX(-Math.PI/2);
const faceGeo=new THREE.PlaneGeometry(1,1);                       /* faces +Z */
const sideGeo=new THREE.PlaneGeometry(1,1).rotateY(Math.PI/2);    /* faces +X */

function emitter(o){
  const axis=o.axis||'y';
  const flat=(axis==='y') ? (o.round?discGeo:quadGeo) : (axis==='z'?faceGeo:sideGeo);
  const spreadGeo=(axis==='y') ? quadGeo : (axis==='z'?faceGeo:sideGeo);
  const put=function(mesh,w,d){
    if(axis==='y') mesh.scale.set(w,1,d);
    else if(axis==='z') mesh.scale.set(w,d,1);
    else mesh.scale.set(1,d,w);
  };
  const off=(axis==='y') ? [0,0.05,0] : (axis==='z' ? [0,0,0.06] : [0.06,0,0]);

  const capMat=new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0, depthWrite:false, side:THREE.DoubleSide});
  const cap=new THREE.Mesh(flat, capMat);
  put(cap, o.w, o.d);
  cap.position.set(o.x,o.y,o.z);
  cap.renderOrder=3;
  root.add(cap);

  const glowMat=new THREE.MeshBasicMaterial({
    map:glowTex, transparent:true, opacity:0, depthWrite:false,
    blending:THREE.AdditiveBlending, depthTest:false, side:THREE.DoubleSide
  });
  const glow=new THREE.Mesh(spreadGeo, glowMat);
  const g=Math.max(o.w,o.d)*(o.spread||3.4);
  put(glow, g, g);
  glow.position.set(o.x+off[0], o.y+off[1], o.z+off[2]);
  glow.renderOrder=4;
  root.add(glow);

  return {cap:capMat, glow:glowMat,
          capPeak:o.capPeak===undefined?0.74:o.capPeak,
          glowPeak:o.glowPeak===undefined?0.16:o.glowPeak,
          on:0, hold:0, t:0};
}

const keyLight  = emitter({x:(LP_X0+LP_X1)/2, y:(LP_Y0+LP_Y1)/2, z:LP_Z1+0.18, axis:'z',
                           w:LP_X1-LP_X0-12, d:LP_Y1-LP_Y0-12,
                           capPeak:0.055, glowPeak:0.30, spread:1.9});
const monitorGlow = emitter({x:MN_X1+0.26, y:(SC_Y0+SC_Y1)/2, z:(SC_Z0+SC_Z1)/2, axis:'x',
                             w:SC_Z1-SC_Z0, d:SC_Y1-SC_Y0,
                             capPeak:0.0, glowPeak:0.17, spread:2.2});
const recLamp   = emitter({x:742, y:BD_Y1+0.11, z:176, w:3.6, d:3.6, round:true, capPeak:0.88, glowPeak:0.22, spread:6});
const slateLamp = emitter({x:SL_X0+108, y:SL_H+0.11, z:SL_Z1-16, w:36, d:11, capPeak:0.42, glowPeak:0.11, spread:3.0});
const focusLamp = emitter({x:SL_X0+30, y:SL_H+0.11, z:SL_Z1-16, w:10, d:10, round:true, capPeak:0.34, glowPeak:0.09, spread:4.0});
/* ------------------------------------------------------------------ */
/*  full-frame plate: graded ground behind, film grain in front         */
/* ------------------------------------------------------------------ */
const fxCam   = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
const fxQuad  = new THREE.PlaneGeometry(2,2);
const fxRes   = {value:new THREE.Vector2(1,1)};
const fxTime  = {value:0};

const bgScene = new THREE.Scene();
bgScene.add(new THREE.Mesh(fxQuad, new THREE.ShaderMaterial({
  uniforms:{ uRes:fxRes, uTime:fxTime },
  depthTest:false, depthWrite:false,
  vertexShader:\`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }\`,
  fragmentShader:\`
    uniform vec2 uRes; uniform float uTime;
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 q = uv - vec2(0.5, 0.56);
      q.x *= uRes.x / uRes.y;
      float r = length(q);
      float v = mix(0.0664, 0.0225, smoothstep(0.04, 0.92, r));
      v += 0.0055 * sin(uv.x * 3.1 + uTime * 0.13) * cos(uv.y * 2.3 - uTime * 0.09);
      vec3 dq = fract(vec3(gl_FragCoord.xyx) * 0.1031);
      dq += dot(dq, dq.yzx + 33.33);
      v += (fract((dq.x + dq.y) * dq.z) - 0.5) / 255.0;   /* dither out the banding */
      gl_FragColor = vec4(vec3(v), 1.0);
    }\`
})));

const fxScene = new THREE.Scene();
fxScene.add(new THREE.Mesh(fxQuad, new THREE.ShaderMaterial({
  uniforms:{ uRes:fxRes, uTime:fxTime },
  transparent:true, depthTest:false, depthWrite:false,
  blending:THREE.AdditiveBlending,
  vertexShader:\`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }\`,
  fragmentShader:\`
    uniform vec2 uRes; uniform float uTime;
    float hash(vec2 p){                       /* stable for large fragment coords */
      vec3 q = fract(vec3(p.xyx) * 0.1031);
      q += dot(q, q.yzx + 33.33);
      return fract((q.x + q.y) * q.z);
    }
    void main(){
      vec2 fc = gl_FragCoord.xy;
      float t = floor(uTime * 24.0);
      float n = hash(mod(fc + t * vec2(37.0, 61.0), 917.0)) * 0.72
              + hash(mod(fc * 0.5 + t * vec2(19.0, 7.0) + 11.0, 613.0)) * 0.28;
      n = pow(n, 2.3);
      /* a very faint interference band drifting down the frame */
      float band = 0.0035 * pow(max(sin(fc.y * 0.0035 - uTime * 0.7), 0.0), 8.0);
      gl_FragColor = vec4(vec3(n * 0.056 + band), 1.0);
    }\`
})));

/* ------------------------------------------------------------------ */
/*  animation state                                                    */
/* ------------------------------------------------------------------ */
let seed=1337;
function rnd(){ seed=(seed*1664525+1013904223)&0x7fffffff; return seed/0x7fffffff; }

/* the panel holds the key, so it is set once and left alone */
keyLight.cap.opacity = keyLight.capPeak;
keyLight.glow.opacity = keyLight.glowPeak;
monitorGlow.glow.opacity = monitorGlow.glowPeak;
slateLamp.cap.opacity = slateLamp.capPeak * 0.7;
slateLamp.glow.opacity = slateLamp.glowPeak * 0.7;
focusLamp.cap.opacity = focusLamp.capPeak * 0.6;
focusLamp.glow.opacity = focusLamp.glowPeak * 0.6;

/* takes run, then the tally drops out while the slate is reset */
let rolling = 1;
let untilCut = 6.4;
/* ------------------------------------------------------------------ */
/*  fit, orbit, run                                                     */
/* ------------------------------------------------------------------ */
function resize(){
  const W = Math.max(1, window.innerWidth), H = Math.max(1, window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H, false);

  const aspect = W / H;
  /* vertical field, in master pixels, that frames the artwork in either format */
  const marginX = (aspect < 1 ? 1.12 : 1.10), marginY = 1.46;
  const viewH = Math.max(ART_H * marginY, ART_W * marginX / aspect);
  const hh = 0.35355 * viewH;          /* 1 world unit along Y == 1.1547 master px */
  const hw = hh * aspect;
  /* lift the subject off dead centre, and slide it clear of the copy column */
  const biasY = (aspect < 1 ? 0.13 : 0.055);
  const biasX = Math.min(0.24, Math.max(0, (aspect - 1.00) * 0.34));
  camera.left = -hw * (1 - biasX); camera.right = hw * (1 + biasX);
  camera.top = hh * (1 - biasY); camera.bottom = -hh * (1 + biasY);
  camera.updateProjectionMatrix();

  lineUniforms.uRes.value.set(W * dpr, H * dpr);
  /* Hairline weight.  It tracks the drawing's scale, but clamped in CSS pixels so a
     big display doesn't turn the ink chunky and a phone doesn't lose it altogether. */
  const inkCss = Math.min(1.2, Math.max(0.75, 0.80 * H / viewH));
  lineUniforms.uW.value = Math.max(1.0, inkCss * dpr);
  fxRes.value.set(W * dpr, H * dpr);
}
window.addEventListener('resize', resize);

/* pointer drives the orbit; it eases back to the isometric rest pose */
function pointAt(e){
  orb.tx = (e.clientX / window.innerWidth) * 2 - 1;
  orb.ty = (e.clientY / window.innerHeight) * 2 - 1;
  orb.tOver = 1;
}
window.addEventListener('pointermove', pointAt, {passive:true});
window.addEventListener('pointerdown', pointAt, {passive:true});
window.addEventListener('pointerleave', ()=>{ orb.tOver = 0; });
window.addEventListener('blur', ()=>{ orb.tOver = 0; });
document.addEventListener('mouseleave', ()=>{ orb.tOver = 0; });

const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let t0 = performance.now(), prev = t0;

function frame(now){
  const t  = (now - t0) / 1000;
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;

  /* camera */
  const k = 1 - Math.pow(0.0016, dt);          /* frame-rate independent easing */
  orb.over += (orb.tOver - orb.over) * k;
  orb.x += (orb.tx * orb.over - orb.x) * k;
  orb.y += (orb.ty * orb.over - orb.y) * k;
  placeCamera(reduced ? 0 : t);

  lineUniforms.uTime.value  = reduced ? 6.4 : t;
  lineUniforms.uIntro.value = reduced ? 1 : Math.min(1, t / 2.1);
  screenMat.uniforms.uTime.value = reduced ? 0.75 : t;
  fxTime.value = reduced ? 0 : t;

  if(!reduced){
    /* the tally pulses through a take and goes out between them; the slate's
       timecode strip only counts while the camera is actually rolling */
    untilCut -= dt;
    if(untilCut <= 0){
      rolling = rolling ? 0 : 1;
      untilCut = rolling ? (5.5 + rnd()*5.0) : (1.6 + rnd()*1.8);
    }
    const beat = 0.5 + 0.5*Math.sin(t*2.7);
    recLamp.cap.opacity = rolling ? recLamp.capPeak * (0.55 + 0.45*beat) : 0;
    recLamp.glow.opacity = rolling ? recLamp.glowPeak * (0.45 + 0.55*beat) : 0;

    const run = rolling ? 1 : 0.34;
    slateLamp.cap.opacity = slateLamp.capPeak * run * (0.88 + 0.12*Math.sin(t*5.1));
    slateLamp.glow.opacity = slateLamp.glowPeak * run;
    focusLamp.cap.opacity = focusLamp.capPeak * (0.5 + 0.16*Math.sin(t*0.8));
    focusLamp.glow.opacity = focusLamp.glowPeak * (0.5 + 0.5*run);

    /* the panel breathes only enough to stop it reading as a printed shape */
    keyLight.glow.opacity = keyLight.glowPeak * (0.94 + 0.06*Math.sin(t*0.43));
    monitorGlow.glow.opacity = monitorGlow.glowPeak * (0.90 + 0.10*Math.sin(t*1.1));
  }

  renderer.autoClear = true;
  renderer.render(bgScene, fxCam);      /* graded ground */
  renderer.autoClear = false;
  renderer.render(scene, camera);       /* the machine */
  renderer.render(fxScene, fxCam);      /* grain */
  renderer.autoClear = true;

  requestAnimationFrame(frame);
}
resize();
requestAnimationFrame(frame);

})();
<\/script>
</body>
</html>
`,v=["workstation","console","studio","cinema"],w={console:u,studio:g,cinema:x},y={workstation:"Cathode — Built for the Long Session",console:"Cathode — Made for the Late Rounds",studio:"Cathode — Every Word, Kept Warm",cinema:"Cathode — Keep Rolling Past Dark"};function b({variant:e="workstation",presentation:t="background",...a}){const n=v.includes(e)?e:"workstation",[i,r]=l(a),s=d(h,i),c=o.useMemo(()=>{if(n!=="workstation")return f(w[n],{presentation:t,canvasSelector:"#gl"})},[t,n]);return o.createElement(m,{...r,key:n,backgroundCanvasSelector:t==="background"?"#gl":void 0,customization:s,title:y[n],sourceUrl:"/landing-pages/cathode.html",srcDoc:c})}function T(e){return p.jsx(b,{...e,presentation:"page"})}export{v as CATHODE_HERO_VARIANTS,b as CathodeHero,T as CathodePage};
