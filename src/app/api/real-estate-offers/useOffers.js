import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { adminGetAllOffers, adminManageOffer, adminDeleteOffer } from '../apiRoutes';

// Get all offers with pagination
export default function useAdminOffers(params = {}) {
	const { limit, offset, propertyId, status } = params;

	return useQuery(
		['__offers', { limit, offset, propertyId, status }],
		() => adminGetAllOffers({ limit, offset, propertyId, status }),
		{
			keepPreviousData: true
		}
	);
}

// Manage offer (accept, decline, counter)
export function useManageOffer() {
	const queryClient = useQueryClient();

	return useMutation(({ offerId, action, data }) => adminManageOffer(offerId, action, data), {
		onSuccess: (data, variables) => {
			if (data?.data?.success) {
				const actionText =
					variables.action === 'accept'
						? 'accepted'
						: variables.action === 'decline'
							? 'declined'
							: 'countered';
				toast.success(data?.data?.message || `Offer ${actionText} successfully!`, {
					position: 'top-left'
				});
				queryClient.invalidateQueries(['__offers']);
			}
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}

// Delete offer
export function useDeleteOffer() {
	const queryClient = useQueryClient();

	return useMutation((offerId) => adminDeleteOffer(offerId), {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success(data?.data?.message || 'Offer deleted successfully!', {
					position: 'top-left'
				});
				queryClient.invalidateQueries(['__offers']);
			}
		},
		onError: (err) => {
			toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
		}
	});
}
