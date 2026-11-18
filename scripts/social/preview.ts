// Prévia do visual sem gastar API: renderiza um rascunho fixo (tirzepatida) nos dois
// formatos em social/out/preview/. Uso: npm run social:preview [-- carrossel|reels]
import path from 'node:path';
import { buildTopics } from './topics';
import { buildCaption } from './caption';
import { ctaFor } from './ebook-cta';
import { renderCarousel, renderReel } from './render';
import { getEbooks } from '@/lib/ebooks';
import type { Draft } from './types';

const SAMPLE: Draft = {
  hook: 'Você subiu a dose porque a amiga subiu?',
  hookIcon: 'grafico-sobe',
  hookPose: 'ih',
  slides: [
    { title: 'A bula começa em 2,5 mg', icon: 'calendario', pose: 'explicando', body: 'As primeiras 4 semanas são de adaptação. Essa dose não é para emagrecer: é para o corpo se acostumar.' },
    { title: 'Subir dói menos devagar', icon: 'enjoo', pose: 'alerta', body: 'Cada degrau de 2,5 mg dura pelo menos 4 semanas. Pular etapa aumenta náusea e vômito.' },
    { title: 'Efeito colateral manda', icon: 'estetoscopio', pose: 'pensando', body: 'Se a náusea não passou, segure a dose atual. Quem decide o ajuste é o seu médico.' },
    { title: 'Resumo', icon: 'prancheta', pose: 'apontando', body: 'Comece em 2,5 mg, suba de 2,5 mg em 2,5 mg a cada 4 semanas e anote como você reagiu.' },
  ],
  narration: [
    { text: 'Você subiu a dose da tirzepatida só porque a sua amiga subiu?', pose: 'ih' },
    { text: 'Olha só: a bula começa em 2,5 mg, por 4 semanas, só para o seu corpo se adaptar.', pose: 'explicando' },
    { text: 'Depois, cada degrau dura pelo menos 4 semanas. Pular etapa só aumenta a náusea e o vômito.', pose: 'alerta' },
    { text: 'Se o enjoo não passou, segure a dose. O ajuste é sempre com o seu médico, não com a amiga.', pose: 'piscadinha' },
  ],
  caption:
    'Eu sei, dá vontade de subir junto com a amiga. Mas subir rápido não acelera o resultado: só aumenta o enjoo.\n\n' +
    '1️⃣ Comece em 2,5 mg por 4 semanas\n2️⃣ Suba de 2,5 mg em 2,5 mg\n3️⃣ Fique pelo menos 4 semanas em cada degrau\n\n' +
    '⚠️ Náusea que não passa é sinal para segurar a dose e falar com o médico.',
  question: 'Em qual dose o enjoo apareceu para você?',
  share: 'aquela amiga que sobe a dose junto com você',
};

async function main() {
  const which = process.argv[2];
  const topic = buildTopics().find((t) => t.id === 'peptide:tirzepatida');
  if (!topic) throw new Error('tema tirzepatida não encontrado');
  const cta = ctaFor(topic, new Set(getEbooks().map((e) => e.slug)));
  const out = path.join(process.cwd(), 'social', 'out', 'preview');
  if (which !== 'reels') console.log((await renderCarousel(SAMPLE, topic, cta, path.join(out, 'carrossel'))).join('\n'));
  if (which !== 'carrossel') console.log(await renderReel(SAMPLE, topic, cta, path.join(out, 'reels')));
  console.log('\n--- legenda ---\n' + buildCaption(SAMPLE, topic, cta));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
