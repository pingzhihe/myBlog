import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import layout from '@site/src/css/layout.module.css';
import styles from './styles.module.css';

export default function Footer() {
  return (
    <footer className={clsx(layout.page, styles.footer)}>
      <p>© {new Date().getFullYear()} Charles</p>
      <div>
        <Link to="/blog">Journal</Link>
        <Link to="/fonts">Fonts</Link>
        <a href="https://github.com/pingzhihe/myBlog">GitHub ↗</a>
      </div>
      <a href="#">Back to top ↑</a>
    </footer>
  );
}
