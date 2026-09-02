import{r as c,j as s}from"./index-fOQwe-l-.js";import{CathodeHero as F}from"./CathodeHero-B0XxClP2.js";import{EmberlineHero as I}from"./EmberlineHero-CHcAwfy5.js";import{HolographicGlitterCard as j}from"./HolographicGlitterCard-DiK-BOd7.js";import{Iridis as W}from"./Iridis-C_xUzctV.js";import{LiquidClock as U}from"./LiquidClock-CA2wVJJE.js";import{MechanicalKeyboard as V}from"./MechanicalKeyboard-DgOu3eh4.js";import{RetroMetallic as q}from"./RetroMetallic-GnuTXmsZ.js";import{b as G,L as N}from"./LandingPages-plHUvg-e.js";import"./SylvaLivingWorldScene-OThUX2Jj.js";const E="/landing-pages/cathode.html",K=`  fragmentShader:\`
    precision highp float;
    uniform float uTime;
    uniform vec4 uRow[\${NROWS}];`,k="      gl_FragColor = vec4(vec3(max(c, 0.0)), 1.0);\n    }`",Z=`<script>
window.addEventListener("message", function(event){
  var payload = event.data;
  if (!payload || payload.type !== "cathode-shot-pointer") return;
  window.dispatchEvent(new PointerEvent("pointermove", {
    clientX: Math.max(0, Math.min(1, payload.x)) * window.innerWidth,
    clientY: Math.max(0, Math.min(1, payload.y)) * window.innerHeight
  }));
});
<\/script>`,Y=`  const aspect = W / H;
  /* vertical field, in master pixels, that frames the artwork in either format */
  const marginX = (aspect < 1 ? 1.12 : 1.10), marginY = 1.46;
  const viewH = Math.max(ART_H * marginY, ART_W * marginX / aspect);
  const hh = 0.35355 * viewH;          /* 1 world unit along Y == 1.1547 master px */
  const hw = hh * aspect;
  /* lift the subject off dead centre, and slide it clear of the copy column */
  const biasY = (aspect < 1 ? 0.13 : 0.055);
  const biasX = Math.min(0.24, Math.max(0, (aspect - 1.00) * 0.34));
  camera.left = -hw * (1 - biasX); camera.right = hw * (1 + biasX);
  camera.top = hh * (1 - biasY); camera.bottom = -hh * (1 + biasY);
  camera.updateProjectionMatrix();`,J=`  const aspect = W / H;
  const viewH = cathodeFrameCamera(aspect);`,R="function resize(){",Q="  placeCamera(reduced ? 0 : t);",ee="  screenMat.uniforms.uTime.value = reduced ? 0.75 : t;",te="  const th = BASE_THETA + az;",ae="  const ph = Math.min(1.30, Math.max(0.34, BASE_PHI + el));";function x(t,a,i,o){const n=t.indexOf(a);if(n<0||t.indexOf(a,n+a.length)>=0)throw new Error(`Cathode shot sequence: canonical ${o} anchor was not found exactly once`);return`${t.slice(0,n)}${i}${t.slice(n+a.length)}`}function oe(t,a){const i=t.map(o=>({focus:o.focus,zoom:o.zoom,push:o.push,biasX:o.biasX,biasY:o.biasY,az:o.az??0,el:o.el??0}));return`const CATHODE_SHOT = ${a};
const CATHODE_CYCLE = ${a*t.length};
/* One entry per shot: what it frames, how tight, and which way it looks from.
   The camera is cut between them, never rebuilt. */
const CATHODE_SHOTS = ${JSON.stringify(i,null,2)};
const cathodeShot = {
  zoom: CATHODE_SHOTS[0].zoom,
  biasX: CATHODE_SHOTS[0].biasX,
  biasY: CATHODE_SHOTS[0].biasY,
  focus: CATHODE_SHOTS[0].focus,
  az: CATHODE_SHOTS[0].az,
  el: CATHODE_SHOTS[0].el
};
let cathodeAspect = 16 / 9;
let cathodeT0 = performance.now();
let cathodeFocus = null;
function cathodeFocusPoints(){
  if (cathodeFocus) return cathodeFocus;
  root.updateMatrixWorld(true);
  /* the keys the document actually lights: the cluster that reads as typing */
  const keys = new THREE.Vector3();
  let n = 0;
  for (const [rw, cl] of LIT) {
    const k = keyByRC[rw + '_' + cl];
    if (!k) continue;
    keys.add(new THREE.Vector3(k.cell.cx, KB_H, k.cell.cz));
    n++;
  }
  if (n) keys.divideScalar(n);
  cathodeFocus = {
    screen: screen.getWorldPosition(new THREE.Vector3()),
    keys: root.localToWorld(keys)
  };
  return cathodeFocus;
}
function cathodeFrameCamera(aspect){
${Y.split(`
`).map(o=>o.startsWith("  const aspect")?`  cathodeAspect = aspect;
  /* the shot list is a landscape edit; anything narrower keeps the authored fit */
  const wide = aspect >= 1.25;`:o).join(`
`).replace("const hh = 0.35355 * viewH;","const hh = 0.35355 * viewH * (wide ? cathodeShot.zoom : 1);").replace("const biasY = (aspect < 1 ? 0.13 : 0.055);","const biasY = (aspect < 1 ? 0.13 : 0.055) + (wide ? cathodeShot.biasY : 0);").replace("const biasX = Math.min(0.24, Math.max(0, (aspect - 1.00) * 0.34));","const biasX = Math.min(0.24, Math.max(0, (aspect - 1.00) * 0.34)) + (wide ? cathodeShot.biasX : 0);").replace(`  camera.left = -hw * (1 - biasX); camera.right = hw * (1 + biasX);
  camera.top = hh * (1 - biasY); camera.bottom = -hh * (1 + biasY);`,`  /* a close shot re-centres the frustum on what it frames; a wide shot
     keeps the authored centre exactly */
  let cx = 0, cy = 0;
  if (wide && cathodeShot.focus) {
    camera.updateMatrixWorld();
    const f = cathodeFocusPoints()[cathodeShot.focus].clone().applyMatrix4(camera.matrixWorldInverse);
    cx = f.x; cy = f.y;
  }
  camera.left = cx - hw * (1 - biasX); camera.right = cx + hw * (1 + biasX);
  camera.top = cy + hh * (1 - biasY); camera.bottom = cy - hh * (1 + biasY);`)}
  return viewH;
}
function cathodeSmooth(u){ u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); }
function cathodeCut(seconds){
  const c = ((seconds % CATHODE_CYCLE) + CATHODE_CYCLE) % CATHODE_CYCLE;
  const index = Math.min(CATHODE_SHOTS.length - 1, Math.floor(c / CATHODE_SHOT));
  const shot = CATHODE_SHOTS[index];
  /* each shot is a hard cut, then creeps in under its own statement */
  const k = cathodeSmooth((c - index * CATHODE_SHOT) / (CATHODE_SHOT * 0.9));
  cathodeShot.zoom = shot.zoom - shot.push * k;
  cathodeShot.biasX = shot.biasX;
  cathodeShot.biasY = shot.biasY;
  cathodeShot.focus = shot.focus;
  cathodeShot.az = shot.az;
  cathodeShot.el = shot.el;
}
/* One message from the host restarts the edit in step with the statements. */
window.addEventListener('message', function(event){
  const payload = event.data;
  if (!payload || payload.type !== 'cathode-shot-cycle') return;
  cathodeT0 = performance.now();
});
`}function z(t,a){const{shots:i,shotSeconds:o,screenShader:n,reducedAt:r}=a;let e=t;if(n){const m=e.indexOf(K),h=e.indexOf(k,m);if(m<0||h<0)throw new Error("Cathode shot sequence: canonical CRT shader anchors were not found");e=`${e.slice(0,m)}${n}${e.slice(h+k.length)}`}return e=x(e,Y,J,"camera framing"),e=x(e,R,`${oe(i,o)}${R}`,"resize"),e=x(e,te,"  const th = BASE_THETA + az + cathodeShot.az;","camera azimuth"),e=x(e,ae,"  const ph = Math.min(1.30, Math.max(0.34, BASE_PHI + el + cathodeShot.el));","camera elevation"),e=x(e,Q,`  /* the settled pose is the one a reduced-motion reader gets. The cut picks
     the shot, placeCamera moves the camera to its angle, and only then can the
     frustum be re-centred on what the shot frames. */
  const cathodeT = reduced ? ${r} : (now - cathodeT0) / 1000;
  cathodeCut(cathodeT);
  placeCamera(reduced ? 0 : t);
  cathodeFrameCamera(cathodeAspect);`,"camera tick"),e=x(e,ee,"  screenMat.uniforms.uTime.value = cathodeT;","screen clock"),G(e,{presentation:"background",canvasSelector:"#gl",bridges:[Z]})}const se=2,ne=`  fragmentShader:\`
    precision highp float;
    uniform float uTime;
    uniform vec2 uSize;
    varying vec2 vUv;

    float segment(vec2 p, vec2 a, vec2 b, float width){
      vec2 pa=p-a, ba=b-a;
      float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
      return 1.0-smoothstep(width,width+0.9,length(pa-ba*h));
    }
    float disk(vec2 p, vec2 center, float radius){
      return 1.0-smoothstep(radius,radius+0.9,length(p-center));
    }
    float ring(vec2 p, vec2 center, float radius, float width){
      return 1.0-smoothstep(width,width+0.8,abs(length(p-center)-radius));
    }
    float box(vec2 p, vec2 lo, vec2 hi, float soft){
      vec2 inside=smoothstep(lo-soft,lo,p)*(1.0-smoothstep(hi,hi+soft,p));
      return inside.x*inside.y;
    }
    float ease(float t){ t=clamp(t,0.0,1.0); return t*t*(3.0-2.0*t); }
    float span(float t, float a, float b){ return clamp((t-a)/(b-a),0.0,1.0); }

    /* ---- seven-segment readout: the count is the whole point of the feed --- */
    float segBit(float mask, float bit){ return mod(floor(mask/bit),2.0); }
    float digitMask(float d){
      d=floor(d+0.5);
      if(d<0.5) return 63.0;
      if(d<1.5) return 6.0;
      if(d<2.5) return 91.0;
      if(d<3.5) return 79.0;
      if(d<4.5) return 102.0;
      if(d<5.5) return 109.0;
      if(d<6.5) return 125.0;
      if(d<7.5) return 7.0;
      if(d<8.5) return 127.0;
      return 111.0;
    }
    float glyph(vec2 p, vec2 o, vec2 sz, float th, float mask){
      if(p.x<o.x-3.0||p.x>o.x+sz.x+3.0||p.y<o.y-3.0||p.y>o.y+sz.y+3.0) return 0.0;
      float x0=o.x, x1=o.x+sz.x, y0=o.y, y1=o.y+sz.y, ym=o.y+sz.y*0.5;
      float k=th*1.7;
      float s=0.0;
      if(segBit(mask,1.0)>0.5)  s=max(s,segment(p,vec2(x0+k,y0),vec2(x1-k,y0),th));
      if(segBit(mask,2.0)>0.5)  s=max(s,segment(p,vec2(x1,y0+k),vec2(x1,ym-k),th));
      if(segBit(mask,4.0)>0.5)  s=max(s,segment(p,vec2(x1,ym+k),vec2(x1,y1-k),th));
      if(segBit(mask,8.0)>0.5)  s=max(s,segment(p,vec2(x0+k,y1),vec2(x1-k,y1),th));
      if(segBit(mask,16.0)>0.5) s=max(s,segment(p,vec2(x0,ym+k),vec2(x0,y1-k),th));
      if(segBit(mask,32.0)>0.5) s=max(s,segment(p,vec2(x0,y0+k),vec2(x0,ym-k),th));
      if(segBit(mask,64.0)>0.5) s=max(s,segment(p,vec2(x0+k,ym),vec2(x1-k,ym),th));
      return s;
    }

    /* ---- the plotted series, in the screen's own master-pixel space -------- */
    const vec2 CP0=vec2(13.0,96.0);
    const vec2 CP1=vec2(30.0,90.0);
    const vec2 CP2=vec2(47.0,92.0);
    const vec2 CP3=vec2(64.0,79.0);
    const vec2 CP4=vec2(81.0,71.0);
    const vec2 CP5=vec2(98.0,60.0);
    const vec2 CP6=vec2(115.0,50.0);
    const float PLOT_BASE=100.0;
    const float BASE=126.0;

    float curveY(float x){
      if(x<=CP0.x) return CP0.y;
      if(x<CP1.x) return mix(CP0.y,CP1.y,(x-CP0.x)/(CP1.x-CP0.x));
      if(x<CP2.x) return mix(CP1.y,CP2.y,(x-CP1.x)/(CP2.x-CP1.x));
      if(x<CP3.x) return mix(CP2.y,CP3.y,(x-CP2.x)/(CP3.x-CP2.x));
      if(x<CP4.x) return mix(CP3.y,CP4.y,(x-CP3.x)/(CP4.x-CP3.x));
      if(x<CP5.x) return mix(CP4.y,CP5.y,(x-CP4.x)/(CP5.x-CP4.x));
      if(x<CP6.x) return mix(CP5.y,CP6.y,(x-CP5.x)/(CP6.x-CP5.x));
      return CP6.y;
    }
    float drawTo(vec2 p, vec2 a, vec2 b, float head, float w){
      if(head<=a.x) return 0.0;
      return segment(p,a,mix(a,b,clamp((head-a.x)/(b.x-a.x),0.0,1.0)),w);
    }

    void main(){
      vec2 p=vec2((1.0-vUv.x)*uSize.x,(1.0-vUv.y)*uSize.y);
      float c=0.0666;

      /* The existing CRT becomes the only changed illustration layer: a
         phosphor analytics feed built on the workstation's own scan grammar,
         drawn inside the shot that frames it and held through the two after. */
      float T=mod(uTime,6.0);
      /* No erase pass: the loop turns over on the cut back to the screen shot,
         so the feed simply starts drawing again behind a new frame. */

      /* chassis grid, kept from the terminal feed so the screen still breathes */
      float gridX=1.0-smoothstep(0.35,1.15,abs(mod(p.x-8.0,22.0)-11.0));
      float gridY=1.0-smoothstep(0.35,1.15,abs(mod(p.y-7.0,18.0)-9.0));
      c=mix(c,0.088,max(gridX,gridY)*0.52);

      /* ---- header: title chip, live lamp, rule --------------------------- */
      c=mix(c,0.30,box(p,vec2(8.0,4.5),vec2(34.0,11.5),0.7));
      c=mix(c,0.15,box(p,vec2(148.0,5.5),vec2(161.0,10.5),0.6));
      c=mix(c,0.15,box(p,vec2(164.0,5.5),vec2(174.0,10.5),0.6));
      c=mix(c,0.88,disk(p,vec2(140.0,8.0),1.7)*step(mod(uTime,1.0),0.55));
      c=mix(c,0.24,segment(p,vec2(8.0,15.0),vec2(174.0,15.0),0.45));

      /* ---- the count: 0 to 1,000,000 ------------------------------------- */
      float countK=ease(span(T,0.30,1.44));
      float value=floor(1000000.0*(1.0-pow(1.0-countK,3.0))+0.5);
      float landed=span(T,1.42,1.62);
      float digits=0.0;
      for(int i=0;i<7;i++){
        float fi=float(i);
        float gx=10.0+fi*11.4+(fi>0.5?3.6:0.0)+(fi>3.5?3.6:0.0);
        float d=mod(floor(value/pow(10.0,6.0-fi)),10.0);
        digits=max(digits,glyph(p,vec2(gx,20.0),vec2(8.4,17.0),1.05,digitMask(d)));
      }
      float commas=segment(p,vec2(22.9,35.6),vec2(21.5,39.0),0.85)
                  +segment(p,vec2(57.1,35.6),vec2(55.7,39.0),0.85);
      c=mix(c,mix(0.74,1.0,landed),min(1.0,digits+commas));
      /* the count's own progress rule, and the delta chip beside it */
      c=mix(c,0.20,box(p,vec2(10.0,41.0),vec2(91.0,42.6),0.5));
      c=mix(c,0.66,box(p,vec2(10.0,41.0),vec2(10.0+81.0*countK,42.6),0.5));
      c=mix(c,mix(0.22,0.62,landed),box(p,vec2(98.0,22.0),vec2(118.0,27.0),0.6));
      c=mix(c,mix(0.22,0.48,landed),box(p,vec2(98.0,30.5),vec2(112.0,34.5),0.6));

      /* ---- line plot: axes, grid, filled series, drawing head ------------ */
      float head=mix(CP0.x,CP6.x,ease(span(T,0.04,1.28)));
      float drawing=1.0-span(T,1.28,1.48);
      float plotBox=step(9.0,p.x)*step(p.x,119.0)*step(46.0,p.y)*step(p.y,101.5);
      float grid=0.0;
      for(int i=0;i<3;i++){
        float gy=58.0+float(i)*14.0;
        grid=max(grid,(1.0-smoothstep(0.3,1.0,abs(p.y-gy)))*step(0.42,fract(p.x/5.5)));
      }
      c=mix(c,0.13,grid*plotBox);
      c=mix(c,0.22,segment(p,vec2(10.0,46.0),vec2(10.0,PLOT_BASE),0.45));
      c=mix(c,0.26,segment(p,vec2(10.0,PLOT_BASE),vec2(118.0,PLOT_BASE),0.45));

      float cy=curveY(p.x);
      float fill=(1.0-smoothstep(head,head+1.4,p.x))*smoothstep(12.2,13.8,p.x)
                *smoothstep(cy-0.4,cy+1.2,p.y)*(1.0-smoothstep(PLOT_BASE-0.6,PLOT_BASE+0.4,p.y));
      float grade=1.0-clamp((p.y-cy)/46.0,0.0,1.0);
      c=mix(c,0.082+0.100*grade,fill);

      float line=0.0;
      line=max(line,drawTo(p,CP0,CP1,head,1.15));
      line=max(line,drawTo(p,CP1,CP2,head,1.15));
      line=max(line,drawTo(p,CP2,CP3,head,1.15));
      line=max(line,drawTo(p,CP3,CP4,head,1.15));
      line=max(line,drawTo(p,CP4,CP5,head,1.15));
      line=max(line,drawTo(p,CP5,CP6,head,1.15));
      c=mix(c,0.76,line);

      float nodes=0.0;
      nodes=max(nodes,ring(p,CP0,2.3,0.85)*step(CP0.x,head));
      nodes=max(nodes,ring(p,CP1,2.3,0.85)*step(CP1.x,head));
      nodes=max(nodes,ring(p,CP2,2.3,0.85)*step(CP2.x,head));
      nodes=max(nodes,ring(p,CP3,2.3,0.85)*step(CP3.x,head));
      nodes=max(nodes,ring(p,CP4,2.3,0.85)*step(CP4.x,head));
      nodes=max(nodes,ring(p,CP5,2.3,0.85)*step(CP5.x,head));
      c=mix(c,0.46,nodes);

      /* the pen: a bright node with a tracer dropped to the axis while it runs */
      vec2 pen=vec2(head,curveY(head));
      float tracer=(1.0-smoothstep(0.55,1.5,abs(p.x-head)))*step(pen.y,p.y)*(1.0-smoothstep(PLOT_BASE-0.4,PLOT_BASE+0.5,p.y));
      c=mix(c,0.34,tracer*drawing);
      c=mix(c,1.0,disk(p,pen,1.9)*drawing);

      /* the milestone the copy is talking about */
      float burstR=mix(3.2,15.0,ease(span(T,1.28,2.10)));
      c+=ring(p,CP6,burstR,0.9)*(1.0-span(T,1.28,2.10))*0.42;
      c=mix(c,1.0,disk(p,CP6,2.3)*ease(span(T,1.26,1.50)));
      c=mix(c,0.90,ring(p,CP6,4.6,0.8)*(0.55+0.45*sin(uTime*4.2))*ease(span(T,1.46,1.74)));

      /* ---- bar row: the same series, banked --------------------------- */
      float bars=0.0, lastBar=0.0;
      for(int i=0;i<7;i++){
        float fi=float(i);
        float x0=12.0+fi*15.2;
        float h=(6.0+fi*2.5)*ease(span(T,0.14+fi*0.070,0.72+fi*0.070));
        float b=box(p,vec2(x0,BASE-h),vec2(x0+8.0,BASE),0.7)*step(0.6,h);
        bars=max(bars,b);
        if(i==6) lastBar=b;
      }
      c=mix(c,0.30,bars);
      c=mix(c,mix(0.30,0.72,landed),lastBar);
      c=mix(c,0.22,segment(p,vec2(10.0,BASE+1.6),vec2(118.0,BASE+1.6),0.45));

      /* ---- share dial and the stat stack beside it --------------------- */
      vec2 dialC=vec2(150.0,56.0);
      float dialR=19.0;
      c=mix(c,0.115,ring(p,dialC,dialR,2.2));
      vec2 dv=p-dialC;
      float angle=atan(dv.x,-dv.y);
      if(angle<0.0) angle+=6.2831853;
      float sweep=6.2831853*0.78*ease(span(T,0.18,1.36));
      c=mix(c,0.70,ring(p,dialC,dialR,2.2)*step(angle,sweep));
      vec2 dialHead=dialC+dialR*vec2(sin(sweep),-cos(sweep));
      c=mix(c,1.0,disk(p,dialHead,2.0)*drawing);
      c=mix(c,0.13,ring(p,dialC,11.0,1.0));
      c=mix(c,mix(0.34,0.72,landed),ring(p,dialC,11.0,1.0)*step(angle,sweep*0.62));
      for(int i=0;i<3;i++){
        float fi=float(i);
        float y0=88.0+fi*12.0;
        float g=ease(span(T,0.36+fi*0.10,1.14+fi*0.10));
        c=mix(c,0.14,box(p,vec2(126.0,y0),vec2(174.0,y0+4.2),0.6));
        c=mix(c,0.52,box(p,vec2(126.0,y0),vec2(126.0+48.0*(0.42+0.52*fi/3.0)*g,y0+4.2),0.6));
      }

      /* Retain the exact source's read-head sweep, fast scan, static, and
         phosphor breathe so the new data still belongs to this CRT. */
      float tb=mod(uTime+1.10,6.5667)/2.87;
      if(tb<1.0){
        float y=-2.0+tb*(uSize.y+6.0);
        float xa=smoothstep(4.8,6.4,p.x)*(1.0-smoothstep(176.0,181.0,p.x));
        float dy=p.y-y;
        c+=0.100*exp(-abs(dy)*0.085)*xa;
        c=mix(c,0.80,(1.0-smoothstep(1.7,3.2,abs(dy)))*xa);
      }
      float ts=mod(uTime,1.5)/0.25;
      if(ts<1.0){
        float y=-3.0+(ts*ts*(3.0-2.0*ts))*(uSize.y+8.0);
        float dy=p.y-y;
        c+=(dy<0.0?0.12*exp(dy*0.051):0.045*exp(-dy*0.118));
      }
      float noise=fract(sin(dot(p*3.7+vec2(uTime*61.0,uTime*37.0),vec2(12.9898,78.233)))*43758.5453);
      c+=(noise-0.42)*0.026;
      c*=0.985+0.015*sin(p.y*2.1+uTime*3.3);
      gl_FragColor=vec4(vec3(max(c,0.0)),1.0);
    }\``,ce=[{focus:"screen",zoom:.6,push:.032,biasX:.17,biasY:-.01},{focus:"keys",zoom:.385,push:.026,biasX:.09,biasY:.02},{focus:null,zoom:.885,push:.04,biasX:.1,biasY:-.035}];function ie(t){return z(t,{shots:ce,shotSeconds:se,screenShader:ne,reducedAt:5.2})}function re({className:t="",style:a}){const[i,o]=c.useState();c.useEffect(()=>{const r=new AbortController;return fetch(E,{credentials:"same-origin",signal:r.signal}).then(e=>{if(!e.ok)throw new Error(`Cathode Charts: source request failed (${e.status})`);return e.text()}).then(e=>o(ie(e))).catch(e=>{e instanceof DOMException&&e.name==="AbortError"||console.error(e)}),()=>r.abort()},[]);const n=c.useCallback(r=>{r.contentWindow?.postMessage({type:"cathode-shot-cycle"},"*"),r.closest(".reference-motion-scene")?.querySelectorAll(".reference-motion-scene__line").forEach(m=>{for(const h of m.getAnimations())h.currentTime=0})},[]);return i?s.jsx(N,{applyScene:n,className:`cathode-charts-scene${t?` ${t}`:""}`,backgroundCanvasSelector:"#gl",sourceUrl:E,srcDoc:i,title:"Cathode — workstation charts",style:a}):s.jsx("div",{className:`web3dkit-background cathode-charts-scene${t?` ${t}`:""}`,"data-state":"loading",style:{background:"#080808",...a}})}const le="/minto-wallet-3d.html",_=2,de=3*_,he=`  const pad = 1.02;
  const s = Math.max(2 * fitHH * pad, 2 * fitHW * pad / a);
  camera.left = -s * a / 2; camera.right = s * a / 2;
  camera.top = s / 2; camera.bottom = -s / 2;
  camera.updateProjectionMatrix();`,me="  walletFrameCamera(a);",L="function resize() {",ue=`const SLOT_SHOT = ${_};
const SLOT_CYCLE = ${de};
/* one entry per shot: what it frames, how tight, how far it creeps, and where
   the subject sits so the statement gets clear ground */
const SLOT_SHOTS = [
  { focus: 'near', zoom: 0.620, push: 0.028, biasX: 0.060, biasY: 0.340 },
  { focus: 'far',  zoom: 0.700, push: 0.026, biasX: -0.155, biasY: 0.330 },
  { focus: null,   zoom: 0.930, push: 0.038, biasX: 0.090, biasY: 0.195 }
];
const walletPush = { zoom: SLOT_SHOTS[2].zoom, biasX: SLOT_SHOTS[2].biasX, biasY: SLOT_SHOTS[2].biasY, focus: null };
/* the host's controls, as multipliers over the authored shot list — every
   default is the identity, so an untouched composition is the authored cut */
const SLOT_TUNE = { shot: SLOT_SHOT, cycle: SLOT_CYCLE, framing: 1, push: 1, lift: 0 };
const walletReduced = matchMedia('(prefers-reduced-motion: reduce)');
let walletAspect = 16 / 9;
let walletFocus = null;
function walletFocusPoints(){
  if (walletFocus) return walletFocus;
  root.updateMatrixWorld(true);
  /* aim at the deck each half actually works — the seated card groups, not a
     bounding box — so the frame holds still while a card rides up through it */
  const deck = (half) => {
    const at = new T.Vector3();
    let n = 0;
    for (const c of cards) {
      if (c.group.parent !== half) continue;
      at.add(half.localToWorld(new T.Vector3(c.group.position.x, c.baseY, c.baseZ)));
      n++;
    }
    return n ? at.divideScalar(n) : at;
  };
  walletFocus = { near: deck(halfNear), far: deck(halfFar) };
  return walletFocus;
}
function walletFrameCamera(a){
  walletAspect = a;
  /* the shot list is a landscape edit; anything narrower keeps the authored fit */
  const wide = a >= 1.25;
  const pad = 1.02;
  const s = Math.max(2 * fitHH * pad, 2 * fitHW * pad / a) * (wide ? walletPush.zoom : 1);
  const hw = s * a / 2, hh = s / 2;
  const biasX = wide ? walletPush.biasX : 0;
  const biasY = wide ? walletPush.biasY : 0;
  /* a close shot re-centres the frustum on what it frames; the wide shot keeps
     the authored centre exactly, and so does every aspect below 1.25 */
  let cx = 0, cy = 0;
  if (wide && walletPush.focus) {
    camera.updateMatrixWorld();
    const f = walletFocusPoints()[walletPush.focus].clone().applyMatrix4(camera.matrixWorldInverse);
    cx = f.x; cy = f.y;
  }
  camera.left = cx - hw * (1 - biasX); camera.right = cx + hw * (1 + biasX);
  camera.top = cy + hh * (1 - biasY); camera.bottom = cy - hh * (1 + biasY);
  camera.updateProjectionMatrix();
}
function walletSmooth(u){ u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); }
function walletPushIn(seconds){
  const cycle = SLOT_TUNE.cycle;
  const c = ((seconds % cycle) + cycle) % cycle;
  const index = Math.min(SLOT_SHOTS.length - 1, Math.floor(c / SLOT_TUNE.shot));
  const shot = SLOT_SHOTS[index];
  /* each shot is a hard cut, then creeps in under its own statement */
  const k = walletSmooth((c - index * SLOT_TUNE.shot) / (SLOT_TUNE.shot * 0.9));
  walletPush.zoom = (shot.zoom - shot.push * SLOT_TUNE.push * k) * SLOT_TUNE.framing;
  walletPush.biasX = shot.biasX;
  walletPush.biasY = shot.biasY + SLOT_TUNE.lift;
  walletPush.focus = shot.focus;
  walletFrameCamera(walletAspect);
}
/* One message from the host starts the edit in step with the headline. */
addEventListener('message', function(event){
  const payload = event.data;
  if (!payload) return;
  if (payload.type === 'wallet-slots-cycle') { t0 = null; return; }
  if (payload.type !== 'wallet-slots-tune') return;
  /* The card schedule is bound to the cut, not to a fixed number of seconds,
     so a longer shot stretches the draws with it and every shot still frames
     the card riding out of its slot inside it. */
  if (payload.shot > 0) { SLOT_TUNE.shot = payload.shot; SLOT_TUNE.cycle = payload.shot * SLOT_SHOTS.length; }
  if (payload.framing > 0) SLOT_TUNE.framing = payload.framing;
  if (payload.push >= 0) SLOT_TUNE.push = payload.push;
  if (typeof payload.lift === 'number') SLOT_TUNE.lift = payload.lift;
  if (payload.resync) t0 = null;
});
`,fe="  const fr = (time / LOOP) % 1 * 600;",pe="  const fr = (time / (2 * SLOT_TUNE.cycle)) % 1 * 600;",D=`  az += (azT - az) * Math.min(1, dt * 3.2);
  el += (elT - el) * Math.min(1, dt * 3.2);
  placeCamera();`,xe=`${D}
  /* the settled wide shot is the one a reduced-motion reader gets */
  walletPushIn(walletReduced.matches ? 5.2 : time);`;function S(t,a,i,o){const n=t.indexOf(a);if(n<0||t.indexOf(a,n+a.length)>=0)throw new Error(`Wallet Slots: canonical ${o} anchor was not found exactly once`);return`${t.slice(0,n)}${i}${t.slice(n+a.length)}`}function ge(t){let a=S(t,he,me,"camera framing");return a=S(a,L,`${ue}${L}`,"resize"),a=S(a,fe,pe,"draw clock"),a=S(a,D,xe,"camera tick"),a}function ye({shotSeconds:t=_,framing:a=1,pushIn:i=1,lift:o=0,className:n="",style:r}){const[e,m]=c.useState(),[h,O]=c.useState(!1),g=c.useRef(null),p=c.useRef(t);c.useEffect(()=>{const u=new AbortController;return fetch(le,{credentials:"same-origin",signal:u.signal}).then(l=>{if(!l.ok)throw new Error(`Wallet Slots: source request failed (${l.status})`);return l.text()}).then(l=>m(ge(l))).catch(l=>{l instanceof DOMException&&l.name==="AbortError"||console.error(l)}),()=>u.abort()},[]);const w=c.useCallback(u=>{const l=u.currentTarget;O(!0),l.contentWindow?.postMessage({type:"wallet-slots-cycle"},"*"),l.closest(".reference-motion-scene")?.querySelectorAll(".reference-motion-scene__line").forEach(y=>{for(const C of y.getAnimations())C.currentTime=0})},[]);return c.useEffect(()=>{const u=g.current;if(!u||!h)return;const l=p.current!==t;if(p.current=t,u.contentWindow?.postMessage({type:"wallet-slots-tune",shot:t,framing:a,push:i,lift:o,resync:l},"*"),!l)return;u.closest(".reference-motion-scene")?.querySelectorAll(".reference-motion-scene__line").forEach(y=>{for(const C of y.getAnimations())C.currentTime=0})},[h,t,a,i,o]),s.jsx("div",{className:`mechanical-keyboard wallet-slots-scene${n?` ${n}`:""}`,"data-variant":"wallet","data-state":h&&e?"ready":"loading",style:r,children:e?s.jsx("iframe",{ref:g,className:`mechanical-keyboard__frame${h?" is-ready":""}`,title:"Minto — wallet slots",srcDoc:e,sandbox:"allow-scripts",loading:"eager",onLoad:w}):null})}const Ce=2,we=[{focus:"screen",zoom:.64,push:.03,biasX:.15,biasY:-.02,az:.26,el:-.16},{focus:"keys",zoom:.47,push:.026,biasX:.11,biasY:.02,az:-.28,el:.15},{focus:null,zoom:.885,push:.04,biasX:.115,biasY:-.035,az:0,el:0}];function be(t){return z(t,{shots:we,shotSeconds:Ce,reducedAt:5.2})}function Te({className:t="",style:a}){const[i,o]=c.useState();c.useEffect(()=>{const r=new AbortController;return fetch(E,{credentials:"same-origin",signal:r.signal}).then(e=>{if(!e.ok)throw new Error(`Cathode Angles: source request failed (${e.status})`);return e.text()}).then(e=>o(be(e))).catch(e=>{e instanceof DOMException&&e.name==="AbortError"||console.error(e)}),()=>r.abort()},[]);const n=c.useCallback(r=>{r.contentWindow?.postMessage({type:"cathode-shot-cycle"},"*"),r.closest(".reference-motion-scene")?.querySelectorAll(".reference-motion-scene__line").forEach(m=>{for(const h of m.getAnimations())h.currentTime=0})},[]);return i?s.jsx(N,{applyScene:n,className:`cathode-angles-scene${t?` ${t}`:""}`,backgroundCanvasSelector:"#gl",sourceUrl:E,srcDoc:i,title:"Cathode — workstation angles",style:a}):s.jsx("div",{className:`web3dkit-background cathode-angles-scene${t?` ${t}`:""}`,"data-state":"loading",style:{background:"#080808",...a}})}const ve=["keyboard-cascade","wallet-slots","cathode-session","cathode-charts","cathode-angles","emberline-signal","iridis-spectrum","glitter-pilot","liquid-minutes","retro-shift-gate"],Se={"keyboard-cascade":`CARRY ONLY
WHAT MATTERS.`,"wallet-slots":`FOUR SLOTS.
NOT FIVE.

EVERY CARD
WITHIN REACH.

CARRY ONLY
WHAT MATTERS.`,"cathode-session":`Built for the
Long Session`,"cathode-charts":`The line kept
climbing.

One late
night at a time.

Reached
1 million views.`,"cathode-angles":`Drawn line
by line.

Answered key
by key.

One exact
workstation.`,"emberline-signal":`Every GPU,
fully saturated`,"iridis-spectrum":`LIGHT NEVER
SITS STILL.`,"glitter-pilot":`ONE OF ONE.
PLAY LIKE IT.`,"liquid-minutes":`EVERY SECOND
CHANGES SHAPE.`,"retro-shift-gate":`CHOOSE THE
MACHINE YOU
BECOME.`},Ee={"keyboard-cascade":"Mechanical wallet motion composition","wallet-slots":"Mechanical wallet slot motion composition","cathode-session":"Cathode workstation motion composition","cathode-charts":"Cathode analytics chart motion composition","cathode-angles":"Cathode workstation motion composition seen from three angles","emberline-signal":"Emberline vortex motion composition","iridis-spectrum":"Iridis diffraction card motion composition","glitter-pilot":"Holographic player card motion composition","liquid-minutes":"Liquid clock motion composition","retro-shift-gate":"Retro metallic selector motion composition"};function M(){if(typeof window>"u")return;const t=new URLSearchParams(window.location.search);if(t.get("capture")!=="preview"||t.get("renderer")!=="live")return;const a=window.location.hash.match(/^#frame=(\d{1,3})$/);if(a)return Math.min(299,Number(a[1]))/30}function Oe({variant:t,tuning:a}){switch(t){case"cathode-session":return s.jsx(F,{variant:"workstation",presentation:"background"});case"cathode-charts":return s.jsx(re,{});case"wallet-slots":return s.jsx(ye,{...a});case"cathode-angles":return s.jsx(Te,{});case"emberline-signal":return s.jsx(I,{variant:"vortex",presentation:"background"});case"iridis-spectrum":return s.jsx(W,{});case"glitter-pilot":return s.jsx(j,{});case"liquid-minutes":return s.jsx(U,{});case"retro-shift-gate":return s.jsx(q,{variant:"agent-selector"});default:return s.jsx(V,{variant:"wallet"})}}function ze({variant:t,message:a,time:i,shotSeconds:o,framing:n,pushIn:r,lift:e,className:m="",style:h}){const O=typeof window>"u"?void 0:window.location.pathname.split("/").filter(Boolean).at(-1),g=t??O,p=ve.includes(g)?g:"keyboard-cascade",w=c.useRef(null),[u,l]=c.useState(!0),[b,y]=c.useState(()=>typeof document>"u"||!document.hidden),[C,$]=c.useState(M);c.useEffect(()=>{const d=w.current;if(!d||typeof IntersectionObserver>"u")return;const f=new IntersectionObserver(([v])=>{l(v?.isIntersecting??!0)},{rootMargin:"80px"});return f.observe(d),()=>f.disconnect()},[]),c.useEffect(()=>{if(typeof document>"u")return;const d=()=>y(!document.hidden);return document.addEventListener("visibilitychange",d),()=>document.removeEventListener("visibilitychange",d)},[]),c.useEffect(()=>{if(typeof window>"u")return;const d=()=>$(M());return window.addEventListener("hashchange",d),()=>window.removeEventListener("hashchange",d)},[]);const T=(a?.trim()||Se[p]).split(/\n[ \t]*\n+/).map(d=>d.split(/\n+/).map(f=>f.trim()).filter(Boolean).slice(0,3)).filter(d=>d.length>0).slice(0,3),P=typeof i=="number"?i:C,H=typeof P=="number",B=typeof o=="number"&&o>0,X={...h,"--reference-motion-time":`${H?Math.max(0,P%10):0}s`,"--reference-motion-state":H?"paused":"running",...B?{"--reference-motion-shot-length":`${o}s`,"--reference-motion-duration":`${(o*T.length).toFixed(3)}s`}:null};return s.jsxs("div",{ref:w,className:`web3dkit-background reference-motion-scene${m?` ${m}`:""}`,role:"img","aria-label":Ee[p],"data-variant":p,"data-state":u&&b?"playing":"paused",style:X,children:[s.jsx("div",{className:"reference-motion-scene__visual","aria-hidden":"true",children:u&&b?s.jsx(Oe,{variant:p,tuning:{shotSeconds:o,framing:n,pushIn:r,lift:e}}):null}),s.jsx("h1",{className:"reference-motion-scene__headline","data-shots":T.length,"aria-label":T.map(d=>d.join(" ")).join(" — "),children:T.map((d,f)=>s.jsx("span",{className:"reference-motion-scene__shot","data-shot":f+1,style:{"--reference-motion-shot":f},children:d.map((v,A)=>s.jsx("span",{className:"reference-motion-scene__row",children:s.jsx("span",{className:"reference-motion-scene__line","data-line":A+1,style:{"--reference-motion-line":A},"aria-hidden":"true",children:v})},`${v}-${A}`))},`shot-${f}`))})]})}export{ve as REFERENCE_MOTION_VARIANTS,ze as ReferenceMotionScene};
