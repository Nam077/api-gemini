import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApiKeyManager } from '../components/ApiKeyManager';
import { Dashboard } from '../pages/Dashboard';
import { Layout } from '../components/Layout';
import { VideoScriptGenerator } from '../pages/VideoScriptGenerator';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'generator',
        element: <VideoScriptGenerator />
      },
      {
        path: 'api-keys',
        element: <ApiKeyManager />
      }
    ]
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
}; 