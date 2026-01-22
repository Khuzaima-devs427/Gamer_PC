"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight, Clock, Heart, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
  likes: number;
  comments: number;
}

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [cardSliderIndex, setCardSliderIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Use ref to prevent duplicate toasts
  const toastIdRef = useRef<string | number | null>(null);

  // Static blog data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of Gaming PCs in 2024",
      excerpt: "Discover the latest trends in gaming hardware and what to expect from next-gen gaming PCs.",
      content: "Full content about gaming PCs...",
      author: "Alex Johnson",
      date: "2024-03-15",
      readTime: "5 min read",
      category: "Gaming",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
      tags: ["Gaming", "Hardware", "PC"],
      likes: 124,
      comments: 23
    },
    {
      id: 2,
      title: "Building Your First Custom PC: A Beginner's Guide",
      excerpt: "Step-by-step guide to building your first custom gaming PC without breaking the bank.",
      content: "Full guide content...",
      author: "Sarah Miller",
      date: "2024-03-10",
      readTime: "8 min read",
      category: "Tutorial",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop",
      tags: ["Tutorial", "Build Guide", "Beginners"],
      likes: 89,
      comments: 15
    },
    {
      id: 3,
      title: "Top 10 Graphics Cards for 2024",
      excerpt: "We compare the best graphics cards on the market for gaming and professional work.",
      content: "Graphics card comparisons...",
      author: "Mike Chen",
      date: "2024-03-05",
      readTime: "6 min read",
      category: "Hardware",
      image: "https://images.unsplash.com/photo-1591485423037-8b8c7235a7d3?w=600&h=400&fit=crop",
      tags: ["Graphics", "Comparison", "Review"],
      likes: 156,
      comments: 34
    },
    {
      id: 4,
      title: "The Rise of Mini PCs for Gaming",
      excerpt: "How mini PCs are becoming powerful enough for serious gaming and what to look for.",
      content: "Mini PC gaming content...",
      author: "Emma Davis",
      date: "2024-02-28",
      readTime: "4 min read",
      category: "Gaming",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
      tags: ["Mini PC", "Portable", "Gaming"],
      likes: 67,
      comments: 12
    },
    {
      id: 5,
      title: "Cooling Solutions for High-End PCs",
      excerpt: "Exploring different cooling methods to keep your high-performance PC running optimally.",
      content: "Cooling solutions content...",
      author: "Robert Kim",
      date: "2024-02-20",
      readTime: "7 min read",
      category: "Hardware",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      tags: ["Cooling", "Performance", "Hardware"],
      likes: 92,
      comments: 18
    },
    {
      id: 6,
      title: "Laptops vs Desktops for Professional Gamers",
      excerpt: "A detailed comparison of gaming laptops and desktops for professional esports players.",
      content: "Comparison content...",
      author: "Lisa Wang",
      date: "2024-02-15",
      readTime: "9 min read",
      category: "Comparison",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop",
      tags: ["Laptops", "Desktops", "Esports"],
      likes: 145,
      comments: 29
    },
    {
      id: 7,
      title: "RGB Lighting: More Than Just Aesthetics",
      excerpt: "How RGB lighting can improve your gaming experience and system monitoring.",
      content: "RGB lighting content...",
      author: "Tom Harris",
      date: "2024-02-10",
      readTime: "5 min read",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      tags: ["RGB", "Aesthetics", "Setup"],
      likes: 78,
      comments: 14
    },
    {
      id: 8,
      title: "Best Budget Gaming PCs Under £1000",
      excerpt: "Top picks for gaming PCs that deliver great performance without breaking the bank.",
      content: "Budget PC content...",
      author: "David Lee",
      date: "2024-02-05",
      readTime: "6 min read",
      category: "Budget",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=400&fit=crop",
      tags: ["Budget", "Value", "Gaming"],
      likes: 203,
      comments: 42
    }
  ];

  // Categories
  const categories = ["All", "Gaming", "Hardware", "Tutorial", "Comparison", "Budget", "Accessories"];

  // Filter posts by category
  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Card slider configuration
  const cardsPerSlide = 3;
  const totalCardSlides = Math.ceil(filteredPosts.length / cardsPerSlide);

  // Get cards for current slide
  const getCurrentSlideCards = () => {
    const startIndex = cardSliderIndex * cardsPerSlide;
    const endIndex = startIndex + cardsPerSlide;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // Fixed handleLike function - toast moved outside setState
  const handleLike = (postId: number) => {
    const isCurrentlyLiked = likedPosts.includes(postId);
    
    // Show toast first
    if (isCurrentlyLiked) {
      // Dismiss any existing toast
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      toastIdRef.current = toast.info("Post unliked");
    } else {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      toastIdRef.current = toast.success("Post liked!");
    }
    
    // Update state
    setLikedPosts(prev => {
      if (isCurrentlyLiked) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  // Handle share
  const handleShare = (post: BlogPost) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Card slider functions
  const nextCardSlide = () => {
    setCardSliderIndex(prev => (prev === totalCardSlides - 1 ? 0 : prev + 1));
  };

  const prevCardSlide = () => {
    setCardSliderIndex(prev => (prev === 0 ? totalCardSlides - 1 : prev - 1));
  };

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto slide for cards
  useEffect(() => {
    const interval = setInterval(() => {
      nextCardSlide();
    }, 3000); // Auto slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [cardSliderIndex]);

  // Fix CSS class names (changed from bg-linear-* to bg-gradient-*)
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Latest Blogs
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Latest news, reviews, and guides on gaming PCs, hardware, and technology
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setCardSliderIndex(0);
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Cards Slider */}
        <div className="mb-12 relative">
          {/* Slider Container */}
          <div className="relative">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getCurrentSlideCards().map((post) => (
                <div key={post.id} className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      {/* Like and Share */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-sm">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                        </button>
                        <button
                          onClick={() => handleShare(post)}
                          className="text-gray-600 hover:text-blue-500 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500">{post.comments} comments</span>
                      </div>

                      {/* Read More */}
                      <button className="flex items-center text-blue-600 font-medium group">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation Buttons */}
            <button
              onClick={prevCardSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-6 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextCardSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-6 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Slider Dots */}
          {totalCardSlides > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalCardSlides }, (_, i) => i).map((index) => (
                <button
                  key={index}
                  onClick={() => setCardSliderIndex(index)}
                  className={`w-8 h-2 rounded-full transition-all ${
                    index === cardSliderIndex 
                      ? 'bg-linear-to-r from-blue-600 to-purple-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          <div className="text-center mt-4 text-gray-600">
            <span className="font-medium">Slide {cardSliderIndex + 1} of {totalCardSlides}</span>
            <span className="mx-2">•</span>
            <span>Showing {getCurrentSlideCards().length} of {filteredPosts.length} posts</span>
          </div>
        </div>     
      </div>
    </div>
  );
}