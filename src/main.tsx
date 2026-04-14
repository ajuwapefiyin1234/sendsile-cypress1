import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer, Zoom } from 'react-toastify';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_APP_CLIENT_ID,
        'client-id': import.meta.env.VITE_APP_CLIENT_ID,
        currency: 'USD',
        components: 'buttons',
        dataNamespace: 'paypal_sdk',
      }}
    >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
        <App />
        <ToastContainer
          stacked={true}
          hideProgressBar={true}
          position="top-center"
          transition={Zoom}
          autoClose={2000}
          bodyClassName="toast-body-container"
          toastClassName="toast-classname"
          closeButton={false}
        />
      </GoogleOAuthProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);
