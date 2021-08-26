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
  const [colorName, setColorname] = React.useState<string>('');
  const [colorNamePending, setColornamePending] =
    React.useState<boolean>(false);
  const hex = React.useMemo<string>(
    () => rgbToHex(color.r, color.g, color.b),
    [color]
  );

  React.useEffect(() => {
    document.documentElement.style.setProperty('--c-light-bulb', hex);
  }, [hex]);

  React.useEffect(() => {
    setColornamePending(true);
    fetch(`https://api.color.pizza/v1/` + hex.replace('#', ''))
      .then((response) => response.json())
      .then((data) => {
        setColornamePending(false);
        setColorname(data.colors[0].name);
      });
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
      {!colorNamePending && (
        <p className={styles.colorName}>
          {colorName}
          <br />
          <span className={styles.colorNameLink}>
            source:{' '}
            <a href="https://github.com/meodai/color-names">
              meodai/color-names
            </a>
          </span>
        </p>
      )}
    </div>
  );
};

export default PlayBulb;
