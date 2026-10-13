import { revenueProjection } from './scoring';

export function downloadFile(name, content, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportCSV(report) {
  const rows = [['Location', 'Cuisine', 'Budget INR', 'Planning score', 'Risk', 'Created', 'Mode'],
    [report.analysisInput.location, report.analysisInput.cuisine, report.analysisInput.budget, report.analysisResult.successRate, report.analysisResult.riskLevel, report.timestamp, report.analysisResult.mode || 'dataset']];
  const cell = value => `"${String(value ?? '').replace(/^[=+@-]/, "'$&").replaceAll('"', '""')}"`;
  downloadFile('originbite-analysis.csv', '\ufeff' + rows.map(row => row.map(cell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
}
export async function exportPDF(report) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setTextColor(24, 77, 61); doc.setFontSize(23); doc.text('OriginBite | Restaurant analysis', 18, 24);
  doc.setFontSize(11); doc.setTextColor(40);
  let y = 40;
  const lines = [
    `Location: ${report.analysisInput.location}`, `Cuisine: ${report.analysisInput.cuisine}`,
    `Investment: INR ${Number(report.analysisInput.budget).toLocaleString('en-IN')}`,
    `Planning score: ${report.analysisResult.successRate}/100 | Risk: ${report.analysisResult.riskLevel}`,
    `Generated: ${new Date(report.timestamp).toLocaleString('en-IN')}`,
    'Dataset-based planning estimate; not a guaranteed probability or return.',
    ...report.analysisResult.keyFactors.map(item => `${item.title}: ${item.desc}`),
    'Illustrative 12-month revenue scenario (INR):',
    ...revenueProjection(report.analysisInput, report.analysisResult).map(row => `${row.month}: ${row.revenue.toLocaleString('en-IN')}`),
  ];
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, 173);
    if (y + wrapped.length * 6 > 280) { doc.addPage(); y = 20; }
    doc.text(wrapped, 18, y); y += wrapped.length * 6 + 3;
  }
  doc.save('originbite-analysis.pdf');
}
