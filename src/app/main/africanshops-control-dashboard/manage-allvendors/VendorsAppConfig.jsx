import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const VendorsApp = lazy(() => import('./VendorsApp'));
const Vendor = lazy(() => import('./vendor/Vendor'));
const AllVendors = lazy(() => import('./vendors/AllVendors'));
/**
 * The E-Commerce app configuration.
 */

const VendorsAppConfig = {
	settings: {
		layout: {}
	},

	routes: [
		{
			path: 'vendors',
			element: <VendorsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="listvendors" />
				},
				{
					path: 'listvendors',
					element: <AllVendors />
				},
				{
					path: 'listvendors/:productId/*',
					element: <Vendor />
				}
			]
		}
	]
};
export default VendorsAppConfig;
