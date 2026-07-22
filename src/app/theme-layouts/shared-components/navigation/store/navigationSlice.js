import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { selectUser, selectUserRole } from 'src/app/auth/user/store/userSlice';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import i18next from 'i18next';
import FuseNavItemModel from '@fuse/core/FuseNavigation/models/FuseNavItemModel';
import FuseUtils from '@fuse/utils';
import navigationConfig from 'app/configs/navigationConfig';
import { selectCurrentLanguageId } from 'app/store/i18nSlice';
import { rootReducer } from 'app/store/lazyLoadedSlices';

/**
 * Department/designation-based nav RBAC (2026-07-22). Returns either `null`
 * (no restriction — show everything FuseUtils.hasPermission would otherwise
 * allow) or an array of visible nav item ids.
 *
 * Deliberately fails OPEN at every "not configured yet" branch: super-admins,
 * admins with no department assigned, and departments/designations whose
 * allowedNavIds is still empty all see everything. This is a live admin
 * panel already in use — restriction only kicks in once someone explicitly
 * populates a department's or designation's allowedNavIds, so rolling this
 * out can't silently lock out any existing admin the way the
 * role.toString() === 'admin' bug just did.
 */
function computeVisibleNavIds(user) {
	if (user?.isSuperAdmin) {
		return null;
	}

	if (!user?.department) {
		return null;
	}

	const departmentNavIds = user?.departmentDetails?.allowedNavIds ?? [];

	if (departmentNavIds.length === 0) {
		return null;
	}

	if (!user?.designation) {
		// Department head — full access to everything tagged to the department
		return departmentNavIds;
	}

	const designationNavIds = user?.designationDetails?.allowedNavIds ?? [];

	if (designationNavIds.length === 0) {
		// Designation exists but hasn't been configured with screens yet —
		// fall back to the department's set rather than showing nothing.
		return departmentNavIds;
	}

	return designationNavIds.filter((id) => departmentNavIds.includes(id));
}

const navigationAdapter = createEntityAdapter();
const emptyInitialState = navigationAdapter.getInitialState([]);
const initialState = navigationAdapter.upsertMany(
	emptyInitialState,
	FuseNavigationHelper.flattenNavigation(navigationConfig)
);
/**
 * Redux Thunk actions related to the navigation store state
 */
/**
 * Appends a navigation item to the navigation store state.
 */
export const appendNavigationItem = (item, parentId) => async (dispatch, getState) => {
	const AppState = getState();
	const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(AppState));
	dispatch(setNavigation(FuseNavigationHelper.appendNavItem(navigation, FuseNavItemModel(item), parentId)));
	return Promise.resolve();
};
/**
 * Prepends a navigation item to the navigation store state.
 */
export const prependNavigationItem = (item, parentId) => async (dispatch, getState) => {
	const AppState = getState();
	const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(AppState));
	dispatch(setNavigation(FuseNavigationHelper.prependNavItem(navigation, FuseNavItemModel(item), parentId)));
	return Promise.resolve();
};
/**
 * Adds a navigation item to the navigation store state at the specified index.
 */
export const updateNavigationItem = (id, item) => async (dispatch, getState) => {
	const AppState = getState();
	const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(AppState));
	dispatch(setNavigation(FuseNavigationHelper.updateNavItem(navigation, id, item)));
	return Promise.resolve();
};
/**
 * Removes a navigation item from the navigation store state.
 */
export const removeNavigationItem = (id) => async (dispatch, getState) => {
	const AppState = getState();
	const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(AppState));
	dispatch(setNavigation(FuseNavigationHelper.removeNavItem(navigation, id)));
	return Promise.resolve();
};
export const {
	selectAll: selectNavigationAll,
	selectIds: selectNavigationIds,
	selectById: selectNavigationItemById
} = navigationAdapter.getSelectors((state) => state.navigation);
/**
 * The navigation slice
 */

export const navigationSlice = createSlice({
	name: 'navigation',
	initialState,
	reducers: {
		setNavigation(state, action) {
			return navigationAdapter.setAll(state, FuseNavigationHelper.flattenNavigation(action.payload));
		},
		resetNavigation: () => initialState
	}
});
/**
 * Lazy load
 * */

rootReducer.inject(navigationSlice);
navigationSlice.injectInto(rootReducer);
export const { setNavigation, resetNavigation } = navigationSlice.actions;
export const selectNavigation = createSelector(
	[selectNavigationAll, selectUserRole, selectCurrentLanguageId, selectUser],
	(navigationSimple, userRole, languageId, user) => {
		const navigation = FuseNavigationHelper.unflattenNavigation(navigationSimple);
		const visibleNavIds = computeVisibleNavIds(user);

		function setAdditionalData(data) {
			return data?.map((item) => {
				// Children first — a group with no `auth`/domain tag of its own
				// (every group in navigationConfig.js today) is shown if ANY of
				// its children are visible, not gated on its own id.
				const children = item?.children ? setAdditionalData(item?.children) : undefined;
				const ownAuthOk = Boolean(FuseUtils.hasPermission(item?.auth, userRole));
				const ownNavIdOk = visibleNavIds === null || visibleNavIds.includes(item?.id);
				const anyChildVisible = children ? children.some((child) => child.hasPermission) : false;

				return {
					hasPermission: ownAuthOk && (ownNavIdOk || anyChildVisible),
					...item,
					...(item?.translate && item?.title ? { title: i18next.t(`navigation:${item?.translate}`) } : {}),
					...(children ? { children } : {})
				};
			});
		}

		const translatedValues = setAdditionalData(navigation);
		return translatedValues;
	}
);
export const selectFlatNavigation = createSelector([selectNavigation], (navigation) => {
	return FuseNavigationHelper.flattenNavigation(navigation);
});
export default navigationSlice.reducer;
