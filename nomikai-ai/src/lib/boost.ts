import { MOOD_OPTIONS, TIME_SLOTS } from "./constants";
import type { BoostContent, DateOption, Mood, Participant } from "./types";

function slotKey(slot: { date: string; timeSlot: string }) {
  return `${slot.date}|${slot.timeSlot}`;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;
}

function timeSlotLabel(timeSlot: string): string {
  return TIME_SLOTS.find((t) => t.value === timeSlot)?.label ?? timeSlot;
}

export function findBestSlot(
  participants: Participant[],
  dateOptions: DateOption[]
): BoostContent["recommendedSlot"] {
  if (participants.length === 0 || dateOptions.length === 0) return null;

  const counts = new Map<string, number>();
  for (const opt of dateOptions) {
    counts.set(slotKey(opt), 0);
  }

  for (const p of participants) {
    for (const slot of p.availability) {
      const key = slotKey(slot);
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }

  let bestKey = "";
  let bestCount = -1;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      bestKey = key;
    }
  }

  if (!bestKey || bestCount === 0) {
    const first = dateOptions[0];
    return {
      date: first.date,
      timeSlot: first.timeSlot,
      participantCount: 0,
      totalCount: participants.length,
      label: `${formatDateLabel(first.date)} ${timeSlotLabel(first.timeSlot)}（候補日時）`,
    };
  }

  const [date, timeSlot] = bestKey.split("|");
  return {
    date,
    timeSlot,
    participantCount: bestCount,
    totalCount: participants.length,
    label: `${formatDateLabel(date)} ${timeSlotLabel(timeSlot)}（${participants.length}人中${bestCount}人参加可）`,
  };
}

const TOASTS: Record<Mood, string[]> = {
  casual: [
    "今日は忙しい中お集まりいただきありがとうございます！気軽に楽しみましょう！乾杯！",
    "久しぶりに会えて嬉しいです。今日はゆっくり語り合いましょう。乾杯！",
    "仕事もプライベートも、今日は忘れて楽しみましょう！乾杯！",
  ],
  lively: [
    "今日は盛大に盛り上がりましょう！みんなで乾杯！",
    "ワイワイいきましょう！今日は最高の夜にします！乾杯！",
    "大声出していい日です！楽しんでいきましょう！乾杯！",
  ],
  quiet: [
    "落ち着いた雰囲気で、ゆっくりお話しできればと思います。乾杯。",
    "今日は肩の力を抜いて、美味しいお酒と会話を楽しみましょう。乾杯。",
    "静かに、でも心を込めて。素敵な時間になりますように。乾杯。",
  ],
  celebration: [
    "本日はおめでとうございます！心から祝福します！乾杯！",
    "素晴らしい節目を迎えられたこと、本当におめでとう！乾杯！",
    "今日という日を記念に、最高の乾杯をしましょう！乾杯！",
  ],
};

const GAMES: Record<Mood, string[]> = {
  casual: [
    "【ありがとうカード】全員が隣の人に感謝を1つ言う",
    "【最近ハマってること】30秒で共有、共通点を探す",
    "【2つの真実と1つの嘘】当てっこゲーム",
  ],
  lively: [
    "【ジェスチャーゲーム】スマホタイマーで盛り上げ",
    "【一気飲み王決定戦】※無理せず、ソフトドリンク組も歓迎",
    "【連想ゲーム】前の人の言葉から連想して次へ",
  ],
  quiet: [
    "【おすすめ本・映画】最近のイチオシを1つ紹介",
    "【人生の転機】印象に残った出来事を語る",
    "【もしも質問】「もし100万円もらえたら？」など",
  ],
  celebration: [
    "【お祝いスピーチ】1分間スピーチタイム",
    "【思い出クイズ】主役に関するクイズ大会",
    "【未来へのメッセージ】紙に書いて渡す",
  ],
};

const CONVERSATION_STARTERS: Record<Mood, string[]> = {
  casual: [
    "最近食べて美味しかったお店はどこですか？",
    "週末は何をしてリフレッシュしてますか？",
    "子供の頃の好きな食べ物、今も好きですか？",
  ],
  lively: [
    "今までで一番ヤバかった飲み会エピソードは？",
    "もし明日から1週間休みなら何する？",
    "自分を動物に例えると何ですか？",
  ],
  quiet: [
    "今年読んで良かった本や見た映画は？",
    "仕事以外で最近力を入れていることは？",
    "10年後の自分はどんな生活をしてると思いますか？",
  ],
  celebration: [
    "主役の第一印象と今の印象、変わりましたか？",
    "主役と一番思い出に残っているエピソードは？",
    "これからの目標を聞かせてください！",
  ],
};

const AFTER_PARTY: Record<Mood, string> = {
  casual: "近くのカフェバーでゆっくり2次会。甘いもので締めましょう。",
  lively: "カラオケかダーツバーで2次会！エネルギーそのままに！",
  quiet: "ワインバーかバーで2次会。落ち着いた空間で語り合いを。",
  celebration: "ケーキのあるバーかラウンジで2次会。お祝いの余韻を楽しんで。",
};

export function generateBoostContent(
  participants: Participant[],
  dateOptions: DateOption[],
  mood: Mood,
  middleStation: string
): BoostContent {
  const count = participants.length;
  const moodOpt = MOOD_OPTIONS.find((m) => m.value === mood);
  const recommendedSlot = findBestSlot(participants, dateOptions);

  const toasts = TOASTS[mood].map((t) =>
    t.replace("今日は", count > 0 ? `${count}人揃って` : "今日は")
  );

  const starters = CONVERSATION_STARTERS[mood].map((s) => {
    if (participants.length >= 2) {
      return `${participants[0].name}さんと${participants[1].name}さんにも聞いてみて：${s}`;
    }
    return s;
  });

  return {
    recommendedSlot,
    toasts,
    games: GAMES[mood],
    conversationStarters: starters,
    afterParty: `${middleStation}周辺で${moodOpt?.label ?? ""}な2次会：${AFTER_PARTY[mood]}`,
  };
}
