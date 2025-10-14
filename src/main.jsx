import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { msalInstance } from './msalConfig.js';
import { MsalProvider } from '@azure/msal-react';

  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
    <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
  </StrictMode>,
  )
