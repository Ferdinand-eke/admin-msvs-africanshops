import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { Outlet } from 'react-router-dom';
import AdminProfileSettingsHeader from './components/AdminProfileSettingsHeader';

/**
 * Admin Profile Settings App
 * Main container for admin profile and settings management
 */
function AdminProfileSettingsApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<FusePageCarded
			header={<AdminProfileSettingsHeader />}
			content={<Outlet />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default AdminProfileSettingsApp;
