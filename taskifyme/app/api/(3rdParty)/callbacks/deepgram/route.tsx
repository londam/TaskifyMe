import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { AudioFileModel, STTModel, UserModel } from "@/app/lib/mongodb/models";

// Webhook handler for Deepgram
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse the JSON body from Deepgram
    const { metadata, results } = body;
    const request_id = metadata.request_id;

    // Extract the transcript from the results
    const transcript = results.channels[0].alternatives[0].transcript;

    if (!request_id || !transcript) {
      return NextResponse.json({ message: "Invalid webhook payload" }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Step 1: Find the associated audio file using the request_id
    const audioFile = await AudioFileModel.findOne({ requestId: request_id });
    if (!audioFile) {
      return NextResponse.json(
        { error: "Invalid request_id or audio file not found" },
        { status: 400 }
      );
    }

    // Extract userId from the audio file document
    const { userId } = audioFile;

    // Step 2: Create a new STT entry in MongoDB
    const newSTT = await STTModel.create({
      audioId: audioFile._id,
      userId: userId,
      content: transcript,
    });

    // Step 3: Update the corresponding AudioFile to link the STT
    await AudioFileModel.findByIdAndUpdate(audioFile._id, {
      sttId: newSTT._id,
      $unset: { requestId: "" }, // Remove the request_id field since we don't need it
    });

    // Step 4: Update the User model to include the new STT in the user's array
    await UserModel.findByIdAndUpdate(userId, {
      $push: { stts: newSTT._id },
    });

    return NextResponse.json({ message: "Transcription saved successfully" }, { status: 200 });
    //!! Maybe do a notification of the top to show that it has arrived?
  } catch (error) {
    //!! Maybe do a notification of the top to show that it hadn't arrived?
    console.error("Error processing Deepgram webhook:", error);
    return NextResponse.json({ message: "Error processing webhook" }, { status: 500 });
  }
}
