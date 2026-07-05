"use client";

import { useRef, useState } from "react";
import { Avatar } from "./Avatar";

export function PhotoUpload({
  currentPhoto,
  name,
}: {
  currentPhoto: string | null;
  name: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoPath, setPhotoPath] = useState(currentPhoto);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    setMessage("");
    const form = new FormData();
    form.append("photo", file);
    const res = await fetch("/api/profile/photo", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setPhotoPath(data.profile.photo_path);
      setMessage("写真を更新しました");
    } else {
      setMessage(data.error ?? "アップロード失敗");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name || "?"} photoPath={photoPath} size="lg" />
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          {uploading ? "アップロード中..." : "写真を変更"}
        </button>
        <p className="mt-1 text-xs text-gray-400">JPEG/PNG/WebP · 5MB以下</p>
        {message && (
          <p className={`mt-1 text-xs ${message.includes("失敗") ? "text-red-600" : "text-emerald-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
