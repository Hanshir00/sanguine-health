import { neon } from '@neondatabase/serverless';

export default async (req) => {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  if (req.method === 'DELETE') {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const body = await req.json();
    if (!adminPassword || body.password !== adminPassword)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    await sql`DELETE FROM affiliates WHERE id=${body.id}`;
    return new Response(JSON.stringify({ message: 'Deleted.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (req.method === 'POST') {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const body = await req.json();
    if (!adminPassword || body.password !== adminPassword)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    const { id, name, description, url, code, category, logo_url, active, sort_order } = body;
    if (id) {
      await sql`UPDATE affiliates SET name=${name},description=${description},url=${url},code=${code||''},category=${category||''},logo_url=${logo_url||''},active=${active!==false},sort_order=${sort_order||0} WHERE id=${id}`;
      return new Response(JSON.stringify({ message: 'Updated.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      const result = await sql`INSERT INTO affiliates (name,description,url,code,category,logo_url,active,sort_order) VALUES (${name},${description},${url},${code||''},${category||''},${logo_url||''},${active!==false},${sort_order||0}) RETURNING id`;
      return new Response(JSON.stringify({ message: 'Added.', id: result[0].id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // GET
  const affiliates = await sql`SELECT * FROM affiliates WHERE active=true ORDER BY sort_order ASC, name ASC`;
  return new Response(JSON.stringify(affiliates), {
    status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
export const config = { path: '/api/affiliates' };
