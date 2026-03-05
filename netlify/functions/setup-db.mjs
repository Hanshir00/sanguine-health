import { neon } from '@neondatabase/serverless';

export default async (req) => {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  // Compounds table with new fields
  await sql`
    CREATE TABLE IF NOT EXISTS compounds (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      category    VARCHAR(100),
      tag         VARCHAR(100),
      description TEXT,
      half_life   VARCHAR(100),
      route       VARCHAR(100),
      glossary    TEXT,
      pdf_url     VARCHAR(500),
      created_at  TIMESTAMP DEFAULT NOW()
    )
  `;

  // Add new columns if they don't exist (for existing installs)
  await sql`ALTER TABLE compounds ADD COLUMN IF NOT EXISTS glossary TEXT`;
  await sql`ALTER TABLE compounds ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500)`;

  // Booking section content table
  await sql`
    CREATE TABLE IF NOT EXISTS booking_content (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255),
      subtitle    VARCHAR(255),
      description TEXT,
      cta_label   VARCHAR(100),
      cta_url     VARCHAR(500),
      step1_title VARCHAR(100),
      step1_text  TEXT,
      step2_title VARCHAR(100),
      step2_text  TEXT,
      step3_title VARCHAR(100),
      step3_text  TEXT,
      updated_at  TIMESTAMP DEFAULT NOW()
    )
  `;

  // Seed compounds if empty
  const compCount = await sql`SELECT COUNT(*) AS count FROM compounds`;
  if (parseInt(compCount[0].count) === 0) {
    await sql`
      INSERT INTO compounds (name, category, tag, description, half_life, route, glossary, pdf_url) VALUES
      ('BPC-157', 'Peptide', 'Recovery',
        'Body protection compound derived from gastric juice. Studied extensively for accelerated tendon, ligament, and gut healing. One of the most researched peptides in the longevity space.',
        '~4 hours', 'SubQ / Oral',
        'Pentadecapeptide · Cytoprotective · Angiogenic · COX-2 inhibitor · Growth hormone receptor modulator',
        ''),
      ('Semaglutide / GLP-1', 'Peptide', 'Metabolic',
        'GLP-1 receptor agonist with powerful effects on satiety, insulin sensitivity, and metabolic function. At the forefront of modern weight management research.',
        '~7 days', 'SubQ',
        'GLP-1 receptor agonist · Incretin mimetic · Glucagon suppression · Gastric emptying delay · Appetite regulation',
        ''),
      ('Semax', 'Nootropic', 'Cognitive',
        'Synthetic peptide analogue of ACTH with neuroprotective and cognitive-enhancing properties. Popular among researchers studying focus, neurogenesis, and mood regulation.',
        '~20 min', 'Intranasal',
        'ACTH analogue · BDNF upregulation · Dopaminergic · Serotonergic · Neuroprotective',
        '')
    `;
  }

  // Seed booking content if empty
  const bookCount = await sql`SELECT COUNT(*) AS count FROM booking_content`;
  if (parseInt(bookCount[0].count) === 0) {
    await sql`
      INSERT INTO booking_content (title, subtitle, description, cta_label, cta_url, step1_title, step1_text, step2_title, step2_text, step3_title, step3_text)
      VALUES (
        'Ready to get started?',
        'Schedule',
        'Choose a time that works for you. Sessions are held via Zoom — all you need is 60 minutes and your health goals.',
        'View Availability & Book →',
        'https://calendly.com/YOUR-LINK-HERE',
        'Choose your session type',
        'Initial assessment, specialty session, or protocol review.',
        'Pick your time',
        'Select from available slots in your timezone.',
        'Complete intake form',
        'A short pre-session questionnaire so we hit the ground running.'
      )
    `;
  }

  return new Response(JSON.stringify({ message: 'Database initialized successfully!' }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};

export const config = { path: '/api/setup-db' };
