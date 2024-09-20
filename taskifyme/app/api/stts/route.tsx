import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { AudioFileModel, UserModel, STTModel } from "@/app/lib/mongodb/models";

// Initialize Deepgram SDK
const deepgram = createClient(process.env.DEEPGRAM_STT_API_KEY!);

export async function POST(request: NextRequest) {
  // Step 0. Parse the JSON body instead of extracting from URL
  const body = await request.json();
  const { fileName, userId, audioFileId } = body;

  if (!fileName || !userId || !audioFileId) {
    return NextResponse.json(
      { message: "Missing fileName, userId, or audioFileId" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Fetch the file from your existing WebDisk route using full URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const fileResponse = await fetch(
      `${appUrl}/api/webdisk?fileName=${encodeURIComponent(fileName)}`
    );

    if (!fileResponse.ok) {
      throw new Error("Failed to fetch file from WebDisk");
    }

    // Step 2: Get the file buffer for transcription
    const fileBuffer = await fileResponse.arrayBuffer();

    // Step 3: Send the audio file to Deepgram for transcription
    // const transcriptionResponse = await deepgram.transcription.preRecorded(
    //   { buffer: Buffer.from(fileBuffer), mimetype: "audio/mpeg" }, // Adjust mimetype as needed
    //   { punctuate: true, language: "en" }
    // );
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      Buffer.from(fileBuffer), // The audio file as a buffer
      {
        model: "nova", // Adjust model as needed (e.g., nova-2, general)
        punctuate: true, // Enable punctuation
        language: "en", // Set the language, adjust as needed
      }
    );
    if (error) {
      throw new Error(`Deepgram error: ${error}`);
    }
    const transcript = result.results.channels[0].alternatives[0].transcript;

    // Step 4: Connect to the database
    await dbConnect();

    // Step 5: Create a new STT entry in MongoDB
    const newSTT = await STTModel.create({
      audio: audioFileId,
      content: transcript,
    });

    // Step 6: Update the corresponding AudioFile to link the STT
    await AudioFileModel.findByIdAndUpdate(audioFileId, {
      stt: newSTT._id, // Link the STT to the audio file
    });

    // Step 7: Update the User model to include the new STT in the user's array
    await UserModel.findByIdAndUpdate(userId, {
      $push: { stts: newSTT._id }, // Add the STT to the user's list of STTs
    });

    // Step 8: Return success response
    return NextResponse.json({
      message: "Transcription successful and added to database",
      transcript: transcript,
    });
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json({ message: "Error processing transcription" }, { status: 500 });
  }
}
