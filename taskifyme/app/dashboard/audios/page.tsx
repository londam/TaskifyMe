import React from "react";
import AudioPlayer from "./AudioPlayer";
import FileUpload from "./FileUpload";

const AudiosPage = () => {
  return (
    <>
      <div>AudiosPage</div>
      <FileUpload />
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <AudioPlayer src="/copy_2.mp3" />
      </div>
    </>
  );
};

export default AudiosPage;
