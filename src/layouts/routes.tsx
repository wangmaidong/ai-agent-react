import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router';
import { Alert } from 'antd';
import { DynamicPage } from '../components/DynamicPage';
import { LayoutPages } from './LayoutPages';
import { LayoutPrivate } from './LayoutPrivate';
import { LayoutPublic } from './LayoutPublic';
import React from 'react';

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/pages/home" replace />,
  },
  {
    path: '/pages/:name/*',
    element: (
      <LayoutPages>
        <DynamicPage dirname="pages" />
      </LayoutPages>
    ),
  },
  {
    path: '/private/:name/*',
    element: (
      <LayoutPrivate>
        <DynamicPage dirname="private" />
      </LayoutPrivate>
    ),
  },
  {
    path: '/public/:name/*',
    element: (
      <LayoutPublic>
        <DynamicPage dirname="public" />
      </LayoutPublic>
    ),
  },
  {
    path: '*',
    element: (
      <div style={{ padding: '1em' }}>
        <Alert type="error" description={`找不到路由 ${window.location.pathname}`} />
      </div>
    ),
  },
];

const publicPath = __webpack_public_path__;
export const router = createBrowserRouter(routes, {
  basename: publicPath.endsWith('/') ? publicPath.slice(0, -1) : publicPath,
});

export const IndexApp = <RouterProvider router={router} />;
