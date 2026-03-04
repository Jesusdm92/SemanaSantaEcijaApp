const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Extender sin perder extensiones por defecto
const extraWeb = ['web.ts','web.tsx','web.js','web.jsx'];
config.resolver.sourceExts = Array.from(new Set([...config.resolver.sourceExts, ...extraWeb]));

// Priorizar campos para entorno web manteniendo compatibilidad
config.resolver.resolutionMainFields = ['browser','module','main'];

module.exports = config;
