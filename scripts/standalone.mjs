import { build } from 'esbuild';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
await mkdir('.standalone',{recursive:true});
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,format:'iife',target:'es2022',outfile:'.standalone/app.js',define:{'process.env.NODE_ENV':'"production"'}});
const js=await readFile('.standalone/app.js','utf8'), css=await readFile('.standalone/app.css','utf8');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>Radiation Shielding &amp; Attenuation Lab</title><style>${css.replaceAll('</style','<\\/style')}</style></head><body><div id="root"></div><script>${js.replaceAll('</script','<\\/script')}</script></body></html>`;
await writeFile('dist/START-HERE.html',html);
await writeFile('START-HERE.html',html);
console.log('Built offline START-HERE.html (no server or runtime network access required).');
