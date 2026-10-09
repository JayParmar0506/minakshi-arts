"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import confetti from "canvas-confetti";

export interface UserSession {
  name: string;
  email: string;
  role: "client" | "admin";
  authProvider?: "email" | "google";
  image?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customDetails?: string;
}

export interface CustomHamperCartItem {
  id: string;
  boxName: string;
  trioName: string;
  additions: string[];
  totalPrice: number;
  customMessage?: string;
  quantity: number;
}

interface ShopContextType {
  user: UserSession | null;
  setUser: (u: UserSession | null) => void;
  logout: () => void;
  cart: CartItem[];
  customHampers: CustomHamperCartItem[];
  favorites: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCustomOrderOpen: boolean;
  setIsCustomOrderOpen: (open: boolean) => void;
  isCareGuideOpen: boolean;
  setIsCareGuideOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  addCustomHamperToCart: (hamper: Omit<CustomHamperCartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  removeCustomHamper: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  totalCartCount: number;
  subtotal: number;
  triggerCelebration: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserSession | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customHampers, setCustomHampers] = useState<CustomHamperCartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore user session on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("prabha_user_session");
      if (savedUser) {
        setUserState(JSON.parse(savedUser));
      }
    } catch {
      // safe fallback
    }
  }, []);

  const setUser = (u: UserSession | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("prabha_user_session", JSON.stringify(u));
    } else {
      localStorage.removeItem("prabha_user_session");
    }
  };

  const logout = () => {
    setUser(null);
    showToast("Signed out successfully.");
  };

  // Trigger festive gold confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#D4AF37", "#EA580C", "#FFF"],
      });
    } catch {
      // safe fallback
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: `cart-${product.id}`, product, quantity }];
    });
    showToast(`Added "${product.name}" to your Festive Cart`);
    triggerCelebration();
    setIsCartOpen(true);
  };

  const addCustomHamperToCart = (hamperData: Omit<CustomHamperCartItem, "id" | "quantity">) => {
    const newHamper: CustomHamperCartItem = {
      ...hamperData,
      id: `custom-hamper-${Date.now()}`,
      quantity: 1,
    };
    setCustomHampers((prev) => [...prev, newHamper]);
    showToast("Added your Custom Bespoke Hamper to Cart!");
    triggerCelebration();
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const removeCustomHamper = (id: string) => {
    setCustomHampers((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setCustomHampers([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed item from Favorites");
        return prev.filter((id) => id !== productId);
      }
      showToast("Added item to Favorites");
      return [...prev, productId];
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const totalCartCount =
    cart.reduce((sum, item) => sum + item.quantity, 0) +
    customHampers.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal =
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) +
    customHampers.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        user,
        setUser,
        logout,
        cart,
        customHampers,
        favorites,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCustomOrderOpen,
        setIsCustomOrderOpen,
        isCareGuideOpen,
        setIsCareGuideOpen,
        isLoginOpen,
        setIsLoginOpen,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        quickViewProduct,
        setQuickViewProduct,
        addToCart,
        addCustomHamperToCart,
        removeFromCart,
        removeCustomHamper,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        totalCartCount,
        subtotal,
        triggerCelebration,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
