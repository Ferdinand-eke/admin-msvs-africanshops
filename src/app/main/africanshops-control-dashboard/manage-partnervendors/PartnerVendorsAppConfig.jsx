import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const VendorsApp = lazy(() => import('./VendorsApp'));
const Vendor = lazy(() => import('./vendor/Vendor'));
const AllVendors = lazy(() => import('./vendors/AllVendors'));
/**
 * The E-Commerce app configuration.
 */

const PartnerVendorsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'partnervendors',
			element: <VendorsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="listpartners" />
				},
				{
					path: 'listpartners',
					element: <AllVendors />
				},
				{
					path: 'listpartners/:productId/*',
					element: <Vendor />
				}
				// {
				// 	path: 'inventory',
				// 	element: <AllVendors />
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
export default PartnerVendorsAppConfig;
