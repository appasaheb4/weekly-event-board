'use client';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useState} from 'react';

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

export default function Home() {
  // get day wise date using js

  const [items, setItems] = useState([
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

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
  };
  return (
    <div className="flex flex-col p-12 mx-40">
      <span className="font-bold text-3xl">Weekly Event Board</span>
      <span className="text-gray-600">
        Manage and organize your weekly schedule with ease.
      </span>
      <div className="flex w-full justify-between">
        {weeklyDays.map((day) => (
          <div
            key={day}
            className="flex flex-col rounded-lg bg-white m-2 shadow-md w-1/5"
          >
            <div
              about="day-header"
              className="flex w-full justify-between p-2 mb-1 rounded-t-3xl items-center mt-2 border-b-2 border-gray-200"
            >
              <span className="flex font-bold text-lg">{day}</span>
              <span className="text-center min-w-14 bg-gray-200 rounded-2xl">
                {items.find((item) => item.day === day)?.date}
              </span>
            </div>
            {items
              .find((item) => item.day === day)
              ?.items.map((event, index) => (
                <div key={index} className="flex flex-col p-2 bg-gray-50">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <div className="p-4">
                      <div className="font-semibold text-gray-800">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-map-pin w-3 h-3 mr-1"
                        >
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {event.location}
                      </div>
                      <div className="mt-3 text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="events">
          {(provided) => (
            <ul
              className="mt-6 space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item: any, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <li
                      className="p-4 bg-white border rounded shadow"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
