'use client';

import useBoardStore from '@/store/boardStore';
import { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default function Board() {
  const [board, getBoard] = useBoardStore((state) => [
    state.board,
    state.getBoard,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  return (
    <>
      <h1>Hello</h1>
      {/* <DragDropContext>
      <Droppable droppableId="board">
        {(provided) => (
          <div
            className="board"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext> */}
    </>
  );
}
