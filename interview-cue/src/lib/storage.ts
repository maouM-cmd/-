import { TEMPLATES } from "@/data/templates";
import type { AppData, Category, ScriptItem, ScriptSet } from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "interview-cue-data";

function emptyData(): AppData {
  return { version: 1, sets: [] };
}

export function loadData(): AppData {
  if (typeof window === "undefined") return emptyData();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as AppData;
    if (parsed.version !== 1 || !Array.isArray(parsed.sets)) {
      return emptyData();
    }
    return parsed;
  } catch {
    return emptyData();
  }
}

export function persistData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createSetFromTemplate(
  data: AppData,
  category: Category,
  name?: string,
): AppData {
  const template = TEMPLATES.find((item) => item.category === category);
  if (!template) return data;

  const now = new Date().toISOString();
  const newSet: ScriptSet = {
    id: generateId(),
    name: name ?? template.name,
    category,
    createdAt: now,
    updatedAt: now,
    items: template.questions.map((question, index) => ({
      id: generateId(),
      question: question.question,
      keyPoints: "",
      fullText: "",
      targetSeconds: question.targetSeconds,
      order: index,
    })),
  };

  return {
    ...data,
    sets: [newSet, ...data.sets],
  };
}

export function createBlankSet(data: AppData, name: string): AppData {
  const now = new Date().toISOString();
  const newSet: ScriptSet = {
    id: generateId(),
    name,
    category: "job_hunting",
    createdAt: now,
    updatedAt: now,
    items: [],
  };

  return {
    ...data,
    sets: [newSet, ...data.sets],
  };
}

export function deleteSet(data: AppData, setId: string): AppData {
  return {
    ...data,
    sets: data.sets.filter((set) => set.id !== setId),
  };
}

export function updateSet(data: AppData, updatedSet: ScriptSet): AppData {
  return {
    ...data,
    sets: data.sets.map((set) =>
      set.id === updatedSet.id
        ? { ...updatedSet, updatedAt: new Date().toISOString() }
        : set,
    ),
  };
}

export function addItem(data: AppData, setId: string, question: string): AppData {
  const set = data.sets.find((entry) => entry.id === setId);
  if (!set) return data;

  const newItem: ScriptItem = {
    id: generateId(),
    question,
    keyPoints: "",
    fullText: "",
    targetSeconds: 60,
    order: set.items.length,
  };

  return updateSet(data, {
    ...set,
    items: [...set.items, newItem],
  });
}

export function updateItem(
  data: AppData,
  setId: string,
  item: ScriptItem,
): AppData {
  const set = data.sets.find((entry) => entry.id === setId);
  if (!set) return data;

  return updateSet(data, {
    ...set,
    items: set.items.map((entry) => (entry.id === item.id ? item : entry)),
  });
}

export function deleteItem(data: AppData, setId: string, itemId: string): AppData {
  const set = data.sets.find((entry) => entry.id === setId);
  if (!set) return data;

  const items = set.items
    .filter((entry) => entry.id !== itemId)
    .map((entry, index) => ({ ...entry, order: index }));

  return updateSet(data, { ...set, items });
}

export function duplicateSet(data: AppData, setId: string): AppData {
  const set = data.sets.find((entry) => entry.id === setId);
  if (!set) return data;

  const now = new Date().toISOString();
  const duplicated: ScriptSet = {
    ...set,
    id: generateId(),
    name: `${set.name}（コピー）`,
    createdAt: now,
    updatedAt: now,
    items: set.items.map((item) => ({
      ...item,
      id: generateId(),
    })),
  };

  return {
    ...data,
    sets: [duplicated, ...data.sets],
  };
}

export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importData(raw: string): AppData {
  const parsed = JSON.parse(raw) as AppData;
  if (parsed.version !== 1 || !Array.isArray(parsed.sets)) {
    throw new Error("無効なデータ形式です");
  }
  return parsed;
}
