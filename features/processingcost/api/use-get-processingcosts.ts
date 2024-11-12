import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { client } from '@/lib/hono';

export const useGetProcessingcosts = () => {
  const query = useQuery({
    queryKey: ['processingcosts'],
    queryFn: async () => {
      const response = await client.api.processingcosts.$get();
      console.log(response, 'response');

      if (!response.ok) {
        throw new Error('Failed to fetch processingcosts');
      }

      const { data } = await response.json();

      return data;
    }
  });

  return query;
};
