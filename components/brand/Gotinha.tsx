// Gotinha no site: o mesmo desenho do Instagram (scripts/social/mascot.tsx é a fonte única;
// mudou a mascote lá, muda aqui). SVG puro, sem estado: serve em server e client components.
// Use com parcimônia (estado vazio, 404): ela orienta, não enfeita. Duas na mesma página
// precisam de `id` diferentes (o gradiente do corpo é referenciado por id).

export { default } from '@/scripts/social/mascot';
