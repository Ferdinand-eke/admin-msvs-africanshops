import { lazy } from 'react';
import { authRoles } from 'src/app/auth';

const YouthSportsApp = lazy(() => import('./YouthSportsApp'));

/**
 * Platform-coordinator pilot: Youth Sports admin surface (programs,
 * tournaments, spotlights, enrollment oversight). Pattern this is meant to
 * be replicated for healthcare/social-civic/digitaledu/governance next.
 */
const YouthSportsAppConfig = {
	settings: {
		layout: {}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: 'platform-coordinator/youthsports',
			element: <YouthSportsApp />
		}
	]
};

export default YouthSportsAppConfig;
