import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNewAdminInvitationAcceptance } from 'src/app/api/admin-users/useAdmins';
import useJwtAuth from '../useJwtAuth';
/**
 * Form Validation Schema
 */
const schema = z
	.object({
		// email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
		activationCode: z
			.string()
			.min(4, 'Password is too short - must be at least 4 chars.')
			.nonempty('You must enter an activation code'),
		password: z
			.string()
			.min(4, 'Password is too short - must be at least 4 chars.')
			.nonempty('Please enter your password.'),
		passwordConfirm: z.string().nonempty('Password confirmation is required')
		// acceptTermsConditions: z.boolean().refine((val) => val === true, 'The terms and conditions must be accepted.'),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});
const defaultValues = {
	// email: '',
	activationCode: '',
	preuser: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false
	// remember: true
};

function JwtSignAcceptInviteForm() {
	const acceptInvite = useNewAdminInvitationAcceptance();
	const routeParams = useParams();
	const { token } = routeParams;
	const { signIn } = useJwtAuth();
	const { control, formState, handleSubmit, setValue, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(formData) {
		const formDataWithUpdatedTokenParam = {
			...formData,
			preuser: token
		};

		console.log('ACCEPT-INVITE-Values', formDataWithUpdatedTokenParam);
		// return
		acceptInvite.mutate(formDataWithUpdatedTokenParam);
	}

	// useEffect(() => {
	//   if (acceptInvite.isError) {
	//     toast.error(acceptInvite.error)
	//   }
	// }, [acceptInvite.isError]);
	return (
		<form
			name="loginForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="activationCode"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Activation Code"
						autoFocus
						type="name"
						error={!!errors.activationCode}
						helperText={errors?.activationCode?.message}
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
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="passwordConfirm"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Password (Confirm)"
						type="password"
						error={!!errors.passwordConfirm}
						helperText={errors?.passwordConfirm?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Button
				variant="contained"
				color="secondary"
				className=" mt-16 w-full"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid || acceptInvite.isLoading}
				type="submit"
				size="large"
			>
				Accept Invite
			</Button>
		</form>
	);
}

export default JwtSignAcceptInviteForm;
