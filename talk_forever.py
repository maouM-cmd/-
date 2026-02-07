import random
import time
import sys
import io

# Windowsコンソールでの文字化け防止
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')

# ==========================================
# 好きな人とずっとしゃべるために……
# ==========================================

class Heroine:
    """
    ヒロイン「凛」のクラス。
    好感度とムード（機嫌・緊張度）を管理します。
    """
    def __init__(self):
        self.name = "凛"
        self.affection = 30  # 初期好感度 (0-100)
        # Mood state: 0=緊張(Nervous), 1=普通(Normal), 2=楽しい(Happy/Relaxed)
        self.mood_score = 0
    
    @property
    def emotion(self):
        """現在のムードを文字列で返すプロパティ"""
        if self.mood_score < 10:
            return "少し緊張した"
        elif self.mood_score < 30:
            return "穏やかな"
        else:
            return "楽しそうな"

    def react(self, score_delta, mood_delta, message):
        """
        会話の結果に応じてステータスを更新し、反応を返します。
        
        Args:
            score_delta (int): 好感度の増減値
            mood_delta (int): コンテキスト/ムードの増減値
            message (str): ヒロインのセリフ
        """
        self.affection += score_delta
        self.mood_score += mood_delta
        
        # 好感度のキャップ処理 (0-100)
        self.affection = max(0, min(100, self.affection))
        
        print(f"\n{self.name}は{self.emotion}表情で言った。")
        print(f"「{message}」")
        time.sleep(1)


class ConversationTrainer:
    """
    会話の選択肢を管理し、ユーザーの選択に対してフィードバックを行うコーチングクラス。
    """
    def __init__(self):
        # フェーズごとの話題データベース
        # type: "Good"(正解), "Safe"(無難), "Bad"(NG), "Risk"(ハイリスク)
        self.topics = {
            "PHASE1_INTRO": [
                {"text": "今日はいい天気だね", "type": "Safe", "score": 5, "mood": 2, "feedback": "Good! 天気の話は共感を得やすく、初対面の緊張をほぐすのに最適です。"},
                {"text": "お店の雰囲気、すごくいいね", "type": "Good", "score": 10, "mood": 5, "feedback": "Excellent! 「今ここにある共有体験」を話題にすると、自然に会話が弾みます。"},
                {"text": "俺、昔ここでナンパしたことあってさ(笑)", "type": "Bad", "score": -20, "mood": -10, "feedback": "Bad! デート初手での武勇伝や異性関係の話は、警戒心を抱かせるだけです。"},
                {"text": "その服、すごく似合ってるね", "type": "Risk", "score": 15, "mood": 5, "feedback": "Great! 褒めるのは勇気が要りますが、序盤で成功すると一気に距離が縮まります。ただし、言い方次第ではチャラく見える諸刃の剣です。"}
            ],
            "PHASE2_DINING": [
                {"text": "これ、すごく美味しい！ そっちはどう？", "type": "Good", "score": 10, "mood": 5, "feedback": "Good! 料理の感想を共有することで「一緒に楽しんでいる」感覚を作れます。"},
                {"text": "最近、仕事が忙しくて寝てないんだよね…", "type": "Bad", "score": -10, "mood": -5, "feedback": "Bad! ネガティブな話題や疲労アピールは、楽しい食事の空気を重くしてしまいます。"},
                {"text": "休日はいつも何してるの？", "type": "Safe", "score": 5, "mood": 2, "feedback": "Safe. プライベートへの質問は会話の基本ですが、唐突すぎないように流れを意識しましょう。"},
                {"text": "元彼とはなんで別れたの？", "type": "Risk", "score": -30, "mood": -20, "feedback": "Fatal Error! まだ信頼関係ができていない段階で、過去の恋愛に踏み込むのは地雷です。"}
            ],
            "PHASE3_LEAVING": [
                {"text": "今日は楽しかった、ありがとう！", "type": "Safe", "score": 5, "mood": 2, "feedback": "Good. 感謝を伝えるのは礼儀であり、好印象を残す基本中の基本です。"},
                {"text": "この後、僕の家で飲み直さない？", "type": "Risk", "score": -50, "mood": -50, "feedback": "Danger! 初デートでの強引な誘いは、これまでの積み上げを全て台無しにする可能性があります。誠実さが重要です。"},
                {"text": "次は映画でもどうかな？ 気になってる作品があって。", "type": "Good", "score": 15, "mood": 5, "feedback": "Perfect! 具体的な提案で「次」を匂わせることで、相手も返事をしやすくなります。"},
                {"text": "（無言でスマホをいじる）", "type": "Bad", "score": -10, "mood": -5, "feedback": "Bad. 去り際の態度は記憶に残ります。最後まで相手への関心を示しましょう。"}
            ]
        }

    def get_choices(self, phase):
        """指定されたフェーズの選択肢リストを返します"""
        # ここでは固定リストを返していますが、ランダムにしたりシャッフルしても面白いです
        return self.topics.get(phase, [])

    def evaluate(self, choice_data, heroine):
        """
        選ばれた選択肢を評価し、ヒロインの反応とコーチングメッセージを返します。
        
        Args:
            choice_data (dict): 選択された話題のデータ
            heroine (Heroine): ヒロインオブジェクト
            
        Returns:
            tuple: (rin_response, system_feedback)
        """
        t_type = choice_data["type"]
        
        # ヒロインの反応セリフ分岐
        if t_type == "Good":
            rin_response = "本当？ 私もそう思ってた！ 話が合うね。"
        elif t_type == "Safe":
            rin_response = "うん、そうだね。（微笑んでいる）"
        elif t_type == "Risk":
            # Riskは成功すれば大きいが、好感度が低いと失敗するロジックを入れても良い
            # 今回はシンプルに、Risk=ハイリターンまたは致命的失敗として定義されているものに従う
            if choice_data["score"] > 0:
                rin_response = "えっ…あ、ありがとう。//（少し照れている）"
            else:
                rin_response = "え…いきなりそういうこと聞くんだ…。"
        elif t_type == "Bad":
            rin_response = "…あ、そうなんだ。（愛想笑い）"
            
        return rin_response, choice_data["feedback"]

# ==========================================
# ゲーム進行部
# ==========================================

def display_status(heroine, phase_name):
    print("\n" + "="*40)
    print(f"【DATE PHASE: {phase_name}】")
    print(f"ヒロイン: {heroine.name} | 好感度: {heroine.affection}/100 | 気分: {heroine.emotion}")
    print("="*40)

def get_user_choice(choices):
    print("\n話題を選んでください:")
    for i, choice in enumerate(choices):
        print(f"{i + 1}. {choice['text']}")
    
    while True:
        try:
            sel = input("\n選択肢番号を入力 >> ")
            idx = int(sel) - 1
            if 0 <= idx < len(choices):
                return choices[idx]
        except ValueError:
            pass
        print("無効な入力です。番号を選んでください。")

def main():
    rin = Heroine()
    trainer = ConversationTrainer()
    
    phases = [
        ("PHASE1_INTRO", "カフェに着席した直後"),
        ("PHASE2_DINING", "楽しく飲食中"),
        ("PHASE3_LEAVING", "帰り際")
    ]
    
    print("\n" + "*"*50)
    print(" 「好きな人とずっとしゃべるために……」 START! ")
    print(" 目的: 適切な話題を選び、凛とのデートを成功させよう！")
    print("*"*50)
    time.sleep(1)

    for phase_key, phase_desc in phases:
        display_status(rin, phase_desc)
        
        # 1. 選択肢提示
        choices = trainer.get_choices(phase_key)
        selected_choice = get_user_choice(choices)
        
        # 2. 判定と反応
        # 演出用ウェイト
        print("\nあなた：「" + selected_choice['text'] + "」")
        time.sleep(1)
        
        rin_msg, coach_msg = trainer.evaluate(selected_choice, rin)
        rin.react(selected_choice['score'], selected_choice['mood'], rin_msg)
        
        # 3. コーチングフィードバック
        print(f"\n[コーチングAI] ▶ {coach_msg}")
        
        # 4. フェーズ終了時のミニウェイト
        input("\n[Enter]キーで次のフェーズへ...")

    # 結果発表
    print("\n" + "="*50)
    print("デート終了！ 結果発表")
    print(f"最終好感度: {rin.affection}")
    
    if rin.affection >= 80:
        print("評価: Sランク (大成功)")
        print("凛「今日は本当に楽しかった！ またすぐに会いたいな…！」")
    elif rin.affection >= 50:
        print("評価: Bランク (成功)")
        print("凛「ありがとう、楽しかったよ。また機会があったら。」")
    else:
        print("評価: Cランク (失敗)")
        print("凛「それじゃ、また…。（足早に去っていった）」")
    print("="*50)

if __name__ == "__main__":
    main()
