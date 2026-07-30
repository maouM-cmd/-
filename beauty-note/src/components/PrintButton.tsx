"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="w-full rounded-2xl bg-[#c4a484] py-4 text-sm font-semibold text-white"
    >
      印刷 / PDFに保存
    </button>
  );
}
