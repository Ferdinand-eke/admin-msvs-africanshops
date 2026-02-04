import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import { createMarket, deleteMarketById, getMarketById, getMarkets, updateMarketById } from '../apiRoutes';

export default function useMarkets() {
	return useQuery(['__markets'], getMarkets);
} // (Msvs => Done)

// Paginated hook for Markets
export function useMarketsPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
	const offset = page * limit;

	return useQuery(
		['markets_paginated', { page, limit, search, filters }],
		() =>
			getMarkets({
				limit,
				offset,
				search,
				...filters
			}),
		{
			keepPreviousData: true,
			staleTime: 30000
		}
	);
}

// get single market
export function useSingleMarket(marketId) {
	if (!marketId || marketId === 'new') {
		return '';
	}

	return useQuery(['__marketById', marketId], () => getMarketById(marketId), {
		enabled: Boolean(marketId)
		// staleTime: 2000,
	});
} // (Msvs => Done)

// create new  market
export function useAddMarketMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newMarket) => {
			return createMarket(newMarket);
		},

		{
			onSuccess: (data) => {
				if (data?.data) {
					toast.success('market  added successfully!');
					queryClient.invalidateQueries(['__markets']);
					queryClient.refetchQueries('__markets', { force: true });
					navigate('/markets/list');
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create market' })
		}
	);
}

// update new market
export function useMarketUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateMarketById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('market  updated successfully!!');
				queryClient.invalidateQueries('__markets');
				navigate('/markets/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update market' })
	});
} // (Msvs => Done)

/** *Delete market-category  */
export function useDeleteMarket() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteMarketById, {
		onSuccess: (data) => {
			if (data?.data && data?.data?.success) {
				toast.success('market deleted successfully!!');
				queryClient.invalidateQueries('__markets');
				navigate('/markets/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete market' })
	});
}
