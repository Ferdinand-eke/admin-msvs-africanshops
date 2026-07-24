import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const CivicTaxApp = lazy(() => import('./CivicTaxApp'));

/**
 * Civic-Tax admin visibility (2026-07-24) — Admin Web App items 19-22.
 * `authRoles.admin` (flat tier) — jurisdiction wallet balances/collection
 * totals are civic-operational data, not the account-level PII that gates
 * withdrawals/KYC to super-admin only.
 */
const CivicTaxAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: 'manage-civic-tax',
			element: <CivicTaxApp />
		}
	]
};

export default CivicTaxAppConfig;
