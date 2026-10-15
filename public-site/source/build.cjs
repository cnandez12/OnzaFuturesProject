const esbuild=require('esbuild'),fs=require('node:fs');
esbuild.buildSync({entryPoints:['premium-entry.js'],bundle:true,minify:true,format:'iife',target:['es2020'],outfile:'../premium.js',legalComments:'eof'});
fs.copyFileSync(require.resolve('three').replace(/build[\\/]three.cjs$/,'LICENSE'),'../vendor/THREE-LICENSE.txt');
const motionPath=require.resolve('motion').replace(/dist[\\/]cjs[\\/]index.js$/,'LICENSE.md');
if(fs.existsSync(motionPath))fs.copyFileSync(motionPath,'../vendor/MOTION-LICENSE.txt');
console.log('Motion + Three.js production bundle ready.');

