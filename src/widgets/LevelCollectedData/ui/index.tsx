import styles from './LevelCollectedData.module.css';

import { UIButton } from '@/shared/ui/Button/ui';
import { LevelRuns } from '@/widgets/LevelRuns/ui';
import { useState } from 'react';

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
        <UIButton
          fill
          onClick={() => setDataType(LevelDataType.PASSRATE)}
          disabled
        >
          Passrate table (beta)
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
  } else {
    return <></>;
  }
}
