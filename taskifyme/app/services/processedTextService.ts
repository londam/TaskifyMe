import { handleError } from "../utils/errorHandler";
import { getSTTAudioFile } from "./sttService";

const deleteProcessedTextFromDB = async (processedTextId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/processedTexts/${processedTextId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete file from MongoDB");
    }

    return;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteProcessedText = async (audioFileId: string) => {
  await deleteProcessedTextFromDB(audioFileId);
};

export const saveProcessedTextToDB = async (
  processedTextContent: string,
  sttId: string,
  userId: string
) => {
  try {
    //get audio, stt, and user
    const audioFileId = await getSTTAudioFile(sttId);
    console.log({ processedTextContent, sttId, userId, audioFileId });
    //save procTxt to DB
    const procTxt = await fetch(`/api/processedTexts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ processedTextContent, sttId, userId, audioFileId }),
    });

    return procTxt;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
