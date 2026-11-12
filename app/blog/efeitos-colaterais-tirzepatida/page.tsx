import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';

const SLUG = 'efeitos-colaterais-tirzepatida';
export const metadata: Metadata = {
  title: 'Tirzepatida (Mounjaro) faz mal? Efeitos colaterais documentados',
  description:
    'Náusea, diarreia, constipação e vômito: a frequência de cada efeito por dose no estudo SURMOUNT-1, os riscos raros da bula e quem não deve usar tirzepatida.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        A <Link href="/peptideos/tirzepatida">tirzepatida</Link> — princípio ativo do{' '}
        <Link href="/medicamentos/mounjaro">Mounjaro</Link> e do <Link href="/medicamentos/zepbound">Zepbound</Link> — tem
        um perfil de efeitos adversos bem mapeado nos programas SURPASS (diabetes) e SURMOUNT (obesidade).
        A maior parte é gastrointestinal, aparece nas semanas de aumento de dose e diminui com o tempo.
        Este artigo reúne os números dos estudos e os alertas da bula.
      </p>

      <h2>Efeitos gastrointestinais: frequência por dose</h2>
      <p>
        No SURMOUNT-1, estudo de 72 semanas com 2.539 adultos com obesidade ou sobrepeso sem diabetes,
        estes foram os efeitos mais relatados:
      </p>
      <div className="not-prose card overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-3 border-b border-border">
              <th scope="col" className="p-3 font-bold">Efeito</th>
              <th scope="col" className="p-3 font-bold">5 mg</th>
              <th scope="col" className="p-3 font-bold">10 mg</th>
              <th scope="col" className="p-3 font-bold">15 mg</th>
              <th scope="col" className="p-3 font-bold">Placebo</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Náusea', '24,6%', '33,3%', '31,0%', '9,5%'],
              ['Diarreia', '18,7%', '21,2%', '23,0%', '7,3%'],
              ['Constipação', '16,8%', '17,1%', '11,7%', '5,8%'],
              ['Vômito', '8,3%', '10,7%', '12,2%', '1,7%'],
            ].map(([effect, ...values]) => (
              <tr key={effect} className="border-b border-border last:border-0">
                <th scope="row" className="p-3 text-left font-semibold">{effect}</th>
                {values.map((v, i) => (
                  <td key={i} className="p-3 tabular-nums">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Três pontos ajudam a ler essa tabela:</p>
      <ul>
        <li><strong>A maioria foi leve a moderada</strong> e ocorreu durante a fase de subida de dose.</li>
        <li>
          <strong>Poucos abandonaram o tratamento por isso</strong>: a interrupção por evento adverso foi de
          4,3% (5 mg), 7,1% (10 mg) e 6,2% (15 mg), contra 2,6% no placebo.
        </li>
        <li>
          <strong>Dose maior não significa efeito proporcionalmente maior</strong>: a náusea foi parecida
          em 10 e 15 mg, porque o corpo se adapta ao longo da titulação.
        </li>
      </ul>

      <h2>Outros efeitos comuns</h2>
      <ul>
        <li>Dispepsia (má digestão), dor abdominal, eructação, flatulência e refluxo</li>
        <li>Diminuição do apetite — é parte do efeito esperado, mas pode levar a ingestão insuficiente</li>
        <li>Reações no local da injeção (vermelhidão, coceira)</li>
        <li>Fadiga e tontura</li>
        <li>
          Queda de cabelo: relatada por cerca de 5% dos participantes, contra cerca de 1% no placebo —
          associada à perda de peso rápida e geralmente temporária
        </li>
        <li>Aumento discreto da frequência cardíaca</li>
      </ul>

      <h2>Riscos raros, mas importantes</h2>
      <ul>
        <li>
          <strong>Pancreatite aguda</strong> — dor abdominal intensa e persistente, que pode irradiar para
          as costas, com ou sem vômito. Exige interrupção e avaliação médica imediata.
        </li>
        <li>
          <strong>Doença da vesícula biliar</strong> — cálculos e colecistite, risco ligado também à perda
          de peso rápida. Sinais: dor no lado direito do abdome, febre, pele amarelada.
        </li>
        <li>
          <strong>Hipoglicemia</strong> — principalmente quando combinada com insulina ou sulfonilureias;
          a dose desses medicamentos pode precisar de ajuste.
        </li>
        <li>
          <strong>Lesão renal aguda por desidratação</strong> — consequência de vômito e diarreia
          prolongados. Hidratação é parte do tratamento.
        </li>
        <li>
          <strong>Reações de hipersensibilidade</strong> — incluindo anafilaxia e angioedema, raras.
        </li>
        <li>
          <strong>Retinopatia diabética</strong> — quem já tem retinopatia deve ser acompanhado, porque a
          queda rápida da glicose pode piorá-la temporariamente.
        </li>
        <li>
          <strong>Aspiração em anestesia</strong> — como o esvaziamento do estômago fica mais lento, avise
          a equipe sobre o uso antes de cirurgias ou exames com sedação.
        </li>
      </ul>

      <h2>O alerta sobre tireoide</h2>
      <p>
        A bula traz um alerta em destaque: em ratos, a tirzepatida causou tumores de células C da
        tireoide. Não se sabe se o mesmo ocorre em humanos. Por precaução, o medicamento é{' '}
        <strong>contraindicado</strong> para quem tem histórico pessoal ou familiar de carcinoma medular
        de tireoide ou síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM 2). Nódulo no pescoço,
        rouquidão persistente ou dificuldade para engolir devem ser relatados ao médico.
      </p>

      <h2>Quem não deve usar ou precisa de cautela</h2>
      <ul>
        <li>Histórico pessoal ou familiar de carcinoma medular de tireoide ou NEM 2 (contraindicação)</li>
        <li>Alergia grave à tirzepatida ou a componentes da fórmula (contraindicação)</li>
        <li>Gravidez e amamentação — o uso não é recomendado</li>
        <li>Histórico de pancreatite</li>
        <li>Gastroparesia ou doença gastrointestinal grave</li>
        <li>
          <strong>Anticoncepcional oral</strong>: a tirzepatida pode reduzir a absorção da pílula. A bula
          orienta usar método não oral ou adicionar método de barreira por 4 semanas após o início e após
          cada aumento de dose.
        </li>
      </ul>

      <h2>Como reduzir os efeitos</h2>
      <ul>
        <li>
          Respeitar a titulação: pelo menos 4 semanas em cada dose. Veja o calendário na{' '}
          <Link href="/ferramentas/titulacao">calculadora de subida de dose</Link>.
        </li>
        <li>Refeições menores, comer devagar e parar ao primeiro sinal de saciedade</li>
        <li>Reduzir gordura, frituras e álcool, sobretudo nos dias seguintes à aplicação</li>
        <li>Manter boa hidratação e ingestão adequada de proteína e fibras</li>
        <li>
          Se os sintomas não cederem, o médico pode manter a dose atual por mais tempo ou voltar um degrau
        </li>
      </ul>
      <p>
        Para o manejo específico do enjoo, veja{' '}
        <Link href="/blog/nausea-tirzepatida-como-lidar">náusea na tirzepatida: como lidar</Link>.
      </p>

      <h2>Quando procurar atendimento</h2>
      <ul>
        <li>Dor abdominal forte que não passa</li>
        <li>Vômito persistente ou incapacidade de manter líquidos</li>
        <li>Sinais de desidratação: pouca urina, tontura ao levantar, boca muito seca</li>
        <li>Inchaço de rosto, lábios ou garganta, ou dificuldade para respirar</li>
        <li>Pele ou olhos amarelados, febre com dor no lado direito do abdome</li>
      </ul>

      <h2>Tirzepatida em frasco: um risco a mais</h2>
      <p>
        Os dados acima vêm do medicamento industrializado. Em frasco manipulado ou liofilizado entram
        outros riscos — erro de diluição, dose errada na seringa e produto sem procedência. Confira a
        conta na <Link href="/ferramentas/reconstituicao/tirzepatida">calculadora de tirzepatida</Link> e
        leia <Link href="/blog/tirzepatida-manipulada-seguranca">tirzepatida manipulada é segura?</Link>.
      </p>
    </ArticleLayout>
  );
}
