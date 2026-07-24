import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { adminGetPendingKyc, adminVerifyKyc } from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

/**
 * Admin: pending KYC review queue. Backend/gateway route
 * (GET /auth-user/kyc/admin/pending) already existed and was already
 * guarded/real — added 2026-07-22 as the first frontend caller of it.
 */
export function useAdminPendingKyc({ page = 1, limit = 20 } = {}) {
	return useQuery(['admin_pending_kyc', { page, limit }], () => adminGetPendingKyc({ page, limit }), {
		keepPreviousData: true,
		staleTime: 30000
	});
}

/**
 * Approve-only, 2026-07-24 — no reject action exists on the backend
 * (confirmed: no adminRejectKyc route/DTO anywhere in auth-service).
 */
export function useApproveKyc() {
	const queryClient = useQueryClient();
	return useMutation(({ userId, notes }) => adminVerifyKyc(userId, notes), {
		onSuccess: () => {
			toast.success('KYC approved.');
			queryClient.invalidateQueries('admin_pending_kyc');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to approve KYC' })
	});
}
