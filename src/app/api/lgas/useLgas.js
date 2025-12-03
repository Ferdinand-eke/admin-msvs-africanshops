import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createBLga, deleteLgaById, getBLgas, getLgaById, updateLgaById } from '../apiRoutes';

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
			onError: (error, values, rollback) => {
				toast.error(
					error.response && error.response.data.message ? error.response.data.message : error.message
				);
				rollback();
			}
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
		onError: (error, rollback) => {
			toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
			rollback();
		}
	});
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
		onError: () => {
			toast.success(error.response && error.response.data.message ? error.response.data.message : error.message);
		}
	});
}
