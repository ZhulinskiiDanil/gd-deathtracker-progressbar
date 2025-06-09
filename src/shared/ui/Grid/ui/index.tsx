import styles from './Grid.module.css';

export const Grid = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.grid}>{children}</div>;
};
