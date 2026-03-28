"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaHome, FaUser, FaInfoCircle, FaPhone } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession()
  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: "0%" },
    exit: { x: "100%" },
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/products/6865354ffb7a0e3210631255", label: "Product Details 1", icon: <FaInfoCircle /> },
    { href: "/products/6865359afb7a0e3210631256", label: "Product Details 2", icon: <FaInfoCircle /> },
    { href: "/cart", label: "Cart", icon: <FaInfoCircle /> },
    { href: "/checkout", label: "Checkout", icon: <FaInfoCircle /> },
    { href: "/dashboard/admin/add-product", label: "Add Product", icon: <FaPhone /> },
  ];
  if(pathname.includes("/dashboard") || pathname.includes("/signin") || pathname.includes("/signup")){
    return null; // Hide Navbar on specific pages
  }
  else {
    return (
    <nav className="bg-table-head-gradient shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-secondColor font-bold text-xl">L</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                YourLogo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-white hover:text-fifthColor px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:bg-fourthColor/30 ${
                    pathname === link.href ? "bg-fourthColor/50" : ""
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Login Button */}
          {session.status === "authenticated" ? (
            <div className="hidden md:block">
              {/* <Link
                href="/dashboard/admin/add-product"
                className="bg-white text-textColor hover:bg-sixthColor px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaUser />
                Dashboard
              </Link> */}
                  <button onClick={async () => {
                    await signOut({ redirect: false });
                    router.push('/');
                    router.refresh();
                  }}>
                    <FaUser /> Log Out
                  </button>
            </div>
          ) : <div className="hidden md:block">
            <Link
              href="/signin"
              className="bg-white text-textColor hover:bg-sixthColor px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FaUser />
              Login
            </Link>
          </div>}


          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="text-white hover:text-orange-200 p-2 rounded-md transition-colors"
            >
              <GiHamburgerMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                      <span className="text-orange-500 font-bold">L</span>
                    </div>
                    <span className="text-white font-bold text-lg">YourLogo</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-orange-200 p-1 rounded"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 text-gray-700 hover:text-textColor py-3 px-4 rounded-lg transition-all duration-300 hover:bg-sixthColor ${
                      pathname === link.href ? "bg-orange-100 text-textColor" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                
                {/* Login Button */}
                {session.status === "authenticated" ? (                   
                    <div className="pt-4 border-t border-gray-200">
                  {/* <Link
                    href="/dashboard/admin/add-product"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                   
                    Dashboard
                  </Link> */}
                  <button onClick={async () => {
                    await signOut({ redirect: false });
                    router.push('/');
                    router.refresh();
                  }}>
                    <FaUser /> Log Out
                  </button>
                </div>
                ) : (
                    <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/signin"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser />
                    Login
                  </Link>
                </div>
                )}
     
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
  }
};

export default Navbar;