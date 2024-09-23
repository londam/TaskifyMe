"use client";
import React from "react";
import ProcessedTextTable from "./ProcessedTextTable";

const ProcessedTextPage = () => {
  const userId = process.env.NEXT_PUBLIC_USER_ID;

  return (
    <>
      <h1>Processed Texts Page</h1>
      <div className="mt-5 bg-base-100 flex items-center justify-center">
        <ProcessedTextTable userId={userId!} />
      </div>
    </>
  );
};

export default ProcessedTextPage;
