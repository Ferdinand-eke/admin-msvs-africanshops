import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const DepartmentsApp = lazy(() => import('./DepartmentsApp'));
const Department = lazy(() => import('./product/Department'));
const Departments = lazy(() => import('./products/Departments'));
/**
 * The E-Commerce app configuration.
 */


const DepartmentsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'departments',
			element: <DepartmentsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="lis" />
				},
				{
					path: 'list',
					element: <Departments />
				},
				{
					path: 'list/:productId/*',
					element: <Department />
				},
				// {
				// 	path: 'inventory',
				// 	element: <Countries />
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
export default DepartmentsAppConfig;
