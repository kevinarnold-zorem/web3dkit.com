import{r as s,j as O}from"./index-ChUl42DD.js";import{W as _,S as b,O as T,P as G,a as C,V as c,M as L}from"./three.module-1BtAFUfd.js";const U=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,z=`
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uGridScale;
uniform float uMouseAmount;
uniform float uPulseSpeed;
uniform float uRadius;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  uv.x *= aspect;
  uv += uMouse * uMouseAmount;
  vec2 grid = fract(uv * uGridScale);
  vec2 id = floor(uv * uGridScale);
  float dist = length(grid - vec2(0.5));
  float pulse = sin(uTime * uPulseSpeed + id.x * 0.05 + id.y * 0.05) * 0.5 + 0.5;
  float radius = 0.08 + pulse * uRadius;
  float alpha = smoothstep(radius, radius - 0.05, dist);
  vec2 center = vec2(0.5 * aspect, 0.5);
  float depthFade = smoothstep(1.2, 0.1, length(uv - center));
  vec3 color = vec3(0.0, 0.9, 1.0) * pulse;
  gl_FragColor = vec4(color, alpha * depthFade * uOpacity);
}
`,F={speed:1,gridScale:60,mouseAmount:.04,pulseSpeed:.4,radius:.15,opacity:.35,hue:0};function j({className:m="",...p}){const f=s.useRef(null),h=s.useRef(null),l=s.useRef({...F,...p});return l.current={...F,...p},s.useEffect(()=>{const n=f.current,a=h.current;if(!n||!a)return;const i=new _({canvas:a,antialias:!0,alpha:!0});i.setPixelRatio(Math.min(window.devicePixelRatio,2));const R=new b,g=new T(-1,1,1,-1,.1,10);g.position.z=1;const o={uTime:{value:0},uResolution:{value:new c},uMouse:{value:new c},uGridScale:{value:60},uMouseAmount:{value:.04},uPulseSpeed:{value:.4},uRadius:{value:.15},uOpacity:{value:.35}},S=new G(2,2),x=new C({uniforms:o,vertexShader:U,fragmentShader:z,transparent:!0,depthWrite:!1});R.add(new L(S,x));let w=new c,d=new c,u=0,r=!0,P=performance.now();const A=e=>{const t=a.getBoundingClientRect();d.x=(e.clientX-t.left)/Math.max(1,t.width)*2-1,d.y=-((e.clientY-t.top)/Math.max(1,t.height)*2-1)},M=()=>{const e=n.getBoundingClientRect();i.setSize(e.width,e.height,!1),o.uResolution.value.set(e.width,e.height)},v=e=>{const t=l.current;w.lerp(d,.05),o.uTime.value=(e-P)*.001*t.speed,o.uMouse.value=w,o.uGridScale.value=t.gridScale,o.uMouseAmount.value=t.mouseAmount,o.uPulseSpeed.value=t.pulseSpeed,o.uRadius.value=t.radius,o.uOpacity.value=t.opacity,i.render(R,g),u=r&&!document.hidden?requestAnimationFrame(v):0},y=new ResizeObserver(M),E=new IntersectionObserver(([e])=>{r=e?.isIntersecting??!0,r&&!u&&(u=requestAnimationFrame(v)),!r&&u&&(cancelAnimationFrame(u),u=0)});return y.observe(n),E.observe(n),a.addEventListener("pointermove",A,{passive:!0}),M(),u=requestAnimationFrame(v),()=>{u&&cancelAnimationFrame(u),y.disconnect(),E.disconnect(),a.removeEventListener("pointermove",A),S.dispose(),x.dispose(),i.dispose()}},[]),O.jsx("div",{ref:f,className:`web3dkit-background dot-matrix${m?` ${m}`:""}`,children:O.jsx("canvas",{ref:h,style:{filter:`hue-rotate(${l.current.hue}deg)`}})})}export{F as DOT_MATRIX_DEFAULTS,j as DotMatrixBackground};
