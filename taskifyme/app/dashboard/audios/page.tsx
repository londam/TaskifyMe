import React from "react";
import AudioPlayer from "./AudioPlayer";
import FileUpload from "./FileUpload";

const AudiosPage = () => {
  return (
    <>
      <div>AudiosPage</div>
      <FileUpload />
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <AudioPlayer audioFileId="66ec8a92604436ea8d02e9de" />
      </div>
    </>
  );
};

export default AudiosPage;
