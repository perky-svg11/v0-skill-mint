import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db } from '../lib/supabase'
import { 
  CreditCard, 
  Banknote, 
  Building2, 
  FileText, 
  Info, 
  Key,
  Wallet,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react'
import LoadingSpinner, { ShimmerCard } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [daysSinceSignup, setDaysSinceSignup] = useState(0)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return
      
      try {
        // Refresh profile data
        await refreshProfile()
        
        // Get days since signup
        const { data: days, error } = await db.getDaysSinceSignup(user.id)
        if (!error && days !== null) {
          setDaysSinceSignup(days)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, refreshProfile])

  const dashboardSections = [
    {
      id: 'topup',
      title: t('topUp'),
      icon: CreditCard,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      path: '/topup'
    },
    {
      id: 'withdraw',
      title: t('withdraw'),
      icon: Banknote,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      path: '/withdraw'
    },
    {
      id: 'bank-info',
      title: t('bankInfo'),
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      path: '/bank-info'
    },
    {
      id: 'rules',
      title: t('rulesInfo'),
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      path: '/rules'
    },
    {
      id: 'plan-info',
      title: t('planInfo'),
      icon: Info,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      path: '/plans'
    },
    {
      id: 'reset-password',
      title: t('resetPassword'),
      icon: Key,
      color: 'text-red-400',
      bgColor: 'bg-red-400/20',
      path: '/reset-password'
    }
  ]

  if (loading) {
    return (
      <div className="mobile-padding pb-20">
        <ShimmerCard className="mb-6 h-32" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ShimmerCard key={index} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mobile-padding pb-20 flex items-center justify-center min-h-screen">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold text-destructive mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load your profile. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-padding pb-20">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold mb-2">{t('dashboard')}</h1>
        <p className="text-muted-foreground">Welcome back, {profile.username}!</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 mb-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Wallet className="text-primary mr-2" size={20} />
              <span className="text-sm text-muted-foreground">{t('balance')}</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {profile.balance?.toLocaleString() || 0} {t('pkr')}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="text-secondary mr-2" size={20} />
              <span className="text-sm text-muted-foreground">{t('totalEarnings')}</span>
            </div>
            <p className="text-2xl font-bold text-secondary">
              {profile.total_earnings?.toLocaleString() || 0} {t('pkr')}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="text-green-400 mr-2" size={20} />
              <span className="text-sm text-muted-foreground">{t('planLevel')}</span>
            </div>
            <p className="text-lg font-bold text-green-400">
              {profile.plan_level || 'Starter'}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="text-blue-400 mr-2" size={20} />
              <span className="text-sm text-muted-foreground">{t('daysSinceSignup')}</span>
            </div>
            <p className="text-lg font-bold text-blue-400">
              {daysSinceSignup} days
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-2 gap-4">
        {dashboardSections.map((section) => {
          const Icon = section.icon
          
          return (
            <button
              key={section.id}
              onClick={() => navigate(section.path)}
              className="glass-card-hover p-4 text-center"
            >
              <div className={`w-12 h-12 ${section.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className={section.color} size={24} />
              </div>
              <h3 className="font-semibold text-sm">{section.title}</h3>
            </button>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 glass-card p-4">
        <h3 className="font-semibold mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Status:</span>
            <span className="text-green-400 font-medium">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Referral Code:</span>
            <span className="text-primary font-mono">{profile.referral_code}</span>
          </div>
          {profile.referred_by && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Referred By:</span>
              <span className="text-secondary font-medium">{profile.referred_by}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

