import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const AdminProfileSettingsApp = lazy(() => import('./AdminProfileSettingsApp'));
const ProfileView = lazy(() => import('./tabs/ProfileView'));
const ReferralLinks = lazy(() => import('./tabs/ReferralLinks'));

/**
 * Admin Profile Settings App Configuration
 * Manages admin profile viewing, editing social media handles, and referral link generation
 */

const AdminProfileSettingsAppConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: true
				},
				toolbar: {
					display: true
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: ['admin'],
	routes: [
		{
			path: 'admin-settings',
			element: <AdminProfileSettingsApp />,
			children: [
				{
					path: '',
					element: <Navigate to="profile" />
				},
				{
					path: 'profile',
					element: <ProfileView />
				},
				{
					path: 'referral-links',
					element: <ReferralLinks />
				}
			]
		}
	]
};

export default AdminProfileSettingsAppConfig;
