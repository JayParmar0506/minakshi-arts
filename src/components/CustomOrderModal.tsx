"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { X, Crown, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CustomOrderModal: React.FC = () => {
  const { isCustomOrderOpen, setIsCustomOrderOpen, showToast, triggerCelebration } = useShop();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Corporate Diwali Gifting",
    quantityOrDimensions: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isCustomOrderOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    triggerCelebration();
    showToast("Custom Order Request Submitted Successfully!");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsCustomOrderOpen(false);
            setSubmitted(false);
          }}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-xl w-full glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl z-10 overflow-hidden my-auto"
        >
          <button
            onClick={() => {
              setIsCustomOrderOpen(false);
              setSubmitted(false);
            }}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-sand-200"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-400 text-obsidian flex items-center justify-center mx-auto shadow-lg shadow-gold-500/30">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-sand-50">
                Inquiry Received
              </h3>
              <p className="text-sand-300 text-xs max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to Minakshi Arts Bespoke Concierge. Our lead designer will contact you within 4 business hours to discuss your custom specifications.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setIsCustomOrderOpen(false);
                }}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian font-bold text-xs uppercase tracking-wider hover:bg-gold-400"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                  <Crown className="w-4 h-4" />
                  <span>Bespoke Concierge & Corporate Gifting</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-sand-50">
                  Request Custom <span className="text-gold-400">Commission</span>
                </h2>
                <p className="text-sand-300/80 text-xs font-light">
                  Commission custom size relief murals, custom scent formulations, or corporate festive hamper suites (50+ units).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-sand-300 mb-1 font-medium">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-sand-300 mb-1 font-medium">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ananya@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-sand-300 mb-1 font-medium">Phone / WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-sand-300 mb-1 font-medium">Project Scope *</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400 cursor-pointer"
                  >
                    <option value="Corporate Diwali Gifting">Corporate Diwali Hampers (50+)</option>
                    <option value="Custom Size Wall Relief Mural">Custom Wall Relief Mural</option>
                    <option value="Luxury Hotel & Villa Interiors">Hotel / Villa Decor Project</option>
                    <option value="Bespoke Sculpture Commission">Bespoke Idol / Sculpture</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-sand-300 mb-1 font-medium">
                  Quantity / Dimensions / Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Provide any specific dimensions, branding logo embossing requests, or deadline notes..."
                  className="w-full p-3.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Custom Inquiry</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
