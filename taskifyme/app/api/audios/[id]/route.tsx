import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import { SafeParseReturnType } from "zod";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { AudioFileModel } from "@/app/lib/mongodb/models";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  //in RL fetch data from a db,
  await dbConnect(); // Ensure database connection is established
  const audioFile = await AudioFileModel.findById(params.id).select("-password");

  //if not found return 404
  // else return data
  if (!audioFile) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(audioFile, { status: 200 });
}

//PUT for replacing object
//PATCH for updating a property of an object

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure database connection is established
  //validate the request body
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

  // fetch audioFile with the given id
  const audioFile = await AudioFileModel.findById(params.id).select("-password");

  // if doesn't exit -> return 404
  if (!audioFile) return NextResponse.json({ error: "audioFile not found PUT" }, { status: 404 });

  // update the audioFile
  const updatedUser = await AudioFileModel.findByIdAndUpdate(params.id, validation.data, {
    new: true, // return the updated audioFile
    runValidators: true,
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure database connection is established

  try {
    // Fetch the audioFile by ID before deletion
    const audioFile = await AudioFileModel.findById(params.id).select("-password");

    // If the audioFile does not exist, return 404
    if (!audioFile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Delete the audioFile by ID
    const result = await AudioFileModel.deleteOne({ _id: params.id });

    // Check if a document was deleted
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Return the deleted audioFile
    // ! TODO -> need to call funcation that will delete all of audioFile's files as well!
    return NextResponse.json(audioFile, { status: 200 });
  } catch (error) {
    console.error("Error deleting audioFile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
