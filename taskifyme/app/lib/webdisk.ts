import { createClient, WebDAVClient } from "webdav";

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

export const listFiles = async (directory: string = "/") => {
  const client = getWebDiskClient();
  try {
    const directoryItems = await client.getDirectoryContents(directory);
    return directoryItems;
  } catch (error) {
    console.error("Error fetching files from Web Disk:", error);
    throw error;
  }
};

export const uploadFile = async (fileName: string, fileContent: Buffer | string): Promise<void> => {
  const client = getWebDiskClient();
  try {
    await client.putFileContents(`/${fileName}`, fileContent, { overwrite: true });
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
