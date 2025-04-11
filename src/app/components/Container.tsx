import type {FC} from 'react';
import {useDroppable} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

import SortableItem from './SortableItem';
import {ItemsType} from '../page';

const Container: FC<{
  days: string[];
  items: ItemsType[];
  id: string;
  onSelectItem: (item: any) => void;
}> = ({days, items, id, onSelectItem}) => {
  // This is needed for empty column to be droppable
  const {setNodeRef} = useDroppable({
    id: id,
  });

  return (
    <div
      key={id}
      className="flex flex-col rounded-lg bg-white m-2 shadow-md w-1/5"
    >
      <div
        about="day-header"
        className="flex w-full justify-between p-2 mb-1 rounded-t-3xl items-center mt-2 border-b-2 border-gray-200"
      >
        <span className="flex font-bold text-lg">{id}</span>
        <span className="text-center min-w-14 bg-gray-200 rounded-2xl">
          {items?.find((item) => item.day === id)?.date}
        </span>
      </div>
      {items
        ?.find((item) => item.day == id)
        ?.items?.map((item) => (
          <div key={item.title} className="flex flex-col">
            <SortableContext
              items={days}
              strategy={verticalListSortingStrategy}
              id={id}
            >
              <div ref={setNodeRef}>
                <SortableItem key={id} item={item} onSelect={onSelectItem} />
              </div>
            </SortableContext>
          </div>
        ))}
    </div>
  );
};

export default Container;
