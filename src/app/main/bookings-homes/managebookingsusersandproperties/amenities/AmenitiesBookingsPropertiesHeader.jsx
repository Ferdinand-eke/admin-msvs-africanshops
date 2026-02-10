import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip } from '@mui/material';

/**
 * The amenities management header.
 */
function AmenitiesBookingsPropertiesHeader(props) {
	const { totalAmenities, activeAmenities, onAddAmenity } = props;

	return (
		<div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24 border-b">
			<div className="flex flex-col">
				<motion.span
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<Typography className="text-16 md:text-24 font-extrabold tracking-tight">
						Property Amenities Management
					</Typography>
				</motion.span>
				<motion.span
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
					className="mt-4"
				>
					<Typography
						variant="caption"
						color="text.secondary"
					>
						Manage amenities that can be assigned to booking properties
					</Typography>
				</motion.span>
			</div>

			<div className="flex flex-1 items-center justify-end space-x-12">
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
					className="flex items-center gap-12"
				>
					{/* Statistics Chips */}
					<Chip
						label={`${totalAmenities} Total`}
						color="primary"
						size="small"
						className="font-semibold"
					/>
					<Chip
						label={`${activeAmenities} Active`}
						color="success"
						size="small"
						className="font-semibold"
					/>

					{/* Add Amenity Button */}
					<Button
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
						onClick={onAddAmenity}
					>
						Add Amenity
					</Button>
				</motion.div>
			</div>
		</div>
	);
}

export default AmenitiesBookingsPropertiesHeader;
