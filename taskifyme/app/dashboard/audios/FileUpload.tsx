"use client";

import { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // Handle success, e.g., save the URL or show a success message
        console.log("File URL:", data.fileUrl);
      } else {
        // Handle error
        setError(data.error || "Upload failed");
      }
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
    </div>
  );
};

export default FileUpload;
