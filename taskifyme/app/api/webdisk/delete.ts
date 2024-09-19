import type { NextApiRequest, NextApiResponse } from "next";
import { deleteFile } from "@/app/lib/webdisk";

//This route handles deleting a file. You need to send the fileName in the DELETE request body.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const { fileName } = req.body;
    try {
      await deleteFile(fileName);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
