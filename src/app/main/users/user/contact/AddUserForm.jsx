import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import Avatar from "@mui/material/Avatar";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import history from '@history';
import { useAppDispatch } from 'app/store/hooks';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useGetDepartments } from 'src/app/api/departments/useDepartments';
import { getDesigByDepartmentId, getLgaByStateId, getOfficeByLgaId, getStateByCountryId } from 'src/app/api/apiRoutes';
import { Typography } from '@mui/material';
import useCountries from 'src/app/api/countries/useCountries';
import { useAdminUpdateUserDetailMutation, useSingleUser } from 'src/app/api/users/useUsers';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

function BirtdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

/**
 * Form Validation Schema
 */
// Zod schema for ContactEmail
const ContactEmailSchema = z.object({
	email: z.string().optional(),
	type: z.string().optional()
});
// Zod schema for ContactPhoneNumber
const ContactPhoneNumberSchema = z.object({
	number: z.string().optional(),
	type: z.string().optional()
});
const schema = z.object({
	avatar: z.string().optional(),
	background: z.string().optional(),
	name: z.string().min(1, { message: 'Name is required' }),
	email: z.string().optional(),
	phone: z.string(ContactPhoneNumberSchema).optional(),
	birthday: z.string().optional(),
	address: z.string().optional()
});

const defaultValues = {
	avatar: '',
	name: '',
	countryorigin: '',
	stateorigin: '',
	lgaorigin: '',
	officeDesignate: '',
	market: '',
	department: '',
	designation: '',
	gender: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',

	instagram: '',
	twitter: '',
	facebook: '',
	linkedin: ''
};

/**
 * The contact form.
 */

function AddStaffContactForm() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const routeParams = useParams();
	const { id: contactId } = routeParams;

	const {
		data: userDetail,
		isLoading: adminLoading,
		isError: adminIsError
	} = useSingleUser(contactId, {
		skip: !contactId
	});

	const updateUserInfo = useAdminUpdateUserDetailMutation();

	const { control, watch, reset, handleSubmit, getValues, formState } = useForm({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const form = watch();
	const [loading, setLoading] = useState(false);

	const { data: countries, isFetching } = useCountries();
	const { data: departments } = useGetDepartments();

	const [designationsList, setDesignationList] = useState([]);
	const [bstates, setBstates] = useState([]);
	const [blgas, setBlgas] = useState([]);
	const [lgasOffices, setLgasOffices] = useState([]);

	useEffect(() => {
		if (getValues()?.department) {
			getDesignationData();
		}

		if (getValues()?.countryorigin) {
			getStateDFromCountryId(getValues()?.countryorigin);
		}

		if (getValues()?.stateorigin) {
			getLgasFromState(getValues()?.stateorigin);
		}

		if (getValues()?.lgaorigin) {
			getOfficesFromLga(getValues()?.lgaorigin);
		}
	}, [getValues()?.department, getValues()?.countryorigin, getValues()?.stateorigin, getValues()?.lgaorigin]);

	/** 1) Get States from country IDs  */
	async function getStateDFromCountryId(pid) {
		setLoading(true);
		const responseData = await getStateByCountryId(pid);

		if (responseData) {
			setBstates(responseData?.data);
			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	/** 2) Get L.G.As from state_ID data */
	async function getLgasFromState(sid) {
		setLoading(true);
		const responseData = await getLgaByStateId(sid);

		if (responseData) {
			setBlgas(responseData?.data);
			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	/** 3) Get L.G.As from state_ID data */
	async function getOfficesFromLga(sid) {
		setLoading(true);
		const responseData = await getOfficeByLgaId(sid);

		if (responseData) {
			setLgasOffices(responseData?.data);
			setTimeout(function () {
				setLoading(false);
			}, 250);
		}
	}

	/** *4) Get desinations from department_ID */
	const getDesignationData = async () => {
		setLoading(true);
		try {
			if (getValues()?.department) {
				await getDesigByDepartmentId(getValues()?.department).then((response) => {
					setDesignationList(response.data);
				});
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		reset(userDetail?.data);
	}, [userDetail?.data, reset]);

	/**
	 * Form Submit
	 */

	// const onSubmit = useCallback(() => {
	//   recruitStaff.mutate(getValues());

	// }, [getValues()]);

	const onUpdate = useCallback(() => {
		updateUserInfo.mutate(getValues());
	}, [getValues()]);

	function handleRemoveAdmin() {}

	const background = watch('background');
	const name = watch('name');

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={background}
						alt="user background"
					/>
				)}
			</Box>

			<div className="relative flex flex-col flex-auto  px-24 sm:px-48">
				<div className="sm:col-span-2 text-sm">
					<Typography
						className="text-start mt-1 mb-[-20px]"
						style={{ fontSize: '12px', fontWeight: '800' }}
					>
						Country Location
					</Typography>
					<Controller
						control={control}
						name="countryorigin"
						className="mt-0.5"
						render={({ field }) => (
							<Select
								sx={{
									'& .MuiSelect-select': {
										minHeight: '0!important'
									}
								}}
								className="mt-16"
								{...field}
								id="countryorigin"
								label="Country of posting"
								placeholder="Country of posting"
								variant="outlined"
								fullWidth
								error={!!errors.countryorigin}
								helperText={errors?.countryorigin?.message}
							>
								<MenuItem value="">
									<em>Select a country</em>
								</MenuItem>

								{countries?.data?.data?.map((cnty, index) => (
									<MenuItem
										key={index}
										value={cnty._id}
									>
										{cnty.name}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</div>

				<div className="sm:col-span-2 text-sm">
					<Typography
						className="text-start mt-10  mb-[-30px]"
						style={{ fontSize: '12px', fontWeight: '800' }}
					>
						State Location
					</Typography>
					<Controller
						control={control}
						name="stateorigin"
						render={({ field }) => (
							<Select
								className="mt-32"
								{...field}
								id="stateorigin"
								label="State of posting"
								placeholder="State of posting"
								variant="outlined"
								fullWidth
								error={!!errors.stateorigin}
								helperText={errors?.stateorigin?.message}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>

								{bstates?.map((bsts, index) => (
									<MenuItem
										key={index}
										value={bsts._id}
									>
										{bsts.name}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</div>

				<div className="sm:col-span-2 text-sm">
					<Typography
						className="text-start mt-10  mb-[-30px]"
						style={{ fontSize: '12px', fontWeight: '800' }}
					>
						L.G.A|Country Location
					</Typography>
					<Controller
						control={control}
						name="lgaorigin"
						render={({ field }) => (
							<Select
								className="mt-32"
								{...field}
								id="lgaorigin"
								label="L.G.A of posting"
								placeholder="L.G.A of posting"
								variant="outlined"
								fullWidth
								error={!!errors.lgaorigin}
								helperText={errors?.lgaorigin?.message}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>

								{blgas?.map((blg, index) => (
									<MenuItem
										key={index}
										value={blg._id}
									>
										{blg.name}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</div>

				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Name"
							placeholder="Name"
							id="name"
							error={!!errors.name}
							helperText={errors?.name?.message}
							variant="outlined"
							required
							fullWidth
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

				<Typography
					className="text-start mt-10  mb-[-30px]"
					style={{ fontSize: '12px', fontWeight: '800' }}
				>
					Gender
				</Typography>
				<Controller
					control={control}
					name="gender"
					render={({ field }) => (
						<Select
							className="mt-32"
							{...field}
							id="gender"
							label="Gender"
							placeholder="Gender"
							variant="outlined"
							fullWidth
							error={!!errors.gender}
							helperText={errors?.gender?.message}
							value={getValues()?.gender}
						>
							<MenuItem value="">
								<em>Select a gender</em>
							</MenuItem>

							<MenuItem value="MALE">MALE</MenuItem>
							<MenuItem value="FEMALE">FEMALE</MenuItem>
						</Select>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Email"
							placeholder="Email"
							variant="outlined"
							fullWidth
							error={!!errors.email}
							helperText={errors?.email?.message}
							disabled
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

				<Controller
					control={control}
					name="birthday"
					render={({ field: { value, onChange } }) => (
						<DateTimePicker
							value={new Date(value)}
							onChange={(val) => {
								onChange(val?.toISOString());
							}}
							className="mt-32 mb-16 w-full"
							slotProps={{
								textField: {
									id: 'birthday',
									label: 'Birthday',
									InputLabelProps: {
										shrink: true
									},
									fullWidth: true,
									variant: 'outlined',
									error: !!errors.birthday,
									helperText: errors?.birthday?.message
								},
								actionBar: {
									actions: ['clear', 'today']
								}
							}}
							slots={{
								openPickerIcon: BirtdayIcon
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="phone"
					render={({ field }) => (
						<TextField
							{...field}
							label="Phone"
							placeholder="Phone"
							variant="outlined"
							fullWidth
							error={!!errors.phone}
							helperText={errors?.phone?.message}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="address"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Address"
							placeholder="Address"
							id="address"
							error={!!errors.address}
							helperText={errors?.address?.message}
							variant="outlined"
							fullWidth
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
			</div>
			<Box
				className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
				sx={{ backgroundColor: 'background.default' }}
			>
				<Button
					className="ml-auto"
					onClick={() => history.back()}
				>
					Cancel
				</Button>
				{/* {contactId === "new" && (
          <Button
            className="ml-8"
            variant="contained"
            color="secondary"
            disabled={
              _.isEmpty(dirtyFields) || !isValid || recruitStaff?.isLoading
            }
            onClick={handleSubmit(onSubmit)}
          >
            Recruit staff
          </Button>
        )} */}

				{contactId !== 'new' && (
					<Button
						className="ml-8"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || updateUserInfo?.isLoading}
						onClick={handleSubmit(onUpdate)}
					>
						update user
					</Button>
				)}
			</Box>
		</>
	);
}

export default AddStaffContactForm;
