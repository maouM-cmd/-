import type { IdentifiedItem, InterestEvent, PlaceEvent } from "@/lib/types";
import { DEMO_MOMENTS } from "@/data/moments";

/** モーメント由来の着用アイテム + 香水など単体観測を束ねた「物」レイヤー */
export const CONTEXT_ITEMS: IdentifiedItem[] = [
  ...DEMO_MOMENTS.flatMap((moment) =>
    moment.items.map((item) => ({
      ...item,
      observedAt: moment.timestamp,
      sourceLabel: moment.sourceLabel,
    })),
  ),
  {
    id: "perfume-glossier",
    category: "香水",
    brandName: "Glossier",
    productName: "You Eau de Parfum",
    modelCandidate: "You EDP / 50ml",
    primaryColor: "クリアボトル × 淡ピンク液体",
    materialsTexture: "シトラス〜ムスク系のクリーンな残り香イメージ",
    distinctiveMarks: "シンプル円筒瓶、白キャップ、ロゴの細いサンセリフ",
    confidence: "same_brand",
    confidenceNote:
      "配信で『最近つけてる』と言及。ボトル形状は候補に近いが、照明で色番号までは未確定。",
    priceHint: "¥12,000〜",
    links: [
      {
        label: "ブランド公式を見る",
        href: "https://www.glossier.com/",
        kind: "official",
      },
      {
        label: "国内で在庫を探す",
        href: "https://www.google.com/search?q=Glossier+You+eau+de+parfum",
        kind: "mall",
      },
    ],
    alternatives: [
      {
        label: "同系統クリーンムスク",
        priceHint: "¥3,980",
        note: "近い残香イメージのプチプラ",
      },
    ],
    observedAt: "12:08",
    sourceLabel: "YouTube Live · Q&A",
  },
];

export const CONTEXT_INTERESTS: InterestEvent[] = [
  {
    id: "interest-film-cam",
    label: "フィルムカメラ",
    quote: "最近またフィルムで撮ってて、現像上がり見るのが楽しい",
    timestamp: "18:42",
    sourceLabel: "YouTube Live · Q&A",
    observedAt: "2026-09-01",
    relatedTags: ["カメラ", "写真", "アナログ"],
    actionLabel: "関連動画を探す",
    actionHref: "https://www.google.com/search?q=film+camera+beginner",
  },
  {
    id: "interest-matcha",
    label: "抹茶ラテ",
    quote: "カフェ行ったら最近ずっと抹茶ラテ頼んじゃう",
    timestamp: "07:15",
    sourceLabel: "VLOG · Day off",
    observedAt: "2026-08-28",
    relatedTags: ["カフェ", "ドリンク"],
    actionLabel: "近くの抹茶カフェを探す",
    actionHref: "https://www.google.com/maps/search/抹茶ラテ+カフェ",
  },
  {
    id: "interest-playlist",
    label: "夜ドライブ用プレイリスト",
    quote: "夜に聴く曲、また入れ替えた。静かめのがいい",
    timestamp: "21:03",
    sourceLabel: "Bubble / fan note (demo)",
    observedAt: "2026-08-20",
    relatedTags: ["音楽", "プレイリスト"],
    actionLabel: "似たムードの曲を探す",
    actionHref: "https://www.google.com/search?q=night+drive+playlist+chill",
  },
];

export const CONTEXT_PLACES: PlaceEvent[] = [
  {
    id: "place-seongsu",
    name: "聖水のカフェ（デモ）",
    area: "Seongsu, Seoul",
    visitedAt: "2026-08-28",
    sourceLabel: "VLOG · Day off",
    timestamp: "06:40",
    sceneNote: "大きな窓とコンクリート壁。抹茶ラテがテーブルに置かれている。",
    mapQuery: "https://www.google.com/maps/search/Seongsu+cafe",
    companionNote: "スタッフ・メンバー同行の可能性（モック）",
  },
  {
    id: "place-bookstore",
    name: "独立系ブックストア（デモ）",
    area: "Hannam-dong, Seoul",
    visitedAt: "2026-08-12",
    sourceLabel: "Instagram story archive (demo)",
    timestamp: "—",
    sceneNote: "写真集コーナーの棚。フィルム写真のムックが手元に。",
    mapQuery: "https://www.google.com/maps/search/Hannam+bookstore",
  },
  {
    id: "place-airport-lounge",
    name: "ICN 出発エリア",
    area: "Incheon Airport",
    visitedAt: "2026-09-05",
    sourceLabel: "Fan cam · ICN Arrival",
    timestamp: "00:12",
    sceneNote: "空港ファッション撮影の前後。動線上の到着ゲート周辺。",
    mapQuery: "https://www.google.com/maps/search/Incheon+Airport",
  },
];
