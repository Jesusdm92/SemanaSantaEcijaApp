
const fs = require('fs');
const path = require('path');

const h2025Path = path.join(process.cwd(), 'public/data/hermandades-2025.json');
const r2026Path = path.join(process.cwd(), 'public/data/recorrido_2026.json');
const outPath = path.join(process.cwd(), 'public/data/hermandades-2026.json');

const h2025 = JSON.parse(fs.readFileSync(h2025Path, 'utf8'));
const r2026 = JSON.parse(fs.readFileSync(r2026Path, 'utf8'));

const updated = h2025.map(h => {
  const match = r2026.find(r => r.id === h.id);
  if (match && match.itinerario) {
    // Split by comma and trim. Also handles cases where there might be a "y" at the end if we want
    // but the user just wants the string split.
    const newItinerary = match.itinerario.split(',').map(s => s.trim()).filter(s => s.length > 0);
    return { ...h, itinerary: newItinerary };
  }
  return h;
});

fs.writeFileSync(outPath, JSON.stringify(updated, null, 2), 'utf8');
console.log('File created: public/data/hermandades-2026.json');
