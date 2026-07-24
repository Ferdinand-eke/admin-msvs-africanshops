import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const TransferSettingsApp = lazy(() => import('./TransferSettingsApp'));

/**
 * Finance kill-switches (2026-07-24) — Admin Web App item 26. Gated to
 * super-admin, same tier as manage-withdrawals: this screen can halt all
 * internal/external money movement platform-wide, more sensitive than the
 * flat admin tier's usual scope.
 */
const TransferSettingsAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.superAdmin,
	routes: [
		{
			path: 'manage-finance/transfer-settings',
			element: <TransferSettingsApp />
		}
	]
};

export default TransferSettingsAppConfig;
