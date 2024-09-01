import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const CountryShippingTableApp = lazy(() => import('./CountryShippingTableApp'));
const VendorPlan = lazy(() => import('./vendorplan/VendorPlan'));
const CountryShippingTables = lazy(() => import('./vendorplans/CountryShippingTables'));
/**
 * The E-Commerce app configuration.
 */


const CountryShippingTableAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'countryshipping',
			element: <CountryShippingTableApp />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <CountryShippingTables />
				},
				{
					path: 'packages/:productId/*',
					element: <VendorPlan />
				},
				// {
				// 	path: 'inventory',
				// 	element: <VendorPlans />
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
export default CountryShippingTableAppConfig;
