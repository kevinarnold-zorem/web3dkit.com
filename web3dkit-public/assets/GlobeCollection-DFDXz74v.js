const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EnergyOrb-BbuGibHR.js","assets/index-ChUl42DD.js","assets/index-x9bNS8sK.css"])))=>i.map(i=>d[i]);
import{j as e,r as t,_ as k}from"./index-ChUl42DD.js";const T=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Network Globe</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{height:100%;}
  body{
    overflow:hidden;
    background:
      radial-gradient(34vmax at 5% 112%, rgba(110,215,235,.4) 0%, transparent 100%),
      radial-gradient(34vmax at 95% 112%, rgba(168,140,250,.4) 0%, transparent 100%),
      linear-gradient(#272727 0%, #272727 48%, #2A2C44 60%, #383E74 74%, #4A4C9A 87%, #6B62C2 100%);
  }
  canvas{display:block;cursor:grab;touch-action:none;}
  canvas.dragging{cursor:grabbing;}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
'use strict';
/* =========================================================
   NETWORK GLOBE
   a dotted-continent world on a dusk gradient, slowly spinning,
   with gradient flight-path arcs leaping between land dots.
   Arcs that cross each other burst into small sparks.
   Drag to spin (inertia); hover highlights the nearest node;
   click a node to launch an arc from it.
   ========================================================= */

const params = new URLSearchParams(location.search);
const SEED  = parseInt(params.get('seed') || '7', 10);
const FREEZE_T = params.get('t') !== null ? parseFloat(params.get('t')) : null;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- rng ---------- */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEED);
const arcRng = mulberry32(SEED * 71 + 13);

const TAU = Math.PI * 2;
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const lerp = (a,b,t)=>a+(b-a)*t;
const easeInOut = t=>t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;

/* ---------- canvas ---------- */
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const DPR = clampDPR();
function clampDPR(){
  const o = parseFloat(new URLSearchParams(location.search).get('dpr') || '0');
  return o > 0 ? o : Math.min(window.devicePixelRatio || 1, 2);
}
let W = 0, H = 0, CX = 0, CY = 0, R = 0, FOV = 0;
function resize(){
  W = innerWidth; H = innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  CX = W / 2;
  CY = H * .47;
  R = Math.min(W, H) * .37;
  FOV = R * 3.4;
}
resize();
addEventListener('resize', ()=>{
  resize();
  if(FREEZE_T !== null || REDUCED) draw();
});

/* ---------- palette: purple & cyan ---------- */
const ARC_PURPLE = '#8A4DFF';
const ARC_CYAN = '#29D8E6';
const OCEAN_TONE = '#7FA8E0';

/* ---------- mesh: dots sampled on the continents ----------
   144x72 equirectangular land mask (1 bit per cell), baked from
   NASA's Blue Marble. Nodes are sampled on land only, so the dot
   cloud reads as the world's continents. */
const LAND_W = 144, LAND_H = 72;
const LAND_HEX = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003fe03f800000000000000000f003c8030007fffffffe0000000000000003e0000003f001ffffffffc80000000003803ff80f80004001fffff9ffff80000000030fffff10e0000000fffe03ffbfc0000000fffffffff8600e0000fffc1ff7ffc01f00fffffffffffff8ffc0003ffc3effffffffc3ffffffffffffffffe00787fc7e7fffffffeffffffffffffffffff80380f83fffffffffe43fffffffffffffff7c0000700f07ffffffe003b5fffffffffffefc4000007e07ffff078001c07fffffffffff38600000fe3ffffc010000c1fffffffffffffcf00003fffffff000000043ffffffffffffffd00003ffffffe000000002ffffffffffffffc000073fffffc0000000007fffffffffffff800000ffffffc0000000033ffffffff70ffff000005fffffc0000000010fffffffefffe9f000000fffffc0000000018fffffffefff60f0000003ffffc000000001cdfffffffffa1fe0000003ffff800000000071ffffffffc11ff0000001ffff000000000011fffffffffffff0000000fffe000000000001fffffffffffff8000000cbfc000000000000fffffffffffffc00000081fc000000000001fffff8fffffffe00000081e80000000000001ffff0fffffffe00000311c000000000000107e3e07ffffffe00001e1fc000000000000107e1e03efffffe0000003f000000000000010f80c00ffffffe00000078000000000000020e80c01ffffffe00005c60000000000000060481c01ffffffc0000ffc0000000000000064101000ffffff80007fe0000000000000000e3c00007fffc00000ffe00000000000000007b800003fff000001fff000000000000003173000001fff800003fff80000000000003e126000000fff00001ffff80000000000007801c000000ffe00003ffff8000000000000f06b0000000ffe00003ffff000000000000002000000000ffe00001fffe000000000000037c00000009ffe00001fffe000000000000037e0000000cfff00001fffc00000000000007ff0000000e7ff00000fff80000000000000fffc000000e3fe00000fff00000000000001fffe00000063fe000007ff80000000000003fffe00000003fe000001ff80000000000003fffe00000001fc000001ff80000000000001fffc00000000f8000000ff80000000000001fc3c00000000780000007f80000000000000f80000000000000000003f80000000000400200000000000000000001fc00000000002004000000000000000000007c00000000001800000000000000000000003c00000000000800000000000000000000003c00000000000000000000000000000000003c00000000000000000000000000000000011c00000000000000000000000000000000003c00000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000000000003fffffe00f80000000000e0000000000000ffffffffffff7840000000fc00000000000ffffffffffffffffffe0000fc03800000000fffffffffffffffffffc000fffffffc000011fffffffffffffffffff80ffffffffffe00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
function landBit(x, y){
  const row = y * 36;
  const nib = parseInt(LAND_HEX[row + 35 - (x >> 2)], 16);
  return (nib >> (x & 3)) & 1;
}
const N_NODES = 560;
const nodes = [];
const edges = [];

function buildMesh(){
  /* land cells weighted by cos(latitude); skip Antarctica */
  const cells = [], weights = [];
  let wsum = 0;
  for(let y=0;y<LAND_H;y++){
    const lat = (0.5 - (y + .5)/LAND_H) * Math.PI;
    if(lat < -60 * Math.PI/180) continue;
    const w = Math.cos(lat);
    for(let x=0;x<LAND_W;x++){
      if(!landBit(x, y)) continue;
      cells.push(x, y);
      wsum += w;
      weights.push(wsum);
    }
  }
  for(let i=0;i<N_NODES;i++){
    /* weighted cell pick */
    const target = rng() * wsum;
    let lo = 0, hi = weights.length - 1;
    while(lo < hi){
      const mid = (lo + hi) >> 1;
      if(weights[mid] < target) lo = mid + 1; else hi = mid;
    }
    const cx = cells[lo*2], cy = cells[lo*2 + 1];
    const lon = ((cx + rng())/LAND_W) * TAU - Math.PI;
    const lat = (0.5 - (cy + rng())/LAND_H) * Math.PI;
    const cl = Math.cos(lat);
    const big = rng() < .08;
    nodes.push({
      x: cl * Math.cos(lon),
      y: -Math.sin(lat),                         // north up on screen
      z: -cl * Math.sin(lon),                    // east to the right
      r: big ? 2.6 + rng()*1.8 : 1.0 + rng()*1.5,
      br: big ? .95 : .45 + rng()*.5,
      seed: i,
    });
  }
  /* edges: land dots link to close neighbours, tracing the continents */
  const TH = Math.cos(.135);
  for(let i=0;i<N_NODES;i++){
    for(let j=i+1;j<N_NODES;j++){
      const a = nodes[i], b = nodes[j];
      const dot = a.x*b.x + a.y*b.y + a.z*b.z;
      if(dot > TH) edges.push([i, j]);
    }
  }
}
buildMesh();

/* ---------- ocean layer: a sparser blueish web covering the water ---------- */
const N_OCEAN = 300;
const oceanNodes = [];
const oceanEdges = [];       // [i, j, kind]  kind 0: ocean-ocean, 1: ocean-land
function buildOcean(){
  const cells = [], weights = [];
  let wsum = 0;
  for(let y=0;y<LAND_H;y++){
    const lat = (0.5 - (y + .5)/LAND_H) * Math.PI;
    if(lat < -72 * Math.PI/180 || lat > 85 * Math.PI/180) continue;
    const w = Math.cos(lat);
    for(let x=0;x<LAND_W;x++){
      if(landBit(x, y)) continue;
      cells.push(x, y);
      wsum += w;
      weights.push(wsum);
    }
  }
  for(let i=0;i<N_OCEAN;i++){
    const target = rng() * wsum;
    let lo = 0, hi = weights.length - 1;
    while(lo < hi){
      const mid = (lo + hi) >> 1;
      if(weights[mid] < target) lo = mid + 1; else hi = mid;
    }
    const cx = cells[lo*2], cy = cells[lo*2 + 1];
    const lon = ((cx + rng())/LAND_W) * TAU - Math.PI;
    const lat = (0.5 - (cy + rng())/LAND_H) * Math.PI;
    const cl = Math.cos(lat);
    oceanNodes.push({
      x: cl * Math.cos(lon),
      y: -Math.sin(lat),
      z: -cl * Math.sin(lon),
      r: .7 + rng()*1.1,
      br: .3 + rng()*.3,
    });
  }
  /* ocean web: wider spacing needs a wider link threshold */
  const TH_O = Math.cos(.24);
  const TH_C = Math.cos(.17);
  for(let i=0;i<N_OCEAN;i++){
    const a = oceanNodes[i];
    for(let j=i+1;j<N_OCEAN;j++){
      const b = oceanNodes[j];
      if(a.x*b.x + a.y*b.y + a.z*b.z > TH_O) oceanEdges.push([i, j, 0]);
    }
    /* coastal ties: at most the two nearest land dots */
    const near = [];
    for(let j=0;j<N_NODES;j++){
      const b = nodes[j];
      const dot = a.x*b.x + a.y*b.y + a.z*b.z;
      if(dot > TH_C) near.push([dot, j]);
    }
    near.sort((p, q) => q[0] - p[0]);
    for(let k=0;k<Math.min(2, near.length);k++) oceanEdges.push([i, near[k][1], 1]);
  }
}
buildOcean();

/* ---------- StarBurst background ----------
   port of the user's "Star Burst - Originkit" Framer component,
   with its preview props baked in: speed 2, starSize 40, opacity 49,
   flowerIntensity 0, twinkleSpeed 10. Radial spokes rise from the
   bottom-center horizon; along each spoke, streak pulses travel
   outward and twinkle. Drawn additively over the CSS dusk gradient
   (no opaque black plate, no center bloom at intensity 0). */
const SB = (() => {
  const SPEED = 2/10, STAR_SIZE = 40/20, OPACITY = 49/100, TWINKLE = 10/20;
  const SPOKES = 100, PER = 12;
  const rand = mulberry32(0xBADF00D);
  /* keep only spokes above the horizon — the rest would never render */
  const kc = [], ks = [];
  for(let i=0;i<SPOKES;i++){
    const a = (i/SPOKES) * TAU + (rand() - .5) * .02;
    const s = Math.sin(a);
    if(s > .05) continue;
    kc.push(Math.cos(a));
    ks.push(s);
  }
  const N_SPOKES = kc.length;
  const cosA = Float32Array.from(kc), sinA = Float32Array.from(ks);
  const N = N_SPOKES * PER;
  const pT = new Float32Array(N), pSpeed = new Float32Array(N),
        pSize = new Float32Array(N), pPhase = new Float32Array(N);
  for(let i=0;i<N;i++){
    pT[i] = -.05 + rand() * 1.1;
    pSpeed[i] = (.5 + rand()) * .25;
    pSize[i] = .7 + rand() * .8;
    pPhase[i] = rand() * TAU;
  }
  /* pre-baked streak sprite: transparent tail -> bright head */
  const sprite = document.createElement('canvas');
  sprite.width = 64; sprite.height = 2;
  const sg = sprite.getContext('2d');
  const grad = sg.createLinearGradient(0, 0, 64, 0);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(.7, 'rgba(255,255,255,.6)');
  grad.addColorStop(1, 'rgba(255,255,255,1)');
  sg.fillStyle = grad;
  sg.fillRect(0, 0, 64, 2);

  let time = 0;
  function update(dt){
    time += dt;
    for(let i=0;i<N;i++){
      pT[i] += pSpeed[i] * SPEED * dt;
      if(pT[i] > 1.1){
        pT[i] = -.05 - rand() * .05;
        pSize[i] = .7 + rand() * .8;
        pPhase[i] = rand() * TAU;
      }
    }
  }
  function render(){
    const cx = W * .5, cy = H;
    const RR = Math.sqrt(W*W + H*H);
    ctx.globalCompositeOperation = 'lighter';
    for(let i=0;i<N;i++){
      const t = pT[i];
      if(t < 0 || t >= 1) continue;
      const s = i % N_SPOKES;
      const twinkle = .7 + .3 * Math.sin(time * TWINKLE * 6 + pPhase[i]);
      let fade;
      if(t < .06) fade = t / .06;
      else if(t < .85) fade = 1;
      else fade = 1 - (t - .85) / .15;
      const a = Math.min(1, twinkle * fade * (1 + .5*t) * OPACITY);
      if(a < .005) continue;
      const dist = t * RR;
      const px = cx + cosA[s] * dist;
      const py = cy + sinA[s] * dist;
      const speedFactor = pSpeed[i] / .25;
      const lineLen = (8 + 12*speedFactor) * (.7 + .6 * pSize[i] * STAR_SIZE);
      ctx.setTransform(DPR*cosA[s], DPR*sinA[s], -DPR*sinA[s], DPR*cosA[s], DPR*px, DPR*py);
      ctx.globalAlpha = a;
      ctx.drawImage(sprite, -lineLen, -.5, lineLen, 1);
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  return {update, render};
})();

/* ---------- floating motes between the background and the globe ---------- */
const FP_N = 90;
const FX = new Float32Array(FP_N), FY = new Float32Array(FP_N), FZ = new Float32Array(FP_N);
const FVX = new Float32Array(FP_N), FVY = new Float32Array(FP_N), FVZ = new Float32Array(FP_N);
const FR2 = new Float32Array(FP_N), FA = new Float32Array(FP_N), FPh = new Float32Array(FP_N);
const FC = [];
for(let i=0;i<FP_N;i++){
  FX[i] = (rng()*2 - 1) * 1.7;                      // units of globe radius R
  FY[i] = (rng()*2 - 1) * 1.7;
  FZ[i] = (rng()*2 - 1) * 1.6;
  FVX[i] = (rng() - .5) * .05;
  FVY[i] = (rng() - .5) * .05 - .008;               // slight upward drift
  FVZ[i] = (rng() - .5) * .03;
  FR2[i] = .6 + rng() * 1.2;
  FA[i] = .12 + rng() * .3;
  FPh[i] = rng() * TAU;
  const c = rng();
  FC.push(c < .6 ? '#E8EAF4' : c < .8 ? '#A88BF0' : '#6ADCE8');
}
function updateFloaters(dt){
  for(let i=0;i<FP_N;i++){
    FX[i] += FVX[i] * dt;
    FY[i] += FVY[i] * dt;
    FZ[i] += FVZ[i] * dt;
    if(FX[i] > 1.7) FX[i] = -1.7; else if(FX[i] < -1.7) FX[i] = 1.7;
    if(FY[i] > 1.7) FY[i] = -1.7; else if(FY[i] < -1.7) FY[i] = 1.7;
    if(FZ[i] > 1.6) FZ[i] = -1.6; else if(FZ[i] < -1.6) FZ[i] = 1.6;
  }
}
function drawFloaters(front){
  for(let i=0;i<FP_N;i++){
    const z = FZ[i];
    if(front ? z < .2 : z >= .2) continue;
    const ps = FOV / (FOV - z*R);
    const sx = CX + FX[i]*R*ps;
    const sy = CY + FY[i]*R*ps;
    if(sx < -10 || sx > W+10 || sy < -10 || sy > H+10) continue;
    const depth = lerp(.3, 1, (z + 1.6) / 3.2);
    const twinkle = .7 + .3 * Math.sin(simT * .8 + FPh[i]);
    const a = FA[i] * depth * twinkle;
    if(a < .02) continue;
    ctx.globalAlpha = a;
    ctx.fillStyle = FC[i];
    ctx.beginPath();
    ctx.arc(sx, sy, FR2[i] * ps, 0, TAU);
    ctx.fill();
  }
}

/* ---------- camera / mouse (same technique as the constellation globe) ---------- */
const BASE_TILT = -.30, AUTO_SPIN = .07;
const INIT_YAW = 3.6;                  // start facing the land-rich hemisphere, not open ocean
let yaw = INIT_YAW, pitch = BASE_TILT;
let velYaw = AUTO_SPIN, velPitch = 0;
let dragging = false, dragDX = 0, dragDY = 0, dragDist = 0;
let lastPX = 0, lastPY = 0;
const pointer = {x: -1e6, y: -1e6, active: false};

canvas.addEventListener('pointerdown', e=>{
  dragging = true; dragDist = 0;
  canvas.classList.add('dragging');
  canvas.setPointerCapture(e.pointerId);
  lastPX = e.clientX; lastPY = e.clientY;
});
addEventListener('pointermove', e=>{
  pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  if(dragging){
    dragDX += e.clientX - lastPX;
    dragDY += e.clientY - lastPY;
    dragDist += Math.abs(e.clientX - lastPX) + Math.abs(e.clientY - lastPY);
    lastPX = e.clientX; lastPY = e.clientY;
  }
});
addEventListener('pointerup', ()=>{
  if(dragging && dragDist < 6) clickLaunch();
  dragging = false;
  canvas.classList.remove('dragging');
});
canvas.addEventListener('pointerleave', ()=>{ pointer.active = false; });

let M = [1,0,0, 0,1,0, 0,0,1];
function updateMatrix(){
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  M = [
    cy,      0,     sy,
    sx*sy,   cx,   -sx*cy,
    -cx*sy,  sx,    cx*cy,
  ];
}
function viewOf(p){
  return {
    x: M[0]*p.x + M[1]*p.y + M[2]*p.z,
    y: M[3]*p.x + M[4]*p.y + M[5]*p.z,
    z: M[6]*p.x + M[7]*p.y + M[8]*p.z,
  };
}
function project(p){                            // p: unit vector * lift
  const v = viewOf(p);
  const vx = v.x*R, vy = v.y*R, vz = v.z*R;
  const ps = FOV / (FOV - vz);
  return {x: CX + vx*ps, y: CY + vy*ps, s: ps, z: v.z};
}

function advanceCamera(dt){
  if(dragging){
    const dy = dragDX * .004, dp = dragDY * .004;
    yaw += dy; pitch = clamp(pitch + dp, -1.2, 1.2);
    velYaw = lerp(velYaw, dy/Math.max(dt, 1e-3), .35);
    velPitch = lerp(velPitch, dp/Math.max(dt, 1e-3), .35);
    dragDX = dragDY = 0;
  }else{
    yaw += velYaw * dt;
    pitch = clamp(pitch + velPitch * dt, -1.2, 1.2);
    const decay = Math.pow(.32, dt);
    velYaw = AUTO_SPIN + (velYaw - AUTO_SPIN) * decay;
    velPitch *= decay;
  }
}

/* ---------- arcs: gradient flight paths between nodes ---------- */
const ARCS = [];
const ARC_IN = 1.4, ARC_HOLD = 1.1, ARC_OUT = 1.0;
const ARC_LIFE = ARC_IN + ARC_HOLD + ARC_OUT;
let simT = 0, nextArcAt = .8, arcId = 0;

function pickArcPair(fromIdx){
  for(let tries=0; tries<40; tries++){
    const i = fromIdx !== undefined ? fromIdx : (arcRng()*N_NODES)|0;
    const j = (arcRng()*N_NODES)|0;
    if(i === j) continue;
    const a = nodes[i], b = nodes[j];
    const ang = Math.acos(clamp(a.x*b.x + a.y*b.y + a.z*b.z, -1, 1));
    if(ang > .5 && ang < 2.6) return [i, j];
  }
  return null;
}
const ARC_SEG = 56;
function spawnArc(fromIdx){
  const pair = pickArcPair(fromIdx);
  if(!pair) return;
  ARCS.push({
    a: pair[0], b: pair[1], t0: simT, id: arcId++,
    bx: new Float32Array(ARC_SEG+1),        // reusable projected-point buffers
    by: new Float32Array(ARC_SEG+1),
    bz: new Float32Array(ARC_SEG+1),
    _head: 0, _tail: 0,
  });
}
function updateArcs(){
  if(simT >= nextArcAt){
    if(ARCS.length < 5) spawnArc();
    nextArcAt = simT + .7 + arcRng()*.7;
  }
  let removed = false;
  for(let i=ARCS.length-1;i>=0;i--){
    if(simT - ARCS[i].t0 > ARC_LIFE){ ARCS.splice(i, 1); removed = true; }
  }
  if(removed){
    const alive = new Set(ARCS.map(a => a.id));
    for(const key of explodedPairs){
      const [x, y] = key.split('_');
      if(!alive.has(+x) || !alive.has(+y)) explodedPairs.delete(key);
    }
  }
}

/* ---------- sparks: arcs that cross each other explode ---------- */
const sparks = [];
const explodedPairs = new Set();
const sparkRng = mulberry32(SEED * 997 + 3);
const PURPLE_RGB = [138, 77, 255], CYAN_RGB = [41, 216, 230];
function arcColorAt(f){
  return [
    Math.round(lerp(PURPLE_RGB[0], CYAN_RGB[0], f)),
    Math.round(lerp(PURPLE_RGB[1], CYAN_RGB[1], f)),
    Math.round(lerp(PURPLE_RGB[2], CYAN_RGB[2], f)),
  ];
}
function explode(x, y, ca, cb){
  for(let k=0;k<14;k++){
    const a = sparkRng()*TAU, sp = 40 + sparkRng()*130;
    sparks.push({
      x, y,
      vx: Math.cos(a)*sp, vy: Math.sin(a)*sp,
      t0: simT, life: .35 + sparkRng()*.4,
      r: 1 + sparkRng()*1.1,
      c: k < 3 ? [255,255,255] : (k % 2 ? ca : cb),
    });
  }
}
function updateSparks(dt){
  const damp = Math.pow(.25, dt);
  for(let i=sparks.length-1;i>=0;i--){
    const s = sparks[i];
    if(simT - s.t0 > s.life){ sparks.splice(i, 1); continue; }
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.vx *= damp; s.vy *= damp;
  }
}
function segHit(x1, y1, x2, y2, x3, y3, x4, y4, out){
  const d1x = x2-x1, d1y = y2-y1, d2x = x4-x3, d2y = y4-y3;
  const den = d1x*d2y - d1y*d2x;
  if(Math.abs(den) < 1e-9) return false;
  const t = ((x3-x1)*d2y - (y3-y1)*d2x)/den;
  const u = ((x3-x1)*d1y - (y3-y1)*d1x)/den;
  if(t < 0 || t > 1 || u < 0 || u > 1) return false;
  out.x = x1 + d1x*t;
  out.y = y1 + d1y*t;
  return true;
}
const hitPoint = {x: 0, y: 0};
function detectArcCollisions(){
  for(let i=0;i<ARCS.length;i++) for(let j=i+1;j<ARCS.length;j++){
    const A = ARCS[i], B2 = ARCS[j];
    if(A._head === A._tail || B2._head === B2._tail) continue;
    const key = Math.min(A.id, B2.id) + '_' + Math.max(A.id, B2.id);
    if(explodedPairs.has(key)) continue;
    const STEP = 4;
    outer:
    for(let k=STEP;k<=ARC_SEG;k+=STEP){
      for(let l=STEP;l<=ARC_SEG;l+=STEP){
        if(segHit(A.bx[k-STEP], A.by[k-STEP], A.bx[k], A.by[k],
                  B2.bx[l-STEP], B2.by[l-STEP], B2.bx[l], B2.by[l], hitPoint)
           && A.bz[k] + B2.bz[l] > 0){
          explodedPairs.add(key);
          const fa = A._tail + (A._head - A._tail) * k/ARC_SEG;
          const fb = B2._tail + (B2._head - B2._tail) * l/ARC_SEG;
          explode(hitPoint.x, hitPoint.y, arcColorAt(fa), arcColorAt(fb));
          break outer;
        }
      }
    }
  }
}
function clickLaunch(){
  if(FREEZE_T !== null) return;
  /* nearest front-face node to the pointer */
  let best = -1, bd = 60;
  for(let i=0;i<N_NODES;i++){
    const p = project(nodes[i]);
    if(p.z < .1) continue;
    const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
    if(d < bd){ bd = d; best = i; }
  }
  if(best >= 0 && ARCS.length < 7) spawnArc(best);
}

/* slerp between two unit vectors */
function slerp(a, b, t){
  let dot = clamp(a.x*b.x + a.y*b.y + a.z*b.z, -1, 1);
  const th = Math.acos(dot);
  if(th < 1e-4) return {x:a.x, y:a.y, z:a.z};
  const s = Math.sin(th);
  const ka = Math.sin((1-t)*th)/s, kb = Math.sin(t*th)/s;
  return {x: a.x*ka + b.x*kb, y: a.y*ka + b.y*kb, z: a.z*ka + b.z*kb};
}

/* ---------- draw ---------- */
const DEPTH_A = [.08, .2, .5, 1];
function bucketOf(vz){ return clamp(((vz + 1) * 2) | 0, 0, 3); }

function activeEndpoints(){
  const set = new Map();      // node index -> strongest phase alpha
  for(const arc of ARCS){
    const t = simT - arc.t0;
    let a = 1;
    if(t < .3) a = t/.3;
    else if(t > ARC_IN + ARC_HOLD) a = 1 - (t - ARC_IN - ARC_HOLD)/ARC_OUT;
    set.set(arc.a, Math.max(set.get(arc.a) || 0, a));
    set.set(arc.b, Math.max(set.get(arc.b) || 0, a));
  }
  return set;
}

/* reusable projection buffers — no per-frame allocation */
const PX = new Float32Array(N_NODES), PY = new Float32Array(N_NODES),
      PS = new Float32Array(N_NODES), PZ = new Float32Array(N_NODES);
const OXA = new Float32Array(N_OCEAN), OYA = new Float32Array(N_OCEAN),
      OSA = new Float32Array(N_OCEAN), OZA = new Float32Array(N_OCEAN);
function projectSet(list, X, Y, Sc, Z){
  for(let i=0;i<list.length;i++){
    const n = list[i];
    const vx = (M[0]*n.x + M[1]*n.y + M[2]*n.z) * R;
    const vy = (M[3]*n.x + M[4]*n.y + M[5]*n.z) * R;
    const vz = (M[6]*n.x + M[7]*n.y + M[8]*n.z) * R;
    const ps = FOV / (FOV - vz);
    X[i] = CX + vx*ps;
    Y[i] = CY + vy*ps;
    Sc[i] = ps;
    Z[i] = vz / R;
  }
}

function draw(){
  updateMatrix();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);

  SB.render();
  drawFloaters(false);

  projectSet(nodes, PX, PY, PS, PZ);
  projectSet(oceanNodes, OXA, OYA, OSA, OZA);

  ctx.lineWidth = 1;
  ctx.lineCap = 'round';

  /* ocean web underneath, blueish and faint (backmost bucket is invisible — skipped) */
  const OB = [null, new Path2D(), new Path2D(), new Path2D()];
  for(const [i, j, kind] of oceanEdges){
    const za = OZA[i], zb = kind ? PZ[j] : OZA[j];
    const b = bucketOf(Math.min(za, zb));
    if(b === 0) continue;
    OB[b].moveTo(OXA[i], OYA[i]);
    OB[b].lineTo(kind ? PX[j] : OXA[j], kind ? PY[j] : OYA[j]);
  }
  ctx.strokeStyle = OCEAN_TONE;
  for(let b=1;b<4;b++){
    ctx.globalAlpha = .14 * DEPTH_A[b];
    ctx.stroke(OB[b]);
  }
  ctx.fillStyle = OCEAN_TONE;
  for(let i=0;i<N_OCEAN;i++){
    const a = oceanNodes[i].br * DEPTH_A[bucketOf(OZA[i])];
    if(a < .02) continue;
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.arc(OXA[i], OYA[i], oceanNodes[i].r * OSA[i], 0, TAU);
    ctx.fill();
  }

  /* land mesh edges, batched into depth buckets */
  const B = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
  for(const [i, j] of edges){
    const b = bucketOf(Math.min(PZ[i], PZ[j]));
    B[b].moveTo(PX[i], PY[i]);
    B[b].lineTo(PX[j], PY[j]);
  }
  ctx.strokeStyle = '#E8EAF2';
  for(let b=0;b<4;b++){
    ctx.globalAlpha = .26 * DEPTH_A[b];
    ctx.stroke(B[b]);
  }

  /* hover highlight */
  let hovered = -1;
  if(FREEZE_T === null && pointer.active && !dragging){
    let bd = 28;
    for(let i=0;i<N_NODES;i++){
      if(PZ[i] < .1) continue;
      const d = Math.hypot(PX[i] - pointer.x, PY[i] - pointer.y);
      if(d < bd){ bd = d; hovered = i; }
    }
  }

  /* nodes */
  const glow = activeEndpoints();
  for(let i=0;i<N_NODES;i++){
    const n = nodes[i];
    const depth = DEPTH_A[bucketOf(PZ[i])];
    let r = n.r * PS[i];
    let alpha = n.br * depth;
    const g = glow.get(i) || 0;
    if(g > 0 || i === hovered){
      const k = Math.max(g, i === hovered ? .8 : 0);
      r *= 1 + .55*k;
      alpha = Math.max(alpha, (.9 + .1*k) * depth);
      ctx.globalAlpha = .20 * k * depth;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(PX[i], PY[i], r*3.2, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.fillStyle = '#FAFAFC';
    ctx.beginPath();
    ctx.arc(PX[i], PY[i], r, 0, TAU);
    ctx.fill();
  }

  /* arcs on top */
  for(const arc of ARCS){
    const t = simT - arc.t0;
    let head = 1, tail = 0, alpha = 1;
    if(t < ARC_IN) head = easeInOut(t / ARC_IN);
    if(t > ARC_IN + ARC_HOLD){
      tail = easeInOut((t - ARC_IN - ARC_HOLD) / ARC_OUT);
      alpha = 1;
    }
    if(head - tail < .01) continue;

    const A = nodes[arc.a], Bn = nodes[arc.b];
    const ang = Math.acos(clamp(A.x*Bn.x + A.y*Bn.y + A.z*Bn.z, -1, 1));
    const lift = .22 + .16 * (ang / Math.PI);
    let zSum = 0;
    for(let k=0;k<=ARC_SEG;k++){
      const f = tail + (head - tail) * (k/ARC_SEG);
      const u = slerp(A, Bn, f);
      const l = (1 + lift * Math.sin(Math.PI * f)) * R;
      const vx = M[0]*u.x + M[1]*u.y + M[2]*u.z;
      const vy = M[3]*u.x + M[4]*u.y + M[5]*u.z;
      const vz = (M[6]*u.x + M[7]*u.y + M[8]*u.z) * l;
      const ps = FOV / (FOV - vz);
      arc.bx[k] = CX + vx*l*ps;
      arc.by[k] = CY + vy*l*ps;
      arc.bz[k] = vz / R;
      zSum += arc.bz[k];
    }
    arc._head = head; arc._tail = tail;
    const depth = lerp(.25, 1, clamp((zSum/(ARC_SEG+1) + 1)/2, 0, 1));
    const grad = ctx.createLinearGradient(PX[arc.a], PY[arc.a], PX[arc.b], PY[arc.b]);
    grad.addColorStop(0, ARC_PURPLE);
    grad.addColorStop(1, ARC_CYAN);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.1;
    ctx.globalAlpha = alpha * depth;
    ctx.beginPath();
    ctx.moveTo(arc.bx[0], arc.by[0]);
    for(let k=1;k<=ARC_SEG;k++) ctx.lineTo(arc.bx[k], arc.by[k]);
    ctx.stroke();
    /* bright head dot while drawing in */
    if(t < ARC_IN){
      ctx.globalAlpha = depth;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(arc.bx[ARC_SEG], arc.by[ARC_SEG], 2.4, 0, TAU);
      ctx.fill();
    }
  }

  /* crossings explode into sparks */
  detectArcCollisions();
  for(const s of sparks){
    const a = 1 - (simT - s.t0)/s.life;
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.fillStyle = 'rgb(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ')';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * (.5 + .5*a), 0, TAU);
    ctx.fill();
  }
  drawFloaters(true);
  ctx.globalAlpha = 1;
}

/* ---------- run ---------- */
function step(dt){
  simT += dt;
  updateArcs();
  updateSparks(dt);
  SB.update(dt);
  updateFloaters(dt);
}

if(FREEZE_T !== null){
  const steps = Math.round(FREEZE_T * 60);
  for(let i=0;i<steps;i++) step(1/60);
  yaw = INIT_YAW + AUTO_SPIN * FREEZE_T;
  draw();
}else if(REDUCED){
  for(let i=0;i<2.8*60;i++) step(1/60);
  yaw = INIT_YAW + AUTO_SPIN * 2.8;
  draw();
}else{
  /* embed-friendly scheduling: pause entirely when the canvas is
     scrolled out of view or the tab is hidden; optional ?fps=30 cap */
  const FPS_CAP = parseFloat(params.get('fps') || '0');
  const MIN_FRAME = FPS_CAP > 0 ? 1000/FPS_CAP - .5 : 0;
  let last = performance.now(), lastDraw = 0;
  let inView = true, active = false;

  function loop(now){
    if(!active) return;
    requestAnimationFrame(loop);
    if(MIN_FRAME && now - lastDraw < MIN_FRAME) return;
    lastDraw = now;
    const dt = Math.min((now - last)/1000, .05);
    last = now;
    const c0 = performance.now();
    advanceCamera(dt);
    step(dt);
    draw();
    window.__cost = (window.__cost || 0) * .95 + (performance.now() - c0) * .05;
  }
  function setActive(want){
    if(want === active) return;
    active = want;
    if(active){
      last = performance.now();
      requestAnimationFrame(loop);
    }
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      setActive(inView && !document.hidden);
    }).observe(canvas);
  }
  document.addEventListener('visibilitychange', ()=>{
    setActive(inView && !document.hidden);
  });
  setActive(true);
}
<\/script>
</body>
</html>
`,z=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tangled Constellations</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{height:100%;}
  body{
    background:#131313;
    display:grid;
    place-items:center;
    overflow:hidden;
  }
  canvas{display:block;cursor:grab;touch-action:none;}
  canvas.dragging{cursor:grabbing;}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
'use strict';
/* =========================================================
   TANGLED CONSTELLATIONS — globe edition
   chains of clean monotone glyphs wandering a 3D sphere,
   colliding with each other and with the stars pinned to it.
   Drag to spin (with inertia); the cursor is a solid collider
   that shoves any shape it touches.
   ========================================================= */

const params = new URLSearchParams(location.search);
const SEED  = parseInt(params.get('seed') || '11', 10);
const FREEZE_T = params.get('t') !== null ? parseFloat(params.get('t')) : null; // fast-forward & freeze (verification)
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- rng + noise ---------- */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEED);

function hash1(i, seed){
  let h = (i * 374761393 + seed * 668265263) | 0;
  h = Math.imul(h ^ h >>> 13, 1274126177);
  return (((h ^ h >>> 16) >>> 0) / 4294967296);
}
function noise1(seed, t){
  const i = Math.floor(t), f = t - i;
  const u = f*f*(3-2*f);
  return hash1(i, seed)*(1-u) + hash1(i+1, seed)*u;
}

const TAU = Math.PI * 2;
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const lerp = (a,b,t)=>a+(b-a)*t;

/* ---------- canvas ---------- */
const S = 1080;
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const DPR = Math.min(window.devicePixelRatio || 1, 2);
let view = S;
function resize(){
  view = Math.min(innerWidth, innerHeight);
  canvas.width = view * DPR;
  canvas.height = view * DPR;
  canvas.style.width = view + 'px';
  canvas.style.height = view + 'px';
}
resize();
addEventListener('resize', ()=>{
  resize();
  if(FREEZE_T !== null || REDUCED) draw();
});

/* ---------- palette: monotone ---------- */
const TONE = '#EDEBE6';
const BG = '#131313';

/* ---------- globe ---------- */
const CENTER = S/2;
const R = S * .40;                 // sphere radius (world units)
const FOV = R * 3.4;               // camera distance for mild perspective

/* nodes live on the sphere surface; positions are 3D, length R */
function reproject(n){
  const d = Math.hypot(n.x, n.y, n.z) || 1;
  const s = R / d;
  n.x *= s; n.y *= s; n.z *= s;
}

/* ---------- population ---------- */
const chains = [];
const nodes = [];
let seedCounter = 1;

function makeNode(x, y, z){
  const gr = rng();
  let glyph;
  if(gr < .42)      glyph = {type:'dot',    r: .9 + rng()*1.4};
  else if(gr < .55) glyph = {type:'circle', r: 2.5 + rng()*3, dot: rng() < .3};
  else if(gr < .72) glyph = {type:'circle', r: 6 + Math.pow(rng(),1.8)*30 + (rng()<.06 ? 16 : 0),
                             dot: rng() < .6, dbl: rng() < .18};
  else if(gr < .84) glyph = {type:'square', h: 5 + Math.pow(rng(),1.6)*26,
                             rot: (rng()<.25 ? Math.PI/4 : (rng()-.5)*.9), dot: rng() < .4};
  else if(gr < .96) glyph = {type:'cross',  a1: 10 + rng()*42, a2: 8 + rng()*36,
                             rot: rng()*TAU, skew: (rng()-.5)*.7};
  else              glyph = {type:'square', h: 3.5 + rng()*3.5, rot: Math.PI/4, dot:false};
  let cr;
  if(glyph.type === 'dot')         cr = 2.4;
  else if(glyph.type === 'circle') cr = glyph.r + 1.5;
  else if(glyph.type === 'square') cr = glyph.h * 1.25;
  else                             cr = clamp(Math.max(glyph.a1, glyph.a2) * .3, 4, 12);
  const n = {
    x, y, z,
    seed: seedCounter++,
    glyph,
    cr: Math.min(cr, 40),
  };
  reproject(n);
  return n;
}

/* random unit vector (uniform on sphere) */
function randDir(){
  const z = rng()*2 - 1;
  const a = rng()*TAU;
  const s = Math.sqrt(1 - z*z);
  return {x: Math.cos(a)*s, y: z, z: Math.sin(a)*s};
}
/* random tangent direction at point p (unit) */
function randTangent(p){
  const w = randDir();
  const d = w.x*p.x + w.y*p.y + w.z*p.z;
  const t = {x: w.x - d*p.x, y: w.y - d*p.y, z: w.z - d*p.z};
  const m = Math.hypot(t.x, t.y, t.z) || 1;
  return {x: t.x/m, y: t.y/m, z: t.z/m};
}

function buildPopulation(){
  const TOTAL_RING_CHAINS = 112;
  const INNER_CHAINS = 34;
  let arc = rng()*TAU;
  for(let ci=0; ci<TOTAL_RING_CHAINS + INNER_CHAINS; ci++){
    const inner = ci >= TOTAL_RING_CHAINS;
    const len = inner && rng() < .4 ? 1 : 2 + Math.floor(Math.pow(rng(), 1.3)*5.5);
    const restLen = 26 + rng()*20;
    const chain = {nodes: [], restLen, seed: seedCounter++, headFreq: rng() < .45 ? .07 : .16};
    if(inner){
      /* scattered anywhere on the sphere, short walks along the surface */
      let p = randDir();
      let px = p.x*R, py = p.y*R, pz = p.z*R;
      for(let i=0;i<len;i++){
        chain.nodes.push(makeNode(px, py, pz));
        const t = randTangent({x:px/R, y:py/R, z:pz/R});
        px += t.x*restLen*.9; py += t.y*restLen*.9; pz += t.z*restLen*.9;
      }
    }else{
      /* laid along the equator great circle, compressed, slight scatter */
      for(let i=0;i<len;i++){
        const jx = (rng()-.5)*36, jy = (rng()-.5)*36;
        chain.nodes.push(makeNode(
          Math.cos(arc)*R,
          jy,
          Math.sin(arc)*R
        ));
        /* nudge sideways off the exact circle */
        const n = chain.nodes[chain.nodes.length-1];
        n.x += -Math.sin(arc)*jx; n.z += Math.cos(arc)*jx;
        reproject(n);
        arc += (restLen*.4)/R;
      }
      arc += (rng()*10)/R;
    }
    chain.nodes.forEach(n => nodes.push(n));
    chains.push(chain);
  }
  for(const n of nodes){
    const d = Math.hypot(n.x, n.y, n.z);
    n.homeX = n.x/d; n.homeY = n.y/d; n.homeZ = n.z/d;   // unit home direction
  }
}
buildPopulation();

const adjacent = new Set();
for(const chain of chains){
  for(let i=1;i<chain.nodes.length;i++){
    adjacent.add(chain.nodes[i-1].seed + '_' + chain.nodes[i].seed);
    adjacent.add(chain.nodes[i].seed + '_' + chain.nodes[i-1].seed);
  }
}

/* ---------- stars: pinned to the globe, solid obstacles ---------- */
const stars = [];
const GRID_CELL = 84;
const starGrid = new Map();
function cellKey(x, y, z){
  return ((x/GRID_CELL)|0) + ',' + ((y/GRID_CELL)|0) + ',' + ((z/GRID_CELL)|0);
}
(function buildStars(){
  for(let i=0;i<170;i++){
    const big = rng() < .12;
    const d = randDir();
    const st = {
      x: d.x*R, y: d.y*R, z: d.z*R,
      r: big ? 1.8 + rng()*1.4 : .5 + rng()*1.1,
      seed: seedCounter++,
      sparkle: big && rng() < .6,
    };
    st.cr = st.r + 6;
    stars.push(st);
    const key = cellKey(st.x, st.y, st.z);
    if(!starGrid.has(key)) starGrid.set(key, []);
    starGrid.get(key).push(st);
  }
})();

/* faint fixed dust behind the globe */
const dust = [];
for(let i=0;i<55;i++){
  dust.push({x: rng()*S, y: rng()*S, r: .4 + rng()*.7, a: .05 + rng()*.09});
}

/* ---------- mouse: drag to spin, hover to stir ---------- */
const BASE_TILT = -.35, AUTO_SPIN = .10;
let yaw = 0, pitch = BASE_TILT;
let velYaw = AUTO_SPIN, velPitch = 0;
let dragging = false, dragDX = 0, dragDY = 0;
let lastPX = 0, lastPY = 0;
const pointer = {x: -1e6, y: -1e6, active: false};

function toLogical(e){
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (S / rect.width),
    y: (e.clientY - rect.top) * (S / rect.height),
  };
}
canvas.addEventListener('pointerdown', e=>{
  dragging = true;
  canvas.classList.add('dragging');
  canvas.setPointerCapture(e.pointerId);
  lastPX = e.clientX; lastPY = e.clientY;
});
addEventListener('pointermove', e=>{
  const p = toLogical(e);
  pointer.x = p.x; pointer.y = p.y; pointer.active = true;
  if(dragging){
    dragDX += e.clientX - lastPX;
    dragDY += e.clientY - lastPY;
    lastPX = e.clientX; lastPY = e.clientY;
  }
});
addEventListener('pointerup', ()=>{
  dragging = false;
  canvas.classList.remove('dragging');
});
canvas.addEventListener('pointerleave', ()=>{ pointer.active = false; });

/* rotation matrix (globe-local -> view): tilt about X after spin about Y */
let M = [1,0,0, 0,1,0, 0,0,1];
function updateMatrix(){
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  /* Rx(pitch) * Ry(yaw) */
  M = [
    cy,        0,       sy,
    sx*sy,     cx,     -sx*cy,
    -cx*sy,    sx,      cx*cy,
  ];
}
function viewOf(n){
  return {
    x: M[0]*n.x + M[1]*n.y + M[2]*n.z,
    y: M[3]*n.x + M[4]*n.y + M[5]*n.z,
    z: M[6]*n.x + M[7]*n.y + M[8]*n.z,
  };
}
/* screen point -> globe-local surface point via ray-sphere intersection,
   null if the cursor ray misses the globe. Exact under perspective, so
   contact happens precisely where the cursor visually touches a shape. */
function unproject(sx, sy){
  const px = sx - CENTER, py = sy - CENTER;
  const A = px*px + py*py + FOV*FOV;
  const Bq = -2*FOV*FOV;
  const Cq = FOV*FOV - R*R;
  const disc = Bq*Bq - 4*A*Cq;
  if(disc < 0) return null;
  const t = (-Bq - Math.sqrt(disc)) / (2*A);   // near (front) intersection
  const vx = t*px, vy = t*py, vz = FOV*(1-t);
  /* inverse rotation = transpose */
  return {
    x: M[0]*vx + M[3]*vy + M[6]*vz,
    y: M[1]*vx + M[4]*vy + M[7]*vz,
    z: M[2]*vx + M[5]*vy + M[8]*vz,
  };
}

/* ---------- physics ---------- */
let simT = 0;
function attractorPos(t){
  const th = (noise1(9001, t*.045 + 3.7)*4 - 2) * Math.PI;
  const ph = (noise1(9007, t*.045 + 8.2) - .5) * Math.PI * .75;
  return {
    x: Math.cos(ph)*Math.cos(th)*R,
    y: Math.sin(ph)*R,
    z: Math.cos(ph)*Math.sin(th)*R,
  };
}

const CYCLE = 38, REFORM_AT = 32;
const CURSOR_R = 12;               // the cursor's collision radius on the surface
function step(dt){
  simT += dt;
  const tc = simT % CYCLE;
  let reform = 0;
  if(tc > REFORM_AT){
    const f = (tc - REFORM_AT) / (CYCLE - REFORM_AT);
    reform = f < .8 ? f/.8 : (1-f)/.2;
    reform = reform*reform*(3-2*reform);
  }
  const att = attractorPos(simT);
  const stir = (FREEZE_T === null && pointer.active && !dragging) ? unproject(pointer.x, pointer.y) : null;

  for(const chain of chains){
    const head = chain.nodes[0];

    /* head: smooth noise wander along the surface */
    const t = simT * chain.headFreq;
    const wx = noise1(head.seed, t) - .5,
          wy = noise1(head.seed + 91, t) - .5,
          wz = noise1(head.seed + 182, t) - .5;
    const rd = (wx*head.x + wy*head.y + wz*head.z) / R;
    let tx = wx - rd*head.x/R, ty = wy - rd*head.y/R, tz = wz - rd*head.z/R;
    const tm = Math.hypot(tx, ty, tz);
    if(tm > 1e-4){
      const speed = 26 + noise1(head.seed + 500, simT*.3) * 36;
      head.x += tx/tm * speed * dt;
      head.y += ty/tm * speed * dt;
      head.z += tz/tm * speed * dt;
    }

    for(let i=1;i<chain.nodes.length;i++){
      const n = chain.nodes[i], p = chain.nodes[i-1];
      let dx = n.x - p.x, dy = n.y - p.y, dz = n.z - p.z;
      const d = Math.hypot(dx, dy, dz) || 1;
      const k = Math.min(1, dt*5);
      n.x += (p.x + dx/d * chain.restLen - n.x) * k;
      n.y += (p.y + dy/d * chain.restLen - n.y) * k;
      n.z += (p.z + dz/d * chain.restLen - n.z) * k;
      n.x += (noise1(n.seed+31, simT*.3) - .5) * 26 * dt;
      n.y += (noise1(n.seed+77, simT*.3) - .5) * 26 * dt;
      n.z += (noise1(n.seed+123, simT*.3) - .5) * 26 * dt;
    }

    for(const n of chain.nodes){
      /* attractor pull (chord distance), fading at its center */
      let ax = att.x - n.x, ay = att.y - n.y, az = att.z - n.z;
      const ad = Math.hypot(ax, ay, az);
      if(ad < 380 && ad > 1){
        const pull = 26 * (1 - ad/380) * clamp(ad/120, 0, 1) * (1 - reform);
        n.x += ax/ad * pull * dt;
        n.y += ay/ad * pull * dt;
        n.z += az/ad * pull * dt;
      }
      /* the cursor is a solid collider: shapes it touches get shoved out */
      if(stir){
        let sx = n.x - stir.x, sy = n.y - stir.y, sz = n.z - stir.z;
        const sd = Math.hypot(sx, sy, sz);
        const minD = n.cr + CURSOR_R;
        if(sd < minD && sd > .5){
          const push = (minD - sd) * .9;
          n.x += sx/sd * push;
          n.y += sy/sd * push;
          n.z += sz/sd * push;
        }
      }
      /* cyclical reform: drift home to the equator ring, then release */
      if(reform > 0){
        n.x += (n.homeX*R - n.x) * reform * dt * 3;
        n.y += (n.homeY*R - n.y) * reform * dt * 3;
        n.z += (n.homeZ*R - n.z) * reform * dt * 3;
      }
    }
  }

  frameGrid = makeGrid();
  for(let it=0; it<4; it++) resolveCollisions();
  for(const n of nodes) reproject(n);
}

/* ---------- collisions (3D chord space) ---------- */
let frameGrid = null;
function makeGrid(){
  const grid = new Map();
  nodes.forEach((n, i)=>{
    const key = cellKey(n.x, n.y, n.z);
    if(!grid.has(key)) grid.set(key, []);
    grid.get(key).push(i);
  });
  return grid;
}

function resolveCollisions(){
  nodes.forEach((n, i)=>{
    const gx = (n.x/GRID_CELL)|0, gy = (n.y/GRID_CELL)|0, gz = (n.z/GRID_CELL)|0;
    for(let ox=-1;ox<=1;ox++) for(let oy=-1;oy<=1;oy++) for(let oz=-1;oz<=1;oz++){
      const bucket = frameGrid.get((gx+ox)+','+(gy+oy)+','+(gz+oz));
      if(!bucket) continue;
      for(const j of bucket){
        if(j <= i) continue;
        const m = nodes[j];
        if(adjacent.has(n.seed + '_' + m.seed)) continue;
        const minD = n.cr + m.cr;
        let dx = m.x - n.x, dy = m.y - n.y, dz = m.z - n.z;
        const d2 = dx*dx + dy*dy + dz*dz;
        if(d2 >= minD*minD || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const push = (minD - d) * .5 * .45;
        dx /= d; dy /= d; dz /= d;
        n.x -= dx * push; n.y -= dy * push; n.z -= dz * push;
        m.x += dx * push; m.y += dy * push; m.z += dz * push;
      }
      const sBucket = starGrid.get((gx+ox)+','+(gy+oy)+','+(gz+oz));
      if(!sBucket) continue;
      for(const st of sBucket){
        const minD = n.cr + st.cr;
        let dx = n.x - st.x, dy = n.y - st.y, dz = n.z - st.z;
        const d2 = dx*dx + dy*dy + dz*dz;
        if(d2 >= minD*minD || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const push = (minD - d) * .9;
        n.x += dx/d * push;
        n.y += dy/d * push;
        n.z += dz/d * push;
      }
    }
  });
}

/* ---------- links ---------- */
const LINK_D = 58;
function findLinks(){
  if(!frameGrid) frameGrid = makeGrid();
  const links = [];
  nodes.forEach((n, i)=>{
    const gx = (n.x/GRID_CELL)|0, gy = (n.y/GRID_CELL)|0, gz = (n.z/GRID_CELL)|0;
    for(let ox=-1;ox<=1;ox++) for(let oy=-1;oy<=1;oy++) for(let oz=-1;oz<=1;oz++){
      const bucket = frameGrid.get((gx+ox)+','+(gy+oy)+','+(gz+oz));
      if(!bucket) continue;
      for(const j of bucket){
        if(j <= i) continue;
        const m = nodes[j];
        const dx = n.x-m.x, dy = n.y-m.y, dz = n.z-m.z;
        if(dx*dx + dy*dy + dz*dz < LINK_D*LINK_D){
          links.push([i, j]);
        }
      }
    }
  });
  return links;
}

/* ---------- rendering ---------- */
const DEPTH_A = [.15, .32, .58, 1];        // back -> front alpha
const idxOf = new Map();
nodes.forEach((n, i)=>idxOf.set(n.seed, i));
function bucketOf(vz){
  return clamp(((vz/R + 1) * 2) | 0, 0, 3);
}

function draw(){
  updateMatrix();
  ctx.setTransform(DPR*view/S, 0, 0, DPR*view/S, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, S, S);
  ctx.lineWidth = 1.15;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.fillStyle = TONE;
  ctx.strokeStyle = TONE;

  /* fixed dust, far behind the globe */
  for(const d of dust){
    ctx.globalAlpha = d.a;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, TAU);
    ctx.fill();
  }

  /* project all nodes once */
  const proj = new Array(nodes.length);
  for(let i=0;i<nodes.length;i++){
    const v = viewOf(nodes[i]);
    const ps = FOV / (FOV - v.z);
    proj[i] = {x: CENTER + v.x*ps, y: CENTER + v.y*ps, s: ps, b: bucketOf(v.z)};
  }

  /* depth-bucketed batches: [dim links, rope edges, glyph strokes, dot fills] */
  const B = [0,1,2,3].map(()=>({dim: new Path2D(), edge: new Path2D(), glyph: new Path2D(), dot: new Path2D()}));

  for(const [i, j] of findLinks()){
    const a = nodes[i], b = nodes[j];
    if(adjacent.has(a.seed + '_' + b.seed)) continue;
    const pa = proj[i], pb = proj[j];
    const path = B[Math.min(pa.b, pb.b)].dim;
    path.moveTo(pa.x, pa.y);
    path.lineTo(pb.x, pb.y);
  }

  for(const chain of chains){
    for(let i=1;i<chain.nodes.length;i++){
      const pa = proj[idxOf.get(chain.nodes[i-1].seed)];
      const pb = proj[idxOf.get(chain.nodes[i].seed)];
      const path = B[Math.min(pa.b, pb.b)].edge;
      path.moveTo(pa.x, pa.y);
      path.lineTo(pb.x, pb.y);
    }
  }

  for(let i=0;i<nodes.length;i++){
    const n = nodes[i], g = n.glyph, p = proj[i];
    const gp = B[p.b].glyph, dp = B[p.b].dot;
    const sc = p.s;
    if(g.type === 'dot'){
      dp.moveTo(p.x + g.r*sc, p.y);
      dp.arc(p.x, p.y, g.r*sc, 0, TAU);
    }else if(g.type === 'circle'){
      gp.moveTo(p.x + g.r*sc, p.y);
      gp.arc(p.x, p.y, g.r*sc, 0, TAU);
      if(g.dbl){
        const r2 = Math.max(g.r - 3, g.r*.72) * sc;
        gp.moveTo(p.x + r2, p.y);
        gp.arc(p.x, p.y, r2, 0, TAU);
      }
      if(g.dot){ dp.moveTo(p.x + 1.1*sc, p.y); dp.arc(p.x, p.y, 1.1*sc, 0, TAU); }
    }else if(g.type === 'square'){
      for(let k=0;k<=4;k++){
        const a = g.rot + Math.PI/4 + k*Math.PI/2;
        const x = p.x + Math.cos(a)*g.h*Math.SQRT2*sc, y = p.y + Math.sin(a)*g.h*Math.SQRT2*sc;
        if(k===0) gp.moveTo(x, y); else gp.lineTo(x, y);
      }
      if(g.dot){ dp.moveTo(p.x + 1.1*sc, p.y); dp.arc(p.x, p.y, 1.1*sc, 0, TAU); }
    }else if(g.type === 'cross'){
      const r1 = g.rot, r2 = g.rot + Math.PI/2 + g.skew;
      const o1 = (hash1(n.seed, 5) - .5) * g.a1 * .5;
      const o2 = (hash1(n.seed, 6) - .5) * g.a2 * .5;
      gp.moveTo(p.x - Math.cos(r1)*(g.a1 - o1)*sc, p.y - Math.sin(r1)*(g.a1 - o1)*sc);
      gp.lineTo(p.x + Math.cos(r1)*(g.a1 + o1)*sc, p.y + Math.sin(r1)*(g.a1 + o1)*sc);
      gp.moveTo(p.x - Math.cos(r2)*(g.a2 - o2)*sc, p.y - Math.sin(r2)*(g.a2 - o2)*sc);
      gp.lineTo(p.x + Math.cos(r2)*(g.a2 + o2)*sc, p.y + Math.sin(r2)*(g.a2 + o2)*sc);
    }
  }

  /* stars: individual (per-star twinkle x depth) */
  for(const st of stars){
    const v = viewOf(st);
    const ps = FOV / (FOV - v.z);
    const sx = CENTER + v.x*ps, sy = CENTER + v.y*ps;
    const depth = DEPTH_A[bucketOf(v.z)];
    ctx.globalAlpha = (.10 + .38 * noise1(st.seed, simT*.35)) * depth;
    ctx.beginPath();
    ctx.arc(sx, sy, st.r*ps, 0, TAU);
    ctx.fill();
    if(st.sparkle){
      const a = st.r*3.4*ps;
      ctx.beginPath();
      ctx.moveTo(sx - a, sy); ctx.lineTo(sx + a, sy);
      ctx.moveTo(sx, sy - a); ctx.lineTo(sx, sy + a);
      ctx.stroke();
    }
  }

  /* back-to-front strokes */
  for(let b=0;b<4;b++){
    const d = DEPTH_A[b];
    ctx.globalAlpha = .22 * d;
    ctx.stroke(B[b].dim);
    ctx.globalAlpha = .5 * d;
    ctx.stroke(B[b].edge);
    ctx.globalAlpha = .92 * d;
    ctx.stroke(B[b].glyph);
    ctx.globalAlpha = .9 * d;
    ctx.fill(B[b].dot);
  }
  ctx.globalAlpha = 1;
}

/* ---------- run ---------- */
function advanceCamera(dt){
  if(dragging){
    const dy = dragDX * .004, dp = dragDY * .004;
    yaw += dy; pitch = clamp(pitch + dp, -1.2, 1.2);
    velYaw = lerp(velYaw, dy/Math.max(dt, 1e-3), .35);
    velPitch = lerp(velPitch, dp/Math.max(dt, 1e-3), .35);
    dragDX = dragDY = 0;
  }else{
    yaw += velYaw * dt;
    pitch = clamp(pitch + velPitch * dt, -1.2, 1.2);
    /* inertia decays; spin settles back to the idle rate */
    const decay = Math.pow(.32, dt);
    velYaw = AUTO_SPIN + (velYaw - AUTO_SPIN) * decay;
    velPitch *= decay;
  }
}

if(FREEZE_T !== null){
  const steps = Math.round(FREEZE_T * 60);
  for(let i=0;i<steps;i++) step(1/60);
  yaw = AUTO_SPIN * FREEZE_T;
  draw();
}else if(REDUCED){
  for(let i=0;i<12*60;i++) step(1/60);
  yaw = AUTO_SPIN * 12;
  draw();
}else{
  let last = performance.now();
  (function loop(now){
    const dt = Math.min((now - last)/1000, .05);
    last = now;
    advanceCamera(dt);
    step(dt);
    draw();
    requestAnimationFrame(loop);
  })(performance.now());
}
<\/script>
</body>
</html>
`,a={speed:1,scale:1,opacity:1,hue:0,saturation:1,brightness:1},S={"tangled-constellations":z,"network-globe":T},C=t.lazy(()=>k(()=>import("./EnergyOrb-BbuGibHR.js"),__vite__mapDeps([0,1,2])).then(n=>({default:n.EnergyOrb})));function o(n,i,s){return Math.min(s,Math.max(i,n))}function F(n){return S[n].replaceAll("performance.now()","window.__GLOBE_COLLECTION_NOW()").replace(/<script[^>]+cloudflareinsights\.com[^>]*><\/script>/gi,"").replace("</head>",`<style data-globe-collection-focus>
:root { --globe-collection-scale: 1; }
html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
canvas { transform: scale(var(--globe-collection-scale)); transform-origin: 50% 50%; }
</style><script data-globe-collection-controls>
(function () {
  var nativeFrame = window.requestAnimationFrame.bind(window);
  var clock = { real: null, virtual: null };
  var controls = window.__GLOBE_COLLECTION_CONTROLS = { speed: 1, scale: 1, paused: false };
  window.__GLOBE_COLLECTION_NOW = function () {
    return clock.virtual === null ? performance.now() : clock.virtual;
  };
  window.requestAnimationFrame = function (callback) {
    function tick(realTime) {
      if (clock.real === null) {
        clock.real = realTime;
        clock.virtual = realTime;
      } else {
        if (!controls.paused) clock.virtual += (realTime - clock.real) * controls.speed;
        clock.real = realTime;
      }
      if (controls.paused) return nativeFrame(tick);
      callback(clock.virtual);
    }
    return nativeFrame(tick);
  };
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'globe-collection-controls') return;
    var next = event.data.controls || {};
    if (Number.isFinite(next.speed)) controls.speed = Math.max(0, Math.min(3, next.speed));
    if (Number.isFinite(next.scale)) controls.scale = Math.max(0.65, Math.min(1.35, next.scale));
    controls.paused = Boolean(next.paused);
    document.documentElement.style.setProperty('--globe-collection-scale', String(controls.scale));
    window.dispatchEvent(new Event('resize'));
  });
})();
<\/script></head>`)}function p({variant:n,speed:i=a.speed,scale:s=a.scale,opacity:h=a.opacity,hue:b=a.hue,saturation:A=a.saturation,brightness:w=a.brightness,className:g="",style:v}){const r=t.useRef(null),[E,R]=t.useState(!0),[_,P]=t.useState(()=>typeof document>"u"||!document.hidden),f=o(i,0,3),u=o(s,.65,1.35),y=!E||!_||f===0,x=t.useMemo(()=>F(n),[n]),l=t.useCallback(()=>{r.current?.contentWindow?.postMessage({type:"globe-collection-controls",controls:{speed:f,scale:u,paused:y}},"*")},[y,u,f]);t.useEffect(()=>{const c=r.current;if(!c||typeof IntersectionObserver>"u")return;const m=new IntersectionObserver(([M])=>R(M?.isIntersecting??!0));return m.observe(c),()=>m.disconnect()},[]),t.useEffect(()=>{if(typeof document>"u")return;const c=()=>P(!document.hidden);return document.addEventListener("visibilitychange",c),()=>document.removeEventListener("visibilitychange",c)},[]),t.useEffect(()=>{l()},[l,x]);const d=n==="tangled-constellations";return e.jsx("div",{className:`web3dkit-background globe-collection globe-collection--${n}${g?` ${g}`:""}`,style:{background:d?"#131313":"#272727",pointerEvents:"auto",...v},children:e.jsx("iframe",{ref:r,title:d?"Interactive tangled constellations globe":"Interactive network globe",srcDoc:x,sandbox:"allow-scripts",onLoad:l,style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:d?"#131313":"#272727",opacity:o(h,.05,1),filter:`hue-rotate(${o(b,-180,180)}deg) saturate(${o(A,0,2)}) brightness(${o(w,.35,1.65)})`}})})}function O(n){if(n.variant==="tangled-constellations"||n.variant==="network-globe")return e.jsx(p,{...n});const{variant:i,...s}=n;return e.jsx(t.Suspense,{fallback:e.jsx("div",{className:"web3dkit-background energy-orb",style:{background:"#05030e"}}),children:e.jsx(C,{...s})})}function D(n){return e.jsx(p,{...n,variant:"tangled-constellations"})}function L(n){return e.jsx(p,{...n,variant:"network-globe"})}export{a as GLOBE_CANVAS_DEFAULTS,O as GlobeCollection,L as NetworkGlobe,D as TangledConstellations};
