"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Flame, Layers, Sun, ShieldAlert } from "lucide-react";

interface BentoGridProps {
  onSelectCategory: (category: string) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onSelectCategory }) => {
  return (
    <section id="collections" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-sand-50">
            Artisanal Mastery for <span className="text-gold-400">Festive Sanctuaries</span>
          </h2>
        </div>
        <p className="text-sand-300/80 text-sm max-w-md font-light">
          Explore our handcrafted categories created by master artisans across India, using 100% natural organic soy wax and hand-carved clay textures.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[340px]">
        {/* Card 1: Large (Spans 2 cols, 2 rows on desktop) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          onClick={() => onSelectCategory("murals")}
          className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold-500/50 cursor-pointer group shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200"
            alt="Hand-Carved Mural Art"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-full bg-gold-500/90 text-obsidian text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                Limited Edition of 50
              </span>
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-sand-100 group-hover:bg-gold-400 group-hover:text-obsidian transition-colors">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-3 max-w-xl">
              <span className="text-xs uppercase tracking-[0.2em] text-gold-300 font-semibold">
                Textured Clay & 24K Gold Leaf
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-sand-50">
                Hand-Carved Relief Mural Art
              </h3>
              <p className="text-sand-200/90 text-sm font-light leading-relaxed hidden sm:block">
                Tactile 3D wall reliefs capturing divine lotus motifs and cosmic geometry. Each piece is individually sculpted with Gujarat river clay and hand-gilded with genuine 24K gold foil.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Architectural Soy Candles (Medium) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          onClick={() => onSelectCategory("candles")}
          className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold-500/50 cursor-pointer group shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800"
            alt="Architectural Soy Candles"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-diya-amber/90 text-obsidian text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Diwali Bestseller
              </span>
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-sand-100 group-hover:bg-gold-400 group-hover:text-obsidian transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-sand-50">
                Architectural Soy Candles
              </h3>
              <p className="text-sand-300 text-xs font-light">
                Fluted pillars & lotus scents infused with royal saffron & sandalwood.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Artisanal Diyas & Urli Bowls (Medium) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          onClick={() => onSelectCategory("diyas")}
          className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold-500/50 cursor-pointer group shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800"
            alt="Artisanal Diyas & Urli Bowls"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-terracotta-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sun className="w-3 h-3" />
                Artisan Made
              </span>
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-sand-100 group-hover:bg-gold-400 group-hover:text-obsidian transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-sand-50">
                Artisanal Diyas & Urli Bowls
              </h3>
              <p className="text-sand-300 text-xs font-light">
                Hammered solid brass urlis & mogra scented floating wax diyas.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Sacred Sculptures & Ganeshas (Wide 3 cols on desktop) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          onClick={() => onSelectCategory("idols")}
          className="md:col-span-3 md:row-span-1 relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold-500/50 cursor-pointer group shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1400"
            alt="Sacred Sculptures & Ganeshas"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />

          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-gold-400/90 text-obsidian text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Heritage Craft
              </span>
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-sand-100 group-hover:bg-gold-400 group-hover:text-obsidian transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2 max-w-xl">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50">
                Sacred Sculptures & Minimalist Ganeshas
              </h3>
              <p className="text-sand-300 text-xs sm:text-sm font-light">
                Minimalist terracotta, antiqued bronze, and natural stone idols designed for contemporary prayer altars and luxury festive decor.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
