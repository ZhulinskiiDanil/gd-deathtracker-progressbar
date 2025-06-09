'use client';
import styles from './page.module.css';

import { useMemo, useState } from 'react';
import { parseLevelStats } from '@/shared/utils/parseLevelStats';

import { useQuery } from '@tanstack/react-query';
import { getDemonList } from '@/shared/api/getDemonList';

import { ProgressBar } from '@/shared/ui/ProgressBar/ui';
import { findLevelByName } from '@/shared/utils/demonlist/findLevelByName';
import { getLevelThumbnailById } from '@/shared/utils/getLevelThumbnailById';
import Grid from '@/shared/ui/Grid/ui';
import GridItem from '@/shared/ui/GridItem/ui';

export default function Home() {
  const { data: demonlist } = useQuery({
    queryKey: ['demonlist'],
    queryFn: getDemonList,
    initialData: [],
  });
  const [texts, setTexts] = useState<string[]>([]);
  const stats = useMemo(() => {
    return parseLevelStats(texts);
  }, [texts]);
  const levelData = useMemo(() => {
    const levels = stats.data.map((level) => {
      if (level?.levelName) {
        return findLevelByName(demonlist, level.levelName);
      }
    });
    const level = levels.find((level) => level);

    return level || null;
  }, [demonlist, stats]);
  const imageUrl =
    levelData?.level_id && getLevelThumbnailById(levelData.level_id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const textFiles = Array.from(files).filter(
      (file) => file.type === 'text/plain'
    );

    const readers = textFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    });

    Promise.all(readers)
      .then((contents) => {
        setTexts((pre) => [...pre, ...contents]);
      })
      .catch((err) => {
        console.error('Error reading files:', err);
      });
  };

  return (
    <div className={styles.page}>
      {imageUrl && (
        <img alt="Level" src={imageUrl} className={styles.thumbnail} />
      )}
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.back}></div>
          {!!stats.totalAttempts && (
            <div className={styles.rate}>
              <span className={styles.grade}>A+</span>
              <span className={styles.beta}>(beta)</span>
            </div>
          )}
          <div className={styles.title}>
            {stats.data.map((level, index) => (
              <span key={index}>
                {level.levelName}
                {index + 1 < stats.data.length && (
                  <span style={{ color: '#555' }}>,</span>
                )}{' '}
              </span>
            ))}
          </div>
          <div className={styles.subtitle}>
            {stats.totalAttempts ? (
              <>
                Attempts: <b>{stats.totalAttempts}</b>
              </>
            ) : (
              'Select a level'
            )}
            {!!stats.totalAttempts && <span>/ {stats.totalPlaytime}</span>}
          </div>
          <hr className={styles.hr} style={{ marginBottom: '1rem' }} />
          <p className={styles.paragraph}>Runs</p>
          <ProgressBar texts={texts} />
          <p className={styles.paragraph}>From zero</p>
          <ProgressBar texts={texts} fromZero />
          <hr className={styles.hr} style={{ marginTop: '1rem' }} />
          <div className={styles.content}>
            <div className={styles.buttons}>
              <label className={styles.button}>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className={styles.hiddenInput}
                  multiple
                  draggable
                />
                <span className={styles.labelText}>
                  📄 Load backup files (.txt)
                </span>
              </label>
              {!!texts.length && (
                <button className={styles.button} onClick={() => setTexts([])}>
                  Clear levels
                </button>
              )}
            </div>
            {levelData && (
              <div className={styles.levelInfo}>
                <p
                  className={styles.paragraph}
                  style={{ marginTop: '1rem', fontSize: '2rem' }}
                >
                  Level Information
                </p>
                <hr className={styles.hr} style={{ margin: '1rem 0' }} />
                <Grid>
                  <GridItem title="Level ID">{levelData.level_id}</GridItem>
                  <GridItem title="Length (seconds)">
                    {levelData.length}
                  </GridItem>
                  <GridItem title="Verifier">{levelData.verifier}</GridItem>
                  <GridItem title="Created in">{levelData.created_in}</GridItem>
                  <GridItem title="Objects count">{levelData.objects}</GridItem>
                  <GridItem title="Holder">{levelData.holder}</GridItem>
                  <GridItem title="Password">{levelData.password}</GridItem>
                </Grid>
                <hr className={styles.hr} style={{ margin: '1rem 0' }} />
                <Grid>
                  <GridItem title="Place">{levelData.place}</GridItem>
                  <GridItem title="Score list">{levelData.score}</GridItem>
                  <GridItem title="Minimal percent">
                    {levelData.minimal_percent}
                  </GridItem>
                </Grid>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
