
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Coincide con App.tsx (Capitalizado)

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  });
}
