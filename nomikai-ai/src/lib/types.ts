export type Mood = "casual" | "lively" | "quiet" | "celebration";

export interface DateOption {
  date: string;
  timeSlot: string;
}

export interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

export interface User {
  id: number;
  email: string;
  display_name: string;
  created_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  organizer_name: string;
  organizer_user_id: number | null;
  budget: number;
  mood: Mood;
  date_options: DateOption[];
  edit_token: string;
  expires_at: string;
  created_at: string;
}

export interface Participant {
  id: number;
  event_id: string;
  name: string;
  station: string;
  availability: AvailabilitySlot[];
  participant_token: string;
  created_at: string;
}

export type ContentSource = "llm" | "anthropic" | "template";
export type VenueSource = "places" | "template";

export interface VenueCandidate {
  name: string;
  type: string;
  budgetLabel: string;
  moodLabel: string;
  description: string;
  mapsUrl: string;
  lat?: number;
  lng?: number;
  rating?: number;
  address?: string;
  source?: VenueSource;
}

export interface PlanMeta {
  venues_source: VenueSource;
  boost_source: ContentSource;
}

export interface MiddlePoint {
  station: string;
  lat: number;
  lng: number;
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
  middle_lat?: number;
  middle_lng?: number;
  venues: VenueCandidate[];
  boost_content: BoostContent;
  meta?: PlanMeta;
  generated_at: string;
}

export interface CreateEventInput {
  title: string;
  organizer_name: string;
  budget: number;
  mood: Mood;
  date_options: DateOption[];
  organizer_user_id?: number | null;
}

export interface JoinEventInput {
  name: string;
  station: string;
  availability: AvailabilitySlot[];
}

export interface UpdateParticipantInput {
  name: string;
  station: string;
  availability: AvailabilitySlot[];
}

export interface EventDetail {
  event: Event;
  participants: Participant[];
  plan: Plan | null;
  expired: boolean;
}

export interface UserEventSummary {
  event: Event;
  participant_count: number;
  has_plan: boolean;
  expired: boolean;
}
