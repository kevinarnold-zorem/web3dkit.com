import{r as n,j as u}from"./index-fOQwe-l-.js";const E=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Isometric Search</title>
<style>
  html,body{margin:0;height:100%;background:#111111;overflow:hidden}  /* matches COL.bg; JS keeps it in sync */
  canvas{display:block;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="scene"></canvas>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================
   Isometric search — an original first-party composition.

   This document began as a study after an isometric animation by Mehmet Ozsoy
   (@mehmetozsoyart) and no longer reproduces it: the viewing corner, the
   two-tier dock, the search bar and the puck sweeping it, every proportion,
   every grey, every outline weight and every motion curve are authored here.  The
   frame tables that had been measured off the reference clip are gone — the
   loop is driven by keyframed easing instead.

   Nothing is allowed to break the bar's silhouette: the puck's travel is
   bounded against the pill's end caps, and it carries no halo or contact disc
   that would spill past them.

   Everything is real 3D geometry under an orthographic isometric camera:
   flat-shaded faces plus instanced screen-space "fat line" outlines whose
   weight varies per edge.  Dark mode is a single tone curve over the palette
   (see DARK below).  World units == pixels of the 1604x1080 design frame.

   True isometric, viewed from the (-1, 1, 1) corner:
     sx = 0.8660254*(X + Z) + 802.00
     sy = 0.5*(Z - X) - Y   + 556.00
   Depth toward the camera grows with (-X + Y + Z), so every "nudge toward the
   camera" in this file is (-e, e, e) and leaves screen position untouched.
   ============================================================ */

const DW = 1604, DH = 1080;
const C30 = Math.cos(Math.PI/6);
const OX = 802.00, OY = 556.00;
const FPS = 60, NF = 200;

/* ---------- tone ----------------------------------------------------------
   The piece is greyscale, so dark mode is one curve rather than a second
   palette: every grey is inverted and compressed into [LO,HI], which keeps the
   drawing's contrast relationships intact.  Paper goes near-black, ink goes
   near-white, the black rail face becomes light and its dark detail becomes
   the drawing's shadow.  DARK=false gives the light original.
   -------------------------------------------------------------------------- */
const DARK = true;
const TONE_LO = 8, TONE_HI = 246;
function tone(v){
  v = Math.max(0, Math.min(255, v));
  return DARK ? TONE_LO + (255-v)/255*(TONE_HI-TONE_LO) : v;
}
function grey(v){ const c = Math.round(tone(v)); return (c<<16)|(c<<8)|c; }

const COL = {
  bg      : grey(246),
  flat    : grey(252),   // straight side walls
  curve   : grey(226),   // curved (corner / cap) side walls
  ink     : grey(0),
  lane    : grey(188),
  plinth  : grey(214),
  puckTop : grey(238),
  puckSide: grey(56),
  groove  : grey(255),
  fill    : grey(44),
  white   : grey(255),   // detail drawn on a lit face
  black   : grey(0)      // the lit faces themselves
};
/* outline ink weights, in design px of black */
const W_BASE  = { front:2.40, backBase:0.55, backSkew:-0.20 };
const W_PLINTH= { front:2.60, backBase:1.40, backSkew:0 };
const W_RAIL  = { front:2.80, backBase:2.80, backSkew:0 };
const W_RAILB = { front:4.00, backBase:2.80, backSkew:0 };
const W_PUCK  = { front:3.60, backBase:2.60, backSkew:0 };
const W_LANE  = 3.2;
const SHADOW_A = 0.062;

/* ---------- the dock ---------- */
const BASE   = { X:520, Z:520, H:32, R:112 };
const PLINTH = { X:400, Z:400, H:22, R:86 };
const PLINTH_Y = BASE.H + PLINTH.H;
/* the bar lies flat on the plinth, long axis on world X */
const BAR    = { hw:170, hd:74, H:26, R:74 };
const BAR_Y  = PLINTH_Y + BAR.H;
const PUCK   = { r:40, h:20, z:-14, travel:112 };
const GROOVE = { z:-14, hw:124, hd:11 };
const TICK_Z = 46;

/* ============================================================
   renderer / camera
   ============================================================ */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, preserveDrawingBuffer:true});
renderer.setClearColor(COL.bg, 1);
document.body.style.background = '#' + COL.bg.toString(16).padStart(6,'0');
renderer.sortObjects = true;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1,1,1,-1,-6000,6000);
const K = 1/Math.sqrt(2/3);
(function(){
  /* look at the world point the design frame is centred on */
  const t1 = (DW/2 - OX)/C30;        // X + Z
  const t2 = (DH/2 - OY);            // 0.5*(Z - X), with Y = 0
  const X = (t1 - 2*t2)/2, Z = (t1 + 2*t2)/2;
  camera.position.set(X-2000, 2000, Z+2000);
  camera.lookAt(X,0,Z);
})();

const FITW = 1010, FITH = 680;  // fit box: the drawing plus its margin, both axes
const lineMats = [];
let viewScale = 1;
function resize(){
  const w = canvas.clientWidth||DW, h = canvas.clientHeight||DH;
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w,h,false);
  viewScale = Math.min(w/FITW, h/FITH);
  const cw = (w/viewScale)/K, ch = (h/viewScale)/K;
  camera.left=-cw/2; camera.right=cw/2; camera.top=ch/2; camera.bottom=-ch/2;
  camera.updateProjectionMatrix();
  const rx=w*dpr, ry=h*dpr;
  lineMats.forEach(m=>{ m.uniforms.resolution.value.set(rx,ry); m.uniforms.pxScale.value = viewScale*dpr; });
  placeSquares();
}
/* place an object's origin on a design-frame screen point, at a chosen depth */
function fromScreen(sx, sy, z){
  const x = (sx-OX)/C30 - z;
  const y = 0.5*(z-x) - (sy-OY);
  return new THREE.Vector3(x,y,z);
}

/* ============================================================
   instanced fat lines (orthographic camera only)
   ============================================================ */
const LINE_VS = \`
attribute vec3 aStart; attribute vec3 aEnd; attribute float aWidth;
uniform vec2 resolution; uniform float pxScale; uniform float bias;
void main(){
  vec4 s = projectionMatrix * modelViewMatrix * vec4(aStart,1.0);
  vec4 e = projectionMatrix * modelViewMatrix * vec4(aEnd,1.0);
  vec2 hs = resolution*0.5;
  vec2 ps = s.xy*hs, pe = e.xy*hs;
  vec2 d = pe-ps; float L = length(d);
  d = (L>0.0001)? d/L : vec2(1.0,0.0);
  vec2 n = vec2(-d.y,d.x);
  float hw = aWidth*pxScale*0.5;
  vec2 p = mix(ps,pe,position.x) + n*(position.y*hw) + d*((position.x*2.0-1.0)*hw);
  gl_Position = vec4(p/hs, mix(s.z,e.z,position.x) - bias, 1.0);
}\`;
const LINE_FS = \`uniform vec3 diffuse; uniform float opacity;
void main(){ gl_FragColor = vec4(diffuse, opacity); }\`;

function lineMaterial(color, bias, opacity){
  const m = new THREE.ShaderMaterial({
    uniforms:{ diffuse:{value:new THREE.Color(color)}, opacity:{value:opacity===undefined?1:opacity},
      resolution:{value:new THREE.Vector2(DW,DH)}, pxScale:{value:1}, bias:{value:bias||0.0004} },
    vertexShader:LINE_VS, fragmentShader:LINE_FS,
    transparent:(opacity!==undefined && opacity<1), depthWrite:!(opacity!==undefined && opacity<1)
  });
  lineMats.push(m); return m;
}
const QUADPOS = new THREE.Float32BufferAttribute([0,-1,0, 1,-1,0, 1,1,0, 0,-1,0, 1,1,0, 0,1,0],3);
function makeLines(segs, widths, material){
  const n = segs.length/6;
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', QUADPOS);
  const a=new Float32Array(n*3), b=new Float32Array(n*3), w=new Float32Array(n);
  for(let i=0;i<n;i++){
    for(let k=0;k<3;k++){ a[i*3+k]=segs[i*6+k]; b[i*3+k]=segs[i*6+3+k]; }
    w[i] = (typeof widths==='number') ? widths : widths[i];
  }
  g.setAttribute('aStart', new THREE.InstancedBufferAttribute(a,3));
  g.setAttribute('aEnd',   new THREE.InstancedBufferAttribute(b,3));
  g.setAttribute('aWidth', new THREE.InstancedBufferAttribute(w,1));
  g.instanceCount = n;
  const m = new THREE.Mesh(g, material); m.frustumCulled = false;
  return m;
}

/* ============================================================
   outline / prism helpers   (shapes live in the XZ plane, extruded on Y)
   ============================================================ */
function rrOutline(hw, hd, r, seg){
  r = Math.min(r, hw, hd);
  const pts=[], kind=[], nrm=[];
  const cs=[[hw-r,hd-r,0],[-(hw-r),hd-r,Math.PI/2],[-(hw-r),-(hd-r),Math.PI],[hw-r,-(hd-r),Math.PI*1.5]];
  for(let c=0;c<4;c++){
    const [cx,cz,a0]=cs[c];
    for(let i=0;i<=seg;i++){
      const a=a0+i/seg*Math.PI/2;
      pts.push([cx+r*Math.cos(a), cz+r*Math.sin(a)]);
      kind.push(i<seg?1:0);
      const am = (i<seg) ? a0+(i+0.5)/seg*Math.PI/2 : a0+Math.PI/2;
      nrm.push([Math.cos(am), Math.sin(am)]);
    }
  }
  return {pts,kind,nrm};
}
/* +1 when the edge faces the camera.  The camera sits on -X/+Z, so the
   in-plane direction toward it is (-1, 1)/sqrt(2) — in a plate's own frame too,
   because a plate is only ever rotated -90 degrees about X here. */
function edgeWeight(n, cfg){
  const d = (-n[0]+n[1])*0.7071;
  const t = Math.min(1, Math.max(0, (d+0.7071)/1.4142));
  const back = cfg.backBase + cfg.backSkew*(n[0]+n[1]);
  return back + (cfg.front-back)*t;
}
function prismGeom(outline, y0, y1, curveShade, noBottom){
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  const cap=[], flat=[], curve=[], ccol=[];
  let cx=0, cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    cap.push(cx,y1,cz, b[0],y1,b[1], a[0],y1,a[1]);
    if(!noBottom) cap.push(cx,y0,cz, a[0],y0,a[1], b[0],y0,b[1]);
  }
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    const t = kind[i]? curve : flat;
    t.push(a[0],y0,a[1], b[0],y1,b[1], b[0],y0,b[1]);
    t.push(a[0],y0,a[1], a[0],y1,a[1], b[0],y1,b[1]);
    if(kind[i] && curveShade){
      const c = curveShade(nrm[i][0], nrm[i][1]);
      for(let q=0;q<6;q++) ccol.push(c.r,c.g,c.b);
    }
  }
  const all = cap.concat(flat, curve);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(all,3));
  if(curveShade){
    const col=new Float32Array(all.length);
    for(let i=0;i<col.length;i++) col[i]=1;
    const off=cap.length+flat.length;
    for(let i=0;i<ccol.length;i++) col[off+i]=ccol[i];
    g.setAttribute('color', new THREE.BufferAttribute(col,3));
  }
  g.addGroup(0, cap.length/3, 0);
  g.addGroup(cap.length/3, flat.length/3, 1);
  g.addGroup((cap.length+flat.length)/3, curve.length/3, 2);
  return g;
}
/* outline segments + matching per-segment weights.  nudge pushes the line
   toward the camera so it wins the depth test against the wall it sits on;
   screen position is unchanged. */
function prismLines(outline, y0, y1, cfg, cfgBot, nudge){
  cfgBot = cfgBot || cfg;
  const [ex,ey,ez] = nudge || [-3,3,3];
  const segs=[], w=[];
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    segs.push(a[0]+ex,y1+ey,a[1]+ez, b[0]+ex,y1+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfg));
    segs.push(a[0]+ex,y0+ey,a[1]+ez, b[0]+ex,y0+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfgBot));
  }
  const len=(i)=>{const a=pts[i],b=pts[(i+1)%n];return Math.hypot(a[0]-b[0],a[1]-b[1]);};
  for(let i=0;i<n;i++){
    const j=(i-1+n)%n;
    if(kind[j]!==kind[i] && len(j)>0.5 && len(i)>0.5){
      const p=pts[i];
      segs.push(p[0]+ex,y0+ey,p[1]+ez, p[0]+ex,y1+ey,p[1]+ez);
      w.push(edgeWeight(nrm[i], cfg));
    }
  }
  return {segs, w};
}
function loopSegs(pts, y, out){
  out = out||[];
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    out.push(a[0],y,a[1], b[0],y,b[1]);
  }
  return out;
}
function fanGeom(pts, y){
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  const a=[];
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    a.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}
function ringSegs(cx, y, cz, r, seg, out){
  out = out||[];
  for(let i=0;i<seg;i++){
    const a0=i/seg*Math.PI*2, a1=(i+1)/seg*Math.PI*2;
    out.push(cx+r*Math.cos(a0), y, cz+r*Math.sin(a0), cx+r*Math.cos(a1), y, cz+r*Math.sin(a1));
  }
  return out;
}
/* an evenly distributed dashed loop, for the plinth's inset seam */
function dashLoop(pts, y, dash, gap, out){
  out = out||[];
  const n=pts.length, acc=[0];
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    acc.push(acc[i] + Math.hypot(b[0]-a[0], b[1]-a[1]));
  }
  const total=acc[n];
  const at=(s)=>{
    s=((s%total)+total)%total;
    let i=0; while(i<n-1 && acc[i+1] < s) i++;
    const a=pts[i], b=pts[(i+1)%n];
    const f=(s-acc[i])/Math.max(1e-6, acc[i+1]-acc[i]);
    return [a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f];
  };
  const step=dash+gap, k=Math.max(1, Math.round(total/step)), d=total/k;
  for(let i=0;i<k;i++){
    const P=at(i*d), Q=at(i*d + d*dash/step);
    out.push(P[0],y,P[1], Q[0],y,Q[1]);
  }
  return out;
}

/* ============================================================
   textures
   ============================================================ */
function grainTexture(size, base, amp){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  let s=20261;
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  for(let i=0;i<size*size;i++){
    const r=(rnd()+rnd()+rnd()+rnd()-2)/2;
    let v = base + amp*r - amp*1.6*Math.pow(rnd(),3);
    v = tone(v);
    img.data[i*4]=img.data[i*4+1]=img.data[i*4+2]=v; img.data[i*4+3]=255;
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
const baseGrain   = grainTexture(512, 241, 11);
const plinthGrain = grainTexture(512, 213, 9);
const GRAIN_SCALE = 700;

/* ============================================================
   materials
   ============================================================ */
const matBaseTop   = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:baseGrain,   side:THREE.DoubleSide});
const matPlinthTop = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:plinthGrain, side:THREE.DoubleSide});
const matFlat  = new THREE.MeshBasicMaterial({color:COL.flat,  side:THREE.DoubleSide});
const matCurve = new THREE.MeshBasicMaterial({color:COL.curve, side:THREE.DoubleSide});
const matCurveVC= new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide, vertexColors:true});
const matBlack = new THREE.MeshBasicMaterial({color:COL.black, side:THREE.DoubleSide});
const inkMat   = lineMaterial(COL.ink, 0.00020);
const laneMat  = lineMaterial(COL.lane, 0.00025);
const shadowMat= new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:SHADOW_A, depthWrite:false});

/* the pill's end caps turn through the light instead of sitting under one flat grey */
const shadeRail = (nx,nz)=>{
  const d = (-nx+nz)*0.7071;                 // +1 where the shoulder faces the camera
  return new THREE.Color(grey(150 - 95*d));
};

/* ============================================================
   base slab
   ============================================================ */
const baseOut = rrOutline(BASE.X/2, BASE.Z/2, BASE.R, 16);
{
  const g = prismGeom(baseOut, 0, BASE.H, null, true);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+BASE.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+BASE.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  scene.add(new THREE.Mesh(g,[matBaseTop,matFlat,matCurve]));
  const L = prismLines(baseOut, 0, BASE.H, W_BASE);
  scene.add(makeLines(L.segs, L.w, inkMat));
  /* the slab's own shadow on the floor, thrown away from the camera */
  const sh = new THREE.Mesh(fanGeom(baseOut.pts, 0), shadowMat);
  sh.position.set(50, -0.6, -22); sh.renderOrder = -1; scene.add(sh);
}
/* two lane marks, running out to the slab's free corners */
{
  const segs=[];
  for(const s of [-1, 1]){
    const o = rrOutline(168, 30, 30, 12);
    loopSegs(o.pts.map(p=>[p[0], p[1]+s*222]), BASE.H, segs);
  }
  scene.add(makeLines(segs, W_LANE, laneMat));
}

/* ============================================================
   plinth
   ============================================================ */
const plinthOut = rrOutline(PLINTH.X/2, PLINTH.Z/2, PLINTH.R, 14);
{
  const g = prismGeom(plinthOut, BASE.H, PLINTH_Y, null, true);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+PLINTH.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+PLINTH.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  scene.add(new THREE.Mesh(g,[matPlinthTop,matFlat,matCurve]));
  const L = prismLines(plinthOut, BASE.H, PLINTH_Y, W_PLINTH);
  scene.add(makeLines(L.segs, L.w, inkMat));
  const det = new THREE.Group(); det.position.set(-2.5, 2.5, 2.5); scene.add(det);
  det.add(makeLines(dashLoop(rrOutline(PLINTH.X/2-20, PLINTH.Z/2-20, PLINTH.R-10, 10).pts, PLINTH_Y, 10, 8, []), 2.0, laneMat));
}

/* ============================================================
   the search bar — a pill lying flat on the plinth, long axis on world X.
   Its top is the one lit face, so the groove, fill and ticks on it are drawn
   in dark ink on light, and every one of them is kept inside its outline.
   ============================================================ */
const barOut = rrOutline(BAR.hw, BAR.hd, BAR.R, 22);
{
  scene.add(new THREE.Mesh(prismGeom(barOut, PLINTH_Y, BAR_Y, shadeRail, true),[matBlack,matFlat,matCurveVC]));
  const L = prismLines(barOut, PLINTH_Y, BAR_Y, W_RAIL, W_RAILB);
  scene.add(makeLines(L.segs, L.w, inkMat));
  /* the bar's contact shadow on the plinth, thrown away from the camera */
  const sh = new THREE.Mesh(fanGeom(barOut.pts, 0), shadowMat);
  sh.position.set(26, PLINTH_Y+0.3, -14); sh.renderOrder = -1; scene.add(sh);
}

/* ---- groove, fill and tick marks on the lit top face ---- */
let fillGroup = null;
const ticks = [];
{
  const go = rrOutline(GROOVE.hw, GROOVE.hd, GROOVE.hd, 8);
  scene.add(new THREE.Mesh(fanGeom(go.pts.map(p=>[p[0], p[1]+GROOVE.z]), BAR_Y+0.3),
    new THREE.MeshBasicMaterial({color:COL.groove, side:THREE.DoubleSide})));
  fillGroup = new THREE.Group();
  fillGroup.position.set(-GROOVE.hw, BAR_Y+0.6, GROOVE.z);
  scene.add(fillGroup);
  const fo = rrOutline(GROOVE.hw, GROOVE.hd-2.5, GROOVE.hd-2.5, 8);
  const fm = new THREE.Mesh(fanGeom(fo.pts, 0), new THREE.MeshBasicMaterial({color:COL.fill, side:THREE.DoubleSide}));
  fm.position.x = GROOVE.hw; fillGroup.add(fm);
  for(const x of [-PUCK.travel, 0, PUCK.travel]){
    const t = rrOutline(12, 4, 4, 4);
    const mat = new THREE.MeshBasicMaterial({color:grey(140), side:THREE.DoubleSide});
    scene.add(new THREE.Mesh(fanGeom(t.pts.map(p=>[p[0]+x, p[1]+TICK_Z]), BAR_Y+0.3), mat));
    ticks.push(mat);
  }
}

/* ---- the search puck riding the groove ---- */
const puck = new THREE.Group(); scene.add(puck);
{
  const o = rrOutline(PUCK.r, PUCK.r, PUCK.r, 30);
  const mTop  = new THREE.MeshBasicMaterial({color:COL.puckTop,  side:THREE.DoubleSide});
  const mSide = new THREE.MeshBasicMaterial({color:COL.puckSide, side:THREE.DoubleSide});
  puck.add(new THREE.Mesh(prismGeom(o, BAR_Y, BAR_Y+PUCK.h, null, true),[mTop,mSide,mSide]));
  const L = prismLines(o, BAR_Y, BAR_Y+PUCK.h, W_PUCK);
  puck.add(makeLines(L.segs, L.w, inkMat));

  /* search glyph: a ring with its handle running out along +Z, sized to stay
     well inside the puck's own rim */
  const gl = new THREE.Group(); gl.position.y = BAR_Y + PUCK.h + 0.6; puck.add(gl);
  const RR = 14.5, RW = 4.6, HW = 5.2, GAP = 2.2, HL = 16.0;
  const cx = -3.0, cz = -5.0;
  gl.add(makeLines(ringSegs(cx, 0, cz, RR, 64, []), RW, inkMat));
  const r0 = RR + RW/2 + GAP;
  gl.add(makeLines([cx, 0, cz+r0, cx, 0, cz+r0+HL], HW, inkMat));
}

/* ============================================================
   decorative squares (screen-space, multiply-like)
   ============================================================ */
const squares = new THREE.Group(); scene.add(squares);
{
  const defs=[[1178,236,48,0.055],[1242,306,48,0.030],[366,536,48,0.055],[302,606,48,0.030]];
  for(const [sx,sy,s,al] of defs){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),
      new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:al, depthTest:false, depthWrite:false}));
    m.renderOrder = 100;
    m.userData.screen=[sx+s/2, sy+s/2];
    squares.add(m);
  }
}
function placeSquares(){
  for(const m of squares.children){
    const [sx,sy]=m.userData.screen;
    const p = fromScreen(sx, sy, -520);
    m.position.copy(p);
    m.quaternion.copy(camera.quaternion);
  }
}

/* ============================================================
   animation — keyframed, not measured.  The puck sweeps the bar through
   three stops and sweeps back; the fill and the ticks both read off that one
   curve.
   ============================================================ */
const clamp01 = (v)=>v<0?0:v>1?1:v;
const smooth  = (v)=>{ v=clamp01(v); return v*v*(3-2*v); };
function track(keys, t){
  if(t <= keys[0][0]) return keys[0][1];
  for(let i=1;i<keys.length;i++){
    if(t <= keys[i][0]){
      const a=keys[i-1], b=keys[i];
      return a[1] + (b[1]-a[1])*smooth((t-a[0])/(b[0]-a[0]));
    }
  }
  return keys[keys.length-1][1];
}
const SWEEP = [[0,0],[18,0],[52,0.5],[76,0.5],[110,1],[142,1],[182,0],[200,0]];
const STOPS = [0, 0.5, 1];

function setFrame(t){
  const level = track(SWEEP, t);                       // 0 at the left stop, 1 at the right
  const x = -PUCK.travel + 2*PUCK.travel*level;
  puck.position.set(x, 0, PUCK.z);                     // the geometry carries its own height

  /* the groove fills across to the puck */
  fillGroup.scale.x = Math.max((2*PUCK.travel*level + 8) / (2*GROOVE.hw), 0.0001);

  /* each tick strikes as the puck reaches it */
  for(let i=0;i<ticks.length;i++){
    const on = clamp01((level - (STOPS[i]-0.04)) / 0.08);
    ticks[i].color.setScalar(tone(140 + 115*on)/255);
  }
}

/* ============================================================
   playback
   ============================================================ */
let t0=null, paused=false;
function frame(now){
  if(t0===null) t0=now;
  if(!paused){
    setFrame(((now-t0)/1000*FPS) % NF);
    renderer.render(scene,camera);
  }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', resize);
resize();
setFrame(0);
renderer.render(scene,camera);
requestAnimationFrame(frame);

window.__setFrame = function(f){ paused=true; setFrame(f); renderer.render(scene,camera); };
window.__play = function(){ paused=false; t0=null; };
<\/script>
</body>
</html>
`,w=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Isometric Keyboard</title>
<style>
  html,body{margin:0;height:100%;background:#111111;overflow:hidden}  /* matches COL.bg; JS keeps it in sync */
  canvas{display:block;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="scene"></canvas>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================
   Isometric keyboard — a minimal 24-key deck on the family's shared pad.

   A companion piece in the isometric illustration family: the same drawing
   built the same way.  Everything is real 3D geometry under an
   orthographic isometric camera — flat-shaded faces plus instanced
   screen-space "fat line" outlines whose weight varies per edge, exactly
   as the dock's ink does.  Dark mode is a single tone curve over the
   measured greys (see DARK below).
   World units == pixels of the 1604x1080 design frame.
   True isometric projection (camera direction 1,1,1):
     sx = 0.8660254*(X - Z) + 821.00
     sy = 0.5*(X + Z) - Y   + 387.66
   ============================================================ */

const DW = 1604, DH = 1080;
const C30 = Math.cos(Math.PI/6);
const OX = 821.00, OY = 387.66;
const FPS = 60;

/* ---------- tone ----------------------------------------------------------
   The whole piece is greyscale, so dark mode is one curve rather than a second
   palette: every measured grey is inverted and compressed into [LO,HI], which
   keeps the drawing's contrast relationships exactly as the dock measured them.
   Paper goes near-black, ink goes near-white, black faces become light and
   their white detail becomes dark.  DARK=false is the original.
   -------------------------------------------------------------------------- */
const DARK = true;
const TONE_LO = 8, TONE_HI = 246;
function tone(v){
  v = Math.max(0, Math.min(255, v));
  return DARK ? TONE_LO + (255-v)/255*(TONE_HI-TONE_LO) : v;
}
function grey(v){ const c = Math.round(tone(v)); return (c<<16)|(c<<8)|c; }

const COL = {              // the dock's source greys, carried over unchanged
  bg      : grey(245),
  flat    : grey(253),   // straight side walls
  curve   : grey(228),   // curved (corner / cap) side walls
  ink     : grey(0),
  lane    : grey(190),
  glyph   : grey(148),
  puckTop : grey(242),
  puckSide: grey(59),
  badge   : grey(235),
  white   : grey(255),   // detail drawn on top of a black face
  black   : grey(0),     // black top faces
  mid     : grey(120)    // secondary detail
};
/* outline ink weights measured off the reference (design px of black) */
const W_SLAB  = { front:2.32, backBase:0.485, backSkew:-0.215 };
const W_CAP   = { front:2.66, backBase:2.66, backSkew:0 };
const W_CAPB  = { front:3.90, backBase:2.66, backSkew:0 };
const W_PLAIN = { front:2.70, backBase:2.40, backSkew:0 };
const W_BADGE = { front:2.60, backBase:2.60, backSkew:0 };
const W_PUCK  = { front:3.60, backBase:2.60, backSkew:0 };
const W_KEY   = { front:2.30, backBase:1.70, backSkew:0 };
const W_LANE  = 3.5;
const SHADOW_A = 0.061;              // slab drop shadow / decorative squares
const PUCKSH = { a:0.29, r:72.5 };   // contact shadow a puck drops on what it rides

/* ---------- the shared stage ---------- */
const SLAB = { X:501.0, Z:528.8, H:42.26, R:78 };

/* ============================================================
   renderer / camera
   ============================================================ */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, preserveDrawingBuffer:true});
renderer.setClearColor(COL.bg, 1);
document.body.style.background = '#' + COL.bg.toString(16).padStart(6,'0');
renderer.sortObjects = true;
renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1,1,1,-1,-6000,6000);
const K = 1/Math.sqrt(2/3);
(function(){
  const tx=(DW/2-OX)/C30, ty=(DH/2-OY);
  const X=(ty*2+tx)/2, Z=(ty*2-tx)/2;
  camera.position.set(X+2000, 2000, Z+2000);
  camera.lookAt(X,0,Z);
})();

const FITW = 1010;          // horizontal fit box (content width + margin)
const lineMats = [];
let viewScale = 1;
function resize(){
  const w = canvas.clientWidth||DW, h = canvas.clientHeight||DH;
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w,h,false);
  // fit: exactly the reference framing at the design aspect, and a tighter
  // horizontal fit on narrow/portrait viewports so the object never gets tiny
  viewScale = Math.min(w/FITW, h/DH);
  const cw = (w/viewScale)/K, ch = (h/viewScale)/K;
  camera.left=-cw/2; camera.right=cw/2; camera.top=ch/2; camera.bottom=-ch/2;
  camera.updateProjectionMatrix();
  const rx=w*dpr, ry=h*dpr;
  lineMats.forEach(m=>{ m.uniforms.resolution.value.set(rx,ry); m.uniforms.pxScale.value = viewScale*dpr; });
  placeSquares();
}

/* place an object's origin on a design-frame screen point, at a chosen depth */
function fromScreen(sx, sy, z){
  const x = (sx-OX)/C30 + z;
  const y = 0.5*(x+z) - (sy-OY);
  return new THREE.Vector3(x,y,z);
}

/* ============================================================
   instanced fat lines (orthographic camera only)
   ============================================================ */
const LINE_VS = \`
attribute vec3 aStart; attribute vec3 aEnd; attribute float aWidth;
uniform vec2 resolution; uniform float pxScale; uniform float bias;
varying float vWX;
void main(){
  vec3 wp = (modelMatrix * vec4(mix(aStart,aEnd,position.x),1.0)).xyz;
  vWX = wp.x - wp.y;
  vec4 s = projectionMatrix * modelViewMatrix * vec4(aStart,1.0);
  vec4 e = projectionMatrix * modelViewMatrix * vec4(aEnd,1.0);
  vec2 hs = resolution*0.5;
  vec2 ps = s.xy*hs, pe = e.xy*hs;
  vec2 d = pe-ps; float L = length(d);
  d = (L>0.0001)? d/L : vec2(1.0,0.0);
  vec2 n = vec2(-d.y,d.x);
  float hw = aWidth*pxScale*0.5;
  vec2 p = mix(ps,pe,position.x) + n*(position.y*hw) + d*((position.x*2.0-1.0)*hw);
  gl_Position = vec4(p/hs, mix(s.z,e.z,position.x) - bias, 1.0);
}\`;
const LINE_FS = \`uniform vec3 diffuse; uniform float opacity; uniform float clipX;
varying float vWX;
void main(){ if(vWX > clipX) discard; gl_FragColor = vec4(diffuse, opacity); }\`;

function lineMaterial(color, bias, opacity){
  const m = new THREE.ShaderMaterial({
    uniforms:{ diffuse:{value:new THREE.Color(color)}, opacity:{value:opacity===undefined?1:opacity},
      resolution:{value:new THREE.Vector2(DW,DH)}, pxScale:{value:1}, bias:{value:bias||0.0004},
      clipX:{value:1e9} },
    vertexShader:LINE_VS, fragmentShader:LINE_FS,
    transparent:(opacity!==undefined && opacity<1), depthWrite:!(opacity!==undefined && opacity<1)
  });
  lineMats.push(m); return m;
}
const QUADPOS = new THREE.Float32BufferAttribute([0,-1,0, 1,-1,0, 1,1,0, 0,-1,0, 1,1,0, 0,1,0],3);
function makeLines(segs, widths, material){
  const n = segs.length/6;
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', QUADPOS);
  const a=new Float32Array(n*3), b=new Float32Array(n*3), w=new Float32Array(n);
  for(let i=0;i<n;i++){
    for(let k=0;k<3;k++){ a[i*3+k]=segs[i*6+k]; b[i*3+k]=segs[i*6+3+k]; }
    w[i] = (typeof widths==='number') ? widths : widths[i];
  }
  g.setAttribute('aStart', new THREE.InstancedBufferAttribute(a,3));
  g.setAttribute('aEnd',   new THREE.InstancedBufferAttribute(b,3));
  g.setAttribute('aWidth', new THREE.InstancedBufferAttribute(w,1));
  g.instanceCount = n;
  const m = new THREE.Mesh(g, material); m.frustumCulled = false;
  return m;
}

/* ============================================================
   outline / prism helpers   (shapes live in the XZ plane, extruded on Y)
   ============================================================ */
function rrOutline(hw, hd, r, seg){
  r = Math.min(r, hw, hd);
  const pts=[], kind=[], nrm=[];
  const cs=[[hw-r,hd-r,0],[-(hw-r),hd-r,Math.PI/2],[-(hw-r),-(hd-r),Math.PI],[hw-r,-(hd-r),Math.PI*1.5]];
  for(let c=0;c<4;c++){
    const [cx,cz,a0]=cs[c];
    for(let i=0;i<=seg;i++){
      const a=a0+i/seg*Math.PI/2;
      pts.push([cx+r*Math.cos(a), cz+r*Math.sin(a)]);
      kind.push(i<seg?1:0);
      const am = (i<seg) ? a0+(i+0.5)/seg*Math.PI/2 : a0+Math.PI/2;   // segment mid normal
      nrm.push([Math.cos(am), Math.sin(am)]);
    }
  }
  return {pts,kind,nrm};
}
function edgeWeight(n, cfg){
  const d = (n[0]+n[1])*0.7071;                 // +1 toward camera, -1 away
  const t = Math.min(1, Math.max(0, (d+0.7071)/1.4142));
  const back = cfg.backBase + cfg.backSkew*(n[0]-n[1]);
  return back + (cfg.front-back)*t;
}
function prismGeom(outline, y0, y1, curveShade, noBottom){
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  const cap=[], flat=[], curve=[], ccol=[];
  let cx=0, cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    cap.push(cx,y1,cz, b[0],y1,b[1], a[0],y1,a[1]);
    if(!noBottom) cap.push(cx,y0,cz, a[0],y0,a[1], b[0],y0,b[1]);
  }
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    const t = kind[i]? curve : flat;
    t.push(a[0],y0,a[1], b[0],y1,b[1], b[0],y0,b[1]);
    t.push(a[0],y0,a[1], a[0],y1,a[1], b[0],y1,b[1]);
    if(kind[i] && curveShade){
      const c = curveShade(nrm[i][0], nrm[i][1]);
      for(let q=0;q<6;q++) ccol.push(c.r,c.g,c.b);
    }
  }
  const all = cap.concat(flat, curve);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(all,3));
  if(curveShade){
    const col=new Float32Array(all.length);
    for(let i=0;i<col.length;i++) col[i]=1;
    const off=cap.length+flat.length;
    for(let i=0;i<ccol.length;i++) col[off+i]=ccol[i];
    g.setAttribute('color', new THREE.BufferAttribute(col,3));
  }
  g.addGroup(0, cap.length/3, 0);
  g.addGroup(cap.length/3, flat.length/3, 1);
  g.addGroup((cap.length+flat.length)/3, curve.length/3, 2);
  return g;
}
// outline segments + matching per-segment weights
// e nudges the outline toward the camera along (1,1,1): screen position is
// unchanged, but the line wins the depth test against the slanted wall it sits on
function prismLines(outline, y0, y1, cfg, cfgBot, nudge){
  cfgBot = cfgBot || cfg;
  const [ex,ey,ez] = nudge || [3,3,3];
  const segs=[], w=[];
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    segs.push(a[0]+ex,y1+ey,a[1]+ez, b[0]+ex,y1+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfg));
    segs.push(a[0]+ex,y0+ey,a[1]+ez, b[0]+ex,y0+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfgBot));
  }
  const len=(i)=>{const a=pts[i],b=pts[(i+1)%n];return Math.hypot(a[0]-b[0],a[1]-b[1]);};
  for(let i=0;i<n;i++){
    const j=(i-1+n)%n;
    if(kind[j]!==kind[i] && len(j)>0.5 && len(i)>0.5){
      const p=pts[i];
      segs.push(p[0]+ex,y0+ey,p[1]+ez, p[0]+ex,y1+ey,p[1]+ez);
      w.push(edgeWeight(nrm[i], cfg));
    }
  }
  return {segs, w};
}
function loopSegs(pts, y, out){
  out = out||[];
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    out.push(a[0],y,a[1], b[0],y,b[1]);
  }
  return out;
}
function fanGeom(pts, y){
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  const a=[];
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    a.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}
function fanTris(pts, y, out){
  out = out||[];
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    out.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  return out;
}
// concave-safe planar polygon (ear clipping via three's ShapeUtils)
function polyTris(poly, y, out){
  out = out||[];
  const c = poly.map(p=>new THREE.Vector2(p[0],p[1]));
  const f = THREE.ShapeUtils.triangulateShape(c, []);
  for(const t of f){
    for(const idx of t){ out.push(poly[idx][0], y, poly[idx][1]); }
  }
  return out;
}
function triMesh(arr, mat){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(arr,3));
  return new THREE.Mesh(g, mat);
}
/* a rounded-rect plate laid flat: filled face + its own hairline, as one group */
function plate(hw, hd, r, seg, colour, weight, mat){
  const o = rrOutline(hw, hd, r, seg||10);
  const g = new THREE.Group();
  const fill = new THREE.Mesh(fanGeom(o.pts, 0), mat || new THREE.MeshBasicMaterial({color:colour, side:THREE.DoubleSide}));
  g.add(fill);
  if(weight){
    const ln = new THREE.Group(); ln.position.set(0.7,0.7,0.7); g.add(ln);
    ln.add(makeLines(loopSegs(o.pts,0,[]), weight, inkThin));
  }
  g.userData.fill = fill; g.userData.outline = o;
  return g;
}
function annulusGeom(rin, rout, y, seg){
  const a=[];
  for(let i=0;i<seg;i++){
    const t0=i/seg*Math.PI*2, t1=(i+1)/seg*Math.PI*2;
    const p=(r,t)=>[r*Math.cos(t), y, r*Math.sin(t)];
    const A=p(rin,t0),B=p(rout,t0),C=p(rout,t1),D=p(rin,t1);
    a.push(...A,...B,...C, ...A,...C,...D);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}

/* ============================================================
   textures
   ============================================================ */
function discAlphaTexture(size, inner){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  const c=(size-1)/2;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const r=Math.hypot(x-c,y-c)/c;
    let a=1-(r-inner)/(1-inner); a=Math.max(0,Math.min(1,a));
    a=a*a*(3-2*a);
    const i=(y*size+x)*4;
    img.data[i]=img.data[i+1]=img.data[i+2]=255;   // white, so the material colour drives the tone
    img.data[i+3]=Math.round(a*255);
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
function grainTexture(size, base, amp){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  let s=12345;
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  for(let i=0;i<size*size;i++){
    const r=(rnd()+rnd()+rnd()+rnd()-2)/2;
    let v = base + amp*r - amp*1.65*Math.pow(rnd(),3);
    v = tone(v);          // inverts the dust specks along with the paper
    img.data[i*4]=img.data[i*4+1]=img.data[i*4+2]=v; img.data[i*4+3]=255;
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
const grainTex = grainTexture(512, 239, 11);
const GRAIN_SCALE = 700;

/* ============================================================
   materials
   ============================================================ */
const matTop   = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:grainTex, side:THREE.DoubleSide});  // tone lives in the texture
const matFlat  = new THREE.MeshBasicMaterial({color:COL.flat,  side:THREE.DoubleSide});
const matCurve = new THREE.MeshBasicMaterial({color:COL.curve, side:THREE.DoubleSide});
const matCurveVC= new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide, vertexColors:true});
const CGRAY = new THREE.Color(grey(233));  // curved walls of the light bodies
const CBLK  = new THREE.Color(grey(0));
const CWHT  = new THREE.Color(grey(253));
function angDeg(nx,nz){ let a=Math.atan2(nz,nx)*180/Math.PI; if(a>180)a-=360; if(a<-180)a+=360; return a; }
const shadeLid   = (nx,nz)=>{ const a=angDeg(nx,nz); return (a>-30 && a<2)? CBLK : CGRAY; };
const shadeBadge = (nx,nz)=>{ const a=angDeg(nx,nz);
  if(a>-50 && a<-8) return CBLK;
  if(a>=-8 && a<82) return CWHT;
  return CGRAY; };
const shadeCap   = ()=>CGRAY;
const matBlack = new THREE.MeshBasicMaterial({color:COL.black, side:THREE.DoubleSide});
const matWhite = new THREE.MeshBasicMaterial({color:COL.white, side:THREE.DoubleSide});
const matMid   = new THREE.MeshBasicMaterial({color:COL.mid,   side:THREE.DoubleSide});
const inkMat   = lineMaterial(COL.ink, 0.00020);
const inkThin  = lineMaterial(COL.ink, 0.00012);
const laneMat  = lineMaterial(COL.lane, 0.00025);
const shadowMat= new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:SHADOW_A, depthWrite:false});

/* ============================================================
   the pad every piece in this family stands on
   ============================================================ */
const slabOut = rrOutline(SLAB.X/2, SLAB.Z/2, SLAB.R, 16);
const SLAB_POS = new THREE.Vector3(SLAB.X/2, 0, SLAB.Z/2);
const PAD_Y = SLAB.H;
function buildPad(){
  const g = prismGeom(slabOut, 0, SLAB.H);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+SLAB.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+SLAB.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  const m = new THREE.Mesh(g,[matTop,matFlat,matCurve]);
  m.position.copy(SLAB_POS); scene.add(m);
  const L = prismLines(slabOut, 0, SLAB.H, W_SLAB);
  const ln = makeLines(L.segs, L.w, inkMat); ln.position.copy(SLAB_POS); scene.add(ln);
  // drop shadow: silhouette translated (52, 0, 20.8) on the floor
  const sh = new THREE.Mesh(fanGeom(slabOut.pts, 0), shadowMat);
  sh.position.set(SLAB.X/2+52, -0.6, SLAB.Z/2+20.8);
  sh.renderOrder = -1; scene.add(sh);
}

/* ============================================================
   decorative squares (screen-space, multiply-like)
   ============================================================ */
const squares = new THREE.Group(); scene.add(squares);
{
  const defs=[[370,520,41,0.0245],[327,558,41,0.0612],[1119,512,41,0.0612],[1226,621,41,0.0612]];
  for(const [sx,sy,s,al] of defs){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),
      new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:al, depthTest:false, depthWrite:false}));
    m.renderOrder = 100;
    m.userData.screen=[sx+s/2, sy+s/2];
    squares.add(m);
  }
}
function placeSquares(){
  for(const m of squares.children){
    const [sx,sy]=m.userData.screen;
    const z=-400;
    const x=(sx-OX)/C30 + z;
    const y=0.5*(x+z)-(sy-OY);
    m.position.set(x,y,z);
    m.quaternion.copy(camera.quaternion);
  }
}

/* ============================================================
   the family's checkmark badge — a coin standing in the XY plane
   ============================================================ */
const BADGE = { R:43.28, T:16.0 };
function buildBadge(sx, sy, z){
  const badgeGroup = new THREE.Group(); scene.add(badgeGroup);
  const o = rrOutline(BADGE.R, BADGE.R, BADGE.R, 48);
  const inner = new THREE.Group(); inner.rotation.x = -Math.PI/2; badgeGroup.add(inner);
  const bg = prismGeom(o, 0, BADGE.T, shadeBadge);
  // measured face gradient:  226 - 0.126*u + 0.588*v   (u = plane x, v = plane y)
  {
    const pos=bg.getAttribute('position'), col=bg.getAttribute('color');
    for(let i=0;i<pos.count;i++){
      if(col.getX(i)===1 && col.getY(i)===1 && col.getZ(i)===1){
        const v=tone(229.5 - 0.126*pos.getX(i) + 0.588*pos.getZ(i))/255;
        col.setXYZ(i,v,v,v);
      }
    }
  }
  inner.add(new THREE.Mesh(bg,[matCurveVC, matCurveVC, matCurveVC]));
  // rim seams at the shading-zone boundaries
  {
    const sm=[];
    for(const deg of [-8, 82]){
      const a=deg*Math.PI/180, cx=BADGE.R*Math.cos(a), cz=BADGE.R*Math.sin(a);
      sm.push(cx,0,cz, cx,BADGE.T,cz);
    }
    inner.add(makeLines(sm, 2.2, inkThin));
  }
  const L = prismLines(o, 0, BADGE.T, W_BADGE, null, [3,-3,3]);
  inner.add(makeLines(L.segs, L.w, inkMat));
  const CK = [[17.29,21.82],[13.24,17.75],[-1.65,-6.62],[-4.60,-5.96],
              [-12.89,3.14],[-21.07,-5.06],[-3.91,-22.01],[23.21,19.74]];
  const ckg = new THREE.Group(); ckg.position.set(0.9,-0.9,0.9); inner.add(ckg);
  ckg.add(triMesh(polyTris(CK, 0, []), matBlack));
  badgeGroup.position.copy(fromScreen(sx, sy, z));
  badgeGroup.userData.baseY = badgeGroup.position.y;
  return badgeGroup;
}

/* ============================================================
   animation helpers
   ============================================================ */
function tbl(a, t){
  const n=a.length; let i=Math.floor(t), f=t-i;
  i=((i%n)+n)%n; const j=(i+1)%n;
  return a[i]*(1-f)+a[j]*f;
}
const clamp01 = (v)=>v<0?0:v>1?1:v;
const smooth  = (v)=>{ v=clamp01(v); return v*v*(3-2*v); };
/* eased 0..1..0 pulse: rises over \`up\` frames from \`at\`, holds \`hold\`, falls over \`down\` */
function pulse(t, at, up, hold, down){
  const d = t-at;
  if(d<=0 || d>=up+hold+down) return 0;
  if(d<up) return smooth(d/up);
  if(d<up+hold) return 1;
  return smooth(1-(d-up-hold)/down);
}
/* eased 0..1 ramp */
function ramp(t, at, len){ return smooth((t-at)/len); }

/* ============================================================
   the keyboard
   ============================================================ */
const NF = 216;
const CX = SLAB.X/2, CZ = SLAB.Z/2;
const KB  = { X:226, Z:404, H:22, R:18 };
const KEY = { s:42, r:9, h:10, pitch:48 };
const KEY_BASE = 198;   // cap tops sit a step above the deck so the field reads as keys
const DECK_Y = PAD_Y + KB.H;

buildPad();

/* ---- the two lane marks the deck sits between ---- */
const GLYPH = (function(){
  const raw = [
    [[401.5,422.5],[401.5,450.9],[408.9,454.4],[408.9,426.0]],
    [[427.0,422.5],[427.0,450.9],[434.4,454.4],[434.4,426.0]],
    [[396.5,459.0],[394.5,463.9],[406.5,473.0],[404.0,477.9],[410.9,482.9],[416.9,474.0]],
    [[421.5,459.0],[420.0,463.9],[432.0,473.0],[429.5,477.9],[436.4,483.4],[441.9,473.5]]
  ];
  const cx=418.2, cz=452.95;
  return raw.map(p=>p.map(q=>[q[0]-cx, q[1]-cz]));
})();
function glyphTris(ox, oz, y, out){
  out = out||[];
  for(const poly of GLYPH) polyTris(poly.map(p=>[p[0]+ox, p[1]+oz]), y, out);
  return out;
}
{
  const segs=[], tris=[];
  for(const lx of [CX-186, CX+186]){
    const o = rrOutline(35, 152, 35, 12);
    loopSegs(o.pts.map(p=>[p[0]+lx, p[1]+CZ]), PAD_Y, segs);
    glyphTris(lx-7.65, CZ+96, PAD_Y, tris);
  }
  scene.add(makeLines(segs, W_LANE, laneMat));
  const gm = triMesh(tris, new THREE.MeshBasicMaterial({color:COL.glyph, side:THREE.DoubleSide}));
  gm.position.set(2.5,2.5,2.5);          // nudge toward the camera (screen position unchanged)
  scene.add(gm);
}

/* ---- deck ---- */
const deckGrain = grainTexture(512, 251, 8);    // the deck reads one step darker than the pad
const deckOut = rrOutline(KB.X/2, KB.Z/2, KB.R, 14);
{
  const g = prismGeom(deckOut, PAD_Y, DECK_Y, null, true);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+KB.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+KB.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  const matDeck = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:deckGrain, side:THREE.DoubleSide});
  const m = new THREE.Mesh(g,[matDeck,matFlat,matCurve]); m.position.set(CX,0,CZ); scene.add(m);
  const L = prismLines(deckOut, PAD_Y, DECK_Y, W_PLAIN);
  const ln = makeLines(L.segs, L.w, inkMat); ln.position.set(CX,0,CZ); scene.add(ln);
  const sh = new THREE.Mesh(fanGeom(deckOut.pts, 0), shadowMat);
  sh.position.set(CX+26, PAD_Y+0.4, CZ+10.4); sh.renderOrder=-1; scene.add(sh);
}

/* ---- keycaps: four rows stepping toward the viewer, seven columns deep ----
   row 3 is the front row and carries the space bar across columns 1..5 */
const keys = [];
function addKey(x, z, hw, hd){
  const o = rrOutline(hw, hd, KEY.r, 5);
  const grp = new THREE.Group(); grp.position.set(x, 0, z); scene.add(grp);
  const topMat = new THREE.MeshBasicMaterial({color:grey(KEY_BASE), side:THREE.DoubleSide});
  grp.add(new THREE.Mesh(prismGeom(o, DECK_Y, DECK_Y+KEY.h, null, true),[topMat,matFlat,matCurve]));
  const L = prismLines(o, DECK_Y, DECK_Y+KEY.h, W_KEY);
  grp.add(makeLines(L.segs, L.w, inkMat));
  keys.push({ grp, topMat, baseY:0 });
  return keys.length-1;
}
const SPACE_INDEX = (function(){
  const hs = KEY.s/2;
  let spaceIdx = -1;
  for(let j=0;j<4;j++){
    const x = CX - 72 + j*KEY.pitch;
    if(j<3){
      for(let k=0;k<7;k++) addKey(x, CZ - 144 + k*KEY.pitch, hs, hs);
    } else {
      addKey(x, CZ - 144, hs, hs);
      spaceIdx = addKey(x, CZ, hs, (5*KEY.pitch-14)/2);
      addKey(x, CZ + 144, hs, hs);
    }
  }
  return spaceIdx;
})();

/* ---- indicator lamp in the back bezel: it answers every stroke ---- */
const lampMat = new THREE.MeshBasicMaterial({color:grey(214), side:THREE.DoubleSide});
{
  const o = rrOutline(9, 9, 9, 14);
  const g = new THREE.Group(); g.position.set(CX-64, DECK_Y+0.3, CZ-181); scene.add(g);
  g.add(new THREE.Mesh(fanGeom(o.pts, 0), lampMat));
  const ln = new THREE.Group(); ln.position.set(0.8,0.8,0.8); g.add(ln);
  ln.add(makeLines(loopSegs(o.pts,0,[]), 2.2, inkThin));
  const t = rrOutline(46, 5, 5, 4);
  const tg = new THREE.Group(); tg.position.set(CX+22, DECK_Y+0.3, CZ-181); scene.add(tg);
  tg.add(new THREE.Mesh(fanGeom(t.pts, 0), new THREE.MeshBasicMaterial({color:grey(226), side:THREE.DoubleSide})));
}

/* ---- the text plate the typing lands on ---- */
const PLATE = { A:212, B:74, T:16, R:34 };
const plateGroup = new THREE.Group();
plateGroup.position.copy(fromScreen(880, 300, 30));
plateGroup.rotation.x = -Math.PI/2;
scene.add(plateGroup);
const words = [];
let caret = null;
{
  const o = rrOutline(PLATE.A, PLATE.B, PLATE.R, 20);
  plateGroup.add(new THREE.Mesh(prismGeom(o, 0, PLATE.T, shadeLid),[matFlat,matFlat,matCurveVC]));
  const L = prismLines(o, 0, PLATE.T, W_PLAIN, null, [3,-3,3]);
  plateGroup.add(makeLines(L.segs, L.w, inkMat));

  // face content — offsets use (d,-d,d) so they move toward the camera
  // without changing screen position
  const face = new THREE.Group(); face.position.set(0.8,-0.8,0.8); plateGroup.add(face);
  const ROWS = [ {z:40, w:[84,112,60,76]}, {z:0, w:[96,68,124,44]}, {z:-40, w:[72,104,88]} ];
  const matWord = new THREE.MeshBasicMaterial({color:grey(40), side:THREE.DoubleSide});
  for(const row of ROWS){
    let x = -188;
    for(const w of row.w){
      const g = new THREE.Group(); g.position.set(x, 0, row.z); g.scale.x = 0; face.add(g);
      const bar = rrOutline(w/2, 9, 9, 6);
      const m = new THREE.Mesh(fanGeom(bar.pts, 0), matWord); m.position.x = w/2; g.add(m);
      words.push({ g, x0:x, w });
      x += w + 14;
    }
  }
  caret = new THREE.Group(); caret.position.set(2,-2,2); plateGroup.add(caret);
  const cb = rrOutline(3, 17, 3, 3);
  caret.add(new THREE.Mesh(fanGeom(cb.pts, 0), matBlack));
}

/* ---- badge ---- */
const badgeGroup = buildBadge(604, 192, 20);

/* ============================================================
   animation — 22 strokes type 11 words, then the plate clears
   ============================================================ */
const STROKE0 = 8, STROKE_GAP = 7, STROKES = 22;
const CLEAR_AT = 176, CLEAR_LEN = 22;
/* which cap each stroke strikes; the space bar lands between words */
const KEYSEQ = [4,11,18,9,SPACE_INDEX,2,16,7,13,SPACE_INDEX,20,5,
                12,1,SPACE_INDEX,8,15,3,SPACE_INDEX,17,10,6];

function setFrame(t){
  /* caps */
  for(const k of keys){ k.grp.position.y = 0; k.topMat.color.setScalar(tone(KEY_BASE)/255); }
  for(let i=0;i<STROKES;i++){
    const at = STROKE0 + i*STROKE_GAP;
    const p = pulse(t, at, 3, 1, 8);
    if(p<=0) continue;
    const k = keys[KEYSEQ[i]];
    k.grp.position.y = -6.5*p;
    k.topMat.color.setScalar(tone(KEY_BASE*(1-p))/255);
  }

  /* words fill in, two strokes each, then the whole plate clears */
  const clear = 1 - smooth((t-CLEAR_AT)/CLEAR_LEN);
  let caretX = -188;
  for(let w=0;w<words.length;w++){
    const at = STROKE0 + w*2*STROKE_GAP;
    const p = ramp(t, at, STROKE_GAP*2) * clear;
    words[w].g.scale.x = Math.max(p, 0.0001);
    if(p>0.001) caretX = words[w].x0 + words[w].w*p + 9;
  }
  const row = Math.min(2, Math.floor(Math.max(0, Math.min(words.length-1,
              (t-STROKE0)/(STROKE_GAP*2))) / 4));
  caret.position.set(caretX+2, -2, (t>CLEAR_AT+CLEAR_LEN*0.5 ? 40 : [40,0,-40][row]) + 2);
  caret.visible = clear > 0.02 || (t % 30) < 15;

  /* the lamp answers whichever stroke is nearest */
  let lamp = 0;
  for(let i=0;i<STROKES;i++) lamp = Math.max(lamp, pulse(t, STROKE0 + i*STROKE_GAP, 2, 2, 9));
  lampMat.color.setScalar(tone(214 - 214*lamp)/255);

  /* the badge keeps the dock's gentle bob */
  badgeGroup.position.y = badgeGroup.userData.baseY - 11.5*(1-Math.cos(t/NF*Math.PI*6))*0.5;
}

/* ============================================================
   playback
   ============================================================ */
let t0=null, paused=false;
function frame(now){
  if(t0===null) t0=now;
  if(!paused){
    setFrame(((now-t0)/1000*FPS) % NF);
    renderer.render(scene,camera);
  }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', resize);
resize();
setFrame(0);
renderer.render(scene,camera);
requestAnimationFrame(frame);

window.__setFrame = function(f){ paused=true; setFrame(f); renderer.render(scene,camera); };
window.__play = function(){ paused=false; t0=null; };
<\/script>
</body>
</html>
`,y=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Isometric Phone</title>
<style>
  html,body{margin:0;height:100%;background:#111111;overflow:hidden}  /* matches COL.bg; JS keeps it in sync */
  canvas{display:block;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="scene"></canvas>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================
   Isometric phone — the dock's pad, carrying the family's one lit face.

   A companion piece in the isometric illustration family: the same drawing
   built the same way.  Everything is real 3D geometry under an
   orthographic isometric camera — flat-shaded faces plus instanced
   screen-space "fat line" outlines whose weight varies per edge, exactly
   as the dock's ink does.  Dark mode is a single tone curve over the
   measured greys (see DARK below).
   World units == pixels of the 1604x1080 design frame.
   True isometric projection (camera direction 1,1,1):
     sx = 0.8660254*(X - Z) + 821.00
     sy = 0.5*(X + Z) - Y   + 387.66
   ============================================================ */

const DW = 1604, DH = 1080;
const C30 = Math.cos(Math.PI/6);
const OX = 821.00, OY = 387.66;
const FPS = 60;

/* ---------- tone ----------------------------------------------------------
   The whole piece is greyscale, so dark mode is one curve rather than a second
   palette: every measured grey is inverted and compressed into [LO,HI], which
   keeps the drawing's contrast relationships exactly as the dock measured them.
   Paper goes near-black, ink goes near-white, black faces become light and
   their white detail becomes dark.  DARK=false is the original.
   -------------------------------------------------------------------------- */
const DARK = true;
const TONE_LO = 8, TONE_HI = 246;
function tone(v){
  v = Math.max(0, Math.min(255, v));
  return DARK ? TONE_LO + (255-v)/255*(TONE_HI-TONE_LO) : v;
}
function grey(v){ const c = Math.round(tone(v)); return (c<<16)|(c<<8)|c; }

const COL = {              // the dock's source greys, carried over unchanged
  bg      : grey(245),
  flat    : grey(253),   // straight side walls
  curve   : grey(228),   // curved (corner / cap) side walls
  ink     : grey(0),
  lane    : grey(190),
  glyph   : grey(148),
  puckTop : grey(242),
  puckSide: grey(59),
  badge   : grey(235),
  white   : grey(255),   // detail drawn on top of a black face
  black   : grey(0),     // black top faces
  mid     : grey(120)    // secondary detail
};
/* outline ink weights measured off the reference (design px of black) */
const W_SLAB  = { front:2.32, backBase:0.485, backSkew:-0.215 };
const W_CAP   = { front:2.66, backBase:2.66, backSkew:0 };
const W_CAPB  = { front:3.90, backBase:2.66, backSkew:0 };
const W_PLAIN = { front:2.70, backBase:2.40, backSkew:0 };
const W_BADGE = { front:2.60, backBase:2.60, backSkew:0 };
const W_PUCK  = { front:3.60, backBase:2.60, backSkew:0 };
const W_KEY   = { front:2.30, backBase:1.70, backSkew:0 };
const W_LANE  = 3.5;
const SHADOW_A = 0.061;              // slab drop shadow / decorative squares
const PUCKSH = { a:0.29, r:72.5 };   // contact shadow a puck drops on what it rides

/* ---------- the shared stage ---------- */
const SLAB = { X:501.0, Z:528.8, H:42.26, R:78 };

/* ============================================================
   renderer / camera
   ============================================================ */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, preserveDrawingBuffer:true});
renderer.setClearColor(COL.bg, 1);
document.body.style.background = '#' + COL.bg.toString(16).padStart(6,'0');
renderer.sortObjects = true;
renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1,1,1,-1,-6000,6000);
const K = 1/Math.sqrt(2/3);
(function(){
  const tx=(DW/2-OX)/C30, ty=(DH/2-OY);
  const X=(ty*2+tx)/2, Z=(ty*2-tx)/2;
  camera.position.set(X+2000, 2000, Z+2000);
  camera.lookAt(X,0,Z);
})();

const FITW = 1010;          // horizontal fit box (content width + margin)
const lineMats = [];
let viewScale = 1;
function resize(){
  const w = canvas.clientWidth||DW, h = canvas.clientHeight||DH;
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w,h,false);
  // fit: exactly the reference framing at the design aspect, and a tighter
  // horizontal fit on narrow/portrait viewports so the object never gets tiny
  viewScale = Math.min(w/FITW, h/DH);
  const cw = (w/viewScale)/K, ch = (h/viewScale)/K;
  camera.left=-cw/2; camera.right=cw/2; camera.top=ch/2; camera.bottom=-ch/2;
  camera.updateProjectionMatrix();
  const rx=w*dpr, ry=h*dpr;
  lineMats.forEach(m=>{ m.uniforms.resolution.value.set(rx,ry); m.uniforms.pxScale.value = viewScale*dpr; });
  placeSquares();
}

/* place an object's origin on a design-frame screen point, at a chosen depth */
function fromScreen(sx, sy, z){
  const x = (sx-OX)/C30 + z;
  const y = 0.5*(x+z) - (sy-OY);
  return new THREE.Vector3(x,y,z);
}

/* ============================================================
   instanced fat lines (orthographic camera only)
   ============================================================ */
const LINE_VS = \`
attribute vec3 aStart; attribute vec3 aEnd; attribute float aWidth;
uniform vec2 resolution; uniform float pxScale; uniform float bias;
varying float vWX;
void main(){
  vec3 wp = (modelMatrix * vec4(mix(aStart,aEnd,position.x),1.0)).xyz;
  vWX = wp.x - wp.y;
  vec4 s = projectionMatrix * modelViewMatrix * vec4(aStart,1.0);
  vec4 e = projectionMatrix * modelViewMatrix * vec4(aEnd,1.0);
  vec2 hs = resolution*0.5;
  vec2 ps = s.xy*hs, pe = e.xy*hs;
  vec2 d = pe-ps; float L = length(d);
  d = (L>0.0001)? d/L : vec2(1.0,0.0);
  vec2 n = vec2(-d.y,d.x);
  float hw = aWidth*pxScale*0.5;
  vec2 p = mix(ps,pe,position.x) + n*(position.y*hw) + d*((position.x*2.0-1.0)*hw);
  gl_Position = vec4(p/hs, mix(s.z,e.z,position.x) - bias, 1.0);
}\`;
const LINE_FS = \`uniform vec3 diffuse; uniform float opacity; uniform float clipX;
varying float vWX;
void main(){ if(vWX > clipX) discard; gl_FragColor = vec4(diffuse, opacity); }\`;

function lineMaterial(color, bias, opacity){
  const m = new THREE.ShaderMaterial({
    uniforms:{ diffuse:{value:new THREE.Color(color)}, opacity:{value:opacity===undefined?1:opacity},
      resolution:{value:new THREE.Vector2(DW,DH)}, pxScale:{value:1}, bias:{value:bias||0.0004},
      clipX:{value:1e9} },
    vertexShader:LINE_VS, fragmentShader:LINE_FS,
    transparent:(opacity!==undefined && opacity<1), depthWrite:!(opacity!==undefined && opacity<1)
  });
  lineMats.push(m); return m;
}
const QUADPOS = new THREE.Float32BufferAttribute([0,-1,0, 1,-1,0, 1,1,0, 0,-1,0, 1,1,0, 0,1,0],3);
function makeLines(segs, widths, material){
  const n = segs.length/6;
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', QUADPOS);
  const a=new Float32Array(n*3), b=new Float32Array(n*3), w=new Float32Array(n);
  for(let i=0;i<n;i++){
    for(let k=0;k<3;k++){ a[i*3+k]=segs[i*6+k]; b[i*3+k]=segs[i*6+3+k]; }
    w[i] = (typeof widths==='number') ? widths : widths[i];
  }
  g.setAttribute('aStart', new THREE.InstancedBufferAttribute(a,3));
  g.setAttribute('aEnd',   new THREE.InstancedBufferAttribute(b,3));
  g.setAttribute('aWidth', new THREE.InstancedBufferAttribute(w,1));
  g.instanceCount = n;
  const m = new THREE.Mesh(g, material); m.frustumCulled = false;
  return m;
}

/* ============================================================
   outline / prism helpers   (shapes live in the XZ plane, extruded on Y)
   ============================================================ */
function rrOutline(hw, hd, r, seg){
  r = Math.min(r, hw, hd);
  const pts=[], kind=[], nrm=[];
  const cs=[[hw-r,hd-r,0],[-(hw-r),hd-r,Math.PI/2],[-(hw-r),-(hd-r),Math.PI],[hw-r,-(hd-r),Math.PI*1.5]];
  for(let c=0;c<4;c++){
    const [cx,cz,a0]=cs[c];
    for(let i=0;i<=seg;i++){
      const a=a0+i/seg*Math.PI/2;
      pts.push([cx+r*Math.cos(a), cz+r*Math.sin(a)]);
      kind.push(i<seg?1:0);
      const am = (i<seg) ? a0+(i+0.5)/seg*Math.PI/2 : a0+Math.PI/2;   // segment mid normal
      nrm.push([Math.cos(am), Math.sin(am)]);
    }
  }
  return {pts,kind,nrm};
}
function edgeWeight(n, cfg){
  const d = (n[0]+n[1])*0.7071;                 // +1 toward camera, -1 away
  const t = Math.min(1, Math.max(0, (d+0.7071)/1.4142));
  const back = cfg.backBase + cfg.backSkew*(n[0]-n[1]);
  return back + (cfg.front-back)*t;
}
function prismGeom(outline, y0, y1, curveShade, noBottom){
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  const cap=[], flat=[], curve=[], ccol=[];
  let cx=0, cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    cap.push(cx,y1,cz, b[0],y1,b[1], a[0],y1,a[1]);
    if(!noBottom) cap.push(cx,y0,cz, a[0],y0,a[1], b[0],y0,b[1]);
  }
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    const t = kind[i]? curve : flat;
    t.push(a[0],y0,a[1], b[0],y1,b[1], b[0],y0,b[1]);
    t.push(a[0],y0,a[1], a[0],y1,a[1], b[0],y1,b[1]);
    if(kind[i] && curveShade){
      const c = curveShade(nrm[i][0], nrm[i][1]);
      for(let q=0;q<6;q++) ccol.push(c.r,c.g,c.b);
    }
  }
  const all = cap.concat(flat, curve);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(all,3));
  if(curveShade){
    const col=new Float32Array(all.length);
    for(let i=0;i<col.length;i++) col[i]=1;
    const off=cap.length+flat.length;
    for(let i=0;i<ccol.length;i++) col[off+i]=ccol[i];
    g.setAttribute('color', new THREE.BufferAttribute(col,3));
  }
  g.addGroup(0, cap.length/3, 0);
  g.addGroup(cap.length/3, flat.length/3, 1);
  g.addGroup((cap.length+flat.length)/3, curve.length/3, 2);
  return g;
}
// outline segments + matching per-segment weights
// e nudges the outline toward the camera along (1,1,1): screen position is
// unchanged, but the line wins the depth test against the slanted wall it sits on
function prismLines(outline, y0, y1, cfg, cfgBot, nudge){
  cfgBot = cfgBot || cfg;
  const [ex,ey,ez] = nudge || [3,3,3];
  const segs=[], w=[];
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    segs.push(a[0]+ex,y1+ey,a[1]+ez, b[0]+ex,y1+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfg));
    segs.push(a[0]+ex,y0+ey,a[1]+ez, b[0]+ex,y0+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfgBot));
  }
  const len=(i)=>{const a=pts[i],b=pts[(i+1)%n];return Math.hypot(a[0]-b[0],a[1]-b[1]);};
  for(let i=0;i<n;i++){
    const j=(i-1+n)%n;
    if(kind[j]!==kind[i] && len(j)>0.5 && len(i)>0.5){
      const p=pts[i];
      segs.push(p[0]+ex,y0+ey,p[1]+ez, p[0]+ex,y1+ey,p[1]+ez);
      w.push(edgeWeight(nrm[i], cfg));
    }
  }
  return {segs, w};
}
function loopSegs(pts, y, out){
  out = out||[];
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    out.push(a[0],y,a[1], b[0],y,b[1]);
  }
  return out;
}
function fanGeom(pts, y){
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  const a=[];
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    a.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}
function fanTris(pts, y, out){
  out = out||[];
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    out.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  return out;
}
// concave-safe planar polygon (ear clipping via three's ShapeUtils)
function polyTris(poly, y, out){
  out = out||[];
  const c = poly.map(p=>new THREE.Vector2(p[0],p[1]));
  const f = THREE.ShapeUtils.triangulateShape(c, []);
  for(const t of f){
    for(const idx of t){ out.push(poly[idx][0], y, poly[idx][1]); }
  }
  return out;
}
function triMesh(arr, mat){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(arr,3));
  return new THREE.Mesh(g, mat);
}
/* a rounded-rect plate laid flat: filled face + its own hairline, as one group */
function plate(hw, hd, r, seg, colour, weight, mat){
  const o = rrOutline(hw, hd, r, seg||10);
  const g = new THREE.Group();
  const fill = new THREE.Mesh(fanGeom(o.pts, 0), mat || new THREE.MeshBasicMaterial({color:colour, side:THREE.DoubleSide}));
  g.add(fill);
  if(weight){
    const ln = new THREE.Group(); ln.position.set(0.7,0.7,0.7); g.add(ln);
    ln.add(makeLines(loopSegs(o.pts,0,[]), weight, inkThin));
  }
  g.userData.fill = fill; g.userData.outline = o;
  return g;
}
function annulusGeom(rin, rout, y, seg){
  const a=[];
  for(let i=0;i<seg;i++){
    const t0=i/seg*Math.PI*2, t1=(i+1)/seg*Math.PI*2;
    const p=(r,t)=>[r*Math.cos(t), y, r*Math.sin(t)];
    const A=p(rin,t0),B=p(rout,t0),C=p(rout,t1),D=p(rin,t1);
    a.push(...A,...B,...C, ...A,...C,...D);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}

/* ============================================================
   textures
   ============================================================ */
function discAlphaTexture(size, inner){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  const c=(size-1)/2;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const r=Math.hypot(x-c,y-c)/c;
    let a=1-(r-inner)/(1-inner); a=Math.max(0,Math.min(1,a));
    a=a*a*(3-2*a);
    const i=(y*size+x)*4;
    img.data[i]=img.data[i+1]=img.data[i+2]=255;   // white, so the material colour drives the tone
    img.data[i+3]=Math.round(a*255);
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
function grainTexture(size, base, amp){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  let s=12345;
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  for(let i=0;i<size*size;i++){
    const r=(rnd()+rnd()+rnd()+rnd()-2)/2;
    let v = base + amp*r - amp*1.65*Math.pow(rnd(),3);
    v = tone(v);          // inverts the dust specks along with the paper
    img.data[i*4]=img.data[i*4+1]=img.data[i*4+2]=v; img.data[i*4+3]=255;
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
const grainTex = grainTexture(512, 239, 11);
const GRAIN_SCALE = 700;

/* ============================================================
   materials
   ============================================================ */
const matTop   = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:grainTex, side:THREE.DoubleSide});  // tone lives in the texture
const matFlat  = new THREE.MeshBasicMaterial({color:COL.flat,  side:THREE.DoubleSide});
const matCurve = new THREE.MeshBasicMaterial({color:COL.curve, side:THREE.DoubleSide});
const matCurveVC= new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide, vertexColors:true});
const CGRAY = new THREE.Color(grey(233));  // curved walls of the light bodies
const CBLK  = new THREE.Color(grey(0));
const CWHT  = new THREE.Color(grey(253));
function angDeg(nx,nz){ let a=Math.atan2(nz,nx)*180/Math.PI; if(a>180)a-=360; if(a<-180)a+=360; return a; }
const shadeLid   = (nx,nz)=>{ const a=angDeg(nx,nz); return (a>-30 && a<2)? CBLK : CGRAY; };
const shadeBadge = (nx,nz)=>{ const a=angDeg(nx,nz);
  if(a>-50 && a<-8) return CBLK;
  if(a>=-8 && a<82) return CWHT;
  return CGRAY; };
const shadeCap   = ()=>CGRAY;
const matBlack = new THREE.MeshBasicMaterial({color:COL.black, side:THREE.DoubleSide});
const matWhite = new THREE.MeshBasicMaterial({color:COL.white, side:THREE.DoubleSide});
const matMid   = new THREE.MeshBasicMaterial({color:COL.mid,   side:THREE.DoubleSide});
const inkMat   = lineMaterial(COL.ink, 0.00020);
const inkThin  = lineMaterial(COL.ink, 0.00012);
const laneMat  = lineMaterial(COL.lane, 0.00025);
const shadowMat= new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:SHADOW_A, depthWrite:false});

/* ============================================================
   the pad every piece in this family stands on
   ============================================================ */
const slabOut = rrOutline(SLAB.X/2, SLAB.Z/2, SLAB.R, 16);
const SLAB_POS = new THREE.Vector3(SLAB.X/2, 0, SLAB.Z/2);
const PAD_Y = SLAB.H;
function buildPad(){
  const g = prismGeom(slabOut, 0, SLAB.H);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+SLAB.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+SLAB.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  const m = new THREE.Mesh(g,[matTop,matFlat,matCurve]);
  m.position.copy(SLAB_POS); scene.add(m);
  const L = prismLines(slabOut, 0, SLAB.H, W_SLAB);
  const ln = makeLines(L.segs, L.w, inkMat); ln.position.copy(SLAB_POS); scene.add(ln);
  // drop shadow: silhouette translated (52, 0, 20.8) on the floor
  const sh = new THREE.Mesh(fanGeom(slabOut.pts, 0), shadowMat);
  sh.position.set(SLAB.X/2+52, -0.6, SLAB.Z/2+20.8);
  sh.renderOrder = -1; scene.add(sh);
}

/* ============================================================
   decorative squares (screen-space, multiply-like)
   ============================================================ */
const squares = new THREE.Group(); scene.add(squares);
{
  const defs=[[370,520,41,0.0245],[327,558,41,0.0612],[1119,512,41,0.0612],[1226,621,41,0.0612]];
  for(const [sx,sy,s,al] of defs){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),
      new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:al, depthTest:false, depthWrite:false}));
    m.renderOrder = 100;
    m.userData.screen=[sx+s/2, sy+s/2];
    squares.add(m);
  }
}
function placeSquares(){
  for(const m of squares.children){
    const [sx,sy]=m.userData.screen;
    const z=-400;
    const x=(sx-OX)/C30 + z;
    const y=0.5*(x+z)-(sy-OY);
    m.position.set(x,y,z);
    m.quaternion.copy(camera.quaternion);
  }
}

/* ============================================================
   the family's checkmark badge — a coin standing in the XY plane
   ============================================================ */
const BADGE = { R:43.28, T:16.0 };
function buildBadge(sx, sy, z){
  const badgeGroup = new THREE.Group(); scene.add(badgeGroup);
  const o = rrOutline(BADGE.R, BADGE.R, BADGE.R, 48);
  const inner = new THREE.Group(); inner.rotation.x = -Math.PI/2; badgeGroup.add(inner);
  const bg = prismGeom(o, 0, BADGE.T, shadeBadge);
  // measured face gradient:  226 - 0.126*u + 0.588*v   (u = plane x, v = plane y)
  {
    const pos=bg.getAttribute('position'), col=bg.getAttribute('color');
    for(let i=0;i<pos.count;i++){
      if(col.getX(i)===1 && col.getY(i)===1 && col.getZ(i)===1){
        const v=tone(229.5 - 0.126*pos.getX(i) + 0.588*pos.getZ(i))/255;
        col.setXYZ(i,v,v,v);
      }
    }
  }
  inner.add(new THREE.Mesh(bg,[matCurveVC, matCurveVC, matCurveVC]));
  // rim seams at the shading-zone boundaries
  {
    const sm=[];
    for(const deg of [-8, 82]){
      const a=deg*Math.PI/180, cx=BADGE.R*Math.cos(a), cz=BADGE.R*Math.sin(a);
      sm.push(cx,0,cz, cx,BADGE.T,cz);
    }
    inner.add(makeLines(sm, 2.2, inkThin));
  }
  const L = prismLines(o, 0, BADGE.T, W_BADGE, null, [3,-3,3]);
  inner.add(makeLines(L.segs, L.w, inkMat));
  const CK = [[17.29,21.82],[13.24,17.75],[-1.65,-6.62],[-4.60,-5.96],
              [-12.89,3.14],[-21.07,-5.06],[-3.91,-22.01],[23.21,19.74]];
  const ckg = new THREE.Group(); ckg.position.set(0.9,-0.9,0.9); inner.add(ckg);
  ckg.add(triMesh(polyTris(CK, 0, []), matBlack));
  badgeGroup.position.copy(fromScreen(sx, sy, z));
  badgeGroup.userData.baseY = badgeGroup.position.y;
  return badgeGroup;
}

/* ============================================================
   animation helpers
   ============================================================ */
function tbl(a, t){
  const n=a.length; let i=Math.floor(t), f=t-i;
  i=((i%n)+n)%n; const j=(i+1)%n;
  return a[i]*(1-f)+a[j]*f;
}
const clamp01 = (v)=>v<0?0:v>1?1:v;
const smooth  = (v)=>{ v=clamp01(v); return v*v*(3-2*v); };
/* eased 0..1..0 pulse: rises over \`up\` frames from \`at\`, holds \`hold\`, falls over \`down\` */
function pulse(t, at, up, hold, down){
  const d = t-at;
  if(d<=0 || d>=up+hold+down) return 0;
  if(d<up) return smooth(d/up);
  if(d<up+hold) return 1;
  return smooth(1-(d-up-hold)/down);
}
/* eased 0..1 ramp */
function ramp(t, at, len){ return smooth((t-at)/len); }

/* ============================================================
   the phone
   ============================================================ */
const NF = 240;
const CX = SLAB.X/2, CZ = SLAB.Z/2;
const PH = { X:224, Z:436, H:24, R:50 };
const TOP = PAD_Y + PH.H;
const SCR = { hw:99, hd:205, r:38, y:TOP+0.7 };
/* the screen is the one lit face in the drawing, so it inverts the piece:
   its own detail is drawn in dark ink on light, exactly as the dock's
   capsule carries a dark glyph on a white top */
const darkLine = lineMaterial(COL.white, 0.00012);
const matScreen = new THREE.MeshBasicMaterial({color:grey(14), side:THREE.DoubleSide});
const matBody   = new THREE.MeshBasicMaterial({color:grey(198), side:THREE.DoubleSide});

buildPad();

/* ---- the pad's lane marks, running past the phone on both sides ---- */
{
  const segs=[];
  for(const lx of [CX-196, CX+196]){
    const o = rrOutline(30, 168, 30, 12);
    loopSegs(o.pts.map(p=>[p[0]+lx, p[1]+CZ]), PAD_Y, segs);
  }
  scene.add(makeLines(segs, W_LANE, laneMat));
}

/* ---- body ---- */
const phone = new THREE.Group(); scene.add(phone);
const phoneOut = rrOutline(PH.X/2, PH.Z/2, PH.R, 16);
{
  const body = new THREE.Group(); body.position.set(CX,0,CZ); phone.add(body);
  body.add(new THREE.Mesh(prismGeom(phoneOut, PAD_Y, TOP, shadeCap, true),[matBody,matFlat,matCurveVC]));
  const L = prismLines(phoneOut, PAD_Y, TOP, W_CAP, W_CAPB);
  body.add(makeLines(L.segs, L.w, inkMat));
  const sh = new THREE.Mesh(fanGeom(phoneOut.pts, 0), shadowMat);
  sh.position.set(CX+30, PAD_Y+0.4, CZ+12); sh.renderOrder=-1; scene.add(sh);
}
/* ---- glass ---- */
const screen = new THREE.Group(); screen.position.set(CX,0,CZ); phone.add(screen);
{
  const o = rrOutline(SCR.hw, SCR.hd, SCR.r, 22);
  screen.add(new THREE.Mesh(fanGeom(o.pts, SCR.y), matScreen));
  const li = new THREE.Group(); li.position.set(0.6,0.6,0.6); screen.add(li);
  li.add(makeLines(loopSegs(o.pts, SCR.y, []), 1.4, darkLine));
}

/* ---- status marks, across the top of the glass ---- */
function faceRect(parent, hw, hd, r, x, z, v, y){
  const o = rrOutline(hw,hd,r,5);
  const m = new THREE.Mesh(fanGeom(o.pts.map(p=>[p[0]+x,p[1]+z]), y===undefined?SCR.y+0.3:y),
    new THREE.MeshBasicMaterial({color:grey(v), side:THREE.DoubleSide}));
  parent.add(m); return m;
}
{
  const g = new THREE.Group(); g.position.set(CX,0,CZ); phone.add(g);
  faceRect(g, 17, 4.5, 4.5, -64, -182, 205);   // clock
  faceRect(g, 8,  4.5, 4.5,  50, -182, 205);   // signal
  faceRect(g, 13, 4.5, 4.5,  71, -182, 205);   // battery
}

/* ---- app grid: rounded prisms standing proud of the glass ---- */
const ICON = { hw:16, h:6.5, r:9.5 };
const icons = [];
{
  const cols = [-63, -21, 21, 63];
  const rows = [-116, -70, -24, 22, 68];
  const tones = [186,124,168,142, 132,176,118,158, 172,136,190,126, 120,164,146,182, 178,128,154,138];
  const o = rrOutline(ICON.hw, ICON.hw, ICON.r, 5);
  const L = prismLines(o, SCR.y+0.5, SCR.y+0.5+ICON.h, W_KEY);
  for(let r=0;r<rows.length;r++) for(let c=0;c<cols.length;c++){
    const i = r*4+c;
    const grp = new THREE.Group(); grp.position.set(CX+cols[c], 0, CZ+rows[r]); phone.add(grp);
    const face = new THREE.MeshBasicMaterial({color:grey(tones[i]), side:THREE.DoubleSide});
    const side = new THREE.MeshBasicMaterial({color:grey(248), side:THREE.DoubleSide});
    grp.add(new THREE.Mesh(prismGeom(o, SCR.y+0.5, SCR.y+0.5+ICON.h, null, true),[face,side,side]));
    grp.add(makeLines(L.segs, L.w, darkLine));
    icons.push({ grp, phase:(r*3 + c*2)*4 });
  }
}

/* ---- dock tray and home indicator ---- */
{
  const g = new THREE.Group(); g.position.set(CX,0,CZ); phone.add(g);
  const tray = rrOutline(86, 27, 24, 12);
  const trayPts = tray.pts.map(p=>[p[0], p[1]+142]);
  g.add(new THREE.Mesh(fanGeom(trayPts, SCR.y+0.25),
    new THREE.MeshBasicMaterial({color:grey(72), side:THREE.DoubleSide})));
  const li = new THREE.Group(); li.position.set(0.6,0.6,0.6); g.add(li);
  li.add(makeLines(loopSegs(trayPts, SCR.y+0.25, []), 1.6, darkLine));
  for(const x of [-60,-20,20,60]) faceRect(g, 14, 14, 9, x, 142, 160, SCR.y+0.55);
  faceRect(g, 34, 3, 3, 0, 186, 226);          // home indicator
}

/* ---- dynamic island: two caps and a bar that grows between them ---- */
const island = { grp:new THREE.Group(), lamp:null, discA:null, discB:null, bar:null };
{
  island.grp.position.set(CX, 0, CZ-166); phone.add(island.grp);
  const disc = rrOutline(13,13,13,16);
  const mk = ()=> new THREE.Mesh(fanGeom(disc.pts, SCR.y+0.4), matWhite);
  island.discA = mk(); island.discB = mk();
  const rect = rrOutline(1, 13, 0, 1);
  island.bar = new THREE.Mesh(fanGeom(rect.pts, SCR.y+0.4), matWhite);
  island.grp.add(island.discA, island.discB, island.bar);
  const lampO = rrOutline(7,7,7,12);
  island.lamp = new THREE.Mesh(fanGeom(lampO.pts, SCR.y+0.75),
    new THREE.MeshBasicMaterial({color:grey(24), side:THREE.DoubleSide}));
  island.grp.add(island.lamp);
}

/* ---- the notification the island hands off to ---- */
const CARD = { A:150, B:44, T:14, R:22 };
const cardGroup = new THREE.Group();
cardGroup.position.copy(fromScreen(1064, 250, 70));
cardGroup.rotation.x = -Math.PI/2;
scene.add(cardGroup);
cardGroup.userData.baseY = cardGroup.position.y;
{
  const o = rrOutline(CARD.A, CARD.B, CARD.R, 18);
  cardGroup.add(new THREE.Mesh(prismGeom(o, 0, CARD.T, shadeLid),[matFlat,matFlat,matCurveVC]));
  const L = prismLines(o, 0, CARD.T, W_PLAIN, null, [3,-3,3]);
  cardGroup.add(makeLines(L.segs, L.w, inkMat));
  const face = new THREE.Group(); face.position.set(0.8,-0.8,0.8); cardGroup.add(face);
  const ic = rrOutline(21,21,12,6);
  face.add(new THREE.Mesh(fanGeom(ic.pts.map(p=>[p[0]-108, p[1]]), 0), matBlack));
  const bar1 = rrOutline(52, 8, 8, 5), bar2 = rrOutline(96, 8, 8, 5);
  const mBar = new THREE.MeshBasicMaterial({color:grey(40), side:THREE.DoubleSide});
  face.add(new THREE.Mesh(fanGeom(bar1.pts.map(p=>[p[0]-14, p[1]+18]), 0), mBar));
  face.add(new THREE.Mesh(fanGeom(bar2.pts.map(p=>[p[0]+30, p[1]-14]), 0), mBar));
}

/* ---- badge ---- */
const badgeGroup = buildBadge(552, 262, 30);

/* ============================================================
   animation — two lift waves cross the grid while the island opens
   and hands its notification to the card
   ============================================================ */
const WAVE = [10, 150];
const ISL_OPEN = 60, ISL_CLOSE = 148;
function setFrame(t){
  const bob = 3.2*Math.sin(t/NF*Math.PI*2);
  phone.position.y = bob;

  for(const ic of icons){
    let lift = 0;
    for(const w of WAVE) lift = Math.max(lift, pulse(t, w + ic.phase, 6, 2, 12));
    ic.grp.position.y = 11*lift;
  }

  /* island: caps ride out to the bar's ends as it opens */
  const open = pulse(t, ISL_OPEN, 14, ISL_CLOSE-ISL_OPEN-14, 14);
  const half = 17 + 46*open;
  island.discA.position.x = -half; island.discB.position.x = half;
  island.bar.scale.x = half;
  island.lamp.visible = open > 0.55;
  island.lamp.position.x = -half + 16;

  /* the notification slides down out of the island and back */
  const show = pulse(t, ISL_OPEN+18, 16, 62, 16);
  cardGroup.position.y = cardGroup.userData.baseY + 96*(1-show);
  cardGroup.visible = show > 0.02;

  badgeGroup.position.y = badgeGroup.userData.baseY - 11.5*(1-Math.cos(t/NF*Math.PI*6))*0.5;
}

/* ============================================================
   playback
   ============================================================ */
let t0=null, paused=false;
function frame(now){
  if(t0===null) t0=now;
  if(!paused){
    setFrame(((now-t0)/1000*FPS) % NF);
    renderer.render(scene,camera);
  }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', resize);
resize();
setFrame(0);
renderer.render(scene,camera);
requestAnimationFrame(frame);

window.__setFrame = function(f){ paused=true; setFrame(f); renderer.render(scene,camera); };
window.__play = function(){ paused=false; t0=null; };
<\/script>
</body>
</html>
`,b=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Isometric Browser</title>
<style>
  html,body{margin:0;height:100%;background:#111111;overflow:hidden}  /* matches COL.bg; JS keeps it in sync */
  canvas{display:block;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="scene"></canvas>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================
   Isometric browser — the dock's pad, with a window standing where the lid did.

   A companion piece in the isometric illustration family: the same drawing
   built the same way.  Everything is real 3D geometry under an
   orthographic isometric camera — flat-shaded faces plus instanced
   screen-space "fat line" outlines whose weight varies per edge, exactly
   as the dock's ink does.  Dark mode is a single tone curve over the
   measured greys (see DARK below).
   World units == pixels of the 1604x1080 design frame.
   True isometric projection (camera direction 1,1,1):
     sx = 0.8660254*(X - Z) + 821.00
     sy = 0.5*(X + Z) - Y   + 387.66
   ============================================================ */

const DW = 1604, DH = 1080;
const C30 = Math.cos(Math.PI/6);
const OX = 821.00, OY = 387.66;
const FPS = 60;

/* ---------- tone ----------------------------------------------------------
   The whole piece is greyscale, so dark mode is one curve rather than a second
   palette: every measured grey is inverted and compressed into [LO,HI], which
   keeps the drawing's contrast relationships exactly as the dock measured them.
   Paper goes near-black, ink goes near-white, black faces become light and
   their white detail becomes dark.  DARK=false is the original.
   -------------------------------------------------------------------------- */
const DARK = true;
const TONE_LO = 8, TONE_HI = 246;
function tone(v){
  v = Math.max(0, Math.min(255, v));
  return DARK ? TONE_LO + (255-v)/255*(TONE_HI-TONE_LO) : v;
}
function grey(v){ const c = Math.round(tone(v)); return (c<<16)|(c<<8)|c; }

const COL = {              // the dock's source greys, carried over unchanged
  bg      : grey(245),
  flat    : grey(253),   // straight side walls
  curve   : grey(228),   // curved (corner / cap) side walls
  ink     : grey(0),
  lane    : grey(190),
  glyph   : grey(148),
  puckTop : grey(242),
  puckSide: grey(59),
  badge   : grey(235),
  white   : grey(255),   // detail drawn on top of a black face
  black   : grey(0),     // black top faces
  mid     : grey(120)    // secondary detail
};
/* outline ink weights measured off the reference (design px of black) */
const W_SLAB  = { front:2.32, backBase:0.485, backSkew:-0.215 };
const W_CAP   = { front:2.66, backBase:2.66, backSkew:0 };
const W_CAPB  = { front:3.90, backBase:2.66, backSkew:0 };
const W_PLAIN = { front:2.70, backBase:2.40, backSkew:0 };
const W_BADGE = { front:2.60, backBase:2.60, backSkew:0 };
const W_PUCK  = { front:3.60, backBase:2.60, backSkew:0 };
const W_KEY   = { front:2.30, backBase:1.70, backSkew:0 };
const W_LANE  = 3.5;
const SHADOW_A = 0.061;              // slab drop shadow / decorative squares
const PUCKSH = { a:0.29, r:72.5 };   // contact shadow a puck drops on what it rides

/* ---------- the shared stage ---------- */
const SLAB = { X:501.0, Z:528.8, H:42.26, R:78 };

/* ============================================================
   renderer / camera
   ============================================================ */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, preserveDrawingBuffer:true});
renderer.setClearColor(COL.bg, 1);
document.body.style.background = '#' + COL.bg.toString(16).padStart(6,'0');
renderer.sortObjects = true;
renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1,1,1,-1,-6000,6000);
const K = 1/Math.sqrt(2/3);
(function(){
  const tx=(DW/2-OX)/C30, ty=(DH/2-OY);
  const X=(ty*2+tx)/2, Z=(ty*2-tx)/2;
  camera.position.set(X+2000, 2000, Z+2000);
  camera.lookAt(X,0,Z);
})();

const FITW = 1010;          // horizontal fit box (content width + margin)
const lineMats = [];
let viewScale = 1;
function resize(){
  const w = canvas.clientWidth||DW, h = canvas.clientHeight||DH;
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w,h,false);
  // fit: exactly the reference framing at the design aspect, and a tighter
  // horizontal fit on narrow/portrait viewports so the object never gets tiny
  viewScale = Math.min(w/FITW, h/DH);
  const cw = (w/viewScale)/K, ch = (h/viewScale)/K;
  camera.left=-cw/2; camera.right=cw/2; camera.top=ch/2; camera.bottom=-ch/2;
  camera.updateProjectionMatrix();
  const rx=w*dpr, ry=h*dpr;
  lineMats.forEach(m=>{ m.uniforms.resolution.value.set(rx,ry); m.uniforms.pxScale.value = viewScale*dpr; });
  placeSquares();
}

/* place an object's origin on a design-frame screen point, at a chosen depth */
function fromScreen(sx, sy, z){
  const x = (sx-OX)/C30 + z;
  const y = 0.5*(x+z) - (sy-OY);
  return new THREE.Vector3(x,y,z);
}

/* ============================================================
   instanced fat lines (orthographic camera only)
   ============================================================ */
const LINE_VS = \`
attribute vec3 aStart; attribute vec3 aEnd; attribute float aWidth;
uniform vec2 resolution; uniform float pxScale; uniform float bias;
varying float vWX;
void main(){
  vec3 wp = (modelMatrix * vec4(mix(aStart,aEnd,position.x),1.0)).xyz;
  vWX = wp.x - wp.y;
  vec4 s = projectionMatrix * modelViewMatrix * vec4(aStart,1.0);
  vec4 e = projectionMatrix * modelViewMatrix * vec4(aEnd,1.0);
  vec2 hs = resolution*0.5;
  vec2 ps = s.xy*hs, pe = e.xy*hs;
  vec2 d = pe-ps; float L = length(d);
  d = (L>0.0001)? d/L : vec2(1.0,0.0);
  vec2 n = vec2(-d.y,d.x);
  float hw = aWidth*pxScale*0.5;
  vec2 p = mix(ps,pe,position.x) + n*(position.y*hw) + d*((position.x*2.0-1.0)*hw);
  gl_Position = vec4(p/hs, mix(s.z,e.z,position.x) - bias, 1.0);
}\`;
const LINE_FS = \`uniform vec3 diffuse; uniform float opacity; uniform float clipX;
varying float vWX;
void main(){ if(vWX > clipX) discard; gl_FragColor = vec4(diffuse, opacity); }\`;

function lineMaterial(color, bias, opacity){
  const m = new THREE.ShaderMaterial({
    uniforms:{ diffuse:{value:new THREE.Color(color)}, opacity:{value:opacity===undefined?1:opacity},
      resolution:{value:new THREE.Vector2(DW,DH)}, pxScale:{value:1}, bias:{value:bias||0.0004},
      clipX:{value:1e9} },
    vertexShader:LINE_VS, fragmentShader:LINE_FS,
    transparent:(opacity!==undefined && opacity<1), depthWrite:!(opacity!==undefined && opacity<1)
  });
  lineMats.push(m); return m;
}
const QUADPOS = new THREE.Float32BufferAttribute([0,-1,0, 1,-1,0, 1,1,0, 0,-1,0, 1,1,0, 0,1,0],3);
function makeLines(segs, widths, material){
  const n = segs.length/6;
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', QUADPOS);
  const a=new Float32Array(n*3), b=new Float32Array(n*3), w=new Float32Array(n);
  for(let i=0;i<n;i++){
    for(let k=0;k<3;k++){ a[i*3+k]=segs[i*6+k]; b[i*3+k]=segs[i*6+3+k]; }
    w[i] = (typeof widths==='number') ? widths : widths[i];
  }
  g.setAttribute('aStart', new THREE.InstancedBufferAttribute(a,3));
  g.setAttribute('aEnd',   new THREE.InstancedBufferAttribute(b,3));
  g.setAttribute('aWidth', new THREE.InstancedBufferAttribute(w,1));
  g.instanceCount = n;
  const m = new THREE.Mesh(g, material); m.frustumCulled = false;
  return m;
}

/* ============================================================
   outline / prism helpers   (shapes live in the XZ plane, extruded on Y)
   ============================================================ */
function rrOutline(hw, hd, r, seg){
  r = Math.min(r, hw, hd);
  const pts=[], kind=[], nrm=[];
  const cs=[[hw-r,hd-r,0],[-(hw-r),hd-r,Math.PI/2],[-(hw-r),-(hd-r),Math.PI],[hw-r,-(hd-r),Math.PI*1.5]];
  for(let c=0;c<4;c++){
    const [cx,cz,a0]=cs[c];
    for(let i=0;i<=seg;i++){
      const a=a0+i/seg*Math.PI/2;
      pts.push([cx+r*Math.cos(a), cz+r*Math.sin(a)]);
      kind.push(i<seg?1:0);
      const am = (i<seg) ? a0+(i+0.5)/seg*Math.PI/2 : a0+Math.PI/2;   // segment mid normal
      nrm.push([Math.cos(am), Math.sin(am)]);
    }
  }
  return {pts,kind,nrm};
}
function edgeWeight(n, cfg){
  const d = (n[0]+n[1])*0.7071;                 // +1 toward camera, -1 away
  const t = Math.min(1, Math.max(0, (d+0.7071)/1.4142));
  const back = cfg.backBase + cfg.backSkew*(n[0]-n[1]);
  return back + (cfg.front-back)*t;
}
function prismGeom(outline, y0, y1, curveShade, noBottom){
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  const cap=[], flat=[], curve=[], ccol=[];
  let cx=0, cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    cap.push(cx,y1,cz, b[0],y1,b[1], a[0],y1,a[1]);
    if(!noBottom) cap.push(cx,y0,cz, a[0],y0,a[1], b[0],y0,b[1]);
  }
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    const t = kind[i]? curve : flat;
    t.push(a[0],y0,a[1], b[0],y1,b[1], b[0],y0,b[1]);
    t.push(a[0],y0,a[1], a[0],y1,a[1], b[0],y1,b[1]);
    if(kind[i] && curveShade){
      const c = curveShade(nrm[i][0], nrm[i][1]);
      for(let q=0;q<6;q++) ccol.push(c.r,c.g,c.b);
    }
  }
  const all = cap.concat(flat, curve);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(all,3));
  if(curveShade){
    const col=new Float32Array(all.length);
    for(let i=0;i<col.length;i++) col[i]=1;
    const off=cap.length+flat.length;
    for(let i=0;i<ccol.length;i++) col[off+i]=ccol[i];
    g.setAttribute('color', new THREE.BufferAttribute(col,3));
  }
  g.addGroup(0, cap.length/3, 0);
  g.addGroup(cap.length/3, flat.length/3, 1);
  g.addGroup((cap.length+flat.length)/3, curve.length/3, 2);
  return g;
}
// outline segments + matching per-segment weights
// e nudges the outline toward the camera along (1,1,1): screen position is
// unchanged, but the line wins the depth test against the slanted wall it sits on
function prismLines(outline, y0, y1, cfg, cfgBot, nudge){
  cfgBot = cfgBot || cfg;
  const [ex,ey,ez] = nudge || [3,3,3];
  const segs=[], w=[];
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    segs.push(a[0]+ex,y1+ey,a[1]+ez, b[0]+ex,y1+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfg));
    segs.push(a[0]+ex,y0+ey,a[1]+ez, b[0]+ex,y0+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfgBot));
  }
  const len=(i)=>{const a=pts[i],b=pts[(i+1)%n];return Math.hypot(a[0]-b[0],a[1]-b[1]);};
  for(let i=0;i<n;i++){
    const j=(i-1+n)%n;
    if(kind[j]!==kind[i] && len(j)>0.5 && len(i)>0.5){
      const p=pts[i];
      segs.push(p[0]+ex,y0+ey,p[1]+ez, p[0]+ex,y1+ey,p[1]+ez);
      w.push(edgeWeight(nrm[i], cfg));
    }
  }
  return {segs, w};
}
function loopSegs(pts, y, out){
  out = out||[];
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    out.push(a[0],y,a[1], b[0],y,b[1]);
  }
  return out;
}
function fanGeom(pts, y){
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  const a=[];
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    a.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}
function fanTris(pts, y, out){
  out = out||[];
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    out.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  return out;
}
// concave-safe planar polygon (ear clipping via three's ShapeUtils)
function polyTris(poly, y, out){
  out = out||[];
  const c = poly.map(p=>new THREE.Vector2(p[0],p[1]));
  const f = THREE.ShapeUtils.triangulateShape(c, []);
  for(const t of f){
    for(const idx of t){ out.push(poly[idx][0], y, poly[idx][1]); }
  }
  return out;
}
function triMesh(arr, mat){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(arr,3));
  return new THREE.Mesh(g, mat);
}
/* a rounded-rect plate laid flat: filled face + its own hairline, as one group */
function plate(hw, hd, r, seg, colour, weight, mat){
  const o = rrOutline(hw, hd, r, seg||10);
  const g = new THREE.Group();
  const fill = new THREE.Mesh(fanGeom(o.pts, 0), mat || new THREE.MeshBasicMaterial({color:colour, side:THREE.DoubleSide}));
  g.add(fill);
  if(weight){
    const ln = new THREE.Group(); ln.position.set(0.7,0.7,0.7); g.add(ln);
    ln.add(makeLines(loopSegs(o.pts,0,[]), weight, inkThin));
  }
  g.userData.fill = fill; g.userData.outline = o;
  return g;
}
function annulusGeom(rin, rout, y, seg){
  const a=[];
  for(let i=0;i<seg;i++){
    const t0=i/seg*Math.PI*2, t1=(i+1)/seg*Math.PI*2;
    const p=(r,t)=>[r*Math.cos(t), y, r*Math.sin(t)];
    const A=p(rin,t0),B=p(rout,t0),C=p(rout,t1),D=p(rin,t1);
    a.push(...A,...B,...C, ...A,...C,...D);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}

/* ============================================================
   textures
   ============================================================ */
function discAlphaTexture(size, inner){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  const c=(size-1)/2;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const r=Math.hypot(x-c,y-c)/c;
    let a=1-(r-inner)/(1-inner); a=Math.max(0,Math.min(1,a));
    a=a*a*(3-2*a);
    const i=(y*size+x)*4;
    img.data[i]=img.data[i+1]=img.data[i+2]=255;   // white, so the material colour drives the tone
    img.data[i+3]=Math.round(a*255);
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
function grainTexture(size, base, amp){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  let s=12345;
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  for(let i=0;i<size*size;i++){
    const r=(rnd()+rnd()+rnd()+rnd()-2)/2;
    let v = base + amp*r - amp*1.65*Math.pow(rnd(),3);
    v = tone(v);          // inverts the dust specks along with the paper
    img.data[i*4]=img.data[i*4+1]=img.data[i*4+2]=v; img.data[i*4+3]=255;
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
const grainTex = grainTexture(512, 239, 11);
const GRAIN_SCALE = 700;

/* ============================================================
   materials
   ============================================================ */
const matTop   = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:grainTex, side:THREE.DoubleSide});  // tone lives in the texture
const matFlat  = new THREE.MeshBasicMaterial({color:COL.flat,  side:THREE.DoubleSide});
const matCurve = new THREE.MeshBasicMaterial({color:COL.curve, side:THREE.DoubleSide});
const matCurveVC= new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide, vertexColors:true});
const CGRAY = new THREE.Color(grey(233));  // curved walls of the light bodies
const CBLK  = new THREE.Color(grey(0));
const CWHT  = new THREE.Color(grey(253));
function angDeg(nx,nz){ let a=Math.atan2(nz,nx)*180/Math.PI; if(a>180)a-=360; if(a<-180)a+=360; return a; }
const shadeLid   = (nx,nz)=>{ const a=angDeg(nx,nz); return (a>-30 && a<2)? CBLK : CGRAY; };
const shadeBadge = (nx,nz)=>{ const a=angDeg(nx,nz);
  if(a>-50 && a<-8) return CBLK;
  if(a>=-8 && a<82) return CWHT;
  return CGRAY; };
const shadeCap   = ()=>CGRAY;
const matBlack = new THREE.MeshBasicMaterial({color:COL.black, side:THREE.DoubleSide});
const matWhite = new THREE.MeshBasicMaterial({color:COL.white, side:THREE.DoubleSide});
const matMid   = new THREE.MeshBasicMaterial({color:COL.mid,   side:THREE.DoubleSide});
const inkMat   = lineMaterial(COL.ink, 0.00020);
const inkThin  = lineMaterial(COL.ink, 0.00012);
const laneMat  = lineMaterial(COL.lane, 0.00025);
const shadowMat= new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:SHADOW_A, depthWrite:false});

/* ============================================================
   the pad every piece in this family stands on
   ============================================================ */
const slabOut = rrOutline(SLAB.X/2, SLAB.Z/2, SLAB.R, 16);
const SLAB_POS = new THREE.Vector3(SLAB.X/2, 0, SLAB.Z/2);
const PAD_Y = SLAB.H;
function buildPad(){
  const g = prismGeom(slabOut, 0, SLAB.H);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+SLAB.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+SLAB.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  const m = new THREE.Mesh(g,[matTop,matFlat,matCurve]);
  m.position.copy(SLAB_POS); scene.add(m);
  const L = prismLines(slabOut, 0, SLAB.H, W_SLAB);
  const ln = makeLines(L.segs, L.w, inkMat); ln.position.copy(SLAB_POS); scene.add(ln);
  // drop shadow: silhouette translated (52, 0, 20.8) on the floor
  const sh = new THREE.Mesh(fanGeom(slabOut.pts, 0), shadowMat);
  sh.position.set(SLAB.X/2+52, -0.6, SLAB.Z/2+20.8);
  sh.renderOrder = -1; scene.add(sh);
}

/* ============================================================
   decorative squares (screen-space, multiply-like)
   ============================================================ */
const squares = new THREE.Group(); scene.add(squares);
{
  const defs=[[370,520,41,0.0245],[327,558,41,0.0612],[1119,512,41,0.0612],[1226,621,41,0.0612]];
  for(const [sx,sy,s,al] of defs){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),
      new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:al, depthTest:false, depthWrite:false}));
    m.renderOrder = 100;
    m.userData.screen=[sx+s/2, sy+s/2];
    squares.add(m);
  }
}
function placeSquares(){
  for(const m of squares.children){
    const [sx,sy]=m.userData.screen;
    const z=-400;
    const x=(sx-OX)/C30 + z;
    const y=0.5*(x+z)-(sy-OY);
    m.position.set(x,y,z);
    m.quaternion.copy(camera.quaternion);
  }
}

/* ============================================================
   the family's checkmark badge — a coin standing in the XY plane
   ============================================================ */
const BADGE = { R:43.28, T:16.0 };
function buildBadge(sx, sy, z){
  const badgeGroup = new THREE.Group(); scene.add(badgeGroup);
  const o = rrOutline(BADGE.R, BADGE.R, BADGE.R, 48);
  const inner = new THREE.Group(); inner.rotation.x = -Math.PI/2; badgeGroup.add(inner);
  const bg = prismGeom(o, 0, BADGE.T, shadeBadge);
  // measured face gradient:  226 - 0.126*u + 0.588*v   (u = plane x, v = plane y)
  {
    const pos=bg.getAttribute('position'), col=bg.getAttribute('color');
    for(let i=0;i<pos.count;i++){
      if(col.getX(i)===1 && col.getY(i)===1 && col.getZ(i)===1){
        const v=tone(229.5 - 0.126*pos.getX(i) + 0.588*pos.getZ(i))/255;
        col.setXYZ(i,v,v,v);
      }
    }
  }
  inner.add(new THREE.Mesh(bg,[matCurveVC, matCurveVC, matCurveVC]));
  // rim seams at the shading-zone boundaries
  {
    const sm=[];
    for(const deg of [-8, 82]){
      const a=deg*Math.PI/180, cx=BADGE.R*Math.cos(a), cz=BADGE.R*Math.sin(a);
      sm.push(cx,0,cz, cx,BADGE.T,cz);
    }
    inner.add(makeLines(sm, 2.2, inkThin));
  }
  const L = prismLines(o, 0, BADGE.T, W_BADGE, null, [3,-3,3]);
  inner.add(makeLines(L.segs, L.w, inkMat));
  const CK = [[17.29,21.82],[13.24,17.75],[-1.65,-6.62],[-4.60,-5.96],
              [-12.89,3.14],[-21.07,-5.06],[-3.91,-22.01],[23.21,19.74]];
  const ckg = new THREE.Group(); ckg.position.set(0.9,-0.9,0.9); inner.add(ckg);
  ckg.add(triMesh(polyTris(CK, 0, []), matBlack));
  badgeGroup.position.copy(fromScreen(sx, sy, z));
  badgeGroup.userData.baseY = badgeGroup.position.y;
  return badgeGroup;
}

/* ============================================================
   animation helpers
   ============================================================ */
function tbl(a, t){
  const n=a.length; let i=Math.floor(t), f=t-i;
  i=((i%n)+n)%n; const j=(i+1)%n;
  return a[i]*(1-f)+a[j]*f;
}
const clamp01 = (v)=>v<0?0:v>1?1:v;
const smooth  = (v)=>{ v=clamp01(v); return v*v*(3-2*v); };
/* eased 0..1..0 pulse: rises over \`up\` frames from \`at\`, holds \`hold\`, falls over \`down\` */
function pulse(t, at, up, hold, down){
  const d = t-at;
  if(d<=0 || d>=up+hold+down) return 0;
  if(d<up) return smooth(d/up);
  if(d<up+hold) return 1;
  return smooth(1-(d-up-hold)/down);
}
/* eased 0..1 ramp */
function ramp(t, at, len){ return smooth((t-at)/len); }

/* ============================================================
   the browser
   ============================================================ */
const NF = 240;
const CX = SLAB.X/2, CZ = SLAB.Z/2;
const BR = { A:222, B:140, T:18, R:24 };
/* the window is the lit face here, so everything drawn on it is dark ink on
   light — the inverse of the pad below it, exactly as the dock's capsule is.
   It is placed by screen point at a deep z so it reads as floating clear in
   front of the pad it overlaps. */
const WIN_Z = 520;
const darkLine = lineMaterial(COL.white, 0.00012);

buildPad();

/* ---- lane marks the mouse tracks across ---- */
{
  const segs=[];
  for(const lz of [CZ-140, CZ+140]){
    const o = rrOutline(176, 33, 33, 12);
    loopSegs(o.pts.map(p=>[p[0]+CX, p[1]+lz]), PAD_Y, segs);
  }
  scene.add(makeLines(segs, W_LANE, laneMat));
}

/* ============================================================
   the mouse on the pad
   ============================================================ */
const MOUSE = { hw:46, hd:70, r:42, h:34 };
const mouseGroup = new THREE.Group(); scene.add(mouseGroup);
let mouseShadow = null;
{
  const o = rrOutline(MOUSE.hw, MOUSE.hd, MOUSE.r, 22);
  const matShell = new THREE.MeshBasicMaterial({color:grey(128), side:THREE.DoubleSide});
  mouseGroup.add(new THREE.Mesh(prismGeom(o, PAD_Y, PAD_Y+MOUSE.h, shadeCap, true),[matShell,matFlat,matCurveVC]));
  const L = prismLines(o, PAD_Y, PAD_Y+MOUSE.h, W_PUCK, W_PLAIN);
  mouseGroup.add(makeLines(L.segs, L.w, inkMat));
  // the split between the click plates, and the wheel slot between them
  const top = new THREE.Group(); top.position.set(2.5,2.5,2.5); mouseGroup.add(top);
  top.add(makeLines([0,PAD_Y+MOUSE.h,-MOUSE.hd+8, 0,PAD_Y+MOUSE.h,-8], 2.2, inkMat));
  const slot = rrOutline(4.5, 13, 4.5, 6);
  top.add(new THREE.Mesh(fanGeom(slot.pts.map(p=>[p[0], p[1]-28]), PAD_Y+MOUSE.h), matBlack));
  mouseShadow = new THREE.Mesh(fanGeom(o.pts, 0), shadowMat);
  mouseShadow.position.y = PAD_Y+0.4; mouseShadow.renderOrder=-1; scene.add(mouseShadow);
}

/* ============================================================
   the window, standing in the XY plane like the dock's lid
   ============================================================ */
const win = new THREE.Group();
win.position.copy(fromScreen(872, 300, WIN_Z));
win.rotation.x = -Math.PI/2;
scene.add(win);
const face = new THREE.Group(); face.position.set(0.8,-0.8,0.8); win.add(face);
{
  const o = rrOutline(BR.A, BR.B, BR.R, 20);
  win.add(new THREE.Mesh(prismGeom(o, 0, BR.T, shadeCap),[matBlack,matFlat,matCurveVC]));
  const L = prismLines(o, 0, BR.T, W_CAP, W_CAPB, [3,-3,3]);
  win.add(makeLines(L.segs, L.w, inkMat));
}
/* one filled, optionally outlined rounded rect on the window's face */
function faceBlock(hw, hd, r, x, z, v, weight, parent){
  const o = rrOutline(hw, hd, r, Math.max(4, Math.round(r/3)));
  const g = new THREE.Group(); g.position.set(x, 0, z); (parent||face).add(g);
  if(v !== null) g.add(new THREE.Mesh(fanGeom(o.pts, 0), new THREE.MeshBasicMaterial({color:grey(v), side:THREE.DoubleSide})));
  if(weight){
    const ln = new THREE.Group(); ln.position.set(0.5,-0.5,0.5); g.add(ln);
    ln.add(makeLines(loopSegs(o.pts, 0, []), weight, darkLine));
  }
  return g;
}

/* ---- chrome: window buttons, an address field, and the divider ---- */
const CHROME_Z = BR.B - 26;
const DIV_Z = BR.B - 50;
{
  let x = -BR.A + 30;
  for(const v of [255, 214, 178]){ faceBlock(7.5, 7.5, 7.5, x, CHROME_Z, v); x += 25; }
  const url = faceBlock(104, 13, 13, -2, CHROME_Z, 22, 1.6);
  faceBlock(5, 6.5, 2.4, -92, 0, 208, 0, url);             // the lock, in the field's own frame
  faceBlock(48, 4.5, 4.5, -20, 0, 168, 0, url);            // the address
  faceBlock(10, 10, 3.2, BR.A-58, CHROME_Z, 214, 0);
  faceBlock(10, 10, 10, BR.A-30, CHROME_Z, 214, 0);
  const div = new THREE.Group(); div.position.set(1,-1,1); face.add(div);
  div.add(makeLines([-BR.A+7, 0, DIV_Z, BR.A-7, 0, DIV_Z], 1.5, darkLine));
}
/* the load bar rides the divider and sweeps the width of the window */
const LOAD_HALF = BR.A - 7;
const loadBar = faceBlock(1, 3.2, 0, 0, DIV_Z, 255);

/* ---- content: it pops in once the load bar clears ---- */
const blocks = [];
function contentBlock(hw, hd, r, x, z, v, at, weight){
  const g = faceBlock(hw, hd, r, x, z, v, weight);
  blocks.push({ g, at });
  return g;
}
contentBlock(BR.A-32, 38, 13, 0, 42, 104, 20);
contentBlock(130, 5.5, 5.5, -BR.A+32+130, -8, 196, 30);
contentBlock(96, 5.5, 5.5, -BR.A+32+96, -28, 222, 36);
const cta = contentBlock(52, 16, 16, -BR.A+32+52, -58, 255, 62);
faceBlock(26, 4.5, 4.5, 0, 0, 30, 0, cta);
const ctaFill = cta.children[0];
for(let i=0;i<3;i++) contentBlock(60, 26, 11, -132+i*132, -110, 74, 44+i*7);

/* ---- cursor and its click ring ---- */
const CURSOR = [[0,0],[0,-30],[8,-22],[13,-32],[19,-29],[14,-19],[22,-18]];
const cursor = new THREE.Group(); cursor.position.set(2,-2,2); win.add(cursor);
{
  const g = new THREE.Group(); g.scale.setScalar(1.25); cursor.add(g);
  g.add(triMesh(polyTris(CURSOR, 0, []), matWhite));
  const ln = new THREE.Group(); ln.position.set(0.4,-0.4,0.4); g.add(ln);
  ln.add(makeLines(loopSegs(CURSOR, 0, []), 1.2, inkThin));
}
const ring = new THREE.Mesh(annulusGeom(20, 24, 0, 40),
  new THREE.MeshBasicMaterial({color:COL.white, transparent:true, opacity:0, depthWrite:false}));
ring.position.set(2.4,-2.4,2.4); win.add(ring);

/* ---- badge ---- */
const badgeGroup = buildBadge(612, 244, 30);

/* ============================================================
   animation — the page loads, the pointer walks to the call to action,
   presses it, and walks back
   ============================================================ */
const LOAD_AT = 6, LOAD_LEN = 40;
const REACH_AT = 84, REACH_LEN = 38, CLICK_AT = 128;
const LEAVE_AT = 164, LEAVE_LEN = 40;
const CLEAR_AT = 206;
const CUR_HOME = [150, -118], CUR_TARGET = [-BR.A+32+40, -50];
const MOUSE_HOME = [CX+142, CZ+56], MOUSE_TARGET = [CX-4, CZ+152];

function setFrame(t){
  /* load bar: a sweep across the divider, gone once the page is up */
  const load = smooth((t-LOAD_AT)/LOAD_LEN);
  loadBar.scale.x = Math.max(LOAD_HALF*load, 0.001);
  loadBar.position.x = -LOAD_HALF + LOAD_HALF*load;
  loadBar.visible = t > LOAD_AT && t < LOAD_AT+LOAD_LEN+8;

  /* content pops in, then clears in the same order for the next pass */
  for(let i=0;i<blocks.length;i++){
    const b = blocks[i];
    const s = ramp(t, b.at, 13) * (1 - ramp(t, CLEAR_AT + i*3, 11));
    b.g.scale.set(Math.max(s,0.0001), 1, Math.max(s,0.0001));
  }

  /* pointer and mouse travel together */
  const go = ramp(t, REACH_AT, REACH_LEN) - ramp(t, LEAVE_AT, LEAVE_LEN);
  const press = pulse(t, CLICK_AT, 3, 4, 9);
  const cx = CUR_HOME[0] + (CUR_TARGET[0]-CUR_HOME[0])*go;
  const cz = CUR_HOME[1] + (CUR_TARGET[1]-CUR_HOME[1])*go;
  cursor.position.set(cx+2, -2, cz+2);
  cursor.children[0].scale.setScalar(1.25*(1 - 0.12*press));
  mouseGroup.position.set(MOUSE_HOME[0] + (MOUSE_TARGET[0]-MOUSE_HOME[0])*go,
                          -2.5*press,
                          MOUSE_HOME[1] + (MOUSE_TARGET[1]-MOUSE_HOME[1])*go);
  mouseShadow.position.x = mouseGroup.position.x + 16;
  mouseShadow.position.z = mouseGroup.position.z + 7;

  /* the call to action answers the press, and a ring leaves the tip */
  ctaFill.material.color.setScalar(tone(255 - 175*press)/255);
  const rp = clamp01((t-CLICK_AT)/26);
  ring.visible = rp > 0 && rp < 1;
  ring.position.set(cx+2.4, -2.4, cz+2.4);
  ring.scale.setScalar(0.25 + 1.5*rp);
  ring.material.opacity = 0.75*(1-rp);

  badgeGroup.position.y = badgeGroup.userData.baseY - 11.5*(1-Math.cos(t/NF*Math.PI*6))*0.5;
}

/* ============================================================
   playback
   ============================================================ */
let t0=null, paused=false;
function frame(now){
  if(t0===null) t0=now;
  if(!paused){
    setFrame(((now-t0)/1000*FPS) % NF);
    renderer.render(scene,camera);
  }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', resize);
resize();
setFrame(0);
renderer.render(scene,camera);
requestAnimationFrame(frame);

window.__setFrame = function(f){ paused=true; setFrame(f); renderer.render(scene,camera); };
window.__play = function(){ paused=false; t0=null; };
<\/script>
</body>
</html>
`,v=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Isometric Wallet</title>
<style>
  html,body{margin:0;height:100%;background:#111111;overflow:hidden}  /* matches COL.bg; JS keeps it in sync */
  canvas{display:block;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="scene"></canvas>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================
   Isometric wallet — a card stack lifting clear of a saddle-stitched bifold.

   A companion piece in the isometric illustration family: the same drawing
   built the same way.  Everything is real 3D geometry under an
   orthographic isometric camera — flat-shaded faces plus instanced
   screen-space "fat line" outlines whose weight varies per edge, exactly
   as the dock's ink does.  Dark mode is a single tone curve over the
   measured greys (see DARK below).
   World units == pixels of the 1604x1080 design frame.
   True isometric projection (camera direction 1,1,1):
     sx = 0.8660254*(X - Z) + 821.00
     sy = 0.5*(X + Z) - Y   + 387.66
   ============================================================ */

const DW = 1604, DH = 1080;
const C30 = Math.cos(Math.PI/6);
const OX = 821.00, OY = 387.66;
const FPS = 60;

/* ---------- tone ----------------------------------------------------------
   The whole piece is greyscale, so dark mode is one curve rather than a second
   palette: every measured grey is inverted and compressed into [LO,HI], which
   keeps the drawing's contrast relationships exactly as the dock measured them.
   Paper goes near-black, ink goes near-white, black faces become light and
   their white detail becomes dark.  DARK=false is the original.
   -------------------------------------------------------------------------- */
const DARK = true;
const TONE_LO = 8, TONE_HI = 246;
function tone(v){
  v = Math.max(0, Math.min(255, v));
  return DARK ? TONE_LO + (255-v)/255*(TONE_HI-TONE_LO) : v;
}
function grey(v){ const c = Math.round(tone(v)); return (c<<16)|(c<<8)|c; }

const COL = {              // the dock's source greys, carried over unchanged
  bg      : grey(245),
  flat    : grey(253),   // straight side walls
  curve   : grey(228),   // curved (corner / cap) side walls
  ink     : grey(0),
  lane    : grey(190),
  glyph   : grey(148),
  puckTop : grey(242),
  puckSide: grey(59),
  badge   : grey(235),
  white   : grey(255),   // detail drawn on top of a black face
  black   : grey(0),     // black top faces
  mid     : grey(120)    // secondary detail
};
/* outline ink weights measured off the reference (design px of black) */
const W_SLAB  = { front:2.32, backBase:0.485, backSkew:-0.215 };
const W_CAP   = { front:2.66, backBase:2.66, backSkew:0 };
const W_CAPB  = { front:3.90, backBase:2.66, backSkew:0 };
const W_PLAIN = { front:2.70, backBase:2.40, backSkew:0 };
const W_BADGE = { front:2.60, backBase:2.60, backSkew:0 };
const W_PUCK  = { front:3.60, backBase:2.60, backSkew:0 };
const W_KEY   = { front:2.30, backBase:1.70, backSkew:0 };
const W_LANE  = 3.5;
const SHADOW_A = 0.061;              // slab drop shadow / decorative squares
const PUCKSH = { a:0.29, r:72.5 };   // contact shadow a puck drops on what it rides

/* ---------- the shared stage ---------- */
const SLAB = { X:501.0, Z:528.8, H:42.26, R:78 };

/* ============================================================
   renderer / camera
   ============================================================ */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, preserveDrawingBuffer:true});
renderer.setClearColor(COL.bg, 1);
document.body.style.background = '#' + COL.bg.toString(16).padStart(6,'0');
renderer.sortObjects = true;
renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1,1,1,-1,-6000,6000);
const K = 1/Math.sqrt(2/3);
(function(){
  const tx=(DW/2-OX)/C30, ty=(DH/2-OY);
  const X=(ty*2+tx)/2, Z=(ty*2-tx)/2;
  camera.position.set(X+2000, 2000, Z+2000);
  camera.lookAt(X,0,Z);
})();

const FITW = 1010;          // horizontal fit box (content width + margin)
const lineMats = [];
let viewScale = 1;
function resize(){
  const w = canvas.clientWidth||DW, h = canvas.clientHeight||DH;
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w,h,false);
  // fit: exactly the reference framing at the design aspect, and a tighter
  // horizontal fit on narrow/portrait viewports so the object never gets tiny
  viewScale = Math.min(w/FITW, h/DH);
  const cw = (w/viewScale)/K, ch = (h/viewScale)/K;
  camera.left=-cw/2; camera.right=cw/2; camera.top=ch/2; camera.bottom=-ch/2;
  camera.updateProjectionMatrix();
  const rx=w*dpr, ry=h*dpr;
  lineMats.forEach(m=>{ m.uniforms.resolution.value.set(rx,ry); m.uniforms.pxScale.value = viewScale*dpr; });
  placeSquares();
}

/* place an object's origin on a design-frame screen point, at a chosen depth */
function fromScreen(sx, sy, z){
  const x = (sx-OX)/C30 + z;
  const y = 0.5*(x+z) - (sy-OY);
  return new THREE.Vector3(x,y,z);
}

/* ============================================================
   instanced fat lines (orthographic camera only)
   ============================================================ */
const LINE_VS = \`
attribute vec3 aStart; attribute vec3 aEnd; attribute float aWidth;
uniform vec2 resolution; uniform float pxScale; uniform float bias;
varying float vWX;
void main(){
  vec3 wp = (modelMatrix * vec4(mix(aStart,aEnd,position.x),1.0)).xyz;
  vWX = wp.x - wp.y;
  vec4 s = projectionMatrix * modelViewMatrix * vec4(aStart,1.0);
  vec4 e = projectionMatrix * modelViewMatrix * vec4(aEnd,1.0);
  vec2 hs = resolution*0.5;
  vec2 ps = s.xy*hs, pe = e.xy*hs;
  vec2 d = pe-ps; float L = length(d);
  d = (L>0.0001)? d/L : vec2(1.0,0.0);
  vec2 n = vec2(-d.y,d.x);
  float hw = aWidth*pxScale*0.5;
  vec2 p = mix(ps,pe,position.x) + n*(position.y*hw) + d*((position.x*2.0-1.0)*hw);
  gl_Position = vec4(p/hs, mix(s.z,e.z,position.x) - bias, 1.0);
}\`;
const LINE_FS = \`uniform vec3 diffuse; uniform float opacity; uniform float clipX;
varying float vWX;
void main(){ if(vWX > clipX) discard; gl_FragColor = vec4(diffuse, opacity); }\`;

function lineMaterial(color, bias, opacity){
  const m = new THREE.ShaderMaterial({
    uniforms:{ diffuse:{value:new THREE.Color(color)}, opacity:{value:opacity===undefined?1:opacity},
      resolution:{value:new THREE.Vector2(DW,DH)}, pxScale:{value:1}, bias:{value:bias||0.0004},
      clipX:{value:1e9} },
    vertexShader:LINE_VS, fragmentShader:LINE_FS,
    transparent:(opacity!==undefined && opacity<1), depthWrite:!(opacity!==undefined && opacity<1)
  });
  lineMats.push(m); return m;
}
const QUADPOS = new THREE.Float32BufferAttribute([0,-1,0, 1,-1,0, 1,1,0, 0,-1,0, 1,1,0, 0,1,0],3);
function makeLines(segs, widths, material){
  const n = segs.length/6;
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', QUADPOS);
  const a=new Float32Array(n*3), b=new Float32Array(n*3), w=new Float32Array(n);
  for(let i=0;i<n;i++){
    for(let k=0;k<3;k++){ a[i*3+k]=segs[i*6+k]; b[i*3+k]=segs[i*6+3+k]; }
    w[i] = (typeof widths==='number') ? widths : widths[i];
  }
  g.setAttribute('aStart', new THREE.InstancedBufferAttribute(a,3));
  g.setAttribute('aEnd',   new THREE.InstancedBufferAttribute(b,3));
  g.setAttribute('aWidth', new THREE.InstancedBufferAttribute(w,1));
  g.instanceCount = n;
  const m = new THREE.Mesh(g, material); m.frustumCulled = false;
  return m;
}

/* ============================================================
   outline / prism helpers   (shapes live in the XZ plane, extruded on Y)
   ============================================================ */
function rrOutline(hw, hd, r, seg){
  r = Math.min(r, hw, hd);
  const pts=[], kind=[], nrm=[];
  const cs=[[hw-r,hd-r,0],[-(hw-r),hd-r,Math.PI/2],[-(hw-r),-(hd-r),Math.PI],[hw-r,-(hd-r),Math.PI*1.5]];
  for(let c=0;c<4;c++){
    const [cx,cz,a0]=cs[c];
    for(let i=0;i<=seg;i++){
      const a=a0+i/seg*Math.PI/2;
      pts.push([cx+r*Math.cos(a), cz+r*Math.sin(a)]);
      kind.push(i<seg?1:0);
      const am = (i<seg) ? a0+(i+0.5)/seg*Math.PI/2 : a0+Math.PI/2;   // segment mid normal
      nrm.push([Math.cos(am), Math.sin(am)]);
    }
  }
  return {pts,kind,nrm};
}
function edgeWeight(n, cfg){
  const d = (n[0]+n[1])*0.7071;                 // +1 toward camera, -1 away
  const t = Math.min(1, Math.max(0, (d+0.7071)/1.4142));
  const back = cfg.backBase + cfg.backSkew*(n[0]-n[1]);
  return back + (cfg.front-back)*t;
}
function prismGeom(outline, y0, y1, curveShade, noBottom){
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  const cap=[], flat=[], curve=[], ccol=[];
  let cx=0, cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    cap.push(cx,y1,cz, b[0],y1,b[1], a[0],y1,a[1]);
    if(!noBottom) cap.push(cx,y0,cz, a[0],y0,a[1], b[0],y0,b[1]);
  }
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    const t = kind[i]? curve : flat;
    t.push(a[0],y0,a[1], b[0],y1,b[1], b[0],y0,b[1]);
    t.push(a[0],y0,a[1], a[0],y1,a[1], b[0],y1,b[1]);
    if(kind[i] && curveShade){
      const c = curveShade(nrm[i][0], nrm[i][1]);
      for(let q=0;q<6;q++) ccol.push(c.r,c.g,c.b);
    }
  }
  const all = cap.concat(flat, curve);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(all,3));
  if(curveShade){
    const col=new Float32Array(all.length);
    for(let i=0;i<col.length;i++) col[i]=1;
    const off=cap.length+flat.length;
    for(let i=0;i<ccol.length;i++) col[off+i]=ccol[i];
    g.setAttribute('color', new THREE.BufferAttribute(col,3));
  }
  g.addGroup(0, cap.length/3, 0);
  g.addGroup(cap.length/3, flat.length/3, 1);
  g.addGroup((cap.length+flat.length)/3, curve.length/3, 2);
  return g;
}
// outline segments + matching per-segment weights
// e nudges the outline toward the camera along (1,1,1): screen position is
// unchanged, but the line wins the depth test against the slanted wall it sits on
function prismLines(outline, y0, y1, cfg, cfgBot, nudge){
  cfgBot = cfgBot || cfg;
  const [ex,ey,ez] = nudge || [3,3,3];
  const segs=[], w=[];
  const pts=outline.pts, kind=outline.kind, nrm=outline.nrm, n=pts.length;
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    if(Math.abs(a[0]-b[0])<1e-9 && Math.abs(a[1]-b[1])<1e-9) continue;
    segs.push(a[0]+ex,y1+ey,a[1]+ez, b[0]+ex,y1+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfg));
    segs.push(a[0]+ex,y0+ey,a[1]+ez, b[0]+ex,y0+ey,b[1]+ez); w.push(edgeWeight(nrm[i], cfgBot));
  }
  const len=(i)=>{const a=pts[i],b=pts[(i+1)%n];return Math.hypot(a[0]-b[0],a[1]-b[1]);};
  for(let i=0;i<n;i++){
    const j=(i-1+n)%n;
    if(kind[j]!==kind[i] && len(j)>0.5 && len(i)>0.5){
      const p=pts[i];
      segs.push(p[0]+ex,y0+ey,p[1]+ez, p[0]+ex,y1+ey,p[1]+ez);
      w.push(edgeWeight(nrm[i], cfg));
    }
  }
  return {segs, w};
}
function loopSegs(pts, y, out){
  out = out||[];
  for(let i=0;i<pts.length;i++){
    const a=pts[i], b=pts[(i+1)%pts.length];
    out.push(a[0],y,a[1], b[0],y,b[1]);
  }
  return out;
}
function fanGeom(pts, y){
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  const a=[];
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    a.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}
function fanTris(pts, y, out){
  out = out||[];
  const n=pts.length; let cx=0,cz=0; for(const p of pts){cx+=p[0];cz+=p[1];} cx/=n; cz/=n;
  for(let i=0;i<n;i++){
    const p=pts[i], q=pts[(i+1)%n];
    out.push(cx,y,cz, q[0],y,q[1], p[0],y,p[1]);
  }
  return out;
}
// concave-safe planar polygon (ear clipping via three's ShapeUtils)
function polyTris(poly, y, out){
  out = out||[];
  const c = poly.map(p=>new THREE.Vector2(p[0],p[1]));
  const f = THREE.ShapeUtils.triangulateShape(c, []);
  for(const t of f){
    for(const idx of t){ out.push(poly[idx][0], y, poly[idx][1]); }
  }
  return out;
}
function triMesh(arr, mat){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(arr,3));
  return new THREE.Mesh(g, mat);
}
/* a rounded-rect plate laid flat: filled face + its own hairline, as one group */
function plate(hw, hd, r, seg, colour, weight, mat){
  const o = rrOutline(hw, hd, r, seg||10);
  const g = new THREE.Group();
  const fill = new THREE.Mesh(fanGeom(o.pts, 0), mat || new THREE.MeshBasicMaterial({color:colour, side:THREE.DoubleSide}));
  g.add(fill);
  if(weight){
    const ln = new THREE.Group(); ln.position.set(0.7,0.7,0.7); g.add(ln);
    ln.add(makeLines(loopSegs(o.pts,0,[]), weight, inkThin));
  }
  g.userData.fill = fill; g.userData.outline = o;
  return g;
}
function annulusGeom(rin, rout, y, seg){
  const a=[];
  for(let i=0;i<seg;i++){
    const t0=i/seg*Math.PI*2, t1=(i+1)/seg*Math.PI*2;
    const p=(r,t)=>[r*Math.cos(t), y, r*Math.sin(t)];
    const A=p(rin,t0),B=p(rout,t0),C=p(rout,t1),D=p(rin,t1);
    a.push(...A,...B,...C, ...A,...C,...D);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a,3));
  return g;
}

/* ============================================================
   textures
   ============================================================ */
function discAlphaTexture(size, inner){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  const c=(size-1)/2;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++){
    const r=Math.hypot(x-c,y-c)/c;
    let a=1-(r-inner)/(1-inner); a=Math.max(0,Math.min(1,a));
    a=a*a*(3-2*a);
    const i=(y*size+x)*4;
    img.data[i]=img.data[i+1]=img.data[i+2]=255;   // white, so the material colour drives the tone
    img.data[i+3]=Math.round(a*255);
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
function grainTexture(size, base, amp){
  const cv=document.createElement('canvas'); cv.width=cv.height=size;
  const ctx=cv.getContext('2d'); const img=ctx.createImageData(size,size);
  let s=12345;
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  for(let i=0;i<size*size;i++){
    const r=(rnd()+rnd()+rnd()+rnd()-2)/2;
    let v = base + amp*r - amp*1.65*Math.pow(rnd(),3);
    v = tone(v);          // inverts the dust specks along with the paper
    img.data[i*4]=img.data[i*4+1]=img.data[i*4+2]=v; img.data[i*4+3]=255;
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(cv);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter;
  return t;
}
const grainTex = grainTexture(512, 239, 11);
const GRAIN_SCALE = 700;

/* ============================================================
   materials
   ============================================================ */
const matTop   = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:grainTex, side:THREE.DoubleSide});  // tone lives in the texture
const matFlat  = new THREE.MeshBasicMaterial({color:COL.flat,  side:THREE.DoubleSide});
const matCurve = new THREE.MeshBasicMaterial({color:COL.curve, side:THREE.DoubleSide});
const matCurveVC= new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide, vertexColors:true});
const CGRAY = new THREE.Color(grey(233));  // curved walls of the light bodies
const CBLK  = new THREE.Color(grey(0));
const CWHT  = new THREE.Color(grey(253));
function angDeg(nx,nz){ let a=Math.atan2(nz,nx)*180/Math.PI; if(a>180)a-=360; if(a<-180)a+=360; return a; }
const shadeLid   = (nx,nz)=>{ const a=angDeg(nx,nz); return (a>-30 && a<2)? CBLK : CGRAY; };
const shadeBadge = (nx,nz)=>{ const a=angDeg(nx,nz);
  if(a>-50 && a<-8) return CBLK;
  if(a>=-8 && a<82) return CWHT;
  return CGRAY; };
const shadeCap   = ()=>CGRAY;
const matBlack = new THREE.MeshBasicMaterial({color:COL.black, side:THREE.DoubleSide});
const matWhite = new THREE.MeshBasicMaterial({color:COL.white, side:THREE.DoubleSide});
const matMid   = new THREE.MeshBasicMaterial({color:COL.mid,   side:THREE.DoubleSide});
const inkMat   = lineMaterial(COL.ink, 0.00020);
const inkThin  = lineMaterial(COL.ink, 0.00012);
const laneMat  = lineMaterial(COL.lane, 0.00025);
const shadowMat= new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:SHADOW_A, depthWrite:false});

/* ============================================================
   the pad every piece in this family stands on
   ============================================================ */
const slabOut = rrOutline(SLAB.X/2, SLAB.Z/2, SLAB.R, 16);
const SLAB_POS = new THREE.Vector3(SLAB.X/2, 0, SLAB.Z/2);
const PAD_Y = SLAB.H;
function buildPad(){
  const g = prismGeom(slabOut, 0, SLAB.H);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+SLAB.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+SLAB.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  const m = new THREE.Mesh(g,[matTop,matFlat,matCurve]);
  m.position.copy(SLAB_POS); scene.add(m);
  const L = prismLines(slabOut, 0, SLAB.H, W_SLAB);
  const ln = makeLines(L.segs, L.w, inkMat); ln.position.copy(SLAB_POS); scene.add(ln);
  // drop shadow: silhouette translated (52, 0, 20.8) on the floor
  const sh = new THREE.Mesh(fanGeom(slabOut.pts, 0), shadowMat);
  sh.position.set(SLAB.X/2+52, -0.6, SLAB.Z/2+20.8);
  sh.renderOrder = -1; scene.add(sh);
}

/* ============================================================
   decorative squares (screen-space, multiply-like)
   ============================================================ */
const squares = new THREE.Group(); scene.add(squares);
{
  const defs=[[370,520,41,0.0245],[327,558,41,0.0612],[1119,512,41,0.0612],[1226,621,41,0.0612]];
  for(const [sx,sy,s,al] of defs){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),
      new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:al, depthTest:false, depthWrite:false}));
    m.renderOrder = 100;
    m.userData.screen=[sx+s/2, sy+s/2];
    squares.add(m);
  }
}
function placeSquares(){
  for(const m of squares.children){
    const [sx,sy]=m.userData.screen;
    const z=-400;
    const x=(sx-OX)/C30 + z;
    const y=0.5*(x+z)-(sy-OY);
    m.position.set(x,y,z);
    m.quaternion.copy(camera.quaternion);
  }
}

/* ============================================================
   the family's checkmark badge — a coin standing in the XY plane
   ============================================================ */
const BADGE = { R:43.28, T:16.0 };
function buildBadge(sx, sy, z){
  const badgeGroup = new THREE.Group(); scene.add(badgeGroup);
  const o = rrOutline(BADGE.R, BADGE.R, BADGE.R, 48);
  const inner = new THREE.Group(); inner.rotation.x = -Math.PI/2; badgeGroup.add(inner);
  const bg = prismGeom(o, 0, BADGE.T, shadeBadge);
  // measured face gradient:  226 - 0.126*u + 0.588*v   (u = plane x, v = plane y)
  {
    const pos=bg.getAttribute('position'), col=bg.getAttribute('color');
    for(let i=0;i<pos.count;i++){
      if(col.getX(i)===1 && col.getY(i)===1 && col.getZ(i)===1){
        const v=tone(229.5 - 0.126*pos.getX(i) + 0.588*pos.getZ(i))/255;
        col.setXYZ(i,v,v,v);
      }
    }
  }
  inner.add(new THREE.Mesh(bg,[matCurveVC, matCurveVC, matCurveVC]));
  // rim seams at the shading-zone boundaries
  {
    const sm=[];
    for(const deg of [-8, 82]){
      const a=deg*Math.PI/180, cx=BADGE.R*Math.cos(a), cz=BADGE.R*Math.sin(a);
      sm.push(cx,0,cz, cx,BADGE.T,cz);
    }
    inner.add(makeLines(sm, 2.2, inkThin));
  }
  const L = prismLines(o, 0, BADGE.T, W_BADGE, null, [3,-3,3]);
  inner.add(makeLines(L.segs, L.w, inkMat));
  const CK = [[17.29,21.82],[13.24,17.75],[-1.65,-6.62],[-4.60,-5.96],
              [-12.89,3.14],[-21.07,-5.06],[-3.91,-22.01],[23.21,19.74]];
  const ckg = new THREE.Group(); ckg.position.set(0.9,-0.9,0.9); inner.add(ckg);
  ckg.add(triMesh(polyTris(CK, 0, []), matBlack));
  badgeGroup.position.copy(fromScreen(sx, sy, z));
  badgeGroup.userData.baseY = badgeGroup.position.y;
  return badgeGroup;
}

/* ============================================================
   animation helpers
   ============================================================ */
function tbl(a, t){
  const n=a.length; let i=Math.floor(t), f=t-i;
  i=((i%n)+n)%n; const j=(i+1)%n;
  return a[i]*(1-f)+a[j]*f;
}
const clamp01 = (v)=>v<0?0:v>1?1:v;
const smooth  = (v)=>{ v=clamp01(v); return v*v*(3-2*v); };
/* eased 0..1..0 pulse: rises over \`up\` frames from \`at\`, holds \`hold\`, falls over \`down\` */
function pulse(t, at, up, hold, down){
  const d = t-at;
  if(d<=0 || d>=up+hold+down) return 0;
  if(d<up) return smooth(d/up);
  if(d<up+hold) return 1;
  return smooth(1-(d-up-hold)/down);
}
/* eased 0..1 ramp */
function ramp(t, at, len){ return smooth((t-at)/len); }

/* ============================================================
   the wallet
   ============================================================ */
const NF = 240;
const CX = SLAB.X/2, CZ = SLAB.Z/2;
const WA = { X:220, Z:320, H:36, R:18 };
const TOP = PAD_Y + WA.H;
const CARD = { hw:52, hd:82, r:8, h:6.5 };
/* every card is a lit face, so its own detail is dark ink on light — the same
   inversion the dock runs on its capsule */
const darkLine = lineMaterial(COL.white, 0.00012);
const stitchMat = lineMaterial(grey(150), 0.00016);

buildPad();

/* ---- lane marks ---- */
{
  const segs=[];
  for(const lx of [CX-196, CX+196]){
    const o = rrOutline(30, 156, 30, 12);
    loopSegs(o.pts.map(p=>[p[0]+lx, p[1]+CZ]), PAD_Y, segs);
  }
  scene.add(makeLines(segs, W_LANE, laneMat));
}

/* ---- an evenly distributed dashed loop, for the saddle stitching ---- */
function dashLoop(pts, y, dash, gap, out){
  out = out||[];
  const n = pts.length, acc=[0];
  for(let i=0;i<n;i++){
    const a=pts[i], b=pts[(i+1)%n];
    acc.push(acc[i] + Math.hypot(b[0]-a[0], b[1]-a[1]));
  }
  const total = acc[n];
  const at = (s)=>{
    s = ((s%total)+total)%total;
    let i=0; while(i<n-1 && acc[i+1] < s) i++;
    const a=pts[i], b=pts[(i+1)%n];
    const f = (s-acc[i])/Math.max(1e-6, acc[i+1]-acc[i]);
    return [a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f];
  };
  const step = dash+gap, k = Math.max(1, Math.round(total/step)), d = total/k;
  for(let i=0;i<k;i++){
    const P=at(i*d), Q=at(i*d + d*dash/step);
    out.push(P[0],y,P[1], Q[0],y,Q[1]);
  }
  return out;
}

/* ---- the leather body ---- */
const leatherGrain = grainTexture(512, 197, 13);
const walletOut = rrOutline(WA.X/2, WA.Z/2, WA.R, 14);
{
  const g = prismGeom(walletOut, PAD_Y, TOP, null, true);
  const pos=g.getAttribute('position'); const uv=new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){ uv[i*2]=(pos.getX(i)+WA.X/2)/GRAIN_SCALE; uv[i*2+1]=(pos.getZ(i)+WA.Z/2)/GRAIN_SCALE; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  const matLeather = new THREE.MeshBasicMaterial({color:0xFFFFFF, map:leatherGrain, side:THREE.DoubleSide});
  const m = new THREE.Mesh(g,[matLeather,matFlat,matCurve]); m.position.set(CX,0,CZ); scene.add(m);
  const L = prismLines(walletOut, PAD_Y, TOP, W_CAP, W_CAPB);
  const ln = makeLines(L.segs, L.w, inkMat); ln.position.set(CX,0,CZ); scene.add(ln);
  // the spine crease, and the saddle stitching just inside the edge
  const det = new THREE.Group(); det.position.set(CX+2.5, 2.5, CZ+2.5); scene.add(det);
  det.add(makeLines([-WA.X/2+26, TOP, -WA.Z/2+18, -WA.X/2+26, TOP, WA.Z/2-18], 2.0, inkThin));
  det.add(makeLines(dashLoop(rrOutline(WA.X/2-14, WA.Z/2-14, WA.R-6, 10).pts, TOP, 9, 7, []), 2.0, stitchMat));
  const sh = new THREE.Mesh(fanGeom(walletOut.pts, 0), shadowMat);
  sh.position.set(CX+28, PAD_Y+0.4, CZ+11); sh.renderOrder=-1; scene.add(sh);
}

/* ---- the pocket wall the cards ride out of ---- */
const POCKET = { hw:88, hd:64, r:15, y0:TOP, y1:TOP+9, cz:86 };
{
  const o = rrOutline(POCKET.hw, POCKET.hd, POCKET.r, 12);
  const grp = new THREE.Group(); grp.position.set(CX, 0, CZ+POCKET.cz); scene.add(grp);
  grp.add(new THREE.Mesh(prismGeom(o, POCKET.y0, POCKET.y1, null, true),
    [new THREE.MeshBasicMaterial({color:grey(178), side:THREE.DoubleSide}), matFlat, matCurve]));
  const L = prismLines(o, POCKET.y0, POCKET.y1, W_PLAIN);
  grp.add(makeLines(L.segs, L.w, inkMat));
  const det = new THREE.Group(); det.position.set(2.5,2.5,2.5); grp.add(det);
  det.add(makeLines(dashLoop(rrOutline(POCKET.hw-11, POCKET.hd-11, POCKET.r-5, 10).pts, POCKET.y1, 9, 7, []), 2.0, stitchMat));
}

/* ---- three cards, stacked flush and fanning out of the pocket ---- */
const cards = [];
{
  const o = rrOutline(CARD.hw, CARD.hd, CARD.r, 12);
  const L = prismLines(o, 0, CARD.h, W_PLAIN);
  const faceOf = (x, z, hw, hd, r, v, parent)=>{
    const s = rrOutline(hw, hd, r, Math.max(3, Math.round(r)));
    parent.add(new THREE.Mesh(fanGeom(s.pts.map(p=>[p[0]+x, p[1]+z]), CARD.h+0.25),
      new THREE.MeshBasicMaterial({color:grey(v), side:THREE.DoubleSide})));
  };
  for(let i=0;i<3;i++){
    const grp = new THREE.Group(); scene.add(grp);
    grp.add(new THREE.Mesh(prismGeom(o, 0, CARD.h, null, true),[matBlack,matFlat,matCurve]));
    grp.add(makeLines(L.segs, L.w, inkMat));
    const rim = new THREE.Group(); rim.position.set(0.7,0.7,0.7); grp.add(rim);
    rim.add(makeLines(loopSegs(o.pts, CARD.h, []), 1.5, darkLine));
    const det = new THREE.Group(); det.position.set(1.4,1.4,1.4); grp.add(det);
    faceOf(-25, -43, 10,  7,   2.3, 200, det);              // the chip
    faceOf(-18,  29, 28,  3.2, 3.2, 240, det);              // the number
    faceOf(-30,  41, 17,  3.2, 3.2, 240, det);              // the name
    faceOf( 23,  54,  9,  9,   9,   212, det);              // the payment mark
    faceOf( 36,  54,  9,  9,   9,   172, det);
    const sh = new THREE.Mesh(fanGeom(o.pts, 0),
      new THREE.MeshBasicMaterial({color:COL.ink, transparent:true, opacity:0, depthWrite:false}));
    sh.renderOrder = -1; scene.add(sh);
    cards.push({ grp, sh, restY:TOP + 1.2 + i*(CARD.h+1.4), restZ:CZ - 44 - i*18 });
  }
}

/* ---- badge ---- */
const badgeGroup = buildBadge(672, 252, 60);

/* ============================================================
   animation — the stack lifts out of the pocket into a held column and
   settles back.  LIFT_STEP is set from the card's own silhouette: a flat card
   spans (CARD.hw + CARD.hd) on screen along the step direction, so this is the
   tightest the column can close before two cards' nearest corners touch.
   ============================================================ */
const OUT_AT = 12, OUT_LEN = 44, OUT_GAP = 14;
const IN_AT = 168, IN_LEN = 40, IN_GAP = 10;
const BASE_LIFT = 102, LIFT_STEP = 133, SLIDE_STEP = 12;
/* eased rise that settles just past the mark, so a card arrives rather than stops */
function back(v){ v = clamp01(v); const c = 1.9, q = v - 1; return 1 + (c+1)*q*q*q + c*q*q; }

function setFrame(t){
  for(let i=0;i<cards.length;i++){
    const c = cards[i];
    const up   = back((t - (OUT_AT + i*OUT_GAP)) / OUT_LEN);
    const down = smooth((t - (IN_AT + i*IN_GAP)) / IN_LEN);
    const p    = Math.max(0, up - down);
    const held = up * (1 - down);
    /* each card breathes on its own phase while the column is held */
    const bob  = 2.5 * Math.sin(t/NF*Math.PI*4 + i*1.15) * held;
    c.grp.position.set(CX, c.restY + (BASE_LIFT + i*LIFT_STEP)*p + bob, c.restZ - SLIDE_STEP*i*p);
    // the contact shadow spreads and softens as its card climbs
    const s = clamp01(p);
    c.sh.position.set(CX + 16 + 30*s, PAD_Y + 0.5 + i*0.12, c.grp.position.z + 8 + 14*s);
    c.sh.scale.setScalar(1 + 0.20*s);
    c.sh.material.opacity = SHADOW_A*(0.45 + 2.5*s);
  }
  badgeGroup.position.y = badgeGroup.userData.baseY - 11.5*(1-Math.cos(t/NF*Math.PI*6))*0.5;
}

/* ============================================================
   playback
   ============================================================ */
let t0=null, paused=false;
function frame(now){
  if(t0===null) t0=now;
  if(!paused){
    setFrame(((now-t0)/1000*FPS) % NF);
    renderer.render(scene,camera);
  }
  requestAnimationFrame(frame);
}
window.addEventListener('resize', resize);
resize();
setFrame(0);
renderer.render(scene,camera);
requestAnimationFrame(frame);

window.__setFrame = function(f){ paused=true; setFrame(f); renderer.render(scene,camera); };
window.__play = function(){ paused=false; t0=null; };
<\/script>
</body>
</html>
`,R=["keyboard","search","phone","browser","wallet"],h={keyboard:w,search:E,phone:y,browser:b,wallet:v},f={keyboard:"Animated isometric keyboard",search:"Animated isometric search bar",phone:"Animated isometric phone",browser:"Animated isometric browser",wallet:"Animated isometric wallet"};function k({className:o="",variant:e="keyboard"}){const i=n.useRef(null),r=n.useRef(!0),[t,m]=n.useState(!0),[c,a]=n.useState(!1),l=h[e]??h.keyboard;return n.useEffect(()=>{const d=i.current;if(!d)return;const s=()=>m(r.current&&document.visibilityState!=="hidden"),p=new IntersectionObserver(([g])=>{r.current=g.isIntersecting,s()},{rootMargin:"80px"});return p.observe(d),document.addEventListener("visibilitychange",s),()=>{p.disconnect(),document.removeEventListener("visibilitychange",s)}},[]),n.useEffect(()=>{t||a(!1)},[t]),n.useEffect(()=>{a(!1)},[l]),u.jsx("div",{ref:i,className:`isometric-illustration${o?` ${o}`:""}`,"data-variant":e,"data-state":t?c?"ready":"loading":"paused",children:t?u.jsx("iframe",{className:`isometric-illustration__frame${c?" is-ready":""}`,title:f[e]??f.keyboard,srcDoc:l,sandbox:"allow-scripts",loading:"eager",onLoad:()=>a(!0)},e):null})}export{R as ISOMETRIC_ILLUSTRATION_VARIANTS,k as IsometricIllustration};
