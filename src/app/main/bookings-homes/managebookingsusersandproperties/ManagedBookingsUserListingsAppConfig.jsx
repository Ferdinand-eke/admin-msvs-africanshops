import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ManagedUserListingApp = lazy(() => import('./ManagedUserListingApp'));
const PropertyListing = lazy(() => import('./product/PropertyListing'));
const BookingsProperties = lazy(() => import('./products/BookingsProperties'));
const ProfileApp = lazy(() => import('./bookingsmanageprofile/ProfileApp'));
const PropertyProfileApp = lazy(() => import('./bookingsmanageuserpropertyprofile/PropertyProfileApp'))

const ReservationsOnBookingsProperties = lazy(() => import('./reservations/ReservationsOnBookingsProperties'))
// const Order = lazy(() => import('./order/Order'));
// const Orders = lazy(() => import('./orders/Orders'));
/**
 * The E-Commerce app configuration.
 */


const ManagedBookingsUserListingsAppConfig = {

	
	settings: {
		layout: {}
	},


	routes: [
		{
			path: 'bookings-hospitality',
			element: <ManagedUserListingApp />,
			children: [
				{
					path: '',
					element: <Navigate to="user-listings" />
				},
				{
					path: 'user-listings',
					element: <BookingsProperties />
				},
				
				{
					path: 'user-listings/:productId/*',
					element: <PropertyListing />
				},
				{
					path: 'user-listings/:userId/userproperties',
					element: <ProfileApp />
				},

				{
					path: 'user-listings/:popertyId/manage',
					element: <PropertyProfileApp />
				},


				{ 
					path: 'reservations',
					element: <ReservationsOnBookingsProperties />
				},
			]
		}
	]
};

export default ManagedBookingsUserListingsAppConfig;
