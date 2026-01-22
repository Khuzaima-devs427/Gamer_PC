"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Filter, 
  ChevronDown, 
  MessageSquare,
  CheckCircle,
  Shield,
  ThumbsUp,
  Flag,
  Calendar,
  User,
  ShoppingBag,
  Package,
  Clock,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Award,
  Truck,
  ChevronRight,
  Mail,
  Lock,
  ShieldCheck,
  Upload,
  X,
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';

// Product Interface
interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  featuredOrder: number | null;
  featureCategory?: {
    _id: string;
    name: string;
    description?: string;
  };
  specifications?: Record<string, string>;
  stock?: number;
  brand?: string;
}

// Review Interface
interface Review {
  _id: string;
  userEmail: string;
  rating: number;
  title: string;
  content: string;
  images?: Array<{
    url: string;
    uploadedAt: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  reportCount: number;
  formattedDate: string;
  createdAt: string;
  userName?: string;
}

// Review Stats Interface
interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// User Interface (from localStorage or API)
interface UserData {
  email: string;
  name?: string;
  avatar?: string;
}

// Helper function to safely convert to number
const safeToNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

function ReviewPageContent() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'highest' | 'lowest'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'reviews' | 'specifications'>('reviews');

  // Helper function to render stars safely
  const renderStars = (rating: any, size: 'sm' | 'md' | 'lg' = 'md') => {
    const numericRating = safeToNumber(rating, 0);
    const clampedRating = Math.max(0, Math.min(5, numericRating));
    
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizes[size]} ${
              star <= clampedRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
        <span className={`ml-2 font-medium text-gray-700 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
          {clampedRating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Get user from localStorage or API
  useEffect(() => {
    const getUserData = () => {
      try {
        // Check localStorage first
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // In real app, fetch from API with token
          // For now, prompt user to enter email
          const email = prompt('Please enter your email to write a review:');
          if (email && email.includes('@')) {
            const newUser = { email, name: email.split('@')[0] };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
          }
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserData();
  }, []);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/featured-listings/${productId}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch product');
      
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      toast.error('Failed to load product details');
      setError(err.message);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reviews/listing/${productId}`
      );
      
      if (sortBy) {
        url.searchParams.set('sortBy', sortBy === 'helpful' ? 'helpfulVotes' : 'createdAt');
        url.searchParams.set('sortOrder', 'desc');
      }
      
      if (filterRating) {
        url.searchParams.set('minRating', filterRating.toString());
        url.searchParams.set('maxRating', filterRating.toString());
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      if (data.success) {
        setReviews(data.data.reviews || []);
        setStats(data.data.stats || null);
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      toast.error('Failed to load reviews');
    }
  };

  // Fetch review statistics
  const fetchReviewStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reviews/stats/${productId}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch review stats');
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching review stats:', err);
    }
  };

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProduct(),
          fetchReviews(),
          fetchReviewStats()
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadData();
    }
  }, [productId, sortBy, filterRating]);

  // Handle mark helpful
  const handleMarkHelpful = async (reviewId: string) => {
    if (!user) {
      toast.error('Please log in to mark reviews as helpful');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ userEmail: user.email }),
        }
      );

      if (response.ok) {
        toast.success('Marked as helpful!');
        fetchReviews();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to mark as helpful');
      }
    } catch (err) {
      toast.error('Failed to mark as helpful');
    }
  };

  // Handle report review
  const handleReportReview = async (reviewId: string) => {
    if (!user) {
      toast.error('Please log in to report reviews');
      return;
    }

    if (confirm('Are you sure you want to report this review?')) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reviews/${reviewId}/report`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              reason: 'Inappropriate content',
              userEmail: user.email 
            }),
          }
        );

        if (response.ok) {
          toast.success('Review reported. Thank you for keeping our community safe!');
        }
      } catch (err) {
        toast.error('Failed to report review');
      }
    }
  };

  // Handle write review button
  const handleWriteReview = () => {
    if (!user) {
      const email = prompt('Please enter your email to write a review:');
      if (email && email.includes('@')) {
        const newUser = { email, name: email.split('@')[0] };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setShowReviewForm(true);
      } else {
        toast.error('Please enter a valid email address');
      }
    } else {
      setShowReviewForm(true);
    }
  };

  // Submit review
  const handleSubmitReview = async (reviewData: any) => {
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...reviewData,
            listingId: productId,
            categoryId: product?.featureCategory?._id,
            userEmail: user.email,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast.success('🎉 Review submitted successfully! It will be visible after approval.');
        setShowReviewForm(false);
        fetchReviews();
        fetchReviewStats();
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Back button skeleton */}
          <div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse mb-8"></div>
          
          {/* Product skeleton */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-96 bg-gray-300 rounded-2xl animate-pulse"></div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <button
            onClick={() => router.back()}
            className="group flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
          
          <div className="bg-linear-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 bg-linear-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-3xl">😕</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {error ? 'Oops! Something went wrong' : 'Product Not Found'}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Go Back
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <div className="container mx-auto px-4 max-w-7xl py-6">
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </button>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pb-16">
        {/* Product Card */}
        <div className="bg-linear-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 mb-12 border border-gray-200/50">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image Section */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-125 rounded-2xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                      <ImageIcon className="w-24 h-24 text-gray-400 mb-4" />
                      <span className="text-gray-500 text-lg">No Image Available</span>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        Featured Product
                      </span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {product.featureCategory && (
                    <div className="absolute top-6 right-6">
                      <span className="px-4 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        {product.featureCategory.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Reviewing as</h4>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="font-medium">{user?.email || 'Not logged in'}</span>
                        {user && (
                          <ShieldCheck className="w-4 h-4 ml-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('user');
                      setUser(null);
                      toast.info('Logged out. Please enter your email to continue.');
                    }}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Change Account
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating Display */}
                <div className="flex items-center mb-6">
                  {renderStars(stats?.averageRating || 0, 'lg')}
                  <span className="ml-4 text-gray-500">
                    {stats?.totalReviews || 0} reviews
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center mb-8">
                  <DollarSign className="w-8 h-8 text-gray-400 mr-2" />
                  <span className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    £{product.price}
                  </span>
                  <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    Free Shipping
                  </span>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Category Info */}
                {product.featureCategory && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Category</h3>
                    <div className="inline-flex items-center px-4 py-3 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                      <Tag className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="font-medium text-gray-800">{product.featureCategory.name}</span>
                      {product.featureCategory.description && (
                        <span className="ml-4 text-gray-500 text-sm">
                          {product.featureCategory.description}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-800">1 Year Warranty</div>
                      <div className="text-sm text-gray-500">Full coverage</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200">
                    <Package className="w-6 h-6 text-blue-500 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-800">Original</div>
                      <div className="text-sm text-gray-500">Authentic product</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200">
                    <Shield className="w-6 h-6 text-purple-500 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-800">Secure</div>
                      <div className="text-sm text-gray-500">Safe payments</div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200">
                    <Truck className="w-6 h-6 text-orange-500 mr-3" />
                    <div>
                      <div className="font-semibold text-gray-800">Fast Delivery</div>
                      <div className="text-sm text-gray-500">2-3 business days</div>
                    </div>
                  </div>
                </div>

                {/* Review Button */}
                <button
                  onClick={handleWriteReview}
                  className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center text-lg group"
                >
                  <MessageSquare className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Write Your Review
                </button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Share your experience with this product
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 text-lg font-medium transition-all ${
                activeTab === 'reviews'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-5 h-5 inline mr-2" />
              Customer Reviews ({stats?.totalReviews || 0})
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-8 py-4 text-lg font-medium transition-all ${
                activeTab === 'specifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Specifications
            </button>
          </div>
        </div>

        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50">
            {/* Reviews Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Customer Reviews</h2>
                <div className="flex items-center">
                  <div className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mr-4">
                    {stats?.averageRating ? safeToNumber(stats.averageRating).toFixed(1) : '0.0'}
                  </div>
                  <div>
                    {renderStars(stats?.averageRating || 0, 'lg')}
                    <p className="text-gray-600 mt-2">
                      Based on {stats?.totalReviews || 0} verified reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Sort & Filter */}
              <div className="flex gap-4 mt-6 lg:mt-0">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    <option value="newest">Newest First</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select
                    value={filterRating || ''}
                    onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">★★★★★ 5 Stars</option>
                    <option value="4">★★★★☆ 4 Stars</option>
                    <option value="3">★★★☆☆ 3 Stars</option>
                    <option value="2">★★☆☆☆ 2 Stars</option>
                    <option value="1">★☆☆☆☆ 1 Star</option>
                  </select>
                  <Filter className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            {stats && stats.totalReviews > 0 && (
              <div className="mb-12 p-8 bg-linear-to-r from-blue-50/50 to-purple-50/50 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Rating Breakdown</h3>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = safeToNumber(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]);
                    const percentage = stats.totalReviews > 0 
                      ? (count / stats.totalReviews) * 100 
                      : 0;
                    
                    return (
                      <div key={rating} className="flex items-center">
                        <div className="w-20 text-sm font-medium text-gray-700">{rating} ★</div>
                        <div className="flex-1 mx-6">
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-lg font-bold text-gray-900">{count}</span>
                          <span className="text-gray-500 ml-1">({percentage.toFixed(0)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-8">
              {reviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-linear-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Reviews Yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Be the first to share your experience with this product!
                  </p>
                  <button
                    onClick={handleWriteReview}
                    className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center"
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    Be the First Reviewer
                  </button>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="group border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300 bg-white"
                  >
                    {/* Review Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 ${
                                  star <= safeToNumber(review.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-4 text-xl font-bold text-gray-900">
                            {review.title}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-gray-500">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {review.userName || review.userEmail.split('@')[0]}
                              </div>
                              <div className="text-sm flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {review.userEmail}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {review.formattedDate}
                          </div>
                          
                          {review.isVerifiedPurchase && (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Helpful Count */}
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <div className="text-lg font-bold text-gray-900">
                          {review.helpfulVotes}
                        </div>
                        <div className="text-sm text-gray-500">Helpful votes</div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-8">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {review.content}
                      </p>
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-4 mb-8 flex-wrap">
                        {review.images.slice(0, 4).map((img, index) => (
                          <div
                            key={index}
                            className="relative w-32 h-32 rounded-xl overflow-hidden cursor-pointer group/img"
                            onClick={() => window.open(img.url, '_blank')}
                          >
                            <img
                              src={img.url}
                              alt={`Review ${index + 1}`}
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all duration-300"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                      <button
                        onClick={() => handleMarkHelpful(review._id)}
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group/helpful"
                        disabled={!user}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover/helpful:bg-blue-50 flex items-center justify-center mr-3 transition-colors">
                          <ThumbsUp className="w-5 h-5 group-hover/helpful:scale-110 transition-transform" />
                        </div>
                        <div>
                          <div className="font-medium">Helpful</div>
                          <div className="text-sm text-gray-500">Click if this review helped you</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handleReportReview(review._id)}
                        className="flex items-center text-gray-600 hover:text-red-600 transition-colors group/report"
                        disabled={!user}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover/report:bg-red-50 flex items-center justify-center mr-3 transition-colors">
                          <Flag className="w-5 h-5 group-hover/report:scale-110 transition-transform" />
                        </div>
                        <div>
                          <div className="font-medium">Report</div>
                          <div className="text-sm text-gray-500">Inappropriate content</div>
                        </div>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Specifications Tab Content */}
        {activeTab === 'specifications' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Product Specifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-6 bg-linear-to-r from-blue-50 to-blue-100/50 rounded-2xl">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-3 text-blue-500" />
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Product Name</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    {product.featureCategory && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium">{product.featureCategory.name}</span>
                      </div>
                    )}
                    {product.brand && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium">{product.brand}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-medium ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.status === 'active' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-linear-to-r from-purple-50 to-purple-100/50 rounded-2xl">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-purple-500" />
                    Pricing & Warranty
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Price</span>
                      <span className="font-bold text-lg text-blue-600">£{product.price}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Warranty</span>
                      <span className="font-medium text-green-600">1 Year</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Featured</span>
                      <span className={`font-medium ${product.isFeatured ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {product.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewFormModal
          productName={product.name}
          productImage={product.image}
          userEmail={user?.email}
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}

// Review Form Modal Component
function ReviewFormModal({ 
  productName, 
  productImage, 
  userEmail,
  onSubmit, 
  onClose 
}: { 
  productName: string;
  productImage: string;
  userEmail?: string;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!userEmail) {
      toast.error('Please log in to submit a review');
      return;
    }

    setSubmitting(true);

    try {
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        })
      );

      await onSubmit({
        rating,
        title,
        content,
        images: imageUrls.map(url => ({ url })),
        isVerifiedPurchase,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Write Your Review</h2>
              <p className="text-gray-600">Share your experience with {productName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Product Preview */}
          <div className="flex items-center p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl mb-8">
            <div className="w-20 h-20 rounded-xl overflow-hidden mr-6">
              {productImage ? (
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{productName}</h3>
              <div className="flex items-center mt-2">
                <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Reviewing as</div>
                  <div className="text-gray-600">{userEmail}</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-10">
              <label className="block text-gray-800 font-bold text-lg mb-6">
                Overall Rating *
              </label>
              <div className="flex justify-center gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-2 transform hover:scale-110 transition-transform duration-200"
                  >
                    <Star
                      className={`w-16 h-16 transition-all ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-lg text-gray-600 font-medium">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8">
              <label className="block text-gray-800 font-bold mb-4">
                Review Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Summarize your experience in a few words"
                maxLength={100}
                required
              />
            </div>

            {/* Content */}
            <div className="mb-8">
              <label className="block text-gray-800 font-bold mb-4">
                Your Review *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg h-48 resize-none"
                placeholder="Tell us about your experience with this product. What did you like or dislike? How does it perform?"
                minLength={10}
                maxLength={1000}
                required
              />
              <div className="text-right text-gray-500 mt-2">
                {content.length}/1000 characters
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-10">
              <label className="block text-gray-800 font-bold mb-4">
                <Upload className="w-5 h-5 inline mr-2" />
                Add Photos (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="border-3 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all h-32">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <span className="text-gray-500 font-medium">Add Image</span>
                  </label>
                )}
              </div>
              <p className="text-gray-500">Upload up to 5 images to show your experience</p>
            </div>

            {/* Verified Purchase */}
            <div className="mb-10">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isVerifiedPurchase}
                    onChange={(e) => setIsVerifiedPurchase(e.target.checked)}
                    className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-800">I purchased this product</div>
                  <div className="text-gray-600">Checking this adds a "Verified Purchase" badge to your review</div>
                </div>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-lg font-bold"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-lg font-bold disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense
export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ReviewPageContent />
    </Suspense>
  );
}