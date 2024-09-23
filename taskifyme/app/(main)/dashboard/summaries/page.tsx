"use client";
import React from "react";
import SummaryTable from "./SummaryTable";

const SummariesPage = () => {
  const userId = process.env.NEXT_PUBLIC_USER_ID;

  return (
    <>
      <h1>Summaries Page</h1>
      <div className="mt-5 bg-base-100 flex items-center justify-center">
        <SummaryTable userId={userId!} />
      </div>
    </>
  );
};

export default SummariesPage;
