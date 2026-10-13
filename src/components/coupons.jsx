import React, { useRef, useState } from 'react';
import Workspace from './Workspace';
import Icon from './AppIcon';
import { readLocal, writeLocal } from '../lib/storage';

export default function Coupons() {
  const [image,setImage] = useState(''), [text,setText] = useState(''), [busy,setBusy] = useState(false), [error,setError] = useState(''), [copied,setCopied] = useState(false);
  const [coupon,setCoupon] = useState(()=>readLocal('coupon',null));
  const input = useRef(null);
  const upload = file => {
    setError(''); setCopied(false); setCoupon(null); setText('');
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 2*1024*1024) { setError('Choose a PNG, JPEG or WebP image under 2 MB.'); return; }
    const reader = new FileReader(); reader.onload = () => setImage(String(reader.result)); reader.onerror = () => setError('Could not read this image.'); reader.readAsDataURL(file);
  };
  const extract = async () => {
    setBusy(true);setError('');
    try {
      const response = await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:'cohere',image})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.code==='not_configured'?'Image extraction needs the server COHERE_API_KEY. You can paste receipt text below or load the sample receipt.':data.error);
      if (!data.text?.trim()) throw new Error('No readable text was found. Try a clearer image or paste the text.');
      setText(data.text);
    } catch(e) { setError(e.message); } finally { setBusy(false); }
  };
  const generate = () => {
    if (text.trim().length < 10) { setError('Add at least 10 characters of receipt text first.'); return; }
    const item={code:'BITE'+crypto.randomUUID().replaceAll('-','').slice(0,6).toUpperCase(),offer:'10% off your next visit',expires:new Date(Date.now()+7*86400000).toISOString()};
    try { writeLocal('coupon',item); setCoupon(item); setCopied(false); setError(''); } catch { setError('Browser storage is unavailable. Please enable storage and retry.'); }
  };
  return <Workspace title="Deal Box" subtitle="Upload a receipt, review the text and try a sample reward."><p className="demo-notice">Demo rewards only · Coupon codes are samples and cannot be redeemed with a real restaurant.</p><div className="grid lg:grid-cols-2 gap-6"><section className="surface p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><Icon name="ScanLine" className="text-primary" /><h2 className="text-2xl">Your receipt</h2></div><label className="block border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-secondary" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();upload(e.dataTransfer.files[0]);}}><input ref={input} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>upload(e.target.files[0])} /><Icon name="Upload" className="mx-auto mb-3 text-primary" /><strong>Choose or drop an image</strong><span className="block text-xs text-muted-foreground mt-2">PNG, JPEG or WebP · up to 2 MB</span></label>{image && <div className="mt-5"><img src={image} alt="Receipt preview" className="max-h-72 mx-auto rounded-lg" /><div className="flex gap-3 mt-4"><button onClick={extract} disabled={busy} className="action flex-1">{busy?'Reading receipt…':'Extract receipt text'}</button><button className="action action-outline" onClick={()=>{setImage(''); if(input.current)input.current.value='';}}>Remove</button></div></div>}<div className="flex justify-between gap-3 items-center mt-6"><label htmlFor="receipt-text" className="field-label">Receipt text</label><button className="text-primary text-xs underline" onClick={()=>{setText('SAMPLE RECEIPT\nOriginBite Demo Cafe\nVegetable sandwich 180\nCold coffee 120\nTotal INR 300');setError('');}}>Load sample receipt</button></div><textarea id="receipt-text" className="field min-h-40" value={text} onChange={e=>setText(e.target.value)} placeholder="Extract text from your image or paste it here…" /><p className="text-xs text-muted-foreground mt-2">Image extraction sends the selected image to Cohere only when you click Extract.</p>{error && <p role="alert" className="text-sm text-red-700 mt-4">{error}</p>}<button className="action w-full mt-5" disabled={busy||text.trim().length<10} onClick={generate}><Icon name="Gift" size={18} />Generate demo coupon</button></section><section className="surface p-6 md:p-8 h-fit"><p className="eyebrow">A LITTLE EXTRA, ON US</p><h2 className="text-3xl mt-3">Your next bite,<br /><em>a little sweeter.</em></h2>{coupon ? <div className="coupon-ticket mt-8" role="status"><Icon name="Gift" size={35} className="mx-auto mb-5" /><span className="badge">SAMPLE REWARD</span><h3 className="text-2xl my-5">{coupon.offer}</h3><p className="text-xl tracking-[.15em] font-mono border-y border-dashed border-primary/30 py-5">{coupon.code}</p><p className="text-xs mt-4">Sample expiry: {new Date(coupon.expires).toLocaleDateString('en-IN')}</p><button className="action mt-5" onClick={async()=>{try{await navigator.clipboard.writeText(coupon.code);setCopied(true);}catch{setError('Copy unavailable. Select and copy the code manually.');}}}>{copied?'Copied!':'Copy coupon code'}</button><p className="text-xs text-muted-foreground mt-4">No monetary value. For testing only.</p></div> : <div className="py-14 text-center text-muted-foreground"><Icon name="Ticket" size={60} className="mx-auto mb-5 opacity-40" /><p>Your sample reward will appear here.</p></div>}</section></div></Workspace>;
}
