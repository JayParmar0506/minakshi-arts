"use client";

import React, { useState } from "react";
import { DBProduct } from "@/lib/db";
import { Edit, Trash2, Search, Plus, Minus, AlertTriangle, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface ProductTableProps {
  products: DBProduct[];
  onEdit: (product: DBProduct) => void;
  onDelete: (id: string) => void;
  onStockUpdate: (id: string, newStock: number) => void;
  onAddNew: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onStockUpdate,
  onAddNew,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl space-y-6">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-sand-50">
            Inventory & Catalog Management
          </h3>
          <p className="text-xs text-sand-300 font-light">
            Manage remaining stock, alter photo URLs, edit prices, or remove products.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-gold-500/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 text-xs placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-obsidian/80 border border-white/10 text-sand-200 text-xs focus:outline-none focus:border-gold-400 cursor-pointer font-medium"
          >
            <option value="all">All Categories</option>
            <option value="candles">Soy Candles</option>
            <option value="murals">Wall Murals</option>
            <option value="diyas">Diyas & Urlis</option>
            <option value="idols">Sacred Idols</option>
            <option value="hampers">Gift Hampers</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-obsidian/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-sand-300 font-serif uppercase tracking-wider">
              <th className="p-4">Photo</th>
              <th className="p-4">Product Name & Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Units Sold</th>
              <th className="p-4">Remaining Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-sand-400">
                  No products found in inventory matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const isLowStock = product.stock <= 5 && product.stock > 0;
                const isOutOfStock = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    {/* Thumbnail Photo with Alter Photo Click */}
                    <td className="p-4">
                      <div
                        onClick={() => onEdit(product)}
                        className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
                        title="Click to alter photo"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-gold-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="p-4">
                      <h4 className="font-serif font-bold text-sand-100 text-sm">{product.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-sand-400">
                        <span className="capitalize text-gold-400 font-medium">{product.category}</span>
                        <span>•</span>
                        <span>{product.subtitle}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-serif font-bold text-gold-400 text-sm">
                      ₹{product.price.toLocaleString()}
                    </td>

                    {/* Units Sold */}
                    <td className="p-4 text-sand-200 font-bold">
                      {product.soldCount || 0} units
                    </td>

                    {/* Remaining Stock with Quick +/- Adjust */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onStockUpdate(product.id, Math.max(0, product.stock - 1))}
                          className="w-6 h-6 rounded bg-white/10 text-sand-200 hover:bg-white/20 flex items-center justify-center font-bold"
                          title="Decrease Stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-serif font-bold text-sand-100 w-8 text-center">
                          {product.stock}
                        </span>
                        <button
                          onClick={() => onStockUpdate(product.id, product.stock + 1)}
                          className="w-6 h-6 rounded bg-white/10 text-sand-200 hover:bg-white/20 flex items-center justify-center font-bold"
                          title="Increase Stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30 text-[10px] font-bold uppercase">
                          <AlertTriangle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-terracotta-600/20 text-terracotta-400 border border-terracotta-600/30 text-[10px] font-bold uppercase">
                          <AlertTriangle className="w-3 h-3" />
                          Low ({product.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-600/20 text-green-400 border border-green-600/30 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock ({product.stock})
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-gold-500 text-sand-200 hover:text-obsidian transition-colors border border-white/10"
                          title="Alter Photo & Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                              onDelete(product.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-600 text-sand-200 hover:text-white transition-colors border border-white/10"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
