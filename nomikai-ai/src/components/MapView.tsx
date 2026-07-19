import type { VenueCandidate } from "@/lib/types";

function bbox(lat: number, lng: number, delta = 0.015) {
  return `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
}

export function MapView({
  lat,
  lng,
  station,
  venues,
}: {
  lat: number;
  lng: number;
  station: string;
  venues?: VenueCandidate[];
}) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (googleMapsKey) {
    const markers = venues
      ?.filter((v) => v.lat != null && v.lng != null)
      .map((v) => `&markers=color:orange%7C${v.lat},${v.lng}`)
      .join("") ?? "";

    const embedUrl = `https://www.google.com/maps/embed/v1/view?key=${googleMapsKey}&center=${lat},${lng}&zoom=15${markers}`;

    return (
      <div className="overflow-hidden rounded-2xl border border-blue-100">
        <iframe
          title={`${station}周辺の地図`}
          src={embedUrl}
          className="h-56 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox(lat, lng)}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100">
      <iframe
        title={`${station}周辺の地図`}
        src={osmUrl}
        className="h-56 w-full"
        loading="lazy"
      />
      <p className="bg-blue-50 px-3 py-2 text-xs text-blue-700">
        OpenStreetMap 表示（Google Maps API キー未設定時）
      </p>
    </div>
  );
}
