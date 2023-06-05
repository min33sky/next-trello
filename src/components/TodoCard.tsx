import useBoardStore from '@/store/boardStore';
import { XCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';

interface TodoCardProps {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

export default function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: TodoCardProps) {
  const deleteTask = useBoardStore((state) => state.deleteTask);

  return (
    <div
      className="space-y-2 rounded-md bg-white drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex items-center justify-between p-5">
        <p className="font-nanumPenScript">{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          title="제거"
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {/* TODO: Add image here */}
    </div>
  );
}
