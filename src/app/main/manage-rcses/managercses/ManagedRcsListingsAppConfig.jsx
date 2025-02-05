import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ManagedRcsListingApp = lazy(() => import('./ManagedRcsListingApp'));
// const RcsListing = lazy(() => import('./product/RcsListing'));
const RcsMerchants = lazy(() => import('./products/RcsMerchants'));
// const ProfileApp = lazy(() => import('./rcsmanageprofile/ProfileApp'));
const RcsProfileApp = lazy(() => import('./rcsmanageuserpropertyprofile/RcsProfileApp'))

const ReservationsMenuOrders = lazy(() => import('./reservations_menuorders/ReservationsMenuOrders'))
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */

const ManagedRcsListingsAppConfig = {

	
	settings: {
		layout: {}
	},



	routes: [
		{
			path: 'rcs-management',
			element: <ManagedRcsListingApp />,
			children: [
				{
					path: '',
					element: <Navigate to="rcs-listings" />
				},
				{
					path: 'rcs-listings',
					element: <RcsMerchants />
				},
				
				// {
				// 	path: 'rcs-listings/:productId/*',
				// 	element: <RcsListing />
				// },
				// {
				// 	path: 'rcs-listings/:userId/userproperties',
				// 	element: <ProfileApp />
				// },

				{
					path: 'rcs-listings/:popertyId/manage',
					element: <RcsProfileApp />
				},


				{ 
					path: 'rcs-reservations-menuorders',
					element: <ReservationsMenuOrders />
				},
			]
		}
	]
};

export default ManagedRcsListingsAppConfig;
