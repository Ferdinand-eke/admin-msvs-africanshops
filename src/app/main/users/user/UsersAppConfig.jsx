import { lazy } from 'react';
import UserContactView from './contact/UserContactView';
import ContactForm from './contact/ContactForm';
// import { authRoles } from 'src/app/auth';
import authRoles from '../../../auth/authRoles';
import AddUserForm from './contact/AddUserForm';
import ActivateUserForm from './contact/ActivateUserForm';

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
				// {
				// 	path: ':id/activate',
				// 	element: <ActivateUserForm />
				// },
				{
					path: ':id',
					element: <UserContactView />
				},
				{
					path: ':id/edit',
					// element:<ContactForm />
					element:<AddUserForm />
				}
			]
		}
	]
};
export default UsersAppConfig;
