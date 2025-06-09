import styles from './LevelRuns.module.css';

import { ProgressBar } from '@/shared/ui/ProgressBar/ui';

export function LevelRuns({ texts }: { texts: string[] }) {
  return (
    <div>
      <p className={styles.paragraph}>Runs</p>
      <ProgressBar texts={texts} />
      <p className={styles.paragraph}>From zero</p>
      <ProgressBar texts={texts} fromZero />
    </div>
  );
}
