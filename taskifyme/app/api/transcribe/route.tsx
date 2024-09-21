// app/api/transcribe/route.tsx

import { NextRequest, NextResponse } from "next/server";
import { createClient, CallbackUrl } from "@deepgram/sdk";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { AudioFileModel } from "@/app/lib/mongodb/models";

// Initialize Deepgram SDK
const deepgram = createClient(process.env.DEEPGRAM_STT_API_KEY!);

export async function POST(request: NextRequest) {
  // Step 0. Parse the JSON body instead of extracting from URL
  const body = await request.json();
  const { fileName, audioFileId } = body;

  if (!fileName || !audioFileId) {
    return NextResponse.json({ message: "Missing fileName, or audioFileId" }, { status: 400 });
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

    // Step 3: Send the audio file to Deepgram with webhook URL
    const callbackURL = new CallbackUrl(
      `${process.env.NEXT_PUBLIC_APP_DEEP_URL}/api/callbacks/deepgram`
    );
    const { result, error } = await deepgram.listen.prerecorded.transcribeFileCallback(
      Buffer.from(fileBuffer), // The audio file as a buffer
      callbackURL,
      {
        model: "nova", // Adjust model as needed
        punctuate: true,
        language: "en", // Adjust language as needed
        callback_method: "post",
        callback_data: JSON.stringify({
          audioFileId,
        }), // Pass the audioFileId and userId as metadata
      }
    );

    if (error) new Error("Failed to send file to Deepgram and get a request_id");

    // Step 4: Store the request_id for future verification
    await dbConnect();
    await AudioFileModel.findByIdAndUpdate(audioFileId, {
      requestId: result!.request_id, // Store request_id with the audio file
    });

    // Step 5: Respond with a success message indicating the transcription request was sent
    return NextResponse.json({
      message: "Transcription request sent to Deepgram",
    });
  } catch (error) {
    console.error("Error during transcription request:", error);
    return NextResponse.json(
      { message: "Error processing transcription request" },
      { status: 500 }
    );
  }
}
