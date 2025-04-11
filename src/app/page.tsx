'use client';
import './styles/index.scss';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  CollisionDetection,
} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';

import Container from './components/Container';
import Item from './components/SortableItem';
import {
  ModalEventDetails,
  ModalEventDetailsProps,
} from './components/ModalEventDetails.component';

const weeklyDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const getDate = (dayName: string) => {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay(); // Current day's index (0 for Sunday, etc.)
  const requestedDayIndex = daysOfWeek.indexOf(dayName);

  if (requestedDayIndex === -1) {
    return 'Invalid day name!';
  }

  const difference = requestedDayIndex - currentDayIndex;
  const targetDate = new Date(currentDate);
  targetDate.setDate(currentDate.getDate() + difference);

  const dateSuffix = (date: number): string => {
    if ([1, 21, 31].includes(date)) return 'st';
    if ([2, 22].includes(date)) return 'nd';
    if ([3, 23].includes(date)) return 'rd';
    return 'th';
  };

  // Check if the requested day matches today's day
  if (difference === 0) {
    return 'Today';
  }

  // If not today, return the formatted date
  return targetDate.getDate() + dateSuffix(targetDate.getDate());
};

export interface ItemType {
  title: string;
  location: string;
  description: string;
}

export interface ItemsType {
  day: string;
  date: string;
  items: ItemType[];
}

export default function Home() {
  const [items, setItems] = useState<ItemsType[]>([
    {
      day: 'Monday',
      date: getDate('Monday'),
      items: [
        {
          title: 'Project Review',
          location: 'Main Boardroom',
          description:
            'Review the current status of the Q3 project with stakeholders',
        },
        {
          title: 'Lunch with Client',
          location: 'Downtown Cafe',
          description: 'Discuss project updates and feedback',
        },
        {
          title: 'Feedback Session',
          location: 'Zoom',
          description:
            'Gather feedback from the team on the current project and processes',
        },
        {
          title: 'Client Follow-up',
          location: 'Email',
          description:
            'Follow up with the client on any outstanding issues or questions',
        },
      ],
    },
    {
      day: 'Tuesday',
      date: getDate('Tuesday'),
      items: [
        {
          title: 'Team Standup',
          location: 'Zoom',
          description: 'Daily standup meeting with the team',
        },
        {
          title: 'Code Review',
          location: 'GitHub',
          description: 'Review the latest pull requests from the team',
        },
        {
          title: 'Design Sprint',
          location: 'Design Studio',
          description: 'Collaborate with the design team on new features',
        },
      ],
    },
    {
      day: 'Wednesday',
      date: getDate('Wednesday'),
      items: [
        {
          title: 'Client Call',
          location: 'Google Meet',
          description: 'Weekly call with the client to discuss project updates',
        },
        {
          title: 'Team Lunch',
          location: 'Italian Bistro',
          description: 'Casual lunch with the team to celebrate milestones',
        },
        {
          title: 'Project Planning',
          location: 'Main Boardroom',
          description: 'Plan the next steps for the project and assign tasks',
        },
        {
          title: 'Weekly Report',
          location: 'Zoom',
          description:
            'Prepare and send the weekly report to stakeholders and management',
        },
      ],
    },
    {
      day: 'Thursday',
      date: getDate('Thursday'),
      items: [
        {
          title: 'Design Review',
          location: 'Main Boardroom',
          description: 'Review the design mockups with the design team',
        },
      ],
    },
    {
      day: 'Friday',
      date: getDate('Friday'),
      items: [
        {
          title: 'Sprint Retrospective',
          location: 'Zoom',
          description:
            'Discuss what went well and what can be improved in the next sprint',
        },
        {
          title: 'Team Outing',
          location: 'Bowling Alley',
          description: 'Fun outing with the team to unwind after a busy week',
        },
        {
          title: 'Weekly Wrap-up',
          location: 'Main Boardroom',
          description:
            'Wrap up the week and discuss the plan for the next week',
        },
      ],
    },
  ]);
  const [modalEventDetails, setModalEventDetails] = useState<
    Partial<ModalEventDetailsProps>
  >({});
  // Use the defined sensors for drag and drop operation
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        // Require mouse to move 5px to start dragging, this allow onClick to be triggered on click
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // Require mouse to move 5px to start dragging, this allow onClick to be triggered on click
        tolerance: 5,
        // Require to press for 100ms to start dragging, this can reduce the chance of dragging accidentally due to page scroll
        delay: 100,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // State to keep track of currently active (being dragged) item
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeItem, setActiveItem] = useState<ItemType | null>(null);

  // Ref to store the ID of the last container that was hovered over during a drag
  const lastOverId = useRef<UniqueIdentifier | null>(null);

  // Ref to track if an item was just moved to a new container
  const recentlyMovedToNewContainer = useRef(false);

  // Function to find which container an item belongs to
  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      // if the id is a container id itself
      if (id in items) return id;

      // find the container by looking into each of them
      return items.find((item) =>
        item.items.some((event) => event.title === id)
      )?.day;
    },
    [items]
  );

  // Ref to store the state of items before a drag operation begins
  const itemsBeforeDrag = useRef<any>(null);

  const handleDragStart = useCallback(
    ({active}: DragStartEvent) => {
      console.log({active});
      // Store the current state of items
      itemsBeforeDrag.current = {...items};
      // Set the active (dragged) item id
      setActiveId(active.id);
      setActiveItem(active.data.current as ItemType);
    },
    [items]
  );

  // Function called when an item is dragged over another container
  const handleDragOver = useCallback(
    ({active, over}: DragOverEvent) => {
      if (!over || active.id in items) {
        return;
      }
      const {id: activeId} = active;
      const {id: overId} = over;
      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);
      if (!overContainer || !activeContainer) {
        return;
      }
      if (activeContainer !== overContainer) {
        const activeItems =
          items.find((item) => item.day === activeContainer)?.items || [];
        const overItems =
          items.find((item) => item.day === overContainer)?.items || [];
        const overIndex = overItems.findIndex((item) => item.title === overId);
        const activeIndex = activeItems.findIndex(
          (item) => item.title === activeId
        );
        let newIndex: number;
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

        const result: any = [
          ...items.map((container) => {
            if (container.day === activeContainer) {
              return {
                ...container,
                items: container.items.filter(
                  (item) => item.title !== active.id
                ),
              };
            }
            if (container.day === overContainer) {
              return {
                ...container,
                items: [
                  ...container.items.slice(0, newIndex),
                  items.find((c) => c.day === activeContainer)?.items[
                    activeIndex
                  ],
                  ...container.items.slice(newIndex),
                ],
              };
            }
            return container;
          }),
        ];
        setItems(result);
      }
    },
    [items, findContainer]
  );

  // Function called when a drag operation ends
  const handleDragEnd = useCallback(
    ({active, over}: DragEndEvent) => {
      const activeContainer = findContainer(active.id);
      if (!over || !activeContainer) {
        setActiveId(null);
        return;
      }
      const {id: activeId} = active;
      const {id: overId} = over;
      const overContainer = findContainer(overId);
      if (!overContainer) {
        setActiveId(null);
        return;
      }
      const activeContainerItems =
        items.find((item) => item.day === activeContainer)?.items || [];
      const activeIndex = activeContainerItems.findIndex(
        (event) => event.title === activeId
      );
      const overIndex =
        items
          .find((item) => item.day === overContainer)
          ?.items.findIndex((event) => event.title === overId) ?? -1;

      if (activeIndex !== overIndex) {
        const newItem = arrayMove(
          items.find((item) => item.day === overContainer)?.items || [],
          activeIndex,
          overIndex
        );
        console.log({newItem});
        setItems((prevItems) =>
          prevItems.map((item) => {
            if (item.day === overContainer) {
              return {...item, items: newItem};
            }
            return item;
          })
        );
      }
      setActiveId(null);
    },
    [items, findContainer]
  );

  // Function called when a drag operation is cancelled
  const onDragCancel = useCallback(() => {
    setItems(itemsBeforeDrag.current ?? []);
    itemsBeforeDrag.current = null;
    setActiveId(null);
  }, []);

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in items) {
          const containerItems =
            items.find((item) => item.day === overId)?.items || [];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.some((item) => item.title === container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{id: overId}];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{id: lastOverId.current}] : [];
    },
    [activeId, items]
  );

  // useEffect hook called after a drag operation, to clear the "just moved" status
  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <div className="flex flex-col p-12 mx-40">
      <span className="font-bold text-3xl">Weekly Event Board</span>
      <span className="text-gray-600">
        Manage and organize your weekly schedule with ease.
      </span>

      <div className="flex w-full justify-between">
        <DndContext
          sensors={sensors}
          // collisionDetection={closestCenter}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={onDragCancel}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          {weeklyDays?.map((day, index) => (
            <Container
              key={index}
              id={day}
              days={weeklyDays}
              items={items}
              onSelectItem={(item) => {
                setModalEventDetails({
                  details: item,
                  visible: true,
                });
              }}
            />
          ))}
          <DragOverlay>
            {activeId ? <Item item={activeItem as ItemType} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
      <ModalEventDetails
        {...modalEventDetails}
        onClose={() => {
          setModalEventDetails({visible: false});
        }}
        onClick={(item) => {
          setModalEventDetails({visible: false});
        }}
      />
    </div>
  );
}
