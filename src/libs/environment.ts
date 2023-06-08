import { z } from 'zod';

const environmentSchema = z.object({
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string(),
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: z.string(),
  NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID: z.string(),
  NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID: z.string(),
  OPENAI_API_KEY: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof environmentSchema> {}
  }
}
