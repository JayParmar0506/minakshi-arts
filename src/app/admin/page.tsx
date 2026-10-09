"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DBProduct } from "@/lib/db";
import { AnalyticsPieChart } from "@/components/admin/AnalyticsPieChart";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import {
  Flame,
  IndianRupee,
  ShoppingBag,
  Layers,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Bell,
  Package,
  Phone,
  MapPin,
  QrCode,
  Banknote,
  CheckCircle2,
  Clock,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, analyticsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/analytics"),
        fetch("/api/orders"),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Poll for new order notifications every 10 seconds
    const interval = setInterval(() => {
      fetch("/api/orders")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setOrders(data))
        .catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: DBProduct) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock, inStock: newStock > 0 }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-sand-100 p-4 sm:p-8 font-sans grain-bg selection:bg-gold-500 selection:text-obsidian">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 via-diya-amber to-terracotta-600 p-[1px]">
              <div className="w-full h-full bg-obsidian rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-gold-400 fill-diya-amber/30 animate-flame-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50">
                MINAKSHI <span className="text-gold-400">ARTS</span> Admin Portal
              </h1>
              <p className="text-xs text-sand-300/70 uppercase tracking-[0.2em]">
                Inventory Management & Sales Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Order Notification Bell Trigger */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-full bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 transition-colors cursor-pointer"
              title="Order Notifications"
            >
              <Bell className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-80 sm:w-96 glass-panel-gold border border-gold-500/40 rounded-3xl p-5 shadow-2xl z-50 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gold-400" />
                      <h4 className="font-serif font-bold text-sm text-sand-50">Order Notifications</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold">
                      {orders.length} New Orders
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-3 pr-1 text-xs">
                    {orders.length === 0 ? (
                      <p className="text-sand-400 text-center py-4">No recent order notifications</p>
                    ) : (
                      orders.slice(0, 5).map((ord: any) => (
                        <div
                          key={ord.orderId || ord.id}
                          className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-gold-400 font-bold">#{ord.orderId || ord.id}</span>
                            <span className="font-serif font-bold text-sand-100">
                              ₹{(ord.totalAmount || 0).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sand-200 font-medium">
                            Client: <strong>{ord.customerName}</strong> ({ord.customerPhone})
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-sand-400">
                            <span>Method: {(ord.paymentMethod || "cod").toUpperCase()}</span>
                            <span>{new Date(ord.date || ord.createdAt || Date.now()).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Refresh Data */}
            <button
              onClick={fetchData}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-sand-300 hover:text-gold-400 transition-colors border border-white/10 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* Back to Storefront */}
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full glass-panel border border-gold-500/40 text-sand-100 hover:text-gold-400 hover:border-gold-400 transition-all text-xs uppercase font-serif tracking-widest flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </header>

        {/* Live Order Alerts Banner */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl glass-panel-gold border border-gold-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/40">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-sand-50">
                  🔔 {orders.length} Active Customer Orders Received!
                </h4>
                <p className="text-xs text-sand-300">
                  Latest order #{orders[0]?.orderId || orders[0]?.id} placed by{" "}
                  <strong>{orders[0]?.customerName}</strong> ({orders[0]?.customerPhone}) for ₹
                  {(orders[0]?.totalAmount || 0).toLocaleString()} via{" "}
                  {(orders[0]?.paymentMethod || "cod").toUpperCase()}.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById("admin-orders-list");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              View All Orders
            </button>
          </motion.div>
        )}

        {/* 4 Key Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Revenue */}
          <div className="glass-panel-gold rounded-3xl p-6 border border-gold-500/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-gold-400">
              <span className="text-xs uppercase font-bold tracking-wider text-sand-300">Total Revenue</span>
              <div className="p-2 rounded-xl bg-gold-500/10">
                <IndianRupee className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-gold-400">
              ₹{analytics?.totalRevenue ? analytics.totalRevenue.toLocaleString() : "0"}
            </div>
            <p className="text-[11px] text-sand-400 font-light">Gross revenue across orders</p>
          </div>

          {/* Card 2: Total Units Sold */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-diya-amber">
              <span className="text-xs uppercase font-bold tracking-wider text-sand-300">Products Sold</span>
              <div className="p-2 rounded-xl bg-diya-amber/10">
                <ShoppingBag className="w-5 h-5 text-diya-amber" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-sand-50">
              {analytics?.totalSoldUnits || 0} <span className="text-sm font-normal text-sand-400">units</span>
            </div>
            <p className="text-[11px] text-sand-400 font-light">Total handcrafted units sold</p>
          </div>

          {/* Card 3: Remaining Stock */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-terracotta-500">
              <span className="text-xs uppercase font-bold tracking-wider text-sand-300">Remaining Stock</span>
              <div className="p-2 rounded-xl bg-terracotta-500/10">
                <Layers className="w-5 h-5 text-terracotta-500" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-sand-50">
              {analytics?.totalRemainingStock || 0} <span className="text-sm font-normal text-sand-400">items</span>
            </div>
            <p className="text-[11px] text-sand-400 font-light">Available in warehouse</p>
          </div>

          {/* Card 4: Active SKUs */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-gold-400">
              <span className="text-xs uppercase font-bold tracking-wider text-sand-300">Active SKUs</span>
              <div className="p-2 rounded-xl bg-white/5">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <div className="font-serif text-3xl font-bold text-sand-50">
              {analytics?.activeProductsCount || products.length || 0}
            </div>
            <p className="text-[11px] text-sand-400 font-light">Catalog collection items</p>
          </div>
        </div>

        {/* Analytics SVG Pie Chart Section */}
        {analytics?.categoryData && (
          <AnalyticsPieChart
            data={analytics.categoryData}
            totalSoldUnits={analytics.totalSoldUnits}
          />
        )}

        {/* Orders Management List & Notifications Center */}
        <section id="admin-orders-list" className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-sand-50">Recent Customer Orders</h3>
                <p className="text-xs text-sand-300">Real-time orders received with delivery details & phone numbers</p>
              </div>
            </div>

            <span className="text-xs font-serif font-bold text-gold-400 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
              Total Orders: {orders.length}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Package className="w-10 h-10 text-sand-400 opacity-40 mx-auto" />
              <p className="font-serif text-base font-bold text-sand-200">No orders placed yet</p>
              <p className="text-xs text-sand-400">When customers place orders, they will instantly appear here with full delivery details.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-sand-400 font-serif uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Delivery Address & Pincode</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((ord: any, idx: number) => (
                    <tr key={ord.orderId || ord.id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-gold-400 font-bold block">#{ord.orderId || ord.id}</span>
                        <span className="text-[10px] text-sand-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-sand-400" />
                          {new Date(ord.date || ord.createdAt || Date.now()).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-sand-100 block">{ord.customerName}</span>
                        <span className="text-[11px] text-gold-300 font-semibold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gold-400 shrink-0" />
                          {ord.customerPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-sand-200 block max-w-xs truncate">{ord.deliveryAddress}</span>
                        <span className="text-[10px] text-sand-400 font-bold block mt-0.5">
                          Pincode: {ord.pincode}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 w-fit bg-gold-500/10 text-gold-300 border-gold-500/30">
                          {ord.paymentMethod === "upi" ? (
                            <>
                              <QrCode className="w-3 h-3 text-diya-amber" />
                              <span>UPI / QR</span>
                            </>
                          ) : (
                            <>
                              <Banknote className="w-3.5 h-3.5 text-gold-400" />
                              <span>COD</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="font-serif font-bold text-base text-gold-400 block">
                          ₹{(ord.totalAmount || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 justify-end mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Inventory Table Component */}
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStockUpdate={handleStockUpdate}
          onAddNew={handleAddNew}
        />

        {/* Product Form Modal for Add / Edit */}
        <ProductFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productToEdit={editingProduct}
          onSaveSuccess={fetchData}
        />
      </div>
    </div>
  );
}
