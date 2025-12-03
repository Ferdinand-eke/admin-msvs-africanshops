import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const TradehubsApp = lazy(() => import('./TradehubsApp'));
const SingleTradehub = lazy(() => import('./tradehub/Tradehub'));
const AllTradehubs = lazy(() => import('./all-tradehubs/Tradehubs'));
/**
 * The E-Commerce app configuration.
 */

const TradehubsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'tradehubs',
			element: <TradehubsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <AllTradehubs />
				},
				{
					path: 'list/:productId/*',
					element: <SingleTradehub />
				}
			]
		}
	]
};
export default TradehubsAppConfig;
