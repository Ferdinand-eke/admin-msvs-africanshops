import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const StatesApp = lazy(() => import('./DesignationsApp'));
const Designation = lazy(() => import('./product/Designation'));
const Designations = lazy(() => import('./products/Designations'));
/**
 * The E-Commerce app configuration.
 */

const DesignationsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'designations',
			element: <StatesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="list" />
				},
				{
					path: 'list',
					element: <Designations />
				},
				{
					path: 'list/:productId/*',
					element: <Designation />
				},
				// {
				// 	path: 'inventory',
				// 	element: <Designations />
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
export default DesignationsAppConfig;
