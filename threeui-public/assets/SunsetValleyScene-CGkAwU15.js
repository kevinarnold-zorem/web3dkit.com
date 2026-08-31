import{r as Ft,j as oa}from"./index-fOQwe-l-.js";import{T as yo,W as bo,s as Mo,A as So,P as To,S as Ka,a as Ao,V as re,F as Ro,b as zo,M as ct,c as Za,C as M,B as na,d as ra,e as lt,f as ut,g as ft,D as Et,I as Po,h as sa,i as Dt,Q as ia,j as Qa,k as ca,R as ko,l as Ja,H as Co,m as eo,n as to,o as It,p as ao,q as oo,r as la,t as no,u as Fo,L as Eo,v as Do,w as ro,x as Io,y as _o,G as Lo}from"./three.module-CvOdE-y9.js";const N=(G,le=0,$=1)=>G<le?le:G>$?$:G,ye=(G,le,$)=>G+(le-G)*$,Bo=["sunset","forest","aurora","blue-hour"],Ho={sunset:{exposure:.97,fog:13140314,fogDensity:.0024,sunDirection:[-.86,.085,-.5],sunColor:16765088,sunIntensity:3.1,sky:{zenith:1910087,upper:8141404,mid:13919546,horizon:16760954,sun:16767400,cloudDark:2496287,cloudLit:16766622,night:0},cloudAmount:1,terrain:{rock:7029032,rockDark:3351322,clay:11031855,ochre:12618302,sand:13216888,bone:14469024,scrub:6056773,grass:8359762,silt:9402968},waterNear:3945552,waterFar:16764820,grassBase:1053706,grassTip:5593642,grassMultiplier:1,bushMultiplier:1,hemisphere:[7170716,2365970,.7],fill:[10135760,.3],dust:[16767400,1600,.42],radial:["rgba(255,244,220,1)","rgba(255,206,140,.78)","rgba(240,140,70,.2)","rgba(240,140,70,0)"],forest:!1,aurora:!1,blueHour:!1,understory:0,fernBase:1778704,fernTip:7240250},forest:{exposure:.84,fog:6719094,fogDensity:.0022,sunDirection:[-.62,.34,-.71],sunColor:16768414,sunIntensity:1.82,sky:{zenith:4288387,upper:7117472,mid:9283981,horizon:15385983,sun:16770735,cloudDark:5401702,cloudLit:14210998,night:0},cloudAmount:.72,terrain:{rock:2966067,rockDark:1582879,clay:4020539,ochre:6058824,sand:7439714,bone:10136183,scrub:1391138,grass:3632177,silt:4151621},waterNear:1523e3,waterFar:7511427,grassBase:730131,grassTip:5147457,grassMultiplier:1.12,bushMultiplier:1.28,hemisphere:[8234405,2503457,.72],fill:[9351844,.28],dust:[16773064,1200,.26],radial:["rgba(255,250,222,1)","rgba(255,231,169,.72)","rgba(255,205,118,.18)","rgba(255,205,118,0)"],forest:!0,aurora:!1,blueHour:!1,understory:1,fernBase:532495,fernTip:6265658},aurora:{exposure:.84,fog:463910,fogDensity:.0032,sunDirection:[.42,.3,-.86],sunColor:11127039,sunIntensity:1.45,sky:{zenith:66574,upper:398892,mid:600893,horizon:1521997,sun:12113663,cloudDark:330518,cloudLit:2576741,night:1},cloudAmount:.46,terrain:{rock:1518389,rockDark:529180,clay:1718592,ochre:2576975,sand:4024672,bone:6719355,scrub:1129269,grass:2054990,silt:1522495},waterNear:132884,waterFar:1728880,grassBase:267538,grassTip:1527363,grassMultiplier:.96,bushMultiplier:.9,hemisphere:[3232892,132364,.54],fill:[5012130,.3],dust:[9363407,2600,.36],radial:["rgba(224,239,255,1)","rgba(173,207,255,.72)","rgba(96,151,220,.16)","rgba(96,151,220,0)"],forest:!1,aurora:!0,blueHour:!1,understory:0,fernBase:466973,fernTip:2844759},"blue-hour":{exposure:.9,fog:2766688,fogDensity:.0029,sunDirection:[-.79,.045,-.61],sunColor:16762778,sunIntensity:.95,sky:{zenith:726323,upper:1846103,mid:4280441,horizon:13801338,sun:16041628,cloudDark:1383736,cloudLit:9671608,night:.55},cloudAmount:.62,terrain:{rock:2502720,rockDark:1251878,clay:3096389,ochre:4479570,sand:5991283,bone:8885408,scrub:1454650,grass:2906958,silt:3688271},waterNear:1055795,waterFar:11057364,grassBase:529440,grassTip:3760207,grassMultiplier:1.12,bushMultiplier:1.2,hemisphere:[5927065,1054760,.85],fill:[8361668,.34],dust:[13490674,1500,.3],radial:["rgba(255,236,214,1)","rgba(246,197,158,.62)","rgba(150,150,210,.16)","rgba(150,150,210,0)"],forest:!1,aurora:!1,blueHour:!0,understory:1,fernBase:398880,fernTip:3828305}};function No(G,le="sunset"){const $=Bo.includes(le)?le:"sunset",h=Ho[$],dt=h.forest,Z=h.aurora,Ne=h.blueHour;let ee=Math.max(1,G.clientWidth),se=Math.max(1,G.clientHeight);const te=d=>G,z=(()=>{const d=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]],l=new Uint8Array(512),p=new Uint8Array(256);let v=1337;for(let w=0;w<256;w++)p[w]=w;for(let w=255;w>0;w--){v=v*1664525+1013904223&4294967295;const F=(v>>>16)%(w+1),y=p[w];p[w]=p[F],p[F]=y}for(let w=0;w<512;w++)l[w]=p[w&255];const T=.5*(Math.sqrt(3)-1),S=(3-Math.sqrt(3))/6;function C(w,F){const y=(w+F)*T,E=Math.floor(w+y),A=Math.floor(F+y),P=(E+A)*S,O=E-P,ae=A-P,k=w-O,D=F-ae;let me,be;k>D?(me=1,be=0):(me=0,be=1);const fe=k-me+S,pe=D-be+S,Ve=k-1+2*S,$e=D-1+2*S,Pe=E&255,ke=A&255;let qe=0,gt=0,vt=0,Me=.5-k*k-D*D;if(Me>0){const Y=d[l[Pe+l[ke]]&7];Me*=Me,qe=Me*Me*(Y[0]*k+Y[1]*D)}let Se=.5-fe*fe-pe*pe;if(Se>0){const Y=d[l[Pe+me+l[ke+be]]&7];Se*=Se,gt=Se*Se*(Y[0]*fe+Y[1]*pe)}let U=.5-Ve*Ve-$e*$e;if(U>0){const Y=d[l[Pe+1+l[ke+1]]&7];U*=U,vt=U*U*(Y[0]*Ve+Y[1]*$e)}return 70*(qe+gt+vt)}function R(w,F,y){let E=0,A=.5,P=1;for(let O=0;O<y;O++)E+=C(w*P,F*P)*A,A*=.5,P*=2.02;return E}function B(w,F,y){let E=0,A=.5,P=1,O=1;for(let ae=0;ae<y;ae++){let k=1-Math.abs(C(w*P,F*P));k*=k,k*=O,O=k,E+=k*A,A*=.5,P*=2.03}return E}return{snoise:C,fbm:R,ridged:B}})();function q(d=1536){const l=d/2,p=document.createElement("canvas");p.width=d,p.height=l;const v=p.getContext("2d"),T=v.createImageData(d,l);for(let B=0;B<l;B++){const w=B/l*2.6;for(let F=0;F<d;F++){const y=F/d*Math.PI*2,E=Math.cos(y)*1.7,A=Math.sin(y)*1.7;let P=(z.fbm(E*1.3+w*.25,A*1.3+w,6)*.5+.5)*.66;P+=(z.fbm(E*3.6,A*3.6+w*2.1,5)*.5+.5)*.34;const O=(B*d+F)*4,ae=Math.round(N(P)*255);T.data[O]=T.data[O+1]=T.data[O+2]=ae,T.data[O+3]=255}}v.putImageData(T,0,0);const S=document.createElement("canvas");S.width=d,S.height=l;const C=S.getContext("2d");C.filter="blur("+Math.max(2,d/220)+"px)",C.drawImage(p,0,0),C.filter="none";const R=new la(S);return R.wrapS=no,R.wrapT=Fo,R.minFilter=Eo,R.magFilter=Do,R.generateMipmaps=!0,R}function Ge(d,l,p,v,T){const S=new ro({side:Io,depthWrite:!1,fog:!1,uniforms:{zenith:{value:new M(l.zenith)},upper:{value:new M(l.upper)},mid:{value:new M(l.mid)},horizon:{value:new M(l.horizon)},sunCol:{value:new M(l.sun)},cloudDark:{value:new M(l.cloudDark)},cloudLit:{value:new M(l.cloudLit)},sunDir:{value:p.clone().normalize()},cloudTex:{value:T},cloudAmt:{value:v},uNight:{value:l.night||0},uTime:{value:0},uMouseDir:{value:new re(0,1,0)},uMouseOn:{value:0}},vertexShader:`varying vec3 vP;
      void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,fragmentShader:`
      varying vec3 vP;
      uniform vec3 zenith, upper, mid, horizon, sunCol, sunDir, cloudDark, cloudLit;
      uniform sampler2D cloudTex;
      uniform float cloudAmt, uTime, uMouseOn, uNight;
      uniform vec3 uMouseDir;
      void main(){
        vec3 d = normalize(vP);
        float h = d.y;
        vec3 c = mix(horizon, mid,   smoothstep(-0.035, 0.15, h));
        c = mix(c, upper,            smoothstep( 0.09,  0.40, h));
        c = mix(c, zenith,           smoothstep( 0.32,  0.88, h));
        float sd = max(dot(d, normalize(sunDir)), 0.0);
        c += sunCol * pow(sd, 5.0)   * mix(0.30, 0.07, uNight); // broad atmospheric in-scatter
        c += sunCol * pow(sd, 190.0) * mix(1.75, 0.34, uNight); // tight disc glow / night moon
        vec2 uv = vec2(atan(d.z, d.x)/6.2831853 + 0.5, clamp(d.y*1.35, 0.0, 1.0));

        /* Smoke, not a spinning disc. The lookup is advected along a turbulent
           flow field sampled from the cloud texture itself — curl runs
           perpendicular to the density gradient, which is what makes vapour
           curl and shear instead of rotating rigidly. The pointer only raises
           the amplitude of a drift that is always present. */
        vec3 md = normalize(uMouseDir);
        float mArc = acos(clamp(dot(d, md), -1.0, 1.0));
        float mAng = uMouseOn * exp(-(mArc/0.62)*(mArc/0.62));   // wide, edgeless

        /* two octaves of curl, the second advected by the first — the classic
           way to get vapour that folds back on itself */
        vec2 fA = uv*0.55 + vec2(uTime*0.0052, uTime*0.0021);
        float a0 = texture2D(cloudTex, fA).r;
        float ax = texture2D(cloudTex, fA + vec2(0.011, 0.0)).r;
        float ay = texture2D(cloudTex, fA + vec2(0.0, 0.011)).r;
        vec2 curlA = vec2(ay - a0, -(ax - a0)) * 7.0;

        vec2 fB = uv*1.70 + vec2(-uTime*0.0033, uTime*0.0046) + curlA*0.030;
        float b0 = texture2D(cloudTex, fB).r;
        float bx = texture2D(cloudTex, fB + vec2(0.007, 0.0)).r;
        float by = texture2D(cloudTex, fB + vec2(0.0, 0.007)).r;
        vec2 flow = curlA + vec2(by - b0, -(bx - b0)) * 3.4;

        /* a linear spread term, not a normalised push — normalising leaves a
           singularity at the pointer that reads as a pinched circle */
        vec2 mUv = vec2(atan(md.z, md.x)/6.2831853 + 0.5, clamp(md.y*1.35, 0.0, 1.0));
        uv += flow * (0.016 + mAng*0.070) + (uv - mUv) * mAng * 0.055;

        float band = smoothstep(0.005, 0.11, h) * (1.0 - smoothstep(0.28, 0.72, h));
        float cl = texture2D(cloudTex, vec2(uv.x*1.35 + uTime*0.0035, uv.y)).r;
        cl = smoothstep(0.34, 0.94, cl) * band * cloudAmt * (1.0 - mAng*0.09);
        vec3 clShade = mix(cloudDark, cloudLit, pow(sd, 1.5));
        c = mix(c, clShade, cl);
        vec3 starCell = floor((d + 1.0) * 720.0);
        float starSeed = fract(sin(dot(starCell, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        float star = smoothstep(0.9974, 1.0, starSeed) * smoothstep(0.03, 0.34, h) * uNight;
        c += vec3(0.70, 0.84, 1.0) * star * 1.75;
        gl_FragColor = vec4(c, 1.0);
      }`});return new ct(new _o(d,48,28),S)}const ht=[{depth:300,width:1.1,offset:-.36,lift:.075,tall:.4,rays:1,gain:.38,crown:9395455,phase:0},{depth:385,width:1.75,offset:.14,lift:.055,tall:.44,rays:.94,gain:.34,crown:14834920,phase:1.31},{depth:470,width:1.25,offset:-.5,lift:.09,tall:.38,rays:.88,gain:.24,crown:8217599,phase:2.6},{depth:565,width:1.9,offset:.1,lift:.045,tall:.42,rays:.5,gain:.17,crown:11037951,phase:3.94},{depth:690,width:2.1,offset:-.06,lift:.03,tall:.4,rays:.24,gain:.12,crown:7306751,phase:5.17}],mt=`
  uniform float uTime;
  uniform float uPhase;
  uniform float uFold;
  uniform float uSpan;
  varying vec2 vUv;
  varying float vEdge;
  const float TAU = 6.2831853;
  void main(){
    vUv = uv;
    float u = uv.x * uSpan;
    /* Three folds of falling amplitude: the curtain snakes through depth
       instead of hanging flat, so its hairpin bends stack their own glow. */
    float fold = sin(u * TAU        + uTime * 0.085 + uPhase)       * 1.00
               + sin(u * TAU * 2.30 - uTime * 0.061 + uPhase * 1.7) * 0.52
               + sin(u * TAU * 4.70 + uTime * 0.043 + uPhase * 2.9) * 0.21;
    float slope = cos(u * TAU        + uTime * 0.085 + uPhase)       * TAU
                + cos(u * TAU * 2.30 - uTime * 0.061 + uPhase * 1.7) * TAU * 2.30 * 0.52
                + cos(u * TAU * 4.70 + uTime * 0.043 + uPhase * 2.9) * TAU * 4.70 * 0.21;
    /* Where the sheet turns edge-on the sight line crosses more gas, which is
       why the folds of a real curtain read as bright vertical seams. */
    vEdge = smoothstep(0.0, 1.0, abs(slope) / 11.0);
    vec3 p = position;
    p.z += fold * uFold;
    /* The lower border ripples, and the crown leans downwind. */
    float low = 1.0 - uv.y;
    p.y += sin(u * TAU * 3.1 - uTime * 0.105 + uPhase) * 0.30 * uFold * low * low;
    p.x += uv.y * uv.y * sin(uTime * 0.068 + uPhase) * 0.35 * uFold;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`,ue=`
  uniform float uTime;
  uniform float uPhase;
  uniform float uSpan;
  uniform float uRays;
  uniform float uGain;
  uniform vec3 uBase;
  uniform vec3 uMid;
  uniform vec3 uCrown;
  varying vec2 vUv;
  varying float vEdge;
  float hash(float n){ return fract(sin(n * 127.1) * 43758.5453123); }
  float wave(float x){
    float i = floor(x), f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), f);
  }
  float fbm(float x){ return wave(x) * 0.60 + wave(x * 2.17 + 11.3) * 0.28 + wave(x * 4.63 + 37.1) * 0.12; }
  void main(){
    float x = vUv.x, y = vUv.y;
    float u = x * uSpan;
    /* Field-aligned rays: a fine comb over a coarser one, both drifting. */
    float fine = fbm(u * 150.0 + uPhase * 40.0 + uTime * 0.30);
    float coarse = fbm(u * 42.0 - uTime * 0.16 + uPhase * 17.0);
    float rays = mix(1.0, 0.30 + (fine * 0.55 + coarse * 0.45) * 1.85, uRays);
    /* A display is patchy: long stretches of sky stay dark between arcs. */
    float arc = smoothstep(0.30, 0.78, fbm(u * 6.0 + uTime * 0.042 + uPhase * 5.0));
    /* Brightness surges travel along the arc rather than blinking in place. */
    float surge = 0.70 + 0.46 * sin(u * 7.0 - uTime * 0.52 + uPhase * 3.0);
    /* Crisp lower border, long exponential bleed upward: the asymmetry that
       separates an aurora from a soft glowing ribbon. */
    float border = smoothstep(0.0, 0.035, y);
    float sheet = exp(-y * 3.0);
    float reach = exp(-y * (3.6 - rays * 1.5));
    /* The rays have to be gone before the sheet's own top edge, or the geometry
       shows up as a ruled line across the sky. */
    float crown = 1.0 - smoothstep(0.20, 0.78, y);
    /* A real curtain has a hot, knife-thin lower rim above its cut-off. */
    float rim = 1.0 + 0.85 * exp(-y * 26.0);
    /* Some sheets end inside the frame, so taper the ends or the plane's own
       side edge reads as a vertical seam. */
    float ends = smoothstep(0.0, 0.07, x) * (1.0 - smoothstep(0.93, 1.0, x));
    float energy = border * crown * rim * ends * (sheet * 0.35 + reach * 0.90) * rays * arc * surge;
    energy *= (0.50 + vEdge * 0.95) * uGain;
    /* Oxygen green at the base, teal through the body, nitrogen violet in the
       crown, and the crown only shows where the sheet is genuinely lit. */
    vec3 colour = mix(uBase, uMid, smoothstep(0.04, 0.24, y));
    colour = mix(colour, uCrown, smoothstep(0.12, 0.46, y) * 0.90);
    gl_FragColor = vec4(colour * energy, clamp(energy * 4.0, 0.0, 1.0));
  }`;function _t(){const d=new Lo,l=[];for(const p of ht){const v=p.width*p.depth,T=p.tall*p.depth,S=p.depth*.085,C=new Za(v,T,168,20),R=new ro({transparent:!0,depthWrite:!1,side:Et,blending:It,uniforms:{uTime:{value:0},uPhase:{value:p.phase},uFold:{value:S},uSpan:{value:p.width*.62},uRays:{value:p.rays},uGain:{value:p.gain},uBase:{value:new M(1638256)},uMid:{value:new M(2810040)},uCrown:{value:new M(p.crown)}},vertexShader:mt,fragmentShader:ue}),B=new ct(C,R);B.position.set(p.offset*p.depth,p.lift*p.depth+T*.5,-p.depth),d.add(B),l.push(R)}return d.userData.materials=l,d}function pt(d){const l=document.createElement("canvas");l.width=l.height=256;const p=l.getContext("2d"),v=p.createRadialGradient(128,128,0,128,128,128);return v.addColorStop(0,d[0]),v.addColorStop(.18,d[1]),v.addColorStop(.5,d[2]),v.addColorStop(1,d[3]),p.fillStyle=v,p.fillRect(0,0,256,256),new la(l)}const I={ok:!1,render:()=>{},resize:()=>{},setScroll:()=>{},setMouse:()=>{},setPointer:()=>{}};function ze(){const d=te();if(typeof yo>"u"||!d)return!1;let l;try{l=new bo({canvas:d,antialias:!0,powerPreference:"high-performance"})}catch(e){return console.error("Terrane hero could not create its WebGL renderer.",e),!1}if(!l.getContext())return!1;const p=Math.min(devicePixelRatio||1,1.7);l.setPixelRatio(p),l.setSize(ee,se,!1),l.outputEncoding=Mo,l.toneMapping=So,l.toneMappingExposure=h.exposure,l.shadowMap.enabled=!0,l.shadowMap.type=To;const v=new Ka,T=new Ao(40,ee/se,.5,1400);T.position.set(0,26,86);const S=new re(...h.sunDirection).normalize(),C=h.sunColor;v.fog=new Ro(h.fog,h.fogDensity);const R=q(512),B=Ge(900,h.sky,S,h.cloudAmount,R);v.add(B);const w=Z?_t():null;w&&v.add(w);let F=null;try{const e=new zo(l);e.compileEquirectangularShader();const a=new Ka;a.add(new ct(B.geometry,B.material)),F=e.fromScene(a,0,1,2e3).texture,e.dispose()}catch{F=null}const y=700,E=400,A=E+1,P=1.2,O=e=>z.fbm(e*1.25,3.7,3)*52,ae=new Za(y,y,E,E),k=ae.attributes.position,D=new Float32Array(k.count);let me=0;for(let e=0;e<k.count;e++){const a=k.getX(e),o=k.getY(e),n=a/y,r=o/y,s=z.fbm(n*1.5,r*1.5,4),t=z.fbm(n*1.5+5.2,r*1.5+1.3,4);let i=z.ridged(n*2+s*.9,r*2+t*.9,7)*30;i+=z.fbm(n*6.5,r*6.5,5)*3.4,i+=z.fbm(n*19,r*19,4)*1.1;const f=O(r),c=Math.abs(a-f),x=Math.exp(-Math.pow(c/74,2));i*=1-x*.88,i-=x*5.2,i+=Math.sin(i*.95)*(.9-N(i/38)*.45),D[e]=i,i>me&&(me=i),k.setZ(e,i)}const be=y/E,fe=new Float32Array(k.count);for(let e=0;e<A;e++)for(let a=0;a<A;a++){const o=e*A+a,n=D[e*A+Math.max(a-1,0)],r=D[e*A+Math.min(a+1,A-1)],s=D[Math.max(e-1,0)*A+a],t=D[Math.min(e+1,A-1)*A+a];fe[o]=Math.hypot((r-n)/(2*be),(t-s)/(2*be))}const pe=new Float32Array(k.count*3),Ve=new M(h.terrain.rock),$e=new M(h.terrain.rockDark),Pe=new M(h.terrain.clay),ke=new M(h.terrain.ochre),qe=new M(h.terrain.sand),gt=new M(h.terrain.bone),vt=new M(h.terrain.scrub),Me=new M(h.terrain.grass),Se=new M(h.terrain.silt),U=new M,Y=new M,xt=new Float32Array(k.count);for(let e=0;e<k.count;e++){const a=D[e],o=fe[e],n=N(a/(me*.9)),r=Math.sin(a*.95)*.5+.5,s=N((o-.42)/.55),t=N(1-Math.abs(a-P)/17)*N(1-o/.7);n<.22?U.copy(Se).lerp(Pe,n/.22):n<.48?U.copy(Pe).lerp(ke,(n-.22)/.26):n<.76?U.copy(ke).lerp(qe,(n-.48)/.28):U.copy(qe).lerp(gt,(n-.76)/.24),Y.copy(Ve).lerp($e,r),U.lerp(Y,s*.82),Y.copy(vt).lerp(Me,r*.6+.2);const i=N(t*1.08);U.lerp(Y,i),xt[e]=i;const f=(.82+.18*r)*(1-i*.34);pe[e*3]=U.r*f,pe[e*3+1]=U.g*f,pe[e*3+2]=U.b*f}ae.setAttribute("color",new na(pe,3)),ae.computeVertexNormals();function ua(e){const a=document.createElement("canvas");a.width=a.height=e;const o=a.getContext("2d"),n=o.createImageData(e,e),r=new Float32Array(e*e);for(let t=0;t<e;t++)for(let i=0;i<e;i++){const f=i/e*11,c=t/e*11;r[t*e+i]=z.snoise(f,c)*.5+z.snoise(f*2.7,c*2.7)*.3+z.snoise(f*6.4,c*6.4)*.2}for(let t=0;t<e;t++)for(let i=0;i<e;i++){const f=r[t*e+(i-1+e)%e],c=r[t*e+(i+1)%e],x=r[(t-1+e)%e*e+i],g=r[(t+1)%e*e+i],b=(f-c)*1.9,_=(x-g)*1.9,L=1,oe=Math.hypot(b,_,L),X=(t*e+i)*4;n.data[X]=(b/oe*.5+.5)*255,n.data[X+1]=(_/oe*.5+.5)*255,n.data[X+2]=(L/oe*.5+.5)*255,n.data[X+3]=255}o.putImageData(n,0,0);const s=new la(a);return s.wrapS=s.wrapT=no,s.repeat.set(46,46),s}const Bt=new ra({vertexColors:!0,roughness:.95,metalness:.01,envMap:F,envMapIntensity:.3,normalMap:ua(512),normalScale:new lt(1.05,1.05)}),wt={uSand:{value:new re},uSandOn:{value:0},uSandR:{value:24}};Bt.onBeforeCompile=e=>{Object.assign(e.uniforms,wt),e.vertexShader=`
      uniform vec3 uSand; uniform float uSandOn, uSandR;
      varying float vScuff;
    `+e.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      vec3 wpS = (modelMatrix * vec4(transformed, 1.0)).xyz;
      float dS = distance(wpS.xz, uSand.xz);
      float sc = uSandOn * (1.0 - smoothstep(0.0, uSandR, dS));
      vScuff = sc;
      transformed.z -= sc*sc*1.7;                 // local z is world up
    `),e.fragmentShader=`
      varying float vScuff;
    `+e.fragmentShader.replace("#include <color_fragment>",`
      #include <color_fragment>
      float ring = smoothstep(0.16, 0.32, vScuff) * (1.0 - smoothstep(0.32, 0.62, vScuff));
      diffuseColor.rgb *= mix(1.0, 0.70, vScuff*vScuff);
      diffuseColor.rgb += vec3(0.115, 0.094, 0.062) * ring;
    `)},Bt.customProgramCacheKey=()=>"terrane-ground";const Ye=new ct(ae,Bt);Ye.rotation.x=-Math.PI/2,Ye.position.z=-170,Ye.receiveShadow=!0,Ye.castShadow=!0,v.add(Ye);const yt=320,Xe=12,fa=[],da=[],ha=[],ma=[],io=new M(h.waterNear),co=new M(h.waterFar),bt=new M;for(let e=0;e<=yt;e++){const a=-y/2+e*(y/yt),o=a/y,n=O(o),r=11+(z.fbm(o*3.2,8.1,3)*.5+.5)*13,s=Math.pow(N((a+y/2)/y),.55);bt.copy(io).lerp(co,s);for(let t=0;t<=Xe;t++){const i=t/Xe,f=n-r+i*r*2,c=z.fbm(f*.085,a*.085,3)*.2+z.fbm(f*.34,a*.34,2)*.07;fa.push(f,a,c),ma.push(i,e/yt);const x=1-Math.pow(Math.abs(i*2-1),3)*.42;ha.push(bt.r*x,bt.g*x,bt.b*x)}}for(let e=0;e<yt;e++)for(let a=0;a<Xe;a++){const o=e*(Xe+1)+a,n=o+1,r=o+(Xe+1),s=r+1;da.push(o,r,n,n,r,s)}const Ce=new ut;Ce.setAttribute("position",new ft(fa,3)),Ce.setAttribute("color",new ft(ha,3)),Ce.setAttribute("uv",new ft(ma,2)),Ce.setIndex(da),Ce.computeVertexNormals();const Ke=ua(256);Ke.repeat.set(3,34);const Ht=new ra({vertexColors:!0,roughness:.075,metalness:.86,side:Et,transparent:!0,opacity:.97,envMap:F,envMapIntensity:1.15,normalMap:Ke,normalScale:new lt(.32,.32)}),Mt=10,Ze=new Float32Array(Mt*4),pa={uWTime:{value:0},uRip:{value:Ze}};Ht.onBeforeCompile=e=>{Object.assign(e.uniforms,pa),e.vertexShader=`
      uniform float uWTime;
      uniform float uRip[${Mt*4}];
      varying vec2 vRipGrad;
    `+e.vertexShader.replace("#include <begin_vertex>",`
        #include <begin_vertex>
        vec3 wpR = (modelMatrix * vec4(transformed, 1.0)).xyz;
        float rSum = 0.0;
        vec2  rGrad = vec2(0.0);
        for (int i = 0; i < ${Mt}; i++){
          float st = uRip[i*4+3];
          if (st <= 0.0) continue;
          float age = uWTime - uRip[i*4+2];
          if (age < 0.0 || age > 3.4) continue;
          vec2 c = vec2(uRip[i*4], uRip[i*4+1]);
          float d = distance(wpR.xz, c);
          float w = d - age*13.0;                       // wave front
          float env = exp(-abs(w)*0.40) * exp(-age*1.15) * st;
          rSum  += sin(w*1.15) * env;
          rGrad += ((wpR.xz - c) / max(d, 0.001)) * (1.15 * cos(w*1.15) * env);
        }
        transformed.z += rSum * 0.26;                   // local z is world up here
        vRipGrad = rGrad;
      `).replace("#include <beginnormal_vertex>",`
        #include <beginnormal_vertex>
      `),e.vertexShader=e.vertexShader.replace("#include <defaultnormal_vertex>","#include <defaultnormal_vertex>"),e.fragmentShader=`
      varying vec2 vRipGrad;
    `+e.fragmentShader.replace("#include <normal_fragment_maps>",`
      #include <normal_fragment_maps>
      /* tilt the shading normal by the ripple slope so the rings catch light */
      normal = normalize(normal + vec3(-vRipGrad.x, 0.0, -vRipGrad.y) * 0.95);
    `)},Ht.customProgramCacheKey=()=>"terrane-water";const Nt=new ct(Ce,Ht);Nt.rotation.x=-Math.PI/2,Nt.position.set(0,P,-170),v.add(Nt);const j=(e,a,o)=>{const n=N(a/y+.5,0,1)*E,r=N(o/y+.5,0,1)*E,s=Math.min(Math.floor(n),E-1),t=Math.min(Math.floor(r),E-1),i=n-s,f=r-t,c=s+1,x=t+1,g=e[t*A+s],b=e[t*A+c],_=e[x*A+s],L=e[x*A+c];return ye(ye(g,b,i),ye(_,L,i),f)},ge=Math.round(16e3*h.bushMultiplier),Gt=new Po(.5,1);Gt.scale(1,.66,1),Gt.translate(0,.32,0);const ie=new sa(Gt,new ra({roughness:.92,metalness:0,vertexColors:!1,color:16777215}),ge);ie.castShadow=!0;const ga=new Dt,Fe=new ia,Qe=new re,Je=new re,et=new M,tt=new Float32Array(ge*3),Ee=new Float32Array(ge*3),at=new Float32Array(ge*4);let H=0,va=0;for(;H<ge&&va<ge*26;){va++;const e=(Math.random()-.5)*y*.96,a=(Math.random()-.5)*y*.96,o=j(D,e,a),n=j(fe,e,a),r=j(xt,e,a);if(o<P+.2||n>.62||Math.random()>r*1.3+.05)continue;const s=.55+Math.random()*.85;Qe.set(e,o-.12,a-170),Fe.setFromAxisAngle(new re(0,1,0),Math.random()*6.28),Je.set(s*(1+Math.random()*.7),s*(.7+Math.random()*.7),s*(1+Math.random()*.7)),ga.compose(Qe,Fe,Je),ie.setMatrixAt(H,ga),tt[H*3]=Qe.x,tt[H*3+1]=Qe.y,tt[H*3+2]=Qe.z,Ee[H*3]=Je.x,Ee[H*3+1]=Je.y,Ee[H*3+2]=Je.z,at[H*4]=Fe.x,at[H*4+1]=Fe.y,at[H*4+2]=Fe.z,at[H*4+3]=Fe.w,dt?et.setHSL(.29+Math.random()*.08,.28+Math.random()*.22,.09+Math.random()*.1):Z?et.setHSL(.48+Math.random()*.08,.22+Math.random()*.18,.05+Math.random()*.07):Ne?et.setHSL(.52+Math.random()*.07,.2+Math.random()*.16,.06+Math.random()*.07):et.setHSL(.17+Math.random()*.08,.14+Math.random()*.16,.08+Math.random()*.09),ie.setColorAt(H,et),H++}ie.count=H,ie.instanceMatrix.needsUpdate=!0,ie.instanceColor&&(ie.instanceColor.needsUpdate=!0),v.add(ie);const lo=ee<760?7e4:ee<1200?13e4:19e4,ot=Math.round(lo*h.grassMultiplier),nt=6,Ot=(()=>{const e=[],a=[];for(let r=0;r<nt;r++){const s=r/nt;e.push(-.5,s,0,.5,s,0)}e.push(0,1,0);for(let r=0;r<nt-1;r++){const s=r*2;a.push(s,s+1,s+2,s+1,s+3,s+2)}const o=(nt-1)*2;a.push(o,o+1,nt*2);const n=new ut;return n.setAttribute("position",new ft(e,3)),n.setIndex(a),n})(),Ut=new Qa({color:16777215,side:Et,vertexColors:!1}),St={uTime:{value:0},uWind:{value:new lt(.86,.5)},uWindAmp:{value:.85},uThickness:{value:.26},uRestBend:{value:.42},uHover:{value:new re(0,0,0)},uHoverOn:{value:0},uHoverR:{value:30}},Wt=new M(h.grassBase),jt=new M(h.grassTip);Ut.onBeforeCompile=e=>{Object.assign(e.uniforms,St),e.vertexShader=`
      uniform float uTime, uWindAmp, uThickness, uRestBend, uHoverOn, uHoverR;
      uniform vec2 uWind;
      uniform vec3 uHover;
      attribute vec4 aParams;     // height, phase, angle, tint
      attribute vec2 aSlope;      // downhill direction * steepness
      varying float vT;
      varying float vTint;
    `+e.vertexShader.replace("#include <beginnormal_vertex>",`
        float gT   = position.y;
        float gH   = aParams.x;
        float gPh  = aParams.y;
        float gAng = aParams.z;
        float gCa  = cos(gAng), gSa = sin(gAng);
        vT = gT; vTint = aParams.w;

        vec3 gRoot = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

        /* rest bend — a blade is never straight */
        float gWave = 0.5 + 0.5*sin(gPh*1.73);
        float gRest = uRestBend * (0.58 + gWave*0.42) * pow(gT, 1.42) * gH;
        float gRa   = gAng + sin(gPh*0.71)*0.52;

        /* wind: a fast ripple riding a slow gust front */
        float w1 = sin(uTime*1.75 + gPh + gRoot.x*0.135 + gRoot.z*0.105);
        float w2 = sin(uTime*0.42 + gRoot.x*0.020 + gRoot.z*0.017);
        vec2  gForce = uWind * uWindAmp * (0.55 + 0.45*w2) * (0.55 + 0.45*w1);

        /* pointer parts the grass and presses it flat */
        float gD    = distance(gRoot.xz, uHover.xz);
        float gInfl = uHoverOn * (1.0 - smoothstep(0.0, uHoverR, gD));
        gInfl = gInfl*gInfl;
        vec2  gAway = normalize(gRoot.xz - uHover.xz + vec2(1e-4));
        gForce += gAway * gInfl * 3.4;

        float gShape = pow(gT, 1.55) * (0.42 + gH*0.62);
        vec2  gBend  = gForce * gShape + vec2(cos(gRa), sin(gRa)) * gRest;

        /* bent normal: rounded across the ribbon, then tipped with the bend */
        vec3 objectNormal = normalize(
          vec3(-gSa, 0.0, gCa) + vec3(gCa, 0.0, gSa)*position.x*2.2
          + vec3(0.0, 0.62*gT, 0.0) + vec3(gBend.x, 0.0, gBend.y)*0.42);
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif
      `).replace("#include <begin_vertex>",`
        float gTaper = max(0.02, 1.0 - gT*0.92);
        vec2 gRibbon = vec2(position.x*gCa - position.z*gSa,
                            position.x*gSa + position.z*gCa) * uThickness * gTaper;

        vec3 transformed = vec3(gRibbon.x, gT*gH, gRibbon.y);
        transformed.xz += gBend;
        /* bending shortens the blade vertically, or it stretches like rubber */
        transformed.y -= (abs(gRest)*pow(gT,1.7)*(0.24 + gWave*0.08)
                          + dot(gForce,gForce)*gShape*0.06);
        transformed.y -= gInfl * gT * gH * 0.55;
        transformed.xz -= aSlope * gT * gH * 0.18;
      `),e.fragmentShader=`
      varying float vT;
      varying float vTint;
    `+e.fragmentShader.replace("#include <color_fragment>",`
      #include <color_fragment>
      /* dark, occluded base rising to a sun-bleached tip */
      vec3 gBase = vec3(${Wt.r}, ${Wt.g}, ${Wt.b}) * (0.70 + vTint*0.60);
      vec3 gTip  = vec3(${jt.r}, ${jt.g}, ${jt.b}) * (0.72 + vTint*0.62);
      diffuseColor.rgb *= mix(gBase, gTip, pow(vT, 0.82)) * 1.15;
    `)},Ut.customProgramCacheKey=()=>"terrane-grass";const De=new sa(Ot,Ut,ot);De.receiveShadow=!0,De.frustumCulled=!1;const rt=new Float32Array(ot*4),Vt=new Float32Array(ot*2),xa=new Dt;let ce=0,wa=0;const ya=256;for(;ce<ot&&wa<ot*14;){wa++;const e=(Math.random()-.5)*y*.95,a=(Math.random()-.5)*y*.95,o=j(D,e,a),n=j(fe,e,a);if(o<P+.25||n>.62)continue;const r=a-ya,s=Math.hypot(e,r);if(Math.random()>N(1.5-s/330,.06,1))continue;const t=j(xt,e,a),i=N(t*(h.understory?1.12:.95)+(h.understory?.6:.44));if(Math.random()>i)continue;xa.makeTranslation(e,o-.05,a-170),De.setMatrixAt(ce,xa);const f=N(s/300);rt[ce*4]=(1.1+Math.random()*1.9)*(.75+i*.5)*(1+f*.55),rt[ce*4+1]=Math.random()*6.283,rt[ce*4+2]=Math.random()*6.283,rt[ce*4+3]=Math.random();const c=.9,x=(j(D,e+c,a)-j(D,e-c,a))/(2*c),g=(j(D,e,a+c)-j(D,e,a-c))/(2*c);Vt[ce*2]=x,Vt[ce*2+1]=g,ce++}De.count=ce,De.instanceMatrix.needsUpdate=!0,Ot.setAttribute("aParams",new ca(rt,4)),Ot.setAttribute("aSlope",new ca(Vt,2)),v.add(De);let Ie=null;if(h.understory){const e=(()=>{const b=[],_=[],L=(K,V)=>(b.push(K,V,0),b.length/3-1);let oe=-1,X=-1;for(let K=0;K<=8;K++){const V=K/8,Ae=.06*(1-V*.86),ne=L(-Ae,V),Re=L(Ae,V);K>0&&_.push(oe,X,ne,X,Re,ne),oe=ne,X=Re}const J=1/8;for(let K=0;K<8;K++){const V=(K+.55)/8,Ae=Math.sin(Math.PI*(.2+V*.74))*(1-V*.3);for(let ne=0;ne<2;ne++){const Re=ne?1:-1,xo=L(Re*.05,V-J*.44),Ya=L(Re*(.05+Ae*.52),V-J*.06),wo=L(Re*(.05+Ae),V+J*.78),Xa=L(Re*.05,V+J*.4);_.push(xo,Ya,Xa,Ya,wo,Xa)}}const He=new ut;return He.setAttribute("position",new ft(b,3)),He.setIndex(_),He})(),a=new Qa({color:16777215,side:Et,vertexColors:!1});Ie={uTime:{value:0},uWind:{value:new lt(.86,.5)},uWindAmp:{value:.44},uHover:{value:new re(0,0,0)},uHoverOn:{value:0},uHoverR:{value:30}};const o=new M(h.fernBase),n=new M(h.fernTip);a.onBeforeCompile=g=>{Object.assign(g.uniforms,Ie),g.vertexShader=`
        uniform float uTime, uWindAmp, uHoverOn, uHoverR;
        uniform vec2 uWind;
        uniform vec3 uHover;
        attribute vec4 aFrond;    // length, phase, yaw, tint
        varying float vT;
        varying float vTint;
      `+g.vertexShader.replace("#include <beginnormal_vertex>",`
          float fT   = clamp(position.y, 0.0, 1.0);
          float fLen = aFrond.x;
          float fPh  = aFrond.y;
          float fYaw = aFrond.z;
          vT = fT; vTint = aFrond.w;

          vec2 fDir  = vec2(cos(fYaw), sin(fYaw));      // the way this frond leans out
          vec2 fSide = vec2(-fDir.y, fDir.x);
          vec3 fRoot = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

          /* the same ripple-on-a-gust the grass rides, so the two layers read
             as one field rather than two systems running side by side */
          float f1 = sin(uTime*1.15 + fPh + fRoot.x*0.115 + fRoot.z*0.090);
          float f2 = sin(uTime*0.42 + fRoot.x*0.020 + fRoot.z*0.017);
          vec2  fForce = uWind * uWindAmp * (0.55 + 0.45*f2) * (0.55 + 0.45*f1);

          float fD    = distance(fRoot.xz, uHover.xz);
          float fInfl = uHoverOn * (1.0 - smoothstep(0.0, uHoverR, fD));
          fInfl = fInfl*fInfl;
          fForce += normalize(fRoot.xz - uHover.xz + vec2(1e-4)) * fInfl * 2.2;

          vec2 fSway = fForce * pow(fT, 1.65) * fLen * 0.20;

          /* a frond presents its upper face to the sky, cupped across its width */
          vec3 objectNormal = normalize(
              vec3(fSide.x, 0.0, fSide.y) * position.x * 1.05
            + vec3(0.0, 0.74, 0.0)
            - vec3(fDir.x, 0.0, fDir.y) * (0.30 + fT*0.34)
            + vec3(fSway.x, 0.0, fSway.y) * 0.5);
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3( tangent.xyz );
          #endif
        `).replace("#include <begin_vertex>",`
          /* the rachis climbs fast, then tips forward and over */
          float fRise  = fT * (1.0 - 0.28*fT*fT);
          float fReach = 0.58 * fT*fT;
          float fSpread = fLen * (0.25 + 0.13*fT);

          vec3 transformed =
              vec3(0.0, fRise * fLen, 0.0)
            + vec3(fDir.x, 0.0, fDir.y) * (fReach * fLen)
            + vec3(fSide.x, 0.0, fSide.y) * (position.x * fSpread);
          transformed.xz += fSway;
          transformed.y  -= fInfl * fT * fLen * 0.34;
          /* flat fronds read as cardboard edge-on, so lift the middle of each */
          transformed.y  += (1.0 - position.x*position.x) * fLen * 0.05 * fT;
        `),g.fragmentShader=`
        varying float vT;
        varying float vTint;
      `+g.fragmentShader.replace("#include <color_fragment>",`
        #include <color_fragment>
        /* shaded crown at the root, new growth at the frond tips */
        vec3 fBase = vec3(${o.r}, ${o.g}, ${o.b}) * (0.72 + vTint*0.58);
        vec3 fTip  = vec3(${n.r}, ${n.g}, ${n.b}) * (0.70 + vTint*0.64);
        diffuseColor.rgb *= mix(fBase, fTip, pow(vT, 0.86)) * 0.96;
      `)},a.customProgramCacheKey=()=>"terrane-fern";const r=ee<760?8500:ee<1200?16e3:26e3,s=Math.round(r*h.understory),t=new sa(e,a,s);t.receiveShadow=!0,t.frustumCulled=!1;const i=new Float32Array(s*4),f=new Dt;let c=0,x=0;for(;c<s&&x<s*16;){x++;const g=(Math.random()-.5)*y*.95,b=(Math.random()-.5)*y*.95,_=j(D,g,b),L=j(fe,g,b);if(_<P+.15||L>.58)continue;const oe=b-ya,X=Math.hypot(g,oe);if(Math.random()>N(1.9-X/520,.08,1))continue;const J=j(xt,g,b),He=1-N((_-P)/22);if(Math.random()>N(J*1.05+He*.3+.4))continue;const K=4+Math.floor(Math.random()*5),V=Math.random()*6.283,Ae=(2.4+Math.random()*2.9)*(.78+He*.42);for(let ne=0;ne<K&&c<s;ne++)f.makeTranslation(g,_-.08,b-170),t.setMatrixAt(c,f),i[c*4]=Ae*(.66+Math.random()*.5),i[c*4+1]=Math.random()*6.283,i[c*4+2]=V+ne/K*6.283+(Math.random()-.5)*.7,i[c*4+3]=Math.random(),c++}t.count=c,t.instanceMatrix.needsUpdate=!0,e.setAttribute("aFrond",new ca(i,4)),v.add(t)}const _e=14;function uo(e,a,o){const n=new Map;for(let r=0;r<a;r++){const s=Math.floor(e[r*o]/_e)+":"+Math.floor(e[r*o+2]/_e);let t=n.get(s);t||(t=[],n.set(s,t)),t.push(r)}return n}function fo(e,a,o,n,r){r.length=0;const s=Math.floor((a-n)/_e),t=Math.floor((a+n)/_e),i=Math.floor((o-n)/_e),f=Math.floor((o+n)/_e);for(let c=s;c<=t;c++)for(let x=i;x<=f;x++){const g=e.get(c+":"+x);if(g)for(let b=0;b<g.length;b++)r.push(g[b])}return r}const ho=uo(tt,H,3),$t=new Set,qt=[],Yt=26,u={x:0,z:0,on:!1,water:!1},ba=new re(0,1,0),Tt=new ko,Ma=new lt;function mo(e,a){Ma.set(e,a),Tt.setFromCamera(Ma,T),ba.copy(Tt.ray.direction);const o=Tt.ray.origin,n=Tt.ray.direction;if(n.y>=-.02)return!1;let r=0,s=Math.min(560,(o.y- -40)/-n.y);o.y-Le(o.x,o.z);let t=0,i=!1;for(let f=1;f<=72;f++){const c=s*f/72,x=o.x+n.x*c,g=o.y+n.y*c,b=o.z+n.z*c;if(g-Le(x,b)<=0){r=t,s=c,i=!0;break}t=c}if(!i)return!1;for(let f=0;f<14;f++){const c=(r+s)*.5,x=o.x+n.x*c,g=o.y+n.y*c,b=o.z+n.z*c;g-Le(x,b)>0?r=c:s=c}if(u.x=o.x+n.x*s,u.z=o.z+n.z*s,u.water=Le(u.x,u.z)<P,u.water){const f=(P-o.y)/n.y;f>0&&(u.x=o.x+n.x*f,u.z=o.z+n.z*f)}return!0}function Le(e,a){const o=e,n=a+170;return Math.abs(o)>y/2||Math.abs(n)>y/2?-999:j(D,o,n)}const Sa=new Dt,Te=new ia,Xt=new re,Ta=new re,ve=Float32Array.from(tt),de=new Float32Array(ge*3),W=new Float32Array(ge*3),xe=Float32Array.from(at),st=new Set,po=46,Aa=new ia;let At=0,Ra=.016,Kt=0,Zt=0,za=-1e9,Pa=0,ka=0;function go(e,a){if(Ra=a>0?a:.016,u.on){fo(ho,u.x,u.z,Yt,qt);for(let t=0;t<qt.length;t++)$t.add(qt[t])}const o=e*.001,n=u.on&&!u.water;if(u.ground=n,At=ye(At,n?1:0,n?.12:.07),St.uTime.value=o,St.uHoverOn.value=At,u.on&&St.uHover.value.set(u.x,0,u.z),Ie&&(Ie.uTime.value=o,Ie.uHoverOn.value=At,u.on&&Ie.uHover.value.set(u.x,0,u.z)),wt.uSandOn.value=ye(wt.uSandOn.value,n?1:0,n?.14:.08),n&&wt.uSand.value.set(u.x,0,u.z),pa.uWTime.value=o,u.on&&u.water){const t=Math.hypot(u.x-Pa,u.z-ka);if(e-za>95&&t>1.1){za=e,Pa=u.x,ka=u.z;const i=Zt*4;Ze[i]=u.x,Ze[i+1]=u.z,Ze[i+2]=o,Ze[i+3]=Math.min(1,.45+t*.06),Zt=(Zt+1)%Mt}}if(u.on){for(const t of $t){if(st.has(t))continue;const i=ve[t*3],f=ve[t*3+2],c=Math.hypot(i-u.x,f-u.z);if(c>Yt)continue;const x=1-c/Yt,g=c>.001?1/c:0,b=(i-u.x)*g,_=(f-u.z)*g,L=5+x*19;de[t*3]=b*L*(.55+Math.random()*.9),de[t*3+1]=(6+x*20)*(.55+Math.random()*.85),de[t*3+2]=_*L*(.55+Math.random()*.9),W[t*3]=(Math.random()-.5)*13,W[t*3+1]=(Math.random()-.5)*13,W[t*3+2]=(Math.random()-.5)*13,st.add(t)}$t.clear()}const r=Math.min(.033,Ra);let s=!1;for(const t of st){let i=ve[t*3],f=ve[t*3+1],c=ve[t*3+2],x=de[t*3],g=de[t*3+1],b=de[t*3+2];g-=po*r,i+=x*r,f+=g*r,c+=b*r;const _=Le(i,c)-.12;if(_<-900){st.delete(t);continue}f<=_&&(f=_,g<-1.4?(g=-g*.33,x*=.66,b*=.66,W[t*3]*=.55,W[t*3+1]*=.55,W[t*3+2]*=.55):(g=0,x*=.8,b*=.8,W[t*3]*=.78,W[t*3+1]*=.78,W[t*3+2]*=.78,Math.hypot(x,b)<.3&&(x=b=0,W[t*3]=W[t*3+1]=W[t*3+2]=0,st.delete(t)))),ve[t*3]=i,ve[t*3+1]=f,ve[t*3+2]=c,de[t*3]=x,de[t*3+1]=g,de[t*3+2]=b;const L=W[t*3],oe=W[t*3+1],X=W[t*3+2],J=Math.hypot(L,oe,X);Te.set(xe[t*4],xe[t*4+1],xe[t*4+2],xe[t*4+3]),J>1e-4&&(Aa.setFromAxisAngle(Xt.set(L/J,oe/J,X/J),J*r),Te.premultiply(Aa).normalize(),xe[t*4]=Te.x,xe[t*4+1]=Te.y,xe[t*4+2]=Te.z,xe[t*4+3]=Te.w),Xt.set(i,f,c),Ta.set(Ee[t*3],Ee[t*3+1],Ee[t*3+2]),Sa.compose(Xt,Te,Ta),ie.setMatrixAt(t,Sa),s=!0}s&&(ie.instanceMatrix.needsUpdate=!0)}const Q=new Ja(C,h.sunIntensity);Q.position.copy(S).multiplyScalar(300),Q.castShadow=!0,Q.shadow.mapSize.set(2048,2048),Q.shadow.camera.near=1,Q.shadow.camera.far=760,Q.shadow.camera.left=-260,Q.shadow.camera.right=260,Q.shadow.camera.top=260,Q.shadow.camera.bottom=-260,Q.shadow.bias=-.0011,Q.shadow.normalBias=.6,v.add(Q),v.add(new Co(...h.hemisphere));const Ca=new Ja(...h.fill);Ca.position.set(150,60,140),v.add(Ca);const it=pt(h.radial),Fa=S.clone().multiplyScalar(660),Ea=Z?.42:.95,Da=Z?.035:.26,Ia=Z?18:210,_a=Z?60:760,Rt=new eo(new to({map:it,blending:It,depthWrite:!1,transparent:!0,opacity:Ea}));Rt.scale.set(Ia,Ia,1),Rt.position.copy(Fa),v.add(Rt);const zt=new eo(new to({map:it,blending:It,depthWrite:!1,transparent:!0,opacity:Da}));zt.scale.set(_a,_a,1),zt.position.copy(Fa),v.add(zt);const La=h.dust[1],Ba=new ut,Pt=new Float32Array(La*3);for(let e=0;e<La;e++)Pt[e*3]=(Math.random()-.5)*460,Pt[e*3+1]=Math.random()*64+2,Pt[e*3+2]=-Math.random()*420+70;Ba.setAttribute("position",new na(Pt,3));const Qt=new ao(Ba,new oo({color:h.dust[0],size:Z?.58:.7,sizeAttenuation:!0,transparent:!0,opacity:h.dust[2],blending:It,depthWrite:!1,map:it}));v.add(Qt);const Be=340,he=new Float32Array(Be*3),we=new Float32Array(Be*3),kt=new Float32Array(Be),Jt=new ut;Jt.setAttribute("position",new na(he,3));for(let e=0;e<Be;e++)he[e*3+1]=-9999;const Ha=new ao(Jt,new oo({color:15785144,size:5,sizeAttenuation:!0,transparent:!0,opacity:.55,depthWrite:!1,map:it}));Ha.frustumCulled=!1,v.add(Ha);let ea=0,ta=0,Na=0,Ga=0;function vo(e){if(ta-=e,u.on&&u.ground){const o=Math.hypot(u.x-Na,u.z-Ga);if(ta<=0&&o>.6){Na=u.x,Ga=u.z,ta=.028;const n=3+(Math.random()*3|0);for(let r=0;r<n;r++){const s=ea;ea=(ea+1)%Be;const t=Math.random()*6.283,i=Math.random()*7;he[s*3]=u.x+Math.cos(t)*i,he[s*3+1]=Le(u.x,u.z)+.4+Math.random()*1.2,he[s*3+2]=u.z+Math.sin(t)*i,we[s*3]=Math.cos(t)*(1.6+Math.random()*3.4),we[s*3+1]=2.2+Math.random()*4.2,we[s*3+2]=Math.sin(t)*(1.6+Math.random()*3.4),kt[s]=1}}}let a=!1;for(let o=0;o<Be;o++)if(!(kt[o]<=0)){if(kt[o]-=e*.62,kt[o]<=0){he[o*3+1]=-9999,a=!0;continue}we[o*3+1]-=3.4*e,we[o*3]+=2.6*e,he[o*3]+=we[o*3]*e,he[o*3+1]+=we[o*3+1]*e,he[o*3+2]+=we[o*3+2]*e,a=!0}a&&(Jt.attributes.position.needsUpdate=!0)}let Oa=0,Ua=0,Wa=0,Ct=0,aa=0,ja=0,Va=0,$a=0,qa=!1;return I.setScroll=e=>{Oa=e},I.setMouse=(e,a)=>{Ua=e,Wa=a},I.setPointer=(e,a,o)=>{Va=e,$a=a,qa=o},I.resize=()=>{l.setSize(ee,se,!1),T.aspect=ee/se,T.updateProjectionMatrix()},I.render=e=>{const a=e-ja;ja=e,Ct=ye(Ct,Ua,.05),aa=ye(aa,Wa,.05);const o=Oa;if(T.position.z=86-o*64,T.position.y=26-o*9+aa*3,T.position.x=Ct*9.5,T.lookAt(Ct*3.6,11-o*4.2,-200),B.position.copy(T.position),B.material.uniforms.uTime.value=e*.001,w){w.position.copy(T.position);for(const r of w.userData.materials)r.uniforms.uTime.value=e*.001}Ke.offset.y-=a*55e-6,Ke.offset.x+=a*16e-6,Qt.position.z=(Qt.position.z+a*.0016)%40,Rt.material.opacity=Ea-o*(Z?.28:.45),zt.material.opacity=Da-o*(Z?.08:.14);const n=qa&&o<.92;u.on=n&&mo(Va,$a),Kt=ye(Kt,n?1:0,n?.1:.06),B.material.uniforms.uMouseDir.value.copy(ba),B.material.uniforms.uMouseOn.value=Kt,go(e,a*.001),vo(Math.min(.033,a*.001)),l.render(v,T)},I.dispose=()=>{const e=new Set;v.traverse(a=>{a.geometry?.dispose?.();const o=Array.isArray(a.material)?a.material:a.material?[a.material]:[];for(const n of o){for(const r of Object.values(n))r?.isTexture&&e.add(r);n.dispose?.()}});for(const a of e)a.dispose?.();R.dispose(),Ke.dispose(),it.dispose(),F?.dispose?.(),l.dispose(),I.ok=!1},I.ok=!0,!0}const Oe=G.getContext.bind(G),Ue={alpha:!1,depth:!0,stencil:!0,antialias:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!1,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1},We=Oe("webgl2",Ue)?"webgl2":"webgl",m=Oe(We,Ue);return!(()=>{if(!m)return!1;const d=m.getShaderPrecisionFormat(m.FRAGMENT_SHADER,m.HIGH_FLOAT),l=m.getParameter(m.VERSION);if(!d||typeof l!="string"||!l)return!1;const p=We==="webgl2",v=p?`#version 300 es
void main(){gl_Position=vec4(0.0,0.0,0.0,1.0);}`:"void main(){gl_Position=vec4(0.0,0.0,0.0,1.0);}",T=p?`#version 300 es
precision mediump float;out vec4 color;void main(){color=vec4(1.0);}`:"precision mediump float;void main(){gl_FragColor=vec4(1.0);}";let S=null,C=null,R=null;try{return S=m.createShader(m.VERTEX_SHADER),C=m.createShader(m.FRAGMENT_SHADER),R=m.createProgram(),!S||!C||!R||(m.shaderSource(S,v),m.shaderSource(C,T),m.compileShader(S),m.compileShader(C),!m.getShaderParameter(S,m.COMPILE_STATUS))||!m.getShaderParameter(C,m.COMPILE_STATUS)||typeof m.getShaderInfoLog(S)!="string"||typeof m.getShaderInfoLog(C)!="string"||(m.attachShader(R,S),m.attachShader(R,C),m.linkProgram(R),!m.getProgramParameter(R,m.LINK_STATUS))?!1:typeof m.getProgramInfoLog(R)=="string"}catch{return!1}finally{R&&m.deleteProgram(R),S&&m.deleteShader(S),C&&m.deleteShader(C)}})()||!ze()?null:{get ok(){return I.ok},render:d=>I.render(d),setScroll:d=>I.setScroll(d),setMouse:(d,l)=>I.setMouse(d,l),setPointer:(d,l,p)=>I.setPointer(d,l,p),resize:(d,l)=>{ee=Math.max(1,d),se=Math.max(1,l),I.resize()},dispose:()=>I.dispose()}}const Wo=["sunset","forest","aurora","blue-hour"],so={sunset:"sunset",forest:"a lush forest morning",aurora:"an aurora-lit night","blue-hour":"the blue hour"},Go={sunset:"/images/sunset-valley-fallback.jpg",forest:"/images/sunset-valley-forest-fallback.jpg",aurora:"/images/sunset-valley-aurora-fallback.jpg","blue-hour":"/images/sunset-valley-blue-hour-fallback.jpg"};function jo({className:G="",fallbackSrc:le,variant:$="sunset"}){const h=Ft.useRef(null),dt=Ft.useRef(null),[Z,Ne]=Ft.useState(!1),ee=le??Go[$];return Ft.useEffect(()=>{const se=h.current,te=dt.current;if(!se||!te)return;Ne(!1);const z=No(te,$);if(!z){Ne(!1);return}let q=0,Ge=!0,ht=!1,mt=!1;const ue=()=>{!ht&&Ge&&!document.hidden&&!q&&(q=requestAnimationFrame(_t))},_t=m=>{q=0,z.render(m),mt||(mt=!0,Ne(!0)),ue()},pt=()=>{const m=se.getBoundingClientRect();z.resize(m.width,m.height),ue()},I=m=>{const je=te.getBoundingClientRect(),Lt=(m.clientX-je.left)/Math.max(1,je.width)*2-1,d=1-(m.clientY-je.top)/Math.max(1,je.height)*2;z.setMouse(Lt,d),z.setPointer(Lt,d,!0),ue()},ze=()=>{z.setPointer(0,0,!1),ue()},Oe=()=>{document.hidden&&q?(cancelAnimationFrame(q),q=0):ue()};z.setScroll(0);const Ue=new ResizeObserver(pt);Ue.observe(se);const We=new IntersectionObserver(([m])=>{Ge=m?.isIntersecting??!0,!Ge&&q?(cancelAnimationFrame(q),q=0):ue()});return We.observe(se),te.addEventListener("pointermove",I,{passive:!0}),te.addEventListener("pointerenter",I,{passive:!0}),te.addEventListener("pointerleave",ze,{passive:!0}),window.addEventListener("blur",ze),document.addEventListener("visibilitychange",Oe),pt(),ue(),()=>{ht=!0,q&&cancelAnimationFrame(q),Ue.disconnect(),We.disconnect(),te.removeEventListener("pointermove",I),te.removeEventListener("pointerenter",I),te.removeEventListener("pointerleave",ze),window.removeEventListener("blur",ze),document.removeEventListener("visibilitychange",Oe),z.dispose()}},[$]),oa.jsxs("div",{className:`sunset-valley-scene${G?` ${G}`:""}`,"data-variant":$,ref:h,children:[oa.jsx("img",{className:"sunset-valley-fallback",src:ee,alt:`Terrane valley at ${so[$]}`,"aria-hidden":Z}),oa.jsx("canvas",{ref:dt,className:`sunset-valley-canvas${Z?" is-ready":""}`,"aria-label":`Interactive Terrane valley at ${so[$]}`})]})}export{Wo as SUNSET_VALLEY_VARIANTS,jo as SunsetValleyScene};
