import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = db.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 });
    }

    const newProduct = db.addProduct({
      name: body.name,
      subtitle: body.subtitle || "Artisanal Handmade",
      category: body.category,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      rating: body.rating || 5.0,
      reviewsCount: body.reviewsCount || 1,
      tag: body.tag || "New Arrival",
      images: body.images && body.images.length > 0 ? body.images : ["https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800"],
      specs: body.specs || { material: "100% Organic Soy & Brass" },
      description: body.description || "Handcrafted with devotion for your festive home.",
      artisanStory: body.artisanStory || "Hand-sculpted by master artisans in Gujarat.",
      inStock: (Number(body.stock) || 0) > 0,
      stock: Number(body.stock) || 10,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
