import styles from './styles.module.css';

import { useMemo } from 'react';

import { interpolateColor } from '../../../utils/interpolateColor';
import { parseFromZeroData } from '../../../utils/parseFromZeroData';
import { parseNormalData } from '../../../utils/parseNormalData';

export function ProgressBar({
  texts,
  fromZero = false,
}: {
  texts: string[];
  fromZero?: boolean;
}) {
  const { data, maxReached } = useMemo(() => {
    const filteredTexts = texts.filter((text) => text.trim());
    if (!filteredTexts.length) return { data: [], maxReached: 0 };

    if (fromZero) {
      const data = parseFromZeroData(filteredTexts);

      return {
        data,
        maxReached: Math.max(...data.map((d) => ('to' in d ? d.to : 0))),
      };
    } else {
      const data = parseNormalData(filteredTexts);
      const maxPercent =
        data.length > 0 ? Math.max(...data.map((d) => d.to)) : 0;

      return { data, maxReached: maxPercent };
    }
  }, [texts, fromZero]);

  if (data.length === 0) {
    // Показываем 50% заполненный прогресс серым цветом, если нет данных
    return (
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} style={{ display: 'flex' }}>
          <div
            style={{
              flex: 1,
              backgroundColor: 'rgba(150, 150, 150, 0.5)',
              transition: 'background-color 0.3s',
            }}
            title="No data"
          />
          <div style={{ flex: 1, backgroundColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  const maxFreq = Math.max(...data.map((d) => d.freq));

  return (
    <div className={styles.progressBarWrapper}>
      {/* Метки сверху */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.3rem',
          fontSize: '0.75rem',
          color: '#aaa',
          userSelect: 'none',
        }}
      >
        {[...Array(11)].map((_, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              textAlign: i === 0 ? 'left' : i === 10 ? 'right' : 'center',
            }}
          >
            {i * 10}%
          </span>
        ))}
      </div>

      {/* Прогресс-бар */}
      <div className={styles.progressBar} style={{ display: 'flex' }}>
        {[...Array(100)].map((_, i) => {
          let freq = 0;
          let label = `${i}%`;
          let to = 0;
          const percent = i + 1;
          if (fromZero) {
            const entry = data.find(
              (d): d is { from: number; to: number; freq: number } =>
                'from' in d &&
                typeof d.from === 'number' &&
                'to' in d &&
                typeof d.to === 'number' &&
                i >= d.from &&
                i < d.to
            );

            if (entry) {
              to = entry.to;
              freq = entry.freq;
              label = `${entry.from}% - ${entry.to}%`;
            }
          } else {
            const entry = data.find(
              (d): d is { from: number; to: number; freq: number } =>
                typeof d.from === 'number' &&
                typeof d.to === 'number' &&
                i >= d.from &&
                i < d.to
            );

            if (entry) {
              to = entry.to;
              label = `${entry.from}% - ${entry.to}%`;
              freq = entry.freq;
            }
          }

          const show = i <= maxReached;
          const isEmptyCell = percent !== to && fromZero;

          return (
            <div
              key={i}
              title={freq > 0 ? `${label} — ${freq} deaths` : undefined}
              style={{
                flex: 1,
                backgroundColor: show
                  ? freq > 0 && !isEmptyCell
                    ? interpolateColor(percent, freq, maxFreq, fromZero)
                    : 'rgba(80, 80, 80, 0.15)' // серый, если дошёл, но не умер
                  : 'transparent', // не дошёл — прозрачный
                transition: 'background-color 0.3s',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
