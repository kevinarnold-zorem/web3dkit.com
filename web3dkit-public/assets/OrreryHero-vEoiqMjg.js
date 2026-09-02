import{r}from"./index-ChUl42DD.js";import{L as o}from"./LandingPages-Bks_nP6T.js";import"./SylvaLivingWorldScene-D5ro5Tc6.js";const s=`<!doctype html>
<html lang="en" class="js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Orrery — What the Centuries Left Standing</title>
<style>
  /* ---------- type ---------- */
  @font-face{
    font-family:'Instrument Serif';
    font-style:normal;font-weight:400;font-display:swap;
    src:url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjnTLgNs.woff2) format('woff2');
    unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD;
  }

  /* ---------- design unit: 1u === 1px on the 1920 x 1366 stage ---------- */
  :root{
    --u: min(calc(100vw / 1920), calc(100vh / 1366), 1.16px);
    --sans:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    --serif:'Instrument Serif',"Times New Roman",serif;

    /* type scale — every rule below reads from these, so the whole page can
       be re-proportioned from the panel (press T) or from one edit here     */
    --display:  var(--serif);
    --ui:       var(--sans);
    --h1:       92;      /* u */
    --h1-lh:    87;      /* u */
    --h1-track: .035;    /* em */
    --h1-weight:400;
    --lede:     21.5;    /* u */
    --lede-lh:  30;      /* u */
    --ui-weight:300;
    --label:    13.5;    /* u */
    --label-track: 2.8;  /* u */
    --card-title: 38;    /* u */

    --ink:        #ffffff;
    --ink-soft:   rgba(255,255,255,.60);
    --ink-faint:  rgba(255,255,255,.40);
    --rule:       rgba(255,255,255,.075);

    --card:       #eeeae2;
    --card-ink:   #1b1916;
    --card-label: #8b857a;

    --ease:     cubic-bezier(.22,.61,.36,1);
    --ease-out: cubic-bezier(.16,1,.3,1);
  }

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#040404;color:var(--ink);
    font-family:var(--ui);font-weight:var(--ui-weight);
    overflow:hidden;
    -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  }
  canvas#gl{position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:3}

  /* Everything sits on a centred stage so the composition holds its
     proportions instead of drifting apart with the viewport.              */
  .stage{
    position:fixed;left:50%;top:50%;
    margin-left:calc(-960 * var(--u));margin-top:calc(-683 * var(--u));
    width:calc(1920 * var(--u));height:calc(1366 * var(--u));
    z-index:5;pointer-events:none;
  }
  .stage a,.stage button{pointer-events:auto}

  /* ---------- column guides + ghost wordmark (z 1, behind the scene) ---- */
  .backdrop{position:fixed;inset:0;z-index:4;pointer-events:none;overflow:hidden}
  .guides{position:absolute;left:50%;top:0;bottom:0;width:calc(1920 * var(--u));margin-left:calc(-960 * var(--u))}
  .guides i{
    position:absolute;top:0;bottom:0;width:1px;
    background:linear-gradient(180deg,rgba(255,255,255,0) 0%,var(--rule) 14%,var(--rule) 76%,rgba(255,255,255,0) 100%);
  }
  .ghost{
    position:absolute;left:calc(50% - 960 * var(--u));bottom:calc(-96 * var(--u));
    font-family:var(--display);font-size:calc(430 * var(--u));line-height:.78;
    letter-spacing:calc(44 * var(--u));
    color:rgba(255,255,255,.030);
    white-space:nowrap;user-select:none;
  }

  /* ---------- dock ------------------------------------------------------
     A capsule of pills that magnify as the pointer nears them, over a rim
     highlight that tracks where the pointer is.  No backdrop-filter: it sits
     over a canvas that repaints every frame, so the backdrop would have to be
     re-sampled and re-blurred every frame with it.                         */
  .dock-wrap{
    position:absolute;z-index:6;top:calc(40 * var(--u));left:0;right:0;
    display:flex;justify-content:center;pointer-events:none;
  }
  .dock{
    position:relative;pointer-events:auto;isolation:isolate;
    display:flex;align-items:flex-start;gap:calc(4 * var(--u));
    height:calc(58 * var(--u));padding:calc(6 * var(--u));
    border-radius:calc(17 * var(--u));
    border:1px solid rgba(255,255,255,.10);
    background:
      linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,0) 42%),
      rgba(20,18,16,.72);
    box-shadow:0 calc(10 * var(--u)) calc(28 * var(--u)) rgba(0,0,0,.42),
               inset 0 1px rgba(255,255,255,.06);
  }
  .dock-item{
    position:relative;z-index:6;
    display:inline-flex;align-items:center;justify-content:center;flex:none;
    height:calc(46 * var(--u));gap:calc(9 * var(--u));padding:0 calc(16 * var(--u));
    transform-origin:50% 0;
    border:1px solid transparent;border-radius:calc(12 * var(--u));
    background:rgba(255,255,255,.038);
    color:var(--ink-faint);text-decoration:none;cursor:pointer;
    font-family:inherit;font-size:calc(13 * var(--u));font-weight:500;
    letter-spacing:calc(1.8 * var(--u));text-transform:uppercase;white-space:nowrap;
    will-change:width,height,transform;
    transition:color .18s var(--ease),border-color .2s var(--ease),background .2s var(--ease);
  }
  .dock-item[data-near="true"]{
    z-index:7;color:var(--ink);
    border-color:rgba(255,255,255,.18);
    background:rgba(26,23,20,.94);
    box-shadow:0 calc(8 * var(--u)) calc(18 * var(--u)) rgba(0,0,0,.38);
  }
  .dock-item .glyph{width:calc(16 * var(--u));height:calc(16 * var(--u));flex:none;opacity:.62;transition:opacity .18s var(--ease)}
  .dock-item .glyph svg{display:block;width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}
  .dock-item[data-near="true"] .glyph{opacity:1}
  .dock-mark{
    width:calc(46 * var(--u));padding:0;overflow:hidden;
    background:var(--card);border-color:var(--card);color:#1b1916;
    display:grid;place-items:center;
  }
  .dock-mark svg{width:calc(26 * var(--u));height:calc(26 * var(--u));display:block}
  .dock-mark[data-near="true"]{background:#fff;border-color:#fff}
  .dock-item.is-active{background:var(--card);border-color:var(--card);color:var(--card-ink)}
  .dock-item.is-active .glyph{opacity:.75}
  .dock-item--enter{color:var(--ink);background:rgba(255,255,255,.075)}

  /* specular rim: a conic gradient masked to the border, pointed at the
     cursor — it is what makes the glass read as a lit edge                 */
  [data-spec]{--spec-angle:2.4rad;--spec-bright:0}
  [data-spec]::after{
    content:'';position:absolute;inset:-1px;z-index:5;
    padding:1px;border-radius:inherit;pointer-events:none;
    opacity:var(--spec-bright);
    background:conic-gradient(from var(--spec-angle) at 50% 50%,
      rgba(255,238,214,0) 0deg,rgba(255,238,214,.08) 14deg,rgba(255,238,214,.95) 28deg,
      rgba(255,238,214,.16) 46deg,rgba(255,238,214,0) 68deg,rgba(255,238,214,0) 180deg,
      rgba(255,238,214,.08) 194deg,rgba(255,238,214,.95) 208deg,rgba(255,238,214,.16) 226deg,
      rgba(255,238,214,0) 248deg,rgba(255,238,214,0) 360deg);
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
            mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;
  }

  /* ---------- left column ---------------------------------------------- */
  .eyebrow{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(452 * var(--u));
    font-size:calc(var(--label) * var(--u));font-weight:500;letter-spacing:calc(var(--label-track) * var(--u));
    text-transform:uppercase;color:var(--ink-faint);
  }
  .headline{
    position:absolute;z-index:5;left:calc(92 * var(--u));top:calc(486 * var(--u));
    font-family:var(--display);font-weight:var(--h1-weight);
    font-size:calc(var(--h1) * var(--u));line-height:calc(var(--h1-lh) * var(--u));
    letter-spacing:calc(var(--h1-track) * 1em);
    text-shadow:0 calc(2 * var(--u)) calc(30 * var(--u)) rgba(0,0,0,.55);
  }
  .headline span{display:block}
  .lede{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(700 * var(--u));
    width:calc(408 * var(--u));
    font-size:calc(var(--lede) * var(--u));line-height:calc(var(--lede-lh) * var(--u));
    font-weight:var(--ui-weight);color:var(--ink-soft);
  }
  .cta{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(812 * var(--u));
    width:calc(408 * var(--u));
    display:flex;align-items:flex-end;justify-content:space-between;
    padding-bottom:calc(15 * var(--u));
    border-bottom:1px solid rgba(255,255,255,.55);
    color:var(--ink);text-decoration:none;
  }
  .cta span{font-size:calc(19 * var(--u));line-height:1;font-weight:400;letter-spacing:calc(.1 * var(--u))}
  .cta svg{width:calc(30 * var(--u));height:calc(11 * var(--u));display:block;margin-bottom:calc(2 * var(--u))}
  .cta .arw{transition:transform .5s var(--ease-out)}
  .cta:hover .arw{transform:translateX(calc(7 * var(--u)))}

  /* ---------- stats ----------------------------------------------------- */
  .stat{position:absolute;z-index:5;display:flex;align-items:flex-start;gap:calc(11 * var(--u))}
  .stat--a{left:calc(98 * var(--u));top:calc(946 * var(--u))}
  .stat--b{left:calc(300 * var(--u));top:calc(1052 * var(--u))}
  .stat .mark{width:calc(34 * var(--u));height:calc(34 * var(--u));flex:none;margin-top:calc(2 * var(--u));color:rgba(255,255,255,.32)}
  .stat .mark svg{width:100%;height:100%;display:block;filter:drop-shadow(0 calc(2 * var(--u)) calc(10 * var(--u)) rgba(0,0,0,.6))}
  .stat dt,.stat dd{text-shadow:0 calc(2 * var(--u)) calc(16 * var(--u)) rgba(0,0,0,.6)}
  .stat dt{font-size:calc(15 * var(--u));line-height:calc(21 * var(--u));font-weight:300;color:var(--ink-soft)}
  .stat dd{font-size:calc(15 * var(--u));line-height:calc(23 * var(--u));font-weight:600;color:var(--ink)}

  /* ---------- cards ------------------------------------------------------
     No z-index on the first card on purpose: z-index auto keeps it out of its
     own stacking context, so it paints under the canvas and the debris drift
     across its shoulder, while the second card sits in front.              */
  .card{
    position:absolute;
    background:var(--card);border-radius:calc(52 * var(--u));
    box-shadow:0 calc(34 * var(--u)) calc(80 * var(--u)) rgba(0,0,0,.42);
    --mr:calc(52 * var(--u));
  }
  .card--note{left:calc(1062 * var(--u));top:calc(462 * var(--u));width:calc(392 * var(--u));height:calc(404 * var(--u))}
  .card--work{z-index:5;left:calc(1452 * var(--u));top:calc(796 * var(--u));width:calc(392 * var(--u));height:calc(404 * var(--u))}
  .card .label{
    position:absolute;left:calc(42 * var(--u));
    font-size:calc(15.5 * var(--u));font-weight:400;letter-spacing:calc(.6 * var(--u));color:var(--card-label);
  }
  .card h2{
    position:absolute;left:calc(42 * var(--u));right:calc(42 * var(--u));
    font-family:var(--display);font-weight:var(--h1-weight);
    font-size:calc(var(--card-title) * var(--u));line-height:calc(var(--card-title) * var(--u));
    letter-spacing:calc(.2 * var(--u));
    color:var(--card-ink);
  }
  .card--note .label{top:calc(212 * var(--u))}
  .card--note h2{top:calc(240 * var(--u))}
  .card--work .label{top:calc(52 * var(--u))}
  .card--work h2{top:calc(80 * var(--u))}
  .card figure{
    position:absolute;left:calc(16 * var(--u));right:calc(16 * var(--u));
    border-radius:calc(40 * var(--u));overflow:hidden;isolation:isolate;background:#201e1b;
  }
  .card--note figure{top:calc(16 * var(--u));height:calc(176 * var(--u))}
  .card--work figure{bottom:calc(16 * var(--u));height:calc(212 * var(--u))}
  /* the plate is its own depth plane, so it reads as a window rather than a
     picture glued to the paper */
  .card figure canvas{
    position:absolute;inset:calc(-10 * var(--u));width:calc(100% + 20 * var(--u));height:calc(100% + 20 * var(--u));
    display:block;object-fit:cover;
    transform:translate3d(calc(var(--px,0) * -9px),calc(var(--py,0) * -6px),0) scale(1.02);
    transition:transform .9s var(--ease);
  }
  .card figure::after{
    content:'';position:absolute;inset:0;z-index:2;pointer-events:none;
    box-shadow:inset 0 0 calc(40 * var(--u)) rgba(0,0,0,.35);
    border-radius:inherit;
  }
  .card .knob{
    position:absolute;right:calc(26 * var(--u));width:calc(58 * var(--u));height:calc(58 * var(--u));
    border:0;border-radius:50%;background:#dfd9cd;color:#2a2621;cursor:pointer;
    display:grid;place-items:center;
    transition:background .3s var(--ease),transform .5s var(--ease-out);
  }
  .card--note .knob{bottom:calc(26 * var(--u))}
  .card--work .knob{top:calc(26 * var(--u))}
  .card .knob:hover{background:#fff;transform:scale(1.06)}
  .card .knob svg{width:calc(22 * var(--u));height:calc(22 * var(--u));display:block}

  /* ---------- footer + scroll cue --------------------------------------- */
  .colophon{
    position:absolute;z-index:5;left:calc(96 * var(--u));bottom:calc(52 * var(--u));
    font-size:calc(var(--label) * var(--u));letter-spacing:calc(calc(var(--label-track) * .64) * var(--u));
    text-transform:uppercase;color:var(--ink-faint);
  }
  .scroll{
    position:absolute;z-index:5;left:calc(880 * var(--u));bottom:calc(46 * var(--u));
    display:flex;align-items:center;gap:calc(14 * var(--u));
    writing-mode:vertical-rl;
    font-size:calc(13 * var(--u));letter-spacing:calc(5 * var(--u));font-weight:400;
    text-transform:uppercase;color:var(--ink-soft);text-decoration:none;
    text-shadow:0 calc(2 * var(--u)) calc(18 * var(--u)) rgba(0,0,0,.7);
  }
  .scroll .track{
    position:relative;display:block;width:1px;height:calc(78 * var(--u));
    background:rgba(255,255,255,.16);overflow:hidden;
  }
  .scroll .track::after{
    content:'';position:absolute;left:0;top:0;width:1px;height:calc(26 * var(--u));
    background:rgba(255,255,255,.85);animation:trickle 2.6s var(--ease) infinite;
  }
  @keyframes trickle{
    0%{transform:translateY(-105%);opacity:0}
    22%{opacity:1}78%{opacity:1}
    100%{transform:translateY(300%);opacity:0}
  }

  /* ---------- cursor ---------------------------------------------------- */
  .cursor{
    position:fixed;left:0;top:0;z-index:9;pointer-events:none;
    width:calc(128 * var(--u));height:calc(128 * var(--u));
    margin-left:calc(-64 * var(--u));margin-top:calc(-64 * var(--u));
    border:1px solid rgba(255,255,255,.5);border-radius:50%;
    opacity:0;transition:opacity .4s ease;will-change:transform;
  }

  /* ---------- pointer parallax -----------------------------------------
     --px / --py are written on the stage once per frame (-1..1); each layer
     says how far it rides (--pd) and how much it turns (--pr).             */
  .par{
    transform:perspective(1500px)
      translate3d(calc(var(--px,0) * var(--pd,0) * -1px),calc(var(--py,0) * var(--pd,0) * -.62px),0)
      rotateY(calc(var(--px,0) * var(--pr,0) * 1deg))
      rotateX(calc(var(--py,0) * var(--pr,0) * -.7deg));
  }

  /* ---------- entrance --------------------------------------------------
     clip-path rather than transform, because transform is spoken for by the
     parallax.  Once the intro has run the clip is dropped entirely.        */
  .js .mask{clip-path:inset(100% 0 0 0 round var(--mr,0px))}
  .is-ready .mask{clip-path:inset(0 0 0 0 round var(--mr,0px));transition:clip-path 1.05s var(--ease-out) var(--d,0ms)}
  .js .mask-circle{clip-path:circle(0% at 50% 50%)}
  .is-ready .mask-circle{clip-path:circle(76% at 50% 50%);transition:clip-path 1.1s var(--ease-out) var(--d,0ms)}
  .js .fade{opacity:0}
  .is-ready .fade{opacity:1;transition:opacity 1.3s var(--ease) var(--d,0ms)}
  .intro-done .mask,.intro-done .mask-circle{clip-path:none;transition:none}
  .js .dock{opacity:0}
  .is-ready .dock{opacity:1;transition:opacity .8s var(--ease) 80ms}
  .js .dock-item{clip-path:inset(0 0 105% 0)}
  .is-ready .dock-item{
    clip-path:inset(0 0 -30% 0);
    transition:clip-path .9s var(--ease-out) var(--d,0ms),color .18s var(--ease),
               border-color .2s var(--ease),background .2s var(--ease);
  }
  canvas#gl{opacity:0;transition:opacity 1.4s var(--ease)}
  body.is-ready canvas#gl{opacity:1}

  a:focus-visible,button:focus-visible{
    outline:2px solid rgba(255,255,255,.85);outline-offset:calc(4 * var(--u));border-radius:calc(6 * var(--u));
  }

  /* wrappers exist only so the narrow tiers can reflow the same markup;
     on the wide stage they generate no box at all */
  .col,.meta{display:contents}

  /* ── tier 2: short or mid-width — same composition, fewer pieces ────── */
  @media (max-width:1180px), (max-height:640px){
    .card--note{left:calc(1010 * var(--u));top:calc(430 * var(--u))}
    .card--work{display:none}
    .guides i:nth-child(3){display:none}
    .stat--a{top:calc(900 * var(--u))}
    .stat--b{top:calc(1006 * var(--u))}
  }

  /* ── tier 3: narrow or portrait — the stage stops being a fixed frame
     and the copy flows in a column under the scene ───────────────────── */
  @media (max-width:820px), (max-aspect-ratio:9/10){
    :root{ --u: min(calc(100vw / 700), calc(100vh / 1180), 1.05px); }

    .stage{
      position:fixed;left:0;top:0;margin:0;
      width:100%;height:100%;
      display:flex;flex-direction:column;justify-content:flex-end;
      padding:0 calc(38 * var(--u)) calc(34 * var(--u));
      gap:calc(20 * var(--u));
    }
    .col{display:block}
    .meta{display:flex;gap:calc(30 * var(--u));flex-wrap:wrap;align-items:flex-start}

    .eyebrow,.headline,.lede,.cta,.stat,.colophon{position:static;left:auto;top:auto;width:auto}
    .eyebrow{margin-bottom:calc(14 * var(--u))}
    .headline{
      font-size:calc(clamp(48, var(--h1) * .76, 104) * var(--u));
      line-height:calc(clamp(46, var(--h1-lh) * .76, 100) * var(--u));
      margin-bottom:calc(20 * var(--u));
    }
    .lede{max-width:calc(520 * var(--u));margin-bottom:calc(26 * var(--u))}
    .cta{max-width:calc(520 * var(--u));margin-bottom:calc(26 * var(--u))}
    .stat{margin:0}
    .colophon{margin-top:calc(6 * var(--u))}

    .card,.guides,.scroll{display:none}
    .ghost{font-size:calc(300 * var(--u));bottom:calc(-52 * var(--u));letter-spacing:calc(26 * var(--u))}

    .dock-wrap{top:calc(26 * var(--u))}
    .dock{height:calc(64 * var(--u));border-radius:calc(19 * var(--u))}
    .dock-item{height:calc(52 * var(--u));padding:0 calc(15 * var(--u));font-size:calc(14 * var(--u))}
    .dock-item span:not(.glyph){display:none}
    .dock-item .glyph{width:calc(19 * var(--u));height:calc(19 * var(--u))}
    .dock-mark{width:calc(52 * var(--u))}
    .dock-mark svg{width:calc(28 * var(--u));height:calc(28 * var(--u))}

    .cursor{display:none}
  }

  /* very small phones: one stat, tighter margins */
  @media (max-width:420px){
    .stat--b{display:none}
    .stage{padding:0 calc(30 * var(--u)) calc(24 * var(--u))}
  }

  /* pointer-less devices get no cursor ring and no hover-only affordances */
  @media (hover:none){
    .cursor{display:none}
  }
  @media (prefers-reduced-motion:reduce){
    .scroll .track::after{animation:none}
    .is-ready .mask,.is-ready .mask-circle,.is-ready .fade,.is-ready .dock-item{transition-duration:.01ms}
  }
</style>
</head>
<body>
<div class="backdrop" aria-hidden="true">
  <div class="guides fade" style="--d:900ms">
    <i style="left:calc(480 * var(--u))"></i>
    <i style="left:calc(960 * var(--u))"></i>
    <i style="left:calc(1440 * var(--u))"></i>
  </div>
  <div class="ghost fade" style="--d:1150ms">ORRERY</div>
</div>

<canvas id="gl"></canvas>

<div class="stage" id="stage">

  <div class="dock-wrap">
    <nav class="dock par" style="--pd:5" data-spec aria-label="Primary">
      <a class="dock-item dock-mark" data-dock data-spec href="#" style="--d:120ms" aria-label="Orrery — home">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3">
          <ellipse cx="12" cy="12" rx="9.4" ry="4.1" transform="rotate(-16 12 12)"/>
          <ellipse cx="12" cy="12" rx="5.2" ry="2.2" transform="rotate(-16 12 12)"/>
          <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/>
        </svg>
      </a>
      <a class="dock-item is-active" data-dock data-spec href="#" style="--d:180ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.1"/><ellipse cx="8" cy="8" rx="6.4" ry="2.6"/></svg></span>
        <span>Survey</span>
      </a>
      <a class="dock-item" data-dock data-spec href="#" style="--d:230ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M2.4 11.6 6 6.4l2.6 3 2-2.4 3 4.6z"/><circle cx="5.2" cy="4.2" r="1.3"/></svg></span>
        <span>Sites</span>
      </a>
      <a class="dock-item" data-dock data-spec href="#" style="--d:280ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 2.6h5.2L12 5.3v8.1H4z"/><path d="M9.2 2.6v2.7h2.6"/><path d="M6 8.6h4M6 11h2.7"/></svg></span>
        <span>Notes</span>
      </a>
      <a class="dock-item dock-item--enter" data-dock data-spec href="#" style="--d:330ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M6.6 2.6h5.1a1 1 0 0 1 1 1v8.8a1 1 0 0 1-1 1H6.6"/><path d="M2.6 8h6.6"/><path d="m7 5.6 2.4 2.4L7 10.4"/></svg></span>
        <span>Enquiries</span>
      </a>
    </nav>
  </div>

  <div class="col">
  <p class="eyebrow mask" style="--d:220ms; --pd:8; --pr:.5">Survey — est. MMXIII</p>

  <h1 class="headline" style="--pd:20; --pr:1.2">
    <span class="mask" style="--d:280ms">What the centuries</span>
    <span class="mask" style="--d:380ms">left standing</span>
  </h1>

  <p class="lede mask" style="--d:520ms; --pd:15; --pr:1">Identity, motion, and spatial web work for brands that build for centuries, not seasons.</p>

  <a class="cta mask" style="--d:600ms; --pd:15; --pr:1" href="#">
    <span>Bring us a problem</span>
    <svg class="arw" viewBox="0 0 30 11" fill="none" aria-hidden="true">
      <path d="M0 5.5H28" stroke="#fff" stroke-width="1.1"/>
      <path d="M22.6 .9C23.6 3.1 25.6 4.9 28.4 5.5 25.6 6.1 23.6 7.9 22.6 10.1" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
  </div>

  <div class="meta">
  <dl class="stat stat--a mask" style="--d:700ms; --pd:12; --pr:.8">
    <span class="mark" aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <ellipse cx="15" cy="15" rx="12" ry="5" stroke-dasharray="0.6 3.4"/>
        <ellipse cx="15" cy="15" rx="6.4" ry="2.7"/>
        <circle cx="15" cy="15" r="1.3" fill="currentColor" stroke="none"/>
      </svg>
    </span>
    <div><dt>In practice</dt><dd>12 years</dd></div>
  </dl>

  <dl class="stat stat--b mask" style="--d:780ms; --pd:13; --pr:.8">
    <span class="mark" aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <path d="M15 4v22M4 15h22" stroke-dasharray="0.6 3.2"/>
        <path d="M8.8 8.8 21.2 21.2M21.2 8.8 8.8 21.2" stroke-dasharray="0.6 3.2"/>
        <circle cx="15" cy="15" r="4.2"/>
      </svg>
    </span>
    <div><dt>Sites recorded</dt><dd>41 ruins</dd></div>
  </dl>

  </div>

  <article class="card card--note mask" style="--d:820ms; --pd:11; --pr:2.2">
    <figure><canvas data-plate="stone" width="480" height="240"></canvas></figure>
    <p class="label">Field note 14</p>
    <h2>Nothing here was hurried</h2>
    <button class="knob" aria-label="Open field note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </article>

  <article class="card card--work par mask" style="--d:900ms; --pd:22; --pr:2.4">
    <p class="label">Selected work</p>
    <h2>Built to fall well</h2>
    <figure><canvas data-plate="marble" width="480" height="280"></canvas></figure>
    <button class="knob" aria-label="Open selected work">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </article>

  <p class="colophon fade" style="--d:1000ms; --pd:6">Orrery Studio — London &amp; Kyoto</p>

  <a class="scroll fade" style="--d:1040ms; --pd:8" href="#">Discover<span class="track"></span></a>

</div>

<div class="cursor" id="cursor"></div>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/shaders/CopyShader.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/shaders/LuminosityHighPassShader.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/EffectComposer.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/RenderPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/ShaderPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/MaskPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/UnrealBloomPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/objects/MarchingCubes.js"><\/script>
<script>
(function(){
'use strict';

/* =====================================================================
   0. deterministic helpers
   ===================================================================== */
const PARAMS = new URLSearchParams(location.search);
const FROZEN = PARAMS.has('t') ? parseFloat(PARAMS.get('t')) : null;
const ELEV_OVERRIDE = PARAMS.has('elev') ? parseFloat(PARAMS.get('elev')) : null;  // camera height, debug
if(PARAMS.get('scene') === '0'){
  const s2 = document.createElement('style');
  s2.textContent = 'canvas#gl{display:none!important} body{background:#000}';
  document.head.appendChild(s2);
}
if(PARAMS.get('ui') === '0'){
  const s = document.createElement('style');
  s.textContent = '.stage,.cursor{display:none!important}';
  document.head.appendChild(s);
}

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd = mulberry32(20260818);

// --- 3d value noise (smooth, cheap) -------------------------------------
const P = new Uint8Array(512);
(function(){const p=[...Array(256).keys()];for(let i=255;i>0;i--){const j=(rnd()*(i+1))|0;[p[i],p[j]]=[p[j],p[i]];}for(let i=0;i<512;i++)P[i]=p[i&255];})();
function fade(t){return t*t*t*(t*(t*6-15)+10);}
function lerp(a,b,t){return a+(b-a)*t;}
function grad(h,x,y,z){const u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z);return((h&1)?-u:u)+((h&2)?-v:v);}
function noise3(x,y,z){
  const X=Math.floor(x)&255,Y=Math.floor(y)&255,Z=Math.floor(z)&255;
  x-=Math.floor(x);y-=Math.floor(y);z-=Math.floor(z);
  const u=fade(x),v=fade(y),w=fade(z);
  const A=P[X]+Y,AA=P[A]+Z,AB=P[A+1]+Z,B=P[X+1]+Y,BA=P[B]+Z,BB=P[B+1]+Z;
  return lerp(lerp(lerp(grad(P[AA]&15,x,y,z),grad(P[BA]&15,x-1,y,z),u),
                   lerp(grad(P[AB]&15,x,y-1,z),grad(P[BB]&15,x-1,y-1,z),u),v),
              lerp(lerp(grad(P[AA+1]&15,x,y,z-1),grad(P[BA+1]&15,x-1,y,z-1),u),
                   lerp(grad(P[AB+1]&15,x,y-1,z-1),grad(P[BB+1]&15,x-1,y-1,z-1),u),v),w);
}
function fbm3(x,y,z,oct,lac,gain){
  let a=0,amp=.5,f=1;
  for(let i=0;i<(oct||4);i++){a+=amp*noise3(x*f,y*f,z*f);f*=(lac||2.03);amp*=(gain||.5);}
  return a;
}

/* =====================================================================
   1. renderer / scene / camera
   ===================================================================== */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.LinearEncoding;      // we encode ourselves in the final pass
renderer.toneMapping = THREE.NoToneMapping;          // ditto
THREE.ColorManagement.legacyMode = false;

const scene = new THREE.Scene();

const REF_ASPECT = 1920/1366;
const REF_FOV_V  = 35;                                                   // vertical fov at the reference aspect
const FOV_H = 2*Math.atan(Math.tan(REF_FOV_V*Math.PI/360)*REF_ASPECT);   // keep the horizontal framing constant
const camera = new THREE.PerspectiveCamera(REF_FOV_V, REF_ASPECT, .1, 400);

const D_CAM      = 10.0;   // orbit radius
const Y_RING_LOW = 0.0;    // lower orbit ring plane
const Y_RING_TOP = 3.484;  // upper orbit ring plane
const Y_PLINTH   = 1.21;   // plinth top surface
const Y_TARGET   = 1.748;  // camera aim
const ROLL       = -9.658*Math.PI/180;
let PORTRAIT = false, DIST_SCALE = 1;
const Y_CAM      = 1.24;    // fixed eye height — the reference bob is gone
const ORBIT_RATE = 0.038;   // rad/s, a full turn in ~165 s
const ROCK_RATE  = 0.026;   // the plinth counter-rotates, ~240 s per turn
const RUIN_YAW   = -0.30;   // the keep's yaw at t=0
const R_RING_TOP = 2.964;
const R_RING_LOW = 1.727;

/* =====================================================================
   2. procedural stone texture
   ===================================================================== */
/* ---------------------------------------------------------------------
   Stone maps are baked on the GPU.  Building them in JS capped out around
   1k and a second of load; on the GPU a 2k set with a dozen layered
   features costs a few milliseconds, so the surface can carry bedding,
   fissures, calcite veins, chipping, porosity, rain runnels and dust
   without the page paying for it.

   Pass 1 renders a height/mask buffer at half float, then the albedo,
   normal and ORM passes all read it.  The results are read back into
   DataTextures so they get proper mipmaps and anisotropy.
   --------------------------------------------------------------------- */
const TEX_COMMON = \`
  precision highp float;
  varying vec2 vUv;
  uniform vec2  uPeriod;      // tiling period in cells
  uniform float uSeed;

  vec2 wrap(vec2 p, vec2 period){ return mod(p, period); }
  float hash21(vec2 p, vec2 period){
    p = wrap(p, period) + uSeed;
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float vnoise(vec2 x, vec2 period){
    vec2 i = floor(x), f = fract(x);
    vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    float a = hash21(i,              period);
    float b = hash21(i+vec2(1.0,0.0),period);
    float c = hash21(i+vec2(0.0,1.0),period);
    float d = hash21(i+vec2(1.0,1.0),period);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y)*2.0-1.0;
  }
  // anisotropic tileable fbm: cells counts per axis, doubled each octave
  float fbm(vec2 uv, vec2 cells, int oct, float gain){
    float a = 0.0, amp = 1.0, norm = 0.0;
    vec2 c = cells;
    for(int i=0;i<8;i++){
      if(i>=oct) break;
      a += amp * vnoise(uv*c, c);
      norm += amp; c *= 2.0; amp *= gain;
    }
    return a/max(norm,1e-4);
  }
  // random value per worley cell — mineral grains, breccia clasts
  float cellRand2(vec2 uv, vec2 cells, float salt){
    vec2 p = uv*cells, ip = floor(p), fp = fract(p);
    float d1 = 8.0; vec2 best = ip;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 o = vec2(float(i), float(j));
        vec2 cell = ip + o;
        vec2 r = vec2(hash21(cell, cells), hash21(cell+37.7, cells));
        vec2 diff = o + r - fp;
        float d = dot(diff, diff);
        if(d < d1){ d1 = d; best = cell; }
      }
    }
    return hash21(best + salt, cells);
  }
  float cellRand(vec2 uv, float cells, float salt){ return cellRand2(uv, vec2(cells), salt); }
  // wrapping worley; returns (nearest, second) distances
  vec2 worley2(vec2 uv, vec2 cells){
    vec2 p = uv*cells, ip = floor(p), fp = fract(p);
    float d1 = 8.0, d2 = 8.0;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 o = vec2(float(i), float(j));
        vec2 cell = ip + o;
        vec2 r = vec2(hash21(cell, cells), hash21(cell+37.7, cells));
        vec2 diff = o + r - fp;
        float d = dot(diff, diff);
        if(d < d1){ d2 = d1; d1 = d; } else if(d < d2){ d2 = d; }
      }
    }
    return vec2(sqrt(d1), sqrt(d2));
  }
  vec2 worley(vec2 uv, float cells){ return worley2(uv, vec2(cells)); }
  /* Fracture network: the walls between worley cells.  Unlike the zero set of
     a smooth field these branch, meet at junctions and terminate, which is
     what makes them read as cracks rather than contour lines.               */
  float fractureNet(vec2 uv, vec2 cells, float width, float warpAmt){
    vec2 w = vec2(fbm(uv + 2.2, vec2(4.0), 3, 0.5), fbm(uv + 8.8, vec2(4.0), 3, 0.5))*warpAmt;
    vec2 d = worley2(uv + w, cells);
    float wobble = 0.55 + 0.9*(fbm(uv + 5.5, vec2(8.0), 3, 0.5)*0.5 + 0.5);
    return 1.0 - smoothstep(0.0, width*wobble, d.y - d.x);
  }
\`;

const HEIGHT_FS = TEX_COMMON + \`
  uniform float uBeds, uBedDepth, uBedSoft;
  uniform float uFissureCells, uFissureSharp, uFissureDepth;
  uniform float uChipCells, uChipDepth, uPitCells, uPitDepth;
  uniform float uVeinDepth, uRunnel, uMicro, uMacro, uGrainCells, uGrainAmp, uVeinSharp;

  void main(){
    vec2 uv = vUv;

    // --- broad form -----------------------------------------------------
    float macro = fbm(uv, vec2(2.0), 5, 0.5);
    float warp  = fbm(uv + 11.3, vec2(2.0), 3, 0.5);

    // --- sedimentary bedding, thickness varying along each bed ----------
    float band  = uv.y*uBeds + warp*0.85;
    float bf    = fract(band);
    float joint = 1.0 - smoothstep(0.0, uBedSoft, bf)*smoothstep(1.0, 1.0-uBedSoft, bf);
    // beds only survive in patches — a continuous line across the whole face
    // reads as timber, not stone
    joint *= smoothstep(0.30, 0.72, fbm(uv + 7.7, vec2(3.0, 6.0), 3, 0.55)*1.4 + 0.5);
    float bedTone = fbm(vec2(floor(band)*0.37, 0.5), vec2(4.0), 2, 0.5);

    // mineral grain at two scales: flat-ish clasts with their own tone/height
    float grainA = cellRand(uv, uGrainCells,        1.7)*2.0 - 1.0;
    float grainB = cellRand(uv, uGrainCells*3.1,   13.3)*2.0 - 1.0;

    // --- fissures: stretched so they run with the bedding ---------------
    float crack  = fractureNet(uv, vec2(uFissureCells, uFissureCells*0.55), 0.040, 0.05);
    float crack2 = fractureNet(uv + 13.7, vec2(uFissureCells*2.3, uFissureCells*1.3), 0.055, 0.03)*0.45;
    crack  *= smoothstep(0.34, 0.82, fbm(uv + 15.1, vec2(3.0), 3, 0.55)*1.3 + 0.5);
    crack2 *= smoothstep(0.40, 0.88, fbm(uv + 45.3, vec2(5.0), 3, 0.55)*1.3 + 0.5);
    // one sparse family of deep fractures cutting the whole block
    float fracture = fractureNet(uv + 63.2, vec2(3.0, 2.0), 0.035, 0.07);
    fracture *= smoothstep(0.45, 0.85, fbm(uv + 27.4, vec2(2.0), 3, 0.55)*1.4 + 0.5);

    // --- chipped pockets and porosity -----------------------------------
    vec2  wc = worley(uv, uChipCells);
    float chip = clamp(1.0 - wc.x/0.42, 0.0, 1.0);
    chip *= smoothstep(0.35, 0.55, hash21(floor(uv*uChipCells)+3.3, vec2(uChipCells)));
    vec2  wp = worley(uv + 5.5, uPitCells);
    float pit = clamp(1.0 - wp.x/0.38, 0.0, 1.0);
    pit *= smoothstep(0.25, 0.60, hash21(floor((uv+5.5)*uPitCells)+9.1, vec2(uPitCells)));
    float pore = clamp(1.0 - worley(uv + 17.1, uPitCells*1.7).x/0.34, 0.0, 1.0);
    pore *= 0.55 + 0.45*(fbm(uv + 3.7, vec2(24.0), 3, 0.5)*0.5 + 0.5);

    // --- calcite veins: thin raised threads ------------------------------
    float vn = fbm(uv + 88.4, vec2(2.0, 3.0), 4, 0.55);
    float vein = pow(clamp(1.0 - abs(vn)*uVeinSharp, 0.0, 1.0), 2.4);
    vein *= smoothstep(0.52, 0.86, fbm(uv + 71.2, vec2(3.0), 3, 0.55)*1.4 + 0.5);

    // --- rain runnels down the face, and fine tooth ----------------------
    float runnel = fbm(uv + 33.9, vec2(26.0, 2.0), 3, 0.5);
    runnel = pow(clamp(1.0 - abs(runnel)*7.0, 0.0, 1.0), 1.4) * smoothstep(0.15, 0.75, 1.0-uv.y);
    float micro = fbm(uv + 51.0, vec2(48.0), 3, 0.5);
    float grit  = fbm(uv + 77.0, vec2(160.0), 2, 0.5);

    // --- assemble --------------------------------------------------------
    float h = 0.55 + macro*uMacro + bedTone*0.04 + micro*uMicro + grit*uMicro*0.35;
    h += grainA*uGrainAmp + grainB*uGrainAmp*0.55;
    h -= joint*uBedDepth;
    h -= (crack + crack2)*uFissureDepth;
    h -= fracture*uFissureDepth*1.7;
    h -= chip*chip*uChipDepth;
    h -= pit*pit*uPitDepth + pore*pore*uPitDepth*0.30;
    h -= runnel*uRunnel;
    h += vein*uVeinDepth;

    float cracks = clamp(crack + crack2 + fracture*1.3 + joint*0.7, 0.0, 1.0);
    float holes  = clamp(chip*1.15 + pit*0.95 + pore*0.30, 0.0, 1.0);
    float mineral = clamp(0.5 + fbm(uv + 5.0, vec2(2.0, 1.0), 4, 0.5)*1.5
                              + grainA*0.22 + grainB*0.12, 0.0, 1.0);

    gl_FragColor = vec4(h, cracks, holes, mineral);
  }
\`;

const ALBEDO_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec3 uWarm, uCool, uDark, uPale, uVein;
  uniform float uStain, uRecess, uBleach, uDust, uGrain, uGrainCells, uVeinSharp;
  void main(){
    vec2 uv = vUv;
    vec4 H = texture2D(tH, uv);
    float h = H.x, cracks = H.y, holes = H.z, mineral = H.w;

    vec3 col = mix(uCool, uWarm, mineral);
    // clast-to-clast tone jitter keeps the surface from reading as one wash
    float cA = cellRand(uv, uGrainCells,      1.7) - 0.5;
    float cB = cellRand(uv, uGrainCells*3.1, 13.3) - 0.5;
    // feathered by a fine field so the clasts do not read as flat polygons
    float feather = fbm(uv + 3.3, vec2(96.0), 3, 0.5)*0.5 + 0.5;
    col *= 1.0 + (cA*0.11 + cB*0.07)*(0.55 + 0.45*feather);

    // iron / soot staining in broad patches
    float stain = clamp(fbm(uv + 41.0, vec2(7.0), 4, 0.5)*2.2 - 0.35, 0.0, 1.0)*uStain;
    col = mix(col, uDark*0.9, stain);

    // lichen-like crust: cooler, lighter, only on upward-ish broad areas
    float crust = smoothstep(0.55, 0.95, fbm(uv + 12.7, vec2(6.0), 4, 0.55)*1.6 + 0.5);
    col = mix(col, mix(col, vec3(0.62,0.64,0.60), 0.55), crust*0.35);

    // bleached plateaus, darkened recesses
    col = mix(col, uPale, smoothstep(0.58, 0.94, h)*uBleach);
    // recesses: fissures read darkest, then pockets, then porosity
    col = mix(col, uDark*0.82, clamp(cracks*1.05, 0.0, 1.0)*uRecess);
    col = mix(col, uDark,      clamp(holes*0.95,  0.0, 1.0)*uRecess*0.85);

    // calcite veins read brighter than the matrix
    float vn = fbm(uv + 88.4, vec2(2.0, 3.0), 4, 0.55);
    float vein = pow(clamp(1.0 - abs(vn)*uVeinSharp, 0.0, 1.0), 2.4);
    vein *= smoothstep(0.52, 0.86, fbm(uv + 71.2, vec2(3.0), 3, 0.55)*1.4 + 0.5);
    col = mix(col, uVein, vein*0.75);

    // pale dust settling into the cavities
    float dust = clamp(holes*1.2 + smoothstep(0.5, 0.1, h)*0.5, 0.0, 1.0);
    col = mix(col, uPale*0.96, dust*uDust);

    col += (hash21(vUv*4096.0, vec2(4096.0)) - 0.5)*uGrain;
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
\`;

const ORM_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec2 uTexel;
  uniform float uRough, uRoughVar, uAO;
  void main(){
    vec2 uv = vUv;
    vec4 H = texture2D(tH, uv);
    float h = H.x, cracks = H.y, holes = H.z;

    // cavity AO: compare the height against a wide blur of itself
    float blur = 0.0;
    for(int i=0;i<12;i++){
      float a = float(i)*0.5236;
      vec2 o = vec2(cos(a), sin(a));
      blur += texture2D(tH, uv + o*uTexel*7.0).x;
      blur += texture2D(tH, uv + o*uTexel*17.0).x;
    }
    blur /= 24.0;
    float ao = 1.0 - clamp((blur - h)*uAO, 0.0, 1.0);
    ao *= 1.0 - clamp(cracks*0.35 + holes*0.30, 0.0, 0.55);

    float open = clamp(holes*1.2 + cracks*0.8, 0.0, 1.0);
    float rough = uRough + open*uRoughVar - smoothstep(0.66, 0.92, h)*uRoughVar*0.8;
    rough += fbm(uv + 61.0, vec2(8.0), 3, 0.5)*0.10;
    gl_FragColor = vec4(clamp(ao,0.0,1.0), clamp(rough,0.04,1.0), 0.0, 1.0);
  }
\`;

const NORMAL_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec2 uTexel;
  uniform float uStrength;
  float hAt(vec2 uv){ return texture2D(tH, uv).x; }
  void main(){
    vec2 t = uTexel;
    float l = hAt(vUv - vec2(t.x,0.0)), r = hAt(vUv + vec2(t.x,0.0));
    float d = hAt(vUv - vec2(0.0,t.y)), u = hAt(vUv + vec2(0.0,t.y));
    float l2 = hAt(vUv - vec2(t.x,0.0)*2.0), r2 = hAt(vUv + vec2(t.x,0.0)*2.0);
    float d2 = hAt(vUv - vec2(0.0,t.y)*2.0), u2 = hAt(vUv + vec2(0.0,t.y)*2.0);
    float dx = (r - l)*0.66 + (r2 - l2)*0.34;
    float dy = (u - d)*0.66 + (u2 - d2)*0.34;
    vec3 n = normalize(vec3(-dx*uStrength, -dy*uStrength, 1.0));
    gl_FragColor = vec4(n*0.5 + 0.5, 1.0);
  }
\`;

const TEX_VS = \`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }\`;

function bakeStoneMaps(opt){
  const o = Object.assign({
    size:2048, ormSize:1024, seed:0, period:1.0,
    beds:4.0, bedDepth:0.055, bedSoft:0.14,
    fissureCells:8.0, fissureSharp:44.0, fissureDepth:0.11,
    chipCells:6.0, chipDepth:0.12, pitCells:34.0, pitDepth:0.15,
    veinDepth:0.020, veinSharp:110.0, runnel:0.030, micro:0.030, macro:0.30, grainCells:26.0, grainAmp:0.030,
    warm:[0.69,0.67,0.64], cool:[0.59,0.60,0.615], dark:[0.36,0.353,0.353],
    pale:[0.84,0.83,0.812], vein:[0.90,0.895,0.875],
    stain:0.30, recess:0.44, bleach:0.26, dust:0.30, grain:0.028,
    rough:0.82, roughVar:0.16, ao:2.6, nrm:2.2
  }, opt||{});

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), null);
  const sc = new THREE.Scene(); sc.add(quad);
  const cam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const prevTarget = renderer.getRenderTarget();

  const mkRT = (s, type) => new THREE.WebGLRenderTarget(s, s, {
    minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
    format:THREE.RGBAFormat, type:type||THREE.UnsignedByteType,
    wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, depthBuffer:false
  });
  const run = (rt, mat) => { quad.material = mat; renderer.setRenderTarget(rt); renderer.render(sc, cam); };
  const common = { uPeriod:{value:new THREE.Vector2(o.period,o.period)}, uSeed:{value:o.seed} };

  // 1. height + masks
  const rtH = mkRT(o.size, THREE.HalfFloatType);
  run(rtH, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:HEIGHT_FS, uniforms:Object.assign({}, common, {
    uBeds:{value:o.beds}, uBedDepth:{value:o.bedDepth}, uBedSoft:{value:o.bedSoft},
    uFissureCells:{value:o.fissureCells}, uFissureSharp:{value:o.fissureSharp}, uFissureDepth:{value:o.fissureDepth},
    uChipCells:{value:o.chipCells}, uChipDepth:{value:o.chipDepth},
    uPitCells:{value:o.pitCells}, uPitDepth:{value:o.pitDepth},
    uVeinDepth:{value:o.veinDepth}, uRunnel:{value:o.runnel}, uMicro:{value:o.micro}, uMacro:{value:o.macro},
    uGrainCells:{value:o.grainCells}, uGrainAmp:{value:o.grainAmp}, uVeinSharp:{value:o.veinSharp}
  })}));

  // 2. albedo / orm / normal
  const V3 = a => new THREE.Vector3(a[0],a[1],a[2]);
  const rtA = mkRT(o.size);
  run(rtA, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:ALBEDO_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uWarm:{value:V3(o.warm)}, uCool:{value:V3(o.cool)},
    uDark:{value:V3(o.dark)}, uPale:{value:V3(o.pale)}, uVein:{value:V3(o.vein)},
    uStain:{value:o.stain}, uRecess:{value:o.recess}, uBleach:{value:o.bleach},
    uDust:{value:o.dust}, uGrain:{value:o.grain}, uGrainCells:{value:o.grainCells}, uVeinSharp:{value:o.veinSharp}
  })}));
  const rtO = mkRT(o.ormSize);
  run(rtO, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:ORM_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uTexel:{value:new THREE.Vector2(1/o.size,1/o.size)},
    uRough:{value:o.rough}, uRoughVar:{value:o.roughVar}, uAO:{value:o.ao}
  })}));
  const rtN = mkRT(o.size);
  run(rtN, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:NORMAL_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uTexel:{value:new THREE.Vector2(1/o.size,1/o.size)}, uStrength:{value:o.nrm*o.size/512}
  })}));

  // 3. read back so the maps get real mipmaps + anisotropy
  const grab = (rt, s, srgb) => {
    const buf = new Uint8Array(s*s*4);
    renderer.readRenderTargetPixels(rt, 0, 0, s, s, buf);
    const t = new THREE.DataTexture(buf, s, s, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    if(srgb) t.encoding = THREE.sRGBEncoding;
    t.needsUpdate = true;
    return t;
  };
  const out = {
    map: grab(rtA, o.size, true),
    ormMap: grab(rtO, o.ormSize, false),
    normalMap: grab(rtN, o.size, false)
  };
  out.roughnessMap = out.ormMap;
  out.aoMap = out.ormMap;

  renderer.setRenderTarget(prevTarget);
  rtH.dispose(); rtA.dispose(); rtO.dispose(); rtN.dispose();
  quad.geometry.dispose();
  return out;
}

/* A second, very high frequency normal tiled many times over the macro maps.
   The 2k maps carry the fissures and pockets; this carries the tooth of the
   stone, so the surface keeps resolving as you get closer instead of going
   smooth.                                                                  */
const DETAIL_FS = TEX_COMMON + \`
  uniform vec2 uTexel; uniform float uStrength;
  float hgt(vec2 uv){
    float a = fbm(uv, vec2(12.0), 4, 0.55);
    float b = fbm(uv + 4.4, vec2(48.0), 3, 0.5)*0.55;
    float c = 1.0 - clamp(worley(uv + 2.1, 26.0).x/0.42, 0.0, 1.0);
    float d = 1.0 - smoothstep(0.0, 0.10, worley2(uv + 8.3, vec2(16.0, 13.0)).y
                                        - worley2(uv + 8.3, vec2(16.0, 13.0)).x);
    return 0.5 + a*0.30 + b*0.18 - c*c*0.22 - d*0.10;
  }
  void main(){
    vec2 t = uTexel;
    float dx = hgt(vUv + vec2(t.x,0.0)) - hgt(vUv - vec2(t.x,0.0));
    float dy = hgt(vUv + vec2(0.0,t.y)) - hgt(vUv - vec2(0.0,t.y));
    vec3 n = normalize(vec3(-dx*uStrength, -dy*uStrength, 1.0));
    gl_FragColor = vec4(n*0.5 + 0.5, 1.0);
  }
\`;
function bakeDetailNormal(size, seed, strength){
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.ShaderMaterial({
    vertexShader:TEX_VS, fragmentShader:DETAIL_FS,
    uniforms:{ uPeriod:{value:new THREE.Vector2(1,1)}, uSeed:{value:seed},
               uTexel:{value:new THREE.Vector2(1/size,1/size)}, uStrength:{value:strength*size/512} }
  }));
  const sc = new THREE.Scene(); sc.add(quad);
  const cam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const prev = renderer.getRenderTarget();
  const rt = new THREE.WebGLRenderTarget(size, size, {
    minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, format:THREE.RGBAFormat,
    wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, depthBuffer:false });
  renderer.setRenderTarget(rt); renderer.render(sc, cam);
  const buf = new Uint8Array(size*size*4);
  renderer.readRenderTargetPixels(rt, 0, 0, size, size, buf);
  renderer.setRenderTarget(prev);
  const t = new THREE.DataTexture(buf, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  t.needsUpdate = true;
  rt.dispose(); quad.geometry.dispose();
  return t;
}
const DETAIL_N = bakeDetailNormal(1024, 3.0, 2.4);

/* Blend the detail normal into any standard material without forking the
   shader: swap the one chunk that builds the tangent-space normal.         */
function addDetailNormal(mat, scale, strength){
  mat.userData.detail = { scale, strength };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDetailMap = { value: DETAIL_N };
    shader.uniforms.uDetailScale = { value: scale };
    shader.uniforms.uDetailStrength = { value: strength };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <normalmap_pars_fragment>',
        '#include <normalmap_pars_fragment>\\nuniform sampler2D uDetailMap;\\nuniform float uDetailScale;\\nuniform float uDetailStrength;')
      .replace('#include <normal_fragment_maps>', \`
        #ifdef USE_NORMALMAP_TANGENTSPACE
          vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
          mapN.xy *= normalScale;
          vec3 detN = texture2D( uDetailMap, vUv * uDetailScale ).xyz * 2.0 - 1.0;
          mapN = normalize( vec3( mapN.xy + detN.xy * uDetailStrength, mapN.z ) );
          normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
        #else
          #include <normal_fragment_maps>
        #endif
      \`);
  };
  mat.needsUpdate = true;
  return mat;
}

function setRepeat(set, rx, ry){
  for(const k of ['map','normalMap','ormMap']) if(set[k]) set[k].repeat.set(rx,ry);
  return set;
}

/* Plinth limestone — the surface the eye spends the most time on.          */
const STONE = bakeStoneMaps({
  size:2048, ormSize:1024, seed:0.0,
  beds:5.0, bedDepth:0.034, bedSoft:0.11,
  fissureCells:7.0, fissureSharp:52.0, fissureDepth:0.16,
  chipCells:9.0, chipDepth:0.20, pitCells:30.0, pitDepth:0.15,
  veinDepth:0.024, veinSharp:120.0, runnel:0.030, micro:0.052, macro:0.30,
  grainCells:30.0, grainAmp:0.030,
  warm:[0.735,0.712,0.672], cool:[0.605,0.618,0.632], dark:[0.245,0.242,0.244],
  pale:[0.885,0.874,0.852], vein:[0.925,0.918,0.896],
  stain:0.24, recess:0.66, bleach:0.32, dust:0.30, grain:0.026,
  rough:0.82, roughVar:0.20, ao:3.2, nrm:3.0
});
setRepeat(STONE, 1.0, 0.68);

/* Loose rubble — coarser, more broken, no bedding to speak of.             */
const RUBBLE = bakeStoneMaps({
  size:1024, ormSize:512, seed:5.0,
  beds:2.0, bedDepth:0.022, bedSoft:0.24,
  fissureCells:6.0, fissureSharp:42.0, fissureDepth:0.18,
  chipCells:6.0, chipDepth:0.25, pitCells:22.0, pitDepth:0.18,
  grainCells:18.0, grainAmp:0.040,
  veinDepth:0.016, veinSharp:130.0, runnel:0.0, micro:0.036, macro:0.34,
  warm:[0.700,0.678,0.645], cool:[0.590,0.601,0.615], dark:[0.235,0.232,0.234],
  pale:[0.845,0.836,0.818], vein:[0.895,0.889,0.870],
  stain:0.26, recess:0.64, bleach:0.28, dust:0.26, grain:0.030,
  rough:0.86, roughVar:0.16, ao:3.4, nrm:2.6
});

/* Statue marble — dense, faintly veined, weathered only in the hollows.    */
const MARBLE = bakeStoneMaps({
  size:2048, ormSize:1024, seed:11.0,
  beds:2.0, bedDepth:0.012, bedSoft:0.26,
  fissureCells:26.0, fissureSharp:68.0, fissureDepth:0.055,
  chipCells:10.0, chipDepth:0.070, pitCells:42.0, pitDepth:0.070,
  grainCells:44.0, grainAmp:0.014,
  veinDepth:0.012, veinSharp:150.0, runnel:0.012, micro:0.020, macro:0.14,
  warm:[0.885,0.872,0.850], cool:[0.828,0.833,0.840], dark:[0.470,0.462,0.455],
  pale:[0.965,0.962,0.952], vein:[0.975,0.972,0.964],
  stain:0.22, recess:0.42, bleach:0.24, dust:0.22, grain:0.018,
  rough:0.52, roughVar:0.28, ao:2.6, nrm:2.4
});
setRepeat(MARBLE, 4.4, 4.4);

/* =====================================================================
   3. background haze  (drawn first, occluded by geometry)
   ===================================================================== */
/* The reference background is a narrow vertical shaft of light sitting inside a
   broad halo.  Both terms were fitted to the source frame in sRGB, so the
   shader builds the target sRGB value and then inverts the tone curve.      */
const bgMat = new THREE.ShaderMaterial({
  depthTest:false, depthWrite:false,
  uniforms:{
    uShaft :{value:new THREE.Vector4(50.8/255.0, 0.522, 0.292, 0.0)}, // amp, cx, cy
    uShaftS:{value:new THREE.Vector2(0.055, 0.201)},
    uHalo  :{value:new THREE.Vector4(58.3/255.0, 0.522, 0.440, 0.0)},
    uHaloS :{value:new THREE.Vector2(0.300, 0.310)},
    uVig   :{value:new THREE.Vector2(0.86, 0.24)},
    uTintA :{value:new THREE.Color(0xfff7ec)},
    uTintB :{value:new THREE.Color(0xdad8d4)},
    uGain  :{value:1.07}
  },
  vertexShader:\`varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,1.0,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv;
    uniform vec4 uShaft,uHalo; uniform vec2 uShaftS,uHaloS,uVig;
    uniform vec3 uTintA,uTintB; uniform float uGain;
    // exact inverse of the ACES fit used in the final pass
    float invAces(float y){
      const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
      float A=y*c-a, B=y*d-b, C=y*e;
      if(abs(A)<1e-5) return -C/max(B,1e-5);
      float disc = max(B*B-4.0*A*C, 0.0);
      float x = (-B - sqrt(disc))/(2.0*A);
      if(x<0.0) x = (-B + sqrt(disc))/(2.0*A);
      return clamp(x, 0.0, 60.0);
    }
    void main(){
      vec2 p = vec2(vUv.x, 1.0-vUv.y);
      vec2 d1 = (p-uShaft.yz)/uShaftS;
      vec2 d2 = (p-uHalo.yz)/uHaloS;
      float g1 = exp(-0.5*dot(d1,d1));
      float g2 = exp(-0.5*dot(d2,d2));
      float s  = (uShaft.x*g1 + uHalo.x*g2)*uGain;
      vec2 q = (vUv-0.5)*vec2(1.0,0.90);
      s *= mix(uVig.y, 1.0, smoothstep(0.74, 0.30, length(q)));
      vec3 tint = mix(uTintB, uTintA, clamp(g1*1.6+g2*0.5,0.0,1.0));
      float lin = invAces(pow(clamp(s,0.0,1.0), 2.2));
      gl_FragColor = vec4(tint*lin, 1.0);
    }\`
});
const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), bgMat);
bgQuad.frustumCulled = false;
bgQuad.renderOrder = -10;
scene.add(bgQuad);

/* =====================================================================
   4. environment + lights
   ===================================================================== */
/* A tiny procedural sky — near-black surround, one warm high blob where the
   shaft sits and a dim cool bounce below.  Through PMREM it gives the stone
   a roughness-aware specular response, which is most of what separates
   "3D render" from "lit photograph".                                      */
function environmentTexture(){
  const W=256,H=128;
  const c=document.createElement('canvas'); c.width=W; c.height=H;
  const ctx=c.getContext('2d'); const img=ctx.createImageData(W,H); const d=img.data;
  const L=new THREE.Vector3(-0.34,0.86,-0.38).normalize();
  for(let y=0;y<H;y++){
    const th=(0.5-(y+0.5)/H)*Math.PI;                    // +pi/2 zenith
    for(let x=0;x<W;x++){
      const ph=((x+0.5)/W)*Math.PI*2-Math.PI;
      const dir=new THREE.Vector3(Math.cos(th)*Math.sin(ph), Math.sin(th), Math.cos(th)*Math.cos(ph));
      const up=Math.max(0,dir.y);
      const cosA=Math.max(-1,Math.min(1,dir.dot(L)));
      const ang=Math.acos(cosA);
      const blob=Math.exp(-(ang*ang)/0.30)*2.4 + Math.exp(-(ang*ang)/1.60)*0.42;
      const sky=Math.pow(up,1.6)*0.16;
      const floorBounce=Math.pow(Math.max(0,-dir.y),2.0)*0.05;
      const r=(blob*1.00+sky*0.90+floorBounce*0.75+0.012);
      const g=(blob*0.94+sky*0.94+floorBounce*0.80+0.012);
      const b=(blob*0.82+sky*1.00+floorBounce*0.95+0.014);
      const i=(y*W+x)*4;
      d[i]  =Math.min(255,Math.pow(Math.min(1,r),1/2.2)*255);
      d[i+1]=Math.min(255,Math.pow(Math.min(1,g),1/2.2)*255);
      d[i+2]=Math.min(255,Math.pow(Math.min(1,b),1/2.2)*255);
      d[i+3]=255;
    }
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);
  t.mapping=THREE.EquirectangularReflectionMapping;
  t.encoding=THREE.sRGBEncoding;
  return t;
}
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTex = environmentTexture();
  scene.environment = pmrem.fromEquirectangular(envTex).texture;
  envTex.dispose(); pmrem.dispose();
}

const key = new THREE.DirectionalLight(0xfff3e6, 3.45);
key.position.set(-1.4, 7.4, -2.6);
key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
key.shadow.camera.left = -3.2; key.shadow.camera.right = 3.2;
key.shadow.camera.top  =  4.2; key.shadow.camera.bottom = -3.6;
key.shadow.camera.near = 0.5;  key.shadow.camera.far = 18;
key.shadow.bias = -0.0006;
key.shadow.normalBias = 0.055;
key.shadow.radius = 1.2;
scene.add(key);
scene.add(key.target);
key.target.position.set(0, Y_PLINTH-0.2, 0);

const rim = new THREE.DirectionalLight(0xcdd0d6, 0.42);
rim.position.set(5.0, 2.0, -5.0);
scene.add(rim);

const fill = new THREE.HemisphereLight(0x9a999b, 0x08080a, 0.06);
const frontFill = new THREE.PointLight(0xefe9e1, 0.70, 26, 1.25);
frontFill.position.set(-4.0, 5.4, 4.6);
scene.add(frontFill);
scene.add(fill);

const shaftLight = new THREE.PointLight(0xffeeda, 2.6, 18, 2.0);
shaftLight.position.set(-0.5, 4.6, -1.1);
scene.add(shaftLight);

/* =====================================================================
   5. orbit rings
   ===================================================================== */
const ringMat = (col, boost) => new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{
    uColor:{value:new THREE.Color(col)},
    uBoost:{value:boost},
    uPhase:{value:0},
    uCam:{value:new THREE.Vector3()},
    uLightDir:{value:new THREE.Vector3(-0.42,0,-0.91)}
  },
  vertexShader:\`
    varying vec3 vW; varying vec2 vUv; varying vec3 vN;
    void main(){
      vUv=uv; vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz;
      vN = normalize(mat3(modelMatrix)*normal);
      gl_Position = projectionMatrix*viewMatrix*w;
    }\`,
  fragmentShader:\`
    varying vec3 vW; varying vec2 vUv; varying vec3 vN;
    uniform vec3 uColor,uCam,uLightDir; uniform float uBoost,uPhase;
    void main(){
      // radial direction of this point of the ring, in world space
      vec3 dir = normalize(vec3(vW.x, 0.0, vW.z));
      vec3 toCam = normalize(vec3(uCam.x, 0.0, uCam.z));
      float near = 0.5 + 0.5*dot(dir, toCam);            // 1 on the near arc
      float lit  = clamp(0.5 + 0.5*dot(dir, uLightDir), 0.0, 1.0);   // 1 facing the shaft
      float w = (0.45 + 0.55*pow(smoothstep(0.02,0.98,near),0.75))
              * (0.46 + 0.54*pow(max(lit,0.0),0.9));
      // soft edge across the tube so the core blooms and the rim feathers
      float t = abs(vUv.y-0.5)*2.0;
      float core = smoothstep(1.0, 0.62, t);
      gl_FragColor = vec4(uColor*uBoost*w*core, w*core);
    }\`
});

/* Each orbit is a bundle of fine strands winding around a common path rather
   than one fat tube — they read as spun light, and the twist gives the ring
   something to catch the eye as it turns.                                   */
class StrandCurve extends THREE.Curve {
  constructor(R, w, wy, turns, phase, wob){
    super(); this.R=R; this.w=w; this.wy=wy; this.turns=turns; this.phase=phase; this.wob=wob||0;
  }
  getPoint(t, target){
    target = target || new THREE.Vector3();
    const a = t*Math.PI*2, s = a*this.turns + this.phase;
    // a second, slower undulation so no two strands stay parallel for long
    const q = a*2.0 + this.phase*1.7;
    const r = this.R + Math.cos(s)*this.w + Math.cos(q)*this.wob;
    target.set(Math.cos(a)*r, Math.sin(s)*this.wy + Math.sin(q)*this.wob*0.6, Math.sin(a)*r);
    return target;
  }
}
/* Each orbit is a loose skein of very fine filaments rather than one rope:
   more of them, thinner, spread over a wider bundle, each on its own twist
   rate so they braid, cross and separate along the run.                    */
function makeRing(radius, tube, y, colour, boost, opt){
  const o = Object.assign({
    strands:9, turns:11, spread:0.042, seg:700, radial:10,
    gain:[1.0,0.62,0.86,0.48,0.74,0.94,0.55,0.80,0.66]
  }, opt||{});
  const group = new THREE.Group();
  const pr = mulberry32(7717 + Math.round(radius*1000));
  for(let i=0;i<o.strands;i++){
    const phase = (i/o.strands)*Math.PI*2 + pr()*0.9;
    const turns = Math.max(3, Math.round(o.turns*(0.62 + pr()*0.85)));
    const off   = (pr()-0.5)*o.spread*1.15;
    const w     = o.spread*(0.45 + pr()*0.85);
    const wy    = o.spread*(0.40 + pr()*0.80);
    const curve = new StrandCurve(radius + off, w, wy, turns, phase, o.spread*0.30*pr());
    const g = new THREE.TubeGeometry(curve, o.seg, tube*(0.72 + pr()*0.65), o.radial, true);
    const m = ringMat(colour, boost*(o.gain[i%o.gain.length]));
    const mesh = new THREE.Mesh(g, m);
    mesh.renderOrder = 6;
    group.add(mesh);
  }
  group.position.y = y;
  scene.add(group);
  return group;
}
const ringTop = makeRing(R_RING_TOP, 0.0040, Y_RING_TOP, 0xffbb68, 13.5, {strands:9, turns:12, spread:0.028});
const ringLow = makeRing(R_RING_LOW, 0.0037, Y_RING_LOW, 0xffbe6e, 13.5, {strands:9, turns:9,  spread:0.025});

/* A wider halo of orbits at mixed inclinations — the thing an orrery is: a
   nest of paths around one centre.  Dimmer and finer than the two principal
   rings so they read as depth rather than competing with them.             */
const haloRings = [];
{
  const spec = [
    {r:2.42, y:2.30, tilt:[ 0.22, 0.00, 0.09], s:5, g:0.15, tw:14},
    {r:2.10, y:1.32, tilt:[-0.17, 0.62,-0.11], s:5, g:0.13, tw:10},
    {r:2.86, y:2.86, tilt:[ 0.12, 1.20, 0.20], s:4, g:0.11, tw:16}
  ];
  spec.forEach((k,i)=>{
    const g = makeRing(k.r, 0.0026, k.y, i%2 ? 0xffc078 : 0xffb862, 13.5*k.g,
                       {strands:k.s, turns:k.tw, spread:0.030, seg:520, radial:8});
    g.rotation.set(k.tilt[0], k.tilt[1], k.tilt[2]);
    g.userData.spin = (i%2?1:-1)*(0.010 + i*0.004);
    haloRings.push(g);
  });
}

/* =====================================================================
   6. the bluff
   ===================================================================== */
/* PolyhedronGeometry and MarchingCubes both hand back *non-indexed* meshes, so
   computeVertexNormals() gives every triangle its own normal and the silhouette
   reads as facets.  This averages normals across coincident positions while
   leaving the UV seams intact, which is what actually makes the rock look like
   rock instead of a die.                                                     */
function smoothNormals(geo, tol){
  geo.computeVertexNormals();
  const pos = geo.attributes.position, nor = geo.attributes.normal;
  const n = pos.count, q = 1/(tol||1e-4);
  const acc = new Map();
  const key = i => (Math.round(pos.getX(i)*q)+'_'+Math.round(pos.getY(i)*q)+'_'+Math.round(pos.getZ(i)*q));
  for(let i=0;i<n;i++){
    const k = key(i);
    let a = acc.get(k);
    if(!a){ a=[0,0,0]; acc.set(k,a); }
    a[0]+=nor.getX(i); a[1]+=nor.getY(i); a[2]+=nor.getZ(i);
  }
  for(let i=0;i<n;i++){
    const a = acc.get(key(i));
    const l = Math.hypot(a[0],a[1],a[2]) || 1;
    nor.setXYZ(i, a[0]/l, a[1]/l, a[2]/l);
  }
  nor.needsUpdate = true;
  return geo;
}

// bake a vertical falloff into vertex colours so the mass dissolves downward
function depthFade(geo, offsetY, y0, y1){
  const pos=geo.attributes.position, n=pos.count;
  const col=new Float32Array(n*3);
  for(let i=0;i<n;i++){
    const wy=pos.getY(i)+offsetY;
    let k=(wy-y0)/(y1-y0); k=Math.max(0,Math.min(1,k));
    k=Math.pow(k,0.75);
    const v=0.34+0.66*k;
    col[i*3]=col[i*3+1]=col[i*3+2]=v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  return geo;
}

function erode(geo, opts){
  const o = Object.assign({amp:.05, freq:1.6, strata:0, strataAmp:0, seed:0},opts||{});
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const n  = fbm3(v.x*o.freq+o.seed, v.y*o.freq*1.6+o.seed, v.z*o.freq+o.seed, 4, 2.1, .55);
    const n2 = fbm3(v.x*o.freq*4.3+11, v.y*o.freq*6.1, v.z*o.freq*4.3, 3, 2.05, .5);
    const n3 = fbm3(v.x*o.freq*13.0+29, v.y*o.freq*17.0, v.z*o.freq*13.0, 2);
    let d = n*o.amp + n2*o.amp*0.34 + n3*o.amp*0.12;
    if(o.strata){
      const band = Math.sin(v.y*o.strata + fbm3(v.x*.9,v.y*.4,v.z*.9,2)*2.2);
      d += band*o.strataAmp;
    }
    const dir = v.clone().normalize();
    v.addScaledVector(dir, d);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

const stoneMat = new THREE.MeshStandardMaterial({
  map:STONE.map, normalMap:STONE.normalMap, roughnessMap:STONE.ormMap, aoMap:STONE.ormMap, aoMapIntensity:0.9,
  normalScale:new THREE.Vector2(1.15,1.15),
  color:0x93918e, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.52,
});
addDetailNormal(stoneMat, 9.0, 0.65);

/* ---------------------------------------------------------------------
   Box-projected UVs for the masonry.

   BoxGeometry lays one whole copy of the map on each face however long or
   short that face is, which is right for the bluff — the stretch is where
   its long cracks come from — and wrong for a wall of a thousand stones,
   where it would put the whole 2k map on every pebble.  Choosing the axis
   from which face the vertex sits on (rather than from its normal, which
   the displacement has already bent) and scaling by world size instead
   gives the masonry one texel density from quoin to fallen block.
   --------------------------------------------------------------------- */
function boxUV(geo, hx, hy, hz, scale, ox, oy){
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
    const ex=Math.abs(x)/hx, ey=Math.abs(y)/hy, ez=Math.abs(z)/hz;
    let u,v;
    if(ey>=ex && ey>=ez){ u=x; v=z; }
    else if(ex>=ez)     { u=z; v=y; }
    else                { u=x; v=y; }
    uv[i*2]   = u*scale + (ox||0);
    uv[i*2+1] = v*scale + (oy||0);
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  return geo;
}

function tintGeo(geo, v){
  const n = geo.attributes.position.count;
  const c = new Float32Array(n*3); c.fill(v);
  geo.setAttribute('color', new THREE.BufferAttribute(c,3));
  return geo;
}

const plinth = new THREE.Group();
scene.add(plinth);

/* The bluff the keep stands on.  Same bedded limestone as the orrery's
   shelf and the same four-part build — lip, slab, ledge, broken base —
   but widened across z so there is ground to build on, and cut back
   underneath so the mass still falls away into the dark.                 */

// overhanging top lip — the bright eroded band that reads first
{
  const g = new THREE.BoxGeometry(3.08,0.19,1.52, 240,26,130);
  const pos=g.attributes.position, v=new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const n = fbm3(v.x*3.4+7, v.y*7.0, v.z*3.4+2, 4, 2.1, .55);
    const edge = Math.max(Math.abs(v.x)/1.54, Math.abs(v.z)/0.76);
    const k = Math.pow(Math.max(0,edge-0.55)/0.45, 1.4);
    v.x += n*0.072*k; v.z += n*0.072*k;
    // the ground the walls sit on stays nearly flat; only the lip is chewed
    v.y += n*0.014*(0.16+k*1.5) + (v.y>0 ? 0 : -0.018*Math.abs(n));
    pos.setXYZ(i,v.x,v.y,v.z);
  }
  g.computeVertexNormals();
  depthFade(g, Y_PLINTH-0.095, Y_PLINTH-3.1, Y_PLINTH-0.05);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.y = Y_PLINTH - 0.095;
  plinth.add(m);
}
// main slab — broad, shallow, eroded lip
{
  const g = new THREE.BoxGeometry(2.90,0.86,1.34, 240,72,116);
  erode(g,{amp:.030, freq:2.6, strata:22.0, strataAmp:.010, seed:3.1});
  depthFade(g, Y_PLINTH-0.62, Y_PLINTH-3.1, Y_PLINTH-0.05);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.y = Y_PLINTH - 0.62;
  plinth.add(m);
}
// lower step, slightly narrower
{
  const g = new THREE.BoxGeometry(2.76,0.46,1.50, 200,44,116);
  {  // round the beam's leading edge so it reads as a moulding, not a shelf
    const pos=g.attributes.position, v=new THREE.Vector3();
    for(let i=0;i<pos.count;i++){
      v.fromBufferAttribute(pos,i);
      const ry=Math.abs(v.y)/0.23, rz=Math.abs(v.z)/0.75;
      const r=Math.min(1,Math.hypot(ry,rz));
      const k=Math.pow(r,3.0)*0.22;
      v.y*=1-k; v.z*=1-k;
      pos.setXYZ(i,v.x,v.y,v.z);
    }
    g.computeVertexNormals();
  }
  erode(g,{amp:.030, freq:3.2, strata:22.0, strataAmp:.010, seed:8.7});
  depthFade(g, Y_PLINTH-1.14, Y_PLINTH-3.0, Y_PLINTH-0.05);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.y = Y_PLINTH - 1.14;   // ledge tucked just under the main slab
  plinth.add(m);
}
// broken base, tapering away into the dark
{
  const g = new THREE.BoxGeometry(2.54,1.10,1.18, 150,68,84);
  erode(g,{amp:.11, freq:2.1, strata:11.0, strataAmp:.022, seed:21.4});
  const p=g.attributes.position, v=new THREE.Vector3();
  for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i);
    const k=(0.55-v.y)/1.1; v.x*=1-0.34*k; v.z*=1-0.34*k; p.setXYZ(i,v.x,v.y,v.z); }
  g.computeVertexNormals();
  depthFade(g, Y_PLINTH-1.76, Y_PLINTH-2.7, Y_PLINTH-0.7);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.y = Y_PLINTH - 1.76;
  m.rotation.y = .14;
  plinth.add(m);
}
{
  const g = rockGeometry(5, 44, 0.86);
  g.scale(0.60,0.60,0.60);
  erode(g,{amp:.14, freq:2.4, seed:44.2});
  smoothNormals(g, 2e-4);
  depthFade(g, Y_PLINTH-2.58, Y_PLINTH-3.0, Y_PLINTH-1.4);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(0.06, Y_PLINTH-2.58, -0.04);
  m.scale.set(1.24,0.86,1.06);
  plinth.add(m);
}

/* =====================================================================
   7. the keep
   ===================================================================== */
/* The dressed stone of the arches, jambs and copings.  Paler and denser
   than the walling, weathered only in the hollows — the same marble the
   orrery's lantern was cut from, dropped a little in value so it reads as
   good limestone against rubble rather than as inlay.                    */
const marbleMat = new THREE.MeshStandardMaterial({
  map:MARBLE.map, normalMap:MARBLE.normalMap, roughnessMap:MARBLE.ormMap, aoMap:MARBLE.ormMap, aoMapIntensity:0.75,
  normalScale:new THREE.Vector2(1.9,1.9),
  color:0xa8a29a, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.42,
});
addDetailNormal(marbleMat, 14.0, 0.60);

const ruin = new THREE.Group();
ruin.position.set(0.00, Y_PLINTH, 0.00);
scene.add(ruin);

/* ---------------------------------------------------------------------
   Masonry.

   Nothing here is a modelled ruin.  Every wall is laid one stone at a
   time — courses of uneven depth, a running bond, a little slop in the
   seating — against a crown profile that says how high that wall still
   stands at each point along its run.  A block whose top would rise above
   the crown is never laid; a block just under it is dropped on a coin
   toss; a block inside an opening is skipped.  The broken tops, the
   fallen corner and the gap over the gate all come out of that one rule,
   which is why they read as collapse rather than as modelled damage.

   A thousand stones would be a thousand draw calls, so the keep is baked
   down to two merged buffers: rubble limestone for the walling, dressed
   marble for the arches, jambs and copings.
   --------------------------------------------------------------------- */
function mergeGeos(list){
  const parts = list.map(g => g.index ? g.toNonIndexed() : g);
  let n = 0;
  for(const g of parts) n += g.attributes.position.count;
  const pos = new Float32Array(n*3), nor = new Float32Array(n*3);
  const uv  = new Float32Array(n*2), col = new Float32Array(n*3);
  let o = 0;
  for(const g of parts){
    const a = g.attributes;
    pos.set(a.position.array, o*3);
    nor.set(a.normal.array,   o*3);
    uv .set(a.uv.array,       o*2);
    if(a.color) col.set(a.color.array, o*3); else col.fill(1, o*3, (o+a.position.count)*3);
    o += a.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos,3));
  out.setAttribute('normal',   new THREE.BufferAttribute(nor,3));
  out.setAttribute('uv',       new THREE.BufferAttribute(uv,2));
  out.setAttribute('color',    new THREE.BufferAttribute(col,3));
  return out;
}

/* One stone: a box with its arrises knocked off and fbm across the faces.
   Cached, so a keep of a thousand stones bakes about forty.              */
const blockCache = new Map();
function stoneBlock(w,h,d,seed,wear){
  const key = w.toFixed(3)+':'+h.toFixed(3)+':'+d.toFixed(3)+':'+seed+':'+wear.toFixed(2);
  const hit = blockCache.get(key);
  if(hit) return hit;
  const g = new THREE.BoxGeometry(w,h,d, 4,3,3);
  const pos = g.attributes.position, v = new THREE.Vector3(), dir = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const ex = Math.abs(v.x)/(w*0.5), ey = Math.abs(v.y)/(h*0.5), ez = Math.abs(v.z)/(d*0.5);
    const arris = Math.pow(Math.max(0,(ex+ey+ez-1.45)/1.55), 1.25);   // 0 on a face, 1 at a corner
    const n1 = fbm3(v.x*11.0+seed*3.7, v.y*11.0+seed, v.z*11.0+seed*1.9, 3, 2.1, .55);
    const n2 = fbm3(v.x*37.0+seed, v.y*37.0, v.z*37.0, 2);
    dir.copy(v).normalize();
    v.multiplyScalar(1 - arris*0.085*wear);
    v.addScaledVector(dir, (n1*0.010 + n2*0.004)*wear);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  boxUV(g, w*0.5, h*0.5, d*0.5, 3.4, (seed*0.37)%1, (seed*0.71)%1);
  blockCache.set(key, g);
  return g;
}

const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _q3 = new THREE.Quaternion();
const _e1 = new THREE.Euler(), _e2 = new THREE.Euler(), _p1 = new THREE.Vector3();
const _one = new THREE.Vector3(1,1,1), _m1 = new THREE.Matrix4();
function place(out, geo, x,y,z, rx,ry,rz, tint){
  const g = geo.clone();
  _e1.set(rx,ry,rz,'YXZ'); _q1.setFromEuler(_e1); _p1.set(x,y,z);
  g.applyMatrix4(_m1.compose(_p1,_q1,_one));
  tintGeo(g, tint);
  out.push(g);
  return g;
}

const WALL = [];          // rubble limestone
const DRESS = [];         // dressed marble
const BLOCK_W = [0.072, 0.096, 0.128, 0.168];
const COURSE  = 0.062;    // nominal bed depth; each course varies about it

/* Lay one straight run of coursed masonry between two points.  Openings
   are given as fractions of the run so a wall can be resized without
   re-placing its doors.                                                  */
function courseWall(o){
  const dx = o.x1-o.x0, dz = o.z1-o.z0;
  const L  = Math.hypot(dx,dz);
  const ux = dx/L, uz = dz/L;
  const rotY = Math.atan2(-dz, dx);            // local +x runs along the wall
  const base = o.course || COURSE;
  const joint = o.joint===undefined ? 0.008 : o.joint;
  const wear = o.wear===undefined ? 1.0 : o.wear;
  const out = o.out || WALL;
  const pr = mulberry32(4001 + Math.round(o.seed*617));
  const y0 = o.y0 || 0;
  const ops = (o.openings||[]).map(op => Object.assign({}, op, {s0:op.u0*L, s1:op.u1*L}));
  let yb = y0;
  for(let r=0; yb < y0 + (o.hmax||1.6); r++){
    const ch = base*(0.80 + pr()*0.44);        // no two beds the same depth
    const yt = yb + ch - joint;
    const inset = o.inset ? o.inset(r) : 0;
    let s = inset + (r%2 ? base*0.9 : 0) + pr()*0.02;
    let guard = 0;
    while(s < L-inset && guard++ < 320){
      const w = BLOCK_W[(pr()*BLOCK_W.length)|0];
      if(s + w > L-inset + 0.015) break;
      const cs = s + w*0.5;
      const x  = o.x0 + ux*cs, z = o.z0 + uz*cs;
      const crown = o.crown(cs/L, x, z);
      s += w + joint*0.7;
      if(yt > crown) continue;
      if(crown - yt < ch*2.2 && pr() < 0.34) continue;      // the crumbling course
      if(pr() < 0.014) continue;                            // a stone gone from the face
      let blocked = false;
      for(const op of ops){
        if(cs > op.s0-w*0.34 && cs < op.s1+w*0.34 && yt > op.y0 && yb < op.y1){ blocked=true; break; }
      }
      if(blocked) continue;
      const g = stoneBlock(w, ch-joint, o.t, ((r*13 + ((cs*97)|0)) % 11)+1, wear);
      const jx = (pr()-0.5)*0.009, jy = (pr()-0.5)*0.004;
      // value drifts by bed, the way a quarry's courses do, then a hair by stone
      const bed = 0.975 + 0.045*Math.sin(r*1.7 + o.seed);
      place(out, g,
        x - uz*jx, (yb+yt)*0.5 + jy, z + ux*jx,
        (pr()-0.5)*0.016, rotY + (pr()-0.5)*0.030, (pr()-0.5)*0.016,
        (o.tint||1.08)*bed*(0.985 + pr()*0.030));
    }
    yb += ch;
  }
  /* The core.  A faced wall is two skins over a rubble fill; without it
     the daylight behind the keep comes straight through every joint.  The
     fill is cut as narrow vertical prisms that follow the crown profile
     and stop short of the openings, arch heads included.               */
  if(o.core !== false){
    const step = 0.058;
    const pr2 = mulberry32(9100 + Math.round(o.seed*211));
    for(let cs=step*0.5; cs<L; cs+=step){
      const x = o.x0+ux*cs, z = o.z0+uz*cs;
      let spans = [[y0-0.03, o.crown(cs/L,x,z) - 0.010]];
      for(const op of ops){
        if(cs <= op.s0 || cs >= op.s1) continue;
        const rr = (op.s1-op.s0)*0.5, d = cs-(op.s0+op.s1)*0.5;
        const top = op.arch ? op.y1 + Math.sqrt(Math.max(0, rr*rr-d*d)) : op.y1;
        const cut = [op.y0-0.02, top+0.004];
        const next = [];
        for(const [a,b] of spans){
          if(cut[1] <= a || cut[0] >= b){ next.push([a,b]); continue; }
          if(cut[0] > a) next.push([a, cut[0]]);
          if(cut[1] < b) next.push([cut[1], b]);
        }
        spans = next;
      }
      for(const [a,b] of spans){
        if(b-a < 0.025) continue;
        const g = new THREE.BoxGeometry(step*1.12, b-a, o.t*0.66, 2,3,2);
        g.computeVertexNormals();
        boxUV(g, step*0.56, (b-a)*0.5, o.t*0.33, 3.4, pr2(), pr2());
        place(out, g, x, (a+b)*0.5, z, 0, rotY, 0, 0.80 + pr2()*0.06);
      }
    }
  }

  // dressed jambs and arch heads for the openings that get them
  for(const op of ops){
    if(!op.dress) continue;
    if(op.jamb!==false){
      for(const side of [op.s0, op.s1]){
        const dir = side===op.s0 ? -1 : 1;
        for(let y=y0+base*0.5; y<op.y1-base*0.3; y+=base*1.06){
          const g = stoneBlock(0.044, base*0.94, o.t*1.03, 30+((y*100)|0)%7, 0.4);
          const ss = side + dir*0.023;
          place(DRESS, g, o.x0+ux*ss, y, o.z0+uz*ss, 0, rotY, 0, 1.00);
        }
      }
    }
    if(op.arch){
      const cs = (op.s0+op.s1)*0.5;
      archHead({
        cx:o.x0+ux*cs, cy:op.y1, cz:o.z0+uz*cs,
        r:(op.s1-op.s0)*0.5, t:o.t*1.03, depth:0.050, n:op.n||9, rotY, tint:1.02
      });
    }
  }
}

/* The head of an opening: wedge stones turned about the springing line,
   with a deeper keystone at the crown.                                   */
function archHead(o){
  const n = o.n;
  const ux = Math.cos(o.rotY), uz = -Math.sin(o.rotY);
  const tang = (Math.PI*o.r/n)*0.90;
  _q2.setFromEuler(_e1.set(0, o.rotY, 0, 'YXZ'));
  for(let i=0;i<n;i++){
    const a = Math.PI*(i+0.5)/n;
    const key = 1 - Math.abs((i+0.5) - n*0.5)/(n*0.5);
    const rd = o.depth*(1 + key*0.22);
    const rr = o.r + rd*0.5;
    const g = stoneBlock(tang, rd, o.t, 60+i, 0.36);
    _q3.copy(_q2).multiply(_q1.setFromEuler(_e2.set(0,0,a-Math.PI/2)));
    _p1.set(o.cx + ux*Math.cos(a)*rr, o.cy + Math.sin(a)*rr, o.cz + uz*Math.cos(a)*rr);
    const gg = g.clone();
    gg.applyMatrix4(_m1.compose(_p1, _q3, _one));
    tintGeo(gg, o.tint*(0.97+key*0.06));
    DRESS.push(gg);
  }
}

/* Merlons left on the stretches of wall-walk that survive.               */
function merlons(o){
  const dx=o.x1-o.x0, dz=o.z1-o.z0, L=Math.hypot(dx,dz);
  const ux=dx/L, uz=dz/L, rotY=Math.atan2(-dz,dx);
  const pr = mulberry32(6100 + Math.round(o.seed*331));
  const base = o.course || COURSE;
  for(let s=o.from; s<o.to; s+=o.step){
    const x=o.x0+ux*s, z=o.z0+uz*s;
    const crown=o.crown(s/L,x,z);
    if(crown < o.min) continue;
    const top=(o.y0||0) + Math.floor((crown-(o.y0||0))/base)*base;
    const nUp = pr()<0.34 ? 2 : 3;                 // some are already down a course
    for(let k=0;k<nUp;k++){
      const g = stoneBlock(0.128, base*0.92, o.t*0.94, 70+((s*70)|0)%6, 1.15);
      place(WALL, g, x, top+base*(k+0.5), z,
        (pr()-0.5)*0.024, rotY+(pr()-0.5)*0.04, (pr()-0.5)*0.024, 1.08);
    }
  }
}

/* ---- the great keep --------------------------------------------------- */
const KX=-0.05, KZ=0.02, KH=0.445, KT=0.150, KY=-0.040;
const KEEP_CROWN = [1.60, 1.30, 0.82, 1.44];      // +x, +z, -x, -z corners
function keepCrown(x,z){
  const a = Math.atan2(z-KZ, x-KX);
  const u = (((a/(Math.PI*2))+1)%1)*4;
  const i = Math.floor(u), f = u-i, s = f*f*(3-2*f);
  const h = KEEP_CROWN[i%4]*(1-s) + KEEP_CROWN[(i+1)%4]*s;
  return KY + h + fbm3(x*2.6+3.3, 0.7, z*2.6, 3, 2.1, .55)*0.15;
}
{
  const insetA = r => (r%2 ? KT : 0);
  const insetB = r => (r%2 ? 0 : KT);
  // battered base — two wider courses the whole tower stands on
  for(const [ax, az, len, ang] of [[0,KH,1,0],[0,-KH,1,0],[KH,0,0,1],[-KH,0,0,1]]){
    const half = ang ? KH : KH+0.020;
    const pr = mulberry32(880 + ax*31 + az*57 + ang*7);
    for(let k=0;k<2;k++){
      for(let s=-half+0.04; s<half-0.02; s+=0.104){
        const nx = ang ? Math.sign(ax) : 0, nz = ang ? 0 : Math.sign(az);
        const x = KX + nx*(KH+0.028-k*0.012) + (ang? 0 : s);
        const z = KZ + nz*(KH+0.028-k*0.012) + (ang? s : 0);
        const g = stoneBlock(0.100, 0.052, 0.072, 12+k, 0.9);
        place(WALL, g, x, KY+0.026+k*0.054, z, 0, ang? Math.PI/2 : 0, 0, 1.06+pr()*0.03);
      }
    }
  }
  // south face — the doorway, and the face the curtain wall dies into
  courseWall({x0:KX-KH, z0:KZ+KH-KT/2, x1:KX+KH, z1:KZ+KH-KT/2,
    t:KT, y0:KY, hmax:1.76, seed:1, inset:insetA, crown:keepCrown,
    openings:[{u0:0.355,u1:0.585,y0:-0.10,y1:0.30, dress:true, arch:true, n:11},
              {u0:0.395,u1:0.530,y0:0.66, y1:0.92, dress:true, arch:true, n:7}]});
  // north face
  courseWall({x0:KX+KH, z0:KZ-KH+KT/2, x1:KX-KH, z1:KZ-KH+KT/2,
    t:KT, y0:KY, hmax:1.76, seed:2, inset:insetA, crown:keepCrown,
    openings:[{u0:0.400,u1:0.530,y0:0.98,y1:1.22, dress:true, arch:true, n:7},
              {u0:0.640,u1:0.740,y0:0.42,y1:0.62, dress:true, arch:true, n:5}]});
  // east face — the tall corner
  courseWall({x0:KX+KH-KT/2, z0:KZ+KH, x1:KX+KH-KT/2, z1:KZ-KH,
    t:KT, y0:KY, hmax:1.76, seed:3, inset:insetB, crown:keepCrown,
    openings:[{u0:0.380,u1:0.510,y0:0.58,y1:0.86, dress:true, arch:true, n:7},
              {u0:0.400,u1:0.510,y0:1.22,y1:1.44, dress:true, arch:true, n:7}]});
  // west face — the one that came down
  courseWall({x0:KX-KH+KT/2, z0:KZ-KH, x1:KX-KH+KT/2, z1:KZ+KH,
    t:KT, y0:KY, hmax:1.76, seed:4, inset:insetB, crown:keepCrown,
    openings:[{u0:0.370,u1:0.490,y0:0.34,y1:0.58, dress:true, arch:true, n:7}]});

  /* Quoins.  Long-and-short dressed stones interlocking at each corner —
     the one detail that stops four flat faces reading as four flat faces. */
  for(let c=0;c<4;c++){
    const sx = (c===0||c===3) ? 1 : -1;
    const sz = (c===0||c===1) ? 1 : -1;
    const pr = mulberry32(2400 + c*97);
    let y = KY + 0.030;
    for(let r=0; r<40; r++){
      const ch = COURSE*(0.86 + pr()*0.34);
      const longX = (r%2 === c%2);
      const x = KX + sx*(longX ? KH-0.082 : KH-KT/2);
      const z = KZ + sz*(longX ? KH-KT/2 : KH-0.082);
      if(y + ch > keepCrown(x,z)) break;
      const g = stoneBlock(0.164, ch-0.008, KT*0.98, 50+(r%6), 0.5);
      place(DRESS, g, x, y+ch*0.5, z, 0, longX ? 0 : Math.PI/2, 0, 1.02+pr()*0.04);
      y += ch;
    }
  }

  // a string course belting the tower, gone where the wall is gone
  {
    const pr = mulberry32(5150);
    for(let side=0; side<4; side++){
      const a = side*Math.PI/2;
      const nx = Math.cos(a), nz = Math.sin(a);
      for(let s=-KH+0.11; s<KH-0.10; s+=0.086){
        const x = KX + nx*(KH+0.012) - nz*s;
        const z = KZ + nz*(KH+0.012) + nx*s;
        if(keepCrown(x,z) < 0.80) continue;
        if(pr() < 0.16) continue;
        const g = stoneBlock(0.082, 0.030, 0.034, 90+side, 0.5);
        place(DRESS, g, x, 0.640, z, 0, Math.atan2(-nz,nx)+Math.PI/2, 0, 1.02);
      }
    }
  }
}

/* ---- the curtain wall, and the gate ----------------------------------- */
const CW = {x0:0.36, z0:0.10, x1:1.12, z1:-0.26, t:0.148, y0:-0.040};
function curtainCrown(u, x, z){
  let h = 0.86 - 0.22*u;
  if(u > 0.62) h = 0.72 - (u-0.62)*1.48;            // and here it has fallen
  return CW.y0 + Math.max(0.05, h + fbm3(u*7.1+1.4, 2.2, 0, 3, 2.1, .55)*0.11);
}
{
  courseWall({...CW, hmax:1.05, seed:11, crown:curtainCrown,
    openings:[{u0:0.300,u1:0.560,y0:-0.10,y1:0.34, dress:true, arch:true, n:13}]});
  merlons({...CW, from:0.05, to:0.62, step:0.178, min:0.56, crown:curtainCrown, seed:11});
}

/* ---- the far wall, down to its footings, and the door that outlived it -- */
const FW = {x0:-0.52, z0:-0.06, x1:-1.26, z1:0.16, t:0.140, y0:-0.040};
function farCrown(u, x, z){
  const h = 0.46 - 0.34*u + (u>0.30 && u<0.52 ? 0.44 : 0);   // the doorway still stands
  return FW.y0 + Math.max(0.045, h + fbm3(u*8.4+5.7, 3.1, 0, 3, 2.1, .55)*0.10);
}
{
  courseWall({...FW, hmax:0.95, seed:31, crown:farCrown,
    openings:[{u0:0.355,u1:0.470,y0:-0.10,y1:0.30, dress:true, arch:true, n:9}]});
}

/* ---- the corner turret, taken down on its outward side ---------------- */
const TU = {x:1.19, z:-0.33, r:0.228, t:0.112, n:11};
function turretCrown(u, x, z){
  const a = Math.atan2(z-TU.z, x-TU.x);
  const bite = 0.5 + 0.5*Math.cos(a - 1.15);
  return -0.040 + 0.80 - bite*0.44 + fbm3(x*3.4, 5.1, z*3.4, 3, 2.1, .55)*0.11;
}
{
  const R = TU.r - TU.t/2;
  for(let i=0;i<TU.n;i++){
    const a0 = (i/TU.n)*Math.PI*2, a1 = ((i+1)/TU.n)*Math.PI*2;
    courseWall({
      x0:TU.x+Math.cos(a0)*R, z0:TU.z+Math.sin(a0)*R,
      x1:TU.x+Math.cos(a1)*R, z1:TU.z+Math.sin(a1)*R,
      t:TU.t, y0:-0.040, hmax:0.94, course:0.058, seed:20+i, crown:turretCrown
    });
  }
}

/* ---- what came down --------------------------------------------------- */
/* Fallen masonry: a talus at the foot of the walls, a heap where the
   curtain gave way, and a few stones that went over the edge.            */
{
  const pr = mulberry32(7739);
  const dx=CW.x1-CW.x0, dz=CW.z1-CW.z0, L=Math.hypot(dx,dz), ux=dx/L, uz=dz/L;
  const gx=FW.x1-FW.x0, gz=FW.z1-FW.z0, GL=Math.hypot(gx,gz), fx=gx/GL, fz=gz/GL;
  for(let i=0;i<62;i++){
    const w = BLOCK_W[1 + ((pr()*3)|0)];
    const g = stoneBlock(w, 0.058, 0.140, 80+(i%9), 1.4);
    let x,z;
    if(i < 28){                                  // the collapse beyond the far wall
      const s = 0.34 + pr()*0.62;
      const off = (pr()-0.5)*0.40;
      x = FW.x0+fx*s - fz*off; z = FW.z0+fz*s + fx*off;
    } else if(i < 46){                           // talus along the curtain
      const s = pr()*L;
      const off = (pr()<0.5?-1:1)*(0.10+pr()*0.15);
      x = CW.x0+ux*s - uz*off; z = CW.z0+uz*s + ux*off;
    } else {                                     // at the foot of the keep
      const a = pr()*Math.PI*2, rr = 0.48+pr()*0.24;
      x = KX+Math.cos(a)*rr; z = KZ+Math.sin(a)*rr*0.85;
    }
    if(Math.abs(x) > 1.38 || Math.abs(z) > 0.64) continue;
    place(WALL, g, x, -0.034 + pr()*0.020, z,
      (pr()-0.5)*0.9, pr()*6.28, (pr()-0.5)*0.9, 1.02 + pr()*0.08);
  }
}

const keepMesh = new THREE.Mesh(mergeGeos(WALL), stoneMat);
keepMesh.castShadow = keepMesh.receiveShadow = true;
ruin.add(keepMesh);
const dressMesh = new THREE.Mesh(mergeGeos(DRESS), marbleMat);
dressMesh.castShadow = dressMesh.receiveShadow = true;
ruin.add(dressMesh);

/* --- the fire in the crown ---------------------------------------------
   Somebody is still up there.  An emissive core the bloom can catch and a
   point light inside the shell, so the window heads and the broken
   parapet are lit from within rather than from the shaft outside.        */
const FLAME_I = 2.8;
const flameMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{ uColor:{value:new THREE.Color(0xffb257)}, uBoost:{value:8.5}, uTime:{value:0} },
  vertexShader:\`varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    varying vec3 vP; uniform vec3 uColor; uniform float uBoost, uTime;
    void main(){
      float r = length(vP.xz)/0.09;
      float h = clamp((vP.y+0.10)/0.22, 0.0, 1.0);
      float body = pow(1.0-clamp(r,0.0,1.0), 1.6) * (0.35+0.65*(1.0-h));
      float flick = 0.88 + 0.12*sin(uTime*7.3) + 0.06*sin(uTime*17.7+1.3);
      gl_FragColor = vec4(uColor*uBoost*body*flick, body);
    }\`
});
const flame = new THREE.Mesh(new THREE.SphereGeometry(0.131, 24, 18), flameMat);
flame.scale.set(1.15, 1.65, 1.15);
flame.position.set(KX-0.06, 0.98, KZ-0.02);
flame.renderOrder = 5;
ruin.add(flame);

const flameLight = new THREE.PointLight(0xffbe7a, FLAME_I, 3.8, 2.0);
flameLight.position.copy(flame.position);
ruin.add(flameLight);

/* --- embers ------------------------------------------------------------
   Each one loops on its own life so the column never restarts as one, and
   the whole system costs a single uniform write a frame.                 */
{
  const N = 320;
  const pos = new Float32Array(N*3), seed = new Float32Array(N*2);
  const pr = mulberry32(3313);
  for(let i=0;i<N;i++){
    const a = pr()*6.283, r = Math.pow(pr(),0.6)*0.11;
    pos[i*3]   = flame.position.x + Math.cos(a)*r;
    pos[i*3+1] = flame.position.y - 0.04;
    pos[i*3+2] = flame.position.z + Math.sin(a)*r;
    seed[i*2]   = pr();
    seed[i*2+1] = pr();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,2));
  const m = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, depthTest:true, blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0}, uMap:{value:radialSprite(64,[[0,'rgba(255,255,255,1)'],[0.28,'rgba(255,206,132,0.62)'],[1,'rgba(255,168,84,0)']])}, uPix:{value:1} },
    vertexShader:\`
      attribute vec2 seed;
      varying float vA;
      uniform float uTime, uPix;
      void main(){
        float sp = 0.34 + seed.x*0.42;
        float life = fract(seed.y*11.13 + uTime*sp*0.26);
        vec3 p = position;
        p.y += life*(0.86 + seed.x*0.74);
        p.x += sin(uTime*0.9 + seed.y*37.0)*0.10*life;
        p.z += cos(uTime*0.8 + seed.x*23.0)*0.10*life;
        vA = smoothstep(0.0,0.10,life) * pow(1.0-life, 1.7);
        vec4 mv = modelViewMatrix*vec4(p,1.0);
        gl_PointSize = (0.5 + seed.x*1.4) * uPix * (26.0/max(-mv.z,1.0));
        gl_Position = projectionMatrix*mv;
      }\`,
    fragmentShader:\`
      varying float vA; uniform sampler2D uMap;
      void main(){ vec4 t = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(t.rgb, t.a*vA*0.85); }\`
  });
  const pts = new THREE.Points(g, m);
  pts.frustumCulled = false;
  pts.renderOrder = 5;
  ruin.add(pts);
  window.__ember = m;
}

ruin.rotation.y = -0.42;

/* =====================================================================
   8. debris field
   ===================================================================== */
/* Debris: a slow spiral of tumbling chips.  The reference keeps the inner
   field small and dim and puts the big soft chunks near the camera, so the
   swarm is generated in two bands.                                          */
/* A rock is a smooth-silhouette blob with a few flat cleavage faces, not a
   subdivided die: dense sphere -> multi-octave displacement -> soft plane cuts
   -> averaged normals.                                                       */
function rockGeometry(detail, seed, squash){
  const g = new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position, v = new THREE.Vector3();
  const planes = [];
  const pr = mulberry32(9137 + seed*977);
  const nCuts = 3 + Math.floor(pr()*3);
  for(let i=0;i<nCuts;i++){
    const a = pr()*Math.PI*2, b = Math.acos(pr()*2-1);
    planes.push({
      n: new THREE.Vector3(Math.sin(b)*Math.cos(a), Math.cos(b), Math.sin(b)*Math.sin(a)),
      d: 0.60 + pr()*0.30,
      k: 0.45 + pr()*0.45
    });
  }
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const d = v.clone();
    const n1 = fbm3(d.x*1.05+seed*13, d.y*1.05, d.z*1.05, 3, 2.05, .55);
    const n2 = fbm3(d.x*2.9+seed*7,  d.y*2.9,  d.z*2.9,  3);
    const n3 = fbm3(d.x*7.4+seed*3,  d.y*7.4,  d.z*7.4,  2);
    const n4 = fbm3(d.x*19.0+seed*5, d.y*19.0, d.z*19.0, 2);
    v.multiplyScalar(1 + n1*0.30 + n2*0.11 + n3*0.038 + n4*0.013);
    for(const p of planes){                       // soft cleavage faces
      const t = v.dot(p.n) - p.d;
      if(t > 0) v.addScaledVector(p.n, -t*p.k);
    }
    v.y *= squash;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  return smoothNormals(g, 2e-4);
}
const debrisGeos = [];          // near-camera chunks carry the most detail
for(let i=0;i<5;i++) debrisGeos.push(rockGeometry(5, i+1, 0.52 + (i%3)*0.16));
const debrisGeosFar = [];
for(let i=0;i<6;i++) debrisGeosFar.push(rockGeometry(3, i+21, 0.52 + (i%3)*0.16));
const debrisMat = new THREE.MeshStandardMaterial({
  map:RUBBLE.map, normalMap:RUBBLE.normalMap, roughnessMap:RUBBLE.ormMap, aoMap:RUBBLE.ormMap, aoMapIntensity:0.9,
  normalScale:new THREE.Vector2(1.3,1.3),
  color:0x8a8884, roughness:1.0, metalness:0.0, envMapIntensity:0.30,
});
addDetailNormal(debrisMat, 5.0, 0.70);
const debris = [];
const debrisGroup = new THREE.Group(); scene.add(debrisGroup);

function spawnDebris(n, rMin, rMax, sMin, sMax, yMin, yMax, turns){
  for(let i=0;i<n;i++){
    const pool = (sMax > 0.09) ? debrisGeos : debrisGeosFar;
    const m = new THREE.Mesh(pool[(debris.length)%pool.length], debrisMat);
    m.castShadow = true;
    const t = i/n;
    const r = rMin + Math.pow(rnd(),0.8)*(rMax-rMin);
    const a = t*Math.PI*2*turns + rnd()*0.9;
    const y = yMin + t*(yMax-yMin) + (rnd()-.5)*1.0;
    const s = sMin + Math.pow(rnd(),2.2)*(sMax-sMin);
    m.scale.setScalar(s);
    m.userData = {
      r, a, y, s,
      spin:new THREE.Vector3((rnd()-.5)*.42,(rnd()-.5)*.42,(rnd()-.5)*.42),
      w:(0.018+rnd()*0.028)*(rnd()<.2?-1:1),
      drift:(rnd()-0.42)*0.030,
      push:new THREE.Vector3(), rot:new THREE.Euler(rnd()*6.28,rnd()*6.28,rnd()*6.28)
    };
    debrisGroup.add(m);
    debris.push(m);
  }
}
spawnDebris(74, 1.5, 4.8, 0.016, 0.062, -1.8, 4.4, 3.1);   // inner chips
spawnDebris(28, 5.0,10.8, 0.09 , 0.52 , -3.6, 2.8, 1.9);   // near-camera chunks

/* =====================================================================
   9. starfield + drifting motes
   ===================================================================== */
/* A soft round sprite, drawn once and reused by both point systems.        */
function radialSprite(size, stops){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  stops.forEach(([t, col]) => grd.addColorStop(t, col));
  g.fillStyle = grd; g.fillRect(0,0,size,size);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}
const SPRITE = radialSprite(64, [[0,'rgba(255,255,255,1)'],[0.30,'rgba(255,247,232,0.55)'],[1,'rgba(255,244,226,0)']]);

/* --- stars ------------------------------------------------------------
   Far enough out that the orbit never parallaxes them, on a shell rather
   than a box so the density stays even.  Magnitudes follow a power law, so
   a handful read as bright and the rest as dust; each twinkles on its own
   phase and the colour drifts a little across the field.                  */
let stars = null;
{
  const N = 2600;
  const pos = new Float32Array(N*3), seed = new Float32Array(N*4), tint = new Float32Array(N*3);
  for(let i=0;i<N;i++){
    // even distribution over the sphere, biased away from straight down
    const u1 = rnd()*2-1, th = rnd()*Math.PI*2;
    const sp = Math.sqrt(Math.max(0,1-u1*u1));
    const R = 120 + rnd()*40;
    pos[i*3]   = Math.cos(th)*sp*R;
    pos[i*3+1] = (u1*0.72 + 0.18)*R;
    pos[i*3+2] = Math.sin(th)*sp*R;
    const mag = Math.pow(rnd(), 3.4);                 // few bright, many faint
    seed[i*4]   = rnd()*6.283;                        // twinkle phase
    seed[i*4+1] = 0.35 + rnd()*1.5;                   // twinkle rate
    seed[i*4+2] = 0.20 + mag*1.25;                    // brightness
    seed[i*4+3] = 0.55 + mag*2.6;                     // size
    const warm = rnd();
    tint[i*3]   = 1.0;
    tint[i*3+1] = 0.94 + warm*0.06;
    tint[i*3+2] = 0.86 + warm*0.16;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,4));
  g.setAttribute('tint', new THREE.BufferAttribute(tint,3));
  const m = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, depthTest:false, blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0}, uMap:{value:SPRITE}, uPix:{value:1}, uFade:{value:1} },
    vertexShader:\`
      attribute vec4 seed; attribute vec3 tint;
      varying float vA; varying vec3 vT;
      uniform float uTime, uPix;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = seed.w * uPix * 2.9;
        float tw = 0.62 + 0.38*sin(uTime*seed.y + seed.x)
                        + 0.10*sin(uTime*seed.y*2.7 + seed.x*1.7);
        vA = seed.z * tw;
        vT = tint;
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader:\`
      varying float vA; varying vec3 vT;
      uniform sampler2D uMap; uniform float uFade;
      void main(){
        vec4 t = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(vT * t.rgb, t.a * vA * uFade);
      }\`
  });
  stars = new THREE.Points(g, m);
  stars.frustumCulled = false;
  stars.renderOrder = -5;                   // behind everything, ahead of the haze
  scene.add(stars);
  window.__stars = m;
}

/* --- drifting motes ---------------------------------------------------
   Enough of them to read as air rather than as a scatter of sprites, which
   means the drift has to live in the vertex shader: one uniform write a
   frame however many there are.  They rise slowly, sway, and wrap through a
   band whose edges fade, so the loop never shows.                          */
let motes = null;
{
  const N = (window.innerWidth*window.innerHeight < 640000) ? 1600 : 4200;
  const pos = new Float32Array(N*3), seed = new Float32Array(N*4);
  for(let i=0;i<N;i++){
    const r = 1.0 + Math.pow(rnd(),0.55)*15.0, a = rnd()*6.283;
    pos[i*3]   = Math.cos(a)*r;
    pos[i*3+1] = -7.0 + rnd()*15.0;
    pos[i*3+2] = Math.sin(a)*r;
    seed[i*4]   = rnd()*6.283;                          // phase
    seed[i*4+1] = 0.25 + rnd()*0.95;                    // speed
    seed[i*4+2] = 0.35 + rnd()*1.5;                     // sway
    seed[i*4+3] = 0.55 + 1.15*Math.pow(rnd(), 2.4);     // size
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,4));
  const m = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, depthTest:true, blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0}, uMap:{value:SPRITE}, uPix:{value:1}, uFade:{value:1} },
    vertexShader:\`
      attribute vec4 seed;
      varying float vA;
      uniform float uTime, uPix;
      void main(){
        float ph = seed.x, sp = seed.y, am = seed.z;
        vec3 p = position;
        p.x += sin(uTime*sp*0.33 + ph)*0.42*am;
        p.z += cos(uTime*sp*0.27 + ph*1.3)*0.36*am;
        float band = 15.0;
        float climb = mod(uTime*0.115*sp + ph*2.4, band) - band*0.5;
        p.y += climb;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_PointSize = seed.w * uPix * (26.0 / max(-mv.z, 1.0));
        float edge = 1.0 - abs(climb)/(band*0.5);
        float tw = 0.55 + 0.45*sin(uTime*(0.6 + sp*1.7) + ph*3.1);
        vA = clamp(edge*2.6, 0.0, 1.0) * tw;
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader:\`
      varying float vA;
      uniform sampler2D uMap; uniform float uFade;
      void main(){
        vec4 t = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(t.rgb, t.a * vA * 0.42 * uFade);
      }\`
  });
  motes = new THREE.Points(g, m);
  motes.frustumCulled = false;
  motes.renderOrder = 4;
  scene.add(motes);
  window.__dust = m;
}

/* ?tex=stone|marble|rubble[&ch=map|normal|orm][&zoom=n] shows a baked map
   full-frame, which is the only sane way to judge one.                     */
if(PARAMS.has('tex')){
  const set = {stone:STONE, marble:MARBLE, rubble:RUBBLE}[PARAMS.get('tex')] || STONE;
  const ch  = {map:'map', normal:'normalMap', orm:'ormMap'}[PARAMS.get('ch')||'map'] || 'map';
  const zoom = parseFloat(PARAMS.get('zoom')||'1');
  const t = set[ch].clone(); t.needsUpdate = true;
  t.repeat.set(zoom, zoom); t.encoding = THREE.LinearEncoding;
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2),
    new THREE.ShaderMaterial({ uniforms:{tMap:{value:t}},
      vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.0,1.0);}',
      fragmentShader:\`varying vec2 vUv; uniform sampler2D tMap;
        float invAces(float y){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
          float A=y*c-a, B=y*d-b, C=y*e; if(abs(A)<1e-5) return -C/max(B,1e-5);
          float disc=max(B*B-4.0*A*C,0.0); float x=(-B-sqrt(disc))/(2.0*A);
          if(x<0.0) x=(-B+sqrt(disc))/(2.0*A); return clamp(x,0.0,60.0); }
        void main(){ vec3 c = texture2D(tMap, vUv).rgb;
          // cancel the composer's tone curve so the raw map is what you see
          vec3 l = pow(c, vec3(2.2));
          gl_FragColor = vec4(invAces(l.r), invAces(l.g), invAces(l.b), 1.0); }\` }));
  quad.frustumCulled = false;
  while(scene.children.length) scene.remove(scene.children[0]);
  scene.add(quad);
  document.head.insertAdjacentHTML('beforeend','<style>.stage,.cursor{display:none!important}</style>');
}

/* Loose chips scattered on the top surface — the detail you only notice once
   the eye has settled on the keep.                                          */
{
  const pr = mulberry32(51423);
  for(let i=0;i<26;i++){
    const g = debrisGeos[i % debrisGeos.length];
    const m = new THREE.Mesh(g, debrisMat);
    const a = pr()*Math.PI*2;
    const rr = 0.30 + Math.pow(pr(),0.7)*1.15;
    const x = Math.cos(a)*rr, z = Math.sin(a)*rr*0.82;
    if(Math.abs(x) > 1.42 || Math.abs(z) > 0.80) continue;
    const sc = 0.012 + Math.pow(pr(),2.2)*0.045;
    m.scale.setScalar(sc);
    m.position.set(x, Y_PLINTH - 0.012 + sc*0.35, z + 0.02);
    m.rotation.set(pr()*6.28, pr()*6.28, pr()*6.28);
    m.castShadow = m.receiveShadow = true;
    plinth.add(m);
  }
}

/* aoMap samples uv2; every geometry here uses the same layout as uv. */
scene.traverse(o=>{
  if(o.isMesh && o.material && o.material.aoMap &&
     o.geometry.attributes.uv && !o.geometry.attributes.uv2){
    o.geometry.setAttribute('uv2', o.geometry.attributes.uv);
  }
});

/* =====================================================================
   10. post processing
   ===================================================================== */
const rtOpts = {minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
                format:THREE.RGBAFormat, type:THREE.HalfFloatType,
                samples: renderer.capabilities.isWebGL2 ? 4 : 0};
const rt = new THREE.WebGLRenderTarget(1,1,rtOpts);
const composer = new THREE.EffectComposer(renderer, rt);
composer.addPass(new THREE.RenderPass(scene,camera));

const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(1,1), 0.16, 1.0, 0.88);
/* UnrealBloomPass allocates 8-bit targets, which quantises the halo into
   visible contour steps against a near-black sky.  Promote them to half float
   before anything renders into them.                                        */
if(renderer.capabilities.isWebGL2){
  const hf = t => { if(t) t.texture.type = THREE.HalfFloatType; };
  hf(bloom.renderTargetBright);
  (bloom.renderTargetsHorizontal||[]).forEach(hf);
  (bloom.renderTargetsVertical||[]).forEach(hf);
}
composer.addPass(bloom);

const FinalShader = {
  uniforms:{
    tDiffuse:{value:null}, uTime:{value:0}, uGrain:{value:0.022},
    uVig:{value:0.35}, uExposure:{value:1.0}, uRes:{value:new THREE.Vector2(1,1)},
    uSharp:{value:0.32}
  },
  vertexShader:\`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform sampler2D tDiffuse;
    uniform float uTime,uGrain,uVig,uExposure,uSharp; uniform vec2 uRes;
    vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    void main(){
      vec2 uv=vUv;
      vec2 d = uv-0.5;
      float r2 = dot(d,d);
      // whisper of lateral chromatic aberration
      float ca = 0.0004*r2;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + d*ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - d*ca).b;
      // unsharp mask: crisps the stone relief without touching the bloom halo
      vec2 px = 1.0/uRes;
      vec3 blur = ( texture2D(tDiffuse, uv+vec2( px.x,0.0)).rgb
                  + texture2D(tDiffuse, uv+vec2(-px.x,0.0)).rgb
                  + texture2D(tDiffuse, uv+vec2(0.0, px.y)).rgb
                  + texture2D(tDiffuse, uv+vec2(0.0,-px.y)).rgb ) * 0.25;
      float lum = dot(col, vec3(0.2126,0.7152,0.0722));
      col += (col-blur) * uSharp * (1.0 - smoothstep(0.55, 1.6, lum));
      col = max(col, vec3(0.0));
      col *= uExposure;
      col = aces(col);
      // vignette
      float v = smoothstep(1.15, 0.16, length(d*vec2(1.0,0.92)));
      col *= mix(1.0, v, uVig);
      // sRGB
      col = pow(col, vec3(1.0/2.2));
      // grain, plus a triangular dither so the near-black gradient cannot band
      float g = hash(gl_FragCoord.xy + fract(uTime)*vec2(37.0,17.0))-0.5;
      col += g*uGrain*(0.35+0.65*smoothstep(0.0,0.35,dot(col,vec3(0.33))));
      float d1 = hash(gl_FragCoord.xy + fract(uTime)*vec2(11.0,71.0));
      float d2 = hash(gl_FragCoord.xy + fract(uTime)*vec2(53.0,29.0));
      col += (d1-d2)*(1.0/255.0);
      gl_FragColor = vec4(col,1.0);
    }\`
};
const finalPass = new THREE.ShaderPass(FinalShader);
finalPass.renderToScreen = true;
composer.addPass(finalPass);

/* =====================================================================
   11. resize
   ===================================================================== */
let W=0,H=0,DPR=1;
function resize(){
  W = canvas.clientWidth || window.innerWidth;
  H = canvas.clientHeight || window.innerHeight;
  DPR = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W,H,false);
  /* EffectComposer captures the renderer's pixel ratio when it is built, and
     it is built before the first resize — so without this the whole scene
     renders at CSS resolution and is upscaled onto a retina canvas.  Every
     pass, bloom included, is sized from this. */
  composer.setPixelRatio(DPR);
  composer.setSize(W,H);
  const aspect = W/H;
  camera.aspect = aspect;
  // Wider than the reference: hold the vertical field.  Narrower: open up to
  // keep the horizontal field — but clamped, because a portrait phone would
  // otherwise ask for ~88 deg and render a fish-eye.
  const fitW = 2*Math.atan(Math.tan(FOV_H/2)/aspect)*180/Math.PI;
  camera.fov = (aspect >= REF_ASPECT) ? REF_FOV_V : Math.min(46, fitW);
  // past the clamp, distance takes over from field of view
  PORTRAIT = aspect < 0.95;
  DIST_SCALE = 1 + Math.max(0, (fitW - 46))/46 * 0.55;
  camera.updateProjectionMatrix();
  
  finalPass.uniforms.uRes.value.set(W,H);
  if(window.__dust)  window.__dust.uniforms.uPix.value  = H/1366;
  if(window.__stars) window.__stars.uniforms.uPix.value = H/1366;
  if(window.__ember) window.__ember.uniforms.uPix.value = H/1366;
}
window.addEventListener('resize', resize);
resize();

/* =====================================================================
   12. pointer
   ===================================================================== */
const pointer = {x:0, y:0, tx:0, ty:0, has:false};
const cursorEl = document.getElementById('cursor');
let cx=0, cy=0;
/* ?cursor=x,y parks the drive at a fixed pointer position, in the same
   -1..1 the events use, which makes a camera pose reproducible from a URL. */
if(PARAMS.has('cursor')){
  const [a,b] = PARAMS.get('cursor').split(',').map(Number);
  pointer.tx = pointer.x = Number.isFinite(a) ? Math.max(-1, Math.min(1, a)) : 0;
  pointer.ty = pointer.y = Number.isFinite(b) ? Math.max(-1, Math.min(1, b)) : 0;
  pointer.has = true;
}
window.addEventListener('pointermove', e=>{
  pointer.tx = (e.clientX/W)*2-1;
  pointer.ty = -((e.clientY/H)*2-1);
  pointer.has = true;
  cursorEl.style.opacity = 1;
  cursorEl.dataset.x = e.clientX; cursorEl.dataset.y = e.clientY;
});
window.addEventListener('pointerleave', ()=>{cursorEl.style.opacity=0;});


/* =====================================================================
   14. the page: dock, parallax, entrance
   ===================================================================== */
/* --- card plates ------------------------------------------------------
   The two cards show the scene's own stone: the baked albedo read straight
   out of its DataTexture, cropped and graded on a 2d canvas.  No external
   image, and the paper card and the plinth are made of the same rock.     */
function paintPlate(canvas, set, opt){
  const o = Object.assign({sx:0.12, sy:0.10, zoom:0.42, warm:1.0, lift:0.0}, opt||{});
  const src = set.map.image;                       // {data, width, height}
  const S0 = src.width;
  const cw = canvas.width, ch = canvas.height;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(cw, ch);
  const d = img.data, sd = src.data;
  const spanX = o.zoom, spanY = o.zoom * (ch/cw) * 1.0;
  for(let y=0;y<ch;y++){
    for(let x=0;x<cw;x++){
      const u = (o.sx + (x/cw)*spanX) % 1;
      const v = (o.sy + (y/ch)*spanY) % 1;
      const si = ((Math.floor(v*S0)*S0) + Math.floor(u*S0))*4;
      const i = (y*cw+x)*4;
      // a slow vignette and a warm grade, so the plate reads as a photograph
      const dx = (x/cw-0.5), dy = (y/ch-0.5);
      const vig = 1 - Math.min(1, (dx*dx*1.5 + dy*dy*1.9))*0.85;
      d[i]   = Math.min(255, (sd[si]  *o.warm + o.lift) * vig);
      d[i+1] = Math.min(255, (sd[si+1]*1.0   + o.lift) * vig);
      d[i+2] = Math.min(255, (sd[si+2]*0.96  + o.lift) * vig);
      d[i+3] = 255;
    }
  }
  ctx.putImageData(img,0,0);
}
document.querySelectorAll('canvas[data-plate]').forEach(c=>{
  const kind = c.getAttribute('data-plate');
  try{
    if(kind === 'marble') paintPlate(c, MARBLE, {sx:0.42, sy:0.28, zoom:0.86, warm:1.02, lift:4});
    else                  paintPlate(c, STONE,  {sx:0.10, sy:0.16, zoom:0.92, warm:1.12, lift:6});
  }catch(e){}
});

/* --- pointer: parallax, dock magnification, specular rim -------------- */
const stageEl = document.getElementById('stage');
const dockEl  = document.querySelector('.dock');
const dockItems = [...document.querySelectorAll('[data-dock]')];
const specEls = [...document.querySelectorAll('[data-spec]')];
const parEls  = [...document.querySelectorAll('.par, .mask, .fade, .headline, .stat, .card, .cta, .lede, .eyebrow, .colophon, .scroll')]
  .filter(el => el.style.getPropertyValue('--pd'));
parEls.forEach(el => el.classList.add('par'));

const ptr = {x:0.5, y:0.5, ex:0.5, ey:0.5, inside:false};
addEventListener('pointermove', e => {
  ptr.x = e.clientX / innerWidth; ptr.y = e.clientY / innerHeight; ptr.inside = true;
  dockNear(e.clientX, e.clientY);
  specUpdate(e.clientX, e.clientY);
}, {passive:true});
addEventListener('pointerleave', () => { ptr.inside = false; dockNear(-1e5,-1e5); });

/* pills magnify with distance, the way a dock does */
function dockNear(mx, my){
  const U = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u')) || 1;
  const R = 150*U;
  dockItems.forEach(it => {
    const r = it.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const d = Math.hypot(mx-cx, my-cy);
    const f = Math.max(0, 1 - d/R);
    const k = f*f;
    it.style.transform = \`translateY(\${k*3*U}px) scale(\${1 + k*0.16})\`;
    it.dataset.near = k > 0.22 ? 'true' : 'false';
  });
}
/* the rim highlight points at the pointer and fades with distance */
function specUpdate(mx, my){
  specEls.forEach(el => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const ang = Math.atan2(my-cy, mx-cx);
    const d = Math.hypot(mx-cx, my-cy);
    const reach = Math.max(r.width, r.height) * 1.9;
    el.style.setProperty('--spec-angle', (ang + Math.PI/2).toFixed(3)+'rad');
    el.style.setProperty('--spec-bright', Math.max(0, 1 - d/reach).toFixed(3));
  });
}

/* --- entrance ---------------------------------------------------------- */
function reveal(){
  if(document.body.classList.contains('is-ready')) return;
  document.body.classList.add('is-ready');
  setTimeout(()=>document.body.classList.add('intro-done'), 2600);
}

/* =====================================================================
   13. animate
   ===================================================================== */
const clock = new THREE.Clock();
let t = 0;
const camTarget = new THREE.Vector3(0, Y_TARGET, 0);
const _v = new THREE.Vector3();
const _proj = new THREE.Vector3();

function frame(time){
  const dt = Math.min(clock.getDelta(), 0.05);
  t = FROZEN!==null ? FROZEN : t+dt;

  // --- camera: a steady orbit the pointer steers -------------------------
  /* The reference slid the eye a few centimetres sideways with the pointer.
     Here the pointer turns the camera about the aim point instead, so push
     it to an edge and the scene turns to meet you.

     The travel is clamped by construction rather than by a guard: the
     pointer only ever runs -1..1, and it is only ever multiplied by the
     ranges below.  22 degrees of yaw either way, 11 up and 20 down.
     The two are not equal on purpose: there is far more to see from
     under this rock than from over it, and eleven degrees is as far up as
     the eye can go before it crosses the plane of the upper orbit and the
     ring flips from an ellipse to a line and back.

     Recentre and the eye returns to exactly where the authored orbit put
     it: the resting elevation and slant range are derived from Y_CAM
     rather than replacing it, so the composition at rest is unchanged.   */
  const YAW_RANGE  = 22*Math.PI/180;
  const PITCH_UP   = 11*Math.PI/180;
  const PITCH_DOWN = 20*Math.PI/180;
  // wide viewports crowd the footer, portrait ones need the subject lifted
  // clear of the copy column, so both aim below the target
  const aimDrop = Math.max(0, (W/H)/REF_ASPECT - 1) * 1.45
                + (PORTRAIT ? 1.55 * DIST_SCALE : 0);
  const aimY  = camTarget.y - aimDrop;
  const eyeY  = ELEV_OVERRIDE!==null ? ELEV_OVERRIDE : Y_CAM;
  const dist  = D_CAM * DIST_SCALE;
  const rest  = Math.atan2(eyeY - aimY, dist);      // resting elevation
  const range = Math.hypot(dist, eyeY - aimY);      // slant range, held constant
  const az    = -ORBIT_RATE*t + 0.144 + pointer.x*YAW_RANGE;
  const el    = rest + pointer.y*(pointer.y > 0 ? PITCH_UP : PITCH_DOWN);
  camera.position.set(
    Math.sin(az)*range*Math.cos(el),
    aimY + Math.sin(el)*range,
    Math.cos(az)*range*Math.cos(el)
  );
  // roll the up vector with the orbit, otherwise the scene's tilt would swing
  // from -9.7 deg to +9.7 deg over a revolution instead of holding steady
  camera.up.set(Math.sin(ROLL)*Math.cos(az), Math.cos(ROLL), -Math.sin(ROLL)*Math.sin(az));
  camera.lookAt(camTarget.x, aimY, camTarget.z);

  // a little quicker than the reference: the pointer is steering the camera
  // now, and a half-second lag on a camera reads as drag rather than weight
  pointer.x += (pointer.tx-pointer.x)*Math.min(1,dt*3.4);
  pointer.y += (pointer.ty-pointer.y)*Math.min(1,dt*3.4);

  // --- rings ------------------------------------------------------------
  ringTop.rotation.y = 0.020*t;
  ringLow.rotation.y = -0.026*t;
  haloRings.forEach(g=>{ g.rotation.y = g.userData.baseY===undefined
      ? (g.userData.baseY = g.rotation.y) + g.userData.spin*t
      : g.userData.baseY + g.userData.spin*t; });
  [ringTop, ringLow, ...haloRings].forEach(g=>{
    g.children.forEach(m => m.material.uniforms.uCam.value.copy(camera.position));
  });

  // --- debris -----------------------------------------------------------
  const cursorNDC = new THREE.Vector2(pointer.x, pointer.y);
  for(let i=0;i<debris.length;i++){
    const m = debris[i], u = m.userData;
    const a = u.a + u.w*t;
    const y = u.y + u.drift*t;
    _v.set(Math.cos(a)*u.r, y, Math.sin(a)*u.r);

    // cursor repulsion in screen space
    if(pointer.has){
      _proj.copy(_v).project(camera);
      const dx = _proj.x - cursorNDC.x, dy = _proj.y - cursorNDC.y;
      const d = Math.hypot(dx, dy*0.72);
      const R = 0.17;
      if(d < R && _proj.z < 1){
        const f = (1-d/R);
        const push = f*f*0.17;                  // a light shove, not a launch
        u.push.x += ((dx/(d+1e-4))*push - u.push.x)*0.06;
        u.push.y += ((dy/(d+1e-4))*push - u.push.y)*0.06;
      }
    }
    u.push.multiplyScalar(0.975);          // and it drifts back slowly
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
    const up    = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
    _v.addScaledVector(right, u.push.x*2.0).addScaledVector(up, u.push.y*2.0);

    m.position.copy(_v);
    m.rotation.set(u.rot.x + u.spin.x*t, u.rot.y + u.spin.y*t, u.rot.z + u.spin.z*t);
  }

  // the rock itself turns slowly the other way, so the orbit reads as motion
  // rather than a camera pan.  No bobbing, no wobble.
  plinth.rotation.y  = ROCK_RATE*t;
  ruin.rotation.y    = RUIN_YAW + ROCK_RATE*t;
  flameMat.uniforms.uTime.value = t;
  flameLight.intensity = FLAME_I*(0.9 + 0.1*Math.sin(t*7.3) + 0.05*Math.sin(t*17.7+1.3));

  if(window.__dust)  window.__dust.uniforms.uTime.value  = t;
  if(window.__stars) window.__stars.uniforms.uTime.value = t;
  if(window.__ember) window.__ember.uniforms.uTime.value = t;
  finalPass.uniforms.uTime.value = FROZEN!==null ? 0.37 : time*0.001;

  // cursor ring follow
  // stage parallax, eased
  ptr.ex += ((ptr.inside? ptr.x : 0.5) - ptr.ex)*Math.min(1, dt*3.0);
  ptr.ey += ((ptr.inside? ptr.y : 0.5) - ptr.ey)*Math.min(1, dt*3.0);
  if(stageEl){
    stageEl.style.setProperty('--px', ((ptr.ex-0.5)*2).toFixed(4));
    stageEl.style.setProperty('--py', ((ptr.ey-0.5)*2).toFixed(4));
  }

  if(cursorEl.dataset.x!==undefined){
    const tx = +cursorEl.dataset.x, ty = +cursorEl.dataset.y;
    cx += (tx-cx)*(FROZEN!==null?1:Math.min(1,dt*7.5));
    cy += (ty-cy)*(FROZEN!==null?1:Math.min(1,dt*7.5));
    cursorEl.style.transform = \`translate(\${cx}px, \${cy}px)\`;
  }

  composer.render();
  if(!window.__ready){ window.__ready = true; window.__t0 = performance.now(); reveal(); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* =====================================================================
   15. type panel  —  press T, or the Aa button, to tune the typography
   ===================================================================== */
/* Everything typographic on the page reads from custom properties, so this
   panel only has to write those.  Faces are pulled on demand with the
   FontFace API rather than a <link>: a stylesheet link from a file:// page
   can hang, and this way nothing is fetched until it is actually chosen.  */
(function typePanel(){
  const FACES = {
    display: [
      ['Instrument Serif', "'Instrument Serif',serif", true],
      ['Playfair Display', "'Playfair Display',serif"],
      ['Fraunces',         "'Fraunces',serif"],
      ['Newsreader',       "'Newsreader',serif"],
      ['Bodoni Moda',      "'Bodoni Moda',serif"],
      ['DM Serif Display', "'DM Serif Display',serif"],
      ['Cormorant Garamond',"'Cormorant Garamond',serif"],
      ['Space Grotesk',    "'Space Grotesk',sans-serif"],
      ['Inter Tight',      "'Inter Tight',sans-serif"]
    ],
    ui: [
      ['System',          'var(--sans)', true],
      ['Inter',           "'Inter',sans-serif"],
      ['Instrument Sans', "'Instrument Sans',sans-serif"],
      ['Geist',           "'Geist',sans-serif"],
      ['Space Grotesk',   "'Space Grotesk',sans-serif"],
      ['Figtree',         "'Figtree',sans-serif"]
    ]
  };
  const loaded = new Set(['Instrument Serif']);
  async function ensureFace(name){
    if(loaded.has(name) || name === 'System') return;
    loaded.add(name);
    try{
      const css = await (await fetch(
        \`https://fonts.googleapis.com/css2?family=\${encodeURIComponent(name)}:wght@300;400;500;600&display=swap\`
      )).text();
      const blocks = css.split('@font-face').slice(1);
      for(const b of blocks){
        if(!/U\\+0000-00FF/.test(b)) continue;                 // latin only
        const url = (b.match(/url\\((https:[^)]+)\\)/)||[])[1];
        const wt  = (b.match(/font-weight:\\s*([\\d ]+)/)||[])[1] || '400';
        if(!url) continue;
        const ff = new FontFace(name, \`url(\${url})\`, {weight: wt.trim().replace(/\\s+/g,' ')});
        await ff.load(); document.fonts.add(ff);
      }
    }catch(e){ /* offline: the fallback stack still applies */ }
  }

  const DEFAULTS = {
    display:'Instrument Serif', ui:'System',
    h1:92, 'h1-lh':87, 'h1-track':0.035, 'h1-weight':400,
    lede:21.5, 'lede-lh':30, 'ui-weight':300,
    label:13.5, 'label-track':2.8, 'card-title':38
  };
  const state = Object.assign({}, DEFAULTS, (()=>{
    try{ return JSON.parse(localStorage.getItem('orrery.type')||'{}'); }catch(e){ return {}; }
  })());

  const root = document.documentElement;
  function apply(){
    const dv = (FACES.display.find(f=>f[0]===state.display)||FACES.display[0])[1];
    const uv = (FACES.ui.find(f=>f[0]===state.ui)||FACES.ui[0])[1];
    root.style.setProperty('--display', dv);
    root.style.setProperty('--ui', uv);
    ['h1','h1-lh','h1-track','h1-weight','lede','lede-lh','ui-weight','label','label-track','card-title']
      .forEach(k => root.style.setProperty('--'+k, state[k]));
    try{ localStorage.setItem('orrery.type', JSON.stringify(state)); }catch(e){}
  }
  ensureFace(state.display); ensureFace(state.ui); apply();

  /* ---- panel chrome ---------------------------------------------------- */
  const css = \`
  .tp-btn{position:fixed;right:18px;bottom:18px;z-index:20;width:38px;height:38px;border-radius:11px;
    border:1px solid rgba(255,255,255,.16);background:rgba(18,16,14,.72);color:rgba(255,255,255,.7);
    font:500 14px/1 ui-sans-serif,system-ui;cursor:pointer;display:grid;place-items:center;
    transition:color .2s,border-color .2s,background .2s}
  .tp-btn:hover{color:#fff;border-color:rgba(255,255,255,.34);background:rgba(28,25,21,.9)}
  .tp{position:fixed;right:18px;bottom:66px;z-index:20;width:min(286px,calc(100vw - 36px));
    max-height:min(76vh,720px);overflow-y:auto;overscroll-behavior:contain;padding:14px 16px 16px;
    border-radius:16px;border:1px solid rgba(255,255,255,.13);
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,0) 40%),rgba(16,14,12,.94);
    box-shadow:0 18px 50px rgba(0,0,0,.6);
    font:400 11px/1.4 ui-sans-serif,system-ui;color:rgba(255,255,255,.72);
    display:none}
  .tp.is-open{display:block}
  .tp h4{font:600 10px/1 ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;
    color:rgba(255,255,255,.4);margin:0 0 11px}
  .tp label{display:block;margin:0 0 9px}
  .tp .row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px}
  .tp .row b{font-weight:500;color:rgba(255,255,255,.62)}
  .tp .row i{font-style:normal;color:rgba(255,255,255,.42);font-variant-numeric:tabular-nums}
  .tp select,.tp input[type=range]{width:100%}
  .tp select{appearance:none;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.14);
    border-radius:8px;padding:6px 8px;font:400 11px/1 ui-sans-serif,system-ui}
  .tp input[type=range]{accent-color:#ffbf7a;height:16px;background:transparent}
  .tp .btns{display:flex;gap:8px;margin-top:12px}
  .tp button{flex:1;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);
    border-radius:9px;padding:7px 8px;font:500 10.5px/1 ui-sans-serif,system-ui;letter-spacing:.06em;
    text-transform:uppercase;cursor:pointer}
  .tp button:hover{background:rgba(255,255,255,.12);color:#fff}
  .tp .hint{margin-top:9px;color:rgba(255,255,255,.32);font-size:10px}
  @media (max-width:520px){ .tp{right:12px;left:12px;width:auto;bottom:60px} .tp-btn{right:12px;bottom:12px} }\`;
  document.head.insertAdjacentHTML('beforeend', \`<style>\${css}</style>\`);

  const sliders = [
    ['h1',        'Display size',  40, 190, 0.5],
    ['h1-lh',     'Display leading',36, 190, 0.5],
    ['h1-track',  'Display tracking',-0.06, 0.16, 0.001],
    ['h1-weight', 'Display weight', 300, 700, 100],
    ['card-title','Card title',     20, 64, 0.5],
    ['lede',      'Lede size',      13, 34, 0.25],
    ['lede-lh',   'Lede leading',   16, 52, 0.25],
    ['ui-weight', 'UI weight',      200, 600, 100],
    ['label',     'Label size',     9, 22, 0.25],
    ['label-track','Label tracking',0, 8, 0.1]
  ];
  const opts = (list, cur) => list.map(f =>
    \`<option value="\${f[0]}"\${f[0]===cur?' selected':''}>\${f[0]}</option>\`).join('');
  const panel = document.createElement('div');
  panel.className = 'tp';
  panel.innerHTML = \`
    <h4>Typography</h4>
    <label><span class="row"><b>Display face</b></span>
      <select data-face="display">\${opts(FACES.display, state.display)}</select></label>
    <label><span class="row"><b>UI face</b></span>
      <select data-face="ui">\${opts(FACES.ui, state.ui)}</select></label>
    \${sliders.map(([k,l,mn,mx,st])=>\`
      <label><span class="row"><b>\${l}</b><i data-out="\${k}">\${state[k]}</i></span>
      <input type="range" data-key="\${k}" min="\${mn}" max="\${mx}" step="\${st}" value="\${state[k]}"></label>\`).join('')}
    <div class="btns"><button data-act="reset">Reset</button><button data-act="copy">Copy CSS</button></div>
    <p class="hint">Press T to hide. Choices are remembered.</p>\`;
  const btn = document.createElement('button');
  btn.className = 'tp-btn'; btn.type = 'button';
  btn.setAttribute('aria-label','Typography options'); btn.textContent = 'Aa';
  document.body.append(panel, btn);

  const toggle = () => panel.classList.toggle('is-open');
  btn.addEventListener('click', toggle);
  addEventListener('keydown', e => {
    if(e.key === 't' || e.key === 'T'){
      const tag = (e.target.tagName||'').toLowerCase();
      if(tag !== 'input' && tag !== 'select' && tag !== 'textarea') toggle();
    }
  });
  panel.addEventListener('input', e => {
    const el = e.target;
    if(el.dataset.key){
      state[el.dataset.key] = parseFloat(el.value);
      panel.querySelector(\`[data-out="\${el.dataset.key}"]\`).textContent = el.value;
      apply();
    }
  });
  panel.addEventListener('change', async e => {
    const el = e.target;
    if(el.dataset.face){
      state[el.dataset.face] = el.value;
      await ensureFace(el.value);
      apply();
    }
  });
  panel.addEventListener('click', e => {
    const act = e.target.dataset && e.target.dataset.act;
    if(act === 'reset'){
      Object.assign(state, DEFAULTS); apply();
      panel.querySelectorAll('[data-key]').forEach(i=>{
        i.value = state[i.dataset.key];
        panel.querySelector(\`[data-out="\${i.dataset.key}"]\`).textContent = i.value;
      });
      panel.querySelectorAll('[data-face]').forEach(sl => sl.value = state[sl.dataset.face]);
    }
    if(act === 'copy'){
      const dv = (FACES.display.find(f=>f[0]===state.display)||FACES.display[0])[1];
      const uv = (FACES.ui.find(f=>f[0]===state.ui)||FACES.ui[0])[1];
      const out = \`:root{\\n  --display: \${dv};\\n  --ui: \${uv};\\n\` +
        ['h1','h1-lh','h1-track','h1-weight','lede','lede-lh','ui-weight','label','label-track','card-title']
          .map(k=>\`  --\${k}: \${state[k]};\`).join('\\n') + '\\n}';
      navigator.clipboard && navigator.clipboard.writeText(out);
      e.target.textContent = 'Copied';
      setTimeout(()=>{ e.target.textContent = 'Copy CSS'; }, 1200);
    }
  });

  /* ?type=hide keeps the button out of screenshots */
  if(PARAMS.get('type') === 'hide'){ btn.style.display='none'; }
  window.__type = { state, apply };
})();

// expose for measuring harnesses
window.__scene = {scene, camera, renderer, composer, bloom, finalPass, bgMat, ringTop, ringLow, ruin, plinth, debris};
window.__render = (time)=>{ t=time; frame(0); };
window.__probe = function(){
  const w=renderer.domElement.clientWidth, h=renderer.domElement.clientHeight;
  const toScreen = (v)=>{ const p=v.clone().project(camera); return [ (p.x*0.5+0.5)*w, (0.5-p.y*0.5)*h ]; };
  function ringExtremes(radius, y){
    let minx=[1e9,0], maxx=[-1e9,0], miny=[0,1e9], maxy=[0,-1e9];
    for(let i=0;i<1440;i++){
      const a=i/1440*Math.PI*2;
      const s=toScreen(new THREE.Vector3(Math.cos(a)*radius, y, Math.sin(a)*radius));
      if(s[0]<minx[0]) minx=s;
      if(s[0]>maxx[0]) maxx=s;
      if(s[1]<miny[1]) miny=s;
      if(s[1]>maxy[1]) maxy=s;
    }
    const cx=(minx[0]+maxx[0])/2, cy=(minx[1]+maxx[1])/2;
    const A=Math.hypot(maxx[0]-minx[0], maxx[1]-minx[1])/2;
    const ang=Math.atan2(maxx[1]-minx[1], maxx[0]-minx[0])*180/Math.PI;
    // semi-minor from the vertical extremes measured perpendicular to the major axis
    const nx=-Math.sin(ang*Math.PI/180), ny=Math.cos(ang*Math.PI/180);
    const B=(Math.abs((miny[0]-cx)*nx+(miny[1]-cy)*ny)+Math.abs((maxy[0]-cx)*nx+(maxy[1]-cy)*ny))/2;
    return {left:minx, right:maxx, top:miny, bottom:maxy, cx, cy, a:A, b:B, ang};
  }
  const bbox = (obj)=>{
    const box=new THREE.Box3().setFromObject(obj);
    const pts=[]; const mn=box.min, mx=box.max;
    for(const X of [mn.x,mx.x]) for(const Y of [mn.y,mx.y]) for(const Z of [mn.z,mx.z]) pts.push(toScreen(new THREE.Vector3(X,Y,Z)));
    const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
    return {x0:Math.min(...xs), x1:Math.max(...xs), y0:Math.min(...ys), y1:Math.max(...ys)};
  };
  return JSON.stringify({
    t, w, h, fov:camera.fov,
    cam:[+camera.position.x.toFixed(3),+camera.position.y.toFixed(3),+camera.position.z.toFixed(3)],
    ringTop:ringExtremes(R_RING_TOP, Y_RING_TOP),
    ringLow:ringExtremes(R_RING_LOW, Y_RING_LOW),
    plinth:bbox(plinth), ruin:bbox(ruin),
    plinthTop:[[-1.50,-0.86],[1.50,-0.86],[1.50,0.86],[-1.50,0.86]].map(([x,z])=>toScreen(new THREE.Vector3(x,Y_PLINTH,z))),
    axis:[toScreen(new THREE.Vector3(0,Y_RING_LOW,0)), toScreen(new THREE.Vector3(0,Y_RING_TOP,0))]
  });
};
})();
<\/script>
</body>
</html>
`,i=`<!doctype html>
<html lang="en" class="js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Orrery — The Long Way to the Middle</title>
<style>
  /* ---------- type ---------- */
  @font-face{
    font-family:'Instrument Serif';
    font-style:normal;font-weight:400;font-display:swap;
    src:url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjnTLgNs.woff2) format('woff2');
    unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD;
  }

  /* ---------- design unit: 1u === 1px on the 1920 x 1366 stage ---------- */
  :root{
    --u: min(calc(100vw / 1920), calc(100vh / 1366), 1.16px);
    --sans:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    --serif:'Instrument Serif',"Times New Roman",serif;

    /* type scale — every rule below reads from these, so the whole page can
       be re-proportioned from the panel (press T) or from one edit here     */
    --display:  var(--serif);
    --ui:       var(--sans);
    --h1:       92;      /* u */
    --h1-lh:    87;      /* u */
    --h1-track: .035;    /* em */
    --h1-weight:400;
    --lede:     21.5;    /* u */
    --lede-lh:  30;      /* u */
    --ui-weight:300;
    --label:    13.5;    /* u */
    --label-track: 2.8;  /* u */
    --card-title: 38;    /* u */

    --ink:        #ffffff;
    --ink-soft:   rgba(255,255,255,.60);
    --ink-faint:  rgba(255,255,255,.40);
    --rule:       rgba(255,255,255,.075);

    --card:       #eeeae2;
    --card-ink:   #1b1916;
    --card-label: #8b857a;

    --ease:     cubic-bezier(.22,.61,.36,1);
    --ease-out: cubic-bezier(.16,1,.3,1);
  }

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#040404;color:var(--ink);
    font-family:var(--ui);font-weight:var(--ui-weight);
    overflow:hidden;
    -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  }
  canvas#gl{position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:3}

  /* Everything sits on a centred stage so the composition holds its
     proportions instead of drifting apart with the viewport.              */
  .stage{
    position:fixed;left:50%;top:50%;
    margin-left:calc(-960 * var(--u));margin-top:calc(-683 * var(--u));
    width:calc(1920 * var(--u));height:calc(1366 * var(--u));
    z-index:5;pointer-events:none;
  }
  .stage a,.stage button{pointer-events:auto}

  /* ---------- column guides + ghost wordmark (z 1, behind the scene) ---- */
  .backdrop{position:fixed;inset:0;z-index:4;pointer-events:none;overflow:hidden}
  .guides{position:absolute;left:50%;top:0;bottom:0;width:calc(1920 * var(--u));margin-left:calc(-960 * var(--u))}
  .guides i{
    position:absolute;top:0;bottom:0;width:1px;
    background:linear-gradient(180deg,rgba(255,255,255,0) 0%,var(--rule) 14%,var(--rule) 76%,rgba(255,255,255,0) 100%);
  }
  .ghost{
    position:absolute;left:calc(50% - 960 * var(--u));bottom:calc(-96 * var(--u));
    font-family:var(--display);font-size:calc(430 * var(--u));line-height:.78;
    letter-spacing:calc(44 * var(--u));
    color:rgba(255,255,255,.030);
    white-space:nowrap;user-select:none;
  }

  /* ---------- dock ------------------------------------------------------
     A capsule of pills that magnify as the pointer nears them, over a rim
     highlight that tracks where the pointer is.  No backdrop-filter: it sits
     over a canvas that repaints every frame, so the backdrop would have to be
     re-sampled and re-blurred every frame with it.                         */
  .dock-wrap{
    position:absolute;z-index:6;top:calc(40 * var(--u));left:0;right:0;
    display:flex;justify-content:center;pointer-events:none;
  }
  .dock{
    position:relative;pointer-events:auto;isolation:isolate;
    display:flex;align-items:flex-start;gap:calc(4 * var(--u));
    height:calc(58 * var(--u));padding:calc(6 * var(--u));
    border-radius:calc(17 * var(--u));
    border:1px solid rgba(255,255,255,.10);
    background:
      linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,0) 42%),
      rgba(20,18,16,.72);
    box-shadow:0 calc(10 * var(--u)) calc(28 * var(--u)) rgba(0,0,0,.42),
               inset 0 1px rgba(255,255,255,.06);
  }
  .dock-item{
    position:relative;z-index:6;
    display:inline-flex;align-items:center;justify-content:center;flex:none;
    height:calc(46 * var(--u));gap:calc(9 * var(--u));padding:0 calc(16 * var(--u));
    transform-origin:50% 0;
    border:1px solid transparent;border-radius:calc(12 * var(--u));
    background:rgba(255,255,255,.038);
    color:var(--ink-faint);text-decoration:none;cursor:pointer;
    font-family:inherit;font-size:calc(13 * var(--u));font-weight:500;
    letter-spacing:calc(1.8 * var(--u));text-transform:uppercase;white-space:nowrap;
    will-change:width,height,transform;
    transition:color .18s var(--ease),border-color .2s var(--ease),background .2s var(--ease);
  }
  .dock-item[data-near="true"]{
    z-index:7;color:var(--ink);
    border-color:rgba(255,255,255,.18);
    background:rgba(26,23,20,.94);
    box-shadow:0 calc(8 * var(--u)) calc(18 * var(--u)) rgba(0,0,0,.38);
  }
  .dock-item .glyph{width:calc(16 * var(--u));height:calc(16 * var(--u));flex:none;opacity:.62;transition:opacity .18s var(--ease)}
  .dock-item .glyph svg{display:block;width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}
  .dock-item[data-near="true"] .glyph{opacity:1}
  .dock-mark{
    width:calc(46 * var(--u));padding:0;overflow:hidden;
    background:var(--card);border-color:var(--card);color:#1b1916;
    display:grid;place-items:center;
  }
  .dock-mark svg{width:calc(26 * var(--u));height:calc(26 * var(--u));display:block}
  .dock-mark[data-near="true"]{background:#fff;border-color:#fff}
  .dock-item.is-active{background:var(--card);border-color:var(--card);color:var(--card-ink)}
  .dock-item.is-active .glyph{opacity:.75}
  .dock-item--enter{color:var(--ink);background:rgba(255,255,255,.075)}

  /* specular rim: a conic gradient masked to the border, pointed at the
     cursor — it is what makes the glass read as a lit edge                 */
  [data-spec]{--spec-angle:2.4rad;--spec-bright:0}
  [data-spec]::after{
    content:'';position:absolute;inset:-1px;z-index:5;
    padding:1px;border-radius:inherit;pointer-events:none;
    opacity:var(--spec-bright);
    background:conic-gradient(from var(--spec-angle) at 50% 50%,
      rgba(255,238,214,0) 0deg,rgba(255,238,214,.08) 14deg,rgba(255,238,214,.95) 28deg,
      rgba(255,238,214,.16) 46deg,rgba(255,238,214,0) 68deg,rgba(255,238,214,0) 180deg,
      rgba(255,238,214,.08) 194deg,rgba(255,238,214,.95) 208deg,rgba(255,238,214,.16) 226deg,
      rgba(255,238,214,0) 248deg,rgba(255,238,214,0) 360deg);
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
            mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;
  }

  /* ---------- left column ---------------------------------------------- */
  .eyebrow{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(452 * var(--u));
    font-size:calc(var(--label) * var(--u));font-weight:500;letter-spacing:calc(var(--label-track) * var(--u));
    text-transform:uppercase;color:var(--ink-faint);
  }
  .headline{
    position:absolute;z-index:5;left:calc(92 * var(--u));top:calc(486 * var(--u));
    font-family:var(--display);font-weight:var(--h1-weight);
    font-size:calc(var(--h1) * var(--u));line-height:calc(var(--h1-lh) * var(--u));
    letter-spacing:calc(var(--h1-track) * 1em);
    text-shadow:0 calc(2 * var(--u)) calc(30 * var(--u)) rgba(0,0,0,.55);
  }
  .headline span{display:block}
  .lede{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(700 * var(--u));
    width:calc(408 * var(--u));
    font-size:calc(var(--lede) * var(--u));line-height:calc(var(--lede-lh) * var(--u));
    font-weight:var(--ui-weight);color:var(--ink-soft);
  }
  .cta{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(812 * var(--u));
    width:calc(408 * var(--u));
    display:flex;align-items:flex-end;justify-content:space-between;
    padding-bottom:calc(15 * var(--u));
    border-bottom:1px solid rgba(255,255,255,.55);
    color:var(--ink);text-decoration:none;
  }
  .cta span{font-size:calc(19 * var(--u));line-height:1;font-weight:400;letter-spacing:calc(.1 * var(--u))}
  .cta svg{width:calc(30 * var(--u));height:calc(11 * var(--u));display:block;margin-bottom:calc(2 * var(--u))}
  .cta .arw{transition:transform .5s var(--ease-out)}
  .cta:hover .arw{transform:translateX(calc(7 * var(--u)))}

  /* ---------- stats ----------------------------------------------------- */
  .stat{position:absolute;z-index:5;display:flex;align-items:flex-start;gap:calc(11 * var(--u))}
  .stat--a{left:calc(98 * var(--u));top:calc(946 * var(--u))}
  .stat--b{left:calc(300 * var(--u));top:calc(1052 * var(--u))}
  .stat .mark{width:calc(34 * var(--u));height:calc(34 * var(--u));flex:none;margin-top:calc(2 * var(--u));color:rgba(255,255,255,.32)}
  .stat .mark svg{width:100%;height:100%;display:block;filter:drop-shadow(0 calc(2 * var(--u)) calc(10 * var(--u)) rgba(0,0,0,.6))}
  .stat dt,.stat dd{text-shadow:0 calc(2 * var(--u)) calc(16 * var(--u)) rgba(0,0,0,.6)}
  .stat dt{font-size:calc(15 * var(--u));line-height:calc(21 * var(--u));font-weight:300;color:var(--ink-soft)}
  .stat dd{font-size:calc(15 * var(--u));line-height:calc(23 * var(--u));font-weight:600;color:var(--ink)}

  /* ---------- cards ------------------------------------------------------
     No z-index on the first card on purpose: z-index auto keeps it out of its
     own stacking context, so it paints under the canvas and the debris drift
     across its shoulder, while the second card sits in front.              */
  .card{
    position:absolute;
    background:var(--card);border-radius:calc(52 * var(--u));
    box-shadow:0 calc(34 * var(--u)) calc(80 * var(--u)) rgba(0,0,0,.42);
    --mr:calc(52 * var(--u));
  }
  .card--note{left:calc(1062 * var(--u));top:calc(462 * var(--u));width:calc(392 * var(--u));height:calc(404 * var(--u))}
  .card--work{z-index:5;left:calc(1452 * var(--u));top:calc(796 * var(--u));width:calc(392 * var(--u));height:calc(404 * var(--u))}
  .card .label{
    position:absolute;left:calc(42 * var(--u));
    font-size:calc(15.5 * var(--u));font-weight:400;letter-spacing:calc(.6 * var(--u));color:var(--card-label);
  }
  .card h2{
    position:absolute;left:calc(42 * var(--u));right:calc(42 * var(--u));
    font-family:var(--display);font-weight:var(--h1-weight);
    font-size:calc(var(--card-title) * var(--u));line-height:calc(var(--card-title) * var(--u));
    letter-spacing:calc(.2 * var(--u));
    color:var(--card-ink);
  }
  .card--note .label{top:calc(212 * var(--u))}
  .card--note h2{top:calc(240 * var(--u))}
  .card--work .label{top:calc(52 * var(--u))}
  .card--work h2{top:calc(80 * var(--u))}
  .card figure{
    position:absolute;left:calc(16 * var(--u));right:calc(16 * var(--u));
    border-radius:calc(40 * var(--u));overflow:hidden;isolation:isolate;background:#201e1b;
  }
  .card--note figure{top:calc(16 * var(--u));height:calc(176 * var(--u))}
  .card--work figure{bottom:calc(16 * var(--u));height:calc(212 * var(--u))}
  /* the plate is its own depth plane, so it reads as a window rather than a
     picture glued to the paper */
  .card figure canvas{
    position:absolute;inset:calc(-10 * var(--u));width:calc(100% + 20 * var(--u));height:calc(100% + 20 * var(--u));
    display:block;object-fit:cover;
    transform:translate3d(calc(var(--px,0) * -9px),calc(var(--py,0) * -6px),0) scale(1.02);
    transition:transform .9s var(--ease);
  }
  .card figure::after{
    content:'';position:absolute;inset:0;z-index:2;pointer-events:none;
    box-shadow:inset 0 0 calc(40 * var(--u)) rgba(0,0,0,.35);
    border-radius:inherit;
  }
  .card .knob{
    position:absolute;right:calc(26 * var(--u));width:calc(58 * var(--u));height:calc(58 * var(--u));
    border:0;border-radius:50%;background:#dfd9cd;color:#2a2621;cursor:pointer;
    display:grid;place-items:center;
    transition:background .3s var(--ease),transform .5s var(--ease-out);
  }
  .card--note .knob{bottom:calc(26 * var(--u))}
  .card--work .knob{top:calc(26 * var(--u))}
  .card .knob:hover{background:#fff;transform:scale(1.06)}
  .card .knob svg{width:calc(22 * var(--u));height:calc(22 * var(--u));display:block}

  /* ---------- footer + scroll cue --------------------------------------- */
  .colophon{
    position:absolute;z-index:5;left:calc(96 * var(--u));bottom:calc(52 * var(--u));
    font-size:calc(var(--label) * var(--u));letter-spacing:calc(calc(var(--label-track) * .64) * var(--u));
    text-transform:uppercase;color:var(--ink-faint);
  }
  .scroll{
    position:absolute;z-index:5;left:calc(880 * var(--u));bottom:calc(46 * var(--u));
    display:flex;align-items:center;gap:calc(14 * var(--u));
    writing-mode:vertical-rl;
    font-size:calc(13 * var(--u));letter-spacing:calc(5 * var(--u));font-weight:400;
    text-transform:uppercase;color:var(--ink-soft);text-decoration:none;
    text-shadow:0 calc(2 * var(--u)) calc(18 * var(--u)) rgba(0,0,0,.7);
  }
  .scroll .track{
    position:relative;display:block;width:1px;height:calc(78 * var(--u));
    background:rgba(255,255,255,.16);overflow:hidden;
  }
  .scroll .track::after{
    content:'';position:absolute;left:0;top:0;width:1px;height:calc(26 * var(--u));
    background:rgba(255,255,255,.85);animation:trickle 2.6s var(--ease) infinite;
  }
  @keyframes trickle{
    0%{transform:translateY(-105%);opacity:0}
    22%{opacity:1}78%{opacity:1}
    100%{transform:translateY(300%);opacity:0}
  }

  /* ---------- cursor ---------------------------------------------------- */
  .cursor{
    position:fixed;left:0;top:0;z-index:9;pointer-events:none;
    width:calc(128 * var(--u));height:calc(128 * var(--u));
    margin-left:calc(-64 * var(--u));margin-top:calc(-64 * var(--u));
    border:1px solid rgba(255,255,255,.5);border-radius:50%;
    opacity:0;transition:opacity .4s ease;will-change:transform;
  }

  /* ---------- pointer parallax -----------------------------------------
     --px / --py are written on the stage once per frame (-1..1); each layer
     says how far it rides (--pd) and how much it turns (--pr).             */
  .par{
    transform:perspective(1500px)
      translate3d(calc(var(--px,0) * var(--pd,0) * -1px),calc(var(--py,0) * var(--pd,0) * -.62px),0)
      rotateY(calc(var(--px,0) * var(--pr,0) * 1deg))
      rotateX(calc(var(--py,0) * var(--pr,0) * -.7deg));
  }

  /* ---------- entrance --------------------------------------------------
     clip-path rather than transform, because transform is spoken for by the
     parallax.  Once the intro has run the clip is dropped entirely.        */
  .js .mask{clip-path:inset(100% 0 0 0 round var(--mr,0px))}
  .is-ready .mask{clip-path:inset(0 0 0 0 round var(--mr,0px));transition:clip-path 1.05s var(--ease-out) var(--d,0ms)}
  .js .mask-circle{clip-path:circle(0% at 50% 50%)}
  .is-ready .mask-circle{clip-path:circle(76% at 50% 50%);transition:clip-path 1.1s var(--ease-out) var(--d,0ms)}
  .js .fade{opacity:0}
  .is-ready .fade{opacity:1;transition:opacity 1.3s var(--ease) var(--d,0ms)}
  .intro-done .mask,.intro-done .mask-circle{clip-path:none;transition:none}
  .js .dock{opacity:0}
  .is-ready .dock{opacity:1;transition:opacity .8s var(--ease) 80ms}
  .js .dock-item{clip-path:inset(0 0 105% 0)}
  .is-ready .dock-item{
    clip-path:inset(0 0 -30% 0);
    transition:clip-path .9s var(--ease-out) var(--d,0ms),color .18s var(--ease),
               border-color .2s var(--ease),background .2s var(--ease);
  }
  canvas#gl{opacity:0;transition:opacity 1.4s var(--ease)}
  body.is-ready canvas#gl{opacity:1}

  a:focus-visible,button:focus-visible{
    outline:2px solid rgba(255,255,255,.85);outline-offset:calc(4 * var(--u));border-radius:calc(6 * var(--u));
  }

  /* wrappers exist only so the narrow tiers can reflow the same markup;
     on the wide stage they generate no box at all */
  .col,.meta{display:contents}

  /* ── tier 2: short or mid-width — same composition, fewer pieces ────── */
  @media (max-width:1180px), (max-height:640px){
    .card--note{left:calc(1010 * var(--u));top:calc(430 * var(--u))}
    .card--work{display:none}
    .guides i:nth-child(3){display:none}
    .stat--a{top:calc(900 * var(--u))}
    .stat--b{top:calc(1006 * var(--u))}
  }

  /* ── tier 3: narrow or portrait — the stage stops being a fixed frame
     and the copy flows in a column under the scene ───────────────────── */
  @media (max-width:820px), (max-aspect-ratio:9/10){
    :root{ --u: min(calc(100vw / 700), calc(100vh / 1180), 1.05px); }

    .stage{
      position:fixed;left:0;top:0;margin:0;
      width:100%;height:100%;
      display:flex;flex-direction:column;justify-content:flex-end;
      padding:0 calc(38 * var(--u)) calc(34 * var(--u));
      gap:calc(20 * var(--u));
    }
    .col{display:block}
    .meta{display:flex;gap:calc(30 * var(--u));flex-wrap:wrap;align-items:flex-start}

    .eyebrow,.headline,.lede,.cta,.stat,.colophon{position:static;left:auto;top:auto;width:auto}
    .eyebrow{margin-bottom:calc(14 * var(--u))}
    .headline{
      font-size:calc(clamp(48, var(--h1) * .76, 104) * var(--u));
      line-height:calc(clamp(46, var(--h1-lh) * .76, 100) * var(--u));
      margin-bottom:calc(20 * var(--u));
    }
    .lede{max-width:calc(520 * var(--u));margin-bottom:calc(26 * var(--u))}
    .cta{max-width:calc(520 * var(--u));margin-bottom:calc(26 * var(--u))}
    .stat{margin:0}
    .colophon{margin-top:calc(6 * var(--u))}

    .card,.guides,.scroll{display:none}
    .ghost{font-size:calc(300 * var(--u));bottom:calc(-52 * var(--u));letter-spacing:calc(26 * var(--u))}

    .dock-wrap{top:calc(26 * var(--u))}
    .dock{height:calc(64 * var(--u));border-radius:calc(19 * var(--u))}
    .dock-item{height:calc(52 * var(--u));padding:0 calc(15 * var(--u));font-size:calc(14 * var(--u))}
    .dock-item span:not(.glyph){display:none}
    .dock-item .glyph{width:calc(19 * var(--u));height:calc(19 * var(--u))}
    .dock-mark{width:calc(52 * var(--u))}
    .dock-mark svg{width:calc(28 * var(--u));height:calc(28 * var(--u))}

    .cursor{display:none}
  }

  /* very small phones: one stat, tighter margins */
  @media (max-width:420px){
    .stat--b{display:none}
    .stage{padding:0 calc(30 * var(--u)) calc(24 * var(--u))}
  }

  /* pointer-less devices get no cursor ring and no hover-only affordances */
  @media (hover:none){
    .cursor{display:none}
  }
  @media (prefers-reduced-motion:reduce){
    .scroll .track::after{animation:none}
    .is-ready .mask,.is-ready .mask-circle,.is-ready .fade,.is-ready .dock-item{transition-duration:.01ms}
  }
</style>
</head>
<body>
<div class="backdrop" aria-hidden="true">
  <div class="guides fade" style="--d:900ms">
    <i style="left:calc(480 * var(--u))"></i>
    <i style="left:calc(960 * var(--u))"></i>
    <i style="left:calc(1440 * var(--u))"></i>
  </div>
  <div class="ghost fade" style="--d:1150ms">ORRERY</div>
</div>

<canvas id="gl"></canvas>

<div class="stage" id="stage">

  <div class="dock-wrap">
    <nav class="dock par" style="--pd:5" data-spec aria-label="Primary">
      <a class="dock-item dock-mark" data-dock data-spec href="#" style="--d:120ms" aria-label="Orrery — home">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3">
          <ellipse cx="12" cy="12" rx="9.4" ry="4.1" transform="rotate(-16 12 12)"/>
          <ellipse cx="12" cy="12" rx="5.2" ry="2.2" transform="rotate(-16 12 12)"/>
          <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/>
        </svg>
      </a>
      <a class="dock-item is-active" data-dock data-spec href="#" style="--d:180ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.1"/><ellipse cx="8" cy="8" rx="6.4" ry="2.6"/></svg></span>
        <span>Method</span>
      </a>
      <a class="dock-item" data-dock data-spec href="#" style="--d:230ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M2.4 11.6 6 6.4l2.6 3 2-2.4 3 4.6z"/><circle cx="5.2" cy="4.2" r="1.3"/></svg></span>
        <span>Routes</span>
      </a>
      <a class="dock-item" data-dock data-spec href="#" style="--d:280ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 2.6h5.2L12 5.3v8.1H4z"/><path d="M9.2 2.6v2.7h2.6"/><path d="M6 8.6h4M6 11h2.7"/></svg></span>
        <span>Notes</span>
      </a>
      <a class="dock-item dock-item--enter" data-dock data-spec href="#" style="--d:330ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M6.6 2.6h5.1a1 1 0 0 1 1 1v8.8a1 1 0 0 1-1 1H6.6"/><path d="M2.6 8h6.6"/><path d="m7 5.6 2.4 2.4L7 10.4"/></svg></span>
        <span>Enquiries</span>
      </a>
    </nav>
  </div>

  <div class="col">
  <p class="eyebrow mask" style="--d:220ms; --pd:8; --pr:.5">Method — est. MMXIII</p>

  <h1 class="headline" style="--pd:20; --pr:1.2">
    <span class="mask" style="--d:280ms">The long way</span>
    <span class="mask" style="--d:380ms">to the middle</span>
  </h1>

  <p class="lede mask" style="--d:520ms; --pd:15; --pr:1">Identity, motion, and spatial web work for brands that would rather arrive late than arrive lost.</p>

  <a class="cta mask" style="--d:600ms; --pd:15; --pr:1" href="#">
    <span>Bring us a problem</span>
    <svg class="arw" viewBox="0 0 30 11" fill="none" aria-hidden="true">
      <path d="M0 5.5H28" stroke="#fff" stroke-width="1.1"/>
      <path d="M22.6 .9C23.6 3.1 25.6 4.9 28.4 5.5 25.6 6.1 23.6 7.9 22.6 10.1" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
  </div>

  <div class="meta">
  <dl class="stat stat--a mask" style="--d:700ms; --pd:12; --pr:.8">
    <span class="mark" aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <ellipse cx="15" cy="15" rx="12" ry="5" stroke-dasharray="0.6 3.4"/>
        <ellipse cx="15" cy="15" rx="6.4" ry="2.7"/>
        <circle cx="15" cy="15" r="1.3" fill="currentColor" stroke="none"/>
      </svg>
    </span>
    <div><dt>In practice</dt><dd>12 years</dd></div>
  </dl>

  <dl class="stat stat--b mask" style="--d:780ms; --pd:13; --pr:.8">
    <span class="mark" aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <path d="M15 4v22M4 15h22" stroke-dasharray="0.6 3.2"/>
        <path d="M8.8 8.8 21.2 21.2M21.2 8.8 8.8 21.2" stroke-dasharray="0.6 3.2"/>
        <circle cx="15" cy="15" r="4.2"/>
      </svg>
    </span>
    <div><dt>Routes drawn</dt><dd>96 plans</dd></div>
  </dl>

  </div>

  <article class="card card--note mask" style="--d:820ms; --pd:11; --pr:2.2">
    <figure><canvas data-plate="stone" width="480" height="240"></canvas></figure>
    <p class="label">Field note 22</p>
    <h2>Every turn was on purpose</h2>
    <button class="knob" aria-label="Open field note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </article>

  <article class="card card--work par mask" style="--d:900ms; --pd:22; --pr:2.4">
    <p class="label">Selected work</p>
    <h2>One way through</h2>
    <figure><canvas data-plate="marble" width="480" height="280"></canvas></figure>
    <button class="knob" aria-label="Open selected work">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </article>

  <p class="colophon fade" style="--d:1000ms; --pd:6">Orrery Studio — London &amp; Kyoto</p>

  <a class="scroll fade" style="--d:1040ms; --pd:8" href="#">Discover<span class="track"></span></a>

</div>

<div class="cursor" id="cursor"></div>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/shaders/CopyShader.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/shaders/LuminosityHighPassShader.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/EffectComposer.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/RenderPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/ShaderPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/MaskPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/UnrealBloomPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/objects/MarchingCubes.js"><\/script>
<script>
(function(){
'use strict';

/* =====================================================================
   0. deterministic helpers
   ===================================================================== */
const PARAMS = new URLSearchParams(location.search);
const FROZEN = PARAMS.has('t') ? parseFloat(PARAMS.get('t')) : null;
const ELEV_OVERRIDE = PARAMS.has('elev') ? parseFloat(PARAMS.get('elev')) : null;  // camera height, debug
if(PARAMS.get('scene') === '0'){
  const s2 = document.createElement('style');
  s2.textContent = 'canvas#gl{display:none!important} body{background:#000}';
  document.head.appendChild(s2);
}
if(PARAMS.get('ui') === '0'){
  const s = document.createElement('style');
  s.textContent = '.stage,.cursor{display:none!important}';
  document.head.appendChild(s);
}

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd = mulberry32(20260818);

// --- 3d value noise (smooth, cheap) -------------------------------------
const P = new Uint8Array(512);
(function(){const p=[...Array(256).keys()];for(let i=255;i>0;i--){const j=(rnd()*(i+1))|0;[p[i],p[j]]=[p[j],p[i]];}for(let i=0;i<512;i++)P[i]=p[i&255];})();
function fade(t){return t*t*t*(t*(t*6-15)+10);}
function lerp(a,b,t){return a+(b-a)*t;}
function grad(h,x,y,z){const u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z);return((h&1)?-u:u)+((h&2)?-v:v);}
function noise3(x,y,z){
  const X=Math.floor(x)&255,Y=Math.floor(y)&255,Z=Math.floor(z)&255;
  x-=Math.floor(x);y-=Math.floor(y);z-=Math.floor(z);
  const u=fade(x),v=fade(y),w=fade(z);
  const A=P[X]+Y,AA=P[A]+Z,AB=P[A+1]+Z,B=P[X+1]+Y,BA=P[B]+Z,BB=P[B+1]+Z;
  return lerp(lerp(lerp(grad(P[AA]&15,x,y,z),grad(P[BA]&15,x-1,y,z),u),
                   lerp(grad(P[AB]&15,x,y-1,z),grad(P[BB]&15,x-1,y-1,z),u),v),
              lerp(lerp(grad(P[AA+1]&15,x,y,z-1),grad(P[BA+1]&15,x-1,y,z-1),u),
                   lerp(grad(P[AB+1]&15,x,y-1,z-1),grad(P[BB+1]&15,x-1,y-1,z-1),u),v),w);
}
function fbm3(x,y,z,oct,lac,gain){
  let a=0,amp=.5,f=1;
  for(let i=0;i<(oct||4);i++){a+=amp*noise3(x*f,y*f,z*f);f*=(lac||2.03);amp*=(gain||.5);}
  return a;
}

/* =====================================================================
   1. renderer / scene / camera
   ===================================================================== */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.LinearEncoding;      // we encode ourselves in the final pass
renderer.toneMapping = THREE.NoToneMapping;          // ditto
THREE.ColorManagement.legacyMode = false;

const scene = new THREE.Scene();

const REF_ASPECT = 1920/1366;
const REF_FOV_V  = 35;                                                   // vertical fov at the reference aspect
const FOV_H = 2*Math.atan(Math.tan(REF_FOV_V*Math.PI/360)*REF_ASPECT);   // keep the horizontal framing constant
const camera = new THREE.PerspectiveCamera(REF_FOV_V, REF_ASPECT, .1, 400);

const D_CAM      = 8.40;   // orbit radius
const Y_RING_LOW = -0.55;  // lower orbit ring plane
const Y_RING_TOP = 2.95;   // upper orbit ring plane
const Y_PLINTH   = 1.21;   // plinth top surface
const Y_TARGET   = 1.34;   // camera aim
const ROLL       = -9.658*Math.PI/180;
let PORTRAIT = false, DIST_SCALE = 1;
const Y_CAM      = 7.55;    // a plan seen from the side is a wall, so the eye is
                            // lifted to about 36 degrees above the table.  No bob.
const ORBIT_RATE = 0.038;   // rad/s, a full turn in ~165 s
const ROCK_RATE  = 0.026;   // the plinth counter-rotates, ~240 s per turn
const LAB_YAW    = -0.30;   // the labyrinth's yaw at t=0
const R_RING_TOP = 3.10;
const R_RING_LOW = 2.30;

/* =====================================================================
   2. procedural stone texture
   ===================================================================== */
/* ---------------------------------------------------------------------
   Stone maps are baked on the GPU.  Building them in JS capped out around
   1k and a second of load; on the GPU a 2k set with a dozen layered
   features costs a few milliseconds, so the surface can carry bedding,
   fissures, calcite veins, chipping, porosity, rain runnels and dust
   without the page paying for it.

   Pass 1 renders a height/mask buffer at half float, then the albedo,
   normal and ORM passes all read it.  The results are read back into
   DataTextures so they get proper mipmaps and anisotropy.
   --------------------------------------------------------------------- */
const TEX_COMMON = \`
  precision highp float;
  varying vec2 vUv;
  uniform vec2  uPeriod;      // tiling period in cells
  uniform float uSeed;

  vec2 wrap(vec2 p, vec2 period){ return mod(p, period); }
  float hash21(vec2 p, vec2 period){
    p = wrap(p, period) + uSeed;
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float vnoise(vec2 x, vec2 period){
    vec2 i = floor(x), f = fract(x);
    vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    float a = hash21(i,              period);
    float b = hash21(i+vec2(1.0,0.0),period);
    float c = hash21(i+vec2(0.0,1.0),period);
    float d = hash21(i+vec2(1.0,1.0),period);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y)*2.0-1.0;
  }
  // anisotropic tileable fbm: cells counts per axis, doubled each octave
  float fbm(vec2 uv, vec2 cells, int oct, float gain){
    float a = 0.0, amp = 1.0, norm = 0.0;
    vec2 c = cells;
    for(int i=0;i<8;i++){
      if(i>=oct) break;
      a += amp * vnoise(uv*c, c);
      norm += amp; c *= 2.0; amp *= gain;
    }
    return a/max(norm,1e-4);
  }
  // random value per worley cell — mineral grains, breccia clasts
  float cellRand2(vec2 uv, vec2 cells, float salt){
    vec2 p = uv*cells, ip = floor(p), fp = fract(p);
    float d1 = 8.0; vec2 best = ip;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 o = vec2(float(i), float(j));
        vec2 cell = ip + o;
        vec2 r = vec2(hash21(cell, cells), hash21(cell+37.7, cells));
        vec2 diff = o + r - fp;
        float d = dot(diff, diff);
        if(d < d1){ d1 = d; best = cell; }
      }
    }
    return hash21(best + salt, cells);
  }
  float cellRand(vec2 uv, float cells, float salt){ return cellRand2(uv, vec2(cells), salt); }
  // wrapping worley; returns (nearest, second) distances
  vec2 worley2(vec2 uv, vec2 cells){
    vec2 p = uv*cells, ip = floor(p), fp = fract(p);
    float d1 = 8.0, d2 = 8.0;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 o = vec2(float(i), float(j));
        vec2 cell = ip + o;
        vec2 r = vec2(hash21(cell, cells), hash21(cell+37.7, cells));
        vec2 diff = o + r - fp;
        float d = dot(diff, diff);
        if(d < d1){ d2 = d1; d1 = d; } else if(d < d2){ d2 = d; }
      }
    }
    return vec2(sqrt(d1), sqrt(d2));
  }
  vec2 worley(vec2 uv, float cells){ return worley2(uv, vec2(cells)); }
  /* Fracture network: the walls between worley cells.  Unlike the zero set of
     a smooth field these branch, meet at junctions and terminate, which is
     what makes them read as cracks rather than contour lines.               */
  float fractureNet(vec2 uv, vec2 cells, float width, float warpAmt){
    vec2 w = vec2(fbm(uv + 2.2, vec2(4.0), 3, 0.5), fbm(uv + 8.8, vec2(4.0), 3, 0.5))*warpAmt;
    vec2 d = worley2(uv + w, cells);
    float wobble = 0.55 + 0.9*(fbm(uv + 5.5, vec2(8.0), 3, 0.5)*0.5 + 0.5);
    return 1.0 - smoothstep(0.0, width*wobble, d.y - d.x);
  }
\`;

const HEIGHT_FS = TEX_COMMON + \`
  uniform float uBeds, uBedDepth, uBedSoft;
  uniform float uFissureCells, uFissureSharp, uFissureDepth;
  uniform float uChipCells, uChipDepth, uPitCells, uPitDepth;
  uniform float uVeinDepth, uRunnel, uMicro, uMacro, uGrainCells, uGrainAmp, uVeinSharp;

  void main(){
    vec2 uv = vUv;

    // --- broad form -----------------------------------------------------
    float macro = fbm(uv, vec2(2.0), 5, 0.5);
    float warp  = fbm(uv + 11.3, vec2(2.0), 3, 0.5);

    // --- sedimentary bedding, thickness varying along each bed ----------
    float band  = uv.y*uBeds + warp*0.85;
    float bf    = fract(band);
    float joint = 1.0 - smoothstep(0.0, uBedSoft, bf)*smoothstep(1.0, 1.0-uBedSoft, bf);
    // beds only survive in patches — a continuous line across the whole face
    // reads as timber, not stone
    joint *= smoothstep(0.30, 0.72, fbm(uv + 7.7, vec2(3.0, 6.0), 3, 0.55)*1.4 + 0.5);
    float bedTone = fbm(vec2(floor(band)*0.37, 0.5), vec2(4.0), 2, 0.5);

    // mineral grain at two scales: flat-ish clasts with their own tone/height
    float grainA = cellRand(uv, uGrainCells,        1.7)*2.0 - 1.0;
    float grainB = cellRand(uv, uGrainCells*3.1,   13.3)*2.0 - 1.0;

    // --- fissures: stretched so they run with the bedding ---------------
    float crack  = fractureNet(uv, vec2(uFissureCells, uFissureCells*0.55), 0.040, 0.05);
    float crack2 = fractureNet(uv + 13.7, vec2(uFissureCells*2.3, uFissureCells*1.3), 0.055, 0.03)*0.45;
    crack  *= smoothstep(0.34, 0.82, fbm(uv + 15.1, vec2(3.0), 3, 0.55)*1.3 + 0.5);
    crack2 *= smoothstep(0.40, 0.88, fbm(uv + 45.3, vec2(5.0), 3, 0.55)*1.3 + 0.5);
    // one sparse family of deep fractures cutting the whole block
    float fracture = fractureNet(uv + 63.2, vec2(3.0, 2.0), 0.035, 0.07);
    fracture *= smoothstep(0.45, 0.85, fbm(uv + 27.4, vec2(2.0), 3, 0.55)*1.4 + 0.5);

    // --- chipped pockets and porosity -----------------------------------
    vec2  wc = worley(uv, uChipCells);
    float chip = clamp(1.0 - wc.x/0.42, 0.0, 1.0);
    chip *= smoothstep(0.35, 0.55, hash21(floor(uv*uChipCells)+3.3, vec2(uChipCells)));
    vec2  wp = worley(uv + 5.5, uPitCells);
    float pit = clamp(1.0 - wp.x/0.38, 0.0, 1.0);
    pit *= smoothstep(0.25, 0.60, hash21(floor((uv+5.5)*uPitCells)+9.1, vec2(uPitCells)));
    float pore = clamp(1.0 - worley(uv + 17.1, uPitCells*1.7).x/0.34, 0.0, 1.0);
    pore *= 0.55 + 0.45*(fbm(uv + 3.7, vec2(24.0), 3, 0.5)*0.5 + 0.5);

    // --- calcite veins: thin raised threads ------------------------------
    float vn = fbm(uv + 88.4, vec2(2.0, 3.0), 4, 0.55);
    float vein = pow(clamp(1.0 - abs(vn)*uVeinSharp, 0.0, 1.0), 2.4);
    vein *= smoothstep(0.52, 0.86, fbm(uv + 71.2, vec2(3.0), 3, 0.55)*1.4 + 0.5);

    // --- rain runnels down the face, and fine tooth ----------------------
    float runnel = fbm(uv + 33.9, vec2(26.0, 2.0), 3, 0.5);
    runnel = pow(clamp(1.0 - abs(runnel)*7.0, 0.0, 1.0), 1.4) * smoothstep(0.15, 0.75, 1.0-uv.y);
    float micro = fbm(uv + 51.0, vec2(48.0), 3, 0.5);
    float grit  = fbm(uv + 77.0, vec2(160.0), 2, 0.5);

    // --- assemble --------------------------------------------------------
    float h = 0.55 + macro*uMacro + bedTone*0.04 + micro*uMicro + grit*uMicro*0.35;
    h += grainA*uGrainAmp + grainB*uGrainAmp*0.55;
    h -= joint*uBedDepth;
    h -= (crack + crack2)*uFissureDepth;
    h -= fracture*uFissureDepth*1.7;
    h -= chip*chip*uChipDepth;
    h -= pit*pit*uPitDepth + pore*pore*uPitDepth*0.30;
    h -= runnel*uRunnel;
    h += vein*uVeinDepth;

    float cracks = clamp(crack + crack2 + fracture*1.3 + joint*0.7, 0.0, 1.0);
    float holes  = clamp(chip*1.15 + pit*0.95 + pore*0.30, 0.0, 1.0);
    float mineral = clamp(0.5 + fbm(uv + 5.0, vec2(2.0, 1.0), 4, 0.5)*1.5
                              + grainA*0.22 + grainB*0.12, 0.0, 1.0);

    gl_FragColor = vec4(h, cracks, holes, mineral);
  }
\`;

const ALBEDO_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec3 uWarm, uCool, uDark, uPale, uVein;
  uniform float uStain, uRecess, uBleach, uDust, uGrain, uGrainCells, uVeinSharp;
  void main(){
    vec2 uv = vUv;
    vec4 H = texture2D(tH, uv);
    float h = H.x, cracks = H.y, holes = H.z, mineral = H.w;

    vec3 col = mix(uCool, uWarm, mineral);
    // clast-to-clast tone jitter keeps the surface from reading as one wash
    float cA = cellRand(uv, uGrainCells,      1.7) - 0.5;
    float cB = cellRand(uv, uGrainCells*3.1, 13.3) - 0.5;
    // feathered by a fine field so the clasts do not read as flat polygons
    float feather = fbm(uv + 3.3, vec2(96.0), 3, 0.5)*0.5 + 0.5;
    col *= 1.0 + (cA*0.11 + cB*0.07)*(0.55 + 0.45*feather);

    // iron / soot staining in broad patches
    float stain = clamp(fbm(uv + 41.0, vec2(7.0), 4, 0.5)*2.2 - 0.35, 0.0, 1.0)*uStain;
    col = mix(col, uDark*0.9, stain);

    // lichen-like crust: cooler, lighter, only on upward-ish broad areas
    float crust = smoothstep(0.55, 0.95, fbm(uv + 12.7, vec2(6.0), 4, 0.55)*1.6 + 0.5);
    col = mix(col, mix(col, vec3(0.62,0.64,0.60), 0.55), crust*0.35);

    // bleached plateaus, darkened recesses
    col = mix(col, uPale, smoothstep(0.58, 0.94, h)*uBleach);
    // recesses: fissures read darkest, then pockets, then porosity
    col = mix(col, uDark*0.82, clamp(cracks*1.05, 0.0, 1.0)*uRecess);
    col = mix(col, uDark,      clamp(holes*0.95,  0.0, 1.0)*uRecess*0.85);

    // calcite veins read brighter than the matrix
    float vn = fbm(uv + 88.4, vec2(2.0, 3.0), 4, 0.55);
    float vein = pow(clamp(1.0 - abs(vn)*uVeinSharp, 0.0, 1.0), 2.4);
    vein *= smoothstep(0.52, 0.86, fbm(uv + 71.2, vec2(3.0), 3, 0.55)*1.4 + 0.5);
    col = mix(col, uVein, vein*0.75);

    // pale dust settling into the cavities
    float dust = clamp(holes*1.2 + smoothstep(0.5, 0.1, h)*0.5, 0.0, 1.0);
    col = mix(col, uPale*0.96, dust*uDust);

    col += (hash21(vUv*4096.0, vec2(4096.0)) - 0.5)*uGrain;
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
\`;

const ORM_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec2 uTexel;
  uniform float uRough, uRoughVar, uAO;
  void main(){
    vec2 uv = vUv;
    vec4 H = texture2D(tH, uv);
    float h = H.x, cracks = H.y, holes = H.z;

    // cavity AO: compare the height against a wide blur of itself
    float blur = 0.0;
    for(int i=0;i<12;i++){
      float a = float(i)*0.5236;
      vec2 o = vec2(cos(a), sin(a));
      blur += texture2D(tH, uv + o*uTexel*7.0).x;
      blur += texture2D(tH, uv + o*uTexel*17.0).x;
    }
    blur /= 24.0;
    float ao = 1.0 - clamp((blur - h)*uAO, 0.0, 1.0);
    ao *= 1.0 - clamp(cracks*0.35 + holes*0.30, 0.0, 0.55);

    float open = clamp(holes*1.2 + cracks*0.8, 0.0, 1.0);
    float rough = uRough + open*uRoughVar - smoothstep(0.66, 0.92, h)*uRoughVar*0.8;
    rough += fbm(uv + 61.0, vec2(8.0), 3, 0.5)*0.10;
    gl_FragColor = vec4(clamp(ao,0.0,1.0), clamp(rough,0.04,1.0), 0.0, 1.0);
  }
\`;

const NORMAL_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec2 uTexel;
  uniform float uStrength;
  float hAt(vec2 uv){ return texture2D(tH, uv).x; }
  void main(){
    vec2 t = uTexel;
    float l = hAt(vUv - vec2(t.x,0.0)), r = hAt(vUv + vec2(t.x,0.0));
    float d = hAt(vUv - vec2(0.0,t.y)), u = hAt(vUv + vec2(0.0,t.y));
    float l2 = hAt(vUv - vec2(t.x,0.0)*2.0), r2 = hAt(vUv + vec2(t.x,0.0)*2.0);
    float d2 = hAt(vUv - vec2(0.0,t.y)*2.0), u2 = hAt(vUv + vec2(0.0,t.y)*2.0);
    float dx = (r - l)*0.66 + (r2 - l2)*0.34;
    float dy = (u - d)*0.66 + (u2 - d2)*0.34;
    vec3 n = normalize(vec3(-dx*uStrength, -dy*uStrength, 1.0));
    gl_FragColor = vec4(n*0.5 + 0.5, 1.0);
  }
\`;

const TEX_VS = \`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }\`;

function bakeStoneMaps(opt){
  const o = Object.assign({
    size:2048, ormSize:1024, seed:0, period:1.0,
    beds:4.0, bedDepth:0.055, bedSoft:0.14,
    fissureCells:8.0, fissureSharp:44.0, fissureDepth:0.11,
    chipCells:6.0, chipDepth:0.12, pitCells:34.0, pitDepth:0.15,
    veinDepth:0.020, veinSharp:110.0, runnel:0.030, micro:0.030, macro:0.30, grainCells:26.0, grainAmp:0.030,
    warm:[0.69,0.67,0.64], cool:[0.59,0.60,0.615], dark:[0.36,0.353,0.353],
    pale:[0.84,0.83,0.812], vein:[0.90,0.895,0.875],
    stain:0.30, recess:0.44, bleach:0.26, dust:0.30, grain:0.028,
    rough:0.82, roughVar:0.16, ao:2.6, nrm:2.2
  }, opt||{});

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), null);
  const sc = new THREE.Scene(); sc.add(quad);
  const cam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const prevTarget = renderer.getRenderTarget();

  const mkRT = (s, type) => new THREE.WebGLRenderTarget(s, s, {
    minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
    format:THREE.RGBAFormat, type:type||THREE.UnsignedByteType,
    wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, depthBuffer:false
  });
  const run = (rt, mat) => { quad.material = mat; renderer.setRenderTarget(rt); renderer.render(sc, cam); };
  const common = { uPeriod:{value:new THREE.Vector2(o.period,o.period)}, uSeed:{value:o.seed} };

  // 1. height + masks
  const rtH = mkRT(o.size, THREE.HalfFloatType);
  run(rtH, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:HEIGHT_FS, uniforms:Object.assign({}, common, {
    uBeds:{value:o.beds}, uBedDepth:{value:o.bedDepth}, uBedSoft:{value:o.bedSoft},
    uFissureCells:{value:o.fissureCells}, uFissureSharp:{value:o.fissureSharp}, uFissureDepth:{value:o.fissureDepth},
    uChipCells:{value:o.chipCells}, uChipDepth:{value:o.chipDepth},
    uPitCells:{value:o.pitCells}, uPitDepth:{value:o.pitDepth},
    uVeinDepth:{value:o.veinDepth}, uRunnel:{value:o.runnel}, uMicro:{value:o.micro}, uMacro:{value:o.macro},
    uGrainCells:{value:o.grainCells}, uGrainAmp:{value:o.grainAmp}, uVeinSharp:{value:o.veinSharp}
  })}));

  // 2. albedo / orm / normal
  const V3 = a => new THREE.Vector3(a[0],a[1],a[2]);
  const rtA = mkRT(o.size);
  run(rtA, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:ALBEDO_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uWarm:{value:V3(o.warm)}, uCool:{value:V3(o.cool)},
    uDark:{value:V3(o.dark)}, uPale:{value:V3(o.pale)}, uVein:{value:V3(o.vein)},
    uStain:{value:o.stain}, uRecess:{value:o.recess}, uBleach:{value:o.bleach},
    uDust:{value:o.dust}, uGrain:{value:o.grain}, uGrainCells:{value:o.grainCells}, uVeinSharp:{value:o.veinSharp}
  })}));
  const rtO = mkRT(o.ormSize);
  run(rtO, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:ORM_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uTexel:{value:new THREE.Vector2(1/o.size,1/o.size)},
    uRough:{value:o.rough}, uRoughVar:{value:o.roughVar}, uAO:{value:o.ao}
  })}));
  const rtN = mkRT(o.size);
  run(rtN, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:NORMAL_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uTexel:{value:new THREE.Vector2(1/o.size,1/o.size)}, uStrength:{value:o.nrm*o.size/512}
  })}));

  // 3. read back so the maps get real mipmaps + anisotropy
  const grab = (rt, s, srgb) => {
    const buf = new Uint8Array(s*s*4);
    renderer.readRenderTargetPixels(rt, 0, 0, s, s, buf);
    const t = new THREE.DataTexture(buf, s, s, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    if(srgb) t.encoding = THREE.sRGBEncoding;
    t.needsUpdate = true;
    return t;
  };
  const out = {
    map: grab(rtA, o.size, true),
    ormMap: grab(rtO, o.ormSize, false),
    normalMap: grab(rtN, o.size, false)
  };
  out.roughnessMap = out.ormMap;
  out.aoMap = out.ormMap;

  renderer.setRenderTarget(prevTarget);
  rtH.dispose(); rtA.dispose(); rtO.dispose(); rtN.dispose();
  quad.geometry.dispose();
  return out;
}

/* A second, very high frequency normal tiled many times over the macro maps.
   The 2k maps carry the fissures and pockets; this carries the tooth of the
   stone, so the surface keeps resolving as you get closer instead of going
   smooth.                                                                  */
const DETAIL_FS = TEX_COMMON + \`
  uniform vec2 uTexel; uniform float uStrength;
  float hgt(vec2 uv){
    float a = fbm(uv, vec2(12.0), 4, 0.55);
    float b = fbm(uv + 4.4, vec2(48.0), 3, 0.5)*0.55;
    float c = 1.0 - clamp(worley(uv + 2.1, 26.0).x/0.42, 0.0, 1.0);
    float d = 1.0 - smoothstep(0.0, 0.10, worley2(uv + 8.3, vec2(16.0, 13.0)).y
                                        - worley2(uv + 8.3, vec2(16.0, 13.0)).x);
    return 0.5 + a*0.30 + b*0.18 - c*c*0.22 - d*0.10;
  }
  void main(){
    vec2 t = uTexel;
    float dx = hgt(vUv + vec2(t.x,0.0)) - hgt(vUv - vec2(t.x,0.0));
    float dy = hgt(vUv + vec2(0.0,t.y)) - hgt(vUv - vec2(0.0,t.y));
    vec3 n = normalize(vec3(-dx*uStrength, -dy*uStrength, 1.0));
    gl_FragColor = vec4(n*0.5 + 0.5, 1.0);
  }
\`;
function bakeDetailNormal(size, seed, strength){
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.ShaderMaterial({
    vertexShader:TEX_VS, fragmentShader:DETAIL_FS,
    uniforms:{ uPeriod:{value:new THREE.Vector2(1,1)}, uSeed:{value:seed},
               uTexel:{value:new THREE.Vector2(1/size,1/size)}, uStrength:{value:strength*size/512} }
  }));
  const sc = new THREE.Scene(); sc.add(quad);
  const cam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const prev = renderer.getRenderTarget();
  const rt = new THREE.WebGLRenderTarget(size, size, {
    minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, format:THREE.RGBAFormat,
    wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, depthBuffer:false });
  renderer.setRenderTarget(rt); renderer.render(sc, cam);
  const buf = new Uint8Array(size*size*4);
  renderer.readRenderTargetPixels(rt, 0, 0, size, size, buf);
  renderer.setRenderTarget(prev);
  const t = new THREE.DataTexture(buf, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  t.needsUpdate = true;
  rt.dispose(); quad.geometry.dispose();
  return t;
}
const DETAIL_N = bakeDetailNormal(1024, 3.0, 2.4);

/* Blend the detail normal into any standard material without forking the
   shader: swap the one chunk that builds the tangent-space normal.         */
function addDetailNormal(mat, scale, strength){
  mat.userData.detail = { scale, strength };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDetailMap = { value: DETAIL_N };
    shader.uniforms.uDetailScale = { value: scale };
    shader.uniforms.uDetailStrength = { value: strength };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <normalmap_pars_fragment>',
        '#include <normalmap_pars_fragment>\\nuniform sampler2D uDetailMap;\\nuniform float uDetailScale;\\nuniform float uDetailStrength;')
      .replace('#include <normal_fragment_maps>', \`
        #ifdef USE_NORMALMAP_TANGENTSPACE
          vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
          mapN.xy *= normalScale;
          vec3 detN = texture2D( uDetailMap, vUv * uDetailScale ).xyz * 2.0 - 1.0;
          mapN = normalize( vec3( mapN.xy + detN.xy * uDetailStrength, mapN.z ) );
          normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
        #else
          #include <normal_fragment_maps>
        #endif
      \`);
  };
  mat.needsUpdate = true;
  return mat;
}

function setRepeat(set, rx, ry){
  for(const k of ['map','normalMap','ormMap']) if(set[k]) set[k].repeat.set(rx,ry);
  return set;
}

/* Plinth limestone — the surface the eye spends the most time on.          */
const STONE = bakeStoneMaps({
  size:2048, ormSize:1024, seed:0.0,
  beds:5.0, bedDepth:0.034, bedSoft:0.11,
  fissureCells:7.0, fissureSharp:52.0, fissureDepth:0.16,
  chipCells:9.0, chipDepth:0.20, pitCells:30.0, pitDepth:0.15,
  veinDepth:0.024, veinSharp:120.0, runnel:0.030, micro:0.052, macro:0.30,
  grainCells:30.0, grainAmp:0.030,
  warm:[0.735,0.712,0.672], cool:[0.605,0.618,0.632], dark:[0.245,0.242,0.244],
  pale:[0.885,0.874,0.852], vein:[0.925,0.918,0.896],
  stain:0.24, recess:0.66, bleach:0.32, dust:0.30, grain:0.026,
  rough:0.82, roughVar:0.20, ao:3.2, nrm:3.0
});
setRepeat(STONE, 1.0, 0.68);

/* Loose rubble — coarser, more broken, no bedding to speak of.             */
const RUBBLE = bakeStoneMaps({
  size:1024, ormSize:512, seed:5.0,
  beds:2.0, bedDepth:0.022, bedSoft:0.24,
  fissureCells:6.0, fissureSharp:42.0, fissureDepth:0.18,
  chipCells:6.0, chipDepth:0.25, pitCells:22.0, pitDepth:0.18,
  grainCells:18.0, grainAmp:0.040,
  veinDepth:0.016, veinSharp:130.0, runnel:0.0, micro:0.036, macro:0.34,
  warm:[0.700,0.678,0.645], cool:[0.590,0.601,0.615], dark:[0.235,0.232,0.234],
  pale:[0.845,0.836,0.818], vein:[0.895,0.889,0.870],
  stain:0.26, recess:0.64, bleach:0.28, dust:0.26, grain:0.030,
  rough:0.86, roughVar:0.16, ao:3.4, nrm:2.6
});

/* Statue marble — dense, faintly veined, weathered only in the hollows.    */
const MARBLE = bakeStoneMaps({
  size:2048, ormSize:1024, seed:11.0,
  beds:2.0, bedDepth:0.012, bedSoft:0.26,
  fissureCells:26.0, fissureSharp:68.0, fissureDepth:0.055,
  chipCells:10.0, chipDepth:0.070, pitCells:42.0, pitDepth:0.070,
  grainCells:44.0, grainAmp:0.014,
  veinDepth:0.012, veinSharp:150.0, runnel:0.012, micro:0.020, macro:0.14,
  warm:[0.885,0.872,0.850], cool:[0.828,0.833,0.840], dark:[0.470,0.462,0.455],
  pale:[0.965,0.962,0.952], vein:[0.975,0.972,0.964],
  stain:0.22, recess:0.42, bleach:0.24, dust:0.22, grain:0.018,
  rough:0.52, roughVar:0.28, ao:2.6, nrm:2.4
});
setRepeat(MARBLE, 4.4, 4.4);

/* =====================================================================
   3. background haze  (drawn first, occluded by geometry)
   ===================================================================== */
/* The reference background is a narrow vertical shaft of light sitting inside a
   broad halo.  Both terms were fitted to the source frame in sRGB, so the
   shader builds the target sRGB value and then inverts the tone curve.      */
const bgMat = new THREE.ShaderMaterial({
  depthTest:false, depthWrite:false,
  uniforms:{
    uShaft :{value:new THREE.Vector4(50.8/255.0, 0.522, 0.292, 0.0)}, // amp, cx, cy
    uShaftS:{value:new THREE.Vector2(0.055, 0.201)},
    uHalo  :{value:new THREE.Vector4(58.3/255.0, 0.522, 0.440, 0.0)},
    uHaloS :{value:new THREE.Vector2(0.300, 0.310)},
    uVig   :{value:new THREE.Vector2(0.86, 0.24)},
    uTintA :{value:new THREE.Color(0xfff7ec)},
    uTintB :{value:new THREE.Color(0xdad8d4)},
    uGain  :{value:1.07}
  },
  vertexShader:\`varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,1.0,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv;
    uniform vec4 uShaft,uHalo; uniform vec2 uShaftS,uHaloS,uVig;
    uniform vec3 uTintA,uTintB; uniform float uGain;
    // exact inverse of the ACES fit used in the final pass
    float invAces(float y){
      const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
      float A=y*c-a, B=y*d-b, C=y*e;
      if(abs(A)<1e-5) return -C/max(B,1e-5);
      float disc = max(B*B-4.0*A*C, 0.0);
      float x = (-B - sqrt(disc))/(2.0*A);
      if(x<0.0) x = (-B + sqrt(disc))/(2.0*A);
      return clamp(x, 0.0, 60.0);
    }
    void main(){
      vec2 p = vec2(vUv.x, 1.0-vUv.y);
      vec2 d1 = (p-uShaft.yz)/uShaftS;
      vec2 d2 = (p-uHalo.yz)/uHaloS;
      float g1 = exp(-0.5*dot(d1,d1));
      float g2 = exp(-0.5*dot(d2,d2));
      float s  = (uShaft.x*g1 + uHalo.x*g2)*uGain;
      vec2 q = (vUv-0.5)*vec2(1.0,0.90);
      s *= mix(uVig.y, 1.0, smoothstep(0.74, 0.30, length(q)));
      vec3 tint = mix(uTintB, uTintA, clamp(g1*1.6+g2*0.5,0.0,1.0));
      float lin = invAces(pow(clamp(s,0.0,1.0), 2.2));
      gl_FragColor = vec4(tint*lin, 1.0);
    }\`
});
const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), bgMat);
bgQuad.frustumCulled = false;
bgQuad.renderOrder = -10;
scene.add(bgQuad);

/* =====================================================================
   4. environment + lights
   ===================================================================== */
/* A tiny procedural sky — near-black surround, one warm high blob where the
   shaft sits and a dim cool bounce below.  Through PMREM it gives the stone
   a roughness-aware specular response, which is most of what separates
   "3D render" from "lit photograph".                                      */
function environmentTexture(){
  const W=256,H=128;
  const c=document.createElement('canvas'); c.width=W; c.height=H;
  const ctx=c.getContext('2d'); const img=ctx.createImageData(W,H); const d=img.data;
  const L=new THREE.Vector3(-0.34,0.86,-0.38).normalize();
  for(let y=0;y<H;y++){
    const th=(0.5-(y+0.5)/H)*Math.PI;                    // +pi/2 zenith
    for(let x=0;x<W;x++){
      const ph=((x+0.5)/W)*Math.PI*2-Math.PI;
      const dir=new THREE.Vector3(Math.cos(th)*Math.sin(ph), Math.sin(th), Math.cos(th)*Math.cos(ph));
      const up=Math.max(0,dir.y);
      const cosA=Math.max(-1,Math.min(1,dir.dot(L)));
      const ang=Math.acos(cosA);
      const blob=Math.exp(-(ang*ang)/0.30)*2.4 + Math.exp(-(ang*ang)/1.60)*0.42;
      const sky=Math.pow(up,1.6)*0.16;
      const floorBounce=Math.pow(Math.max(0,-dir.y),2.0)*0.05;
      const r=(blob*1.00+sky*0.90+floorBounce*0.75+0.012);
      const g=(blob*0.94+sky*0.94+floorBounce*0.80+0.012);
      const b=(blob*0.82+sky*1.00+floorBounce*0.95+0.014);
      const i=(y*W+x)*4;
      d[i]  =Math.min(255,Math.pow(Math.min(1,r),1/2.2)*255);
      d[i+1]=Math.min(255,Math.pow(Math.min(1,g),1/2.2)*255);
      d[i+2]=Math.min(255,Math.pow(Math.min(1,b),1/2.2)*255);
      d[i+3]=255;
    }
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);
  t.mapping=THREE.EquirectangularReflectionMapping;
  t.encoding=THREE.sRGBEncoding;
  return t;
}
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTex = environmentTexture();
  scene.environment = pmrem.fromEquirectangular(envTex).texture;
  envTex.dispose(); pmrem.dispose();
}

const key = new THREE.DirectionalLight(0xfff3e6, 3.45);
key.position.set(-1.4, 7.4, -2.6);
key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
key.shadow.camera.left = -3.2; key.shadow.camera.right = 3.2;
key.shadow.camera.top  =  4.2; key.shadow.camera.bottom = -3.6;
key.shadow.camera.near = 0.5;  key.shadow.camera.far = 18;
key.shadow.bias = -0.0006;
key.shadow.normalBias = 0.055;
key.shadow.radius = 1.2;
scene.add(key);
scene.add(key.target);
key.target.position.set(0, Y_PLINTH-0.2, 0);

const rim = new THREE.DirectionalLight(0xcdd0d6, 0.42);
rim.position.set(5.0, 2.0, -5.0);
scene.add(rim);

const fill = new THREE.HemisphereLight(0x9a999b, 0x08080a, 0.06);
const frontFill = new THREE.PointLight(0xefe9e1, 0.70, 26, 1.25);
frontFill.position.set(-4.0, 5.4, 4.6);
scene.add(frontFill);
scene.add(fill);

const shaftLight = new THREE.PointLight(0xffeeda, 2.6, 18, 2.0);
shaftLight.position.set(-0.5, 4.6, -1.1);
scene.add(shaftLight);

/* =====================================================================
   5. orbit rings
   ===================================================================== */
const ringMat = (col, boost) => new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{
    uColor:{value:new THREE.Color(col)},
    uBoost:{value:boost},
    uPhase:{value:0},
    uCam:{value:new THREE.Vector3()},
    uLightDir:{value:new THREE.Vector3(-0.42,0,-0.91)}
  },
  vertexShader:\`
    varying vec3 vW; varying vec2 vUv; varying vec3 vN;
    void main(){
      vUv=uv; vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz;
      vN = normalize(mat3(modelMatrix)*normal);
      gl_Position = projectionMatrix*viewMatrix*w;
    }\`,
  fragmentShader:\`
    varying vec3 vW; varying vec2 vUv; varying vec3 vN;
    uniform vec3 uColor,uCam,uLightDir; uniform float uBoost,uPhase;
    void main(){
      // radial direction of this point of the ring, in world space
      vec3 dir = normalize(vec3(vW.x, 0.0, vW.z));
      vec3 toCam = normalize(vec3(uCam.x, 0.0, uCam.z));
      float near = 0.5 + 0.5*dot(dir, toCam);            // 1 on the near arc
      float lit  = clamp(0.5 + 0.5*dot(dir, uLightDir), 0.0, 1.0);   // 1 facing the shaft
      float w = (0.45 + 0.55*pow(smoothstep(0.02,0.98,near),0.75))
              * (0.46 + 0.54*pow(max(lit,0.0),0.9));
      // soft edge across the tube so the core blooms and the rim feathers
      float t = abs(vUv.y-0.5)*2.0;
      float core = smoothstep(1.0, 0.62, t);
      gl_FragColor = vec4(uColor*uBoost*w*core, w*core);
    }\`
});

/* Each orbit is a bundle of fine strands winding around a common path rather
   than one fat tube — they read as spun light, and the twist gives the ring
   something to catch the eye as it turns.                                   */
class StrandCurve extends THREE.Curve {
  constructor(R, w, wy, turns, phase, wob){
    super(); this.R=R; this.w=w; this.wy=wy; this.turns=turns; this.phase=phase; this.wob=wob||0;
  }
  getPoint(t, target){
    target = target || new THREE.Vector3();
    const a = t*Math.PI*2, s = a*this.turns + this.phase;
    // a second, slower undulation so no two strands stay parallel for long
    const q = a*2.0 + this.phase*1.7;
    const r = this.R + Math.cos(s)*this.w + Math.cos(q)*this.wob;
    target.set(Math.cos(a)*r, Math.sin(s)*this.wy + Math.sin(q)*this.wob*0.6, Math.sin(a)*r);
    return target;
  }
}
/* Each orbit is a loose skein of very fine filaments rather than one rope:
   more of them, thinner, spread over a wider bundle, each on its own twist
   rate so they braid, cross and separate along the run.                    */
function makeRing(radius, tube, y, colour, boost, opt){
  const o = Object.assign({
    strands:9, turns:11, spread:0.042, seg:700, radial:10,
    gain:[1.0,0.62,0.86,0.48,0.74,0.94,0.55,0.80,0.66]
  }, opt||{});
  const group = new THREE.Group();
  const pr = mulberry32(7717 + Math.round(radius*1000));
  for(let i=0;i<o.strands;i++){
    const phase = (i/o.strands)*Math.PI*2 + pr()*0.9;
    const turns = Math.max(3, Math.round(o.turns*(0.62 + pr()*0.85)));
    const off   = (pr()-0.5)*o.spread*1.15;
    const w     = o.spread*(0.45 + pr()*0.85);
    const wy    = o.spread*(0.40 + pr()*0.80);
    const curve = new StrandCurve(radius + off, w, wy, turns, phase, o.spread*0.30*pr());
    const g = new THREE.TubeGeometry(curve, o.seg, tube*(0.72 + pr()*0.65), o.radial, true);
    const m = ringMat(colour, boost*(o.gain[i%o.gain.length]));
    const mesh = new THREE.Mesh(g, m);
    mesh.renderOrder = 6;
    group.add(mesh);
  }
  group.position.y = y;
  scene.add(group);
  return group;
}
const ringTop = makeRing(R_RING_TOP, 0.0040, Y_RING_TOP, 0xffbb68, 13.5, {strands:9, turns:12, spread:0.028});
const ringLow = makeRing(R_RING_LOW, 0.0037, Y_RING_LOW, 0xffbe6e, 13.5, {strands:9, turns:9,  spread:0.025});

/* A wider halo of orbits at mixed inclinations — the thing an orrery is: a
   nest of paths around one centre.  Dimmer and finer than the two principal
   rings so they read as depth rather than competing with them.             */
const haloRings = [];
{
  const spec = [
    /* Kept clear of the table's own plane: from this eye height an orbit at
       the height of the pavement would lie straight across the plan.      */
    {r:2.62, y:2.36, tilt:[ 0.22, 0.00, 0.09], s:5, g:0.15, tw:14},
    {r:2.30, y:0.06, tilt:[-0.17, 0.62,-0.11], s:5, g:0.13, tw:10},
    {r:3.04, y:2.92, tilt:[ 0.12, 1.20, 0.20], s:4, g:0.11, tw:16}
  ];
  spec.forEach((k,i)=>{
    const g = makeRing(k.r, 0.0026, k.y, i%2 ? 0xffc078 : 0xffb862, 13.5*k.g,
                       {strands:k.s, turns:k.tw, spread:0.030, seg:520, radial:8});
    g.rotation.set(k.tilt[0], k.tilt[1], k.tilt[2]);
    g.userData.spin = (i%2?1:-1)*(0.010 + i*0.004);
    haloRings.push(g);
  });
}

/* =====================================================================
   6. the table
   ===================================================================== */
/* PolyhedronGeometry and MarchingCubes both hand back *non-indexed* meshes, so
   computeVertexNormals() gives every triangle its own normal and the silhouette
   reads as facets.  This averages normals across coincident positions while
   leaving the UV seams intact, which is what actually makes the rock look like
   rock instead of a die.                                                     */
function smoothNormals(geo, tol){
  geo.computeVertexNormals();
  const pos = geo.attributes.position, nor = geo.attributes.normal;
  const n = pos.count, q = 1/(tol||1e-4);
  const acc = new Map();
  const key = i => (Math.round(pos.getX(i)*q)+'_'+Math.round(pos.getY(i)*q)+'_'+Math.round(pos.getZ(i)*q));
  for(let i=0;i<n;i++){
    const k = key(i);
    let a = acc.get(k);
    if(!a){ a=[0,0,0]; acc.set(k,a); }
    a[0]+=nor.getX(i); a[1]+=nor.getY(i); a[2]+=nor.getZ(i);
  }
  for(let i=0;i<n;i++){
    const a = acc.get(key(i));
    const l = Math.hypot(a[0],a[1],a[2]) || 1;
    nor.setXYZ(i, a[0]/l, a[1]/l, a[2]/l);
  }
  nor.needsUpdate = true;
  return geo;
}

// bake a vertical falloff into vertex colours so the mass dissolves downward
function depthFade(geo, offsetY, y0, y1){
  const pos=geo.attributes.position, n=pos.count;
  const col=new Float32Array(n*3);
  for(let i=0;i<n;i++){
    const wy=pos.getY(i)+offsetY;
    let k=(wy-y0)/(y1-y0); k=Math.max(0,Math.min(1,k));
    k=Math.pow(k,0.75);
    const v=0.34+0.66*k;
    col[i*3]=col[i*3+1]=col[i*3+2]=v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  return geo;
}

function erode(geo, opts){
  const o = Object.assign({amp:.05, freq:1.6, strata:0, strataAmp:0, seed:0},opts||{});
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const n  = fbm3(v.x*o.freq+o.seed, v.y*o.freq*1.6+o.seed, v.z*o.freq+o.seed, 4, 2.1, .55);
    const n2 = fbm3(v.x*o.freq*4.3+11, v.y*o.freq*6.1, v.z*o.freq*4.3, 3, 2.05, .5);
    const n3 = fbm3(v.x*o.freq*13.0+29, v.y*o.freq*17.0, v.z*o.freq*13.0, 2);
    let d = n*o.amp + n2*o.amp*0.34 + n3*o.amp*0.12;
    if(o.strata){
      const band = Math.sin(v.y*o.strata + fbm3(v.x*.9,v.y*.4,v.z*.9,2)*2.2);
      d += band*o.strataAmp;
    }
    const dir = v.clone().normalize();
    v.addScaledVector(dir, d);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

const stoneMat = new THREE.MeshStandardMaterial({
  map:STONE.map, normalMap:STONE.normalMap, roughnessMap:STONE.ormMap, aoMap:STONE.ormMap, aoMapIntensity:0.9,
  normalScale:new THREE.Vector2(1.15,1.15),
  color:0x93918e, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.52,
});
addDetailNormal(stoneMat, 9.0, 0.65);

/* ---------------------------------------------------------------------
   Box-projected UVs for the labyrinth's walling.

   BoxGeometry lays one whole copy of the map on each face however long or
   short that face is, which would put the entire 2k stone on every one of
   three hundred kerbstones.  Choosing the axis from which face the vertex
   sits on (rather than from its normal, which the displacement has
   already bent) and scaling by world size instead gives one texel density
   from the outer wall to the smallest fallen block.
   --------------------------------------------------------------------- */
function boxUV(geo, hx, hy, hz, scale, ox, oy){
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
    const ex=Math.abs(x)/hx, ey=Math.abs(y)/hy, ez=Math.abs(z)/hz;
    let u,v;
    if(ey>=ex && ey>=ez){ u=x; v=z; }
    else if(ex>=ez)     { u=z; v=y; }
    else                { u=x; v=y; }
    uv[i*2]   = u*scale + (ox||0);
    uv[i*2+1] = v*scale + (oy||0);
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  return geo;
}

function tintGeo(geo, v){
  const n = geo.attributes.position.count;
  const c = new Float32Array(n*3); c.fill(v);
  geo.setAttribute('color', new THREE.BufferAttribute(c,3));
  return geo;
}

const plinth = new THREE.Group();
scene.add(plinth);

/* ---------------------------------------------------------------------
   The table.

   The orrery's shelf was a stack of boxes; this is one lathe, because the
   thing standing on it is drawn in polar coordinates and wants a round
   ground under it.  The profile runs bottom-up round the outside and then
   inward across the table, which is the direction LatheGeometry needs if
   its normals are to face out.

   Its UVs are rebuilt from the lathe's own index grid: one copy of the
   map every quarter turn — a whole number, so the meridian where the
   sweep closes has no seam — and by arc length down the profile, so the
   cliff does not stretch where the profile steepens.  The table itself
   takes a flat projection instead: it must not appear to turn with the
   rock, or the corridors would swim.
   --------------------------------------------------------------------- */
const MESA_R = 1.46;
function mesaProfile(){
  const ctrl = [
    [0.000,-2.44],[0.28,-2.36],[0.56,-2.16],[0.82,-1.86],[1.00,-1.56],
    [1.09,-1.30],[1.20,-1.22],[1.17,-0.98],[1.34,-0.90],[1.41,-0.58],
    [1.36,-0.26],[1.455,-0.185],[1.475,-0.070],[MESA_R,0.000],
    [1.06,0.000],[0.52,0.000],[0.000,0.000]
  ];
  const pts = [];
  for(let i=0;i<ctrl.length-1;i++){
    const a = ctrl[i], b = ctrl[i+1];
    const n = Math.max(1, Math.round(Math.hypot(b[0]-a[0], b[1]-a[1])/0.052));
    for(let k=0;k<n;k++){
      const t = k/n;
      pts.push(new THREE.Vector2(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t));
    }
  }
  pts.push(new THREE.Vector2(ctrl[ctrl.length-1][0], ctrl[ctrl.length-1][1]));
  return pts;
}
{
  const pts = mesaProfile();
  const SEG = 200;
  const g = new THREE.LatheGeometry(pts, SEG);

  // --- UVs, off the index grid, before anything moves ---------------------
  {
    const cum=[0];
    for(let j=1;j<pts.length;j++) cum[j]=cum[j-1]+pts[j].distanceTo(pts[j-1]);
    const SCALE = 4/(2*Math.PI*MESA_R);           // exactly four wraps, so no seam
    const uv=g.attributes.uv, nor=g.attributes.normal, pos=g.attributes.position;
    for(let i=0;i<=SEG;i++) for(let j=0;j<pts.length;j++){
      const k=i*pts.length+j;
      if(Math.abs(nor.getY(k))>0.6) uv.setXY(k, pos.getX(k)*SCALE, pos.getZ(k)*SCALE);
      else                          uv.setXY(k, (i/SEG)*2*Math.PI*MESA_R*SCALE, cum[j]*SCALE);
    }
  }

  // --- weathering ---------------------------------------------------------
  {
    const pos=g.attributes.position, nor=g.attributes.normal;
    const v=new THREE.Vector3(), n=new THREE.Vector3();
    for(let i=0;i<pos.count;i++){
      v.fromBufferAttribute(pos,i);
      n.fromBufferAttribute(nor,i);
      const f1 = fbm3(v.x*2.3+4.1, v.y*3.1, v.z*2.3+1.7, 4, 2.1, .55);
      const f2 = fbm3(v.x*7.4+11., v.y*9.6, v.z*7.4, 3, 2.05, .5);
      const f3 = fbm3(v.x*19.+29., v.y*24., v.z*19., 2);
      const band = Math.sin(v.y*9.0 + f1*2.4);           // bedding
      if(n.y > 0.6){
        // the table stays a table: it is only bitten back at its edge
        const r = Math.hypot(v.x, v.z);
        const k = Math.pow(Math.max(0,(r-1.10)/(MESA_R-1.10)), 1.5);
        const rr = (r||1);
        v.x += (v.x/rr)*(f1*0.115 + f2*0.040)*k;
        v.z += (v.z/rr)*(f1*0.115 + f2*0.040)*k;
        v.y += (f2*0.010 + f3*0.004)*(0.25+k*2.4);
      }else{
        const d = f1*0.090 + f2*0.034 + f3*0.011 + band*0.034;
        v.addScaledVector(n, d);
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
  }
  smoothNormals(g, 1e-4);
  /* The orrery's shelf only ever showed the key light a narrow edge; this
     table takes it square on across two and a half metres.  Its albedo
     comes down a stop and a half, and the kerbs go up: the plan has to
     read as pale stone set into dark ground, not as shadow, because the
     key is near overhead and there are points in the turn where the
     corridors throw almost no shadow at all.                             */
  depthFade(g, Y_PLINTH, Y_PLINTH-3.0, Y_PLINTH-0.05);
  {
    const c = g.attributes.color;
    for(let i=0;i<c.count;i++) c.setXYZ(i, c.getX(i)*0.40, c.getY(i)*0.40, c.getZ(i)*0.40);
  }
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.y = Y_PLINTH;
  plinth.add(m);
}
// what is left of the rock the table was cut from
{
  const g = rockGeometry(5, 44, 0.86);
  g.scale(0.60,0.60,0.60);
  erode(g,{amp:.14, freq:2.4, seed:44.2});
  smoothNormals(g, 2e-4);
  depthFade(g, Y_PLINTH-2.46, Y_PLINTH-3.0, Y_PLINTH-1.4);
  {
    const c = g.attributes.color;
    for(let i=0;i<c.count;i++) c.setXYZ(i, c.getX(i)*0.40, c.getY(i)*0.40, c.getZ(i)*0.40);
  }
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(0.05, Y_PLINTH-2.46, -0.03);
  m.scale.set(1.10,0.82,1.06);
  plinth.add(m);
}

/* =====================================================================
   7. the labyrinth
   ===================================================================== */
/* The dressed stone the pavement is set in — paler and denser than the
   table it lies on, weathered only in the hollows.  The same marble the
   orrery's lantern was cut from, dropped in value so it reads as good
   limestone kerb rather than as inlay.                                  */
const marbleMat = new THREE.MeshStandardMaterial({
  map:MARBLE.map, normalMap:MARBLE.normalMap, roughnessMap:MARBLE.ormMap, aoMap:MARBLE.ormMap, aoMapIntensity:0.75,
  normalScale:new THREE.Vector2(1.9,1.9),
  color:0xa39c92, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.42,
});
addDetailNormal(marbleMat, 14.0, 0.60);

const labyrinth = new THREE.Group();
labyrinth.position.set(0, Y_PLINTH, 0);
scene.add(labyrinth);

const TAU = Math.PI*2;

/* ---------------------------------------------------------------------
   The plan.

   A polar grid: six rings about a middle, each ring cut into sectors that
   double in number as the circumference grows, so no cell is ever much
   wider than it is deep.  A depth-first carve starting at the middle
   takes down one wall at a time and never re-enters a cell it has
   already reached, which is what guarantees the two properties that make
   this a maze rather than a drawn spiral: every cell can be reached, and
   between any two of them there is exactly one route.  The dead ends are
   the branches the carve abandoned.
   --------------------------------------------------------------------- */
const RINGS = 6, R0 = 0.185, DR = 0.180;
const NS = [8, 8, 16, 16, 32, 32];
const OFF = [];
{ let acc = 1; for(let i=0;i<RINGS;i++){ OFF[i]=acc; acc+=NS[i]; } OFF.total = acc; }
const cid   = (i,s) => i<0 ? 0 : OFF[i] + ((s%NS[i])+NS[i])%NS[i];
const ringR = i => R0 + i*DR;                      // the inner edge of ring i
const cellR = i => R0 + (i+0.5)*DR;
const cellA = (i,s) => (s+0.5)/NS[i]*TAU;

/* Every move out of a cell, with the wall that has to come down for it. */
function neighbours(i,s){
  const out = [];
  if(i < 0){
    for(let k=0;k<NS[0];k++) out.push({i:0, s:k, wall:'a0_'+k});
    return out;
  }
  const n = NS[i];
  out.push({i, s:(s+1)%n,   wall:'r'+i+'_'+((s+1)%n)});
  out.push({i, s:(s-1+n)%n, wall:'r'+i+'_'+s});
  out.push(i===0 ? {i:-1, s:0, wall:'a0_'+s}
                 : {i:i-1, s:Math.floor(s*NS[i-1]/n), wall:'a'+i+'_'+s});
  if(i < RINGS-1){
    const k = NS[i+1]/n;
    for(let t=0;t<k;t++) out.push({i:i+1, s:s*k+t, wall:'a'+(i+1)+'_'+(s*k+t)});
  }
  return out;
}

const MOUTH = 21;                                  // the sector the way in cuts
const open = new Set();
{
  const seen = new Uint8Array(OFF.total);
  const pr = mulberry32(20260823);
  const stack = [{i:-1, s:0}];
  seen[0] = 1;
  while(stack.length){
    const c = stack[stack.length-1];
    const free = neighbours(c.i, c.s).filter(n => !seen[cid(n.i,n.s)]);
    if(!free.length){ stack.pop(); continue; }
    const pick = free[(pr()*free.length)|0];
    open.add(pick.wall);
    seen[cid(pick.i,pick.s)] = 1;
    stack.push({i:pick.i, s:pick.s});
  }
  open.add('out_'+MOUTH);
}

/* The one route, found the way anyone finds it: breadth first from the
   mouth until the middle comes up, then walk the parents back.          */
const route = (function(){
  const prev = new Int32Array(OFF.total).fill(-2);
  const cell = new Array(OFF.total);
  const start = {i:RINGS-1, s:MOUTH};
  prev[cid(start.i,start.s)] = -1;
  cell[cid(start.i,start.s)] = start;
  const q = [start];
  while(q.length){
    const c = q.shift();
    if(c.i < 0) break;
    for(const n of neighbours(c.i,c.s)){
      if(!open.has(n.wall)) continue;
      const k = cid(n.i,n.s);
      if(prev[k] !== -2) continue;
      prev[k] = cid(c.i,c.s);
      cell[k] = {i:n.i, s:n.s};
      q.push(cell[k]);
    }
  }
  const path = [];
  for(let k=0; k!==-1; k=prev[k]) path.push(cell[k]);
  return path.reverse();
})();

/* ---- masonry ----------------------------------------------------------
   The kerbs are laid stone by stone rather than extruded as one ring, so
   the walls keep an uneven top line and a joint every eighty millimetres,
   then the lot is merged into a single buffer.                           */
function mergeGeos(list){
  const parts = list.map(g => g.index ? g.toNonIndexed() : g);
  let n = 0;
  for(const g of parts) n += g.attributes.position.count;
  const pos = new Float32Array(n*3), nor = new Float32Array(n*3);
  const uv  = new Float32Array(n*2), col = new Float32Array(n*3);
  let o = 0;
  for(const g of parts){
    const a = g.attributes;
    pos.set(a.position.array, o*3);
    nor.set(a.normal.array,   o*3);
    uv .set(a.uv.array,       o*2);
    if(a.color) col.set(a.color.array, o*3); else col.fill(1, o*3, (o+a.position.count)*3);
    o += a.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos,3));
  out.setAttribute('normal',   new THREE.BufferAttribute(nor,3));
  out.setAttribute('uv',       new THREE.BufferAttribute(uv,2));
  out.setAttribute('color',    new THREE.BufferAttribute(col,3));
  return out;
}

const blockCache = new Map();
function stoneBlock(w,h,d,seed,wear){
  const key = w.toFixed(3)+':'+h.toFixed(3)+':'+d.toFixed(3)+':'+seed+':'+wear.toFixed(2);
  const hit = blockCache.get(key);
  if(hit) return hit;
  const g = new THREE.BoxGeometry(w,h,d, 4,3,3);
  const pos = g.attributes.position, v = new THREE.Vector3(), dir = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const ex = Math.abs(v.x)/(w*0.5), ey = Math.abs(v.y)/(h*0.5), ez = Math.abs(v.z)/(d*0.5);
    const arris = Math.pow(Math.max(0,(ex+ey+ez-1.45)/1.55), 1.25);
    const n1 = fbm3(v.x*13.0+seed*3.7, v.y*13.0+seed, v.z*13.0+seed*1.9, 3, 2.1, .55);
    const n2 = fbm3(v.x*41.0+seed, v.y*41.0, v.z*41.0, 2);
    dir.copy(v).normalize();
    v.multiplyScalar(1 - arris*0.10*wear);
    v.addScaledVector(dir, (n1*0.0075 + n2*0.0028)*wear);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  boxUV(g, w*0.5, h*0.5, d*0.5, 4.6, (seed*0.37)%1, (seed*0.71)%1);
  blockCache.set(key, g);
  return g;
}

const _q1 = new THREE.Quaternion(), _e1 = new THREE.Euler(), _p1 = new THREE.Vector3();
const _one = new THREE.Vector3(1,1,1), _m1 = new THREE.Matrix4();
function place(out, geo, x,y,z, rx,ry,rz, tint){
  const g = geo.clone();
  _e1.set(rx,ry,rz,'YXZ'); _q1.setFromEuler(_e1); _p1.set(x,y,z);
  g.applyMatrix4(_m1.compose(_p1,_q1,_one));
  tintGeo(g, tint);
  out.push(g);
  return g;
}

const KERB = [];
const WH = 0.064, WT = 0.042, WY = -0.014;         // height, thickness, buried a little
const wpr = mulberry32(661803);

/* A block's local +x has to lie along the wall.  rotation.y = a sends +x
   to (cos a, 0, -sin a), so a radial run wants -a and an arc run wants
   -a - pi/2.                                                             */
function arcRun(r, a0, a1, h, tint){
  const arc = (a1-a0)*r;
  const n = Math.max(1, Math.round(arc/0.078));
  for(let k=0;k<n;k++){
    const a = a0 + (a1-a0)*((k+0.5)/n);
    const hh = h*(0.90 + wpr()*0.20);
    const g = stoneBlock(arc/n + WT*0.85, hh, WT, 1+((k*7+((r*90)|0))%9), 1);
    place(KERB, g, Math.cos(a)*r, WY + hh*0.5, Math.sin(a)*r,
      (wpr()-0.5)*0.03, -a - Math.PI/2 + (wpr()-0.5)*0.03, (wpr()-0.5)*0.03,
      tint*(0.965 + wpr()*0.070));
  }
}
function radialRun(a, r0, r1, h, tint){
  const n = Math.max(1, Math.round((r1-r0)/0.078));
  for(let k=0;k<n;k++){
    const r = r0 + (r1-r0)*((k+0.5)/n);
    const hh = h*(0.90 + wpr()*0.20);
    const g = stoneBlock((r1-r0)/n + WT*0.85, hh, WT, 20+((k*5+((a*30)|0))%9), 1);
    place(KERB, g, Math.cos(a)*r, WY + hh*0.5, Math.sin(a)*r,
      (wpr()-0.5)*0.03, -a + (wpr()-0.5)*0.03, (wpr()-0.5)*0.03,
      tint*(0.965 + wpr()*0.070));
  }
}

for(let i=0;i<RINGS;i++){
  for(let s=0;s<NS[i];s++){
    if(!open.has('a'+i+'_'+s)) arcRun(ringR(i), s/NS[i]*TAU, (s+1)/NS[i]*TAU, WH+0.014, 1.16);
    if(!open.has('r'+i+'_'+s)) radialRun(s/NS[i]*TAU, ringR(i), ringR(i+1), WH+0.014, 1.16);
  }
}
// the outer wall: taller, and open at one sector
{
  const n = NS[RINGS-1];
  for(let s=0;s<n;s++){
    if(open.has('out_'+s)) continue;
    arcRun(ringR(RINGS), s/n*TAU, (s+1)/n*TAU, WH+0.052, 1.22);
  }
  // the jambs of the way in
  const a0 = MOUTH/n*TAU, a1 = (MOUTH+1)/n*TAU;
  for(const a of [a0, a1]){
    for(let k=0;k<3;k++){
      const g = stoneBlock(0.070, 0.058, 0.070, 70+k, 0.6);
      place(KERB, g, Math.cos(a)*ringR(RINGS), WY+0.030+k*0.056, Math.sin(a)*ringR(RINGS),
        0, -a, 0, 1.26);
    }
  }
}
// stones off the outer wall, out on the walk
{
  const pr = mulberry32(90210);
  for(let k=0;k<34;k++){
    const a = pr()*TAU, r = ringR(RINGS) + 0.05 + Math.pow(pr(),0.7)*0.20;
    const g = stoneBlock(0.055+pr()*0.05, 0.036, 0.048, 80+(k%7), 1.5);
    place(KERB, g, Math.cos(a)*r, WY+0.020+pr()*0.006, Math.sin(a)*r,
      (pr()-0.5)*0.7, pr()*TAU, (pr()-0.5)*0.7, 0.98 + pr()*0.12);
  }
}

const kerbMesh = new THREE.Mesh(mergeGeos(KERB), marbleMat);
kerbMesh.castShadow = kerbMesh.receiveShadow = true;
labyrinth.add(kerbMesh);

/* ---- the middle -------------------------------------------------------
   A low round hearth, and on it the same fire the orrery kept in its
   lantern: an emissive core the bloom can catch, plus a point light so
   the innermost kerbs are lit from the middle outward.                   */
const FLAME_I = 1.85;
{
  const g = new THREE.LatheGeometry([
    new THREE.Vector2(0.000,-0.016), new THREE.Vector2(0.132,-0.016),
    new THREE.Vector2(0.138, 0.012), new THREE.Vector2(0.124, 0.030),
    new THREE.Vector2(0.096, 0.036), new THREE.Vector2(0.088, 0.018),
    new THREE.Vector2(0.000, 0.016)
  ], 40);
  smoothNormals(g, 1e-4);
  boxUV(g, 0.14, 0.03, 0.14, 4.6, 0.3, 0.6);
  tintGeo(g, 1.24);
  const m = new THREE.Mesh(g, marbleMat);
  m.castShadow = m.receiveShadow = true;
  labyrinth.add(m);
}

const flameMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{ uColor:{value:new THREE.Color(0xffb257)}, uBoost:{value:8.5}, uTime:{value:0} },
  vertexShader:\`varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    varying vec3 vP; uniform vec3 uColor; uniform float uBoost, uTime;
    void main(){
      float r = length(vP.xz)/0.09;
      float h = clamp((vP.y+0.10)/0.22, 0.0, 1.0);
      float body = pow(1.0-clamp(r,0.0,1.0), 1.6) * (0.35+0.65*(1.0-h));
      float flick = 0.88 + 0.12*sin(uTime*7.3) + 0.06*sin(uTime*17.7+1.3);
      gl_FragColor = vec4(uColor*uBoost*body*flick, body);
    }\`
});
const flame = new THREE.Mesh(new THREE.SphereGeometry(0.131, 24, 18), flameMat);
flame.scale.set(0.62, 0.94, 0.62);
flame.position.set(0, 0.108, 0);
flame.renderOrder = 5;
labyrinth.add(flame);

const flameLight = new THREE.PointLight(0xffbe7a, FLAME_I, 2.6, 2.0);
flameLight.position.copy(flame.position);
labyrinth.add(flameLight);

/* ---- the one route, lit ------------------------------------------------
   The solution, drawn as a thread of light lying in the corridors it
   passes through: a resting glow along its whole length so the way is
   always legible, and a head that walks it from the mouth to the middle
   on a loop.  It is the same additive tube the orbit rings are made of,
   so it blooms the same way they do.                                     */
const PATH_Y = 0.019;
const pathMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{ uColor:{value:new THREE.Color(0xffc47e)}, uBoost:{value:7.0}, uTime:{value:0} },
  vertexShader:\`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    varying vec2 vUv; uniform vec3 uColor; uniform float uBoost, uTime;
    void main(){
      float t = abs(vUv.y-0.5)*2.0;
      float core = smoothstep(1.0, 0.42, t);
      float head = fract(uTime*0.052);
      float d = vUv.x - head;
      d -= floor(d + 0.5);                                 // wrap to -0.5 .. 0.5
      float behind = step(d, 0.0);
      float comet = behind*exp(d*9.0) + (1.0-behind)*exp(-d*90.0);
      float rest = 0.24 + 0.07*sin(vUv.x*54.0 - uTime*1.5);
      gl_FragColor = vec4(uColor*uBoost*core*(rest + comet*1.35), core*(rest*0.85 + comet*0.9));
    }\`
});
{
  const pts = [];
  const push = (r,a) => pts.push(new THREE.Vector3(Math.cos(a)*r, PATH_Y, Math.sin(a)*r));
  const aMouth = cellA(RINGS-1, MOUTH);
  for(let k=3;k>0;k--) push(ringR(RINGS) + 0.02 + k*0.055, aMouth);   // in off the walk
  for(let k=0;k<route.length;k++){
    const c = route[k];
    if(k>0){
      const p = route[k-1];
      if(p.i === c.i && p.i >= 0){                       // along a ring: follow the arc
        const r = cellR(c.i);
        const a0 = cellA(c.i, p.s);
        let d = cellA(c.i, c.s) - a0;
        d -= Math.round(d/TAU)*TAU;
        for(let t=1;t<4;t++) push(r, a0 + d*(t/4));
      }
    }
    if(c.i < 0) pts.push(new THREE.Vector3(0, PATH_Y, 0));
    else        push(cellR(c.i), cellA(c.i, c.s));
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const g = new THREE.TubeGeometry(curve, pts.length*3, 0.0125, 8, false);
  const m = new THREE.Mesh(g, pathMat);
  m.renderOrder = 6;
  labyrinth.add(m);
}

labyrinth.rotation.y = -0.42;

/* =====================================================================
   8. debris field
   ===================================================================== */
/* Debris: a slow spiral of tumbling chips.  The reference keeps the inner
   field small and dim and puts the big soft chunks near the camera, so the
   swarm is generated in two bands.                                          */
/* A rock is a smooth-silhouette blob with a few flat cleavage faces, not a
   subdivided die: dense sphere -> multi-octave displacement -> soft plane cuts
   -> averaged normals.                                                       */
function rockGeometry(detail, seed, squash){
  const g = new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position, v = new THREE.Vector3();
  const planes = [];
  const pr = mulberry32(9137 + seed*977);
  const nCuts = 3 + Math.floor(pr()*3);
  for(let i=0;i<nCuts;i++){
    const a = pr()*Math.PI*2, b = Math.acos(pr()*2-1);
    planes.push({
      n: new THREE.Vector3(Math.sin(b)*Math.cos(a), Math.cos(b), Math.sin(b)*Math.sin(a)),
      d: 0.60 + pr()*0.30,
      k: 0.45 + pr()*0.45
    });
  }
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const d = v.clone();
    const n1 = fbm3(d.x*1.05+seed*13, d.y*1.05, d.z*1.05, 3, 2.05, .55);
    const n2 = fbm3(d.x*2.9+seed*7,  d.y*2.9,  d.z*2.9,  3);
    const n3 = fbm3(d.x*7.4+seed*3,  d.y*7.4,  d.z*7.4,  2);
    const n4 = fbm3(d.x*19.0+seed*5, d.y*19.0, d.z*19.0, 2);
    v.multiplyScalar(1 + n1*0.30 + n2*0.11 + n3*0.038 + n4*0.013);
    for(const p of planes){                       // soft cleavage faces
      const t = v.dot(p.n) - p.d;
      if(t > 0) v.addScaledVector(p.n, -t*p.k);
    }
    v.y *= squash;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  return smoothNormals(g, 2e-4);
}
const debrisGeos = [];          // near-camera chunks carry the most detail
for(let i=0;i<5;i++) debrisGeos.push(rockGeometry(5, i+1, 0.52 + (i%3)*0.16));
const debrisGeosFar = [];
for(let i=0;i<6;i++) debrisGeosFar.push(rockGeometry(3, i+21, 0.52 + (i%3)*0.16));
const debrisMat = new THREE.MeshStandardMaterial({
  map:RUBBLE.map, normalMap:RUBBLE.normalMap, roughnessMap:RUBBLE.ormMap, aoMap:RUBBLE.ormMap, aoMapIntensity:0.9,
  normalScale:new THREE.Vector2(1.3,1.3),
  color:0x8a8884, roughness:1.0, metalness:0.0, envMapIntensity:0.30,
});
addDetailNormal(debrisMat, 5.0, 0.70);
const debris = [];
const debrisGroup = new THREE.Group(); scene.add(debrisGroup);

function spawnDebris(n, rMin, rMax, sMin, sMax, yMin, yMax, turns){
  for(let i=0;i<n;i++){
    const pool = (sMax > 0.09) ? debrisGeos : debrisGeosFar;
    const m = new THREE.Mesh(pool[(debris.length)%pool.length], debrisMat);
    m.castShadow = true;
    const t = i/n;
    const r = rMin + Math.pow(rnd(),0.8)*(rMax-rMin);
    const a = t*Math.PI*2*turns + rnd()*0.9;
    const y = yMin + t*(yMax-yMin) + (rnd()-.5)*1.0;
    const s = sMin + Math.pow(rnd(),2.2)*(sMax-sMin);
    m.scale.setScalar(s);
    m.userData = {
      r, a, y, s,
      spin:new THREE.Vector3((rnd()-.5)*.42,(rnd()-.5)*.42,(rnd()-.5)*.42),
      w:(0.018+rnd()*0.028)*(rnd()<.2?-1:1),
      drift:(rnd()-0.42)*0.030,
      push:new THREE.Vector3(), rot:new THREE.Euler(rnd()*6.28,rnd()*6.28,rnd()*6.28)
    };
    debrisGroup.add(m);
    debris.push(m);
  }
}
spawnDebris(74, 1.6, 4.8, 0.016, 0.062, -1.2, 5.6, 3.1);   // inner chips
spawnDebris(28, 5.0,10.8, 0.09 , 0.52 , -3.0, 4.4, 1.9);   // near-camera chunks

/* =====================================================================
   9. starfield + drifting motes
   ===================================================================== */
/* A soft round sprite, drawn once and reused by both point systems.        */
function radialSprite(size, stops){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  stops.forEach(([t, col]) => grd.addColorStop(t, col));
  g.fillStyle = grd; g.fillRect(0,0,size,size);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}
const SPRITE = radialSprite(64, [[0,'rgba(255,255,255,1)'],[0.30,'rgba(255,247,232,0.55)'],[1,'rgba(255,244,226,0)']]);

/* --- stars ------------------------------------------------------------
   Far enough out that the orbit never parallaxes them, on a shell rather
   than a box so the density stays even.  Magnitudes follow a power law, so
   a handful read as bright and the rest as dust; each twinkles on its own
   phase and the colour drifts a little across the field.                  */
let stars = null;
{
  const N = 2600;
  const pos = new Float32Array(N*3), seed = new Float32Array(N*4), tint = new Float32Array(N*3);
  for(let i=0;i<N;i++){
    // even distribution over the sphere, biased away from straight down
    const u1 = rnd()*2-1, th = rnd()*Math.PI*2;
    const sp = Math.sqrt(Math.max(0,1-u1*u1));
    const R = 120 + rnd()*40;
    pos[i*3]   = Math.cos(th)*sp*R;
    pos[i*3+1] = (u1*0.80 + 0.02)*R;
    pos[i*3+2] = Math.sin(th)*sp*R;
    const mag = Math.pow(rnd(), 3.4);                 // few bright, many faint
    seed[i*4]   = rnd()*6.283;                        // twinkle phase
    seed[i*4+1] = 0.35 + rnd()*1.5;                   // twinkle rate
    seed[i*4+2] = 0.20 + mag*1.25;                    // brightness
    seed[i*4+3] = 0.55 + mag*2.6;                     // size
    const warm = rnd();
    tint[i*3]   = 1.0;
    tint[i*3+1] = 0.94 + warm*0.06;
    tint[i*3+2] = 0.86 + warm*0.16;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,4));
  g.setAttribute('tint', new THREE.BufferAttribute(tint,3));
  const m = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, depthTest:false, blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0}, uMap:{value:SPRITE}, uPix:{value:1}, uFade:{value:1} },
    vertexShader:\`
      attribute vec4 seed; attribute vec3 tint;
      varying float vA; varying vec3 vT;
      uniform float uTime, uPix;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = seed.w * uPix * 2.9;
        float tw = 0.62 + 0.38*sin(uTime*seed.y + seed.x)
                        + 0.10*sin(uTime*seed.y*2.7 + seed.x*1.7);
        vA = seed.z * tw;
        vT = tint;
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader:\`
      varying float vA; varying vec3 vT;
      uniform sampler2D uMap; uniform float uFade;
      void main(){
        vec4 t = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(vT * t.rgb, t.a * vA * uFade);
      }\`
  });
  stars = new THREE.Points(g, m);
  stars.frustumCulled = false;
  stars.renderOrder = -5;                   // behind everything, ahead of the haze
  scene.add(stars);
  window.__stars = m;
}

/* --- drifting motes ---------------------------------------------------
   Enough of them to read as air rather than as a scatter of sprites, which
   means the drift has to live in the vertex shader: one uniform write a
   frame however many there are.  They rise slowly, sway, and wrap through a
   band whose edges fade, so the loop never shows.                          */
let motes = null;
{
  const N = (window.innerWidth*window.innerHeight < 640000) ? 1600 : 4200;
  const pos = new Float32Array(N*3), seed = new Float32Array(N*4);
  for(let i=0;i<N;i++){
    const r = 1.0 + Math.pow(rnd(),0.55)*15.0, a = rnd()*6.283;
    pos[i*3]   = Math.cos(a)*r;
    pos[i*3+1] = -7.0 + rnd()*15.0;
    pos[i*3+2] = Math.sin(a)*r;
    seed[i*4]   = rnd()*6.283;                          // phase
    seed[i*4+1] = 0.25 + rnd()*0.95;                    // speed
    seed[i*4+2] = 0.35 + rnd()*1.5;                     // sway
    seed[i*4+3] = 0.55 + 1.15*Math.pow(rnd(), 2.4);     // size
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,4));
  const m = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, depthTest:true, blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0}, uMap:{value:SPRITE}, uPix:{value:1}, uFade:{value:1} },
    vertexShader:\`
      attribute vec4 seed;
      varying float vA;
      uniform float uTime, uPix;
      void main(){
        float ph = seed.x, sp = seed.y, am = seed.z;
        vec3 p = position;
        p.x += sin(uTime*sp*0.33 + ph)*0.42*am;
        p.z += cos(uTime*sp*0.27 + ph*1.3)*0.36*am;
        float band = 15.0;
        float climb = mod(uTime*0.115*sp + ph*2.4, band) - band*0.5;
        p.y += climb;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_PointSize = seed.w * uPix * (26.0 / max(-mv.z, 1.0));
        float edge = 1.0 - abs(climb)/(band*0.5);
        float tw = 0.55 + 0.45*sin(uTime*(0.6 + sp*1.7) + ph*3.1);
        vA = clamp(edge*2.6, 0.0, 1.0) * tw;
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader:\`
      varying float vA;
      uniform sampler2D uMap; uniform float uFade;
      void main(){
        vec4 t = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(t.rgb, t.a * vA * 0.42 * uFade);
      }\`
  });
  motes = new THREE.Points(g, m);
  motes.frustumCulled = false;
  motes.renderOrder = 4;
  scene.add(motes);
  window.__dust = m;
}

/* ?tex=stone|marble|rubble[&ch=map|normal|orm][&zoom=n] shows a baked map
   full-frame, which is the only sane way to judge one.                     */
if(PARAMS.has('tex')){
  const set = {stone:STONE, marble:MARBLE, rubble:RUBBLE}[PARAMS.get('tex')] || STONE;
  const ch  = {map:'map', normal:'normalMap', orm:'ormMap'}[PARAMS.get('ch')||'map'] || 'map';
  const zoom = parseFloat(PARAMS.get('zoom')||'1');
  const t = set[ch].clone(); t.needsUpdate = true;
  t.repeat.set(zoom, zoom); t.encoding = THREE.LinearEncoding;
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2),
    new THREE.ShaderMaterial({ uniforms:{tMap:{value:t}},
      vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.0,1.0);}',
      fragmentShader:\`varying vec2 vUv; uniform sampler2D tMap;
        float invAces(float y){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
          float A=y*c-a, B=y*d-b, C=y*e; if(abs(A)<1e-5) return -C/max(B,1e-5);
          float disc=max(B*B-4.0*A*C,0.0); float x=(-B-sqrt(disc))/(2.0*A);
          if(x<0.0) x=(-B+sqrt(disc))/(2.0*A); return clamp(x,0.0,60.0); }
        void main(){ vec3 c = texture2D(tMap, vUv).rgb;
          // cancel the composer's tone curve so the raw map is what you see
          vec3 l = pow(c, vec3(2.2));
          gl_FragColor = vec4(invAces(l.r), invAces(l.g), invAces(l.b), 1.0); }\` }));
  quad.frustumCulled = false;
  while(scene.children.length) scene.remove(scene.children[0]);
  scene.add(quad);
  document.head.insertAdjacentHTML('beforeend','<style>.stage,.cursor{display:none!important}</style>');
}

/* Loose chips scattered on the walk outside the outer wall — the detail you
   only notice once the eye has followed the thread to the middle.           */
{
  const pr = mulberry32(51423);
  for(let i=0;i<26;i++){
    const g = debrisGeos[i % debrisGeos.length];
    const m = new THREE.Mesh(g, debrisMat);
    const a = pr()*Math.PI*2;
    const rr = 1.295 + Math.pow(pr(),0.7)*0.135;
    const x = Math.cos(a)*rr, z = Math.sin(a)*rr;
    const sc = 0.009 + Math.pow(pr(),2.2)*0.028;
    m.scale.setScalar(sc);
    m.position.set(x, Y_PLINTH - 0.008 + sc*0.35, z);
    m.rotation.set(pr()*6.28, pr()*6.28, pr()*6.28);
    m.castShadow = m.receiveShadow = true;
    plinth.add(m);
  }
}

/* aoMap samples uv2; every geometry here uses the same layout as uv. */
scene.traverse(o=>{
  if(o.isMesh && o.material && o.material.aoMap &&
     o.geometry.attributes.uv && !o.geometry.attributes.uv2){
    o.geometry.setAttribute('uv2', o.geometry.attributes.uv);
  }
});

/* =====================================================================
   10. post processing
   ===================================================================== */
const rtOpts = {minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
                format:THREE.RGBAFormat, type:THREE.HalfFloatType,
                samples: renderer.capabilities.isWebGL2 ? 4 : 0};
const rt = new THREE.WebGLRenderTarget(1,1,rtOpts);
const composer = new THREE.EffectComposer(renderer, rt);
composer.addPass(new THREE.RenderPass(scene,camera));

const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(1,1), 0.16, 1.0, 0.88);
/* UnrealBloomPass allocates 8-bit targets, which quantises the halo into
   visible contour steps against a near-black sky.  Promote them to half float
   before anything renders into them.                                        */
if(renderer.capabilities.isWebGL2){
  const hf = t => { if(t) t.texture.type = THREE.HalfFloatType; };
  hf(bloom.renderTargetBright);
  (bloom.renderTargetsHorizontal||[]).forEach(hf);
  (bloom.renderTargetsVertical||[]).forEach(hf);
}
composer.addPass(bloom);

const FinalShader = {
  uniforms:{
    tDiffuse:{value:null}, uTime:{value:0}, uGrain:{value:0.022},
    uVig:{value:0.35}, uExposure:{value:1.0}, uRes:{value:new THREE.Vector2(1,1)},
    uSharp:{value:0.32}
  },
  vertexShader:\`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform sampler2D tDiffuse;
    uniform float uTime,uGrain,uVig,uExposure,uSharp; uniform vec2 uRes;
    vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    void main(){
      vec2 uv=vUv;
      vec2 d = uv-0.5;
      float r2 = dot(d,d);
      // whisper of lateral chromatic aberration
      float ca = 0.0004*r2;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + d*ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - d*ca).b;
      // unsharp mask: crisps the stone relief without touching the bloom halo
      vec2 px = 1.0/uRes;
      vec3 blur = ( texture2D(tDiffuse, uv+vec2( px.x,0.0)).rgb
                  + texture2D(tDiffuse, uv+vec2(-px.x,0.0)).rgb
                  + texture2D(tDiffuse, uv+vec2(0.0, px.y)).rgb
                  + texture2D(tDiffuse, uv+vec2(0.0,-px.y)).rgb ) * 0.25;
      float lum = dot(col, vec3(0.2126,0.7152,0.0722));
      col += (col-blur) * uSharp * (1.0 - smoothstep(0.55, 1.6, lum));
      col = max(col, vec3(0.0));
      col *= uExposure;
      col = aces(col);
      // vignette
      float v = smoothstep(1.15, 0.16, length(d*vec2(1.0,0.92)));
      col *= mix(1.0, v, uVig);
      // sRGB
      col = pow(col, vec3(1.0/2.2));
      // grain, plus a triangular dither so the near-black gradient cannot band
      float g = hash(gl_FragCoord.xy + fract(uTime)*vec2(37.0,17.0))-0.5;
      col += g*uGrain*(0.35+0.65*smoothstep(0.0,0.35,dot(col,vec3(0.33))));
      float d1 = hash(gl_FragCoord.xy + fract(uTime)*vec2(11.0,71.0));
      float d2 = hash(gl_FragCoord.xy + fract(uTime)*vec2(53.0,29.0));
      col += (d1-d2)*(1.0/255.0);
      gl_FragColor = vec4(col,1.0);
    }\`
};
const finalPass = new THREE.ShaderPass(FinalShader);
finalPass.renderToScreen = true;
composer.addPass(finalPass);

/* =====================================================================
   11. resize
   ===================================================================== */
let W=0,H=0,DPR=1;
function resize(){
  W = canvas.clientWidth || window.innerWidth;
  H = canvas.clientHeight || window.innerHeight;
  DPR = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W,H,false);
  /* EffectComposer captures the renderer's pixel ratio when it is built, and
     it is built before the first resize — so without this the whole scene
     renders at CSS resolution and is upscaled onto a retina canvas.  Every
     pass, bloom included, is sized from this. */
  composer.setPixelRatio(DPR);
  composer.setSize(W,H);
  const aspect = W/H;
  camera.aspect = aspect;
  // Wider than the reference: hold the vertical field.  Narrower: open up to
  // keep the horizontal field — but clamped, because a portrait phone would
  // otherwise ask for ~88 deg and render a fish-eye.
  const fitW = 2*Math.atan(Math.tan(FOV_H/2)/aspect)*180/Math.PI;
  camera.fov = (aspect >= REF_ASPECT) ? REF_FOV_V : Math.min(46, fitW);
  // past the clamp, distance takes over from field of view
  PORTRAIT = aspect < 0.95;
  DIST_SCALE = 1 + Math.max(0, (fitW - 46))/46 * 0.55;
  camera.updateProjectionMatrix();
  
  finalPass.uniforms.uRes.value.set(W,H);
  if(window.__dust)  window.__dust.uniforms.uPix.value  = H/1366;
  if(window.__stars) window.__stars.uniforms.uPix.value = H/1366;
}
window.addEventListener('resize', resize);
resize();

/* =====================================================================
   12. pointer
   ===================================================================== */
const pointer = {x:0, y:0, tx:0, ty:0, has:false};
const cursorEl = document.getElementById('cursor');
let cx=0, cy=0;
/* ?cursor=x,y parks the drive at a fixed pointer position, in the same
   -1..1 the events use, which makes a camera pose reproducible from a URL. */
if(PARAMS.has('cursor')){
  const [a,b] = PARAMS.get('cursor').split(',').map(Number);
  pointer.tx = pointer.x = Number.isFinite(a) ? Math.max(-1, Math.min(1, a)) : 0;
  pointer.ty = pointer.y = Number.isFinite(b) ? Math.max(-1, Math.min(1, b)) : 0;
  pointer.has = true;
}
window.addEventListener('pointermove', e=>{
  pointer.tx = (e.clientX/W)*2-1;
  pointer.ty = -((e.clientY/H)*2-1);
  pointer.has = true;
  cursorEl.style.opacity = 1;
  cursorEl.dataset.x = e.clientX; cursorEl.dataset.y = e.clientY;
});
window.addEventListener('pointerleave', ()=>{cursorEl.style.opacity=0;});


/* =====================================================================
   14. the page: dock, parallax, entrance
   ===================================================================== */
/* --- card plates ------------------------------------------------------
   The two cards show the scene's own stone: the baked albedo read straight
   out of its DataTexture, cropped and graded on a 2d canvas.  No external
   image, and the paper card and the plinth are made of the same rock.     */
function paintPlate(canvas, set, opt){
  const o = Object.assign({sx:0.12, sy:0.10, zoom:0.42, warm:1.0, lift:0.0}, opt||{});
  const src = set.map.image;                       // {data, width, height}
  const S0 = src.width;
  const cw = canvas.width, ch = canvas.height;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(cw, ch);
  const d = img.data, sd = src.data;
  const spanX = o.zoom, spanY = o.zoom * (ch/cw) * 1.0;
  for(let y=0;y<ch;y++){
    for(let x=0;x<cw;x++){
      const u = (o.sx + (x/cw)*spanX) % 1;
      const v = (o.sy + (y/ch)*spanY) % 1;
      const si = ((Math.floor(v*S0)*S0) + Math.floor(u*S0))*4;
      const i = (y*cw+x)*4;
      // a slow vignette and a warm grade, so the plate reads as a photograph
      const dx = (x/cw-0.5), dy = (y/ch-0.5);
      const vig = 1 - Math.min(1, (dx*dx*1.5 + dy*dy*1.9))*0.85;
      d[i]   = Math.min(255, (sd[si]  *o.warm + o.lift) * vig);
      d[i+1] = Math.min(255, (sd[si+1]*1.0   + o.lift) * vig);
      d[i+2] = Math.min(255, (sd[si+2]*0.96  + o.lift) * vig);
      d[i+3] = 255;
    }
  }
  ctx.putImageData(img,0,0);
}
document.querySelectorAll('canvas[data-plate]').forEach(c=>{
  const kind = c.getAttribute('data-plate');
  try{
    if(kind === 'marble') paintPlate(c, MARBLE, {sx:0.42, sy:0.28, zoom:0.86, warm:1.02, lift:4});
    else                  paintPlate(c, STONE,  {sx:0.10, sy:0.16, zoom:0.92, warm:1.12, lift:6});
  }catch(e){}
});

/* --- pointer: parallax, dock magnification, specular rim -------------- */
const stageEl = document.getElementById('stage');
const dockEl  = document.querySelector('.dock');
const dockItems = [...document.querySelectorAll('[data-dock]')];
const specEls = [...document.querySelectorAll('[data-spec]')];
const parEls  = [...document.querySelectorAll('.par, .mask, .fade, .headline, .stat, .card, .cta, .lede, .eyebrow, .colophon, .scroll')]
  .filter(el => el.style.getPropertyValue('--pd'));
parEls.forEach(el => el.classList.add('par'));

const ptr = {x:0.5, y:0.5, ex:0.5, ey:0.5, inside:false};
addEventListener('pointermove', e => {
  ptr.x = e.clientX / innerWidth; ptr.y = e.clientY / innerHeight; ptr.inside = true;
  dockNear(e.clientX, e.clientY);
  specUpdate(e.clientX, e.clientY);
}, {passive:true});
addEventListener('pointerleave', () => { ptr.inside = false; dockNear(-1e5,-1e5); });

/* pills magnify with distance, the way a dock does */
function dockNear(mx, my){
  const U = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u')) || 1;
  const R = 150*U;
  dockItems.forEach(it => {
    const r = it.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const d = Math.hypot(mx-cx, my-cy);
    const f = Math.max(0, 1 - d/R);
    const k = f*f;
    it.style.transform = \`translateY(\${k*3*U}px) scale(\${1 + k*0.16})\`;
    it.dataset.near = k > 0.22 ? 'true' : 'false';
  });
}
/* the rim highlight points at the pointer and fades with distance */
function specUpdate(mx, my){
  specEls.forEach(el => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const ang = Math.atan2(my-cy, mx-cx);
    const d = Math.hypot(mx-cx, my-cy);
    const reach = Math.max(r.width, r.height) * 1.9;
    el.style.setProperty('--spec-angle', (ang + Math.PI/2).toFixed(3)+'rad');
    el.style.setProperty('--spec-bright', Math.max(0, 1 - d/reach).toFixed(3));
  });
}

/* --- entrance ---------------------------------------------------------- */
function reveal(){
  if(document.body.classList.contains('is-ready')) return;
  document.body.classList.add('is-ready');
  setTimeout(()=>document.body.classList.add('intro-done'), 2600);
}

/* =====================================================================
   13. animate
   ===================================================================== */
const clock = new THREE.Clock();
let t = 0;
const camTarget = new THREE.Vector3(0, Y_TARGET, 0);
const _v = new THREE.Vector3();
const _proj = new THREE.Vector3();

function frame(time){
  const dt = Math.min(clock.getDelta(), 0.05);
  t = FROZEN!==null ? FROZEN : t+dt;

  // --- camera: a steady orbit the pointer steers -------------------------
  /* The reference slid the eye a few centimetres sideways with the pointer.
     Here the pointer turns the camera about the aim point instead, so push
     it to an edge and the scene turns to meet you.

     The travel is clamped by construction rather than by a guard: the
     pointer only ever runs -1..1, and it is only ever multiplied by the
     ranges below.  22 degrees of yaw either way, 20 up and 12 down.
     The two are not equal on purpose: this subject is a plan, and the
     lower the eye drops the more of the maze its own kerbs hide, so the
     drive is given its room overhead instead.

     Recentre and the eye returns to exactly where the authored orbit put
     it: the resting elevation and slant range are derived from Y_CAM
     rather than replacing it, so the composition at rest is unchanged.   */
  const YAW_RANGE  = 22*Math.PI/180;
  const PITCH_UP   = 20*Math.PI/180;
  const PITCH_DOWN = 12*Math.PI/180;
  // wide viewports crowd the footer, portrait ones need the subject lifted
  // clear of the copy column, so both aim below the target
  const aimDrop = Math.max(0, (W/H)/REF_ASPECT - 1) * 1.45
                + (PORTRAIT ? 1.55 * DIST_SCALE : 0);
  const aimY  = camTarget.y - aimDrop;
  const eyeY  = ELEV_OVERRIDE!==null ? ELEV_OVERRIDE : Y_CAM;
  const dist  = D_CAM * DIST_SCALE;
  const rest  = Math.atan2(eyeY - aimY, dist);      // resting elevation
  const range = Math.hypot(dist, eyeY - aimY);      // slant range, held constant
  const az    = -ORBIT_RATE*t + 0.144 + pointer.x*YAW_RANGE;
  const el    = rest + pointer.y*(pointer.y > 0 ? PITCH_UP : PITCH_DOWN);
  camera.position.set(
    Math.sin(az)*range*Math.cos(el),
    aimY + Math.sin(el)*range,
    Math.cos(az)*range*Math.cos(el)
  );
  // roll the up vector with the orbit, otherwise the scene's tilt would swing
  // from -9.7 deg to +9.7 deg over a revolution instead of holding steady
  camera.up.set(Math.sin(ROLL)*Math.cos(az), Math.cos(ROLL), -Math.sin(ROLL)*Math.sin(az));
  camera.lookAt(camTarget.x, aimY, camTarget.z);

  // a little quicker than the reference: the pointer is steering the camera
  // now, and a half-second lag on a camera reads as drag rather than weight
  pointer.x += (pointer.tx-pointer.x)*Math.min(1,dt*3.4);
  pointer.y += (pointer.ty-pointer.y)*Math.min(1,dt*3.4);

  // --- rings ------------------------------------------------------------
  ringTop.rotation.y = 0.020*t;
  ringLow.rotation.y = -0.026*t;
  haloRings.forEach(g=>{ g.rotation.y = g.userData.baseY===undefined
      ? (g.userData.baseY = g.rotation.y) + g.userData.spin*t
      : g.userData.baseY + g.userData.spin*t; });
  [ringTop, ringLow, ...haloRings].forEach(g=>{
    g.children.forEach(m => m.material.uniforms.uCam.value.copy(camera.position));
  });

  // --- debris -----------------------------------------------------------
  const cursorNDC = new THREE.Vector2(pointer.x, pointer.y);
  for(let i=0;i<debris.length;i++){
    const m = debris[i], u = m.userData;
    const a = u.a + u.w*t;
    const y = u.y + u.drift*t;
    _v.set(Math.cos(a)*u.r, y, Math.sin(a)*u.r);

    // cursor repulsion in screen space
    if(pointer.has){
      _proj.copy(_v).project(camera);
      const dx = _proj.x - cursorNDC.x, dy = _proj.y - cursorNDC.y;
      const d = Math.hypot(dx, dy*0.72);
      const R = 0.17;
      if(d < R && _proj.z < 1){
        const f = (1-d/R);
        const push = f*f*0.17;                  // a light shove, not a launch
        u.push.x += ((dx/(d+1e-4))*push - u.push.x)*0.06;
        u.push.y += ((dy/(d+1e-4))*push - u.push.y)*0.06;
      }
    }
    u.push.multiplyScalar(0.975);          // and it drifts back slowly
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
    const up    = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
    _v.addScaledVector(right, u.push.x*2.0).addScaledVector(up, u.push.y*2.0);

    m.position.copy(_v);
    m.rotation.set(u.rot.x + u.spin.x*t, u.rot.y + u.spin.y*t, u.rot.z + u.spin.z*t);
  }

  // the rock itself turns slowly the other way, so the orbit reads as motion
  // rather than a camera pan.  No bobbing, no wobble.
  plinth.rotation.y  = ROCK_RATE*t;
  labyrinth.rotation.y = LAB_YAW + ROCK_RATE*t;
  flameMat.uniforms.uTime.value = t;
  pathMat.uniforms.uTime.value  = t;
  flameLight.intensity = FLAME_I*(0.9 + 0.1*Math.sin(t*7.3) + 0.05*Math.sin(t*17.7+1.3));

  if(window.__dust)  window.__dust.uniforms.uTime.value  = t;
  if(window.__stars) window.__stars.uniforms.uTime.value = t;
  finalPass.uniforms.uTime.value = FROZEN!==null ? 0.37 : time*0.001;

  // cursor ring follow
  // stage parallax, eased
  ptr.ex += ((ptr.inside? ptr.x : 0.5) - ptr.ex)*Math.min(1, dt*3.0);
  ptr.ey += ((ptr.inside? ptr.y : 0.5) - ptr.ey)*Math.min(1, dt*3.0);
  if(stageEl){
    stageEl.style.setProperty('--px', ((ptr.ex-0.5)*2).toFixed(4));
    stageEl.style.setProperty('--py', ((ptr.ey-0.5)*2).toFixed(4));
  }

  if(cursorEl.dataset.x!==undefined){
    const tx = +cursorEl.dataset.x, ty = +cursorEl.dataset.y;
    cx += (tx-cx)*(FROZEN!==null?1:Math.min(1,dt*7.5));
    cy += (ty-cy)*(FROZEN!==null?1:Math.min(1,dt*7.5));
    cursorEl.style.transform = \`translate(\${cx}px, \${cy}px)\`;
  }

  composer.render();
  if(!window.__ready){ window.__ready = true; window.__t0 = performance.now(); reveal(); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* =====================================================================
   15. type panel  —  press T, or the Aa button, to tune the typography
   ===================================================================== */
/* Everything typographic on the page reads from custom properties, so this
   panel only has to write those.  Faces are pulled on demand with the
   FontFace API rather than a <link>: a stylesheet link from a file:// page
   can hang, and this way nothing is fetched until it is actually chosen.  */
(function typePanel(){
  const FACES = {
    display: [
      ['Instrument Serif', "'Instrument Serif',serif", true],
      ['Playfair Display', "'Playfair Display',serif"],
      ['Fraunces',         "'Fraunces',serif"],
      ['Newsreader',       "'Newsreader',serif"],
      ['Bodoni Moda',      "'Bodoni Moda',serif"],
      ['DM Serif Display', "'DM Serif Display',serif"],
      ['Cormorant Garamond',"'Cormorant Garamond',serif"],
      ['Space Grotesk',    "'Space Grotesk',sans-serif"],
      ['Inter Tight',      "'Inter Tight',sans-serif"]
    ],
    ui: [
      ['System',          'var(--sans)', true],
      ['Inter',           "'Inter',sans-serif"],
      ['Instrument Sans', "'Instrument Sans',sans-serif"],
      ['Geist',           "'Geist',sans-serif"],
      ['Space Grotesk',   "'Space Grotesk',sans-serif"],
      ['Figtree',         "'Figtree',sans-serif"]
    ]
  };
  const loaded = new Set(['Instrument Serif']);
  async function ensureFace(name){
    if(loaded.has(name) || name === 'System') return;
    loaded.add(name);
    try{
      const css = await (await fetch(
        \`https://fonts.googleapis.com/css2?family=\${encodeURIComponent(name)}:wght@300;400;500;600&display=swap\`
      )).text();
      const blocks = css.split('@font-face').slice(1);
      for(const b of blocks){
        if(!/U\\+0000-00FF/.test(b)) continue;                 // latin only
        const url = (b.match(/url\\((https:[^)]+)\\)/)||[])[1];
        const wt  = (b.match(/font-weight:\\s*([\\d ]+)/)||[])[1] || '400';
        if(!url) continue;
        const ff = new FontFace(name, \`url(\${url})\`, {weight: wt.trim().replace(/\\s+/g,' ')});
        await ff.load(); document.fonts.add(ff);
      }
    }catch(e){ /* offline: the fallback stack still applies */ }
  }

  const DEFAULTS = {
    display:'Instrument Serif', ui:'System',
    h1:92, 'h1-lh':87, 'h1-track':0.035, 'h1-weight':400,
    lede:21.5, 'lede-lh':30, 'ui-weight':300,
    label:13.5, 'label-track':2.8, 'card-title':38
  };
  const state = Object.assign({}, DEFAULTS, (()=>{
    try{ return JSON.parse(localStorage.getItem('orrery.type')||'{}'); }catch(e){ return {}; }
  })());

  const root = document.documentElement;
  function apply(){
    const dv = (FACES.display.find(f=>f[0]===state.display)||FACES.display[0])[1];
    const uv = (FACES.ui.find(f=>f[0]===state.ui)||FACES.ui[0])[1];
    root.style.setProperty('--display', dv);
    root.style.setProperty('--ui', uv);
    ['h1','h1-lh','h1-track','h1-weight','lede','lede-lh','ui-weight','label','label-track','card-title']
      .forEach(k => root.style.setProperty('--'+k, state[k]));
    try{ localStorage.setItem('orrery.type', JSON.stringify(state)); }catch(e){}
  }
  ensureFace(state.display); ensureFace(state.ui); apply();

  /* ---- panel chrome ---------------------------------------------------- */
  const css = \`
  .tp-btn{position:fixed;right:18px;bottom:18px;z-index:20;width:38px;height:38px;border-radius:11px;
    border:1px solid rgba(255,255,255,.16);background:rgba(18,16,14,.72);color:rgba(255,255,255,.7);
    font:500 14px/1 ui-sans-serif,system-ui;cursor:pointer;display:grid;place-items:center;
    transition:color .2s,border-color .2s,background .2s}
  .tp-btn:hover{color:#fff;border-color:rgba(255,255,255,.34);background:rgba(28,25,21,.9)}
  .tp{position:fixed;right:18px;bottom:66px;z-index:20;width:min(286px,calc(100vw - 36px));
    max-height:min(76vh,720px);overflow-y:auto;overscroll-behavior:contain;padding:14px 16px 16px;
    border-radius:16px;border:1px solid rgba(255,255,255,.13);
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,0) 40%),rgba(16,14,12,.94);
    box-shadow:0 18px 50px rgba(0,0,0,.6);
    font:400 11px/1.4 ui-sans-serif,system-ui;color:rgba(255,255,255,.72);
    display:none}
  .tp.is-open{display:block}
  .tp h4{font:600 10px/1 ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;
    color:rgba(255,255,255,.4);margin:0 0 11px}
  .tp label{display:block;margin:0 0 9px}
  .tp .row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px}
  .tp .row b{font-weight:500;color:rgba(255,255,255,.62)}
  .tp .row i{font-style:normal;color:rgba(255,255,255,.42);font-variant-numeric:tabular-nums}
  .tp select,.tp input[type=range]{width:100%}
  .tp select{appearance:none;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.14);
    border-radius:8px;padding:6px 8px;font:400 11px/1 ui-sans-serif,system-ui}
  .tp input[type=range]{accent-color:#ffbf7a;height:16px;background:transparent}
  .tp .btns{display:flex;gap:8px;margin-top:12px}
  .tp button{flex:1;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);
    border-radius:9px;padding:7px 8px;font:500 10.5px/1 ui-sans-serif,system-ui;letter-spacing:.06em;
    text-transform:uppercase;cursor:pointer}
  .tp button:hover{background:rgba(255,255,255,.12);color:#fff}
  .tp .hint{margin-top:9px;color:rgba(255,255,255,.32);font-size:10px}
  @media (max-width:520px){ .tp{right:12px;left:12px;width:auto;bottom:60px} .tp-btn{right:12px;bottom:12px} }\`;
  document.head.insertAdjacentHTML('beforeend', \`<style>\${css}</style>\`);

  const sliders = [
    ['h1',        'Display size',  40, 190, 0.5],
    ['h1-lh',     'Display leading',36, 190, 0.5],
    ['h1-track',  'Display tracking',-0.06, 0.16, 0.001],
    ['h1-weight', 'Display weight', 300, 700, 100],
    ['card-title','Card title',     20, 64, 0.5],
    ['lede',      'Lede size',      13, 34, 0.25],
    ['lede-lh',   'Lede leading',   16, 52, 0.25],
    ['ui-weight', 'UI weight',      200, 600, 100],
    ['label',     'Label size',     9, 22, 0.25],
    ['label-track','Label tracking',0, 8, 0.1]
  ];
  const opts = (list, cur) => list.map(f =>
    \`<option value="\${f[0]}"\${f[0]===cur?' selected':''}>\${f[0]}</option>\`).join('');
  const panel = document.createElement('div');
  panel.className = 'tp';
  panel.innerHTML = \`
    <h4>Typography</h4>
    <label><span class="row"><b>Display face</b></span>
      <select data-face="display">\${opts(FACES.display, state.display)}</select></label>
    <label><span class="row"><b>UI face</b></span>
      <select data-face="ui">\${opts(FACES.ui, state.ui)}</select></label>
    \${sliders.map(([k,l,mn,mx,st])=>\`
      <label><span class="row"><b>\${l}</b><i data-out="\${k}">\${state[k]}</i></span>
      <input type="range" data-key="\${k}" min="\${mn}" max="\${mx}" step="\${st}" value="\${state[k]}"></label>\`).join('')}
    <div class="btns"><button data-act="reset">Reset</button><button data-act="copy">Copy CSS</button></div>
    <p class="hint">Press T to hide. Choices are remembered.</p>\`;
  const btn = document.createElement('button');
  btn.className = 'tp-btn'; btn.type = 'button';
  btn.setAttribute('aria-label','Typography options'); btn.textContent = 'Aa';
  document.body.append(panel, btn);

  const toggle = () => panel.classList.toggle('is-open');
  btn.addEventListener('click', toggle);
  addEventListener('keydown', e => {
    if(e.key === 't' || e.key === 'T'){
      const tag = (e.target.tagName||'').toLowerCase();
      if(tag !== 'input' && tag !== 'select' && tag !== 'textarea') toggle();
    }
  });
  panel.addEventListener('input', e => {
    const el = e.target;
    if(el.dataset.key){
      state[el.dataset.key] = parseFloat(el.value);
      panel.querySelector(\`[data-out="\${el.dataset.key}"]\`).textContent = el.value;
      apply();
    }
  });
  panel.addEventListener('change', async e => {
    const el = e.target;
    if(el.dataset.face){
      state[el.dataset.face] = el.value;
      await ensureFace(el.value);
      apply();
    }
  });
  panel.addEventListener('click', e => {
    const act = e.target.dataset && e.target.dataset.act;
    if(act === 'reset'){
      Object.assign(state, DEFAULTS); apply();
      panel.querySelectorAll('[data-key]').forEach(i=>{
        i.value = state[i.dataset.key];
        panel.querySelector(\`[data-out="\${i.dataset.key}"]\`).textContent = i.value;
      });
      panel.querySelectorAll('[data-face]').forEach(sl => sl.value = state[sl.dataset.face]);
    }
    if(act === 'copy'){
      const dv = (FACES.display.find(f=>f[0]===state.display)||FACES.display[0])[1];
      const uv = (FACES.ui.find(f=>f[0]===state.ui)||FACES.ui[0])[1];
      const out = \`:root{\\n  --display: \${dv};\\n  --ui: \${uv};\\n\` +
        ['h1','h1-lh','h1-track','h1-weight','lede','lede-lh','ui-weight','label','label-track','card-title']
          .map(k=>\`  --\${k}: \${state[k]};\`).join('\\n') + '\\n}';
      navigator.clipboard && navigator.clipboard.writeText(out);
      e.target.textContent = 'Copied';
      setTimeout(()=>{ e.target.textContent = 'Copy CSS'; }, 1200);
    }
  });

  /* ?type=hide keeps the button out of screenshots */
  if(PARAMS.get('type') === 'hide'){ btn.style.display='none'; }
  window.__type = { state, apply };
})();

// expose for measuring harnesses
window.__scene = {scene, camera, renderer, composer, bloom, finalPass, bgMat, ringTop, ringLow, labyrinth, plinth, debris};
window.__render = (time)=>{ t=time; frame(0); };
window.__probe = function(){
  const w=renderer.domElement.clientWidth, h=renderer.domElement.clientHeight;
  const toScreen = (v)=>{ const p=v.clone().project(camera); return [ (p.x*0.5+0.5)*w, (0.5-p.y*0.5)*h ]; };
  function ringExtremes(radius, y){
    let minx=[1e9,0], maxx=[-1e9,0], miny=[0,1e9], maxy=[0,-1e9];
    for(let i=0;i<1440;i++){
      const a=i/1440*Math.PI*2;
      const s=toScreen(new THREE.Vector3(Math.cos(a)*radius, y, Math.sin(a)*radius));
      if(s[0]<minx[0]) minx=s;
      if(s[0]>maxx[0]) maxx=s;
      if(s[1]<miny[1]) miny=s;
      if(s[1]>maxy[1]) maxy=s;
    }
    const cx=(minx[0]+maxx[0])/2, cy=(minx[1]+maxx[1])/2;
    const A=Math.hypot(maxx[0]-minx[0], maxx[1]-minx[1])/2;
    const ang=Math.atan2(maxx[1]-minx[1], maxx[0]-minx[0])*180/Math.PI;
    // semi-minor from the vertical extremes measured perpendicular to the major axis
    const nx=-Math.sin(ang*Math.PI/180), ny=Math.cos(ang*Math.PI/180);
    const B=(Math.abs((miny[0]-cx)*nx+(miny[1]-cy)*ny)+Math.abs((maxy[0]-cx)*nx+(maxy[1]-cy)*ny))/2;
    return {left:minx, right:maxx, top:miny, bottom:maxy, cx, cy, a:A, b:B, ang};
  }
  const bbox = (obj)=>{
    const box=new THREE.Box3().setFromObject(obj);
    const pts=[]; const mn=box.min, mx=box.max;
    for(const X of [mn.x,mx.x]) for(const Y of [mn.y,mx.y]) for(const Z of [mn.z,mx.z]) pts.push(toScreen(new THREE.Vector3(X,Y,Z)));
    const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
    return {x0:Math.min(...xs), x1:Math.max(...xs), y0:Math.min(...ys), y1:Math.max(...ys)};
  };
  return JSON.stringify({
    t, w, h, fov:camera.fov,
    cam:[+camera.position.x.toFixed(3),+camera.position.y.toFixed(3),+camera.position.z.toFixed(3)],
    ringTop:ringExtremes(R_RING_TOP, Y_RING_TOP),
    ringLow:ringExtremes(R_RING_LOW, Y_RING_LOW),
    plinth:bbox(plinth), labyrinth:bbox(labyrinth),
    plinthTop:[0,0.25,0.5,0.75].map(u=>toScreen(new THREE.Vector3(Math.cos(u*6.2832)*1.46,Y_PLINTH,Math.sin(u*6.2832)*1.46))),
    axis:[toScreen(new THREE.Vector3(0,Y_RING_LOW,0)), toScreen(new THREE.Vector3(0,Y_RING_TOP,0))]
  });
};
})();
<\/script>
</body>
</html>
`,c=`<!doctype html>
<html lang="en" class="js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Orrery — Rebuilt Often, Changed Rarely</title>
<style>
  /* ---------- type ---------- */
  @font-face{
    font-family:'Instrument Serif';
    font-style:normal;font-weight:400;font-display:swap;
    src:url(https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjnTLgNs.woff2) format('woff2');
    unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD;
  }

  /* ---------- design unit: 1u === 1px on the 1920 x 1366 stage ---------- */
  :root{
    --u: min(calc(100vw / 1920), calc(100vh / 1366), 1.16px);
    --sans:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    --serif:'Instrument Serif',"Times New Roman",serif;

    /* type scale — every rule below reads from these, so the whole page can
       be re-proportioned from the panel (press T) or from one edit here     */
    --display:  var(--serif);
    --ui:       var(--sans);
    --h1:       92;      /* u */
    --h1-lh:    87;      /* u */
    --h1-track: .035;    /* em */
    --h1-weight:400;
    --lede:     21.5;    /* u */
    --lede-lh:  30;      /* u */
    --ui-weight:300;
    --label:    13.5;    /* u */
    --label-track: 2.8;  /* u */
    --card-title: 38;    /* u */

    --ink:        #ffffff;
    --ink-soft:   rgba(255,255,255,.60);
    --ink-faint:  rgba(255,255,255,.40);
    --rule:       rgba(255,255,255,.075);

    --card:       #eeeae2;
    --card-ink:   #1b1916;
    --card-label: #8b857a;

    --ease:     cubic-bezier(.22,.61,.36,1);
    --ease-out: cubic-bezier(.16,1,.3,1);
  }

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:#040404;color:var(--ink);
    font-family:var(--ui);font-weight:var(--ui-weight);
    overflow:hidden;
    -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  }
  canvas#gl{position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:3}

  /* Everything sits on a centred stage so the composition holds its
     proportions instead of drifting apart with the viewport.              */
  .stage{
    position:fixed;left:50%;top:50%;
    margin-left:calc(-960 * var(--u));margin-top:calc(-683 * var(--u));
    width:calc(1920 * var(--u));height:calc(1366 * var(--u));
    z-index:5;pointer-events:none;
  }
  .stage a,.stage button{pointer-events:auto}

  /* ---------- column guides + ghost wordmark (z 1, behind the scene) ---- */
  .backdrop{position:fixed;inset:0;z-index:4;pointer-events:none;overflow:hidden}
  .guides{position:absolute;left:50%;top:0;bottom:0;width:calc(1920 * var(--u));margin-left:calc(-960 * var(--u))}
  .guides i{
    position:absolute;top:0;bottom:0;width:1px;
    background:linear-gradient(180deg,rgba(255,255,255,0) 0%,var(--rule) 14%,var(--rule) 76%,rgba(255,255,255,0) 100%);
  }
  .ghost{
    position:absolute;left:calc(50% - 960 * var(--u));bottom:calc(-96 * var(--u));
    font-family:var(--display);font-size:calc(430 * var(--u));line-height:.78;
    letter-spacing:calc(44 * var(--u));
    color:rgba(255,255,255,.030);
    white-space:nowrap;user-select:none;
  }

  /* ---------- dock ------------------------------------------------------
     A capsule of pills that magnify as the pointer nears them, over a rim
     highlight that tracks where the pointer is.  No backdrop-filter: it sits
     over a canvas that repaints every frame, so the backdrop would have to be
     re-sampled and re-blurred every frame with it.                         */
  .dock-wrap{
    position:absolute;z-index:6;top:calc(40 * var(--u));left:0;right:0;
    display:flex;justify-content:center;pointer-events:none;
  }
  .dock{
    position:relative;pointer-events:auto;isolation:isolate;
    display:flex;align-items:flex-start;gap:calc(4 * var(--u));
    height:calc(58 * var(--u));padding:calc(6 * var(--u));
    border-radius:calc(17 * var(--u));
    border:1px solid rgba(255,255,255,.10);
    background:
      linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,0) 42%),
      rgba(20,18,16,.72);
    box-shadow:0 calc(10 * var(--u)) calc(28 * var(--u)) rgba(0,0,0,.42),
               inset 0 1px rgba(255,255,255,.06);
  }
  .dock-item{
    position:relative;z-index:6;
    display:inline-flex;align-items:center;justify-content:center;flex:none;
    height:calc(46 * var(--u));gap:calc(9 * var(--u));padding:0 calc(16 * var(--u));
    transform-origin:50% 0;
    border:1px solid transparent;border-radius:calc(12 * var(--u));
    background:rgba(255,255,255,.038);
    color:var(--ink-faint);text-decoration:none;cursor:pointer;
    font-family:inherit;font-size:calc(13 * var(--u));font-weight:500;
    letter-spacing:calc(1.8 * var(--u));text-transform:uppercase;white-space:nowrap;
    will-change:width,height,transform;
    transition:color .18s var(--ease),border-color .2s var(--ease),background .2s var(--ease);
  }
  .dock-item[data-near="true"]{
    z-index:7;color:var(--ink);
    border-color:rgba(255,255,255,.18);
    background:rgba(26,23,20,.94);
    box-shadow:0 calc(8 * var(--u)) calc(18 * var(--u)) rgba(0,0,0,.38);
  }
  .dock-item .glyph{width:calc(16 * var(--u));height:calc(16 * var(--u));flex:none;opacity:.62;transition:opacity .18s var(--ease)}
  .dock-item .glyph svg{display:block;width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}
  .dock-item[data-near="true"] .glyph{opacity:1}
  .dock-mark{
    width:calc(46 * var(--u));padding:0;overflow:hidden;
    background:var(--card);border-color:var(--card);color:#1b1916;
    display:grid;place-items:center;
  }
  .dock-mark svg{width:calc(26 * var(--u));height:calc(26 * var(--u));display:block}
  .dock-mark[data-near="true"]{background:#fff;border-color:#fff}
  .dock-item.is-active{background:var(--card);border-color:var(--card);color:var(--card-ink)}
  .dock-item.is-active .glyph{opacity:.75}
  .dock-item--enter{color:var(--ink);background:rgba(255,255,255,.075)}

  /* specular rim: a conic gradient masked to the border, pointed at the
     cursor — it is what makes the glass read as a lit edge                 */
  [data-spec]{--spec-angle:2.4rad;--spec-bright:0}
  [data-spec]::after{
    content:'';position:absolute;inset:-1px;z-index:5;
    padding:1px;border-radius:inherit;pointer-events:none;
    opacity:var(--spec-bright);
    background:conic-gradient(from var(--spec-angle) at 50% 50%,
      rgba(255,238,214,0) 0deg,rgba(255,238,214,.08) 14deg,rgba(255,238,214,.95) 28deg,
      rgba(255,238,214,.16) 46deg,rgba(255,238,214,0) 68deg,rgba(255,238,214,0) 180deg,
      rgba(255,238,214,.08) 194deg,rgba(255,238,214,.95) 208deg,rgba(255,238,214,.16) 226deg,
      rgba(255,238,214,0) 248deg,rgba(255,238,214,0) 360deg);
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
            mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;
  }

  /* ---------- left column ---------------------------------------------- */
  .eyebrow{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(452 * var(--u));
    font-size:calc(var(--label) * var(--u));font-weight:500;letter-spacing:calc(var(--label-track) * var(--u));
    text-transform:uppercase;color:var(--ink-faint);
  }
  .headline{
    position:absolute;z-index:5;left:calc(92 * var(--u));top:calc(486 * var(--u));
    font-family:var(--display);font-weight:var(--h1-weight);
    font-size:calc(var(--h1) * var(--u));line-height:calc(var(--h1-lh) * var(--u));
    letter-spacing:calc(var(--h1-track) * 1em);
    text-shadow:0 calc(2 * var(--u)) calc(30 * var(--u)) rgba(0,0,0,.55);
  }
  .headline span{display:block}
  .lede{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(700 * var(--u));
    width:calc(408 * var(--u));
    font-size:calc(var(--lede) * var(--u));line-height:calc(var(--lede-lh) * var(--u));
    font-weight:var(--ui-weight);color:var(--ink-soft);
  }
  .cta{
    position:absolute;z-index:5;left:calc(96 * var(--u));top:calc(812 * var(--u));
    width:calc(408 * var(--u));
    display:flex;align-items:flex-end;justify-content:space-between;
    padding-bottom:calc(15 * var(--u));
    border-bottom:1px solid rgba(255,255,255,.55);
    color:var(--ink);text-decoration:none;
  }
  .cta span{font-size:calc(19 * var(--u));line-height:1;font-weight:400;letter-spacing:calc(.1 * var(--u))}
  .cta svg{width:calc(30 * var(--u));height:calc(11 * var(--u));display:block;margin-bottom:calc(2 * var(--u))}
  .cta .arw{transition:transform .5s var(--ease-out)}
  .cta:hover .arw{transform:translateX(calc(7 * var(--u)))}

  /* ---------- stats ----------------------------------------------------- */
  .stat{position:absolute;z-index:5;display:flex;align-items:flex-start;gap:calc(11 * var(--u))}
  .stat--a{left:calc(98 * var(--u));top:calc(946 * var(--u))}
  .stat--b{left:calc(300 * var(--u));top:calc(1052 * var(--u))}
  .stat .mark{width:calc(34 * var(--u));height:calc(34 * var(--u));flex:none;margin-top:calc(2 * var(--u));color:rgba(255,255,255,.32)}
  .stat .mark svg{width:100%;height:100%;display:block;filter:drop-shadow(0 calc(2 * var(--u)) calc(10 * var(--u)) rgba(0,0,0,.6))}
  .stat dt,.stat dd{text-shadow:0 calc(2 * var(--u)) calc(16 * var(--u)) rgba(0,0,0,.6)}
  .stat dt{font-size:calc(15 * var(--u));line-height:calc(21 * var(--u));font-weight:300;color:var(--ink-soft)}
  .stat dd{font-size:calc(15 * var(--u));line-height:calc(23 * var(--u));font-weight:600;color:var(--ink)}

  /* ---------- cards ------------------------------------------------------
     No z-index on the first card on purpose: z-index auto keeps it out of its
     own stacking context, so it paints under the canvas and the debris drift
     across its shoulder, while the second card sits in front.              */
  .card{
    position:absolute;
    background:var(--card);border-radius:calc(52 * var(--u));
    box-shadow:0 calc(34 * var(--u)) calc(80 * var(--u)) rgba(0,0,0,.42);
    --mr:calc(52 * var(--u));
  }
  .card--note{left:calc(1062 * var(--u));top:calc(462 * var(--u));width:calc(392 * var(--u));height:calc(404 * var(--u))}
  .card--work{z-index:5;left:calc(1452 * var(--u));top:calc(796 * var(--u));width:calc(392 * var(--u));height:calc(404 * var(--u))}
  .card .label{
    position:absolute;left:calc(42 * var(--u));
    font-size:calc(15.5 * var(--u));font-weight:400;letter-spacing:calc(.6 * var(--u));color:var(--card-label);
  }
  .card h2{
    position:absolute;left:calc(42 * var(--u));right:calc(42 * var(--u));
    font-family:var(--display);font-weight:var(--h1-weight);
    font-size:calc(var(--card-title) * var(--u));line-height:calc(var(--card-title) * var(--u));
    letter-spacing:calc(.2 * var(--u));
    color:var(--card-ink);
  }
  .card--note .label{top:calc(212 * var(--u))}
  .card--note h2{top:calc(240 * var(--u))}
  .card--work .label{top:calc(52 * var(--u))}
  .card--work h2{top:calc(80 * var(--u))}
  .card figure{
    position:absolute;left:calc(16 * var(--u));right:calc(16 * var(--u));
    border-radius:calc(40 * var(--u));overflow:hidden;isolation:isolate;background:#201e1b;
  }
  .card--note figure{top:calc(16 * var(--u));height:calc(176 * var(--u))}
  .card--work figure{bottom:calc(16 * var(--u));height:calc(212 * var(--u))}
  /* the plate is its own depth plane, so it reads as a window rather than a
     picture glued to the paper */
  .card figure canvas{
    position:absolute;inset:calc(-10 * var(--u));width:calc(100% + 20 * var(--u));height:calc(100% + 20 * var(--u));
    display:block;object-fit:cover;
    transform:translate3d(calc(var(--px,0) * -9px),calc(var(--py,0) * -6px),0) scale(1.02);
    transition:transform .9s var(--ease);
  }
  .card figure::after{
    content:'';position:absolute;inset:0;z-index:2;pointer-events:none;
    box-shadow:inset 0 0 calc(40 * var(--u)) rgba(0,0,0,.35);
    border-radius:inherit;
  }
  .card .knob{
    position:absolute;right:calc(26 * var(--u));width:calc(58 * var(--u));height:calc(58 * var(--u));
    border:0;border-radius:50%;background:#dfd9cd;color:#2a2621;cursor:pointer;
    display:grid;place-items:center;
    transition:background .3s var(--ease),transform .5s var(--ease-out);
  }
  .card--note .knob{bottom:calc(26 * var(--u))}
  .card--work .knob{top:calc(26 * var(--u))}
  .card .knob:hover{background:#fff;transform:scale(1.06)}
  .card .knob svg{width:calc(22 * var(--u));height:calc(22 * var(--u));display:block}

  /* ---------- footer + scroll cue --------------------------------------- */
  .colophon{
    position:absolute;z-index:5;left:calc(96 * var(--u));bottom:calc(52 * var(--u));
    font-size:calc(var(--label) * var(--u));letter-spacing:calc(calc(var(--label-track) * .64) * var(--u));
    text-transform:uppercase;color:var(--ink-faint);
  }
  .scroll{
    position:absolute;z-index:5;left:calc(880 * var(--u));bottom:calc(46 * var(--u));
    display:flex;align-items:center;gap:calc(14 * var(--u));
    writing-mode:vertical-rl;
    font-size:calc(13 * var(--u));letter-spacing:calc(5 * var(--u));font-weight:400;
    text-transform:uppercase;color:var(--ink-soft);text-decoration:none;
    text-shadow:0 calc(2 * var(--u)) calc(18 * var(--u)) rgba(0,0,0,.7);
  }
  .scroll .track{
    position:relative;display:block;width:1px;height:calc(78 * var(--u));
    background:rgba(255,255,255,.16);overflow:hidden;
  }
  .scroll .track::after{
    content:'';position:absolute;left:0;top:0;width:1px;height:calc(26 * var(--u));
    background:rgba(255,255,255,.85);animation:trickle 2.6s var(--ease) infinite;
  }
  @keyframes trickle{
    0%{transform:translateY(-105%);opacity:0}
    22%{opacity:1}78%{opacity:1}
    100%{transform:translateY(300%);opacity:0}
  }

  /* ---------- cursor ---------------------------------------------------- */
  .cursor{
    position:fixed;left:0;top:0;z-index:9;pointer-events:none;
    width:calc(128 * var(--u));height:calc(128 * var(--u));
    margin-left:calc(-64 * var(--u));margin-top:calc(-64 * var(--u));
    border:1px solid rgba(255,255,255,.5);border-radius:50%;
    opacity:0;transition:opacity .4s ease;will-change:transform;
  }

  /* ---------- pointer parallax -----------------------------------------
     --px / --py are written on the stage once per frame (-1..1); each layer
     says how far it rides (--pd) and how much it turns (--pr).             */
  .par{
    transform:perspective(1500px)
      translate3d(calc(var(--px,0) * var(--pd,0) * -1px),calc(var(--py,0) * var(--pd,0) * -.62px),0)
      rotateY(calc(var(--px,0) * var(--pr,0) * 1deg))
      rotateX(calc(var(--py,0) * var(--pr,0) * -.7deg));
  }

  /* ---------- entrance --------------------------------------------------
     clip-path rather than transform, because transform is spoken for by the
     parallax.  Once the intro has run the clip is dropped entirely.        */
  .js .mask{clip-path:inset(100% 0 0 0 round var(--mr,0px))}
  .is-ready .mask{clip-path:inset(0 0 0 0 round var(--mr,0px));transition:clip-path 1.05s var(--ease-out) var(--d,0ms)}
  .js .mask-circle{clip-path:circle(0% at 50% 50%)}
  .is-ready .mask-circle{clip-path:circle(76% at 50% 50%);transition:clip-path 1.1s var(--ease-out) var(--d,0ms)}
  .js .fade{opacity:0}
  .is-ready .fade{opacity:1;transition:opacity 1.3s var(--ease) var(--d,0ms)}
  .intro-done .mask,.intro-done .mask-circle{clip-path:none;transition:none}
  .js .dock{opacity:0}
  .is-ready .dock{opacity:1;transition:opacity .8s var(--ease) 80ms}
  .js .dock-item{clip-path:inset(0 0 105% 0)}
  .is-ready .dock-item{
    clip-path:inset(0 0 -30% 0);
    transition:clip-path .9s var(--ease-out) var(--d,0ms),color .18s var(--ease),
               border-color .2s var(--ease),background .2s var(--ease);
  }
  canvas#gl{opacity:0;transition:opacity 1.4s var(--ease)}
  body.is-ready canvas#gl{opacity:1}

  a:focus-visible,button:focus-visible{
    outline:2px solid rgba(255,255,255,.85);outline-offset:calc(4 * var(--u));border-radius:calc(6 * var(--u));
  }

  /* wrappers exist only so the narrow tiers can reflow the same markup;
     on the wide stage they generate no box at all */
  .col,.meta{display:contents}

  /* ── tier 2: short or mid-width — same composition, fewer pieces ────── */
  @media (max-width:1180px), (max-height:640px){
    .card--note{left:calc(1010 * var(--u));top:calc(430 * var(--u))}
    .card--work{display:none}
    .guides i:nth-child(3){display:none}
    .stat--a{top:calc(900 * var(--u))}
    .stat--b{top:calc(1006 * var(--u))}
  }

  /* ── tier 3: narrow or portrait — the stage stops being a fixed frame
     and the copy flows in a column under the scene ───────────────────── */
  @media (max-width:820px), (max-aspect-ratio:9/10){
    :root{ --u: min(calc(100vw / 700), calc(100vh / 1180), 1.05px); }

    .stage{
      position:fixed;left:0;top:0;margin:0;
      width:100%;height:100%;
      display:flex;flex-direction:column;justify-content:flex-end;
      padding:0 calc(38 * var(--u)) calc(34 * var(--u));
      gap:calc(20 * var(--u));
    }
    .col{display:block}
    .meta{display:flex;gap:calc(30 * var(--u));flex-wrap:wrap;align-items:flex-start}

    .eyebrow,.headline,.lede,.cta,.stat,.colophon{position:static;left:auto;top:auto;width:auto}
    .eyebrow{margin-bottom:calc(14 * var(--u))}
    .headline{
      font-size:calc(clamp(48, var(--h1) * .76, 104) * var(--u));
      line-height:calc(clamp(46, var(--h1-lh) * .76, 100) * var(--u));
      margin-bottom:calc(20 * var(--u));
    }
    .lede{max-width:calc(520 * var(--u));margin-bottom:calc(26 * var(--u))}
    .cta{max-width:calc(520 * var(--u));margin-bottom:calc(26 * var(--u))}
    .stat{margin:0}
    .colophon{margin-top:calc(6 * var(--u))}

    .card,.guides,.scroll{display:none}
    .ghost{font-size:calc(300 * var(--u));bottom:calc(-52 * var(--u));letter-spacing:calc(26 * var(--u))}

    .dock-wrap{top:calc(26 * var(--u))}
    .dock{height:calc(64 * var(--u));border-radius:calc(19 * var(--u))}
    .dock-item{height:calc(52 * var(--u));padding:0 calc(15 * var(--u));font-size:calc(14 * var(--u))}
    .dock-item span:not(.glyph){display:none}
    .dock-item .glyph{width:calc(19 * var(--u));height:calc(19 * var(--u))}
    .dock-mark{width:calc(52 * var(--u))}
    .dock-mark svg{width:calc(28 * var(--u));height:calc(28 * var(--u))}

    .cursor{display:none}
  }

  /* very small phones: one stat, tighter margins */
  @media (max-width:420px){
    .stat--b{display:none}
    .stage{padding:0 calc(30 * var(--u)) calc(24 * var(--u))}
  }

  /* pointer-less devices get no cursor ring and no hover-only affordances */
  @media (hover:none){
    .cursor{display:none}
  }
  @media (prefers-reduced-motion:reduce){
    .scroll .track::after{animation:none}
    .is-ready .mask,.is-ready .mask-circle,.is-ready .fade,.is-ready .dock-item{transition-duration:.01ms}
  }
</style>
</head>
<body>
<div class="backdrop" aria-hidden="true">
  <div class="guides fade" style="--d:900ms">
    <i style="left:calc(480 * var(--u))"></i>
    <i style="left:calc(960 * var(--u))"></i>
    <i style="left:calc(1440 * var(--u))"></i>
  </div>
  <div class="ghost fade" style="--d:1150ms">ORRERY</div>
</div>

<canvas id="gl"></canvas>

<div class="stage" id="stage">

  <div class="dock-wrap">
    <nav class="dock par" style="--pd:5" data-spec aria-label="Primary">
      <a class="dock-item dock-mark" data-dock data-spec href="#" style="--d:120ms" aria-label="Orrery — home">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3">
          <ellipse cx="12" cy="12" rx="9.4" ry="4.1" transform="rotate(-16 12 12)"/>
          <ellipse cx="12" cy="12" rx="5.2" ry="2.2" transform="rotate(-16 12 12)"/>
          <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/>
        </svg>
      </a>
      <a class="dock-item is-active" data-dock data-spec href="#" style="--d:180ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.1"/><ellipse cx="8" cy="8" rx="6.4" ry="2.6"/></svg></span>
        <span>Upkeep</span>
      </a>
      <a class="dock-item" data-dock data-spec href="#" style="--d:230ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M2.4 11.6 6 6.4l2.6 3 2-2.4 3 4.6z"/><circle cx="5.2" cy="4.2" r="1.3"/></svg></span>
        <span>Grounds</span>
      </a>
      <a class="dock-item" data-dock data-spec href="#" style="--d:280ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 2.6h5.2L12 5.3v8.1H4z"/><path d="M9.2 2.6v2.7h2.6"/><path d="M6 8.6h4M6 11h2.7"/></svg></span>
        <span>Notes</span>
      </a>
      <a class="dock-item dock-item--enter" data-dock data-spec href="#" style="--d:330ms">
        <span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M6.6 2.6h5.1a1 1 0 0 1 1 1v8.8a1 1 0 0 1-1 1H6.6"/><path d="M2.6 8h6.6"/><path d="m7 5.6 2.4 2.4L7 10.4"/></svg></span>
        <span>Enquiries</span>
      </a>
    </nav>
  </div>

  <div class="col">
  <p class="eyebrow mask" style="--d:220ms; --pd:8; --pr:.5">Upkeep — est. MMXIII</p>

  <h1 class="headline" style="--pd:20; --pr:1.2">
    <span class="mask" style="--d:280ms">Rebuilt often,</span>
    <span class="mask" style="--d:380ms">changed rarely</span>
  </h1>

  <p class="lede mask" style="--d:520ms; --pd:15; --pr:1">Identity, motion, and spatial web work for brands that would rather maintain a thing than replace it.</p>

  <a class="cta mask" style="--d:600ms; --pd:15; --pr:1" href="#">
    <span>Bring us a problem</span>
    <svg class="arw" viewBox="0 0 30 11" fill="none" aria-hidden="true">
      <path d="M0 5.5H28" stroke="#fff" stroke-width="1.1"/>
      <path d="M22.6 .9C23.6 3.1 25.6 4.9 28.4 5.5 25.6 6.1 23.6 7.9 22.6 10.1" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
  </div>

  <div class="meta">
  <dl class="stat stat--a mask" style="--d:700ms; --pd:12; --pr:.8">
    <span class="mark" aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <ellipse cx="15" cy="15" rx="12" ry="5" stroke-dasharray="0.6 3.4"/>
        <ellipse cx="15" cy="15" rx="6.4" ry="2.7"/>
        <circle cx="15" cy="15" r="1.3" fill="currentColor" stroke="none"/>
      </svg>
    </span>
    <div><dt>In practice</dt><dd>12 years</dd></div>
  </dl>

  <dl class="stat stat--b mask" style="--d:780ms; --pd:13; --pr:.8">
    <span class="mark" aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <path d="M15 4v22M4 15h22" stroke-dasharray="0.6 3.2"/>
        <path d="M8.8 8.8 21.2 21.2M21.2 8.8 8.8 21.2" stroke-dasharray="0.6 3.2"/>
        <circle cx="15" cy="15" r="4.2"/>
      </svg>
    </span>
    <div><dt>Grounds kept</dt><dd>23 sites</dd></div>
  </dl>

  </div>

  <article class="card card--note mask" style="--d:820ms; --pd:11; --pr:2.2">
    <figure><canvas data-plate="stone" width="480" height="240"></canvas></figure>
    <p class="label">Field note 31</p>
    <h2>Renewed, never repaired</h2>
    <button class="knob" aria-label="Open field note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </article>

  <article class="card card--work par mask" style="--d:900ms; --pd:22; --pr:2.4">
    <p class="label">Selected work</p>
    <h2>Kept, not preserved</h2>
    <figure><canvas data-plate="marble" width="480" height="280"></canvas></figure>
    <button class="knob" aria-label="Open selected work">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
      </svg>
    </button>
  </article>

  <p class="colophon fade" style="--d:1000ms; --pd:6">Orrery Studio — London &amp; Kyoto</p>

  <a class="scroll fade" style="--d:1040ms; --pd:8" href="#">Discover<span class="track"></span></a>

</div>

<div class="cursor" id="cursor"></div>

<script src="https://unpkg.com/three@0.147.0/build/three.min.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/shaders/CopyShader.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/shaders/LuminosityHighPassShader.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/EffectComposer.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/RenderPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/ShaderPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/MaskPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/postprocessing/UnrealBloomPass.js"><\/script>
<script src="https://unpkg.com/three@0.147.0/examples/js/objects/MarchingCubes.js"><\/script>
<script>
(function(){
'use strict';

/* =====================================================================
   0. deterministic helpers
   ===================================================================== */
const PARAMS = new URLSearchParams(location.search);
const FROZEN = PARAMS.has('t') ? parseFloat(PARAMS.get('t')) : null;
const ELEV_OVERRIDE = PARAMS.has('elev') ? parseFloat(PARAMS.get('elev')) : null;  // camera height, debug
if(PARAMS.get('scene') === '0'){
  const s2 = document.createElement('style');
  s2.textContent = 'canvas#gl{display:none!important} body{background:#000}';
  document.head.appendChild(s2);
}
if(PARAMS.get('ui') === '0'){
  const s = document.createElement('style');
  s.textContent = '.stage,.cursor{display:none!important}';
  document.head.appendChild(s);
}

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd = mulberry32(20260818);

// --- 3d value noise (smooth, cheap) -------------------------------------
const P = new Uint8Array(512);
(function(){const p=[...Array(256).keys()];for(let i=255;i>0;i--){const j=(rnd()*(i+1))|0;[p[i],p[j]]=[p[j],p[i]];}for(let i=0;i<512;i++)P[i]=p[i&255];})();
function fade(t){return t*t*t*(t*(t*6-15)+10);}
function lerp(a,b,t){return a+(b-a)*t;}
function grad(h,x,y,z){const u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z);return((h&1)?-u:u)+((h&2)?-v:v);}
function noise3(x,y,z){
  const X=Math.floor(x)&255,Y=Math.floor(y)&255,Z=Math.floor(z)&255;
  x-=Math.floor(x);y-=Math.floor(y);z-=Math.floor(z);
  const u=fade(x),v=fade(y),w=fade(z);
  const A=P[X]+Y,AA=P[A]+Z,AB=P[A+1]+Z,B=P[X+1]+Y,BA=P[B]+Z,BB=P[B+1]+Z;
  return lerp(lerp(lerp(grad(P[AA]&15,x,y,z),grad(P[BA]&15,x-1,y,z),u),
                   lerp(grad(P[AB]&15,x,y-1,z),grad(P[BB]&15,x-1,y-1,z),u),v),
              lerp(lerp(grad(P[AA+1]&15,x,y,z-1),grad(P[BA+1]&15,x-1,y,z-1),u),
                   lerp(grad(P[AB+1]&15,x,y-1,z-1),grad(P[BB+1]&15,x-1,y-1,z-1),u),v),w);
}
function fbm3(x,y,z,oct,lac,gain){
  let a=0,amp=.5,f=1;
  for(let i=0;i<(oct||4);i++){a+=amp*noise3(x*f,y*f,z*f);f*=(lac||2.03);amp*=(gain||.5);}
  return a;
}

/* =====================================================================
   1. renderer / scene / camera
   ===================================================================== */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.LinearEncoding;      // we encode ourselves in the final pass
renderer.toneMapping = THREE.NoToneMapping;          // ditto
THREE.ColorManagement.legacyMode = false;

const scene = new THREE.Scene();

const REF_ASPECT = 1920/1366;
const REF_FOV_V  = 35;                                                   // vertical fov at the reference aspect
const FOV_H = 2*Math.atan(Math.tan(REF_FOV_V*Math.PI/360)*REF_ASPECT);   // keep the horizontal framing constant
const camera = new THREE.PerspectiveCamera(REF_FOV_V, REF_ASPECT, .1, 400);

const D_CAM      = 8.45;   // orbit radius
const Y_RING_LOW = 0.0;    // lower orbit ring plane
const Y_RING_TOP = 3.72;   // upper orbit ring plane
const Y_PLINTH   = 1.21;   // plinth top surface
const Y_TARGET   = 1.90;   // the buildings here are low and wide, so the
                           // aim comes up off the rock and onto the precinct
const ROLL       = -9.658*Math.PI/180;
let PORTRAIT = false, DIST_SCALE = 1;
const Y_CAM      = 1.86;    // just above the gate's lintel, so the precinct
                            // reads as a plan without losing the silhouette
const ORBIT_RATE = 0.038;   // rad/s, a full turn in ~165 s
const ROCK_RATE  = 0.026;   // the plinth counter-rotates, ~240 s per turn
const SHRINE_YAW = -0.30;   // the precinct's yaw at t=0
const R_RING_TOP = 2.98;
const R_RING_LOW = 1.727;

/* =====================================================================
   2. procedural stone texture
   ===================================================================== */
/* ---------------------------------------------------------------------
   Stone maps are baked on the GPU.  Building them in JS capped out around
   1k and a second of load; on the GPU a 2k set with a dozen layered
   features costs a few milliseconds, so the surface can carry bedding,
   fissures, calcite veins, chipping, porosity, rain runnels and dust
   without the page paying for it.

   Pass 1 renders a height/mask buffer at half float, then the albedo,
   normal and ORM passes all read it.  The results are read back into
   DataTextures so they get proper mipmaps and anisotropy.
   --------------------------------------------------------------------- */
const TEX_COMMON = \`
  precision highp float;
  varying vec2 vUv;
  uniform vec2  uPeriod;      // tiling period in cells
  uniform float uSeed;

  vec2 wrap(vec2 p, vec2 period){ return mod(p, period); }
  float hash21(vec2 p, vec2 period){
    p = wrap(p, period) + uSeed;
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float vnoise(vec2 x, vec2 period){
    vec2 i = floor(x), f = fract(x);
    vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    float a = hash21(i,              period);
    float b = hash21(i+vec2(1.0,0.0),period);
    float c = hash21(i+vec2(0.0,1.0),period);
    float d = hash21(i+vec2(1.0,1.0),period);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y)*2.0-1.0;
  }
  // anisotropic tileable fbm: cells counts per axis, doubled each octave
  float fbm(vec2 uv, vec2 cells, int oct, float gain){
    float a = 0.0, amp = 1.0, norm = 0.0;
    vec2 c = cells;
    for(int i=0;i<8;i++){
      if(i>=oct) break;
      a += amp * vnoise(uv*c, c);
      norm += amp; c *= 2.0; amp *= gain;
    }
    return a/max(norm,1e-4);
  }
  // random value per worley cell — mineral grains, breccia clasts
  float cellRand2(vec2 uv, vec2 cells, float salt){
    vec2 p = uv*cells, ip = floor(p), fp = fract(p);
    float d1 = 8.0; vec2 best = ip;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 o = vec2(float(i), float(j));
        vec2 cell = ip + o;
        vec2 r = vec2(hash21(cell, cells), hash21(cell+37.7, cells));
        vec2 diff = o + r - fp;
        float d = dot(diff, diff);
        if(d < d1){ d1 = d; best = cell; }
      }
    }
    return hash21(best + salt, cells);
  }
  float cellRand(vec2 uv, float cells, float salt){ return cellRand2(uv, vec2(cells), salt); }
  // wrapping worley; returns (nearest, second) distances
  vec2 worley2(vec2 uv, vec2 cells){
    vec2 p = uv*cells, ip = floor(p), fp = fract(p);
    float d1 = 8.0, d2 = 8.0;
    for(int j=-1;j<=1;j++){
      for(int i=-1;i<=1;i++){
        vec2 o = vec2(float(i), float(j));
        vec2 cell = ip + o;
        vec2 r = vec2(hash21(cell, cells), hash21(cell+37.7, cells));
        vec2 diff = o + r - fp;
        float d = dot(diff, diff);
        if(d < d1){ d2 = d1; d1 = d; } else if(d < d2){ d2 = d; }
      }
    }
    return vec2(sqrt(d1), sqrt(d2));
  }
  vec2 worley(vec2 uv, float cells){ return worley2(uv, vec2(cells)); }
  /* Fracture network: the walls between worley cells.  Unlike the zero set of
     a smooth field these branch, meet at junctions and terminate, which is
     what makes them read as cracks rather than contour lines.               */
  float fractureNet(vec2 uv, vec2 cells, float width, float warpAmt){
    vec2 w = vec2(fbm(uv + 2.2, vec2(4.0), 3, 0.5), fbm(uv + 8.8, vec2(4.0), 3, 0.5))*warpAmt;
    vec2 d = worley2(uv + w, cells);
    float wobble = 0.55 + 0.9*(fbm(uv + 5.5, vec2(8.0), 3, 0.5)*0.5 + 0.5);
    return 1.0 - smoothstep(0.0, width*wobble, d.y - d.x);
  }
\`;

const HEIGHT_FS = TEX_COMMON + \`
  uniform float uBeds, uBedDepth, uBedSoft;
  uniform float uFissureCells, uFissureSharp, uFissureDepth;
  uniform float uChipCells, uChipDepth, uPitCells, uPitDepth;
  uniform float uVeinDepth, uRunnel, uMicro, uMacro, uGrainCells, uGrainAmp, uVeinSharp;

  void main(){
    vec2 uv = vUv;

    // --- broad form -----------------------------------------------------
    float macro = fbm(uv, vec2(2.0), 5, 0.5);
    float warp  = fbm(uv + 11.3, vec2(2.0), 3, 0.5);

    // --- sedimentary bedding, thickness varying along each bed ----------
    float band  = uv.y*uBeds + warp*0.85;
    float bf    = fract(band);
    float joint = 1.0 - smoothstep(0.0, uBedSoft, bf)*smoothstep(1.0, 1.0-uBedSoft, bf);
    // beds only survive in patches — a continuous line across the whole face
    // reads as timber, not stone
    joint *= smoothstep(0.30, 0.72, fbm(uv + 7.7, vec2(3.0, 6.0), 3, 0.55)*1.4 + 0.5);
    float bedTone = fbm(vec2(floor(band)*0.37, 0.5), vec2(4.0), 2, 0.5);

    // mineral grain at two scales: flat-ish clasts with their own tone/height
    float grainA = cellRand(uv, uGrainCells,        1.7)*2.0 - 1.0;
    float grainB = cellRand(uv, uGrainCells*3.1,   13.3)*2.0 - 1.0;

    // --- fissures: stretched so they run with the bedding ---------------
    float crack  = fractureNet(uv, vec2(uFissureCells, uFissureCells*0.55), 0.040, 0.05);
    float crack2 = fractureNet(uv + 13.7, vec2(uFissureCells*2.3, uFissureCells*1.3), 0.055, 0.03)*0.45;
    crack  *= smoothstep(0.34, 0.82, fbm(uv + 15.1, vec2(3.0), 3, 0.55)*1.3 + 0.5);
    crack2 *= smoothstep(0.40, 0.88, fbm(uv + 45.3, vec2(5.0), 3, 0.55)*1.3 + 0.5);
    // one sparse family of deep fractures cutting the whole block
    float fracture = fractureNet(uv + 63.2, vec2(3.0, 2.0), 0.035, 0.07);
    fracture *= smoothstep(0.45, 0.85, fbm(uv + 27.4, vec2(2.0), 3, 0.55)*1.4 + 0.5);

    // --- chipped pockets and porosity -----------------------------------
    vec2  wc = worley(uv, uChipCells);
    float chip = clamp(1.0 - wc.x/0.42, 0.0, 1.0);
    chip *= smoothstep(0.35, 0.55, hash21(floor(uv*uChipCells)+3.3, vec2(uChipCells)));
    vec2  wp = worley(uv + 5.5, uPitCells);
    float pit = clamp(1.0 - wp.x/0.38, 0.0, 1.0);
    pit *= smoothstep(0.25, 0.60, hash21(floor((uv+5.5)*uPitCells)+9.1, vec2(uPitCells)));
    float pore = clamp(1.0 - worley(uv + 17.1, uPitCells*1.7).x/0.34, 0.0, 1.0);
    pore *= 0.55 + 0.45*(fbm(uv + 3.7, vec2(24.0), 3, 0.5)*0.5 + 0.5);

    // --- calcite veins: thin raised threads ------------------------------
    float vn = fbm(uv + 88.4, vec2(2.0, 3.0), 4, 0.55);
    float vein = pow(clamp(1.0 - abs(vn)*uVeinSharp, 0.0, 1.0), 2.4);
    vein *= smoothstep(0.52, 0.86, fbm(uv + 71.2, vec2(3.0), 3, 0.55)*1.4 + 0.5);

    // --- rain runnels down the face, and fine tooth ----------------------
    float runnel = fbm(uv + 33.9, vec2(26.0, 2.0), 3, 0.5);
    runnel = pow(clamp(1.0 - abs(runnel)*7.0, 0.0, 1.0), 1.4) * smoothstep(0.15, 0.75, 1.0-uv.y);
    float micro = fbm(uv + 51.0, vec2(48.0), 3, 0.5);
    float grit  = fbm(uv + 77.0, vec2(160.0), 2, 0.5);

    // --- assemble --------------------------------------------------------
    float h = 0.55 + macro*uMacro + bedTone*0.04 + micro*uMicro + grit*uMicro*0.35;
    h += grainA*uGrainAmp + grainB*uGrainAmp*0.55;
    h -= joint*uBedDepth;
    h -= (crack + crack2)*uFissureDepth;
    h -= fracture*uFissureDepth*1.7;
    h -= chip*chip*uChipDepth;
    h -= pit*pit*uPitDepth + pore*pore*uPitDepth*0.30;
    h -= runnel*uRunnel;
    h += vein*uVeinDepth;

    float cracks = clamp(crack + crack2 + fracture*1.3 + joint*0.7, 0.0, 1.0);
    float holes  = clamp(chip*1.15 + pit*0.95 + pore*0.30, 0.0, 1.0);
    float mineral = clamp(0.5 + fbm(uv + 5.0, vec2(2.0, 1.0), 4, 0.5)*1.5
                              + grainA*0.22 + grainB*0.12, 0.0, 1.0);

    gl_FragColor = vec4(h, cracks, holes, mineral);
  }
\`;

const ALBEDO_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec3 uWarm, uCool, uDark, uPale, uVein;
  uniform float uStain, uRecess, uBleach, uDust, uGrain, uGrainCells, uVeinSharp;
  void main(){
    vec2 uv = vUv;
    vec4 H = texture2D(tH, uv);
    float h = H.x, cracks = H.y, holes = H.z, mineral = H.w;

    vec3 col = mix(uCool, uWarm, mineral);
    // clast-to-clast tone jitter keeps the surface from reading as one wash
    float cA = cellRand(uv, uGrainCells,      1.7) - 0.5;
    float cB = cellRand(uv, uGrainCells*3.1, 13.3) - 0.5;
    // feathered by a fine field so the clasts do not read as flat polygons
    float feather = fbm(uv + 3.3, vec2(96.0), 3, 0.5)*0.5 + 0.5;
    col *= 1.0 + (cA*0.11 + cB*0.07)*(0.55 + 0.45*feather);

    // iron / soot staining in broad patches
    float stain = clamp(fbm(uv + 41.0, vec2(7.0), 4, 0.5)*2.2 - 0.35, 0.0, 1.0)*uStain;
    col = mix(col, uDark*0.9, stain);

    // lichen-like crust: cooler, lighter, only on upward-ish broad areas
    float crust = smoothstep(0.55, 0.95, fbm(uv + 12.7, vec2(6.0), 4, 0.55)*1.6 + 0.5);
    col = mix(col, mix(col, vec3(0.62,0.64,0.60), 0.55), crust*0.35);

    // bleached plateaus, darkened recesses
    col = mix(col, uPale, smoothstep(0.58, 0.94, h)*uBleach);
    // recesses: fissures read darkest, then pockets, then porosity
    col = mix(col, uDark*0.82, clamp(cracks*1.05, 0.0, 1.0)*uRecess);
    col = mix(col, uDark,      clamp(holes*0.95,  0.0, 1.0)*uRecess*0.85);

    // calcite veins read brighter than the matrix
    float vn = fbm(uv + 88.4, vec2(2.0, 3.0), 4, 0.55);
    float vein = pow(clamp(1.0 - abs(vn)*uVeinSharp, 0.0, 1.0), 2.4);
    vein *= smoothstep(0.52, 0.86, fbm(uv + 71.2, vec2(3.0), 3, 0.55)*1.4 + 0.5);
    col = mix(col, uVein, vein*0.75);

    // pale dust settling into the cavities
    float dust = clamp(holes*1.2 + smoothstep(0.5, 0.1, h)*0.5, 0.0, 1.0);
    col = mix(col, uPale*0.96, dust*uDust);

    col += (hash21(vUv*4096.0, vec2(4096.0)) - 0.5)*uGrain;
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
\`;

const ORM_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec2 uTexel;
  uniform float uRough, uRoughVar, uAO;
  void main(){
    vec2 uv = vUv;
    vec4 H = texture2D(tH, uv);
    float h = H.x, cracks = H.y, holes = H.z;

    // cavity AO: compare the height against a wide blur of itself
    float blur = 0.0;
    for(int i=0;i<12;i++){
      float a = float(i)*0.5236;
      vec2 o = vec2(cos(a), sin(a));
      blur += texture2D(tH, uv + o*uTexel*7.0).x;
      blur += texture2D(tH, uv + o*uTexel*17.0).x;
    }
    blur /= 24.0;
    float ao = 1.0 - clamp((blur - h)*uAO, 0.0, 1.0);
    ao *= 1.0 - clamp(cracks*0.35 + holes*0.30, 0.0, 0.55);

    float open = clamp(holes*1.2 + cracks*0.8, 0.0, 1.0);
    float rough = uRough + open*uRoughVar - smoothstep(0.66, 0.92, h)*uRoughVar*0.8;
    rough += fbm(uv + 61.0, vec2(8.0), 3, 0.5)*0.10;
    gl_FragColor = vec4(clamp(ao,0.0,1.0), clamp(rough,0.04,1.0), 0.0, 1.0);
  }
\`;

const NORMAL_FS = TEX_COMMON + \`
  uniform sampler2D tH;
  uniform vec2 uTexel;
  uniform float uStrength;
  float hAt(vec2 uv){ return texture2D(tH, uv).x; }
  void main(){
    vec2 t = uTexel;
    float l = hAt(vUv - vec2(t.x,0.0)), r = hAt(vUv + vec2(t.x,0.0));
    float d = hAt(vUv - vec2(0.0,t.y)), u = hAt(vUv + vec2(0.0,t.y));
    float l2 = hAt(vUv - vec2(t.x,0.0)*2.0), r2 = hAt(vUv + vec2(t.x,0.0)*2.0);
    float d2 = hAt(vUv - vec2(0.0,t.y)*2.0), u2 = hAt(vUv + vec2(0.0,t.y)*2.0);
    float dx = (r - l)*0.66 + (r2 - l2)*0.34;
    float dy = (u - d)*0.66 + (u2 - d2)*0.34;
    vec3 n = normalize(vec3(-dx*uStrength, -dy*uStrength, 1.0));
    gl_FragColor = vec4(n*0.5 + 0.5, 1.0);
  }
\`;

const TEX_VS = \`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }\`;

function bakeStoneMaps(opt){
  const o = Object.assign({
    size:2048, ormSize:1024, seed:0, period:1.0,
    beds:4.0, bedDepth:0.055, bedSoft:0.14,
    fissureCells:8.0, fissureSharp:44.0, fissureDepth:0.11,
    chipCells:6.0, chipDepth:0.12, pitCells:34.0, pitDepth:0.15,
    veinDepth:0.020, veinSharp:110.0, runnel:0.030, micro:0.030, macro:0.30, grainCells:26.0, grainAmp:0.030,
    warm:[0.69,0.67,0.64], cool:[0.59,0.60,0.615], dark:[0.36,0.353,0.353],
    pale:[0.84,0.83,0.812], vein:[0.90,0.895,0.875],
    stain:0.30, recess:0.44, bleach:0.26, dust:0.30, grain:0.028,
    rough:0.82, roughVar:0.16, ao:2.6, nrm:2.2
  }, opt||{});

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), null);
  const sc = new THREE.Scene(); sc.add(quad);
  const cam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const prevTarget = renderer.getRenderTarget();

  const mkRT = (s, type) => new THREE.WebGLRenderTarget(s, s, {
    minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
    format:THREE.RGBAFormat, type:type||THREE.UnsignedByteType,
    wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, depthBuffer:false
  });
  const run = (rt, mat) => { quad.material = mat; renderer.setRenderTarget(rt); renderer.render(sc, cam); };
  const common = { uPeriod:{value:new THREE.Vector2(o.period,o.period)}, uSeed:{value:o.seed} };

  // 1. height + masks
  const rtH = mkRT(o.size, THREE.HalfFloatType);
  run(rtH, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:HEIGHT_FS, uniforms:Object.assign({}, common, {
    uBeds:{value:o.beds}, uBedDepth:{value:o.bedDepth}, uBedSoft:{value:o.bedSoft},
    uFissureCells:{value:o.fissureCells}, uFissureSharp:{value:o.fissureSharp}, uFissureDepth:{value:o.fissureDepth},
    uChipCells:{value:o.chipCells}, uChipDepth:{value:o.chipDepth},
    uPitCells:{value:o.pitCells}, uPitDepth:{value:o.pitDepth},
    uVeinDepth:{value:o.veinDepth}, uRunnel:{value:o.runnel}, uMicro:{value:o.micro}, uMacro:{value:o.macro},
    uGrainCells:{value:o.grainCells}, uGrainAmp:{value:o.grainAmp}, uVeinSharp:{value:o.veinSharp}
  })}));

  // 2. albedo / orm / normal
  const V3 = a => new THREE.Vector3(a[0],a[1],a[2]);
  const rtA = mkRT(o.size);
  run(rtA, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:ALBEDO_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uWarm:{value:V3(o.warm)}, uCool:{value:V3(o.cool)},
    uDark:{value:V3(o.dark)}, uPale:{value:V3(o.pale)}, uVein:{value:V3(o.vein)},
    uStain:{value:o.stain}, uRecess:{value:o.recess}, uBleach:{value:o.bleach},
    uDust:{value:o.dust}, uGrain:{value:o.grain}, uGrainCells:{value:o.grainCells}, uVeinSharp:{value:o.veinSharp}
  })}));
  const rtO = mkRT(o.ormSize);
  run(rtO, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:ORM_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uTexel:{value:new THREE.Vector2(1/o.size,1/o.size)},
    uRough:{value:o.rough}, uRoughVar:{value:o.roughVar}, uAO:{value:o.ao}
  })}));
  const rtN = mkRT(o.size);
  run(rtN, new THREE.ShaderMaterial({ vertexShader:TEX_VS, fragmentShader:NORMAL_FS, uniforms:Object.assign({}, common, {
    tH:{value:rtH.texture}, uTexel:{value:new THREE.Vector2(1/o.size,1/o.size)}, uStrength:{value:o.nrm*o.size/512}
  })}));

  // 3. read back so the maps get real mipmaps + anisotropy
  const grab = (rt, s, srgb) => {
    const buf = new Uint8Array(s*s*4);
    renderer.readRenderTargetPixels(rt, 0, 0, s, s, buf);
    const t = new THREE.DataTexture(buf, s, s, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    if(srgb) t.encoding = THREE.sRGBEncoding;
    t.needsUpdate = true;
    return t;
  };
  const out = {
    map: grab(rtA, o.size, true),
    ormMap: grab(rtO, o.ormSize, false),
    normalMap: grab(rtN, o.size, false)
  };
  out.roughnessMap = out.ormMap;
  out.aoMap = out.ormMap;

  renderer.setRenderTarget(prevTarget);
  rtH.dispose(); rtA.dispose(); rtO.dispose(); rtN.dispose();
  quad.geometry.dispose();
  return out;
}

/* A second, very high frequency normal tiled many times over the macro maps.
   The 2k maps carry the fissures and pockets; this carries the tooth of the
   stone, so the surface keeps resolving as you get closer instead of going
   smooth.                                                                  */
const DETAIL_FS = TEX_COMMON + \`
  uniform vec2 uTexel; uniform float uStrength;
  float hgt(vec2 uv){
    float a = fbm(uv, vec2(12.0), 4, 0.55);
    float b = fbm(uv + 4.4, vec2(48.0), 3, 0.5)*0.55;
    float c = 1.0 - clamp(worley(uv + 2.1, 26.0).x/0.42, 0.0, 1.0);
    float d = 1.0 - smoothstep(0.0, 0.10, worley2(uv + 8.3, vec2(16.0, 13.0)).y
                                        - worley2(uv + 8.3, vec2(16.0, 13.0)).x);
    return 0.5 + a*0.30 + b*0.18 - c*c*0.22 - d*0.10;
  }
  void main(){
    vec2 t = uTexel;
    float dx = hgt(vUv + vec2(t.x,0.0)) - hgt(vUv - vec2(t.x,0.0));
    float dy = hgt(vUv + vec2(0.0,t.y)) - hgt(vUv - vec2(0.0,t.y));
    vec3 n = normalize(vec3(-dx*uStrength, -dy*uStrength, 1.0));
    gl_FragColor = vec4(n*0.5 + 0.5, 1.0);
  }
\`;
function bakeDetailNormal(size, seed, strength){
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.ShaderMaterial({
    vertexShader:TEX_VS, fragmentShader:DETAIL_FS,
    uniforms:{ uPeriod:{value:new THREE.Vector2(1,1)}, uSeed:{value:seed},
               uTexel:{value:new THREE.Vector2(1/size,1/size)}, uStrength:{value:strength*size/512} }
  }));
  const sc = new THREE.Scene(); sc.add(quad);
  const cam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const prev = renderer.getRenderTarget();
  const rt = new THREE.WebGLRenderTarget(size, size, {
    minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter, format:THREE.RGBAFormat,
    wrapS:THREE.RepeatWrapping, wrapT:THREE.RepeatWrapping, depthBuffer:false });
  renderer.setRenderTarget(rt); renderer.render(sc, cam);
  const buf = new Uint8Array(size*size*4);
  renderer.readRenderTargetPixels(rt, 0, 0, size, size, buf);
  renderer.setRenderTarget(prev);
  const t = new THREE.DataTexture(buf, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  t.needsUpdate = true;
  rt.dispose(); quad.geometry.dispose();
  return t;
}
const DETAIL_N = bakeDetailNormal(1024, 3.0, 2.4);

/* Blend the detail normal into any standard material without forking the
   shader: swap the one chunk that builds the tangent-space normal.         */
function addDetailNormal(mat, scale, strength){
  mat.userData.detail = { scale, strength };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDetailMap = { value: DETAIL_N };
    shader.uniforms.uDetailScale = { value: scale };
    shader.uniforms.uDetailStrength = { value: strength };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <normalmap_pars_fragment>',
        '#include <normalmap_pars_fragment>\\nuniform sampler2D uDetailMap;\\nuniform float uDetailScale;\\nuniform float uDetailStrength;')
      .replace('#include <normal_fragment_maps>', \`
        #ifdef USE_NORMALMAP_TANGENTSPACE
          vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
          mapN.xy *= normalScale;
          vec3 detN = texture2D( uDetailMap, vUv * uDetailScale ).xyz * 2.0 - 1.0;
          mapN = normalize( vec3( mapN.xy + detN.xy * uDetailStrength, mapN.z ) );
          normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
        #else
          #include <normal_fragment_maps>
        #endif
      \`);
  };
  mat.needsUpdate = true;
  return mat;
}

function setRepeat(set, rx, ry){
  for(const k of ['map','normalMap','ormMap']) if(set[k]) set[k].repeat.set(rx,ry);
  return set;
}

/* Plinth limestone — the surface the eye spends the most time on.          */
const STONE = bakeStoneMaps({
  size:2048, ormSize:1024, seed:0.0,
  beds:5.0, bedDepth:0.034, bedSoft:0.11,
  fissureCells:7.0, fissureSharp:52.0, fissureDepth:0.16,
  chipCells:9.0, chipDepth:0.20, pitCells:30.0, pitDepth:0.15,
  veinDepth:0.024, veinSharp:120.0, runnel:0.030, micro:0.052, macro:0.30,
  grainCells:30.0, grainAmp:0.030,
  warm:[0.735,0.712,0.672], cool:[0.605,0.618,0.632], dark:[0.245,0.242,0.244],
  pale:[0.885,0.874,0.852], vein:[0.925,0.918,0.896],
  stain:0.24, recess:0.66, bleach:0.32, dust:0.30, grain:0.026,
  rough:0.82, roughVar:0.20, ao:3.2, nrm:3.0
});
setRepeat(STONE, 1.0, 0.68);

/* Loose rubble — coarser, more broken, no bedding to speak of.             */
const RUBBLE = bakeStoneMaps({
  size:1024, ormSize:512, seed:5.0,
  beds:2.0, bedDepth:0.022, bedSoft:0.24,
  fissureCells:6.0, fissureSharp:42.0, fissureDepth:0.18,
  chipCells:6.0, chipDepth:0.25, pitCells:22.0, pitDepth:0.18,
  grainCells:18.0, grainAmp:0.040,
  veinDepth:0.016, veinSharp:130.0, runnel:0.0, micro:0.036, macro:0.34,
  warm:[0.700,0.678,0.645], cool:[0.590,0.601,0.615], dark:[0.235,0.232,0.234],
  pale:[0.845,0.836,0.818], vein:[0.895,0.889,0.870],
  stain:0.26, recess:0.64, bleach:0.28, dust:0.26, grain:0.030,
  rough:0.86, roughVar:0.16, ao:3.4, nrm:2.6
});

/* Statue marble — dense, faintly veined, weathered only in the hollows.    */
const MARBLE = bakeStoneMaps({
  size:2048, ormSize:1024, seed:11.0,
  beds:2.0, bedDepth:0.012, bedSoft:0.26,
  fissureCells:26.0, fissureSharp:68.0, fissureDepth:0.055,
  chipCells:10.0, chipDepth:0.070, pitCells:42.0, pitDepth:0.070,
  grainCells:44.0, grainAmp:0.014,
  veinDepth:0.012, veinSharp:150.0, runnel:0.012, micro:0.020, macro:0.14,
  warm:[0.885,0.872,0.850], cool:[0.828,0.833,0.840], dark:[0.470,0.462,0.455],
  pale:[0.965,0.962,0.952], vein:[0.975,0.972,0.964],
  stain:0.22, recess:0.42, bleach:0.24, dust:0.22, grain:0.018,
  rough:0.52, roughVar:0.28, ao:2.6, nrm:2.4
});
setRepeat(MARBLE, 4.4, 4.4);

/* =====================================================================
   3. background haze  (drawn first, occluded by geometry)
   ===================================================================== */
/* The reference background is a narrow vertical shaft of light sitting inside a
   broad halo.  Both terms were fitted to the source frame in sRGB, so the
   shader builds the target sRGB value and then inverts the tone curve.      */
const bgMat = new THREE.ShaderMaterial({
  depthTest:false, depthWrite:false,
  uniforms:{
    uShaft :{value:new THREE.Vector4(50.8/255.0, 0.522, 0.292, 0.0)}, // amp, cx, cy
    uShaftS:{value:new THREE.Vector2(0.055, 0.201)},
    uHalo  :{value:new THREE.Vector4(58.3/255.0, 0.522, 0.440, 0.0)},
    uHaloS :{value:new THREE.Vector2(0.300, 0.310)},
    uVig   :{value:new THREE.Vector2(0.86, 0.24)},
    uTintA :{value:new THREE.Color(0xfff7ec)},
    uTintB :{value:new THREE.Color(0xdad8d4)},
    uGain  :{value:1.07}
  },
  vertexShader:\`varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,1.0,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv;
    uniform vec4 uShaft,uHalo; uniform vec2 uShaftS,uHaloS,uVig;
    uniform vec3 uTintA,uTintB; uniform float uGain;
    // exact inverse of the ACES fit used in the final pass
    float invAces(float y){
      const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
      float A=y*c-a, B=y*d-b, C=y*e;
      if(abs(A)<1e-5) return -C/max(B,1e-5);
      float disc = max(B*B-4.0*A*C, 0.0);
      float x = (-B - sqrt(disc))/(2.0*A);
      if(x<0.0) x = (-B + sqrt(disc))/(2.0*A);
      return clamp(x, 0.0, 60.0);
    }
    void main(){
      vec2 p = vec2(vUv.x, 1.0-vUv.y);
      vec2 d1 = (p-uShaft.yz)/uShaftS;
      vec2 d2 = (p-uHalo.yz)/uHaloS;
      float g1 = exp(-0.5*dot(d1,d1));
      float g2 = exp(-0.5*dot(d2,d2));
      float s  = (uShaft.x*g1 + uHalo.x*g2)*uGain;
      vec2 q = (vUv-0.5)*vec2(1.0,0.90);
      s *= mix(uVig.y, 1.0, smoothstep(0.74, 0.30, length(q)));
      vec3 tint = mix(uTintB, uTintA, clamp(g1*1.6+g2*0.5,0.0,1.0));
      float lin = invAces(pow(clamp(s,0.0,1.0), 2.2));
      gl_FragColor = vec4(tint*lin, 1.0);
    }\`
});
const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), bgMat);
bgQuad.frustumCulled = false;
bgQuad.renderOrder = -10;
scene.add(bgQuad);

/* =====================================================================
   4. environment + lights
   ===================================================================== */
/* A tiny procedural sky — near-black surround, one warm high blob where the
   shaft sits and a dim cool bounce below.  Through PMREM it gives the stone
   a roughness-aware specular response, which is most of what separates
   "3D render" from "lit photograph".                                      */
function environmentTexture(){
  const W=256,H=128;
  const c=document.createElement('canvas'); c.width=W; c.height=H;
  const ctx=c.getContext('2d'); const img=ctx.createImageData(W,H); const d=img.data;
  const L=new THREE.Vector3(-0.34,0.86,-0.38).normalize();
  for(let y=0;y<H;y++){
    const th=(0.5-(y+0.5)/H)*Math.PI;                    // +pi/2 zenith
    for(let x=0;x<W;x++){
      const ph=((x+0.5)/W)*Math.PI*2-Math.PI;
      const dir=new THREE.Vector3(Math.cos(th)*Math.sin(ph), Math.sin(th), Math.cos(th)*Math.cos(ph));
      const up=Math.max(0,dir.y);
      const cosA=Math.max(-1,Math.min(1,dir.dot(L)));
      const ang=Math.acos(cosA);
      const blob=Math.exp(-(ang*ang)/0.30)*2.4 + Math.exp(-(ang*ang)/1.60)*0.42;
      const sky=Math.pow(up,1.6)*0.16;
      const floorBounce=Math.pow(Math.max(0,-dir.y),2.0)*0.05;
      const r=(blob*1.00+sky*0.90+floorBounce*0.75+0.012);
      const g=(blob*0.94+sky*0.94+floorBounce*0.80+0.012);
      const b=(blob*0.82+sky*1.00+floorBounce*0.95+0.014);
      const i=(y*W+x)*4;
      d[i]  =Math.min(255,Math.pow(Math.min(1,r),1/2.2)*255);
      d[i+1]=Math.min(255,Math.pow(Math.min(1,g),1/2.2)*255);
      d[i+2]=Math.min(255,Math.pow(Math.min(1,b),1/2.2)*255);
      d[i+3]=255;
    }
  }
  ctx.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c);
  t.mapping=THREE.EquirectangularReflectionMapping;
  t.encoding=THREE.sRGBEncoding;
  return t;
}
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTex = environmentTexture();
  scene.environment = pmrem.fromEquirectangular(envTex).texture;
  envTex.dispose(); pmrem.dispose();
}

const key = new THREE.DirectionalLight(0xfff3e6, 3.45);
key.position.set(-1.4, 7.4, -2.6);
key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
key.shadow.camera.left = -3.2; key.shadow.camera.right = 3.2;
key.shadow.camera.top  =  4.2; key.shadow.camera.bottom = -3.6;
key.shadow.camera.near = 0.5;  key.shadow.camera.far = 18;
key.shadow.bias = -0.0006;
key.shadow.normalBias = 0.055;
key.shadow.radius = 1.2;
scene.add(key);
scene.add(key.target);
key.target.position.set(0, Y_PLINTH-0.2, 0);

const rim = new THREE.DirectionalLight(0xcdd0d6, 0.42);
rim.position.set(5.0, 2.0, -5.0);
scene.add(rim);

const fill = new THREE.HemisphereLight(0x9a999b, 0x08080a, 0.06);
const frontFill = new THREE.PointLight(0xefe9e1, 0.70, 26, 1.25);
frontFill.position.set(-4.0, 5.4, 4.6);
scene.add(frontFill);
scene.add(fill);

const shaftLight = new THREE.PointLight(0xffeeda, 2.6, 18, 2.0);
shaftLight.position.set(-0.5, 4.6, -1.1);
scene.add(shaftLight);

/* =====================================================================
   5. orbit rings
   ===================================================================== */
const ringMat = (col, boost) => new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{
    uColor:{value:new THREE.Color(col)},
    uBoost:{value:boost},
    uPhase:{value:0},
    uCam:{value:new THREE.Vector3()},
    uLightDir:{value:new THREE.Vector3(-0.42,0,-0.91)}
  },
  vertexShader:\`
    varying vec3 vW; varying vec2 vUv; varying vec3 vN;
    void main(){
      vUv=uv; vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz;
      vN = normalize(mat3(modelMatrix)*normal);
      gl_Position = projectionMatrix*viewMatrix*w;
    }\`,
  fragmentShader:\`
    varying vec3 vW; varying vec2 vUv; varying vec3 vN;
    uniform vec3 uColor,uCam,uLightDir; uniform float uBoost,uPhase;
    void main(){
      // radial direction of this point of the ring, in world space
      vec3 dir = normalize(vec3(vW.x, 0.0, vW.z));
      vec3 toCam = normalize(vec3(uCam.x, 0.0, uCam.z));
      float near = 0.5 + 0.5*dot(dir, toCam);            // 1 on the near arc
      float lit  = clamp(0.5 + 0.5*dot(dir, uLightDir), 0.0, 1.0);   // 1 facing the shaft
      float w = (0.45 + 0.55*pow(smoothstep(0.02,0.98,near),0.75))
              * (0.46 + 0.54*pow(max(lit,0.0),0.9));
      // soft edge across the tube so the core blooms and the rim feathers
      float t = abs(vUv.y-0.5)*2.0;
      float core = smoothstep(1.0, 0.62, t);
      gl_FragColor = vec4(uColor*uBoost*w*core, w*core);
    }\`
});

/* Each orbit is a bundle of fine strands winding around a common path rather
   than one fat tube — they read as spun light, and the twist gives the ring
   something to catch the eye as it turns.                                   */
class StrandCurve extends THREE.Curve {
  constructor(R, w, wy, turns, phase, wob){
    super(); this.R=R; this.w=w; this.wy=wy; this.turns=turns; this.phase=phase; this.wob=wob||0;
  }
  getPoint(t, target){
    target = target || new THREE.Vector3();
    const a = t*Math.PI*2, s = a*this.turns + this.phase;
    // a second, slower undulation so no two strands stay parallel for long
    const q = a*2.0 + this.phase*1.7;
    const r = this.R + Math.cos(s)*this.w + Math.cos(q)*this.wob;
    target.set(Math.cos(a)*r, Math.sin(s)*this.wy + Math.sin(q)*this.wob*0.6, Math.sin(a)*r);
    return target;
  }
}
/* Each orbit is a loose skein of very fine filaments rather than one rope:
   more of them, thinner, spread over a wider bundle, each on its own twist
   rate so they braid, cross and separate along the run.                    */
function makeRing(radius, tube, y, colour, boost, opt){
  const o = Object.assign({
    strands:9, turns:11, spread:0.042, seg:700, radial:10,
    gain:[1.0,0.62,0.86,0.48,0.74,0.94,0.55,0.80,0.66]
  }, opt||{});
  const group = new THREE.Group();
  const pr = mulberry32(7717 + Math.round(radius*1000));
  for(let i=0;i<o.strands;i++){
    const phase = (i/o.strands)*Math.PI*2 + pr()*0.9;
    const turns = Math.max(3, Math.round(o.turns*(0.62 + pr()*0.85)));
    const off   = (pr()-0.5)*o.spread*1.15;
    const w     = o.spread*(0.45 + pr()*0.85);
    const wy    = o.spread*(0.40 + pr()*0.80);
    const curve = new StrandCurve(radius + off, w, wy, turns, phase, o.spread*0.30*pr());
    const g = new THREE.TubeGeometry(curve, o.seg, tube*(0.72 + pr()*0.65), o.radial, true);
    const m = ringMat(colour, boost*(o.gain[i%o.gain.length]));
    const mesh = new THREE.Mesh(g, m);
    mesh.renderOrder = 6;
    group.add(mesh);
  }
  group.position.y = y;
  scene.add(group);
  return group;
}
const ringTop = makeRing(R_RING_TOP, 0.0040, Y_RING_TOP, 0xffbb68, 13.5, {strands:9, turns:12, spread:0.028});
const ringLow = makeRing(R_RING_LOW, 0.0037, Y_RING_LOW, 0xffbe6e, 13.5, {strands:9, turns:9,  spread:0.025});

/* A wider halo of orbits at mixed inclinations — the thing an orrery is: a
   nest of paths around one centre.  Dimmer and finer than the two principal
   rings so they read as depth rather than competing with them.             */
const haloRings = [];
{
  const spec = [
    {r:2.42, y:2.30, tilt:[ 0.22, 0.00, 0.09], s:5, g:0.15, tw:14},
    {r:2.10, y:1.32, tilt:[-0.17, 0.62,-0.11], s:5, g:0.13, tw:10},
    {r:2.86, y:2.86, tilt:[ 0.12, 1.20, 0.20], s:4, g:0.11, tw:16}
  ];
  spec.forEach((k,i)=>{
    const g = makeRing(k.r, 0.0026, k.y, i%2 ? 0xffc078 : 0xffb862, 13.5*k.g,
                       {strands:k.s, turns:k.tw, spread:0.030, seg:520, radial:8});
    g.rotation.set(k.tilt[0], k.tilt[1], k.tilt[2]);
    g.userData.spin = (i%2?1:-1)*(0.010 + i*0.004);
    haloRings.push(g);
  });
}

/* =====================================================================
   6. the terraces
   ===================================================================== */
/* PolyhedronGeometry and MarchingCubes both hand back *non-indexed* meshes, so
   computeVertexNormals() gives every triangle its own normal and the silhouette
   reads as facets.  This averages normals across coincident positions while
   leaving the UV seams intact, which is what actually makes the rock look like
   rock instead of a die.                                                     */
function smoothNormals(geo, tol){
  geo.computeVertexNormals();
  const pos = geo.attributes.position, nor = geo.attributes.normal;
  const n = pos.count, q = 1/(tol||1e-4);
  const acc = new Map();
  const key = i => (Math.round(pos.getX(i)*q)+'_'+Math.round(pos.getY(i)*q)+'_'+Math.round(pos.getZ(i)*q));
  for(let i=0;i<n;i++){
    const k = key(i);
    let a = acc.get(k);
    if(!a){ a=[0,0,0]; acc.set(k,a); }
    a[0]+=nor.getX(i); a[1]+=nor.getY(i); a[2]+=nor.getZ(i);
  }
  for(let i=0;i<n;i++){
    const a = acc.get(key(i));
    const l = Math.hypot(a[0],a[1],a[2]) || 1;
    nor.setXYZ(i, a[0]/l, a[1]/l, a[2]/l);
  }
  nor.needsUpdate = true;
  return geo;
}

// bake a vertical falloff into vertex colours so the mass dissolves downward
function depthFade(geo, offsetY, y0, y1){
  const pos=geo.attributes.position, n=pos.count;
  const col=new Float32Array(n*3);
  for(let i=0;i<n;i++){
    const wy=pos.getY(i)+offsetY;
    let k=(wy-y0)/(y1-y0); k=Math.max(0,Math.min(1,k));
    k=Math.pow(k,0.75);
    const v=0.34+0.66*k;
    col[i*3]=col[i*3+1]=col[i*3+2]=v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  return geo;
}

function erode(geo, opts){
  const o = Object.assign({amp:.05, freq:1.6, strata:0, strataAmp:0, seed:0},opts||{});
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const n  = fbm3(v.x*o.freq+o.seed, v.y*o.freq*1.6+o.seed, v.z*o.freq+o.seed, 4, 2.1, .55);
    const n2 = fbm3(v.x*o.freq*4.3+11, v.y*o.freq*6.1, v.z*o.freq*4.3, 3, 2.05, .5);
    const n3 = fbm3(v.x*o.freq*13.0+29, v.y*o.freq*17.0, v.z*o.freq*13.0, 2);
    let d = n*o.amp + n2*o.amp*0.34 + n3*o.amp*0.12;
    if(o.strata){
      const band = Math.sin(v.y*o.strata + fbm3(v.x*.9,v.y*.4,v.z*.9,2)*2.2);
      d += band*o.strataAmp;
    }
    const dir = v.clone().normalize();
    v.addScaledVector(dir, d);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

const stoneMat = new THREE.MeshStandardMaterial({
  map:STONE.map, normalMap:STONE.normalMap, roughnessMap:STONE.ormMap, aoMap:STONE.ormMap, aoMapIntensity:0.9,
  normalScale:new THREE.Vector2(1.15,1.15),
  color:0x93918e, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.52,
});
addDetailNormal(stoneMat, 9.0, 0.65);

/* ---------------------------------------------------------------------
   Box-projected UVs for the shrine's built work.

   BoxGeometry lays one whole copy of the map on each face however long or
   short that face is, which is right for the bluff — the stretch is where
   its long cracks come from — and wrong for four hundred small members,
   where it would put the whole 2k map on every peg.  Choosing the axis
   from which face the vertex sits on (rather than from its normal, which
   the displacement has already bent) and scaling by world size instead
   gives the joinery one texel density from ridge beam to flagstone.
   --------------------------------------------------------------------- */
function boxUV(geo, hx, hy, hz, scale, ox, oy){
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
    const ex=Math.abs(x)/hx, ey=Math.abs(y)/hy, ez=Math.abs(z)/hz;
    let u,v;
    if(ey>=ex && ey>=ez){ u=x; v=z; }
    else if(ex>=ez)     { u=z; v=y; }
    else                { u=x; v=y; }
    uv[i*2]   = u*scale + (ox||0);
    uv[i*2+1] = v*scale + (oy||0);
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  return geo;
}

function tintGeo(geo, v){
  const n = geo.attributes.position.count;
  const c = new Float32Array(n*3); c.fill(v);
  geo.setAttribute('color', new THREE.BufferAttribute(c,3));
  return geo;
}

const plinth = new THREE.Group();
scene.add(plinth);

/* ---------------------------------------------------------------------
   The bluff, cut to two levels.

   A shrine is an approach before it is a building: you pass the gate on
   the low ground, climb, and only then stand in front of the hall.  So
   this rock is quarried into two terraces rather than left as one shelf —
   the upper one carrying the precinct, the lower one the gate — and the
   step between them is where the stair goes.  Everything else is the
   orrery's own bedded limestone, eroded on the same seeds.
   --------------------------------------------------------------------- */
const TER_LO = -0.245;                     // the lower terrace, in bluff-top units
const TER_SPLIT = 0.30;                    // where the upper terrace breaks off

function terrace(w, h, d, cx, cy, seed, lipEdge){
  const g = new THREE.BoxGeometry(w, h, d, Math.round(w*84), Math.round(h*120), Math.round(d*84));
  const pos=g.attributes.position, v=new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const n = fbm3(v.x*3.4+seed, v.y*7.0, v.z*3.4+2, 4, 2.1, .55);
    const edge = Math.max(Math.abs(v.x)/(w*0.5), Math.abs(v.z)/(d*0.5));
    const k = Math.pow(Math.max(0,edge-0.55)/0.45, 1.4);
    v.x += n*lipEdge*k; v.z += n*lipEdge*k;
    // the ground the shrine stands on stays nearly flat; only the lip is chewed
    v.y += n*0.013*(0.16+k*1.5) + (v.y>0 ? 0 : -0.017*Math.abs(n));
    pos.setXYZ(i,v.x,v.y,v.z);
  }
  g.computeVertexNormals();
  depthFade(g, cy, Y_PLINTH-3.1, Y_PLINTH-0.05);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(cx, cy, 0);
  plinth.add(m);
  return m;
}

// the upper terrace: lip, then the slab it overhangs
terrace(1.86, 0.19, 1.58, -0.53, Y_PLINTH-0.095, 7.0, 0.070);
{
  const g = new THREE.BoxGeometry(1.74,0.74,1.44, 150,64,124);
  erode(g,{amp:.030, freq:2.6, strata:22.0, strataAmp:.010, seed:3.1});
  depthFade(g, Y_PLINTH-0.56, Y_PLINTH-3.1, Y_PLINTH-0.05);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(-0.55, Y_PLINTH-0.56, 0);
  plinth.add(m);
}
// the lower terrace, tucked under the break
terrace(1.48, 0.17, 1.40, 0.72, Y_PLINTH+TER_LO-0.085, 21.0, 0.062);
{
  const g = new THREE.BoxGeometry(1.38,0.60,1.26, 122,54,110);
  erode(g,{amp:.028, freq:2.9, strata:22.0, strataAmp:.010, seed:8.7});
  depthFade(g, Y_PLINTH+TER_LO-0.47, Y_PLINTH-3.1, Y_PLINTH-0.05);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(0.74, Y_PLINTH+TER_LO-0.47, 0);
  plinth.add(m);
}
// one mass under both, and the broken base tapering away into the dark
{
  const g = new THREE.BoxGeometry(2.80,0.50,1.62, 190,44,120);
  {  // round the beam's leading edge so it reads as a moulding, not a shelf
    const pos=g.attributes.position, v=new THREE.Vector3();
    for(let i=0;i<pos.count;i++){
      v.fromBufferAttribute(pos,i);
      const ry=Math.abs(v.y)/0.25, rz=Math.abs(v.z)/0.81;
      const r=Math.min(1,Math.hypot(ry,rz));
      const k=Math.pow(r,3.0)*0.22;
      v.y*=1-k; v.z*=1-k;
      pos.setXYZ(i,v.x,v.y,v.z);
    }
    g.computeVertexNormals();
  }
  erode(g,{amp:.032, freq:3.2, strata:22.0, strataAmp:.010, seed:12.4});
  depthFade(g, Y_PLINTH-1.16, Y_PLINTH-3.0, Y_PLINTH-0.05);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(-0.06, Y_PLINTH-1.16, 0);
  plinth.add(m);
}
{
  const g = new THREE.BoxGeometry(2.52,0.92,1.30, 150,60,90);
  erode(g,{amp:.11, freq:2.1, strata:11.0, strataAmp:.022, seed:21.4});
  const p=g.attributes.position, v=new THREE.Vector3();
  for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i);
    const k=(0.46-v.y)/0.92; v.x*=1-0.34*k; v.z*=1-0.34*k; p.setXYZ(i,v.x,v.y,v.z); }
  g.computeVertexNormals();
  depthFade(g, Y_PLINTH-1.73, Y_PLINTH-2.5, Y_PLINTH-0.7);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(-0.08, Y_PLINTH-1.73, 0);
  m.rotation.y = .14;
  plinth.add(m);
}
{
  const g = rockGeometry(5, 44, 0.86);
  g.scale(0.60,0.60,0.60);
  erode(g,{amp:.14, freq:2.4, seed:44.2});
  smoothNormals(g, 2e-4);
  depthFade(g, Y_PLINTH-2.40, Y_PLINTH-2.8, Y_PLINTH-1.3);
  const m = new THREE.Mesh(g, stoneMat);
  m.castShadow = m.receiveShadow = true;
  m.position.set(-0.02, Y_PLINTH-2.40, -0.04);
  m.scale.set(1.22,0.86,1.08);
  plinth.add(m);
}

/* =====================================================================
   7. the shrine
   ===================================================================== */
/* Four materials over the two baked sets the page already carries.  The
   dressed stone is the marble the orrery's lantern was cut from, dropped
   in value so it reads as good limestone; the timber is the same marble
   again, greyed right down — unpainted cypress weathers to almost exactly
   that; the roof is the coarse rubble set, near-black, standing in for
   layered bark; and the lacquer is the one saturated thing in the whole
   family, because a shrine gate that is not vermilion is not a shrine
   gate.                                                                  */
const marbleMat = new THREE.MeshStandardMaterial({
  map:MARBLE.map, normalMap:MARBLE.normalMap, roughnessMap:MARBLE.ormMap, aoMap:MARBLE.ormMap, aoMapIntensity:0.75,
  normalScale:new THREE.Vector2(1.9,1.9),
  color:0xa8a29a, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.42,
});
addDetailNormal(marbleMat, 14.0, 0.60);

const timberMat = new THREE.MeshStandardMaterial({
  map:MARBLE.map, normalMap:MARBLE.normalMap, roughnessMap:MARBLE.ormMap, aoMap:MARBLE.ormMap, aoMapIntensity:0.8,
  normalScale:new THREE.Vector2(1.4,1.4),
  color:0x6e6558, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.30,
});
addDetailNormal(timberMat, 22.0, 0.75);

const roofMat = new THREE.MeshStandardMaterial({
  map:RUBBLE.map, normalMap:RUBBLE.normalMap, roughnessMap:RUBBLE.ormMap, aoMap:RUBBLE.ormMap, aoMapIntensity:0.95,
  normalScale:new THREE.Vector2(2.1,2.1),
  color:0x463e35, roughness:1.0, metalness:0.0, vertexColors:true,
  envMapIntensity:0.26,
});
addDetailNormal(roofMat, 11.0, 0.85);

const lacquerMat = new THREE.MeshStandardMaterial({
  normalMap:MARBLE.normalMap, roughnessMap:MARBLE.ormMap,
  normalScale:new THREE.Vector2(0.55,0.55),
  color:0x76251a, roughness:0.62, metalness:0.0, vertexColors:true,
  envMapIntensity:0.72,
});

const paperMat = new THREE.MeshStandardMaterial({
  color:0xe8e2d6, roughness:0.86, metalness:0.0, vertexColors:true,
  side:THREE.DoubleSide, envMapIntensity:0.5,
});

const shrine = new THREE.Group();
shrine.position.set(0.00, Y_PLINTH, 0.00);
scene.add(shrine);

/* ---------------------------------------------------------------------
   Merging.  A shrine is four hundred small members — posts, rails, slats,
   flagstones, billets — and four hundred meshes would be four hundred
   draw calls, so every member is built in its own space, carried into
   place by a matrix, and baked down into one buffer per material.
   --------------------------------------------------------------------- */
function mergeGeos(list){
  const parts = list.map(g => g.index ? g.toNonIndexed() : g);
  let n = 0;
  for(const g of parts) n += g.attributes.position.count;
  const pos = new Float32Array(n*3), nor = new Float32Array(n*3);
  const uv  = new Float32Array(n*2), col = new Float32Array(n*3);
  let o = 0;
  for(const g of parts){
    const a = g.attributes;
    pos.set(a.position.array, o*3);
    nor.set(a.normal.array,   o*3);
    uv .set(a.uv.array,       o*2);
    if(a.color) col.set(a.color.array, o*3); else col.fill(1, o*3, (o+a.position.count)*3);
    o += a.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos,3));
  out.setAttribute('normal',   new THREE.BufferAttribute(nor,3));
  out.setAttribute('uv',       new THREE.BufferAttribute(uv,2));
  out.setAttribute('color',    new THREE.BufferAttribute(col,3));
  return out;
}

/* Same idea as boxUV, but keyed off the face normal — for swept members
   and lathes, where there is no box to measure extents against.          */
function normalUV(geo, scale, ox, oy){
  if(!geo.attributes.normal) geo.computeVertexNormals();
  const pos = geo.attributes.normal ? geo.attributes.position : null;
  const nor = geo.attributes.normal;
  const uv = new Float32Array(pos.count*2);
  for(let i=0;i<pos.count;i++){
    const nx=Math.abs(nor.getX(i)), ny=Math.abs(nor.getY(i)), nz=Math.abs(nor.getZ(i));
    let u,v;
    if(ny>=nx && ny>=nz){ u=pos.getX(i); v=pos.getZ(i); }
    else if(nx>=nz)     { u=pos.getZ(i); v=pos.getY(i); }
    else                { u=pos.getX(i); v=pos.getY(i); }
    uv[i*2]   = u*scale + (ox||0);
    uv[i*2+1] = v*scale + (oy||0);
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv,2));
  return geo;
}

const _q1 = new THREE.Quaternion(), _e1 = new THREE.Euler(), _p1 = new THREE.Vector3();
const _one = new THREE.Vector3(1,1,1), _m1 = new THREE.Matrix4();
function place(out, geo, x,y,z, rx,ry,rz, tint){
  const g = geo.clone();
  _e1.set(rx,ry,rz,'YXZ'); _q1.setFromEuler(_e1); _p1.set(x,y,z);
  g.applyMatrix4(_m1.compose(_p1,_q1,_one));
  tintGeo(g, tint===undefined ? 1 : tint);
  out.push(g);
  return g;
}

const DRESS = [], TIMBER = [], LACQUER = [], ROOF = [], PAPER = [];

/* A squared member: a box with the arris taken off and a little fbm, so
   nothing in the joinery reads as a primitive.                           */
const memberCache = new Map();
function member(w,h,d,seed,wear){
  const key = w.toFixed(3)+':'+h.toFixed(3)+':'+d.toFixed(3)+':'+seed+':'+wear.toFixed(2);
  const hit = memberCache.get(key);
  if(hit) return hit;
  const g = new THREE.BoxGeometry(w,h,d, 3,3,3);
  const pos = g.attributes.position, v = new THREE.Vector3(), dir = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const ex = Math.abs(v.x)/(w*0.5), ey = Math.abs(v.y)/(h*0.5), ez = Math.abs(v.z)/(d*0.5);
    const arris = Math.pow(Math.max(0,(ex+ey+ez-1.5)/1.5), 1.25);
    const n1 = fbm3(v.x*17.0+seed*3.7, v.y*17.0+seed, v.z*17.0+seed*1.9, 3, 2.1, .55);
    dir.copy(v).normalize();
    v.multiplyScalar(1 - arris*0.09*wear);
    v.addScaledVector(dir, n1*0.006*wear);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  boxUV(g, w*0.5, h*0.5, d*0.5, 5.0, (seed*0.37)%1, (seed*0.71)%1);
  memberCache.set(key, g);
  return g;
}

/* A turned post: entasis, because a cylinder of constant radius reads as
   pipe and a post that swells slightly at the foot reads as timber.      */
function turned(rBase, rTop, h, seg){
  const pts = [];
  const N = 9;
  for(let i=0;i<=N;i++){
    const u = i/N;
    const r = rBase + (rTop-rBase)*u - Math.sin(u*Math.PI)*rBase*0.055;
    pts.push(new THREE.Vector2(r, u*h));
  }
  const g = new THREE.LatheGeometry(pts, seg||18);
  normalUV(g, 5.0, 0.2, 0.4);
  return g;
}

/* ---------------------------------------------------------------------
   The roof.

   This is the whole building, really; the rest is posts holding it up.
   A grid over the plan displaced by one height function, doubled downward
   into a shell and skirted round the edge.  The height function carries
   the shape: a slope that is steepest at the ridge and flattens as it
   falls, an eave that turns up over the last fifth of its run, and gable
   ends that lift with it, so the four corners are the high points of the
   edge and the eave line dips between them.  That reverse curve is the
   difference between a Japanese roof and a tent.
   --------------------------------------------------------------------- */
function roofY(x, z, o){
  const t = Math.min(1, Math.abs(x)/o.hx);        // 0 at the ridge, 1 at the eave
  const s = Math.min(1, Math.abs(z)/o.hz);        // 0 mid-span, 1 at the gable
  /* Steep at the ridge and flattening as it falls — that is the concave
     slope.  Then the lift, which belongs to the eave alone: gated by t so
     the ridge stays dead level, and strongest at s=1 so the four corners
     are the high points of the edge and the eave line dips between them. */
  return o.rise*Math.pow(1-t, 1.5)
       + o.lift*(0.34 + 0.66*Math.pow(s, 2.0))*Math.pow(t, 2.4);
}
function roofShell(o){
  const NX = o.nx||44, NZ = o.nz||36, rows = NZ+1;
  const pos = [], uv = [], idx = [];
  const S = o.uv || 2.2;
  const px = i => (-1 + 2*i/NX)*o.hx, pz = j => (-1 + 2*j/NZ)*o.hz;
  const add = (x,y,z,u,v) => { pos.push(x,y,z); uv.push(u,v); return pos.length/3 - 1; };
  const topBase = pos.length/3;
  for(let i=0;i<=NX;i++) for(let j=0;j<=NZ;j++){
    const x=px(i), z=pz(j);
    add(x, roofY(x,z,o), z, x*S, z*S);
  }
  const botBase = pos.length/3;
  for(let i=0;i<=NX;i++) for(let j=0;j<=NZ;j++){
    const x=px(i), z=pz(j);
    add(x, roofY(x,z,o)-o.thick, z, x*S, z*S);
  }
  for(let i=0;i<NX;i++) for(let j=0;j<NZ;j++){
    const a=topBase+i*rows+j, b=a+rows, c=b+1, d=a+1;
    idx.push(a,d,b, b,d,c);                                  // up
    const e=botBase+i*rows+j, f=e+rows, g2=f+1, h=e+1;
    idx.push(e,f,h, f,g2,h);                                 // down
  }
  // the edge, walked counter-clockwise seen from above
  const ring = [];
  for(let i=0;i<NX;i++) ring.push([i,0]);
  for(let j=0;j<NZ;j++) ring.push([NX,j]);
  for(let i=NX;i>0;i--) ring.push([i,NZ]);
  for(let j=NZ;j>0;j--) ring.push([0,j]);
  let run = 0;
  for(let k=0;k<ring.length;k++){
    const [i0,j0] = ring[k], [i1,j1] = ring[(k+1)%ring.length];
    const x0=px(i0), z0=pz(j0), x1=px(i1), z1=pz(j1);
    const y0=roofY(x0,z0,o), y1=roofY(x1,z1,o);
    const seg = Math.hypot(x1-x0, z1-z0);
    const tA = add(x0,y0,z0, run*S, y0*S);
    const tB = add(x1,y1,z1, (run+seg)*S, y1*S);
    const bA = add(x0,y0-o.thick,z0, run*S, (y0-o.thick)*S);
    const bB = add(x1,y1-o.thick,z1, (run+seg)*S, (y1-o.thick)*S);
    idx.push(tA,tB,bA, tB,bB,bA);
    run += seg;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos),3));
  g.setAttribute('uv',       new THREE.BufferAttribute(new Float32Array(uv),2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/* Sweep a rectangular section along a polyline: the gate's top lintel,
   and the rail of the veranda.  Built as a soup so the four faces keep
   their arrises instead of rounding into a tube.                         */
function loft(pts, w, h){
  const n = pts.length, out = [];
  const T = new THREE.Vector3(), up = new THREE.Vector3(0,1,0);
  const frames = [];
  for(let i=0;i<n;i++){
    T.subVectors(pts[Math.min(n-1,i+1)], pts[Math.max(0,i-1)]).normalize();
    const s = new THREE.Vector3().crossVectors(T, up);
    if(s.lengthSq() < 1e-9) s.set(1,0,0); else s.normalize();
    const u = new THREE.Vector3().crossVectors(s, T).normalize();
    frames.push([s,u]);
  }
  const corner = (i, a, b) => {
    const [s,u] = frames[i];
    return new THREE.Vector3().copy(pts[i]).addScaledVector(s, a*w*0.5).addScaledVector(u, b*h*0.5);
  };
  const C = [[-1,-1],[1,-1],[1,1],[-1,1]];
  const pos = [];
  const quad = (p0,p1,p2,p3) => { pos.push(p0.x,p0.y,p0.z, p1.x,p1.y,p1.z, p2.x,p2.y,p2.z,
                                           p0.x,p0.y,p0.z, p2.x,p2.y,p2.z, p3.x,p3.y,p3.z); };
  for(let i=0;i<n-1;i++) for(let k=0;k<4;k++){
    const a=C[k], b=C[(k+1)%4];
    quad(corner(i,a[0],a[1]), corner(i,b[0],b[1]), corner(i+1,b[0],b[1]), corner(i+1,a[0],a[1]));
  }
  quad(corner(0,C[3][0],C[3][1]), corner(0,C[2][0],C[2][1]), corner(0,C[1][0],C[1][1]), corner(0,C[0][0],C[0][1]));
  quad(corner(n-1,C[0][0],C[0][1]), corner(n-1,C[1][0],C[1][1]), corner(n-1,C[2][0],C[2][1]), corner(n-1,C[3][0],C[3][1]));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos),3));
  g.computeVertexNormals();
  normalUV(g, 5.0, 0.3, 0.7);
  return g;
}

/* ---- the gate --------------------------------------------------------
   Two columns raked inward, a through-beam, and a lintel that lifts at
   both ends.  Nothing else; a torii is the least building that can still
   mark a threshold.                                                      */
const TORII = { x:0.98, y:TER_LO, half:0.415, h:0.80 };
{
  const T = TORII, pr = mulberry32(4410);
  const RAKE = 0.030;                                  // columns lean in
  for(const sign of [-1, 1]){
    const g = turned(0.0355, 0.0295, T.h, 20);
    place(LACQUER, g, T.x, T.y, sign*T.half, 0, 0, -sign*RAKE, 1.0);
    // the packed stone the column stands in
    const b = new THREE.LatheGeometry([
      new THREE.Vector2(0.000,0.000), new THREE.Vector2(0.072,0.000),
      new THREE.Vector2(0.068,0.030), new THREE.Vector2(0.044,0.048),
      new THREE.Vector2(0.000,0.050)
    ], 22);
    normalUV(b, 5.0, 0.4, 0.1);
    place(DRESS, b, T.x, T.y-0.006, sign*T.half, 0, pr()*3, 0, 1.02);
  }
  // nuki: the beam that passes through both columns
  place(LACQUER, member(0.052, 0.046, T.half*2 + 0.13, 3, 0.5),
        T.x, T.y + T.h*0.72, 0, 0, 0, 0, 1.02);
  // shimaki: the shallow beam the lintel sits on
  place(LACQUER, member(0.066, 0.034, T.half*2 + 0.20, 4, 0.5),
        T.x, T.y + T.h - 0.026, 0, 0, 0, 0, 1.02);
  // gakuzuka: the short strut between them
  place(LACQUER, member(0.038, T.h*0.20, 0.052, 5, 0.5),
        T.x, T.y + T.h*0.855, 0, 0, 0, 0, 1.04);
  // kasagi: the lintel, curved, lifting at both ends
  {
    const pts = [];
    const span = T.half + 0.135;
    for(let i=0;i<=26;i++){
      const u = -1 + 2*i/26;
      const z = u*span;
      const y = T.y + T.h + 0.020 + Math.pow(Math.abs(u), 3.4)*0.075;
      pts.push(new THREE.Vector3(T.x, y, z));
    }
    place(LACQUER, loft(pts, 0.084, 0.040), 0,0,0, 0,0,0, 1.06);
  }
}

/* ---- the rope --------------------------------------------------------
   Three strands laid up around a sag, which is all a shimenawa is, plus
   the folded papers hung off it.                                         */
{
  const T = TORII;
  const y0 = T.y + T.h*0.72 - 0.030, span = 0.30, sag = 0.055;
  for(let s=0;s<3;s++){
    const pts = [];
    for(let i=0;i<=40;i++){
      const u = i/40, z = (-1 + 2*u)*span;
      const a = s*Math.PI*2/3 + u*Math.PI*5.2;
      const rad = 0.019*(0.55 + 0.45*Math.sin(u*Math.PI));   // thicker in the middle
      pts.push(new THREE.Vector3(
        T.x + Math.cos(a)*rad,
        y0 - Math.sin(u*Math.PI)*sag + Math.sin(a)*rad,
        z));
    }
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.0125, 7, false);
    normalUV(g, 6.0, s*0.31, 0.2);
    place(PAPER, g, 0,0,0, 0,0,0, 0.86);
  }
  for(const z of [-0.17, 0.0, 0.17]){
    const drop = 0.075;
    place(PAPER, member(0.001, drop, 0.030, 9, 0.2),
          T.x, y0 - Math.sin((z/span*0.5+0.5)*Math.PI)*sag - drop*0.5 - 0.012, z, 0,0,0, 1.06);
  }
}

/* ---- the approach ----------------------------------------------------- */
{
  const pr = mulberry32(8801);
  for(let r=0;r<9;r++){
    const x = 0.84 - r*0.058;
    for(const side of [-1, 1]){
      const w = 0.050 + pr()*0.010, d = 0.130 + pr()*0.026;
      place(DRESS, member(w, 0.016, d, 10+(r%5), 1.2),
            x + (pr()-0.5)*0.008, TER_LO + 0.006, side*(0.072 + pr()*0.012),
            0, (pr()-0.5)*0.05, 0, 0.95 + pr()*0.10);
    }
  }
  // the stair up to the precinct
  const N = 5;
  for(let i=0;i<N;i++){
    const rise = (0 - TER_LO)/N;
    place(DRESS, member(0.062, rise, 0.46, 20+i, 0.7),
          0.335 - i*0.046, TER_LO + rise*(i+0.5), 0, 0, 0, 0, 1.04);
  }
}

/* ---- the lanterns ----------------------------------------------------
   The orrery's own stone lantern, at two fifths of its height and set out
   in a pair, because the thing the reference put alone on a rock is a
   shrine fitting and always was.                                         */
function stoneLantern(out, cx, cy, cz, S, rotY, lit){
  const M = new THREE.Matrix4().compose(
    new THREE.Vector3(cx,cy,cz),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
    new THREE.Vector3(1,1,1));
  const part = (profile, seg, tint) => {
    const g = new THREE.LatheGeometry(profile.map(p => new THREE.Vector2(p[0]*S, p[1]*S)), seg);
    normalUV(g, 5.4, 0.3, 0.55);
    g.applyMatrix4(M);
    tintGeo(g, tint);
    out.push(g);
    return g;
  };
  part([[0.000,0.000],[0.250,0.000],[0.252,0.018],[0.236,0.030],[0.212,0.038],
        [0.206,0.062],[0.186,0.074],[0.150,0.082],[0.104,0.086],[0.078,0.092],[0.000,0.094]], 26, 1.00);
  part([[0.000,0.086],[0.082,0.088],[0.078,0.120],[0.092,0.132],[0.090,0.148],[0.074,0.160],
        [0.072,0.236],[0.088,0.250],[0.086,0.266],[0.072,0.278],[0.074,0.352],[0.000,0.356]], 22, 1.02);
  part([[0.000,0.348],[0.096,0.352],[0.140,0.368],[0.176,0.386],[0.190,0.404],
        [0.184,0.424],[0.160,0.436],[0.150,0.452],[0.128,0.460],[0.000,0.462]], 24, 1.04);
  const Y0 = 0.462, Y1 = 0.660;
  part([[0.000,Y0-0.010],[0.168,Y0-0.008],[0.172,Y0+0.014],[0.150,Y0+0.022],[0.000,Y0+0.024]], 6, 1.02);
  part([[0.000,Y1-0.026],[0.152,Y1-0.024],[0.176,Y1-0.006],[0.172,Y1+0.010],[0.000,Y1+0.012]], 6, 1.02);
  for(let i=0;i<6;i++){
    const a = i/6*Math.PI*2 + Math.PI/6;
    const g = member(0.040*S, (Y1-Y0-0.020)*S, 0.052*S, 30+i, 0.5).clone();
    g.applyMatrix4(new THREE.Matrix4().compose(
      new THREE.Vector3(Math.cos(a)*0.150*S, (Y0+Y1)/2*S, Math.sin(a)*0.150*S),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -a, 0)),
      new THREE.Vector3(1,1,1)));
    g.applyMatrix4(M);
    tintGeo(g, 1.0);
    out.push(g);
  }
  // kasa: the flared cap, with its corners lifted
  {
    const prof = [[0.000,0.652],[0.104,0.658],[0.176,0.676],[0.262,0.700],[0.318,0.718],
                  [0.330,0.730],[0.274,0.736],[0.196,0.748],[0.120,0.766],[0.062,0.784],[0.000,0.792]];
    const g = new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0]*S, p[1]*S)), 6);
    const pos = g.attributes.position, v = new THREE.Vector3(), RMAX = 0.330*S;
    for(let i=0;i<pos.count;i++){
      v.fromBufferAttribute(pos,i);
      const r = Math.hypot(v.x, v.z);
      if(r < 1e-5) continue;
      const th = Math.atan2(v.z, v.x);
      const k = Math.pow(Math.min(1, r/RMAX), 2.4);
      v.y += k*(Math.cos(6.0*th)*0.055 - 0.014)*S;
      const spread = 1 + k*Math.cos(6.0*th)*0.10;
      v.x *= spread; v.z *= spread;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    smoothNormals(g, 1e-4);
    normalUV(g, 5.4, 0.6, 0.1);
    g.applyMatrix4(M);
    tintGeo(g, 1.04);
    out.push(g);
  }
  part([[0.000,0.782],[0.058,0.788],[0.066,0.802],[0.054,0.818],[0.062,0.836],
        [0.052,0.868],[0.030,0.900],[0.012,0.928],[0.000,0.936]], 18, 1.06);
  return new THREE.Vector3(cx, cy + (Y0+Y1)/2*S, cz);
}
const LANTERN_S = 0.46;
const firePoints = [
  stoneLantern(DRESS, 0.60, TER_LO, -0.44, LANTERN_S, 0.42, true),
  stoneLantern(DRESS, 0.60, TER_LO,  0.44, LANTERN_S, -0.30, true),
];

/* ---- the pair at the stair head --------------------------------------
   Komainu.  At this size they are a silhouette and nothing more — a
   seated haunch, a chest, a maned head — so they are built as a handful
   of displaced blobs rather than modelled, which is also roughly how they
   were carved.                                                           */
function komainu(out, cx, cy, cz, face, seed){
  const pr = mulberry32(seed);
  const blob = (r, detail, squash, wobble) => {
    const g = new THREE.IcosahedronGeometry(r, detail);
    const pos = g.attributes.position, v = new THREE.Vector3();
    for(let i=0;i<pos.count;i++){
      v.fromBufferAttribute(pos,i);
      const n = fbm3(v.x*14+seed, v.y*14, v.z*14, 3, 2.1, .55);
      v.multiplyScalar(1 + n*wobble);
      v.y *= squash;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    smoothNormals(g, 2e-4);
    normalUV(g, 5.4, pr(), pr());
    return g;
  };
  const put = (g, x,y,z, sx,sy,sz, tint) => {
    const c = g.clone();
    c.applyMatrix4(new THREE.Matrix4().compose(
      new THREE.Vector3(cx + face*x, cy + y, cz + z),
      new THREE.Quaternion(),
      new THREE.Vector3(sx===undefined?1:sx, sy===undefined?1:sy, sz===undefined?1:sz)));
    tintGeo(c, tint===undefined?1:tint);
    out.push(c);
  };
  // plinth
  place(out, member(0.088, 0.062, 0.088, 60, 0.6), cx, cy+0.031, cz, 0,0,0, 1.02);
  const B = 0.062;
  put(blob(B, 3, 0.74, 0.10), -0.030, 0.090, 0, 1.15, 1.0, 0.82, 0.74);    // haunch
  put(blob(B*0.72, 3, 1.15, 0.10), 0.020, 0.124, 0, 0.95, 1.0, 0.84, 0.76); // chest
  put(blob(B*0.46, 3, 0.95, 0.18), 0.046, 0.172, 0, 1.05, 1.0, 1.0, 0.78);  // maned head
  put(blob(B*0.22, 2, 0.80, 0.06), 0.080, 0.166, 0, 1.5, 0.8, 0.8, 0.80);   // muzzle
  put(blob(B*0.30, 3, 1.45, 0.18), -0.062, 0.148, 0, 0.7, 1.0, 0.7, 0.74);  // tail
  for(const s of [-1, 1]){
    const leg = new THREE.CylinderGeometry(0.0085, 0.0115, 0.056, 10);
    normalUV(leg, 5.4, pr(), pr());
    place(out, leg, cx + face*0.058, cy + 0.088, cz + s*0.019, 0,0,0, 0.76);
    put(blob(B*0.11, 1, 0.9, 0.10), 0.040, 0.202, s*0.019, 1.0, 1.4, 0.7, 0.80); // ears
  }
}
komainu(DRESS, 0.06, 0.0, -0.33,  1, 2201);
komainu(DRESS, 0.06, 0.0,  0.33,  1, 9902);

/* ---- the hall --------------------------------------------------------- */
const HALL = { x:-0.56, deck:0.10, hx:0.42, hz:0.36, post:0.30 };
{
  const H = HALL;
  // kidan: the stone podium, and its moulding
  place(DRESS, member(H.hx*2+0.18, H.deck, H.hz*2+0.18, 70, 0.8), H.x, H.deck*0.5, 0, 0,0,0, 1.00);
  place(DRESS, member(H.hx*2+0.24, 0.022, H.hz*2+0.24, 71, 0.6), H.x, H.deck-0.011, 0, 0,0,0, 1.05);
  // the deck, and the veranda that runs round it
  place(TIMBER, member(H.hx*2+0.14, 0.030, H.hz*2+0.14, 72, 0.5), H.x, H.deck+0.015, 0, 0,0,0, 1.02);
  // posts
  const postXs = [-H.hx, 0, H.hx], postZs = [-H.hz, 0, H.hz];
  for(const px of postXs) for(const pz of postZs){
    if(px === 0 && pz === 0) continue;
    if(px === 0 || pz === 0){ if(Math.abs(px) !== H.hx && Math.abs(pz) !== H.hz) continue; }
    const g = turned(0.0225, 0.0195, H.post, 16);
    place(LACQUER, g, H.x+px, H.deck+0.030, pz, 0,0,0, 1.0);
  }
  // plank walls on three sides, and the head beam that ties the posts
  const wallY = H.deck + 0.030 + H.post*0.5;
  const wallH = H.post - 0.045;
  /* Boarded, not panelled: a flat plane at this size reads as cardboard, so
     each wall is laid up out of vertical planks with a shadow between.    */
  const plank = (len, along, cx, cz, rot, seed) => {
    const n = Math.max(3, Math.round(len/0.062));
    for(let i=0;i<n;i++){
      const u = (-1 + 2*(i+0.5)/n)*(len*0.5 - 0.008);
      const g = member(len/n - 0.005, wallH, 0.020, seed+i%5, 0.35);
      place(TIMBER, g, cx + (rot ? 0 : u), wallY, cz + (rot ? u : 0), 0, 0, 0,
            0.92 + ((i*37)%7)/7*0.10);
    }
  };
  for(const s of [-1, 1]) plank(H.hx*2-0.03, 'x', H.x, s*H.hz, false, 73);
  plank(H.hz*2-0.03, 'z', H.x-H.hx, 0, true, 78);
  // the front: a lattice door, and the sill and lintel it sits between
  place(LACQUER, member(0.026, 0.020, H.hz*2+0.02, 75, 0.4), H.x+H.hx, H.deck+0.038, 0, 0,0,0, 1.02);
  place(LACQUER, member(0.026, 0.022, H.hz*2+0.02, 76, 0.4), H.x+H.hx, H.deck+0.030+H.post-0.014, 0, 0,0,0, 1.02);
  for(let i=0;i<9;i++){
    const z = -H.hz*0.86 + (i/8)*H.hz*1.72;
    place(LACQUER, member(0.012, wallH-0.02, 0.012, 77+i%3, 0.3), H.x+H.hx, wallY, z, 0,0,0, 1.0);
  }
  // kouran: the veranda rail, its posts and their finials
  const railY = H.deck + 0.030;
  const RX = H.hx+0.066, RZ = H.hz+0.066;
  const railPts = [];
  for(const [ax,az] of [[-RX,-RZ],[RX,-RZ],[RX,RZ],[-RX,RZ],[-RX,-RZ]]) railPts.push([ax,az]);
  for(let k=0;k<4;k++){
    const [x0,z0] = railPts[k], [x1,z1] = railPts[k+1];
    const n = Math.max(2, Math.round(Math.hypot(x1-x0, z1-z0)/0.105));
    for(let i=0;i<=n;i++){
      const u = i/n, x = x0+(x1-x0)*u, z = z0+(z1-z0)*u;
      if(x > RX-0.02 && Math.abs(z) < H.hz*0.6) continue;      // the way in
      place(LACQUER, member(0.014, 0.072, 0.014, 80+i%4, 0.3), H.x+x, railY+0.036, z, 0,0,0, 1.0);
      if(i===0) place(LACQUER, new THREE.SphereGeometry(0.0115, 10, 8).clone(), H.x+x, railY+0.080, z, 0,0,0, 1.06);
    }
    const pts = [new THREE.Vector3(H.x+x0, railY+0.076, z0), new THREE.Vector3(H.x+x1, railY+0.076, z1)];
    place(LACQUER, loft(pts, 0.020, 0.014), 0,0,0, 0,0,0, 1.02);
  }
  // the roof, and everything that sits on its ridge
  const R = { hx:0.60, hz:0.52, rise:0.30, lift:0.062, thick:0.050 };
  const eave = H.deck + 0.030 + H.post + 0.006;
  {
    const g = roofShell(R);
    place(ROOF, g, H.x, eave, 0, 0,0,0, 1.0);
  }
  const ridgeY = eave + R.rise;
  place(ROOF, member(0.070, 0.038, R.hz*2*0.62, 90, 0.5), H.x, ridgeY+0.014, 0, 0,0,0, 1.10);
  for(let i=0;i<5;i++){                                   // katsuogi
    const z = (-1 + 2*i/4)*R.hz*0.44;
    const g = new THREE.CylinderGeometry(0.0195, 0.0175, 0.150, 12);
    normalUV(g, 5.4, i*0.2, 0.3);
    place(TIMBER, g, H.x, ridgeY+0.048, z, 0, 0, Math.PI/2, 1.06);
  }
  for(const s of [-1, 1]) for(const t of [-1, 1]){        // chigi
    const len = 0.235, lean = 0.34;
    const g = member(0.019, len, 0.030, 95, 0.4);
    place(TIMBER, g,
      H.x + t*Math.sin(lean)*len*0.34, ridgeY + Math.cos(lean)*len*0.34 + 0.010, s*R.hz*0.90,
      0, 0, -t*lean, 1.08);
  }
  // the fascia that closes the eave, and the rafter ends behind it
  {
    const NZ = 30;
    for(const sx of [-1, 1]){
      const pts = [];
      for(let j=0;j<=NZ;j++){
        const z = (-1 + 2*j/NZ)*R.hz;
        pts.push(new THREE.Vector3(H.x + sx*R.hx, eave + roofY(sx*R.hx, z, R) - R.thick - 0.008, z));
      }
      place(TIMBER, loft(pts, 0.024, 0.030), 0,0,0, 0,0,0, 1.02);
    }
    for(let j=0;j<16;j++){
      const z = (-1 + 2*(j+0.5)/16)*R.hz*0.97;
      for(const sx of [-1, 1]){
        const x = sx*(R.hx - 0.030);
        place(TIMBER, member(0.070, 0.016, 0.020, 96+j%4, 0.3),
          H.x + x, eave + roofY(x, z, R) - R.thick - 0.014, z, 0,0,0, 0.94);
      }
    }
  }
}

/* ---- tamagaki: the fence that says where the precinct starts ---------- */
{
  const H = HALL, X0 = H.x-0.60, X1 = H.x+0.66, Z = 0.62;
  const ring = [[X0,-Z],[X1,-Z],[X1,Z],[X0,Z],[X0,-Z]];
  for(let k=0;k<4;k++){
    const [x0,z0] = ring[k], [x1,z1] = ring[k+1];
    const n = Math.max(2, Math.round(Math.hypot(x1-x0, z1-z0)/0.165));
    for(let i=0;i<=n;i++){
      const u = i/n, x = x0+(x1-x0)*u, z = z0+(z1-z0)*u;
      if(x > X1-0.02 && Math.abs(z) < 0.20) continue;          // the gateway
      place(LACQUER, member(0.019, 0.118, 0.019, 100+i%4, 0.4), x, 0.059, z, 0,0,0, 0.94);
    }
    for(const ry of [0.042, 0.094]){
      if(k===1){                                              // split for the gateway
        for(const seg of [[-Z,-0.20],[0.20,Z]]){
          const pts = [new THREE.Vector3(x0, ry, seg[0]), new THREE.Vector3(x0, ry, seg[1])];
          place(LACQUER, loft(pts, 0.014, 0.018), 0,0,0, 0,0,0, 1.0);
        }
        continue;
      }
      const pts = [new THREE.Vector3(x0, ry, z0), new THREE.Vector3(x1, ry, z1)];
      place(LACQUER, loft(pts, 0.014, 0.018), 0,0,0, 0,0,0, 1.0);
    }
  }
}

const dressMesh = new THREE.Mesh(mergeGeos(DRESS), marbleMat);
const timberMesh = new THREE.Mesh(mergeGeos(TIMBER), timberMat);
const lacquerMesh = new THREE.Mesh(mergeGeos(LACQUER), lacquerMat);
const roofMesh = new THREE.Mesh(mergeGeos(ROOF), roofMat);
const paperMesh = new THREE.Mesh(mergeGeos(PAPER), paperMat);
for(const m of [dressMesh, timberMesh, lacquerMesh, roofMesh, paperMesh]){
  m.castShadow = m.receiveShadow = true;
  shrine.add(m);
}

/* --- the lights that are kept ------------------------------------------
   A flame in each lantern — the same emissive core the orrery kept, so
   the bloom catches it the same way — and one steady lamp inside the hall
   so the lattice reads as a lit doorway rather than a dark one.          */
const FLAME_I = 1.35;
const flameMat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
  uniforms:{ uColor:{value:new THREE.Color(0xffb257)}, uBoost:{value:11.5}, uTime:{value:0},
             uR:{value:1} },
  vertexShader:\`varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }\`,
  fragmentShader:\`
    varying vec3 vP; uniform vec3 uColor; uniform float uBoost, uTime, uR;
    void main(){
      /* The reference hard-coded the falloff in world units for one lantern
         a metre and a half tall.  These two lanterns are a third of that, so
         the same numbers are carried as fractions of the core radius.      */
      float r = length(vP.xz)/(uR*0.687);
      float h = clamp((vP.y + uR*0.763)/(uR*1.679), 0.0, 1.0);
      float body = pow(1.0-clamp(r,0.0,1.0), 1.6) * (0.35+0.65*(1.0-h));
      float flick = 0.88 + 0.12*sin(uTime*7.3) + 0.06*sin(uTime*17.7+1.3);
      gl_FragColor = vec4(uColor*uBoost*body*flick, body);
    }\`
});
const FLAME_R = 0.131*(LANTERN_S/1.14);
flameMat.uniforms.uR.value = FLAME_R;
const flameLights = [];
for(const p of firePoints){
  const f = new THREE.Mesh(new THREE.SphereGeometry(FLAME_R, 20, 14), flameMat);
  f.scale.set(1.0, 1.45, 1.0);
  f.position.copy(p);
  f.renderOrder = 5;
  shrine.add(f);
  const l = new THREE.PointLight(0xffbe7a, FLAME_I, 1.6, 2.0);
  l.position.copy(p);
  shrine.add(l);
  flameLights.push(l);
}
{
  const l = new THREE.PointLight(0xffc98c, 0.85, 1.5, 2.0);
  l.position.set(HALL.x - 0.06, HALL.deck + 0.16, 0);
  shrine.add(l);
}

shrine.rotation.y = -0.42;

/* =====================================================================
   8. debris field
   ===================================================================== */
/* Debris: a slow spiral of tumbling chips.  The reference keeps the inner
   field small and dim and puts the big soft chunks near the camera, so the
   swarm is generated in two bands.                                          */
/* A rock is a smooth-silhouette blob with a few flat cleavage faces, not a
   subdivided die: dense sphere -> multi-octave displacement -> soft plane cuts
   -> averaged normals.                                                       */
function rockGeometry(detail, seed, squash){
  const g = new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position, v = new THREE.Vector3();
  const planes = [];
  const pr = mulberry32(9137 + seed*977);
  const nCuts = 3 + Math.floor(pr()*3);
  for(let i=0;i<nCuts;i++){
    const a = pr()*Math.PI*2, b = Math.acos(pr()*2-1);
    planes.push({
      n: new THREE.Vector3(Math.sin(b)*Math.cos(a), Math.cos(b), Math.sin(b)*Math.sin(a)),
      d: 0.60 + pr()*0.30,
      k: 0.45 + pr()*0.45
    });
  }
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    const d = v.clone();
    const n1 = fbm3(d.x*1.05+seed*13, d.y*1.05, d.z*1.05, 3, 2.05, .55);
    const n2 = fbm3(d.x*2.9+seed*7,  d.y*2.9,  d.z*2.9,  3);
    const n3 = fbm3(d.x*7.4+seed*3,  d.y*7.4,  d.z*7.4,  2);
    const n4 = fbm3(d.x*19.0+seed*5, d.y*19.0, d.z*19.0, 2);
    v.multiplyScalar(1 + n1*0.30 + n2*0.11 + n3*0.038 + n4*0.013);
    for(const p of planes){                       // soft cleavage faces
      const t = v.dot(p.n) - p.d;
      if(t > 0) v.addScaledVector(p.n, -t*p.k);
    }
    v.y *= squash;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  return smoothNormals(g, 2e-4);
}
const debrisGeos = [];          // near-camera chunks carry the most detail
for(let i=0;i<5;i++) debrisGeos.push(rockGeometry(5, i+1, 0.52 + (i%3)*0.16));
const debrisGeosFar = [];
for(let i=0;i<6;i++) debrisGeosFar.push(rockGeometry(3, i+21, 0.52 + (i%3)*0.16));
const debrisMat = new THREE.MeshStandardMaterial({
  map:RUBBLE.map, normalMap:RUBBLE.normalMap, roughnessMap:RUBBLE.ormMap, aoMap:RUBBLE.ormMap, aoMapIntensity:0.9,
  normalScale:new THREE.Vector2(1.3,1.3),
  color:0x8a8884, roughness:1.0, metalness:0.0, envMapIntensity:0.30,
});
addDetailNormal(debrisMat, 5.0, 0.70);
const debris = [];
const debrisGroup = new THREE.Group(); scene.add(debrisGroup);

function spawnDebris(n, rMin, rMax, sMin, sMax, yMin, yMax, turns){
  for(let i=0;i<n;i++){
    const pool = (sMax > 0.09) ? debrisGeos : debrisGeosFar;
    const m = new THREE.Mesh(pool[(debris.length)%pool.length], debrisMat);
    m.castShadow = true;
    const t = i/n;
    const r = rMin + Math.pow(rnd(),0.8)*(rMax-rMin);
    const a = t*Math.PI*2*turns + rnd()*0.9;
    const y = yMin + t*(yMax-yMin) + (rnd()-.5)*1.0;
    const s = sMin + Math.pow(rnd(),2.2)*(sMax-sMin);
    m.scale.setScalar(s);
    m.userData = {
      r, a, y, s,
      spin:new THREE.Vector3((rnd()-.5)*.42,(rnd()-.5)*.42,(rnd()-.5)*.42),
      w:(0.018+rnd()*0.028)*(rnd()<.2?-1:1),
      drift:(rnd()-0.42)*0.030,
      push:new THREE.Vector3(), rot:new THREE.Euler(rnd()*6.28,rnd()*6.28,rnd()*6.28)
    };
    debrisGroup.add(m);
    debris.push(m);
  }
}
spawnDebris(74, 1.5, 4.8, 0.016, 0.062, -1.8, 4.4, 3.1);   // inner chips
spawnDebris(28, 5.0,10.8, 0.09 , 0.52 , -3.6, 2.8, 1.9);   // near-camera chunks

/* =====================================================================
   9. starfield + drifting motes
   ===================================================================== */
/* A soft round sprite, drawn once and reused by both point systems.        */
function radialSprite(size, stops){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  stops.forEach(([t, col]) => grd.addColorStop(t, col));
  g.fillStyle = grd; g.fillRect(0,0,size,size);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}
const SPRITE = radialSprite(64, [[0,'rgba(255,255,255,1)'],[0.30,'rgba(255,247,232,0.55)'],[1,'rgba(255,244,226,0)']]);

/* --- stars ------------------------------------------------------------
   Far enough out that the orbit never parallaxes them, on a shell rather
   than a box so the density stays even.  Magnitudes follow a power law, so
   a handful read as bright and the rest as dust; each twinkles on its own
   phase and the colour drifts a little across the field.                  */
let stars = null;
{
  const N = 2600;
  const pos = new Float32Array(N*3), seed = new Float32Array(N*4), tint = new Float32Array(N*3);
  for(let i=0;i<N;i++){
    // even distribution over the sphere, biased away from straight down
    const u1 = rnd()*2-1, th = rnd()*Math.PI*2;
    const sp = Math.sqrt(Math.max(0,1-u1*u1));
    const R = 120 + rnd()*40;
    pos[i*3]   = Math.cos(th)*sp*R;
    pos[i*3+1] = (u1*0.72 + 0.18)*R;
    pos[i*3+2] = Math.sin(th)*sp*R;
    const mag = Math.pow(rnd(), 3.4);                 // few bright, many faint
    seed[i*4]   = rnd()*6.283;                        // twinkle phase
    seed[i*4+1] = 0.35 + rnd()*1.5;                   // twinkle rate
    seed[i*4+2] = 0.20 + mag*1.25;                    // brightness
    seed[i*4+3] = 0.55 + mag*2.6;                     // size
    const warm = rnd();
    tint[i*3]   = 1.0;
    tint[i*3+1] = 0.94 + warm*0.06;
    tint[i*3+2] = 0.86 + warm*0.16;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,4));
  g.setAttribute('tint', new THREE.BufferAttribute(tint,3));
  const m = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, depthTest:false, blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0}, uMap:{value:SPRITE}, uPix:{value:1}, uFade:{value:1} },
    vertexShader:\`
      attribute vec4 seed; attribute vec3 tint;
      varying float vA; varying vec3 vT;
      uniform float uTime, uPix;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = seed.w * uPix * 2.9;
        float tw = 0.62 + 0.38*sin(uTime*seed.y + seed.x)
                        + 0.10*sin(uTime*seed.y*2.7 + seed.x*1.7);
        vA = seed.z * tw;
        vT = tint;
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader:\`
      varying float vA; varying vec3 vT;
      uniform sampler2D uMap; uniform float uFade;
      void main(){
        vec4 t = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(vT * t.rgb, t.a * vA * uFade);
      }\`
  });
  stars = new THREE.Points(g, m);
  stars.frustumCulled = false;
  stars.renderOrder = -5;                   // behind everything, ahead of the haze
  scene.add(stars);
  window.__stars = m;
}

/* --- drifting motes ---------------------------------------------------
   Enough of them to read as air rather than as a scatter of sprites, which
   means the drift has to live in the vertex shader: one uniform write a
   frame however many there are.  They rise slowly, sway, and wrap through a
   band whose edges fade, so the loop never shows.                          */
let motes = null;
{
  const N = (window.innerWidth*window.innerHeight < 640000) ? 1600 : 4200;
  const pos = new Float32Array(N*3), seed = new Float32Array(N*4);
  for(let i=0;i<N;i++){
    const r = 1.0 + Math.pow(rnd(),0.55)*15.0, a = rnd()*6.283;
    pos[i*3]   = Math.cos(a)*r;
    pos[i*3+1] = -7.0 + rnd()*15.0;
    pos[i*3+2] = Math.sin(a)*r;
    seed[i*4]   = rnd()*6.283;                          // phase
    seed[i*4+1] = 0.25 + rnd()*0.95;                    // speed
    seed[i*4+2] = 0.35 + rnd()*1.5;                     // sway
    seed[i*4+3] = 0.55 + 1.15*Math.pow(rnd(), 2.4);     // size
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  g.setAttribute('seed', new THREE.BufferAttribute(seed,4));
  const m = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, depthTest:true, blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0}, uMap:{value:SPRITE}, uPix:{value:1}, uFade:{value:1} },
    vertexShader:\`
      attribute vec4 seed;
      varying float vA;
      uniform float uTime, uPix;
      void main(){
        float ph = seed.x, sp = seed.y, am = seed.z;
        vec3 p = position;
        p.x += sin(uTime*sp*0.33 + ph)*0.42*am;
        p.z += cos(uTime*sp*0.27 + ph*1.3)*0.36*am;
        float band = 15.0;
        float climb = mod(uTime*0.115*sp + ph*2.4, band) - band*0.5;
        p.y += climb;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_PointSize = seed.w * uPix * (26.0 / max(-mv.z, 1.0));
        float edge = 1.0 - abs(climb)/(band*0.5);
        float tw = 0.55 + 0.45*sin(uTime*(0.6 + sp*1.7) + ph*3.1);
        vA = clamp(edge*2.6, 0.0, 1.0) * tw;
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader:\`
      varying float vA;
      uniform sampler2D uMap; uniform float uFade;
      void main(){
        vec4 t = texture2D(uMap, gl_PointCoord);
        gl_FragColor = vec4(t.rgb, t.a * vA * 0.42 * uFade);
      }\`
  });
  motes = new THREE.Points(g, m);
  motes.frustumCulled = false;
  motes.renderOrder = 4;
  scene.add(motes);
  window.__dust = m;
}

/* ?tex=stone|marble|rubble[&ch=map|normal|orm][&zoom=n] shows a baked map
   full-frame, which is the only sane way to judge one.                     */
if(PARAMS.has('tex')){
  const set = {stone:STONE, marble:MARBLE, rubble:RUBBLE}[PARAMS.get('tex')] || STONE;
  const ch  = {map:'map', normal:'normalMap', orm:'ormMap'}[PARAMS.get('ch')||'map'] || 'map';
  const zoom = parseFloat(PARAMS.get('zoom')||'1');
  const t = set[ch].clone(); t.needsUpdate = true;
  t.repeat.set(zoom, zoom); t.encoding = THREE.LinearEncoding;
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2),
    new THREE.ShaderMaterial({ uniforms:{tMap:{value:t}},
      vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.0,1.0);}',
      fragmentShader:\`varying vec2 vUv; uniform sampler2D tMap;
        float invAces(float y){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
          float A=y*c-a, B=y*d-b, C=y*e; if(abs(A)<1e-5) return -C/max(B,1e-5);
          float disc=max(B*B-4.0*A*C,0.0); float x=(-B-sqrt(disc))/(2.0*A);
          if(x<0.0) x=(-B+sqrt(disc))/(2.0*A); return clamp(x,0.0,60.0); }
        void main(){ vec3 c = texture2D(tMap, vUv).rgb;
          // cancel the composer's tone curve so the raw map is what you see
          vec3 l = pow(c, vec3(2.2));
          gl_FragColor = vec4(invAces(l.r), invAces(l.g), invAces(l.b), 1.0); }\` }));
  quad.frustumCulled = false;
  while(scene.children.length) scene.remove(scene.children[0]);
  scene.add(quad);
  document.head.insertAdjacentHTML('beforeend','<style>.stage,.cursor{display:none!important}</style>');
}

/* Loose chips scattered over both terraces — the detail you only notice once
   the eye has walked up the stair.                                          */
{
  const pr = mulberry32(51423);
  for(let i=0;i<26;i++){
    const g = debrisGeos[i % debrisGeos.length];
    const m = new THREE.Mesh(g, debrisMat);
    const x = -1.32 + pr()*2.62, z = (pr()-0.5)*1.34;
    const lower = x > TER_SPLIT;
    if(lower  && (x >  1.34 || Math.abs(z) > 0.60)) continue;
    if(!lower && (x < -1.34 || Math.abs(z) > 0.70)) continue;
    if(!lower && x > -1.10 && x < 0.06 && Math.abs(z) < 0.56) continue;   // clear of the hall
    const sc = 0.010 + Math.pow(pr(),2.2)*0.034;
    m.scale.setScalar(sc);
    m.position.set(x, Y_PLINTH + (lower ? TER_LO : 0) - 0.010 + sc*0.35, z);
    m.rotation.set(pr()*6.28, pr()*6.28, pr()*6.28);
    m.castShadow = m.receiveShadow = true;
    plinth.add(m);
  }
}

/* aoMap samples uv2; every geometry here uses the same layout as uv. */
scene.traverse(o=>{
  if(o.isMesh && o.material && o.material.aoMap &&
     o.geometry.attributes.uv && !o.geometry.attributes.uv2){
    o.geometry.setAttribute('uv2', o.geometry.attributes.uv);
  }
});

/* =====================================================================
   10. post processing
   ===================================================================== */
const rtOpts = {minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
                format:THREE.RGBAFormat, type:THREE.HalfFloatType,
                samples: renderer.capabilities.isWebGL2 ? 4 : 0};
const rt = new THREE.WebGLRenderTarget(1,1,rtOpts);
const composer = new THREE.EffectComposer(renderer, rt);
composer.addPass(new THREE.RenderPass(scene,camera));

const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(1,1), 0.16, 1.0, 0.88);
/* UnrealBloomPass allocates 8-bit targets, which quantises the halo into
   visible contour steps against a near-black sky.  Promote them to half float
   before anything renders into them.                                        */
if(renderer.capabilities.isWebGL2){
  const hf = t => { if(t) t.texture.type = THREE.HalfFloatType; };
  hf(bloom.renderTargetBright);
  (bloom.renderTargetsHorizontal||[]).forEach(hf);
  (bloom.renderTargetsVertical||[]).forEach(hf);
}
composer.addPass(bloom);

const FinalShader = {
  uniforms:{
    tDiffuse:{value:null}, uTime:{value:0}, uGrain:{value:0.022},
    uVig:{value:0.35}, uExposure:{value:1.0}, uRes:{value:new THREE.Vector2(1,1)},
    uSharp:{value:0.32}
  },
  vertexShader:\`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`
    varying vec2 vUv; uniform sampler2D tDiffuse;
    uniform float uTime,uGrain,uVig,uExposure,uSharp; uniform vec2 uRes;
    vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }
    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    void main(){
      vec2 uv=vUv;
      vec2 d = uv-0.5;
      float r2 = dot(d,d);
      // whisper of lateral chromatic aberration
      float ca = 0.0004*r2;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + d*ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - d*ca).b;
      // unsharp mask: crisps the stone relief without touching the bloom halo
      vec2 px = 1.0/uRes;
      vec3 blur = ( texture2D(tDiffuse, uv+vec2( px.x,0.0)).rgb
                  + texture2D(tDiffuse, uv+vec2(-px.x,0.0)).rgb
                  + texture2D(tDiffuse, uv+vec2(0.0, px.y)).rgb
                  + texture2D(tDiffuse, uv+vec2(0.0,-px.y)).rgb ) * 0.25;
      float lum = dot(col, vec3(0.2126,0.7152,0.0722));
      col += (col-blur) * uSharp * (1.0 - smoothstep(0.55, 1.6, lum));
      col = max(col, vec3(0.0));
      col *= uExposure;
      col = aces(col);
      // vignette
      float v = smoothstep(1.15, 0.16, length(d*vec2(1.0,0.92)));
      col *= mix(1.0, v, uVig);
      // sRGB
      col = pow(col, vec3(1.0/2.2));
      // grain, plus a triangular dither so the near-black gradient cannot band
      float g = hash(gl_FragCoord.xy + fract(uTime)*vec2(37.0,17.0))-0.5;
      col += g*uGrain*(0.35+0.65*smoothstep(0.0,0.35,dot(col,vec3(0.33))));
      float d1 = hash(gl_FragCoord.xy + fract(uTime)*vec2(11.0,71.0));
      float d2 = hash(gl_FragCoord.xy + fract(uTime)*vec2(53.0,29.0));
      col += (d1-d2)*(1.0/255.0);
      gl_FragColor = vec4(col,1.0);
    }\`
};
const finalPass = new THREE.ShaderPass(FinalShader);
finalPass.renderToScreen = true;
composer.addPass(finalPass);

/* =====================================================================
   11. resize
   ===================================================================== */
let W=0,H=0,DPR=1;
function resize(){
  W = canvas.clientWidth || window.innerWidth;
  H = canvas.clientHeight || window.innerHeight;
  DPR = Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(W,H,false);
  /* EffectComposer captures the renderer's pixel ratio when it is built, and
     it is built before the first resize — so without this the whole scene
     renders at CSS resolution and is upscaled onto a retina canvas.  Every
     pass, bloom included, is sized from this. */
  composer.setPixelRatio(DPR);
  composer.setSize(W,H);
  const aspect = W/H;
  camera.aspect = aspect;
  // Wider than the reference: hold the vertical field.  Narrower: open up to
  // keep the horizontal field — but clamped, because a portrait phone would
  // otherwise ask for ~88 deg and render a fish-eye.
  const fitW = 2*Math.atan(Math.tan(FOV_H/2)/aspect)*180/Math.PI;
  camera.fov = (aspect >= REF_ASPECT) ? REF_FOV_V : Math.min(46, fitW);
  // past the clamp, distance takes over from field of view
  PORTRAIT = aspect < 0.95;
  DIST_SCALE = 1 + Math.max(0, (fitW - 46))/46 * 0.55;
  camera.updateProjectionMatrix();
  
  finalPass.uniforms.uRes.value.set(W,H);
  if(window.__dust)  window.__dust.uniforms.uPix.value  = H/1366;
  if(window.__stars) window.__stars.uniforms.uPix.value = H/1366;
}
window.addEventListener('resize', resize);
resize();

/* =====================================================================
   12. pointer
   ===================================================================== */
const pointer = {x:0, y:0, tx:0, ty:0, has:false};
const cursorEl = document.getElementById('cursor');
let cx=0, cy=0;
/* ?cursor=x,y parks the drive at a fixed pointer position, in the same
   -1..1 the events use, which makes a camera pose reproducible from a URL. */
if(PARAMS.has('cursor')){
  const [a,b] = PARAMS.get('cursor').split(',').map(Number);
  pointer.tx = pointer.x = Number.isFinite(a) ? Math.max(-1, Math.min(1, a)) : 0;
  pointer.ty = pointer.y = Number.isFinite(b) ? Math.max(-1, Math.min(1, b)) : 0;
  pointer.has = true;
}
window.addEventListener('pointermove', e=>{
  pointer.tx = (e.clientX/W)*2-1;
  pointer.ty = -((e.clientY/H)*2-1);
  pointer.has = true;
  cursorEl.style.opacity = 1;
  cursorEl.dataset.x = e.clientX; cursorEl.dataset.y = e.clientY;
});
window.addEventListener('pointerleave', ()=>{cursorEl.style.opacity=0;});


/* =====================================================================
   14. the page: dock, parallax, entrance
   ===================================================================== */
/* --- card plates ------------------------------------------------------
   The two cards show the scene's own stone: the baked albedo read straight
   out of its DataTexture, cropped and graded on a 2d canvas.  No external
   image, and the paper card and the plinth are made of the same rock.     */
function paintPlate(canvas, set, opt){
  const o = Object.assign({sx:0.12, sy:0.10, zoom:0.42, warm:1.0, lift:0.0}, opt||{});
  const src = set.map.image;                       // {data, width, height}
  const S0 = src.width;
  const cw = canvas.width, ch = canvas.height;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(cw, ch);
  const d = img.data, sd = src.data;
  const spanX = o.zoom, spanY = o.zoom * (ch/cw) * 1.0;
  for(let y=0;y<ch;y++){
    for(let x=0;x<cw;x++){
      const u = (o.sx + (x/cw)*spanX) % 1;
      const v = (o.sy + (y/ch)*spanY) % 1;
      const si = ((Math.floor(v*S0)*S0) + Math.floor(u*S0))*4;
      const i = (y*cw+x)*4;
      // a slow vignette and a warm grade, so the plate reads as a photograph
      const dx = (x/cw-0.5), dy = (y/ch-0.5);
      const vig = 1 - Math.min(1, (dx*dx*1.5 + dy*dy*1.9))*0.85;
      d[i]   = Math.min(255, (sd[si]  *o.warm + o.lift) * vig);
      d[i+1] = Math.min(255, (sd[si+1]*1.0   + o.lift) * vig);
      d[i+2] = Math.min(255, (sd[si+2]*0.96  + o.lift) * vig);
      d[i+3] = 255;
    }
  }
  ctx.putImageData(img,0,0);
}
document.querySelectorAll('canvas[data-plate]').forEach(c=>{
  const kind = c.getAttribute('data-plate');
  try{
    if(kind === 'marble') paintPlate(c, MARBLE, {sx:0.42, sy:0.28, zoom:0.86, warm:1.02, lift:4});
    else                  paintPlate(c, STONE,  {sx:0.10, sy:0.16, zoom:0.92, warm:1.12, lift:6});
  }catch(e){}
});

/* --- pointer: parallax, dock magnification, specular rim -------------- */
const stageEl = document.getElementById('stage');
const dockEl  = document.querySelector('.dock');
const dockItems = [...document.querySelectorAll('[data-dock]')];
const specEls = [...document.querySelectorAll('[data-spec]')];
const parEls  = [...document.querySelectorAll('.par, .mask, .fade, .headline, .stat, .card, .cta, .lede, .eyebrow, .colophon, .scroll')]
  .filter(el => el.style.getPropertyValue('--pd'));
parEls.forEach(el => el.classList.add('par'));

const ptr = {x:0.5, y:0.5, ex:0.5, ey:0.5, inside:false};
addEventListener('pointermove', e => {
  ptr.x = e.clientX / innerWidth; ptr.y = e.clientY / innerHeight; ptr.inside = true;
  dockNear(e.clientX, e.clientY);
  specUpdate(e.clientX, e.clientY);
}, {passive:true});
addEventListener('pointerleave', () => { ptr.inside = false; dockNear(-1e5,-1e5); });

/* pills magnify with distance, the way a dock does */
function dockNear(mx, my){
  const U = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u')) || 1;
  const R = 150*U;
  dockItems.forEach(it => {
    const r = it.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const d = Math.hypot(mx-cx, my-cy);
    const f = Math.max(0, 1 - d/R);
    const k = f*f;
    it.style.transform = \`translateY(\${k*3*U}px) scale(\${1 + k*0.16})\`;
    it.dataset.near = k > 0.22 ? 'true' : 'false';
  });
}
/* the rim highlight points at the pointer and fades with distance */
function specUpdate(mx, my){
  specEls.forEach(el => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const ang = Math.atan2(my-cy, mx-cx);
    const d = Math.hypot(mx-cx, my-cy);
    const reach = Math.max(r.width, r.height) * 1.9;
    el.style.setProperty('--spec-angle', (ang + Math.PI/2).toFixed(3)+'rad');
    el.style.setProperty('--spec-bright', Math.max(0, 1 - d/reach).toFixed(3));
  });
}

/* --- entrance ---------------------------------------------------------- */
function reveal(){
  if(document.body.classList.contains('is-ready')) return;
  document.body.classList.add('is-ready');
  setTimeout(()=>document.body.classList.add('intro-done'), 2600);
}

/* =====================================================================
   13. animate
   ===================================================================== */
const clock = new THREE.Clock();
let t = 0;
const camTarget = new THREE.Vector3(0, Y_TARGET, 0);
const _v = new THREE.Vector3();
const _proj = new THREE.Vector3();

function frame(time){
  const dt = Math.min(clock.getDelta(), 0.05);
  t = FROZEN!==null ? FROZEN : t+dt;

  // --- camera: a steady orbit the pointer steers -------------------------
  /* The reference slid the eye a few centimetres sideways with the pointer.
     Here the pointer turns the camera about the aim point instead, so push
     it to an edge and the scene turns to meet you.

     The travel is clamped by construction rather than by a guard: the
     pointer only ever runs -1..1, and it is only ever multiplied by the
     ranges below.  22 degrees of yaw either way, 11 up and 20 down.
     The two are not equal on purpose: a gate is a thing you walk under, so
     the drive is given its room below, and eleven degrees is as far up as
     the eye can go before it crosses the plane of the upper orbit and the
     ring flips from an ellipse to a line and back.

     Recentre and the eye returns to exactly where the authored orbit put
     it: the resting elevation and slant range are derived from Y_CAM
     rather than replacing it, so the composition at rest is unchanged.   */
  const YAW_RANGE  = 22*Math.PI/180;
  const PITCH_UP   = 11*Math.PI/180;
  const PITCH_DOWN = 20*Math.PI/180;
  // wide viewports crowd the footer, portrait ones need the subject lifted
  // clear of the copy column, so both aim below the target
  const aimDrop = Math.max(0, (W/H)/REF_ASPECT - 1) * 1.45
                + (PORTRAIT ? 1.55 * DIST_SCALE : 0);
  const aimY  = camTarget.y - aimDrop;
  const eyeY  = ELEV_OVERRIDE!==null ? ELEV_OVERRIDE : Y_CAM;
  const dist  = D_CAM * DIST_SCALE;
  const rest  = Math.atan2(eyeY - aimY, dist);      // resting elevation
  const range = Math.hypot(dist, eyeY - aimY);      // slant range, held constant
  const az    = -ORBIT_RATE*t + 0.144 + pointer.x*YAW_RANGE;
  const el    = rest + pointer.y*(pointer.y > 0 ? PITCH_UP : PITCH_DOWN);
  camera.position.set(
    Math.sin(az)*range*Math.cos(el),
    aimY + Math.sin(el)*range,
    Math.cos(az)*range*Math.cos(el)
  );
  // roll the up vector with the orbit, otherwise the scene's tilt would swing
  // from -9.7 deg to +9.7 deg over a revolution instead of holding steady
  camera.up.set(Math.sin(ROLL)*Math.cos(az), Math.cos(ROLL), -Math.sin(ROLL)*Math.sin(az));
  camera.lookAt(camTarget.x, aimY, camTarget.z);

  // a little quicker than the reference: the pointer is steering the camera
  // now, and a half-second lag on a camera reads as drag rather than weight
  pointer.x += (pointer.tx-pointer.x)*Math.min(1,dt*3.4);
  pointer.y += (pointer.ty-pointer.y)*Math.min(1,dt*3.4);

  // --- rings ------------------------------------------------------------
  ringTop.rotation.y = 0.020*t;
  ringLow.rotation.y = -0.026*t;
  haloRings.forEach(g=>{ g.rotation.y = g.userData.baseY===undefined
      ? (g.userData.baseY = g.rotation.y) + g.userData.spin*t
      : g.userData.baseY + g.userData.spin*t; });
  [ringTop, ringLow, ...haloRings].forEach(g=>{
    g.children.forEach(m => m.material.uniforms.uCam.value.copy(camera.position));
  });

  // --- debris -----------------------------------------------------------
  const cursorNDC = new THREE.Vector2(pointer.x, pointer.y);
  for(let i=0;i<debris.length;i++){
    const m = debris[i], u = m.userData;
    const a = u.a + u.w*t;
    const y = u.y + u.drift*t;
    _v.set(Math.cos(a)*u.r, y, Math.sin(a)*u.r);

    // cursor repulsion in screen space
    if(pointer.has){
      _proj.copy(_v).project(camera);
      const dx = _proj.x - cursorNDC.x, dy = _proj.y - cursorNDC.y;
      const d = Math.hypot(dx, dy*0.72);
      const R = 0.17;
      if(d < R && _proj.z < 1){
        const f = (1-d/R);
        const push = f*f*0.17;                  // a light shove, not a launch
        u.push.x += ((dx/(d+1e-4))*push - u.push.x)*0.06;
        u.push.y += ((dy/(d+1e-4))*push - u.push.y)*0.06;
      }
    }
    u.push.multiplyScalar(0.975);          // and it drifts back slowly
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
    const up    = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
    _v.addScaledVector(right, u.push.x*2.0).addScaledVector(up, u.push.y*2.0);

    m.position.copy(_v);
    m.rotation.set(u.rot.x + u.spin.x*t, u.rot.y + u.spin.y*t, u.rot.z + u.spin.z*t);
  }

  // the rock itself turns slowly the other way, so the orbit reads as motion
  // rather than a camera pan.  No bobbing, no wobble.
  plinth.rotation.y  = ROCK_RATE*t;
  shrine.rotation.y  = SHRINE_YAW + ROCK_RATE*t;
  flameMat.uniforms.uTime.value = t;
  const flicker = FLAME_I*(0.9 + 0.1*Math.sin(t*7.3) + 0.05*Math.sin(t*17.7+1.3));
  for(const l of flameLights) l.intensity = flicker;

  if(window.__dust)  window.__dust.uniforms.uTime.value  = t;
  if(window.__stars) window.__stars.uniforms.uTime.value = t;
  finalPass.uniforms.uTime.value = FROZEN!==null ? 0.37 : time*0.001;

  // cursor ring follow
  // stage parallax, eased
  ptr.ex += ((ptr.inside? ptr.x : 0.5) - ptr.ex)*Math.min(1, dt*3.0);
  ptr.ey += ((ptr.inside? ptr.y : 0.5) - ptr.ey)*Math.min(1, dt*3.0);
  if(stageEl){
    stageEl.style.setProperty('--px', ((ptr.ex-0.5)*2).toFixed(4));
    stageEl.style.setProperty('--py', ((ptr.ey-0.5)*2).toFixed(4));
  }

  if(cursorEl.dataset.x!==undefined){
    const tx = +cursorEl.dataset.x, ty = +cursorEl.dataset.y;
    cx += (tx-cx)*(FROZEN!==null?1:Math.min(1,dt*7.5));
    cy += (ty-cy)*(FROZEN!==null?1:Math.min(1,dt*7.5));
    cursorEl.style.transform = \`translate(\${cx}px, \${cy}px)\`;
  }

  composer.render();
  if(!window.__ready){ window.__ready = true; window.__t0 = performance.now(); reveal(); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* =====================================================================
   15. type panel  —  press T, or the Aa button, to tune the typography
   ===================================================================== */
/* Everything typographic on the page reads from custom properties, so this
   panel only has to write those.  Faces are pulled on demand with the
   FontFace API rather than a <link>: a stylesheet link from a file:// page
   can hang, and this way nothing is fetched until it is actually chosen.  */
(function typePanel(){
  const FACES = {
    display: [
      ['Instrument Serif', "'Instrument Serif',serif", true],
      ['Playfair Display', "'Playfair Display',serif"],
      ['Fraunces',         "'Fraunces',serif"],
      ['Newsreader',       "'Newsreader',serif"],
      ['Bodoni Moda',      "'Bodoni Moda',serif"],
      ['DM Serif Display', "'DM Serif Display',serif"],
      ['Cormorant Garamond',"'Cormorant Garamond',serif"],
      ['Space Grotesk',    "'Space Grotesk',sans-serif"],
      ['Inter Tight',      "'Inter Tight',sans-serif"]
    ],
    ui: [
      ['System',          'var(--sans)', true],
      ['Inter',           "'Inter',sans-serif"],
      ['Instrument Sans', "'Instrument Sans',sans-serif"],
      ['Geist',           "'Geist',sans-serif"],
      ['Space Grotesk',   "'Space Grotesk',sans-serif"],
      ['Figtree',         "'Figtree',sans-serif"]
    ]
  };
  const loaded = new Set(['Instrument Serif']);
  async function ensureFace(name){
    if(loaded.has(name) || name === 'System') return;
    loaded.add(name);
    try{
      const css = await (await fetch(
        \`https://fonts.googleapis.com/css2?family=\${encodeURIComponent(name)}:wght@300;400;500;600&display=swap\`
      )).text();
      const blocks = css.split('@font-face').slice(1);
      for(const b of blocks){
        if(!/U\\+0000-00FF/.test(b)) continue;                 // latin only
        const url = (b.match(/url\\((https:[^)]+)\\)/)||[])[1];
        const wt  = (b.match(/font-weight:\\s*([\\d ]+)/)||[])[1] || '400';
        if(!url) continue;
        const ff = new FontFace(name, \`url(\${url})\`, {weight: wt.trim().replace(/\\s+/g,' ')});
        await ff.load(); document.fonts.add(ff);
      }
    }catch(e){ /* offline: the fallback stack still applies */ }
  }

  const DEFAULTS = {
    display:'Instrument Serif', ui:'System',
    h1:92, 'h1-lh':87, 'h1-track':0.035, 'h1-weight':400,
    lede:21.5, 'lede-lh':30, 'ui-weight':300,
    label:13.5, 'label-track':2.8, 'card-title':38
  };
  const state = Object.assign({}, DEFAULTS, (()=>{
    try{ return JSON.parse(localStorage.getItem('orrery.type')||'{}'); }catch(e){ return {}; }
  })());

  const root = document.documentElement;
  function apply(){
    const dv = (FACES.display.find(f=>f[0]===state.display)||FACES.display[0])[1];
    const uv = (FACES.ui.find(f=>f[0]===state.ui)||FACES.ui[0])[1];
    root.style.setProperty('--display', dv);
    root.style.setProperty('--ui', uv);
    ['h1','h1-lh','h1-track','h1-weight','lede','lede-lh','ui-weight','label','label-track','card-title']
      .forEach(k => root.style.setProperty('--'+k, state[k]));
    try{ localStorage.setItem('orrery.type', JSON.stringify(state)); }catch(e){}
  }
  ensureFace(state.display); ensureFace(state.ui); apply();

  /* ---- panel chrome ---------------------------------------------------- */
  const css = \`
  .tp-btn{position:fixed;right:18px;bottom:18px;z-index:20;width:38px;height:38px;border-radius:11px;
    border:1px solid rgba(255,255,255,.16);background:rgba(18,16,14,.72);color:rgba(255,255,255,.7);
    font:500 14px/1 ui-sans-serif,system-ui;cursor:pointer;display:grid;place-items:center;
    transition:color .2s,border-color .2s,background .2s}
  .tp-btn:hover{color:#fff;border-color:rgba(255,255,255,.34);background:rgba(28,25,21,.9)}
  .tp{position:fixed;right:18px;bottom:66px;z-index:20;width:min(286px,calc(100vw - 36px));
    max-height:min(76vh,720px);overflow-y:auto;overscroll-behavior:contain;padding:14px 16px 16px;
    border-radius:16px;border:1px solid rgba(255,255,255,.13);
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,0) 40%),rgba(16,14,12,.94);
    box-shadow:0 18px 50px rgba(0,0,0,.6);
    font:400 11px/1.4 ui-sans-serif,system-ui;color:rgba(255,255,255,.72);
    display:none}
  .tp.is-open{display:block}
  .tp h4{font:600 10px/1 ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase;
    color:rgba(255,255,255,.4);margin:0 0 11px}
  .tp label{display:block;margin:0 0 9px}
  .tp .row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px}
  .tp .row b{font-weight:500;color:rgba(255,255,255,.62)}
  .tp .row i{font-style:normal;color:rgba(255,255,255,.42);font-variant-numeric:tabular-nums}
  .tp select,.tp input[type=range]{width:100%}
  .tp select{appearance:none;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.14);
    border-radius:8px;padding:6px 8px;font:400 11px/1 ui-sans-serif,system-ui}
  .tp input[type=range]{accent-color:#ffbf7a;height:16px;background:transparent}
  .tp .btns{display:flex;gap:8px;margin-top:12px}
  .tp button{flex:1;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);
    border-radius:9px;padding:7px 8px;font:500 10.5px/1 ui-sans-serif,system-ui;letter-spacing:.06em;
    text-transform:uppercase;cursor:pointer}
  .tp button:hover{background:rgba(255,255,255,.12);color:#fff}
  .tp .hint{margin-top:9px;color:rgba(255,255,255,.32);font-size:10px}
  @media (max-width:520px){ .tp{right:12px;left:12px;width:auto;bottom:60px} .tp-btn{right:12px;bottom:12px} }\`;
  document.head.insertAdjacentHTML('beforeend', \`<style>\${css}</style>\`);

  const sliders = [
    ['h1',        'Display size',  40, 190, 0.5],
    ['h1-lh',     'Display leading',36, 190, 0.5],
    ['h1-track',  'Display tracking',-0.06, 0.16, 0.001],
    ['h1-weight', 'Display weight', 300, 700, 100],
    ['card-title','Card title',     20, 64, 0.5],
    ['lede',      'Lede size',      13, 34, 0.25],
    ['lede-lh',   'Lede leading',   16, 52, 0.25],
    ['ui-weight', 'UI weight',      200, 600, 100],
    ['label',     'Label size',     9, 22, 0.25],
    ['label-track','Label tracking',0, 8, 0.1]
  ];
  const opts = (list, cur) => list.map(f =>
    \`<option value="\${f[0]}"\${f[0]===cur?' selected':''}>\${f[0]}</option>\`).join('');
  const panel = document.createElement('div');
  panel.className = 'tp';
  panel.innerHTML = \`
    <h4>Typography</h4>
    <label><span class="row"><b>Display face</b></span>
      <select data-face="display">\${opts(FACES.display, state.display)}</select></label>
    <label><span class="row"><b>UI face</b></span>
      <select data-face="ui">\${opts(FACES.ui, state.ui)}</select></label>
    \${sliders.map(([k,l,mn,mx,st])=>\`
      <label><span class="row"><b>\${l}</b><i data-out="\${k}">\${state[k]}</i></span>
      <input type="range" data-key="\${k}" min="\${mn}" max="\${mx}" step="\${st}" value="\${state[k]}"></label>\`).join('')}
    <div class="btns"><button data-act="reset">Reset</button><button data-act="copy">Copy CSS</button></div>
    <p class="hint">Press T to hide. Choices are remembered.</p>\`;
  const btn = document.createElement('button');
  btn.className = 'tp-btn'; btn.type = 'button';
  btn.setAttribute('aria-label','Typography options'); btn.textContent = 'Aa';
  document.body.append(panel, btn);

  const toggle = () => panel.classList.toggle('is-open');
  btn.addEventListener('click', toggle);
  addEventListener('keydown', e => {
    if(e.key === 't' || e.key === 'T'){
      const tag = (e.target.tagName||'').toLowerCase();
      if(tag !== 'input' && tag !== 'select' && tag !== 'textarea') toggle();
    }
  });
  panel.addEventListener('input', e => {
    const el = e.target;
    if(el.dataset.key){
      state[el.dataset.key] = parseFloat(el.value);
      panel.querySelector(\`[data-out="\${el.dataset.key}"]\`).textContent = el.value;
      apply();
    }
  });
  panel.addEventListener('change', async e => {
    const el = e.target;
    if(el.dataset.face){
      state[el.dataset.face] = el.value;
      await ensureFace(el.value);
      apply();
    }
  });
  panel.addEventListener('click', e => {
    const act = e.target.dataset && e.target.dataset.act;
    if(act === 'reset'){
      Object.assign(state, DEFAULTS); apply();
      panel.querySelectorAll('[data-key]').forEach(i=>{
        i.value = state[i.dataset.key];
        panel.querySelector(\`[data-out="\${i.dataset.key}"]\`).textContent = i.value;
      });
      panel.querySelectorAll('[data-face]').forEach(sl => sl.value = state[sl.dataset.face]);
    }
    if(act === 'copy'){
      const dv = (FACES.display.find(f=>f[0]===state.display)||FACES.display[0])[1];
      const uv = (FACES.ui.find(f=>f[0]===state.ui)||FACES.ui[0])[1];
      const out = \`:root{\\n  --display: \${dv};\\n  --ui: \${uv};\\n\` +
        ['h1','h1-lh','h1-track','h1-weight','lede','lede-lh','ui-weight','label','label-track','card-title']
          .map(k=>\`  --\${k}: \${state[k]};\`).join('\\n') + '\\n}';
      navigator.clipboard && navigator.clipboard.writeText(out);
      e.target.textContent = 'Copied';
      setTimeout(()=>{ e.target.textContent = 'Copy CSS'; }, 1200);
    }
  });

  /* ?type=hide keeps the button out of screenshots */
  if(PARAMS.get('type') === 'hide'){ btn.style.display='none'; }
  window.__type = { state, apply };
})();

// expose for measuring harnesses
window.__scene = {scene, camera, renderer, composer, bloom, finalPass, bgMat, ringTop, ringLow, shrine, plinth, debris};
window.__render = (time)=>{ t=time; frame(0); };
window.__probe = function(){
  const w=renderer.domElement.clientWidth, h=renderer.domElement.clientHeight;
  const toScreen = (v)=>{ const p=v.clone().project(camera); return [ (p.x*0.5+0.5)*w, (0.5-p.y*0.5)*h ]; };
  function ringExtremes(radius, y){
    let minx=[1e9,0], maxx=[-1e9,0], miny=[0,1e9], maxy=[0,-1e9];
    for(let i=0;i<1440;i++){
      const a=i/1440*Math.PI*2;
      const s=toScreen(new THREE.Vector3(Math.cos(a)*radius, y, Math.sin(a)*radius));
      if(s[0]<minx[0]) minx=s;
      if(s[0]>maxx[0]) maxx=s;
      if(s[1]<miny[1]) miny=s;
      if(s[1]>maxy[1]) maxy=s;
    }
    const cx=(minx[0]+maxx[0])/2, cy=(minx[1]+maxx[1])/2;
    const A=Math.hypot(maxx[0]-minx[0], maxx[1]-minx[1])/2;
    const ang=Math.atan2(maxx[1]-minx[1], maxx[0]-minx[0])*180/Math.PI;
    // semi-minor from the vertical extremes measured perpendicular to the major axis
    const nx=-Math.sin(ang*Math.PI/180), ny=Math.cos(ang*Math.PI/180);
    const B=(Math.abs((miny[0]-cx)*nx+(miny[1]-cy)*ny)+Math.abs((maxy[0]-cx)*nx+(maxy[1]-cy)*ny))/2;
    return {left:minx, right:maxx, top:miny, bottom:maxy, cx, cy, a:A, b:B, ang};
  }
  const bbox = (obj)=>{
    const box=new THREE.Box3().setFromObject(obj);
    const pts=[]; const mn=box.min, mx=box.max;
    for(const X of [mn.x,mx.x]) for(const Y of [mn.y,mx.y]) for(const Z of [mn.z,mx.z]) pts.push(toScreen(new THREE.Vector3(X,Y,Z)));
    const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]);
    return {x0:Math.min(...xs), x1:Math.max(...xs), y0:Math.min(...ys), y1:Math.max(...ys)};
  };
  return JSON.stringify({
    t, w, h, fov:camera.fov,
    cam:[+camera.position.x.toFixed(3),+camera.position.y.toFixed(3),+camera.position.z.toFixed(3)],
    ringTop:ringExtremes(R_RING_TOP, Y_RING_TOP),
    ringLow:ringExtremes(R_RING_LOW, Y_RING_LOW),
    plinth:bbox(plinth), shrine:bbox(shrine),
    plinthTop:[[-1.46,-0.79],[0.40,-0.79],[0.40,0.79],[-1.46,0.79]].map(([x,z])=>toScreen(new THREE.Vector3(x,Y_PLINTH,z))),
    axis:[toScreen(new THREE.Vector3(0,Y_RING_LOW,0)), toScreen(new THREE.Vector3(0,Y_RING_TOP,0))]
  });
};
})();
<\/script>
</body>
</html>
`,l=["orrery","ruin","labyrinth","shrine"],d={ruin:s,labyrinth:i,shrine:c},u={orrery:"Orrery — orbital field background",ruin:"Orrery — What the Centuries Left Standing",labyrinth:"Orrery — The Long Way to the Middle",shrine:"Orrery — Rebuilt Often, Changed Rarely"};function f({variant:e="orrery",presentation:t="background",...a}){const n=l.includes(e)?e:"orrery";return r.createElement(o,{...a,backgroundCanvasSelector:t==="background"?"#gl":void 0,key:n,title:u[n],sourceUrl:"/landing-pages/orrery.html",srcDoc:n==="orrery"?void 0:d[n]})}export{l as ORRERY_HERO_VARIANTS,f as OrreryHero};
