import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// import CountryShipmentFormPage from './product/CountryShipmentFormPage';

const CountryShippingTableApp = lazy(() => import('./CountryShippingTableApp'));
const CountryShipping = lazy(() => import('./countryshipment/CountryShipping'));
const CountryShippingTables = lazy(() => import('./countryshippings/CountryShippingTables'));
const CountryShipmentFormPage = lazy(() => import('./product/CountryShipmentFormPage'));
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
					path: 'routes/:productId/*',
					element: <CountryShipping />,
				
				},
				// {
				// 	path: 'countryorigin/:productId/manage/:destinationId/*',
				// 	element: <CountryShipmentFormPage />
				// }

				
			]
		}
	]
};
export default CountryShippingTableAppConfig;
