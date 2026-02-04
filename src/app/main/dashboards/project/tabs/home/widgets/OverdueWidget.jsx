import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

/**
 * The OverdueWidget - Shows real-time count of Merchants/Vendors
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function OverdueWidget() {
	// Placeholder data - replace with actual API call
	const merchantCount = 347;
	const activeMerchants = 289;

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-16 pt-16 pb-8">
				<div className="flex items-center">
					<FuseSvgIcon className="text-purple-600" size={20}>heroicons-outline:shopping-bag</FuseSvgIcon>
					<Typography className="ml-8 text-md font-medium text-purple-600">Merchants</Typography>
				</div>
			</div>
			<div className="text-center mt-8">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-purple-500">
						{merchantCount}
					</Typography>
				</motion.div>
				<Typography className="text-lg font-medium text-purple-600 dark:text-purple-400">Total Merchants</Typography>
			</div>
			<div className="flex items-baseline justify-center w-full mt-20 mb-24">
				<div className="flex items-center px-12 py-4 rounded-full bg-green-50">
					<FuseSvgIcon className="text-green-600" size={16}>heroicons-solid:check-circle</FuseSvgIcon>
					<Typography className="ml-4 text-sm font-semibold text-green-700">
						{activeMerchants} Active
					</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(OverdueWidget);
