import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

/**
 * The IssuesWidget - Shows real-time count of Users
 * TODO: Replace placeholder data with actual API call when endpoint is ready
 */
function IssuesWidget() {
	// Placeholder data - replace with actual API call
	const userCount = 15842;
	const activeUsers = 12456;

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-16 pt-16 pb-8">
				<div className="flex items-center">
					<FuseSvgIcon className="text-amber-600" size={20}>heroicons-outline:user-group</FuseSvgIcon>
					<Typography className="ml-8 text-md font-medium text-amber-600">Users</Typography>
				</div>
			</div>
			<div className="text-center mt-8">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.2 }}
				>
					<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-amber-500">
						{userCount.toLocaleString()}
					</Typography>
				</motion.div>
				<Typography className="text-lg font-medium text-amber-600 dark:text-amber-400">Total Users</Typography>
			</div>
			<div className="flex items-baseline justify-center w-full mt-20 mb-24">
				<div className="flex items-center px-12 py-4 rounded-full bg-green-50">
					<FuseSvgIcon className="text-green-600" size={16}>heroicons-solid:check-circle</FuseSvgIcon>
					<Typography className="ml-4 text-sm font-semibold text-green-700">
						{activeUsers.toLocaleString()} Active
					</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default memo(IssuesWidget);
