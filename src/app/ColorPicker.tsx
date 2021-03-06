import React from 'react';
import { getRandomColor, RgbColorI, rgbToHex } from '@common/utils/color';
import styles from './ColorPicker.css';
import StaticPicker from './Picker/StaticPicker';
import PlayBulb from './PlayBulb/PlayBulb';

const ColorPicker = ({
  characteristic,
}: {
  characteristic: BluetoothRemoteGATTCharacteristic;
}) => {
  const [activeColor, setActiveColor] = React.useState<RgbColorI>(null);

  const readColor = async (): Promise<RgbColorI> => {
    const value = await characteristic.readValue();
    if (value.getUint8(0) === 255) {
      return {
        r: 255,
        g: 255,
        b: 255,
      };
    }
    return {
      r: value.getUint8(1),
      g: value.getUint8(2),
      b: value.getUint8(3),
    };
  };

  const writeColor = async (
    r: number,
    g: number,
    b: number
  ): Promise<RgbColorI> => {
    if (r === 255 && g === 255 && b === 255) {
      await characteristic.writeValue(new Uint8Array([255, 0, 0, 0]));
    } else {
      await characteristic.writeValue(new Uint8Array([0, r, g, b]));
    }
    return await readColor();
  };

  React.useEffect(() => {
    readColor().then((c) => setActiveColor(c));
  }, []);

  const changeColor = (r: number, g: number, b: number): Promise<void> =>
    writeColor(r, g, b).then((c) => setActiveColor(c));

  return (
    <div className={styles.root}>
      <div className={styles.picker}>
        <StaticPicker changeColor={changeColor} />
      </div>
      <div className={styles.bulb}>
        {activeColor && <PlayBulb color={activeColor} />}
      </div>
    </div>
  );
};

export default ColorPicker;
