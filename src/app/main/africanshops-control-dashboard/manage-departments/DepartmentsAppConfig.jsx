import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const DepartmentsApp = lazy(() => import('./DepartmentsApp'));
const Department = lazy(() => import('./departmentPage/Department'));
const Departments = lazy(() => import('./departments/Departments'));
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
				}
			]
		}
	]
};
export default DepartmentsAppConfig;
