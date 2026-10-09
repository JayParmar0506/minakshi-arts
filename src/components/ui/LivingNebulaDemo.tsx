"use client";

import React from "react";
import LivingNebula from "@/components/ui/living-nebula-2";

export const LivingNebulaDemo: React.FC = () => (
  <LivingNebula
    particleCount={1200}
    trailLength={0.15}
    canvasGlow={20}
    className="flex flex-col items-center justify-center text-center px-4 py-8"
  >
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-5xl sm:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-300 to-amber-500 tracking-tight drop-shadow-lg">
        Living Nebula
      </h1>
      <p className="mt-4 text-lg text-sand-200 max-w-xl leading-relaxed font-sans">
        A generative star nursery that pulses with creative energy at the heart of the cosmos.
      </p>
      <button className="mt-8 px-8 py-4 bg-gradient-to-r from-gold-500/20 via-diya-amber/30 to-terracotta-600/30 text-gold-300 font-bold text-xs uppercase tracking-widest rounded-full backdrop-blur-md border border-gold-500/40 shadow-2xl hover:bg-gold-500/40 hover:text-white transition-all cursor-pointer">
        Witness Creation
      </button>
    </div>
  </LivingNebula>
);

export default LivingNebulaDemo;
