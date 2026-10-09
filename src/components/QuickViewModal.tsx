"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { X, Star, Clock, Heart, ShoppingBag, ShieldCheck, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleFavorite, isFavorite } = useShop();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const favorited = isFavorite(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-obsidian/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-4xl w-full glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl z-10 overflow-hidden my-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-sand-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Gallery */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative bg-obsidian">
                <img
                  src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
                {quickViewProduct.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-obsidian/80 backdrop-blur-md border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
                    {quickViewProduct.tag}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {quickViewProduct.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {quickViewProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx ? "border-gold-400 scale-105" : "border-white/10 opacity-70"
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & CTA */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-gold-400 text-xs font-semibold">
                    <Star className="w-4 h-4 fill-gold-400" />
                    <span>{quickViewProduct.rating}</span>
                    <span className="text-sand-400">({quickViewProduct.reviewsCount} verified reviews)</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(quickViewProduct.id)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      favorited ? "bg-terracotta-600 text-white" : "bg-white/10 text-sand-300 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorited ? "fill-white" : ""}`} />
                  </button>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 mb-1">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs text-sand-300 font-sans tracking-wide">
                  {quickViewProduct.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-gold-400">
                  ₹{quickViewProduct.price.toLocaleString()}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-sand-400 line-through">
                    ₹{quickViewProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-terracotta-600/20 text-terracotta-400 font-semibold">
                  Save ₹{(quickViewProduct.originalPrice! - quickViewProduct.price).toLocaleString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-sand-200/90 text-xs sm:text-sm font-light leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Specs Pills */}
              <div className="space-y-2 pt-2 text-xs">
                {quickViewProduct.specs.burnTime && (
                  <div className="flex items-center gap-2 text-sand-300">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span>Burn Time: <strong>{quickViewProduct.specs.burnTime}</strong></span>
                  </div>
                )}
                {quickViewProduct.specs.dimensions && (
                  <div className="flex items-center gap-2 text-sand-300">
                    <ShieldCheck className="w-4 h-4 text-diya-amber" />
                    <span>Dimensions: <strong>{quickViewProduct.specs.dimensions}</strong></span>
                  </div>
                )}
                {quickViewProduct.specs.fragranceNotes && quickViewProduct.specs.fragranceNotes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-sand-400 font-medium">Fragrance Notes:</span>
                    {quickViewProduct.specs.fragranceNotes.map((note) => (
                      <span key={note} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-sand-200 text-[11px]">
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Artisan Note */}
              <div className="p-3.5 rounded-xl bg-obsidian/70 border border-white/5 text-[11px] text-sand-300 italic">
                "{quickViewProduct.artisanStory}"
              </div>

              {/* Quantity & Buy Button */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/10">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sand-200 hover:bg-white/10 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 font-serif font-bold text-sand-100 text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sand-200 hover:bg-white/10 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isAdded
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian hover:opacity-90 shadow-gold-500/20"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • ₹{(quickViewProduct.price * qty).toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
