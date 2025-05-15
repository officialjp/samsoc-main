import { StaticImageData } from "next/image";

// Represents the type of an image in your event data
export type EventImageType = string | StaticImageData;

// Represents the structure of an event type
export interface EventType {
  title: string;
  description: string;
  frequency: string;
  image: EventImageType; // Use the shared type
  color: string;
  examples: string[];
}
