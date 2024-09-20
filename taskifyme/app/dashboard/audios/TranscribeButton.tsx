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

  const handleTranscribe = async () => {
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

  return (
    <div>
      <button
        onClick={handleTranscribe}
        disabled={loading}
        className="btn btn-outline btn-secondary"
      >
        {loading ? "Transcribing..." : "Transcribe"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {transcript && (
        <div>
          <h3>Transcription:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
