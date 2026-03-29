import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from 'react-router';
import {DynamicPage} from '../components/DynamicPage';

const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/pages/home" replace/>,
  },
  {
    path: '/pages/:name/*',
    element: <LayoutPages> <DynamicPage dirname="pages"/></LayoutPages>,
  },
  {
    path: '/public/:name/*',
    element: <LayoutPublic> <DynamicPage dirname="public"/></LayoutPublic>,
  },
  {
    path: '/private/:name/*',
    element: <LayoutPrivate> <DynamicPage dirname="private"/></LayoutPrivate>,
  },
  {
    path: '*',
    element: <>未匹配到任何页面</>,
  },
];

const webpackPublicPath = __webpack_public_path__;

console.log({ webpackPublicPath });

const publicPath = __webpack_public_path__;
export const router = createBrowserRouter(routes, {
  basename: publicPath.endsWith('/') ? publicPath.slice(0, -1) : publicPath,
});

export const IndexApp = <RouterProvider router={router}/>;
