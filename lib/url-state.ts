// Estado de calculadora ↔ query string. Funções puras (testadas em tests/url-state.test.ts);
// o hook que liga isso ao React fica em components/calculator/useUrlState.ts.

export type Codec<T> = {
  /** Texto da URL → valor; undefined quando inválido (fica o padrão). */
  parse: (raw: string) => T | undefined;
  /** Valor → texto da URL; undefined não escreve o parâmetro. */
  format: (value: T) => string | undefined;
};

/** Número opcional: '' = campo vazio. */
export const num: Codec<number | ''> = {
  parse: (raw) => {
    if (raw === '') return '';
    const n = Number(raw.replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  },
  format: (v) => (v === '' ? undefined : String(v)),
};

export const str: Codec<string> = {
  parse: (raw) => raw,
  format: (v) => (v === '' ? undefined : v),
};

export const bool: Codec<boolean> = {
  parse: (raw) => (raw === '1' ? true : raw === '0' ? false : undefined),
  format: (v) => (v ? '1' : '0'),
};

/** Um entre valores fixos (texto ou número). */
export function oneOf<T extends string | number>(values: readonly T[]): Codec<T> {
  return {
    parse: (raw) => values.find((v) => String(v) === raw),
    format: (v) => String(v),
  };
}

/** Data ISO (aaaa-mm-dd). */
export const isoDate: Codec<string> = {
  parse: (raw) => (/^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined),
  format: (v) => v || undefined,
};

/** Horário (hh:mm). */
export const hhmm: Codec<string> = {
  parse: (raw) => (/^([01]\d|2[0-3]):[0-5]\d$/.test(raw) ? raw : undefined),
  format: (v) => v || undefined,
};

/** Lista de itens separados por "~", cada item com campos separados por ":". */
export function list<T>(item: Codec<T>): Codec<T[]> {
  return {
    parse: (raw) => {
      if (raw === '') return [];
      const out: T[] = [];
      for (const part of raw.split('~')) {
        const v = item.parse(part);
        if (v === undefined) return undefined;
        out.push(v);
      }
      return out;
    },
    format: (vs) => {
      const parts = vs.map(item.format);
      return parts.every((p): p is string => p !== undefined) ? parts.join('~') : undefined;
    },
  };
}

export type Codecs<S> = { [K in keyof S]: Codec<S[K]> };

/** Lê da query string só as chaves conhecidas e válidas. */
export function decodeState<S>(params: URLSearchParams, codecs: Codecs<S>): Partial<S> {
  const out: Partial<S> = {};
  for (const key of Object.keys(codecs) as (keyof S & string)[]) {
    const raw = params.get(key);
    if (raw === null) continue;
    const v = codecs[key].parse(raw);
    if (v !== undefined) out[key] = v;
  }
  return out;
}

/** Escreve na query string só o que difere do padrão (URL curta). */
export function encodeState<S>(state: S, defaults: S, codecs: Codecs<S>): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of Object.keys(codecs) as (keyof S & string)[]) {
    const codec = codecs[key];
    const value = codec.format(state[key]);
    if (value === undefined || value === codec.format(defaults[key])) continue;
    params.set(key, value);
  }
  return params;
}
