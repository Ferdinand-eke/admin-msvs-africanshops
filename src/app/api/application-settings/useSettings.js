import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
	adminGetAllApplicationSettings,
	adminGetApplicationSettingById,
	adminCreateApplicationSetting,
	adminUpdateApplicationSetting,
	adminActivateApplicationSetting,
	adminDeleteApplicationSetting
} from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

/**
 * Hook to fetch all application settings
 * Returns settings for all platforms (ADMIN, MERCHANT, USER)
 */
export default function useApplicationSettings() {
	return useQuery(['application-settings'], adminGetAllApplicationSettings);
} /***Msvs => Done */

/**
 * Hook to fetch a single application setting by ID
 * @param {string} settingId - The ID of the setting to fetch
 */
export function useSingleApplicationSetting(settingId) {
	if (!settingId || settingId === 'new') {
		return '';
	}

	return useQuery(['application-setting', settingId], () => adminGetApplicationSettingById(settingId), {
		keepPreviousData: true,
		enabled: Boolean(settingId) && settingId !== 'new'
	});
}

/**
 * Hook to create a new application setting
 */
export function useCreateApplicationSetting() {
	const queryClient = useQueryClient();

	return useMutation(
		(newSetting) => {
			return adminCreateApplicationSetting(newSetting);
		},
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('Application setting created successfully!');
					queryClient.invalidateQueries(['application-settings']);
					queryClient.refetchQueries('application-settings', { force: true });
				}
			},
			onError: createErrorHandler({ defaultMessage: 'Failed to create application setting' })
		}
	);
} /***Msvs => Done */

/**
 * Hook to update an application setting
 */
export function useUpdateApplicationSetting() {
	const queryClient = useQueryClient();

	return useMutation(
		({ settingId, settingData }) => {
			return adminUpdateApplicationSetting(settingId, settingData);
		},
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('Application setting updated successfully!');
					queryClient.invalidateQueries(['application-settings']);
					queryClient.refetchQueries('application-settings', { force: true });
				}
			},
			onError: createErrorHandler({ defaultMessage: 'Failed to update application setting' })
		}
	);
}

/**
 * Hook to activate/deactivate an application setting
 */
export function useActivateApplicationSetting() {
	const queryClient = useQueryClient();

	return useMutation(
		(settingId) => {
			return adminActivateApplicationSetting(settingId);
		},
		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('Application setting status updated successfully!');
					queryClient.invalidateQueries(['application-settings']);
					queryClient.refetchQueries('application-settings', { force: true });
				}
			},
			onError: createErrorHandler({ defaultMessage: 'Failed to update application setting status' })
		}
	);
}

/**
 * Hook to delete an application setting
 */
export function useDeleteApplicationSetting() {
	const queryClient = useQueryClient();

	return useMutation(adminDeleteApplicationSetting, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success('Application setting deleted successfully!');
				queryClient.invalidateQueries('application-settings');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete application setting' })
	});
}
