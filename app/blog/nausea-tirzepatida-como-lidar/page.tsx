import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';

const SLUG = 'nausea-tirzepatida-como-lidar';
export const metadata: Metadata = {
  title: 'Náusea na tirzepatida (Mounjaro): como aliviar e quando procurar médico',
  description:
    'O enjoo atinge até um terço de quem usa tirzepatida, quase sempre na subida de dose. Veja o que ajuda na prática, o que evitar e os sinais de alerta.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        Náusea é o efeito colateral mais comum da <Link href="/peptideos/tirzepatida">tirzepatida</Link>{' '}
        (<Link href="/medicamentos/mounjaro">Mounjaro</Link>). Na maioria dos casos é leve, aparece
        quando a dose sobe e melhora em dias ou poucas semanas. Saber o que fazer — e quando o enjoo
        deixa de ser normal — evita tanto sofrimento desnecessário quanto abandono do tratamento.
      </p>

      <h2>Com que frequência acontece</h2>
      <p>
        No estudo SURMOUNT-1, relataram náusea 24,6% dos participantes em 5 mg, 33,3% em 10 mg e 31,0%
        em 15 mg, contra 9,5% no placebo. Vômito foi menos comum: 8,3%, 10,7% e 12,2%, contra 1,7%. Os
        episódios se concentraram no período de aumento de dose, foram em geral leves a moderados e
        ficaram menos frequentes depois.
      </p>

      <h2>Por que a tirzepatida dá enjoo</h2>
      <ul>
        <li>
          <strong>Estômago mais lento:</strong> o medicamento retarda o esvaziamento gástrico. A comida
          fica mais tempo no estômago e a sensação de estar cheio dura mais.
        </li>
        <li>
          <strong>Ação no cérebro:</strong> os receptores de GLP-1 em áreas que controlam apetite e
          náusea também são ativados.
        </li>
        <li>
          <strong>Hábito antigo, estômago novo:</strong> comer a mesma quantidade de antes, na mesma
          velocidade, é o gatilho mais comum.
        </li>
      </ul>

      <h2>Quando costuma aparecer</h2>
      <ul>
        <li>Nos primeiros dias após a primeira aplicação</li>
        <li>Nos 2 a 3 dias seguintes a cada aumento de dose</li>
        <li>Depois de refeições grandes, gordurosas ou muito rápidas</li>
      </ul>
      <p>
        Como a concentração estável leva cerca de 4 semanas para ser atingida, é esperado que o
        desconforto diminua ao longo do mês em cada dose.
      </p>

      <h2>O que ajuda na prática</h2>
      <h3>Na alimentação</h3>
      <ul>
        <li>Porções menores, mais vezes ao dia</li>
        <li>Comer devagar e parar ao primeiro sinal de saciedade — não &quot;limpar o prato&quot;</li>
        <li>Preferir alimentos leves e pouco gordurosos: arroz, batata, frango, frutas, torradas</li>
        <li>Evitar frituras, muito açúcar, comida muito condimentada e álcool</li>
        <li>Não deitar logo depois de comer</li>
        <li>Beber líquidos em pequenos goles ao longo do dia, não em grande volume junto da refeição</li>
        <li>Gengibre e bebidas frias aliviam o enjoo para algumas pessoas</li>
      </ul>
      <h3>Na aplicação</h3>
      <ul>
        <li>
          Escolher o dia da semana com calma: muitos preferem aplicar na véspera de dias mais tranquilos,
          para atravessar em casa o período de maior desconforto.
        </li>
        <li>Manter o mesmo dia toda semana.</li>
        <li>
          Em frasco, conferir as unidades na seringa: aplicar mais do que o previsto é causa frequente de
          enjoo intenso. Use a{' '}
          <Link href="/ferramentas/reconstituicao/tirzepatida">calculadora de tirzepatida</Link>.
        </li>
      </ul>
      <h3>Na dose</h3>
      <ul>
        <li>
          Não subir a dose enquanto o enjoo da dose atual não tiver cedido. As 4 semanas por degrau são o
          mínimo, não uma obrigação.
        </li>
        <li>
          Se os sintomas persistirem, o médico pode manter a dose por mais tempo ou voltar ao degrau
          anterior. Parar em uma dose intermediária é uma opção prevista em bula.
        </li>
        <li>
          Medicamentos para enjoo só com orientação médica.
        </li>
      </ul>

      <h2>O que não fazer</h2>
      <ul>
        <li>Pular refeições por medo de enjoar — o estômago vazio costuma piorar a náusea</li>
        <li>Pular a dose da semana por conta própria e depois retomar na mesma dose alta</li>
        <li>Fracionar ou alterar a dose sem combinar com o médico</li>
        <li>Deixar de beber água quando há vômito ou diarreia</li>
      </ul>

      <h2>Quando procurar atendimento</h2>
      <p>Enjoo leve é esperado. Estes sinais não são:</p>
      <ul>
        <li>
          <strong>Dor abdominal forte e contínua</strong>, que pode irradiar para as costas, com ou sem
          vômito — pode indicar pancreatite
        </li>
        <li>
          <strong>Dor no lado direito do abdome com febre ou pele amarelada</strong> — pode indicar
          problema na vesícula
        </li>
        <li><strong>Vômito por mais de 24 horas</strong> ou incapacidade de manter líquidos</li>
        <li><strong>Sinais de desidratação:</strong> pouca urina, urina escura, tontura ao levantar</li>
        <li>
          <strong>Tremor, suor frio e confusão</strong> em quem usa insulina ou sulfonilureia — pode ser
          hipoglicemia
        </li>
      </ul>

      <h2>Esqueci ou adiei a dose por causa do enjoo</h2>
      <p>
        Pela bula, a dose esquecida pode ser aplicada em até 4 dias (96 horas) depois do dia previsto.
        Passado esse prazo, pule e retome no dia habitual. Depois de várias semanas sem aplicar, converse
        com o médico antes de recomeçar: voltar direto à dose alta costuma trazer náusea forte.
      </p>

      <h2>Veja também</h2>
      <ul>
        <li>
          <Link href="/blog/efeitos-colaterais-tirzepatida">Efeitos colaterais da tirzepatida</Link> — a
          lista completa, com frequência por dose
        </li>
        <li>
          <Link href="/blog/nausea-ozempic-como-lidar">Náusea no Ozempic</Link> — o equivalente para
          semaglutida
        </li>
        <li>
          <Link href="/ferramentas/titulacao">Calendário de subida de dose</Link> — para planejar cada
          degrau
        </li>
      </ul>
    </ArticleLayout>
  );
}
