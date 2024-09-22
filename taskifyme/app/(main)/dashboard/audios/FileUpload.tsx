"use client";

import { useState } from "react";

const FileUpload = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const userId = process.env.NEXT_PUBLIC_USER_ID;

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setSuccess(null);
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload file to Web Disk
      const uploadResponse = await fetch("/api/webdisk", {
        // Changed endpoint to /api/webdisk for POST
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setError(uploadData.error || "Failed to upload file");
        return;
      }

      const fileName = uploadData.fileName;

      // Step 2: Update database with file URL
      const updateResponse = await fetch("/api/audios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, userId }), // !! replace with dynamic userId
      });

      const updateData = await updateResponse.json();
      if (!updateResponse.ok) {
        setError(updateData.error || "Failed to update database");
        return;
      }

      console.log("File successfully uploaded and saved to database:", updateData);
      setSuccess("File Successfully Added!");
      // Call the onUploadSuccess callback to refresh AudioTable
      onUploadSuccess();
    } catch (err) {
      setError("An error occurred during the upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg shadow-lg">
      <div className="flex flex-row items-center p-1 ">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered file-input-primary w-full max-w-xs mr-3"
        />
        <button onClick={handleUpload} className="btn btn-primary" disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-700 mt-2">{success}</p>}
    </div>
  );
};

export default FileUpload;
