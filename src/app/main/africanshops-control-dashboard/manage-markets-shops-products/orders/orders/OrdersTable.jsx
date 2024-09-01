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
import { useDeleteECommerceOrdersMutation, useGetECommerceOrdersQuery } from '../ECommerceApi';
import OrdersStatus from '../order/OrdersStatus';
import useAdminGetOrders from 'src/app/api/orders/useAdminGetShopOrders';
import OrdersCreatedAndPaymentStatus from '../order/OrdersCreatedAndPaymentStatus';

function OrdersTable() {
	const { data: adminOrders, isLoading, isError } = useAdminGetOrders();
	const [removeOrders] = useDeleteECommerceOrdersMutation();

	// const { data:adminOrders,
	// 	//  isLoading
	// 	 } = useAdminGetOrders();

		 console.log("Admin Get Orders", adminOrders?.data?.MOrders)
	const columns = useMemo(
		() => [
			// {
			// 	accessorKey: 'id',
			// 	header: 'Id',
			// 	size: 64
			// },
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
						{row?.original?._id}
					</Typography>
				)
			},
			{
				id: 'name',
				accessorFn: (row) => `${row?.shippingAddress?.fullName}`,
				header: 'Customer'
			},
			{
				id: 'total',
				accessorFn: (row) => `NGN${row?.totalPrice}`,
				header: 'Total',
				size: 64
			},
			// { id: 'payment', accessorFn: (row) => row.payment.method, header: 'Payment', size: 128 },
			{
				id: 'isPaid',
				accessorFn: (row) => <OrdersCreatedAndPaymentStatus 
				createdAt={row?.createdAt}
				isPaid={row?.isPaid} />,
				accessorKey: 'isPaid',
				header: 'Payment Status'
			},
			{
				accessorKey: 'createdAt',
				header: 'Date'
			}
		],
		[]
	);

	const rows = [];
	adminOrders?.data?.MOrders &&
    adminOrders?.data?.MOrders?.forEach((item) => {
      rows.push({
        id: item?._id,
        name: item?.shippingAddress?.fullName,

        address: item?.shippingAddress?.address,
        status: item.isPaid,
        totalPrice: item?.totalPrice,
        isPaid: item.isPaid,
        isPacked: item.isPacked,
        isShipped: item.isShipped,
        isDelivered: item.isDelivered,
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

// console.log("STATES=DATA", states?.data?.data)
if (!adminOrders?.data?.MOrders) {
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
				// data={orders}
				rows={rows}
				data={adminOrders?.data?.MOrders}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeOrders([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								removeOrders(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
							color="secondary"
						>
							<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							<span className="hidden sm:flex mx-8">Delete selected items</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default OrdersTable;
