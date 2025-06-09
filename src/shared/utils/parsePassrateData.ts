// Парсинг для блока Runs "0% - 1% x1"
export function parsePassrateData(texts: string[], step: number = 1) {
  const data: { from: number; to: number; freq: number; passrate: number }[] =
    [];

  for (const text of texts) {
    const lines = text.split('\n');
    let inFromZeroSection = false;
    const freqMap = new Map<number, number>();

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
          const percent = parseInt(match[1], 10);
          const freq = parseInt(match[2], 10);
          freqMap.set(percent, freq);
        }
      }
    }

    // Построим шаги по заданному step
    const sortedPercents = Array.from(freqMap.keys()).sort((a, b) => a - b);
    const maxPercent = Math.max(...sortedPercents);

    for (let from = 0; from < maxPercent; from += step) {
      const to = from + step;

      const currentFreq = freqMap.get(to);
      const prevFreq = freqMap.get(from);

      if (currentFreq === undefined || prevFreq === undefined) continue;

      const passrate = Math.min(currentFreq / prevFreq, 1); // ограничим до 1

      data.push({
        from,
        to,
        freq: currentFreq,
        passrate,
      });
    }
  }

  return data;
}
