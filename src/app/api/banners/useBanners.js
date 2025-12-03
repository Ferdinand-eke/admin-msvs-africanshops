import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { getBanners, getApiBannerById, updateBannerById, createBanner } from '../apiRoutes';

export default function useAdminBanners() {
	return useQuery(['__adminBanners'], getBanners);
}

// get single banner
export function useSingleBanner(bannerId) {
	return useQuery(['__BannerById', bannerId], () => getApiBannerById(bannerId), {
		enabled: Boolean(bannerId)
		// staleTime: 5000,
	});
}

// create new banner
export function useAddBannerMutation() {
	const queryClient = useQueryClient();
	return useMutation(
		(newBanner) => {
			return createBanner(newBanner);
		},

		{
			onSuccess: (data) => {
				if (data) {
					toast.success('Banner  added successfully!');
					queryClient.invalidateQueries(['__adminBanners']);
					queryClient.refetchQueries('__adminBanners', { force: true });
				}
			}
		},
		{
			onError: (error, values, rollback) => {
				toast.error(
					error.response && error.response.data.message ? error.response.data.message : error.message
				);
				rollback();
			}
		}
	);
}

// update existing banner
export function useBannerUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateBannerById, {
		onSuccess: (data) => {
			toast.success('Banner  updated successfully!!');
			queryClient.invalidateQueries('__adminBanners');
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}
