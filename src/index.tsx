import React from 'react';
import ReactDOM from 'react-dom/client';
import env from './AppService/env';
import {IndexApp, router} from './layouts/routes';
import {ConfigProvider} from "antd";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<>
  <ConfigProvider theme={{}}>
    {IndexApp}
  </ConfigProvider>
</>);

console.log(env, router);


