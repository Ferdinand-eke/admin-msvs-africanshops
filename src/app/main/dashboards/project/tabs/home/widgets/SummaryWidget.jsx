import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';
import { useAdminGetOrdersPaginated } from 'src/app/api/orders/useAdminGetShopOrders';

/**
 * The SummaryWidget - real-time marketplace order count.
 * Scoped to product-order-service only -- food-order-service and
 * bookings-reservations-service each have their own separate order streams
 * with no combined admin count endpoint yet.
 */
function SummaryWidget() {
	const { data, isLoading, isError } = useAdminGetOrdersPaginated({ page: 0, limit: 1 });
	const orderCount = data?.data?.payload?.pagination?.total;

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-16 pt-16 pb-8">
				<div className="flex items-center">
					<FuseSvgIcon
						className="text-blue-600"
						size={20}
					>
						heroicons-outline:shopping-cart
					</FuseSvgIcon>
					<Typography className="ml-8 text-md font-medium text-blue-600">Orders</Typography>
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
							className="my-20 text-blue-400"
						/>
					) : (
						<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500">
							{isError ? '—' : (orderCount ?? 0).toLocaleString()}
						</Typography>
					)}
				</motion.div>
				<Typography className="text-lg font-medium text-blue-600 dark:text-blue-400">Total Orders</Typography>
			</div>
		</Paper>
	);
}

export default memo(SummaryWidget);
