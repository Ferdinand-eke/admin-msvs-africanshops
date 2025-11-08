import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const CountriesApp = lazy(() => import('./CountriesApp'));
const Country = lazy(() => import('./product/CountryPage'));
const Countries = lazy(() => import('./products/Countries'));
/**
 * The E-Commerce app configuration.
 */


const CountriesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'administrations',
			element: <CountriesApp />,
			children: [
				{
					path: '',
					element: <Navigate to="countries" />
				},
				{
					path: 'countries',
					element: <Countries />
				},
				{
					path: 'countries/:productId/*',
					element: <Country />
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
export default CountriesAppConfig;
