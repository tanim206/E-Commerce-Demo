'use client';

import { useState } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ShebaZoneBanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('doctors');

  return (
    <div className="relative bg-white overflow-hidden min-h-screen flex items-center justify-center">
      {/* Gradient background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white z-0" />
      
      {/* Floating organic shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-100"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          {/* Animated heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Find the <span className="text-green-600">Best Healthcare</span> in Bangladesh
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Connect with top doctors and hospitals. Book appointments instantly.
          </motion.p>

          {/* Tab selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              {['doctors', 'hospitals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-white shadow-sm text-green-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Search bar with filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-2"
          >
            <div className="flex flex-col md:flex-row gap-2">
              {/* Main search input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search for ${activeTab}...`}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

             

              {/* Search button */}
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                <FiSearch className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button className="flex items-center px-5 py-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <FiCalendar className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium">Book Appointment</span>
            </button>
            <button className="flex items-center px-5 py-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <FiUser className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium">Find Specialist</span>
            </button>
            <button className="flex items-center px-5 py-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <FiMapPin className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium">Nearby Hospitals</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating animated elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-green-500/20"
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-green-500/30"
        animate={{
          y: [0, 20, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1,
        }}
      />
    </div>
  );
}