import {
  databases,
  deleteDocumentById,
  deleteFile,
  storage,
  updateDocumentById,
} from '@/libs/appwrite';
import { getTodosGroupedByColumn } from '@/libs/getTodosGroupedByColumn';
import { create } from 'zustand';

interface BoardState {
  board: Board;
  getBoard: () => void; // DB에서 Board 정보를 가져와서 board state를 업데이트
  setBoardState: (board: Board) => void; // Client에서 Board 정보를 업데이트

  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void; // DB에서 Todo 정보를 업데이트
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void; // DB에서 Todo 정보를 삭제

  searchString: string; // 검색어
  setSearchString: (searchString: string) => void; // 검색어 업데이트 함수
}

const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    // await databases.updateDocument(
    //   process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    //   process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID,
    //   todo.$id,
    //   {
    //     title: todo.title,
    //     status: columnId,
    //   },
    // );

    await updateDocumentById(todo.$id, {
      title: todo.title,
      status: columnId,
    });
  },

  deleteTask: async (taskIndex, todo, id) => {
    const updatedColumns = new Map(get().board.columns);

    // delete todoId from updatedColumns
    updatedColumns.get(id)?.todos.splice(taskIndex, 1);

    set({
      board: {
        columns: updatedColumns,
      },
    });

    //* delete todo from DB
    if (todo.image) {
      // await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
      await deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await deleteDocumentById(todo.$id);
  },

  searchString: '',

  setSearchString: (searchString) => set({ searchString }),
}));

export default useBoardStore;
