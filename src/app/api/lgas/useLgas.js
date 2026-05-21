import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createErrorHandler } from '../utils/errorHandler';
import {
	createBLga,
	createLgaShippingTable,
	deleteLgaById,
	deleteLgaShippingTableById,
	getBLgas,
	getLgaById,
	getLgasByStateAdmin,
	getLgaShippingTableRecord,
	getLgasWithShippingTable,
	updateLgaById,
	updateLgaShippingTableById
} from '../apiRoutes';

export default function useLgas(params = {}) {
	return useQuery(['lgas', params], () => getBLgas(params), {
		keepPreviousData: true,
		staleTime: 30000
	});
}

// Paginated hook for LGAs
export function useLgasPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
	const offset = page * limit;

	return useQuery(
		['lgas_paginated', { page, limit, search, filters }],
		() =>
			getBLgas({
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

// get single lga
export function useSingleLga(lgaId) {
	if (!lgaId || lgaId === 'new') {
		return {};
	}

	return useQuery(['lgas', lgaId], () => getLgaById(lgaId), {
		enabled: Boolean(lgaId)
		// staleTime: 5000,
	});
}

// create new lga
export function useAddLgaMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newLga) => {
			return createBLga(newLga);
		},

		{
			onSuccess: (data) => {
				if (data?.data) {
					toast.success('L.G.A added successfully!');
					queryClient.invalidateQueries(['lgas']);
					queryClient.refetchQueries('lgas', { force: true });
					navigate('/administrations/lgas');
				}
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to create LGA' })
		}
	);
}

// update existing L.G.A
export function useLgaUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(updateLgaById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('L.G.A updated successfully!!');
				queryClient.invalidateQueries('lgas');
				queryClient.refetchQueries('lgas', { force: true });
				navigate('/administrations/lgas');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to update LGA' })
	});
}

export function useLgasByState(stateId, { limit = 20, offset = 0 } = {}) {
	return useQuery(
		['lgas_by_state', stateId, { limit, offset }],
		() => getLgasByStateAdmin({ stateId, limit, offset }),
		{
			enabled: Boolean(stateId) && stateId !== 'new',
			keepPreviousData: true,
			staleTime: 30000
		}
	);
}

/** *Delete L.G.A/County */
export function useDeleteSingleLGA() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteLgaById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('L.G.A deleted successfully!!');
				queryClient.invalidateQueries('__countries');
				navigate('/administrations/lgas');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete LGA' })
	});
}

/** ***
 * #####################################################################
 * HANDLE LGA SHIPPING-ROUTES-TABLE STARTS
 * #####################################################################
 */

export function useLgasWithShippingTable(stateId) {
	return useQuery(
		['__lgas_shippingtables', stateId],
		() => getLgasWithShippingTable(stateId),
		{
			enabled: Boolean(stateId),
			staleTime: 30000
		}
	);
}

export function useLgaFullRecord(lgaId) {
	return useQuery(['lga_full', lgaId], () => getLgaShippingTableRecord(lgaId), {
		enabled: Boolean(lgaId) && lgaId !== 'new',
		staleTime: 30000
	});
}

function handleLgaShippingError(error, defaultMessage) {
	if (!error?.validationErrors) {
		createErrorHandler({ defaultMessage })(error);
	}
}

export function useLgaAddShippingTableMutation() {
	const queryClient = useQueryClient();

	return useMutation(createLgaShippingTable, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('LGA shipping route added successfully!');
				queryClient.invalidateQueries(['lga_full']);
				queryClient.invalidateQueries('__lgas_shippingtables');
			}
		},
		onError: (error) => handleLgaShippingError(error, 'Failed to add LGA shipping route')
	});
}

export function useLgaUpdateShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(updateLgaShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('LGA shipping route updated successfully!');
				queryClient.invalidateQueries(['lga_full']);
				queryClient.invalidateQueries('__lgas_shippingtables');
			}
		},
		onError: (error) => handleLgaShippingError(error, 'Failed to update LGA shipping route')
	});
}

export function useLgaDeleteShippingMutation() {
	const queryClient = useQueryClient();

	return useMutation(deleteLgaShippingTableById, {
		onSuccess: (data) => {
			if (data?.data?.success) {
				toast.success('LGA shipping route removed successfully!');
				queryClient.invalidateQueries(['lga_full']);
				queryClient.invalidateQueries('__lgas_shippingtables');
			}
		},
		onError: (error) => handleLgaShippingError(error, 'Failed to delete LGA shipping route')
	});
}

/** ***
 * #####################################################################
 * HANDLE LGA SHIPPING-ROUTES-TABLE ENDS
 * #####################################################################
 */
