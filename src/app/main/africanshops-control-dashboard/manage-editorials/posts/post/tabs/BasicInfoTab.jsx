import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Select, Typography } from '@mui/material';
import usePostCats from 'src/app/api/post-category/usePostCats';
// import useHubs from 'src/app/api/tradehubs/useTradeHubs';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	// const { data:countries, isLoading:countriesLoading, refetch } = useCountries();
	const { data: postcats, isLoading, refetch } = usePostCats();

	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	return (
		<div>
			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Post Category</Typography>
			<Controller
				name="postcategory"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Select
						className="mt-8 mb-16"
						id="postcategory"
						label="post category"
						fullWidth
						defaultValue=""
						onChange={onChange}
						value={value === undefined || null ? '' : value}
						error={!!errors.postcategory}
						helpertext={errors?.postcategory?.message}
					>
						<MenuItem value="">Select a category</MenuItem>
						{postcats?.data?.data &&
							postcats?.data?.data?.map((option, id) => (
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
				name="title"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Title"
						autoFocus
						id="title"
						variant="outlined"
						fullWidth
						error={!!errors.title}
						helperText={errors?.title?.message}
					/>
				)}
			/>

			<Controller
				name="content"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="content"
						label="Content"
						type="text"
						multiline
						rows={15}
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Publish?</Typography>
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

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Featured?</Typography>
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
