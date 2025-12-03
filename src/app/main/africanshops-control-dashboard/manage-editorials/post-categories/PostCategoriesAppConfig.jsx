import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductCategoriesApp = lazy(() => import('./PostCategoriesApp'));
const ProductCategory = lazy(() => import('./product/PostCategory'));
const PostCategories = lazy(() => import('./products/PostCategories'));
/**
 * The E-Commerce app configuration.
 */

const PostCategoriesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'postcategories',
			element: <ProductCategoriesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <PostCategories />
				},
				{
					path: 'list/:productId/*',
					element: <ProductCategory />
				}
			]
		}
	]
};
export default PostCategoriesAppConfig;
