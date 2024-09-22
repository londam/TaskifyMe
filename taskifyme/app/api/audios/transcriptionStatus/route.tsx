// /api/transcription-status/[audioFileId].ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb/dbConnect";
import { AudioFileModel } from "@/app/lib/mongodb/models";

export async function POST(request: NextRequest, response: NextResponse) {
  const { audioFileId } = await request.json();
  console.log(
    "____________________POOLING___IN______api/audio/transcribe______________________________"
  );

  try {
    await dbConnect();

    const audioFile = await AudioFileModel.findById(audioFileId);

    if (!audioFile) {
      return NextResponse.json({ message: "Audio file not found" }, { status: 404 });
    }

    // Check if the STT (transcription) is available
    if (audioFile.stt) {
      return NextResponse.json({ status: "completed", sttId: audioFile.stt }, { status: 200 });
    }
    return NextResponse.json({ status: "pending", sttId: audioFile.stt }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: "Error fetching transcription status", error },
      { status: 500 }
    );
  }
}
