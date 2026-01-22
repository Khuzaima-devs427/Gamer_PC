"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Tag, 
  Flame, 
  TrendingUp, 
  CheckCircle, 
  Star, 
  Zap, 
  Shield,
  Truck,
  ArrowRight,
  ShoppingBag,
  Percent,
  ChevronRight,
  Heart,
  Eye
} from 'lucide-react';

interface Deal {
  id: number;
  title: string;
  description: string;
  discount: string;
  originalPrice: string;
  currentPrice: string;
  image: string;
  category: string;
  badge: string;
  timeLeft: string;
  rating: number;
  sold: number;
  features: string[];
}

const dealsData: Deal[] = [
  {
    id: 1,
    title: "Gaming PC Pro Bundle",
    description: "Complete gaming setup with monitor, keyboard, and mouse",
    discount: "70% OFF",
    originalPrice: "$2,499",
    currentPrice: "$749",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80",
    category: "Gaming",
    badge: "FLASH SALE",
    timeLeft: "23:59:59",
    rating: 4.8,
    sold: 124,
    features: ["RTX 4080", "32GB RAM", "2TB SSD", "240Hz Monitor"]
  },
  {
    id: 2,
    title: "Wireless Headset Pro",
    description: "Noise-canceling wireless headphones with 40h battery",
    discount: "50% OFF",
    originalPrice: "$299",
    currentPrice: "$149",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "Audio",
    badge: "LIMITED STOCK",
    timeLeft: "12:30:45",
    rating: 4.7,
    sold: 89,
    features: ["Noise Canceling", "40h Battery", "Wireless", "Hi-Res Audio"]
  },
  {
    id: 3,
    title: "Mechanical Keyboard RGB",
    description: "Mechanical gaming keyboard with customizable RGB lighting",
    discount: "45% OFF",
    originalPrice: "$199",
    currentPrice: "$109",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    badge: "HOT DEAL",
    timeLeft: "18:15:30",
    rating: 4.9,
    sold: 256,
    features: ["Cherry MX", "RGB Lighting", "USB-C", "Macro Keys"]
  },
  {
    id: 4,
    title: "4K Gaming Monitor",
    description: "27-inch 4K monitor with 144Hz refresh rate",
    discount: "60% OFF",
    originalPrice: "$899",
    currentPrice: "$359",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    category: "Monitors",
    badge: "WEEKLY DEAL",
    timeLeft: "48:00:00",
    rating: 4.6,
    sold: 67,
    features: ["4K UHD", "144Hz", "HDR", "FreeSync"]
  },
  {
    id: 5,
    title: "Gaming Chair Pro",
    description: "Ergonomic gaming chair with lumbar support",
    discount: "55% OFF",
    originalPrice: "$499",
    currentPrice: "$224",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    badge: "BEST SELLER",
    timeLeft: "36:45:20",
    rating: 4.8,
    sold: 312,
    features: ["Ergonomic", "Lumbar Support", "Adjustable", "PU Leather"]
  },
  {
    id: 6,
    title: "Gaming Mouse Wireless",
    description: "High-precision wireless gaming mouse",
    discount: "40% OFF",
    originalPrice: "$129",
    currentPrice: "$77",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    badge: "NEW",
    timeLeft: "24:30:15",
    rating: 4.5,
    sold: 189,
    features: ["16000 DPI", "Wireless", "RGB", "6 Buttons"]
  },
  {
    id: 7,
    title: "Streaming Webcam 4K",
    description: "4K webcam with ring light for streaming",
    discount: "65% OFF",
    originalPrice: "$249",
    currentPrice: "$87",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    category: "Streaming",
    badge: "FLASH SALE",
    timeLeft: "08:45:10",
    rating: 4.7,
    sold: 143,
    features: ["4K Video", "Ring Light", "Auto Focus", "Noise Reduction"]
  },
  {
    id: 8,
    title: "External SSD 2TB",
    description: "High-speed external SSD for gaming storage",
    discount: "35% OFF",
    originalPrice: "$299",
    currentPrice: "$194",
    image: "https://images.unsplash.com/photo-1593640495395-fd5aae8e77c1?auto=format&fit=crop&w=800&q=80",
    category: "Storage",
    badge: "LIMITED TIME",
    timeLeft: "60:00:00",
    rating: 4.9,
    sold: 421,
    features: ["2TB Storage", "1050MB/s", "USB-C", "Portable"]
  }
];

const categories = [
  { name: "All Deals", count: 32, icon: <Tag className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
  { name: "Flash Sale", count: 8, icon: <Zap className="w-4 h-4" />, color: "from-orange-500 to-red-500" },
  { name: "Today's Deals", count: 12, icon: <Clock className="w-4 h-4" />, color: "from-emerald-500 to-green-500" },
  { name: "Best Sellers", count: 15, icon: <TrendingUp className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
  { name: "Clearance", count: 7, icon: <Flame className="w-4 h-4" />, color: "from-amber-500 to-orange-500" },
  { name: "New Arrivals", count: 5, icon: <Star className="w-4 h-4" />, color: "from-indigo-500 to-blue-500" },
];

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Deals");
  const [sortBy, setSortBy] = useState("popular");
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const badgeColors: Record<string, string> = {
    "FLASH SALE": "bg-linear-to-r from-red-500 to-pink-600",
    "LIMITED STOCK": "bg-linear-to-r from-amber-500 to-orange-600",
    "HOT DEAL": "bg-linear-to-r from-orange-500 to-red-500",
    "WEEKLY DEAL": "bg-linear-to-r from-blue-500 to-cyan-600",
    "BEST SELLER": "bg-linear-to-r from-purple-500 to-pink-600",
    "NEW": "bg-linear-to-r from-emerald-500 to-teal-600",
    "LIMITED TIME": "bg-linear-to-r from-pink-500 to-rose-600",
  };

  const categoryColors: Record<string, string> = {
    "Gaming": "bg-linear-to-r from-blue-500 to-indigo-600 text-white",
    "Audio": "bg-linear-to-r from-purple-500 to-violet-600 text-white",
    "Accessories": "bg-linear-to-r from-green-500 to-emerald-600 text-white",
    "Monitors": "bg-linear-to-r from-amber-500 to-yellow-600 text-white",
    "Furniture": "bg-linear-to-r from-red-500 to-rose-600 text-white",
    "Streaming": "bg-linear-to-r from-pink-500 to-rose-600 text-white",
    "Storage": "bg-linear-to-r from-indigo-500 to-blue-600 text-white",
  };

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-blue-50">
      {/* Animated Hero Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-orange-500 via-red-500 to-pink-600 text-white py-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Flame className="w-6 h-6 animate-pulse" />
              <span className="font-semibold">LIMITED TIME OFFERS</span>
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-linear-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Hot Deals
              </span>{" "}
              <span className="block text-4xl md:text-6xl mt-2">Up to 70% OFF</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
              Discover incredible discounts on premium gaming gear, electronics, 
              and complete setups. Don't miss out on these limited-time offers!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-xl">
                <Shield className="w-5 h-5" />
                <span className="font-medium">30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-xl">
                <Truck className="w-5 h-5" />
                <span className="font-medium">Free Shipping Over $99</span>
              </div>
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-xl">
                <Tag className="w-5 h-5" />
                <span className="font-medium">Price Match Guarantee</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
      </div>

      {/* Timer Banner with Animation */}
      <div className="bg-linear-to-r from-gray-900 via-gray-800 to-black text-white py-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-red-500/20 to-transparent animate-shimmer"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="relative">
                <Clock className="w-8 h-8 text-red-400 animate-spin-slow" />
                <div className="absolute inset-0 border-2 border-red-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <div className="text-sm opacity-80">FLASH SALE ENDS IN</div>
                <div className="text-xl font-bold tracking-wider">23:59:59</div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {["23", "59", "59"].map((time, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-linear-to-b from-gray-800 to-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent"></div>
                    <div className="text-3xl font-bold">{time}</div>
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {["HOURS", "MINUTES", "SECONDS"][index]}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-4 md:mt-0 bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-red-500/30">
              VIEW ALL FLASH SALES
              <ChevronRight className="w-4 h-4 inline ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories with Gradient */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Categories</h2>
              <p className="text-gray-600">Find deals on your favorite gaming products</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                >
                  <option value="popular">🔥 Most Popular</option>
                  <option value="discount">💰 Highest Discount</option>
                  <option value="newest">🆕 Newest First</option>
                  <option value="price-low">⬇️ Price: Low to High</option>
                  <option value="price-high">⬆️ Price: High to Low</option>
                </select>
                <ChevronRight className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
              </div>
              <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-105 shadow-lg shadow-blue-500/30">
                Filter Results
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                  selectedCategory === category.name
                    ? `border-white shadow-2xl shadow-${category.color.split('-')[1]}-500/30`
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-${selectedCategory === category.name ? '100' : '0'} group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm mb-3 ${selectedCategory === category.name ? 'text-white' : 'text-gray-700'}`}>
                    {category.icon}
                  </div>
                  <div className={`font-semibold text-sm mb-1 ${selectedCategory === category.name ? 'text-white' : 'text-gray-800'}`}>
                    {category.name}
                  </div>
                  <div className={`text-xs ${selectedCategory === category.name ? 'text-white/80' : 'text-gray-500'}`}>
                    {category.count} items
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dealsData.map((deal) => (
            <div 
              key={deal.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 relative"
            >
              {/* Wishlist Button */}
              <button 
                onClick={() => toggleLike(deal.id)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
              >
                <Heart 
                  className={`w-5 h-5 ${likedItems.includes(deal.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </button>

              {/* Quick View Button */}
              <button className="absolute top-16 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg opacity-0 group-hover:opacity-100">
                <Eye className="w-5 h-5 text-gray-600" />
              </button>

              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${badgeColors[deal.badge]} text-white shadow-lg`}>
                    {deal.badge}
                  </span>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${categoryColors[deal.category]} shadow-lg`}>
                    {deal.category}
                  </span>
                </div>
                
                {/* Image */}
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Discount Overlay */}
                <div className="absolute top-0 right-0 bg-linear-to-br from-red-500 to-orange-500 text-white p-4 rounded-bl-2xl shadow-xl">
                  <div className="text-2xl font-bold leading-none">{deal.discount}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating & Sold */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(deal.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({deal.rating})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{deal.sold} sold</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {deal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                  {deal.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {deal.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 text-xs rounded-lg flex items-center gap-2 font-medium"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-3xl font-bold text-gray-900">{deal.currentPrice}</span>
                    <span className="text-lg text-gray-500 line-through">{deal.originalPrice}</span>
                    <span className="ml-auto px-3 py-1 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full">
                      Save ${(parseFloat(deal.originalPrice.replace('$', '')) - parseFloat(deal.currentPrice.replace('$', ''))).toFixed(0)}
                    </span>
                  </div>
                  
                  {/* Timer */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Ends in: </span>
                    <span className="font-bold text-red-500">{deal.timeLeft}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Sold: {deal.sold}</span>
                    <span className="font-medium">Limited stock!</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-green-400 via-emerald-500 to-green-600 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((deal.sold / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-linear-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group/btn">
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-5 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter with Gradient */}
        <div className="mt-24 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10 p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Zap className="w-8 h-8 text-yellow-300" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Never Miss a Deal!</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about exclusive offers, 
                flash sales, and new gaming arrivals. Get weekly deals delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                />
                <button className="px-8 py-4 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
                  Subscribe Now
                  <ChevronRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
              <p className="text-sm opacity-75 mt-6">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Shop With Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="w-10 h-10" />,
                title: "Free & Fast Shipping",
                description: "Free shipping on all orders over $99. Express delivery available.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: "30-Day Guarantee",
                description: "Not satisfied? Get a full refund within 30 days of purchase.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <Tag className="w-10 h-10" />,
                title: "Best Price Guarantee",
                description: "Found a better price? We'll match it and give you 10% extra.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-linear-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className={`w-16 h-16 bg-linear-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-center text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div className="mt-16 text-center">
          <button className="px-10 py-4 bg-linear-to-r from-gray-900 to-black text-white rounded-2xl font-bold hover:from-gray-800 hover:to-gray-900 transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-3">
            Load More Deals
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}