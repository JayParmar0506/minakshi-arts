"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { X, ShoppingBag, Trash2, Plus, Minus, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Phone, MapPin, CreditCard, Banknote, QrCode, Building2, ArrowLeft, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    customHampers,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    removeCustomHamper,
    updateQuantity,
    clearCart,
    subtotal,
    triggerCelebration,
    user,
    showToast,
  } = useShop();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "delivery">("cart");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Delivery Form State
  const [deliveryForm, setDeliveryForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    pincode: "",
    paymentMethod: "upi" as "cod" | "upi" | "card" | "netbanking",
  });
  const [formError, setFormError] = useState("");

  // Free Gift Progress (Free Brass Diya at ₹6,000)
  const freeGiftThreshold = 6000;
  const progressPercent = Math.min(100, (subtotal / freeGiftThreshold) * 100);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "DIWALI2026") {
      setDiscountPercent(15);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try 'DIWALI2026'");
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  const handleProceedToDelivery = () => {
    if (cart.length === 0 && customHampers.length === 0) return;
    setCheckoutStep("delivery");
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText("minakshiarts@upi");
    setCopiedUpi(true);
    showToast("UPI ID copied to clipboard!");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFinalCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryForm.phone || deliveryForm.phone.replace(/\D/g, "").length < 10) {
      setFormError("Compulsory 10-digit mobile phone number is required.");
      return;
    }

    if (!deliveryForm.address.trim() || !deliveryForm.pincode.trim()) {
      setFormError("Delivery address and pincode are required.");
      return;
    }

    setFormError("");
    setIsCheckingOut(true);
    triggerCelebration();

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      customHampers.forEach((h) => {
        orderItems.push({
          productId: "prabha-08",
          quantity: h.quantity,
          price: h.totalPrice,
        });
      });

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          customerName: deliveryForm.name || user?.name || "Festive Client",
          customerPhone: deliveryForm.phone,
          deliveryAddress: deliveryForm.address,
          pincode: deliveryForm.pincode,
          paymentMethod: deliveryForm.paymentMethod,
        }),
      });

      const data = await res.json();
      setCompletedOrderDetails({
        orderId: data?.order?.orderId || `ORD-${Date.now().toString().slice(-6)}`,
        phone: deliveryForm.phone,
        address: `${deliveryForm.address}, ${deliveryForm.pincode}`,
        paymentMethod: deliveryForm.paymentMethod,
        total: finalTotal,
      });

      setTimeout(() => {
        setIsCheckingOut(false);
        setOrderComplete(true);
        clearCart();
      }, 1200);
    } catch (err) {
      console.error("Order error:", err);
      setIsCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Slide-out Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        >
          <div className="w-screen max-w-md glass-panel-gold border-l border-gold-500/30 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            {orderComplete ? (
              /* Order Completed State */
              <div className="flex flex-col items-center justify-center my-auto text-center space-y-5 py-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-diya-amber flex items-center justify-center text-obsidian shadow-xl shadow-gold-500/30">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
                    Order #{completedOrderDetails?.orderId} Confirmed
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-sand-50">
                    Shubh Diwali!
                  </h3>
                  <p className="text-sand-300 text-xs max-w-xs mx-auto leading-relaxed">
                    Thank you for your order! Your handcrafted items will be dispatched to your delivery address shortly.
                  </p>
                </div>

                {/* If Payment is UPI: Display UPI QR Scanner Code */}
                {completedOrderDetails?.paymentMethod === "upi" && (
                  <div className="w-full p-4 rounded-2xl bg-white text-gray-900 text-center space-y-3 shadow-2xl border border-gold-500/40">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                      <QrCode className="w-4 h-4" />
                      <span>Scan & Pay via Any UPI App</span>
                    </div>

                    <div className="flex justify-center p-2 bg-gray-50 rounded-xl border border-gray-200">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=minakshiarts@upi&pn=Minakshi%20Arts&cu=INR&am=${completedOrderDetails?.total || finalTotal}`}
                        alt="UPI QR Code"
                        className="w-44 h-44 object-contain shadow-md rounded-lg"
                      />
                    </div>

                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-mono">
                      <span>UPI ID: <strong>minakshiarts@upi</strong></span>
                      <button onClick={copyUpiId} className="text-amber-600 font-bold hover:underline">
                        {copiedUpi ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-500 font-medium">
                      Accepts Google Pay, PhonePe, Paytm, BHIM UPI
                    </p>
                  </div>
                )}

                {/* Summary Info */}
                <div className="w-full text-left p-4 rounded-2xl bg-obsidian/70 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-sand-400">Payment Method</span>
                    <span className="font-bold text-gold-400 uppercase">
                      {completedOrderDetails?.paymentMethod === "cod" ? "Cash on Delivery (COD)" : completedOrderDetails?.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-sand-400">Contact Number</span>
                    <span className="font-bold text-sand-100">{completedOrderDetails?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-400">Delivery Address</span>
                    <span className="font-bold text-sand-100 max-w-[180px] text-right truncate">
                      {completedOrderDetails?.address}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setCheckoutStep("cart");
                    setIsCartOpen(false);
                  }}
                  className="px-8 py-3.5 rounded-full bg-gold-500 text-obsidian font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : checkoutStep === "delivery" ? (
              /* Step 2: Delivery Location & Payment Method Form */
              <div className="flex flex-col h-full justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="flex items-center gap-1.5 text-xs text-sand-300 hover:text-gold-400 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Bag</span>
                    </button>
                    <h2 className="font-serif text-lg font-bold text-sand-50">Delivery & Payment</h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-1 rounded-full text-sand-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form id="delivery-form" onSubmit={handleFinalCheckout} className="space-y-4 text-xs">
                    {/* Compulsory Delivery Details Section */}
                    <div className="space-y-3">
                      <span className="text-gold-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        Compulsory Delivery Location
                      </span>

                      <div>
                        <label className="block text-sand-300 mb-1 font-medium">Full Name *</label>
                        <input
                          required
                          type="text"
                          value={deliveryForm.name}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                        />
                      </div>

                      {/* Compulsory Phone Number */}
                      <div>
                        <label className="block text-sand-300 mb-1 font-medium flex items-center justify-between">
                          <span>Mobile Phone Number (Compulsory) *</span>
                          <span className="text-terracotta-400 text-[10px]">10 Digits</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                          <input
                            required
                            type="tel"
                            value={deliveryForm.phone}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian/80 border border-gold-500/40 text-sand-100 font-bold focus:outline-none focus:border-gold-400"
                          />
                        </div>
                      </div>

                      {/* Address & Pincode */}
                      <div>
                        <label className="block text-sand-300 mb-1 font-medium">Complete Delivery Address *</label>
                        <textarea
                          required
                          rows={2}
                          value={deliveryForm.address}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                          placeholder="House/Flat No., Building, Street Name, Landmark, City, State"
                          className="w-full p-3 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sand-300 mb-1 font-medium">Postal Pincode *</label>
                        <input
                          required
                          type="text"
                          value={deliveryForm.pincode}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, pincode: e.target.value })}
                          placeholder="e.g. 400050"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </div>

                    {/* Payment Options Section */}
                    <div className="space-y-3 pt-2">
                      <span className="text-gold-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Banknote className="w-4 h-4" />
                        Select Payment Method
                      </span>

                      <div className="grid grid-cols-2 gap-3">
                        {/* UPI */}
                        <div
                          onClick={() => setDeliveryForm({ ...deliveryForm, paymentMethod: "upi" })}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            deliveryForm.paymentMethod === "upi"
                              ? "border-gold-400 bg-gold-500/15"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <QrCode className="w-4 h-4 text-diya-amber" />
                            <input
                              type="radio"
                              name="payment"
                              checked={deliveryForm.paymentMethod === "upi"}
                              onChange={() => {}}
                              className="accent-gold-400"
                            />
                          </div>
                          <span className="font-serif font-bold text-sand-100 text-xs">UPI / QR Code</span>
                          <span className="text-[10px] text-sand-400">GPay, PhonePe, Paytm</span>
                        </div>

                        {/* COD */}
                        <div
                          onClick={() => setDeliveryForm({ ...deliveryForm, paymentMethod: "cod" })}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            deliveryForm.paymentMethod === "cod"
                              ? "border-gold-400 bg-gold-500/15"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Banknote className="w-4 h-4 text-gold-400" />
                            <input
                              type="radio"
                              name="payment"
                              checked={deliveryForm.paymentMethod === "cod"}
                              onChange={() => {}}
                              className="accent-gold-400"
                            />
                          </div>
                          <span className="font-serif font-bold text-sand-100 text-xs">Cash on Delivery</span>
                          <span className="text-[10px] text-sand-400">Pay cash upon arrival</span>
                        </div>
                      </div>

                      {/* Interactive UPI QR Code Scanner Box */}
                      {deliveryForm.paymentMethod === "upi" && (
                        <div className="p-4 rounded-2xl bg-white text-gray-900 text-center space-y-2 border border-gold-500/50 shadow-xl mt-2">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                            <QrCode className="w-4 h-4" />
                            <span>Scan QR Code to Pay ₹{finalTotal.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-center p-2 bg-gray-50 rounded-xl border border-gray-200">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=minakshiarts@upi&pn=Minakshi%20Arts&cu=INR&am=${finalTotal}`}
                              alt="UPI QR Code"
                              className="w-40 h-40 object-contain rounded-lg shadow-md"
                            />
                          </div>

                          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-mono">
                            <span>UPI ID: <strong>minakshiarts@upi</strong></span>
                            <button
                              type="button"
                              onClick={copyUpiId}
                              className="text-amber-600 font-bold hover:underline cursor-pointer"
                            >
                              {copiedUpi ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {formError && (
                      <p className="text-[11px] text-terracotta-500 font-semibold">{formError}</p>
                    )}
                  </form>
                </div>

                {/* Final Confirm Button */}
                <div className="border-t border-white/10 pt-3 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-sand-100">
                    <span>Total Amount</span>
                    <span className="font-serif text-xl text-gold-400">₹{finalTotal.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    form="delivery-form"
                    disabled={isCheckingOut}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCheckingOut ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>Confirm & Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Step 1: Cart Items Summary */
              <>
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-gold-400" />
                      <h2 className="font-serif text-xl font-bold text-sand-50">Festive Bag</h2>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 rounded-full text-sand-300 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Free Gift Progress Bar */}
                  <div className="bg-obsidian/60 p-3.5 rounded-2xl border border-white/10 mb-6 space-y-2">
                    <div className="flex justify-between text-[11px] font-medium">
                      {progressPercent >= 100 ? (
                        <span className="text-gold-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Unlocked: Free Brass Diya Set Included!
                        </span>
                      ) : (
                        <span className="text-sand-300">
                          Add ₹{(freeGiftThreshold - subtotal).toLocaleString()} more for <strong className="text-gold-400">Free Brass Diya Set</strong>
                        </span>
                      )}
                      <span className="text-sand-400">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-500 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-1">
                  {cart.length === 0 && customHampers.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-sand-400 opacity-40 mx-auto" />
                      <p className="font-serif text-lg font-bold text-sand-200">Your bag is empty</p>
                      <p className="text-xs text-sand-400">Explore our drops to add handcrafted festive items.</p>
                    </div>
                  ) : (
                    <>
                      {/* Standard Cart Items */}
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/5"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-sand-100 text-sm truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-gold-400 font-semibold font-serif">
                              ₹{item.product.price.toLocaleString()}
                            </p>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-md bg-white/10 text-sand-200 flex items-center justify-center hover:bg-white/20 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs text-sand-100 font-bold px-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-md bg-white/10 text-sand-200 flex items-center justify-center hover:bg-white/20 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-sand-400 hover:text-terracotta-500 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Custom Hampers */}
                      {customHampers.map((hamper) => (
                        <div
                          key={hamper.id}
                          className="p-3.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 space-y-2 relative"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                                Custom Bespoke Hamper
                              </span>
                              <h4 className="font-serif font-bold text-sand-100 text-xs">{hamper.boxName}</h4>
                              <p className="text-[11px] text-sand-300/80">• {hamper.trioName}</p>
                            </div>
                            <button
                              onClick={() => removeCustomHamper(hamper.id)}
                              className="text-sand-400 hover:text-terracotta-500 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                            <span className="text-gold-400 font-serif font-bold">
                              ₹{hamper.totalPrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-sand-300">Custom Handwritten Card</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Footer Controls & Step 1 -> Step 2 transition */}
                {(cart.length > 0 || customHampers.length > 0) && (
                  <div className="border-t border-white/10 pt-4 space-y-4">
                    {/* Promo Code Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo Code (DIWALI2026)"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-obsidian/80 border border-white/10 text-sand-100 text-xs uppercase focus:outline-none focus:border-gold-400"
                      />
                      <button
                        onClick={applyPromo}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-gold-500 text-sand-100 hover:text-obsidian text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-[11px] text-gold-400 font-semibold">
                        ✓ 15% Festive Promo Discount Applied!
                      </p>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-terracotta-500 font-semibold">{promoError}</p>
                    )}

                    {/* Totals */}
                    <div className="space-y-1.5 text-xs text-sand-300">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-gold-400">
                          <span>Festive Discount ({discountPercent}%)</span>
                          <span>-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sand-400 text-[11px]">
                        <span>Shipping</span>
                        <span className="text-green-400 font-semibold">FREE Pan-India</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                        <span className="font-serif text-base font-bold text-sand-100">Total</span>
                        <span className="font-serif text-2xl font-bold text-gold-400">
                          ₹{finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Proceed to Delivery CTA */}
                    <button
                      onClick={handleProceedToDelivery}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-diya-amber to-terracotta-600 text-obsidian font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Delivery & Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
