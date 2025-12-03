import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductCategoriesApp = lazy(() => import('./ProductCategoriesApp'));
const ProductCategory = lazy(() => import('./product/ProductCategory'));
const ProductCategories = lazy(() => import('./products/ProductCategories'));
/**
 * The E-Commerce app configuration.
 */

const ProductCategoriesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'productcategories',
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
					element: <ProductCategory />
				}
			]
		}
	]
};
export default ProductCategoriesAppConfig;
