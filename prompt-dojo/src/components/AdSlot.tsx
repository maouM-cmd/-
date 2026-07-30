interface AdSlotProps {
  position: "top" | "inline" | "bottom";
  className?: string;
}

export function AdSlot({ position, className = "" }: AdSlotProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (adsenseId) {
    return (
      <div className={`ad-slot overflow-hidden rounded-xl ${className}`}>
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={adsenseId}
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? ""}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-6 text-center ${className}`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
        スポンサー
      </p>
      <p className="mt-1 text-xs text-gray-400">広告スペース（{position}）</p>
    </div>
  );
}
