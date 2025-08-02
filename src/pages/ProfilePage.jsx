import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Wallet, 
  TrendingUp, 
  LogOut, 
  Edit3, 
  Copy,
  Share2,
  Settings,
  Shield
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { t } = useTranslation()
  const { user, profile, signOut, isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code)
      toast.success('Referral code copied to clipboard!')
    }
  }

  const shareReferralLink = () => {
    if (profile?.referral_code) {
      const referralLink = `https://${process.env.REACT_APP_DOMAIN}/signup?ref=${profile.referral_code}`
      
      if (navigator.share) {
        navigator.share({
          title: 'Join SkillMint',
          text: 'Join me on SkillMint and start earning!',
          url: referralLink
        })
      } else {
        navigator.clipboard.writeText(referralLink)
        toast.success('Referral link copied to clipboard!')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!profile) {
    return (
      <div className="mobile-padding pb-20 flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <div className="mobile-padding pb-20">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold mb-2">{t('profile')}</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 mb-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-primary">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
          {isAdmin && (
            <div className="inline-flex items-center mt-2 px-3 py-1 bg-primary/20 rounded-full">
              <Shield size={16} className="text-primary mr-2" />
              <span className="text-primary font-medium">Admin</span>
            </div>
          )}
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 glass-card">
            <Wallet className="text-primary mx-auto mb-2" size={24} />
            <p className="text-sm text-muted-foreground">{t('balance')}</p>
            <p className="text-lg font-bold text-primary">
              {profile.balance?.toLocaleString() || 0} {t('pkr')}
            </p>
          </div>

          <div className="text-center p-3 glass-card">
            <TrendingUp className="text-secondary mx-auto mb-2" size={24} />
            <p className="text-sm text-muted-foreground">{t('totalEarnings')}</p>
            <p className="text-lg font-bold text-secondary">
              {profile.total_earnings?.toLocaleString() || 0} {t('pkr')}
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <User className="mr-2" size={20} />
          Account Information
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Username:</span>
            <span className="font-medium">{profile.username}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Plan Level:</span>
            <span className="font-medium text-primary">{profile.plan_level || 'Starter'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Member Since:</span>
            <span className="font-medium">{formatDate(profile.signup_date)}</span>
          </div>
          
          {profile.referred_by && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Referred By:</span>
              <span className="font-medium text-secondary">{profile.referred_by}</span>
            </div>
          )}
        </div>
      </div>

      {/* Referral Section */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Share2 className="mr-2" size={20} />
          Referral Information
        </h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Your Referral Code:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-primary">
                {profile.referral_code}
              </code>
              <button
                onClick={copyReferralCode}
                className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          <button
            onClick={shareReferralLink}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <Share2 className="mr-2" size={16} />
            Share Referral Link
          </button>
        </div>
      </div>

      {/* Bank Information Status */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Settings className="mr-2" size={20} />
          Account Settings
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Bank Information:</span>
            <span className={`font-medium ${profile.bank_name ? 'text-green-400' : 'text-red-400'}`}>
              {profile.bank_name ? 'Complete' : 'Incomplete'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email Verified:</span>
            <span className={`font-medium ${user?.email_confirmed_at ? 'text-green-400' : 'text-red-400'}`}>
              {user?.email_confirmed_at ? 'Verified' : 'Pending'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Account Status:</span>
            <span className="font-medium text-green-400">Active</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full glass-card-hover p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Edit3 className="mr-3 text-blue-400" size={20} />
            <span>Edit Profile</span>
          </div>
          <span className="text-muted-foreground">Coming Soon</span>
        </button>
        
        <button className="w-full glass-card-hover p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="mr-3 text-green-400" size={20} />
            <span>Account Settings</span>
          </div>
          <span className="text-muted-foreground">Coming Soon</span>
        </button>
        
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full glass-card-hover p-4 flex items-center justify-center text-red-400 hover:bg-red-400/10"
        >
          {loading ? (
            <LoadingSpinner size={20} />
          ) : (
            <>
              <LogOut className="mr-3" size={20} />
              {t('logout')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProfilePage

