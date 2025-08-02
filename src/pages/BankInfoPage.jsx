import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ArrowLeft, Building2, CreditCard, User, Phone, MapPin, Save } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const BankInfoPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bank_name: '',
    iban: '',
    account_holder: '',
    phone: '',
    branch: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        bank_name: profile.bank_name || '',
        iban: profile.iban || '',
        account_holder: profile.account_holder || '',
        phone: profile.phone || '',
        branch: profile.branch || ''
      })
    }
  }, [profile])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.bank_name || !formData.iban || !formData.account_holder) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      const { success } = await updateProfile(formData)
      
      if (success) {
        toast.success('Bank information saved successfully')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error saving bank info:', error)
      toast.error('Failed to save bank information')
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-xl font-bold">{t('bankInfoTitle')}</h1>
      </div>

      {/* Info Card */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center mb-3">
          <Building2 className="text-primary mr-3" size={24} />
          <div>
            <h3 className="font-semibold">Bank Information Required</h3>
            <p className="text-sm text-muted-foreground">
              Complete your bank details to enable withdrawals
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>• Bank information is required before making any withdrawal</p>
          <p>• All fields marked with * are mandatory</p>
          <p>• Your information is securely encrypted</p>
        </div>
      </div>

      {/* Bank Info Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Building2 className="inline mr-2" size={16} />
            {t('bankName')} *
          </label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleInputChange}
            placeholder="e.g., HBL, UBL, MCB, Allied Bank"
            className="glass-input w-full"
            required
          />
        </div>

        {/* IBAN / Account Number */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <CreditCard className="inline mr-2" size={16} />
            {t('ibanAccountNumber')} *
          </label>
          <input
            type="text"
            name="iban"
            value={formData.iban}
            onChange={handleInputChange}
            placeholder="PK36SCBL0000001123456702 or 1234567890"
            className="glass-input w-full"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter your IBAN or account number
          </p>
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <User className="inline mr-2" size={16} />
            {t('accountHolder')} *
          </label>
          <input
            type="text"
            name="account_holder"
            value={formData.account_holder}
            onChange={handleInputChange}
            placeholder="Full name as per bank records"
            className="glass-input w-full"
            required
          />
        </div>

        {/* Phone Number (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Phone className="inline mr-2" size={16} />
            {t('phoneNumber')}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+92 300 1234567"
            className="glass-input w-full"
          />
        </div>

        {/* Branch Code (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="inline mr-2" size={16} />
            {t('branchCode')}
          </label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            placeholder="Branch code or name"
            className="glass-input w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center mt-6"
        >
          {loading ? (
            <LoadingSpinner size={20} />
          ) : (
            <>
              <Save className="mr-2" size={20} />
              {t('saveBankInfo')}
            </>
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="glass-card p-4 mt-6">
        <h4 className="font-semibold text-green-400 mb-2">🔒 Security Notice</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Your bank information is encrypted and stored securely</p>
          <p>• We never store your banking passwords or PINs</p>
          <p>• Information is only used for withdrawal processing</p>
          <p>• You can update this information anytime</p>
        </div>
      </div>
    </div>
  )
}

export default BankInfoPage

