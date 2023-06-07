import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';
import { PlusIcon } from '@heroicons/react/24/outline';
import useBoardStore from '@/store/boardStore';
import SkeletonLoader from './SkeletonLoader';
import { idToColumnText } from '@/utils/idToColumnText';
import { useModalStore } from '@/store/modalStore';

interface ColumnProps {
  id: TypedColumn;
  todos?: Todo[];
  index: number;
}

/**
 * DnD를 할 수 있는 Column 컴포넌트
 * @description Todo, InProgress, Done 컬럼을 렌더링한다. 칼럼들은 드래그앤드롭 할 수 있다.
 */
export default function Column({ id, todos, index }: ColumnProps) {
  const [isLoading, searchString] = useBoardStore((state) => [
    state.isLoading,
    state.searchString,
  ]);

  const openModal = useModalStore((state) => state.openModal);

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
                        ? todos?.length
                        : todos?.filter((todo) =>
                            todo.title
                              .toLowerCase()
                              .includes(searchString.toLowerCase()),
                          ).length}
                    </span>
                  </h2>
                </>

                {/* Item DnD 영역 */}
                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      {Array.from({ length: 3 - index }).map((_, index) => (
                        <SkeletonLoader key={index} />
                      ))}
                    </>
                  ) : todos && todos.length > 0 ? (
                    <>
                      {todos?.map((todo, index) => {
                        //? 검색어가 있을 경우
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
                    </>
                  ) : (
                    <>
                      <p className="py-5 text-center text-xl text-slate-400">
                        비어있어요.
                      </p>
                    </>
                  )}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button
                      title="추가"
                      onClick={openModal}
                      className="flex items-center rounded-lg border border-green-600 px-3 py-2 text-green-600 transition hover:bg-green-500 hover:text-white"
                    >
                      <PlusIcon className="mr-2 h-5 w-5" />
                      <p className="font-bold">추가</p>
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
