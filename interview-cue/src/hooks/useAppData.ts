"use client";

import { useCallback, useSyncExternalStore } from "react";
import { loadData, persistData as writeData } from "@/lib/storage";
import type { AppData } from "@/lib/types";

const emptyData = (): AppData => ({ version: 1, sets: [] });

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((entry) => entry !== listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): AppData {
  return loadData();
}

function getServerSnapshot(): AppData {
  return emptyData();
}

export function useAppData() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const save = useCallback((next: AppData) => {
    writeData(next);
    notify();
  }, []);

  return { data, save };
}
