import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  builtInGames, defaultConfig, emojiChoices, prepareUploadedHtml,
  type Game, type GameConfig, type HistoryEntry, type Player,
} from "../lib/game-config";

export const Route = createFileRoute("/jogar")({
  head: () => ({
    meta: [
      { title: "Jogar — Meu Jeito de Jogar" },
      { name: "description", content: "Escolha um jogo, crie seu avatar e troque os objetos do jogo." },
      { property: "og:title", content: "Jogar — Meu Jeito de Jogar" },
      { property: "og:description", content: "Jogos com avatar e objetos personalizados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Jogar,
});

type ObjKey = "vehicle" | "enemy" | "ball" | "racket";
const objLabels: [ObjKey, string][] = [["vehicle", "Nave"], ["enemy", "Alvos"], ["ball", "Bola"], ["racket", "Raquete"]];

function EmojiPicker({ value, options, onChange, label }: { value: string; options: string[]; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {options.map((e) => (
        <button key={e} type="button" aria-label={`${label}: ${e}`} onClick={() => onChange(e)}
          className={`h-9 w-9 rounded-lg text-xl ${value === e ? "bg-primary/15 ring-2 ring-primary" : "hover:bg-accent"}`}>{e}</button>
      ))}
      <input aria-label={`${label}: outro emoji`} value={value} onChange={(ev) => onChange(ev.target.value)}
        className="h-9 w-14 rounded-lg border bg-background text-center text-xl" />
    </div>
  );
}

function Jogar() {
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [games, setGames] = useState<Game[]>(builtInGames);
  const [currentId, setCurrentId] = useState<string>(builtInGames[0]!.id);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const frame = useRef<HTMLIFrameElement>(null);
  const configRef = useRef(config);
  configRef.current = config;
  const current = games.find((g) => g.id === currentId) ?? games[0]!;

  const post = () => frame.current?.contentWindow?.postMessage({ type: "config", config: configRef.current }, "*");
  useEffect(post, [config]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || !e.data || typeof e.data !== "object") return;
      const d = e.data as { type?: string; event?: string; data?: Record<string, unknown> };
      if (d.type === "ready") post();
      if (d.type === "event") {
        setHistory((h) => [...h, { hora: new Date().toISOString(), jogo: current.name, evento: String(d.event), dados: d.data ?? {} }]);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [current.name]);

  const setPlayer = (i: 0 | 1, p: Partial<Player>) =>
    setConfig((c) => {
      const players = [...c.players] as [Player, Player];
      players[i] = { ...players[i], ...p };
      return { ...c, players };
    });

  const uploadAvatar = (i: 0 | 1) => (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPlayer(i, { avatar: String(r.result) });
    r.readAsDataURL(f);
    e.target.value = "";
  };

  const uploadGame = (e: ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((f) => {
      f.text().then((html) => {
        const id = `up-${Date.now()}-${f.name}`;
        setGames((g) => [...g, { id, name: f.name.replace(/\.html?$/i, ""), description: "Jogo enviado", srcDoc: prepareUploadedHtml(html, window.location.origin) }]);
        setCurrentId(id);
      });
    });
    e.target.value = "";
  };

  const download = () => {
    const blob = new Blob([JSON.stringify({ exportadoEm: new Date().toISOString(), configuracao: config, historico: history }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "meu-jeito-de-jogar.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main className="grid gap-4 p-4 lg:h-[calc(100vh-4rem)] lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4 overflow-y-auto lg:pr-1">
        <section className="rounded-2xl border bg-card p-4">
          <h2 className="mb-2 font-bold">Jogos</h2>
          <ul className="space-y-1">
            {games.map((g) => (
              <li key={g.id}>
                <button onClick={() => setCurrentId(g.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left ${g.id === current.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                  <div className="font-semibold">{g.name}</div>
                  <div className={`text-xs ${g.id === current.id ? "opacity-80" : "text-muted-foreground"}`}>{g.description}</div>
                </button>
              </li>
            ))}
          </ul>
          <label className="mt-3 block cursor-pointer rounded-xl border border-dashed px-3 py-2 text-center text-sm font-semibold hover:bg-accent">
            ➕ Enviar jogo (.html)
            <input type="file" accept=".html,.htm,text/html" multiple className="sr-only" onChange={uploadGame} />
          </label>
        </section>

        {([0, 1] as const).map((i) => {
          const p = config.players[i];
          return (
            <section key={i} className={`rounded-2xl border-2 bg-card p-4 ${i === 0 ? "border-player-1" : "border-player-2"}`}>
              <h2 className="mb-2 font-bold">Jogador {i + 1}</h2>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-3xl">
                  {p.avatar ? <img src={p.avatar} alt={`Avatar de ${p.name}`} className="h-full w-full object-cover" /> : p.emoji}
                </div>
                <input aria-label={`Nome do jogador ${i + 1}`} value={p.name} onChange={(e) => setPlayer(i, { name: e.target.value })}
                  className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2" />
              </div>
              <div className="mt-3 flex gap-2 text-sm">
                <label className="cursor-pointer rounded-lg bg-secondary px-3 py-1.5 font-semibold hover:bg-accent">
                  📷 Enviar imagem
                  <input type="file" accept="image/*" className="sr-only" onChange={uploadAvatar(i)} />
                </label>
                {p.avatar && <button onClick={() => setPlayer(i, { avatar: null })} className="rounded-lg px-3 py-1.5 hover:bg-accent">Usar emoji</button>}
              </div>
              <div className="mt-2"><EmojiPicker label={`Emoji do jogador ${i + 1}`} value={p.emoji} options={emojiChoices.player} onChange={(v) => setPlayer(i, { emoji: v, avatar: null })} /></div>
            </section>
          );
        })}

        <section className="rounded-2xl border bg-card p-4">
          <h2 className="mb-1 font-bold">Objetos do jogo</h2>
          <p className="mb-3 text-sm text-muted-foreground">Troque por qualquer coisa que você quiser.</p>
          <div className="space-y-3">
            {objLabels.map(([k, label]) => (
              <div key={k}>
                <div className="mb-1 text-sm font-semibold">{label}</div>
                <EmojiPicker label={label} value={config[k]} options={emojiChoices[k]} onChange={(v) => setConfig((c) => ({ ...c, [k]: v }))} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold">Histórico ({history.length})</h2>
            <button onClick={download} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">📥 Baixar JSON</button>
          </div>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-muted-foreground">
            {history.length === 0 && <li>Nenhuma jogada ainda.</li>}
            {[...history].reverse().slice(0, 30).map((h, n) => (
              <li key={n}>{new Date(h.hora).toLocaleTimeString("pt-BR")} · {h.jogo} · {h.evento}</li>
            ))}
          </ul>
        </section>
      </aside>

      <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border bg-card">
        <div className="border-b px-4 py-2 text-sm"><strong>{current.name}</strong> <span className="text-muted-foreground">· clique no jogo para usar o teclado</span></div>
        <iframe
          key={current.id}
          ref={frame}
          title={current.name}
          sandbox="allow-scripts"
          {...(current.srcDoc ? { srcDoc: current.srcDoc } : { src: current.src })}
          onLoad={() => { post(); frame.current?.focus(); }}
          className="w-full flex-1 bg-background"
        />
      </section>
    </main>
  );
}
