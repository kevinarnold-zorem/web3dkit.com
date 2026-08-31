import{r as a,j as h}from"./index-fOQwe-l-.js";const E=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>shaders</title>
<style>
  html,body{margin:0;height:100%;background:#000;overflow:hidden}
  body{-webkit-font-smoothing:antialiased}
  canvas{display:block;width:100vw;height:100vh;background:#000}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
"use strict";
/* ==================================================================
   shaders — built on a recreation of John Phamous' "365 days at
   Vercel" motion piece.  A glass cube tumbling in front of a dithered,
   pixelated word, lit by one hidden key light.

   The key light rakes in from the side, barely above the horizon, so a
   face catches it edge-on and blows out.  What leaves that face is a real shaft: the bright
   pass is gathered along rays diverging from a virtual apex sitting
   behind the lit facet, each step taken from a coarser mip so the beam
   widens and softens as it travels, and the march is dithered per pixel
   so forty steps don't show up as banding.

   Drag to throw the cube around; it keeps the momentum and settles.
   Moving the pointer alone orbits it gently.

   The type is set in Geist Regular rather than the original's Light:
   at seven letters the word has to be less than half the height of
   the original digits, and Light's stems came out thinner than one
   pixelation cell, so the word dissolved.

   Everything below is one full-screen ray cast against six planes plus
   a two-level bloom.  The camera, the type plate and the grain are the
   values solved out of the source clip; the light was retuned for the
   cube, whose faces meet the light at quite different angles.
   ------------------------------------------------------------------
   composition constants (units = the 960x720 reference frame)
================================================================== */
const COMP_W = 960, COMP_H = 720;

// tetrahedron placement / camera, solved from the reference
const CX = 452.883, CY = 361.826;  // screen position of the object centre
const SCL = 276.023;               // px per world unit at z = 0
const KP  = 0.24802;               // perspective:  1 / camera distance
const DCAM = 1.0 / KP;             // 4.032 circumradii

// motion: a fixed 55.14 deg tilt, spinning about the cube's own z axis
const TILT   = 55.1377 * Math.PI / 180;
const OMEGA  = -0.900488;                  // rad / second  (-51.594 deg/s)
const THETA0 = -155.6436 * Math.PI / 180;

// background type plate — Geist Regular outlines, baked so nothing loads
const TEX_W = 128, TEX_H = 96, TEX_SS = 8;
const FS = 246.6285, UPEM = 1000;
const BASELINE = 438.073;
const PENS = [3.7500, 136.2882, 283.8707, 424.0544, 575.0897, 717.7396, 815.5032];
const GLYPHS = [
"M273 -12Q200 -12 150.5 11.0Q101 34 74.5 74.5Q48 115 44 167L132 173Q140 125 171.5 96.5Q203 68 273 68Q327 68 356.5 85.5Q386 103 386 142Q386 163 376.5 177.0Q367 191 339.0 201.5Q311 212 257 222Q183 236 141.0 257.0Q99 278 82.0 308.0Q65 338 65 380Q65 451 117.5 496.5Q170 542 266 542Q336 542 380.5 517.5Q425 493 448.0 454.0Q471 415 476 372L388 366Q386 391 373.0 413.0Q360 435 334.0 448.5Q308 462 264 462Q207 462 180.0 440.0Q153 418 153 384Q153 358 163.5 341.5Q174 325 200.5 314.5Q227 304 273 296Q351 283 395.0 263.0Q439 243 456.5 213.5Q474 184 474 142Q474 69 417.5 28.5Q361 -12 273 -12Z",
"M80 0V710H164V413L154 415Q164 459 188.0 487.0Q212 515 247.0 528.5Q282 542 324 542Q381 542 420.5 516.5Q460 491 480.5 445.5Q501 400 501 341V0H417V317Q417 394 389.5 431.0Q362 468 306 468Q242 468 203.0 429.0Q164 390 164 316V0Z",
"M223 -12Q141 -12 92.5 26.0Q44 64 44 132Q44 200 84.0 239.0Q124 278 211 294L399 329Q399 396 367.5 429.0Q336 462 273 462Q218 462 186.0 437.5Q154 413 142 367L53 374Q68 449 125.5 495.5Q183 542 273 542Q375 542 429.0 484.5Q483 427 483 326V107Q483 89 489.5 81.5Q496 74 511 74H532V0Q528 -1 519.0 -1.5Q510 -2 500 -2Q464 -2 441.5 9.5Q419 21 409.0 45.5Q399 70 399 110L409 108Q402 74 375.0 46.5Q348 19 308.0 3.5Q268 -12 223 -12ZM231 62Q284 62 321.5 82.5Q359 103 379.0 138.5Q399 174 399 218V256L227 224Q173 214 152.5 193.5Q132 173 132 140Q132 103 158.5 82.5Q185 62 231 62Z",
"M268 -12Q199 -12 148.5 22.0Q98 56 71.0 118.0Q44 180 44 265Q44 350 71.0 412.0Q98 474 148.5 508.0Q199 542 268 542Q321 542 365.0 519.5Q409 497 431 456V710H515V0H439L436 80Q414 37 369.0 12.5Q324 -12 268 -12ZM285 68Q332 68 364.5 92.0Q397 116 414.0 160.5Q431 205 431 265Q431 327 414.0 371.0Q397 415 364.5 438.5Q332 462 285 462Q215 462 173.5 409.5Q132 357 132 265Q132 174 173.5 121.0Q215 68 285 68Z",
"M287 -12Q212 -12 157.5 22.0Q103 56 73.5 118.5Q44 181 44 265Q44 349 73.5 411.0Q103 473 156.5 507.5Q210 542 283 542Q352 542 405.0 509.5Q458 477 487.5 415.0Q517 353 517 264V239H132Q137 154 177.5 111.0Q218 68 287 68Q339 68 372.5 92.5Q406 117 419 157L509 150Q488 79 429.5 33.5Q371 -12 287 -12ZM132 313H425Q419 390 380.5 426.0Q342 462 283 462Q222 462 182.5 424.5Q143 387 132 313Z",
"M80 0V530H154L158 396L150 399Q160 467 193.5 498.5Q227 530 283 530H335V450H284Q244 450 217.5 435.5Q191 421 177.5 392.5Q164 364 164 320V0Z",
"M273 -12Q200 -12 150.5 11.0Q101 34 74.5 74.5Q48 115 44 167L132 173Q140 125 171.5 96.5Q203 68 273 68Q327 68 356.5 85.5Q386 103 386 142Q386 163 376.5 177.0Q367 191 339.0 201.5Q311 212 257 222Q183 236 141.0 257.0Q99 278 82.0 308.0Q65 338 65 380Q65 451 117.5 496.5Q170 542 266 542Q336 542 380.5 517.5Q425 493 448.0 454.0Q471 415 476 372L388 366Q386 391 373.0 413.0Q360 435 334.0 448.5Q308 462 264 462Q207 462 180.0 440.0Q153 418 153 384Q153 358 163.5 341.5Q174 325 200.5 314.5Q227 304 273 296Q351 283 395.0 263.0Q439 243 456.5 213.5Q474 184 474 142Q474 69 417.5 28.5Q361 -12 273 -12Z"
];

/* look ------------------------------------------------------------ */
const P = {
  cell:     15.0,     // pixelation cell of the type plate, composition px
  phx:      7.0, phy: 10.5,        // grid phase
  bgLevel:  0.520,    // display value of a fully covered type cell
  trans:    1.900,    // gain on the plate seen through the body (it is a lens)
  lex:      1.000, ley: 0.300, lez: 0.120,     // key light: raking in from
                      //   the side, barely above the horizon, so faces catch it
                      //   edge-on and the shaft rakes across rather than rising
  envG1:    10.0, envP1: 16.19,    // tight lobe  — the flash
  envG2:    0.200, envP2: 4.55,    // broad lobe  — the standing sheen
  ior:      1.03,     // refraction of the glass body
  f0:      -0.156,    // sheen falloff: F = f0 + (1-f0)*cos, clamped at 0
  bgZ:      2.50,     // backdrop plane, circumradii behind the object
  gainMax:  10.0,     // ceiling on the lens concentration
  ambBase:  0.75,     // the key light also washes over the backdrop:
  ambGain:  0.60,     //   plate level = ambBase + ambGain * flash
  edgeW:    1.40,     // wireframe width, composition px
  edgeLvl:  0.074,    // wireframe radiance
  grain:    0.130,    // multiplicative film grain
  /* animation of the plate ------------------------------------------- */
  noiseHz:  20.0,     // steps/sec the stipple and grain are reseeded on
  glitch:   1.00,     // master amount for the band tearing
  glitchHz: 13.0,     // burst slots per second (~7% fire, so a tear
                      //   every ~1.2s lasting a single 0.08s slot)
  bandH:    3.0,      // height of a torn band, cells
  maxShift: 4.0,      // furthest a band tears sideways, cells
  drop:     0.025,    // fraction of cells blanked each step
  dropHz:   9.0,
  /* the glow: a hard bright core hugging the blown facet plus a much
     weaker tail, which is what the reference does — not a soft wash    */
  bloomT:   0.70,     // only a facet that has actually gone white glows
  bloom1:   0.16, blurStep1: 1.00,   // core
  bloom2:   0.10, blurStep2: 1.00,   // tail
  rays:     0.10,     // strength of the shaft
  rayApex:  0.90,     // how far behind the facet the shaft opens from
  rayDensity: 0.75,   // how far back down the shaft each pixel gathers
  rayDecay: 0.90,     // per-step falloff
  rayLod:   0.055,    // how fast it softens as it travels
  bgOnly:   0
};
const qs = new URLSearchParams(location.search);
for(const k in P){ if(qs.has(k)) P[k] = parseFloat(qs.get(k)); }

/* ------------------------------------------------------------------ */
function norm3(v){const l=Math.hypot(v[0],v[1],v[2]);return [v[0]/l,v[1]/l,v[2]/l];}

const LE = norm3([P.lex, P.ley, P.lez]);
/* A cube sized so its mean projected area matches the tetrahedron the piece
   was solved against — otherwise it reads about twice as heavy.  Mean
   silhouette = surface/4, so 8a^2/4 must equal the tetra's 1.155.          */
const CUBE_R = 0.760;                       // half body diagonal
const CUBE_A = CUBE_R/Math.sqrt(3);         // half edge = inradius
const VERTS = [];
for(let i=0;i<8;i++) VERTS.push([ (i&1?1:-1)*CUBE_A, (i&2?1:-1)*CUBE_A, (i&4?1:-1)*CUBE_A ]);
const FACE_N = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];

/* ---------- background plate ------------------------------------- */
// the cell grid is centred on the composition, so the plate can be rebuilt
// for any cell size without the type drifting
const TEX_ORG = [COMP_W*0.5 - TEX_W*0.5*P.cell + P.phx,
                 COMP_H*0.5 - TEX_H*0.5*P.cell + P.phy];
function buildPlate(){
  const W = TEX_W*TEX_SS, H = TEX_H*TEX_SS;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d", {willReadFrequently:true});
  g.fillStyle = "#000"; g.fillRect(0,0,W,H);
  const k = TEX_SS/P.cell;                     // composition px -> canvas px
  g.fillStyle = "#fff";
  for(let i=0;i<GLYPHS.length;i++){
    g.save();
    g.translate((PENS[i]-TEX_ORG[0])*k, (BASELINE-TEX_ORG[1])*k);
    g.scale(FS/UPEM*k, -FS/UPEM*k);
    g.fill(new Path2D(GLYPHS[i]));
    g.restore();
  }
  const src = g.getImageData(0,0,W,H).data;
  const out = new Uint8Array(TEX_W*TEX_H);
  for(let y=0;y<TEX_H;y++) for(let x=0;x<TEX_W;x++){
    let s=0;
    for(let j=0;j<TEX_SS;j++){
      const row=((y*TEX_SS+j)*W + x*TEX_SS)*4;
      for(let i=0;i<TEX_SS;i++) s += src[row+i*4];
    }
    out[y*TEX_W+x] = Math.round(s/(TEX_SS*TEX_SS));
  }
  return out;
}

/* ---------- gl ---------------------------------------------------- */
const canvas = document.getElementById("c");
const gl = canvas.getContext("webgl2", {antialias:false, alpha:false, depth:false,
                                        powerPreference:"high-performance"});
if(!gl){ document.body.innerHTML = "<p style='color:#666;font:14px system-ui;padding:2em'>WebGL2 required.</p>"; throw 0; }
const hasF16 = gl.getExtension("EXT_color_buffer_half_float") || gl.getExtension("EXT_color_buffer_float");

const VS = \`#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID<<1)&2, gl_VertexID&2);
  gl_Position = vec4(p*2.0-1.0, 0.0, 1.0);
}\`;

const COMMON = \`#version 300 es
precision highp float;
precision highp int;
out vec4 O;
uniform vec2 uRes;
/* Integer hash.  The float version this replaces was seeded with a step
   counter that grew without bound; once it passed a few thousand the
   mantissa ran out, the noise collapsed into vertical stripes and its mean
   drifted, so the type faded away over a couple of minutes.  This one is
   exact arithmetic and cannot drift no matter how long the page runs.   */
uint uhash(uvec2 p, uint s){
  uint h = p.x*374761393u + p.y*668265263u + s*362437u;
  h = (h ^ (h >> 13))*1274126177u;
  return h ^ (h >> 16);
}
float rnd(vec2 p, uint s){
  uvec2 u = uvec2(ivec2(floor(p)) + 100000);
  return float(uhash(u, s) & 0xFFFFFFu)*(1.0/16777216.0);
}
float rnd1(float k, uint s){ return rnd(vec2(k, 0.0), s); }
float s2l(float c){ return c<=0.04045 ? c/12.92 : pow((c+0.055)/1.055, 2.4); }
float l2s(float c){ c=max(c,0.0); return c<=0.0031308 ? c*12.92 : 1.055*pow(c,1.0/2.4)-0.055; }
\`;

const FS_SCENE = COMMON + \`
uniform vec2 uOrigin;      // device px of composition (0,0), y down
uniform float uScale;      // device px per composition px
uniform mat3 uRot;
uniform vec2 uP[8];        // projected vertices, composition px
uniform sampler2D uBG;
uniform float uCell, uBgLevel, uTrans, uEdgeW, uEdgeLvl, uBgOnly;
uniform float uIor, uF0, uBgZ, uAmb, uGainMax;
uniform float uTime, uNoiseHz, uGlitch, uGlitchHz, uBandH, uMaxShift, uDrop, uDropHz;
uniform vec4 uEnv;   // g1, p1, g2, p2
uniform vec2 uTexOrg;
uniform vec3 uLE;

const float CX=\${CX.toFixed(3)}, CY=\${CY.toFixed(3)}, SCL=\${SCL.toFixed(3)};
const float DCAM=\${DCAM.toFixed(5)};
const vec2  TEXN=vec2(\${TEX_W}.0,\${TEX_H}.0);
const float PD=\${(CUBE_A).toFixed(7)};   // half-edge = the cube's inradius
const ivec2 EDG[12] = ivec2[12](ivec2(0,1),ivec2(0,2),ivec2(0,4),ivec2(1,3),
                                ivec2(1,5),ivec2(2,3),ivec2(2,6),ivec2(3,7),
                                ivec2(4,5),ivec2(4,6),ivec2(5,7),ivec2(6,7));

float segd(vec2 p, vec2 a, vec2 b){
  vec2 d=b-a; float t=clamp(dot(p-a,d)/max(dot(d,d),1e-6),0.0,1.0);
  return length(p-a-t*d);
}

/* the pixelated type, stippled — sampled at a point on the backdrop plane
   expressed in composition coordinates                                    */
float plate(vec2 cp){
  vec2 cell = floor((cp - uTexOrg)/uCell);

  /* --- glitch, spoken in the plate's own language: whole cells, never
     sub-pixel.  Short bursts tear a few horizontal bands sideways by a
     handful of cells; between bursts the type sits perfectly still.     */
  float slot = floor(uTime*uGlitchHz);
  if(uGlitch > 0.0 && rnd1(slot, 7u) > 1.0 - 0.08*uGlitch){
    float band = floor(cell.y/uBandH + rnd1(slot, 19u)*8.0);
    if(rnd(vec2(band, slot), 23u) > 0.72)
      cell.x += floor((rnd(vec2(band, slot), 31u)*2.0 - 1.0)*uMaxShift*uGlitch);
  }

  if(any(lessThan(cell,vec2(0.0))) || any(greaterThanEqual(cell,TEXN))) return 0.0;
  float tv = texture(uBG, (cell+0.5)/TEXN).r;

  /* a few cells drop out each step — the type reads as though it is being
     redrawn rather than displayed                                        */
  float dq = floor(uTime*uDropHz);
  if(rnd(cell, uint(dq) + 101u) < uDrop) tv = 0.0;

  /* the stipple is one reference pixel, but never finer than a device pixel.
     Two multiplied uniforms — mean 1/4, density -ln(v) — which is what gives
     the plate its sparse, sooty grain rather than an even fizz.  Reseeded on
     a stepped clock so it boils instead of sitting still.                 */
  float sc = max(1.0, 1.0/uScale);
  vec2 q = floor(cp/sc);
  uint ns = uint(floor(uTime*uNoiseHz));
  float stip = rnd(q, ns) * rnd(q, ns + 4001u);
  return s2l(tv*uBgLevel*uAmb * stip);
}
vec2 toScreen(vec3 p){
  float f = 1.0/(1.0 - p.z/DCAM);
  return vec2(CX + SCL*p.x*f, CY - SCL*p.y*f);
}
/* the hidden key light, only ever seen by reflected / refracted rays */
float env(vec3 d){
  float dp = max(dot(d, uLE), 0.0);
  return uEnv.x*pow(dp,uEnv.y) + uEnv.z*pow(dp,uEnv.w);
}

void main(){
  vec2 sp = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 cp = (sp - uOrigin)/uScale;

  vec3 col = vec3(plate(cp));
  if(uBgOnly > 0.5){ O = vec4(col,1.0); return; }

  /* ---- cube -------------------------------------------------------- */
  vec3 ro = vec3(0.0,0.0,DCAM);
  vec3 rd = normalize(vec3((cp.x-CX)/SCL, -(cp.y-CY)/SCL, 0.0) - ro);

  /* the six face normals are just the rotation's own axes, both ways */
  vec3 nb[6];
  nb[0]= uRot[0]; nb[1]=-uRot[0];
  nb[2]= uRot[1]; nb[3]=-uRot[1];
  nb[4]= uRot[2]; nb[5]=-uRot[2];

  float tN=-1e9, tF=1e9; vec3 n1=vec3(0.0); bool bad=false;
  for(int i=0;i<6;i++){
    vec3 n=nb[i];
    float den=dot(n,rd), num=PD-dot(n,ro);
    if(abs(den)<1e-6){ if(num<0.0) bad=true; continue; }
    float t=num/den;
    if(den<0.0){ if(t>tN){ tN=t; n1=n; } }
    else       { if(t<tF){ tF=t; } }
  }

  if((!bad) && tN<tF && tF>0.0){
    vec3 p1 = ro + tN*rd;
    float c1 = clamp(dot(-rd,n1), 0.0, 1.0);
    /* the visible sheen falls off at grazing incidence: the far side of the
       body starts to occlude the reflected lobe                          */
    float F  = max(uF0 + (1.0-uF0)*c1, 0.0);

    /* front-surface reflection of the key light */
    float refl = env(reflect(rd,n1))*F;

    /* through the body: refract in, then bounce around inside until the ray
       finds a face it can leave through                                    */
    vec3 pos = p1, dir = refract(rd, n1, 1.0/uIor);
    for(int k=0;k<3;k++){
      float tOut = 1e9; vec3 no = -n1;
      for(int i=0;i<6;i++){
        float den = dot(nb[i], dir);
        if(den > 1e-6){
          float t = (PD - dot(nb[i], pos))/den;
          if(t > 1e-4 && t < tOut){ tOut = t; no = nb[i]; }
        }
      }
      pos += tOut*dir;
      vec3 o = refract(dir, -no, uIor);
      if(dot(o,o) > 0.5){ dir = o; break; }
      dir = reflect(dir, no);
    }

    /* where that exiting ray lands on the backdrop, and how much backdrop a
       single pixel now covers — the body is a lens, so it concentrates      */
    float tb = (-uBgZ - pos.z)/min(dir.z, -1e-3);
    vec2 bp = toScreen(pos + tb*dir);
    vec2 dx = dFdx(bp), dy = dFdy(bp);
    float jac = abs(dx.x*dy.y - dx.y*dy.x)*uScale*uScale;
    float gain = clamp(1.0/max(jac, 1e-4), 0.0, uGainMax);
    float through = plate(bp)*uTrans*gain;

    col = vec3(through + refl);
  }

  /* ---- wireframe -------------------------------------------------- */
  float dm=1e9;
  for(int i=0;i<12;i++) dm = min(dm, segd(cp, uP[EDG[i].x], uP[EDG[i].y]));
  float aa=max(0.9/uScale, 0.55);
  float line=1.0-smoothstep(uEdgeW*0.5-aa, uEdgeW*0.5+aa, dm);
  col += vec3(uEdgeLvl*line);

  O=vec4(col,1.0);
}\`;

const FS_BRIGHT = COMMON + \`
uniform sampler2D uT;
uniform float uThresh;
void main(){
  vec3 c = texture(uT, gl_FragCoord.xy/uRes).rgb;
  float l = dot(c, vec3(0.2126,0.7152,0.0722));
  float k = max(l-uThresh, 0.0)/max(l,1e-4);
  O = vec4(c*k, 1.0);
}\`;

const FS_BLUR = COMMON + \`
uniform sampler2D uT;
uniform vec2 uDir;
void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  vec3 s = texture(uT,uv).rgb*0.227027;
  vec2 d = uDir/uRes;
  s += (texture(uT,uv+d*1.3846).rgb + texture(uT,uv-d*1.3846).rgb)*0.316216;
  s += (texture(uT,uv+d*3.2308).rgb + texture(uT,uv-d*3.2308).rgb)*0.070270;
  O = vec4(s,1.0);
}\`;

const FS_DOWN = COMMON + \`
uniform sampler2D uT;
void main(){ O = vec4(texture(uT, gl_FragCoord.xy/uRes).rgb, 1.0); }\`;

const FS_RAYS = COMMON + \`
uniform sampler2D uT;
uniform vec2 uApex;                 // uv the shaft diverges from
uniform float uDensity, uDecay, uLod;
void main(){
  /* A diverging shaft: march back towards a virtual apex sitting behind
     the lit facet, so the beam fans out the way real light does, taking
     each step from a coarser mip so it softens as it travels.  The start
     is dithered per pixel or the 40 steps show up as banding.          */
  vec2 uv = gl_FragCoord.xy/uRes;
  vec2 d  = (uv - uApex)*(uDensity/40.0);
  float j = rnd(gl_FragCoord.xy, 5u);
  vec2 p  = uv - d*j;
  vec3 acc = vec3(0.0); float w = 1.0, tot = 0.0;
  for(int i=0;i<40;i++){
    acc += textureLod(uT, p, float(i)*uLod).rgb*w;
    tot += w;
    w *= uDecay;
    p -= d;
  }
  O = vec4(acc/max(tot,1e-4), 1.0);
}\`;


const FS_COMP = COMMON + \`
uniform sampler2D uScene, uB1, uB2, uRays;
uniform float uW1, uW2, uW3, uGrain, uTime, uNoiseHz;
void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  /* the halo sits square on the facet.  It used to be nudged along the
     light direction, which just produced a displaced copy of the lit face
     sitting beside it — the shaft carries the direction now.            */
  vec3 c = texture(uScene,uv).rgb
         + texture(uB1, uv).rgb*uW1
         + texture(uB2, uv).rgb*uW2
         + texture(uRays, uv).rgb*uW3;
  vec3 s = vec3(l2s(c.r), l2s(c.g), l2s(c.b));
  /* grain rides on the signal — the reference's blacks are perfectly clean */
  s *= 1.0 + (rnd(gl_FragCoord.xy*0.5, uint(floor(uTime*uNoiseHz)) + 77u) - 0.5)*uGrain;
  O = vec4(clamp(s,0.0,1.0),1.0);
}\`;

function sh(type,src){
  const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)+"\\n"+src);
  return s;
}
function prog(fs){
  const p=gl.createProgram();
  gl.attachShader(p,sh(gl.VERTEX_SHADER,VS)); gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u={}; const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);
  for(let i=0;i<n;i++){ const info=gl.getActiveUniform(p,i);
    const nm=info.name.replace(/\\[0\\]$/,""); u[nm]=gl.getUniformLocation(p,info.name); }
  return {p,u};
}

const P_SCENE=prog(FS_SCENE), P_BRIGHT=prog(FS_BRIGHT), P_BLUR=prog(FS_BLUR),
      P_DOWN=prog(FS_DOWN), P_RAYS=prog(FS_RAYS), P_COMP=prog(FS_COMP);
const vao=gl.createVertexArray(); gl.bindVertexArray(vao);

/* plate texture */
const plate = buildPlate();
const texBG = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texBG);
gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
gl.texImage2D(gl.TEXTURE_2D,0,gl.R8,TEX_W,TEX_H,0,gl.RED,gl.UNSIGNED_BYTE,plate);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

/* render targets */
const IFMT = hasF16 ? gl.RGBA16F : gl.RGBA8;
const ITYP = hasF16 ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
function makeRT(w,h){
  const t=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texImage2D(gl.TEXTURE_2D,0,IFMT,w,h,0,gl.RGBA,ITYP,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const f=gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER,f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
  return {t,f,w,h};
}
let RT=null, W=0, H=0, DPR=1, fitScale=1, originX=0, originY=0;

function resize(){
  DPR = Math.min(window.devicePixelRatio||1, 2);
  const cw = canvas.clientWidth || window.innerWidth;
  const ch = canvas.clientHeight || window.innerHeight;
  const w = Math.max(2,Math.round(cw*DPR)), h = Math.max(2,Math.round(ch*DPR));
  if(w===W && h===H) return;
  W=w; H=h; canvas.width=W; canvas.height=H;
  const q1=Math.max(2,W>>1), r1=Math.max(2,H>>1);   // core: half res, so a
  const q2=Math.max(2,W>>3), r2=Math.max(2,H>>3);   // tight blur stays smooth
  if(RT){ for(const k in RT){ gl.deleteTexture(RT[k].t); gl.deleteFramebuffer(RT[k].f); } }
  RT={ scene:makeRT(W,H), a:makeRT(q1,r1), b:makeRT(q1,r1),
       c:makeRT(q2,r2), d:makeRT(q2,r2), e:makeRT(q2,r2) };
  // fit the 960x720 composition: fill the height, never crop the type
  fitScale = Math.min(H/COMP_H, W/934);
  originX = (W - COMP_W*fitScale)*0.5;
  originY = (H - COMP_H*fitScale)*0.5;
}

/* ---------- pointer: drag to throw it, move to orbit ----------------- */
const drag = {on:false, x:0, y:0, yaw:0, pitch:0, vy:0, vp:0, hx:0, hy:0, tx:0, ty:0};
canvas.style.cursor = "grab";
canvas.style.touchAction = "none";
canvas.addEventListener("pointerdown", e=>{
  drag.on = true; drag.x = e.clientX; drag.y = e.clientY;
  drag.vy = drag.vp = 0;
  canvas.setPointerCapture(e.pointerId);
  canvas.style.cursor = "grabbing";
});
const release = ()=>{ drag.on = false; canvas.style.cursor = "grab"; };
canvas.addEventListener("pointerup", release);
canvas.addEventListener("pointercancel", release);
canvas.addEventListener("pointermove", e=>{
  const r = canvas.getBoundingClientRect();
  drag.tx = ((e.clientX-r.left)/r.width)*2 - 1;      // -1 .. 1
  drag.ty = ((e.clientY-r.top)/r.height)*2 - 1;
  if(!drag.on) return;
  drag.vy = (e.clientX-drag.x)*0.0060;
  drag.vp = (e.clientY-drag.y)*0.0060;
  drag.yaw += drag.vy; drag.pitch += drag.vp;
  drag.x = e.clientX; drag.y = e.clientY;
});
function orbit(dt){
  if(!drag.on){                            // let a throw run down
    drag.yaw += drag.vy; drag.pitch += drag.vp;
    const k = Math.pow(0.94, dt*60);
    drag.vy *= k; drag.vp *= k;
  }
  const e = 1.0 - Math.pow(0.92, dt*60);   // ease the hover parallax
  drag.hx += (drag.tx - drag.hx)*e;
  drag.hy += (drag.ty - drag.hy)*e;
}

/* ---------- maths -------------------------------------------------- */
function rotMat(t){
  const th = THETA0 + OMEGA*t;
  const yaw = drag.yaw + drag.hx*0.42;
  const pit = drag.pitch + drag.hy*0.26 + TILT;
  const cz=Math.cos(th), sz=Math.sin(th);
  const cb=Math.cos(pit), sb=Math.sin(pit);
  const cy=Math.cos(yaw), sy=Math.sin(yaw);
  // R = Ry(yaw) * Rx(pitch) * Rz(th), column-major for gl
  return [
     cy*cz + sy*sb*sz,   cb*sz,   -sy*cz + cy*sb*sz,
    -cy*sz + sy*sb*cz,   cb*cz,    sy*sz + cy*sb*cz,
     sy*cb,             -sb,       cy*cb
  ];
}
function applyRot(m,v){
  return [ m[0]*v[0]+m[3]*v[1]+m[6]*v[2],
           m[1]*v[0]+m[4]*v[1]+m[7]*v[2],
           m[2]*v[0]+m[5]*v[1]+m[8]*v[2] ];
}
/* how strongly the body is catching the key light right now — used to wash
   the same light over the backdrop                                        */
/* how hard the body is catching the key light, and where on screen the
   brightest facet sits — the shafts have to radiate from that point      */
const flash = {amount:0, cx:CX, cy:CY};
function flashAmount(m){
  let s = 0, best = 0;
  flash.cx = CX; flash.cy = CY;
  for(let i=0;i<FACE_N.length;i++){
    const n = applyRot(m, FACE_N[i]);
    if(n[2] <= 0) continue;                 // only faces turned towards us
    const d = -2*n[2];                      // view ray (0,0,-1) reflected
    const r = [-d*n[0], -d*n[1], -1-d*n[2]];
    const dp = Math.max(r[0]*LE[0]+r[1]*LE[1]+r[2]*LE[2], 0);
    const e = P.envG1*Math.pow(dp,P.envP1) + P.envG2*Math.pow(dp,P.envP2);
    const lit = n[2]*Math.min(e, 1);        // radiance x projected area
    s += lit;
    if(lit > best){                         // face centre -> screen
      best = lit;
      const c = [n[0]*CUBE_A, n[1]*CUBE_A, n[2]*CUBE_A];
      const f = 1.0/(1.0 - KP*c[2]);
      flash.cx = CX + SCL*c[0]*f;
      flash.cy = CY - SCL*c[1]*f;
    }
  }
  flash.amount = s;
  return s;
}

const projBuf = new Float32Array(16);
function project(m){
  for(let i=0;i<8;i++){
    const p=applyRot(m,VERTS[i]);
    const f=1.0/(1.0-KP*p[2]);
    projBuf[i*2]   = CX + SCL*p[0]*f;
    projBuf[i*2+1] = CY - SCL*p[1]*f;
  }
  return projBuf;
}

/* ---------- draw ---------------------------------------------------- */
function pass(pr, target, setup){
  gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.f : null);
  const w = target ? target.w : W, h = target ? target.h : H;
  gl.viewport(0,0,w,h);
  gl.useProgram(pr.p);
  gl.uniform2f(pr.u.uRes, w, h);
  if(setup) setup(pr.u);
  gl.drawArrays(gl.TRIANGLES,0,3);
}
function bindTex(unit, tex, loc){
  gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniform1i(loc, unit);
}

let startT = performance.now();
let frozen = null;                         // deterministic time for capture
if(qs.has("t")) frozen = parseFloat(qs.get("t"));

let prevNow = 0;
function frame(now){
  resize();
  const dt = prevNow ? Math.min((now-prevNow)/1000, 0.05) : 0.016;
  prevNow = now;
  orbit(dt);
  const t = frozen!==null ? frozen : (now - startT)/1000;
  const m = rotMat(t);
  const pv = project(m);

  pass(P_SCENE, RT.scene, u=>{
    gl.uniform2f(u.uOrigin, originX, originY);
    gl.uniform1f(u.uScale, fitScale);
    gl.uniformMatrix3fv(u.uRot, false, m);
    gl.uniform2fv(u.uP, pv);
    gl.uniform2f(u.uTexOrg, TEX_ORG[0], TEX_ORG[1]);
    gl.uniform1f(u.uCell, P.cell);
    gl.uniform1f(u.uBgLevel, P.bgLevel);
    gl.uniform1f(u.uTrans, P.trans);
    gl.uniform4f(u.uEnv, P.envG1, P.envP1, P.envG2, P.envP2);
    gl.uniform1f(u.uIor, P.ior);
    gl.uniform1f(u.uF0, P.f0);
    gl.uniform1f(u.uBgZ, P.bgZ);
    gl.uniform1f(u.uGainMax, P.gainMax);
    gl.uniform1f(u.uAmb, P.ambBase + P.ambGain*flashAmount(m));
    gl.uniform1f(u.uEdgeW, P.edgeW);
    gl.uniform1f(u.uEdgeLvl, P.edgeLvl);
    gl.uniform1f(u.uBgOnly, P.bgOnly);
    gl.uniform1f(u.uTime, t);
    gl.uniform1f(u.uNoiseHz, P.noiseHz);
    gl.uniform1f(u.uGlitch, P.glitch);
    gl.uniform1f(u.uGlitchHz, P.glitchHz);
    gl.uniform1f(u.uBandH, P.bandH);
    gl.uniform1f(u.uMaxShift, P.maxShift);
    gl.uniform1f(u.uDrop, P.drop);
    gl.uniform1f(u.uDropHz, P.dropHz);
    gl.uniform3f(u.uLE, LE[0], LE[1], LE[2]);
    bindTex(0, texBG, u.uBG);
  });
  pass(P_BRIGHT, RT.a, u=>{ bindTex(0, RT.scene.t, u.uT); gl.uniform1f(u.uThresh, P.bloomT); });
  pass(P_BLUR, RT.b, u=>{ bindTex(0, RT.a.t, u.uT); gl.uniform2f(u.uDir, P.blurStep1,0); });
  pass(P_BLUR, RT.a, u=>{ bindTex(0, RT.b.t, u.uT); gl.uniform2f(u.uDir, 0,P.blurStep1); });
  pass(P_DOWN, RT.c, u=>{ bindTex(0, RT.a.t, u.uT); });
  pass(P_BLUR, RT.d, u=>{ bindTex(0, RT.c.t, u.uT); gl.uniform2f(u.uDir, P.blurStep2,0); });
  pass(P_BLUR, RT.c, u=>{ bindTex(0, RT.d.t, u.uT); gl.uniform2f(u.uDir, 0,P.blurStep2); });
  /* light shafts: smear the small bright level radially away from the lit
     facet, then soften the result so the streaks read as beams not spokes */
  gl.bindTexture(gl.TEXTURE_2D, RT.c.t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);
  pass(P_RAYS, RT.d, u=>{
    bindTex(0, RT.c.t, u.uT);
    /* apex = the lit facet pushed back down the light direction, so the
       shaft opens out from behind the face towards the light            */
    const L = Math.hypot(LE[0], LE[1]) || 1;
    const fx = originX + flash.cx*fitScale, fy = originY + flash.cy*fitScale;
    gl.uniform2f(u.uApex, fx/W - LE[0]/L*P.rayApex,
                          (1.0 - fy/H) - LE[1]/L*P.rayApex);
    gl.uniform1f(u.uDensity, P.rayDensity);
    gl.uniform1f(u.uDecay, P.rayDecay);
    gl.uniform1f(u.uLod, P.rayLod);
  });
  pass(P_BLUR, RT.e, u=>{ bindTex(0, RT.d.t, u.uT); gl.uniform2f(u.uDir, 1.0,0); });
  pass(P_BLUR, RT.d, u=>{ bindTex(0, RT.e.t, u.uT); gl.uniform2f(u.uDir, 0,1.0); });
  pass(P_COMP, null, u=>{
    bindTex(0, RT.scene.t, u.uScene);
    bindTex(1, RT.a.t, u.uB1);
    bindTex(2, RT.c.t, u.uB2);
    bindTex(3, RT.d.t, u.uRays);
    gl.uniform1f(u.uW1, P.bloom1);
    gl.uniform1f(u.uW2, P.bloom2);
    gl.uniform1f(u.uW3, P.rays);
    gl.uniform1f(u.uGrain, P.grain);
    gl.uniform1f(u.uTime, t);
    gl.uniform1f(u.uNoiseHz, P.noiseHz);
  });
  window.__ready = true;
  requestAnimationFrame(frame);
}
resize();
requestAnimationFrame(frame);
<\/script>
</body>
</html>
`,T=["cube","triangle","hexagon","pentagon"],b={cube:"CUBE",triangle:"TRIANGLE",hexagon:"HEXAGON",pentagon:"PENTAGON"};function e(t,o,s,r){const n=t.replace(o,s);if(n===t)throw new Error(`365 shape adapter could not replace ${r}.`);return n}const y=String.raw`/* Variant geometry is derived at runtime while the canonical source stays byte-exact. */
const MAX_VERTS = 12, MAX_PLANES = 8, MAX_EDGES = 18;
const SHAPE_WORD = __SHAPE_WORD__;

function cubeShape(){
  const r = 0.760;
  const a = r/Math.sqrt(3);
  const vertices = [];
  for(let i=0;i<8;i++) vertices.push([(i&1?1:-1)*a,(i&2?1:-1)*a,(i&4?1:-1)*a]);
  const normals = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  return {
    vertices,
    planes: normals.map(normal=>({normal,distance:a,center:normal.map(v=>v*a)})),
    edges: [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]],
  };
}

function prismShape(sides, radius, depth){
  const vertices = [];
  const edges = [];
  const phase = Math.PI/2;
  for(let layer=0;layer<2;layer++){
    const z = layer ? depth : -depth;
    for(let i=0;i<sides;i++){
      const angle = phase + i*Math.PI*2/sides;
      vertices.push([Math.cos(angle)*radius,Math.sin(angle)*radius,z]);
    }
  }
  for(let i=0;i<sides;i++){
    const next = (i+1)%sides;
    edges.push([i,next],[i+sides,next+sides],[i,i+sides]);
  }
  const apothem = radius*Math.cos(Math.PI/sides);
  const planes = [
    {normal:[0,0,1],distance:depth,center:[0,0,depth]},
    {normal:[0,0,-1],distance:depth,center:[0,0,-depth]},
  ];
  for(let i=0;i<sides;i++){
    const angle = phase + (i+0.5)*Math.PI*2/sides;
    const normal = [Math.cos(angle),Math.sin(angle),0];
    planes.push({normal,distance:apothem,center:[normal[0]*apothem,normal[1]*apothem,0]});
  }
  return {vertices,planes,edges};
}

const SHAPE = SHAPE_VARIANT === "triangle" ? prismShape(3,0.75,0.34)
  : SHAPE_VARIANT === "hexagon" ? prismShape(6,0.60,0.36)
  : SHAPE_VARIANT === "pentagon" ? prismShape(5,0.62,0.36)
  : cubeShape();
const VERTS = SHAPE.vertices;
const FACE_N = SHAPE.planes.map(face=>face.normal);
const FACE_C = SHAPE.planes.map(face=>face.center);
const PLANE_D = SHAPE.planes.map(face=>face.distance);
const EDGES = SHAPE.edges;`,x=String.raw`function buildPlate(){
  const W = TEX_W*TEX_SS, H = TEX_H*TEX_SS;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d", {willReadFrequently:true});
  g.fillStyle = "#000"; g.fillRect(0,0,W,H);
  const fontSize = SHAPE_WORD.length > 7 ? 188 : SHAPE_WORD.length > 5 ? 210 : 244;
  g.fillStyle = "#fff";
  g.font = "700 " + fontSize + "px Arial, Helvetica, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  g.fillText(SHAPE_WORD, W*0.5, H*0.585, W*0.82);
  const src = g.getImageData(0,0,W,H).data;
  const out = new Uint8Array(TEX_W*TEX_H);
  for(let y=0;y<TEX_H;y++) for(let x=0;x<TEX_W;x++){
    let s=0;
    for(let j=0;j<TEX_SS;j++){
      const row=((y*TEX_SS+j)*W + x*TEX_SS)*4;
      for(let i=0;i<TEX_SS;i++) s += src[row+i*4];
    }
    out[y*TEX_W+x] = Math.round(s/(TEX_SS*TEX_SS));
  }
  return out;
}

/* ---------- gl ---------------------------------------------------- */`,P=String.raw`uniform vec2 uP[12];       // projected vertices, composition px
uniform vec3 uPlaneN[8];   // rotated convex-hull plane normals
uniform float uPlaneD[8];
uniform ivec2 uEdges[18];
uniform int uVertexCount, uPlaneCount, uEdgeCount;`,S=String.raw`  /* ---- selected convex glass solid -------------------------------- */
  vec3 ro = vec3(0.0,0.0,DCAM);
  vec3 rd = normalize(vec3((cp.x-CX)/SCL, -(cp.y-CY)/SCL, 0.0) - ro);

  float tN=-1e9, tF=1e9; vec3 n1=vec3(0.0); bool bad=false;
  for(int i=0;i<8;i++){
    if(i>=uPlaneCount) break;
    vec3 n=uPlaneN[i];
    float den=dot(n,rd), num=uPlaneD[i]-dot(n,ro);
    if(abs(den)<1e-6){ if(num<0.0) bad=true; continue; }
    float t=num/den;
    if(den<0.0){ if(t>tN){ tN=t; n1=n; } }
    else       { if(t<tF){ tF=t; } }
  }

  if((!bad)`,_=String.raw`      for(int i=0;i<8;i++){
        if(i>=uPlaneCount) break;
        float den = dot(uPlaneN[i], dir);
        if(den > 1e-6){
          float t = (uPlaneD[i] - dot(uPlaneN[i], pos))/den;
          if(t > 1e-4 && t < tOut){ tOut = t; no = uPlaneN[i]; }
        }
      }`,R=String.raw`function flashAmount(m){
  let s = 0, best = 0;
  flash.cx = CX; flash.cy = CY;
  for(let i=0;i<FACE_N.length;i++){
    const n = applyRot(m, FACE_N[i]);
    if(n[2] <= 0) continue;
    const d = -2*n[2];
    const r = [-d*n[0], -d*n[1], -1-d*n[2]];
    const dp = Math.max(r[0]*LE[0]+r[1]*LE[1]+r[2]*LE[2], 0);
    const e = P.envG1*Math.pow(dp,P.envP1) + P.envG2*Math.pow(dp,P.envP2);
    const lit = n[2]*Math.min(e, 1);
    s += lit;
    if(lit > best){
      best = lit;
      const c = applyRot(m, FACE_C[i]);
      const f = 1.0/(1.0 - KP*c[2]);
      flash.cx = CX + SCL*c[0]*f;
      flash.cy = CY - SCL*c[1]*f;
    }
  }
  flash.amount = s;
  return s;
}`,w=String.raw`const projBuf = new Float32Array(MAX_VERTS*2);
const planeNBuf = new Float32Array(MAX_PLANES*3);
const planeDBuf = new Float32Array(MAX_PLANES);
const edgeBuf = new Int32Array(MAX_EDGES*2);
for(let i=0;i<MAX_PLANES;i++) planeDBuf[i] = i<PLANE_D.length ? PLANE_D[i] : 0;
for(let i=0;i<MAX_EDGES;i++){
  edgeBuf[i*2] = i<EDGES.length ? EDGES[i][0] : 0;
  edgeBuf[i*2+1] = i<EDGES.length ? EDGES[i][1] : 0;
}
function project(m){
  for(let i=0;i<MAX_VERTS;i++){
    const p=i<VERTS.length ? applyRot(m,VERTS[i]) : [0,0,0];
    const f=1.0/(1.0-KP*p[2]);
    projBuf[i*2]   = CX + SCL*p[0]*f;
    projBuf[i*2+1] = CY - SCL*p[1]*f;
  }
  return projBuf;
}
function projectPlanes(m){
  for(let i=0;i<MAX_PLANES;i++){
    const n=i<FACE_N.length ? applyRot(m,FACE_N[i]) : [0,0,0];
    planeNBuf[i*3]=n[0]; planeNBuf[i*3+1]=n[1]; planeNBuf[i*3+2]=n[2];
  }
  return planeNBuf;
}`;function A(t,o,s){const r=T.includes(o)?o:"cube";let n=e(t,'"use strict";',`"use strict";
const SHAPE_VARIANT = ${JSON.stringify(r)};`,"variant declaration");return n=e(n,/\/\* A cube sized[\s\S]*?const FACE_N = \[\[1,0,0\],[\s\S]*?\];/,y.replace("__SHAPE_WORD__",JSON.stringify(b[r])),"shape geometry"),n=e(n,/function buildPlate\(\)\{[\s\S]*?\n\}\n\n\/\* ---------- gl ---------------------------------------------------- \*\//,x,"shape word plate"),n=e(n,/uniform mat3 uRot;\nuniform vec2 uP\[8\];[^\n]*/,P,"shape uniforms"),n=e(n,/const float PD=[\s\S]*?ivec2\(6,7\)\);/,"","cube shader constants"),n=e(n,/  \/\* ---- cube[\s\S]*?\n\n  if\(\(!bad\)/,S,"convex intersection"),n=e(n,/      for\(int i=0;i<6;i\+\+\)\{[\s\S]*?\n      \}/,_,"convex refraction exit"),n=e(n,"  for(int i=0;i<12;i++) dm = min(dm, segd(cp, uP[EDG[i].x], uP[EDG[i].y]));","  for(int i=0;i<18;i++){ if(i>=uEdgeCount) break; dm = min(dm, segd(cp, uP[uEdges[i].x], uP[uEdges[i].y])); }","shape wireframe"),n=e(n,/function flashAmount\(m\)\{[\s\S]*?\n\}/,R,"shape lighting"),n=e(n,/const projBuf = new Float32Array\(16\);[\s\S]*?\n\}/,w,"shape projection"),n=e(n,"  const pv = project(m);",`  const pv = project(m);
  const pn = projectPlanes(m);`,"plane projection call"),n=e(n,`    gl.uniformMatrix3fv(u.uRot, false, m);
    gl.uniform2fv(u.uP, pv);`,`    gl.uniform2fv(u.uP, pv);
    gl.uniform3fv(u.uPlaneN, pn);
    gl.uniform1fv(u.uPlaneD, planeDBuf);
    gl.uniform2iv(u.uEdges, edgeBuf);
    gl.uniform1i(u.uVertexCount, VERTS.length);
    gl.uniform1i(u.uPlaneCount, FACE_N.length);
    gl.uniform1i(u.uEdgeCount, EDGES.length);`,"shape uniform upload"),s&&(n=e(n,"let frozen = null;","let frozen = 0;","reduced motion freeze")),n}function Q({variant:t="cube",className:o=""}){const s=a.useRef(null),r=a.useRef(!0),[n,g]=a.useState(!0),[u,f]=a.useState(!1),[c,p]=a.useState(()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),m=a.useMemo(()=>A(E,t,c),[c,t]);return a.useEffect(()=>{const l=s.current;if(!l)return;const i=()=>g(r.current&&document.visibilityState!=="hidden"),d=new IntersectionObserver(([v])=>{r.current=v.isIntersecting,i()},{rootMargin:"80px"});return d.observe(l),document.addEventListener("visibilitychange",i),()=>{d.disconnect(),document.removeEventListener("visibilitychange",i)}},[]),a.useEffect(()=>{const l=window.matchMedia("(prefers-reduced-motion: reduce)"),i=()=>p(l.matches);return l.addEventListener("change",i),i(),()=>l.removeEventListener("change",i)},[]),a.useEffect(()=>{f(!1)},[n,c,t]),h.jsx("div",{ref:s,className:`tetrahedron-365${o?` ${o}`:""}`,"data-state":n?u?"ready":"loading":"paused",children:n?h.jsx("iframe",{className:`tetrahedron-365__frame${u?" is-ready":""}`,title:`Interactive 365 ${t}`,srcDoc:m,sandbox:"allow-scripts",loading:"eager",onLoad:()=>f(!0)},`${t}-${c?"reduced":"animated"}`):null})}export{Q as Tetrahedron365};
