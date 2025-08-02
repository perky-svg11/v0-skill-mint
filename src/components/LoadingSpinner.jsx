import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-primary" />
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="mobile-container flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={48} className="mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export const ShimmerCard = ({ className = '' }) => {
  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="shimmer h-4 w-3/4 mb-2 rounded"></div>
      <div className="shimmer h-3 w-1/2 mb-3 rounded"></div>
      <div className="shimmer h-8 w-full rounded"></div>
    </div>
  )
}

export default LoadingSpinner

