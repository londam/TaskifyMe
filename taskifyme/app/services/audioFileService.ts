import { AudioFile } from "../lib/mongodb/models";
import { handleError } from "../utils/errorHandler";

const deleteAudioFromDB = async (audioFileId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/audios/${audioFileId}`, {
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

const deleteAudioFromWebDisk = async (fileName: string): Promise<void> => {
  try {
    const response = await fetch(`/api/webdisk?fileName=${encodeURIComponent(fileName)}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete file from WebDisk");
    }

    return;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteAudioFile = async (audioFileId: string, fileName: string) => {
  await deleteAudioFromDB(audioFileId);
  await deleteAudioFromWebDisk(fileName);
};

export const fetchAudioFile = async (audioFileId: string): Promise<AudioFile> => {
  const response = await fetch(`/api/audios/${audioFileId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch audio files");
  }

  return data;
};
