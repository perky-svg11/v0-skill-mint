import { useState, useEffect, createContext, useContext } from 'react'
import { auth, db, supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session } = await auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
          checkAdminStatus(session.user)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
          checkAdminStatus(session.user)
        } else {
          setUser(null)
          setProfile(null)
          setIsAdmin(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await db.getProfile(userId)
      if (error) {
        console.error('Error loading profile:', error)
        return
      }
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const checkAdminStatus = (user) => {
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL
    setIsAdmin(user?.email === adminEmail)
  }

  const signUp = async (email, password, username) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signUp(email, password, username)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Please check your email to confirm your account')
      }

      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      toast.success('Welcome back!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await auth.signOut()
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      toast.success('Signed out successfully')
      return { success: true }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' }
      
      const { data, error } = await db.updateProfile(user.id, updates)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }

      setProfile(data)
      toast.success('Profile updated successfully')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default useAuth

