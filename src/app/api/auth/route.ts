import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, role } = body;

    await connectToDatabase();

    if (action === "google_login") {
      const googleEmail = email || "user.google@gmail.com";
      const googleName = name || "Google User";
      const userRole = googleEmail.trim().toLowerCase() === "jayshanti567@gmail.com" ? "admin" : "client";

      let user = null;
      try {
        user = await User.findOne({ email: googleEmail });
        if (!user) {
          user = await User.create({
            name: googleName,
            email: googleEmail,
            role: userRole,
            authProvider: "google",
            image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          });
        }
      } catch (err) {
        // Fallback user object if Mongo connection not live
        user = {
          name: googleName,
          email: googleEmail,
          role: userRole,
          authProvider: "google",
        };
      }

      return NextResponse.json({ success: true, user });
    }

    if (action === "signup") {
      if (!email || !name) {
        return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
      }

      const userRole = email.trim().toLowerCase() === "jayshanti567@gmail.com" ? "admin" : "client";
      let newUser = null;

      try {
        const existing = await User.findOne({ email });
        if (existing) {
          return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        newUser = await User.create({
          name,
          email,
          password: password || "festive2026",
          role: userRole,
          authProvider: "email",
        });
      } catch (err) {
        newUser = { name, email, role: userRole, authProvider: "email" };
      }

      return NextResponse.json({ success: true, user: newUser });
    }

    if (action === "email_login") {
      const userRole = email?.trim().toLowerCase() === "jayshanti567@gmail.com" ? "admin" : "client";
      let user = null;

      try {
        user = await User.findOne({ email });
        if (!user) {
          user = {
            name: email.split("@")[0],
            email,
            role: userRole,
            authProvider: "email",
          };
        }
      } catch (err) {
        user = {
          name: email.split("@")[0],
          email,
          role: userRole,
          authProvider: "email",
        };
      }

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: "Invalid auth action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
