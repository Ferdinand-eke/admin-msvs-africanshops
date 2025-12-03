import { lazy } from 'react';
import UserContactView from './contact/UserContactView';
// import { authRoles } from 'src/app/auth';
import AddUserForm from './contact/AddUserForm';

const ContactsOfUsersApp = lazy(() => import('./ContactsOfUsersApp'));
/**
 * The ContactsOfUsersApp configuration.
 */
const UsersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	// auth: authRoles.admin,

	routes: [
		{
			path: 'users/list',
			element: <ContactsOfUsersApp />,
			children: [
				{
					path: ':id/create',
					element: <AddUserForm />
				},
				{
					path: ':id',
					element: <UserContactView />
				},
				{
					path: ':id/edit',
					element: <AddUserForm />
				}
			]
		}
	]
};
export default UsersAppConfig;
