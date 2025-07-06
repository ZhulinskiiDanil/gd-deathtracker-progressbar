import { useQuery } from '@tanstack/react-query';
import { getDemonList } from '../api/getDemonList';

export function useDemonlistQuery() {
  const response = useQuery({
    queryKey: ['demonlist'],
    queryFn: getDemonList,
    initialData: [],
  });

  return response;
}
