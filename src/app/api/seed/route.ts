import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { MongoProduct, MongoOrder } from "@/lib/models";
import { PRODUCTS } from "@/data/products";

export async function POST() {
  try {
    await connectToDatabase();

    // Clear fake test data
    await MongoProduct.deleteMany({});
    await MongoOrder.deleteMany({});

    // Seed authentic products with clean starting stock
    const cleanProducts = PRODUCTS.map((p, idx) => ({
      ...p,
      stock: [35, 20, 25, 18, 40, 15, 22, 12][idx % 8],
      soldCount: 0,
      inStock: true,
    }));

    await MongoProduct.insertMany(cleanProducts);

    return NextResponse.json({
      success: true,
      message: "Fake test data deleted. Clean Prabha Studio database seeded successfully!",
      count: cleanProducts.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Seeding failed" }, { status: 500 });
  }
}
