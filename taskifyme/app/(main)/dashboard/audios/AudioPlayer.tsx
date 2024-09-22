"use client";
import { useState, useRef, useEffect } from "react";
//
interface Props {
  audioFileId: string;
}
//
export default function AudioPlayer({ audioFileId }: Props) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Store the final audio URL (Blob URL)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      let fileName;

      // Block 1: Fetch the audio file name (or URL) from the database
      try {
        const response = await fetch(`/api/audios/${audioFileId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch audio metadata");
        }

        // Extract the audio URL or filename from the response
        fileName = data.fileName; // assuming data.url contains the filename or URL
      } catch (err) {
        console.error("Error fetching audio metadata:", err);
        setError("Failed to load audio metadata");
        setLoading(false);
        return; // Exit if fetching from the database fails
      }

      // Block 2: Fetch the actual audio file from your backend API (which interacts with WebDisk)
      try {
        const response = await fetch(`/api/webdisk?fileName=${fileName}`); // Use your API route for WebDisk

        if (!response.ok) {
          throw new Error("Failed to fetch audio file from WebDisk");
        }

        // Fetch the audio file as a Blob (binary data)
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob); // Create a URL for the Blob
        setAudioUrl(blobUrl); // Set the Blob URL to be used in the audio player
      } catch (err) {
        console.error("Error fetching audio file from WebDisk:", err);
        setError("Failed to load audio file from WebDisk");
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl); // Clean up Blob URL when component unmounts
      }
    };
  }, [audioFileId]);
  //
  useEffect(() => {
    if (audioUrl) {
      console.log("Audio URL generated:", audioUrl);
    }
  }, [audioUrl]);
  //
  return (
    <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg shadow-lg">
      {loading && <div>Loading audio...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && audioUrl ? (
        <audio controls>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <div>No audio file available</div>
      )}
    </div>
  );
}
