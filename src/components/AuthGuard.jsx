import { useAuth } from '../hooks/useAuth'
import { PageLoader } from './LoadingSpinner'
import LoginForm from './LoginForm'

const AuthGuard = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <PageLoader />
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <LoginForm />
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="mobile-container flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold text-destructive mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default AuthGuard

