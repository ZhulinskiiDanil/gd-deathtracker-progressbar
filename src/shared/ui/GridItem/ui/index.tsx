import styles from './GridItem.module.css';

export const GridItem = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => {
  return (
    <div className={styles.item}>
      <span className={styles.title}>{title}</span>
      <span className={styles.value}>{children}</span>
    </div>
  );
};
