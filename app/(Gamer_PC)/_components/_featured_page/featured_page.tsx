"use client";

import { useState, useEffect } from "react";
import { Filter, Check, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface FeatureCategory {
  _id: string;
  name: string;
  description?: string;
  type?: string;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  featuredOrder: number | null;
}

interface FeatureListing {
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
  };
}

export default function FeaturedPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [listings, setListings] = useState<FeatureListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<FeatureListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [compareList, setCompareList] = useState<string[]>([]);

  // Fetch featured categories
  const fetchFeaturedCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/feature-categories/featured`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        const sortedCategories = data.data.sort((a: FeatureCategory, b: FeatureCategory) => 
          (a.featuredOrder || 999) - (b.featuredOrder || 999)
        );
        setCategories(sortedCategories);
        
        // Select first category by default if available
        if (sortedCategories.length > 0) {
          setSelectedCategory(sortedCategories[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch featured listings
  const fetchFeaturedListings = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/featured-listings/featured`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        const sortedListings = data.data.sort((a: FeatureListing, b: FeatureListing) => 
          (a.featuredOrder || 999) - (b.featuredOrder || 999)
        );
        setListings(sortedListings);
        setFilteredListings(sortedListings);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  };


  
  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchFeaturedCategories(),
          fetchFeaturedListings()
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter listings by selected category
  useEffect(() => {
    if (!selectedCategory) {
      // If no category selected, show all featured listings
      setFilteredListings(listings);
    } else {
      // Filter by selected category
      const filtered = listings.filter(listing => 
        listing.featureCategory?._id === selectedCategory
      );
      setFilteredListings(filtered);
    }
  }, [selectedCategory, listings]);

  // Handle compare toggle
  const handleCompareToggle = (listingId: string) => {
    setCompareList(prev => {
      if (prev.includes(listingId)) {
        return prev.filter(id => id !== listingId);
      } else {
        // Limit to 4 items for comparison
        if (prev.length >= 4) {
          toast.error("You can compare up to 4 items only");
          return prev;
        }
        return [...prev, listingId];
      }
    });
  };

// Add this function after your other handlers
const handleCardClick = (listingId: string) => {
  // Navigate to your reviews page
  router.push(`/Gamer_PC/reviews/${listingId}`);
  
};

  

  // Get selected category name
//   const getSelectedCategoryName = () => {
//     if (!selectedCategory) return "All Featured Products";
//     const category = categories.find(c => c._id === selectedCategory);
//     return category?.name || "Selected Category";
//   };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-6 animate-pulse"></div>
          </div>
          
          {/* Category Nav Skeleton */}
          <div className="flex justify-center mb-8 flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
            ))}
          </div>
          
          {/* Products Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Featured Content</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Featured Items
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our top gaming gear and high-performance hardware
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>

        {/* Category Navigation - Only Featured Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No featured categories available
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-16 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === category._id
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                {category.isFeatured && selectedCategory !== category._id && (
                  <Star className="w-4 h-4 text-yellow-500" />
                )}
              </button>
            ))
          )}
        </div>



        {/* Products Grid - Only Featured Listings */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No featured products found {selectedCategory ? 'in this category' : ''}
            </div>
            {categories.length > 0 && (
              <div className="mt-4 flex justify-center gap-3">
                {categories.map(category => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
            //  onClick={() => handleCardClick(listing._id)}
              >
                
                {/* Compare Checkbox */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div >
                 
                    {listing.featureCategory && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {listing.featureCategory.name}
                      </span>
                    )}
                  </div>
                  {listing.isFeatured && (
                    <div className="flex items-center bg-linear-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Image from Database */}
                <div className="relative h-64 overflow-hidden bg-gray-100"
                onClick={() => router.push(`/Gamer_PC/reviews/${listing._id}`)}
                >
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x300/1a202c/ffffff?text=${encodeURIComponent(listing.name)}`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
                      <div className="text-center">
                        <div className="text-gray-400 text-lg">No Image</div>
                        <div className="text-gray-500 text-sm mt-2">{listing.name}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Price Badge on Image */}
                  <div className="absolute bottom-3 right-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                    £{listing.price}
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  {/* Product Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3"
                  onClick={() => router.push(`/Gamer_PC/reviews/${listing._id}`)}
                  >
                    {listing.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-3 line-clamp-3"
                  onClick={() => router.push(`/Gamer_PC/reviews/${listing._id}`)}
                  >
                    {listing.description}
                  </p>

                  {/* Warranty Info */}
                  <div className="mb-5">
                    <div className="text-[13px] text-gray-500"
                    onClick={() => router.push(`/Gamer_PC/reviews/${listing._id}`)}
                    >WITH FREE 1 YEAR WARRANTY</div>
                  </div>

                  {/* Add to Cart Button */}
                  <div>
                    <button
                      onClick={() => {
                        toast.success(`Added ${listing.name} to cart!`);
                      }}
                      className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>

                
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-blue-600 font-bold text-lg mb-2">Premium Hardware</div>
              <p className="text-gray-600 text-sm">Only top-tier components selected</p>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-bold text-lg mb-2">Warranty Included</div>
              <p className="text-gray-600 text-sm">Comprehensive warranty on all products</p>
            </div>
            <div className="text-center">
              <div className="text-purple-600 font-bold text-lg mb-2">Featured Selection</div>
              <p className="text-gray-600 text-sm">Curated collection of best products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}