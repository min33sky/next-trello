import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';
import { PlusCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import useBoardStore from '@/store/boardStore';

interface ColumnProps {
  id: TypedColumn;
  todos: Todo[];
  index: number;
}

enum idToColumnText {
  'todo' = '할 일',
  'inprogress' = '진행 중',
  'done' = '완료',
}

/**
 * DnD를 할 수 있는 Column 컴포넌트
 * @description Todo, InProgress, Done 컬럼을 렌더링한다. 칼럼들은 드래그앤드롭 할 수 있다.
 */
export default function Column({ id, todos, index }: ColumnProps) {
  const searchString = useBoardStore((state) => state.searchString);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Column 내부에서도 아이템들을 드래그 앤 드롭을 할 수 있어야 한다. */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                className={`rounded-2xl p-2 shadow-xl ${
                  snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/40'
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <>
                  <h2 className="flex justify-between p-2 text-xl font-bold">
                    {idToColumnText[id]}

                    <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-normal text-gray-500">
                      {!searchString
                        ? todos.length
                        : todos.filter((todo) =>
                            todo.title
                              .toLowerCase()
                              .includes(searchString.toLowerCase()),
                          ).length}
                    </span>
                  </h2>
                </>

                {/* Item DnD 영역 */}
                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    ) {
                      return null;
                    }

                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button
                      title="추가"
                      className="flex items-center rounded-lg border border-green-500 px-3 py-2 text-green-500 transition hover:bg-green-500 hover:text-white"
                    >
                      <PlusIcon className="mr-2 h-5 w-5" />
                      <p className="">작성</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
