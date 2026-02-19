import fs from 'fs';
import path from 'path';

const jsonPath = path.join(process.cwd(), 'public/data/hermandades-2025.json');
const outputPath = path.join(process.cwd(), 'supabase_data_update.sql');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

let sql = `-- Script to update 'pasos' and 'web_oficial' columns in Supabase
-- Run this in the Supabase SQL Editor

`;

data.forEach(h => {
    const pasosJson = JSON.stringify(h.pasos || []).replace(/'/g, "''"); // Escape single quotes
    const web = h.webOficial ? `'${h.webOficial.replace(/'/g, "''")}'` : 'NULL';

    // Use upsert or update. Since IDs match, UPDATE is safer to avoid creating duplicates if ID somehow changed?
    // But IDs in JSON match Supabase IDs (checked previously).

    sql += `UPDATE hermandades SET 
  pasos = '${pasosJson}'::jsonb,
  web_oficial = ${web},
  titulo_completo = '${(h.tituloCompleto || '').replace(/'/g, "''")}',
  ano_fundacion = '${(h.anoFundacion || '').replace(/'/g, "''")}'
WHERE id = ${h.id};

`;
});

fs.writeFileSync(outputPath, sql);
console.log(`Generated SQL at ${outputPath}`);
