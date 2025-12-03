import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

/**
 * Admin Profile Settings Header
 * Navigation header with tabs for different settings sections
 */
function AdminProfileSettingsHeader() {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();

	// Determine active tab based on current route
	const getActiveTab = () => {
		if (location.pathname.includes('/profile')) return 0;

		if (location.pathname.includes('/referral-links')) return 1;

		return 0;
	};

	const handleTabChange = (event, newValue) => {
		if (newValue === 0) {
			navigate('/admin-settings/profile');
		} else if (newValue === 1) {
			navigate('/admin-settings/referral-links');
		}
	};

	return (
		<div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
			>
				<div className="flex items-center">
					<FuseSvgIcon
						className="text-48"
						size={24}
						color="action"
					>
						heroicons-outline:user-circle
					</FuseSvgIcon>
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight leading-none ml-12">
						Admin Settings
					</Typography>
				</div>
			</motion.span>

			<Box sx={{ width: '100%', maxWidth: 600 }}>
				<Tabs
					value={getActiveTab()}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					<Tab
						className="h-64"
						label="Profile & Details"
						icon={<FuseSvgIcon size={20}>heroicons-outline:user</FuseSvgIcon>}
						iconPosition="start"
					/>
					<Tab
						className="h-64"
						label="Referral Links"
						icon={<FuseSvgIcon size={20}>heroicons-outline:link</FuseSvgIcon>}
						iconPosition="start"
					/>
				</Tabs>
			</Box>
		</div>
	);
}

export default AdminProfileSettingsHeader;
