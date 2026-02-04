import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import {
	createMarketCategory,
	deleteMarketCategoryById,
	getMarketCategories,
	getMarketCategoryById,
	getMarketWarehouseCategories,
	updateMarketCategoryById
} from '../apiRoutes';

export default function useMarketCats() {
	return useQuery(['__marketcats'], getMarketCategories);
} // (Msvs => Done)

// Paginated hook for Market Categories
export function useMarketCategoriesPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
	const offset = page * limit;

	return useQuery(
		['marketcats_paginated', { page, limit, search, filters }],
		() =>
			getMarketCategories({
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

// get single market category
export function useSingleMarketCategory(marketCatId) {
	if (!marketCatId || marketCatId === 'new') {
		return '';
	}

	return useQuery(['__marketCategoryById', marketCatId], () => getMarketCategoryById(marketCatId), {
		enabled: Boolean(marketCatId)
		// staleTime: 2000,
	});
} // (Msvs => Done)

// create new  market category
export function useAddMarketCategoryMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newMarketCategory) => {
			return createMarketCategory(newMarketCategory);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('market category added successfully!');
					queryClient.invalidateQueries(['__marketcats']);
					queryClient.refetchQueries('__marketcats', { force: true });
					navigate('/market-categories/list');
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create market category' })
		}
	);
} // (Msvs => Done)

// update new market category
export function useMarketCategoryUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateMarketCategoryById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('market category updated successfully!!');
				queryClient.invalidateQueries('__marketcats');
				navigate('/market-categories/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update market category' })
	});
} // (Msvs => Done)

/** *Delete market-category  */
export function useDeleteMarketCategory() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteMarketCategoryById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('market category deleted successfully!!');
				queryClient.invalidateQueries('__offices');
				navigate('/market-categories/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete market category' })
	});
} // (Msvs => Done)

/** *
 * Warehouse links
 */
export function useMarketWarehouseCats() {
	return useQuery(['__marketwarehousecats'], getMarketWarehouseCategories);
}
