import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PastBroadcasts() {
  const router = useRouter();
  const { tab, episodeId } = router.query;

  useEffect(() => {
    // Redirect to the home page with the same parameters
    const query: Record<string, string | string[]> = {};
    if (tab) query['tab'] = tab;
    if (episodeId) query['episodeId'] = episodeId;

    router.replace({
      pathname: '/',
      query,
    });
  }, [tab, episodeId, router]);

  // This component doesn't render anything visible
  return null;
}
