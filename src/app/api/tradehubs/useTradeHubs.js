import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import { createTradehub, deleteTradehubById, getTradehubById, getTradehubs, updateTradehubById } from '../apiRoutes';

export default function useHubs() {
	return useQuery(['tradeHubs'], getTradehubs);
} // (Msvs => Done)

// get single traade hub
export function useSingleHub(hubId) {
	if (!hubId || hubId === 'new') {
		return {};
	}

	return useQuery(['tradeHubs', hubId], () => getTradehubById(hubId), {
		enabled: Boolean(hubId)
		// staleTime: 5000,
	});
} // (Msvs => Done)

// create new trade hub
export function useAddHubMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newTradehub) => {
			return createTradehub(newTradehub);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('trade hub added successfully!');
					queryClient.invalidateQueries(['tradeHubs']);
					queryClient.refetchQueries('tradeHubs', { force: true });
					navigate('/tradehubs/list');
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create trade hub' })
		}
	);
}

// update existing trade hub
export function useHubUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateTradehubById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('traded hub updated successfully!!');

				queryClient.invalidateQueries('tradeHubs');
				queryClient.refetchQueries('tradeHubs', { force: true });

				navigate('/tradehubs/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update trade hub' })
	});
} // (Msvs => Done)

// delet an exiting trade hub
export function useDeleteHubMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteTradehubById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('traded hub deleted successfully!!');

				queryClient.invalidateQueries('tradeHubs');
				navigate('/tradehubs/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete trade hub' })
	});
}
