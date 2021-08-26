import React from 'react';
import ReactDOM from 'react-dom';
import { Icon, Loader, Message } from '@theme';
import cn from '@common/utils/classnames';
import styles from './App.css';
import BatteryLevel from './app/BatteryLevel';
import BluetoothButton from './app/BluetoothButton';
import ColorPicker from './app/ColorPicker';
import Footer from './app/Footer';

const BROWSER_SUPPORT = 'bluetooth' in navigator;

const BLE_UUID = {
  SERVICE_LIGHT: 0xff0f,
  CHAR_LIGHT: 0xfffc,
  SERVICE_BATTERY: 0x180f,
  CHAR_BATTERY_LEVEL: 0x2a19,
};

const App = () => {
  const [bleDevice, setBleDevice] = React.useState<BluetoothDevice>(null);
  const [bleCharLight, setBleCharLight] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [bleCharBatteryLevel, setBleCharBatteryLevel] =
    React.useState<BluetoothRemoteGATTCharacteristic>(null);
  const [buttonLoading, setButtonLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [powerOffLoading, setPowerOffLoading] = React.useState<boolean>(false);

  const onDisconnected = (event) => {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
    setBleCharLight(null);
  };

  const connect = async (): Promise<void> => {
    setButtonLoading(true);
    try {
      const device: BluetoothDevice = await navigator.bluetooth.requestDevice({
        //acceptAllDevices: true,
        filters: [{ name: 'PLAYBULB sphere' }],
        optionalServices: [BLE_UUID.SERVICE_LIGHT, BLE_UUID.SERVICE_BATTERY],
      });
      setBleDevice(device);
      device.addEventListener('gattserverdisconnected', onDisconnected);
      const server = await device.gatt.connect();
      const serviceLight = await server.getPrimaryService(
        BLE_UUID.SERVICE_LIGHT
      );
      const serviceBattery = await server.getPrimaryService(
        BLE_UUID.SERVICE_BATTERY
      );

      const charLight = await serviceLight.getCharacteristic(
        BLE_UUID.CHAR_LIGHT
      );
      const charBatteryLevel = await serviceBattery.getCharacteristic(
        BLE_UUID.CHAR_BATTERY_LEVEL
      );
      setBleCharLight(charLight);
      setBleCharBatteryLevel(charBatteryLevel);
    } catch (error) {
      setError(error.toString());
    }
    setButtonLoading(false);
  };

  return (
    <div className={styles.root}>
      {bleCharLight === null ? (
        <div className={styles.connectionErrorContainer}>
          {error !== '' && (
            <Message type="error" className={styles.connectionError}>
              {error}
            </Message>
          )}
          {BROWSER_SUPPORT ? (
            <BluetoothButton
              loading={buttonLoading}
              connect={connect}
              className={styles.bluetoothButton}
            />
          ) : (
            <Message type="error" className={styles.connectionError}>
              Your browser does not support the WebBluetooth API:{' '}
              <a href="https://caniuse.com/web-bluetooth" target="_blank">
                https://caniuse.com/web-bluetooth
              </a>
            </Message>
          )}
        </div>
      ) : (
        <React.Fragment>
          {bleCharLight && <ColorPicker characteristic={bleCharLight} />}
          <div className={styles.device}>
            <button
              className={styles.powerOff}
              disabled={powerOffLoading}
              onClick={() => {
                if (bleDevice) {
                  bleDevice.gatt.disconnect();
                  setPowerOffLoading(false);
                }
              }}
            >
              {powerOffLoading ? (
                <Loader className={styles.powerOffLoader} />
              ) : (
                <Icon icon="mdi/power" />
              )}
            </button>
            <div className={styles.deviceInfo}>
              <p>
                <b>Device Info</b>
              </p>
              <p>Name: PLAYBULB sphere</p>
              <p>
                Battery:{' '}
                {bleCharBatteryLevel && (
                  <BatteryLevel characteristic={bleCharBatteryLevel} />
                )}
              </p>
            </div>
          </div>
        </React.Fragment>
      )}
      <Footer className={cn(styles.footer)} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
