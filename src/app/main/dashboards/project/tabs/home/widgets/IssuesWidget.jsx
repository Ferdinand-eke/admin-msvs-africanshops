import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import useOurPlatformUsers from 'src/app/api/users/useUsers';

/**
 * The IssuesWidget - real-time platform user count.
 */
function IssuesWidget() {
	const { data, isLoading, isError } = useOurPlatformUsers();
	const userCount = data?.data?.pagination?.total;

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-16 pt-16 pb-8">
				<div className="flex items-center">
					<FuseSvgIcon
						className="text-amber-600"
						size={20}
					>
						heroicons-outline:user-group
					</FuseSvgIcon>
					<Typography className="ml-8 text-md font-medium text-amber-600">Users</Typography>
				</div>
			</div>
			<div className="text-center mt-8 mb-24">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					{isLoading ? (
						<CircularProgress
							size={40}
							className="my-20 text-amber-400"
						/>
					) : (
						<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-amber-500">
							{isError ? '—' : (userCount ?? 0).toLocaleString()}
						</Typography>
					)}
				</motion.div>
				<Typography className="text-lg font-medium text-amber-600 dark:text-amber-400">Total Users</Typography>
			</div>
		</Paper>
	);
}

export default memo(IssuesWidget);
