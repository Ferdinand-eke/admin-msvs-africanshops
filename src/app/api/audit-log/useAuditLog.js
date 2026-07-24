import { useQuery } from 'react-query';
import { adminGetAuditLog } from '../apiRoutes';

/**
 * Admin audit trail (2026-07-24) — real, actioned admin events (KYC verify +
 * merchant moderation so far), not every mutation platform-wide. Extend
 * incrementally as more admin actions are next touched.
 */
export function useAdminAuditLog({ page = 1, limit = 20, adminId, action, targetType } = {}) {
	return useQuery(
		['admin_audit_log', { page, limit, adminId, action, targetType }],
		() => adminGetAuditLog({ page, limit, adminId, action, targetType }),
		{
			keepPreviousData: true,
			staleTime: 15000
		}
	);
}
