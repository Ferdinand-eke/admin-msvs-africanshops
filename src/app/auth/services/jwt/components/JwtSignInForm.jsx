import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import useJwtAuth from '../useJwtAuth';
import { useAdminLogin } from 'src/app/api/auth/admin-auth';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.')
});
const defaultValues = {
	email: '',
	password: '',
	remember: true,
	
};

function JwtSignInForm() {

	const { signIn, isLoginLoading } = useJwtAuth();
	const { control, formState, handleSubmit, setValue, setError, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		// resolver: zodResolver(schema)
	});
	const [showPassword, setShowPassword] = useState(false) 
	// const {showPassword} = getValues()
	const { isValid, dirtyFields, errors } = formState;


	function onSubmit(formData) {
		const { email, password } = formData;
		signIn({
			email,
			password
		}).catch((error) => {
			console.log('FormJSXError', error)
			toast.error(error?.message)
		});
	}


	const toggleShowPassword = () =>{
		setShowPassword(!showPassword)
	}
	return (
		<form
			name="loginForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Email"
						autoFocus
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (

					<TextField
						{...field}
						className="mb-24"
						label="Password"
						type={showPassword ? "text" : "password"}
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">
								<IconButton
								onClick={() => toggleShowPassword()}
								>

									{showPassword ? <VisibilityOff/> : <Visibility/>}
								</IconButton>
								</InputAdornment>
						}}
					/>
				)}
			/>

			{/* <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>

				<Link
					className="text-md font-medium"
					to="/pages/auth/forgot-password"
				>
					Forgot password?
				</Link>
			</div> */}

			<Button
				variant="contained"
				color="secondary"
				className=" mt-16 w-full"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid || isLoginLoading
				
				 }
				type="submit"
				size="large"
			>
				{isLoginLoading ? "processing..." : "Sign in"}
				{/* Sign in */}
			</Button>
		</form>
	);
}

export default JwtSignInForm;
