/* Shared spectral engine for the colour-pipeline demos (loaded after demo-lib.js).
   A spectrum is an N-vector over [LMIN, LMAX] nm; the sensor keeps only the three
   filter-weighted sums of it. Everything downstream (metamers, white balance, CCM)
   follows from that linear collapse, so the machinery lives here once. */
"use strict";

const SPEC = (() => {
  const LMIN = 380, LMAX = 730, N = 176;
  const lam = i => LMIN + (LMAX - LMIN) * i / (N - 1);
  const gauss = (x, mu, s) => { const t = (x - mu) / s; return Math.exp(-0.5 * t * t); };
  const sig = x => 1 / (1 + Math.exp(-x));

  /* Stylised camera colour filters; sigma scale k widens/narrows all three
     (more overlap = more channel crosstalk). */
  const FILDEF = [
    { mu: 615, s: 32, c: '#e5484d', n: 'R' },
    { mu: 540, s: 30, c: '#46a758', n: 'G' },
    { mu: 455, s: 26, c: '#3e63dd', n: 'B' },
  ];
  function makeFilters(k) {
    k = k || 1;
    const def = FILDEF.map(f => ({ ...f, s: f.s * k }));
    const Fv = def.map(f => Array.from({ length: N }, (_, i) => gauss(lam(i), f.mu, f.s)));
    const Fsum = Fv.map(v => v.reduce((a, b) => a + b, 0));
    const resp = S => Fv.map((f, j) => { let d = 0; for (let i = 0; i < N; i++) d += S[i] * f[i]; return d / Fsum[j]; });
    return { def, Fv, Fsum, resp };
  }
  const F0 = makeFilters(1);

  function solve3(A, b) {
    const M = A.map((r, i) => [...r, b[i]]);
    for (let c = 0; c < 3; c++) {
      let p = c; for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = 0; r < 3; r++) if (r !== c && Math.abs(M[c][c]) > 1e-12) {
        const f = M[r][c] / M[c][c];
        for (let j = c; j < 4; j++) M[r][j] -= f * M[c][j];
      }
    }
    return M.map((r, i) => r[3] / (Math.abs(r[i]) > 1e-12 ? r[i] : 1));
  }

  /* Spike mixture with the same three responses as S: 3 unknown spike weights,
     3 response equations. The response is linear in the spectrum, so every blend
     between S and its partner keeps the numbers frozen. */
  const BUMPS = [620, 545, 455].map(mu => Array.from({ length: N }, (_, i) => gauss(lam(i), mu, 13)));
  function metamerOf(S, F) {
    F = F || F0;
    const c = F.resp(S);
    const A = F.Fv.map((f, k) => BUMPS.map(bm => { let d = 0; for (let i = 0; i < N; i++) d += bm[i] * f[i]; return d / F.Fsum[k]; }));
    const w = solve3(A, c);
    return Array.from({ length: N }, (_, i) => Math.max(0, w[0] * BUMPS[0][i] + w[1] * BUMPS[1][i] + w[2] * BUMPS[2][i]));
  }

  /* Blackbody radiance at temperature T (unnormalised; sampleFn rescales). */
  function planck(l, T) {
    const x = 1e-9 * l, c2 = 1.4388e-2 / T;
    return 1 / (Math.pow(x, 5) * (Math.exp(c2 / x) - 1));
  }

  /* Sample fn(lambda) onto the grid, normalised to peak 1. */
  function sampleFn(fn) {
    const S = Array.from({ length: N }, (_, i) => fn(lam(i)));
    const mx = Math.max(...S, 1e-9);
    return S.map(v => v / mx);
  }

  function wl2rgb(l) { /* crude visible-wavelength colour, for the axis strip */
    let r = 0, g = 0, b = 0;
    if (l < 440) { r = -(l - 440) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; }
    else if (l < 510) { g = 1; b = -(l - 510) / 20; } else if (l < 580) { r = (l - 510) / 70; g = 1; }
    else if (l < 645) { r = 1; g = -(l - 645) / 65; } else r = 1;
    let f = 1;
    if (l < 420) f = 0.3 + 0.7 * (l - LMIN) / 40; else if (l > 680) f = 0.3 + 0.7 * (LMAX - l) / 50;
    return [r * f, g * f, b * f].map(v => Math.round(255 * Math.pow(Math.max(0, v), 0.8)));
  }

  /* Relative display colour of a response triple (max channel at full brightness). */
  function swatch(c) {
    const mx = Math.max(...c, 1e-6);
    return c.map(v => Math.round(255 * Math.pow(Math.max(0, v) / mx, 1 / 2.2)));
  }

  /* ---- spectrum-panel drawing (all take the geometry from geom()) ---- */
  function geom(W, H, o) {
    o = o || {};
    const px0 = o.left ?? 40, px1 = W - (o.right ?? 138);
    const py0 = o.top ?? 18, py1 = o.py1 ?? (H - (o.bottom ?? 48));
    const ymax = o.ymax || 1.12;
    return {
      px0, px1, py0, py1,
      X: i => px0 + (px1 - px0) * i / (N - 1),
      Y: v => py1 - (py1 - py0) * v / ymax,
      Xl: l => px0 + (px1 - px0) * (l - LMIN) / (LMAX - LMIN),
    };
  }

  function drawAxis(ctx, g) {
    for (let x = g.px0; x < g.px1; x++) {
      const l = LMIN + (LMAX - LMIN) * (x - g.px0) / (g.px1 - g.px0);
      const [r, gr, b] = wl2rgb(l);
      ctx.fillStyle = `rgb(${r},${gr},${b})`;
      ctx.fillRect(x, g.py1 + 6, 1.5, 8);
    }
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(g.px0, g.py1); ctx.lineTo(g.px1, g.py1); ctx.stroke();
    [400, 500, 600, 700].forEach(l => label(ctx, l + '', g.Xl(l) - 11, g.py1 + 26, 'rgba(255,255,255,.45)', 11));
    label(ctx, 'wavelength (nm)', g.px0, g.py1 + 40, 'rgba(255,255,255,.35)', 11);
  }

  function drawFilters(ctx, g, F, o) {
    F = F || F0; o = o || {};
    F.def.forEach((f, k) => {
      ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0));
      for (let i = 0; i < N; i++) ctx.lineTo(g.X(i), g.Y(F.Fv[k][i]));
      ctx.lineTo(g.X(N - 1), g.Y(0)); ctx.closePath();
      if (!o.noFill) { ctx.fillStyle = f.c + (o.fillA || '22'); ctx.fill(); }
      dash(ctx, !!o.dashed);
      ctx.strokeStyle = f.c + (o.strokeA || '77'); ctx.lineWidth = o.lw || 1.2; ctx.stroke();
      dash(ctx, false);
      if (!o.noLabel) label(ctx, f.n, g.Xl(f.mu) - 4, g.py0 + 12, f.c, 12);
    });
  }

  /* Shade the wavelengths the three filters barely see. */
  function drawBlind(ctx, g, F) {
    F = F || F0;
    ctx.fillStyle = 'rgba(0,0,0,.42)';
    for (let i = 0; i < N - 1; i++) {
      if (F.Fv[0][i] + F.Fv[1][i] + F.Fv[2][i] < 0.04)
        ctx.fillRect(g.X(i), g.py0, g.X(i + 1) - g.X(i) + 0.5, g.py1 - g.py0);
    }
  }

  function drawCurve(ctx, g, S, color, lw, dashed) {
    dash(ctx, !!dashed);
    ctx.strokeStyle = color; ctx.lineWidth = lw || 2.2;
    ctx.beginPath();
    for (let i = 0; i < N; i++) i ? ctx.lineTo(g.X(i), g.Y(S[i])) : ctx.moveTo(g.X(i), g.Y(S[i]));
    ctx.stroke();
    dash(ctx, false);
  }

  return { LMIN, LMAX, N, lam, gauss, sig, makeFilters, F0, solve3, metamerOf, planck, sampleFn, wl2rgb, swatch, geom, drawAxis, drawFilters, drawBlind, drawCurve };
})();
