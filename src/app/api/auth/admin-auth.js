import { useMutation } from 'react-query';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';
import config from '../../auth/services/jwt/jwtAuthConfig';
import { adminSigin } from '../apiRoutes';

export function useAdminLogin() {
	return useMutation(adminSigin, {
		onSuccess: (data) => {
			if (data?.data?.user && data?.data?.accessToken) {
				// console.log("ADMIN_LOGIN_DATA@@__TOKEN", data?.data?.accessToken)

				// console.log("ADMIN_LOGIN_DATA@@@__USER", data?.data?.user)
				// return
				/** ============================================================================== */

				const transFormedUser = {
					id: data?.data?.user._id,
					name: data?.data?.user.name,
					email: data?.data?.user.email,
					role: 'admin',

					isAdmin: data?.data?.user.isAdmin,
					avatar: data?.data?.user.avatar
				};

				if (isTokenValid(data?.data?.accessToken)) {
					console.log('TOKEN__CHECK___2', data?.data?.accessToken);
					localStorage.setItem(config.isAuthenticatedStatus, true);
				} else {
					localStorage.setItem(config.isAuthenticatedStatus, false);
					toast.error('login failed, token not authorized');
					return;
				}

				/** *Set token to headers starts */
				let isSetAuthorizers = false;
				localStorage.setItem(config.tokenStorageKey, data?.data?.accessToken);
				axios.defaults.headers.common.accessToken = `${data?.data?.accessToken}`;
				isSetAuthorizers = true;
				/** *Set token to headers ends */

				if (isSetAuthorizers && transFormedUser) {
					setUserCredentialsStorage(transFormedUser);
				}
			} else if (data) {
				Array.isArray(data?.data?.message)
					? data?.data?.message?.map((m) => toast.error(m.message))
					: toast.error(data?.data?.message);
			} else {
				toast.info('something unexpected happened');
			}
		},
		onError: (error) => {
			console.log('LoginError22Block', error);

			const {
				response: { data }
			} = error ?? {};
			Array.isArray(data?.message) ? data?.message?.map((m) => toast.error(m)) : toast.error(data?.message);
		}
	});
}

const isTokenValid = (accessToken) => {
	if (accessToken) {
		try {
			const decoded = jwtDecode(accessToken);
			// console.log("DECODED Token-DATA", decoded)
			// console.log('DATE_NOW', Date.now())
			const currentTime = Date.now() / 1000;
			console.log('EXP__2', decoded.exp);

			console.log('CURR__3', currentTime);
			console.log('IS__HIGHER', Boolean(decoded.exp > currentTime));
			return decoded.exp > currentTime;
		} catch (error) {
			return false;
		}
	}
};

// const setUserCredentialsStorage = (userCredentials) => {
//   Cookie.set(config.adminCredentials, JSON.stringify({ userCredentials }));
// };
// localStorage.setItem(config.authStatus, "authenticated");//jwt_is_authStatus

const setUserCredentialsStorage = (userCredentials) => {
	const setUserCookie = Cookie.set(config.adminCredentials, JSON.stringify({ userCredentials }));

	if (setUserCookie) {
		window.location.reload();
	}
};
