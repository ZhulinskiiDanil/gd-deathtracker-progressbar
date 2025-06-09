import _ from 'lodash';

type ParsedData = {
  levelName: string | null;
  playtime: string;
  playtime_timestamp: number;
  attempts: number;
  from0: Record<string, number>;
  sessionDate: string;
  hasSavedAttempts: boolean;
  hasSavedRuns: boolean;
};

function formatPlaytime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export function parseLevelStats(texts: string[]) {
  const _data: ParsedData[] = texts.map((text) => {
    const levelNameMatch = text.match(/^(.+?):/m);
    const playtimeMatch = text.match(/playtime\s*-\s*([^\n]+)/i);
    const attemptsMatch = text.match(/(\d+)\s+attempts/i);
    const from0SectionMatch = text.match(/From 0:\n([\s\S]+?)\n\s*\n/);
    const sessionDateMatch = text.match(/Session:\n(\d{1,2}\/\d{1,2}\/\d{4})/);
    const hasSavedAttempts = !text.includes('No Saved Attempts');
    const hasSavedRuns = !text.includes('No Saved Runs');

    // Вычисляем playtime в секундах
    const playtimeStr = playtimeMatch ? playtimeMatch[1].trim() : '0h 0m 0s';
    const playtimeParts = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const hMatch = playtimeStr.match(/(\d+)h/);
    const mMatch = playtimeStr.match(/(\d+)m/);
    const sMatch = playtimeStr.match(/(\d+)s/);

    if (hMatch) playtimeParts.hours = parseInt(hMatch[1], 10);
    if (mMatch) playtimeParts.minutes = parseInt(mMatch[1], 10);
    if (sMatch) playtimeParts.seconds = parseInt(sMatch[1], 10);

    const playtimeTimestamp =
      playtimeParts.hours * 3600 +
      playtimeParts.minutes * 60 +
      playtimeParts.seconds;

    const from0: Record<string, number> = {};
    if (from0SectionMatch) {
      const lines = from0SectionMatch[1].trim().split('\n');
      for (const line of lines) {
        const match = line.trim().match(/^(\d+)%\s*x(\d+)/);
        if (match) {
          const percent = match[1];
          const count = parseInt(match[2], 10);
          from0[percent] = count;
        }
      }
    }

    return {
      levelName: levelNameMatch ? levelNameMatch[1].trim() : null,
      playtime: playtimeStr,
      playtime_timestamp: playtimeTimestamp,
      attempts: attemptsMatch ? parseInt(attemptsMatch[1], 10) : 0,
      from0,
      sessionDate: sessionDateMatch ? sessionDateMatch[1] : 'Unknown',
      hasSavedAttempts,
      hasSavedRuns,
    };
  });
  const data = _.uniqBy(_data, (level) => level.levelName);

  const totalPlaytimeSeconds = data.reduce(
    (acc, elm) => acc + elm.playtime_timestamp,
    0
  );

  return {
    data,
    totalAttempts: data.reduce((acc, elm) => acc + elm.attempts, 0),
    totalPlaytimeSeconds,
    totalPlaytime: formatPlaytime(totalPlaytimeSeconds),
    totalFrom0: data.reduce(
      (acc, elm) => {
        for (const percent in elm.from0) {
          acc[percent] = (acc[percent] || 0) + elm.from0[percent];
        }
        return acc;
      },
      {} as Record<string, number>
    ),
    sessionsCount: data.length,
    hasSavedAttemptsCount: data.filter((elm) => elm.hasSavedAttempts).length,
    hasSavedRunsCount: data.filter((elm) => elm.hasSavedRuns).length,
  };
}
