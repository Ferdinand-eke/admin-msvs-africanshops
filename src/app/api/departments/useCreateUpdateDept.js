import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { createDepartment, getDepartment, getDepartmentsByPublished, updateDepartment } from './department';
import { createErrorHandler } from '../utils/errorHandler';

const queryClient = useQueryClient();

export const deptMutation = useMutation(
	(newDepartment) => {
		return createDepartment(newDepartment);
	},

	{
		onSuccess: (data) => {
			queryClient.invalidateQueries(['departments']);
			queryClient.refetchQueries('departments', { force: true });
		}
	},
	{
		onError: createErrorHandler({ defaultMessage: 'Failed to create department' })
	}
);

export const deptUpdateMutation = useMutation(
	(id, newDepartment) => {
		return updateDepartment(id, newDepartment);
	},

	{
		onSuccess: (data) => {
			queryClient.invalidateQueries(['departments']);
			queryClient.refetchQueries('departments', { force: true });
		}
	},
	{
		onError: createErrorHandler({ defaultMessage: 'Failed to update department' })
	}
);

export const useGetSingleDepartment = (deptId) => {
	return useQuery(['department', deptId], () => getDepartment(deptId), {
		enabled: Boolean(deptId),
		staleTime: 5000
	});
};

export const useDepartments = () => {
	return useQuery(['departments'], getDepartmentsByPublished);
};
