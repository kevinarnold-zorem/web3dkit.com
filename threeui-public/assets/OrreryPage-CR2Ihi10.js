import{r as n,j as i}from"./index-fOQwe-l-.js";import{L as c}from"./LandingPages-plHUvg-e.js";import"./SylvaLivingWorldScene-OThUX2Jj.js";const o="threeui-orrery-presentation";function p(r){const t=r.contentDocument;if(!t)return;t.querySelectorAll(".tp, .tp-btn").forEach(e=>e.remove());let a=t.getElementById(o);a||(a=t.createElement("style"),a.id=o,t.head.appendChild(a)),a.textContent=`
    .ghost { font-size: max(11px, calc(430 * var(--u))) !important; }
    .dock-item { font-size: max(11px, calc(13 * var(--u))) !important; }
    .eyebrow, .colophon { font-size: max(11px, calc(var(--label) * var(--u))) !important; }
    .headline { font-size: max(11px, calc(var(--h1) * var(--u))) !important; }
    .lede { font-size: max(11px, calc(var(--lede) * var(--u))) !important; }
    .cta span { font-size: max(11px, calc(19 * var(--u))) !important; }
    .stat dt, .stat dd { font-size: max(11px, calc(15 * var(--u))) !important; }
    .card .label { font-size: max(11px, calc(15.5 * var(--u))) !important; }
    .card h2 { font-size: max(11px, calc(var(--card-title) * var(--u))) !important; }
    .scroll { font-size: max(11px, calc(13 * var(--u))) !important; }

    @media (max-width: 820px), (max-aspect-ratio: 9/10) {
      .ghost { font-size: max(11px, calc(300 * var(--u))) !important; }
      .headline { font-size: max(11px, calc(clamp(48, var(--h1) * .76, 104) * var(--u))) !important; }
      .dock-item { font-size: max(11px, calc(14 * var(--u))) !important; }
    }
  `}function x({applyScene:r,...t}){const a=n.useCallback(e=>{r?.(e),p(e)},[r]);return i.jsx(c,{...t,applyScene:a,title:"Orrery — orbital field background",sourceUrl:"/landing-pages/orrery.html"})}export{x as OrreryPage};
