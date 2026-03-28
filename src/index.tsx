import React from 'react';
import ReactDOM from 'react-dom/client';
import env from './AppService/env';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <div>hello world</div>
  </React.StrictMode>
);

console.log(env);
