import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import useCountries from 'src/app/api/countries/useCountries';
import { MenuItem, Select } from '@mui/material';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const { data: countries, isLoading: countriesLoading, refetch } = useCountries();
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	return (
		<div>
			{/* <Controller
        name="businessCountry"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Select
            className="mt-8 mb-16"
            id="businessCountry"
            label="business country"
            fullWidth
            defaultValue=""
            onChange={onChange}
            value={value === undefined || null ? "" : value}
            error={!!errors.businessCountry}
            helpertext={errors?.businessCountry?.message}
            //  {...other}
            //  {...(error && {error: true, helperText: error})}
          >
            <MenuItem value="">Select a country</MenuItem>
            {countries?.data?.data &&
              countries?.data?.data?.map((option, id) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        )}
      /> */}

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

			{/* <Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="description"
						label="Description"
						type="text"
						multiline
						rows={5}
						variant="outlined"
						fullWidth
					/>
				)}
			/> */}

			{/* <Controller
				name="categories"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple categories"
								label="Categories"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/> */}

			{/* <Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple tags"
								label="Tags"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/> */}

			{/* <Controller
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
            value={value === undefined || null ? "" : value}
            error={!!errors.isInOperation}
            helpertext={errors?.isInOperation?.message}
          >
            <MenuItem value="">Select an operations status</MenuItem>
                <MenuItem 
				 value={false}>
                  Not Operational
                </MenuItem>

				<MenuItem 
				 value={true}>
                  Operational
                </MenuItem>
       
          </Select>
        )}
      /> */}

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
