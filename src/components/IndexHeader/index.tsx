import React from 'react';
import layout from '@site/src/css/layout.module.css';
import styles from './styles.module.css';

type Props = {
  label: string;
  title: string;
  count: string;
};

export default function IndexHeader({label, title, count}: Props) {
  return (
    <header className={styles.header}>
      <p className={layout.eyebrow}>{label}</p>
      <h1>{title}</h1>
      <span className={styles.count}>{count}</span>
    </header>
  );
}
