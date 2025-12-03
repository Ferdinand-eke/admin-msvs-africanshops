import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import useEstateProperty from '../../../../../../api/admin-handle-estateproperties/useEstateProperty';

/**
 * The about tab - displays property information
 */
function AboutTab({ propertyId }) {
	const { data: property, isLoading } = useEstateProperty(propertyId);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!property) {
		return (
			<Box className="flex flex-col items-center justify-center p-48">
				<FuseSvgIcon
					size={64}
					color="disabled"
				>
					heroicons-outline:home
				</FuseSvgIcon>
				<Typography
					color="text.secondary"
					className="mt-16"
					variant="h6"
				>
					Property not found
				</Typography>
			</Box>
		);
	}

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

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case 'available':
				return 'success';
			case 'sold':
				return 'error';
			case 'pending':
				return 'warning';
			case 'reserved':
				return 'info';
			default:
				return 'default';
		}
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<div className="md:flex gap-24">
				<div className="flex flex-col flex-1">
					{/* Basic Information */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-24"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">
								Property Information
							</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<Grid
								container
								spacing={3}
							>
								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Title</Typography>
									<Typography>{property.title || 'N/A'}</Typography>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Status</Typography>
									<Chip
										label={property.status || 'N/A'}
										color={getStatusColor(property.status)}
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Property Type</Typography>
									<Typography>{property.propertyType || 'N/A'}</Typography>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Use Case</Typography>
									<Typography>{property.propertyUseCase || 'N/A'}</Typography>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Price</Typography>
									<Typography className="text-green-600 font-bold text-lg">
										${property.price?.toLocaleString() || '0'}
									</Typography>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Number of Rooms</Typography>
									<Typography>{property.numberOfRooms || 'N/A'}</Typography>
								</Grid>

								<Grid
									item
									xs={12}
								>
									<Typography className="font-semibold mb-4 text-15">Description</Typography>
									<Typography>{property.description || 'No description available'}</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Location Details */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-24"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Location</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<Grid
								container
								spacing={3}
							>
								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Address</Typography>
									<Box className="flex items-start gap-8">
										<FuseSvgIcon
											size={20}
											color="action"
										>
											heroicons-outline:location-marker
										</FuseSvgIcon>
										<Typography>{property.address || 'N/A'}</Typography>
									</Box>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">City</Typography>
									<Typography>{property.city || 'N/A'}</Typography>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">State/Region</Typography>
									<Typography>{property.state || property.region || 'N/A'}</Typography>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="font-semibold mb-4 text-15">Country</Typography>
									<Typography>{property.country || 'N/A'}</Typography>
								</Grid>

								{property.zipCode && (
									<Grid
										item
										xs={12}
										sm={6}
									>
										<Typography className="font-semibold mb-4 text-15">Zip Code</Typography>
										<Typography>{property.zipCode}</Typography>
									</Grid>
								)}
							</Grid>
						</CardContent>
					</Card>

					{/* Property Features */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-24"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Features</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<Grid
								container
								spacing={3}
							>
								<Grid
									item
									xs={12}
									sm={6}
									md={4}
								>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon
											size={20}
											color="action"
										>
											heroicons-outline:home
										</FuseSvgIcon>
										<Box>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Bedrooms
											</Typography>
											<Typography className="font-semibold">
												{property.bedrooms || 'N/A'}
											</Typography>
										</Box>
									</Box>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									md={4}
								>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon
											size={20}
											color="action"
										>
											heroicons-outline:office-building
										</FuseSvgIcon>
										<Box>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Bathrooms
											</Typography>
											<Typography className="font-semibold">
												{property.bathrooms || 'N/A'}
											</Typography>
										</Box>
									</Box>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									md={4}
								>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon
											size={20}
											color="action"
										>
											heroicons-outline:view-grid
										</FuseSvgIcon>
										<Box>
											<Typography
												variant="caption"
												color="text.secondary"
											>
												Square Feet
											</Typography>
											<Typography className="font-semibold">
												{property.squareFeet?.toLocaleString() || 'N/A'}
											</Typography>
										</Box>
									</Box>
								</Grid>

								{property.yearBuilt && (
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
									>
										<Box className="flex items-center gap-8">
											<FuseSvgIcon
												size={20}
												color="action"
											>
												heroicons-outline:calendar
											</FuseSvgIcon>
											<Box>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Year Built
												</Typography>
												<Typography className="font-semibold">{property.yearBuilt}</Typography>
											</Box>
										</Box>
									</Grid>
								)}

								{property.parking && (
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
									>
										<Box className="flex items-center gap-8">
											<FuseSvgIcon
												size={20}
												color="action"
											>
												heroicons-outline:truck
											</FuseSvgIcon>
											<Box>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Parking
												</Typography>
												<Typography className="font-semibold">{property.parking}</Typography>
											</Box>
										</Box>
									</Grid>
								)}
							</Grid>

							{property.amenities && property.amenities.length > 0 && (
								<>
									<Divider className="my-24" />
									<Typography className="font-semibold mb-12 text-15">Amenities</Typography>
									<Box className="flex flex-wrap gap-8">
										{property.amenities.map((amenity, index) => (
											<Chip
												key={index}
												label={amenity}
												size="small"
												variant="outlined"
											/>
										))}
									</Box>
								</>
							)}
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col md:w-320">
					{/* Owner/Merchant Information */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-24"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Owner Information</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<Typography className="font-semibold mb-4 text-15">Owner Name</Typography>
							<Typography className="mb-16">
								{property.merchant?.name || property.owner?.name || 'N/A'}
							</Typography>

							{(property.merchant?.email || property.owner?.email) && (
								<>
									<Typography className="font-semibold mb-4 text-15">Contact Email</Typography>
									<Typography className="mb-16">
										{property.merchant?.email || property.owner?.email}
									</Typography>
								</>
							)}

							{(property.merchant?.phone || property.owner?.phone) && (
								<>
									<Typography className="font-semibold mb-4 text-15">Contact Phone</Typography>
									<Typography>{property.merchant?.phone || property.owner?.phone}</Typography>
								</>
							)}
						</CardContent>
					</Card>

					{/* Additional Information */}
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-24"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">Additional Details</Typography>
						</div>

						<CardContent className="px-32 py-24">
							{property.listedDate && (
								<Box className="mb-16">
									<Typography className="font-semibold mb-4 text-15">Listed Date</Typography>
									<Typography>
										{new Date(property.listedDate).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</Typography>
								</Box>
							)}

							{property.views && (
								<Box className="mb-16">
									<Typography className="font-semibold mb-4 text-15">Views</Typography>
									<Box className="flex items-center gap-8">
										<FuseSvgIcon
											size={20}
											color="action"
										>
											heroicons-outline:eye
										</FuseSvgIcon>
										<Typography>{property.views.toLocaleString()}</Typography>
									</Box>
								</Box>
							)}

							{property.isFeatured && (
								<Box className="mb-16">
									<Chip
										label="Featured Property"
										color="primary"
										icon={<FuseSvgIcon size={16}>heroicons-outline:star</FuseSvgIcon>}
									/>
								</Box>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}

export default AboutTab;
