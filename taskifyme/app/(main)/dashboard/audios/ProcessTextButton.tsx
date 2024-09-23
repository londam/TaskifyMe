import { Button } from "primereact/button";
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

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResponse(data.choices[0].text.trim());
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
    </>
  );
}
