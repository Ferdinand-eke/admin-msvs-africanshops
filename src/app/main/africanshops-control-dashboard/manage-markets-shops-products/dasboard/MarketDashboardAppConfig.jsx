import { lazy } from 'react';

const ShopDashboardApp = lazy(() => import('./ShopDashboardApp'));
/**
 * The ProjectDashboardApp configuration.
 */
const MarketDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'market-dashboard',
			element: <ShopDashboardApp />
		}
	]
};
export default MarketDashboardAppConfig;

