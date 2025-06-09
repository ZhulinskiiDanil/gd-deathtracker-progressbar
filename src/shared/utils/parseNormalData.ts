// Парсинг для обычного блока "1% x14"
export function parseNormalData(texts: string[]) {
  const regex = /(\d+)%\s*-\s*(\d+)%\s*x(\d+)/g;
  const data: { from: number; to: number; freq: number }[] = [];

  for (const text of texts) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      data.push({
        from: parseInt(match[1], 10),
        to: parseInt(match[2], 10),
        freq: parseInt(match[3], 10),
      });
    }
    // Сброс regex.lastIndex, чтобы он корректно работал с новой строкой
    regex.lastIndex = 0;
  }

  return data;
}
