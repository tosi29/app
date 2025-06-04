import { NextApiRequest, NextApiResponse } from 'next';

// Define the PastBroadcast interface
interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  series: string;
  duration: string;
  url: string;
  youtube_video_id: string;
  spotify_episode_id: string;
  likeCount?: number;
}

// Sample data for past broadcasts
const pastBroadcasts: PastBroadcast[] = [
  { id: 1, date: '2018-11-29', title: '吉田松陰が脱藩した衝撃の理由！', excerpt: '吉田松陰シリーズ: 吉田松陰が脱藩した衝撃の理由！', series: '吉田松陰', duration: '15:56', url: 'https://www.youtube.com/watch?v=VMpjzAA6hNI', youtube_video_id: 'VMpjzAA6hNI', spotify_episode_id: '3SqhovshNoPdYFhT2LGR6i', likeCount: 1247 },
  { id: 2, date: '2019-01-23', title: '吉田松陰の「感化力」がすごい！', excerpt: '吉田松陰シリーズ: 吉田松陰の「感化力」がすごい！', series: '吉田松陰', duration: '12:51', url: 'https://www.youtube.com/watch?v=2xDAjrniULM', youtube_video_id: '2xDAjrniULM', spotify_episode_id: '2Y7WBA51rsihKPeQR304qP', likeCount: 856 },
  { id: 3, date: '2019-01-23', title: '黒船が来たときに吉田松陰がとった「とんでもない行動」とは！？', excerpt: '吉田松陰シリーズ: 黒船が来たときに吉田松陰がとった「とんでもない行動」とは！？', series: '吉田松陰', duration: '13:52', url: 'https://www.youtube.com/watch?v=Mzr3fk1ExGA', youtube_video_id: 'Mzr3fk1ExGA', spotify_episode_id: '5jhl7KJu2QDZgPMDqxtMzV' },
  { id: 4, date: '2019-01-23', title: 'もし吉田松陰に人生相談ができたら・・・？', excerpt: '吉田松陰シリーズ: もし吉田松陰に人生相談ができたら・・・？', series: '吉田松陰', duration: '16:21', url: 'https://www.youtube.com/watch?v=2cJi5iIOCyU', youtube_video_id: '2cJi5iIOCyU', spotify_episode_id: '2RgEvZnXOrP0zEePtnLCvN', likeCount: 432 },
  { id: 5, date: '2019-01-23', title: 'スパルタ人の壮絶な一生！まさにスパルタ教育', excerpt: 'スパルタシリーズ: スパルタ人の壮絶な一生！まさにスパルタ教育', series: 'スパルタ', duration: '21:39', url: 'https://www.youtube.com/watch?v=J_kARj-FuPw', youtube_video_id: 'J_kARj-FuPw', spotify_episode_id: '6TgxYkg97TTXVev9I4GYxK', likeCount: 2103 },
  { id: 6, date: '2019-01-23', title: 'スパルタでイケてる男の基準！', excerpt: 'スパルタシリーズ: スパルタでイケてる男の基準！', series: 'スパルタ', duration: '8:56', url: 'https://www.youtube.com/watch?v=X0_q7MB3jaQ', youtube_video_id: 'X0_q7MB3jaQ', spotify_episode_id: '3QczCyKWjJeoKRMSxWLG3X' },
  { id: 7, date: '2019-01-23', title: 'スパルタ人の性事情！戦争に勝つためのスパルタ式肉欲道', excerpt: 'スパルタシリーズ: スパルタ人の性事情！戦争に勝つためのスパルタ式肉欲道', series: 'スパルタ', duration: '18:39', url: 'https://www.youtube.com/watch?v=Pkqx0O-sv4Y', youtube_video_id: 'Pkqx0O-sv4Y', spotify_episode_id: '5SH0KXiFyyilqdTbSvT2QG', likeCount: 1876 },
  { id: 8, date: '2019-01-23', title: 'スパルタ人のグルメ！ギリシャいちマズイ飯、いかがですか？', excerpt: 'スパルタシリーズ: スパルタ人のグルメ！ギリシャいちマズイ飯、いかがですか？', series: 'スパルタ', duration: '5:09', url: 'https://www.youtube.com/watch?v=kjenu0OuI2o', youtube_video_id: 'kjenu0OuI2o', spotify_episode_id: '73j4TNFb4JXMeHAMNEiKDI' },
  { id: 9, date: '2019-01-23', title: 'スパルタとアテネを比較して考える！脳筋VS頭脳、勝つのはどっち？', excerpt: 'スパルタシリーズ: スパルタとアテネを比較して考える！脳筋VS頭脳、勝つのはどっち？', series: 'スパルタ', duration: '17:49', url: 'https://www.youtube.com/watch?v=2kPwhNmKUXM', youtube_video_id: '2kPwhNmKUXM', spotify_episode_id: '5u4DpzSINLMa4jHwCqGiyX', likeCount: 967 },
  { id: 10, date: '2019-01-23', title: 'アテネはどうすればスパルタに勝てたのか？頭脳が脳筋に負ける時', excerpt: 'スパルタシリーズ: アテネはどうすればスパルタに勝てたのか？頭脳が脳筋に負ける時', series: 'スパルタ', duration: '11:42', url: 'https://www.youtube.com/watch?v=eN0sIq332OU', youtube_video_id: 'eN0sIq332OU', spotify_episode_id: '1cbt8XcdV5p8P4x9J9bMsQ' },
  { id: 11, date: '2019-01-23', title: '草食系男子がスパルタ漢にお悩み相談するとしたら？', excerpt: 'スパルタシリーズ: 草食系男子がスパルタ漢にお悩み相談するとしたら？', series: 'スパルタ', duration: '12:48', url: 'https://www.youtube.com/watch?v=Y88fPSzdcYA', youtube_video_id: 'Y88fPSzdcYA', spotify_episode_id: '6tO5pCxTSv8XmAX7F3BzRo', likeCount: 743 },
  { id: 12, date: '2019-02-07', title: 'インターネットの本当の凄さ ― 人類のコミュニケーション史', excerpt: '人類のコミュニケーション史シリーズ: インターネットの本当の凄さ ― 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '13:36', url: 'https://www.youtube.com/watch?v=Opb5REyVsNk', youtube_video_id: 'Opb5REyVsNk', spotify_episode_id: '5Fq3DFgW7KEKJuZ0UTUIUN' },
  { id: 13, date: '2019-02-14', title: '文字、爆誕。ー 人類のコミュニケーション史', excerpt: '人類のコミュニケーション史シリーズ: 文字、爆誕。ー 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '14:11', url: 'https://www.youtube.com/watch?v=6vSclc0N5Ic', youtube_video_id: '6vSclc0N5Ic', spotify_episode_id: '6POSde1JgN7ZzlXNSowcRb', likeCount: 1354 },
  { id: 14, date: '2019-02-21', title: '炎上の元祖！活版印刷 ― 人類のコミュニケーション史', excerpt: '人類のコミュニケーション史シリーズ: 炎上の元祖！活版印刷 ― 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '12:55', url: 'https://www.youtube.com/watch?v=FWwpeRyhHe4', youtube_video_id: 'FWwpeRyhHe4', spotify_episode_id: '0lmLznEl2QEVcV2UnVA31V' },
  { id: 15, date: '2019-03-01', title: 'マスメディアの誕生と電気通信 ー 人類のコミュニケーション史', excerpt: '人類のコミュニケーション史シリーズ: マスメディアの誕生と電気通信 ー 人類のコミュニケーション史', series: '人類のコミュニケーション史', duration: '16:35', url: 'https://www.youtube.com/watch?v=EC_g2ReW-r4', youtube_video_id: 'EC_g2ReW-r4', spotify_episode_id: '4quyVSN2mBwCLrAqMsTEDB', likeCount: 892 },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Return all broadcasts
  res.status(200).json(pastBroadcasts);
}