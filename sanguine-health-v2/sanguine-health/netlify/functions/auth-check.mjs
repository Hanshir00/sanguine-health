export default async (req) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const body = await req.json();

  if (!adminPassword || body.password !== adminPassword) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = { path: '/api/auth-check' };
