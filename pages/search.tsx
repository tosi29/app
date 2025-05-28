import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Search() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the search tab in home page
    router.replace('/?tab=search');
  }, [router]);

  // This component doesn't render anything visible
  return null;
}