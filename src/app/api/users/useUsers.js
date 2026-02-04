import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createErrorHandler } from '../utils/errorHandler';
import {
	adminBlockDisciplineUser,
	adminSuspendDisciplineUser,
	adminUnBlockDisciplineUser,
	adminUnSuspendDisciplineUser,
	getApiPopuplatedUserById,
	getApiUserById,
	getApiUsers,
	updateApiUserById
} from '../apiRoutes';

/** *1) Admin get all users */
export default function useOurPlatformUsers() {
	return useQuery(['__our_users'], getApiUsers);
}

/** *2) Admin get single User Details */
export function useSingleUser(userId) {
	if (!userId || userId === 'new') {
		return '';
	}

	return useQuery(['__our_userById', userId], () => getApiUserById(userId), {
		enabled: Boolean(userId),
		staleTime: 2000
	});
}

/** *3) Admin get poplulated single User Details */
export function usePopulatedSingleUser(userId) {
	if (!userId || userId === 'new') {
		return '';
	}

	return useQuery(['__our_populatedUserBId', userId], () => getApiPopuplatedUserById(userId), {
		enabled: Boolean(userId),
		staleTime: 2000
	});
}

/** ** 4) Admin Disciplinary: Suspend existing  User  */
export function useAdminSuspendUserMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminSuspendDisciplineUser, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'User suspended successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__our_populatedUserBId');
				queryClient.refetchQueries('__our_populatedUserBId', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to suspend user' })
	});
}

/** ** 5) Admin Disciplinary: Un-Suspend existing user  */
export function useAdminUnSuspendUserMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminUnSuspendDisciplineUser, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Suspension lifted successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__our_populatedUserBId');
				queryClient.refetchQueries('__our_populatedUserBId', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to unsuspend user' })
	});
}

/** ** 6) Admin Disciplinary: Block existing  User  */
export function useAdminBlockUserMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminBlockDisciplineUser, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'User blocked successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__our_populatedUserBId');
				queryClient.refetchQueries('__our_populatedUserBId', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to block user' })
	});
}

/** ** 7) Admin Disciplinary: Un-Block existing user  */
export function useAdminUnBlockUserMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminUnBlockDisciplineUser, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Suspension lifted successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__our_populatedUserBId');
				queryClient.refetchQueries('__our_populatedUserBId', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to unblock user' })
	});
}

/** ** 8) Admin update  User data" */
export function useAdminUpdateUserDetailMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateApiUserById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'User details  updated successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__our_populatedUserBId');
				queryClient.refetchQueries('__our_populatedUserBId', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update user details' })
	});
}
