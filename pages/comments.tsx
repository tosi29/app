import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Comments() {
  const router = useRouter();
  const { episodeId } = router.query;

  useEffect(() => {
    // Redirect to the comments tab in home page
    if (typeof episodeId === 'string') {
      router.replace(`/?tab=comments&episodeId=${episodeId}`);
    } else {
      router.replace('/?tab=comments');
    }
  }, [episodeId, router]);

  // This component doesn't render anything visible
  return null;
}