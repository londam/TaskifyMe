import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb/dbConnect";
//import { getSession } from 'next-auth/client'; // If you're using authentication
import {
  UserModel,
  ProcessedTextModel,
  AudioFileModel,
  STTModel,
  AudioFile,
} from "@/app/lib/mongodb/models"; // Import your models

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { processedTextContent, sttId, userId, audioFileId } = body;

    if (!processedTextContent || !userId) {
      return NextResponse.json({ error: "Missing prompt or userId" }, { status: 400 });
    }

    // 1 Connect to the database
    const mongooseInstance = await dbConnect(); // Connect and get the Mongoose instance
    console.log("__________________________________________________");
    // 2 Create a processedText entry
    const processedText = await ProcessedTextModel.create({
      audioId: audioFileId,
      userId: userId,
      content: processedTextContent,
      sttId: sttId,
    });
    if (!processedText) {
      return NextResponse.json({ error: "processedText not created!" }, { status: 404 });
    }

    // 4 Add the new proctxt  to the audiofile
    await AudioFileModel.findByIdAndUpdate(audioFileId, {
      processedTextId: processedText._id,
    });

    // 3 Find and update the User document
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add the new processed text to the user's list
    user.processedTexts.push(processedText._id);
    await user.save();

    // 5 Find and update the STT document
    await AudioFileModel.findByIdAndUpdate(sttId, {
      processedTextId: processedText._id,
    });

    return NextResponse.json({
      success: true,
      message: "Processed text successfully saved to db",
    });
  } catch (error) {
    console.error("Error updating database:", error);
    return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
  }
}
