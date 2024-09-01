import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductCategoriesApp = lazy(() => import('./ProductUnitsApp'));
const Designation = lazy(() => import('./product/ProductUnit'));
const ProductCategories = lazy(() => import('./products/ProductUnits'));
/**
 * The E-Commerce app configuration.
 */

const ProductUnitsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'productunits',
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
export default ProductUnitsAppConfig;
