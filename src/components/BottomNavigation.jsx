import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, BarChart3, CreditCard, User, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const BottomNavigation = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const navItems = [
    {
      id: 'home',
      label: t('home'),
      icon: Home,
      path: '/'
    },
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: BarChart3,
      path: '/dashboard'
    },
    {
      id: 'plans',
      label: t('plans'),
      icon: CreditCard,
      path: '/plans'
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: User,
      path: '/profile'
    }
  ]

  // Add admin tab if user is admin
  if (isAdmin) {
    navItems.push({
      id: 'admin',
      label: t('admin'),
      icon: Shield,
      path: '/admin'
    })
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                active 
                  ? 'text-primary bg-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation

