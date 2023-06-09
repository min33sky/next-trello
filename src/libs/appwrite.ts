import { Client, ID, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// ********************************************************************************************* //
// ************************************  Appwrite API  ***************************************** //
// ********************************************************************************************* //

/**
 * DB에 Document를 생성합니다.
 * @param data DB에 저장할 데이터
 */
const createDocument = async (data: Record<string, any>) => {
  try {
    return await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID,
      ID.unique(),
      data,
    );
  } catch (error) {
    console.log('>>>>> createDocument error : ', error);
    throw error;
  }
};

/**
 * DB에서 Document를 삭제합니다.
 * @param documentId
 */
const deleteDocumentById = async (documentId: string) => {
  try {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID,
      documentId,
    );

    console.log('>>>>> deleteDocumentById success ~~~~~~~~~~~~');
  } catch (error) {
    console.log('>>>>> deleteDocumentById error : ', error);
  }
};

/**
 * DB에서 Document를 업데이트합니다.
 * @param documentId
 * @param data
 */
const updateDocumentById = async (
  documentId: string,
  data: Record<string, any>,
) => {
  try {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID,
      documentId,
      data,
    );

    console.log('>>>>> updateDocumentById success ~~~~~~~~~~~~');
  } catch (error) {
    console.log('>>>>> updateDocumentById error : ', error);
  }
};

/**
 * Storage에서 File을 삭제합니다.
 * @param bucketId
 * @param fileId
 */
const deleteFile = async (bucketId: string, fileId: string) => {
  try {
    await storage.deleteFile(bucketId, fileId);
    console.log('>>>>> deleteFile success ~~~~~~~~~~~~');
  } catch (error) {
    console.log('>>>>> deleteFile error : ', error);
  }
};

/**
 * Storage에 Image를 업로드합니다.
 * @param file
 */
const uploadImage = async (file: File) => {
  console.log('###### 파일 : ', file);

  if (!file) return;

  try {
    return await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
      ID.unique(),
      file,
    );
  } catch (error) {
    console.log('>>>>> uploadImage error : ', error);
  }
};

export {
  client,
  account,
  databases,
  storage,
  ID,
  createDocument,
  deleteDocumentById,
  updateDocumentById,
  deleteFile,
  uploadImage,
};
