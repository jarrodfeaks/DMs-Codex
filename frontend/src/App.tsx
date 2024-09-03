import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

    const callBackend = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/test');
            const data = await res.json();
            console.log(data.message);
        } catch (err) {
            console.error("Error calling backend:", err);
        }
    }

    const readDatabase = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/test/db');
            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.error("Error reading database:", err);
        }
    }

  return (
      <>
          <div>
              <a href="https://vitejs.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo"/>
              </a>
              <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo"/>
              </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
              </button>
              <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
              </p>
          </div>
          <p className="read-the-docs">
              Click on the Vite and React logos to learn more
          </p>
          <button onClick={callBackend}>Test Backend Call</button>
          <button onClick={readDatabase}>Read Database</button>
      </>
  )
}

export default App