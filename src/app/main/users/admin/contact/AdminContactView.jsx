import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns/format';

// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

// Fuse Components
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';

// API Hooks
import {
	useAdminStaffBlockMutation,
	useAdminStaffSuspenMutation,
	useAdminStaffUnBlockMutation,
	useAdminStaffUnSuspednMutation,
	useSingleAdminStaff
} from 'src/app/api/admin-users/useAdmins';

/**
 * Animation Variants
 */
const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2
		}
	}
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

const cardVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	show: {
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 15
		}
	}
};

/**
 * Professional Admin Contact View Component
 * Displays detailed admin staff information with compliance status and disciplinary actions
 */
function AdminContactView() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const routeParams = useParams();
	const { id: contactId } = routeParams;

	// State Management
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		title: '',
		message: '',
		action: null,
		actionLabel: '',
		severity: 'warning'
	});

	// API Hooks
	const {
		data: admin,
		isLoading: adminLoading,
		isError: adminIsError
	} = useSingleAdminStaff(contactId, {
		skip: !contactId
	});

	const handleSuspension = useAdminStaffSuspenMutation();
	const handleLiftSuspension = useAdminStaffUnSuspednMutation();
	const handleBlockAdmin = useAdminStaffBlockMutation();
	const handleUnBlockAdmin = useAdminStaffUnBlockMutation();

	// Memoized admin data
	const adminData = useMemo(() => admin?.data?.admin, [admin]);

	/**
	 * Confirmation Dialog Handler
	 */
	const openConfirmDialog = useCallback((title, message, action, actionLabel, severity = 'warning') => {
		setConfirmDialog({
			open: true,
			title,
			message,
			action,
			actionLabel,
			severity
		});
	}, []);

	const closeConfirmDialog = useCallback(() => {
		setConfirmDialog({
			open: false,
			title: '',
			message: '',
			action: null,
			actionLabel: '',
			severity: 'warning'
		});
	}, []);

	const handleConfirmAction = useCallback(() => {
		if (confirmDialog.action) {
			confirmDialog.action();
		}
		closeConfirmDialog();
	}, [confirmDialog, closeConfirmDialog]);

	/**
	 * Disciplinary Action Handlers
	 */
	const suspendAdmin = useCallback(() => {
		openConfirmDialog(
			'Suspend Admin Staff',
			`Are you sure you want to suspend ${adminData?.name}? This will restrict their access to the system.`,
			() => handleSuspension.mutate(adminData?._id || adminData?.id),
			'Suspend',
			'error'
		);
	}, [adminData, handleSuspension, openConfirmDialog]);

	const removeAdminSuspension = useCallback(() => {
		openConfirmDialog(
			'Lift Suspension',
			`Are you sure you want to remove the suspension from ${adminData?.name}? They will regain access to the system.`,
			() => handleLiftSuspension.mutate(adminData?._id || adminData?.id),
			'Lift Suspension',
			'info'
		);
	}, [adminData, handleLiftSuspension, openConfirmDialog]);

	const blockAdmin = useCallback(() => {
		openConfirmDialog(
			'Block Admin Staff',
			`Are you sure you want to block ${adminData?.name}? This is a severe action that will completely prevent their access.`,
			() => handleBlockAdmin.mutate(adminData?._id || adminData?.id),
			'Block',
			'error'
		);
	}, [adminData, handleBlockAdmin, openConfirmDialog]);

	const unblockAdmin = useCallback(() => {
		openConfirmDialog(
			'Unblock Admin Staff',
			`Are you sure you want to unblock ${adminData?.name}? They will be able to access the system again.`,
			() => handleUnBlockAdmin.mutate(adminData?._id || adminData?.id),
			'Unblock',
			'success'
		);
	}, [adminData, handleUnBlockAdmin, openConfirmDialog]);

	/**
	 * Loading State
	 */
	if (adminLoading) {
		return (
			<Box className="p-24 sm:p-48">
				<Box className="max-w-5xl mx-auto">
					<Skeleton variant="rectangular" height={192} className="rounded-16 mb-24" />
					<Box className="flex items-center gap-16 mb-24">
						<Skeleton variant="circular" width={128} height={128} />
						<Box className="flex-1">
							<Skeleton variant="text" width="40%" height={40} />
							<Skeleton variant="text" width="30%" height={30} className="mt-8" />
						</Box>
					</Box>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Skeleton variant="rectangular" height={300} className="rounded-16" />
						</Grid>
						<Grid item xs={12} md={6}>
							<Skeleton variant="rectangular" height={300} className="rounded-16" />
						</Grid>
					</Grid>
				</Box>
			</Box>
		);
	}

	/**
	 * Error State
	 */
	if (adminIsError || !adminData) {
		setTimeout(() => {
			navigate('/users/admin');
			dispatch(showMessage({ message: 'Admin staff not found' }));
		}, 0);
		return null;
	}

	/**
	 * Get Status Badge Color
	 */
	const getStatusColor = () => {
		if (adminData?.isBlocked) return 'error';
		if (adminData?.isSuspended) return 'warning';
		return 'success';
	};

	const getStatusLabel = () => {
		if (adminData?.isBlocked) return 'Blocked';
		if (adminData?.isSuspended) return 'Suspended';
		return 'Active';
	};

	return (
		<>
			{/* Header Background */}
			<Box
				component={motion.div}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					background: adminData?.background
						? `url(${adminData.background}) center/cover`
						: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					'&::after': {
						content: '""',
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
					}
				}}
			/>

			{/* Main Content */}
			<Box
				component={motion.div}
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0"
			>
				<Box className="w-full max-w-5xl">
					{/* Profile Header */}
					<Box
						component={motion.div}
						variants={itemVariants}
						className="flex flex-col sm:flex-row items-start sm:items-end -mt-64 gap-16"
					>
						<Badge
							overlap="circular"
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							badgeContent={
								<Box
									className="w-32 h-32 rounded-full border-4 border-white"
									sx={{
										bgcolor: getStatusColor() === 'success' ? 'success.main' : getStatusColor() === 'error' ? 'error.main' : 'warning.main'
									}}
								/>
							}
						>
							<Avatar
								sx={{
									width: 128,
									height: 128,
									borderWidth: 4,
									borderStyle: 'solid',
									borderColor: 'background.paper',
									bgcolor: 'primary.main',
									fontSize: 48,
									fontWeight: 700,
									boxShadow: 3
								}}
								src={adminData?.avatar}
								alt={adminData?.name}
							>
								{adminData?.name?.charAt(0)?.toUpperCase()}
							</Avatar>
						</Badge>

						<Box className="flex-1 min-w-0">
							<Typography
								variant="h4"
								className="font-bold truncate mb-8"
								component={motion.div}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
							>
								{adminData?.name}
							</Typography>

							<Box className="flex flex-wrap gap-8 mb-12">
								<Chip
									label={adminData?.designation?.name || 'No Designation'}
									color="primary"
									size="small"
									icon={<FuseSvgIcon size={16}>heroicons-outline:briefcase</FuseSvgIcon>}
								/>
								<Chip
									label={getStatusLabel()}
									color={getStatusColor()}
									size="small"
									variant="filled"
								/>
								{adminData?.department?.name && (
									<Chip
										label={adminData.department.name}
										variant="outlined"
										size="small"
										icon={<FuseSvgIcon size={16}>heroicons-outline:office-building</FuseSvgIcon>}
									/>
								)}
							</Box>
						</Box>

						<Tooltip title="Edit Admin Profile">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="edit"
								startIcon={<FuseSvgIcon>heroicons-outline:pencil-alt</FuseSvgIcon>}
								className="whitespace-nowrap"
								sx={{ boxShadow: 2 }}
							>
								Edit Profile
							</Button>
						</Tooltip>
					</Box>

					<Divider className="my-32" />

					{/* Contact Information Section */}
					<motion.div variants={itemVariants}>
						<Paper elevation={0} className="p-24 mb-32 rounded-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
							<Typography variant="h6" className="font-semibold mb-16 flex items-center gap-8">
								<FuseSvgIcon size={24} color="action">heroicons-outline:user-circle</FuseSvgIcon>
								Contact Information
							</Typography>

							<Grid container spacing={3}>
								{/* Company */}
								<Grid item xs={12} sm={6}>
									<Box className="flex items-start gap-12">
										<FuseSvgIcon color="action">heroicons-outline:office-building</FuseSvgIcon>
										<Box>
											<Typography variant="caption" color="text.secondary" className="block mb-4">
												Company
											</Typography>
											<Typography variant="body1" className="font-medium">
												AFRICANSHOPS
											</Typography>
										</Box>
									</Box>
								</Grid>

								{/* Department */}
								{adminData?.department?.name && (
									<Grid item xs={12} sm={6}>
										<Box className="flex items-start gap-12">
											<FuseSvgIcon color="action">heroicons-outline:briefcase</FuseSvgIcon>
											<Box>
												<Typography variant="caption" color="text.secondary" className="block mb-4">
													Department
												</Typography>
												<Typography variant="body1" className="font-medium">
													{adminData.department.name}
												</Typography>
											</Box>
										</Box>
									</Grid>
								)}

								{/* Email */}
								{adminData?.email && (
									<Grid item xs={12} sm={6}>
										<Box className="flex items-start gap-12">
											<FuseSvgIcon color="action">heroicons-outline:mail</FuseSvgIcon>
											<Box className="min-w-0">
												<Typography variant="caption" color="text.secondary" className="block mb-4">
													Email Address
												</Typography>
												<Typography
													component="a"
													href={`mailto:${adminData.email}`}
													variant="body1"
													className="font-medium hover:underline text-primary-500 truncate block"
												>
													{adminData.email}
												</Typography>
											</Box>
										</Box>
									</Grid>
								)}

								{/* Phone */}
								{adminData?.phone && (
									<Grid item xs={12} sm={6}>
										<Box className="flex items-start gap-12">
											<FuseSvgIcon color="action">heroicons-outline:phone</FuseSvgIcon>
											<Box>
												<Typography variant="caption" color="text.secondary" className="block mb-4">
													Phone Number
												</Typography>
												<Typography variant="body1" className="font-medium font-mono">
													{adminData.phone}
												</Typography>
											</Box>
										</Box>
									</Grid>
								)}

								{/* Address */}
								{adminData?.address && (
									<Grid item xs={12} sm={6}>
										<Box className="flex items-start gap-12">
											<FuseSvgIcon color="action">heroicons-outline:location-marker</FuseSvgIcon>
											<Box>
												<Typography variant="caption" color="text.secondary" className="block mb-4">
													Address
												</Typography>
												<Typography variant="body1" className="font-medium">
													{adminData.address}
												</Typography>
											</Box>
										</Box>
									</Grid>
								)}

								{/* Birthday */}
								{adminData?.birthday && (
									<Grid item xs={12} sm={6}>
										<Box className="flex items-start gap-12">
											<FuseSvgIcon color="action">heroicons-outline:cake</FuseSvgIcon>
											<Box>
												<Typography variant="caption" color="text.secondary" className="block mb-4">
													Birthday
												</Typography>
												<Typography variant="body1" className="font-medium">
													{format(new Date(adminData.birthday), 'MMMM d, yyyy')}
												</Typography>
											</Box>
										</Box>
									</Grid>
								)}

								{/* Gender */}
								{adminData?.gender && (
									<Grid item xs={12} sm={6}>
										<Box className="flex items-start gap-12">
											<FuseSvgIcon color="action">heroicons-outline:user</FuseSvgIcon>
											<Box>
												<Typography variant="caption" color="text.secondary" className="block mb-4">
													Gender
												</Typography>
												<Typography variant="body1" className="font-medium">
													{adminData.gender}
												</Typography>
											</Box>
										</Box>
									</Grid>
								)}
							</Grid>
						</Paper>
					</motion.div>

					{/* Compliance and Disciplinary Actions */}
					<Grid container spacing={3}>
						{/* Admin Compliance Card */}
						<Grid item xs={12} md={6}>
							<motion.div variants={cardVariants}>
								<Card className="rounded-16" elevation={2}>
									<CardContent>
										<Box className="flex items-center justify-between mb-16">
											<Typography variant="h6" className="font-semibold flex items-center gap-8">
												<FuseSvgIcon color="action">heroicons-outline:shield-check</FuseSvgIcon>
												Compliance Status
											</Typography>
										</Box>

										<List className="p-0">
											{/* Suspension Status */}
											<ListItem
												className="px-0 py-8 rounded-8 hover:bg-gray-50 dark:hover:bg-gray-800"
												sx={{ transition: 'background-color 0.2s' }}
											>
												<ListItemText
													primary={
														<Typography variant="body1" className="font-medium">
															Suspension Status
														</Typography>
													}
													secondary={
														<Typography variant="caption" color="text.secondary">
															{adminData?.isSuspended ? 'Access restricted' : 'Full access granted'}
														</Typography>
													}
												/>
												<Box className="flex items-center gap-8">
													{!adminData?.isSuspended ? (
														<>
															<Chip
																label="Active"
																color="success"
																size="small"
																variant="filled"
															/>
															<FuseSvgIcon color="success" size={24}>
																heroicons-outline:check-circle
															</FuseSvgIcon>
														</>
													) : (
														<>
															<Chip
																label="Suspended"
																color="error"
																size="small"
																variant="filled"
															/>
															<FuseSvgIcon color="error" size={24}>
																heroicons-outline:x-circle
															</FuseSvgIcon>
														</>
													)}
												</Box>
											</ListItem>

											<Divider className="my-8" />

											{/* Block Status */}
											<ListItem
												className="px-0 py-8 rounded-8 hover:bg-gray-50 dark:hover:bg-gray-800"
												sx={{ transition: 'background-color 0.2s' }}
											>
												<ListItemText
													primary={
														<Typography variant="body1" className="font-medium">
															Block Status
														</Typography>
													}
													secondary={
														<Typography variant="caption" color="text.secondary">
															{adminData?.isBlocked ? 'Completely blocked' : 'Not blocked'}
														</Typography>
													}
												/>
												<Box className="flex items-center gap-8">
													{!adminData?.isBlocked ? (
														<>
															<Chip
																label="Unblocked"
																color="success"
																size="small"
																variant="filled"
															/>
															<FuseSvgIcon color="success" size={24}>
																heroicons-outline:check-circle
															</FuseSvgIcon>
														</>
													) : (
														<>
															<Chip
																label="Blocked"
																color="error"
																size="small"
																variant="filled"
															/>
															<FuseSvgIcon color="error" size={24}>
																heroicons-outline:ban
															</FuseSvgIcon>
														</>
													)}
												</Box>
											</ListItem>
										</List>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>

						{/* Disciplinary Actions Card */}
						<Grid item xs={12} md={6}>
							<motion.div variants={cardVariants}>
								<Card className="rounded-16" elevation={2}>
									<CardContent>
										<Box className="flex items-center justify-between mb-16">
											<Typography variant="h6" className="font-semibold flex items-center gap-8">
												<FuseSvgIcon color="action">heroicons-outline:exclamation</FuseSvgIcon>
												Disciplinary Actions
											</Typography>
										</Box>

										{/* Alert Message */}
										<Alert severity="warning" className="mb-16" icon={<FuseSvgIcon>heroicons-outline:information-circle</FuseSvgIcon>}>
											<Typography variant="caption">
												These actions will affect the staff member's access to the system. Use with caution.
											</Typography>
										</Alert>

										<List className="p-0">
											{/* Suspend/Unsuspend Actions */}
											{!adminData?.isSuspended ? (
												<ListItem className="px-0 py-12 flex-col items-stretch gap-12">
													<Box className="flex items-start justify-between w-full">
														<ListItemText
															primary={
																<Typography variant="body1" className="font-medium">
																	Suspend Staff
																</Typography>
															}
															secondary={
																<Typography variant="caption" color="text.secondary">
																	Temporarily restrict system access
																</Typography>
															}
														/>
													</Box>
													<Button
														variant="contained"
														color="error"
														size="small"
														fullWidth
														startIcon={<FuseSvgIcon>heroicons-outline:ban</FuseSvgIcon>}
														onClick={suspendAdmin}
														disabled={handleSuspension.isLoading}
													>
														{handleSuspension.isLoading ? 'Processing...' : 'Suspend Admin'}
													</Button>
												</ListItem>
											) : (
												!adminData?.isBlocked && (
													<ListItem className="px-0 py-12 flex-col items-stretch gap-12">
														<Box className="flex items-start justify-between w-full">
															<ListItemText
																primary={
																	<Typography variant="body1" className="font-medium">
																		Lift Suspension
																	</Typography>
																}
																secondary={
																	<Typography variant="caption" color="text.secondary">
																		Restore system access
																	</Typography>
																}
															/>
														</Box>
														<Button
															variant="contained"
															color="warning"
															size="small"
															fullWidth
															startIcon={<FuseSvgIcon>heroicons-outline:check</FuseSvgIcon>}
															onClick={removeAdminSuspension}
															disabled={handleLiftSuspension.isLoading}
														>
															{handleLiftSuspension.isLoading ? 'Processing...' : 'Lift Suspension'}
														</Button>
													</ListItem>
												)
											)}

											{adminData?.isBlocked && !adminData?.isSuspended && (
												<Alert severity="info" className="mb-12">
													<Typography variant="caption">
														Unblock this admin before performing other actions
													</Typography>
												</Alert>
											)}

											<Divider className="my-8" />

											{/* Block/Unblock Actions */}
											{adminData?.isSuspended && (
												!adminData?.isBlocked ? (
													<ListItem className="px-0 py-12 flex-col items-stretch gap-12">
														<Box className="flex items-start justify-between w-full">
															<ListItemText
																primary={
																	<Typography variant="body1" className="font-medium">
																		Block Staff
																	</Typography>
																}
																secondary={
																	<Typography variant="caption" color="text.secondary">
																		Completely prevent system access
																	</Typography>
																}
															/>
														</Box>
														<Button
															variant="contained"
															color="error"
															size="small"
															fullWidth
															startIcon={<FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>}
															onClick={blockAdmin}
															disabled={handleBlockAdmin.isLoading}
														>
															{handleBlockAdmin.isLoading ? 'Processing...' : 'Block Admin'}
														</Button>
													</ListItem>
												) : (
													<ListItem className="px-0 py-12 flex-col items-stretch gap-12">
														<Box className="flex items-start justify-between w-full">
															<ListItemText
																primary={
																	<Typography variant="body1" className="font-medium">
																		Unblock Staff
																	</Typography>
																}
																secondary={
																	<Typography variant="caption" color="text.secondary">
																		Allow system access again
																	</Typography>
																}
															/>
														</Box>
														<Button
															variant="contained"
															color="success"
															size="small"
															fullWidth
															startIcon={<FuseSvgIcon>heroicons-outline:lock-open</FuseSvgIcon>}
															onClick={unblockAdmin}
															disabled={handleUnBlockAdmin.isLoading}
														>
															{handleUnBlockAdmin.isLoading ? 'Processing...' : 'Unblock Admin'}
														</Button>
													</ListItem>
												)
											)}
										</List>
									</CardContent>
								</Card>
							</motion.div>
						</Grid>
					</Grid>
				</Box>
			</Box>

			{/* Confirmation Dialog */}
			<Dialog
				open={confirmDialog.open}
				onClose={closeConfirmDialog}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					className: 'rounded-16'
				}}
			>
				<DialogTitle className="flex items-center gap-12">
					<FuseSvgIcon
						color={
							confirmDialog.severity === 'error' ? 'error' :
							confirmDialog.severity === 'success' ? 'success' :
							confirmDialog.severity === 'info' ? 'info' : 'warning'
						}
					>
						heroicons-outline:exclamation
					</FuseSvgIcon>
					{confirmDialog.title}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{confirmDialog.message}
					</DialogContentText>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={closeConfirmDialog}
						variant="outlined"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmAction}
						variant="contained"
						color={
							confirmDialog.severity === 'error' ? 'error' :
							confirmDialog.severity === 'success' ? 'success' :
							confirmDialog.severity === 'info' ? 'primary' : 'warning'
						}
						autoFocus
					>
						{confirmDialog.actionLabel}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default AdminContactView;
