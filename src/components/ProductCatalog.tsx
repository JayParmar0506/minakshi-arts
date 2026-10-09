"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PRODUCTS, Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ProductFormModal } from "./admin/ProductFormModal";
import { DBProduct } from "@/lib/db";
import { useShop } from "@/context/ShopContext";
import { SlidersHorizontal, Search, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCatalogProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const { favorites, showToast } = useShop();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("minakshi_deleted_products");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
        }
      }
    } catch (error) {
      console.error("Error fetching dynamic products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod as unknown as DBProduct);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    const updatedDeleted = [...deletedIds, id];
    setDeletedIds(updatedDeleted);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("minakshi_deleted_products", JSON.stringify(updatedDeleted));
      } catch (e) {
        console.error(e);
      }
    }

    setAllProducts((prev) => prev.filter((p) => p.id !== id && p.name !== id));
    showToast("Product and photos deleted successfully!");

    try {
      await fetch(`/api/products/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const categories = [
    { id: "all", label: "All Drops" },
    { id: "candles", label: "Soy Candles" },
    { id: "murals", label: "Wall Murals" },
    { id: "diyas", label: "Diyas & Urlis" },
    { id: "idols", label: "Sacred Idols" },
    { id: "hampers", label: "Gift Hampers" },
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Filter out deleted items
      if (deletedIds.includes(product.id) || deletedIds.includes(product.name)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (onlyFavorites && !favorites.includes(product.id)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchSub = product.subtitle.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchFragrance = product.specs.fragranceNotes?.some((f) =>
          f.toLowerCase().includes(query)
        );
        return matchName || matchSub || matchDesc || matchFragrance;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [allProducts, selectedCategory, onlyFavorites, searchQuery, sortBy, favorites]);

  return (
    <section id="catalog" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-gold-400 text-xs font-semibold uppercase tracking-[0.3em]">
          Handcrafted Festive Masterpieces
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-sand-50">
          The Artisanal <span className="text-gold-400">Collection</span>
        </h2>
        <p className="text-sand-300/80 text-sm font-light">
          Each piece is individually sculpted, poured, and blessed for your home during Diwali.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 glass-panel p-4 rounded-3xl border border-white/10">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOnlyFavorites(false);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat.id && !onlyFavorites
                  ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-lg shadow-gold-500/20"
                  : "text-sand-200 hover:text-gold-400 hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Favorites Filter Pill */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
              onlyFavorites
                ? "bg-terracotta-600 text-white shadow-lg"
                : "text-sand-200 hover:text-gold-400 hover:bg-white/5"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-white" : ""}`} />
            <span>Saved ({favorites.length})</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candles, murals..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-obsidian/70 border border-white/10 text-sand-100 text-xs placeholder:text-sand-400 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 rounded-full bg-obsidian/70 border border-white/10 text-sand-200 text-xs focus:outline-none focus:border-gold-400 transition-colors font-medium cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sand-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl p-8 border border-white/10">
          <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-4 opacity-60" />
          <h3 className="font-serif text-2xl font-bold text-sand-100 mb-2">No Drops Found</h3>
          <p className="text-sand-400 text-sm max-w-sm mx-auto mb-6">
            We couldn't find any artisanal items matching your filters or search terms.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setOnlyFavorites(false);
            }}
            className="px-6 py-3 rounded-full bg-gold-500 text-obsidian font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Admin Product Edit Modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
        onSaveSuccess={() => {
          fetchProducts();
          showToast("Product saved successfully!");
        }}
      />
    </section>
  );
};
