import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';

const win=new Window({url:'https://example.test/'});
for(const key of ['window','document','localStorage','location','history','IntersectionObserver'])globalThis[key]=key==='window'?win:win[key];
const {writeCloudCache,clearCloudCache}=await import('../app/src/main/assets/cloud-cache.js');
const {createPosterView}=await import('../app/src/main/assets/cloud-posters.js');

test('cached Cloud thumbnails appear immediately before lazy loading when reopening the view',async()=>{
 const revision={id:'cached-poster',created_at:'one',videos:[{id:'video'}]};
 await writeCloudCache('public','poster:cached-poster:one',{bytes:new Uint8Array([255,216,255,217]).buffer,kind:'local'});
 const root=document.createElement('div'),picture=document.createElement('div');root.append(picture);document.body.append(root);
 const view=createPosterView(root,null);
 try{
  view.add(picture,revision);
  assert.ok(picture.querySelector('img.cloud-thumbnail'),'An already cached image must appear without waiting for IntersectionObserver');
  assert.equal(picture.querySelector('.cloud-thumbnail-placeholder'),null);
 }finally{view.dispose();root.remove();}
});

test('changed revisions and cleared account caches cannot show a previous thumbnail',async()=>{
 await writeCloudCache('public','poster:guarded:one',{bytes:new Uint8Array([255,216,255,217]).buffer,kind:'local'});
 const root=document.createElement('div');document.body.append(root);
 try{
  const picture=document.createElement('div');root.append(picture);
  const view=createPosterView(root,null);view.add(picture,{id:'guarded',created_at:'two',videos:[]});
  assert.equal(picture.querySelector('img.cloud-thumbnail'),null,'A changed revision must load its own poster');view.dispose();
  await clearCloudCache('public');
  const other=document.createElement('div');root.append(other);
  const next=createPosterView(root,null);next.add(other,{id:'guarded',created_at:'one',videos:[]});
  assert.equal(other.querySelector('img.cloud-thumbnail'),null,'A cleared account cache must never resurrect images');next.dispose();
 }finally{root.remove();}
});
