import mongoose, { Schema, Document, Model } from "mongoose";

// User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  image?: string;
  role: "client" | "admin";
  authProvider: "email" | "google";
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String },
  image: { type: String },
  role: { type: String, enum: ["client", "admin"], default: "client" },
  authProvider: { type: String, enum: ["email", "google"], default: "email" },
  createdAt: { type: Date, default: Date.now },
});

// Product Schema
export interface IProduct extends Document {
  id: string;
  name: string;
  subtitle: string;
  category: "candles" | "murals" | "diyas" | "idols" | "hampers";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  tag?: string;
  images: string[];
  specs: {
    burnTime?: string;
    dimensions?: string;
    material?: string;
    fragranceNotes?: string[];
  };
  description: string;
  artisanStory: string;
  inStock: boolean;
  stock: number;
  soldCount: number;
  featured?: boolean;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subtitle: { type: String, required: true },
  category: {
    type: String,
    enum: ["candles", "murals", "diyas", "idols", "hampers"],
    required: true,
  },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 1 },
  tag: { type: String },
  images: [{ type: String }],
  specs: {
    burnTime: { type: String },
    dimensions: { type: String },
    material: { type: String },
    fragranceNotes: [{ type: String }],
  },
  description: { type: String, required: true },
  artisanStory: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 20 },
  soldCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
});

// Order Schema
export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  deliveryAddress: string;
  pincode: string;
  paymentMethod: "cod" | "upi" | "card" | "netbanking";
  items: {
    productId: string;
    name?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "confirmed" | "shipped" | "delivered";
  date: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  pincode: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ["cod", "upi", "card", "netbanking"],
    default: "cod",
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "confirmed" },
  date: { type: Date, default: Date.now },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const MongoProduct: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export const MongoOrder: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
