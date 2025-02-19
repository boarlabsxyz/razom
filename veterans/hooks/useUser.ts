import { useQuery } from '@apollo/client';
import { CURRENT_USER_QUERY } from 'constants/graphql';

export function useUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return { user: data?.authenticatedItem, loading, error };
}
