import { saveProcessedTextToDB } from "@/app/services/processedTextService";
import { getSTTContent, sendToOpenAI } from "@/app/services/sttService";
import { updateUserTokens } from "@/app/services/userService";
import { Button } from "primereact/button";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";

//
interface Props {
  sttId: string;
  userId: string;
}
//
export default function ProcessTextButton({ sttId, userId }: Props) {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse("");

    //fetch data from DB
    try {
      // Fetch STT content from the service
      const fetchedContent = await getSTTContent(sttId);
      setPrompt(fetchedContent);

      // Send the prompt to OpenAI
      const aiData = await sendToOpenAI(fetchedContent);
      const prompt = aiData.choices[0].message.content;
      // const prompt = "now is really equal to 5";
      setResponse(prompt);

      //save it to DB
      await saveProcessedTextToDB(prompt, sttId, userId);

      // Update user tokens with data from OpenAI response
      await updateUserTokens(userId, aiData.usage.total_tokens);

      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "STT Transcript Processed!",
        life: 3000,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // const debugTokensAndPropmtSave = async () => {
  //   await updateUserTokens(userId, 269);
  // };

  return (
    <>
      <Toast ref={toast} />
      <Button className="btn btn-secondary btn-outline" onClick={handleSubmit}>
        Process via chatGPT
      </Button>
    </>
  );
}
