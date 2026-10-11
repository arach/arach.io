// Linea owns this explanatory demo. The personal site hosts a pinned copy.
// Local integrity: bun scripts/verify-infinite-margins-demo.js
// Source parity: bun scripts/verify-infinite-margins-demo.js --canonical
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const manifest=JSON.parse(await readFile(new URL('./data/infinite-margins-demo-source.json',import.meta.url),'utf8'));
const canonical=process.argv.includes('--canonical');
for(const [name,expected] of Object.entries(manifest.files)){
  const local=await readFile(new URL(`../public/experiments/infinite-margins/${name}`,import.meta.url));
  if(createHash('sha256').update(local).digest('hex')!==expected)throw new Error(`Demo copy changed: ${name}. Update from the declared Linea revision and refresh the manifest together.`);
  if(canonical){
    if(!/^[a-f0-9]{40}$/.test(manifest.canonicalRevision))throw new Error('Pin the canonical Linea commit before source parity verification.');
    // The canonical repository is private. Use the operator's existing gh
    // authentication; never embed a credential in the manifest or URL.
    const source=execFileSync('gh',['api',`repos/arach/linea/contents/${manifest.canonicalDirectory}/${name}?ref=${manifest.canonicalRevision}`,'-H','Accept: application/vnd.github.raw+json'],{maxBuffer:1024*1024});
    if(createHash('sha256').update(source).digest('hex')!==expected)throw new Error(`Canonical source differs: ${name}`);
  }
}
console.log(`Demo ${canonical?'canonical source parity':'local pinned-copy integrity'} verified (${Object.keys(manifest.files).length} assets).`);
