import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">TuneTON Simple Test</h1>
        <p className="mb-4">This is a simplified version to test if the build works.</p>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => setCount(count + 1)}
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}

export default App;