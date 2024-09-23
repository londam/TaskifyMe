import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
//
interface Props {
  sttId: string;
}
//
export default function ProcessTextButton({ sttId }: Props) {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse("");

    //fetch data from DB
    try {
      const response = await fetch(`/api/stts/${sttId}`); // Fetch from DB
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch STT");
      }

      setPrompt(data.content); // Assuming the API returns an STT with a content field
    } catch (err) {
      setError("Error fetching STT");
      console.error("Error fetching STT:", err);
    }
    //send data to openAI
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log("AI data", data);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResponse(data.choices[0].message.content);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className="btn btn-secondary btn-outline" onClick={handleSubmit}>
        Process via chatGPT
      </Button>
      {response && <Button className="btn btn-secondary btn-outline">View</Button>}
      <InputTextarea value={response} className="w-full h-full" />
    </>
  );
}
