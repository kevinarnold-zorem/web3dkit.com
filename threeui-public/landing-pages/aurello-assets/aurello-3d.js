/*
  Aurello — real-time three.js can + citrus.

  Replaces the flat product photography with lathed 3D geometry:
   • the can is a revolved profile traced from the product render's own silhouette,
     wrapped with a label texture that is cylindrically un-projected from the photo
     (so the artwork stays pixel-authentic while the form becomes real geometry);
   • the oranges are lit half-spheres with a rind shell and a cut face un-projected
     from the elliptical cut in the source photograph.

  Every 3D surface is drawn by one shared WebGLRenderer and blitted into per-element
  2D canvases, so the existing DOM layout, GSAP choreography and stacking order are
  untouched. If WebGL or the textures are unavailable the canvases keep the original
  photograph that was painted into them at load.
*/

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const DEG = Math.PI / 180;
const SAMPLE_A = [0, 0, 0];
const SAMPLE_B = [0, 0, 0];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rand = (a, b) => a + Math.random() * (b - a);

/* Tunables kept together so the look can be dialled in from one place. */
const LIGHTS = { hemi: 0.48, key: 1.55, fill: 1.43, rim: 0.5 };
const CFG = {
  labelTexWidth: 1024,
  canSegments: 96,
  /* How much of the photograph's baked-in cylinder shading is divided back out
     before the renderer re-lights the surface. 1 = fully flatten to albedo. */
  deshade: 0.88,
  labelGain: 1.0,
  canFov: 13,
  canElevation: 5 * DEG,
  /* Fraction of the frame height the can occupies — matched to the source PNG. */
  canFill: 0.916,
  idleYaw: 8 * DEG,
  idleTilt: 2.6 * DEG,
  scrollYaw: 13 * DEG,
  /* hovering turns the piece like a turntable; dragging takes direct control */
  canOrbitRate: 0.8,
  canDragPerPixel: 0.011,
  canPitchLimit: 22 * DEG,
  orangeOrbitRate: 1.35,
};

/* Pointer position in client space, shared by every slot. The citrus layers stay
   pointer-transparent, so they hit-test against this rather than taking events. */
const POINTER = { x: -1e5, y: -1e5, active: false };
const forgetPointer = () => {
  POINTER.active = false;
  POINTER.x = -1e5;
  POINTER.y = -1e5;
};
addEventListener('pointermove', (event) => {
  POINTER.x = event.clientX;
  POINTER.y = event.clientY;
  POINTER.active = event.pointerType !== 'touch';
}, { passive: true });
addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') forgetPointer();
}, { passive: true });
addEventListener('pointercancel', forgetPointer, { passive: true });
addEventListener('blur', forgetPointer);
document.addEventListener('pointerleave', forgetPointer, { passive: true });

/* exponential approach that is independent of frame rate */
const approach = (current, target, rate, dt) => current + (target - current) * (1 - Math.exp(-rate * dt));

/* nearest orientation that still faces front */
const settleTurn = (angle) => Math.round(angle / TAU) * TAU;

/* ------------------------------------------------------------------ helpers */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('aurello3d: image failed ' + src));
    img.src = src;
  });
}

function rasterise(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  return { canvas, ctx, W: canvas.width, H: canvas.height };
}

/* ------------------------------------------------------- can photo analysis */

/*
  Walks the product render and recovers everything the geometry needs:
  the silhouette radius at every scanline, the printed (saturated) band, and a
  column-wise shading profile sampled from the label's own background colour.
*/
function analyseCan(img) {
  const { canvas, ctx, W, H } = rasterise(img);
  const data = ctx.getImageData(0, 0, W, H).data;

  const rows = new Array(H).fill(null);
  let top = -1;
  let bottom = -1;

  for (let y = 0; y < H; y++) {
    let left = -1;
    let right = -1;
    let sat = 0;
    let n = 0;
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4;
      if (data[o + 3] <= 140) continue;
      if (left < 0) left = x;
      right = x;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      sat += mx ? (mx - mn) / mx : 0;
      n++;
    }
    if (left < 0) continue;
    rows[y] = { l: left, r: right, cx: (left + right) / 2, R: (right - left) / 2, sat: sat / n };
    if (top < 0) top = y;
    bottom = y;
  }

  let labelTop = -1;
  let labelBottom = -1;
  for (let y = top; y <= bottom; y++) {
    if (rows[y] && rows[y].sat > 0.3) {
      if (labelTop < 0) labelTop = y;
      labelBottom = y;
    }
  }

  let bodyR = 0;
  for (let y = labelTop; y <= labelBottom; y++) bodyR = Math.max(bodyR, rows[y].R);

  /*
    Flat-field the photograph's cylinder lighting, per column and per channel.

    Towards the silhouette the label is not simply darker: ambient fill lifts the
    blacks and washes the colour out, so `observed = albedo * scale + offset`.
    Fitting only the scale (from the background orange) leaves the whites tinted
    the moment the can is turned far enough to show that region, so two anchors
    are measured per column — the saturated brand background and the near-white
    type — and a two-point affine per channel maps both back to what they are at
    the centre of the can.
  */
  const bgSum = [new Float64Array(W), new Float64Array(W), new Float64Array(W)];
  const whSum = [new Float64Array(W), new Float64Array(W), new Float64Array(W)];
  const bgCount = new Uint32Array(W);
  const whCount = new Uint32Array(W);
  for (let y = labelTop; y <= labelBottom; y += 2) {
    const row = rows[y];
    if (!row) continue;
    for (let x = row.l + 3; x <= row.r - 3; x++) {
      const o = (y * W + x) * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      const sat = mx ? (mx - mn) / mx : 0;
      if (sat > 0.5) {
        bgSum[0][x] += r; bgSum[1][x] += g; bgSum[2][x] += b;
        bgCount[x]++;
      } else if (sat < 0.16 && 0.299 * r + 0.587 * g + 0.114 * b > 110) {
        whSum[0][x] += r; whSum[1][x] += g; whSum[2][x] += b;
        whCount[x]++;
      }
    }
  }

  const smoothField = (sum, count, minSamples) => {
    const out = [new Float32Array(W), new Float32Array(W), new Float32Array(W)];
    for (let c = 0; c < 3; c++) {
      const raw = new Float32Array(W).fill(-1);
      for (let x = 0; x < W; x++) if (count[x] >= minSamples) raw[x] = sum[c][x] / count[x];
      let lastGood = -1;
      for (let x = 0; x < W; x++) {
        if (raw[x] >= 0) lastGood = x;
        else if (lastGood >= 0) raw[x] = raw[lastGood];
      }
      for (let x = W - 1; x >= 0; x--) if (raw[x] < 0 && x + 1 < W) raw[x] = raw[x + 1];
      const K = 5;
      for (let x = 0; x < W; x++) {
        let acc = 0;
        let n = 0;
        for (let k = -K; k <= K; k++) {
          const i = x + k;
          if (i < 0 || i >= W || raw[i] < 0) continue;
          acc += raw[i];
          n++;
        }
        out[c][x] = n ? acc / n : -1;
      }
    }
    return out;
  };

  const bg = smoothField(bgSum, bgCount, 24);
  const wh = smoothField(whSum, whCount, 12);

  /* Normalise against the centre column, not the brightest one: the de-shaded
     texture then reproduces the photograph's own front-facing colour exactly and
     the renderer's lighting supplies the falloff (and removes the baked highlight
     rather than pushing the whole label past white). */
  const midRow = rows[Math.round((labelTop + labelBottom) / 2)] || rows[labelBottom];
  const centreCol = Math.round(midRow.cx);

  const gainScale = [new Float32Array(W), new Float32Array(W), new Float32Array(W)];
  const gainOffset = [new Float32Array(W), new Float32Array(W), new Float32Array(W)];
  const strength = CFG.deshade;
  for (let c = 0; c < 3; c++) {
    const bgRef = bg[c][centreCol] > 0 ? bg[c][centreCol] : 1;
    const whRef = wh[c][centreCol];
    for (let x = 0; x < W; x++) {
      const bgX = bg[c][x] > 0 ? bg[c][x] : bgRef;
      const whX = wh[c][x];
      let scale;
      let offset;
      const span = whX - bgX;
      if (whRef > 0 && whX > 0 && span > 12) {
        scale = clamp((whRef - bgRef) / span, 0.6, 4);
        offset = bgRef - bgX * scale;
      } else {
        /* no light anchor in this column — fall back to a pure gain */
        scale = clamp(bgRef / Math.max(bgX, 1), 0.6, 4);
        offset = 0;
      }
      gainScale[c][x] = 1 + (scale - 1) * strength;
      gainOffset[c][x] = offset * strength;
    }
  }

  return { canvas, W, H, rows, top, bottom, labelTop, labelBottom, bodyR, gainScale, gainOffset };
}

/*
  Cylindrical un-projection. A point at angle φ on the can maps to the photograph
  at cx + R·sin(φ); running φ across a full turn therefore replays the visible
  half forwards and then mirrored, which is exactly the wrap we want for a label
  that is only ever seen from the front.
*/
function buildLabelTexture(an) {
  const TW = CFG.labelTexWidth;
  const labelH = an.labelBottom - an.labelTop;
  const TH = Math.max(8, Math.round((TW * labelH) / (TAU * an.bodyR)));

  /* Vertical resample first so the browser does the (high quality) minification. */
  const strip = document.createElement('canvas');
  strip.width = an.W;
  strip.height = TH;
  const sctx = strip.getContext('2d', { willReadFrequently: true });
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(an.canvas, 0, an.labelTop, an.W, labelH, 0, 0, an.W, TH);
  const src = sctx.getImageData(0, 0, an.W, TH).data;

  const out = document.createElement('canvas');
  out.width = TW;
  out.height = TH;
  const octx = out.getContext('2d');
  const dst = octx.createImageData(TW, TH);
  const D = dst.data;

  /*
    The photograph only shows 180° of the sleeve. Letting the sine wrap simply
    mirror it would put a backwards wordmark on the far side, which shows the
    moment the can is dragged past a quarter turn — so the front artwork is
    repeated around the back instead, and the two joins are cross-dissolved so
    the seam reads like the fold on a real printed sleeve rather than a cut.
  */
  const SEAM = 0.16;
  const sinDup = new Float32Array(TW);
  const sinMir = new Float32Array(TW);
  const seamMix = new Float32Array(TW);
  for (let i = 0; i < TW; i++) {
    const phi = ((i + 0.5) / TW - 0.5) * TAU;
    sinMir[i] = Math.sin(phi);
    const front = phi > HALF_PI ? phi - Math.PI : phi < -HALF_PI ? phi + Math.PI : phi;
    sinDup[i] = Math.sin(front);
    const w = clamp((Math.abs(phi) - (HALF_PI - SEAM)) / (2 * SEAM), 0, 1);
    seamMix[i] = w * w * (3 - 2 * w);
  }

  for (let j = 0; j < TH; j++) {
    /* photo scanline this texture row came from, for per-row silhouette metrics */
    const py = clamp(Math.round(an.labelTop + ((j + 0.5) / TH) * labelH), an.labelTop, an.labelBottom);
    const row = an.rows[py] || an.rows[an.labelBottom];
    const cx = row.cx;
    const R = row.R;
    /* Hold off the silhouette: the last few columns of the photograph are the
       barrel curving away, not label art, and a rotating can would smear them
       into a wide band. */
    const inset = Math.max(2, an.bodyR * 0.022);
    const lo = row.l + inset;
    const hi = row.r - inset;
    const dRow = j * TW * 4;
    const sRow = j * an.W * 4;
    /* one column of the de-shaded photograph, sampled at a horizontal offset */
    const column = (sine, out) => {
      const sx = clamp(cx + R * sine, lo, hi);
      const x0 = Math.floor(sx);
      const fx = sx - x0;
      const x1 = Math.min(an.W - 1, x0 + 1);
      const o0 = sRow + x0 * 4;
      const o1 = sRow + x1 * 4;
      /* map the photograph's lit colour back to flat albedo */
      for (let c = 0; c < 3; c++) {
        const a = src[o0 + c];
        const b2 = src[o1 + c];
        const value = a + (b2 - a) * fx;
        out[c] = (value * an.gainScale[c][x0] + an.gainOffset[c][x0]) * CFG.labelGain;
      }
    };

    for (let i = 0; i < TW; i++) {
      const mix = seamMix[i];
      const d = dRow + i * 4;
      if (mix <= 0) {
        column(sinMir[i], SAMPLE_A);
        D[d] = clamp(SAMPLE_A[0], 0, 255);
        D[d + 1] = clamp(SAMPLE_A[1], 0, 255);
        D[d + 2] = clamp(SAMPLE_A[2], 0, 255);
      } else if (mix >= 1) {
        column(sinDup[i], SAMPLE_A);
        D[d] = clamp(SAMPLE_A[0], 0, 255);
        D[d + 1] = clamp(SAMPLE_A[1], 0, 255);
        D[d + 2] = clamp(SAMPLE_A[2], 0, 255);
      } else {
        column(sinMir[i], SAMPLE_A);
        column(sinDup[i], SAMPLE_B);
        D[d] = clamp(SAMPLE_A[0] + (SAMPLE_B[0] - SAMPLE_A[0]) * mix, 0, 255);
        D[d + 1] = clamp(SAMPLE_A[1] + (SAMPLE_B[1] - SAMPLE_A[1]) * mix, 0, 255);
        D[d + 2] = clamp(SAMPLE_A[2] + (SAMPLE_B[2] - SAMPLE_A[2]) * mix, 0, 255);
      }
      D[d + 3] = 255;
    }
  }
  octx.putImageData(dst, 0, 0);

  const tex = new THREE.CanvasTexture(out);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/* ------------------------------------------------------------------- lathe */

/* points: [{ r, y, v }] ordered bottom → top. v is the label coordinate. */
function buildLathe(points, segments) {
  const n = points.length;
  const ringCount = segments + 1;
  const pos = new Float32Array(n * ringCount * 3);
  const nor = new Float32Array(n * ringCount * 3);
  const uvs = new Float32Array(n * ringCount * 2);

  const pn = [];
  for (let i = 0; i < n; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(n - 1, i + 1)];
    let dr = b.r - a.r;
    let dy = b.y - a.y;
    const len = Math.hypot(dr, dy) || 1;
    dr /= len;
    dy /= len;
    pn.push({ r: dy, y: -dr });
  }

  let p = 0;
  let q = 0;
  for (let i = 0; i < n; i++) {
    const pt = points[i];
    const nrm = pn[i];
    for (let s = 0; s <= segments; s++) {
      const u = s / segments;
      const phi = (u - 0.5) * TAU;
      const sn = Math.sin(phi);
      const cs = Math.cos(phi);
      pos[p] = pt.r * sn;
      pos[p + 1] = pt.y;
      pos[p + 2] = pt.r * cs;
      nor[p] = nrm.r * sn;
      nor[p + 1] = nrm.y;
      nor[p + 2] = nrm.r * cs;
      p += 3;
      uvs[q] = u;
      uvs[q + 1] = pt.v;
      q += 2;
    }
  }

  const index = [];
  for (let i = 0; i < n - 1; i++) {
    for (let s = 0; s < segments; s++) {
      const a = i * ringCount + s;
      const b = a + 1;
      const c = a + ringCount;
      const d = c + 1;
      index.push(a, b, c, b, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(index);
  return geo;
}

/* --------------------------------------------------------------------- can */

/*
  Traces the printed band straight off the silhouette so the label texture and
  the geometry share one parameterisation, then caps it with a drawn rim and base.
*/
function canProfiles(an) {
  const { rows, labelTop, labelBottom, bodyR, bottom } = an;
  const yOf = (py) => (labelBottom - py) / bodyR;
  const vOf = (py) => (labelBottom - py) / (labelBottom - labelTop);

  const body = [];
  let lastR = null;
  for (let py = labelBottom; py >= labelTop; py--) {
    const row = rows[py];
    if (!row) continue;
    const r = row.R / bodyR;
    const edge = py === labelBottom || py === labelTop;
    if (edge || lastR === null || Math.abs(r - lastR) > 0.0011) {
      body.push({ r, y: yOf(py), v: vOf(py) });
      lastR = r;
    }
  }
  if (body[body.length - 1].y < yOf(labelTop) - 1e-6) {
    body.push({ r: rows[labelTop].R / bodyR, y: yOf(labelTop), v: 1 });
  }

  /* rim + lid, drawn from can proportions (the photo only shows them in perspective) */
  const tip = body[body.length - 1];
  const rt = tip.r;
  const yt = tip.y;
  const top = [
    { r: rt, y: yt, v: 1 },
    { r: rt * 1.008, y: yt + 0.02, v: 1 },
    { r: rt * 1.006, y: yt + 0.042, v: 1 },
    { r: rt * 0.986, y: yt + 0.058, v: 1 },
    { r: rt * 0.951, y: yt + 0.048, v: 1 },
    { r: rt * 0.934, y: yt + 0.024, v: 1 },
    { r: rt * 0.927, y: yt - 0.002, v: 1 },
    { r: rt * 0.908, y: yt - 0.014, v: 1 },
    { r: rt * 0.86, y: yt - 0.024, v: 1 },
    { r: rt * 0.55, y: yt - 0.031, v: 1 },
    { r: rt * 0.22, y: yt - 0.035, v: 1 },
    { r: 0, y: yt - 0.037, v: 1 },
  ];

  /* base: keep the photographed silhouette while it is still a silhouette, then
     close it with the concave dome a real can stands on */
  const base = [];
  let prev = null;
  for (let py = labelBottom; py <= bottom; py++) {
    const row = rows[py];
    if (!row) continue;
    const r = row.R / bodyR;
    if (r < 0.84) break;
    if (prev === null || Math.abs(r - prev) > 0.0011 || py === labelBottom) {
      base.push({ r, y: yOf(py), v: 0 });
      prev = r;
    }
  }
  const foot = base[base.length - 1] || { r: 0.9, y: -0.1 };
  base.push({ r: foot.r * 0.985, y: foot.y - 0.014, v: 0 });
  base.push({ r: foot.r * 0.94, y: foot.y - 0.018, v: 0 });
  base.push({ r: foot.r * 0.8, y: foot.y + 0.012, v: 0 });
  base.push({ r: foot.r * 0.55, y: foot.y + 0.038, v: 0 });
  base.push({ r: foot.r * 0.26, y: foot.y + 0.055, v: 0 });
  base.push({ r: 0, y: foot.y + 0.062, v: 0 });
  base.reverse();

  return { body, top, base };
}

let canGeoCache = null;

function canGeometries(an) {
  if (!canGeoCache) {
    const p = canProfiles(an);
    let lo = Infinity;
    let hi = -Infinity;
    let radius = 0;
    for (const list of [p.body, p.top, p.base]) {
      for (const q of list) {
        if (q.y < lo) lo = q.y;
        if (q.y > hi) hi = q.y;
        if (q.r > radius) radius = q.r;
      }
    }
    canGeoCache = {
      body: buildLathe(p.body, CFG.canSegments),
      top: buildLathe(p.top, CFG.canSegments),
      base: buildLathe(p.base, CFG.canSegments),
      height: hi - lo,
      centre: (hi + lo) / 2,
      radius,
    };
  }
  return canGeoCache;
}

/*
  The projected size of a lathed can never matches its geometric height exactly —
  perspective and the camera's slight elevation both eat into it. Rather than
  guess a fudge factor, render the can once off-screen and solve for the framing
  that reproduces the source PNG's silhouette (0.916 of the frame, dead centre).
*/
let canFraming = null;

function calibrateCanFraming(renderer, an, labelTex, env) {
  if (canFraming) return canFraming;
  const RW = 220;
  const RH = 330;
  const rt = new THREE.WebGLRenderTarget(RW, RH);
  const scene = new THREE.Scene();
  const can = buildCan(an, labelTex, env);
  const metrics = can.userData.metrics;
  scene.add(can);
  const cam = new THREE.PerspectiveCamera(CFG.canFov, RW / RH, 0.1, 500);
  const buf = new Uint8Array(RW * RH * 4);

  let frameH = metrics.height / CFG.canFill;
  let centre = metrics.centre;

  for (let iter = 0; iter < 4; iter++) {
    can.position.y = -centre;
    const dist = frameH / 2 / Math.tan((CFG.canFov * DEG) / 2);
    const e = CFG.canElevation;
    cam.position.set(0, Math.sin(e) * dist, Math.cos(e) * dist);
    cam.near = dist * 0.2;
    cam.far = dist * 3;
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();

    renderer.setScissorTest(false);
    renderer.setRenderTarget(rt);
    renderer.setViewport(0, 0, RW, RH);
    renderer.clear(true, true, true);
    renderer.render(scene, cam);
    renderer.readRenderTargetPixels(rt, 0, 0, RW, RH, buf);

    let lo = Infinity;
    let hi = -Infinity;
    for (let y = 0; y < RH; y++) {
      for (let x = 0; x < RW; x++) {
        if (buf[(y * RW + x) * 4 + 3] > 140) {
          if (y < lo) lo = y;
          if (y > hi) hi = y;
          break;
        }
      }
    }
    if (hi < 0) break;
    const hFrac = (hi - lo + 1) / RH;
    /* readback rows run bottom-up, so flip into canvas space */
    const centreFrac = 1 - (lo + hi + 1) / 2 / RH;
    centre += (0.5 - centreFrac) * frameH;
    frameH *= hFrac / CFG.canFill;
    if (Math.abs(hFrac - CFG.canFill) < 0.0015 && Math.abs(centreFrac - 0.5) < 0.001) break;
  }

  renderer.setRenderTarget(null);
  rt.dispose();
  canFraming = { frameH, centre };
  return canFraming;
}

function buildCan(an, labelTex, env) {
  const geo = canGeometries(an);
  const group = new THREE.Group();

  const label = new THREE.MeshPhysicalMaterial({
    map: labelTex,
    roughness: 0.52,
    metalness: 0,
    specularIntensity: 0.06,
    envMap: env,
    envMapIntensity: 0.48,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0xdde3e7,
    roughness: 0.17,
    metalness: 1,
    envMap: env,
    envMapIntensity: 1.35,
  });

  group.add(new THREE.Mesh(geo.body, label));
  group.add(new THREE.Mesh(geo.top, metal));
  group.add(new THREE.Mesh(geo.base, metal));
  group.userData.metrics = geo;
  return group;
}

/* ------------------------------------------------------------------ orange */

/*
  The cut face in the photograph is a circle seen at a tilt, so it images as an
  ellipse. These are the fitted parameters (normalised to the source), used to
  un-project the flesh back to a disc.
*/
const CUT = { cx: 0.5629, cy: 0.4617, a: 0.3706, b: 0.3077, angle: 49.49 * DEG, edge: 1.022 };

function buildFleshTexture(img, size) {
  const { ctx, W, H } = rasterise(img);
  const src = ctx.getImageData(0, 0, W, H).data;
  const S = size || 768;

  const out = document.createElement('canvas');
  out.width = S;
  out.height = S;
  const octx = out.getContext('2d');
  const dst = octx.createImageData(S, S);
  const D = dst.data;

  const scale = Math.min(W, H);
  const cx = CUT.cx * W;
  const cy = CUT.cy * H;
  const a = CUT.a * scale * CUT.edge;
  const b = CUT.b * scale * CUT.edge;
  const ca = Math.cos(CUT.angle);
  const sa = Math.sin(CUT.angle);

  /* cream fallback for anything sampled outside the fruit */
  const pith = [246, 232, 198];

  for (let j = 0; j < S; j++) {
    const q = ((j + 0.5) / S) * 2 - 1;
    for (let i = 0; i < S; i++) {
      const p = ((i + 0.5) / S) * 2 - 1;
      const d = (j * S + i) * 4;
      const rr = p * p + q * q;
      if (rr > 1) {
        D[d] = pith[0];
        D[d + 1] = pith[1];
        D[d + 2] = pith[2];
        D[d + 3] = 0;
        continue;
      }
      const sx = cx + p * a * ca - q * b * sa;
      const sy = cy + p * a * sa + q * b * ca;
      const x0 = clamp(Math.floor(sx), 0, W - 1);
      const y0 = clamp(Math.floor(sy), 0, H - 1);
      const x1 = Math.min(W - 1, x0 + 1);
      const y1 = Math.min(H - 1, y0 + 1);
      const fx = clamp(sx - x0, 0, 1);
      const fy = clamp(sy - y0, 0, 1);
      const o00 = (y0 * W + x0) * 4;
      const o10 = (y0 * W + x1) * 4;
      const o01 = (y1 * W + x0) * 4;
      const o11 = (y1 * W + x1) * 4;
      const w00 = (1 - fx) * (1 - fy);
      const w10 = fx * (1 - fy);
      const w01 = (1 - fx) * fy;
      const w11 = fx * fy;
      const alpha = src[o00 + 3] * w00 + src[o10 + 3] * w10 + src[o01 + 3] * w01 + src[o11 + 3] * w11;
      let r = src[o00] * w00 + src[o10] * w10 + src[o01] * w01 + src[o11] * w11;
      let g = src[o00 + 1] * w00 + src[o10 + 1] * w10 + src[o01 + 1] * w01 + src[o11 + 1] * w11;
      let bch = src[o00 + 2] * w00 + src[o10 + 2] * w10 + src[o01 + 2] * w01 + src[o11 + 2] * w11;
      if (alpha < 200) {
        r = pith[0];
        g = pith[1];
        bch = pith[2];
      }
      /* soften the last few percent into the pith so the rim never shows background */
      const rad = Math.sqrt(rr);
      if (rad > 0.972) {
        const t = clamp((rad - 0.972) / 0.028, 0, 1);
        r += (pith[0] - r) * t * 0.45;
        g += (pith[1] - g) * t * 0.45;
        bch += (pith[2] - bch) * t * 0.45;
      }
      D[d] = r;
      D[d + 1] = g;
      D[d + 2] = bch;
      D[d + 3] = 255;
    }
  }
  octx.putImageData(dst, 0, 0);

  const tex = new THREE.CanvasTexture(out);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function buildRindBump(size) {
  const S = size || 512;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 26000; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const r = rand(1.1, 3.4);
    const v = Math.random() < 0.5 ? 0 : 255;
    ctx.fillStyle = `rgba(${v},${v},${v},${rand(0.08, 0.3).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 3);
  return tex;
}

let orangeParts = null;
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);
const TILT_AXIS = new THREE.Vector3();
const Q_FACE = new THREE.Quaternion();
const Q_TILT = new THREE.Quaternion();
const Q_ROLL = new THREE.Quaternion();
const Q_ORBIT = new THREE.Quaternion();
Q_FACE.setFromAxisAngle(AXIS_X, Math.PI / 2);

/*
  A cut orange is not flat — the flesh bulges a little past the peel. Building the
  face as a shallow paraboloid (rather than a disc) is what stops the slices from
  reading as stickers once they are lit.
*/
function buildFleshCap(segments, rings, bulge) {
  const pos = [];
  const nor = [];
  const uv = [];
  const idx = [];
  for (let i = 0; i <= rings; i++) {
    const r = i / rings;
    const y = bulge * (1 - r * r);
    for (let j = 0; j <= segments; j++) {
      const a = (j / segments) * TAU;
      const x = r * Math.cos(a);
      const z = r * Math.sin(a);
      pos.push(x, y, z);
      const nx = 2 * bulge * x;
      const nz = 2 * bulge * z;
      const len = Math.hypot(nx, 1, nz);
      nor.push(nx / len, 1 / len, nz / len);
      uv.push(0.5 + x * 0.5, 0.5 + z * 0.5);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j;
      const b = a + 1;
      const c = a + segments + 1;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
}

function orangeResources(fleshTex, env) {
  if (orangeParts) return orangeParts;
  const rind = new THREE.SphereGeometry(1, 48, 26, 0, TAU, Math.PI / 2, Math.PI / 2);
  rind.scale(1, 0.96, 1);
  const flesh = buildFleshCap(72, 10, 0.075);
  flesh.scale(0.998, 1, 0.998);
  flesh.translate(0, -0.026, 0);

  const bump = buildRindBump(512);
  const rindMat = new THREE.MeshStandardMaterial({
    color: 0xd67420,
    roughness: 0.72,
    metalness: 0,
    bumpMap: bump,
    bumpScale: 0.55,
    envMap: env,
    envMapIntensity: 0.3,
  });
  const fleshMat = new THREE.MeshPhysicalMaterial({
    map: fleshTex,
    color: 0xeae6df,
    roughness: 0.44,
    metalness: 0,
    specularIntensity: 0.3,
    clearcoat: 0.14,
    clearcoatRoughness: 0.34,
    envMap: env,
    envMapIntensity: 0.26,
  });
  orangeParts = { rind, flesh, rindMat, fleshMat };
  return orangeParts;
}

function buildOrange(fleshTex, env, translucent) {
  const parts = orangeResources(fleshTex, env);
  const group = new THREE.Group();
  const rindMat = translucent ? parts.rindMat.clone() : parts.rindMat;
  const fleshMat = translucent ? parts.fleshMat.clone() : parts.fleshMat;
  if (translucent) {
    rindMat.transparent = true;
    fleshMat.transparent = true;
  }
  group.add(new THREE.Mesh(parts.rind, rindMat));
  group.add(new THREE.Mesh(parts.flesh, fleshMat));
  group.userData.mats = [rindMat, fleshMat];
  return group;
}

/* ------------------------------------------------------------- environment */

function buildEnv(renderer) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');

  /* A soft warm light tent. Broad and bright all round — that is what gives the
     source product shot its gentle wrap across the cylinder rather than a hard
     directional falloff. */
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#fffaf3');
  g.addColorStop(0.34, '#f4e7da');
  g.addColorStop(0.52, '#dcc4b0');
  g.addColorStop(0.74, '#8d6350');
  g.addColorStop(1, '#301a14');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);

  /* Soft boxes. A camera-facing normal reflects to u = 0.75, and rotating the
     surface by θ moves the sampled direction by 2θ, so these two panels land as
     the off-centre highlight bands the photograph has. */
  const panel = (x, w, alpha) => {
    const lg = ctx.createLinearGradient(x - w, 0, x + w, 0);
    lg.addColorStop(0, 'rgba(255,255,255,0)');
    lg.addColorStop(0.5, `rgba(255,253,249,${alpha})`);
    lg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(x - w, 24, w * 2, 285);
  };
  panel(596, 62, 0.95);
  panel(944, 86, 0.7);
  panel(84, 86, 0.7);
  panel(340, 70, 0.4);

  /* The hole the camera shoots through. Without it every surface facing the lens
     picks up a specular veil the studio original does not have. */
  const hole = ctx.createRadialGradient(768, 250, 10, 768, 250, 165);
  hole.addColorStop(0, 'rgba(24,13,10,1)');
  hole.addColorStop(0.5, 'rgba(24,13,10,0.92)');
  hole.addColorStop(1, 'rgba(24,13,10,0)');
  ctx.fillStyle = hole;
  ctx.beginPath();
  ctx.arc(768, 250, 165, 0, TAU);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}

function studioLights(scene, warm) {
  const hemi = new THREE.HemisphereLight(0xfffdf8, warm ? 0x8a3a24 : 0x4a2416, LIGHTS.hemi);
  scene.add(hemi);
  /* two symmetric keys plus a back rim: the source render is lit frontally by a
     broad soft box, so the falloff to either silhouette edge is nearly equal */
  const keyL = new THREE.DirectionalLight(0xffffff, LIGHTS.key);
  keyL.position.set(-2.0, 1.85, 4.5);
  scene.add(keyL);
  const keyR = new THREE.DirectionalLight(0xfffaf4, LIGHTS.fill);
  keyR.position.set(2.0, 1.7, 4.5);
  scene.add(keyR);
  const rim = new THREE.DirectionalLight(0xfff0e0, LIGHTS.rim);
  rim.position.set(0.8, 1.5, -3.8);
  scene.add(rim);
}

/* ------------------------------------------------------------------- slots */

class Slot {
  constructor(el, dprCap) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.dprCap = dprCap;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.pw = 0;
    this.ph = 0;
    this.fixedBuffer = false;
    this.interactive = false;
    this.lastT = null;
    /* Claim the canvas so a late-arriving placeholder cannot paint over a frame */
    el.dataset.threeReady = '1';
  }

  isVisible() {
    const el = this.el;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (r.bottom < -120 || r.top > innerHeight + 120 || r.right < -120 || r.left > innerWidth + 120) return false;
    if (el.checkVisibility) {
      /* both the standard and the older Chrome option names, so the opacity test
         is not silently dropped on browsers that predate the rename */
      const ok = el.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
        contentVisibilityAuto: true,
        checkOpacity: true,
        checkVisibilityCSS: true,
      });
      if (!ok) return false;
    }
    /* Layers such as the page-wide citrus field are faded out by an ancestor, and
       checkVisibility cannot be relied on for that everywhere. */
    let node = el;
    for (let depth = 0; node && depth < 6; depth++) {
      const style = getComputedStyle(node);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      if (Number(style.opacity) < 0.02) return false;
      node = node.parentElement;
    }
    return true;
  }

  syncSize() {
    if (this.fixedBuffer) {
      this.pw = this.el.width;
      this.ph = this.el.height;
      return;
    }
    const w = this.el.clientWidth || this.el.offsetWidth;
    const h = this.el.clientHeight || this.el.offsetHeight;
    const dpr = Math.min(devicePixelRatio || 1, this.dprCap);
    const pw = Math.max(2, Math.round(w * dpr));
    const ph = Math.max(2, Math.round(h * dpr));
    if (pw !== this.el.width || ph !== this.el.height) {
      this.el.width = pw;
      this.el.height = ph;
    }
    this.pw = pw;
    this.ph = ph;
    if (this.onResize) this.onResize(w, h);
  }

  update() {}
}

/* ---------------------------------------------------------------- can slot */

class CanSlot extends Slot {
  constructor(el, an, labelTex, env) {
    super(el, 2);
    this.fixedBuffer = true;
    this.can = buildCan(an, labelTex, env);
    this.metrics = this.can.userData.metrics;
    const framing = canFraming || { frameH: this.metrics.height / CFG.canFill, centre: this.metrics.centre };
    this.can.position.y = -framing.centre;
    this.pivot = new THREE.Group();
    this.pivot.add(this.can);
    this.scene.add(this.pivot);
    studioLights(this.scene, true);

    const frameH = framing.frameH;
    const dist = frameH / 2 / Math.tan((CFG.canFov * DEG) / 2);
    this.camera = new THREE.PerspectiveCamera(CFG.canFov, 1, dist * 0.2, dist * 3);
    const e = CFG.canElevation;
    this.camera.position.set(0, Math.sin(e) * dist, Math.cos(e) * dist);
    this.camera.lookAt(0, 0, 0);
    this.seed = Math.random() * 10;

    this.interactive = true;
    this.hovering = false;
    this.dragging = false;
    this.hover = 0;
    this.spinAngle = 0;
    this.spinVelocity = 0;
    this.pitch = 0;
    this.lastT = null;
    this.el.style.touchAction = 'pan-y';
    this.el.style.cursor = 'grab';
    this.bindPointer();
  }

  bindPointer() {
    const el = this.el;
    let lastX = 0;
    let lastY = 0;
    el.addEventListener('pointerenter', () => { this.hovering = true; });
    el.addEventListener('pointerleave', () => { this.hovering = false; });
    el.addEventListener('pointerdown', (event) => {
      this.dragging = true;
      this.spinVelocity = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      el.style.cursor = 'grabbing';
      el.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    el.addEventListener('pointermove', (event) => {
      if (!this.dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      const turn = dx * CFG.canDragPerPixel;
      this.spinAngle += turn;
      /* carried into the release so the can keeps spinning under its own weight */
      this.spinVelocity = turn * 26;
      this.pitch = clamp(this.pitch + dy * 0.005, -CFG.canPitchLimit, CFG.canPitchLimit);
    });
    const release = (event) => {
      if (!this.dragging) return;
      this.dragging = false;
      el.style.cursor = 'grab';
      if (event && el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  }

  layout() {
    const cssW = this.el.clientWidth || this.el.offsetWidth || 300;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = clamp(Math.round((cssW * dpr) / 8) * 8, 128, 1280);
    const h = Math.round(w * 1.5);
    if (this.el.width !== w) this.el.width = w;
    if (this.el.height !== h) this.el.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  update(t) {
    const s = this.seed;
    const dt = this.lastT === null ? 0 : clamp(t - this.lastT, 0, 0.1);
    this.lastT = t;
    const engaged = this.hovering || this.dragging;
    this.hover = approach(this.hover, engaged ? 1 : 0, engaged ? 9 : 4, dt);

    if (this.dragging) {
      this.spinVelocity = approach(this.spinVelocity, 0, 6, dt);
    } else {
      /* let the throw run out, then unwind to the nearest front-facing turn */
      this.spinAngle += this.spinVelocity * dt;
      this.spinVelocity = approach(this.spinVelocity, 0, 3.4, dt);
      if (this.hovering) {
        this.spinAngle += dt * this.hover * CFG.canOrbitRate;
      } else if (Math.abs(this.spinVelocity) < 0.12) {
        this.spinAngle = approach(this.spinAngle, settleTurn(this.spinAngle), 2.2, dt);
        this.pitch = approach(this.pitch, 0, 2.2, dt);
      }
    }

    const calm = 1 - this.hover;
    const scroll = this.scrollDrive ? this.scrollDrive() : 0;
    this.pivot.rotation.y = Math.sin(t * 0.34 + s) * CFG.idleYaw * calm + scroll * CFG.scrollYaw * calm + this.spinAngle;
    this.pivot.rotation.x = Math.sin(t * 0.27 + s * 1.7) * CFG.idleTilt * calm + this.pitch;
    this.pivot.rotation.z = Math.sin(t * 0.21 + s * 2.3) * 0.6 * DEG * calm;
  }
}

/* ------------------------------------------------------------- citrus slot */

class CitrusSlot extends Slot {
  constructor(el, fleshTex, env, opts) {
    super(el, opts.dprCap || 1.35);
    this.opts = opts;
    studioLights(this.scene, false);
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    this.camDist = 1 / Math.tan(17 * DEG);
    this.camera.position.set(0, 0, this.camDist);
    this.items = [];
    this.build(fleshTex, env);
  }

  build(fleshTex, env) {
    const n = this.opts.count;
    /* stratified lanes: pure random clumps badly at these counts */
    const lanes = [];
    for (let i = 0; i < n; i++) lanes.push((i + 0.5) / n);
    for (let i = lanes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lanes[i], lanes[j]] = [lanes[j], lanes[i]];
    }
    for (let i = 0; i < n; i++) {
      const g = buildOrange(fleshTex, env, this.opts.fade !== false);
      const z = rand(-1.1, 0.55);
      g.userData.spec = {
        z,
        px: clamp(lanes[i] + rand(-0.4, 0.4) / n, -0.05, 1.05),
        radiusPx: rand(this.opts.minPx, this.opts.maxPx),
        speed: rand(this.opts.minSpeed, this.opts.maxSpeed),
        phase: (i / n + rand(-0.3, 0.3) / n + 1) % 1,
        roll: rand(0, TAU),
        rollRate: rand(0.06, 0.2) * (Math.random() < 0.5 ? -1 : 1),
        tiltMax: rand(0.26, 0.72),
        tiltRate: rand(0.1, 0.26),
        tiltPhase: rand(0, TAU),
        axisRate: rand(0.06, 0.17) * (Math.random() < 0.5 ? -1 : 1),
        axisPhase: rand(0, TAU),
        opacity: rand(this.opts.minOpacity, this.opts.maxOpacity),
        hover: 0,
        orbit: 0,
      };
      g.position.z = z;
      this.scene.add(g);
      this.items.push(g);
    }
  }

  onResize(w, h) {
    this.cssW = w;
    this.cssH = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  update(t) {
    const h = this.cssH || 1;
    const w = this.cssW || 1;
    const aspect = w / h;
    const dt = this.lastT === null ? 0 : clamp(t - this.lastT, 0, 0.1);
    this.lastT = t;

    /* The layer never takes pointer events, so work out where the cursor sits
       over it and hit-test the slices in screen space instead. */
    let px = -1e5;
    let py = -1e5;
    if (POINTER.active) {
      const rect = this.el.getBoundingClientRect();
      const localX = POINTER.x - rect.left;
      const localY = POINTER.y - rect.top;
      if (localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height) {
        px = (localX / rect.width) * w;
        py = (localY / rect.height) * h;
      }
    }

    for (const g of this.items) {
      const s = g.userData.spec;
      /* world units: the frustum is 2 tall at z = 0 */
      const depth = this.camDist - s.z;
      const scale = depth / this.camDist;
      const unit = (2 / h) * scale;
      const radius = s.radiusPx * 0.5 * unit;

      const span = 2 * scale + radius * 4;
      const travel = (t * s.speed + s.phase) % 1;
      const y = span / 2 - travel * span;
      g.position.y = this.opts.rise ? -y : y;
      g.position.x = (s.px - 0.5) * 2 * aspect * scale + Math.sin(t * 0.18 + s.phase * TAU) * 0.06;

      /* the scale above is chosen so a slice covers radiusPx on screen at any
         depth, which makes the hit-test a plain circle test */
      const screenX = (g.position.x / (aspect * scale) * 0.5 + 0.5) * w;
      const screenY = (0.5 - (g.position.y / scale) * 0.5) * h;
      const reach = s.radiusPx * 0.55;
      const over = g.visible !== false
        && px > -1e4
        && (screenX - px) * (screenX - px) + (screenY - py) * (screenY - py) < reach * reach;
      s.hover = approach(s.hover, over ? 1 : 0, over ? 11 : 4.5, dt);

      g.scale.setScalar(radius * (1 + 0.1 * s.hover));

      /* Hovering spins the slice on a turntable; letting go carries it round to
         the nearest whole turn rather than snapping back. */
      s.orbit += dt * s.hover * CFG.orangeOrbitRate;
      if (s.hover < 0.03) s.orbit = approach(s.orbit, settleTurn(s.orbit), 2.4, dt);

      /* Keep the cut face broadly toward the viewer — a slice that tumbles all the
         way over just reads as a plain orange blob — but let it roll about its own
         axis and lean on a wandering tilt so the form stays unmistakably 3D. */
      const axis = t * s.axisRate * TAU + s.axisPhase;
      TILT_AXIS.set(Math.cos(axis), Math.sin(axis), 0);
      Q_TILT.setFromAxisAngle(TILT_AXIS, s.tiltMax * Math.sin(t * s.tiltRate * TAU + s.tiltPhase));
      Q_ROLL.setFromAxisAngle(AXIS_Z, t * s.rollRate * TAU + s.roll);
      Q_ORBIT.setFromAxisAngle(AXIS_Y, s.orbit);
      g.quaternion.copy(Q_ORBIT).multiply(Q_TILT).multiply(Q_ROLL).multiply(Q_FACE);

      if (this.opts.fade !== false) {
        const edge = clamp(Math.min(travel / 0.14, (1 - travel) / 0.16), 0, 1);
        const o = clamp(s.opacity * edge * (1 + 0.3 * s.hover), 0, 1);
        for (const m of g.userData.mats) m.opacity = o;
        g.visible = o > 0.01;
      }
    }
  }
}

/* ------------------------------------------------------- single fruit slot */

class FruitSlot extends Slot {
  constructor(el, fleshTex, env, opts) {
    super(el, 2);
    this.opts = opts || {};
    studioLights(this.scene, false);
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
    const dist = 1.24 / Math.tan(15 * DEG);
    this.camera.position.set(0, 0, dist);
    this.orange = buildOrange(fleshTex, env, false);
    this.orange.rotation.set(0.98, 0.35, 0.2);
    this.pivot = new THREE.Group();
    this.pivot.add(this.orange);
    this.scene.add(this.pivot);
    this.seed = Math.random() * 10;
    this.hover = 0;
    this.orbit = 0;
    this.lastT = null;
  }

  onResize(w, h) {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  update(t) {
    const s = this.seed;
    const dt = this.lastT === null ? 0 : clamp(t - this.lastT, 0, 0.1);
    this.lastT = t;

    let over = false;
    if (POINTER.active) {
      const rect = this.el.getBoundingClientRect();
      const dx = POINTER.x - (rect.left + rect.width / 2);
      const dy = POINTER.y - (rect.top + rect.height / 2);
      const reach = Math.min(rect.width, rect.height) * 0.44;
      over = dx * dx + dy * dy < reach * reach;
    }
    this.hover = approach(this.hover, over ? 1 : 0, over ? 11 : 4.5, dt);
    this.orbit += dt * this.hover * CFG.orangeOrbitRate;
    if (this.hover < 0.03) this.orbit = approach(this.orbit, settleTurn(this.orbit), 2.4, dt);

    const calm = 1 - this.hover;
    this.pivot.rotation.y = Math.sin(t * 0.3 + s) * 0.5 * calm + this.orbit;
    this.pivot.rotation.x = Math.sin(t * 0.23 + s) * 0.22 * calm;
  }
}

/* -------------------------------------------------------------------- boot */

async function boot() {
  const canvases = [...document.querySelectorAll('canvas[data-can3d]')];
  const citrusEls = [...document.querySelectorAll('canvas[data-citrus3d]')];
  if (!canvases.length && !citrusEls.length) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    return;
  }
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 0);

  const env = buildEnv(renderer);

  const canSrcs = [...new Set(canvases.map((c) => c.dataset.can3d))];
  const orangeSrc = citrusEls[0] && citrusEls[0].dataset.citrusSrc;

  const [canImages, orangeImage] = await Promise.all([
    Promise.all(canSrcs.map((s) => loadImage(s))),
    orangeSrc ? loadImage(orangeSrc) : Promise.resolve(null),
  ]);

  const analyses = new Map();
  const labels = new Map();
  canSrcs.forEach((src, i) => {
    const an = analyseCan(canImages[i]);
    analyses.set(src, an);
    labels.set(src, buildLabelTexture(an));
  });

  const fleshTex = orangeImage ? buildFleshTexture(orangeImage, 768) : null;

  const slots = [];

  if (canSrcs.length) {
    const first = canSrcs[0];
    calibrateCanFraming(renderer, analyses.get(first), labels.get(first), env);
  }

  for (const el of canvases) {
    const src = el.dataset.can3d;
    const slot = new CanSlot(el, analyses.get(src), labels.get(src), env);
    slot.layout();
    if (el.closest('.journey-can')) {
      /* the travelling hero can turns as it is scrolled down the page, starting
         square-on so the wordmark reads at rest */
      slot.scrollDrive = () => clamp(scrollY / (innerHeight * 3.4), 0, 1);
    }
    slots.push(slot);
  }

  if (fleshTex) {
    for (const el of citrusEls) {
      const kind = el.dataset.citrus3d;
      let slot;
      if (kind === 'hero') {
        slot = new CitrusSlot(el, fleshTex, env, {
          count: matchMedia('(max-width:800px)').matches ? 7 : 11,
          minPx: 58,
          maxPx: 168,
          minSpeed: 0.024,
          maxSpeed: 0.05,
          minOpacity: 0.55,
          maxOpacity: 0.86,
          dprCap: 1.4,
        });
      } else if (kind === 'page') {
        slot = new CitrusSlot(el, fleshTex, env, {
          count: matchMedia('(max-width:800px)').matches ? 7 : 11,
          minPx: 48,
          maxPx: 142,
          minSpeed: 0.018,
          maxSpeed: 0.04,
          minOpacity: 0.32,
          maxOpacity: 0.68,
          dprCap: 1.3,
        });
      } else {
        slot = new FruitSlot(el, fleshTex, env, {});
      }
      slots.push(slot);
    }
  }

  /* one framebuffer big enough for the largest slot */
  const resize = () => {
    let mw = 2;
    let mh = 2;
    for (const s of slots) {
      if (s.layout) s.layout();
      s.syncSize();
      mw = Math.max(mw, s.pw);
      mh = Math.max(mh, s.ph);
    }
    renderer.setSize(mw, mh, false);
  };
  resize();
  addEventListener('resize', () => {
    clearTimeout(resize._t);
    resize._t = setTimeout(resize, 180);
  }, { passive: true });

  document.documentElement.classList.add('has-aurello-3d');

  const gl = renderer.domElement;
  const t0 = performance.now();

  /* Reduced motion keeps the geometry and lighting but freezes the clock, so the
     page shows still 3D product shots. A frozen slot only has to be painted once,
     so it settles instead of redrawing the same frame sixty times a second. */
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const MAX_BUFFER = 4096;
  const draw = (t) => {
    /* Collect what is on screen first: the shared framebuffer has to be at least
       as large as the biggest live slot, and slots grow with the viewport, so it
       is sized here rather than only on resize — otherwise a slot that outgrows
       the buffer would silently stop drawing until the next resize event. */
    const active = [];
    let needW = 2;
    let needH = 2;
    for (const slot of slots) {
      const live = slot.isVisible();
      /* An interactive canvas that has faded out must stop swallowing clicks —
         and if it goes inert while the cursor is on it, no pointerleave arrives,
         so the hover has to be cleared here. */
      if (slot.interactive) {
        slot.el.style.pointerEvents = live ? 'auto' : 'none';
        if (!live && (slot.hovering || slot.dragging)) {
          slot.hovering = false;
          slot.dragging = false;
        }
      }
      if (!live) continue;
      slot.syncSize();
      if (!slot.pw || !slot.ph) continue;
      active.push(slot);
      if (slot.pw > needW) needW = slot.pw;
      if (slot.ph > needH) needH = slot.ph;
    }
    if (!active.length) return;
    if (needW > gl.width || needH > gl.height) {
      renderer.setSize(
        Math.min(MAX_BUFFER, Math.max(needW, gl.width)),
        Math.min(MAX_BUFFER, Math.max(needH, gl.height)),
        false,
      );
    }
    for (const slot of active) {
      const w = Math.min(slot.pw, gl.width);
      const h = Math.min(slot.ph, gl.height);
      if (still && slot.settledW === w && slot.settledH === h) continue;
      slot.settledW = still ? w : -1;
      slot.settledH = still ? h : -1;
      slot.update(t);
      renderer.setViewport(0, gl.height - h, w, h);
      renderer.setScissor(0, gl.height - h, w, h);
      renderer.setScissorTest(true);
      renderer.clear(true, true, true);
      renderer.render(slot.scene, slot.camera);
      slot.ctx.clearRect(0, 0, slot.el.width, slot.el.height);
      slot.ctx.drawImage(gl, 0, 0, w, h, 0, 0, slot.el.width, slot.el.height);
    }
  };
  const frame = (now) => {
    requestAnimationFrame(frame);
    draw(still ? 4.2 : (now - t0) / 1000);
  };
  requestAnimationFrame(frame);
}

boot().catch((err) => {
  console.warn('aurello3d: falling back to stills', err);
});
