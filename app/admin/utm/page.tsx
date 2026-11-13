'use client';

import { useMemo, useState } from 'react';
import { BASE_URL as BASE, PATHS as BASE_PATHS, SOURCES } from '@/lib/promocao/utm';

// Destinos e origens compartilhados com lib/promocao/utm.ts; o admin acrescenta 'Outro'.
const PATHS = [...BASE_PATHS, { label: 'Outro (digitar abaixo)', value: '__custom' }];

export default function UtmGeneratorPage() {
  const [pathSel, setPathSel] = useState(PATHS[0].value);
  const [customPath, setCustomPath] = useState('');
  const [source, setSource] = useState(SOURCES[0].value);
  const [medium, setMedium] = useState(SOURCES[0].medium);
  const [campaign, setCampaign] = useState('divulgacao');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    const path = pathSel === '__custom' ? customPath || '/' : pathSel;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const params = new URLSearchParams();
    if (source) params.set('utm_source', source);
    if (medium) params.set('utm_medium', medium);
    if (campaign) params.set('utm_campaign', campaign);
    if (content.trim()) params.set('utm_content', content.trim());
    const qs = params.toString();
    return `${BASE}${cleanPath}${qs ? `?${qs}` : ''}`;
  }, [pathSel, customPath, source, medium, campaign, content]);

  const handleSourceChange = (value: string) => {
    setSource(value);
    const preset = SOURCES.find((s) => s.value === value);
    if (preset) setMedium(preset.medium);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Gerador de link UTM</h1>
      <p className="text-sm text-ink-3 mb-6">
        Ferramenta interna (não indexada). Use antes de colar um link em qualquer
        canal: o Vercel Analytics vai agrupar o tráfego por <code>utm_source</code>.
      </p>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Página de destino</span>
          <select
            value={pathSel}
            onChange={(e) => setPathSel(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          >
            {PATHS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {pathSel === '__custom' && (
          <label className="block">
            <span className="text-sm font-medium">Caminho customizado</span>
            <input
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="/blog/algum-post"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
            />
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium">Canal (utm_source)</span>
          <select
            value={source}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          >
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Tipo (utm_medium)</span>
          <input
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Campanha (utm_campaign)</span>
          <input
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">
            Identificador do grupo/post (utm_content) — opcional
          </span>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ex: grupo-ozempic-bh, r-peptides-thread123"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-ink-3">
            Útil para saber qual grupo específico converteu.
          </span>
        </label>
      </div>

      <div className="mt-8 rounded border border-gray-300 bg-gray-50 p-4">
        <div className="text-xs font-medium text-ink-3 mb-1">URL final</div>
        <div className="break-all font-mono text-sm">{url}</div>
        <button
          type="button"
          onClick={copy}
          className="mt-3 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
    </main>
  );
}
