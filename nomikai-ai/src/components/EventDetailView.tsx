"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CopyList } from "@/components/CopyCard";
import { MapView } from "@/components/MapView";
import { OrganizerPushPrompt } from "@/components/OrganizerPushPrompt";
import { loadParticipantSession } from "@/components/ParticipantEditForm";
import { ParticipantPushPrompt } from "@/components/ParticipantPushPrompt";
import { SourceBadge } from "@/components/SourceBadge";
import { VenueCard } from "@/components/VenueCard";
import { budgetOptions, moodOptions } from "@/lib/constants";
import { withLang, type Locale } from "@/lib/i18n";
import type { EventDetail } from "@/lib/types";

function eventDetailMessages(locale: Locale) {
  return locale === "en"
    ? {
        expiredTitle: "This event has ended",
        expiredHint: "View only (join and plan regeneration are disabled)",
        organizer: "Organizer",
        organizerLink: "Organizer link (keep this URL private)",
        shareLink: "Share link for participants",
        copied: "Copied",
        copy: "Copy",
        share: "Share",
        participants: (n: number) => `Participants (${n})`,
        join: "+ Join",
        editMyAnswer: "Edit my response",
        noParticipants: "No participants yet. Share the link!",
        delete: "Delete",
        generating: "Generating plan...",
        generatePlan: "Generate plan",
        cloning: "Cloning...",
        clone: "Clone from template",
        deleting: "Deleting...",
        deleteEvent: "Delete this event",
        cloneFailed: "Failed to clone event",
        planFailed: "Failed to generate plan",
        deleteFailed: "Failed to delete",
        networkError: "Network error occurred",
        confirmDeleteParticipant: "Remove this participant?",
        confirmDeleteEvent:
          "Delete this event permanently? This cannot be undone.",
        recommendedSlot: "Recommended date & time",
        checkSlots: "Please check the date options",
        meetingPoint: "Meeting point (middle location)",
        middleHint: "Calculated from everyone's nearest stations",
        venues: "Venue suggestions",
        toasts: "Toast messages",
        games: "Party games",
        conversation: "Conversation starters",
        afterParty: "After-party ideas",
      }
    : {
        expiredTitle: "この飲み会は終了しました",
        expiredHint: "閲覧のみ可能です（参加登録・プラン再生成は不可）",
        organizer: "幹事",
        organizerLink: "幹事用リンク（このURLは秘密に）",
        shareLink: "参加者に共有するリンク",
        copied: "コピー済",
        copy: "コピー",
        share: "共有",
        participants: (n: number) => `参加者 (${n}人)`,
        join: "+ 参加登録",
        editMyAnswer: "自分の回答を編集",
        noParticipants: "まだ参加者がいません。リンクを共有しましょう。",
        delete: "削除",
        generating: "プラン生成中...",
        generatePlan: "プランを生成する",
        cloning: "複製中...",
        clone: "テンプレートから複製",
        deleting: "削除中...",
        deleteEvent: "この飲み会を削除する",
        cloneFailed: "複製に失敗しました",
        planFailed: "プラン生成に失敗しました",
        deleteFailed: "削除に失敗しました",
        networkError: "通信エラーが発生しました",
        confirmDeleteParticipant: "この参加者を削除しますか？",
        confirmDeleteEvent:
          "この飲み会を完全に削除しますか？この操作は取り消せません。",
        recommendedSlot: "おすすめ日時",
        checkSlots: "候補日時を確認してください",
        meetingPoint: "集合場所（中間地点）",
        middleHint: "全員の最寄駅から算出した中間地点です",
        venues: "お店候補",
        toasts: "乾杯の挨拶",
        games: "盛り上げゲーム",
        conversation: "会話のきっかけ",
        afterParty: "2次会の提案",
      };
}

export function EventDetailView({
  detail,
  editToken,
  locale,
}: {
  detail: EventDetail;
  editToken?: string;
  locale: Locale;
}) {
  const router = useRouter();
  const t = eventDetailMessages(locale);
  const { event, participants, plan, expired } = detail;
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [localPlan, setLocalPlan] = useState(plan);
  const [localParticipants, setLocalParticipants] = useState(participants);
  const [copied, setCopied] = useState(false);
  const [copiedOrganizer, setCopiedOrganizer] = useState(false);
  const [cloning, setCloning] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${event.slug}`
      : `/e/${event.slug}`;

  const organizerUrl =
    editToken && typeof window !== "undefined"
      ? `${window.location.origin}/e/${event.slug}?token=${editToken}`
      : editToken
        ? `/e/${event.slug}?token=${editToken}`
        : "";

  const moodLabel = moodOptions(locale).find((m) => m.value === event.mood);
  const budgetLabel = budgetOptions(locale).find((b) => b.value === event.budget)?.label;

  const participantSession =
    typeof window !== "undefined" ? loadParticipantSession(event.slug) : null;

  async function cloneEvent() {
    if (!editToken) return;
    setCloning(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${event.slug}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_token: editToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.cloneFailed);
        return;
      }
      router.push(withLang(`/e/${data.slug}?token=${data.edit_token}`, locale));
    } catch {
      setError(t.networkError);
    } finally {
      setCloning(false);
    }
  }

  async function copyShareUrl() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyOrganizerUrl() {
    if (!organizerUrl) return;
    await navigator.clipboard.writeText(organizerUrl);
    setCopiedOrganizer(true);
    setTimeout(() => setCopiedOrganizer(false), 2000);
  }

  async function generatePlan() {
    if (!editToken || expired) return;
    setGenerating(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${event.slug}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_token: editToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.planFailed);
        return;
      }
      setLocalPlan(data.plan);
    } catch {
      setError(t.networkError);
    } finally {
      setGenerating(false);
    }
  }

  async function deleteParticipant(participantId: number) {
    if (!editToken) return;
    if (!confirm(t.confirmDeleteParticipant)) return;

    try {
      const res = await fetch(`/api/events/${event.slug}/participants/${participantId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_token: editToken }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t.deleteFailed);
        return;
      }
      setLocalParticipants((prev) => prev.filter((p) => p.id !== participantId));
    } catch {
      setError(t.networkError);
    }
  }

  async function deleteEvent() {
    if (!editToken) return;
    if (!confirm(t.confirmDeleteEvent)) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${event.slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edit_token: editToken }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t.deleteFailed);
        return;
      }
      router.push(withLang(event.organizer_user_id ? "/my" : "/", locale));
      router.refresh();
    } catch {
      setError(t.networkError);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {expired && (
        <div className="rounded-2xl border border-gray-300 bg-gray-100 p-4 text-center">
          <p className="font-medium text-gray-700">{t.expiredTitle}</p>
          <p className="mt-1 text-xs text-gray-500">{t.expiredHint}</p>
        </div>
      )}

      <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t.organizer}: {event.organizer_name}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
            {moodLabel?.emoji} {moodLabel?.label}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {budgetLabel}
          </span>
        </div>
      </div>

      {editToken && (
        <OrganizerPushPrompt slug={event.slug} editToken={editToken} locale={locale} />
      )}

      {editToken && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <p className="text-sm font-medium text-amber-800">{t.organizerLink}</p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={organizerUrl}
              className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs text-gray-600"
            />
            <button
              type="button"
              onClick={copyOrganizerUrl}
              className="min-h-[44px] shrink-0 rounded-lg bg-amber-500 px-4 text-sm font-medium text-white"
            >
              {copiedOrganizer ? t.copied : t.copy}
            </button>
          </div>
        </div>
      )}

      {editToken && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
          <p className="text-sm font-medium text-gray-700">{t.shareLink}</p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600"
            />
            <button
              type="button"
              onClick={copyShareUrl}
              className="min-h-[44px] shrink-0 rounded-lg bg-gray-600 px-4 text-sm font-medium text-white"
            >
              {copied ? t.copied : t.share}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{t.participants(localParticipants.length)}</h2>
          {!expired && (
            <Link
              href={withLang(`/e/${event.slug}/join`, locale)}
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              {t.join}
            </Link>
          )}
        </div>
        {participantSession && !expired && (
        <>
          <Link
            href={withLang(
              `/e/${event.slug}/edit?token=${participantSession.participantToken}`,
              locale
            )}
            className="mt-2 inline-block text-sm text-amber-600 hover:underline"
          >
            {t.editMyAnswer}
          </Link>
          <div className="mt-3">
            <ParticipantPushPrompt
              slug={event.slug}
              participantId={participantSession.participantId}
              participantToken={participantSession.participantToken}
              locale={locale}
            />
          </div>
        </>
      )}
        {localParticipants.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{t.noParticipants}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {localParticipants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="ml-2 text-gray-500">{p.station}</span>
                </div>
                {editToken && !expired && (
                  <button
                    type="button"
                    onClick={() => deleteParticipant(p.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    {t.delete}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {editToken && !expired && (
        <button
          type="button"
          onClick={generatePlan}
          disabled={generating || localParticipants.length === 0}
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-amber-500 text-lg font-bold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {generating ? t.generating : t.generatePlan}
        </button>
      )}

      {editToken && (
        <button
          type="button"
          onClick={cloneEvent}
          disabled={cloning}
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-amber-200 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
        >
          {cloning ? t.cloning : t.clone}
        </button>
      )}

      {editToken && (
        <button
          type="button"
          onClick={deleteEvent}
          disabled={deleting}
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-red-200 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? t.deleting : t.deleteEvent}
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {localPlan && (
        <div className="space-y-6">
          <SourceBadge meta={localPlan.meta} />

          <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5">
            <h2 className="font-bold text-green-800">{t.recommendedSlot}</h2>
            <p className="mt-2 text-lg font-medium text-gray-900">
              {localPlan.boost_content.recommendedSlot?.label ?? t.checkSlots}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <h2 className="font-bold text-blue-800">{t.meetingPoint}</h2>
            <p className="mt-2 text-2xl font-bold text-gray-900">{localPlan.middle_station}</p>
            <p className="mt-1 text-sm text-gray-500">{t.middleHint}</p>
            {localPlan.middle_lat != null && localPlan.middle_lng != null && (
              <div className="mt-4">
                <MapView
                  lat={localPlan.middle_lat}
                  lng={localPlan.middle_lng}
                  station={localPlan.middle_station}
                  venues={localPlan.venues}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="font-bold text-gray-900">{t.venues}</h2>
            {localPlan.venues.map((venue, i) => (
              <VenueCard key={i} venue={venue} index={i} />
            ))}
          </div>

          <CopyList title={t.toasts} items={localPlan.boost_content.toasts} emoji="🥂" />
          <CopyList title={t.games} items={localPlan.boost_content.games} emoji="🎮" />
          <CopyList
            title={t.conversation}
            items={localPlan.boost_content.conversationStarters}
            emoji="💬"
          />
          <CopyList
            title={t.afterParty}
            items={[localPlan.boost_content.afterParty]}
            emoji="🌙"
          />
        </div>
      )}
    </div>
  );
}
