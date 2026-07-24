import { useQuery } from 'react-query';
import { adminListWithdrawals } from '../apiRoutes';

/**
 * Withdrawal oversight (read-only) — added 2026-07-24. Withdrawals already
 * fully auto-process end-to-end (PENDING_OTP -> PROCESSING -> COMPLETED via
 * Paystack), no manual approval gate exists in the money-movement flow, so
 * this is monitoring only, not an approval action.
 */
export function useAdminWithdrawals(params = {}) {
	return useQuery(['admin_withdrawals', params], () => adminListWithdrawals(params), {
		keepPreviousData: true,
		staleTime: 15000
	});
}
