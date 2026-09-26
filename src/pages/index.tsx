import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import SignalVideo from '@site/src/components/SignalVideo';
import layout from '@site/src/css/layout.module.css';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const notes = [
  ['Rust', '/docs/rust-learning'],
  ['C++', '/docs/C++'],
  ['Machine learning', '/docs/stat-machine-learning'],
  ['Quantum computing', '/docs/quantum-computing'],
];

const writing = [
  {title: '2025年的年中总结', date: '2025-06-05', to: '/blog/2025-6-5'},
  {title: '人生是旷野', date: '2024-12-05', to: '/blog/2024-12-5'},
  {title: 'Hello World', date: '2024-11-24', to: '/blog/hello-world'},
];

export default function Home(): JSX.Element {
  return (
    <Layout title="Notes & thoughts" description="Charles 的个人主页：计算机、物理、学习笔记与随笔。">
      <main className={clsx(layout.page, styles.home)}>
        <section className={styles.hero} aria-labelledby="name">
          <div className={styles.heroCopy}>
            <p className={layout.eyebrow}>Personal index</p>
            <h1 id="name" className={styles.name}>Charles.</h1>
            <p className={styles.intro} lang="en">Computer science, physics,<br /> robotics and more.</p>
          </div>
          <SignalVideo />
        </section>

        <section className={styles.section} id="notes" aria-labelledby="notes-title">
          <div className={styles.sectionSide}>
            <h2 id="notes-title" className={layout.eyebrow}>01 / Learning notes</h2>
            <Link className={styles.textLink} to="/docs/intro">All notes ↗</Link>
          </div>
          <ul className={styles.list}>
            {notes.map(([title, to]) => <li key={to}>
              <Link className={styles.noteLink} to={to}>
                <span>{title}</span><span className={styles.arrow} aria-hidden="true">↗</span>
              </Link>
            </li>)}
          </ul>
        </section>

        <section className={styles.section} id="journal" aria-labelledby="journal-title">
          <div className={styles.sectionSide}>
            <h2 id="journal-title" className={layout.eyebrow}>02 / Journal</h2>
            <Link className={styles.textLink} to="/blog">All writing ↗</Link>
          </div>
          <ol className={styles.list}>
            {writing.map(({title, date, to}) => <li key={to}>
              <Link className={styles.entry} to={to}>
                <h3>{title}</h3><time dateTime={date}>{date.replaceAll('-', '.')}</time>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </Link>
            </li>)}
          </ol>
        </section>

        <section className={styles.section} id="elsewhere" aria-labelledby="elsewhere-title">
          <div className={styles.sectionSide}><h2 id="elsewhere-title" className={layout.eyebrow}>03 / Elsewhere</h2></div>
          <div className={styles.elsewhere}>
            <a href="https://github.com/pingzhihe/myBlog">GitHub ↗</a>
            <Link to="/bookmarks">Useful websites ↗</Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
