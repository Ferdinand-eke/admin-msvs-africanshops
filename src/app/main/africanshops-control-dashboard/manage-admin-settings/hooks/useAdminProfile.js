import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAdminProfile, updateAdminSocialMedia } from 'src/app/api/apiRoutes';

/**
 * Hook to fetch admin profile data
 */
export function useAdminProfile() {
	return useQuery(
		['adminProfile'],
		async () => {
			const response = await getAdminProfile();
			return response.data;
		},
		{
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			retry: 2
		}
	);
}

/**
 * Hook to update admin social media handles
 */
export function useUpdateAdminSocialMedia() {
	const queryClient = useQueryClient();

	return useMutation(
		async (socialMediaData) => {
			const response = await updateAdminSocialMedia(socialMediaData);
			return response.data;
		},
		{
			onSuccess: () => {
				// Invalidate and refetch profile data
				queryClient.invalidateQueries(['adminProfile']);
			}
		}
	);
}
