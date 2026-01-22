import Navbar from '../../_components/_navbar/navbar';
import BannerPage from '../_components/_banner_page/banner_page';
import CategoryCards from '../_components/_category_cards/category_cards_page';
import FeaturedPage from '../_components/_featured_page/featured_page';
import Blogs from '../_components/_blogs/blogs';
// import Announcement from '../../_components/_announcement/announcement_page';
import { ShoppingBag, Star, Truck, Shield, Award, Clock } from "lucide-react";
import Link from 'next/link';

export default function HomePage() {
  
  return (
    <>
      {/* <Announcement /> */}
      <Navbar /> 
      <BannerPage />
      <CategoryCards />
      <FeaturedPage />


      <Blogs />
      <main>
        {/* Hero Section */}
        <section className="relative bg-linear-to-r from-gray-900 to-blue-900 text-white py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Ultimate Gaming PCs & <span className="text-blue-400">Bundles</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Get the best deals on high-performance gaming computers, components, and complete setups. 
                Limited time offers with massive discounts!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/Gamer_PC">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  Shop Gaming PCs
                </button>
                </Link>
                <Link href="/Gamer_PC/deals">
                  <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded-lg transition-colors">
                    View All Deals
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-gray-600 text-sm">On orders over $999</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">2-Year Warranty</h3>
                <p className="text-gray-600 text-sm">On all gaming PCs</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Expert Built</h3>
                <p className="text-gray-600 text-sm">Quality tested systems</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600 text-sm">Technical assistance</p>
              </div>
            </div>
          </div>
        </section>

    


      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold ml-2">Gaming PC</span>
              </div>
              <p className="text-gray-400">
                Your destination for premium gaming PCs and electronics.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/deals" className="hover:text-white">Today's Deals</a></li>
                <li><a href="/bundles" className="hover:text-white">PC Bundles</a></li>
                <li><a href="/products" className="hover:text-white">All Products</a></li>
                <li><a href="/support" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/gaming-pcs" className="hover:text-white">Gaming PCs</a></li>
                <li><a href="/components" className="hover:text-white">Components</a></li>
                <li><a href="/peripherals" className="hover:text-white">Peripherals</a></li>
                <li><a href="/software" className="hover:text-white">Software</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Get exclusive deals and updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg text-black grow bg-white focus:outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Gaming PC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}