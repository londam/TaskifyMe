"use client";
import React, { useState } from "react";
//
interface Props {
  fileName: string;
  userId: string;
  audioFileId: string;
}
//
export default function TranscribeButton({ fileName, userId, audioFileId }: Props) {
  //
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isTranscribing, setIsTranscribing] = useState(false); // Track transcription state
  const [message, setMessage] = useState<string | null>(null); // Store success/error messages

  const handleTranscribeSTTRouter = async () => {
    setLoading(true);
    setError(null);
    setTranscript(null);

    try {
      // Send the file path to your API to initiate the transcription process
      const response = await fetch(`/api/stts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName,
          userId: userId,
          audioFileId: audioFileId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process the file.");
      }

      const data = await response.json();
      setTranscript(data.transcript);
    } catch (error) {
      setError("Error occurred during transcription.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div>
      {/* <button //STT_Route!!!
        onClick={handleTranscribe}
        disabled={loading}
        className="btn btn-outline btn-secondary"
      >
        {loading ? "Transcribing..." : "Transcribe"}
      </button> */}
      <button className="btn btn-primary" onClick={handleTranscribe} disabled={isTranscribing}>
        {isTranscribing ? "Transcribing..." : "Transcribe"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>{message}</p>} {/* Display success or error messages */}
    </div>
  );
}
