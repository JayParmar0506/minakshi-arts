"use client";

import React, { useState } from "react";
import { Flame, Sparkles, ArrowRight, Eye, Star, Clock, ShieldCheck, Gift } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import LivingNebula from "@/components/ui/living-nebula-2";

export const Hero: React.FC = () => {
  const { addToCart, setQuickViewProduct, setIsCustomOrderOpen } = useShop();
  const signatureProduct = PRODUCTS[0]; // Golden Ganesha Diya Candle

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleScrollToCatalog = () => {
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 flex items-center overflow-hidden">
      {/* Living Nebula Background - Hidden on mobile/tablet (< 1024px), active only on laptop/desktop (>= 1024px) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none opacity-60">
        <LivingNebula particleCount={1000} trailLength={0.15} canvasGlow={15} />
      </div>

      {/* Diya Flame Ambient Aura background gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-radial-diya opacity-80 pointer-events-none animate-flame-pulse blur-3xl" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-terracotta-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center z-10">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 backdrop-blur-md">
            <Flame className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-medium">
              Diwali 2026 Collection • Limited Edition
            </span>
            <Sparkles className="w-3.5 h-3.5 text-diya-amber" />
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl xl:text-7xl font-bold tracking-tight text-sand-50 leading-[1.1]">
            Sacred Glow. <br />
            <span className="bg-gradient-to-r from-gold-200 via-gold-300 to-diya-amber bg-clip-text text-transparent">
              Handcrafted Traditions.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sand-100 text-sm sm:text-base xl:text-lg max-w-2xl font-light leading-relaxed">
            Elevate your home this festive season with bespoke tactile clay wall murals, architectural soy wax candles infused with saffron & sandalwood, and heirloom brass-inlaid Ganeshas.
          </p>

          {/* Value Props Pills */}
          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-sand-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>100% Organic Soy & Non-Toxic Wicks</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-sand-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Gift className="w-4 h-4 text-diya-amber" />
              <span>Festive Velvet Gift Packaging</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleScrollToCatalog}
              className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:scale-105 transition-all group overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Festive Drops
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setIsCustomOrderOpen(true)}
              className="px-8 py-4 rounded-full glass-panel border border-gold-500/40 text-sand-100 hover:text-gold-400 hover:border-gold-400 transition-all font-serif text-xs sm:text-sm tracking-widest uppercase hover:bg-gold-500/10 cursor-pointer"
            >
              Custom Orders
            </button>
          </div>
        </div>

        {/* Right Column: 3D Interactive Card Showcase */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
          className="lg:col-span-5 relative"
        >
          {/* Card Wrapper - Entire card is clickable */}
          <div
            onClick={() => setQuickViewProduct(signatureProduct)}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg)`,
              transition: "transform 0.15s ease-out",
            }}
            className="relative glass-panel-gold rounded-3xl p-5 sm:p-7 border border-gold-500/40 shadow-2xl shadow-black group cursor-pointer hover:border-gold-400"
          >
            {/* Top Floating Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-terracotta-600/90 text-white font-sans text-[11px] uppercase tracking-wider font-semibold shadow-md">
                {signatureProduct.tag}
              </span>
              <div className="flex items-center gap-1 text-gold-400 text-xs font-semibold bg-obsidian/70 px-2.5 py-1 rounded-full border border-gold-500/20">
                <Star className="w-3.5 h-3.5 fill-gold-400" />
                <span>{signatureProduct.rating}</span>
                <span className="text-sand-400">({signatureProduct.reviewsCount})</span>
              </div>
            </div>

            {/* Product Image Frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 border border-white/10 group-hover:border-gold-500/50 transition-colors">
              <img
                src={signatureProduct.images[0]}
                alt={signatureProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent opacity-80" />

              {/* Specs Tag overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian/80 backdrop-blur-md border border-white/15 text-xs text-sand-200">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span>Burn Time: {signatureProduct.specs.burnTime}</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1 mb-5">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-sand-100 group-hover:text-gold-400 transition-colors">
                {signatureProduct.name}
              </h3>
              <p className="text-xs text-sand-300/80 font-sans tracking-wide">
                {signatureProduct.subtitle}
              </p>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <span className="text-xl sm:text-2xl font-bold font-serif text-gold-400">
                  ₹{signatureProduct.price.toLocaleString()}
                </span>
                {signatureProduct.originalPrice && (
                  <span className="text-xs text-sand-400 line-through ml-2">
                    ₹{signatureProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct(signatureProduct);
                  }}
                  className="p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 text-sand-200 hover:text-gold-400 transition-colors border border-white/10 cursor-pointer"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(signatureProduct);
                  }}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-gold-500/20 cursor-pointer"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
