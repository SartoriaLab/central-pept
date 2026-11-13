// Parte da busca que roda no navegador: tipo do item e pontuação.
// O índice em si é montado no servidor (lib/search-index.ts).

export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'peptide' | 'article' | 'tool' | 'page';
  url: string;
  keywords: string;
};

/** Minúsculas e sem acento: "glossario" acha "Glossário", "reconstituicao" acha "reconstituição". */
export function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Busca por pontuação: começo do título > meio do título > palavras-chave.
export function searchIndex(items: SearchResult[], query: string, limit = 8): SearchResult[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = items
    .map((item) => {
      let score = 0;
      const title = normalize(item.title);
      const keywords = normalize(item.keywords);
      for (const t of tokens) {
        if (title.startsWith(t)) score += 50;
        else if (title.includes(t)) score += 20;
        if (keywords.includes(t)) score += 5;
        // bonus por match exato
        if (title === t) score += 100;
      }
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);

  return scored;
}
