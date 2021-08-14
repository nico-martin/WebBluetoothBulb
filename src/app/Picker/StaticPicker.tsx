import React from 'react';
import cn from '@common/utils/classnames';
import { getRandomColor, rgbToHex } from '@common/utils/color';
import styles from './StaticPicker.css';

const StaticPicker = ({
  className = '',
  changeColor,
}: {
  className?: string;
  changeColor: (r: number, g: number, b: number) => Promise<void>;
}) => {
  return (
    <div className={cn(className, styles.root)}>
      <button
        className={styles.button}
        onClick={() => changeColor(255, 255, 255)}
        style={{ backgroundColor: rgbToHex(255, 255, 255) }}
      >
        on
      </button>
      <button
        className={styles.button}
        onClick={() => changeColor(255, 0, 0)}
        style={{ backgroundColor: rgbToHex(255, 0, 0) }}
      >
        red
      </button>
      <button
        className={styles.button}
        onClick={() => changeColor(0, 255, 0)}
        style={{ backgroundColor: rgbToHex(0, 255, 0) }}
      >
        green
      </button>
      <button
        className={styles.button}
        onClick={() => changeColor(0, 0, 255)}
        style={{ backgroundColor: rgbToHex(0, 0, 255) }}
      >
        blue
      </button>
      <button
        className={styles.button}
        onClick={() => changeColor(0, 0, 0)}
        style={{ backgroundColor: rgbToHex(0, 0, 0) }}
      >
        off
      </button>
      <button
        className={styles.button}
        onClick={() => {
          const c = getRandomColor();
          changeColor(c.r, c.g, c.b);
        }}
        style={{
          background:
            'linear-gradient(135deg, rgba(255,0,0,1) 10%, rgba(0,255,0,1) 50%, rgba(0,0,255,1) 90%)',
        }}
      >
        random
      </button>
    </div>
  );
};

export default StaticPicker;
