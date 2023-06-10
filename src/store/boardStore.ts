import {
  ID,
  createDocument,
  databases,
  deleteDocumentById,
  deleteFile,
  storage,
  updateDocumentById,
  uploadImage,
} from '@/libs/appwrite';
import { getTodosGroupedByColumn } from '@/libs/getTodosGroupedByColumn';
import { toast } from 'react-hot-toast';
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
    const loader = toast.loading('Loading...');
    await updateDocumentById(todo.$id, {
      title: todo.title,
      status: columnId,
    });
    toast.success('Loaded!', { id: loader });
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;
    let loadingToastId: string | undefined;

    loadingToastId = toast.loading('등록중.....');

    //* 이미지가 존재하면 이미지를 먼저 업로드하고 파일 정보를 가져온다.
    if (image) {
      const fileUploaded = await uploadImage(image);

      if (fileUploaded) {
        file = {
          fileId: fileUploaded.$id,
          bucketId: fileUploaded.bucketId,
        };
      }
    }

    //* DB에 새 작업을 추가한다.
    const { $id } = await createDocument({
      title: todo,
      status: columnId,
      //? 이미지 정보는 { fileId: string, bucketId: string } 형태로 저장되므로
      //? JSON.stringify()를 통해 문자열로 변환하여 저장한다.
      ...(file && { image: JSON.stringify(file) }),
    });

    //* 인풋 초기화
    set({ newTaskInput: '' });

    //* 추가한 Task를 전역 상태에 반영한다.
    set((state) => {
      const updateColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        title: todo,
        status: columnId,
        $createdAt: new Date().toISOString(),
        ...(file && { image: file }),
      };

      const column = updateColumns.get(columnId);

      if (!column) {
        updateColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        updateColumns.get(columnId)?.todos.push(newTodo);
      }

      toast.success('작업 추가 완료!', { id: loadingToastId });

      return {
        board: {
          columns: updateColumns,
        },
      };
    });
  },

  deleteTask: async (taskIndex, todo, id) => {
    let loadingToastId: string | undefined;

    loadingToastId = toast.loading('삭제중.....');

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

    toast.success('삭제 완료!', { id: loadingToastId });
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
