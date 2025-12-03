import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ProductCategoriesApp = lazy(() => import('./PostCategoriesApp'));
const ProductCategory = lazy(() => import('./post/Post'));
const PostCategories = lazy(() => import('./posts/Posts'));
/**
 * The E-Commerce app configuration.
 */

const PostsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'posts',
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
export default PostsAppConfig;
