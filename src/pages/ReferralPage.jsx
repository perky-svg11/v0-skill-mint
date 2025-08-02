import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db } from '../lib/supabase'
import { 
  ArrowLeft, 
  Users, 
  Gift, 
  Trophy, 
  Share2, 
  Copy, 
  Calendar,
  DollarSign,
  Target,
  CheckCircle,
  Clock
} from 'lucide-react'
import LoadingSpinner, { ShimmerCard } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const ReferralPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState([])
  const [milestones, setMilestones] = useState([])
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingBonuses: 0
  })

  useEffect(() => {
    const loadReferralData = async () => {
      if (!user) return
      
      try {
        // Load user's referrals
        const { data: referralData, error: referralError } = await db.getReferrals(user.id)
        if (!referralError && referralData) {
          setReferrals(referralData)
          
          // Calculate stats
          const stats = {
            totalReferrals: referralData.length,
            totalEarnings: referralData.filter(r => r.bonus_given).length * 80,
            pendingBonuses: referralData.filter(r => !r.bonus_given).length * 80
          }
          setReferralStats(stats)
        }
        
        // Load milestones
        const { data: milestoneData, error: milestoneError } = await db.getMilestones()
        if (!milestoneError && milestoneData) {
          setMilestones(milestoneData)
        }
        
      } catch (error) {
        console.error('Error loading referral data:', error)
        toast.error('Failed to load referral data')
      } finally {
        setLoading(false)
      }
    }

    loadReferralData()
  }, [user])

  const referralLink = profile ? `https://${process.env.REACT_APP_DOMAIN}/signup?ref=${profile.referral_code}` : ''

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code)
      toast.success('Referral code copied!')
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied!')
  }

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${t('appName')}`,
        text: `Join me on ${t('appName')} and start earning! Use my referral code: ${profile.referral_code}`,
        url: referralLink
      })
    } else {
      copyReferralLink()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getMilestoneProgress = (requiredReferrals) => {
    const progress = (referralStats.totalReferrals / requiredReferrals) * 100
    return Math.min(progress, 100)
  }

  if (loading) {
    return (
      <div className="mobile-padding pb-20">
        <div className="flex items-center py-6">
          <div className="w-6 h-6 bg-white/10 rounded mr-4"></div>
          <div className="w-32 h-6 bg-white/10 rounded"></div>
        </div>
        <ShimmerCard className="mb-6 h-32" />
        <ShimmerCard className="mb-6 h-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ShimmerCard key={index} className="h-16" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-padding pb-20">
      {/* Header */}
      <div className="flex items-center py-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('referralSystem')}</h1>
      </div>

      {/* Referral Stats */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Trophy className="mr-2 text-primary" size={20} />
          Referral Statistics
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="text-blue-400" size={20} />
            </div>
            <p className="text-lg font-bold text-blue-400">{referralStats.totalReferrals}</p>
            <p className="text-xs text-muted-foreground">Total Referrals</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <DollarSign className="text-green-400" size={20} />
            </div>
            <p className="text-lg font-bold text-green-400">{referralStats.totalEarnings}</p>
            <p className="text-xs text-muted-foreground">Earned (PKR)</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Clock className="text-yellow-400" size={20} />
            </div>
            <p className="text-lg font-bold text-yellow-400">{referralStats.pendingBonuses}</p>
            <p className="text-xs text-muted-foreground">Pending (PKR)</p>
          </div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Share2 className="mr-2 text-primary" size={20} />
          {t('yourReferralLink')}
        </h3>
        
        <div className="space-y-4">
          {/* Referral Code */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Referral Code:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-primary text-center">
                {profile?.referral_code}
              </code>
              <button
                onClick={copyReferralCode}
                className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareReferralLink}
              className="btn-primary flex items-center justify-center"
            >
              <Share2 className="mr-2" size={16} />
              Share
            </button>
            
            <button
              onClick={copyReferralLink}
              className="btn-secondary flex items-center justify-center"
            >
              <Copy className="mr-2" size={16} />
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Referral Bonus Info */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Gift className="mr-2 text-secondary" size={20} />
          {t('referralBonus')}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-sm">When someone uses your referral:</span>
            <span className="font-bold text-primary">+80 PKR</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
            <span className="text-sm">New user bonus:</span>
            <span className="font-bold text-secondary">+40 PKR</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Target className="mr-2 text-purple-400" size={20} />
          {t('referralMilestones')}
        </h3>
        
        <div className="space-y-4">
          {milestones.map((milestone) => {
            const progress = getMilestoneProgress(milestone.referrals_required)
            const isCompleted = referralStats.totalReferrals >= milestone.referrals_required
            
            return (
              <div key={milestone.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isCompleted ? (
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                    ) : (
                      <Target className="text-muted-foreground mr-2" size={16} />
                    )}
                    <span className="text-sm font-medium">
                      {milestone.referrals_required} Referrals
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${isCompleted ? 'text-green-400' : 'text-secondary'}`}>
                    {milestone.reward_amount} PKR
                  </span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-400' : 'bg-primary'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {isCompleted 
                    ? 'Milestone completed!' 
                    : `${milestone.referrals_required - referralStats.totalReferrals} more referrals needed`
                  }
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Referral History */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4 flex items-center">
          <Users className="mr-2 text-blue-400" size={20} />
          Referral History
        </h3>
        
        {referrals.length > 0 ? (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-3 glass-card">
                <div>
                  <p className="font-medium">{referral.referred?.username || 'Unknown User'}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {formatDate(referral.referred?.signup_date || referral.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${referral.bonus_given ? 'text-green-400' : 'text-yellow-400'}`}>
                    {referral.bonus_given ? '+80 PKR' : 'Pending'}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {referral.bonus_given ? 'Paid' : 'Waiting for top-up'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto mb-3 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">No referrals yet</p>
            <p className="text-sm text-muted-foreground">
              Share your referral link to start earning!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralPage

