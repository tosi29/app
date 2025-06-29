import { NextApiRequest, NextApiResponse } from 'next';
import { PastBroadcast, PopularBroadcast } from '../../types/broadcast';

interface Hypothesis {
  id: number;
  episodeId: number;
  text: string;
  positiveScore: number;
  opinionScore: number;
  author: string;
}


// Import the same data as other APIs
const pastBroadcasts: PastBroadcast[] = [
  { 
    id: 1, 
    date: '2018-11-29', 
    title: '吉田松陰が脱藩した衝撃の理由！', 
    series: '吉田松陰', 
    duration: '15:56', 
    url: 'https://www.youtube.com/watch?v=VMpjzAA6hNI', 
    youtube_video_id: 'VMpjzAA6hNI', 
    spotify_episode_id: '3SqhovshNoPdYFhT2LGR6i', 
    likeCount: 1247,
    summary: {
      overview: '吉田松陰の人生を変えた脱藩体験について、その背景と意義を詳しく解説',
      facts: [
        '1851年、吉田松陰は20歳で長州藩を脱藩した',
        '東北地方を旅行し、各地の防備状況を視察した',
        '脱藩の罪で萩の野山獄に収監された'
      ],
      lessons: [
        '好奇心と学習欲が人生を動かす原動力となる',
        'リスクを取ってでも経験を積むことの重要性',
        '時代の変化を敏感に察知する視点の大切さ'
      ]
    }
  },
  { 
    id: 2, 
    date: '2019-01-23', 
    title: '吉田松陰の「感化力」がすごい！', 
 
    series: '吉田松陰', 
    duration: '12:51', 
    url: 'https://www.youtube.com/watch?v=2xDAjrniULM', 
    youtube_video_id: '2xDAjrniULM', 
    spotify_episode_id: '2Y7WBA51rsihKPeQR304qP', 
    likeCount: 856,
    summary: {
      overview: '吉田松陰が門下生に与えた深い影響力と、その教育手法の特徴を分析',
      facts: [
        '松下村塾で多くの幕末維新の志士を育成した',
        '弟子たちとの個人的な関係を重視した教育を行った',
        '知識だけでなく実践的な行動力を重んじた'
      ],
      lessons: [
        '真の教育とは知識の伝達ではなく人格の感化である',
        '一対一の関係性が持つ教育的な力の大きさ',
        'リーダーは自らの生き方で弟子を導くものである'
      ]
    }
  },
  { id: 3, date: '2019-01-23', title: '黒船が来たときに吉田松陰がとった「とんでもない行動」とは！？', series: '吉田松陰', duration: '13:52', url: 'https://www.youtube.com/watch?v=Mzr3fk1ExGA', youtube_video_id: 'Mzr3fk1ExGA', spotify_episode_id: '5jhl7KJu2QDZgPMDqxtMzV' },
  { id: 4, date: '2019-01-23', title: 'もし吉田松陰に人生相談ができたら・・・？', series: '吉田松陰', duration: '16:21', url: 'https://www.youtube.com/watch?v=2cJi5iIOCyU', youtube_video_id: '2cJi5iIOCyU', spotify_episode_id: '2RgEvZnXOrP0zEePtnLCvN', likeCount: 432 },
  { 
    id: 5, 
    date: '2019-01-23', 
    title: 'スパルタ人の壮絶な一生！まさにスパルタ教育', 
    series: 'スパルタ', 
    duration: '21:39', 
    url: 'https://www.youtube.com/watch?v=J_kARj-FuPw', 
    youtube_video_id: 'J_kARj-FuPw', 
    spotify_episode_id: '6TgxYkg97TTXVev9I4GYxK', 
    likeCount: 2103,
    summary: {
      overview: '古代スパルタの教育制度とスパルタ人の人生について詳しく解説する',
      facts: [
        '7歳から国家による軍事教育が始まった',
        '30歳まで軍営生活を続けなければならなかった',
        '身体的な強さと規律が何よりも重視された'
      ],
      lessons: [
        '厳格な規律と継続的な努力が強い人間を作る',
        '個人よりも集団の利益を優先する重要性',
        '困難な環境こそが真の強さを育む場となる'
      ]
    }
  },
  { id: 6, date: '2019-01-23', title: 'スパルタでイケてる男の基準！', series: 'スパルタ', duration: '8:56', url: 'https://www.youtube.com/watch?v=X0_q7MB3jaQ', youtube_video_id: 'X0_q7MB3jaQ', spotify_episode_id: '3QczCyKWjJeoKRMSxWLG3X' },
  { id: 7, date: '2019-01-23', title: 'スパルタ人の性事情！戦争に勝つためのスパルタ式肉欲道', series: 'スパルタ', duration: '18:39', url: 'https://www.youtube.com/watch?v=Pkqx0O-sv4Y', youtube_video_id: 'Pkqx0O-sv4Y', spotify_episode_id: '5SH0KXiFyyilqdTbSvT2QG', likeCount: 1876 },
  { id: 8, date: '2019-01-23', title: 'スパルタ人のグルメ！ギリシャいちマズイ飯、いかがですか？', series: 'スパルタ', duration: '5:09', url: 'https://www.youtube.com/watch?v=kjenu0OuI2o', youtube_video_id: 'kjenu0OuI2o', spotify_episode_id: '73j4TNFb4JXMeHAMNEiKDI' },
  { id: 9, date: '2019-01-23', title: 'スパルタとアテネを比較して考える！脳筋VS頭脳、勝つのはどっち？', series: 'スパルタ', duration: '17:49', url: 'https://www.youtube.com/watch?v=2kPwhNmKUXM', youtube_video_id: '2kPwhNmKUXM', spotify_episode_id: '5u4DpzSINLMa4jHwCqGiyX', likeCount: 967 },
  { id: 10, date: '2019-01-23', title: 'アテネはどうすればスパルタに勝てたのか？頭脳が脳筋に負ける時', series: 'スパルタ', duration: '11:42', url: 'https://www.youtube.com/watch?v=eN0sIq332OU', youtube_video_id: 'eN0sIq332OU', spotify_episode_id: '1cbt8XcdV5p8P4x9J9bMsQ' },
  { id: 11, date: '2019-01-23', title: '草食系男子がスパルタ漢にお悩み相談するとしたら？', series: 'スパルタ', duration: '12:48', url: 'https://www.youtube.com/watch?v=Y88fPSzdcYA', youtube_video_id: 'Y88fPSzdcYA', spotify_episode_id: '6tO5pCxTSv8XmAX7F3BzRo', likeCount: 743 },
  { id: 12, date: '2019-02-07', title: 'インターネットの本当の凄さ ― 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '13:36', url: 'https://www.youtube.com/watch?v=Opb5REyVsNk', youtube_video_id: 'Opb5REyVsNk', spotify_episode_id: '5Fq3DFgW7KEKJuZ0UTUIUN' },
  { id: 13, date: '2019-02-14', title: '文字、爆誕。ー 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '14:11', url: 'https://www.youtube.com/watch?v=6vSclc0N5Ic', youtube_video_id: '6vSclc0N5Ic', spotify_episode_id: '6POSde1JgN7ZzlXNSowcRb', likeCount: 1354 },
  { id: 14, date: '2019-02-21', title: '炎上の元祖！活版印刷 ― 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '12:55', url: 'https://www.youtube.com/watch?v=FWwpeRyhHe4', youtube_video_id: 'FWwpeRyhHe4', spotify_episode_id: '0lmLznEl2QEVcV2UnVA31V' },
  { id: 15, date: '2019-03-01', title: 'マスメディアの誕生と電気通信 ー 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '16:35', url: 'https://www.YouTube.com/watch?v=EC_g2ReW-r4', youtube_video_id: 'EC_g2ReW-r4', spotify_episode_id: '4quyVSN2mBwCLrAqMsTEDB', likeCount: 892 },
];

// Sample hypotheses data (reduced version for counting)
const hypotheses: Hypothesis[] = [
  // Episode 1 hypotheses (8 hypotheses)
  { id: 1, episodeId: 1, text: 'とても興味深い内容でした。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー1' },
  { id: 2, episodeId: 1, text: '歴史の授業を思い出しました。', positiveScore: 0.7, opinionScore: 0.4, author: 'リスナー2' },
  { id: 3, episodeId: 1, text: '松陰先生の行動力に驚きです。', positiveScore: 0.9, opinionScore: 0.7, author: 'リスナー3' },
  { id: 4, episodeId: 1, text: '理解しやすい説明でした。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー4' },
  { id: 5, episodeId: 1, text: '次回も楽しみにしています。', positiveScore: 0.9, opinionScore: 0.2, author: 'リスナー5' },
  { id: 6, episodeId: 1, text: '音質がもう少し良ければ。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー6' },
  { id: 7, episodeId: 1, text: '資料の説明が詳しくて良かったです。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー7' },
  { id: 96, episodeId: 1, text: '音質がとても良くて聞きやすかったです。', positiveScore: 0.8, opinionScore: 0.2, author: 'リスナー96' },
  
  // Episode 2 hypotheses (6 hypotheses)
  { id: 8, episodeId: 2, text: '感化力について深く考えさせられました。', positiveScore: 0.8, opinionScore: 0.8, author: 'リスナー8' },
  { id: 9, episodeId: 2, text: 'リーダーシップの本質が分かりました。', positiveScore: 0.9, opinionScore: 0.7, author: 'リスナー9' },
  { id: 10, episodeId: 2, text: '現代にも通じる教えですね。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー10' },
  { id: 11, episodeId: 2, text: 'もう少し長い配信でも良かったです。', positiveScore: 0.6, opinionScore: 0.8, author: 'リスナー11' },
  { id: 12, episodeId: 2, text: '具体例がもっとあると良い。', positiveScore: 0.6, opinionScore: 0.7, author: 'リスナー12' },
  { id: 13, episodeId: 2, text: '次のエピソードが待ち遠しいです。', positiveScore: 0.9, opinionScore: 0.3, author: 'リスナー13' },
  
  // Continue with other episodes...
  // Episode 3 hypotheses (4 hypotheses)
  { id: 14, episodeId: 3, text: 'とんでもない行動に驚きました！', positiveScore: 0.9, opinionScore: 0.8, author: 'リスナー14' },
  { id: 15, episodeId: 3, text: '歴史の面白さを再発見。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー15' },
  { id: 16, episodeId: 3, text: '当時の状況がよく分かりました。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー16' },
  { id: 97, episodeId: 3, text: '専門用語の説明が丁寧で助かりました。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー97' },
  
  // Episode 5 hypotheses (12 hypotheses) - Most popular episode
  { id: 17, episodeId: 5, text: 'スパルタ教育の厳しさに驚愕！', positiveScore: 0.9, opinionScore: 0.8, author: 'リスナー17' },
  { id: 18, episodeId: 5, text: '現代の教育と比較すると面白い。', positiveScore: 0.8, opinionScore: 0.7, author: 'リスナー18' },
  { id: 19, episodeId: 5, text: '21分があっという間でした。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー19' },
  { id: 20, episodeId: 5, text: '壮絶すぎる人生ですね。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー20' },
  { id: 21, episodeId: 5, text: 'スパルタに生まれなくて良かった。', positiveScore: 0.7, opinionScore: 0.8, author: 'リスナー21' },
  { id: 22, episodeId: 5, text: '古代の軍事制度が興味深い。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー22' },
  { id: 23, episodeId: 5, text: '続編も是非お願いします。', positiveScore: 0.9, opinionScore: 0.3, author: 'リスナー23' },
  { id: 24, episodeId: 5, text: '資料の解説が分かりやすかった。', positiveScore: 0.8, opinionScore: 0.4, author: 'リスナー24' },
  { id: 25, episodeId: 5, text: '声の抑揚がとても良い。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー25' },
  { id: 26, episodeId: 5, text: 'まさにスパルタという感じ。', positiveScore: 0.8, opinionScore: 0.5, author: 'リスナー26' },
  { id: 27, episodeId: 5, text: '教育制度の違いに驚き。', positiveScore: 0.8, opinionScore: 0.6, author: 'リスナー27' },
  { id: 28, episodeId: 5, text: '古代ギリシャの魅力を感じます。', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー28' },
  
  // Add more hypotheses for other episodes...
  { id: 29, episodeId: 7, text: 'スパルタの性事情、興味深いです。', positiveScore: 0.8, opinionScore: 0.7, author: 'リスナー29' },
  { id: 98, episodeId: 7, text: 'ディスカッションの進行が上手でした。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー98' },
  
  { id: 99, episodeId: 10, text: '記念回にふさわしい豪華な内容でした。', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー99' },
  
  { id: 100, episodeId: 15, text: '最終回として素晴らしいまとめでした。', positiveScore: 0.9, opinionScore: 0.4, author: 'リスナー100' },
];

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<PopularBroadcast[]>
) {
  // Count hypotheses for each episode
  const hypothesisCounts: Record<number, number> = {};
  hypotheses.forEach(hypothesis => {
    hypothesisCounts[hypothesis.episodeId] = (hypothesisCounts[hypothesis.episodeId] || 0) + 1;
  });
  
  // Create popular broadcasts data
  const popularBroadcasts: PopularBroadcast[] = pastBroadcasts.map(broadcast => {
    const hypothesisCount = hypothesisCounts[broadcast.id] || 0;
    // Calculate a view count based on likes and hypotheses (simulated data)
    const viewCount = (broadcast.likeCount || 0) * 10 + hypothesisCount * 5;
    
    return {
      ...broadcast,
      hypothesisCount,
      viewCount
    };
  });
  
  res.status(200).json(popularBroadcasts);
}