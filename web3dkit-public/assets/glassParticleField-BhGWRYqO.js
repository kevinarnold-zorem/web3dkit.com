import{W as I,S as B,O as H,a as F,V as x,P as W,M as L,v as O,w as X,t as _,b as j,G as K,g as Q,I as q,T as J,C as M,x as S}from"./three.module-1BtAFUfd.js";const A=34,Y="void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }",Z=`precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

vec3 bloom(vec2 uv, vec2 centre, float radius, vec3 tint){
  float aspect = uRes.x / max(uRes.y, 1.0);
  float d = length((uv - centre) * vec2(aspect, 1.0));
  float falloff = smoothstep(radius, 0.0, d);
  return tint * falloff * falloff;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime * 0.17;
  /* the base tone matters more than the blooms: refraction samples the whole
     frame, so a backdrop with black regions makes beads read as dark holes */
  vec3 col = vec3(0.085, 0.095, 0.125);
  col += mix(vec3(0.0), vec3(0.05, 0.06, 0.10), uv.y);
  col += bloom(uv, vec2(0.23 + 0.055 * sin(t * 0.9), 0.76 + 0.045 * cos(t * 0.7)), 0.86, vec3(0.24, 0.42, 0.96)) * 0.92;
  col += bloom(uv, vec2(0.82 + 0.05 * cos(t * 0.8), 0.34 + 0.055 * sin(t * 1.1)), 0.80, vec3(0.66, 0.30, 0.88)) * 0.80;
  col += bloom(uv, vec2(0.50 + 0.07 * sin(t * 0.6 + 1.7), 0.10 + 0.04 * cos(t * 0.9)), 0.74, vec3(0.14, 0.68, 0.70)) * 0.60;
  col += bloom(uv, vec2(0.10 + 0.04 * cos(t * 1.2), 0.16 + 0.05 * sin(t * 0.8)), 0.58, vec3(0.98, 0.60, 0.40)) * 0.34;
  col += bloom(uv, vec2(0.5 + uPointer.x * 0.20, 0.56 + uPointer.y * 0.16), 0.46, vec3(0.74, 0.78, 0.96)) * 0.30;
  float vignette = smoothstep(1.34, 0.30, length((uv - 0.5) * vec2(1.05, 1.0)));
  col *= mix(0.62, 1.0, vignette);
  gl_FragColor = vec4(col, 1.0);
}`,$=`varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vScreen;

void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormalView = normalize(normalMatrix * normal);
  vViewPos = mvPosition.xyz;
  vScreen = projectionMatrix * mvPosition;
  gl_Position = vScreen;
}`,ee=`precision highp float;
uniform sampler2D uBackdrop;
uniform float uThickness;
uniform float uDispersion;
uniform float uSpecular;
uniform float uRim;
uniform vec3 uTint;
uniform vec3 uLight;
varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vScreen;

void main(){
  vec2 screenUV = (vScreen.xy / vScreen.w) * 0.5 + 0.5;
  vec3 N = normalize(vNormalView);
  vec3 V = normalize(-vViewPos);
  vec3 I = -V;
  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.4);

  vec2 offsetR = refract(I, N, 1.0 / (1.44 - uDispersion)).xy * uThickness;
  vec2 offsetG = refract(I, N, 1.0 / 1.44).xy * uThickness;
  vec2 offsetB = refract(I, N, 1.0 / (1.44 + uDispersion)).xy * uThickness;

  vec3 col;
  col.r = texture2D(uBackdrop, clamp(screenUV + offsetR, 0.002, 0.998)).r;
  col.g = texture2D(uBackdrop, clamp(screenUV + offsetG, 0.002, 0.998)).g;
  col.b = texture2D(uBackdrop, clamp(screenUV + offsetB, 0.002, 0.998)).b;
  col *= uTint;

  vec3 L = normalize(uLight);
  vec3 H = normalize(L + V);
  float ndoth = max(dot(N, H), 0.0);
  col += pow(ndoth, 150.0) * uSpecular;
  col += pow(ndoth, 16.0) * uSpecular * 0.11;
  /* a second, dimmer key from below keeps the underside of every bead alive */
  vec3 H2 = normalize(normalize(vec3(0.55, -0.7, 0.45)) + V);
  col += pow(max(dot(N, H2), 0.0), 44.0) * uSpecular * 0.22;
  col += fresnel * uRim * vec3(0.86, 0.90, 1.0);

  /* aerial perspective: the small far beads dissolve into the plate they float
     over instead of reading as hard specks */
  float haze = smoothstep(7.4, 11.4, -vViewPos.z);
  col = mix(col, texture2D(uBackdrop, screenUV).rgb, haze * 0.7);
  gl_FragColor = vec4(col, 1.0);
}`;function oe(w){let p=w;return()=>(p=(p*1664525+1013904223)%4294967296,p/4294967296)}function ce(w,p){const s=new I({canvas:w,antialias:!0,alpha:!1});s.setPixelRatio(Math.min(window.devicePixelRatio,2)),s.setClearColor(658191,1);const b=new B,P=new H(-1,1,1,-1,0,1),g={uRes:{value:new x(1,1)},uTime:{value:0},uPointer:{value:new x}},R=new F({uniforms:g,vertexShader:Y,fragmentShader:Z,depthTest:!1,depthWrite:!1}),T=new W(2,2);b.add(new L(T,R));const h=new O(2,2,{minFilter:_,magFilter:_,format:X}),V=new B,l=new j(42,1,.1,100);l.position.set(0,0,7.4);const v=new K;V.add(v);const z=[new Q(1,44,30),new q(1,1),new J(.78,.3,22,56)],G=[new M(1.04,1,1.02),new M(.97,1,1.06),new M(1.05,.99,.97)],r=oe(20260826),m=[];for(let t=0;t<A;t+=1){const o=t<8,c=o?.4+r()*.34:.09+r()*.18,n=z[o?t===3?1:t===6?2:0:0],e=new F({uniforms:{uBackdrop:{value:h.texture},uThickness:{value:.1},uDispersion:{value:.05},uSpecular:{value:.85},uRim:{value:.5},uTint:{value:G[t%G.length]},uLight:{value:new S(-.45,.86,.62)}},vertexShader:$,fragmentShader:ee}),a=new L(n,e);a.scale.setScalar(c);const i=new S;for(let D=0;D<48&&(i.set((r()-.5)*8.4,(r()-.5)*5-.25,o?-1.4+r()*2.6:-3.6+r()*2.4),!(!o||m.every(k=>{const U=k.origin.x-i.x,E=k.origin.y-i.y;return Math.hypot(U,E)>(k.radius+c)*1.25+.3})));D+=1);a.position.copy(i),a.rotation.set(r()*6.28,r()*6.28,r()*6.28),v.add(a),m.push({mesh:a,material:e,origin:i,radius:c,bob:.14+r()*.34,phase:r()*6.28,spin:new S((r()-.5)*.28,(r()-.5)*.34,(r()-.5)*.2)})}const u=new x,C=new x;let d=1,f=1,y=0,N=performance.now();return{resize:(t,o)=>{const c=Math.max(1,Math.round(t)),n=Math.max(1,Math.round(o));if(c===d&&n===f)return;d=c,f=n;const e=Math.min(window.devicePixelRatio,2);s.setSize(d,f,!1),h.setSize(Math.round(d*e),Math.round(f*e)),g.uRes.value.set(d*e,f*e),l.aspect=d/f,l.fov=l.aspect>1?42:42/Math.max(.62,l.aspect),l.updateProjectionMatrix();for(const a of m)a.material.uniforms.uBackdrop.value=h.texture},render:(t=performance.now())=>{const o=p();y+=Math.min(96,t-N)*.001,N=t,u.lerp(C,.045);const c=Math.max(4,Math.min(A,Math.round(o.count)));for(let n=0;n<m.length;n+=1){const e=m[n];if(e.mesh.visible=n<c,!e.mesh.visible)continue;const a=e.material.uniforms;a.uThickness.value=o.thickness*(.55+e.radius*.9),a.uDispersion.value=o.dispersion,a.uSpecular.value=o.specular,a.uRim.value=o.rim;const i=y*o.drift;e.mesh.position.set(e.origin.x+Math.sin(i*.21+e.phase)*e.bob*.9,e.origin.y+Math.cos(i*.27+e.phase*1.3)*e.bob,e.origin.z+Math.sin(i*.17+e.phase*.7)*e.bob*.5),e.mesh.rotation.x+=e.spin.x*.0075*o.drift,e.mesh.rotation.y+=e.spin.y*.0075*o.drift,e.mesh.rotation.z+=e.spin.z*.0075*o.drift}v.rotation.y=u.x*.14,v.rotation.x=-u.y*.1,v.position.x=u.x*.28,v.position.y=u.y*.2,g.uTime.value=y,g.uPointer.value.set(u.x,u.y),s.setRenderTarget(h),s.render(b,P),s.setRenderTarget(null),s.render(b,P),s.autoClear=!1,s.render(V,l),s.autoClear=!0},setPointer:(t,o)=>C.set(t,o),dispose:()=>{for(const t of m)t.material.dispose();for(const t of z)t.dispose();T.dispose(),R.dispose(),h.dispose(),s.dispose()}}}export{ce as createGlassParticleField};
