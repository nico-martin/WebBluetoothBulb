import React from 'react';
import { rgbToHex } from '@common/utils/color';

const ColorPicker = ({
  characteristic,
}: {
  characteristic: BluetoothRemoteGATTCharacteristic;
}) => {
  const [activeColor, setActiveColor] = React.useState<string>(null);

  React.useEffect(() => {
    characteristic
      .readValue()
      .then((e) =>
        setActiveColor(rgbToHex(e.getUint8(1), e.getUint8(2), e.getUint8(3)))
      );
  });

  const writeColor = (r: number, g: number, b: number) => {
    characteristic
      .writeValue(new Uint8Array([0x00, r, g, b]))
      .then(() =>
        characteristic
          .readValue()
          .then((e) =>
            setActiveColor(
              rgbToHex(e.getUint8(1), e.getUint8(2), e.getUint8(3))
            )
          )
      );
  };

  return (
    <div>
      {activeColor}
      <button onClick={() => writeColor(255, 0, 0)}>red</button>
      <button onClick={() => writeColor(0, 255, 0)}>green</button>
      <button onClick={() => writeColor(0, 0, 255)}>blue</button>
    </div>
  );
};

export default ColorPicker;
