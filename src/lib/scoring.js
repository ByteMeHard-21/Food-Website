const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const normalize = (value, max) => clamp(Math.round(Number(value || 0) / max * 100));

// Same weighted heuristic as the supplied analyze Edge Function, not a trained model.
export function calculateAnalysis(input, locality, cuisineStats) {
  if (!input.location || !input.cuisine || !Number.isFinite(Number(input.budget)) || Number(input.budget) < 500000) {
    throw new Error('Select a location and cuisine and enter a budget of at least ₹5 lakh.');
  }
  const low = ['Fast Food', 'Burger', 'Sandwich', 'Cafe', 'Juice', 'Breakfast / Brunch', 'Dessert', 'Bakery', 'Pizza'];
  const mid = ['Indian', 'Chinese', 'Lebanese', 'Mexican', 'Mediterranean', 'Middle Eastern', 'Thai', 'Seafood'];
  const high = ['Japanese', 'Korean', 'Italian'];
  const budget = input.budget / 100000;
  const budgetFitScore = budget < 10 ? (low.includes(input.cuisine) ? 85 : 45)
    : budget < 35 ? ([...low, ...mid].includes(input.cuisine) ? 80 : 60)
      : ([...mid, ...high].includes(input.cuisine) ? 85 : 70);
  const metrics = {
    demandScore: normalize(locality.total_demand_score, 1000),
    opportunityScore: normalize(locality.opportunity_score, 100),
    competitionScore: 100 - normalize(cuisineStats.restaurant_count, 50),
    ratingScore: normalize(Number(locality.avg_rating || 0) * 20 + Math.log10(Math.max(1, Number(locality.total_reviews || 0))) * 20, 120),
    budgetFitScore, cuisineCount: cuisineStats.restaurant_count,
    cuisineAvgRating: Number(Number(cuisineStats.avg_rating || 0).toFixed(2)),
    cuisineTotalReviews: cuisineStats.total_reviews,
    nearMetro: Boolean(input.metroAccess), openingTimeline: input.timeline,
  };
  const timelinePenalty = input.timeline === 'Within 1 month' ? -6 : ['1-3 months', '3-months'].includes(input.timeline) ? -2 : 0;
  const successRate = clamp(Math.round(.3 * metrics.demandScore + .25 * metrics.competitionScore + .2 * metrics.opportunityScore + .15 * metrics.ratingScore + .1 * budgetFitScore + (input.metroAccess ? 5 : 0) + timelinePenalty), 5, 95);
  return {
    locality: input.location, cuisine: input.cuisine, successRate,
    riskLevel: successRate >= 75 ? 'Low' : successRate >= 50 ? 'Medium' : 'High', metrics,
    keyFactors: [
      { title: 'Demand strength', desc: `Demand index ${metrics.demandScore}/100 from the bundled dataset.` },
      { title: 'Cuisine competition', desc: `${metrics.cuisineCount} matching outlets in this locality.` },
      { title: 'Locality opportunity', desc: `Opportunity index ${metrics.opportunityScore}/100.` },
      { title: 'Customer engagement', desc: `${Number(locality.total_reviews).toLocaleString('en-IN')} reviews, average rating ${Number(locality.avg_rating).toFixed(1)}.` },
      { title: 'Budget fit', desc: `Budget fit score ${budgetFitScore}/100.` },
    ], sources: ['Bundled area_summary.csv', 'Bundled restaurants.csv', 'Weighted planning heuristic'],
  };
}

export function revenueProjection(input, result) {
  const base = Number(input?.budget || 2500000) * .16 * (.7 + Number(result?.successRate || 50) / 100);
  return Array.from({ length: 12 }, (_, index) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][index],
    revenue: Math.round(base * (.7 + index * .045)),
  }));
}
