import { describe, expect, it } from 'vitest';
import { bool, decodeState, encodeState, isoDate, list, num, oneOf, str, type Codec } from '@/lib/url-state';

const codecs = { slug: str, qty: num, unit: oneOf(['mg', 'mcg', 'UI'] as const), on: bool, day: isoDate };
const defaults = { slug: '', qty: '' as number | '', unit: 'mg' as 'mg' | 'mcg' | 'UI', on: true, day: '' };

describe('url-state', () => {
  it('ida e volta', () => {
    const s = { slug: 'bpc-157', qty: 2.5, unit: 'mcg' as const, on: false, day: '2026-11-13' };
    const qs = encodeState(s, defaults, codecs).toString();
    expect(decodeState(new URLSearchParams(qs), codecs)).toEqual(s);
  });

  it('omite o que é padrão', () => {
    expect(encodeState(defaults, defaults, codecs).toString()).toBe('');
  });

  it('ignora valores inválidos e chaves desconhecidas', () => {
    const p = new URLSearchParams('qty=abc&unit=kg&on=talvez&day=13/11&x=1&slug=tb-500');
    expect(decodeState(p, codecs)).toEqual({ slug: 'tb-500' });
  });

  it('aceita vírgula decimal', () => {
    expect(num.parse('2,5')).toBe(2.5);
  });

  it('lista de itens compostos', () => {
    const item: Codec<{ slug: string; mg: number | '' }> = {
      parse: (raw) => {
        const [slug, mg] = raw.split(':');
        const n = num.parse(mg ?? '');
        return n === undefined ? undefined : { slug, mg: n };
      },
      format: (v) => `${v.slug}:${num.format(v.mg) ?? ''}`,
    };
    const c = list(item);
    const rows = [{ slug: 'bpc-157', mg: 5 }, { slug: '', mg: '' as const }];
    expect(c.parse(c.format(rows)!)).toEqual(rows);
    expect(c.parse('a:x')).toBeUndefined();
  });
});
