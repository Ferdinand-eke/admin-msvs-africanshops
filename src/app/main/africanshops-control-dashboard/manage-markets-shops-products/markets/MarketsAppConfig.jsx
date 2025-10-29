import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MarketsApp = lazy(() => import('./MarketsApp'));
const Product = lazy(() => import('./market/SingleMarket'));
const Markets = lazy(() => import('./all-markets/Markets'));
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */


const MarketsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'markets',
			element: <MarketsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <Markets />
				},
				{
					path: 'list/:productId/*',
					element: <Product />
				},
				
				
			]
		}
	]
};
export default MarketsAppConfig;
