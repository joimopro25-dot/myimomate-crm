// features/market/utils/csv.js
export async function parseCsv(file) {
  const textRaw = await file.text();
  const text = textRaw.replace(/\uFEFF/g, ''); // remove BOM se existir

  // detetar delimitador: ;  |  tab  |  ,
  const delim = text.includes(';') ? ';' : (text.includes('\t') ? '\t' : ',');

  // separar linhas (CRLF ou LF) e ignorar vazias
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) return [];

  const headers = lines[0].split(delim).map(s => s.trim());

  return lines.slice(1).map(line => {
    const cols = line.split(delim);
    const obj = {};
    headers.forEach((k, i) => {
      obj[k] = (cols[i] ?? '').trim();
    });
    return obj;
  });
}
