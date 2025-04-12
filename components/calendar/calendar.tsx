"use client";

import { useState } from "react";
import { addMonths, subMonths } from "date-fns";

import { CalendarHeader } from "./calendar-header";
import { CalendarDays } from "./calendar-days";
import { CalendarCells } from "./calendar-cells";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  color: string;
}

interface CalendarProps {
  events: Event[];
}

export function Calendar({ events }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const onCurrentMonth = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onCurrentMonth={onCurrentMonth}
      />
      <CalendarDays />
      <CalendarCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        events={events}
        onDateClick={onDateClick}
      />
    </div>
  );
}
