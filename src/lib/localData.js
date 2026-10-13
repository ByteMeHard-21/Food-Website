import Papa from 'papaparse';
import { supabase } from './supabase';
import { calculateAnalysis } from './scoring';

let dataset;
export function loadDataset() {
  if (!dataset) dataset = Promise.all(['area_summary.csv', 'restaurants.csv'].map(async file => {
    const response = await fetch(`/data/${file}`);
    if (!response.ok) throw new Error('Could not load the bundled restaurant dataset. Please retry.');
    return Papa.parse(await response.text(), { header: true, skipEmptyLines: true, dynamicTyping: true }).data;
  })).then(([localities, restaurants]) => ({ localities, restaurants })).catch(error => { dataset = null; throw error; });
  return dataset;
}

export async function getLocations() {
  if (supabase) {
    const { data, error } = await supabase.from('localities').select('locality').order('locality');
    if (error) throw error;
    return data.map(row => row.locality);
  }
  const { localities } = await loadDataset();
  return [...new Set(localities.map(row => row.locality).filter(Boolean))].sort();
}

export async function getCuisines() {
  if (supabase) {
    const { data, error } = await supabase.from('cuisine_locality_stats').select('category');
    if (error) throw error;
    return [...new Set(data.map(row => row.category).filter(Boolean))].sort();
  }
  const { restaurants } = await loadDataset();
  return [...new Set(restaurants.map(row => row.primary_category).filter(Boolean))].sort();
}

export async function analyzeLocally(input) {
  const { localities, restaurants } = await loadDataset();
  const locality = localities.find(row => row.locality === input.location);
  if (!locality) throw new Error('Choose a locality from the dataset.');
  const nearby = restaurants.filter(row => row.locality === input.location);
  const matching = nearby.filter(row => row.primary_category === input.cuisine);
  const ratings = matching.filter(row => Number(row.rating) > 0);
  const coords = nearby.filter(row => Number.isFinite(row.lat) && Number.isFinite(row.lng));
  return {
    ...calculateAnalysis(input, locality, {
      restaurant_count: matching.length,
      avg_rating: ratings.reduce((sum, row) => sum + Number(row.rating), 0) / (ratings.length || 1),
      total_reviews: matching.reduce((sum, row) => sum + Number(row.user_ratings_total || 0), 0),
    }),
    coordinates: coords.length ? {
      lat: coords.reduce((sum, row) => sum + row.lat, 0) / coords.length,
      lng: coords.reduce((sum, row) => sum + row.lng, 0) / coords.length,
    } : { lat: 19.076, lng: 72.8777 },
    mode: 'local',
  };
}

export async function runAnalysis(input) {
  if (!supabase) return analyzeLocally(input);
  const { data, error } = await supabase.functions.invoke('analyze', { body: {
    locality: input.location, cuisine: input.cuisine, budgetLakhs: input.budget / 100000,
    nearMetro: input.metroAccess, openingTimeline: input.timeline,
  }});
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return { ...data, mode: 'supabase' };
}
