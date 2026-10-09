"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { Heart, Star, Clock, Maximize2, ShoppingBag, Check, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const { user, addToCart, toggleFavorite, isFavorite, setQuickViewProduct } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const favorited = isFavorite(product.id);
  const isAdmin = user?.role === "admin" || user?.email === "jayshanti567@gmail.com";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setQuickViewProduct(product)}
      className="glass-panel bg-obsidian/90 sm:bg-obsidian/50 rounded-3xl p-3.5 sm:p-5 border border-white/20 sm:border-white/10 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group relative shadow-xl hover:shadow-2xl hover:shadow-black/60 cursor-pointer max-h-[380px] sm:max-h-none"
    >
      <div>
        {/* Image Container with secondary hover flip - Compact max height on mobile */}
        <div className="relative aspect-[4/3] sm:aspect-square max-h-[220px] sm:max-h-none rounded-2xl overflow-hidden mb-3 sm:mb-4 bg-obsidian border border-white/10 group-hover:border-gold-500/30 transition-colors">
          {/* Primary Image */}
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Tag Badge */}
          {product.tag && (
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-obsidian/90 backdrop-blur-md border border-gold-500/40 text-gold-300 text-[10px] sm:text-[10px] font-bold uppercase tracking-wider">
              {product.tag}
            </div>
          )}

          {/* Admin Edit & Delete Buttons OR Client Favorite Button */}
          {isAdmin ? (
            <div className="z-20 absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) {
                    onEdit(product);
                  } else {
                    window.location.href = "/admin";
                  }
                }}
                aria-label="Edit Product"
                title="Edit Product Details"
                className="p-1.5 sm:p-2 bg-black/70 backdrop-blur-md rounded-full border border-gold-500/50 hover:bg-gold-500/30 text-gold-400 transition-all cursor-pointer shadow-lg flex items-center justify-center"
              >
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const targetId = product.id || product.name;
                  if (confirm("Are you sure you want to delete this product?")) {
                    if (onDelete) onDelete(targetId);
                  }
                }}
                aria-label="Delete Product"
                title="Delete Product permanently"
                className="p-2 bg-black/70 backdrop-blur-md rounded-full border border-red-500/50 hover:bg-red-900/50 text-red-400 transition-all cursor-pointer shadow-lg flex items-center justify-center"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              aria-label="Toggle Favorite"
              className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                favorited
                  ? "bg-terracotta-600 text-white shadow-lg shadow-terracotta-600/40"
                  : "bg-obsidian/70 text-sand-100 hover:text-white hover:bg-obsidian/90"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? "fill-white" : ""}`} />
            </button>
          )}

          {/* Quick View Button (hover overlay) */}
          <div className="absolute inset-x-4 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-full py-2.5 rounded-xl bg-obsidian/80 hover:bg-gold-500 backdrop-blur-md text-sand-100 hover:text-obsidian border border-white/20 font-serif text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Quick View
            </button>
          </div>
        </div>

        {/* Product Details with leading-snug */}
        <div className="space-y-1 mb-3 sm:mb-4">
          {/* Rating & Burn time/dimensions */}
          <div className="flex items-center justify-between text-xs text-sand-400 mb-1">
            <div className="flex items-center gap-1 text-gold-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-gold-400" />
              <span>{product.rating}</span>
              <span className="text-sand-400 font-normal">({product.reviewsCount})</span>
            </div>

            {product.specs.burnTime ? (
              <span className="flex items-center gap-1 text-[11px] text-sand-300 bg-white/5 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3 text-gold-400" />
                {product.specs.burnTime}
              </span>
            ) : product.specs.dimensions ? (
              <span className="text-[11px] text-sand-300 bg-white/5 px-2 py-0.5 rounded-md">
                {product.specs.dimensions}
              </span>
            ) : null}
          </div>

          <h3 className="font-serif text-base sm:text-lg font-bold text-sand-100 group-hover:text-gold-400 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-sand-300/80 font-sans line-clamp-1 font-light leading-snug">
            {product.subtitle}
          </p>
        </div>
      </div>

      {/* Footer: Price & Add to Cart */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-lg sm:text-xl font-serif font-bold text-gold-400 whitespace-nowrap">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-sand-400 line-through ml-1.5 whitespace-nowrap">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
            isAdded
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian hover:opacity-90 shadow-gold-500/20"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
