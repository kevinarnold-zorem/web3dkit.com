import{r as i,j as d}from"./index-fOQwe-l-.js";import{b as h,L as v}from"./LandingPages-plHUvg-e.js";import"./SylvaLivingWorldScene-OThUX2Jj.js";const m=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Emberline Bloom — fluorescent flower background</title>
<meta name="description" content="A field of hairline filaments closed into a flower: fluted petals turning slowly under a moon, magenta at the heart, mint along every rim, and a cool sheen banding the blades the light reaches.">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#05030c">
<style>
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #05030c;
    overflow: hidden;
  }
  /* the authored 1.4s reveal, kept: the canvas fades up once the first frame
     has been composited rather than snapping on mid-warm-up */
  #gl {
    position: fixed;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1.4s ease;
  }
  #gl.on { opacity: 1 }
</style>
</head>
<body>
<!--
  Emberline Bloom — the field closed into a flower: the curve index is cut into
  petals and arcs, and the heart glow, the fluorescent rim and the moonlight all
  fall out of the authored intensity math rather than being painted on.

  Everything that draws below is lifted out of the authored Emberline hero
  (public/landing-pages/emberline-hero.html): the curve buffer layout, the
  line/bead/web/star intensity math, the six-level bloom chain, the composite
  with its vignette and dither, the sizing rig and the frame loop. This scene's
  own regions are the P tunables, its extra uniforms, curvePos, the four palettes
  and the composite sky. Regenerate with:

      node scripts/build-emberline-scenes.mjs bloom
-->
<canvas id="gl" aria-hidden="true"></canvas>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>

<script>
/* ------------------------------------------------------------------
   Vortex line field
------------------------------------------------------------------ */
(function(){
  const canvas = document.getElementById('gl');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:false, powerPreference:'high-performance'});
  renderer.setClearColor(0x000000, 1);
  renderer.outputEncoding = THREE.LinearEncoding;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 800);

  /* ---------------- tunables ---------------- */
  const P = {
    curves:780, samples:190,
    r0:0.16, layers:2, jit:0.55,       // an inner rank of petals and an outer one
    /* V is reused as the rim gain that becomes vOut; b, A, shell, crown* and
       root* belong to the catenoid the authored page draws and are unused here,
       kept so the uniform rig builds unchanged */
    V:5.2, b:1.47, A:0.640, shell:0.35, clampI:6.4, dimLo:0.12, knee:1.00, flat:0.20, cap:0.38,
    crownR:5.00, crownPow:1.35, crownInner:0.32,
    Vd:10.8, trunkB:1.90, capDn:0.12, trunkTurb:0.34,
    rootStart:3.4, rootR:3.20, rootPow:1.55,
    twist:1.40, twistL:0.12, rot:0.045,
    t1:0.07, t2:0.035, t3:0.035, t3r:0.010,
    f1:0.520, f2:0.940, f3:0.180, tw:1.4, twBase:0.35,
    inten:0.440, dens:1.30, densK:1.15, fog:0.020, gainP:2.6, gainA:1.50, gainB:0.24,
    beadI:0.70, webI:0.06, starI:0.62, starRot:0.014, starLeft:0.0,

    /* the flower: petals per whorl, the reach of an inner and an outer petal,
       and a petal's half width at its widest */
    petals:6.0, lenInner:1.55, lenOuter:2.60, wide:0.470,
    /* the receptacle the petals are attached to — nothing starts at a point —
       how the rib runs out from it, how the petal widens along it, how much of
       its opening the petal already has at the base, and how hard the edge ribs
       are cut back to round the tip */
    hub:0.16, radPow:1.35, widePow:0.85, baseOpen:0.18, lobePow:0.75,
    /* the lift away from the heart, its exponent, how much more of it the
       inner rank keeps of it, and the sag that hollows each petal */
    lift:2.05, liftPow:0.95, liftInner:0.85, sag:0.10,
    /* the edge curl, its exponent, and the speed and depth of the breath */
    curl:0.75, curlPow:2.10, sway:0.42, swayAmp:0.055,
    /* the fluting across a blade: how many folds and how deep. It is what gives
       the moonlight something to catch, so a petal is not one flat highlight */
    veinFolds:9.0, veinDepth:0.030,
    /* the moon: its bearing and elevation off the view axis, then how the light
       it casts is fitted to the shared asymmetry ramp, and how narrow and how
       strong the specular sheen riding on top of it is */
    moonAz:0.85, moonEl:0.18, specBias:0.16, specGain:2.60, sheenPow:4.0, sheenAmt:0.68,
    speed:1.0,                         // the rate the scene clock runs at

    camX:0.0, camY:5.70, camZ:4.60, tgtX:0.0, tgtY:1.05, tgtZ:0.0, fov:46,
    bloomS:0.88, bloomR:1.05, bloomT:0.30, vig:0.56,
    orbAz:0.55, orbEl:0.28,
  };  if(Math.min(window.innerWidth, window.innerHeight) < 760 || window.innerWidth < 900) P.curves = 380;

  const U = {
    uTime:{value:0},
    uR0:{value:P.r0}, uTwist:{value:P.twist}, uRot:{value:P.rot}, uTwistL:{value:P.twistL},
    uGeoA:{value:new THREE.Vector3(P.curves,P.layers,P.jit)},
    uGeoB:{value:new THREE.Vector3(P.V,P.b,P.A)},
    uGeoC:{value:new THREE.Vector3(P.shell,P.clampI,0)},
    uGeoD:{value:new THREE.Vector3(P.Vd,P.trunkB,P.capDn)},
    uGeoE:{value:new THREE.Vector2(P.trunkTurb,P.crownInner)},
    uGeoF:{value:new THREE.Vector2(P.crownR,P.crownPow)},
    uRoot:{value:new THREE.Vector3(P.rootStart,P.rootR,P.rootPow)},
    uAsym:{value:new THREE.Vector2(P.dimLo,P.knee)},
    uAsym2:{value:new THREE.Vector2(P.flat,P.cap)},
    uT:{value:new THREE.Vector4(P.t1,P.t2,P.t3,P.t3r)},
    uF:{value:new THREE.Vector4(P.f1,P.f2,P.f3,P.tw)},
    uTw2:{value:new THREE.Vector2(P.twBase,0)},
    uInt:{value:P.inten}, uDens:{value:new THREE.Vector3(P.dens,P.densK,P.fog)},
    uGain:{value:new THREE.Vector3(P.gainP,P.gainA,P.gainB)},
    uPetal:{value:new THREE.Vector4(P.petals,P.lenInner,P.lenOuter,P.wide)},
    uShape:{value:new THREE.Vector4(P.radPow,P.widePow,P.lobePow,P.hub)},
    uOpen:{value:P.baseOpen},
    uLift:{value:new THREE.Vector4(P.lift,P.liftPow,P.liftInner,P.sag)},
    uCurl:{value:new THREE.Vector4(P.curl,P.curlPow,P.sway,P.swayAmp)},
    uFit:{value:1},
    uMoonDir:{value:new THREE.Vector3()},
    uSpec:{value:new THREE.Vector4(P.specBias,P.specGain,P.sheenPow,P.sheenAmt)},
    uVein:{value:new THREE.Vector2(P.veinFolds,P.veinDepth)},
  };

  const COMMON = \`
  #define TAU 6.28318530718
  uniform float uTime;
  uniform float uR0, uTwist, uRot, uTwistL;
  uniform vec3  uGeoA;  // curves, layers, jitter
  uniform vec3  uGeoB;  // V, b, A
  uniform vec3  uGeoC;  // shell, clampI, -
  uniform vec3  uGeoD;  // Vdown, trunkB, capDown
  uniform vec2  uGeoE;  // trunk turbulence damping, -
  uniform vec2  uGeoF;  // crown radius, crown spread exponent
  uniform vec3  uRoot;  // root start depth, root radius, root spread exponent
  uniform vec2  uAsym;  // lowGain, knee
  uniform vec2  uAsym2; // flat, cap
  uniform vec4  uT, uF;
  uniform vec2  uTw2; // base turbulence weight at axis, -
  uniform float uInt;
  uniform vec3  uDens, uGain;
  uniform vec4  uPetal;  // petals per whorl, inner reach, outer reach, half angle
  uniform vec4  uShape;  // rib exponent, widening exponent, edge cut-back, receptacle
  uniform float uOpen;   // how much of its opening a petal already has at the base
  uniform vec4  uLift;   // lift, lift exponent, inner-whorl share, sag
  uniform vec4  uCurl;   // edge curl, curl exponent, breath speed, breath depth
  uniform float uFit;    // how much of the narrow-frame camera pull-back to give back
  uniform vec3  uMoonDir;// the direction the moonlight arrives from
  uniform vec4  uSpec;   // light bias, light gain, sheen exponent, sheen strength
  uniform vec2  uVein;   // folds across a blade, and their depth

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float sinh_(float x){ return 0.5*(exp(x)-exp(-x)); }
  float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; p*=p+p; return fract(p); }

  vec3 turbulence(vec3 p, float R){
    float t = uTime;
    float w = uTw2.x + (1.0-uTw2.x)*R/(R+uF.w);
    vec3 q1 = p*uF.x + vec3(0.0, -t*0.052, 4.7);
    vec3 d1 = vec3(snoise(q1), snoise(q1+vec3(31.4,17.2,9.1)), snoise(q1+vec3(-13.7,45.3,22.8)));
    vec3 q2 = p*uF.y + vec3(t*0.062, 0.0, -2.3);
    vec3 d2 = vec3(snoise(q2), snoise(q2+vec3(7.7,3.3,21.9)), snoise(q2+vec3(19.1,-8.4,5.5)));
    vec3 q3 = p*uF.z + vec3(-1.9, -t*0.038, 0.6);
    vec3 d3 = vec3(snoise(q3), snoise(q3+vec3(51.4,-7.2,3.1)), snoise(q3+vec3(3.7,15.3,-42.8)));
    return (d1*uT.x + d2*uT.y)*w + d3*(uT.z + R*uT.w);
  }

  float cosh_(float x){ return 0.5*(exp(x)+exp(-x)); }
  float tanh_(float x){ float e=exp(2.0*x); return (e-1.0)/(e+1.0); }

  // catenoid "trumpet" of revolution, one curve per meridian, twisted like a vortex
  /* one point on one petal — t from the receptacle to the tip, k across the
     blade. It is factored out of curvePos so the surface normal can be taken by
     finite difference, which is what lets the moon actually light the flower
     rather than the lighting being painted on. */
  vec3 petalPoint(float phi0, float wl, float h2, float t, float k){
    float len  = mix(uPetal.y, uPetal.z, wl);
    /* the petal is opened as an angle, not as a width: at well under half the
       spacing between petals they stay separate however far out they reach, and
       the opening is still wide at the tip so the blade ends blunt. It keeps
       part of that opening at the base, so the ribs leave the receptacle as a
       band rather than converging on one point. */
    float ang  = uPetal.w*mix(0.74, 1.0, wl)
               * (uOpen*(1.0-t) + (1.0-uOpen)*pow(sin(3.14159265*pow(t, uShape.y)), 0.72));
    /* ribs near the edge of a petal stop short, which rounds the tip off
       without the outline ever being drawn */
    float lobe = 0.42 + 0.58*pow(sin(3.14159265*k), uShape.z);
    float rad  = uShape.w + (len - uShape.w)*lobe*pow(t, uShape.x);
    float th   = phi0 + (k-0.5)*2.0*ang;

    /* the petal lifts away from the heart, hollows in the middle, curls its
       edges back up over the last stretch, and is fluted across the blade */
    float y = uLift.x*pow(t, uLift.y)*mix(uLift.z, 1.0, wl)
            - uLift.w*sin(3.14159265*t)*mix(1.0, 0.45, wl);
    y += uCurl.x*(k-0.5)*(k-0.5)*4.0*pow(t, uCurl.y);
    y += uVein.y*sin(k*uVein.x*3.14159265)*pow(t, 1.30)*mix(0.55, 1.0, wl);

    // one slow breath per rib, so the head never sits perfectly still
    float sway = sin(uTime*uCurl.z + h2*TAU + wl*2.1);
    rad *= 1.0 + uCurl.w*sway*t;
    y   += uCurl.w*sway*t*0.45;

    /* the authored sizing rig pulls the camera back on a narrow frame, which is
       right for a tall subject and far too much for a wide one — the head is
       grown back by most of that so it keeps its place in the frame */
    rad *= uFit; y *= uFit;
    return vec3(rad*cos(th), y, rad*sin(th));
  }

  /* one rib across one petal. The authored page runs its curves along the
     surface; here they run across it, so a petal is drawn as a stack of arcs
     whose ends trace the blade — which is what makes it read as a petal rather
     than as a spray of strands leaving one point. */
  vec3 curvePos(float ci, float u, out float baseR, out float vOut){
    float fi    = ci*uGeoA.x;                      // curve index
    float NL    = uGeoA.y;                         // whorls
    float whorl = floor(mod(fi, NL));
    float idx   = floor(fi/NL);
    float nIdx  = uGeoA.x/NL;
    float wl    = whorl/max(NL-1.0,1.0);           // 0 at the heart .. 1 outermost
    float h1    = hash11(fi*1.37+3.1);
    float h2    = hash11(fi*7.71+19.3);

    float perP = nIdx/uPetal.x;                    // arcs stacked up one petal
    float pIdx = floor(idx/perP);
    float t    = (mod(idx, perP) + 0.5)/perP;      // 0 at the base, 1 at the tip
    t = clamp(pow(t, 0.88) + (h1-0.5)*uGeoA.z/perP, 0.0, 1.0);
    float k    = u;                                // across the blade, 0..1

    /* alternate whorls are turned half a petal, so the ranks interleave into
       two visible ranks rather than smearing into one fan */
    float phi0 = (pIdx+0.5)*TAU/uPetal.x + whorl*TAU/(uPetal.x*2.0) + uTime*uRot;

    vec3 p = petalPoint(phi0, wl, h2, t, k);

    /* the surface normal by central difference, so the moon lights the petals
       the way it lights the water in Tide: the fluting turns one blade into
       several bands of light, and the petals turned away fall into shadow */
    float ta = min(t + 0.030, 1.0), tb = ta - 0.030;
    float ka = min(k + 0.030, 1.0), kb = ka - 0.030;
    vec3 dt = petalPoint(phi0, wl, h2, ta, k) - petalPoint(phi0, wl, h2, tb, k);
    vec3 dk = petalPoint(phi0, wl, h2, t, ka) - petalPoint(phi0, wl, h2, t, kb);
    vec3 nrm = normalize(cross(dk, dt) + vec3(0.0, 1e-5, 0.0));
    float lit = dot(nrm, uMoonDir);

    p += turbulence(p, length(p.xz))*uGeoE.x*t;

    /* the heart still lights itself, because the shared density term divides by
       the distance from the axis; the moonlight rides the shared asymmetry term */
    baseR = length(p.xz);
    vOut  = (lit - uSpec.x)*uSpec.y;
    return p;
  }
  \`;

  /* ---------------- lines ---------------- */
  const N = P.curves, M = P.samples;
  const posArr = new Float32Array(N*M*3);
  const aCi = new Float32Array(N*M), aU = new Float32Array(N*M);
  const idx = new Uint32Array(N*(M-1)*2);
  let ii=0;
  for(let i=0;i<N;i++){
    const ci=(i+0.5)/N;
    for(let j=0;j<M;j++){ const k=i*M+j; aCi[k]=ci; aU[k]=j/(M-1); }
    for(let j=0;j<M-1;j++){ idx[ii++]=i*M+j; idx[ii++]=i*M+j+1; }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posArr,3));
  geo.setAttribute('aCi', new THREE.BufferAttribute(aCi,1));
  geo.setAttribute('aU', new THREE.BufferAttribute(aU,1));
  geo.setIndex(new THREE.BufferAttribute(idx,1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);

  const lineMat = new THREE.ShaderMaterial({
    uniforms:U, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      varying vec3 vCol;
      void main(){
        float g1=hash11(aCi*913.7+3.3), g2=hash11(aCi*47.11+77.7), g3=hash11(aCi*221.9+13.1);
        float u = mix(0.006+0.055*g2, 0.994-0.055*g3, aU);
        float R, vv; vec3 p = curvePos(aCi,u,R,vv);
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_Position = projectionMatrix*mv;
        float dens = 1.0/(uDens.y + R*uDens.x);
        float gain = uGain.z + uGain.y*pow(g1, uGain.x);
        float breathe = 0.34 + 1.5*pow(0.5+0.5*sin(uTime*0.22+g2*TAU), 3.0);
        float edge = smoothstep(0.0,0.05,aU)*smoothstep(1.0,0.95,aU);
        float dist = length(mv.xyz);
        float asym = mix(uAsym.x, 1.0, smoothstep(-uAsym.y, uAsym.y, vv));
        float I = (0.16+3.3*dens)*gain*breathe*edge*exp(-dist*uDens.z)*uInt*asym;
        I = uGeoC.y*I/(uGeoC.y+I);
        vec3 body = mix(vec3(0.840,0.028,0.430), vec3(0.400,0.055,0.960), smoothstep(0.40,2.60,R));
        float rim = smoothstep(0.14, 0.015, min(aU, 1.0-aU))*smoothstep(0.38, 1.15, R);
        vec3 col = mix(body, vec3(0.110,1.000,0.600), rim);
        float sheen = pow(clamp(vv*0.5 + 0.5, 0.0, 1.0), uSpec.z)*uSpec.w;
        col = mix(col, vec3(0.74,0.88,1.00), clamp(sheen, 0.0, 1.0));
        vCol = mix(col, vec3(0.94,1.00,0.98), clamp(I*0.13,0.0,1.0))*I;
      }\`,
    fragmentShader:\`varying vec3 vCol; void main(){ gl_FragColor=vec4(vCol,1.0);} \`
  });
  const lines = new THREE.LineSegments(geo, lineMat);
  lines.frustumCulled=false; scene.add(lines);

  /* ---------------- beads ---------------- */
  const NB=900;
  const bgeo = new THREE.BufferGeometry();
  {
    const bp=new Float32Array(NB*3), bc=new Float32Array(NB), bu=new Float32Array(NB);
    for(let i=0;i<NB;i++){ bc[i]=Math.random(); bu[i]=Math.random(); }
    bgeo.setAttribute('position', new THREE.BufferAttribute(bp,3));
    bgeo.setAttribute('aCi', new THREE.BufferAttribute(bc,1));
    bgeo.setAttribute('aU', new THREE.BufferAttribute(bu,1));
    bgeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);
  }
  const beadU = Object.assign({}, U, {uPx:{value:1}, uBeadI:{value:P.beadI}});
  const beadMat = new THREE.ShaderMaterial({
    uniforms:beadU, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      uniform float uPx, uBeadI;
      varying vec3 vCol;
      void main(){
        float g1=hash11(aCi*913.7+3.3);
        float sp = 0.050+0.090*hash11(aCi*7.7+aU*13.1);
        float u = fract(aU + uTime*sp);
        float R, vv; vec3 p = curvePos(aCi, mix(0.06,0.94,u), R, vv);
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_Position = projectionMatrix*mv;
        float dist=length(mv.xyz);
        gl_PointSize = uPx*(1.5+26.0/dist);
        float dens = 1.0/(0.55+R*1.35);
        float gain = 0.10+1.5*pow(g1,3.0);
        float fade = smoothstep(0.0,0.10,u)*smoothstep(1.0,0.90,u);
        float asym = mix(uAsym.x, 1.0, smoothstep(-uAsym.y, uAsym.y, vv));
        float Ib = (0.25+2.6*dens)*gain*fade*exp(-dist*0.030)*uBeadI*asym;
        Ib = 4.0*Ib/(4.0+Ib);
        vCol = mix(vec3(1.00,0.08,0.58), vec3(0.82,0.94,1.00), clamp(Ib*0.46,0.0,1.0))*Ib;
      }\`,
    fragmentShader:\`
      varying vec3 vCol;
      void main(){ vec2 d=gl_PointCoord-0.5; gl_FragColor=vec4(vCol*exp(-dot(d,d)*14.0),1.0); }\`
  });
  const beads=new THREE.Points(bgeo,beadMat); beads.frustumCulled=false; scene.add(beads);

  /* ---------------- constellation web ---------------- */
  const NW=520;
  const wgeo=new THREE.BufferGeometry();
  {
    const wp=new Float32Array(NW*2*3), wc=new Float32Array(NW*2), wu=new Float32Array(NW*2);
    for(let i=0;i<NW;i++){
      const ci=Math.random(), u=0.22+Math.random()*0.56;
      wc[i*2]=ci; wu[i*2]=u;
      wc[i*2+1]=ci+(Math.random()*2-1)*0.004;
      wu[i*2+1]=u+(Math.random()*2-1)*0.016;
    }
    wgeo.setAttribute('position', new THREE.BufferAttribute(wp,3));
    wgeo.setAttribute('aCi', new THREE.BufferAttribute(wc,1));
    wgeo.setAttribute('aU', new THREE.BufferAttribute(wu,1));
    wgeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);
  }
  const webU = Object.assign({}, U, {uWebI:{value:P.webI}});
  const webMat=new THREE.ShaderMaterial({
    uniforms:webU, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      uniform float uWebI;
      varying vec3 vCol;
      void main(){
        float R, vv; vec3 p=curvePos(aCi, clamp(aU,0.0,1.0), R, vv);
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_Position=projectionMatrix*mv;
        float dist=length(mv.xyz);
        vCol=vec3(0.42,0.05,0.78)*(uWebI*exp(-dist*0.05)/(1.0+R*0.35));
      }\`,
    fragmentShader:\`varying vec3 vCol; void main(){ gl_FragColor=vec4(vCol,1.0);} \`
  });
  const web=new THREE.LineSegments(wgeo,webMat); web.frustumCulled=false; scene.add(web);

  /* ---------------- starfield ---------------- */
  const NS = 6800;
  const starGeo = new THREE.BufferGeometry();
  {
    const sp=new Float32Array(NS*3), sd=new Float32Array(NS);
    for(let i=0;i<NS;i++){
      const u = Math.random()*2-1, th = Math.random()*Math.PI*2;
      const rr = 40 + Math.pow(Math.random(),0.5)*140;
      const s2 = Math.sqrt(Math.max(0,1-u*u));
      sp[i*3]   = Math.cos(th)*s2*rr;
      sp[i*3+1] = u*rr*0.88;
      sp[i*3+2] = Math.sin(th)*s2*rr;
      sd[i] = Math.random();
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp,3));
    starGeo.setAttribute('aSeed', new THREE.BufferAttribute(sd,1));
    starGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 200);
  }
  const starU = {uTime:U.uTime, uPx:{value:1}, uStarI:{value:P.starI}, uStarLeft:{value:P.starLeft}};
  const starMat = new THREE.ShaderMaterial({
    uniforms: starU,
    transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader:\`
      attribute float aSeed;
      uniform float uTime, uPx, uStarI, uStarLeft;
      varying vec3 vCol;
      void main(){
        vec4 mv = modelViewMatrix*vec4(position,1.0);
        vec4 cp = projectionMatrix*mv;
        gl_Position = cp;
        float h  = aSeed;
        float h2 = fract(h*31.7), h3 = fract(h*97.13);
        float mag = 0.22 + 0.78*pow(h3, 1.75);
        float tw  = 0.45 + 0.55*sin(uTime*(0.35+1.9*h2) + h*41.7);
        // the copy scrim dims the left edge; pay it back so both sides read evenly
        float ndcx = cp.x/max(abs(cp.w), 0.0001);
        float lift = 1.0 + uStarLeft*smoothstep(0.40, -0.90, ndcx);
        gl_PointSize = uPx*(1.15 + 1.85*mag)*(1.0 + 0.18*(lift-1.0));
        vCol = mix(vec3(0.52,0.14,0.86), vec3(0.34,1.00,0.74), h2*h2) * (uStarI*mag*tw*lift);
      }\`,
    fragmentShader:\`
      varying vec3 vCol;
      void main(){ vec2 d=gl_PointCoord-0.5; gl_FragColor=vec4(vCol*exp(-dot(d,d)*11.0),1.0); }\`
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  scene.add(stars);

  /* ---------------- post: scene target + custom bloom ---------------- */
  const RTP = {minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
               format:THREE.RGBAFormat, type:THREE.HalfFloatType,
               depthBuffer:false, stencilBuffer:false, wrapS:THREE.ClampToEdgeWrapping, wrapT:THREE.ClampToEdgeWrapping};
  const LEVELS = 6;
  let rtScene=null, mips=[], SW=0, SH=0, camZEff=P.camZ, tgtYEff=P.tgtY;
  let orbR=1, orbAz0=0, orbEl0=0;   // spherical frame of the resting camera

  const VERT = \`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }\`;
  const mkMat = (frag, uni, blend) => new THREE.ShaderMaterial({
    uniforms:uni, vertexShader:VERT, fragmentShader:frag,
    depthTest:false, depthWrite:false,
    blending: blend||THREE.NoBlending, transparent: !!blend
  });

  const uBright = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}, uPar:{value:new THREE.Vector3(P.bloomT,0.55,2.6)}};
  const matBright = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; uniform vec3 uPar; varying vec2 vUv;
    void main(){
      vec2 t=uTexel;
      vec3 c = texture2D(tSrc,vUv+vec2(-t.x,-t.y)).rgb + texture2D(tSrc,vUv+vec2(t.x,-t.y)).rgb
             + texture2D(tSrc,vUv+vec2(-t.x, t.y)).rgb + texture2D(tSrc,vUv+vec2(t.x, t.y)).rgb;
      c *= 0.25;
      c = min(c, vec3(uPar.z));
      float l = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c*smoothstep(uPar.x, uPar.x+uPar.y, l), 1.0);
    }\`, uBright);

  const uDown = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}};
  const matDown = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; varying vec2 vUv;
    vec3 S(vec2 o){ return texture2D(tSrc, vUv+o*uTexel).rgb; }
    void main(){
      vec3 a=S(vec2(-2.,2.)), b=S(vec2(0.,2.)), c=S(vec2(2.,2.));
      vec3 d=S(vec2(-2.,0.)), e=S(vec2(0.,0.)), f=S(vec2(2.,0.));
      vec3 g=S(vec2(-2.,-2.)),h=S(vec2(0.,-2.)),i=S(vec2(2.,-2.));
      vec3 j=S(vec2(-1.,1.)), k=S(vec2(1.,1.)), l=S(vec2(-1.,-1.)), m=S(vec2(1.,-1.));
      gl_FragColor = vec4(e*0.125 + (a+c+g+i)*0.03125 + (b+d+f+h)*0.0625 + (j+k+l+m)*0.125, 1.0);
    }\`, uDown);

  const uUp = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}, uScale:{value:1.0}};
  const matUp = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uScale; varying vec2 vUv;
    vec3 S(vec2 o){ return texture2D(tSrc, vUv+o*uTexel*uScale).rgb; }
    void main(){
      vec3 r = S(vec2(-1.,1.)) + S(vec2(0.,1.))*2.0 + S(vec2(1.,1.))
             + S(vec2(-1.,0.))*2.0 + S(vec2(0.,0.))*4.0 + S(vec2(1.,0.))*2.0
             + S(vec2(-1.,-1.)) + S(vec2(0.,-1.))*2.0 + S(vec2(1.,-1.));
      gl_FragColor = vec4(r/16.0, 1.0);
    }\`, uUp, THREE.AdditiveBlending);

  const uComp = {tScene:{value:null}, tBloom:{value:null}, uStrength:{value:P.bloomS}, uVig:{value:P.vig},
                 uAspect:{value:1.777}, uMoon:{value:new THREE.Vector2(0.72,0.82)}};
  /* the moon is a direction, not a place. The frame is filled by the flower, so
     the disc itself is always off it — what is drawn is where its light pools,
     found by projecting a point a little way from the head toward the moon, so
     the glow and the lit petals can never disagree. */
  const moonDir = new THREE.Vector3();
  const skyPt = new THREE.Vector3();
  const headAt = new THREE.Vector3();
  /* both the sizing rig and the control seam have to be able to re-aim the moon,
     so the one place it is turned into a direction lives here */
  function aimMoon(){
    moonDir.set(Math.sin(P.moonAz)*Math.cos(P.moonEl), Math.sin(P.moonEl), -Math.cos(P.moonAz)*Math.cos(P.moonEl));
    U.uMoonDir.value.copy(moonDir);
  }
  const matComp = mkMat(\`
    uniform sampler2D tScene; uniform sampler2D tBloom; uniform float uStrength, uVig;
    varying vec2 vUv;
    uniform float uAspect;
    uniform vec2 uMoon;
    /* near black, warmed by the flower's own bloom pushed back into the air
       behind it, and cooled on the side the moon is on — a violet ground for
       the fluorescent palette, with the light coming from somewhere */
    vec3 sceneSky(vec2 uv){
      vec2 q = uv - vec2(0.5, 0.47); q.x *= uAspect;
      float r = length(q);
      vec3 c = mix(vec3(0.0125,0.0036,0.0300), vec3(0.0018,0.0008,0.0060), smoothstep(0.05, 0.72, r));
      c += vec3(0.230,0.028,0.350)*0.075*exp(-r*3.8);
      vec2 m = uv - uMoon; m.x *= uAspect;
      float d = length(m);
      c += vec3(0.300,0.420,0.720)*0.075*exp(-d*2.2);
      c += vec3(0.520,0.640,1.000)*0.030*exp(-d*5.6);
      return c;
    }
    vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055, step(vec3(0.0031308),c)); }
    void main(){
      vec3 c = sceneSky(vUv) + texture2D(tScene,vUv).rgb + texture2D(tBloom,vUv).rgb*uStrength;
      vec2 q = vUv-0.5; q.x*=1.16;
      c *= 1.0 - uVig*smoothstep(0.30, 0.92, length(q));
      c = toSRGB(clamp(c,0.0,1.0));
      float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
      c += (n-0.5)/255.0*1.6;
      gl_FragColor = vec4(c,1.0);
    }\`, uComp);

  const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const quadScene = new THREE.Scene();
  const quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), matComp);
  quadMesh.frustumCulled=false; quadScene.add(quadMesh);
  function blit(mat, target, clear){
    quadMesh.material = mat;
    renderer.setRenderTarget(target||null);
    if(clear) renderer.clear(true,false,false);
    renderer.render(quadScene, quadCam);
  }

  function build(){
    const w = canvas.clientWidth||window.innerWidth, h = canvas.clientHeight||window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w,h,false);
    renderer.autoClear = false;
    const asp = w/h, REF_ASP = 1.334;
    camZEff = P.camZ * (asp < REF_ASP ? Math.pow(REF_ASP/asp, 0.70) : 1);
    tgtYEff = P.tgtY * (asp < REF_ASP ? Math.min(1.9, Math.pow(REF_ASP/asp, 0.55)) : 1);
    camera.aspect=asp; camera.fov=P.fov; camera.updateProjectionMatrix();
    camera.clearViewOffset();
    baseOrbit();
    beadU.uPx.value = dpr; starU.uPx.value = dpr;
    uComp.uAspect.value = asp;
    /* the head is wide, so it has to answer to the frame's width as well as to
       the pull-back: the first term gives back most of the camera's retreat, the
       second takes the narrower frame off again so the tips stay inside it */
    U.uFit.value = Math.pow(camZEff/P.camZ, 0.82)*Math.min(1, asp/REF_ASP);
    aimMoon();
    SW = Math.max(2, Math.round(w*dpr)); SH = Math.max(2, Math.round(h*dpr));
    if(rtScene) rtScene.dispose();
    mips.forEach(m=>m.dispose());
    rtScene = new THREE.WebGLRenderTarget(SW,SH,RTP);
    mips = [];
    let mw=SW, mh=SH;
    for(let i=0;i<LEVELS;i++){
      mw = Math.max(2, Math.floor(mw/2)); mh = Math.max(2, Math.floor(mh/2));
      mips.push(new THREE.WebGLRenderTarget(mw,mh,RTP));
    }
  }
  build();
  let rz; window.addEventListener('resize', ()=>{ clearTimeout(rz); rz=setTimeout(build,140); });

  function renderFrame(){
    renderer.setRenderTarget(rtScene);
    renderer.clear(true,true,false);
    renderer.render(scene, camera);

    uBright.tSrc.value = rtScene.texture;
    uBright.uTexel.value.set(1/SW, 1/SH);
    uBright.uPar.value.set(P.bloomT, 0.55, 2.6);
    blit(matBright, mips[0], true);

    for(let i=1;i<LEVELS;i++){
      uDown.tSrc.value = mips[i-1].texture;
      uDown.uTexel.value.set(1/mips[i-1].width, 1/mips[i-1].height);
      blit(matDown, mips[i], true);
    }
    for(let i=LEVELS-1;i>0;i--){
      uUp.tSrc.value = mips[i].texture;
      uUp.uTexel.value.set(1/mips[i].width, 1/mips[i].height);
      uUp.uScale.value = 0.6 + P.bloomR*1.6;
      blit(matUp, mips[i-1], false);
    }
    uComp.tScene.value = rtScene.texture;
    uComp.tBloom.value = mips[0].texture;
    uComp.uStrength.value = P.bloomS;
    uComp.uVig.value = P.vig;
    headAt.set(P.tgtX, tgtYEff, P.tgtZ);
    skyPt.copy(moonDir).multiplyScalar(3.0*U.uFit.value).add(headAt).project(camera);
    uComp.uMoon.value.set(skyPt.x*0.5+0.5, skyPt.y*0.5+0.5);
    blit(matComp, null, true);
  }

  const t0=performance.now();
  function baseOrbit(){
    const dx=P.camX-P.tgtX, dy=P.camY-tgtYEff, dz=camZEff-P.tgtZ;
    orbR = Math.max(0.001, Math.hypot(dx,dy,dz));
    orbEl0 = Math.asin(dy/orbR);
    orbAz0 = Math.atan2(dx,dz);
  }
  /* the authored loop reads the wall clock straight into uTime, which a speed
     control cannot touch without the scene jumping the moment it moves. The time
     the scene sees is accumulated from that clock instead, scaled as it goes, so
     changing the rate only changes what happens next. */
  let sceneT = 0, prevT = 0;

  let mx=0,my=0,tx=0,ty=0,hov=0,hovT=0;
  /* window, not a panel: a scene-only document has no .hero, and under the
     catalog frame every descendant of body is pointer-events:none, so only a
     listener above body still sees the move. The canvas rect is the hit test. */
  window.addEventListener('pointermove', e=>{
    if(e.pointerType==='touch') return;
    const r=canvas.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    if(px<0.0||px>1.0||py<0.0||py>1.0){ hovT=0; return; }
    tx=px-0.5; ty=py-0.5; hovT=1;
  }, {passive:true});
  window.addEventListener('pointerleave', ()=>{ hovT=0; });
  document.addEventListener('mouseleave', ()=>{ hovT=0; });

  let visible = true, onScreen = true;
  document.addEventListener('visibilitychange', ()=>{ visible = !document.hidden; });
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{ onScreen = es[0].isIntersecting; }, {threshold:0}).observe(canvas);
  }
  function frame(){
    requestAnimationFrame(frame);
    if(!visible || !onScreen) return;
    const t=(performance.now()-t0)/1000;
    const dt = Math.min(0.1, Math.max(0.0, t - prevT)); prevT = t;
    sceneT += dt*P.speed;
    U.uTime.value = reduce ? 6.0 : sceneT;
    mx+=(tx-mx)*0.055; my+=(ty-my)*0.055; hov+=(hovT-hov)*0.045;
    const az = orbAz0 + P.orbAz*mx*hov;
    const el = orbEl0 - P.orbEl*my*hov;
    const ce = Math.cos(el);
    camera.position.set(P.tgtX + Math.sin(az)*orbR*ce,
                        tgtYEff + Math.sin(el)*orbR,
                        P.tgtZ + Math.cos(az)*orbR*ce);
    camera.lookAt(P.tgtX,tgtYEff,P.tgtZ);
    stars.rotation.y = 0.17*Math.sin(U.uTime.value*P.starRot*2.6);
    renderFrame();
  }
  requestAnimationFrame(()=>canvas.classList.add('on'));
  frame();

  /* One write per authored uniform a control can move, so a slider drag lands on
     the running scene without rebuilding a buffer. Everything the render pass
     already reads out of P each frame — the bloom strength, radius and threshold,
     the vignette, the star rotation — needs nothing here. */
  function applySettings(){
    U.uR0.value = P.r0; U.uTwist.value = P.twist; U.uRot.value = P.rot; U.uTwistL.value = P.twistL;
    U.uGeoA.value.set(P.curves, P.layers, P.jit);
    U.uGeoB.value.set(P.V, P.b, P.A);
    U.uGeoC.value.set(P.shell, P.clampI, 0);
    U.uGeoE.value.set(P.trunkTurb, P.crownInner);
    U.uAsym.value.set(P.dimLo, P.knee);
    U.uT.value.set(P.t1, P.t2, P.t3, P.t3r);
    U.uF.value.set(P.f1, P.f2, P.f3, P.tw);
    U.uInt.value = P.inten;
    U.uDens.value.set(P.dens, P.densK, P.fog);
    U.uGain.value.set(P.gainP, P.gainA, P.gainB);
    beadU.uBeadI.value = P.beadI;
    webU.uWebI.value = P.webI;
    starU.uStarI.value = P.starI;
    starU.uStarLeft.value = P.starLeft;
    U.uPetal.value.set(P.petals, P.lenInner, P.lenOuter, P.wide);
    U.uShape.value.set(P.radPow, P.widePow, P.lobePow, P.hub);
    U.uOpen.value = P.baseOpen;
    U.uLift.value.set(P.lift, P.liftPow, P.liftInner, P.sag);
    U.uCurl.value.set(P.curl, P.curlPow, P.sway, P.swayAmp);
    U.uSpec.value.set(P.specBias, P.specGain, P.sheenPow, P.sheenAmt);
    U.uVein.value.set(P.veinFolds, P.veinDepth);
    aimMoon();
  }

  /* headless hooks: pause the loop, then render one frame at an exact time with
     the pointer held at (px,py) in [-0.5,0.5] — used by the preview capture */
  window.__emberline = {
    scene:'bloom', P, U,
    /* the eased pointer state the orbit is actually reading — the catalog frame
       puts pointer-events:none on every descendant of body, so this is the only
       way to prove the background is not inert */
    get pointer(){ return {x: mx, y: my, hover: hov, target: {x: tx, y: ty, hover: hovT}}; },
    pause(){ visible = false; },
    resume(){ visible = true; },
    seek(seconds, px, py){
      U.uTime.value = seconds;
      tx = mx = px || 0; ty = my = py || 0;
      hov = hovT = (px === undefined && py === undefined) ? 0 : 1;
      const az = orbAz0 + P.orbAz*mx*hov;
      const el = orbEl0 - P.orbEl*my*hov;
      const ce = Math.cos(el);
      camera.position.set(P.tgtX + Math.sin(az)*orbR*ce,
                          tgtYEff + Math.sin(el)*orbR,
                          P.tgtZ + Math.cos(az)*orbR*ce);
      camera.lookAt(P.tgtX,tgtYEff,P.tgtZ);
      stars.rotation.y = 0.17*Math.sin(U.uTime.value*P.starRot*2.6);
      renderFrame();
    },
    resize(){ build(); },
    /* the control seam: write the named tunables into P and push them at the
       running scene. The catalog frame calls this on every slider change. */
    set(values){
      Object.keys(values).forEach(function(key){ P[key] = values[key]; });
      applySettings();
    },
  };

})();
<\/script>
</body>
</html>
`,f=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Emberline Ridge — sunset range background</title>
<meta name="description" content="A field of hairline filaments folded into a receding mountain range: peaks and valleys sliding past each other, with a low sun laying a hot rim along every crest it can reach.">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0a0407">
<style>
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #0a0407;
    overflow: hidden;
  }
  /* the authored 1.4s reveal, kept: the canvas fades up once the first frame
     has been composited rather than snapping on mid-warm-up */
  #gl {
    position: fixed;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1.4s ease;
  }
  #gl.on { opacity: 1 }
</style>
</head>
<body>
<!--
  Emberline Ridge — the field folded into a sunset range: one continuous surface
  of contours, lit the way Tide's water is, and the layers stack because
  perspective stacks them rather than because anything draws one.

  Everything that draws below is lifted out of the authored Emberline hero
  (public/landing-pages/emberline-hero.html): the curve buffer layout, the
  line/bead/web/star intensity math, the six-level bloom chain, the composite
  with its vignette and dither, the sizing rig and the frame loop. This scene's
  own regions are the P tunables, its extra uniforms, curvePos, the four palettes
  and the composite sky. Regenerate with:

      node scripts/build-emberline-scenes.mjs ridge
-->
<canvas id="gl" aria-hidden="true"></canvas>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>

<script>
/* ------------------------------------------------------------------
   Vortex line field
------------------------------------------------------------------ */
(function(){
  const canvas = document.getElementById('gl');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:false, powerPreference:'high-performance'});
  renderer.setClearColor(0x000000, 1);
  renderer.outputEncoding = THREE.LinearEncoding;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 800);

  /* ---------------- tunables ---------------- */
  const P = {
    curves:520, samples:190,
    r0:0.16, layers:1, jit:0.60,       // one contour per curve; jit scatters their depth
    /* b, A, shell, crown* and root* belong to the catenoid the authored page
       draws and are unused here, kept so the uniform rig builds unchanged */
    V:5.0, b:1.47, A:0.640, shell:0.35, clampI:6.2, dimLo:0.085, knee:1.00, flat:0.20, cap:0.38,
    crownR:5.00, crownPow:1.35, crownInner:0.32,
    Vd:10.8, trunkB:1.90, capDn:0.12, trunkTurb:0.50,
    rootStart:3.4, rootR:3.20, rootPow:1.55,
    twist:1.40, twistL:0.12, rot:0.0,
    /* the range carries its own drift; the turbulence field is left off */
    t1:0.0, t2:0.0, t3:0.0, t3r:0.0,
    f1:0.300, f2:0.620, f3:0.110, tw:0.9, twBase:0.80,
    inten:0.200, dens:2.20, densK:0.68, fog:0.0105, gainP:1.7, gainA:0.95, gainB:0.34,
    beadI:0.42, webI:0.04, starI:0.42, starRot:0.006, starLeft:0.0,

    /* the land: eye height, the nearest and farthest contours, how they are
       distributed, and the screen span every contour is given */
    eye:1.00, near:1.55, far:430.0, rowPow:1.15, spanX:2.30,
    /* the height field: detail across the frame, how fast the profile changes
       with depth, and the sideways drift in world units per second */
    detail:1.60, depthRate:1.30, drift:0.34,
    /* the crest, as the angle it subtends at the nearest range, and how fast
       that angle shrinks with distance — this is what stacks the ranges */
    crest:0.34, crestFall:0.24,
    /* the ground immediately under the camera is held flat, so the frame opens
       on a valley floor rather than on a wall of near contours; and the ranges
       are put away again before the horizon, so the skyline is one line with
       clean sky above it rather than a background of more mountains */
    floorNear:1.0, floorFar:2.0, fadeNear:5.0, fadeFar:16.0,
    /* the sun's path down the land: how hard the angle off its bearing closes
       the shared density term, and where along the crest the lit rim starts and
       how hard it separates from the valley below it */
    glade:1.55, crestBias:0.33, crestGain:7.0,
    /* the sun's bearing and elevation, in radians off the view axis */
    sunAz:0.16, sunEl:0.165,
    speed:1.0,                         // the rate the scene clock runs at

    camX:0.0, camY:0.0, camZ:7.0, tgtX:0.0, tgtY:0.30, tgtZ:0.0, fov:50,
    bloomS:0.62, bloomR:1.00, bloomT:0.50, vig:0.52,
    orbAz:0.14, orbEl:0.05,
  };  if(Math.min(window.innerWidth, window.innerHeight) < 760 || window.innerWidth < 900) P.curves = 380;

  const U = {
    uTime:{value:0},
    uR0:{value:P.r0}, uTwist:{value:P.twist}, uRot:{value:P.rot}, uTwistL:{value:P.twistL},
    uGeoA:{value:new THREE.Vector3(P.curves,P.layers,P.jit)},
    uGeoB:{value:new THREE.Vector3(P.V,P.b,P.A)},
    uGeoC:{value:new THREE.Vector3(P.shell,P.clampI,0)},
    uGeoD:{value:new THREE.Vector3(P.Vd,P.trunkB,P.capDn)},
    uGeoE:{value:new THREE.Vector2(P.trunkTurb,P.crownInner)},
    uGeoF:{value:new THREE.Vector2(P.crownR,P.crownPow)},
    uRoot:{value:new THREE.Vector3(P.rootStart,P.rootR,P.rootPow)},
    uAsym:{value:new THREE.Vector2(P.dimLo,P.knee)},
    uAsym2:{value:new THREE.Vector2(P.flat,P.cap)},
    uT:{value:new THREE.Vector4(P.t1,P.t2,P.t3,P.t3r)},
    uF:{value:new THREE.Vector4(P.f1,P.f2,P.f3,P.tw)},
    uTw2:{value:new THREE.Vector2(P.twBase,0)},
    uInt:{value:P.inten}, uDens:{value:new THREE.Vector3(P.dens,P.densK,P.fog)},
    uGain:{value:new THREE.Vector3(P.gainP,P.gainA,P.gainB)},
    uLand:{value:new THREE.Vector4(P.eye,P.near,P.far,P.rowPow)},
    uRange:{value:new THREE.Vector4(P.detail,P.depthRate,P.drift,P.spanX)},
    uCrest:{value:new THREE.Vector3(P.crest,P.crestFall,P.glade)},
    uCut:{value:new THREE.Vector4(P.floorNear,P.floorFar,P.crestBias,P.crestGain)},
    uFade:{value:new THREE.Vector2(P.fadeNear,P.fadeFar)},
    uSunAz:{value:P.sunAz}, uEyeZ:{value:P.camZ},
  };

  const COMMON = \`
  #define TAU 6.28318530718
  uniform float uTime;
  uniform float uR0, uTwist, uRot, uTwistL;
  uniform vec3  uGeoA;  // curves, layers, jitter
  uniform vec3  uGeoB;  // V, b, A
  uniform vec3  uGeoC;  // shell, clampI, -
  uniform vec3  uGeoD;  // Vdown, trunkB, capDown
  uniform vec2  uGeoE;  // trunk turbulence damping, -
  uniform vec2  uGeoF;  // crown radius, crown spread exponent
  uniform vec3  uRoot;  // root start depth, root radius, root spread exponent
  uniform vec2  uAsym;  // lowGain, knee
  uniform vec2  uAsym2; // flat, cap
  uniform vec4  uT, uF;
  uniform vec2  uTw2; // base turbulence weight at axis, -
  uniform float uInt;
  uniform vec3  uDens, uGain;
  uniform vec4  uLand;   // eye height, nearest contour, farthest contour, distribution
  uniform vec4  uRange;  // detail across the frame, change with depth, drift, screen span
  uniform vec3  uCrest;  // crest angle at the nearest contour, its falloff, the glade
  uniform vec4  uCut;    // flat-floor start and end, crest bias, crest gain
  uniform vec2  uFade;   // where the ranges start settling back, and where they end
  uniform float uSunAz;  // the sun's bearing; the path down the land follows it
  uniform float uEyeZ;   // the world Z the contours are measured back from

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float sinh_(float x){ return 0.5*(exp(x)-exp(-x)); }
  float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; p*=p+p; return fract(p); }

  vec3 turbulence(vec3 p, float R){
    float t = uTime;
    float w = uTw2.x + (1.0-uTw2.x)*R/(R+uF.w);
    vec3 q1 = p*uF.x + vec3(0.0, -t*0.052, 4.7);
    vec3 d1 = vec3(snoise(q1), snoise(q1+vec3(31.4,17.2,9.1)), snoise(q1+vec3(-13.7,45.3,22.8)));
    vec3 q2 = p*uF.y + vec3(t*0.062, 0.0, -2.3);
    vec3 d2 = vec3(snoise(q2), snoise(q2+vec3(7.7,3.3,21.9)), snoise(q2+vec3(19.1,-8.4,5.5)));
    vec3 q3 = p*uF.z + vec3(-1.9, -t*0.038, 0.6);
    vec3 d3 = vec3(snoise(q3), snoise(q3+vec3(51.4,-7.2,3.1)), snoise(q3+vec3(3.7,15.3,-42.8)));
    return (d1*uT.x + d2*uT.y)*w + d3*(uT.z + R*uT.w);
  }

  float cosh_(float x){ return 0.5*(exp(x)+exp(-x)); }
  float tanh_(float x){ float e=exp(2.0*x); return (e-1.0)/(e+1.0); }

  // catenoid "trumpet" of revolution, one curve per meridian, twisted like a vortex
  /* a ridged multifractal built on the authored simplex noise: folding each
     octave about zero turns lumps into crests, and weighting every octave by
     the one below keeps the flanks smooth where the range is low */
  float ridged(vec2 q){
    float a = 1.0 - abs(snoise(vec3(q, 0.0)));
    float b = 1.0 - abs(snoise(vec3(q*2.03 + 11.7, 0.0)));
    float c = 1.0 - abs(snoise(vec3(q*4.11 -  5.3, 0.0)));
    float d = 1.0 - abs(snoise(vec3(q*8.27 +  2.9, 0.0)));
    float e = 1.0 - abs(snoise(vec3(q*16.4 - 21.1, 0.0)));
    float h = a*0.50 + a*b*0.26 + a*b*c*0.14 + a*b*c*d*0.07 + a*b*c*d*e*0.03;
    return h*h;
  }

  /* the land, in world height, at one point of one contour. The profile is cut
     in the angle the frame subtends rather than in world units, so every range
     carries the same detail however far away it is; and the crest is authored
     as the angle it subtends, shrinking slowly with distance, which is what
     settles each range lower on the frame than the one in front of it. */
  float landN(float X, float d){
    float ax = (X/d + uTime*uRange.z/d)*uRange.x;
    return ridged(vec2(ax, log(d)*uRange.y));
  }
  float landY(float n, float d){
    /* the ground right under the camera is held flat, so the frame opens on a
       valley floor instead of on a wall of near contours; and it settles flat
       again well before the horizon, so nothing stands behind the skyline and
       the sun keeps a clean sky to sit in */
    float rise = smoothstep(uLand.y*uCut.x, uLand.y*uCut.y, d)
               * (1.0 - smoothstep(uFade.x, uFade.y, d));
    return uCrest.x*n*rise*pow(uLand.y/d, uCrest.y)*d - uLand.x;
  }

  // one contour of the land, at one distance
  vec3 curvePos(float ci, float u, out float baseR, out float vOut){
    float fi  = ci*uGeoA.x;
    float row = (fi+0.5)/uGeoA.x;                  // 0 nearest .. 1 at the horizon
    float h1  = hash11(fi*1.37+3.1);
    row = clamp(row + (h1-0.5)*uGeoA.z/uGeoA.x, 0.0, 1.0);

    /* contours are stacked so their spacing on screen is even rather than their
       spacing on the ground, which is what puts the far ranges on the horizon */
    float inv  = mix(1.0, uLand.y/uLand.z, pow(row, uLand.w));
    float dist = uLand.y/inv;

    float X = (u-0.5)*uRange.w*dist;               // the same screen span for every contour
    float n = landN(X, dist);
    vec3 p = vec3(X, landY(n, dist), uEyeZ - dist);

    /* the sun lays a path down the land exactly the way the moon lays one down
       the water in Tide: the angle a point sits off its bearing feeds the shared
       density term. The land is back-lit, so height feeds the shared asymmetry
       term — the crests take the rim and the valleys fall into shadow. */
    baseR = abs(atan(X, dist) - uSunAz)*uCrest.z;
    vOut  = (n - uCut.z)*uCut.w;
    return p;
  }
  \`;

  /* ---------------- lines ---------------- */
  const N = P.curves, M = P.samples;
  const posArr = new Float32Array(N*M*3);
  const aCi = new Float32Array(N*M), aU = new Float32Array(N*M);
  const idx = new Uint32Array(N*(M-1)*2);
  let ii=0;
  for(let i=0;i<N;i++){
    const ci=(i+0.5)/N;
    for(let j=0;j<M;j++){ const k=i*M+j; aCi[k]=ci; aU[k]=j/(M-1); }
    for(let j=0;j<M-1;j++){ idx[ii++]=i*M+j; idx[ii++]=i*M+j+1; }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posArr,3));
  geo.setAttribute('aCi', new THREE.BufferAttribute(aCi,1));
  geo.setAttribute('aU', new THREE.BufferAttribute(aU,1));
  geo.setIndex(new THREE.BufferAttribute(idx,1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);

  const lineMat = new THREE.ShaderMaterial({
    uniforms:U, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      varying vec3 vCol;
      void main(){
        float g1=hash11(aCi*913.7+3.3), g2=hash11(aCi*47.11+77.7), g3=hash11(aCi*221.9+13.1);
        float u = mix(0.006+0.055*g2, 0.994-0.055*g3, aU);
        float R, vv; vec3 p = curvePos(aCi,u,R,vv);
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_Position = projectionMatrix*mv;
        float dens = 1.0/(uDens.y + R*uDens.x);
        float gain = uGain.z + uGain.y*pow(g1, uGain.x);
        float breathe = 0.34 + 1.5*pow(0.5+0.5*sin(uTime*0.22+g2*TAU), 3.0);
        float edge = smoothstep(0.0,0.05,aU)*smoothstep(1.0,0.95,aU);
        float dist = length(mv.xyz);
        float asym = mix(uAsym.x, 1.0, smoothstep(-uAsym.y, uAsym.y, vv));
        float I = (0.16+3.3*dens)*gain*breathe*edge*exp(-dist*uDens.z)*uInt*asym;
        I = uGeoC.y*I/(uGeoC.y+I);
        float far = smoothstep(uLand.y*4.0, uLand.z*0.42, dist);
        vec3 band = mix(vec3(0.290,0.052,0.072), vec3(1.000,0.290,0.050), smoothstep(0.06,0.62,far));
        band = mix(band, vec3(1.000,0.730,0.350), smoothstep(0.60,1.00,far));
        float sunward = exp(-R*1.9);
        float crest = clamp(vv/uCut.w + uCut.z, 0.0, 1.0);
        float shine = pow(smoothstep(0.42, 0.96, crest), 2.0)*sunward;
        band = mix(band, vec3(1.00,0.93,0.80), clamp(shine*1.35, 0.0, 1.0));
        vCol = mix(band, vec3(1.00,0.91,0.76), clamp(I*0.20,0.0,1.0))*I;
      }\`,
    fragmentShader:\`varying vec3 vCol; void main(){ gl_FragColor=vec4(vCol,1.0);} \`
  });
  const lines = new THREE.LineSegments(geo, lineMat);
  lines.frustumCulled=false; scene.add(lines);

  /* ---------------- beads ---------------- */
  const NB=900;
  const bgeo = new THREE.BufferGeometry();
  {
    const bp=new Float32Array(NB*3), bc=new Float32Array(NB), bu=new Float32Array(NB);
    for(let i=0;i<NB;i++){ bc[i]=Math.random(); bu[i]=Math.random(); }
    bgeo.setAttribute('position', new THREE.BufferAttribute(bp,3));
    bgeo.setAttribute('aCi', new THREE.BufferAttribute(bc,1));
    bgeo.setAttribute('aU', new THREE.BufferAttribute(bu,1));
    bgeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);
  }
  const beadU = Object.assign({}, U, {uPx:{value:1}, uBeadI:{value:P.beadI}});
  const beadMat = new THREE.ShaderMaterial({
    uniforms:beadU, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      uniform float uPx, uBeadI;
      varying vec3 vCol;
      void main(){
        float g1=hash11(aCi*913.7+3.3);
        float sp = 0.050+0.090*hash11(aCi*7.7+aU*13.1);
        float u = fract(aU + uTime*sp);
        float R, vv; vec3 p = curvePos(aCi, mix(0.06,0.94,u), R, vv);
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_Position = projectionMatrix*mv;
        float dist=length(mv.xyz);
        gl_PointSize = uPx*(1.5+26.0/dist);
        float dens = 1.0/(0.55+R*1.35);
        float gain = 0.10+1.5*pow(g1,3.0);
        float fade = smoothstep(0.0,0.10,u)*smoothstep(1.0,0.90,u);
        float asym = mix(uAsym.x, 1.0, smoothstep(-uAsym.y, uAsym.y, vv));
        float Ib = (0.25+2.6*dens)*gain*fade*exp(-dist*0.030)*uBeadI*asym;
        Ib = 4.0*Ib/(4.0+Ib);
        vCol = mix(vec3(1.00,0.32,0.05), vec3(1.00,0.86,0.58), clamp(Ib*0.40,0.0,1.0))*Ib;
      }\`,
    fragmentShader:\`
      varying vec3 vCol;
      void main(){ vec2 d=gl_PointCoord-0.5; gl_FragColor=vec4(vCol*exp(-dot(d,d)*14.0),1.0); }\`
  });
  const beads=new THREE.Points(bgeo,beadMat); beads.frustumCulled=false; scene.add(beads);

  /* ---------------- constellation web ---------------- */
  const NW=520;
  const wgeo=new THREE.BufferGeometry();
  {
    const wp=new Float32Array(NW*2*3), wc=new Float32Array(NW*2), wu=new Float32Array(NW*2);
    for(let i=0;i<NW;i++){
      const ci=Math.random(), u=0.22+Math.random()*0.56;
      wc[i*2]=ci; wu[i*2]=u;
      wc[i*2+1]=ci+(Math.random()*2-1)*0.004;
      wu[i*2+1]=u+(Math.random()*2-1)*0.016;
    }
    wgeo.setAttribute('position', new THREE.BufferAttribute(wp,3));
    wgeo.setAttribute('aCi', new THREE.BufferAttribute(wc,1));
    wgeo.setAttribute('aU', new THREE.BufferAttribute(wu,1));
    wgeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);
  }
  const webU = Object.assign({}, U, {uWebI:{value:P.webI}});
  const webMat=new THREE.ShaderMaterial({
    uniforms:webU, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      uniform float uWebI;
      varying vec3 vCol;
      void main(){
        float R, vv; vec3 p=curvePos(aCi, clamp(aU,0.0,1.0), R, vv);
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_Position=projectionMatrix*mv;
        float dist=length(mv.xyz);
        vCol=vec3(0.52,0.13,0.05)*(uWebI*exp(-dist*0.01)/(1.0+R*0.8));
      }\`,
    fragmentShader:\`varying vec3 vCol; void main(){ gl_FragColor=vec4(vCol,1.0);} \`
  });
  const web=new THREE.LineSegments(wgeo,webMat); web.frustumCulled=false; scene.add(web);

  /* ---------------- starfield ---------------- */
  const NS = 6800;
  const starGeo = new THREE.BufferGeometry();
  {
    const sp=new Float32Array(NS*3), sd=new Float32Array(NS);
    for(let i=0;i<NS;i++){
      const u = Math.random()*2-1, th = Math.random()*Math.PI*2;
      const rr = 40 + Math.pow(Math.random(),0.5)*140;
      const s2 = Math.sqrt(Math.max(0,1-u*u));
      sp[i*3]   = Math.cos(th)*s2*rr;
      sp[i*3+1] = u*rr*0.88;
      sp[i*3+2] = Math.sin(th)*s2*rr;
      sd[i] = Math.random();
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp,3));
    starGeo.setAttribute('aSeed', new THREE.BufferAttribute(sd,1));
    starGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 200);
  }
  const starU = {uTime:U.uTime, uPx:{value:1}, uStarI:{value:P.starI}, uStarLeft:{value:P.starLeft}};
  const starMat = new THREE.ShaderMaterial({
    uniforms: starU,
    transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader:\`
      attribute float aSeed;
      uniform float uTime, uPx, uStarI, uStarLeft;
      varying vec3 vCol;
      void main(){
        vec4 mv = modelViewMatrix*vec4(position,1.0);
        vec4 cp = projectionMatrix*mv;
        gl_Position = cp;
        float h  = aSeed;
        float h2 = fract(h*31.7), h3 = fract(h*97.13);
        float mag = 0.22 + 0.78*pow(h3, 1.75);
        float tw  = 0.45 + 0.55*sin(uTime*(0.35+1.9*h2) + h*41.7);
        // the copy scrim dims the left edge; pay it back so both sides read evenly
        float ndcx = cp.x/max(abs(cp.w), 0.0001);
        float lift = 1.0 + uStarLeft*smoothstep(0.40, -0.90, ndcx);
        gl_PointSize = uPx*(1.15 + 1.85*mag)*(1.0 + 0.18*(lift-1.0));
        float above = smoothstep(0.06, 0.44, position.y/max(length(position),0.001));
        vCol = mix(vec3(0.82,0.54,0.44), vec3(0.98,0.93,0.88), h2*h2) * (uStarI*mag*tw*lift*above);
      }\`,
    fragmentShader:\`
      varying vec3 vCol;
      void main(){ vec2 d=gl_PointCoord-0.5; gl_FragColor=vec4(vCol*exp(-dot(d,d)*11.0),1.0); }\`
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  scene.add(stars);

  /* ---------------- post: scene target + custom bloom ---------------- */
  const RTP = {minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
               format:THREE.RGBAFormat, type:THREE.HalfFloatType,
               depthBuffer:false, stencilBuffer:false, wrapS:THREE.ClampToEdgeWrapping, wrapT:THREE.ClampToEdgeWrapping};
  const LEVELS = 6;
  let rtScene=null, mips=[], SW=0, SH=0, camZEff=P.camZ, tgtYEff=P.tgtY;
  let orbR=1, orbAz0=0, orbEl0=0;   // spherical frame of the resting camera

  const VERT = \`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }\`;
  const mkMat = (frag, uni, blend) => new THREE.ShaderMaterial({
    uniforms:uni, vertexShader:VERT, fragmentShader:frag,
    depthTest:false, depthWrite:false,
    blending: blend||THREE.NoBlending, transparent: !!blend
  });

  const uBright = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}, uPar:{value:new THREE.Vector3(P.bloomT,0.55,2.6)}};
  const matBright = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; uniform vec3 uPar; varying vec2 vUv;
    void main(){
      vec2 t=uTexel;
      vec3 c = texture2D(tSrc,vUv+vec2(-t.x,-t.y)).rgb + texture2D(tSrc,vUv+vec2(t.x,-t.y)).rgb
             + texture2D(tSrc,vUv+vec2(-t.x, t.y)).rgb + texture2D(tSrc,vUv+vec2(t.x, t.y)).rgb;
      c *= 0.25;
      c = min(c, vec3(uPar.z));
      float l = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c*smoothstep(uPar.x, uPar.x+uPar.y, l), 1.0);
    }\`, uBright);

  const uDown = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}};
  const matDown = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; varying vec2 vUv;
    vec3 S(vec2 o){ return texture2D(tSrc, vUv+o*uTexel).rgb; }
    void main(){
      vec3 a=S(vec2(-2.,2.)), b=S(vec2(0.,2.)), c=S(vec2(2.,2.));
      vec3 d=S(vec2(-2.,0.)), e=S(vec2(0.,0.)), f=S(vec2(2.,0.));
      vec3 g=S(vec2(-2.,-2.)),h=S(vec2(0.,-2.)),i=S(vec2(2.,-2.));
      vec3 j=S(vec2(-1.,1.)), k=S(vec2(1.,1.)), l=S(vec2(-1.,-1.)), m=S(vec2(1.,-1.));
      gl_FragColor = vec4(e*0.125 + (a+c+g+i)*0.03125 + (b+d+f+h)*0.0625 + (j+k+l+m)*0.125, 1.0);
    }\`, uDown);

  const uUp = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}, uScale:{value:1.0}};
  const matUp = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uScale; varying vec2 vUv;
    vec3 S(vec2 o){ return texture2D(tSrc, vUv+o*uTexel*uScale).rgb; }
    void main(){
      vec3 r = S(vec2(-1.,1.)) + S(vec2(0.,1.))*2.0 + S(vec2(1.,1.))
             + S(vec2(-1.,0.))*2.0 + S(vec2(0.,0.))*4.0 + S(vec2(1.,0.))*2.0
             + S(vec2(-1.,-1.)) + S(vec2(0.,-1.))*2.0 + S(vec2(1.,-1.));
      gl_FragColor = vec4(r/16.0, 1.0);
    }\`, uUp, THREE.AdditiveBlending);

  const uComp = {tScene:{value:null}, tBloom:{value:null}, uStrength:{value:P.bloomS}, uVig:{value:P.vig},
                 uAspect:{value:1.777}, uHorizon:{value:0.5}, uSun:{value:new THREE.Vector2(0.58,0.5)}};
  /* the sun is a direction in the world, projected through the camera every
     frame, so the disc in the sky and the haze on the range never drift apart */
  const sunDir = new THREE.Vector3();
  const skyPt = new THREE.Vector3();
  /* the bearing is in radians off the view axis, and a narrow frame subtends
     fewer of them — so the sun is swung back toward the middle rather than being
     allowed to slide off the edge. Kept here because both the sizing rig and the
     control seam have to be able to re-aim it. */
  let frameFit = 1;
  function aimSun(){
    const az = P.sunAz*frameFit;
    U.uSunAz.value = az;
    sunDir.set(Math.sin(az)*Math.cos(P.sunEl), Math.sin(P.sunEl), -Math.cos(az)*Math.cos(P.sunEl));
  }
  const matComp = mkMat(\`
    uniform sampler2D tScene; uniform sampler2D tBloom; uniform float uStrength, uVig;
    varying vec2 vUv;
    uniform float uAspect, uHorizon;
    uniform vec2 uSun;
    /* a low sun, the band of heat it lays along the horizon, and four soft
       strata drawn across it. Below the horizon the sky is folded down hard so
       the ranges read as land rather than as more sky */
    vec3 sceneSky(vec2 uv){
      float band = uv.y - uHorizon;
      vec3 c = mix(vec3(0.1180,0.0345,0.0330), vec3(0.0086,0.0068,0.0265), smoothstep(0.02, 0.54, band));
      c = mix(vec3(0.5200,0.1560,0.0360), c, smoothstep(-0.012, 0.290, band));
      vec2 q = (uv - uSun); q.x *= uAspect;
      float d = length(q);
      c += vec3(1.00,0.62,0.24)*0.80*smoothstep(0.0300, 0.0245, d);
      c += vec3(1.00,0.42,0.12)*0.30*exp(-d*8.0);
      c += vec3(0.68,0.23,0.07)*0.10*exp(-d*2.1);
      float strata = sin(band*47.0 + 1.7)*0.5 + 0.5;
      c *= 1.0 - 0.20*smoothstep(0.62,1.0,strata)*smoothstep(0.30,0.03,band)*smoothstep(0.0,0.035,band);
      return c*mix(1.0, 0.045, smoothstep(0.035, -0.10, band));
    }
    vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055, step(vec3(0.0031308),c)); }
    void main(){
      vec3 c = sceneSky(vUv) + texture2D(tScene,vUv).rgb + texture2D(tBloom,vUv).rgb*uStrength;
      vec2 q = vUv-0.5; q.x*=1.16;
      c *= 1.0 - uVig*smoothstep(0.30, 0.92, length(q));
      c = toSRGB(clamp(c,0.0,1.0));
      float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
      c += (n-0.5)/255.0*1.6;
      gl_FragColor = vec4(c,1.0);
    }\`, uComp);

  const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const quadScene = new THREE.Scene();
  const quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), matComp);
  quadMesh.frustumCulled=false; quadScene.add(quadMesh);
  function blit(mat, target, clear){
    quadMesh.material = mat;
    renderer.setRenderTarget(target||null);
    if(clear) renderer.clear(true,false,false);
    renderer.render(quadScene, quadCam);
  }

  function build(){
    const w = canvas.clientWidth||window.innerWidth, h = canvas.clientHeight||window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w,h,false);
    renderer.autoClear = false;
    const asp = w/h, REF_ASP = 1.334;
    camZEff = P.camZ * (asp < REF_ASP ? Math.pow(REF_ASP/asp, 0.70) : 1);
    tgtYEff = P.tgtY * (asp < REF_ASP ? Math.min(1.9, Math.pow(REF_ASP/asp, 0.55)) : 1);
    camera.aspect=asp; camera.fov=P.fov; camera.updateProjectionMatrix();
    camera.clearViewOffset();
    baseOrbit();
    beadU.uPx.value = dpr; starU.uPx.value = dpr;
    uComp.uAspect.value = asp;
    U.uEyeZ.value = camZEff;
    frameFit = Math.min(1, asp/REF_ASP);
    aimSun();
    SW = Math.max(2, Math.round(w*dpr)); SH = Math.max(2, Math.round(h*dpr));
    if(rtScene) rtScene.dispose();
    mips.forEach(m=>m.dispose());
    rtScene = new THREE.WebGLRenderTarget(SW,SH,RTP);
    mips = [];
    let mw=SW, mh=SH;
    for(let i=0;i<LEVELS;i++){
      mw = Math.max(2, Math.floor(mw/2)); mh = Math.max(2, Math.floor(mh/2));
      mips.push(new THREE.WebGLRenderTarget(mw,mh,RTP));
    }
  }
  build();
  let rz; window.addEventListener('resize', ()=>{ clearTimeout(rz); rz=setTimeout(build,140); });

  function renderFrame(){
    renderer.setRenderTarget(rtScene);
    renderer.clear(true,true,false);
    renderer.render(scene, camera);

    uBright.tSrc.value = rtScene.texture;
    uBright.uTexel.value.set(1/SW, 1/SH);
    uBright.uPar.value.set(P.bloomT, 0.55, 2.6);
    blit(matBright, mips[0], true);

    for(let i=1;i<LEVELS;i++){
      uDown.tSrc.value = mips[i-1].texture;
      uDown.uTexel.value.set(1/mips[i-1].width, 1/mips[i-1].height);
      blit(matDown, mips[i], true);
    }
    for(let i=LEVELS-1;i>0;i--){
      uUp.tSrc.value = mips[i].texture;
      uUp.uTexel.value.set(1/mips[i].width, 1/mips[i].height);
      uUp.uScale.value = 0.6 + P.bloomR*1.6;
      blit(matUp, mips[i-1], false);
    }
    uComp.tScene.value = rtScene.texture;
    uComp.tBloom.value = mips[0].texture;
    uComp.uStrength.value = P.bloomS;
    uComp.uVig.value = P.vig;
    skyPt.copy(sunDir).multiplyScalar(600.0).add(camera.position).project(camera);
    uComp.uSun.value.set(skyPt.x*0.5+0.5, skyPt.y*0.5+0.5);
    skyPt.set(camera.position.x, -P.eye, camera.position.z - 6000.0).project(camera);
    uComp.uHorizon.value = skyPt.y*0.5+0.5;
    blit(matComp, null, true);
  }

  const t0=performance.now();
  function baseOrbit(){
    const dx=P.camX-P.tgtX, dy=P.camY-tgtYEff, dz=camZEff-P.tgtZ;
    orbR = Math.max(0.001, Math.hypot(dx,dy,dz));
    orbEl0 = Math.asin(dy/orbR);
    orbAz0 = Math.atan2(dx,dz);
  }
  /* the authored loop reads the wall clock straight into uTime, which a speed
     control cannot touch without the scene jumping the moment it moves. The time
     the scene sees is accumulated from that clock instead, scaled as it goes, so
     changing the rate only changes what happens next. */
  let sceneT = 0, prevT = 0;

  let mx=0,my=0,tx=0,ty=0,hov=0,hovT=0;
  /* window, not a panel: a scene-only document has no .hero, and under the
     catalog frame every descendant of body is pointer-events:none, so only a
     listener above body still sees the move. The canvas rect is the hit test. */
  window.addEventListener('pointermove', e=>{
    if(e.pointerType==='touch') return;
    const r=canvas.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    if(px<0.0||px>1.0||py<0.0||py>1.0){ hovT=0; return; }
    tx=px-0.5; ty=py-0.5; hovT=1;
  }, {passive:true});
  window.addEventListener('pointerleave', ()=>{ hovT=0; });
  document.addEventListener('mouseleave', ()=>{ hovT=0; });

  let visible = true, onScreen = true;
  document.addEventListener('visibilitychange', ()=>{ visible = !document.hidden; });
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{ onScreen = es[0].isIntersecting; }, {threshold:0}).observe(canvas);
  }
  function frame(){
    requestAnimationFrame(frame);
    if(!visible || !onScreen) return;
    const t=(performance.now()-t0)/1000;
    const dt = Math.min(0.1, Math.max(0.0, t - prevT)); prevT = t;
    sceneT += dt*P.speed;
    U.uTime.value = reduce ? 6.0 : sceneT;
    mx+=(tx-mx)*0.055; my+=(ty-my)*0.055; hov+=(hovT-hov)*0.045;
    const az = orbAz0 + P.orbAz*mx*hov;
    const el = orbEl0 - P.orbEl*my*hov;
    const ce = Math.cos(el);
    camera.position.set(P.tgtX + Math.sin(az)*orbR*ce,
                        tgtYEff + Math.sin(el)*orbR,
                        P.tgtZ + Math.cos(az)*orbR*ce);
    camera.lookAt(P.tgtX,tgtYEff,P.tgtZ);
    stars.rotation.y = 0.17*Math.sin(U.uTime.value*P.starRot*2.6);
    renderFrame();
  }
  requestAnimationFrame(()=>canvas.classList.add('on'));
  frame();

  /* One write per authored uniform a control can move, so a slider drag lands on
     the running scene without rebuilding a buffer. Everything the render pass
     already reads out of P each frame — the bloom strength, radius and threshold,
     the vignette, the star rotation — needs nothing here. */
  function applySettings(){
    U.uR0.value = P.r0; U.uTwist.value = P.twist; U.uRot.value = P.rot; U.uTwistL.value = P.twistL;
    U.uGeoA.value.set(P.curves, P.layers, P.jit);
    U.uGeoB.value.set(P.V, P.b, P.A);
    U.uGeoC.value.set(P.shell, P.clampI, 0);
    U.uGeoE.value.set(P.trunkTurb, P.crownInner);
    U.uAsym.value.set(P.dimLo, P.knee);
    U.uT.value.set(P.t1, P.t2, P.t3, P.t3r);
    U.uF.value.set(P.f1, P.f2, P.f3, P.tw);
    U.uInt.value = P.inten;
    U.uDens.value.set(P.dens, P.densK, P.fog);
    U.uGain.value.set(P.gainP, P.gainA, P.gainB);
    beadU.uBeadI.value = P.beadI;
    webU.uWebI.value = P.webI;
    starU.uStarI.value = P.starI;
    starU.uStarLeft.value = P.starLeft;
    U.uLand.value.set(P.eye, P.near, P.far, P.rowPow);
    U.uRange.value.set(P.detail, P.depthRate, P.drift, P.spanX);
    U.uCrest.value.set(P.crest, P.crestFall, P.glade);
    U.uCut.value.set(P.floorNear, P.floorFar, P.crestBias, P.crestGain);
    U.uFade.value.set(P.fadeNear, P.fadeFar);
    aimSun();
  }

  /* headless hooks: pause the loop, then render one frame at an exact time with
     the pointer held at (px,py) in [-0.5,0.5] — used by the preview capture */
  window.__emberline = {
    scene:'ridge', P, U,
    /* the eased pointer state the orbit is actually reading — the catalog frame
       puts pointer-events:none on every descendant of body, so this is the only
       way to prove the background is not inert */
    get pointer(){ return {x: mx, y: my, hover: hov, target: {x: tx, y: ty, hover: hovT}}; },
    pause(){ visible = false; },
    resume(){ visible = true; },
    seek(seconds, px, py){
      U.uTime.value = seconds;
      tx = mx = px || 0; ty = my = py || 0;
      hov = hovT = (px === undefined && py === undefined) ? 0 : 1;
      const az = orbAz0 + P.orbAz*mx*hov;
      const el = orbEl0 - P.orbEl*my*hov;
      const ce = Math.cos(el);
      camera.position.set(P.tgtX + Math.sin(az)*orbR*ce,
                          tgtYEff + Math.sin(el)*orbR,
                          P.tgtZ + Math.cos(az)*orbR*ce);
      camera.lookAt(P.tgtX,tgtYEff,P.tgtZ);
      stars.rotation.y = 0.17*Math.sin(U.uTime.value*P.starRot*2.6);
      renderFrame();
    },
    resize(){ build(); },
    /* the control seam: write the named tunables into P and push them at the
       running scene. The catalog frame calls this on every slider change. */
    set(values){
      Object.keys(values).forEach(function(key){ P[key] = values[key]; });
      applySettings();
    },
  };

})();
<\/script>
</body>
</html>
`,p=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Emberline Tide — moonlit ocean background</title>
<meta name="description" content="A field of hairline filaments laid flat as open water: long swells running toward the viewer under a night sky, with the moon laying a glade down the frame.">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#03060f">
<style>
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #03060f;
    overflow: hidden;
  }
  /* the authored 1.4s reveal, kept: the canvas fades up once the first frame
     has been composited rather than snapping on mid-warm-up */
  #gl {
    position: fixed;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1.4s ease;
  }
  #gl.on { opacity: 1 }
</style>
</head>
<body>
<!--
  Emberline Tide — the field laid flat as open water: every curve is one line
  of the surface at its own distance, and the moon's bearing drives both the
  glade and the crest glints through the authored intensity math.

  Everything that draws below is lifted out of the authored Emberline hero
  (public/landing-pages/emberline-hero.html): the curve buffer layout, the
  line/bead/web/star intensity math, the six-level bloom chain, the composite
  with its vignette and dither, the sizing rig and the frame loop. This scene's
  own regions are the P tunables, its extra uniforms, curvePos, the four palettes
  and the composite sky. Regenerate with:

      node scripts/build-emberline-scenes.mjs tide
-->
<canvas id="gl" aria-hidden="true"></canvas>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>

<script>
/* ------------------------------------------------------------------
   Vortex line field
------------------------------------------------------------------ */
(function(){
  const canvas = document.getElementById('gl');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:false, alpha:false, powerPreference:'high-performance'});
  renderer.setClearColor(0x000000, 1);
  renderer.outputEncoding = THREE.LinearEncoding;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 800);

  /* ---------------- tunables ---------------- */
  const P = {
    curves:520, samples:190,
    r0:0.16, layers:1, jit:0.55,       // one row per curve; jit scatters their depth
    /* V is reused as the slope gain that becomes vOut; b, A, shell, crown* and
       root* belong to the catenoid the authored page draws and are unused here,
       kept so the uniform rig builds unchanged */
    V:12.0, b:1.47, A:0.640, shell:0.35, clampI:7.0, dimLo:0.35, knee:1.00, flat:0.20, cap:0.38,
    crownR:5.00, crownPow:1.35, crownInner:0.32,
    Vd:10.8, trunkB:1.90, capDn:0.12, trunkTurb:0.50,
    rootStart:3.4, rootR:3.20, rootPow:1.55,
    twist:1.40, twistL:0.12, rot:0.0,
    /* the water carries its own motion; the turbulence field is left off */
    t1:0.0, t2:0.0, t3:0.0, t3r:0.0,
    f1:0.300, f2:0.620, f3:0.110, tw:0.9, twBase:0.80,
    inten:0.160, dens:6.00, densK:0.42, fog:0.0060, gainP:1.7, gainA:0.95, gainB:0.34,
    beadI:0.30, webI:0.04, starI:1.30, starRot:0.010, starLeft:0.0,

    /* the plane: eye height above the water, the nearest and farthest rows,
       how the rows are distributed, and the screen span every row is given */
    eye:1.00, near:1.75, far:150.0, rowPow:1.30, spanX:2.30,
    /* the swell: height, how fast it flattens with distance, and the two scales
       the long sets and the chop are built from */
    swell:0.260, calm:0.00035, setScale:0.550, chop:1.30,
    /* the moon's bearing and elevation, in radians off the view axis */
    moonAz:0.30, moonEl:0.205,
    speed:1.0,                         // the rate the scene clock runs at

    camX:0.0, camY:0.0, camZ:7.0, tgtX:0.0, tgtY:0.45, tgtZ:0.0, fov:50,
    bloomS:0.86, bloomR:1.05, bloomT:0.16, vig:0.50,
    orbAz:0.13, orbEl:0.045,
  };  if(Math.min(window.innerWidth, window.innerHeight) < 760 || window.innerWidth < 900) P.curves = 380;

  const U = {
    uTime:{value:0},
    uR0:{value:P.r0}, uTwist:{value:P.twist}, uRot:{value:P.rot}, uTwistL:{value:P.twistL},
    uGeoA:{value:new THREE.Vector3(P.curves,P.layers,P.jit)},
    uGeoB:{value:new THREE.Vector3(P.V,P.b,P.A)},
    uGeoC:{value:new THREE.Vector3(P.shell,P.clampI,0)},
    uGeoD:{value:new THREE.Vector3(P.Vd,P.trunkB,P.capDn)},
    uGeoE:{value:new THREE.Vector2(P.trunkTurb,P.crownInner)},
    uGeoF:{value:new THREE.Vector2(P.crownR,P.crownPow)},
    uRoot:{value:new THREE.Vector3(P.rootStart,P.rootR,P.rootPow)},
    uAsym:{value:new THREE.Vector2(P.dimLo,P.knee)},
    uAsym2:{value:new THREE.Vector2(P.flat,P.cap)},
    uT:{value:new THREE.Vector4(P.t1,P.t2,P.t3,P.t3r)},
    uF:{value:new THREE.Vector4(P.f1,P.f2,P.f3,P.tw)},
    uTw2:{value:new THREE.Vector2(P.twBase,0)},
    uInt:{value:P.inten}, uDens:{value:new THREE.Vector3(P.dens,P.densK,P.fog)},
    uGain:{value:new THREE.Vector3(P.gainP,P.gainA,P.gainB)},
    uSea:{value:new THREE.Vector4(P.eye,P.near,P.far,P.rowPow)},
    uSwell:{value:new THREE.Vector4(P.swell,P.setScale,P.chop,P.spanX)},
    uCalm:{value:P.calm}, uEyeZ:{value:P.camZ}, uMoonAz:{value:P.moonAz},
  };

  const COMMON = \`
  #define TAU 6.28318530718
  uniform float uTime;
  uniform float uR0, uTwist, uRot, uTwistL;
  uniform vec3  uGeoA;  // curves, layers, jitter
  uniform vec3  uGeoB;  // V, b, A
  uniform vec3  uGeoC;  // shell, clampI, -
  uniform vec3  uGeoD;  // Vdown, trunkB, capDown
  uniform vec2  uGeoE;  // trunk turbulence damping, -
  uniform vec2  uGeoF;  // crown radius, crown spread exponent
  uniform vec3  uRoot;  // root start depth, root radius, root spread exponent
  uniform vec2  uAsym;  // lowGain, knee
  uniform vec2  uAsym2; // flat, cap
  uniform vec4  uT, uF;
  uniform vec2  uTw2; // base turbulence weight at axis, -
  uniform float uInt;
  uniform vec3  uDens, uGain;
  uniform vec4  uSea;    // eye height, nearest row, farthest row, row distribution
  uniform vec4  uSwell;  // swell height, long-set scale, chop scale, screen span
  uniform float uCalm;   // how fast the swell flattens off toward the horizon
  uniform float uEyeZ;   // the world Z the rows are measured back from
  uniform float uMoonAz; // the moon's bearing; the glade follows it

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float sinh_(float x){ return 0.5*(exp(x)-exp(-x)); }
  float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; p*=p+p; return fract(p); }

  vec3 turbulence(vec3 p, float R){
    float t = uTime;
    float w = uTw2.x + (1.0-uTw2.x)*R/(R+uF.w);
    vec3 q1 = p*uF.x + vec3(0.0, -t*0.052, 4.7);
    vec3 d1 = vec3(snoise(q1), snoise(q1+vec3(31.4,17.2,9.1)), snoise(q1+vec3(-13.7,45.3,22.8)));
    vec3 q2 = p*uF.y + vec3(t*0.062, 0.0, -2.3);
    vec3 d2 = vec3(snoise(q2), snoise(q2+vec3(7.7,3.3,21.9)), snoise(q2+vec3(19.1,-8.4,5.5)));
    vec3 q3 = p*uF.z + vec3(-1.9, -t*0.038, 0.6);
    vec3 d3 = vec3(snoise(q3), snoise(q3+vec3(51.4,-7.2,3.1)), snoise(q3+vec3(3.7,15.3,-42.8)));
    return (d1*uT.x + d2*uT.y)*w + d3*(uT.z + R*uT.w);
  }

  float cosh_(float x){ return 0.5*(exp(x)+exp(-x)); }
  float tanh_(float x){ float e=exp(2.0*x); return (e-1.0)/(e+1.0); }

  // catenoid "trumpet" of revolution, one curve per meridian, twisted like a vortex
  /* the surface height at one point, sampled twice per vertex so the slope
     toward the viewer is available without a second attribute */
  float seaH(float X, float d){
    float t = uTime;
    float h  = sin(d*uSwell.y       - t*1.44 + X*0.300)*1.00;
          h += sin(d*uSwell.y*1.78  - t*1.96 + X*0.520 + 2.1)*0.44;
          h += sin(d*uSwell.y*0.56  - t*0.86 - X*0.215 + 4.3)*0.72;
          h += sin(X*uSwell.z       + d*1.35 - t*2.60)*0.26;
          h += sin(X*uSwell.z*1.69  - d*1.90 - t*3.40 + 1.7)*0.18;
    /* rows near the horizon sit further apart than the swell is long, so the
       height is flattened off before it can alias into noise — which is also
       what distant water does */
    return h*uSwell.x/(1.0 + d*d*uCalm);
  }

  // one line of the sea surface, at one distance
  vec3 curvePos(float ci, float u, out float baseR, out float vOut){
    float fi  = ci*uGeoA.x;
    float row = (fi+0.5)/uGeoA.x;                  // 0 nearest .. 1 at the horizon
    float h1  = hash11(fi*1.37+3.1);
    row = clamp(row + (h1-0.5)*uGeoA.z/uGeoA.x, 0.0, 1.0);

    /* rows are stacked so their spacing on screen is even rather than their
       spacing on the water, which is why the far ones crowd the horizon by
       themselves and no extra falloff is needed */
    float inv  = mix(1.0, uSea.y/uSea.z, pow(row, uSea.w));
    float dist = uSea.y/inv;

    float X = (u-0.5)*uSwell.w*dist;               // the same screen span for every row
    float y = seaH(X, dist) - uSea.x;
    vec3 p = vec3(X, y, uEyeZ - dist);

    /* the moonglade: the angle this point sits off the moon's bearing feeds the
       shared density term, and the slope toward the viewer feeds the shared
       asymmetry term, so the specular path comes out of the authored math */
    baseR = abs(atan(X, dist) - uMoonAz);
    vOut  = (y + uSea.x - seaH(X, dist + 0.32))*uGeoB.x;
    return p;
  }
  \`;

  /* ---------------- lines ---------------- */
  const N = P.curves, M = P.samples;
  const posArr = new Float32Array(N*M*3);
  const aCi = new Float32Array(N*M), aU = new Float32Array(N*M);
  const idx = new Uint32Array(N*(M-1)*2);
  let ii=0;
  for(let i=0;i<N;i++){
    const ci=(i+0.5)/N;
    for(let j=0;j<M;j++){ const k=i*M+j; aCi[k]=ci; aU[k]=j/(M-1); }
    for(let j=0;j<M-1;j++){ idx[ii++]=i*M+j; idx[ii++]=i*M+j+1; }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posArr,3));
  geo.setAttribute('aCi', new THREE.BufferAttribute(aCi,1));
  geo.setAttribute('aU', new THREE.BufferAttribute(aU,1));
  geo.setIndex(new THREE.BufferAttribute(idx,1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);

  const lineMat = new THREE.ShaderMaterial({
    uniforms:U, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      varying vec3 vCol;
      void main(){
        float g1=hash11(aCi*913.7+3.3), g2=hash11(aCi*47.11+77.7), g3=hash11(aCi*221.9+13.1);
        float u = mix(0.006+0.055*g2, 0.994-0.055*g3, aU);
        float R, vv; vec3 p = curvePos(aCi,u,R,vv);
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_Position = projectionMatrix*mv;
        float dens = 1.0/(uDens.y + R*uDens.x);
        float gain = uGain.z + uGain.y*pow(g1, uGain.x);
        float breathe = 0.34 + 1.5*pow(0.5+0.5*sin(uTime*0.22+g2*TAU), 3.0);
        float edge = smoothstep(0.0,0.05,aU)*smoothstep(1.0,0.95,aU);
        float dist = length(mv.xyz);
        float asym = mix(uAsym.x, 1.0, smoothstep(-uAsym.y, uAsym.y, vv));
        float I = (0.16+3.3*dens)*gain*breathe*edge*exp(-dist*uDens.z)*uInt*asym;
        I = uGeoC.y*I/(uGeoC.y+I);
        vCol = mix(vec3(0.024,0.088,0.300), vec3(0.74,0.87,1.00), clamp(I*0.42,0.0,1.0))*I;
      }\`,
    fragmentShader:\`varying vec3 vCol; void main(){ gl_FragColor=vec4(vCol,1.0);} \`
  });
  const lines = new THREE.LineSegments(geo, lineMat);
  lines.frustumCulled=false; scene.add(lines);

  /* ---------------- beads ---------------- */
  const NB=900;
  const bgeo = new THREE.BufferGeometry();
  {
    const bp=new Float32Array(NB*3), bc=new Float32Array(NB), bu=new Float32Array(NB);
    for(let i=0;i<NB;i++){ bc[i]=Math.random(); bu[i]=Math.random(); }
    bgeo.setAttribute('position', new THREE.BufferAttribute(bp,3));
    bgeo.setAttribute('aCi', new THREE.BufferAttribute(bc,1));
    bgeo.setAttribute('aU', new THREE.BufferAttribute(bu,1));
    bgeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);
  }
  const beadU = Object.assign({}, U, {uPx:{value:1}, uBeadI:{value:P.beadI}});
  const beadMat = new THREE.ShaderMaterial({
    uniforms:beadU, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      uniform float uPx, uBeadI;
      varying vec3 vCol;
      void main(){
        float g1=hash11(aCi*913.7+3.3);
        float sp = 0.050+0.090*hash11(aCi*7.7+aU*13.1);
        float u = fract(aU + uTime*sp);
        float R, vv; vec3 p = curvePos(aCi, mix(0.06,0.94,u), R, vv);
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_Position = projectionMatrix*mv;
        float dist=length(mv.xyz);
        gl_PointSize = uPx*(1.5+26.0/dist);
        float dens = 1.0/(0.55+R*1.35);
        float gain = 0.10+1.5*pow(g1,3.0);
        float fade = smoothstep(0.0,0.10,u)*smoothstep(1.0,0.90,u);
        float asym = mix(uAsym.x, 1.0, smoothstep(-uAsym.y, uAsym.y, vv));
        float Ib = (0.25+2.6*dens)*gain*fade*exp(-dist*0.030)*uBeadI*asym;
        Ib = 4.0*Ib/(4.0+Ib);
        vCol = mix(vec3(0.05,0.17,0.55), vec3(0.93,0.96,1.00), clamp(Ib*0.50,0.0,1.0))*Ib;
      }\`,
    fragmentShader:\`
      varying vec3 vCol;
      void main(){ vec2 d=gl_PointCoord-0.5; gl_FragColor=vec4(vCol*exp(-dot(d,d)*14.0),1.0); }\`
  });
  const beads=new THREE.Points(bgeo,beadMat); beads.frustumCulled=false; scene.add(beads);

  /* ---------------- constellation web ---------------- */
  const NW=520;
  const wgeo=new THREE.BufferGeometry();
  {
    const wp=new Float32Array(NW*2*3), wc=new Float32Array(NW*2), wu=new Float32Array(NW*2);
    for(let i=0;i<NW;i++){
      const ci=Math.random(), u=0.22+Math.random()*0.56;
      wc[i*2]=ci; wu[i*2]=u;
      wc[i*2+1]=ci+(Math.random()*2-1)*0.004;
      wu[i*2+1]=u+(Math.random()*2-1)*0.016;
    }
    wgeo.setAttribute('position', new THREE.BufferAttribute(wp,3));
    wgeo.setAttribute('aCi', new THREE.BufferAttribute(wc,1));
    wgeo.setAttribute('aU', new THREE.BufferAttribute(wu,1));
    wgeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 600);
  }
  const webU = Object.assign({}, U, {uWebI:{value:P.webI}});
  const webMat=new THREE.ShaderMaterial({
    uniforms:webU, transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader: COMMON + \`
      attribute float aCi; attribute float aU;
      uniform float uWebI;
      varying vec3 vCol;
      void main(){
        float R, vv; vec3 p=curvePos(aCi, clamp(aU,0.0,1.0), R, vv);
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_Position=projectionMatrix*mv;
        float dist=length(mv.xyz);
        vCol=vec3(0.05,0.15,0.42)*(uWebI*exp(-dist*0.02)/(1.0+R*0.9));
      }\`,
    fragmentShader:\`varying vec3 vCol; void main(){ gl_FragColor=vec4(vCol,1.0);} \`
  });
  const web=new THREE.LineSegments(wgeo,webMat); web.frustumCulled=false; scene.add(web);

  /* ---------------- starfield ---------------- */
  const NS = 6800;
  const starGeo = new THREE.BufferGeometry();
  {
    const sp=new Float32Array(NS*3), sd=new Float32Array(NS);
    for(let i=0;i<NS;i++){
      const u = Math.random()*2-1, th = Math.random()*Math.PI*2;
      const rr = 40 + Math.pow(Math.random(),0.5)*140;
      const s2 = Math.sqrt(Math.max(0,1-u*u));
      sp[i*3]   = Math.cos(th)*s2*rr;
      sp[i*3+1] = u*rr*0.88;
      sp[i*3+2] = Math.sin(th)*s2*rr;
      sd[i] = Math.random();
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp,3));
    starGeo.setAttribute('aSeed', new THREE.BufferAttribute(sd,1));
    starGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 200);
  }
  const starU = {uTime:U.uTime, uPx:{value:1}, uStarI:{value:P.starI}, uStarLeft:{value:P.starLeft}};
  const starMat = new THREE.ShaderMaterial({
    uniforms: starU,
    transparent:true, depthTest:false, depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexShader:\`
      attribute float aSeed;
      uniform float uTime, uPx, uStarI, uStarLeft;
      varying vec3 vCol;
      void main(){
        vec4 mv = modelViewMatrix*vec4(position,1.0);
        vec4 cp = projectionMatrix*mv;
        gl_Position = cp;
        float h  = aSeed;
        float h2 = fract(h*31.7), h3 = fract(h*97.13);
        float mag = 0.22 + 0.78*pow(h3, 1.75);
        float tw  = 0.45 + 0.55*sin(uTime*(0.35+1.9*h2) + h*41.7);
        // the copy scrim dims the left edge; pay it back so both sides read evenly
        float ndcx = cp.x/max(abs(cp.w), 0.0001);
        float lift = 1.0 + uStarLeft*smoothstep(0.40, -0.90, ndcx);
        gl_PointSize = uPx*(1.15 + 1.85*mag)*(1.0 + 0.18*(lift-1.0));
        float above = smoothstep(0.0, 0.055, position.y/max(length(position),0.001));
        vCol = mix(vec3(0.44,0.62,1.00), vec3(0.95,0.97,1.00), h2*h2) * (uStarI*mag*tw*lift*above);
      }\`,
    fragmentShader:\`
      varying vec3 vCol;
      void main(){ vec2 d=gl_PointCoord-0.5; gl_FragColor=vec4(vCol*exp(-dot(d,d)*11.0),1.0); }\`
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  scene.add(stars);

  /* ---------------- post: scene target + custom bloom ---------------- */
  const RTP = {minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
               format:THREE.RGBAFormat, type:THREE.HalfFloatType,
               depthBuffer:false, stencilBuffer:false, wrapS:THREE.ClampToEdgeWrapping, wrapT:THREE.ClampToEdgeWrapping};
  const LEVELS = 6;
  let rtScene=null, mips=[], SW=0, SH=0, camZEff=P.camZ, tgtYEff=P.tgtY;
  let orbR=1, orbAz0=0, orbEl0=0;   // spherical frame of the resting camera

  const VERT = \`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }\`;
  const mkMat = (frag, uni, blend) => new THREE.ShaderMaterial({
    uniforms:uni, vertexShader:VERT, fragmentShader:frag,
    depthTest:false, depthWrite:false,
    blending: blend||THREE.NoBlending, transparent: !!blend
  });

  const uBright = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}, uPar:{value:new THREE.Vector3(P.bloomT,0.55,2.6)}};
  const matBright = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; uniform vec3 uPar; varying vec2 vUv;
    void main(){
      vec2 t=uTexel;
      vec3 c = texture2D(tSrc,vUv+vec2(-t.x,-t.y)).rgb + texture2D(tSrc,vUv+vec2(t.x,-t.y)).rgb
             + texture2D(tSrc,vUv+vec2(-t.x, t.y)).rgb + texture2D(tSrc,vUv+vec2(t.x, t.y)).rgb;
      c *= 0.25;
      c = min(c, vec3(uPar.z));
      float l = max(c.r, max(c.g, c.b));
      gl_FragColor = vec4(c*smoothstep(uPar.x, uPar.x+uPar.y, l), 1.0);
    }\`, uBright);

  const uDown = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}};
  const matDown = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; varying vec2 vUv;
    vec3 S(vec2 o){ return texture2D(tSrc, vUv+o*uTexel).rgb; }
    void main(){
      vec3 a=S(vec2(-2.,2.)), b=S(vec2(0.,2.)), c=S(vec2(2.,2.));
      vec3 d=S(vec2(-2.,0.)), e=S(vec2(0.,0.)), f=S(vec2(2.,0.));
      vec3 g=S(vec2(-2.,-2.)),h=S(vec2(0.,-2.)),i=S(vec2(2.,-2.));
      vec3 j=S(vec2(-1.,1.)), k=S(vec2(1.,1.)), l=S(vec2(-1.,-1.)), m=S(vec2(1.,-1.));
      gl_FragColor = vec4(e*0.125 + (a+c+g+i)*0.03125 + (b+d+f+h)*0.0625 + (j+k+l+m)*0.125, 1.0);
    }\`, uDown);

  const uUp = {tSrc:{value:null}, uTexel:{value:new THREE.Vector2()}, uScale:{value:1.0}};
  const matUp = mkMat(\`
    uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uScale; varying vec2 vUv;
    vec3 S(vec2 o){ return texture2D(tSrc, vUv+o*uTexel*uScale).rgb; }
    void main(){
      vec3 r = S(vec2(-1.,1.)) + S(vec2(0.,1.))*2.0 + S(vec2(1.,1.))
             + S(vec2(-1.,0.))*2.0 + S(vec2(0.,0.))*4.0 + S(vec2(1.,0.))*2.0
             + S(vec2(-1.,-1.)) + S(vec2(0.,-1.))*2.0 + S(vec2(1.,-1.));
      gl_FragColor = vec4(r/16.0, 1.0);
    }\`, uUp, THREE.AdditiveBlending);

  const uComp = {tScene:{value:null}, tBloom:{value:null}, uStrength:{value:P.bloomS}, uVig:{value:P.vig},
                 uAspect:{value:1.777}, uHorizon:{value:0.5}, uMoon:{value:new THREE.Vector2(0.6,0.7)}};
  /* the moon is a direction in the world, projected through the camera every
     frame, so the disc in the sky and the glade on the water never drift apart */
  const moonDir = new THREE.Vector3();
  const skyPt = new THREE.Vector3();
  /* the bearing is in radians off the view axis, and a narrow frame subtends
     fewer of them — so the moon is swung back toward the middle rather than being
     allowed to slide off the edge, and the glade follows it. Kept here because
     both the sizing rig and the control seam have to be able to re-aim it. */
  let frameFit = 1;
  function aimMoon(){
    const az = P.moonAz*frameFit;
    U.uMoonAz.value = az;
    moonDir.set(Math.sin(az)*Math.cos(P.moonEl), Math.sin(P.moonEl), -Math.cos(az)*Math.cos(P.moonEl));
  }
  const matComp = mkMat(\`
    uniform sampler2D tScene; uniform sampler2D tBloom; uniform float uStrength, uVig;
    varying vec2 vUv;
    uniform float uAspect, uHorizon;
    uniform vec2 uMoon;
    /* night sky and one moon. The sea itself is left dark: every bit of light on
       the water is the line field, so the glade stays tied to the swell */
    vec3 sceneSky(vec2 uv){
      float band = uv.y - uHorizon;
      vec3 c = mix(vec3(0.0130,0.0300,0.0740), vec3(0.0016,0.0038,0.0150), smoothstep(0.0, 0.58, band));
      vec2 q = (uv - uMoon); q.x *= uAspect;
      float d = length(q);
      c += vec3(0.86,0.90,1.00)*0.95*smoothstep(0.0175, 0.0135, d);
      c += vec3(0.34,0.50,0.95)*0.20*exp(-d*13.0);
      c += vec3(0.15,0.27,0.60)*0.06*exp(-d*3.0);
      return c*mix(1.0, 0.24, smoothstep(0.004, -0.10, band));
    }
    vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055, step(vec3(0.0031308),c)); }
    void main(){
      vec3 c = sceneSky(vUv) + texture2D(tScene,vUv).rgb + texture2D(tBloom,vUv).rgb*uStrength;
      vec2 q = vUv-0.5; q.x*=1.16;
      c *= 1.0 - uVig*smoothstep(0.30, 0.92, length(q));
      c = toSRGB(clamp(c,0.0,1.0));
      float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
      c += (n-0.5)/255.0*1.6;
      gl_FragColor = vec4(c,1.0);
    }\`, uComp);

  const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const quadScene = new THREE.Scene();
  const quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2,2), matComp);
  quadMesh.frustumCulled=false; quadScene.add(quadMesh);
  function blit(mat, target, clear){
    quadMesh.material = mat;
    renderer.setRenderTarget(target||null);
    if(clear) renderer.clear(true,false,false);
    renderer.render(quadScene, quadCam);
  }

  function build(){
    const w = canvas.clientWidth||window.innerWidth, h = canvas.clientHeight||window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w,h,false);
    renderer.autoClear = false;
    const asp = w/h, REF_ASP = 1.334;
    camZEff = P.camZ * (asp < REF_ASP ? Math.pow(REF_ASP/asp, 0.70) : 1);
    tgtYEff = P.tgtY * (asp < REF_ASP ? Math.min(1.9, Math.pow(REF_ASP/asp, 0.55)) : 1);
    camera.aspect=asp; camera.fov=P.fov; camera.updateProjectionMatrix();
    camera.clearViewOffset();
    baseOrbit();
    beadU.uPx.value = dpr; starU.uPx.value = dpr;
    uComp.uAspect.value = asp;
    U.uEyeZ.value = camZEff;
    frameFit = Math.min(1, asp/REF_ASP);
    aimMoon();
    SW = Math.max(2, Math.round(w*dpr)); SH = Math.max(2, Math.round(h*dpr));
    if(rtScene) rtScene.dispose();
    mips.forEach(m=>m.dispose());
    rtScene = new THREE.WebGLRenderTarget(SW,SH,RTP);
    mips = [];
    let mw=SW, mh=SH;
    for(let i=0;i<LEVELS;i++){
      mw = Math.max(2, Math.floor(mw/2)); mh = Math.max(2, Math.floor(mh/2));
      mips.push(new THREE.WebGLRenderTarget(mw,mh,RTP));
    }
  }
  build();
  let rz; window.addEventListener('resize', ()=>{ clearTimeout(rz); rz=setTimeout(build,140); });

  function renderFrame(){
    renderer.setRenderTarget(rtScene);
    renderer.clear(true,true,false);
    renderer.render(scene, camera);

    uBright.tSrc.value = rtScene.texture;
    uBright.uTexel.value.set(1/SW, 1/SH);
    uBright.uPar.value.set(P.bloomT, 0.55, 2.6);
    blit(matBright, mips[0], true);

    for(let i=1;i<LEVELS;i++){
      uDown.tSrc.value = mips[i-1].texture;
      uDown.uTexel.value.set(1/mips[i-1].width, 1/mips[i-1].height);
      blit(matDown, mips[i], true);
    }
    for(let i=LEVELS-1;i>0;i--){
      uUp.tSrc.value = mips[i].texture;
      uUp.uTexel.value.set(1/mips[i].width, 1/mips[i].height);
      uUp.uScale.value = 0.6 + P.bloomR*1.6;
      blit(matUp, mips[i-1], false);
    }
    uComp.tScene.value = rtScene.texture;
    uComp.tBloom.value = mips[0].texture;
    uComp.uStrength.value = P.bloomS;
    uComp.uVig.value = P.vig;
    skyPt.copy(moonDir).multiplyScalar(600.0).add(camera.position).project(camera);
    uComp.uMoon.value.set(skyPt.x*0.5+0.5, skyPt.y*0.5+0.5);
    skyPt.set(camera.position.x, -P.eye, camera.position.z - 6000.0).project(camera);
    uComp.uHorizon.value = skyPt.y*0.5+0.5;
    blit(matComp, null, true);
  }

  const t0=performance.now();
  function baseOrbit(){
    const dx=P.camX-P.tgtX, dy=P.camY-tgtYEff, dz=camZEff-P.tgtZ;
    orbR = Math.max(0.001, Math.hypot(dx,dy,dz));
    orbEl0 = Math.asin(dy/orbR);
    orbAz0 = Math.atan2(dx,dz);
  }
  /* the authored loop reads the wall clock straight into uTime, which a speed
     control cannot touch without the scene jumping the moment it moves. The time
     the scene sees is accumulated from that clock instead, scaled as it goes, so
     changing the rate only changes what happens next. */
  let sceneT = 0, prevT = 0;

  let mx=0,my=0,tx=0,ty=0,hov=0,hovT=0;
  /* window, not a panel: a scene-only document has no .hero, and under the
     catalog frame every descendant of body is pointer-events:none, so only a
     listener above body still sees the move. The canvas rect is the hit test. */
  window.addEventListener('pointermove', e=>{
    if(e.pointerType==='touch') return;
    const r=canvas.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    if(px<0.0||px>1.0||py<0.0||py>1.0){ hovT=0; return; }
    tx=px-0.5; ty=py-0.5; hovT=1;
  }, {passive:true});
  window.addEventListener('pointerleave', ()=>{ hovT=0; });
  document.addEventListener('mouseleave', ()=>{ hovT=0; });

  let visible = true, onScreen = true;
  document.addEventListener('visibilitychange', ()=>{ visible = !document.hidden; });
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{ onScreen = es[0].isIntersecting; }, {threshold:0}).observe(canvas);
  }
  function frame(){
    requestAnimationFrame(frame);
    if(!visible || !onScreen) return;
    const t=(performance.now()-t0)/1000;
    const dt = Math.min(0.1, Math.max(0.0, t - prevT)); prevT = t;
    sceneT += dt*P.speed;
    U.uTime.value = reduce ? 6.0 : sceneT;
    mx+=(tx-mx)*0.055; my+=(ty-my)*0.055; hov+=(hovT-hov)*0.045;
    const az = orbAz0 + P.orbAz*mx*hov;
    const el = orbEl0 - P.orbEl*my*hov;
    const ce = Math.cos(el);
    camera.position.set(P.tgtX + Math.sin(az)*orbR*ce,
                        tgtYEff + Math.sin(el)*orbR,
                        P.tgtZ + Math.cos(az)*orbR*ce);
    camera.lookAt(P.tgtX,tgtYEff,P.tgtZ);
    stars.rotation.y = 0.17*Math.sin(U.uTime.value*P.starRot*2.6);
    renderFrame();
  }
  requestAnimationFrame(()=>canvas.classList.add('on'));
  frame();

  /* One write per authored uniform a control can move, so a slider drag lands on
     the running scene without rebuilding a buffer. Everything the render pass
     already reads out of P each frame — the bloom strength, radius and threshold,
     the vignette, the star rotation — needs nothing here. */
  function applySettings(){
    U.uR0.value = P.r0; U.uTwist.value = P.twist; U.uRot.value = P.rot; U.uTwistL.value = P.twistL;
    U.uGeoA.value.set(P.curves, P.layers, P.jit);
    U.uGeoB.value.set(P.V, P.b, P.A);
    U.uGeoC.value.set(P.shell, P.clampI, 0);
    U.uGeoE.value.set(P.trunkTurb, P.crownInner);
    U.uAsym.value.set(P.dimLo, P.knee);
    U.uT.value.set(P.t1, P.t2, P.t3, P.t3r);
    U.uF.value.set(P.f1, P.f2, P.f3, P.tw);
    U.uInt.value = P.inten;
    U.uDens.value.set(P.dens, P.densK, P.fog);
    U.uGain.value.set(P.gainP, P.gainA, P.gainB);
    beadU.uBeadI.value = P.beadI;
    webU.uWebI.value = P.webI;
    starU.uStarI.value = P.starI;
    starU.uStarLeft.value = P.starLeft;
    U.uSea.value.set(P.eye, P.near, P.far, P.rowPow);
    U.uSwell.value.set(P.swell, P.setScale, P.chop, P.spanX);
    U.uCalm.value = P.calm;
    aimMoon();
  }

  /* headless hooks: pause the loop, then render one frame at an exact time with
     the pointer held at (px,py) in [-0.5,0.5] — used by the preview capture */
  window.__emberline = {
    scene:'tide', P, U,
    /* the eased pointer state the orbit is actually reading — the catalog frame
       puts pointer-events:none on every descendant of body, so this is the only
       way to prove the background is not inert */
    get pointer(){ return {x: mx, y: my, hover: hov, target: {x: tx, y: ty, hover: hovT}}; },
    pause(){ visible = false; },
    resume(){ visible = true; },
    seek(seconds, px, py){
      U.uTime.value = seconds;
      tx = mx = px || 0; ty = my = py || 0;
      hov = hovT = (px === undefined && py === undefined) ? 0 : 1;
      const az = orbAz0 + P.orbAz*mx*hov;
      const el = orbEl0 - P.orbEl*my*hov;
      const ce = Math.cos(el);
      camera.position.set(P.tgtX + Math.sin(az)*orbR*ce,
                          tgtYEff + Math.sin(el)*orbR,
                          P.tgtZ + Math.cos(az)*orbR*ce);
      camera.lookAt(P.tgtX,tgtYEff,P.tgtZ);
      stars.rotation.y = 0.17*Math.sin(U.uTime.value*P.starRot*2.6);
      renderFrame();
    },
    resize(){ build(); },
    /* the control seam: write the named tunables into P and push them at the
       running scene. The catalog frame calls this on every slider change. */
    set(values){
      Object.keys(values).forEach(function(key){ P[key] = values[key]; });
      applySettings();
    },
  };

})();
<\/script>
</body>
</html>
`,w={bloom:m,ridge:f,tide:p};function g(t){return w[t]}const b={speed:"speed",glow:"inten",halo:"bloomS",stars:"starI"},x={vortex:{},bloom:{petals:"petals",petalWidth:"wide",openness:"lift",fluting:"veinDepth",sheen:"sheenAmt",moonBearing:"moonAz"},ridge:{peakHeight:"crest",detail:"detail",rangeDepth:"fadeFar",sunHeight:"sunEl",sunBearing:"sunAz",glade:"glade"},tide:{swell:"swell",chop:"chop",moonHeight:"moonEl",moonBearing:"moonAz",glade:"dens"}};function y(t,n){const a={...b,...x[t]??{}},e={};for(const[o,r]of Object.entries(a))n[o]!==void 0&&(e[r]=n[o]);return e}const E=["vortex","bloom","ridge","tide"],P=["speed","glow","halo","stars","petals","petalWidth","openness","fluting","sheen","peakHeight","detail","rangeDepth","sunHeight","sunBearing","swell","chop","moonHeight","moonBearing","glade"],l="web3dkit-emberline-controls",T=`<script>
window.addEventListener("message", function (event) {
  const detail = event.data;
  if (event.source !== parent || !detail || detail.type !== "${l}") return;
  if (!detail.values || typeof detail.values !== "object") return;
  window.__emberline?.set(detail.values);
});
<\/script>`;function S(t){const n={},a={...t};for(const e of P)e in a&&(n[e]=a[e],delete a[e]);return[n,a]}function R(t){const n=JSON.stringify(t);return i.useCallback(a=>{const e=JSON.parse(n);Object.keys(e).length!==0&&a.contentWindow?.postMessage({type:l,values:e},"*")},[n])}const M={vortex:"Emberline — vortex line background",bloom:"Emberline Bloom — fluorescent flower background",ridge:"Emberline Ridge — sunset range background",tide:"Emberline Tide — moonlit ocean background"};function A({variant:t="vortex",presentation:n="background",...a}){const e=E.includes(t)?t:"vortex",[o,r]=S(a),c=i.useMemo(()=>{const s=g?.(e);if(s)return h(s,{presentation:n,canvasSelector:"#gl",bridges:[T]})},[n,e]),u=R(y(e,o));return i.createElement(v,{...r,key:e,applyScene:u,backgroundCanvasSelector:n==="background"?"#gl":void 0,backgroundVisualSelector:n==="background"&&e==="vortex"?".scrim, .vign":void 0,title:n==="page"&&e==="vortex"?"Emberline — Every GPU, fully saturated":M[e],sourceUrl:"/landing-pages/emberline-hero.html",srcDoc:c})}function z(t){return d.jsx(A,{...t,presentation:"page"})}export{E as EMBERLINE_HERO_VARIANTS,A as EmberlineHero,z as EmberlinePage};
