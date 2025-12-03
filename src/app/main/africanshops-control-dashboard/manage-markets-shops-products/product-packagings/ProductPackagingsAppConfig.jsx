import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductCategoriesApp = lazy(() => import('./ProductCategoriesApp'));
const Designation = lazy(() => import('./product/Designation'));
const ProductCategories = lazy(() => import('./products/ProductCategories'));
/**
 * The E-Commerce app configuration.
 */

const ProductPackagingsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'productpackagings',
			element: <ProductCategoriesApp />,
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
				}
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
export default ProductPackagingsAppConfig;
