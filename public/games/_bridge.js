// Ponte entre o jogo (iframe) e o app. Jogos enviados podem copiar este protocolo:
// recebe {type:'config', config} e envia {type:'event', event, data}.
window.CFG = {
  players: [{ name: "Jogador 1", avatar: null, emoji: "🙂" }, { name: "Jogador 2", avatar: null, emoji: "😎" }],
  vehicle: "🚀", enemy: "👾", ball: "🎾", racket: "🏓",
  drive: { car: "🚗", others: "🚙", houses: "🏠", objects: "🌳", road: "#4b5563", grass: "#6bbf59", goal: 0 },
};
window.onConfig = null;
const _imgs = {};
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "config") {
    window.CFG = Object.assign({}, window.CFG, e.data.config);
    window.CFG.players.forEach((p, i) => {
      if (p.avatar) { const im = new Image(); im.src = p.avatar; _imgs[i] = im; } else delete _imgs[i];
    });
    if (window.onConfig) window.onConfig();
  }
});
window.sendEvent = (event, data) => parent.postMessage({ type: "event", event, data: data || {} }, "*");
parent.postMessage({ type: "ready" }, "*");
window.drawEmoji = (ctx, emoji, x, y, size) => {
  ctx.font = size + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(emoji, x, y);
};
// Foto enviada: aparece dentro de uma moldura circular. Emoji escolhido: aparece inteiro (corpo), sem moldura.
window.drawAvatar = (ctx, i, x, y, size) => {
  const im = _imgs[i], p = CFG.players[i] || {};
  if (im && im.complete && im.naturalWidth) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = i === 0 ? "#3b82a6" : "#c2703d"; ctx.stroke(); ctx.clip();
    ctx.drawImage(im, x - size / 2, y - size / 2, size, size); ctx.restore();
  } else drawEmoji(ctx, p.emoji || "🙂", x, y, size * 1.1);
};
// Converte toque/mouse para coordenadas do canvas (canvas com object-fit: contain).
window.toCanvas = (c, e) => {
  const r = c.getBoundingClientRect(), s = Math.min(r.width / c.width, r.height / c.height);
  const ox = (r.width - c.width * s) / 2, oy = (r.height - c.height * s) / 2;
  return { x: (e.clientX - r.left - ox) / s, y: (e.clientY - r.top - oy) / s };
};
