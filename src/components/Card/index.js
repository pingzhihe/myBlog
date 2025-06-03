// 文件：src/components/Card/index.js
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css'; // 本示例通过 CSS 模块控制样式

export default function Card({ title, children, href, icon }) {
  // Determine if the title should be a link or a span
  const TitleWrapper = href ? 'a' : 'span';
  const titleProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer', className: styles.cardTitle }
    : { className: styles.cardTitle };

  return (
    <div className={clsx(styles.cardContainer)}>
      <div className={styles.cardHeader}>
        <TitleWrapper {...titleProps}>
          {icon && <span className={styles.cardTitleIcon}>{icon}</span>}
          <span className={styles.cardTitleText}>{title}</span>
        </TitleWrapper>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}
