import { createClient, FileStat, WebDAVClient } from "webdav";

let webDiskClient: WebDAVClient | null = null;

const getWebDiskClient = (): WebDAVClient => {
  if (!webDiskClient) {
    webDiskClient = createClient(process.env.NEXT_PUBLIC_WEBDISK_HOST as string, {
      username: process.env.NEXT_PUBLIC_WEBDISK_USERNAME as string,
      password: process.env.NEXT_PUBLIC_WEBDISK_PASSWORD as string,
    });
  }
  return webDiskClient;
};

// Function to get a list of files in a directory
export const getFileList = async (folderPath: string): Promise<string[]> => {
  try {
    const response = await webDiskClient!.getDirectoryContents(folderPath); // Get directory contents

    // Check if the response has the expected type
    if (Array.isArray(response)) {
      return response.map((file: FileStat) => file.filename); // Return filenames from the list
    } else {
      // Handle unexpected response type
      console.error("Unexpected response type from getDirectoryContents:", response);
      throw new Error("Failed to retrieve file list");
    }
  } catch (error) {
    console.error("Error retrieving file list from Web Disk:", error);
    throw error;
  }
};

// Function to get a single file's content
export const getFile = async (filePath: string): Promise<Buffer> => {
  try {
    // Extract file extension
    const fileExtension = filePath.split(".").pop()?.toLowerCase();

    if (fileExtension !== "mp3" && fileExtension !== "m4a") {
      throw new Error("Unsupported file type");
    }

    const response = await webDiskClient!.getFileContents(filePath); // Get file contents

    if (typeof response === "string") {
      // If response is a string (could be a URL or file content as text)
      console.log("File type is text");
      return Buffer.from(response, "utf-8"); // Convert string to Buffer with UTF-8 encoding
    } else if (response instanceof Buffer) {
      // If response is already a Buffer
      return response;
    } else if (response instanceof Uint8Array) {
      // If response is an Uint8Array
      return Buffer.from(response);
    } else {
      console.error("Unexpected response type from getFileContents:", response);
      throw new Error("Failed to retrieve file content");
    }
  } catch (error) {
    console.error("Error retrieving file from Web Disk:", error);
    throw error;
  }
};

export const uploadFile = async (fileName: string, fileContent: Buffer | string): Promise<void> => {
  const client = getWebDiskClient();
  try {
    await client.putFileContents(`/${fileName}`, fileContent, { overwrite: true });
    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file to Web Disk:", error);
    throw error;
  }
};

export const deleteFile = async (fileName: string): Promise<void> => {
  const client = getWebDiskClient();
  try {
    await client.deleteFile(`/${fileName}`);
  } catch (error) {
    console.error("Error deleting file from Web Disk:", error);
    throw error;
  }
};
