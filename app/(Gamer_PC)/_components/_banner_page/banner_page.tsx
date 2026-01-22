"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star, ArrowRight } from "lucide-react";

interface HeroSlider {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  status: string;
  order?: number;
  displayOrder?: number;
  features?: string[];
  badgeText?: string;
  rating?: number;
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export default function HeroBanner() {
  const [sliders, setSliders] = useState<HeroSlider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch hero sliders from your backend
  useEffect(() => {
    const fetchHeroSliders = async () => {
      try {
        setLoading(true);
        
        const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/hero-slider/public/active`;
        
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Transform and filter data
          const transformedSliders = data.data.map((item: any) => ({
            _id: item._id,
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            image: item.image,
            buttonText: item.buttonText,
            buttonLink: item.buttonLink,
            status: item.status,
            order: item.displayOrder || item.order || 999,
            displayOrder: item.displayOrder,
            features: item.features || [],
            badgeText: item.badgeText,
            rating: item.rating,
            discountPercentage: item.discountPercentage,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));
          
          // Filter active sliders
          const activeSliders = transformedSliders.filter((slider: HeroSlider) => 
            slider.status === "active"
          );
          
          if (activeSliders.length === 0) {
            setSliders(transformedSliders.sort((a: HeroSlider, b: HeroSlider) => 
              (a.order || 999) - (b.order || 999)
            ));
            setError('No banners marked as active. Showing all banners.');
          } else {
            const sortedSliders = activeSliders.sort((a: HeroSlider, b: HeroSlider) => 
              (a.order || 999) - (b.order || 999)
            );
            setSliders(sortedSliders);
            setError(null);
          }
        } else {
          setError('Invalid API response format');
        }
      } catch (err: any) {
        console.error('Error fetching hero sliders:', err);
        setError(`Failed to load: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSliders();
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (sliders.length <= 1) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [sliders.length]);

  const handleNextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative h-100 md:h-112.5 bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/20"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <div className="h-10 bg-white/20 rounded-lg w-3/4 mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mb-6"></div>
            <div className="h-10 bg-white/20 rounded-lg w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  // No banners state
  if (sliders.length === 0 && !error) {
    return (
      <div className="relative h-100 md:h-112.5 bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/20"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl text-white text-center mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Welcome to Our Store
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed max-w-xl mx-auto">
              Discover amazing products and exclusive deals
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center group"
              >
                Start Shopping
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/categories"
                className="px-8 py-3 border-2 border-white/30 hover:bg-white hover:text-black text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSlider = sliders[currentSlide];

  return (
    <div className="relative overflow-hidden">
    

      {/* Main banner content */}
      {sliders.length > 0 && (
      <div className="relative h-112.5 md:h-125 lg:h-137.5 overflow-hidden">
          {/* Background Image */}
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${isAnimating ? 'scale-105 opacity-90' : 'scale-100 opacity-100'}`}
            style={{ 
              backgroundImage: `url(${currentSlider?.image})`,
            }}
          >
            {/* Gradient Overlays for better text readability */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
          
          {/* Content Container */}
          <div className="container mx-auto px-4 md:px-6 h-full relative z-20">
            <div className="h-full flex items-center">
              <div className="max-w-2xl lg:max-w-3xl text-white">
                {/* Badge */}
                {currentSlider?.badgeText && (
                  <div className="inline-block mb-4 animate-fade-in-up">
                    <span className="px-4 py-2 text-xs font-semibold bg-linear-to-r from-blue-600 to-purple-600 rounded-full shadow-lg inline-flex items-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
                      {currentSlider.badgeText}
                    </span>
                  </div>
                )}

                {/* Subtitle */}
                {currentSlider?.subtitle && (
                  <p className="text-sm md:text-base text-blue-300 font-medium mb-2 animate-fade-in-up delay-100">
                    {currentSlider.subtitle}
                  </p>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-fade-in-up delay-200">
                  <span className="bg-linear-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    {currentSlider?.title}
                  </span>
                </h1>

                {/* Features List - Compact design */}
                {currentSlider?.features && currentSlider.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up delay-300">
                    {currentSlider.features.slice(0, 4).map((feature, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs border border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        ✨ {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating and Discount - Compact design */}
                {(currentSlider?.rating || currentSlider?.discountPercentage) && (
                  <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up delay-400">
                    {currentSlider?.rating && (
                      <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <div className="flex mr-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(currentSlider.rating!) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'fill-gray-400/50 text-gray-400/50'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">
                          {currentSlider.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    
                    {currentSlider?.discountPercentage && (
                      <div className="px-3 py-1.5 bg-linear-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold shadow">
                        ⚡ -{currentSlider.discountPercentage}% OFF
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 animate-fade-in-up delay-500">
                  <Link
                    href={currentSlider?.buttonLink || "/products"}
                    className="group px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
                  >
                    <span className="mr-2">{currentSlider?.buttonText || "Shop Now"}</span>
                    <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    href="/products"
                    className="px-8 py-3 border-2 border-white/30 hover:bg-white hover:text-black text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
                  >
                    Browse All
                  </Link>
                </div>

                {/* Slide Indicators */}
                {sliders.length > 1 && (
                  <div className="flex items-center space-x-2 mt-6 animate-fade-in-up delay-600">
                    {sliders.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`group relative transition-all duration-200 ${
                          index === currentSlide ? 'scale-110' : ''
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      >
                        <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentSlide
                            ? 'bg-linear-to-r from-blue-500 to-purple-500 w-6'
                            : 'bg-white/50 hover:bg-white/80'
                        }`}></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {sliders.length > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-300 z-30 hover:scale-110 hover:shadow-lg group"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-300 z-30 hover:scale-110 hover:shadow-lg group"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}

          {/* Slide Counter - Only on desktop */}
          {/* <div className="hidden md:block absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentSlide + 1} / {sliders.length}
          </div> */}
        </div>
      )}
      
      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
}