import axios from 'axios';
import Cookies from 'js-cookie';

// const guestBaseDomain = import.meta.env.VITE_API_BASE_URL_PROD;  /**production & dev */
const guestBaseDomain = 'http://localhost:8000';
export const guestBaseUrl = `${guestBaseDomain}`;

const baseDomain = `${guestBaseDomain}/api`;
export const baseUrl = `${baseDomain}`;

export default function reqApi() {
	const Api = axios.create({
		withCredentials: true,
		baseURL: baseUrl,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});

	Api.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error?.response?.status === 403) {
				// error?.response?.status === 401 ||
				logOut();

				return Promise.reject({ status: 401, errors: ['Unauthorized'] });
			}

			if (error.response?.status === 422) {
				const errors = Object.values(error?.response?.data?.errors || {});

				return Promise.reject({
					status: 422,
					errorsRaw: errors,
					errors: errors.reduce((error) => error)
				});
			}

			console.error(error);

			return Promise.reject({
				status: error?.response?.status,
				errors: ['Oops!']
			});
		}
	);

	return Api;
}

export function guestSeqApi() {
	const Api = axios.create({
		withCredentials: true,
		baseURL: guestBaseUrl,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});

	Api.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error?.response?.status === 403) {
				// error?.response?.status === 401 ||
				logOut();

				return Promise.reject({ status: 401, errors: ['Unauthorized'] });
			}

			if (error.response?.status === 422) {
				const errors = Object.values(error?.response?.data?.errors || {});

				return Promise.reject({
					status: 422,
					errorsRaw: errors,
					errors: errors.reduce((error) => error)
				});
			}

			console.error(error);

			return Promise.reject({
				status: error?.response?.status,
				errors: ['Oops!']
			});
		}
	);

	return Api;
}

export function fristGuestSeqApi() {
	const Api = axios.create({
		baseURL: guestBaseUrl
	});

	return Api;
}

export const logOut = () => {
	if (typeof window !== 'undefined') {
		// remove logged in user's cookie and redirect to login page 'authUserCookie', state.user, 60 * 24
		try {
			reqApi()
				.post(`/logout`)
				.then((response) => {
					// alert('logged out successfully');
					console.log('logged out successfully');
				});

			window.location.reload(false);
		} catch (error) {
			console.log(error.response && error.response.data.message ? error.response.data.message : error.message);
		}

		Cookies.remove('authClientSellerInfo');
		// Cookies.remove('isloggedin');
	}
};
