import { lazy } from 'react';
import { authRoles } from 'src/app/auth';
import ContactView from './contact/AdminContactView';
import AddStaffContactForm from './contact/AddStaffContactForm';

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
	// Managing other admin/staff accounts is the most sensitive existing action
	// in this app — gated to super-admin specifically (not just any 'admin'),
	// now that transformAdminUser() surfaces the real isSuperAdmin field from
	// the backend instead of every admin being treated identically.
	auth: authRoles.superAdmin,

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
