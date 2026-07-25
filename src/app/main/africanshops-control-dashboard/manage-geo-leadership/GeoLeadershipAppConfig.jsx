import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const GeoLeadershipApp = lazy(() => import('./GeoLeadershipApp'));

/**
 * Geo-Leadership Dashboard (item 29, 2026-07-25) — combines items 19-22's
 * jurisdiction wallet/obligation visibility with items 27/28's
 * co-administrator query/invite, one screen per jurisdiction. Tax-only
 * scope per the founder's call that governance stays gated.
 */
const GeoLeadershipAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: 'manage-geo-leadership',
			element: <GeoLeadershipApp />
		}
	]
};

export default GeoLeadershipAppConfig;
