import { createBrowserRouter, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import TournamentsPage from '../pages/TournamentsPage'
import TournamentDetailsPage from '../pages/TournamentDetailsPage'
import NotFoundPage from '../pages/NotFoundPage'
import { AppBackground } from '../components/AppBackground'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppBackground />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tournaments',
        element: (
          <ProtectedRoute>
            <TournamentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tournaments/:slug',
        element: (
          <ProtectedRoute>
            <TournamentDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tournament/:slug',
        element: <TournamentDetailsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
