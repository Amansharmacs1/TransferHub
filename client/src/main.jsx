import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import { WebRTCProvider } from './contexts/WebRTCContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <SocketProvider>
            <WebRTCProvider>
              <App />
            </WebRTCProvider>
          </SocketProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
