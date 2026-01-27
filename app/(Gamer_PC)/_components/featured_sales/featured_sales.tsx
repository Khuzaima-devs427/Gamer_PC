'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Timer,
  ChevronRight,
  Tag,
  Clock,
  Flame,
  TrendingUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ShoppingBag,
  Percent,
  Zap,
  Star,
  Shield,
  BadgeCheck,
  Gift
} from 'lucide-react';

// Define TypeScript interfaces matching your Mongoose model
interface FeaturedSale {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-64 sm:h-96 bg-linear-to-r from-gray-200 to-gray-300" />
        
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="h-64 sm:h-96 rounded-2xl bg-linear-to-r from-gray-200 to-gray-300" />
        </div>
      </div>
    </div>
  );
}

// Main Featured Sales Page Component
export default function FeaturedSalesPage() {
  const [sales, setSales] = useState<FeaturedSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSaleIndex, setCurrentSaleIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real data from your API - UPDATED VERSION
  const fetchSalesData = async () => {
    try {
      const API_BASE_URL = 'http://localhost:5000';
      
      console.log('Fetching from:', `${API_BASE_URL}/api/featured-sales/public/active`);
      
      const response = await fetch(`${API_BASE_URL}/api/featured-sales/public/active`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Full API response:', result);
      
      // Extract the data array from the response object
      let salesData: any[] = [];
      
      if (result.success && Array.isArray(result.data)) {
        console.log('✅ Data array received:', result.data);
        console.log('📊 Number of items:', result.data.length);
        if (result.data.length > 0) {
          console.log('🔍 First item structure:', Object.keys(result.data[0]));
          console.log('🔍 First item status:', result.data[0].status);
        }
        salesData = result.data;
      } else if (Array.isArray(result)) {
        console.log('✅ Array received (legacy format):', result);
        salesData = result;
      } else {
        console.error('❌ Unexpected response format:', result);
        throw new Error(`Invalid response format: Expected array in data property. Got: ${JSON.stringify(result)}`);
      }
      
      // Validate and transform data
      const validatedSales: FeaturedSale[] = salesData.map((sale: any, index: number) => ({
        _id: sale._id || `temp-${index}`,
        image: sale.image || '',
        title: sale.title || `Featured Sale ${index + 1}`,
        subtitle: sale.subtitle || 'Limited time offer',
        buttonText: sale.buttonText || 'Shop Now',
        buttonLink: sale.buttonLink || '#',
        status: ((sale.status === 'active' || sale.status === 'inactive') ? sale.status : 'active') as 'active' | 'inactive',
        displayOrder: typeof sale.displayOrder === 'number' ? sale.displayOrder : index + 1,
        createdAt: sale.createdAt || new Date().toISOString(),
        updatedAt: sale.updatedAt || new Date().toISOString()
      }));
      
      console.log('✅ Validated sales data:', validatedSales);
      console.log('✅ Validated sales count:', validatedSales.length);
      
      // Set the state with validated data
      setSales(validatedSales);
      setCurrentSaleIndex(0);
      setError(null);
    } catch (err: any) {
      console.error('❌ Error fetching featured sales:', err);
      setError(`Failed to load featured sales: ${err.message || 'Unknown error'}. Please check your API endpoint.`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSalesData();
  };

  const currentSale = sales[currentSaleIndex] || null;

  // Navigation functions
  const goToNextSale = () => {
    if (sales.length > 0) {
      setCurrentSaleIndex((prev) => (prev + 1) % sales.length);
    }
  };

  const goToPrevSale = () => {
    if (sales.length > 0) {
      setCurrentSaleIndex((prev) => (prev - 1 + sales.length) % sales.length);
    }
  };

  if (loading && !isRefreshing) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-white">
      {/* Background Decorative Elements */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-linear-to-r from-purple-200 to-pink-200 blur-3xl opacity-20 sm:opacity-30" />
        <div className="absolute -bottom-40 -left-40 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-linear-to-r from-blue-200 to-cyan-200 blur-3xl opacity-20 sm:opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 sm:h-96 sm:w-96 rounded-full bg-linear-to-r from-yellow-100 to-orange-100 blur-3xl opacity-10 sm:opacity-20" />
      </div> */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-linear-to-r from-purple-200 to-pink-200 blur-3xl opacity-20 sm:opacity-30" />
        <div className="absolute -bottom-40 -left-40 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-linear-to-r from-blue-200 to-cyan-200 blur-3xl opacity-20 sm:opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 sm:h-96 sm:w-96 rounded-full bg-linear-to-r from-yellow-100 to-orange-100 blur-3xl opacity-10 sm:opacity-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header - Responsive */}
        <div className="border-b border-gray-200 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-blue-600">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Featured Sales</h1>
                  <p className="text-xs sm:text-sm text-gray-600">Exclusive deals just for you</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2 rounded-full bg-gray-100 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50 w-full sm:w-auto"
                >
                  <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                
                <div className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-green-500 to-emerald-500 px-3 py-2 sm:px-4">
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {sales.length} Active Deals
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message - Responsive */}
        {error && (
          <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <div className="rounded-xl sm:rounded-2xl bg-linear-to-r from-red-50 to-pink-50 p-4 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-red-800">Unable to Load Data</h3>
                  <p className="text-sm sm:text-base text-red-600">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="rounded-full bg-linear-to-r from-red-500 to-pink-500 px-4 py-2 sm:px-6 sm:py-3 font-semibold text-white transition-all hover:shadow-lg w-full sm:w-auto mt-2 sm:mt-0"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Sales Message - Responsive */}
        {sales.length === 0 && !error ? (
          <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
            <div className="rounded-xl sm:rounded-2xl bg-linear-to-br from-white to-gray-50 p-6 sm:p-12 text-center shadow-xl sm:shadow-2xl">
              <div className="mx-auto mb-6 sm:mb-8 h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-linear-to-r from-gray-200 to-gray-300 p-4 sm:p-6">
                <ShoppingBag className="h-full w-full text-gray-400" />
              </div>
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-3xl font-bold text-gray-800">No Featured Sales Available</h2>
              <p className="mb-6 sm:mb-8 text-sm sm:text-lg text-gray-600">
                Check back soon for exciting new deals and promotions!
              </p>
              <button
                onClick={handleRefresh}
                className="rounded-full bg-linear-to-r from-purple-600 to-blue-600 px-6 py-2.5 sm:px-8 sm:py-3 font-semibold text-white transition-all hover:shadow-xl w-full sm:w-auto"
              >
                Check Again
              </button>
            </div>
          </div>
        ) : currentSale && (
          <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 lg:py-16">
            {/* Sale Counter and Navigation - Responsive */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-blue-600">
                  <span className="text-xs sm:text-sm font-bold text-white">{currentSaleIndex + 1}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  Deal {currentSaleIndex + 1} of {sales.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Featured Deal</span>
              </div>
              
              {sales.length > 1 && (
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={goToPrevSale}
                    disabled={sales.length <= 1}
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white shadow-sm sm:shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                  </button>
                  
                  <button
                    onClick={goToNextSale}
                    disabled={sales.length <= 1}
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white shadow-sm sm:shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Main Content Card - Responsive */}
            <div className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-linear-to-br from-white to-gray-50 shadow-lg sm:shadow-xl lg:shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Image */}
                <div className="relative h-64 sm:h-80 md:h-96 lg:min-h-150 order-2 lg:order-1">
                  {currentSale.image ? (
                    <>
                      <Image
                        src={currentSale.image}
                        alt={currentSale.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority
                        unoptimized={currentSale.image.includes('cloudinary')}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent lg:bg-linear-to-r lg:from-black/30 lg:via-transparent lg:to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-purple-500 to-blue-500">
                      <div className="text-center">
                        <ShoppingBag className="mx-auto h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-white/80" />
                        <p className="mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg font-semibold text-white/90">Featured Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Badges on Image - Responsive */}
                  <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-20">
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-linear-to-r from-green-500 to-emerald-500 px-3 py-1.5 sm:px-4 sm:py-2 shadow-md sm:shadow-lg">
                        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-pulse rounded-full bg-white" />
                        <span className="text-[10px] sm:text-xs font-bold text-white uppercase">Live Now</span>
                      </div>
                      
                      <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-linear-to-r from-yellow-500 to-orange-500 px-3 py-1.5 sm:px-4 sm:py-2 shadow-md sm:shadow-lg">
                        <Percent className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                        <span className="text-[10px] sm:text-xs font-bold text-white uppercase">Special Offer</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Content - Responsive */}
                <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 order-1 lg:order-2">
                  {/* Header */}
                  <div className="mb-6 sm:mb-8">
                    <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-linear-to-r from-purple-100 to-blue-100 px-3 py-1.5 sm:px-4 sm:py-2">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                      <span className="text-xs sm:text-sm font-semibold text-purple-700">Exclusive Deal</span>
                    </div>
                    
                    <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900">
                      {currentSale.title || 'Special Offer'}
                    </h1>
                    
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">
                      {currentSale.subtitle || 'Limited time offer - Don&apos;t miss out!'}
                    </p>
                  </div>

                  {/* Features - Responsive Grid */}
                  <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-r from-green-50 to-emerald-50 p-3 sm:p-4">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-100">
                        <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-green-800">Premium Quality</p>
                        <p className="text-xs sm:text-sm text-green-600">Guaranteed satisfaction</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-r from-blue-50 to-cyan-50 p-3 sm:p-4">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-100">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-blue-800">Secure Purchase</p>
                        <p className="text-xs sm:text-sm text-blue-600">Protected transactions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-r from-purple-50 to-pink-50 p-3 sm:p-4">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-purple-100">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-purple-800">Fast Delivery</p>
                        <p className="text-xs sm:text-sm text-purple-600">Express shipping available</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-linear-to-r from-orange-50 to-yellow-50 p-3 sm:p-4">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-100">
                        <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-orange-800">Free Gift</p>
                        <p className="text-xs sm:text-sm text-orange-600">With every purchase</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section - Responsive */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <p className="mb-3 sm:mb-4 text-sm sm:text-base md:text-lg font-medium text-gray-700">
                        Ready to grab this amazing deal?
                      </p>
                      <Link
                        href="/Gamer_PC/deals"
                        className="group inline-flex w-full items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-linear-to-r from-purple-600 to-blue-600 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl sm:hover:shadow-2xl"
                      >
                        <span>{currentSale.buttonText || 'Shop Now'}</span>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1 sm:group-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deal Progress - Responsive */}
            {sales.length > 1 && (
              <div className="mt-6 sm:mt-8">
                <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">More Amazing Deals</h3>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Showing {currentSaleIndex + 1} of {sales.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: Math.min(5, sales.length) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSaleIndex(index)}
                      className={`h-1.5 sm:h-2 flex-1 rounded-full transition-all ${
                        index === currentSaleIndex
                          ? 'bg-linear-to-r from-purple-600 to-blue-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}