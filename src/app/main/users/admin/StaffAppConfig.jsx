import { lazy } from 'react';
import ContactView from './contact/AdminContactView';
import AddStaffContactForm from './contact/AddStaffContactForm';
// import { authRoles } from 'src/app/auth';

const ContactsApp = lazy(() => import('./ContactsApp'));
const PropertyType = lazy(() => import('./propertytype/PropertyType'));
/**
 * The ContactsApp configuration.
 */

const StaffAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles.admin,

	routes: [
		{
			path: 'users/admin',
			element: <ContactsApp />,
			children: [
				{
					path: ':id/create',
					element: <AddStaffContactForm />
				},

				{
					path: ':id',
					element: <ContactView />
				},
				{
					path: ':id/edit',
					element: <AddStaffContactForm />
				}
			]
		}
	]
};

export default StaffAppConfig;
