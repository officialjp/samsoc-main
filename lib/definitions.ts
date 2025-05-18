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

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  color: string;
  isRegularSession?: boolean;
}

interface Manga {
  id: string;
  title: string;
  author: string;
  volume: number;
  coverimage: string;
  genre: string[];
  borrowedby: string | null | undefined;
}

interface CommitteeMemberData {
  name: string;
  role: string;
  image: string;
  quote?: string;
  year: number;
}

interface CommitteeYearProps {
  year: string;
  members: CommitteeMemberData[];
  current?: boolean;
}

interface EventCardProps {
  id: number;
  date: string;
  title: string;
  description: string;
  location: string;
}

export type { CommitteeYearProps as TypeCommitteeYearProps };

export type { CommitteeMemberData as TypeCommitteeMemberData };

export type { Manga as MangaType };

export type { Event as CalendarEventType };

export type { EventCardProps as EventCardPropsType };
