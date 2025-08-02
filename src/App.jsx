import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth.jsx'
import AuthGuard from './components/AuthGuard'
import BottomNavigation from './components/BottomNavigation'
import LanguageToggle from './components/LanguageToggle'
import ReferralFAB from './components/ReferralFAB'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import PlansPage from './pages/PlansPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import TopUpPage from './pages/TopUpPage'
import WithdrawPage from './pages/WithdrawPage'
import BankInfoPage from './pages/BankInfoPage'
import ReferralPage from './pages/ReferralPage'
import './lib/i18n'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="mobile-container">
          <LanguageToggle />
          
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard>
                  <DashboardPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/plans" 
              element={
                <AuthGuard>
                  <PlansPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/topup" 
              element={
                <AuthGuard>
                  <TopUpPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/withdraw" 
              element={
                <AuthGuard>
                  <WithdrawPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/bank-info" 
              element={
                <AuthGuard>
                  <BankInfoPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/referrals" 
              element={
                <AuthGuard>
                  <ReferralPage />
                </AuthGuard>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/*" 
              element={
                <AuthGuard requireAdmin>
                  <AdminPage />
                </AuthGuard>
              } 
            />
          </Routes>
          
          <BottomNavigation />
          <ReferralFAB />
          
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
              },
              success: {
                className: 'toast-success',
              },
              error: {
                className: 'toast-error',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}
export default App
