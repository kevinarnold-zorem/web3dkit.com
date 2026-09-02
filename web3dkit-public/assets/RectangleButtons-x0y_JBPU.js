const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/LumenCta-CkTxfLO-.js","assets/index-ChUl42DD.js","assets/index-x9bNS8sK.css","assets/LumenCta-DrIkYxHz.css","assets/NeuformIsolatedEffects-BsNsJI8b.js"])))=>i.map(i=>d[i]);
import{j as e,r as a,_ as r}from"./index-ChUl42DD.js";import{DarkGlassButton as d}from"./SectionElements-Cndq72u2.js";const b=a.lazy(()=>r(()=>import("./LumenCta-CkTxfLO-.js"),__vite__mapDeps([0,1,2,3])).then(t=>({default:t.LumenCta}))),p={"launch-button":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.LaunchButton}))),"dot-border-button":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.DotBorderButton}))),"floating-dots-cta":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.FloatingDotsCta}))),"sliding-text-cta":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.SlidingTextCta}))),"gradient-beam-cta":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.GradientBeamCta}))),"gradient-pill-button":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.GradientPillButton}))),"generate-button":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.GenerateButton}))),"glassmorphism-cta":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.GlassmorphismCta}))),"spinning-border-button":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.SpinningBorderButton}))),"gradient-cta":a.lazy(()=>r(()=>import("./NeuformIsolatedEffects-BsNsJI8b.js"),__vite__mapDeps([4,1,2])).then(t=>({default:t.GradientCta})))},h=new Set(["trochil-signal","attune-thermal","tideform-outline","understory-arrow-pill","meridian-keycap-primary","meridian-keycap-secondary","halvorsen-arrow-pill","aster-glass-access","aster-glass-arrow"]);function l(t){return h.has(t)}const c=`
.web3dkit-page-button-stage {
  --web3dkit-page-ink: #fff;
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 240px;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  background: #050505;
  color: var(--web3dkit-page-ink);
  font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.web3dkit-page-button-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.web3dkit-page-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
}
.web3dkit-page-button:focus-visible {
  outline: 2px solid var(--web3dkit-page-ink);
  outline-offset: 5px;
}
.web3dkit-page-button-stage--trochil {
  background: #030303;
}
.web3dkit-page-button-stage--trochil::before {
  background: radial-gradient(circle at 71% 49%, rgba(251, 215, 54, .18), transparent 31%);
  opacity: .72;
}
.web3dkit-page-button--trochil {
  height: 52px;
  padding: 0 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .27);
  background: linear-gradient(180deg, rgba(255, 255, 255, .07), rgba(0, 0, 0, .36));
  box-shadow: 0 15px 36px rgba(0, 0, 0, .48), inset 0 1px rgba(255, 255, 255, .08);
  color: rgba(255, 255, 255, .82);
  font-size: 14px;
  font-weight: 500;
  transition: border-color .28s ease, color .28s ease, transform .28s ease, box-shadow .28s ease;
}
.web3dkit-page-button--trochil::before {
  content: "";
  position: absolute;
  inset: -1px;
  background: linear-gradient(105deg, transparent 17%, rgba(251, 215, 54, .25) 48%, transparent 76%);
  transform: translateX(-125%);
  transition: transform .65s cubic-bezier(.22, .61, .36, 1);
}
.web3dkit-page-button--trochil span { position: relative; }
.web3dkit-page-button--trochil:hover {
  border-color: rgba(251, 215, 54, .58);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, .58), 0 0 24px rgba(251, 215, 54, .12);
}
.web3dkit-page-button--trochil:hover::before { transform: translateX(125%); }
.web3dkit-page-button-stage--attune {
  background: #070709;
}
.web3dkit-page-button-stage--attune::before {
  background: radial-gradient(circle at 50% 50%, rgba(255, 122, 20, .12), transparent 32%);
}
.web3dkit-page-button--attune {
  gap: 10px;
  height: 52px;
  padding: 0 22px;
  border-radius: 11px;
  background: linear-gradient(180deg, #ffa347 0%, #ff7a14 48%, #f2610a 100%);
  box-shadow: inset 0 1px rgba(255, 255, 255, .26), 0 8px 28px rgba(255, 122, 20, .28);
  color: #1a0e04;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: .012em;
  transition: filter .18s ease, transform .18s ease, box-shadow .18s ease;
}
.web3dkit-page-button--attune svg { width: 8px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.7; }
.web3dkit-page-button--attune:hover { filter: brightness(1.09); transform: translateY(-2px); box-shadow: inset 0 1px rgba(255, 255, 255, .34), 0 12px 34px rgba(255, 122, 20, .36); }
.web3dkit-page-button--attune:active { transform: translateY(1px); }
.web3dkit-page-button-stage--tideform {
  background: #16181a;
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
}
.web3dkit-page-button-stage--tideform::before {
  background: radial-gradient(ellipse at 76% 44%, rgba(255, 122, 24, .12), transparent 34%);
}
.web3dkit-page-button--tideform {
  gap: 18px;
  padding: 17px 24px;
  border: 1px solid rgba(255, 255, 255, .22);
  background: rgba(255, 255, 255, .055);
  box-shadow: inset 0 1px rgba(255, 255, 255, .035);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  transition: border-color .25s ease, background-color .25s ease, color .25s ease;
}
.web3dkit-page-button--tideform svg { width: 21px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.25; transition: transform .25s cubic-bezier(.2, .8, .2, 1); }
.web3dkit-page-button--tideform:hover { border-color: #ff7a18; color: #ff7a18; background: rgba(255, 122, 24, .14); }
.web3dkit-page-button--tideform:hover svg { transform: translateX(4px); }
.web3dkit-page-button-stage--understory {
  --web3dkit-page-ink: #27222d;
  background: #f2efe7;
  color: #27222d;
}
.web3dkit-page-button-stage--understory::before {
  background: none;
}
.web3dkit-page-button--arrow-pill {
  gap: 18px;
  height: 54px;
  padding: 0 11px 0 36px;
  border-radius: 999px;
  font-size: 17px;
  letter-spacing: -.005em;
  transition: background .3s ease, transform .3s ease, color .3s ease;
}
.web3dkit-page-button--arrow-pill .web3dkit-page-button__disc {
  display: grid;
  width: 32px;
  height: 32px;
  flex: none;
  place-items: center;
  border-radius: 50%;
}
.web3dkit-page-button--arrow-pill svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2; transition: transform .3s ease; }
.web3dkit-page-button--arrow-pill:hover { transform: translateY(-2px); }
.web3dkit-page-button--arrow-pill:hover svg { transform: translateX(2px); }
.web3dkit-page-button--understory {
  background: #9b78d0;
  color: #fff;
  box-shadow: 0 14px 30px rgba(82, 53, 112, .18);
}
.web3dkit-page-button--understory .web3dkit-page-button__disc { background: #f6f3ed; color: #9b78d0; }
.web3dkit-page-button--understory:hover { background: #8d69c5; }
.web3dkit-page-button-stage--halvorsen {
  background: #111113;
}
.web3dkit-page-button-stage--halvorsen::before {
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, .06), transparent 35%);
}
.web3dkit-page-button--halvorsen {
  background: #f0eee7;
  color: #111113;
  box-shadow: 0 14px 34px rgba(0, 0, 0, .32);
}
.web3dkit-page-button--halvorsen .web3dkit-page-button__disc { background: #111113; color: #f0eee7; }
.web3dkit-page-button--halvorsen:hover { background: #fff; }
.web3dkit-page-button-stage--meridian {
  background: #04070d;
}
.web3dkit-page-button-stage--meridian::before {
  background: radial-gradient(circle at 50% 44%, rgba(77, 163, 255, .13), transparent 34%);
}
.web3dkit-page-button--meridian {
  height: 62px;
  padding: 0 30px;
  border-radius: 15px;
  flex-shrink: 0;
  background: #0c1017;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .07);
}
.web3dkit-page-button--meridian::before {
  content: "";
  position: absolute;
  inset: 3px 4px 9px;
  border-radius: 12px;
  background: linear-gradient(180deg, #2a3142, #1c2230);
  box-shadow: 0 5px 0 #080b11, 0 9px 15px -2px rgba(0, 0, 0, .62), inset 0 1px rgba(255, 255, 255, .11);
  transition: transform .13s cubic-bezier(.22, .61, .36, 1), box-shadow .13s cubic-bezier(.22, .61, .36, 1);
}
.web3dkit-page-button--meridian > span:not(.web3dkit-page-button__led) {
  position: relative;
  z-index: 1;
  color: #dde5f2;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -.005em;
}
.web3dkit-page-button--meridian .web3dkit-page-button__led {
  position: absolute;
  z-index: 1;
  top: 12px;
  left: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .16);
  transform: translateX(-50%);
  transition: background .22s ease, box-shadow .22s ease;
}
.web3dkit-page-button--meridian:hover::before { transform: translateY(4px); box-shadow: 0 1px 0 #080b11, 0 3px 8px -2px rgba(0, 0, 0, .55), inset 0 1px rgba(255, 255, 255, .11); }
.web3dkit-page-button--meridian:hover .web3dkit-page-button__led { background: #4da3ff; box-shadow: 0 0 7px #4da3ff; }
.web3dkit-page-button--meridian-primary { background: #050f1c; box-shadow: inset 0 0 0 1px rgba(77, 163, 255, .22); }
.web3dkit-page-button--meridian-primary::before { background: linear-gradient(180deg, #6db6ff, #2e85e8); box-shadow: 0 5px 0 #0b4a86, 0 9px 18px -2px rgba(21, 88, 158, .5), inset 0 1px rgba(255, 255, 255, .5); }
.web3dkit-page-button--meridian-primary > span:not(.web3dkit-page-button__led) { color: #04182f; }
.web3dkit-page-button--meridian-primary .web3dkit-page-button__led { background: rgba(4, 24, 47, .3); }
.web3dkit-page-button--meridian-primary:hover::before { box-shadow: 0 1px 0 #0b4a86, 0 3px 10px -2px rgba(21, 88, 158, .45), inset 0 1px rgba(255, 255, 255, .5); }
.web3dkit-page-button--meridian-primary:hover .web3dkit-page-button__led { background: #04182f; box-shadow: 0 0 6px rgba(4, 24, 47, .55); }
.web3dkit-page-button-stage--aster {
  background: #101010;
  font-family: "Roboto Flex", "Arial Narrow", Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.web3dkit-page-button-stage--aster::before {
  background:
    radial-gradient(circle at 64% 42%, rgba(255, 255, 255, .07), transparent 21%),
    radial-gradient(circle at 38% 62%, rgba(255, 255, 255, .035), transparent 27%);
}
.web3dkit-page-button--aster {
  height: 52px;
  border-radius: 12px;
  isolation: isolate;
  background: rgba(255, 255, 255, .055);
  color: #f1f1f1;
  font-size: 17px;
  font-variation-settings: "wdth" 100, "opsz" 14;
  letter-spacing: -.004em;
  box-shadow: 0 12px 34px -22px rgba(255, 255, 255, .35);
  backdrop-filter: blur(16px) saturate(1.25);
  -webkit-backdrop-filter: blur(16px) saturate(1.25);
  transition: transform .5s cubic-bezier(.22, 1, .36, 1), background .4s ease, color .4s ease, box-shadow .5s cubic-bezier(.22, 1, .36, 1);
}
.web3dkit-page-button--aster::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(148deg, rgba(255, 255, 255, .72), rgba(255, 255, 255, .16) 34%, rgba(255, 255, 255, .05) 58%, rgba(255, 255, 255, .34));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: filter .45s cubic-bezier(.22, 1, .36, 1);
}
.web3dkit-page-button--aster::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, .13), transparent 46%);
  pointer-events: none;
}
.web3dkit-page-button--aster > span { position: relative; z-index: 1; }
.web3dkit-page-button--aster:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, .15);
  color: #fff;
  box-shadow: 0 8px 26px -12px rgba(255, 255, 255, .42);
}
.web3dkit-page-button--aster:hover::before { filter: brightness(1.55); }
.web3dkit-page-button--aster:active { transform: translateY(0); }
.web3dkit-page-button--aster-access { padding: 0 31px; }
.web3dkit-page-button--aster-arrow { gap: 17px; padding: 0 7px 0 22px; }
.web3dkit-page-button--aster-arrow .web3dkit-page-button__chip {
  display: grid;
  width: 34px;
  height: 34px;
  flex: none;
  place-items: center;
  border-radius: 9px;
  background: rgba(255, 255, 255, .10);
}
.web3dkit-page-button--aster-arrow .web3dkit-page-button__chip::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(150deg, rgba(255, 255, 255, .75), rgba(255, 255, 255, .10) 62%, rgba(255, 255, 255, .42));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
}
.web3dkit-page-button--aster-arrow svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .5s cubic-bezier(.22, 1, .36, 1);
}
.web3dkit-page-button--aster-arrow:hover svg { transform: translateX(2px); }

/* ---------------------------------------------------------------- *
   The other ground

   Eight of these treatments were drawn on their page's dark ground and
   Understory on its paper one, so the opposite mode is a re-tone rather
   than a wash: the stage takes the other ground, and every value that
   ground would swallow — edge, ink, sheen, cast shadow — is restated at
   the weight it was authored to read at. Geometry and motion never move.
 * ---------------------------------------------------------------- */
.web3dkit-page-button-stage[data-mode="light"] { --web3dkit-page-ink: #14161a; }

/* Trochil — the amber signal sheen, now over warm paper */
.web3dkit-page-button-stage--trochil[data-mode="light"] { background: #f5f3ee; }
.web3dkit-page-button-stage--trochil[data-mode="light"]::before {
  background: radial-gradient(circle at 71% 49%, rgba(196, 142, 6, .22), transparent 31%);
  opacity: .9;
}
.web3dkit-page-button-stage--trochil[data-mode="light"] .web3dkit-page-button--trochil {
  border-color: rgba(20, 19, 14, .22);
  background: linear-gradient(180deg, rgba(255, 255, 255, .95), rgba(20, 19, 14, .05));
  box-shadow: 0 14px 30px rgba(20, 19, 14, .13), inset 0 1px rgba(255, 255, 255, .9);
  color: rgba(20, 19, 14, .78);
}
.web3dkit-page-button-stage--trochil[data-mode="light"] .web3dkit-page-button--trochil::before {
  background: linear-gradient(105deg, transparent 17%, rgba(196, 142, 6, .3) 48%, transparent 76%);
}
.web3dkit-page-button-stage--trochil[data-mode="light"] .web3dkit-page-button--trochil:hover {
  border-color: rgba(176, 126, 4, .62);
  color: #14130e;
  box-shadow: 0 18px 38px rgba(20, 19, 14, .17), 0 0 22px rgba(196, 142, 6, .2);
}

/* Attune — the thermal cap already carries its own ink, so only the ground
   and the cast heat change */
.web3dkit-page-button-stage--attune[data-mode="light"] { background: #faf4ee; }
.web3dkit-page-button-stage--attune[data-mode="light"]::before {
  background: radial-gradient(circle at 50% 50%, rgba(255, 122, 20, .18), transparent 32%);
}
.web3dkit-page-button-stage--attune[data-mode="light"] .web3dkit-page-button--attune {
  box-shadow: inset 0 1px rgba(255, 255, 255, .5), 0 8px 24px rgba(226, 92, 6, .28);
}
.web3dkit-page-button-stage--attune[data-mode="light"] .web3dkit-page-button--attune:hover {
  box-shadow: inset 0 1px rgba(255, 255, 255, .58), 0 12px 30px rgba(226, 92, 6, .34);
}

/* Tideform — the outline drops to graphite and the hot state to a deeper
   orange, which is where it clears text contrast on paper */
.web3dkit-page-button-stage--tideform[data-mode="light"] { background: #eeece7; --web3dkit-page-ink: #16181a; }
.web3dkit-page-button-stage--tideform[data-mode="light"]::before {
  background: radial-gradient(ellipse at 76% 44%, rgba(214, 96, 12, .16), transparent 34%);
}
.web3dkit-page-button-stage--tideform[data-mode="light"] .web3dkit-page-button--tideform {
  border-color: rgba(22, 24, 26, .26);
  background: rgba(22, 24, 26, .035);
  box-shadow: inset 0 1px rgba(255, 255, 255, .7);
  color: #16181a;
}
.web3dkit-page-button-stage--tideform[data-mode="light"] .web3dkit-page-button--tideform:hover {
  border-color: #c25a0c;
  background: rgba(194, 90, 12, .1);
  color: #b4530b;
}

/* Understory runs the other way: the violet capsule is the constant, and
   dark mode is the ground it was never given */
.web3dkit-page-button-stage--understory[data-mode="dark"] {
  --web3dkit-page-ink: #ece7e0;
  background: #17141b;
  color: #ece7e0;
}
.web3dkit-page-button-stage--understory[data-mode="dark"]::before {
  background: radial-gradient(circle at 50% 50%, rgba(155, 120, 208, .16), transparent 34%);
}
.web3dkit-page-button-stage--understory[data-mode="dark"] .web3dkit-page-button--understory {
  background: #a482d9;
  box-shadow: 0 16px 34px rgba(0, 0, 0, .5);
}
.web3dkit-page-button-stage--understory[data-mode="dark"] .web3dkit-page-button--understory:hover { background: #b08fe2; }

/* Halvorsen is a maximum-contrast pill, so on paper it inverts rather than
   fades — the capsule takes the ink and the endcap takes the paper */
.web3dkit-page-button-stage--halvorsen[data-mode="light"] { background: #eeece5; }
.web3dkit-page-button-stage--halvorsen[data-mode="light"]::before {
  background: radial-gradient(circle at 50% 50%, rgba(17, 17, 19, .05), transparent 35%);
}
.web3dkit-page-button-stage--halvorsen[data-mode="light"] .web3dkit-page-button--halvorsen {
  background: #111113;
  box-shadow: 0 14px 30px rgba(17, 17, 19, .22);
  color: #f0eee7;
}
.web3dkit-page-button-stage--halvorsen[data-mode="light"] .web3dkit-page-button--halvorsen .web3dkit-page-button__disc {
  background: #f0eee7;
  color: #111113;
}
.web3dkit-page-button-stage--halvorsen[data-mode="light"] .web3dkit-page-button--halvorsen:hover { background: #000; }

/* Meridian — the keycap keeps its travel and its hard base edge; only the
   housing, the cap face, and the legend follow the light ground */
.web3dkit-page-button-stage--meridian[data-mode="light"] { background: #e9eef5; --web3dkit-page-ink: #04070d; }
.web3dkit-page-button-stage--meridian[data-mode="light"]::before {
  background: radial-gradient(circle at 50% 44%, rgba(46, 133, 232, .2), transparent 34%);
}
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian {
  background: #dfe5ee;
  box-shadow: inset 0 0 0 1px rgba(4, 7, 13, .09);
}
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian::before {
  background: linear-gradient(180deg, #fbfcfe, #e3e8f1);
  box-shadow: 0 5px 0 #bcc5d3, 0 9px 15px -2px rgba(4, 7, 13, .2), inset 0 1px #fff;
}
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian > span:not(.web3dkit-page-button__led) { color: #1d2532; }
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian .web3dkit-page-button__led { background: rgba(4, 7, 13, .18); }
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian:hover::before { box-shadow: 0 1px 0 #bcc5d3, 0 3px 8px -2px rgba(4, 7, 13, .18), inset 0 1px #fff; }
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian:hover .web3dkit-page-button__led { background: #2e85e8; box-shadow: 0 0 7px #2e85e8; }
/* the primary cap stays blue on both grounds, so it is restated after the
   secondary block rather than inheriting it */
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian-primary {
  background: #dbe7f6;
  box-shadow: inset 0 0 0 1px rgba(46, 133, 232, .3);
}
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian-primary::before {
  background: linear-gradient(180deg, #6db6ff, #2e85e8);
  box-shadow: 0 5px 0 #1d6dc4, 0 9px 18px -2px rgba(21, 88, 158, .32), inset 0 1px rgba(255, 255, 255, .5);
}
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian-primary > span:not(.web3dkit-page-button__led) { color: #04182f; }
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian-primary .web3dkit-page-button__led { background: rgba(4, 24, 47, .3); }
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian-primary:hover::before { box-shadow: 0 1px 0 #1d6dc4, 0 3px 10px -2px rgba(21, 88, 158, .3), inset 0 1px rgba(255, 255, 255, .5); }
.web3dkit-page-button-stage--meridian[data-mode="light"] .web3dkit-page-button--meridian-primary:hover .web3dkit-page-button__led { background: #04182f; box-shadow: 0 0 6px rgba(4, 24, 47, .55); }

/* Aster — the glass is a white edge lit from one corner, so on paper the
   whole build flips to graphite and the hover brightening becomes darkening */
.web3dkit-page-button-stage--aster[data-mode="light"] { background: #eceae7; --web3dkit-page-ink: #101010; }
.web3dkit-page-button-stage--aster[data-mode="light"]::before {
  background:
    radial-gradient(circle at 64% 42%, rgba(16, 16, 16, .06), transparent 21%),
    radial-gradient(circle at 38% 62%, rgba(16, 16, 16, .035), transparent 27%);
}
.web3dkit-page-button-stage--aster[data-mode="light"] .web3dkit-page-button--aster {
  background: rgba(16, 16, 16, .05);
  box-shadow: 0 14px 34px -22px rgba(16, 16, 16, .55);
  color: #16181a;
}
.web3dkit-page-button-stage--aster[data-mode="light"] .web3dkit-page-button--aster::before {
  background: linear-gradient(148deg, rgba(16, 16, 16, .45), rgba(16, 16, 16, .12) 34%, rgba(16, 16, 16, .05) 58%, rgba(16, 16, 16, .26));
}
.web3dkit-page-button-stage--aster[data-mode="light"] .web3dkit-page-button--aster::after {
  background: linear-gradient(180deg, rgba(255, 255, 255, .8), transparent 46%);
}
.web3dkit-page-button-stage--aster[data-mode="light"] .web3dkit-page-button--aster:hover {
  background: rgba(16, 16, 16, .1);
  box-shadow: 0 8px 26px -12px rgba(16, 16, 16, .3);
  color: #000;
}
.web3dkit-page-button-stage--aster[data-mode="light"] .web3dkit-page-button--aster:hover::before { filter: brightness(.68); }
.web3dkit-page-button-stage--aster[data-mode="light"] .web3dkit-page-button--aster-arrow .web3dkit-page-button__chip { background: rgba(16, 16, 16, .07); }
.web3dkit-page-button-stage--aster[data-mode="light"] .web3dkit-page-button--aster-arrow .web3dkit-page-button__chip::before {
  background: linear-gradient(150deg, rgba(16, 16, 16, .5), rgba(16, 16, 16, .1) 62%, rgba(16, 16, 16, .3));
}
@media (prefers-reduced-motion: reduce) {
  .web3dkit-page-button, .web3dkit-page-button::before, .web3dkit-page-button svg { transition-duration: .01ms !important; }
}
`;function u({long:t=!1}){return t?e.jsx("svg",{viewBox:"0 0 21 9","aria-hidden":"true",children:e.jsx("path",{d:"M0 4.5h18M14.5 1.2 18.3 4.5l-3.8 3.3"})}):e.jsx("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:e.jsx("path",{d:"M3 1.5 8 6 3 10.5"})})}function x({variant:t,mode:o="dark",className:s="",style:g}){let i="trochil",n=null;switch(t){case"trochil-signal":n=e.jsx("button",{className:"web3dkit-page-button web3dkit-page-button--trochil",type:"button",children:e.jsx("span",{children:"Request access"})});break;case"attune-thermal":i="attune",n=e.jsxs("button",{className:"web3dkit-page-button web3dkit-page-button--attune",type:"button",children:[e.jsx("span",{children:"Start free"}),e.jsx(u,{})]});break;case"tideform-outline":i="tideform",n=e.jsxs("button",{className:"web3dkit-page-button web3dkit-page-button--tideform",type:"button",children:[e.jsx("span",{children:"See the work"}),e.jsx(u,{long:!0})]});break;case"understory-arrow-pill":i="understory",n=e.jsxs("button",{className:"web3dkit-page-button web3dkit-page-button--arrow-pill web3dkit-page-button--understory",type:"button",children:[e.jsx("span",{children:"Begin"}),e.jsx("span",{className:"web3dkit-page-button__disc",children:e.jsx(u,{})})]});break;case"meridian-keycap-primary":i="meridian",n=e.jsxs("button",{className:"web3dkit-page-button web3dkit-page-button--meridian web3dkit-page-button--meridian-primary",type:"button",children:[e.jsx("span",{className:"web3dkit-page-button__led"}),e.jsx("span",{children:"Start free"})]});break;case"meridian-keycap-secondary":i="meridian",n=e.jsxs("button",{className:"web3dkit-page-button web3dkit-page-button--meridian",type:"button",children:[e.jsx("span",{className:"web3dkit-page-button__led"}),e.jsx("span",{children:"Book a walkthrough"})]});break;case"halvorsen-arrow-pill":i="halvorsen",n=e.jsxs("button",{className:"web3dkit-page-button web3dkit-page-button--arrow-pill web3dkit-page-button--halvorsen",type:"button",children:[e.jsx("span",{children:"See the work"}),e.jsx("span",{className:"web3dkit-page-button__disc",children:e.jsx(u,{})})]});break;case"aster-glass-access":i="aster",n=e.jsx("button",{className:"web3dkit-page-button web3dkit-page-button--aster web3dkit-page-button--aster-access",type:"button",children:e.jsx("span",{children:"Get access"})});break;case"aster-glass-arrow":i="aster",n=e.jsxs("button",{className:"web3dkit-page-button web3dkit-page-button--aster web3dkit-page-button--aster-arrow",type:"button",children:[e.jsx("span",{children:"Start free"}),e.jsx("span",{className:"web3dkit-page-button__chip",children:e.jsx("svg",{viewBox:"0 0 12 12","aria-hidden":"true",children:e.jsx("path",{d:"M2 6h8M6.6 2.6 10 6 6.6 9.4"})})})]});break}return e.jsxs("div",{className:`web3dkit-page-button-stage web3dkit-page-button-stage--${i}${s?` ${s}`:""}`,"data-mode":o,"data-variant":t,style:g,children:[e.jsx("style",{children:c}),n]})}function m({variant:t="dark-pill",...o}){if(t==="dark-pill")return e.jsx(d,{className:o.className,style:o.style,mode:o.mode==="light"?"light":"dark"});if(t==="lumen-cta"||t==="lumen-cta-ghost")return e.jsx(a.Suspense,{fallback:null,children:e.jsx(b,{...o,variant:t==="lumen-cta-ghost"?"ghost":"primary"})});if(l(t))return e.jsx(x,{variant:t,mode:o.mode,className:o.className,style:o.style});const s=p[t];return e.jsx(a.Suspense,{fallback:null,children:e.jsx(s,{...o})})}const w=m;export{w as DarkGlassButton,m as RectangleButtons};
