"use client";

import React, { useState, useEffect, useRef } from "react";
import { DBProduct } from "@/lib/db";
import { X, Image as ImageIcon, Save, Sparkles, Upload, Grid, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STOCK_PHOTOS = [
  { label: "Golden Lotus Candle", url: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800" },
  { label: "Diya Flame Glow", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800" },
  { label: "Textured Wall Mural", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800" },
  { label: "Brass Diya Urli", url: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800" },
  { label: "Sacred Ganesha Idol", url: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=800" },
  { label: "Royal Festive Hamper", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800" },
  { label: "Saffron Scented Glass", url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800" },
  { label: "Traditional Clay Diya", url: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800" },
];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: DBProduct | null;
  onSaveSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    category: "candles" as "candles" | "murals" | "diyas" | "idols" | "hampers",
    price: 3499,
    originalPrice: 4299,
    stock: 25,
    tag: "Diwali Bestseller",
    imageUrl1: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800",
    imageUrl2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
    burnTimeOrDim: "65 Hours",
    fragranceNotes: "Royal Saffron, Sandalwood, Amber",
    description: "",
    artisanStory: "",
  });

  const [saving, setSaving] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setFormData((prev) => ({
          ...prev,
          imageUrl1: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        subtitle: productToEdit.subtitle || "",
        category: productToEdit.category || "candles",
        price: productToEdit.price || 0,
        originalPrice: productToEdit.originalPrice || 0,
        stock: productToEdit.stock || 0,
        tag: productToEdit.tag || "",
        imageUrl1: productToEdit.images[0] || "",
        imageUrl2: productToEdit.images[1] || "",
        burnTimeOrDim: productToEdit.specs?.burnTime || productToEdit.specs?.dimensions || "",
        fragranceNotes: productToEdit.specs?.fragranceNotes?.join(", ") || "",
        description: productToEdit.description || "",
        artisanStory: productToEdit.artisanStory || "",
      });
    } else {
      setFormData({
        name: "",
        subtitle: "",
        category: "candles",
        price: 2999,
        originalPrice: 3800,
        stock: 30,
        tag: "Handcrafted Luxe",
        imageUrl1: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800",
        imageUrl2: "",
        burnTimeOrDim: "45 Hours",
        fragranceNotes: "Saffron, Cardamom",
        description: "Hand-poured organic soy wax infused with steam-distilled essential oils.",
        artisanStory: "Sculpted by master artisans in Vadodara, Gujarat.",
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        subtitle: formData.subtitle,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        tag: formData.tag,
        images: [formData.imageUrl1, formData.imageUrl2].filter(Boolean),
        specs: {
          burnTime: formData.category === "candles" ? formData.burnTimeOrDim : undefined,
          dimensions: formData.category !== "candles" ? formData.burnTimeOrDim : undefined,
          fragranceNotes: formData.fragranceNotes
            ? formData.fragranceNotes.split(",").map((s) => s.trim())
            : undefined,
        },
        description: formData.description,
        artisanStory: formData.artisanStory,
      };

      const url = productToEdit ? `/api/products/${productToEdit.id}` : "/api/products";
      const method = productToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSaveSuccess();
        onClose();
      } else {
        alert("Error saving product. Please check input.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-3xl w-full glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl z-10 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Close Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <h2 className="font-serif text-2xl font-bold text-sand-50">
                {productToEdit ? "Edit Product & Photo" : "Add New Artisan Product"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-sand-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-2 flex-1">
            {/* Image Preview & Alter Photo Input */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  Product Photography (Alter Photo Here)
                </span>

                <div className="flex items-center gap-2">
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[11px] font-bold uppercase tracking-wider hover:bg-gold-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Device/Phone Photo
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGallery(!showGallery)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 text-sand-200 border border-white/20 text-[11px] font-bold uppercase tracking-wider hover:bg-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    Stock Gallery
                  </button>
                </div>
              </div>

              {/* Stock Photo Gallery Drawer */}
              {showGallery && (
                <div className="p-3 rounded-xl bg-obsidian/90 border border-gold-500/40 space-y-2">
                  <span className="text-[10px] text-sand-300 font-semibold uppercase tracking-wider">
                    Click an artisan photo to select:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STOCK_PHOTOS.map((sp) => (
                      <div
                        key={sp.url}
                        onClick={() => {
                          setFormData({ ...formData, imageUrl1: sp.url });
                          setShowGallery(false);
                        }}
                        className="group relative h-16 rounded-lg overflow-hidden border border-white/10 hover:border-gold-400 cursor-pointer"
                      >
                        <img src={sp.url} alt={sp.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center text-[9px] text-gold-300 font-bold">
                          {sp.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 space-y-3">
                  <div>
                    <label className="block text-[11px] text-sand-300 mb-1">Primary Image URL or Base64 Data *</label>
                    <input
                      required
                      type="text"
                      value={formData.imageUrl1}
                      onChange={(e) => setFormData({ ...formData, imageUrl1: e.target.value })}
                      placeholder="https://images.unsplash.com/... or upload photo"
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-sand-300 mb-1">Secondary Hover Photo URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl2}
                      onChange={(e) => setFormData({ ...formData, imageUrl2: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 text-xs focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                {/* Live Photo Preview */}
                <div className="sm:col-span-4 flex flex-col items-center">
                  <span className="text-[10px] text-sand-400 mb-1">Photo Preview</span>
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gold-500/40 bg-obsidian">
                    <img
                      src={formData.imageUrl1 || "https://via.placeholder.com/150"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-sand-300 mb-1 font-medium">Product Title *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Sandalwood Lotus Diya"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400 font-serif"
                />
              </div>

              <div>
                <label className="block text-sand-300 mb-1 font-medium">Subtitle / Craft Note *</label>
                <input
                  required
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Hand-Poured Organic Soy Wax"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Category, Price, Stock */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-sand-300 mb-1 font-medium">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  <option value="candles">Soy Candles</option>
                  <option value="murals">Wall Murals</option>
                  <option value="diyas">Diyas & Urlis</option>
                  <option value="idols">Sacred Idols</option>
                  <option value="hampers">Gift Hampers</option>
                </select>
              </div>

              <div>
                <label className="block text-sand-300 mb-1 font-medium">Price (₹) *</label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-sand-300 mb-1 font-medium">Original Price (₹)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-gold-400 mb-1 font-bold">Remaining Stock *</label>
                <input
                  required
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-gold-500/50 text-gold-300 font-bold focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Tag & Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-sand-300 mb-1 font-medium">Festive Tag</label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g. Diwali Bestseller"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-sand-300 mb-1 font-medium">Burn Time / Dimensions</label>
                <input
                  type="text"
                  value={formData.burnTimeOrDim}
                  onChange={(e) => setFormData({ ...formData, burnTimeOrDim: e.target.value })}
                  placeholder="e.g. 65 Hours or 24in x 36in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-sand-300 mb-1 font-medium">Fragrance Notes (comma separated)</label>
                <input
                  type="text"
                  value={formData.fragranceNotes}
                  onChange={(e) => setFormData({ ...formData, fragranceNotes: e.target.value })}
                  placeholder="Royal Saffron, Sandalwood"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Description & Story */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-sand-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sand-300 mb-1 font-medium">Artisan Story Note</label>
                <textarea
                  rows={2}
                  value={formData.artisanStory}
                  onChange={(e) => setFormData({ ...formData, artisanStory: e.target.value })}
                  className="w-full p-3 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl glass-panel text-sand-200 text-xs uppercase font-bold tracking-wider hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-gold-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Product Details"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
