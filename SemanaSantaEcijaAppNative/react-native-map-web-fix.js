const { readFile, writeFile, copyFile, access } = require('fs').promises;
const fs = require('fs');
const path = require('path');

(async function run(){
  try {
    const modulePath = path.join(__dirname,'node_modules','react-native-maps');
    const libPath = path.join(modulePath,'lib');
    if(!fs.existsSync(modulePath)) {
      console.log('[react-native-maps web fix] paquete no encontrado, saltando');
      return;
    }
    if(!fs.existsSync(libPath)) {
      console.log('[react-native-maps web fix] carpeta lib no existe (posible cambio de versión), saltando');
      return;
    }
    const webIndex = path.join(libPath,'index.web.js');
    await writeFile(webIndex,'module.exports = {}','utf-8');
    const dtsSource = path.join(libPath,'index.d.ts');
    const dtsTarget = path.join(libPath,'index.web.d.ts');
    if(fs.existsSync(dtsSource)) {
      await copyFile(dtsSource,dtsTarget);
    }
    const pkgFile = path.join(modulePath,'package.json');
    const pkg = JSON.parse(await readFile(pkgFile,'utf-8'));
    pkg['react-native'] = 'lib/index.js';
    pkg['main'] = 'lib/index.web.js';
    await writeFile(pkgFile, JSON.stringify(pkg,null,2), 'utf-8');
    console.log('[react-native-maps web fix] aplicado correctamente');
  } catch(err) {
    console.error('[react-native-maps web fix] error', err);
  }
})();
