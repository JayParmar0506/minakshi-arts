import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongodb";
import { MongoOrder, MongoProduct } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerName, customerPhone, deliveryAddress, pincode, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 });
    }

    if (!customerPhone || customerPhone.trim().length < 10) {
      return NextResponse.json({ error: "Compulsory 10-digit mobile phone number is required" }, { status: 400 });
    }

    if (!deliveryAddress || !pincode) {
      return NextResponse.json({ error: "Delivery address and pincode are required" }, { status: 400 });
    }

    // Try MongoDB first
    try {
      await connectToDatabase();
      const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;

      const mongoOrder = await MongoOrder.create({
        orderId,
        customerName: customerName || "Festive Client",
        customerPhone,
        deliveryAddress,
        pincode,
        paymentMethod: paymentMethod || "cod",
        items,
        totalAmount,
      });

      // Update product inventory stock
      for (const item of items) {
        await MongoProduct.updateOne(
          { id: item.productId },
          { $inc: { stock: -item.quantity, soldCount: item.quantity } }
        );
      }

      return NextResponse.json({ success: true, order: mongoOrder }, { status: 201 });
    } catch (mongoErr) {
      // Fallback to local db.ts
      const newOrder = db.recordOrder({
        items,
        customerName: customerName || "Festive Client",
        customerPhone,
        deliveryAddress,
        pincode,
        paymentMethod: paymentMethod || "cod",
      });
      return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    try {
      await connectToDatabase();
      const mongoOrders = await MongoOrder.find({}).sort({ createdAt: -1 });
      if (mongoOrders && mongoOrders.length > 0) {
        return NextResponse.json(mongoOrders);
      }
    } catch {
      // Fallback
    }

    const localOrders = db.getOrders();
    return NextResponse.json(localOrders);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
