"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  color: string;
  isRegularSession?: boolean;
}

interface MobileCalendarViewProps {
  currentMonth: Date;
  selectedDate: Date;
  events: Event[];
  groupedEvents: Record<string, Event[]>;
  onDateClick: (day: Date) => void;
}

export function MobileCalendarView({
  currentMonth,
  selectedDate,
  events,
  groupedEvents,
  onDateClick,
}: MobileCalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Toggle expanded state for a date
  const toggleDateExpansion = (dateKey: string) => {
    if (expandedDate === dateKey) {
      setExpandedDate(null);
    } else {
      setExpandedDate(dateKey);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return groupedEvents[dateKey] || [];
  };

  // Check if a day has events
  const hasEvents = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return groupedEvents[dateKey] && groupedEvents[dateKey].length > 0;
  };

  return (
    <div className="mt-4">
      {/* Mini month view */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={`header-${i}`} className="text-center text-xs font-bold">
            {day}
          </div>
        ))}

        {daysInMonth.map((day, i) => {
          const formattedDate = format(day, "d");
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          const dayHasEvents = hasEvents(day);

          return (
            <div
              key={`day-${i}`}
              className={cn(
                "h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer mx-auto",
                isToday ? "bg-pink-500 text-white" : "",
                isSelected && !isToday ? "bg-yellow-300" : "",
                dayHasEvents && !isToday && !isSelected
                  ? "border-2 border-cyan-500"
                  : ""
              )}
              onClick={() => onDateClick(day)}
            >
              {formattedDate}
            </div>
          );
        })}
      </div>

      {/* Events list view */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg mb-3 border-b-2 border-black pb-1">
          Events This Month
        </h3>

        {Object.keys(groupedEvents).length > 0 ? (
          Object.keys(groupedEvents)
            .sort()
            .map((dateKey) => {
              const day = new Date(dateKey);
              const dayEvents = groupedEvents[dateKey];
              const isExpanded = expandedDate === dateKey;

              return (
                <div key={dateKey} className="border-2 border-black bg-white">
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 cursor-pointer",
                      isSameDay(day, new Date()) ? "bg-pink-100" : ""
                    )}
                    onClick={() => toggleDateExpansion(dateKey)}
                  >
                    <div>
                      <span className="font-bold">
                        {format(day, "EEEE, MMMM d")}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({dayEvents.length} event
                        {dayEvents.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="p-3 border-t border-gray-200 space-y-2">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "p-2 border border-gray-200 cursor-pointer",
                            event.color,
                            event.isRegularSession &&
                              "border-l-4 border-l-purple-500"
                          )}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs text-gray-500">
                            📍 {event.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
        ) : (
          <div className="text-center p-4 bg-gray-100 border-2 border-black">
            No events scheduled this month
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div className="bg-white border-4 border-black p-4 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(null);
              }}
              className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full p-1 border-2 border-black"
            >
              <X className="h-6 w-6" />
            </button>

            <div className={cn("h-2 w-full mb-4", selectedEvent.color)}></div>

            <h3 className="text-xl font-bold mb-2">
              {selectedEvent.title}
              {selectedEvent.isRegularSession && (
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-300">
                  Weekly Session
                </span>
              )}
            </h3>

            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">
                {format(selectedEvent.date, "EEEE, MMMM d, yyyy")}
              </div>
              <div className="text-sm font-medium">
                📍 {selectedEvent.location}
              </div>
            </div>

            <p className="text-gray-700">{selectedEvent.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
