/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
// import {
//   useDeleteECommerceProductsMutation,
//   useGetECommerceProductsQuery,
// } from "../ECommerceApi";
import { useShopOnEstateProperties } from 'src/app/api/admin-handle-estateproperties/useAdminHandleEstateProperties';

function ShopOnRcsTable() {
	const [filteredShop, setFilteredShop] = useState([]);

	const { data: usresData, isLoading: usersIsLoading } = useShopOnEstateProperties();

	useEffect(() => {
		if (usresData?.data?.shopsOnEstates?.length > 0) {
			setFilteredShop(
				usresData?.data?.shopsOnEstates?.filter((shop) => shop?.shopplan?.plankey === 'FOODVENDORS')
			);
		}
	}, [usresData?.data?.shopsOnEstates]);

	const usercolumns = useMemo(
		() => [
			{
				accessorKey: 'shopname',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.shopname}
					</Typography>
				)
			},
			{
				accessorKey: 'shopemail',
				header: 'Email',
				accessorFn: (row) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							className="text-11"
							size="small"
							color="default"
							label={row?.shopemail}
						/>
					</div>
				)
			},
			{
				accessorKey: 'active',
				header: 'Active',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row.isSuspended ? (
							<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
						)}
					</div>
				)
			},

			{
				accessorKey: 'management',
				header: 'Management User Console',
				Cell: ({ row }) => (
					<div className="flex flex-wrap space-x-2">
						<Chip
							component={Link}
							to={`/rcs-management/rcs-listings/${row.original._id}/manage`}
							// to={`/rcs-management/rcs-listings/${row.original._id}`}
							className="bg-green-400 text-11 cursor-pointer"
							size="small"
							color="default"
							label="Manage this RCS(s) Merchant"
						/>
					</div>
				)
			}
		],
		[]
	);

	if (usersIsLoading) {
		return <FuseLoading />;
	}

	if (!usresData?.data?.shopsOnEstates) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no listings!
				</Typography>
			</div>
		);
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				data={filteredShop}
				columns={usercolumns}
			/>
		</Paper>
	);
}

export default ShopOnRcsTable;
