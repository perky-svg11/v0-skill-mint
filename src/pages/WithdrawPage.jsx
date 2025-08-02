import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db } from '../lib/supabase'
import { 
  ArrowLeft, 
  Banknote, 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  Wallet,
  Info
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const WithdrawPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(true)
  const [amount, setAmount] = useState('')
  const [eligibility, setEligibility] = useState(null)
  const [daysSinceSignup, setDaysSinceSignup] = useState(0)

  // Plan minimum withdrawal amounts
  const planLimits = {
    'Starter': 1000,
    'Pro': 5000,
    'Elite': 12000,
    'Titan': 25000,
    'Legend': 50000
  }

  useEffect(() => {
    const checkWithdrawalEligibility = async () => {
      if (!user || !profile) return
      
      try {
        // Get days since signup
        const { data: days, error: daysError } = await db.getDaysSinceSignup(user.id)
        if (!daysError && days !== null) {
          setDaysSinceSignup(days)
        }
        
        // Check basic eligibility without amount first
        const minAmount = planLimits[profile.plan_level] || 1000
        const { data, error } = await db.checkWithdrawalEligibility(user.id, minAmount)
        
        if (!error && data) {
          setEligibility(data)
        }
      } catch (error) {
        console.error('Error checking eligibility:', error)
      } finally {
        setCheckingEligibility(false)
      }
    }

    checkWithdrawalEligibility()
  }, [user, profile])

  const handleAmountChange = async (e) => {
    const newAmount = e.target.value
    setAmount(newAmount)
    
    // Check eligibility for the specific amount
    if (newAmount && parseFloat(newAmount) > 0) {
      try {
        const { data, error } = await db.checkWithdrawalEligibility(user.id, parseFloat(newAmount))
        if (!error && data) {
          setEligibility(data)
        }
      } catch (error) {
        console.error('Error checking amount eligibility:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    if (!eligibility?.eligible) {
      toast.error(eligibility?.reason || 'Withdrawal not eligible')
      return
    }
    
    if (!profile.bank_name || !profile.iban || !profile.account_holder) {
      toast.error('Please complete your bank information first')
      navigate('/bank-info')
      return
    }
    
    setLoading(true)
    
    try {
      const bankInfo = {
        bank_name: profile.bank_name,
        iban: profile.iban,
        account_holder: profile.account_holder,
        phone: profile.phone,
        branch: profile.branch
      }
      
      const { data, error } = await db.createWithdrawRequest(
        user.id,
        parseFloat(amount),
        bankInfo
      )
      
      if (error) {
        throw new Error('Failed to create withdrawal request: ' + error.message)
      }
      
      toast.success('Withdrawal request submitted successfully!')
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Error submitting withdrawal request:', error)
      toast.error(error.message || 'Failed to submit withdrawal request')
    } finally {
      setLoading(false)
    }
  }

  if (checkingEligibility) {
    return (
      <div className="mobile-padding pb-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size={48} className="mb-4" />
          <p className="text-muted-foreground">Checking withdrawal eligibility...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mobile-padding pb-20 flex items-center justify-center min-h-screen">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold text-destructive mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load your profile.</p>
        </div>
      </div>
    )
  }

  const minWithdraw = planLimits[profile.plan_level] || 1000
  const bankInfoComplete = profile.bank_name && profile.iban && profile.account_holder

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
        <h1 className="text-xl font-bold">{t('withdrawTitle')}</h1>
      </div>

      {/* Account Status */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Wallet className="mr-2 text-primary" size={20} />
          Account Status
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Balance:</span>
            <span className="font-bold text-primary">
              {profile.balance?.toLocaleString() || 0} {t('pkr')}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Plan Level:</span>
            <span className="font-medium text-secondary">{profile.plan_level}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Days Active:</span>
            <span className="font-medium">{daysSinceSignup} days</span>
          </div>
        </div>
      </div>

      {/* Withdrawal Conditions */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Info className="mr-2 text-blue-400" size={20} />
          {t('withdrawalConditions')}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('accountAge')}</span>
            {daysSinceSignup >= 7 ? (
              <CheckCircle className="text-green-400" size={20} />
            ) : (
              <XCircle className="text-red-400" size={20} />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Bank information complete</span>
            {bankInfoComplete ? (
              <CheckCircle className="text-green-400" size={20} />
            ) : (
              <XCircle className="text-red-400" size={20} />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('planRequirement')}</span>
            {profile.balance >= minWithdraw ? (
              <CheckCircle className="text-green-400" size={20} />
            ) : (
              <XCircle className="text-red-400" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Bank Information */}
      {bankInfoComplete ? (
        <div className="glass-card p-4 mb-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Building2 className="mr-2 text-green-400" size={20} />
            Withdrawal Account
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank:</span>
              <span className="font-medium">{profile.bank_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account:</span>
              <span className="font-mono">{profile.iban}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Holder:</span>
              <span className="font-medium">{profile.account_holder}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 mb-6 border border-red-400/30">
          <div className="flex items-center mb-3">
            <AlertTriangle className="text-red-400 mr-3" size={24} />
            <div>
              <h3 className="font-semibold text-red-400">Bank Information Required</h3>
              <p className="text-sm text-muted-foreground">
                Complete your bank details to enable withdrawals
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/bank-info')}
            className="btn-secondary w-full"
          >
            Complete Bank Information
          </button>
        </div>
      )}

      {/* Withdrawal Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Banknote className="inline mr-2" size={16} />
            Withdrawal Amount ({t('pkr')})
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Minimum: ${minWithdraw.toLocaleString()} PKR`}
            className="glass-input w-full"
            min={minWithdraw}
            step="1"
            required
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Minimum: {minWithdraw.toLocaleString()} {t('pkr')}</span>
            <span>Available: {profile.balance?.toLocaleString() || 0} {t('pkr')}</span>
          </div>
        </div>

        {/* Eligibility Status */}
        {eligibility && (
          <div className={`glass-card p-4 ${eligibility.eligible ? 'border-green-400/30' : 'border-red-400/30'}`}>
            <div className="flex items-center">
              {eligibility.eligible ? (
                <CheckCircle className="text-green-400 mr-3" size={20} />
              ) : (
                <XCircle className="text-red-400 mr-3" size={20} />
              )}
              <div>
                <p className={`font-medium ${eligibility.eligible ? 'text-green-400' : 'text-red-400'}`}>
                  {eligibility.eligible ? 'Withdrawal Eligible' : 'Withdrawal Not Eligible'}
                </p>
                <p className="text-sm text-muted-foreground">{eligibility.reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !eligibility?.eligible || !bankInfoComplete}
          className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingSpinner size={20} />
          ) : (
            <>
              <Banknote className="mr-2" size={20} />
              {t('submitWithdraw')}
            </>
          )}
        </button>
      </form>

      {/* Processing Info */}
      <div className="glass-card p-4 mt-6">
        <h4 className="font-semibold text-blue-400 mb-3">ℹ️ Processing Information</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Withdrawal requests are processed manually by admin</p>
          <p>• Processing time: 1-3 business days</p>
          <p>• You will receive a confirmation once processed</p>
          <p>• Funds will be transferred to your registered bank account</p>
          <p>• Contact support if you don't receive funds within 5 days</p>
        </div>
      </div>
    </div>
  )
}

export default WithdrawPage

