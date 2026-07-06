export type Mood = "casual" | "lively" | "quiet" | "celebration";

export interface DateOption {
  date: string;
  timeSlot: string;
}

export interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  organizer_name: string;
  budget: number;
  mood: Mood;
  date_options: DateOption[];
  edit_token: string;
  created_at: string;
}

export interface Participant {
  id: number;
  event_id: string;
  name: string;
  station: string;
  availability: AvailabilitySlot[];
  created_at: string;
}

export interface VenueCandidate {
  name: string;
  type: string;
  budgetLabel: string;
  moodLabel: string;
  description: string;
  mapsUrl: string;
}

export interface BoostContent {
  recommendedSlot: {
    date: string;
    timeSlot: string;
    participantCount: number;
    totalCount: number;
    label: string;
  } | null;
  toasts: string[];
  games: string[];
  conversationStarters: string[];
  afterParty: string;
}

export interface Plan {
  event_id: string;
  middle_station: string;
  venues: VenueCandidate[];
  boost_content: BoostContent;
  generated_at: string;
}

export interface CreateEventInput {
  title: string;
  organizer_name: string;
  budget: number;
  mood: Mood;
  date_options: DateOption[];
}

export interface JoinEventInput {
  name: string;
  station: string;
  availability: AvailabilitySlot[];
}

export interface EventDetail {
  event: Event;
  participants: Participant[];
  plan: Plan | null;
}
