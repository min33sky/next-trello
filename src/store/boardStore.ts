import { databases } from '@/libs/appwrite';
import { getTodosGroupedByColumn } from '@/libs/getTodosGroupedByColumn';
import { create } from 'zustand';

interface BoardState {
  board: Board;
  getBoard: () => void; // DB에서 Board 정보를 가져와서 board state를 업데이트
  setBoardState: (board: Board) => void; // Client에서 Board 정보를 업데이트
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void; // DB에서 Todo 정보를 업데이트
}

const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      },
    );
  },
}));

export default useBoardStore;
