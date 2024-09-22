"use client";
import { AudioFile } from "@/app/lib/mongodb/models";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import STTButton from "./STTButton";
//
interface Props {
  audioFile: AudioFile;
}
//
export default function TranscribeButton({ audioFile }: Props) {
  const { fileName, userId, _id: audioFileId } = audioFile;
  //
  const [isTranscribing, setIsTranscribing] = useState(false); // Track transcription state
  const [message, setMessage] = useState<string | null>(null); // Store success/error messages
  const [visible, setVisible] = useState<boolean>(false);

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    setMessage(null);

    try {
      // Call the /api/transcribe endpoint
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          userId,
          audioFileId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start transcription");
      }

      setMessage("Transcription started successfully!");
    } catch (error: any) {
      console.error("Error starting transcription:", error);
      setMessage(error.message || "Error during transcription");
    } finally {
      setIsTranscribing(false);
    }
  };

  const transcribeButtonsBody = () => {
    //stt doesn't exist and it's not transcribing starting situation
    if ((!isTranscribing || audioFile.requestId) && !audioFile.stt)
      return (
        <>
          <Button
            rounded
            severity="success"
            className="mr-2"
            tooltip="Get text from audio"
            onClick={handleTranscribe}
          >
            <i className="pi pi-microphone mr-1" />
            <i className="pi pi-arrow-right mr-1" />
            <i className="pi pi-align-justify" />
          </Button>
        </>
      );
    // we just put it to transcribe, but need to handle refreshing
    if (isTranscribing || audioFile.requestId)
      return (
        <>
          <Button
            rounded
            severity="success"
            className="mr-2"
            tooltip="Transcribing"
            // onClick={handleTranscribe}
          >
            <i className="pi pi-cog pi-spin" />
          </Button>
        </>
      );
    //it's transcribed and available
    if (audioFile.stt)
      return (
        <>
          <Button
            rounded
            icon="pi pi-eye"
            severity="success"
            className="mr-2"
            tooltip="Preview & Edit"
            onClick={() => setVisible(true)}
          ></Button>
          <STTButton sttId={audioFile.stt.toString()} userId={userId}></STTButton>
        </>
      );
  };

  return (
    <div>
      {/* <button //STT_Route!!!
        onClick={handleTranscribe}
        disabled={loading}
        className="btn btn-outline btn-secondary"
      >
        {loading ? "Transcribing..." : "Transcribe"}
      </button> */}
      {transcribeButtonsBody()}
    </div>
  );
}
