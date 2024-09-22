"use client";
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import AudioTable from "./AudioTable";
import { any } from "zod";
import AudioTablePR from "./AudioTablePR";

const AudiosPage = () => {
  const userId = process.env.NEXT_PUBLIC_USER_ID;
  const [refreshAudioTable, setRefreshAudioTable] = useState(false);

  // Function to trigger a refresh in the AudioTable component
  const handleRefresh = () => {
    setRefreshAudioTable((prev) => !prev); // Toggling state to trigger refresh
  };

  return (
    <>
      <div>AudiosPage</div>
      <FileUpload onUploadSuccess={handleRefresh} />
      <AudioTable userId={userId!} refresh={refreshAudioTable} />
      <div className="mt-5 bg-base-100 flex items-center justify-center">
        <AudioTablePR userId={userId!} refresh={refreshAudioTable} />
      </div>
    </>
  );
};

export default AudiosPage;
