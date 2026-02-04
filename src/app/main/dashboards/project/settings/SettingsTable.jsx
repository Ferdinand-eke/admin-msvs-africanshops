import { memo, useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import useApplicationSettings, { useActivateApplicationSetting } from 'src/app/api/application-settings/useSettings';
// import useApplicationSettings, { useActivateApplicationSetting } from '../../../api/application-settings/useSettings';

/**
 * SettingsTable - Displays all application settings with edit/activate controls
 */
function SettingsTable({ platformFilter, onEdit }) {
	const [activateDialog, setActivateDialog] = useState(null);

	// Fetch application settings from API
	const { data: settingsResponse, isLoading, error } = useApplicationSettings();
	const activateMutation = useActivateApplicationSetting();
	console.log('Settings Response Data:', settingsResponse?.data?.payload);

	// Log the response data for analysis
	useEffect(() => {
		if (settingsResponse) {
			console.log('=== APPLICATION SETTINGS API RESPONSE ===');
			console.log('Full Response:', settingsResponse);
			console.log('Response Data:', settingsResponse?.data);
			console.log('Settings Array:', settingsResponse?.data?.payload);
			console.log('=========================================');
		}
	}, [settingsResponse]);

	// Extract settings data from response
	const settingsData = settingsResponse?.data?.payload || [];

	// Placeholder data - fallback for development
	const placeholderData = [
		{
			id: '1',
			servicePlatform: 'ADMIN',
			isActive: true,
			bookingsServiceStatus: 'ACTIVE',
			realEstateServiceStatus: 'DEVELOPMENT',
			marketplaceServiceStatus: 'ACTIVE',
			restaurantsClubsSpotsServiceStatus: 'COMING_SOON',
			usersLoginEnabled: true,
			merchantsLoginEnabled: true,
			adminsLoginEnabled: true,
			maintenanceMode: false,
			appActivatedOn: 'WEB',
			createdAt: '2024-01-15',
			lastUpdatedBy: 'Admin User'
		},
		{
			id: '2',
			servicePlatform: 'MERCHANT',
			isActive: true,
			bookingsServiceStatus: 'ACTIVE',
			realEstateServiceStatus: 'DEVELOPMENT',
			marketplaceServiceStatus: 'ACTIVE',
			restaurantsClubsSpotsServiceStatus: 'DISABLED',
			usersLoginEnabled: false,
			merchantsLoginEnabled: true,
			adminsLoginEnabled: false,
			maintenanceMode: false,
			appActivatedOn: 'MOBILE',
			createdAt: '2024-01-15',
			lastUpdatedBy: 'Admin User'
		},
		{
			id: '3',
			servicePlatform: 'USER',
			isActive: true,
			bookingsServiceStatus: 'ACTIVE',
			realEstateServiceStatus: 'MAINTENANCE',
			marketplaceServiceStatus: 'ACTIVE',
			restaurantsClubsSpotsServiceStatus: 'COMING_SOON',
			usersLoginEnabled: true,
			merchantsLoginEnabled: false,
			adminsLoginEnabled: false,
			maintenanceMode: false,
			appActivatedOn: 'MOBILE',
			createdAt: '2024-01-15',
			lastUpdatedBy: 'Admin User'
		}
	];

	const getStatusColor = (status) => {
		const colors = {
			ACTIVE: 'success',
			DEVELOPMENT: 'info',
			MAINTENANCE: 'warning',
			DISABLED: 'error',
			COMING_SOON: 'default'
		};
		return colors[status] || 'default';
	};

	const getPlatformIcon = (platform) => {
		const icons = {
			ADMIN: 'heroicons-outline:shield-check',
			MERCHANT: 'heroicons-outline:shopping-bag',
			USER: 'heroicons-outline:user-circle'
		};
		return icons[platform] || 'heroicons-outline:cog';
	};

	const filteredSettings = platformFilter
		? settingsData.filter((s) => s.servicePlatform === platformFilter)
		: settingsData;

	const handleActivateToggle = (settings) => {
		if (settings.isActive) {
			// Deactivating - show confirmation
			setActivateDialog(settings);
		} else {
			// Activating - call API
			activateMutation.mutate(settings.id);
		}
	};

	const confirmDeactivate = () => {
		/***API call to deactivate */
		activateMutation.mutate(activateDialog.id, {
			onSuccess: () => {
				setActivateDialog(null);
			}
		});
	};

	/***Loading state */
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-64">
				<CircularProgress />
				<Typography className="mt-16 text-sm text-secondary">Loading settings...</Typography>
			</div>
		);
	}

	/*** Error state */
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-64">
				<FuseSvgIcon size={64} className="text-red-400">
					heroicons-outline:exclamation-circle
				</FuseSvgIcon>
				<Typography className="mt-16 text-lg font-medium text-red-600">Error loading settings</Typography>
				<Typography className="mt-8 text-sm text-secondary">
					{error?.message || 'An unexpected error occurred'}
				</Typography>
			</div>
		);
	}

	return (
		<div className="p-24">
			{filteredSettings.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-64">
					<FuseSvgIcon size={64} className="text-gray-400">
						heroicons-outline:clipboard-list
					</FuseSvgIcon>
					<Typography className="mt-16 text-lg font-medium">No settings found</Typography>
					<Typography className="mt-8 text-sm text-secondary">
						Create a new settings configuration to get started
					</Typography>
				</div>
			) : (
				<div className="overflow-auto">
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<Typography className="font-semibold text-12">Platform</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold text-12">Active</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold text-12">Services Status</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold text-12">Login Access</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold text-12">App Platform</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold text-12">Mode</Typography>
								</TableCell>
								<TableCell align="right">
									<Typography className="font-semibold text-12">Actions</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredSettings.map((settings) => (
								<TableRow key={settings.id} hover>
									<TableCell>
										<div className="flex items-center">
											<FuseSvgIcon size={20} className="mr-8">
												{getPlatformIcon(settings.servicePlatform)}
											</FuseSvgIcon>
											<Typography className="font-medium">{settings.servicePlatform}</Typography>
										</div>
									</TableCell>
									<TableCell>
										<Tooltip title={settings.isActive ? 'Deactivate' : 'Activate'}>
											<Switch
												checked={settings.isActive}
												onChange={() => handleActivateToggle(settings)}
												color="success"
												size="small"
											/>
										</Tooltip>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-4">
											<Tooltip title="Marketplace">
												<Chip
													label="MP"
													size="small"
													color={getStatusColor(settings.marketplaceServiceStatus)}
													variant="outlined"
												/>
											</Tooltip>
											<Tooltip title="Bookings">
												<Chip
													label="BK"
													size="small"
													color={getStatusColor(settings.bookingsServiceStatus)}
													variant="outlined"
												/>
											</Tooltip>
											<Tooltip title="Real Estate">
												<Chip
													label="RE"
													size="small"
													color={getStatusColor(settings.realEstateServiceStatus)}
													variant="outlined"
												/>
											</Tooltip>
											<Tooltip title="Restaurants">
												<Chip
													label="RS"
													size="small"
													color={getStatusColor(settings.restaurantsClubsSpotsServiceStatus)}
													variant="outlined"
												/>
											</Tooltip>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-4">
											<Tooltip title="Users Login">
												<Chip
													icon={
														<FuseSvgIcon size={14}>
															{settings.usersLoginEnabled
																? 'heroicons-solid:check'
																: 'heroicons-solid:x'}
														</FuseSvgIcon>
													}
													label="U"
													size="small"
													color={settings.usersLoginEnabled ? 'success' : 'default'}
													variant="outlined"
												/>
											</Tooltip>
											<Tooltip title="Merchants Login">
												<Chip
													icon={
														<FuseSvgIcon size={14}>
															{settings.merchantsLoginEnabled
																? 'heroicons-solid:check'
																: 'heroicons-solid:x'}
														</FuseSvgIcon>
													}
													label="M"
													size="small"
													color={settings.merchantsLoginEnabled ? 'success' : 'default'}
													variant="outlined"
												/>
											</Tooltip>
											<Tooltip title="Admins Login">
												<Chip
													icon={
														<FuseSvgIcon size={14}>
															{settings.adminsLoginEnabled
																? 'heroicons-solid:check'
																: 'heroicons-solid:x'}
														</FuseSvgIcon>
													}
													label="A"
													size="small"
													color={settings.adminsLoginEnabled ? 'success' : 'default'}
													variant="outlined"
												/>
											</Tooltip>
										</div>
									</TableCell>
									<TableCell>
										<Chip label={settings.appActivatedOn} size="small" variant="outlined" />
									</TableCell>
									<TableCell>
										{settings.maintenanceMode ? (
											<Chip
												label="MAINTENANCE"
												size="small"
												color="warning"
												icon={<FuseSvgIcon size={14}>heroicons-solid:exclamation</FuseSvgIcon>}
											/>
										) : (
											<Chip label="NORMAL" size="small" color="success" variant="outlined" />
										)}
									</TableCell>
									<TableCell align="right">
										<div className="flex items-center justify-end space-x-4">
											<Tooltip title="Edit Settings">
												<IconButton size="small" onClick={() => onEdit(settings)} color="primary">
													<FuseSvgIcon size={18}>heroicons-outline:pencil</FuseSvgIcon>
												</IconButton>
											</Tooltip>
											<Tooltip title="View Details">
												<IconButton size="small" color="info">
													<FuseSvgIcon size={18}>heroicons-outline:eye</FuseSvgIcon>
												</IconButton>
											</Tooltip>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Deactivate Confirmation Dialog */}
			<Dialog open={Boolean(activateDialog)} onClose={() => setActivateDialog(null)}>
				<DialogTitle>Confirm Deactivation</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to deactivate the settings for{' '}
						<strong>{activateDialog?.servicePlatform}</strong> platform? This will affect all users on this
						platform.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setActivateDialog(null)}>Cancel</Button>
					<Button onClick={confirmDeactivate} color="error" variant="contained">
						Deactivate
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}


export default memo(SettingsTable);
