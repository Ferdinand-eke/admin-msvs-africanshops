// const baseUrl = "https://coral-app-n8ox9.ondigitalocean.app"; //deployed serve
// const baseUrl ="http://localhost:8000";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD; /** production & dev */

const jwtAuthConfig = {
	tokenStorageKey: 'jwt_access_token',
	signInUrl: 'mock-api/auth/sign-in',
	signUpUrl: 'mock-api/auth/sign-up',
	tokenRefreshUrl: 'mock-api/auth/refresh',
	getUserUrl: 'mock-api/auth/user',
	updateUserUrl: 'mock-api/auth/user',
	updateTokenFromHeader: true,

	/** ****Bravort Admin Dashboard Controls API */
	signInBravortAdminUrl: `${baseUrl}/authadmin/adminlogin`,
	// Was '/authadmin/get-auth-admin' — no such gateway route exists (the real
	// profile route is '/authadmin/profile', returning { success, message, admin }).
	// Fixed 2026-07-22; this path is currently only reached by JwtAuthProvider's
	// attemptAutoLogin effect, which itself only re-runs while isAuthenticated is
	// falsy — i.e. it still won't refresh an already-logged-in session's stale
	// cached role/scope data. That's a separate, bigger auth-flow change, flagged
	// but not made here.
	getAuthAdminInBravortAdminUrl: `${baseUrl}/authadmin/profile`,
	isAuthenticatedStatus: 'jwt_is_authenticated_status',
	authStatus: 'jwt_is_authStatus',
	adminCredentials: 'jwt_auth_credentials'
};
export default jwtAuthConfig;
