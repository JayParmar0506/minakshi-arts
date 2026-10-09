"use client";

import React, { useEffect, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { X, Package, Clock, Phone, MapPin, CheckCircle2, QrCode, Banknote, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const OrderHistoryModal: React.FC = () => {
  const { isOrderHistoryOpen, setIsOrderHistoryOpen, user } = useShop();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching order history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOrderHistoryOpen) {
      fetchOrders();
    }
  }, [isOrderHistoryOpen]);

  if (!isOrderHistoryOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOrderHistoryOpen(false)}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-w-2xl w-full glass-panel-gold border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-auto text-left space-y-6 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-sand-50">Your Order History</h3>
                <p className="text-xs text-sand-300/80">Track and view your handcrafted festive orders</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-sand-300 hover:text-gold-400 transition-colors cursor-pointer"
                title="Refresh Orders"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsOrderHistoryOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-sand-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Orders List Body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Package className="w-12 h-12 text-sand-400 opacity-40 mx-auto" />
                <p className="font-serif text-lg font-bold text-sand-200">No orders placed yet</p>
                <p className="text-xs text-sand-400">Your recent orders will appear here after checkout.</p>
              </div>
            ) : (
              orders.map((order: any, idx: number) => (
                <div
                  key={order.orderId || order.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-gold-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gold-400 uppercase">
                          #{order.orderId || order.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Order Confirmed
                        </span>
                      </div>
                      <p className="text-[11px] text-sand-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.date || order.createdAt || Date.now()).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-xs text-sand-400 block">Total Amount</span>
                      <span className="font-serif text-lg font-bold text-gold-400">
                        ₹{(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-sand-300">
                    <div className="flex items-start gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Phone:</strong> {order.customerPhone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-terracotta-400 shrink-0 mt-0.5" />
                      <span className="truncate">
                        <strong>Address:</strong> {order.deliveryAddress}, {order.pincode}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-sand-400">Payment Method:</span>
                    <span className="font-bold text-gold-300 uppercase flex items-center gap-1">
                      {order.paymentMethod === "upi" ? (
                        <>
                          <QrCode className="w-3.5 h-3.5 text-diya-amber" />
                          <span>UPI / QR Code</span>
                        </>
                      ) : (
                        <>
                          <Banknote className="w-3.5 h-3.5 text-gold-400" />
                          <span>Cash on Delivery (COD)</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
