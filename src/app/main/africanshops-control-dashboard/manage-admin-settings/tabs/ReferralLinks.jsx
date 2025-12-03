import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { toast } from 'react-toastify';
import { useReferralLinks, useGenerateReferralLinks } from '../hooks/useReferralLinks';

/**
 * ReferralLinks Component
 * Manages admin referral links for merchant and user platforms
 * Allows generation and copying of referral links
 */

function ReferralLinks() {
	const { data: referralData, isLoading, error } = useReferralLinks();
	const generateLinks = useGenerateReferralLinks();
	const [copiedField, setCopiedField] = useState(null);

	console.log('ADMIN__REFERRALS', referralData);

	const handleCopyToClipboard = (text, fieldName) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopiedField(fieldName);
				toast.success(`${fieldName} copied to clipboard!`);
				setTimeout(() => setCopiedField(null), 2000);
			})
			.catch(() => {
				toast.error('Failed to copy to clipboard');
			});
	};

	const handleGenerateLinks = async () => {
		try {
			await generateLinks.mutateAsync();
			toast.success('Referral links generated successfully!');
		} catch (err) {
			toast.error('Failed to generate referral links');
		}
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
				<Alert severity="error">Failed to load referral links</Alert>
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

	const hasReferralLinks = referralData?.admin?.merchantReferralLink || referralData?.admin?.userReferralLink;

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full p-24 sm:p-32"
		>
			<div className="max-w-5xl mx-auto">
				{/* Introduction Card */}
				<motion.div variants={item}>
					<Card className="mb-32">
						<CardContent className="p-32">
							<Box className="flex items-start gap-16">
								<Box className="flex items-center justify-center w-56 h-56 rounded-full bg-primary-50">
									<FuseSvgIcon
										className="text-primary"
										size={32}
									>
										heroicons-outline:link
									</FuseSvgIcon>
								</Box>
								<Box className="flex-1">
									<Typography
										variant="h5"
										className="font-bold mb-12"
									>
										Referral Links Management
									</Typography>
									<Typography
										variant="body1"
										color="text.secondary"
										className="mb-16"
									>
										Generate and share your unique referral links to invite users and merchants to
										the AfricanShops platform. Track your referrals and earn rewards for successful
										conversions.
									</Typography>
									<Box className="flex flex-wrap gap-8">
										<Chip
											icon={<FuseSvgIcon size={16}>heroicons-outline:users</FuseSvgIcon>}
											label="User Platform"
											color="primary"
											variant="outlined"
										/>
										<Chip
											icon={<FuseSvgIcon size={16}>heroicons-outline:shopping-cart</FuseSvgIcon>}
											label="Merchant Platform"
											color="secondary"
											variant="outlined"
										/>
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>
				</motion.div>

				{!hasReferralLinks ? (
					/* Generate Links Card */
					<motion.div variants={item}>
						<Card>
							<CardContent className="p-48">
								<Box className="text-center">
									<Box className="flex items-center justify-center w-96 h-96 rounded-full bg-primary-50 mx-auto mb-24">
										<FuseSvgIcon
											className="text-primary"
											size={48}
										>
											heroicons-outline:plus-circle
										</FuseSvgIcon>
									</Box>
									<Typography
										variant="h6"
										className="font-semibold mb-12"
									>
										No Referral Links Generated
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										className="mb-32 max-w-md mx-auto"
									>
										You haven't generated your referral links yet. Click the button below to create
										your unique referral links for both merchant and user platforms.
									</Typography>
									<Button
										variant="contained"
										color="primary"
										size="large"
										onClick={handleGenerateLinks}
										disabled={generateLinks.isLoading}
										startIcon={
											generateLinks.isLoading ? (
												<CircularProgress size={20} />
											) : (
												<FuseSvgIcon size={20}>heroicons-outline:sparkles</FuseSvgIcon>
											)
										}
									>
										Generate Referral Links
									</Button>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				) : (
					/* Referral Links Display */
					<>
						{/* Statistics Card */}
						<motion.div variants={item}>
							<Card className="mb-32">
								<CardContent className="p-32">
									<Typography
										variant="h6"
										className="font-semibold mb-24"
									>
										Referral Statistics
									</Typography>
									<Grid
										container
										spacing={3}
									>
										<Grid
											item
											xs={12}
											sm={6}
											md={3}
										>
											<Paper
												className="p-20 text-center"
												elevation={0}
												sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
											>
												<Typography
													variant="h4"
													className="font-bold mb-4"
												>
													{referralData?.stats?.totalReferrals || 0}
												</Typography>
												<Typography variant="caption">Total Referrals</Typography>
											</Paper>
										</Grid>
										<Grid
											item
											xs={12}
											sm={6}
											md={3}
										>
											<Paper
												className="p-20 text-center"
												elevation={0}
												sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}
											>
												<Typography
													variant="h4"
													className="font-bold mb-4"
												>
													{referralData?.stats?.merchantReferrals || 0}
												</Typography>
												<Typography variant="caption">Merchant Referrals</Typography>
											</Paper>
										</Grid>
										<Grid
											item
											xs={12}
											sm={6}
											md={3}
										>
											<Paper
												className="p-20 text-center"
												elevation={0}
												sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}
											>
												<Typography
													variant="h4"
													className="font-bold mb-4"
												>
													{referralData?.stats?.userReferrals || 0}
												</Typography>
												<Typography variant="caption">User Referrals</Typography>
											</Paper>
										</Grid>
										<Grid
											item
											xs={12}
											sm={6}
											md={3}
										>
											<Paper
												className="p-20 text-center"
												elevation={0}
												sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}
											>
												<Typography
													variant="h4"
													className="font-bold mb-4"
												>
													{referralData?.stats?.activeReferrals || 0}
												</Typography>
												<Typography variant="caption">Active Users</Typography>
											</Paper>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</motion.div>

						{/* Merchant Referral Link Card */}
						<motion.div variants={item}>
							<Card className="mb-32">
								<CardContent className="p-32">
									<Box className="flex items-center justify-between mb-24">
										<Box className="flex items-center gap-16">
											<Box className="flex items-center justify-center w-48 h-48 rounded-lg bg-secondary-50">
												<FuseSvgIcon
													className="text-secondary"
													size={24}
												>
													heroicons-outline:shopping-cart
												</FuseSvgIcon>
											</Box>
											<Box>
												<Typography
													variant="h6"
													className="font-semibold"
												>
													Merchant Platform Referral Link
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Share this link with potential merchants
												</Typography>
											</Box>
										</Box>
										<Chip
											label="Merchant"
											color="secondary"
											size="small"
										/>
									</Box>

									<TextField
										fullWidth
										value={referralData?.admin?.merchantReferralLink || ''}
										InputProps={{
											readOnly: true,
											endAdornment: (
												<InputAdornment position="end">
													<Tooltip
														title={
															copiedField === 'Merchant Link'
																? 'Copied!'
																: 'Copy to clipboard'
														}
													>
														<IconButton
															onClick={() =>
																handleCopyToClipboard(
																	referralData?.admin?.merchantReferralLink,
																	'Merchant Link'
																)
															}
															edge="end"
															color={
																copiedField === 'Merchant Link' ? 'success' : 'primary'
															}
														>
															<FuseSvgIcon size={20}>
																{copiedField === 'Merchant Link'
																	? 'heroicons-outline:check'
																	: 'heroicons-outline:clipboard-copy'}
															</FuseSvgIcon>
														</IconButton>
													</Tooltip>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												bgcolor: 'background.paper'
											}
										}}
									/>

									<Box
										className="mt-16 p-16 rounded-lg"
										sx={{ bgcolor: 'background.default' }}
									>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											This link directs merchants to register on the merchant platform using your
											referral code. You'll receive credit for all successful merchant
											registrations.
										</Typography>
									</Box>
								</CardContent>
							</Card>
						</motion.div>

						{/* User Referral Link Card */}
						<motion.div variants={item}>
							<Card>
								<CardContent className="p-32">
									<Box className="flex items-center justify-between mb-24">
										<Box className="flex items-center gap-16">
											<Box className="flex items-center justify-center w-48 h-48 rounded-lg bg-primary-50">
												<FuseSvgIcon
													className="text-primary"
													size={24}
												>
													heroicons-outline:users
												</FuseSvgIcon>
											</Box>
											<Box>
												<Typography
													variant="h6"
													className="font-semibold"
												>
													User Platform Referral Link
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Share this link with potential users
												</Typography>
											</Box>
										</Box>
										<Chip
											label="User"
											color="primary"
											size="small"
										/>
									</Box>

									<TextField
										fullWidth
										value={referralData?.admin?.userReferralLink || ''}
										InputProps={{
											readOnly: true,
											endAdornment: (
												<InputAdornment position="end">
													<Tooltip
														title={
															copiedField === 'User Link'
																? 'Copied!'
																: 'Copy to clipboard'
														}
													>
														<IconButton
															onClick={() =>
																handleCopyToClipboard(
																	referralData?.admin?.userReferralLink,
																	'User Link'
																)
															}
															edge="end"
															color={copiedField === 'User Link' ? 'success' : 'primary'}
														>
															<FuseSvgIcon size={20}>
																{copiedField === 'User Link'
																	? 'heroicons-outline:check'
																	: 'heroicons-outline:clipboard-copy'}
															</FuseSvgIcon>
														</IconButton>
													</Tooltip>
												</InputAdornment>
											)
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												bgcolor: 'background.paper'
											}
										}}
									/>

									<Box
										className="mt-16 p-16 rounded-lg"
										sx={{ bgcolor: 'background.default' }}
									>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											This link directs users to register on the customer platform using your
											referral code. You'll receive credit for all successful user registrations.
										</Typography>
									</Box>
								</CardContent>
							</Card>
						</motion.div>

						{/* Regenerate Button */}
						<motion.div
							variants={item}
							className="mt-32"
						>
							<Box className="flex justify-center">
								<Button
									variant="outlined"
									color="primary"
									onClick={handleGenerateLinks}
									disabled={generateLinks.isLoading}
									startIcon={
										generateLinks.isLoading ? (
											<CircularProgress size={20} />
										) : (
											<FuseSvgIcon size={20}>heroicons-outline:refresh</FuseSvgIcon>
										)
									}
								>
									Regenerate Links
								</Button>
							</Box>
						</motion.div>
					</>
				)}
			</div>
		</motion.div>
	);
}

export default ReferralLinks;
