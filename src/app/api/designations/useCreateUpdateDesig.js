import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDepartment, updateDepartment } from './designtaions';
import { toast } from 'react-toastify';

const queryClient = useQueryClient();

export const deptMutation = useMutation(
  (newDepartment) => {
    return createDepartment(newDepartment);
  },

  {
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      queryClient.refetchQueries('departments', { force: true });
    },
  },
  {
    onError: (err, values, rollback) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      rollback();
    },
  }
);

export const deptUpdateMutation = useMutation(
  (id, newDepartment) => {r
    return updateDepartment(id, newDepartment);
  },

  {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['departments']);
      queryClient.refetchQueries('departments', { force: true });
    },
  },
  {
    onError: (err, values, rollback) => {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      rollback();
    },
  }
);
