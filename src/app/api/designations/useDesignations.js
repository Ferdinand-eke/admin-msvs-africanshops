import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { createDesignation, deleteDesignationById, getDesigById, getDesigs, updateDesigById } from '../apiRoutes';
import { createErrorHandler } from '../utils/errorHandler';

// get all designations
export default function useDesignations() {
	return useQuery(['designations'], getDesigs);
} // (Msvs => Done)

// Paginated hook for Designations
export function useDesignationsPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
	const offset = page * limit;

	return useQuery(
		['designations_paginated', { page, limit, search, filters }],
		() =>
			getDesigs({
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

// get single designation
export function useSingleDesignation(desigId) {
	if (!desigId || desigId === 'new') {
		return '';
	}

	return useQuery(['designation', desigId], () => getDesigById(desigId), {
		keepPreviousData: true, // Keeps previous data while fetching new data
		enabled: Boolean(desigId) && desigId !== 'new' // Only fetch when we have a valid deptId
	});
} // (Msvs => Done)

/** *****create new designation */
export function useDesigtMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(newDesignation) => {
			return createDesignation(newDesignation);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('Designation added successfully!');
					queryClient.invalidateQueries(['designations']);
					queryClient.refetchQueries('designations', { force: true });
					navigate('/designations/list');
				}
			},
			onError: createErrorHandler({ defaultMessage: 'Failed to create designation' })
		}
	);
}

/** *****update new designation */
export function useDesigUpdateMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(designation) => {
			return updateDesigById(designation);
		},

		{
			onSuccess: (data) => {
				if (data?.data?.success) {
					toast.success('Designation updated successfully!');
					queryClient.invalidateQueries(['designations']);
					queryClient.refetchQueries('designations', { force: true });
					navigate('/designations/list');
				}
			},
			onError: createErrorHandler({ defaultMessage: 'Failed to update designation' })
		}
	);
} // (Msvs => Done)

/** *Delete a desigation */
export function useDeleteDesignation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteDesignationById, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success('designation deleted successfully!!');
				queryClient.invalidateQueries('designations');
				navigate('/designations/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete designation' })
	});
}
