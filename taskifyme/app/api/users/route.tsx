import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { UserModel } from "@/app/lib/mongodb/models";
import schema from "./schema";

export async function POST(request: NextRequest) {
  await dbConnect(); // Ensure database connection is established
  const user = await request.json();
  const validation = schema.safeParse(user);

  //check if submited data is OK
  if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

  try {
    const { name, email, password } = validation.data;

    // Attempt to create a new user
    const newUser = await UserModel.create({ name, email, password });
    return NextResponse.json(
      { name: newUser.name, email: newUser.email, id: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      const mongoError = error as { code?: number }; //casting into mongoError to recognize .code is number code
      if (mongoError.code === 11000) {
        // MongoDB error code for duplicate key
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      } else {
        // Handle other errors
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
    } else {
      // Handle unexpected error types
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}

export async function GET(request: NextRequest) {
  //in RL fetch data from a db,
  await dbConnect(); // Ensure database connection is established
  const user = await UserModel.find();

  //if not found return 404
  // else return data
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user, { status: 200 });
}
