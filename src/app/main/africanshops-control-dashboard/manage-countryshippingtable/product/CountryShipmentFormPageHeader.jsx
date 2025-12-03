import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The product header.
 */
function CountryShipmentFormPageHeader() {
	const routeParams = useParams();
	const { productId } = routeParams;
	const theme = useTheme();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						role="button"
						color="inherit"
						onClick={() => navigate(-1)}
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Back to Country Shipment table</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full" />
			</div>
		</div>
	);
}

export default CountryShipmentFormPageHeader;
