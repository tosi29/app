import { NextApiRequest, NextApiResponse } from 'next';

// Define the Comment interface
interface Comment {
  id: number;
  episodeId: number;
  text: string;
  positiveScore: number; // 0 to 1 where 1 is most positive
  opinionScore: number; // 0 to 1 where 1 is pure opinion (vs reaction)
  author: string;
}

// Sample data for comments
const comments: Comment[] = [
  // Episode 1 comments
  { id: 1, episodeId: 1, text: '面白かったです！次回も楽しみにしています。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー1' },
  { id: 2, episodeId: 1, text: 'もう少し技術的な内容があると良かったです。', positiveScore: 0.4, opinionScore: 0.9, author: 'リスナー2' },
  { id: 3, episodeId: 1, text: '初回エピソードとしてとても良い導入でした。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー3' },
  { id: 4, episodeId: 1, text: '声が聞き取りやすくて良かったです。', positiveScore: 0.7, opinionScore: 0.2, author: 'リスナー4' },
  { id: 5, episodeId: 1, text: 'もう少し長い時間だと嬉しいです。', positiveScore: 0.6, opinionScore: 0.8, author: 'リスナー5' },
  { id: 6, episodeId: 1, text: '内容が分かりやすくて助かりました。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー6' },
  { id: 7, episodeId: 1, text: '期待していた通りの内容でした。', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー7' },
  
  // Episode 2 comments
  { id: 8, episodeId: 2, text: 'わかりやすい説明をありがとうございます！', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー8' },
  { id: 9, episodeId: 2, text: 'あまり理解できませんでした...', positiveScore: 0.2, opinionScore: 0.6, author: 'リスナー9' },
  { id: 10, episodeId: 2, text: '実践的な内容で勉強になります。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー10' },
  { id: 11, episodeId: 2, text: '例がもう少しあると良いと思います。', positiveScore: 0.5, opinionScore: 0.7, author: 'リスナー11' },
  { id: 12, episodeId: 2, text: '始め方のコツがよく分かりました。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー12' },
  { id: 13, episodeId: 2, text: '続きが楽しみです！', positiveScore: 0.9, opinionScore: 0.2, author: 'リスナー13' },
  { id: 14, episodeId: 2, text: 'もう少しゆっくり説明してほしいです。', positiveScore: 0.4, opinionScore: 0.8, author: 'リスナー14' },
  
  // Episode 3 comments
  { id: 15, episodeId: 3, text: 'すごく勉強になりました。', positiveScore: 0.7, opinionScore: 0.6, author: 'リスナー15' },
  { id: 16, episodeId: 3, text: '素晴らしい内容でした！', positiveScore: 0.9, opinionScore: 0.2, author: 'リスナー16' },
  { id: 17, episodeId: 3, text: '高度な技術の解説が参考になりました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー17' },
  { id: 18, episodeId: 3, text: '難しすぎて付いていけませんでした。', positiveScore: 0.3, opinionScore: 0.7, author: 'リスナー18' },
  { id: 19, episodeId: 3, text: '実際の使用例があって良かったです。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー19' },
  { id: 20, episodeId: 3, text: 'もっと詳しく知りたいです。', positiveScore: 0.7, opinionScore: 0.8, author: 'リスナー20' },
  { id: 21, episodeId: 3, text: 'とても興味深い内容でした。', positiveScore: 0.9, opinionScore: 0.3, author: 'リスナー21' },
  
  // Episode 4 comments
  { id: 22, episodeId: 4, text: 'ゲストのお話が特に参考になりました！', positiveScore: 0.8, opinionScore: 0.7, author: 'リスナー22' },
  { id: 23, episodeId: 4, text: 'インタビュー形式が新鮮でした。', positiveScore: 0.7, opinionScore: 0.5, author: 'リスナー23' },
  { id: 24, episodeId: 4, text: 'ゲストの経験談が勉強になりました。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー24' },
  { id: 25, episodeId: 4, text: 'もっとゲストの話を聞きたかったです。', positiveScore: 0.6, opinionScore: 0.8, author: 'リスナー25' },
  { id: 26, episodeId: 4, text: '業界の内部事情が知れて良かったです。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー26' },
  { id: 27, episodeId: 4, text: 'ゲストの声が聞き取りづらかったです。', positiveScore: 0.3, opinionScore: 0.7, author: 'リスナー27' },
  
  // Episode 5 comments
  { id: 28, episodeId: 5, text: 'もっと詳しく聞きたかったです。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー28' },
  { id: 29, episodeId: 5, text: 'コミュニティの質問に答えてくれてありがとうございます。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー29' },
  { id: 30, episodeId: 5, text: '私の質問も取り上げてもらえて嬉しいです。', positiveScore: 0.9, opinionScore: 0.6, author: 'リスナー30' },
  { id: 31, episodeId: 5, text: '回答が分かりやすくて助かりました。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー31' },
  { id: 32, episodeId: 5, text: 'もっと多くの質問に答えてほしいです。', positiveScore: 0.6, opinionScore: 0.9, author: 'リスナー32' },
  { id: 33, episodeId: 5, text: 'コミュニティ参加型で楽しかったです。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー33' },
  
  // Episode 6 comments
  { id: 34, episodeId: 6, text: 'データ分析の基礎がよく理解できました。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー34' },
  { id: 35, episodeId: 6, text: '視覚化の部分が特に参考になりました。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー35' },
  { id: 36, episodeId: 6, text: '初心者にも分かりやすい説明でした。', positiveScore: 0.9, opinionScore: 0.3, author: 'リスナー36' },
  { id: 37, episodeId: 6, text: 'もう少し高度な内容も知りたいです。', positiveScore: 0.6, opinionScore: 0.8, author: 'リスナー37' },
  { id: 38, episodeId: 6, text: '実際のデータを使った例が良かったです。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー38' },
  { id: 39, episodeId: 6, text: 'ツールの紹介もありがとうございました。', positiveScore: 0.7, opinionScore: 0.4, author: 'リスナー39' },
  { id: 40, episodeId: 6, text: '次回のエピソードも楽しみです。', positiveScore: 0.8, opinionScore: 0.2, author: 'リスナー40' },
  
  // Episode 7 comments
  { id: 41, episodeId: 7, text: '専門家の議論が勉強になりました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー41' },
  { id: 42, episodeId: 7, text: 'パネルディスカッション形式が良かったです。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー42' },
  { id: 43, episodeId: 7, text: '異なる視点が聞けて有益でした。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー43' },
  { id: 44, episodeId: 7, text: '時間が長すぎたかもしれません。', positiveScore: 0.4, opinionScore: 0.7, author: 'リスナー44' },
  { id: 45, episodeId: 7, text: '業界のトレンドがよく分かりました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー45' },
  { id: 46, episodeId: 7, text: 'もっと具体例があると良かったです。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー46' },
  
  // Episode 8 comments
  { id: 47, episodeId: 8, text: 'フィードバックセッションが有益でした。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー47' },
  { id: 48, episodeId: 8, text: 'ユーザーの声を聞いてくれて嬉しいです。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー48' },
  { id: 49, episodeId: 8, text: '改善点についての議論が参考になりました。', positiveScore: 0.7, opinionScore: 0.7, author: 'リスナー49' },
  { id: 50, episodeId: 8, text: 'もっと頻繁にやってほしいです。', positiveScore: 0.8, opinionScore: 0.8, author: 'リスナー50' },
  { id: 51, episodeId: 8, text: 'コミュニティとの対話が良かったです。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー51' },
  { id: 52, episodeId: 8, text: '次回への期待が高まりました。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー52' },
  
  // Episode 9 comments
  { id: 53, episodeId: 9, text: 'ベストプラクティスが実践的でした。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー53' },
  { id: 54, episodeId: 9, text: '避けるべき落とし穴の説明が役立ちました。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー54' },
  { id: 55, episodeId: 9, text: '経験に基づいたアドバイスが良かったです。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー55' },
  { id: 56, episodeId: 9, text: 'もっと具体的な事例が欲しかったです。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー56' },
  { id: 57, episodeId: 9, text: 'チェックリストが便利でした。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー57' },
  { id: 58, episodeId: 9, text: '実務ですぐに活用できそうです。', positiveScore: 0.8, opinionScore: 0.7, author: 'リスナー58' },
  
  // Episode 10 comments
  { id: 59, episodeId: 10, text: '10回記念おめでとうございます！', positiveScore: 0.9, opinionScore: 0.2, author: 'リスナー59' },
  { id: 60, episodeId: 10, text: '特別ゲストの話が印象的でした。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー60' },
  { id: 61, episodeId: 10, text: '振り返りの部分が感動的でした。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー61' },
  { id: 62, episodeId: 10, text: 'これまでの成長が感じられました。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー62' },
  { id: 63, episodeId: 10, text: '長時間でしたが最後まで楽しめました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー63' },
  { id: 64, episodeId: 10, text: '次の10回も期待しています。', positiveScore: 0.9, opinionScore: 0.3, author: 'リスナー64' },
  
  // Episode 11 comments
  { id: 65, episodeId: 11, text: 'ライブQ&Aが楽しかったです。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー65' },
  { id: 66, episodeId: 11, text: 'リアルタイムでの質問ができて良かったです。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー66' },
  { id: 67, episodeId: 11, text: 'インタラクティブな形式が新鮮でした。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー67' },
  { id: 68, episodeId: 11, text: '時間が足りなかったです。', positiveScore: 0.4, opinionScore: 0.8, author: 'リスナー68' },
  { id: 69, episodeId: 11, text: 'また同様の企画をやってほしいです。', positiveScore: 0.8, opinionScore: 0.8, author: 'リスナー69' },
  { id: 70, episodeId: 11, text: 'コミュニティの活発さを感じました。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー70' },
  
  // Episode 12 comments
  { id: 71, episodeId: 12, text: '高度な実装戦略が勉強になりました。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー71' },
  { id: 72, episodeId: 12, text: '実世界での応用例が参考になりました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー72' },
  { id: 73, episodeId: 12, text: '技術的な深さが素晴らしかったです。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー73' },
  { id: 74, episodeId: 12, text: '少し難しすぎました。', positiveScore: 0.3, opinionScore: 0.7, author: 'リスナー74' },
  { id: 75, episodeId: 12, text: 'パフォーマンスの話が興味深かったです。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー75' },
  { id: 76, episodeId: 12, text: 'コードサンプルがあると良かったです。', positiveScore: 0.6, opinionScore: 0.8, author: 'リスナー76' },
  
  // Episode 13 comments
  { id: 77, episodeId: 13, text: 'イノベーションの話が刺激的でした。', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー77' },
  { id: 78, episodeId: 13, text: '新しいアプローチが学べて良かったです。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー78' },
  { id: 79, episodeId: 13, text: 'ゲストイノベーターの視点が面白かったです。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー79' },
  { id: 80, episodeId: 13, text: '創造性を刺激される内容でした。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー80' },
  { id: 81, episodeId: 13, text: 'もっと技術的な詳細が欲しかったです。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー81' },
  { id: 82, episodeId: 13, text: 'イノベーションのプロセスが参考になりました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー82' },
  
  // Episode 14 comments
  { id: 83, episodeId: 14, text: 'コミュニティの成功事例が励みになりました。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー83' },
  { id: 84, episodeId: 14, text: '他の人の成果を聞けて良かったです。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー84' },
  { id: 85, episodeId: 14, text: 'モチベーションが上がりました。', positiveScore: 0.9, opinionScore: 0.3, author: 'リスナー85' },
  { id: 86, episodeId: 14, text: '自分も頑張ろうと思いました。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー86' },
  { id: 87, episodeId: 14, text: '具体的な成果の話が印象的でした。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー87' },
  { id: 88, episodeId: 14, text: 'コミュニティの絆を感じました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー88' },
  
  // Episode 15 comments
  { id: 89, episodeId: 15, text: '未来のトレンド予測が興味深かったです。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー89' },
  { id: 90, episodeId: 15, text: '業界の将来について考えさせられました。', positiveScore: 0.8, opinionScore: 0.7, author: 'リスナー90' },
  { id: 91, episodeId: 15, text: '予測の根拠が説得力がありました。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー91' },
  { id: 92, episodeId: 15, text: '今後の学習方向性が見えました。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー92' },
  { id: 93, episodeId: 15, text: 'もう少し具体的な予測が欲しかったです。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー93' },
  { id: 94, episodeId: 15, text: '刺激的な内容で楽しめました。', positiveScore: 0.9, opinionScore: 0.3, author: 'リスナー94' },
  { id: 95, episodeId: 15, text: 'シリーズ全体を通して勉強になりました。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー95' },
  
  // Additional varied comments
  { id: 96, episodeId: 1, text: '音質がとても良くて聞きやすかったです。', positiveScore: 0.8, opinionScore: 0.2, author: 'リスナー96' },
  { id: 97, episodeId: 3, text: '専門用語の説明が丁寧で助かりました。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー97' },
  { id: 98, episodeId: 7, text: 'ディスカッションの進行が上手でした。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー98' },
  { id: 99, episodeId: 10, text: '記念回にふさわしい豪華な内容でした。', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー99' },
  { id: 100, episodeId: 15, text: '最終回として素晴らしいまとめでした。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー100' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Comment[]>
) {
  const { episodeId } = req.query;
  
  // If episodeId is provided, filter comments for that episode
  if (episodeId && !Array.isArray(episodeId)) {
    const filteredComments = comments.filter(
      comment => comment.episodeId === parseInt(episodeId, 10)
    );
    return res.status(200).json(filteredComments);
  }
  
  // Otherwise return all comments
  res.status(200).json(comments);
}