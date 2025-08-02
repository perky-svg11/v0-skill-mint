import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

const LoginForm = () => {
  const { t } = useTranslation()
  const { signIn, signUp, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
      
      await signUp(formData.email, formData.password, formData.username)
    } else {
      await signIn(formData.email, formData.password)
    }
  }

  return (
    <div className="mobile-container flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {t('appName')}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? t('signup') : t('login')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder={t('username')}
                  value={formData.username}
                  onChange={handleInputChange}
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="email"
                name="email"
                placeholder={t('email')}
                value={formData.email}
                onChange={handleInputChange}
                className="glass-input w-full pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t('password')}
                value={formData.password}
                onChange={handleInputChange}
                className="glass-input w-full pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isSignUp && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder={t('confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size={20} />
              ) : (
                isSignUp ? t('signup') : t('login')
              )}
            </button>
          </form>

          {!isSignUp && (
            <div className="text-center mt-4">
              <button className="text-primary hover:underline text-sm">
                {t('forgotPassword')}
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
            </p>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium mt-1"
            >
              {isSignUp ? t('login') : t('signup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm

