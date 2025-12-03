import homesServerConfig from '../configServerRoutes/homesServerConfig';

export const setUserForgotPassCreedStorage = (userForgotPassCredentialsTk) => {
	localStorage.setItem(homesServerConfig.studentForgotPassTk, userForgotPassCredentialsTk);
};

export const getForgotPassToken = () => {
	return localStorage.getItem(homesServerConfig.studentForgotPassTk);
};

export const resetForgotPassToken = () => {
	return localStorage.removeItem(homesServerConfig.studentForgotPassTk);
};

/** **LOGGING OUT AN ADMIN USER */
export const logOutAdminUser = () => {
	return localStorage.removeItem(homesServerConfig.studentForgotPassTk);
};

/** **
 * UNBOARDING AND HANDLING USER STORAGES createNewUserTk
 */

export function setCreateNewUserAccount(userActivationToken) {
	localStorage.setItem(homesServerConfig.createNewUserTk, userActivationToken);

	// Cookie.set(homesServerConfig.createNewUserTk, JSON.stringify(userActivationToken))
}

export const getNewUserAccountToken = () => {
	return localStorage.getItem(homesServerConfig.createNewUserTk);

	// return Cookie.get(homesServerConfig.createNewUserTk);
};

/** ***
 * AFRICANSHOPS ADMIN CONFIG USTIS
 *
 */

/** **Fuse AFS-admin For Users Starts */
export const getAdminAccessToken = () => {
	// return localStorage.getItem(jwtAuthConfig.tokenStorageKey);
	return localStorage.getItem('jwt_access_token');
};

export const resetSessionForAdminUsers = () => {
	localStorage.removeItem('jwt_auth_credentials');
	// delete axios.defaults.headers.common.Authorization;
	// delete axios.defaults.headers.common.accessToken;
	localStorage.removeItem('jwt_is_authenticated_status');
	localStorage.removeItem('jwt_is_authStatus');
	// localStorage.removeItem('jwt_auth_credentials');
};

/** **Fuse AFS-admin For Users ends */
