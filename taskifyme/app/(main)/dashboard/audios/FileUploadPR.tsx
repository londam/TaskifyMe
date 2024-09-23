"use client";

import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { FileUpload, FileUploadFile, FileUploadHandlerEvent } from "primereact/fileupload";

import { useState } from "react";

const FileUploadPR = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const userId = process.env.NEXT_PUBLIC_USER_ID;
  const toast = useRef<Toast>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create a reference for FileUpload
  const fileUploadRef = useRef<FileUpload>(null);

  const handleUpload = async (event: FileUploadHandlerEvent) => {
    const handleFileUpload = async (file: FileUploadFile) => {
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
        if (fileUploadRef.current) fileUploadRef.current.clear(); // Clear the file input
        toast.current?.show({ severity: "info", summary: "Success", detail: "File Uploaded" });
      } catch (err) {
        setError("An error occurred during the upload");
        toast.current?.show({ severity: "error", summary: "Error", detail: "Error Upload Failed" });
      }
    };
    event.files.map((file) => handleFileUpload(file));
  };

  // Automatically clear the error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Clear the error after 3 seconds
      }, 3000);

      // Cleanup the timer when the component unmounts or when error changes
      return () => clearTimeout(timer);
    }
  }, [error]);
  // Automatically clear the success after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(""); // Clear the error after 3 seconds
      }, 3000);

      // Cleanup the timer when the component unmounts or when error changes
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div>
      <Toast ref={toast}></Toast>
      <FileUpload
        ref={fileUploadRef} // Attach the ref to the FileUpload component
        mode="basic"
        name="demo[]"
        url="/api/upload"
        chooseLabel="Add New..."
        uploadLabel="Uploading..."
        accept="audio/*"
        customUpload
        uploadHandler={handleUpload}
        onUpload={() => console.log("uploaded File")}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-700 mt-2">{success}</p>}
    </div>
  );
};

export default FileUploadPR;
