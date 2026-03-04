const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

function makePng(filename, width, height, bg, text){
  const file = path.join(assetsDir, filename);
  if (fs.existsSync(file)) { console.log('Skip existing', filename); return; }
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0,0,width,height);
  ctx.fillStyle = '#ffffff';
  const fontSize = Math.floor(Math.min(width,height) * 0.22);
  ctx.font = `bold ${fontSize}px Sans`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(text, width/2, height/2);
  fs.writeFileSync(file, canvas.toBuffer('image/png'));
  console.log('Created', filename);
}

makePng('icon.png',1024,1024,'#4b0082','SS');
makePng('adaptive-icon.png',1024,1024,'#4b0082','SS');
makePng('splash.png',1242,2436,'#4b0082','SEMANA\nSANTA');
