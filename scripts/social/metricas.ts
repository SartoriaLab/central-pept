// Métricas do perfil e de cada post (insights da Graph API): `tsx scripts/social/metricas.ts <saida.json>`.
// Precisa da permissão instagram_manage_insights (token EAA) ou instagram_business_manage_insights
// (token IG): sem ela a API responde "(#10) Application does not have permission" e só vem o perfil.
import fs from 'node:fs';
async function main() {
  for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  const state = await import('./state');
  const { token } = await state.getToken();
  const { apiBase } = await import('./instagram');
  const base = apiBase(token);
  const uid = process.env.IG_USER_ID!.trim();
  const get = async (p: string, q: Record<string, string> = {}) => {
    const r = await fetch(`${base}${p}?${new URLSearchParams({ ...q, access_token: token })}`);
    return r.json();
  };
  const out: Record<string, unknown> & { media: Record<string, unknown>[] } = { media: [] };
  out.profile = await get(`/${uid}`, { fields: 'username,followers_count,follows_count,media_count,biography' });
  out.account = await get(`/${uid}/insights`, { metric: 'reach,follower_count,profile_views,accounts_engaged,total_interactions,views,follows_and_unfollows', period: 'day', metric_type: 'total_value', since: String(Math.floor(Date.now() / 1000) - 28 * 86400), until: String(Math.floor(Date.now() / 1000)) });
  out.followerDaily = await get(`/${uid}/insights`, { metric: 'follower_count', period: 'day', since: String(Math.floor(Date.now() / 1000) - 29 * 86400), until: String(Math.floor(Date.now() / 1000)) });
  out.demo = await get(`/${uid}/insights`, { metric: 'follower_demographics', period: 'lifetime', metric_type: 'total_value', breakdown: 'age,gender' });
  out.online = await get(`/${uid}/insights`, { metric: 'online_followers', period: 'lifetime' });
  const media = await get(`/${uid}/media`, { fields: 'id,caption,media_type,media_product_type,timestamp,like_count,comments_count,permalink', limit: '100' });

  for (const m of media.data ?? []) {
    const metric = m.media_product_type === 'REELS'
      ? 'reach,views,likes,comments,shares,saved,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time,follows'
      : 'reach,views,likes,comments,shares,saved,total_interactions,follows,profile_visits';
    let ins = await get(`/${m.id}/insights`, { metric });
    if (ins.error) ins = await get(`/${m.id}/insights`, { metric: 'reach,views,likes,comments,shares,saved,total_interactions' });
    const vals: Record<string, unknown> = {};
    for (const d of ins.data ?? []) vals[d.name] = d.values?.[0]?.value ?? d.total_value?.value;
    out.media.push({ type: m.media_product_type, at: m.timestamp, title: (m.caption ?? '').split('\n')[0].slice(0, 80), ...vals, err: ins.error?.message });
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 2));
  process.exit(0);
}
main();
