
import fs from 'fs';
import path from 'path';

try {
  const h2025Path = path.resolve(process.cwd(), 'public/data/hermandades-2025.json');
  const r2026Path = path.resolve(process.cwd(), 'public/data/recorrido_2026.json');
  const outPath = path.resolve(process.cwd(), 'public/data/hermandades-2026.json');

  console.log('Reading 2025 data...');
  const h2025 = JSON.parse(fs.readFileSync(h2025Path, 'utf8'));
  console.log('Reading 2026 recorrido...');
  const r2026Raw = fs.readFileSync(r2026Path, 'utf8');
  // Handle UTF-8 BOM if present
  const r2026Clean = r2026Raw.charCodeAt(0) === 0xFEFF ? r2026Raw.slice(1) : r2026Raw;
  const r2026 = JSON.parse(r2026Clean);

  console.log('Merging...');
  const updated = h2025.map(h => {
    const match = r2026.find(r => r.id === h.id);
    if (match && match.itinerario) {
      const newItinerary = match.itinerario.split(',').map(s => s.trim()).filter(s => s.length > 0);
      return { ...h, itinerary: newItinerary };
    }
    return h;
  });

  fs.writeFileSync(outPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log('SUCCESS! File created: public/data/hermandades-2026.json');
} catch (err) {
  console.error('ERROR during merge:', err);
  process.exit(1);
}
