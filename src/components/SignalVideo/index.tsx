import React, {useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function SignalVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');
  const src = useBaseUrl('/img/.._4.mp4');
  const poster = useBaseUrl('/img/signal-poster.jpg');

  async function togglePlayback() {
    const media = video.current;
    if (!media) return;
    if (!media.paused) {
      media.pause();
      return;
    }
    try {
      setError('');
      await media.play();
    } catch {
      setError('无法播放，请重试或直接打开视频。');
    }
  }

  return (
    <figure className={styles.signal}>
      <video
        ref={video}
        className={styles.video}
        src={src}
        poster={poster}
        width="720"
        height="720"
        controls={started}
        playsInline
        preload="none"
        aria-label="Fig. 01，带音频的视频"
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError('视频加载失败，可直接打开视频。')}>
        <a href={src}>打开视频</a>
      </video>
      <figcaption className={styles.caption}>
        <span>Fig. 01</span>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? '暂停视频和音频' : '播放视频和音频'}
          aria-pressed={playing}>
          {playing ? 'Pause' : 'Play'}
        </button>
      </figcaption>
      <noscript>
        <a href={src}>打开视频 ↗</a>
      </noscript>
      {error && (
        <p className={styles.mediaError} role="status">
          {error} <a href={src}>打开视频 ↗</a>
        </p>
      )}
    </figure>
  );
}

