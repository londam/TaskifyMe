import { NextRequest, NextResponse } from "next/server";
//import schema from "../schema";
import { SafeParseReturnType } from "zod";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import mongoose from "mongoose";
import { STTModel } from "@/app/lib/mongodb/models";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  //in RL fetch data from a db,
  await dbConnect(); // Ensure database connection is established
  console.log("sttid: ", params.id);
  const stt = await STTModel.findById(params.id);

  //if not found return 404
  // else return data
  if (!stt) return NextResponse.json({ error: "STT not found" }, { status: 404 });

  return NextResponse.json(stt, { status: 200 });
}

//PUT for replacing object
//PATCH for updating a property of an object

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); // Ensure database connection is established
  //validate the request body
  const body = await request.json();
  const { sttContent } = body;

  // update the audioFile
  const stt = await STTModel.findByIdAndUpdate(
    params.id,
    { content: sttContent },
    {
      new: true, // return the updated version
    }
  );
  return NextResponse.json(stt);
}

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   await dbConnect(); // Ensure database connection is established

//   try {
//     // Fetch the audioFile by ID before deletion
//     const audioFile = await AudioFileModel.findById(params.id).select("-password");

//     // If the audioFile does not exist, return 404
//     if (!audioFile) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     // Delete the audioFile by ID
//     const result = await AudioFileModel.deleteOne({ _id: params.id });

//     // Check if a document was deleted
//     if (result.deletedCount === 0)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });

//     // Return the deleted audioFile
//     // ! TODO -> need to call funcation that will delete all of audioFile's files as well!
//     return NextResponse.json(audioFile, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting audioFile:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
