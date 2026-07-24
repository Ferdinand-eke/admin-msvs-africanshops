import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const SupportTicketsApp = lazy(() => import('./SupportTicketsApp'));

/**
 * Support-ticket admin triage (2026-07-24) — see Admin Web App tracker item
 * 14. `authRoles.admin` (flat tier), same as merchant moderation/youthsports
 * coordinator screens — ticket content isn't PII-sensitive the way KYC
 * documents or withdrawal bank details are.
 */
const SupportTicketsAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: 'manage-support-tickets',
			element: <SupportTicketsApp />
		}
	]
};

export default SupportTicketsAppConfig;
