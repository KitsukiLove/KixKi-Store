/* Tarjeta PNG para compartir (estilo "extractor de virtudes": fondo oscuro, marco, ícono y barras). */
(function () {
  'use strict';
  const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
  const FONT = '"Pixelify Sans", ui-monospace, Consolas, monospace', BIG = '"Jersey 10", "Pixelify Sans", ui-monospace, Consolas, monospace';

  function wrap(ctx, text, maxW) {
    const words = text.split(/\s+/), lines = []; let line = '';
    words.forEach(w => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line); return lines;
  }
  const spaced = (ctx, px) => { if ('letterSpacing' in ctx) ctx.letterSpacing = px + 'px'; };

  async function make(result, D, iconCanvas) {
    try { await Promise.all([document.fonts.load(`700 24px ${FONT}`), document.fonts.load(`80px ${BIG}`)]); } catch (e) { /* usa la fuente de respaldo */ }
    const W = 920, ROW = 46, info = D.enchants[result.win], color = info.color, order = result.r.rank;
    const quote = '“' + info.frase + '”';
    const probe = document.createElement('canvas').getContext('2d'); probe.font = `italic 700 26px ${FONT}`;
    const qLines = wrap(probe, quote, 760);
    const H = 560 + qLines.length * 40 + order.length * ROW + 140;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.textBaseline = 'alphabetic';

    // marco
    c.fillStyle = '#f6f0ff'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#150c33'; c.fillRect(12, 12, W - 24, H - 24);
    c.fillStyle = '#2e1d73'; c.fillRect(24, 24, W - 48, 3); c.fillRect(24, H - 27, W - 48, 3); c.fillRect(24, 24, 3, H - 48); c.fillRect(W - 27, 24, 3, H - 48);

    // título pequeño
    c.textAlign = 'center'; c.fillStyle = '#9d92d6'; c.font = `700 24px ${FONT}`; spaced(c, 5);
    c.fillText('MESA DE ENCANTOS', W / 2, 80); spaced(c, 0);

    // ícono con brillo
    const S = 15, ix = W / 2 - 6 * S, iy = 112;
    c.save(); c.shadowColor = color; c.shadowBlur = 38; c.drawImage(iconCanvas(result.win), ix, iy, 12 * S, 12 * S); c.restore();
    c.drawImage(iconCanvas(result.win), ix, iy, 12 * S, 12 * S);

    // nombre y nivel
    let y = iy + 12 * S + 90;
    c.fillStyle = color; c.font = `74.67px ${BIG}`; spaced(c, 2);
    c.fillText(`${info.nombre.toUpperCase()} ${ROMAN[result.lvl - 1]}`, W / 2, y); spaced(c, 0);
    y += 48; c.fillStyle = '#b8aee8'; c.font = `700 24px ${FONT}`; spaced(c, 3); c.fillText(info.subtitulo.toUpperCase(), W / 2, y); spaced(c, 0);

    // frase
    y += 62; c.fillStyle = '#efe9ff'; c.font = `italic 700 26px ${FONT}`;
    qLines.forEach(l => { c.fillText(l, W / 2, y); y += 40; });

    // barras
    y += 24; const x0 = 60, tx = 360, tw = 416;
    order.forEach(id => {
      const bi = D.enchants[id], p = Math.round(result.r.pct[id] * 100);
      c.textAlign = 'left'; c.fillStyle = bi.color; c.font = `700 22px ${FONT}`; c.fillText(bi.nombre.toUpperCase(), x0, y + 22);
      c.fillStyle = '#1e1e1e'; c.fillRect(tx, y, tw, 30);
      c.fillStyle = bi.color; c.fillRect(tx, y, Math.round(tw * p / 100), 30);
      c.textAlign = 'right'; c.fillStyle = '#ffffff'; c.fillText(p + '%', W - 56, y + 23);
      y += ROW;
    });

    // pie
    y += 14; c.fillStyle = '#3a3a3a'; c.fillRect(56, y, W - 112, 4);
    c.textAlign = 'center'; c.fillStyle = '#8f86c4'; c.font = `700 22px ${FONT}`;
    const host = /^https?:/.test(location.protocol) ? location.host + location.pathname.replace(/index\.html$/, '') : 'kitsukilove · KixKi';
    c.fillText(host.replace(/\/$/, ''), W / 2, y + 48);
    return cv;
  }
  window.MesaCard = { make };
})();
