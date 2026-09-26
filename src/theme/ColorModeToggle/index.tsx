import React from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type {Props} from '@theme/ColorModeToggle';
import styles from './styles.module.css';

export default function ColorModeToggle({className, buttonClassName, value, onChange}: Props) {
  const isBrowser = useIsBrowser();
  const dark = value === 'dark';
  return (
    <div className={className}>
      <button
        className={clsx(styles.button, buttonClassName)}
        type="button"
        disabled={!isBrowser}
        aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
        aria-pressed={dark}
        onClick={() => onChange(dark ? 'light' : 'dark')}>
        {dark ? 'Light' : 'Dark'}
      </button>
    </div>
  );
}
