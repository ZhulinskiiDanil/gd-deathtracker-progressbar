'use client';
import styles from './page.module.css';

import { useMemo, useState } from 'react';
import { parseLevelStats } from '@/shared/utils/parseLevelStats';

import { useQuery } from '@tanstack/react-query';
import { getDemonList } from '@/shared/api/getDemonList';

import { ProgressBar } from '@/shared/ui/ProgressBar/ui';
import { findLevelByName } from '@/shared/utils/demonlist/findLevelByName';
import { getLevelThumbnailById } from '@/shared/utils/getLevelThumbnailById';

export default function Home() {
  const { data: demonlist } = useQuery({
    queryKey: ['demonlist'],
    queryFn: getDemonList,
    initialData: [],
  });
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    return parseLevelStats(text);
  }, [text]);
  const levelData = useMemo(() => {
    if (stats.levelName) {
      return findLevelByName(demonlist, stats.levelName);
    } else {
      return null;
    }
  }, [demonlist, stats]);
  const imageUrl =
    levelData?.level_id && getLevelThumbnailById(levelData.level_id);

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
      {imageUrl && (
        <img alt="Level" src={imageUrl} className={styles.thumbnail} />
      )}
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.back}></div>
          {!!stats.attempts && (
            <div className={styles.rate}>
              <span className={styles.grade}>A+</span>
              <span className={styles.beta}>(beta)</span>
            </div>
          )}
          <div className={styles.title}>{stats.levelName}</div>
          <div className={styles.subtitle}>
            {stats.attempts ? (
              <>
                Attempts: <b>{stats.attempts}</b>
              </>
            ) : (
              'Select a level'
            )}
            {!!stats.attempts && <span>/ {stats.playtime}</span>}
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
            {levelData && (
              <>
                <p
                  className={styles.paragraph}
                  style={{ marginTop: '1rem', fontSize: '2rem' }}
                >
                  Demonlist data
                </p>
                <textarea
                  value={JSON.stringify(levelData, undefined, 2)}
                  readOnly
                  rows={10}
                  className={styles.textarea}
                />
              </>
            )}
            <button className={styles.button} onClick={() => setText('')}>
              RESET PROGRESS BAR
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
