"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, ShieldCheck, Heart, Sparkles, Award } from "lucide-react";

export const ArtisanStory: React.FC = () => {
  const metrics = [
    { label: "Master Artisans Supported", value: "120+", desc: "Gujarat & Moradabad craft clusters" },
    { label: "Organic Soy Wax", value: "100%", desc: "Sustainably sourced, zero paraffin" },
    { label: "Festive Homes Lit", value: "15,000+", desc: "Pan-India & worldwide delivery" },
    { label: "Synthetic Toxins", value: "0%", desc: "Lead-free unbleached cotton wicks" },
  ];

  return (
    <section id="artisan-story" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Container */}
      <div className="glass-panel-gold rounded-3xl p-8 sm:p-14 border border-gold-500/30 relative overflow-hidden shadow-2xl">
        {/* Background Decorative Diya Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial-diya opacity-40 pointer-events-none blur-2xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
              <Award className="w-4 h-4 text-gold-400" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold">
                Our Heritage & Craftsmanship
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-sand-50 leading-tight">
              Preserving Century-Old <br />
              <span className="bg-gradient-to-r from-gold-300 via-diya-amber to-terracotta-500 bg-clip-text text-transparent">
                Indian Handloom & Relief Art
              </span>
            </h2>

            <p className="text-sand-200/90 text-sm sm:text-base font-light leading-relaxed">
              At Minakshi Arts, every candle is slow-poured by hand using unbleached organic soy wax infused with pure saffron, cardamom, and sandalwood steam-distilled essential oils.
            </p>
            <p className="text-sand-300/80 text-sm font-light leading-relaxed">
              Our textured 3D wall murals and Ganesha sculptures are individually hand-relief molded by traditional clay masters in Gujarat, keeping centuries of sacred temple iconography alive in modern living spaces.
            </p>

            {/* Quote Block */}
            <div className="p-6 rounded-2xl bg-obsidian/70 border-l-4 border-gold-400 border-white/5 space-y-2">
              <p className="font-serif italic text-sand-100 text-sm sm:text-base">
                "When a diya is poured with devotion, it illuminates not just a room, but the spirit of every home it touches."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-400 font-serif font-bold text-xs flex items-center justify-center">
                  RB
                </div>
                <div>
                  <span className="block text-xs font-bold text-sand-100 font-serif">Rajeshbhai Prajapati</span>
                  <span className="block text-[10px] text-sand-400">Master Sculptor • 3rd Generation Artisan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold-500/40 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=800"
                alt="Gujarati Relief Artisan at work"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-70" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-obsidian/80 backdrop-blur-md border border-white/10 text-xs">
                <div className="flex items-center gap-2 text-gold-400 font-bold mb-1 font-serif">
                  <Sparkles className="w-4 h-4" />
                  <span>Handcrafted in Small Batches</span>
                </div>
                <p className="text-sand-300 text-[11px] font-light">
                  Each piece requires up to 40 hours of patient carving, drying, and gold-leaf application.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-16 mt-16 border-t border-white/10 relative z-10">
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-gold-400 block">
                {metric.value}
              </span>
              <h4 className="font-serif font-bold text-sand-100 text-sm">{metric.label}</h4>
              <p className="text-sand-400 text-xs font-light">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
