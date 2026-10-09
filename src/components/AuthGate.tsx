"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { GoogleOAuthButton } from "@/components/GoogleOAuthButton";
import LivingNebula from "@/components/ui/living-nebula-2";
import { Flame, Sparkles, Lock, Mail, User as UserIcon, Crown, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const AuthGate: React.FC = () => {
  const { user, setUser, showToast, triggerCelebration } = useShop();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"client" | "admin">("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already authenticated, do not render the wall
  if (user) return null;

  const handleGoogleSuccess = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    triggerCelebration();
    showToast(`Welcome ${authenticatedUser.name}!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const action = mode === "signup" ? "signup" : "email_login";
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerCelebration();
        setUser(data.user);
        showToast(`Welcome to Minakshi Arts, ${data.user.name}!`);
        if (data.user.role === "admin") {
          window.location.href = "/admin";
        }
      } else {
        alert(data.error || "Authentication failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGuest = (guestRole: "client" | "admin") => {
    const guestUser = {
      name: guestRole === "admin" ? "Jayshanti Sharma (Admin)" : "Festive Guest",
      email: guestRole === "admin" ? "jayshanti567@gmail.com" : "guest@minakshiarts.com",
      role: guestRole,
      authProvider: "email" as const,
    };
    triggerCelebration();
    setUser(guestUser);
    showToast(`Access Granted as ${guestUser.name}`);
    if (guestRole === "admin") {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-obsidian flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden w-full h-full max-w-full">
      {/* Living Nebula Interactive Particle Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80">
        <LivingNebula particleCount={1400} trailLength={0.16} canvasGlow={25} />
      </div>

      {/* Background Diya Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[700px] sm:h-[1000px] bg-radial-diya opacity-80 pointer-events-none animate-flame-pulse blur-3xl" />

      {/* Main Glassmorphic Auth Card */}
      <div className="relative max-w-lg w-full glass-panel-gold rounded-3xl p-6 sm:p-10 border border-gold-500/40 shadow-2xl z-10 my-auto text-left space-y-7">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 via-diya-amber to-terracotta-600 p-[1px] mb-1">
            <div className="w-full h-full bg-obsidian rounded-full flex items-center justify-center">
              <Flame className="w-7 h-7 text-gold-400 fill-diya-amber/30 animate-flame-pulse" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-sand-50 tracking-wide">
            MINAKSHI <span className="text-gold-400">ARTS</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-sand-300/80 font-sans">
            Handcrafted Festive Luxe • Authentication Gate
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex rounded-2xl bg-obsidian/70 p-1 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              role === "client"
                ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-md"
                : "text-sand-300 hover:text-white"
            }`}
          >
            Client Storefront Access
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === "admin"
                ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-md"
                : "text-sand-300 hover:text-white"
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Real Google Account Picker Button */}
        <GoogleOAuthButton role={role} onSuccess={handleGoogleSuccess} />

        <div className="flex items-center gap-3 text-sand-400 text-[11px] uppercase tracking-widest my-2">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span>Or Sign In with Email</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Email & Password Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === "signup" && (
            <div>
              <label className="block text-sand-300 mb-1 font-medium">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sand-300 mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@minakshiarts.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sand-300 mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === "signin" ? "Unlock Minakshi Arts" : "Create Account & Unlock"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode & VIP Quick Access */}
        <div className="space-y-3 pt-2 text-center text-xs">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-gold-400 hover:underline font-semibold cursor-pointer"
          >
            {mode === "signin" ? "Need an account? Sign Up Here" : "Already have an account? Sign In"}
          </button>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-sand-400">
            <span>Quick VIP Access:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickGuest("client")}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-sand-200 hover:text-gold-400 border border-white/10 cursor-pointer"
              >
                Client Pass
              </button>
              <button
                type="button"
                onClick={() => handleQuickGuest("admin")}
                className="px-3 py-1 rounded-full bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 cursor-pointer"
              >
                Admin Pass
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
