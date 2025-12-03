import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import useCountries from 'src/app/api/countries/useCountries';
import { MenuItem, Select, Typography } from '@mui/material';
import { getStateByCountryId } from 'src/app/api/apiRoutes';
import { useEffect, useState } from 'react';
import {
	// Country,
	// State,
	City
} from 'country-state-city';
import LgaSelect from 'src/app/apselects/lgaselect';

/**
 * The basic info tab.
 */
function LgaBasicInfoTab() {
	const { data: countries, isLoading: countriesLoading, refetch } = useCountries();
	const [loading, setLoading] = useState(false);
	const [bstates, setBstates] = useState([]);

	const methods = useFormContext();
	const { control, formState, getValues, setValue, watch } = methods;
	const { errors } = formState;
	const [filteredCountry, setFilteredCountry] = useState({});
	const [filteredState, setFilteredState] = useState({});
	const setCustomValue = (id, value) => {
		setValue(id, value, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true
		});
	};

	const lgalocation = watch('lgalocation');

	useEffect(() => {
		if (getValues()?.businessCountry?.length > 0) {
			getStateDFromCountryId(getValues()?.businessCountry);
		}
	}, [
		getValues()?.businessCountry
		// getValues()?.businezState
	]);

	useEffect(() => {
		if (getValues()?.businessCountry?.length > 0) {
			// const filteredCountry = countries?.data?.countries?.filter((county) => county._id === getValues()?.businessCountry )
			setFilteredCountry(
				countries?.data?.countries?.filter((county) => county.id === getValues()?.businessCountry)[0]
			);
		}

		if (getValues()?.businessState?.length > 0) {
			console.log('performFilter');
			// const filteredCountry = countries?.data?.countries?.filter((county) => county._id === getValues()?.businessCountry )
			setFilteredState(bstates?.filter((state) => state.id === getValues()?.businessState)[0]);
		}

		if (getValues()?.businessCountry && getValues()?.businessState) {
			// console.log("filteredCountries", getValues()?.businessCountry, filteredCountry)
			// console.log("filteredStates", getValues()?.businessState, filteredState)

			console.log('citiesOfAState', City.getCitiesOfState(filteredCountry?.isoCode, filteredState?.isoCode));
		}
	}, [
		getValues()?.businessState,
		getValues()?.businessCountry
		// filteredCountry?.isoCode,
		// filteredState?.isoCode,
	]);

	useEffect(() => {
		if (getValues()?.name) {
			const lgaIsoCode = getValues()?.name?.trim()?.toUpperCase();
			const lgaCode = getValues()?.name?.split(' ').join('')?.toUpperCase();
			// console.log('LGA-ISO-CODE', lgaIsoCode)
			// console.log('LGA-ISO-CODE22', lgaCode)
			setValue('isoCode', lgaCode);
		}
	}, [getValues()?.name]);

	async function getStateDFromCountryId(pid) {
		setLoading(true);

		const responseData = await getStateByCountryId(pid);

		if (responseData) {
			setBstates(responseData?.data?.states);
			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	return (
		<div>
			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Country of L.G.A/County?</Typography>
			<Controller
				name="businessCountry"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						// disabled
						className="mt-8 mb-16"
						id="businessCountry"
						label="business country"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.businessCountry}
						helpertext={errors?.businessCountry?.message}
					>
						<MenuItem value="">Select a country</MenuItem>
						{countries?.data?.countries &&
							countries?.data?.countries?.map((option, id) => (
								<MenuItem
									key={option.id}
									value={option.id}
								>
									{option.name}
								</MenuItem>
							))}
					</Select>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>
				State of L.G.A/County? (Dependent on country selected)
			</Typography>
			<Controller
				name="businessState"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						// disabled
						className="mt-8 mb-16"
						id="businessState"
						label="business state"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.businessState}
						helpertext={errors?.businessState?.message}
					>
						<MenuItem value="">Select a state</MenuItem>
						{bstates &&
							bstates?.map((option, id) => (
								<MenuItem
									key={option.id}
									value={option.id}
								>
									{option.name}
								</MenuItem>
							))}
					</Select>
				)}
			/>

			<LgaSelect
				value={lgalocation}
				onChange={(value) => setCustomValue('lgalocation', value)}
				countryCode={filteredCountry?.isoCode}
				stateCode={filteredState?.isoCode}
			/>

			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Name"
						autoFocus
						id="name"
						variant="outlined"
						fullWidth
						error={!!errors.name}
						helperText={errors?.name?.message}
					/>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>
				Are we operational in this LGA/County?
			</Typography>
			<Controller
				name="isInOperation"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						className="mt-8 mb-16"
						id="isInOperation"
						label="Operational Status"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.isInOperation}
						helpertext={errors?.isInOperation?.message}
					>
						<MenuItem value="">Select an operations status</MenuItem>
						<MenuItem value={false}>Not Operational</MenuItem>

						<MenuItem value>Operational</MenuItem>
					</Select>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Publish this LGA/County?</Typography>

			<Controller
				name="isPublished"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						className="mt-8 mb-16"
						id="isPublished"
						label="Operational Status"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.isPublished}
						helpertext={errors?.isPublished?.message}
					>
						<MenuItem value="">Select a publish status</MenuItem>
						<MenuItem value={false}>Not Published</MenuItem>

						<MenuItem value>Published</MenuItem>
					</Select>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Feature this LGA/County?</Typography>

			<Controller
				name="isFeatured"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						className="mt-8 mb-16"
						id="isFeatured"
						label="Operational Status"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.isFeatured}
						helpertext={errors?.isFeatured?.message}
					>
						<MenuItem value="">Select an fetaured status</MenuItem>
						<MenuItem value={false}>Not Featured</MenuItem>

						<MenuItem value>Featured</MenuItem>
					</Select>
				)}
			/>

			{/* <Controller
        name="lgaCode"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            required
            label="LGA Code"
            autoFocus
            id="sku"
            variant="outlined"
            fullWidth
          />
        )}
      /> */}
			<Controller
				name="isoCode"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="iso code"
						autoFocus
						id="isoCode"
						variant="outlined"
						fullWidth
						error={!!errors.isoCode}
						helperText={errors?.isoCode?.message}
					/>
				)}
			/>

			<Controller
				name="longitude"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Longitudinal Location"
						autoFocus
						id="lng"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="latitude"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Loatitudinal Location"
						autoFocus
						id="lat"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default LgaBasicInfoTab;
