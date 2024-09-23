import { handleError } from "../utils/errorHandler";

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
