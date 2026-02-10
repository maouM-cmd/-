const sceneMap = {
  classroom: {
    title: "放課後、教室で二人きり",
    description: "T.Nちゃんに話しかけるチャンス。どうする？",
    line: "べ、別にあんたのこと待ってたわけじゃないし…。",
    choices: [
      { text: "今日の髪型、すごく似合ってるね", affection: 12, advice: 10, sentiment: 2, response: "なっ…！ そ、そういうの急に言うの反則だから…。", reason: "具体的な褒めは安心感を生む。", tip: "褒めは抽象より具体で。", traitDelta: { tsundere: 2, empathy: 1, pushPull: 1 }, tags: ["compliment", "warm", "gentle"] },
      { text: "宿題見せて、時間ないんだ", affection: -12, advice: 6, sentiment: -2, response: "はぁ？ 人を都合よく使わないでくれる？", reason: "要求先行は利己的に見える。", tip: "お願い前に気遣いを。", traitDelta: { tsundere: -1, empathy: -2, pushPull: -1 }, tags: ["selfish", "cold"] },
      { text: "一緒に帰る？ 無理なら全然いいけど", affection: 8, advice: 12, sentiment: 1, response: "べ、別に…同じ方向だし、ついでならいいわよ。", reason: "逃げ道がある誘いは心理的安全性を上げる。", tip: "断りやすさを設計。", traitDelta: { tsundere: 2, empathy: 1, pushPull: 2 }, tags: ["invite", "balanced", "gentle"] },
      { text: "最近ちゃんと休めてる？", affection: 10, advice: 11, sentiment: 2, response: "…いきなり心配とか、ちょっとずるい。", reason: "体調気遣いは共感力の明確サイン。", tip: "相手の状態確認は好印象。", traitDelta: { tsundere: 1, empathy: 2, pushPull: 0 }, tags: ["care", "empathy", "warm"] }
    ]
  },
  crossing: {
    title: "帰り道の交差点",
    description: "信号待ちで沈黙。気まずさをどう埋める？",
    line: "なんで黙ってるのよ…。べ、別に寂しいとかじゃないし。",
    choices: [
      { text: "今日、手伝ってくれて助かった。ありがとう", affection: 14, advice: 14, sentiment: 2, response: "…っ、ちゃんとお礼言えるんだ。まあ、悪くないわ。", reason: "感謝は信頼形成の最短手段。", tip: "感謝は短くても言語化。", traitDelta: { tsundere: 1, empathy: 3, pushPull: 1 }, tags: ["gratitude", "warm"] },
      { text: "スマホ見ながら歩く", affection: -14, advice: 8, sentiment: -2, response: "人といる時くらい前見なさいよ。印象最悪。", reason: "注意の分散は軽視だと誤解される。", tip: "対面時は反応の一貫性を。", traitDelta: { tsundere: -1, empathy: -3, pushPull: 0 }, tags: ["cold", "ignore"] },
      { text: "T.Nの好きな音楽の話を聞く", affection: 10, advice: 12, sentiment: 1, response: "…へえ、ちゃんと聞く気あるんだ。", reason: "相手の好きは会話熱量を上げる。", tip: "相手中心質問を使う。", traitDelta: { tsundere: 1, empathy: 2, pushPull: 1 }, tags: ["interest", "gentle"] },
      { text: "次のテスト、一緒に対策しよう", affection: 9, advice: 12, sentiment: 1, response: "べ、別に…勉強なら付き合ってもいいけど。", reason: "共同目標は関係の結束を高める。", tip: "共通課題を提案する。", traitDelta: { tsundere: 1, empathy: 1, pushPull: 2 }, tags: ["future", "balanced"] }
    ]
  },
  station: {
    title: "駅前、別れ際",
    description: "最後のひと言で今日の印象が決まる。",
    line: "じゃ、じゃあまた…。ちゃんと挨拶くらいしなさいよね。",
    choices: [
      { text: "今日は楽しかった。また話したい", affection: 16, advice: 18, sentiment: 2, response: "……そ、そう。あんたにしてはいい締め方じゃない。", reason: "別れ際の好意表明は記憶に残る。", tip: "締めのひと言を大切に。", traitDelta: { tsundere: 2, empathy: 2, pushPull: 1 }, tags: ["closure", "warm"] },
      { text: "無言で手を振るだけ", affection: -8, advice: 7, sentiment: -1, response: "なによそれ…伝わりにくいのよ。", reason: "曖昧表現は解釈コストが高い。", tip: "好意は言葉で補完。", traitDelta: { tsundere: 0, empathy: -1, pushPull: -1 }, tags: ["unclear"] },
      { text: "次はT.Nのおすすめカフェ行こう", affection: 12, advice: 16, sentiment: 1, response: "えっ…べ、別に嫌じゃないけど。", reason: "具体的な次回提案は連続性を作る。", tip: "提案は具体的に。", traitDelta: { tsundere: 2, empathy: 1, pushPull: 3 }, tags: ["future", "balanced"] },
      { text: "今日の会話、楽だった。ありがとう", affection: 11, advice: 13, sentiment: 1, response: "…その言い方、嫌いじゃない。", reason: "安心を言語化すると関係が安定する。", tip: "安心感を伝える。", traitDelta: { tsundere: 1, empathy: 2, pushPull: 0 }, tags: ["gratitude", "warm"] }
    ]
  },
  library: {
    title: "追加シーン：図書室で自習",
    description: "静かな空気。距離を詰めるならどう動く？",
    line: "うるさくしないなら、隣…座ってもいいけど。",
    choices: [
      { text: "ノート交換して弱点を埋めよう", affection: 10, advice: 14, sentiment: 1, response: "…合理的ね。嫌いじゃないわ。", reason: "協力提案は信頼を可視化する。", tip: "一緒に成長できる提案を。", traitDelta: { tsundere: 1, empathy: 1, pushPull: 2 }, tags: ["balanced", "future"] },
      { text: "無理して話題を振り続ける", affection: -9, advice: 9, sentiment: -1, response: "空気くらい読みなさいよ…。", reason: "場の文脈無視は負担になる。", tip: "環境に合わせた距離感。", traitDelta: { tsundere: -1, empathy: -1, pushPull: 0 }, tags: ["push", "cold"] },
      { text: "好きな作家を聞いてメモする", affection: 11, advice: 14, sentiment: 2, response: "ほんとにメモしてるの…？ ま、まあいいけど。", reason: "記憶してくれる行為は特別感になる。", tip: "相手の好みは記録して活用。", traitDelta: { tsundere: 2, empathy: 2, pushPull: 1 }, tags: ["interest", "warm", "gentle"] },
      { text: "先に飲み物を買ってきて渡す", affection: 8, advice: 12, sentiment: 1, response: "…ありがと。気が利くじゃない。", reason: "負担軽減の行動は静かに効く。", tip: "小さな先回り配慮。", traitDelta: { tsundere: 1, empathy: 2, pushPull: 0 }, tags: ["care", "gentle"] }
    ]
  },
  chat_night: {
    title: "追加シーン：夜のメッセージ",
    description: "寝る前の短いやりとり。温度差が出やすい。",
    line: "返信は期待してないけど…来たら見ちゃうかも。",
    choices: [
      { text: "今日はありがとう。おやすみ", affection: 9, advice: 13, sentiment: 1, response: "…うん、おやすみ。", reason: "短い定型が安定した信頼になる。", tip: "夜は簡潔で優しい文面。", traitDelta: { tsundere: 1, empathy: 1, pushPull: 0 }, tags: ["warm", "closure"] },
      { text: "既読だけつけて放置", affection: -10, advice: 7, sentiment: -2, response: "…なによ、それ。", reason: "既読放置は拒絶に誤読されやすい。", tip: "短文でも返信する。", traitDelta: { tsundere: -1, empathy: -2, pushPull: 0 }, tags: ["cold", "ignore"] },
      { text: "週末の予定、軽く聞いてみる", affection: 10, advice: 14, sentiment: 1, response: "べ、別に予定くらい教えてもいいけど。", reason: "軽い未来質問は次回接点を作る。", tip: "未来の会話は軽く。", traitDelta: { tsundere: 1, empathy: 1, pushPull: 2 }, tags: ["future", "balanced"] },
      { text: "困ってることない？手伝えるよ", affection: 11, advice: 15, sentiment: 2, response: "…そこまで言うなら、ちょっとだけ頼る。", reason: "支援の申し出は心理的セーフティを高める。", tip: "手伝い提案は具体化。", traitDelta: { tsundere: 1, empathy: 3, pushPull: 0 }, tags: ["care", "empathy", "warm"] }
    ]
  },
  secret_rooftop: {
    title: "解放イベント：夕焼けの屋上",
    description: "T.Nが本音を少しだけ見せる特別イベント。",
    line: "…今日のあんた、ちょっとだけ信用してもいいかも。",
    choices: [
      { text: "無理に答えなくていい。聞くだけにする", affection: 12, advice: 18, sentiment: 2, response: "そういう距離感…嫌いじゃない。", reason: "安心安全な場づくりは自己開示を促進。", tip: "本音の前では聞く姿勢。", traitDelta: { tsundere: 2, empathy: 3, pushPull: 1 }, tags: ["gentle", "empathy", "secret"] },
      { text: "じゃあ今度もっとデートっぽい場所行こう", affection: 8, advice: 13, sentiment: 1, response: "っ…急すぎ。で、でも…悪くはない。", reason: "進展提案は速度調整が必要。", tip: "進展は一段ずつ。", traitDelta: { tsundere: 1, empathy: 0, pushPull: 3 }, tags: ["future", "push", "secret"] }
    ]
  },
  secret_festival: {
    title: "解放イベント：夏祭りの帰り道",
    description: "行動傾向が刺さった人だけが見られる特別ルート。",
    line: "浴衣、似合ってるとか…言わないの？",
    choices: [
      { text: "似合ってる。ちゃんと伝えたかった", affection: 14, advice: 18, sentiment: 2, response: "そ、そう…。そういうとこ、ずるい。", reason: "照れやすい相手には短く明快な肯定。", tip: "照れ系にはシンプル肯定。", traitDelta: { tsundere: 2, empathy: 1, pushPull: 1 }, tags: ["compliment", "warm", "secret"] },
      { text: "屋台で何食べたい？一緒に選ぼう", affection: 10, advice: 15, sentiment: 1, response: "…なら、りんご飴。半分こなら付き合ってあげる。", reason: "共同意思決定はチーム感を作る。", tip: "一緒に決めるを増やす。", traitDelta: { tsundere: 1, empathy: 2, pushPull: 1 }, tags: ["interest", "gentle", "secret"] }
    ]
  }
};

const baseSceneOrder = ["classroom", "crossing", "station", "library", "chat_night"];

const unlockDefinitions = [
  { id: "secret_rooftop", label: "夕焼けの屋上ルート", condition: (s) => s.traits.empathy >= 6 && s.temperature >= 52 },
  { id: "secret_festival", label: "夏祭り帰り道ルート", condition: (s) => (s.historyTags.future || 0) >= 2 && (s.historyTags.compliment || 0) >= 1 }
];

const state = {
  sceneOrder: [...baseSceneOrder], sceneIndex: 0, affection: 20, advice: 0, temperature: 35,
  traits: { tsundere: 0, empathy: 0, pushPull: 0 }, history: [], historyTags: {}, unlocked: new Set(), unlockedInjected: false,
  judge: { posSensitivity: 1.1, negSensitivity: 1.0, mode: "balanced" }
};

const affectionMeter = document.getElementById("affectionMeter");
const adviceMeter = document.getElementById("adviceMeter");
const temperatureMeter = document.getElementById("temperatureMeter");
const affectionValue = document.getElementById("affectionValue");
const adviceValue = document.getElementById("adviceValue");
const temperatureValue = document.getElementById("temperatureValue");
const sceneTitle = document.getElementById("sceneTitle");
const sceneDescription = document.getElementById("sceneDescription");
const choicesWrap = document.getElementById("choices");
const tipsList = document.getElementById("tipsList");
const unlockList = document.getElementById("unlockList");
const tnLine = document.getElementById("tnLine");
const restartBtn = document.getElementById("restartBtn");
const traitTsundere = document.getElementById("traitTsundere");
const traitEmpathy = document.getElementById("traitEmpathy");
const traitPushPull = document.getElementById("traitPushPull");
const posSensitivityInput = document.getElementById("posSensitivity");
const negSensitivityInput = document.getElementById("negSensitivity");
const judgeModeInput = document.getElementById("judgeMode");
const posSensitivityValue = document.getElementById("posSensitivityValue");
const negSensitivityValue = document.getElementById("negSensitivityValue");
const judgeSummary = document.getElementById("judgeSummary");

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

function getModeFactor() {
  if (state.judge.mode === "strict") return { pos: 0.85, neg: 1.3, text: "厳しめ（減点重視）" };
  if (state.judge.mode === "romantic") return { pos: 1.25, neg: 0.85, text: "恋愛重視（加点重視）" };
  return { pos: 1, neg: 1, text: "バランス判定（標準）" };
}

function getSentimentAdjustment(choice) {
  const sentiment = choice.sentiment || 0;
  const mode = getModeFactor();
  if (sentiment >= 0) {
    const bonus = Math.round(sentiment * 2 * state.judge.posSensitivity * mode.pos);
    return { affection: bonus, advice: Math.max(0, Math.round(bonus * 0.6)), label: `ポジ補正 +${bonus}` };
  }
  const penalty = Math.round(Math.abs(sentiment) * 2 * state.judge.negSensitivity * mode.neg);
  return { affection: -penalty, advice: 0, label: `ネガ補正 -${penalty}` };
}

function toneSuffix() {
  if (state.temperature >= 70) return "……あんたと話すと、安心する。";
  if (state.temperature >= 45) return "…まあ、悪くないかも。";
  return "べ、別に期待してないし。";
}

function renderJudgeSummary() {
  const mode = getModeFactor();
  posSensitivityValue.textContent = state.judge.posSensitivity.toFixed(1);
  negSensitivityValue.textContent = state.judge.negSensitivity.toFixed(1);
  judgeSummary.textContent = `現在：${mode.text} / ポジ感度 ${state.judge.posSensitivity.toFixed(1)} / ネガ厳しさ ${state.judge.negSensitivity.toFixed(1)}`;
}

function renderMeters() {
  affectionMeter.value = state.affection;
  adviceMeter.value = state.advice;
  temperatureMeter.value = state.temperature;
  affectionValue.textContent = state.affection;
  adviceValue.textContent = state.advice;
  temperatureValue.textContent = state.temperature;
  traitTsundere.textContent = state.traits.tsundere;
  traitEmpathy.textContent = state.traits.empathy;
  traitPushPull.textContent = state.traits.pushPull;
}

function addTip(scene, choice, adjustment) {
  const item = document.createElement("li");
  item.textContent = `【${scene.title}】${choice.tip} / なぜ刺さった？ → ${choice.reason} / 判定補正：${adjustment.label}`;
  tipsList.prepend(item);
}

function updateHistoryTags(tags) {
  tags.forEach((tag) => { state.historyTags[tag] = (state.historyTags[tag] || 0) + 1; });
}

function evaluateTemperature() {
  const base = 30 + state.affection * 0.45;
  const bonus = state.traits.empathy * 2 + state.traits.tsundere * 1.5 + state.traits.pushPull * 1.2;
  const penalty = (state.historyTags.cold || 0) * 6 + (state.historyTags.selfish || 0) * 7;
  state.temperature = clamp(Math.round(base + bonus - penalty), 0, 100);
}

function evaluateUnlocks() {
  unlockDefinitions.forEach((def) => {
    if (!state.unlocked.has(def.id) && def.condition(state)) {
      state.unlocked.add(def.id);
      const li = document.createElement("li");
      li.textContent = `解放済み：${def.label}`;
      unlockList.appendChild(li);
    }
  });
}

function injectUnlockedScenesIfNeeded() {
  if (state.unlockedInjected) return;
  if (state.sceneIndex >= baseSceneOrder.length) {
    const unlockedIds = unlockDefinitions.map((v) => v.id).filter((id) => state.unlocked.has(id));
    state.sceneOrder.push(...unlockedIds);
    state.unlockedInjected = true;
  }
}

function renderScene() {
  const sceneId = state.sceneOrder[state.sceneIndex];
  const scene = sceneMap[sceneId];
  sceneTitle.textContent = scene.title;
  sceneDescription.textContent = scene.description;
  tnLine.textContent = `${scene.line} ${toneSuffix()}`;
  choicesWrap.innerHTML = "";

  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => {
      const adjustment = getSentimentAdjustment(choice);
      state.affection = clamp(state.affection + choice.affection + adjustment.affection, 0, 100);
      state.advice = clamp(state.advice + choice.advice + adjustment.advice, 0, 100);
      state.traits.tsundere += choice.traitDelta.tsundere;
      state.traits.empathy += choice.traitDelta.empathy;
      state.traits.pushPull += choice.traitDelta.pushPull;
      updateHistoryTags(choice.tags);
      evaluateTemperature();
      state.history.push({ scene: sceneId, choice: choice.text, tags: choice.tags, adjustment: adjustment.label });
      tnLine.textContent = `${choice.response} ${toneSuffix()}`;
      addTip(scene, choice, adjustment);
      evaluateUnlocks();
      renderMeters();
      state.sceneIndex += 1;
      injectUnlockedScenesIfNeeded();
      if (state.sceneIndex < state.sceneOrder.length) setTimeout(renderScene, 500);
      else endGame();
    });
    choicesWrap.appendChild(btn);
  });
}

function createSummaryLine() {
  if (state.traits.empathy >= 8) return "診断：共感会話タイプ。感情の拾い方が強い。";
  if (state.traits.pushPull >= 8) return "診断：関係推進タイプ。提案力が高い。";
  if (state.traits.tsundere >= 8) return "診断：ツンデレ攻略タイプ。距離感設計が上手い。";
  return "診断：平均型。判定設定を変えると別傾向が見える。";
}

function endGame() {
  choicesWrap.innerHTML = "";
  let rank;
  if (state.affection >= 80 && state.temperature >= 70) {
    rank = "恋人寸前エンド";
    tnLine.textContent = "…今日のあんた、すごくよかった。次は私から誘ってもいい？";
  } else if (state.affection >= 58) {
    rank = "友達以上候補エンド";
    tnLine.textContent = "まあ、前よりずっとマシ。次も失敗しないでよね。";
  } else {
    rank = "ツンツン継続エンド";
    tnLine.textContent = "まだ伸びしろだらけ。次はちゃんと向き合いなさい。";
  }
  sceneTitle.textContent = `結果：${rank}`;
  sceneDescription.textContent = `好感度 ${state.affection} / 温度 ${state.temperature} / 解放イベント ${state.unlocked.size}件 / 総選択 ${state.history.length}`;
  const summaryTip = document.createElement("li");
  summaryTip.textContent = `【最終診断】${createSummaryLine()}`;
  tipsList.prepend(summaryTip);
  restartBtn.hidden = false;
}

function resetGame() {
  state.sceneOrder = [...baseSceneOrder];
  state.sceneIndex = 0;
  state.affection = 20;
  state.advice = 0;
  state.temperature = 35;
  state.traits = { tsundere: 0, empathy: 0, pushPull: 0 };
  state.history = [];
  state.historyTags = {};
  state.unlocked = new Set();
  state.unlockedInjected = false;
  tipsList.innerHTML = "";
  unlockList.innerHTML = "<li>未解放：特定の会話傾向で新イベントが出現</li>";
  restartBtn.hidden = true;
  renderMeters();
  renderScene();
}

function bindJudgeControls() {
  posSensitivityInput.addEventListener("input", () => {
    state.judge.posSensitivity = Number(posSensitivityInput.value);
    renderJudgeSummary();
  });
  negSensitivityInput.addEventListener("input", () => {
    state.judge.negSensitivity = Number(negSensitivityInput.value);
    renderJudgeSummary();
  });
  judgeModeInput.addEventListener("change", () => {
    state.judge.mode = judgeModeInput.value;
    renderJudgeSummary();
  });
  renderJudgeSummary();
}

function initTNModel() {
  const viewport = document.getElementById("modelViewport");
  const expressionSelect = document.getElementById("expressionSelect");
  const outfitSelect = document.getElementById("outfitSelect");

  if (!viewport) {
    return;
  }

  viewport.innerHTML = `
    <div class="portrait rig-normal outfit-sky" id="portrait2d" aria-label="2D portrait">
      <div class="portrait-hair-back"></div>
      <div class="portrait-body"></div>
      <div class="portrait-head"></div>
      <div class="portrait-blush left"></div>
      <div class="portrait-blush right"></div>
      <div class="portrait-eye left"></div>
      <div class="portrait-eye right"></div>
      <div class="portrait-mouth"></div>
      <div class="portrait-hair-front"></div>
    </div>
  `;

  const portrait = document.getElementById("portrait2d");

  const expressionClassMap = {
    normal: "rig-normal",
    smile: "rig-smile",
    shy: "rig-shy",
    angry: "rig-angry",
    surprised: "rig-surprised",
    sleepy: "rig-sleepy"
  };

  const outfitClassMap = {
    sky: "outfit-sky",
    brown: "outfit-brown",
    black: "outfit-black"
  };

  const applyExpression = (value) => {
    Object.values(expressionClassMap).forEach((cls) => portrait.classList.remove(cls));
    portrait.classList.add(expressionClassMap[value] || "rig-normal");
  };

  const applyOutfit = (value) => {
    Object.values(outfitClassMap).forEach((cls) => portrait.classList.remove(cls));
    portrait.classList.add(outfitClassMap[value] || "outfit-sky");
  };

  if (expressionSelect) {
    expressionSelect.addEventListener("change", () => applyExpression(expressionSelect.value));
    applyExpression(expressionSelect.value);
  }

  if (outfitSelect) {
    outfitSelect.addEventListener("change", () => applyOutfit(outfitSelect.value));
    applyOutfit(outfitSelect.value);
  }
}

restartBtn.addEventListener("click", resetGame);
bindJudgeControls();
renderMeters();
renderScene();
initTNModel();
