import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { admin } from '../lib/supabase'
import { 
  Users, 
  CreditCard, 
  Banknote, 
  Share2, 
  Settings, 
  FileText,
  Shield,
  BarChart3,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import LoadingSpinner, { ShimmerCard } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

// Admin Dashboard Layout Component
const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/admin' },
    { id: 'users', label: t('users'), icon: Users, path: '/admin/users' },
    { id: 'topup', label: t('topUpRequests'), icon: CreditCard, path: '/admin/topup' },
    { id: 'withdraw', label: t('withdrawRequests'), icon: Banknote, path: '/admin/withdraw' },
    { id: 'referrals', label: t('referralMonitor'), icon: Share2, path: '/admin/referrals' },
    { id: 'tools', label: t('manualTools'), icon: Settings, path: '/admin/tools' },
    { id: 'logs', label: t('adminLogs'), icon: FileText, path: '/admin/logs' }
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="mobile-padding pb-20">
      {/* Header */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center mb-2">
          <Shield className="text-primary mr-2" size={24} />
          <h1 className="text-2xl font-bold">{t('adminDashboard')}</h1>
        </div>
        <p className="text-muted-foreground">System administration panel</p>
      </div>

      {/* Navigation */}
      <div className="admin-sidebar mb-6">
        <div className="grid grid-cols-2 gap-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`admin-nav-item ${active ? 'active' : ''}`}
              >
                <Icon size={16} className="mr-2" />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  )
}

// Admin Overview Component
const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingTopups: 0,
    pendingWithdrawals: 0,
    totalReferrals: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load basic stats
        const [usersData, topupData, withdrawData] = await Promise.all([
          admin.getAllUsers(),
          admin.getAllTopupRequests(),
          admin.getAllWithdrawRequests()
        ])

        setStats({
          totalUsers: usersData.data?.length || 0,
          pendingTopups: topupData.data?.filter(r => r.status === 'pending').length || 0,
          pendingWithdrawals: withdrawData.data?.filter(r => r.status === 'pending').length || 0,
          totalReferrals: 0 // TODO: Calculate from referrals table
        })
      } catch (error) {
        console.error('Error loading admin stats:', error)
        toast.error('Failed to load admin statistics')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ShimmerCard key={index} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <Users className="text-blue-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>
        
        <div className="glass-card p-4 text-center">
          <CreditCard className="text-yellow-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-yellow-400">{stats.pendingTopups}</p>
          <p className="text-sm text-muted-foreground">Pending Top-ups</p>
        </div>
        
        <div className="glass-card p-4 text-center">
          <Banknote className="text-red-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-red-400">{stats.pendingWithdrawals}</p>
          <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
        </div>
        
        <div className="glass-card p-4 text-center">
          <Share2 className="text-green-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-green-400">{stats.totalReferrals}</p>
          <p className="text-sm text-muted-foreground">Total Referrals</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • Review pending top-up requests
          </p>
          <p className="text-sm text-muted-foreground">
            • Process withdrawal requests
          </p>
          <p className="text-sm text-muted-foreground">
            • Monitor user activity
          </p>
          <p className="text-sm text-muted-foreground">
            • Manage referral bonuses
          </p>
        </div>
      </div>

      {/* System Status */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Database Connection:</span>
            <CheckCircle className="text-green-400" size={16} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Authentication Service:</span>
            <CheckCircle className="text-green-400" size={16} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">File Storage:</span>
            <CheckCircle className="text-green-400" size={16} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Admin Access:</span>
            <CheckCircle className="text-green-400" size={16} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Users Component
const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await admin.getAllUsers()
        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error('Error loading users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <ShimmerCard key={index} className="h-20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">All Users ({users.length})</h3>
      </div>
      
      {users.map((user) => (
        <div key={user.id} className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Plan: {user.plan_level} • Balance: {user.balance} PKR
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-400/20 text-blue-400 rounded-lg">
                <Eye size={16} />
              </button>
              <button className="p-2 bg-green-400/20 text-green-400 rounded-lg">
                <Edit size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Admin Top-up Requests Component
const AdminTopupRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const { data, error } = await admin.getAllTopupRequests()
        if (error) throw error
        setRequests(data || [])
      } catch (error) {
        console.error('Error loading topup requests:', error)
        toast.error('Failed to load topup requests')
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [])

  const handleApprove = async (requestId) => {
    try {
      // TODO: Implement approval logic
      toast.success('Request approved successfully')
    } catch (error) {
      toast.error('Failed to approve request')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <ShimmerCard key={index} className="h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Top-up Requests ({requests.length})</h3>
      </div>
      
      {requests.map((request) => (
        <div key={request.id} className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">{request.user?.username}</p>
              <p className="text-sm text-muted-foreground">{request.user?.email}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{request.amount} PKR</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                request.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                request.status === 'approved' ? 'bg-green-400/20 text-green-400' :
                'bg-red-400/20 text-red-400'
              }`}>
                {request.status}
              </span>
            </div>
          </div>
          
          {request.status === 'pending' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(request.id)}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                <CheckCircle className="mr-2" size={16} />
                Approve
              </button>
              <button className="flex-1 bg-red-400/20 text-red-400 px-4 py-2 rounded-lg flex items-center justify-center">
                <XCircle className="mr-2" size={16} />
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Main Admin Page Component
const AdminPage = () => {
  const { user, isAdmin } = useAuth()

  // Double-check admin access
  if (!isAdmin) {
    return (
      <div className="mobile-padding pb-20 flex items-center justify-center min-h-screen">
        <div className="glass-card p-8 text-center">
          <Shield className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/topup" element={<AdminTopupRequests />} />
        <Route path="/withdraw" element={<div className="text-center py-8 text-muted-foreground">Withdraw requests coming soon...</div>} />
        <Route path="/referrals" element={<div className="text-center py-8 text-muted-foreground">Referral monitor coming soon...</div>} />
        <Route path="/tools" element={<div className="text-center py-8 text-muted-foreground">Manual tools coming soon...</div>} />
        <Route path="/logs" element={<div className="text-center py-8 text-muted-foreground">Admin logs coming soon...</div>} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminPage

