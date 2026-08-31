import{r as m,j as b}from"./index-ChUl42DD.js";const C=`
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,U=`
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform float u_interactive_fidelity;
                varying vec2 vUv;

                mat2 rotate2d(float _angle){
                    return mat2(cos(_angle),-sin(_angle),
                                sin(_angle),cos(_angle));
                }

                void main() {
                    vec2 p = vUv * 2.0 - 1.0;
                    p.x *= u_resolution.x / u_resolution.y;
                    p = rotate2d(0.55) * p;

                    vec3 color = vec3(0.0);
                    float spread = 0.06 * (0.3 + u_interactive_fidelity * 0.7);

                    for(int i = 0; i < 3; i++) {
                        float offset = float(1 - i) * spread;
                        float y = p.y + offset + (sin(p.x * 2.5 - u_time * 1.5) * 0.12);
                        float wave = smoothstep(0.85, 0.99, sin(y * 6.0 + u_time * 2.0) * 0.5 + 0.5);
                        
                        // Modulating color mixing logic for the violet-indigo theme
                        if(i == 0) color.r += wave * 1.2; 
                        if(i == 1) color.g += wave * 0.5; 
                        if(i == 2) color.b += wave * 1.8; 
                    }

                    float vignette = exp(-length(vUv * 2.0 - 1.0) * 0.8);
                    color *= vignette;

                    gl_FragColor = vec4(color, 1.0);
                }
            `,w={speed:1,fidelity:.5,scale:1,brightness:1,opacity:1,hue:0,saturation:1};function y(r,f,u){const o=r.createShader(f);if(!o)throw new Error("Unable to create Stream Convergence shader");if(r.shaderSource(o,u),r.compileShader(o),!r.getShaderParameter(o,r.COMPILE_STATUS))throw new Error(r.getShaderInfoLog(o)??"Stream Convergence shader compilation failed");return o}function P({className:r="",...f}){const u=m.useRef(null),o=m.useRef(null),v=m.useRef({...w,...f});v.current={...w,...f},m.useEffect(()=>{const l=u.current,n=o.current;if(!l||!n)return;const e=n.getContext("webgl",{alpha:!0,antialias:!1});if(!e)return;const h=y(e,e.VERTEX_SHADER,C),_=y(e,e.FRAGMENT_SHADER,`precision highp float;
${U}`),t=e.createProgram();if(!t)return;if(e.attachShader(t,h),e.attachShader(t,_),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(t)??"Stream Convergence program link failed");e.useProgram(t);const p=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const E=e.getAttribLocation(t,"position");e.enableVertexAttribArray(E),e.vertexAttribPointer(E,2,e.FLOAT,!1,0,0);const x=e.getUniformLocation(t,"u_time"),T=e.getUniformLocation(t,"u_resolution"),F=e.getUniformLocation(t,"u_interactive_fidelity");let i=0,d=!0;const R=()=>{const a=l.getBoundingClientRect(),c=Math.min(window.devicePixelRatio||1,2);n.width=Math.max(1,Math.round(a.width*c)),n.height=Math.max(1,Math.round(a.height*c)),e.viewport(0,0,n.width,n.height),e.uniform2f(T,n.width,n.height)},g=a=>{const c=v.current;e.uniform1f(x,a*3e-4*c.speed),e.uniform1f(F,c.fidelity),e.drawArrays(e.TRIANGLES,0,6),i=d&&!document.hidden?requestAnimationFrame(g):0},A=new ResizeObserver(R),S=new IntersectionObserver(([a])=>{d=a?.isIntersecting??!0,d&&!i&&(i=requestAnimationFrame(g)),!d&&i&&(cancelAnimationFrame(i),i=0)});return A.observe(l),S.observe(l),R(),i=requestAnimationFrame(g),()=>{i&&cancelAnimationFrame(i),A.disconnect(),S.disconnect(),e.deleteBuffer(p),e.deleteShader(h),e.deleteShader(_),e.deleteProgram(t)}},[]);const s=v.current;return b.jsx("div",{ref:u,className:`threeui-background stream-convergence${r?` ${r}`:""}`,children:b.jsx("canvas",{ref:o,style:{opacity:s.opacity,filter:`hue-rotate(${s.hue}deg) saturate(${s.saturation}) brightness(${s.brightness})`,transform:`scale(${s.scale})`}})})}export{w as STREAM_CONVERGENCE_DEFAULTS,P as StreamConvergenceBackground};
