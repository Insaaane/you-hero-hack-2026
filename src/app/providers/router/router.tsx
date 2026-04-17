import { createBrowserRouter, Navigate } from 'react-router'
import { InspectionDemoPage } from '@/pages/inspection-demo'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <InspectionDemoPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
