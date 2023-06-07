import useBoardStore from '@/store/boardStore';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

const types = [
  {
    id: 'todo',
    name: '할 일',
    color: 'bg-red-500',
    description: '해야 할 일',
  },
  {
    id: 'inprogress',
    name: '진행 중',
    color: 'bg-yellow-500',
    description: '하고 있는 중',
  },
  {
    id: 'done',
    name: '완료',
    color: 'bg-green-500',
    description: '완료한 일',
  },
];

export default function TaskTypeRadioGroup() {
  const [newTaskType, setNewTaskType] = useBoardStore((state) => [
    state.newTaskType,
    state.setNewTaskType,
  ]);

  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={newTaskType} onChange={(e) => setNewTaskType(e)}>
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ checked, active }) => `
                    ${
                      active
                        ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                        : ''
                    }
                    ${
                      checked
                        ? `${type.color} bg-opacity-75 text-white`
                        : 'bg-white'
                    }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
                  `}
              >
                {({ checked, active }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as={'p'}
                            className={`font-medium ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as={'span'}
                            className={`inline ${
                              checked ? 'text-white' : 'text-gray-500'
                            }`}
                          >
                            <span>{type.description}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div>
                          <CheckCircleIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
