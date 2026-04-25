import { NextRequest, NextResponse } from "next/server";
import { dbConnect, collections } from "@/lib/dbConnect";
import { generateRandomNumber } from "@/components/sharedComponents/reuseableJs/reuseableJs";
import { authorizationCheck } from "@/lib/authorization";
import { ObjectId } from "mongodb";
// POST method to create a user if email doesn't exist

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
    const pathSegments = req.nextUrl.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];
  try {
    const productsCollection = await dbConnect(collections.products);
    const result = await productsCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching products." },
      { status: 500 },
    );
  }
}