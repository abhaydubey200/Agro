// src/App.js
import React from 'react';
import CropTable from './components/CropTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Indian Agriculture Analytics</h1>
      </header>
      <main>
        <CropTable />
      </main>
    </div>
  );
}

export default App;
