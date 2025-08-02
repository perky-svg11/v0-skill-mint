import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for common operations
export const auth = {
  // Sign up new user
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}

// Database helper functions
export const db = {
  // Get user profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Get user's topup requests
  getTopupRequests: async (userId) => {
    const { data, error } = await supabase
      .from('topup_requests')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
    return { data, error }
  },

  // Create topup request
  createTopupRequest: async (userId, amount, imageUrl) => {
    const { data, error } = await supabase
      .from('topup_requests')
      .insert({
        user_id: userId,
        amount: amount,
        image_url: imageUrl
      })
      .select()
      .single()
    return { data, error }
  },

  // Get user's withdraw requests
  getWithdrawRequests: async (userId) => {
    const { data, error } = await supabase
      .from('withdraw_requests')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
    return { data, error }
  },

  // Create withdraw request
  createWithdrawRequest: async (userId, amount, bankInfo) => {
    const { data, error } = await supabase
      .from('withdraw_requests')
      .insert({
        user_id: userId,
        amount: amount,
        bank_info: bankInfo
      })
      .select()
      .single()
    return { data, error }
  },

  // Get user's referrals
  getReferrals: async (userId) => {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:profiles!referrals_referred_id_fkey(username, email, signup_date)
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get milestones
  getMilestones: async () => {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .order('referrals_required', { ascending: true })
    return { data, error }
  },

  // Check withdrawal eligibility
  checkWithdrawalEligibility: async (userId, amount) => {
    const { data, error } = await supabase
      .rpc('check_withdrawal_eligibility', {
        user_id: userId,
        amount: amount
      })
    return { data, error }
  },

  // Get days since signup
  getDaysSinceSignup: async (userId) => {
    const { data, error } = await supabase
      .rpc('get_days_since_signup', {
        user_id: userId
      })
    return { data, error }
  }
}

// Storage helper functions
export const storage = {
  // Upload file
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },

  // Get public URL
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },

  // Delete file
  deleteFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
    return { data, error }
  }
}

// Admin helper functions (only for admin users)
export const admin = {
  // Check if user is admin
  isAdmin: async (user) => {
    if (!user) return false
    return user.email === process.env.REACT_APP_ADMIN_EMAIL
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('signup_date', { ascending: false })
    return { data, error }
  },

  // Get all topup requests (admin only)
  getAllTopupRequests: async () => {
    const { data, error } = await supabase
      .from('topup_requests')
      .select(`
        *,
        user:profiles!topup_requests_user_id_fkey(username, email)
      `)
      .order('timestamp', { ascending: false })
    return { data, error }
  },

  // Get all withdraw requests (admin only)
  getAllWithdrawRequests: async () => {
    const { data, error } = await supabase
      .from('withdraw_requests')
      .select(`
        *,
        user:profiles!withdraw_requests_user_id_fkey(username, email, plan_level)
      `)
      .order('timestamp', { ascending: false })
    return { data, error }
  },

  // Approve topup request (admin only)
  approveTopupRequest: async (requestId, adminId) => {
    const { data, error } = await supabase
      .from('topup_requests')
      .update({
        status: 'approved',
        processed_by: adminId,
        processed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()
    return { data, error }
  },

  // Mark withdraw request as paid (admin only)
  markWithdrawAsPaid: async (requestId, adminId) => {
    const { data, error } = await supabase
      .from('withdraw_requests')
      .update({
        status: 'paid',
        processed_by: adminId,
        processed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()
    return { data, error }
  },

  // Update user balance (admin only)
  updateUserBalance: async (userId, newBalance, adminId, reason) => {
    // First update the balance
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId)
      .select()
      .single()

    if (profileError) return { data: null, error: profileError }

    // Log the action
    const { data: logData, error: logError } = await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminId,
        action: 'update_balance',
        details: {
          user_id: userId,
          new_balance: newBalance,
          reason: reason
        },
        target_user_id: userId
      })

    return { data: profileData, error: logError }
  },

  // Update user plan (admin only)
  updateUserPlan: async (userId, newPlan, adminId) => {
    // First update the plan
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({ plan_level: newPlan })
      .eq('id', userId)
      .select()
      .single()

    if (profileError) return { data: null, error: profileError }

    // Log the action
    const { data: logData, error: logError } = await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminId,
        action: 'update_plan',
        details: {
          user_id: userId,
          new_plan: newPlan
        },
        target_user_id: userId
      })

    return { data: profileData, error: logError }
  }
}

export default supabase

