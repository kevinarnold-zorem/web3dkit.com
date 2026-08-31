import{r as h,j as C}from"./index-ChUl42DD.js";import{L as I}from"./LandingPages-Bks_nP6T.js";import"./SylvaLivingWorldScene-D5ro5Tc6.js";const G=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Tideform — Phase Field</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%2316181a'/%3E%3Crect x='11' y='11' width='10' height='10' fill='%23ff7a18'/%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
<style>
  :root{
    --ink:#16181a;
    --hot:#ff7a18;
    --gutter: clamp(20px, 3.2vw, 72px);
    --mono:"Roboto Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
    --sans:"Inter","Helvetica Neue",Helvetica,Arial,sans-serif;
  }
  *{ box-sizing:border-box; margin:0; padding:0; }
  html,body{ height:100%; }
  body{
    background:var(--ink);
    color:#fff;
    font-family:var(--sans);
    -webkit-font-smoothing:antialiased;
    overflow:hidden;
    cursor:crosshair;
  }
  a{ cursor:pointer; }

  #gl{ position:fixed; inset:0; width:100%; height:100%; display:block; }

  /* keeps the type legible over the brightest crests without flattening the field */
  .scrim{
    position:fixed; inset:0; pointer-events:none;
    background:
      linear-gradient(to right,  rgba(22,24,26,.88) 0%, rgba(22,24,26,.64) 24%, rgba(22,24,26,.28) 46%, rgba(22,24,26,0) 68%),
      linear-gradient(to bottom, rgba(22,24,26,.55) 0%, rgba(22,24,26,.15) 13%, rgba(22,24,26,0) 28%),
      linear-gradient(to top,    rgba(22,24,26,.52) 0%, rgba(22,24,26,.13) 11%, rgba(22,24,26,0) 24%);
  }

  .hero{
    position:fixed; inset:0;
    display:grid; grid-template-rows:auto 1fr auto;
    padding:var(--gutter);
    pointer-events:none;                 /* the field owns the pointer */
  }
  .hero a, .hero button{ pointer-events:auto; }

  /* ---- top menu ---- */
  .nav{ display:flex; align-items:center; justify-content:space-between; gap:24px; }
  .brand{
    display:flex; align-items:center; gap:10px;
    font-weight:800; font-size:15px; letter-spacing:.01em;
    text-decoration:none; color:#fff;
  }
  .brand .mark{
    width:9px; height:9px; background:var(--hot);
    box-shadow:0 0 14px rgba(255,122,24,.85);
    transition:transform .35s cubic-bezier(.2,.8,.2,1);
  }
  .brand:hover .mark{ transform:scale(1.5); }

  .links{ display:flex; align-items:center; gap:clamp(14px, 2vw, 30px); }
  .links a{
    font-family:var(--mono); font-size:11px; font-weight:500;
    letter-spacing:.16em; text-transform:uppercase; text-decoration:none;
    color:rgba(255,255,255,.58);
    transition:color .2s ease;
  }
  .links a:hover{ color:#fff; }
  .links a.idx{ color:rgba(255,255,255,.34); }
  .links a.idx:hover{ color:var(--hot); }

  /* ---- centred block: heading, description, call to action ---- */
  .center{ display:flex; align-items:center; }
  .block{ max-width:min(100%, 920px); }

  .eyebrow{
    font-family:var(--mono); font-size:11px; font-weight:500;
    letter-spacing:.18em; text-transform:uppercase;
    color:rgba(255,255,255,.46);
    margin-bottom:clamp(16px, 2.4vh, 26px);
  }
  h1{
    font-size:clamp(42px, 6.8vw, 104px);
    font-weight:400; letter-spacing:-0.022em; line-height:1.0;
    pointer-events:auto;              /* so it can catch its own hover */
  }
  h1 .line{ display:block; }

  /* Each character is boxed at its own kerned advance, so swapping a letter
     for a braille glyph cannot move anything around it. */
  .ch{ display:inline-block; white-space:pre; }
  .ch.dot{ color:var(--hot); }

  .lede{
    margin-top:clamp(18px, 2.6vh, 28px);
    max-width:44ch;
    font-size:clamp(15px, 1.15vw, 17px); line-height:1.6;
    color:rgba(255,255,255,.70);
  }

  .cta{
    margin-top:clamp(26px, 3.6vh, 40px);
    display:inline-flex; align-items:center; gap:14px;
    padding:15px 22px;
    border:1px solid rgba(255,255,255,.20);
    font-family:var(--mono); font-size:11px; font-weight:700;
    letter-spacing:.16em; text-transform:uppercase; text-decoration:none;
    color:#fff; white-space:nowrap;
    background:rgba(255,255,255,.055);
    -webkit-backdrop-filter:blur(16px) saturate(1.25);
    backdrop-filter:blur(16px) saturate(1.25);
    transition:border-color .25s ease, background-color .25s ease, color .25s ease;
  }
  .cta svg{ display:block; transition:transform .25s cubic-bezier(.2,.8,.2,1); }
  .cta:hover{ border-color:var(--hot); color:var(--hot); background:rgba(255,122,24,.14); }
  .cta:hover svg{ transform:translateX(4px); }
  .cta:active{ background:rgba(255,122,24,.24); }

  /* ---- footer ---- */
  .foot{ display:flex; align-items:flex-end; justify-content:space-between; gap:24px; }
  .meta, .hint{
    font-family:var(--mono); font-size:11px; font-weight:500;
    letter-spacing:.13em; line-height:1.75; text-transform:uppercase;
    color:rgba(255,255,255,.42);
  }
  .hint{ text-align:right; }
  .hint b{ color:var(--hot); font-weight:500; }
  .hint .coarse{ display:none; }
  @media (pointer:coarse){
    .hint .fine{ display:none; }
    .hint .coarse{ display:inline; }
  }

  @media (max-width:720px){
    /* the block spans the full width here, so the veil has to as well */
    .scrim{ background:
      linear-gradient(to right,  rgba(22,24,26,.80) 0%, rgba(22,24,26,.58) 58%, rgba(22,24,26,.30) 100%),
      linear-gradient(to bottom, rgba(22,24,26,.5) 0%, rgba(22,24,26,0) 22%),
      linear-gradient(to top,    rgba(22,24,26,.5) 0%, rgba(22,24,26,0) 20%); }
    .links a:not(.idx){ display:none; }
    .foot{ flex-direction:column-reverse; align-items:flex-start; gap:14px; }
    .hint{ text-align:left; }
    .meta, .hint{ font-size:10px; }
  }
  @media (max-height:600px){
    .lede{ display:none; }
    .meta{ display:none; }
  }
</style>
</head>
<body>
  <canvas id="gl" aria-hidden="true"></canvas>
  <div class="scrim"></div>

  <div class="hero">
    <nav class="nav">
      <a class="brand" href="#"><span class="mark"></span><span class="line" data-text="TIDEFORM">TIDEFORM</span></a>
      <div class="links">
        <a href="#"><span class="line" data-text="Work">Work</span></a>
        <a href="#"><span class="line" data-text="Studio">Studio</span></a>
        <a href="#"><span class="line" data-text="Journal">Journal</span></a>
        <a class="idx" href="#"><span class="line" data-text="Contact ↗">Contact ↗</span></a>
      </div>
    </nav>

    <div class="center">
      <div class="block">
        <p class="eyebrow">Phase Field No. 01 — realtime</p>
        <h1 id="head">
          <span class="line" data-text="Design systems">Design systems</span>
          <span class="line" data-text="that answer back." data-hot="1">that answer back.</span>
        </h1>
        <p class="lede">Tideform builds identities, interfaces and motion for the browser
          — systems that behave like material instead of sitting still in a deck.</p>
        <a class="cta" id="cta" href="#"><span class="line" data-text="See the work">See the work</span>
          <svg width="20" height="8" viewBox="0 0 20 8" fill="none" aria-hidden="true">
            <path d="M0 4h18M14.5 .8 18.2 4l-3.7 3.2" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </a>
      </div>
    </div>

    <div class="foot">
      <p class="meta">.TIDE.FRM**. — phase field no. 01<br>Realtime WebGL · 2.6 second cycle</p>
      <p class="hint"><span class="fine">Move to warm the lattice · <b>click to ignite</b></span><span class="coarse">Drag to warm the lattice · <b>tap to ignite</b></span></p>
    </div>
  </div>

<script type="module">
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

/* ------------------------------------------------------------------
   A lattice of dots on a black field. A crest travels outward from the
   centre; where it passes, dots swell, brighten and drift outward along
   their own radius. Everything is driven by one phase angle.

   The scene is authored in "cell units" — one lattice cell is always
   25.3 x 21.8 units — so the wavelength, travel and dot sizes below stay
   valid at any viewport size. Only the visible extent changes.

   Two things ride on top of that field: the pointer warms the lattice
   near it (leading the phase and pushing dots into the hot band), and a
   click ignites an expanding ring.
------------------------------------------------------------------ */
const P = {
  CELL_X: 25.3, CELL_Y: 21.8,
  COLS_TARGET: 54,          // roughly how many columns fill the width
  CELL_PX_MIN: 20, CELL_PX_MAX: 34,
  MAX_DOTS: 4600,

  PERIOD: 2.613,      // seconds for one full modulation cycle
  LAMBDA: 268.0,      // distance a crest travels in one cycle
  PHASE: 1.70,        // radians

  // The crest profile, as a 4-harmonic series in the phase angle.
  // a0, a1, b1, a2, b2, a3, b3, a4, b4
  WAVE: [0.3772, 0.1623, -0.1291, 0.2351, 0.0817, 0.1405, -0.0878, 0.0774, 0.0152],
  WAVE_LO: -0.12,     // black point on the waveform
  WAVE_HI: 0.996,     // white point

  AMP: 9.5,           // radial travel of a dot, in units
  AMP_IN: 0.95,       // scaled at the centre
  AMP_OUT: 1.00,      // ... and at the corner

  SIZE_MIN: 0.50,
  SIZE_MAX: 4.10,
  SIZE_GAMMA: 1.00,
  SIZE_CEN: 1.05,     // dot-size multiplier at the centre
  SIZE_EDGE: 0.78,    // ... and at the corner

  // Brightness climbs fast and then saturates while size keeps growing, so the
  // accent dots read as bright but small beside the white ones at the peak.
  BRI_MIN: 0.015,
  BRI_A: 0.04,        // drive value where a dot starts to light up
  BRI_B: 0.30,        // drive value where it reaches full white
  ENV_EDGE: 0.46,     // modulation depth at the corner, relative to the centre
  ENV_POW: 1.70,

  TRAIL_MAX: 20,
  TRAIL_BUDGET: 52000,  // instances; the trail thins out on dense screens
  TRAIL_SPAN: 1.00,     // seconds of afterimage
  TRAIL_K: 2.4,         // decay across the trail
  TRAIL_SHARE: 0.80,    // light carried by the whole tail, relative to the head

  FEATHER: 1.00,      // width of the dot's soft edge, in units

  // The accent rides the shoulder of the crest, not its peak: dots ramp
  // dark -> hot -> white as the crest reaches them, so the colour reads as a
  // scatter of embers just inside and just outside the white ring.
  HOT: [1.0, 0.44, 0.06],
  HOT_BAND: [0.50, 0.58, 0.80, 1.02],   // in / full / full / out, on the drive
  RING: [0.15, 0.25, 0.34, 0.48],       // radial window for the accent, in r/rMax

  // The cursor paints heat into the lattice and the lattice keeps it for a
  // moment, so moving leaves a cooling trail of embers rather than a blob
  // that teleports around.
  HEAT_R: 66,         // units: falloff radius of the cursor's heat
  HEAT_LIFE: 0.95,    // seconds for heat to fall to 1/e once the cursor leaves
  HEAT_GAIN: 1.00,    // heat's share of the fire channel
  HEAT_LEAD: 0.95,    // radians the main field runs ahead in hot cells
  HEAT_PUSH: 11,      // units the lattice bulges away from the hot cells
  HEAT_SWELL: 1.5,    // extra dot radius at full fire
  HEAT_DRIVE: 0.82,   // how hard fire lifts the drive (size and brightness)
  HEAT_STRIKE: 1.0,   // heat dumped at the point of a click

  RIPPLES: 6,
  RIPPLE_SPEED: 300,  // units per second
  RIPPLE_WIDTH: 34,
  RIPPLE_LIFE: 2.4,   // seconds
  RIPPLE_GAIN: 1.15,  // the front's share of the fire channel
  RIPPLE_KICK: 16,    // units the front shoves each dot outward
};

const BG = new THREE.Color('#16181a');
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
renderer.setClearColor(BG, 1);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);

/* ---- geometry: one quad per (dot x trail sample), sized for the worst case ---- */
const MAX_INST = P.MAX_DOTS * P.TRAIL_MAX;
const base  = new Float32Array(MAX_INST * 2);
const cellI = new Float32Array(MAX_INST * 2);
const trail = new Float32Array(MAX_INST);

// one heat value per lattice cell, held on the CPU and uploaded as a texture
const heat    = new Float32Array(P.MAX_DOTS);
const dotXY   = new Float32Array(P.MAX_DOTS * 2);
let heatTex   = null, gridCols = 0, gridRows = 0;

const geo  = new THREE.InstancedBufferGeometry();
const quad = new THREE.PlaneGeometry(1, 1);
geo.index = quad.index;
geo.setAttribute('position', quad.getAttribute('position'));
const aBase  = new THREE.InstancedBufferAttribute(base, 2);
const aCell  = new THREE.InstancedBufferAttribute(cellI, 2);
const aTrail = new THREE.InstancedBufferAttribute(trail, 1);
for (const a of [aBase, aCell, aTrail]) a.setUsage(THREE.DynamicDrawUsage);
geo.setAttribute('aBase', aBase);
geo.setAttribute('aCell', aCell);
geo.setAttribute('aTrail', aTrail);
geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);

const tailSum = (k, n) => {
  let s = 0;
  for (let i = 1; i < n; i++) s += Math.exp(-k * i / (n - 1));
  return s;
};

const U = {
  uTime:      { value: 0 },      // wave clock (held still under reduced motion)
  uNow:       { value: 0 },      // real clock, drives pointer and ripples
  uPeriod:    { value: P.PERIOD },
  uLambda:    { value: P.LAMBDA },
  uPhase:     { value: P.PHASE },
  uRmax:      { value: 600 },
  uWaveA:     { value: new THREE.Vector4(P.WAVE[0], P.WAVE[1], P.WAVE[3], P.WAVE[5]) }, // a0,a1,a2,a3
  uWaveB:     { value: new THREE.Vector4(P.WAVE[2], P.WAVE[4], P.WAVE[6], P.WAVE[8]) }, // b1,b2,b3,b4
  uWaveC:     { value: P.WAVE[7] },                                                     // a4
  uWaveLvl:   { value: new THREE.Vector2(P.WAVE_LO, P.WAVE_HI) },
  uAmp:       { value: new THREE.Vector3(P.AMP, P.AMP_IN, P.AMP_OUT) },
  uSize:      { value: new THREE.Vector3(P.SIZE_MIN, P.SIZE_MAX, P.SIZE_GAMMA) },
  uSizeEnv:   { value: new THREE.Vector2(P.SIZE_CEN, P.SIZE_EDGE) },
  uBri:       { value: new THREE.Vector4(P.BRI_MIN, P.BRI_A, P.BRI_B, P.ENV_EDGE) },
  uEnvPow:    { value: P.ENV_POW },
  uTrail:     { value: new THREE.Vector4(P.TRAIL_MAX, P.TRAIL_SPAN, P.TRAIL_K, 0) },
  uFeather:   { value: P.FEATHER },
  uHot:       { value: new THREE.Vector3(...P.HOT) },
  uHotBand:   { value: new THREE.Vector4(...P.HOT_BAND) },
  uRing:      { value: new THREE.Vector4(...P.RING) },
  uPointer:   { value: new THREE.Vector2(0, 0) },
  uHeatTex:   { value: null },
  uHeatSize:  { value: new THREE.Vector2(1, 1) },
  uWarm:      { value: new THREE.Vector4(P.HEAT_GAIN, P.HEAT_LEAD, P.HEAT_PUSH, P.HEAT_SWELL) },
  uFire:      { value: P.HEAT_DRIVE },
  uRipples:   { value: Array.from({ length: P.RIPPLES }, () => new THREE.Vector3(0, 0, -1e3)) },
  uRipple:    { value: new THREE.Vector4(P.RIPPLE_SPEED, P.RIPPLE_WIDTH, P.RIPPLE_LIFE, P.RIPPLE_GAIN) },
  uRippleKick:{ value: P.RIPPLE_KICK },
};

const material = new THREE.ShaderMaterial({
  uniforms: U,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneFactor,
  blendEquation: THREE.AddEquation,
  defines: { RIPPLES: P.RIPPLES },
  vertexShader: /* glsl */\`
    precision highp float;
    attribute vec2  aBase;
    attribute vec2  aCell;
    attribute float aTrail;

    uniform float uTime, uNow, uPeriod, uLambda, uPhase, uRmax, uEnvPow, uFeather;
    uniform vec4  uWaveA;    // a0, a1, a2, a3
    uniform vec4  uWaveB;    // b1, b2, b3, b4
    uniform float uWaveC;    // a4
    uniform vec2  uWaveLvl;  // black point, white point
    uniform vec3  uAmp;      // amplitude, scale at centre, scale at corner
    uniform vec3  uSize;     // min, max, gamma
    uniform vec2  uSizeEnv;  // size multiplier at centre / corner
    uniform vec4  uBri;      // floor, ramp start, ramp end, corner envelope
    uniform vec4  uTrail;    // count, span, decay, tail scale
    uniform vec3  uHot;
    uniform vec4  uHotBand;  // drive band: fade in / full / full / fade out
    uniform vec4  uRing;     // radial window for the accent
    uniform vec2      uPointer;
    uniform sampler2D uHeatTex;
    uniform vec2      uHeatSize;
    uniform vec4      uWarm;   // fire share, phase lead, outward push, swell
    uniform float     uFire;   // how hard fire lifts the drive
    uniform vec3  uRipples[RIPPLES];
    uniform vec4  uRipple;   // speed, width, life, gain
    uniform float uRippleKick;

    varying vec2  vP;
    varying vec3  vCol;
    varying float vR;
    varying float vSoft;

    const float TAU = 6.28318530718;

    // the travelling crest, as a short harmonic series
    float crest(float th){
      return uWaveA.x + uWaveA.y*cos(th)       + uWaveB.x*sin(th)
                      + uWaveA.z*cos(2.0*th)   + uWaveB.y*sin(2.0*th)
                      + uWaveA.w*cos(3.0*th)   + uWaveB.z*sin(3.0*th)
                      + uWaveC  *cos(4.0*th)   + uWaveB.w*sin(4.0*th);
    }

    float drive(float th){
      return clamp((crest(th) - uWaveLvl.x) / (uWaveLvl.y - uWaveLvl.x), 0.0, 1.0);
    }

    // expanding rings from clicks; also returns the outward shove they carry
    float ripples(vec2 p, float now, out vec2 kick){
      float sum = 0.0;
      kick = vec2(0.0);
      for (int i = 0; i < RIPPLES; i++){
        vec3 R = uRipples[i];
        float age = now - R.z;
        if (age <= 0.0 || age > uRipple.z) continue;
        vec2  dv = p - R.xy;
        float d  = length(dv);
        float f  = d - uRipple.x * age;                       // 0 on the wavefront
        float g  = exp(-f * f / (2.0 * uRipple.y * uRipple.y))
                 * exp(-age / (uRipple.z * 0.42));
        sum  += g;
        kick += (d > 0.001 ? dv / d : vec2(0.0)) * g;
      }
      return min(sum, 1.6);
    }

    void main(){
      float k  = aTrail / max(uTrail.x - 1.0, 1.0);
      float ti = uTime - k * uTrail.y;
      float tn = uNow  - k * uTrail.y;

      float r0 = length(aBase);
      float rn = r0 / uRmax;

      // heat the cursor has painted into this cell, held and cooling on the CPU
      float heat = texture2D(uHeatTex, (aCell + 0.5) / uHeatSize).r;

      vec2 kick;
      float ring = ripples(aBase, tn, kick);
      vec2 kickH;
      float ringH = ripples(aBase, uNow, kickH);

      // Fire is its own channel, separate from the field's own crest, so the
      // cursor and the ripples can burn orange while the field's peaks stay
      // white. Anything past 1.0 has enough headroom to go white-hot.
      float fireT = uWarm.x * heat + uRipple.w * ring;
      float fireH = uWarm.x * heat + uRipple.w * ringH;

      float th = TAU * ti / uPeriod - TAU * r0 / uLambda + uPhase + uWarm.y * heat;
      float m  = clamp(drive(th) + uFire * min(fireT, 1.0), 0.0, 1.0);

      // The envelope scales only the modulated part. That is what makes the
      // crest read as a sharp pulse near the centre and a soft swell at the
      // rim, instead of the same shape everywhere.
      float env = mix(1.0, uBri.w, pow(clamp(rn, 0.0, 1.0), uEnvPow));
      float rad = uSize.x + (uSize.y - uSize.x) * pow(m, uSize.z)
                * mix(uSizeEnv.x, uSizeEnv.y, clamp(rn, 0.0, 1.0))
                + uWarm.w * min(fireT, 1.0);
      float bri = uBri.x + (1.0 - uBri.x) * smoothstep(uBri.y, uBri.z, m) * env;

      // afterimage: the head keeps full brightness, the tail fades behind it
      bri *= (aTrail < 0.5) ? 1.0 : uTrail.w * exp(-uTrail.z * k);

      vec2  dir = r0 > 0.0001 ? aBase / r0 : vec2(0.0);
      vec2  pv   = aBase - uPointer;
      float dp   = length(pv);
      vec2  pdir = dp > 0.001 ? pv / dp : vec2(0.0);
      vec2  pos  = aBase
                 + dir * uAmp.x * mix(uAmp.y, uAmp.z, rn) * cos(th)
                 + pdir * uWarm.z * heat
                 + kick * uRippleKick;

      // Accent colour is keyed off the head of the trail, so a dot and its
      // whole afterimage stay one colour instead of the tail drifting
      // through the hot band on its way out.
      float thH = TAU * uNow / uPeriod - TAU * r0 / uLambda + uPhase + uWarm.y * heat;
      float mH  = clamp(drive(thH) + uFire * min(fireH, 1.0), 0.0, 1.0);

      // the standing accent: a thin ember ring the field keeps on its own
      float gate = smoothstep(uRing.x, uRing.y, rn) * (1.0 - smoothstep(uRing.z, uRing.w, rn));
      float amber = gate * smoothstep(uHotBand.x, uHotBand.y, mH)
                         * (1.0 - smoothstep(uHotBand.z, uHotBand.w, mH));

      vec3 tint = mix(vec3(1.0), uHot, clamp(amber + 1.5 * min(fireH, 1.0), 0.0, 1.0));
      tint = mix(tint, vec3(1.0), smoothstep(0.92, 1.30, fireH));   // white-hot core
      vCol = tint * bri;

      float halfQ = rad + uFeather + 0.5;
      vP    = position.xy * 2.0;
      vR    = rad / halfQ;
      vSoft = uFeather / halfQ;

      gl_Position = projectionMatrix * viewMatrix
                  * vec4(pos + position.xy * 2.0 * halfQ, 0.0, 1.0);
    }
  \`,
  fragmentShader: /* glsl */\`
    precision highp float;
    varying vec2  vP;
    varying vec3  vCol;
    varying float vR;
    varying float vSoft;

    void main(){
      float a = 1.0 - smoothstep(vR - vSoft, vR + vSoft * 0.3, length(vP));
      if (a <= 0.0015) discard;
      gl_FragColor = vec4(vCol * a, 1.0);
    }
  \`,
});

scene.add(new THREE.Mesh(geo, material));

/* ------------------------------------------------------------------
   Braille scramble. Every character is boxed at its own kerned advance
   (measured on a canvas, which shapes text the same way layout does), so
   glyphs can be swapped for braille without shifting a single pixel of
   the layout around them.
------------------------------------------------------------------ */
const BRAILLE_LO = 0x2801, BRAILLE_HI = 0x28ff;
const braille = () => String.fromCharCode(BRAILLE_LO + (Math.random() * (BRAILLE_HI - BRAILLE_LO + 1) | 0));
let measureCtx;

function prepare(el){
  const text = el.dataset.text;
  if (!text) return;
  const chars = [...text];

  // Reset to the authored state first: a re-prepare on resize must read the
  // CSS letter-spacing, not the zero this function leaves behind.
  el.style.letterSpacing = '';
  el.textContent = text;
  const probe = document.createRange();
  probe.selectNodeContents(el);
  const want = probe.getBoundingClientRect().width;

  const cs = getComputedStyle(el);
  measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
  measureCtx.font = \`\${cs.fontStyle} \${cs.fontWeight} \${cs.fontSize} \${cs.fontFamily}\`;
  if ('letterSpacing' in measureCtx) measureCtx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;

  const adv = [];
  let prev = 0;
  for (let i = 1; i <= chars.length; i++){
    const w = measureCtx.measureText(chars.slice(0, i).join('')).width;
    adv.push(w - prev); prev = w;
  }
  // if the canvas disagrees with layout (no letterSpacing support, odd
  // fallback), scale the advances so the line still ends where it should
  const k = prev > 1 && want > 1 ? want / prev : 1;

  el.textContent = '';
  el.style.letterSpacing = '0';
  const spans = chars.map((c, i) => {
    const sp = document.createElement('span');
    sp.className = 'ch' + (el.dataset.hot === '1' && i === chars.length - 1 ? ' dot' : '');
    sp.style.width = (adv[i] * k).toFixed(3) + 'px';
    sp.textContent = c;
    el.appendChild(sp);
    return sp;
  });
  el.__ch = spans;
  el.__text = chars;
}

function scramble(el, { hold = 190, stagger = 34 } = {}){
  const spans = el.__ch, chars = el.__text;
  if (!spans || el.__running) return;
  el.__running = true;

  const t0 = performance.now();
  const next = new Float64Array(chars.length);

  requestAnimationFrame(function step(now){
    const t = now - t0;
    let busy = false;
    for (let i = 0; i < chars.length; i++){
      const c = chars[i];
      if (c === ' ') continue;
      if (t >= hold + i * stagger){
        if (spans[i].textContent !== c) spans[i].textContent = c;
      } else {
        busy = true;
        if (now >= next[i]){                 // ~20 swaps a second, not 120
          spans[i].textContent = braille();
          next[i] = now + 34 + Math.random() * 34;
        }
      }
    }
    if (busy) requestAnimationFrame(step);
    else el.__running = false;
  });
}

const scramblers = [...document.querySelectorAll('.line')];
function prepareAll(){ for (const el of scramblers) prepare(el); }

for (const el of scramblers){
  const host = el.closest('a, h1') || el;
  host.addEventListener('pointerenter', () => {
    for (const l of host.querySelectorAll('.line')) scramble(l);
  });
}

if (document.fonts && document.fonts.ready){
  document.fonts.ready.then(() => {
    prepareAll();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
      document.querySelectorAll('#head .line').forEach((l, i) =>
        setTimeout(() => scramble(l, { hold: 260 + i * 90 }), 120));
  });
}

/* ---- layout: the lattice is rebuilt to fill whatever the viewport is ---- */
let pxPerUnit = 1;

function buildField(cols, rows, trailN){
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  let n = 0;
  for (let r = 0; r < rows; r++){
    for (let c = 0; c < cols; c++){
      const x = (c - cx) * P.CELL_X;
      const y = (cy - r) * P.CELL_Y;
      const d = r * cols + c;
      dotXY[d*2] = x; dotXY[d*2+1] = y;
      for (let k = 0; k < trailN; k++, n++){
        base[n*2] = x; base[n*2+1] = y;
        cellI[n*2] = c; cellI[n*2+1] = r;
        trail[n] = k;
      }
    }
  }
  geo.instanceCount = n;
  aBase.needsUpdate = aCell.needsUpdate = aTrail.needsUpdate = true;

  U.uTrail.value.x = trailN;
  U.uTrail.value.w = P.TRAIL_SHARE / tailSum(P.TRAIL_K, trailN);

  if (heatTex) heatTex.dispose();
  heat.fill(0);
  heatTex = new THREE.DataTexture(heat.subarray(0, cols * rows), cols, rows,
                                  THREE.RedFormat, THREE.FloatType);
  heatTex.minFilter = heatTex.magFilter = THREE.NearestFilter;
  heatTex.needsUpdate = true;
  U.uHeatTex.value = heatTex;
  U.uHeatSize.value.set(cols, rows);
  gridCols = cols; gridRows = rows;
}

function layout(){
  const vw = innerWidth, vh = innerHeight;

  let cellPx = Math.min(Math.max(vw / P.COLS_TARGET, P.CELL_PX_MIN), P.CELL_PX_MAX);
  let cols, rows;
  for (let i = 0; i < 16; i++){
    pxPerUnit = cellPx / P.CELL_X;
    cols = Math.ceil(vw / pxPerUnit / P.CELL_X) + 1;
    rows = Math.ceil(vh / pxPerUnit / P.CELL_Y) + 1;
    cols += cols & 1; rows += rows & 1;      // even counts keep the centre on a lattice corner
    if (cols * rows <= P.MAX_DOTS) break;
    cellPx *= 1.09;
  }
  const trailN = Math.max(8, Math.min(P.TRAIL_MAX, Math.round(P.TRAIL_BUDGET / (cols * rows))));
  buildField(cols, rows, trailN);

  const worldW = vw / pxPerUnit, worldH = vh / pxPerUnit;
  camera.left = -worldW/2; camera.right = worldW/2;
  camera.top  =  worldH/2; camera.bottom = -worldH/2;
  camera.updateProjectionMatrix();
  U.uRmax.value = Math.hypot(worldW, worldH) / 2;

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(vw, vh, false);
  prepareAll();
}
addEventListener('resize', layout);
layout();

/* ---- pointer: warmth follows the cursor, clicks ignite ---- */
const toWorld = (px, py) => new THREE.Vector2(
  (px - innerWidth / 2) / pxPerUnit,
 -(py - innerHeight / 2) / pxPerUnit
);

const at = new THREE.Vector2(0, 0);          // where the cursor is, in world units
const was = new THREE.Vector2(0, 0);         // where it was last frame
let live = false, slot = 0;

function aim(e){
  const p = toWorld(e.clientX, e.clientY);
  if (!live) was.copy(p);                    // no stroke from the last known spot
  at.copy(p);
  live = true;
}
addEventListener('pointermove', aim, { passive:true });
addEventListener('pointerdown', (e) => {
  aim(e);
  strike(at.x, at.y, P.HEAT_STRIKE);
  U.uRipples.value[slot].set(at.x, at.y, U.uNow.value);
  slot = (slot + 1) % P.RIPPLES;
}, { passive:true });
addEventListener('pointerleave', () => { live = false; });
addEventListener('blur', () => { live = false; });

function strike(x, y, amount){
  const s2 = 2 * P.HEAT_R * P.HEAT_R, n = gridCols * gridRows;
  for (let i = 0; i < n; i++){
    const ex = dotXY[i*2] - x, ey = dotXY[i*2+1] - y;
    const v = amount * Math.exp(-(ex*ex + ey*ey) / s2);
    if (v > heat[i]) heat[i] = v;
  }
  heatPeak = Math.max(heatPeak, amount);
  heatTex.needsUpdate = true;
}

// The lattice takes the cursor's heat immediately and lets it go slowly, so a
// stroke reads as embers cooling behind the pointer. Heat is painted along the
// segment covered this frame, so a fast swipe leaves one continuous mark
// instead of a dotted line of samples.
let heatPeak = 0;
function paintHeat(dt){
  if (!live && heatPeak < 1e-3) return;      // nothing to cool, nothing to paint
  const n = gridCols * gridRows;
  const cool = Math.exp(-dt / P.HEAT_LIFE);
  const s2   = 2 * P.HEAT_R * P.HEAT_R;
  const ax = was.x, ay = was.y, bx = at.x - was.x, by = at.y - was.y;
  const len2 = bx*bx + by*by;
  let peak = 0;
  for (let i = 0; i < n; i++){
    let v = heat[i] * cool;
    if (live){
      const px = dotXY[i*2], py = dotXY[i*2+1];
      let t = len2 > 0 ? ((px - ax)*bx + (py - ay)*by) / len2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const ex = ax + bx*t - px, ey = ay + by*t - py;
      const g = Math.exp(-(ex*ex + ey*ey) / s2);
      if (g > v) v = g;
    }
    heat[i] = v;
    if (v > peak) peak = v;
  }
  heatPeak = peak;
  was.copy(at);
  heatTex.needsUpdate = true;
}

/* ---- loop ---- */
const clock = new THREE.Clock();
const still = matchMedia('(prefers-reduced-motion: reduce)');
let t = still.matches ? 0.8 : 0;             // a frame with the crest mid-flight

function frame(){
  const dt = Math.min(clock.getDelta(), 0.1);
  if (!still.matches) t += dt;
  U.uTime.value = t;
  U.uNow.value += dt;

  U.uPointer.value.copy(at);
  paintHeat(dt);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();
<\/script>
</body>
</html>
`,B=["tideform","stone-ridge","pine-canopy","open-swell"],c=`  RIPPLE_KICK: 16,    // units the front shoves each dot outward
};`,O="const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);",y=`  uRippleKick:{ value: P.RIPPLE_KICK },
};`,d=`    uniform vec3  uRipples[RIPPLES];
    uniform vec4  uRipple;   // speed, width, life, gain
    uniform float uRippleKick;`,U=`      return min(sum, 1.6);
    }

    void main(){`,g=`      float r0 = length(aBase);
      float rn = r0 / uRmax;`,F=`      // heat the cursor has painted into this cell, held and cooling on the CPU
      float heat = texture2D(uHeatTex, (aCell + 0.5) / uHeatSize).r;`,N=`      vec2 kick;
      float ring = ripples(aBase, tn, kick);
      vec2 kickH;
      float ringH = ripples(aBase, uNow, kickH);`,z="      float th = TAU * ti / uPeriod - TAU * r0 / uLambda + uPhase + uWarm.y * heat;",W="      float thH = TAU * uNow / uPeriod - TAU * r0 / uLambda + uPhase + uWarm.y * heat;",V=`      vec2  dir = r0 > 0.0001 ? aBase / r0 : vec2(0.0);
      vec2  pv   = aBase - uPointer;
      float dp   = length(pv);
      vec2  pdir = dp > 0.001 ? pv / dp : vec2(0.0);
      vec2  pos  = aBase
                 + dir * uAmp.x * mix(uAmp.y, uAmp.z, rn) * cos(th)
                 + pdir * uWarm.z * heat
                 + kick * uRippleKick;`,P=`      vec3 tint = mix(vec3(1.0), uHot, clamp(amber + 1.5 * min(fireH, 1.0), 0.0, 1.0));
      tint = mix(tint, vec3(1.0), smoothstep(0.92, 1.30, fireH));   // white-hot core
      vCol = tint * bri;`,D=`      float halfQ = rad + uFeather + 0.5;
      vP    = position.xy * 2.0;
      vR    = rad / halfQ;
      vSoft = uFeather / halfQ;

      gl_Position = projectionMatrix * viewMatrix
                  * vec4(pos + position.xy * 2.0 * halfQ, 0.0, 1.0);`,X=`      const x = (c - cx) * P.CELL_X;
      const y = (cy - r) * P.CELL_Y;`,q=`      const d = r * cols + c;
      dotXY[d*2] = x; dotXY[d*2+1] = y;`,K=`const at = new THREE.Vector2(0, 0);          // where the cursor is, in world units
const was = new THREE.Vector2(0, 0);         // where it was last frame
let live = false, slot = 0;

function aim(e){
  const p = toWorld(e.clientX, e.clientY);
  if (!live) was.copy(p);                    // no stroke from the last known spot
  at.copy(p);
  live = true;
}`,j="  strike(at.x, at.y, P.HEAT_STRIKE);",Y="  const ax = was.x, ay = was.y, bx = at.x - was.x, by = at.y - was.y;",$=`  heatPeak = peak;
  was.copy(at);
  heatTex.needsUpdate = true;`,R=`frame();
<\/script>`,Z=`  let cellPx = Math.min(Math.max(vw / P.COLS_TARGET, P.CELL_PX_MIN), P.CELL_PX_MAX);
  let cols, rows;
  for (let i = 0; i < 16; i++){
    pxPerUnit = cellPx / P.CELL_X;
    cols = Math.ceil(vw / pxPerUnit / P.CELL_X) + 1;
    rows = Math.ceil(vh / pxPerUnit / P.CELL_Y) + 1;
    cols += cols & 1; rows += rows & 1;      // even counts keep the centre on a lattice corner
    if (cols * rows <= P.MAX_DOTS) break;
    cellPx *= 1.09;
  }
  const trailN = Math.max(8, Math.min(P.TRAIL_MAX, Math.round(P.TRAIL_BUDGET / (cols * rows))));
  buildField(cols, rows, trailN);

  const worldW = vw / pxPerUnit, worldH = vh / pxPerUnit;
  camera.left = -worldW/2; camera.right = worldW/2;
  camera.top  =  worldH/2; camera.bottom = -worldH/2;
  camera.updateProjectionMatrix();
  U.uRmax.value = Math.hypot(worldW, worldH) / 2;`,Q=`const toWorld = (px, py) => new THREE.Vector2(
  (px - innerWidth / 2) / pxPerUnit,
 -(py - innerHeight / 2) / pxPerUnit
);`,J="2 * P.HEAT_R * P.HEAT_R",ee=`  <div class="hero">
    <nav class="nav">
      <a class="brand" href="#"><span class="mark"></span><span class="line" data-text="TIDEFORM">TIDEFORM</span></a>
      <div class="links">
        <a href="#"><span class="line" data-text="Work">Work</span></a>
        <a href="#"><span class="line" data-text="Studio">Studio</span></a>
        <a href="#"><span class="line" data-text="Journal">Journal</span></a>
        <a class="idx" href="#"><span class="line" data-text="Contact ↗">Contact ↗</span></a>
      </div>
    </nav>

    <div class="center">
      <div class="block">
        <p class="eyebrow">Phase Field No. 01 — realtime</p>
        <h1 id="head">
          <span class="line" data-text="Design systems">Design systems</span>
          <span class="line" data-text="that answer back." data-hot="1">that answer back.</span>
        </h1>
        <p class="lede">Tideform builds identities, interfaces and motion for the browser
          — systems that behave like material instead of sitting still in a deck.</p>
        <a class="cta" id="cta" href="#"><span class="line" data-text="See the work">See the work</span>
          <svg width="20" height="8" viewBox="0 0 20 8" fill="none" aria-hidden="true">
            <path d="M0 4h18M14.5 .8 18.2 4l-3.7 3.2" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </a>
      </div>
    </div>

    <div class="foot">
      <p class="meta">.TIDE.FRM**. — phase field no. 01<br>Realtime WebGL · 2.6 second cycle</p>
      <p class="hint"><span class="fine">Move to warm the lattice · <b>click to ignite</b></span><span class="coarse">Drag to warm the lattice · <b>tap to ignite</b></span></p>
    </div>
  </div>

`,x="  let cellPx = Math.min(Math.max(vw / P.COLS_TARGET, P.CELL_PX_MIN), P.CELL_PX_MAX);",te="<title>Tideform — Phase Field</title>",T=e=>JSON.stringify(e,null,2),E=e=>e.map(t=>t.toFixed(3)).join(", "),ne=e=>`
/* ---- the ground the lattice is projected onto -------------------------- */
const CAM = ${T(e)};
/* derived once per layout: T = tan(fov/2), q(d) = qA + d*qB is the distance
   from the eye along the view axis, and GR.unit*q(d) is the world height of
   one lattice row there — the scale every authored length is measured in */
const GR = { H:0, T:0, sin:0, cos:0, qA:0, qB:0, dNear:0, dFar:0, unit:0, aspect:1, syHorizon:0, syTop:0, syBot:0 };

/* the depth of the ground point that lands at screen height sy */
function depthAt(sy){
  const den = GR.sin - sy * GR.T * GR.cos;
  return den <= 1e-5 ? GR.dFar : GR.H * (GR.cos + sy * GR.T * GR.sin) / den;
}
function qAt(d){ return GR.qA + d * GR.qB; }

/* Screen pixels to fractional lattice coordinates — the exact inverse of the
   column and row placement in buildField. */
function toCell(px, py){
  const sx = (px / innerWidth) * 2 - 1;
  const sy = 1 - (py / innerHeight) * 2;
  return new THREE.Vector2(
    (gridCols - 1) * (0.5 + sx / (2 * CAM.OVER)),
    (gridRows - 1) * (GR.syTop - sy) / (GR.syTop - GR.syBot),
  );
}

/* The cursor's reach, in lattice cells. HEAT_R is 66 authored units and one
   lattice cell is CELL of them, so this is the authored glow at the authored
   size — and because the heat texture is keyed by cell, painting it in cells
   is what puts the glow exactly under the pointer. Measuring it on the ground
   plane instead lands it wherever that plane sits *below* the terrain the dot
   under the cursor is standing on, which on a range is most of a screen away. */
function heatSigma2(){
  const R = P.HEAT_R / CELL;
  return 2 * R * R;
}
`,ae=`
    float h21(vec2 p){
      p = fract(p * vec2(127.1, 311.7));
      p += dot(p, p + 41.73);
      return fract(p.x * p.y * 95.43);
    }
    float vn(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(h21(i),                h21(i + vec2(1.0, 0.0)), u.x),
                 mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float qOf(float d){ return uGround.z + d * uGround.w; }   // eye distance along the view axis
    float rowAt(float d){ return uUnit * qOf(d); }            // world height of one lattice row
    float unitAt(float d){ return rowAt(d) / uCell; }         // world size of one authored unit
    /* The distance across the ground between two neighbouring dots. On a plane
       seen almost edge-on this is far larger than the height of a row —
       q(d)/H times larger — and it, not the row height, is what limits the
       detail a world-space fractal can carry before the far rows tear apart. */
    float stepAt(float d){ return rowAt(d) * max(qOf(d) * uStepK, 1.0); }
    /* How much relief a depth can carry. Two neighbouring rows are pulled
       apart on screen by roughly (terrain slope * q), so the height a world
       fractal may reach before the lattice tears falls off as 1/q — however
       few octaves the lod rule has left it. Holding to that exactly flattens
       the middle distance into nothing, so this spends a little over it. */
    float relief(float d){ return pow(qOf(uGround.x) / qOf(d), 0.45); }
    /* how many octaves of a fractal of base frequency f survive at depth d */
    float lodFor(float f, float d){
      return clamp(-log2(max(2.0 * f * stepAt(d), 1e-4)), 0.0, 6.0);
    }
    float fbmL(vec2 p, float f, float lod){
      float a = 0.5, s = 0.0, n = 0.0;
      p *= f;
      for (int i = 0; i < 6; i++){
        s += a * mix(0.5, vn(p), clamp(lod - float(i), 0.0, 1.0));
        n += a; p = p * 2.03 + 17.3; a *= 0.5;
      }
      return s / n;
    }
    float ridgeL(vec2 p, float f, float lod){
      float a = 0.5, s = 0.0, n = 0.0;
      p *= f;
      for (int i = 0; i < 6; i++){
        float v = 1.0 - abs(vn(p) * 2.0 - 1.0);
        s += a * mix(0.36, v * v, clamp(lod - float(i), 0.0, 1.0));
        n += a; p = p * 2.07 + 11.1; a *= 0.5;
      }
      return s / n;
    }
`,A=[ee,""],b=`  /* Every colour uniform here is a raw-component Vector3, the way the authored
     uHot is, so a hex is unpacked the same way rather than going through the
     colour-managed setStyle path that would shift it into linear space. */
  const paint = function (target, hex) {
    if (typeof hex !== 'string' || hex.charAt(0) !== '#') return;
    const h = parseInt(hex.slice(1), 16);
    if (!isFinite(h)) return;
    target.set(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255);
  };`,_=`window.addEventListener('message', function (event) {
  const detail = event.data;
  if (!detail || detail.type !== 'threeui-tideform-controls') return;
  window.__tideformScene(detail.values || {});
});`;function oe(e){const t=e.waveK.toFixed(1);return[A,[c,`${c}

/* ---- ${e.name}: the authored field, stood up as a landscape ---- */
Object.assign(P, ${T(e.P)});
/* one authored unit is CELL_X-and-CELL_Y's worth of lattice, so the dot sizes,
   the radial travel and the cursor's reach keep the proportions they were
   given however coarse or fine the projected grid ends up */
const CELL = (P.CELL_X + P.CELL_Y) / 2;`],[O,`const camera = new THREE.PerspectiveCamera(${e.cam.FOV}, 1, 1, 1e5);
${ne(e.cam)}`],[y,`  uRippleKick:{ value: P.RIPPLE_KICK },
  uGround:    { value: new THREE.Vector4(1, 1, 0, 1) },  // dNear, dFar, H*sin(pitch), cos(pitch)
  uUnit:      { value: 1 },                              // world height of one lattice row per unit of eye distance
  uStepK:     { value: 1 },                              // 1 / eye height: turns a row's height into its reach across the ground
  uCell:      { value: (P.CELL_X + P.CELL_Y) / 2 },      // authored units per lattice cell
  uPersp:     { value: ${e.persp} },                  // how much a dot still shrinks with distance
  uRelief:    { value: 1 },                              // live control: how tall this landscape stands
  uProj:      { value: new THREE.Vector4(1, 1, 1, 0) },  // tan(fov/2), aspect, eye height, sin(pitch)
  uLattice:   { value: new THREE.Vector3(1, 1, -1) },    // overscan, syTop, syBot
  uAir:       { value: new THREE.Vector2(${e.air.join(", ")}) },  // how far the distance dims, and how fast
  uLow:       { value: new THREE.Vector3(${E(e.low)}) },
  uHigh:      { value: new THREE.Vector3(${E(e.high)}) },
};`],[d,`${d}
    uniform vec4  uGround;
    uniform float uUnit, uStepK, uCell, uPersp, uRelief;
    uniform vec4  uProj;
    uniform vec3  uLattice;
    uniform vec2  uAir;
    uniform vec3  uLow, uHigh;`],[U,`      return min(sum, 1.6);
    }
${ae}${e.glsl}
    void main(){`],[g,`${g}
      float depth = max(aBase.y, uGround.x);
      float u1 = unitAt(depth);
      /* The landscape is solved once, up front, because everything the cursor
         touches has to be measured against where this dot is actually drawn
         rather than where its cell would sit on a bare plane. */
      vec2  mat;
      float gh = groundH(aBase, aCell, rn, ti, mat) * uRelief;
      vec4  clip = projectionMatrix * viewMatrix * vec4(aBase.x, gh, -depth, 1.0);
      vec2  ndc  = clip.xy / max(clip.w, 1e-4);
      /* Back down to the flat plane the CPU thinks in: the depth whose bare
         ground lands at this dot's own screen height. Terrain lifts a dot well
         above its own cell, so a cursor answered in cell coordinates alone
         warms whatever is standing behind the thing you are pointing at. */
      float syd   = clamp(ndc.y, uLattice.z, uLattice.y);
      float dFlat = clamp(uProj.z * (uGround.w + syd * uProj.x * uProj.w)
                        / max(uProj.w - syd * uProj.x * uGround.w, 1e-4), uGround.x, uGround.y);
      vec2  gFlat = vec2(ndc.x * uProj.x * uProj.y * qOf(dFlat), dFlat);
      vec2  cFlat = vec2((uHeatSize.x - 1.0) * (0.5 + ndc.x / (2.0 * uLattice.x)),
                         (uHeatSize.y - 1.0) * (uLattice.y - syd) / (uLattice.y - uLattice.z));
      /* The crest still runs outward from the centre, but a ground plane packs
         its far half into the top few rows: rings ruled in plain radius would
         sit a whole screen apart at your feet and pile into moire at the
         horizon. Ruling them in log r spaces them the way perspective does —
         reading closer together with distance, and keeping the same handful of
         dots per ring wherever they are. */
      float wr = ${t} * log(max(r0, uGround.x));`],[F,`      // heat the cursor has painted into this cell, held and cooling on the CPU
      float heat = texture2D(uHeatTex, (cFlat + 0.5) / uHeatSize).r;`],[N,`      vec2 kick;
      float ring = ripples(gFlat, tn, kick);
      vec2 kickH;
      float ringH = ripples(gFlat, uNow, kickH);`],[z,"      float th = TAU * ti / uPeriod - TAU * wr / uLambda + uPhase + uWarm.y * heat;"],[W,"      float thH = TAU * uNow / uPeriod - TAU * wr / uLambda + uPhase + uWarm.y * heat;"],[V,`      vec2  dir = r0 > 0.0001 ? aBase / r0 : vec2(0.0);
      vec2  pv   = gFlat - uPointer;
      float dp   = length(pv);
      vec2  pdir = dp > 0.001 ? pv / dp : vec2(0.0);
      vec2  g    = aBase
                 + (dir * uAmp.x * mix(uAmp.y, uAmp.z, rn) * cos(th)
                 +  pdir * uWarm.z * heat
                 +  kick * uRippleKick) * u1;
      vec3  pos  = vec3(g.x, gh, -max(g.y, uGround.x));`],[P,`      vec3 body = mix(uLow, uHigh, clamp(mat.x, 0.0, 1.0));
      vec3 tint = mix(body, uHot, clamp(amber + 1.5 * min(fireH, 1.0), 0.0, 1.0));
      tint = mix(tint, vec3(1.0), smoothstep(0.92, 1.30, fireH));   // white-hot core
      vCol = tint * bri * mix(1.0, uAir.x, pow(clamp(rn, 0.0, 1.0), uAir.y));`],[D,`      float halfQ = rad + uFeather + 0.5;
      vP    = position.xy * 2.0;
      vR    = rad / halfQ;
      vSoft = uFeather / halfQ;

      /* the authored quad, in authored units, billboarded in view space so a
         dot keeps its round profile however far down the plane it sits */
      vec4 mv = viewMatrix * vec4(pos, 1.0);
      mv.xy += position.xy * 2.0 * halfQ * u1 * pow(uGround.y / depth, uPersp);
      gl_Position = projectionMatrix * mv;`],[X,`      /* every column holds a fixed screen x and every row a fixed screen y,
         so a flat plane renders as exactly the authored lattice */
      const sy = GR.syTop + (GR.syBot - GR.syTop) * (r / Math.max(rows - 1, 1));
      const y  = depthAt(sy);
      const x  = (c - cx) / Math.max(cols - 1, 1) * 2 * CAM.OVER * GR.T * GR.aspect * qAt(y);`],[Z,`  const pitch = CAM.PITCH * Math.PI / 180;
  GR.H = CAM.H;
  GR.T = Math.tan(CAM.FOV * Math.PI / 360);
  GR.sin = Math.sin(pitch); GR.cos = Math.cos(pitch);
  GR.qA = GR.H * GR.sin;    GR.qB = GR.cos;
  GR.aspect = vw / vh;
  GR.syHorizon = GR.sin / (GR.T * GR.cos);
  GR.syBot = CAM.SY_BOT;
  GR.syTop = Math.min(CAM.SY_TOP, GR.syHorizon - 0.02);
  GR.dNear = depthAt(GR.syBot);
  GR.dFar  = depthAt(GR.syTop);

  /* square lattice cells at roughly the authored dot pitch, thinned until the
     grid fits the buffers that were sized for it */
  let cellPx = CAM.CELL_PX, cols, rows;
  for (let i = 0; i < 24; i++){
    rows = Math.max(12, Math.round((GR.syTop - GR.syBot) * vh / (2 * cellPx)) + 1);
    cols = Math.max(12, Math.round(CAM.OVER * vw / cellPx) + 1);
    if (cols * rows <= P.MAX_DOTS) break;
    cellPx *= 1.08;
  }
  pxPerUnit = 1;
  /* one lattice row is (syTop-syBot)/(rows-1) of screen height; at depth d that
     is GR.unit*q(d) of world height */
  GR.unit = (GR.syTop - GR.syBot) / Math.max(rows - 1, 1) * GR.T;

  const trailN = Math.max(4, Math.min(P.TRAIL_MAX, Math.round(P.TRAIL_BUDGET / (cols * rows))));
  buildField(cols, rows, trailN);

  camera.fov = CAM.FOV;
  camera.aspect = GR.aspect;
  camera.near = Math.max(GR.dNear * 0.05, 0.1);
  camera.far  = GR.dFar * 4;
  camera.position.set(0, GR.H, 0);
  camera.rotation.set(-pitch, 0, 0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  /* the accent's radial window and the modulation envelope are both written in
     r/rMax, so rMax is the far edge of the ground rather than of a flat screen */
  U.uRmax.value = GR.dFar;
  U.uGround.value.set(GR.dNear, GR.dFar, GR.qA, GR.qB);
  U.uUnit.value = GR.unit;
  U.uStepK.value = 1 / GR.H;
  U.uProj.value.set(GR.T, GR.aspect, GR.H, GR.sin);
  U.uLattice.value.set(CAM.OVER, GR.syTop, GR.syBot);`],[Q,`const toWorld = (px, py) => {
  const sy = 1 - (py / innerHeight) * 2;
  const d  = Math.min(Math.max(depthAt(Math.min(sy, GR.syHorizon - 0.02)), GR.dNear), GR.dFar);
  return new THREE.Vector2(((px / innerWidth) * 2 - 1) * GR.T * GR.aspect * qAt(d), d);
};`],[q,`      const d = r * cols + c;
      dotXY[d*2] = c; dotXY[d*2+1] = r;`],[K,`const at = new THREE.Vector2(0, 0);          // where the cursor is, in world units
const atCell = new THREE.Vector2(0, 0);      // ... and which lattice cell that is
const was = new THREE.Vector2(0, 0);         // where it was last frame
const wasCell = new THREE.Vector2(0, 0);
let live = false, slot = 0;

function aim(e){
  const p = toWorld(e.clientX, e.clientY);
  const q = toCell(e.clientX, e.clientY);
  if (!live){ was.copy(p); wasCell.copy(q); } // no stroke from the last known spot
  at.copy(p); atCell.copy(q);
  live = true;
}`],[j,"  strike(atCell.x, atCell.y, P.HEAT_STRIKE);"],[Y,"  const ax = wasCell.x, ay = wasCell.y, bx = atCell.x - wasCell.x, by = atCell.y - wasCell.y;"],[$,`  heatPeak = peak;
  was.copy(at); wasCell.copy(atCell);
  heatTex.needsUpdate = true;`],[J,"heatSigma2()","all"],[R,`frame();

/* ---- live controls ----------------------------------------------------- */
const BASE = {
  sizeMin: P.SIZE_MIN, sizeMax: P.SIZE_MAX, cellPx: CAM.CELL_PX,
  period: P.PERIOD, lambda: P.LAMBDA, trail: P.TRAIL_SPAN, briMin: P.BRI_MIN,
};
window.__tideformScene = function (k) {
  U.uSize.value.set(BASE.sizeMin * k.dotSize, BASE.sizeMax * k.dotSize, P.SIZE_GAMMA);
  U.uPeriod.value = BASE.period / Math.max(k.speed, 0.02);
  U.uLambda.value = BASE.lambda / Math.max(k.rings, 0.05);
  U.uTrail.value.y = BASE.trail * k.trail;
  U.uRelief.value = k.relief;
  U.uBri.value.x = k.glow;
${b}
  paint(U.uLow.value, k.ground);
  paint(U.uHot.value, k.accent);
  const px = BASE.cellPx * k.spacing;
  if (Math.abs(CAM.CELL_PX - px) > 1e-4){ CAM.CELL_PX = px; layout(); }
};
${_}
<\/script>`],[te,`<title>Tideform — ${e.name}</title>`]]}const u={MAX_DOTS:8e3,TRAIL_MAX:12,TRAIL_BUDGET:48e3,ENV_EDGE:.34,ENV_POW:1.3,RING:[.05,.15,.62,.94]},re={id:"stone-ridge",name:"Stone Ridge",cam:{H:34,FOV:44,PITCH:13.5,SY_TOP:.5,SY_BOT:-1.06,OVER:1.06,CELL_PX:16},waveK:430,persp:.16,air:[.46,1.28],low:[.86,.56,.32],high:[1,.95,.88],P:{...u,HOT:[1,.5,.14]},glsl:`
    /* A ridged fractal gathered into ranges by a much lower frequency. The
       ranges stand off at a real distance rather than at a row count: almost
       all of the plane's depth lives in the top quarter of the rows, so a mask
       written in rn would put a mountain under the camera. */
    float groundH(vec2 g, vec2 cell, float rn, float t, out vec2 mat){
      float d    = max(g.y, uGround.x);
      float rise = smoothstep(uGround.x * 1.2, uGround.x * 2.6, d);
      float r    = ridgeL(g + vec2(0.0, 620.0), 0.00110, lodFor(0.00110, d));
      float mass = 0.30 + 1.15 * fbmL(g + 2100.0, 0.00042, lodFor(0.00042, d));
      /* the last handful of rows cover hundreds of units of ground each, far
         more than any lod-limited range can step across without tearing the
         lattice; easing those ranges down is what keeps the horizon whole */
      float peak = pow(r, 1.35) * mass * rise * mix(1.0, 0.34, smoothstep(0.88, 1.0, rn));
      /* scree is carried in lattice space, so its grain stays even from the
         front row to the last one the air still shows */
      float scree = (fbmL(cell, 0.30, 4.5) - 0.5) * 1.9 * (1.0 - 0.6 * rn);
      mat.x = clamp(peak * 1.45, 0.0, 1.0);
      mat.y = 0.0;
      return peak * uGround.y * 0.215 * relief(d) + scree * rowAt(d);
    }
`},ie={id:"pine-canopy",name:"Pine Canopy",cam:{H:22,FOV:46,PITCH:12,SY_TOP:.42,SY_BOT:-1.06,OVER:1.06,CELL_PX:15},waveK:400,persp:.14,air:[.46,1.24],low:[.24,.66,.32],high:[.76,1,.46],P:{...u,HOT:[.62,.95,.3]},glsl:`
    /* A closed stand of conifers, placed in lattice space so a crown is always
       a few dots wide at every distance. One fixed cell size, not one that
       grows toward the viewer: a scale that varies per row shears the whole
       tiling sideways and the stand smears into diagonal streaks. The crowns
       are also deliberately shallow — a projected grid pulls its rows apart
       the moment a feature stands more than about two rows high. */
    float crowns(vec2 cell, out float tone){
      vec2  q  = cell / 4.2;
      vec2  id = floor(q);
      float best = 0.0; tone = 0.5;
      for (int j = -1; j <= 1; j++){
        for (int i = -1; i <= 1; i++){
          vec2  c  = id + vec2(float(i), float(j));
          vec2  o  = vec2(h21(c), h21(c + 19.7));
          float k  = h21(c + 5.3);
          vec2  pc = c + 0.14 + 0.72 * o;
          float r  = length((q - pc) * vec2(1.0, 1.25)) / (0.52 + 0.30 * k);
          float v  = pow(max(0.0, 1.0 - r), 0.75) * (0.58 + 0.72 * k);
          if (v > best){ best = v; tone = k; }
        }
      }
      return best;
    }

    float groundH(vec2 g, vec2 cell, float rn, float t, out vec2 mat){
      float d = max(g.y, uGround.x);
      float hills = (0.60 * fbmL(g + 90.0,   0.00095, lodFor(0.00095, d))
                   + 0.40 * ridgeL(g + 620.0, 0.00052, lodFor(0.00052, d)) - 0.44)
                  * uGround.y * 0.30 * relief(d);
      hills *= (0.16 + 1.20 * smoothstep(uGround.x * 1.05, uGround.x * 4.2, d))
             * mix(1.0, 0.34, smoothstep(0.88, 1.0, rn));
      float tone;
      float can  = crowns(cell, tone);
      float sway = 0.14 * sin(t * 1.6 + cell.x * 0.55 + cell.y * 0.31) * can;
      mat.x = clamp(can * 1.25, 0.0, 1.0) * (0.55 + 0.45 * tone);
      mat.y = tone;
      return hills + (can * 1.75 + sway) * rowAt(d);
    }
`},se={id:"open-swell",name:"Open Swell",cam:{H:16,FOV:46,PITCH:11,SY_TOP:.38,SY_BOT:-1.06,OVER:1.06,CELL_PX:14},waveK:380,persp:.13,air:[.46,1.22],low:[.3,.62,1],high:[.93,.99,1],P:{...u,HOT:[.24,.66,1]},glsl:`
    float train(vec2 w, vec2 k, float sp, float t){ return sin(dot(w, k) - t * sp); }

    /* The wave space: the ground distance between neighbouring dots grows like
       q(d), so a swell written in (x/q, log q) keeps the same number of dots
       per wavelength from the front row to the horizon — and because log q
       accelerates toward the horizon, its crests bunch up there the way a real
       swell does. */
    float groundH(vec2 g, vec2 cell, float rn, float t, out vec2 mat){
      float d = max(g.y, uGround.x);
      float q = qOf(d);
      vec2  w = vec2(g.x / q, log(q)) * 26.0;
      float s = train(w, vec2( 0.10, 1.00), 1.05, t)
              + 0.64 * train(w, vec2(-0.46, 0.86), 1.42, t)
              + 0.34 * train(w, vec2( 0.72, 0.52), 1.85, t)
              + 0.19 * train(w, vec2( 0.18, 2.05), 2.35, t);
      s /= 2.17;
      /* glitter is lattice-space, so the sea keeps one fine texture from the
         front row all the way to the horizon */
      float chop = (fbmL(cell + vec2(0.0, t * 6.0), 0.19, 4.0) - 0.5) * 1.8;
      mat.x = clamp((s - 0.30) * 1.35, 0.0, 1.0) * clamp(0.45 + chop, 0.0, 1.0);
      mat.y = 0.0;
      /* the swell keeps a real amplitude near the eye and flattens with
         distance, which is what stops the horizon turning into noise */
      return (s * 4.4 * (0.24 + 0.76 * (1.0 - rn)) + chop * 0.36) * rowAt(d);
    }
`},le={rewrites:[A,[c,`${c}

/* ---- Phase Field: the authored field, with live controls ---- */
let SPACING = 1;   // live control: the authored dot pitch, scaled`],[x,`${x.slice(0,-1)} * SPACING;`],[y,`  uRippleKick:{ value: P.RIPPLE_KICK },
  uBody:      { value: new THREE.Vector3(1, 1, 1) },     // live control: the colour a dot is before the crest warms it
};`],[d,`${d}
    uniform vec3  uBody;`],[P,`      vec3 tint = mix(uBody, uHot, clamp(amber + 1.5 * min(fireH, 1.0), 0.0, 1.0));
      tint = mix(tint, vec3(1.0), smoothstep(0.92, 1.30, fireH));   // white-hot core
      vCol = tint * bri;`],[R,`frame();

/* ---- live controls ----------------------------------------------------- */
const BASE = {
  sizeMin: P.SIZE_MIN, sizeMax: P.SIZE_MAX,
  period: P.PERIOD, lambda: P.LAMBDA, trail: P.TRAIL_SPAN,
};
${b}
window.__tideformScene = function (k) {
  U.uSize.value.set(BASE.sizeMin * k.dotSize, BASE.sizeMax * k.dotSize, P.SIZE_GAMMA);
  U.uPeriod.value = BASE.period / Math.max(k.speed, 0.02);
  U.uLambda.value = BASE.lambda / Math.max(k.rings, 0.05);
  U.uTrail.value.y = BASE.trail * k.trail;
  U.uBri.value.x = k.glow;
  paint(U.uBody.value, k.ground);
  paint(U.uHot.value, k.accent);
  if (Math.abs(SPACING - k.spacing) > 1e-4){ SPACING = k.spacing; layout(); }
};
${_}
<\/script>`]]},ce={"stone-ridge":re,"pine-canopy":ie,"open-swell":se},de={tideform:le.rewrites,...Object.fromEntries(Object.entries(ce).map(([e,t])=>[e,oe(t)]))};function he(e,t){const n=de[t];return n?n.reduce((r,[a,s,l])=>{if(!r.includes(a))throw new Error(`tideform "${t}": anchor missing — ${a.slice(0,72)}`);return l==="all"?r.replaceAll(a,s):r.replace(a,s)},e):e}const ue=Object.freeze({tideform:{title:"Tideform — phase field background",aria:"Interactive lattice of dots with a crest travelling outward from the centre"},"stone-ridge":{title:"Tideform — stone ridge background",aria:"The Tideform phase field seen in perspective over brown stone mountain ranges"},"pine-canopy":{title:"Tideform — pine canopy background",aria:"The Tideform phase field seen in perspective over green forested hills"},"open-swell":{title:"Tideform — open swell background",aria:"The Tideform phase field seen in perspective over a blue ocean swell"}});function pe(e){return he(G,e)}const fe={dotSize:[.4,2],spacing:[.5,2],relief:[0,2],speed:[0,2.5],rings:[.4,2.5],trail:[0,2],glow:[0,.2]},me={dotSize:1,spacing:1,relief:1,speed:1,rings:1,trail:1,glow:.015},ve="/landing-pages/tideform-hero.html";function we(e,t,n){return Math.min(n,Math.max(t,e))}function ge(e,t){e.contentWindow?.postMessage({type:"threeui-tideform-controls",values:t},"*")}function xe({variant:e="tideform",presentation:t="background",dotSize:n,spacing:r,relief:a,speed:s,rings:l,trail:p,glow:f,ground:m,accent:v,...k}){const i=B.includes(e)?e:"tideform",H=h.useMemo(()=>t==="page"&&i==="tideform"?void 0:pe?.(i),[t,i]),L=h.useCallback(S=>{const o=(M,w)=>we(M??me[w],...fe[w]);ge(S,{dotSize:o(n,"dotSize"),spacing:o(r,"spacing"),relief:o(a,"relief"),speed:o(s,"speed"),rings:o(l,"rings"),trail:o(p,"trail"),glow:o(f,"glow"),ground:m,accent:v})},[v,n,f,m,a,l,r,s,p]);return h.createElement(I,{...k,key:i,applyScene:L,backgroundCanvasSelector:t==="background"?"#gl":void 0,backgroundVisualSelector:t==="background"?".scrim":void 0,title:t==="page"&&i==="tideform"?"Tideform — Phase Field":ue[i].title,sourceUrl:ve,srcDoc:H})}function Re(e){return C.jsx(xe,{...e,presentation:"page"})}export{me as TIDEFORM_SCENE_DEFAULTS,xe as TideformHero,Re as TideformPage};
