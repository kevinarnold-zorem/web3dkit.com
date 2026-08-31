import{r as s,j as R}from"./index-ChUl42DD.js";import{S as b,O as S,W as F,a as C,V as M,P as O,M as P}from"./three.module-1BtAFUfd.js";const z=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,U=`
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_wave_scale;
uniform float u_variation;
uniform float u_glow;
uniform float u_vignette;
varying vec2 vUv;
float hash(float n) { return fract(sin(n) * 1e4); }
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float yPos = st.y;
  float wave1 = sin(st.x * 3.0 + u_time * 0.5) * 0.1 * u_wave_scale;
  float wave2 = sin(st.x * 5.0 - u_time * 0.3) * 0.05 * u_wave_scale;
  float combinedWave = wave1 + wave2;
  float intensity = smoothstep(0.4, -0.1, yPos + combinedWave);
  float variation = noise(st.x * 2.0 + u_time * 0.1) * 0.5 + 0.5;
  intensity *= variation * 1.5 * u_variation;
  vec3 color = vec3(0.0, 0.02, 0.0);
  vec3 glowColor1 = vec3(0.05, 0.8, 0.2);
  vec3 glowColor2 = vec3(0.0, 1.0, 0.5);
  vec3 finalGlow = mix(glowColor1, glowColor2, st.x + sin(u_time*0.2)*0.5);
  color += finalGlow * pow(intensity, 1.5) * 1.2 * u_glow;
  float vignette = mix(1.0, smoothstep(1.2, 0.5, length(st - vec2(0.5, 0.0))), u_vignette);
  color *= vignette;
  gl_FragColor = vec4(color, 1.0);
}
`,y={speed:1,waveScale:1,variation:1,glow:1,vignette:1,hue:0};function L({className:c="",...v}){const f=s.useRef(null),m=s.useRef(null),l=s.useRef({...y,...v});return l.current={...y,...v},s.useEffect(()=>{const a=f.current,_=m.current;if(!a||!_)return;const d=new b,A=new S(-1,1,1,-1,0,1),i=new F({canvas:_,alpha:!0,antialias:!0});i.setPixelRatio(Math.min(window.devicePixelRatio,2));const o={u_time:{value:0},u_resolution:{value:new M(1,1)},u_wave_scale:{value:1},u_variation:{value:1},u_glow:{value:1},u_vignette:{value:1}},w=new C({vertexShader:z,fragmentShader:U,uniforms:o,depthWrite:!1,depthTest:!1}),g=new O(2,2);d.add(new P(g,w));let e=0,r=!0,E=performance.now();const h=()=>{const t=a.getBoundingClientRect();i.setSize(t.width,t.height,!1),o.u_resolution.value.set(t.width,t.height)},u=t=>{const n=l.current;o.u_time.value=(t-E)*.001*n.speed,o.u_wave_scale.value=n.waveScale,o.u_variation.value=n.variation,o.u_glow.value=n.glow,o.u_vignette.value=n.vignette,i.render(d,A),e=r&&!document.hidden?requestAnimationFrame(u):0},x=new ResizeObserver(h),p=new IntersectionObserver(([t])=>{r=t?.isIntersecting??!0,r&&!e&&(e=requestAnimationFrame(u)),!r&&e&&(cancelAnimationFrame(e),e=0)});return x.observe(a),p.observe(a),h(),e=requestAnimationFrame(u),()=>{e&&cancelAnimationFrame(e),x.disconnect(),p.disconnect(),g.dispose(),w.dispose(),i.dispose()}},[]),R.jsx("div",{ref:f,className:`threeui-background emerald-horizon${c?` ${c}`:""}`,children:R.jsx("canvas",{ref:m,style:{filter:`hue-rotate(${l.current.hue}deg)`}})})}export{y as EMERALD_HORIZON_DEFAULTS,L as EmeraldHorizonBackground};
