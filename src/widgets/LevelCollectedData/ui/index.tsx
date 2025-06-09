import styles from './LevelCollectedData.module.css';

import { useState } from 'react';

// UI
import { UIButton } from '@/shared/ui/Button/ui';

// Data types components
import { LevelRuns } from '@/widgets/LevelRuns/ui';
import { LevelPassrate } from '@/widgets/LevelPassrate/ui';

enum LevelDataType {
  RUNS = 'RUNS',
  PASSRATE = 'PASSRATE',
  GRAPHICS = 'GRAPHICS',
}

export function LevelCollectedData({ texts }: { texts: string[] }) {
  const [dataType, setDataType] = useState(LevelDataType.RUNS);

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <UIButton fill onClick={() => setDataType(LevelDataType.RUNS)}>
          Runs bars
        </UIButton>
        <UIButton fill onClick={() => setDataType(LevelDataType.PASSRATE)}>
          Passrate table
        </UIButton>
        <UIButton
          fill
          onClick={() => setDataType(LevelDataType.GRAPHICS)}
          disabled
        >
          Graphics (beta)
        </UIButton>
      </div>
      <DataByType texts={texts} dataType={dataType} />
    </div>
  );
}

function DataByType({
  dataType,
  texts,
}: {
  dataType: LevelDataType;
  texts: string[];
}) {
  if (dataType === LevelDataType.RUNS) {
    return <LevelRuns texts={texts} />;
  } else if (dataType === LevelDataType.PASSRATE) {
    return <LevelPassrate texts={texts} />;
  } else {
    return <></>;
  }
}
