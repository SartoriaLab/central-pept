'use client';

import { useState } from 'react';

const SITES = [
  {
    id: 'abdomen',
    label: 'Abdome',
    desc: 'Região mais recomendada. Absorção rápida e consistente. Evite 5 cm ao redor do umbigo.',
    absorption: 'Rápida',
    ease: 'Fácil',
  },
  {
    id: 'thigh',
    label: 'Coxa',
    desc: 'Face ântero-externa da coxa. Absorção um pouco mais lenta. Boa para autoaplicação.',
    absorption: 'Moderada',
    ease: 'Fácil',
  },
  {
    id: 'arm',
    label: 'Braço',
    desc: 'Face posterior do braço (tríceps). Absorção rápida. Difícil aplicar em você mesmo — peça ajuda.',
    absorption: 'Rápida',
    ease: 'Com ajuda',
  },
] as const;

type SiteId = typeof SITES[number]['id'];

export default function InjectionSiteGuide() {
  const [active, setActive] = useState<SiteId>('abdomen');
  const activeSite = SITES.find((s) => s.id === active)!;

  return (
    <section className="card overflow-hidden">
      <div className="p-5 md:p-6 border-b border-border bg-gradient-to-br from-teal-50/50 to-transparent">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx={12} cy={10} r={3} />
              <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
            </svg>
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-ink">Onde aplicar</h2>
        </div>
        <p className="text-sm text-ink-2 ml-12">
          Peptídeos subcutâneos podem ser aplicados em 3 regiões principais. Revezar é importante para evitar lipohipertrofia.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr] gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* SVG body */}
        <div className="p-6 flex items-center justify-center bg-bg/50">
          <svg viewBox="0 0 240 400" className="w-full max-w-[220px] h-auto" aria-label="Boneco humano com locais de aplicação">
            {/* Body outline */}
            <g fill="var(--border-2)" stroke="var(--text-3)" strokeWidth="1.5" opacity="0.35">
              {/* Head */}
              <circle cx="120" cy="40" r="22" />
              {/* Neck */}
              <rect x="112" y="60" width="16" height="10" />
              {/* Torso */}
              <path d="M80 70 Q80 68 90 68 L150 68 Q160 68 160 70 L165 180 Q165 190 155 190 L85 190 Q75 190 75 180 Z" />
              {/* Arms */}
              <path d="M80 72 Q62 80 58 100 L50 180 Q48 195 58 195 L65 195 Q72 195 74 185 L82 110 Z" />
              <path d="M160 72 Q178 80 182 100 L190 180 Q192 195 182 195 L175 195 Q168 195 166 185 L158 110 Z" />
              {/* Legs */}
              <path d="M85 190 Q85 200 88 210 L95 340 Q96 350 105 350 L118 350 Q122 350 122 340 L120 190 Z" />
              <path d="M155 190 Q155 200 152 210 L145 340 Q144 350 135 350 L122 350 Q118 350 118 340 L120 190 Z" />
            </g>

            {/* Region highlights (dots + halos) */}
            {/* Abdome */}
            <g onClick={() => setActive('abdomen')} className="cursor-pointer" style={{ pointerEvents: 'all' }}>
              <circle cx="120" cy="140" r="26" fill="var(--teal)" opacity={active === 'abdomen' ? 0.15 : 0.05} />
              <circle cx="120" cy="140" r={active === 'abdomen' ? 9 : 6} fill="var(--teal)" />
              <circle cx="120" cy="140" r={active === 'abdomen' ? 4 : 3} fill="white" />
            </g>
            {/* Coxa (só uma para simplificar) */}
            <g onClick={() => setActive('thigh')} className="cursor-pointer" style={{ pointerEvents: 'all' }}>
              <circle cx="103" cy="240" r="22" fill="var(--teal)" opacity={active === 'thigh' ? 0.15 : 0.05} />
              <circle cx="103" cy="240" r={active === 'thigh' ? 9 : 6} fill="var(--teal)" />
              <circle cx="103" cy="240" r={active === 'thigh' ? 4 : 3} fill="white" />
            </g>
            {/* Braço */}
            <g onClick={() => setActive('arm')} className="cursor-pointer" style={{ pointerEvents: 'all' }}>
              <circle cx="68" cy="130" r="18" fill="var(--teal)" opacity={active === 'arm' ? 0.15 : 0.05} />
              <circle cx="68" cy="130" r={active === 'arm' ? 9 : 6} fill="var(--teal)" />
              <circle cx="68" cy="130" r={active === 'arm' ? 4 : 3} fill="white" />
            </g>
          </svg>
        </div>

        {/* Info */}
        <div className="p-5 md:p-6 flex flex-col">
          <div className="flex gap-1.5 mb-4">
            {SITES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={`flex-1 px-3 py-2 text-sm font-bold rounded transition-all ${
                  active === s.id
                    ? 'bg-teal text-white'
                    : 'bg-bg text-ink-2 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <p className="text-sm text-ink-2 leading-relaxed mb-4">{activeSite.desc}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-bg">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Absorção</div>
                <div className="font-bold text-ink text-sm mt-0.5">{activeSite.absorption}</div>
              </div>
              <div className="p-3 rounded-lg bg-bg">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Facilidade</div>
                <div className="font-bold text-ink text-sm mt-0.5">{activeSite.ease}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Rotacionar é essencial:</strong> alterne o lado e afaste cada aplicação em ~2 cm da anterior para evitar lipohipertrofia e perda de absorção.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
