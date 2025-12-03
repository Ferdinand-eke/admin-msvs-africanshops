import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Select } from '@mui/material';
// import useHubs from 'src/app/api/tradehubs/useTradeHubs';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	// const { data:countries, isLoading:countriesLoading, refetch } = useCountries();
	// const { data: hubs, isLoading, refetch } = useHubs();

	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	return (
		<div>
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
						//  {...other}
						//  {...(error && {error: true, helperText: error})}
					>
						<MenuItem value="">Select a publish status</MenuItem>
						<MenuItem value={false}>Not Published</MenuItem>

						<MenuItem value>Published</MenuItem>
					</Select>
				)}
			/>

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
						//  {...other}
						//  {...(error && {error: true, helperText: error})}
					>
						<MenuItem value="">Select an fetaured status</MenuItem>
						<MenuItem value={false}>Not Featured</MenuItem>

						<MenuItem value>Featured</MenuItem>
					</Select>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
