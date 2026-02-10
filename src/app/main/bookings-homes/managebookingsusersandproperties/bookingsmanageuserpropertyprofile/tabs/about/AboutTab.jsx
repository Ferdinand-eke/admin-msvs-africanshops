import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Grid, Divider, Avatar, Button, Rating, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

/**
 * The about tab - displays merchant profile and listed properties
 */
function AboutTab({ merchant }) {
	// Mock properties data based on the bookinglistproperties model
	const [mockProperties] = useState([
		{
			id: '1',
			title: 'Luxury Ocean View Suite',
			slug: 'luxury-ocean-view-suite',
			category: 'Hotel Room',
			price: 25000,
			roomCount: 3,
			bathroomCount: 2,
			guestCount: 6,
			rating: 4.8,
			numReviews: 124,
			isPublished: true,
			isFeatured: true,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Beautiful ocean-facing suite with modern amenities and stunning views',
			listingAccountBalance: 450000
		},
		{
			id: '2',
			title: 'Executive Apartment Downtown',
			slug: 'executive-apartment-downtown',
			category: 'Apartment',
			price: 18000,
			roomCount: 2,
			bathroomCount: 2,
			guestCount: 4,
			rating: 4.5,
			numReviews: 89,
			isPublished: true,
			isFeatured: false,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Modern apartment in the heart of the city with easy access to amenities',
			listingAccountBalance: 320000
		},
		{
			id: '3',
			title: 'Cozy Beach Bungalow',
			slug: 'cozy-beach-bungalow',
			category: 'Bungalow',
			price: 12000,
			roomCount: 1,
			bathroomCount: 1,
			guestCount: 2,
			rating: 4.9,
			numReviews: 156,
			isPublished: true,
			isFeatured: true,
			imageSrc: 'assets/images/apps/ecommerce/product-image-placeholder.png',
			description: 'Intimate beachfront bungalow perfect for romantic getaways',
			listingAccountBalance: 280000
		}
	]);

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
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
			className="w-full"
		>
			<div className="md:flex md:space-x-32">
				<div className="flex flex-col flex-1">
					{/* Merchant Business Information */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24 flex items-center justify-between">
							<Typography className="text-2xl font-semibold leading-tight">Business Information</Typography>
							<Chip
								label={merchant?.verified ? 'Verified Merchant' : 'Unverified'}
								color={merchant?.verified ? 'success' : 'default'}
								size="small"
								icon={
									<FuseSvgIcon size={14}>
										{merchant?.verified ? 'heroicons-outline:badge-check' : 'heroicons-outline:x-circle'}
									</FuseSvgIcon>
								}
							/>
						</div>

						<CardContent className="px-32 py-24">
							<Grid
								container
								spacing={3}
							>
								<Grid
									item
									xs={12}
									md={6}
								>
									<div className="mb-24">
										<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
											<FuseSvgIcon
												size={18}
												className="text-grey-600"
											>
												heroicons-outline:office-building
											</FuseSvgIcon>
											Business Name
										</Typography>
										<Typography className="ml-26">{merchant?.shopname}</Typography>
									</div>

									<div className="mb-24">
										<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
											<FuseSvgIcon
												size={18}
												className="text-grey-600"
											>
												heroicons-outline:identification
											</FuseSvgIcon>
											Business ID
										</Typography>
										<Typography className="ml-26 font-mono text-13">
											{merchant?.shopId || merchant?.id}
										</Typography>
									</div>

									<div className="mb-24">
										<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
											<FuseSvgIcon
												size={18}
												className="text-grey-600"
											>
												heroicons-outline:clipboard-list
											</FuseSvgIcon>
											Plan Type
										</Typography>
										<Chip
											label={merchant?.shopplan?.plansname || merchant?.merchantShopplan?.plansname || 'N/A'}
											color="primary"
											size="small"
											className="ml-26"
										/>
									</div>
								</Grid>

								<Grid
									item
									xs={12}
									md={6}
								>
									<div className="mb-24">
										<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
											<FuseSvgIcon
												size={18}
												className="text-grey-600"
											>
												heroicons-outline:mail
											</FuseSvgIcon>
											Email Address
										</Typography>
										<Typography className="ml-26">{merchant?.shopemail}</Typography>
									</div>

									<div className="mb-24">
										<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
											<FuseSvgIcon
												size={18}
												className="text-grey-600"
											>
												heroicons-outline:phone
											</FuseSvgIcon>
											Phone Number
										</Typography>
										<Typography className="ml-26">{merchant?.shopphone || 'N/A'}</Typography>
									</div>

									<div className="mb-24">
										<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
											<FuseSvgIcon
												size={18}
												className="text-grey-600"
											>
												heroicons-outline:shield-check
											</FuseSvgIcon>
											Compliance Status
										</Typography>
										<Chip
											label={
												merchant?.isSuspended || merchant?.isBlocked ? 'Non-Compliant' : 'Compliant'
											}
											color={merchant?.isSuspended || merchant?.isBlocked ? 'error' : 'success'}
											size="small"
											className="ml-26"
										/>
									</div>
								</Grid>
							</Grid>

							<Divider className="my-24" />

							<div className="mb-24">
								<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
									<FuseSvgIcon
										size={18}
										className="text-grey-600"
									>
										heroicons-outline:location-marker
									</FuseSvgIcon>
									Business Address
								</Typography>
								<Typography className="ml-26">
									{merchant?.address || merchant?.shopcity}, {merchant?.shopcountry}
								</Typography>
							</div>

							{merchant?.shopdescription && (
								<div className="mb-24">
									<Typography className="font-semibold mb-8 text-15 flex items-center gap-8">
										<FuseSvgIcon
											size={18}
											className="text-grey-600"
										>
											heroicons-outline:document-text
										</FuseSvgIcon>
										About Business
									</Typography>
									<Typography
										className="ml-26"
										color="text.secondary"
									>
										{merchant?.shopdescription}
									</Typography>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Financial Information */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Financial Overview</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<Grid
								container
								spacing={3}
							>
								<Grid
									item
									xs={12}
									md={4}
								>
									<div className="flex flex-col items-center p-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
										<FuseSvgIcon
											size={32}
											className="text-green-600 mb-8"
										>
											heroicons-outline:currency-dollar
										</FuseSvgIcon>
										<Typography
											variant="h5"
											className="font-bold text-green-600"
										>
											NGN {(merchant?.shopaccount?.accountbalance || 0).toLocaleString()}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											className="mt-4"
										>
											Account Balance
										</Typography>
									</div>
								</Grid>

								<Grid
									item
									xs={12}
									md={4}
								>
									<div className="flex flex-col items-center p-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
										<FuseSvgIcon
											size={32}
											className="text-blue-600 mb-8"
										>
											heroicons-outline:chart-bar
										</FuseSvgIcon>
										<Typography
											variant="h5"
											className="font-bold text-blue-600"
										>
											NGN {(merchant?.totalRevenue || 0).toLocaleString()}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											className="mt-4"
										>
											Total Revenue
										</Typography>
									</div>
								</Grid>

								<Grid
									item
									xs={12}
									md={4}
								>
									<div className="flex flex-col items-center p-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
										<FuseSvgIcon
											size={32}
											className="text-purple-600 mb-8"
										>
											heroicons-outline:calendar
										</FuseSvgIcon>
										<Typography
											variant="h5"
											className="font-bold text-purple-600"
										>
											{merchant?.totalBookings || 0}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											className="mt-4"
										>
											Total Bookings
										</Typography>
									</div>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Listed Properties */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24 flex items-center justify-between">
							<div>
								<Typography className="text-2xl font-semibold leading-tight">Listed Properties</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{mockProperties.length} active listings
								</Typography>
							</div>
							<Button
								component={Link}
								to={`/hospitality/merchants/${merchant?.id}/properties`}
								variant="outlined"
								color="secondary"
								size="small"
								startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
							>
								Manage All Properties
							</Button>
						</div>

						<CardContent className="px-32 py-24">
							<Grid
								container
								spacing={3}
							>
								{mockProperties.map((property) => (
									<Grid
										item
										xs={12}
										md={6}
										lg={4}
										key={property.id}
									>
										<Card
											className="shadow hover:shadow-lg transition-shadow cursor-pointer"
											component={motion.div}
											whileHover={{ scale: 1.02 }}
										>
											<div className="relative">
												<img
													src={property.imageSrc}
													alt={property.title}
													className="w-full h-160 object-cover"
												/>
												{property.isFeatured && (
													<Chip
														label="Featured"
														size="small"
														className="absolute top-8 right-8 bg-yellow-500 text-white font-semibold"
													/>
												)}
												<Chip
													label={property.isPublished ? 'Published' : 'Draft'}
													size="small"
													color={property.isPublished ? 'success' : 'default'}
													className="absolute top-8 left-8"
												/>
											</div>
											<CardContent className="p-16">
												<Typography
													className="font-semibold text-16 mb-8"
													noWrap
												>
													{property.title}
												</Typography>
												<Typography
													variant="caption"
													color="text.secondary"
													className="mb-8 block"
												>
													{property.category}
												</Typography>

												<div className="flex items-center gap-4 mb-12">
													<Rating
														value={property.rating}
														precision={0.1}
														size="small"
														readOnly
													/>
													<Typography
														variant="caption"
														className="font-semibold"
													>
														{property.rating}
													</Typography>
													<Typography
														variant="caption"
														color="text.secondary"
													>
														({property.numReviews} reviews)
													</Typography>
												</div>

												<div className="flex items-center justify-between mb-12">
													<div className="flex items-center gap-12">
														<Tooltip title="Rooms">
															<div className="flex items-center gap-4">
																<FuseSvgIcon size={16}>heroicons-outline:home</FuseSvgIcon>
																<Typography variant="caption">{property.roomCount}</Typography>
															</div>
														</Tooltip>
														<Tooltip title="Bathrooms">
															<div className="flex items-center gap-4">
																<FuseSvgIcon size={16}>heroicons-outline:sparkles</FuseSvgIcon>
																<Typography variant="caption">{property.bathroomCount}</Typography>
															</div>
														</Tooltip>
														<Tooltip title="Guests">
															<div className="flex items-center gap-4">
																<FuseSvgIcon size={16}>heroicons-outline:users</FuseSvgIcon>
																<Typography variant="caption">{property.guestCount}</Typography>
															</div>
														</Tooltip>
													</div>
												</div>

												<Divider className="my-12" />

												<div className="flex items-center justify-between">
													<div>
														<Typography
															variant="h6"
															className="font-bold text-blue-600"
														>
															NGN {property.price.toLocaleString()}
														</Typography>
														<Typography
															variant="caption"
															color="text.secondary"
														>
															per night
														</Typography>
													</div>
													<Button
														component={Link}
														to={`/hospitality/properties/${property.id}/${property.slug}`}
														size="small"
														variant="contained"
														color="secondary"
													>
														View
													</Button>
												</div>

												<div className="mt-12 p-8 bg-green-50 rounded-lg">
													<Typography
														variant="caption"
														className="text-green-700 font-semibold"
													>
														Earnings: NGN {property.listingAccountBalance.toLocaleString()}
													</Typography>
												</div>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>

							{mockProperties.length === 0 && (
								<div className="flex flex-col items-center justify-center py-48">
									<FuseSvgIcon
										size={48}
										color="disabled"
									>
										heroicons-outline:home
									</FuseSvgIcon>
									<Typography
										color="text.secondary"
										variant="h6"
										className="mt-16"
									>
										No properties listed yet
									</Typography>
									<Typography
										color="text.secondary"
										variant="body2"
										className="mt-8"
									>
										This merchant hasn&apos;t added any properties to their portfolio
									</Typography>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar Stats */}
				<div className="flex flex-col md:w-320">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Quick Stats</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<div className="flex flex-col gap-16">
								<div className="flex items-center justify-between p-12 bg-blue-50 rounded-lg">
									<div className="flex items-center gap-12">
										<Avatar className="bg-blue-600">
											<FuseSvgIcon className="text-white">heroicons-outline:home</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Properties
											</Typography>
											<Typography className="font-bold text-16">{mockProperties.length}</Typography>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between p-12 bg-green-50 rounded-lg">
									<div className="flex items-center gap-12">
										<Avatar className="bg-green-600">
											<FuseSvgIcon className="text-white">heroicons-outline:check-circle</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Published
											</Typography>
											<Typography className="font-bold text-16">
												{mockProperties.filter((p) => p.isPublished).length}
											</Typography>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between p-12 bg-yellow-50 rounded-lg">
									<div className="flex items-center gap-12">
										<Avatar className="bg-yellow-600">
											<FuseSvgIcon className="text-white">heroicons-outline:star</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Featured
											</Typography>
											<Typography className="font-bold text-16">
												{mockProperties.filter((p) => p.isFeatured).length}
											</Typography>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between p-12 bg-purple-50 rounded-lg">
									<div className="flex items-center gap-12">
										<Avatar className="bg-purple-600">
											<FuseSvgIcon className="text-white">heroicons-outline:calendar</FuseSvgIcon>
										</Avatar>
										<div>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Avg. Rating
											</Typography>
											<Typography className="font-bold text-16">
												{mockProperties.length > 0
													? (
															mockProperties.reduce((acc, p) => acc + p.rating, 0) /
															mockProperties.length
													  ).toFixed(1)
													: '0.0'}
											</Typography>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Account Status</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<div className="flex flex-col gap-16">
								<div className="flex items-center justify-between">
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Verification
									</Typography>
									<Chip
										label={merchant?.verified ? 'Verified' : 'Not Verified'}
										color={merchant?.verified ? 'success' : 'default'}
										size="small"
									/>
								</div>

								<div className="flex items-center justify-between">
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Status
									</Typography>
									<Chip
										label={merchant?.isSuspended || merchant?.isBlocked ? 'Suspended' : 'Active'}
										color={merchant?.isSuspended || merchant?.isBlocked ? 'error' : 'success'}
										size="small"
									/>
								</div>

								<div className="flex items-center justify-between">
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Blocked
									</Typography>
									<Chip
										label={merchant?.isBlocked ? 'Yes' : 'No'}
										color={merchant?.isBlocked ? 'error' : 'default'}
										size="small"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}

export default AboutTab;
