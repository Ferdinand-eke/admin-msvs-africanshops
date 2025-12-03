import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductCategoriesApp = lazy(() => import('./ProductUnitsApp'));
const ProductUnit = lazy(() => import('./product/ProductUnit'));
const ProductUnits = lazy(() => import('./products/ProductUnits'));
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
					element: <ProductUnits />
				},

				{
					path: 'list/:productId/*',
					element: <ProductUnit />
				}
			]
		}
	]
};

export default ProductUnitsAppConfig;
