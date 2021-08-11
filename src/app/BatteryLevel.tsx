import React from 'react';

const BatteryLevel = ({
  characteristic,
}: {
  characteristic: BluetoothRemoteGATTCharacteristic;
}) => {
  const [batteryLevel, setBatteryLevel] = React.useState<number>(null);

  const handleNotifications = (e) =>
    setBatteryLevel(e.target.value.getUint8(0));

  React.useEffect(() => {
    characteristic.readValue().then((e) => setBatteryLevel(e.getUint8(0)));
    characteristic.addEventListener(
      'characteristicvaluechanged',
      handleNotifications
    );

    return () =>
      characteristic.removeEventListener(
        'characteristicvaluechanged',
        handleNotifications
      );
  }, []);

  return <span>{batteryLevel}%</span>;
};

export default BatteryLevel;
