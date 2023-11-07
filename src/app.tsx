import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import TitleBar from './components/TitleBar';
import Input from './components/Input';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <div>
      <TitleBar />
    </div>
  </StrictMode>,
);

