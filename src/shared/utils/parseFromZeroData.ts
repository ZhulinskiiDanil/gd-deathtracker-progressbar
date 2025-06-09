// Парсинг для блока Runs "0% - 1% x1"
export function parseFromZeroData(text: string) {
  const data: { from: number; to: number; freq: number }[] = [];

  const lines = text.split('\n');
  let inFromZeroSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === 'From 0:') {
      inFromZeroSection = true;
      continue;
    }

    if (/^\w+:/i.test(trimmed)) {
      // если встретили новую секцию вроде "Runs:", "Session:" — выходим
      if (inFromZeroSection) break;
    }

    if (inFromZeroSection) {
      const match = /^(\d+)%\s*x(\d+)/.exec(trimmed);

      if (match) {
        data.push({
          from: 0,
          to: parseInt(match[1], 10),
          freq: parseInt(match[2], 10),
        });
      }
    }
  }

  return data;
}
