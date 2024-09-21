import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb/dbConnect";
//import { getSession } from 'next-auth/client'; // If you're using authentication
import { UserModel, AudioFileModel } from "@/app/lib/mongodb/models"; // Import your models

export async function POST(request: NextRequest) {
  try {
    const { fileName, userId } = await request.json();
    console.log("fileName", fileName);
    console.log("userId", userId);

    if (!fileName || !userId) {
      return NextResponse.json({ error: "Missing fileName or userId" }, { status: 400 });
    }

    // Connect to the database
    const mongooseInstance = await dbConnect(); // Connect and get the Mongoose instance

    // Create an AudioFile entry
    const audioFile = await AudioFileModel.create({ fileName: fileName, userId: userId });

    // Find and update the User document
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add the new audio file to the user's list
    user.audioFiles.push(audioFile._id);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "File successfully uploaded and saved to user record",
    });
  } catch (error) {
    console.error("Error updating database:", error);
    return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
  }
}
