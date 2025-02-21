import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/ThoughtDumper.css';
import ThoughtDumper from './components/ThoughtDumper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThoughtDumper />
  </React.StrictMode>
); 