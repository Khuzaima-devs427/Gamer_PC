"use client";

import { useState, useEffect } from "react";
import CategoryCard from './category_card';

interface CategoryCardType {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(0);

  // Fetch category cards from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Use your API endpoint
        const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/category-cards/public/active`;
        
        console.log('🔄 Fetching category cards from:', apiEndpoint);
        
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
          // Sort by displayOrder
          const sortedCategories = data.data.sort((a: CategoryCardType, b: CategoryCardType) => 
            (a.displayOrder || 0) - (b.displayOrder || 0)
          );
          
          setCategories(sortedCategories);
          
          // Count active categories
          const activeCategories = sortedCategories.filter(
            (cat: CategoryCardType) => cat.status === 'active'
          );
          setActiveCount(activeCategories.length);
          
          console.log('✅ Category cards loaded:', sortedCategories.length);
        } else {
          setError('Failed to load category cards. Invalid response format.');
        }
      } catch (err: any) {
        console.error('❌ Error fetching category cards:', err);
        setError(`Failed to load category cards: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 rounded w-1/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto animate-pulse"></div>
          </div>
          
          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Categories</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-semibold mb-3">API Details:</h3>
              <div className="text-left bg-white p-4 rounded-lg font-mono text-sm">
                <p>Endpoint: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/category-cards/public/active</p>
                <p>Expected response format: {"{success: true, data: []}"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (categories.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">No Categories Found</h1>
            <p className="text-gray-600 mb-8">
              There are no category cards available at the moment.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="mb-4">Make sure your database has category cards with status: "active"</p>
              <div className="text-sm text-gray-600">
                <p>API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/category-cards/public/active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
           Explore Featured Categories
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
           Discover our top PC builds and must-have accessories
          </p>
          
          {/* Stats */}
          {/* <div className="flex justify-center items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-500">Total Categories</div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{activeCount}</div>
              <div className="text-sm text-gray-500">Active Categories</div>
            </div>
          </div> */}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category._id} 
              category={category} 
            />
          ))}
        </div>

        {/* Summary */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{activeCount}</span> active categories 
              out of <span className="font-semibold">{categories.length}</span> total
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Categories are sorted by display order
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}