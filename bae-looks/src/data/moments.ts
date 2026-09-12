import type { DemoMoment } from "@/lib/types";

/**
 * UI試作用モック。実在商品の断定ではなく「特定体験」のデモデータ。
 * 実AIパイプライン接続時に差し替える。
 */
export const DEMO_MOMENTS: DemoMoment[] = [
  {
    id: "stage-silver",
    title: "ミュージックショー舞台袖",
    sourceLabel: "YouTube · Music Show Cam",
    timestamp: "02:14",
    sceneNote:
      "スポットライト下の横顔。耳元のメタルが強く反射しているフレーム。",
    frameTone: "stage",
    focusCategory: "ピアス",
    items: [
      {
        id: "ear-hoop",
        category: "ピアス",
        brandName: "Justine Clenquet",
        productName: "Dana Hoop",
        modelCandidate: "Dana / silver-tone hoop",
        primaryColor: "ブラッシュドシルバー",
        materialsTexture: "マット寄りのメッキメタル、軽量な中空感",
        distinctiveMarks: "やや太めの円環、留め具が目立たないワンタッチ構造",
        confidence: "similar",
        confidenceNote:
          "シルエット一致。刻印は解像度不足のため同一型番までは未確定。",
        priceHint: "¥18,000〜",
        links: [
          {
            label: "ブランド公式を見る",
            href: "https://www.justineclenquet.com/",
            kind: "official",
          },
          {
            label: "国内モールで探す",
            href: "https://www.google.com/search?q=Justine+Clenquet+Dana+hoop",
            kind: "mall",
          },
        ],
        alternatives: [
          {
            label: "プチプラ太めフープ",
            priceHint: "¥1,980",
            note: "直径と厚みを寄せた概念コーデ用",
          },
        ],
      },
      {
        id: "stage-top",
        category: "トップス",
        brandName: "Hyein Seo",
        productName: "Structured Crop Tank",
        modelCandidate: "FW stage crop / black",
        primaryColor: "ディープブラック",
        materialsTexture: "マットジャージー、肩線がシャープ",
        distinctiveMarks: "ハイネック寄りのスクエアネック、裾の直線カット",
        confidence: "same_brand",
        confidenceNote:
          "過去のステージ着用傾向とネックラインが近い。色あせ・反射で型番特定は保留。",
        priceHint: "¥45,000〜",
        links: [
          {
            label: "類似デザインを検索",
            href: "https://www.google.com/search?q=black+structured+crop+tank+stage",
            kind: "similar",
          },
        ],
        alternatives: [
          {
            label: "ユニクロ風クロップタンク",
            priceHint: "¥1,490",
            note: "シルエット優先の日常再現用",
          },
        ],
      },
    ],
  },
  {
    id: "airport-denim",
    title: "空港ファッション",
    sourceLabel: "Fan cam · ICN Arrival",
    timestamp: "00:48",
    sceneNote:
      "オーバーサイズデニムと白スニーカー。歩行中のサイドショット。",
    frameTone: "airport",
    focusCategory: "アウター",
    items: [
      {
        id: "denim-jacket",
        category: "アウター",
        brandName: "Acne Studios",
        productName: "Oversized Denim Jacket",
        modelCandidate: "Penelope / mid wash",
        primaryColor: "ミディアムインディゴ",
        materialsTexture: "硬めデニム、ややドロップショルダー",
        distinctiveMarks: "メタルボタン、胸ポケットのステッチが太め",
        confidence: "similar",
        confidenceNote:
          "ウォッシュと肩幅が候補に近い。ロゴパッチはフレーム外。",
        priceHint: "¥60,000〜",
        links: [
          {
            label: "ブランド公式を見る",
            href: "https://www.acnestudios.com/",
            kind: "official",
          },
          {
            label: "ZOZOで類似を探す",
            href: "https://zozo.jp/search/?p_keyv=oversized%20denim%20jacket",
            kind: "mall",
          },
        ],
        alternatives: [
          {
            label: "GU オーバーサイズGジャン",
            priceHint: "¥3,990",
            note: "ブルーの濃淡を寄せた代替",
          },
        ],
      },
      {
        id: "white-sneaker",
        category: "シューズ",
        brandName: "Adidas",
        productName: "Samba OG",
        modelCandidate: "Samba OG / Cloud White",
        primaryColor: "オフホワイト × ガムソール",
        materialsTexture: "スムースレザー、スリーストライプ",
        distinctiveMarks: "トウの穿孔とサイドのサンバラベル",
        confidence: "exact",
        confidenceNote:
          "ソール形状・ストライプ配置・ラベル位置が複数フレームで一致。",
        priceHint: "¥16,500",
        links: [
          {
            label: "公式ストア",
            href: "https://www.adidas.jp/samba",
            kind: "official",
          },
          {
            label: "在庫を横断検索",
            href: "https://www.google.com/search?q=adidas+samba+og+cloud+white",
            kind: "mall",
          },
        ],
        alternatives: [
          {
            label: "類似ガムソールスニーカー",
            priceHint: "¥4,990",
            note: "形だけ寄せたい場合",
          },
        ],
      },
    ],
  },
  {
    id: "vlog-lip",
    title: "VLOG メイクアップ",
    sourceLabel: "YouTube · Behind the Scene",
    timestamp: "05:02",
    sceneNote: "クローズアップ。リップとレイヤードネックレスが同時に映る。",
    frameTone: "vlog",
    focusCategory: "リップ",
    items: [
      {
        id: "lip-tint",
        category: "リップ",
        brandName: "rom&nd",
        productName: "Juicy Lasting Tint",
        modelCandidate: "Bare Grape / 06",
        primaryColor: "ミュートグレープ",
        materialsTexture: "グロウ寄りのティント、内側が少し透ける",
        distinctiveMarks: "キャップのロゴ配置、アプリケーターの細さ",
        confidence: "same_brand",
        confidenceNote:
          "パッケージ色味と仕上がりが一致候補。色番号は照明差で要確認。",
        priceHint: "¥1,540",
        links: [
          {
            label: "公式・取扱店を探す",
            href: "https://www.google.com/search?q=rom%26nd+juicy+lasting+tint+bare+grape",
            kind: "official",
          },
        ],
        alternatives: [
          {
            label: "同系ミュートティント",
            priceHint: "¥1,200",
            note: "グレープ寄りで近い発色",
          },
        ],
      },
      {
        id: "layer-necklace",
        category: "ネックレス",
        brandName: "Vivienne Westwood",
        productName: "Thin Lines Flat Orb Pendant",
        modelCandidate: "silver orb / fine chain",
        primaryColor: "シルバー",
        materialsTexture: "細めチェーン、オーブの立体感",
        distinctiveMarks: "オーブモチーフが鎖骨中央に来る長さ",
        confidence: "similar",
        confidenceNote:
          "オーブ形状は近いが、チェーンのリンク密度が確定しきれない。",
        priceHint: "¥35,000〜",
        links: [
          {
            label: "ブランド公式",
            href: "https://www.viviennewestwood.com/",
            kind: "official",
          },
          {
            label: "類似オーブを検索",
            href: "https://www.google.com/search?q=orb+pendant+necklace+silver",
            kind: "similar",
          },
        ],
        alternatives: [
          {
            label: "ミニオーブ風チャーム",
            priceHint: "¥2,480",
            note: "レイヤード用の概念アイテム",
          },
        ],
      },
    ],
  },
];

export const SITE = {
  brand: "BAE FRAME",
  member: "NMIXX Bae",
  memberJa: "NMIXX ベイ",
  tagline: "服も、ハマりも、お店も。ベイの「今」を起こす。",
  support:
    "着用アイテムだけでなく、発言の興味や行った場所まで。推しコンテキストを可視化する試作。",
} as const;
