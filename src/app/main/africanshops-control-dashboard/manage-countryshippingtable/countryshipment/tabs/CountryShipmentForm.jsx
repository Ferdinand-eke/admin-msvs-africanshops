import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import _ from '@lodash';
import { Button, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
// import { useTransferToShopWalletMutation } from "app/configs/data/server-calls/shopwithdrawals/useShopWithdrawals";
import { useEffect, useState } from 'react';
import {
	useCountriesWithShippingTableOriginExcluded,
	// useCountryAddShippingTableMutation,
	useCountryDeleteShippingMutation,
	useCountryUpdateShippingMutation
} from 'src/app/api/countries/useCountries';
import { useParams } from 'react-router';
/**
 * The activities page.
 */

const item = {
	image: '',
	name: 'John Doe',
	description:
		'Receive orders from intending buyers, package products ordered and make available at our order collation units within your market,'
};

function CountryShipmentForm(props) {
	//   const tranferFunds = useTransferToShopWalletMutation();
	const {
		shipmentData,

		toggleDrawer
	} = props;
	const defaultId = 'new';
	// console.log("singleShipment-IN-ShipmentForm", shipmentData)
	const routeParams = useParams();
	const { productId } = routeParams;
	const { data: countries, isLoading, isError } = useCountriesWithShippingTableOriginExcluded(productId);
	// // , {
	// 	skip: !productId || productId === 'new'
	// }
	const [drawerError, setDrawerError] = useState('');

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			countryCheckOrigin: '',
			countryToShipTo: '',
			perCbmFreightFee: '',
			airKilogramFreightFee: '',
			landKilogramFreightFee: ''
		}
		// resolver: zodResolver(schema)
	});
	// const methods = useFormContext();
	const { control, formState, watch, getValues, reset, setValue } = methods;
	const { isValid, dirtyFields, errors } = formState;
	// const addToCountryShipmentTable = useCountryAddShippingTableMutation();
	const updateCountryShipmentTable = useCountryUpdateShippingMutation();
	const deleteCountryShipment = useCountryDeleteShippingMutation();

	useEffect(() => {
		if (shipmentData?.countryToShipTo?._id) {
			reset({
				...shipmentData,
				countryToShipTo: shipmentData?.countryToShipTo?._id
			});
		}
	}, [shipmentData?.countryToShipTo?._id, defaultId, reset]);

	function handleSaveShipmentRoute() {
		updateCountryShipmentTable.mutate(getValues());
	}

	function handleRemoveRoute() {
		if (window.confirm('Comfirm delete of this shipment route?')) {
			// deleteShopPlan.mutate(productId)

			console.log('deleting Shipment-Route', getValues());
			// return
			deleteCountryShipment.mutate(getValues());
		}
	}

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	return (
		<FusePageSimple
			content={
				<div className="flex flex-auto flex-col px-12 py-40 sm:px-6 sm:pb-80 sm:pt-72">
					<div className="flex flex-auto justify-between items-center">
						<Typography className="text-2xl font-extrabold leading-none tracking-tight mb-20">
							Update shipping route.
						</Typography>
						{/* <Typography className="mt-6 text-lg" color="text.secondary">
              You can move your funds from merchant acounts to wallet for onward
              withdrawal.
              </Typography> */}

						<Typography
							className="font-extrabold leading-none tracking-tight mb-20"
							onClick={toggleDrawer(false)}
						>
							{' '}
							close form
						</Typography>
					</div>

					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>
						Shipment Destination Country?
					</Typography>
					<Controller
						name="countryToShipTo"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange, value } }) => (
							<Select
								className="mt-8 mb-16"
								id="countryToShipTo"
								label="Shipment Destination Country"
								fullWidth
								defaultValue=""
								onChange={onChange}
								value={value === undefined || null ? '' : value}
								error={!!errors.countryToShipTo}
								helpertext={errors?.countryToShipTo?.message}
								//  {...other}
								//  {...(error && {error: true, helperText: error})}
								disabled
							>
								<MenuItem value="">Select a country</MenuItem>
								{countries?.data &&
									countries?.data?.map((option, id) => (
										<MenuItem
											key={option._id}
											value={option._id}
										>
											{option.name}
										</MenuItem>
									))}
							</Select>
						)}
					/>

					<Controller
						name="perCbmFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-4"
								label=" Price Per Cbm Fee"
								id="perCbmFreightFee"
								InputProps={{
									startAdornment: <InputAdornment position="start">NGN</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						name="airKilogramFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-4"
								label="  Price Per Kilo (Air-based)"
								id="airKilogramFreightFee"
								InputProps={{
									startAdornment: <InputAdornment position="start">NGN</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						name="landKilogramFreightFee"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 mx-4"
								label=" Price Per Kilo (Land-based)"
								id="landKilogramFreightFee"
								InputProps={{
									startAdornment: <InputAdornment position="start">NGN</InputAdornment>
								}}
								type="number"
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || updateCountryShipmentTable.isLoading}
						onClick={handleSaveShipmentRoute}
					>
						Save Shipment Route
					</Button>

					<div className="mt-20 flex flex-auto justify-between items-center">
						<Typography className="text-2xl font-extrabold leading-none tracking-tight mb-20">
							Close this shipping route.
						</Typography>
						{/* <Typography className="mt-6 text-lg" color="text.secondary">
              You can move your funds from merchant acounts to wallet for onward
              withdrawal.
              </Typography> */}

						<Typography
							className="font-extrabold leading-none tracking-tight mb-20 cursor-pointer"
							onClick={() => handleRemoveRoute()}
						>
							{' '}
							Delete Route
						</Typography>
					</div>
				</div>
			}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default CountryShipmentForm;
