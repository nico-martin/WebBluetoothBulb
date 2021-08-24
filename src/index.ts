import './App';
import './styles.css';

const json = JSON.stringify({ left: 50, right: -50 });
const encoder = new TextEncoder();
const value = encoder.encode(json);
//characteristic.write(value);
console.log(value);
declare global {
  interface Window {}
}
