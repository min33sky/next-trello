import { databases } from './appwrite';

export async function getTodosGroupedByColumn() {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    process.env.NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID,
  );

  const todos = data.documents;

  console.log('todos -> ', todos);

  const columns = todos.reduce((acc, todo) => {
    const column = todo.status;

    if (!acc.has(column)) {
      acc.set(column, {
        id: column,
        todos: [],
      });
    }

    acc.get(column)?.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  //? 모든 컬럼이 존재하는지 확인하고 없으면 추가한다.
  const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done'];

  for (const columnType of columnTypes) {
    if (!columns.has(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  console.log('columns -> ', columns);

  // sort columns by columnTypes
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort((a, b) => {
      return columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]);
    }),
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
}
