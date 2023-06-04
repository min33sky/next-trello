'use client';

import useBoardStore from '@/store/boardStore';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

export default function Board() {
  const [board, getBoard] = useBoardStore((state) => [
    state.board,
    state.getBoard,
  ]);

  const [isMobileView, setIsMobileView] = useState(true);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      console.log('resize: ', width, height);
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

  const handleDragEnd = (result: DropResult) => {
    console.log('handleDragEnd: ', result, 'TODO: update board');
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
