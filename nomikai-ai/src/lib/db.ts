import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import {
  generateSessionToken,
  hashPassword,
  verifyPassword,
} from "./auth";
import { EVENT_TTL_DAYS } from "./constants";
import { defaultExpiresAt, isEventExpired } from "./event-expiry";
import {
  generateEditToken,
  generateEventId,
  generateParticipantToken,
  generateSlug,
} from "./id";
import type {
  CreateEventInput,
  Event,
  EventDetail,
  JoinEventInput,
  Participant,
  Plan,
  PlanMeta,
  UpdateParticipantInput,
  User,
  UserEventSummary,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "nomikai.db");
const SESSION_DAYS = 7;
const OAUTH_MARKER = "oauth:no-pass";

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
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

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
  if (!columnExists(database, "events", "organizer_user_id")) {
    database.exec("ALTER TABLE events ADD COLUMN organizer_user_id INTEGER");
  }
  if (!columnExists(database, "events", "expires_at")) {
    database.exec("ALTER TABLE events ADD COLUMN expires_at TEXT");
    database.exec(
      `UPDATE events SET expires_at = datetime(created_at, '+${EVENT_TTL_DAYS} days') WHERE expires_at IS NULL`
    );
  }
  if (!columnExists(database, "participants", "participant_token")) {
    database.exec("ALTER TABLE participants ADD COLUMN participant_token TEXT");
    database.exec(
      `UPDATE participants SET participant_token = lower(hex(randomblob(16))) WHERE participant_token IS NULL`
    );
  }
  if (!columnExists(database, "users", "google_id")) {
    database.exec("ALTER TABLE users ADD COLUMN google_id TEXT");
    database.exec(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL`
    );
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS participant_push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_participant_push ON participant_push_subscriptions(participant_id);
  `);

  database.exec(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_token ON participants(participant_token)`
  );
  database.exec(
    `CREATE INDEX IF NOT EXISTS idx_events_organizer_user ON events(organizer_user_id)`
  );

  database
    .prepare(
      `UPDATE events SET expires_at = datetime(created_at, '+${EVENT_TTL_DAYS} days') WHERE expires_at IS NULL`
    )
    .run();
}

function parseUser(row: Record<string, unknown>): User {
  return {
    id: row.id as number,
    email: row.email as string,
    display_name: row.display_name as string,
    created_at: row.created_at as string,
  };
}

function parseEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    organizer_name: row.organizer_name as string,
    organizer_user_id: (row.organizer_user_id as number | null) ?? null,
    budget: row.budget as number,
    mood: row.mood as Event["mood"],
    date_options: JSON.parse(row.date_options_json as string),
    edit_token: row.edit_token as string,
    expires_at: (row.expires_at as string) ?? defaultExpiresAt(),
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
    participant_token: row.participant_token as string,
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

// --- Users & Sessions ---

export function createUser(email: string, password: string, displayName: string): User {
  const database = getDb();
  const existing = database
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email.toLowerCase());
  if (existing) throw new Error("EMAIL_EXISTS");

  const result = database
    .prepare(
      `INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)`
    )
    .run(email.toLowerCase(), hashPassword(password), displayName.trim());

  const row = database
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(result.lastInsertRowid) as Record<string, unknown>;
  return parseUser(row);
}

export function authenticateUser(email: string, password: string): User | null {
  const row = getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as Record<string, unknown> | undefined;
  if (!row) return null;
  if ((row.password_hash as string) === OAUTH_MARKER) return null;
  if (!verifyPassword(password, row.password_hash as string)) return null;
  return parseUser(row);
}

export function findOrCreateGoogleUser(
  googleId: string,
  email: string,
  displayName: string
): User {
  const database = getDb();
  const byGoogle = database
    .prepare("SELECT * FROM users WHERE google_id = ?")
    .get(googleId) as Record<string, unknown> | undefined;
  if (byGoogle) return parseUser(byGoogle);

  const byEmail = database
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as Record<string, unknown> | undefined;

  if (byEmail) {
    database.prepare("UPDATE users SET google_id = ? WHERE id = ?").run(googleId, byEmail.id);
    return parseUser({ ...byEmail, google_id: googleId });
  }

  const result = database
    .prepare(
      `INSERT INTO users (email, password_hash, display_name, google_id) VALUES (?, ?, ?, ?)`
    )
    .run(email.toLowerCase(), OAUTH_MARKER, displayName.trim(), googleId);

  const row = database
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(result.lastInsertRowid) as Record<string, unknown>;
  return parseUser(row);
}

export function createSession(userId: number): string {
  const database = getDb();
  const token = generateSessionToken();
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);

  database
    .prepare(`INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)`)
    .run(userId, token, expires.toISOString());

  return token;
}

export function deleteSession(token: string): void {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function getUserBySession(token: string): User | null {
  const row = getDb()
    .prepare(
      `SELECT u.* FROM users u
       JOIN sessions s ON s.user_id = u.id
       WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')`
    )
    .get(token) as Record<string, unknown> | undefined;
  return row ? parseUser(row) : null;
}

// --- Events ---

export function createEvent(input: CreateEventInput): Event {
  const database = getDb();
  const id = generateEventId();
  const slug = generateSlug();
  const edit_token = generateEditToken();
  const expires_at = defaultExpiresAt();

  database
    .prepare(
      `INSERT INTO events (id, slug, title, organizer_name, organizer_user_id, budget, mood, date_options_json, edit_token, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      slug,
      input.title.trim(),
      input.organizer_name.trim(),
      input.organizer_user_id ?? null,
      input.budget,
      input.mood,
      JSON.stringify(input.date_options),
      edit_token,
      expires_at
    );

  return getEventBySlug(slug)!;
}

export function getEventBySlug(slug: string): Event | null {
  const row = getDb()
    .prepare("SELECT * FROM events WHERE slug = ?")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? parseEvent(row) : null;
}

export function getEventsByUserId(userId: number): UserEventSummary[] {
  const rows = getDb()
    .prepare(
      `SELECT e.*,
        (SELECT COUNT(*) FROM participants p WHERE p.event_id = e.id) AS participant_count,
        (SELECT COUNT(*) FROM plans pl WHERE pl.event_id = e.id) AS plan_count
       FROM events e
       WHERE e.organizer_user_id = ?
       ORDER BY e.created_at DESC`
    )
    .all(userId) as Record<string, unknown>[];

  return rows.map((row) => {
    const event = parseEvent(row);
    return {
      event,
      participant_count: row.participant_count as number,
      has_plan: (row.plan_count as number) > 0,
      expired: isEventExpired(event.expires_at),
    };
  });
}

export function deleteEvent(slug: string): boolean {
  const event = getEventBySlug(slug);
  if (!event) return false;
  getDb().prepare("DELETE FROM events WHERE id = ?").run(event.id);
  return true;
}

export function getParticipantsByEventId(eventId: string): Participant[] {
  const rows = getDb()
    .prepare("SELECT * FROM participants WHERE event_id = ? ORDER BY created_at ASC")
    .all(eventId) as Record<string, unknown>[];
  return rows.map(parseParticipant);
}

export function getParticipantById(eventId: string, participantId: number): Participant | null {
  const row = getDb()
    .prepare("SELECT * FROM participants WHERE event_id = ? AND id = ?")
    .get(eventId, participantId) as Record<string, unknown> | undefined;
  return row ? parseParticipant(row) : null;
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
    expired: isEventExpired(event.expires_at),
  };
}

export function addParticipant(slug: string, input: JoinEventInput): Participant | null {
  const event = getEventBySlug(slug);
  if (!event || isEventExpired(event.expires_at)) return null;

  const duplicate = getDb()
    .prepare(
      "SELECT id FROM participants WHERE event_id = ? AND lower(name) = lower(?) AND lower(station) = lower(?)"
    )
    .get(event.id, input.name.trim(), input.station.trim());
  if (duplicate) return null;

  const participant_token = generateParticipantToken();
  const result = getDb()
    .prepare(
      `INSERT INTO participants (event_id, name, station, availability_json, participant_token)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      event.id,
      input.name.trim(),
      input.station.trim(),
      JSON.stringify(input.availability),
      participant_token
    );

  const row = getDb()
    .prepare("SELECT * FROM participants WHERE id = ?")
    .get(result.lastInsertRowid) as Record<string, unknown>;
  return parseParticipant(row);
}

export function updateParticipant(
  slug: string,
  participantId: number,
  participantToken: string,
  input: UpdateParticipantInput
): Participant | null {
  const event = getEventBySlug(slug);
  if (!event || isEventExpired(event.expires_at)) return null;

  const existing = getParticipantById(event.id, participantId);
  if (!existing || existing.participant_token !== participantToken) return null;

  getDb()
    .prepare(
      `UPDATE participants SET name = ?, station = ?, availability_json = ? WHERE id = ?`
    )
    .run(
      input.name.trim(),
      input.station.trim(),
      JSON.stringify(input.availability),
      participantId
    );

  return getParticipantById(event.id, participantId);
}

export function deleteParticipant(
  slug: string,
  participantId: number,
  auth: { participant_token?: string; edit_token?: string }
): boolean {
  const event = getEventBySlug(slug);
  if (!event) return false;

  const participant = getParticipantById(event.id, participantId);
  if (!participant) return false;

  const byParticipant =
    auth.participant_token && auth.participant_token === participant.participant_token;
  const byOrganizer = auth.edit_token && auth.edit_token === event.edit_token;

  if (!byParticipant && !byOrganizer) return false;

  getDb().prepare("DELETE FROM participants WHERE id = ?").run(participantId);
  return true;
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

export function verifyParticipantToken(
  slug: string,
  participantId: number,
  participantToken: string
): Participant | null {
  const event = getEventBySlug(slug);
  if (!event) return null;
  const participant = getParticipantById(event.id, participantId);
  if (!participant || participant.participant_token !== participantToken) return null;
  return participant;
}

export function saveParticipantPushSubscription(
  participantId: number,
  endpoint: string,
  p256dh: string,
  auth: string
) {
  getDb()
    .prepare(
      `INSERT INTO participant_push_subscriptions (participant_id, endpoint, p256dh, auth)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET
         participant_id = excluded.participant_id,
         p256dh = excluded.p256dh,
         auth = excluded.auth`
    )
    .run(participantId, endpoint, p256dh, auth);
}

export function getParticipantPushSubscriptions(eventId: string) {
  return getDb()
    .prepare(
      `SELECT pps.participant_id, pps.endpoint, pps.p256dh, pps.auth
       FROM participant_push_subscriptions pps
       JOIN participants p ON p.id = pps.participant_id
       WHERE p.event_id = ?`
    )
    .all(eventId) as {
    participant_id: number;
    endpoint: string;
    p256dh: string;
    auth: string;
  }[];
}

export function removeParticipantPushSubscription(participantId: number, endpoint: string) {
  getDb()
    .prepare("DELETE FROM participant_push_subscriptions WHERE participant_id = ? AND endpoint = ?")
    .run(participantId, endpoint);
}

export function cloneEvent(slug: string, organizerUserId?: number | null): Event | null {
  const source = getEventBySlug(slug);
  if (!source) return null;

  if (organizerUserId != null && source.organizer_user_id != null) {
    if (source.organizer_user_id !== organizerUserId) return null;
  }

  const database = getDb();
  const id = generateEventId();
  const newSlug = generateSlug();
  const edit_token = generateEditToken();
  const expires_at = defaultExpiresAt();
  const title = source.title.endsWith("（コピー）")
    ? source.title
    : `${source.title}（コピー）`;

  database
    .prepare(
      `INSERT INTO events (id, slug, title, organizer_name, organizer_user_id, budget, mood, date_options_json, edit_token, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      newSlug,
      title,
      source.organizer_name,
      organizerUserId ?? source.organizer_user_id,
      source.budget,
      source.mood,
      JSON.stringify(source.date_options),
      edit_token,
      expires_at
    );

  return getEventBySlug(newSlug);
}

export { isEventExpired };
