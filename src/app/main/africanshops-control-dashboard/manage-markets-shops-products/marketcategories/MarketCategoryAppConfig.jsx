import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MarketCategoriesApp = lazy(() => import('./MarketCategoriesApp'));
const MarketCategory = lazy(() => import('./marketcategory/MarketCategory'));
const MarketCategories = lazy(() => import('./all-marketcategories/MarketCategories'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const MarketCategoryAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'market-categories',
			element: <MarketCategoriesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <MarketCategories />
				},
				{
					path: 'list/:productId/*',
					element: <MarketCategory />
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
export default MarketCategoryAppConfig;
