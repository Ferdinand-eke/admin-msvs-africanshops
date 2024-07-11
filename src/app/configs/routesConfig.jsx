import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import PagesConfigs from '../main/pages/pagesConfigs';
import DashboardsConfigs from '../main/dashboards/dashboardsConfigs';
import AppsConfigs from '../main/apps/appsConfigs';
import UserInterfaceConfigs from '../main/user-interface/UserInterfaceConfigs';
import DocumentationConfig from '../main/documentation/DocumentationConfig';
import authRoleExamplesConfigs from '../main/auth/authRoleExamplesConfigs';
import UsersAppConfig from '../main/users/user/UsersAppConfig';
import StaffAppConfig from '../main/users/admin/StaffAppConfig';
import PropertiesAppConfig from '../main/properties/listings/PropertiesAppConfig';
import ServiceTypesAppConfig from '../main/homes/servicetypes/ServiceTypesAppConfig';
import ManagedListingsAppConfig from '../main/homes/managedproperties/ManagedListingsAppConfig';
import PropertyTypesAppConfig from '../main/homes/propertytypes/PropertyTypesAppConfig';
import SignAcceptInviteConfig from '../main/sign-accept-invite/SignAcceptInviteConfig';

const routeConfigs = [
	SignOutConfig,
	SignInConfig,
	SignUpConfig,
	SignAcceptInviteConfig,
	// DocumentationConfig,
	UsersAppConfig,
	StaffAppConfig,
	PropertiesAppConfig,
	ServiceTypesAppConfig,
	ManagedListingsAppConfig,
	PropertyTypesAppConfig,

	
	/**Routes Below to be disabled */
	...PagesConfigs,
	...UserInterfaceConfigs,
	...DashboardsConfigs,
	...AppsConfigs,
	...authRoleExamplesConfigs
];
/**
 * The routes of the application.
 */
const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/dashboards/project" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];
export default routes;
