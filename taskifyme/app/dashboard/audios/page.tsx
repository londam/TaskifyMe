import React from "react";
import AudioPlayer from "./AudioPlayer";
import FileUpload from "./FileUpload";
import AudioTable from "./AudioTable";

const AudiosPage = () => {
  const userId = process.env.NEXT_PUBLIC_USER_ID;
  return (
    <>
      <div>AudiosPage</div>
      <FileUpload />
      <div className="mt-5 bg-base-100 flex items-center justify-center">
        <AudioTable userId={userId!} />
      </div>
    </>
  );
};

export default AudiosPage;
