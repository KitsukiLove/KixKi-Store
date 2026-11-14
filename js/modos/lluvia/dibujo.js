/*
  Dibujo de las gotas, rastros e impactos en pixel art.
*/

/* ---- dibujo ---- */
export function streaks(ctx, arr, n, col, alpha, sh) {
  for (let i = 0; i < n; i++) {
    const d = arr[i];
    for (let k = 0; k < d.l; k++) {
      const px = Math.round(d.x - d.vx * k * 0.5),
        py = Math.round(d.y - k);
      ctx.globalAlpha = d.a * alpha * 0.55;
      ctx.fillStyle = sh;
      ctx.fillRect(px + 1, py, 1, 1);
      ctx.globalAlpha = Math.min(1, d.a * alpha * (1.25 - (k / d.l) * 0.5));
      ctx.fillStyle = col;
      ctx.fillRect(px, py, 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

export function dropShape(ctx, d, P, sc) {
  const r = d.r,
    hr = r + (r > 1 ? 1 : 0),
    a = d.a;
  ctx.globalAlpha = a;
  for (let dy = -hr; dy <= hr; dy++) {
    const u = dy / (hr + 0.5),
      w = Math.max(r > 1 ? 1 : 0, Math.floor(Math.sqrt(Math.max(0, 1 - u * u)) * r * sc + 0.01));
    ctx.fillStyle = P.fill;
    ctx.fillRect(d.x - w, d.y + dy, w * 2 + 1, 1);
    if (dy >= hr - 1 && r > 1) {
      ctx.fillStyle = P.edge;
      ctx.fillRect(d.x - w + 1, d.y + dy, Math.max(1, w * 2 - 1), 1);
    }
  }
  ctx.fillStyle = P.edge;
  ctx.fillRect(d.x + (r > 1 ? r - 1 : 1), d.y + (r > 1 ? 1 : 0), 1, Math.max(1, r - 1));
  ctx.fillStyle = P.hi;
  ctx.fillRect(d.x - Math.max(1, r - 1), d.y - Math.max(0, hr - 1), 1, 1);
  if (r > 2) ctx.fillRect(d.x - Math.max(1, r - 1) + 1, d.y - hr + 1, 1, 1);
  ctx.globalAlpha = 1;
}

export function impact(ctx, d, P) {
  const t = d.t; /* 0..9 */
  const rr = d.r + t * 0.55,
    al = Math.max(0, 1 - t / 9);
  ctx.globalAlpha = al * 0.85;
  ctx.fillStyle = P.hi;
  for (let k = 0; k < 8; k++) {
    const an = (k * Math.PI) / 4 + 0.2;
    ctx.fillRect(
      Math.round(d.x + Math.cos(an) * rr),
      Math.round(d.y + Math.sin(an) * rr * 0.8),
      1,
      1
    );
  }
  ctx.globalAlpha = 1;
}
