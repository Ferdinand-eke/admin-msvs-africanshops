import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getApiUserById, getApiUsers } from '../../store-redux/api/apiRoutes';

export default function useOurPlatformUsers() {
  return useQuery(['__our_users'], getApiUsers);
}

//Admin get single User Details
export function useSingleUser(userId) {
  return useQuery(['__our_users', userId], () => getApiUserById(userId), {
    enabled: Boolean(userId),
    staleTime: 2000,
  });
}
