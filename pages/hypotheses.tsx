import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Hypotheses() {
  const router = useRouter();
  const { episodeId } = router.query;

  useEffect(() => {
    // Redirect to the hypotheses tab in home page
    if (typeof episodeId === 'string') {
      router.replace(`/?tab=hypotheses&episodeId=${episodeId}`);
    } else {
      router.replace('/?tab=hypotheses');
    }
  }, [episodeId, router]);

  // This component doesn't render anything visible
  return null;
}