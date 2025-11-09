import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAdminReferralLinks, generateAdminReferralLinks } from 'src/app/api/apiRoutes';

/**
 * Hook to fetch admin referral links
 */
export function useReferralLinks() {
	return useQuery(['adminReferralLinks'], async () => {
		const response = await getAdminReferralLinks();
		return response.data;
	}, {
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 10 * 60 * 1000, // 10 minutes
		retry: 2
	});
}

/**
 * Hook to generate new admin referral links
 */
export function useGenerateReferralLinks() {
	const queryClient = useQueryClient();

	return useMutation(
		async () => {
			const response = await generateAdminReferralLinks();
			return response.data;
		},
		{
			onSuccess: () => {
				// Invalidate and refetch referral links data
				queryClient.invalidateQueries(['adminReferralLinks']);
			}
		}
	);
}
