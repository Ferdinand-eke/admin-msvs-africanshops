import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Box, Chip, Drawer, Typography } from '@mui/material';
import DataTable from 'app/shared-components/data-table/DataTable';
import { useMemo } from 'react';
import CountryShipmentForm from './CountryShipmentForm';
import AddCountryShipmentForm from './AddCountryShipmentForm ';

/**
 * The basic info tab.
 */
function BasicInfoTab({
	shipmentTable
	// toggleDrawer,
	// open,
	//  setOpen
}) {
	const routeParams = useParams();
	const { productId } = routeParams;
	const methods = useFormContext();
	//   const { control, formState, getValues } = methods;
	//   const { errors } = formState;
	const [open, setOpen] = React.useState(false);
	const [openNewEntry, setOpenNewEntry] = React.useState(false);
	//   const [entryopen, setEntryOpen] = React.useState(false);
	const [shipmentData, setShipmentData] = React.useState({});

	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};
	const toggleNewEntryDrawer = (newOpen) => () => {
		setOpenNewEntry(newOpen);
	};

	const initiateUpdate = (rowData) => {
		// toggleDrawer(true)
		setShipmentData(rowData);
		setOpen(true);
	};

	const addCountryShipmentDrawer = (
		<Box
			sx={{ width: 350 }}
			sm={{ width: 250 }}
			role="presentation"
		>
			<AddCountryShipmentForm toggleNewEntryDrawer={toggleNewEntryDrawer} />
		</Box>
	);

	const DrawerMoveFunds = (
		<Box
			sx={{ width: 350 }}
			sm={{ width: 250 }}
			role="presentation"
		>
			<CountryShipmentForm
				shipmentData={shipmentData}
				toggleDrawer={toggleDrawer}
			/>
		</Box>
	);

	const columns = useMemo(
		() => [
			// {
			// 	accessorFn: (row) => row?.featuredImageId,
			// 	id: 'featuredImageId',
			// 	header: '',
			// 	enableColumnFilter: false,
			// 	enableColumnDragging: false,
			// 	size: 64,
			// 	enableSorting: false,
			// 	Cell: ({ row }) => (
			// 		<div className="flex items-center justify-center">
			// 			{row?.original?.flag?.length > 0  ? (
			// 				<img
			// 					className="w-full max-h-40 max-w-40 block rounded"
			// 					src={row?.original?.flag}
			// 					alt={row?.original.name}
			// 				/>
			// 			) : (
			// 				<img
			// 					className="w-full max-h-40 max-w-40 block rounded"
			// 					src="assets/images/apps/ecommerce/product-image-placeholder.png"
			// 					alt={row?.original.name}
			// 				/>
			// 			)}
			// 		</div>
			// 	)
			// },
			{
				accessorKey: 'countryToShipTo',
				header: 'Freight Destination Country',
				Cell: ({ row }) => (
					<Typography
						// component={Link}
						// to={`/countryshipping/routes/${row?.original?._id}/${row?.original?.slug}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row?.original?.countryToShipTo?.name}
					</Typography>
				)
			},
			{
				accessorKey: 'perCbmFreightFee',
				header: 'Per Cbm Charges',
				accessorFn: (row) => `${row?.perCbmFreightFee}`
			},
			{
				accessorKey: 'airKilogramFreightFee',
				header: 'per/KG Charge(Air)',
				accessorFn: (row) => `${row?.airKilogramFreightFee}`
			},
			{
				accessorKey: 'landKilogramFreightFee',
				header: 'Per/KG Charge(Land)',
				accessorFn: (row) => `${row?.landKilogramFreightFee}`
			},

			{
				accessorKey: 'action',
				header: 'Action',
				Cell: ({ row }) => (
					<>
						<Chip
							className="underline cursor-pointer"
							label="Modify This Shipping Route"
							onClick={() => initiateUpdate(row?.original)}
						/>

						{/* <Chip
					component={Link}
					
					to={`/countryshipping/countryorigin/${row?.original?.countryCheckOrigin}/manage/${row?.original?.countryToShipTo?._id}`}
					className="underline cursor-pointer"
					label='Modify This Shipping Route'
				/> */}
					</>
				)
			}
		],
		[]
	);
	// console.log("shipmentTable", shipmentTable)
	return (
		<>
			<Typography
				className="cursor-pointer"
				//   onClick={toggleDrawer(true)}
				onClick={toggleNewEntryDrawer(true)}
			>
				Add Country Shipment Routess
			</Typography>

			<DataTable
				data={shipmentTable}
				columns={columns}
			/>

			<Drawer
				open={openNewEntry}
				// onClose={toggleDrawer(false)}
			>
				{addCountryShipmentDrawer}
			</Drawer>

			<Drawer
				open={open}
				// onClose={toggleDrawer(false)}
			>
				{DrawerMoveFunds}
			</Drawer>
		</>
	);
}

export default BasicInfoTab;
