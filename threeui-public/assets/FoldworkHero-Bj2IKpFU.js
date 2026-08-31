import{r as n,j as l}from"./index-ChUl42DD.js";const g=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Foldwork — Products built to outlast the hype that sold them</title>
<meta name="description" content="Foldwork is a four-person product studio. We design and build the interfaces, systems and internal tooling that founders keep reaching for long after the launch week is over.">
<meta name="theme-color" content="#111111">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23111'/%3E%3Cpath d='M16 6l3.2 6.8L26 16l-6.8 3.2L16 26l-3.2-6.8L6 16l6.8-3.2z' fill='%23fff'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    /* one fluid unit == 1px on the 1440x900 reference frame */
    /* one fluid unit == 1px on the 1440x900 reference frame.  It is allowed to
       go small; the type floors below keep everything legible. */
    --u: clamp(0.42px, min(0.104vw, 0.11111vh), 1.28px);
    --fmin: 11px;
    --ink:#ffffff;
    --bg:#111111;
    --line:rgba(255,255,255,.34);
    --mono:"Geist Mono","SFMono-Regular",ui-monospace,Menlo,monospace;
    --braille:"Apple Braille","Apple Symbols","Segoe UI Symbol","Noto Sans Symbols 2",var(--mono);
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:var(--bg);
    color:var(--ink);
    font-family:"Archivo","Helvetica Neue",Helvetica,Arial,sans-serif;
    font-variation-settings:"wdth" 100,"wght" 400;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    overflow:hidden;
  }
  canvas#gl{position:fixed;inset:0;width:100%;height:100%;display:block;z-index:0}
  #uprobe{position:fixed;top:0;left:0;width:calc(1000*var(--u));height:0;visibility:hidden;pointer-events:none}

  .stage{
    position:fixed;inset:0;z-index:1;pointer-events:none;
    display:flex;flex-direction:column;
    padding:calc(17*var(--u)) calc(48*var(--u)) calc(32*var(--u));
  }
  .stage a,.head .col{pointer-events:auto}

  /* one gradient hairline, painted into the padding ring and masked out of the
     middle, so it sits over any backdrop instead of over a solid fill */
  .gb{position:relative}
  .gb::before{
    content:'';position:absolute;inset:0;border-radius:inherit;
    padding:1px;
    background:var(--gb, linear-gradient(145deg,
      rgba(255,255,255,.72), rgba(255,255,255,.10) 42%,
      rgba(255,255,255,.05) 58%, rgba(255,255,255,.38)));
    -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite:xor; mask-composite:exclude;
    pointer-events:none;transition:opacity .3s ease;
  }

  /* ---------- header ---------- */
  header{
    position:relative;flex:none;
    min-height:calc(40*var(--u));
    display:flex;align-items:center;justify-content:space-between;gap:calc(16*var(--u));
  }
  .wordmark{
    font-size:max(15px, calc(19.5*var(--u)));
    font-variation-settings:"wdth" 100,"wght" 600;
    letter-spacing:-0.018em;
    line-height:1;
    white-space:nowrap;
  }
  nav{
    position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    display:flex;gap:calc(20*var(--u));
    white-space:nowrap;
  }
  nav a,.cta{
    font-family:var(--mono);
    font-size:max(var(--fmin), calc(11.6*var(--u)));
    letter-spacing:0.052em;
    text-transform:uppercase;
    color:var(--ink);
    text-decoration:none;
  }
  nav a{
    display:inline-flex;align-items:baseline;gap:calc(5*var(--u));
    opacity:.9;transition:opacity .25s ease,letter-spacing .4s cubic-bezier(.2,.7,.2,1);
  }
  nav a .bd{
    font-family:var(--braille);font-style:normal;
    display:inline-block;
    width:calc(10*var(--u));
    text-align:center;
    color:rgba(255,255,255,.3);
    transition:color .25s ease;
  }
  nav a:hover{opacity:1;letter-spacing:0.14em}
  nav a:hover .bd{color:#fff}

  .cta{
    position:relative;overflow:hidden;isolation:isolate;
    display:flex;align-items:center;justify-content:center;
    padding:calc(11*var(--u)) calc(22*var(--u));min-height:calc(40*var(--u));
    letter-spacing:0.1em;
    border-radius:calc(11*var(--u));
    background:linear-gradient(160deg, rgba(255,255,255,.15), rgba(255,255,255,.045) 55%, rgba(255,255,255,.09));
    -webkit-backdrop-filter:blur(13px) saturate(150%);
            backdrop-filter:blur(13px) saturate(150%);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.26), 0 calc(1*var(--u)) calc(10*var(--u)) rgba(0,0,0,.4);
    transition:background .35s ease, box-shadow .35s ease;
  }
  /* the light that runs across the glass on hover */
  .cta::after{
    content:'';position:absolute;inset:0;z-index:-1;
    background:linear-gradient(105deg, transparent 30%, rgba(255,255,255,.30) 48%, transparent 66%);
    transform:translateX(-120%);
    transition:transform .75s cubic-bezier(.25,.8,.3,1);
  }
  .cta:hover{
    background:linear-gradient(160deg, rgba(255,255,255,.24), rgba(255,255,255,.08) 55%, rgba(255,255,255,.14));
    box-shadow:inset 0 1px 0 rgba(255,255,255,.4), 0 calc(2*var(--u)) calc(14*var(--u)) rgba(0,0,0,.45);
  }
  .cta:hover::after{transform:translateX(120%)}
  .cta .lbl{font-family:var(--mono);white-space:pre;position:relative;z-index:1}
  /* one fixed cell per character: braille comes from a fallback face with its
     own advances, and without this the button resizes as it decodes */
  .cta .lbl .cell{display:inline-block;width:calc(1ch + 0.1em);text-align:center}

  /* ---------- headline ---------- */
  .head{
    flex:1 1 auto;min-height:0;
    /* the padding biases the optical centre down the way the fixed layout did */
    padding-top:calc(78*var(--u));
    display:flex;align-items:center;justify-content:space-between;gap:calc(24*var(--u));
  }
  .head .col{
    font-size:max(32px, calc(72*var(--u)));
    line-height:1;
    letter-spacing:-0.0167em;
    font-variation-settings:"wdth" 96,"wght" 500;
    white-space:nowrap;
  }
  .head .col.r{text-align:right}
  .head .col > span{display:block}
  .head .ch{
    font-variation-settings:"wdth" var(--w,96),"wght" 500;
    will-change:font-variation-settings,filter;
  }
  .head .col > span{cursor:default}

  /* ---------- bottom row ---------- */
  .foot{flex:none}
  .foot .rule{
    height:1px;margin-bottom:calc(22*var(--u));
    background:linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.20) 14%,
                                      rgba(255,255,255,.20) 86%, rgba(255,255,255,0));
  }
  .foot .row{
    display:flex;align-items:flex-start;justify-content:space-between;gap:calc(36*var(--u));
  }
  .lede{
    max-width:44ch;
    font-size:max(12px, calc(14*var(--u)));
    line-height:1.6;
    color:rgba(255,255,255,.9);
  }
  /* middle: an availability read-out, ticking in braille */
  .status{
    font-family:var(--mono);
    font-size:max(var(--fmin), calc(11.6*var(--u)));
    letter-spacing:0.052em;
    text-transform:uppercase;
    color:rgba(255,255,255,.5);
    padding-top:calc(2*var(--u));
    white-space:nowrap;
  }
  .status .spin{
    font-family:var(--braille);
    display:inline-block;width:calc(13*var(--u));
    color:#fff;
  }
  .status .val{display:block;margin-top:calc(8*var(--u));color:#fff}
  .status .bar{
    display:block;margin-top:calc(9*var(--u));
    font-family:var(--braille);
    color:rgba(255,255,255,.8);
    letter-spacing:0.16em;
    font-size:max(13px, calc(15*var(--u)));
    line-height:1;
  }

  /* right: text first, poster on the outside edge */
  .contact{display:flex;gap:calc(18*var(--u));align-items:flex-start}
  .contact .txt{text-align:right;padding-top:calc(1*var(--u));max-width:26ch}
  .contact p{
    font-size:max(12px, calc(14*var(--u)));
    line-height:1.6;
    color:rgba(255,255,255,.9);
  }
  .contact .txt a{
    display:inline-block;
    margin-top:calc(18*var(--u));
    font-size:max(15px, calc(21*var(--u)));
    letter-spacing:-0.0167em;
    font-variation-settings:"wdth" 100,"wght" 400;
    color:#fff;text-decoration:none;
    padding-bottom:calc(3*var(--u));
    /* gradient rule instead of a flat border */
    background-image:linear-gradient(90deg, rgba(255,255,255,.25), rgba(255,255,255,.95));
    background-size:100% 1px;background-position:0 100%;background-repeat:no-repeat;
    transition:opacity .25s ease, background-image .35s ease;
  }
  .contact .txt a:hover{
    opacity:.85;
    background-image:linear-gradient(90deg, rgba(255,255,255,.95), rgba(255,255,255,.25));
  }
  .thumb{
    display:block;position:relative;flex:none;
    width:calc(100*var(--u));height:calc(100*var(--u));
    border-radius:calc(16*var(--u));
    overflow:hidden;
    background:radial-gradient(120% 100% at 30% 8%, #23262b 0%, #14161a 46%, #0b0c0e 100%);
    --gb:linear-gradient(150deg, rgba(255,255,255,.55), rgba(255,255,255,.07) 44%,
                                 rgba(255,255,255,.03) 62%, rgba(255,255,255,.30));
    box-shadow:0 calc(2*var(--u)) calc(16*var(--u)) rgba(0,0,0,.45);
    transition:transform .5s cubic-bezier(.2,.7,.2,1);
  }
  .thumb:hover{transform:translateY(calc(-2*var(--u)))}
  .thumb canvas{width:100%;height:100%;display:block}

  @media (max-width:980px){
    .status{display:none}
  }
  @media (max-width:760px){
    :root{--u: clamp(0.42px, min(0.155vw, 0.098vh), 0.95px)}
    .head{flex-direction:column;gap:calc(10*var(--u));align-items:flex-start}
    .head .col.r{text-align:left}
    nav{display:none}
    .foot .row{flex-direction:column;align-items:flex-start;gap:calc(26*var(--u))}
    .contact{flex-direction:row-reverse}
    .contact .txt{text-align:left}
  }
</style>
</head>
<body>
<canvas id="gl" aria-hidden="true"></canvas>
<i id="uprobe" aria-hidden="true"></i>

<div class="stage">
  <header>
    <div class="wordmark">Foldwork.</div>
    <nav>
      <a href="#work"><i class="bd" aria-hidden="true">⠿</i>Work</a>
      <a href="#studio"><i class="bd" aria-hidden="true">⠿</i>Studio</a>
      <a href="#approach"><i class="bd" aria-hidden="true">⠿</i>Approach</a>
      <a href="#journal"><i class="bd" aria-hidden="true">⠿</i>Journal</a>
      <a href="#contact"><i class="bd" aria-hidden="true">⠿</i>Contact</a>
    </nav>
    <a class="cta gb" href="#contact"><span class="lbl">Start a project</span></a>
  </header>

  <h1 class="head">
    <span class="col"><span>Products</span> <span>built to</span> <span>outlast</span></span>
    <span class="col r"><span>the hype</span> <span>that sold</span> <span>them</span></span>
  </h1>

  <div class="foot">
    <div class="rule"></div>
    <div class="row">
      <p class="lede">A four-person product studio. We design and build the interfaces, systems and internal tooling that founders keep reaching for long after the launch week is over.</p>

      <div class="status">
        <span class="spin" aria-hidden="true">⠋</span> Availability
        <span class="val">Two slots — Q3</span>
        <span class="bar" aria-hidden="true">⠿⠿⠿⠿⠿⠿⠿⠿</span>
      </div>

      <div class="contact">
        <div class="txt">
          <p>Tell us what you're building and we'll scope it inside a week.</p>
          <a href="mailto:hello@foldwork.studio">hello@foldwork.studio</a>
        </div>
        <a class="thumb gb" href="#work" aria-label="See recent work"><canvas id="thumb" width="220" height="220" aria-hidden="true"></canvas></a>
      </div>
    </div>
  </div>
</div>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ------------------------------------------------------------------ *
 *  Foldwork hero
 *    · a retro perspective corridor above and below, running toward you
 *    · a sphere of sparkle particles with real depth, lit by an internal
 *      disc that tilts toward the pointer
 *    · a variable-width headline that widens under the cursor
 *    · braille read-outs in the nav, the CTA and the availability block
 * ------------------------------------------------------------------ */

/* Every length is in design px: 1 unit == 1px on the 1440x900 frame. */
const P = {
  /* --- particle cloud --- */
  radXY: 292, radZ: 232,           // ellipsoid the dots fill
  step: 38,                        // lattice spacing before jitter
  jitter: 0.42,                    // how far off-lattice each dot sits
  camDist: 820,                    // camera distance, sets the perspective
  spriteMin: 7.2, spriteMax: 25.0, // sprite side at z = 0
  sizePow: 0.5, sizeRef: 2.2,      // how the sprite grows with intensity
  starHalf: 0.135, starAspect: 1.28, starK: 0.8, starEdge: 0.30,
  sqOff: 0.255, sqHalf: 0.072,     // trailing square, in sprite widths
  discR: 0.46, discA: 0.24,        // soft glow disc
  discT0: 1.15, discT1: 2.15,
  fallScale: 1.42, fallPow: 2.2,   // radial falloff inside the ellipsoid
  slabW: 62, slabPow: 2.2,         // the lit disc through the cloud
  baseGain: 0.84, hoverGain: 1.95, hoverLift: 0.2,
  depthNear: 1.85, depthFar: 0.22, // brightness at the front / back of the cloud
  jitStatic: 0.34, jitTime: 0.22,
  drift: 5.5,                      // slow per-dot wander

  /* --- pointer --- */
  hoverIn: 300, hoverOut: 1250,    // stays lit while the pointer is anywhere in the hero
  maxTilt: 1.15, tiltSoft: 175,
  spin: 0.055,                     // idle rotation, rad/s

  /* --- physics (design px, seconds) --- */
  spring: 46, damp: 7.4,           // pull back to the rotating lattice
  pullRel: 1.06, pullK: 5800,      // reach (× the frame diagonal) and strength
                                   // of the cursor's gather
  pullZ: 90,                       // cursor sits this far toward the camera
  burstV: 700, burstR: 300,        // click impulse and its falloff
  burstLift: 0.5, burstSpin: 0.3,
  airDrag: 1.6,                    // almost free fall, just enough to stay in frame
  gravity: 1750, bounce: 0.34, floorMu: 0.72,
  burstMs: 3000, reformMs: 1600,   // how long the pile lies there, then re-forms

  /* --- retro corridor --- */
  gridAlpha: 0.135, gridK: 1150, gridRay: 0.50,
  gridSpeed: 0.62, gridNear: 40, gridFar: 265,
  horizon: 0.5,

  centerY: 0.495, centerYNarrow: 0.185, fieldMulNarrow: 0.6
};

const canvas   = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:false});
renderer.setClearColor(0x111111, 1);
renderer.autoClear = false;

/* ================= background: the running corridor ================= */
const bgScene = new THREE.Scene();
const bgCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const bgU = {
  uRes:   {value: new THREE.Vector2(1,1)},
  uDpr:   {value: 1},
  uScale: {value: 1},
  uT:     {value: 0},
  uGrid:  {value: new THREE.Vector4(P.gridAlpha, P.gridK, P.gridRay, 0)},
  uFade:  {value: new THREE.Vector3(P.gridNear, P.gridFar, P.horizon)}
};

const bgMat = new THREE.ShaderMaterial({
  uniforms: bgU,
  extensions: {derivatives: true},
  vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
  fragmentShader: [
    'precision highp float;',
    'uniform vec2  uRes;',
    'uniform float uDpr, uScale, uT;',
    'uniform vec4  uGrid;',   // alpha, rung k, ray spacing, -
    'uniform vec3  uFade;',   // near, far, horizon fraction
    '',
    'float hash21(vec2 p){',
    '  p = fract(p * vec2(123.34, 456.21));',
    '  p += dot(p, p + 45.32);',
    '  return fract(p.x * p.y);',
    '}',
    '',
    '/* one antialiased line per unit of g */',
    'float rule(float g, float px){',
    '  float d = abs(fract(g - 0.5) - 0.5);',
    '  return 1.0 - smoothstep(0.0, fwidth(g) * px, d);',
    '}',
    '',
    '/* half of the corridor: a plane receding to the horizon */',
    'float plane(vec2 p, vec2 h, float dir){',
    '  float dy = (p.y - h.y) * dir;',
    '  if (dy < 0.75) return 0.0;',
    '  float rung = rule(uGrid.y / dy + uT, 0.85);',      // +uT == running at us
    '  float ray  = rule((p.x - h.x) / dy / uGrid.z, 0.85);',
    '  float fade  = smoothstep(uFade.x, uFade.y, dy)',
    '              * (1.0 - smoothstep(0.82, 1.16, dy / (uRes.y * 0.5)));',
    '  return max(rung, ray * 0.5) * fade;',
    '}',
    '',
    'void main(){',
    '  vec2 fc = gl_FragCoord.xy / (uDpr * uScale);',
    '  vec2 p  = vec2(fc.x, uRes.y - fc.y);',             // design px, y down
    '  vec2 h  = vec2(uRes.x * 0.5, uRes.y * uFade.z);',  // vanishing point
    '  float g = plane(p, h, 1.0) + plane(p, h, -1.0) * 0.72;',
    '  vec3 col = vec3(0.06667) + vec3(g * uGrid.x);',
    '  col += (hash21(gl_FragCoord.xy * 0.7) - 0.5) * (1.6 / 255.0);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\\n')
});
bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2), bgMat));

/* ================= foreground: the particle sphere ================= */
const fxScene = new THREE.Scene();
const fxCam   = new THREE.PerspectiveCamera(50, 1, 1, 4000);
fxCam.position.z = P.camDist;

const cloud = new THREE.Group();
fxScene.add(cloud);

const fxU = {
  uDpr:    {value: 1},
  uScale:  {value: 1},
  uT:      {value: 0},
  uHover:  {value: 0},
  uChaos:  {value: 0},
  uCamD:   {value: P.camDist},
  uRad:    {value: new THREE.Vector3(P.radXY, P.radZ, 0)},
  uFall:   {value: new THREE.Vector2(P.fallScale, P.fallPow)},
  uSlab:   {value: new THREE.Vector2(P.slabW, P.slabPow)},
  uGain:   {value: new THREE.Vector3(P.baseGain, P.hoverGain, P.hoverLift)},
  uSprite: {value: new THREE.Vector4(P.spriteMin, P.spriteMax, P.sizePow, P.sizeRef)},
  uJit:    {value: new THREE.Vector3(P.jitStatic, P.jitTime, P.drift)},
  uDepth:  {value: new THREE.Vector2(P.depthNear, P.depthFar)},
  uStar:   {value: new THREE.Vector4(P.starHalf, P.starAspect, P.starK, P.starEdge)},
  uSq:     {value: new THREE.Vector2(P.sqOff, P.sqHalf)},
  uDisc:   {value: new THREE.Vector4(P.discR, P.discA, P.discT0, P.discT1)}
};

/* The lattice is the dots' *structure* — it never moves, and the shader reads
   brightness from it.  A separate world-space position is simulated on the CPU
   so the dots can be gathered by the cursor, blown apart and dropped.        */
let dotCount = 0;
let home, sim, vel, posAttr, rest2;

(function buildCloud(){
  let seed = 20260823;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

  const h = [], seedA = [];
  const R = P.radXY, RZ = P.radZ, step = P.step, j = P.jitter;
  for (let x = -R; x <= R; x += step)
    for (let y = -R; y <= R; y += step)
      for (let z = -RZ; z <= RZ; z += step){
        const jx = x + (rnd() - 0.5) * step * j;
        const jy = y + (rnd() - 0.5) * step * j;
        const jz = z + (rnd() - 0.5) * step * j;
        if (Math.hypot(jx / R, jy / R, jz / RZ) > 1.0) continue;
        h.push(jx, jy, jz);
        seedA.push(rnd(), rnd(), rnd());
      }
  dotCount = h.length / 3;
  home = new Float32Array(h);
  sim  = new Float32Array(home);
  vel  = new Float32Array(dotCount * 3);
  rest2 = new Float32Array(dotCount);
  for (let i = 0; i < dotCount; i++) rest2[i] = rnd() * 22;

  const geo = new THREE.BufferGeometry();
  /* BufferAttribute keeps the array we hand it; Float32BufferAttribute copies,
     which would leave the simulation writing to a detached buffer */
  posAttr = new THREE.BufferAttribute(sim, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('aHome', new THREE.Float32BufferAttribute(home, 3));
  geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seedA, 3));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6000);

  const mat = new THREE.ShaderMaterial({
    uniforms: fxU,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: [
      'attribute vec3 aHome;',
      'attribute vec3 aSeed;',
      'uniform float uDpr, uScale, uT, uHover, uCamD, uChaos;',
      'uniform vec3  uRad;',      // rxy, rz, -
      'uniform vec2  uFall;',     // falloff scale, pow
      'uniform vec2  uSlab;',     // half width, pow
      'uniform vec3  uGain;',     // base, slab gain, flat lift
      'uniform vec4  uSprite;',   // min, max, pow, ref
      'uniform vec3  uJit;',      // static, temporal, drift
      'uniform vec2  uDepth;',    // near gain, far gain
      'varying float vLum;',
      'varying float vI;',
      '',
      'void main(){',
      '  /* brightness comes from where the dot *belongs*, so the cloud keeps its',
      '     shading while the simulation drags the dot somewhere else */',
      '  vec3 q = aHome;',
      '  float rad  = length(vec3(q.xy / uRad.x, q.z / uRad.y));',
      '  float base = exp(-pow(max(rad, 1e-4) * uFall.x, uFall.y));',
      '',
      '  /* the lit disc lives in the cloud own space, so tilting the cloud is',
      '     what turns the glow from a face-on blob into a narrow band */',
      '  float slab = exp(-pow(abs(q.z) / uSlab.x, uSlab.y));',
      '',
      '  float tw  = sin(uT * (0.45 + 1.15 * aSeed.y) + aSeed.x * 6.2831);',
      '  float jit = 1.0 + uJit.x * (aSeed.z - 0.5) * 2.0 + uJit.y * tw;',
      '',
      '  vec4  mv   = modelViewMatrix * vec4(position, 1.0);',
      '  float dist = max(-mv.z, 1.0);',
      '  float dn   = clamp((dist - (uCamD - uRad.y)) / (2.0 * uRad.y), 0.0, 1.0);',
      '  float depth = mix(uDepth.x, uDepth.y, dn);',
      '',
      '  float I = base * (uGain.x + uHover * (uGain.z + uGain.y * slab)) * jit * depth;',
      '  I = mix(I, (0.55 + 0.85 * aSeed.z) * depth, uChaos);   // scattered dots light evenly',
      '  vI   = I;',
      '  vLum = clamp(I, 0.0, 1.0);',
      '',
      '  float sz = mix(uSprite.x, uSprite.y, pow(clamp(I / uSprite.w, 0.0, 1.0), uSprite.z));',
      '  gl_PointSize = max(sz * uScale * uDpr * (uCamD / dist), 1.5);',
      '  gl_Position  = projectionMatrix * mv;',
      '}'
    ].join('\\n'),
    fragmentShader: [
      'precision highp float;',
      'uniform vec4 uStar;',   // half, aspect, k, edge
      'uniform vec2 uSq;',     // offset, half
      'uniform vec4 uDisc;',   // radius, alpha, t0, t1
      'varying float vLum;',
      'varying float vI;',
      '',
      'void main(){',
      '  if (vLum < 0.012) discard;',
      '  vec2 q = gl_PointCoord - 0.5;',
      '  q.y = -q.y;',
      '',
      '  /* concave four-point star */',
      '  vec2  a  = max(abs(q) / vec2(uStar.x, uStar.x * uStar.y), 1e-4);',
      '  float sf = pow(a.x, uStar.z) + pow(a.y, uStar.z);',
      '  float star = 1.0 - smoothstep(1.0 - uStar.w, 1.0 + uStar.w, sf);',
      '',
      '  /* the little square that trails it */',
      '  vec2  so = abs(q - vec2(uSq.x, 0.0)) - vec2(uSq.y);',
      '  float sq = 1.0 - smoothstep(-0.035, 0.035, max(so.x, so.y));',
      '',
      '  /* soft disc, only once a dot is genuinely hot */',
      '  float dR   = uDisc.x * smoothstep(uDisc.z, uDisc.w, vI);',
      '  float disc = dR > 0.03',
      '    ? (1.0 - smoothstep(dR - 0.10, dR + 0.05, length(q))) * uDisc.y',
      '    : 0.0;',
      '',
      '  float l = clamp(max(star, sq * 0.96) + disc, 0.0, 1.0) * vLum;',
      '  if (l < 0.004) discard;',
      '  gl_FragColor = vec4(vec3(l), l);',
      '}'
    ].join('\\n')
  });
  cloud.add(new THREE.Points(geo, mat));
})();

/* ================= pointer & viewport ================= */
const pointer = {x:-1e4, y:-1e4, has:false};
const coarse  = matchMedia('(hover: none)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let scale = 1, fieldMul = 1, centerY = P.centerY;
let cloudY = 0, floorY = -450, viewW = 1440, viewH = 900;
let hover = 0, rotX = 0, rotY = 0, spin = 0;
let firstMove = 0, lastMove = 0;

addEventListener('pointermove', e => {
  pointer.x = e.clientX; pointer.y = e.clientY; pointer.has = true;
  lastMove = performance.now();
  if (!firstMove && !coarse) firstMove = lastMove;
}, {passive:true});
/* the pointer really has left only when it leaves the document itself */
document.addEventListener('mouseout', e => {
  if (!e.relatedTarget) pointer.has = false;
}, {passive:true});
addEventListener('blur', () => { pointer.has = false; });

function resize(){
  const w = innerWidth, h = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);

  // CSS owns the fluid unit; read it back so the scene scales with the type
  scale = document.getElementById('uprobe').getBoundingClientRect().width / 1000 || 1;
  const dw = w / scale, dh = h / scale;

  const narrow = w < 760;
  fieldMul = narrow ? P.fieldMulNarrow : Math.min(1, Math.max(0.62, dw / 1440));
  centerY  = narrow ? P.centerYNarrow : P.centerY;

  bgU.uRes.value.set(dw, dh);
  bgU.uDpr.value = dpr; bgU.uScale.value = scale;

  /* a vertical fov that maps one design px to one design px at z = 0 */
  fxCam.fov = 2 * Math.atan((dh * 0.5) / P.camDist) * 180 / Math.PI;
  fxCam.aspect = w / h;
  fxCam.updateProjectionMatrix();
  /* the sim runs in world design px, so the group stays at identity and the
     lattice is scaled per-particle instead */
  cloudY = (0.5 - centerY) * dh;
  floorY = -dh * 0.5 + 118;   // high enough that the whole pile stays in frame
  viewW = dw; viewH = dh;

  fxU.uDpr.value = dpr;
  fxU.uScale.value = scale * fieldMul;
}
addEventListener('resize', resize);

/* ================= particle physics =================
   idle   · spring to the rotating lattice, gathered by the cursor
   burst  · a click blows them out, gravity takes over, the floor catches them
   reform · after a rest they float back into place                        */
const MODE = {IDLE:0, BURST:1, REFORM:2};
let mode = MODE.IDLE, modeT = 0, chaos = 0;
const rotM = new THREE.Matrix4();
const rotE = new THREE.Euler();

function burst(sx, sy){
  if (mode === MODE.BURST) return;
  mode = MODE.BURST; modeT = 0;
  const bx = sx / scale - viewW * 0.5;
  const by = -(sy / scale - viewH * 0.5);
  for (let i = 0; i < dotCount; i++){
    const o = i * 3;
    let dx = sim[o] - bx, dy = sim[o+1] - by, dz = sim[o+2] - 40;
    let d = Math.hypot(dx, dy, dz) || 1;
    dx /= d; dy /= d; dz /= d;
    const f = P.burstV / (1 + (d / P.burstR) * (d / P.burstR));
    vel[o]   += dx * f + (Math.random() - 0.5) * 130;
    vel[o+1] += dy * f + P.burstLift * f + (Math.random() - 0.5) * 130;
    vel[o+2] += dz * f * P.burstSpin + (Math.random() - 0.5) * 130;
  }
  gridKick = 1;
}

function stepPhysics(dt, t){
  rotE.set(rotX, rotY + spin, 0);
  rotM.makeRotationFromEuler(rotE);
  const e = rotM.elements;

  /* touch has no hover, so a tap must not latch the gather on forever */
  const pulling = pointer.has && mode === MODE.IDLE && !coarse;
  const mx = pulling ? pointer.x / scale - viewW * 0.5 : 0;
  const my = pulling ? -(pointer.y / scale - viewH * 0.5) : 0;
  const mz = P.pullZ;

  /* the reach is a fraction of the frame, and the strength tracks the cloud's
     own scale, so the gather feels the same on any screen */
  const pullR = P.pullRel * Math.hypot(viewW, viewH);
  const pullK = P.pullK * fieldMul;

  const k = mode === MODE.REFORM ? P.spring * 0.55 : P.spring;
  const c = mode === MODE.BURST ? P.airDrag
          : mode === MODE.REFORM ? P.damp * 1.25 : P.damp;
  const grav = mode === MODE.BURST ? P.gravity : 0;
  const rest = Math.pow(0.02, dt);      // friction once a dot is lying down

  for (let i = 0; i < dotCount; i++){
    const o = i * 3;
    let ax = 0, ay = 0, az = 0;

    if (mode !== MODE.BURST){
      /* target: the lattice, rotated, drifting, scaled to the frame */
      const hx = home[o] * fieldMul, hy = home[o+1] * fieldMul, hz = home[o+2] * fieldMul;
      const ph = home[o] * 0.013 + home[o+2] * 0.021;
      const tx = e[0]*hx + e[4]*hy + e[8]*hz  + P.drift * Math.sin(t * 0.31 + ph);
      const ty = e[1]*hx + e[5]*hy + e[9]*hz  + P.drift * Math.sin(t * 0.27 + ph * 1.7) + cloudY;
      const tz = e[2]*hx + e[6]*hy + e[10]*hz + P.drift * Math.sin(t * 0.23 + ph * 2.3);
      ax += (tx - sim[o])   * k;
      ay += (ty - sim[o+1]) * k;
      az += (tz - sim[o+2]) * k;
    }

    if (pulling){
      /* falls off with distance, not distance squared, so the pull still
         carries to the far corners of the hero */
      const dx = mx - sim[o], dy = my - sim[o+1], dz = mz - sim[o+2];
      const d2 = dx*dx + dy*dy + dz*dz;
      const d  = Math.sqrt(d2 + 900);
      const g  = pullK / (1 + d / pullR) / d;
      ax += dx * g; ay += dy * g; az += dz * g;
    }

    ay -= grav;
    ax -= vel[o]   * c; ay -= vel[o+1] * c; az -= vel[o+2] * c;

    vel[o]   += ax * dt; vel[o+1] += ay * dt; vel[o+2] += az * dt;
    sim[o]   += vel[o]   * dt;
    sim[o+1] += vel[o+1] * dt;
    sim[o+2] += vel[o+2] * dt;

    const fy = floorY + rest2[i];          // a shallow drift, not one flat plane
    if (mode === MODE.BURST && sim[o+1] <= fy){
      sim[o+1] = fy;
      if (vel[o+1] < 0){
        vel[o+1] = -vel[o+1] * P.bounce;
        vel[o]   *= P.floorMu;
        vel[o+2] *= P.floorMu;
        if (vel[o+1] < 30) vel[o+1] = 0;
      }
      vel[o]   *= rest;                 // and they stop sliding
      vel[o+2] *= rest;
    }
  }
  posAttr.needsUpdate = true;
}

/* a click anywhere that isn't a link scatters the cloud */
addEventListener('pointerdown', e => {
  if (e.target.closest && e.target.closest('a')) return;
  burst(e.clientX, e.clientY);
});

/* ================= headline: width under the cursor ================= */
const headEl = document.querySelector('.head');
let letters = [];
let headHover = 0, headTarget = 0;

function splitHeadline(){
  letters = [];
  headEl.querySelectorAll('.col > span').forEach(line => {
    const node = line.firstChild;
    if (!node || node.nodeType !== 3) return;
    const text = node.nodeValue;

    /* natural offsets first: per-letter spans drop the kerning pairs, so we
       measure where each glyph really sits and hand the gap back as a margin */
    const range = document.createRange();
    const natural = [];
    for (let i = 0; i < text.length; i++){
      range.setStart(node, i); range.setEnd(node, i + 1);
      natural.push(range.getBoundingClientRect().left);
    }

    line.textContent = '';
    const spans = [...text].map(ch => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      line.appendChild(s);
      return s;
    });

    const x0 = spans[0].getBoundingClientRect().left;
    for (let i = 1; i < spans.length; i++){
      const want = natural[i] - natural[0];
      const got  = spans[i].getBoundingClientRect().left - x0;
      const d = want - got;
      if (Math.abs(d) > 0.02) spans[i].style.marginLeft = d.toFixed(3) + 'px';
    }
    line._t0 = -1e9; line._entrance = false;
    spans.forEach((s, i) => {
      s._w = 96; s._i = i; s._line = line; s._b = 0; s._rev = false;
      s.style.opacity = '0';
      letters.push(s);
    });

    /* hovering a line runs the same decode the CTA does */
    line.addEventListener('pointerenter', () => {
      if (performance.now() - line._t0 > REVEAL_MS + 500) startReveal(line, false);
    });
  });

  /* entrance: the two columns resolve out of the blur, one line after another */
  const lines = [...headEl.querySelectorAll('.col > span')];
  lines.forEach((line, i) => setTimeout(() => startReveal(line, true), i * 110));
}

const REVEAL_MS = 720;
const STAGGER   = 26;      // ms between neighbouring letters

function updateHeadline(now){
  if (!letters.length) return;
  const sigma = 118 * scale;
  const active = headHover > 0.002;

  /* read first, write second: interleaving them forces a layout per letter */
  if (active) for (const s of letters) s._r = s.getBoundingClientRect();

  for (const s of letters){
    const line = s._line;

    /* 1. width follows the cursor */
    let w = 96;
    if (active){
      const r = s._r;
      const dx = (r.left + r.width * 0.5) - pointer.x;
      const dy = (r.top + r.height * 0.5) - pointer.y;
      const f = Math.exp(-(dx * dx + dy * dy * 0.5) / (sigma * sigma));
      w = 96 + 29 * f * headHover;
    }

    /* 2. the same decode the CTA runs: each letter resolves out of a blur,
       left to right.  The first pass also fades in; re-triggers only blur. */
    let b = 0;
    if (s._rev){
      const p = ((now - line._t0) - s._i * STAGGER) / REVEAL_MS;
      if (p >= 1){
        s._rev = false;
        s.style.opacity = '';
        s.style.filter = '';
        s._b = 0;
      } else {
        const e = Math.max(0, Math.min(1, p));
        const q = 1 - Math.pow(1 - e, 3);
        b = (1 - q) * 15;
        w += (1 - q) * 22 * (0.4 + 0.6 * Math.sin(s._i * 2.4));  // letters settle unevenly
        if (line._entrance) s.style.opacity = q.toFixed(3);
      }
    }

    const bq = Math.round(b * 4) / 4;
    if (bq !== s._b){
      s._b = bq;
      s.style.filter = bq > 0 ? 'blur(' + bq + 'px)' : '';
    }
    const wq = Math.round(w);
    if (wq !== s._w){ s._w = wq; s.style.setProperty('--w', wq); }
  }
}

function startReveal(line, entrance){
  line._t0 = performance.now();
  line._entrance = !!entrance;
  for (const s of letters) if (s._line === line) s._rev = true;
}
headEl.querySelectorAll('.col').forEach(col => {
  col.addEventListener('pointerenter', () => { headTarget = 1; });
  col.addEventListener('pointerleave', () => { headTarget = 0; });
});

/* ================= braille read-outs ================= */
const SPIN   = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
const SCRAM  = '⠁⠂⠄⠈⠐⠠⡀⢀⠃⠉⠘⠰⠔⠒⠤⠶⠿⣿';
const BARSET = '⠀⢀⢠⢰⢸⣸⣼⣾⣿';

const spinEl = document.querySelector('.status .spin');
const barEl  = document.querySelector('.status .bar');
const navDots = [...document.querySelectorAll('nav a')].map(a => ({
  a, el: a.querySelector('.bd'), t0: 0, on: false
}));
navDots.forEach(d => {
  d.a.addEventListener('pointerenter', () => { d.on = true; d.t0 = performance.now(); });
  d.a.addEventListener('pointerleave', () => { d.on = false; d.el.textContent = '⠿'; });
});

/* the CTA decodes itself out of braille on hover */
const ctaEl   = document.querySelector('.cta .lbl');
const ctaText = ctaEl.textContent;
const ctaCells = (() => {
  ctaEl.textContent = '';
  return [...ctaText].map(ch => {
    const el = document.createElement('span');
    el.className = 'cell';
    el.textContent = ch;
    ctaEl.appendChild(el);
    return el;
  });
})();
const CTA_MS  = 820;                       // wall-clock, so 120Hz reads the same as 60
let ctaT0 = -1;
document.querySelector('.cta').addEventListener('pointerenter', () => {
  if (ctaT0 < 0) ctaT0 = performance.now();
});

function braille(now){
  const t = now / 1000;
  if (spinEl) spinEl.textContent = SPIN[Math.floor(t * 11) % SPIN.length];

  if (barEl){
    let s = '';
    for (let i = 0; i < 8; i++){
      const v = 0.5 + 0.5 * Math.sin(t * 2.1 - i * 0.55);
      s += BARSET[Math.min(BARSET.length - 1, Math.floor(v * BARSET.length))];
    }
    barEl.textContent = s;
  }

  for (const d of navDots){
    if (!d.on) continue;
    d.el.textContent = SPIN[Math.floor((now - d.t0) / 62) % SPIN.length];
  }

  if (ctaT0 >= 0){
    const p = (now - ctaT0) / CTA_MS;
    const settled = Math.pow(p, 2.4) * (ctaText.length + 2);   // hold the scramble, then resolve fast
    const tick = Math.floor((now - ctaT0) / 45);
    const done = p >= 1;
    for (let i = 0; i < ctaCells.length; i++){
      const c = ctaText[i];
      ctaCells[i].textContent = (done || c === ' ' || i < settled)
        ? c : SCRAM[(i * 7 + tick) % SCRAM.length];
    }
    if (done) ctaT0 = -1;
  }
}

/* ================= main loop ================= */
function smooth(a, b, x){
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

let last = performance.now();
let gridT = 0, gridKick = 0;
function frame(now){
  const dt = Math.min((now - last) / 1000, 0.1); last = now;
  const w = innerWidth / scale, h = innerHeight / scale;
  const cx = w * 0.5, cy = h * centerY;

  let pRotX = 0, pRotY = 0, pHover = 0;
  if (pointer.has){
    const px = pointer.x / scale, py = pointer.y / scale;
    pHover = 1 - smooth(P.hoverIn, P.hoverOut, Math.hypot(px - cx, py - cy));
    const ox = (px - cx) / P.tiltSoft;
    const oy = (py - cy) / P.tiltSoft;
    pRotY = P.maxTilt * ox / Math.sqrt(1 + ox * ox);
    pRotX = P.maxTilt * oy / Math.sqrt(1 + oy * oy);
  }

  /* a slow breath whenever nobody is driving */
  let amb = coarse || !firstMove ? 1 : smooth(3.5, 7.0, (now - lastMove) / 1000);
  if (reduceMotion) amb = 0;

  let tRotX = pRotX, tRotY = pRotY, target = pHover;
  if (amb > 0){
    const t = now / 1000;
    tRotY = pRotY + (Math.sin(t * 0.42) * 0.55 - pRotY) * amb;
    tRotX = pRotX + (Math.cos(t * 0.31) * 0.30 - pRotX) * amb;
    target = pHover + ((0.55 + 0.16 * Math.sin(t * 0.55)) - pHover) * amb;
  }

  const kr = 1 - Math.pow(0.0015, dt);
  const kh = 1 - Math.pow(0.02,   dt);
  rotX += (tRotX - rotX) * kr;
  rotY += (tRotY - rotY) * kr;
  hover += (target - hover) * kh;
  spin  += (reduceMotion ? 0 : P.spin) * dt;

  /* --- particles --- */
  modeT += dt;
  if (mode === MODE.BURST && modeT > P.burstMs / 1000){ mode = MODE.REFORM; modeT = 0; }
  if (mode === MODE.REFORM && modeT > P.reformMs / 1000){ mode = MODE.IDLE; modeT = 0; }
  const wantChaos = mode === MODE.BURST ? 1 : (mode === MODE.REFORM ? 0.35 : 0);
  chaos += (wantChaos - chaos) * (1 - Math.pow(mode === MODE.BURST ? 0.0001 : 0.06, dt));
  stepPhysics(dt, reduceMotion ? 0 : now / 1000);

  /* the corridor takes a kick when the cloud goes off */
  gridKick *= Math.pow(0.12, dt);
  if (!reduceMotion) gridT += P.gridSpeed * (1 + gridKick * 5) * dt;
  bgU.uT.value = gridT;
  fxU.uT.value = reduceMotion ? 0 : now / 1000;
  fxU.uHover.value = hover;
  fxU.uChaos.value = chaos;

  headHover += (headTarget - headHover) * (1 - Math.pow(0.008, dt));
  updateHeadline(now);

  braille(now);
  crystal(now);

  renderer.clear();
  renderer.render(bgScene, bgCam);
  renderer.render(fxScene, fxCam);
  requestAnimationFrame(frame);
}

resize();
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
  splitHeadline();
  resize();
});
requestAnimationFrame(frame);

/* ---------------- contact tile: a 3D crystal ----------------
   A double-terminated hexagonal crystal, projected and shaded facet by facet
   on a 2D canvas — painter's algorithm, back faces first so it reads as glass. */
const crystal = (function(){
  const c = document.getElementById('thumb');
  const g = c.getContext('2d');
  const N = c.width;

  /* geometry: hexagonal prism with a pyramid at each end */
  const R = 0.235, H1 = 0.17, H2 = 0.435;
  const V = [];
  for (let i = 0; i < 6; i++){
    const a = i / 6 * Math.PI * 2 + Math.PI / 6;
    V.push([Math.cos(a) * R,  H1, Math.sin(a) * R]);
  }
  for (let i = 0; i < 6; i++){
    const a = i / 6 * Math.PI * 2 + Math.PI / 6;
    V.push([Math.cos(a) * R, -H1, Math.sin(a) * R]);
  }
  V.push([0,  H2, 0]);   // 12 top apex
  V.push([0, -H2, 0]);   // 13 bottom apex

  const F = [];
  for (let i = 0; i < 6; i++){
    const j = (i + 1) % 6;
    F.push([12, i, j]);              // upper termination
    F.push([i, j, j + 6, i + 6]);    // prism wall
    F.push([13, j + 6, i + 6]);      // lower termination
  }

  const L = (() => { const v = [-0.46, 0.66, 0.60], m = Math.hypot(v[0], v[1], v[2]);
                     return [v[0]/m, v[1]/m, v[2]/m]; })();

  function draw(rotX, rotY){
    g.clearRect(0, 0, N, N);

    /* the tile's own light: a soft pool behind the stone */
    const halo = g.createRadialGradient(N*0.5, N*0.47, 0, N*0.5, N*0.47, N*0.46);
    halo.addColorStop(0,   'rgba(255,255,255,.16)');
    halo.addColorStop(0.45,'rgba(255,255,255,.05)');
    halo.addColorStop(1,   'rgba(255,255,255,0)');
    g.fillStyle = halo; g.fillRect(0, 0, N, N);

    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const foc = 2.6, cxN = N * 0.5, cyN = N * 0.5;

    const P = V.map(v => {
      let [x, y, z] = v;
      let x1 =  x * cy + z * sy, z1 = -x * sy + z * cy;   // yaw
      let y2 =  y * cx - z1 * sx, z2 = y * sx + z1 * cx;  // pitch
      const s = foc / (foc - z2);
      return {x: x1, y: y2, z: z2, sx: cxN + x1 * s * N, sy: cyN - y2 * s * N};
    });

    const faces = F.map(f => {
      const a = P[f[0]], b = P[f[1]], c2 = P[f[2]];
      const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
      const vx = c2.x - a.x, vy = c2.y - a.y, vz = c2.z - a.z;
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const m = Math.hypot(nx, ny, nz) || 1; nx /= m; ny /= m; nz /= m;
      const zc = f.reduce((t, k) => t + P[k].z, 0) / f.length;
      const front = nz > 0;
      if (!front){ nx = -nx; ny = -ny; nz = -nz; }
      return {f, nx, ny, nz, zc, front};
    }).sort((a, b) => a.zc - b.zc);

    /* the back of the stone first, dimmed, then the front over it */
    for (const face of faces){
      const pts = face.f.map(k => P[k]);
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const p of pts){ x0 = Math.min(x0, p.sx); y0 = Math.min(y0, p.sy);
                            x1 = Math.max(x1, p.sx); y1 = Math.max(y1, p.sy); }

      const dif = Math.max(face.nx * L[0] + face.ny * L[1] + face.nz * L[2], 0);
      const fres = Math.pow(1 - Math.abs(face.nz), 2.6);          // edge-on facets flare
      const spec = Math.pow(dif, 26);

      let lo, hi, alpha;
      if (face.front){
        lo = 0.10 + 0.42 * dif * dif + 0.30 * fres;
        hi = 0.24 + 0.74 * dif + 0.34 * fres + 0.55 * spec;
        alpha = 0.90;
      } else {
        lo = 0.05 + 0.18 * dif;                                    // light through the body
        hi = 0.12 + 0.34 * dif;
        alpha = 0.42;
      }
      const grd = g.createLinearGradient(x0, y0, x1, y1);
      const t = v => 'rgba(255,255,255,' + Math.min(1, Math.max(0, v)).toFixed(3) + ')';
      grd.addColorStop(0, t(hi * alpha));
      grd.addColorStop(0.55, t(lo * alpha));
      grd.addColorStop(1, t((lo * 0.7 + hi * 0.3) * alpha));

      g.beginPath();
      g.moveTo(pts[0].sx, pts[0].sy);
      for (let k = 1; k < pts.length; k++) g.lineTo(pts[k].sx, pts[k].sy);
      g.closePath();
      g.fillStyle = grd; g.fill();

      g.strokeStyle = 'rgba(255,255,255,' + (face.front ? 0.10 + 0.55 * fres : 0.05).toFixed(3) + ')';
      g.lineWidth = face.front ? 1 : 0.75;
      g.stroke();
    }

    /* a glint on the upper-left shoulder — clipped to the stone's silhouette,
       which for a convex solid is just the hull of its projected vertices */
    const hull = (() => {
      const pts = P.map(p => [p.sx, p.sy]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cross = (o, a, b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
      const lo = [], up = [];
      for (const p of pts){ while (lo.length >= 2 && cross(lo[lo.length-2], lo[lo.length-1], p) <= 0) lo.pop(); lo.push(p); }
      for (let i = pts.length - 1; i >= 0; i--){ const p = pts[i];
        while (up.length >= 2 && cross(up[up.length-2], up[up.length-1], p) <= 0) up.pop(); up.push(p); }
      lo.pop(); up.pop(); return lo.concat(up);
    })();
    g.save();
    g.beginPath(); g.moveTo(hull[0][0], hull[0][1]);
    for (let k = 1; k < hull.length; k++) g.lineTo(hull[k][0], hull[k][1]);
    g.closePath(); g.clip();
    const gl = g.createRadialGradient(N*0.40, N*0.30, 0, N*0.40, N*0.30, N*0.22);
    gl.addColorStop(0, 'rgba(255,255,255,.50)');
    gl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gl; g.fillRect(0, 0, N, N);
    g.restore();

    /* the light it throws on the floor of the tile */
    g.save();
    g.translate(N*0.5, N*0.88); g.scale(1, 0.24);
    const sh = g.createRadialGradient(0, 0, 0, 0, 0, N*0.30);
    sh.addColorStop(0, 'rgba(255,255,255,.20)');
    sh.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.beginPath(); g.arc(0, 0, N*0.30, 0, 6.2832); g.fill();
    g.restore();

    /* grain, so it sits in the same world as the rest of the page */
    g.globalAlpha = 0.04;
    for (let n = 0; n < 1400; n++){
      g.fillStyle = Math.random() < 0.5 ? '#fff' : '#000';
      g.fillRect(Math.random() * N, Math.random() * N, 1, 1);
    }
    g.globalAlpha = 1;
  }

  const REST_X = -0.30, REST_Y = 0.55, SPIN_MS = 1250;
  let t0 = -1;
  draw(REST_X, REST_Y);

  document.querySelector('.thumb').addEventListener('pointerenter', () => {
    if (t0 < 0) t0 = performance.now();
  });

  return function tick(now){
    if (t0 < 0) return;
    const p = (now - t0) / SPIN_MS;
    if (p >= 1){ draw(REST_X, REST_Y); t0 = -1; return; }
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    draw(REST_X + Math.sin(e * Math.PI) * 0.22, REST_Y + e * Math.PI * 2);
  };
})();
<\/script>
</body>
</html>
`,m=`<script>
document.addEventListener("click", function (event) {
  const anchor = event.target && event.target.closest ? event.target.closest("a[href]") : null;
  if (anchor) event.preventDefault();
});
<\/script>`,v=g.replace("</body>",`${m}</body>`);function x({className:o="",style:c}){const r=n.useRef(null),[d,h]=n.useState(()=>typeof document>"u"||!document.hidden),[u,p]=n.useState(!0),[t,i]=n.useState(!1);n.useEffect(()=>{const e=r.current;if(!e||typeof IntersectionObserver>"u")return;const s=new IntersectionObserver(([f])=>{p(f?.isIntersecting??!0)},{rootMargin:"80px"});return s.observe(e),()=>s.disconnect()},[]),n.useEffect(()=>{if(typeof document>"u")return;const e=()=>h(!document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]);const a=u&&d;return n.useEffect(()=>{i(!1)},[a]),l.jsx("div",{ref:r,className:`threeui-background foldwork-hero${o?` ${o}`:""}`,role:"group","aria-label":"Interactive Foldwork product studio hero","data-state":a?t?"ready":"loading":"paused",style:{background:"#111111",pointerEvents:"auto",...c},children:a?l.jsx("iframe",{title:"Foldwork — Products built to outlast the hype that sold them",srcDoc:v,sandbox:"allow-scripts",loading:"eager",onLoad:()=>i(!0),style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#111111",opacity:t?1:0,pointerEvents:t?"auto":"none",transition:"opacity 240ms ease-out"}}):null})}export{x as FoldworkHero};
