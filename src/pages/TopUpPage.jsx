import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db, storage } from '../lib/supabase'
import { 
  ArrowLeft, 
  Upload, 
  CreditCard, 
  Building2, 
  User, 
  Hash,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const TopUpPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [amount, setAmount] = useState('')

  // Dummy company bank details
  const companyBankDetails = {
    bankName: 'HBL Bank Limited',
    accountNumber: '12345678901234',
    accountHolder: 'SkillMint Technologies',
    branchCode: 'HBL-0123'
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    if (!imageFile) {
      toast.error('Please upload a payment screenshot')
      return
    }
    
    setLoading(true)
    
    try {
      // Upload image to Supabase storage
      const fileName = `topup_${user.id}_${Date.now()}.${imageFile.name.split('.').pop()}`
      const filePath = `topup-screenshots/${fileName}`
      
      const { data: uploadData, error: uploadError } = await storage.uploadFile(
        process.env.REACT_APP_STORAGE_BUCKET || 'skillmint-uploads',
        filePath,
        imageFile
      )
      
      if (uploadError) {
        throw new Error('Failed to upload image: ' + uploadError.message)
      }
      
      // Get public URL for the uploaded image
      const imageUrl = storage.getPublicUrl(
        process.env.REACT_APP_STORAGE_BUCKET || 'skillmint-uploads',
        filePath
      )
      
      // Create top-up request
      const { data, error } = await db.createTopupRequest(
        user.id,
        parseFloat(amount),
        imageUrl
      )
      
      if (error) {
        throw new Error('Failed to create top-up request: ' + error.message)
      }
      
      toast.success('Top-up request submitted successfully!')
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Error submitting top-up request:', error)
      toast.error(error.message || 'Failed to submit top-up request')
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
        <h1 className="text-xl font-bold">{t('topUpTitle')}</h1>
      </div>

      {/* Company Bank Details */}
      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-4 flex items-center text-primary">
          <Building2 className="mr-2" size={20} />
          {t('companyBankDetails')}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('bankName')}:</span>
            <span className="font-medium">{companyBankDetails.bankName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('accountNumber')}:</span>
            <span className="font-mono font-medium">{companyBankDetails.accountNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t('accountHolder')}:</span>
            <span className="font-medium">{companyBankDetails.accountHolder}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Branch Code:</span>
            <span className="font-medium">{companyBankDetails.branchCode}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="glass-card p-4 mb-6">
        <h4 className="font-semibold text-secondary mb-3">📋 Instructions</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>1. Transfer money to the above bank account</p>
          <p>2. Take a screenshot of the successful transaction</p>
          <p>3. Enter the amount and upload the screenshot below</p>
          <p>4. Wait for admin approval (usually within 24 hours)</p>
          <p>5. Your balance will be updated once approved</p>
        </div>
      </div>

      {/* Top-up Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <CreditCard className="inline mr-2" size={16} />
            {t('amount')} ({t('pkr')})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in PKR"
            className="glass-input w-full"
            min="1"
            step="1"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum amount: 100 PKR
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Camera className="inline mr-2" size={16} />
            {t('uploadScreenshot')}
          </label>
          
          <div className="space-y-4">
            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                required
              />
              <label
                htmlFor="image-upload"
                className="glass-card-hover p-6 border-2 border-dashed border-white/20 rounded-xl cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <Upload className="text-primary mb-2" size={32} />
                <p className="font-medium">Click to upload screenshot</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Preview:</span>
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <img
                  src={imagePreview}
                  alt="Payment screenshot preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  File: {imageFile?.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount || !imageFile}
          className="btn-primary w-full flex items-center justify-center"
        >
          {loading ? (
            <LoadingSpinner size={20} />
          ) : (
            <>
              <Upload className="mr-2" size={20} />
              {t('submitTopUp')}
            </>
          )}
        </button>
      </form>

      {/* Important Notes */}
      <div className="glass-card p-4 mt-6">
        <h4 className="font-semibold text-yellow-400 mb-3">⚠️ Important Notes</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Only send money to the official bank account shown above</p>
          <p>• Screenshot must clearly show transaction details</p>
          <p>• Amount entered must match the transferred amount</p>
          <p>• Fake or edited screenshots will result in account suspension</p>
          <p>• Processing time: 1-24 hours during business days</p>
        </div>
      </div>
    </div>
  )
}

export default TopUpPage

