import { useEffect, useState } from 'react';
import {
	Typography,
	IconButton,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Switch,
	FormControlLabel,
	Divider,
	Box,
	Icon,
	CircularProgress
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';


// Common Material Icons for amenities
const ICON_OPTIONS = [
	{ value: 'wifi', label: 'WiFi' },
	{ value: 'ac_unit', label: 'AC Unit' },
	{ value: 'local_parking', label: 'Parking' },
	{ value: 'pool', label: 'Pool' },
	{ value: 'restaurant', label: 'Restaurant' },
	{ value: 'fitness_center', label: 'Fitness Center' },
	{ value: 'spa', label: 'Spa' },
	{ value: 'room_service', label: 'Room Service' },
	{ value: 'pets', label: 'Pets' },
	{ value: 'airport_shuttle', label: 'Airport Shuttle' },
	{ value: 'kitchen', label: 'Kitchen' },
	{ value: 'local_laundry_service', label: 'Laundry' },
	{ value: 'business_center', label: 'Business Center' },
	{ value: 'meeting_room', label: 'Meeting Room' },
	{ value: 'beach_access', label: 'Beach Access' },
	{ value: 'child_friendly', label: 'Child Friendly' },
	{ value: 'accessible', label: 'Accessible' },
	{ value: 'smoke_free', label: 'Smoke Free' },
	{ value: 'bar_chart', label: 'Bar' },
	{ value: 'tv', label: 'TV' },
	{ value: 'hot_tub', label: 'Hot Tub' },
	{ value: 'balcony', label: 'Balcony' },
	{ value: 'elevator', label: 'Elevator' },
	{ value: 'security', label: 'Security' },
	{ value: 'fireplace', label: 'Fireplace' }
];

const CATEGORY_OPTIONS = [
	{value:'InternetTechnology', label:'Internet & Technology'},
	{value:'ClimateControl', label:'Climate Control'},
	{value:'ParkingTransportation', label:'Parking & Transportation'},
	{value:'Recreation', label:'Recreation'},
	{value:'Dining', label:'Dining'},
	{value:'FitnessWellness', label:'Fitness & Wellness'},
	{value:'Policies', label:'Policies'},
	{value:'Services', label:'Services'},
	{value:'RoomAmenities', label:'Room Amenities'},
	{ value:'BusinessAmenities', label:'Business Amenities'},
	{ value:'GeneralAmenities', label:'General Amenities'},
	{ value:'SafetySecurity', label:'Safety & Security'}
];

function AmenityFormPanel({ mode, amenity, onClose, onCreate, onUpdate, isSubmitting = false }) {
	const [selectedIcon, setSelectedIcon] = useState(amenity?.icon || 'wifi');

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
		watch
	} = useForm({
		defaultValues: {
			label: amenity?.label || '',
			icon: amenity?.icon || 'wifi',
			description: amenity?.description || '',
			category: amenity?.category || '',
			isActive: amenity?.isActive !== undefined ? amenity.isActive : true
		}
	});

	// Watch icon field to update preview
	const watchIcon = watch('icon');

	useEffect(() => {
		setSelectedIcon(watchIcon);
	}, [watchIcon]);

	// Reset form when amenity changes
	useEffect(() => {
		if (amenity) {
			reset({
				label: amenity.label,
				icon: amenity.icon,
				description: amenity.description,
				category: amenity.category,
				isActive: amenity.isActive
			});
			setSelectedIcon(amenity.icon);
		} else {
			reset({
				label: '',
				icon: 'wifi',
				description: '',
				category: '',
				isActive: true
			});
			setSelectedIcon('wifi');
		}
	}, [amenity, reset]);

	const onSubmit = (data) => {
		if (mode === 'create') {
			onCreate(data);
		} else {
			onUpdate(data);
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center justify-between p-24 border-b">
				<div className="flex items-center gap-12">
					<div className="flex items-center justify-center w-40 h-40 rounded-lg bg-blue-100">
						<Icon className="text-blue-600">{selectedIcon}</Icon>
					</div>
					<div>
						<Typography className="text-20 font-bold">
							{mode === 'create' ? 'Add New Amenity' : 'Edit Amenity'}
						</Typography>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							{mode === 'create'
								? 'Create a new amenity for booking properties'
								: 'Update amenity information'}
						</Typography>
					</div>
				</div>
				<IconButton
					onClick={onClose}
					size="small"
				>
					<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
				</IconButton>
			</div>

			{/* Form Content */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col flex-1 overflow-y-auto"
			>
				<div className="p-24 space-y-24">
					{/* Amenity Name */}
					<Controller
						name="label"
						control={control}
						rules={{ required: 'Amenity name is required' }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Amenity Name"
								placeholder="e.g., Free WiFi, Swimming Pool"
								fullWidth
								required
								error={!!errors.label}
								helperText={errors?.label?.message}
								InputProps={{
									startAdornment: <FuseSvgIcon size={20}>heroicons-outline:tag</FuseSvgIcon>
								}}
							/>
						)}
					/>

					{/* Icon Selection */}
					<Controller
						name="icon"
						control={control}
						rules={{ required: 'Icon is required' }}
						render={({ field }) => (
							<FormControl
								fullWidth
								required
								error={!!errors.icon}
							>
								<InputLabel>Icon</InputLabel>
								<Select
									{...field}
									label="Icon"
									renderValue={(value) => (
										<div className="flex items-center gap-8">
											<Icon>{value}</Icon>
											<span>{ICON_OPTIONS.find((opt) => opt.value === value)?.label}</span>
										</div>
									)}
								>
									{ICON_OPTIONS.map((option) => (
										<MenuItem
											key={option.value}
											value={option.value}
										>
											<div className="flex items-center gap-12">
												<Icon>{option.value}</Icon>
												<Typography>{option.label}</Typography>
											</div>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}
					/>

					{/* Category */}
					<Controller
						name="category"
						control={control}
						rules={{ required: 'Category is required' }}
						render={({ field }) => (
							<FormControl
								fullWidth
								required
								error={!!errors.category}
							>
								<InputLabel>Category</InputLabel>
								<Select
									{...field}
									label="Category"
								>
									{CATEGORY_OPTIONS.map((category) => (
										<MenuItem
											key={category?.value}
											value={category?.value}
										>
											{category?.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}
					/>

					{/* Description */}
					<Controller
						name="description"
						control={control}
						rules={{ required: 'Description is required' }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Description"
								placeholder="Describe this amenity in detail..."
								fullWidth
								required
								multiline
								rows={4}
								error={!!errors.description}
								helperText={errors?.description?.message}
							/>
						)}
					/>

					<Divider />

					{/* Active Status */}
					<Controller
						name="isActive"
						control={control}
						render={({ field }) => (
							<FormControlLabel
								control={
									<Switch
										{...field}
										checked={field.value}
										color="success"
									/>
								}
								label={
									<div>
										<Typography className="font-semibold">Active Status</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											Only active amenities can be assigned to properties
										</Typography>
									</div>
								}
							/>
						)}
					/>

					{/* Preview Box */}
					<Box className="p-16 bg-grey-100 rounded-lg">
						<Typography
							className="font-semibold mb-12"
							variant="body2"
						>
							Preview
						</Typography>
						<div className="flex items-center gap-12 p-12 bg-white rounded-lg">
							<div className="flex items-center justify-center w-40 h-40 rounded-lg bg-blue-100">
								<Icon className="text-blue-600">{selectedIcon}</Icon>
							</div>
							<div className="flex-1">
								<Typography className="font-semibold">{watch('label') || 'Amenity Name'}</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{watch('category') || 'Category'}
								</Typography>
							</div>
						</div>
					</Box>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center justify-end gap-12 p-24 border-t mt-auto">
					<Button
						onClick={onClose}
						variant="outlined"
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={isSubmitting}
						startIcon={
							isSubmitting ? (
								<CircularProgress
									size={18}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon size={20}>
									{mode === 'create' ? 'heroicons-outline:plus' : 'heroicons-outline:check'}
								</FuseSvgIcon>
							)
						}
					>
						{mode === 'create' ? 'Create Amenity' : 'Update Amenity'}
					</Button>
				</div>
			</form>
		</div>
	);
}

export default AmenityFormPanel;
