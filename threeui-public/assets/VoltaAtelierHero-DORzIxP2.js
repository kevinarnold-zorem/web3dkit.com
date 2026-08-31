import{r as a,j as k}from"./index-fOQwe-l-.js";const D=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Volta Atelier Hero</title>
    <style>
      :root {
        --ink: #141414;
        --ink-deep: #0d0d0d;
        --bone: #f4f3f0;
        --muted: #8e8e95;
        --dim: #5c5c63;
        --signal: #fb3732;
        --line: rgba(255, 255, 255, 0.11);
        --line-2: rgba(255, 255, 255, 0.2);
        --font-display: "Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono: "SFMono-Regular", Menlo, Consolas, monospace;
        --volta-heading-weight: 900;
        --volta-body-weight: 400;
        --volta-heading-size: 11.5rem;
        --volta-heading-mobile-size: 6rem;
        --volta-body-size: 13px;
        --volta-dock-size: 12px;
        --volta-bubble-size: 10.5px;
        --volta-scroll-size: 9px;
        --volta-heading-tracking: -.065em;
        --gut: clamp(18px, 3.4vw, 48px);
        --rail: clamp(58px, 7vw, 86px);
        --volta-scale: 1;
        --e-out: cubic-bezier(0.16, 1, 0.3, 1);
        --e-io: cubic-bezier(0.76, 0, 0.24, 1);
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
      body {
        background: var(--ink);
        color: var(--bone);
        font-family: var(--font-mono);
        font-weight: var(--volta-body-weight);
        -webkit-font-smoothing: antialiased;
      }
      img { display: block; max-width: 100%; }
      a { color: inherit; text-decoration: none; }
      ul, p, h1 { margin: 0; padding: 0; }
      ul { list-style: none; }

      .grain,
      .vignette {
        position: fixed;
        inset: 0;
        z-index: 30;
        pointer-events: none;
      }
      .grain {
        inset: -80px;
        opacity: 0.065;
        background-image:
          repeating-radial-gradient(circle at 34% 21%, transparent 0 1px, rgba(255,255,255,.28) 1px 1.6px, transparent 1.7px 4px),
          repeating-linear-gradient(117deg, transparent 0 3px, rgba(255,255,255,.12) 3.2px 3.7px);
        background-size: 120px 120px, 90px 90px;
        mix-blend-mode: overlay;
        animation: grain-shift 6s steps(6) infinite;
      }
      .vignette {
        z-index: 28;
        background: radial-gradient(125% 92% at 50% 45%, transparent 50%, rgba(0,0,0,.55) 100%);
      }
      @keyframes grain-shift {
        0%, 100% { transform: translate(0, 0); }
        33% { transform: translate(10px, -14px); }
        66% { transform: translate(-14px, 10px); }
      }

      #hero {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 100svh;
        overflow: hidden;
        display: grid;
        grid-template-rows: var(--rail) 1fr auto;
        background:
          linear-gradient(90deg, transparent 49.92%, rgba(255,255,255,.025) 50%, transparent 50.08%),
          linear-gradient(0deg, transparent 49.92%, rgba(255,255,255,.02) 50%, transparent 50.08%),
          var(--ink);
      }
      #dust { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; opacity: .55; pointer-events: none; }
      .hero-stage { position: relative; grid-row: 2; z-index: 2; }
      .hero-word { position: absolute; z-index: 3; pointer-events: none; user-select: none; }
      .hw-a { top: 0; left: var(--gut); }
      .hw-b { right: var(--gut); bottom: 0; }
      .d-mega {
        display: block;
        overflow: hidden;
        font-family: var(--font-display);
        font-weight: var(--volta-heading-weight);
        font-size: clamp(3.4rem, 13.2vw, var(--volta-heading-size));
        line-height: .82;
        letter-spacing: var(--volta-heading-tracking);
        text-transform: uppercase;
      }
      .d-mega > span {
        display: block;
        transform: translate3d(0, 108%, 0);
        transition: transform 1.08s var(--e-out) .08s;
      }
      .ready .d-mega > span { transform: none; }

      .collage { position: absolute; inset: 0; z-index: 4; display: grid; place-items: center; pointer-events: none; }
      .collage-in {
        position: relative;
        width: clamp(320px, 62vw, 880px);
        aspect-ratio: 1.7;
        transform: scale(var(--volta-scale));
        transform-style: preserve-3d;
        transition: transform .45s var(--e-out);
      }
      .tile {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: var(--w);
        height: var(--h);
        z-index: var(--zi);
        overflow: hidden;
        border-radius: 14px;
        box-shadow: 0 18px 44px -14px rgba(0,0,0,.72), 0 2px 8px rgba(0,0,0,.4);
        will-change: transform;
        backface-visibility: hidden;
      }
      .tile:nth-child(1) { --x: 0; --y: 2%; --w: 14%; --h: 42%; --zi: 9; }
      .tile:nth-child(2) { --x: 17.2%; --y: 6%; --w: 14%; --h: 40%; --zi: 14; }
      .tile:nth-child(3) { --x: 34.4%; --y: 0; --w: 14%; --h: 44%; --zi: 22; }
      .tile:nth-child(4) { --x: 51.6%; --y: 5%; --w: 14%; --h: 41%; --zi: 13; }
      .tile:nth-child(5) { --x: 68.8%; --y: 1%; --w: 14%; --h: 43%; --zi: 18; }
      .tile:nth-child(6) { --x: 86%; --y: 6%; --w: 14%; --h: 40%; --zi: 8; }
      .tile:nth-child(7) { --x: 8.6%; --y: 52%; --w: 14%; --h: 42%; --zi: 19; }
      .tile:nth-child(8) { --x: 25.8%; --y: 56%; --w: 14%; --h: 40%; --zi: 11; }
      .tile:nth-child(9) { --x: 43%; --y: 51%; --w: 14%; --h: 44%; --zi: 12; }
      .tile:nth-child(10) { --x: 60.2%; --y: 55%; --w: 14%; --h: 41%; --zi: 15; }
      .tile:nth-child(11) { --x: 77.4%; --y: 52%; --w: 14%; --h: 43%; --zi: 10; }
      .tile img { width: 100%; height: 100%; object-fit: cover; }
      .tile::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.11);
      }

      .hero-list,
      .hero-meta,
      .hero-dock { opacity: 0; transform: translateY(18px); transition: opacity .85s var(--e-out) .35s, transform .9s var(--e-out) .35s; }
      .ready .hero-list,
      .ready .hero-meta,
      .ready .hero-dock { opacity: 1; transform: none; }
      .hero-list { position: absolute; left: var(--gut); bottom: 0; z-index: 7; }
      .hero-list li { color: var(--muted); font-size: clamp(10px, .88vw, var(--volta-body-size)); line-height: 2.05; }
      .hero-meta { position: absolute; right: var(--gut); top: 0; z-index: 7; text-align: right; }
      .mono-sm { color: var(--muted); font-size: clamp(10px, .86vw, var(--volta-body-size)); line-height: 1.72; }
      .hero-meta .dim { color: var(--dim); }

      .dock {
        display: inline-flex;
        align-items: center;
        gap: .72em;
        position: relative;
        padding: .5em .95em .5em .5em;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 14px;
        background: #0a0a0b;
        box-shadow: 0 16px 40px -16px rgba(0,0,0,.9);
        animation: dock-float 6.5s ease-in-out infinite;
      }
      @keyframes dock-float { 50% { transform: translateY(-7px); } }
      .dock-av { width: 46px; height: 46px; flex: none; overflow: hidden; border-radius: 10px; background: #ffa31a; }
      .dock-av img { width: 100%; height: 100%; object-fit: cover; }
      .dock p { color: var(--bone); font-size: clamp(9px, .76vw, var(--volta-dock-size)); line-height: 1.5; }
      .hero-dock { position: absolute; right: calc(var(--gut) + 2vw); bottom: 26%; z-index: 8; }
      .bubble {
        position: absolute;
        left: -42%;
        bottom: 78%;
        padding: .55em .8em;
        border-radius: 9px 9px 9px 2px;
        background: var(--signal);
        color: #fff;
        font-size: clamp(8px, .68vw, var(--volta-bubble-size));
        line-height: 1.42;
        white-space: nowrap;
        transform: scale(.6) translateY(8px);
        transform-origin: bottom left;
        opacity: 0;
        transition: transform .55s cubic-bezier(.34,1.56,.64,1), opacity .35s ease;
      }
      .bubble.show { transform: none; opacity: 1; }
      .bubble::after { content: ""; position: absolute; left: 2px; top: 100%; border: 6px solid transparent; border-top-color: var(--signal); border-right-width: 9px; border-left-width: 0; }

      .scrollcue { grid-row: 3; z-index: 6; display: flex; flex-direction: column; align-items: center; gap: 9px; padding-bottom: 20px; }
      .scrollcue span { color: var(--dim); font-size: var(--volta-scroll-size); letter-spacing: .24em; text-transform: uppercase; }
      .scrollcue i { position: relative; display: block; width: 1px; height: 34px; overflow: hidden; background: var(--line-2); }
      .scrollcue i::after { content: ""; position: absolute; inset: 0; background: var(--bone); animation: cue-run 2.1s var(--e-io) infinite; }
      @keyframes cue-run { 0% { transform: translateY(-100%); } 55%, 100% { transform: translateY(100%); } }

      @media (max-width: 900px) {
        .hero-dock { display: none; }
      }
      /* below 820px the band stands up: three rows instead of two */
      @media (max-width: 820px) {
        .collage-in { width: min(88vw, 420px); aspect-ratio: 1/1.15; }
        .tile:nth-child(1) { --x: 0; --y: 0; --w: 22%; --h: 28%; }
        .tile:nth-child(2) { --x: 26%; --y: 3%; --w: 22%; --h: 28%; }
        .tile:nth-child(3) { --x: 52%; --y: 1%; --w: 22%; --h: 28%; }
        .tile:nth-child(4) { --x: 78%; --y: 4%; --w: 22%; --h: 28%; }
        .tile:nth-child(5) { --x: 0; --y: 36%; --w: 22%; --h: 28%; }
        .tile:nth-child(6) { --x: 26%; --y: 39%; --w: 22%; --h: 28%; }
        .tile:nth-child(7) { --x: 52%; --y: 35%; --w: 22%; --h: 28%; }
        .tile:nth-child(8) { --x: 78%; --y: 38%; --w: 22%; --h: 28%; }
        .tile:nth-child(9) { --x: 13%; --y: 71%; --w: 22%; --h: 27%; }
        .tile:nth-child(10) { --x: 39%; --y: 74%; --w: 22%; --h: 27%; }
        .tile:nth-child(11) { --x: 65%; --y: 72%; --w: 22%; --h: 27%; }
      }
      @media (max-width: 640px) {
        .hero-meta { top: -8px; }
        .hero-list { bottom: -4px; }
        .hw-a { top: 2vh; }
        .hw-b { bottom: 2vh; }
        .d-mega { font-size: clamp(3.2rem, 17vw, var(--volta-heading-mobile-size)); }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; }
      }
    </style>
  </head>
  <body>
    <div class="grain" aria-hidden="true"></div>
    <div class="vignette" aria-hidden="true"></div>
    <section id="hero" aria-label="Volta Atelier hero section">
      <canvas id="dust" aria-hidden="true"></canvas>
      <div class="hero-stage">
        <div class="hero-word hw-a"><h1 class="d-mega"><span>Volta</span></h1></div>
        <div class="hero-word hw-b"><span class="d-mega"><span>Atelier</span></span></div>

        <div class="collage" aria-hidden="true">
          <div class="collage-in" id="collage">
            <div class="tile" data-z=".35" data-phase="0"><img src="__VOLTA_ASSET_01__" alt="" /></div>
            <div class="tile" data-z=".62" data-phase=".83"><img src="__VOLTA_ASSET_02__" alt="" /></div>
            <div class="tile" data-z="1" data-phase="1.66"><img src="__VOLTA_ASSET_03__" alt="" /></div>
            <div class="tile" data-z=".55" data-phase="2.49"><img src="__VOLTA_ASSET_04__" alt="" /></div>
            <div class="tile" data-z=".78" data-phase="3.32"><img src="__VOLTA_ASSET_05__" alt="" /></div>
            <div class="tile" data-z=".3" data-phase="4.15"><img src="__VOLTA_ASSET_06__" alt="" /></div>
            <div class="tile" data-z=".85" data-phase="4.98"><img src="__VOLTA_ASSET_07__" alt="" /></div>
            <div class="tile" data-z=".44" data-phase="5.81"><img src="__VOLTA_ASSET_08__" alt="" /></div>
            <div class="tile" data-z=".5" data-phase="6.64"><img src="__VOLTA_ASSET_09__" alt="" /></div>
            <div class="tile" data-z=".66" data-phase="7.47"><img src="__VOLTA_ASSET_10__" alt="" /></div>
            <div class="tile" data-z=".4" data-phase="8.3"><img src="__VOLTA_ASSET_01__" alt="" /></div>
          </div>
        </div>

        <ul class="hero-list">
          <li>Brand systems</li>
          <li>Interface design</li>
          <li>Real-time 3D</li>
        </ul>

        <div class="hero-meta">
          <p class="mono-sm">Based in Porto, PT</p>
          <p class="mono-sm dim"><span id="clock">00:00:00</span> WEST</p>
          <p class="mono-sm dim">Booking Q1 2027</p>
        </div>

        <div class="hero-dock">
          <div class="dock">
            <span class="bubble" id="bubble">Hey — Nils here.<br />Got a brief?</span>
            <span class="dock-av"><img src="__VOLTA_ASSET_07__" alt="" /></span>
            <p>Speak to a producer,<br />not a contact form</p>
          </div>
        </div>
      </div>

      <div class="scrollcue" aria-hidden="true"><i></i><span>Scroll</span></div>
    </section>

    <script>
      (() => {
        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        const lerp = (a, b, amount) => a + (b - a) * amount;
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const headingFonts = {
          "arial-black": { stack: '"Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif' },
          "instrument-serif": { stack: '"Instrument Serif", Georgia, serif', google: "Instrument+Serif" },
          newsreader: { stack: '"Newsreader", Georgia, serif', google: "Newsreader:wght@200..700" },
          geist: { stack: '"Geist", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif', google: "Geist:wght@100..900" },
        };
        const bodyFonts = {
          sfmono: { stack: '"SFMono-Regular", Menlo, Consolas, monospace' },
          geist: headingFonts.geist,
          newsreader: headingFonts.newsreader,
          "instrument-serif": headingFonts["instrument-serif"],
        };
        const headingWeights = ["400", "500", "600", "700", "800", "900"];
        const bodyWeights = ["300", "400", "500", "600", "700"];
        const controls = window.__VOLTA_HERO_CONTROLS = {
          headingFont: "arial-black",
          bodyFont: "sfmono",
          headingWeight: "900",
          bodyWeight: "400",
          primaryColor: "#fb3732",
          headingSize: 11.5,
          bodySize: 13,
          headingLetterSpacing: -.065,
          speed: 1,
          scale: 1,
          paused: false,
        };
        const pointer = { x: innerWidth / 2, y: innerHeight / 2, sx: innerWidth / 2, sy: innerHeight / 2, nx: 0, ny: 0 };
        const collage = document.getElementById("collage");
        const tiles = Array.from(document.querySelectorAll(".tile")).map((element) => ({
          element,
          z: Number(element.dataset.z || .5),
          phase: Number(element.dataset.phase || 0),
          x: 0,
          y: 0,
          rotation: 0,
        }));
        let frame = 0;
        let last = performance.now();
        let elapsed = 0;

        addEventListener("pointermove", (event) => {
          pointer.x = event.clientX;
          pointer.y = event.clientY;
        }, { passive: true });

        function updateTypography(next) {
          controls.headingFont = headingFonts[next.headingFont] ? next.headingFont : "arial-black";
          controls.bodyFont = bodyFonts[next.bodyFont] ? next.bodyFont : "sfmono";
          controls.headingWeight = headingWeights.includes(String(next.headingWeight)) ? String(next.headingWeight) : "900";
          controls.bodyWeight = bodyWeights.includes(String(next.bodyWeight)) ? String(next.bodyWeight) : "400";
          controls.primaryColor = typeof next.primaryColor === "string" && /^#[\\da-f]{6}$/i.test(next.primaryColor) ? next.primaryColor.toLowerCase() : "#fb3732";
          controls.headingSize = Number.isFinite(next.headingSize) ? clamp(next.headingSize, 6, 16) : 11.5;
          controls.bodySize = Number.isFinite(next.bodySize) ? clamp(next.bodySize, 10, 24) : 13;
          controls.headingLetterSpacing = Number.isFinite(next.headingLetterSpacing) ? clamp(next.headingLetterSpacing, -.12, .12) : -.065;

          const root = document.documentElement.style;
          root.setProperty("--font-display", headingFonts[controls.headingFont].stack);
          root.setProperty("--font-mono", bodyFonts[controls.bodyFont].stack);
          root.setProperty("--volta-heading-weight", controls.headingWeight);
          root.setProperty("--volta-body-weight", controls.bodyWeight);
          root.setProperty("--signal", controls.primaryColor);
          root.setProperty("--volta-heading-size", \`\${controls.headingSize}rem\`);
          root.setProperty("--volta-heading-mobile-size", \`\${Number((controls.headingSize * 6 / 11.5).toFixed(3))}rem\`);
          root.setProperty("--volta-body-size", \`\${controls.bodySize}px\`);
          root.setProperty("--volta-dock-size", \`\${Number((controls.bodySize * 12 / 13).toFixed(3))}px\`);
          root.setProperty("--volta-bubble-size", \`\${Number((controls.bodySize * 10.5 / 13).toFixed(3))}px\`);
          root.setProperty("--volta-scroll-size", \`\${Number((controls.bodySize * 9 / 13).toFixed(3))}px\`);
          root.setProperty("--volta-heading-tracking", \`\${controls.headingLetterSpacing}em\`);

          const families = [...new Set([
            headingFonts[controls.headingFont].google,
            bodyFonts[controls.bodyFont].google,
          ].filter(Boolean))];
          const existing = document.getElementById("volta-hero-fonts");
          if (!families.length) {
            existing?.remove();
          } else {
            const link = existing || document.createElement("link");
            link.id = "volta-hero-fonts";
            link.rel = "stylesheet";
            link.href = \`https://fonts.googleapis.com/css2?\${families.map((family) => \`family=\${family}\`).join("&")}&display=swap\`;
            if (!existing) document.head.append(link);
          }
        }

        addEventListener("message", (event) => {
          if (event.source !== window.parent) return;
          if (!event.data || event.data.type !== "volta-hero-controls") return;
          const next = event.data.controls || {};
          updateTypography(next);
          if (Number.isFinite(next.speed)) controls.speed = clamp(next.speed, 0, 2.5);
          if (Number.isFinite(next.scale)) controls.scale = clamp(next.scale, .72, 1.28);
          controls.paused = Boolean(next.paused);
          document.documentElement.style.setProperty("--volta-scale", String(controls.scale));
        });

        function animate(now) {
          const delta = Math.min((now - last) / 1000, .05);
          last = now;
          if (!controls.paused) elapsed += delta * controls.speed;

          pointer.sx = lerp(pointer.sx, pointer.x, .1);
          pointer.sy = lerp(pointer.sy, pointer.y, .1);
          pointer.nx = (pointer.sx / Math.max(1, innerWidth)) * 2 - 1;
          pointer.ny = (pointer.sy / Math.max(1, innerHeight)) * 2 - 1;

          if (!reduced && !controls.paused) {
            tiles.forEach((tile) => {
              const rect = tile.element.getBoundingClientRect();
              const dx = rect.left + rect.width / 2 - pointer.sx;
              const dy = rect.top + rect.height / 2 - pointer.sy;
              const distance = Math.hypot(dx, dy) || 1;
              const force = clamp(1 - distance / 300, 0, 1);
              const push = force * force * 32 * (.5 + tile.z);
              const targetX = dx / distance * push + pointer.nx * -18 * tile.z + Math.sin(elapsed * .42 + tile.phase) * 4.5 * (.4 + tile.z);
              const targetY = dy / distance * push + pointer.ny * -18 * tile.z + Math.cos(elapsed * .35 + tile.phase * 1.3) * 5.5 * (.4 + tile.z);
              const targetRotation = dx / distance * force * 7 * (.4 + tile.z);
              tile.x = lerp(tile.x, targetX, .075);
              tile.y = lerp(tile.y, targetY, .075);
              tile.rotation = lerp(tile.rotation, targetRotation, .075);
              tile.element.style.transform = \`translate3d(\${tile.x.toFixed(2)}px, \${tile.y.toFixed(2)}px, 0) rotate(\${tile.rotation.toFixed(2)}deg)\`;
            });
          }
          frame = requestAnimationFrame(animate);
        }

        const dust = document.getElementById("dust");
        const dustContext = dust.getContext("2d");
        let particles = [];
        function resizeDust() {
          const ratio = Math.min(devicePixelRatio || 1, 2);
          dust.width = Math.round(innerWidth * ratio);
          dust.height = Math.round(innerHeight * ratio);
          dustContext.setTransform(ratio, 0, 0, ratio, 0, 0);
          particles = Array.from({ length: clamp(Math.round(innerWidth * innerHeight / 16000), 40, 150) }, (_, index) => ({
            x: ((index * 73) % 997) / 997 * innerWidth,
            y: ((index * 151) % 991) / 991 * innerHeight,
            radius: .45 + (index % 7) * .18,
            alpha: .1 + (index % 9) * .035,
            phase: index * .63,
          }));
        }
        function drawDust(now) {
          if (!reduced && !controls.paused) {
            dustContext.clearRect(0, 0, innerWidth, innerHeight);
            const time = now / 1000 * controls.speed;
            particles.forEach((particle) => {
              particle.y -= .09 * controls.speed;
              if (particle.y < -5) particle.y = innerHeight + 5;
              dustContext.globalAlpha = particle.alpha * (.65 + .35 * Math.sin(time + particle.phase));
              dustContext.fillStyle = "#fff";
              dustContext.beginPath();
              dustContext.arc(particle.x + Math.sin(time * .5 + particle.phase) * 3, particle.y, particle.radius, 0, Math.PI * 2);
              dustContext.fill();
            });
            dustContext.globalAlpha = 1;
          }
          requestAnimationFrame(drawDust);
        }

        function tickClock() {
          document.getElementById("clock").textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/Lisbon", hour12: false });
        }

        resizeDust();
        addEventListener("resize", resizeDust);
        document.addEventListener("visibilitychange", () => { controls.paused = document.hidden; });
        requestAnimationFrame(() => document.documentElement.classList.add("ready"));
        requestAnimationFrame(animate);
        requestAnimationFrame(drawDust);
        tickClock();
        setInterval(tickClock, 1000);
        setTimeout(() => document.getElementById("bubble").classList.add("show"), 1400);
      })();
    <\/script>
  </body>
</html>
`,I=[new URL("/assets/volta-01-BGN2snA-.webp",import.meta.url).href,new URL("/assets/volta-02-Dg7Lc4TJ.webp",import.meta.url).href,new URL("/assets/volta-03-ZpxTuAFz.webp",import.meta.url).href,new URL("/assets/volta-04-Coe5k9_Z.webp",import.meta.url).href,new URL("/assets/volta-05-DVh8aWPZ.webp",import.meta.url).href,new URL("/assets/volta-06-CHttjk5X.webp",import.meta.url).href,new URL("/assets/volta-07-BQbwMMio.webp",import.meta.url).href,new URL("/assets/volta-08-HlM194rL.webp",import.meta.url).href,new URL("/assets/volta-09-9tTXri4B.webp",import.meta.url).href,new URL("/assets/volta-10-DhmJyW5K.webp",import.meta.url).href],e={headingFont:"arial-black",bodyFont:"sfmono",headingWeight:"900",bodyWeight:"400",primaryColor:"#fb3732",headingSize:11.5,bodySize:13,headingLetterSpacing:-.065,speed:1,scale:1,opacity:1,hue:0,saturation:1,brightness:1},U=["arial-black","instrument-serif","newsreader","geist"],G=["sfmono","geist","newsreader","instrument-serif"],Y=["400","500","600","700","800","900"],j=["300","400","500","600","700"];function o(n,i,t){return Math.min(t,Math.max(i,n))}function d(n,i,t){return i.includes(n)?n:t}function q(n,i){const t=n.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);if(!t)return i;const r=t[1].toLowerCase();return`#${r.length===3?r.replace(/./g,l=>l+l):r}`}function X(){return I.reduce((n,i,t)=>n.replaceAll(`__VOLTA_ASSET_${String(t+1).padStart(2,"0")}__`,i),D)}function J({headingFont:n=e.headingFont,bodyFont:i=e.bodyFont,headingWeight:t=e.headingWeight,bodyWeight:r=e.bodyWeight,primaryColor:l=e.primaryColor,headingSize:A=e.headingSize,bodySize:L=e.bodySize,headingLetterSpacing:F=e.headingLetterSpacing,speed:E=e.speed,scale:T=e.scale,opacity:V=e.opacity,hue:W=e.hue,saturation:C=e.saturation,brightness:H=e.brightness,className:m="",style:O}){const c=a.useRef(null),[M,R]=a.useState(!0),[B,N]=a.useState(()=>typeof document>"u"||!document.hidden),$=a.useMemo(X,[]),h=o(E,0,2.5),g=o(T,.72,1.28),u=d(n,U,e.headingFont),b=d(i,G,e.bodyFont),f=d(t,Y,e.headingWeight),x=d(r,j,e.bodyWeight),v=q(l,e.primaryColor),y=o(A,6,16),w=o(L,10,24),z=o(F,-.12,.12),_=!M||!B||h===0,p=a.useCallback(()=>{c.current?.contentWindow?.postMessage({type:"volta-hero-controls",controls:{headingFont:u,bodyFont:b,headingWeight:f,bodyWeight:x,primaryColor:v,headingSize:y,bodySize:w,headingLetterSpacing:z,speed:h,scale:g,paused:_}},"*")},[_,b,w,x,u,z,y,f,v,g,h]);return a.useEffect(()=>{const s=c.current;if(!s||typeof IntersectionObserver>"u")return;const S=new IntersectionObserver(([P])=>R(P?.isIntersecting??!0));return S.observe(s),()=>S.disconnect()},[]),a.useEffect(()=>{if(typeof document>"u")return;const s=()=>N(!document.hidden);return document.addEventListener("visibilitychange",s),()=>document.removeEventListener("visibilitychange",s)},[]),a.useEffect(()=>{p()},[p]),k.jsx("div",{className:`threeui-background volta-atelier-hero${m?` ${m}`:""}`,role:"img","aria-label":"Volta Atelier creative studio hero section",style:{background:"#141414",pointerEvents:"auto",...O},children:k.jsx("iframe",{ref:c,title:"Volta Atelier interactive studio hero",srcDoc:$,sandbox:"allow-scripts",onLoad:p,style:{position:"absolute",inset:0,display:"block",width:"100%",height:"100%",border:0,background:"#141414",opacity:o(V,.05,1),filter:`hue-rotate(${o(W,-180,180)}deg) saturate(${o(C,0,2)}) brightness(${o(H,.35,1.65)})`}})})}export{e as VOLTA_ATELIER_HERO_DEFAULTS,J as VoltaAtelierHero};
