import { neon } from '@netlify/neon';

export default async (req) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const body = await req.json();

  if (!adminPassword || body.password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const sql = neon();
  await sql`DELETE FROM compounds WHERE id = ${body.id}`;

  return new Response(JSON.stringify({ message: 'Compound deleted.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = { path: '/api/delete-compound' };
