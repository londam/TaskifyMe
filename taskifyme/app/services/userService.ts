import { AudioFile, STT, ProcessedText } from "../lib/mongodb/models";

export const fetchUserAudioFiles = async (userId: string): Promise<AudioFile[]> => {
  const response = await fetch(`/api/users/${userId}/audioFiles`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch audio files");
  }

  return data.audioFiles;
};

export const fetchUserSTTs = async (userId: string): Promise<STT[]> => {
  const response = await fetch(`/api/users/${userId}/stts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch STT files");
  }

  return data.audioFiles;
};

export const fetchUserProcessedTexts = async (userId: string): Promise<ProcessedText[]> => {
  const response = await fetch(`/api/users/${userId}/processedTexts`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch STT files");
  }

  return data.processedTexts;
};

const updateUser = async (userId: string, tokens = 0, minutes = 0) => {
  console.log("updateUser function", userId, tokens, minutes);
  const response = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokens, minutes }),
  });
};

export const updateUserTokens = async (userId: string, tokens = 0) => {
  await updateUser(userId, tokens, 0);
};
export const updateUserMinutes = async (userId: string, minutes = 0) => {
  await updateUser(userId, 0, minutes);
};
