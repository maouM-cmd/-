export const BACKGROUND_SYNC_TAG = "prompt-dojo-sync";
const DB_NAME = "prompt-dojo-offline";
const STORE_NAME = "queue";
const DB_VERSION = 1;

export type QueuedSubmission = {
  id: string;
  type: "submission";
  challengeId: number;
  promptText: string;
  createdAt: string;
};

export type QueuedComment = {
  id: string;
  type: "comment";
  submissionId: number;
  body: string;
  parentId?: number | null;
  createdAt: string;
};

export type QueuedAction = QueuedSubmission | QueuedComment;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

export async function enqueue(
  action: Omit<QueuedSubmission, "id" | "createdAt"> | Omit<QueuedComment, "id" | "createdAt">,
): Promise<QueuedAction> {
  const db = await openDb();
  const item: QueuedAction = {
    ...action,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  } as QueuedAction;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = () => resolve(item);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAll(): Promise<QueuedAction[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as QueuedAction[]);
    request.onerror = () => reject(request.error);
  });
}

export async function remove(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function flush(): Promise<{ synced: number; failed: number }> {
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  const items = await getAll();
  let synced = 0;
  let failed = 0;

  for (const item of items) {
    try {
      let res: Response;
      if (item.type === "submission") {
        res = await fetch(`/api/challenges/${item.challengeId}/submissions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt_text: item.promptText }),
        });
      } else {
        res = await fetch(`/api/submissions/${item.submissionId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: item.body,
            parent_id: item.parentId ?? null,
          }),
        });
      }

      if (res.ok) {
        await remove(item.id);
        synced += 1;
      } else {
        failed += 1;
      }
    } catch {
      failed += 1;
    }
  }

  return { synced, failed };
}

export async function getPendingCount(): Promise<number> {
  const items = await getAll();
  return items.length;
}

export async function registerBackgroundSync(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    if ("sync" in registration) {
      const reg = registration as ServiceWorkerRegistration & {
        sync: { register: (tag: string) => Promise<void> };
      };
      await reg.sync.register(BACKGROUND_SYNC_TAG);
    }
  } catch {
    // Background Sync unsupported or registration failed
  }
}
