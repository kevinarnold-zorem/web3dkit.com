import{r as n,j as l}from"./index-ChUl42DD.js";const f=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>MERIDIAN — Slow Matter</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%232a2118'/%3E%3Crect x='7' y='7' width='18' height='18' fill='%23e2571e'/%3E%3Crect x='12' y='12' width='8' height='8' fill='%2332a2118'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
<style>
  :root{
    --u: clamp(.42px, min(100vw / 1600, 100vh / 820), 2.4px);

    /* one hue, turned all the way down */
    --ground:#0e1012;
    --ink:#e6e5e0;
    /* ground + ink. Painted through mix-blend-mode:difference this lands on
       exactly --ink over the ground and inverts to a dark tone over anything
       bright, so type can cross the 3-D without a plate behind it. */
    --knock:#f4f5f2;

    --t-nav:   max(11px, calc(15*var(--u)));
    --t-mark:  max(13px, calc(22*var(--u)));
    --t-eye:   max(11px, calc(15*var(--u)));
    --t-h1:    max(54px, calc(150*var(--u)));
    --t-lede:  max(13px, calc(19.5*var(--u)));
    --t-cta:   max(12px, calc(17*var(--u)));
    --t-foot:  max(11px, calc(15*var(--u)));

    --pad: max(20px, calc(56*var(--u)));
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    background:var(--ground);
    color:var(--ink);
    font-family:'Pixelify Sans',ui-monospace,monospace;
    -webkit-font-smoothing:antialiased;
    overflow:hidden;
    cursor:grab;
  }
  body.is-orbit{ cursor:grabbing; }

  /* the object owns the whole page; nothing is ever laid over it */
  #gl{ position:fixed; inset:0; width:100%; height:100%; display:block; z-index:0; }

  .type{
    position:fixed; inset:0; z-index:1;
    display:grid;
    grid-template-rows:auto minmax(0,1fr) auto;
    padding:var(--pad);
    color:var(--knock);
    mix-blend-mode:difference;
    pointer-events:none;
  }

  .rule{ height:1px; background:currentColor; opacity:.30; }

  /* ---------- top ---------- */
  .top{
    display:flex; align-items:baseline; justify-content:space-between;
    gap:calc(24*var(--u));
    padding-bottom:calc(16*var(--u));
  }
  .mark{ font-size:var(--t-mark); font-weight:700; letter-spacing:.34em; }
  .nav{ display:flex; gap:calc(34*var(--u)); font-size:var(--t-nav); letter-spacing:.24em; }
  .nav span:first-child{ font-weight:700; }

  /* ---------- hero ---------- */
  .hero{
    align-self:center;
    max-width:calc(760*var(--u));
    padding-block:calc(24*var(--u));
  }
  .eye{
    font-size:var(--t-eye); letter-spacing:.30em; font-weight:700;
    display:flex; align-items:center; gap:calc(14*var(--u));
    width:max-content; max-width:100%;
  }
  .eye::after{ content:''; height:1px; width:calc(90*var(--u)); background:currentColor; opacity:.34; }
  .h1{
    width:max-content; max-width:100%;
    margin-top:calc(26*var(--u));
    font-size:var(--t-h1); font-weight:700;
    line-height:.80; letter-spacing:-.005em;
  }
  .h1 em{ font-style:normal; display:block; }
  .lede{
    margin-top:calc(30*var(--u));
    max-width:calc(430*var(--u));
    font-size:var(--t-lede); line-height:1.62; letter-spacing:.03em;
  }
  .cta{
    margin-top:calc(32*var(--u));
    display:inline-flex; align-items:center; gap:calc(12*var(--u));
    font-size:var(--t-cta); font-weight:700; letter-spacing:.20em;
    color:inherit; background:none; border:0; font-family:inherit;
    padding:0 0 calc(7*var(--u));
    border-bottom:1px solid currentColor;
    cursor:pointer; pointer-events:auto;
  }
  .cta:hover,.cta:focus-visible{ opacity:.62; outline:none; }
  .cta i{ font-style:normal; }

  /* ---------- bottom ---------- */
  .bot{
    display:flex; align-items:baseline; justify-content:space-between;
    gap:calc(24*var(--u));
    padding-top:calc(16*var(--u));
    font-size:var(--t-foot); letter-spacing:.22em;
  }
  .phases{ display:flex; gap:calc(26*var(--u)); flex-wrap:wrap; }
  .phases b{ font-weight:700; }
  .phases i{ font-style:normal; opacity:.5; }
  .dials{ display:flex; gap:calc(26*var(--u)); flex-wrap:wrap; }
  .dial{
    pointer-events:auto; cursor:ew-resize; touch-action:none; user-select:none;
    white-space:nowrap; padding-bottom:2px;
    border-bottom:1px dotted transparent;
  }
  .dial:hover,.dial.is-hot,.dial:focus-visible{ border-bottom-color:currentColor; opacity:1; outline:none; }
  .cta{ transition:opacity .18s ease; }
  .dial b{ font-weight:700; font-variant-numeric:tabular-nums; }

  /* too narrow to sit the drift beside the type — stack it above instead */
  @media (max-width:620px){
    .hero{ align-self:end; }
  }
  @media (max-width:820px){
    .nav span:not(:first-child){ display:none; }
    .lede{ max-width:none; }
    .bot{ flex-direction:column; align-items:flex-start; gap:calc(10*var(--u)); }
  }
</style>
</head>
<body>

<canvas id="gl"></canvas>

<div class="type">

  <div>
    <header class="top">
      <div class="mark">MERIDIAN</div>
      <nav class="nav"><span>OBJECTS</span><span>PROCESS</span><span>ARCHIVE</span><span>CONTACT</span></nav>
    </header>
    <div class="rule"></div>
  </div>

  <section class="hero">
    <div class="eye">MODEL 14 &middot; APPLIED FLUID DIVISION</div>
    <h1 class="h1">SLOW<em>MATTER</em></h1>
    <p class="lede">Fourteen litres of wax in a column of cast acrylic, finding
      its own way up and back down again. Nobody is steering it.</p>
    <button class="cta" id="cta">SET IT DRIFTING <i>&rarr;</i></button>
  </section>

  <div>
    <div class="rule"></div>
    <footer class="bot">
      <div class="phases">
        <span><b>01</b> BLOOM</span><i>/</i>
        <span><b>02</b> VESSEL</span><i>/</i>
        <span><b>03</b> ASCENT</span>
      </div>
      <div class="dials">
        <span class="dial" id="d-orbit"  aria-label="Orbit"      data-min="0"  data-max="360" data-val="28"  data-unit="&deg;" data-name="ORBIT">ORBIT <b>028&deg;</b></span>
        <span class="dial" id="d-scale"  aria-label="Zoom"       data-min="30" data-max="180" data-val="100" data-unit="%"     data-name="ZOOM">ZOOM <b>100%</b></span>
        <span class="dial" id="d-volume" aria-label="Wax volume" data-min="0"  data-max="240" data-val="140" data-unit=""      data-name="VOLUME">VOLUME <b>140</b></span>
        <span class="hintline">DRAG ANYWHERE TO ORBIT</span>
      </div>
    </footer>
  </div>

</div>

<i id="uprobe" aria-hidden="true" style="position:fixed;left:-9999px;top:0;width:calc(100*var(--u));height:1px"></i>

<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
(function(){
'use strict';

var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- text dials: drag sideways, or arrow keys ---- */
var params={orbit:28, scale:100, volume:140};
function pad3(v){ v=Math.round(v); return v<10?'00'+v:(v<100?'0'+v:''+v); }

function makeDial(id,key){
  var el=document.getElementById(id);
  var min=+el.dataset.min, max=+el.dataset.max;
  var unit=el.dataset.unit||'', name=el.dataset.name;
  var val=+el.dataset.val, dragging=false, startX=0, startV=0;
  function render(){
    el.innerHTML = name + ' <b>' + pad3(val) + unit + '</b>';
    el.setAttribute('aria-valuenow', Math.round(val));
    params[key]=val;
  }
  el.addEventListener('pointerdown',function(e){
    dragging=true; startX=e.clientX; startV=val;
    el.setPointerCapture(e.pointerId); el.classList.add('is-hot');
    e.preventDefault(); e.stopPropagation();
  });
  el.addEventListener('pointermove',function(e){
    if(!dragging) return;
    e.stopPropagation();
    val = Math.min(max, Math.max(min, startV + (e.clientX-startX) * (max-min)/420));
    render();
  });
  function end(){ dragging=false; el.classList.remove('is-hot'); }
  el.addEventListener('pointerup',end);
  el.addEventListener('pointercancel',end);
  el.addEventListener('keydown',function(e){
    var step=(max-min)/100*(e.shiftKey?10:1), d=0;
    if(e.key==='ArrowRight'||e.key==='ArrowUp') d= step;
    else if(e.key==='ArrowLeft'||e.key==='ArrowDown') d=-step;
    else if(e.key==='Home') d=min-val;
    else if(e.key==='End') d=max-val;
    else return;
    e.preventDefault();
    val=Math.min(max,Math.max(min,val+d)); render();
  });
  el.setAttribute('role','slider');
  el.setAttribute('tabindex','0');
  el.setAttribute('aria-valuemin',min);
  el.setAttribute('aria-valuemax',max);
  render();
  return {set:function(v){ val=Math.min(max,Math.max(min,v)); render(); }};
}
var DL={
  orbit:  makeDial('d-orbit','orbit'),
  scale:  makeDial('d-scale','scale'),
  volume: makeDial('d-volume','volume')
};

/* ============================ the drift ============================ */

if(typeof THREE === 'undefined'){ return; }
THREE.ColorManagement.enabled = false;

var GROUND = [0.055, 0.063, 0.071];      /* #0e1012 */
var canvas = document.getElementById('gl');

var renderer;
try{ renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true}); }
catch(err){ canvas.style.display='none'; return; }
if(!renderer){ canvas.style.display='none'; return; }
renderer.setClearColor(0x000000, 0);

var scene  = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(26, 1, 1, 8000);
scene.add(camera);

var CUBE_FILL = 0.62;   /* bigger gaps: the lattice should read as a lattice */

var VERT = [
  'attribute float aEdge;',
  'attribute float aFlat;',
  'varying vec3 vCol; varying vec3 vLoc; varying float vDep; varying float vEdge; varying float vTone;',
  'float faceTone(vec3 n){',
  '  if(n.y >  0.5) return 1.000;',
  '  if(n.z >  0.5) return 0.720;',
  '  if(n.x >  0.5) return 0.545;',
  '  if(n.x < -0.5) return 0.300;',
  '  if(n.z < -0.5) return 0.235;',
  '  return 0.140;',
  '}',
  'void main(){',
  '  vLoc  = position * ' + (1/CUBE_FILL).toFixed(6) + ';',
  '  vCol  = instanceColor;',
  '  vEdge = aEdge;',
  '  vTone = mix(faceTone(normal), 1.0, aFlat);',
  '  vec4 mv = modelViewMatrix * instanceMatrix * vec4(position,1.0);',
  '  vDep = -mv.z;',
  '  gl_Position = projectionMatrix * mv;',
  '}'
].join('\\n');

var FRAG = [
  'precision highp float;',
  'varying vec3 vCol; varying vec3 vLoc; varying float vDep; varying float vEdge; varying float vTone;',
  'uniform vec3  uPaper;',
  'uniform float uFogA, uFogB, uFogK;',
  'uniform float uAlpha, uEdgeOn, uTime;',
  'uniform vec3  uEdgeCol;',
  'float hash21(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }',
  'void main(){',
  '  vec3 c = vCol * vTone;',
  '  float a = uAlpha;',
  /* per-axis band, then "at least two axes at the border" — a max()/min()
     formulation spikes fwidth along the face diagonals and paints stars */
  '  vec3 q = abs(vLoc) * 2.0;',
  '  vec3 fw = fwidth(q) * 0.8 + 0.005;',
  '  vec3 b  = smoothstep(vec3(0.93) - fw, vec3(0.93) + fw, q);',
  '  float e = clamp(b.x*b.y + b.y*b.z + b.z*b.x - 2.0*b.x*b.y*b.z, 0.0, 1.0) * uEdgeOn * vEdge;',
  '  vec3 ec = uEdgeCol * (0.30 + 1.45*dot(c, vec3(0.3333)));',
  '  c = mix(c, max(c, ec), e);',
  '  a = mix(a, min(1.0, a * 2.4 + 0.30), e);',
  '  float fog = clamp((vDep - uFogA) / max(0.0001, uFogB - uFogA), 0.0, 1.0);',
  '  fog *= uFogK;',
  '  c = mix(c, uPaper, fog);',
  /* shader grain, so the object carries the same tooth as the ground */
  '  float g = hash21(gl_FragCoord.xy + uTime*57.0);',
  '  c += (g - 0.5) * 0.055;',
  '  gl_FragColor = vec4(c, a);',
  '}'
].join('\\n');

function makeMat(alpha, edge, fogK){
  return new THREE.ShaderMaterial({
    vertexShader:VERT, fragmentShader:FRAG,
    uniforms:{
      uPaper:{value:new THREE.Vector3(GROUND[0],GROUND[1],GROUND[2])},
      uFogA:{value:0}, uFogB:{value:1}, uFogK:{value:fogK},
      uAlpha:{value:alpha}, uEdgeOn:{value:edge}, uTime:{value:0},
      uEdgeCol:{value:new THREE.Vector3(0.72,0.75,0.78)}
    },
    transparent: alpha < 1,
    depthWrite:  alpha >= 1,
    side: alpha < 1 ? THREE.DoubleSide : THREE.FrontSide,
    extensions:{derivatives:true}
  });
}
var matSolid = makeMat(1.0,  0.95, 0.30);   /* every cube gets an outline now */
var matGlass = makeMat(0.13, 1.0,  0.24);

var MAXI = 34000;
var boxGeo = new THREE.BoxGeometry(CUBE_FILL, CUBE_FILL, CUBE_FILL);

function makeMesh(mat, order){
  var g  = boxGeo.clone();
  var im = new THREE.InstancedMesh(g, mat, MAXI);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.setColorAt(0, new THREE.Color(1,1,1));
  im.instanceColor.setUsage(THREE.DynamicDrawUsage);
  var edge = new Float32Array(MAXI), flat = new Float32Array(MAXI);
  g.setAttribute('aEdge', new THREE.InstancedBufferAttribute(edge,1));
  g.setAttribute('aFlat', new THREE.InstancedBufferAttribute(flat,1));
  im.userData = {edge:edge, flat:flat};
  im.frustumCulled = false;
  im.renderOrder = order;
  im.count = 0;
  scene.add(im);
  return im;
}
var meshSolid = makeMesh(matSolid, 0);
var meshGlass = makeMesh(matGlass, 1);

/* ---------------- shader-noise ground ----------------
   A full-screen plate drawn before everything: the flat hue, a slow mottle,
   fine animated grain and an ordered dither, so the dark never goes plastic. */
var bgMat = new THREE.ShaderMaterial({
  depthTest:false, depthWrite:false,
  uniforms:{ uTime:{value:0}, uRes:{value:new THREE.Vector2(1,1)},
             uGround:{value:new THREE.Vector3(GROUND[0],GROUND[1],GROUND[2])} },
  vertexShader:[
    'varying vec2 vUv;',
    'void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }'
  ].join('\\n'),
  fragmentShader:[
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform float uTime; uniform vec2 uRes; uniform vec3 uGround;',
    'float h21(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }',
    'float vn(vec2 p){',
    '  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
    '  float a = h21(i), b = h21(i+vec2(1.0,0.0));',
    '  float c = h21(i+vec2(0.0,1.0)), d = h21(i+vec2(1.0,1.0));',
    '  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);',
    '}',
    'void main(){',
    '  vec2 uv = vUv;',
    '  vec2 px = uv * uRes;',
    '  float m = vn(uv*vec2(3.4,2.0) + uTime*0.013) * 0.62',
    '          + vn(uv*vec2(9.0,5.5) - uTime*0.021) * 0.38;',
    '  float g = h21(px + floor(uTime*24.0)*13.7);',
    '  float dth = h21(floor(mod(px, 4.0))*7.3 + 0.5);',
    '  float vig = 1.0 - 0.55*length((uv - vec2(0.5)) * vec2(1.18,1.0));',
    '  vec3 c = uGround * (0.70 + 0.85*vig);',
    '  c += (m - 0.5) * 0.030;',
    '  c += (g - 0.5) * 0.036;',
    '  c += (dth - 0.5) * 0.010;',
    '  gl_FragColor = vec4(max(c, vec3(0.0)), 1.0);',
    '}'
  ].join('\\n')
});
var GRID_R = 72;                    /* the grid needs room inside near/far */
var bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), bgMat);
bgQuad.frustumCulled = false; bgQuad.renderOrder = -10;
scene.add(bgQuad);

/* ---------------- the 3-D grid the drift floats over ---------------- */
var gridMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:false,
  uniforms:{ uFade:{value:new THREE.Vector2(16,62)},
             uTint:{value:new THREE.Vector3(0.72,0.76,0.80)} },
  vertexShader:[
    'attribute float aW;',
    'varying float vA;',
    'uniform vec2 uFade;',
    'void main(){',
    '  float r = length(position.xz);',
    '  vA = aW * (1.0 - smoothstep(uFade.x, uFade.y, r));',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);',
    '}'
  ].join('\\n'),
  fragmentShader:[
    'precision mediump float;',
    'varying float vA; uniform vec3 uTint;',
    'void main(){ if(vA <= 0.002) discard; gl_FragColor = vec4(uTint, vA); }'
  ].join('\\n')
});
var GRIDS = [];
(function buildGrid(){
  /* One segment per cell edge, not one per line: the radial fade is a varying,
     so a full-length line would interpolate between two far-away endpoints and
     vanish everywhere in between. */
  function plane(y, step, half, wMinor, wMajor, majorEvery){
    var pos = [], wgt = [];
    for(var i=-half; i<=half; i++){
      var v = i*step, w = (i % majorEvery === 0) ? wMajor : wMinor;
      for(var j=-half; j<half; j++){
        var a0 = j*step, a1 = (j+1)*step;
        pos.push(a0, y, v,  a1, y, v);  wgt.push(w, w);
        pos.push(v, y, a0,  v, y, a1);  wgt.push(w, w);
      }
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('aW', new THREE.Float32BufferAttribute(wgt,1));
    var ls = new THREE.LineSegments(g, gridMat);
    ls.frustumCulled = false; ls.renderOrder = -5;
    scene.add(ls); GRIDS.push(ls);
  }
  plane(-24, 7.0, 11, 0.26, 0.72, 3);   /* floor   */
  plane( 28, 7.0,  9, 0.10, 0.28, 3);   /* ceiling */
})();


/* ---------------- an organic drift, not a capsule ----------------
   A chain of lobes threaded on a wandering spine and welded with a smooth
   minimum, so the mass swells and pinches along its length. */
function spine(t, out){
  out.x = 18.8*t + 3.4*Math.sin(t*3.3 + 0.3);
  out.y = 12.8*Math.sin(t*1.95 + 0.35) + 2.3*t;
  out.z =  7.5*Math.sin(t*2.60 + 1.40) - 1.5*t;
  return out;
}
var LOBES = [];
(function(){
  var tmp = {x:0,y:0,z:0};
  var N = 10;
  for(var i=0;i<N;i++){
    var t = (i/(N-1))*2 - 1;
    spine(t, tmp);
    LOBES.push({ x:tmp.x, y:tmp.y, z:tmp.z,
                 r: 3.0 + 2.25*Math.sin(t*4.1 + 0.5) + 0.85*Math.sin(t*7.7 + 2.0) });
  }
  /* satellites: wax that has already pinched off and drifted away */
  var sat = [[-0.86, 1.0,-0.55, 1.8],[-0.42,-1.10, 0.75, 1.3],[ 0.12, 1.25, 0.35, 1.0],
             [ 0.58,-1.05,-0.85, 1.6],[ 0.94, 0.85, 0.60, 1.2],[-0.16,-1.35,-0.30, 0.9]];
  for(var q=0;q<sat.length;q++){
    spine(sat[q][0], tmp);
    LOBES.push({ x:tmp.x + sat[q][1]*5.3, y:tmp.y + sat[q][1]*4.1 + sat[q][2]*2.6,
                 z:tmp.z + sat[q][2]*4.9, r:sat[q][3] });
  }
})();
var SMOOTH = 1.4;        /* weld radius between neighbouring lobes */
var SLACK  = 2.6;        /* rim noise + half a cube, for the frustum fit */

var LOBE_MAX_R = 0;
for(var li=0; li<LOBES.length; li++) LOBE_MAX_R = Math.max(LOBE_MAX_R, LOBES[li].r);

function hash3(x,y,z){
  var h = (Math.imul(x,374761393) + Math.imul(y,668265263) + Math.imul(z,1274126177)) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1103515245) | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x,y,z){
  var xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  var fx=x-xi, fy=y-yi, fz=z-zi;
  fx=fx*fx*(3-2*fx); fy=fy*fy*(3-2*fy); fz=fz*fz*(3-2*fz);
  var c000=hash3(xi,yi,zi),     c100=hash3(xi+1,yi,zi);
  var c010=hash3(xi,yi+1,zi),   c110=hash3(xi+1,yi+1,zi);
  var c001=hash3(xi,yi,zi+1),   c101=hash3(xi+1,yi,zi+1);
  var c011=hash3(xi,yi+1,zi+1), c111=hash3(xi+1,yi+1,zi+1);
  var x00=c000+(c100-c000)*fx, x10=c010+(c110-c010)*fx;
  var x01=c001+(c101-c001)*fx, x11=c011+(c111-c011)*fx;
  var y0=x00+(x10-x00)*fy, y1=x01+(x11-x01)*fy;
  return y0+(y1-y0)*fz;
}

var blobs = [];
(function(){
  var s = 7;
  function rnd(){ s = (Math.imul(s,1103515245) + 12345) & 0x7fffffff; return s / 0x7fffffff; }
  for(var i=0;i<12;i++){
    blobs.push({ ph:(i/12 + rnd()*0.03) % 1, sp:0.020 + rnd()*0.012,
                 rr:0.15 + rnd()*0.70, an:rnd()*6.283,
                 aw:0.20 + rnd()*0.80, sz:0.86 + rnd()*0.28 });
  }
})();

var IV = new Float64Array(2);
function quadIv(a,b,c){
  var d = b*b - 4*a*c;
  if(d < 0) return false;
  d = Math.sqrt(d);
  IV[0] = (-b - d) / (2*a);
  IV[1] = (-b + d) / (2*a);
  return true;
}

/* world AABB of the whole drift */
var EX = {x:0,y:0,z:0};
(function(){
  for(var i=0;i<LOBES.length;i++){
    var L=LOBES[i], p=L.r + SMOOTH + SLACK + 1.0;
    EX.x = Math.max(EX.x, Math.abs(L.x)+p);
    EX.y = Math.max(EX.y, Math.abs(L.y)+p);
    EX.z = Math.max(EX.z, Math.abs(L.z)+p);
  }
})();

function build(time){
  var vol = params.volume / 140;

  /* the wax rides the spine */
  var nb = Math.max(1, Math.round(2 + vol * 2.8));
  var bx=[], by=[], bz=[], bs=[];
  var sp = {x:0,y:0,z:0};
  for(var i=0;i<nb;i++){
    var B = blobs[Math.floor(i * 12 / nb) % 12];
    var tt  = (B.ph + time * B.sp) % 1;
    var t   = tt*2 - 1;
    spine(t*0.94, sp);
    var ang = B.an + time * B.aw * 0.30;
    var rad = B.rr * 1.2;
    bx.push(sp.x + Math.cos(ang)*rad);
    by.push(sp.y + Math.sin(ang)*rad*0.7);
    bz.push(sp.z + Math.sin(ang)*rad);
    bs.push((3.2 + B.sz*1.95) * (0.80 + vol*0.20));
  }

  var ns = 0, ng = 0;
  var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  var sM = meshSolid.instanceMatrix.array, sC = meshSolid.instanceColor.array;
  var sE = meshSolid.userData.edge, sF = meshSolid.userData.flat;
  var gM = meshGlass.instanceMatrix.array, gC = meshGlass.instanceColor.array;
  var gE = meshGlass.userData.edge, gF = meshGlass.userData.flat;

  /* Every cube is nudged off its cell. A perfect lattice leaves the gaps
     between rows co-planar, so a level or axis-aligned view looks straight
     through the whole object and rules it with bright slits. */
  var bAmt = blast.amt, bx0 = blast.x, by0 = blast.y, bz0 = blast.z;
  var bR = BLAST_R, bR2 = bR*bR, bP = BLAST_P * bAmt;

  function put(gx,gy,gz,cr,cg,cb,flat,glass){
    var jx = (hash3(gx+11,gy+ 3,gz+ 7) - 0.5) * 0.22;
    var jy = (hash3(gx- 6,gy+19,gz+31) - 0.5) * 0.22;
    var jz = (hash3(gx+ 2,gy-13,gz+ 5) - 0.5) * 0.22;
    var sc = 0.90 + 0.19 * hash3(gx+41,gy+41,gz+41);

    /* where this cube lands in the view plane, before the cursor shoves it */
    var wx = gx+jx, wy = gy+jy, wz = gz+jz;
    var wu = wx*camRight.x + wy*camRight.y + wz*camRight.z;
    var wv = wx*camUp.x    + wy*camUp.y    + wz*camUp.z;
    var ww = wx*camDir.x   + wy*camDir.y   + wz*camDir.z;
    var dep = FITS.d - ww; if(dep < 1) dep = 1;
    var pad = 0.72*sc;
    var px2 = wu/(dep*FITS.tanX), py2 = wv/(dep*FITS.tanY);
    var qx2 = pad/(dep*FITS.tanX), qy2 = pad/(dep*FITS.tanY);
    if(px2-qx2 < minX) minX = px2-qx2;
    if(px2+qx2 > maxX) maxX = px2+qx2;
    if(py2-qy2 < minY) minY = py2-qy2;
    if(py2+qy2 > maxY) maxY = py2+qy2;

    if(bAmt > 0.002){
      var ex = gx - bx0, ey = gy - by0, ez = gz - bz0;
      var e2 = ex*ex + ey*ey + ez*ez;
      if(e2 < bR2){
        var er = Math.sqrt(e2) + 1e-4;
        var f  = 1 - er/bR; f = f*Math.sqrt(f);  /* wide, soft falloff */
        var pu = f * bP;
        /* radial shove, a swirl around the cursor, and per-cube scatter */
        jx += ex/er*pu + (ey/er)*pu*0.42 + (hash3(gx+77,gy- 9,gz+13)-0.5)*pu*1.25;
        jy += ey/er*pu - (ex/er)*pu*0.42 + (hash3(gx-23,gy+51,gz- 4)-0.5)*pu*1.25;
        jz += ez/er*pu                   + (hash3(gx+ 5,gy+ 8,gz+67)-0.5)*pu*1.25;
        sc *= 1 - f*0.42;                        /* bits shrink as they fly */
      }
    }
    if(!glass){
      if(ns >= MAXI) return;
      var o = ns*16;
      sM[o]=sc; sM[o+1]=0; sM[o+2]=0; sM[o+3]=0;
      sM[o+4]=0; sM[o+5]=sc; sM[o+6]=0; sM[o+7]=0;
      sM[o+8]=0; sM[o+9]=0; sM[o+10]=sc; sM[o+11]=0;
      sM[o+12]=gx+jx; sM[o+13]=gy+jy; sM[o+14]=gz+jz; sM[o+15]=1;
      sC[ns*3]=cr; sC[ns*3+1]=cg; sC[ns*3+2]=cb;
      sE[ns]=1; sF[ns]=flat; ns++;
    }else{
      if(ng >= MAXI) return;
      var p2 = ng*16;
      gM[p2]=sc; gM[p2+1]=0; gM[p2+2]=0; gM[p2+3]=0;
      gM[p2+4]=0; gM[p2+5]=sc; gM[p2+6]=0; gM[p2+7]=0;
      gM[p2+8]=0; gM[p2+9]=0; gM[p2+10]=sc; gM[p2+11]=0;
      gM[p2+12]=gx+jx; gM[p2+13]=gy+jy; gM[p2+14]=gz+jz; gM[p2+15]=1;
      gC[ng*3]=cr; gC[ng*3+1]=cg; gC[ng*3+2]=cb;
      gE[ng]=1; gF[ng]=flat; ng++;
    }
  }

  var gx0 = Math.ceil(-EX.x), gx1 = Math.floor(EX.x);
  var gy0 = Math.ceil(-EX.y), gy1 = Math.floor(EX.y);
  var zlo0 = Math.ceil(-EX.z), zhi0 = Math.floor(EX.z);
  var shellDepth = -3.8;
  var nl = LOBES.length;

  for(var gx = gx0; gx <= gx1; gx++){
    for(var gy = gy0; gy <= gy1; gy++){

      /* union of the lobes' z-intervals for this column (conservative) */
      var z0 = Infinity, z1 = -Infinity;
      for(var i2=0;i2<nl;i2++){
        var L = LOBES[i2];
        var dx0 = gx - L.x, dy0 = gy - L.y;
        var RR = L.r + SMOOTH + SLACK;
        var rad2 = RR*RR - dx0*dx0 - dy0*dy0;
        if(rad2 <= 0) continue;
        var s2 = Math.sqrt(rad2);
        if(L.z - s2 < z0) z0 = L.z - s2;
        if(L.z + s2 > z1) z1 = L.z + s2;
      }
      if(z0 > z1) continue;

      var za = Math.max(zlo0, Math.ceil(z0 - 0.001));
      var zb = Math.min(zhi0, Math.floor(z1 + 0.001));

      for(var gz = za; gz <= zb; gz++){
        /* smooth-min union of the lobes */
        var d = 1e9;
        for(var k2=0;k2<nl;k2++){
          var Lb = LOBES[k2];
          var ax = gx-Lb.x, ay2 = gy-Lb.y, az = gz-Lb.z;
          var di = Math.sqrt(ax*ax + ay2*ay2 + az*az) - Lb.r;
          if(di < d - SMOOTH){ d = di; }
          else if(di < d + SMOOTH){
            var hh = Math.max(SMOOTH - Math.abs(di - d), 0) / SMOOTH;
            d = Math.min(di, d) - hh*hh*SMOOTH*0.25;
          }
        }
        if(d > 2.1) continue;

        /* lumpy skin */
        d += (vnoise(gx*0.152 + 40, gy*0.152 + 40, gz*0.152 + 40) - 0.5) * 1.95
           + (vnoise(gx*0.475 - 12, gy*0.475 - 12, gz*0.475 - 12) - 0.5) * 0.68;
        if(d > 0.80) continue;

        var hs = hash3(gx, gy, gz);

        /* ragged, porous rim */
        if(d > -0.55){
          var rim = (d + 0.55) / 1.35;
          if(hs < Math.pow(rim, 0.62)) continue;
        }
        /* the mass thins and thickens over a long wavelength */
        var thin = vnoise(gx*0.073 + 300, gy*0.073 + 300, gz*0.073 + 300);
        if(hash3(gx+7, gy+7, gz+7) < 0.06 + Math.max(0, 0.46 - thin) * 0.85) continue;

        if(d < shellDepth) continue;

        /* wax: bounded soft union so overlapping blobs merge instead of
           stacking into one runaway mass */
        var acc = 1;
        for(var k = 0; k < nb; k++){
          var qx = gx - bx[k], qy = gy - by[k], qz = gz - bz[k];
          var r2 = qx*qx + qy*qy + qz*qz, sq = bs[k]*bs[k];
          if(r2 < sq){ var uu = 1 - r2/sq; acc *= (1 - uu*uu); }
        }
        var fld = 1 - acc;

        var kind, cr, cg, cb, flat = 0;

        /* one hue throughout — the wax reads by being brighter, not warmer */
        if(fld > 0.26 && d > -2.6){
          kind = 0; flat = 0.34;                        /* molten core */
          var hot = Math.min(1, (fld - 0.26) * 2.2);
          var w1 = 0.58 + 0.22*hot;
          cr = w1*0.98; cg = w1; cb = w1*1.03;
          if(hs > 0.90) kind = 1;
        } else if(fld > 0.11 && d > -2.2 && hs > 0.28){
          kind = 1; flat = 0.10;                        /* translucent halo */
          cr = 0.46; cg = 0.48; cb = 0.51;
        } else if(fld > 0.05 && d > -2.2 &&
                  vnoise(gx*0.50 + 9, gy*0.50 + 9, gz*0.50 + 9) > 0.70){
          kind = 0; flat = 0.50;                        /* rising bubble */
          cr = 0.72; cg = 0.735; cb = 0.755;
          if(hs > 0.86) kind = 1;
        } else {
          var gh = vnoise(gx*0.19 - 60, gy*0.19 - 60, gz*0.19 - 60)*0.72
                 + hash3(gx+91, gy-17, gz+53)*0.28;
          var gp = d > -0.10 ? 0.40 : (d > -1.30 ? 0.60 : 0.88);
          if(gh > gp){
            kind = 1;
            var t3 = 0.28 + 0.24*hash3(gx+7, gy+3, gz-11);
            cr = t3*0.96; cg = t3; cb = t3*1.06;        /* clouded glass */
          } else {
            kind = 0;
            var v = 0.115 + 0.130*hash3(gx-5, gy+29, gz+7);
            cr = v*0.94; cg = v; cb = v*1.08;           /* cold graphite */
          }
        }
        put(gx,gy,gz, cr,cg,cb, flat, kind === 1);
      }
    }
  }

  if(maxX > minX){
    FITS.ox = (maxX + minX) * 0.5;
    FITS.oy = (maxY + minY) * 0.5;
    FITS.m  = Math.max((maxX - minX) * 0.5 / FITS.fx,
                       (maxY - minY) * 0.5 / FITS.fy);
  }
  meshSolid.count = ns; meshGlass.count = ng;
  meshSolid.instanceMatrix.needsUpdate = true;
  meshSolid.instanceColor.needsUpdate  = true;
  meshSolid.geometry.attributes.aEdge.needsUpdate = true;
  meshSolid.geometry.attributes.aFlat.needsUpdate = true;
  meshGlass.instanceMatrix.needsUpdate = true;
  meshGlass.instanceColor.needsUpdate  = true;
  meshGlass.geometry.attributes.aEdge.needsUpdate = true;
  meshGlass.geometry.attributes.aFlat.needsUpdate = true;
}

/* ---------------- orbit + cursor blast ---------------- */
var orbit = { org:0, az: 28*Math.PI/180, el: 22*Math.PI/180, vaz:0, vel:0 };
var dragging = false, lastX = 0, lastY = 0;

/* the pointer pushes the wax apart where it passes */
var BLAST_R = 19.0;                 /* reach, in cells   */
var BLAST_P =  8.6;                 /* push,  in cells   */
var blast = { x:0, y:0, z:0, amt:0, want:0, speed:0,
              nx:0, ny:0, has:false };

function onDown(ev){
  if(ev.target && ev.target.closest && ev.target.closest('.dial,.cta')) return;
  dragging = true; lastX = ev.clientX; lastY = ev.clientY;
  document.body.classList.add('is-orbit');
}
function onMove(ev){
  var W = Math.max(1,window.innerWidth), H = Math.max(1,window.innerHeight);
  blast.nx =  (ev.clientX / W) * 2 - 1;
  blast.ny = -((ev.clientY / H) * 2 - 1);
  blast.want = 1; blast.has = true;
  if(!dragging) return;
  var dx = ev.clientX - lastX, dy = ev.clientY - lastY;
  lastX = ev.clientX; lastY = ev.clientY;
  blast.speed = Math.min(1, blast.speed + (Math.abs(dx)+Math.abs(dy)) * 0.010);
  orbit.vaz = -dx * 0.0055;
  orbit.vel =  dy * 0.0045;
}
window.addEventListener('pointerleave', function(){ blast.want = 0; });
document.addEventListener('mouseleave', function(){ blast.want = 0; });
function onUp(){ dragging = false; document.body.classList.remove('is-orbit'); }
window.addEventListener('pointerdown', onDown);
window.addEventListener('pointermove', onMove);
window.addEventListener('pointerup', onUp);
window.addEventListener('pointercancel', onUp);

window.addEventListener('wheel', function(ev){
  ev.preventDefault();
  var step = (ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY) * 0.075;
  DL.scale.set(params.scale - step);
}, {passive:false});

document.getElementById('cta').addEventListener('click', function(){
  orbit.vaz -= 0.075; orbit.vel += 0.012;
});

var lastDialAz = params.orbit;

/* ---------------- frustum fit: nothing ever touches an edge ------------- */
var FIT = [];
(function(){
  for(var i=0;i<LOBES.length;i++){
    var L = LOBES[i], rr = L.r*1.10 + 1.45;
    for(var a=0;a<8;a++){
      for(var b2=0;b2<8;b2++){
        var th = (a+0.5)/8*Math.PI, ph = b2/8*Math.PI*2;
        FIT.push(new THREE.Vector3(
          L.x + rr*Math.sin(th)*Math.cos(ph),
          L.y + rr*Math.cos(th),
          L.z + rr*Math.sin(th)*Math.sin(ph)));
      }
    }
  }
})();

/* The drift is fitted into whatever clear space the type leaves — measured
   off the live layout, so nothing ever has to be laid over the object. */
var BOX = {cx:0.30, cy:0, hx:0.64, hy:0.76};
function measureBox(){
  var W = Math.max(1,window.innerWidth), H = Math.max(1,window.innerHeight);
  var g = 16;
  var top = document.querySelector('.top').getBoundingClientRect();
  var bot = document.querySelector('.bot').getBoundingClientRect();
  var right = 0;
  ['.eye','.h1','.lede','.cta'].forEach(function(sel){
    var el = document.querySelector(sel);
    if(el) right = Math.max(right, el.getBoundingClientRect().right);
  });
  var yT = 1 - 2*(top.bottom + g)/H;
  var yB = 1 - 2*(bot.top    - g)/H;
  var xL = Math.min(0.15, 2*(right + g)/W - 1);
  var xR = 0.985;
  if(W < 620){                       /* stacked: the drift takes the top band */
    var hero = document.querySelector('.hero').getBoundingClientRect();
    xL = -0.985;
    yB = 1 - 2*(hero.top - g)/H;
  }
  BOX.cx = (xL + xR)/2;  BOX.hx = Math.max(0.14, (xR - xL)/2);
  BOX.cy = (yT + yB)/2;  BOX.hy = Math.max(0.14, (yT - yB)/2);
}

var camRight = new THREE.Vector3(), camUp = new THREE.Vector3(), camDir = new THREE.Vector3();
var WORLD_UP = new THREE.Vector3(0,1,0);
var _v = new THREE.Vector3(), _bp = new THREE.Vector3();
var camDist = 320, camDistSmooth = 320;
/* The analytic lobe envelope is ~25 % larger than what actually gets drawn once
   the rim has dissolved, so it leaves a lot of air. Measure the real thing:
   build() records how far the emitted cubes reach, and the next frame corrects
   the distance by that ratio. */
var FITS = {tanX:1, tanY:1, fx:1, fy:1, d:320, m:0, ox:0, oy:0, sox:0, soy:0};

function fitDistance(fillX, fillY){
  var tanY = Math.tan(camera.fov * Math.PI / 360);
  var tanX = tanY * camera.aspect;
  var d = camDist;
  for(var it=0; it<6; it++){
    var m = 0;
    for(var i=0;i<FIT.length;i++){
      var p = FIT[i];
      var along = p.x*camDir.x + p.y*camDir.y + p.z*camDir.z;
      var depth = d - along; if(depth < 1) depth = 1;
      _v.copy(p).addScaledVector(camDir, -along);
      var nx = Math.abs(_v.dot(camRight)) / (depth * tanX * fillX);
      var ny = Math.abs(_v.dot(camUp))    / (depth * tanY * fillY);
      if(nx > m) m = nx;
      if(ny > m) m = ny;
    }
    if(m <= 0) break;
    d = d * m;
  }
  return d;
}

function placeCamera(){
  camDir.set(
    Math.cos(orbit.el) * Math.sin(orbit.az),
    Math.sin(orbit.el),
    Math.cos(orbit.el) * Math.cos(orbit.az)
  ).normalize();
  camRight.crossVectors(WORLD_UP, camDir).normalize();
  camUp.crossVectors(camDir, camRight).normalize();

  var k  = params.scale / 100;
  var sk = k;
  FITS.tanY = Math.tan(camera.fov * Math.PI / 360);
  FITS.tanX = FITS.tanY * camera.aspect;
  FITS.fx = BOX.hx * sk;
  FITS.fy = BOX.hy * sk;
  camDist = FITS.m > 0 ? camDistSmooth * FITS.m
                       : fitDistance(FITS.fx, FITS.fy);
  camDistSmooth += (camDist - camDistSmooth) * 0.22;
  FITS.d = camDistSmooth;
  /* centre the drift in its box rather than the world origin, so it can grow
     until both sides touch instead of stopping at the first one */
  FITS.sox += (FITS.ox - FITS.sox) * 0.22;
  FITS.soy += (FITS.oy - FITS.soy) * 0.22;

  camera.position.copy(camDir).multiplyScalar(camDistSmooth);
  camera.up.copy(WORLD_UP);
  camera.lookAt(0,0,0);

  var reach = Math.sqrt(EX.x*EX.x + EX.y*EX.y + EX.z*EX.z);
  /* the floor grid runs far past the drift — clip for it, not just the cubes */
  camera.near = Math.max(1.5, camDistSmooth - GRID_R - 12);
  camera.far  = camDistSmooth + GRID_R + 40;
  camera.updateProjectionMatrix();
  /* slide the frustum instead of the object: keeps the fit exact */
  camera.projectionMatrix.elements[8] -= BOX.cx - FITS.sox;
  camera.projectionMatrix.elements[9] -= BOX.cy - FITS.soy;
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

  var fa = camDistSmooth - reach*0.45, fb = camDistSmooth + reach*0.95;
  matSolid.uniforms.uFogA.value = fa; matSolid.uniforms.uFogB.value = fb;
  matGlass.uniforms.uFogA.value = fa; matGlass.uniforms.uFogB.value = fb;
}

function resize(){
  var w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  measureBox();
}
window.addEventListener('resize', resize);
resize();
if(document.fonts && document.fonts.ready) document.fonts.ready.then(measureBox);

var t0 = performance.now();
var seekT = null;
function frame(){
  var t = seekT !== null ? seekT : (reduced ? 9.5 : (performance.now() - t0) / 1000);

  if(params.orbit !== lastDialAz){
    orbit.az += (params.orbit - lastDialAz) * Math.PI / 180;
    lastDialAz = params.orbit;
  }
  orbit.az += orbit.vaz; orbit.el += orbit.vel;
  var damp = dragging ? 0.55 : 0.955;
  orbit.vaz *= damp; orbit.vel *= damp;
  if(Math.abs(orbit.vaz) < 1e-5) orbit.vaz = 0;
  if(Math.abs(orbit.vel) < 1e-5) orbit.vel = 0;
  orbit.el = Math.max(-0.22, Math.min(1.12, orbit.el));

  var deg = ((orbit.az * 180 / Math.PI) % 360 + 360) % 360;
  if(Math.abs(deg - lastDialAz) > 0.4){ DL.orbit.set(deg); lastDialAz = deg; }

  placeCamera();

  /* where the cursor lands on the plane through the drift's centre */
  if(blast.has && !reduced){
    _bp.set(blast.nx, blast.ny, -1).unproject(camera).sub(camera.position).normalize();
    var den = _bp.dot(camDir);
    if(den < -1e-4){
      var tt2 = -camDistSmooth / den;
      blast.x = camera.position.x + _bp.x*tt2;
      blast.y = camera.position.y + _bp.y*tt2;
      blast.z = camera.position.z + _bp.z*tt2;
    }
  }
  blast.speed *= 0.90;
  var wantAmt = (reduced ? 0 : blast.want) * (0.72 + 0.55*blast.speed);
  blast.amt += (wantAmt - blast.amt) * (wantAmt > blast.amt ? 0.16 : 0.075);

  bgMat.uniforms.uTime.value    = t;
  matSolid.uniforms.uTime.value = t;
  matGlass.uniforms.uTime.value = t;

  build(t);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.__diag = function(){
  return {solid:meshSolid.count, glass:meshGlass.count,
          dist:+camDistSmooth.toFixed(1),
          blast:+blast.amt.toFixed(3),
          az:+(orbit.az*180/Math.PI).toFixed(1), el:+(orbit.el*180/Math.PI).toFixed(1)};
};
window.__set = function(o){
  o = o || {};
  if(o.t !== undefined)      seekT = o.t;
  if(o.orbit !== undefined){ DL.orbit.set(o.orbit); orbit.az = o.orbit*Math.PI/180; lastDialAz = o.orbit; orbit.vaz = 0; }
  if(o.el !== undefined)   { orbit.el = o.el*Math.PI/180; orbit.vel = 0; }
  if(o.scale !== undefined)  DL.scale.set(o.scale);
  if(o.volume !== undefined) DL.volume.set(o.volume);
  if(o.blast !== undefined){ blast.want = o.blast; blast.has = true; }
  if(o.grid !== undefined) GRIDS.forEach(function(g){ g.visible = !!o.grid; });
  if(o.mouse){ blast.nx = o.mouse[0]; blast.ny = o.mouse[1]; blast.has = true; }
};

})();
<\/script>
</body>
</html>
`,g=`<script>
document.addEventListener("click", function (event) {
  const anchor = event.target && event.target.closest ? event.target.closest("a[href]") : null;
  if (anchor) event.preventDefault();
});
<\/script>`,p=f.replace("</body>",`${g}</body>`);function b({className:r="",style:d}){const i=n.useRef(null),[c,v]=n.useState(()=>typeof document>"u"||!document.hidden),[h,u]=n.useState(!0),[a,o]=n.useState(!1);n.useEffect(()=>{const e=i.current;if(!e||typeof IntersectionObserver>"u")return;const s=new IntersectionObserver(([m])=>{u(m?.isIntersecting??!0)},{rootMargin:"80px"});return s.observe(e),()=>s.disconnect()},[]),n.useEffect(()=>{if(typeof document>"u")return;const e=()=>v(!document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]);const t=h&&c;return n.useEffect(()=>{o(!1)},[t]),l.jsx("div",{ref:i,className:`threeui-background meridian-slow-matter${r?` ${r}`:""}`,role:"group","aria-label":"Interactive Meridian Slow Matter hero","data-state":t?a?"ready":"loading":"paused",style:{background:"#070c0e",pointerEvents:"auto",...d},children:t?l.jsx("iframe",{title:"MERIDIAN — Slow Matter",srcDoc:p,sandbox:"allow-scripts",loading:"eager",onLoad:()=>o(!0),style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#070c0e",opacity:a?1:0,pointerEvents:a?"auto":"none",transition:"opacity 240ms ease-out"}}):null})}export{b as MeridianSlowMatter};
