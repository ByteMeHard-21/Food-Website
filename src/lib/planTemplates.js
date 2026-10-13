import { loadDataset } from './localData';

export function buildLocalPlan(form) {
  const budget = Number(form.budget);
  if (!Number.isFinite(budget) || budget < 50000 || !form.city.trim() || !form.area.trim()) throw new Error('Enter a budget of at least ₹50,000, a city and an area.');
  const cuisine = form.cuisine.trim() || 'Indian';
  const cafe = /caf/i.test(form.vibe), premium = /fine dining/i.test(form.vibe);
  const names = /italian/i.test(cuisine) ? ['Bruschetta','Caprese salad','Garlic bread','Margherita pizza','Pesto pasta','Mushroom risotto','Arrabbiata pasta','Espresso','Lemon soda','Tiramisu']
    : /chinese|asian/i.test(cuisine) ? ['Spring rolls','Chilli tofu','Corn soup','Vegetable noodles','Fried rice','Kung pao vegetables','Schezwan rice','Iced tea','Lime soda','Sesame dessert']
    : cafe ? ['Grilled sandwich','Avocado toast','Breakfast bowl','Pesto pasta','Paneer wrap','Mushroom toast','Seasonal salad','Cappuccino','Cold coffee','Chocolate brownie']
    : ['Samosa chaat','Paneer tikka','Seasonal pakora','Dal tadka meal','Paneer masala','Vegetable biryani','Chole rice bowl','Masala chai','Fresh lime soda','Gulab jamun'];
  const basePrices = [90,160,100,210,240,220,190,60,80,100].map(price=>Math.round(price*(premium?1.8:cafe?1.25:1)/10)*10);
  const avgOrderValue = premium ? 700 : cafe ? 300 : 250;
  const dailyOrders = Math.max(12, Math.min(160, Math.round(budget / 50000)));
  const monthlyRevenue = avgOrderValue * dailyOrders * 30;
  const monthlyOpex = Math.round(monthlyRevenue*.73);
  return {
    source: 'local-template', restaurantName: `${form.area.split(' ')[0]} ${cafe?'Coffee House':'Kitchen'}`,
    tagline:'Good food. A place in the neighbourhood.', theme:cuisine, brandPersonality:`Approachable ${form.vibe.toLowerCase()} with a focus on consistency and local repeat visits.`,
    colorPalette:['#18503f','#eaf0e4','#bb8a46'], colorNames:['Forest','Sage','Warm brass'],
    targetAudience:`Residents, office workers and visitors around ${form.area}, ${form.city}; validate demand through interviews and a small tasting event.`,
    conceptWhy:`A focused ${cuisine} menu keeps ingredients manageable and makes the ${form.vibe.toLowerCase()} concept easier to test. This is a planning template; confirm demand locally before taking a lease.`,
    microLocation:`${form.area}, ${form.city}`, microLocationReason:'Shortlist accessible premises near your intended customers. Check rent, ventilation, permitted use, delivery access and weekday/weekend footfall in person.',
    menu:names.map((name,i)=>({name,category:i<3?'Snacks':i<7?'Main Course':i<9?'Beverages':'Desserts',description:`A suggested ${cuisine.toLowerCase()} menu item. Validate recipe cost and customer fit before launch.`,price:basePrices[i]})),
    pricingLogic:'Illustrative menu prices. Cost each recipe, account for packaging and platform fees, then compare nearby alternatives before setting final prices.',
    avgOrderValue,dailyOrders,monthlyRevenue,monthlyOpex,setupCost:Math.round(budget*.7),breakEvenMonths:Math.ceil(budget/Math.max(1,monthlyRevenue-monthlyOpex)),
    launchStrategy:`For ${form.area}, start with a small invitation-only tasting, collect structured feedback, and run a seven-day soft launch. List the restaurant accurately on maps and delivery channels before promoting it.`,
    openingOffer:'Suggested test offer: a complimentary drink with a meal during opening week, subject to your own margin check.',
    instaPosts:[{concept:'Meet the neighbourhood',caption:`Something delicious is taking shape in ${form.area}. Follow our ${cuisine} kitchen from idea to opening.`},{concept:'Behind the menu',caption:`Small menu. Big care. A closer look at the ingredients behind our ${cuisine} favourites.`},{concept:'Soft launch invitation',caption:`Neighbours of ${form.area}: help us shape your next favourite spot. Tasting details coming soon.`}],
    aiSummary:`Local planning template for a ${cuisine} concept in ${form.area}. With an illustrative ${dailyOrders} daily orders at INR ${avgOrderValue}, monthly revenue would be INR ${monthlyRevenue.toLocaleString('en-IN')}. Preserve working capital, validate rent and costs, and test demand before expanding. These assumptions are not AI predictions or investment advice.`,
  };
}

export function localScenario(plan, scenario, question) {
  const revenue = Number(plan.monthlyRevenue), costs = Number(plan.monthlyOpex);
  const changes = { rent:[1,1.2,'Rent doubles'], comp:[.85,1,'A new competitor opens'], viral:[1.4,1.18,'Demand increases sharply'], supplier:[1,1.12,'Ingredient costs increase'], staff:[.8,1.05,'A key team member leaves'], slow:[.6,.9,'Orders decline 40%'], custom:[.85,1.1,'Conservative stress test'] };
  const [sales,expense,title] = changes[scenario] || changes.custom;
  const profit = Math.round(revenue*sales-costs*expense);
  return { headline:`${title}: estimated monthly ${profit>=0?'surplus':'shortfall'} INR ${Math.abs(profit).toLocaleString('en-IN')}`,severity:profit<0?'high':'medium',impact:`Local scenario assumptions: revenue × ${sales}, operating costs × ${expense}. ${scenario==='custom'?`For “${question}”, this uses a generic stress test rather than interpreting your question with AI. `:''}Recalculate with verified rent and cost figures before acting.`,immediate:['Review cash available and upcoming obligations.','Protect food quality while simplifying operations.','Speak with suppliers and team members before changing commitments.'],shortTerm:['Test a smaller menu and measure contribution per dish.','Track daily orders and repeat visits.','Review the scenario weekly against actual results.'],opportunity:'A small pilot lets you test changes before committing more investment.',survivalChance:Math.max(5,Math.min(95,Math.round(revenue*sales/Math.max(1,costs*expense)*50))) };
}

export async function localCompetitors(form) {
  const { restaurants } = await loadDataset();
  const area = form.area.toLowerCase().trim();
  const found = restaurants.filter(row=>String(row.locality||'').toLowerCase().includes(area)||String(row.area_name||'').toLowerCase().includes(area)).sort((a,b)=>Number(b.user_ratings_total||0)-Number(a.user_ratings_total||0)).slice(0,3);
  return { competitors:found.map(row=>({ name:row.name,type:row.primary_category||'Restaurant',estimatedRevenue:'Not available',priceRange:'Price data unavailable',threatLevel:'medium',strengths:[`${row.rating||'Unrated'} dataset rating`,`${row.user_ratings_total||0} recorded reviews`],weaknesses:['Not assessed in this dataset'],ourAdvantage:'Validate a focused menu and service experience with local customers.' })), marketGap:found.length?'Dataset competitors are shown below. A market gap requires customer interviews and an in-person competitive review.':'No matching competitors were found in the bundled dataset for this area. Try the locality name used in the analysis form.',winStrategy:'Compare menu breadth, availability and customer feedback. Revenue and operating weaknesses of competitors are not available in this dataset.' };
}

export function localRoast(plan) {
  return { overallVerdict:'An attractive concept is a starting point. Your assumptions still need customers.',score:60,scoreLabel:'Template review · validation needed',roasts:[{issue:'Revenue is an assumption',roast:`${plan.dailyOrders} daily orders will not appear just because they fit a spreadsheet.`,fix:'Run a small paid pilot and measure conversion and repeat purchases.'},{issue:'Working capital matters',roast:'A beautiful fit-out cannot cover next month’s rent.',fix:'Keep cash for low-demand months and unexpected repairs.'},{issue:'Menu discipline',roast:'More dishes can mean more waste before they mean more customers.',fix:'Start with a small menu, track waste, and expand only proven favourites.'},{issue:'Location research',roast:'A busy street is not automatically your target audience.',fix:'Observe multiple time slots and compare rent with realistic footfall.'}],biggestRisk:'Committing to fixed costs before validating demand.',hiddenGem:'A focused concept is easier to test and refine.',finalAdvice:'Treat this local checklist as a prompt for research. Replace each assumption with observed data before committing funds.' };
}
