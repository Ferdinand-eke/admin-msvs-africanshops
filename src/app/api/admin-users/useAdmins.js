import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import {
	getApiAdminUsers,
	createApiAdminUser,
	updateApiAdminUserById,
	getApiAdminUserById,
	adminBlockDisciplineStaff,
	adminUnBlockDisciplineStaff,
	adminSuspendDisciplineStaff,
	adminUnSuspendDisciplineStaff,
	adminMakeLeader,
	adminUnMakeLeader,
	createRecruitAdminUserApi,
	newAdminUserInviteAcceptanceEndpoint,
	getApiAdminUserByIdNotPopulated,
	adminDeleteAdminStaff
} from '../apiRoutes';

/** *1) Get all admin staff */
export default function useAdminUsers(params = {}) {
	const { limit, offset, name } = params;

	return useQuery(['__admins', { limit, offset, name }], () => getApiAdminUsers({ limit, offset, name }), {
		keepPreviousData: true // Keeps previous data while fetching new page
	});
} // (Msvs => Done)

/** **2) Admin get single admin data" */
export function useSingleAdminStaff(staffId) {
	return useQuery(
		['__adminById', staffId],
		() => getApiAdminUserById(staffId),

		{
			enabled: Boolean(staffId)
		}
	);
}

/** **2.1) Admin get single admin data (not populated)" */
export function useNonPopulatedSingleAdminStaff(staffId) {
	if (!staffId || staffId === 'new') {
		return '';
	}

	return useQuery(
		['__adminByIdNonPopulated', staffId],
		() => getApiAdminUserByIdNotPopulated(staffId),

		{
			enabled: Boolean(staffId)
		}
	);
}

/** ** 3) Admin create/invite new  Admin-Staff" */
export function useAddAdminStaffMutation() {
	const queryClient = useQueryClient();
	return useMutation(
		(newAdminStaff) => {
			return createApiAdminUser(newAdminStaff);
		},

		{
			onSuccess: (data) => {
				return;

				if (data) {
					toast.success('Adminstaff  added successfully!');
					queryClient.invalidateQueries(['__admins']);
					queryClient.refetchQueries('__admins', { force: true });
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create admin staff' })
		}
	);
}

/** ** 4) Admin update  Admin-Staff data" */
export function useAdminStaffUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateApiAdminUserById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Admin staff updated successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__adminById');
				queryClient.invalidateQueries('__adminByIdNonPopulated');
				queryClient.invalidateQueries(['__admins']);

				// Navigate back to admin list after successful update
				navigate('/users/admin');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update admin staff' })
	});
}

/** ** 5) Admin Disciplinary: Block existing AdminStaff  */
export function useAdminStaffBlockMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminBlockDisciplineStaff, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Adminstaff  blocked successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__adminById');
				queryClient.refetchQueries('__adminById', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to block admin staff' })
	});
}

/** ** 6) Admin Disciplinary: UnBlock existing AdminStaff  */
export function useAdminStaffUnBlockMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminUnBlockDisciplineStaff, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Adminstaff un-blocked successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__adminById');
				queryClient.refetchQueries('__adminById', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to unblock admin staff' })
	});
}

/** ** 7) Admin Disciplinary: Suspend existing  AdminStaff  */
export function useAdminStaffSuspenMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminSuspendDisciplineStaff, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Adminstaff suspended successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__adminById');
				queryClient.refetchQueries('__adminById', { force: true });
				queryClient.invalidateQueries('__admins');
				queryClient.refetchQueries('__admins', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to suspend admin staff' })
	});
}

/** ** 8) Admin Disciplinary: Un-Suspend existing AdminStaff  */
export function useAdminStaffUnSuspednMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminUnSuspendDisciplineStaff, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Suspension lifted successfully!!'}`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries('__adminById');
				queryClient.refetchQueries('__adminById', { force: true });
				queryClient.invalidateQueries('__admins');
				queryClient.refetchQueries('__admins', { force: true });
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to unsuspend admin staff' })
	});
}

/** ** 9) Admin Upgrade: Make Leadership to existing AdminStaff  */
export function useAdminStaffMakeLeaderMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminMakeLeader, {
		onSuccess: (data) => {
			toast.success('Adminstaff made leader successfully!!', {
				position: 'top-left'
			});
			queryClient.invalidateQueries('__adminById');
			queryClient.refetchQueries('__adminById', { force: true });
			queryClient.invalidateQueries('__admins');
				queryClient.refetchQueries('__admins', { force: true });
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to make admin staff leader' })
	});
}

/** ** 10) Admin Upgrade: Un-Make Leadership to existing AdminStaff market  */
export function useAdminStaffUnMakeLeaderMutation() {
	const queryClient = useQueryClient();

	return useMutation(adminUnMakeLeader, {
		onSuccess: (data) => {
			toast.success('Adminstaff leader removed successfully!!');
			queryClient.invalidateQueries('__adminById');
				queryClient.refetchQueries('__adminById', { force: true });
			queryClient.invalidateQueries('__admins');
				queryClient.refetchQueries('__admins', { force: true });
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to remove admin staff leadership' })
	});
}

/** ** 11) Admin Handling: Delete and existing AdminStaff  */
export function useDeleteAdminStaffMutation() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation(adminDeleteAdminStaff, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Admin deleted successfully!!'}`, {
					position: 'top-left'
				});

				queryClient.invalidateQueries('__adminById');
				queryClient.invalidateQueries('__admins');
				queryClient.refetchQueries('__admins', { force: true });
				navigate('/users/admin');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete admin staff' })
	});
}

/** ****
 * ############################################################
 *          INVITATION OF NEW ADMIN STAFF STARTS              #
 * ############################################################
 */

/** * 1) Recruite New Admins */
export function useAdminRecruitAfricanshopStaff() {
	const navigate = useNavigate();
	return useMutation(createRecruitAdminUserApi, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('Admin Invite Sent, Acceptance Pending');
				navigate('/users/admin');
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to send admin invitation' })
	});
}

/** * 2) Admin Accept Invites */
export function useNewAdminInvitationAcceptance() {
	const navigate = useNavigate();
	return useMutation(newAdminUserInviteAcceptanceEndpoint, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(
					`${data?.data?.message ? data?.data?.message : 'Invitation Accepted, Welcome Onboard, Please Log in.'}`
				);
				navigate('/sign-in');
			} else if (data?.data?.error) {
				toast.error(
					data?.data?.error?.response && error?.response?.data?.message
						? error?.response?.data?.message
						: error?.message
				);
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to accept invitation' })
	});
}
