import { NextRequest, NextResponse } from "next/server";
import { dbConnect, collections } from "@/lib/dbConnect";
import { generateRandomNumber } from "@/components/sharedComponents/reuseableJs/reuseableJs";
import { authorizationCheck } from "@/lib/authorization";
// POST method to create a user if email doesn't exist
export async function POST(req: NextRequest) {
  try {
    const formInfo = await req.json();
    const productsCollection = await dbConnect(collections.products);
    const result = await productsCollection.insertOne({ ...formInfo });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the user." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
    const pathSegments = req.nextUrl.pathname.split("/");
    const slug = pathSegments[pathSegments.length - 1];
  try {
    const productsCollection = await dbConnect(collections.products);
    const result = await productsCollection.find().toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching products." },
      { status: 500 },
    );
  }
}