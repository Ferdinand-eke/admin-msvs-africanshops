import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useAdminPendingKyc } from 'src/app/api/kyc/useKyc';

/**
 * The FeaturesWidget - real-time pending-KYC review queue count.
 */
function FeaturesWidget() {
	const { data, isLoading, isError } = useAdminPendingKyc({ page: 1, limit: 1 });
	const pendingKycCount = data?.data?.total;

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-16 pt-16 pb-8">
				<div className="flex items-center">
					<FuseSvgIcon
						className="text-red-600"
						size={20}
					>
						heroicons-outline:identification
					</FuseSvgIcon>
					<Typography className="ml-8 text-md font-medium text-red-600">Pending KYC</Typography>
				</div>
			</div>
			<div className="text-center mt-8 mb-24">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.3 }}
				>
					{isLoading ? (
						<CircularProgress
							size={40}
							className="my-20 text-red-400"
						/>
					) : (
						<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-red-500">
							{isError ? '—' : (pendingKycCount ?? 0).toLocaleString()}
						</Typography>
					)}
				</motion.div>
				<Typography className="text-lg font-medium text-red-600 dark:text-red-400">Awaiting Review</Typography>
			</div>
		</Paper>
	);
}

export default memo(FeaturesWidget);
