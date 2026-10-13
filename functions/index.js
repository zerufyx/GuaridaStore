// Cloudflare Pages Function para "/" (el catálogo).
// Si el link trae ?p=ID, cambia la vista previa (WhatsApp, Instagram, iMessage…)
// para que muestre la foto, el nombre y el precio de ese producto.
// Sin ?p= o si algo falla, entrega la página tal cual.

const SB_URL = 'https://drkcstmcdscklcrefxbs.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRya2NzdG1jZHNja2xjcmVmeGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzc1NjksImV4cCI6MjA5MjgxMzU2OX0.4LE8Qj0LWLvJEJ_peQK9YU1CJPjZXZS0Kjc6ahlZ4wE';
const STORE_ID = 7;
const STORE_NAME = 'Guarida Store';

const money = n => '$' + (Number.isInteger(n) ? n.toLocaleString('en-US') : n.toFixed(2));

export async function onRequest(context) {
  const res = await context.next();
  try {
    const url = new URL(context.request.url);
    const pid = url.searchParams.get('p');
    if (!pid || !/^\d{1,12}$/.test(pid)) return res;
    if (!(res.headers.get('content-type') || '').includes('text/html')) return res;

    const q = `${SB_URL}/rest/v1/products?select=name,price,discount_price,image_url,images,description_short,sold_out` +
              `&id=eq.${pid}&store_id=eq.${STORE_ID}&hidden=not.is.true&limit=1`;
    const r = await fetch(q, { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }, cf: { cacheTtl: 120, cacheEverything: true } });
    if (!r.ok) return res;
    const [p] = await r.json();
    if (!p) return res;

    const img = (Array.isArray(p.images) && p.images[0]) || p.image_url || null;
    const base = Number(p.price) || 0, sale = Number(p.discount_price) || 0;
    const price = base > 0 ? (sale > 0 && sale < base ? `${money(sale)} (antes ${money(base)})` : money(base)) : 'Precio a consultar';
    const title = `${p.name} | ${STORE_NAME}`;
    const desc = [p.sold_out ? 'Agotado' : price, p.description_short].filter(Boolean).join(' · ');
    const set = (attr, value) => ({ element(e) { e.setAttribute(attr, value); } });

    let rw = new HTMLRewriter()
      .on('title', { element(e) { e.setInnerContent(title); } })
      .on('meta[property="og:title"]', set('content', title))
      .on('meta[property="og:description"]', set('content', desc))
      .on('meta[name="description"]', set('content', desc))
      .on('meta[property="og:url"]', set('content', url.origin + '/?p=' + pid));
    if (img) rw = rw.on('meta[property="og:image"]', set('content', img));

    const out = rw.transform(res);
    const h = new Headers(out.headers);
    h.set('cache-control', 'public, max-age=60');
    return new Response(out.body, { status: out.status, headers: h });
  } catch (e) {
    return res;
  }
}
