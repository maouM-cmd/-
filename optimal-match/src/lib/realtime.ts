export type RealtimeEvent =
  | { type: "chat:message"; payload: { from_user_id: number; to_user_id: number; message: import("./types").Message } }
  | { type: "match:new"; payload: { user_id: number; profile_id: number; profile_name: string } };

type Subscriber = {
  userId: number;
  send: (event: RealtimeEvent) => void;
};

declare global {
  var __realtimeSubscribers: Map<string, Subscriber> | undefined;
}

function subscribers() {
  if (!global.__realtimeSubscribers) {
    global.__realtimeSubscribers = new Map();
  }
  return global.__realtimeSubscribers;
}

export function subscribeRealtime(userId: number, send: (event: RealtimeEvent) => void): () => void {
  const id = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  subscribers().set(id, { userId, send });
  return () => subscribers().delete(id);
}

export function publishRealtime(userId: number, event: RealtimeEvent) {
  for (const sub of subscribers().values()) {
    if (sub.userId === userId) {
      sub.send(event);
    }
  }
}

export function publishChatMessage(message: import("./types").Message) {
  publishRealtime(message.to_user_id, {
    type: "chat:message",
    payload: { from_user_id: message.from_user_id, to_user_id: message.to_user_id, message },
  });
}

export function publishNewMatch(userId: number, profileId: number, profileName: string) {
  publishRealtime(userId, {
    type: "match:new",
    payload: { user_id: userId, profile_id: profileId, profile_name: profileName },
  });
}
