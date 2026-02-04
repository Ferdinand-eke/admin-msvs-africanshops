import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createDepartment, updateDepartment } from './newsposts';
import { createErrorHandler } from '../utils/errorHandler';

const queryClient = useQueryClient();

export const deptMutation = useMutation(
	(newDepartment) => {
		return createDepartment(newDepartment);
	},

	{
		onSuccess: (data) => {
			toast.success('post created!');
			queryClient.invalidateQueries(['departments']);
			queryClient.refetchQueries('departments', { force: true });
		}
	},
	{
		onError: createErrorHandler({ defaultMessage: 'Failed to create news post' })
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
		onError: createErrorHandler({ defaultMessage: 'Failed to update news post' })
	}
);
