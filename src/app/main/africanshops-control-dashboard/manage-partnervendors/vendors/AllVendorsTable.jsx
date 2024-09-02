/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { useDeleteECommerceProductsMutation, useGetECommerceProductsQuery } from '../ECommerceApi';
import useAdmiManageShop from 'src/app/api/shops/useAdminShops';

function AllVendorsTable() {
	
	// const { data: products, isLoading } = useGetECommerceProductsQuery();
	const [removeProducts] = useDeleteECommerceProductsMutation();

	const { data:vendors, isLoading, isError } = useAdmiManageShop();
	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.shopname,
				id: 'featuredImageId',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original?.coverimage?.length > 0 ? (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src={row.original.coverimage}
								alt={row.original.shopname}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.shopname}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/partnervendors/listpartners/${row.original._id}/${row.original.slug}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.shopname}
					</Typography>
				)
			},
		
			{
				accessorKey: 'active',
				header: 'Active',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row.verified ? (
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
						)}
					</div>
				)
			},

			{
				accessorKey: '[isSuspended, isBlocked]',
				header: 'Shop Compliance',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row.isSuspended ||
                row.isBlocked ||
                (row.isSuspended && row.isBlocked) ? (

					<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
							
						) : (
							<>
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
							</>
						)}
					</div>
				)
			}
		],
		[]
	);

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
				Error occured retrieving vendor plans!
				</Typography>
				
			</motion.div>
		);
	}

	if (!vendors?.data?.data) {
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
					No offices in operation yet!
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
				data={vendors?.data?.data}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeProducts([row.original.id]);
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
								removeProducts(selectedRows.map((row) => row.original.id));
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

export default AllVendorsTable;
