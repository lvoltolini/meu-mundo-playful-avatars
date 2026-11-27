export type Player = { name: string; avatar: string | null; emoji: string };
export type GameConfig = {
  players: [Player, Player];
  vehicle: string;
  enemy: string;
  ball: string;
  racket: string;
};
export type Game = { id: string; name: string; description: string; src?: string; srcDoc?: string };
export type HistoryEntry = { hora: string; jogo: string; evento: string; dados: Record<string, unknown> };

export const defaultConfig: GameConfig = {
  players: [
    { name: "Jogador 1", avatar: null, emoji: "🙂" },
    { name: "Jogador 2", avatar: null, emoji: "😎" },
  ],
  vehicle: "🚀",
  enemy: "👾",
  ball: "🎾",
  racket: "🏓",
};

export const builtInGames: Game[] = [
  { id: "perguntas", name: "Show de Perguntas", description: "2 jogadores · quem acertar primeiro ganha", src: "/games/perguntas.html" },
  { id: "invasores", name: "Invasores do Espaço", description: "1 jogador · pilote sua nave", src: "/games/invasores.html" },
  { id: "tenis", name: "Tênis para 2", description: "2 jogadores · rebata a bola", src: "/games/tenis.html" },
];

export const emojiChoices = {
  vehicle: ["🚀", "🛸", "✈️", "🚗", "🚲", "🐢", "🦄", "⛵"],
  enemy: ["👾", "🌳", "🌸", "⭐", "🍎", "🎈", "☁️", "🐟"],
  ball: ["🎾", "⚽", "🏀", "🍊", "🌕", "🍩", "⚪", "🫧"],
  racket: ["🏓", "🏸", "🪵", "🧹", "🥄", "🌿"],
  player: ["🙂", "😎", "🐱", "🐶", "🦊", "🐼", "🤖", "🦖"],
};

/** Uploaded HTML runs from srcdoc, so a relative bridge script must point at the app. */
export function prepareUploadedHtml(html: string, origin: string): string {
  return html.replace(/src=["']\.?\/?(games\/)?_bridge\.js["']/g, `src="${origin}/games/_bridge.js"`);
}
