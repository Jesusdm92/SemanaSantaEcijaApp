
import fs from 'fs';
import path from 'path';

try {
  const h2026Path = path.resolve(process.cwd(), 'public/data/hermandades-2026.json');
  const h2026 = JSON.parse(fs.readFileSync(h2026Path, 'utf8'));

  const sqlStatements = h2026.map(h => {
    // Escape single quotes for SQL
    const itineraryStr = JSON.stringify(h.itinerary).replace(/'/g, "''");
    return `UPDATE hermandades SET itinerary = '${itineraryStr}'::jsonb WHERE id = ${h.id};`;
  });

  fs.writeFileSync('update_itineraries_supabase.sql', sqlStatements.join('\n'), 'utf8');
  console.log('File created: update_itineraries_supabase.sql');
} catch (err) {
  console.error('ERROR during sql prep:', err);
  process.exit(1);
}
