import fs from "fs";
import path from "path";
import { Product, PRODUCTS as DEFAULT_PRODUCTS } from "@/data/products";

export interface DBProduct extends Product {
  stock: number;
  soldCount: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  pincode: string;
  paymentMethod: "cod" | "upi" | "card" | "netbanking";
}

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "inventory_db.json");

// Initial seed data with stock and sales count
const INITIAL_PRODUCTS: DBProduct[] = DEFAULT_PRODUCTS.map((p, idx) => ({
  ...p,
  stock: [42, 18, 35, 24, 50, 12, 28, 15][idx % 8],
  soldCount: [28, 14, 22, 16, 10, 8, 19, 31][idx % 8],
}));

const INITIAL_ORDERS: Order[] = [];

interface DBData {
  products: DBProduct[];
  orders: Order[];
}

// Memory cache fallback
let memoryDB: DBData = {
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS,
};

function normalizeProducts(products: any[]): DBProduct[] {
  return products.map((p, idx) => {
    const id = p.id || (p.name ? `prod-${p.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}` : `prod-${Date.now()}-${idx}`);
    return {
      ...p,
      id,
      stock: p.stock !== undefined ? Number(p.stock) : 10,
      soldCount: p.soldCount !== undefined ? Number(p.soldCount) : 0,
    };
  });
}

function readDB(): DBData {
  try {
    let data: DBData;
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, "utf-8");
      data = JSON.parse(fileData);
    } else {
      data = memoryDB;
    }

    // Ensure all products have IDs
    let hasMissingId = false;
    data.products = data.products.map((p, idx) => {
      if (!p.id) {
        hasMissingId = true;
        return {
          ...p,
          id: p.name ? `prod-${p.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}` : `prod-${Date.now()}-${idx}`,
          stock: p.stock !== undefined ? Number(p.stock) : 10,
          soldCount: p.soldCount !== undefined ? Number(p.soldCount) : 0,
        };
      }
      return p;
    });

    if (hasMissingId) {
      writeDB(data);
    }

    memoryDB = data;
    return data;
  } catch (err) {
    console.error("DB Read error, using memory DB:", err);
    return memoryDB;
  }
}

function writeDB(data: DBData) {
  try {
    memoryDB = data;
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("DB Write error:", err);
  }
}

export const db = {
  getProducts: (): DBProduct[] => {
    return readDB().products;
  },

  getProductById: (id: string): DBProduct | undefined => {
    return readDB().products.find((p) => p.id === id || p.name === id || encodeURIComponent(p.name) === id);
  },

  addProduct: (newProduct: Omit<DBProduct, "id" | "soldCount"> & { id?: string }): DBProduct => {
    const data = readDB();
    const product: DBProduct = {
      ...newProduct,
      id: newProduct.id || `prabha-${Date.now()}`,
      soldCount: 0,
      stock: Number(newProduct.stock) || 0,
    };
    data.products.unshift(product);
    writeDB(data);
    return product;
  },

  updateProduct: (id: string, updates: Partial<DBProduct>): DBProduct | null => {
    const data = readDB();
    const idx = data.products.findIndex((p) => p.id === id || p.name === id || encodeURIComponent(p.name) === id);
    if (idx === -1) return null;

    data.products[idx] = {
      ...data.products[idx],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : data.products[idx].price,
      stock: updates.stock !== undefined ? Number(updates.stock) : data.products[idx].stock,
    };
    writeDB(data);
    return data.products[idx];
  },

  deleteProduct: (id: string): boolean => {
    const data = readDB();
    const initialLen = data.products.length;
    const decodeId = decodeURIComponent(id);
    data.products = data.products.filter(
      (p) => p.id !== id && p.id !== decodeId && p.name !== id && p.name !== decodeId
    );
    if (data.products.length !== initialLen) {
      writeDB(data);
      return true;
    }
    return false;
  },

  recordOrder: (orderData: {
    items: OrderItem[];
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    pincode: string;
    paymentMethod: "cod" | "upi" | "card" | "netbanking";
  }): Order => {
    const data = readDB();
    let totalAmount = 0;

    orderData.items.forEach((item) => {
      totalAmount += item.price * item.quantity;
      const product = data.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.soldCount = (product.soldCount || 0) + item.quantity;
        if (product.stock === 0) {
          product.inStock = false;
        }
      }
    });

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: orderData.items,
      totalAmount,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      pincode: orderData.pincode,
      paymentMethod: orderData.paymentMethod || "cod",
    };

    data.orders.unshift(newOrder);
    writeDB(data);
    return newOrder;
  },

  getAnalytics: () => {
    const data = readDB();
    const products = data.products;
    const orders = data.orders;

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalSoldUnits = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
    const totalRemainingStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    const categorySalesMap: Record<string, { category: string; unitsSold: number; revenue: number }> = {
      candles: { category: "Soy Candles", unitsSold: 0, revenue: 0 },
      murals: { category: "Wall Murals", unitsSold: 0, revenue: 0 },
      diyas: { category: "Diyas & Urlis", unitsSold: 0, revenue: 0 },
      idols: { category: "Sacred Idols", unitsSold: 0, revenue: 0 },
      hampers: { category: "Gift Hampers", unitsSold: 0, revenue: 0 },
    };

    products.forEach((p) => {
      const catKey = p.category || "candles";
      if (!categorySalesMap[catKey]) {
        categorySalesMap[catKey] = { category: catKey, unitsSold: 0, revenue: 0 };
      }
      categorySalesMap[catKey].unitsSold += p.soldCount || 0;
      categorySalesMap[catKey].revenue += (p.soldCount || 0) * p.price;
    });

    const categoryData = Object.values(categorySalesMap);

    return {
      totalRevenue,
      totalSoldUnits,
      totalRemainingStock,
      activeProductsCount: products.length,
      categoryData,
      recentOrders: orders.slice(0, 10),
    };
  },

  getOrders: (): Order[] => {
    return readDB().orders;
  },
};
