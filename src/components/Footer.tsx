"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Flame, Mail, Sparkles, ArrowRight, ShieldCheck, Truck, Crown, Instagram, Facebook, Youtube } from "lucide-react";

export const Footer: React.FC = () => {
  const { showToast, setIsCareGuideOpen, setIsCustomOrderOpen } = useShop();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast("Subscribed! Check your inbox for Festive VIP Early Access Code.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-obsidian border-t border-white/10 pt-20 pb-10 px-4 sm:px-8 relative overflow-hidden grain-bg">
      {/* Background Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-radial-diya opacity-30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl glass-panel border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sand-100 text-sm">100% Organic Soy</h4>
              <p className="text-xs text-sand-400 font-light">Lead-free unbleached cotton wicks</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sand-100 text-sm">Pan-India Express Shipping</h4>
              <p className="text-xs text-sand-400 font-light">Shockproof velvet-lined packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sand-100 text-sm">Handcrafted Guarantee</h4>
              <p className="text-xs text-sand-400 font-light">Supporting traditional Indian master artisans</p>
            </div>
          </div>
        </div>

        {/* Newsletter VIP Box */}
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-gold-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Festive VIP Early Access</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50">
              Unlock Limited Drops & Secret Diwali Codes
            </h3>
            <p className="text-sand-300 text-xs font-light">
              Subscribe to receive exclusive access to new wall mural drops and a 15% VIP discount code for your first order.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto max-w-md">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3.5 rounded-2xl bg-obsidian/80 border border-white/10 text-sand-100 text-xs placeholder:text-sand-400 focus:outline-none focus:border-gold-400 font-sans"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Join VIP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-8 border-t border-white/10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-terracotta-600 p-[1px]">
                <div className="w-full h-full bg-obsidian rounded-full flex items-center justify-center">
                  <Flame className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <span className="font-serif text-lg font-bold tracking-widest text-sand-100">
                MINAKSHI <span className="text-gold-400">ARTS</span>
              </span>
            </div>
            <p className="text-sand-300/80 text-xs font-light leading-relaxed">
              Bespoke textured clay murals, architectural soy wax candles, and sacred sculptures for modern luxury sanctuaries.
            </p>
            <div className="flex items-center gap-3 text-sand-300 pt-2">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:text-gold-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:text-gold-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:text-gold-400 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sand-100 text-sm">Collections</h4>
            <ul className="space-y-2 text-xs text-sand-300 font-light">
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Textured Wall Relief Murals</a></li>
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Architectural Soy Candles</a></li>
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Hammered Brass Urlis & Diyas</a></li>
              <li><a href="#collections" className="hover:text-gold-400 transition-colors">Minimalist Ganesha Sculptures</a></li>
            </ul>
          </div>

          {/* Services & Custom */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sand-100 text-sm">Client Concierge</h4>
            <ul className="space-y-2 text-xs text-sand-300 font-light">
              <li><a href="#hamper-builder" className="hover:text-gold-400 transition-colors">Build-Your-Own-Hamper Studio</a></li>
              <li><button onClick={() => setIsCustomOrderOpen(true)} className="hover:text-gold-400 transition-colors text-left cursor-pointer">Corporate Diwali Gifting</button></li>
              <li><button onClick={() => setIsCustomOrderOpen(true)} className="hover:text-gold-400 transition-colors text-left cursor-pointer">Custom Size Wall Commissions</button></li>
              <li><button onClick={() => setIsCareGuideOpen(true)} className="hover:text-gold-400 transition-colors text-left cursor-pointer">Mural Installation Guide</button></li>
            </ul>
          </div>

          {/* Heritage & Studio */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sand-100 text-sm">Heritage & Admin</h4>
            <ul className="space-y-2 text-xs text-sand-300 font-light">
              <li><a href="#artisan-story" className="hover:text-gold-400 transition-colors">Gujarat Artisan Collective</a></li>
              <li><button onClick={() => setIsCareGuideOpen(true)} className="hover:text-gold-400 transition-colors text-left cursor-pointer">Soy Candle Burn & Care Tips</button></li>
              <li>
                <Link href="/admin" className="text-gold-400 font-bold hover:text-sand-50 transition-colors flex items-center gap-1.5 pt-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Admin Inventory & Analytics</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-sand-400 gap-4">
          <p>© 2026 Minakshi Arts Artisanal Luxe Ltd. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-gold-400 hover:underline font-semibold">Admin Portal</Link>
            <a href="#" className="hover:text-sand-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sand-200 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
