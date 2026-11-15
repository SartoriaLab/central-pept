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
  hook: 'Você está subindo a dose da tirzepatida rápido demais?',
  slides: [
    { title: 'A bula começa em 2,5 mg', body: 'As primeiras 4 semanas são de adaptação. Essa dose não é para emagrecer: é para o corpo se acostumar.' },
    { title: 'Subir dói menos devagar', body: 'Cada degrau de 2,5 mg dura pelo menos 4 semanas. Pular etapa aumenta náusea e vômito.' },
    { title: 'Efeito colateral manda', body: 'Se a náusea não passou, segure a dose atual. Quem decide o ajuste é o seu médico.' },
    { title: 'Resumo', body: 'Comece em 2,5 mg, suba de 2,5 mg em 2,5 mg a cada 4 semanas e anote como você reagiu.' },
  ],
  narration: [
    'Você está subindo a dose da tirzepatida rápido demais?',
    'A bula começa em dois vírgula cinco miligramas, por quatro semanas, só para o corpo se adaptar.',
    'Depois, cada degrau dura pelo menos quatro semanas. Pular etapa aumenta náusea e vômito.',
    'Se o enjoo não passou, segure a dose. O ajuste é sempre com o seu médico.',
  ],
  caption:
    'Subir rápido não acelera o resultado: só aumenta o enjoo.\n\n' +
    '1️⃣ Comece em 2,5 mg por 4 semanas\n2️⃣ Suba de 2,5 mg em 2,5 mg\n3️⃣ Fique pelo menos 4 semanas em cada degrau\n\n' +
    '⚠️ Náusea que não passa é sinal para segurar a dose e falar com o médico.',
  question: 'Em qual dose o enjoo apareceu para você?',
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
