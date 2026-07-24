import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const KycReviewApp = lazy(() => import('./KycReviewApp'));

/**
 * KYC review (approve-only, 2026-07-24) — see Admin Web App tracker item 12.
 * Super-admin gated: submitted ID documents/legal names are sensitive PII.
 */
const KycReviewAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.superAdmin,
	routes: [
		{
			path: 'manage-kyc/review',
			element: <KycReviewApp />
		}
	]
};

export default KycReviewAppConfig;
