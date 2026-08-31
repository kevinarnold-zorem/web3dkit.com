import{r as m,j as L}from"./index-ChUl42DD.js";const M=`
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,U=`
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        uniform vec2 pointer;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float ribbon(vec2 uv, float offset, float width, float phase) {
          float y = 0.55 + 0.20 * sin((uv.x * 2.15) + phase) + 0.045 * sin((uv.x * 7.0) - phase * 0.7);
          float d = abs(uv.y - y - offset);
          return exp(-(d * d) / width);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          vec2 p = uv;
          p.x *= resolution.x / resolution.y;

          float t = time * 0.22;
          float drift = (pointer.x - 0.5) * 0.06;

          float rightFade = smoothstep(0.28, 0.72, uv.x);
          float centerDark = 1.0 - smoothstep(0.0, 0.88, distance(uv, vec2(0.18, 0.48)));

          float r1 = ribbon(vec2(uv.x + drift, uv.y), 0.03, 0.0065, t + 0.9);
          float r2 = ribbon(vec2(uv.x - drift * 0.7, uv.y), -0.23, 0.0085, t + 3.25);
          float r3 = ribbon(vec2(uv.x + drift * 0.4, uv.y), 0.25, 0.014, t + 1.85);

          float glow = r1 * 1.14 + r2 * 1.05 + r3 * 0.48;

          vec3 teal = vec3(0.17, 0.83, 0.75);
          vec3 cyan = vec3(0.22, 0.82, 0.96);
          vec3 indigo = vec3(0.39, 0.38, 0.92);
          vec3 purple = vec3(0.66, 0.33, 0.98);
          vec3 blue = vec3(0.23, 0.51, 0.96);

          vec3 col = vec3(0.0);
          col += cyan * r1 * 0.92;
          col += teal * r1 * 0.62;
          col += indigo * r3 * 0.42;
          col += blue * r2 * 0.66;
          col += purple * (r2 + r3) * 0.30;

          float bloom = exp(-pow(distance(uv, vec2(0.76, 0.40 + 0.035 * sin(t))), 2.0) / 0.050);
          bloom += exp(-pow(distance(uv, vec2(0.71, 0.75 + 0.025 * cos(t))), 2.0) / 0.030);
          col += vec3(0.42, 0.85, 1.0) * bloom * 0.34;

          vec2 grid = fract(gl_FragCoord.xy / 7.0) - 0.5;
          float dotShape = smoothstep(0.29, 0.11, length(grid));
          float noise = hash(floor(gl_FragCoord.xy / 7.0));
          float scan = 0.72 + 0.28 * sin((uv.x + uv.y) * 38.0 + time * 1.3);
          float dots = dotShape * (0.48 + 0.52 * noise) * scan;

          float micro = hash(gl_FragCoord.xy + time) * 0.035;
          float alpha = clamp((glow * 1.55 + bloom * 0.50) * dots * rightFade, 0.0, 1.0);
          alpha *= 1.0 - centerDark * 0.56;

          vec3 base = vec3(0.005, 0.005, 0.005);
          vec3 finalColor = mix(base, col, clamp(alpha * 1.55, 0.0, 1.0));
          finalColor += micro * rightFade;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,B={speed:1,pointerAmount:1,smoothing:.035,brightness:1,opacity:1,hue:0,saturation:1};function I(r,f,u){const i=r.createShader(f);if(!i)throw new Error("Unable to create Axiom shader");if(r.shaderSource(i,u),r.compileShader(i),!r.getShaderParameter(i,r.COMPILE_STATUS))throw new Error(r.getShaderInfoLog(i)??"Axiom shader compilation failed");return i}function N({className:r="",...f}){const u=m.useRef(null),i=m.useRef(null),l=m.useRef({...B,...f});l.current={...B,...f},m.useEffect(()=>{const c=u.current,s=i.current;if(!c||!s)return;const e=s.getContext("webgl",{alpha:!0,antialias:!1,premultipliedAlpha:!1});if(!e)return;const b=I(e,e.VERTEX_SHADER,M),x=I(e,e.FRAGMENT_SHADER,U),t=e.createProgram();if(!t)return;if(e.attachShader(t,b),e.attachShader(t,x),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(t)??"Axiom program link failed");e.useProgram(t);const A=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,A),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const R=e.getAttribLocation(t,"position");e.enableVertexAttribArray(R),e.vertexAttribPointer(R,2,e.FLOAT,!1,0,0);const C=e.getUniformLocation(t,"resolution"),T=e.getUniformLocation(t,"time"),D=e.getUniformLocation(t,"pointer");let v=.72,p=.42,w=.72,E=.42,n=0,h=!0;const P=performance.now(),F=a=>{const o=c.getBoundingClientRect();w=.72+((a.clientX-o.left)/Math.max(o.width,1)-.72)*l.current.pointerAmount,E=.42+(1-(a.clientY-o.top)/Math.max(o.height,1)-.42)*l.current.pointerAmount},y=()=>{const a=c.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,2);s.width=Math.max(1,Math.floor(a.width*o)),s.height=Math.max(1,Math.floor(a.height*o)),e.viewport(0,0,s.width,s.height),e.uniform2f(C,s.width,s.height)},g=a=>{const o=l.current;v+=(w-v)*o.smoothing,p+=(E-p)*o.smoothing,e.uniform1f(T,(a-P)*.001*o.speed),e.uniform2f(D,v,p),e.drawArrays(e.TRIANGLES,0,6),n=h&&!document.hidden?requestAnimationFrame(g):0},S=new ResizeObserver(y),_=new IntersectionObserver(([a])=>{h=a?.isIntersecting??!0,h&&!n&&(n=requestAnimationFrame(g)),!h&&n&&(cancelAnimationFrame(n),n=0)});return S.observe(c),_.observe(c),c.addEventListener("pointermove",F,{passive:!0}),y(),n=requestAnimationFrame(g),()=>{n&&cancelAnimationFrame(n),S.disconnect(),_.disconnect(),c.removeEventListener("pointermove",F),e.deleteBuffer(A),e.deleteShader(b),e.deleteShader(x),e.deleteProgram(t)}},[]);const d=l.current;return L.jsx("div",{ref:u,className:`threeui-background ribbon-field${r?` ${r}`:""}`,children:L.jsx("canvas",{ref:i,style:{opacity:d.opacity,filter:`hue-rotate(${d.hue}deg) saturate(${d.saturation}) brightness(${d.brightness})`}})})}export{B as RIBBON_FIELD_DEFAULTS,N as RibbonFieldBackground};
