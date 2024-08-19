import CssBaseline from '@mui/material/CssBaseline'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Overview from './components/Overview.tsx'
import Errors from './components/Errors.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Overview />,
      },
      {
        path: '/errors',
        element: <Errors />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline></CssBaseline>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
