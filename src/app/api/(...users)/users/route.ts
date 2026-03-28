
import { NextRequest, NextResponse } from 'next/server';
import  { dbConnect, collections } from "@/lib/dbConnect";
import { generateRandomNumber } from '@/components/sharedComponents/reuseableJs/reuseableJs';
import { authorizationCheck } from '@/lib/authorization';
// POST method to create a user if email doesn't exist
export async function POST(req: Request) {
  const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
  // Pass referer path to authorization check
  const authResult = await authorizationCheck(refererPath);
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    const user = await req.json();

    // Check if user with the given email already exists
    const findUser = await dbConnect(collections.users).findOne({ email: user?.email });
    
    if (findUser) {
      return NextResponse.json(
        { message: "Email already exists, try another email" },
        { status: 400 }
      );
    }
      
      // Hash password if you're including it
      const hashedPassword =  generateRandomNumber(6);
      
      // Save to database
      const admin = await dbConnect(collections.users).insertOne( {
         ...user,
         password: hashedPassword,
         role: authResult?.user?.instituteId === "titb" ? 'titb admin':'ins admin',
         isActive :"active",
         instituteId : authResult?.user?.instituteId,
         oldPasswords: []
      });
    // Insert the new user into the collection
    // const result = await dbConnect(collections.users).insertOne(user);

    // Return the result
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: 'An error occurred while creating the user.' },
      { status: 500 }
    );
  }
}

// GET method to fetch all users
export async function GET(req: NextRequest) {

  try {
    // Fetch all users from the database
    const users = await dbConnect(collections.users).find().toArray();

    if (users && users.length > 0) {
      return NextResponse.json(users, { status: 200 });
    } else {
      return NextResponse.json(
        { message: 'No users found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: 'An error occurred while fetching users.' },
      { status: 500 }
    );
  }
}
