import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminSuspendDisciplineUser, adminUnSuspendDisciplineUser, getApiPopuplatedUserById, getApiUserById, getApiUsers } from '../apiRoutes';
import { toast } from 'react-toastify';
// import { getApiUserById, getApiUsers } from '../../store-redux/api/apiRoutes';


/***1) Admin get all users */
export default function useOurPlatformUsers() {
  return useQuery(['__our_users'], getApiUsers);
}



/***2) Admin get single User Details */
export function useSingleUser(userId) {
  return useQuery(['__our_userById', userId], () => getApiUserById(userId), {
    enabled: Boolean(userId),
    staleTime: 2000,
  });
}

/***3) Admin get poplulated single User Details */
export function usePopulatedSingleUser(userId) {
  return useQuery(['__our_populatedUserBId', userId], () => getApiPopuplatedUserById(userId), {
    enabled: Boolean(userId),
    staleTime: 2000,
  });
}

/**** 4) Admin Disciplinary: Suspend existing  User  */
export function useAdminSuspendUserMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminSuspendDisciplineUser, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        toast.success(`${data?.data?.message ? data?.data?.message : "User suspended successfully!!"}`,{
          position: "top-left"
        });
        queryClient.invalidateQueries('__our_populatedUserBId');
        queryClient.refetchQueries('__our_populatedUserBId', { force: true });
      }
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}


/**** 5) Admin Disciplinary: Un-Suspend existing user  */
export function useAdminUnSuspendUserMutation() {
  const queryClient = useQueryClient();

  return useMutation(adminUnSuspendDisciplineUser, {
    onSuccess: (data) => {
     if(data?.data?.success){
      toast.success(`${data?.data?.message ? data?.data?.message : "Suspension lifted successfully!!"}`,{
        position: "top-left"
      });
      queryClient.invalidateQueries('__our_populatedUserBId');
      queryClient.refetchQueries('__our_populatedUserBId', { force: true });

     }
    },
    onError: (err) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    },
  });
}
