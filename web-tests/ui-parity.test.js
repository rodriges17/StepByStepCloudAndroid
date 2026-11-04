// Shared layout baseline; Cloud card styling validated by the shared visible contract.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const hash = text => createHash('sha256').update(text).digest('hex');
test('Android uses the original SalsaAppCloud layout and stylesheet', async () => {
 const root = new URL('../app/src/main/assets/', import.meta.url);
 const html = await readFile(new URL('index.html', root), 'utf8');
 assert.equal(hash(html.slice(html.indexOf('<body>'))), '12089451ae88c18a40e6328ac14cec4c8b2a508f1c9436e35e0b4da10e89bb6b');
 assert.equal(hash(await readFile(new URL('styles.css', root))), '9cef0e4610899be821868110f65e03c990e5842a73c026f037aa8d26ddf1c9ad');
 const manifest = await readFile(new URL('../app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
 assert.match(manifest, /name=".CloudUiActivity" android:exported="true"/);
});
