import{r as n,j as p}from"./index-fOQwe-l-.js";const f=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isometric Camera + Drone — Light Shafts</title>
<style>
  html,body{margin:0;height:100%;background:#140f0b;overflow:hidden}
  canvas{display:block;width:100vw;height:100vh;touch-action:none;cursor:crosshair}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
(() => {
'use strict';

/* =====================================================================
   Shared stage for the light-shaft variants.

   The camera basis, the vertical light slabs, the glow curtain and the
   hot rays are the mail document's, carried over line for line so every
   variant stands in the same room under the same light.  A scene file
   adds its own geometry and hands run() the world box it lives in; the
   stage fits that box into the footprint the mail composition occupies
   inside the 1500x750 design frame, so the zoom and the subject size
   stay consistent from one variant to the next.
   ===================================================================== */

const cv  = document.getElementById('c');
const ctx = cv.getContext('2d');

const Q       = new URLSearchParams(location.search);
const REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STILL   = Q.has('still') || REDUCED;  // t=0 is exactly the rest frame

const LOOP = 40;
const W0   = 2*Math.PI/LOOP;
const ZOOM = 0.86;

/* ---------- design frame (the source illustration is 1500x750) -------- */
const DW = 1500, DH = 750;
const PROJ_S = Math.sqrt(1.5);           // makes the rest pose read 0.866 / 0.5

/* the mail composition's own projected footprint, in design px: every
   variant is fitted into this box so they all read at the same size */
const FIT_W = 999, FIT_H = 619;

/* ---------- palette --------------------------------------------------- */
const LIT   = '#ff7a0f';
const DIM   = '#9c4709';
const DEEP  = '#562a08';
const INK   = '#17110c';
const WHITE = '#ffffff';
const PAPER = '#f4ece2';                 // the unlit side of white paper
const EDGE  = '#cbab8b';                 // paper and plastic edges
const BG    = '#140f0b';
const SLOT  = 'rgba(46,12,0,0.62)';
const CAST  = 'rgba(80,30,6,0.30)';

/* ---------- vec3 ------------------------------------------------------ */
const V   = (x,y,z)=>({x,y,z});
const dot = (a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const clamp = (v,a,b)=>v<a?a:(v>b?b:v);
const mix = (a,b,t)=>a+(b-a)*t;

/* ---------- camera ---------------------------------------------------- */
const cam = { R:V(1,0,0), U:V(0,1,0), C:V(0,0,1), S:1, ox:0, oy:0, sc:1 };

function setCamera(az, el, scale, ox, oy){
  const ce = Math.cos(el), se = Math.sin(el);
  const C  = V(ce*Math.sin(az), se, ce*Math.cos(az));
  const f  = V(-C.x, -C.y, -C.z);
  const R  = V(-f.z, 0, f.x);
  const rl = Math.hypot(R.x, R.z); R.x/=rl; R.z/=rl;
  const U  = V(-R.z*f.y, R.z*f.x - R.x*f.z, R.x*f.y);
  cam.R=R; cam.U=U; cam.C=C; cam.S=scale; cam.ox=ox; cam.oy=oy;
  cam.sc = scale/PROJ_S;                 // design px -> canvas px
}
const px = p => (p.x*cam.R.x + p.y*cam.R.y + p.z*cam.R.z)*cam.S + cam.ox;
const py = p => -(p.x*cam.U.x + p.y*cam.U.y + p.z*cam.U.z)*cam.S + cam.oy;
const depth = p => dot(p, cam.C);
const dY = y => canvasH*0.5 + (y - DH*0.5)*cam.sc;   // design Y -> canvas Y

/* screen point -> world XZ on the horizontal plane at height h */
function planeAt(sx, sy, h){
  const u = (sx-cam.ox)/cam.S;
  const w = -(sy-cam.oy)/cam.S - h*cam.U.y;
  const det = cam.R.x*cam.U.z - cam.R.z*cam.U.x;
  if(Math.abs(det) < 1e-6) return null;
  return { x:( cam.U.z*u - cam.R.z*w)/det,
           z:(-cam.U.x*u + cam.R.x*w)/det };
}

/* ---------- path helpers ---------------------------------------------- */
function tracePoly(pts){
  if(pts.length < 3) return false;
  ctx.beginPath();
  ctx.moveTo(px(pts[0]), py(pts[0]));
  for(let i=1;i<pts.length;i++) ctx.lineTo(px(pts[i]), py(pts[i]));
  ctx.closePath();
  return true;
}
function fillPoly(pts, color){ if(tracePoly(pts)){ ctx.fillStyle = color; ctx.fill(); } }
function strokeSeg(a,b,color,w){
  ctx.beginPath(); ctx.moveTo(px(a),py(a)); ctx.lineTo(px(b),py(b));
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
}
function strokeLoop(pts,color,w){
  if(!tracePoly(pts)) return;
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin='round'; ctx.stroke();
}
function normalOf(p){                     // Newell, for back-face culling
  let nx=0,ny=0,nz=0;
  for(let i=0;i<p.length;i++){
    const a=p[i], b=p[(i+1)%p.length];
    nx += (a.y-b.y)*(a.z+b.z);
    ny += (a.z-b.z)*(a.x+b.x);
    nz += (a.x-b.x)*(a.y+b.y);
  }
  return V(nx,ny,nz);
}
/* keep only the part of a polygon at or above a horizontal plane */
function clipAbove(poly, yMin){
  const out=[], n=poly.length;
  for(let i=0;i<n;i++){
    const A=poly[i], B=poly[(i+1)%n];
    const a=A.y-yMin, b=B.y-yMin;
    if(a>=0) out.push(A);
    if((a>=0)!==(b>=0)){
      const t=a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, yMin, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}

/* =====================================================================
   Light slabs — vertical prisms of light standing in the world.  A point
   is lit when n·p lands inside one of them.  Period 192: lit 32, gap 32,
   lit 64, gap 64 — read straight off the source illustration.
   ===================================================================== */
const SLAB_N = V(0.836, 0, -0.549);
const SLAB_P = 192;
let slabPhase = 0;
const slabT = p => dot(p, SLAB_N);
function slabsIn(tmin, tmax){
  const out = [];
  const k0 = Math.floor((tmin-slabPhase)/SLAB_P) - 1;
  const k1 = Math.ceil((tmax-slabPhase)/SLAB_P) + 1;
  for(let k=k0;k<=k1;k++){
    out.push([SLAB_P*k - 64 + slabPhase, SLAB_P*k - 32 + slabPhase]);
    out.push([SLAB_P*k      + slabPhase, SLAB_P*k + 64 + slabPhase]);
  }
  return out;
}
function clipHalf(poly, d, above){
  const out = [], n = poly.length;
  for(let i=0;i<n;i++){
    const A = poly[i], B = poly[(i+1)%n];
    let a = slabT(A)-d, b = slabT(B)-d;
    if(!above){ a=-a; b=-b; }
    if(a >= 0) out.push(A);
    if((a>=0) !== (b>=0)){
      const t = a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, A.y+(B.y-A.y)*t, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}
function fillBanded(poly, dimC, litC){
  fillPoly(poly, dimC);
  let lo=1e9, hi=-1e9;
  for(const p of poly){ const t=slabT(p); if(t<lo) lo=t; if(t>hi) hi=t; }
  for(const s of slabsIn(lo,hi)){
    let piece = clipHalf(poly, s[0], true);
    if(piece.length < 3) continue;
    piece = clipHalf(piece, s[1], false);
    if(piece.length >= 3) fillPoly(piece, litC);
  }
}

/* ---------------------------------------------------------------------
   Glow curtain + hot rays, anchored to vertical world lines so they stay
   exactly vertical on screen under any azimuth.
   --------------------------------------------------------------------- */
const GLOW_L = V(-421.6,0, 421.6); // left edge   (design x  100)
const GLOW_R = V( 421.3,0,-421.3); // right edge  (design x 1560)
const GLOW_BOTTOM = 560;           // design y where the curtain dies

/* Three pieces, all measured off the source: a soft bloom in the upper
   left that fades downward, a curtain with a hard left edge that swells
   toward the floor and stops at x=1238, and the bleed past that edge. */
const glowTex = (() => {
  const W=730, H=150, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  const smooth=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
  for(let j=0;j<H;j++){
    const v = j/(H-1), y = v*GLOW_BOTTOM;
    const tail = 1 - smooth(0.67, 0.95, v);
    const fall = Math.exp(-Math.pow(y/140, 3));
    for(let i=0;i<W;i++){
      const u = i/(W-1), x = 100 + u*1460;
      const bloom = 23*Math.exp(-Math.pow((x-412)/105, 2))*fall;
      const curtain = smooth(405,435,x) * (
                        Math.max(0, 0.026*(x-450)) +
                        (68 + 0.09*Math.max(0, x-820))*v ) * tail;
      const bleed   = 30*Math.exp(-Math.pow((x-1243)/85, 2))
                        *Math.exp(-Math.pow((y-350)/145, 2));
      const k = smooth(1234, 1244, x);          // the slab's own edge
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=190; d[o+2]=130;
      d[o+3]=Math.min(255, Math.round(1.22*(bloom + curtain*(1-k) + bleed*k)));
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

/* one shared halo field: triangular across, eased in from the top */
const haloTex = (() => {
  const W=48, H=192, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  for(let j=0;j<H;j++){
    const v=j/(H-1);
    const vp = v<0.3 ? 0.45+0.55*(v/0.3) : Math.max(0, 1-(v-0.3)/0.7);
    for(let i=0;i<W;i++){
      const u=i/(W-1), bell=1-Math.abs(2*u-1);
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=175; d[o+2]=95;
      d[o+3]=Math.round(255*bell*bell*vp);
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

const RAYS = [   /* design x, core width, peak alpha, design y where it dies */
  { X:-857, Z:-500, w:3.4, a:0.20, fade:300, hw:18, ha:0.035 }, // design x  520
  { X:  51, Z: 200, w:3.6, a:0.62, fade:470, hw:62, ha:0.20 },  // design x  701
  { X: -91, Z:-300, w:3.4, a:0.42, fade:560, hw:22, ha:0.05 },  // design x 1011
  { X:-131, Z:-600, w:3.4, a:0.34, fade:560, hw:22, ha:0.03 },  // design x 1236
];
let drift = 0;

function drawCurtain(t){
  const xL = px(V(GLOW_L.x+drift,0,GLOW_L.z));
  const xR = px(V(GLOW_R.x+drift,0,GLOW_R.z));
  const yB = dY(GLOW_BOTTOM), y0 = dY(0);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if(xR > xL){
    ctx.drawImage(glowTex, xL, y0, xR-xL, yB-y0);
    /* the shafts fall from off-screen: repeat the top row above the frame */
    if(y0 > 0) ctx.drawImage(glowTex, 0,0, glowTex.width,1, xL, 0, xR-xL, y0);
  }
  for(let i=0;i<RAYS.length;i++){
    const r  = RAYS[i];
    const x  = px(V(r.X+drift,0,r.Z));
    const hw = r.w*0.5*cam.sc, HW = r.hw*cam.sc;
    const yF = dY(r.fade);
    const flick = 1 + 0.09*Math.sin((11+i)*W0*t) + 0.05*Math.sin((23+2*i)*W0*t);
    ctx.globalAlpha = r.ha*flick;
    ctx.drawImage(haloTex, x-HW, y0, HW*2, yF-y0);
    if(y0 > 0) ctx.drawImage(haloTex, 0,0, haloTex.width,1, x-HW, 0, HW*2, y0);
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, y0, 0, yF);
    g.addColorStop(0,    \`rgba(255,206,150,\${r.a*flick})\`);
    g.addColorStop(0.35, \`rgba(255,196,132,\${r.a*0.62*flick})\`);
    g.addColorStop(1,    'rgba(255,190,125,0)');
    ctx.fillStyle = g; ctx.fillRect(x-hw, 0, hw*2, yF);
  }
  ctx.restore();
}

/* the curtain bleeding faintly over the solids */
function drawBleed(){
  const xL=px(V(GLOW_L.x+drift,0,GLOW_L.z)), xR=px(V(GLOW_R.x+drift,0,GLOW_R.z));
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=0.09;
  if(xR>xL) ctx.drawImage(glowTex, xL, dY(0), xR-xL, dY(GLOW_BOTTOM)-dY(0));
  ctx.restore();
}

/* ---------------------------------------------------------------------
   Ground shadows (hard-edged, illustration style)
   --------------------------------------------------------------------- */
const LIGHT  = V(-0.17, 1, 0.17);
const shadowOf = p => V(p.x - LIGHT.x*p.y/LIGHT.y, 0.6, p.z - LIGHT.z*p.y/LIGHT.y);
function hullFill(pts, color){
  if(pts.length<3) return;
  const P = pts.map(p=>[px(p),py(p)]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[],up=[];
  for(const p of P){ while(lo.length>=2 && cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); }
  for(let i=P.length-1;i>=0;i--){ const p=P[i]; while(up.length>=2 && cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); }
  lo.pop(); up.pop();
  const Hl=lo.concat(up); if(Hl.length<3) return;
  ctx.beginPath(); ctx.moveTo(Hl[0][0],Hl[0][1]);
  for(let i=1;i<Hl.length;i++) ctx.lineTo(Hl[i][0],Hl[i][1]);
  ctx.closePath(); ctx.fillStyle=color; ctx.fill();
}
/* the convex ground shadow of a set of world points */
function castHull(pts){ hullFill(pts.map(shadowOf), CAST); }
/* the ground shadow of an upright box */
function boxShadow(cx, cz, hx, hz, y0, y1, rot){
  const p=[];
  for(const y of [y0,y1]) for(const q of roundedRing(cx,cz,hx,hz,Math.min(hx,hz)*0.25,y,rot,3)) p.push(q);
  castHull(p);
}
/* the ground shadow of an upright cylinder */
function columnShadow(cx, cz, r, y0, y1){
  const p=[];
  for(const y of [y0,y1]) for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;
    p.push(V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r));
  }
  castHull(p);
}

/* ---------------------------------------------------------------------
   Extruded rounded plates and upright cylinders
   --------------------------------------------------------------------- */
function localPoint(cx,cz,rot,x,y,z){
  const co=Math.cos(rot), si=Math.sin(rot);
  return V(cx+x*co+z*si, y, cz-x*si+z*co);
}
function roundedRing(cx,cz,hx,hz,r,y,rot,segments=6){
  const pts=[];
  for(const [sx,sz,a0] of [[1,1,0],[-1,1,Math.PI/2],[-1,-1,Math.PI],[1,-1,Math.PI*1.5]]){
    const ox=sx*(hx-r), oz=sz*(hz-r);
    for(let i=0;i<=segments;i++){
      const a=a0+i/segments*Math.PI/2;
      pts.push(localPoint(cx,cz,rot,ox+Math.cos(a)*r,y,oz+Math.sin(a)*r));
    }
  }
  return pts;
}
function drawRoundedSlab(cx,cz,hx,hz,r,y0,y1,rot,topDim,topLit,side=DEEP,outline=LIT){
  const top=roundedRing(cx,cz,hx,hz,r,y1,rot), bot=roundedRing(cx,cz,hx,hz,r,y0,rot);
  for(let i=0;i<top.length;i++){
    const j=(i+1)%top.length, q=[top[i],top[j],bot[j],bot[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(top, topDim, topLit);
  if(outline) strokeLoop(top, outline, Math.max(1,1.35*cam.sc));
}
/* an upright cylinder: the rounded plate with both half-widths equal */
function drawColumn(cx,cz,r,y0,y1,topDim,topLit,side=DEEP,outline=LIT){
  drawRoundedSlab(cx,cz,r,r,r,y0,y1,0,topDim,topLit,side,outline);
}
/* milled slots over the camera-facing arc of an upright cylinder */
function drawSlots(cx,cz,r,y0,y1,spin,count,color=SLOT){
  const psi=Math.atan2(cam.C.z, cam.C.x);
  const pitch=Math.PI*2/count, hwA=pitch*0.24;
  const pt=(a,y)=>V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r);
  ctx.fillStyle=color; ctx.beginPath();
  for(let i=0;i<count;i++){
    const a=i*pitch + spin;
    const rel=((a-psi)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;
    if(Math.abs(rel)>Math.PI/2-hwA) continue;
    const q=[pt(a-hwA,y1),pt(a+hwA,y1),pt(a+hwA,y0),pt(a-hwA,y0)];
    ctx.moveTo(px(q[0]),py(q[0]));
    for(let k=1;k<4;k++) ctx.lineTo(px(q[k]),py(q[k]));
    ctx.closePath();
  }
  ctx.fill();
}
/* a circle standing in the plane that faces along the local z axis */
function verticalEllipse(cx,cz,rot,z,cy,rx,ry,segments=44){
  const pts=[];
  for(let i=0;i<segments;i++){
    const a=i/segments*Math.PI*2;
    pts.push(localPoint(cx,cz,rot,Math.cos(a)*rx,cy+Math.sin(a)*ry,z));
  }
  return pts;
}
function drawLensBand(cx,cz,rot,z0,z1,cy,rx,ry,frontDim,frontLit,side=DEEP,outline=LIT){
  const back=verticalEllipse(cx,cz,rot,z0,cy,rx,ry);
  const front=verticalEllipse(cx,cz,rot,z1,cy,rx,ry);
  for(let i=0;i<front.length;i++){
    const j=(i+1)%front.length, q=[front[i],front[j],back[j],back[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(front, frontDim, frontLit);
  if(outline) strokeLoop(front, outline, Math.max(1,1.35*cam.sc));
}

/* ---------------------------------------------------------------------
   Tubes — a frustum between any two points, silhouetted against the
   camera the way the mail scene's pen is
   --------------------------------------------------------------------- */
function tubeBasis(A,B){
  const d=V(B.x-A.x, B.y-A.y, B.z-A.z);
  const L=Math.hypot(d.x,d.y,d.z)||1e-6;
  const u=V(d.x/L, d.y/L, d.z/L);
  const ref=Math.abs(u.y)>0.9 ? V(1,0,0) : V(0,1,0);
  const c1=V(u.y*ref.z-u.z*ref.y, u.z*ref.x-u.x*ref.z, u.x*ref.y-u.y*ref.x);
  const l1=Math.hypot(c1.x,c1.y,c1.z)||1e-6;
  const e1=V(c1.x/l1, c1.y/l1, c1.z/l1);
  const e2=V(u.y*e1.z-u.z*e1.y, u.z*e1.x-u.x*e1.z, u.x*e1.y-u.y*e1.x);
  return { u, e1, e2 };
}
function ringAt(P,b,r,a){
  const c=Math.cos(a), s=Math.sin(a);
  return V(P.x+(c*b.e1.x+s*b.e2.x)*r, P.y+(c*b.e1.y+s*b.e2.y)*r, P.z+(c*b.e1.z+s*b.e2.z)*r);
}
function facingAngle(b){
  let best=0, bd=-2;
  for(let i=0;i<72;i++){
    const a=i/72*Math.PI*2, c=Math.cos(a), s=Math.sin(a);
    const d=dot(V(c*b.e1.x+s*b.e2.x, c*b.e1.y+s*b.e2.y, c*b.e1.z+s*b.e2.z), cam.C);
    if(d>bd){ bd=d; best=a; }
  }
  return best;
}
function drawTube(A,B,rA,rB,dimC,litC,outline){
  const b=tubeBasis(A,B), c=facingAngle(b), a0=c-Math.PI/2, a1=c+Math.PI/2, N=24;
  const poly=[];
  for(let i=0;i<=N;i++) poly.push(ringAt(A,b,rA,a0+(a1-a0)*i/N));
  for(let i=N;i>=0;i--) poly.push(ringAt(B,b,rB,a0+(a1-a0)*i/N));
  if(litC) fillBanded(poly, dimC, litC); else fillPoly(poly, dimC);
  if(outline) strokeLoop(poly, outline, Math.max(1,1.25*cam.sc));
  return b;
}
/* the flat end of a tube; sign is +1 at B and -1 at A */
function tubeCap(P,b,r,sign,color,outline){
  if(dot(V(b.u.x*sign, b.u.y*sign, b.u.z*sign), cam.C) <= 0) return;
  const disc=[];
  for(let i=0;i<32;i++) disc.push(ringAt(P,b,r,i/32*Math.PI*2));
  fillPoly(disc, color);
  if(outline) strokeLoop(disc, outline, Math.max(1,1.2*cam.sc));
}
/* a tube bent through a list of points */
function drawTubeChain(pts,r,dimC,litC,outline){
  for(let i=0;i<pts.length-1;i++) drawTube(pts[i], pts[i+1], r, r, dimC, litC, outline);
}

/* =====================================================================
   Pointer
   ===================================================================== */
const ptr = { on:false, sx:0, sy:0, nx:0, ny:0 };
function pointerAt(e){
  const r = cv.getBoundingClientRect();
  ptr.sx = e.clientX - r.left; ptr.sy = e.clientY - r.top;
  ptr.nx = clamp(ptr.sx/Math.max(1,r.width) *2-1, -1, 1);
  ptr.ny = clamp(ptr.sy/Math.max(1,r.height)*2-1, -1, 1);
  ptr.on = true;
}
cv.addEventListener('pointermove', pointerAt, {passive:true});
cv.addEventListener('pointerdown', pointerAt, {passive:true});
cv.addEventListener('pointerleave', ()=>{ ptr.on=false; });
cv.addEventListener('pointercancel', ()=>{ ptr.on=false; });
cv.addEventListener('pointerup', e=>{ if(e.pointerType!=='mouse') ptr.on=false; });

/* =====================================================================
   Frame loop
   ===================================================================== */
let canvasW=0, canvasH=0, DPR=1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  canvasW = cv.clientWidth; canvasH = cv.clientHeight;
  cv.width = Math.round(canvasW*DPR); cv.height = Math.round(canvasH*DPR);
}
window.addEventListener('resize', resize);
resize();

const lin  = (t,a,b)=>clamp((t-a)/(b-a), 0, 1);
const ease = t=>t*t*(3-2*t);
const back = t=>{ const c=2.2, u=t-1; return 1 + (c+1)*u*u*u + c*u*u; };

/* A scene declares the world boxes it lives in, then draws into the stage:
   { bounds, curY, step(dt,t,cur), shadows(t,cur), items(t,cur), over(t,cur) }
   One box per object keeps the projected footprint tight; a single box
   around a spread-out composition would measure mostly empty floor. */
function run(scene){
  let bx0=1e9, bx1=-1e9, by0=1e9, by1=-1e9;
  for(const box of scene.bounds)
    for(const x of box.x) for(const y of box.y) for(const z of box.z){
      const dx = 0.8660254*(x - z), dy = 0.5*(x + z) - y;   // the rest pose
      if(dx<bx0) bx0=dx; if(dx>bx1) bx1=dx;
      if(dy<by0) by0=dy; if(dy>by1) by1=dy;
    }
  const FIT = Math.min(FIT_W/(bx1-bx0), FIT_H/(by1-by0));
  const CX = (bx0+bx1)/2, CY = (by0+by1)/2;
  const curY = scene.curY === undefined ? 24 : scene.curY;

  const T0 = performance.now();
  let prev = T0, orbMix = 0, orbX = 0, orbY = 0;

  function frame(now){
    const dt = clamp((now-prev)/1000, 0, 1/30); prev = now;
    const t  = STILL ? 0 : ((now-T0)/1000) % LOOP;
    if(cv.clientWidth!==canvasW || cv.clientHeight!==canvasH) resize();
    ctx.setTransform(DPR,0,0,DPR,0,0);

    const A   = STILL ? 0 : 1;
    const osc = (k, amp) => A*amp*Math.sin(k*W0*t);

    /* --- camera: idle loop, handed over to the pointer while it hovers --- */
    const want = (ptr.on && !STILL) ? 1 : 0;
    orbMix += (want - orbMix)*Math.min(1, dt*2.6);
    orbX   += ((ptr.on&&!STILL ? ptr.nx : 0) - orbX)*Math.min(1, dt*4.5);
    orbY   += ((ptr.on&&!STILL ? ptr.ny : 0) - orbY)*Math.min(1, dt*4.5);
    const az = Math.PI/4 + (1-orbMix)*(osc(1,0.30) + osc(2,0.05)) + orbX*0.50;
    const el = clamp(0.61548 + (1-orbMix)*(osc(2,0.060) + osc(3,0.018)) - orbY*0.19,
                     0.40, 0.94);
    const scale = Math.min(canvasW/DW, canvasH/DH)*ZOOM*FIT*PROJ_S;
    setCamera(az, el, scale,
              canvasW*0.5 - CX*scale/PROJ_S,
              canvasH*0.5 - CY*scale/PROJ_S);

    slabPhase = osc(1, 40);
    drift     = osc(2, 46);

    const cur = (ptr.on && !STILL) ? planeAt(ptr.sx, ptr.sy, curY) : null;
    if(scene.step) scene.step(dt, t, cur, osc);

    ctx.fillStyle = BG; ctx.fillRect(0,0,canvasW,canvasH);
    drawCurtain(t);
    if(scene.shadows) scene.shadows(t, cur, osc);
    const items = scene.items(t, cur, osc);
    items.sort((a,b)=>a.d-b.d);
    for(const it of items) it.f();
    if(scene.over) scene.over(t, cur, osc);
    drawBleed();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Camera + Drone — a mirrorless body with a deep faceted lens that wakes
   when the pointer comes near, and a four-rotor drone holding station
   above and behind it.  The stage owns the camera, the light and the
   framing; this file only builds the two objects. */

const CAMERA = { x:-92, z:62, rot:0.045, hx:194, hz:102 };
const DRONE  = { x:210, z:-150, rot:-0.055, hx:80, hz:50, hover:250 };
const DRONE_ENDS = [[-100,-68],[100,-68],[-100,68],[100,68]];

function drawCamera(t, cur){
  const near=cur ? Math.max(0, 1-Math.hypot(CAMERA.x-cur.x, CAMERA.z-cur.z)/245) : 0;
  const awake=STILL ? 0 : 0.5+0.5*Math.sin(W0*t*4);
  const lift=near*(2+awake*2.2);

  drawRoundedSlab(CAMERA.x, CAMERA.z, CAMERA.hx, CAMERA.hz, 22, 0, 106+lift, CAMERA.rot, DIM, LIT, DEEP, LIT);
  drawRoundedSlab(CAMERA.x-145, CAMERA.z+2, 56, 88, 18, 12, 116+lift, CAMERA.rot, DEEP, DIM, INK, LIT);
  drawRoundedSlab(CAMERA.x-10, CAMERA.z-30, 84, 62, 15, 106+lift, 154+lift, CAMERA.rot, EDGE, WHITE, DIM, LIT);
  drawRoundedSlab(CAMERA.x+143, CAMERA.z-3, 52, 86, 18, 8, 114+lift, CAMERA.rot, DIM, LIT, DEEP, LIT);

  drawRoundedSlab(CAMERA.x-128, CAMERA.z-48, 31, 31, 30, 116+lift, 130+lift, CAMERA.rot, DEEP, DIM, INK, LIT);
  drawRoundedSlab(CAMERA.x-58, CAMERA.z-54, 27, 27, 26, 116+lift, 129+lift, CAMERA.rot, DIM, LIT, DEEP, LIT);
  const shutter=localPoint(CAMERA.x, CAMERA.z, CAMERA.rot, 139, 128+lift, -50);
  ctx.beginPath(); ctx.arc(px(shutter), py(shutter), Math.max(2,5.2*cam.sc), 0, Math.PI*2);
  ctx.fillStyle=WHITE; ctx.fill();
  ctx.strokeStyle=LIT; ctx.lineWidth=Math.max(1,1.2*cam.sc); ctx.stroke();

  const lensY=66+lift;
  drawLensBand(CAMERA.x, CAMERA.z, CAMERA.rot, CAMERA.hz-3,  CAMERA.hz+56, lensY, 92, 92, DIM, LIT, DEEP, LIT);
  drawLensBand(CAMERA.x, CAMERA.z, CAMERA.rot, CAMERA.hz+56, CAMERA.hz+83, lensY, 82, 82, DEEP, DIM, INK, LIT);
  drawLensBand(CAMERA.x, CAMERA.z, CAMERA.rot, CAMERA.hz+83, CAMERA.hz+87, lensY, 67, 67, INK, DEEP, INK, LIT);
  const glass=verticalEllipse(CAMERA.x, CAMERA.z, CAMERA.rot, CAMERA.hz+89, lensY, 56, 56);
  fillBanded(glass, DEEP, near>0.1 ? LIT : DIM);
  strokeLoop(glass, LIT, Math.max(1,1.4*cam.sc));
  const glint=[
    localPoint(CAMERA.x, CAMERA.z, CAMERA.rot, -18, lensY+30, CAMERA.hz+90),
    localPoint(CAMERA.x, CAMERA.z, CAMERA.rot,   0, lensY+40, CAMERA.hz+90),
    localPoint(CAMERA.x, CAMERA.z, CAMERA.rot,  32, lensY-18, CAMERA.hz+90),
    localPoint(CAMERA.x, CAMERA.z, CAMERA.rot,  16, lensY-28, CAMERA.hz+90),
  ];
  fillPoly(glint, WHITE);
}

function droneBase(t, cur){
  const near=cur ? Math.max(0, 1-Math.hypot(DRONE.x-cur.x, DRONE.z-cur.z)/250) : 0;
  return DRONE.hover + (STILL ? 0 : 7*Math.sin(W0*t*2.5) + near*12);
}

function drawDrone(t, cur){
  const base=droneBase(t, cur);
  const ends=[];

  for(let i=0;i<DRONE_ENDS.length;i++){
    const [dx,dz]=DRONE_ENDS[i];
    const mid=localPoint(DRONE.x, DRONE.z, DRONE.rot, dx*0.5, 0, dz*0.5);
    const armRot=DRONE.rot-Math.atan2(dz,dx);
    drawRoundedSlab(mid.x, mid.z, Math.hypot(dx,dz)*0.5, 9, 8, base+11, base+24, armRot, DEEP, DIM, INK, LIT);
    const end=localPoint(DRONE.x, DRONE.z, DRONE.rot, dx, 0, dz);
    ends.push({ x:end.x, z:end.z, rot:armRot });
    drawRoundedSlab(end.x, end.z, 21, 21, 20, base+7, base+31, DRONE.rot, DEEP, DIM, INK, LIT);
  }

  drawRoundedSlab(DRONE.x, DRONE.z, DRONE.hx, DRONE.hz, 21, base, base+42, DRONE.rot, DIM, LIT, DEEP, LIT);
  drawRoundedSlab(DRONE.x-7, DRONE.z-4, 58, 37, 17, base+42, base+59, DRONE.rot, EDGE, WHITE, DIM, LIT);
  drawRoundedSlab(DRONE.x+62, DRONE.z+22, 29, 20, 9, base+7, base+26, DRONE.rot, DEEP, DIM, INK, LIT);

  drawLensBand(DRONE.x, DRONE.z, DRONE.rot, DRONE.hz+20, DRONE.hz+27, base+17, 12, 12, INK, DIM, INK, LIT);
  const droneGlass=verticalEllipse(DRONE.x, DRONE.z, DRONE.rot, DRONE.hz+28, base+17, 7, 7, 20);
  fillPoly(droneGlass, INK);
  strokeLoop(droneGlass, LIT, Math.max(1, cam.sc));

  for(let i=0;i<ends.length;i++){
    const e=ends[i], spin=STILL ? i*0.8 : (i%2 ? -1 : 1)*W0*t*28 + i*0.8;
    drawRoundedSlab(e.x, e.z, 52, 6, 6, base+32, base+36, e.rot+spin, DEEP, LIT, INK, LIT);
    drawRoundedSlab(e.x, e.z, 7, 7, 7, base+35, base+41, DRONE.rot, EDGE, WHITE, DIM, LIT);
  }
}

run({
  bounds: [
    { x:[-293, 103], y:[0, 158],   z:[ -40, 253] },   // the camera
    { x:[  58, 362], y:[250, 320], z:[-270, -30] },   // the drone on station
  ],
  curY: 24,
  shadows(t, cur){
    boxShadow(CAMERA.x, CAMERA.z, CAMERA.hx+10, CAMERA.hz+40, 0, 120, CAMERA.rot);
    /* the drone is high up: only the fuselage keeps a readable pool */
    const base=droneBase(t, cur);
    boxShadow(DRONE.x, DRONE.z, DRONE.hx-6, DRONE.hz-4, base, base+20, DRONE.rot);
  },
  items(t, cur){
    return [
      { d: depth(V(CAMERA.x, 54, CAMERA.z)),           f: ()=>drawCamera(t, cur) },
      { d: depth(V(DRONE.x, DRONE.hover+20, DRONE.z)), f: ()=>drawDrone(t, cur) },
    ];
  },
});
})();
<\/script>
</body>
</html>
`,u=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isometric Keyboard — Light Shafts</title>
<style>
  html,body{margin:0;height:100%;background:#140f0b;overflow:hidden}
  canvas{display:block;width:100vw;height:100vh;touch-action:none;cursor:crosshair}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
(() => {
'use strict';

/* =====================================================================
   Shared stage for the light-shaft variants.

   The camera basis, the vertical light slabs, the glow curtain and the
   hot rays are the mail document's, carried over line for line so every
   variant stands in the same room under the same light.  A scene file
   adds its own geometry and hands run() the world box it lives in; the
   stage fits that box into the footprint the mail composition occupies
   inside the 1500x750 design frame, so the zoom and the subject size
   stay consistent from one variant to the next.
   ===================================================================== */

const cv  = document.getElementById('c');
const ctx = cv.getContext('2d');

const Q       = new URLSearchParams(location.search);
const REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STILL   = Q.has('still') || REDUCED;  // t=0 is exactly the rest frame

const LOOP = 40;
const W0   = 2*Math.PI/LOOP;
const ZOOM = 0.86;

/* ---------- design frame (the source illustration is 1500x750) -------- */
const DW = 1500, DH = 750;
const PROJ_S = Math.sqrt(1.5);           // makes the rest pose read 0.866 / 0.5

/* the mail composition's own projected footprint, in design px: every
   variant is fitted into this box so they all read at the same size */
const FIT_W = 999, FIT_H = 619;

/* ---------- palette --------------------------------------------------- */
const LIT   = '#ff7a0f';
const DIM   = '#9c4709';
const DEEP  = '#562a08';
const INK   = '#17110c';
const WHITE = '#ffffff';
const PAPER = '#f4ece2';                 // the unlit side of white paper
const EDGE  = '#cbab8b';                 // paper and plastic edges
const BG    = '#140f0b';
const SLOT  = 'rgba(46,12,0,0.62)';
const CAST  = 'rgba(80,30,6,0.30)';

/* ---------- vec3 ------------------------------------------------------ */
const V   = (x,y,z)=>({x,y,z});
const dot = (a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const clamp = (v,a,b)=>v<a?a:(v>b?b:v);
const mix = (a,b,t)=>a+(b-a)*t;

/* ---------- camera ---------------------------------------------------- */
const cam = { R:V(1,0,0), U:V(0,1,0), C:V(0,0,1), S:1, ox:0, oy:0, sc:1 };

function setCamera(az, el, scale, ox, oy){
  const ce = Math.cos(el), se = Math.sin(el);
  const C  = V(ce*Math.sin(az), se, ce*Math.cos(az));
  const f  = V(-C.x, -C.y, -C.z);
  const R  = V(-f.z, 0, f.x);
  const rl = Math.hypot(R.x, R.z); R.x/=rl; R.z/=rl;
  const U  = V(-R.z*f.y, R.z*f.x - R.x*f.z, R.x*f.y);
  cam.R=R; cam.U=U; cam.C=C; cam.S=scale; cam.ox=ox; cam.oy=oy;
  cam.sc = scale/PROJ_S;                 // design px -> canvas px
}
const px = p => (p.x*cam.R.x + p.y*cam.R.y + p.z*cam.R.z)*cam.S + cam.ox;
const py = p => -(p.x*cam.U.x + p.y*cam.U.y + p.z*cam.U.z)*cam.S + cam.oy;
const depth = p => dot(p, cam.C);
const dY = y => canvasH*0.5 + (y - DH*0.5)*cam.sc;   // design Y -> canvas Y

/* screen point -> world XZ on the horizontal plane at height h */
function planeAt(sx, sy, h){
  const u = (sx-cam.ox)/cam.S;
  const w = -(sy-cam.oy)/cam.S - h*cam.U.y;
  const det = cam.R.x*cam.U.z - cam.R.z*cam.U.x;
  if(Math.abs(det) < 1e-6) return null;
  return { x:( cam.U.z*u - cam.R.z*w)/det,
           z:(-cam.U.x*u + cam.R.x*w)/det };
}

/* ---------- path helpers ---------------------------------------------- */
function tracePoly(pts){
  if(pts.length < 3) return false;
  ctx.beginPath();
  ctx.moveTo(px(pts[0]), py(pts[0]));
  for(let i=1;i<pts.length;i++) ctx.lineTo(px(pts[i]), py(pts[i]));
  ctx.closePath();
  return true;
}
function fillPoly(pts, color){ if(tracePoly(pts)){ ctx.fillStyle = color; ctx.fill(); } }
function strokeSeg(a,b,color,w){
  ctx.beginPath(); ctx.moveTo(px(a),py(a)); ctx.lineTo(px(b),py(b));
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
}
function strokeLoop(pts,color,w){
  if(!tracePoly(pts)) return;
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin='round'; ctx.stroke();
}
function normalOf(p){                     // Newell, for back-face culling
  let nx=0,ny=0,nz=0;
  for(let i=0;i<p.length;i++){
    const a=p[i], b=p[(i+1)%p.length];
    nx += (a.y-b.y)*(a.z+b.z);
    ny += (a.z-b.z)*(a.x+b.x);
    nz += (a.x-b.x)*(a.y+b.y);
  }
  return V(nx,ny,nz);
}
/* keep only the part of a polygon at or above a horizontal plane */
function clipAbove(poly, yMin){
  const out=[], n=poly.length;
  for(let i=0;i<n;i++){
    const A=poly[i], B=poly[(i+1)%n];
    const a=A.y-yMin, b=B.y-yMin;
    if(a>=0) out.push(A);
    if((a>=0)!==(b>=0)){
      const t=a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, yMin, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}

/* =====================================================================
   Light slabs — vertical prisms of light standing in the world.  A point
   is lit when n·p lands inside one of them.  Period 192: lit 32, gap 32,
   lit 64, gap 64 — read straight off the source illustration.
   ===================================================================== */
const SLAB_N = V(0.836, 0, -0.549);
const SLAB_P = 192;
let slabPhase = 0;
const slabT = p => dot(p, SLAB_N);
function slabsIn(tmin, tmax){
  const out = [];
  const k0 = Math.floor((tmin-slabPhase)/SLAB_P) - 1;
  const k1 = Math.ceil((tmax-slabPhase)/SLAB_P) + 1;
  for(let k=k0;k<=k1;k++){
    out.push([SLAB_P*k - 64 + slabPhase, SLAB_P*k - 32 + slabPhase]);
    out.push([SLAB_P*k      + slabPhase, SLAB_P*k + 64 + slabPhase]);
  }
  return out;
}
function clipHalf(poly, d, above){
  const out = [], n = poly.length;
  for(let i=0;i<n;i++){
    const A = poly[i], B = poly[(i+1)%n];
    let a = slabT(A)-d, b = slabT(B)-d;
    if(!above){ a=-a; b=-b; }
    if(a >= 0) out.push(A);
    if((a>=0) !== (b>=0)){
      const t = a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, A.y+(B.y-A.y)*t, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}
function fillBanded(poly, dimC, litC){
  fillPoly(poly, dimC);
  let lo=1e9, hi=-1e9;
  for(const p of poly){ const t=slabT(p); if(t<lo) lo=t; if(t>hi) hi=t; }
  for(const s of slabsIn(lo,hi)){
    let piece = clipHalf(poly, s[0], true);
    if(piece.length < 3) continue;
    piece = clipHalf(piece, s[1], false);
    if(piece.length >= 3) fillPoly(piece, litC);
  }
}

/* ---------------------------------------------------------------------
   Glow curtain + hot rays, anchored to vertical world lines so they stay
   exactly vertical on screen under any azimuth.
   --------------------------------------------------------------------- */
const GLOW_L = V(-421.6,0, 421.6); // left edge   (design x  100)
const GLOW_R = V( 421.3,0,-421.3); // right edge  (design x 1560)
const GLOW_BOTTOM = 560;           // design y where the curtain dies

/* Three pieces, all measured off the source: a soft bloom in the upper
   left that fades downward, a curtain with a hard left edge that swells
   toward the floor and stops at x=1238, and the bleed past that edge. */
const glowTex = (() => {
  const W=730, H=150, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  const smooth=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
  for(let j=0;j<H;j++){
    const v = j/(H-1), y = v*GLOW_BOTTOM;
    const tail = 1 - smooth(0.67, 0.95, v);
    const fall = Math.exp(-Math.pow(y/140, 3));
    for(let i=0;i<W;i++){
      const u = i/(W-1), x = 100 + u*1460;
      const bloom = 23*Math.exp(-Math.pow((x-412)/105, 2))*fall;
      const curtain = smooth(405,435,x) * (
                        Math.max(0, 0.026*(x-450)) +
                        (68 + 0.09*Math.max(0, x-820))*v ) * tail;
      const bleed   = 30*Math.exp(-Math.pow((x-1243)/85, 2))
                        *Math.exp(-Math.pow((y-350)/145, 2));
      const k = smooth(1234, 1244, x);          // the slab's own edge
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=190; d[o+2]=130;
      d[o+3]=Math.min(255, Math.round(1.22*(bloom + curtain*(1-k) + bleed*k)));
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

/* one shared halo field: triangular across, eased in from the top */
const haloTex = (() => {
  const W=48, H=192, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  for(let j=0;j<H;j++){
    const v=j/(H-1);
    const vp = v<0.3 ? 0.45+0.55*(v/0.3) : Math.max(0, 1-(v-0.3)/0.7);
    for(let i=0;i<W;i++){
      const u=i/(W-1), bell=1-Math.abs(2*u-1);
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=175; d[o+2]=95;
      d[o+3]=Math.round(255*bell*bell*vp);
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

const RAYS = [   /* design x, core width, peak alpha, design y where it dies */
  { X:-857, Z:-500, w:3.4, a:0.20, fade:300, hw:18, ha:0.035 }, // design x  520
  { X:  51, Z: 200, w:3.6, a:0.62, fade:470, hw:62, ha:0.20 },  // design x  701
  { X: -91, Z:-300, w:3.4, a:0.42, fade:560, hw:22, ha:0.05 },  // design x 1011
  { X:-131, Z:-600, w:3.4, a:0.34, fade:560, hw:22, ha:0.03 },  // design x 1236
];
let drift = 0;

function drawCurtain(t){
  const xL = px(V(GLOW_L.x+drift,0,GLOW_L.z));
  const xR = px(V(GLOW_R.x+drift,0,GLOW_R.z));
  const yB = dY(GLOW_BOTTOM), y0 = dY(0);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if(xR > xL){
    ctx.drawImage(glowTex, xL, y0, xR-xL, yB-y0);
    /* the shafts fall from off-screen: repeat the top row above the frame */
    if(y0 > 0) ctx.drawImage(glowTex, 0,0, glowTex.width,1, xL, 0, xR-xL, y0);
  }
  for(let i=0;i<RAYS.length;i++){
    const r  = RAYS[i];
    const x  = px(V(r.X+drift,0,r.Z));
    const hw = r.w*0.5*cam.sc, HW = r.hw*cam.sc;
    const yF = dY(r.fade);
    const flick = 1 + 0.09*Math.sin((11+i)*W0*t) + 0.05*Math.sin((23+2*i)*W0*t);
    ctx.globalAlpha = r.ha*flick;
    ctx.drawImage(haloTex, x-HW, y0, HW*2, yF-y0);
    if(y0 > 0) ctx.drawImage(haloTex, 0,0, haloTex.width,1, x-HW, 0, HW*2, y0);
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, y0, 0, yF);
    g.addColorStop(0,    \`rgba(255,206,150,\${r.a*flick})\`);
    g.addColorStop(0.35, \`rgba(255,196,132,\${r.a*0.62*flick})\`);
    g.addColorStop(1,    'rgba(255,190,125,0)');
    ctx.fillStyle = g; ctx.fillRect(x-hw, 0, hw*2, yF);
  }
  ctx.restore();
}

/* the curtain bleeding faintly over the solids */
function drawBleed(){
  const xL=px(V(GLOW_L.x+drift,0,GLOW_L.z)), xR=px(V(GLOW_R.x+drift,0,GLOW_R.z));
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=0.09;
  if(xR>xL) ctx.drawImage(glowTex, xL, dY(0), xR-xL, dY(GLOW_BOTTOM)-dY(0));
  ctx.restore();
}

/* ---------------------------------------------------------------------
   Ground shadows (hard-edged, illustration style)
   --------------------------------------------------------------------- */
const LIGHT  = V(-0.17, 1, 0.17);
const shadowOf = p => V(p.x - LIGHT.x*p.y/LIGHT.y, 0.6, p.z - LIGHT.z*p.y/LIGHT.y);
function hullFill(pts, color){
  if(pts.length<3) return;
  const P = pts.map(p=>[px(p),py(p)]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[],up=[];
  for(const p of P){ while(lo.length>=2 && cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); }
  for(let i=P.length-1;i>=0;i--){ const p=P[i]; while(up.length>=2 && cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); }
  lo.pop(); up.pop();
  const Hl=lo.concat(up); if(Hl.length<3) return;
  ctx.beginPath(); ctx.moveTo(Hl[0][0],Hl[0][1]);
  for(let i=1;i<Hl.length;i++) ctx.lineTo(Hl[i][0],Hl[i][1]);
  ctx.closePath(); ctx.fillStyle=color; ctx.fill();
}
/* the convex ground shadow of a set of world points */
function castHull(pts){ hullFill(pts.map(shadowOf), CAST); }
/* the ground shadow of an upright box */
function boxShadow(cx, cz, hx, hz, y0, y1, rot){
  const p=[];
  for(const y of [y0,y1]) for(const q of roundedRing(cx,cz,hx,hz,Math.min(hx,hz)*0.25,y,rot,3)) p.push(q);
  castHull(p);
}
/* the ground shadow of an upright cylinder */
function columnShadow(cx, cz, r, y0, y1){
  const p=[];
  for(const y of [y0,y1]) for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;
    p.push(V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r));
  }
  castHull(p);
}

/* ---------------------------------------------------------------------
   Extruded rounded plates and upright cylinders
   --------------------------------------------------------------------- */
function localPoint(cx,cz,rot,x,y,z){
  const co=Math.cos(rot), si=Math.sin(rot);
  return V(cx+x*co+z*si, y, cz-x*si+z*co);
}
function roundedRing(cx,cz,hx,hz,r,y,rot,segments=6){
  const pts=[];
  for(const [sx,sz,a0] of [[1,1,0],[-1,1,Math.PI/2],[-1,-1,Math.PI],[1,-1,Math.PI*1.5]]){
    const ox=sx*(hx-r), oz=sz*(hz-r);
    for(let i=0;i<=segments;i++){
      const a=a0+i/segments*Math.PI/2;
      pts.push(localPoint(cx,cz,rot,ox+Math.cos(a)*r,y,oz+Math.sin(a)*r));
    }
  }
  return pts;
}
function drawRoundedSlab(cx,cz,hx,hz,r,y0,y1,rot,topDim,topLit,side=DEEP,outline=LIT){
  const top=roundedRing(cx,cz,hx,hz,r,y1,rot), bot=roundedRing(cx,cz,hx,hz,r,y0,rot);
  for(let i=0;i<top.length;i++){
    const j=(i+1)%top.length, q=[top[i],top[j],bot[j],bot[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(top, topDim, topLit);
  if(outline) strokeLoop(top, outline, Math.max(1,1.35*cam.sc));
}
/* an upright cylinder: the rounded plate with both half-widths equal */
function drawColumn(cx,cz,r,y0,y1,topDim,topLit,side=DEEP,outline=LIT){
  drawRoundedSlab(cx,cz,r,r,r,y0,y1,0,topDim,topLit,side,outline);
}
/* milled slots over the camera-facing arc of an upright cylinder */
function drawSlots(cx,cz,r,y0,y1,spin,count,color=SLOT){
  const psi=Math.atan2(cam.C.z, cam.C.x);
  const pitch=Math.PI*2/count, hwA=pitch*0.24;
  const pt=(a,y)=>V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r);
  ctx.fillStyle=color; ctx.beginPath();
  for(let i=0;i<count;i++){
    const a=i*pitch + spin;
    const rel=((a-psi)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;
    if(Math.abs(rel)>Math.PI/2-hwA) continue;
    const q=[pt(a-hwA,y1),pt(a+hwA,y1),pt(a+hwA,y0),pt(a-hwA,y0)];
    ctx.moveTo(px(q[0]),py(q[0]));
    for(let k=1;k<4;k++) ctx.lineTo(px(q[k]),py(q[k]));
    ctx.closePath();
  }
  ctx.fill();
}
/* a circle standing in the plane that faces along the local z axis */
function verticalEllipse(cx,cz,rot,z,cy,rx,ry,segments=44){
  const pts=[];
  for(let i=0;i<segments;i++){
    const a=i/segments*Math.PI*2;
    pts.push(localPoint(cx,cz,rot,Math.cos(a)*rx,cy+Math.sin(a)*ry,z));
  }
  return pts;
}
function drawLensBand(cx,cz,rot,z0,z1,cy,rx,ry,frontDim,frontLit,side=DEEP,outline=LIT){
  const back=verticalEllipse(cx,cz,rot,z0,cy,rx,ry);
  const front=verticalEllipse(cx,cz,rot,z1,cy,rx,ry);
  for(let i=0;i<front.length;i++){
    const j=(i+1)%front.length, q=[front[i],front[j],back[j],back[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(front, frontDim, frontLit);
  if(outline) strokeLoop(front, outline, Math.max(1,1.35*cam.sc));
}

/* ---------------------------------------------------------------------
   Tubes — a frustum between any two points, silhouetted against the
   camera the way the mail scene's pen is
   --------------------------------------------------------------------- */
function tubeBasis(A,B){
  const d=V(B.x-A.x, B.y-A.y, B.z-A.z);
  const L=Math.hypot(d.x,d.y,d.z)||1e-6;
  const u=V(d.x/L, d.y/L, d.z/L);
  const ref=Math.abs(u.y)>0.9 ? V(1,0,0) : V(0,1,0);
  const c1=V(u.y*ref.z-u.z*ref.y, u.z*ref.x-u.x*ref.z, u.x*ref.y-u.y*ref.x);
  const l1=Math.hypot(c1.x,c1.y,c1.z)||1e-6;
  const e1=V(c1.x/l1, c1.y/l1, c1.z/l1);
  const e2=V(u.y*e1.z-u.z*e1.y, u.z*e1.x-u.x*e1.z, u.x*e1.y-u.y*e1.x);
  return { u, e1, e2 };
}
function ringAt(P,b,r,a){
  const c=Math.cos(a), s=Math.sin(a);
  return V(P.x+(c*b.e1.x+s*b.e2.x)*r, P.y+(c*b.e1.y+s*b.e2.y)*r, P.z+(c*b.e1.z+s*b.e2.z)*r);
}
function facingAngle(b){
  let best=0, bd=-2;
  for(let i=0;i<72;i++){
    const a=i/72*Math.PI*2, c=Math.cos(a), s=Math.sin(a);
    const d=dot(V(c*b.e1.x+s*b.e2.x, c*b.e1.y+s*b.e2.y, c*b.e1.z+s*b.e2.z), cam.C);
    if(d>bd){ bd=d; best=a; }
  }
  return best;
}
function drawTube(A,B,rA,rB,dimC,litC,outline){
  const b=tubeBasis(A,B), c=facingAngle(b), a0=c-Math.PI/2, a1=c+Math.PI/2, N=24;
  const poly=[];
  for(let i=0;i<=N;i++) poly.push(ringAt(A,b,rA,a0+(a1-a0)*i/N));
  for(let i=N;i>=0;i--) poly.push(ringAt(B,b,rB,a0+(a1-a0)*i/N));
  if(litC) fillBanded(poly, dimC, litC); else fillPoly(poly, dimC);
  if(outline) strokeLoop(poly, outline, Math.max(1,1.25*cam.sc));
  return b;
}
/* the flat end of a tube; sign is +1 at B and -1 at A */
function tubeCap(P,b,r,sign,color,outline){
  if(dot(V(b.u.x*sign, b.u.y*sign, b.u.z*sign), cam.C) <= 0) return;
  const disc=[];
  for(let i=0;i<32;i++) disc.push(ringAt(P,b,r,i/32*Math.PI*2));
  fillPoly(disc, color);
  if(outline) strokeLoop(disc, outline, Math.max(1,1.2*cam.sc));
}
/* a tube bent through a list of points */
function drawTubeChain(pts,r,dimC,litC,outline){
  for(let i=0;i<pts.length-1;i++) drawTube(pts[i], pts[i+1], r, r, dimC, litC, outline);
}

/* =====================================================================
   Pointer
   ===================================================================== */
const ptr = { on:false, sx:0, sy:0, nx:0, ny:0 };
function pointerAt(e){
  const r = cv.getBoundingClientRect();
  ptr.sx = e.clientX - r.left; ptr.sy = e.clientY - r.top;
  ptr.nx = clamp(ptr.sx/Math.max(1,r.width) *2-1, -1, 1);
  ptr.ny = clamp(ptr.sy/Math.max(1,r.height)*2-1, -1, 1);
  ptr.on = true;
}
cv.addEventListener('pointermove', pointerAt, {passive:true});
cv.addEventListener('pointerdown', pointerAt, {passive:true});
cv.addEventListener('pointerleave', ()=>{ ptr.on=false; });
cv.addEventListener('pointercancel', ()=>{ ptr.on=false; });
cv.addEventListener('pointerup', e=>{ if(e.pointerType!=='mouse') ptr.on=false; });

/* =====================================================================
   Frame loop
   ===================================================================== */
let canvasW=0, canvasH=0, DPR=1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  canvasW = cv.clientWidth; canvasH = cv.clientHeight;
  cv.width = Math.round(canvasW*DPR); cv.height = Math.round(canvasH*DPR);
}
window.addEventListener('resize', resize);
resize();

const lin  = (t,a,b)=>clamp((t-a)/(b-a), 0, 1);
const ease = t=>t*t*(3-2*t);
const back = t=>{ const c=2.2, u=t-1; return 1 + (c+1)*u*u*u + c*u*u; };

/* A scene declares the world boxes it lives in, then draws into the stage:
   { bounds, curY, step(dt,t,cur), shadows(t,cur), items(t,cur), over(t,cur) }
   One box per object keeps the projected footprint tight; a single box
   around a spread-out composition would measure mostly empty floor. */
function run(scene){
  let bx0=1e9, bx1=-1e9, by0=1e9, by1=-1e9;
  for(const box of scene.bounds)
    for(const x of box.x) for(const y of box.y) for(const z of box.z){
      const dx = 0.8660254*(x - z), dy = 0.5*(x + z) - y;   // the rest pose
      if(dx<bx0) bx0=dx; if(dx>bx1) bx1=dx;
      if(dy<by0) by0=dy; if(dy>by1) by1=dy;
    }
  const FIT = Math.min(FIT_W/(bx1-bx0), FIT_H/(by1-by0));
  const CX = (bx0+bx1)/2, CY = (by0+by1)/2;
  const curY = scene.curY === undefined ? 24 : scene.curY;

  const T0 = performance.now();
  let prev = T0, orbMix = 0, orbX = 0, orbY = 0;

  function frame(now){
    const dt = clamp((now-prev)/1000, 0, 1/30); prev = now;
    const t  = STILL ? 0 : ((now-T0)/1000) % LOOP;
    if(cv.clientWidth!==canvasW || cv.clientHeight!==canvasH) resize();
    ctx.setTransform(DPR,0,0,DPR,0,0);

    const A   = STILL ? 0 : 1;
    const osc = (k, amp) => A*amp*Math.sin(k*W0*t);

    /* --- camera: idle loop, handed over to the pointer while it hovers --- */
    const want = (ptr.on && !STILL) ? 1 : 0;
    orbMix += (want - orbMix)*Math.min(1, dt*2.6);
    orbX   += ((ptr.on&&!STILL ? ptr.nx : 0) - orbX)*Math.min(1, dt*4.5);
    orbY   += ((ptr.on&&!STILL ? ptr.ny : 0) - orbY)*Math.min(1, dt*4.5);
    const az = Math.PI/4 + (1-orbMix)*(osc(1,0.30) + osc(2,0.05)) + orbX*0.50;
    const el = clamp(0.61548 + (1-orbMix)*(osc(2,0.060) + osc(3,0.018)) - orbY*0.19,
                     0.40, 0.94);
    const scale = Math.min(canvasW/DW, canvasH/DH)*ZOOM*FIT*PROJ_S;
    setCamera(az, el, scale,
              canvasW*0.5 - CX*scale/PROJ_S,
              canvasH*0.5 - CY*scale/PROJ_S);

    slabPhase = osc(1, 40);
    drift     = osc(2, 46);

    const cur = (ptr.on && !STILL) ? planeAt(ptr.sx, ptr.sy, curY) : null;
    if(scene.step) scene.step(dt, t, cur, osc);

    ctx.fillStyle = BG; ctx.fillRect(0,0,canvasW,canvasH);
    drawCurtain(t);
    if(scene.shadows) scene.shadows(t, cur, osc);
    const items = scene.items(t, cur, osc);
    items.sort((a,b)=>a.d-b.d);
    for(const it of items) it.f();
    if(scene.over) scene.over(t, cur, osc);
    drawBleed();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Keyboard + Mouse — a 65% low-profile board whose caps sink under a
   travelling wave and under the pointer, with a seamless Magic Mouse
   parked on its right.  The stage owns the camera, the light and the
   framing; this file only builds the two objects. */

const KB = { x:20, z:-25, hx:310, hz:118, rot:-0.035 };
const KEY_ROWS = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1.35,1,1,1,1,1,1,1,1,1,1,1,1,1.65],
  [1.65,1,1,1,1,1,1,1,1,1,1,1,2.35],
  [2.1,1,1,1,1,1,1,1,1,1,1,2.9],
  [1.25,1.25,1.25,6.2,1.25,1.25,1.25],
];
const MOUSE = { x:345, z:146, rot:-0.18, hx:72, hz:108, r:62 };

function drawKeyboard(t, cur){
  drawRoundedSlab(KB.x, KB.z, KB.hx, KB.hz, 20, 0, 24, KB.rot, DEEP, DIM, INK);
  const unit=34, gap=5, rowGap=38, startZ=-74;
  const keys=[];
  for(let row=0;row<KEY_ROWS.length;row++){
    const widths=KEY_ROWS[row];
    const total=widths.reduce((a,b)=>a+b,0)*unit + (widths.length-1)*gap;
    let cursor=-total/2;
    for(let col=0;col<widths.length;col++){
      const w=widths[col]*unit, x=cursor+w/2, z=startZ+row*rowGap;
      const p=localPoint(KB.x, KB.z, KB.rot, x, 0, z);
      const wave=STILL ? 0 : 0.5+0.5*Math.sin(W0*t*5 + row*0.72 + col*0.38);
      const near=cur ? Math.max(0, 1-Math.hypot(p.x-cur.x, p.z-cur.z)/74) : 0;
      const press=Math.max(wave*0.42, near)*4.8;
      keys.push({ x:p.x, z:p.z, hx:w/2-2, hz:14, press, row, col });
      cursor += w+gap;
    }
  }
  keys.sort((a,b)=>depth(V(a.x,32,a.z))-depth(V(b.x,32,b.z)));
  for(const k of keys){
    const accent=(k.row===0 && k.col===0) || (k.row===4 && k.col===3);
    drawRoundedSlab(k.x, k.z, k.hx, k.hz, 4, 25-k.press, 38-k.press, KB.rot,
      accent?DIM:EDGE, accent?LIT:WHITE, accent?DEEP:DIM, accent?LIT:EDGE);
    if(!accent && k.hx<34){
      const p=localPoint(k.x, k.z, KB.rot, 0, 39-k.press, 0);
      ctx.beginPath(); ctx.arc(px(p), py(p), Math.max(1,1.35*cam.sc), 0, Math.PI*2);
      ctx.fillStyle='rgba(86,42,8,.55)'; ctx.fill();
    }
  }
}

function drawMouse(t, cur){
  const near=cur ? Math.max(0, 1-Math.hypot(MOUSE.x-cur.x, MOUSE.z-cur.z)/150) : 0;
  const click=(STILL ? 0 : 0.5+0.5*Math.sin(W0*t*7))*near;
  const lift=STILL ? 0 : 1.8*Math.sin(W0*t*3);
  drawRoundedSlab(MOUSE.x, MOUSE.z, MOUSE.hx+4, MOUSE.hz+4, MOUSE.r+2,
    lift, 9+lift, MOUSE.rot, DEEP, DIM, INK, DEEP);
  drawRoundedSlab(MOUSE.x, MOUSE.z, MOUSE.hx, MOUSE.hz, MOUSE.r,
    8+lift, 32+lift-click*1.8, MOUSE.rot, EDGE, WHITE, DIM, EDGE);
}

run({
  bounds: [
    { x:[-290, 330], y:[0, 44], z:[-143,  93] },   // the board
    { x:[ 273, 417], y:[0, 34], z:[  38, 254] },   // the mouse
  ],
  curY: 30,
  shadows(){
    boxShadow(KB.x, KB.z, KB.hx, KB.hz, 0, 38, KB.rot);
    boxShadow(MOUSE.x, MOUSE.z, MOUSE.hx, MOUSE.hz, 0, 32, MOUSE.rot);
  },
  items(t, cur){
    return [
      { d: depth(V(KB.x, 20, KB.z)),       f: ()=>drawKeyboard(t, cur) },
      { d: depth(V(MOUSE.x, 20, MOUSE.z)), f: ()=>drawMouse(t, cur) },
    ];
  },
});
})();
<\/script>
</body>
</html>
`,y=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isometric Mail — Light Shafts</title>
<style>
  html,body{margin:0;height:100%;background:#140f0b;overflow:hidden}
  canvas{display:block;width:100vw;height:100vh;touch-action:none;cursor:crosshair}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
(() => {
'use strict';

/* =====================================================================
   Flat-vector isometric scene.
   Real 3-D geometry + an orthographic camera, drawn with a painter's
   algorithm on Canvas2D so every edge stays a crisp vector edge:
   the thing animates in 3-D but keeps a 2-D illustration surface.

   Pointer orbits the camera; the pointer also acts as a vertical rod that
   shoves the coins around, and they knock into each other and settle back.
   ===================================================================== */

const cv  = document.getElementById('c');
const ctx = cv.getContext('2d');

const Q       = new URLSearchParams(location.search);
const REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STILL   = Q.has('still') || REDUCED;  // t=0 is exactly the source frame

/* Every ambient quantity is amp*sin(k*W0*t) with integer k and no phase, so
   the piece loops seamlessly every LOOP seconds and t=0 is the source frame
   exactly.  ZOOM fits the whole composition inside the viewport. */
const LOOP = 40;
const W0   = 2*Math.PI/LOOP;
const ZOOM = 0.86;

/* ---------- design frame (the source illustration is 1500x750) -------- */
const DW = 1500, DH = 750;
const OX = 830.3, OY = 431;              // world (0,0,0) lands here
const PROJ_S = Math.sqrt(1.5);           // makes the rest pose read 0.866 / 0.5

/* ---------- palette --------------------------------------------------- */
const LIT   = '#ff7a0f';
const DIM   = '#9c4709';
const DEEP  = '#562a08';
const INK   = '#17110c';
const CONT  = '#4a2206';                 // contact band between stacked coins
const CAVE  = '#562a08';                 // inside of the envelope
const WHITE = '#ffffff';
const PAPER = '#f4ece2';                 // back of the flap / card
const CARDE = '#cbab8b';                 // card edge
const BG    = '#140f0b';
const SLOT  = 'rgba(46,12,0,0.62)';
const CAST  = 'rgba(80,30,6,0.30)';

/* ---------- vec3 ------------------------------------------------------ */
const V   = (x,y,z)=>({x,y,z});
const dot = (a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const clamp = (v,a,b)=>v<a?a:(v>b?b:v);

/* ---------- camera ---------------------------------------------------- */
const cam = { R:V(1,0,0), U:V(0,1,0), C:V(0,0,1), S:1, ox:0, oy:0, sc:1 };

function setCamera(az, el, scale, ox, oy){
  const ce = Math.cos(el), se = Math.sin(el);
  const C  = V(ce*Math.sin(az), se, ce*Math.cos(az));
  const f  = V(-C.x, -C.y, -C.z);
  const R  = V(-f.z, 0, f.x);
  const rl = Math.hypot(R.x, R.z); R.x/=rl; R.z/=rl;
  const U  = V(-R.z*f.y, R.z*f.x - R.x*f.z, R.x*f.y);
  cam.R=R; cam.U=U; cam.C=C; cam.S=scale; cam.ox=ox; cam.oy=oy;
  cam.sc = scale/PROJ_S;                 // design px -> canvas px
}
const px = p => (p.x*cam.R.x + p.y*cam.R.y + p.z*cam.R.z)*cam.S + cam.ox;
const py = p => -(p.x*cam.U.x + p.y*cam.U.y + p.z*cam.U.z)*cam.S + cam.oy;
const depth = p => dot(p, cam.C);
const dY = y => canvasH*0.5 + (y - DH*0.5)*cam.sc;   // design Y -> canvas Y

/* screen point -> world XZ on the horizontal plane at height h */
function planeAt(sx, sy, h){
  const u = (sx-cam.ox)/cam.S;
  const w = -(sy-cam.oy)/cam.S - h*cam.U.y;
  const det = cam.R.x*cam.U.z - cam.R.z*cam.U.x;
  if(Math.abs(det) < 1e-6) return null;
  return { x:( cam.U.z*u - cam.R.z*w)/det,
           z:(-cam.U.x*u + cam.R.x*w)/det };
}

/* ---------- path helpers ---------------------------------------------- */
function tracePoly(pts){
  if(pts.length < 3) return false;
  ctx.beginPath();
  ctx.moveTo(px(pts[0]), py(pts[0]));
  for(let i=1;i<pts.length;i++) ctx.lineTo(px(pts[i]), py(pts[i]));
  ctx.closePath();
  return true;
}
function fillPoly(pts, color){ if(tracePoly(pts)){ ctx.fillStyle = color; ctx.fill(); } }
function strokeSeg(a,b,color,w){
  ctx.beginPath(); ctx.moveTo(px(a),py(a)); ctx.lineTo(px(b),py(b));
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
}
function strokeLoop(pts,color,w){
  if(!tracePoly(pts)) return;
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin='round'; ctx.stroke();
}
function normalOf(p){                     // Newell, for back-face culling
  let nx=0,ny=0,nz=0;
  for(let i=0;i<p.length;i++){
    const a=p[i], b=p[(i+1)%p.length];
    nx += (a.y-b.y)*(a.z+b.z);
    ny += (a.z-b.z)*(a.x+b.x);
    nz += (a.x-b.x)*(a.y+b.y);
  }
  return V(nx,ny,nz);
}
/* keep only the part of a polygon at or above a horizontal plane */
function clipAbove(poly, yMin){
  const out=[], n=poly.length;
  for(let i=0;i<n;i++){
    const A=poly[i], B=poly[(i+1)%n];
    const a=A.y-yMin, b=B.y-yMin;
    if(a>=0) out.push(A);
    if((a>=0)!==(b>=0)){
      const t=a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, yMin, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}

/* =====================================================================
   Light slabs — vertical prisms of light standing in the world.  A point
   is lit when n·p lands inside one of them.  Period 192: lit 32, gap 32,
   lit 64, gap 64 — read straight off the source illustration.
   ===================================================================== */
const SLAB_N = V(0.836, 0, -0.549);
const SLAB_P = 192;
let slabPhase = 0;
const slabT = p => dot(p, SLAB_N);
function slabsIn(tmin, tmax){
  const out = [];
  const k0 = Math.floor((tmin-slabPhase)/SLAB_P) - 1;
  const k1 = Math.ceil((tmax-slabPhase)/SLAB_P) + 1;
  for(let k=k0;k<=k1;k++){
    out.push([SLAB_P*k - 64 + slabPhase, SLAB_P*k - 32 + slabPhase]);
    out.push([SLAB_P*k      + slabPhase, SLAB_P*k + 64 + slabPhase]);
  }
  return out;
}
function clipHalf(poly, d, above){
  const out = [], n = poly.length;
  for(let i=0;i<n;i++){
    const A = poly[i], B = poly[(i+1)%n];
    let a = slabT(A)-d, b = slabT(B)-d;
    if(!above){ a=-a; b=-b; }
    if(a >= 0) out.push(A);
    if((a>=0) !== (b>=0)){
      const t = a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, A.y+(B.y-A.y)*t, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}
function fillBanded(poly, dimC, litC){
  fillPoly(poly, dimC);
  let lo=1e9, hi=-1e9;
  for(const p of poly){ const t=slabT(p); if(t<lo) lo=t; if(t>hi) hi=t; }
  for(const s of slabsIn(lo,hi)){
    let piece = clipHalf(poly, s[0], true);
    if(piece.length < 3) continue;
    piece = clipHalf(piece, s[1], false);
    if(piece.length >= 3) fillPoly(piece, litC);
  }
}

/* =====================================================================
   Scene (units are design pixels of the reference frame)
   ===================================================================== */
const ENV    = { hx:258, hz:208, h:33 };
const COIN_R = 92, COIN_H = 37;
const COIN1  = { x:-157.5, z:399.5 };
const STACK  = { x:  29.4, z:334.6, n:3 };
const PEN    = { x:-240, y:150, z0:292, r:16 };
const CARD   = { hx:170, hz:124, th:5, cx:4, cz:-30 };
const LIGHT  = V(-0.17, 1, 0.17);
const FLAP_R = ENV.hz + 1.3;             // hinge -> seam centre, along Z

/* ---------------------------------------------------------------------
   Glow curtain + hot rays, anchored to vertical world lines so they stay
   exactly vertical on screen under any azimuth.
   --------------------------------------------------------------------- */
const GLOW_L = V(-421.6,0, 421.6); // left edge   (design x  100)
const GLOW_R = V( 421.3,0,-421.3); // right edge  (design x 1560)
const GLOW_BOTTOM = 560;           // design y where the curtain dies

/* Three pieces, all measured off the source: a soft bloom in the upper
   left that fades downward, a curtain with a hard left edge that swells
   toward the floor and stops at x=1238, and the bleed past that edge. */
const glowTex = (() => {
  const W=730, H=150, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  const smooth=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
  for(let j=0;j<H;j++){
    const v = j/(H-1), y = v*GLOW_BOTTOM;
    const tail = 1 - smooth(0.67, 0.95, v);
    const fall = Math.exp(-Math.pow(y/140, 3));
    for(let i=0;i<W;i++){
      const u = i/(W-1), x = 100 + u*1460;
      const bloom = 23*Math.exp(-Math.pow((x-412)/105, 2))*fall;
      const curtain = smooth(405,435,x) * (
                        Math.max(0, 0.026*(x-450)) +
                        (68 + 0.09*Math.max(0, x-820))*v ) * tail;
      const bleed   = 30*Math.exp(-Math.pow((x-1243)/85, 2))
                        *Math.exp(-Math.pow((y-350)/145, 2));
      const k = smooth(1234, 1244, x);          // the slab's own edge
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=190; d[o+2]=130;
      d[o+3]=Math.min(255, Math.round(1.22*(bloom + curtain*(1-k) + bleed*k)));
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

/* one shared halo field: triangular across, eased in from the top */
const haloTex = (() => {
  const W=48, H=192, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  for(let j=0;j<H;j++){
    const v=j/(H-1);
    const vp = v<0.3 ? 0.45+0.55*(v/0.3) : Math.max(0, 1-(v-0.3)/0.7);
    for(let i=0;i<W;i++){
      const u=i/(W-1), bell=1-Math.abs(2*u-1);
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=175; d[o+2]=95;
      d[o+3]=Math.round(255*bell*bell*vp);
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

const RAYS = [   /* design x, core width, peak alpha, design y where it dies */
  { X:-857, Z:-500, w:3.4, a:0.20, fade:300, hw:18, ha:0.035 }, // design x  520
  { X:  51, Z: 200, w:3.6, a:0.62, fade:470, hw:62, ha:0.20 },  // design x  701
  { X: -91, Z:-300, w:3.4, a:0.42, fade:560, hw:22, ha:0.05 },  // design x 1011
  { X:-131, Z:-600, w:3.4, a:0.34, fade:560, hw:22, ha:0.03 },  // design x 1236
];
let drift = 0;

function drawCurtain(t){
  const xL = px(V(GLOW_L.x+drift,0,GLOW_L.z));
  const xR = px(V(GLOW_R.x+drift,0,GLOW_R.z));
  const yB = dY(GLOW_BOTTOM), y0 = dY(0);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if(xR > xL){
    ctx.drawImage(glowTex, xL, y0, xR-xL, yB-y0);
    /* the shafts fall from off-screen: repeat the top row above the frame */
    if(y0 > 0) ctx.drawImage(glowTex, 0,0, glowTex.width,1, xL, 0, xR-xL, y0);
  }
  for(let i=0;i<RAYS.length;i++){
    const r  = RAYS[i];
    const x  = px(V(r.X+drift,0,r.Z));
    const hw = r.w*0.5*cam.sc, HW = r.hw*cam.sc;
    const yF = dY(r.fade);
    const flick = 1 + 0.09*Math.sin((11+i)*W0*t) + 0.05*Math.sin((23+2*i)*W0*t);
    ctx.globalAlpha = r.ha*flick;
    ctx.drawImage(haloTex, x-HW, y0, HW*2, yF-y0);
    if(y0 > 0) ctx.drawImage(haloTex, 0,0, haloTex.width,1, x-HW, 0, HW*2, y0);
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, y0, 0, yF);
    g.addColorStop(0,    \`rgba(255,206,150,\${r.a*flick})\`);
    g.addColorStop(0.35, \`rgba(255,196,132,\${r.a*0.62*flick})\`);
    g.addColorStop(1,    'rgba(255,190,125,0)');
    ctx.fillStyle = g; ctx.fillRect(x-hw, 0, hw*2, yF);
  }
  ctx.restore();
}

/* ---------------------------------------------------------------------
   Ground shadows (hard-edged, illustration style)
   --------------------------------------------------------------------- */
const shadowOf = p => V(p.x - LIGHT.x*p.y/LIGHT.y, 0.6, p.z - LIGHT.z*p.y/LIGHT.y);
function hullFill(pts, color){
  if(pts.length<3) return;
  const P = pts.map(p=>[px(p),py(p)]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[],up=[];
  for(const p of P){ while(lo.length>=2 && cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); }
  for(let i=P.length-1;i>=0;i--){ const p=P[i]; while(up.length>=2 && cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); }
  lo.pop(); up.pop();
  const Hl=lo.concat(up); if(Hl.length<3) return;
  ctx.beginPath(); ctx.moveTo(Hl[0][0],Hl[0][1]);
  for(let i=1;i<Hl.length;i++) ctx.lineTo(Hl[i][0],Hl[i][1]);
  ctx.closePath(); ctx.fillStyle=color; ctx.fill();
}
function coinShadow(b, bob){
  const y0 = b.lvl*COIN_H + bob, y1 = y0 + COIN_H, pts=[];
  for(let i=0;i<32;i++){
    const a=i/32*Math.PI*2;
    const X=b.x+Math.cos(a)*COIN_R, Z=b.z+Math.sin(a)*COIN_R;
    pts.push(shadowOf(V(X,y0,Z)), shadowOf(V(X,y1,Z)));
  }
  hullFill(pts, CAST);
}
function envShadow(lift){
  const p=[];
  for(const sx of [-1,1]) for(const sz of [-1,1]) for(const sy of [0,1])
    p.push(shadowOf(V(sx*ENV.hx, lift+sy*ENV.h, sz*ENV.hz)));
  hullFill(p, CAST);
}

/* ---------------------------------------------------------------------
   Envelope — a slab whose top face carries the four flap seams.  The
   upper-right triangle is a real flap: it hinges on the T–R edge.
   --------------------------------------------------------------------- */
function drawEnvelope(rot, lift, open){
  const co=Math.cos(rot), si=Math.sin(rot);
  const P=(x,y,z)=>V(x*co+z*si, y+lift, -x*si+z*co);
  const {hx,hz,h}=ENV;
  const T=P(-hx,h,-hz), R=P(hx,h,-hz), B=P(hx,h,hz), L=P(-hx,h,hz), C=P(-7.3,h,1.3);
  const Tb=P(-hx,0,-hz), Rb=P(hx,0,-hz), Bb=P(hx,0,hz), Lb=P(-hx,0,hz);
  const nx=V(co,0,-si), nz=V(si,0,co);
  const lw=Math.max(1, 1.7*cam.sc);

  const walls=[];
  if(dot(nz,cam.C)>0) walls.push({q:[L,B,Bb,Lb], ribs:0});
  else                walls.push({q:[R,T,Tb,Rb], ribs:0});
  if(dot(nx,cam.C)>0) walls.push({q:[B,R,Rb,Bb], ribs:1, a:B, b:R});
  else                walls.push({q:[T,L,Lb,Tb], ribs:1, a:T, b:L});

  for(const f of walls){
    if(!f.ribs){ fillPoly(f.q, DEEP); }
    else{
      fillPoly(f.q, INK);
      const N=26;
      ctx.strokeStyle=LIT; ctx.lineWidth=Math.max(1, 1.9*cam.sc);
      ctx.beginPath();
      for(let i=0;i<N;i++){
        const s=(i+0.5)/N;
        const X=f.a.x+(f.b.x-f.a.x)*s, Z=f.a.z+(f.b.z-f.a.z)*s;
        const A=V(X,f.a.y,Z), Bo=V(X,f.a.y-h,Z);
        ctx.moveTo(px(A),py(A)); ctx.lineTo(px(Bo),py(Bo));
      }
      ctx.stroke();
    }
    strokeLoop(f.q, LIT, lw);
  }

  if(dot(V(0,1,0),cam.C)>0){
    fillPoly([T,C,R], CAVE);                    // what the flap uncovers
    fillPoly([T,L,C], DIM);
    fillPoly([L,B,C], DIM);
    fillPoly([C,B,R], DIM);
    strokeLoop([T,R,B,L], LIT, lw);
    strokeSeg(L,C,LIT,lw); strokeSeg(C,B,LIT,lw);
    strokeSeg(T,C,LIT,lw*0.62); strokeSeg(C,R,LIT,lw*0.62);
  }

  /* the flap: C swung about the hinge line through T and R */
  const phi = open*2.15;
  const Cf  = P(-7.3, h + FLAP_R*Math.sin(phi), -hz + FLAP_R*Math.cos(phi));
  const flap = [T, Cf, R];
  const outer = dot(normalOf(flap), cam.C);
  fillPoly(flap, outer > 0 ? WHITE : PAPER);
  strokeLoop(flap, LIT, lw*0.8);
}

/* ---------------------------------------------------------------------
   The letter — rises out of the envelope once the flap is open
   --------------------------------------------------------------------- */
function drawCard(rot, lift, amt){
  if(amt <= 0.002) return;
  const co=Math.cos(rot), si=Math.sin(rot);
  const P=(x,y,z)=>V(x*co+z*si, y+lift, -x*si+z*co);
  const yTop  = ENV.h + lift;                     // envelope's top plane
  const baseY = ENV.h - 46 + amt*168;
  const tilt  = -amt*0.32, ct=Math.cos(tilt), st=Math.sin(tilt);
  const {hx,hz,th,cx,cz} = CARD;
  /* local (u, dy, w) -> world */
  const Pt = (u,dy,w)=>P(cx+u, baseY + dy*ct + w*st, cz - dy*st + w*ct);

  const c = [];                                   // 0-3 top, 4-7 bottom
  for(const [u,w] of [[-hx,-hz],[hx,-hz],[hx,hz],[-hx,hz]]) c.push(Pt(u, th/2, w));
  for(const [u,w] of [[-hx,-hz],[hx,-hz],[hx,hz],[-hx,hz]]) c.push(Pt(u,-th/2, w));

  const faces = [
    { q:[c[0],c[1],c[2],c[3]], col:WHITE, top:1 },
    { q:[c[4],c[5],c[6],c[7]], col:CARDE },
    { q:[c[0],c[1],c[5],c[4]], col:CARDE },
    { q:[c[1],c[2],c[6],c[5]], col:CARDE },
    { q:[c[2],c[3],c[7],c[6]], col:CARDE },
    { q:[c[3],c[0],c[4],c[7]], col:CARDE },
  ];
  const mid = V((c[0].x+c[6].x)/2, (c[0].y+c[6].y)/2, (c[0].z+c[6].z)/2);
  const lw = Math.max(1, 1.5*cam.sc);
  for(const f of faces){
    let n = normalOf(f.q);
    const ctr = f.q.reduce((a,q)=>V(a.x+q.x/4, a.y+q.y/4, a.z+q.z/4), V(0,0,0));
    if(dot(n, V(ctr.x-mid.x, ctr.y-mid.y, ctr.z-mid.z)) < 0){
      f.q.reverse(); n = normalOf(f.q);
    }
    if(dot(n, cam.C) <= 0) continue;
    const q = clipAbove(f.q, yTop);
    if(q.length < 3) continue;
    fillPoly(q, f.col);
    strokeLoop(q, LIT, lw);
    if(f.top){                                    // four lines of "writing"
      const x0 = -hx*0.76, span = hx*1.52, hb = 4.5;
      for(const [rz,rw] of [[-0.60,0.86],[-0.33,0.70],[-0.06,0.80],[0.21,0.44]]){
        const x1 = x0 + span*rw, zc = hz*rz;
        const bar=[ Pt(x0, th/2+0.1, zc-hb), Pt(x1, th/2+0.1, zc-hb),
                    Pt(x1, th/2+0.1, zc+hb), Pt(x0, th/2+0.1, zc+hb) ];
        const cb = clipAbove(bar, yTop);
        if(cb.length>=3) fillPoly(cb, 'rgba(156,71,9,0.55)');
      }
    }
  }
}

/* ---------------------------------------------------------------------
   Coins — milled edge over an arc that turns with the coin, banded by the
   light slabs, and shoved around by the pointer.
   --------------------------------------------------------------------- */
const RIDGES = 84;
const RIB_A0 = -0.87, RIB_A1 = 0.63;   // milled arc, in coin space

function drawCoin(b, yBase, topDark){
  const cx=b.x, cz=b.z, spin=b.spin;
  const yTop = yBase + COIN_H;
  const psi  = Math.atan2(cam.C.z, cam.C.x);
  const pt   = (a,y)=>V(cx+Math.cos(a)*COIN_R, y, cz+Math.sin(a)*COIN_R);

  /* rim: the source keeps it fully lit; only the top face is banded */
  const a0=psi-Math.PI/2, a1=psi+Math.PI/2, N=64, rimPoly=[];
  for(let i=0;i<=N;i++) rimPoly.push(pt(a0+(a1-a0)*i/N, yTop));
  for(let i=N;i>=0;i--) rimPoly.push(pt(a0+(a1-a0)*i/N, yBase));
  fillPoly(rimPoly, LIT);

  /* milled slots */
  const pitch=Math.PI*2/RIDGES, hwA=pitch*0.21;
  ctx.fillStyle=SLOT; ctx.beginPath();
  const i0=Math.ceil(RIB_A0/pitch), i1=Math.floor(RIB_A1/pitch);
  for(let i=i0;i<=i1;i++){
    const a=i*pitch + spin;
    let rel=((a-psi)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;
    if(Math.abs(rel)>Math.PI/2-hwA) continue;
    const q=[pt(a-hwA,yTop),pt(a+hwA,yTop),pt(a+hwA,yBase),pt(a-hwA,yBase)];
    ctx.moveTo(px(q[0]),py(q[0]));
    for(let k=1;k<4;k++) ctx.lineTo(px(q[k]),py(q[k]));
    ctx.closePath();
  }
  ctx.fill();

  /* top face */
  if(cam.C.y>0){
    const disc=[];
    for(let i=0;i<128;i++){
      const a=i/128*Math.PI*2;
      disc.push(V(cx+Math.cos(a)*COIN_R, yTop, cz+Math.sin(a)*COIN_R));
    }
    if(topDark) fillPoly(disc, CONT);
    else{
      fillBanded(disc, DIM, LIT);
      const rr=COIN_R*0.89, yy=yTop-8, ring=[];
      for(let i=0;i<=96;i++){
        const a=i/96*Math.PI*2;
        ring.push(V(cx+Math.cos(a)*rr, yy, cz+Math.sin(a)*rr));
      }
      ctx.beginPath(); ctx.moveTo(px(ring[0]),py(ring[0]));
      for(let i=1;i<ring.length;i++) ctx.lineTo(px(ring[i]),py(ring[i]));
      ctx.closePath();
      ctx.strokeStyle='rgba(38,14,2,0.85)';
      ctx.lineWidth=Math.max(1,1.9*cam.sc); ctx.stroke();
    }
  }
}
function rimBand(b, y0, y1, color){
  const psi=Math.atan2(cam.C.z, cam.C.x), a0=psi-Math.PI/2, a1=psi+Math.PI/2, n=48;
  const pt=(a,y)=>V(b.x+Math.cos(a)*COIN_R, y, b.z+Math.sin(a)*COIN_R);
  const poly=[];
  for(let i=0;i<=n;i++) poly.push(pt(a0+(a1-a0)*i/n, y1));
  for(let i=n;i>=0;i--) poly.push(pt(a0+(a1-a0)*i/n, y0));
  fillPoly(poly, color);
}

/* --- bodies: XZ position with a spring home, collisions and spin ------- */
const COINS = [];
COINS.push({ hx:COIN1.x, hz:COIN1.z, x:COIN1.x, z:COIN1.z, vx:0, vz:0,
             lvl:0, stack:0, above:false, k:15, damp:4.2, spin:0, spinV:0 });
for(let i=0;i<STACK.n;i++)
  COINS.push({ hx:STACK.x, hz:STACK.z, x:STACK.x, z:STACK.z, vx:0, vz:0,
               lvl:i, stack:1, above:i<STACK.n-1, k:20, damp:5.4, spin:0, spinV:0 });

const CURSOR_R = 76, PUSH = 1500, SWIPE = 2.6;

function stepCoins(dt, cur){
  for(const b of COINS){
    let ax = (b.hx-b.x)*b.k - b.vx*b.damp;
    let az = (b.hz-b.z)*b.k - b.vz*b.damp;
    if(cur){
      const dx=b.x-cur.x, dz=b.z-cur.z, d=Math.hypot(dx,dz) || 1e-4;
      const reach = COIN_R + CURSOR_R;
      if(d < reach){
        const g = 1 - d/reach;
        ax += dx/d*PUSH*g;  az += dz/d*PUSH*g;
        ax += cur.vx*SWIPE*g; az += cur.vz*SWIPE*g;
        b.spinV += (dx*cur.vz - dz*cur.vx)/(COIN_R*COIN_R)*1.6*g;
      }
    }
    b.vx += ax*dt; b.vz += az*dt;
    b.x  += b.vx*dt; b.z += b.vz*dt;
  }
  /* a coin rides on the one below it */
  for(let i=1;i<COINS.length;i++){
    const A=COINS[i], B=COINS[i-1];
    if(A.stack!==B.stack || A.lvl!==B.lvl+1) continue;
    const fx=(B.x-A.x)*11, fz=(B.z-A.z)*11;
    A.vx += fx*dt; A.vz += fz*dt;
    B.vx -= fx*0.6*dt; B.vz -= fz*0.6*dt;
  }
  /* coins on the same tier knock into each other */
  for(let i=0;i<COINS.length;i++) for(let j=i+1;j<COINS.length;j++){
    const A=COINS[i], B=COINS[j];
    if(A.lvl!==B.lvl) continue;
    let dx=B.x-A.x, dz=B.z-A.z, d=Math.hypot(dx,dz);
    if(d >= COIN_R*2 || d < 1e-4) continue;
    const nx=dx/d, nz=dz/d, pen=COIN_R*2-d;
    A.x -= nx*pen*0.5; A.z -= nz*pen*0.5;
    B.x += nx*pen*0.5; B.z += nz*pen*0.5;
    const rel = (B.vx-A.vx)*nx + (B.vz-A.vz)*nz;
    if(rel < 0){
      const jimp = -(1+0.42)*rel*0.5;
      A.vx -= jimp*nx; A.vz -= jimp*nz;
      B.vx += jimp*nx; B.vz += jimp*nz;
      const tx=-nz, tz=nx;
      const relT = (B.vx-A.vx)*tx + (B.vz-A.vz)*tz;
      A.spinV -= relT/COIN_R*0.35;
      B.spinV += relT/COIN_R*0.35;
    }
  }
  /* the milled arc eases back so the composition keeps its face */
  for(const b of COINS){
    b.spinV += (-b.spin*2.6 - b.spinV*2.4)*dt;
    b.spin  += b.spinV*dt;
  }
}

/* ---------------------------------------------------------------------
   Pen — a chain of frusta plus a clip, both spun about the pen's axis
   --------------------------------------------------------------------- */
const PEN_DIM='#a8551a', PEN_LIT='#ff8a24', CLIP_C='#b45e1e';
const PEN_SEG = [           /* u0, u1, r0, r1, colour  (u from the click end) */
  [   0,  36,  8,    8,   PEN_DIM],
  [  36,  48,  8,   12,   PEN_DIM],
  [  48, 114, 12,   16,   PEN_LIT],
  [ 114, 375, 16,   16,   PEN_DIM],
  [ 375, 392, 16,   14,   PEN_LIT],
  [ 392, 408, 14,    9.5, PEN_LIT],
  [ 408, 421,  9.5,  2.5, PEN_LIT],
];
function drawPen(spin, bob){
  const O  = V(PEN.x, PEN.y+bob, PEN.z0);
  const A  = V(0,0,-1), e1 = V(1,0,0), e2 = V(0,1,0);
  const at = (u,ang,r)=>V(
    O.x + A.x*u + (Math.cos(ang)*e1.x + Math.sin(ang)*e2.x)*r,
    O.y + A.y*u + (Math.cos(ang)*e1.y + Math.sin(ang)*e2.y)*r,
    O.z + A.z*u + (Math.cos(ang)*e1.z + Math.sin(ang)*e2.z)*r);
  const nrm = ang=>V(Math.cos(ang)*e1.x + Math.sin(ang)*e2.x,
                     Math.cos(ang)*e1.y + Math.sin(ang)*e2.y,
                     Math.cos(ang)*e1.z + Math.sin(ang)*e2.z);

  let best=0, bd=-2;
  for(let i=0;i<72;i++){ const a=i/72*Math.PI*2, d=dot(nrm(a),cam.C); if(d>bd){bd=d;best=a;} }
  const a0=best-Math.PI/2, a1=best+Math.PI/2, N=26;

  const clipVisible = dot(nrm(spin), cam.C) > 0;
  const clipRad = u => PEN.r + 3.0*clamp((u-46)/34, 0, 1);
  const CU0=46, CU1=182, CW=0.52, RW=15;
  function clipBar(){
    const p=[];
    p.push(at(CU0,-CW+spin, clipRad(CU0)));
    p.push(at(CU1-RW,-CW+spin, clipRad(CU1-RW)));
    for(let i=0;i<=12;i++){
      const f=-Math.PI/2 + Math.PI*i/12;
      p.push(at(CU1-RW+RW*Math.cos(f), spin+CW*Math.sin(f), clipRad(CU1)));
    }
    p.push(at(CU1-RW, CW+spin, clipRad(CU1-RW)));
    p.push(at(CU0, CW+spin, clipRad(CU0)));
    fillPoly(p, CLIP_C);
    strokeLoop(p, 'rgba(36,14,3,0.7)', Math.max(1,1.5*cam.sc));
  }

  if(!clipVisible) clipBar();
  for(let s=PEN_SEG.length-1;s>=0;s--){
    const [u0,u1,r0,r1,col]=PEN_SEG[s], poly=[];
    for(let i=0;i<=N;i++) poly.push(at(u0, a0+(a1-a0)*i/N, r0));
    for(let i=N;i>=0;i--) poly.push(at(u1, a0+(a1-a0)*i/N, r1));
    fillPoly(poly, col);
  }
  const cap=[];
  for(let i=0;i<40;i++) cap.push(at(0, i/40*Math.PI*2, PEN_SEG[0][2]));
  fillPoly(cap, PEN_LIT);
  if(clipVisible) clipBar();
}

/* =====================================================================
   Pointer
   ===================================================================== */
const ptr = { on:false, sx:0, sy:0, psx:0, psy:0, nx:0, ny:0,
              wx:0, wz:0, has:false, vx:0, vz:0, moved:0 };
function pointerAt(e){
  const r = cv.getBoundingClientRect();
  ptr.sx = e.clientX - r.left; ptr.sy = e.clientY - r.top;
  ptr.nx = clamp(ptr.sx/Math.max(1,r.width) *2-1, -1, 1);
  ptr.ny = clamp(ptr.sy/Math.max(1,r.height)*2-1, -1, 1);
  ptr.on = true;
}
cv.addEventListener('pointermove', pointerAt, {passive:true});
cv.addEventListener('pointerdown', pointerAt, {passive:true});
cv.addEventListener('pointerleave', ()=>{ ptr.on=false; ptr.has=false; });
cv.addEventListener('pointercancel', ()=>{ ptr.on=false; ptr.has=false; });
cv.addEventListener('pointerup', e=>{ if(e.pointerType!=='mouse'){ ptr.on=false; ptr.has=false; } });

/* =====================================================================
   Frame loop
   ===================================================================== */
let canvasW=0, canvasH=0, DPR=1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  canvasW = cv.clientWidth; canvasH = cv.clientHeight;
  cv.width = Math.round(canvasW*DPR); cv.height = Math.round(canvasH*DPR);
}
window.addEventListener('resize', resize);
resize();

/* opening eases out with a little overshoot so it snaps; closing is plain.
   Both are 0 at t=0 and at t=LOOP, which keeps the loop and the rest pose. */
const lin  = (t,a,b)=>clamp((t-a)/(b-a), 0, 1);
const ease = t=>{ const x=t*t*(3-2*t); return x; };
const back = t=>{ const c=2.2, u=t-1; return 1 + (c+1)*u*u*u + c*u*u; };

const T0 = performance.now();
let prev = T0, orbMix = 0, orbX = 0, orbY = 0;

function frame(now){
  const dt = clamp((now-prev)/1000, 0, 1/30); prev = now;
  const t  = STILL ? 0 : ((now-T0)/1000) % LOOP;
  if(cv.clientWidth!==canvasW || cv.clientHeight!==canvasH) resize();
  ctx.setTransform(DPR,0,0,DPR,0,0);

  const A   = STILL ? 0 : 1;
  const osc = (k, amp) => A*amp*Math.sin(k*W0*t);

  /* --- camera: idle loop, handed over to the pointer while it hovers --- */
  const want = (ptr.on && !STILL) ? 1 : 0;
  orbMix += (want - orbMix)*Math.min(1, dt*2.6);
  orbX   += ((ptr.on&&!STILL ? ptr.nx : 0) - orbX)*Math.min(1, dt*4.5);
  orbY   += ((ptr.on&&!STILL ? ptr.ny : 0) - orbY)*Math.min(1, dt*4.5);
  const az = Math.PI/4 + (1-orbMix)*(osc(1,0.30) + osc(2,0.05)) + orbX*0.50;
  const el = clamp(0.61548 + (1-orbMix)*(osc(2,0.060) + osc(3,0.018)) - orbY*0.19,
                   0.40, 0.94);
  const scale = Math.min(canvasW/DW, canvasH/DH)*ZOOM*PROJ_S;
  setCamera(az, el, scale,
            canvasW*0.5 + (OX-DW/2)*scale/PROJ_S,
            canvasH*0.5 + (OY-DH/2)*scale/PROJ_S);

  slabPhase = osc(1, 40);
  drift     = osc(2, 46);

  /* --- pointer in world space, on a plane through the coins ------------ */
  let cur = null;
  if(ptr.on && !STILL){
    const g = planeAt(ptr.sx, ptr.sy, COIN_H*0.6);
    if(g){
      const moved = Math.hypot(ptr.sx-ptr.psx, ptr.sy-ptr.psy);
      if(ptr.has && dt > 0){
        const s = Math.min(1, moved/1.5) / dt;
        ptr.vx = clamp((g.x-ptr.wx)*s*0.02, -4000, 4000);
        ptr.vz = clamp((g.z-ptr.wz)*s*0.02, -4000, 4000);
      } else { ptr.vx = ptr.vz = 0; }
      ptr.wx=g.x; ptr.wz=g.z; ptr.has=true;
      ptr.psx=ptr.sx; ptr.psy=ptr.sy;
      cur = { x:g.x, z:g.z, vx:ptr.vx, vz:ptr.vz };
    }
  } else { ptr.has=false; ptr.vx=ptr.vz=0; }
  if(STILL){ for(const b of COINS){ b.x=b.hx; b.z=b.hz; b.vx=b.vz=0; b.spin=0; b.spinV=0; } }
  else stepCoins(dt, cur);

  /* --- ambient offsets ------------------------------------------------- */
  const envLift = osc(3, 5.0);
  const envRot  = osc(2, 0.040);
  const penBob  = osc(5, 8.0);
  const penSpin = 1.75 + osc(2, 0.85);
  const bob     = [osc(4,3.5), osc(3,3.5)];        // per stack
  const open    = STILL ? 0 : Math.max(0, back(lin(t,0.15,1.75)) - ease(lin(t,32.2,34.4)));
  const card    = STILL ? 0 : Math.max(0, back(lin(t,1.05,3.15)) - ease(lin(t,29.6,32.3)));

  /* --- draw ------------------------------------------------------------ */
  ctx.fillStyle = BG; ctx.fillRect(0,0,canvasW,canvasH);
  drawCurtain(t);

  envShadow(envLift);
  for(const b of COINS) if(b.lvl===0) coinShadow(b, bob[b.stack]);

  const items = [
    { d: depth(V(0, ENV.h/2+envLift, 0)), f:()=>drawEnvelope(envRot, envLift, open) },
    { d: depth(V(CARD.cx, ENV.h+card*168, CARD.cz)) + 1,
      f:()=>drawCard(envRot, envLift, card) },
  ];
  for(const b of COINS){
    const y = b.lvl*COIN_H + bob[b.stack];
    items.push({ d: depth(V(b.x, y+COIN_H*0.5, b.z)),
                 f:()=>{ drawCoin(b, y, b.above);
                         if(b.lvl>0) rimBand(b, y-10, y+1, CONT); } });
  }
  items.sort((a,b)=>a.d-b.d);
  for(const it of items) it.f();
  drawPen(penSpin, penBob);

  /* the curtain bleeding faintly over the solids */
  {
    const xL=px(V(GLOW_L.x+drift,0,GLOW_L.z)), xR=px(V(GLOW_R.x+drift,0,GLOW_R.z));
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=0.09;
    if(xR>xL) ctx.drawImage(glowTex, xL, dY(0), xR-xL, dY(GLOW_BOTTOM)-dY(0));
    ctx.restore();
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
<\/script>
</body>
</html>
`,b=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isometric Microphone — Light Shafts</title>
<style>
  html,body{margin:0;height:100%;background:#140f0b;overflow:hidden}
  canvas{display:block;width:100vw;height:100vh;touch-action:none;cursor:crosshair}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
(() => {
'use strict';

/* =====================================================================
   Shared stage for the light-shaft variants.

   The camera basis, the vertical light slabs, the glow curtain and the
   hot rays are the mail document's, carried over line for line so every
   variant stands in the same room under the same light.  A scene file
   adds its own geometry and hands run() the world box it lives in; the
   stage fits that box into the footprint the mail composition occupies
   inside the 1500x750 design frame, so the zoom and the subject size
   stay consistent from one variant to the next.
   ===================================================================== */

const cv  = document.getElementById('c');
const ctx = cv.getContext('2d');

const Q       = new URLSearchParams(location.search);
const REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STILL   = Q.has('still') || REDUCED;  // t=0 is exactly the rest frame

const LOOP = 40;
const W0   = 2*Math.PI/LOOP;
const ZOOM = 0.86;

/* ---------- design frame (the source illustration is 1500x750) -------- */
const DW = 1500, DH = 750;
const PROJ_S = Math.sqrt(1.5);           // makes the rest pose read 0.866 / 0.5

/* the mail composition's own projected footprint, in design px: every
   variant is fitted into this box so they all read at the same size */
const FIT_W = 999, FIT_H = 619;

/* ---------- palette --------------------------------------------------- */
const LIT   = '#ff7a0f';
const DIM   = '#9c4709';
const DEEP  = '#562a08';
const INK   = '#17110c';
const WHITE = '#ffffff';
const PAPER = '#f4ece2';                 // the unlit side of white paper
const EDGE  = '#cbab8b';                 // paper and plastic edges
const BG    = '#140f0b';
const SLOT  = 'rgba(46,12,0,0.62)';
const CAST  = 'rgba(80,30,6,0.30)';

/* ---------- vec3 ------------------------------------------------------ */
const V   = (x,y,z)=>({x,y,z});
const dot = (a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const clamp = (v,a,b)=>v<a?a:(v>b?b:v);
const mix = (a,b,t)=>a+(b-a)*t;

/* ---------- camera ---------------------------------------------------- */
const cam = { R:V(1,0,0), U:V(0,1,0), C:V(0,0,1), S:1, ox:0, oy:0, sc:1 };

function setCamera(az, el, scale, ox, oy){
  const ce = Math.cos(el), se = Math.sin(el);
  const C  = V(ce*Math.sin(az), se, ce*Math.cos(az));
  const f  = V(-C.x, -C.y, -C.z);
  const R  = V(-f.z, 0, f.x);
  const rl = Math.hypot(R.x, R.z); R.x/=rl; R.z/=rl;
  const U  = V(-R.z*f.y, R.z*f.x - R.x*f.z, R.x*f.y);
  cam.R=R; cam.U=U; cam.C=C; cam.S=scale; cam.ox=ox; cam.oy=oy;
  cam.sc = scale/PROJ_S;                 // design px -> canvas px
}
const px = p => (p.x*cam.R.x + p.y*cam.R.y + p.z*cam.R.z)*cam.S + cam.ox;
const py = p => -(p.x*cam.U.x + p.y*cam.U.y + p.z*cam.U.z)*cam.S + cam.oy;
const depth = p => dot(p, cam.C);
const dY = y => canvasH*0.5 + (y - DH*0.5)*cam.sc;   // design Y -> canvas Y

/* screen point -> world XZ on the horizontal plane at height h */
function planeAt(sx, sy, h){
  const u = (sx-cam.ox)/cam.S;
  const w = -(sy-cam.oy)/cam.S - h*cam.U.y;
  const det = cam.R.x*cam.U.z - cam.R.z*cam.U.x;
  if(Math.abs(det) < 1e-6) return null;
  return { x:( cam.U.z*u - cam.R.z*w)/det,
           z:(-cam.U.x*u + cam.R.x*w)/det };
}

/* ---------- path helpers ---------------------------------------------- */
function tracePoly(pts){
  if(pts.length < 3) return false;
  ctx.beginPath();
  ctx.moveTo(px(pts[0]), py(pts[0]));
  for(let i=1;i<pts.length;i++) ctx.lineTo(px(pts[i]), py(pts[i]));
  ctx.closePath();
  return true;
}
function fillPoly(pts, color){ if(tracePoly(pts)){ ctx.fillStyle = color; ctx.fill(); } }
function strokeSeg(a,b,color,w){
  ctx.beginPath(); ctx.moveTo(px(a),py(a)); ctx.lineTo(px(b),py(b));
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
}
function strokeLoop(pts,color,w){
  if(!tracePoly(pts)) return;
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin='round'; ctx.stroke();
}
function normalOf(p){                     // Newell, for back-face culling
  let nx=0,ny=0,nz=0;
  for(let i=0;i<p.length;i++){
    const a=p[i], b=p[(i+1)%p.length];
    nx += (a.y-b.y)*(a.z+b.z);
    ny += (a.z-b.z)*(a.x+b.x);
    nz += (a.x-b.x)*(a.y+b.y);
  }
  return V(nx,ny,nz);
}
/* keep only the part of a polygon at or above a horizontal plane */
function clipAbove(poly, yMin){
  const out=[], n=poly.length;
  for(let i=0;i<n;i++){
    const A=poly[i], B=poly[(i+1)%n];
    const a=A.y-yMin, b=B.y-yMin;
    if(a>=0) out.push(A);
    if((a>=0)!==(b>=0)){
      const t=a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, yMin, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}

/* =====================================================================
   Light slabs — vertical prisms of light standing in the world.  A point
   is lit when n·p lands inside one of them.  Period 192: lit 32, gap 32,
   lit 64, gap 64 — read straight off the source illustration.
   ===================================================================== */
const SLAB_N = V(0.836, 0, -0.549);
const SLAB_P = 192;
let slabPhase = 0;
const slabT = p => dot(p, SLAB_N);
function slabsIn(tmin, tmax){
  const out = [];
  const k0 = Math.floor((tmin-slabPhase)/SLAB_P) - 1;
  const k1 = Math.ceil((tmax-slabPhase)/SLAB_P) + 1;
  for(let k=k0;k<=k1;k++){
    out.push([SLAB_P*k - 64 + slabPhase, SLAB_P*k - 32 + slabPhase]);
    out.push([SLAB_P*k      + slabPhase, SLAB_P*k + 64 + slabPhase]);
  }
  return out;
}
function clipHalf(poly, d, above){
  const out = [], n = poly.length;
  for(let i=0;i<n;i++){
    const A = poly[i], B = poly[(i+1)%n];
    let a = slabT(A)-d, b = slabT(B)-d;
    if(!above){ a=-a; b=-b; }
    if(a >= 0) out.push(A);
    if((a>=0) !== (b>=0)){
      const t = a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, A.y+(B.y-A.y)*t, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}
function fillBanded(poly, dimC, litC){
  fillPoly(poly, dimC);
  let lo=1e9, hi=-1e9;
  for(const p of poly){ const t=slabT(p); if(t<lo) lo=t; if(t>hi) hi=t; }
  for(const s of slabsIn(lo,hi)){
    let piece = clipHalf(poly, s[0], true);
    if(piece.length < 3) continue;
    piece = clipHalf(piece, s[1], false);
    if(piece.length >= 3) fillPoly(piece, litC);
  }
}

/* ---------------------------------------------------------------------
   Glow curtain + hot rays, anchored to vertical world lines so they stay
   exactly vertical on screen under any azimuth.
   --------------------------------------------------------------------- */
const GLOW_L = V(-421.6,0, 421.6); // left edge   (design x  100)
const GLOW_R = V( 421.3,0,-421.3); // right edge  (design x 1560)
const GLOW_BOTTOM = 560;           // design y where the curtain dies

/* Three pieces, all measured off the source: a soft bloom in the upper
   left that fades downward, a curtain with a hard left edge that swells
   toward the floor and stops at x=1238, and the bleed past that edge. */
const glowTex = (() => {
  const W=730, H=150, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  const smooth=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
  for(let j=0;j<H;j++){
    const v = j/(H-1), y = v*GLOW_BOTTOM;
    const tail = 1 - smooth(0.67, 0.95, v);
    const fall = Math.exp(-Math.pow(y/140, 3));
    for(let i=0;i<W;i++){
      const u = i/(W-1), x = 100 + u*1460;
      const bloom = 23*Math.exp(-Math.pow((x-412)/105, 2))*fall;
      const curtain = smooth(405,435,x) * (
                        Math.max(0, 0.026*(x-450)) +
                        (68 + 0.09*Math.max(0, x-820))*v ) * tail;
      const bleed   = 30*Math.exp(-Math.pow((x-1243)/85, 2))
                        *Math.exp(-Math.pow((y-350)/145, 2));
      const k = smooth(1234, 1244, x);          // the slab's own edge
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=190; d[o+2]=130;
      d[o+3]=Math.min(255, Math.round(1.22*(bloom + curtain*(1-k) + bleed*k)));
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

/* one shared halo field: triangular across, eased in from the top */
const haloTex = (() => {
  const W=48, H=192, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  for(let j=0;j<H;j++){
    const v=j/(H-1);
    const vp = v<0.3 ? 0.45+0.55*(v/0.3) : Math.max(0, 1-(v-0.3)/0.7);
    for(let i=0;i<W;i++){
      const u=i/(W-1), bell=1-Math.abs(2*u-1);
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=175; d[o+2]=95;
      d[o+3]=Math.round(255*bell*bell*vp);
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

const RAYS = [   /* design x, core width, peak alpha, design y where it dies */
  { X:-857, Z:-500, w:3.4, a:0.20, fade:300, hw:18, ha:0.035 }, // design x  520
  { X:  51, Z: 200, w:3.6, a:0.62, fade:470, hw:62, ha:0.20 },  // design x  701
  { X: -91, Z:-300, w:3.4, a:0.42, fade:560, hw:22, ha:0.05 },  // design x 1011
  { X:-131, Z:-600, w:3.4, a:0.34, fade:560, hw:22, ha:0.03 },  // design x 1236
];
let drift = 0;

function drawCurtain(t){
  const xL = px(V(GLOW_L.x+drift,0,GLOW_L.z));
  const xR = px(V(GLOW_R.x+drift,0,GLOW_R.z));
  const yB = dY(GLOW_BOTTOM), y0 = dY(0);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if(xR > xL){
    ctx.drawImage(glowTex, xL, y0, xR-xL, yB-y0);
    /* the shafts fall from off-screen: repeat the top row above the frame */
    if(y0 > 0) ctx.drawImage(glowTex, 0,0, glowTex.width,1, xL, 0, xR-xL, y0);
  }
  for(let i=0;i<RAYS.length;i++){
    const r  = RAYS[i];
    const x  = px(V(r.X+drift,0,r.Z));
    const hw = r.w*0.5*cam.sc, HW = r.hw*cam.sc;
    const yF = dY(r.fade);
    const flick = 1 + 0.09*Math.sin((11+i)*W0*t) + 0.05*Math.sin((23+2*i)*W0*t);
    ctx.globalAlpha = r.ha*flick;
    ctx.drawImage(haloTex, x-HW, y0, HW*2, yF-y0);
    if(y0 > 0) ctx.drawImage(haloTex, 0,0, haloTex.width,1, x-HW, 0, HW*2, y0);
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, y0, 0, yF);
    g.addColorStop(0,    \`rgba(255,206,150,\${r.a*flick})\`);
    g.addColorStop(0.35, \`rgba(255,196,132,\${r.a*0.62*flick})\`);
    g.addColorStop(1,    'rgba(255,190,125,0)');
    ctx.fillStyle = g; ctx.fillRect(x-hw, 0, hw*2, yF);
  }
  ctx.restore();
}

/* the curtain bleeding faintly over the solids */
function drawBleed(){
  const xL=px(V(GLOW_L.x+drift,0,GLOW_L.z)), xR=px(V(GLOW_R.x+drift,0,GLOW_R.z));
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=0.09;
  if(xR>xL) ctx.drawImage(glowTex, xL, dY(0), xR-xL, dY(GLOW_BOTTOM)-dY(0));
  ctx.restore();
}

/* ---------------------------------------------------------------------
   Ground shadows (hard-edged, illustration style)
   --------------------------------------------------------------------- */
const LIGHT  = V(-0.17, 1, 0.17);
const shadowOf = p => V(p.x - LIGHT.x*p.y/LIGHT.y, 0.6, p.z - LIGHT.z*p.y/LIGHT.y);
function hullFill(pts, color){
  if(pts.length<3) return;
  const P = pts.map(p=>[px(p),py(p)]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[],up=[];
  for(const p of P){ while(lo.length>=2 && cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); }
  for(let i=P.length-1;i>=0;i--){ const p=P[i]; while(up.length>=2 && cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); }
  lo.pop(); up.pop();
  const Hl=lo.concat(up); if(Hl.length<3) return;
  ctx.beginPath(); ctx.moveTo(Hl[0][0],Hl[0][1]);
  for(let i=1;i<Hl.length;i++) ctx.lineTo(Hl[i][0],Hl[i][1]);
  ctx.closePath(); ctx.fillStyle=color; ctx.fill();
}
/* the convex ground shadow of a set of world points */
function castHull(pts){ hullFill(pts.map(shadowOf), CAST); }
/* the ground shadow of an upright box */
function boxShadow(cx, cz, hx, hz, y0, y1, rot){
  const p=[];
  for(const y of [y0,y1]) for(const q of roundedRing(cx,cz,hx,hz,Math.min(hx,hz)*0.25,y,rot,3)) p.push(q);
  castHull(p);
}
/* the ground shadow of an upright cylinder */
function columnShadow(cx, cz, r, y0, y1){
  const p=[];
  for(const y of [y0,y1]) for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;
    p.push(V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r));
  }
  castHull(p);
}

/* ---------------------------------------------------------------------
   Extruded rounded plates and upright cylinders
   --------------------------------------------------------------------- */
function localPoint(cx,cz,rot,x,y,z){
  const co=Math.cos(rot), si=Math.sin(rot);
  return V(cx+x*co+z*si, y, cz-x*si+z*co);
}
function roundedRing(cx,cz,hx,hz,r,y,rot,segments=6){
  const pts=[];
  for(const [sx,sz,a0] of [[1,1,0],[-1,1,Math.PI/2],[-1,-1,Math.PI],[1,-1,Math.PI*1.5]]){
    const ox=sx*(hx-r), oz=sz*(hz-r);
    for(let i=0;i<=segments;i++){
      const a=a0+i/segments*Math.PI/2;
      pts.push(localPoint(cx,cz,rot,ox+Math.cos(a)*r,y,oz+Math.sin(a)*r));
    }
  }
  return pts;
}
function drawRoundedSlab(cx,cz,hx,hz,r,y0,y1,rot,topDim,topLit,side=DEEP,outline=LIT){
  const top=roundedRing(cx,cz,hx,hz,r,y1,rot), bot=roundedRing(cx,cz,hx,hz,r,y0,rot);
  for(let i=0;i<top.length;i++){
    const j=(i+1)%top.length, q=[top[i],top[j],bot[j],bot[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(top, topDim, topLit);
  if(outline) strokeLoop(top, outline, Math.max(1,1.35*cam.sc));
}
/* an upright cylinder: the rounded plate with both half-widths equal */
function drawColumn(cx,cz,r,y0,y1,topDim,topLit,side=DEEP,outline=LIT){
  drawRoundedSlab(cx,cz,r,r,r,y0,y1,0,topDim,topLit,side,outline);
}
/* milled slots over the camera-facing arc of an upright cylinder */
function drawSlots(cx,cz,r,y0,y1,spin,count,color=SLOT){
  const psi=Math.atan2(cam.C.z, cam.C.x);
  const pitch=Math.PI*2/count, hwA=pitch*0.24;
  const pt=(a,y)=>V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r);
  ctx.fillStyle=color; ctx.beginPath();
  for(let i=0;i<count;i++){
    const a=i*pitch + spin;
    const rel=((a-psi)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;
    if(Math.abs(rel)>Math.PI/2-hwA) continue;
    const q=[pt(a-hwA,y1),pt(a+hwA,y1),pt(a+hwA,y0),pt(a-hwA,y0)];
    ctx.moveTo(px(q[0]),py(q[0]));
    for(let k=1;k<4;k++) ctx.lineTo(px(q[k]),py(q[k]));
    ctx.closePath();
  }
  ctx.fill();
}
/* a circle standing in the plane that faces along the local z axis */
function verticalEllipse(cx,cz,rot,z,cy,rx,ry,segments=44){
  const pts=[];
  for(let i=0;i<segments;i++){
    const a=i/segments*Math.PI*2;
    pts.push(localPoint(cx,cz,rot,Math.cos(a)*rx,cy+Math.sin(a)*ry,z));
  }
  return pts;
}
function drawLensBand(cx,cz,rot,z0,z1,cy,rx,ry,frontDim,frontLit,side=DEEP,outline=LIT){
  const back=verticalEllipse(cx,cz,rot,z0,cy,rx,ry);
  const front=verticalEllipse(cx,cz,rot,z1,cy,rx,ry);
  for(let i=0;i<front.length;i++){
    const j=(i+1)%front.length, q=[front[i],front[j],back[j],back[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(front, frontDim, frontLit);
  if(outline) strokeLoop(front, outline, Math.max(1,1.35*cam.sc));
}

/* ---------------------------------------------------------------------
   Tubes — a frustum between any two points, silhouetted against the
   camera the way the mail scene's pen is
   --------------------------------------------------------------------- */
function tubeBasis(A,B){
  const d=V(B.x-A.x, B.y-A.y, B.z-A.z);
  const L=Math.hypot(d.x,d.y,d.z)||1e-6;
  const u=V(d.x/L, d.y/L, d.z/L);
  const ref=Math.abs(u.y)>0.9 ? V(1,0,0) : V(0,1,0);
  const c1=V(u.y*ref.z-u.z*ref.y, u.z*ref.x-u.x*ref.z, u.x*ref.y-u.y*ref.x);
  const l1=Math.hypot(c1.x,c1.y,c1.z)||1e-6;
  const e1=V(c1.x/l1, c1.y/l1, c1.z/l1);
  const e2=V(u.y*e1.z-u.z*e1.y, u.z*e1.x-u.x*e1.z, u.x*e1.y-u.y*e1.x);
  return { u, e1, e2 };
}
function ringAt(P,b,r,a){
  const c=Math.cos(a), s=Math.sin(a);
  return V(P.x+(c*b.e1.x+s*b.e2.x)*r, P.y+(c*b.e1.y+s*b.e2.y)*r, P.z+(c*b.e1.z+s*b.e2.z)*r);
}
function facingAngle(b){
  let best=0, bd=-2;
  for(let i=0;i<72;i++){
    const a=i/72*Math.PI*2, c=Math.cos(a), s=Math.sin(a);
    const d=dot(V(c*b.e1.x+s*b.e2.x, c*b.e1.y+s*b.e2.y, c*b.e1.z+s*b.e2.z), cam.C);
    if(d>bd){ bd=d; best=a; }
  }
  return best;
}
function drawTube(A,B,rA,rB,dimC,litC,outline){
  const b=tubeBasis(A,B), c=facingAngle(b), a0=c-Math.PI/2, a1=c+Math.PI/2, N=24;
  const poly=[];
  for(let i=0;i<=N;i++) poly.push(ringAt(A,b,rA,a0+(a1-a0)*i/N));
  for(let i=N;i>=0;i--) poly.push(ringAt(B,b,rB,a0+(a1-a0)*i/N));
  if(litC) fillBanded(poly, dimC, litC); else fillPoly(poly, dimC);
  if(outline) strokeLoop(poly, outline, Math.max(1,1.25*cam.sc));
  return b;
}
/* the flat end of a tube; sign is +1 at B and -1 at A */
function tubeCap(P,b,r,sign,color,outline){
  if(dot(V(b.u.x*sign, b.u.y*sign, b.u.z*sign), cam.C) <= 0) return;
  const disc=[];
  for(let i=0;i<32;i++) disc.push(ringAt(P,b,r,i/32*Math.PI*2));
  fillPoly(disc, color);
  if(outline) strokeLoop(disc, outline, Math.max(1,1.2*cam.sc));
}
/* a tube bent through a list of points */
function drawTubeChain(pts,r,dimC,litC,outline){
  for(let i=0;i<pts.length-1;i++) drawTube(pts[i], pts[i+1], r, r, dimC, litC, outline);
}

/* =====================================================================
   Pointer
   ===================================================================== */
const ptr = { on:false, sx:0, sy:0, nx:0, ny:0 };
function pointerAt(e){
  const r = cv.getBoundingClientRect();
  ptr.sx = e.clientX - r.left; ptr.sy = e.clientY - r.top;
  ptr.nx = clamp(ptr.sx/Math.max(1,r.width) *2-1, -1, 1);
  ptr.ny = clamp(ptr.sy/Math.max(1,r.height)*2-1, -1, 1);
  ptr.on = true;
}
cv.addEventListener('pointermove', pointerAt, {passive:true});
cv.addEventListener('pointerdown', pointerAt, {passive:true});
cv.addEventListener('pointerleave', ()=>{ ptr.on=false; });
cv.addEventListener('pointercancel', ()=>{ ptr.on=false; });
cv.addEventListener('pointerup', e=>{ if(e.pointerType!=='mouse') ptr.on=false; });

/* =====================================================================
   Frame loop
   ===================================================================== */
let canvasW=0, canvasH=0, DPR=1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  canvasW = cv.clientWidth; canvasH = cv.clientHeight;
  cv.width = Math.round(canvasW*DPR); cv.height = Math.round(canvasH*DPR);
}
window.addEventListener('resize', resize);
resize();

const lin  = (t,a,b)=>clamp((t-a)/(b-a), 0, 1);
const ease = t=>t*t*(3-2*t);
const back = t=>{ const c=2.2, u=t-1; return 1 + (c+1)*u*u*u + c*u*u; };

/* A scene declares the world boxes it lives in, then draws into the stage:
   { bounds, curY, step(dt,t,cur), shadows(t,cur), items(t,cur), over(t,cur) }
   One box per object keeps the projected footprint tight; a single box
   around a spread-out composition would measure mostly empty floor. */
function run(scene){
  let bx0=1e9, bx1=-1e9, by0=1e9, by1=-1e9;
  for(const box of scene.bounds)
    for(const x of box.x) for(const y of box.y) for(const z of box.z){
      const dx = 0.8660254*(x - z), dy = 0.5*(x + z) - y;   // the rest pose
      if(dx<bx0) bx0=dx; if(dx>bx1) bx1=dx;
      if(dy<by0) by0=dy; if(dy>by1) by1=dy;
    }
  const FIT = Math.min(FIT_W/(bx1-bx0), FIT_H/(by1-by0));
  const CX = (bx0+bx1)/2, CY = (by0+by1)/2;
  const curY = scene.curY === undefined ? 24 : scene.curY;

  const T0 = performance.now();
  let prev = T0, orbMix = 0, orbX = 0, orbY = 0;

  function frame(now){
    const dt = clamp((now-prev)/1000, 0, 1/30); prev = now;
    const t  = STILL ? 0 : ((now-T0)/1000) % LOOP;
    if(cv.clientWidth!==canvasW || cv.clientHeight!==canvasH) resize();
    ctx.setTransform(DPR,0,0,DPR,0,0);

    const A   = STILL ? 0 : 1;
    const osc = (k, amp) => A*amp*Math.sin(k*W0*t);

    /* --- camera: idle loop, handed over to the pointer while it hovers --- */
    const want = (ptr.on && !STILL) ? 1 : 0;
    orbMix += (want - orbMix)*Math.min(1, dt*2.6);
    orbX   += ((ptr.on&&!STILL ? ptr.nx : 0) - orbX)*Math.min(1, dt*4.5);
    orbY   += ((ptr.on&&!STILL ? ptr.ny : 0) - orbY)*Math.min(1, dt*4.5);
    const az = Math.PI/4 + (1-orbMix)*(osc(1,0.30) + osc(2,0.05)) + orbX*0.50;
    const el = clamp(0.61548 + (1-orbMix)*(osc(2,0.060) + osc(3,0.018)) - orbY*0.19,
                     0.40, 0.94);
    const scale = Math.min(canvasW/DW, canvasH/DH)*ZOOM*FIT*PROJ_S;
    setCamera(az, el, scale,
              canvasW*0.5 - CX*scale/PROJ_S,
              canvasH*0.5 - CY*scale/PROJ_S);

    slabPhase = osc(1, 40);
    drift     = osc(2, 46);

    const cur = (ptr.on && !STILL) ? planeAt(ptr.sx, ptr.sy, curY) : null;
    if(scene.step) scene.step(dt, t, cur, osc);

    ctx.fillStyle = BG; ctx.fillRect(0,0,canvasW,canvasH);
    drawCurtain(t);
    if(scene.shadows) scene.shadows(t, cur, osc);
    const items = scene.items(t, cur, osc);
    items.sort((a,b)=>a.d-b.d);
    for(const it of items) it.f();
    if(scene.over) scene.over(t, cur, osc);
    drawBleed();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Microphone — a large-diaphragm condenser hung in its yoke behind a mesh
   pop filter, cabled across the floor to a desk console, with a monitor
   speaker standing off to the side.  The grille turns, the console's
   meter climbs, the woofer breathes and the capsule badge wakes when the
   pointer comes close; the stage owns the camera, the light and framing.

   The yoke stands on the 45 degree axis, so its arms, its pivots and the
   pop filter face the rest camera squarely instead of hiding inside the
   capsule's own silhouette. */

const MIC  = { x:40, z:60, r:56, rot:Math.PI/4 };
const POP  = { ax:-70, az:170, ro:100, ri:84 };
const SPK  = { x:-380, z:120, rot:Math.PI/4, hx:110, hz:70, h:220 };
const DESK = { x:400, z:-60, rot:-0.22, hx:145, hz:96 };

const yoke = (lx, y, lz) => localPoint(MIC.x, MIC.z, MIC.rot, lx, y, lz);
/* The cable leaves its connector under the capsule's rim, drops past the
   yoke clear of the base, then crosses the floor into the console. */
const CABLE = [
  yoke(30, 176, 44), yoke(46, 140, 62), yoke(56, 96, 78),
  yoke(60, 46, 92), yoke(58, 12, 104),
  V(214, 9, 96), V(262, 9, 62), V(288, 9, 18), V(272, 9, -26),
];
/* the first turns of the drop ride the capsule's own bob */
const cablePath = (bob) => CABLE.map((p, i) =>
  V(p.x, p.y + bob*Math.max(0, 1 - i*0.28), p.z));
const CAP_Y = 256;                       // the capsule's centre
const POP_XZ = yoke(POP.ax, 0, POP.az);
/* the filter hangs level with the capsule on screen: its own height pays
   back the half of (dx + dz) that swinging it forward costs */
const POP_Y = CAP_Y + 0.5*((POP_XZ.x-MIC.x) + (POP_XZ.z-MIC.z));

let listen = 0;          // how awake the microphone is, 0..1
let grille = 0;          // the grille's own slow turn

function fillRing(outer, inner, color){
  ctx.beginPath();
  ctx.moveTo(px(outer[0]), py(outer[0]));
  for(let i=1;i<outer.length;i++) ctx.lineTo(px(outer[i]), py(outer[i]));
  ctx.closePath();
  ctx.moveTo(px(inner[0]), py(inner[0]));
  for(let i=inner.length-1;i>=0;i--) ctx.lineTo(px(inner[i]), py(inner[i]));
  ctx.closePath();
  ctx.fillStyle=color; ctx.fill('evenodd');
}
/* a circle standing in a panel, offset sideways inside that panel */
function panelDisc(base, rot, lx, lz, cy, r){
  return verticalEllipse(base.x, base.z, rot, lz, cy, r, r)
    .map(p=>V(p.x+lx*Math.cos(rot), p.y, p.z-lx*Math.sin(rot)));
}

function drawStand(bob){
  drawColumn(MIC.x, MIC.z, 90, 0, 18+bob, DIM, LIT, DEEP, LIT);
  const inset=[];
  for(let i=0;i<48;i++){
    const a=i/48*Math.PI*2;
    inset.push(V(MIC.x+Math.cos(a)*64, 18.6+bob, MIC.z+Math.sin(a)*64));
  }
  strokeLoop(inset, 'rgba(38,14,2,0.8)', Math.max(1,1.7*cam.sc));
  drawColumn(MIC.x, MIC.z, 20, 18+bob, 150+bob, DIM, LIT, DEEP, LIT);
  drawRoundedSlab(MIC.x, MIC.z, 88, 13, 11, 134+bob, 150+bob, MIC.rot, DEEP, DIM, INK, LIT);
  for(const s of [-1,1]){
    const arm=yoke(s*88, 0, 0);
    drawRoundedSlab(arm.x, arm.z, 11, 15, 8, 150+bob, 300+bob, MIC.rot, DIM, LIT, DEEP, LIT);
    const A=yoke(s*88, 286+bob, 0), B=yoke(s*(MIC.r+2), 286+bob, 0);
    tubeCap(A, drawTube(A, B, 12, 12, DEEP, DIM, LIT), 12, -1, DIM, LIT);
  }
}

function drawCapsule(bob){
  const y0=166+bob, y1=330+bob;
  drawColumn(MIC.x, MIC.z, MIC.r+5, y0, y0+16, DEEP, DIM, INK, LIT);
  drawColumn(MIC.x, MIC.z, MIC.r, y0+16, y1, DIM, LIT, LIT, LIT);
  drawSlots(MIC.x, MIC.z, MIC.r, y0+30, y1-12, grille, 36,
            listen>0.35 ? 'rgba(96,38,3,0.42)' : SLOT);
  drawColumn(MIC.x, MIC.z, MIC.r-4, y1, y1+12, EDGE, WHITE, DIM, LIT);
  const badge=yoke(0, y0+8, MIC.r+5);
  ctx.beginPath(); ctx.arc(px(badge), py(badge), Math.max(1.5, 4.2*cam.sc), 0, Math.PI*2);
  ctx.fillStyle=listen>0.35 ? WHITE : DIM; ctx.fill();
}

function drawPop(t, bob){
  const sway=STILL ? 0 : 2.6*Math.sin(2*W0*t);
  const cy=POP_Y+bob+sway;
  drawTubeChain([
    yoke(0, 150+bob, 22), yoke(-26, 178+bob, 78),
    yoke(-52, 226+bob, 130), yoke(POP.ax, cy-POP.ro+12, POP.az-10),
  ], 3, DEEP, DIM, LIT);
  const O=panelDisc(MIC, MIC.rot, POP.ax, POP.az, cy, POP.ro);
  const I=panelDisc(MIC, MIC.rot, POP.ax, POP.az, cy, POP.ri);
  fillPoly(I, 'rgba(120,56,10,0.30)');
  for(let i=-2;i<=2;i++){                       // the weave, read as chords
    const dy=i*POP.ri*0.36, half=Math.sqrt(Math.max(0, POP.ri*POP.ri-dy*dy));
    strokeSeg(yoke(POP.ax-half, cy+dy, POP.az), yoke(POP.ax+half, cy+dy, POP.az),
              'rgba(255,150,60,0.20)', Math.max(1, 1.2*cam.sc));
  }
  fillRing(O, I, DIM);
  strokeLoop(O, LIT, Math.max(1, 2.2*cam.sc));
  strokeLoop(I, 'rgba(38,14,2,0.7)', Math.max(1, 1.4*cam.sc));
}

/* the monitor: a sealed cabinet with a woofer that breathes with the room */
function drawSpeaker(t){
  const P=(lx,y,lz)=>localPoint(SPK.x, SPK.z, SPK.rot, lx, y, lz);
  drawRoundedSlab(SPK.x, SPK.z, SPK.hx, SPK.hz, 12, 0, SPK.h, SPK.rot, DIM, LIT, DEEP, LIT);
  const face=[P(-SPK.hx, 2, SPK.hz+1), P(SPK.hx, 2, SPK.hz+1),
              P(SPK.hx, SPK.h, SPK.hz+1), P(-SPK.hx, SPK.h, SPK.hz+1)];
  fillBanded(face, DEEP, DIM);
  strokeLoop(face, LIT, Math.max(1, 1.5*cam.sc));
  const pulse=STILL ? 0 : (0.5+0.5*Math.sin(5*W0*t))*(0.35+0.65*listen);
  const woof=panelDisc(SPK, SPK.rot, 0, SPK.hz+2, 84, 62);
  fillBanded(woof, DEEP, DIM);
  strokeLoop(woof, LIT, Math.max(1, 1.8*cam.sc));
  const cone=panelDisc(SPK, SPK.rot, 0, SPK.hz+3, 84, 30+pulse*4);
  fillBanded(cone, DIM, LIT);
  const capD=panelDisc(SPK, SPK.rot, 0, SPK.hz+4, 84, 13);
  fillPoly(capD, WHITE);
  const tweet=panelDisc(SPK, SPK.rot, 0, SPK.hz+2, 176, 26);
  fillBanded(tweet, DEEP, DIM);
  strokeLoop(tweet, LIT, Math.max(1, 1.4*cam.sc));
  fillPoly(panelDisc(SPK, SPK.rot, 0, SPK.hz+3, 176, 11), WHITE);
  fillPoly([P(-42, 24, SPK.hz+2), P(42, 24, SPK.hz+2),
            P(42, 32, SPK.hz+2), P(-42, 32, SPK.hz+2)], LIT);
}

/* the desk console: a gain knob, a pad knob and a six-segment meter */
function meterLevel(i, t){
  const wave=STILL ? 0.3 : 0.5+0.5*Math.sin((4+i)*W0*t + i*0.8);
  return Math.max(wave*0.55, listen*0.95) > (i+0.6)/6;
}
function drawDesk(t){
  const P=(lx,lz,y)=>localPoint(DESK.x, DESK.z, DESK.rot, lx, y, lz);
  drawRoundedSlab(DESK.x, DESK.z, DESK.hx, DESK.hz, 22, 0, 30, DESK.rot, DIM, LIT, DEEP, LIT);
  const gain=P(-70, 22, 0), pad=P(6, 42, 0);
  drawColumn(gain.x, gain.z, 40, 30, 64, DEEP, DIM, INK, LIT);
  drawColumn(pad.x, pad.z, 23, 30, 52, DEEP, DIM, INK, LIT);
  const turn=(STILL ? 0.6 : 0.6+0.9*Math.sin(W0*t*2))*0.9 + listen*1.6;
  for(const [k, r, y] of [[gain, 34, 64.6], [pad, 18, 52.6]]){
    strokeSeg(V(k.x, y, k.z), V(k.x+Math.cos(turn)*r, y, k.z+Math.sin(turn)*r),
              LIT, Math.max(1, 2.4*cam.sc));
  }
  for(let i=0;i<6;i++){
    const led=P(44+i*17, -56, 0), on=meterLevel(i, t);
    drawRoundedSlab(led.x, led.z, 7, 15, 3, 30, 36, DESK.rot,
                    on?DIM:DEEP, on?WHITE:DIM, DEEP, on?LIT:DEEP);
  }
}

run({
  bounds: [
    { x:[-507, -253], y:[  0, 220], z:[  -7, 247] },   // the monitor
    { x:[ -50,  130], y:[  0, 342], z:[ -30, 150] },   // the stand and capsule
    { x:[  40,  182], y:[276, 476], z:[ 159, 301] },   // the pop filter
    { x:[ 229,  571], y:[  0,  66], z:[-178,  58] },   // the desk console
  ],
  curY: 60,
  step(dt, t, cur){
    const near=cur ? Math.max(0, 1-Math.hypot(MIC.x-cur.x, MIC.z-cur.z)/260) : 0;
    listen += (near - listen)*Math.min(1, dt*3.2);
    grille = STILL ? 0 : 0.5*Math.sin(W0*t) + listen*0.5*Math.sin(6*W0*t);
  },
  shadows(){
    boxShadow(SPK.x, SPK.z, SPK.hx, SPK.hz, 0, SPK.h, SPK.rot);
    columnShadow(MIC.x, MIC.z, 90, 0, 18);
    columnShadow(MIC.x, MIC.z, MIC.r, 166, 330);
    boxShadow(DESK.x, DESK.z, DESK.hx, DESK.hz, 0, 30, DESK.rot);
  },
  items(t){
    const bob=STILL ? 0 : 1.6*Math.sin(3*W0*t);
    return [
      { d: depth(V(SPK.x, 110, SPK.z)),  f: ()=>drawSpeaker(t) },
      { d: depth(V(MIC.x, 170, MIC.z)),  f: ()=>{
          drawStand(bob); drawCapsule(bob);
          drawTubeChain(cablePath(bob), 2.5, DEEP, DIM, LIT);
        } },
      { d: depth(V(POP_XZ.x, POP_Y, POP_XZ.z)), f: ()=>drawPop(t, bob) },
      { d: depth(V(DESK.x, 30, DESK.z)), f: ()=>drawDesk(t) },
    ];
  },
});
})();
<\/script>
</body>
</html>
`,m=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Isometric Notepad — Light Shafts</title>
<style>
  html,body{margin:0;height:100%;background:#140f0b;overflow:hidden}
  canvas{display:block;width:100vw;height:100vh;touch-action:none;cursor:crosshair}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
(() => {
'use strict';

/* =====================================================================
   Shared stage for the light-shaft variants.

   The camera basis, the vertical light slabs, the glow curtain and the
   hot rays are the mail document's, carried over line for line so every
   variant stands in the same room under the same light.  A scene file
   adds its own geometry and hands run() the world box it lives in; the
   stage fits that box into the footprint the mail composition occupies
   inside the 1500x750 design frame, so the zoom and the subject size
   stay consistent from one variant to the next.
   ===================================================================== */

const cv  = document.getElementById('c');
const ctx = cv.getContext('2d');

const Q       = new URLSearchParams(location.search);
const REDUCED = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STILL   = Q.has('still') || REDUCED;  // t=0 is exactly the rest frame

const LOOP = 40;
const W0   = 2*Math.PI/LOOP;
const ZOOM = 0.86;

/* ---------- design frame (the source illustration is 1500x750) -------- */
const DW = 1500, DH = 750;
const PROJ_S = Math.sqrt(1.5);           // makes the rest pose read 0.866 / 0.5

/* the mail composition's own projected footprint, in design px: every
   variant is fitted into this box so they all read at the same size */
const FIT_W = 999, FIT_H = 619;

/* ---------- palette --------------------------------------------------- */
const LIT   = '#ff7a0f';
const DIM   = '#9c4709';
const DEEP  = '#562a08';
const INK   = '#17110c';
const WHITE = '#ffffff';
const PAPER = '#f4ece2';                 // the unlit side of white paper
const EDGE  = '#cbab8b';                 // paper and plastic edges
const BG    = '#140f0b';
const SLOT  = 'rgba(46,12,0,0.62)';
const CAST  = 'rgba(80,30,6,0.30)';

/* ---------- vec3 ------------------------------------------------------ */
const V   = (x,y,z)=>({x,y,z});
const dot = (a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const clamp = (v,a,b)=>v<a?a:(v>b?b:v);
const mix = (a,b,t)=>a+(b-a)*t;

/* ---------- camera ---------------------------------------------------- */
const cam = { R:V(1,0,0), U:V(0,1,0), C:V(0,0,1), S:1, ox:0, oy:0, sc:1 };

function setCamera(az, el, scale, ox, oy){
  const ce = Math.cos(el), se = Math.sin(el);
  const C  = V(ce*Math.sin(az), se, ce*Math.cos(az));
  const f  = V(-C.x, -C.y, -C.z);
  const R  = V(-f.z, 0, f.x);
  const rl = Math.hypot(R.x, R.z); R.x/=rl; R.z/=rl;
  const U  = V(-R.z*f.y, R.z*f.x - R.x*f.z, R.x*f.y);
  cam.R=R; cam.U=U; cam.C=C; cam.S=scale; cam.ox=ox; cam.oy=oy;
  cam.sc = scale/PROJ_S;                 // design px -> canvas px
}
const px = p => (p.x*cam.R.x + p.y*cam.R.y + p.z*cam.R.z)*cam.S + cam.ox;
const py = p => -(p.x*cam.U.x + p.y*cam.U.y + p.z*cam.U.z)*cam.S + cam.oy;
const depth = p => dot(p, cam.C);
const dY = y => canvasH*0.5 + (y - DH*0.5)*cam.sc;   // design Y -> canvas Y

/* screen point -> world XZ on the horizontal plane at height h */
function planeAt(sx, sy, h){
  const u = (sx-cam.ox)/cam.S;
  const w = -(sy-cam.oy)/cam.S - h*cam.U.y;
  const det = cam.R.x*cam.U.z - cam.R.z*cam.U.x;
  if(Math.abs(det) < 1e-6) return null;
  return { x:( cam.U.z*u - cam.R.z*w)/det,
           z:(-cam.U.x*u + cam.R.x*w)/det };
}

/* ---------- path helpers ---------------------------------------------- */
function tracePoly(pts){
  if(pts.length < 3) return false;
  ctx.beginPath();
  ctx.moveTo(px(pts[0]), py(pts[0]));
  for(let i=1;i<pts.length;i++) ctx.lineTo(px(pts[i]), py(pts[i]));
  ctx.closePath();
  return true;
}
function fillPoly(pts, color){ if(tracePoly(pts)){ ctx.fillStyle = color; ctx.fill(); } }
function strokeSeg(a,b,color,w){
  ctx.beginPath(); ctx.moveTo(px(a),py(a)); ctx.lineTo(px(b),py(b));
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
}
function strokeLoop(pts,color,w){
  if(!tracePoly(pts)) return;
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin='round'; ctx.stroke();
}
function normalOf(p){                     // Newell, for back-face culling
  let nx=0,ny=0,nz=0;
  for(let i=0;i<p.length;i++){
    const a=p[i], b=p[(i+1)%p.length];
    nx += (a.y-b.y)*(a.z+b.z);
    ny += (a.z-b.z)*(a.x+b.x);
    nz += (a.x-b.x)*(a.y+b.y);
  }
  return V(nx,ny,nz);
}
/* keep only the part of a polygon at or above a horizontal plane */
function clipAbove(poly, yMin){
  const out=[], n=poly.length;
  for(let i=0;i<n;i++){
    const A=poly[i], B=poly[(i+1)%n];
    const a=A.y-yMin, b=B.y-yMin;
    if(a>=0) out.push(A);
    if((a>=0)!==(b>=0)){
      const t=a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, yMin, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}

/* =====================================================================
   Light slabs — vertical prisms of light standing in the world.  A point
   is lit when n·p lands inside one of them.  Period 192: lit 32, gap 32,
   lit 64, gap 64 — read straight off the source illustration.
   ===================================================================== */
const SLAB_N = V(0.836, 0, -0.549);
const SLAB_P = 192;
let slabPhase = 0;
const slabT = p => dot(p, SLAB_N);
function slabsIn(tmin, tmax){
  const out = [];
  const k0 = Math.floor((tmin-slabPhase)/SLAB_P) - 1;
  const k1 = Math.ceil((tmax-slabPhase)/SLAB_P) + 1;
  for(let k=k0;k<=k1;k++){
    out.push([SLAB_P*k - 64 + slabPhase, SLAB_P*k - 32 + slabPhase]);
    out.push([SLAB_P*k      + slabPhase, SLAB_P*k + 64 + slabPhase]);
  }
  return out;
}
function clipHalf(poly, d, above){
  const out = [], n = poly.length;
  for(let i=0;i<n;i++){
    const A = poly[i], B = poly[(i+1)%n];
    let a = slabT(A)-d, b = slabT(B)-d;
    if(!above){ a=-a; b=-b; }
    if(a >= 0) out.push(A);
    if((a>=0) !== (b>=0)){
      const t = a/(a-b);
      out.push(V(A.x+(B.x-A.x)*t, A.y+(B.y-A.y)*t, A.z+(B.z-A.z)*t));
    }
  }
  return out;
}
function fillBanded(poly, dimC, litC){
  fillPoly(poly, dimC);
  let lo=1e9, hi=-1e9;
  for(const p of poly){ const t=slabT(p); if(t<lo) lo=t; if(t>hi) hi=t; }
  for(const s of slabsIn(lo,hi)){
    let piece = clipHalf(poly, s[0], true);
    if(piece.length < 3) continue;
    piece = clipHalf(piece, s[1], false);
    if(piece.length >= 3) fillPoly(piece, litC);
  }
}

/* ---------------------------------------------------------------------
   Glow curtain + hot rays, anchored to vertical world lines so they stay
   exactly vertical on screen under any azimuth.
   --------------------------------------------------------------------- */
const GLOW_L = V(-421.6,0, 421.6); // left edge   (design x  100)
const GLOW_R = V( 421.3,0,-421.3); // right edge  (design x 1560)
const GLOW_BOTTOM = 560;           // design y where the curtain dies

/* Three pieces, all measured off the source: a soft bloom in the upper
   left that fades downward, a curtain with a hard left edge that swells
   toward the floor and stops at x=1238, and the bleed past that edge. */
const glowTex = (() => {
  const W=730, H=150, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  const smooth=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
  for(let j=0;j<H;j++){
    const v = j/(H-1), y = v*GLOW_BOTTOM;
    const tail = 1 - smooth(0.67, 0.95, v);
    const fall = Math.exp(-Math.pow(y/140, 3));
    for(let i=0;i<W;i++){
      const u = i/(W-1), x = 100 + u*1460;
      const bloom = 23*Math.exp(-Math.pow((x-412)/105, 2))*fall;
      const curtain = smooth(405,435,x) * (
                        Math.max(0, 0.026*(x-450)) +
                        (68 + 0.09*Math.max(0, x-820))*v ) * tail;
      const bleed   = 30*Math.exp(-Math.pow((x-1243)/85, 2))
                        *Math.exp(-Math.pow((y-350)/145, 2));
      const k = smooth(1234, 1244, x);          // the slab's own edge
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=190; d[o+2]=130;
      d[o+3]=Math.min(255, Math.round(1.22*(bloom + curtain*(1-k) + bleed*k)));
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

/* one shared halo field: triangular across, eased in from the top */
const haloTex = (() => {
  const W=48, H=192, c=document.createElement('canvas');
  c.width=W; c.height=H;
  const g=c.getContext('2d'), img=g.createImageData(W,H), d=img.data;
  for(let j=0;j<H;j++){
    const v=j/(H-1);
    const vp = v<0.3 ? 0.45+0.55*(v/0.3) : Math.max(0, 1-(v-0.3)/0.7);
    for(let i=0;i<W;i++){
      const u=i/(W-1), bell=1-Math.abs(2*u-1);
      const o=(j*W+i)*4;
      d[o]=255; d[o+1]=175; d[o+2]=95;
      d[o+3]=Math.round(255*bell*bell*vp);
    }
  }
  g.putImageData(img,0,0);
  return c;
})();

const RAYS = [   /* design x, core width, peak alpha, design y where it dies */
  { X:-857, Z:-500, w:3.4, a:0.20, fade:300, hw:18, ha:0.035 }, // design x  520
  { X:  51, Z: 200, w:3.6, a:0.62, fade:470, hw:62, ha:0.20 },  // design x  701
  { X: -91, Z:-300, w:3.4, a:0.42, fade:560, hw:22, ha:0.05 },  // design x 1011
  { X:-131, Z:-600, w:3.4, a:0.34, fade:560, hw:22, ha:0.03 },  // design x 1236
];
let drift = 0;

function drawCurtain(t){
  const xL = px(V(GLOW_L.x+drift,0,GLOW_L.z));
  const xR = px(V(GLOW_R.x+drift,0,GLOW_R.z));
  const yB = dY(GLOW_BOTTOM), y0 = dY(0);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  if(xR > xL){
    ctx.drawImage(glowTex, xL, y0, xR-xL, yB-y0);
    /* the shafts fall from off-screen: repeat the top row above the frame */
    if(y0 > 0) ctx.drawImage(glowTex, 0,0, glowTex.width,1, xL, 0, xR-xL, y0);
  }
  for(let i=0;i<RAYS.length;i++){
    const r  = RAYS[i];
    const x  = px(V(r.X+drift,0,r.Z));
    const hw = r.w*0.5*cam.sc, HW = r.hw*cam.sc;
    const yF = dY(r.fade);
    const flick = 1 + 0.09*Math.sin((11+i)*W0*t) + 0.05*Math.sin((23+2*i)*W0*t);
    ctx.globalAlpha = r.ha*flick;
    ctx.drawImage(haloTex, x-HW, y0, HW*2, yF-y0);
    if(y0 > 0) ctx.drawImage(haloTex, 0,0, haloTex.width,1, x-HW, 0, HW*2, y0);
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, y0, 0, yF);
    g.addColorStop(0,    \`rgba(255,206,150,\${r.a*flick})\`);
    g.addColorStop(0.35, \`rgba(255,196,132,\${r.a*0.62*flick})\`);
    g.addColorStop(1,    'rgba(255,190,125,0)');
    ctx.fillStyle = g; ctx.fillRect(x-hw, 0, hw*2, yF);
  }
  ctx.restore();
}

/* the curtain bleeding faintly over the solids */
function drawBleed(){
  const xL=px(V(GLOW_L.x+drift,0,GLOW_L.z)), xR=px(V(GLOW_R.x+drift,0,GLOW_R.z));
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=0.09;
  if(xR>xL) ctx.drawImage(glowTex, xL, dY(0), xR-xL, dY(GLOW_BOTTOM)-dY(0));
  ctx.restore();
}

/* ---------------------------------------------------------------------
   Ground shadows (hard-edged, illustration style)
   --------------------------------------------------------------------- */
const LIGHT  = V(-0.17, 1, 0.17);
const shadowOf = p => V(p.x - LIGHT.x*p.y/LIGHT.y, 0.6, p.z - LIGHT.z*p.y/LIGHT.y);
function hullFill(pts, color){
  if(pts.length<3) return;
  const P = pts.map(p=>[px(p),py(p)]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[],up=[];
  for(const p of P){ while(lo.length>=2 && cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); }
  for(let i=P.length-1;i>=0;i--){ const p=P[i]; while(up.length>=2 && cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); }
  lo.pop(); up.pop();
  const Hl=lo.concat(up); if(Hl.length<3) return;
  ctx.beginPath(); ctx.moveTo(Hl[0][0],Hl[0][1]);
  for(let i=1;i<Hl.length;i++) ctx.lineTo(Hl[i][0],Hl[i][1]);
  ctx.closePath(); ctx.fillStyle=color; ctx.fill();
}
/* the convex ground shadow of a set of world points */
function castHull(pts){ hullFill(pts.map(shadowOf), CAST); }
/* the ground shadow of an upright box */
function boxShadow(cx, cz, hx, hz, y0, y1, rot){
  const p=[];
  for(const y of [y0,y1]) for(const q of roundedRing(cx,cz,hx,hz,Math.min(hx,hz)*0.25,y,rot,3)) p.push(q);
  castHull(p);
}
/* the ground shadow of an upright cylinder */
function columnShadow(cx, cz, r, y0, y1){
  const p=[];
  for(const y of [y0,y1]) for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;
    p.push(V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r));
  }
  castHull(p);
}

/* ---------------------------------------------------------------------
   Extruded rounded plates and upright cylinders
   --------------------------------------------------------------------- */
function localPoint(cx,cz,rot,x,y,z){
  const co=Math.cos(rot), si=Math.sin(rot);
  return V(cx+x*co+z*si, y, cz-x*si+z*co);
}
function roundedRing(cx,cz,hx,hz,r,y,rot,segments=6){
  const pts=[];
  for(const [sx,sz,a0] of [[1,1,0],[-1,1,Math.PI/2],[-1,-1,Math.PI],[1,-1,Math.PI*1.5]]){
    const ox=sx*(hx-r), oz=sz*(hz-r);
    for(let i=0;i<=segments;i++){
      const a=a0+i/segments*Math.PI/2;
      pts.push(localPoint(cx,cz,rot,ox+Math.cos(a)*r,y,oz+Math.sin(a)*r));
    }
  }
  return pts;
}
function drawRoundedSlab(cx,cz,hx,hz,r,y0,y1,rot,topDim,topLit,side=DEEP,outline=LIT){
  const top=roundedRing(cx,cz,hx,hz,r,y1,rot), bot=roundedRing(cx,cz,hx,hz,r,y0,rot);
  for(let i=0;i<top.length;i++){
    const j=(i+1)%top.length, q=[top[i],top[j],bot[j],bot[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(top, topDim, topLit);
  if(outline) strokeLoop(top, outline, Math.max(1,1.35*cam.sc));
}
/* an upright cylinder: the rounded plate with both half-widths equal */
function drawColumn(cx,cz,r,y0,y1,topDim,topLit,side=DEEP,outline=LIT){
  drawRoundedSlab(cx,cz,r,r,r,y0,y1,0,topDim,topLit,side,outline);
}
/* milled slots over the camera-facing arc of an upright cylinder */
function drawSlots(cx,cz,r,y0,y1,spin,count,color=SLOT){
  const psi=Math.atan2(cam.C.z, cam.C.x);
  const pitch=Math.PI*2/count, hwA=pitch*0.24;
  const pt=(a,y)=>V(cx+Math.cos(a)*r, y, cz+Math.sin(a)*r);
  ctx.fillStyle=color; ctx.beginPath();
  for(let i=0;i<count;i++){
    const a=i*pitch + spin;
    const rel=((a-psi)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;
    if(Math.abs(rel)>Math.PI/2-hwA) continue;
    const q=[pt(a-hwA,y1),pt(a+hwA,y1),pt(a+hwA,y0),pt(a-hwA,y0)];
    ctx.moveTo(px(q[0]),py(q[0]));
    for(let k=1;k<4;k++) ctx.lineTo(px(q[k]),py(q[k]));
    ctx.closePath();
  }
  ctx.fill();
}
/* a circle standing in the plane that faces along the local z axis */
function verticalEllipse(cx,cz,rot,z,cy,rx,ry,segments=44){
  const pts=[];
  for(let i=0;i<segments;i++){
    const a=i/segments*Math.PI*2;
    pts.push(localPoint(cx,cz,rot,Math.cos(a)*rx,cy+Math.sin(a)*ry,z));
  }
  return pts;
}
function drawLensBand(cx,cz,rot,z0,z1,cy,rx,ry,frontDim,frontLit,side=DEEP,outline=LIT){
  const back=verticalEllipse(cx,cz,rot,z0,cy,rx,ry);
  const front=verticalEllipse(cx,cz,rot,z1,cy,rx,ry);
  for(let i=0;i<front.length;i++){
    const j=(i+1)%front.length, q=[front[i],front[j],back[j],back[i]];
    if(dot(normalOf(q),cam.C)>0) fillPoly(q, side);
  }
  fillBanded(front, frontDim, frontLit);
  if(outline) strokeLoop(front, outline, Math.max(1,1.35*cam.sc));
}

/* ---------------------------------------------------------------------
   Tubes — a frustum between any two points, silhouetted against the
   camera the way the mail scene's pen is
   --------------------------------------------------------------------- */
function tubeBasis(A,B){
  const d=V(B.x-A.x, B.y-A.y, B.z-A.z);
  const L=Math.hypot(d.x,d.y,d.z)||1e-6;
  const u=V(d.x/L, d.y/L, d.z/L);
  const ref=Math.abs(u.y)>0.9 ? V(1,0,0) : V(0,1,0);
  const c1=V(u.y*ref.z-u.z*ref.y, u.z*ref.x-u.x*ref.z, u.x*ref.y-u.y*ref.x);
  const l1=Math.hypot(c1.x,c1.y,c1.z)||1e-6;
  const e1=V(c1.x/l1, c1.y/l1, c1.z/l1);
  const e2=V(u.y*e1.z-u.z*e1.y, u.z*e1.x-u.x*e1.z, u.x*e1.y-u.y*e1.x);
  return { u, e1, e2 };
}
function ringAt(P,b,r,a){
  const c=Math.cos(a), s=Math.sin(a);
  return V(P.x+(c*b.e1.x+s*b.e2.x)*r, P.y+(c*b.e1.y+s*b.e2.y)*r, P.z+(c*b.e1.z+s*b.e2.z)*r);
}
function facingAngle(b){
  let best=0, bd=-2;
  for(let i=0;i<72;i++){
    const a=i/72*Math.PI*2, c=Math.cos(a), s=Math.sin(a);
    const d=dot(V(c*b.e1.x+s*b.e2.x, c*b.e1.y+s*b.e2.y, c*b.e1.z+s*b.e2.z), cam.C);
    if(d>bd){ bd=d; best=a; }
  }
  return best;
}
function drawTube(A,B,rA,rB,dimC,litC,outline){
  const b=tubeBasis(A,B), c=facingAngle(b), a0=c-Math.PI/2, a1=c+Math.PI/2, N=24;
  const poly=[];
  for(let i=0;i<=N;i++) poly.push(ringAt(A,b,rA,a0+(a1-a0)*i/N));
  for(let i=N;i>=0;i--) poly.push(ringAt(B,b,rB,a0+(a1-a0)*i/N));
  if(litC) fillBanded(poly, dimC, litC); else fillPoly(poly, dimC);
  if(outline) strokeLoop(poly, outline, Math.max(1,1.25*cam.sc));
  return b;
}
/* the flat end of a tube; sign is +1 at B and -1 at A */
function tubeCap(P,b,r,sign,color,outline){
  if(dot(V(b.u.x*sign, b.u.y*sign, b.u.z*sign), cam.C) <= 0) return;
  const disc=[];
  for(let i=0;i<32;i++) disc.push(ringAt(P,b,r,i/32*Math.PI*2));
  fillPoly(disc, color);
  if(outline) strokeLoop(disc, outline, Math.max(1,1.2*cam.sc));
}
/* a tube bent through a list of points */
function drawTubeChain(pts,r,dimC,litC,outline){
  for(let i=0;i<pts.length-1;i++) drawTube(pts[i], pts[i+1], r, r, dimC, litC, outline);
}

/* =====================================================================
   Pointer
   ===================================================================== */
const ptr = { on:false, sx:0, sy:0, nx:0, ny:0 };
function pointerAt(e){
  const r = cv.getBoundingClientRect();
  ptr.sx = e.clientX - r.left; ptr.sy = e.clientY - r.top;
  ptr.nx = clamp(ptr.sx/Math.max(1,r.width) *2-1, -1, 1);
  ptr.ny = clamp(ptr.sy/Math.max(1,r.height)*2-1, -1, 1);
  ptr.on = true;
}
cv.addEventListener('pointermove', pointerAt, {passive:true});
cv.addEventListener('pointerdown', pointerAt, {passive:true});
cv.addEventListener('pointerleave', ()=>{ ptr.on=false; });
cv.addEventListener('pointercancel', ()=>{ ptr.on=false; });
cv.addEventListener('pointerup', e=>{ if(e.pointerType!=='mouse') ptr.on=false; });

/* =====================================================================
   Frame loop
   ===================================================================== */
let canvasW=0, canvasH=0, DPR=1;
function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  canvasW = cv.clientWidth; canvasH = cv.clientHeight;
  cv.width = Math.round(canvasW*DPR); cv.height = Math.round(canvasH*DPR);
}
window.addEventListener('resize', resize);
resize();

const lin  = (t,a,b)=>clamp((t-a)/(b-a), 0, 1);
const ease = t=>t*t*(3-2*t);
const back = t=>{ const c=2.2, u=t-1; return 1 + (c+1)*u*u*u + c*u*u; };

/* A scene declares the world boxes it lives in, then draws into the stage:
   { bounds, curY, step(dt,t,cur), shadows(t,cur), items(t,cur), over(t,cur) }
   One box per object keeps the projected footprint tight; a single box
   around a spread-out composition would measure mostly empty floor. */
function run(scene){
  let bx0=1e9, bx1=-1e9, by0=1e9, by1=-1e9;
  for(const box of scene.bounds)
    for(const x of box.x) for(const y of box.y) for(const z of box.z){
      const dx = 0.8660254*(x - z), dy = 0.5*(x + z) - y;   // the rest pose
      if(dx<bx0) bx0=dx; if(dx>bx1) bx1=dx;
      if(dy<by0) by0=dy; if(dy>by1) by1=dy;
    }
  const FIT = Math.min(FIT_W/(bx1-bx0), FIT_H/(by1-by0));
  const CX = (bx0+bx1)/2, CY = (by0+by1)/2;
  const curY = scene.curY === undefined ? 24 : scene.curY;

  const T0 = performance.now();
  let prev = T0, orbMix = 0, orbX = 0, orbY = 0;

  function frame(now){
    const dt = clamp((now-prev)/1000, 0, 1/30); prev = now;
    const t  = STILL ? 0 : ((now-T0)/1000) % LOOP;
    if(cv.clientWidth!==canvasW || cv.clientHeight!==canvasH) resize();
    ctx.setTransform(DPR,0,0,DPR,0,0);

    const A   = STILL ? 0 : 1;
    const osc = (k, amp) => A*amp*Math.sin(k*W0*t);

    /* --- camera: idle loop, handed over to the pointer while it hovers --- */
    const want = (ptr.on && !STILL) ? 1 : 0;
    orbMix += (want - orbMix)*Math.min(1, dt*2.6);
    orbX   += ((ptr.on&&!STILL ? ptr.nx : 0) - orbX)*Math.min(1, dt*4.5);
    orbY   += ((ptr.on&&!STILL ? ptr.ny : 0) - orbY)*Math.min(1, dt*4.5);
    const az = Math.PI/4 + (1-orbMix)*(osc(1,0.30) + osc(2,0.05)) + orbX*0.50;
    const el = clamp(0.61548 + (1-orbMix)*(osc(2,0.060) + osc(3,0.018)) - orbY*0.19,
                     0.40, 0.94);
    const scale = Math.min(canvasW/DW, canvasH/DH)*ZOOM*FIT*PROJ_S;
    setCamera(az, el, scale,
              canvasW*0.5 - CX*scale/PROJ_S,
              canvasH*0.5 - CY*scale/PROJ_S);

    slabPhase = osc(1, 40);
    drift     = osc(2, 46);

    const cur = (ptr.on && !STILL) ? planeAt(ptr.sx, ptr.sy, curY) : null;
    if(scene.step) scene.step(dt, t, cur, osc);

    ctx.fillStyle = BG; ctx.fillRect(0,0,canvasW,canvasH);
    drawCurtain(t);
    if(scene.shadows) scene.shadows(t, cur, osc);
    const items = scene.items(t, cur, osc);
    items.sort((a,b)=>a.d-b.d);
    for(const it of items) it.f();
    if(scene.over) scene.over(t, cur, osc);
    drawBleed();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* Notepad — a spiral pad whose top sheet lifts off the block and settles
   back, a pencil lying on the desk alongside it and a cup of coffee going
   cold beside it.  The sheet answers the pointer as well as the loop; the stage owns
   the camera, the light and the framing. */

const PAD = { x:-60, z:70, hx:250, hz:180, rot:0.05, h:26 };
const CUP = { x:330, z:-110, r:64, h:104 };
const RULES = [-0.56, -0.34, -0.12, 0.10, 0.32, 0.54];

const P = (lx, y, lz) => localPoint(PAD.x, PAD.z, PAD.rot, lx, y, lz);
const HINGE = 2*PAD.hz;                  // hinge -> free edge, along local z

/* The pencil lies on the desk in the gap between the pad's right edge and
   the cup, running with that edge rather than across the block: clear of
   the sheets, of the arc the top one sweeps through and of the pad's own
   side wall, which its 76 units of standoff clear on screen.  It rests on
   the desk, so its axis sits one radius up. */
const PENCIL = { a:P(332, 13, -70), b:P(348, 13, 170), r:13 };

let lift = 0;

/* the block of sheets: a dark wall with one ruled line per sheet */
function padWall(a, b, h){
  const A2=V(a.x, a.y-h, a.z), B2=V(b.x, b.y-h, b.z);
  const q=[a, b, B2, A2];
  fillPoly(q, DEEP);
  ctx.strokeStyle='rgba(30,11,2,0.55)'; ctx.lineWidth=Math.max(1, 1.05*cam.sc);
  ctx.beginPath();
  for(let i=1;i<10;i++){
    const f=i/10, p1=V(a.x, a.y-h*f, a.z), p2=V(b.x, b.y-h*f, b.z);
    ctx.moveTo(px(p1), py(p1)); ctx.lineTo(px(p2), py(p2));
  }
  ctx.stroke();
  strokeLoop(q, LIT, Math.max(1, 1.6*cam.sc));
}

/* the ruled lines and the margin, laid on whichever sheet is on top */
function sheetRules(at, dim){
  const hb=4.2, x0=-PAD.hx*0.80, x1=PAD.hx*0.74;
  for(const rz of RULES){
    const zc=PAD.hz*rz;
    fillPoly([at(x0, zc-hb), at(x1, zc-hb), at(x1, zc+hb), at(x0, zc+hb)],
             dim ? 'rgba(120,54,8,0.45)' : 'rgba(156,71,9,0.55)');
  }
  const mx=-PAD.hx*0.86;
  fillPoly([at(mx-2.6, -PAD.hz*0.72), at(mx+2.6, -PAD.hz*0.72),
            at(mx+2.6,  PAD.hz*0.72), at(mx-2.6,  PAD.hz*0.72)],
           dim ? 'rgba(180,90,20,0.45)' : LIT);
}

function drawPad(){
  const {hx, hz, h}=PAD;
  const T=P(-hx,h,-hz), R=P(hx,h,-hz), B=P(hx,h,hz), L=P(-hx,h,hz);
  const nx=V(Math.cos(PAD.rot), 0, -Math.sin(PAD.rot));
  const nz=V(Math.sin(PAD.rot), 0,  Math.cos(PAD.rot));

  if(dot(nz, cam.C)>0) padWall(L, B, h); else padWall(R, T, h);
  if(dot(nx, cam.C)>0) padWall(B, R, h); else padWall(T, L, h);

  if(cam.C.y>0){
    const top=[T, R, B, L];
    fillBanded(top, EDGE, WHITE);
    strokeLoop(top, LIT, Math.max(1, 1.7*cam.sc));
    /* the block's own ruling, dimmed once the top sheet has left it; it
       has to land before the sheet or the sheet reads as tracing paper */
    sheetRules((lx, lz)=>P(lx, h+0.2, lz), lift > 0.06);
  }
}

/* The sheet that lifts: hinged on the far edge and curled, with the bend
   running from nothing at the hinge to CURL at the free edge.  A rigid
   plane would settle almost exactly edge-on to the rest camera and read
   as a spike; a curl always keeps part of the page turned to the light. */
const CURL = 1.55;
function curlArc(){
  const N=10, du=HINGE/N;
  const arc=[{ y:PAD.h+1, z:-PAD.hz }];
  for(let i=0;i<N;i++){
    const th=lift*CURL*Math.pow((i+0.5)/N, 1.6), a=arc[i];
    arc.push({ y:a.y + Math.sin(th)*du, z:a.z + Math.cos(th)*du });
  }
  return arc;
}
function arcAt(arc, u){
  const f=clamp(u/HINGE, 0, 1)*(arc.length-1);
  const i=Math.min(arc.length-2, Math.floor(f)), t=f-i, a=arc[i], b=arc[i+1];
  return { y:mix(a.y, b.y, t), z:mix(a.z, b.z, t) };
}
function drawSheet(){
  if(lift <= 0.004) return;
  const hx=PAD.hx-5, arc=curlArc();
  const strip=(a, b)=>[P(-hx, b.y, b.z), P(hx, b.y, b.z), P(hx, a.y, a.z), P(-hx, a.y, a.z)];
  let facing=false;
  for(let i=0;i<arc.length-1;i++){
    const q=strip(arc[i], arc[i+1]);
    const face=dot(normalOf(q), cam.C) > 0;
    if(i===Math.floor(arc.length/2)) facing=face;
    fillBanded(q, face ? EDGE : DEEP, face ? WHITE : PAPER);
  }
  const outline=[];
  for(const a of arc) outline.push(P(-hx, a.y, a.z));
  for(let i=arc.length-1;i>=0;i--) outline.push(P(hx, arc[i].y, arc[i].z));
  strokeLoop(outline, LIT, Math.max(1, 1.5*cam.sc));
  if(facing){
    /* the sheet keeps its ruling as it curls up */
    sheetRules((lx, lz)=>{
      const a=arcAt(arc, lz + PAD.hz);
      return P(lx, a.y+0.5, a.z);
    }, true);
  }
}

function drawSpiral(){
  const {hx, hz, h}=PAD;
  for(let i=0;i<11;i++){
    const lx=-hx+34 + i*(2*hx-68)/10, ring=[];
    for(let k=0;k<=22;k++){
      const a=k/22*Math.PI*2;
      ring.push(P(lx, h*0.5+3 + Math.sin(a)*18, -hz + Math.cos(a)*18));
    }
    strokeLoop(ring, i%2 ? DIM : LIT, Math.max(1, 3.2*cam.sc));
  }
}

function drawPencil(t){
  const A=PENCIL.a, B=PENCIL.b;
  const d=V(B.x-A.x, B.y-A.y, B.z-A.z), L=Math.hypot(d.x, d.y, d.z);
  const u=V(d.x/L, d.y/L, d.z/L);
  const at=s=>V(A.x+u.x*s, A.y+u.y*s, A.z+u.z*s);
  const r=PENCIL.r;
  const roll=STILL ? 0 : 2.2*Math.sin(3*W0*t);
  const lifted=V(0, roll, 0);
  const on=s=>{ const p=at(s); return V(p.x, p.y+lifted.y, p.z); };
  const b=drawTube(on(0), on(28), r-1, r-1, EDGE, WHITE, DIM);        // the eraser
  tubeCap(on(0), b, r-1, -1, PAPER, DIM);
  drawTube(on(28), on(48), r, r, DEEP, DIM, LIT);                     // the ferrule
  drawTube(on(48), on(L*0.86), r, r, DIM, LIT, LIT);                  // the barrel
  drawTube(on(L*0.86), on(L-16), r, 5, EDGE, PAPER, DIM);             // the sharpening
  drawTube(on(L-16), on(L), 5, 1.6, INK, null, INK);                  // the lead
}

function drawCup(t){
  drawColumn(CUP.x, CUP.z, CUP.r, 0, CUP.h, DIM, LIT, LIT, LIT);
  const brew=[];
  for(let i=0;i<48;i++){
    const a=i/48*Math.PI*2;
    brew.push(V(CUP.x+Math.cos(a)*(CUP.r-11), CUP.h+0.4, CUP.z+Math.sin(a)*(CUP.r-11)));
  }
  fillBanded(brew, '#2a1103', DEEP);
  strokeLoop(brew, 'rgba(38,14,2,0.85)', Math.max(1, 1.8*cam.sc));
  /* the handle swings out along the screen-horizontal diagonal, so it
     clears the cup's own silhouette instead of hiding inside it */
  const handle=[], d=0.7071;
  for(let i=0;i<=8;i++){
    const a=-1.55 + i/8*3.1, rad=CUP.r-8 + Math.cos(a)*32;
    handle.push(V(CUP.x + rad*d, 60+Math.sin(a)*32, CUP.z - rad*d));
  }
  drawTubeChain(handle, 9, DEEP, DIM, LIT);
}

/* three wisps leaving the cup, drawn over everything else */
function drawSteam(t){
  if(STILL) return;
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.lineCap='round';
  for(let s=0;s<3;s++){
    const phase=s*2.1, sway=16+s*6;
    ctx.beginPath();
    for(let i=0;i<=16;i++){
      const f=i/16, y=CUP.h + f*150;
      const wob=Math.sin(6*W0*t + phase + f*4.2)*sway*f;
      const p=V(CUP.x + (s-1)*24 + wob, y, CUP.z - (s-1)*10 + wob*0.4);
      if(i===0) ctx.moveTo(px(p), py(p)); else ctx.lineTo(px(p), py(p));
    }
    ctx.strokeStyle=\`rgba(255,190,130,\${0.16 - s*0.035})\`;
    ctx.lineWidth=Math.max(1, 3.4*cam.sc);
    ctx.stroke();
  }
  ctx.restore();
}

run({
  bounds: [
    { x:[-310, 190], y:[  0,  26], z:[-110, 250] },   // the pad
    { x:[-310, 190], y:[175, 212], z:[ 120, 160] },   // the curled sheet
    { x:[ 255, 309], y:[  0,  26], z:[ -30, 235] },   // the pencil
    { x:[ 266, 430], y:[  0, 104], z:[-240, -46] },   // the cup
  ],
  curY: 30,
  step(dt, t, cur){
    const loop=STILL ? 0 : Math.max(0, back(lin(t, 1.0, 3.2)) - ease(lin(t, 30.5, 33.6)));
    const near=cur ? Math.max(0, 1-Math.hypot(PAD.x-cur.x, PAD.z-cur.z)/300) : 0;
    lift += (Math.max(loop, near*0.86) - lift)*Math.min(1, dt*6);
  },
  shadows(){
    boxShadow(PAD.x, PAD.z, PAD.hx, PAD.hz, 0, PAD.h, PAD.rot);
    const pen=[];
    for(const p of [PENCIL.a, PENCIL.b]) for(const y of [0, 2*PENCIL.r])
      for(const s of [-1, 1]) pen.push(V(p.x+s*PENCIL.r, y, p.z+s*PENCIL.r));
    castHull(pen);
    columnShadow(CUP.x, CUP.z, CUP.r, 0, CUP.h);
  },
  items(t){
    return [
      { d: depth(V(PAD.x, PAD.h*0.5, PAD.z)),
        f: ()=>{ drawPad(); drawSheet(); drawSpiral(); } },
      { d: depth(V((PENCIL.a.x+PENCIL.b.x)/2, PENCIL.r, (PENCIL.a.z+PENCIL.b.z)/2)),
        f: ()=>drawPencil(t) },
      { d: depth(V(CUP.x, CUP.h*0.5, CUP.z)), f: ()=>drawCup(t) },
    ];
  },
  over(t){ drawSteam(t); },
});
})();
<\/script>
</body>
</html>
`,g={mail:y,"keyboard-mouse":u,"camera-drone":f,microphone:b,notepad:m},z={mail:"Interactive isometric mail with light shafts","keyboard-mouse":"Interactive isometric keyboard and Apple-style mouse with light shafts","camera-drone":"Interactive isometric camera and drone with light shafts",microphone:"Interactive isometric condenser microphone desk with light shafts",notepad:"Interactive isometric notepad, pencil and coffee with light shafts"};function M({className:a="",variant:t="mail"}){const s=n.useRef(null),c=n.useRef(!0),[o,d]=n.useState(!0),[i,r]=n.useState(!1);return n.useEffect(()=>{const l=s.current;if(!l)return;const e=()=>d(c.current&&document.visibilityState!=="hidden"),h=new IntersectionObserver(([x])=>{c.current=x?.isIntersecting??!0,e()},{rootMargin:"80px"});return h.observe(l),document.addEventListener("visibilitychange",e),()=>{h.disconnect(),document.removeEventListener("visibilitychange",e)}},[]),n.useEffect(()=>{r(!1)},[o,t]),p.jsx("div",{ref:s,className:`iso-mail-lightshafts${a?` ${a}`:""}`,"data-state":o?i?"ready":"loading":"paused","data-variant":t,children:o?p.jsx("iframe",{className:`iso-mail-lightshafts__frame${i?" is-ready":""}`,title:z[t],srcDoc:g[t],sandbox:"allow-scripts",loading:"eager",onLoad:()=>r(!0)},t):null})}export{M as IsometricMailLightShafts};
