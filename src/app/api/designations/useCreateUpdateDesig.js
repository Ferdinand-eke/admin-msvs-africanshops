import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDepartment, updateDepartment } from './designtaions';

const queryClient = useQueryClient();

export const deptMutation = useMutation(
  (newDepartment) => {
    console.log('Run: ', newDepartment);
    return createDepartment(newDepartment);
  },

  {
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      queryClient.refetchQueries('departments', { force: true });
    },
  },
  {
    onError: (error, values, rollback) => {
      console.log('MutationError', error.response.data);
      rollback();
    },
  }
);

export const deptUpdateMutation = useMutation(
  (id, newDepartment) => {
    // console.log('Run Update: ', newDepartment);
    return updateDepartment(id, newDepartment);
  },

  {
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      queryClient.refetchQueries('departments', { force: true });
    },
  },
  {
    onError: (error, values, rollback) => {
      console.log('MutationError', error.response.data);
      rollback();
    },
  }
);
