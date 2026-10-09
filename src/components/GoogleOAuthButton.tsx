"use client";

import React, { useState, useEffect, useRef } from "react";
import { useShop } from "@/context/ShopContext";
import { ShieldCheck, Settings, ExternalLink } from "lucide-react";

interface GoogleOAuthButtonProps {
  role: "client" | "admin";
  onSuccess: (user: any) => void;
}

export const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({ role, onSuccess }) => {
  const { showToast, triggerCelebration } = useShop();

  const [signingIn, setSigningIn] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [showConfig, setShowConfig] = useState(false);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear legacy mock accounts from localStorage
    try {
      localStorage.removeItem("prabha_google_accounts");
      localStorage.removeItem("prabha_google_accounts_v2");
    } catch {}

    const savedId =
      localStorage.getItem("prabha_google_client_id") ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "1084930771359-sdla6pkakfct7nlq8ls8lf4badccad62.apps.googleusercontent.com";
    setClientId(savedId);

    // Check if redirected back from Google OAuth hash
    if (typeof window !== "undefined" && window.location.hash) {
      try {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const idToken = params.get("id_token");
        if (idToken) {
          const base64Url = idToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const googleUser = JSON.parse(jsonPayload);
          window.history.replaceState(null, "", window.location.pathname);
          completeGoogleLogin(googleUser.email, googleUser.name, googleUser.picture);
        }
      } catch (err) {
        console.error("OAuth token parse error:", err);
      }
    }

    // Dynamically load Google Identity Services Script
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleGSI(savedId);
      };
      document.head.appendChild(script);
    } else {
      initGoogleGSI(savedId);
    }
  }, []);

  const initGoogleGSI = (cid: string) => {
    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id && cid.trim()) {
      try {
        google.accounts.id.initialize({
          client_id: cid.trim(),
          callback: handleGoogleCredentialResponse,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = "";
          google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
          });
        }
      } catch (e) {
        console.error("GSI init error:", e);
      }
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
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
      completeGoogleLogin(googleUser.email, googleUser.name, googleUser.picture);
    } catch (err) {
      console.error(err);
    }
  };

  const completeGoogleLogin = async (email: string, name: string, image?: string) => {
    setSigningIn(true);
    const finalName = name || email.split("@")[0];

    let userObj = {
      name: finalName,
      email: email.trim(),
      role: role || "client",
      authProvider: "google" as const,
      image: image || "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "google_login",
          email: email.trim(),
          name: finalName,
          image: userObj.image,
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
    onSuccess(userObj);
    setSigningIn(false);
  };

  const openGoogleOAuthPopup = (cid: string) => {
    const redirectUri = window.location.origin;
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      cid
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${Date.now()}`;

    const width = 500;
    const height = 600;
    const left = typeof window !== "undefined" ? window.screenX + (window.innerWidth - width) / 2 : 100;
    const top = typeof window !== "undefined" ? window.screenY + (window.innerHeight - height) / 2 : 100;

    const popup = window.open(
      googleOAuthUrl,
      "GoogleSignIn",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      // If popup blocked by mobile browser, redirect full page to Google Consent screen
      window.location.href = googleOAuthUrl;
    }
  };

  const handleGoogleBtnClick = () => {
    const targetClientId =
      clientId.trim() || "1084930771359-sdla6pkakfct7nlq8ls8lf4badccad62.apps.googleusercontent.com";

    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.initialize({
          client_id: targetClientId,
          callback: handleGoogleCredentialResponse,
        });
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            openGoogleOAuthPopup(targetClientId);
          }
        });
        return;
      } catch (e) {
        console.error(e);
      }
    }

    openGoogleOAuthPopup(targetClientId);
  };

  return (
    <div className="w-full space-y-2">
      {/* 1 Single Official Sign In with Google Trigger Button */}
      <button
        type="button"
        disabled={signingIn}
        onClick={handleGoogleBtnClick}
        className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider transition-all border border-gray-300 shadow-md flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
      >
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
        <span>{signingIn ? "Connecting to Google..." : "Sign In with Google"}</span>
      </button>

    </div>
  );
};
