"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Flame, Search, ShoppingBag, Heart, Crown, Menu, X, User, LogOut, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const {
    user,
    logout,
    totalCartCount,
    setIsCartOpen,
    setIsSearchOpen,
    setIsCustomOrderOpen,
    setIsCareGuideOpen,
    setIsLoginOpen,
    setIsOrderHistoryOpen,
    favorites,
  } = useShop();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Collections", href: "#collections" },
    { name: "Festive Hampers", href: "#hamper-builder" },
    { name: "Artisan Story", href: "#artisan-story" },
    { name: "Custom Orders", onClick: () => setIsCustomOrderOpen(true) },
    { name: "Care Tips", onClick: () => setIsCareGuideOpen(true) },
  ];

  return (
    <header id="top" className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <nav
          className={`flex items-center justify-between px-5 sm:px-6 py-3 rounded-full transition-all duration-300 ${
            scrolled
              ? "glass-panel-gold shadow-2xl shadow-black/80 border-gold-500/30"
              : "glass-panel border-white/10"
          }`}
        >
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => handleSmoothScroll(e, "#top")}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gold-400 via-diya-amber to-terracotta-600 p-[1px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-obsidian rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 fill-diya-amber/30 animate-flame-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold tracking-widest text-sand-100 group-hover:text-gold-400 transition-colors">
                MINAKSHI <span className="text-gold-400">ARTS</span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-sand-300/70 -mt-1 font-sans">
                Handcrafted Festive Luxe
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href!)}
                  className="text-xs uppercase tracking-widest text-sand-200 hover:text-gold-400 transition-colors font-medium relative group cursor-pointer"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className="text-xs uppercase tracking-widest text-sand-200 hover:text-gold-400 transition-colors font-medium relative group cursor-pointer"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </button>
              )
            )}

            {/* Admin Portal Link - Only visible for jayshanti567@gmail.com */}
            {(user?.email?.toLowerCase() === "jayshanti567@gmail.com" || user?.role === "admin") && (
              <Link
                href="/admin"
                className="text-xs uppercase tracking-widest text-gold-400 hover:text-sand-50 transition-colors font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30"
                title="Admin Inventory & Sales Analytics"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Session Profile & Log Out Button */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-gold-500/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <span className="text-xs font-serif font-bold text-gold-300 truncate max-w-[75px] sm:max-w-[130px]">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-1 rounded-full text-sand-300 hover:text-terracotta-400 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                  title="Sign Out / Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                aria-label="User Account Sign In"
                className="p-2 sm:p-2.5 rounded-full text-sand-200 hover:text-gold-400 hover:bg-white/5 transition-all cursor-pointer"
                title="Sign In / Login"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Order History Trigger */}
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              aria-label="Order History"
              className="p-2 sm:p-2.5 rounded-full text-sand-200 hover:text-gold-400 hover:bg-white/5 transition-all cursor-pointer"
              title="View Order History"
            >
              <Package className="w-4 h-4" />
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Products"
              className="p-2 sm:p-2.5 rounded-full text-sand-200 hover:text-gold-400 hover:bg-white/5 transition-all cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Favorites Icon */}
            <a
              href="#catalog"
              onClick={(e) => handleSmoothScroll(e, "#catalog")}
              aria-label="Favorites"
              className="relative p-2 sm:p-2.5 rounded-full text-sand-200 hover:text-gold-400 hover:bg-white/5 transition-all cursor-pointer"
              title="Saved Favorites"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </a>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-gold-500/20 to-terracotta-600/20 border border-gold-500/40 hover:border-gold-400 hover:bg-gold-500/30 transition-all text-gold-300 font-medium text-xs group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-serif tracking-wider">Bag</span>
              {totalCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  key={totalCartCount}
                  className="w-5 h-5 bg-gradient-to-r from-diya-amber to-terracotta-500 text-obsidian font-bold text-xs rounded-full flex items-center justify-center shadow-md shadow-amber-500/40"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-sand-200 hover:text-gold-400 hover:bg-white/5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-3 glass-panel-gold rounded-2xl p-5 border border-gold-500/30 flex flex-col gap-4 shadow-2xl"
            >
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.href ? (
                    <a
                      href={link.href}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleSmoothScroll(e, link.href!);
                      }}
                      className="text-sm font-serif tracking-widest text-sand-100 hover:text-gold-400 transition-colors block py-1 cursor-pointer"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        link.onClick && link.onClick();
                      }}
                      className="text-sm font-serif tracking-widest text-sand-100 hover:text-gold-400 transition-colors block py-1 text-left w-full cursor-pointer"
                    >
                      {link.name}
                    </button>
                  )}
                </div>
              ))}

              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-sm font-serif tracking-widest text-terracotta-400 hover:text-terracotta-300 transition-colors block py-1 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({user.name})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="text-sm font-serif tracking-widest text-sand-100 hover:text-gold-400 transition-colors block py-1 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-gold-400" />
                  <span>Client Sign In / Login</span>
                </button>
              )}

              {(user?.email?.toLowerCase() === "jayshanti567@gmail.com" || user?.role === "admin") && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-serif tracking-widest text-gold-400 hover:text-sand-50 transition-colors block py-1 flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Admin Portal & Analytics</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
