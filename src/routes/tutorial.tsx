import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "Tutorial — Meu Jeito de Jogar" },
      { name: "description", content: "Passo a passo de como criar o avatar, escolher os objetos e jogar." },
      { property: "og:title", content: "Tutorial — Meu Jeito de Jogar" },
      { property: "og:description", content: "Aprenda a criar seu avatar e jogar." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Tutorial,
});

const steps = [
  ["Escolha seu nome e avatar", "Na página Jogar, no painel à esquerda, escreva o nome de cada jogador. Toque em \"Enviar imagem\" para usar uma foto ou desenho, ou toque em um emoji."],
  ["Escolha os objetos", "Escolha o que será a nave, os alvos, a bola e a raquete. Você pode tocar em um emoji da lista ou digitar qualquer emoji no campo."],
  ["Escolha um jogo", "Toque no nome do jogo na lista. Ele abre na tela grande ao lado. Toque na tela do jogo antes de usar o teclado."],
  ["Jogue", "Siga as instruções que aparecem dentro de cada jogo. Você pode mudar o avatar e os objetos a qualquer momento — o jogo atualiza na hora."],
  ["Guarde se quiser", "Toque em \"Baixar JSON\" para salvar suas escolhas e o histórico das partidas. Nada fica gravado quando você fecha a página."],
];

const games = [
  ["❓ Show de Perguntas", "2 jogadores. A pergunta aparece no meio. O jogador da esquerda responde com as teclas 1, 2, 3 e 4; o da direita com 7, 8, 9 e 0. Também dá para clicar. Quem acertar primeiro ganha os pontos. Quem errar espera a próxima pergunta."],
  ["🚀 Invasores do Espaço", "1 jogador. Use as setas ← → (ou A e D) para mover a nave e Espaço para atirar. Acerte todos os alvos antes que eles cheguem embaixo."],
  ["🏓 Tênis para 2", "2 jogadores. O da esquerda usa W e S; o da direita usa as setas ↑ e ↓. Rebata a bola. Quem fizer 5 pontos vence."],
];

function Tutorial() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">Como jogar</h1>
      <ol className="mt-8 space-y-4">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-4 rounded-2xl border bg-card p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{i + 1}</span>
            <div className="min-w-0"><h2 className="text-lg font-bold">{t}</h2><p className="mt-1 text-muted-foreground">{d}</p></div>
          </li>
        ))}
      </ol>
      <h2 className="mt-12 text-2xl font-bold">Os jogos</h2>
      <div className="mt-4 space-y-3">
        {games.map(([t, d]) => (
          <div key={t} className="rounded-2xl bg-secondary p-5"><h3 className="text-lg font-bold">{t}</h3><p className="mt-1">{d}</p></div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Para quem cria jogos:</strong> envie um arquivo .html pelo botão "Enviar jogo". Para usar o avatar e os
        emojis, inclua <code>&lt;script src="_bridge.js"&gt;&lt;/script&gt;</code> e leia <code>window.CFG</code> (players, vehicle, enemy, ball, racket).
        Use <code>sendEvent("nome", dados)</code> para registrar no histórico.
      </div>
      <Link to="/jogar" className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Ir para os jogos</Link>
    </main>
  );
}
