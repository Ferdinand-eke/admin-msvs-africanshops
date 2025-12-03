/* eslint-disable react/no-unstable-nested-components */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useCountriesWithShippingTable } from 'src/app/api/countries/useCountries';

function CountryShippingTable() {
	const { data: countryShippingDatas, isLoading: countriesLoading, isError } = useCountriesWithShippingTable();

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row?.featuredImageId,
				id: 'featuredImageId',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row?.original?.flag?.length > 0 ? (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src={row?.original?.flag}
								alt={row?.original.name}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row?.original.name}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'name',
				header: 'Country Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/countryshipping/routes/${row?.original?._id}/${row?.original?.slug}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.name}
					</Typography>
				)
			},
			{
				accessorKey: 'latitude',
				header: 'Latitudinal Cordinate',
				accessorFn: (row) => `${row?.latitude}`
			},
			{
				accessorKey: 'longitude',
				header: 'Longitudinal Cordinate',
				accessorFn: (row) => `${row?.longitude}`
			},
			{
				accessorKey: 'isoCode',
				header: 'Country Code',
				accessorFn: (row) => `${row?.isoCode}`
			},

			{
				accessorKey: 'action',
				header: 'Country Name',
				Cell: ({ row }) => (
					<Chip
						component={Link}
						to={`/countryshipping/routes/${row?.original?._id}/${row?.original?.slug}`}
						className="underline cursor-pointer"
						label="Manage This Shipping Route"
					/>
				)
			}
		],
		[]
	);

	if (countriesLoading) {
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

	if (!countryShippingDatas?.data?.data) {
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
				data={countryShippingDatas?.data?.data}
				columns={columns}
			/>
		</Paper>
	);
}

export default CountryShippingTable;
