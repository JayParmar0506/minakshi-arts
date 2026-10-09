"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { X, Lock, Mail, User, Crown, Flame, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { showToast, triggerCelebration, setUser } = useShop();

  const [activeTab, setActiveTab] = useState<"client" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = email.trim() || "valuable.client@prabhastudio.com";
    setLoggedInUser(userEmail);
    triggerCelebration();
    showToast(`Welcome back, ${userEmail.split("@")[0]}!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleQuickAdminLogin = () => {
    setUser({
      name: "Jayshanti Sharma (Admin)",
      email: "jayshanti567@gmail.com",
      role: "admin",
      authProvider: "email",
    });
    triggerCelebration();
    showToast("Authenticated as Minakshi Arts Admin!");
    window.location.href = "/admin";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-md cursor-pointer"
        />

        <div className="relative max-w-md w-full glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl z-10 overflow-hidden my-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-sand-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {loggedInUser ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-400 text-obsidian flex items-center justify-center mx-auto shadow-lg shadow-gold-500/30">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-sand-50">
                Authentication Successful
              </h3>
              <p className="text-sand-300 text-xs font-light">
                Logged in as <strong className="text-gold-400">{loggedInUser}</strong>
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian font-bold text-xs uppercase tracking-wider hover:bg-gold-400 cursor-pointer"
              >
                Continue Browsing Drops
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 via-diya-amber to-terracotta-600 p-[1px] mb-1">
                  <div className="w-full h-full bg-obsidian rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-gold-400 fill-diya-amber/30 animate-flame-pulse" />
                  </div>
                </div>
                <h2 className="font-serif text-2xl font-bold text-sand-50">
                  MINAKSHI <span className="text-gold-400">ARTS</span> Access
                </h2>
                <p className="text-xs text-sand-300 font-light">
                  Sign in to manage your festive hampers or access the admin portal.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex rounded-xl bg-obsidian/60 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("client")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === "client"
                      ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-md"
                      : "text-sand-300 hover:text-white"
                  }`}
                >
                  Client Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("admin")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === "admin"
                      ? "bg-gradient-to-r from-gold-500 to-terracotta-600 text-obsidian shadow-md"
                      : "text-sand-300 hover:text-white"
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </div>

              {/* Client Login Form */}
              {activeTab === "client" ? (
                <form onSubmit={handleClientLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-sand-300 mb-1 font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 placeholder:text-sand-400 focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-sand-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-white/20 bg-obsidian text-gold-400" />
                      <span>Remember Me</span>
                    </label>
                    <a href="#" className="text-gold-400 hover:underline">Forgot Password?</a>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In to VIP Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-[11px] text-sand-400">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setEmail("festive.client@prabhastudio.com");
                        setPassword("festive2026");
                      }}
                      className="text-gold-400 font-semibold underline cursor-pointer"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                </form>
              ) : (
                /* Admin Login Section */
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-sand-200 space-y-2">
                    <div className="flex items-center gap-2 text-gold-400 font-bold font-serif">
                      <Crown className="w-4 h-4" />
                      <span>Admin Concierge Authentication</span>
                    </div>
                    <p className="text-[11px] text-sand-300 font-light leading-relaxed">
                      Access live inventory management, sales analytics, stock counters, and alter product photos.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Enter Admin Dashboard (/admin)</span>
                  </button>

                  <div className="text-center pt-2">
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className="text-[11px] text-gold-400 hover:underline font-semibold"
                    >
                      Direct Link: /admin
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
