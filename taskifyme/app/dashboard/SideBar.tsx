import Link from "next/link";
import React from "react";

const SideBar = () => {
  return (
    <div className="flex flex-col p-4 bg-stone-300">
      <Link className="btn" href="/dashboard">
        Dashboard
      </Link>
      <Link className="btn" href="/dashboard/audios">
        Audio Files
      </Link>
      <Link className="btn" href="/dashboard/stts">
        STTs
      </Link>
      <Link className="btn" href="/dashboard/notes">
        Notes
      </Link>
      <Link className="btn" href="/dashboard/tasks">
        Tasks
      </Link>
    </div>
  );
};

export default SideBar;
