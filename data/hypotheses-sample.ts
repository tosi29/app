import { Hypothesis } from '../types/hypothesis';

export const hypotheses: Hypothesis[] = [
  // Episode 1 hypotheses
  { id: 1, episodeId: 1, hypothesis: '吉田松陰の教育方法は現代のリーダーシップ育成に応用できるのではないか', fact: '松陰は弟子一人一人の個性を見抜き、それぞれに合った指導方法を取っていた', x: 0.7, y: 0.8, proposer: 'AI', topic: 'リーダーシップ', createdAt: '2024-01-15T10:30:00Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 2, episodeId: 1, hypothesis: '松下村塾の少人数制が成功の要因だったと考える', fact: '松下村塾の門下生は約90名で、密接な師弟関係が築かれていた', x: 0.5, y: 0.7, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-15T11:00:00Z', confidenceScore: 0.7, originalityScore: 0.5 },
  { id: 3, episodeId: 1, hypothesis: '松陰の人材発見能力は現代のタレントマネジメントの原型', fact: '松陰の門下から伊藤博文、山県有朋など明治維新の指導者が多数輩出された', x: 0.8, y: 0.9, proposer: 'AI', topic: '人材育成', createdAt: '2024-01-15T11:30:00Z', confidenceScore: 0.9, originalityScore: 0.8 },
  { id: 4, episodeId: 1, hypothesis: '儒学と実学の融合が松陰の独自性を生んだ', fact: '松陰は朱子学を学びながらも西洋の兵学書も研究していた', x: 0.9, y: 0.6, proposer: 'AI', topic: '学問統合', createdAt: '2024-01-15T12:00:00Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 5, episodeId: 1, hypothesis: '幕末の激動期だからこそ松陰の思想が輝いたのではないか', fact: '黒船来航や開国という時代背景の中で松陰の攘夷思想が形成された', x: 0.6, y: 0.8, proposer: 'AI', topic: '時代背景', createdAt: '2024-01-15T12:30:00Z', confidenceScore: 0.8, originalityScore: 0.6 },
  { id: 6, episodeId: 1, hypothesis: '松陰の「一日一字を記さば一年にして三百六十字を得べし」の思想は現代の継続学習理論に通じる', fact: '松陰は日々の小さな学習の積み重ねの重要性を説いていた', x: 0.7, y: 0.9, proposer: 'AI', topic: '学習理論', createdAt: '2024-01-15T13:00:00Z', confidenceScore: 0.9, originalityScore: 0.7 },
  { id: 7, episodeId: 1, hypothesis: '松陰の処世術は現代のキャリア形成に活かせる', fact: '松陰は困難な状況でも学び続け、獄中でも教育活動を続けた', x: 0.461, y: 0.526, proposer: 'AI', topic: 'その他', createdAt: '2024-01-15T13:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.5 },
  
  // Episode 2 hypotheses
  { id: 8, episodeId: 2, hypothesis: 'スパルタ教育の本質は忍耐力ではなく効率的な学習方法にあった', fact: 'スパルタの少年たちは7歳から集団生活で実践的な軍事技術を学んでいた', x: 0.234, y: 0.702, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-15T14:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.8 },
  { id: 9, episodeId: 2, hypothesis: '古代ギリシャの体育と知育の統合は現代の全人教育の原点', fact: 'スパルタでは肉体鍛錬と音楽・詩の学習が同時に行われていた', x: 0.261, y: 0.768, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-15T14:30:00.000Z', confidenceScore: 0.9, originalityScore: 0.6 },
  { id: 10, episodeId: 2, hypothesis: 'スパルタの軍事教育システムは現代の企業研修に応用可能', fact: 'スパルタでは段階的な試練を通じて指導者を育成していた', x: 0.304, y: 0.716, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-15T15:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.7 },
  { id: 11, episodeId: 2, hypothesis: 'リュクルゴスの法制は現代の組織運営に示唆を与える', fact: 'リュクルゴス憲法では平等主義と集団主義が重視されていた', x: 0.537, y: 0.568, proposer: 'AI', topic: 'その他', createdAt: '2024-01-15T15:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.9 },
  { id: 12, episodeId: 2, hypothesis: 'スパルタの女性教育が強い戦士を生んだ要因の一つ', fact: 'スパルタの女性も体育に参加し、強い子供を産むための教育を受けていた', x: 0.238, y: 0.64, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-15T16:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.8 },
  { id: 13, episodeId: 2, hypothesis: '共同体意識の醸成がスパルタ教育の核心', fact: '「帰るか盾の上で」という言葉に表されるように、個人より共同体を重視していた', x: 0.315, y: 0.71, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-15T16:30:00.000Z', confidenceScore: 0.9, originalityScore: 0.5 },
  { id: 14, episodeId: 2, hypothesis: 'スパルタの教育制度は現代のチームビルディングのモデル', fact: 'アゴゲと呼ばれる教育制度では集団での困難克服が重視されていた', x: 0.365, y: 0.673, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-15T17:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.6 },
  
  // Episode 3 hypotheses
  { id: 15, episodeId: 3, hypothesis: '言語の発達が人類の認知能力を飛躍的に向上させた', fact: 'ホモサピエンスの脳容量は言語発達とともに急速に増大したことが化石から確認されている', x: 0.716, y: 0.593, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-15T17:30:00.000Z', confidenceScore: 0.9, originalityScore: 0.4 },
  { id: 16, episodeId: 3, hypothesis: '文字の発明が階層社会の形成を促進した', fact: '古代メソポタミアでは文字の発明とともに税務官僚や王族などの特権階級が出現した', x: 0.425, y: 0.511, proposer: 'AI', topic: '社会変化', createdAt: '2024-01-15T18:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 17, episodeId: 3, hypothesis: '口承文化と文字文化の共存が豊かな表現を生む', fact: '古代ギリシャではホメロスの叩事詩が口伝と文字の両方で伝承された', x: 0.467, y: 0.476, proposer: 'AI', topic: '社会変化', createdAt: '2024-01-15T18:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 18, episodeId: 3, hypothesis: 'コミュニケーション手段の多様化が創造性を刺激する', fact: 'ルネサンス期に絵画、彫刻、音楽など多様な芸術形式が発達した', x: 0.705, y: 0.542, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-15T19:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.6 },
  { id: 19, episodeId: 3, hypothesis: '身振り手振りが言語の原初形態だった可能性', fact: '類人猿の研究で、手話を学習した個体が音声言語よりも高度なコミュニケーションを行えた', x: 0.774, y: 0.571, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-15T19:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 20, episodeId: 3, hypothesis: '共感能力の発達がコミュニケーションの基盤を築いた', fact: 'ミラーニューロンの発見により、他者の行動を理解する脳機能が明らかになった', x: 0.744, y: 0.585, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-15T20:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 21, episodeId: 3, hypothesis: '音楽と言語は共通の進化的起源を持つ', fact: '人類の赤ちゃんは言語よりも先に音楽のリズムやメロディに反応する', x: 0.668, y: 0.612, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-15T20:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  
  // Episode 4 hypotheses
  { id: 22, episodeId: 4, hypothesis: '印刷技術の普及が宗教改革を後押しした', fact: 'グーテンベルクの活版印刷技術によって聖書が安価に大量印刷され、ルターの「95ヶ条の論題」が短期間でヨーロッパ全土に広まった', x: 0.847, y: 0.405, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-15T21:00:00.000Z', confidenceScore: 0.9, originalityScore: 0.5 },
  { id: 23, episodeId: 4, hypothesis: 'メディアの形態が思考様式に影響を与える', fact: 'マクルーハンの「メディア理論」によると、文字文化は線形的思考を促進する', x: 0.459, y: 0.272, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-15T21:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 24, episodeId: 4, hypothesis: '活版印刷は知識の民主化をもたらした', fact: '15世紀前は書籍は主に僧侶や貴族のものだったが、印刷技術で一般市民もアクセス可能になった', x: 0.871, y: 0.448, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-15T22:00:00.000Z', confidenceScore: 0.9, originalityScore: 0.4 },
  { id: 25, episodeId: 4, hypothesis: '本の大量生産が標準化された知識体系を作った', fact: '印刷技術により同じ内容の書籍が正確に複製され、知識の統一性が保たれた', x: 0.521, y: 0.431, proposer: 'AI', topic: 'その他', createdAt: '2024-01-15T22:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.6 },
  { id: 26, episodeId: 4, hypothesis: '読書習慣の変化が個人主義的思考を促進した', fact: '中世の音読から黙読への変化により、個人的な精神的体験が可能になった', x: 0.467, y: 0.258, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-15T23:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.8 },
  { id: 27, episodeId: 4, hypothesis: '印刷技術の発達が科学革命を加速させた', fact: 'コペルニクスやガリレオの著作が印刷で広く伝搭され、科学的思考が普及した', x: 0.8, y: 0.386, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-15T23:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.5 },
  
  // Episode 5 hypotheses
  { id: 28, episodeId: 5, hypothesis: '電話の普及が都市化を促進した', fact: '19世紀後半から電話の普及とともに都市部の人口集中が加速した', x: 0.502, y: 0.443, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T00:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.6 },
  { id: 29, episodeId: 5, hypothesis: '長距離通信が国際関係に革命をもたらした', fact: '大西洋横断電信ケーブルにより瞬時の国際通信が可能になった', x: 0.429, y: 0.433, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T00:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.5 },
  { id: 30, episodeId: 5, hypothesis: '電信技術が時間の概念を変えた', fact: '電信により世界標準時の概念が生まれ、時刻の同期が重要になった', x: 0.753, y: 0.409, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T01:00:00.000Z', confidenceScore: 0.9, originalityScore: 0.8 },
  { id: 31, episodeId: 5, hypothesis: 'リアルタイム通信が集合知の形成を可能にした', fact: '電信網により遠隔地の専門家同士が瞬時に情報交換できるようになった', x: 0.537, y: 0.504, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T01:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 32, episodeId: 5, hypothesis: '通信インフラの発達が経済のグローバル化を支えた', fact: '電信により世界各地の市場価格がリアルタイムで共有されるようになった', x: 0.456, y: 0.553, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T02:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.4 },
  { id: 33, episodeId: 5, hypothesis: '音声通信の普及が感情表現の重要性を再認識させた', fact: '電話では声の調子や抑揚が重要な情報伝達手段として注目された', x: 0.53, y: 0.527, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T02:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.7 },
  
  // Episode 6 hypotheses
  { id: 34, episodeId: 6, hypothesis: 'ラジオの普及が大衆文化の基盤を築いた', fact: '関連する事実やデータが存在します', x: 0.783, y: 0.386, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T03:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.6 },
  { id: 35, episodeId: 6, hypothesis: '一方向メディアが権威主義的体制を強化した', fact: '関連する事実やデータが存在します', x: 0.551, y: 0.469, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T03:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.7 },
  { id: 36, episodeId: 6, hypothesis: 'ラジオドラマが現代エンターテインメントの原型', fact: '関連する事実やデータが存在します', x: 0.766, y: 0.36, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T04:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.5 },
  { id: 37, episodeId: 6, hypothesis: '音声メディアが想像力を刺激する効果がある', fact: '関連する事実やデータが存在します', x: 0.511, y: 0.44, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T04:30:00.000Z', confidenceScore: 0.9, originalityScore: 0.8 },
  { id: 38, episodeId: 6, hypothesis: 'ラジオの同時性が共同体意識を醸成した', fact: '関連する事実やデータが存在します', x: 0.838, y: 0.388, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T05:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.6 },
  { id: 39, episodeId: 6, hypothesis: 'パーソナリティの存在がメディアに人格を与えた', fact: '関連する事実やデータが存在します', x: 0.557, y: 0.561, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T05:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 40, episodeId: 6, hypothesis: 'ラジオの普及が標準語の普及を促進した', fact: '関連する事実やデータが存在します', x: 0.839, y: 0.397, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T06:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.4 },
  
  // Episode 7 hypotheses
  { id: 41, episodeId: 7, hypothesis: 'テレビの登場が視覚的思考を発達させた', fact: '関連する事実やデータが存在します', x: 0.831, y: 0.459, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T06:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.6 },
  { id: 42, episodeId: 7, hypothesis: '映像メディアが政治家の選ばれ方を変えた', fact: '関連する事実やデータが存在します', x: 0.452, y: 0.476, proposer: 'AI', topic: '社会変化', createdAt: '2024-01-16T07:00:00.000Z', confidenceScore: 0.9, originalityScore: 0.5 },
  { id: 43, episodeId: 7, hypothesis: 'テレビの普及が家族の会話パターンを変化させた', fact: '関連する事実やデータが存在します', x: 0.77, y: 0.334, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T07:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.7 },
  { id: 44, episodeId: 7, hypothesis: '視覚的情報の増加が注意力の持続時間を短縮させた', fact: '関連する事実やデータが存在します', x: 0.455, y: 0.447, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T08:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.8 },
  { id: 45, episodeId: 7, hypothesis: 'テレビCMが消費文化の形成に決定的役割を果たした', fact: '関連する事実やデータが存在します', x: 0.79, y: 0.425, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T08:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.4 },
  { id: 46, episodeId: 7, hypothesis: '映像技術の発達が現実認識に影響を与えている', fact: '関連する事実やデータが存在します', x: 0.781, y: 0.335, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T09:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.9 },
  
  // Episode 8 hypotheses
  { id: 47, episodeId: 8, hypothesis: 'インターネットが知識の階層構造を破壊した', fact: '関連する事実やデータが存在します', x: 0.762, y: 0.383, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T09:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 48, episodeId: 8, hypothesis: 'ハイパーリンクが非線形思考を促進している', fact: '関連する事実やデータが存在します', x: 0.454, y: 0.357, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-16T10:00:00.000Z', confidenceScore: 0.9, originalityScore: 0.8 },
  { id: 49, episodeId: 8, hypothesis: 'インターネットの普及が専門家の権威を相対化した', fact: '関連する事実やデータが存在します', x: 0.85, y: 0.467, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T10:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.6 },
  { id: 50, episodeId: 8, hypothesis: '双方向性の実現が参加型文化を生み出した', fact: '関連する事実やデータが存在します', x: 0.536, y: 0.536, proposer: 'AI', topic: '社会変化', createdAt: '2024-01-16T11:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.5 },
  { id: 51, episodeId: 8, hypothesis: 'ネットワーク効果が集合知の質を向上させる', fact: '関連する事実やデータが存在します', x: 0.537, y: 0.507, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T11:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.7 },
  { id: 52, episodeId: 8, hypothesis: 'デジタルデバイドが新たな格差を生んでいる', fact: '関連する事実やデータが存在します', x: 0.467, y: 0.536, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T12:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.4 },
  
  // Episode 9 hypotheses
  { id: 53, episodeId: 9, hypothesis: 'SNSが人間関係の質を変化させている', fact: '関連する事実やデータが存在します', x: 0.554, y: 0.502, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T12:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.5 },
  { id: 54, episodeId: 9, hypothesis: 'アルゴリズムがフィルターバブルを作り出している', fact: '関連する事実やデータが存在します', x: 0.536, y: 0.561, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T13:00:00.000Z', confidenceScore: 0.9, originalityScore: 0.6 },
  { id: 55, episodeId: 9, hypothesis: 'ソーシャルメディアが集合的記憶の形成に影響する', fact: '関連する事実やデータが存在します', x: 0.448, y: 0.273, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-16T13:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 56, episodeId: 9, hypothesis: 'いいね機能が承認欲求を強化している', fact: '関連する事実やデータが存在します', x: 0.542, y: 0.532, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T14:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.4 },
  { id: 57, episodeId: 9, hypothesis: 'インフルエンサーが新しい権威の形を作っている', fact: '関連する事実やデータが存在します', x: 0.492, y: 0.49, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T14:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.7 },
  { id: 58, episodeId: 9, hypothesis: 'SNSの普及が短文コミュニケーションを発達させた', fact: '関連する事実やデータが存在します', x: 0.644, y: 0.595, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-16T15:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.3 },
  
  // Episode 10 hypotheses
  { id: 59, episodeId: 10, hypothesis: 'VRは共感能力の向上に寄与する可能性がある', fact: '関連する事実やデータが存在します', x: 0.635, y: 0.148, proposer: 'AI', topic: '仮想現実', createdAt: '2024-01-16T15:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 60, episodeId: 10, hypothesis: '仮想現実が現実認識の基準を変える', fact: '関連する事実やデータが存在します', x: 0.583, y: 0.158, proposer: 'AI', topic: '仮想現実', createdAt: '2024-01-16T16:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 61, episodeId: 10, hypothesis: 'メタバースが新しい社会構造を生み出す', fact: '関連する事実やデータが存在します', x: 0.484, y: 0.494, proposer: 'AI', topic: '社会変化', createdAt: '2024-01-16T16:30:00.000Z', confidenceScore: 0.5, originalityScore: 0.9 },
  { id: 62, episodeId: 10, hypothesis: 'VR技術が教育方法論を根本的に変える', fact: '関連する事実やデータが存在します', x: 0.229, y: 0.647, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-16T17:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 63, episodeId: 10, hypothesis: '没入感の向上が記憶定着率を高める', fact: '関連する事実やデータが存在します', x: 0.388, y: 0.228, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-16T17:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.6 },
  { id: 64, episodeId: 10, hypothesis: 'バーチャル空間での体験が実世界の行動に影響する', fact: '関連する事実やデータが存在します', x: 0.481, y: 0.49, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T18:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.5 },
  
  // Episode 11 hypotheses
  { id: 65, episodeId: 11, hypothesis: 'AIとの対話が人間の思考プロセスを変化させる', fact: '関連する事実やデータが存在します', x: 0.654, y: 0.637, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-16T18:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 66, episodeId: 11, hypothesis: '機械学習が人間の学習方法に示唆を与える', fact: '関連する事実やデータが存在します', x: 0.33, y: 0.75, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-16T19:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 67, episodeId: 11, hypothesis: 'AIアシスタントが認知的負荷を軽減している', fact: '関連する事実やデータが存在します', x: 0.416, y: 0.296, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-16T19:30:00.000Z', confidenceScore: 0.9, originalityScore: 0.5 },
  { id: 68, episodeId: 11, hypothesis: '人工知能の発達が創造性の定義を変える', fact: '関連する事実やデータが存在します', x: 0.902, y: 0.126, proposer: 'AI', topic: '人工知能', createdAt: '2024-01-16T20:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 69, episodeId: 11, hypothesis: 'AIとの協働が新しい問題解決手法を生む', fact: '関連する事実やデータが存在します', x: 0.845, y: 0.188, proposer: 'AI', topic: '人工知能', createdAt: '2024-01-16T20:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.7 },
  { id: 70, episodeId: 11, hypothesis: '自然言語処理の進歩が言語の進化を促進する', fact: '関連する事実やデータが存在します', x: 0.708, y: 0.549, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-16T21:00:00.000Z', confidenceScore: 0.5, originalityScore: 0.8 },
  
  // Episode 12 hypotheses
  { id: 71, episodeId: 12, hypothesis: 'ブロックチェーンが信頼の概念を再定義する', fact: '関連する事実やデータが存在します', x: 0.16, y: 0.062, proposer: 'AI', topic: '先端科学', createdAt: '2024-01-16T21:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 72, episodeId: 12, hypothesis: '分散型システムが権力構造を分散化させる', fact: '関連する事実やデータが存在します', x: 0.437, y: 0.49, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T22:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 73, episodeId: 12, hypothesis: 'スマートコントラクトが法的概念を変化させる', fact: '関連する事実やデータが存在します', x: 0.497, y: 0.447, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T22:30:00.000Z', confidenceScore: 0.5, originalityScore: 0.8 },
  { id: 74, episodeId: 12, hypothesis: '暗号技術の発達がプライバシーの価値を高める', fact: '関連する事実やデータが存在します', x: 0.839, y: 0.43, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-16T23:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.6 },
  { id: 75, episodeId: 12, hypothesis: 'DAOが組織運営の新しいモデルになる', fact: '関連する事実やデータが存在します', x: 0.485, y: 0.546, proposer: 'AI', topic: 'その他', createdAt: '2024-01-16T23:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 76, episodeId: 12, hypothesis: 'Web3が個人のデータ主権を確立する', fact: '関連する事実やデータが存在します', x: 0.47, y: 0.472, proposer: 'AI', topic: 'その他', createdAt: '2024-01-17T00:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.7 },
  
  // Episode 13 hypotheses
  { id: 77, episodeId: 13, hypothesis: '量子コンピューティングが思考の概念を変える', fact: '関連する事実やデータが存在します', x: 0.374, y: 0.291, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-17T00:30:00.000Z', confidenceScore: 0.5, originalityScore: 0.9 },
  { id: 78, episodeId: 13, hypothesis: '量子もつれが新しいコミュニケーション理論を生む', fact: '関連する事実やデータが存在します', x: 0.636, y: 0.666, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-17T01:00:00.000Z', confidenceScore: 0.4, originalityScore: 0.9 },
  { id: 79, episodeId: 13, hypothesis: '量子力学的思考が問題解決アプローチを革新する', fact: '関連する事実やデータが存在します', x: 0.436, y: 0.242, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-17T01:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.8 },
  { id: 80, episodeId: 13, hypothesis: '重ね合わせの概念が多元的思考を促進する', fact: '関連する事実やデータが存在します', x: 0.343, y: 0.237, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-17T02:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 81, episodeId: 13, hypothesis: '量子暗号が完全なプライバシー通信を実現する', fact: '関連する事実やデータが存在します', x: 0.132, y: 0.16, proposer: 'AI', topic: '先端科学', createdAt: '2024-01-17T02:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.6 },
  { id: 82, episodeId: 13, hypothesis: '量子コンピューターが現在の暗号体系を無力化する', fact: '関連する事実やデータが存在します', x: 0.034, y: 0.092, proposer: 'AI', topic: '先端科学', createdAt: '2024-01-17T03:00:00.000Z', confidenceScore: 0.9, originalityScore: 0.5 },
  
  // Episode 14 hypotheses
  { id: 83, episodeId: 14, hypothesis: '宇宙インターネットが地球中心的思考を変える', fact: '関連する事実やデータが存在します', x: 0.766, y: 0.339, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-17T03:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.9 },
  { id: 84, episodeId: 14, hypothesis: '星間通信の遅延が非同期コミュニケーションを発達させる', fact: '関連する事実やデータが存在します', x: 0.738, y: 0.608, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-17T04:00:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 85, episodeId: 14, hypothesis: '宇宙探査が長期的思考を促進する', fact: '関連する事実やデータが存在します', x: 0.443, y: 0.27, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-17T04:30:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
  { id: 86, episodeId: 14, hypothesis: '地球外生命体の発見が宗教観念を変革する', fact: '関連する事実やデータが存在します', x: 0.503, y: 0.459, proposer: 'AI', topic: 'その他', createdAt: '2024-01-17T05:00:00.000Z', confidenceScore: 0.5, originalityScore: 0.9 },
  { id: 87, episodeId: 14, hypothesis: '宇宙植民地が新しい社会実験の場になる', fact: '関連する事実やデータが存在します', x: 0.493, y: 0.503, proposer: 'AI', topic: '社会変化', createdAt: '2024-01-17T05:30:00.000Z', confidenceScore: 0.6, originalityScore: 0.8 },
  { id: 88, episodeId: 14, hypothesis: '宇宙規模の視点が環境問題への意識を変える', fact: '関連する事実やデータが存在します', x: 0.101, y: 0.037, proposer: 'AI', topic: '先端科学', createdAt: '2024-01-17T06:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.6 },
  
  // Episode 15 hypotheses
  { id: 89, episodeId: 15, hypothesis: 'コミュニケーション技術の進歩が人類進化を加速させる', fact: '過去200年間でコミュニケーション速度は指数関数的に向上している', x: 0.711, y: 0.565, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-17T06:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 90, episodeId: 15, hypothesis: '意識のアップロードが個人の概念を変える', fact: 'ブレイン・コンピューター・インターフェースの研究で脳活動をデジタル化する技術が進歩している', x: 0.472, y: 0.429, proposer: 'AI', topic: 'その他', createdAt: '2024-01-17T07:00:00.000Z', confidenceScore: 0.3, originalityScore: 0.9 },
  { id: 91, episodeId: 15, hypothesis: 'シンギュラリティ後は人間とAIの境界が曖昧になる', fact: 'GPTモデルなどの大規模言語モデルが人間と区別できないレベルの会話を行えるようになった', x: 0.853, y: 0.136, proposer: 'AI', topic: '人工知能', createdAt: '2024-01-17T07:30:00.000Z', confidenceScore: 0.5, originalityScore: 0.8 },
  { id: 92, episodeId: 15, hypothesis: 'テレパシー的通信技術が開発される可能性がある', fact: '量子もつれの研究で遠く離れた粒子間で瞬時的な情報伝達が確認されている', x: 0.791, y: 0.396, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-17T08:00:00.000Z', confidenceScore: 0.2, originalityScore: 0.9 },
  { id: 93, episodeId: 15, hypothesis: '未来の通信は感情や記憶を直接伝達する', fact: '脳波を解析して感情や記憶を読み取る技術の研究が進んでいる', x: 0.383, y: 0.281, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-17T08:30:00.000Z', confidenceScore: 0.4, originalityScore: 0.9 },
  { id: 94, episodeId: 15, hypothesis: '技術的特異点が新しい知性の形を生み出す', fact: 'AIの算出能力が指数関数的に向上し、人間を超える知的能力を示し始めている', x: 0.874, y: 0.446, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-17T09:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.8 },
  { id: 95, episodeId: 15, hypothesis: 'コミュニケーションの進化が宇宙規模の意識を形成する', fact: 'インターネットにより人類の集合知が実現し、地球規模の問題解決が可能になった', x: 0.69, y: 0.661, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-17T09:30:00.000Z', confidenceScore: 0.3, originalityScore: 0.9 },
  
  // Additional varied hypotheses
  { id: 96, episodeId: 1, hypothesis: '松陰の「知行合一」思想が現代の実践学習理論の先駆け', fact: '関連する事実やデータが存在します', x: 0.242, y: 0.733, proposer: 'AI', topic: '教育手法', createdAt: '2024-01-17T10:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.6 },
  { id: 97, episodeId: 3, hypothesis: 'メタファーの使用が抽象的思考能力を向上させた', fact: '関連する事実やデータが存在します', x: 0.352, y: 0.327, proposer: 'AI', topic: '認知科学', createdAt: '2024-01-17T10:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.7 },
  { id: 98, episodeId: 7, hypothesis: 'テレビの普及が視覚的記憶力を向上させた', fact: '関連する事実やデータが存在します', x: 0.763, y: 0.428, proposer: 'AI', topic: '技術革新', createdAt: '2024-01-17T11:00:00.000Z', confidenceScore: 0.6, originalityScore: 0.5 },
  { id: 99, episodeId: 10, hypothesis: 'VR空間での社会実験が理想社会のモデルを提供する', fact: '関連する事実やデータが存在します', x: 0.475, y: 0.566, proposer: 'AI', topic: '社会変化', createdAt: '2024-01-17T11:30:00.000Z', confidenceScore: 0.7, originalityScore: 0.8 },
  { id: 100, episodeId: 15, hypothesis: 'コミュニケーション史の研究が未来予測の精度を高める', fact: '関連する事実やデータが存在します', x: 0.641, y: 0.62, proposer: 'AI', topic: 'コミュニケーション', createdAt: '2024-01-17T12:00:00.000Z', confidenceScore: 0.8, originalityScore: 0.7 },
];