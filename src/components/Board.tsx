'use client';

import useBoardStore from '@/store/boardStore';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

export default function Board() {
  /**
   * TODO: 컬럼 위치 변경 시, DB에 반영하기 (column order collection 만들기)
   * TODO: 카드 위치 변경 시, DB에 반영하기 (Document에 order 필드 추가하기 - 배열을 사용할까??)
   * ? 전체 Document를 해시테이블에 저장하고 배열에 순서를 저장하고 순회하면서 검색하는 방법?
   * TODO: Column을 미리 랜더링하고 스켈레톤 로딩을 렌더링한다.
   */

  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ],
  );

  console.log('board: ', board);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  /**
   * @description 화면 크기에 따라 Column을 세로로 또는 가로로 렌더링한다.
   */
  const [isMobileView, setIsMobileView] = useState(true);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const width = element.clientWidth;
      const height = element.clientHeight;

      if (width < 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  /**
   * @description Column을 드래그앤드롭 했을 때, Board의 상태를 업데이트한다.
   */
  const handleDragEnd = (result: DropResult) => {
    const { type, destination, source } = result;

    // 유저가 보드 밖으로 드래그를 했는지 체크
    if (!destination) return;

    // Column을 드래그앤드롭 했을 때
    if (type === 'column') {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);

      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    } else if (type === 'card') {
      // This step is need as the indexes are stored as numbers 0,1,2 etc. instead of id's with DND Library
      console.log('DnD Result: ', result);
      const columns = Array.from(board.columns);
      const startColIndex = columns[Number(source.droppableId)];
      const finishColIndex = columns[Number(destination.droppableId)];

      const startCol: Column = {
        id: startColIndex[0],
        todos: startColIndex[1].todos,
      };

      const finishCol: Column = {
        id: finishColIndex[0],
        todos: finishColIndex[1].todos,
      };

      console.log('startCol: ', startCol);
      console.log('finishCol: ', finishCol);

      if (!startCol || !finishCol) return;

      // 같은 위치로 드래그앤드롭 했을 때
      if (source.index === destination.index && startCol === finishCol) return;

      // 이동할 Todo를 기존 Column에서 제거
      const updateTodos = startCol.todos;
      const [todoMoved] = updateTodos.splice(source.index, 1);

      if (startCol.id === finishCol.id) {
        // 같은 Column 내에서 Todo를 이동했을 때
        updateTodos.splice(destination.index, 0, todoMoved);

        const updatedColumns = new Map(board.columns);

        updatedColumns.set(startCol.id, {
          id: startCol.id,
          todos: updateTodos,
        });

        // update in DB
        updateTodoInDB(todoMoved, finishCol.id);

        setBoardState({
          ...board,
          columns: updatedColumns,
        });
      } else {
        // dragging task to another column
        const finishTodos = Array.from(finishCol.todos);
        finishTodos.splice(destination.index, 0, todoMoved);

        const updatedColumns = new Map(board.columns);

        updatedColumns.set(startCol.id, {
          id: startCol.id,
          todos: updateTodos,
        });

        updatedColumns.set(finishCol.id, {
          id: finishCol.id,
          todos: finishTodos,
        });

        // Update in DB
        updateTodoInDB(todoMoved, finishCol.id);

        setBoardState({
          ...board,
          columns: updatedColumns,
        });
      }
    }
  };

  return (
    <div ref={elementRef} className="px-2 py-10 md:px-0">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="board"
          direction={isMobileView ? 'vertical' : 'horizontal'}
          type="column"
        >
          {(provided) => (
            <div
              className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {board.columns.size === 0 ? (
                //? Column이 없을 때 슼켈레톤 로딩을 렌더링한다.
                <>
                  {['todo', 'inprogress', 'done'].map((title, index) => (
                    <Column
                      key={index}
                      id={title as TypedColumn}
                      index={index}
                    />
                  ))}
                </>
              ) : (
                <>
                  {Array.from(board.columns.entries()).map(
                    ([id, column], index) => (
                      <Column
                        key={id}
                        id={id}
                        todos={column.todos}
                        index={index}
                      />
                    ),
                  )}
                </>
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
