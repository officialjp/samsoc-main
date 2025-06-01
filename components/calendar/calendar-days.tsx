export function CalendarDays() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="grid grid-cols-7 mb-2">
      {days.map((day) => (
        <div
          key={day}
          className="text-center py-2 font-bold bg-about2 border-2 border-black mx-1"
        >
          <span className="hidden md:inline">{day}</span>
          <span className="md:hidden">{day.slice(0, 3)}</span>
        </div>
      ))}
    </div>
  );
}
