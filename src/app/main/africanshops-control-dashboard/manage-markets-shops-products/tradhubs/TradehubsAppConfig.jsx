import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const TradehubsApp = lazy(() => import('./TradehubsApp'));
const Designation = lazy(() => import('./product/Tradehub'));
const ProductCategories = lazy(() => import('./products/Tradehubs'));
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
					element: <ProductCategories />
				},
				{
					path: 'list/:productId/*',
					element: <Designation />
				},
				// {
				// 	path: 'inventory',
				// 	element: <Designations />
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
export default TradehubsAppConfig;
