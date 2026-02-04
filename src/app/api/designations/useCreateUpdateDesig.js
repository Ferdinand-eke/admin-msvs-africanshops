import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createDepartment, updateDepartment } from './designtaions';
import { createErrorHandler } from '../utils/errorHandler';

const queryClient = useQueryClient();

export const deptMutation = useMutation(
	(newDepartment) => {
		return createDepartment(newDepartment);
	},

	{
		onSuccess: () => {
			queryClient.invalidateQueries(['departments']);
			queryClient.refetchQueries('departments', { force: true });
		}
	},
	{
		onError: createErrorHandler({ defaultMessage: 'Failed to create designation' })
	}
);

export const deptUpdateMutation = useMutation(
	(id, newDepartment) => {
		r;
		return updateDepartment(id, newDepartment);
	},

	{
		onSuccess: (data) => {
			queryClient.invalidateQueries(['departments']);
			queryClient.refetchQueries('departments', { force: true });
		}
	},
	{
		onError: createErrorHandler({ defaultMessage: 'Failed to update designation' })
	}
);
