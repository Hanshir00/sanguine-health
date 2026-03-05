import { neon } from '@netlify/neon';

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' }
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const body = await req.json();

  if (!adminPassword || body.password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const sql = neon();
  const { id, name, category, tag, description, half_life, route } = body;

  if (id) {
    await sql`
      UPDATE compounds SET
        name        = ${name},
        category    = ${category},
        tag         = ${tag},
        description = ${description},
        half_life   = ${half_life},
        route       = ${route}
      WHERE id = ${id}
    `;
    return new Response(JSON.stringify({ message: 'Compound updated.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } else {
    const result = await sql`
      INSERT INTO compounds (name, category, tag, description, half_life, route)
      VALUES (${name}, ${category}, ${tag}, ${description}, ${half_life}, ${route})
      RETURNING id
    `;
    return new Response(JSON.stringify({ message: 'Compound added.', id: result[0].id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};

export const config = { path: '/api/save-compound' };
