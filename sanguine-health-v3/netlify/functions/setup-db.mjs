import { neon } from '@netlify/neon';

export default async (req) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const url = new URL(req.url);
  const password = url.searchParams.get('password');

  if (!adminPassword || password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const sql = neon();

  await sql`
    CREATE TABLE IF NOT EXISTS compounds (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      category    VARCHAR(100),
      tag         VARCHAR(100),
      description TEXT,
      half_life   VARCHAR(100),
      route       VARCHAR(100),
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `;

  const result = await sql`SELECT COUNT(*) AS count FROM compounds`;
  if (parseInt(result[0].count) === 0) {
    await sql`
      INSERT INTO compounds (name, category, tag, description, half_life, route) VALUES
      (
        'BPC-157', 'Peptide', 'Recovery',
        'Body protection compound derived from gastric juice. Studied extensively for accelerated tendon, ligament, and gut healing. One of the most researched peptides in the longevity space.',
        '~4 hours', 'SubQ / Oral'
      ),
      (
        'Semaglutide / GLP-1', 'Peptide', 'Metabolic',
        'GLP-1 receptor agonist with powerful effects on satiety, insulin sensitivity, and metabolic function. At the forefront of modern weight management research.',
        '~7 days', 'SubQ'
      ),
      (
        'Semax', 'Nootropic', 'Cognitive',
        'Synthetic peptide analogue of ACTH with neuroprotective and cognitive-enhancing properties. Popular among researchers studying focus, neurogenesis, and mood regulation.',
        '~20 min', 'Intranasal'
      )
    `;
  }

  return new Response(
    JSON.stringify({ message: 'Database initialized successfully!' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export const config = { path: '/api/setup-db' };
