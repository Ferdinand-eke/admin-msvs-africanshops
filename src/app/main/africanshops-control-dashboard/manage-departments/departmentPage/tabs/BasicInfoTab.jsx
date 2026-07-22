import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Select, Typography } from '@mui/material';
import NavItemsChecklist from 'app/shared-components/nav-permission/NavItemsChecklist';

/**
 * The basic info tab.
 */

function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;
	const domainType = watch('domainType');
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
					>
						<MenuItem value="">Select an fetaured status</MenuItem>
						<MenuItem value={false}>Not Featured</MenuItem>

						<MenuItem value>Featured</MenuItem>
					</Select>
				)}
			/>

			<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Department Type</Typography>
			<Controller
				name="domainType"
				control={control}
				defaultValue="BUSINESS"
				render={({ field: { onChange, value } }) => (
					<Select
						className="mt-8 mb-16"
						id="domainType"
						fullWidth
						value={value || 'BUSINESS'}
						onChange={onChange}
						error={!!errors.domainType}
					>
						<MenuItem value="BUSINESS">Business department</MenuItem>
						<MenuItem value="CIVIC">Civic-platform vertical</MenuItem>
					</Select>
				)}
			/>

			{domainType === 'CIVIC' && (
				<>
					<Typography style={{ fontSize: '12px', fontWeight: '800' }}>Civic Vertical</Typography>
					<Controller
						name="civicVertical"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<Select
								className="mt-8 mb-16"
								id="civicVertical"
								fullWidth
								value={value || ''}
								onChange={onChange}
								error={!!errors.civicVertical}
							>
								<MenuItem value="">Select a civic vertical</MenuItem>
								<MenuItem value="YOUTHSPORTS">Youth Sports</MenuItem>
								<MenuItem value="HEALTHCARE">Healthcare</MenuItem>
								<MenuItem value="SOCIAL_CIVIC">Social Civic</MenuItem>
								<MenuItem value="DIGITALEDU">Digital Education</MenuItem>
								<MenuItem value="GOVERNANCE">Governance</MenuItem>
							</Select>
						)}
					/>
				</>
			)}

			<Typography style={{ fontSize: '12px', fontWeight: '800' }} className="mt-16 mb-8 block">
				Screens this department may access
			</Typography>
			<Typography variant="caption" color="text.secondary" className="block mb-8">
				A department head (no designation assigned) sees everything checked here. Staff with a designation only
				see this list intersected with their designation&apos;s own screens.
			</Typography>
			<NavItemsChecklist name="allowedNavIds" />
		</div>
	);
}

export default BasicInfoTab;
