import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meu Jeito de Jogar — Sobre o app" },
      { name: "description", content: "Protótipo de jogos personalizáveis para crianças autistas: avatar próprio e objetos escolhidos pela criança." },
      { property: "og:title", content: "Meu Jeito de Jogar — Sobre o app" },
      { property: "og:description", content: "Jogos simples onde a criança escolhe seu avatar e os objetos do jogo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Sobre,
});

const features = [
  ["🧑‍🚀", "Seu avatar", "Envie uma foto ou desenho, ou escolha um emoji. Ele aparece como piloto da nave, jogador do tênis e participante do show de perguntas."],
  ["🌳", "Objetos do seu jeito", "Troque a nave, os 'inimigos', a bola e a raquete por qualquer emoji. Se a criança quiser trocar os ETs por árvores, pode."],
  ["🎮", "Jogos simples", "Show de Perguntas (2 jogadores), Invasores do Espaço e Tênis para 2. Também é possível enviar seus próprios jogos em HTML."],
  ["📥", "Nada é guardado", "Tudo fica só nesta tela. As escolhas e o histórico das partidas podem ser baixados em um arquivo JSON."],
];

function Sobre() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Protótipo</p>
      <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">Um lugar para jogar do seu jeito</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Este app foi pensado para crianças autistas. A ideia é simples: a criança se coloca dentro do jogo com o seu
        próprio avatar e decide como cada coisa se parece. Quando ela escolhe o que é o "inimigo", o jogo deixa de impor
        um significado — o que importa é brincar, mirar e se divertir.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {features.map(([icon, title, text]) => (
          <div key={title} className="rounded-2xl border bg-card p-6">
            <div className="text-4xl" aria-hidden>{icon}</div>
            <h2 className="mt-3 text-xl font-bold">{title}</h2>
            <p className="mt-2 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/jogar" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Começar a jogar</Link>
        <Link to="/tutorial" className="rounded-xl border bg-card px-6 py-3 font-semibold hover:bg-accent">Ver o tutorial</Link>
      </div>
    </main>
  );
}
