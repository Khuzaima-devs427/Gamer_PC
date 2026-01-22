"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    _id: string;
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    status: string; // Changed from 'active' | 'inactive' to string
    displayOrder: number;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Check if status is active (string comparison)
  const isActive = category.status === "active";
  
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Order Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
          #{category.displayOrder}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {category.title}
        </h3>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {category.subtitle}
        </p>
        
        {/* CTA Button */}
        <Link
          href={category.buttonLink}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 group/btn"
        >
          <span className="mr-2">{category.buttonText}</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Status Badge - FIXED: using string comparison */}
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
}