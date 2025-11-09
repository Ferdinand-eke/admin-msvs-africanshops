import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAdminProfile, useUpdateAdminSocialMedia } from '../hooks/useAdminProfile';

/**
 * ProfileView Component
 * Displays admin profile information with editable social media handles
 * Critical profile changes require HR approval
 */
function ProfileView() {
	const [isEditing, setIsEditing] = useState(false);
	const { data: profile, isLoading, error } = useAdminProfile();
	const updateSocialMedia = useUpdateAdminSocialMedia();

	console.log("Profile\__ON__COMPONENT", profile)

	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			whatsapp: ''
		}
	});

	useEffect(() => {
		if (profile?.admin) {
			reset({
				facebook: profile?.admin?.facebook || '',
				twitter: profile?.admin?.twitter || '',
				linkedin: profile?.admin?.linkedin || '',
				instagram: profile?.admin?.instagram || '',
				whatsapp: profile?.admin?.whatsapp || ''
			});
		}
	}, [profile, reset]);

	const onSubmit = async (data) => {
		try {
			await updateSocialMedia.mutateAsync(data);
			toast.success('Social media handles updated successfully');
			setIsEditing(false);
		} catch (err) {
			toast.error('Failed to update social media handles');
		}
	};

	const handleCancel = () => {
		if (profile?.admin?.socialMedia) {
			reset({
				facebook: profile?.admin?.facebook || '',
				twitter: profile?.admin?.twitter || '',
				linkedin: profile?.admin?.linkedin || '',
				instagram: profile?.admin?.instagram || '',
				whatsapp: profile?.admin?.whatsapp || ''
			});
		}
		setIsEditing(false);
	};

	if (isLoading) {
		return (
			<Box className="flex items-center justify-center h-full min-h-320">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box className="p-24">
				<Alert severity="error">Failed to load profile information</Alert>
			</Box>
		);
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.05
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full p-24 sm:p-32"
		>
			<div className="max-w-5xl mx-auto">
				{/* Profile Header Card */}
				<motion.div variants={item}>
					<Card className="mb-32">
						<CardContent className="p-32">
							<Box className="flex flex-col sm:flex-row items-center sm:items-start gap-24">
								<Avatar
									className="w-128 h-128"
									sx={{
										fontSize: 48,
										bgcolor: 'primary.main'
									}}
								>
									{profile?.admin?.name?.charAt(0)?.toUpperCase() || 'A'}
								</Avatar>
								<Box className="flex-1 text-center sm:text-left">
									<Typography variant="h4" className="font-bold mb-8">
										{profile?.admin?.name || 'Admin User'}
									</Typography>
									<Typography variant="subtitle1" color="text.secondary" className="mb-16">
										{profile?.admin?.email || 'admin@example.com'}
									</Typography>
									<Box className="flex flex-wrap gap-8 justify-center sm:justify-start">
										<Chip
											label={profile?.admin?.department?.name || 'No Department'}
											color="primary"
											variant="outlined"
											size="small"
										/>
										<Chip
											label={profile?.admin?.designation?.name || 'No Designation'}
											color="secondary"
											variant="outlined"
											size="small"
										/>
										{profile?.admin?.isLeader && (
											<Chip
												label="Leadership"
												color="success"
												size="small"
											/>
										)}
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</motion.div>

				{/* Personal Information Card */}
				<motion.div variants={item}>
					<Card className="mb-32">
						<CardContent className="p-32">
							<Box className="flex items-center justify-between mb-24">
								<Typography variant="h6" className="font-semibold">
									Personal Information
								</Typography>
								<Chip
									icon={<FuseSvgIcon size={16}>heroicons-outline:lock-closed</FuseSvgIcon>}
									label="HR Approval Required"
									size="small"
									color="warning"
								/>
							</Box>
							<Alert severity="info" className="mb-24">
								Changes to personal information (name, email, phone) require HR approval. Please contact HR department for such updates.
							</Alert>
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Box>
										<Typography variant="caption" color="text.secondary" className="mb-4">
											Full Name
										</Typography>
										<Typography variant="body1" className="font-medium">
											{profile?.admin?.name || 'N/A'}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box>
										<Typography variant="caption" color="text.secondary" className="mb-4">
											Email Address
										</Typography>
										<Typography variant="body1" className="font-medium">
											{profile?.admin?.email || 'N/A'}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box>
										<Typography variant="caption" color="text.secondary" className="mb-4">
											Phone Number
										</Typography>
										<Typography variant="body1" className="font-medium">
											{profile?.admin?.phone || 'Not provided'}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box>
										<Typography variant="caption" color="text.secondary" className="mb-4">
											Employee ID
										</Typography>
										<Typography variant="body1" className="font-medium">
											{profile?.admin?.employeeId || 'N/A'}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box>
										<Typography variant="caption" color="text.secondary" className="mb-4">
											Department
										</Typography>
										<Typography variant="body1" className="font-medium">
											{profile?.admin?.department?.name || 'Not assigned'}
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box>
										<Typography variant="caption" color="text.secondary" className="mb-4">
											Designation
										</Typography>
										<Typography variant="body1" className="font-medium">
											{profile?.admin?.designation?.name || 'Not assigned'}
										</Typography>
									</Box>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</motion.div>

				{/* Social Media Handles Card */}
				<motion.div variants={item}>
					<Card>
						<CardContent className="p-32">
							<Box className="flex items-center justify-between mb-24">
								<Typography variant="h6" className="font-semibold">
									Social Media Handles
								</Typography>
								{!isEditing && (
									<Button
										variant="contained"
										color="primary"
										startIcon={<FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>}
										onClick={() => setIsEditing(true)}
									>
										Edit
									</Button>
								)}
							</Box>

							{isEditing ? (
								<form onSubmit={handleSubmit(onSubmit)}>
									<Grid container spacing={3}>
										<Grid item xs={12} sm={6}>
											<Controller
												name="facebook"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														label="Facebook"
														placeholder="https://facebook.com/username"
														fullWidth
														InputProps={{
															startAdornment: (
																<FuseSvgIcon size={20} className="mr-8">
																	heroicons-outline:globe-alt
																</FuseSvgIcon>
															)
														}}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Controller
												name="twitter"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														label="Twitter/X"
														placeholder="https://twitter.com/username"
														fullWidth
														InputProps={{
															startAdornment: (
																<FuseSvgIcon size={20} className="mr-8">
																	heroicons-outline:globe-alt
																</FuseSvgIcon>
															)
														}}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Controller
												name="linkedin"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														label="LinkedIn"
														placeholder="https://linkedin.com/in/username"
														fullWidth
														InputProps={{
															startAdornment: (
																<FuseSvgIcon size={20} className="mr-8">
																	heroicons-outline:globe-alt
																</FuseSvgIcon>
															)
														}}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Controller
												name="instagram"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														label="Instagram"
														placeholder="https://instagram.com/username"
														fullWidth
														InputProps={{
															startAdornment: (
																<FuseSvgIcon size={20} className="mr-8">
																	heroicons-outline:globe-alt
																</FuseSvgIcon>
															)
														}}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Controller
												name="whatsapp"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														label="WhatsApp"
														placeholder="+234XXXXXXXXXX"
														fullWidth
														InputProps={{
															startAdornment: (
																<FuseSvgIcon size={20} className="mr-8">
																	heroicons-outline:phone
																</FuseSvgIcon>
															)
														}}
													/>
												)}
											/>
										</Grid>
									</Grid>

									<Box className="flex gap-16 mt-32">
										<Button
											type="submit"
											variant="contained"
											color="primary"
											disabled={updateSocialMedia.isLoading}
											startIcon={
												updateSocialMedia.isLoading ? (
													<CircularProgress size={20} />
												) : (
													<FuseSvgIcon size={20}>heroicons-outline:check</FuseSvgIcon>
												)
											}
										>
											Save Changes
										</Button>
										<Button
											variant="outlined"
											onClick={handleCancel}
											disabled={updateSocialMedia.isLoading}
										>
											Cancel
										</Button>
									</Box>
								</form>
							) : (
								<Grid container spacing={3}>
									{[
										{ label: 'Facebook', value: profile?.admin?.socialMedia?.facebook, icon: 'heroicons-outline:globe-alt' },
										{ label: 'Twitter/X', value: profile?.admin?.socialMedia?.twitter, icon: 'heroicons-outline:globe-alt' },
										{ label: 'LinkedIn', value: profile?.admin?.socialMedia?.linkedin, icon: 'heroicons-outline:globe-alt' },
										{ label: 'Instagram', value: profile?.admin?.socialMedia?.instagram, icon: 'heroicons-outline:globe-alt' },
										{ label: 'WhatsApp', value: profile?.admin?.socialMedia?.whatsapp, icon: 'heroicons-outline:phone' }
									].map((social) => (
										<Grid item xs={12} sm={6} key={social.label}>
											<Box className="flex items-center gap-12">
												<FuseSvgIcon size={20} color="action">
													{social.icon}
												</FuseSvgIcon>
												<Box className="flex-1">
													<Typography variant="caption" color="text.secondary">
														{social.label}
													</Typography>
													<Typography variant="body2" className="font-medium">
														{social.value || 'Not provided'}
													</Typography>
												</Box>
											</Box>
										</Grid>
									))}
								</Grid>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	);
}

export default ProfileView;
