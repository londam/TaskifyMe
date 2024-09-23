"use client";
import { AudioFile } from "@/app/lib/mongodb/models";
import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import ProcessTextButton from "./ProcessTextButton";
import { InputTextarea } from "primereact/inputtextarea";
//
interface Props {
  audioFile: AudioFile;
}
//
export default function TranscribeButton({ audioFile }: Props) {
  const { fileName, userId, _id: audioFileId } = audioFile;
  const [sttContent, setSttContent] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //
  const [isTranscribing, setIsTranscribing] = useState(false); // Track transcription state
  const POLLING_INTERVAL = 2500; // Poll every 5 seconds

  const handleShowingTranscription = async () => {
    console.log("sttContent", sttContent);
    // Check if the STT content is already fetched
    if (sttContent !== "") {
      // Already fetched, just show the dialog
      setVisible(true);
    } else if (audioFile.sttId) {
      // Not fetched yet, fetch it and then show the dialog
      await fetchSTT(audioFile.sttId.toString());
      setVisible(true);
    }
  };

  const fetchSTT = async (sttId: string) => {
    try {
      const response = await fetch(`/api/stts/${sttId}`); // Fetch from DB
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch STT");
      }

      setSttContent(data.content); // Assuming the API returns an STT with a content field
    } catch (err) {
      setError("Error fetching STT");
      console.error("Error fetching STT:", err);
    }
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);

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

      // Start polling for transcription status
      startPollingTranscriptionStatus();
    } catch (error: any) {
      console.error("Error starting transcription:", error);
    } finally {
    }
  };

  // Function to start polling transcription status
  const startPollingTranscriptionStatus = () => {
    const polling = setInterval(async () => {
      try {
        // Poll the backend for transcription status
        const response = await fetch(`/api/audios/transcriptionStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioFileId,
          }),
        });
        const data = await response.json();

        if (data.status === "completed") {
          // Stop polling when transcription is completed
          clearInterval(polling);
          audioFile.sttId = data.sttId; // Update the transcription content in state
          setIsTranscribing(false); // Update state to show transcription is done
          console.log("Transcription completed:", data.transcript);
        }
      } catch (error) {
        console.error("Error polling transcription status:", error);
      } finally {
      }
    }, POLLING_INTERVAL);
  };

  const transcribeButtonsBody = () => {
    //stt doesn't exist and it's not transcribing starting situation
    if ((!isTranscribing || audioFile.requestId) && !audioFile.sttId)
      return (
        <>
          <Button rounded severity="success" className="mr-2" onClick={handleTranscribe}>
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
            // onClick={handleTranscribe}
          >
            <i className="pi pi-cog pi-spin" />
          </Button>
        </>
      );
    //it's transcribed and available
    if (audioFile.sttId)
      return (
        <>
          <Button
            rounded
            icon="pi pi-eye"
            severity="success"
            className="mr-2"
            onClick={handleShowingTranscription}
          ></Button>
        </>
      );
  };

  return (
    <div>
      {transcribeButtonsBody()}

      <Dialog
        header="Header"
        visible={visible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        focusOnShow={false} // Prevents dialog from auto-focusing elements inside
        blockScroll={true} // Prevent the dialog from managing focus incorrectly
      >
        <InputTextarea
          value={sttContent}
          onChange={(e) => setSttContent(e.target.value)}
          rows={10}
          className="w-full h-full"
        />
      </Dialog>
    </div>
  );
}
