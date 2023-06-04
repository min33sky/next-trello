'use client';

import useBoardStore from '@/store/boardStore';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

export default function Board() {
  const [board, getBoard, setBoardState] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
  ]);

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

      console.log('columns: ', columns);
      console.log('startColIndex: ', startColIndex);
      console.log('finishColIndex: ', finishColIndex);

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
    }
  };

  return (
    <div ref={elementRef}>
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
              {Array.from(board.columns.entries()).map(
                ([id, column], index) => (
                  <Column key={id} id={id} todos={column.todos} index={index} />
                ),
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
