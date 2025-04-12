"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
}

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onCurrentMonth,
}: CalendarHeaderProps) {
  const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        <Button
          onClick={onPrevMonth}
          variant="outline"
          className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={onNextMonth}
          variant="outline"
          className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <h2 className="text-2xl font-bold bg-yellow-300 px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1">
        {dateFormat.format(currentMonth)}
      </h2>

      <Button
        onClick={onCurrentMonth}
        className="bg-pink-300 hover:bg-pink-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        Today
      </Button>
    </div>
  );
}
