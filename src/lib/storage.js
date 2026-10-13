export function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(`originbite:${key}`)) ?? fallback; } catch { return fallback; }
}
export function writeLocal(key, value) {
  localStorage.setItem(`originbite:${key}`, JSON.stringify(value));
  window.dispatchEvent(new Event('originbite:update'));
}
export function getReports() {
  const value = readLocal('reports', []);
  return Array.isArray(value) ? value.filter(row => row?.id && row.analysisInput && row.analysisResult) : [];
}
export function saveReport(analysisInput, analysisResult) {
  const report = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), analysisInput, analysisResult };
  writeLocal('reports', [report, ...getReports()].slice(0, 100));
  return report;
}
export function getDemoUser() { return readLocal('profile', { name: 'Explorer', email: '' }); }
export function getPlan() { return readLocal('subscription', { tier: 'Free' }); }
