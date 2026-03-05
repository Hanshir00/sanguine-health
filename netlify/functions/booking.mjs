import { neon } from '@neondatabase/serverless';
export default async (req) => {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  if (req.method === 'POST') {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const body = await req.json();
    if (!adminPassword || body.password !== adminPassword)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    const { title, subtitle, description, cta_label, cta_url, step1_title, step1_text, step2_title, step2_text, step3_title, step3_text } = body;
    await sql`UPDATE booking_content SET title=${title},subtitle=${subtitle},description=${description},cta_label=${cta_label},cta_url=${cta_url},step1_title=${step1_title},step1_text=${step1_text},step2_title=${step2_title},step2_text=${step2_text},step3_title=${step3_title},step3_text=${step3_text},updated_at=NOW() WHERE id=1`;
    return new Response(JSON.stringify({ message: 'Booking updated.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  const rows = await sql`SELECT * FROM booking_content WHERE id=1`;
  return new Response(JSON.stringify(rows[0] || {}), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
};
export const config = { path: '/api/booking' };
