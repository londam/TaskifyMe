import { NextResponse } from "next/server";
import { deleteFile, getFile, getFileList, uploadFile } from "@/app/lib/webdisk"; // Assuming this is the WebDAV upload function

// Mock function to get user _id (You'd replace this with your actual logic)
const getUserId = async (request: Request): Promise<string> => {
  // Mock user ID (replace with actual user fetching logic)
  return process.env.NEXT_USER_ID as string; // Should be dynamically fetched
};

// Function to generate a timestamp in YYYY-MM-DD-HH-mm-ss format
const getTimestamp = (): string => {
  const now = new Date(); // Use current browser time or UTC time
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

// Helper function to append the timestamp to the file name
const getFileNameWithTimestamp = (file: File): string => {
  const timestamp = getTimestamp(); // Get the current timestamp
  const originalFileName = file.name;

  const fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")); // Get file extension
  const fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf(".")); // Get file name

  return `${timestamp}_${fileNameWithoutExtension}${fileExtension}`; // Concatenate timestamp and file name
};

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request); //!! Get user ID (in real case, extract from session or JWT)
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Append timestamp to file name
    const fileNameWithTimestamp = getFileNameWithTimestamp(file);
    const folderPath = `${userId}`; // Use user _id as folder

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Node.js Buffer

    // Upload file to WebDAV folder with the new timestamped file name
    await uploadFile(`${folderPath}/${fileNameWithTimestamp}`, buffer);

    const fileUrl = `${folderPath}/${fileNameWithTimestamp}`; // Construct the file URL

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

// GET: Retrieve the list of files in the user’s folder
export async function GET(request: Request) {
  try {
    const userId = await getUserId(request); // Fetch the user's ID
    const url = new URL(request.url);
    const fileName = url.searchParams.get("fileName"); // Get fileName from query parameters

    // If fileName is provided, get the specific file
    if (fileName) {
      const filePath = `${userId}/${fileName}`;
      const fileContent = await getFile(filePath); // Function to get the file content from WebDAV

      return NextResponse.json({ file: fileContent });
    } else {
      // If no fileName is provided, return the list of files
      const folderPath = `${userId}`;
      const fileList = await getFileList(folderPath); // Function to get file list from WebDAV

      return NextResponse.json({ files: fileList });
    }
  } catch (error) {
    console.error("Error retrieving file:", error);
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 });
  }
}

// DELETE: Delete a specific file by name
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId(request);
    const url = new URL(request.url);
    const fileName = url.searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json({ error: "No file specified" }, { status: 400 });
    }

    const filePath = `${userId}/${fileName}`;
    await deleteFile(filePath); // Function to delete the file from WebDAV

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
