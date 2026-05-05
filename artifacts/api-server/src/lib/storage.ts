import { Storage } from "@google-cloud/storage";

const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;

if (!bucketId) {
  throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID environment variable is required");
}

const storageClient = new Storage();
const bucket = storageClient.bucket(bucketId);

export async function uploadFile(
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const file = bucket.file(fileName);
  await file.save(buffer, {
    contentType,
    metadata: { cacheControl: "public, max-age=31536000" },
  });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucketId}/${fileName}`;
}

export async function deleteFile(fileName: string): Promise<void> {
  try {
    await bucket.file(fileName).delete();
  } catch {
    // Ignore if file doesn't exist
  }
}
