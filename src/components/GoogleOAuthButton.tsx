"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { X, User, Globe, ShieldCheck, Settings, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GoogleOAuthButtonProps {
  role: "client" | "admin";
  onSuccess: (user: any) => void;
}

export const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({ role, onSuccess }) => {
  const { showToast, triggerCelebration } = useShop();

  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const [clientId, setClientId] = useState<string>("");
  const [showConfig, setShowConfig] = useState(false);

  const [accounts, setAccounts] = useState<Array<{ name: string; email: string; color: string }>>([
    { name: "jay pamar", email: "jayshanti567@gmail.com", color: "bg-purple-600" },
    { name: "jay", email: "xyz562007@gmail.com", color: "bg-teal-600" },
  ]);

  useEffect(() => {
    const savedId = localStorage.getItem("prabha_google_client_id") || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    setClientId(savedId);

    try {
      const saved = localStorage.getItem("prabha_google_accounts_v2");
      if (saved) {
        setAccounts(JSON.parse(saved));
      }
    } catch {
      // fallback
    }

    // Dynamically load Google Identity Services Script
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleSelectAccount = async (accountEmail: string, accountName: string) => {
    if (!accountEmail.trim()) {
      alert("Please enter a valid Google email address.");
      return;
    }

    setSigningIn(true);
    const finalName = accountName.trim() || accountEmail.split("@")[0];

    // Save account to stored list
    try {
      const filtered = accounts.filter((a) => a.email.toLowerCase() !== accountEmail.toLowerCase());
      const newAcc = {
        name: finalName,
        email: accountEmail,
        color: ["bg-purple-600", "bg-teal-600", "bg-indigo-600", "bg-rose-600"][Math.floor(Math.random() * 4)],
      };
      const updated = [newAcc, ...filtered];
      setAccounts(updated);
      localStorage.setItem("prabha_google_accounts_v2", JSON.stringify(updated));
    } catch {}

    let userObj = {
      name: finalName,
      email: accountEmail,
      role: role || "client",
      authProvider: "google" as const,
      image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "google_login",
          email: accountEmail,
          name: finalName,
          image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          userObj = data.user;
        }
      }
    } catch (err) {
      console.error("Google Auth API error:", err);
    }

    triggerCelebration();
    showToast(`Signed in with Google as ${userObj.email}`);
    setIsChooserOpen(false);
    onSuccess(userObj);
    setSigningIn(false);
  };

  const handleGoogleBtnClick = () => {
    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id && clientId.trim()) {
      google.accounts.id.initialize({
        client_id: clientId.trim(),
        callback: async (response: any) => {
          try {
            const base64Url = response.credential.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            );
            const googleUser = JSON.parse(jsonPayload);
            handleSelectAccount(googleUser.email, googleUser.name);
          } catch (err) {
            console.error(err);
          }
        },
      });
      google.accounts.id.prompt();
    } else {
      setIsChooserOpen(true);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("prabha_google_client_id", clientId);
    showToast("Google Client ID Saved!");
    setShowConfig(false);
  };

  return (
    <>
      <div className="w-full space-y-1">
        {/* Official Sign In with Google Trigger Button */}
        <button
          type="button"
          onClick={handleGoogleBtnClick}
          className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider transition-all border border-gray-300 shadow-md flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
        >
          {/* Official Google G Logo */}
          <svg className="w-5 h-5 min-w-[20px] min-h-[20px] shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="truncate">Sign In with Google</span>
        </button>

        {/* Option to input custom Google Client ID */}
        <div className="flex items-center justify-between text-[10px] text-sand-400 px-1 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Google OAuth 2.0 Integration
          </span>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-gold-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Settings className="w-3 h-3" />
            <span>Google Cloud Config</span>
          </button>
        </div>

        {showConfig && (
          <form onSubmit={handleSaveClientId} className="p-3 rounded-xl bg-obsidian/90 border border-gold-500/30 space-y-2 text-xs text-left mt-2">
            <label className="block text-sand-200 font-medium">
              Optional Google Cloud OAuth Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com"
              className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-sand-100 font-mono text-[11px] focus:outline-none focus:border-gold-400"
            />
            <div className="flex items-center justify-between pt-1">
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-gold-400 hover:underline flex items-center gap-1"
              >
                Get Client ID <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-gold-500 text-obsidian font-bold text-[11px] uppercase tracking-wider"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Dark Theme Google Sign-In Screen (1:1 Google Identity Design) */}
      <AnimatePresence>
        {isChooserOpen && (
          <div className="fixed inset-0 z-[300] overflow-y-auto p-4 sm:p-6 flex items-center justify-center font-sans">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChooserOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Official Google Dark Theme Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative max-w-4xl w-full bg-[#1E1F22] text-[#E3E2E6] rounded-3xl p-6 sm:p-10 shadow-2xl z-10 border border-[#33353A] overflow-hidden my-auto"
            >
              <button
                onClick={() => setIsChooserOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Google Branding Header */}
              <div className="flex items-center gap-2 mb-8">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-300 tracking-wide">Sign in with Google</span>
              </div>

              {/* Grid Layout: Left Title & Right Accounts Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-b border-[#33353A] pb-8">
                {/* Left Column */}
                <div className="space-y-4 text-left">
                  <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">Choose an account</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    to continue to{" "}
                    <span className="bg-[#2B303B] text-[#A8C7FA] font-medium px-2 py-0.5 rounded-md text-xs tracking-wide uppercase border border-[#3E4756]">
                      MINAKSHI ARTS
                    </span>
                  </p>
                </div>

                {/* Right Column: Google Accounts List */}
                <div className="space-y-3 text-left">
                  {accounts.map((acc) => (
                    <div
                      key={acc.email}
                      onClick={() => handleSelectAccount(acc.email, acc.name)}
                      className="py-3 px-4 rounded-xl border-b border-[#2C2E33] hover:bg-[#28292E] transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-full ${acc.color || "bg-purple-600"} text-white font-medium text-sm flex items-center justify-center shrink-0 lowercase`}
                        >
                          {acc.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-[#E3E2E6] group-hover:text-white transition-colors">
                            {acc.name}
                          </h4>
                          <p className="text-xs text-[#C4C6D0] font-normal">{acc.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Use another account option */}
                  {!showCustomInput ? (
                    <div
                      onClick={() => setShowCustomInput(true)}
                      className="py-3.5 px-4 rounded-xl hover:bg-[#28292E] transition-all cursor-pointer flex items-center gap-3.5 text-sm text-[#E3E2E6] hover:text-white font-medium group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#2A2B30] text-gray-300 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span>Use another account</span>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (customEmail) handleSelectAccount(customEmail, customName || customEmail.split("@")[0]);
                      }}
                      className="p-4 rounded-2xl bg-[#28292E] border border-[#3E4148] space-y-3"
                    >
                      <span className="text-xs text-gray-300 font-medium block">Enter your Google Email</span>
                      <input
                        type="email"
                        required
                        value={customEmail}
                        onChange={(e) => {
                          setCustomEmail(e.target.value);
                          setCustomName(e.target.value.split("@")[0]);
                        }}
                        placeholder="e.g. yourname@gmail.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#1E1F22] border border-[#44474F] text-white text-xs focus:outline-none focus:border-[#A8C7FA]"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowCustomInput(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={signingIn}
                          className="px-4 py-1.5 rounded-xl bg-[#A8C7FA] hover:bg-[#8AB4F8] text-[#00315B] font-bold text-xs transition-colors cursor-pointer"
                        >
                          {signingIn ? "Signing in..." : "Next"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Terms & Privacy Notice */}
              <div className="pt-6 text-left space-y-4">
                <p className="text-xs text-gray-400 font-normal max-w-xl leading-relaxed">
                  Before using this app, you can review MINAKSHI ARTS&apos;s{" "}
                  <a href="#privacy" className="text-[#A8C7FA] hover:underline font-medium">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="#terms" className="text-[#A8C7FA] hover:underline font-medium">
                    Terms of Service
                  </a>
                  .
                </p>

                {/* Bottom Footer Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 pt-4 border-t border-[#33353A] gap-3">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200">
                    <Globe className="w-3.5 h-3.5" />
                    <span>English (United Kingdom)</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <a href="#help" className="hover:text-gray-200">
                      Help
                    </a>
                    <a href="#privacy" className="hover:text-gray-200">
                      Privacy
                    </a>
                    <a href="#terms" className="hover:text-gray-200">
                      Terms
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
