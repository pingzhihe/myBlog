import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import IndexHeader from '@site/src/components/IndexHeader';
import layout from '@site/src/css/layout.module.css';
import styles from './bookmarks.module.css';

const groups = [
  {
    id: 'code-links',
    title: '代码学习',
    links: [
      {title: 'Learn C++', href: 'https://www.learncpp.com', domain: 'learncpp.com'},
      {title: 'Go', href: 'https://go.dev/doc/', domain: 'go.dev'},
      {title: 'Rust', href: 'https://www.rust-lang.org/learn', domain: 'rust-lang.org'},
    ],
  },
  {
    id: 'study-links',
    title: '学习资料',
    links: [
      {title: 'Developer Roadmaps', href: 'https://roadmap.sh/', domain: 'roadmap.sh'},
      {title: 'GitHub', href: 'https://github.com', domain: 'github.com'},
      {title: '掘金', href: 'https://juejin.cn', domain: 'juejin.cn'},
    ],
  },
  {
    id: 'social-links',
    title: '社交媒体',
    links: [
      {title: 'Twitter', href: 'https://twitter.com', domain: 'twitter.com'},
      {title: 'Facebook', href: 'https://facebook.com', domain: 'facebook.com'},
      {title: 'Instagram', href: 'https://instagram.com', domain: 'instagram.com'},
    ],
  },
  {
    id: 'news-links',
    title: '新闻资讯',
    links: [
      {title: 'Google News', href: 'https://news.google.com', domain: 'news.google.com'},
      {title: 'Bing News', href: 'https://cn.bing.com/news', domain: 'cn.bing.com'},
      {title: 'Financial Times', href: 'https://www.ft.com', domain: 'ft.com'},
    ],
  },
];

const linkCount = groups.reduce((count, group) => count + group.links.length, 0);

export default function Bookmarks() {
  return (
    <Layout title="Elsewhere" description="Charles 的常用网站书签。">
      <main className={clsx(layout.page, layout.indexPage)}>
        <IndexHeader label="03 / Bookmarks" title="Elsewhere." count={`${linkCount} links`} />
        <div className={styles.directory}>
          {groups.map(({id, title, links}, index) => (
            <section key={id} className={styles.group} aria-labelledby={id}>
              <h2 id={id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {title}
              </h2>
              <ul>
                {links.map(({title, href, domain}) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {title}<span>{domain} ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </Layout>
  );
}
