import { photoUrl } from "@/lib/photo";

export function Avatar({
  name,
  photoPath,
  size = "md",
}: {
  name: string;
  photoPath?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const url = photoUrl(photoPath);
  const sizeClass =
    size === "lg" ? "h-20 w-20 text-2xl" : size === "sm" ? "h-10 w-10 text-sm" : "h-14 w-14 text-lg";
  const initial = name.charAt(0);

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-rose-100`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 font-bold text-white ring-2 ring-rose-100`}
    >
      {initial}
    </div>
  );
}
