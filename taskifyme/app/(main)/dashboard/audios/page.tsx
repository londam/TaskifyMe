"use client";
import React from "react";
import AudioTablePR from "./AudioTablePR";

const AudiosPage = () => {
  const userId = process.env.NEXT_PUBLIC_USER_ID;

  return (
    <>
      <h1>Audios Page</h1>
      <div className="mt-5 bg-base-100 flex items-center justify-center">
        <AudioTablePR userId={userId!} />
      </div>
    </>
  );
};

export default AudiosPage;
