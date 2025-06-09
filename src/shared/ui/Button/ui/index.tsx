import clsx from 'clsx';
import styles from './Button.module.css';

import type { JSX } from 'react';

export function UIButton({
  fill = false,
  big = false,
  className,
  children,
  ...props
}: JSX.IntrinsicElements['button'] & {
  big?: boolean;
  fill?: boolean;
}) {
  return (
    <button
      className={clsx(
        styles.button,
        fill && styles.fill,
        big && styles.big,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
