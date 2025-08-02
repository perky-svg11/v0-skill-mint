import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ArrowRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [liveFeeds, setLiveFeeds] = useState({
    inOut: [],
    gain: [],
    fake: []
  })

  // Carousel images (placeholder for now)
  const carouselImages = [
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
  ]

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  // Generate fake live feed data
  useEffect(() => {
    const generateFakeData = () => {
      const pakistaniNames = ['Ali', 'Ahmed', 'Hassan', 'Fatima', 'Ayesha', 'Omar', 'Zara', 'Bilal', 'Sana', 'Usman']
      const internationalNames = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'Chris', 'Anna', 'Tom', 'Maria']
      const allNames = [...pakistaniNames, ...internationalNames]

      const generateEntry = (type) => {
        const name = allNames[Math.floor(Math.random() * allNames.length)]
        const maskedName = name.substring(0, 3) + '***' + Math.floor(Math.random() * 100)
        const amount = Math.floor(Math.random() * 5000) + 100
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: maskedName,
          amount,
          type,
          timestamp: Date.now()
        }
      }

      setLiveFeeds({
        inOut: Array.from({ length: 5 }, () => 
          generateEntry(Math.random() > 0.5 ? 'withdraw' : 'topup')
        ),
        gain: Array.from({ length: 5 }, () => generateEntry('earning')),
        fake: Array.from({ length: 5 }, () => generateEntry('bonus'))
      })
    }

    generateFakeData()
    const interval = setInterval(generateFakeData, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      // This will trigger the AuthGuard to show login form
      navigate('/dashboard')
    }
  }

  const renderFeedItem = (item) => {
    const isPositive = item.type === 'topup' || item.type === 'earning' || item.type === 'bonus'
    const Icon = isPositive ? TrendingUp : TrendingDown
    const color = isPositive ? 'text-green-400' : 'text-red-400'
    
    let action = ''
    switch (item.type) {
      case 'withdraw':
        action = 'withdrew'
        break
      case 'topup':
        action = 'topped up'
        break
      case 'earning':
        action = 'earned'
        break
      case 'bonus':
        action = 'received bonus'
        break
      default:
        action = 'transacted'
    }

    return (
      <div key={item.id} className="flex items-center justify-between py-2 px-3 glass-card mb-2">
        <div className="flex items-center space-x-3">
          <Icon size={16} className={color} />
          <span className="text-sm">
            <span className="font-medium">{item.name}</span> {action}
          </span>
        </div>
        <span className={`text-sm font-bold ${color}`}>
          {isPositive ? '+' : '-'}{item.amount} {t('pkr')}
        </span>
      </div>
    )
  }

  return (
    <div className="mobile-padding pb-20">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          {t('appName')}
        </h1>
        <p className="text-muted-foreground">
          Task-Based Earning Platform
        </p>
      </div>

      {/* Image Carousel */}
      <div className="carousel-container mb-6">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="carousel-slide"
            />
          ))}
        </div>
        
        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-primary' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scrolling Marquee */}
      <div className="glass-card p-3 mb-6 overflow-hidden">
        <div className="marquee">
          <span className="text-primary font-semibold">
            🎉 Welcome to SkillMint! Start earning today with our referral system! 
            Get 80 PKR for each successful referral! 💰 Join thousands of users already earning! 
          </span>
        </div>
      </div>

      {/* Live Feed Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 mb-4">
          <button className="flex-1 py-2 px-4 bg-primary/20 text-primary rounded-lg font-medium">
            IN/OUT
          </button>
          <button className="flex-1 py-2 px-4 bg-white/5 text-muted-foreground rounded-lg">
            GAIN
          </button>
          <button className="flex-1 py-2 px-4 bg-white/5 text-muted-foreground rounded-lg">
            LIVE
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {liveFeeds.inOut.map(renderFeedItem)}
        </div>
      </div>

      {/* Get Started Button */}
      <div className="text-center">
        <button
          onClick={handleGetStarted}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <span>{user ? t('dashboard') : 'Get Started'}</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="glass-card p-4 text-center">
          <DollarSign className="mx-auto mb-2 text-primary" size={32} />
          <h3 className="font-semibold mb-1">Easy Earning</h3>
          <p className="text-sm text-muted-foreground">Complete tasks and earn money</p>
        </div>
        
        <div className="glass-card p-4 text-center">
          <TrendingUp className="mx-auto mb-2 text-secondary" size={32} />
          <h3 className="font-semibold mb-1">Referral Bonus</h3>
          <p className="text-sm text-muted-foreground">Earn from your referrals</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage

