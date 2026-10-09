"use client";

import React, { useState, useMemo } from "react";
import { useShop } from "@/context/ShopContext";
import { PRODUCTS } from "@/data/products";
import { Search, X, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useShop();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.specs.fragranceNotes?.some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] p-4 sm:p-6 md:p-10 flex items-start justify-center pt-20">
        <div
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-md cursor-pointer"
        />

        <div className="relative max-w-2xl w-full glass-panel-gold rounded-3xl p-6 border border-gold-500/40 shadow-2xl z-10 overflow-hidden">
          {/* Input Header */}
          <div className="relative flex items-center mb-6">
            <Search className="absolute left-4 w-5 h-5 text-gold-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handcrafted candles, murals, Ganesha idols..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-obsidian/80 border border-white/10 text-sand-100 text-sm placeholder:text-sand-400 focus:outline-none focus:border-gold-400 font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-12 p-1 text-sand-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 p-1.5 rounded-lg text-sand-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions */}
          {!query && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-sand-400 block">
                Popular Festive Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {["Ganesha Diya Candle", "24K Gold Wall Mural", "Floating Lotus Urli", "Saffron Soy Candle"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-gold-500/40 text-sand-200 hover:text-gold-400 text-xs font-medium transition-all cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Results List */}
          {query && (
            <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-sand-400 block">
                Search Results ({results.length})
              </span>

              {results.length === 0 ? (
                <p className="text-sand-400 text-xs py-8 text-center">
                  No drops matching "{query}". Try searching "Candle", "Ganesha", or "Mural".
                </p>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setQuickViewProduct(product);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/30 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-sand-100 text-sm group-hover:text-gold-400 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-sand-400 font-sans">{product.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-gold-400 text-sm">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
