import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useMerchantsPaginated } from 'src/app/api/shops/useAdminShops';

/**
 * The OverdueWidget - real-time merchant/vendor count.
 */
function OverdueWidget() {
	const { data, isLoading, isError } = useMerchantsPaginated({ page: 0, limit: 1 });
	const merchantCount = data?.data?.pagination?.total;

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-16 pt-16 pb-8">
				<div className="flex items-center">
					<FuseSvgIcon
						className="text-purple-600"
						size={20}
					>
						heroicons-outline:shopping-bag
					</FuseSvgIcon>
					<Typography className="ml-8 text-md font-medium text-purple-600">Merchants</Typography>
				</div>
			</div>
			<div className="text-center mt-8 mb-24">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					{isLoading ? (
						<CircularProgress
							size={40}
							className="my-20 text-purple-400"
						/>
					) : (
						<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-purple-500">
							{isError ? '—' : (merchantCount ?? 0).toLocaleString()}
						</Typography>
					)}
				</motion.div>
				<Typography className="text-lg font-medium text-purple-600 dark:text-purple-400">
					Total Merchants
				</Typography>
			</div>
		</Paper>
	);
}

export default memo(OverdueWidget);
