import { createClient, FileStat, WebDAVClient } from "webdav";

let webDiskClient: WebDAVClient | null = null;

const getWebDiskClient = (): WebDAVClient => {
  if (!webDiskClient) {
    webDiskClient = createClient(process.env.WEBDISK_HOST as string, {
      username: process.env.WEBDISK_USERNAME as string,
      password: process.env.WEBDISK_PASSWORD as string,
    });
  }
  return webDiskClient;
};

// Function to get a list of files in a directory
export const getFileList = async (folderPath: string): Promise<string[]> => {
  const client = getWebDiskClient();

  try {
    const response = await client.getDirectoryContents(folderPath); // Get directory contents

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
export const getFile = async (filePath: string) => {
  const client = getWebDiskClient();

  if (!client) {
    throw new Error("Failed to initialize WebDisk client");
  }

  console.log("Fetching file from path:", filePath);

  try {
    const fileContent = await client.getFileContents(filePath);
    console.log("File content retrieved successfully.");
    return fileContent;
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
