"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Announcement {
  _id: string;
  announcement: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AnnouncementBar: Component mounted');
    fetchActiveAnnouncement();
  }, []);

  const fetchActiveAnnouncement = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/announcement-bar/active`;
      console.log('AnnouncementBar: Fetching from', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('AnnouncementBar: Response status', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('AnnouncementBar: Data received', data);
        
        if (data.success && data.data) {
          console.log('AnnouncementBar: Setting announcement', data.data);
          setAnnouncement(data.data);
        } else {
          console.log('AnnouncementBar: No announcement found');
        }
      } else {
        console.error('AnnouncementBar: API error', response.status);
      }
    } catch (error) {
      console.error('AnnouncementBar: Fetch error', error);
    } finally {
      console.log('AnnouncementBar: Loading complete');
      setLoading(false);
    }
  };

  // Add this to debug what's happening
  console.log('AnnouncementBar Render State:', { 
    loading, 
    hasAnnouncement: !!announcement,
    announcementText: announcement?.announcement 
  });

  if (loading) {
    console.log('AnnouncementBar: Still loading');
    return null;
  }
  
  if (!announcement) {
    console.log('AnnouncementBar: No announcement to show');
    return null;
  }

  // Simple link extraction
  const text = announcement.announcement;
  let displayText = text;
  let linkUrl: string | null = null;
  let linkText = 'Shop Now';

  // Check if there's a link in the format [text](url)
  const linkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (linkMatch) {
    linkText = linkMatch[1];
    linkUrl = linkMatch[2];
    displayText = text.replace(linkMatch[0], '').trim();
  }

  // Check if it's a sale
  const isSale = text.toLowerCase().includes('sale') || 
                 text.toLowerCase().includes('discount') || 
                 text.toLowerCase().includes('%');

  console.log('AnnouncementBar: Rendering with', { displayText, linkUrl, isSale });

  return (
    <div 
      className={`
        w-full 
        ${isSale ? 'bg-linear-to-r from-orange-500 to-red-500' : 'bg-linear-to-r from-blue-500 to-cyan-600'}
        text-white 
        py-1
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          {isSale && (
            <span className="mr-2 animate-pulse">🎉</span>
          )}
          <span className="text-sm font-medium text-center">
            {displayText}
            {linkUrl && (
              <Link
                href={linkUrl}
                className="ml-2 underline font-bold hover:text-yellow-200 transition-colors inline-flex items-center"
              >
                {linkText}
                <span className="ml-1">→</span>
              </Link>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}