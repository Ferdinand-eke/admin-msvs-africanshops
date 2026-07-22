/**
 * Single source of truth for turning a raw backend admin record (from either
 * the login response or the /authadmin/profile response — both return the
 * same adminusers shape, password stripped) into the shape the rest of this
 * app consumes (Redux `user` slice + FuseAuthorization's `userRole`).
 *
 * Before this existed, admin-auth.js and JwtAuthProvider.jsx each built this
 * object independently and both hardcoded `role: 'admin'`, silently
 * discarding the real `permissions`/`isSuperAdmin`/`scopeType`/`geoLevel`/
 * `geoRefId`/`civicService`/`civicOrgId` fields the backend has sent on every
 * admin record since the Phase 2A/2B RBAC rollout (apps/auth-service/prisma
 * schema.prisma `adminusers` model). That meant every admin was treated as
 * identical regardless of real permission grants — this function is the fix.
 *
 * `role` stays an ARRAY (FuseUtils.hasPermission supports array userRole,
 * checking for any overlap with a route's declared `auth` array) so every
 * existing route config that checks for 'admin' keeps working unchanged —
 * this only ADDS finer-grained tags on top, never removes the baseline.
 *
 * 2026-07-22: also carries through `departmentDetails`/`designationDetails`
 * (backend now attaches the full department/designation records, not just
 * their raw ids — see auth-service authadmin-service.service.ts
 * attachDepartmentAndDesignation()). These drive per-department/per-civic-
 * vertical/per-designation nav visibility — see
 * navigationSlice.js's selectNavigation.
 */
export function transformAdminUser(rawAdmin) {
	const role = ['admin'];

	if (rawAdmin?.isSuperAdmin) {
		role.push('super-admin');
	}

	if (rawAdmin?.scopeType === 'GEO_ASSET') {
		role.push('geo-asset');
	}

	if (rawAdmin?.scopeType === 'CIVIC_OPERATOR') {
		role.push('civic-operator');
	}

	return {
		id: rawAdmin?._id ?? rawAdmin?.id,
		name: rawAdmin?.name,
		email: rawAdmin?.email,
		avatar: rawAdmin?.avatar,
		isAdmin: rawAdmin?.isAdmin,
		role,

		// Real permission data, kept available beyond just the role array so
		// screens can do finer checks than route-level gating allows (e.g.
		// "only render the Assign Scope button for isSuperAdmin").
		isSuperAdmin: rawAdmin?.isSuperAdmin ?? false,
		permissions: rawAdmin?.permissions ?? [],
		scopeType: rawAdmin?.scopeType ?? 'PLATFORM_STAFF',
		geoLevel: rawAdmin?.geoLevel ?? null,
		geoRefId: rawAdmin?.geoRefId ?? null,
		civicService: rawAdmin?.civicService ?? null,
		civicOrgId: rawAdmin?.civicOrgId ?? null,

		// Department/designation-based nav RBAC (2026-07-22)
		department: rawAdmin?.department ?? null,
		designation: rawAdmin?.designation ?? null,
		departmentDetails: rawAdmin?.departmentDetails
			? {
					id: rawAdmin.departmentDetails.id,
					key: rawAdmin.departmentDetails.key,
					name: rawAdmin.departmentDetails.name,
					domainType: rawAdmin.departmentDetails.domainType ?? 'BUSINESS',
					civicVertical: rawAdmin.departmentDetails.civicVertical ?? null,
					allowedNavIds: rawAdmin.departmentDetails.allowedNavIds ?? []
				}
			: null,
		designationDetails: rawAdmin?.designationDetails
			? {
					id: rawAdmin.designationDetails.id,
					name: rawAdmin.designationDetails.name,
					department: rawAdmin.designationDetails.department,
					allowedNavIds: rawAdmin.designationDetails.allowedNavIds ?? []
				}
			: null
	};
}
