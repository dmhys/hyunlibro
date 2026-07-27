/* Shared runtime for the interactive demos embedded via the `demo` shortcode.
   Loaded by each demo before its own script; everything below is in CSS pixels. */
"use strict";

/* Follow the parent page's body[theme]; fall back to OS preference when standalone. */
function syncTheme(){
  let t = null;
  try{ if(window.parent !== window) t = window.parent.document.body.getAttribute('theme'); }catch(e){}
  if(!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('theme', t);
}
syncTheme();
try{
  new MutationObserver(syncTheme)
    .observe(window.parent.document.body, {attributes:true, attributeFilter:['theme']});
}catch(e){}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTheme);

/* Size the backing store for the display density and scale the context so all
   drawing code can stay in CSS pixels.

   The logical height is cached on first call: assigning canvas.height writes the
   height content attribute (the IDL attribute reflects it), so re-reading that
   attribute later would return the DPR-scaled value and the canvas would grow by
   a factor of DPR on every redraw. */
function fit(cv){
  const dpr = window.devicePixelRatio || 1;
  if(!cv.dataset.baseH) cv.dataset.baseH = cv.getAttribute('height');
  const w = cv.clientWidth, h = parseInt(cv.dataset.baseH,10);
  cv.style.height = h+'px';
  cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr);
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  return {ctx,W:w,H:h};
}

/* Per-pixel drawing that respects the context transform.

   putImageData is specified to ignore the transformation matrix and write raw
   device pixels, so using it directly renders at 1/DPR scale and at the wrong
   position. This rasterises offscreen at device resolution and blits with
   drawImage, which is transform-aware.

   `paint(x, y, i, data)` is called for every device pixel; write RGBA into
   data[i..i+3]. `x`/`y` are in CSS pixels relative to the layer's top-left. */
function pixelLayer(ctx, dx, dy, w, h, paint){
  const dpr = window.devicePixelRatio || 1;
  const pw = Math.max(1, Math.round(w*dpr)), ph = Math.max(1, Math.round(h*dpr));
  const img = ctx.createImageData(pw, ph);
  for(let py=0; py<ph; py++)for(let px=0; px<pw; px++){
    paint(px/dpr, py/dpr, 4*(py*pw+px), img.data);
  }
  const off = document.createElement('canvas');
  off.width = pw; off.height = ph;
  off.getContext('2d').putImageData(img, 0, 0);
  ctx.drawImage(off, dx, dy, w, h);
}

function dash(ctx,on){ ctx.setLineDash(on?[5,5]:[]); }

function label(ctx,txt,x,y,color,size){
  ctx.fillStyle=color; ctx.font=(size||12)+'px "Source Code Pro",Consolas,monospace';
  ctx.fillText(txt,x,y);
}
