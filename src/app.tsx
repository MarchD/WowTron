import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import TitleBar from './components/TitleBar';
import Login from './pages/Login';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <div className="flex flex-col min-h-screen bg-gradient-to-t from-[#FAEDFF]">
      <TitleBar />

      <Login/>
    </div>
  </StrictMode>,
);

