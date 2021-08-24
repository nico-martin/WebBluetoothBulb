import React from 'react';
import cn from '@common/utils/classnames';
import { RgbColorI, rgbToHex } from '@common/utils/color';
import styles from './PlayBulb.css';

const PlayBulb = ({
  color,
  className = '',
}: {
  color: RgbColorI;
  className?: string;
}) => {
  const hex = React.useMemo<string>(
    () => rgbToHex(color.r, color.g, color.b),
    [color]
  );

  React.useEffect(() => {
    document.documentElement.style.setProperty('--c-light-bulb', hex);
  }, [hex]);

  return (
    <div className={cn(styles.root, className)}>
      <div className={cn(styles.bulbContainer)}>
        <div className={cn(styles.bulb)}>
          <div className={styles.bulbShine} />
          <div className={cn(styles.bulbShadow)} />
        </div>
        <div className={cn(styles.bulbStand)} />
      </div>
      <pre className={cn(styles.desc)}>{hex}</pre>
    </div>
  );
};

export default PlayBulb;
