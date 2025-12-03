import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const LgaCountiesApp = lazy(() => import('./LgaCountiesApp'));
const LgaCounty = lazy(() => import('./product/LgaCounty'));
const LgaCounties = lazy(() => import('./products/LgaCounties'));
/**
 * The E-Commerce app configuration.
 */

const LgasCountiesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'administrations',
			element: <LgaCountiesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="lgas" />
				},
				{
					path: 'lgas',
					element: <LgaCounties />
				},
				{
					path: 'lgas/:productId/*',
					element: <LgaCounty />
				}
			]
		}
	]
};
export default LgasCountiesAppConfig;
