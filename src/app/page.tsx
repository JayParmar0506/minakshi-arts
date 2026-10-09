"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { ProductCatalog } from "@/components/ProductCatalog";
import { HamperBuilder } from "@/components/HamperBuilder";
import { ArtisanStory } from "@/components/ArtisanStory";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { SearchModal } from "@/components/SearchModal";
import { CustomOrderModal } from "@/components/CustomOrderModal";
import { CareGuideModal } from "@/components/CareGuideModal";
import { LoginModal } from "@/components/LoginModal";
import { OrderHistoryModal } from "@/components/OrderHistoryModal";
import { AuthGate } from "@/components/AuthGate";
import { Footer } from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toastMessage, isLoginOpen, setIsLoginOpen, user } = useShop();

  const handleSelectBentoCategory = (category: string) => {
    setSelectedCategory(category);
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-obsidian text-sand-100 relative selection:bg-gold-500 selection:text-obsidian">
      {/* Full-Screen Initial Auth Gate Wall */}
      <AuthGate />

      {/* Main Website (Unlocked upon login) */}
      {user && (
        <>
          {/* Toast Notification Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl glass-panel-gold border border-gold-500/50 shadow-2xl flex items-center gap-3 text-gold-300 font-serif text-xs font-semibold"
              >
                <Sparkles className="w-4 h-4 text-gold-400 animate-spin-slow" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Sticky Navigation Bar */}
          <Navbar />

          {/* Hero Section */}
          <Hero />

          {/* Bento Grid Collections */}
          <BentoGrid onSelectCategory={handleSelectBentoCategory} />

          {/* Product Catalog Showcase */}
          <ProductCatalog
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Build Your Own Hamper Studio */}
          <HamperBuilder />

          {/* Artisan Heritage & Story */}
          <ArtisanStory />

          {/* Interactive Modals & Drawers */}
          <CartDrawer />
          <QuickViewModal />
          <SearchModal />
          <CustomOrderModal />
          <CareGuideModal />
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
          <OrderHistoryModal />

          {/* Multi-column Footer */}
          <Footer />
        </>
      )}
    </main>
  );
}
