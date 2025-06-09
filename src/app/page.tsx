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
  const regex = /(\d+)% x(\d+)/g;
  let match;
  const data: { percent: number; freq: number }[] = [];
  while ((match = regex.exec(text)) !== null) {
    data.push({
      percent: parseInt(match[1], 10),
      freq: parseInt(match[2], 10),
    });
  }
  return data;
}

// Парсинг для блока Runs "0% - 1% x1"
function parseFromZeroData(text: string) {
  const regex = /(\d+)% - (\d+)% x(\d+)/g;
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

function ProgressBar({
  text,
  fromZero = false,
}: {
  text: string;
  fromZero?: boolean;
}) {
  const data = useMemo(() => {
    if (!text.trim()) return [];
    if (fromZero) {
      return parseFromZeroData(text);
    } else {
      return parseNormalData(text);
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
        {data.map((entry, idx) => {
          let label,
            freq = 0;
          const from = 'from' in entry ? entry.from : null;
          const to = 'to' in entry ? entry.to : null;
          const percent = 'percent' in entry ? entry.percent : null;

          if (fromZero && from !== null && to !== null) {
            label = `${from}% - ${to}%`;
            freq = entry.freq;
          } else if (percent !== null) {
            label = `${percent}%`;
            freq = entry.freq;
          }

          return (
            <div
              key={idx}
              title={`${label} — ${freq} deaths`}
              style={{
                flex: 1,
                backgroundColor:
                  freq > 0 ? interpolateColor(freq, maxFreq) : 'transparent',
                transition: 'background-color 0.3s',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
