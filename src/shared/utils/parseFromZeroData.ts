// Парсинг для блока Runs "0% - 1% x1"
export function parseFromZeroData(texts: string[]) {
  const data: { from: number; to: number; freq: number }[] = [];

  for (const text of texts) {
    const lines = text.split('\n');
    let inFromZeroSection = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === 'From 0:') {
        inFromZeroSection = true;
        continue;
      }

      if (/^\w+:/i.test(trimmed)) {
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
  }

  return data;
}
