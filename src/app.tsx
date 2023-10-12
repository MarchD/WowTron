import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <div>
      WowTron
    </div>
  </StrictMode>,
);

