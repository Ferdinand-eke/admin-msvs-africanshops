import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const StatesApp = lazy(() => import('./StatesApp'));
const Product = lazy(() => import('./product/State'));
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
					element: <Product />
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
