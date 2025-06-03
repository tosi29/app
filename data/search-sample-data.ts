import { RetrievalResult } from '../types/search';

// Helper function to convert MM:SS duration to seconds
function durationToSeconds(duration: string): number {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
}

// Sample data in the new format
export const sampleRetrievalResults: RetrievalResult[] = [
  {
    content: {
      text: '吉田松陰シリーズ: 吉田松陰が脱藩した衝撃の理由！',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '1',
      series_name: '吉田松陰',
      series_number: '1',
      title: '吉田松陰が脱藩した衝撃の理由！',
      duration: durationToSeconds('15:56'),
      youtube_video_id: 'VMpjzAA6hNI',
      spotify_episode_id: '3SqhovshNoPdYFhT2LGR6i',
      likes_count: 245
    },
    score: 0.95
  },
  {
    content: {
      text: '吉田松陰シリーズ: 吉田松陰の「感化力」がすごい！',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '2',
      series_name: '吉田松陰',
      series_number: '2',
      title: '吉田松陰の「感化力」がすごい！',
      duration: durationToSeconds('12:51'),
      youtube_video_id: '2xDAjrniULM',
      spotify_episode_id: '2Y7WBA51rsihKPeQR304qP',
      likes_count: 312
    },
    score: 0.93
  },
  {
    content: {
      text: '吉田松陰シリーズ: 黒船が来たときに吉田松陰がとった「とんでもない行動」とは！？',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '3',
      series_name: '吉田松陰',
      series_number: '3',
      title: '黒船が来たときに吉田松陰がとった「とんでもない行動」とは！？',
      duration: durationToSeconds('13:52'),
      youtube_video_id: 'Mzr3fk1ExGA',
      spotify_episode_id: '5jhl7KJu2QDZgPMDqxtMzV'
    },
    score: 0.91
  },
  {
    content: {
      text: '吉田松陰シリーズ: もし吉田松陰に人生相談ができたら・・・？',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '4',
      series_name: '吉田松陰',
      series_number: '4',
      title: 'もし吉田松陰に人生相談ができたら・・・？',
      duration: durationToSeconds('16:21'),
      youtube_video_id: '2cJi5iIOCyU',
      spotify_episode_id: '2RgEvZnXOrP0zEePtnLCvN'
    },
    score: 0.89
  },
  {
    content: {
      text: 'スパルタシリーズ: スパルタ人の壮絶な一生！まさにスパルタ教育',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '5',
      series_name: 'スパルタ',
      series_number: '1',
      title: 'スパルタ人の壮絶な一生！まさにスパルタ教育',
      duration: durationToSeconds('21:39'),
      youtube_video_id: 'J_kARj-FuPw',
      spotify_episode_id: '6TgxYkg97TTXVev9I4GYxK',
      likes_count: 421
    },
    score: 0.88
  },
  {
    content: {
      text: 'スパルタシリーズ: スパルタでイケてる男の基準！',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '6',
      series_name: 'スパルタ',
      series_number: '2',
      title: 'スパルタでイケてる男の基準！',
      duration: durationToSeconds('8:56'),
      youtube_video_id: 'X0_q7MB3jaQ',
      spotify_episode_id: '3QczCyKWjJeoKRMSxWLG3X'
    },
    score: 0.86
  },
  {
    content: {
      text: 'スパルタシリーズ: スパルタ人の性事情！戦争に勝つためのスパルタ式肉欲道',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '7',
      series_name: 'スパルタ',
      series_number: '3',
      title: 'スパルタ人の性事情！戦争に勝つためのスパルタ式肉欲道',
      duration: durationToSeconds('18:39'),
      youtube_video_id: 'Pkqx0O-sv4Y',
      spotify_episode_id: '5SH0KXiFyyilqdTbSvT2QG'
    },
    score: 0.84
  },
  {
    content: {
      text: 'スパルタシリーズ: スパルタ人のグルメ！ギリシャいちマズイ飯、いかがですか？',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '8',
      series_name: 'スパルタ',
      series_number: '4',
      title: 'スパルタ人のグルメ！ギリシャいちマズイ飯、いかがですか？',
      duration: durationToSeconds('5:09'),
      youtube_video_id: 'kjenu0OuI2o',
      spotify_episode_id: '73j4TNFb4JXMeHAMNEiKDI'
    },
    score: 0.82
  },
  {
    content: {
      text: 'スパルタシリーズ: スパルタとアテネを比較して考える！脳筋VS頭脳、勝つのはどっち？',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '9',
      series_name: 'スパルタ',
      series_number: '5',
      title: 'スパルタとアテネを比較して考える！脳筋VS頭脳、勝つのはどっち？',
      duration: durationToSeconds('17:49'),
      youtube_video_id: '2kPwhNmKUXM',
      spotify_episode_id: '5u4DpzSINLMa4jHwCqGiyX'
    },
    score: 0.80
  },
  {
    content: {
      text: 'スパルタシリーズ: アテネはどうすればスパルタに勝てたのか？頭脳が脳筋に負ける時',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '10',
      series_name: 'スパルタ',
      series_number: '6',
      title: 'アテネはどうすればスパルタに勝てたのか？頭脳が脳筋に負ける時',
      duration: durationToSeconds('11:42'),
      youtube_video_id: 'eN0sIq332OU',
      spotify_episode_id: '1cbt8XcdV5p8P4x9J9bMsQ',
      likes_count: 189
    },
    score: 0.78
  },
  {
    content: {
      text: 'スパルタシリーズ: 草食系男子がスパルタ漢にお悩み相談するとしたら？',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '11',
      series_name: 'スパルタ',
      series_number: '7',
      title: '草食系男子がスパルタ漢にお悩み相談するとしたら？',
      duration: durationToSeconds('12:48'),
      youtube_video_id: 'Y88fPSzdcYA',
      spotify_episode_id: '6tO5pCxTSv8XmAX7F3BzRo'
    },
    score: 0.76
  },
  {
    content: {
      text: '人類のコミュニケーション史シリーズ: インターネットの本当の凄さ ― 人類のコミュニケーション史',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '12',
      series_name: '人類のコミュニケーション史',
      series_number: '1',
      title: 'インターネットの本当の凄さ ― 人類のコミュニケーション史',
      duration: durationToSeconds('13:36'),
      youtube_video_id: 'Opb5REyVsNk',
      spotify_episode_id: '5Fq3DFgW7KEKJuZ0UTUIUN'
    },
    score: 0.74
  },
  {
    content: {
      text: '人類のコミュニケーション史シリーズ: 文字、爆誕。ー 人類のコミュニケーション史',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '13',
      series_name: '人類のコミュニケーション史',
      series_number: '2',
      title: '文字、爆誕。ー 人類のコミュニケーション史',
      duration: durationToSeconds('14:11'),
      youtube_video_id: '6vSclc0N5Ic',
      spotify_episode_id: '6POSde1JgN7ZzlXNSowcRb'
    },
    score: 0.72
  },
  {
    content: {
      text: '人類のコミュニケーション史シリーズ: 炎上の元祖！活版印刷 ― 人類のコミュニケーション史',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '14',
      series_name: '人類のコミュニケーション史',
      series_number: '3',
      title: '炎上の元祖！活版印刷 ― 人類のコミュニケーション史',
      duration: durationToSeconds('12:55'),
      youtube_video_id: 'FWwpeRyhHe4',
      spotify_episode_id: '0lmLznEl2QEVcV2UnVA31V'
    },
    score: 0.70
  },
  {
    content: {
      text: '人類のコミュニケーション史シリーズ: マスメディアの誕生と電気通信 ー 人類のコミュニケーション史',
      type: 'TEXT'
    },
    metadata: {
      episode_id: '15',
      series_name: '人類のコミュニケーション史',
      series_number: '4',
      title: 'マスメディアの誕生と電気通信 ー 人類のコミュニケーション史',
      duration: durationToSeconds('16:35'),
      youtube_video_id: 'EC_g2ReW-r4',
      spotify_episode_id: '4quyVSN2mBwCLrAqMsTEDB'
    },
    score: 0.68
  }
];