'use client';
import styles from './page.module.css';
import { useMemo, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = (event.target as FileReader)?.result;
        setText(result as string);
      };
      reader.readAsText(file);
    } else {
      alert('Пожалуйста, выберите .txt файл');
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.back}></div>
        <div className={styles.wrapper}>
          <p className={styles.title}>Runs</p>
          <ProgressBar text={text} />
          <p className={styles.title}>From zero</p>
          <ProgressBar text={text} fromZero />
          <div className={styles.content}>
            <label className={styles.label}>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
              <span className={styles.labelText}>📄 Загрузить .txt файл</span>
            </label>
            <textarea
              value={text}
              readOnly
              rows={10}
              className={styles.textarea}
            />
            <button className={styles.button} onClick={() => setText('')}>
              Reset progress bar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 *
 * @param percent Current percent
 * @param freq Amount of deaths
 * @param to Run to
 * @param max The maximum death of deaths on the current Freq
 */
function interpolateColor(freq: number, max: number) {
  const ratio = freq / max; // 0 — мало смертей, 1 — максимум смертей

  // Зеленый: rgb(50, 200, 50)
  // Красный: rgb(200, 50, 50)
  const red = Math.round(50 + 150 * ratio);
  const green = Math.round(200 - 150 * ratio);
  const blue = 50;

  return `rgb(${red},${green},${blue})`;
}

// Парсинг для обычного блока "1% x14"
function parseNormalData(text: string) {
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

// Парсинг для блока Runs "0% - 1% x1"
function parseFromZeroData(text: string) {
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

function ProgressBar({
  text,
  fromZero = false,
}: {
  text: string;
  fromZero?: boolean;
}) {
  const { data, maxReached } = useMemo(() => {
    if (!text.trim()) return { data: [], maxReached: 0 };

    if (fromZero) {
      const data = parseFromZeroData(text);

      return {
        data,
        maxReached: Math.max(...data.map((d) => ('to' in d ? d.to : 0))),
      };
    } else {
      const data = parseNormalData(text);
      const maxPercent =
        data.length > 0 ? Math.max(...data.map((d) => d.to)) : 0;

      return { data, maxReached: maxPercent };
    }
  }, [text, fromZero]);

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
      <p
        className={styles.title}
        style={{ fontSize: '2rem', padding: '1rem', paddingLeft: 0 }}
      >
        Max reached: {maxReached}
      </p>
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
                typeof (d as any).from === 'number' &&
                typeof (d as any).to === 'number' &&
                i >= (d as any).from &&
                i < (d as any).to
            );

            if (entry) {
              to = entry.to;
              freq = entry.freq;
              label = `Index + 1: ${i + 1} ${entry.from}% - ${entry.to}%`;
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
              label = `Index + 1: ${i + 1} ${entry.from}% - ${entry.to}%`;
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
                    ? interpolateColor(freq, maxFreq)
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
