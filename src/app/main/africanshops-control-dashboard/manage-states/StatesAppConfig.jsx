import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const StatesApp = lazy(() => import('./StatesApp'));
const StatePage = lazy(() => import('./product/StatePage'));
const ShopProducts = lazy(() => import('./products/States'));
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
					element: <ShopProducts />
				},
				{
					path: 'states/:productId/*',
					element: <StatePage />
				},
				// {
				// 	path: 'inventory',
				// 	element: <ShopProducts />
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
