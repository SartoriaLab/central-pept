'use client';

import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'inputMode'> & {
  value: number | '';
  onChange: (n: number | '') => void;
  /** Só inteiros (teclado numérico sem vírgula). */
  integer?: boolean;
};

const show = (v: number | '') => (v === '' ? '' : String(v).replace('.', ','));

/**
 * Campo numérico que aceita vírgula ou ponto e pode ficar vazio.
 * `type="number"` recusa "2,5" em vários navegadores e não deixa apagar o valor
 * quando o estado é sempre numérico; aqui o texto digitado é guardado à parte.
 */
export default function DecimalInput({ value, onChange, integer = false, ...rest }: Props) {
  const [text, setText] = useState(() => show(value));
  const last = useRef<number | ''>(value);

  // Valor mudou por fora (atalho, exemplo, troca de peptídeo): reflete no texto.
  useEffect(() => {
    if (value !== last.current) {
      last.current = value;
      setText(show(value));
    }
  }, [value]);

  return (
    <input
      {...rest}
      type="text"
      inputMode={integer ? 'numeric' : 'decimal'}
      autoComplete="off"
      value={text}
      onChange={(e) => {
        let raw = e.target.value.replace(integer ? /[^\d]/g : /[^\d.,]/g, '');
        // um separador só
        const i = raw.search(/[.,]/);
        if (i >= 0) raw = raw.slice(0, i + 1) + raw.slice(i + 1).replace(/[.,]/g, '');
        setText(raw);
        const n = parseFloat(raw.replace(',', '.'));
        const next: number | '' = raw === '' || !Number.isFinite(n) ? '' : n;
        last.current = next;
        onChange(next);
      }}
    />
  );
}
