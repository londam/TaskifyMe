import type { NextApiRequest, NextApiResponse } from "next";
import { listFiles } from "@/app/lib/webdisk";

//This route lists the files from the root of your Web Disk.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const files = await listFiles("/");
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to list files" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
