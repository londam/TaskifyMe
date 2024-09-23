import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { UserModel } from "@/app/lib/mongodb/models";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  //in RL fetch data from a db,
  await dbConnect(); // Ensure database connection is established
  const user = await UserModel.findById(params.id).select("-password").populate("audioFiles");

  //if not found return 404
  // else return data
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user, { status: 200 });
}

//PUT for replacing object
//PATCH for updating a property of an object

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure database connection is established
  //validate the request body
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

  // fetch user with the given id
  const user = await UserModel.findById(params.id).select("-password");

  // if doesn't exit -> return 404
  if (!user) return NextResponse.json({ error: "user not found PUT" }, { status: 404 });

  if (!validation.data.tokens) validation.data.tokens = user.tokens;
  if (!validation.data.minutes) validation.data.minutes = user.minutes;

  // update the user
  const updatedUser = await UserModel.findByIdAndUpdate(params.id, validation.data, {
    new: true, // return the updated user
    runValidators: true,
  });

  return NextResponse.json(updatedUser);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect(); // Ensure database connection is established
    //validate the request body
    const body = await request.json();
    const { tokens, minutes } = body;

    // fetch user with the given id
    const user = await UserModel.findById(params.id).select("-password");

    // if doesn't exit -> return 404
    if (!user) return NextResponse.json({ error: "user not found PUT" }, { status: 404 });

    user.tokens += parseInt(tokens);
    user.minutes += parseInt(minutes);

    // update the user
    await user.save();

    console.log(user.tokens, user.minutes);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure database connection is established

  try {
    // Fetch the user by ID before deletion
    const user = await UserModel.findById(params.id).select("-password");

    // If the user does not exist, return 404
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Delete the user by ID
    const result = await UserModel.deleteOne({ _id: params.id });

    // Check if a document was deleted
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Return the deleted user
    // ! TODO -> need to call funcation that will delete all of user's files as well!
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GETHelper(userId: string, field: string) {
  //in RL fetch data from a db,
  await dbConnect(); // Ensure database connection is established
  const user = await UserModel.findById(userId).select(field).populate(field);

  //if not found return 404
  // else return data
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user, { status: 200 });
}
