/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
const authRoles = {
	/**
	 * The admin role grants access to users with the 'admin' role.
	 */
	admin: ['admin'],
	/**
	 * Super-admin only — for actions the backend itself gates as super-admin-only
	 * (e.g. assign-geo-scope, assign-civic-scope; see docs/identity/2b-admin-scope-design.md
	 * in the microservices repo). Real signal now: transformAdminUser() (src/app/auth/
	 * transformAdminUser.js) reads the actual `isSuperAdmin` field the backend returns
	 * on login/profile, not a guess — every admin used to be treated identically here.
	 */
	superAdmin: ['super-admin'],
	/**
	 * The staff role grants access to users with the 'admin' or 'staff' role.
	 */
	staff: ['admin', 'staff'],
	/**
	 * The user role grants access to users with the 'admin', 'staff', or 'user' role.
	 */
	user: ['admin', 'staff', 'user'],
	/**
	 * The onlyGuest role grants access to unauthenticated users.
	 */
	onlyGuest: []
};
export default authRoles;
