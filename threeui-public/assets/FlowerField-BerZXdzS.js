import{r as n,j as l}from"./index-ChUl42DD.js";const v=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Flower Field</title>
<style>
  :root { color-scheme: dark; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:auto; }
  body { width:100%; background:#0a0714; overflow-x:hidden; }
  #stage { position:fixed; inset:0; z-index:0; }
  /* the only job of this is to give the page something to scroll */
  #track { position:relative; height:340vh; pointer-events:none; }
  canvas { display:block; width:100%; height:100%; }
  #loader{position:fixed;inset:0;display:grid;place-items:center;background:#0a0714;color:#cdbce8;
    font:400 12px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.22em;
    text-transform:uppercase;transition:opacity .9s ease;z-index:9}
  #loader.done{opacity:0;pointer-events:none}
</style>
</head>
<body>
<div id="stage"></div>
<div id="track" aria-hidden="true"></div>
<div id="loader">Flower Field</div>

<script type="importmap">
{ "imports": {
  "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
  "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
} }
<\/script>

<script type="module">
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

/* ══════════════════════════════════════════════════════════════════════
   CONFIG  — every tunable in one place
   ═════════════════════════════════════════════════════════════════════ */
const C = {
  cam:      { fov: 40, eye: 0.55, pitch: 0.0, z: 0 },
  /* scroll flies the camera up the valley.  The dolly is deliberately short
     and the lens does most of the work: content has to exist along every
     metre the camera travels, but a narrowing lens costs nothing and reads
     as travelling much further than it is. */
  scroll:   { travel: 7.0, fovEnd: 22, riseEnd: 0.10, ease: 1.0 },
  valley:   { groundSlope: 0.080, wallSlopeL: 0.404, wallSlopeR: 0.385,
              soften0: 1.2, softenK: 0.015, far: 2400, rippleAmp: 0.016 },
  bloom:    { strength: 0.36, radius: 0.22, threshold: 1.10 },
  counts:   { fg: 1560, mid: 30000, far: 5000, sparkle: 46000, leaf: 62000, blade: 265000, mote: 1400,
              bokehNear: 470, bokehMid: 560, mist: 28, star: 2600 },
  /* aerial perspective: extinction per metre, the scale height the air thins
     over, and how bright the airlight is relative to the sky behind it */
  air:      { k: 0.00024, scaleH: 620, tint: 0.78, desat: 0.34 },
  exposure: 1.0,
};

/* aspect the scene was art-directed at (reference video is 1452x1080) */
const REF_ASPECT = 1452 / 1080;

/* debug switches: ?only=sky,mtn  ?off=mist  ?raw=1  ?t=3.2 */
const QS = new URLSearchParams(location.search);
const ONLY = QS.get('only') ? new Set(QS.get('only').split(',')) : null;
const OFF  = QS.get('off')  ? new Set(QS.get('off').split(','))  : new Set();
const RAW  = QS.get('raw') === '1';
function shown(name){ return ONLY ? ONLY.has(name) : !OFF.has(name); }
function addLayer(name, obj){ if (shown(name)) scene.add(obj); return obj; }
if (QS.has('exposure')) C.exposure = parseFloat(QS.get('exposure'));
if (QS.has('bloom'))    C.bloom.strength = parseFloat(QS.get('bloom'));

/* ══════════════════════════════════════════════════════════════════════
   Shared GLSL — sky colour, noise, spectral ramp
   ═════════════════════════════════════════════════════════════════════ */
const GLSL_SKY = /* glsl */\`
vec3 s2l(vec3 c){ c/=255.0; return pow(c, vec3(2.2)); }

/* Vertical gradient measured off the reference, plus the left→right warm tilt */
vec3 skyColor(vec2 uv){
  float t = 1.0 - uv.y;              // 0 at top of frame
  vec3 c;
  if      (t < 0.050) c = mix(vec3( 85., 83.,195.), vec3( 95., 89.,200.), t/0.050);
  else if (t < 0.100) c = mix(vec3( 95., 89.,200.), vec3(105., 96.,208.), (t-0.050)/0.050);
  else if (t < 0.150) c = mix(vec3(105., 96.,208.), vec3(123.,105.,210.), (t-0.100)/0.050);
  else if (t < 0.200) c = mix(vec3(123.,105.,210.), vec3(140.,112.,212.), (t-0.150)/0.050);
  else if (t < 0.250) c = mix(vec3(140.,112.,212.), vec3(159.,119.,206.), (t-0.200)/0.050);
  else if (t < 0.300) c = mix(vec3(159.,119.,206.), vec3(177.,123.,198.), (t-0.250)/0.050);
  else if (t < 0.350) c = mix(vec3(177.,123.,198.), vec3(194.,122.,171.), (t-0.300)/0.050);
  else if (t < 0.400) c = mix(vec3(194.,122.,171.), vec3(191.,102.,144.), (t-0.350)/0.050);
  else                c = mix(vec3(191.,102.,144.), vec3(176., 92.,132.), min((t-0.400)/0.28, 1.0));

  /* horizontal falloff: the set sun sits off to the right, so the left sky
     drops away faster than the right climbs — two different ramps */
  float td = clamp(t, 0.0, 0.42);
  float q  = abs(uv.x - 0.5) * 2.0;
  vec3 ampL = vec3(25., 16., 31.) + td*vec3(147., 103., 63.);
  vec3 ampR = vec3(23., 11.,  9.) + td*vec3( 50.,  45., -5.);
  c += (uv.x < 0.5) ? -ampL*pow(q, 1.25) : ampR*pow(q, 0.70);

  return s2l(max(c, vec3(0.0)));
}

\`;

/* vertex-side aerial perspective for the instanced layers */
const GLSL_AIR_VS = GLSL_SKY + /* glsl */\`
uniform vec4 uAir;
uniform float uAirMul;
float airOpacityV(vec3 wp){
  float d = distance(wp, cameraPosition);
  float hAvg = max(0.5*(wp.y + cameraPosition.y) + 40.0, 0.0);
  return clamp(1.0 - exp(-d*uAir.x*uAirMul*exp(-hAvg*uAir.y)), 0.0, 1.0);
}
void airVertex(vec3 wp, vec4 clip, out float t, out vec3 col){
  t = airOpacityV(wp);
  col = skyColor(clip.xy/clip.w*0.5 + 0.5) * uAir.z;
}
\`;

const GLSL_AIR_FS = /* glsl */\`
varying float vAirT; varying vec3 vAirCol;
vec3 airFrag(vec3 c){
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(c, vec3(lum), vAirT*uAir.w);
  return mix(c, vAirCol, vAirT);
}
\`;

const GLSL_COMMON = GLSL_SKY + /* glsl */\`
/* gradient noise — value noise puts its extrema on the lattice, which shows
   up as blobs in rows on a large surface */
vec2 hash22(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float gnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(dot(hash22(i+vec2(0,0)), f-vec2(0,0)),
                 dot(hash22(i+vec2(1,0)), f-vec2(1,0)), u.x),
             mix(dot(hash22(i+vec2(0,1)), f-vec2(0,1)),
                 dot(hash22(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
}
const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);
float gfbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*gnoise(p); p=ROT*p*2.03; a*=0.5; } return s; }
float ridged(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<3;i++){ s+=a*(1.0-abs(gnoise(p)*2.0)); p=ROT*p*2.11; a*=0.5; } return s; }

/* bump-map an unparametrised surface straight from screen-space derivatives */
vec3 bumped(vec3 N, vec3 p, float h, float k){
  vec3 dpx = dFdx(p), dpy = dFdy(p);
  float dhx = dFdx(h)*k, dhy = dFdy(h)*k;
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 grad = sign(det) * (dhx*r1 + dhy*r2);
  return normalize(abs(det)*N - grad);
}

/* value noise + fbm */
float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; p*=p+p; return fract(p); }
float hash21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x), mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x), f.y);
}
float fbm(vec2 p){ float a=0.5,s=0.0; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.03; a*=0.5; } return s; }

/* one cell of round blossom dots in world space — the distant carpet.
   Fades to its own mean coverage once a cell is smaller than a pixel,
   otherwise grazing slopes alias into a solid white sheet. */
float speckleLayer(vec2 wxz, float cell, float density, float rad){
  vec2 g = wxz / cell;
  float fp = max(fwidth(g.x), fwidth(g.y));      // cells per pixel
  float mean = density * 3.14159 * rad*rad * 2.2;
  if (fp > 1.4) return mean;
  vec2 id = floor(g), f = fract(g);
  vec2 q = step(vec2(0.5), f)*2.0 - 1.0;         // the only neighbours that can reach us
  float acc = 0.0;
  float aa = fp*0.50 + 1e-5;
  for (int k=0;k<4;k++){
    vec2 o = vec2(float(k & 1)*q.x, float(k >> 1)*q.y);
    vec2 cid = id + o;
    float h = hash21(cid*1.37);
    if (h > density) continue;
    vec2 c = o + 0.28 + 0.44*vec2(hash21(cid*2.11), hash21(cid*3.71));
    float d = length(f - c);
    float r = rad * (0.55 + 0.9*hash21(cid*5.13));
    acc = max(acc, smoothstep(r+aa, r-aa, d) * (0.45 + 0.75*hash21(cid*7.77)));
  }
  return mix(acc, mean, smoothstep(0.30, 1.4, fp));
}

/* ── aerial perspective ──────────────────────────────────────────────────
   Two terms, the way the air actually works: the surface's own light is
   extinguished over the path, and airlight is scattered into it.  The
   airlight is the SKY IN THE FRAGMENT'S OWN DIRECTION — so a ridge standing
   against the pink horizon warms toward pink and the same rock against the
   violet zenith cools, which is the agreement a single fog colour can never
   produce.  Saturation goes before value, so the mix desaturates first. */
uniform vec4 uAir;                 // extinction, 1/scaleHeight, airlight gain, desaturation
uniform float uAirMul;             // per-layer amount, so a range can sit deeper than a slope
float airOpacity(vec3 wp){
  float d = distance(wp, cameraPosition);
  /* the air thins with altitude, so a peak sits in clearer air than its foot */
  float hAvg = max(0.5*(wp.y + cameraPosition.y) + 40.0, 0.0);
  float dens = exp(-hAvg*uAir.y);
  return clamp(1.0 - exp(-d*uAir.x*uAirMul*dens), 0.0, 1.0);
}
vec3 aerial(vec3 c, vec3 wp, vec2 screenUV){
  float t = airOpacity(wp);
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(c, vec3(lum), t*uAir.w);                  // contrast and colour go first
  return mix(c, skyColor(screenUV)*uAir.z, t);      // then the airlight takes over
}

/* The airlight varies slowly across a blade or a petal, so on the instanced
   layers it is resolved once per vertex and interpolated.  Evaluating the sky
   gradient per fragment across a field of a quarter-million blades was most
   of the cost of the atmosphere. */

/* Wrapped diffuse.  A hard Lambert terminator is what makes foliage read as
   plastic; wrapping the falloff past the terminator is the cheap stand-in for
   light bouncing around inside a thin, crowded, translucent canopy. */
float wrapDiffuse(vec3 N, vec3 L, float w){
  return max((dot(N, L) + w) / ((1.0 + w)*(1.0 + w)), 0.0);
}

/* smooth spectrum for the thin-film iridescence */
vec3 spectral(float h){
  h = fract(h);
  vec3 c = 0.5 + 0.5*cos(6.28318*(vec3(0.0,0.33,0.67)+h));
  return c*c;
}
\`;

/* ══════════════════════════════════════════════════════════════════════
   Renderer / scene / camera
   ═════════════════════════════════════════════════════════════════════ */
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
/* Render at the display's own density.  Dropping below it is the one
   artefact that reads as broken rather than merely simpler, so the quality
   ladder gives up features long before it gives up pixels. */
let targetPR = Math.min(devicePixelRatio, 2.0);
renderer.setPixelRatio(targetPR);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0x000000, 1);
stage.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(C.cam.fov, 1, 0.05, 6000);
camera.position.set(0, 0, C.cam.z);
camera.rotation.order = 'YXZ';
camera.rotation.x = THREE.MathUtils.degToRad(C.cam.pitch);

/* the lens the scroll is currently at; resize() reads it, and resize runs
   during setup, so it cannot live further down the file */
let fovScroll = C.cam.fov;

const uRes  = new THREE.Vector2(1,1);
const uTime = { value: 0 };
/* where the pointer is resting on the field, how far its influence reaches,
   and how much of it is switched on (fades out when the pointer leaves) */
const uMouse  = { value: new THREE.Vector3(0, -9999, 0) };
const uMouseR = { value: 1.05 };
const uMouseOn= { value: 0 };
/* one atmosphere for the whole scene, so the terrain, the ranges, the blades
   and every billboard agree about what distance does */
const uAir = { value: new THREE.Vector4(C.air.k, 1/C.air.scaleH, C.air.tint, C.air.desat) };
const SHARED = { uResolution:{ value:uRes }, uTime, uMouse, uMouseR, uMouseOn, uAir };

/* ══════════════════════════════════════════════════════════════════════
   Terrain height field — the straight V valley solved from the reference
   ═════════════════════════════════════════════════════════════════════ */
const V = C.valley;
function ridgeNoise(x, z){
  // low-frequency undulation so the crest line is not a ruler-straight edge
  const s = Math.sin(z*0.0121 + x*0.0043) * 0.55
          + Math.sin(z*0.0331 - x*0.0117) * 0.28
          + Math.sin(z*0.0827 + x*0.0402) * 0.13
          + Math.sin(x*0.221  + z*0.0071) * 0.08;
  return s;
}
function terrainH(x, z){
  const d = Math.max(-z, 0.001);
  const floorY = -C.cam.eye - V.groundSlope * d;
  const slope  = x < 0 ? V.wallSlopeL : V.wallSlopeR;
  const ax     = Math.abs(x);
  let   wall   = slope * ax;
  // gentle concavity: floor of the valley is rounded, not a hard crease
  const soften = V.soften0 + d*V.softenK;
  wall = slope * (Math.sqrt(ax*ax + soften*soften) - soften);
  const rip = V.rippleAmp * d * ridgeNoise(x, z);
  return floorY + wall + rip;
}
function terrainNormal(x, z, e){
  e = e || Math.max(0.05, Math.abs(z)*0.01);
  const hL = terrainH(x-e, z), hR = terrainH(x+e, z);
  const hD = terrainH(x, z-e), hU = terrainH(x, z+e);
  const n = new THREE.Vector3(hL-hR, 2*e, hD-hU);
  return n.normalize();
}

/* ══════════════════════════════════════════════════════════════════════
   Sky — full-screen quad drawn behind everything
   ═════════════════════════════════════════════════════════════════════ */
const skyMat = new THREE.ShaderMaterial({
  uniforms: Object.assign({ uAirMul:{value:1.0} }, SHARED), depthTest:false, depthWrite:false,
  vertexShader:\`void main(){ gl_Position = vec4(position.xy, 1.0, 1.0); }\`,
  fragmentShader: GLSL_COMMON + /* glsl */\`
    uniform vec2 uResolution; uniform float uTime;
    void main(){
      vec2 uv = gl_FragCoord.xy / uResolution;
      vec3 c = skyColor(uv);
      /* faint high cloud banding so the gradient is not perfectly clean */
      float n = fbm(vec2(uv.x*3.4, uv.y*7.0 + 3.1));
      c *= 1.0 + (n-0.5)*0.045;
      /* dither to kill banding */
      c += (hash21(gl_FragCoord.xy)-0.5)/255.0;
      gl_FragColor = vec4(c, 1.0);
      #include <colorspace_fragment>
    }\`
});
const skyQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), skyMat);
skyQuad.frustumCulled = false; skyQuad.renderOrder = -1000;
addLayer('sky', skyQuad);

/* ══════════════════════════════════════════════════════════════════════
   Mountains — ridges authored directly in screen space, then un-projected
   ═════════════════════════════════════════════════════════════════════ */
const halfV = Math.tan(THREE.MathUtils.degToRad(C.cam.fov)/2);
const halfH = halfV * REF_ASPECT;          // the frame the scene was authored in

/* Everything below is authored in reference-frame screen coordinates, but the
   window is usually wider than 1452x1080 — on an ultrawide the ridge meshes and
   the terrain simply ran out and you saw their cut edges.  Build to the actual
   window (clamped, with margin) and widen the scatter wedge to match. */
const VIEW_ASPECT  = Math.min(Math.max(innerWidth / Math.max(innerHeight, 1), REF_ASPECT), 3.6);
const BUILD_ASPECT = VIEW_ASPECT * 1.20;
const halfHb = halfV * BUILD_ASPECT;
const uPad   = 0.5 * (BUILD_ASPECT / REF_ASPECT) + 0.18;   // reference-u half-range to build
const ANG    = Math.atan(halfHb) * 2 * 1.06;
/* the wedge got wider, so scale the scatter counts to hold screen density */
const DENS = Math.max(1, (ANG / 1.229));
for (const k in C.counts) if (k !== 'mist') C.counts[k] = Math.round(C.counts[k] * DENS);

/* value noise / fbm shared by the ridge builder and the field clumping */
function vnoise2(x, y){
  const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
  const h=(a,b)=>{ let n=Math.sin(a*127.1+b*311.7)*43758.5453; return n-Math.floor(n); };
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
  return (h(xi,yi)*(1-u)+h(xi+1,yi)*u)*(1-v) + (h(xi,yi+1)*(1-u)+h(xi+1,yi+1)*u)*v;
}
function fbm2(x,y){ let a=0.5,s=0; for(let i=0;i<5;i++){ s+=a*vnoise2(x,y); x*=2.03; y*=2.03; a*=0.5; } return s; }

/* screen (u = 0..1 left→right, v = 0..1 top→bottom) at distance D → world */
function unproject(u, v, D){
  return { x: (u-0.5)*2*halfH*D, y: (0.5-v)*2*halfV*D };
}

/* piecewise-linear silhouette sampler */
function makeProfile(points){
  return (u)=>{
    if (u <= points[0][0]) return points[0][1];
    for (let i=1;i<points.length;i++){
      if (u <= points[i][0]){
        const t = (u - points[i-1][0]) / (points[i][0] - points[i-1][0]);
        const s = t*t*(3-2*t);
        return points[i-1][1]*(1-s) + points[i][1]*s;
      }
    }
    return points[points.length-1][1];
  };
}

function buildRidge(opts){
  const { profile, D, depth, uSpan, seg, detail, freq, drop, baseV, tint, rim, hazeK, roughness } = opts;
  const NX = seg, NZ = 40;
  const u0 = uSpan[0], u1 = uSpan[1];
  const pos = [], nor = [], col = [], idx = [];
  const baseWorld = unproject(0.5, baseV, D).y;

  const seed = opts.seed || 0;
  const H = (u, zt) => {
    const crestV = profile(u);
    let h = unproject(u, crestV, D).y;
    const xw = (u-0.5)*2*halfH*D;
    /* fractal relief along the crest — six octaves so the skyline is ragged */
    let n = 0, a = 1, f = freq;
    for (let o=0;o<6;o++){
      n += a * (2*fbm2(xw*f + o*37.1 + seed, 5.3 + o*11.7 + zt*0.8) - 1);
      a *= 0.55; f *= 2.07;
    }
    h += n * detail * D;
    /* the face falls toward the camera, cut by gullies and buttresses */
    const gull = 0.55 + 0.45*Math.sin(xw*freq*4.1 + seed)*Math.sin(xw*freq*1.7 + 2.3);
    h -= drop * zt * D * (0.62 + 0.76*gull);
    /* spur ribs across the face */
    h += (2*fbm2(xw*freq*9.0 + seed*3.0, zt*4.5) - 1) * detail * 0.55 * D * (1.0 - zt*0.55);
    return Math.max(h, baseWorld);
  };

  /* The face never falls far enough on its own to reach the range's base, so
     the last two rows form a vertical skirt down to it.  Without that the
     mesh simply stops in mid-air and you see the next range — and the sky —
     through the gap beneath it. */
  for (let j=0;j<=NZ;j++){
    const zt = Math.min(j/(NZ-1), 1.0);      // 0 = crest, 1 = toward camera
    const z  = -(D - zt*depth);
    const skirt = (j === NZ);
    for (let i=0;i<=NX;i++){
      const u = u0 + (u1-u0)*(i/NX);
      const x = (u-0.5)*2*halfH*D;
      const y = skirt ? baseWorld : H(u, zt);
      pos.push(x, y, z);
    }
  }
  for (let j=0;j<NZ;j++) for (let i=0;i<NX;i++){
    const a=j*(NX+1)+i, b=a+1, c2=a+NX+1, d=c2+1;
    idx.push(a,c2,b, b,c2,d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);
  g.computeVertexNormals();

  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({
      uTint:{value:new THREE.Color(tint)},
      uRim:{value:new THREE.Color(rim)},
      uFog:{value:new THREE.Color(opts.fogColor||0x6a72b4)},
      uFogAmt:{value:opts.fogAmt!==undefined?opts.fogAmt:0.4},
      uBaseMist:{value:opts.baseMist!==undefined?opts.baseMist:0.0},
      uBaseY:{value:baseWorld},
      uTopY:{value:opts.topY||(D*0.16)},
      uRough:{value:roughness||1.0},
      uAirMul:{value:opts.airMul !== undefined ? opts.airMul : 1.0},
      uRock:{value:opts.rock !== undefined ? opts.rock : 0.030},
      uHalfH:{value:halfH},
      uBump:{value:opts.bump !== undefined ? opts.bump : 0.30},
      uD:{value:D}
    }, SHARED),
    vertexShader:/* glsl */\`
      varying vec3 vN; varying vec3 vW;
      void main(){
        vec4 w = modelMatrix*vec4(position,1.0);
        vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal);
        gl_Position = projectionMatrix*viewMatrix*w;
      }\`,
    fragmentShader: GLSL_COMMON + /* glsl */\`
      uniform vec2 uResolution; uniform vec3 uTint, uRim, uFog;
      uniform float uTime;
      uniform float uFogAmt, uBaseMist, uBaseY, uTopY, uRough, uD, uRock, uBump, uHalfH;
      varying vec3 vN; varying vec3 vW;

      /* Rock relief is anisotropic — gullies run down the fall line, so the
         domain is stretched vertically before any noise is taken. */
      vec2 rockDomain(vec3 w){ return vec2(w.x*uRock, w.y*uRock*0.42); }
      /* plate and crack are wanted by both the relief and the albedo, so the
         whole field is evaluated once and handed back */
      float rockHeight(vec2 q, out float plate, out float crack, out float grain){
        vec2 wv = vec2(gfbm(q*0.5), gfbm(q*0.5 + 9.1));
        vec2 pp = q + wv*0.70;                         // meander the gullies
        float rid = ridged(pp);
        plate = smoothstep(-0.25, 0.45, gfbm(q*0.34));
        crack = smoothstep(0.32, 0.88, ridged(pp*1.9 + 4.0));
        grain = gfbm(pp*5.2)*0.5 + 0.5;
        return (rid - 0.5)*1.85*mix(0.35, 1.0, plate) - crack*0.44 + grain*0.20;
      }

      void main(){
        vec3 N = normalize(vN);
        vec2 q = rockDomain(vW);
        float plate, crack, grain;
        float h = rockHeight(q, plate, crack, grain);
        /* the finest octaves go sub-pixel on a distant range and turn into a
           diagonal moiré — fade the relief out as its footprint nears a pixel */
        float fp = max(length(dFdx(q)), length(dFdy(q)));
        float sharp = smoothstep(1.05, 0.05, fp);
        N = bumped(N, vW, h, uBump*sharp);

        /* the sun has just gone down behind the range: a very low key light */
        vec3 L = normalize(vec3(0.42, 0.115, -0.90));
        float lam = max(dot(N, L), 0.0);
        float sky = 0.5 + 0.5*N.y;

        vec3 base = s2l(uTint*255.0);
        vec3 c = base * (0.21 + 0.27*sky);
        c += s2l(uRim*255.0) * pow(lam, 1.15) * 0.46;
        c *= 0.55 + 0.75*smoothstep(-0.15, 0.35, dot(N, L));

        /* albedo from the same fields that drove the relief: plates read
           paler and drier, the splits go near-black */
        c *= 1.0 + (0.60*grain - 0.30)*uRough*sharp;
        c *= mix(1.0, mix(0.82, 1.24, plate), sharp);
        c *= 1.0 - 0.68*crack*uRough*sharp;

        /* scree and old snow catching the sky on the upper faces */
        float scree = smoothstep(0.55, 0.95, N.y) * smoothstep(0.30, 0.70, plate);
        c = mix(c, s2l(vec3(150., 152., 190.)), scree*0.30);

        /* aerial perspective — depth-driven, so a range is not one flat wash */
        float d = length(vW - cameraPosition);
        float aer = 1.0 - exp(-d * uFogAmt * 0.0011);
        c = aerial(c, vW, gl_FragCoord.xy/uResolution);

        /* mist banks torn along the foot of the range */
        float hgt = clamp((vW.y - uBaseY) / max(uTopY - uBaseY, 1.0), 0.0, 1.0);
        float b1 = gnoise(vec2(vW.x*0.0022, vW.y*0.011 + 4.7 + uTime*0.006))*0.5 + 0.5;
        float b2 = gnoise(vec2(vW.x*0.0075, vW.y*0.030 - 2.3 - uTime*0.011))*0.5 + 0.5;
        float banks = b1*0.68 + b2*0.32;
        float pool = uBaseMist * pow(1.0 - hgt, 1.45) * smoothstep(0.29, 0.80, banks) * 1.55;
        c = mix(c, s2l(vec3(212., 218., 240.)), clamp(pool, 0.0, 0.92));

        /* the flanks fall away into shadow so the frame still has dark
           shoulders — done in shading, not with a separate see-through mesh */
        float uRef = 0.5 + vW.x / (2.0*uHalfH*uD);
        c *= mix(1.0, 0.30, smoothstep(0.30, -0.15, uRef) + smoothstep(0.70, 1.15, uRef));

        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }\`
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false;
  return m;
}

/* Far range — the pale layer seen through the saddle */
addLayer('mtn', buildRidge({
  profile: makeProfile([[-0.90,0.13],[-0.40,0.24],[0.00,0.34],[0.14,0.325],[0.26,0.37],[0.34,0.385],[0.40,0.425],
                        [0.46,0.455],[0.52,0.448],[0.58,0.425],[0.66,0.40],[0.74,0.372],
                        [0.86,0.335],[1.00,0.31],[1.40,0.235],[1.90,0.12]]),
  D: 3400, depth: 900, uSpan:[0.5-uPad, 0.5+uPad], seg: 260,
  relief: 150, reliefLen: 420, rock: 0.0075, bump: 3.1,
  detail: 0.0115, freq: 0.0058, drop: 0.050, baseV: 1.45, seed: 3.1,
  tint: 0x4b5090, rim: 0xc2a9d4, roughness: 0.45,
  fogColor: 0x969cd4, fogAmt: 0.34, baseMist: 0.52, topY: 840
}));

/* Mid range — the big hazy violet wall that fills most of the skyline.
   Silhouette traced off the reference frame. */
addLayer('mtn', buildRidge({
  profile: makeProfile([[-0.90,-0.20],[-0.40,0.005],[0.02,0.145],[0.10,0.185],[0.16,0.212],[0.20,0.232],[0.24,0.310],[0.28,0.330],
                        [0.32,0.341],[0.355,0.330],[0.40,0.380],[0.44,0.404],[0.475,0.470],
                        [0.50,0.486],[0.525,0.432],[0.56,0.382],[0.60,0.370],[0.64,0.354],
                        [0.68,0.324],[0.71,0.386],[0.745,0.322],[0.80,0.293],[0.85,0.258],
                        [0.90,0.242],[1.00,0.205],[1.40,0.05],[1.90,-0.16]]),
  D: 1500, depth: 620, uSpan:[0.5-uPad, 0.5+uPad], seg: 340,
  relief: 92, reliefLen: 210, rock: 0.017, bump: 5.4,
  detail: 0.0130, freq: 0.0145, drop: 0.070, baseV: 1.45, seed: 17.4,
  tint: 0x3f4382, rim: 0xa98cc6, roughness: 0.85,
  fogColor: 0x7c81c6, fogAmt: 0.34, baseMist: 0.58, topY: 560
}));

/* ══════════════════════════════════════════════════════════════════════
   Valley mist — soft additive planes filling the basin
   ═════════════════════════════════════════════════════════════════════ */
const mistTex = (()=> {
  const s = 256, cv = document.createElement('canvas'); cv.width = cv.height = s;
  const g = cv.getContext('2d');
  const grd = g.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
  grd.addColorStop(0.0,'rgba(255,255,255,1)');
  grd.addColorStop(0.45,'rgba(255,255,255,0.42)');
  grd.addColorStop(1.0,'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0,0,s,s);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
})();

const mistGroup = new THREE.Group(); addLayer('mist', mistGroup);
(function buildMist(){
  const rnd = mulberry(97);
  for (let i=0;i<C.counts.mist;i++){
    const t = i/(C.counts.mist-1);
    const D = 380 + Math.pow(rnd(), 0.7)*2200;
    const u = 0.5 + (rnd()-0.5)*1.15;
    const v = 0.50 + rnd()*0.16;
    const p = unproject(u, v, D);
    const w = D*(0.22 + rnd()*0.42), h = w*(0.22+rnd()*0.16);
    const warm = Math.exp(-Math.pow((u-0.52)/0.30,2));
    const col = new THREE.Color().setRGB(
      0.62+0.34*warm, 0.64+0.30*warm, 0.80+0.18*warm, THREE.SRGBColorSpace);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w,h),
      new THREE.MeshBasicMaterial({ map:mistTex, transparent:true, depthWrite:false,
        blending:THREE.AdditiveBlending, color:col,
        opacity: (0.042 + 0.080*warm) * (0.55 + 0.45*(1-t)) })
    );
    m.position.set(p.x, p.y + (rnd()-0.5)*D*0.03, -D);
    m.userData.drift = { x:p.x, sp:0.6+rnd()*1.4, ph:rnd()*6.283, amp:D*0.006 };
    m.renderOrder = 2;
    mistGroup.add(m);
  }
})();

/* the bright glow pooled at the bottom of the V */
(function valleyGlow(){
  const g = new THREE.Group();
  const spec = [
    { u:0.515, v:0.632, D: 760, w:0.34, h:0.12, o:0.58 },
    { u:0.510, v:0.618, D:1150, w:0.50, h:0.15, o:0.34 },
    { u:0.520, v:0.642, D: 520, w:0.24, h:0.09, o:0.50 },
    { u:0.500, v:0.600, D:1900, w:0.60, h:0.17, o:0.18 }
  ];
  for (const q of spec){
    const p = unproject(q.u, q.v, q.D);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(q.D*q.w, q.D*q.h),
      new THREE.MeshBasicMaterial({ map:mistTex, transparent:true, depthWrite:false,
        blending:THREE.AdditiveBlending, opacity:q.o,
        color:new THREE.Color().setRGB(0.88,0.93,1.0, THREE.SRGBColorSpace) })
    );
    m.position.set(p.x, p.y, -q.D); m.renderOrder = 3;
    g.add(m);
  }
  addLayer('glow', g);
})();

/* ══════════════════════════════════════════════════════════════════════
   Terrain — the flower-covered valley walls
   ═════════════════════════════════════════════════════════════════════ */
(function buildTerrain(){
  const NJ = 190, NI = 260;
  const dNear = 0.35, dFar = V.far;
  const pos = [], idx = [];
  for (let j=0;j<=NJ;j++){
    const t = j/NJ;
    const d = dNear * Math.pow(dFar/dNear, t);
    const spread = halfHb * 1.55;
    for (let i=0;i<=NI;i++){
      const s = (i/NI - 0.5)*2;
      const x = s * spread * d;
      const z = -d;
      pos.push(x, terrainH(x,z), z);
    }
  }
  for (let j=0;j<NJ;j++) for (let i=0;i<NI;i++){
    const a=j*(NI+1)+i, b=a+1, c2=a+NI+1, dd=c2+1;
    idx.push(a,b,c2, b,dd,c2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx); g.computeVertexNormals();

  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uAirMul:{value:0.85} }, SHARED),
    vertexShader:\`
      varying vec3 vN; varying vec3 vW;
      void main(){ vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz;
        vN=normalize(mat3(modelMatrix)*normal);
        gl_Position=projectionMatrix*viewMatrix*w; }\`,
    fragmentShader: GLSL_COMMON + \`
      uniform vec2 uResolution; uniform float uTime, uMouseOn;
      uniform vec3 uMouse;
      varying vec3 vN; varying vec3 vW;
      void main(){
        vec3 n = normalize(vN);
        float d = length(vW - cameraPosition);
        /* dark foliage close in, blue-black once the slope pulls away */
        vec3 nearC = s2l(vec3( 8., 15., 13.));
        vec3 farC  = s2l(vec3( 9., 11., 40.));
        float k = clamp(pow(d/26.0, 0.6), 0.0, 1.0);
        vec3 c = mix(nearC, farC, k);
        float sky = 0.5+0.5*n.y;
        c *= 0.42 + 0.90*sky;
        vec3 L = normalize(vec3(0.30,0.20,-1.0));
        c += s2l(vec3(64.,54.,96.))*pow(max(dot(n,L),0.0),3.5)*0.30;
        /* the clump field decides both where the soil shows and where the
           blossoms sit, so it is taken once, up front */
        float cl0 = vnoise(vec2(vW.x*0.0055, vW.z*0.0055));
        float cl1 = fbm(vec2(vW.x*0.030, vW.z*0.030));
        float clump = smoothstep(0.26, 0.70, cl0*0.44 + cl1*0.56);

        float g1 = fbm(vec2(vW.x*0.75, vW.z*0.75));
        c *= 0.52 + 0.80*g1*(0.5+0.9*clump);

        float openGround = smoothstep(2.0, 9.0, d);          // bare soil right at our feet
        float sA = speckleLayer(vW.xz, 0.52, 0.20, 0.145);
        float sB = speckleLayer(vW.xz + 31.7, 1.35, 0.17, 0.110);
        float blossom = max(sA, sB*0.85) * clump * openGround;
        /* the pointer sweeps the painted blossoms aside as well, or the field
           opens onto a pale bare patch instead of onto shadow */
        vec3 toM = vW - uMouse;
        float press = smoothstep(3.0, 0.0, length(toM*vec3(1.0, 0.5, 1.0))) * uMouseOn;
        press *= press;
        blossom *= 1.0 - press*0.90;
        vec3 Vd = normalize(cameraPosition - vW);
        blossom *= smoothstep(0.012, 0.24, abs(dot(n, Vd)));
        c *= 1.0 - press*0.42;

        vec3 petalC = s2l(vec3(168., 172., 212.));
        float dim = 1.0;
        c = mix(c, petalC*0.50, clamp(blossom, 0.0, 1.0)*0.70);

        /* warm lamps threaded through the field */
        float warmField = smoothstep(0.42, 0.78, vnoise(vec2(vW.x*0.011 + 3.7, vW.z*0.011)));
        float warm = speckleLayer(vW.xz + 101.3, 2.6, 0.16, 0.095) * clump * openGround * warmField;
        c += s2l(vec3(255., 208., 126.)) * warm * 0.95;

        c = aerial(c, vW, gl_FragCoord.xy/uResolution);
        gl_FragColor = vec4(c,1.0);
        #include <colorspace_fragment>
      }\`
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false; m.renderOrder = 5;
  addLayer('terrain', m);
})();

/* ══════════════════════════════════════════════════════════════════════
   Utilities: seeded rng, distributions
   ═════════════════════════════════════════════════════════════════════ */
function mulberry(a){ return function(){
  a|=0; a=a+0x6D2B79F5|0;
  let t=Math.imul(a^a>>>15, 1|a); t=t+Math.imul(t^t>>>7, 61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }

/* the same large-scale clumping the ground shader uses, so billboards and
   the painted carpet thin out over the same patches */
function fieldClump(x,z){
  const c0=fbm2(x*0.0055, z*0.0055), c1=fbm2(x*0.030, z*0.030), c2=fbm2(x*0.13, z*0.13);
  const t=(c0*0.42 + c1*0.42 + c2*0.16 - 0.26)/0.44;
  return Math.max(0, Math.min(1, t*t*(3-2*t)));
}

/* sample a point on the terrain, uniform in ground area so screen density is even */
function scatter(rnd, rMin, rMax, angSpread, bias){
  const u = bias ? Math.pow(rnd(), bias) : rnd();
  const r = Math.sqrt(rMin*rMin + u*(rMax*rMax - rMin*rMin));
  const a = (rnd()-0.5)*angSpread;
  const x = Math.tan(a)*r, z = -r;
  return { x, z, y: terrainH(x,z), r };
}

/* ══════════════════════════════════════════════════════════════════════
   Procedural blossom sprite (used for the mid + far flower layers)
   ═════════════════════════════════════════════════════════════════════ */
/* A spray, not a bloom.  One blossom at this size renders as a little
   asterisk; the reference's mid-field is clusters of florets, so the texture
   carries the whole cluster and each instance is one spray. */
function blossomTexture(size){
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const g = cv.getContext('2d');
  const S = size/64;
  const FLORETS = [
    [32,21,7.6],[21,32,6.2],[43,32,6.4],[26,44,5.2],
    [40,45,5.6],[32,33,4.6],[46,21,4.4],[18,21,4.2],[35,12,3.6],[12,35,3.4]
  ];
  for (let f=0; f<FLORETS.length; f++){
    const cx=FLORETS[f][0]*S, cy=FLORETS[f][1]*S, r=FLORETS[f][2]*S;
    g.save(); g.translate(cx,cy); g.rotate(f*1.31);
    for (let p=0; p<8; p++){
      g.save(); g.rotate((p/8)*Math.PI*2);
      const a = 0.62 + 0.34*(r/(7.6*S));
      const gr = g.createLinearGradient(0, 0, 0, -r*1.15);
      gr.addColorStop(0, \`rgba(190,192,234,\${a})\`);
      gr.addColorStop(0.60, \`rgba(228,232,253,\${a})\`);
      gr.addColorStop(0.92, \`rgba(244,248,255,\${a})\`);
      gr.addColorStop(1, \`rgba(244,248,255,\${a*0.15})\`);
      g.fillStyle = gr;
      g.beginPath(); g.ellipse(0, -r*0.58, r*0.26, r*0.58, 0, 0, Math.PI*2); g.fill();
      g.restore();
    }
    g.fillStyle = 'rgba(244,222,150,0.95)';
    g.beginPath(); g.arc(0,0,r*0.22,0,Math.PI*2); g.fill();
    g.restore();
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  return t;
}
/* a single small blossom, for the layer that still needs to read as one flower */
function singleBlossomTexture(size){
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const g = cv.getContext('2d');
  const c = size/2, R = size*0.44;
  for (let p=0;p<11;p++){
    g.save(); g.translate(c,c); g.rotate((p/11)*Math.PI*2);
    const gr = g.createLinearGradient(0,0,0,-R);
    gr.addColorStop(0,'rgba(184,186,230,1)');
    gr.addColorStop(0.62,'rgba(228,232,252,1)');
    gr.addColorStop(0.94,'rgba(246,248,255,1)');
    gr.addColorStop(1,'rgba(246,248,255,0.12)');
    g.fillStyle = gr;
    g.beginPath(); g.ellipse(0,-R*0.56, R*0.17, R*0.56, 0, 0, Math.PI*2); g.fill();
    g.restore();
  }
  const gc = g.createRadialGradient(c,c,0,c,c,R*0.22);
  gc.addColorStop(0,'rgba(255,238,176,1)');
  gc.addColorStop(1,'rgba(238,196,104,0)');
  g.fillStyle=gc; g.beginPath(); g.arc(c,c,R*0.22,0,Math.PI*2); g.fill();
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  return t;
}
const TEX_BLOSSOM = blossomTexture(256);
const TEX_BLOSSOM_ONE = singleBlossomTexture(160);

function discTexture(size, core, edge){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const g=cv.getContext('2d'); const c=size/2;
  const gr=g.createRadialGradient(c,c,0,c,c,c);
  gr.addColorStop(0,\`rgba(255,255,255,\${core})\`);
  gr.addColorStop(0.62,\`rgba(255,255,255,\${core*0.92})\`);
  gr.addColorStop(0.80,\`rgba(255,255,255,\${edge})\`);
  gr.addColorStop(0.93,\`rgba(255,255,255,\${edge*0.30})\`);
  gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr; g.fillRect(0,0,size,size);
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t;
}
const TEX_BOKEH = discTexture(160, 1.0, 0.72);
const TEX_GLINT = discTexture(64, 1.0, 0.02);

/* ══════════════════════════════════════════════════════════════════════
   Far + mid flower layers — instanced billboards
   ═════════════════════════════════════════════════════════════════════ */
function flowerBillboards({ count, rMin, rMax, sizeMin, sizeMax, seed, tint, glow, liftMin=0.10, liftMax=0.30, bias=1, map }){
  const g = new THREE.InstancedBufferGeometry();
  const base = new THREE.PlaneGeometry(1,1);
  g.index = base.index;
  g.attributes.position = base.attributes.position;
  g.attributes.uv = base.attributes.uv;

  const off = new Float32Array(count*3);
  const scl = new Float32Array(count);
  const rot = new Float32Array(count);
  const rnd_ = new Float32Array(count*2);
  const col = new Float32Array(count*3);
  const grz = new Float32Array(count);
  const rnd = mulberry(seed);
  const c = new THREE.Color();
  for (let i=0;i<count;i++){
    let p = scatter(rnd, rMin, rMax, ANG, bias);
    /* skip the bare patches so the slopes clump like the reference */
    let tries = 0;
    while (tries++ < 6 && fieldClump(p.x, p.z) < rnd()) p = scatter(rnd, rMin, rMax, ANG, bias);
    const lift = liftMin + rnd()*(liftMax-liftMin);
    off[i*3]=p.x; off[i*3+1]=p.y+lift; off[i*3+2]=p.z;
    scl[i] = sizeMin + rnd()*(sizeMax-sizeMin);
    rot[i] = rnd()*6.283;
    rnd_[i*2]=rnd(); rnd_[i*2+1]=rnd();
    const h = tint[0] + (rnd()-0.5)*tint[1];
    c.setHSL(h, 0.30+rnd()*0.35, 0.72+rnd()*0.22);
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    /* The camera never moves, so incidence can be baked.  Without this the
       slopes pile every blossom into one saturated strip exactly where the
       ground goes grazing — the field's flat white horizon line. */
    const gn = terrainNormal(p.x, p.z, Math.max(0.05, p.r*0.02));
    const vl = Math.hypot(p.x, p.y, p.z) || 1;
    grz[i] = Math.abs((gn.x*p.x + gn.y*p.y + gn.z*p.z) / vl);
  }
  g.setAttribute('iOff', new THREE.InstancedBufferAttribute(off,3));
  g.setAttribute('iScale', new THREE.InstancedBufferAttribute(scl,1));
  g.setAttribute('iRot', new THREE.InstancedBufferAttribute(rot,1));
  g.setAttribute('iRnd', new THREE.InstancedBufferAttribute(rnd_,2));
  g.setAttribute('iCol', new THREE.InstancedBufferAttribute(col,3));
  g.setAttribute('iGrz', new THREE.InstancedBufferAttribute(grz,1));
  g.instanceCount = count;

  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uMap:{value:map||TEX_BLOSSOM}, uGlow:{value:glow}, uAirMul:{value:0.9} }, SHARED),
    transparent:true, depthWrite:false, blending:THREE.NormalBlending,
    vertexShader: GLSL_AIR_VS + \`
      varying float vAirT; varying vec3 vAirCol;
      attribute vec3 iOff; attribute float iScale; attribute float iRot;
      attribute vec2 iRnd; attribute vec3 iCol; attribute float iGrz;
      varying vec2 vUv; varying vec3 vCol; varying float vTw; varying float vD; varying float vFade; varying float vShadow; varying vec3 vWpos;
      uniform float uTime, uMouseR, uMouseOn; uniform vec3 uMouse;
      uniform vec2 uResolution;
      void main(){
        vUv = uv; vCol = iCol;
        float tw = 0.55 + 0.45*sin(uTime*(0.6+iRnd.x*1.9) + iRnd.y*31.4);
        vTw = tw;
        /* the cursor shoulders these aside too — otherwise parting the grass
           in front of them just uncovers a pale sheet of blossom */
        vec3 anchor = iOff;
        vec3 toB = anchor - uMouse;
        float infl = smoothstep(uMouseR*1.6, 0.0, length(toB*vec3(1.0, 0.5, 1.0))) * uMouseOn;
        infl *= infl;
        vec3 away = vec3(toB.x, 0.0, toB.z);
        float al = length(away);
        anchor += (al > 1e-4 ? away/al : vec3(1.0,0.0,0.0)) * infl * 0.30;
        anchor.y -= infl*0.12;
        /* parting the grass opens a shadow, so what gets uncovered has to go
           DOWN in value — otherwise the gap reads as a pale hole in the field */
        float shade = smoothstep(uMouseR*2.4, 0.0, length(toB*vec3(1.0, 0.45, 1.0))) * uMouseOn;
        vShadow = 1.0 - shade*shade*0.88;
        vTw *= 1.0 - infl*0.45;
        vec4 mv = viewMatrix*vec4(anchor,1.0);
        float s = iScale;
        float ca = cos(iRot), sa = sin(iRot);
        vec2 q = vec2(position.x*ca - position.y*sa, position.x*sa + position.y*ca)*s;
        mv.xy += q;
        vD = -mv.z; vWpos = anchor;
        vec4 clip = projectionMatrix*mv;
        /* projected radius in pixels; fade below ~1px so the far slopes stay soft */
        float pr = s * uResolution.y * projectionMatrix[1][1] / max(-mv.z, 0.05);
        vFade = clamp(pr*0.85, 0.10, 1.0) * smoothstep(0.012, 0.24, iGrz);
        airVertex(anchor, clip, vAirT, vAirCol);
        gl_Position = clip;
      }\`,
    fragmentShader: GLSL_COMMON + GLSL_AIR_FS + \`
      uniform sampler2D uMap; uniform float uGlow; uniform vec2 uResolution;
      varying vec2 vUv; varying vec3 vCol; varying float vTw; varying float vD; varying float vFade; varying float vShadow; varying vec3 vWpos;
      void main(){
        vec4 t = texture2D(uMap, vUv);
        if (t.a < 0.004) discard;
        vec3 c = s2l(vCol*255.0) * (0.42 + 0.72*vTw) * uGlow * vShadow;
        c = airFrag(c);
        gl_FragColor = vec4(c, t.a*vFade);
        #include <colorspace_fragment>
      }\`
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false;
  return m;
}

const farFlowers = flowerBillboards({ count:C.counts.far, rMin:30, rMax:170, bias:1.2, map:TEX_BLOSSOM,
  sizeMin:0.048, sizeMax:0.090, seed:11, tint:[0.72,0.14], glow:0.60,
  liftMin:0.05, liftMax:0.20 });
farFlowers.renderOrder = 10; window.__farMesh = farFlowers; addLayer('far', farFlowers);

const midFlowers = flowerBillboards({ count:C.counts.mid, rMin:3.2, rMax:52, bias:1.5, map:TEX_BLOSSOM_ONE,
  sizeMin:0.034, sizeMax:0.074, seed:23, tint:[0.73,0.12], glow:0.34,
  liftMin:0.07, liftMax:0.26 });
midFlowers.renderOrder = 11; window.__midMesh = midFlowers; addLayer('mid', midFlowers);

/* ══════════════════════════════════════════════════════════════════════
   Sparkles — the dew glints threaded through the slopes
   ═════════════════════════════════════════════════════════════════════ */
(function sparkles(){
  const n = C.counts.sparkle;
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(n*3), sz = new Float32Array(n), rn = new Float32Array(n*2);
  const rnd = mulberry(404);
  for (let i=0;i<n;i++){
    const p = scatter(rnd, 1.6, 160, ANG, 1.45);
    pos[i*3]=p.x; pos[i*3+1]=p.y + 0.05 + rnd()*0.5; pos[i*3+2]=p.z;
    sz[i] = 0.016 + 0.085*Math.pow(rnd(), 2.2);
    rn[i*2]=rnd(); rn[i*2+1]=rnd();
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sz,1));
  g.setAttribute('aRnd', new THREE.BufferAttribute(rn,2));
  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uMap:{value:TEX_GLINT}, uPR:{value:1} }, SHARED),
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:\`
      attribute float aSize; attribute vec2 aRnd;
      uniform float uTime; uniform float uPR;
      varying float vA; varying vec3 vC;
      void main(){
        vec4 mv = viewMatrix*vec4(position,1.0);
        float tw = sin(uTime*(0.8+aRnd.x*2.4) + aRnd.y*47.0);
        tw = pow(max(tw,0.0), 1.6);
        vA = 0.20 + 0.80*tw;
        vC = mix(vec3(1.0,0.94,0.78), vec3(0.82,0.90,1.0), aRnd.x);
        gl_PointSize = clamp(aSize*(1.0+tw*0.7)*84.0*uPR/max(-mv.z,0.7), 1.0, 9.0);
        gl_Position = projectionMatrix*mv;
      }\`,
    fragmentShader:\`
      uniform sampler2D uMap; varying float vA; varying vec3 vC;
      void main(){
        float a = texture2D(uMap, gl_PointCoord).a;
        gl_FragColor = vec4(min(vC*vA*1.5, vec3(12.0)), clamp(a*vA,0.0,1.0));
        #include <colorspace_fragment>
      }\`
  });
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false; pts.renderOrder = 12;
  addLayer('spark', pts);
  window.__sparkMat = mat;
})();

/* ══════════════════════════════════════════════════════════════════════
   Stars — only where the sky is dark enough to hold them
   ═════════════════════════════════════════════════════════════════════ */
(function stars(){
  const COUNT = C.counts.star;
  const pos = new Float32Array(COUNT*3), rnd4 = new Float32Array(COUNT*4);
  const rnd = mulberry(8123);
  let n = 0;
  for (let i=0;i<COUNT;i++){
    /* a dome, biased toward the zenith where the twilight has already gone */
    const az = (rnd()-0.5)*3.4;
    const el = Math.pow(rnd(), 0.62)*1.25 + 0.03;
    const R = 4000;
    pos[n*3]   = Math.sin(az)*Math.cos(el)*R;
    pos[n*3+1] = Math.sin(el)*R;
    pos[n*3+2] = -Math.cos(az)*Math.cos(el)*R;
    /* magnitude follows a power law: a handful bright, a great many faint */
    rnd4[n*4]   = 0.20 + 0.80*Math.pow(rnd(), 2.6);
    rnd4[n*4+1] = rnd()*6.28318;
    rnd4[n*4+2] = 0.4 + rnd()*1.8;
    rnd4[n*4+3] = rnd();
    n++;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aStar', new THREE.BufferAttribute(rnd4,4));
  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uMap:{value:TEX_GLINT}, uPR:{value:1} }, SHARED),
    transparent:true, depthWrite:false, depthTest:false, blending:THREE.AdditiveBlending,
    vertexShader: GLSL_SKY + \`
      attribute vec4 aStar;
      uniform float uTime, uPR; uniform vec2 uResolution;
      varying float vA; varying vec3 vC;
      void main(){
        vec4 mv = viewMatrix*vec4(position,1.0);
        vec4 clip = projectionMatrix*mv;
        /* Fade against the sky's own brightness in this direction.  Twilight
           drowns stars near the horizon long before it does at the zenith,
           and a uniform field of them reads as dust on the lens. */
        vec2 uv = (clip.xy/clip.w)*0.5 + 0.5;
        vec3 sky = skyColor(uv);
        float lum = dot(sky, vec3(0.2126,0.7152,0.0722));
        float room = smoothstep(0.75, 0.13, lum);
        float tw = 0.62 + 0.38*sin(uTime*(0.5 + aStar.z*1.4) + aStar.y);
        vA = aStar.x * room * tw * 1.55;
        vC = mix(vec3(1.0,0.94,0.86), vec3(0.80,0.88,1.0), aStar.w);
        gl_PointSize = clamp((1.0 + 3.4*aStar.x)*uPR, 1.2, 6.0);
        gl_Position = clip;
      }\`,
    fragmentShader:\`
      uniform sampler2D uMap; varying float vA; varying vec3 vC;
      void main(){
        if (vA < 0.006) discard;
        float a = texture2D(uMap, gl_PointCoord).a;
        gl_FragColor = vec4(min(vC*vA*1.5, vec3(12.0)), clamp(a*vA, 0.0, 1.0));
      }\`
  });
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false; pts.renderOrder = -900;   // behind everything but the sky
  addLayer('star', pts);
  window.__starMat = mat;
})();

/* ══════════════════════════════════════════════════════════════════════
   Pollen — the puff the pointer knocks off the blooms it brushes past.
   Emission is by DISTANCE, not by time: a fast sweep lays a trail instead of
   stacking a clump wherever the cursor happened to land, and a pointer that
   has stopped trickles instead of pumping.
   ═════════════════════════════════════════════════════════════════════ */
const POLLEN_N = 900, POLLEN_LIFE = 2.6;
const pollen = (function(){
  const pos = new Float32Array(POLLEN_N*3), vel = new Float32Array(POLLEN_N*3);
  const birth = new Float32Array(POLLEN_N), rnd = new Float32Array(POLLEN_N*2);
  for (let i=0;i<POLLEN_N;i++) birth[i] = -999;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('aVel', new THREE.BufferAttribute(vel,3));
  g.setAttribute('aBirth', new THREE.BufferAttribute(birth,1));
  g.setAttribute('aRnd', new THREE.BufferAttribute(rnd,2));
  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uMap:{value:TEX_GLINT}, uPR:{value:1}, uLife:{value:POLLEN_LIFE} }, SHARED),
    transparent:true, depthWrite:false, depthTest:true, blending:THREE.AdditiveBlending,
    vertexShader:\`
      attribute vec3 aVel; attribute float aBirth; attribute vec2 aRnd;
      uniform float uTime, uPR, uLife;
      varying float vA; varying vec3 vC;
      void main(){
        float age = uTime - aBirth;
        if (age < 0.0 || age > uLife){ vA = 0.0; gl_PointSize = 0.0; gl_Position = vec4(2.0,2.0,2.0,1.0); return; }
        float u = age/uLife;
        /* drag on the launch velocity, a slow lift, and a little wander */
        vec3 p = position + aVel*age*(1.0 - 0.42*u)
               + vec3(sin(aRnd.y*6.28 + age*2.4)*0.045*u, 0.10*age, cos(aRnd.y*5.11 + age*1.9)*0.035*u);
        vec4 mv = viewMatrix*vec4(p,1.0);
        gl_PointSize = clamp((2.6 + 5.4*aRnd.x)*uPR/max(-mv.z, 0.9), 1.0, 13.0)*(0.45 + 0.55*(1.0-u));
        vA = smoothstep(0.0, 0.10, u)*(1.0 - smoothstep(0.35, 1.0, u));
        vC = mix(vec3(1.0,0.95,0.80), vec3(0.84,0.92,1.0), aRnd.x);
        gl_Position = projectionMatrix*mv;
      }\`,
    fragmentShader:\`
      uniform sampler2D uMap; varying float vA; varying vec3 vC;
      void main(){
        float a = texture2D(uMap, gl_PointCoord).a;
        gl_FragColor = vec4(min(vC*vA*1.6, vec3(12.0)), clamp(a*vA*0.85, 0.0, 1.0));
      }\`
  });
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false; pts.renderOrder = 44;
  scene.add(pts);
  return { g, pos, vel, birth, rnd, mat, head: 0, carry: 0, dirty: false };
})();

function spawnPollen(at, moved){
  /* one puff per ~4 cm of travel, plus a slow trickle when resting */
  pollen.carry += moved*26.0 + 0.06;
  let n = Math.min(Math.floor(pollen.carry), 5);
  if (n <= 0) return;
  pollen.carry -= n;
  const t = uTime.value;
  while (n-- > 0){
    const i = pollen.head; pollen.head = (pollen.head + 1) % POLLEN_N;
    const o = i*3;
    pollen.pos[o]   = at.x + (Math.random()-0.5)*0.30;
    pollen.pos[o+1] = at.y + 0.05 + Math.random()*0.22;
    pollen.pos[o+2] = at.z + (Math.random()-0.5)*0.30;
    pollen.vel[o]   = (Math.random()-0.5)*0.42;
    pollen.vel[o+1] = 0.10 + Math.random()*0.34;
    pollen.vel[o+2] = (Math.random()-0.5)*0.42;
    pollen.birth[i] = t;
    pollen.rnd[i*2] = Math.random(); pollen.rnd[i*2+1] = Math.random();
  }
  pollen.dirty = true;
}

/* ══════════════════════════════════════════════════════════════════════
   Motes — pollen drifting through the valley air.  Sizes follow a power law:
   a few big soft ones near the lens, a great many specks behind them.  Each
   one climbs on its own wrapped loop, and the band fade hides the wrap.
   ═════════════════════════════════════════════════════════════════════ */
(function motes(){
  const COUNT = C.counts.mote;
  const pos = new Float32Array(COUNT*3), seed = new Float32Array(COUNT*4);
  const rnd = mulberry(31337);
  for (let i=0;i<COUNT;i++){
    /* log-uniform in depth so the near lens gets its few big soft ones */
    const d = 1.2 * Math.pow(320/1.2, rnd());
    const ax = (rnd()-0.5)*2*Math.tan(ANG*0.62)*d;
    const ay = terrainH(ax, -d) + 0.2 + rnd()*Math.min(6 + d*0.35, 40);
    pos[i*3]=ax; pos[i*3+1]=ay; pos[i*3+2]=-d;
    seed[i*4]   = rnd()*6.28318;                      // phase
    seed[i*4+1] = 0.25 + rnd()*0.90;                  // speed
    seed[i*4+2] = 0.40 + rnd()*1.40;                  // sway
    seed[i*4+3] = 0.55 + 1.15*Math.pow(rnd(), 2.4);   // size — power law
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,4));
  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uMap:{value:TEX_GLINT}, uPR:{value:1} }, SHARED),
    transparent:true, depthWrite:false, depthTest:true, blending:THREE.AdditiveBlending,
    vertexShader:\`
      attribute vec4 seed; uniform float uTime, uPR;
      varying float vFade; varying vec3 vC;
      void main(){
        float ph=seed.x, sp=seed.y, am=seed.z;
        vec3 p = position;
        float span = 2.0 + 0.06*(-position.z);
        p.x += sin(uTime*sp*0.30 + ph)*0.28*am*(1.0+(-position.z)*0.02);
        float climb = mod(uTime*0.16*sp + ph*0.42, 1.0);
        p.y += (climb - 0.5)*span;
        p.z += cos(uTime*sp*0.24 + ph)*0.22*am;
        vec4 mv = viewMatrix*vec4(p,1.0);
        float twinkle = 0.45 + 0.55*sin(uTime*(0.6+sp*1.7) + ph*3.1);
        float edge = 1.0 - abs(climb-0.5)*2.0;
        vFade = clamp(edge*2.6, 0.0, 1.0) * twinkle;
        vC = mix(vec3(1.0,0.93,0.76), vec3(0.80,0.88,1.0), fract(ph*0.618));
        gl_PointSize = clamp(seed.w * 13.0 * uPR / max(-mv.z, 0.9), 1.0, 16.0);
        gl_Position = projectionMatrix*mv;
      }\`,
    fragmentShader:\`
      uniform sampler2D uMap; varying float vFade; varying vec3 vC;
      void main(){
        float a = texture2D(uMap, gl_PointCoord).a;
        gl_FragColor = vec4(min(vC*vFade*0.85, vec3(12.0)), clamp(a*vFade*0.26,0.0,1.0));
      }\`
  });
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false; pts.renderOrder = 28;
  addLayer('mote', pts);
  window.__moteMat = mat;
})();

/* ══════════════════════════════════════════════════════════════════════
   Bokeh orbs
   ═════════════════════════════════════════════════════════════════════ */
const BOKEH_PALETTE = [
  [1.00,0.82,0.42],[1.00,0.90,0.62],[1.00,0.42,0.30],[0.36,1.00,0.52],
  [0.42,0.86,1.00],[0.62,0.50,1.00],[1.00,0.62,0.80],[0.96,1.00,0.86],
  [1.00,0.30,0.36],[0.30,0.72,1.00]
];
function bokehLayer({count, rMin, rMax, sizeMin, sizeMax, seed, warmBias, opacity}){
  const g = new THREE.InstancedBufferGeometry();
  const base = new THREE.PlaneGeometry(1,1);
  g.index = base.index; g.attributes.position = base.attributes.position; g.attributes.uv = base.attributes.uv;
  const off=new Float32Array(count*3), scl=new Float32Array(count),
        col=new Float32Array(count*3), rn=new Float32Array(count*2);
  const rnd = mulberry(seed);
  for (let i=0;i<count;i++){
    const p = scatter(rnd, rMin, rMax, ANG*0.95);
    off[i*3]=p.x; off[i*3+1]=p.y + 0.02 + rnd()*0.35*Math.min(1+p.r*0.03,4); off[i*3+2]=p.z;
    scl[i]= (sizeMin + Math.pow(rnd(),1.8)*(sizeMax-sizeMin)) * (0.6+p.r*0.05);
    const useWarm = rnd() < warmBias;
    const pal = useWarm ? BOKEH_PALETTE[Math.floor(rnd()*2)] : BOKEH_PALETTE[Math.floor(rnd()*BOKEH_PALETTE.length)];
    col[i*3]=pal[0]; col[i*3+1]=pal[1]; col[i*3+2]=pal[2];
    rn[i*2]=rnd(); rn[i*2+1]=rnd();
  }
  g.setAttribute('iOff',new THREE.InstancedBufferAttribute(off,3));
  g.setAttribute('iScale',new THREE.InstancedBufferAttribute(scl,1));
  g.setAttribute('iCol',new THREE.InstancedBufferAttribute(col,3));
  g.setAttribute('iRnd',new THREE.InstancedBufferAttribute(rn,2));
  g.instanceCount = count;
  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uMap:{value:TEX_BOKEH}, uOpacity:{value:opacity} }, SHARED),
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:\`
      attribute vec3 iOff; attribute float iScale; attribute vec3 iCol; attribute vec2 iRnd;
      uniform float uTime; varying vec2 vUv; varying vec3 vCol; varying float vA;
      void main(){
        vUv=uv; vCol=iCol;
        float tw = 0.5+0.5*sin(uTime*(0.35+iRnd.x*1.3)+iRnd.y*29.0);
        vA = 0.45+0.55*tw;
        vec4 mv = viewMatrix*vec4(iOff,1.0);
        mv.xy += position.xy*iScale*(0.9+tw*0.18);
        gl_Position = projectionMatrix*mv;
      }\`,
    fragmentShader:\`
      uniform sampler2D uMap; uniform float uOpacity;
      varying vec2 vUv; varying vec3 vCol; varying float vA;
      void main(){
        vec4 t = texture2D(uMap,vUv);
        vec3 c = pow(vCol, vec3(2.6));
        gl_FragColor = vec4(min(c*t.a*vA*uOpacity*2.0, vec3(12.0)), clamp(t.a*vA*uOpacity,0.0,1.0));
        #include <colorspace_fragment>
      }\`
  });
  const m = new THREE.Mesh(g, mat); m.frustumCulled=false; return m;
}
const bokehNear = bokehLayer({count:C.counts.bokehNear, rMin:0.9, rMax:8,
  sizeMin:0.009, sizeMax:0.052, seed:77, warmBias:0.44, opacity:0.72});
bokehNear.renderOrder = 30; addLayer('bokeh', bokehNear);
const bokehMid = bokehLayer({count:C.counts.bokehMid, rMin:8, rMax:70,
  sizeMin:0.012, sizeMax:0.028, seed:78, warmBias:0.72, opacity:0.60});
bokehMid.renderOrder = 29; addLayer('bokeh', bokehMid);

/* ══════════════════════════════════════════════════════════════════════
   Foreground daisies — real petal geometry + thin-film iridescence
   ═════════════════════════════════════════════════════════════════════ */
function daisyGeometry({petals=16, segU=6, segV=2}){
  const geos = [];
  const DISC = 0.058;
  for (let p=0;p<petals;p++){
    const a0 = (p/petals)*Math.PI*2;
    const jit = Math.abs((Math.sin(p*12.9898)*43758.5453) % 1);
    const lenJ = 0.90 + jit*0.20;
    const pos=[], uvA=[], idx=[], meta=[], nrm=[];
    for (let j=0;j<=segU;j++){
      const u = j/segU;
      /* the blade of the petal keeps a little width right to the end so the
         tip can carry a notch — a petal tapered to a point reads as a star */
      const w = 0.062 * Math.pow(u, 0.34) * Math.sqrt(Math.max(0, 1 - Math.pow(u, 14)*0.88));
      for (let k=0;k<=segV;k++){
        const v = k/segV*2-1;
        /* the tip is notched: shorter along the midline than at its shoulders */
        const notch = 0.055 * Math.pow(Math.max(u-0.86,0)/0.14, 2) * (1 - v*v);
        const len = (DISC*0.85 + u*(0.5 - DISC*0.85)) * lenJ * (1 - notch);
        /* a keel down the midrib, and a cup that opens out toward the tip —
           a flat card catches one flat highlight and reads as paper */
        const keel = 0.019*(1 - v*v)*Math.sin(Math.pow(u,0.7)*Math.PI);
        const cup  = -0.034*(1 - u*0.55)*v*v;
        const lift = 0.075*u*u - 0.06*Math.pow(u,3.4);
        const px = len, py = lift + cup + keel, pz = v*w;
        const cx = Math.cos(a0)*px - Math.sin(a0)*pz;
        const cz = Math.sin(a0)*px + Math.cos(a0)*pz;
        pos.push(cx, py, cz);
        uvA.push(u, (v+1)*0.5);
        meta.push(u, p/petals, 0.0);
      }
    }
    for (let j=0;j<segU;j++) for (let k=0;k<segV;k++){
      const a=j*(segV+1)+k, b=a+1, c2=a+segV+1, d=c2+1;
      idx.push(a,b,c2, b,d,c2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvA,2));
    g.setAttribute('aMeta', new THREE.Float32BufferAttribute(meta,3));
    g.setIndex(idx);
    g.computeVertexNormals();
    geos.push(g);
  }
  /* the disc is a raised cushion, not a flat plate — the florets sit on a dome */
  {
    const RINGS = 3, SEG = 20, pos=[], uvA=[], idx=[], meta=[];
    for (let r=0;r<=RINGS;r++){
      const t = r/RINGS;
      const rad = DISC*t;
      const y = 0.030*Math.cos(t*Math.PI*0.5) - 0.002;
      for (let i=0;i<=SEG;i++){
        const a = i/SEG*Math.PI*2;
        pos.push(Math.cos(a)*rad, y, Math.sin(a)*rad);
        uvA.push(0.5 + Math.cos(a)*t*0.5, 0.5 + Math.sin(a)*t*0.5);
        meta.push(t, 0, 1);
      }
    }
    for (let r=0;r<RINGS;r++) for (let i=0;i<SEG;i++){
      const a=r*(SEG+1)+i, b=a+1, c2=a+SEG+1, d=c2+1;
      idx.push(a,c2,b, b,c2,d);
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvA,2));
    g.setAttribute('aMeta', new THREE.Float32BufferAttribute(meta,3));
    g.setIndex(idx); g.computeVertexNormals(); geos.push(g);
  }
  /* calyx: the green collar of sepals the bloom actually sits in */
  {
    const SEG = 12, pos=[], uvA=[], idx=[], meta=[];
    for (let i=0;i<=SEG;i++){
      const a = i/SEG*Math.PI*2;
      const wob = 1.0 + 0.16*Math.sin(a*7.0);
      pos.push(Math.cos(a)*DISC*0.92*wob, -0.012, Math.sin(a)*DISC*0.92*wob);
      pos.push(Math.cos(a)*DISC*0.34, -0.115, Math.sin(a)*DISC*0.34);
      uvA.push(i/SEG, 0, i/SEG, 1);
      meta.push(0.0,0,3, 1.0,0,3);
    }
    for (let i=0;i<SEG;i++){ const a=i*2; idx.push(a,a+2,a+1, a+1,a+2,a+3); }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvA,2));
    g.setAttribute('aMeta', new THREE.Float32BufferAttribute(meta,3));
    g.setIndex(idx); g.computeVertexNormals(); geos.push(g);
  }
  /* stem: a thin tapered strip hanging below the bloom */
  {
    const N=5, pos=[], uvA=[], idx=[], meta=[];
    for (let j=0;j<=N;j++){
      const t=j/N;
      const y = -0.10 - t*2.2;
      const w = 0.020*(1.0 - 0.35*t);
      const bend = 0.16*t*t;
      pos.push(-w, y, bend, w, y, bend);
      uvA.push(0, t, 1, t);
      meta.push(t,0,2, t,0,2);
    }
    for (let j=0;j<N;j++){ const a=j*2; idx.push(a,a+1,a+2, a+1,a+3,a+2); }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvA,2));
    g.setAttribute('aMeta', new THREE.Float32BufferAttribute(meta,3));
    g.setIndex(idx); g.computeVertexNormals(); geos.push(g);
  }
  return BufferGeometryUtils.mergeGeometries(geos, false);
}

const DAISY = daisyGeometry({});

(function foreground(){
  const count = C.counts.fg;
  const g = new THREE.InstancedBufferGeometry();
  g.index = DAISY.index;
  g.attributes.position = DAISY.attributes.position;
  g.attributes.uv = DAISY.attributes.uv;
  g.attributes.aMeta = DAISY.attributes.aMeta;

  const mtx = [], iRnd = new Float32Array(count*4), iRnd2 = new Float32Array(count*4);
  const rnd = mulberry(2024);
  const dummy = new THREE.Object3D();
  const mArr = new Float32Array(count*16);
  let n = 0;
  for (let i=0;i<count;i++){
    const p = scatter(rnd, 0.90, 8.5 + C.scroll.travel, ANG*1.12, 1.0);
    const nrm = terrainNormal(p.x, p.z);
    const stem = 0.16 + rnd()*0.19;
    const size = 0.105 + rnd()*0.088;
    dummy.position.set(p.x, p.y + stem, p.z);
    // tip the bloom to face up-and-toward the camera
    const up = new THREE.Vector3(0,1,0).lerp(nrm, 0.25).normalize();
    const toCam = new THREE.Vector3(-p.x, 0.55, -p.z).normalize();
    const face = up.clone().lerp(toCam, 0.12 + rnd()*0.46).normalize();
    face.x += (rnd()-0.5)*0.34; face.z += (rnd()-0.5)*0.34; face.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), face);
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), rnd()*6.283));
    dummy.quaternion.copy(q);
    dummy.scale.setScalar(size);
    dummy.updateMatrix();
    dummy.matrix.toArray(mArr, n*16);
    iRnd[n*4]=rnd(); iRnd[n*4+1]=rnd(); iRnd[n*4+2]=rnd(); iRnd[n*4+3]=rnd();
    /* how many petals this bloom actually carries, how hard they curl, how far
       open it is, and how broad its petals are — a field of identical daisies
       is the single clearest tell that they were stamped from one mesh */
    iRnd2[n*4]   = 0.74 + rnd()*0.30;              // petal-count threshold
    iRnd2[n*4+1] = 0.35 + rnd()*1.35;              // curl
    iRnd2[n*4+2] = rnd() < 0.085 ? 0.22 + rnd()*0.32 : 0.82 + rnd()*0.26;  // openness (buds)
    iRnd2[n*4+3] = 0.72 + rnd()*0.62;              // petal width
    n++;
  }
  g.setAttribute('iMat0', new THREE.InstancedBufferAttribute(mArr,16));
  const im = new THREE.InstancedBufferAttribute(mArr,16);
  g.setAttribute('iRnd', new THREE.InstancedBufferAttribute(iRnd,4));
  g.setAttribute('iRnd2', new THREE.InstancedBufferAttribute(iRnd2,4));
  g.instanceCount = n;

  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uAirMul:{value:0.85} }, SHARED), side: THREE.DoubleSide, transparent:true, depthWrite:true,
    vertexShader: GLSL_AIR_VS + \`
      varying float vAirT; varying vec3 vAirCol;
      attribute mat4 iMat0; attribute vec4 iRnd; attribute vec4 iRnd2; attribute vec3 aMeta;
      varying vec3 vMeta; varying vec4 vRnd; varying vec3 vN; varying vec3 vW; varying vec2 vUv;
      varying float vPart; varying float vOpen;
      uniform float uTime, uMouseR, uMouseOn;
      uniform vec3 uMouse;
      void main(){
        vMeta=aMeta; vRnd=iRnd; vUv=uv; vOpen=iRnd2.z;
        vec3 p = position;

        /* ── per-bloom form ───────────────────────────────────────────────
           Petals past this bloom's own count collapse into the disc, so the
           instance carries 11 to 16 of them instead of always 16. */
        if (aMeta.z < 0.5 && aMeta.y > iRnd2.x){ p = vec3(0.0); }
        else if (aMeta.z < 0.5){
          float u2 = aMeta.x;
          vec2 radial = vec2(p.x, p.z);
          float rl = length(radial);
          if (rl > 1e-5){
            /* openness folds the petals back up toward the bud, and the curl
               varies how far each one cups along its length */
            float shrink = mix(0.34, 1.0, clamp(iRnd2.z, 0.0, 1.2));
            radial *= mix(1.0, shrink, u2);
            p.x = radial.x; p.z = radial.y;
            p.y  = p.y*iRnd2.y + (1.0 - clamp(iRnd2.z, 0.0, 1.0))*u2*u2*0.42;
            /* broader or finer petals, bloom by bloom */
            vec2 tangent = vec2(-radial.y, radial.x);
            float tl = length(tangent);
            if (tl > 1e-5){
              vec2 across = tangent/tl;
              float w = dot(vec2(p.x, p.z), across);
              p.x += across.x * w * (iRnd2.w - 1.0);
              p.z += across.y * w * (iRnd2.w - 1.0);
            }
          }
        }
        float sway = sin(uTime*0.55 + iRnd.x*30.0)*0.010 + sin(uTime*0.31 + iRnd.y*17.0)*0.006;
        p.x += sway*aMeta.x; p.z += sway*0.6*aMeta.x;
        vec4 w = modelMatrix * iMat0 * vec4(p,1.0);

        /* how far up its own stem this vertex sits — the bloom swings, the
           root of the stem does not */
        float lever = clamp((position.y + 2.30)/2.42, 0.0, 1.0);
        lever *= lever;
        vec3 anchor = (modelMatrix * iMat0 * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

        /* the same wind fronts the grass rides */
        float wave = dot(anchor.xz, vec2(0.62, 0.78))*0.62 - uTime*1.05;
        vec2 gust = vec2(sin(wave)*0.030 + sin(wave*0.41 + 1.7)*0.018, 0.0);
        w.x += gust.x*lever; w.z += gust.x*0.55*lever;

        /* and the cursor pushes them aside */
        vec3 toB = anchor - uMouse;
        float infl = smoothstep(uMouseR*1.5, 0.0, length(toB*vec3(1.0, 0.45, 1.0))) * uMouseOn;
        infl *= infl;
        vec3 away = vec3(toB.x, 0.0, toB.z);
        float al = length(away);
        away = al > 1e-4 ? away/al : vec3(1.0, 0.0, 0.0);
        w.xyz += away * infl * lever * 0.30;
        w.y   -= infl * lever * 0.12;
        vPart = infl;

        vW = w.xyz;
        vec3 nl = normalize(vec3(0.0,1.0,0.0) + vec3(aMeta.x*0.0, 0.0, 0.0));
        vN = normalize((modelMatrix*iMat0*vec4(nl,0.0)).xyz);
        vec4 clip = projectionMatrix*viewMatrix*w;
        airVertex(w.xyz, clip, vAirT, vAirCol);
        gl_Position = clip;
      }\`,
    fragmentShader: GLSL_COMMON + GLSL_AIR_FS + \`
      uniform vec2 uResolution; uniform float uTime;
      varying vec3 vMeta; varying vec4 vRnd; varying vec3 vN; varying vec3 vW; varying vec2 vUv;
      varying float vPart; varying float vOpen;
      void main(){
        float u = vMeta.x, pid = vMeta.y, part = vMeta.z;
        vec2 uvS = gl_FragCoord.xy/uResolution;
        vec3 V = normalize(cameraPosition - vW);
        vec3 N = normalize(vN);
        vec3 L = normalize(vec3(0.42, 0.115, -0.90));
        float fres = pow(1.0 - abs(dot(N,V)), 2.0);
        float vv = abs(vUv.y*2.0 - 1.0);

        if (part > 2.5){                            // calyx
          vec3 sc = s2l(vec3(46., 66., 40.)) * (0.42 + 0.70*(1.0-u));
          sc = airFrag(sc);
          gl_FragColor = vec4(sc, 1.0);
          #include <colorspace_fragment>
          return;
        }
        if (part > 1.5){                            // stem
          vec3 sc = s2l(vec3(34., 58., 34.)) * (0.45 + 0.75*(1.0-u));
          sc *= 0.72 + 0.36*smoothstep(0.85, 0.0, vv);   // a lit edge down one side
          sc = airFrag(sc);
          gl_FragColor = vec4(sc, 1.0);
          #include <colorspace_fragment>
          return;
        }
        if (part > 0.5){                            // the disc of florets
          vec2 q = vUv - 0.5;
          float rr = clamp(length(q)*2.0, 0.0, 1.0);
          float ang = atan(q.y, q.x);
          /* Two crossed parastichy families at consecutive Fibonacci counts.
             A true nearest-floret lookup is a search; two sine families in 13
             and 21 land the same interference pattern for a few instructions,
             and at this size that is all the eye reads. */
          float s1 = cos(ang*13.0 - rr*30.0);
          float s2 = cos(ang*21.0 + rr*19.0);
          float floret = smoothstep(-0.15, 0.95, s1) * smoothstep(-0.15, 0.95, s2);
          vec3 core = s2l(vec3(150., 108., 44.));           // tight unopened centre
          vec3 open = s2l(vec3(252., 206., 104.));          // the ring in flower
          vec3 c = mix(core, open, smoothstep(0.15, 0.92, rr));
          c *= 0.68 + 0.55*floret;
          c += s2l(vec3(255., 236., 176.)) * pow(max(dot(N,L),0.0), 1.6) * 0.30;
          c *= 0.80 + 0.34*smoothstep(1.0, 0.55, rr);       // the rim sits in shadow
          c = airFrag(c*0.92);
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
          return;
        }

        /* ── the ray petal ──────────────────────────────────────────────
           A plain flower: cool white blade, a warm throat where it leaves the
           disc, and the thin-petal translucency that makes a backlit daisy
           glow.  No thin-film — the colour is the flower's own. */
        vec3 tip  = s2l(vec3(244., 246., 252.));
        vec3 body = s2l(vec3(210., 214., 234.));
        vec3 base = s2l(vec3(206., 196., 176.));
        float hv = vRnd.x - 0.5;
        vec3 shift = hv > 0.0 ? vec3(0.030,-0.006,-0.012)*hv*2.0
                              : vec3(-0.014,-0.004, 0.028)*(-hv)*2.0;
        vec3 c = mix(base, mix(body, tip, smoothstep(0.35, 1.0, u)), smoothstep(0.02, 0.34, u));
        c += shift;
        /* a bud stays greener until it opens */
        c = mix(mix(s2l(vec3(126., 142., 112.)), c, 0.40), c, smoothstep(0.30, 0.85, vOpen));

        /* ribs running the length of the blade, finer toward the tip */
        float ribs = 0.5 + 0.5*cos(vUv.y*3.14159*2.0*9.0);
        c *= 0.955 + 0.075*ribs*smoothstep(0.06, 0.55, u);
        /* the keel catches a highlight; the flanks fall away */
        c *= 0.78 + 0.34*smoothstep(0.95, 0.10, vv);

        float lam = max(dot(N, L), 0.0);
        float sky = 0.5 + 0.5*N.y;
        float diff = wrapDiffuse(N, L, 0.85);
        vec3 lit = c * (vec3(0.27,0.29,0.42)*(0.28 + 0.72*sky) + vec3(0.70,0.54,0.45)*diff*0.95);
        /* A petal is one cell thick.  Most of what reaches the eye has been
           through it and scattered, so the forward lobe is broad and the
           terminator all but disappears. */
        float through = pow(max(dot(V, -L), 0.0), 1.15);
        lit += c * vec3(1.04,0.84,0.75) * through * 0.72 * smoothstep(0.02, 0.75, u);
        lit += vec3(0.055,0.056,0.075) * pow(fres, 1.6);          // edge sheen
        lit *= 1.0 - vPart*0.34;

        float edge = smoothstep(0.0,0.14,1.0-vv);
        float aTip = smoothstep(1.02,0.92,u);
        float a = edge*aTip;
        vec3 outc = airFrag(lit);
        gl_FragColor = vec4(outc*0.98, a);
        #include <colorspace_fragment>
      }\`
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false; m.renderOrder = 20;
  addLayer('fg', m);
})();

/* ══════════════════════════════════════════════════════════════════════
   Foliage — instanced grass blades plus a few broad leaves.  The blades are
   real geometry, not billboards: four rungs pinched to a point, planted on
   the terrain with the same clump field the blossom carpet uses, and shaded
   with self-occlusion down the pile so the mass reads as foliage rather than
   as astroturf.
   ═════════════════════════════════════════════════════════════════════ */
function bladeGeometry(){
  const SEGS = 3, verts = [], uvs = [], idx = [];
  for (let i=0;i<=SEGS;i++){
    const t = i/SEGS, w = 0.5*(1 - t*t);
    verts.push(-w, t, 0,  w, t, 0);
    uvs.push(0, t, 1, t);
  }
  /* pinch the last rung to a single point */
  verts[verts.length-6] = 0; verts[verts.length-3] = 0;
  for (let i=0;i<SEGS;i++){ const a=i*2, b=a+1, c=a+2, d=a+3; idx.push(a,b,c, b,d,c); }
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts,3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs,2));
  g.setIndex(idx);
  return g;
}

(function grass(){
  const count = C.counts.blade;
  const g = bladeGeometry();
  const off = new Float32Array(count*3), nrm = new Float32Array(count*3);
  const rnd4 = new Float32Array(count*4), aux = new Float32Array(count);
  const rnd = mulberry(9081);
  let n = 0;
  for (let i=0;i<count;i++){
    let p = scatter(rnd, 0.42, 30 + C.scroll.travel, ANG*1.10, 1.35);
    /* two rejections against the clump field: the bare patches have to stay bare */
    let tries = 0;
    while (tries++ < 3 && fieldClump(p.x, p.z)*0.85 + 0.15 < rnd()) p = scatter(rnd, 0.42, 30 + C.scroll.travel, ANG*1.10, 1.35);
    const nv = terrainNormal(p.x, p.z, Math.max(0.04, p.r*0.012));
    off[n*3]=p.x; off[n*3+1]=p.y; off[n*3+2]=p.z;
    nrm[n*3]=nv.x; nrm[n*3+1]=nv.y; nrm[n*3+2]=nv.z;
    /* one blade in sixteen is a long stray — uniform lengths cut a hard edge
       against the sky and the mass reads as a trimmed hedge */
    const stray = rnd() < 0.062 ? 1.45 + rnd()*0.55 : 1.0;
    rnd4[n*4]   = rnd()*6.28318;                              // yaw
    rnd4[n*4+1] = (0.062 + rnd()*0.118) * stray;              // length, metres
    rnd4[n*4+2] = (rnd()-0.5)*1.25;                           // lean
    rnd4[n*4+3] = rnd();                                      // per-blade tone
    /* two scales of clumping: broad cushions and the tufts inside them */
    aux[n] = fieldClump(p.x, p.z)*0.62 + fbm2(p.x*3.1 + 17.0, p.z*3.1 - 4.4)*0.38;
    n++;
  }
  g.setAttribute('offset', new THREE.InstancedBufferAttribute(off,3));
  g.setAttribute('nrm',    new THREE.InstancedBufferAttribute(nrm,3));
  g.setAttribute('rnd',    new THREE.InstancedBufferAttribute(rnd4,4));
  g.setAttribute('aux',    new THREE.InstancedBufferAttribute(aux,1));
  g.instanceCount = n;

  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uAirMul:{value:0.85} }, SHARED), side: THREE.DoubleSide, transparent: false, depthWrite: true,
    vertexShader: GLSL_AIR_VS + /* glsl */\`
      varying float vAirT; varying vec3 vAirCol;
      attribute vec3 offset; attribute vec3 nrm; attribute vec4 rnd; attribute float aux;
      uniform float uTime, uMouseR, uMouseOn;
      uniform vec3 uMouse;
      varying float vT, vShade, vTone, vD, vPart, vEdge;
      varying vec3 vN, vW;
      void main(){
        float t = uv.y; vT = t; vTone = smoothstep(0.10, 0.88, aux);
        float len = rnd.y;
        /* a local basis around the ground normal, rolled by the blade's yaw */
        vec3 ref = abs(nrm.y) < 0.95 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0);
        vec3 T0 = normalize(cross(nrm, ref));
        vec3 B0 = cross(nrm, T0);
        float ca = cos(rnd.x), sa = sin(rnd.x);
        vec3 widthDir = T0*ca + B0*sa;
        vec3 leanDir  = T0*-sa + B0*ca;

        /* the blade rolls along its own length — a grass blade is a twisted
           ribbon, and a flat card disappears the moment it turns edge-on */
        float roll = (rnd.w - 0.5)*1.7 + t*(0.55 + rnd.w*1.25);
        vec3 wd = widthDir*cos(roll) + leanDir*sin(roll);

        float bend = t*t;

        /* wind as fronts crossing the field, not a per-blade wobble */
        float wave = dot(offset.xz, vec2(0.62, 0.78))*0.62 - uTime*1.05;
        float gust = sin(wave)*0.15 + sin(wave*0.41 + 1.7)*0.09;
        gust *= 0.55 + 0.45*sin(uTime*0.19 + offset.x*0.028);
        gust += sin(uTime*1.9 + rnd.x*24.0)*0.035;          // individual flutter

        vec3 world = offset
                   + nrm * (t*len)
                   + wd * (position.x * len * 0.072)
                   + leanDir * (rnd.z * 0.44 * len) * bend
                   + (T0*gust + B0*gust*0.62) * bend * len * 0.62;

        /* ── the cursor parts the field ──────────────────────────────────
           Push tangentially along the ground and press down along its
           normal.  Scaled by the blade's OWN length: a fixed push is several
           times the height of a short blade and combs the field into streaks
           instead of parting it. */
        vec3 toB = offset - uMouse;
        float infl = smoothstep(uMouseR, 0.0, length(toB*vec3(1.0, 0.55, 1.0))) * uMouseOn;
        infl *= infl;
        vec3 push = toB - nrm*dot(toB, nrm);
        float pl = length(push);
        push = pl > 1e-4 ? push/pl : T0;
        world += push * infl * bend * len * 2.10;
        world -= nrm  * infl * bend * len * 0.62;
        vPart = infl;

        vShade = (0.62 + 0.38*rnd.w) * (0.84 + 0.16*sin(rnd.x*2.0));
        vShade *= 0.44 + 0.56*clamp(nrm.y*0.5 + 0.62, 0.0, 1.0);
        vEdge  = abs(position.x)*2.0;                     // 0 at the midrib
        vN = normalize(mix(nrm, normalize(leanDir*rnd.z + nrm), 0.35) + wd*sin(roll)*0.22);
        vW = world;
        vec4 mv = viewMatrix*vec4(world,1.0);
        vD = -mv.z;
        vec4 clip = projectionMatrix*mv;
        airVertex(world, clip, vAirT, vAirCol);
        gl_Position = clip;
      }\`,
    fragmentShader: GLSL_COMMON + GLSL_AIR_FS + /* glsl */\`
      uniform vec2 uResolution; uniform float uTime;
      varying float vT, vShade, vTone, vD, vPart, vEdge;
      varying vec3 vN, vW;
      void main(){
        /* linear-space colours; the output pass handles the sRGB transfer */
        vec3 deep = vec3(0.0016, 0.0032, 0.0024);
        vec3 mid  = vec3(0.0068, 0.0158, 0.0092);
        vec3 tip  = vec3(0.0230, 0.0430, 0.0240);
        vec3 col = mix(deep, mid, smoothstep(0.0, 0.62, vT));
        col = mix(col, tip, smoothstep(0.38, 1.0, vT)*(0.35 + 0.65*vTone));
        col *= 0.60 + 0.75*vTone;
        col *= vShade;
        /* the midrib runs a shade paler than the flanks */
        col *= 0.88 + 0.26*smoothstep(0.75, 0.05, vEdge);
        /* pressed-down blades sit in their own shadow */
        col *= 1.0 - vPart*0.42;

        vec3 N = normalize(vN);
        vec3 L = normalize(vec3(0.42, 0.115, -0.90));   // the set sun, behind
        float ao = mix(0.16, 1.05, smoothstep(0.0, 0.90, vT)) * (0.62 + 0.55*vTone);
        float sky = 0.5 + 0.5*N.y;
        /* diffuse light wraps around the blade rather than stopping dead at
           the terminator, and the sky contributes as a broad dome term */
        float diff = wrapDiffuse(N, L, 0.75);
        vec3 lit = col * (vec3(0.17,0.19,0.32)*(0.28+0.72*sky)
                        + vec3(0.58,0.45,0.37)*diff*0.85) * ao;

        lit += vec3(0.048,0.058,0.086) * smoothstep(0.70, 1.0, vT) * vTone
             * (0.30 + 0.70*max(dot(N,L),0.0)) * 0.9;
        vec3 V = normalize(cameraPosition - vW);
        /* low sun burning through the blade, and a waxy sheen off its curve */
        /* a broad forward lobe: light diffusing through the blade, not a
           tight specular through it */
        float trans = pow(max(dot(V,-L),0.0), 1.35);
        lit += col * vec3(1.08,0.76,0.66) * trans * 0.62 * smoothstep(0.05, 0.9, vT);
        vec3 H = normalize(V + L);
        lit += vec3(0.10,0.11,0.14) * pow(max(dot(N,H),0.0), 26.0)
             * smoothstep(0.25, 1.0, vT) * (0.35 + 0.65*vTone);

        lit = airFrag(lit);
        gl_FragColor = vec4(lit, 1.0);
        #include <colorspace_fragment>
      }\`
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false; m.renderOrder = 16;
  window.__bladeMesh = m;
  addLayer('blade', m);
})();

function leafTexture(size){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const g=cv.getContext('2d');
  g.translate(size/2,size/2);
  const grd=g.createLinearGradient(0,-size*0.46,0,size*0.46);
  grd.addColorStop(0,'rgba(255,255,255,0.35)');
  grd.addColorStop(0.45,'rgba(255,255,255,1)');
  grd.addColorStop(1,'rgba(255,255,255,0.9)');
  g.fillStyle=grd;
  g.beginPath();
  g.moveTo(0,-size*0.47);
  g.bezierCurveTo(size*0.30,-size*0.20, size*0.26,size*0.26, 0,size*0.47);
  g.bezierCurveTo(-size*0.26,size*0.26, -size*0.30,-size*0.20, 0,-size*0.47);
  g.fill();
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace;
  t.minFilter=THREE.LinearMipmapLinearFilter; return t;
}
const TEX_LEAF = leafTexture(96);

(function foliage(){
  const count = C.counts.leaf;
  const g = new THREE.InstancedBufferGeometry();
  const base = new THREE.PlaneGeometry(1,1);
  g.index = base.index; g.attributes.position = base.attributes.position; g.attributes.uv = base.attributes.uv;
  const off=new Float32Array(count*3), scl=new Float32Array(count*2),
        rot=new Float32Array(count), col=new Float32Array(count*3), rn=new Float32Array(count*2);
  const rnd = mulberry(555); const c = new THREE.Color();
  for (let i=0;i<count;i++){
    const p = scatter(rnd, 0.50, 30 + C.scroll.travel, ANG*1.05, 1.30);
    off[i*3]=p.x; off[i*3+1]=p.y + 0.015 + rnd()*0.19; off[i*3+2]=p.z;
    const L = 0.062 + rnd()*0.115;
    scl[i*2]=L*(0.24+rnd()*0.18); scl[i*2+1]=L;
    rot[i]= (rnd()-0.5)*2.4;
    c.setHSL(0.30 + rnd()*0.13, 0.44+rnd()*0.34, 0.055+rnd()*0.085);
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    rn[i*2]=rnd(); rn[i*2+1]=rnd();
  }
  g.setAttribute('iOff',new THREE.InstancedBufferAttribute(off,3));
  g.setAttribute('iScale',new THREE.InstancedBufferAttribute(scl,2));
  g.setAttribute('iRot',new THREE.InstancedBufferAttribute(rot,1));
  g.setAttribute('iCol',new THREE.InstancedBufferAttribute(col,3));
  g.setAttribute('iRnd',new THREE.InstancedBufferAttribute(rn,2));
  g.instanceCount = count;
  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({ uMap:{value:TEX_LEAF}, uAirMul:{value:0.85} }, SHARED),
    transparent:true, depthWrite:true, alphaTest:0.32,
    vertexShader: GLSL_AIR_VS + \`
      varying float vAirT; varying vec3 vAirCol;
      attribute vec3 iOff; attribute vec2 iScale; attribute float iRot;
      attribute vec3 iCol; attribute vec2 iRnd;
      uniform float uTime, uMouseR, uMouseOn;
      uniform vec3 uMouse;
      varying vec2 vUv; varying vec3 vCol; varying float vD; varying float vPart; varying vec3 vWpos;
      void main(){
        vUv=uv; vCol=iCol;
        float sway = sin(uTime*0.5 + iRnd.x*29.0)*0.05;
        vec3 anchor = iOff;
        vec3 toB = anchor - uMouse;
        float infl = smoothstep(uMouseR*1.25, 0.0, length(toB*vec3(1.0, 0.5, 1.0))) * uMouseOn;
        infl *= infl;
        vec3 away = vec3(toB.x, 0.0, toB.z);
        float al = length(away);
        away = al > 1e-4 ? away/al : vec3(1.0, 0.0, 0.0);
        anchor += away*infl*0.24; anchor.y -= infl*0.065;
        vPart = infl; vWpos = anchor;
        float a = iRot + sway + infl*1.1*sign(toB.x);
        vec4 mv = viewMatrix*vec4(anchor,1.0);
        vec2 q = position.xy*iScale;
        q = vec2(q.x*cos(a)-q.y*sin(a), q.x*sin(a)+q.y*cos(a));
        mv.xy += q; vD=-mv.z;
        vec4 clip = projectionMatrix*mv;
        airVertex(anchor, clip, vAirT, vAirCol);
        gl_Position = clip;
      }\`,
    fragmentShader: GLSL_COMMON + GLSL_AIR_FS + \`
      uniform sampler2D uMap; uniform vec2 uResolution;
      varying vec2 vUv; varying vec3 vCol; varying float vD; varying float vPart; varying vec3 vWpos;
      void main(){
        float a = texture2D(uMap, vUv).a;
        if (a < 0.32) discard;
        vec3 c = pow(vCol, vec3(2.2)) * (0.62 + 0.50*vUv.y) * (1.0 - vPart*0.30);
        c = airFrag(c);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }\`
  });
  const m = new THREE.Mesh(g, mat);
  m.frustumCulled = false; m.renderOrder = 18;
  window.__leafMesh = m;
  addLayer('leaf', m);
})();

/* ══════════════════════════════════════════════════════════════════════
   Light ribbons — CPU-built trail strips that flow through the valley
   ═════════════════════════════════════════════════════════════════════ */
const RIBBON_MAT = new THREE.ShaderMaterial({
  uniforms: Object.assign({ uOpacity:{value:1}, uCore:{value:1.9} }, SHARED),
  transparent:true, depthWrite:false, depthTest:true,
  blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  vertexShader:\`
    attribute float aSide; attribute float aT; attribute vec3 aCol; attribute float aInt;
    varying float vSide; varying float vT; varying vec3 vCol; varying float vInt;
    void main(){
      vSide=aSide; vT=aT; vCol=aCol; vInt=aInt;
      gl_Position = projectionMatrix*viewMatrix*vec4(position,1.0);
    }\`,
  fragmentShader:\`
    uniform float uOpacity; uniform float uCore;
    varying float vSide; varying float vT; varying vec3 vCol; varying float vInt;
    void main(){
      float e = 1.0-abs(vSide);
      float core = pow(e, 16.0);
      float halo = pow(e, 3.0);
      float wisp = pow(e, 0.60);
      vec3 c = vCol*halo*1.30 + vCol*wisp*0.38 + vec3(0.86,0.98,1.0)*core*uCore;
      float a = (wisp*0.15 + halo*0.46 + core*uCore*0.42) * vInt * uOpacity;
      gl_FragColor = vec4(min(c*vInt*0.95, vec3(12.0)), clamp(a, 0.0, 1.0));
      #include <colorspace_fragment>
    }\`
});

class Ribbon {
  constructor(def){
    Object.assign(this, def);
    this.N = def.segments || 190;
    const N = this.N;
    const verts = N*2;
    this.g = new THREE.BufferGeometry();
    this.pos = new Float32Array(verts*3);
    const side = new Float32Array(verts), tt = new Float32Array(verts),
          col  = new Float32Array(verts*3), itn = new Float32Array(verts);
    const idx = [];
    const c = new THREE.Color();
    for (let i=0;i<N;i++){
      const t = i/(N-1);
      for (let s=0;s<2;s++){
        const k=i*2+s; side[k]= s?1:-1; tt[k]=t;
        c.setHSL(def.hue + Math.sin(t*3.1+def.phase)*def.hueVar, def.sat, def.lit || 0.58);
        col[k*3]=c.r; col[k*3+1]=c.g; col[k*3+2]=c.b;
        itn[k]=1;
      }
      if (i<N-1){ const a=i*2; idx.push(a,a+1,a+2, a+1,a+3,a+2); }
    }
    this.g.setAttribute('position', new THREE.BufferAttribute(this.pos,3));
    this.g.setAttribute('aSide', new THREE.BufferAttribute(side,1));
    this.g.setAttribute('aT', new THREE.BufferAttribute(tt,1));
    this.g.setAttribute('aCol', new THREE.BufferAttribute(col,3));
    this.aInt = new THREE.BufferAttribute(itn,1);
    this.g.setAttribute('aInt', this.aInt);
    this.g.setIndex(idx);
    this.g.setDrawRange(0, idx.length);
    this.mesh = new THREE.Mesh(this.g, RIBBON_MAT.clone());
    this.mesh.frustumCulled = false; this.mesh.renderOrder = 40;
    this.tmpA = new THREE.Vector3(); this.tmpB = new THREE.Vector3();
    this.bakePath();

    /* a beaded filament running alongside the ribbon — the reference threads
       dotted strands through the bundle and they are most of its fine texture */
    if (def.beads){
      const M = def.beads;
      const bp = new Float32Array(M*3), bt = new Float32Array(M), br = new Float32Array(M*2);
      const rb = mulberry(Math.floor(def.phase*1000) + 7);
      for (let i=0;i<M;i++){ bt[i] = rb(); br[i*2] = rb(); br[i*2+1] = rb(); }
      const bg = new THREE.BufferGeometry();
      bg.setAttribute('position', new THREE.BufferAttribute(bp,3));
      bg.setAttribute('aRnd', new THREE.BufferAttribute(br,2));
      this.beadT = bt; this.beadPos = bp; this.beadGeo = bg;
      this.beadMesh = new THREE.Points(bg, new THREE.ShaderMaterial({
        uniforms: Object.assign({ uMap:{value:TEX_GLINT}, uCol:{value:new THREE.Color(def.beadCol||0x9fe8ff)},
                                  uSize:{value:def.beadSize||0.0016}, uInt:{value:def.beadInt||1.0} }, SHARED),
        transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
        vertexShader:\`
          attribute vec2 aRnd; uniform float uTime, uSize; varying float vA;
          void main(){
            vec4 mv = viewMatrix*vec4(position,1.0);
            float tw = 0.35 + 0.65*pow(max(sin(uTime*(1.1+aRnd.x*2.6) + aRnd.y*41.0),0.0), 1.4);
            vA = tw;
            gl_PointSize = clamp(uSize*(0.5+aRnd.x)*320.0, 1.0, 7.0);
            gl_Position = projectionMatrix*mv;
          }\`,
        fragmentShader:\`
          uniform sampler2D uMap; uniform vec3 uCol; uniform float uInt;
          varying float vA;
          void main(){
            float a = texture2D(uMap, gl_PointCoord).a;
            gl_FragColor = vec4(min(uCol*vA*uInt*2.2, vec3(12.0)), clamp(a*vA*uInt,0.0,1.0));
          }\`
      }));
      this.beadMesh.frustumCulled = false; this.beadMesh.renderOrder = 42;
    }
  }
  /* The path's screen-space keys never move, so the whole Catmull-Rom — and
     the lateral offset that rides on its tangent — is baked once.  Evaluating
     it per frame across every fibre of every bundle cost more than the entire
     rest of the scene put together. */
  bakePath(){
    const k = this.keys, n = k.length-1, N = this.N;
    this.pu = new Float32Array(N); this.pv = new Float32Array(N); this.pD = new Float32Array(N);
    const at = (t, out) => {
      const f = Math.min(t, 0.9999)*n;
      const i = Math.floor(f), s = f-i, s2 = s*s, s3 = s2*s;
      const p0=k[Math.max(i-1,0)], p1=k[i], p2=k[Math.min(i+1,n)], p3=k[Math.min(i+2,n)];
      const cr=(a,b,c,d)=>0.5*((2*b)+(-a+c)*s+(2*a-5*b+4*c-d)*s2+(-a+3*b-3*c+d)*s3);
      out[0]=cr(p0[0],p1[0],p2[0],p3[0]);
      out[1]=cr(p0[1],p1[1],p2[1],p3[1]);
      out[2]=cr(p0[2],p1[2],p2[2],p3[2]);
    };
    const a0=[0,0,0], a1=[0,0,0];
    for (let i=0;i<N;i++){
      const t = i/(N-1);
      at(t, a0);
      let u = a0[0], v = a0[1];
      if (this.lateral){
        at(Math.min(t+0.01, 1.0), a1);
        let tx = a1[0]-a0[0], ty = a1[1]-a0[1];
        const m = Math.hypot(tx,ty) || 1;
        u += -ty/m * this.lateral;
        v +=  tx/m * this.lateral;
      }
      this.pu[i]=u; this.pv[i]=v; this.pD[i]=a0[2];
    }
  }
  /* one baked sample plus its live wobble */
  sample(i, t, time, out){
    const w = this.wobble, ph = this.phase;
    const du = Math.sin(t*w.f1 + time*w.s1 + ph)*w.a1
             + Math.sin(t*w.f2 - time*w.s2 + ph*1.7)*w.a2;
    const dv = Math.cos(t*w.f1*0.87 + time*w.s1*0.9 + ph*1.3)*w.a1*0.62
             + Math.cos(t*w.f3 + time*w.s3 + ph*2.1)*w.a3;
    const D = this.pD[i];
    out.set((this.pu[i]+du-0.5)*2*halfH*D, (0.5-(this.pv[i]+dv))*2*halfV*D, -D);
    return out;
  }
  /* beads sample the path at arbitrary t, so they keep the slower path */
  point(t, time, out){
    const N = this.N;
    const f = Math.min(Math.max(t,0),0.99999)*(N-1);
    const i = Math.floor(f), s = f-i, j = Math.min(i+1, N-1);
    const w = this.wobble, ph = this.phase;
    const du = Math.sin(t*w.f1 + time*w.s1 + ph)*w.a1
             + Math.sin(t*w.f2 - time*w.s2 + ph*1.7)*w.a2;
    const dv = Math.cos(t*w.f1*0.87 + time*w.s1*0.9 + ph*1.3)*w.a1*0.62
             + Math.cos(t*w.f3 + time*w.s3 + ph*2.1)*w.a3;
    const u = this.pu[i]*(1-s) + this.pu[j]*s + du;
    const v = this.pv[i]*(1-s) + this.pv[j]*s + dv;
    const D = this.pD[i]*(1-s) + this.pD[j]*s;
    out.set((u-0.5)*2*halfH*D, (0.5-v)*2*halfV*D, -D);
    return out;
  }
  update(time, camPos){
    const N=this.N, A=this.tmpA, B=this.tmpB;
    const arr=this.pos, ia=this.aInt.array;
    const head = this.headSpeed ? ((time*this.headSpeed + this.phase) % 1.6) : 2;
    const dir = this._dir || (this._dir = new THREE.Vector3());
    const view = this._view || (this._view = new THREE.Vector3());
    const nrm = this._nrm || (this._nrm = new THREE.Vector3(0,1,0));
    for (let i=0;i<N;i++){
      const t=i/(N-1);
      this.sample(i, t, time, A);
      this.sample(Math.min(i+1, N-1), Math.min(t+1/(N-1), 1), time, B);
      dir.subVectors(B, A);
      if (dir.lengthSq() < 1e-12) dir.set(0,0,-1); else dir.normalize();
      view.subVectors(A, camPos);
      if (view.lengthSq() < 1e-12) view.set(0,0,-1); else view.normalize();
      nrm.crossVectors(dir, view);
      if (nrm.lengthSq() < 1e-12) nrm.set(0,1,0); else nrm.normalize();
      const dist = Math.max(A.distanceTo(camPos), 0.1);
      const wpx = this.width * dist * (0.55 + 0.45*Math.sin(t*Math.PI));
      const k=i*2;
      arr[k*3]   = A.x - nrm.x*wpx; arr[k*3+1] = A.y - nrm.y*wpx; arr[k*3+2] = A.z - nrm.z*wpx;
      arr[(k+1)*3]   = A.x + nrm.x*wpx; arr[(k+1)*3+1] = A.y + nrm.y*wpx; arr[(k+1)*3+2] = A.z + nrm.z*wpx;
      let inten = Math.pow(Math.sin(Math.min(t,1)*Math.PI), this.fadePow||0.55);
      inten *= this.intensity;
      if (this.headSpeed){
        const d = Math.abs(t - (head-0.3));
        inten *= 0.35 + 1.5*Math.exp(-d*d*90);
      }
      ia[k]=inten; ia[k+1]=inten;
    }
    this.g.attributes.position.needsUpdate = true;
    this.aInt.needsUpdate = true;

    if (this.beadGeo){
      const bt=this.beadT, bp=this.beadPos, M=bt.length;
      const save = this.lateral;
      for (let i=0;i<M;i++){
        this.lateral = save + (bt[i]-0.5)*0.006;
        this.point(bt[i], time, A);
        bp[i*3]=A.x; bp[i*3+1]=A.y; bp[i*3+2]=A.z;
      }
      this.lateral = save;
      this.beadGeo.attributes.position.needsUpdate = true;
      this.beadGeo.computeBoundingSphere();
    }
  }
}

/* keys are [screenU, screenV, distance] */
const ribbons = [];
function makeStrand(def, coreVal, order){
  const r = new Ribbon(def);
  r.mesh.material.uniforms.uCore.value = coreVal;
  r.mesh.renderOrder = order;
  ribbons.push(r); scene.add(r.mesh);
  if (r.beadMesh) scene.add(r.beadMesh);
}
/* one definition fans out into a bundle of fibres: each gets a wide
   saturated halo pass and a narrow white core pass */
function addRibbon(def){
  if(!shown('ribbon')) return;
  const n = def.bundle || 1;
  const spread = def.spread || 0.010;
  for (let i=0;i<n;i++){
    const f = n>1 ? (i/(n-1) - 0.5)*2 : 0;
    const mid = 1.0 - Math.abs(f);
    const d = Object.assign({}, def, {
      phase: def.phase + i*2.31,
      lateral: f*spread*(0.62 + 0.38*Math.sin(i*3.1)),
      width: def.width * (0.34 + 0.66*mid),
      intensity: def.intensity * (0.30 + 0.70*Math.pow(mid, 0.7))
    });
    makeStrand(Object.assign({}, d, {
      width: d.width*4.4, intensity: d.intensity*0.30,
      sat: Math.min(def.sat*1.75, 1.0), lit: 0.44
    }), 0.0, 39);
    makeStrand(Object.assign({}, d, { lit: 0.66 }), 1.35, 41);
    /* hair-fine filaments shadowing the fibre, and a beaded strand on the
       outer two — this is where the bundle gets its fine texture */
    if (def.beads && Math.abs(f) > 0.4){
      makeStrand(Object.assign({}, d, {
        width: d.width*0.20, intensity: d.intensity*0.30, lit: 0.80,
        beads: def.beads, beadCol: def.beadCol, beadSize: def.beadSize, beadInt: def.beadInt
      }), 0.0, 41);
    }
  }
}

addRibbon({ keys:[[0.11,0.205,260],[0.175,0.225,250],[0.245,0.30,235],[0.30,0.395,225],
                  [0.375,0.455,215],[0.44,0.505,205],[0.49,0.575,195],[0.53,0.615,190],
                  [0.585,0.585,195],[0.635,0.505,205],[0.70,0.445,215],[0.76,0.375,228],
                  [0.83,0.30,242],[0.895,0.25,255],[0.94,0.265,262]],
  segments:150, width:0.0056, intensity:1.55, hue:0.495, hueVar:0.06, sat:0.60, phase:0.0,
  bundle:4, spread:0.0165, hairs:1, beads:230, beadCol:0x9fe8ff, beadSize:0.0026, beadInt:1.05,
  wobble:{f1:5.1,a1:0.019,s1:0.55,f2:11.3,a2:0.011,s2:0.9,f3:19.0,a3:0.007,s3:0.7} });

addRibbon({ keys:[[0.13,0.225,268],[0.20,0.255,258],[0.27,0.335,244],[0.335,0.425,232],
                  [0.40,0.475,222],[0.46,0.52,212],[0.505,0.585,202],[0.545,0.625,197],
                  [0.60,0.60,200],[0.655,0.525,210],[0.715,0.465,220],[0.775,0.395,232],
                  [0.845,0.315,246],[0.905,0.265,258]],
  segments:140, width:0.0040, intensity:1.10, hue:0.47, hueVar:0.09, sat:0.65, phase:1.9,
  bundle:3, spread:0.0135, hairs:1, beads:180, beadCol:0xc9b6ff, beadSize:0.0022, beadInt:0.85,
  wobble:{f1:6.3,a1:0.023,s1:0.42,f2:13.0,a2:0.013,s2:0.8,f3:23.0,a3:0.006,s3:1.1} });

addRibbon({ keys:[[0.365,0.335,215],[0.385,0.395,210],[0.415,0.43,205],[0.44,0.49,200],
                  [0.475,0.535,196],[0.51,0.575,193],[0.525,0.60,191]],
  segments:95, width:0.0029, intensity:0.88, hue:0.52, hueVar:0.08, sat:0.55, phase:3.4,
  bundle:3, spread:0.0090,
  wobble:{f1:9.0,a1:0.026,s1:0.7,f2:17.0,a2:0.014,s2:1.1,f3:27.0,a3:0.007,s3:0.9} });

addRibbon({ keys:[[0.665,0.315,214],[0.635,0.365,209],[0.605,0.40,205],[0.575,0.455,200],
                  [0.552,0.52,195],[0.535,0.575,192],[0.528,0.605,190]],
  segments:95, width:0.0029, intensity:0.88, hue:0.47, hueVar:0.08, sat:0.55, phase:5.1,
  bundle:3, spread:0.0090,
  wobble:{f1:8.2,a1:0.027,s1:0.62,f2:16.0,a2:0.014,s2:0.95,f3:25.0,a3:0.007,s3:1.2} });

addRibbon({ keys:[[0.455,0.545,198],[0.49,0.60,193],[0.525,0.625,190],[0.565,0.60,193],[0.60,0.55,198]],
  segments:85, width:0.0050, intensity:1.40, hue:0.49, hueVar:0.05, sat:0.40, phase:2.4,
  bundle:3, spread:0.0075, hairs:1,
  wobble:{f1:7.0,a1:0.011,s1:0.5,f2:13.0,a2:0.008,s2:0.85,f3:20.0,a3:0.004,s3:0.7} });

addRibbon({ keys:[[0.375,0.325,214],[0.385,0.375,211],[0.408,0.405,208],[0.398,0.445,205],
                  [0.425,0.478,202],[0.452,0.512,199],[0.478,0.548,196],[0.505,0.580,193]],
  segments:105, width:0.0021, intensity:0.95, hue:0.50, hueVar:0.07, sat:0.62, phase:0.7,
  bundle:2, spread:0.0055,
  wobble:{f1:15.0,a1:0.020,s1:0.85,f2:26.0,a2:0.011,s2:1.3,f3:38.0,a3:0.005,s3:1.0} });

addRibbon({ keys:[[0.655,0.318,213],[0.640,0.362,210],[0.612,0.392,207],[0.622,0.432,204],
                  [0.596,0.468,201],[0.570,0.505,198],[0.548,0.545,195],[0.528,0.582,192]],
  segments:105, width:0.0021, intensity:0.95, hue:0.485, hueVar:0.07, sat:0.62, phase:2.9,
  bundle:2, spread:0.0055,
  wobble:{f1:14.0,a1:0.021,s1:0.75,f2:25.0,a2:0.012,s2:1.2,f3:36.0,a3:0.006,s3:1.1} });

addRibbon({ keys:[[0.44,0.395,206],[0.468,0.425,203],[0.452,0.462,200],[0.487,0.492,198],
                  [0.505,0.530,195],[0.518,0.568,193]],
  segments:88, width:0.0016, intensity:0.78, hue:0.54, hueVar:0.09, sat:0.68, phase:5.6,
  bundle:2, spread:0.0040,
  wobble:{f1:19.0,a1:0.018,s1:1.05,f2:31.0,a2:0.009,s2:1.5,f3:44.0,a3:0.004,s3:1.2} });

addRibbon({ keys:[[0.30,0.44,228],[0.36,0.475,220],[0.43,0.51,212],[0.49,0.565,204],
                  [0.535,0.60,199],[0.585,0.575,203],[0.64,0.52,211],[0.70,0.475,219],[0.755,0.42,229]],
  segments:115, width:0.0029, intensity:0.78, hue:0.55, hueVar:0.10, sat:0.70, phase:4.2,
  bundle:3, spread:0.0110, beads:130, beadCol:0xffd9a8, beadSize:0.0020, beadInt:0.90,
  headSpeed:0.22,
  wobble:{f1:6.0,a1:0.028,s1:0.5,f2:12.0,a2:0.016,s2:0.75,f3:21.0,a3:0.008,s3:1.0} });

/* ══════════════════════════════════════════════════════════════════════
   Post — bloom + filmic + vignette + grain
   ═════════════════════════════════════════════════════════════════════ */
/* the blades are a pixel wide; without multisampling they crawl */
const msaaTarget = new THREE.WebGLRenderTarget(1, 1, {
  type: THREE.HalfFloatType, samples: devicePixelRatio >= 1.75 ? 2 : 4,
  minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter
});
const composer = new EffectComposer(renderer, msaaTarget);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1,1), C.bloom.strength, C.bloom.radius, C.bloom.threshold);
composer.addPass(bloom);
const finalPass = new ShaderPass({
  uniforms: { tDiffuse:{value:null}, uTime:{value:0}, uRes:{value:uRes}, uExposure:{value:C.exposure} },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; uniform float uExposure;
    varying vec2 vUv;
    float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      c = clamp(c, vec3(0.0), vec3(60.0)) * uExposure;   // sanitise Inf/NaN from the bloom chain
      /* gentle shoulder so the ribbons and bokeh roll off instead of clipping hard */
      c = c/(1.0+c*0.26);
      c *= 1.26;
      /* pull the black point back down — the reference sits on true black */
      c = max(c - 0.012, vec3(0.0)) * 1.0122;
      c = pow(c, vec3(1.045));
      float r = length((vUv-0.5)*vec2(1.06,1.0));
      c *= 1.0 - 0.30*pow(smoothstep(0.34,0.95,r), 1.6);
      c += (h21(vUv*uRes+uTime)-0.5)*0.0065;
      gl_FragColor = vec4(c,1.0);
      #include <colorspace_fragment>
    }\`
});
finalPass.renderToScreen = true;
composer.addPass(finalPass);
if (RAW){ bloom.enabled = false; finalPass.enabled = false; composer.passes[0].renderToScreen = true; }

/* ══════════════════════════════════════════════════════════════════════
   Resize / loop
   ═════════════════════════════════════════════════════════════════════ */
function resize(){
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w,h,false);
  composer.setSize(w,h);
  bloom.setSize(w,h);
  const pr = renderer.getPixelRatio();
  uRes.set(w*pr, h*pr);
  camera.aspect = w/h;
  /* keep the art-directed vertical framing: widen the fov if the frame is narrower than the reference */
  applyFov();
  if (window.__sparkMat) window.__sparkMat.uniforms.uPR.value = pr;
  if (window.__moteMat)  window.__moteMat.uniforms.uPR.value = pr;
  if (window.__starMat)  window.__starMat.uniforms.uPR.value = pr;
  pollen.mat.uniforms.uPR.value = pr;
}
addEventListener('resize', resize);
resize();

function revealScene(){
  const el = document.getElementById('loader');
  if (el) el.classList.add('done');
}
/* the tab can be backgrounded while it loads, which freezes rAF — never
   leave the curtain up waiting for a frame that will not come */
setTimeout(revealScene, 2500);
document.addEventListener('visibilitychange', () => { if (!document.hidden) revealScene(); });

/* ══════════════════════════════════════════════════════════════════════
   Pointer — march the cursor ray onto the terrain so the field can be parted
   ═════════════════════════════════════════════════════════════════════ */
const ptr = {
  have: false, active: 0,
  ndc: new THREE.Vector2(0, 0),
  target: new THREE.Vector3(0, -9999, 0),
  world:  new THREE.Vector3(0, -9999, 0),
  last:   new THREE.Vector3(0, -9999, 0),
  dir: new THREE.Vector3(), probe: new THREE.Vector3(), moved: 0
};

/* The ground is analytic, so a coarse march plus a bisection is both exact
   enough and far cheaper than building a collision mesh for it. */
function pickTerrain(ndc, out){
  ptr.dir.set(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize();
  const o = camera.position;
  const T0 = 0.25, T1 = 260, N = 48;
  ptr.probe.copy(o).addScaledVector(ptr.dir, T0);
  if (ptr.probe.y <= terrainH(ptr.probe.x, ptr.probe.z)){ out.copy(ptr.probe); return true; }
  let prevT = T0;
  for (let i=1;i<=N;i++){
    const t = T0 * Math.pow(T1/T0, i/N);
    ptr.probe.copy(o).addScaledVector(ptr.dir, t);
    if (ptr.probe.y <= terrainH(ptr.probe.x, ptr.probe.z)){
      let lo = prevT, hi = t;
      for (let k=0;k<22;k++){
        const m = 0.5*(lo+hi);
        ptr.probe.copy(o).addScaledVector(ptr.dir, m);
        if (ptr.probe.y > terrainH(ptr.probe.x, ptr.probe.z)) lo = m; else hi = m;
      }
      out.copy(o).addScaledVector(ptr.dir, 0.5*(lo+hi));
      return true;
    }
    prevT = t;
  }
  return false;                                   // the ray went into the sky
}

addEventListener('pointermove', (e)=>{
  if (e.pointerType === 'touch') return;
  const r = renderer.domElement.getBoundingClientRect();
  ptr.ndc.set(((e.clientX - r.left)/r.width)*2 - 1, -(((e.clientY - r.top)/r.height)*2 - 1));
  ptr.have = true;
}, { passive: true });
addEventListener('pointerleave', ()=>{ ptr.have = false; });
addEventListener('blur', ()=>{ ptr.have = false; });

let perfAvg = 0.016, perfLast = 0;
function applyPR(){ renderer.setPixelRatio(targetPR); resize(); }

/* ── quality ladder ──────────────────────────────────────────────────────
   Resolution alone cannot save a software GL context: at 1 fps the cost is
   the geometry and the post chain, not the pixel count.  Each rung sheds a
   whole class of work, and the page settles on the first one it can hold. */
let prFloor = Math.min(devicePixelRatio, 1.5), qLevel = 0, slowRun = 0;
const prCeil = Math.min(devicePixelRatio, 2.0);
const QUALITY = [
  () => {                                            // thin the cheap-to-lose layers
    for (const [obj, keep] of [[window.__leafMesh, 0.6], [window.__midMesh, 0.6]]){
      if (obj) obj.geometry.instanceCount = Math.round(obj.geometry.instanceCount * keep);
    }
  },
  () => {                                            // then the grass and the multisampling
    if (window.__bladeMesh) window.__bladeMesh.geometry.instanceCount =
      Math.round(window.__bladeMesh.geometry.instanceCount * 0.45);
    if (window.__farMesh) window.__farMesh.geometry.instanceCount =
      Math.round(window.__farMesh.geometry.instanceCount * 0.5);
    msaaTarget.samples = 0; msaaTarget.dispose(); composer.setSize(uRes.x, uRes.y);
  },
  () => { bloom.enabled = false; },                  // then the post chain
  () => { prFloor = Math.min(devicePixelRatio, 1.0); targetPR = prFloor; applyPR(); },
  () => { prFloor = 0.7; targetPR = prFloor; applyPR(); }   // only now, pixels
];
function degrade(){
  if (qLevel >= QUALITY.length) return;
  QUALITY[qLevel++]();
  perfAvg = 0.016;                      // give the new rung a clean look-in
}

/* ══════════════════════════════════════════════════════════════════════
   Scroll — dolly up the valley, and narrow the lens as we go
   ═════════════════════════════════════════════════════════════════════ */
const scrollState = { raw: 0, smooth: 0 };
function scrollProgress(){
  const track = document.getElementById('track');
  const span = Math.max(track.offsetHeight - innerHeight, 1);
  return Math.min(Math.max(scrollY / span, 0), 1);
}
addEventListener('scroll', ()=>{ scrollState.raw = scrollProgress(); }, { passive:true });

const BASE_FOV = C.cam.fov;
function applyScroll(p){
  const e = p*p*(3 - 2*p);                          // ease both ends
  const z = -C.scroll.travel * e;
  camera.position.z = z;
  /* ride the valley floor down so the eye keeps its height over the ground */
  camera.position.y = -V.groundSlope * (-z) * (1 - C.scroll.riseEnd*e);
  fovScroll = THREE.MathUtils.lerp(BASE_FOV, C.scroll.fovEnd, e);
  /* only the projection changes — calling resize() here would reallocate the
     composer's buffers on every frame of a scroll */
  applyFov();
}
function applyFov(){
  camera.fov = camera.aspect >= REF_ASPECT
    ? fovScroll
    : THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(fovScroll)/2) * (REF_ASPECT/camera.aspect)));
  camera.updateProjectionMatrix();
}

const clock = new THREE.Clock();
const camPos = new THREE.Vector3();
let frame = 0;
function tick(){
  requestAnimationFrame(tick);
  const t = (window.__forceTime !== undefined) ? window.__forceTime : clock.getElapsedTime();
  uTime.value = t;
  finalPass.uniforms.uTime.value = t;
  /* chase the scroll so a flicked trackpad glides instead of snapping */
  if (Math.abs(scrollState.raw - scrollState.smooth) > 1e-4){
    scrollState.smooth += (scrollState.raw - scrollState.smooth) * 0.085;
    applyScroll(scrollState.smooth);
  }
  camera.getWorldPosition(camPos);

  /* resolve the pointer, then chase it — the lag is what makes the field feel
     like it is being pushed through rather than teleported around */
  if (ptr.have && pickTerrain(ptr.ndc, ptr.target)) ptr.active = Math.min(1, ptr.active + 0.10);
  else ptr.active = Math.max(0, ptr.active - 0.055);
  if (ptr.active > 0){
    if (ptr.world.y < -9000) ptr.world.copy(ptr.target);
    ptr.last.copy(ptr.world);
    ptr.world.lerp(ptr.target, 0.20);
    ptr.moved = ptr.world.distanceTo(ptr.last);
    uMouse.value.copy(ptr.world);
    /* the wake widens a little when the pointer is travelling fast */
    uMouseR.value = 0.95 + Math.min(ptr.moved * 4.5, 0.65);
    spawnPollen(ptr.world, ptr.moved);
  }
  uMouseOn.value = ptr.active;

  for (const r of ribbons) r.update(t, camPos);
  for (const m of mistGroup.children){
    const d = m.userData.drift;
    m.position.x = d.x + Math.sin(t*0.05*d.sp + d.ph)*d.amp;
  }
  if (pollen.dirty){
    pollen.g.attributes.position.needsUpdate = true;
    pollen.g.attributes.aVel.needsUpdate = true;
    pollen.g.attributes.aBirth.needsUpdate = true;
    pollen.g.attributes.aRnd.needsUpdate = true;
    pollen.dirty = false;
  }
  composer.render();

  /* Governor: watch the RAW frame time and give up resolution before the
     frame rate.  Fed unclamped, or a stall gets averaged away and the page
     limps at a resolution it cannot afford. */
  /* A backgrounded tab reports 500 ms frames because rAF is throttled, not
     because the scene is slow — governing on those would quietly wreck the
     quality of every page the user tabs away from and back to. */
  if (frame > 6 && !document.hidden){
    const dt = t - perfLast;
    if (dt > 0.0 && dt < 0.25){
      perfAvg = frame < 14 ? dt : perfAvg*0.90 + dt*0.10;
      /* Shed features before pixels.  A simpler scene at full density still
         reads as the scene; a sharp scene at half density just looks broken,
         and that is the one artefact the eye calls a bug. */
      if (perfAvg > 0.024){
        slowRun++;
        if (perfAvg > 0.067 || slowRun > 30){
          if (qLevel < QUALITY.length){ degrade(); slowRun = 0; }
          else if (targetPR > prFloor + 0.001){ targetPR = Math.max(prFloor, targetPR - 0.14); applyPR(); }
        }
      } else {
        slowRun = 0;
        if (perfAvg < 0.013 && targetPR < prCeil){
          targetPR = Math.min(prCeil, targetPR + 0.04); applyPR();
        }
      }
    }
  }
  perfLast = t;

  if (frame++ === 2) revealScene();
  window.__ready = true;
}
tick();

/* headless helpers */
window.__scene = { scene, camera, renderer, composer, C, terrainH };
window.__ptrDebug = () => ({ on: +uMouseOn.value.toFixed(3), r: +uMouseR.value.toFixed(3), world: uMouse.value.toArray().map(v=>+v.toFixed(2)), q: qLevel, pr: +targetPR.toFixed(2), ms: +(perfAvg*1000).toFixed(1) });
<\/script>
</body>
</html>
`;function g({className:o="",style:c}){const r=n.useRef(null),[d,u]=n.useState(()=>typeof document>"u"||!document.hidden),[h,p]=n.useState(!0),[t,i]=n.useState(!1);n.useEffect(()=>{const e=r.current;if(!e||typeof IntersectionObserver>"u")return;const s=new IntersectionObserver(([f])=>{p(f?.isIntersecting??!0)},{rootMargin:"80px"});return s.observe(e),()=>s.disconnect()},[]),n.useEffect(()=>{if(typeof document>"u")return;const e=()=>u(!document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]);const a=h&&d;return n.useEffect(()=>{i(!1)},[a]),l.jsx("div",{ref:r,className:`threeui-background flower-field${o?` ${o}`:""}`,role:"group","aria-label":"Interactive procedural flower valley","data-state":a?t?"ready":"loading":"paused",style:{background:"#3a3268",pointerEvents:"auto",...c},children:a?l.jsx("iframe",{title:"Flower Field",srcDoc:v,sandbox:"allow-scripts",loading:"eager",onLoad:()=>i(!0),style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#3a3268",opacity:t?1:0,pointerEvents:t?"auto":"none",transition:"opacity 240ms ease-out"}}):null})}export{g as FlowerField};
