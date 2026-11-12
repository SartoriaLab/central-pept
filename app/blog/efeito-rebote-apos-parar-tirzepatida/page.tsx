import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';

const SLUG = 'efeito-rebote-apos-parar-tirzepatida';
export const metadata: Metadata = {
  title: 'Efeito rebote após parar tirzepatida (Mounjaro): o que esperar',
  description:
    'No estudo SURMOUNT-4, quem parou a tirzepatida recuperou 14% do peso em um ano. Entenda por que o peso volta e o que ajuda a manter o resultado.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        Parar a <Link href="/peptideos/tirzepatida">tirzepatida</Link> costuma trazer de volta boa parte
        do peso perdido. Isso não é falha de quem usa: é o que se espera quando o tratamento de uma
        condição crônica é interrompido. Existe um estudo desenhado exatamente para medir esse efeito.
      </p>

      <h2>O que o estudo SURMOUNT-4 mostrou</h2>
      <p>
        Todos os participantes — adultos com obesidade ou sobrepeso, sem diabetes — usaram tirzepatida por
        36 semanas, na dose máxima tolerada (10 ou 15 mg). Nesse período perderam em média{' '}
        <strong>20,9%</strong> do peso. Então 670 pessoas foram sorteadas: metade continuou o
        medicamento, metade passou a receber placebo, sem saber. Um ano depois (semana 88):
      </p>
      <div className="not-prose card overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-3 border-b border-border">
              <th scope="col" className="p-3 font-bold" />
              <th scope="col" className="p-3 font-bold">Continuou tirzepatida</th>
              <th scope="col" className="p-3 font-bold">Passou para placebo</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Variação de peso nas 52 semanas seguintes', '−5,5%', '+14,0%'],
              ['Perda total desde o início (88 semanas)', '25,3%', '9,9%'],
              ['Mantiveram ao menos 80% do peso perdido', '89,5%', '16,6%'],
            ].map(([label, a, b]) => (
              <tr key={label} className="border-b border-border last:border-0">
                <th scope="row" className="p-3 text-left font-semibold">{label}</th>
                <td className="p-3 tabular-nums">{a}</td>
                <td className="p-3 tabular-nums">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Dois recados saem daí. Quem parou não voltou à estaca zero — um ano depois ainda estava quase 10%
        abaixo do peso inicial. Mas recuperou mais da metade do que tinha perdido, mesmo mantendo a
        orientação de dieta e exercício do estudo.
      </p>

      <h2>Por que o peso volta</h2>
      <ul>
        <li>
          <strong>O efeito depende da presença do medicamento.</strong> A tirzepatida aumenta a saciedade
          e reduz o apetite enquanto circula. Com meia-vida de cerca de 5 dias, ela sai do organismo em
          aproximadamente um mês — e a fome volta ao padrão anterior.
        </li>
        <li>
          <strong>O corpo defende o peso antigo.</strong> Depois de emagrecer, o gasto de energia cai e os
          hormônios da fome sobem. Essa adaptação acontece com qualquer método de perda de peso.
        </li>
        <li>
          <strong>Obesidade é condição crônica.</strong> Assim como pressão e colesterol voltam a subir
          quando o remédio é suspenso, o peso tende a voltar.
        </li>
      </ul>
      <p>
        O mesmo foi visto com a semaglutida: na extensão do estudo STEP 1, um ano depois de parar os
        participantes tinham recuperado cerca de dois terços do peso perdido. Veja{' '}
        <Link href="/blog/efeito-rebote-apos-parar-semaglutida">efeito rebote após parar semaglutida</Link>.
      </p>

      <h2>O que mais volta além do peso</h2>
      <p>
        No SURMOUNT-4, as melhoras de circunferência abdominal, pressão arterial, glicemia e lipídios
        também recuaram no grupo que passou para placebo, acompanhando o ganho de peso. Em quem tem
        diabetes tipo 2, a glicose volta a subir após a suspensão — nunca interrompa sem orientação
        médica.
      </p>

      <h2>O que ajuda a manter o resultado</h2>
      <ul>
        <li>
          <strong>Planejar a saída com o médico.</strong> Em vez de parar de uma vez, discute-se manter
          uma dose de manutenção menor (a bula prevê 5, 10 ou 15 mg) ou reduzir aos poucos. Não há ainda
          um protocolo de retirada validado em estudo grande.
        </li>
        <li>
          <strong>Treino de força e proteína suficiente.</strong> Parte do peso perdido é massa magra;
          preservá-la ajuda a manter o gasto de energia.
        </li>
        <li>
          <strong>Hábitos construídos durante o tratamento.</strong> O período com menos fome é a janela
          para consolidar rotina de alimentação, sono e atividade física.
        </li>
        <li>
          <strong>Acompanhar o peso.</strong> Pesar-se regularmente permite agir cedo, quando o ganho
          ainda é pequeno.
        </li>
      </ul>

      <h2>Se for retomar depois de uma pausa</h2>
      <p>
        Depois de várias semanas sem aplicar, a tolerância aos efeitos gastrointestinais se perde.
        Recomeçar direto na dose alta aumenta muito o risco de náusea e vômito intensos — o médico
        normalmente reinicia por uma dose mais baixa e refaz a subida. A{' '}
        <Link href="/ferramentas/titulacao">calculadora de subida de dose</Link> ajuda a remontar o
        calendário.
      </p>

      <h2>Custo: a razão mais comum para parar</h2>
      <p>
        Muita gente interrompe por causa do preço, não por escolha clínica. Antes de parar, vale conhecer
        o custo real de cada dose com a{' '}
        <Link href="/ferramentas/custo-glp1">calculadora de custo</Link> e conversar com o médico sobre
        dose de manutenção — veja também{' '}
        <Link href="/blog/tirzepatida-preco-quanto-custa">quanto custa a tirzepatida no Brasil</Link>.
      </p>
    </ArticleLayout>
  );
}
