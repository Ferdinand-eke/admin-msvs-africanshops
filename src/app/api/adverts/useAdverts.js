import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createAd, getAdById, getAds, updateAdById } from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

export default function useAdvertisements() {
	return useQuery(['__adverts'], getAds);
}

// get single product category
export function useSingleAdvert(adsId) {
	return useQuery(['advertsById', adsId], () => getAdById(adsId), {
		enabled: Boolean(adsId)
		// staleTime: 5000,
	});
}

// create new advert
export function useAddAdvertMutation() {
	const queryClient = useQueryClient();
	return useMutation(
		(newAdverts) => {
			return createAd(newAdverts);
		},

		{
			onSuccess: (data) => {
				if (data) {
					toast.success('advert added successfully!');
					queryClient.invalidateQueries(['__adverts']);
					queryClient.refetchQueries('__adverts', { force: true });
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create advert' })
		}
	);
}

// update new advert
export function useAdvertUpdateMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateAdById, {
		onSuccess: (data) => {
			toast.success('advert updated successfully!!');
			queryClient.invalidateQueries('__adverts');
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update advert' })
	});
}
