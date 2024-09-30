import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const VendorPlansApp = lazy(() => import('./VendorPlansApp'));
const VendorPlan = lazy(() => import('./vendorplan/VendorPlan'));
const VendorPlans = lazy(() => import('./vendorplans/VendorPlans'));
/**
 * The E-Commerce app configuration.
 */


const VendorPlansAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'vendorplans',
			element: <VendorPlansApp />,
			children: [
				{
					path: '',
					element: <Navigate to="packages" />
				},
				{
					path: 'packages',
					element: <VendorPlans />
				},
				{
					path: 'packages/:productId/*',
					element: <VendorPlan />
				},
			
			]
		}
	]
};
export default VendorPlansAppConfig;
