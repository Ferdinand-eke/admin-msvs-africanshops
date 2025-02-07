/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import {motion} from 'framer-motion' 
import DataTable from 'app/shared-components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import OrdersStatus from '../order/OrdersStatus';
import  { useAdminGetOrderItems } from 'src/app/api/orders/useAdminGetShopOrders';
import OrdersCreatedAndPaymentStatus from '../order/OrdersCreatedAndPaymentStatus';
import { formatCurrency } from '../../../manage-lgashippingtable/PosUtils';
import OrderItemsCancellationStatus from '../order/OrderItemsCancellationStatus';

function OrderItemsTable() {
	const { data: orderItems, isLoading, isError } = useAdminGetOrderItems();

	const columns = useMemo(
		() => [
			{
				accessorKey: '_id',
				header: 'Reference',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/admin-manage/orders/${row?.original?._id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.paymentResult?.reference ? row?.original?.paymentResult?.reference : row?.original?._id}
					</Typography>
				)
			},
			{
				id: 'name',
				accessorFn: (row) => `${row?.userOrderCreator?.name}`,
				header: 'Customer'
			},
			{
				id: 'price',
				accessorFn: (row) => `NGN ${formatCurrency(row?.price)}`,
				header: 'Total',
				size: 64
			},
			{
				id: 'quantity',
				accessorFn: (row) => ` ${(row?.quantity)}`,
				header: 'Quantity',
				size: 64
			},

			{
				id: 'total',
				accessorFn: (row) => `NGN ${formatCurrency(row?.price * row?.quantity)}`,
				header: 'Total',
				size: 64
			},
			
			{
				id: 'id',
				accessorKey: 'isCanceled',
				header: 'Cancellation Status',
				
				accessorFn: (row) => <OrderItemsCancellationStatus 
				orderItemId={row?._id}
				isCanceled={row?.isCanceled}
				isRefundRequested={row?.isRefundRequested} 
				isApprovedAndRefundedByAfricanshops={row?.isApprovedAndRefundedByAfricanshops} 
				
				/>,
				
				
			},

			{
				accessorKey: 'createdAt',
				header: 'Date Created',
				Cell: ({ row }) => (
					<Typography
						color="secondary"
						role="button"
					>
						{new Date(row?.original?.createdAt)?.toDateString()}
					</Typography>
				)
			}
		],
		[]
	);


	const rows = [];
	 orderItems?.data &&
     orderItems?.data?.forEach((item) => {
      rows.push({
        id: item?._id,
        name: item?.name,

        quantity: item?.quantity,
        // status: item.isPaid,
        price: item?.Price,
        isCanceled: item.isCanceled,
        isRefundRequested: item.isRefundRequested,
		isApprovedAndRefundedByAfricanshops: item.isApprovedAndRefundedByAfricanshops,
        // isShipped: item.isShipped,
        // isDelivered: item.isDelivered,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });


	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError ) {
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
				Nework Error While Retrieving orders!
				</Typography>
			
			</motion.div>
		);
		
	}

if (! orderItems?.data) {
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
				No orders found!
			</Typography>
		
		</motion.div>
	);
}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			{/* <p>Getting all order items</p> */}
			<DataTable
				initialState={{
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageIndex: 0,
						pageSize: 20
					}
				}}
				rows={rows}
				data={ orderItems?.data}
				columns={columns}
				
			/>
		</Paper>
	);
}

export default OrderItemsTable;
