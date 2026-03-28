import { NextResponse } from "next/server";
import { dbConnect, collections } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const usersCollection = dbConnect(collections.users);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: data.email , mobile: data.mobile });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email or mobile number" },
        { status: 400 }
      );
    }

    // Create new user
    const result = await usersCollection.insertOne({
      ...data,
      role: "user", // Default role
      isActive: "active", // Default status
      profilePhoto: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      createdAt: new Date(),
    });

    if (!result.insertedId) {
      throw new Error("Failed to create user");
    }

    return NextResponse.json(
      { message: "User created successfully", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
}