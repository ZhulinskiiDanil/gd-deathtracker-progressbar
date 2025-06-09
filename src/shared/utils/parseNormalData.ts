// Парсинг для обычного блока "1% x14"
export function parseNormalData(text: string) {
  const regex = /(\d+)%\s*-\s*(\d+)%\s*x(\d+)/g;
  let match;
  const data: { from: number; to: number; freq: number }[] = [];

  while ((match = regex.exec(text)) !== null) {
    data.push({
      from: parseInt(match[1], 10),
      to: parseInt(match[2], 10),
      freq: parseInt(match[3], 10),
    });
  }

  return data;
}
