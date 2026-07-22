import { useQuery } from 'react-query';
import { adminGetPendingKyc } from '../apiRoutes';

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
