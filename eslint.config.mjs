import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Aspas e apóstrofos em texto pt-BR são comuns; o React já escapa.
      'react/no-unescaped-entities': 'off',
      // Ler localStorage/URL depois de montar (evita erro de hidratação) cai nesta regra.
      'react-hooks/set-state-in-effect': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'legacy/**', 'apresentacao/**', 'next-env.d.ts']),
]);
