// Shared layout baseline; Cloud card styling validated by the shared visible contract.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const hash = text => createHash('sha256').update(text).digest('hex');
test('Android uses the original SalsaAppCloud layout and stylesheet', async () => {
 const root = new URL('../app/src/main/assets/', import.meta.url);
 const html = await readFile(new URL('index.html', root), 'utf8');
 assert.equal(hash(html.slice(html.indexOf('<body>'))), 'ca00adb05201cbe9f16395c3df32f8b747644b01fc154477f79fed0e1b0793c1');
 assert.equal(hash(await readFile(new URL('styles.css', root))), 'c6a69fc0e16366798322655322b2542d8aab657d2ca552c0fea6b48d172b9bbd');
 const manifest = await readFile(new URL('../app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
 assert.match(manifest, /name=".CloudUiActivity" android:exported="true"/);
});
