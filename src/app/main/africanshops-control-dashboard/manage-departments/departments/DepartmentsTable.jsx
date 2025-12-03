/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useGetDepartments } from 'src/app/api/departments/useDepartments';
import { useDeleteECommerceProductsMutation, useGetECommerceProductsQuery } from '../ECommerceApi';

function DepartmentsTable() {
	const { data: products, isLoading } = useGetECommerceProductsQuery();
	const [removeProducts] = useDeleteECommerceProductsMutation();

	const { data: departments, isLoading: departmentsLoading, refetch } = useGetDepartments();

	// console.log("DepartmentsData", departments?.data?.data)

	const columns = useMemo(
		() => [
			// {
			// 	accessorFn: (row) => row.flag,
			// 	id: 'flag',
			// 	header: '',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	size: 64,
			// 	enableSorting: false,
			// 	Cell: ({ row }) => (
			// 		<div className="flex items-center justify-center">
			// 			{row.original?.flag  ? (
			// 				<img
			// 					className="w-full max-h-40 max-w-40 block rounded"
			// 					src={row?.original?.flag}
			// 					alt={row.original.name}
			// 				/>
			// 			) : (
			// 				<img
			// 					className="w-full max-h-40 max-w-40 block rounded"
			// 					src="assets/images/apps/ecommerce/product-image-placeholder.png"
			// 					alt={row.original.name}
			// 				/>
			// 			)}
			// 		</div>
			// 	)
			// },
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/departments/list/${row.original.id || row.original._id}/${row.original.slug}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.name}
					</Typography>
				)
			},
			// {
			// 	accessorKey: 'categories',
			// 	header: 'Category',
			// 	accessorFn: (row) => (
			// 		<div className="flex flex-wrap space-x-2">
			// 			{row.categories.map((item) => (
			// 				<Chip
			// 					key={item}
			// 					className="text-11"
			// 					size="small"
			// 					color="default"
			// 					label={item}
			// 				/>
			// 			))}
			// 		</div>
			// 	)
			// },
			// {
			// 	accessorKey: 'priceTaxIncl',
			// 	header: 'Price',
			// 	accessorFn: (row) => `$${row.priceTaxIncl}`
			// },
			// {
			// 	accessorKey: 'quantity',
			// 	header: 'Quantity',
			// 	accessorFn: (row) => (
			// 		<div className="flex items-center space-x-8">
			// 			<span>{row.quantity}</span>
			// 			<i
			// 				className={clsx(
			// 					'inline-block w-8 h-8 rounded',
			// 					row.quantity <= 5 && 'bg-red',
			// 					row.quantity > 5 && row.quantity <= 25 && 'bg-orange',
			// 					row.quantity > 25 && 'bg-green'
			// 				)}
			// 			/>
			// 		</div>
			// 	)
			// },
			{
				accessorKey: 'isPublished',
				header: 'Published ',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row.isPublished ? (
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
			}
		],
		[]
	);

	if (departmentsLoading) {
		return <FuseLoading />;
	}

	if (!departments?.data?.departments) {
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
					No departments in operation yet!
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
				// data={products}
				data={departments?.data?.departments}
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

export default DepartmentsTable;
