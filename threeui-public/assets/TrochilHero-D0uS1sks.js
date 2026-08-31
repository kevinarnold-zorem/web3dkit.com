import{r as u,j as E}from"./index-ChUl42DD.js";import{a as D}from"./LandingPages-Bks_nP6T.js";import"./SylvaLivingWorldScene-D5ro5Tc6.js";const O=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Trochil Sakura — halftone butterfly on a cherry branch</title>
<meta name="description" content="A procedural halftone butterfly that flies to the cursor and settles back onto a flowering sakura branch, rendered as one additive point cloud through a 45 degree dot screen.">
<meta name="theme-color" content="#000000">
<style>
  html, body { margin:0; width:100%; height:100%; background:#000; overflow:hidden; }
  #gl { position:fixed; inset:0; display:block; width:100%; height:100%; }
</style>
</head>
<body>
<canvas id="gl"></canvas>
<!--
  Trochil Sakura — the authored halftone drawing system carrying a different
  animal.

  Everything below the "Post chain" heading is the system lifted out of the
  authored Trochil page (public/landing-pages/trochil-hero.html,
  SHA-256 db9447887bd9...): the additive point material, the density buffer,
  the two-level blur, the 45 degree halftone composite, the design-frame
  anchoring and the frame loop. Four regions are this scene's own — the CFG
  block, the butterfly cloud with its own wing skinning, the cherry branch
  with its blossoms and falling petals, and the plum -> blossom ramp that
  replaces the ember -> gold one.
-->
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
(function () {
'use strict';

var T = { flightStart: 0.10, flightEnd: 4.20 };
function ease(t){ return t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3); }
function easeIO(t){ return t <= 0 ? 0 : t >= 1 ? 1 : (t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2); }

var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var start = performance.now() / 1000;

/* ================================================================== */
/*  Tunables                                                          */
/* ================================================================== */
var CFG = window.__cfg = {
  gain:      1.00,
  curve:     0.52,
  dotMax:    0.735,
  dotGamma:  0.56,
  cellCss:   4.20,
  glow:      0.15,
  glowGain:  2.35,
  pointSize: 6.50,
  bright:    0.400,
  wing:      1.25,   /* wing intensity multiplier                       */
  beat:      2.55,   /* wingbeats per second in flight                  */
  restBeat:  0.85,   /* the slow open-and-close of a settled butterfly  */
  flora:     0.245,  /* branch intensity, relative to the butterfly     */
  floraSize: 2.30,
  floraPose: { ax: 316, ay: 902, dist: 5.10, scale: 1.0 },
  blurSpan:  0.16,   /* wing motion-blur window, in stroke periods      */
  petals:    0.34,   /* falling petal intensity                         */
  freeze:    false,
  exposure:  1.00,
  /* the perch: the blossom cluster at the top of the branch, where the
     butterfly settles whenever nothing is moving                       */
  perch:     { ax: 830, ay: 392, dist: 4.90, scale: 0.86,
               az: 0.26, el: 0.16, spin: 1.52, flap: 1.0 }
};

/* ================================================================== */
/*  Shared cloud helpers                                              */
/* ================================================================== */
function rnd(){ return Math.random(); }
function rndn(){ /* ~gaussian */ return (rnd()+rnd()+rnd()+rnd()-2) * 0.7071; }

/* --- tiny 3d value-noise fbm: gives the cloud its organic mottling --- */
function h3(i, j, k){
  var n = (i * 374761393 + j * 668265263 + k * 1274126177) | 0;
  n = (n ^ (n >>> 13)) | 0;
  n = Math.imul(n, 1274126177) | 0;
  return (((n ^ (n >>> 16)) >>> 0) / 4294967295);
}
function vnoise(x, y, z){
  var i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  var fx = x - i, fy = y - j, fz = z - k;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  function L(a, b, t){ return a + (b - a) * t; }
  return L(L(L(h3(i,j,k),   h3(i+1,j,k),   fx), L(h3(i,j+1,k),   h3(i+1,j+1,k),   fx), fy),
           L(L(h3(i,j,k+1), h3(i+1,j,k+1), fx), L(h3(i,j+1,k+1), h3(i+1,j+1,k+1), fx), fy), fz);
}
function fbm(x, y, z){
  return 0.54 * vnoise(x, y, z)
       + 0.29 * vnoise(x * 2.13 + 11.3, y * 2.13 + 7.1, z * 2.13 + 3.7)
       + 0.17 * vnoise(x * 4.37 + 31.7, y * 4.37 + 17.9, z * 4.37 + 23.1);
}
function mottle(x, y, z, freq, amt){
  return 1.0 - amt + amt * 2.0 * fbm(x * freq + 5.0, y * freq + 9.0, z * freq + 2.0);
}

/* ==================================================================
    Butterfly point cloud
    ------------------------------------------------------------------
    body along +X (the head leads), wings spread along +-Z and hinged
    on the body axis so the flap is a real dihedral rather than a
    sweep.  aPart 0 body, 4 right wing, 5 left wing — the vertex
    shader reads the same convention the hummingbird used.
   ================================================================== */
var PART_BODY = 0, PART_WING_R = 4, PART_WING_L = 5;
var HINGE = new THREE.Vector3(0.06, 0.012, 0.018);

/* ---- wing outlines ---------------------------------------------------
   each wing is a filled polar sheet measured from its own hinge: phi runs
   from the trailing edge (negative, toward the tail) through straight
   outward (0) to the leading edge (positive, toward the head), and the
   table gives the distance to the margin at each of those angles.  the
   forewing throws a long apex forward; the hindwing is short, round and
   scalloped, and carries the tail lobe.                                */
var FORE = [[-0.70, 0.20], [-0.40, 0.34], [-0.05, 0.56], [0.30, 0.86],
            [0.62, 1.10], [0.85, 1.02], [1.10, 0.60], [1.40, 0.20]];
var HIND = [[-1.30, 0.18], [-1.00, 0.40], [-0.60, 0.56], [-0.15, 0.62],
            [0.25, 0.56], [0.60, 0.36], [0.95, 0.12]];

function outlineR(tab, phi){
  if (phi <= tab[0][0]) return tab[0][1];
  var n = tab.length;
  if (phi >= tab[n - 1][0]) return tab[n - 1][1];
  for (var i = 1; i < n; i++){
    if (phi <= tab[i][0]){
      var k = (phi - tab[i - 1][0]) / (tab[i][0] - tab[i - 1][0]);
      k = k * k * (3 - 2 * k);
      return tab[i - 1][1] + (tab[i][1] - tab[i - 1][1]) * k;
    }
  }
  return tab[n - 1][1];
}

/* sampling the sheet by area rather than by angle: without this the apex —
   the widest wedge — comes out the thinnest part of the cloud            */
function angleSampler(tab, scallop){
  var lo = tab[0][0], hi = tab[tab.length - 1][0], BINS = 256;
  var cdf = new Float32Array(BINS + 1), total = 0;
  for (var i = 0; i < BINS; i++){
    var phi = lo + (hi - lo) * (i + 0.5) / BINS;
    var r = outlineR(tab, phi) * (1.0 - scallop * Math.cos(phi * 8.0));
    total += r * r;
    cdf[i + 1] = total;
  }
  for (var j = 0; j <= BINS; j++) cdf[j] /= total;
  return function (){
    var u = rnd(), a = 0, b = BINS;
    while (a < b){ var m = (a + b) >> 1; if (cdf[m] < u) a = m + 1; else b = m; }
    return lo + (hi - lo) * (a - 0.5 + rnd()) / BINS;
  };
}

function sst(x, e0, e1){
  var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function buildButterfly(){
  var P = [], PART = [], INT = [], RND = [], SIZ = [];

  function push(x,y,z, part, inten, size, r0,r1){
    P.push(x,y,z); PART.push(part); INT.push(inten); SIZ.push(size);
    RND.push(r0, r1, rnd());
  }

  /* ---- abdomen + thorax: a furred spindle along +X ---- */
  var NB = 13000;
  for (var i = 0; i < NB; i++){
    var s  = rnd();
    /* thorax swells at s ~ 0.72, the abdomen tapers to a point at s = 0 */
    var R  = 0.040 * Math.pow(Math.sin(Math.PI * (0.07 + 0.86 * s)), 0.55)
           + 0.016 * Math.exp(-Math.pow((s - 0.74) / 0.14, 2));
    var cx = -0.42 + 0.72 * s;
    var cy = -0.010 + 0.020 * Math.sin(Math.PI * s);
    var rr = Math.pow(rnd(), 0.55);
    var th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1);
    var sx = Math.sin(ph) * Math.cos(th), sy = Math.sin(ph) * Math.sin(th), sz = Math.cos(ph);
    var bx = cx + sx * R * rr * 0.55, by = cy + sy * R * rr, bz = sz * R * rr;
    /* segmented abdomen: rings of density read as a real insect body */
    var seg = 1.0 + 0.40 * Math.pow(Math.max(0, Math.sin(s * 30.0)), 6.0);
    push(bx, by, bz, PART_BODY,
         0.34 * seg * mottle(bx, by, bz, 6.0, 0.34), 0.80 + rnd() * 0.26, rnd(), rnd());
  }

  /* ---- head + compound eyes ---- */
  var NH = 3000;
  for (var i2 = 0; i2 < NH; i2++){
    var rh = Math.pow(rnd(), 0.5) * 0.052;
    var t2 = rnd() * Math.PI * 2, p2 = Math.acos(2 * rnd() - 1);
    var hx = 0.335 + Math.sin(p2) * Math.cos(t2) * rh,
        hy = 0.004 + Math.sin(p2) * Math.sin(t2) * rh * 0.90,
        hz = Math.cos(p2) * rh;
    /* the eyes take the sides, and take the light */
    var eye = Math.pow(Math.abs(hz) / (rh + 1e-5), 3.0);
    push(hx, hy, hz, PART_BODY, (0.34 + 0.70 * eye) * mottle(hx, hy, hz, 14.0, 0.24),
         0.80 + rnd() * 0.28, rnd(), rnd());
  }

  /* ---- antennae: two clubbed threads curving up and forward ---- */
  var NA = 1500;
  for (var side0 = 0; side0 < 2; side0++){
    var sg0 = side0 === 0 ? 1 : -1;
    for (var i3 = 0; i3 < NA; i3++){
      var u = Math.pow(rnd(), 0.86);
      var ax = 0.355 + u * 0.185 - u * u * 0.055;
      var ay = 0.030 + u * 0.155 + u * u * 0.075;
      var az = sg0 * (0.016 + u * 0.040);
      var jr = (1 - u) * 0.004 + 0.0035;
      /* the club at the tip is the brightest thing on the head */
      var club = Math.pow(Math.max(0, (u - 0.80) / 0.20), 1.5);
      var rr3 = Math.sqrt(rnd()) * (jr * 0.7 + club * 0.012);
      var a3 = rnd() * Math.PI * 2;
      push(ax + Math.cos(a3) * rr3, ay + Math.sin(a3) * rr3 * 0.9, az + Math.sin(a3) * rr3,
           PART_BODY, 0.20 + club * 0.55, 0.66 + rnd() * 0.20, rnd(), rnd());
    }
  }

  /* ---- wings ----------------------------------------------------------
     both sheets are filled by area, then patterned: veins fan out of the
     root as ridges of density, a dark submarginal band sits inside a lit
     margin of lunules, and the hindwing carries a pair of eyespots.  the
     sheet is cambered so the pair never reads as a flat cut-out.       */
  var FORE_SCALLOP = 0.030, HIND_SCALLOP = 0.075;
  var samplerFore = angleSampler(FORE, FORE_SCALLOP);
  var samplerHind = angleSampler(HIND, HIND_SCALLOP);
  var NF = 47000, NHW = 27000;
  for (var side = 0; side < 2; side++){
    var sgn = side === 0 ? 1 : -1;
    var part = side === 0 ? PART_WING_R : PART_WING_L;

    /* forewing */
    for (var i4 = 0; i4 < NF; i4++){
      var phi = samplerFore();
      var Rf  = outlineR(FORE, phi) * (1.0 - FORE_SCALLOP * Math.cos(phi * 8.0));
      var u4  = Math.sqrt(rnd());
      var rad = u4 * Rf;
      var wx = HINGE.x + Math.sin(phi) * rad;
      var wz = sgn * (HINGE.z + Math.cos(phi) * rad);
      var wy = HINGE.y + 0.050 * Math.sin(Math.PI * Math.min(1, rad / 1.10)) - 0.020 * rad * rad;
      /* seven veins fanning from the root */
      var vein = 1.0 + 2.60 * Math.pow(Math.max(0, Math.cos(phi * 8.6 - 0.45)), 7.0);
      /* margin of lunules over a dark submarginal band */
      var lun  = 1.0 + 3.20 * sst(u4, 0.860, 0.950) * (1.0 - sst(u4, 0.972, 1.0))
                     * (0.40 + 0.60 * Math.pow(Math.max(0, Math.cos(phi * 12.0)), 6.0));
      var sub  = 1.0 - 0.66 * Math.exp(-Math.pow((u4 - 0.775) / 0.070, 2));
      /* a paler wash out of the dark root */
      var wash = 0.10 + 0.32 * Math.pow(u4, 0.85);
      var inten = 0.95 * wash * vein * lun * sub
                * mottle(wx * 2.0, wy * 2.0, wz * 2.0, 3.4, 0.38);
      push(wx, wy, wz, part, inten, 0.80 + rnd() * 0.34, rnd(), rnd());
    }

    /* hindwing, hinged further back so the two sheets overlap the way a
       real pair does                                                     */
    for (var i5 = 0; i5 < NHW; i5++){
      var ph2 = samplerHind();
      var Rh  = outlineR(HIND, ph2) * (1.0 - HIND_SCALLOP * Math.cos(ph2 * 8.0));
      var u5  = Math.sqrt(rnd());
      var rd2 = u5 * Rh;
      var hx2 = -0.285 + Math.sin(ph2) * rd2;
      var hz2 = sgn * (HINGE.z + Math.cos(ph2) * rd2);
      var hy2 = HINGE.y - 0.030 + 0.036 * Math.sin(Math.PI * Math.min(1, rd2 / 0.62))
              - 0.020 * rd2 * rd2;
      var vein2 = 1.0 + 2.30 * Math.pow(Math.max(0, Math.cos(ph2 * 6.6 + 0.9)), 7.0);
      var lun2  = 1.0 + 3.60 * sst(u5, 0.845, 0.945) * (1.0 - sst(u5, 0.972, 1.0));
      var sub2  = 1.0 - 0.62 * Math.exp(-Math.pow((u5 - 0.760) / 0.075, 2));
      /* one eyespot per hindwing: a lit ring around a hole */
      var ex = hx2 + 0.10, ez = Math.abs(hz2) - 0.40;
      var er = Math.hypot(ex * 1.15, ez);
      var spot = 1.0 + 2.40 * Math.exp(-Math.pow((er - 0.088) / 0.032, 2))
                     - 0.62 * Math.exp(-Math.pow(er / 0.062, 2));
      var inten2 = 0.85 * (0.09 + 0.30 * Math.pow(u5, 0.8)) * vein2 * lun2 * sub2
                 * Math.max(0.08, spot)
                 * mottle(hx2 * 2.0, hy2 * 2.0, hz2 * 2.0, 3.8, 0.36);
      push(hx2, hy2, hz2, part, inten2, 0.78 + rnd() * 0.32, rnd(), rnd());
    }
  }

  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aPart',    new THREE.Float32BufferAttribute(PART, 1));
  g.setAttribute('aInt',     new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize',    new THREE.Float32BufferAttribute(SIZ, 1));
  g.setAttribute('aRnd',     new THREE.Float32BufferAttribute(RND, 3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 3.0);
  return g;
}

/* ================================================================== */
/*  Renderer / scene                                                  */
/* ================================================================== */
var canvas   = document.getElementById('gl');
var renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false,
                                       preserveDrawingBuffer: true,
                                       powerPreference: 'high-performance' });
} catch (e) { /* no webgl: the page stays black rather than throwing */ }
if (!renderer){ canvas.style.display = 'none'; return; }
renderer.setClearColor(0x000000, 1);
var DPR = Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(DPR);

var scene  = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0, 0);

var moth = new THREE.Object3D();
scene.add(moth);

var pointsMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:     { value: 0 },
    uSize:     { value: 4.0 },
    uBright:   { value: 1.0 },
    uWing:     { value: 1.6 },
    uBlurSpan: { value: 0.0 },
    uOmega:    { value: 0.0 },
    uFlap:     { value: new THREE.Vector3(0.82, 0.18, 0.11) }, /* dihedral, twist, surge */
    uHinge:    { value: HINGE },
    uAmp:      { value: 1.0 },
    uFade:     { value: 1.0 }
  },
  vertexShader: [
    'attribute float aPart; attribute float aInt; attribute float aSize; attribute vec3 aRnd;',
    'uniform float uTime, uSize, uBlurSpan, uOmega, uAmp, uFade, uBright, uWing;',
    'uniform vec3 uFlap; uniform vec3 uHinge;',
    'varying float vInt;',
    'mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }',
    'mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }',
    'void main(){',
    '  vec3 p = position;',
    '  float inten = aInt;',
    '  if (aPart > 3.5){',
    '    float side = (aPart < 4.5) ? 1.0 : -1.0;',
    /* every wing particle carries its own offset inside the stroke, so the
       stroke renders as a swept fan rather than a single hard sheet      */
    '    float t    = uTime - aRnd.x * uBlurSpan;',
    '    float w    = uOmega;',
    /* the upstroke is quicker than the downstroke: skew the phase        */
    '    float ph   = w * t;',
    '    float beat = sin(ph) + 0.22 * sin(2.0 * ph + 1.4);',
    '    float dihe = uFlap.x * uAmp * beat;',
    '    float twis = uFlap.y * uAmp * cos(ph - 0.9);',
    '    vec3  pv = vec3(uHinge.x, uHinge.y, side * uHinge.z);',
    '    vec3  q  = p - pv;',
    '    q = rotY(twis * side) * q;',
    '    q = rotX(-dihe * side) * q;',
    '    p = q + pv;',
    /* the body surges forward on the downstroke */
    '    p.x += uFlap.z * uAmp * 0.10 * beat;',
    '    inten *= uWing;',
    '  }',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float tw = 0.80 + 0.20 * sin(uTime * (2.2 + aRnd.y * 7.0) + aRnd.z * 43.0);',
    '  vInt = inten * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: [
    'varying float vInt;',
    'void main(){',
    '  vec2 d = gl_PointCoord - 0.5;',
    '  float r2 = dot(d, d) * 4.0;',
    '  if (r2 > 1.0) discard;',
    '  float a = exp(-r2 * 2.55) - 0.078;',
    '  gl_FragColor = vec4(vec3(vInt * max(a, 0.0)), 1.0);',
    '}'
  ].join('\\n'),
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var cloud = new THREE.Points(buildButterfly(), pointsMat);
cloud.frustumCulled = false;
moth.add(cloud);

/* ==================================================================
    The cherry branch — same cloud treatment, planted bottom-left
    ------------------------------------------------------------------
    a woody limb that forks four times, hung with five-petal blossoms
    and a few closed buds.  it renders into the same density buffer as
    the butterfly, so the ramp, the dot screen and the bloom all apply
    without a second post pass.
   ================================================================== */
function buildBranch(){
  var P = [], INT = [], SIZ = [], RND = [], SWAY = [];
  function push(x, y, z, inten, size, sway, phase){
    P.push(x, y, z); INT.push(inten); SIZ.push(size);
    RND.push(rnd(), rnd(), rnd()); SWAY.push(sway, phase);
  }

  var sites = [];

  /* a limb: a bowed, tapering rod that forks while it still has girth.
     every rod thin enough to be a twig also drops flowering sites along
     its length, so the blossom sits *on* the branch rather than capping
     it like a mushroom.                                               */
  function limb(ax, ay, az, dx, dy, dz, len, rad, depth, phase){
    var n = Math.max(1400, Math.round(len * rad * 46000));
    var ux = dx, uy = dy, uz = dz;
    var ul = Math.hypot(ux, uy, uz) || 1; ux /= ul; uy /= ul; uz /= ul;
    /* an orthogonal pair, so the rod fills without trig per point */
    var px = -uy, py = ux, pz = 0.0;
    var pl = Math.hypot(px, py, pz) || 1; px /= pl; py /= pl; pz /= pl;
    var qx = uy * pz - uz * py, qy = uz * px - ux * pz, qz = ux * py - uy * px;
    var bowX = 0.16 * len * Math.cos(phase * 1.7), bowY = -0.20 * len;
    function axis(u, out){
      out[0] = ax + ux * len * u + bowX * u * u;
      out[1] = ay + uy * len * u + bowY * u * u;
      out[2] = az + uz * len * u;
    }
    var c = [0, 0, 0];
    /* bark: the limb catches light along its ridges and goes black in the
       grooves, which is what makes a point cloud read as wood          */
    for (var i = 0; i < n; i++){
      var u = rnd();
      var r = rad * (1 - 0.55 * u) * Math.sqrt(rnd());
      var a = rnd() * Math.PI * 2;
      axis(u, c);
      var x = c[0] + (px * Math.cos(a) + qx * Math.sin(a)) * r;
      var y = c[1] + (py * Math.cos(a) + qy * Math.sin(a)) * r;
      var z = c[2] + (pz * Math.cos(a) + qz * Math.sin(a)) * r;
      var bark = 0.34 + 1.05 * Math.pow(mottle(x * 4.0, y * 4.0, z * 4.0, 6.0, 0.66), 2.4);
      push(x, y, z, bark * (0.66 + 0.34 * u), 0.76 + rnd() * 0.30,
           Math.max(0.05, (c[1] + 0.90) * 0.26) + u * 0.16, phase);
    }
    /* flowering sites: twigs only, and never right at the fork */
    if (rad < 0.034){
      var nf = Math.max(1, Math.round(len * 7));
      for (var f = 0; f < nf; f++){
        var uf = 0.22 + 0.78 * (f + 0.35 + 0.3 * rnd()) / nf;
        axis(uf, c);
        var spin = phase * 3.1 + f * 2.399;
        sites.push([c[0], c[1], c[2], ux, uy, uz, spin,
                    Math.max(0.05, (c[1] + 0.90) * 0.26) + uf * 0.16]);
      }
    }
    axis(1, c);
    if (depth <= 0 || rad < 0.016) return;
    /* two children, one keeping the line, one thrown off it */
    for (var k = 0; k < 2; k++){
      var sp2 = phase * 2.7 + k * 2.4 + depth * 1.1;
      var kx = ux + (k === 0 ? 0.24 : -0.52) * Math.cos(sp2) + 0.12 * Math.sin(sp2 * 1.7);
      var ky = uy + (k === 0 ? 0.18 : 0.52) + 0.14 * Math.sin(sp2);
      var kz = uz + (k === 0 ? 0.20 : -0.34) * Math.sin(sp2 * 1.3);
      limb(c[0], c[1], c[2], kx, ky, kz, len * (0.74 - k * 0.11), rad * (0.64 - k * 0.06),
           depth - 1, phase + 0.9 + k * 1.7);
    }
    if (depth > 1){
      /* a short spur off the middle, so the silhouette never reads as a
         clean binary fork                                              */
      var s3 = phase * 1.9 + 3.3;
      axis(0.50, c);
      limb(c[0], c[1], c[2], ux + 0.95 * Math.cos(s3), uy + 0.75, uz + 0.95 * Math.sin(s3),
           len * 0.48, rad * 0.44, depth - 2, phase + 2.6);
    }
  }

  /* one heavy limb crossing the frame low and left, climbing as it goes,
     and a second thinner one set behind it                             */
  limb(-1.95, -0.72, -0.16, 1.00, 0.34, 0.10, 1.30, 0.098, 4, 0.0);
  limb(-1.80, -0.52,  0.42, 0.92, 0.62, -0.26, 1.02, 0.058, 3, 3.1);

  /* ---- blossoms: five notched petals, a flared throat, lit stamens ---- */
  function blossom(x, y, z, ux, uy, uz, scale, phase, sway){
    var ul = Math.hypot(ux, uy, uz) || 1; ux /= ul; uy /= ul; uz /= ul;
    var px = -uy, py = ux, pz = 0.0;
    var pl = Math.hypot(px, py, pz) || 1; px /= pl; py /= pl; pz /= pl;
    var qx = uy * pz - uz * py, qy = uz * px - ux * pz, qz = ux * py - uy * px;
    var NP = 560;
    for (var k = 0; k < 5; k++){
      var base = k * (Math.PI * 2 / 5) + phase;
      for (var i = 0; i < NP; i++){
        /* petal: a rounded lobe with the notch cherry blossom is known for
           cut into its outer edge                                       */
        var v = Math.pow(rnd(), 0.58);                 /* root -> tip     */
        var lat = (rnd() * 2 - 1);
        var halfw = 0.44 * Math.sin(Math.PI * Math.min(1, 0.16 + v * 0.92));
        var notch = 1.0 - 0.52 * Math.exp(-Math.pow((v - 0.99) / 0.15, 2))
                              * Math.exp(-Math.pow(lat / 0.32, 2));
        var rr = (0.12 + 0.88 * v) * notch * scale;
        var la = lat * halfw * scale;
        var ang = base + la / Math.max(rr, 0.02);
        var lift = (0.34 * v - 0.20 * v * v) * scale;   /* the cup flares */
        var cx = x + (px * Math.cos(ang) + qx * Math.sin(ang)) * rr + ux * lift;
        var cy = y + (py * Math.cos(ang) + qy * Math.sin(ang)) * rr + uy * lift;
        var cz = z + (pz * Math.cos(ang) + qz * Math.sin(ang)) * rr + uz * lift;
        /* palest at the rim, flushed at the throat, with a vein up the
           middle of every petal                                        */
        var vein = 1.0 + 0.35 * Math.exp(-Math.pow(lat / 0.10, 2));
        var inten = (0.16 + 0.54 * Math.pow(v, 1.15)) * vein * (1.0 - 0.20 * Math.abs(lat))
                  * mottle(cx * 2.2, cy * 2.2, cz * 2.2, 4.0, 0.30);
        push(cx, cy, cz, inten, 0.80 + rnd() * 0.30, sway, phase + k);
      }
    }
    /* stamens: the brightest thing in the tree */
    for (var s = 0; s < 380; s++){
      var sa = rnd() * Math.PI * 2, sv = Math.pow(rnd(), 0.8);
      var sr = sv * 0.32 * scale, sl = (0.10 + sv * 0.50) * scale;
      var tip = Math.pow(sv, 6.0);
      var sx = x + (px * Math.cos(sa) + qx * Math.sin(sa)) * sr + ux * sl;
      var sy = y + (py * Math.cos(sa) + qy * Math.sin(sa)) * sr + uy * sl;
      var sz = z + (pz * Math.cos(sa) + qz * Math.sin(sa)) * sr + uz * sl;
      push(sx, sy, sz, 0.30 + 1.85 * tip, 0.74 + rnd() * 0.26, sway, phase + 1.7);
    }
  }

  /* the flowers sit along the twigs in ones and twos, each thrown off on
     its own short pedicel so the branch has depth rather than a fringe */
  for (var si = 0; si < sites.length; si++){
    var st = sites[si];
    var sway = st[7];
    var count = (si % 4 === 3) ? 2 : 1;
    for (var f2 = 0; f2 < count; f2++){
      var sp4 = st[6] + f2 * 2.09;
      var pedX = Math.cos(sp4) * 0.070, pedY = 0.030 + f2 * 0.028, pedZ = Math.sin(sp4) * 0.070;
      blossom(st[0] + pedX, st[1] + pedY, st[2] + pedZ,
              pedX * 3.4 + st[3] * 0.35, 0.90 + st[4] * 0.35, pedZ * 3.4 + st[5] * 0.35,
              0.082 + rnd() * 0.030, sp4, sway);
    }
    /* every fourth site keeps a closed bud instead, for the ragged feel */
    if (si % 4 === 1){
      for (var b3 = 0; b3 < 1600; b3++){
        var ub = rnd();
        var rb = 0.040 * Math.sin(Math.PI * Math.min(1, 0.16 + ub * 0.94)) * Math.sqrt(rnd());
        var ab = rnd() * Math.PI * 2;
        push(st[0] - 0.045 + Math.cos(ab) * rb,
             st[1] + 0.020 + ub * 0.10 + Math.sin(ab) * rb * 0.8,
             st[2] + 0.038 + Math.sin(ab) * rb,
             0.30 + 0.66 * ub, 0.76 + rnd() * 0.26, sway, st[6]);
      }
    }
  }

  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aInt',  new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize', new THREE.Float32BufferAttribute(SIZ, 1));
  g.setAttribute('aRnd',  new THREE.Float32BufferAttribute(RND, 3));
  g.setAttribute('aSway', new THREE.Float32BufferAttribute(SWAY, 2));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.8, 0), 6.0);
  return g;
}

var branchMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0 },
    uSize:   { value: 4.0 },
    uBright: { value: 1.0 },
    uFade:   { value: 0.0 },
    uSway:   { value: 0.075 }
  },
  vertexShader: [
    'attribute float aInt; attribute float aSize; attribute vec3 aRnd; attribute vec2 aSway;',
    'uniform float uTime, uSize, uBright, uFade, uSway;',
    'varying float vInt;',
    'void main(){',
    '  vec3 p = position;',
    /* wind: the whole limb leans, and the far tips lean most */
    '  float k = aSway.x * aSway.x;',
    '  float w = sin(uTime * 0.72 + aSway.y) * 0.58 + sin(uTime * 0.29 + aSway.y * 1.7) * 0.42;',
    '  p.x += w * uSway * k;',
    '  p.z += cos(uTime * 0.53 + aSway.y * 0.8) * uSway * 0.55 * k;',
    '  p.y -= abs(w) * uSway * 0.16 * k;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float tw = 0.84 + 0.16 * sin(uTime * (1.6 + aRnd.y * 5.0) + aRnd.z * 43.0);',
    '  vInt = aInt * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: pointsMat.fragmentShader,
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var bed = new THREE.Object3D();
scene.add(bed);
var branch = new THREE.Points(buildBranch(), branchMat);
branch.frustumCulled = false;
bed.add(branch);

/* ==================================================================
    Falling petals — the one thing that is neither animal nor tree
    ------------------------------------------------------------------
    each petal is a little sheet of points sharing a seed; the vertex
    shader gives it a fall, a sway and two axes of tumble, so the
    whole drift is computed on the gpu from one static buffer.
   ================================================================== */
function buildPetals(){
  var P = [], SEED = [], INT = [], SIZ = [];
  var N = 34;
  for (var i = 0; i < N; i++){
    var scale = 0.130 + rnd() * 0.085;
    /* seed: x drift centre, z depth, fall phase, spin rate */
    var sx = -2.60 + rnd() * 5.00;
    var sz = -1.60 + rnd() * 2.60;
    var phase = rnd();
    var spin = 0.55 + rnd() * 1.25;
    for (var k = 0; k < 1500; k++){
      var v = Math.pow(rnd(), 0.62), lat = (rnd() * 2 - 1);
      var halfw = 0.44 * Math.sin(Math.PI * Math.min(1, 0.18 + v * 0.90));
      var notch = 1.0 - 0.55 * Math.exp(-Math.pow((v - 0.99) / 0.16, 2))
                            * Math.exp(-Math.pow(lat / 0.34, 2));
      var lx = (0.06 + 0.94 * v) * notch * scale;
      var ly = lat * halfw * scale;
      var lz = (0.16 * Math.sin(Math.PI * v) * lat) * scale;   /* a curled sheet */
      P.push(lx, ly, lz);
      SEED.push(sx, sz, phase, spin);
      INT.push((0.34 + 0.80 * Math.pow(v, 1.2)) * (1.0 - 0.20 * Math.abs(lat)));
      SIZ.push(0.80 + rnd() * 0.30);
    }
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aSeed',    new THREE.Float32BufferAttribute(SEED, 4));
  g.setAttribute('aInt',     new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize',    new THREE.Float32BufferAttribute(SIZ, 1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 8.0);
  return g;
}

var petalMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0 },
    uSize:   { value: 4.0 },
    uBright: { value: 1.0 },
    uFade:   { value: 0.0 },
    uSpan:   { value: 5.2 }
  },
  vertexShader: [
    'attribute vec4 aSeed; attribute float aInt; attribute float aSize;',
    'uniform float uTime, uSize, uBright, uFade, uSpan;',
    'varying float vInt;',
    'mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }',
    'mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }',
    'mat3 rotZ(float a){ float c=cos(a),s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }',
    'void main(){',
    '  float fall = fract(aSeed.z + uTime * 0.052 * (0.7 + aSeed.w * 0.4));',
    '  float y = 2.35 - fall * uSpan;',
    /* a petal does not drop, it slips sideways as it turns over */
    '  float sw = sin(uTime * (0.55 + aSeed.w * 0.5) + aSeed.z * 39.0);',
    '  vec3 c = vec3(aSeed.x + sw * 0.42, y, aSeed.y + cos(uTime * 0.41 + aSeed.z * 21.0) * 0.26);',
    '  vec3 p = rotY(uTime * aSeed.w * 1.35 + aSeed.z * 12.0)',
    '         * rotZ(sw * 0.9)',
    '         * rotX(uTime * aSeed.w * 0.85) * position;',
    '  vec4 mv = modelViewMatrix * vec4(p + c, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    /* fade in at the top of the fall and out at the bottom */
    '  float life = smoothstep(0.0, 0.10, fall) * (1.0 - smoothstep(0.86, 1.0, fall));',
    '  vInt = aInt * life * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: pointsMat.fragmentShader,
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var drift = new THREE.Object3D();
scene.add(drift);
var petals = new THREE.Points(buildPetals(), petalMat);
petals.frustumCulled = false;
drift.add(petals);

/* ================================================================== */
/*  Post chain                                                        */
/* ================================================================== */
function makeRT(w, h){
  return new THREE.WebGLRenderTarget(Math.max(2, w | 0), Math.max(2, h | 0), {
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat, type: THREE.HalfFloatType,
    depthBuffer: false, stencilBuffer: false
  });
}
var rtScene = makeRT(2, 2), rtA = makeRT(2, 2), rtB = makeRT(2, 2),
    rtC = makeRT(2, 2), rtD = makeRT(2, 2);

var quadScene = new THREE.Scene();
var quadCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
var quadGeo   = new THREE.PlaneGeometry(2, 2);
var quadMesh  = new THREE.Mesh(quadGeo, null);
quadScene.add(quadMesh);
function blit(mat, target){
  quadMesh.material = mat;
  renderer.setRenderTarget(target || null);
  renderer.render(quadScene, quadCam);
}

var VERT_QUAD = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

var copyMat = new THREE.ShaderMaterial({
  uniforms: { tSrc: { value: null } },
  vertexShader: VERT_QUAD,
  fragmentShader: 'uniform sampler2D tSrc; varying vec2 vUv;' +
                  'void main(){ gl_FragColor = texture2D(tSrc, vUv); }',
  depthTest: false, depthWrite: false
});

var blurMat = new THREE.ShaderMaterial({
  uniforms: { tSrc: { value: null }, uStep: { value: new THREE.Vector2() } },
  vertexShader: VERT_QUAD,
  fragmentShader: [
    'uniform sampler2D tSrc; uniform vec2 uStep; varying vec2 vUv;',
    'void main(){',
    '  vec4 s = texture2D(tSrc, vUv) * 0.2270270270;',
    '  s += (texture2D(tSrc, vUv + uStep * 1.3846153846) + texture2D(tSrc, vUv - uStep * 1.3846153846)) * 0.3162162162;',
    '  s += (texture2D(tSrc, vUv + uStep * 3.2307692308) + texture2D(tSrc, vUv - uStep * 3.2307692308)) * 0.0702702703;',
    '  gl_FragColor = s;',
    '}'
  ].join('\\n'),
  depthTest: false, depthWrite: false
});

var compMat = new THREE.ShaderMaterial({
  uniforms: {
    tScene: { value: null }, tGlow: { value: null }, tGlow2: { value: null },
    uRes:   { value: new THREE.Vector2(2, 2) },
    uCell:  { value: 8.5 },
    uGain:  { value: CFG.gain },
    uCurve: { value: CFG.curve },
    uDot:   { value: new THREE.Vector2(CFG.dotMax, CFG.dotGamma) },
    uGlow:  { value: CFG.glow },
    uGlowGain: { value: CFG.glowGain },
    uExposure: { value: CFG.exposure }
  },
  vertexShader: VERT_QUAD,
  fragmentShader: [
    'precision highp float;',
    'uniform sampler2D tScene, tGlow, tGlow2;',
    'uniform vec2 uRes, uDot;',
    'uniform float uCell, uGain, uGlow, uGlowGain, uExposure, uCurve;',
    'varying vec2 vUv;',
    'const float K = 0.70710678;',
    /* plum -> blossom: the ember ramp re-sampled for cherry */
    'vec3 ramp(float u){',
    '  u = clamp(u, 0.0, 1.0);',
    '  vec3 c1 = vec3(0.180, 0.052, 0.098);',
    '  vec3 c2 = vec3(0.545, 0.170, 0.280);',
    '  vec3 c3 = vec3(0.925, 0.545, 0.640);',
    '  vec3 c4 = vec3(0.995, 0.885, 0.905);',
    '  vec3 c = c1 * smoothstep(0.0, 0.135, u);',
    '  c = mix(c, c2, smoothstep(0.115, 0.375, u));',
    '  c = mix(c, c3, smoothstep(0.360, 0.625, u));',
    '  c = mix(c, c4, smoothstep(0.615, 1.000, u));',
    '  return c;',
    '}',
    'void main(){',
    '  vec2 pix = vUv * uRes;',
    /* 45 degree halftone lattice: sample the source at the dot centre */
    '  mat2 R  = mat2(K, -K, K, K);',
    '  mat2 Ri = mat2(K,  K, -K, K);',
    '  vec2 lp = (R * pix) / uCell;',
    '  vec2 id = floor(lp) + 0.5;',
    '  vec2 cp = Ri * (id * uCell);',
    '  vec2 ex = Ri * vec2(uCell * 0.42, 0.0);',
    '  vec2 ey = Ri * vec2(0.0, uCell * 0.42);',
    '  float d = texture2D(tScene, clamp(cp / uRes, vec2(0.0), vec2(1.0))).r * 0.36;',
    '  d += texture2D(tScene, clamp((cp + ex) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp - ex) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp + ey) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp - ey) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  float u = pow(1.0 - exp(-d * uGain), uCurve);',
    '  float rad = uDot.x * pow(u, uDot.y);',
    '  float aa  = 0.85 / uCell;',
    '  float cov = 1.0 - smoothstep(rad - aa, rad + aa, length(lp - id));',
    '  vec3 col = ramp(u) * cov;',
    '  float g = texture2D(tGlow, vUv).r * 0.62 + texture2D(tGlow2, vUv).r * 0.38;',
    '  col += ramp(pow(1.0 - exp(-g * uGain * uGlowGain), uCurve)) * uGlow;',
    '  gl_FragColor = vec4(col * uExposure, 1.0);',
    '}'
  ].join('\\n'),
  depthTest: false, depthWrite: false
});

/* ================================================================== */
/*  Layout: place the animal by screen anchor                         */
/* ================================================================== */
var VW = 1440, VH = 914;              /* reference design frame */
var view = { w: 1, h: 1, aspect: 1 };

function resize(){
  var w = window.innerWidth, h = window.innerHeight;
  view.w = w; view.h = h; view.aspect = w / h;
  renderer.setSize(w, h, false);
  camera.aspect = view.aspect;
  camera.updateProjectionMatrix();

  var pw = Math.round(w * DPR), ph = Math.round(h * DPR);
  rtScene.setSize(pw, ph);
  rtA.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
  rtB.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
  rtC.setSize(Math.max(2, pw >> 3), Math.max(2, ph >> 3));
  rtD.setSize(Math.max(2, pw >> 3), Math.max(2, ph >> 3));
  compMat.uniforms.uRes.value.set(pw, ph);
  compMat.uniforms.uCell.value = CFG.cellCss * DPR;
}
window.addEventListener('resize', resize);

/* convert a design-frame anchor (px in the 1440x914 frame) + depth into a
   world position in front of the camera */
function anchorToWorld(ax, ay, dist, out){
  var ndcX = (ax / VW) * 2 - 1;
  var ndcY = 1 - (ay / VH) * 2;
  var hHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * dist;
  var wHalf = hHalf * view.aspect;
  var designAspect = VW / VH;
  var sx = view.aspect >= designAspect ? (designAspect / view.aspect) : 1.0;
  out.set(ndcX * wHalf * sx, ndcY * hHalf, -dist);
  return out;
}

/* ================================================================== */
/*  Frame                                                             */
/* ================================================================== */
var qTmp = new THREE.Quaternion(), qA = new THREE.Quaternion();
var AX_X = new THREE.Vector3(1, 0, 0);
var fIdle = new THREE.Vector3(), fMix = new THREE.Vector3(), aimTgt = new THREE.Vector3();

function fwdFromAzEl(az, el, out){
  return out.set(Math.cos(el) * Math.cos(az), Math.sin(el), -Math.cos(el) * Math.sin(az));
}
function aimMoth(f, spin){
  qA.setFromUnitVectors(AX_X, f);
  qTmp.setFromAxisAngle(f, spin);
  moth.quaternion.copy(qA).premultiply(qTmp);
}

/* ---------- pointer chase --------------------------------------------
   the canvas takes no hit test, so the butterfly's own projected centre
   is compared against the pointer instead.  engaged it shrinks, flies to
   a standoff from the cursor and beats hard; left alone it drifts back
   down to the branch and idles its wings there.                        */
var ptr = { x: 0, y: 0, live: false, moved: -99, hot: false };
var eng = { w: 0, ax: 0, ay: 0, seeded: false,
            ndc: new THREE.Vector3(), aim: new THREE.Vector3(1, 0, 0) };

function track(e){
  ptr.x = e.clientX; ptr.y = e.clientY;
  ptr.live = true; ptr.moved = performance.now() / 1000;
}
window.addEventListener('pointermove', track, { passive: true });
window.addEventListener('pointerdown', track, { passive: true });
document.addEventListener('pointerleave', function (){ ptr.live = false; ptr.hot = false; });
window.addEventListener('blur', function (){ ptr.live = false; ptr.hot = false; });

var anchorTmp = { x: 0, y: 0 };
function screenToAnchor(px, py, out){
  var designAspect = VW / VH;
  var k = view.aspect >= designAspect ? (designAspect / view.aspect) : 1.0;
  out.x = ((2 * px / view.w - 1) / k + 1) * 0.5 * VW;
  out.y = (py / view.h) * VH;
  return out;
}

var pos  = new THREE.Vector3();
var lastNow = performance.now() / 1000;
var everRendered = false;
/* once a capture harness drives the clock, the live loop stands down so the
   two are not both advancing the same smoothing state */
var headless = false;
/* headless pose override, used only while tuning the cloud */
var DBG = { on: false };

function render(t, dt){
  everRendered = true;

  /* ---- arrival: far and small -> the perch above the branch ---- */
  var f  = ease(THREE.MathUtils.clamp((t - T.flightStart) / (T.flightEnd - T.flightStart), 0, 1));
  var fl = easeIO(THREE.MathUtils.clamp((t - T.flightStart) / (T.flightEnd - T.flightStart), 0, 1));

  var P  = CFG.perch;
  var frz = CFG.freeze;

  /* on tall / narrow viewports pull the animal up and back so it keeps
     clear of the branch it is heading for                             */
  var narrow = THREE.MathUtils.clamp((1.40 - view.aspect) / 0.55, 0, 1);
  var tight  = THREE.MathUtils.clamp((900 - view.w) / 420, 0, 1);
  var pDist  = P.dist * (1 + 0.22 * narrow) * (1 + 0.55 * tight);
  var pAx    = P.ax   + 40 * narrow + 30 * tight;
  var pAy    = P.ay   - 30 * narrow - 20 * tight;

  var dist  = frz ? pDist : THREE.MathUtils.lerp(9.4, pDist, f);
  var ax    = frz ? pAx   : THREE.MathUtils.lerp(1120, pAx, fl);
  var ay    = frz ? pAy   : THREE.MathUtils.lerp(150, pAy, fl);

  /* idle drift: a butterfly never holds a line, so the wander is wider and
     more erratic than the hummingbird's, and it settles onto the branch  */
  /* a butterfly never holds a line: the wander is wider and more erratic
     than the hummingbird's — but once it has reached the branch it damps
     down to the small shuffle of an insect sitting on a flower         */
  var landed = THREE.MathUtils.smoothstep(f, 0.80, 1.0);
  var roam   = THREE.MathUtils.lerp(1.0, 0.16, landed);
  var bob = frz ? 0 : (Math.sin(t * 0.94) * 0.34 + Math.sin(t * 0.41 + 1.2) * 0.52
                    + Math.sin(t * 1.77 + 2.6) * 0.14) * roam;
  var swy = frz ? 0 : (Math.sin(t * 0.63 + 0.4) * 0.62 + Math.sin(t * 0.29) * 0.44
                    + Math.sin(t * 1.31 + 2.0) * 0.13) * roam;
  var idleX = ax + swy * 62, idleY = ay + bob * 52;

  /* ---- engagement ---- */
  var want = (ptr.live && f > 0.45 && (ptr.hot || t + start - ptr.moved < 2.2)) ? 1 : 0;
  eng.w += (want - eng.w) * Math.min(1, dt * (want ? 2.4 : 1.2));
  var chase = frz ? 0 : eng.w;

  screenToAnchor(ptr.x, ptr.y, anchorTmp);
  var hx = idleX - anchorTmp.x, hy = idleY - anchorTmp.y;
  var hl = Math.hypot(hx, hy) || 1;
  var stand = Math.min(hl, 190);
  var tgtX = THREE.MathUtils.lerp(idleX, anchorTmp.x + hx / hl * stand, chase);
  var tgtY = THREE.MathUtils.lerp(idleY, anchorTmp.y + hy / hl * stand, chase);
  if (!eng.seeded){ eng.ax = tgtX; eng.ay = tgtY; eng.seeded = true; }
  /* the approach is loose — a butterfly overshoots and comes back */
  var follow = Math.min(1, dt * (2.1 + 5.4 * (1 - chase)));
  eng.ax += (tgtX - eng.ax) * follow;
  eng.ay += (tgtY - eng.ay) * follow;
  anchorToWorld(eng.ax, eng.ay, dist, pos);
  moth.position.copy(pos);

  var breathe = frz ? 1 : 1 + 0.050 * Math.sin(t * 0.49 + 0.7);
  var sc = (frz ? P.scale : THREE.MathUtils.lerp(0.58, P.scale, f)) * breathe
         * THREE.MathUtils.lerp(1, 0.74, chase);
  moth.scale.setScalar(sc);

  /* ---- aim the head at the cursor ---- */
  eng.ndc.copy(pos).project(camera);
  var bx = (eng.ndc.x * 0.5 + 0.5) * view.w;
  var by = (-eng.ndc.y * 0.5 + 0.5) * view.h;
  var dx = ptr.x - bx, dy = ptr.y - by;
  var len = Math.hypot(dx, dy);
  if (len > 8){
    aimTgt.set(dx / len, -dy / len, 0.34).normalize();
    eng.aim.lerp(aimTgt, Math.min(1, dt * 2.6)).normalize();
  }

  var az   = (frz ? P.az   : THREE.MathUtils.lerp(P.az - 0.34,  P.az,   fl)) + (frz?0:Math.sin(t * 0.33) * 0.20);
  var el   = (frz ? P.el   : THREE.MathUtils.lerp(P.el + 0.30,  P.el,   fl)) + (frz?0:Math.sin(t * 0.47 + 2.0) * 0.16);
  /* the roll is what sells a butterfly: it banks hard on every turn */
  var spin = (frz ? P.spin : THREE.MathUtils.lerp(P.spin - 0.30, P.spin, fl))
           + (frz?0:Math.sin(t * 0.58 + 0.9) * 0.13 + Math.sin(t * 0.24) * 0.09)
           + chase * 0.62 * THREE.MathUtils.clamp(dx / (view.w * 0.5), -1, 1);
  if (DBG.on){
    az = DBG.az; el = DBG.el; spin = DBG.spin;
    anchorToWorld(DBG.ax, DBG.ay, DBG.dist, pos);
    moth.position.copy(pos);
    moth.scale.setScalar(DBG.scale);
    sc = DBG.scale;
  }
  fwdFromAzEl(az, el, fIdle);
  fMix.copy(fIdle).lerp(DBG.on ? fIdle : eng.aim, chase).normalize();
  aimMoth(fMix, spin);

  /* ---- the branch: planted, swaying, never chasing anything ---- */
  screenToAnchor(view.w * (CFG.floraPose.ax / VW), view.h * (CFG.floraPose.ay / VH), anchorTmp);
  anchorToWorld(anchorTmp.x, anchorTmp.y, CFG.floraPose.dist, pos);
  bed.position.copy(pos);
  bed.scale.setScalar(CFG.floraPose.scale);
  branchMat.uniforms.uTime.value   = t;
  branchMat.uniforms.uFade.value   = THREE.MathUtils.smoothstep(t, T.flightStart, T.flightStart + 1.9);
  branchMat.uniforms.uBright.value = CFG.bright * CFG.flora;
  branchMat.uniforms.uSize.value   = CFG.pointSize * CFG.floraSize * DPR * (view.h / VH);

  /* ---- the petals fall through the whole frame, not off the branch ---- */
  anchorToWorld(VW * 0.5, VH * 0.5, 6.4, pos);
  drift.position.copy(pos);
  petalMat.uniforms.uTime.value   = t;
  petalMat.uniforms.uFade.value   = THREE.MathUtils.smoothstep(t, T.flightStart + 0.4, T.flightStart + 2.8);
  petalMat.uniforms.uBright.value = CFG.bright * CFG.petals;
  petalMat.uniforms.uSize.value   = CFG.pointSize * CFG.floraSize * DPR * (view.h / VH);

  /* ---- wingbeat: full in flight, a slow open-and-close once settled,
         with an occasional burst so the rest never goes dead ---- */
  var burst  = Math.pow(Math.max(0, Math.sin(t * 0.21 + 1.1)), 10.0);
  var active = THREE.MathUtils.clamp(chase + burst + (1 - landed), 0, 1);
  var omega = 2 * Math.PI * THREE.MathUtils.lerp(CFG.restBeat, CFG.beat, active);
  pointsMat.uniforms.uOmega.value    = omega;
  pointsMat.uniforms.uBlurSpan.value = (2 * Math.PI / omega) * CFG.blurSpan * (0.20 + 0.80 * active);
  pointsMat.uniforms.uAmp.value      = DBG.on ? DBG.amp : CFG.perch.flap
                                     * THREE.MathUtils.lerp(0.15, 1.0, active)
                                     * (0.92 + 0.10 * Math.sin(t * 0.61));
  pointsMat.uniforms.uTime.value     = t;
  pointsMat.uniforms.uSize.value     = CFG.pointSize * DPR * (view.h / VH) * Math.pow(sc, 0.9);
  pointsMat.uniforms.uBright.value   = CFG.bright;
  pointsMat.uniforms.uWing.value     = CFG.wing;
  pointsMat.uniforms.uFade.value     = THREE.MathUtils.smoothstep(t, T.flightStart, T.flightStart + 1.1);

  /* ---- render ---- */
  renderer.setRenderTarget(rtScene);
  renderer.clear(true, true, true);
  renderer.render(scene, camera);

  copyMat.uniforms.tSrc.value = rtScene.texture;                     blit(copyMat, rtA);
  blurMat.uniforms.tSrc.value = rtA.texture;
  blurMat.uniforms.uStep.value.set(1 / rtA.width, 0);                blit(blurMat, rtB);
  blurMat.uniforms.tSrc.value = rtB.texture;
  blurMat.uniforms.uStep.value.set(0, 1 / rtA.height);               blit(blurMat, rtA);

  copyMat.uniforms.tSrc.value = rtA.texture;                         blit(copyMat, rtC);
  blurMat.uniforms.tSrc.value = rtC.texture;
  blurMat.uniforms.uStep.value.set(1 / rtC.width, 0);                blit(blurMat, rtD);
  blurMat.uniforms.tSrc.value = rtD.texture;
  blurMat.uniforms.uStep.value.set(0, 1 / rtC.height);               blit(blurMat, rtC);

  compMat.uniforms.tScene.value = rtScene.texture;
  compMat.uniforms.tGlow.value  = rtA.texture;
  compMat.uniforms.tGlow2.value = rtC.texture;
  compMat.uniforms.uGain.value  = CFG.gain;
  compMat.uniforms.uCurve.value = CFG.curve;
  compMat.uniforms.uDot.value.set(CFG.dotMax, CFG.dotGamma);
  compMat.uniforms.uGlow.value  = CFG.glow;
  compMat.uniforms.uGlowGain.value = CFG.glowGain;
  compMat.uniforms.uExposure.value = CFG.exposure;
  compMat.uniforms.uCell.value  = CFG.cellCss * DPR;
  blit(compMat, null);
}

function frame(now){
  requestAnimationFrame(frame);
  if (headless) return;
  /* note: no document.hidden guard — some embedded webviews report the
     document as permanently hidden while still driving rAF            */
  var t = reduced ? (T.flightEnd + 3.0) : (now / 1000 - start);
  var dt = Math.min(0.05, Math.max(0.001, now / 1000 - lastNow));
  lastNow = now / 1000;
  render(t, dt);
}

/* a page opened in a background tab gets no animation frames, so the
   arrival would be over before it was ever seen — replay it on reveal */
document.addEventListener('visibilitychange', function(){
  if (document.hidden || everRendered) return;
  start = performance.now() / 1000;
});

resize();
requestAnimationFrame(frame);

/* headless capture: render exactly one frame at an absolute time */
window.__seek = function(t){ headless = true; render(t, 1 / 30); };
window.__pose = function(o){ DBG.on = true; for (var k in o) DBG[k] = o[k]; };
window.__ptr  = function(x, y, live){ ptr.x = x; ptr.y = y;
  ptr.live = live !== false; ptr.moved = start + 1e9; };
window.__box  = (function(){ var g = branch.geometry; g.computeBoundingBox();
  return g.boundingBox.min.toArray().concat(g.boundingBox.max.toArray()); })();
window.__dbg  = { moth: moth, cloud: cloud, mat: pointsMat, cam: camera, THREE: THREE,
                  ptr: ptr, eng: eng, view: view, cfg: CFG };
})();
<\/script>
</body>
</html>
`,Y=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Trochil Reef — halftone fish over a coral shelf</title>
<meta name="description" content="A procedural halftone reef fish that swims to the cursor and returns to its coral shelf, lit by sun shafts falling through the water, rendered as one additive point cloud through a 45 degree dot screen.">
<meta name="theme-color" content="#01060c">
<style>
  html, body { margin:0; width:100%; height:100%; background:#01060c; overflow:hidden; }
  #gl { position:fixed; inset:0; display:block; width:100%; height:100%; }
</style>
</head>
<body>
<canvas id="gl"></canvas>
<!--
  Trochil Reef — the authored halftone drawing system moved underwater.

  Everything below the "Post chain" heading is the system lifted out of the
  authored Trochil page (public/landing-pages/trochil-hero.html,
  SHA-256 db9447887bd9...): the additive point material, the density buffer,
  the two-level blur, the 45 degree halftone composite, the design-frame
  anchoring and the frame loop. Five regions are this scene's own — the CFG
  block, the fish cloud with its travelling body wave, the coral shelf, the
  drifting plankton, and a composite that swaps the ember -> gold ramp for a
  deep-water one and feeds sun shafts into the density buffer, so the light
  through the water is screened by the same dot lattice as the reef.
-->
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
(function () {
'use strict';

var T = { flightStart: 0.10, flightEnd: 4.60 };
function ease(t){ return t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3); }
/* A traverse wave: a triangle through the middle, so the fish holds a steady
   speed across the frame, blended into a sine at the ends, so it eases into
   the turn and accelerates out of it instead of reversing on a corner. */
function tri(x){
  var sine = Math.sin(x);
  var ramp = (2 / Math.PI) * Math.asin(sine);
  var corner = Math.pow(Math.abs(ramp), 4.0);
  return ramp * (1 - corner) + sine * corner;
}
function easeIO(t){ return t <= 0 ? 0 : t >= 1 ? 1 : (t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2); }

var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var start = performance.now() / 1000;

/* ================================================================== */
/*  Tunables                                                          */
/* ================================================================== */
var CFG = window.__cfg = {
  gain:      1.00,
  curve:     0.52,
  dotMax:    0.735,
  dotGamma:  0.56,
  cellCss:   4.20,
  glow:      0.15,
  glowGain:  2.35,
  pointSize: 6.50,
  bright:    0.335,
  fin:       1.35,   /* pectoral fin intensity multiplier               */
  beat:      1.65,   /* body waves per second while cruising            */
  finBeat:   0.50,   /* pectoral strokes per body wave — a slow scull   */
  reef:      0.30,   /* coral intensity, relative to the fish           */
  reefSize:  2.30,
  motes:     0.42,   /* drifting plankton intensity                     */
  ray:       0.135,  /* sun shaft density fed into the halftone         */
  surface:   0.030,  /* broad light on the water above the reef         */
  reefPose:  { ax: 470, ay: 848, dist: 5.60, scale: 1.0 },
  blurSpan:  0.14,
  freeze:    false,
  exposure:  1.00,
  /* the station: where the fish holds when nothing is moving */
  home:      { ax: 900, ay: 402, dist: 5.00, scale: 0.90,
               az: 0.34, el: 0.12, spin: 0.00, flap: 1.0 }
};

/* ================================================================== */
/*  Shared cloud helpers                                              */
/* ================================================================== */
function rnd(){ return Math.random(); }
function rndn(){ /* ~gaussian */ return (rnd()+rnd()+rnd()+rnd()-2) * 0.7071; }

/* --- tiny 3d value-noise fbm: gives the cloud its organic mottling --- */
function h3(i, j, k){
  var n = (i * 374761393 + j * 668265263 + k * 1274126177) | 0;
  n = (n ^ (n >>> 13)) | 0;
  n = Math.imul(n, 1274126177) | 0;
  return (((n ^ (n >>> 16)) >>> 0) / 4294967295);
}
function vnoise(x, y, z){
  var i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  var fx = x - i, fy = y - j, fz = z - k;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  function L(a, b, t){ return a + (b - a) * t; }
  return L(L(L(h3(i,j,k),   h3(i+1,j,k),   fx), L(h3(i,j+1,k),   h3(i+1,j+1,k),   fx), fy),
           L(L(h3(i,j,k+1), h3(i+1,j,k+1), fx), L(h3(i,j+1,k+1), h3(i+1,j+1,k+1), fx), fy), fz);
}
function fbm(x, y, z){
  return 0.54 * vnoise(x, y, z)
       + 0.29 * vnoise(x * 2.13 + 11.3, y * 2.13 + 7.1, z * 2.13 + 3.7)
       + 0.17 * vnoise(x * 4.37 + 31.7, y * 4.37 + 17.9, z * 4.37 + 23.1);
}
function mottle(x, y, z, freq, amt){
  return 1.0 - amt + amt * 2.0 * fbm(x * freq + 5.0, y * freq + 9.0, z * freq + 2.0);
}
function sst(x, e0, e1){
  var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/* ==================================================================
    Fish point cloud
    ------------------------------------------------------------------
    a deep-bodied reef fish: nose along +X, the body compressed hard in
    Z so it reads as a plate rather than a tube, median fins standing
    off the top and bottom edges, a forked tail, and a pair of pectorals
    that beat on their own.  aPart 0 body, 4/5 the pectorals — the same
    convention the hummingbird's wings used.
   ================================================================== */
var PART_BODY = 0, PART_FIN_R = 4, PART_FIN_L = 5;
var SOCKET = new THREE.Vector3(0.20, -0.03, 0.075);

/* the body envelope: a tall oval that tapers to the snout and to the
   wrist the tail fin hangs off                                        */
function bodyH(s){
  return 0.375 * Math.pow(Math.sin(Math.PI * (0.055 + 0.89 * s)), 0.58)
       * (1.0 - 0.46 * sst(s, 0.80, 1.0));
}
function bodyW(s){
  return 0.108 * Math.pow(Math.sin(Math.PI * (0.10 + 0.82 * s)), 0.46);
}

function buildFish(){
  var P = [], PART = [], INT = [], RND = [], SIZ = [];
  function push(x,y,z, part, inten, size, r0,r1){
    P.push(x,y,z); PART.push(part); INT.push(inten); SIZ.push(size);
    RND.push(r0, r1, rnd());
  }

  /* ---- body ---- */
  var NB = 96000;
  for (var i = 0; i < NB; i++){
    var s  = rnd();
    var H = bodyH(s), W = bodyW(s);
    var th = rnd() * Math.PI * 2, rr = Math.pow(rnd(), 0.55);
    var bx = -0.50 + 1.05 * s;
    var by = -0.012 + 0.055 * Math.sin(Math.PI * s * 0.9) + H * rr * Math.sin(th);
    var bz = W * rr * Math.cos(th);
    /* three oblique bars, the way a butterflyfish is banded */
    var band = 1.0 - 0.58 * Math.pow(Math.max(0, Math.cos((bx * 12.4 - by * 4.2) - 0.9)), 5.0);
    /* the belly is pale, the back is dark: density falls off downward */
    var shade = 0.55 + 0.65 * sst(-by, -0.10, 0.30);
    /* the skin catches light at the rim of the plate */
    var edge = 1.0 + 0.85 * Math.pow(rr, 6.0);
    push(bx, by, bz, PART_BODY,
         0.56 * band * shade * edge * mottle(bx * 2.0, by * 2.0, bz * 4.0, 5.0, 0.34),
         0.82 + rnd() * 0.30, rnd(), rnd());
  }

  /* ---- eye: one lit ring on the midline.  the plate is translucent, so a
         single eye reads from either flank, where a pair drifts apart in
         perspective and gives the fish two of them ---- */
  for (var i2 = 0; i2 < 9000; i2++){
    var a2 = rnd() * Math.PI * 2, r2 = Math.pow(rnd(), 0.5) * 0.070;
    var ex = 0.395 + Math.cos(a2) * r2, ey = 0.058 + Math.sin(a2) * r2;
    var ez = (rnd() * 2 - 1) * bodyW(0.86) * 0.35;
    var ring = 1.15 * Math.exp(-Math.pow((r2 - 0.052) / 0.014, 2))
             + 0.24 - 0.20 * Math.exp(-Math.pow(r2 / 0.032, 2));
    push(ex, ey, ez, PART_BODY, Math.max(0.04, ring), 0.76 + rnd() * 0.24, rnd(), rnd());
  }

  /* ---- median fins: a dorsal sail and an anal fin, both rayed ---- */
  function median(sign, s0, s1, height, n, phase){
    for (var i3 = 0; i3 < n; i3++){
      var s3 = s0 + (s1 - s0) * rnd();
      var base = sign > 0 ? bodyH(s3) : -bodyH(s3);
      var u3 = Math.pow(rnd(), 0.72);
      var span = height * Math.sin(Math.PI * Math.min(1, 0.10 + (s3 - s0) / (s1 - s0) * 0.90));
      var fx = -0.50 + 1.05 * s3;
      var fy = -0.012 + 0.055 * Math.sin(Math.PI * s3 * 0.9) + base + sign * u3 * span;
      var fz = bodyW(s3) * 0.78 * (rnd() * 2 - 1) * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, 0.2 + u3)));
      /* the rays are the density; the membrane between them is thin */
      var ray = 0.58 + 0.78 * Math.pow(Math.max(0, Math.cos(s3 * 74.0 + phase)), 6.0);
      /* and the trailing edge of the sail catches the light */
      var rim = 1.0 + 1.25 * sst(u3, 0.82, 0.99);
      push(fx, fy, fz, PART_BODY, 0.40 * ray * rim * (1.0 - 0.30 * u3),
           0.76 + rnd() * 0.28, rnd(), rnd());
    }
  }
  median( 1, 0.14, 0.86, 0.255, 30000, 0.0);
  median(-1, 0.14, 0.62, 0.190, 20000, 1.7);

  /* ---- caudal fin: a forked tail off the wrist ---- */
  var NT = 34000;
  for (var i4 = 0; i4 < NT; i4++){
    var u4 = Math.pow(rnd(), 0.62);
    var lobe = rnd() < 0.5 ? 1 : -1;
    /* the fork: the lobes run out and apart, the notch stays short */
    var spread = 0.085 + 0.46 * u4;
    var ty = lobe * spread * (0.35 + 0.65 * Math.pow(rnd(), 0.5));
    var tx = -0.505 - u4 * 0.46 + Math.abs(ty) * 0.26;
    var tz = 0.052 * (rnd() * 2 - 1) * (0.4 + 0.6 * u4);
    var ray2 = 0.60 + 0.80 * Math.pow(Math.max(0, Math.cos(ty * 52.0)), 6.0);
    var rim2 = 1.0 + 1.05 * sst(u4, 0.80, 0.99);
    push(tx, ty - 0.012, tz, PART_BODY, 0.42 * ray2 * rim2, 0.76 + rnd() * 0.28, rnd(), rnd());
  }

  /* ---- pectorals: two small paddles that beat on their own ---- */
  for (var side = 0; side < 2; side++){
    var sgn = side === 0 ? 1 : -1;
    var part = side === 0 ? PART_FIN_R : PART_FIN_L;
    for (var i5 = 0; i5 < 13000; i5++){
      var u5 = Math.pow(rnd(), 0.6), lat = rnd() * 2 - 1;
      var hw = 0.115 * Math.sin(Math.PI * Math.min(1, 0.14 + u5 * 0.88));
      var px = SOCKET.x - u5 * 0.30;
      var py = SOCKET.y + lat * hw + u5 * 0.045;
      var pz = sgn * (SOCKET.z + u5 * 0.115);
      var ray3 = 0.58 + 0.70 * Math.pow(Math.max(0, Math.cos(lat * 26.0)), 6.0);
      push(px, py, pz, part, 0.40 * ray3 * (1.0 - 0.22 * u5), 0.74 + rnd() * 0.26, rnd(), rnd());
    }
  }

  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aPart',    new THREE.Float32BufferAttribute(PART, 1));
  g.setAttribute('aInt',     new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize',    new THREE.Float32BufferAttribute(SIZ, 1));
  g.setAttribute('aRnd',     new THREE.Float32BufferAttribute(RND, 3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 3.0);
  return g;
}

/* ================================================================== */
/*  Renderer / scene                                                  */
/* ================================================================== */
var canvas   = document.getElementById('gl');
var renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false,
                                       preserveDrawingBuffer: true,
                                       powerPreference: 'high-performance' });
} catch (e) { /* no webgl: the page stays dark rather than throwing */ }
if (!renderer){ canvas.style.display = 'none'; return; }
renderer.setClearColor(0x000000, 1);
var DPR = Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(DPR);

var scene  = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0, 0);

var fish = new THREE.Object3D();
scene.add(fish);

var pointsMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:     { value: 0 },
    uSize:     { value: 4.0 },
    uBright:   { value: 1.0 },
    uWing:     { value: 1.4 },
    uBlurSpan: { value: 0.0 },
    uOmega:    { value: 0.0 },
    uFlap:     { value: new THREE.Vector3(0.74, 0.26, 0.50) }, /* paddle, rake, beats per body wave */
    uSocket:   { value: SOCKET },
    uSwim:     { value: new THREE.Vector3(0.085, 4.1, 0.30) }, /* amplitude, wavenumber, yaw */
    uBend:     { value: 0 },   /* signed body curl through a turn        */
    uAmp:      { value: 1.0 },
    uFade:     { value: 1.0 }
  },
  vertexShader: [
    'attribute float aPart; attribute float aInt; attribute float aSize; attribute vec3 aRnd;',
    'uniform float uTime, uSize, uBlurSpan, uOmega, uAmp, uFade, uBright, uWing;',
    'uniform vec3 uFlap; uniform vec3 uSocket; uniform vec3 uSwim; uniform float uBend;',
    'varying float vInt;',
    'mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }',
    'mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }',
    'void main(){',
    '  vec3 p = position;',
    '  float inten = aInt;',
    '  if (aPart > 3.5){',
    '    float side = (aPart < 4.5) ? 1.0 : -1.0;',
    /* every fin particle carries its own offset inside the stroke, so the
       paddle renders as a swept fan rather than a single hard sheet    */
    '    float tf   = uTime - aRnd.x * uBlurSpan;',
    '    float w    = uOmega * uFlap.z;',
    '    float row  = uFlap.x * uAmp * sin(w * tf);',
    '    float rake = uFlap.y * uAmp * cos(w * tf - 0.7);',
    '    vec3  pv = vec3(uSocket.x, uSocket.y, side * uSocket.z);',
    '    vec3  q  = p - pv;',
    '    q = rotX(rake * side) * q;',
    '    q = rotY(row * side) * q;',
    '    p = q + pv;',
    '    inten *= uWing;',
    '  }',
    /* the travelling body wave: nothing at the nose, everything at the
       tail, and the sections yaw into the wave so the fish steers with
       its own body rather than sliding sideways                       */
    '  float k = smoothstep(0.42, -0.62, p.x);',
    '  float ph = uOmega * uTime - p.x * uSwim.y;',
    '  float wv = sin(ph);',
    '  float amp = uSwim.x * k * k;',
    '  float yaw = uSwim.z * cos(ph) * k * uAmp;',
    /* through a turn the whole body curls into a C: sections rotate about the
       vertical by an amount that grows toward the tail, which is the cue that
       separates a fish coming round from a card being spun            */
    '  p = rotY(yaw + uBend * k * k) * p;',
    '  p.z += wv * amp * uAmp;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float tw = 0.80 + 0.20 * sin(uTime * (2.2 + aRnd.y * 7.0) + aRnd.z * 43.0);',
    '  vInt = inten * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: [
    'varying float vInt;',
    'void main(){',
    '  vec2 d = gl_PointCoord - 0.5;',
    '  float r2 = dot(d, d) * 4.0;',
    '  if (r2 > 1.0) discard;',
    '  float a = exp(-r2 * 2.55) - 0.078;',
    '  gl_FragColor = vec4(vec3(vInt * max(a, 0.0)), 1.0);',
    '}'
  ].join('\\n'),
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var cloud = new THREE.Points(buildFish(), pointsMat);
cloud.frustumCulled = false;
fish.add(cloud);

/* ==================================================================
    The coral shelf — the same cloud treatment, planted low
    ------------------------------------------------------------------
    staghorn heads with lit tips, a ridged boulder coral, a sea fan set
    edge-on to the light, and blades of grass.  it renders into the same
    density buffer as the fish, so the ramp, the dot screen and the
    bloom all apply without a second post pass.
   ================================================================== */
function buildReef(){
  var P = [], INT = [], SIZ = [], RND = [], SWAY = [];
  function push(x, y, z, inten, size, sway, phase){
    P.push(x, y, z); INT.push(inten); SIZ.push(size);
    RND.push(rnd(), rnd(), rnd()); SWAY.push(sway, phase);
  }

  /* ---- staghorn: a rod that forks upward, brightest at the tips ---- */
  function stag(ax, ay, az, dx, dy, dz, len, rad, depth, phase, sway){
    var n = Math.max(900, Math.round(len * rad * 40000));
    var ux = dx, uy = dy, uz = dz;
    var ul = Math.hypot(ux, uy, uz) || 1; ux /= ul; uy /= ul; uz /= ul;
    var px = -uy, py = ux, pz = 0.0;
    var pl = Math.hypot(px, py, pz) || 1; px /= pl; py /= pl; pz /= pl;
    var qx = uy * pz - uz * py, qy = uz * px - ux * pz, qz = ux * py - uy * px;
    for (var i = 0; i < n; i++){
      var u = rnd();
      var r = rad * (1 - 0.48 * u) * Math.sqrt(rnd());
      var a = rnd() * Math.PI * 2;
      var cx = ax + ux * len * u, cy = ay + uy * len * u, cz = az + uz * len * u;
      var x = cx + (px * Math.cos(a) + qx * Math.sin(a)) * r;
      var y = cy + (py * Math.cos(a) + qy * Math.sin(a)) * r;
      var z = cz + (pz * Math.cos(a) + qz * Math.sin(a)) * r;
      /* the polyps stipple the rod, and the growing tip is the brightest
         thing on the head                                              */
      var pol = 0.34 + 0.86 * Math.pow(mottle(x * 9.0, y * 9.0, z * 9.0, 8.0, 0.72), 2.4);
      var tip = 1.0 + 1.55 * Math.pow(u, 8.0);
      push(x, y, z, pol * tip * 0.62, 0.74 + rnd() * 0.28, sway * (0.25 + 0.75 * u), phase);
    }
    if (depth <= 0 || rad < 0.011) return;
    var ex = ax + ux * len, ey = ay + uy * len, ez = az + uz * len;
    for (var k = 0; k < 3; k++){
      var sp = phase * 2.3 + k * 2.094 + depth;
      stag(ex, ey, ez,
           ux + 0.62 * Math.cos(sp), uy + 0.46, uz + 0.62 * Math.sin(sp),
           len * 0.70, rad * 0.66, depth - 1, phase + 1.3 + k, sway);
    }
  }
  stag(-2.05, -0.44, -0.22, 0.16, 1.00, 0.08, 0.40, 0.044, 3, 5.2, 0.06);
  stag(-1.30, -0.30, -0.18, 0.10, 1.00, 0.06, 0.46, 0.050, 3, 0.0, 0.06);
  stag(-0.62, -0.46,  0.28, -0.16, 1.00, -0.10, 0.38, 0.042, 3, 2.4, 0.06);
  stag( 0.62, -0.40,  0.10, 0.06, 1.00, -0.16, 0.44, 0.048, 3, 1.3, 0.06);
  stag( 1.48, -0.52, -0.30, 0.22, 1.00, 0.14, 0.36, 0.040, 3, 4.1, 0.06);
  stag( 2.20, -0.36,  0.34, -0.10, 1.00, 0.10, 0.42, 0.046, 3, 2.9, 0.06);

  /* ---- boulder coral: a dome carved by meandering ridges ---- */
  function boulder(cx, cy, cz, R, phase){
    var N = 42000;
    for (var i = 0; i < N; i++){
      var th = rnd() * Math.PI * 2, ph2 = Math.acos(rnd());   /* upper half */
      var rr = 1.0 - 0.16 * Math.pow(rnd(), 2.0);
      var sx = Math.sin(ph2) * Math.cos(th), sy = Math.cos(ph2), sz = Math.sin(ph2) * Math.sin(th);
      var x = cx + sx * R * rr, y = cy + sy * R * rr * 0.78, z = cz + sz * R * rr;
      /* the brain-coral valleys: a noise field pushed through a fold */
      var m = fbm(x * 7.0 + phase, y * 7.0, z * 7.0);
      var ridge = 1.0 - Math.abs(m * 2.0 - 1.0);
      push(x, y, z, 0.13 + 0.78 * Math.pow(ridge, 3.2), 0.76 + rnd() * 0.26, 0.02, phase);
    }
  }
  boulder(0.18, -0.26, 0.05, 0.30, 0.0);
  boulder(-1.66, -0.30, 0.30, 0.22, 3.7);
  boulder(1.86, -0.24, -0.18, 0.20, 1.9);

  /* ---- sea fan: a flat, finely branched net standing across the light -- */
  function fan(cx, cy, cz, scale, tilt, phase){
    var ca = Math.cos(tilt), sa = Math.sin(tilt);
    function rib(x0, y0, dx, dy, l, w, depth){
      var n = Math.max(420, Math.round(l * w * 26000));
      for (var i = 0; i < n; i++){
        var u = rnd();
        var lx = x0 + dx * l * u, ly = y0 + dy * l * u;
        var jr = w * (1 - 0.5 * u) * (rnd() * 2 - 1);
        lx += -dy * jr; ly += dx * jr;
        var z0 = (rnd() * 2 - 1) * 0.012;
        var x = cx + (lx * ca - z0 * sa) * scale;
        var y = cy + ly * scale;
        var z = cz + (lx * sa + z0 * ca) * scale;
        push(x, y, z, 0.30 + 0.95 * Math.pow(u, 1.6), 0.72 + rnd() * 0.24,
             0.05 + ly * 0.20, phase);
      }
      if (depth <= 0) return;
      var ex = x0 + dx * l, ey = y0 + dy * l;
      for (var k = 0; k < 2; k++){
        var ang = Math.atan2(dy, dx) + (k === 0 ? 0.42 : -0.40) + 0.10 * Math.sin(phase + depth);
        rib(ex, ey, Math.cos(ang), Math.sin(ang), l * 0.74, w * 0.68, depth - 1);
      }
    }
    rib(0, 0, 0.06, 1.0, 0.34, 0.018, 4);
  }
  fan(-0.98, -0.42, -0.42, 1.35, 0.55, 1.1);
  fan(1.10, -0.46, 0.18, 1.05, -0.75, 4.3);
  fan(-2.35, -0.44, 0.24, 0.86, 0.30, 2.7);

  /* ---- blades: the grass the whole shelf sits in ---- */
  for (var b = 0; b < 74; b++){
    var bx = -3.00 + rnd() * 6.00, bz = -0.90 + rnd() * 1.60;
    var bh = 0.34 + rnd() * 0.52, lean = (rnd() * 2 - 1) * 0.26;
    var ph3 = rnd() * 6.28;
    for (var i6 = 0; i6 < 1500; i6++){
      var u6 = Math.pow(rnd(), 0.72);
      var hw2 = 0.026 * Math.sin(Math.PI * Math.min(1, 0.10 + u6 * 0.86));
      var lat2 = (rnd() * 2 - 1) * hw2;
      push(bx + lean * u6 * u6 + lat2, -0.58 + bh * u6, bz + lat2 * 0.4,
           (0.22 + 0.70 * u6) * (1.0 - 0.40 * Math.abs(lat2 / (hw2 + 1e-5))),
           0.72 + rnd() * 0.24, 0.10 + u6 * 0.72, ph3);
    }
  }

  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aInt',  new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize', new THREE.Float32BufferAttribute(SIZ, 1));
  g.setAttribute('aRnd',  new THREE.Float32BufferAttribute(RND, 3));
  g.setAttribute('aSway', new THREE.Float32BufferAttribute(SWAY, 2));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.4, 0), 6.0);
  return g;
}

var reefMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0 },
    uSize:   { value: 4.0 },
    uBright: { value: 1.0 },
    uFade:   { value: 0.0 },
    uSway:   { value: 0.085 }
  },
  vertexShader: [
    'attribute float aInt; attribute float aSize; attribute vec3 aRnd; attribute vec2 aSway;',
    'uniform float uTime, uSize, uBright, uFade, uSway;',
    'varying float vInt;',
    'void main(){',
    '  vec3 p = position;',
    /* surge: the whole shelf leans with the swell, the soft tips most */
    '  float k = aSway.x * aSway.x;',
    '  float w = sin(uTime * 0.62 + aSway.y) * 0.60 + sin(uTime * 0.27 + aSway.y * 1.7) * 0.40;',
    '  p.x += w * uSway * k;',
    '  p.z += cos(uTime * 0.48 + aSway.y * 0.8) * uSway * 0.60 * k;',
    '  p.y -= abs(w) * uSway * 0.14 * k;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float tw = 0.84 + 0.16 * sin(uTime * (1.6 + aRnd.y * 5.0) + aRnd.z * 43.0);',
    '  vInt = aInt * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: pointsMat.fragmentShader,
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var bed = new THREE.Object3D();
scene.add(bed);
var reef = new THREE.Points(buildReef(), reefMat);
reef.frustumCulled = false;
bed.add(reef);

/* ==================================================================
    Plankton — the suspended matter that makes water read as water
   ================================================================== */
function buildMotes(){
  var P = [], SEED = [], INT = [], SIZ = [];
  var N = 2600;
  for (var i = 0; i < N; i++){
    P.push(-3.0 + rnd() * 6.0, 0, -1.8 + rnd() * 3.2);
    SEED.push(rnd(), 0.4 + rnd() * 1.2, rnd() * 6.28, 0.5 + rnd());
    INT.push(0.35 + rnd() * 0.95);
    SIZ.push(0.60 + rnd() * 0.75);
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aSeed',    new THREE.Float32BufferAttribute(SEED, 4));
  g.setAttribute('aInt',     new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize',    new THREE.Float32BufferAttribute(SIZ, 1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 9.0);
  return g;
}

var moteMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0 },
    uSize:   { value: 4.0 },
    uBright: { value: 1.0 },
    uFade:   { value: 0.0 },
    uSpan:   { value: 4.6 }
  },
  vertexShader: [
    'attribute vec4 aSeed; attribute float aInt; attribute float aSize;',
    'uniform float uTime, uSize, uBright, uFade, uSpan;',
    'varying float vInt;',
    'void main(){',
    /* plankton sinks slowly and is pushed about by the same surge */
    '  float fall = fract(aSeed.x + uTime * 0.019 * aSeed.y);',
    '  vec3 p = position;',
    '  p.y = 2.2 - fall * uSpan;',
    '  p.x += sin(uTime * 0.31 * aSeed.w + aSeed.z) * 0.22;',
    '  p.z += cos(uTime * 0.24 * aSeed.w + aSeed.z * 1.7) * 0.16;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float life = smoothstep(0.0, 0.08, fall) * (1.0 - smoothstep(0.90, 1.0, fall));',
    '  float tw = 0.55 + 0.45 * sin(uTime * (1.1 + aSeed.w * 3.0) + aSeed.z * 11.0);',
    '  vInt = aInt * life * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: pointsMat.fragmentShader,
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var drift = new THREE.Object3D();
scene.add(drift);
var motes = new THREE.Points(buildMotes(), moteMat);
motes.frustumCulled = false;
drift.add(motes);

/* ================================================================== */
/*  Post chain                                                        */
/* ================================================================== */
function makeRT(w, h){
  return new THREE.WebGLRenderTarget(Math.max(2, w | 0), Math.max(2, h | 0), {
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat, type: THREE.HalfFloatType,
    depthBuffer: false, stencilBuffer: false
  });
}
var rtScene = makeRT(2, 2), rtA = makeRT(2, 2), rtB = makeRT(2, 2),
    rtC = makeRT(2, 2), rtD = makeRT(2, 2);

var quadScene = new THREE.Scene();
var quadCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
var quadGeo   = new THREE.PlaneGeometry(2, 2);
var quadMesh  = new THREE.Mesh(quadGeo, null);
quadScene.add(quadMesh);
function blit(mat, target){
  quadMesh.material = mat;
  renderer.setRenderTarget(target || null);
  renderer.render(quadScene, quadCam);
}

var VERT_QUAD = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

var copyMat = new THREE.ShaderMaterial({
  uniforms: { tSrc: { value: null } },
  vertexShader: VERT_QUAD,
  fragmentShader: 'uniform sampler2D tSrc; varying vec2 vUv;' +
                  'void main(){ gl_FragColor = texture2D(tSrc, vUv); }',
  depthTest: false, depthWrite: false
});

var blurMat = new THREE.ShaderMaterial({
  uniforms: { tSrc: { value: null }, uStep: { value: new THREE.Vector2() } },
  vertexShader: VERT_QUAD,
  fragmentShader: [
    'uniform sampler2D tSrc; uniform vec2 uStep; varying vec2 vUv;',
    'void main(){',
    '  vec4 s = texture2D(tSrc, vUv) * 0.2270270270;',
    '  s += (texture2D(tSrc, vUv + uStep * 1.3846153846) + texture2D(tSrc, vUv - uStep * 1.3846153846)) * 0.3162162162;',
    '  s += (texture2D(tSrc, vUv + uStep * 3.2307692308) + texture2D(tSrc, vUv - uStep * 3.2307692308)) * 0.0702702703;',
    '  gl_FragColor = s;',
    '}'
  ].join('\\n'),
  depthTest: false, depthWrite: false
});

var compMat = new THREE.ShaderMaterial({
  uniforms: {
    tScene: { value: null }, tGlow: { value: null }, tGlow2: { value: null },
    uRes:   { value: new THREE.Vector2(2, 2) },
    uCell:  { value: 8.5 },
    uGain:  { value: CFG.gain },
    uCurve: { value: CFG.curve },
    uDot:   { value: new THREE.Vector2(CFG.dotMax, CFG.dotGamma) },
    uGlow:  { value: CFG.glow },
    uGlowGain: { value: CFG.glowGain },
    uExposure: { value: CFG.exposure },
    uTime:  { value: 0 },
    uRay:   { value: CFG.ray },
    uSurface: { value: CFG.surface }
  },
  vertexShader: VERT_QUAD,
  fragmentShader: [
    'precision highp float;',
    'uniform sampler2D tScene, tGlow, tGlow2;',
    'uniform vec2 uRes, uDot;',
    'uniform float uCell, uGain, uGlow, uGlowGain, uExposure, uCurve, uTime, uRay, uSurface;',
    'varying vec2 vUv;',
    'const float K = 0.70710678;',
    /* deep water -> sunlit shallow: the ember ramp re-sampled for the sea */
    'vec3 ramp(float u){',
    '  u = clamp(u, 0.0, 1.0);',
    '  vec3 c1 = vec3(0.020, 0.088, 0.170);',
    '  vec3 c2 = vec3(0.055, 0.360, 0.500);',
    '  vec3 c3 = vec3(0.330, 0.770, 0.855);',
    '  vec3 c4 = vec3(0.865, 0.982, 0.975);',
    '  vec3 c = c1 * smoothstep(0.0, 0.135, u);',
    '  c = mix(c, c2, smoothstep(0.115, 0.375, u));',
    '  c = mix(c, c3, smoothstep(0.360, 0.625, u));',
    '  c = mix(c, c4, smoothstep(0.615, 1.000, u));',
    '  return c;',
    '}',
    /* sun shafts: bands measured across a slanted axis, fading with depth
       and breathing on the swell.  they are added into the density the
       screen reads, not painted over it, so the light through the water
       carries the same dot lattice as the reef itself.                */
    'float shafts(vec2 uv){',
    '  float aspect = uRes.x / max(uRes.y, 1.0);',
    '  float s = (uv.x - 0.5) * aspect * 0.86 + (1.0 - uv.y) * 0.60;',
    '  float r = pow(max(0.0, sin(s * 5.30 + uTime * 0.047)), 7.0) * 0.62;',
    '  r += pow(max(0.0, sin(s * 9.70 - uTime * 0.033 + 1.7)), 11.0) * 0.44;',
    '  r += pow(max(0.0, sin(s * 2.90 + uTime * 0.021 + 4.1)), 5.0)  * 0.52;',
    '  r *= 0.72 + 0.28 * sin(uTime * 0.19 + s * 1.3);',
    '  return r * smoothstep(-0.05, 0.72, uv.y);',
    '}',
    'void main(){',
    '  vec2 pix = vUv * uRes;',
    /* 45 degree halftone lattice: sample the source at the dot centre */
    '  mat2 R  = mat2(K, -K, K, K);',
    '  mat2 Ri = mat2(K,  K, -K, K);',
    '  vec2 lp = (R * pix) / uCell;',
    '  vec2 id = floor(lp) + 0.5;',
    '  vec2 cp = Ri * (id * uCell);',
    '  vec2 ex = Ri * vec2(uCell * 0.42, 0.0);',
    '  vec2 ey = Ri * vec2(0.0, uCell * 0.42);',
    '  float d = texture2D(tScene, clamp(cp / uRes, vec2(0.0), vec2(1.0))).r * 0.36;',
    '  d += texture2D(tScene, clamp((cp + ex) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp - ex) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp + ey) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp - ey) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    /* the water itself: shafts at the dot centre, plus a broad glow that
       falls off toward the floor                                       */
    '  vec2 cuv = clamp(cp / uRes, vec2(0.0), vec2(1.0));',
    '  float water = shafts(cuv) * uRay + uSurface * smoothstep(-0.10, 1.0, cuv.y);',
    '  d += water;',
    '  float u = pow(1.0 - exp(-d * uGain), uCurve);',
    '  float rad = uDot.x * pow(u, uDot.y);',
    '  float aa  = 0.85 / uCell;',
    '  float cov = 1.0 - smoothstep(rad - aa, rad + aa, length(lp - id));',
    '  vec3 col = ramp(u) * cov;',
    /* smooth, un-screened bloom underneath, with the shafts folded in so
       they keep a haze around them                                     */
    '  float g = texture2D(tGlow, vUv).r * 0.62 + texture2D(tGlow2, vUv).r * 0.38;',
    '  g += shafts(vUv) * uRay * 0.85;',
    '  col += ramp(pow(1.0 - exp(-g * uGain * uGlowGain), uCurve)) * uGlow;',
    '  gl_FragColor = vec4(col * uExposure, 1.0);',
    '}'
  ].join('\\n'),
  depthTest: false, depthWrite: false
});

/* ================================================================== */
/*  Layout: place the animal by screen anchor                         */
/* ================================================================== */
var VW = 1440, VH = 914;              /* reference design frame */
var view = { w: 1, h: 1, aspect: 1 };

function resize(){
  var w = window.innerWidth, h = window.innerHeight;
  view.w = w; view.h = h; view.aspect = w / h;
  renderer.setSize(w, h, false);
  camera.aspect = view.aspect;
  camera.updateProjectionMatrix();

  var pw = Math.round(w * DPR), ph = Math.round(h * DPR);
  rtScene.setSize(pw, ph);
  rtA.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
  rtB.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
  rtC.setSize(Math.max(2, pw >> 3), Math.max(2, ph >> 3));
  rtD.setSize(Math.max(2, pw >> 3), Math.max(2, ph >> 3));
  compMat.uniforms.uRes.value.set(pw, ph);
  compMat.uniforms.uCell.value = CFG.cellCss * DPR;
}
window.addEventListener('resize', resize);

function anchorToWorld(ax, ay, dist, out){
  var ndcX = (ax / VW) * 2 - 1;
  var ndcY = 1 - (ay / VH) * 2;
  var hHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * dist;
  var wHalf = hHalf * view.aspect;
  var designAspect = VW / VH;
  var sx = view.aspect >= designAspect ? (designAspect / view.aspect) : 1.0;
  out.set(ndcX * wHalf * sx, ndcY * hHalf, -dist);
  return out;
}

/* ================================================================== */
/*  Frame                                                             */
/* ================================================================== */
var fMix = new THREE.Vector3();
var WORLD_UP = new THREE.Vector3(0, 1, 0);
var bF = new THREE.Vector3(), bU = new THREE.Vector3(), bW = new THREE.Vector3();
var basis = new THREE.Matrix4();

function fwdFromAzEl(az, el, out){
  return out.set(Math.cos(el) * Math.cos(az), Math.sin(el), -Math.cos(el) * Math.sin(az));
}

/* Build the pose from an explicit forward/up frame and roll it about its own
   long axis.  Taking the shortest arc from +X instead — which is what the
   hummingbird does, and what this scene used to do — leaves the roll free:
   as the heading swings round behind the animal that free roll runs away on
   its own, and a fish coming about barrel-rolls onto its side. */
function aimFish(f, roll){
  bF.copy(f).normalize();
  bW.crossVectors(bF, WORLD_UP);
  if (bW.lengthSq() < 1e-6) bW.set(0, 0, 1);
  bW.normalize();
  bU.crossVectors(bW, bF).normalize();
  if (roll){
    var c = Math.cos(roll), s = Math.sin(roll);
    var ux = bU.x * c + bW.x * s, uy = bU.y * c + bW.y * s, uz = bU.z * c + bW.z * s;
    var wx = bW.x * c - bU.x * s, wy = bW.y * c - bU.y * s, wz = bW.z * c - bU.z * s;
    bU.set(ux, uy, uz); bW.set(wx, wy, wz);
  }
  basis.makeBasis(bF, bU, bW);
  fish.quaternion.setFromRotationMatrix(basis);
}

/* ---------- pointer chase --------------------------------------------
   the canvas takes no hit test, so the fish's own projected centre is
   compared against the pointer.  engaged it drops back, drives its tail
   harder and turns its nose onto the cursor; left alone it cruises a
   long, slow circuit above the shelf.                                */
var ptr = { x: 0, y: 0, live: false, moved: -99, hot: false };
/* az is the heading in the horizontal plane — 0 noses screen-right, PI
   screen-left; sense is the side it is committed to, and turn is how hard it
   is coming round right now, which drives the bank and the body bend. */
var eng = { w: 0, ax: 0, ay: 0, vx: 0, seeded: false, az: Math.PI - 0.12, sense: -1, turn: 0,
            ndc: new THREE.Vector3() };

function track(e){
  ptr.x = e.clientX; ptr.y = e.clientY;
  ptr.live = true; ptr.moved = performance.now() / 1000;
}
window.addEventListener('pointermove', track, { passive: true });
window.addEventListener('pointerdown', track, { passive: true });
document.addEventListener('pointerleave', function (){ ptr.live = false; ptr.hot = false; });
window.addEventListener('blur', function (){ ptr.live = false; ptr.hot = false; });

var anchorTmp = { x: 0, y: 0 };
function screenToAnchor(px, py, out){
  var designAspect = VW / VH;
  var k = view.aspect >= designAspect ? (designAspect / view.aspect) : 1.0;
  out.x = ((2 * px / view.w - 1) / k + 1) * 0.5 * VW;
  out.y = (py / view.h) * VH;
  return out;
}

var pos  = new THREE.Vector3();
var lastNow = performance.now() / 1000;
var everRendered = false;
/* once a capture harness drives the clock, the live loop stands down so the
   two are not both advancing the same smoothing state */
var headless = false;
var DBG = { on: false };

function render(t, dt){
  everRendered = true;

  /* ---- arrival: out of the blue and onto the station over the reef ---- */
  var f  = ease(THREE.MathUtils.clamp((t - T.flightStart) / (T.flightEnd - T.flightStart), 0, 1));
  var fl = easeIO(THREE.MathUtils.clamp((t - T.flightStart) / (T.flightEnd - T.flightStart), 0, 1));

  var P  = CFG.home;
  var frz = CFG.freeze;

  var narrow = THREE.MathUtils.clamp((1.40 - view.aspect) / 0.55, 0, 1);
  var tight  = THREE.MathUtils.clamp((900 - view.w) / 420, 0, 1);
  var pDist  = P.dist * (1 + 0.22 * narrow) * (1 + 0.55 * tight);
  var pAx    = P.ax   + 40 * narrow + 30 * tight;
  var pAy    = P.ay   - 46 * narrow - 30 * tight;

  var dist  = frz ? pDist : THREE.MathUtils.lerp(9.6, pDist, f);
  var ax    = frz ? pAx   : THREE.MathUtils.lerp(1360, pAx, fl);
  var ay    = frz ? pAy   : THREE.MathUtils.lerp(232, pAy, fl);

  /* idle cruise: a long traverse over the shelf rather than a hover.  the
     sweep is a rounded triangle, not a sine, so the fish holds a steady
     heading across the frame and spends only the turn pointing at nothing */
  var bob = frz ? 0 : Math.sin(t * 0.33 + 1.2) * 0.52 + Math.sin(t * 0.79) * 0.14
                    + Math.sin(t * 1.42 + 2.6) * 0.05;
  var swy = frz ? 0 : tri(t * 0.26 + 0.4) * 1.45 + Math.sin(t * 0.57) * 0.13
                    + Math.sin(t * 1.11 + 2.0) * 0.05;
  /* the traverse has to cover real ground, or the turn at the end of it reads
     as a pivot rather than as the fish coming about                       */
  var idleX = ax + swy * 150, idleY = ay + bob * 56;

  /* ---- engagement ---- */
  var want = (ptr.live && f > 0.45 && (ptr.hot || t + start - ptr.moved < 2.2)) ? 1 : 0;
  eng.w += (want - eng.w) * Math.min(1, dt * (want ? 2.6 : 1.4));
  var chase = frz ? 0 : eng.w;

  screenToAnchor(ptr.x, ptr.y, anchorTmp);
  var hx = idleX - anchorTmp.x, hy = idleY - anchorTmp.y;
  var hl = Math.hypot(hx, hy) || 1;
  var stand = Math.min(hl, 235);
  var tgtX = THREE.MathUtils.lerp(idleX, anchorTmp.x + hx / hl * stand, chase);
  var tgtY = THREE.MathUtils.lerp(idleY, anchorTmp.y + hy / hl * stand, chase);
  if (!eng.seeded){ eng.ax = tgtX; eng.ay = tgtY; eng.seeded = true; }
  var follow = Math.min(1, dt * (2.6 + 6.0 * (1 - chase)));
  var prevX = eng.ax, prevY = eng.ay;
  eng.ax += (tgtX - eng.ax) * follow;
  eng.ay += (tgtY - eng.ay) * follow;
  anchorToWorld(eng.ax, eng.ay, dist, pos);
  fish.position.copy(pos);

  var breathe = frz ? 1 : 1 + 0.030 * Math.sin(t * 0.49 + 0.7);
  var sc = (frz ? P.scale : THREE.MathUtils.lerp(0.52, P.scale, f)) * breathe
         * THREE.MathUtils.lerp(1, 0.80, chase);
  fish.scale.setScalar(sc);

  /* ---- heading -------------------------------------------------------
     A fish does not blend between two directions, it yaws through the arc
     between them, so the heading is carried as an angle and turned at a
     limited rate rather than interpolated as a vector.  The 0.12 offsets
     keep the two cruising headings off exactly 0 and PI, which makes the
     shortest way round unambiguous: every turn takes the animal through its
     far side, showing the viewer its back rather than its face.  What sells
     it is not the yaw but what goes with it — it banks into the turn, curls
     its body into a C, and drives the tail harder to come round.       */
  var vx = (eng.ax - prevX) / Math.max(dt, 1e-4), vy = (eng.ay - prevY) / Math.max(dt, 1e-4);
  var vl = Math.hypot(vx, vy);
  /* the sense comes off a low-passed velocity with a dead band, so the small
     wobble riding on the traverse can never start a turn, and the dead
     moment at the end of a leg cannot either                              */
  eng.vx += (vx - eng.vx) * Math.min(1, dt * 3.2);
  if (eng.vx > 6) eng.sense = 1; else if (eng.vx < -6) eng.sense = -1;
  var wantAz = eng.sense > 0 ? 0.12 : Math.PI - 0.12;
  /* the yaw is not taken at a constant rate: it leaves the old heading
     slowly, whips through square-on — where a fish this flat is only a
     sliver, and where a real one is quickest — and settles gently onto the
     new one                                                              */
  var perp = Math.sin(eng.az), perpSq = perp * perp;
  var rate = 3.4 * (0.42 + 1.55 * perpSq);
  var step = THREE.MathUtils.clamp(wantAz - eng.az, -rate * dt, rate * dt);
  eng.az += step;
  /* 0 while cruising, 1 at full rate, signed by which way it is coming round */
  var swing = step / Math.max(dt, 1e-4) / rate;
  eng.turn += (swing - eng.turn) * Math.min(1, dt * 7.0);
  var hard = Math.abs(eng.turn);

  eng.ndc.copy(pos).project(camera);
  var bx = (eng.ndc.x * 0.5 + 0.5) * view.w;
  var by = (-eng.ndc.y * 0.5 + 0.5) * view.h;
  var dx = ptr.x - bx, dy = ptr.y - by;

  /* the climb levels off through a turn: a fish comes round flat, then picks
     the new depth up again on the way out                                  */
  var pitch = THREE.MathUtils.clamp(-vy / 260, -0.42, 0.42) * (1 - 0.62 * hard)
            + (frz ? 0 : Math.sin(t * 0.44 + 2.0) * 0.05);
  /* the bank: rolled into the turn, plus the slow list of an idling fish */
  var spin = (frz ? 0 : -eng.turn * 0.52) + (frz ? 0 : Math.sin(t * 0.37 + 0.9) * 0.07);
  var heading = frz ? (Math.PI - 0.12) : eng.az;
  fwdFromAzEl(heading, pitch, fMix);
  if (DBG.on){
    spin = DBG.spin;
    anchorToWorld(DBG.ax, DBG.ay, DBG.dist, pos);
    fish.position.copy(pos);
    fish.scale.setScalar(DBG.scale);
    sc = DBG.scale;
    fwdFromAzEl(DBG.az, DBG.el, fMix);
  }
  aimFish(fMix, spin);

  /* ---- the shelf: planted, surging, never chasing anything ---- */
  screenToAnchor(view.w * (CFG.reefPose.ax / VW), view.h * (CFG.reefPose.ay / VH), anchorTmp);
  anchorToWorld(anchorTmp.x, anchorTmp.y, CFG.reefPose.dist, pos);
  bed.position.copy(pos);
  bed.scale.setScalar(CFG.reefPose.scale);
  reefMat.uniforms.uTime.value   = t;
  reefMat.uniforms.uFade.value   = THREE.MathUtils.smoothstep(t, T.flightStart, T.flightStart + 2.1);
  reefMat.uniforms.uBright.value = CFG.bright * CFG.reef;
  reefMat.uniforms.uSize.value   = CFG.pointSize * CFG.reefSize * DPR * (view.h / VH);

  /* ---- the plankton hangs in the whole column, not over the shelf ---- */
  anchorToWorld(VW * 0.5, VH * 0.5, 6.0, pos);
  drift.position.copy(pos);
  moteMat.uniforms.uTime.value   = t;
  moteMat.uniforms.uFade.value   = THREE.MathUtils.smoothstep(t, T.flightStart + 0.3, T.flightStart + 3.0);
  moteMat.uniforms.uBright.value = CFG.bright * CFG.motes;
  moteMat.uniforms.uSize.value   = CFG.pointSize * 1.35 * DPR * (view.h / VH);

  /* ---- tailbeat: harder while chasing, idling on the cruise ---- */
  var drive = THREE.MathUtils.clamp(0.34 + chase * 0.66 + Math.min(0.35, vl / 700) + hard * 0.55, 0, 1.4);
  var omega = 2 * Math.PI * CFG.beat * (0.72 + 0.62 * drive);
  pointsMat.uniforms.uOmega.value    = omega;
  pointsMat.uniforms.uBlurSpan.value = (2 * Math.PI / omega) * CFG.blurSpan;
  pointsMat.uniforms.uAmp.value      = DBG.on ? DBG.amp : (0.62 + 0.70 * drive);
  pointsMat.uniforms.uFlap.value.z   = CFG.finBeat;
  pointsMat.uniforms.uBend.value     = DBG.on ? 0 : eng.turn * 0.38 * (1 - 0.94 * perpSq);
  /* and the tail stops wagging across its own silhouette while square-on */
  pointsMat.uniforms.uSwim.value.z   = 0.30 * (1 - 0.58 * perpSq);
  pointsMat.uniforms.uTime.value     = t;
  pointsMat.uniforms.uSize.value     = CFG.pointSize * DPR * (view.h / VH) * Math.pow(sc, 0.9);
  pointsMat.uniforms.uBright.value   = CFG.bright;
  pointsMat.uniforms.uWing.value     = CFG.fin;
  pointsMat.uniforms.uFade.value     = THREE.MathUtils.smoothstep(t, T.flightStart, T.flightStart + 1.1);

  /* ---- render ---- */
  renderer.setRenderTarget(rtScene);
  renderer.clear(true, true, true);
  renderer.render(scene, camera);

  copyMat.uniforms.tSrc.value = rtScene.texture;                     blit(copyMat, rtA);
  blurMat.uniforms.tSrc.value = rtA.texture;
  blurMat.uniforms.uStep.value.set(1 / rtA.width, 0);                blit(blurMat, rtB);
  blurMat.uniforms.tSrc.value = rtB.texture;
  blurMat.uniforms.uStep.value.set(0, 1 / rtA.height);               blit(blurMat, rtA);

  copyMat.uniforms.tSrc.value = rtA.texture;                         blit(copyMat, rtC);
  blurMat.uniforms.tSrc.value = rtC.texture;
  blurMat.uniforms.uStep.value.set(1 / rtC.width, 0);                blit(blurMat, rtD);
  blurMat.uniforms.tSrc.value = rtD.texture;
  blurMat.uniforms.uStep.value.set(0, 1 / rtC.height);               blit(blurMat, rtC);

  compMat.uniforms.tScene.value = rtScene.texture;
  compMat.uniforms.tGlow.value  = rtA.texture;
  compMat.uniforms.tGlow2.value = rtC.texture;
  compMat.uniforms.uGain.value  = CFG.gain;
  compMat.uniforms.uCurve.value = CFG.curve;
  compMat.uniforms.uDot.value.set(CFG.dotMax, CFG.dotGamma);
  compMat.uniforms.uGlow.value  = CFG.glow;
  compMat.uniforms.uGlowGain.value = CFG.glowGain;
  compMat.uniforms.uExposure.value = CFG.exposure;
  compMat.uniforms.uCell.value  = CFG.cellCss * DPR;
  compMat.uniforms.uTime.value  = t;
  compMat.uniforms.uRay.value   = CFG.ray;
  compMat.uniforms.uSurface.value = CFG.surface;
  blit(compMat, null);
}

function frame(now){
  requestAnimationFrame(frame);
  if (headless) return;
  /* note: no document.hidden guard — some embedded webviews report the
     document as permanently hidden while still driving rAF            */
  var t = reduced ? (T.flightEnd + 3.0) : (now / 1000 - start);
  var dt = Math.min(0.05, Math.max(0.001, now / 1000 - lastNow));
  lastNow = now / 1000;
  render(t, dt);
}

document.addEventListener('visibilitychange', function(){
  if (document.hidden || everRendered) return;
  start = performance.now() / 1000;
});

resize();
requestAnimationFrame(frame);

/* headless capture: render exactly one frame at an absolute time */
window.__seek = function(t){ headless = true; render(t, 1 / 30); };
window.__pose = function(o){ DBG.on = true; for (var k in o) DBG[k] = o[k]; };
window.__ptr  = function(x, y, live){ ptr.x = x; ptr.y = y;
  ptr.live = live !== false; ptr.moved = start + 1e9; };
window.__dbg  = { fish: fish, cloud: cloud, mat: pointsMat, cam: camera, THREE: THREE,
                  ptr: ptr, eng: eng, view: view, cfg: CFG };
})();
<\/script>
</body>
</html>
`,X=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Trochil Abyss — a halftone bloom of jellyfish</title>
<meta name="description" content="A procedural halftone bloom of jellyfish pulsing up through deep water, the nearest one answering the cursor, rendered as one additive point cloud through a 45 degree dot screen.">
<meta name="theme-color" content="#01030a">
<style>
  html, body { margin:0; width:100%; height:100%; background:#01030a; overflow:hidden; }
  #gl { position:fixed; inset:0; display:block; width:100%; height:100%; }
</style>
</head>
<body>
<canvas id="gl"></canvas>
<!--
  Trochil Abyss — the authored halftone drawing system taken down deep.

  Everything below the "Post chain" heading is the system lifted out of the
  authored Trochil page (public/landing-pages/trochil-hero.html,
  SHA-256 db9447887bd9...): the additive point material, the density buffer,
  the two-level blur, the 45 degree halftone composite, the design-frame
  anchoring and the frame loop. Four regions are this scene's own — the CFG
  block, the jellyfish cloud (one bell built once and instanced through a
  per-vertex seed, so seven of them pulse, trail and rise on the gpu from a
  single buffer), the marine snow, and an indigo ramp with a slow shaft of
  surface light reaching down into the density buffer.
-->
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
(function () {
'use strict';

var T = { flightStart: 0.10, flightEnd: 5.20 };
function ease(t){ return t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3); }
function easeIO(t){ return t <= 0 ? 0 : t >= 1 ? 1 : (t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2); }

var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var start = performance.now() / 1000;

/* ================================================================== */
/*  Tunables                                                          */
/* ================================================================== */
var CFG = window.__cfg = {
  gain:      1.00,
  curve:     0.52,
  dotMax:    0.735,
  dotGamma:  0.56,
  cellCss:   4.20,
  glow:      0.17,
  glowGain:  2.35,
  pointSize: 6.50,
  bright:    0.360,
  bloomInt:  0.62,   /* the drifting jellyfish, relative to the lead one  */
  bloomSize: 1.85,
  snow:      0.46,   /* marine snow intensity                            */
  shaft:     0.055,  /* the one shaft of surface light, into the halftone */
  deep:      0.020,  /* the water itself, brightest near the surface      */
  pulse:     0.62,   /* bell contractions per second                      */
  bloomPose: { ax: 720, ay: 470, dist: 8.60, scale: 1.0 },
  freeze:    false,
  exposure:  1.00,
  /* the lead animal: nearest to the glass, and the one that answers */
  home:      { ax: 1010, ay: 356, dist: 4.60, scale: 0.78,
               az: 0.10, el: 1.515, spin: 0.00, flap: 1.0 }
};

/* ================================================================== */
/*  Shared cloud helpers                                              */
/* ================================================================== */
function rnd(){ return Math.random(); }
function rndn(){ /* ~gaussian */ return (rnd()+rnd()+rnd()+rnd()-2) * 0.7071; }

/* --- tiny 3d value-noise fbm: gives the cloud its organic mottling --- */
function h3(i, j, k){
  var n = (i * 374761393 + j * 668265263 + k * 1274126177) | 0;
  n = (n ^ (n >>> 13)) | 0;
  n = Math.imul(n, 1274126177) | 0;
  return (((n ^ (n >>> 16)) >>> 0) / 4294967295);
}
function vnoise(x, y, z){
  var i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  var fx = x - i, fy = y - j, fz = z - k;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  function L(a, b, t){ return a + (b - a) * t; }
  return L(L(L(h3(i,j,k),   h3(i+1,j,k),   fx), L(h3(i,j+1,k),   h3(i+1,j+1,k),   fx), fy),
           L(L(h3(i,j,k+1), h3(i+1,j,k+1), fx), L(h3(i,j+1,k+1), h3(i+1,j+1,k+1), fx), fy), fz);
}
function fbm(x, y, z){
  return 0.54 * vnoise(x, y, z)
       + 0.29 * vnoise(x * 2.13 + 11.3, y * 2.13 + 7.1, z * 2.13 + 3.7)
       + 0.17 * vnoise(x * 4.37 + 31.7, y * 4.37 + 17.9, z * 4.37 + 23.1);
}
function mottle(x, y, z, freq, amt){
  return 1.0 - amt + amt * 2.0 * fbm(x * freq + 5.0, y * freq + 9.0, z * freq + 2.0);
}
function sst(x, e0, e1){
  var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/* ==================================================================
    Jellyfish point cloud
    ------------------------------------------------------------------
    the animal is built once, in its own frame, with +Y up through the
    apex of the bell.  every point carries aRole (0 bell, 1 oral arm,
    2 tentacle) and aU, the distance down the animal — the vertex
    shader squeezes the bell on aU, and delays the arms and the
    tentacles behind it so the whole body follows one contraction
    rather than moving as a rigid object.
   ================================================================== */
var ROLE_BELL = 0.0, ROLE_ARM = 1.0, ROLE_TENT = 2.0;

/* the bell profile: apex at u = 0, rim at u = 1 */
function bellR(u){ return 0.60 * Math.pow(Math.sin(Math.PI * 0.5 * Math.min(1, u * 1.02)), 0.80); }
function bellY(u){ return -0.66 * Math.pow(u, 1.55); }

function buildJelly(){
  var P = [], ROLE = [], U = [], INT = [], SIZ = [], RND = [];
  function push(x, y, z, role, u, inten, size){
    P.push(x, y, z); ROLE.push(role); U.push(u); INT.push(inten); SIZ.push(size);
    RND.push(rnd(), rnd(), rnd());
  }

  /* ---- bell: a surface of revolution with a scalloped rim, radial ribs
          and the four horseshoes of gonad showing through it ---- */
  var NB = 78000;
  for (var i = 0; i < NB; i++){
    var u = Math.pow(rnd(), 0.62);
    var th = rnd() * Math.PI * 2;
    /* eight shallow lobes around the margin */
    var lobe = 1.0 + 0.055 * Math.cos(th * 8.0) * u;
    var R = bellR(u) * lobe;
    /* the bell is a shell, not a solid: points sit near the surface */
    var shell = 1.0 - Math.pow(rnd(), 2.4) * 0.16;
    var x = Math.cos(th) * R * shell, z = Math.sin(th) * R * shell;
    var y = bellY(u) + (1 - shell) * 0.28;
    /* radial ribs, a lit margin, and the gonads at a quarter turn each */
    var rib  = 1.0 + 1.45 * Math.pow(Math.max(0, Math.cos(th * 16.0)), 7.0) * sst(u, 0.08, 0.95);
    var marg = 1.0 + 1.45 * sst(u, 0.78, 0.99);
    var gon  = 1.0 + 1.70 * Math.pow(Math.max(0, Math.cos(th * 4.0)), 16.0)
                   * Math.exp(-Math.pow((u - 0.46) / 0.16, 2));
    /* the crown is glassy: almost nothing there but a hint of curve */
    var wash = 0.30 + 0.62 * Math.pow(u, 1.10);
    push(x, y, z, ROLE_BELL, u,
         0.90 * wash * rib * marg * gon * mottle(x * 2.4, y * 2.4, z * 2.4, 3.6, 0.30),
         0.80 + rnd() * 0.30);
  }

  /* ---- oral arms: four ruffled ribbons out of the middle.  the width is
          taken across the angle rather than along the radius, so an arm
          reads as a sheet from the side instead of a stick ---- */
  var NA = 62000;
  for (var i2 = 0; i2 < NA; i2++){
    var k = Math.floor(rnd() * 4);
    var base = k * Math.PI * 0.5 + 0.35;
    var v = Math.pow(rnd(), 0.68);                       /* down the arm */
    var lat = rnd() * 2 - 1;                             /* across it    */
    var wprof = Math.sin(Math.PI * Math.min(1, 0.10 + v * 0.94));
    var spread = 0.92 * wprof * (1 - 0.22 * v);          /* radians wide */
    /* the ruffle is what makes an oral arm an oral arm: the sheet folds
       both in and out of the radius and up and down the length         */
    var ruffle = Math.sin(v * 12.0 + k * 2.1 + lat * 4.6) * 0.070 * wprof;
    var ang = base + lat * spread + Math.sin(v * 3.1 + k) * 0.22;
    var rr = 0.10 + v * 0.44 + ruffle + Math.abs(lat) * 0.045;
    var x2 = Math.cos(ang) * rr;
    var z2 = Math.sin(ang) * rr;
    var y2 = -0.52 - v * 1.42 + Math.sin(lat * 3.2 + v * 8.0) * 0.055 * wprof;
    /* the frilled edge is where the light collects */
    var frill = 0.30 + 1.35 * Math.pow(Math.abs(lat), 2.2)
              + 0.75 * Math.pow(Math.max(0, Math.cos(v * 24.0 + lat * 3.0)), 5.0);
    push(x2, y2, z2, ROLE_ARM, 0.20 + v * 0.80,
         0.46 * frill * (1.0 - 0.34 * v), 0.78 + rnd() * 0.28);
  }

  /* ---- tentacles: fine threads off the margin, brightest at the root -- */
  var NT = 44, NPT = 1250;
  for (var s = 0; s < NT; s++){
    var ta = (s / NT) * Math.PI * 2 + 0.11;
    var tw = 0.9 + rnd() * 0.5;                          /* wave scale     */
    var tl = 1.55 + rnd() * 1.55;                        /* length         */
    for (var j = 0; j < NPT; j++){
      var v2 = Math.pow(rnd(), 0.82);
      var r2 = bellR(1.0) * (1.0 + v2 * 0.10);
      /* the thread wanders as it falls, so no two hang the same */
      var wob = (Math.sin(v2 * 7.0 * tw + s * 2.1) * 0.13 + Math.sin(v2 * 17.0 * tw + s) * 0.05) * v2;
      var x3 = Math.cos(ta) * r2 + Math.cos(ta + 1.57) * wob;
      var z3 = Math.sin(ta) * r2 + Math.sin(ta + 1.57) * wob;
      var y3 = bellY(1.0) - v2 * tl;
      var jr = 0.010 * (1 - 0.5 * v2);
      var ja = rnd() * Math.PI * 2, jd = Math.sqrt(rnd()) * jr;
      push(x3 + Math.cos(ja) * jd, y3 + rndn() * 0.004, z3 + Math.sin(ja) * jd,
           ROLE_TENT, 0.30 + v2 * 0.70,
           (1.05 - 0.62 * v2) * (0.60 + 0.85 * Math.pow(Math.max(0, Math.cos(v2 * 21.0 + s)), 5.0)),
           0.70 + rnd() * 0.24);
    }
  }

  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aRole', new THREE.Float32BufferAttribute(ROLE, 1));
  g.setAttribute('aU',    new THREE.Float32BufferAttribute(U, 1));
  g.setAttribute('aInt',  new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize', new THREE.Float32BufferAttribute(SIZ, 1));
  g.setAttribute('aRnd',  new THREE.Float32BufferAttribute(RND, 3));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -1.0, 0), 4.0);
  return g;
}

/* the same geometry, thinned and stamped out six more times with a seed
   per copy: the drift, the rise, the pulse phase and the scale all come
   off that seed in the vertex shader, so the whole bloom is one draw   */
function buildBloom(sourceGeometry, copies){
  var src = sourceGeometry.getAttribute('position').array;
  var role = sourceGeometry.getAttribute('aRole').array;
  var uu   = sourceGeometry.getAttribute('aU').array;
  var ii   = sourceGeometry.getAttribute('aInt').array;
  var ss   = sourceGeometry.getAttribute('aSize').array;
  var n = role.length;
  var keep = 0.40;                                   /* the crowd is thinner */
  var P = [], ROLE = [], U = [], INT = [], SIZ = [], RND = [], SEED = [];
  for (var c = 0; c < copies.length; c++){
    var C = copies[c];
    for (var i = 0; i < n; i++){
      if (rnd() > keep) continue;
      P.push(src[i * 3], src[i * 3 + 1], src[i * 3 + 2]);
      ROLE.push(role[i]); U.push(uu[i]);
      INT.push(ii[i] * C[4]); SIZ.push(ss[i]);
      RND.push(rnd(), rnd(), rnd());
      /* x, z, phase, scale */
      SEED.push(C[0], C[1], C[2], C[3]);
    }
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aRole', new THREE.Float32BufferAttribute(ROLE, 1));
  g.setAttribute('aU',    new THREE.Float32BufferAttribute(U, 1));
  g.setAttribute('aInt',  new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize', new THREE.Float32BufferAttribute(SIZ, 1));
  g.setAttribute('aRnd',  new THREE.Float32BufferAttribute(RND, 3));
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(SEED, 4));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 14.0);
  return g;
}

/* ================================================================== */
/*  Renderer / scene                                                  */
/* ================================================================== */
var canvas   = document.getElementById('gl');
var renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false,
                                       preserveDrawingBuffer: true,
                                       powerPreference: 'high-performance' });
} catch (e) { /* no webgl: the page stays dark rather than throwing */ }
if (!renderer){ canvas.style.display = 'none'; return; }
renderer.setClearColor(0x000000, 1);
var DPR = Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(DPR);

var scene  = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0, 0);

var lead = new THREE.Object3D();
scene.add(lead);

/* the contraction, shared by the lead animal and the bloom behind it:
   the bell squeezes in and stretches down, the arms and the threads
   follow a stroke late, and the whole animal jets forward on the
   recovery rather than on the squeeze                                */
var PULSE_GLSL = [
  'vec3 pulse(vec3 p, float role, float u, float ph, float amp){',
  '  float sq = sin(ph);',
  '  float bell = amp * sq;',
  /* the rim closes hardest, the crown barely moves */
  '  if (role < 0.5){',
  '    float k = smoothstep(0.10, 1.0, u);',
  '    p.xz *= 1.0 - 0.30 * bell * k;',
  '    p.y  -= 0.26 * bell * k * k;',
  '  } else {',
  /* the arms and threads inherit the squeeze a stroke late, and swing
     out of line as they do */
  '    float lag = sin(ph - 0.85 - u * 1.5);',
  '    p.xz *= 1.0 - 0.22 * amp * lag;',
  '    p.y  += 0.16 * amp * lag * u;',
  '    p.x  += 0.035 * amp * sin(ph * 0.5 - u * 2.2) * u;',
  '  }',
  '  return p;',
  '}'
].join('\\n');

var FRAG_POINT = [
  'varying float vInt;',
  'void main(){',
  '  vec2 d = gl_PointCoord - 0.5;',
  '  float r2 = dot(d, d) * 4.0;',
  '  if (r2 > 1.0) discard;',
  '  float a = exp(-r2 * 2.55) - 0.078;',
  '  gl_FragColor = vec4(vec3(vInt * max(a, 0.0)), 1.0);',
  '}'
].join('\\n');

var pointsMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0 },
    uSize:   { value: 4.0 },
    uBright: { value: 1.0 },
    uOmega:  { value: 0.0 },
    uAmp:    { value: 1.0 },
    uFade:   { value: 1.0 }
  },
  vertexShader: [
    'attribute float aRole; attribute float aU; attribute float aInt;',
    'attribute float aSize; attribute vec3 aRnd;',
    'uniform float uTime, uSize, uBright, uOmega, uAmp, uFade;',
    'varying float vInt;',
    PULSE_GLSL,
    'void main(){',
    '  vec3 p = pulse(position, aRole, aU, uOmega * uTime, uAmp);',
    /* the threads also sway on a slower current of their own */
    '  if (aRole > 1.5){',
    '    float k = aU * aU;',
    '    p.x += sin(uTime * 0.44 + aRnd.x * 6.28) * 0.11 * k;',
    '    p.z += cos(uTime * 0.37 + aRnd.y * 6.28) * 0.09 * k;',
    '  }',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float tw = 0.80 + 0.20 * sin(uTime * (1.6 + aRnd.y * 5.0) + aRnd.z * 43.0);',
    '  vInt = aInt * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: FRAG_POINT,
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var jellyGeometry = buildJelly();
var cloud = new THREE.Points(jellyGeometry, pointsMat);
cloud.frustumCulled = false;
lead.add(cloud);

/* ---- the bloom behind: six more, on their own clocks ---- */
var bloomMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0 },
    uSize:   { value: 4.0 },
    uBright: { value: 1.0 },
    uOmega:  { value: 0.0 },
    uAmp:    { value: 1.0 },
    uFade:   { value: 0.0 },
    uSpan:   { value: 7.4 }
  },
  vertexShader: [
    'attribute float aRole; attribute float aU; attribute float aInt;',
    'attribute float aSize; attribute vec3 aRnd; attribute vec4 aSeed;',
    'uniform float uTime, uSize, uBright, uOmega, uAmp, uFade, uSpan;',
    'varying float vInt;',
    PULSE_GLSL,
    'void main(){',
    '  float ph = uOmega * uTime * (0.72 + aSeed.z * 0.55) + aSeed.z * 12.0;',
    '  vec3 p = pulse(position, aRole, aU, ph, uAmp) * aSeed.w;',
    /* each animal climbs its own column and wraps back to the floor */
    '  float rise = fract(aSeed.z + uTime * 0.0125 * (0.6 + aSeed.w));',
    '  vec3 c = vec3(aSeed.x + sin(uTime * 0.17 + aSeed.z * 21.0) * 0.42,',
    '                -3.6 + rise * uSpan,',
    '                aSeed.y + cos(uTime * 0.13 + aSeed.z * 13.0) * 0.34);',
    '  if (aRole > 1.5){',
    '    float k = aU * aU;',
    '    p.x += sin(uTime * 0.40 + aRnd.x * 6.28 + aSeed.z * 9.0) * 0.13 * k;',
    '    p.z += cos(uTime * 0.34 + aRnd.y * 6.28) * 0.10 * k;',
    '  }',
    '  vec4 mv = modelViewMatrix * vec4(p + c, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float life = smoothstep(0.0, 0.10, rise) * (1.0 - smoothstep(0.88, 1.0, rise));',
    '  float tw = 0.82 + 0.18 * sin(uTime * (1.4 + aRnd.y * 4.0) + aRnd.z * 43.0);',
    '  vInt = aInt * life * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: FRAG_POINT,
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

/* x, z, phase, scale, intensity */
var BLOOM = [
  [-2.55, -0.55, 0.06, 0.62, 0.95],
  [-1.35,  0.85, 0.41, 0.44, 0.80],
  [ 0.35, -1.10, 0.72, 0.78, 1.00],
  [ 1.85,  0.55, 0.23, 0.50, 0.85],
  [ 2.95, -0.75, 0.58, 0.66, 0.90],
  [-0.55,  1.35, 0.88, 0.36, 0.68],
  [ 3.75,  1.05, 0.14, 0.42, 0.72]
];
var bloomHost = new THREE.Object3D();
scene.add(bloomHost);
var bloom = new THREE.Points(buildBloom(jellyGeometry, BLOOM), bloomMat);
bloom.frustumCulled = false;
bloomHost.add(bloom);

/* ==================================================================
    Marine snow — the suspended matter that makes deep water read as
    water rather than as an empty frame
   ================================================================== */
function buildSnow(){
  var P = [], SEED = [], INT = [], SIZ = [];
  var N = 3200;
  for (var i = 0; i < N; i++){
    P.push(-3.4 + rnd() * 6.8, 0, -2.0 + rnd() * 3.6);
    SEED.push(rnd(), 0.4 + rnd() * 1.3, rnd() * 6.28, 0.5 + rnd());
    INT.push(0.30 + rnd() * 1.00);
    SIZ.push(0.58 + rnd() * 0.80);
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute('aSeed',    new THREE.Float32BufferAttribute(SEED, 4));
  g.setAttribute('aInt',     new THREE.Float32BufferAttribute(INT, 1));
  g.setAttribute('aSize',    new THREE.Float32BufferAttribute(SIZ, 1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 10.0);
  return g;
}

var snowMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime:   { value: 0 },
    uSize:   { value: 4.0 },
    uBright: { value: 1.0 },
    uFade:   { value: 0.0 },
    uSpan:   { value: 5.2 }
  },
  vertexShader: [
    'attribute vec4 aSeed; attribute float aInt; attribute float aSize;',
    'uniform float uTime, uSize, uBright, uFade, uSpan;',
    'varying float vInt;',
    'void main(){',
    /* snow falls, unlike everything else here, which rises */
    '  float fall = fract(aSeed.x + uTime * 0.014 * aSeed.y);',
    '  vec3 p = position;',
    '  p.y = 2.5 - fall * uSpan;',
    '  p.x += sin(uTime * 0.24 * aSeed.w + aSeed.z) * 0.26;',
    '  p.z += cos(uTime * 0.19 * aSeed.w + aSeed.z * 1.7) * 0.20;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_Position = projectionMatrix * mv;',
    '  float life = smoothstep(0.0, 0.07, fall) * (1.0 - smoothstep(0.92, 1.0, fall));',
    '  float tw = 0.50 + 0.50 * sin(uTime * (0.9 + aSeed.w * 2.4) + aSeed.z * 11.0);',
    '  vInt = aInt * life * tw * uFade * uBright;',
    '  gl_PointSize = uSize * aSize / max(0.35, -mv.z);',
    '}'
  ].join('\\n'),
  fragmentShader: FRAG_POINT,
  blending: THREE.AdditiveBlending,
  depthTest: false, depthWrite: false, transparent: true
});

var drift = new THREE.Object3D();
scene.add(drift);
var snow = new THREE.Points(buildSnow(), snowMat);
snow.frustumCulled = false;
drift.add(snow);

/* ================================================================== */
/*  Post chain                                                        */
/* ================================================================== */
function makeRT(w, h){
  return new THREE.WebGLRenderTarget(Math.max(2, w | 0), Math.max(2, h | 0), {
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat, type: THREE.HalfFloatType,
    depthBuffer: false, stencilBuffer: false
  });
}
var rtScene = makeRT(2, 2), rtA = makeRT(2, 2), rtB = makeRT(2, 2),
    rtC = makeRT(2, 2), rtD = makeRT(2, 2);

var quadScene = new THREE.Scene();
var quadCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
var quadGeo   = new THREE.PlaneGeometry(2, 2);
var quadMesh  = new THREE.Mesh(quadGeo, null);
quadScene.add(quadMesh);
function blit(mat, target){
  quadMesh.material = mat;
  renderer.setRenderTarget(target || null);
  renderer.render(quadScene, quadCam);
}

var VERT_QUAD = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

var copyMat = new THREE.ShaderMaterial({
  uniforms: { tSrc: { value: null } },
  vertexShader: VERT_QUAD,
  fragmentShader: 'uniform sampler2D tSrc; varying vec2 vUv;' +
                  'void main(){ gl_FragColor = texture2D(tSrc, vUv); }',
  depthTest: false, depthWrite: false
});

var blurMat = new THREE.ShaderMaterial({
  uniforms: { tSrc: { value: null }, uStep: { value: new THREE.Vector2() } },
  vertexShader: VERT_QUAD,
  fragmentShader: [
    'uniform sampler2D tSrc; uniform vec2 uStep; varying vec2 vUv;',
    'void main(){',
    '  vec4 s = texture2D(tSrc, vUv) * 0.2270270270;',
    '  s += (texture2D(tSrc, vUv + uStep * 1.3846153846) + texture2D(tSrc, vUv - uStep * 1.3846153846)) * 0.3162162162;',
    '  s += (texture2D(tSrc, vUv + uStep * 3.2307692308) + texture2D(tSrc, vUv - uStep * 3.2307692308)) * 0.0702702703;',
    '  gl_FragColor = s;',
    '}'
  ].join('\\n'),
  depthTest: false, depthWrite: false
});

var compMat = new THREE.ShaderMaterial({
  uniforms: {
    tScene: { value: null }, tGlow: { value: null }, tGlow2: { value: null },
    uRes:   { value: new THREE.Vector2(2, 2) },
    uCell:  { value: 8.5 },
    uGain:  { value: CFG.gain },
    uCurve: { value: CFG.curve },
    uDot:   { value: new THREE.Vector2(CFG.dotMax, CFG.dotGamma) },
    uGlow:  { value: CFG.glow },
    uGlowGain: { value: CFG.glowGain },
    uExposure: { value: CFG.exposure },
    uTime:  { value: 0 },
    uShaft: { value: CFG.shaft },
    uDeep:  { value: CFG.deep }
  },
  vertexShader: VERT_QUAD,
  fragmentShader: [
    'precision highp float;',
    'uniform sampler2D tScene, tGlow, tGlow2;',
    'uniform vec2 uRes, uDot;',
    'uniform float uCell, uGain, uGlow, uGlowGain, uExposure, uCurve, uTime, uShaft, uDeep;',
    'varying vec2 vUv;',
    'const float K = 0.70710678;',
    /* midnight -> bioluminescence: the ember ramp re-sampled for the deep */
    'vec3 ramp(float u){',
    '  u = clamp(u, 0.0, 1.0);',
    '  vec3 c1 = vec3(0.030, 0.048, 0.150);',
    '  vec3 c2 = vec3(0.085, 0.190, 0.545);',
    '  vec3 c3 = vec3(0.250, 0.585, 0.945);',
    '  vec3 c4 = vec3(0.795, 0.910, 1.000);',
    '  vec3 c = c1 * smoothstep(0.0, 0.135, u);',
    '  c = mix(c, c2, smoothstep(0.115, 0.375, u));',
    '  c = mix(c, c3, smoothstep(0.360, 0.625, u));',
    '  c = mix(c, c4, smoothstep(0.615, 1.000, u));',
    '  return c;',
    '}',
    /* one wide shaft of surface light, far above and almost spent by the
       time it reaches this depth; added into the density the screen reads
       so it carries the same dot lattice as the animals                */
    'float shaft(vec2 uv){',
    '  float aspect = uRes.x / max(uRes.y, 1.0);',
    '  float x = (uv.x - 0.62) * aspect + (1.0 - uv.y) * 0.30;',
    '  float band = exp(-x * x * 2.10) * 0.80',
    '             + exp(-pow(x + 0.62, 2.0) * 5.40) * 0.42;',
    '  band *= 0.80 + 0.20 * sin(uTime * 0.13 + x * 2.1);',
    '  return band * smoothstep(-0.30, 1.00, uv.y);',
    '}',
    'void main(){',
    '  vec2 pix = vUv * uRes;',
    /* 45 degree halftone lattice: sample the source at the dot centre */
    '  mat2 R  = mat2(K, -K, K, K);',
    '  mat2 Ri = mat2(K,  K, -K, K);',
    '  vec2 lp = (R * pix) / uCell;',
    '  vec2 id = floor(lp) + 0.5;',
    '  vec2 cp = Ri * (id * uCell);',
    '  vec2 ex = Ri * vec2(uCell * 0.42, 0.0);',
    '  vec2 ey = Ri * vec2(0.0, uCell * 0.42);',
    '  float d = texture2D(tScene, clamp(cp / uRes, vec2(0.0), vec2(1.0))).r * 0.36;',
    '  d += texture2D(tScene, clamp((cp + ex) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp - ex) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp + ey) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  d += texture2D(tScene, clamp((cp - ey) / uRes, vec2(0.0), vec2(1.0))).r * 0.16;',
    '  vec2 cuv = clamp(cp / uRes, vec2(0.0), vec2(1.0));',
    '  d += shaft(cuv) * uShaft + uDeep * smoothstep(-0.45, 1.10, cuv.y);',
    '  float u = pow(1.0 - exp(-d * uGain), uCurve);',
    '  float rad = uDot.x * pow(u, uDot.y);',
    '  float aa  = 0.85 / uCell;',
    '  float cov = 1.0 - smoothstep(rad - aa, rad + aa, length(lp - id));',
    '  vec3 col = ramp(u) * cov;',
    '  float g = texture2D(tGlow, vUv).r * 0.62 + texture2D(tGlow2, vUv).r * 0.38;',
    '  g += shaft(vUv) * uShaft * 0.90;',
    '  col += ramp(pow(1.0 - exp(-g * uGain * uGlowGain), uCurve)) * uGlow;',
    '  gl_FragColor = vec4(col * uExposure, 1.0);',
    '}'
  ].join('\\n'),
  depthTest: false, depthWrite: false
});

/* ================================================================== */
/*  Layout                                                            */
/* ================================================================== */
var VW = 1440, VH = 914;              /* reference design frame */
var view = { w: 1, h: 1, aspect: 1 };

function resize(){
  var w = window.innerWidth, h = window.innerHeight;
  view.w = w; view.h = h; view.aspect = w / h;
  renderer.setSize(w, h, false);
  camera.aspect = view.aspect;
  camera.updateProjectionMatrix();

  var pw = Math.round(w * DPR), ph = Math.round(h * DPR);
  rtScene.setSize(pw, ph);
  rtA.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
  rtB.setSize(Math.max(2, pw >> 2), Math.max(2, ph >> 2));
  rtC.setSize(Math.max(2, pw >> 3), Math.max(2, ph >> 3));
  rtD.setSize(Math.max(2, pw >> 3), Math.max(2, ph >> 3));
  compMat.uniforms.uRes.value.set(pw, ph);
  compMat.uniforms.uCell.value = CFG.cellCss * DPR;
}
window.addEventListener('resize', resize);

function anchorToWorld(ax, ay, dist, out){
  var ndcX = (ax / VW) * 2 - 1;
  var ndcY = 1 - (ay / VH) * 2;
  var hHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * dist;
  var wHalf = hHalf * view.aspect;
  var designAspect = VW / VH;
  var sx = view.aspect >= designAspect ? (designAspect / view.aspect) : 1.0;
  out.set(ndcX * wHalf * sx, ndcY * hHalf, -dist);
  return out;
}

/* ================================================================== */
/*  Frame                                                             */
/* ================================================================== */
var qTmp = new THREE.Quaternion(), qA = new THREE.Quaternion();
var AX_Y = new THREE.Vector3(0, 1, 0);
var fIdle = new THREE.Vector3(), fMix = new THREE.Vector3(), aimTgt = new THREE.Vector3();

/* the jellyfish's axis is +Y, out through the crown of the bell */
function fwdFromAzEl(az, el, out){
  return out.set(Math.cos(el) * Math.cos(az), Math.sin(el), -Math.cos(el) * Math.sin(az));
}
function aimJelly(f, spin){
  qA.setFromUnitVectors(AX_Y, f);
  qTmp.setFromAxisAngle(f, spin);
  lead.quaternion.copy(qA).premultiply(qTmp);
}

/* ---------- pointer chase --------------------------------------------
   the canvas takes no hit test, so the lead animal's own projected
   centre is compared against the pointer.  engaged it turns its crown
   onto the cursor and pumps harder; left alone it goes back to riding
   its own slow current.                                              */
var ptr = { x: 0, y: 0, live: false, moved: -99, hot: false };
var eng = { w: 0, ax: 0, ay: 0, seeded: false,
            ndc: new THREE.Vector3(), aim: new THREE.Vector3(0, 1, 0) };

function track(e){
  ptr.x = e.clientX; ptr.y = e.clientY;
  ptr.live = true; ptr.moved = performance.now() / 1000;
}
window.addEventListener('pointermove', track, { passive: true });
window.addEventListener('pointerdown', track, { passive: true });
document.addEventListener('pointerleave', function (){ ptr.live = false; ptr.hot = false; });
window.addEventListener('blur', function (){ ptr.live = false; ptr.hot = false; });

var anchorTmp = { x: 0, y: 0 };
function screenToAnchor(px, py, out){
  var designAspect = VW / VH;
  var k = view.aspect >= designAspect ? (designAspect / view.aspect) : 1.0;
  out.x = ((2 * px / view.w - 1) / k + 1) * 0.5 * VW;
  out.y = (py / view.h) * VH;
  return out;
}

var pos  = new THREE.Vector3();
var lastNow = performance.now() / 1000;
var everRendered = false;
/* once a capture harness drives the clock, the live loop stands down so the
   two are not both advancing the same smoothing state */
var headless = false;
var DBG = { on: false };

function render(t, dt){
  everRendered = true;

  var f  = ease(THREE.MathUtils.clamp((t - T.flightStart) / (T.flightEnd - T.flightStart), 0, 1));
  var fl = easeIO(THREE.MathUtils.clamp((t - T.flightStart) / (T.flightEnd - T.flightStart), 0, 1));

  var P  = CFG.home;
  var frz = CFG.freeze;

  var narrow = THREE.MathUtils.clamp((1.40 - view.aspect) / 0.55, 0, 1);
  var tight  = THREE.MathUtils.clamp((900 - view.w) / 420, 0, 1);
  var pDist  = P.dist * (1 + 0.26 * narrow) * (1 + 0.58 * tight);
  var pAx    = P.ax   - 60 * narrow - 40 * tight;
  var pAy    = P.ay   - 20 * narrow - 14 * tight;

  var dist  = frz ? pDist : THREE.MathUtils.lerp(9.8, pDist, f);
  var ax    = frz ? pAx   : THREE.MathUtils.lerp(1180, pAx, fl);
  var ay    = frz ? pAy   : THREE.MathUtils.lerp(1080, pAy, fl);

  /* idle: a slow rise and a lazy lateral set, the way anything neutrally
     buoyant moves                                                      */
  var bob = frz ? 0 : Math.sin(t * 0.21 + 1.2) * 0.86 + Math.sin(t * 0.53) * 0.20
                    + Math.sin(t * 1.07 + 2.6) * 0.07;
  var swy = frz ? 0 : Math.sin(t * 0.16 + 0.4) * 0.72 + Math.sin(t * 0.39) * 0.28
                    + Math.sin(t * 0.91 + 2.0) * 0.09;
  var idleX = ax + swy * 62, idleY = ay + bob * 50;

  /* ---- engagement ---- */
  var want = (ptr.live && f > 0.45 && (ptr.hot || t + start - ptr.moved < 2.4)) ? 1 : 0;
  eng.w += (want - eng.w) * Math.min(1, dt * (want ? 1.9 : 1.0));
  var chase = frz ? 0 : eng.w;

  screenToAnchor(ptr.x, ptr.y, anchorTmp);
  var hx = idleX - anchorTmp.x, hy = idleY - anchorTmp.y;
  var hl = Math.hypot(hx, hy) || 1;
  var stand = Math.min(hl, 250);
  var tgtX = THREE.MathUtils.lerp(idleX, anchorTmp.x + hx / hl * stand, chase);
  var tgtY = THREE.MathUtils.lerp(idleY, anchorTmp.y + hy / hl * stand, chase);
  if (!eng.seeded){ eng.ax = tgtX; eng.ay = tgtY; eng.seeded = true; }
  /* it never hurries: the approach is a long, damped drift */
  var follow = Math.min(1, dt * (1.5 + 2.2 * (1 - chase)));
  eng.ax += (tgtX - eng.ax) * follow;
  eng.ay += (tgtY - eng.ay) * follow;
  anchorToWorld(eng.ax, eng.ay, dist, pos);
  lead.position.copy(pos);

  var sc = (frz ? P.scale : THREE.MathUtils.lerp(0.58, P.scale, f))
         * THREE.MathUtils.lerp(1, 0.86, chase);
  lead.scale.setScalar(sc);

  /* ---- the crown leans toward the cursor, but never far off vertical -- */
  eng.ndc.copy(pos).project(camera);
  var bx = (eng.ndc.x * 0.5 + 0.5) * view.w;
  var by = (-eng.ndc.y * 0.5 + 0.5) * view.h;
  var dx = ptr.x - bx, dy = ptr.y - by;
  var len = Math.hypot(dx, dy);
  if (len > 8){
    aimTgt.set(dx / len * 0.30, Math.max(0.86, -dy / len), -0.06).normalize();
    eng.aim.lerp(aimTgt, Math.min(1, dt * 1.4)).normalize();
  }

  var az   = (frz ? P.az   : THREE.MathUtils.lerp(P.az - 0.20,  P.az,   fl)) + (frz?0:Math.sin(t * 0.23) * 0.10);
  var el   = (frz ? P.el   : THREE.MathUtils.lerp(P.el - 0.14,  P.el,   fl)) + (frz?0:Math.sin(t * 0.31 + 2.0) * 0.045);
  var spin = (frz ? 0 : t * 0.055) + (frz?0:Math.sin(t * 0.27 + 0.9) * 0.14);
  fwdFromAzEl(az, el, fIdle);
  fMix.copy(fIdle).lerp(eng.aim, chase * 0.62).normalize();
  if (DBG.on){
    anchorToWorld(DBG.ax, DBG.ay, DBG.dist, pos);
    lead.position.copy(pos);
    lead.scale.setScalar(DBG.scale);
    sc = DBG.scale;
    fwdFromAzEl(DBG.az, DBG.el, fMix);
    spin = DBG.spin;
  }
  aimJelly(fMix, spin);

  /* ---- the bloom behind: never chases anything ---- */
  screenToAnchor(view.w * (CFG.bloomPose.ax / VW), view.h * (CFG.bloomPose.ay / VH), anchorTmp);
  anchorToWorld(anchorTmp.x, anchorTmp.y, CFG.bloomPose.dist, pos);
  bloomHost.position.copy(pos);
  bloomHost.scale.setScalar(CFG.bloomPose.scale);

  /* ---- the plankton column ---- */
  anchorToWorld(VW * 0.5, VH * 0.5, 6.2, pos);
  drift.position.copy(pos);

  var omega = 2 * Math.PI * CFG.pulse * (1 + 0.55 * chase);
  var amp   = 0.90 + 0.28 * chase;

  pointsMat.uniforms.uTime.value   = t;
  pointsMat.uniforms.uOmega.value  = omega;
  pointsMat.uniforms.uAmp.value    = DBG.on ? DBG.amp : amp;
  pointsMat.uniforms.uSize.value   = CFG.pointSize * DPR * (view.h / VH) * Math.pow(sc, 0.9);
  pointsMat.uniforms.uBright.value = CFG.bright;
  pointsMat.uniforms.uFade.value   = THREE.MathUtils.smoothstep(t, T.flightStart, T.flightStart + 1.3);

  bloomMat.uniforms.uTime.value   = t;
  bloomMat.uniforms.uOmega.value  = 2 * Math.PI * CFG.pulse;
  bloomMat.uniforms.uAmp.value    = 0.92;
  bloomMat.uniforms.uSize.value   = CFG.pointSize * CFG.bloomSize * DPR * (view.h / VH);
  bloomMat.uniforms.uBright.value = CFG.bright * CFG.bloomInt;
  bloomMat.uniforms.uFade.value   = THREE.MathUtils.smoothstep(t, T.flightStart, T.flightStart + 2.6);

  snowMat.uniforms.uTime.value   = t;
  snowMat.uniforms.uSize.value   = CFG.pointSize * 1.30 * DPR * (view.h / VH);
  snowMat.uniforms.uBright.value = CFG.bright * CFG.snow;
  snowMat.uniforms.uFade.value   = THREE.MathUtils.smoothstep(t, T.flightStart + 0.3, T.flightStart + 3.2);

  /* ---- render ---- */
  renderer.setRenderTarget(rtScene);
  renderer.clear(true, true, true);
  renderer.render(scene, camera);

  copyMat.uniforms.tSrc.value = rtScene.texture;                     blit(copyMat, rtA);
  blurMat.uniforms.tSrc.value = rtA.texture;
  blurMat.uniforms.uStep.value.set(1 / rtA.width, 0);                blit(blurMat, rtB);
  blurMat.uniforms.tSrc.value = rtB.texture;
  blurMat.uniforms.uStep.value.set(0, 1 / rtA.height);               blit(blurMat, rtA);

  copyMat.uniforms.tSrc.value = rtA.texture;                         blit(copyMat, rtC);
  blurMat.uniforms.tSrc.value = rtC.texture;
  blurMat.uniforms.uStep.value.set(1 / rtC.width, 0);                blit(blurMat, rtD);
  blurMat.uniforms.tSrc.value = rtD.texture;
  blurMat.uniforms.uStep.value.set(0, 1 / rtC.height);               blit(blurMat, rtC);

  compMat.uniforms.tScene.value = rtScene.texture;
  compMat.uniforms.tGlow.value  = rtA.texture;
  compMat.uniforms.tGlow2.value = rtC.texture;
  compMat.uniforms.uGain.value  = CFG.gain;
  compMat.uniforms.uCurve.value = CFG.curve;
  compMat.uniforms.uDot.value.set(CFG.dotMax, CFG.dotGamma);
  compMat.uniforms.uGlow.value  = CFG.glow;
  compMat.uniforms.uGlowGain.value = CFG.glowGain;
  compMat.uniforms.uExposure.value = CFG.exposure;
  compMat.uniforms.uCell.value  = CFG.cellCss * DPR;
  compMat.uniforms.uTime.value  = t;
  compMat.uniforms.uShaft.value = CFG.shaft;
  compMat.uniforms.uDeep.value  = CFG.deep;
  blit(compMat, null);
}

function frame(now){
  requestAnimationFrame(frame);
  if (headless) return;
  /* note: no document.hidden guard — some embedded webviews report the
     document as permanently hidden while still driving rAF            */
  var t = reduced ? (T.flightEnd + 3.0) : (now / 1000 - start);
  var dt = Math.min(0.05, Math.max(0.001, now / 1000 - lastNow));
  lastNow = now / 1000;
  render(t, dt);
}

document.addEventListener('visibilitychange', function(){
  if (document.hidden || everRendered) return;
  start = performance.now() / 1000;
});

resize();
requestAnimationFrame(frame);

/* headless capture: render exactly one frame at an absolute time */
window.__seek = function(t){ headless = true; render(t, 1 / 30); };
window.__pose = function(o){ DBG.on = true; for (var k in o) DBG[k] = o[k]; };
window.__ptr  = function(x, y, live){ ptr.x = x; ptr.y = y;
  ptr.live = live !== false; ptr.moved = start + 1e9; };
window.__dbg  = { lead: lead, cloud: cloud, mat: pointsMat, cam: camera, THREE: THREE,
                  ptr: ptr, eng: eng, view: view, cfg: CFG };
})();
<\/script>
</body>
</html>
`,K=["instrument-serif","newsreader","geist"],Z=["geist","newsreader","instrument-serif"],Q=["hummingbird","sakura","reef","abyss"],T={dotSpacing:"cellCss",dotSize:"dotMax",dotResponse:"dotGamma",grain:"pointSize",density:"gain",contrast:"curve",brightness:"bright",bloom:"glow",exposure:"exposure"},B={"instrument-serif":'"Instrument Serif", Georgia, serif',newsreader:'"Newsreader", Georgia, serif',geist:'"Geist", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif'},V="#fbd736",I=["400","500","600","700"],$="allow-downloads allow-forms allow-modals allow-popups allow-scripts",U="threeui-trochil-customization",J={sakura:O,reef:Y,abyss:X},nn={hummingbird:"Trochil — Field intelligence for the systems that never hold still",sakura:"Trochil Sakura — halftone butterfly on a cherry branch",reef:"Trochil Reef — halftone fish over a coral shelf",abyss:"Trochil Abyss — a halftone bloom of jellyfish"},en={hummingbird:V,sakura:"#ec8ba4",reef:"#54c4da",abyss:"#3f95f1"};function x(t,a,n,e){return Number.isFinite(t)?Math.min(n,Math.max(a,t)):e}function f(t,a,n){return a.includes(t)?t:n}function tn(t,a){if(!t)return a;const n=t.trim().match(/^#([\da-f]{6})$/i);return n?`#${n[1].toLowerCase()}`:a}function _(t){const a=[1,3,5].map(v=>Number.parseInt(t.slice(v,v+2),16)/255),[n,e,i]=a,r=Math.max(n,e,i),s=Math.min(n,e,i),l=(r+s)/2,h=r-s;if(h===0)return{hue:0,saturation:0,lightness:l};const m=h/(1-Math.abs(2*l-1));return{hue:((r===n?(e-i)/h%6:r===e?(i-n)/h+2:(n-e)/h+4)*60+360)%360,saturation:m,lightness:l}}function an(t,a){if(t===a)return"none";const n=_(a),e=_(t),i=e.hue-n.hue,r=Math.min(3,Math.max(0,e.saturation/Math.max(n.saturation,.01))),s=Math.min(2,Math.max(.2,e.lightness/Math.max(n.lightness,.01)));return`hue-rotate(${i.toFixed(2)}deg) saturate(${r.toFixed(3)}) brightness(${s.toFixed(3)})`}function N(t,a,n){const e=t?.contentWindow?.__cfg;if(e){if(!n.current){const i={};for(const r of Object.values(T))typeof e[r]=="number"&&(i[r]=e[r]);n.current=i}for(const[i,r]of Object.entries(T)){const s=n.current[r];if(typeof s!="number")continue;const l=a[i];e[r]=s*(Number.isFinite(l)?Math.max(0,l):1)}}}function j(t,a){const n=t.contentDocument;if(!n?.head)return;let e=n.getElementById(U);e||(e=n.createElement("style"),e.id=U,n.head.append(e)),e.textContent=a}function rn({className:t="",style:a,variant:n="hummingbird",presentation:e="background",headingFont:i="instrument-serif",bodyFont:r="geist",headingWeight:s="400",bodyWeight:l="400",primaryColor:h,headingSize:m=74,bodySize:S=15,headingLetterSpacing:v=0,...o}){const p=u.useRef(null),w=u.useRef(null),[q,L]=u.useState(!1),d=Q.includes(n)?n:"hummingbird",g=en[d],R=f(i,K,"instrument-serif"),z=f(r,Z,"geist"),H=f(s,I,"400"),F=f(l,I,"400"),W=d!=="hummingbird"&&h?.trim().toLowerCase()===V?void 0:h,b=tn(W,g),G=x(m,48,108,74),A=x(S,11,22,15),C=x(v,-.06,.12,0),y=u.useMemo(()=>`
:root { --trochil-primary: ${b}; }
body {
  font-family: ${B[z]};
  font-weight: ${F};
}
h1 {
  font-family: ${B[R]};
  font-weight: ${H};
  font-size: ${G}rem;
  line-height: 0.9135;
  letter-spacing: ${C}em;
}
.card > p:not(.eyebrow) {
  font-size: ${A}rem;
  line-height: 1.3467;
}
#gl { filter: ${an(b,g)}; }
`,[g,z,A,F,R,C,G,H,b]),M=u.useMemo(()=>{const c={};for(const k of Object.keys(T)){const P=o[k];Number.isFinite(P)&&(c[k]=P)}return c},[o.dotSpacing,o.dotSize,o.dotResponse,o.grain,o.density,o.contrast,o.brightness,o.bloom,o.exposure]);return u.useEffect(()=>{p.current&&(j(p.current,y),D(p.current,e==="background"?"#gl":void 0))},[y,e]),u.useEffect(()=>{N(p.current,M,w)},[M]),E.jsx("div",{className:`threeui-background landing-page-frame trochil-hero-frame${t?` ${t}`:""}`,"data-state":q?"ready":"loading",style:{position:"relative",overflow:"hidden",background:"#000",pointerEvents:"auto",...a},children:E.jsx("iframe",{ref:p,title:nn[d],...d==="hummingbird"?{src:"/landing-pages/trochil-hero.html"}:{srcDoc:J[d]},sandbox:$,loading:"eager",onLoad:c=>{w.current=null,j(c.currentTarget,y),D(c.currentTarget,e==="background"?"#gl":void 0),N(c.currentTarget,M,w),L(!0)},style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#000"}},d)})}function hn(t){return E.jsx(rn,{...t,presentation:"page"})}export{Z as TROCHIL_BODY_FONTS,K as TROCHIL_HEADING_FONTS,Q as TROCHIL_HERO_VARIANTS,T as TROCHIL_SCREEN_KEYS,rn as TrochilHero,hn as TrochilPage,rn as default};
