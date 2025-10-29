/* eslint-disable react/no-unstable-nested-components */
import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAdminGetOrdersPaginated } from 'src/app/api/orders/useAdminGetShopOrders';
import OrdersCreatedAndPaymentStatus from '../order/OrdersCreatedAndPaymentStatus';
import { formatCurrency } from '../../../manage-lgashippingtable/PosUtils';

function OrdersTable() {
	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [globalFilter, setGlobalFilter] = useState('');

	// Fetch orders with pagination
	const { data: ordersResponse, isLoading, isError, isFetching } = useAdminGetOrdersPaginated({
		page,
		limit: rowsPerPage,
		search: globalFilter,
		filters: {}
	});

	// Extract orders and pagination info from response
	const orders = useMemo(() => ordersResponse?.data?.payload?.orders || [], [ordersResponse]);
	const totalCount = useMemo(() => ordersResponse?.data?.payload?.pagination?.total || 0, [ordersResponse]);
	const pagination = useMemo(() => ordersResponse?.data?.payload?.pagination, [ordersResponse]);

	// Pagination handlers
	const handlePageChange = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
		setRowsPerPage(newRowsPerPage);
		setPage(0); // Reset to first page when changing page size
	}, []);

	// Debounced search handler
	const handleGlobalFilterChange = useCallback((value) => {
		setGlobalFilter(value);
		setPage(0); // Reset to first page on search
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Reference',
				size: 120,
				enableSorting: false,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/admin-manage/orders/${row.original?.id || row.original?._id}`}
						className="underline font-medium"
						color="secondary"
						role="button"
					>
						{row.original?.paymentResult?.reference || row.original?.id || 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'userOrderCreator',
				header: 'Customer',
				size: 180,
				enableSorting: false,
				Cell: ({ row }) => (
					<Typography className="font-medium">
						{row.original?.shippingAddress?.fullName || row.original?.userOrderCreator || 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'refOrderId',
				header: 'Order Ref',
				size: 140,
				Cell: ({ row }) => (
					<Typography className="text-13 font-mono">
						{row.original?.refOrderId || 'N/A'}
					</Typography>
				)
			},
			{
				accessorKey: 'totalPrice',
				header: 'Total',
				size: 120,
				Cell: ({ row }) => (
					<Typography className="font-semibold text-14">
						NGN {formatCurrency(row.original?.totalPrice)}
					</Typography>
				)
			},
			{
				accessorKey: 'isPaid',
				header: 'Payment',
				size: 100,
				Cell: ({ row }) => (
					<OrdersCreatedAndPaymentStatus
						createdAt={row.original?.createdAt}
						isPaid={row.original?.isPaid}
					/>
				)
			},
			{
				accessorKey: 'orderStatus',
				header: 'Order Status',
				size: 140,
				Cell: ({ row }) => {
					const { isPacked, isShipped, isDelivered } = row.original;

					if (isDelivered) {
						return (
							<Chip
								label="Delivered"
								size="small"
								color="success"
								icon={<FuseSvgIcon size={16}>heroicons-outline:check-circle</FuseSvgIcon>}
							/>
						);
					}
					if (isShipped) {
						return (
							<Chip
								label="Shipped"
								size="small"
								color="info"
								icon={<FuseSvgIcon size={16}>heroicons-outline:truck</FuseSvgIcon>}
							/>
						);
					}
					if (isPacked) {
						return (
							<Chip
								label="Packed"
								size="small"
								color="warning"
								icon={<FuseSvgIcon size={16}>heroicons-outline:archive</FuseSvgIcon>}
							/>
						);
					}
					return (
						<Chip
							label="Pending"
							size="small"
							color="default"
							icon={<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>}
						/>
					);
				}
			},
			{
				accessorKey: 'createdAt',
				header: 'Date Created',
				size: 140,
				Cell: ({ row }) => (
					<Typography className="text-13">
						{new Date(row.original?.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})}
					</Typography>
				)
			}
		],
		[]
	);

	if (isLoading && !isFetching) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					Network Error While Retrieving orders!
				</Typography>
				<Button
					className="mt-24"
					variant="outlined"
					onClick={() => window.location.reload()}
					color="secondary"
				>
					<FuseSvgIcon size={20}>heroicons-outline:refresh</FuseSvgIcon>
					<span className="mx-8">Retry</span>
				</Button>
			</motion.div>
		);
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				data={orders}
				columns={columns}
				manualPagination
				rowCount={totalCount}
				pageCount={pagination?.totalPages || Math.ceil(totalCount / rowsPerPage)}
				onPaginationChange={(updater) => {
					const newPagination = typeof updater === 'function'
						? updater({ pageIndex: page, pageSize: rowsPerPage })
						: updater;

					if (newPagination.pageIndex !== page) {
						handlePageChange(newPagination.pageIndex);
					}
					if (newPagination.pageSize !== rowsPerPage) {
						handleRowsPerPageChange(newPagination.pageSize);
					}
				}}
				onGlobalFilterChange={handleGlobalFilterChange}
				state={{
					pagination: {
						pageIndex: page,
						pageSize: rowsPerPage
					},
					globalFilter,
					isLoading: isFetching,
					showProgressBars: isFetching
				}}
				initialState={{
					density: 'comfortable',
					showGlobalFilter: true,
					showColumnFilters: false,
					pagination: {
						pageIndex: 0,
						pageSize: 20
					}
				}}
				muiPaginationProps={{
					rowsPerPageOptions: [10, 20, 50, 100],
					showFirstButton: true,
					showLastButton: true
				}}
				renderRowActionMenuItems={({ closeMenu, row }) => {
					const order = row.original;
					return [
						<MenuItem
							key="view"
							component={Link}
							to={`/admin-manage/orders/${order.id || order._id}`}
							onClick={closeMenu}
						>
							<ListItemIcon>
								<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
							</ListItemIcon>
							View Order Details
						</MenuItem>
					];
				}}
				renderEmptyRowsFallback={() => (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.1 } }}
						className="flex flex-col flex-1 items-center justify-center h-full py-48"
					>
						<Typography
							color="text.secondary"
							variant="h5"
						>
							No orders found!
						</Typography>
						<Typography
							color="text.secondary"
							variant="body1"
							className="mt-8"
						>
							{globalFilter ? 'Try adjusting your search terms' : 'Orders will appear here once customers place them'}
						</Typography>
					</motion.div>
				)}
			/>
		</Paper>
	);
}

export default OrdersTable;
