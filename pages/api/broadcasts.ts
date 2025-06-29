import { NextApiRequest, NextApiResponse } from 'next';
import { PastBroadcast, ExternalEpisode, ExternalApiResponse } from '../../types/broadcast';

// Spotify URLからエピソードIDを抽出する関数
function extractSpotifyEpisodeId(spotifyUrl: string): string {
  const match = spotifyUrl.match(/episode\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
}


// 外部APIデータをPastBroadcast型に変換する関数
function convertExternalEpisodeToPastBroadcast(episode: ExternalEpisode): PastBroadcast {
  return {
    id: parseInt(episode.id),
    date: '2024-01-01', // デフォルト日付（実際のAPIにdateがあれば使用）
    title: episode.title,
    series: episode.series_name,
    duration: '15:00', // デフォルト時間（実際のAPIにdurationがあれば使用）
    url: episode.url.youtube_url,
    youtube_video_id: episode.youtube_id,
    spotify_episode_id: extractSpotifyEpisodeId(episode.url.spotify_url),
  };
}

// 外部APIから配信一覧を取得する関数
async function fetchExternalBroadcasts(): Promise<PastBroadcast[]> {
  try {
    // TODO: 実際の外部APIのURLに置き換える
    const API_URL = process.env.EXTERNAL_BROADCASTS_API_URL || 'https://api.example.com/broadcasts';
    const API_TIMEOUT = 5000; // 5秒タイムアウト
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data: ExternalApiResponse = await response.json();
    
    // データ形式の検証
    if (!data.episodes || !Array.isArray(data.episodes)) {
      throw new Error('Invalid API response format: episodes array not found');
    }
    
    // 外部APIデータをPastBroadcast型に変換（安全な変換）
    return data.episodes
      .filter(episode => episode && episode.id && episode.title && episode.series_name) // 必須フィールドをチェック
      .map(convertExternalEpisodeToPastBroadcast);
      
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('External API request timed out');
      } else {
        console.error('Failed to fetch external broadcasts:', error.message);
      }
    } else {
      console.error('Unknown error occurred while fetching external broadcasts');
    }
    return []; // エラー時は空配列を返す
  }
}

// Sample data for past broadcasts
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
  { id: 15, date: '2019-03-01', title: 'マスメディアの誕生と電気通信 ー 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '16:35', url: 'https://www.youtube.com/watch?v=EC_g2ReW-r4', youtube_video_id: 'EC_g2ReW-r4', spotify_episode_id: '4quyVSN2mBwCLrAqMsTEDB', likeCount: 892 },
];

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  try {
    // 外部APIから配信データを取得
    const externalBroadcasts = await fetchExternalBroadcasts();
    
    // 既存のモックデータと外部データを統合
    // IDの重複を避けるため、外部データのIDを調整
    const adjustedExternalBroadcasts = externalBroadcasts.map((broadcast, index) => ({
      ...broadcast,
      id: pastBroadcasts.length + index + 1, // 既存データの後に続くIDを設定
    }));
    
    const allBroadcasts = [...pastBroadcasts, ...adjustedExternalBroadcasts];
    
    res.status(200).json(allBroadcasts);
  } catch (error) {
    console.error('Error in broadcasts API:', error);
    // エラー時は既存のモックデータのみを返す
    res.status(200).json(pastBroadcasts);
  }
}