import { AudioFile } from "../lib/mongodb/models";

export const fetchUserAudioFiles = async (userId: string): Promise<AudioFile[]> => {
  const response = await fetch(`/api/users/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch audio files");
  }

  return data.audioFiles;
};
