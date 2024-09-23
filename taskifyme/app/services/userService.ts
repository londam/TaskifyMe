import { AudioFile } from "../lib/mongodb/models";

export const fetchUserAudioFiles = async (userId: string): Promise<AudioFile[]> => {
  const response = await fetch(`/api/users/${userId}/audioFiles`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch audio files");
  }

  return data.audioFiles;
};

export const fetchUserSTTs = async (userId: string): Promise<AudioFile[]> => {
  const response = await fetch(`/api/users/${userId}/stts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch STT files");
  }

  return data.audioFiles;
};

export const fetchUserProcessedTexts = async (userId: string): Promise<AudioFile[]> => {
  const response = await fetch(`/api/users/${userId}/processedTexts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch STT files");
  }

  return data.audioFiles;
};
