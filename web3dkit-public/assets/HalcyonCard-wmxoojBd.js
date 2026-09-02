import{r as e,j as p}from"./index-fOQwe-l-.js";const w=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Halcyon — Card</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%;background:#100b06;overflow:hidden;
    -webkit-font-smoothing:antialiased;
    font-family:Futura,"Century Gothic","Avenir Next","Trebuchet MS",system-ui,sans-serif}
  #gl{position:fixed;inset:0;width:100%;height:100%;display:block;cursor:default;touch-action:none}
  #hint{position:fixed;left:0;right:0;bottom:30px;text-align:center;color:#8d7a5c;
    font-size:10px;letter-spacing:.34em;text-transform:uppercase;pointer-events:none;
    opacity:0;transition:opacity .9s ease .7s;font-weight:400}
  #hint.on{opacity:.6}
</style>
</head>
<body>
<canvas id="gl"></canvas>
<div id="hint">Tap the card</div>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================================
   HALCYON — a retro card sleeve, built in three.js.
   Beige damier leather with real pebble-grain lighting; a black-and-gold
   charge card that slides out and turns over. World units are design pixels
   at z = 0, so canvas-drawn type stays pixel-crisp.
   ========================================================================== */

const UI   = 'Futura,"Century Gothic","Avenir Next","Trebuchet MS",system-ui,sans-serif';
const DISP = '"Bodoni 72","Bodoni MT",Didot,"Playfair Display",Georgia,serif';

const BRAND = {
  monogram : 'H',
  network  : 'ORBIS',
  tier     : 'Private Reserve',
  since    : "Member since '74",
  holder   : 'Marlowe Vance',
  last4    : '4417',
  pan      : '5219 0473 8846 4417',
  exp      : '07/31',
  cvv      : '318',
  frontCta : 'See card details',
  panelHead: 'Card controls',
  rowLock  : 'Freeze card',
  rowShow  : 'Show PIN',
  rowReset : 'Reset PIN',
  frozen   : 'Frozen'
};

/* ---------------------------------------------------------------- geometry */
const D = {
  contW:480, contRest:326, contOpen:640, contR:34, bezel:15,
  cardW:448, cardH:283, cardR:18, cardT:3.4,   /* 34 outer − 16 gap = concentric */
  cardYRest:9, cardYOpen:156, cardZRest:0, cardZOpen:7,
  stripeH:56,
  flapH:250, flapWaveUp:203.5, flapDip:24,
  rowY:[358,423,488], rowH:52, rowX:22, rowW:436,   /* 34 − 22 = r12, concentric */
  headY:340, closeY:576, closeR:26
};

/* --------------------------------------------------------------- renderer */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setClearColor(0x100b06, 1);
const MAXA = renderer.capabilities.getMaxAnisotropy();

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 10, 4000);

let scale = 1, worldH = 790, worldW = 1280, camD = 1400;
let vw = 0, vh = 0, dpr = 1;

function layout(){
  vw = Math.max(320, window.innerWidth  || 1280);
  vh = Math.max(320, window.innerHeight ||  800);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  scale = Math.min(vw/620, vh/790);
  scale = Math.max(0.46, Math.min(scale, 1.5));
  worldH = vh/scale; worldW = vw/scale;
  camD = (worldH/2)/Math.tan(THREE.MathUtils.degToRad(10));
  camera.fov = 20; camera.aspect = vw/vh;
  camera.position.set(0,0,camD);
  camera.near = camD*0.05; camera.far = camD*3;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(dpr);
  renderer.setSize(vw, vh, false);
  onResizeTextures();
}

/* ============================================================ glsl helpers */
const GLSL = \`
  #define TAU 6.28318530718
  float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; return fract(p*(p+p)); }
  float hash21(vec2 p){ p=fract(p*vec2(127.31,311.7)); p+=dot(p,p+34.23); return fract(p.x*p.y); }
  vec2  hash22(vec2 p){
    vec3 q = fract(vec3(p.xyx)*vec3(0.1031,0.1030,0.0973));
    q += dot(q, q.yzx+33.33);
    return fract((q.xx+q.yz)*q.zy);
  }
  float vnoise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
  float fbm(vec2 p){ float s=0.,a=0.5; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.07; a*=0.5; } return s; }

  /* worley F1 with its analytic gradient — the pebble grain of the leather */
  float worley(vec2 p, out vec2 grad){
    vec2 ip=floor(p), fp=fract(p);
    float d=8.0; vec2 best=vec2(0.0);
    for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
      vec2 g=vec2(float(x),float(y));
      vec2 o=hash22(ip+g);
      vec2 r=g+o-fp;
      float l=length(r);
      if(l<d){ d=l; best=r; }
    }
    grad = -best/max(d,1e-4);
    return d;
  }

  float sdRound(vec2 p, vec2 b, float r){ vec2 q=abs(p)-b+r; return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r; }

  /* continuous arc-length-ish parameter around a rounded rect (for stitching).
     The corner branch must never reach atan(0,0) — that is undefined in GLSL and
     returns NaN on some drivers, which then poisons the whole fragment.        */
  float contourS(vec2 p, vec2 b, float r){
    vec2 a=abs(p); vec2 c=max(b-r, vec2(0.001));
    if(a.x<=c.x && a.y>=c.y) return a.x;                            // top / bottom run
    if(a.y<=c.y && a.x>=c.x) return c.x + r*1.5707963 + (c.y-a.y);  // side run
    if(a.x< c.x && a.y< c.y) return a.x;                            // interior, unused
    vec2 q=max(a-c, vec2(0.0));
    return c.x + r*atan(q.y, max(q.x,1e-4));
  }

  /* damier: k is 0/1 per tile, edge is the distance in px to the nearest tile
     border and dir is d(edge)/dp, so a groove can be differentiated cheaply */
  void damier(vec2 p, float sz, out float k, out float edge, out vec2 dir){
    vec2 c = p/sz;
    k = mod(floor(c.x)+floor(c.y), 2.0);
    vec2 f = fract(c);
    float mx = min(f.x, 1.0-f.x), my = min(f.y, 1.0-f.y);
    if(mx < my){ edge = mx*sz; dir = vec2(f.x < 1.0-f.x ? 1.0 : -1.0, 0.0); }
    else       { edge = my*sz; dir = vec2(0.0, f.y < 1.0-f.y ? 1.0 : -1.0); }
  }
  float damierK(vec2 p, float sz){ vec2 c=p/sz; return mod(floor(c.x)+floor(c.y),2.0); }
\`;

/* ---------------------------------------------------------------- leather */
/* Shared beige-leather surface: pebble grain -> height -> normal -> lighting.
   \`mode\` 0 = plain saddle-tan trim, 1 = damier-embossed body.               */
const LEATHER = \`
  uniform vec3 uKey;

  /* Fine-grain beige leather. mode 0 = burnished trim, 1 = damier-embossed body.
     The normal comes from one worley lookup with its analytic gradient.        */
  vec3 leather(vec2 p, float mode, float shade, float burnish){
    float gs = (mode < 0.5) ? 0.46 : 0.330;      /* trim is a finer, tighter grain */
    vec2 wg;
    float w  = worley(p*gs, wg);
    float wc = clamp(w*1.75, 0.0, 1.0);
    float pebble = wc*wc*(3.0-2.0*wc);
    float amp = (mode < 0.5) ? 0.36 : 0.48;
    vec2  dh = wg * (6.0*wc*(1.0-wc)*1.75*gs*amp);

    /* second, much finer pore layer — this is what reads as real hide */
    vec2 wg2;
    float w2 = worley(p*1.25 + vec2(31.0,17.0), wg2);
    float wc2= clamp(w2*2.30, 0.0, 1.0);
    float pore = wc2*wc2*(3.0-2.0*wc2);
    dh += wg2 * (6.0*wc2*(1.0-wc2)*2.30*1.25*0.038);

    float f1 = fbm(p*0.62);
    float fx = fbm(p*0.62 + vec2(0.40,0.0));
    float fy = fbm(p*0.62 + vec2(0.0,0.40));
    dh += vec2(fx-f1, fy-f1) * (0.16*0.62/0.40);

    /* long soft creases running through the hide */
    float c1 = fbm(p*0.125);
    float cx = fbm(p*0.125 + vec2(0.42,0.0));
    float cy = fbm(p*0.125 + vec2(0.0,0.42));
    float ridge = pow(clamp(1.0 - abs(c1-0.5)*3.2, 0.0, 1.0), 8.0);
    dh += vec2(cx-c1, cy-c1)*(1.0/0.42)*ridge*0.40;

    float tone = 0.0;
    if(mode > 0.5){
      float k, edge; vec2 dir;
      damier(p, 15.5, k, edge, dir);
      float groove = exp(-pow(edge/0.95, 2.0));
      dh += dir * groove * (2.0*edge/0.90) * 0.26;
      tone = k;
      float wv = 4.6;                              /* fine coated-canvas weave */
      dh += vec2(cos(p.x*wv), cos(p.y*wv)) * (0.5*0.022*wv);
    }

    vec3 N = normalize(vec3(-dh.x, -dh.y, 1.0));
    vec3 L = normalize(uKey);
    vec3 Hv= normalize(L + vec3(0.0,0.0,1.0));

    float dif  = max(dot(N,L), 0.0);
    float spec = pow(max(dot(N,Hv),0.0), mix(30.0,88.0,burnish)) * mix(1.0,2.2,burnish);
    float amb  = 0.60 + 0.10*N.y;

    /* sand-beige damier canvas, or the darker burnished trim */
    vec3 albedo = mix(vec3(0.818,0.756,0.644), vec3(0.722,0.658,0.542), tone);
    if(mode < 0.5) albedo = vec3(0.566,0.482,0.372);
    albedo *= 1.0 - 0.34*burnish;                  /* painted edge darkens */
    albedo *= 0.95 + 0.11*fbm(p*0.045);
    albedo *= 1.0 - ridge*0.055;                   /* creases sit darker */
    albedo *= shade;

    vec3 col = albedo*(amb + dif*0.44);
    col += vec3(1.0,0.965,0.905)*spec*0.105;
    col *= 1.0 - 0.14*(1.0-pebble) - 0.045*(1.0-pore);
    return col;
  }

  /* fine slanted saddle stitch running along a contour */
  vec3 saddleStitch(vec3 col, float dist, float s, float pitch, float len){
    float ph = fract(s/pitch);
    float slant = (ph-0.5)*2.2;
    float dd = abs(dist + slant);
    float on = step(0.5-len*0.5, ph)*step(ph, 0.5+len*0.5);
    float thread = exp(-pow(dd/0.62,2.0))*on;
    float hole   = exp(-pow((dd-1.42)/0.70,2.0))*on;
    col = mix(col, col*0.76, hole*0.28);
    col = mix(col, vec3(0.884,0.832,0.720), thread*0.58);
    return col;
  }
\`;

/* ------------------------------------------------------------- background */
{
  const m = new THREE.ShaderMaterial({
    uniforms:{ uSize:{value:new THREE.Vector2(1,1)} },
    vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
    fragmentShader:\`
      varying vec2 vUv; uniform vec2 uSize; \${GLSL}
      void main(){
        vec2 p=(vUv-0.5)*uSize;
        float r=length(p*vec2(1.0,1.20))/(uSize.y*0.78);
        vec3 col = vec3(0.0620,0.0432,0.0272);
        col += vec3(0.0300,0.0208,0.0122)*smoothstep(1.0,0.0,r);
        col -= vec3(0.0270,0.0190,0.0120)*smoothstep(0.45,1.30,r);
        col += (hash21(vUv*uSize*0.73)-0.5)*0.013;
        gl_FragColor = vec4(max(col,vec3(0.0)),1.0);
      }\`,
    depthWrite:false, depthTest:false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), m);
  mesh.position.z = -300; mesh.renderOrder = 0;
  scene.add(mesh);
  window.__bg = mesh;
}

/* ------------------------------------------------------------ soft shadow */
function softRectMesh(renderOrder){
  const m = new THREE.ShaderMaterial({
    uniforms:{ uSize:{value:new THREE.Vector2(1,1)}, uBox:{value:new THREE.Vector2(1,1)},
               uRadius:{value:30}, uBlur:{value:40}, uOpacity:{value:0.6} },
    vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
    fragmentShader:\`
      varying vec2 vUv; uniform vec2 uSize,uBox; uniform float uRadius,uBlur,uOpacity;
      \${GLSL}
      void main(){
        vec2 p=(vUv-0.5)*uSize;
        float d=sdRound(p,uBox,uRadius);
        float a=1.0-smoothstep(-uBlur, uBlur*0.75, d);
        gl_FragColor=vec4(0.020,0.010,0.004, pow(a,1.25)*uOpacity);
      }\`,
    transparent:true, depthWrite:false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), m);
  mesh.renderOrder = renderOrder;
  return mesh;
}
const contShadow = softRectMesh(1); contShadow.position.z = -30; scene.add(contShadow);
const cardShadow = softRectMesh(4); scene.add(cardShadow);

const KEY = new THREE.Vector3(-0.34, 0.60, 0.72).normalize();

/* --------------------------------------------------------------- container */
const containerMat = new THREE.ShaderMaterial({
  uniforms:{
    uSize:{value:new THREE.Vector2(D.contW+90, D.contOpen+90)},
    uBox:{value:new THREE.Vector2(D.contW/2, D.contRest/2)},
    uRadius:{value:D.contR}, uBezel:{value:D.bezel},
    uKey:{value:KEY.clone()}
  },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize,uBox; uniform float uRadius,uBezel;
    \${GLSL}
    \${LEATHER}
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      float d=sdRound(p,uBox,uRadius);
      float aa=max(fwidth(d),0.6);
      float alpha=1.0-smoothstep(-aa,aa,d);
      if(alpha<0.002) discard;

      float vy = (p.y+uBox.y)/(2.0*uBox.y);

      /* --- woven check lining --- */
      float k,edge; vec2 kd; damier(p+vec2(3.0,5.0), 9.0, k, edge, kd);
      float weft = exp(-pow(edge/0.75,2.0));
      vec3 lin = mix(vec3(0.1720,0.1330,0.0900), vec3(0.1330,0.1000,0.0660), k);
      lin *= 0.90 + 0.20*fbm(p*0.9);
      lin *= 1.0 - 0.26*weft;
      float thr = 0.5+0.5*sin((p.x+p.y)*1.9);
      lin *= 0.96 + 0.08*thr;
      lin *= mix(0.66, 1.12, smoothstep(0.0,1.0,vy));
      lin += vec3(0.026,0.019,0.011)*pow(max(0.0,1.0-abs(p.x)/uBox.x),3.0);

      /* --- tan leather trim (only shaded where the bezel shows) --- */
      float bez = smoothstep(-uBezel-1.2, -uBezel+1.2, d);
      float burn = smoothstep(-6.0, -0.5, d);
      vec3 trim = (bez > 0.003) ? leather(p, 0.0, mix(1.0, 0.62, smoothstep(0.35,0.0,vy)), burn) : lin;
      vec3 col = mix(lin, trim, bez);

      /* inner wall where the trim meets the well */
      float wall = exp(-pow((d+uBezel)/3.2,2.0));
      col *= 1.0-0.30*wall*step(d,-uBezel);
      col += vec3(0.055,0.043,0.028)*exp(-pow((d+uBezel-1.8)/2.4,2.0));

      /* rolled outer edge */
      float rim = exp(-pow((d+1.6)/2.0,2.0));
      float up  = clamp(0.5+0.5*normalize(vec2(p.x,p.y)+1e-5).y,0.0,1.0);
      col += rim*(0.030+0.115*up)*bez;
      col *= 1.0-0.55*smoothstep(-1.6,0.0,d);

      /* stitching */
      float s=contourS(p,uBox,uRadius);
      col = saddleStitch(col, d+uBezel*0.50, s, 9.0, 0.46);

      gl_FragColor=vec4(col, alpha);
    }\`,
  transparent:true, depthWrite:false
});
const containerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), containerMat);
containerMesh.renderOrder = 2; containerMesh.position.z = -14;
scene.add(containerMesh);

/* -------------------------------------------------------------------- flap */
const flapMat = new THREE.ShaderMaterial({
  uniforms:{
    uSize:{value:new THREE.Vector2(D.contW, D.flapH)},
    uBox:{value:new THREE.Vector2(D.contW/2, 400)},
    uRadius:{value:D.contR}, uWave:{value:D.flapWaveUp-D.flapH/2}, uDip:{value:D.flapDip},
    uOpacity:{value:1}, uBaseY:{value:-D.flapH/2}, uBezel:{value:D.bezel},
    uKey:{value:KEY.clone()}
  },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize,uBox;
    uniform float uRadius,uWave,uDip,uOpacity,uBaseY,uBezel;
    \${GLSL}
    \${LEATHER}
    float waveY(float x01){
      float b = smoothstep(0.14,0.50,x01)*smoothstep(0.86,0.50,x01);
      b = b*b*(3.0-2.0*b);
      return uWave - uDip*b;
    }
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      vec2 bp = vec2(p.x, p.y - (uBox.y + uBaseY));
      float dr=sdRound(bp,uBox,uRadius);
      float wy=waveY(vUv.x);
      float dw=p.y-wy;
      float d=max(dr,dw);
      float aa=max(fwidth(d),0.6);
      float alpha=(1.0-smoothstep(-aa,aa,d))*uOpacity;
      if(alpha<0.003) discard;

      float vy = clamp((p.y - uBaseY)/(uSize.y*0.92), 0.0, 1.0);

      float bez = smoothstep(-uBezel-1.2, -uBezel+1.2, dr);
      float lip = smoothstep(-11.0, -1.0, dw);          // the cut top edge is trim too
      float labelTop = uBaseY + 64.0;                   // plain leather band for the row
      float label = smoothstep(labelTop+0.9, labelTop-0.9, p.y);
      float tm = max(max(bez, lip), label);
      float burn = max(smoothstep(-6.0,-0.5,dr), smoothstep(-5.0,-0.5,dw));
      vec3 body = (tm < 0.997) ? leather(p+vec2(0.0,140.0), 1.0, mix(0.86,1.05,smoothstep(0.0,0.55,vy)), 0.0) : vec3(0.0);
      vec3 trim = (tm > 0.003) ? leather(p+vec2(0.0,140.0), 0.0, mix(0.82,1.02,smoothstep(0.0,0.55,vy)), burn) : vec3(0.0);
      vec3 col = mix(body, trim, tm);
      col = saddleStitch(col, (p.y-labelTop)+7.0, p.x, 9.0, 0.46);

      /* burnished cut edge along the wave */
      float cut = exp(-pow(dw/2.0,2.0));
      col = mix(col, col*0.58, cut*0.75);
      col += vec3(0.12,0.10,0.07)*exp(-pow((dw+2.6)/1.6,2.0));

      /* stitch along the wave, then around the outside */
      col = saddleStitch(col, dw+10.0, p.x, 9.0, 0.46);
      float s=contourS(bp,uBox,uRadius);
      if(dw < -2.0) col = saddleStitch(col, dr+uBezel*0.50, s, 9.0, 0.46);

      float rim = exp(-pow((dr+1.6)/2.0,2.0));
      float up  = clamp(0.5+0.5*normalize(vec2(bp.x,bp.y)+1e-5).y,0.0,1.0);
      col += rim*(0.020+0.070*up)*step(dw,-1.0);
      col *= 1.0-0.50*smoothstep(-1.6,0.0,dr);

      gl_FragColor=vec4(col,alpha);
    }\`,
  transparent:true, depthWrite:false
});
const flapMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), flapMat);
flapMesh.scale.set(D.contW, D.flapH, 1);
flapMesh.position.z = 26; flapMesh.renderOrder = 8;
scene.add(flapMesh);

/* shadow the pocket lip throws back onto the card */
const lipShadowMat = new THREE.ShaderMaterial({
  uniforms:{ uSize:{value:new THREE.Vector2(D.contW, 90)}, uWave:{value:0}, uDip:{value:D.flapDip}, uOpacity:{value:1} },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize; uniform float uWave,uDip,uOpacity;
    float waveY(float x01){ float b=smoothstep(0.14,0.50,x01)*smoothstep(0.86,0.50,x01); b=b*b*(3.0-2.0*b); return uWave-uDip*b; }
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      float dw=p.y-waveY(vUv.x);
      float a=exp(-pow(max(dw,0.0)/12.0,1.4))*step(0.0,dw);
      a*= smoothstep(0.0,0.06,vUv.x)*smoothstep(1.0,0.94,vUv.x);
      gl_FragColor=vec4(0.0,0.0,0.0,a*0.30*uOpacity);
    }\`,
  transparent:true, depthWrite:false
});
const lipShadow = new THREE.Mesh(new THREE.PlaneGeometry(1,1), lipShadowMat);
lipShadow.scale.set(D.contW, 90, 1);
lipShadow.position.z = 24; lipShadow.renderOrder = 7;
scene.add(lipShadow);

/* ============================================================ canvas plate */
function mkCanvas(w,h,res){
  const c=document.createElement('canvas');
  c.width=Math.max(2,Math.round(w*res)); c.height=Math.max(2,Math.round(h*res));
  c.getContext('2d').scale(res,res);
  return c;
}
function rr(x,x0,y0,w,h,r){ r=Math.min(r,w/2,h/2);
  x.beginPath(); x.moveTo(x0+r,y0);
  x.arcTo(x0+w,y0,x0+w,y0+h,r); x.arcTo(x0+w,y0+h,x0,y0+h,r);
  x.arcTo(x0,y0+h,x0,y0,r);     x.arcTo(x0,y0,x0+w,y0,r); x.closePath();
}
/* letterspaced draw — \`letterSpacing\` is not universal, so space by hand */
function tracked(x, str, px, py, track, align){
  const chars=[...str];
  let w=0; for(const c of chars) w += x.measureText(c).width + track;
  w -= track;
  let cx = align==='right' ? px-w : align==='center' ? px-w/2 : px;
  const prev = x.textAlign; x.textAlign='left';
  for(const c of chars){ x.fillText(c, cx, py); cx += x.measureText(c).width + track; }
  x.textAlign = prev;
  return w;
}
function trackedWidth(x, str, track){
  let w=0; for(const c of [...str]) w += x.measureText(c).width + track;
  return w-track;
}
function goldGrad(x, x0, y0, x1, y1){
  const g=x.createLinearGradient(x0,y0,x1,y1);
  g.addColorStop(0.00,'#9a7f45'); g.addColorStop(0.20,'#e7d7ae');
  g.addColorStop(0.40,'#c3a765'); g.addColorStop(0.60,'#f2e7c6');
  g.addColorStop(0.80,'#b79f63'); g.addColorStop(1.00,'#dccfa6');
  return g;
}

/* ------------------------------------------------------------ house mark */
/* A lozenge enclosing three tapering chevrons: flight, drawn as geometry so it
   rhymes with the damier and stays legible down to a few pixels.            */
function drawMark(x, x0, y0, s, colour){
  const k=s/100;
  x.save(); x.translate(x0,y0); x.scale(k,k);
  x.strokeStyle=colour; x.lineJoin='miter'; x.lineCap='butt'; x.miterLimit=6;
  x.lineWidth=4.6;
  x.beginPath(); x.moveTo(50,4); x.lineTo(96,50); x.lineTo(50,96); x.lineTo(4,50); x.closePath(); x.stroke();
  x.lineWidth=7.6;
  const rows=[[34,26,15],[52,19.5,12.5],[67,13,10.5]];
  for(const r of rows){
    x.beginPath(); x.moveTo(50-r[1], r[0]+r[2]); x.lineTo(50, r[0]); x.lineTo(50+r[1], r[0]+r[2]); x.stroke();
  }
  x.restore();
}

/* ------------------------------------------------ orbis mark: a ringed globe */
function drawOrbis(x, cx, cy, r, stroke, lw){
  x.save(); x.translate(cx,cy);
  x.strokeStyle=stroke; x.lineWidth=lw; x.lineCap='round';
  x.beginPath(); x.arc(0,0,r,0,Math.PI*2); x.stroke();
  x.beginPath(); x.ellipse(0,0,r*0.40,r,0,0,Math.PI*2); x.stroke();
  x.beginPath(); x.moveTo(-r,0); x.lineTo(r,0); x.stroke();
  x.beginPath(); x.moveTo(-r*0.86,-r*0.50); x.lineTo(r*0.86,-r*0.50); x.stroke();
  x.beginPath(); x.moveTo(-r*0.86, r*0.50); x.lineTo(r*0.86, r*0.50); x.stroke();
  x.restore();
}

/* ---------------------------------------------------------- retro gold chip */
function drawChip(x, x0, y0, w, h){
  const g = goldGrad(x, x0, y0, x0+w, y0+h);
  rr(x,x0,y0,w,h,4.5); x.fillStyle=g; x.fill();
  x.strokeStyle='rgba(60,42,10,0.55)'; x.lineWidth=0.8; x.stroke();
  x.save(); rr(x,x0,y0,w,h,4.5); x.clip();
  x.strokeStyle='rgba(48,34,8,0.48)'; x.lineWidth=1.0;
  const cy=y0+h/2;
  x.beginPath(); x.moveTo(x0,cy-h*0.22); x.lineTo(x0+w,cy-h*0.22);
  x.moveTo(x0,cy+h*0.22); x.lineTo(x0+w,cy+h*0.22);
  x.moveTo(x0+w*0.32,y0); x.lineTo(x0+w*0.32,y0+h);
  x.moveTo(x0+w*0.68,y0); x.lineTo(x0+w*0.68,y0+h); x.stroke();
  x.beginPath(); rr(x,x0+w*0.32,cy-h*0.22,w*0.36,h*0.44,1.5); x.stroke();
  x.restore();
}

/* ------------------------------------------------------------- line icons */
function iconEye(x, cx, cy, s, stroke, lw, slashed){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath();
  x.moveTo(-9,0); x.bezierCurveTo(-5.2,-5.8, 5.2,-5.8, 9,0);
  x.bezierCurveTo(5.2,5.8,-5.2,5.8,-9,0); x.closePath(); x.stroke();
  x.beginPath(); x.arc(0,0,2.6,0,Math.PI*2); x.stroke();
  if(slashed>0.02){
    x.globalAlpha=Math.min(1,slashed*3);
    x.beginPath(); x.moveTo(-8.6,-7.0); x.lineTo(8.6,7.0); x.stroke();
  }
  x.restore();
}
/* the reveal control is a rubber stamp, same language as the FROZEN mark */
const EYE = {x:400, y:242, w:43, h:28, rot:-0.075};
function eyeStampFrame(x, colour){
  x.save(); x.translate(EYE.x, EYE.y); x.rotate(EYE.rot);
  x.strokeStyle=colour; x.lineWidth=1.5;
  rr(x, -EYE.w/2, -EYE.h/2, EYE.w, EYE.h, 5); x.stroke();
  x.lineWidth=0.7;
  rr(x, -EYE.w/2+3.2, -EYE.h/2+3.2, EYE.w-6.4, EYE.h-6.4, 2.6); x.stroke();
  x.restore();
}
function iconLock(x, cx, cy, s, stroke, lw){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath();
  x.moveTo(-3.5,-1.0); x.lineTo(-3.5,-4.2);
  x.arc(0,-4.2,3.5,Math.PI,0); x.lineTo(3.5,-1.0); x.stroke();
  x.beginPath(); rr(x,-5.4,-1.0,10.8,8.4,1.8); x.stroke();
  x.beginPath(); x.moveTo(0,2.0); x.lineTo(0,4.6); x.stroke();
  x.restore();
}
function iconChevron(x, cx, cy, s, stroke, lw){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath(); x.moveTo(-2.6,-5.4); x.lineTo(2.8,0); x.lineTo(-2.6,5.4); x.stroke();
  x.restore();
}

/* ====================================================== studio environment */
/* A small equirectangular studio, painted once and sampled by the card's
   reflection vector — this is what makes the metal read as metal.          */
let texEnv=null, texEnvBlur=null;
function buildEnvTextures(){
  const W=1024, H=512;
  const base=document.createElement('canvas'); base.width=W; base.height=H;
  const x=base.getContext('2d');

  const g=x.createLinearGradient(0,0,0,H);          /* ceiling -> horizon -> floor */
  g.addColorStop(0.00,'#6b6252'); g.addColorStop(0.24,'#4a443a');
  g.addColorStop(0.44,'#221d17'); g.addColorStop(0.494,'#0b0907');
  g.addColorStop(0.506,'#efe3c9');                   /* the horizon streak */
  g.addColorStop(0.52,'#1b1713'); g.addColorStop(0.72,'#121009');
  g.addColorStop(1.00,'#0d0b08');
  x.fillStyle=g; x.fillRect(0,0,W,H);

  function box(u,v,rw,rh,rot,inner,outer){
    x.save(); x.translate(u*W,(1.0-v)*H); x.rotate(rot);
    const rg=x.createRadialGradient(0,0,0,0,0,Math.max(rw,rh));
    rg.addColorStop(0,inner); rg.addColorStop(0.45,inner); rg.addColorStop(1,outer);
    x.globalCompositeOperation='lighter';
    x.scale(rw/Math.max(rw,rh), rh/Math.max(rw,rh));
    x.fillStyle=rg; x.beginPath(); x.arc(0,0,Math.max(rw,rh),0,Math.PI*2); x.fill();
    x.restore();
  }
  box(0.75,0.66, 200, 100, 0,       'rgba(255,250,238,0.92)','rgba(255,250,238,0)');  /* key */
  box(0.75,0.28,  160, 62, 0,       'rgba(150,138,116,0.34)','rgba(150,138,116,0)');  /* bounce */
  box(0.06,0.55, 140, 78, 0,        'rgba(214,158,84,0.50)', 'rgba(214,158,84,0)');   /* warm fill */
  box(0.30,0.74,  96, 52, 0,        'rgba(122,132,150,0.26)','rgba(122,132,150,0)');  /* cool fill */

  /* crisp strip lights — these are what give metal its hard streaks */
  function strip(u,v,w,h,a,soft){
    x.save(); x.globalCompositeOperation='lighter';
    x.filter = soft ? 'blur('+soft+'px)' : 'none';
    x.fillStyle='rgba(255,252,244,'+a+')';
    x.fillRect(u*W-w/2, (1.0-v)*H-h/2, w, h);
    x.filter='none'; x.restore();
  }
  strip(0.58,0.62,  16,200, 1.00, 2);
  strip(0.63,0.62,   7,200, 0.85, 1.5);
  strip(0.68,0.61,   4,180, 0.65, 1);
  strip(0.90,0.60,  12,160, 0.85, 2);
  strip(0.20,0.64,   9,150, 0.62, 2);
  strip(0.36,0.63,   5,140, 0.45, 1.5);
  strip(0.50,0.87, 340, 20, 0.60, 7);

  const t=new THREE.CanvasTexture(base);
  t.wrapS=THREE.RepeatWrapping; t.wrapT=THREE.ClampToEdgeWrapping;
  t.minFilter=THREE.LinearMipmapLinearFilter; t.magFilter=THREE.LinearFilter;
  t.anisotropy=MAXA; t.needsUpdate=true;

  /* blurred copy — tiled three wide first so the u seam blurs across */
  const b=document.createElement('canvas'); b.width=W; b.height=H;
  const wide=document.createElement('canvas'); wide.width=W*3; wide.height=H;
  const wx=wide.getContext('2d');
  wx.drawImage(base,-0,0); wx.drawImage(base,W,0); wx.drawImage(base,W*2,0);
  const bx=b.getContext('2d');
  bx.filter='blur(26px)';
  bx.drawImage(wide, -W, 0);
  bx.filter='none';
  const tb=new THREE.CanvasTexture(b);
  tb.wrapS=THREE.RepeatWrapping; tb.wrapT=THREE.ClampToEdgeWrapping;
  tb.minFilter=THREE.LinearFilter; tb.magFilter=THREE.LinearFilter;
  tb.generateMipmaps=false; tb.needsUpdate=true;

  texEnv=t; texEnvBlur=tb;
}

/* ============================================================== card faces */
/* Each face is split into a foil-coverage mask (shaded as real metal in the
   fragment shader) and a printed-ink layer (RGBA, composited on top).      */
let texFoilFront=null, texArtFront=null, texFoilBack=null;
let backCanvas=null, texBack=null, backRes=4;
const backState = {reveal:0, eyePress:0};

function microText(x, str, x0, y0, x1, px, alpha){
  x.save(); x.globalAlpha=alpha; x.font=\`400 \${px}px \${UI}\`;
  let cx=x0; const gap=px*0.55;
  while(cx < x1){
    const w=trackedWidth(x,str,px*0.34);
    if(cx+w>x1) break;
    tracked(x,str,cx,y0,px*0.34,'left');
    cx += w+gap;
  }
  x.restore();
}

function buildFrontTextures(res){
  const W=D.cardW, H=D.cardH, R=D.cardR;

  /* ---- foil coverage (white = polished gold) ---- */
  const cf=mkCanvas(W,H,res); const f=cf.getContext('2d');
  f.fillStyle='#000'; f.fillRect(0,0,W,H);
  f.strokeStyle='#fff';

  f.lineWidth=1.0; rr(f,11,11,W-22,H-22,R-11); f.stroke();          /* concentric */
  f.strokeStyle='rgba(255,255,255,0.34)';
  f.lineWidth=0.7; rr(f,15,15,W-30,H-30,R-15); f.stroke();

  f.fillStyle='#fff'; f.textBaseline='alphabetic'; f.textAlign='right';
  let fs=140; f.font=\`400 \${fs}px \${DISP}\`;
  const cap=(f.measureText(BRAND.monogram).actualBoundingBoxAscent||fs*0.7);
  fs=fs*(50/cap);
  f.font=\`400 \${fs}px \${DISP}\`;
  f.fillText(BRAND.monogram, W-38, 36+50);

  f.textAlign='left';
  f.font=\`400 21px \${UI}\`;
  const wmW=trackedWidth(f,BRAND.network.toUpperCase(),4.2);
  tracked(f, BRAND.network.toUpperCase(), W-40-wmW, H-48, 4.2, 'left');
  f.font=\`400 8px \${UI}\`; f.fillStyle='rgba(255,255,255,0.55)';
  tracked(f, BRAND.tier.toUpperCase(), W-40, H-33, 2.6, 'right');

  /* contact chip: eight pads with milled gaps, so the gaps read as gunmetal */
  const cx0=36, cy0=72, cw=50, ch=38, gp=1.6;
  f.fillStyle='rgba(255,255,255,0.90)'; rr(f,cx0,cy0,cw,ch,4.5); f.fill();
  f.save(); rr(f,cx0,cy0,cw,ch,4.5); f.clip();
  f.globalCompositeOperation='destination-out';
  f.lineWidth=gp; f.strokeStyle='#000';
  const mx=cx0+cw*0.36, my=cy0+ch/2;
  f.beginPath();
  f.moveTo(cx0-2, cy0+ch*0.30); f.lineTo(cx0+cw+2, cy0+ch*0.30);
  f.moveTo(cx0-2, cy0+ch*0.70); f.lineTo(cx0+cw+2, cy0+ch*0.70);
  f.moveTo(mx, cy0-2); f.lineTo(mx, cy0+ch*0.30);
  f.moveTo(mx, cy0+ch*0.70); f.lineTo(mx, cy0+ch+2);
  f.moveTo(cx0+cw*0.74, cy0-2); f.lineTo(cx0+cw*0.74, cy0+ch+2);
  f.stroke();
  f.lineWidth=gp*0.9;
  f.beginPath(); rr(f, mx-1, cy0+ch*0.30-1, cw*0.38, ch*0.40, 2); f.stroke();
  f.globalCompositeOperation='source-over';
  f.restore();
  f.strokeStyle='rgba(255,255,255,0.55)'; f.lineWidth=0.8;
  rr(f,cx0+0.4,cy0+0.4,cw-0.8,ch-0.8,4.2); f.stroke();

  /* micro-lettering along the inside of the frame */
  f.fillStyle='#fff'; f.textAlign='left';
  microText(f, 'HALCYON · ORBIS · PRIVATE RESERVE ·', 26, H-19, W-26, 3.4, 0.5);

  const tf=new THREE.CanvasTexture(cf);
  tf.minFilter=THREE.LinearMipmapLinearFilter; tf.magFilter=THREE.LinearFilter;
  tf.anisotropy=MAXA; tf.needsUpdate=true;

  /* ---- printed ink ---- */
  const ca=mkCanvas(W,H,res); const a=ca.getContext('2d');
  a.clearRect(0,0,W,H);
  a.textBaseline='alphabetic'; a.textAlign='left';
  a.font=\`400 8px \${UI}\`;
  a.fillStyle='rgba(228,214,182,0.40)';
  tracked(a, BRAND.since.toUpperCase(), 36, H-33, 2.4, 'left');
  const ta=new THREE.CanvasTexture(ca);
  ta.minFilter=THREE.LinearMipmapLinearFilter; ta.magFilter=THREE.LinearFilter;
  ta.anisotropy=MAXA; ta.needsUpdate=true;

  return [tf,ta];
}

function buildBackFoil(res){
  const W=D.cardW, H=D.cardH, R=D.cardR;
  const cf=mkCanvas(W,H,res); const f=cf.getContext('2d');
  f.fillStyle='#000'; f.fillRect(0,0,W,H);

  /* the printed frame starts below the magnetic stripe — running it under the
     stripe left a clipped stub at the top corners                            */
  const FT = D.stripeH + 12;
  f.strokeStyle='rgba(255,255,255,0.62)'; f.lineWidth=0.9;
  rr(f, 11, FT, W-22, H-11-FT, R-11); f.stroke();

  drawMark(f, 30, 88, 58, '#ffffff');

  eyeStampFrame(f, 'rgba(255,255,255,0.92)');

  f.textAlign='left'; f.fillStyle='#fff';
  microText(f, 'HALCYON \\u00b7 ORBIS \\u00b7 PRIVATE RESERVE \\u00b7', 30, 80, W-30, 3.4, 0.42);

  const tf=new THREE.CanvasTexture(cf);
  tf.minFilter=THREE.LinearMipmapLinearFilter; tf.magFilter=THREE.LinearFilter;
  tf.anisotropy=MAXA; tf.needsUpdate=true;
  return tf;
}

function buildBackCanvas(res){
  backRes=res;
  backCanvas=mkCanvas(D.cardW,D.cardH,res);
  texBack=new THREE.CanvasTexture(backCanvas);
  texBack.minFilter=THREE.LinearMipmapLinearFilter; texBack.magFilter=THREE.LinearFilter;
  texBack.anisotropy=MAXA;
  drawBack();
}

function drawBack(){
  const W=D.cardW,H=D.cardH;
  const x=backCanvas.getContext('2d');
  x.setTransform(backRes,0,0,backRes,0,0);
  x.clearRect(0,0,W,H);

  const LX=30, NUM_X=108, CREAM='rgba(242,233,214,0.95)', DIM='rgba(228,214,184,0.52)';
  const BASE_LBL=230, BASE_VAL=249, BASE_NUM=124;   /* number rides beside the emblem */
  const EXP_X=272, CVV_X=336;

  /* signature panel — the element that actually belongs in this band */
  const SP={x:30, y:158, w:360, h:34};
  x.save();
  rr(x, SP.x, SP.y, SP.w, SP.h, 3.5);
  x.fillStyle='rgba(233,225,206,0.90)'; x.fill();
  x.save(); rr(x, SP.x, SP.y, SP.w, SP.h, 3.5); x.clip();
  x.strokeStyle='rgba(146,124,86,0.20)'; x.lineWidth=0.6;
  for(let i=-SP.h; i<SP.w+SP.h; i+=4){
    x.beginPath(); x.moveTo(SP.x+i, SP.y); x.lineTo(SP.x+i-SP.h, SP.y+SP.h); x.stroke();
  }
  x.fillStyle='rgba(128,106,70,0.22)'; x.font=\`400 4.6px \${UI}\`;
  for(let r=0;r<3;r++){
    let cx2=SP.x+4;
    while(cx2 < SP.x+SP.w-8){
      cx2 += tracked(x, 'HALCYON \\u00b7 ORBIS', cx2, SP.y+9.5+r*9.5, 1.1, 'left') + 6;
    }
  }
  x.restore();
  x.strokeStyle='rgba(255,246,224,0.16)'; x.lineWidth=0.8;
  rr(x, SP.x+0.4, SP.y+0.4, SP.w-0.8, SP.h-0.8, 3.5); x.stroke();
  x.restore();
  x.font=\`400 7px \${UI}\`; x.fillStyle='rgba(224,208,176,0.46)';
  tracked(x,'AUTHORISED SIGNATURE', SP.x+1, SP.y+SP.h+14, 2.0, 'left');

  x.textBaseline='alphabetic'; x.textAlign='left';
  x.font=\`400 8px \${UI}\`; x.fillStyle=DIM;
  tracked(x,'CARDHOLDER',LX,BASE_LBL,2.3,'left');
  tracked(x,'VALID',EXP_X,BASE_LBL,2.3,'left');
  tracked(x,'CVV',CVV_X,BASE_LBL,2.3,'left');

  x.font=\`400 12.5px \${UI}\`; x.fillStyle=CREAM;
  tracked(x,BRAND.holder.toUpperCase(),LX,BASE_VAL,1.5,'left');

  x.font=\`400 17px \${UI}\`;
  const ADV=11.8, GAP=9.5, RISE=16, DOTR=2.4, DOTY=BASE_NUM-5.4, ROLL=0.24;
  function dot(cx, cy, a){
    x.save(); x.globalAlpha=a; x.fillStyle='rgba(238,228,206,0.90)';
    x.beginPath(); x.arc(cx, cy, DOTR, 0, Math.PI*2); x.fill(); x.restore();
  }
  function slot(cx, real, p){
    const e = p<=0?0:(p>=1?1:(p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2));
    x.save();
    x.beginPath(); x.rect(cx-ADV*0.60, BASE_NUM-15, ADV*1.2, 21); x.clip();
    if(e<1) dot(cx, DOTY - e*RISE, Math.pow(1-e,0.9));
    if(e>0){
      x.globalAlpha=Math.pow(e,0.7); x.fillStyle=CREAM; x.textAlign='center';
      x.fillText(real, cx, BASE_NUM + (1-e)*RISE);
    }
    x.restore(); x.globalAlpha=1; x.textAlign='left';
  }
  const pan = BRAND.pan.replace(/ /g,'');
  let cx = NUM_X;
  for(let grp=0; grp<4; grp++){
    for(let i=0;i<4;i++){
      const gi=grp*4+i, cxx=cx+ADV/2;
      if(gi>=12){
        x.save(); x.textAlign='center'; x.fillStyle=CREAM;
        x.fillText(pan[gi], cxx, BASE_NUM); x.restore();
      }else{
        slot(cxx, pan[gi], Math.max(0,Math.min(1,(backState.reveal-(gi/12)*0.50)/ROLL)));
      }
      cx += ADV;
    }
    if(grp<3) cx += GAP;
  }

  x.font=\`400 12.5px \${UI}\`;
  const AD2=9.4;
  function smallSlot(px, ch, p){
    const e=p<=0?0:(p>=1?1:(p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2));
    x.save(); x.beginPath(); x.rect(px-1, BASE_VAL-13, AD2+2, 18); x.clip();
    if(e<1){ x.globalAlpha=Math.pow(1-e,0.9); x.fillStyle='rgba(238,228,206,0.90)';
      x.beginPath(); x.arc(px+AD2/2, BASE_VAL-4.2-e*13, 2.1,0,Math.PI*2); x.fill(); }
    if(e>0){ x.globalAlpha=Math.pow(e,0.7); x.fillStyle=CREAM; x.textAlign='center';
      x.fillText(ch, px+AD2/2, BASE_VAL+(1-e)*13); }
    x.restore(); x.globalAlpha=1; x.textAlign='left';
  }
  let ex=EXP_X;
  for(let i=0;i<BRAND.exp.length;i++){
    const ch=BRAND.exp[i];
    if(ch==='/'){
      x.save(); x.textAlign='center'; x.fillStyle=DIM;
      x.fillText('/', ex+AD2*0.42, BASE_VAL); x.restore(); ex += AD2*0.84;
    }else{
      smallSlot(ex, ch, Math.max(0,Math.min(1,(backState.reveal-(0.50+(i/5)*0.12))/ROLL)));
      ex += AD2;
    }
  }
  let cvx=CVV_X;
  for(let i=0;i<3;i++){
    smallSlot(cvx, BRAND.cvv[i], Math.max(0,Math.min(1,(backState.reveal-(0.62+(i/3)*0.12))/ROLL)));
    cvx += AD2;
  }

  /* the stamp frame is foil; its inked impression is drawn here */
  if(backState.eyePress>0.001){
    x.save(); x.globalAlpha=0.38*(1-backState.eyePress);
    x.translate(EYE.x,EYE.y); x.rotate(EYE.rot);
    x.strokeStyle='rgba(240,226,190,0.9)'; x.lineWidth=1.3;
    const g=backState.eyePress*16;
    rr(x, -EYE.w/2-g, -EYE.h/2-g, EYE.w+g*2, EYE.h+g*2, 5.5+g); x.stroke();
    x.restore();
  }
  x.save(); x.translate(EYE.x,EYE.y); x.rotate(EYE.rot);
  iconEye(x, 0, 0, 0.78, 'rgba(230,204,146,0.90)', 1.6, backState.reveal);
  x.restore();

  if(texBack) texBack.needsUpdate=true;
}

/* ================================================================ the card */
function roundedShape(w,h,r){
  const s=new THREE.Shape();
  const x=-w/2, y=-h/2;
  s.moveTo(x+r,y);
  s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y);
  return s;
}
const cardGeo = new THREE.ExtrudeGeometry(roundedShape(D.cardW,D.cardH,D.cardR),
  {depth:D.cardT, bevelEnabled:false, curveSegments:28, steps:1});
cardGeo.translate(0,0,-D.cardT/2);

const CARD_FRAG = \`
  varying vec2 vUvC; varying vec3 vNw; varying vec3 vWp; varying float vFace;
  uniform sampler2D tFoilF, tArtF, tFoilB, tArtB, tEnv, tEnvB;
  uniform vec2 uCard; uniform vec3 uCam;
  uniform float uLock, uStripe, uGain, uEnvRot;
  \${GLSL}

  vec2 equirectUv(vec3 d){
    d = normalize(d);
    float ax = (abs(d.x) < 1e-5 && abs(d.z) < 1e-5) ? 1e-5 : d.x;
    float u = atan(d.z, ax)*0.15915494 + 0.5 + uEnvRot;
    float v = asin(clamp(d.y,-1.0,1.0))*0.31830989 + 0.5;
    return vec2(u, clamp(v,0.003,0.997));
  }

  void main(){
    vec2 uv = vUvC;
    bool front = vFace > 0.0;
    vec2 tuv = front ? vec2(uv.x, uv.y) : vec2(1.0-uv.x, uv.y);
    float u  = tuv.x;
    float ty = 1.0-uv.y;
    vec2 sp  = vec2(u*uCard.x, ty*uCard.y);

    float stripe = front ? 0.0 : step(ty*uCard.y, uStripe);
    float foil = front ? texture2D(tFoilF, tuv).r : texture2D(tFoilB, tuv).r;

    /* ---- surface: brushed metal, engine-turned check, guilloche rosette --- */
    vec3 N = normalize(vNw);
    vec3 T = normalize(cross(N, vec3(0.0,1.0,0.0)) + vec3(1e-4));
    vec3 B = normalize(cross(N, T));

    float br  = fbm(vec2(sp.x*0.07, sp.y*5.6))-0.5;        /* fine brushing */
    float br2 = vnoise(vec2(sp.x*0.5, sp.y*17.0))-0.5;
    float bump = (br*0.9 + br2*0.5)*0.020;
    bump += (fbm(sp*0.085)-0.5)*0.013;          /* clear-coat orange peel */

    float k=0.0, edge=0.0; vec2 kd=vec2(0.0);
    float rough = 0.20;
    vec2 bump2 = vec2(0.0);
    if(stripe < 0.5){
      damier(sp, 4.6, k, edge, kd);
      rough += (k-0.5)*0.055;                               /* engine-turned check */
      float lip = exp(-pow(edge/0.40,2.0));
      bump2 += kd*lip*0.016;
      rough += lip*0.055;
      /* rosette: concentric guilloche over the lower-left quarter */
      vec2 rc = sp - vec2(uCard.x*0.26, uCard.y*0.70);
      float rr2 = length(rc);
      float th = atan(rc.y, rc.x + 1e-5);
      float ros = sin(rr2*1.55 + 1.10*sin(th*11.0));
      float rosM = smoothstep(100.0, 24.0, rr2);
      rough += ros*0.010*rosM;
      bump2 += normalize(rc+1e-4)*ros*0.0030*rosM;
    }else{
      rough = 0.50 + (vnoise(vec2(sp.x*0.6, sp.y*26.0))-0.5)*0.14;
      bump += (vnoise(vec2(sp.x*0.18, sp.y*34.0))-0.5)*0.022;
      bump += (fbm(vec2(sp.x*0.05, sp.y*3.0))-0.5)*0.016;
    }

    /* foil sits proud of the surface: its edges catch a hard rim, and the
       stamped face is faintly uneven, so it never reads as a flat fill      */
    if(foil > 0.015){
      vec2 tx = vec2(4.2/uCard.x, 4.2/uCard.y);
      float fx = (front ? texture2D(tFoilF, tuv+vec2(tx.x,0.0)).r : texture2D(tFoilB, tuv+vec2(tx.x,0.0)).r)
               - (front ? texture2D(tFoilF, tuv-vec2(tx.x,0.0)).r : texture2D(tFoilB, tuv-vec2(tx.x,0.0)).r);
      float fy = (front ? texture2D(tFoilF, tuv+vec2(0.0,tx.y)).r : texture2D(tFoilB, tuv+vec2(0.0,tx.y)).r)
               - (front ? texture2D(tFoilF, tuv-vec2(0.0,tx.y)).r : texture2D(tFoilB, tuv-vec2(0.0,tx.y)).r);
      bump2 += vec2(fx, -fy)*0.185;
      bump2 += (vec2(fbm(sp*0.030), fbm(sp*0.030+vec2(11.0,5.0)))-0.5)*0.105*foil;
    }
    /* cap the tilt: an unbounded bevel swings the reflection onto the dark
       floor of the studio and stamps a hard black rim around every glyph   */
    float bl = length(bump2);
    if(bl > 0.085) bump2 *= 0.085/bl;
    rough = mix(rough, 0.075, foil);                        /* foil is polished */
    N = normalize(N + T*(bump+bump2.x) + B*(bump*0.35+bump2.y));

    vec3 V = normalize(uCam - vWp);
    vec3 R = reflect(-V, N);
    float NoV = clamp(dot(N,V), 0.0, 1.0);

    /* brushed metal smears its reflection along the grain — three taps in the
       environment's azimuth do the job far more cheaply than a rough BRDF     */
    vec2 e0 = equirectUv(R);
    float spread = 0.0055 + rough*0.026;
    vec3 es = ( texture2D(tEnv, e0).rgb
              + texture2D(tEnv, e0+vec2(spread,0.0)).rgb
              + texture2D(tEnv, e0-vec2(spread,0.0)).rgb ) * (1.0/3.0);
    vec3 eb = texture2D(tEnvB, e0).rgb;
    vec3 refl = mix(es, eb, clamp(rough*2.4, 0.0, 1.0));

    /* ---- metal tint: dark gunmetal, or gold where the foil is ------------- */
    vec3 gun  = vec3(0.146,0.140,0.134);
    vec3 gold = vec3(0.945,0.760,0.398);
    vec3 tint = mix(gun, gold, foil);
    if(stripe > 0.5) tint = vec3(0.104,0.093,0.086);

    vec3 F = tint + (1.0-tint)*pow(1.0-NoV, 5.0)*(1.0-rough*0.8);
    vec3 col = refl * F * uGain;
    float L = dot(col, vec3(0.299,0.587,0.114));
    col = mix(col, vec3(L), smoothstep(0.50,1.05,L)*0.52);   /* specular roll-off */
    col *= 0.975 + 0.05*hash21(sp*1.9);

    /* ---- printed ink ------------------------------------------------------ */
    vec4 art = front ? texture2D(tArtF, tuv) : texture2D(tArtB, tuv);
    if(!front && uLock > 0.001){
      vec2 o = vec2(1.15/uCard.x, 1.15/uCard.y)*uLock;
      vec4 s1=texture2D(tArtB,tuv+vec2(o.x,0.0)), s2=texture2D(tArtB,tuv-vec2(o.x,0.0));
      vec4 s3=texture2D(tArtB,tuv+vec2(0.0,o.y)), s4=texture2D(tArtB,tuv-vec2(0.0,o.y));
      art = mix(art, (art+s1+s2+s3+s4)/5.0, uLock);
    }
    col = mix(col, art.rgb, art.a);

    /* ---- frozen: a warm veil --------------------------------------------- */
    if(uLock > 0.001){
      vec3 frost = col*0.66 + vec3(0.120,0.104,0.082);
      float cloud = fbm(sp*0.075) + 0.5*fbm(sp*0.19+vec2(7.3,2.1));
      frost += (cloud-0.75)*0.030;
      frost += (hash21(sp*2.7)-0.5)*0.012;
      col = mix(col, frost, uLock);
    }

    gl_FragColor = vec4(col, 1.0);
  }
\`;

const cardCapMat = new THREE.ShaderMaterial({
  uniforms:{
    tFoilF:{value:null}, tArtF:{value:null}, tFoilB:{value:null}, tArtB:{value:null},
    tEnv:{value:null}, tEnvB:{value:null},
    uCard:{value:new THREE.Vector2(D.cardW,D.cardH)},
    uCam:{value:new THREE.Vector3()},
    uLock:{value:0}, uStripe:{value:D.stripeH}, uGain:{value:1.98}, uEnvRot:{value:0}
  },
  transparent:true, depthWrite:true,
  vertexShader:\`
    varying vec2 vUvC; varying vec3 vNw; varying vec3 vWp; varying float vFace;
    uniform vec2 uCard;
    void main(){
      vUvC = position.xy/uCard + 0.5;
      vFace = normal.z;
      vNw = normalize(mat3(modelMatrix)*normal);
      vec4 wp = modelMatrix*vec4(position,1.0);
      vWp = wp.xyz;
      gl_Position = projectionMatrix*viewMatrix*wp;
    }\`,
  fragmentShader: CARD_FRAG
});

/* the milled edge of the card, lit by the same studio */
const cardWallMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:true,
  uniforms:{ uCam:{value:new THREE.Vector3()}, tEnv:{value:null}, tEnvB:{value:null},
             uLock:{value:0}, uGain:{value:2.15}, uEnvRot:{value:0} },
  vertexShader:\`
    varying vec3 vNw; varying vec3 vWp;
    void main(){ vNw=normalize(mat3(modelMatrix)*normal); vec4 wp=modelMatrix*vec4(position,1.0);
      vWp=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }\`,
  fragmentShader:\`
    varying vec3 vNw; varying vec3 vWp;
    uniform vec3 uCam; uniform sampler2D tEnv, tEnvB; uniform float uLock, uGain, uEnvRot;
    void main(){
      vec3 N=normalize(vNw); vec3 V=normalize(uCam-vWp);
      vec3 R=reflect(-V,N);
      vec3 d=normalize(R);
      float ax=(abs(d.x)<1e-5 && abs(d.z)<1e-5)?1e-5:d.x;
      vec2 uvv=vec2(atan(d.z,ax)*0.15915494+0.5+uEnvRot, clamp(asin(clamp(d.y,-1.0,1.0))*0.31830989+0.5,0.003,0.997));
      vec3 refl=mix(texture2D(tEnv,uvv).rgb, texture2D(tEnvB,uvv).rgb, 0.55);
      float NoV=clamp(dot(N,V),0.0,1.0);
      vec3 tint=vec3(0.300,0.268,0.226);
      vec3 F=tint+(1.0-tint)*pow(1.0-NoV,5.0)*0.6;
      vec3 col=refl*F*uGain;
      col = mix(col, mix(col, vec3(0.52,0.47,0.40), 0.5), uLock);
      gl_FragColor=vec4(col,1.0);
    }\`
});

const cardMesh  = new THREE.Mesh(cardGeo, [cardCapMat, cardWallMat]);
const cardPivot = new THREE.Group();
cardPivot.add(cardMesh);
cardMesh.renderOrder = 5;
scene.add(cardPivot);

/* ------------------------------------------------------ frozen stamp plate */
let stampTex=null;
function buildStamp(res){
  const W=210,H=76;
  const c=mkCanvas(W,H,res); const x=c.getContext('2d');
  x.clearRect(0,0,W,H);
  x.translate(W/2,H/2); x.rotate(-0.10); x.translate(-W/2,-H/2);
  const bw=176, bh=52, bx=(W-bw)/2, by=(H-bh)/2;
  const ink='rgba(226,196,132,0.92)';
  x.strokeStyle=ink; x.lineWidth=2.2; rr(x,bx,by,bw,bh,4); x.stroke();
  x.lineWidth=0.9; rr(x,bx+5,by+5,bw-10,bh-10,2.5); x.stroke();
  x.fillStyle='rgba(28,20,10,0.34)'; rr(x,bx,by,bw,bh,4); x.fill();
  iconLock(x, bx+30, by+bh/2, 1.15, ink, 2.0);
  x.fillStyle=ink; x.font=\`400 19px \${UI}\`; x.textBaseline='middle';
  tracked(x, BRAND.frozen.toUpperCase(), bx+52, by+bh/2+1, 5.0, 'left');
  stampTex=new THREE.CanvasTexture(c);
  stampTex.minFilter=THREE.LinearMipmapLinearFilter; stampTex.magFilter=THREE.LinearFilter;
  stampTex.anisotropy=MAXA;
  return [W,H];
}
const stampMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false, opacity:0});
const stampMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), stampMat);
stampMesh.renderOrder = 6;
cardMesh.add(stampMesh);

/* ================================================================== chrome */
let chromeCanvas=null, chromeTex=null, chromeRes=3, chromeDirty=true;
const chromeMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false});
const chromeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), chromeMat);
chromeMesh.scale.set(D.contW, D.contOpen, 1);
chromeMesh.position.z = -12; chromeMesh.renderOrder = 3;
scene.add(chromeMesh);

const ui = {rowP:[0,0,0], headP:0, closeP:0, toggle:0, hover:-1, pressRow:-1};

function buildChrome(res){
  chromeRes=res;
  chromeCanvas=mkCanvas(D.contW, D.contOpen, res);
  chromeTex=new THREE.CanvasTexture(chromeCanvas);
  chromeTex.minFilter=THREE.LinearFilter; chromeTex.magFilter=THREE.LinearFilter;
  chromeTex.generateMipmaps=false; chromeTex.anisotropy=MAXA;
  chromeMat.map=chromeTex; chromeMat.needsUpdate=true;
  chromeDirty=true;
}

/* a woven-check wash used behind the panel rows */
function checkFill(x, x0, y0, w, h, sz, a1, a2){
  x.save(); x.beginPath(); x.rect(x0,y0,w,h); x.clip();
  for(let j=0;j*sz<h+sz;j++) for(let i=0;i*sz<w+sz;i++){
    x.fillStyle = ((i+j)&1) ? a1 : a2;
    x.fillRect(x0+i*sz, y0+j*sz, sz, sz);
  }
  x.restore();
}

function drawChrome(){
  const W=D.contW,H=D.contOpen;
  const x=chromeCanvas.getContext('2d');
  x.setTransform(chromeRes,0,0,chromeRes,0,0);
  x.clearRect(0,0,W,H);
  const labels=[BRAND.rowLock, BRAND.rowShow, BRAND.rowReset];
  const CREAM='rgba(240,229,205,0.90)';

  /* --- section head: rule — CARD CONTROLS — rule --- */
  if(ui.headP>0.002){
    const e=1-Math.pow(1-ui.headP,3);
    x.save(); x.globalAlpha=Math.min(1,e*1.2);
    const y=D.headY+(1-e)*10;
    x.font=\`400 9px \${UI}\`; x.textBaseline='middle';
    const t=BRAND.panelHead.toUpperCase();
    const tw=trackedWidth(x,t,3.4);
    x.fillStyle='rgba(226,208,168,0.60)';
    tracked(x,t,W/2-tw/2,y,3.4,'left');
    x.strokeStyle='rgba(214,186,128,0.26)'; x.lineWidth=0.8;
    x.beginPath();
    x.moveTo(D.rowX+4,y-0.5); x.lineTo(W/2-tw/2-13,y-0.5);
    x.moveTo(W/2+tw/2+9,y-0.5); x.lineTo(W-D.rowX-4,y-0.5);
    x.stroke(); x.restore();
  }

  for(let i=0;i<3;i++){
    const p=ui.rowP[i];
    if(p<=0.002) continue;
    const e=p<1? 1-Math.pow(1-p,3) : 1;
    const y=D.rowY[i] + (1-e)*16;
    x.save();
    x.globalAlpha=Math.min(1,e*1.15);

    const hot = (ui.pressRow===i) ? 2 : (ui.hover===i ? 1 : 0);
    /* the row is pressed into the lining: dark well, lit lower lip */
    rr(x,D.rowX,y,D.rowW,D.rowH,12);
    x.save(); x.clip();
    const g=x.createLinearGradient(D.rowX,y,D.rowX,y+D.rowH);
    g.addColorStop(0,\`rgba(14,9,4,\${0.62-hot*0.10})\`);
    g.addColorStop(0.55,\`rgba(30,22,13,\${0.50-hot*0.08})\`);
    g.addColorStop(1,\`rgba(58,45,28,\${0.40-hot*0.05})\`);
    x.fillStyle=g; x.fillRect(D.rowX,y,D.rowW,D.rowH);
    checkFill(x,D.rowX,y,D.rowW,D.rowH,6,'rgba(255,236,196,0.030)','rgba(0,0,0,0.034)');
    x.strokeStyle='rgba(0,0,0,0.55)'; x.lineWidth=2.2;
    rr(x,D.rowX,y-1.2,D.rowW,D.rowH,12); x.stroke();
    x.restore();
    x.strokeStyle=\`rgba(232,208,158,\${0.16+hot*0.06})\`; x.lineWidth=0.9;
    rr(x,D.rowX+0.45,y+0.45,D.rowW-0.9,D.rowH-0.9,12); x.stroke();
    x.strokeStyle='rgba(246,228,186,0.10)'; x.lineWidth=0.9;
    x.beginPath(); x.moveTo(D.rowX+16,y+D.rowH-0.5); x.lineTo(D.rowX+D.rowW-16,y+D.rowH-0.5); x.stroke();

    x.fillStyle=CREAM; x.font=\`400 13px \${UI}\`; x.textBaseline='middle';
    x.save(); x.globalAlpha=0.5*x.globalAlpha; x.fillStyle='rgba(0,0,0,0.9)';
    tracked(x, labels[i].toUpperCase(), D.rowX+26, y+D.rowH/2+1.6, 2.5, 'left'); x.restore();
    x.fillStyle=CREAM;
    tracked(x, labels[i].toUpperCase(), D.rowX+26, y+D.rowH/2+0.5, 2.5, 'left');

    if(i===0){
      const tw=54, th=27, tx=D.rowX+D.rowW-24-tw, ty=y+(D.rowH-th)/2;
      const t=ui.toggle;
      rr(x,tx,ty,tw,th,th/2);
      x.fillStyle='rgba(64,54,38,0.72)'; x.fill();
      if(t>0.001){
        x.save(); x.globalAlpha=t; rr(x,tx,ty,tw,th,th/2);
        const tg=x.createLinearGradient(tx,ty,tx,ty+th);
        tg.addColorStop(0,'#e0a94e'); tg.addColorStop(1,'#b47a28');
        x.fillStyle=tg; x.fill(); x.restore();
      }
      x.strokeStyle='rgba(232,206,150,0.26)'; x.lineWidth=0.9;
      rr(x,tx+0.45,ty+0.45,tw-0.9,th-0.9,th/2); x.stroke();
      const kr=th/2-3.4;
      const kx=tx+3.4+kr + t*(tw-2*(3.4+kr));
      x.save();
      x.shadowColor='rgba(0,0,0,0.5)'; x.shadowBlur=4; x.shadowOffsetY=1.2;
      x.beginPath(); x.arc(kx, ty+th/2, kr, 0, Math.PI*2);
      x.fillStyle='#f4ecd8'; x.fill();
      x.restore();
      x.strokeStyle='rgba(90,72,40,0.30)'; x.lineWidth=0.7;
      x.beginPath(); x.arc(kx, ty+th/2, kr-0.4, 0, Math.PI*2); x.stroke();
    }else{
      iconChevron(x, D.rowX+D.rowW-30, y+D.rowH/2, 1.05, 'rgba(226,198,140,0.72)', 1.4);
    }
    x.restore();
  }

  /* close */
  if(ui.closeP>0.002){
    const e=1-Math.pow(1-ui.closeP,3);
    x.save(); x.globalAlpha=Math.min(1,e*1.2);
    const cy=D.closeY+(1-e)*14;
    x.beginPath(); x.arc(W/2, cy, D.closeR, 0, Math.PI*2);
    x.fillStyle='rgba(150,128,92,0.075)'; x.fill();
    x.strokeStyle='rgba(226,198,142,0.20)'; x.lineWidth=0.9; x.stroke();
    x.strokeStyle='rgba(236,220,186,0.72)'; x.lineWidth=1.4; x.lineCap='round';
    const s=5.0;
    x.beginPath(); x.moveTo(W/2-s,cy-s); x.lineTo(W/2+s,cy+s);
    x.moveTo(W/2+s,cy-s); x.lineTo(W/2-s,cy+s); x.stroke();
    x.restore();
  }
  chromeTex.needsUpdate=true;
}

/* ========================================================= flap text plate */
let flapTexCanvas=null, flapTex=null, flapTexRes=3;
const flapTextMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false});
const flapTextMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), flapTextMat);
flapTextMesh.scale.set(D.contW, 80, 1);
flapTextMesh.position.z = 28; flapTextMesh.renderOrder = 9;
scene.add(flapTextMesh);

function buildFlapText(res){
  flapTexRes=res;
  flapTexCanvas=mkCanvas(D.contW,80,res);
  drawFlapText();
  flapTex=new THREE.CanvasTexture(flapTexCanvas);
  flapTex.minFilter=THREE.LinearFilter; flapTex.magFilter=THREE.LinearFilter;
  flapTex.generateMipmaps=false; flapTex.anisotropy=MAXA;
  flapTextMat.map=flapTex; flapTextMat.needsUpdate=true;
}
function drawFlapText(){
  const W=D.contW,H=80;
  const x=flapTexCanvas.getContext('2d');
  x.setTransform(flapTexRes,0,0,flapTexRes,0,0);
  x.clearRect(0,0,W,H);
  const BASE=H/2;

  /* foil-stamped: a soft dark impression under a cream face */
  function stamped(fn, colour){
    x.save(); x.globalAlpha=0.42; x.translate(0.5,1.1);
    x.fillStyle='rgba(46,32,16,0.9)'; fn(); x.restore();
    x.save(); x.fillStyle=colour; fn(); x.restore();
  }

  x.save(); x.globalAlpha=0.40; x.translate(0.5,1.1);
  drawOrbis(x, 44, BASE-1, 8.5, 'rgba(46,32,16,0.9)', 1.2); x.restore();
  drawOrbis(x, 44, BASE-1, 8.5, 'rgba(247,239,220,0.92)', 1.2);

  x.textBaseline='alphabetic';
  x.font=\`400 12px \${UI}\`;
  stamped(()=>tracked(x, BRAND.frontCta.toUpperCase(), 64, BASE+4, 2.7, 'left'), 'rgba(247,239,220,0.94)');
  stamped(()=>tracked(x, '\\u2022\\u2022\\u2022\\u2022 '+BRAND.last4, W-42, BASE+4, 2.3, 'right'), 'rgba(240,229,204,0.72)');

  if(flapTex) flapTex.needsUpdate=true;
}

/* ====================================================== texture lifecycle */
function onResizeTextures(){
  const res  = Math.max(2.5, Math.min(4.5, Math.round(dpr*scale*1.9*2)/2));
  const cres = Math.max(3, Math.min(6, Math.round(dpr*scale*2.6)));   /* card art is sharper */
  if(!texEnv) buildEnvTextures();
  buildChrome(res);
  buildFlapText(res);
  const [tf,ta]=buildFrontTextures(cres);
  cardCapMat.uniforms.tFoilF.value=tf;
  cardCapMat.uniforms.tArtF.value=ta;
  cardCapMat.uniforms.tFoilB.value=buildBackFoil(cres);
  buildBackCanvas(cres);
  cardCapMat.uniforms.tArtB.value=texBack;
  cardCapMat.uniforms.tEnv.value=texEnv;
  cardCapMat.uniforms.tEnvB.value=texEnvBlur;
  cardWallMat.uniforms.tEnv.value=texEnv;
  cardWallMat.uniforms.tEnvB.value=texEnvBlur;
  const [sw,sh]=buildStamp(res);
  stampMat.map=stampTex; stampMat.needsUpdate=true;
  stampMesh.scale.set(sw,sh,1);
  chromeDirty=true;
}

/* =============================================================== animation */
const S = {
  open:false, t:99, expand:0, expandV:0,
  lift:0, liftV:0, flip:0, lock:0, lockT:99, locked:false,
  reveal:0, revealTarget:0, eyePress:0, hoverCard:false, pressCard:0,
  hoverK:0, hoverKV:0
};
let lastRevealDraw=-1, lastEyeDraw=-1;

function easeOut(t){ return 1-Math.pow(1-t,3); }
function clamp01(v){ return v<0?0:(v>1?1:v); }
function easeSpin(p){ const s=p*p*(3-2*p); return 0.55*p + 0.45*s; }

function springStep(x,v,target,dt,f,z){
  const w=2*Math.PI*f, k=w*w, c=2*z*w;
  const steps=Math.max(1,Math.ceil(dt/0.008));
  const h=dt/steps;
  for(let i=0;i<steps;i++){ v += (-k*(x-target)-c*v)*h; x += v*h; }
  return [x,v];
}

const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleOpen(){
  S.open=!S.open; S.t=REDUCED?9:0;
  if(REDUCED){ S.expand=S.lift=S.open?1:0; S.expandV=S.liftV=0; }
  if(!S.open){ S.revealTarget=0; S.locked=false; }
  hintEl.classList.remove('on');
}

/* ==================================================================== input */
const hintEl=document.getElementById('hint');
let pointer={x:0,y:0,inside:false};
function toWorld(cx,cy){ return {x:(cx-vw/2)/scale, y:-(cy-vh/2)/scale}; }

function contGeom(){
  const h = D.contRest + (D.contOpen-D.contRest)*S.expand;
  return {h, top:h/2, bottom:-h/2};
}
function hitCard(w){
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift;
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift;
  const pf = camD/(camD-cz);
  return Math.abs(w.x)<D.cardW/2*pf && Math.abs(w.y-cy*pf)<D.cardH/2*pf;
}
function rowRect(i){
  const g=contGeom();
  const y0 = g.top - D.rowY[i];
  return {x0:-D.contW/2+D.rowX, x1:-D.contW/2+D.rowX+D.rowW, y0:y0-D.rowH, y1:y0};
}
function hitRow(w){
  if(S.expand<0.7) return -1;
  for(let i=0;i<3;i++){
    const r=rowRect(i);
    if(w.x>r.x0&&w.x<r.x1&&w.y>r.y0&&w.y<r.y1) return i;
  }
  return -1;
}
function hitClose(w){
  if(S.expand<0.7) return false;
  const g=contGeom();
  return Math.hypot(w.x, w.y-(g.top-D.closeY)) < D.closeR+6;
}
function hitEye(w){
  if(S.flip<0.85) return false;
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift;
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift;
  const pf = camD/(camD-cz);
  const lx = 400 - D.cardW/2, ly = D.cardH/2 - 242;
  return Math.hypot(w.x-lx*pf, w.y-(cy+ly)*pf) < 25*pf;
}

canvas.addEventListener('pointermove', e=>{
  if(e.pointerType==='touch'){ pointer.inside=false; return; }
  pointer.x=e.clientX; pointer.y=e.clientY; pointer.inside=true;
  const w=toWorld(e.clientX,e.clientY);
  const r=hitRow(w);
  const prevHover=ui.hover; ui.hover=r;
  let cur='default';
  if(r>=0||hitClose(w)||hitEye(w)) cur='pointer';
  else if(!S.open && hitCard(w)) cur='pointer';
  S.hoverCard = !S.open && hitCard(w);
  canvas.style.cursor=cur;
  if(prevHover!==ui.hover) chromeDirty=true;
});
canvas.addEventListener('pointerleave', ()=>{ pointer.inside=false; S.hoverCard=false; ui.hover=-1; chromeDirty=true; });
canvas.addEventListener('pointerdown', e=>{
  const w=toWorld(e.clientX,e.clientY);
  const r=hitRow(w);
  if(r>=0){ ui.pressRow=r; chromeDirty=true; }
  else if(!S.open && hitCard(w)) S.pressCard=1;
});
window.addEventListener('pointerup', ()=>{ ui.pressRow=-1; S.pressCard=0; chromeDirty=true; });

canvas.addEventListener('click', e=>{
  const w=toWorld(e.clientX,e.clientY);
  if(S.open){
    if(hitClose(w)){ toggleOpen(); return; }
    if(hitEye(w)){ S.revealTarget = S.revealTarget>0.5?0:1; S.eyePress=1; return; }
    const r=hitRow(w);
    if(r===0){ S.locked=!S.locked; S.lockT=0; }
  }else if(hitCard(w)) toggleOpen();
});
window.addEventListener('keydown', e=>{ if(e.key==='Escape'&&S.open) toggleOpen(); });

/* ===================================================================== loop */
let prev=performance.now();
let nowMs=0;
let PAUSED=false;

function step(dt){
  S.t+=dt; S.lockT+=dt;
  const t=S.t;

  /* closing is a two-beat move: the card turns back, then the sleeve closes */
  const target = S.open ? 1 : (t < 0.40 ? 1 : 0);
  const freq   = S.open ? 1.90 : 2.10;
  [S.expand,S.expandV]=springStep(S.expand,S.expandV,target,dt,freq,1.0);
  [S.lift  ,S.liftV  ]=springStep(S.lift  ,S.liftV  ,target,dt,freq*0.98,1.0);

  S.flip = S.open ? easeSpin(clamp01((t-0.165)/0.240))
                  : 1-easeSpin(clamp01((t-0.085)/0.215));

  for(let i=0;i<3;i++){
    ui.rowP[i] = S.open ? clamp01((t-0.185-i*0.062)/0.26)
                        : clamp01(1-(t-(2-i)*0.025)/0.16);
  }
  ui.headP  = S.open ? clamp01((t-0.150)/0.26) : clamp01(1-t/0.14);
  ui.closeP = S.open ? clamp01((t-0.370)/0.26) : clamp01(1-t/0.14);

  const flapA = S.open ? 1-clamp01((t-0.05)/0.24) : clamp01((t-0.45)/0.26);
  const flapE = flapA<1 ? flapA*flapA*(3-2*flapA) : 1;

  S.reveal += Math.sign(S.revealTarget-S.reveal)*Math.min(Math.abs(S.revealTarget-S.reveal), dt/0.82);
  if(S.eyePress>0) S.eyePress=Math.max(0, S.eyePress-dt/0.55);
  S.lock += Math.sign((S.locked?1:0)-S.lock)*Math.min(Math.abs((S.locked?1:0)-S.lock), dt/0.36);

  const g=contGeom();
  containerMat.uniforms.uBox.value.set(D.contW/2, g.h/2);
  containerMesh.scale.set(D.contW+90, D.contOpen+90, 1);
  containerMat.uniforms.uSize.value.set(D.contW+90, D.contOpen+90);

  contShadow.scale.set(D.contW+340, g.h+340, 1);
  contShadow.material.uniforms.uSize.value.set(D.contW+340, g.h+340);
  contShadow.material.uniforms.uBox.value.set(D.contW/2-16, g.h/2-4);
  contShadow.material.uniforms.uRadius.value=D.contR;
  contShadow.material.uniforms.uBlur.value=54;
  contShadow.material.uniforms.uOpacity.value=1.0;
  contShadow.position.y=-30;

  const flapY = g.bottom + D.flapH/2;
  flapMesh.position.y = flapY;
  flapMat.uniforms.uOpacity.value = flapE;
  flapMat.uniforms.uBaseY.value = -D.flapH/2;
  flapMat.uniforms.uWave.value = -D.flapH/2 + D.flapWaveUp;
  flapMesh.visible = flapE>0.004;

  flapTextMesh.position.y = g.bottom + 34;
  flapTextMat.opacity = flapE;
  flapTextMesh.visible = flapE>0.004;

  lipShadow.position.y = g.bottom + D.flapWaveUp;
  lipShadowMat.uniforms.uWave.value = 0.0;
  lipShadowMat.uniforms.uOpacity.value = flapE;
  lipShadow.visible = flapE>0.004;

  /* card transform — the card is rigid: it never changes size. A 20° lens
     keeps the near edge from magnifying its way out of the sleeve instead.  */
  const hoverTarget = (S.hoverCard && !S.open) ? (S.pressCard ? 0.35 : 1) : 0;
  [S.hoverK,S.hoverKV]=springStep(S.hoverK,S.hoverKV,hoverTarget,dt,3.0,1.0);
  const spin = Math.sin(S.flip*Math.PI);
  const cardScale = 1;
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift + S.hoverK*7*(1-S.lift);
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift + S.hoverK*5*(1-S.lift);
  cardPivot.position.set(0, cy, cz);
  cardPivot.rotation.y = S.flip*Math.PI;

  const projW = Math.max(60, cardScale*(D.cardW*Math.abs(Math.cos(S.flip*Math.PI))
                                       + D.cardT*Math.abs(Math.sin(S.flip*Math.PI))));
  const projH = D.cardH*cardScale;
  cardShadow.position.set(0, cy-10-14*S.lift, cz-16);
  cardShadow.scale.set(projW+220, projH+220, 1);
  cardShadow.material.uniforms.uSize.value.set(projW+220, projH+220);
  cardShadow.material.uniforms.uBox.value.set(projW/2-4, projH/2-4);
  cardShadow.material.uniforms.uRadius.value=D.cardR;
  cardShadow.material.uniforms.uBlur.value=14+30*S.lift;
  cardShadow.material.uniforms.uOpacity.value=0.30+0.34*S.lift;

  chromeMesh.position.y = g.top - D.contOpen/2;

  /* the pointer turns the studio a little, so the metal stays alive */
  const rot = pointer.inside ? ((pointer.x/vw)-0.5)*0.055 : 0.0;
  cardCapMat.uniforms.uEnvRot.value  += (rot-cardCapMat.uniforms.uEnvRot.value)*Math.min(1,dt*6);
  cardWallMat.uniforms.uEnvRot.value = cardCapMat.uniforms.uEnvRot.value;
  cardCapMat.uniforms.uCam.value.copy(camera.position);
  cardWallMat.uniforms.uCam.value.copy(camera.position);
  cardCapMat.uniforms.uLock.value=S.lock;
  cardWallMat.uniforms.uLock.value=S.lock;

  const bA = S.lock*clamp01((S.flip-0.9)*10);
  stampMat.opacity = bA;
  stampMesh.visible = bA>0.005;
  const bs = 0.90+0.10*S.lock;
  stampMesh.scale.set(210*bs, 76*bs, 1);
  stampMesh.position.set(0, -37, -D.cardT/2-0.7);   /* clears the number row */
  stampMesh.rotation.y = Math.PI;

  if(Math.abs(S.reveal-lastRevealDraw)>0.002 || Math.abs(S.eyePress-lastEyeDraw)>0.002){
    backState.reveal=S.reveal; backState.eyePress=S.eyePress;
    drawBack(); lastRevealDraw=S.reveal; lastEyeDraw=S.eyePress;
  }
  ui.toggle += Math.sign((S.locked?1:0)-ui.toggle)*Math.min(Math.abs((S.locked?1:0)-ui.toggle), dt/0.22);
  chromeDirty = chromeDirty || S.t<1.4 || Math.abs(ui.toggle-(S.locked?1:0))>0.001;
  if(chromeDirty){ drawChrome(); chromeDirty=false; }

  window.__bg.scale.set(worldW*2.4, worldH*2.4, 1);
  window.__bg.material.uniforms.uSize.value.set(worldW*2.4, worldH*2.4);
}

function tick(now){
  const dt=Math.min(0.05,(now-prev)/1000); prev=now; nowMs=now;
  if(!PAUSED) step(dt);
  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}

/* ------------------------------------------------- dev: deterministic seek */
window.__dev = {
  seek(sec, opts){
    PAUSED=true; opts=opts||{};
    S.open = !!opts.close; S.t=99;
    S.expand=S.lift=opts.close?1:0; S.expandV=S.liftV=0; S.flip=opts.close?1:0;
    S.locked=!!opts.locked; S.lock=opts.locked?1:0; ui.toggle=opts.locked?1:0;
    S.revealTarget=opts.reveal?1:0; S.reveal=S.revealTarget; S.eyePress=0;
    pointer.inside=false; step(1e-4);
    S.open = !opts.close; S.t=0;
    const h=1/240, n=Math.round(sec/h);
    for(let i=0;i<n;i++) step(h);
    step(1e-4); renderer.render(scene,camera);
    return {expand:S.expand, lift:S.lift, flip:S.flip};
  },
  seekSub(sec, what){
    PAUSED=true;
    S.open=true; S.t=99; S.expand=S.lift=1; S.expandV=S.liftV=0; S.flip=1;
    S.locked=false; S.lock=0; ui.toggle=0; S.revealTarget=0; S.reveal=0; S.eyePress=0;
    pointer.inside=false; step(1e-4);
    if(what==='reveal'){ S.revealTarget=1; S.eyePress=1; }
    if(what==='lock'){ S.locked=true; S.lockT=0; }
    const h=1/240, n=Math.round(sec/h);
    for(let i=0;i<n;i++) step(h);
    step(1e-4); renderer.render(scene,camera);
  },
  set(o){
    PAUSED=true;
    if(o.open!==undefined){ S.open=o.open; S.t=o.t===undefined?9:o.t;
      S.expand=S.lift=o.open?1:0; S.expandV=S.liftV=0; }
    if(o.locked!==undefined){ S.locked=o.locked; S.lock=o.locked?1:0; ui.toggle=o.locked?1:0; }
    if(o.reveal!==undefined){ S.revealTarget=o.reveal; S.reveal=o.reveal; }
    chromeDirty=true; step(1e-4); renderer.render(scene,camera);
  }
};

window.addEventListener('resize', layout);
layout();
setTimeout(()=>{ if(!S.open) hintEl.classList.add('on'); }, 800);
requestAnimationFrame(tick);
<\/script>
</body>
</html>
`,g=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Onyx — Card</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%;background:#eceae4;overflow:hidden;
    -webkit-font-smoothing:antialiased;
    font-family:"Helvetica Neue",Helvetica,Inter,"Segoe UI",Arial,sans-serif}
  #gl{position:fixed;inset:0;width:100%;height:100%;display:block;cursor:default;touch-action:none}
  #hint{position:fixed;left:0;right:0;bottom:30px;text-align:center;color:#7c7a74;
    font-size:10px;letter-spacing:.30em;text-transform:uppercase;pointer-events:none;
    opacity:0;transition:opacity .9s ease .7s;font-weight:400}
  #hint.on{opacity:.72}
</style>
</head>
<body>
<canvas id="gl"></canvas>
<div id="hint">Tap the card</div>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================================
   ONYX — the Halcyon sleeve cut in black calf, stood in a daylight room.
   Same pebble-grain lighting, no damier: a plain hide reading entirely off its
   grain and its specular, holding a brushed platinum card. The type is Swiss
   grotesque rather than the house's geometric-and-didone pairing.
   ========================================================================== */

const UI   = '"Helvetica Neue",Helvetica,Inter,"Segoe UI",Arial,sans-serif';
const DISP = '"Helvetica Neue",Helvetica,Arial,Inter,sans-serif';

const BRAND = {
  monogram : 'V',
  network  : 'ORBIS',
  tier     : 'Noir Edition',
  since    : "Member since '09",
  holder   : 'Marlowe Vance',
  last4    : '4417',
  pan      : '5219 0473 8846 4417',
  exp      : '07/31',
  cvv      : '318',
  frontCta : 'See card details',
  panelHead: 'Card controls',
  rowLock  : 'Freeze card',
  rowShow  : 'Show PIN',
  rowReset : 'Reset PIN',
  frozen   : 'Frozen'
};

/* ---------------------------------------------------------------- geometry */
const D = {
  contW:480, contRest:326, contOpen:640, contR:34, bezel:15,
  cardW:448, cardH:283, cardR:18, cardT:3.4,   /* 34 outer − 16 gap = concentric */
  cardYRest:9, cardYOpen:156, cardZRest:0, cardZOpen:7,
  stripeH:56,
  flapH:250, flapWaveUp:203.5, flapDip:24,
  rowY:[358,423,488], rowH:52, rowX:22, rowW:436,   /* 34 − 22 = r12, concentric */
  headY:340, closeY:576, closeR:26
};

/* --------------------------------------------------------------- renderer */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setClearColor(0xe7e4dd, 1);
const MAXA = renderer.capabilities.getMaxAnisotropy();

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 10, 4000);

let scale = 1, worldH = 790, worldW = 1280, camD = 1400;
let vw = 0, vh = 0, dpr = 1;

function layout(){
  vw = Math.max(320, window.innerWidth  || 1280);
  vh = Math.max(320, window.innerHeight ||  800);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  scale = Math.min(vw/620, vh/790);
  scale = Math.max(0.46, Math.min(scale, 1.5));
  worldH = vh/scale; worldW = vw/scale;
  camD = (worldH/2)/Math.tan(THREE.MathUtils.degToRad(10));
  camera.fov = 20; camera.aspect = vw/vh;
  camera.position.set(0,0,camD);
  camera.near = camD*0.05; camera.far = camD*3;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(dpr);
  renderer.setSize(vw, vh, false);
  onResizeTextures();
}

/* ============================================================ glsl helpers */
const GLSL = \`
  #define TAU 6.28318530718
  float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; return fract(p*(p+p)); }
  float hash21(vec2 p){ p=fract(p*vec2(127.31,311.7)); p+=dot(p,p+34.23); return fract(p.x*p.y); }
  vec2  hash22(vec2 p){
    vec3 q = fract(vec3(p.xyx)*vec3(0.1031,0.1030,0.0973));
    q += dot(q, q.yzx+33.33);
    return fract((q.xx+q.yz)*q.zy);
  }
  float vnoise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
  float fbm(vec2 p){ float s=0.,a=0.5; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.07; a*=0.5; } return s; }

  /* worley F1 with its analytic gradient — the pebble grain of the leather */
  float worley(vec2 p, out vec2 grad){
    vec2 ip=floor(p), fp=fract(p);
    float d=8.0; vec2 best=vec2(0.0);
    for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
      vec2 g=vec2(float(x),float(y));
      vec2 o=hash22(ip+g);
      vec2 r=g+o-fp;
      float l=length(r);
      if(l<d){ d=l; best=r; }
    }
    grad = -best/max(d,1e-4);
    return d;
  }

  float sdRound(vec2 p, vec2 b, float r){ vec2 q=abs(p)-b+r; return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r; }

  /* continuous arc-length-ish parameter around a rounded rect (for stitching).
     The corner branch must never reach atan(0,0) — that is undefined in GLSL and
     returns NaN on some drivers, which then poisons the whole fragment.        */
  float contourS(vec2 p, vec2 b, float r){
    vec2 a=abs(p); vec2 c=max(b-r, vec2(0.001));
    if(a.x<=c.x && a.y>=c.y) return a.x;                            // top / bottom run
    if(a.y<=c.y && a.x>=c.x) return c.x + r*1.5707963 + (c.y-a.y);  // side run
    if(a.x< c.x && a.y< c.y) return a.x;                            // interior, unused
    vec2 q=max(a-c, vec2(0.0));
    return c.x + r*atan(q.y, max(q.x,1e-4));
  }

  /* damier: k is 0/1 per tile, edge is the distance in px to the nearest tile
     border and dir is d(edge)/dp, so a groove can be differentiated cheaply */
  void damier(vec2 p, float sz, out float k, out float edge, out vec2 dir){
    vec2 c = p/sz;
    k = mod(floor(c.x)+floor(c.y), 2.0);
    vec2 f = fract(c);
    float mx = min(f.x, 1.0-f.x), my = min(f.y, 1.0-f.y);
    if(mx < my){ edge = mx*sz; dir = vec2(f.x < 1.0-f.x ? 1.0 : -1.0, 0.0); }
    else       { edge = my*sz; dir = vec2(0.0, f.y < 1.0-f.y ? 1.0 : -1.0); }
  }
  float damierK(vec2 p, float sz){ vec2 c=p/sz; return mod(floor(c.x)+floor(c.y),2.0); }
\`;

/* ---------------------------------------------------------------- leather */
/* Shared black-calf surface: pebble grain -> height -> normal -> lighting.
   \`mode\` 0 = burnished edge trim, 1 = the plain body. There is no damier here:
   a black hide has almost no albedo to work with, so everything you read is
   the grain's specular, and a check on top of it only muddies that.        */
const LEATHER = \`
  uniform vec3 uKey;

  /* Fine-grain beige leather. mode 0 = burnished trim, 1 = damier-embossed body.
     The normal comes from one worley lookup with its analytic gradient.        */
  vec3 leather(vec2 p, float mode, float shade, float burnish){
    float gs = (mode < 0.5) ? 0.46 : 0.330;      /* trim is a finer, tighter grain */
    vec2 wg;
    float w  = worley(p*gs, wg);
    float wc = clamp(w*1.75, 0.0, 1.0);
    float pebble = wc*wc*(3.0-2.0*wc);
    float amp = (mode < 0.5) ? 0.36 : 0.48;
    vec2  dh = wg * (6.0*wc*(1.0-wc)*1.75*gs*amp);

    /* second, much finer pore layer — this is what reads as real hide */
    vec2 wg2;
    float w2 = worley(p*1.25 + vec2(31.0,17.0), wg2);
    float wc2= clamp(w2*2.30, 0.0, 1.0);
    float pore = wc2*wc2*(3.0-2.0*wc2);
    dh += wg2 * (6.0*wc2*(1.0-wc2)*2.30*1.25*0.038);

    float f1 = fbm(p*0.62);
    float fx = fbm(p*0.62 + vec2(0.40,0.0));
    float fy = fbm(p*0.62 + vec2(0.0,0.40));
    dh += vec2(fx-f1, fy-f1) * (0.16*0.62/0.40);

    /* long soft creases running through the hide */
    float c1 = fbm(p*0.125);
    float cx = fbm(p*0.125 + vec2(0.42,0.0));
    float cy = fbm(p*0.125 + vec2(0.0,0.42));
    float ridge = pow(clamp(1.0 - abs(c1-0.5)*3.2, 0.0, 1.0), 8.0);
    dh += vec2(cx-c1, cy-c1)*(1.0/0.42)*ridge*0.40;

    float tone = 0.0;
    if(mode > 0.5){
      /* plain calf: a slow tonal drift across the panel instead of a check */
      tone = smoothstep(0.36, 0.64, fbm(p*0.055));
    }

    vec3 N = normalize(vec3(-dh.x, -dh.y, 1.0));
    vec3 L = normalize(uKey);
    vec3 Hv= normalize(L + vec3(0.0,0.0,1.0));

    float dif  = max(dot(N,L), 0.0);
    float spec = pow(max(dot(N,Hv),0.0), mix(24.0,70.0,burnish)) * mix(1.0,2.4,burnish);
    /* a second, much wider lobe: black calf has a soft satin bloom around the
       hard highlight, and without it the hide reads as flat black plastic */
    float bloom = pow(max(dot(N,Hv),0.0), 5.0);
    float amb  = 0.86 + 0.20*N.y;                  /* a bright room bounces in */

    vec3 albedo = mix(vec3(0.0430,0.0426,0.0452), vec3(0.0362,0.0358,0.0384), tone);
    if(mode < 0.5) albedo = vec3(0.0292,0.0288,0.0312);
    albedo *= 1.0 - 0.26*burnish;                  /* painted edge darkens */
    albedo *= 0.93 + 0.15*fbm(p*0.045);
    albedo *= 1.0 - ridge*0.11;                    /* creases sit darker */
    albedo *= shade;

    vec3 col = albedo*(amb + dif*0.58);
    col += vec3(0.930,0.938,0.958)*spec*0.126;
    col += vec3(0.560,0.575,0.615)*bloom*0.052;
    /* the grain is the whole read on black, so it gets a deeper bite */
    col *= 1.0 - 0.34*(1.0-pebble) - 0.11*(1.0-pore);
    return col;
  }

  /* fine slanted saddle stitch running along a contour */
  vec3 saddleStitch(vec3 col, float dist, float s, float pitch, float len){
    float ph = fract(s/pitch);
    float slant = (ph-0.5)*2.2;
    float dd = abs(dist + slant);
    float on = step(0.5-len*0.5, ph)*step(ph, 0.5+len*0.5);
    float thread = exp(-pow(dd/0.62,2.0))*on;
    float hole   = exp(-pow((dd-1.42)/0.70,2.0))*on;
    col = mix(col, col*0.60, hole*0.34);
    col = mix(col, vec3(0.520,0.522,0.536), thread*0.62);
    return col;
  }
\`;

/* ------------------------------------------------------------- background */
{
  const m = new THREE.ShaderMaterial({
    uniforms:{ uSize:{value:new THREE.Vector2(1,1)} },
    vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
    fragmentShader:\`
      varying vec2 vUv; uniform vec2 uSize; \${GLSL}
      void main(){
        vec2 p=(vUv-0.5)*uSize;
        float r=length(p*vec2(1.0,1.20))/(uSize.y*0.78);
        vec3 col = vec3(0.8580,0.8480,0.8300);
        col += vec3(0.0640,0.0630,0.0610)*smoothstep(1.0,0.0,r);
        col -= vec3(0.0900,0.0910,0.0920)*smoothstep(0.38,1.32,r);
        col += (hash21(vUv*uSize*0.73)-0.5)*0.0075;
        gl_FragColor = vec4(max(col,vec3(0.0)),1.0);
      }\`,
    depthWrite:false, depthTest:false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), m);
  mesh.position.z = -300; mesh.renderOrder = 0;
  scene.add(mesh);
  window.__bg = mesh;
}

/* ------------------------------------------------------------ soft shadow */
function softRectMesh(renderOrder){
  const m = new THREE.ShaderMaterial({
    uniforms:{ uSize:{value:new THREE.Vector2(1,1)}, uBox:{value:new THREE.Vector2(1,1)},
               uRadius:{value:30}, uBlur:{value:40}, uOpacity:{value:0.6} },
    vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
    fragmentShader:\`
      varying vec2 vUv; uniform vec2 uSize,uBox; uniform float uRadius,uBlur,uOpacity;
      \${GLSL}
      void main(){
        vec2 p=(vUv-0.5)*uSize;
        float d=sdRound(p,uBox,uRadius);
        float a=1.0-smoothstep(-uBlur, uBlur*0.75, d);
        gl_FragColor=vec4(0.086,0.082,0.078, pow(a,1.25)*uOpacity);
      }\`,
    transparent:true, depthWrite:false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), m);
  mesh.renderOrder = renderOrder;
  return mesh;
}
const contShadow = softRectMesh(1); contShadow.position.z = -30; scene.add(contShadow);
const cardShadow = softRectMesh(4); scene.add(cardShadow);

const KEY = new THREE.Vector3(-0.34, 0.60, 0.72).normalize();

/* --------------------------------------------------------------- container */
const containerMat = new THREE.ShaderMaterial({
  uniforms:{
    uSize:{value:new THREE.Vector2(D.contW+90, D.contOpen+90)},
    uBox:{value:new THREE.Vector2(D.contW/2, D.contRest/2)},
    uRadius:{value:D.contR}, uBezel:{value:D.bezel},
    uKey:{value:KEY.clone()}
  },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize,uBox; uniform float uRadius,uBezel;
    \${GLSL}
    \${LEATHER}
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      float d=sdRound(p,uBox,uRadius);
      float aa=max(fwidth(d),0.6);
      float alpha=1.0-smoothstep(-aa,aa,d);
      if(alpha<0.002) discard;

      float vy = (p.y+uBox.y)/(2.0*uBox.y);

      /* --- woven check lining --- */
      float k,edge; vec2 kd; damier(p+vec2(3.0,5.0), 9.0, k, edge, kd);
      float weft = exp(-pow(edge/0.75,2.0));
      vec3 lin = mix(vec3(0.0620,0.0616,0.0664), vec3(0.0468,0.0466,0.0510), k);
      lin *= 0.90 + 0.20*fbm(p*0.9);
      lin *= 1.0 - 0.26*weft;
      float thr = 0.5+0.5*sin((p.x+p.y)*1.9);
      lin *= 0.96 + 0.08*thr;
      lin *= mix(0.62, 1.16, smoothstep(0.0,1.0,vy));
      lin += vec3(0.016,0.017,0.020)*pow(max(0.0,1.0-abs(p.x)/uBox.x),3.0);

      /* --- tan leather trim (only shaded where the bezel shows) --- */
      float bez = smoothstep(-uBezel-1.2, -uBezel+1.2, d);
      float burn = smoothstep(-6.0, -0.5, d);
      vec3 trim = (bez > 0.003) ? leather(p, 0.0, mix(1.0, 0.62, smoothstep(0.35,0.0,vy)), burn) : lin;
      vec3 col = mix(lin, trim, bez);

      /* inner wall where the trim meets the well */
      float wall = exp(-pow((d+uBezel)/3.2,2.0));
      col *= 1.0-0.30*wall*step(d,-uBezel);
      col += vec3(0.052,0.054,0.060)*exp(-pow((d+uBezel-1.8)/2.4,2.0));

      /* rolled outer edge */
      float rim = exp(-pow((d+1.6)/2.0,2.0));
      float up  = clamp(0.5+0.5*normalize(vec2(p.x,p.y)+1e-5).y,0.0,1.0);
      col += rim*(0.038+0.150*up)*bez;
      col *= 1.0-0.55*smoothstep(-1.6,0.0,d);

      /* stitching */
      float s=contourS(p,uBox,uRadius);
      col = saddleStitch(col, d+uBezel*0.50, s, 9.0, 0.46);

      gl_FragColor=vec4(col, alpha);
    }\`,
  transparent:true, depthWrite:false
});
const containerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), containerMat);
containerMesh.renderOrder = 2; containerMesh.position.z = -14;
scene.add(containerMesh);

/* -------------------------------------------------------------------- flap */
const flapMat = new THREE.ShaderMaterial({
  uniforms:{
    uSize:{value:new THREE.Vector2(D.contW, D.flapH)},
    uBox:{value:new THREE.Vector2(D.contW/2, 400)},
    uRadius:{value:D.contR}, uWave:{value:D.flapWaveUp-D.flapH/2}, uDip:{value:D.flapDip},
    uOpacity:{value:1}, uBaseY:{value:-D.flapH/2}, uBezel:{value:D.bezel},
    uKey:{value:KEY.clone()}
  },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize,uBox;
    uniform float uRadius,uWave,uDip,uOpacity,uBaseY,uBezel;
    \${GLSL}
    \${LEATHER}
    float waveY(float x01){
      float b = smoothstep(0.14,0.50,x01)*smoothstep(0.86,0.50,x01);
      b = b*b*(3.0-2.0*b);
      return uWave - uDip*b;
    }
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      vec2 bp = vec2(p.x, p.y - (uBox.y + uBaseY));
      float dr=sdRound(bp,uBox,uRadius);
      float wy=waveY(vUv.x);
      float dw=p.y-wy;
      float d=max(dr,dw);
      float aa=max(fwidth(d),0.6);
      float alpha=(1.0-smoothstep(-aa,aa,d))*uOpacity;
      if(alpha<0.003) discard;

      float vy = clamp((p.y - uBaseY)/(uSize.y*0.92), 0.0, 1.0);

      float bez = smoothstep(-uBezel-1.2, -uBezel+1.2, dr);
      float lip = smoothstep(-11.0, -1.0, dw);          // the cut top edge is trim too
      float labelTop = uBaseY + 64.0;                   // plain leather band for the row
      float label = smoothstep(labelTop+0.9, labelTop-0.9, p.y);
      float tm = max(max(bez, lip), label);
      float burn = max(smoothstep(-6.0,-0.5,dr), smoothstep(-5.0,-0.5,dw));
      vec3 body = (tm < 0.997) ? leather(p+vec2(0.0,140.0), 1.0, mix(0.86,1.05,smoothstep(0.0,0.55,vy)), 0.0) : vec3(0.0);
      vec3 trim = (tm > 0.003) ? leather(p+vec2(0.0,140.0), 0.0, mix(0.82,1.02,smoothstep(0.0,0.55,vy)), burn) : vec3(0.0);
      vec3 col = mix(body, trim, tm);
      col = saddleStitch(col, (p.y-labelTop)+7.0, p.x, 9.0, 0.46);

      /* burnished cut edge along the wave */
      float cut = exp(-pow(dw/2.0,2.0));
      col = mix(col, col*0.58, cut*0.75);
      col += vec3(0.108,0.112,0.124)*exp(-pow((dw+2.6)/1.6,2.0));

      /* stitch along the wave, then around the outside */
      col = saddleStitch(col, dw+10.0, p.x, 9.0, 0.46);
      float s=contourS(bp,uBox,uRadius);
      if(dw < -2.0) col = saddleStitch(col, dr+uBezel*0.50, s, 9.0, 0.46);

      float rim = exp(-pow((dr+1.6)/2.0,2.0));
      float up  = clamp(0.5+0.5*normalize(vec2(bp.x,bp.y)+1e-5).y,0.0,1.0);
      col += rim*(0.026+0.096*up)*step(dw,-1.0);
      col *= 1.0-0.50*smoothstep(-1.6,0.0,dr);

      gl_FragColor=vec4(col,alpha);
    }\`,
  transparent:true, depthWrite:false
});
const flapMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), flapMat);
flapMesh.scale.set(D.contW, D.flapH, 1);
flapMesh.position.z = 26; flapMesh.renderOrder = 8;
scene.add(flapMesh);

/* shadow the pocket lip throws back onto the card */
const lipShadowMat = new THREE.ShaderMaterial({
  uniforms:{ uSize:{value:new THREE.Vector2(D.contW, 90)}, uWave:{value:0}, uDip:{value:D.flapDip}, uOpacity:{value:1} },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize; uniform float uWave,uDip,uOpacity;
    float waveY(float x01){ float b=smoothstep(0.14,0.50,x01)*smoothstep(0.86,0.50,x01); b=b*b*(3.0-2.0*b); return uWave-uDip*b; }
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      float dw=p.y-waveY(vUv.x);
      float a=exp(-pow(max(dw,0.0)/12.0,1.4))*step(0.0,dw);
      a*= smoothstep(0.0,0.06,vUv.x)*smoothstep(1.0,0.94,vUv.x);
      gl_FragColor=vec4(0.0,0.0,0.0,a*0.30*uOpacity);
    }\`,
  transparent:true, depthWrite:false
});
const lipShadow = new THREE.Mesh(new THREE.PlaneGeometry(1,1), lipShadowMat);
lipShadow.scale.set(D.contW, 90, 1);
lipShadow.position.z = 24; lipShadow.renderOrder = 7;
scene.add(lipShadow);

/* ============================================================ canvas plate */
function mkCanvas(w,h,res){
  const c=document.createElement('canvas');
  c.width=Math.max(2,Math.round(w*res)); c.height=Math.max(2,Math.round(h*res));
  c.getContext('2d').scale(res,res);
  return c;
}
function rr(x,x0,y0,w,h,r){ r=Math.min(r,w/2,h/2);
  x.beginPath(); x.moveTo(x0+r,y0);
  x.arcTo(x0+w,y0,x0+w,y0+h,r); x.arcTo(x0+w,y0+h,x0,y0+h,r);
  x.arcTo(x0,y0+h,x0,y0,r);     x.arcTo(x0,y0,x0+w,y0,r); x.closePath();
}
/* letterspaced draw — \`letterSpacing\` is not universal, so space by hand */
function tracked(x, str, px, py, track, align){
  const chars=[...str];
  let w=0; for(const c of chars) w += x.measureText(c).width + track;
  w -= track;
  let cx = align==='right' ? px-w : align==='center' ? px-w/2 : px;
  const prev = x.textAlign; x.textAlign='left';
  for(const c of chars){ x.fillText(c, cx, py); cx += x.measureText(c).width + track; }
  x.textAlign = prev;
  return w;
}
function trackedWidth(x, str, track){
  let w=0; for(const c of [...str]) w += x.measureText(c).width + track;
  return w-track;
}
function goldGrad(x, x0, y0, x1, y1){
  const g=x.createLinearGradient(x0,y0,x1,y1);
  g.addColorStop(0.00,'#9a7f45'); g.addColorStop(0.20,'#e7d7ae');
  g.addColorStop(0.40,'#c3a765'); g.addColorStop(0.60,'#f2e7c6');
  g.addColorStop(0.80,'#b79f63'); g.addColorStop(1.00,'#dccfa6');
  return g;
}

/* ------------------------------------------------------------ house mark */
/* A lozenge enclosing three tapering chevrons: flight, drawn as geometry so it
   rhymes with the damier and stays legible down to a few pixels.            */
function drawMark(x, x0, y0, s, colour){
  const k=s/100;
  x.save(); x.translate(x0,y0); x.scale(k,k);
  x.strokeStyle=colour; x.lineJoin='miter'; x.lineCap='butt'; x.miterLimit=6;
  x.lineWidth=4.6;
  x.beginPath(); x.moveTo(50,4); x.lineTo(96,50); x.lineTo(50,96); x.lineTo(4,50); x.closePath(); x.stroke();
  x.lineWidth=7.6;
  const rows=[[34,26,15],[52,19.5,12.5],[67,13,10.5]];
  for(const r of rows){
    x.beginPath(); x.moveTo(50-r[1], r[0]+r[2]); x.lineTo(50, r[0]); x.lineTo(50+r[1], r[0]+r[2]); x.stroke();
  }
  x.restore();
}

/* ------------------------------------------------ orbis mark: a ringed globe */
function drawOrbis(x, cx, cy, r, stroke, lw){
  x.save(); x.translate(cx,cy);
  x.strokeStyle=stroke; x.lineWidth=lw; x.lineCap='round';
  x.beginPath(); x.arc(0,0,r,0,Math.PI*2); x.stroke();
  x.beginPath(); x.ellipse(0,0,r*0.40,r,0,0,Math.PI*2); x.stroke();
  x.beginPath(); x.moveTo(-r,0); x.lineTo(r,0); x.stroke();
  x.beginPath(); x.moveTo(-r*0.86,-r*0.50); x.lineTo(r*0.86,-r*0.50); x.stroke();
  x.beginPath(); x.moveTo(-r*0.86, r*0.50); x.lineTo(r*0.86, r*0.50); x.stroke();
  x.restore();
}

/* ---------------------------------------------------------- retro gold chip */
function drawChip(x, x0, y0, w, h){
  const g = goldGrad(x, x0, y0, x0+w, y0+h);
  rr(x,x0,y0,w,h,4.5); x.fillStyle=g; x.fill();
  x.strokeStyle='rgba(60,42,10,0.55)'; x.lineWidth=0.8; x.stroke();
  x.save(); rr(x,x0,y0,w,h,4.5); x.clip();
  x.strokeStyle='rgba(48,34,8,0.48)'; x.lineWidth=1.0;
  const cy=y0+h/2;
  x.beginPath(); x.moveTo(x0,cy-h*0.22); x.lineTo(x0+w,cy-h*0.22);
  x.moveTo(x0,cy+h*0.22); x.lineTo(x0+w,cy+h*0.22);
  x.moveTo(x0+w*0.32,y0); x.lineTo(x0+w*0.32,y0+h);
  x.moveTo(x0+w*0.68,y0); x.lineTo(x0+w*0.68,y0+h); x.stroke();
  x.beginPath(); rr(x,x0+w*0.32,cy-h*0.22,w*0.36,h*0.44,1.5); x.stroke();
  x.restore();
}

/* ------------------------------------------------------------- line icons */
function iconEye(x, cx, cy, s, stroke, lw, slashed){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath();
  x.moveTo(-9,0); x.bezierCurveTo(-5.2,-5.8, 5.2,-5.8, 9,0);
  x.bezierCurveTo(5.2,5.8,-5.2,5.8,-9,0); x.closePath(); x.stroke();
  x.beginPath(); x.arc(0,0,2.6,0,Math.PI*2); x.stroke();
  if(slashed>0.02){
    x.globalAlpha=Math.min(1,slashed*3);
    x.beginPath(); x.moveTo(-8.6,-7.0); x.lineTo(8.6,7.0); x.stroke();
  }
  x.restore();
}
/* the reveal control is a rubber stamp, same language as the FROZEN mark */
const EYE = {x:400, y:242, w:43, h:28, rot:-0.075};
function eyeStampFrame(x, colour){
  x.save(); x.translate(EYE.x, EYE.y); x.rotate(EYE.rot);
  x.strokeStyle=colour; x.lineWidth=1.5;
  rr(x, -EYE.w/2, -EYE.h/2, EYE.w, EYE.h, 5); x.stroke();
  x.lineWidth=0.7;
  rr(x, -EYE.w/2+3.2, -EYE.h/2+3.2, EYE.w-6.4, EYE.h-6.4, 2.6); x.stroke();
  x.restore();
}
function iconLock(x, cx, cy, s, stroke, lw){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath();
  x.moveTo(-3.5,-1.0); x.lineTo(-3.5,-4.2);
  x.arc(0,-4.2,3.5,Math.PI,0); x.lineTo(3.5,-1.0); x.stroke();
  x.beginPath(); rr(x,-5.4,-1.0,10.8,8.4,1.8); x.stroke();
  x.beginPath(); x.moveTo(0,2.0); x.lineTo(0,4.6); x.stroke();
  x.restore();
}
function iconChevron(x, cx, cy, s, stroke, lw){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath(); x.moveTo(-2.6,-5.4); x.lineTo(2.8,0); x.lineTo(-2.6,5.4); x.stroke();
  x.restore();
}

/* ====================================================== studio environment */
/* A small equirectangular studio, painted once and sampled by the card's
   reflection vector — this is what makes the metal read as metal.          */
let texEnv=null, texEnvBlur=null;
function buildEnvTextures(){
  const W=1024, H=512;
  const base=document.createElement('canvas'); base.width=W; base.height=H;
  const x=base.getContext('2d');

  const g=x.createLinearGradient(0,0,0,H);          /* ceiling -> horizon -> floor */
  g.addColorStop(0.00,'#f4f3f0'); g.addColorStop(0.24,'#d3d0c9');
  g.addColorStop(0.44,'#3f3d3a'); g.addColorStop(0.474,'#1d1c1a');
  g.addColorStop(0.492,'#8d8a84');                   /* the horizon, ramped */
  g.addColorStop(0.503,'#ffffff');
  g.addColorStop(0.515,'#96938c'); g.addColorStop(0.538,'#232220');
  g.addColorStop(0.72,'#565450');
  g.addColorStop(1.00,'#b9b6b1');
  x.fillStyle=g; x.fillRect(0,0,W,H);

  function box(u,v,rw,rh,rot,inner,outer){
    x.save(); x.translate(u*W,(1.0-v)*H); x.rotate(rot);
    const rg=x.createRadialGradient(0,0,0,0,0,Math.max(rw,rh));
    rg.addColorStop(0,inner); rg.addColorStop(0.45,inner); rg.addColorStop(1,outer);
    x.globalCompositeOperation='lighter';
    x.scale(rw/Math.max(rw,rh), rh/Math.max(rw,rh));
    x.fillStyle=rg; x.beginPath(); x.arc(0,0,Math.max(rw,rh),0,Math.PI*2); x.fill();
    x.restore();
  }
  /* the card only ever sees u ~ 0.70..0.80 of this map, so the key is small
     enough to fall off across its face instead of flooding the whole plate */
  box(0.764,0.672,  74, 62, 0,      'rgba(255,255,255,0.96)','rgba(255,255,255,0)');  /* key */
  box(0.75,0.24,   170, 66, 0,      'rgba(216,214,208,0.28)','rgba(216,214,208,0)');  /* bounce */
  box(0.06,0.55,   140, 78, 0,      'rgba(206,200,186,0.40)','rgba(206,200,186,0)');  /* warm fill */
  box(0.30,0.74,    96, 52, 0,      'rgba(148,160,180,0.30)','rgba(148,160,180,0)');  /* cool fill */

  /* crisp strip lights — these are what give metal its hard streaks */
  function strip(u,v,w,h,a,soft){
    x.save(); x.globalCompositeOperation='lighter';
    x.filter = soft ? 'blur('+soft+'px)' : 'none';
    x.fillStyle='rgba(255,255,255,'+a+')';
    x.fillRect(u*W-w/2, (1.0-v)*H-h/2, w, h);
    x.filter='none'; x.restore();
  }
  strip(0.58,0.62,  16,200, 1.00, 2);
  strip(0.63,0.62,   7,200, 0.85, 1.5);
  strip(0.68,0.61,   4,180, 0.65, 1);
  strip(0.90,0.60,  12,160, 0.85, 2);
  strip(0.20,0.64,   9,150, 0.62, 2);
  strip(0.36,0.63,   5,140, 0.45, 1.5);
  strip(0.50,0.87, 340, 20, 0.60, 7);
  /* three more inside the card's own window, so the platinum has edges to
     catch rather than one flat wash of key light */
  strip(0.709,0.55,  10,210, 0.90, 2);
  strip(0.727,0.55,   4,210, 0.55, 1.2);
  strip(0.800,0.54,   7,190, 0.75, 2);

  const t=new THREE.CanvasTexture(base);
  t.wrapS=THREE.RepeatWrapping; t.wrapT=THREE.ClampToEdgeWrapping;
  t.minFilter=THREE.LinearMipmapLinearFilter; t.magFilter=THREE.LinearFilter;
  t.anisotropy=MAXA; t.needsUpdate=true;

  /* blurred copy — tiled three wide first so the u seam blurs across */
  const b=document.createElement('canvas'); b.width=W; b.height=H;
  const wide=document.createElement('canvas'); wide.width=W*3; wide.height=H;
  const wx=wide.getContext('2d');
  wx.drawImage(base,-0,0); wx.drawImage(base,W,0); wx.drawImage(base,W*2,0);
  const bx=b.getContext('2d');
  bx.filter='blur(26px)';
  bx.drawImage(wide, -W, 0);
  bx.filter='none';
  const tb=new THREE.CanvasTexture(b);
  tb.wrapS=THREE.RepeatWrapping; tb.wrapT=THREE.ClampToEdgeWrapping;
  tb.minFilter=THREE.LinearFilter; tb.magFilter=THREE.LinearFilter;
  tb.generateMipmaps=false; tb.needsUpdate=true;

  texEnv=t; texEnvBlur=tb;
}

/* ============================================================== card faces */
/* Each face is split into a foil-coverage mask (shaded as real metal in the
   fragment shader) and a printed-ink layer (RGBA, composited on top).      */
let texFoilFront=null, texArtFront=null, texFoilBack=null;
let backCanvas=null, texBack=null, backRes=4;
const backState = {reveal:0, eyePress:0};

function microText(x, str, x0, y0, x1, px, alpha){
  x.save(); x.globalAlpha=alpha; x.font=\`400 \${px}px \${UI}\`;
  let cx=x0; const gap=px*0.55;
  while(cx < x1){
    const w=trackedWidth(x,str,px*0.34);
    if(cx+w>x1) break;
    tracked(x,str,cx,y0,px*0.34,'left');
    cx += w+gap;
  }
  x.restore();
}

function buildFrontTextures(res){
  const W=D.cardW, H=D.cardH, R=D.cardR;

  /* ---- foil coverage (white = polished gold) ---- */
  const cf=mkCanvas(W,H,res); const f=cf.getContext('2d');
  f.fillStyle='#000'; f.fillRect(0,0,W,H);
  f.strokeStyle='#f00';

  f.lineWidth=1.0; rr(f,11,11,W-22,H-22,R-11); f.stroke();          /* concentric */
  f.strokeStyle='rgba(255,0,0,0.34)';
  f.lineWidth=0.7; rr(f,15,15,W-30,H-30,R-15); f.stroke();

  f.fillStyle='#f00'; f.textBaseline='alphabetic'; f.textAlign='right';
  let fs=140; f.font=\`300 \${fs}px \${DISP}\`;
  const cap=(f.measureText(BRAND.monogram).actualBoundingBoxAscent||fs*0.7);
  fs=fs*(50/cap);
  f.font=\`300 \${fs}px \${DISP}\`;
  f.fillText(BRAND.monogram, W-38, 36+50);

  f.textAlign='left';
  f.font=\`400 21px \${UI}\`;
  const wmW=trackedWidth(f,BRAND.network.toUpperCase(),4.2);
  tracked(f, BRAND.network.toUpperCase(), W-40-wmW, H-48, 4.2, 'left');
  f.font=\`400 8px \${UI}\`; f.fillStyle='rgba(255,0,0,0.55)';
  tracked(f, BRAND.tier.toUpperCase(), W-40, H-33, 2.6, 'right');

  /* contact chip: eight pads with milled gaps, so the gaps read as gunmetal */
  /* The contact plate goes in the green channel, so the shader can give it a
     champagne tint of its own; the milled gaps drop to zero and expose the
     card's own metal, which is what makes the pads legible on a light card. */
  const cx0=36, cy0=72, cw=50, ch=38, gp=2.1;
  f.fillStyle='rgba(0,255,0,1)'; rr(f,cx0,cy0,cw,ch,4.5); f.fill();
  f.save(); rr(f,cx0,cy0,cw,ch,4.5); f.clip();
  f.globalCompositeOperation='destination-out';
  f.lineWidth=gp; f.strokeStyle='#000'; f.lineCap='butt';
  const mx=cx0+cw*0.38, my=cy0+ch/2;
  f.beginPath();
  f.moveTo(cx0-2, cy0+ch*0.285); f.lineTo(cx0+cw+2, cy0+ch*0.285);
  f.moveTo(cx0-2, cy0+ch*0.715); f.lineTo(cx0+cw+2, cy0+ch*0.715);
  f.moveTo(mx, cy0-2); f.lineTo(mx, cy0+ch*0.285);
  f.moveTo(mx, cy0+ch*0.715); f.lineTo(mx, cy0+ch+2);
  f.moveTo(cx0+cw*0.76, cy0-2); f.lineTo(cx0+cw*0.76, cy0+ch+2);
  f.stroke();
  /* the C4/C8 island in the middle band, and the die window inside it */
  f.lineWidth=gp*0.85;
  f.beginPath(); rr(f, mx+1.4, cy0+ch*0.285+1.4, cw*0.34, ch*0.43, 1.8); f.stroke();
  f.lineWidth=gp*0.6;
  f.beginPath(); f.moveTo(cx0+2.5, cy0+ch*0.50); f.lineTo(mx-1.4, cy0+ch*0.50); f.stroke();
  f.globalCompositeOperation='source-over';
  f.restore();

  /* micro-lettering along the inside of the frame */
  f.fillStyle='#f00'; f.textAlign='left';
  microText(f, 'HALCYON · ORBIS · NOIR EDITION ·', 26, H-19, W-26, 3.4, 0.5);

  const tf=new THREE.CanvasTexture(cf);
  tf.minFilter=THREE.LinearMipmapLinearFilter; tf.magFilter=THREE.LinearFilter;
  tf.anisotropy=MAXA; tf.needsUpdate=true;

  /* ---- printed ink ---- */
  const ca=mkCanvas(W,H,res); const a=ca.getContext('2d');
  a.clearRect(0,0,W,H);
  a.textBaseline='alphabetic'; a.textAlign='left';
  a.font=\`400 8px \${UI}\`;
  a.fillStyle='rgba(34,36,42,0.46)';
  tracked(a, BRAND.since.toUpperCase(), 36, H-33, 2.4, 'left');
  const ta=new THREE.CanvasTexture(ca);
  ta.minFilter=THREE.LinearMipmapLinearFilter; ta.magFilter=THREE.LinearFilter;
  ta.anisotropy=MAXA; ta.needsUpdate=true;

  return [tf,ta];
}

function buildBackFoil(res){
  const W=D.cardW, H=D.cardH, R=D.cardR;
  const cf=mkCanvas(W,H,res); const f=cf.getContext('2d');
  f.fillStyle='#000'; f.fillRect(0,0,W,H);

  /* the printed frame starts below the magnetic stripe — running it under the
     stripe left a clipped stub at the top corners                            */
  const FT = D.stripeH + 12;
  f.strokeStyle='rgba(255,0,0,0.62)'; f.lineWidth=0.9;
  rr(f, 11, FT, W-22, H-11-FT, R-11); f.stroke();

  drawMark(f, 30, 88, 58, '#ff0000');

  eyeStampFrame(f, 'rgba(255,0,0,0.92)');

  f.textAlign='left'; f.fillStyle='#f00';
  microText(f, 'HALCYON \\u00b7 ORBIS \\u00b7 NOIR EDITION \\u00b7', 30, 80, W-30, 3.4, 0.42);

  const tf=new THREE.CanvasTexture(cf);
  tf.minFilter=THREE.LinearMipmapLinearFilter; tf.magFilter=THREE.LinearFilter;
  tf.anisotropy=MAXA; tf.needsUpdate=true;
  return tf;
}

function buildBackCanvas(res){
  backRes=res;
  backCanvas=mkCanvas(D.cardW,D.cardH,res);
  texBack=new THREE.CanvasTexture(backCanvas);
  texBack.minFilter=THREE.LinearMipmapLinearFilter; texBack.magFilter=THREE.LinearFilter;
  texBack.anisotropy=MAXA;
  drawBack();
}

function drawBack(){
  const W=D.cardW,H=D.cardH;
  const x=backCanvas.getContext('2d');
  x.setTransform(backRes,0,0,backRes,0,0);
  x.clearRect(0,0,W,H);

  const LX=30, NUM_X=108, CREAM='rgba(24,25,29,0.93)', DIM='rgba(58,60,67,0.62)';
  const BASE_LBL=230, BASE_VAL=249, BASE_NUM=124;   /* number rides beside the emblem */
  const EXP_X=272, CVV_X=336;

  /* signature panel — the element that actually belongs in this band */
  const SP={x:30, y:158, w:360, h:34};
  x.save();
  rr(x, SP.x, SP.y, SP.w, SP.h, 3.5);
  x.fillStyle='rgba(233,233,229,0.96)'; x.fill();
  x.save(); rr(x, SP.x, SP.y, SP.w, SP.h, 3.5); x.clip();
  x.strokeStyle='rgba(112,116,124,0.22)'; x.lineWidth=0.6;
  for(let i=-SP.h; i<SP.w+SP.h; i+=4){
    x.beginPath(); x.moveTo(SP.x+i, SP.y); x.lineTo(SP.x+i-SP.h, SP.y+SP.h); x.stroke();
  }
  x.fillStyle='rgba(98,102,110,0.26)'; x.font=\`400 4.6px \${UI}\`;
  for(let r=0;r<3;r++){
    let cx2=SP.x+4;
    while(cx2 < SP.x+SP.w-8){
      cx2 += tracked(x, 'HALCYON \\u00b7 ORBIS', cx2, SP.y+9.5+r*9.5, 1.1, 'left') + 6;
    }
  }
  x.restore();
  x.strokeStyle='rgba(88,90,96,0.34)'; x.lineWidth=0.8;
  rr(x, SP.x+0.4, SP.y+0.4, SP.w-0.8, SP.h-0.8, 3.5); x.stroke();
  x.restore();
  x.font=\`400 7px \${UI}\`; x.fillStyle='rgba(62,64,71,0.55)';
  tracked(x,'AUTHORISED SIGNATURE', SP.x+1, SP.y+SP.h+14, 2.0, 'left');

  x.textBaseline='alphabetic'; x.textAlign='left';
  x.font=\`400 8px \${UI}\`; x.fillStyle=DIM;
  tracked(x,'CARDHOLDER',LX,BASE_LBL,2.3,'left');
  tracked(x,'VALID',EXP_X,BASE_LBL,2.3,'left');
  tracked(x,'CVV',CVV_X,BASE_LBL,2.3,'left');

  x.font=\`400 12.5px \${UI}\`; x.fillStyle=CREAM;
  tracked(x,BRAND.holder.toUpperCase(),LX,BASE_VAL,1.5,'left');

  x.font=\`400 17px \${UI}\`;
  const ADV=11.8, GAP=9.5, RISE=16, DOTR=2.4, DOTY=BASE_NUM-5.4, ROLL=0.24;
  function dot(cx, cy, a){
    x.save(); x.globalAlpha=a; x.fillStyle='rgba(36,38,44,0.82)';
    x.beginPath(); x.arc(cx, cy, DOTR, 0, Math.PI*2); x.fill(); x.restore();
  }
  function slot(cx, real, p){
    const e = p<=0?0:(p>=1?1:(p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2));
    x.save();
    x.beginPath(); x.rect(cx-ADV*0.60, BASE_NUM-15, ADV*1.2, 21); x.clip();
    if(e<1) dot(cx, DOTY - e*RISE, Math.pow(1-e,0.9));
    if(e>0){
      x.globalAlpha=Math.pow(e,0.7); x.fillStyle=CREAM; x.textAlign='center';
      x.fillText(real, cx, BASE_NUM + (1-e)*RISE);
    }
    x.restore(); x.globalAlpha=1; x.textAlign='left';
  }
  const pan = BRAND.pan.replace(/ /g,'');
  let cx = NUM_X;
  for(let grp=0; grp<4; grp++){
    for(let i=0;i<4;i++){
      const gi=grp*4+i, cxx=cx+ADV/2;
      if(gi>=12){
        x.save(); x.textAlign='center'; x.fillStyle=CREAM;
        x.fillText(pan[gi], cxx, BASE_NUM); x.restore();
      }else{
        slot(cxx, pan[gi], Math.max(0,Math.min(1,(backState.reveal-(gi/12)*0.50)/ROLL)));
      }
      cx += ADV;
    }
    if(grp<3) cx += GAP;
  }

  x.font=\`400 12.5px \${UI}\`;
  const AD2=9.4;
  function smallSlot(px, ch, p){
    const e=p<=0?0:(p>=1?1:(p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2));
    x.save(); x.beginPath(); x.rect(px-1, BASE_VAL-13, AD2+2, 18); x.clip();
    if(e<1){ x.globalAlpha=Math.pow(1-e,0.9); x.fillStyle='rgba(36,38,44,0.82)';
      x.beginPath(); x.arc(px+AD2/2, BASE_VAL-4.2-e*13, 2.1,0,Math.PI*2); x.fill(); }
    if(e>0){ x.globalAlpha=Math.pow(e,0.7); x.fillStyle=CREAM; x.textAlign='center';
      x.fillText(ch, px+AD2/2, BASE_VAL+(1-e)*13); }
    x.restore(); x.globalAlpha=1; x.textAlign='left';
  }
  let ex=EXP_X;
  for(let i=0;i<BRAND.exp.length;i++){
    const ch=BRAND.exp[i];
    if(ch==='/'){
      x.save(); x.textAlign='center'; x.fillStyle=DIM;
      x.fillText('/', ex+AD2*0.42, BASE_VAL); x.restore(); ex += AD2*0.84;
    }else{
      smallSlot(ex, ch, Math.max(0,Math.min(1,(backState.reveal-(0.50+(i/5)*0.12))/ROLL)));
      ex += AD2;
    }
  }
  let cvx=CVV_X;
  for(let i=0;i<3;i++){
    smallSlot(cvx, BRAND.cvv[i], Math.max(0,Math.min(1,(backState.reveal-(0.62+(i/3)*0.12))/ROLL)));
    cvx += AD2;
  }

  /* the stamp frame is foil; its inked impression is drawn here */
  if(backState.eyePress>0.001){
    x.save(); x.globalAlpha=0.38*(1-backState.eyePress);
    x.translate(EYE.x,EYE.y); x.rotate(EYE.rot);
    x.strokeStyle='rgba(40,42,48,0.85)'; x.lineWidth=1.3;
    const g=backState.eyePress*16;
    rr(x, -EYE.w/2-g, -EYE.h/2-g, EYE.w+g*2, EYE.h+g*2, 5.5+g); x.stroke();
    x.restore();
  }
  x.save(); x.translate(EYE.x,EYE.y); x.rotate(EYE.rot);
  iconEye(x, 0, 0, 0.78, 'rgba(40,42,49,0.86)', 1.6, backState.reveal);
  x.restore();

  if(texBack) texBack.needsUpdate=true;
}

/* ================================================================ the card */
function roundedShape(w,h,r){
  const s=new THREE.Shape();
  const x=-w/2, y=-h/2;
  s.moveTo(x+r,y);
  s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y);
  return s;
}
const cardGeo = new THREE.ExtrudeGeometry(roundedShape(D.cardW,D.cardH,D.cardR),
  {depth:D.cardT, bevelEnabled:false, curveSegments:28, steps:1});
cardGeo.translate(0,0,-D.cardT/2);

const CARD_FRAG = \`
  varying vec2 vUvC; varying vec3 vNw; varying vec3 vWp; varying float vFace;
  uniform sampler2D tFoilF, tArtF, tFoilB, tArtB, tEnv, tEnvB;
  uniform vec2 uCard; uniform vec3 uCam;
  uniform float uLock, uStripe, uGain, uEnvRot;
  \${GLSL}

  vec2 equirectUv(vec3 d){
    d = normalize(d);
    float ax = (abs(d.x) < 1e-5 && abs(d.z) < 1e-5) ? 1e-5 : d.x;
    float u = atan(d.z, ax)*0.15915494 + 0.5 + uEnvRot;
    float v = asin(clamp(d.y,-1.0,1.0))*0.31830989 + 0.5;
    return vec2(u, clamp(v,0.003,0.997));
  }

  void main(){
    vec2 uv = vUvC;
    bool front = vFace > 0.0;
    vec2 tuv = front ? vec2(uv.x, uv.y) : vec2(1.0-uv.x, uv.y);
    float u  = tuv.x;
    float ty = 1.0-uv.y;
    vec2 sp  = vec2(u*uCard.x, ty*uCard.y);

    float stripe = front ? 0.0 : step(ty*uCard.y, uStripe);
    /* red is polished foil, green is the contact plate — the chip has to be a
       different metal from the card or its milling vanishes into the field */
    vec4 mask = front ? texture2D(tFoilF, tuv) : texture2D(tFoilB, tuv);
    float foil = mask.r;
    float chip = mask.g;
    float proud = max(foil, chip);

    /* ---- surface: brushed metal, engine-turned check, guilloche rosette --- */
    vec3 N = normalize(vNw);
    vec3 T = normalize(cross(N, vec3(0.0,1.0,0.0)) + vec3(1e-4));
    vec3 B = normalize(cross(N, T));

    /* fw is world units per screen pixel; lod is how much fine grain this
       raster can hold. Anything below two samples per cycle is faded out
       rather than drawn — a normal that jitters faster than the raster swings
       the reflection across the studio's horizon and tears the plate. */
    float fw  = max(fwidth(sp.y), 1e-3);
    float lod = clamp((1.90 - fw)/0.90, 0.0, 1.0);
    float br  = fbm(vec2(sp.x*0.052, sp.y*0.46))-0.5;      /* slow lane drift */
    float br2 = vnoise(vec2(sp.x*0.13, sp.y*0.90))-0.5;    /* the coarse grain */
    float bump = (br*0.58 + br2*0.40*lod)*0.020;
    bump += (fbm(sp*0.085)-0.5)*0.013;          /* clear-coat orange peel */

    float rough = 0.28;
    vec2 bump2 = vec2(0.0);
    if(stripe < 0.5){
      /* no engine-turning and no rosette: a plain circular-brushed platinum
         field, so the only figure on the card is the polished foil itself */
      float lin2 = fbm(vec2(sp.x*0.042, sp.y*0.34));
      rough += (lin2-0.5)*0.052;
    }else{
      rough = 0.50 + (vnoise(vec2(sp.x*0.6, sp.y*26.0))-0.5)*0.14;
      bump += (vnoise(vec2(sp.x*0.18, sp.y*34.0))-0.5)*0.022;
      bump += (fbm(vec2(sp.x*0.05, sp.y*3.0))-0.5)*0.016;
    }

    /* foil sits proud of the surface: its edges catch a hard rim, and the
       stamped face is faintly uneven, so it never reads as a flat fill      */
    if(proud > 0.015){
      vec2 tx = vec2(4.2/uCard.x, 4.2/uCard.y);
      vec4 px = front ? texture2D(tFoilF, tuv+vec2(tx.x,0.0)) : texture2D(tFoilB, tuv+vec2(tx.x,0.0));
      vec4 mx = front ? texture2D(tFoilF, tuv-vec2(tx.x,0.0)) : texture2D(tFoilB, tuv-vec2(tx.x,0.0));
      vec4 py = front ? texture2D(tFoilF, tuv+vec2(0.0,tx.y)) : texture2D(tFoilB, tuv+vec2(0.0,tx.y));
      vec4 my = front ? texture2D(tFoilF, tuv-vec2(0.0,tx.y)) : texture2D(tFoilB, tuv-vec2(0.0,tx.y));
      float fx = max(px.r,px.g) - max(mx.r,mx.g);
      float fy = max(py.r,py.g) - max(my.r,my.g);
      bump2 += vec2(fx, -fy)*0.185;
      bump2 += (vec2(fbm(sp*0.030), fbm(sp*0.030+vec2(11.0,5.0)))-0.5)*0.105*proud;
    }
    /* cap the tilt: an unbounded bevel swings the reflection onto the dark
       floor of the studio and stamps a hard black rim around every glyph   */
    float bl = length(bump2);
    if(bl > 0.085) bump2 *= 0.085/bl;
    rough = mix(rough, 0.075, foil);                        /* foil is polished */
    rough = mix(rough, 0.150, chip);                        /* the plate is milled */

    /* The diamond-cut rim. A metal card is chamfered, so its perimeter is a
       narrow fully polished bevel turned outward — end-on it catches a hard
       line of room that the flat face never sees, and that line is most of
       what makes the object read as cut metal rather than as a print. */
    float inset = -sdRound(sp - uCard*0.5, uCard*0.5, 18.0);
    float bev   = 1.0 - smoothstep(0.8, 4.4, inset);
    vec2  bdir  = (sp - uCard*0.5)/uCard;
    bdir = normalize(bdir + 1e-4);
    bump2 += vec2(bdir.x, -bdir.y)*bev*0.30;
    rough  = mix(rough, 0.040, bev);
    N = normalize(N + T*(bump+bump2.x) + B*(bump*0.35+bump2.y));

    vec3 V = normalize(uCam - vWp);
    vec3 R = reflect(-V, N);
    float NoV = clamp(dot(N,V), 0.0, 1.0);

    /* brushed metal smears its reflection along the grain — three taps in the
       environment's azimuth do the job far more cheaply than a rough BRDF     */
    vec2 e0 = equirectUv(R);
    /* A groove running along the card's long axis is a cylinder lying
       horizontally, so its normal fans vertically: it smears the room in
       elevation, not in azimuth. That matters here because the studio's whole
       structure — the horizon ramp — lives in elevation. Jittering the
       elevation per line is therefore what makes one groove reflect the bright
       side of the horizon and its neighbour the dark side, which is the fine
       bright-and-dark striping the eye reads as brushed metal. Jittering
       azimuth instead moves the sample along a band that barely changes, which
       is why the plate came out as smooth grey paint. */
    /* Long and straight along the grain, dense across it: a low x frequency
       keeps a groove continuous down the whole card, and a y frequency close
       to what the raster can hold keeps the lines fine rather than blobby.
       Getting either wrong turns the plate into flowing liquid. */
    float jl = (vnoise(vec2(sp.x*0.0045, sp.y*0.44))-0.5)
             + (vnoise(vec2(sp.x*0.0130, sp.y*1.00))-0.5)*0.72*lod
             + (vnoise(vec2(sp.x*0.0320, sp.y*2.15))-0.5)*0.34*lod*lod;
    float aniso = 0.025*(1.0-proud*0.84)*(1.0-bev*0.90);
    vec2 eJ = vec2(e0.x, clamp(e0.y + jl*aniso, 0.004, 0.996));
    float spread = 0.0030 + rough*0.011;
    vec3 es = ( texture2D(tEnv, eJ).rgb
              + texture2D(tEnv, vec2(eJ.x, clamp(eJ.y+spread, 0.004, 0.996))).rgb
              + texture2D(tEnv, vec2(eJ.x, clamp(eJ.y-spread, 0.004, 0.996))).rgb ) * (1.0/3.0);
    vec3 eb = texture2D(tEnvB, eJ).rgb;
    /* the blurred copy at the authored weight swamps the streaks it took all
       that jitter to produce, so cross-grain blur is capped well below it */
    vec3 refl = mix(es, eb, clamp(rough*1.15, 0.0, 0.52));

    /* ---- metal tint: dark gunmetal, or gold where the foil is ------------- */
    vec3 gun  = vec3(0.505,0.514,0.538);      /* brushed platinum field */
    vec3 gold = vec3(0.892,0.900,0.918);      /* polished foil detail      */
    vec3 tint = mix(gun, gold, foil);
    tint = mix(tint, vec3(0.762,0.638,0.392), chip);        /* champagne contact plate */
    if(stripe > 0.5) tint = vec3(0.088,0.086,0.092);

    vec3 F = tint + (1.0-tint)*pow(1.0-NoV, 5.0)*(1.0-rough*0.8);
    vec3 col = refl * F * uGain;
    /* metal photographs with its shadows crushed and its speculars clipped;
       a straight linear reflectance reads as grey paint */
    col = pow(max(col, vec3(0.0)), vec3(1.14)) * 1.10;
    float L = dot(col, vec3(0.299,0.587,0.114));
    col = mix(col, vec3(L), smoothstep(0.50,1.05,L)*0.52);   /* specular roll-off */

    /* the finest grain, as luminance: it can never move the reflection */
    float lf = 0.46;
    float lines = (vnoise(vec2(sp.x*0.026, sp.y*lf))-0.5)*0.80
                + (vnoise(vec2(sp.x*0.072, sp.y*lf*2.2))-0.5)*0.50*lod;
    col *= 1.0 + lines*0.085*lod*(1.0 - proud*0.62);
    col *= 0.982 + 0.034*hash21(sp*1.9);

    /* ---- printed ink ------------------------------------------------------ */
    vec4 art = front ? texture2D(tArtF, tuv) : texture2D(tArtB, tuv);
    if(!front && uLock > 0.001){
      vec2 o = vec2(1.15/uCard.x, 1.15/uCard.y)*uLock;
      vec4 s1=texture2D(tArtB,tuv+vec2(o.x,0.0)), s2=texture2D(tArtB,tuv-vec2(o.x,0.0));
      vec4 s3=texture2D(tArtB,tuv+vec2(0.0,o.y)), s4=texture2D(tArtB,tuv-vec2(0.0,o.y));
      art = mix(art, (art+s1+s2+s3+s4)/5.0, uLock);
    }
    col = mix(col, art.rgb, art.a);

    /* ---- frozen: a warm veil --------------------------------------------- */
    if(uLock > 0.001){
      vec3 frost = col*0.60 + vec3(0.320,0.330,0.348);
      float cloud = fbm(sp*0.075) + 0.5*fbm(sp*0.19+vec2(7.3,2.1));
      frost += (cloud-0.75)*0.034;
      frost += (hash21(sp*2.7)-0.5)*0.012;
      col = mix(col, frost, uLock);
    }

    gl_FragColor = vec4(col, 1.0);
  }
\`;

const cardCapMat = new THREE.ShaderMaterial({
  uniforms:{
    tFoilF:{value:null}, tArtF:{value:null}, tFoilB:{value:null}, tArtB:{value:null},
    tEnv:{value:null}, tEnvB:{value:null},
    uCard:{value:new THREE.Vector2(D.cardW,D.cardH)},
    uCam:{value:new THREE.Vector3()},
    uLock:{value:0}, uStripe:{value:D.stripeH}, uGain:{value:1.70}, uEnvRot:{value:0}
  },
  transparent:true, depthWrite:true,
  vertexShader:\`
    varying vec2 vUvC; varying vec3 vNw; varying vec3 vWp; varying float vFace;
    uniform vec2 uCard;
    void main(){
      vUvC = position.xy/uCard + 0.5;
      vFace = normal.z;
      vNw = normalize(mat3(modelMatrix)*normal);
      vec4 wp = modelMatrix*vec4(position,1.0);
      vWp = wp.xyz;
      gl_Position = projectionMatrix*viewMatrix*wp;
    }\`,
  fragmentShader: CARD_FRAG
});

/* the milled edge of the card, lit by the same studio */
const cardWallMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:true,
  uniforms:{ uCam:{value:new THREE.Vector3()}, tEnv:{value:null}, tEnvB:{value:null},
             uLock:{value:0}, uGain:{value:1.72}, uEnvRot:{value:0} },
  vertexShader:\`
    varying vec3 vNw; varying vec3 vWp;
    void main(){ vNw=normalize(mat3(modelMatrix)*normal); vec4 wp=modelMatrix*vec4(position,1.0);
      vWp=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }\`,
  fragmentShader:\`
    varying vec3 vNw; varying vec3 vWp;
    uniform vec3 uCam; uniform sampler2D tEnv, tEnvB; uniform float uLock, uGain, uEnvRot;
    void main(){
      vec3 N=normalize(vNw); vec3 V=normalize(uCam-vWp);
      vec3 R=reflect(-V,N);
      vec3 d=normalize(R);
      float ax=(abs(d.x)<1e-5 && abs(d.z)<1e-5)?1e-5:d.x;
      vec2 uvv=vec2(atan(d.z,ax)*0.15915494+0.5+uEnvRot, clamp(asin(clamp(d.y,-1.0,1.0))*0.31830989+0.5,0.003,0.997));
      vec3 refl=mix(texture2D(tEnv,uvv).rgb, texture2D(tEnvB,uvv).rgb, 0.36);
      /* the cut wall is polished, and it is brightest where it turns up */
      refl *= 0.72 + 0.72*clamp(0.5+0.5*N.y, 0.0, 1.0);
      float NoV=clamp(dot(N,V),0.0,1.0);
      vec3 tint=vec3(0.560,0.564,0.578);
      vec3 F=tint+(1.0-tint)*pow(1.0-NoV,5.0)*0.6;
      vec3 col=refl*F*uGain;
      col = mix(col, mix(col, vec3(0.72,0.73,0.76), 0.5), uLock);
      gl_FragColor=vec4(col,1.0);
    }\`
});

const cardMesh  = new THREE.Mesh(cardGeo, [cardCapMat, cardWallMat]);
const cardPivot = new THREE.Group();
cardPivot.add(cardMesh);
cardMesh.renderOrder = 5;
scene.add(cardPivot);

/* ------------------------------------------------------ frozen stamp plate */
let stampTex=null;
function buildStamp(res){
  const W=210,H=76;
  const c=mkCanvas(W,H,res); const x=c.getContext('2d');
  x.clearRect(0,0,W,H);
  x.translate(W/2,H/2); x.rotate(-0.10); x.translate(-W/2,-H/2);
  const bw=176, bh=52, bx=(W-bw)/2, by=(H-bh)/2;
  const ink='rgba(28,30,36,0.90)';
  x.strokeStyle=ink; x.lineWidth=2.2; rr(x,bx,by,bw,bh,4); x.stroke();
  x.lineWidth=0.9; rr(x,bx+5,by+5,bw-10,bh-10,2.5); x.stroke();
  x.fillStyle='rgba(238,239,240,0.46)'; rr(x,bx,by,bw,bh,4); x.fill();
  iconLock(x, bx+30, by+bh/2, 1.15, ink, 2.0);
  x.fillStyle=ink; x.font=\`400 19px \${UI}\`; x.textBaseline='middle';
  tracked(x, BRAND.frozen.toUpperCase(), bx+52, by+bh/2+1, 5.0, 'left');
  stampTex=new THREE.CanvasTexture(c);
  stampTex.minFilter=THREE.LinearMipmapLinearFilter; stampTex.magFilter=THREE.LinearFilter;
  stampTex.anisotropy=MAXA;
  return [W,H];
}
const stampMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false, opacity:0});
const stampMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), stampMat);
stampMesh.renderOrder = 6;
cardMesh.add(stampMesh);

/* ================================================================== chrome */
let chromeCanvas=null, chromeTex=null, chromeRes=3, chromeDirty=true;
const chromeMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false});
const chromeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), chromeMat);
chromeMesh.scale.set(D.contW, D.contOpen, 1);
chromeMesh.position.z = -12; chromeMesh.renderOrder = 3;
scene.add(chromeMesh);

const ui = {rowP:[0,0,0], headP:0, closeP:0, toggle:0, hover:-1, pressRow:-1};

function buildChrome(res){
  chromeRes=res;
  chromeCanvas=mkCanvas(D.contW, D.contOpen, res);
  chromeTex=new THREE.CanvasTexture(chromeCanvas);
  chromeTex.minFilter=THREE.LinearFilter; chromeTex.magFilter=THREE.LinearFilter;
  chromeTex.generateMipmaps=false; chromeTex.anisotropy=MAXA;
  chromeMat.map=chromeTex; chromeMat.needsUpdate=true;
  chromeDirty=true;
}

/* a woven-check wash used behind the panel rows */
function checkFill(x, x0, y0, w, h, sz, a1, a2){
  x.save(); x.beginPath(); x.rect(x0,y0,w,h); x.clip();
  for(let j=0;j*sz<h+sz;j++) for(let i=0;i*sz<w+sz;i++){
    x.fillStyle = ((i+j)&1) ? a1 : a2;
    x.fillRect(x0+i*sz, y0+j*sz, sz, sz);
  }
  x.restore();
}

function drawChrome(){
  const W=D.contW,H=D.contOpen;
  const x=chromeCanvas.getContext('2d');
  x.setTransform(chromeRes,0,0,chromeRes,0,0);
  x.clearRect(0,0,W,H);
  const labels=[BRAND.rowLock, BRAND.rowShow, BRAND.rowReset];
  const CREAM='rgba(238,239,243,0.92)';

  /* --- section head: rule — CARD CONTROLS — rule --- */
  if(ui.headP>0.002){
    const e=1-Math.pow(1-ui.headP,3);
    x.save(); x.globalAlpha=Math.min(1,e*1.2);
    const y=D.headY+(1-e)*10;
    x.font=\`400 9px \${UI}\`; x.textBaseline='middle';
    const t=BRAND.panelHead.toUpperCase();
    const tw=trackedWidth(x,t,3.4);
    x.fillStyle='rgba(212,214,220,0.64)';
    tracked(x,t,W/2-tw/2,y,3.4,'left');
    x.strokeStyle='rgba(198,201,208,0.24)'; x.lineWidth=0.8;
    x.beginPath();
    x.moveTo(D.rowX+4,y-0.5); x.lineTo(W/2-tw/2-13,y-0.5);
    x.moveTo(W/2+tw/2+9,y-0.5); x.lineTo(W-D.rowX-4,y-0.5);
    x.stroke(); x.restore();
  }

  for(let i=0;i<3;i++){
    const p=ui.rowP[i];
    if(p<=0.002) continue;
    const e=p<1? 1-Math.pow(1-p,3) : 1;
    const y=D.rowY[i] + (1-e)*16;
    x.save();
    x.globalAlpha=Math.min(1,e*1.15);

    const hot = (ui.pressRow===i) ? 2 : (ui.hover===i ? 1 : 0);
    /* the row is pressed into the lining: dark well, lit lower lip */
    rr(x,D.rowX,y,D.rowW,D.rowH,12);
    x.save(); x.clip();
    const g=x.createLinearGradient(D.rowX,y,D.rowX,y+D.rowH);
    g.addColorStop(0,\`rgba(5,5,7,\${0.60-hot*0.10})\`);
    g.addColorStop(0.55,\`rgba(20,20,24,\${0.48-hot*0.08})\`);
    g.addColorStop(1,\`rgba(48,48,54,\${0.38-hot*0.05})\`);
    x.fillStyle=g; x.fillRect(D.rowX,y,D.rowW,D.rowH);
    checkFill(x,D.rowX,y,D.rowW,D.rowH,6,'rgba(236,240,250,0.026)','rgba(0,0,0,0.034)');
    x.strokeStyle='rgba(0,0,0,0.55)'; x.lineWidth=2.2;
    rr(x,D.rowX,y-1.2,D.rowW,D.rowH,12); x.stroke();
    x.restore();
    x.strokeStyle=\`rgba(222,225,232,\${0.16+hot*0.06})\`; x.lineWidth=0.9;
    rr(x,D.rowX+0.45,y+0.45,D.rowW-0.9,D.rowH-0.9,12); x.stroke();
    x.strokeStyle='rgba(236,239,246,0.11)'; x.lineWidth=0.9;
    x.beginPath(); x.moveTo(D.rowX+16,y+D.rowH-0.5); x.lineTo(D.rowX+D.rowW-16,y+D.rowH-0.5); x.stroke();

    x.fillStyle=CREAM; x.font=\`400 13px \${UI}\`; x.textBaseline='middle';
    x.save(); x.globalAlpha=0.5*x.globalAlpha; x.fillStyle='rgba(0,0,0,0.9)';
    tracked(x, labels[i].toUpperCase(), D.rowX+26, y+D.rowH/2+1.6, 2.5, 'left'); x.restore();
    x.fillStyle=CREAM;
    tracked(x, labels[i].toUpperCase(), D.rowX+26, y+D.rowH/2+0.5, 2.5, 'left');

    if(i===0){
      const tw=54, th=27, tx=D.rowX+D.rowW-24-tw, ty=y+(D.rowH-th)/2;
      const t=ui.toggle;
      rr(x,tx,ty,tw,th,th/2);
      x.fillStyle='rgba(56,56,63,0.75)'; x.fill();
      if(t>0.001){
        x.save(); x.globalAlpha=t; rr(x,tx,ty,tw,th,th/2);
        const tg=x.createLinearGradient(tx,ty,tx,ty+th);
        tg.addColorStop(0,'#9aa0ab'); tg.addColorStop(1,'#666c77');
        x.fillStyle=tg; x.fill(); x.restore();
      }
      x.strokeStyle='rgba(224,227,234,0.26)'; x.lineWidth=0.9;
      rr(x,tx+0.45,ty+0.45,tw-0.9,th-0.9,th/2); x.stroke();
      const kr=th/2-3.4;
      const kx=tx+3.4+kr + t*(tw-2*(3.4+kr));
      x.save();
      x.shadowColor='rgba(0,0,0,0.5)'; x.shadowBlur=4; x.shadowOffsetY=1.2;
      x.beginPath(); x.arc(kx, ty+th/2, kr, 0, Math.PI*2);
      x.fillStyle='#f7f8fa'; x.fill();
      x.restore();
      x.strokeStyle='rgba(70,72,80,0.30)'; x.lineWidth=0.7;
      x.beginPath(); x.arc(kx, ty+th/2, kr-0.4, 0, Math.PI*2); x.stroke();
    }else{
      iconChevron(x, D.rowX+D.rowW-30, y+D.rowH/2, 1.05, 'rgba(204,207,215,0.72)', 1.4);
    }
    x.restore();
  }

  /* close */
  if(ui.closeP>0.002){
    const e=1-Math.pow(1-ui.closeP,3);
    x.save(); x.globalAlpha=Math.min(1,e*1.2);
    const cy=D.closeY+(1-e)*14;
    x.beginPath(); x.arc(W/2, cy, D.closeR, 0, Math.PI*2);
    x.fillStyle='rgba(176,180,190,0.075)'; x.fill();
    x.strokeStyle='rgba(204,208,216,0.20)'; x.lineWidth=0.9; x.stroke();
    x.strokeStyle='rgba(232,234,240,0.78)'; x.lineWidth=1.4; x.lineCap='round';
    const s=5.0;
    x.beginPath(); x.moveTo(W/2-s,cy-s); x.lineTo(W/2+s,cy+s);
    x.moveTo(W/2+s,cy-s); x.lineTo(W/2-s,cy+s); x.stroke();
    x.restore();
  }
  chromeTex.needsUpdate=true;
}

/* ========================================================= flap text plate */
let flapTexCanvas=null, flapTex=null, flapTexRes=3;
const flapTextMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false});
const flapTextMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), flapTextMat);
flapTextMesh.scale.set(D.contW, 80, 1);
flapTextMesh.position.z = 28; flapTextMesh.renderOrder = 9;
scene.add(flapTextMesh);

function buildFlapText(res){
  flapTexRes=res;
  flapTexCanvas=mkCanvas(D.contW,80,res);
  drawFlapText();
  flapTex=new THREE.CanvasTexture(flapTexCanvas);
  flapTex.minFilter=THREE.LinearFilter; flapTex.magFilter=THREE.LinearFilter;
  flapTex.generateMipmaps=false; flapTex.anisotropy=MAXA;
  flapTextMat.map=flapTex; flapTextMat.needsUpdate=true;
}
function drawFlapText(){
  const W=D.contW,H=80;
  const x=flapTexCanvas.getContext('2d');
  x.setTransform(flapTexRes,0,0,flapTexRes,0,0);
  x.clearRect(0,0,W,H);
  const BASE=H/2;

  /* foil-stamped: a soft dark impression under a cream face */
  function stamped(fn, colour){
    x.save(); x.globalAlpha=0.42; x.translate(0.5,1.1);
    x.fillStyle='rgba(3,3,5,0.92)'; fn(); x.restore();
    x.save(); x.fillStyle=colour; fn(); x.restore();
  }

  x.save(); x.globalAlpha=0.40; x.translate(0.5,1.1);
  drawOrbis(x, 44, BASE-1, 8.5, 'rgba(3,3,5,0.92)', 1.2); x.restore();
  drawOrbis(x, 44, BASE-1, 8.5, 'rgba(234,236,241,0.92)', 1.2);

  x.textBaseline='alphabetic';
  x.font=\`400 12px \${UI}\`;
  stamped(()=>tracked(x, BRAND.frontCta.toUpperCase(), 64, BASE+4, 2.7, 'left'), 'rgba(234,236,241,0.94)');
  stamped(()=>tracked(x, '\\u2022\\u2022\\u2022\\u2022 '+BRAND.last4, W-42, BASE+4, 2.3, 'right'), 'rgba(206,209,217,0.74)');

  if(flapTex) flapTex.needsUpdate=true;
}

/* ====================================================== texture lifecycle */
function onResizeTextures(){
  const res  = Math.max(2.5, Math.min(4.5, Math.round(dpr*scale*1.9*2)/2));
  const cres = Math.max(3, Math.min(6, Math.round(dpr*scale*2.6)));   /* card art is sharper */
  if(!texEnv) buildEnvTextures();
  buildChrome(res);
  buildFlapText(res);
  const [tf,ta]=buildFrontTextures(cres);
  cardCapMat.uniforms.tFoilF.value=tf;
  cardCapMat.uniforms.tArtF.value=ta;
  cardCapMat.uniforms.tFoilB.value=buildBackFoil(cres);
  buildBackCanvas(cres);
  cardCapMat.uniforms.tArtB.value=texBack;
  cardCapMat.uniforms.tEnv.value=texEnv;
  cardCapMat.uniforms.tEnvB.value=texEnvBlur;
  cardWallMat.uniforms.tEnv.value=texEnv;
  cardWallMat.uniforms.tEnvB.value=texEnvBlur;
  const [sw,sh]=buildStamp(res);
  stampMat.map=stampTex; stampMat.needsUpdate=true;
  stampMesh.scale.set(sw,sh,1);
  chromeDirty=true;
}

/* =============================================================== animation */
const S = {
  open:false, t:99, expand:0, expandV:0,
  lift:0, liftV:0, flip:0, lock:0, lockT:99, locked:false,
  reveal:0, revealTarget:0, eyePress:0, hoverCard:false, pressCard:0,
  hoverK:0, hoverKV:0
};
let lastRevealDraw=-1, lastEyeDraw=-1;

function easeOut(t){ return 1-Math.pow(1-t,3); }
function clamp01(v){ return v<0?0:(v>1?1:v); }
function easeSpin(p){ const s=p*p*(3-2*p); return 0.55*p + 0.45*s; }

function springStep(x,v,target,dt,f,z){
  const w=2*Math.PI*f, k=w*w, c=2*z*w;
  const steps=Math.max(1,Math.ceil(dt/0.008));
  const h=dt/steps;
  for(let i=0;i<steps;i++){ v += (-k*(x-target)-c*v)*h; x += v*h; }
  return [x,v];
}

const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleOpen(){
  S.open=!S.open; S.t=REDUCED?9:0;
  if(REDUCED){ S.expand=S.lift=S.open?1:0; S.expandV=S.liftV=0; }
  if(!S.open){ S.revealTarget=0; S.locked=false; }
  hintEl.classList.remove('on');
}

/* ==================================================================== input */
const hintEl=document.getElementById('hint');
let pointer={x:0,y:0,inside:false};
function toWorld(cx,cy){ return {x:(cx-vw/2)/scale, y:-(cy-vh/2)/scale}; }

function contGeom(){
  const h = D.contRest + (D.contOpen-D.contRest)*S.expand;
  return {h, top:h/2, bottom:-h/2};
}
function hitCard(w){
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift;
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift;
  const pf = camD/(camD-cz);
  return Math.abs(w.x)<D.cardW/2*pf && Math.abs(w.y-cy*pf)<D.cardH/2*pf;
}
function rowRect(i){
  const g=contGeom();
  const y0 = g.top - D.rowY[i];
  return {x0:-D.contW/2+D.rowX, x1:-D.contW/2+D.rowX+D.rowW, y0:y0-D.rowH, y1:y0};
}
function hitRow(w){
  if(S.expand<0.7) return -1;
  for(let i=0;i<3;i++){
    const r=rowRect(i);
    if(w.x>r.x0&&w.x<r.x1&&w.y>r.y0&&w.y<r.y1) return i;
  }
  return -1;
}
function hitClose(w){
  if(S.expand<0.7) return false;
  const g=contGeom();
  return Math.hypot(w.x, w.y-(g.top-D.closeY)) < D.closeR+6;
}
function hitEye(w){
  if(S.flip<0.85) return false;
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift;
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift;
  const pf = camD/(camD-cz);
  const lx = 400 - D.cardW/2, ly = D.cardH/2 - 242;
  return Math.hypot(w.x-lx*pf, w.y-(cy+ly)*pf) < 25*pf;
}

canvas.addEventListener('pointermove', e=>{
  if(e.pointerType==='touch'){ pointer.inside=false; return; }
  pointer.x=e.clientX; pointer.y=e.clientY; pointer.inside=true;
  const w=toWorld(e.clientX,e.clientY);
  const r=hitRow(w);
  const prevHover=ui.hover; ui.hover=r;
  let cur='default';
  if(r>=0||hitClose(w)||hitEye(w)) cur='pointer';
  else if(!S.open && hitCard(w)) cur='pointer';
  S.hoverCard = !S.open && hitCard(w);
  canvas.style.cursor=cur;
  if(prevHover!==ui.hover) chromeDirty=true;
});
canvas.addEventListener('pointerleave', ()=>{ pointer.inside=false; S.hoverCard=false; ui.hover=-1; chromeDirty=true; });
canvas.addEventListener('pointerdown', e=>{
  const w=toWorld(e.clientX,e.clientY);
  const r=hitRow(w);
  if(r>=0){ ui.pressRow=r; chromeDirty=true; }
  else if(!S.open && hitCard(w)) S.pressCard=1;
});
window.addEventListener('pointerup', ()=>{ ui.pressRow=-1; S.pressCard=0; chromeDirty=true; });

canvas.addEventListener('click', e=>{
  const w=toWorld(e.clientX,e.clientY);
  if(S.open){
    if(hitClose(w)){ toggleOpen(); return; }
    if(hitEye(w)){ S.revealTarget = S.revealTarget>0.5?0:1; S.eyePress=1; return; }
    const r=hitRow(w);
    if(r===0){ S.locked=!S.locked; S.lockT=0; }
  }else if(hitCard(w)) toggleOpen();
});
window.addEventListener('keydown', e=>{ if(e.key==='Escape'&&S.open) toggleOpen(); });

/* ===================================================================== loop */
let prev=performance.now();
let nowMs=0;
let PAUSED=false;

function step(dt){
  S.t+=dt; S.lockT+=dt;
  const t=S.t;

  /* closing is a two-beat move: the card turns back, then the sleeve closes */
  const target = S.open ? 1 : (t < 0.40 ? 1 : 0);
  const freq   = S.open ? 1.90 : 2.10;
  [S.expand,S.expandV]=springStep(S.expand,S.expandV,target,dt,freq,1.0);
  [S.lift  ,S.liftV  ]=springStep(S.lift  ,S.liftV  ,target,dt,freq*0.98,1.0);

  S.flip = S.open ? easeSpin(clamp01((t-0.165)/0.240))
                  : 1-easeSpin(clamp01((t-0.085)/0.215));

  for(let i=0;i<3;i++){
    ui.rowP[i] = S.open ? clamp01((t-0.185-i*0.062)/0.26)
                        : clamp01(1-(t-(2-i)*0.025)/0.16);
  }
  ui.headP  = S.open ? clamp01((t-0.150)/0.26) : clamp01(1-t/0.14);
  ui.closeP = S.open ? clamp01((t-0.370)/0.26) : clamp01(1-t/0.14);

  const flapA = S.open ? 1-clamp01((t-0.05)/0.24) : clamp01((t-0.45)/0.26);
  const flapE = flapA<1 ? flapA*flapA*(3-2*flapA) : 1;

  S.reveal += Math.sign(S.revealTarget-S.reveal)*Math.min(Math.abs(S.revealTarget-S.reveal), dt/0.82);
  if(S.eyePress>0) S.eyePress=Math.max(0, S.eyePress-dt/0.55);
  S.lock += Math.sign((S.locked?1:0)-S.lock)*Math.min(Math.abs((S.locked?1:0)-S.lock), dt/0.36);

  const g=contGeom();
  containerMat.uniforms.uBox.value.set(D.contW/2, g.h/2);
  containerMesh.scale.set(D.contW+90, D.contOpen+90, 1);
  containerMat.uniforms.uSize.value.set(D.contW+90, D.contOpen+90);

  contShadow.scale.set(D.contW+340, g.h+340, 1);
  contShadow.material.uniforms.uSize.value.set(D.contW+340, g.h+340);
  contShadow.material.uniforms.uBox.value.set(D.contW/2-16, g.h/2-4);
  contShadow.material.uniforms.uRadius.value=D.contR;
  contShadow.material.uniforms.uBlur.value=54;
  contShadow.material.uniforms.uOpacity.value=0.56;
  contShadow.position.y=-30;

  const flapY = g.bottom + D.flapH/2;
  flapMesh.position.y = flapY;
  flapMat.uniforms.uOpacity.value = flapE;
  flapMat.uniforms.uBaseY.value = -D.flapH/2;
  flapMat.uniforms.uWave.value = -D.flapH/2 + D.flapWaveUp;
  flapMesh.visible = flapE>0.004;

  flapTextMesh.position.y = g.bottom + 34;
  flapTextMat.opacity = flapE;
  flapTextMesh.visible = flapE>0.004;

  lipShadow.position.y = g.bottom + D.flapWaveUp;
  lipShadowMat.uniforms.uWave.value = 0.0;
  lipShadowMat.uniforms.uOpacity.value = flapE;
  lipShadow.visible = flapE>0.004;

  /* card transform — the card is rigid: it never changes size. A 20° lens
     keeps the near edge from magnifying its way out of the sleeve instead.  */
  const hoverTarget = (S.hoverCard && !S.open) ? (S.pressCard ? 0.35 : 1) : 0;
  [S.hoverK,S.hoverKV]=springStep(S.hoverK,S.hoverKV,hoverTarget,dt,3.0,1.0);
  const spin = Math.sin(S.flip*Math.PI);
  const cardScale = 1;
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift + S.hoverK*7*(1-S.lift);
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift + S.hoverK*5*(1-S.lift);
  cardPivot.position.set(0, cy, cz);
  cardPivot.rotation.y = S.flip*Math.PI;

  const projW = Math.max(60, cardScale*(D.cardW*Math.abs(Math.cos(S.flip*Math.PI))
                                       + D.cardT*Math.abs(Math.sin(S.flip*Math.PI))));
  const projH = D.cardH*cardScale;
  cardShadow.position.set(0, cy-10-14*S.lift, cz-16);
  cardShadow.scale.set(projW+220, projH+220, 1);
  cardShadow.material.uniforms.uSize.value.set(projW+220, projH+220);
  cardShadow.material.uniforms.uBox.value.set(projW/2-4, projH/2-4);
  cardShadow.material.uniforms.uRadius.value=D.cardR;
  cardShadow.material.uniforms.uBlur.value=14+30*S.lift;
  cardShadow.material.uniforms.uOpacity.value=0.22+0.26*S.lift;

  chromeMesh.position.y = g.top - D.contOpen/2;

  /* the pointer turns the studio a little, so the metal stays alive */
  const rot = pointer.inside ? ((pointer.x/vw)-0.5)*0.055 : 0.0;
  cardCapMat.uniforms.uEnvRot.value  += (rot-cardCapMat.uniforms.uEnvRot.value)*Math.min(1,dt*6);
  cardWallMat.uniforms.uEnvRot.value = cardCapMat.uniforms.uEnvRot.value;
  cardCapMat.uniforms.uCam.value.copy(camera.position);
  cardWallMat.uniforms.uCam.value.copy(camera.position);
  cardCapMat.uniforms.uLock.value=S.lock;
  cardWallMat.uniforms.uLock.value=S.lock;

  const bA = S.lock*clamp01((S.flip-0.9)*10);
  stampMat.opacity = bA;
  stampMesh.visible = bA>0.005;
  const bs = 0.90+0.10*S.lock;
  stampMesh.scale.set(210*bs, 76*bs, 1);
  stampMesh.position.set(0, -37, -D.cardT/2-0.7);   /* clears the number row */
  stampMesh.rotation.y = Math.PI;

  if(Math.abs(S.reveal-lastRevealDraw)>0.002 || Math.abs(S.eyePress-lastEyeDraw)>0.002){
    backState.reveal=S.reveal; backState.eyePress=S.eyePress;
    drawBack(); lastRevealDraw=S.reveal; lastEyeDraw=S.eyePress;
  }
  ui.toggle += Math.sign((S.locked?1:0)-ui.toggle)*Math.min(Math.abs((S.locked?1:0)-ui.toggle), dt/0.22);
  chromeDirty = chromeDirty || S.t<1.4 || Math.abs(ui.toggle-(S.locked?1:0))>0.001;
  if(chromeDirty){ drawChrome(); chromeDirty=false; }

  window.__bg.scale.set(worldW*2.4, worldH*2.4, 1);
  window.__bg.material.uniforms.uSize.value.set(worldW*2.4, worldH*2.4);
}

function tick(now){
  const dt=Math.min(0.05,(now-prev)/1000); prev=now; nowMs=now;
  if(!PAUSED) step(dt);
  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}

/* ------------------------------------------------- dev: deterministic seek */
window.__dev = {
  seek(sec, opts){
    PAUSED=true; opts=opts||{};
    S.open = !!opts.close; S.t=99;
    S.expand=S.lift=opts.close?1:0; S.expandV=S.liftV=0; S.flip=opts.close?1:0;
    S.locked=!!opts.locked; S.lock=opts.locked?1:0; ui.toggle=opts.locked?1:0;
    S.revealTarget=opts.reveal?1:0; S.reveal=S.revealTarget; S.eyePress=0;
    pointer.inside=false; step(1e-4);
    S.open = !opts.close; S.t=0;
    const h=1/240, n=Math.round(sec/h);
    for(let i=0;i<n;i++) step(h);
    step(1e-4); renderer.render(scene,camera);
    return {expand:S.expand, lift:S.lift, flip:S.flip};
  },
  seekSub(sec, what){
    PAUSED=true;
    S.open=true; S.t=99; S.expand=S.lift=1; S.expandV=S.liftV=0; S.flip=1;
    S.locked=false; S.lock=0; ui.toggle=0; S.revealTarget=0; S.reveal=0; S.eyePress=0;
    pointer.inside=false; step(1e-4);
    if(what==='reveal'){ S.revealTarget=1; S.eyePress=1; }
    if(what==='lock'){ S.locked=true; S.lockT=0; }
    const h=1/240, n=Math.round(sec/h);
    for(let i=0;i<n;i++) step(h);
    step(1e-4); renderer.render(scene,camera);
  },
  set(o){
    PAUSED=true;
    if(o.open!==undefined){ S.open=o.open; S.t=o.t===undefined?9:o.t;
      S.expand=S.lift=o.open?1:0; S.expandV=S.liftV=0; }
    if(o.locked!==undefined){ S.locked=o.locked; S.lock=o.locked?1:0; ui.toggle=o.locked?1:0; }
    if(o.reveal!==undefined){ S.revealTarget=o.reveal; S.reveal=o.reveal; }
    chromeDirty=true; step(1e-4); renderer.render(scene,camera);
  }
};

window.addEventListener('resize', layout);
layout();
setTimeout(()=>{ if(!S.open) hintEl.classList.add('on'); }, 800);
requestAnimationFrame(tick);
<\/script>
</body>
</html>
`,y=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Saddle — Card</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%;background:#1a1108;overflow:hidden;
    -webkit-font-smoothing:antialiased;
    font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif}
  #gl{position:fixed;inset:0;width:100%;height:100%;display:block;cursor:default;touch-action:none}
  #hint{position:fixed;left:0;right:0;bottom:30px;text-align:center;color:#9c8158;
    font-size:10px;letter-spacing:.34em;text-transform:uppercase;pointer-events:none;
    opacity:0;transition:opacity .9s ease .7s;font-weight:400}
  #hint.on{opacity:.6}
</style>
</head>
<body>
<canvas id="gl"></canvas>
<div id="hint">Tap the card</div>
<script src="https://unpkg.com/three@0.149.0/build/three.min.js"><\/script>
<script>
/* ============================================================================
   SADDLE — the Halcyon sleeve cut from bridle hide, in a warm walnut room.
   Undyed veg-tan calf: a coarser pebble, no damier, and a pull-up that pales
   the raised grain the way waxed saddlery does, with a heavily burnished edge.
   The card is polished steel rather than gold, and the type is an old-style
   serif throughout instead of the house's geometric-and-didone pairing.
   ========================================================================== */

const UI   = '"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif';
const DISP = 'Georgia,"Iowan Old Style",Palatino,"Times New Roman",serif';

const BRAND = {
  monogram : 'V',
  network  : 'ORBIS',
  tier     : 'Saddle Edition',
  since    : "Member since '61",
  holder   : 'Marlowe Vance',
  last4    : '4417',
  pan      : '5219 0473 8846 4417',
  exp      : '07/31',
  cvv      : '318',
  frontCta : 'See card details',
  panelHead: 'Card controls',
  rowLock  : 'Freeze card',
  rowShow  : 'Show PIN',
  rowReset : 'Reset PIN',
  frozen   : 'Frozen'
};

/* ---------------------------------------------------------------- geometry */
const D = {
  contW:480, contRest:326, contOpen:640, contR:34, bezel:15,
  cardW:448, cardH:283, cardR:18, cardT:3.4,   /* 34 outer − 16 gap = concentric */
  cardYRest:9, cardYOpen:156, cardZRest:0, cardZOpen:7,
  stripeH:56,
  flapH:250, flapWaveUp:203.5, flapDip:24,
  rowY:[358,423,488], rowH:52, rowX:22, rowW:436,   /* 34 − 22 = r12, concentric */
  headY:340, closeY:576, closeR:26
};

/* --------------------------------------------------------------- renderer */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setClearColor(0x1a1108, 1);
const MAXA = renderer.capabilities.getMaxAnisotropy();

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 10, 4000);

let scale = 1, worldH = 790, worldW = 1280, camD = 1400;
let vw = 0, vh = 0, dpr = 1;

function layout(){
  vw = Math.max(320, window.innerWidth  || 1280);
  vh = Math.max(320, window.innerHeight ||  800);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  scale = Math.min(vw/620, vh/790);
  scale = Math.max(0.46, Math.min(scale, 1.5));
  worldH = vh/scale; worldW = vw/scale;
  camD = (worldH/2)/Math.tan(THREE.MathUtils.degToRad(10));
  camera.fov = 20; camera.aspect = vw/vh;
  camera.position.set(0,0,camD);
  camera.near = camD*0.05; camera.far = camD*3;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(dpr);
  renderer.setSize(vw, vh, false);
  onResizeTextures();
}

/* ============================================================ glsl helpers */
const GLSL = \`
  #define TAU 6.28318530718
  float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; return fract(p*(p+p)); }
  float hash21(vec2 p){ p=fract(p*vec2(127.31,311.7)); p+=dot(p,p+34.23); return fract(p.x*p.y); }
  vec2  hash22(vec2 p){
    vec3 q = fract(vec3(p.xyx)*vec3(0.1031,0.1030,0.0973));
    q += dot(q, q.yzx+33.33);
    return fract((q.xx+q.yz)*q.zy);
  }
  float vnoise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
  float fbm(vec2 p){ float s=0.,a=0.5; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.07; a*=0.5; } return s; }

  /* worley F1 with its analytic gradient — the pebble grain of the leather */
  float worley(vec2 p, out vec2 grad){
    vec2 ip=floor(p), fp=fract(p);
    float d=8.0; vec2 best=vec2(0.0);
    for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
      vec2 g=vec2(float(x),float(y));
      vec2 o=hash22(ip+g);
      vec2 r=g+o-fp;
      float l=length(r);
      if(l<d){ d=l; best=r; }
    }
    grad = -best/max(d,1e-4);
    return d;
  }

  float sdRound(vec2 p, vec2 b, float r){ vec2 q=abs(p)-b+r; return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r; }

  /* continuous arc-length-ish parameter around a rounded rect (for stitching).
     The corner branch must never reach atan(0,0) — that is undefined in GLSL and
     returns NaN on some drivers, which then poisons the whole fragment.        */
  float contourS(vec2 p, vec2 b, float r){
    vec2 a=abs(p); vec2 c=max(b-r, vec2(0.001));
    if(a.x<=c.x && a.y>=c.y) return a.x;                            // top / bottom run
    if(a.y<=c.y && a.x>=c.x) return c.x + r*1.5707963 + (c.y-a.y);  // side run
    if(a.x< c.x && a.y< c.y) return a.x;                            // interior, unused
    vec2 q=max(a-c, vec2(0.0));
    return c.x + r*atan(q.y, max(q.x,1e-4));
  }

  /* damier: k is 0/1 per tile, edge is the distance in px to the nearest tile
     border and dir is d(edge)/dp, so a groove can be differentiated cheaply */
  void damier(vec2 p, float sz, out float k, out float edge, out vec2 dir){
    vec2 c = p/sz;
    k = mod(floor(c.x)+floor(c.y), 2.0);
    vec2 f = fract(c);
    float mx = min(f.x, 1.0-f.x), my = min(f.y, 1.0-f.y);
    if(mx < my){ edge = mx*sz; dir = vec2(f.x < 1.0-f.x ? 1.0 : -1.0, 0.0); }
    else       { edge = my*sz; dir = vec2(0.0, f.y < 1.0-f.y ? 1.0 : -1.0); }
  }
  float damierK(vec2 p, float sz){ vec2 c=p/sz; return mod(floor(c.x)+floor(c.y),2.0); }
\`;

/* ---------------------------------------------------------------- leather */
/* Shared bridle-hide surface: pebble grain -> height -> normal -> lighting.
   \`mode\` 0 = the burnished painted edge, 1 = the body. No damier here: a
   veg-tan hide is read through a coarser pebble and its pull-up, where the
   wax thins over the raised grain and the colour pales there.              */
const LEATHER = \`
  uniform vec3 uKey;

  /* Fine-grain beige leather. mode 0 = burnished trim, 1 = damier-embossed body.
     The normal comes from one worley lookup with its analytic gradient.        */
  vec3 leather(vec2 p, float mode, float shade, float burnish){
    float gs = (mode < 0.5) ? 0.50 : 0.322;      /* a slightly more open pebble */
    vec2 wg;
    float w  = worley(p*gs, wg);
    float wc = clamp(w*1.75, 0.0, 1.0);
    float pebble = wc*wc*(3.0-2.0*wc);
    float amp = (mode < 0.5) ? 0.34 : 0.50;
    vec2  dh = wg * (6.0*wc*(1.0-wc)*1.75*gs*amp);

    /* second, much finer pore layer — this is what reads as real hide */
    vec2 wg2;
    float w2 = worley(p*1.25 + vec2(31.0,17.0), wg2);
    float wc2= clamp(w2*2.30, 0.0, 1.0);
    float pore = wc2*wc2*(3.0-2.0*wc2);
    dh += wg2 * (6.0*wc2*(1.0-wc2)*2.30*1.25*0.038);

    float f1 = fbm(p*0.62);
    float fx = fbm(p*0.62 + vec2(0.40,0.0));
    float fy = fbm(p*0.62 + vec2(0.0,0.40));
    dh += vec2(fx-f1, fy-f1) * (0.16*0.62/0.40);

    /* long soft creases running through the hide */
    float c1 = fbm(p*0.125);
    float cx = fbm(p*0.125 + vec2(0.42,0.0));
    float cy = fbm(p*0.125 + vec2(0.0,0.42));
    float ridge = pow(clamp(1.0 - abs(c1-0.5)*3.2, 0.0, 1.0), 8.0);
    dh += vec2(cx-c1, cy-c1)*(1.0/0.42)*ridge*0.40;

    float tone = 0.0;
    if(mode > 0.5){
      /* undyed hide: broad tonal ranging across the panel, no woven check */
      tone = smoothstep(0.32, 0.70, fbm(p*0.048));
    }

    vec3 N = normalize(vec3(-dh.x, -dh.y, 1.0));
    vec3 L = normalize(uKey);
    vec3 Hv= normalize(L + vec3(0.0,0.0,1.0));

    float dif  = max(dot(N,L), 0.0);
    float spec = pow(max(dot(N,Hv),0.0), mix(34.0,96.0,burnish)) * mix(1.30,3.4,burnish);
    float amb  = 0.58 + 0.11*N.y;

    /* cognac bridle hide; the painted edge is a much deeper, glossier brown */
    vec3 albedo = mix(vec3(0.612,0.318,0.140), vec3(0.520,0.252,0.104), tone);
    if(mode < 0.5) albedo = vec3(0.412,0.202,0.086);
    albedo *= 1.0 - 0.38*burnish;                  /* painted edge darkens hard */
    albedo *= 0.93 + 0.15*fbm(p*0.045);
    albedo *= 1.0 - ridge*0.090;                   /* creases sit darker */
    /* pull-up: wax thins over the raised grain, so the crowns run pale */
    albedo *= mix(0.948, 1.062, pebble);
    albedo *= shade;

    vec3 col = albedo*(amb + dif*0.46);
    col += vec3(1.0,0.952,0.872)*spec*0.128;
    col *= 1.0 - 0.105*(1.0-pebble) - 0.030*(1.0-pore);
    return col;
  }

  /* fine slanted saddle stitch running along a contour */
  vec3 saddleStitch(vec3 col, float dist, float s, float pitch, float len){
    float ph = fract(s/pitch);
    float slant = (ph-0.5)*2.2;
    float dd = abs(dist + slant);
    float on = step(0.5-len*0.5, ph)*step(ph, 0.5+len*0.5);
    float thread = exp(-pow(dd/0.76,2.0))*on;
    float hole   = exp(-pow((dd-1.42)/0.70,2.0))*on;
    col = mix(col, col*0.62, hole*0.36);
    col = mix(col, vec3(0.902,0.836,0.678), thread*0.72);
    return col;
  }
\`;

/* ------------------------------------------------------------- background */
{
  const m = new THREE.ShaderMaterial({
    uniforms:{ uSize:{value:new THREE.Vector2(1,1)} },
    vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
    fragmentShader:\`
      varying vec2 vUv; uniform vec2 uSize; \${GLSL}
      void main(){
        vec2 p=(vUv-0.5)*uSize;
        float r=length(p*vec2(1.0,1.20))/(uSize.y*0.78);
        vec3 col = vec3(0.1005,0.0640,0.0328);
        col += vec3(0.0745,0.0448,0.0198)*smoothstep(0.95,0.0,r);
        col -= vec3(0.0730,0.0470,0.0248)*smoothstep(0.30,1.15,r);
        col += (hash21(vUv*uSize*0.73)-0.5)*0.013;
        gl_FragColor = vec4(max(col,vec3(0.0)),1.0);
      }\`,
    depthWrite:false, depthTest:false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), m);
  mesh.position.z = -300; mesh.renderOrder = 0;
  scene.add(mesh);
  window.__bg = mesh;
}

/* ------------------------------------------------------------ soft shadow */
function softRectMesh(renderOrder){
  const m = new THREE.ShaderMaterial({
    uniforms:{ uSize:{value:new THREE.Vector2(1,1)}, uBox:{value:new THREE.Vector2(1,1)},
               uRadius:{value:30}, uBlur:{value:40}, uOpacity:{value:0.6} },
    vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
    fragmentShader:\`
      varying vec2 vUv; uniform vec2 uSize,uBox; uniform float uRadius,uBlur,uOpacity;
      \${GLSL}
      void main(){
        vec2 p=(vUv-0.5)*uSize;
        float d=sdRound(p,uBox,uRadius);
        float a=1.0-smoothstep(-uBlur, uBlur*0.75, d);
        gl_FragColor=vec4(0.028,0.014,0.005, pow(a,1.25)*uOpacity);
      }\`,
    transparent:true, depthWrite:false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), m);
  mesh.renderOrder = renderOrder;
  return mesh;
}
const contShadow = softRectMesh(1); contShadow.position.z = -30; scene.add(contShadow);
const cardShadow = softRectMesh(4); scene.add(cardShadow);

const KEY = new THREE.Vector3(-0.34, 0.60, 0.72).normalize();

/* --------------------------------------------------------------- container */
const containerMat = new THREE.ShaderMaterial({
  uniforms:{
    uSize:{value:new THREE.Vector2(D.contW+90, D.contOpen+90)},
    uBox:{value:new THREE.Vector2(D.contW/2, D.contRest/2)},
    uRadius:{value:D.contR}, uBezel:{value:D.bezel},
    uKey:{value:KEY.clone()}
  },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize,uBox; uniform float uRadius,uBezel;
    \${GLSL}
    \${LEATHER}
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      float d=sdRound(p,uBox,uRadius);
      float aa=max(fwidth(d),0.6);
      float alpha=1.0-smoothstep(-aa,aa,d);
      if(alpha<0.002) discard;

      float vy = (p.y+uBox.y)/(2.0*uBox.y);

      /* --- woven check lining --- */
      float k,edge; vec2 kd; damier(p+vec2(3.0,5.0), 9.0, k, edge, kd);
      float weft = exp(-pow(edge/0.75,2.0));
      vec3 lin = mix(vec3(0.1440,0.0968,0.0552), vec3(0.1090,0.0700,0.0378), k);
      lin *= 0.90 + 0.20*fbm(p*0.9);
      lin *= 1.0 - 0.26*weft;
      float thr = 0.5+0.5*sin((p.x+p.y)*1.9);
      lin *= 0.96 + 0.08*thr;
      lin *= mix(0.66, 1.12, smoothstep(0.0,1.0,vy));
      lin += vec3(0.026,0.019,0.011)*pow(max(0.0,1.0-abs(p.x)/uBox.x),3.0);

      /* --- tan leather trim (only shaded where the bezel shows) --- */
      float bez = smoothstep(-uBezel-1.2, -uBezel+1.2, d);
      float burn = smoothstep(-6.0, -0.5, d);
      vec3 trim = (bez > 0.003) ? leather(p, 0.0, mix(1.0, 0.62, smoothstep(0.35,0.0,vy)), burn) : lin;
      vec3 col = mix(lin, trim, bez);

      /* inner wall where the trim meets the well */
      float wall = exp(-pow((d+uBezel)/3.2,2.0));
      col *= 1.0-0.30*wall*step(d,-uBezel);
      col += vec3(0.055,0.043,0.028)*exp(-pow((d+uBezel-1.8)/2.4,2.0));

      /* rolled outer edge */
      float rim = exp(-pow((d+1.6)/2.0,2.0));
      float up  = clamp(0.5+0.5*normalize(vec2(p.x,p.y)+1e-5).y,0.0,1.0);
      col += rim*(0.030+0.115*up)*bez;
      col *= 1.0-0.55*smoothstep(-1.6,0.0,d);

      /* stitching */
      float s=contourS(p,uBox,uRadius);
      col = saddleStitch(col, d+uBezel*0.50, s, 9.0, 0.46);

      gl_FragColor=vec4(col, alpha);
    }\`,
  transparent:true, depthWrite:false
});
const containerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), containerMat);
containerMesh.renderOrder = 2; containerMesh.position.z = -14;
scene.add(containerMesh);

/* -------------------------------------------------------------------- flap */
const flapMat = new THREE.ShaderMaterial({
  uniforms:{
    uSize:{value:new THREE.Vector2(D.contW, D.flapH)},
    uBox:{value:new THREE.Vector2(D.contW/2, 400)},
    uRadius:{value:D.contR}, uWave:{value:D.flapWaveUp-D.flapH/2}, uDip:{value:D.flapDip},
    uOpacity:{value:1}, uBaseY:{value:-D.flapH/2}, uBezel:{value:D.bezel},
    uKey:{value:KEY.clone()}
  },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize,uBox;
    uniform float uRadius,uWave,uDip,uOpacity,uBaseY,uBezel;
    \${GLSL}
    \${LEATHER}
    float waveY(float x01){
      float b = smoothstep(0.14,0.50,x01)*smoothstep(0.86,0.50,x01);
      b = b*b*(3.0-2.0*b);
      return uWave - uDip*b;
    }
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      vec2 bp = vec2(p.x, p.y - (uBox.y + uBaseY));
      float dr=sdRound(bp,uBox,uRadius);
      float wy=waveY(vUv.x);
      float dw=p.y-wy;
      float d=max(dr,dw);
      float aa=max(fwidth(d),0.6);
      float alpha=(1.0-smoothstep(-aa,aa,d))*uOpacity;
      if(alpha<0.003) discard;

      float vy = clamp((p.y - uBaseY)/(uSize.y*0.92), 0.0, 1.0);

      float bez = smoothstep(-uBezel-1.2, -uBezel+1.2, dr);
      float lip = smoothstep(-11.0, -1.0, dw);          // the cut top edge is trim too
      float labelTop = uBaseY + 64.0;                   // plain leather band for the row
      float label = smoothstep(labelTop+0.9, labelTop-0.9, p.y);
      float tm = max(max(bez, lip), label);
      float burn = max(smoothstep(-6.0,-0.5,dr), smoothstep(-5.0,-0.5,dw));
      vec3 body = (tm < 0.997) ? leather(p+vec2(0.0,140.0), 1.0, mix(0.86,1.05,smoothstep(0.0,0.55,vy)), 0.0) : vec3(0.0);
      vec3 trim = (tm > 0.003) ? leather(p+vec2(0.0,140.0), 0.0, mix(0.82,1.02,smoothstep(0.0,0.55,vy)), burn) : vec3(0.0);
      vec3 col = mix(body, trim, tm);
      col = saddleStitch(col, (p.y-labelTop)+7.0, p.x, 9.0, 0.46);

      /* burnished cut edge along the wave */
      float cut = exp(-pow(dw/2.0,2.0));
      col = mix(col, col*0.58, cut*0.75);
      col += vec3(0.12,0.10,0.07)*exp(-pow((dw+2.6)/1.6,2.0));

      /* stitch along the wave, then around the outside */
      col = saddleStitch(col, dw+10.0, p.x, 9.0, 0.46);
      float s=contourS(bp,uBox,uRadius);
      if(dw < -2.0) col = saddleStitch(col, dr+uBezel*0.50, s, 9.0, 0.46);

      float rim = exp(-pow((dr+1.6)/2.0,2.0));
      float up  = clamp(0.5+0.5*normalize(vec2(bp.x,bp.y)+1e-5).y,0.0,1.0);
      col += rim*(0.020+0.070*up)*step(dw,-1.0);
      col *= 1.0-0.50*smoothstep(-1.6,0.0,dr);

      gl_FragColor=vec4(col,alpha);
    }\`,
  transparent:true, depthWrite:false
});
const flapMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), flapMat);
flapMesh.scale.set(D.contW, D.flapH, 1);
flapMesh.position.z = 26; flapMesh.renderOrder = 8;
scene.add(flapMesh);

/* shadow the pocket lip throws back onto the card */
const lipShadowMat = new THREE.ShaderMaterial({
  uniforms:{ uSize:{value:new THREE.Vector2(D.contW, 90)}, uWave:{value:0}, uDip:{value:D.flapDip}, uOpacity:{value:1} },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec2 uSize; uniform float uWave,uDip,uOpacity;
    float waveY(float x01){ float b=smoothstep(0.14,0.50,x01)*smoothstep(0.86,0.50,x01); b=b*b*(3.0-2.0*b); return uWave-uDip*b; }
    void main(){
      vec2 p=(vUv-0.5)*uSize;
      float dw=p.y-waveY(vUv.x);
      float a=exp(-pow(max(dw,0.0)/12.0,1.4))*step(0.0,dw);
      a*= smoothstep(0.0,0.06,vUv.x)*smoothstep(1.0,0.94,vUv.x);
      gl_FragColor=vec4(0.0,0.0,0.0,a*0.30*uOpacity);
    }\`,
  transparent:true, depthWrite:false
});
const lipShadow = new THREE.Mesh(new THREE.PlaneGeometry(1,1), lipShadowMat);
lipShadow.scale.set(D.contW, 90, 1);
lipShadow.position.z = 24; lipShadow.renderOrder = 7;
scene.add(lipShadow);

/* ============================================================ canvas plate */
function mkCanvas(w,h,res){
  const c=document.createElement('canvas');
  c.width=Math.max(2,Math.round(w*res)); c.height=Math.max(2,Math.round(h*res));
  c.getContext('2d').scale(res,res);
  return c;
}
function rr(x,x0,y0,w,h,r){ r=Math.min(r,w/2,h/2);
  x.beginPath(); x.moveTo(x0+r,y0);
  x.arcTo(x0+w,y0,x0+w,y0+h,r); x.arcTo(x0+w,y0+h,x0,y0+h,r);
  x.arcTo(x0,y0+h,x0,y0,r);     x.arcTo(x0,y0,x0+w,y0,r); x.closePath();
}
/* letterspaced draw — \`letterSpacing\` is not universal, so space by hand */
function tracked(x, str, px, py, track, align){
  const chars=[...str];
  let w=0; for(const c of chars) w += x.measureText(c).width + track;
  w -= track;
  let cx = align==='right' ? px-w : align==='center' ? px-w/2 : px;
  const prev = x.textAlign; x.textAlign='left';
  for(const c of chars){ x.fillText(c, cx, py); cx += x.measureText(c).width + track; }
  x.textAlign = prev;
  return w;
}
function trackedWidth(x, str, track){
  let w=0; for(const c of [...str]) w += x.measureText(c).width + track;
  return w-track;
}
function goldGrad(x, x0, y0, x1, y1){
  const g=x.createLinearGradient(x0,y0,x1,y1);
  g.addColorStop(0.00,'#9a7f45'); g.addColorStop(0.20,'#e7d7ae');
  g.addColorStop(0.40,'#c3a765'); g.addColorStop(0.60,'#f2e7c6');
  g.addColorStop(0.80,'#b79f63'); g.addColorStop(1.00,'#dccfa6');
  return g;
}

/* ------------------------------------------------------------ house mark */
/* A lozenge enclosing three tapering chevrons: flight, drawn as geometry so it
   rhymes with the damier and stays legible down to a few pixels.            */
function drawMark(x, x0, y0, s, colour){
  const k=s/100;
  x.save(); x.translate(x0,y0); x.scale(k,k);
  x.strokeStyle=colour; x.lineJoin='miter'; x.lineCap='butt'; x.miterLimit=6;
  x.lineWidth=4.6;
  x.beginPath(); x.moveTo(50,4); x.lineTo(96,50); x.lineTo(50,96); x.lineTo(4,50); x.closePath(); x.stroke();
  x.lineWidth=7.6;
  const rows=[[34,26,15],[52,19.5,12.5],[67,13,10.5]];
  for(const r of rows){
    x.beginPath(); x.moveTo(50-r[1], r[0]+r[2]); x.lineTo(50, r[0]); x.lineTo(50+r[1], r[0]+r[2]); x.stroke();
  }
  x.restore();
}

/* ------------------------------------------------ orbis mark: a ringed globe */
function drawOrbis(x, cx, cy, r, stroke, lw){
  x.save(); x.translate(cx,cy);
  x.strokeStyle=stroke; x.lineWidth=lw; x.lineCap='round';
  x.beginPath(); x.arc(0,0,r,0,Math.PI*2); x.stroke();
  x.beginPath(); x.ellipse(0,0,r*0.40,r,0,0,Math.PI*2); x.stroke();
  x.beginPath(); x.moveTo(-r,0); x.lineTo(r,0); x.stroke();
  x.beginPath(); x.moveTo(-r*0.86,-r*0.50); x.lineTo(r*0.86,-r*0.50); x.stroke();
  x.beginPath(); x.moveTo(-r*0.86, r*0.50); x.lineTo(r*0.86, r*0.50); x.stroke();
  x.restore();
}

/* ---------------------------------------------------------- retro gold chip */
function drawChip(x, x0, y0, w, h){
  const g = goldGrad(x, x0, y0, x0+w, y0+h);
  rr(x,x0,y0,w,h,4.5); x.fillStyle=g; x.fill();
  x.strokeStyle='rgba(60,42,10,0.55)'; x.lineWidth=0.8; x.stroke();
  x.save(); rr(x,x0,y0,w,h,4.5); x.clip();
  x.strokeStyle='rgba(48,34,8,0.48)'; x.lineWidth=1.0;
  const cy=y0+h/2;
  x.beginPath(); x.moveTo(x0,cy-h*0.22); x.lineTo(x0+w,cy-h*0.22);
  x.moveTo(x0,cy+h*0.22); x.lineTo(x0+w,cy+h*0.22);
  x.moveTo(x0+w*0.32,y0); x.lineTo(x0+w*0.32,y0+h);
  x.moveTo(x0+w*0.68,y0); x.lineTo(x0+w*0.68,y0+h); x.stroke();
  x.beginPath(); rr(x,x0+w*0.32,cy-h*0.22,w*0.36,h*0.44,1.5); x.stroke();
  x.restore();
}

/* ------------------------------------------------------------- line icons */
function iconEye(x, cx, cy, s, stroke, lw, slashed){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath();
  x.moveTo(-9,0); x.bezierCurveTo(-5.2,-5.8, 5.2,-5.8, 9,0);
  x.bezierCurveTo(5.2,5.8,-5.2,5.8,-9,0); x.closePath(); x.stroke();
  x.beginPath(); x.arc(0,0,2.6,0,Math.PI*2); x.stroke();
  if(slashed>0.02){
    x.globalAlpha=Math.min(1,slashed*3);
    x.beginPath(); x.moveTo(-8.6,-7.0); x.lineTo(8.6,7.0); x.stroke();
  }
  x.restore();
}
/* the reveal control is a rubber stamp, same language as the FROZEN mark */
const EYE = {x:400, y:242, w:43, h:28, rot:-0.075};
function eyeStampFrame(x, colour){
  x.save(); x.translate(EYE.x, EYE.y); x.rotate(EYE.rot);
  x.strokeStyle=colour; x.lineWidth=1.5;
  rr(x, -EYE.w/2, -EYE.h/2, EYE.w, EYE.h, 5); x.stroke();
  x.lineWidth=0.7;
  rr(x, -EYE.w/2+3.2, -EYE.h/2+3.2, EYE.w-6.4, EYE.h-6.4, 2.6); x.stroke();
  x.restore();
}
function iconLock(x, cx, cy, s, stroke, lw){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath();
  x.moveTo(-3.5,-1.0); x.lineTo(-3.5,-4.2);
  x.arc(0,-4.2,3.5,Math.PI,0); x.lineTo(3.5,-1.0); x.stroke();
  x.beginPath(); rr(x,-5.4,-1.0,10.8,8.4,1.8); x.stroke();
  x.beginPath(); x.moveTo(0,2.0); x.lineTo(0,4.6); x.stroke();
  x.restore();
}
function iconChevron(x, cx, cy, s, stroke, lw){
  x.save(); x.translate(cx,cy); x.scale(s,s);
  x.strokeStyle=stroke; x.lineWidth=lw/s; x.lineCap='round'; x.lineJoin='round';
  x.beginPath(); x.moveTo(-2.6,-5.4); x.lineTo(2.8,0); x.lineTo(-2.6,5.4); x.stroke();
  x.restore();
}

/* ====================================================== studio environment */
/* A small equirectangular studio, painted once and sampled by the card's
   reflection vector — this is what makes the metal read as metal.          */
let texEnv=null, texEnvBlur=null;
function buildEnvTextures(){
  const W=1024, H=512;
  const base=document.createElement('canvas'); base.width=W; base.height=H;
  const x=base.getContext('2d');

  const g=x.createLinearGradient(0,0,0,H);          /* ceiling -> horizon -> floor */
  g.addColorStop(0.00,'#8a7f68'); g.addColorStop(0.24,'#5d5442');
  g.addColorStop(0.44,'#231c14'); g.addColorStop(0.478,'#0d0b08');
  g.addColorStop(0.494,'#8a7f68');                   /* the horizon, ramped */
  g.addColorStop(0.506,'#f6ead1');
  g.addColorStop(0.519,'#8b8071'); g.addColorStop(0.542,'#141009');
  g.addColorStop(0.72,'#141009');
  g.addColorStop(1.00,'#0f0c07');
  x.fillStyle=g; x.fillRect(0,0,W,H);

  function box(u,v,rw,rh,rot,inner,outer){
    x.save(); x.translate(u*W,(1.0-v)*H); x.rotate(rot);
    const rg=x.createRadialGradient(0,0,0,0,0,Math.max(rw,rh));
    rg.addColorStop(0,inner); rg.addColorStop(0.45,inner); rg.addColorStop(1,outer);
    x.globalCompositeOperation='lighter';
    x.scale(rw/Math.max(rw,rh), rh/Math.max(rw,rh));
    x.fillStyle=rg; x.beginPath(); x.arc(0,0,Math.max(rw,rh),0,Math.PI*2); x.fill();
    x.restore();
  }
  box(0.766,0.676,  70, 60, 0,      'rgba(255,251,240,1.00)','rgba(255,251,240,0)');  /* key */
  box(0.75,0.28,  160, 62, 0,       'rgba(150,138,116,0.34)','rgba(150,138,116,0)');  /* bounce */
  box(0.06,0.55, 140, 78, 0,        'rgba(226,158,72,0.58)', 'rgba(226,158,72,0)');   /* warm fill */
  box(0.30,0.74,  96, 52, 0,        'rgba(122,132,150,0.26)','rgba(122,132,150,0)');  /* cool fill */

  /* crisp strip lights — these are what give metal its hard streaks */
  function strip(u,v,w,h,a,soft){
    x.save(); x.globalCompositeOperation='lighter';
    x.filter = soft ? 'blur('+soft+'px)' : 'none';
    x.fillStyle='rgba(255,252,244,'+a+')';
    x.fillRect(u*W-w/2, (1.0-v)*H-h/2, w, h);
    x.filter='none'; x.restore();
  }
  strip(0.58,0.62,  16,200, 1.00, 2);
  strip(0.63,0.62,   7,200, 0.85, 1.5);
  strip(0.68,0.61,   4,180, 0.65, 1);
  strip(0.90,0.60,  12,160, 0.85, 2);
  strip(0.20,0.64,   9,150, 0.62, 2);
  strip(0.36,0.63,   5,140, 0.45, 1.5);
  strip(0.50,0.87, 340, 20, 0.60, 7);
  /* three inside the card's own reflection window, so polished steel has hard
     edges to catch instead of one soft wash of key light */
  strip(0.706,0.55,  11,210, 0.95, 2);
  strip(0.726,0.55,   4,210, 0.60, 1.2);
  strip(0.802,0.54,   8,190, 0.80, 2);

  const t=new THREE.CanvasTexture(base);
  t.wrapS=THREE.RepeatWrapping; t.wrapT=THREE.ClampToEdgeWrapping;
  t.minFilter=THREE.LinearMipmapLinearFilter; t.magFilter=THREE.LinearFilter;
  t.anisotropy=MAXA; t.needsUpdate=true;

  /* blurred copy — tiled three wide first so the u seam blurs across */
  const b=document.createElement('canvas'); b.width=W; b.height=H;
  const wide=document.createElement('canvas'); wide.width=W*3; wide.height=H;
  const wx=wide.getContext('2d');
  wx.drawImage(base,-0,0); wx.drawImage(base,W,0); wx.drawImage(base,W*2,0);
  const bx=b.getContext('2d');
  bx.filter='blur(26px)';
  bx.drawImage(wide, -W, 0);
  bx.filter='none';
  const tb=new THREE.CanvasTexture(b);
  tb.wrapS=THREE.RepeatWrapping; tb.wrapT=THREE.ClampToEdgeWrapping;
  tb.minFilter=THREE.LinearFilter; tb.magFilter=THREE.LinearFilter;
  tb.generateMipmaps=false; tb.needsUpdate=true;

  texEnv=t; texEnvBlur=tb;
}

/* ============================================================== card faces */
/* Each face is split into a foil-coverage mask (shaded as real metal in the
   fragment shader) and a printed-ink layer (RGBA, composited on top).      */
let texFoilFront=null, texArtFront=null, texFoilBack=null;
let backCanvas=null, texBack=null, backRes=4;
const backState = {reveal:0, eyePress:0};

function microText(x, str, x0, y0, x1, px, alpha){
  x.save(); x.globalAlpha=alpha; x.font=\`400 \${px}px \${UI}\`;
  let cx=x0; const gap=px*0.55;
  while(cx < x1){
    const w=trackedWidth(x,str,px*0.34);
    if(cx+w>x1) break;
    tracked(x,str,cx,y0,px*0.34,'left');
    cx += w+gap;
  }
  x.restore();
}

function buildFrontTextures(res){
  const W=D.cardW, H=D.cardH, R=D.cardR;

  /* ---- foil coverage (white = polished gold) ---- */
  const cf=mkCanvas(W,H,res); const f=cf.getContext('2d');
  f.fillStyle='#000'; f.fillRect(0,0,W,H);
  f.strokeStyle='#f00';

  f.lineWidth=1.0; rr(f,11,11,W-22,H-22,R-11); f.stroke();          /* concentric */
  f.strokeStyle='rgba(255,0,0,0.34)';
  f.lineWidth=0.7; rr(f,15,15,W-30,H-30,R-15); f.stroke();

  f.fillStyle='#f00'; f.textBaseline='alphabetic'; f.textAlign='right';
  let fs=140; f.font=\`400 \${fs}px \${DISP}\`;
  const cap=(f.measureText(BRAND.monogram).actualBoundingBoxAscent||fs*0.7);
  fs=fs*(50/cap);
  f.font=\`400 \${fs}px \${DISP}\`;
  f.fillText(BRAND.monogram, W-38, 36+50);

  f.textAlign='left';
  f.font=\`400 21px \${UI}\`;
  const wmW=trackedWidth(f,BRAND.network.toUpperCase(),4.2);
  tracked(f, BRAND.network.toUpperCase(), W-40-wmW, H-48, 4.2, 'left');
  f.font=\`400 8px \${UI}\`; f.fillStyle='rgba(255,0,0,0.55)';
  tracked(f, BRAND.tier.toUpperCase(), W-40, H-33, 2.6, 'right');

  /* contact chip: eight pads with milled gaps, so the gaps read as gunmetal */
  /* The contact plate goes in the green channel, so the shader can give it a
     champagne tint of its own; the milled gaps drop to zero and expose the
     card's own metal, which is what makes the pads legible on a light card. */
  const cx0=36, cy0=72, cw=50, ch=38, gp=2.1;
  f.fillStyle='rgba(0,255,0,1)'; rr(f,cx0,cy0,cw,ch,4.5); f.fill();
  f.save(); rr(f,cx0,cy0,cw,ch,4.5); f.clip();
  f.globalCompositeOperation='destination-out';
  f.lineWidth=gp; f.strokeStyle='#000'; f.lineCap='butt';
  const mx=cx0+cw*0.38, my=cy0+ch/2;
  f.beginPath();
  f.moveTo(cx0-2, cy0+ch*0.285); f.lineTo(cx0+cw+2, cy0+ch*0.285);
  f.moveTo(cx0-2, cy0+ch*0.715); f.lineTo(cx0+cw+2, cy0+ch*0.715);
  f.moveTo(mx, cy0-2); f.lineTo(mx, cy0+ch*0.285);
  f.moveTo(mx, cy0+ch*0.715); f.lineTo(mx, cy0+ch+2);
  f.moveTo(cx0+cw*0.76, cy0-2); f.lineTo(cx0+cw*0.76, cy0+ch+2);
  f.stroke();
  /* the C4/C8 island in the middle band, and the die window inside it */
  f.lineWidth=gp*0.85;
  f.beginPath(); rr(f, mx+1.4, cy0+ch*0.285+1.4, cw*0.34, ch*0.43, 1.8); f.stroke();
  f.lineWidth=gp*0.6;
  f.beginPath(); f.moveTo(cx0+2.5, cy0+ch*0.50); f.lineTo(mx-1.4, cy0+ch*0.50); f.stroke();
  f.globalCompositeOperation='source-over';
  f.restore();

  /* micro-lettering along the inside of the frame */
  f.fillStyle='#f00'; f.textAlign='left';
  microText(f, 'HALCYON · ORBIS · SADDLE EDITION ·', 26, H-19, W-26, 3.4, 0.5);

  const tf=new THREE.CanvasTexture(cf);
  tf.minFilter=THREE.LinearMipmapLinearFilter; tf.magFilter=THREE.LinearFilter;
  tf.anisotropy=MAXA; tf.needsUpdate=true;

  /* ---- printed ink ---- */
  const ca=mkCanvas(W,H,res); const a=ca.getContext('2d');
  a.clearRect(0,0,W,H);
  a.textBaseline='alphabetic'; a.textAlign='left';
  a.font=\`400 8px \${UI}\`;
  a.fillStyle='rgba(214,218,224,0.42)';
  tracked(a, BRAND.since.toUpperCase(), 36, H-33, 2.4, 'left');
  const ta=new THREE.CanvasTexture(ca);
  ta.minFilter=THREE.LinearMipmapLinearFilter; ta.magFilter=THREE.LinearFilter;
  ta.anisotropy=MAXA; ta.needsUpdate=true;

  return [tf,ta];
}

function buildBackFoil(res){
  const W=D.cardW, H=D.cardH, R=D.cardR;
  const cf=mkCanvas(W,H,res); const f=cf.getContext('2d');
  f.fillStyle='#000'; f.fillRect(0,0,W,H);

  /* the printed frame starts below the magnetic stripe — running it under the
     stripe left a clipped stub at the top corners                            */
  const FT = D.stripeH + 12;
  f.strokeStyle='rgba(255,0,0,0.62)'; f.lineWidth=0.9;
  rr(f, 11, FT, W-22, H-11-FT, R-11); f.stroke();

  drawMark(f, 30, 88, 58, '#ff0000');

  eyeStampFrame(f, 'rgba(255,0,0,0.92)');

  f.textAlign='left'; f.fillStyle='#f00';
  microText(f, 'HALCYON \\u00b7 ORBIS \\u00b7 SADDLE EDITION \\u00b7', 30, 80, W-30, 3.4, 0.42);

  const tf=new THREE.CanvasTexture(cf);
  tf.minFilter=THREE.LinearMipmapLinearFilter; tf.magFilter=THREE.LinearFilter;
  tf.anisotropy=MAXA; tf.needsUpdate=true;
  return tf;
}

function buildBackCanvas(res){
  backRes=res;
  backCanvas=mkCanvas(D.cardW,D.cardH,res);
  texBack=new THREE.CanvasTexture(backCanvas);
  texBack.minFilter=THREE.LinearMipmapLinearFilter; texBack.magFilter=THREE.LinearFilter;
  texBack.anisotropy=MAXA;
  drawBack();
}

function drawBack(){
  const W=D.cardW,H=D.cardH;
  const x=backCanvas.getContext('2d');
  x.setTransform(backRes,0,0,backRes,0,0);
  x.clearRect(0,0,W,H);

  const LX=30, NUM_X=108, CREAM='rgba(236,238,241,0.95)', DIM='rgba(206,210,216,0.55)';
  const BASE_LBL=230, BASE_VAL=249, BASE_NUM=124;   /* number rides beside the emblem */
  const EXP_X=272, CVV_X=336;

  /* signature panel — the element that actually belongs in this band */
  const SP={x:30, y:158, w:360, h:34};
  x.save();
  rr(x, SP.x, SP.y, SP.w, SP.h, 3.5);
  x.fillStyle='rgba(231,229,222,0.92)'; x.fill();
  x.save(); rr(x, SP.x, SP.y, SP.w, SP.h, 3.5); x.clip();
  x.strokeStyle='rgba(124,118,104,0.22)'; x.lineWidth=0.6;
  for(let i=-SP.h; i<SP.w+SP.h; i+=4){
    x.beginPath(); x.moveTo(SP.x+i, SP.y); x.lineTo(SP.x+i-SP.h, SP.y+SP.h); x.stroke();
  }
  x.fillStyle='rgba(110,104,92,0.24)'; x.font=\`400 4.6px \${UI}\`;
  for(let r=0;r<3;r++){
    let cx2=SP.x+4;
    while(cx2 < SP.x+SP.w-8){
      cx2 += tracked(x, 'HALCYON \\u00b7 ORBIS', cx2, SP.y+9.5+r*9.5, 1.1, 'left') + 6;
    }
  }
  x.restore();
  x.strokeStyle='rgba(248,250,255,0.20)'; x.lineWidth=0.8;
  rr(x, SP.x+0.4, SP.y+0.4, SP.w-0.8, SP.h-0.8, 3.5); x.stroke();
  x.restore();
  x.font=\`400 7px \${UI}\`; x.fillStyle='rgba(202,206,212,0.48)';
  tracked(x,'AUTHORISED SIGNATURE', SP.x+1, SP.y+SP.h+14, 2.0, 'left');

  x.textBaseline='alphabetic'; x.textAlign='left';
  x.font=\`400 8px \${UI}\`; x.fillStyle=DIM;
  tracked(x,'CARDHOLDER',LX,BASE_LBL,2.3,'left');
  tracked(x,'VALID',EXP_X,BASE_LBL,2.3,'left');
  tracked(x,'CVV',CVV_X,BASE_LBL,2.3,'left');

  x.font=\`400 12.5px \${UI}\`; x.fillStyle=CREAM;
  tracked(x,BRAND.holder.toUpperCase(),LX,BASE_VAL,1.5,'left');

  x.font=\`400 17px \${UI}\`;
  const ADV=11.8, GAP=9.5, RISE=16, DOTR=2.4, DOTY=BASE_NUM-5.4, ROLL=0.24;
  function dot(cx, cy, a){
    x.save(); x.globalAlpha=a; x.fillStyle='rgba(228,232,238,0.90)';
    x.beginPath(); x.arc(cx, cy, DOTR, 0, Math.PI*2); x.fill(); x.restore();
  }
  function slot(cx, real, p){
    const e = p<=0?0:(p>=1?1:(p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2));
    x.save();
    x.beginPath(); x.rect(cx-ADV*0.60, BASE_NUM-15, ADV*1.2, 21); x.clip();
    if(e<1) dot(cx, DOTY - e*RISE, Math.pow(1-e,0.9));
    if(e>0){
      x.globalAlpha=Math.pow(e,0.7); x.fillStyle=CREAM; x.textAlign='center';
      x.fillText(real, cx, BASE_NUM + (1-e)*RISE);
    }
    x.restore(); x.globalAlpha=1; x.textAlign='left';
  }
  const pan = BRAND.pan.replace(/ /g,'');
  let cx = NUM_X;
  for(let grp=0; grp<4; grp++){
    for(let i=0;i<4;i++){
      const gi=grp*4+i, cxx=cx+ADV/2;
      if(gi>=12){
        x.save(); x.textAlign='center'; x.fillStyle=CREAM;
        x.fillText(pan[gi], cxx, BASE_NUM); x.restore();
      }else{
        slot(cxx, pan[gi], Math.max(0,Math.min(1,(backState.reveal-(gi/12)*0.50)/ROLL)));
      }
      cx += ADV;
    }
    if(grp<3) cx += GAP;
  }

  x.font=\`400 12.5px \${UI}\`;
  const AD2=9.4;
  function smallSlot(px, ch, p){
    const e=p<=0?0:(p>=1?1:(p<0.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2));
    x.save(); x.beginPath(); x.rect(px-1, BASE_VAL-13, AD2+2, 18); x.clip();
    if(e<1){ x.globalAlpha=Math.pow(1-e,0.9); x.fillStyle='rgba(228,232,238,0.90)';
      x.beginPath(); x.arc(px+AD2/2, BASE_VAL-4.2-e*13, 2.1,0,Math.PI*2); x.fill(); }
    if(e>0){ x.globalAlpha=Math.pow(e,0.7); x.fillStyle=CREAM; x.textAlign='center';
      x.fillText(ch, px+AD2/2, BASE_VAL+(1-e)*13); }
    x.restore(); x.globalAlpha=1; x.textAlign='left';
  }
  let ex=EXP_X;
  for(let i=0;i<BRAND.exp.length;i++){
    const ch=BRAND.exp[i];
    if(ch==='/'){
      x.save(); x.textAlign='center'; x.fillStyle=DIM;
      x.fillText('/', ex+AD2*0.42, BASE_VAL); x.restore(); ex += AD2*0.84;
    }else{
      smallSlot(ex, ch, Math.max(0,Math.min(1,(backState.reveal-(0.50+(i/5)*0.12))/ROLL)));
      ex += AD2;
    }
  }
  let cvx=CVV_X;
  for(let i=0;i<3;i++){
    smallSlot(cvx, BRAND.cvv[i], Math.max(0,Math.min(1,(backState.reveal-(0.62+(i/3)*0.12))/ROLL)));
    cvx += AD2;
  }

  /* the stamp frame is foil; its inked impression is drawn here */
  if(backState.eyePress>0.001){
    x.save(); x.globalAlpha=0.38*(1-backState.eyePress);
    x.translate(EYE.x,EYE.y); x.rotate(EYE.rot);
    x.strokeStyle='rgba(226,232,240,0.9)'; x.lineWidth=1.3;
    const g=backState.eyePress*16;
    rr(x, -EYE.w/2-g, -EYE.h/2-g, EYE.w+g*2, EYE.h+g*2, 5.5+g); x.stroke();
    x.restore();
  }
  x.save(); x.translate(EYE.x,EYE.y); x.rotate(EYE.rot);
  iconEye(x, 0, 0, 0.78, 'rgba(214,220,228,0.90)', 1.6, backState.reveal);
  x.restore();

  if(texBack) texBack.needsUpdate=true;
}

/* ================================================================ the card */
function roundedShape(w,h,r){
  const s=new THREE.Shape();
  const x=-w/2, y=-h/2;
  s.moveTo(x+r,y);
  s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y);
  return s;
}
const cardGeo = new THREE.ExtrudeGeometry(roundedShape(D.cardW,D.cardH,D.cardR),
  {depth:D.cardT, bevelEnabled:false, curveSegments:28, steps:1});
cardGeo.translate(0,0,-D.cardT/2);

const CARD_FRAG = \`
  varying vec2 vUvC; varying vec3 vNw; varying vec3 vWp; varying float vFace;
  uniform sampler2D tFoilF, tArtF, tFoilB, tArtB, tEnv, tEnvB;
  uniform vec2 uCard; uniform vec3 uCam;
  uniform float uLock, uStripe, uGain, uEnvRot;
  \${GLSL}

  vec2 equirectUv(vec3 d){
    d = normalize(d);
    float ax = (abs(d.x) < 1e-5 && abs(d.z) < 1e-5) ? 1e-5 : d.x;
    float u = atan(d.z, ax)*0.15915494 + 0.5 + uEnvRot;
    float v = asin(clamp(d.y,-1.0,1.0))*0.31830989 + 0.5;
    return vec2(u, clamp(v,0.003,0.997));
  }

  void main(){
    vec2 uv = vUvC;
    bool front = vFace > 0.0;
    vec2 tuv = front ? vec2(uv.x, uv.y) : vec2(1.0-uv.x, uv.y);
    float u  = tuv.x;
    float ty = 1.0-uv.y;
    vec2 sp  = vec2(u*uCard.x, ty*uCard.y);

    float stripe = front ? 0.0 : step(ty*uCard.y, uStripe);
    /* red is polished foil, green is the contact plate — the chip has to be a
       different metal from the card or its milling vanishes into the field */
    vec4 mask = front ? texture2D(tFoilF, tuv) : texture2D(tFoilB, tuv);
    float foil = mask.r;
    float chip = mask.g;
    float proud = max(foil, chip);

    /* ---- surface: brushed metal, engine-turned check, guilloche rosette --- */
    vec3 N = normalize(vNw);
    vec3 T = normalize(cross(N, vec3(0.0,1.0,0.0)) + vec3(1e-4));
    vec3 B = normalize(cross(N, T));

    /* fw is world units per screen pixel; lod is how much fine grain this
       raster can hold. Anything below two samples per cycle is faded out
       rather than drawn — a normal that jitters faster than the raster swings
       the reflection across the studio's horizon and tears the plate. */
    float fw  = max(fwidth(sp.y), 1e-3);
    float lod = clamp((1.90 - fw)/0.90, 0.0, 1.0);
    float br  = fbm(vec2(sp.x*0.052, sp.y*0.46))-0.5;      /* slow lane drift */
    float br2 = vnoise(vec2(sp.x*0.13, sp.y*0.90))-0.5;    /* the coarse grain */
    float bump = (br*0.58 + br2*0.40*lod)*0.020;
    bump += (fbm(sp*0.085)-0.5)*0.013;          /* clear-coat orange peel */

    float k=0.0, edge=0.0; vec2 kd=vec2(0.0);
    float rough = 0.20;
    vec2 bump2 = vec2(0.0);
    if(stripe < 0.5){
      damier(sp, 4.6, k, edge, kd);
      rough += (k-0.5)*0.055;                               /* engine-turned check */
      float lip = exp(-pow(edge/0.40,2.0));
      bump2 += kd*lip*0.016;
      rough += lip*0.055;
      /* rosette: concentric guilloche over the lower-left quarter */
      vec2 rc = sp - vec2(uCard.x*0.26, uCard.y*0.70);
      float rr2 = length(rc);
      float th = atan(rc.y, rc.x + 1e-5);
      float ros = sin(rr2*1.55 + 1.10*sin(th*11.0));
      float rosM = smoothstep(100.0, 24.0, rr2);
      rough += ros*0.010*rosM;
      bump2 += normalize(rc+1e-4)*ros*0.0030*rosM;
    }else{
      rough = 0.50 + (vnoise(vec2(sp.x*0.6, sp.y*26.0))-0.5)*0.14;
      bump += (vnoise(vec2(sp.x*0.18, sp.y*34.0))-0.5)*0.022;
      bump += (fbm(vec2(sp.x*0.05, sp.y*3.0))-0.5)*0.016;
    }

    /* foil sits proud of the surface: its edges catch a hard rim, and the
       stamped face is faintly uneven, so it never reads as a flat fill      */
    if(proud > 0.015){
      vec2 tx = vec2(4.2/uCard.x, 4.2/uCard.y);
      vec4 px = front ? texture2D(tFoilF, tuv+vec2(tx.x,0.0)) : texture2D(tFoilB, tuv+vec2(tx.x,0.0));
      vec4 mx = front ? texture2D(tFoilF, tuv-vec2(tx.x,0.0)) : texture2D(tFoilB, tuv-vec2(tx.x,0.0));
      vec4 py = front ? texture2D(tFoilF, tuv+vec2(0.0,tx.y)) : texture2D(tFoilB, tuv+vec2(0.0,tx.y));
      vec4 my = front ? texture2D(tFoilF, tuv-vec2(0.0,tx.y)) : texture2D(tFoilB, tuv-vec2(0.0,tx.y));
      float fx = max(px.r,px.g) - max(mx.r,mx.g);
      float fy = max(py.r,py.g) - max(my.r,my.g);
      bump2 += vec2(fx, -fy)*0.185;
      bump2 += (vec2(fbm(sp*0.030), fbm(sp*0.030+vec2(11.0,5.0)))-0.5)*0.105*proud;
    }
    /* cap the tilt: an unbounded bevel swings the reflection onto the dark
       floor of the studio and stamps a hard black rim around every glyph   */
    float bl = length(bump2);
    if(bl > 0.085) bump2 *= 0.085/bl;
    rough = mix(rough, 0.075, foil);                        /* foil is polished */
    rough = mix(rough, 0.150, chip);                        /* the plate is milled */

    /* The diamond-cut rim. A metal card is chamfered, so its perimeter is a
       narrow fully polished bevel turned outward — end-on it catches a hard
       line of room that the flat face never sees, and that line is most of
       what makes the object read as cut metal rather than as a print. */
    float inset = -sdRound(sp - uCard*0.5, uCard*0.5, 18.0);
    float bev   = 1.0 - smoothstep(0.8, 4.4, inset);
    vec2  bdir  = (sp - uCard*0.5)/uCard;
    bdir = normalize(bdir + 1e-4);
    bump2 += vec2(bdir.x, -bdir.y)*bev*0.30;
    rough  = mix(rough, 0.040, bev);
    N = normalize(N + T*(bump+bump2.x) + B*(bump*0.35+bump2.y));

    vec3 V = normalize(uCam - vWp);
    vec3 R = reflect(-V, N);
    float NoV = clamp(dot(N,V), 0.0, 1.0);

    /* brushed metal smears its reflection along the grain — three taps in the
       environment's azimuth do the job far more cheaply than a rough BRDF     */
    vec2 e0 = equirectUv(R);
    /* A groove running along the card's long axis is a cylinder lying
       horizontally, so its normal fans vertically: it smears the room in
       elevation, not in azimuth. That matters here because the studio's whole
       structure — the horizon ramp — lives in elevation. Jittering the
       elevation per line is therefore what makes one groove reflect the bright
       side of the horizon and its neighbour the dark side, which is the fine
       bright-and-dark striping the eye reads as brushed metal. Jittering
       azimuth instead moves the sample along a band that barely changes, which
       is why the plate came out as smooth grey paint. */
    /* Long and straight along the grain, dense across it: a low x frequency
       keeps a groove continuous down the whole card, and a y frequency close
       to what the raster can hold keeps the lines fine rather than blobby.
       Getting either wrong turns the plate into flowing liquid. */
    float jl = (vnoise(vec2(sp.x*0.0045, sp.y*0.44))-0.5)
             + (vnoise(vec2(sp.x*0.0130, sp.y*1.00))-0.5)*0.72*lod
             + (vnoise(vec2(sp.x*0.0320, sp.y*2.15))-0.5)*0.34*lod*lod;
    float aniso = 0.025*(1.0-proud*0.84)*(1.0-bev*0.90);
    vec2 eJ = vec2(e0.x, clamp(e0.y + jl*aniso, 0.004, 0.996));
    float spread = 0.0030 + rough*0.011;
    vec3 es = ( texture2D(tEnv, eJ).rgb
              + texture2D(tEnv, vec2(eJ.x, clamp(eJ.y+spread, 0.004, 0.996))).rgb
              + texture2D(tEnv, vec2(eJ.x, clamp(eJ.y-spread, 0.004, 0.996))).rgb ) * (1.0/3.0);
    vec3 eb = texture2D(tEnvB, eJ).rgb;
    /* the blurred copy at the authored weight swamps the streaks it took all
       that jitter to produce, so cross-grain blur is capped well below it */
    vec3 refl = mix(es, eb, clamp(rough*1.15, 0.0, 0.52));

    /* ---- metal tint: dark gunmetal, or gold where the foil is ------------- */
    vec3 gun  = vec3(0.238,0.240,0.246);      /* brushed titanium field    */
    vec3 gold = vec3(0.800,0.808,0.824);      /* polished steel foil detail */
    vec3 tint = mix(gun, gold, foil);
    tint = mix(tint, vec3(0.762,0.638,0.392), chip);        /* champagne contact plate */
    if(stripe > 0.5) tint = vec3(0.096,0.090,0.086);

    vec3 F = tint + (1.0-tint)*pow(1.0-NoV, 5.0)*(1.0-rough*0.8);
    vec3 col = refl * F * uGain;
    /* metal photographs with its shadows crushed and its speculars clipped;
       a straight linear reflectance reads as grey paint */
    col = pow(max(col, vec3(0.0)), vec3(1.14)) * 1.10;
    float L = dot(col, vec3(0.299,0.587,0.114));
    col = mix(col, vec3(L), smoothstep(0.50,1.05,L)*0.52);   /* specular roll-off */

    /* the finest grain, as luminance: it can never move the reflection */
    float lf = 0.46;
    float lines = (vnoise(vec2(sp.x*0.026, sp.y*lf))-0.5)*0.80
                + (vnoise(vec2(sp.x*0.072, sp.y*lf*2.2))-0.5)*0.50*lod;
    col *= 1.0 + lines*0.085*lod*(1.0 - proud*0.62);
    col *= 0.982 + 0.034*hash21(sp*1.9);

    /* ---- printed ink ------------------------------------------------------ */
    vec4 art = front ? texture2D(tArtF, tuv) : texture2D(tArtB, tuv);
    if(!front && uLock > 0.001){
      vec2 o = vec2(1.15/uCard.x, 1.15/uCard.y)*uLock;
      vec4 s1=texture2D(tArtB,tuv+vec2(o.x,0.0)), s2=texture2D(tArtB,tuv-vec2(o.x,0.0));
      vec4 s3=texture2D(tArtB,tuv+vec2(0.0,o.y)), s4=texture2D(tArtB,tuv-vec2(0.0,o.y));
      art = mix(art, (art+s1+s2+s3+s4)/5.0, uLock);
    }
    col = mix(col, art.rgb, art.a);

    /* ---- frozen: a warm veil --------------------------------------------- */
    if(uLock > 0.001){
      vec3 frost = col*0.66 + vec3(0.108,0.110,0.118);
      float cloud = fbm(sp*0.075) + 0.5*fbm(sp*0.19+vec2(7.3,2.1));
      frost += (cloud-0.75)*0.030;
      frost += (hash21(sp*2.7)-0.5)*0.012;
      col = mix(col, frost, uLock);
    }

    gl_FragColor = vec4(col, 1.0);
  }
\`;

const cardCapMat = new THREE.ShaderMaterial({
  uniforms:{
    tFoilF:{value:null}, tArtF:{value:null}, tFoilB:{value:null}, tArtB:{value:null},
    tEnv:{value:null}, tEnvB:{value:null},
    uCard:{value:new THREE.Vector2(D.cardW,D.cardH)},
    uCam:{value:new THREE.Vector3()},
    uLock:{value:0}, uStripe:{value:D.stripeH}, uGain:{value:1.98}, uEnvRot:{value:0}
  },
  transparent:true, depthWrite:true,
  vertexShader:\`
    varying vec2 vUvC; varying vec3 vNw; varying vec3 vWp; varying float vFace;
    uniform vec2 uCard;
    void main(){
      vUvC = position.xy/uCard + 0.5;
      vFace = normal.z;
      vNw = normalize(mat3(modelMatrix)*normal);
      vec4 wp = modelMatrix*vec4(position,1.0);
      vWp = wp.xyz;
      gl_Position = projectionMatrix*viewMatrix*wp;
    }\`,
  fragmentShader: CARD_FRAG
});

/* the milled edge of the card, lit by the same studio */
const cardWallMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:true,
  uniforms:{ uCam:{value:new THREE.Vector3()}, tEnv:{value:null}, tEnvB:{value:null},
             uLock:{value:0}, uGain:{value:2.15}, uEnvRot:{value:0} },
  vertexShader:\`
    varying vec3 vNw; varying vec3 vWp;
    void main(){ vNw=normalize(mat3(modelMatrix)*normal); vec4 wp=modelMatrix*vec4(position,1.0);
      vWp=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }\`,
  fragmentShader:\`
    varying vec3 vNw; varying vec3 vWp;
    uniform vec3 uCam; uniform sampler2D tEnv, tEnvB; uniform float uLock, uGain, uEnvRot;
    void main(){
      vec3 N=normalize(vNw); vec3 V=normalize(uCam-vWp);
      vec3 R=reflect(-V,N);
      vec3 d=normalize(R);
      float ax=(abs(d.x)<1e-5 && abs(d.z)<1e-5)?1e-5:d.x;
      vec2 uvv=vec2(atan(d.z,ax)*0.15915494+0.5+uEnvRot, clamp(asin(clamp(d.y,-1.0,1.0))*0.31830989+0.5,0.003,0.997));
      vec3 refl=mix(texture2D(tEnv,uvv).rgb, texture2D(tEnvB,uvv).rgb, 0.36);
      /* the cut wall is polished, and it is brightest where it turns up */
      refl *= 0.72 + 0.72*clamp(0.5+0.5*N.y, 0.0, 1.0);
      float NoV=clamp(dot(N,V),0.0,1.0);
      vec3 tint=vec3(0.372,0.372,0.376);
      vec3 F=tint+(1.0-tint)*pow(1.0-NoV,5.0)*0.6;
      vec3 col=refl*F*uGain;
      col = mix(col, mix(col, vec3(0.56,0.57,0.59), 0.5), uLock);
      gl_FragColor=vec4(col,1.0);
    }\`
});

const cardMesh  = new THREE.Mesh(cardGeo, [cardCapMat, cardWallMat]);
const cardPivot = new THREE.Group();
cardPivot.add(cardMesh);
cardMesh.renderOrder = 5;
scene.add(cardPivot);

/* ------------------------------------------------------ frozen stamp plate */
let stampTex=null;
function buildStamp(res){
  const W=210,H=76;
  const c=mkCanvas(W,H,res); const x=c.getContext('2d');
  x.clearRect(0,0,W,H);
  x.translate(W/2,H/2); x.rotate(-0.10); x.translate(-W/2,-H/2);
  const bw=176, bh=52, bx=(W-bw)/2, by=(H-bh)/2;
  const ink='rgba(220,226,234,0.92)';
  x.strokeStyle=ink; x.lineWidth=2.2; rr(x,bx,by,bw,bh,4); x.stroke();
  x.lineWidth=0.9; rr(x,bx+5,by+5,bw-10,bh-10,2.5); x.stroke();
  x.fillStyle='rgba(14,16,20,0.40)'; rr(x,bx,by,bw,bh,4); x.fill();
  iconLock(x, bx+30, by+bh/2, 1.15, ink, 2.0);
  x.fillStyle=ink; x.font=\`400 19px \${UI}\`; x.textBaseline='middle';
  tracked(x, BRAND.frozen.toUpperCase(), bx+52, by+bh/2+1, 5.0, 'left');
  stampTex=new THREE.CanvasTexture(c);
  stampTex.minFilter=THREE.LinearMipmapLinearFilter; stampTex.magFilter=THREE.LinearFilter;
  stampTex.anisotropy=MAXA;
  return [W,H];
}
const stampMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false, opacity:0});
const stampMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), stampMat);
stampMesh.renderOrder = 6;
cardMesh.add(stampMesh);

/* ================================================================== chrome */
let chromeCanvas=null, chromeTex=null, chromeRes=3, chromeDirty=true;
const chromeMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false});
const chromeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), chromeMat);
chromeMesh.scale.set(D.contW, D.contOpen, 1);
chromeMesh.position.z = -12; chromeMesh.renderOrder = 3;
scene.add(chromeMesh);

const ui = {rowP:[0,0,0], headP:0, closeP:0, toggle:0, hover:-1, pressRow:-1};

function buildChrome(res){
  chromeRes=res;
  chromeCanvas=mkCanvas(D.contW, D.contOpen, res);
  chromeTex=new THREE.CanvasTexture(chromeCanvas);
  chromeTex.minFilter=THREE.LinearFilter; chromeTex.magFilter=THREE.LinearFilter;
  chromeTex.generateMipmaps=false; chromeTex.anisotropy=MAXA;
  chromeMat.map=chromeTex; chromeMat.needsUpdate=true;
  chromeDirty=true;
}

/* a woven-check wash used behind the panel rows */
function checkFill(x, x0, y0, w, h, sz, a1, a2){
  x.save(); x.beginPath(); x.rect(x0,y0,w,h); x.clip();
  for(let j=0;j*sz<h+sz;j++) for(let i=0;i*sz<w+sz;i++){
    x.fillStyle = ((i+j)&1) ? a1 : a2;
    x.fillRect(x0+i*sz, y0+j*sz, sz, sz);
  }
  x.restore();
}

function drawChrome(){
  const W=D.contW,H=D.contOpen;
  const x=chromeCanvas.getContext('2d');
  x.setTransform(chromeRes,0,0,chromeRes,0,0);
  x.clearRect(0,0,W,H);
  const labels=[BRAND.rowLock, BRAND.rowShow, BRAND.rowReset];
  const CREAM='rgba(243,234,214,0.92)';

  /* --- section head: rule — CARD CONTROLS — rule --- */
  if(ui.headP>0.002){
    const e=1-Math.pow(1-ui.headP,3);
    x.save(); x.globalAlpha=Math.min(1,e*1.2);
    const y=D.headY+(1-e)*10;
    x.font=\`400 9px \${UI}\`; x.textBaseline='middle';
    const t=BRAND.panelHead.toUpperCase();
    const tw=trackedWidth(x,t,3.4);
    x.fillStyle='rgba(226,208,168,0.60)';
    tracked(x,t,W/2-tw/2,y,3.4,'left');
    x.strokeStyle='rgba(214,186,128,0.26)'; x.lineWidth=0.8;
    x.beginPath();
    x.moveTo(D.rowX+4,y-0.5); x.lineTo(W/2-tw/2-13,y-0.5);
    x.moveTo(W/2+tw/2+9,y-0.5); x.lineTo(W-D.rowX-4,y-0.5);
    x.stroke(); x.restore();
  }

  for(let i=0;i<3;i++){
    const p=ui.rowP[i];
    if(p<=0.002) continue;
    const e=p<1? 1-Math.pow(1-p,3) : 1;
    const y=D.rowY[i] + (1-e)*16;
    x.save();
    x.globalAlpha=Math.min(1,e*1.15);

    const hot = (ui.pressRow===i) ? 2 : (ui.hover===i ? 1 : 0);
    /* the row is pressed into the lining: dark well, lit lower lip */
    rr(x,D.rowX,y,D.rowW,D.rowH,12);
    x.save(); x.clip();
    const g=x.createLinearGradient(D.rowX,y,D.rowX,y+D.rowH);
    g.addColorStop(0,\`rgba(14,9,4,\${0.62-hot*0.10})\`);
    g.addColorStop(0.55,\`rgba(30,22,13,\${0.50-hot*0.08})\`);
    g.addColorStop(1,\`rgba(58,45,28,\${0.40-hot*0.05})\`);
    x.fillStyle=g; x.fillRect(D.rowX,y,D.rowW,D.rowH);
    checkFill(x,D.rowX,y,D.rowW,D.rowH,6,'rgba(255,236,196,0.030)','rgba(0,0,0,0.034)');
    x.strokeStyle='rgba(0,0,0,0.55)'; x.lineWidth=2.2;
    rr(x,D.rowX,y-1.2,D.rowW,D.rowH,12); x.stroke();
    x.restore();
    x.strokeStyle=\`rgba(232,208,158,\${0.16+hot*0.06})\`; x.lineWidth=0.9;
    rr(x,D.rowX+0.45,y+0.45,D.rowW-0.9,D.rowH-0.9,12); x.stroke();
    x.strokeStyle='rgba(246,228,186,0.10)'; x.lineWidth=0.9;
    x.beginPath(); x.moveTo(D.rowX+16,y+D.rowH-0.5); x.lineTo(D.rowX+D.rowW-16,y+D.rowH-0.5); x.stroke();

    x.fillStyle=CREAM; x.font=\`400 13px \${UI}\`; x.textBaseline='middle';
    x.save(); x.globalAlpha=0.5*x.globalAlpha; x.fillStyle='rgba(0,0,0,0.9)';
    tracked(x, labels[i].toUpperCase(), D.rowX+26, y+D.rowH/2+1.6, 2.5, 'left'); x.restore();
    x.fillStyle=CREAM;
    tracked(x, labels[i].toUpperCase(), D.rowX+26, y+D.rowH/2+0.5, 2.5, 'left');

    if(i===0){
      const tw=54, th=27, tx=D.rowX+D.rowW-24-tw, ty=y+(D.rowH-th)/2;
      const t=ui.toggle;
      rr(x,tx,ty,tw,th,th/2);
      x.fillStyle='rgba(64,54,38,0.72)'; x.fill();
      if(t>0.001){
        x.save(); x.globalAlpha=t; rr(x,tx,ty,tw,th,th/2);
        const tg=x.createLinearGradient(tx,ty,tx,ty+th);
        tg.addColorStop(0,'#d3d7dc'); tg.addColorStop(1,'#8f959e');
        x.fillStyle=tg; x.fill(); x.restore();
      }
      x.strokeStyle='rgba(216,220,226,0.26)'; x.lineWidth=0.9;
      rr(x,tx+0.45,ty+0.45,tw-0.9,th-0.9,th/2); x.stroke();
      const kr=th/2-3.4;
      const kx=tx+3.4+kr + t*(tw-2*(3.4+kr));
      x.save();
      x.shadowColor='rgba(0,0,0,0.5)'; x.shadowBlur=4; x.shadowOffsetY=1.2;
      x.beginPath(); x.arc(kx, ty+th/2, kr, 0, Math.PI*2);
      x.fillStyle='#f4ecd8'; x.fill();
      x.restore();
      x.strokeStyle='rgba(90,72,40,0.30)'; x.lineWidth=0.7;
      x.beginPath(); x.arc(kx, ty+th/2, kr-0.4, 0, Math.PI*2); x.stroke();
    }else{
      iconChevron(x, D.rowX+D.rowW-30, y+D.rowH/2, 1.05, 'rgba(214,218,224,0.72)', 1.4);
    }
    x.restore();
  }

  /* close */
  if(ui.closeP>0.002){
    const e=1-Math.pow(1-ui.closeP,3);
    x.save(); x.globalAlpha=Math.min(1,e*1.2);
    const cy=D.closeY+(1-e)*14;
    x.beginPath(); x.arc(W/2, cy, D.closeR, 0, Math.PI*2);
    x.fillStyle='rgba(150,128,92,0.075)'; x.fill();
    x.strokeStyle='rgba(212,216,222,0.22)'; x.lineWidth=0.9; x.stroke();
    x.strokeStyle='rgba(236,220,186,0.72)'; x.lineWidth=1.4; x.lineCap='round';
    const s=5.0;
    x.beginPath(); x.moveTo(W/2-s,cy-s); x.lineTo(W/2+s,cy+s);
    x.moveTo(W/2+s,cy-s); x.lineTo(W/2-s,cy+s); x.stroke();
    x.restore();
  }
  chromeTex.needsUpdate=true;
}

/* ========================================================= flap text plate */
let flapTexCanvas=null, flapTex=null, flapTexRes=3;
const flapTextMat  = new THREE.MeshBasicMaterial({transparent:true, depthWrite:false});
const flapTextMesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), flapTextMat);
flapTextMesh.scale.set(D.contW, 80, 1);
flapTextMesh.position.z = 28; flapTextMesh.renderOrder = 9;
scene.add(flapTextMesh);

function buildFlapText(res){
  flapTexRes=res;
  flapTexCanvas=mkCanvas(D.contW,80,res);
  drawFlapText();
  flapTex=new THREE.CanvasTexture(flapTexCanvas);
  flapTex.minFilter=THREE.LinearFilter; flapTex.magFilter=THREE.LinearFilter;
  flapTex.generateMipmaps=false; flapTex.anisotropy=MAXA;
  flapTextMat.map=flapTex; flapTextMat.needsUpdate=true;
}
function drawFlapText(){
  const W=D.contW,H=80;
  const x=flapTexCanvas.getContext('2d');
  x.setTransform(flapTexRes,0,0,flapTexRes,0,0);
  x.clearRect(0,0,W,H);
  const BASE=H/2;

  /* foil-stamped: a soft dark impression under a cream face */
  function stamped(fn, colour){
    x.save(); x.globalAlpha=0.42; x.translate(0.5,1.1);
    x.fillStyle='rgba(46,32,16,0.9)'; fn(); x.restore();
    x.save(); x.fillStyle=colour; fn(); x.restore();
  }

  x.save(); x.globalAlpha=0.40; x.translate(0.5,1.1);
  drawOrbis(x, 44, BASE-1, 8.5, 'rgba(46,32,16,0.9)', 1.2); x.restore();
  drawOrbis(x, 44, BASE-1, 8.5, 'rgba(238,240,244,0.94)', 1.2);

  x.textBaseline='alphabetic';
  x.font=\`400 12px \${UI}\`;
  stamped(()=>tracked(x, BRAND.frontCta.toUpperCase(), 64, BASE+4, 2.7, 'left'), 'rgba(247,239,220,0.94)');
  stamped(()=>tracked(x, '\\u2022\\u2022\\u2022\\u2022 '+BRAND.last4, W-42, BASE+4, 2.3, 'right'), 'rgba(240,229,204,0.72)');

  if(flapTex) flapTex.needsUpdate=true;
}

/* ====================================================== texture lifecycle */
function onResizeTextures(){
  const res  = Math.max(2.5, Math.min(4.5, Math.round(dpr*scale*1.9*2)/2));
  const cres = Math.max(3, Math.min(6, Math.round(dpr*scale*2.6)));   /* card art is sharper */
  if(!texEnv) buildEnvTextures();
  buildChrome(res);
  buildFlapText(res);
  const [tf,ta]=buildFrontTextures(cres);
  cardCapMat.uniforms.tFoilF.value=tf;
  cardCapMat.uniforms.tArtF.value=ta;
  cardCapMat.uniforms.tFoilB.value=buildBackFoil(cres);
  buildBackCanvas(cres);
  cardCapMat.uniforms.tArtB.value=texBack;
  cardCapMat.uniforms.tEnv.value=texEnv;
  cardCapMat.uniforms.tEnvB.value=texEnvBlur;
  cardWallMat.uniforms.tEnv.value=texEnv;
  cardWallMat.uniforms.tEnvB.value=texEnvBlur;
  const [sw,sh]=buildStamp(res);
  stampMat.map=stampTex; stampMat.needsUpdate=true;
  stampMesh.scale.set(sw,sh,1);
  chromeDirty=true;
}

/* =============================================================== animation */
const S = {
  open:false, t:99, expand:0, expandV:0,
  lift:0, liftV:0, flip:0, lock:0, lockT:99, locked:false,
  reveal:0, revealTarget:0, eyePress:0, hoverCard:false, pressCard:0,
  hoverK:0, hoverKV:0
};
let lastRevealDraw=-1, lastEyeDraw=-1;

function easeOut(t){ return 1-Math.pow(1-t,3); }
function clamp01(v){ return v<0?0:(v>1?1:v); }
function easeSpin(p){ const s=p*p*(3-2*p); return 0.55*p + 0.45*s; }

function springStep(x,v,target,dt,f,z){
  const w=2*Math.PI*f, k=w*w, c=2*z*w;
  const steps=Math.max(1,Math.ceil(dt/0.008));
  const h=dt/steps;
  for(let i=0;i<steps;i++){ v += (-k*(x-target)-c*v)*h; x += v*h; }
  return [x,v];
}

const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleOpen(){
  S.open=!S.open; S.t=REDUCED?9:0;
  if(REDUCED){ S.expand=S.lift=S.open?1:0; S.expandV=S.liftV=0; }
  if(!S.open){ S.revealTarget=0; S.locked=false; }
  hintEl.classList.remove('on');
}

/* ==================================================================== input */
const hintEl=document.getElementById('hint');
let pointer={x:0,y:0,inside:false};
function toWorld(cx,cy){ return {x:(cx-vw/2)/scale, y:-(cy-vh/2)/scale}; }

function contGeom(){
  const h = D.contRest + (D.contOpen-D.contRest)*S.expand;
  return {h, top:h/2, bottom:-h/2};
}
function hitCard(w){
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift;
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift;
  const pf = camD/(camD-cz);
  return Math.abs(w.x)<D.cardW/2*pf && Math.abs(w.y-cy*pf)<D.cardH/2*pf;
}
function rowRect(i){
  const g=contGeom();
  const y0 = g.top - D.rowY[i];
  return {x0:-D.contW/2+D.rowX, x1:-D.contW/2+D.rowX+D.rowW, y0:y0-D.rowH, y1:y0};
}
function hitRow(w){
  if(S.expand<0.7) return -1;
  for(let i=0;i<3;i++){
    const r=rowRect(i);
    if(w.x>r.x0&&w.x<r.x1&&w.y>r.y0&&w.y<r.y1) return i;
  }
  return -1;
}
function hitClose(w){
  if(S.expand<0.7) return false;
  const g=contGeom();
  return Math.hypot(w.x, w.y-(g.top-D.closeY)) < D.closeR+6;
}
function hitEye(w){
  if(S.flip<0.85) return false;
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift;
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift;
  const pf = camD/(camD-cz);
  const lx = 400 - D.cardW/2, ly = D.cardH/2 - 242;
  return Math.hypot(w.x-lx*pf, w.y-(cy+ly)*pf) < 25*pf;
}

canvas.addEventListener('pointermove', e=>{
  if(e.pointerType==='touch'){ pointer.inside=false; return; }
  pointer.x=e.clientX; pointer.y=e.clientY; pointer.inside=true;
  const w=toWorld(e.clientX,e.clientY);
  const r=hitRow(w);
  const prevHover=ui.hover; ui.hover=r;
  let cur='default';
  if(r>=0||hitClose(w)||hitEye(w)) cur='pointer';
  else if(!S.open && hitCard(w)) cur='pointer';
  S.hoverCard = !S.open && hitCard(w);
  canvas.style.cursor=cur;
  if(prevHover!==ui.hover) chromeDirty=true;
});
canvas.addEventListener('pointerleave', ()=>{ pointer.inside=false; S.hoverCard=false; ui.hover=-1; chromeDirty=true; });
canvas.addEventListener('pointerdown', e=>{
  const w=toWorld(e.clientX,e.clientY);
  const r=hitRow(w);
  if(r>=0){ ui.pressRow=r; chromeDirty=true; }
  else if(!S.open && hitCard(w)) S.pressCard=1;
});
window.addEventListener('pointerup', ()=>{ ui.pressRow=-1; S.pressCard=0; chromeDirty=true; });

canvas.addEventListener('click', e=>{
  const w=toWorld(e.clientX,e.clientY);
  if(S.open){
    if(hitClose(w)){ toggleOpen(); return; }
    if(hitEye(w)){ S.revealTarget = S.revealTarget>0.5?0:1; S.eyePress=1; return; }
    const r=hitRow(w);
    if(r===0){ S.locked=!S.locked; S.lockT=0; }
  }else if(hitCard(w)) toggleOpen();
});
window.addEventListener('keydown', e=>{ if(e.key==='Escape'&&S.open) toggleOpen(); });

/* ===================================================================== loop */
let prev=performance.now();
let nowMs=0;
let PAUSED=false;

function step(dt){
  S.t+=dt; S.lockT+=dt;
  const t=S.t;

  /* closing is a two-beat move: the card turns back, then the sleeve closes */
  const target = S.open ? 1 : (t < 0.40 ? 1 : 0);
  const freq   = S.open ? 1.90 : 2.10;
  [S.expand,S.expandV]=springStep(S.expand,S.expandV,target,dt,freq,1.0);
  [S.lift  ,S.liftV  ]=springStep(S.lift  ,S.liftV  ,target,dt,freq*0.98,1.0);

  S.flip = S.open ? easeSpin(clamp01((t-0.165)/0.240))
                  : 1-easeSpin(clamp01((t-0.085)/0.215));

  for(let i=0;i<3;i++){
    ui.rowP[i] = S.open ? clamp01((t-0.185-i*0.062)/0.26)
                        : clamp01(1-(t-(2-i)*0.025)/0.16);
  }
  ui.headP  = S.open ? clamp01((t-0.150)/0.26) : clamp01(1-t/0.14);
  ui.closeP = S.open ? clamp01((t-0.370)/0.26) : clamp01(1-t/0.14);

  const flapA = S.open ? 1-clamp01((t-0.05)/0.24) : clamp01((t-0.45)/0.26);
  const flapE = flapA<1 ? flapA*flapA*(3-2*flapA) : 1;

  S.reveal += Math.sign(S.revealTarget-S.reveal)*Math.min(Math.abs(S.revealTarget-S.reveal), dt/0.82);
  if(S.eyePress>0) S.eyePress=Math.max(0, S.eyePress-dt/0.55);
  S.lock += Math.sign((S.locked?1:0)-S.lock)*Math.min(Math.abs((S.locked?1:0)-S.lock), dt/0.36);

  const g=contGeom();
  containerMat.uniforms.uBox.value.set(D.contW/2, g.h/2);
  containerMesh.scale.set(D.contW+90, D.contOpen+90, 1);
  containerMat.uniforms.uSize.value.set(D.contW+90, D.contOpen+90);

  contShadow.scale.set(D.contW+340, g.h+340, 1);
  contShadow.material.uniforms.uSize.value.set(D.contW+340, g.h+340);
  contShadow.material.uniforms.uBox.value.set(D.contW/2-16, g.h/2-4);
  contShadow.material.uniforms.uRadius.value=D.contR;
  contShadow.material.uniforms.uBlur.value=54;
  contShadow.material.uniforms.uOpacity.value=1.0;
  contShadow.position.y=-30;

  const flapY = g.bottom + D.flapH/2;
  flapMesh.position.y = flapY;
  flapMat.uniforms.uOpacity.value = flapE;
  flapMat.uniforms.uBaseY.value = -D.flapH/2;
  flapMat.uniforms.uWave.value = -D.flapH/2 + D.flapWaveUp;
  flapMesh.visible = flapE>0.004;

  flapTextMesh.position.y = g.bottom + 34;
  flapTextMat.opacity = flapE;
  flapTextMesh.visible = flapE>0.004;

  lipShadow.position.y = g.bottom + D.flapWaveUp;
  lipShadowMat.uniforms.uWave.value = 0.0;
  lipShadowMat.uniforms.uOpacity.value = flapE;
  lipShadow.visible = flapE>0.004;

  /* card transform — the card is rigid: it never changes size. A 20° lens
     keeps the near edge from magnifying its way out of the sleeve instead.  */
  const hoverTarget = (S.hoverCard && !S.open) ? (S.pressCard ? 0.35 : 1) : 0;
  [S.hoverK,S.hoverKV]=springStep(S.hoverK,S.hoverKV,hoverTarget,dt,3.0,1.0);
  const spin = Math.sin(S.flip*Math.PI);
  const cardScale = 1;
  const cy = D.cardYRest + (D.cardYOpen-D.cardYRest)*S.lift + S.hoverK*7*(1-S.lift);
  const cz = D.cardZRest + (D.cardZOpen-D.cardZRest)*S.lift + S.hoverK*5*(1-S.lift);
  cardPivot.position.set(0, cy, cz);
  cardPivot.rotation.y = S.flip*Math.PI;

  const projW = Math.max(60, cardScale*(D.cardW*Math.abs(Math.cos(S.flip*Math.PI))
                                       + D.cardT*Math.abs(Math.sin(S.flip*Math.PI))));
  const projH = D.cardH*cardScale;
  cardShadow.position.set(0, cy-10-14*S.lift, cz-16);
  cardShadow.scale.set(projW+220, projH+220, 1);
  cardShadow.material.uniforms.uSize.value.set(projW+220, projH+220);
  cardShadow.material.uniforms.uBox.value.set(projW/2-4, projH/2-4);
  cardShadow.material.uniforms.uRadius.value=D.cardR;
  cardShadow.material.uniforms.uBlur.value=14+30*S.lift;
  cardShadow.material.uniforms.uOpacity.value=0.30+0.34*S.lift;

  chromeMesh.position.y = g.top - D.contOpen/2;

  /* the pointer turns the studio a little, so the metal stays alive */
  const rot = pointer.inside ? ((pointer.x/vw)-0.5)*0.055 : 0.0;
  cardCapMat.uniforms.uEnvRot.value  += (rot-cardCapMat.uniforms.uEnvRot.value)*Math.min(1,dt*6);
  cardWallMat.uniforms.uEnvRot.value = cardCapMat.uniforms.uEnvRot.value;
  cardCapMat.uniforms.uCam.value.copy(camera.position);
  cardWallMat.uniforms.uCam.value.copy(camera.position);
  cardCapMat.uniforms.uLock.value=S.lock;
  cardWallMat.uniforms.uLock.value=S.lock;

  const bA = S.lock*clamp01((S.flip-0.9)*10);
  stampMat.opacity = bA;
  stampMesh.visible = bA>0.005;
  const bs = 0.90+0.10*S.lock;
  stampMesh.scale.set(210*bs, 76*bs, 1);
  stampMesh.position.set(0, -37, -D.cardT/2-0.7);   /* clears the number row */
  stampMesh.rotation.y = Math.PI;

  if(Math.abs(S.reveal-lastRevealDraw)>0.002 || Math.abs(S.eyePress-lastEyeDraw)>0.002){
    backState.reveal=S.reveal; backState.eyePress=S.eyePress;
    drawBack(); lastRevealDraw=S.reveal; lastEyeDraw=S.eyePress;
  }
  ui.toggle += Math.sign((S.locked?1:0)-ui.toggle)*Math.min(Math.abs((S.locked?1:0)-ui.toggle), dt/0.22);
  chromeDirty = chromeDirty || S.t<1.4 || Math.abs(ui.toggle-(S.locked?1:0))>0.001;
  if(chromeDirty){ drawChrome(); chromeDirty=false; }

  window.__bg.scale.set(worldW*2.4, worldH*2.4, 1);
  window.__bg.material.uniforms.uSize.value.set(worldW*2.4, worldH*2.4);
}

function tick(now){
  const dt=Math.min(0.05,(now-prev)/1000); prev=now; nowMs=now;
  if(!PAUSED) step(dt);
  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}

/* ------------------------------------------------- dev: deterministic seek */
window.__dev = {
  seek(sec, opts){
    PAUSED=true; opts=opts||{};
    S.open = !!opts.close; S.t=99;
    S.expand=S.lift=opts.close?1:0; S.expandV=S.liftV=0; S.flip=opts.close?1:0;
    S.locked=!!opts.locked; S.lock=opts.locked?1:0; ui.toggle=opts.locked?1:0;
    S.revealTarget=opts.reveal?1:0; S.reveal=S.revealTarget; S.eyePress=0;
    pointer.inside=false; step(1e-4);
    S.open = !opts.close; S.t=0;
    const h=1/240, n=Math.round(sec/h);
    for(let i=0;i<n;i++) step(h);
    step(1e-4); renderer.render(scene,camera);
    return {expand:S.expand, lift:S.lift, flip:S.flip};
  },
  seekSub(sec, what){
    PAUSED=true;
    S.open=true; S.t=99; S.expand=S.lift=1; S.expandV=S.liftV=0; S.flip=1;
    S.locked=false; S.lock=0; ui.toggle=0; S.revealTarget=0; S.reveal=0; S.eyePress=0;
    pointer.inside=false; step(1e-4);
    if(what==='reveal'){ S.revealTarget=1; S.eyePress=1; }
    if(what==='lock'){ S.locked=true; S.lockT=0; }
    const h=1/240, n=Math.round(sec/h);
    for(let i=0;i<n;i++) step(h);
    step(1e-4); renderer.render(scene,camera);
  },
  set(o){
    PAUSED=true;
    if(o.open!==undefined){ S.open=o.open; S.t=o.t===undefined?9:o.t;
      S.expand=S.lift=o.open?1:0; S.expandV=S.liftV=0; }
    if(o.locked!==undefined){ S.locked=o.locked; S.lock=o.locked?1:0; ui.toggle=o.locked?1:0; }
    if(o.reveal!==undefined){ S.revealTarget=o.reveal; S.reveal=o.reveal; }
    chromeDirty=true; step(1e-4); renderer.render(scene,camera);
  }
};

window.addEventListener('resize', layout);
layout();
setTimeout(()=>{ if(!S.open) hintEl.classList.add('on'); }, 800);
requestAnimationFrame(tick);
<\/script>
</body>
</html>
`,b=["reserve","onyx","saddle"],S={reserve:w,onyx:g,saddle:y},E={reserve:"Halcyon — Card",onyx:"Onyx — Card",saddle:"Saddle — Card"},T={reserve:"#100c09",onyx:"#e7e4dd",saddle:"#1a1108"};function D({className:o="",style:x,variant:l="reserve"}){const n=b.includes(l)?l:"reserve",i=e.useRef(null),[h,f]=e.useState(()=>typeof document>"u"||!document.hidden),[u,v]=e.useState(!0),[a,s]=e.useState(!1);e.useEffect(()=>{const t=i.current;if(!t||typeof IntersectionObserver>"u")return;const d=new IntersectionObserver(([m])=>{v(m?.isIntersecting??!0)},{rootMargin:"80px"});return d.observe(t),()=>d.disconnect()},[]),e.useEffect(()=>{if(typeof document>"u")return;const t=()=>f(!document.hidden);return document.addEventListener("visibilitychange",t),()=>document.removeEventListener("visibilitychange",t)},[]);const r=u&&h,c=T[n];return e.useEffect(()=>{s(!1)},[r,n]),p.jsx("div",{ref:i,className:`web3dkit-background halcyon-card${o?` ${o}`:""}`,role:"group","aria-label":"Interactive Halcyon card and holder","data-state":r?a?"ready":"loading":"paused",style:{background:c,pointerEvents:"auto",...x},children:r?p.jsx("iframe",{title:E[n],srcDoc:S[n],sandbox:"allow-scripts",loading:"eager",onLoad:()=>s(!0),style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:c,opacity:a?1:0,pointerEvents:a?"auto":"none",transition:"opacity 240ms ease-out"}},n):null})}export{b as HALCYON_CARD_VARIANTS,D as HalcyonCard};
