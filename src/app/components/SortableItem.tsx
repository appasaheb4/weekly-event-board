import type {FC} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import classnames from 'classnames';
import {ItemType} from '../page';

export const Item: FC<{
  item: ItemType;
  isDragging?: boolean;
  isOverlay?: boolean;
}> = ({item, isDragging = false, isOverlay = false}) => {
  return (
    <div
      className={classnames('sortable-item', {
        'sortable-item--is-overlay': isOverlay,
        'sortable-item--is-dragging': isDragging, // Apply dragging styling if isDragging prop is true
      })}
    >
      <div className="flex flex-col p-2 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="p-4">
            <div className="font-semibold text-gray-800">{item.title}</div>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              {item.location}
            </div>
            <div className="mt-3 text-sm text-gray-600 line-clamp-2">
              {item.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SortableItem: FC<{item: ItemType}> = ({item}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({id: item.title, data: item});
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item item={item} isDragging={isDragging} />
    </div>
  );
};

export default SortableItem;
