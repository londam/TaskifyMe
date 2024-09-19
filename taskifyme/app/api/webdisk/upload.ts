import type { NextApiRequest, NextApiResponse } from "next";
import { uploadFile } from "@/app/lib/webdisk";

//This route allows you to upload a file.
//You will need to send the fileName and fileContent in the POST request body.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { fileName, fileContent } = req.body;

    //check if any is empty
    if (!fileName || !fileContent) {
      return res.status(400).json({ error: "Missing fileName or fileContent" });
    }
    //check for adequate extenstion
    const fileExtension: string = fileName.split(".").pop();
    if (fileExtension.toLocaleLowerCase() !== "mp3")
      return res.status(400).json({ error: "Wrong file extension" });

    //uplaod the file to server
    try {
      await uploadFile(fileName, fileContent);

      // Construct the file URL
      const fileUrl = `${process.env.NEXT_PUBLIC_WEBDISK_HOST}/webdisk/${fileName}`;

      // Return the file URL in the response
      res.status(200).json({ message: "File uploaded successfully", fileUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
