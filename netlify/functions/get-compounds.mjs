import { neon } from '@neondatabase/serverless';

export default async (req) => {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  const url = new URL(req.url);
  const category = url.searchParams.get('category');

  let compounds;
  if (category && category !== 'All') {
    compounds = await sql`SELECT * FROM compounds WHERE category = ${category} ORDER BY name ASC`;
  } else {
    compounds = await sql`SELECT * FROM compounds ORDER BY name ASC`;
  }

  return new Response(JSON.stringify(compounds), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};

export const config = { path: '/api/compounds' };
