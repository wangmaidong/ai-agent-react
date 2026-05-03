import {createBrowserRouter, Navigate, type RouteObject, RouterProvider} from "react-router";
import {Alert} from "antd";
import {DynamicPage} from "../components/DynamicPage";
import {LayoutPages} from "./LayoutPages";
import {LayoutPrivate} from "./LayoutPrivate";
import {LayoutPublic} from "./LayoutPublic";
import React from "react";
import {PUBLIC_PATH} from "../AppService/env.ts";

export const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/pages/home" replace/>,
  },
  {
    path: '/pages/:name/*',
    element: <LayoutPages><DynamicPage dirname="pages"/></LayoutPages>,
  },
  {
    path: '/private/:name/*',
    element: <LayoutPrivate><DynamicPage dirname="private"/></LayoutPrivate>,
  },
  {
    path: '/public/:name/*',
    element: <LayoutPublic><DynamicPage dirname="public"/></LayoutPublic>,
  },
  {
    path: '*',
    element: (
      <div style={{ padding: '1em' }}>
        <Alert type="error" description={`找不到路由 ${window.location.pathname}`}/>
      </div>
    )
  }
];

export const router = createBrowserRouter(routes, { basename: PUBLIC_PATH.endsWith('/') ? PUBLIC_PATH.slice(0, -1) : PUBLIC_PATH });

export const IndexApp = <RouterProvider router={router}/>;
