"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Percent, Package, ChevronDown } from "lucide-react";
import AnnouncementBar from "../_announcement/announcement_page"; // Import the announcement bar

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
  dropdown?: Array<{
    name: string;
    href: string;
    description?: string;
  }>;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navLinks: NavLink[] = [
    {
      name: "Home",
      href: "/Gamer_PC",
    },
    {
      name: "Deals",
      href: "/Gamer_PC/deals",
      icon: <Percent className="w-4 h-4" />,
      dropdown: [
        { name: "Today's Deals", href: "/Gamer_PC/deals", description: "Limited time offers" },
        { name: "Weekly Specials", href: "/Gamer_PC/deals", description: "Best of the week" },
        { name: "Clearance", href: "/Gamer_PC/deals", description: "Last chance to buy" },
        { name: "Flash Sale", href: "/Gamer_PC/deals", description: "Ending soon" },
      ],
    },
    {
      name: "Bundles",
      href: "/bundles",
      icon: <Package className="w-4 h-4" />,
      dropdown: [
        { name: "Gaming Bundles", href: "/bundles/gaming", description: "Save on game packages" },
        { name: "Software Suites", href: "/bundles/software", description: "Productivity packages" },
        { name: "Hardware Combos", href: "/bundles/hardware", description: "PC & accessories" },
        { name: "Seasonal Bundles", href: "/bundles/seasonal", description: "Holiday specials" },
      ],
    },
    {
      name: "Products",
      href: "/products",
      dropdown: [
        { name: "Electronics", href: "/products/electronics" },
        { name: "Software", href: "/products/software" },
        { name: "Accessories", href: "/products/accessories" },
        { name: "Gaming", href: "/products/gaming" },
      ],
    },
    {
      name: "Categories",
      href: "/categories",
      dropdown: [
        { name: "Laptops & Computers", href: "/categories/computers" },
        { name: "Mobile Devices", href: "/categories/mobile" },
        { name: "Home & Office", href: "/categories/home-office" },
        { name: "Audio & Video", href: "/categories/audio-video" },
      ],
    },
    {
      name: "Support",
      href: "/support",
    },
    {
      name: "About",
      href: "/about",
    },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Improved dropdown handlers with delay
  const handleMouseEnter = (linkName: string) => {
    if (window.innerWidth > 768) {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setActiveDropdown(linkName);
      setIsHoveringDropdown(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768 && !isHoveringDropdown) {
      // Add a small delay before closing to allow mouse to move to dropdown
      timeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
      }, 200); // Increased delay for better UX
    }
  };

  const handleDropdownMouseEnter = () => {
    if (window.innerWidth > 768) {
      setIsHoveringDropdown(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const handleDropdownMouseLeave = () => {
    if (window.innerWidth > 768) {
      setIsHoveringDropdown(false);
      timeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
      }, 150);
    }
  };

  const toggleDropdown = (linkName: string) => {
    if (window.innerWidth <= 768) {
      // Mobile behavior - toggle on click
      setActiveDropdown(activeDropdown === linkName ? null : linkName);
    } else {
      // Desktop behavior - show on click as well
      setActiveDropdown(linkName);
    }
  };

  // Close all dropdowns on mobile when clicking a link
  const handleMobileLinkClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Announcement Bar - Now placed ABOVE the navbar but as part of the same component */}
      <AnnouncementBar />
      
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white"
        }`}
        ref={dropdownRef}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">Gaming PC</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        pathname === link.href
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {link.icon && <span className="mr-2">{link.icon}</span>}
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <button
                        onClick={() => toggleDropdown(link.name)}
                        className="p-1.5 -ml-1"
                        aria-label={`Toggle ${link.name} dropdown`}
                        aria-expanded={activeDropdown === link.name}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === link.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Menu - Connected to parent with no gap */}
                  {link.dropdown && activeDropdown === link.name && (
                    <div
                      className="absolute left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                      style={{
                        // Connect dropdown directly to nav item
                        top: "100%",
                      }}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 hover:bg-blue-50 transition-colors group border-l-2 border-transparent hover:border-blue-500"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="font-medium text-gray-900 group-hover:text-blue-600">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/register">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                Sign In
              </button>
              </Link>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-200 mt-2 pt-4 pb-6">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <div className="flex items-center justify-between hover:bg-gray-50 rounded-lg">
                      <Link
                        href={link.href}
                        className={`flex items-center px-3 py-3 text-base font-medium rounded-md flex-1 ${
                          pathname === link.href
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-blue-600"
                        }`}
                        onClick={handleMobileLinkClick}
                      >
                        {link.icon && <span className="mr-3">{link.icon}</span>}
                        {link.name}
                      </Link>
                      {link.dropdown && (
                        <button
                          onClick={() => toggleDropdown(link.name)}
                          className="p-3"
                          aria-label={`Toggle ${link.name} dropdown`}
                          aria-expanded={activeDropdown === link.name}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              activeDropdown === link.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Mobile Dropdown */}
                    {link.dropdown && activeDropdown === link.name && (
                      <div className="ml-6 mt-1 mb-2 space-y-1 border-l-2 border-blue-200 pl-4">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block py-2.5 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <button className="w-full px-4 py-3 text-base font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Sign In
                  </button>
                  <button className="w-full px-4 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}