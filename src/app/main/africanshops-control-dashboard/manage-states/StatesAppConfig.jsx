import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const StatesApp = lazy(() => import('./StatesApp'));
const StatePage = lazy(() => import('./state/StatePage'));
const OperationalStates = lazy(() => import('./states/States'));
/**
 * The E-Commerce app configuration.
 */

const StatesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'administrations',
			element: <StatesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="states" />
				},
				{
					path: 'states',
					element: <OperationalStates />
				},
				{
					path: 'states/:productId/*',
					element: <StatePage />
				}
				// {
				// 	path: 'inventory',
				// 	element: <OperationalStates />
				// },
				// {
				// 	path: 'orders',
				// 	element: <Orders />
				// },
				// {
				// 	path: 'orders/:orderId',
				// 	element: <Order />
				// }
			]
		}
	]
};
export default StatesAppConfig;
