import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

export const useGetPaymentterm = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['paymentterm', { id }],
    queryFn: async () => {
      const response = await client.api.paymentterms[':id'].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch paymentterm');
      }

      const { data } = await response.json();
      return data;
    }
  });

  return query;
};