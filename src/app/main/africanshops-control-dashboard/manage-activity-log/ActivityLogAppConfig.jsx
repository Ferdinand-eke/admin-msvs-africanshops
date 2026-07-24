import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const ActivityLogApp = lazy(() => import('./ActivityLogApp'));

/**
 * Admin activity log (2026-07-24) — see Admin Web App tracker item 15.
 * Replaces the fake main/pages/activities (exampleActivitiesData.js, never
 * even routed) with a real screen over the new AuditLog collection.
 * Super-admin gated: admin action history is itself sensitive.
 */
const ActivityLogAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.superAdmin,
	routes: [
		{
			path: 'manage-activity-log',
			element: <ActivityLogApp />
		}
	]
};

export default ActivityLogAppConfig;
