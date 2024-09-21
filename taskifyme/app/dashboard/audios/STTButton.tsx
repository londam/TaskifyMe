import React, { useState } from "react";
//
interface Props {
  sttId: string;
  userId: string;
}
//
export default function STTButton({ sttId, userId }: Props) {
  const [sttContent, setSttContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(true);

  const fetchSTT = async (sttId: string) => {
    try {
      setLoading(true);
      console.log("URL: ***************************************** ", `/api/stts/${sttId}`);

      const response = await fetch(`/api/stts/${sttId}`); // Fetch from DB
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch STT");
      }

      setSttContent(data.content); // Assuming the API returns an STT with a content field
    } catch (err) {
      setError("Error fetching STT");
      console.error("Error fetching STT:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowTranscription = () => {
    if (!sttContent) {
      fetchSTT(sttId); // Fetch transcription if not already fetched
    } else setShowContent(!showContent);
  };

  return (
    <>
      <>
        <button className="btn btn-secondary" onClick={handleShowTranscription}>
          {sttContent && showContent ? "Hide transcription" : "Show transcription"}
        </button>

        {loading && <p>Loading transcription...</p>}
        {error && <p>{error}</p>}

        {sttContent && showContent && (
          <div>
            <p>{sttContent}</p> {/* Display the transcription */}
          </div>
        )}

        <button className="btn btn-secondary btn-outline">Process transcription</button>
      </>
    </>
  );
}
