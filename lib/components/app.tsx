import { createSignal } from 'solid-js';
import styles from './app.module.css';



export function App() {
  const [c,setC]=createSignal(0);
  return <p>
    Edit <code>src/App.tsx</code> and save to test HMR
    <span class={c()%2==0?styles.even:styles.odd}>{c()}</span>
    <button onClick={()=>setC(c=>c+1)}>plus</button>
  </p>
}