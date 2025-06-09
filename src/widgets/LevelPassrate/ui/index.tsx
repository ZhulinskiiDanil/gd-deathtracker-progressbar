import styles from './LevelPassrate.module.css';

import { parsePassrateData } from '@/shared/utils/parsePassrateData';
import { useMemo, useState } from 'react';

import { UIButton } from '@/shared/ui/Button/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
} from 'recharts';

export function LevelPassrate({ texts }: { texts: string[] }) {
  const [step, setStep] = useState(1);

  const passrateData = useMemo(() => {
    return parsePassrateData(texts, step);
  }, [texts, step]);

  const chartData = passrateData.map(({ from, to, passrate }) => ({
    from,
    to,
    range: `${from}%–${to}%`,
    passrate: +(passrate * 100).toFixed(2), // процент
  }));

  function inc() {
    setStep(step + 1);
  }

  function dec() {
    setStep(Math.max(step - 1, 1));
  }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <div className={styles.cell}>
          <span>Step</span>
          <div className={styles.counter}>
            <UIButton onClick={dec}>-</UIButton>
            <p>{step}</p>
            <UIButton onClick={inc}>+</UIButton>
          </div>
        </div>
      </div>
      {!!chartData.length ? <Chart chartData={chartData} /> : <EmptyChart />}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className={styles.empty}>
      <p className={styles.empty__title}>No runs from zero</p>
    </div>
  );
}

function Chart({ chartData }: { chartData: unknown[] }) {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
      style={{ marginTop: '2rem' }}
    >
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="passrateGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8884d8" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis domain={[0, 120]} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(value) => `${value}%`} />

        {/* Градиентная заливка под линией */}
        <Area type="step" dataKey="passrate" stroke="none" fill="#ff0000" />

        {/* Основная линия */}
        <Line
          type="step"
          dataKey="passrate"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
