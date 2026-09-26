import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogListPage';
import IndexHeader from '@site/src/components/IndexHeader';
import layout from '@site/src/css/layout.module.css';
import styles from './styles.module.css';

export default function BlogListPage({metadata, items, ...props}: Props) {
  return (
    <Layout title={metadata.blogTitle} description={metadata.blogDescription}>
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData metadata={metadata} items={items} {...props} />
      <main className={clsx(layout.page, layout.indexPage)}>
        <IndexHeader
          label="02 / Writing"
          title="Journal."
          count={`${String(metadata.totalCount).padStart(2, '0')} entries`}
        />
        <div className={styles.columns}>
          <aside className={styles.aside}>
            <p className={layout.eyebrow}>All writing</p>
            <Link to="/blog/archive">Archive ↗</Link>
            <Link to="/blog/tags">Tags ↗</Link>
          </aside>
          <div>
            <ol className={styles.list}>
              {items.map(({content: {metadata: post}}) => (
                <li key={post.permalink}>
                  <Link className={styles.entry} to={post.permalink}>
                    <time dateTime={post.date}>
                      {post.date.slice(0, 10).replaceAll('-', '.')}
                    </time>
                    <h2>{post.title}</h2>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ol>
            <BlogListPaginator metadata={metadata} />
          </div>
        </div>
      </main>
    </Layout>
  );
}
