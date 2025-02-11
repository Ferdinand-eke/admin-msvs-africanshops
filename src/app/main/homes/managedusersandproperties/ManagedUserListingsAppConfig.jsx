import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ManagedUserListingApp = lazy(() => import('./ManagedUserListingApp'));
const PropertyListing = lazy(() => import('./product/PropertyListing'));
const EstateProperties = lazy(() => import('./products/EstateProperties'));
const ProfileApp = lazy(() => import('./manageprofile/ProfileApp'));
const PropertyProfileApp = lazy(() => import('./manageuserpropertyprofile/PropertyProfileApp'))
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const ManagedUserListingsAppConfig = {

	
	settings: {
		layout: {}
	},


	routes: [
		{
			path: 'userlistings',
			element: <ManagedUserListingApp />,
			children: [
				{
					path: '',
					element: <Navigate to="managed-user-listings" />
				},
				{
					path: 'managed-user-listings',
					element: <EstateProperties />
				},
				
			
				{
					path: 'managed-user-listings/:userId/userproperties',
					element: <ProfileApp />
				},

				// {
				// 	path: 'managed-user-listings/:productId/manage',
				// 	element: <ProfileApp />
				// },

				{
					path: 'managed-user-listings/:popertyId/manage',
					element: <PropertyProfileApp />
				},

				
				{
					path: 'managed-user-listings/:productId/*',
					element: <PropertyListing />
				},

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

export default ManagedUserListingsAppConfig;
