import {
  ID,
  databases,
  deleteDocumentById,
  deleteFile,
  storage,
  updateDocumentById,
  uploadImage,
} from '@/libs/appwrite';
import { getTodosGroupedByColumn } from '@/libs/getTodosGroupedByColumn';
import { create } from 'zustand';

interface BoardState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  board: Board;
  getBoard: () => void; // DB에서 Board 정보를 가져와서 board state를 업데이트
  setBoardState: (board: Board) => void; // Client에서 Board 정보를 업데이트

  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void; // DB에서 Todo 정보를 업데이트

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void; // DB에서 Todo 정보를 추가
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void; // DB에서 Todo 정보를 삭제

  searchString: string; // 검색어
  setSearchString: (searchString: string) => void; // 검색어 업데이트 함수

  newTaskInput: string; // 새로운 Task 내용
  setNewTaskInput: (newTaskInput: string) => void; // 새로운 Task 내용 업데이트 함수

  newTaskType: TypedColumn; // 새로운 Task의 Column
  setNewTaskType: (columnId: TypedColumn) => void; // 새로운 Task의 Column 업데이트 함수

  image: File | null;
  setImage: (image: File | null) => void;
}

const useBoardStore = create<BoardState>((set, get) => ({
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),

  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    get().setIsLoading(true);
    const board = await getTodosGroupedByColumn();
    set({ board });
    get().setIsLoading(false);
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

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          fileId: fileUploaded.$id,
          bucketId: fileUploaded.bucketId,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // include image if it exists
        ...(file && { image: JSON.stringify(file) }),
      },
    );

    set({ newTaskInput: '' });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        title: todo,
        status: columnId,
        $createdAt: new Date().toISOString(),
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
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

    //* DB에서 Todo 정보를 삭제

    if (todo.image) {
      // await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
      await deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await deleteDocumentById(todo.$id);
  },

  searchString: '',
  setSearchString: (searchString) => set({ searchString }),

  newTaskInput: '',
  setNewTaskInput: (newTaskInput) => set({ newTaskInput }),

  newTaskType: 'todo',
  setNewTaskType: (newTaskType) => set({ newTaskType }),

  image: null,
  setImage: (image) => set({ image }),
}));

export default useBoardStore;
