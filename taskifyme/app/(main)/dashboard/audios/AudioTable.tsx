"use client";
import { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer"; // Assume you have this component
import TranscribeButton from "./TranscribeButton";
import { AudioFile } from "@/app/lib/mongodb/models";
import ProcessTextButton from "./ProcessTextButton";

interface Props {
  userId: string;
  refresh: boolean;
}
//
export default function AudioTable({ userId, refresh }: Props) {
  //! dynamically change user !!
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`); // Assuming the user GET endpoint returns audio files
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch audio files");
        }

        setAudioFiles(data.audioFiles); // Assuming data.files is an array of filenames
      } catch (err) {
        console.error("Error fetching audio files:", err);
        setError("Failed to load audio files");
      } finally {
        setLoading(false);
      }
    };

    fetchAudioFiles();
  }, [refresh]);

  const handleDelete = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    try {
      // Step 1: Delete from MongoDB
      const deleteFromDBResponse = await fetch(`/api/audios/${fileId}`, {
        method: "DELETE",
      });

      if (!deleteFromDBResponse.ok) {
        throw new Error("Failed to delete file from MongoDB");
      }

      // Step 2: Delete from WebDisk
      const deleteFromWebDiskResponse = await fetch(
        `/api/webdisk?fileName=${encodeURIComponent(fileName)}`,
        {
          method: "DELETE",
        }
      );

      if (!deleteFromWebDiskResponse.ok) {
        throw new Error("Failed to delete file from WebDisk");
      }

      // Update UI to reflect the deleted file
      setAudioFiles((prevFiles) => prevFiles.filter((file) => file._id.toString() !== fileId));
    } catch (error) {
      console.error("Error deleting audio file:", error);
      alert("Failed to delete audio file. Please try again.");
    }
  };

  // Function to parse the file name and extract the date and initial file name
  const parseFileName = (fileName: string) => {
    const underscoreIndex = fileName.indexOf("_"); // Find the first occurrence of "_"
    // Use slice to get everything after the first underscore
    return fileName.slice(underscoreIndex + 1);
  };

  if (loading) {
    return <div>Loading audio files...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full bg-base-200 rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Initial File Name</th>
            <th className="px-4 py-2">Date of Upload</th>
            <th className="px-4 py-2">Audio</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {audioFiles.map((file) => {
            const initialFileName = parseFileName(file.fileName);

            return (
              <tr key={file._id} className="border-t">
                <td className="px-4 py-2">{initialFileName}</td>
                <td className="px-4 py-2">{new Date(file.uploadedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <AudioPlayer audioFileId={file._id} />
                </td>
                <td className="px-4 py-2">
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(file._id, file.fileName)}
                  >
                    Delete
                  </button>
                  {file.sttId ? (
                    <ProcessTextButton
                      sttId={file.sttId.toString()}
                      userId={userId}
                    ></ProcessTextButton>
                  ) : (
                    <TranscribeButton audioFile={file} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
