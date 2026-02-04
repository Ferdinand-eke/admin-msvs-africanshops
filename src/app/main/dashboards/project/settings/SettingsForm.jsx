import { memo, useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';


/**
 * SettingsForm - Comprehensive form for creating/editing application settings
 * Organizes settings into logical sections with real-time updates
 */
function SettingsForm({ settings, onSave, onCancel, platformFilter, isLoading }) {
	const [formData, setFormData] = useState({
		servicePlatform: settings?.servicePlatform || platformFilter || 'ADMIN',
		// servicePlatform: settings?.servicePlatform || platformFilter || 'ADMIN',
		isActive: settings?.isActive || false,

		// Service Status
		bookingsServiceStatus: settings?.bookingsServiceStatus || 'ACTIVE',
		realEstateServiceStatus: settings?.realEstateServiceStatus || 'DEVELOPMENT',
		marketplaceServiceStatus: settings?.marketplaceServiceStatus || 'DEVELOPMENT',
		restaurantsClubsSpotsServiceStatus: settings?.restaurantsClubsSpotsServiceStatus || 'DEVELOPMENT',

		// Authentication
		usersLoginEnabled: settings?.usersLoginEnabled ?? true,
		merchantsLoginEnabled: settings?.merchantsLoginEnabled ?? true,
		adminsLoginEnabled: settings?.adminsLoginEnabled ?? true,
		usersRegistrationEnabled: settings?.usersRegistrationEnabled ?? true,
		merchantsRegistrationEnabled: settings?.merchantsRegistrationEnabled ?? true,

		// Payment Providers
		paystackPaymentStatus: settings?.paystackPaymentStatus || 'ACTIVE',
		flutterwavePaymentStatus: settings?.flutterwavePaymentStatus || 'DISABLED',
		directPayStatus: settings?.directPayStatus || 'DISABLED',

		// Platform
		appActivatedOn: settings?.appActivatedOn || 'WEB',

		// Feature Flags
		maintenanceMode: settings?.maintenanceMode || false,
		allowNewRegistrations: settings?.allowNewRegistrations ?? true,
		emailVerificationRequired: settings?.emailVerificationRequired ?? true,
		phoneVerificationRequired: settings?.phoneVerificationRequired || false,
		twoFactorAuthEnabled: settings?.twoFactorAuthEnabled || false,

		// Messages
		showMaintenanceMessage: settings?.showMaintenanceMessage || false,
		maintenanceMessage: settings?.maintenanceMessage || '',
		bookingsServiceMessage: settings?.bookingsServiceMessage || '',
		realEstateServiceMessage: settings?.realEstateServiceMessage || '',
		marketplaceServiceMessage: settings?.marketplaceServiceMessage || '',
		restaurantsClubsSpotsServiceMessage: settings?.restaurantsClubsSpotsServiceMessage || '',

		// Security & Rate Limiting
		maxLoginAttempts: settings?.maxLoginAttempts || 5,
		loginCooldownMinutes: settings?.loginCooldownMinutes || 15,
		sessionTimeoutMinutes: settings?.sessionTimeoutMinutes || 60,
		apiRateLimitPerMinute: settings?.apiRateLimitPerMinute || 50,
		guestApiRateLimit: settings?.guestApiRateLimit || 20,
		authenticatedApiRateLimit: settings?.authenticatedApiRateLimit || 5,

		// Announcements
		showAnnouncementBanner: settings?.showAnnouncementBanner || false,
		announcementMessage: settings?.announcementMessage || '',
		announcementType: settings?.announcementType || 'info'
	});

	const handleChange = (field) => (event) => {
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	const serviceStatusOptions = ['ACTIVE', 'DEVELOPMENT', 'MAINTENANCE', 'DISABLED', 'COMING_SOON'];
	const paymentStatusOptions = ['ACTIVE', 'DISABLED', 'TESTING'];

	return (
		<form onSubmit={handleSubmit} className="p-24">
			<div className="flex items-center justify-between mb-24">
				<div>
					<Typography className="text-2xl font-bold">
						{settings ? 'Edit Settings' : 'Add New Settings'}
					</Typography>
					<Typography className="text-sm text-secondary mt-4">
						Configure platform settings and access controls
					</Typography>
				</div>
				<Chip
					label={formData.servicePlatform}
					color="primary"
					icon={<FuseSvgIcon size={16}>heroicons-solid:server</FuseSvgIcon>}
				/>
			</div>

			<Divider className="mb-24" />

			<div className="space-y-16">
				{/* Platform & Activation */}
				<Accordion defaultExpanded>
					<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
						<div className="flex items-center">
							<FuseSvgIcon className="mr-12" size={20}>
								heroicons-outline:server
							</FuseSvgIcon>
							<Typography className="font-semibold">Platform Configuration</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Service Platform</InputLabel>
									<Select
										value={formData.servicePlatform}
										onChange={handleChange('servicePlatform')}
										label="Service Platform"
										disabled={!!settings}
									>
										<MenuItem value="ADMIN">Admin Dashboard</MenuItem>
										<MenuItem value="MERCHANT">Merchant Portal</MenuItem>
										<MenuItem value="USER">User Portal</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>App Platform</InputLabel>
									<Select
										value={formData.appActivatedOn}
										onChange={handleChange('appActivatedOn')}
										label="App Platform"
									>
										 {/* CONTROLPANEL
  MERCHANTPORTAL
  USERPORTAL */}
										<MenuItem value="CONTROLPANEL">Control portal</MenuItem>
										<MenuItem value="MERCHANTPORTAL">Merchant panel</MenuItem>
										<MenuItem value="USERPORTAL">Users portal</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.isActive}
											onChange={handleChange('isActive')}
											color="success"
										/>
									}
									label={
										<div>
											<Typography className="font-medium">Activate Settings</Typography>
											<Typography className="text-xs text-secondary">
												Only one settings row per platform can be active
											</Typography>
										</div>
									}
								/>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* Service Status */}
				<Accordion>
					<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
						<div className="flex items-center">
							<FuseSvgIcon className="mr-12" size={20}>
								heroicons-outline:view-grid
							</FuseSvgIcon>
							<Typography className="font-semibold">Service Availability</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							{[
								{ label: 'Marketplace Service', field: 'marketplaceServiceStatus' },
								{ label: 'Bookings Service', field: 'bookingsServiceStatus' },
								{ label: 'Real Estate Service', field: 'realEstateServiceStatus' },
								{ label: 'Restaurants Service', field: 'restaurantsClubsSpotsServiceStatus' }
							].map((service) => (
								<Grid item xs={12} sm={6} key={service.field}>
									<FormControl fullWidth>
										<InputLabel>{service.label}</InputLabel>
										<Select
											value={formData[service.field]}
											onChange={handleChange(service.field)}
											label={service.label}
										>
											{serviceStatusOptions.map((status) => (
												<MenuItem key={status} value={status}>
													{status}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<TextField
										fullWidth
										size="small"
										label={`${service.label} Message`}
										value={formData[`${service.field.replace('Status', 'Message')}`] || ''}
										onChange={handleChange(service.field.replace('Status', 'Message'))}
										placeholder="Optional message when service is unavailable"
										className="mt-8"
									/>
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* Authentication & Access */}
				<Accordion>
					<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
						<div className="flex items-center">
							<FuseSvgIcon className="mr-12" size={20}>
								heroicons-outline:lock-closed
							</FuseSvgIcon>
							<Typography className="font-semibold">Authentication & Access Control</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography className="font-medium mb-12">Login Access</Typography>
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.usersLoginEnabled}
											onChange={handleChange('usersLoginEnabled')}
										/>
									}
									label="Users Login"
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.merchantsLoginEnabled}
											onChange={handleChange('merchantsLoginEnabled')}
										/>
									}
									label="Merchants Login"
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.adminsLoginEnabled}
											onChange={handleChange('adminsLoginEnabled')}
										/>
									}
									label="Admins Login"
								/>
							</Grid>
							<Grid item xs={12}>
								<Divider className="my-16" />
								<Typography className="font-medium mb-12">Registration</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.usersRegistrationEnabled}
											onChange={handleChange('usersRegistrationEnabled')}
										/>
									}
									label="Users Registration"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.merchantsRegistrationEnabled}
											onChange={handleChange('merchantsRegistrationEnabled')}
										/>
									}
									label="Merchants Registration"
								/>
							</Grid>
							<Grid item xs={12}>
								<Divider className="my-16" />
								<Typography className="font-medium mb-12">Security Features</Typography>
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.emailVerificationRequired}
											onChange={handleChange('emailVerificationRequired')}
										/>
									}
									label="Email Verification"
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.phoneVerificationRequired}
											onChange={handleChange('phoneVerificationRequired')}
										/>
									}
									label="Phone Verification"
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.twoFactorAuthEnabled}
											onChange={handleChange('twoFactorAuthEnabled')}
										/>
									}
									label="Two-Factor Auth"
								/>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* Payment Providers */}
				<Accordion>
					<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
						<div className="flex items-center">
							<FuseSvgIcon className="mr-12" size={20}>
								heroicons-outline:credit-card
							</FuseSvgIcon>
							<Typography className="font-semibold">Payment Providers</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							{[
								{ label: 'Paystack', field: 'paystackPaymentStatus' },
								{ label: 'Flutterwave', field: 'flutterwavePaymentStatus' },
								{ label: 'Direct Payment', field: 'directPayStatus' }
							].map((provider) => (
								<Grid item xs={12} sm={4} key={provider.field}>
									<FormControl fullWidth>
										<InputLabel>{provider.label}</InputLabel>
										<Select
											value={formData[provider.field]}
											onChange={handleChange(provider.field)}
											label={provider.label}
										>
											{paymentStatusOptions.map((status) => (
												<MenuItem key={status} value={status}>
													{status}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							))}
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* Maintenance & Announcements */}
				<Accordion>
					<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
						<div className="flex items-center">
							<FuseSvgIcon className="mr-12" size={20}>
								heroicons-outline:speakerphone
							</FuseSvgIcon>
							<Typography className="font-semibold">Maintenance & Announcements</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<FormControlLabel
									control={
										<Switch
											checked={formData.maintenanceMode}
											onChange={handleChange('maintenanceMode')}
											color="warning"
										/>
									}
									label={
										<div>
											<Typography className="font-medium">Maintenance Mode</Typography>
											<Typography className="text-xs text-secondary">
												Temporarily disable platform access
											</Typography>
										</div>
									}
								/>
							</Grid>
							{formData.maintenanceMode && (
								<Grid item xs={12}>
									<TextField
										fullWidth
										multiline
										rows={2}
										label="Maintenance Message"
										value={formData.maintenanceMessage}
										onChange={handleChange('maintenanceMessage')}
										placeholder="Enter message to display during maintenance"
									/>
								</Grid>
							)}
							<Grid item xs={12}>
								<Divider className="my-16" />
								<FormControlLabel
									control={
										<Switch
											checked={formData.showAnnouncementBanner}
											onChange={handleChange('showAnnouncementBanner')}
										/>
									}
									label="Show Announcement Banner"
								/>
							</Grid>
							{formData.showAnnouncementBanner && (
								<>
									<Grid item xs={12} sm={4}>
										<FormControl fullWidth>
											<InputLabel>Announcement Type</InputLabel>
											<Select
												value={formData.announcementType}
												onChange={handleChange('announcementType')}
												label="Announcement Type"
											>
												<MenuItem value="info">Info</MenuItem>
												<MenuItem value="success">Success</MenuItem>
												<MenuItem value="warning">Warning</MenuItem>
												<MenuItem value="error">Error</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} sm={8}>
										<TextField
											fullWidth
											label="Announcement Message"
											value={formData.announcementMessage}
											onChange={handleChange('announcementMessage')}
											placeholder="Enter announcement message"
										/>
									</Grid>
								</>
							)}
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* Rate Limiting & Security */}
				<Accordion>
					<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
						<div className="flex items-center">
							<FuseSvgIcon className="mr-12" size={20}>
								heroicons-outline:shield-check
							</FuseSvgIcon>
							<Typography className="font-semibold">Rate Limiting & Security</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									type="number"
									label="Max Login Attempts"
									value={formData.maxLoginAttempts}
									onChange={handleChange('maxLoginAttempts')}
									inputProps={{ min: 1, max: 10 }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									type="number"
									label="Login Cooldown (mins)"
									value={formData.loginCooldownMinutes}
									onChange={handleChange('loginCooldownMinutes')}
									inputProps={{ min: 5, max: 60 }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									type="number"
									label="Session Timeout (mins)"
									value={formData.sessionTimeoutMinutes}
									onChange={handleChange('sessionTimeoutMinutes')}
									inputProps={{ min: 15, max: 480 }}
								/>
							</Grid>
							<Grid item xs={12}>
								<Divider className="my-16" />
								<Typography className="font-medium mb-12">API Rate Limits</Typography>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									type="number"
									label="API Rate Limit (per min)"
									value={formData.apiRateLimitPerMinute}
									onChange={handleChange('apiRateLimitPerMinute')}
									inputProps={{ min: 10, max: 200 }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									type="number"
									label="Guest API Rate"
									value={formData.guestApiRateLimit}
									onChange={handleChange('guestApiRateLimit')}
									inputProps={{ min: 5, max: 50 }}
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									type="number"
									label="Authenticated API Rate"
									value={formData.authenticatedApiRateLimit}
									onChange={handleChange('authenticatedApiRateLimit')}
									inputProps={{ min: 1, max: 20 }}
								/>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			</div>

			{/* Action Buttons */}
			<Divider className="my-24" />
			<div className="flex items-center justify-end space-x-12">
				<Button onClick={onCancel} variant="outlined">
					Cancel
				</Button>
				<Button type="submit" variant="contained" color="secondary" 
				startIcon={<FuseSvgIcon size={16}>heroicons-outline:save</FuseSvgIcon>}
				disabled={isLoading}
				>
					{settings ? 'Update Settings' : 'Create Settings'}
				</Button>
			</div>
		</form>
	);
}

export default memo(SettingsForm);
