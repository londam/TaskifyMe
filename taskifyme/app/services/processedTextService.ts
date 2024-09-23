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

export const deleteProcessedText = async (processedTextId: string) => {
  await deleteProcessedTextFromDB(processedTextId);
};

export const saveNewProcessedTextToDB = async (
  processedTextContent: string,
  sttId: string,
  userId: string
) => {
  try {
    //get audio, stt, and user
    const audioFileId = await getSTTAudioFile(sttId);
    // console.log({ processedTextContent, sttId, userId, audioFileId });

    //save procTxt to DB
    const procTxt = await fetch(`/api/processedTexts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ processedTextContent, sttId, userId, audioFileId }),
    });

    if (!procTxt.ok) {
      // Handle the error response (e.g., log error, show a message)
      const errorData = await procTxt.json();
      console.error("Error creating processed text:", errorData);
      throw new Error("Failed to create processed text");
    }

    return procTxt;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateProcessedTextContentToDB = async (
  processedTextContent: string,
  processedTextId: string
) => {
  try {
    //update procTxt to DB
    const procTxt = await fetch(`/api/processedTexts/${processedTextId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ processedTextContent }),
    });

    if (!procTxt.ok) {
      // Handle the error response (e.g., log error, show a message)
      const errorData = await procTxt.json();
      console.error("Error updating processed text:", errorData);
      throw new Error("Failed to updating processed text");
    }

    return procTxt;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
