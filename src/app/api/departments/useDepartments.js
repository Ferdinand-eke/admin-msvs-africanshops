import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createErrorHandler } from '../utils/errorHandler';
import { createDepartMent, deleteDepartmentById, getDeptById, getDepts, updateDeptById } from '../apiRoutes';

export const useGetDepartments = () => {
	return useQuery('getDepartmentsQuery', getDepts);
}; // (Msvs => Done)

// Paginated hook for Departments
export function useDepartmentsPaginated({ page = 0, limit = 20, search = '', filters = {} }) {
	const offset = page * limit;

	return useQuery(
		['departments_paginated', { page, limit, search, filters }],
		() =>
			getDepts({
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

/** *Get department by ID */
export function useGetDepartmentById(deptId) {
	if (!deptId || deptId === 'new') {
		return '';
	}

	return useQuery(['getDepartmentsQuery', deptId], () => getDeptById(deptId), {
		keepPreviousData: true, // Keeps previous data while fetching new data
		enabled: Boolean(deptId) && deptId !== 'new' // Only fetch when we have a valid deptId
	});
} // (Msvs => Done)

// creating new Department
export function useAddDeptMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(createDepartMent, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success('Departent added successfully!');
				queryClient.invalidateQueries('getDepartmentsQuery');
				navigate('/departments/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to create department' })
	});
}

// updating existing department
export function useUpdateDepartmentMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation(
		(designation) => {
			return updateDeptById(designation);
		},

		{
			onSuccess: (data) => {
				console.log('department-Update-success', data);

				// if (data) {
				if (data?.data?.success) {
					toast.success('Departent updated successfully!');
					queryClient.invalidateQueries(['getDepartmentsQuery']);
					queryClient.refetchQueries('getDepartmentsQuery', { force: true });
					navigate('/departments/list');
				}
				// }
			}
		},
		{
			onError: createErrorHandler({ defaultMessage: 'Failed to update department' })
		}
	);
}

/** *Delete a department */
export function useDeleteSingleDepartment() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation(deleteDepartmentById, {
		onSuccess: (data) => {
			if (data?.data) {
				toast.success(`${data?.data?.message ? data?.data?.message : 'Department deleted successfully!'}`);
				queryClient.invalidateQueries('departments_paginated');
				navigate('/departments/list');
			}
		},
		onError: createErrorHandler({ defaultMessage: 'Failed to delete department' })
	});
}
