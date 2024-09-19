import Link from "next/link";
import React from "react";

const SideBar = () => {
  return (
    <div className="flex flex-col p-4 bg-stone-300">
      <Link className="p-4 hover:bg-zinc-400" href="/dashboard">
        Dashboard
      </Link>
      <Link className="p-4 hover:bg-zinc-400" href="/dashboard/audios">
        Audio Files
      </Link>
      <Link className="p-4 hover:bg-zinc-400" href="/dashboard/stts">
        STTs
      </Link>
      <Link className="p-4 hover:bg-zinc-400" href="/dashboard/notes">
        Notes
      </Link>
      <Link className="p-4 hover:bg-zinc-400" href="/dashboard/tasks">
        Tasks
      </Link>
    </div>
  );
};

export default SideBar;
