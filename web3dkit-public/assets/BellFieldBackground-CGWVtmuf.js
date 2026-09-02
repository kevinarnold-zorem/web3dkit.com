import{r as p,j as F}from"./index-fOQwe-l-.js";const Z=`
                attribute vec2 position;
                void main() { gl_Position = vec4(position, 0.0, 1.0); }
            `,ee=`
                precision highp float;
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform vec2 u_mouse;
                uniform float u_strike;

                #define PI 3.14159265359

                float hash(vec2 p) { return fract(sin(dot(p, vec2(23.71, 91.37))) * 41537.1234); }

                // damped-cosine stand-in for the Bessel envelope of a circular mode
                float bess(float x) { return cos(x - 0.785398) / sqrt(1.0 + abs(x)); }

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    vec2 p = uv * 2.0 - 1.0;
                    p.x *= u_resolution.x / u_resolution.y;
                    p.y += 0.08;

                    vec2 m = u_mouse / u_resolution.xy * 2.0 - 1.0;
                    m.y = -m.y;
                    m.x *= u_resolution.x / u_resolution.y;
                    p -= m * 0.11;

                    float t = u_time * 0.09;
                    float r = length(p);
                    float a = atan(p.y, p.x);

                    // the bell drifts between partials the way a struck bell does
                    float ang = 3.0 + 1.6 * sin(t * 0.37) + sin(t * 0.19 + 1.7);
                    float k   = 3.1 + 1.0 * sin(t * 0.23 + 0.6);

                    float amp = 1.0 + (1.0 - u_strike) * 0.55;
                    float f1 = bess(r * k * PI - t * 2.2) * cos(ang * a + t * 0.5);
                    float f2 = bess(r * k * 1.6 * PI + t * 1.4) * cos((ang * 2.0 + 1.0) * a - t * 0.31);
                    float f = (f1 + f2 * 0.30) * amp;

                    // nodal lines — where the metal stands still
                    float node = 1.0 - smoothstep(0.0, 0.075 + 0.075 * r, abs(f));
                    // antinodes — where it moves, and glows hot
                    float anti = smoothstep(0.40, 0.95, abs(f));

                    // the crown stays quiet — clears a reading zone under the type
                    float open = smoothstep(0.14, 0.92, r);
                    node *= open;
                    anti *= open;

                    vec3 deep   = vec3(0.031, 0.055, 0.051);
                    vec3 patina = vec3(0.306, 0.608, 0.541);
                    vec3 bronze = vec3(0.847, 0.608, 0.247);
                    vec3 ash    = vec3(0.937, 0.914, 0.863);

                    vec3 col = deep;
                    col = mix(col, patina, node * 0.50);
                    col = mix(col, bronze, anti * 0.22);
                    col += ash * pow(node, 3.0) * 0.13;

                    // shock ring travelling out from the strike
                    float ring = smoothstep(0.06, 0.0, abs(r - u_strike * 2.3)) * (1.0 - u_strike);
                    col += mix(bronze, ash, 0.4) * ring * 0.7;

                    col *= mix(0.10, 1.0, smoothstep(2.0, 0.28, r));
                    col += (hash(gl_FragCoord.xy) - 0.5) * 0.022;

                    gl_FragColor = vec4(col, 1.0);
                }
            `,X={speed:1,pointerAmount:1,strikeDuration:2400,emberAmount:1,brightness:1,opacity:1,hue:0,saturation:1};function Y(s,g,v){const c=s.createShader(g);if(!c)throw new Error("Unable to create Bell Field shader");if(s.shaderSource(c,v),s.compileShader(c),!s.getShaderParameter(c,s.COMPILE_STATUS))throw new Error(s.getShaderInfoLog(c)??"Bell Field shader compilation failed");return c}function oe({className:s="",...g}){const v=p.useRef(null),c=p.useRef(null),S=p.useRef(null),x=p.useRef({...X,...g});x.current={...X,...g},p.useEffect(()=>{const l=v.current,i=c.current,w=S.current;if(!l||!i||!w)return;const e=i.getContext("webgl"),d=w.getContext("2d");if(!e||!d)return;const I=Y(e,e.VERTEX_SHADER,Z),P=Y(e,e.FRAGMENT_SHADER,ee),r=e.createProgram();if(!r)return;if(e.attachShader(r,I),e.attachShader(r,P),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(r)??"Bell Field program link failed");e.useProgram(r);const T=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,T),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),e.STATIC_DRAW);const B=e.getAttribLocation(r,"position");e.enableVertexAttribArray(B),e.vertexAttribPointer(B,2,e.FLOAT,!1,0,0);const H=e.getUniformLocation(r,"u_resolution"),N=e.getUniformLocation(r,"u_time"),G=e.getUniformLocation(r,"u_mouse"),V=e.getUniformLocation(r,"u_strike");let a=1,m=1,f=1,_=.5,A=.5,R=.5,M=.5,u=0,y=!0,D=!1,U=-1e9;const K=performance.now(),C=Array.from({length:58},()=>({x:Math.random(),y:Math.random(),r:.4+Math.random()*1.4,vy:-(.1+Math.random()*.26),vx:(Math.random()-.5)*.08,ph:Math.random()*Math.PI*2,sp:.5+Math.random()*1.4,hot:Math.random()<.36})),z=()=>{const n=l.getBoundingClientRect();a=Math.max(1,n.width),m=Math.max(1,n.height),f=Math.min(window.devicePixelRatio||1,2),i.width=Math.max(1,Math.round(a*f)),i.height=Math.max(1,Math.round(m*f)),w.width=i.width,w.height=i.height,d.setTransform(f,0,0,f,0,0),e.viewport(0,0,i.width,i.height),e.uniform2f(H,i.width,i.height),D||(_=R=a*.5,A=M=m*.5,D=!0),C.forEach(o=>{o.x<=1&&(o.x*=a),o.y<=1&&(o.y*=m)})},$=n=>{const o=l.getBoundingClientRect(),h=x.current.pointerAmount;R=a*.5+(n.clientX-o.left-a*.5)*h,M=m*.5+(n.clientY-o.top-m*.5)*h},E=()=>{U=performance.now()},W=window.setTimeout(E,1700),J=window.setInterval(E,8200),L=n=>{const o=x.current,h=n*.001*o.speed;_+=(R-_)*.04,A+=(M-A)*.04,e.uniform1f(N,(n-K)*.001*o.speed),e.uniform1f(V,Math.min(1,Math.max(0,(n-U)/o.strikeDuration))),e.uniform2f(G,_*f,A*f),e.drawArrays(e.TRIANGLES,0,6),d.clearRect(0,0,a,m);const Q=Math.max(0,Math.min(58,Math.round(58*o.emberAmount)));for(let k=0;k<Q;k+=1){const t=C[k];t.y+=t.vy*o.speed,t.x+=(t.vx+Math.sin(h*t.sp*.5+t.ph)*.13)*o.speed,t.y<-4&&(t.y=m+4,t.x=Math.random()*a),t.x<-4&&(t.x=a+4),t.x>a+4&&(t.x=-4);const O=.5+.5*Math.sin(h*t.sp+t.ph);d.beginPath(),d.arc(t.x,t.y,t.r,0,Math.PI*2),d.fillStyle=t.hot?`rgba(231, 193, 101, ${.06+O*.34})`:`rgba(143, 203, 185, ${.04+O*.24})`,d.fill()}u=y&&!document.hidden?requestAnimationFrame(L):0},j=new ResizeObserver(z),q=new IntersectionObserver(([n])=>{y=n?.isIntersecting??!0,y&&!u&&(u=requestAnimationFrame(L)),!y&&u&&(cancelAnimationFrame(u),u=0)});return j.observe(l),q.observe(l),l.addEventListener("pointermove",$,{passive:!0}),l.addEventListener("pointerdown",E),z(),u=requestAnimationFrame(L),()=>{u&&cancelAnimationFrame(u),window.clearTimeout(W),window.clearInterval(J),j.disconnect(),q.disconnect(),l.removeEventListener("pointermove",$),l.removeEventListener("pointerdown",E),e.deleteBuffer(T),e.deleteShader(I),e.deleteShader(P),e.deleteProgram(r)}},[]);const b=x.current;return F.jsxs("div",{ref:v,className:`web3dkit-background bell-field${s?` ${s}`:""}`,style:{background:"#08100f",opacity:b.opacity,filter:`hue-rotate(${b.hue}deg) saturate(${b.saturation}) brightness(${b.brightness})`},children:[F.jsx("canvas",{ref:c,style:{zIndex:0}}),F.jsx("canvas",{ref:S,style:{zIndex:1,pointerEvents:"none"}})]})}export{X as BELL_FIELD_DEFAULTS,oe as BellFieldBackground};
