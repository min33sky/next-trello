import { storage } from './appwrite';

export default async function getUrl(image: Image) {
  return storage.getFilePreview(image.bucketId, image.fileId);
}
