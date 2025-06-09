'use client';
import styles from './page.module.css';

import { useMemo, useState } from 'react';
import { parseLevelStats } from '@/shared/utils/parseLevelStats';

import { ProgressBar } from '@/shared/ProgressBar/ui';

export default function Home() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    return parseLevelStats(text);
  }, [text]);

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
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.back}></div>
          {!!stats.attempts && (
            <div className={styles.rate}>
              <span className={styles.grade}>A+</span>
              <span className={styles.beta}>(beta)</span>
            </div>
          )}
          <div className={styles.title}>
            {stats.attempts || 'Select a level'}
            {!!stats.attempts && <span>{stats.playtime}</span>}
          </div>
          <hr className={styles.hr} />
          <p className={styles.paragraph}>Runs</p>
          <ProgressBar text={text} />
          <p className={styles.paragraph}>From zero</p>
          <ProgressBar text={text} fromZero />
          <hr className={styles.hr} />
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
