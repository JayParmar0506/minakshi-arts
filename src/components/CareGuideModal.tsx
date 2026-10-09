"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { X, BookOpen, Flame, Sparkles, Sun, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CareGuideModal: React.FC = () => {
  const { isCareGuideOpen, setIsCareGuideOpen } = useShop();

  if (!isCareGuideOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCareGuideOpen(false)}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-2xl w-full glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl z-10 overflow-hidden my-auto"
        >
          <button
            onClick={() => setIsCareGuideOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-sand-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-sand-50">
                  Artisan Care & Preservation Guide
                </h2>
                <p className="text-xs text-sand-300 font-sans">
                  How to maintain the longevity of your handcrafted Minakshi Arts creations.
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Soy Candle Care */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-gold-400 font-serif font-bold text-sm">
                  <Flame className="w-4 h-4 text-diya-amber" />
                  <span>Soy Wax & Architectural Candle Burn Tips</span>
                </div>
                <ul className="text-xs text-sand-300 space-y-1.5 list-disc pl-5 font-light">
                  <li>
                    <strong>The Memory Burn:</strong> On your first burn, allow the candle wax to melt completely across the top edge (approx. 2-3 hours) to prevent tunneling.
                  </li>
                  <li>
                    <strong>Wick Trimming:</strong> Trim unbleached cotton wicks to 1/4 inch before every reigniting for a clean, smoke-free flame.
                  </li>
                  <li>
                    <strong>Draft Protection:</strong> Keep burning candles away from open windows and ceiling fans to preserve burn time.
                  </li>
                </ul>
              </div>

              {/* Relief Mural Care */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-gold-400 font-serif font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Textured 3D Wall Relief & 24K Gold Leaf Care</span>
                </div>
                <ul className="text-xs text-sand-300 space-y-1.5 list-disc pl-5 font-light">
                  <li>
                    <strong>Dusting:</strong> Lightly dust the tactile relief grooves using a dry soft microfiber cloth or feather brush.
                  </li>
                  <li>
                    <strong>Chemical Avoidance:</strong> Never apply liquid household sprays or abrasive chemical solvents to 24K gold leaf detailing.
                  </li>
                  <li>
                    <strong>Mounting:</strong> Ensure heavy murals are mounted on solid wall studs using the included heavy-duty brass anchors.
                  </li>
                </ul>
              </div>

              {/* Brass & Terracotta Care */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-gold-400 font-serif font-bold text-sm">
                  <Sun className="w-4 h-4 text-terracotta-500" />
                  <span>Brass Urlis & Terracotta Idol Maintenance</span>
                </div>
                <ul className="text-xs text-sand-300 space-y-1.5 list-disc pl-5 font-light">
                  <li>
                    <strong>Brass Restoring:</strong> To restore golden brilliance to vintage brass urlis, gently rub with natural lemon juice and sea salt or Pitambari paste.
                  </li>
                  <li>
                    <strong>Terracotta Patina:</strong> Natural clay idols develop a rich organic patina over time. Keep dry and store in soft cloth when not displayed.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsCareGuideOpen(false)}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian font-bold text-xs uppercase tracking-wider hover:bg-gold-400"
              >
                Got It
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
