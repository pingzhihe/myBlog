import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import React from 'react';

type FeatureItem = {
  title: string;
  image: string;

  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'About Me',
    image: require('@site/static/img/shinji-1.jpg').default,
    description: (
      <>
        I am a master student in University of Melbourne, major in Information Technology.
      </>
    ),
  },
  {
    title: 'Things I like',
    image: require('@site/static/img/mob-1.jpg').default,
    description: (
      <>
        I like computer science, physics.
      </>
    ),
  },
  {
    title: 'If you like it...',
    image: require('@site/static/img/cat-3.gif').default,
    description: (
      <>
        please give me a star ⭐ on <a target="_blank" href="https://github.com/pingzhihe/myBlog">GitHub </a> .
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{ 
        height: '250px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '15px'
      }}>
        <img src={image} alt="feature" width="120" />
      </div>
      <div className="text--center padding-horiz--md" style={{ 
        minHeight: '80px',
        position: 'relative',
        padding: '0 10px'
      }}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
