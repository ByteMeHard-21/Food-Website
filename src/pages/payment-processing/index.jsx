import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Workspace from '../../components/Workspace';
import Icon from '../../components/AppIcon';
import { writeLocal } from '../../lib/storage';

let checkoutScript;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScript) checkoutScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.async = true;
    const timer = setTimeout(() => { script.remove(); checkoutScript = null; reject(new Error('Checkout took too long to load. Try again.')); }, 15000);
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); script.remove(); checkoutScript = null; reject(new Error('Could not load Razorpay. Check your connection.')); };
    document.head.appendChild(script);
  });
  return checkoutScript;
}
async function paymentAPI(body) {
  const response = await fetch('/api/test-payment', { method:'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Test payment failed');
  return data;
}
export default function PaymentProcessing() {
  const location = useLocation();
  const [cycle, setCycle] = useState(location.state?.isYearly ? 'yearly' : 'monthly');
  const [method, setMethod] = useState('razorpay');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [receipt,setReceipt] = useState(null);
  const [simulateFailure,setSimulateFailure] = useState(false);
  const price = cycle === 'yearly' ? 9590 : 999;
  const tax = Math.round(price * .18), total = price + tax;
  const complete = (id, mode) => {
    const record = { tier:'Pro', cycle, paymentId:id, mode, amount:total, timestamp:new Date().toISOString() };
    writeLocal('subscription',record); setReceipt(record); setBusy(false);
  };
  const pay = async () => {
    setError(''); setBusy(true);
    try {
      if (method !== 'razorpay') {
        if (simulateFailure) throw new Error('Simulated payment failure. No money was charged. Turn off failure simulation to retry.');
        complete('demo_' + crypto.randomUUID().slice(0,8), 'dummy'); return;
      }
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
      if (!key) throw new Error('Razorpay test key is not configured yet. Choose Dummy UPI or Dummy card to test the complete flow.');
      if (!key.startsWith('rk_test_')) throw new Error('Live payments are disabled. Only a key beginning rk_test_ is accepted.');
      const order = await paymentAPI({ action:'create', cycle });
      await loadCheckout();
      const checkout = new window.Razorpay({ key:order.key, amount:order.amount, currency:'INR', order_id:order.id, name:'OriginBite · TEST', description:`Pro ${cycle} · No real transaction`, theme:{color:'#18503F'},
        handler: async response => {
          try { await paymentAPI({ action:'verify', orderId:order.id, paymentId:response.razorpay_payment_id, signature:response.razorpay_signature }); complete(response.razorpay_payment_id,'razorpay-test'); }
          catch (e) { setError(e.message); setBusy(false); }
        }, modal:{ ondismiss:() => { setBusy(false); setError('Test checkout cancelled. You have not been charged.'); } },
      });
      checkout.on('payment.failed',response => { setError(response.error?.description || 'Test payment failed. Please retry.'); setBusy(false); });
      checkout.open();
    } catch(e) { setError(e.message); setBusy(false); }
  };
  return <Workspace title="Test checkout" subtitle="Experience the Pro upgrade flow. Real payments are permanently disabled.">
    <p className="demo-notice"><strong>TEST MODE ONLY</strong> · No real money moves. This also applies to deployed production builds.</p>
    {receipt ? <section className="surface text-center p-10 max-w-xl mx-auto" role="status"><Icon name="CircleCheck" size={52} className="text-primary mx-auto mb-5" /><h2 className="text-3xl">Test payment successful</h2><p className="mt-4 text-muted-foreground">Your local Pro demo is active. No real charge or paid subscription was created.</p><p className="font-mono text-sm mt-4 break-all">{receipt.paymentId}</p><Link to="/user-dashboard" className="action mt-6">Go to dashboard →</Link></section>
    : <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6"><section className="surface p-6 md:p-8"><h2 className="text-2xl mb-5">Choose a test payment method</h2><div className="space-y-3">{[['razorpay','Razorpay Test Mode','Hosted checkout using your test API keys.','ShieldCheck'],['upi','Dummy UPI','Simulate success or failure without entering a UPI ID.','Smartphone'],['card','Dummy card','Simulate checkout without entering card details.','CreditCard']].map(([id,label,desc,icon]) => <label key={id} className={`flex gap-4 p-5 rounded-xl border cursor-pointer ${method===id?'border-primary bg-secondary':'border-border'}`}><input disabled={busy} type="radio" name="payment" checked={method===id} onChange={()=>setMethod(id)} /><Icon name={icon} className="text-primary" /><span><strong className="block">{label}</strong><span className="text-sm text-muted-foreground">{desc}</span></span></label>)}</div>{method!=='razorpay' && <label className="flex gap-3 mt-5 text-sm"><input type="checkbox" checked={simulateFailure} onChange={e=>setSimulateFailure(e.target.checked)} />Simulate a failed payment</label>}{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 text-red-800 p-4">{error}</p>}<button disabled={busy} className="action w-full mt-6" onClick={pay}>{busy ? 'Waiting for test checkout…' : method==='razorpay' ? 'Open Razorpay test checkout' : 'Complete dummy payment'}</button><p className="text-xs text-muted-foreground mt-4">The Pro status is a local demo state, not a paid entitlement.</p></section><aside className="surface p-7 h-fit"><p className="eyebrow">ORDER SUMMARY</p><h2 className="text-3xl mt-3">OriginBite Pro</h2><label className="field-label mt-5">Billing cycle<select disabled={busy} className="field" value={cycle} onChange={e=>setCycle(e.target.value)}><option value="monthly">Monthly</option><option value="yearly">Yearly · save ₹2,398</option></select></label><div className="space-y-4 my-6"><p className="flex justify-between"><span>Pro plan</span><span>₹{price.toLocaleString('en-IN')}</span></p><p className="flex justify-between text-muted-foreground"><span>GST estimate (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></p><p className="flex justify-between border-t border-border pt-4 font-bold text-xl"><span>Test total</span><span>₹{total.toLocaleString('en-IN')}</span></p></div><p className="text-sm text-primary">✓ Unlimited demo analyses<br />✓ Reports & business planning<br />✓ No actual charge</p><Link to="/subscription-tiers" className="block text-sm text-muted-foreground mt-6">← Compare plans</Link></aside></div>}
  </Workspace>;
}
