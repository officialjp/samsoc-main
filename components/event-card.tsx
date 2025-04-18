import { Button } from "@/components/ui/button"

interface EventCardProps {
  date: string
  title: string
  description: string
  location: string
}

export function EventCard({ date, title, description, location }: EventCardProps) {
  return (
    <div className="flex flex-col space-y-2 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-yellow-300 px-3 py-1 text-sm font-bold inline-block border-2 border-black self-start">
        {date}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-gray-700">{description}</p>
      <p className="text-sm text-gray-500">📍 {location}</p>
      <Button variant="outline" className="mt-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        Add to Calendar
      </Button>
    </div>
  )
}
