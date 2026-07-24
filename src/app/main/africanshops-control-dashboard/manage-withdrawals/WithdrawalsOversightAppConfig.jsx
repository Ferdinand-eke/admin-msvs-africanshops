import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const WithdrawalsOversightApp = lazy(() => import('./WithdrawalsOversightApp'));

/**
 * Withdrawal oversight (read-only, 2026-07-24) — see Admin Web App tracker
 * item 11. Gated to super-admin: withdrawal sessions carry bank account
 * numbers/names, more sensitive than the flat admin tier's usual scope.
 */
const WithdrawalsOversightAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.superAdmin,
	routes: [
		{
			path: 'manage-finance/withdrawals',
			element: <WithdrawalsOversightApp />
		}
	]
};

export default WithdrawalsOversightAppConfig;
