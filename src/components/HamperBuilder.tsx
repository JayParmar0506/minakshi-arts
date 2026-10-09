"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HAMPER_OPTIONS } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { Gift, Check, Sparkles, Box, Flame, Feather, Plus, ArrowRight } from "lucide-react";

export const HamperBuilder: React.FC = () => {
  const { addCustomHamperToCart } = useShop();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Selected State
  const [selectedBox, setSelectedBox] = useState(HAMPER_OPTIONS.boxes[0]);
  const [selectedTrio, setSelectedTrio] = useState(HAMPER_OPTIONS.candleTrios[0]);
  const [selectedAdditions, setSelectedAdditions] = useState<string[]>([
    HAMPER_OPTIONS.additions[0].id,
    HAMPER_OPTIONS.additions[2].id,
  ]);
  const [customMessage, setCustomMessage] = useState("Wishing you and your loved ones a joyful, prosperous, and illuminated Diwali!");

  const toggleAddition = (id: string) => {
    setSelectedAdditions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Price Calculation
  const additionsPrice = selectedAdditions.reduce((sum, addId) => {
    const item = HAMPER_OPTIONS.additions.find((a) => a.id === addId);
    return sum + (item ? item.price : 0);
  }, 0);

  const rawTotalPrice = selectedBox.price + selectedTrio.price + additionsPrice;
  const festiveDiscount = Math.round(rawTotalPrice * 0.15); // 15% Festive Gifting Discount
  const finalTotalPrice = rawTotalPrice - festiveDiscount;

  const handleAddHamper = () => {
    const additionsNames = selectedAdditions
      .map((id) => HAMPER_OPTIONS.additions.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[];

    addCustomHamperToCart({
      boxName: selectedBox.name,
      trioName: selectedTrio.name,
      additions: additionsNames,
      totalPrice: finalTotalPrice,
      customMessage: customMessage.trim() ? customMessage : undefined,
    });
  };

  return (
    <section id="hamper-builder" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
          <Gift className="w-4 h-4 text-gold-400" />
          <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold">
            Interactive Diwali Gifting Studio
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-sand-50">
          Build Your Own <span className="text-gold-400">Bespoke Hamper</span>
        </h2>
        <p className="text-sand-300/80 text-sm font-light">
          Curate a personalized luxury gift box in 3 effortless steps. Includes custom 24K gold foil handwritten message card & signature Minakshi Arts velvet ribbon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3-Step Builder Selector */}
        <div className="lg:col-span-7 space-y-8">
          {/* Steps Indicator Bar */}
          <div className="flex items-center justify-between glass-panel p-2 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveStep(1)}
              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeStep === 1
                  ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-md"
                  : "text-sand-300 hover:text-white"
              }`}
            >
              <Box className="w-4 h-4" />
              <span>1. Choose Box</span>
            </button>
            <button
              onClick={() => setActiveStep(2)}
              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeStep === 2
                  ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-md"
                  : "text-sand-300 hover:text-white"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>2. Candle Trio</span>
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeStep === 3
                  ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-md"
                  : "text-sand-300 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>3. Keepsake & Card</span>
            </button>
          </div>

          {/* Step 1: Choose Box */}
          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="font-serif text-xl font-bold text-sand-100 flex items-center gap-2">
                Step 1: Select Luxury Presentation Packaging
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HAMPER_OPTIONS.boxes.map((box) => {
                  const isSelected = selectedBox.id === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative group ${
                        isSelected
                          ? "border-gold-400 bg-gold-500/10 shadow-lg shadow-gold-500/10"
                          : "border-white/10 hover:border-gold-500/40"
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                        <img src={box.image} alt={box.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-sand-100">{box.name}</h4>
                          <p className="text-xs text-sand-300/80 font-light mt-1">{box.desc}</p>
                        </div>
                        <span className="font-serif font-bold text-gold-400 text-sm">
                          ₹{box.price.toLocaleString()}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold-400 text-obsidian flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 rounded-full bg-gold-500 text-obsidian font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors flex items-center gap-2"
                >
                  <span>Next: Choose Candle Trio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Candle Trio */}
          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="font-serif text-xl font-bold text-sand-100 flex items-center gap-2">
                Step 2: Choose Fragrance & Diya Trio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HAMPER_OPTIONS.candleTrios.map((trio) => {
                  const isSelected = selectedTrio.id === trio.id;
                  return (
                    <div
                      key={trio.id}
                      onClick={() => setSelectedTrio(trio)}
                      className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                        isSelected
                          ? "border-gold-400 bg-gold-500/10 shadow-lg shadow-gold-500/10"
                          : "border-white/10 hover:border-gold-500/40"
                      }`}
                    >
                      <div>
                        <div className="aspect-square rounded-xl overflow-hidden mb-3">
                          <img src={trio.image} alt={trio.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <h4 className="font-serif font-bold text-sand-100 text-sm mb-1">{trio.name}</h4>
                        <p className="text-[11px] text-sand-300/80 font-light mb-3">{trio.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="font-serif font-bold text-gold-400 text-xs">
                          ₹{trio.price.toLocaleString()}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-gold-400 uppercase font-bold">Selected</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-3 rounded-full glass-panel text-sand-200 text-xs uppercase font-bold tracking-wider hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-3 rounded-full bg-gold-500 text-obsidian font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors flex items-center gap-2"
                >
                  <span>Next: Add Keepsake & Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Add Keepsake & Card */}
          {activeStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="font-serif text-xl font-bold text-sand-100">
                Step 3: Select Miniatures & Custom Greeting Card
              </h3>

              {/* Additions list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HAMPER_OPTIONS.additions.map((add) => {
                  const isSelected = selectedAdditions.includes(add.id);
                  return (
                    <div
                      key={add.id}
                      onClick={() => toggleAddition(add.id)}
                      className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative group ${
                        isSelected
                          ? "border-gold-400 bg-gold-500/10 shadow-lg"
                          : "border-white/10 hover:border-gold-500/40"
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-3">
                        <img src={add.image} alt={add.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="font-serif font-bold text-sand-100 text-xs mb-1">{add.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-serif font-bold text-gold-400 text-xs">
                          +₹{add.price.toLocaleString()}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? "bg-gold-400 text-obsidian" : "bg-white/10 text-sand-300"
                          }`}
                        >
                          {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Personalized Card Message Input */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-gold-400 font-serif text-sm font-bold">
                  <Feather className="w-4 h-4" />
                  <span>24K Gold Foil Handwritten Message Card</span>
                </div>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  maxLength={180}
                  placeholder="Write your custom Diwali greeting..."
                  className="w-full p-3.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 text-xs placeholder:text-sand-400 focus:outline-none focus:border-gold-400 font-sans leading-relaxed resize-none"
                />
                <div className="flex justify-between text-[11px] text-sand-400">
                  <span>Calligraphy team will hand-write this on cotton parchment</span>
                  <span>{customMessage.length}/180 chars</span>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 rounded-full glass-panel text-sand-200 text-xs uppercase font-bold tracking-wider hover:bg-white/5"
                >
                  Back to Trios
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Real-time Hamper Preview & Summary */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif text-xl font-bold text-sand-50 flex items-center gap-2">
                <Gift className="w-5 h-5 text-gold-400" />
                <span>Bespoke Gift Preview</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-terracotta-600/90 text-white text-[10px] font-bold uppercase tracking-wider">
                15% Festive Discount
              </span>
            </div>

            {/* Assembled Items List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-sand-400 block text-[10px] uppercase tracking-wider">Packaging</span>
                  <span className="font-serif font-bold text-sand-100">{selectedBox.name}</span>
                </div>
                <span className="font-serif text-sand-300">₹{selectedBox.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-sand-400 block text-[10px] uppercase tracking-wider">Candle Trio</span>
                  <span className="font-serif font-bold text-sand-100">{selectedTrio.name}</span>
                </div>
                <span className="font-serif text-sand-300">₹{selectedTrio.price.toLocaleString()}</span>
              </div>

              {selectedAdditions.length > 0 && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <span className="text-sand-400 block text-[10px] uppercase tracking-wider">Miniatures & Card</span>
                  {selectedAdditions.map((id) => {
                    const item = HAMPER_OPTIONS.additions.find((a) => a.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex items-center justify-between text-sand-200">
                        <span>• {item.name}</span>
                        <span className="font-serif">₹{item.price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-sand-300">
                <span>Items Subtotal</span>
                <span>₹{rawTotalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gold-400 font-medium">
                <span>Diwali Gifting Discount (15%)</span>
                <span>-₹{festiveDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                <span className="font-serif text-base font-bold text-sand-100">Total Gift Value</span>
                <span className="font-serif text-2xl font-bold text-gold-400">
                  ₹{finalTotalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add Hamper to Cart CTA */}
            <button
              onClick={handleAddHamper}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Add Customized Hamper to Bag</span>
            </button>

            <p className="text-[11px] text-center text-sand-400 font-light">
              Includes complimentary brass diya lighter matches & velvet dustbag.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
