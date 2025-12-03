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
import useShopplans from 'src/app/api/shopplans/useShopPlans';

function VendorPlansTable() {
	const { data: vendorplans, isLoading, refetch, isError } = useShopplans();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'plansname',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/vendorplans/packages/${row.original.id}/${row.original.slug}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.plansname}
					</Typography>
				)
			},
			{
				accessorKey: 'support',
				header: 'Support',
				accessorFn: (row) => `${row.support}`
			},
			{
				accessorKey: 'numberoffeaturedimages',
				header: 'Images Count Uploadable',
				accessorFn: (row) => `${row.numberoffeaturedimages}`
			},
			{
				accessorKey: 'numberofproducts',
				header: 'Products Cap',
				accessorFn: (row) => `${row.numberofproducts}`
			},
			{
				accessorKey: 'percetageCommissionCharge',
				header: '% Commission Charge',
				accessorFn: (row) => `${row.percetageCommissionCharge} %`
			},

			{
				accessorKey: 'price',
				header: 'Price for monthly storage per image',
				accessorFn: (row) => `NGN${row.price}`
			}
		],
		[]
	);

	if (isLoading) {
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
					Error occured retrieving vendor plans!
				</Typography>
			</motion.div>
		);
	}

	if (!vendorplans?.data?.merchantPlans) {
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
					No vendor plan yet!
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
				data={vendorplans?.data?.merchantPlans}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							// removeProducts([row.original.id]);
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
								// removeProducts(selectedRows.map((row) => row.original.id));
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

export default VendorPlansTable;
