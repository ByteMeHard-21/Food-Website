import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { calculateAnalysis, revenueProjection } from '../src/lib/scoring.js';
import { paymentHandler } from '../api/test-payment.js';
import { aiHandler } from '../api/ai.js';

const input = { location:'Bandra', cuisine:'Cafe', budget:2500000, metroAccess:false, timeline:'6-months' };
const locality = { total_demand_score:700, opportunity_score:65, avg_rating:4, total_reviews:1000 };
const stats = { restaurant_count:10, avg_rating:4, total_reviews:3000 };
function response() { return { code:200, body:null, setHeader(){}, status(code){this.code=code;return this;},json(body){this.body=body;return this;} }; }
test('Analysis responds to competition and metro access and stays bounded',()=>{
  const base=calculateAnalysis(input,locality,stats);
  const competitive=calculateAnalysis(input,locality,{...stats,restaurant_count:50});
  const metro=calculateAnalysis({...input,metroAccess:true},locality,stats);
  assert.ok(competitive.successRate<base.successRate);
  assert.equal(metro.successRate,base.successRate+5);
  const extreme=calculateAnalysis(input,{...locality,total_demand_score:999999,opportunity_score:999999},stats);
  assert.ok(extreme.successRate<=95); assert.ok(extreme.metrics.demandScore<=100);
});
test('Invalid budgets fail and projections scale with investment',()=>{
  assert.throws(()=>calculateAnalysis({...input,budget:0},locality,stats));
  const small=revenueProjection(input,{successRate:60});
  const large=revenueProjection({...input,budget:5000000},{successRate:60});
  assert.equal(small.length,12);assert.equal(large[0].revenue,small[0].revenue*2);
});
test('Live Razorpay keys are rejected before any provider request',async()=>{
  const res=response();await paymentHandler({VITE_RAZORPAY_KEY_ID:'rk_live_example',RAZORPAY_KEY_SECRET:'example'})({method:'POST',body:{action:'create',cycle:'monthly'}},res);
  assert.equal(res.code,400);assert.match(res.body.error,/Test Mode/);
});
test('Razorpay signature verification rejects tampering',async()=>{
  const env={VITE_RAZORPAY_KEY_ID:'rk_test_example',RAZORPAY_KEY_SECRET:'test-fixture-only'};
  const body={action:'verify',orderId:'order_fixture',paymentId:'pay_fixture'};
  body.signature=createHmac('sha256',env.RAZORPAY_KEY_SECRET).update(`${body.orderId}|${body.paymentId}`).digest('hex');
  const valid=response();await paymentHandler(env)({method:'POST',body},valid);assert.equal(valid.body.verified,true);
  const invalid=response();await paymentHandler(env)({method:'POST',body:{...body,paymentId:'pay_changed'}},invalid);assert.equal(invalid.code,400);
});
test('Missing provider credentials give a recoverable configuration response',async()=>{
  const ai=response();await aiHandler({})({method:'POST',body:{provider:'groq',prompt:'test'}},ai);assert.equal(ai.code,503);assert.equal(ai.body.code,'not_configured');
  const payment=response();await paymentHandler({VITE_RAZORPAY_KEY_ID:'rk_test_example'})({method:'POST',body:{action:'create',cycle:'monthly'}},payment);assert.equal(payment.code,503);
});
