import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { generateEditToken, generateEventId, generateSlug } from "./id";
import type {
  CreateEventInput,
  Event,
  EventDetail,
  JoinEventInput,
  Participant,
  Plan,
  PlanMeta,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "nomikai.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function columnExists(database: Database.Database, table: string, column: string) {
  const columns = database
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];
  return columns.some((c) => c.name === column);
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      organizer_name TEXT NOT NULL,
      budget INTEGER NOT NULL,
      mood TEXT NOT NULL,
      date_options_json TEXT NOT NULL DEFAULT '[]',
      edit_token TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      station TEXT NOT NULL,
      availability_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS plans (
      event_id TEXT PRIMARY KEY,
      middle_station TEXT NOT NULL,
      venues_json TEXT NOT NULL,
      boost_content_json TEXT NOT NULL,
      generated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_participants_event ON participants(event_id);
    CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
  `);

  if (!columnExists(database, "plans", "middle_lat")) {
    database.exec("ALTER TABLE plans ADD COLUMN middle_lat REAL");
  }
  if (!columnExists(database, "plans", "middle_lng")) {
    database.exec("ALTER TABLE plans ADD COLUMN middle_lng REAL");
  }
  if (!columnExists(database, "plans", "meta_json")) {
    database.exec("ALTER TABLE plans ADD COLUMN meta_json TEXT");
  }
}

function parseEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    organizer_name: row.organizer_name as string,
    budget: row.budget as number,
    mood: row.mood as Event["mood"],
    date_options: JSON.parse(row.date_options_json as string),
    edit_token: row.edit_token as string,
    created_at: row.created_at as string,
  };
}

function parseParticipant(row: Record<string, unknown>): Participant {
  return {
    id: row.id as number,
    event_id: row.event_id as string,
    name: row.name as string,
    station: row.station as string,
    availability: JSON.parse(row.availability_json as string),
    created_at: row.created_at as string,
  };
}

function parsePlan(row: Record<string, unknown>): Plan {
  const metaRaw = row.meta_json as string | null | undefined;
  return {
    event_id: row.event_id as string,
    middle_station: row.middle_station as string,
    middle_lat: row.middle_lat as number | undefined,
    middle_lng: row.middle_lng as number | undefined,
    venues: JSON.parse(row.venues_json as string),
    boost_content: JSON.parse(row.boost_content_json as string),
    meta: metaRaw ? (JSON.parse(metaRaw) as PlanMeta) : undefined,
    generated_at: row.generated_at as string,
  };
}

export function createEvent(input: CreateEventInput): Event {
  const database = getDb();
  const id = generateEventId();
  const slug = generateSlug();
  const edit_token = generateEditToken();

  database
    .prepare(
      `INSERT INTO events (id, slug, title, organizer_name, budget, mood, date_options_json, edit_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      slug,
      input.title.trim(),
      input.organizer_name.trim(),
      input.budget,
      input.mood,
      JSON.stringify(input.date_options),
      edit_token
    );

  return getEventBySlug(slug)!;
}

export function getEventBySlug(slug: string): Event | null {
  const row = getDb()
    .prepare("SELECT * FROM events WHERE slug = ?")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? parseEvent(row) : null;
}

export function getParticipantsByEventId(eventId: string): Participant[] {
  const rows = getDb()
    .prepare("SELECT * FROM participants WHERE event_id = ? ORDER BY created_at ASC")
    .all(eventId) as Record<string, unknown>[];
  return rows.map(parseParticipant);
}

export function getPlanByEventId(eventId: string): Plan | null {
  const row = getDb()
    .prepare("SELECT * FROM plans WHERE event_id = ?")
    .get(eventId) as Record<string, unknown> | undefined;
  return row ? parsePlan(row) : null;
}

export function getEventDetail(slug: string): EventDetail | null {
  const event = getEventBySlug(slug);
  if (!event) return null;
  return {
    event,
    participants: getParticipantsByEventId(event.id),
    plan: getPlanByEventId(event.id),
  };
}

export function addParticipant(slug: string, input: JoinEventInput): Participant | null {
  const event = getEventBySlug(slug);
  if (!event) return null;

  const duplicate = getDb()
    .prepare(
      "SELECT id FROM participants WHERE event_id = ? AND lower(name) = lower(?) AND lower(station) = lower(?)"
    )
    .get(event.id, input.name.trim(), input.station.trim());
  if (duplicate) return null;

  const result = getDb()
    .prepare(
      `INSERT INTO participants (event_id, name, station, availability_json)
       VALUES (?, ?, ?, ?)`
    )
    .run(
      event.id,
      input.name.trim(),
      input.station.trim(),
      JSON.stringify(input.availability)
    );

  const row = getDb()
    .prepare("SELECT * FROM participants WHERE id = ?")
    .get(result.lastInsertRowid) as Record<string, unknown>;
  return parseParticipant(row);
}

export function savePlan(
  eventId: string,
  middleStation: string,
  middleLat: number | undefined,
  middleLng: number | undefined,
  venues: Plan["venues"],
  boostContent: Plan["boost_content"],
  meta?: PlanMeta
): Plan {
  const database = getDb();
  database
    .prepare(
      `INSERT INTO plans (event_id, middle_station, middle_lat, middle_lng, venues_json, boost_content_json, meta_json, generated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
       ON CONFLICT(event_id) DO UPDATE SET
         middle_station = excluded.middle_station,
         middle_lat = excluded.middle_lat,
         middle_lng = excluded.middle_lng,
         venues_json = excluded.venues_json,
         boost_content_json = excluded.boost_content_json,
         meta_json = excluded.meta_json,
         generated_at = datetime('now', 'localtime')`
    )
    .run(
      eventId,
      middleStation,
      middleLat ?? null,
      middleLng ?? null,
      JSON.stringify(venues),
      JSON.stringify(boostContent),
      meta ? JSON.stringify(meta) : null
    );

  return getPlanByEventId(eventId)!;
}

export function verifyEditToken(slug: string, token: string): Event | null {
  const event = getEventBySlug(slug);
  if (!event || event.edit_token !== token) return null;
  return event;
}

export function savePushSubscription(
  eventId: string,
  endpoint: string,
  p256dh: string,
  auth: string
) {
  getDb()
    .prepare(
      `INSERT INTO push_subscriptions (event_id, endpoint, p256dh, auth)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET
         event_id = excluded.event_id,
         p256dh = excluded.p256dh,
         auth = excluded.auth`
    )
    .run(eventId, endpoint, p256dh, auth);
}

export function getPushSubscriptions(eventId: string) {
  return getDb()
    .prepare("SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE event_id = ?")
    .all(eventId) as { endpoint: string; p256dh: string; auth: string }[];
}

export function removePushSubscription(eventId: string, endpoint: string) {
  getDb()
    .prepare("DELETE FROM push_subscriptions WHERE event_id = ? AND endpoint = ?")
    .run(eventId, endpoint);
}
