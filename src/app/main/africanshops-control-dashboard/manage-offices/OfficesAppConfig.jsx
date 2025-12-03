import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ShopProductsApp = lazy(() => import('./ShopProductsApp'));
const Product = lazy(() => import('./product/Office'));
const OurOffices = lazy(() => import('./products/OurOffices'));
/**
 * The E-Commerce app configuration.
 */

const OfficesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'administrations',
			element: <ShopProductsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="offices" />
				},
				{
					path: 'offices',
					element: <OurOffices />
				},
				{
					path: 'offices/:productId/*',
					element: <Product />
				}
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
export default OfficesAppConfig;
