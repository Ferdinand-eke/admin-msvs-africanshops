import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';

// Material-UI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Date Picker
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

// Fuse Components
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';

// Hooks and API
import {
	useAdminRecruitAfricanshopStaff,
	useAdminStaffUpdateMutation,
	useDeleteAdminStaffMutation,
	useNonPopulatedSingleAdminStaff
} from 'src/app/api/admin-users/useAdmins';
import { useGetDepartments } from 'src/app/api/departments/useDepartments';
import useCountries from 'src/app/api/countries/useCountries';
import { getDesigByDepartmentId, getOperationalLgaByStateId, getStateByCountryId } from 'src/app/api/apiRoutes';

/**
 * Form Validation Schema
 */
const staffRecruitmentSchema = z.object({
	// Personal Information
	name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
	email: z.string().email('Invalid email address').min(1, 'Email is required'),
	phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
	gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Gender is required' }),
	birthday: z.string().optional(),
	address: z.string().min(5, 'Address must be at least 5 characters').optional().or(z.literal('')),

	// Location Information
	officeCountry: z.string().min(1, 'Country is required'),
	officeState: z.string().min(1, 'State is required'),
	officeLga: z.string().min(1, 'LGA/County is required'),

	// Organizational Information
	department: z.string().min(1, 'Department is required'),
	designation: z.string().min(1, 'Designation is required'),

	// Optional fields - allow any type for avatar/background as they might be objects from backend
	avatar: z.any().optional(),
	background: z.any().optional(),
	instagram: z.string().optional(),
	twitter: z.string().optional(),
	facebook: z.string().optional(),
	linkedin: z.string().optional()
});

const defaultValues = {
	avatar: '',
	background: '',
	name: '',
	email: '',
	phone: '',
	gender: '',
	birthday: '',
	address: '',
	officeCountry: '',
	officeState: '',
	officeLga: '',
	department: '',
	designation: '',
	instagram: '',
	twitter: '',
	facebook: '',
	linkedin: ''
};

/**
 * Custom Birthday Icon Component
 */
function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

/**
 * Section Title Component
 */
function SectionTitle({ icon, title }) {
	return (
		<Box className="flex items-center gap-8 mb-16 mt-32">
			<FuseSvgIcon
				size={20}
				className="text-primary"
			>
				{icon}
			</FuseSvgIcon>
			<Typography
				variant="h6"
				className="font-semibold"
			>
				{title}
			</Typography>
		</Box>
	);
}

/**
 * Professional Admin Staff Recruitment Form Component
 */
function AddStaffContactForm() {
	const navigate = useNavigate();
	const { id: contactId } = useParams();
	const isNewStaff = contactId === 'new';

	// Form State
	const { control, watch, reset, handleSubmit, formState, setValue, trigger } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(staffRecruitmentSchema)
	});

	const { isValid, dirtyFields, errors } = formState;

	// Debug: Log form state changes
	useEffect(() => {
		if (!isNewStaff) {
			console.log('Form State Debug:', {
				isValid,
				dirtyFields: Object.keys(dirtyFields),
				hasDirtyFields: Object.keys(dirtyFields).length > 0,
				errors: errors, // Show full error objects with messages
				errorKeys: Object.keys(errors),
				formValues: watch()
			});
		}
	}, [isValid, dirtyFields, errors, isNewStaff, watch]);

	// Watch form fields for dependent selects
	const selectedDepartment = watch('department');
	const selectedCountry = watch('officeCountry');
	const selectedState = watch('officeState');

	// API Hooks
	const { data: adminData, isLoading: adminLoading, isError: adminIsError } = useNonPopulatedSingleAdminStaff(
		contactId,
		{ skip: isNewStaff }
	);
	const { data: countriesData, isLoading: countriesLoading } = useCountries();
	const { data: departmentsData, isLoading: departmentsLoading } = useGetDepartments();

	const recruitStaff = useAdminRecruitAfricanshopStaff();
	const updateStaffInfo = useAdminStaffUpdateMutation();
	const deleteAdmin = useDeleteAdminStaffMutation();

	// Local State for Cascading Selects
	const [states, setStates] = useState([]);
	const [lgas, setLgas] = useState([]);
	const [designations, setDesignations] = useState([]);
	const [loadingStates, setLoadingStates] = useState(false);
	const [loadingLgas, setLoadingLgas] = useState(false);
	const [loadingDesignations, setLoadingDesignations] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

	// Extract data from API responses
	const countries = useMemo(() => countriesData?.data?.countries || [], [countriesData]);
	const departments = useMemo(() => departmentsData?.data?.departments || [], [departmentsData]);

	/**
	 * Fetch States when Country changes
	 */
	const fetchStates = useCallback(
		async (countryId, shouldClearDependents = true) => {
			if (!countryId) {
				setStates([]);
				setLgas([]);
				if (shouldClearDependents) {
					setValue('officeState', '');
					setValue('officeLga', '');
				}
				return;
			}

			setLoadingStates(true);
			try {
				const response = await getStateByCountryId(countryId);
				setStates(response?.data?.states || []);

				if (shouldClearDependents) {
					setLgas([]);
					setValue('officeState', '');
					setValue('officeLga', '');
				}
			} catch (error) {
				console.error('Error fetching states:', error);
				setStates([]);
			} finally {
				setLoadingStates(false);
			}
		},
		[setValue]
	);

	/**
	 * Fetch LGAs when State changes
	 */
	const fetchLgas = useCallback(
		async (stateId, shouldClearDependent = true) => {
			if (!stateId) {
				setLgas([]);
				if (shouldClearDependent) {
					setValue('officeLga', '');
				}
				return;
			}

			setLoadingLgas(true);
			try {
				const response = await getOperationalLgaByStateId(stateId);
				setLgas(response?.data?.lgas || []);

				if (shouldClearDependent) {
					setValue('officeLga', '');
				}
			} catch (error) {
				console.error('Error fetching LGAs:', error);
				setLgas([]);
			} finally {
				setLoadingLgas(false);
			}
		},
		[setValue]
	);

	/**
	 * Fetch Designations when Department changes
	 */
	const fetchDesignations = useCallback(
		async (departmentId, shouldClearDependent = true) => {
			if (!departmentId) {
				setDesignations([]);
				if (shouldClearDependent) {
					setValue('designation', '');
				}
				return;
			}

			setLoadingDesignations(true);
			try {
				const response = await getDesigByDepartmentId(departmentId);
				setDesignations(response?.data?.designations || []);

				if (shouldClearDependent) {
					setValue('designation', '');
				}
			} catch (error) {
				console.error('Error fetching designations:', error);
				setDesignations([]);
			} finally {
				setLoadingDesignations(false);
			}
		},
		[setValue]
	);

	/**
	 * Effect: Populate form when editing existing staff
	 * Also pre-load dependent dropdowns (states, LGAs, designations)
	 */
	useEffect(() => {
		if (!isNewStaff && adminData?.data?.admin) {
			const staffData = adminData.data.admin;

			// Pre-populate cascading selects based on existing data in parallel
			const loadDependentData = async () => {
				setIsLoadingInitialData(true);

				try {
					const promises = [];

					// Load states if country is selected
					if (staffData.officeCountry) {
						promises.push(
							getStateByCountryId(staffData.officeCountry)
								.then((response) => setStates(response?.data?.states || []))
								.catch((error) => console.error('Error loading states:', error))
						);
					}

					// Load LGAs if state is selected
					if (staffData.officeState) {
						promises.push(
							getOperationalLgaByStateId(staffData.officeState)
								.then((response) => setLgas(response?.data?.lgas || []))
								.catch((error) => console.error('Error loading LGAs:', error))
						);
					}

					// Load designations if department is selected
					if (staffData.department) {
						promises.push(
							getDesigByDepartmentId(staffData.department)
								.then((response) => setDesignations(response?.data?.designations || []))
								.catch((error) => console.error('Error loading designations:', error))
						);
					}

					// Wait for all dependent data to load before resetting form
					await Promise.all(promises);

					// Small delay to ensure state updates are complete
					await new Promise((resolve) => setTimeout(resolve, 100));

					// Now reset form with staff data - this ensures dropdowns are populated first
					// Use keepDirtyValues: false to ensure form state is properly reset
					reset(staffData, { keepDirtyValues: false });

					// Trigger validation after reset to ensure isValid is correct
					await new Promise((resolve) => setTimeout(resolve, 50));
					trigger();
				} catch (error) {
					console.error('Error loading form data:', error);
				} finally {
					setIsLoadingInitialData(false);
				}
			};

			loadDependentData();
		}
	}, [adminData, isNewStaff, reset, trigger]);

	/**
	 * Effect: Fetch states when country changes (user interaction)
	 */
	useEffect(() => {
		// Only fetch if this is a user-initiated change, not initial load
		if (selectedCountry && (isNewStaff || formState.dirtyFields.officeCountry)) {
			fetchStates(selectedCountry);
		}
	}, [selectedCountry, fetchStates, isNewStaff, formState.dirtyFields.officeCountry]);

	/**
	 * Effect: Fetch LGAs when state changes (user interaction)
	 */
	useEffect(() => {
		// Only fetch if this is a user-initiated change, not initial load
		if (selectedState && (isNewStaff || formState.dirtyFields.officeState)) {
			fetchLgas(selectedState);
		}
	}, [selectedState, fetchLgas, isNewStaff, formState.dirtyFields.officeState]);

	/**
	 * Effect: Fetch designations when department changes (user interaction)
	 */
	useEffect(() => {
		// Only fetch if this is a user-initiated change, not initial load
		if (selectedDepartment && (isNewStaff || formState.dirtyFields.department)) {
			fetchDesignations(selectedDepartment);
		}
	}, [selectedDepartment, fetchDesignations, isNewStaff, formState.dirtyFields.department]);

	/**
	 * Form Submission Handlers
	 */
	const onSubmit = useCallback(
		(data) => {
			recruitStaff.mutate(data);
		},
		[recruitStaff]
	);

	const onUpdate = useCallback(
		(data) => {
			console.log('🎯 onUpdate CALLED - Function has been triggered!');
			console.log('📝 Form data received:', data);

			// Merge the existing admin data with the updated form data
			// This preserves fields like id, _id, createdAt, etc. that aren't in the form
			const existingAdminData = adminData?.data?.admin || {};
			console.log('📦 Existing admin data:', existingAdminData);

			const updatePayload = {
				...existingAdminData, // Start with existing admin data
				...data, // Override with updated form values
				id: existingAdminData.id || existingAdminData._id, // Ensure ID is present
				_id: existingAdminData._id || existingAdminData.id // Ensure _id is present
			};

			console.log('🚀 Final update payload:', updatePayload);
			console.log('⏳ Calling mutation...');
			updateStaffInfo.mutate(updatePayload);
		},
		[updateStaffInfo, adminData]
	);

	/**
	 * Update Button Click Handler with Logging
	 */
	const handleUpdateButtonClick = useCallback(
		(e) => {
			console.log('🔘 UPDATE BUTTON CLICKED!');
			console.log('📊 Current form state:', {
				isValid,
				errorCount: Object.keys(errors).length,
				errors: errors,
				dirtyFields: Object.keys(dirtyFields)
			});

			// Call handleSubmit which will only call onUpdate if form is valid
			handleSubmit(
				(data) => {
					console.log('✅ handleSubmit SUCCESS - Form is valid, calling onUpdate');
					onUpdate(data);
				},
				(errors) => {
					console.log('❌ handleSubmit FAILED - Form has validation errors:');
					console.log('Validation errors:', errors);
				}
			)(e);
		},
		[handleSubmit, onUpdate, isValid, errors, dirtyFields]
	);

	/**
	 * Delete Handler with Confirmation Dialog
	 */
	const handleOpenDeleteDialog = () => {
		setDeleteDialogOpen(true);
	};

	const handleCloseDeleteDialog = () => {
		setDeleteDialogOpen(false);
	};

	const handleConfirmDelete = () => {
		deleteAdmin.mutate(adminData?.data?.admin?.id || adminData?.data?.admin?._id);
		setDeleteDialogOpen(false);
	};

	/**
	 * Cancel Handler
	 */
	const handleCancel = () => {
		navigate(-1);
	};

	/**
	 * Loading State  || isLoadingInitialData
	 */
	if ((adminLoading ) && !isNewStaff) {
		return <FuseLoading />;
	}

	/**
	 * Error State
	 */
	if (adminIsError && !isNewStaff) {
		return (
			<Box className="flex flex-col items-center justify-center h-full p-24">
				<Alert
					severity="error"
					className="max-w-md"
				>
					<AlertTitle>Error Loading Staff Data</AlertTitle>
					Unable to load staff information. Please try again or contact support.
				</Alert>
				<Button
					variant="outlined"
					color="primary"
					className="mt-24"
					onClick={handleCancel}
				>
					Go Back
				</Button>
			</Box>
		);
	}

	return (
		<>
			{/* Header Section with Gradient */}
			<Box
				className="relative w-full px-24 sm:px-48 py-32"
				sx={{
					background: isNewStaff
						? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
						: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
					color: 'white',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.2))',
						pointerEvents: 'none'
					}
				}}
			>
				<Box className="relative z-10 flex items-start justify-between">
					<Box className="flex-1 pr-48">
						<Box className="flex items-center gap-12 mb-8">
							<FuseSvgIcon
								size={32}
								className="text-white"
							>
								{isNewStaff ? 'heroicons-outline:user-add' : 'heroicons-outline:pencil-alt'}
							</FuseSvgIcon>
							<Typography
								variant="h4"
								className="font-bold text-white"
							>
								{isNewStaff ? 'Recruit New Staff Member' : 'Update Staff Information'}
							</Typography>
						</Box>
						<Typography
							variant="body1"
							className="text-white opacity-90"
						>
							{isNewStaff
								? 'Fill in the details below to recruit a new staff member to your organization'
								: 'Update the information for this staff member'}
						</Typography>
					</Box>

					{/* Close Button - Prominently Visible */}
					<Tooltip title="Close Form">
						<IconButton
							onClick={handleCancel}
							className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
							sx={{
								color: 'white',
								boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
								'&:hover': {
									transform: 'scale(1.05)',
									boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
								}
							}}
							size="large"
						>
							<FuseSvgIcon size={24}>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</Tooltip>
				</Box>
			</Box>

			<Divider />

			{/* Form Content */}
			<Box
				component="form"
				className="flex flex-col flex-auto px-24 sm:px-48 pb-24"
			>
				{/* Personal Information Section */}
				<SectionTitle
					icon="heroicons-outline:user"
					title="Personal Information"
				/>
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="name"
							render={({ field }) => (
								<TextField
									{...field}
									label="Full Name"
									placeholder="Enter staff full name"
									variant="outlined"
									fullWidth
									required
									error={!!errors.name}
									helperText={errors?.name?.message}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
											</InputAdornment>
										)
									}}
								/>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<TextField
									{...field}
									label="Email Address"
									placeholder="staff@africanshops.com"
									variant="outlined"
									fullWidth
									required
									type="email"
									disabled={!isNewStaff}
									error={!!errors.email}
									helperText={errors?.email?.message || (!isNewStaff && 'Email cannot be changed')}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
											</InputAdornment>
										)
									}}
								/>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="phone"
							render={({ field }) => (
								<TextField
									{...field}
									label="Phone Number"
									placeholder="+234 800 000 0000"
									variant="outlined"
									fullWidth
									error={!!errors.phone}
									helperText={errors?.phone?.message}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
											</InputAdornment>
										)
									}}
								/>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="gender"
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.gender}
									required
								>
									<InputLabel id="gender-label">Gender</InputLabel>
									<Select
										{...field}
										labelId="gender-label"
										label="Gender"
										startAdornment={
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:identification</FuseSvgIcon>
											</InputAdornment>
										}
									>
										<MenuItem value="">
											<em>Select Gender</em>
										</MenuItem>
										<MenuItem value="MALE">Male</MenuItem>
										<MenuItem value="FEMALE">Female</MenuItem>
									</Select>
									{errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
								</FormControl>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="birthday"
							render={({ field: { value, onChange } }) => (
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateTimePicker
										value={value ? new Date(value) : null}
										onChange={(val) => {
											onChange(val?.toISOString());
										}}
										slotProps={{
											textField: {
												label: 'Date of Birth',
												fullWidth: true,
												variant: 'outlined',
												error: !!errors.birthday,
												helperText: errors?.birthday?.message,
												InputProps: {
													startAdornment: (
														<InputAdornment position="start">
															<FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>
														</InputAdornment>
													)
												}
											},
											actionBar: {
												actions: ['clear', 'today']
											}
										}}
										slots={{
											openPickerIcon: BirthdayIcon
										}}
									/>
								</LocalizationProvider>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="address"
							render={({ field }) => (
								<TextField
									{...field}
									label="Residential Address"
									placeholder="Enter residential address"
									variant="outlined"
									fullWidth
									error={!!errors.address}
									helperText={errors?.address?.message}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
											</InputAdornment>
										)
									}}
								/>
							)}
						/>
					</Grid>
				</Grid>

				{/* Location Information Section */}
				<SectionTitle
					icon="heroicons-outline:office-building"
					title="Office Location"
				/>
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={4}
					>
						<Controller
							control={control}
							name="officeCountry"
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.officeCountry}
									required
								>
									<InputLabel id="country-label">Country</InputLabel>
									<Select
										{...field}
										labelId="country-label"
										label="Country"
										disabled={countriesLoading}
										startAdornment={
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:globe</FuseSvgIcon>
											</InputAdornment>
										}
									>
										<MenuItem value="">
											<em>Select Country</em>
										</MenuItem>
										{countries.map((country) => (
											<MenuItem
												key={country.id}
												value={country.id}
											>
												{country.name}
											</MenuItem>
										))}
									</Select>
									{errors.officeCountry && <FormHelperText>{errors.officeCountry.message}</FormHelperText>}
								</FormControl>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={4}
					>
						<Controller
							control={control}
							name="officeState"
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.officeState}
									required
									disabled={!selectedCountry || loadingStates}
								>
									<InputLabel id="state-label">State</InputLabel>
									<Select
										{...field}
										labelId="state-label"
										label="State"
										startAdornment={
											<InputAdornment position="start">
												{loadingStates ? (
													<CircularProgress size={20} />
												) : (
													<FuseSvgIcon size={20}>heroicons-solid:map</FuseSvgIcon>
												)}
											</InputAdornment>
										}
									>
										<MenuItem value="">
											<em>Select State</em>
										</MenuItem>
										{states.map((state) => (
											<MenuItem
												key={state.id}
												value={state.id}
											>
												{state.name}
											</MenuItem>
										))}
									</Select>
									{errors.officeState && <FormHelperText>{errors.officeState.message}</FormHelperText>}
									{!selectedCountry && <FormHelperText>Please select a country first</FormHelperText>}
								</FormControl>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={4}
					>
						<Controller
							control={control}
							name="officeLga"
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.officeLga}
									required
									disabled={!selectedState || loadingLgas}
								>
									<InputLabel id="lga-label">LGA / County</InputLabel>
									<Select
										{...field}
										labelId="lga-label"
										label="LGA / County"
										startAdornment={
											<InputAdornment position="start">
												{loadingLgas ? (
													<CircularProgress size={20} />
												) : (
													<FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
												)}
											</InputAdornment>
										}
									>
										<MenuItem value="">
											<em>Select LGA/County</em>
										</MenuItem>
										{lgas.map((lga) => (
											<MenuItem
												key={lga.id}
												value={lga.id}
											>
												{lga.name}
											</MenuItem>
										))}
									</Select>
									{errors.officeLga && <FormHelperText>{errors.officeLga.message}</FormHelperText>}
									{!selectedState && <FormHelperText>Please select a state first</FormHelperText>}
								</FormControl>
							)}
						/>
					</Grid>
				</Grid>

				{/* Organizational Information Section */}
				<SectionTitle
					icon="heroicons-outline:briefcase"
					title="Organizational Assignment"
				/>
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="department"
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.department}
									required
								>
									<InputLabel id="department-label">Department</InputLabel>
									<Select
										{...field}
										labelId="department-label"
										label="Department"
										disabled={departmentsLoading}
										startAdornment={
											<InputAdornment position="start">
												<FuseSvgIcon size={20}>heroicons-solid:office-building</FuseSvgIcon>
											</InputAdornment>
										}
									>
										<MenuItem value="">
											<em>Select Department</em>
										</MenuItem>
										{departments.map((dept) => (
											<MenuItem
												key={dept.id}
												value={dept.id}
											>
												{dept.name}
											</MenuItem>
										))}
									</Select>
									{errors.department && <FormHelperText>{errors.department.message}</FormHelperText>}
								</FormControl>
							)}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name="designation"
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.designation}
									required
									disabled={!selectedDepartment || loadingDesignations}
								>
									<InputLabel id="designation-label">Designation</InputLabel>
									<Select
										{...field}
										labelId="designation-label"
										label="Designation"
										startAdornment={
											<InputAdornment position="start">
												{loadingDesignations ? (
													<CircularProgress size={20} />
												) : (
													<FuseSvgIcon size={20}>heroicons-solid:badge-check</FuseSvgIcon>
												)}
											</InputAdornment>
										}
									>
										<MenuItem value="">
											<em>Select Designation</em>
										</MenuItem>
										{designations.map((desig) => (
											<MenuItem
												key={desig.id}
												value={desig.id}
											>
												{desig.name}
											</MenuItem>
										))}
									</Select>
									{errors.designation && <FormHelperText>{errors.designation.message}</FormHelperText>}
									{!selectedDepartment && <FormHelperText>Please select a department first</FormHelperText>}
								</FormControl>
							)}
						/>
					</Grid>
				</Grid>

				{/* Form Actions */}
				<Box className="flex items-center justify-between mt-48 pt-24 border-t">
					{!isNewStaff && (
						<Button
							variant="outlined"
							color="error"
							onClick={handleOpenDeleteDialog}
							startIcon={<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>}
						>
							Delete Staff
						</Button>
					)}

					{isNewStaff && <div />}

					<Box className="flex gap-12">
						<Button
							variant="outlined"
							onClick={handleCancel}
							disabled={recruitStaff.isLoading || updateStaffInfo.isLoading}
						>
							Cancel
						</Button>

						{isNewStaff ? (
							<Button
								variant="contained"
								color="secondary"
								onClick={handleSubmit(onSubmit)}
								disabled={!isValid || recruitStaff.isLoading}
								startIcon={
									recruitStaff.isLoading ? (
										<CircularProgress
											size={20}
											color="inherit"
										/>
									) : (
										<FuseSvgIcon>heroicons-outline:user-add</FuseSvgIcon>
									)
								}
							>
								{recruitStaff.isLoading ? 'Recruiting...' : 'Recruit Staff'}
							</Button>
						) : (
							<Button
								variant="contained"
								color="secondary"
								onClick={handleUpdateButtonClick}
								disabled={updateStaffInfo.isLoading}
								startIcon={
									updateStaffInfo.isLoading ? (
										<CircularProgress
											size={20}
											color="inherit"
										/>
									) : (
										<FuseSvgIcon>heroicons-outline:save</FuseSvgIcon>
									)
								}
							>
								{updateStaffInfo.isLoading ? 'Updating...' : 'Update Staff'}
							</Button>
						)}
					</Box>
				</Box>
			</Box>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteDialogOpen}
				onClose={handleCloseDeleteDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle className="flex items-center gap-8">
					<FuseSvgIcon
						className="text-red-600"
						size={24}
					>
						heroicons-outline:exclamation-triangle
					</FuseSvgIcon>
					Confirm Staff Deletion
				</DialogTitle>
				<DialogContent>
					<Alert
						severity="warning"
						className="mb-16"
					>
						<AlertTitle>Warning: This action cannot be undone</AlertTitle>
						Deleting this staff member will permanently remove them from the system.
					</Alert>
					<DialogContentText>
						Are you absolutely certain you want to delete{' '}
						<strong>{adminData?.data?.admin?.name || 'this staff member'}</strong>? This action will:
					</DialogContentText>
					<Box
						component="ul"
						className="mt-12 ml-24"
					>
						<li>Remove all staff access and permissions</li>
						<li>Delete staff profile and contact information</li>
						<li>This change is permanent and cannot be reversed</li>
					</Box>
				</DialogContent>
				<DialogActions className="px-24 pb-16">
					<Button
						onClick={handleCloseDeleteDialog}
						color="primary"
						variant="outlined"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmDelete}
						color="error"
						variant="contained"
						disabled={deleteAdmin.isLoading}
						startIcon={
							deleteAdmin.isLoading ? (
								<CircularProgress
									size={20}
									color="inherit"
								/>
							) : (
								<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
							)
						}
					>
						{deleteAdmin.isLoading ? 'Deleting...' : 'Delete Staff'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default AddStaffContactForm;
