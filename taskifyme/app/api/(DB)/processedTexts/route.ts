import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb/dbConnect";
//import { getSession } from 'next-auth/client'; // If you're using authentication
import { UserModel, ProcessedTextModel, AudioFileModel } from "@/app/lib/mongodb/models"; // Import your models

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId, audioFileId } = await request.json();

    if (!prompt || !userId) {
      return NextResponse.json({ error: "Missing fileName or userId" }, { status: 400 });
    }

    // 1 Connect to the database
    const mongooseInstance = await dbConnect(); // Connect and get the Mongoose instance

    // 2 Create a processedText entry
    const processedText = await ProcessedTextModel.create({
      audio: audioFileId,
      userId: userId,
      content: prompt,
    });

    // 3 Find and update the User document
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add the new audio file to the user's list
    user.processedTexts.push(processedText._id);
    await user.save();

    // 4 Find and update the User document
    const audioFile = await AudioFileModel.findById(audioFileId);

    if (!audioFile) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    // Add the new audio file to the user's list
    audioFile.ProcessedText.push(processedText._id);
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
