import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { Share2, Copy, X, Users, Gift } from 'lucide-react'
import toast from 'react-hot-toast'

const ReferralFAB = () => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!profile) return null

  const referralLink = `https://${process.env.REACT_APP_DOMAIN}/signup?ref=${profile.referral_code}`

  const copyReferralCode = () => {
    navigator.clipboard.writeText(profile.referral_code)
    toast.success('Referral code copied!')
    setIsOpen(false)
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied!')
    setIsOpen(false)
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
    setIsOpen(false)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fab"
        style={{ 
          background: isOpen 
            ? 'linear-gradient(135deg, #ff4444, #ff6b6b)' 
            : 'linear-gradient(135deg, #00BFA6, #00E676)'
        }}
      >
        {isOpen ? <X size={24} /> : <Share2 size={24} />}
      </button>

      {/* Referral Menu */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-40 w-72">
          <div className="glass-card p-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg">{t('referralSystem')}</h3>
              <p className="text-sm text-muted-foreground">
                Earn 80 PKR for each successful referral!
              </p>
            </div>

            {/* Referral Code */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Your Referral Code:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-primary text-center">
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

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={shareReferralLink}
                className="btn-primary w-full flex items-center justify-center"
              >
                <Share2 className="mr-2" size={16} />
                Share Referral Link
              </button>
              
              <button
                onClick={copyReferralLink}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <Copy className="mr-2" size={16} />
                Copy Link
              </button>
            </div>

            {/* Bonus Info */}
            <div className="mt-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
              <div className="flex items-center mb-2">
                <Gift className="text-secondary mr-2" size={16} />
                <span className="text-sm font-medium text-secondary">Referral Bonus</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• You get 80 PKR when referred user tops up</p>
                <p>• Referred user gets 40 PKR bonus</p>
                <p>• Milestone bonuses available for multiple referrals</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ReferralFAB

