import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { Crown, Star, Zap, Rocket, Trophy, Lock, CheckCircle } from 'lucide-react'

const PlansPage = () => {
  const { t } = useTranslation()
  const { profile } = useAuth()

  const plans = [
    {
      id: 'starter',
      name: t('starter'),
      topUpRequired: 500,
      minWithdraw: 1000,
      icon: Star,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/20',
      borderColor: 'border-gray-400/30'
    },
    {
      id: 'pro',
      name: t('pro'),
      topUpRequired: 3000,
      minWithdraw: 5000,
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'elite',
      name: t('elite'),
      topUpRequired: 7000,
      minWithdraw: 12000,
      icon: Crown,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      borderColor: 'border-purple-400/30'
    },
    {
      id: 'titan',
      name: t('titan'),
      topUpRequired: 15000,
      minWithdraw: 25000,
      icon: Rocket,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/20',
      borderColor: 'border-orange-400/30'
    },
    {
      id: 'legend',
      name: t('legend'),
      topUpRequired: 30000,
      minWithdraw: 50000,
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      borderColor: 'border-yellow-400/30'
    }
  ]

  const getCurrentPlanIndex = () => {
    const currentPlan = profile?.plan_level?.toLowerCase() || 'starter'
    return plans.findIndex(plan => plan.id === currentPlan)
  }

  const isPlanUnlocked = (planIndex) => {
    return planIndex <= getCurrentPlanIndex()
  }

  const isCurrentPlan = (planId) => {
    return profile?.plan_level?.toLowerCase() === planId
  }

  return (
    <div className="mobile-padding pb-20">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold mb-2">{t('plansTitle')}</h1>
        <p className="text-muted-foreground">
          Upgrade your plan to unlock higher withdrawal limits
        </p>
      </div>

      {/* Current Plan Info */}
      {profile && (
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-lg font-bold text-primary">
                {profile.plan_level || 'Starter'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-lg font-bold text-secondary">
                {profile.balance?.toLocaleString() || 0} {t('pkr')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="space-y-4">
        {plans.map((plan, index) => {
          const Icon = plan.icon
          const unlocked = isPlanUnlocked(index)
          const current = isCurrentPlan(plan.id)
          
          return (
            <div
              key={plan.id}
              className={`plan-card ${current ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
            >
              {/* Plan Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${plan.bgColor} rounded-xl flex items-center justify-center mr-3`}>
                    <Icon className={plan.color} size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    {current && (
                      <span className="text-xs text-primary font-medium">Current Plan</span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {unlocked ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <Lock className="text-muted-foreground" size={24} />
                  )}
                </div>
              </div>

              {/* Plan Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('topUpRequired')}</p>
                  <p className="text-lg font-bold text-primary">
                    {plan.topUpRequired.toLocaleString()} {t('pkr')}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('minWithdraw')}</p>
                  <p className="text-lg font-bold text-secondary">
                    {plan.minWithdraw.toLocaleString()} {t('pkr')}
                  </p>
                </div>
              </div>

              {/* Plan Status */}
              <div className="text-center">
                {unlocked ? (
                  <span className="inline-flex items-center px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm font-medium">
                    <CheckCircle size={16} className="mr-2" />
                    {t('unlocked')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-sm font-medium">
                    <Lock size={16} className="mr-2" />
                    {t('locked')}
                  </span>
                )}
              </div>

              {/* Upgrade Requirements */}
              {!unlocked && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    Top up {plan.topUpRequired.toLocaleString()} {t('pkr')} to unlock this plan
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Plan Benefits Info */}
      <div className="glass-card p-4 mt-6">
        <h3 className="font-semibold mb-3">Plan Benefits</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Higher plans unlock higher withdrawal limits</p>
          <p>• Plans are automatically upgraded based on your top-up amount</p>
          <p>• Each plan has different minimum withdrawal requirements</p>
          <p>• All plans include access to the referral system</p>
          <p>• Premium plans may include additional earning opportunities</p>
        </div>
      </div>

      {/* Withdrawal Requirements */}
      <div className="glass-card p-4 mt-4">
        <h3 className="font-semibold mb-3 text-yellow-400">⚠️ Withdrawal Requirements</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Account must be 7+ days old</p>
          <p>• Bank information must be complete</p>
          <p>• Must meet minimum withdrawal amount for your plan</p>
          <p>• Sufficient balance required</p>
        </div>
      </div>
    </div>
  )
}

export default PlansPage

